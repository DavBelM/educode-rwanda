"""
Generate synthetic off-by-one bug examples (top-up batch) for EduCode Rwanda.

This script generates ADDITIONAL off-by-one examples to supplement the existing
synthetic_off_by_one.jsonl dataset. Output goes to synthetic_off_by_one_topup.jsonl
and will be merged with the main dataset during preprocessing.

Run as a Kaggle notebook cell. Requires a Kaggle Secret named GEMINI_API_KEY.

Output:
  ml/data/synthetic/synthetic_off_by_one_topup.jsonl
  ml/data/synthetic/raw_responses/off_by_one_topup_batch_NN_raw.json
  ml/data/synthetic/raw_responses/off_by_one_topup_rejections.jsonl
"""

import json
import os
import re
import random
import hashlib
import subprocess
import tempfile
import time
from collections import Counter


def _shell(cmd: str):
    try:
        get_ipython().system(cmd)
    except NameError:
        subprocess.run(cmd, shell=True, check=False)


_shell("pip install -q google-generativeai google-genai")
from pathlib import Path

random.seed(42)

# ── Config ──────────────────────────────────────────────────────────────────
TARGET_COUNT = 60
BATCH_SIZE   = 10
CATEGORY     = "off_by_one"        # JSON field — base category name

OUTPUT_DIR = Path("ml/data/synthetic")
RAW_DIR    = OUTPUT_DIR / "raw_responses"
RAW_DIR.mkdir(parents=True, exist_ok=True)

OUTPUT_PATH     = OUTPUT_DIR / "synthetic_off_by_one_topup.jsonl"
REJECTIONS_PATH = RAW_DIR   / "off_by_one_topup_rejections.jsonl"

SUBCATEGORIES = [
    "loop_fence_post_lte",    # i <= arr.length goes one past end → undefined access or extra iteration (runtime, valid syntax)
    "zero_indexed_access",    # arr[1] to get first element, arr[arr.length] for last → off-by-one (runtime, valid syntax)
    "slice_end_exclusive",    # misunderstanding that slice(start, end) excludes end index (runtime, valid syntax)
    "length_vs_last_index",   # str[str.length] is undefined; last char is str[str.length - 1] (runtime, valid syntax)
    "loop_starts_at_one",     # for (let i = 1; ...) accidentally skips the first element (runtime, valid syntax)
]

# All bugs are runtime — buggy code passes node --check.
SYNTAX_ERROR_SUBCATS = set()

EXPLANATION_STYLE_TARGET = {"direct": 0.7, "socratic": 0.3}

MODEL_CANDIDATES = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"]

PRICING_PER_1M = {
    "input":  0.10,
    "output": 0.40,
}


# ── Kaggle secret ─────────────────────────────────────────────────────────────
from kaggle_secrets import UserSecretsClient
GEMINI_API_KEY = UserSecretsClient().get_secret("GEMINI_API_KEY")


# ── Response schema ───────────────────────────────────────────────────────────
RESPONSE_SCHEMA = {
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "buggy":             {"type": "string"},
            "fixed":             {"type": "string"},
            "category":          {"type": "string", "enum": [CATEGORY]},
            "subcategory":       {"type": "string", "enum": SUBCATEGORIES},
            "explanation":       {"type": "string"},
            "explanation_style": {"type": "string", "enum": ["direct", "socratic"]},
        },
        "required": ["buggy", "fixed", "category", "subcategory", "explanation", "explanation_style"],
    },
}


def _uppercase_types(schema):
    if isinstance(schema, dict):
        out = {}
        for k, v in schema.items():
            if k == "type" and isinstance(v, str):
                out[k] = v.upper()
            else:
                out[k] = _uppercase_types(v)
        return out
    if isinstance(schema, list):
        return [_uppercase_types(v) for v in schema]
    return schema


