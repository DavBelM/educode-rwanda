"""
Preprocess FixJS dataset → JSONL instruction-response pairs for Qwen2.5-7B fine-tuning.

Usage:
    python ml/notebooks/preprocess_fixjs.py

Output:
    ml/data/processed/train.jsonl
    ml/data/processed/val.jsonl
"""

import json
import os
import random
from pathlib import Path

FIXJS_DIR = Path("ml/data/fixjs")
KINYARWANDA_DIR = Path("ml/data/kinyarwanda")
OUTPUT_DIR = Path("ml/data/processed")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

SYSTEM_PROMPT = (
    "You are EduCode AI, a coding assistant for Rwandan TVET students learning JavaScript. "
    "You explain errors clearly, provide corrected code, and give a brief explanation of what was wrong. "
    "Keep answers concise and educational."
)

INSTRUCTION_TEMPLATES = [
    "Fix the following JavaScript code:\n\n```javascript\n{buggy}\n```",
    "The following JavaScript code has a bug. Identify and fix it:\n\n```javascript\n{buggy}\n```",
    "A student wrote this JavaScript code but it has an error. Correct it:\n\n```javascript\n{buggy}\n```",
    "What is wrong with this JavaScript code? Provide the corrected version:\n\n```javascript\n{buggy}\n```",
]

RESPONSE_TEMPLATE = "```javascript\n{fixed}\n```"


def load_fixjs_pairs(fixjs_dir: Path) -> list[dict]:
    """Load buggy/fixed pairs from FixJS dataset structure."""
    pairs = []

    # FixJS stores pairs in subdirectories: each has a buggy.js and fixed.js
    # Walk the directory and collect matching pairs
    for root, dirs, files in os.walk(fixjs_dir):
        root_path = Path(root)
        buggy_file = root_path / "buggy.js"
        fixed_file = root_path / "fixed.js"

        if buggy_file.exists() and fixed_file.exists():
            try:
                buggy = buggy_file.read_text(encoding="utf-8", errors="ignore").strip()
                fixed = fixed_file.read_text(encoding="utf-8", errors="ignore").strip()

                # Skip trivial / empty pairs
                if len(buggy) < 10 or len(fixed) < 10:
                    continue
                # Skip very large files (> 4000 chars) — too long for training
                if len(buggy) > 4000 or len(fixed) > 4000:
                    continue

                pairs.append({"buggy": buggy, "fixed": fixed})
            except Exception as e:
                print(f"  Skipping {root}: {e}")

    return pairs


def load_kinyarwanda_docs(kin_dir: Path) -> list[dict]:
    """
    Load Kinyarwanda concept Q&A pairs.
    Expected format: one JSON file per concept with {"question": "...", "answer": "..."} entries.
    """
    pairs = []
    if not kin_dir.exists():
        return pairs

    for f in kin_dir.glob("*.json"):
        try:
            data = json.loads(f.read_text(encoding="utf-8"))
            if isinstance(data, list):
                for item in data:
                    if "question" in item and "answer" in item:
                        pairs.append(item)
        except Exception as e:
            print(f"  Skipping {f}: {e}")

    return pairs


def make_fixjs_sample(pair: dict) -> dict:
    template = random.choice(INSTRUCTION_TEMPLATES)
    instruction = template.format(buggy=pair["buggy"])
    response = RESPONSE_TEMPLATE.format(fixed=pair["fixed"])
    return {
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": instruction},
            {"role": "assistant", "content": response},
        ]
    }


def make_kinyarwanda_sample(pair: dict) -> dict:
    return {
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": pair["question"]},
            {"role": "assistant", "content": pair["answer"]},
        ]
    }


def write_jsonl(samples: list[dict], path: Path):
    with open(path, "w", encoding="utf-8") as f:
        for s in samples:
            f.write(json.dumps(s, ensure_ascii=False) + "\n")
    print(f"  Wrote {len(samples):,} samples → {path}")


def main():
    print("Loading FixJS pairs...")
    fixjs_pairs = load_fixjs_pairs(FIXJS_DIR)
    print(f"  Found {len(fixjs_pairs):,} FixJS pairs")

    print("Loading Kinyarwanda docs...")
    kin_pairs = load_kinyarwanda_docs(KINYARWANDA_DIR)
    print(f"  Found {len(kin_pairs):,} Kinyarwanda Q&A pairs")

    if not fixjs_pairs and not kin_pairs:
        print("\nNo data found. Make sure you have:")
        print("  - FixJS cloned at ml/data/fixjs/")
        print("  - Kinyarwanda docs at ml/data/kinyarwanda/*.json")
        return

    # Build samples
    samples = []
    for p in fixjs_pairs:
        samples.append(make_fixjs_sample(p))
    for p in kin_pairs:
        samples.append(make_kinyarwanda_sample(p))

    # Shuffle and split 90/10 train/val
    random.seed(42)
    random.shuffle(samples)
    split = int(len(samples) * 0.9)
    train, val = samples[:split], samples[split:]

    print(f"\nTotal samples: {len(samples):,}  →  train: {len(train):,}  val: {len(val):,}")
    write_jsonl(train, OUTPUT_DIR / "train.jsonl")
    write_jsonl(val, OUTPUT_DIR / "val.jsonl")
    print("\nDone! Upload ml/data/processed/ to Kaggle as a dataset before running the training notebook.")


if __name__ == "__main__":
    main()
