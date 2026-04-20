"""
Preprocess FixJS dataset → JSONL instruction-response pairs for Qwen2.5-7B fine-tuning.

FixJS structure:
  input/
    50/          (fixes in files ≤ 50 lines)
    50-100/      (fixes in files 50-100 lines)
    100+/        (fixes in files > 100 lines)
      before/    (buggy JS files, named <hash>_<line>_<n>.js)
      after/     (fixed JS files, same filenames)

Usage:
    cd /home/mitali/EduCode
    python ml/notebooks/preprocess_fixjs.py

Output:
    ml/data/processed/train.jsonl
    ml/data/processed/val.jsonl
"""

import json
import os
import random
from pathlib import Path

FIXJS_INPUT = Path("ml/data/fixjs/input")
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


def load_fixjs_pairs() -> list[dict]:
    """
    Load buggy/fixed pairs from FixJS input directory.
    Matches files in before/ with same-named files in after/.
    """
    pairs = []
    size_buckets = ["50", "50-100", "100+"]

    for bucket in size_buckets:
        before_dir = FIXJS_INPUT / bucket / "before"
        after_dir = FIXJS_INPUT / bucket / "after"

        if not before_dir.exists() or not after_dir.exists():
            print(f"  Skipping bucket '{bucket}' — before/after dirs not found")
            continue

        before_files = set(os.listdir(before_dir))
        after_files = set(os.listdir(after_dir))
        matched = before_files & after_files  # only files present in both

        print(f"  Bucket '{bucket}': {len(matched):,} matched pairs")

        for filename in matched:
            try:
                buggy = (before_dir / filename).read_text(encoding="utf-8", errors="ignore").strip()
                fixed = (after_dir / filename).read_text(encoding="utf-8", errors="ignore").strip()

                # Skip trivial / identical pairs
                if len(buggy) < 10 or len(fixed) < 10:
                    continue
                if buggy == fixed:
                    continue
                # Skip very large snippets — too long for a 1024-token context
                if len(buggy) > 3000 or len(fixed) > 3000:
                    continue

                pairs.append({"buggy": buggy, "fixed": fixed})
            except Exception as e:
                print(f"    Skipping {filename}: {e}")

    return pairs


def load_kinyarwanda_docs() -> list[dict]:
    """
    Load Kinyarwanda concept Q&A pairs.
    Expected format: JSON files with list of {"question": "...", "answer": "..."} objects.
    """
    pairs = []
    if not KINYARWANDA_DIR.exists():
        return pairs

    for f in KINYARWANDA_DIR.glob("*.json"):
        try:
            data = json.loads(f.read_text(encoding="utf-8"))
            if isinstance(data, list):
                for item in data:
                    if "question" in item and "answer" in item:
                        pairs.append(item)
        except Exception as e:
            print(f"  Skipping {f.name}: {e}")

    return pairs


def make_fixjs_sample(pair: dict) -> dict:
    template = random.choice(INSTRUCTION_TEMPLATES)
    return {
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": template.format(buggy=pair["buggy"])},
            {"role": "assistant", "content": RESPONSE_TEMPLATE.format(fixed=pair["fixed"])},
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
    fixjs_pairs = load_fixjs_pairs()
    print(f"  Total usable FixJS pairs: {len(fixjs_pairs):,}")

    print("\nLoading Kinyarwanda docs...")
    kin_pairs = load_kinyarwanda_docs()
    print(f"  Total Kinyarwanda Q&A pairs: {len(kin_pairs):,}")

    if not fixjs_pairs and not kin_pairs:
        print("\nNo data found. Check that ml/data/fixjs/ is cloned correctly.")
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

    print(f"\nTotal samples : {len(samples):,}")
    print(f"Train         : {len(train):,}")
    print(f"Val           : {len(val):,}")
    print()
    write_jsonl(train, OUTPUT_DIR / "train.jsonl")
    write_jsonl(val, OUTPUT_DIR / "val.jsonl")
    print("\nDone! Upload ml/data/processed/ to Kaggle as a dataset before running the training notebook.")


if __name__ == "__main__":
    main()