class GeminiClient:
    def __init__(self, api_key: str, model_candidates: list[str]):
        self.backend    = None
        self.model_name = None

        try:
            import google.generativeai as genai
            genai.configure(api_key=api_key)
            available = {m.name.split("/")[-1] for m in genai.list_models()}
            for cand in model_candidates:
                if cand in available:
                    self.model_name = cand
                    break
            if self.model_name is None:
                raise RuntimeError(f"None of {model_candidates} available via google-generativeai")
            self._genai  = genai
            self._model  = genai.GenerativeModel(self.model_name)
            self.backend = "google-generativeai"
            print(f"[GeminiClient] Using google-generativeai with model={self.model_name}")
            return
        except Exception as e:
            print(f"[GeminiClient] google-generativeai unavailable/failed ({e}); trying google-genai...")

        from google import genai as genai2
        from google.genai import types as genai_types
        client    = genai2.Client(api_key=api_key)
        available = {m.name.split("/")[-1] for m in client.models.list()}
        for cand in model_candidates:
            if cand in available:
                self.model_name = cand
                break
        if self.model_name is None:
            raise RuntimeError(f"None of {model_candidates} available via google-genai")
        self._client  = client
        self._types   = genai_types
        self.backend  = "google-genai"
        print(f"[GeminiClient] Using google-genai with model={self.model_name}")

    def generate(self, prompt: str):
        if self.backend == "google-generativeai":
            schema   = _uppercase_types(RESPONSE_SCHEMA)
            response = self._model.generate_content(
                prompt,
                generation_config=self._genai.GenerationConfig(
                    response_mime_type="application/json",
                    response_schema=schema,
                ),
            )
        else:
            response = self._client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=self._types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=RESPONSE_SCHEMA,
                ),
            )
        text  = response.text
        usage = {
            "prompt_tokens":  response.usage_metadata.prompt_token_count,
            "output_tokens":  response.usage_metadata.candidates_token_count,
            "total_tokens":   response.usage_metadata.total_token_count,
        }
        parsed = json.loads(text)
        return parsed, usage, text


class QuotaExceededError(Exception):
    pass


def call_with_retry(client: GeminiClient, prompt: str, max_retries: int = 5):
    for attempt in range(max_retries):
        try:
            return client.generate(prompt)
        except Exception as e:
            msg      = str(e).lower()
            is_daily = any(s in msg for s in ["perday", "per day", "daily", "generaterequestsperdayperprojectpermodel"])
            if ("429" in msg or "resource_exhausted" in msg or "quota" in msg) and is_daily:
                raise QuotaExceededError(str(e)) from e
            transient = any(s in msg for s in ["429", "resource", "rate", "503", "500", "timeout", "deadline"])
            if not transient or attempt == max_retries - 1:
                raise
            sleep_s = 2 ** (attempt + 1)
            print(f"  [retry] transient error ({e}); sleeping {sleep_s}s (attempt {attempt + 1}/{max_retries})")
            time.sleep(sleep_s)


# ── JS syntax checking via node --check ───────────────────────────────────────
def js_is_valid(code: str) -> bool:
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False) as f:
        f.write(code)
        path = f.name
    try:
        result = subprocess.run(["node", "--check", path], capture_output=True, text=True, timeout=10)
        return result.returncode == 0
    finally:
        os.unlink(path)


try:
    subprocess.run(["node", "--version"], capture_output=True, check=True)
except Exception:
    _shell("apt-get update -qq && apt-get install -y -qq nodejs")


# ── Load existing examples ────────────────────────────────────────────────────
existing = []
if OUTPUT_PATH.exists():
    with open(OUTPUT_PATH) as f:
        existing = [json.loads(line) for line in f if line.strip()]

seen_hashes    = set()
subcat_counts  = Counter()
style_counts   = Counter()
used_var_names = set()


def normalize_hash(code: str) -> str:
    return hashlib.sha1(re.sub(r"\s+", " ", code).strip().encode()).hexdigest()


def extract_var_name(code: str) -> str | None:
    m = re.search(r"(?:const|let|var)\s+([A-Za-z_$][\w$]*)", code)
    return m.group(1) if m else None


for ex in existing:
    seen_hashes.add(normalize_hash(ex["buggy"]))
    subcat_counts[ex["subcategory"]] += 1
    style_counts[ex["explanation_style"]] += 1
    name = extract_var_name(ex["buggy"])
    if name:
        used_var_names.add(name)

print(f"Loaded {len(existing)} existing topup examples.")
print(f"  Subcategory counts: {dict(subcat_counts)}")
print(f"  Style counts: {dict(style_counts)}")


