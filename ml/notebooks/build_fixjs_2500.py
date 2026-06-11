"""
Build a curated, beginner-relevant FixJS subset (~2,500 examples) for EduCode Rwanda.

Replaces the old preprocess_fixjs.py FixJS portion with a tighter pipeline:
  - structural filters (size, similarity, single function, no framework/test/node)
  - syntax validation (anonymous function naming fix + node --check via vm.Script)
  - token-level diff categorization into beginner error categories
  - stratified sampling to per-category quotas

Output:
  ml/data/processed/fixjs_2500_intermediate.jsonl  (buggy/fixed/category/metadata, for the
                                                       Gemini explanation step)
  ml/data/processed/fixjs_2500_train.jsonl
  ml/data/processed/fixjs_2500_val.jsonl

Usage:
    cd /home/mitali/EduCode
    python3 ml/notebooks/build_fixjs_2500.py
"""

import json
import os
import re
import random
import difflib
import hashlib
import subprocess
import tempfile
from pathlib import Path
from collections import defaultdict, Counter

random.seed(42)

FIXJS_INPUT = Path("ml/data/fixjs/input")
OUTPUT_DIR = Path("ml/data/processed")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# ── System prompt / templates (same as preprocess_fixjs.py) ────────────────
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

# ── Filter regexes ───────────────────────────────────────────────────────────
FRAMEWORK_RE = re.compile(
    r"\$\(|\$\.\w|\$_\s*\("
    r"|\b(?:React|Vue|express|require\(['\"]express|angular|jQuery|useState|useEffect|"
    r"app\.get\(|app\.post\(|import\s+.*from\s+['\"]react)",
    re.I,
)
TEST_RE = re.compile(r"\b(describe|it\(|expect\(|assert\.|sinon|chai|jest|mocha|ok\(|test\.\w+\(|QUnit)\b")
NODE_RE = re.compile(r"require\(|module\.exports|\bprocess\.\w|__dirname")
THIS_RE = re.compile(r"\bthis\.")
FUNCTION_RE = re.compile(r"\bfunction\b")
ANON_FUNC_RE = re.compile(r"^function\s*\(")
NON_ASCII_RE = re.compile(r"[^\x00-\x7F]")

TOKEN_RE = re.compile(
    r"===|!==|==|!=|<=|>=|&&|\|\||\+\+|--|=>|\+=|-=|\*=|/=|[A-Za-z_$][\w$]*|[^\sA-Za-z_$]"
)

# Categorization tokenizer: treats string literals and comments as single opaque
# tokens so their *contents* don't get decomposed and misread as operator/identifier
# changes (e.g. a changed URL string showing up as a "/" operator change).
CAT_TOKEN_RE = re.compile(
    r'"(?:[^"\\]|\\.)*"'
    r"|'(?:[^'\\]|\\.)*'"
    r"|//[^\n]*"
    r"|/\*.*?\*/"
    r"|===|!==|==|!=|<=|>=|&&|\|\||\+\+|--|=>|\+=|-=|\*=|/=|[A-Za-z_$][\w$]*|[^\sA-Za-z_$]",
    re.S,
)

JS_KEYWORDS = {
    "if", "else", "for", "while", "return", "var", "let", "const", "function", "new", "this",
    "typeof", "in", "of", "do", "switch", "case", "break", "continue", "true", "false", "null",
    "undefined", "throw", "try", "catch", "finally", "delete", "instanceof", "void", "with",
}

EQ_TOKENS = {"==", "!=", "===", "!=="}
LOOP_BOUND_TOKENS = {"<", "<=", ">", ">="}
ARITH_LOGIC_TOKENS = {"+", "-", "*", "/", "%", "&&", "||", "!", "<", ">", "<=", ">=", "==", "===", "!=", "!=="}
ASYNC_TOKENS = {"async", "await", "then", "catch", "Promise"}

# ── Quotas ──────────────────────────────────────────────────────────────────
QUOTAS = {
    "reference_error": 1100,
    "general": 600,
    "operator": 350,
    "equality": 200,
    "off_by_one": 100,
    "scope": 50,
    "async": 0,
}
TARGET_TOTAL = sum(QUOTAS.values())  # 2400 -- leave headroom under 2500


