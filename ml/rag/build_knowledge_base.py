"""
Phase 3: Chunk MDN + lesson content, embed with Gemini text-embedding-004, insert into Supabase.

Usage:
    export GEMINI_API_KEY=...           # already in .env as VITE_GEMINI_API_KEY
    export SUPABASE_URL=...             # already in .env as VITE_SUPABASE_URL
    export SUPABASE_SERVICE_KEY=...     # already in .env as VITE_SUPABASE_SERVICE_ROLE_KEY
    python3 ml/rag/build_knowledge_base.py

Run from the EduCode project root.
"""

import os, re, json, time, urllib.request, urllib.error
from pathlib import Path

import tiktoken
from supabase import create_client

# ── Load .env from project root (works even without shell exports) ────────────
def _load_env() -> None:
    env_path = Path(__file__).parent.parent.parent / ".env"
    if not env_path.exists():
        return
    for line in env_path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, val = line.partition("=")
        val = val.strip().strip('"').strip("'")
        os.environ.setdefault(key.strip(), val)

_load_env()

# Map Vite-prefixed keys → bare names the script expects
for _vite, _bare in [
    ("VITE_SUPABASE_URL",             "SUPABASE_URL"),
    ("VITE_SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_SERVICE_KEY"),
]:
    if _vite in os.environ and _bare not in os.environ:
        os.environ[_bare] = os.environ[_vite]

# ── Config ────────────────────────────────────────────────────────────────────
CHUNK_TARGET   = 300   # target tokens per chunk
CHUNK_OVERLAP  = 50    # overlap tokens between consecutive chunks of same doc
EMBED_MODEL    = "gemini-embedding-001"
EMBED_DIM      = 3072
BATCH_SIZE     = 100   # Gemini batchEmbedContents limit

RAG_DIR     = Path(__file__).parent
MDN_DIR     = RAG_DIR / "sources" / "mdn"
LESSON_FILE = RAG_DIR / "sources" / "lessons" / "lessons.json"
CHUNKS_OUT  = RAG_DIR / "chunks" / "all_chunks.json"

enc = tiktoken.get_encoding("cl100k_base")

def count_tokens(text: str) -> int:
    return len(enc.encode(text))

# ── Chunking helpers ──────────────────────────────────────────────────────────

BOILERPLATE_SECTIONS = {"specifications", "browser compatibility", "see also"}

def clean_mdn_markdown(text: str) -> str:
    """Strip MDN frontmatter, macros, boilerplate sections, and HTML tags."""
    # Remove frontmatter
    text = re.sub(r'^---[\s\S]*?---\n', '', text, count=1)
    # Remove MDN macros like {{jsxref("Array")}} → leave empty
    text = re.sub(r'\{\{[^}]+\}\}', '', text)
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    # Remove reference-style links [text][ref]
    text = re.sub(r'\[([^\]]+)\]\[[^\]]*\]', r'\1', text)
    # Clean MDN-specific code fence annotations
    text = re.sub(r'```\w+ interactive-example', '```javascript', text)
    text = re.sub(r'```(\w+) (?:live-sample|example-good|example-bad)', r'```\1', text)
    # Strip boilerplate sections (Specifications, Browser compatibility, See also)
    # by removing everything from those headings to the next same-level heading or EOF
    for heading in BOILERPLATE_SECTIONS:
        text = re.sub(
            rf'\n#{1,3} (?i:{re.escape(heading)})[\s\S]*?(?=\n#{1,3} |\Z)',
            '', text
        )
    # Collapse excessive blank lines
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

def split_into_sections(text: str) -> list[tuple[str, str]]:
    """Split markdown into (heading, body) pairs at ## and ### boundaries."""
    # Split on H2/H3 headings
    parts = re.split(r'\n(#{2,3} .+)\n', text)
    sections = []
    # First section has no heading
    if parts[0].strip():
        sections.append(("", parts[0].strip()))
    for i in range(1, len(parts) - 1, 2):
        heading = parts[i].strip()
        body    = parts[i + 1].strip() if i + 1 < len(parts) else ""
        if body:
            sections.append((heading, body))
    return sections