# ── Slot assignment ───────────────────────────────────────────────────────────
def assign_slots(n: int) -> list[tuple[str, str]]:
    slots        = []
    local_subcat = Counter(subcat_counts)
    local_style  = Counter(style_counts)

    for _ in range(n):
        subcat = min(SUBCATEGORIES, key=lambda s: local_subcat[s])
        local_subcat[subcat] += 1

        total_styles = sum(local_style.values()) + 1
        direct_share = local_style["direct"] / total_styles if total_styles else 0
        style        = "socratic" if direct_share > EXPLANATION_STYLE_TARGET["direct"] else "direct"
        local_style[style] += 1

        slots.append((subcat, style))

    return slots


# ── Validation ────────────────────────────────────────────────────────────────
def validate_example(ex: dict) -> tuple[bool, list[str]]:
    reasons = []

    for key in ["buggy", "fixed", "category", "subcategory", "explanation", "explanation_style"]:
        if not ex.get(key):
            reasons.append(f"missing/empty field: {key}")
    if reasons:
        return False, reasons

    if ex["category"] != CATEGORY:
        reasons.append(f"category mismatch: {ex['category']}")
    if ex["subcategory"] not in SUBCATEGORIES:
        reasons.append(f"unknown subcategory: {ex['subcategory']}")
    if ex["explanation_style"] not in ("direct", "socratic"):
        reasons.append(f"unknown explanation_style: {ex['explanation_style']}")
    if not (50 <= len(ex["explanation"]) <= 800):
        reasons.append(f"explanation length out of range: {len(ex['explanation'])}")
    if ex["buggy"] == ex["fixed"]:
        reasons.append("buggy == fixed")

    if not js_is_valid(ex["fixed"]):
        reasons.append("fixed code fails node --check")

    buggy_ok = js_is_valid(ex["buggy"])
    if ex["subcategory"] in SYNTAX_ERROR_SUBCATS:
        if buggy_ok:
            reasons.append("buggy code parses fine, but subcategory expects a SyntaxError")
    else:
        if not buggy_ok:
            reasons.append("buggy code fails node --check (subcategory doesn't expect a SyntaxError)")

    if normalize_hash(ex["buggy"]) in seen_hashes:
        reasons.append("duplicate (matches an already-accepted example)")

    return (len(reasons) == 0), reasons