def tokenize(code: str) -> list[str]:
    return TOKEN_RE.findall(code)


def line_diff_ratio(a: str, b: str) -> float:
    al, bl = a.strip().splitlines(), b.strip().splitlines()
    return difflib.SequenceMatcher(None, al, bl).ratio()


def changed_line_count(a: str, b: str) -> int:
    al, bl = a.strip().splitlines(), b.strip().splitlines()
    sm = difflib.SequenceMatcher(None, al, bl)
    changed = 0
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag != "equal":
            changed += max(i2 - i1, j2 - j1)
    return changed


def load_pairs() -> list[dict]:
    pairs = []
    for bucket in ["50", "50-100"]:
        before_dir = FIXJS_INPUT / bucket / "before"
        after_dir = FIXJS_INPUT / bucket / "after"
        before_files = set(os.listdir(before_dir))
        after_files = set(os.listdir(after_dir))
        matched = before_files & after_files
        for filename in matched:
            try:
                buggy = (before_dir / filename).read_text(encoding="utf-8", errors="ignore").strip()
                fixed = (after_dir / filename).read_text(encoding="utf-8", errors="ignore").strip()
            except Exception:
                continue
            pairs.append({"buggy": buggy, "fixed": fixed, "source_file": f"{bucket}/{filename}"})
    return pairs


def passes_structural_filters(buggy: str, fixed: str, funnel: Counter) -> bool:
    if not buggy or not fixed or buggy == fixed:
        return False

    blines = buggy.splitlines()
    flines = fixed.splitlines()
    if not (2 <= len(blines) <= 50 and 2 <= len(flines) <= 50):
        return False
    funnel["size_ok"] += 1

    if line_diff_ratio(buggy, fixed) < 0.6:
        return False
    if changed_line_count(buggy, fixed) > 8:
        return False
    funnel["similarity_ok"] += 1

    if not (buggy.startswith("function") and fixed.startswith("function")):
        return False
    if len(FUNCTION_RE.findall(buggy)) != 1 or len(FUNCTION_RE.findall(fixed)) != 1:
        return False
    funnel["single_function"] += 1

    if FRAMEWORK_RE.search(buggy) or FRAMEWORK_RE.search(fixed):
        return False
    funnel["no_framework"] += 1

    if TEST_RE.search(buggy) or TEST_RE.search(fixed):
        return False
    funnel["not_test"] += 1

    if NODE_RE.search(buggy) or NODE_RE.search(fixed):
        return False
    funnel["no_node_api"] += 1

    if THIS_RE.search(buggy) or THIS_RE.search(fixed):
        return False
    funnel["no_this"] += 1

    if NON_ASCII_RE.search(buggy) or NON_ASCII_RE.search(fixed):
        return False
    funnel["ascii_only"] += 1

    return True


def fix_anonymous_function(buggy: str, fixed: str) -> tuple[str, str]:
    """If the snippet is an anonymous `function(...)`, give it a placeholder name
    so it's a syntactically valid standalone declaration."""
    if ANON_FUNC_RE.match(buggy):
        buggy = ANON_FUNC_RE.sub("function practice(", buggy, count=1)
    if ANON_FUNC_RE.match(fixed):
        fixed = ANON_FUNC_RE.sub("function practice(", fixed, count=1)
    return buggy, fixed


FUNC_SIG_RE = re.compile(r"^function\s*([A-Za-z_$][\w$]*)?\s*\(([^)]*)\)")
COMMENT_RE = re.compile(r"//[^\n]*|/\*.*?\*/", re.S)
IDENT_RE = re.compile(r"^[A-Za-z_$][\w$]*$")


def func_params(code: str) -> list[str]:
    m = FUNC_SIG_RE.match(code)
    if not m:
        return []
    return [p.strip() for p in m.group(2).split(",") if p.strip()]


def function_body(code: str) -> str:
    i = code.find("{")
    j = code.rfind("}")
    if i == -1 or j == -1 or j <= i:
        return ""
    return code[i + 1:j]


def has_phantom_param(buggy: str, fixed: str) -> bool:
    """True if the fix adds a parameter that's never referenced in the fixed body
    (an artifact of partial single-function snippet extraction)."""
    bparams, fparams = func_params(buggy), func_params(fixed)
    added = [p for p in fparams if p not in bparams and IDENT_RE.match(p)]
    if not added:
        return False
    body = function_body(fixed)
    return any(not re.search(r"\b" + re.escape(p) + r"\b", body) for p in added)