def split_preserving_code(text: str, target: int, overlap: int) -> list[str]:
    """
    Split text into chunks of ~target tokens.
    Never splits inside a ```code``` block.
    Splits at paragraph boundaries when possible.
    """
    # Identify code block spans so we never split them
    code_spans = []
    for m in re.finditer(r'```[\s\S]*?```', text):
        code_spans.append((m.start(), m.end()))

    def in_code_block(pos: int) -> bool:
        return any(s <= pos < e for s, e in code_spans)

    # Split into paragraphs (double newline), keeping code blocks intact
    paragraphs = []
    current = ""
    i = 0
    while i < len(text):
        # Check if we're at a code block boundary
        in_code = False
        for s, e in code_spans:
            if i == s:
                # flush current paragraph
                if current.strip():
                    paragraphs.append(current.strip())
                    current = ""
                paragraphs.append(text[s:e])
                i = e
                in_code = True
                break
        if in_code:
            continue
        # Check for paragraph break
        if text[i:i+2] == '\n\n':
            if current.strip():
                paragraphs.append(current.strip())
            current = ""
            i += 2
        else:
            current += text[i]
            i += 1
    if current.strip():
        paragraphs.append(current.strip())

    # Now group paragraphs into chunks of ~target tokens with overlap
    chunks = []
    current_paras = []
    current_tokens = 0

    for para in paragraphs:
        para_tokens = count_tokens(para)

        # If single paragraph exceeds target, emit it as its own chunk
        if para_tokens > target and not current_paras:
            chunks.append(para)
            continue

        if current_tokens + para_tokens > target and current_paras:
            # Emit current chunk
            chunks.append("\n\n".join(current_paras))
            # Carry overlap: keep last paragraph(s) totaling ~overlap tokens
            overlap_paras = []
            overlap_tokens = 0
            for p in reversed(current_paras):
                t = count_tokens(p)
                if overlap_tokens + t <= overlap:
                    overlap_paras.insert(0, p)
                    overlap_tokens += t
                else:
                    break
            current_paras  = overlap_paras
            current_tokens = overlap_tokens

        current_paras.append(para)
        current_tokens += para_tokens

    if current_paras:
        chunks.append("\n\n".join(current_paras))

    return [c for c in chunks if c.strip()]

def chunk_document(text: str, title: str, topic: str,
                   source: str, url: str | None) -> list[dict]:
    """Full chunking pipeline for one document."""
    sections = split_into_sections(text)
    chunks   = []
    idx      = 0

    for heading, body in sections:
        prefix = f"{heading}\n\n" if heading else ""
        # If section fits in one chunk, keep it whole
        if count_tokens(prefix + body) <= CHUNK_TARGET:
            chunk_text = (prefix + body).strip()
            tc = count_tokens(chunk_text)
            if chunk_text and tc >= 20:   # filter boilerplate noise
                chunks.append({
                    "content":     chunk_text,
                    "source":      source,
                    "topic":       topic,
                    "title":       title,
                    "url":         url,
                    "chunk_index": idx,
                    "token_count": tc,
                })
                idx += 1
        else:
            sub_chunks = split_preserving_code(body, CHUNK_TARGET, CHUNK_OVERLAP)
            for sc in sub_chunks:
                chunk_text = (prefix + sc).strip()
                tc = count_tokens(chunk_text)
                if chunk_text and tc >= 20:   # filter boilerplate noise
                    chunks.append({
                        "content":     chunk_text,
                        "source":      source,
                        "topic":       topic,
                        "title":       title,
                        "url":         url,
                        "chunk_index": idx,
                        "token_count": tc,
                    })
                    idx += 1

    return chunks

# ── Process MDN files ─────────────────────────────────────────────────────────

def load_mdn_chunks() -> list[dict]:
    index = json.loads((MDN_DIR / "index.json").read_text())
    all_chunks = []
    for entry in index:
        fpath = MDN_DIR / entry["file"]
        if not fpath.exists():
            print(f"  MISSING: {entry['file']}")
            continue
        raw     = fpath.read_text(encoding="utf-8")
        cleaned = clean_mdn_markdown(raw)
        if len(cleaned) < 100:
            continue
        chunks  = chunk_document(cleaned, entry["title"], entry["topic"],
                                 source="mdn", url=entry["url"])
        all_chunks.extend(chunks)
        print(f"  {len(chunks):2d} chunks  {entry['title'][:55]}")
    return all_chunks

# ── Process lesson files ──────────────────────────────────────────────────────

def load_lesson_chunks() -> list[dict]:
    lessons    = json.loads(LESSON_FILE.read_text())
    all_chunks = []
    for lesson in lessons:
        chunks = chunk_document(
            lesson["content"],
            f"EduCode Lesson: {lesson['title']}",
            lesson["topic"],
            source="lesson",
            url=None,
        )
        all_chunks.extend(chunks)
        print(f"  {len(chunks):2d} chunks  {lesson['title'][:55]}")
    return all_chunks

# ── Embed (Gemini text-embedding-004) ────────────────────────────────────────

CHECKPOINT_FILE = RAG_DIR / "chunks" / "embedded_checkpoint.json"