# ── Prompt ────────────────────────────────────────────────────────────────────
PROMPT_BASE = r"""You are helping create training data for an AI tutor that helps Rwandan TVET secondary-school students (Level 3, ages 16-18) learn JavaScript. The tutor gives clear, encouraging, beginner-appropriate feedback when students make common coding mistakes.

Your task: Generate realistic examples of off-by-one errors that beginner JavaScript students make when working with arrays, strings, and loops. Each example must show the buggy code, the fixed code, and a clear pedagogical explanation.

Subcategory assignment: Each example must demonstrate exactly the assigned subcategory:

- loop_fence_post_lte — the student writes i <= arr.length as the loop condition instead of i < arr.length. Because array indices go from 0 to arr.length - 1, using <= causes one extra iteration where i equals arr.length. At that index, arr[i] is undefined, often producing a runtime error or undefined output. Both buggy and fixed code are syntactically valid. This is a runtime bug.
- zero_indexed_access — the student accesses arr[1] to get the first element, or arr[arr.length] to get the last element, forgetting that JavaScript arrays are zero-indexed (first element is arr[0], last is arr[arr.length - 1]). The result is either the wrong element or undefined. Both buggy and fixed code are syntactically valid. This is a runtime bug.
- slice_end_exclusive — the student misunderstands that the end index of .slice(start, end) is exclusive (not included). They write .slice(0, 3) expecting 3 elements at indices 0, 1, 2, 3 — but .slice(0, 3) only returns indices 0, 1, 2. Or they write .slice(0, arr.length - 1) intending to include the last element, but this excludes it. Both buggy and fixed code are syntactically valid. This is a runtime bug.
- length_vs_last_index — the student tries to access the last character of a string or last element of an array using str[str.length] or arr[arr.length]. Because indexing is zero-based, the last item is at index length - 1, not length. str[str.length] is always undefined. Both buggy and fixed code are syntactically valid. This is a runtime bug.
- loop_starts_at_one — the student writes for (let i = 1; i < arr.length; i++) starting the loop at index 1 instead of 0, accidentally skipping the first element. This is often because they are thinking of 1-based counting (the first item is "item 1"). The result is that the first element is never processed. Both buggy and fixed code are syntactically valid. This is a runtime bug.

Explanation style: About 70% of examples should use a direct style (clearly explain the bug and fix). About 30% should be Socratic — ask a guiding question that leads the student to discover the issue themselves. For Socratic examples, the fixed field still contains the correct code; only the explanation is a question.

Quality requirements:

- Each example must be a complete, self-contained snippet between 5 and 18 lines.
- Use realistic beginner arrays and strings: a list of student names, a list of scores, a list of subjects, a course name string, a greeting message.
- Backtick rule (critical): any string containing ${...} interpolation must use backticks, never single or double quotes.
- Vary the array/string names and scenarios across examples. Do not reuse variable names from earlier batches.
- Explanations must be concrete. State the actual wrong index value and the correct one.
- For Socratic explanations: ask a question that makes the student think about the specific index. Good: "If an array has 4 elements, what indices exist — does index 4 exist? What happens when you try to access it?" Bad: "Did you use the wrong index?"
- Each example must be self-contained.

Special notes:
- For loop_fence_post_lte: show the extra undefined element appearing in the output, not just "it runs one too many times". The console.log inside the loop must make the undefined visible.
- For zero_indexed_access: pick either the first-element case (arr[1]) or the last-element case (arr[arr.length]), not both in the same example. Make the wrong element or undefined clearly visible.
- For slice_end_exclusive: always include a comment or console.log that shows how many elements were actually returned vs how many the student expected.
- For length_vs_last_index: the undefined must be shown by printing or using the value, not just accessing it silently.
- For loop_starts_at_one: show the first element being skipped — e.g. log all processed elements and the first one is missing from the output.

Two examples of the expected shape and quality:

{
  "buggy": "const names = ['Aline', 'Jean', 'Eric', 'Marie'];\nfor (let i = 0; i <= names.length; i++) {\n  console.log(`Student ${i + 1}: ${names[i]}`);\n}",
  "fixed": "const names = ['Aline', 'Jean', 'Eric', 'Marie'];\nfor (let i = 0; i < names.length; i++) {\n  console.log(`Student ${i + 1}: ${names[i]}`);\n}",
  "category": "off_by_one",
  "subcategory": "loop_fence_post_lte",
  "explanation": "Array indices in JavaScript run from 0 to length - 1. For a 4-element array, valid indices are 0, 1, 2, 3. When you write i <= names.length, the loop runs one extra time with i === 4. names[4] does not exist, so it is undefined — and the last line prints 'Student 5: undefined'. Change <= to < so the loop stops before reaching the out-of-bounds index.",
  "explanation_style": "direct"
}

{
  "buggy": "const subjects = ['Math', 'English', 'Science', 'ICT'];\nconst lastSubject = subjects[subjects.length];\nconsole.log(`Last subject: ${lastSubject}`);",
  "fixed": "const subjects = ['Math', 'English', 'Science', 'ICT'];\nconst lastSubject = subjects[subjects.length - 1];\nconsole.log(`Last subject: ${lastSubject}`);",
  "category": "off_by_one",
  "subcategory": "length_vs_last_index",
  "explanation": "This array has 4 elements and subjects.length is 4. But array indices start at 0, so the four elements are at indices 0, 1, 2, and 3. Index 4 does not exist — subjects[4] is undefined. The last element is always at index length - 1, which is subjects[3] here. Use subjects[subjects.length - 1] to get 'ICT'.",
  "explanation_style": "direct"
}

For THIS batch, generate exactly {batch_size} examples. The subcategory and explanation_style for each, IN ORDER, must be:
{slot_assignments}

Do not reuse any of these variable names from earlier batches:
{exclusion_list}
"""


# ── Main generation loop ──────────────────────────────────────────────────────
client               = GeminiClient(GEMINI_API_KEY, MODEL_CANDIDATES)
accepted_total       = len(existing)
batch_num            = 0
total_usage          = Counter()
all_rejections       = []
stopped_early_reason = None