def is_function_name_only_diff(buggy_orig: str, fixed_orig: str, buggy_final: str, fixed_final: str) -> bool:
    """True if the only token-level diff is the function declaration name, and
    that name was our injected `practice` placeholder (i.e. not a real bug)."""
    bt = CAT_TOKEN_RE.findall(buggy_final)
    ft = CAT_TOKEN_RE.findall(fixed_final)
    sm = difflib.SequenceMatcher(None, bt, ft)
    changed_b, changed_f = set(), set()
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag != "equal":
            changed_b.update(bt[i1:i2])
            changed_f.update(ft[j1:j2])
    if changed_b == {"practice"} and ANON_FUNC_RE.match(buggy_orig):
        return True
    if changed_f == {"practice"} and ANON_FUNC_RE.match(fixed_orig):
        return True
    return False


def is_empty_body(code: str) -> bool:
    """True if the function body has no non-whitespace, non-comment statements
    (i.e. the 'buggy' snippet is incomplete code, not buggy code)."""
    body = COMMENT_RE.sub("", function_body(code))
    return body.strip() == ""


def categorize(buggy: str, fixed: str) -> str:
    bt = CAT_TOKEN_RE.findall(buggy)
    ft = CAT_TOKEN_RE.findall(fixed)
    sm = difflib.SequenceMatcher(None, bt, ft)
    changed_b, changed_f = set(), set()
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag != "equal":
            changed_b.update(bt[i1:i2])
            changed_f.update(ft[j1:j2])
    changed = changed_b | changed_f
    if not changed:
        return "general"

    # Pure comment add/remove/edit (e.g. toggling a debug `console.log` line) --
    # not a meaningful "find the bug" lesson, drop these entirely.
    if all(t.startswith("//") or t.startswith("/*") for t in changed):
        return "exclude"

    if changed.issubset(EQ_TOKENS):
        # Only keep loose -> strict fixes (== -> ===, != -> !==); the reverse
        # direction teaches a bad practice and should be dropped.
        if (
            changed_b and changed_f
            and changed_b.issubset({"==", "!="})
            and changed_f.issubset({"===", "!=="})
        ):
            return "equality"
        return "exclude"
    if changed & ASYNC_TOKENS:
        return "async"
    if changed.issubset(LOOP_BOUND_TOKENS | {"1"}) and "for" in bt:
        return "off_by_one"
    if "var" in changed_b and ("let" in changed_f or "const" in changed_f):
        return "scope"
    if changed.issubset(ARITH_LOGIC_TOKENS):
        return "operator"
    if (
        len(changed) <= 6
        and all(re.match(r"^[A-Za-z_$][\w$]*$", t) and t not in JS_KEYWORDS for t in changed)
    ):
        return "reference_error"
    return "general"


def quality_score(buggy: str) -> float:
    """Higher is better: prefer named functions, shorter snippets, real-word identifiers."""
    score = 0.0
    if not ANON_FUNC_RE.match(buggy):
        score += 2.0  # named function (was already valid, less synthetic)
    n_lines = len(buggy.splitlines())
    score += max(0, (20 - n_lines)) * 0.05  # prefer shorter
    idents = re.findall(r"[A-Za-z_$][A-Za-z0-9_$]*", buggy)
    if idents:
        word_like = sum(1 for i in idents if len(i) >= 3 and i.isalpha())
        score += (word_like / len(idents)) * 1.0
    return score


def syntax_check_batch(snippets: dict[str, str]) -> dict[str, bool]:
    """Check a batch of {id: code} for JS syntax validity using node's vm.Script."""
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as f:
        json.dump(snippets, f)
        input_path = f.name

    checker_js = """
const fs = require('fs');
const vm = require('vm');
const data = JSON.parse(fs.readFileSync(process.argv[2], 'utf-8'));
const result = {};
for (const [id, code] of Object.entries(data)) {
    try {
        new vm.Script(code, { filename: 'check.js' });
        result[id] = true;
    } catch (e) {
        result[id] = false;
    }
}
process.stdout.write(JSON.stringify(result));
"""
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False) as f:
        f.write(checker_js)
        checker_path = f.name

    try:
        out = subprocess.run(
            ["node", checker_path, input_path], capture_output=True, text=True, timeout=120
        )
        results = json.loads(out.stdout)
    finally:
        os.unlink(input_path)
        os.unlink(checker_path)

    return results