def gemini_embed_batch(texts: list[str], api_key: str) -> list[list[float]]:
    """Call Gemini batchEmbedContents with exponential backoff on 429."""
    url = (
        f"https://generativelanguage.googleapis.com/v1beta"
        f"/models/{EMBED_MODEL}:batchEmbedContents?key={api_key}"
    )
    payload = json.dumps({
        "requests": [
            {"model": f"models/{EMBED_MODEL}", "content": {"parts": [{"text": t}]}}
            for t in texts
        ]
    }).encode()

    for attempt in range(6):
        req = urllib.request.Request(
            url, data=payload,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                data = json.loads(r.read())
            return [e["values"] for e in data["embeddings"]]
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait = 2 ** attempt * 5   # 5s, 10s, 20s, 40s, 80s, 160s
                print(f"  429 rate limit — waiting {wait}s (attempt {attempt+1}/6)")
                time.sleep(wait)
            else:
                raise
    raise RuntimeError("Gemini rate limit: max retries exceeded")


def embed_chunks(chunks: list[dict], api_key: str) -> list[dict]:
    # Resume from checkpoint if it exists
    result: list[dict] = []
    start_idx = 0
    if CHECKPOINT_FILE.exists():
        result = json.loads(CHECKPOINT_FILE.read_text())
        start_idx = len(result)
        print(f"  Resuming from checkpoint — {start_idx} chunks already embedded")

    for i in range(start_idx, len(chunks), BATCH_SIZE):
        batch      = chunks[i : i + BATCH_SIZE]
        texts      = [c["content"] for c in batch]
        embeddings = gemini_embed_batch(texts, api_key)
        for chunk, emb in zip(batch, embeddings):
            result.append({**chunk, "embedding": emb})
        # Save checkpoint after every batch
        CHECKPOINT_FILE.write_text(json.dumps(result))
        print(f"  Embedded {min(i + BATCH_SIZE, len(chunks))}/{len(chunks)}")
        time.sleep(3)   # 3s between batches to stay under rate limit
    return result

# ── Insert into Supabase ──────────────────────────────────────────────────────

def insert_chunks(chunks: list[dict], sb) -> None:
    # Insert in batches of 20 (vectors are large)
    for i in range(0, len(chunks), 20):
        batch = chunks[i : i + 20]
        rows  = [
            {
                "content":     c["content"],
                "embedding":   c["embedding"],
                "source":      c["source"],
                "topic":       c["topic"],
                "title":       c["title"],
                "url":         c.get("url"),
                "chunk_index": c["chunk_index"],
                "token_count": c["token_count"],
            }
            for c in batch
        ]
        sb.table("knowledge_chunks").insert(rows).execute()
        print(f"  Inserted {min(i + 20, len(chunks))}/{len(chunks)}")

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    gemini_key   = os.environ.get("GEMINI_API_KEY")
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")

    if not gemini_key:
        raise SystemExit("ERROR: GEMINI_API_KEY not set")
    if not supabase_url or not supabase_key:
        raise SystemExit("ERROR: SUPABASE_URL or SUPABASE_SERVICE_KEY not set")

    print("=" * 60)
    print("PHASE 2 → CHUNKING")
    print("=" * 60)

    print("\nMDN pages:")
    mdn_chunks = load_mdn_chunks()
    print(f"  → {len(mdn_chunks)} MDN chunks\n")

    print("Lesson content:")
    lesson_chunks = load_lesson_chunks()
    print(f"  → {len(lesson_chunks)} lesson chunks\n")

    all_chunks = mdn_chunks + lesson_chunks
    print(f"Total chunks: {len(all_chunks)}")
    total_tokens = sum(c["token_count"] for c in all_chunks)
    print(f"Total tokens: {total_tokens:,}  (Gemini text-embedding-004)\n")

    # Save chunks (without embeddings) for inspection
    CHUNKS_OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(CHUNKS_OUT, "w") as f:
        json.dump([{k: v for k, v in c.items() if k != "embedding"}
                   for c in all_chunks], f, indent=2, ensure_ascii=False)
    print(f"Chunks saved (no embeddings) → {CHUNKS_OUT}\n")

    print("=" * 60)
    print("PHASE 3 → EMBEDDING")
    print("=" * 60)
    all_chunks = embed_chunks(all_chunks, gemini_key)
    print(f"\nAll {len(all_chunks)} chunks embedded.\n")

    print("=" * 60)
    print("PHASE 3 → INSERT INTO SUPABASE")
    print("=" * 60)
    sb = create_client(supabase_url, supabase_key)
    insert_chunks(all_chunks, sb)
    print(f"\nDone — {len(all_chunks)} chunks in knowledge_chunks table.")

    # Token distribution summary
    tokens = [c["token_count"] for c in all_chunks]
    print(f"\nChunk token distribution:")
    print(f"  min={min(tokens)}  median={sorted(tokens)[len(tokens)//2]}  max={max(tokens)}")

if __name__ == "__main__":
    main()