with open(OUTPUT_PATH, "a", encoding="utf-8") as out_fh, \
     open(REJECTIONS_PATH, "a", encoding="utf-8") as rej_fh:

    while accepted_total < TARGET_COUNT:
        batch_num += 1
        remaining = TARGET_COUNT - accepted_total
        n         = min(BATCH_SIZE, remaining)

        slots      = assign_slots(n)
        slot_lines = "\n".join(
            f"  {i + 1}. subcategory={subcat}, explanation_style={style}"
            for i, (subcat, style) in enumerate(slots)
        )
        exclusion_list = ", ".join(sorted(used_var_names)) or "(none yet)"

        prompt = (
            PROMPT_BASE
            .replace("{batch_size}",       str(n))
            .replace("{slot_assignments}", slot_lines)
            .replace("{exclusion_list}",   exclusion_list)
        )

        print(f"\n=== Batch {batch_num}: requesting {n} examples (accepted so far: {accepted_total}) ===")
        try:
            parsed, usage, raw_text = call_with_retry(client, prompt)
        except QuotaExceededError as e:
            print(f"\n  [quota] Daily quota exhausted: {e}")
            print(f"  Stopping cleanly — {accepted_total} examples saved so far are safe on disk.")
            stopped_early_reason = "daily_quota_exceeded"
            break

        for k, v in usage.items():
            total_usage[k] += v
        print(f"  Token usage: {usage}")

        raw_path = RAW_DIR / f"off_by_one_topup_batch_{batch_num:02d}_raw.json"
        raw_path.write_text(raw_text)

        n_accepted_this_batch = 0
        for idx, ex in enumerate(parsed):
            ok, reasons = validate_example(ex)
            if ok:
                out_fh.write(json.dumps(ex, ensure_ascii=False) + "\n")
                out_fh.flush()
                os.fsync(out_fh.fileno())
                seen_hashes.add(normalize_hash(ex["buggy"]))
                subcat_counts[ex["subcategory"]] += 1
                style_counts[ex["explanation_style"]] += 1
                name = extract_var_name(ex["buggy"]) or extract_var_name(ex["fixed"])
                if name:
                    used_var_names.add(name)
                accepted_total        += 1
                n_accepted_this_batch += 1
            else:
                rec = {"batch": batch_num, "index": idx, "reasons": reasons, "example": ex}
                rej_fh.write(json.dumps(rec, ensure_ascii=False) + "\n")
                rej_fh.flush()
                os.fsync(rej_fh.fileno())
                all_rejections.append(rec)

        print(f"  Accepted {n_accepted_this_batch}/{len(parsed)} from this batch (cumulative: {accepted_total}/{TARGET_COUNT}).")
        time.sleep(4)

        if n_accepted_this_batch == 0 and batch_num > (TARGET_COUNT // BATCH_SIZE) * 3:
            print("  No progress after several extra batches — stopping early.")
            stopped_early_reason = "no_progress"
            break


# ── Summary ───────────────────────────────────────────────────────────────────
print("\n" + "=" * 60)
print("SUMMARY")
print("=" * 60)
print(f"Model used:        {client.model_name} ({client.backend})")
print(f"Total accepted:    {accepted_total} (target {TARGET_COUNT})")
print(f"Total rejected:    {len(all_rejections)}")
if stopped_early_reason:
    print(f"Stopped early:     {stopped_early_reason}")
    if stopped_early_reason == "daily_quota_exceeded":
        print(f"  -> {TARGET_COUNT - accepted_total} examples remain. Re-run tomorrow — resumes from saved file.")

rejection_reason_counts = Counter()
for r in all_rejections:
    for reason in r["reasons"]:
        rejection_reason_counts[reason] += 1
print("Rejection reasons:")
for reason, count in rejection_reason_counts.most_common():
    print(f"  {count:3d}  {reason}")

print("\nSubcategory distribution (cumulative):")
for s in SUBCATEGORIES:
    print(f"  {s:35s}: {subcat_counts[s]}")

print("\nExplanation style distribution (cumulative):")
for s, c in style_counts.items():
    print(f"  {s:10s}: {c}")

print(f"\nToken usage this run: {dict(total_usage)}")
cost = (
    total_usage["prompt_tokens"] / 1e6 * PRICING_PER_1M["input"]
    + total_usage["output_tokens"] / 1e6 * PRICING_PER_1M["output"]
)
print(f"Estimated cost this run: ${cost:.4f}  (verify pricing at ai.google.dev/pricing)")
print(f"\nOutput: {OUTPUT_PATH}")
print(f"Raw responses: {RAW_DIR}/")
print(f"Rejections log: {REJECTIONS_PATH}")