def main():
    funnel = Counter()

    print("Loading raw FixJS pairs (50 + 50-100 buckets)...")
    pairs = load_pairs()
    funnel["total_pairs"] = len(pairs)
    print(f"  Total pairs: {len(pairs):,}")

    print("\nApplying structural filters...")
    structural_pool = []
    for p in pairs:
        if passes_structural_filters(p["buggy"], p["fixed"], funnel):
            structural_pool.append(p)
    print(f"  Passed structural filters: {len(structural_pool):,}")

    print("\nApplying anonymous-function naming fix + syntax validation...")
    for p in structural_pool:
        b, f = fix_anonymous_function(p["buggy"], p["fixed"])
        p["buggy_final"] = b
        p["fixed_final"] = f

    snippets = {}
    for i, p in enumerate(structural_pool):
        snippets[f"{i}_b"] = p["buggy_final"]
        snippets[f"{i}_f"] = p["fixed_final"]

    check_results = syntax_check_batch(snippets)

    valid_pool = []
    for i, p in enumerate(structural_pool):
        if check_results.get(f"{i}_b") and check_results.get(f"{i}_f"):
            valid_pool.append(p)
    funnel["valid_syntax"] = len(valid_pool)
    print(f"  Passed syntax validation: {len(valid_pool):,}")

    print("\nApplying quality filters (phantom params, rename artifacts, empty bodies)...")
    quality_pool = []
    for p in valid_pool:
        if has_phantom_param(p["buggy_final"], p["fixed_final"]):
            continue
        if is_function_name_only_diff(p["buggy"], p["fixed"], p["buggy_final"], p["fixed_final"]):
            continue
        if is_empty_body(p["buggy_final"]):
            continue
        quality_pool.append(p)
    funnel["quality_filtered"] = len(quality_pool)
    print(f"  Passed quality filters: {len(quality_pool):,}")

    print("\nDeduplicating...")
    seen = set()
    deduped_pool = []
    for p in quality_pool:
        norm = re.sub(r"\s+", " ", p["buggy_final"]).strip()
        h = hashlib.sha1(norm.encode()).hexdigest()
        if h in seen:
            continue
        seen.add(h)
        deduped_pool.append(p)
    funnel["deduped"] = len(deduped_pool)
    print(f"  After dedup: {len(deduped_pool):,}")

    print("\nCategorizing...")
    by_category = defaultdict(list)
    excluded = 0
    for p in deduped_pool:
        cat = categorize(p["buggy_final"], p["fixed_final"])
        if cat == "exclude":
            excluded += 1
            continue
        p["category"] = cat
        by_category[cat].append(p)
    funnel["categorized"] = sum(len(v) for v in by_category.values())
    print(f"  Excluded as pure comment-toggle diffs: {excluded:,}")

    print("  Category distribution (full filtered pool):")
    for cat, items in sorted(by_category.items(), key=lambda x: -len(x[1])):
        print(f"    {cat:18s}: {len(items):,}")

    print("\nSampling to quotas...")
    selected = []
    achieved = {}
    shortfall = 0
    # First pass: take up to quota from each category, sorted by quality score desc,
    # but shuffle within ties for randomness, then sample.
    for cat, quota in QUOTAS.items():
        items = by_category.get(cat, [])
        random.shuffle(items)
        items.sort(key=lambda p: -quality_score(p["buggy_final"]))
        take = items[:quota]
        selected.extend(take)
        achieved[cat] = len(take)
        if len(take) < quota:
            shortfall += quota - len(take)

    # Redistribute shortfall to reference_error only -- do NOT inflate "general"
    # beyond its quota; the rest of the gap to ~2,500 is closed by the separate
    # Gemini synthetic-generation step (which also covers async/scope/off_by_one).
    if shortfall > 0:
        for cat in ["reference_error"]:
            if shortfall <= 0:
                break
            items = by_category.get(cat, [])
            already_taken = achieved[cat]
            remaining = items[already_taken:]
            extra = remaining[:shortfall]
            selected.extend(extra)
            achieved[cat] += len(extra)
            shortfall -= len(extra)

    funnel["final_selected"] = len(selected)
    print(f"  Final selected: {len(selected):,}")
    print("  Achieved distribution:")
    for cat, n in achieved.items():
        print(f"    {cat:18s}: {n:,}  (quota {QUOTAS[cat]})")
    if shortfall > 0:
        print(f"  WARNING: still short by {shortfall} after redistribution")

    # Stash top-quality "general" examples (pre-shuffle) for the review sample.
    general_by_quality = sorted(
        by_category.get("general", []), key=lambda p: -quality_score(p["buggy_final"])
    )[: achieved.get("general", 0)]

    random.shuffle(selected)

    n_total = len(selected)

    # ── Write intermediate JSONL (for Gemini explanation step) ─────────────
    intermediate_path = OUTPUT_DIR / f"fixjs_{n_total}_intermediate.jsonl"
    with open(intermediate_path, "w", encoding="utf-8") as fh:
        for p in selected:
            record = {
                "buggy": p["buggy_final"],
                "fixed": p["fixed_final"],
                "category": p["category"],
                "source_file": p["source_file"],
                "lines_changed": changed_line_count(p["buggy_final"], p["fixed_final"]),
                "dataset_note": (
                    "FixJS-derived (pre-ES6 era, mined from H1-2012 commits). "
                    "Does not contain async/await, let/const, or arrow-function bugs -- "
                    "those categories must come from synthetic generation."
                ),
            }
            fh.write(json.dumps(record, ensure_ascii=False) + "\n")
    print(f"\nWrote {len(selected):,} examples -> {intermediate_path}")

    # ── Write training-format JSONL (90/10 split) ──────────────────────────
    training_samples = []
    for p in selected:
        template = random.choice(INSTRUCTION_TEMPLATES)
        training_samples.append({
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": template.format(buggy=p["buggy_final"])},
                {"role": "assistant", "content": RESPONSE_TEMPLATE.format(fixed=p["fixed_final"])},
            ]
        })

    random.shuffle(training_samples)
    split = int(len(training_samples) * 0.9)
    train, val = training_samples[:split], training_samples[split:]

    train_path = OUTPUT_DIR / f"fixjs_{n_total}_train.jsonl"
    val_path = OUTPUT_DIR / f"fixjs_{n_total}_val.jsonl"
    with open(train_path, "w", encoding="utf-8") as fh:
        for s in train:
            fh.write(json.dumps(s, ensure_ascii=False) + "\n")
    with open(val_path, "w", encoding="utf-8") as fh:
        for s in val:
            fh.write(json.dumps(s, ensure_ascii=False) + "\n")
    print(f"Wrote {len(train):,} -> {train_path}")
    print(f"Wrote {len(val):,} -> {val_path}")

    # ── Review sample (20 examples for manual quality check) ───────────────
    review_path = OUTPUT_DIR / "review_sample.jsonl"
    review_specs = [
        ("reference_error", by_category.get("reference_error", []), 10),
        ("general", general_by_quality, 5),
        ("equality", by_category.get("equality", []), 2),
        ("operator", by_category.get("operator", []), 2),
        ("async", by_category.get("async", []), 1),
    ]
    with open(review_path, "w", encoding="utf-8") as fh:
        for cat, items, n in review_specs:
            for p in items[:n]:
                record = {
                    "category": cat,
                    "buggy": p["buggy_final"],
                    "fixed": p["fixed_final"],
                    "lines_changed": changed_line_count(p["buggy_final"], p["fixed_final"]),
                }
                fh.write(json.dumps(record, ensure_ascii=False) + "\n")
    print(f"Wrote review sample -> {review_path}")

    # ── Funnel report ────────────────────────────────────────────────────
    print("\n=== Funnel ===")
    for stage in [
        "total_pairs", "size_ok", "similarity_ok", "single_function", "no_framework",
        "not_test", "no_node_api", "no_this", "ascii_only", "valid_syntax", "quality_filtered",
        "deduped", "categorized", "final_selected",
    ]:
        print(f"  {stage:18s}: {funnel[stage]:,}")


if __name__ == "__main__":
    main()
