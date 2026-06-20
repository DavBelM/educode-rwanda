"""
Generate synthetic operator bug examples (top-up batch) for EduCode Rwanda.

This script generates ADDITIONAL operator examples to supplement the existing
synthetic_operators.jsonl dataset. Output goes to synthetic_operator_topup.jsonl
and will be merged with the main dataset during preprocessing.

Run as a Kaggle notebook cell. Requires a Kaggle Secret named GEMINI_API_KEY.

Output:
  ml/data/synthetic/synthetic_operator_topup.jsonl
  ml/data/synthetic/raw_responses/operator_topup_batch_NN_raw.json
  ml/data/synthetic/raw_responses/operator_topup_rejections.jsonl
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
TARGET_COUNT = 70
BATCH_SIZE   = 10
CATEGORY     = "operators"         # JSON field — base category name

OUTPUT_DIR = Path("ml/data/synthetic")
RAW_DIR    = OUTPUT_DIR / "raw_responses"
RAW_DIR.mkdir(parents=True, exist_ok=True)

OUTPUT_PATH     = OUTPUT_DIR / "synthetic_operator_topup.jsonl"
REJECTIONS_PATH = RAW_DIR   / "operator_topup_rejections.jsonl"

SUBCATEGORIES = [
    "string_number_plus_coercion",   # '10' + 5 → '105' not 15; + with a string always concatenates (runtime, valid syntax)
    "caret_not_exponentiation",      # ^ is XOR in JS, not exponentiation — use ** or Math.pow() (runtime, valid syntax)
    "logical_vs_bitwise",            # & / | in conditions instead of && / || (runtime, valid syntax)
    "float_division_not_integer",    # JS / always gives decimal; student expects integer like Python 3 // (runtime, valid syntax)
    "postfix_vs_prefix_in_expr",     # n++ vs ++n in an expression: n++ returns old value, ++n returns new value (runtime, valid syntax)
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

Your task: Generate realistic examples of operator bugs that beginner JavaScript students make. Each example must show the buggy code, the fixed code, and a clear pedagogical explanation.

Subcategory assignment: Each example must demonstrate exactly the assigned subcategory:

- string_number_plus_coercion — the student uses the + operator expecting numeric addition, but one operand is a string (often from user input or a string literal), so JavaScript concatenates instead of adding. Example: const total = '10' + 5 produces '105', not 15. The fix converts the string to a number first using Number(), parseInt(), or parseFloat(). Both buggy and fixed code are syntactically valid. This is a runtime bug.
- caret_not_exponentiation — the student uses ^ expecting it to mean "to the power of" (as in mathematics or some other languages). In JavaScript, ^ is the bitwise XOR operator, not exponentiation. Example: 2 ^ 10 gives 8 (XOR), not 1024. The fix uses the ** exponentiation operator or Math.pow(). Both buggy and fixed code are syntactically valid. This is a runtime bug.
- logical_vs_bitwise — the student uses & (bitwise AND) or | (bitwise OR) inside an if condition instead of && (logical AND) or || (logical OR). Bitwise operators convert values to 32-bit integers and operate on bits, which produces unexpected results in boolean conditions. Example: if (age > 0 & age < 18) — this works by coincidence for some values but fails for others. The fix uses && instead of &. Both buggy and fixed code are syntactically valid. This is a runtime bug.
- float_division_not_integer — the student uses / and expects to get an integer result (like Python's // or integer division in other languages), but JavaScript / always returns a floating-point decimal. Example: 7 / 2 gives 3.5, not 3. The fix uses Math.floor(), Math.trunc(), or parseInt() to get an integer. Both buggy and fixed code are syntactically valid. This is a runtime bug.
- postfix_vs_prefix_in_expr — the student uses n++ (postfix) inside an expression expecting to get the incremented value, but n++ returns the value BEFORE incrementing. The incremented value is only available on the next access. To get the incremented value in the expression itself, ++n (prefix) must be used. Example: let x = 5; let y = x++; gives y === 5 not 6. Both buggy and fixed code are syntactically valid. This is a runtime bug.

Explanation style: About 70% of examples should use a direct style (clearly explain the bug and fix). About 30% should be Socratic — ask a guiding question that leads the student to discover the issue themselves. For Socratic examples, the fixed field still contains the correct code; only the explanation is a question.

Quality requirements:

- Each example must be a complete, self-contained snippet between 4 and 15 lines.
- Use realistic beginner scenarios: calculating a total price, computing a power for a formula, checking an age range, splitting items evenly, tracking a counter.
- Backtick rule (critical): any string containing ${...} interpolation must use backticks, never single or double quotes.
- Vary the variable names and scenarios across examples. Do not reuse variable names from earlier batches.
- Explanations must avoid unexplained jargon. When you say "bitwise" or "XOR", give a brief plain-English note about what it means.
- For Socratic explanations: ask genuine guiding questions. Good: "What does the ^ operator actually do in JavaScript — is it the same as the exponentiation symbol you might know from mathematics?" Bad: "Did you use the wrong operator?"
- Each example must be self-contained.

Special notes:
- For string_number_plus_coercion: the string must come from a realistic source — a variable that was declared as a string literal, or a value that a student would naturally receive as text (e.g. from an input field). Show the wrong output clearly in a console.log or an if condition.
- For caret_not_exponentiation: show both the wrong result (what ^ actually computes) and what the student intended. Make the expected vs actual values visible.
- For logical_vs_bitwise: the condition must use & or | in a realistic boolean expression (comparing two conditions with and/or). The fix replaces & with && or | with ||.
- For float_division_not_integer: the bug must be in a context where an integer is specifically needed — e.g., dividing students evenly into groups, calculating a page number, splitting an array at the midpoint.
- For postfix_vs_prefix_in_expr: the n++ must appear inside an expression (assignment, function call, or calculation) where the returned value matters — not as a standalone statement.

Two examples of the expected shape and quality:

{
  "buggy": "const itemCount = '8';\nconst extraItems = 2;\nconst total = itemCount + extraItems;\nconsole.log(`Total items: ${total}`);",
  "fixed": "const itemCount = '8';\nconst extraItems = 2;\nconst total = Number(itemCount) + extraItems;\nconsole.log(`Total items: ${total}`);",
  "category": "operators",
  "subcategory": "string_number_plus_coercion",
  "explanation": "The + operator has two jobs in JavaScript: it adds numbers and it joins (concatenates) strings. When one side is a string, + always chooses concatenation. Here itemCount is the string '8', so '8' + 2 becomes '82', not 10. Wrap itemCount in Number() to convert it to an actual number first, then + will perform addition and give the correct result.",
  "explanation_style": "direct"
}

{
  "buggy": "const base = 2;\nconst exponent = 8;\nconst result = base ^ exponent;\nconsole.log(`2 to the power of 8 is: ${result}`);",
  "fixed": "const base = 2;\nconst exponent = 8;\nconst result = base ** exponent;\nconsole.log(`2 to the power of 8 is: ${result}`);",
  "category": "operators",
  "subcategory": "caret_not_exponentiation",
  "explanation": "In JavaScript, the ^ symbol is not the exponentiation operator — it is the bitwise XOR operator, which compares individual bits of two numbers and gives a result based on those bits. 2 ^ 8 gives 10 (the XOR of 0010 and 1000 in binary), not 256. To raise a number to a power in JavaScript, use ** (the exponentiation operator): 2 ** 8 gives 256.",
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

        raw_path = RAW_DIR / f"operator_topup_batch_{batch_num:02d}_raw.json"
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
