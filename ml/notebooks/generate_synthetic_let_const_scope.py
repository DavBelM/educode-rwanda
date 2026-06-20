"""
Generate synthetic let/const/scope bug examples for EduCode Rwanda using the Gemini API.

Run as a Kaggle notebook (cell-by-cell or top-to-bottom). Requires a Kaggle Secret
named GEMINI_API_KEY.

Output:
  ml/data/synthetic/synthetic_let_const_scope.jsonl        (appended, deduped)
  ml/data/synthetic/raw_responses/let_const_scope_batch_NN_raw.json
  ml/data/synthetic/raw_responses/let_const_scope_rejections.jsonl
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

# ── Config ─────────────────────────────────────────────────────────────────
TARGET_COUNT = 200
BATCH_SIZE   = 10
CATEGORY     = "let_const_scope"

OUTPUT_DIR = Path("ml/data/synthetic")
RAW_DIR    = OUTPUT_DIR / "raw_responses"
RAW_DIR.mkdir(parents=True, exist_ok=True)

OUTPUT_PATH     = OUTPUT_DIR / f"synthetic_{CATEGORY}.jsonl"
REJECTIONS_PATH = RAW_DIR   / f"{CATEGORY}_rejections.jsonl"

SUBCATEGORIES = [
    "const_reassignment",       # TypeError: trying to reassign a const — runtime, syntactically valid
    "block_scope_confusion",    # let/const inside if/for block not visible outside — ReferenceError at runtime
    "var_hoisting",             # var declared after use gives undefined, not error — confuses beginners
    "temporal_dead_zone",       # let/const accessed before declaration in same scope — ReferenceError at runtime
    "for_loop_var_closure",     # var in for-loop closure: all callbacks capture same final value
    "redeclaration_let",        # re-declaring a let variable in the same scope — SyntaxError
]

# Subcategories whose BUGGY code is expected to be a SyntaxError (caught by node --check).
SYNTAX_ERROR_SUBCATS = {"redeclaration_let"}

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
FUNC_NAME_RE   = re.compile(r"^(?:async\s+)?function\s+([A-Za-z_$][\w$]*)")
subcat_counts  = Counter()
style_counts   = Counter()
used_func_names = set()

def normalize_hash(code: str) -> str:
    return hashlib.sha1(re.sub(r"\s+", " ", code).strip().encode()).hexdigest()

def extract_func_name(code: str) -> str | None:
    m = FUNC_NAME_RE.match(code.strip())
    return m.group(1) if m else None

for ex in existing:
    seen_hashes.add(normalize_hash(ex["buggy"]))
    subcat_counts[ex["subcategory"]] += 1
    style_counts[ex["explanation_style"]] += 1
    name = extract_func_name(ex["buggy"])
    if name:
        used_func_names.add(name)

print(f"Loaded {len(existing)} existing examples.")
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

Your task: Generate realistic examples of let/const/scope bugs that beginner JavaScript students typically make. Each example must demonstrate the bug, provide the fix, and give a clear pedagogical explanation.

Subcategory assignment: Each example must demonstrate exactly the assigned subcategory:

- const_reassignment — declaring a variable with const then trying to reassign its value later in the same function. The buggy code is syntactically valid but throws a TypeError at runtime (e.g. "Assignment to constant variable"). The fix changes const to let.
- block_scope_confusion — declaring a variable with let or const inside a block (an if statement, a for loop, or a standalone {}) then trying to use it outside that block. The buggy code is syntactically valid but throws a ReferenceError at runtime. The fix moves the declaration outside the block.
- var_hoisting — using var and being surprised by JavaScript hoisting: either reading a var variable before its declaration (which gives undefined, not an error) when the student expected a ReferenceError, or a var declared inside a block leaking out to the enclosing function scope. Both buggy and fixed code must be syntactically valid. The fix replaces var with let or const.
- temporal_dead_zone — accessing a let or const variable before its declaration in the same scope. JavaScript does not hoist let/const into usable state, so this throws a ReferenceError: Cannot access 'x' before initialization. The buggy code is syntactically valid but crashes at runtime. The fix moves the declaration above the first use, or moves the use below the declaration.
- for_loop_var_closure — using var in a for loop where the loop body captures i in a callback (setTimeout, addEventListener, forEach with a function, etc.). Because var is function-scoped, all callbacks share the same i and see the final value. The buggy code is syntactically valid; the behavior is just wrong. The fix replaces var with let so each iteration gets its own binding.
- redeclaration_let — declaring a let variable twice in the same scope (e.g. let count = 0; ... let count = count + 1;). This is a SyntaxError that node catches at parse time. The fixed code removes the duplicate declaration (uses count = count + 1 without let on the second line, or renames one variable).

Explanation style: About 70% of examples should use a direct style. About 30% should be Socratic — ask a guiding question that helps the student think it through. For Socratic examples, the fixed field still contains the correct code; only the explanation is a question.

Quality requirements:

- Use realistic beginner variable names: totalPrice, userName, studentScore, itemCount, buttonList, selectedOption. Never use cryptic names or single letters (except loop counters i, j which are acceptable inside for loops).
- Use realistic beginner scenarios: tallying a score, processing form input, looping through a list, showing/hiding a result, saving a record. No framework code (no React, Vue, Express, jQuery).
- Each buggy code snippet must be a complete, named function between 5 and 20 lines. No anonymous arrow functions assigned to nothing.
- The bug must be one a real Level 3 student would write — not an edge case requiring deep JS knowledge.
- Backtick rule (critical): any string containing ${...} interpolation must use backticks, never single or double quotes.
- Vary function names and scenarios across examples. Do not reuse function names from earlier batches.
- Explanations must avoid unexplained jargon. If you use "scope" or "hoisting", give a one-sentence plain-English meaning in context.
- For Socratic explanations: ask genuine guiding questions, not leading ones that give the answer away.
- Each example must be self-contained. No references to other examples or lessons.

Special notes:
- For const_reassignment: the variable being reassigned must be a primitive (number, string, boolean), not an object property mutation (which is legal with const). The bug should be clearly the reassignment attempt, e.g. const total = 0; total = price + tax;
- For block_scope_confusion: the variable must be declared with let or const (not var) inside the block, so the bug is scope-related.
- For var_hoisting: both buggy and fixed code must pass node --check. The bug is behavioral, not a syntax error.
- For redeclaration_let: the buggy code must fail node --check. The fixed code must pass. The most common beginner mistake is writing let x = x + 1 instead of x = x + 1 inside a loop or conditional.

Two examples of the expected shape and quality:

{
  "buggy": "function calculateTotal(price, tax) {\n  const total = 0;\n  total = price + tax;\n  return total;\n}",
  "fixed": "function calculateTotal(price, tax) {\n  let total = 0;\n  total = price + tax;\n  return total;\n}",
  "category": "let_const_scope",
  "subcategory": "const_reassignment",
  "explanation": "When you declare a variable with const, JavaScript locks the binding — you can set it once, but you cannot reassign it later. On line 3, total = price + tax tries to replace the value, which throws a TypeError. Change const to let on line 2, and the reassignment on line 3 will work fine.",
  "explanation_style": "direct"
}

{
  "buggy": "function showPassOrFail(mark) {\n  if (mark >= 50) {\n    let message = 'You passed!';\n  } else {\n    let message = 'Keep trying!';\n  }\n  console.log(message);\n}",
  "fixed": "function showPassOrFail(mark) {\n  let message;\n  if (mark >= 50) {\n    message = 'You passed!';\n  } else {\n    message = 'Keep trying!';\n  }\n  console.log(message);\n}",
  "category": "let_const_scope",
  "subcategory": "block_scope_confusion",
  "explanation": "Look at where message is declared — it is inside the if and else blocks. In JavaScript, a variable declared with let only exists inside the block (the curly braces {}) where it was declared. Once the if block ends, message disappears. Where does console.log(message) run? Is it inside or outside those blocks?",
  "explanation_style": "socratic"
}

For THIS batch, generate exactly {batch_size} examples. The subcategory and explanation_style for each, IN ORDER, must be:
{slot_assignments}

Do not reuse any of these function/scenario names from earlier batches:
{exclusion_list}
"""


# ── Main generation loop ──────────────────────────────────────────────────────
client             = GeminiClient(GEMINI_API_KEY, MODEL_CANDIDATES)
accepted_total     = len(existing)
batch_num          = 0
total_usage        = Counter()
all_rejections     = []
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
        exclusion_list = ", ".join(sorted(used_func_names)) or "(none yet)"

        prompt = (
            PROMPT_BASE
            .replace("{batch_size}",     str(n))
            .replace("{slot_assignments}", slot_lines)
            .replace("{exclusion_list}", exclusion_list)
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

        raw_path = RAW_DIR / f"{CATEGORY}_batch_{batch_num:02d}_raw.json"
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
                name = extract_func_name(ex["buggy"]) or extract_func_name(ex["fixed"])
                if name:
                    used_func_names.add(name)
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
    print(f"  {s:30s}: {subcat_counts[s]}")

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
