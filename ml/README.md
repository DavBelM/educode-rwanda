# EduCode Rwanda — ML Pipeline

Fine-tuning **Qwen2.5-7B Instruct** to power the EduCode AI coding assistant.  
Training runs on Kaggle (2× T4 GPU, 30 hrs/week) using QLoRA via `peft` + `trl`.

---

## Directory layout

```
ml/
├── data/
│   ├── fixjs/          ← FixJS dataset (gitignored — clone here)
│   ├── kinyarwanda/    ← Kinyarwanda concept docs (gitignored — generated locally)
│   └── processed/      ← Formatted JSONL training files (gitignored)
├── notebooks/          ← Kaggle training notebooks (committed)
└── README.md
```

---

## Setup

### 1. Clone FixJS

```bash
git clone https://github.com/AAI-USZ/FixJS.git ml/data/fixjs
```

### 2. Install Python deps (local preprocessing only)

```bash
pip install datasets transformers tqdm
```

### 3. Preprocess → JSONL

Run the preprocessing notebook or script to convert FixJS + Kinyarwanda docs
into `ml/data/processed/train.jsonl` with instruction-response pairs:

```json
{"instruction": "Fix this JavaScript error:\n<buggy code>", "response": "<fixed code>"}
```

### 4. Fine-tune on Kaggle

Upload `ml/notebooks/finetune_qwen25_7b.ipynb` to Kaggle, attach the processed
dataset, and run. Uses 4-bit QLoRA to fit the 7B model on 16 GB VRAM.

---

## Model

| Property | Value |
|---|---|
| Base model | `Qwen/Qwen2.5-7B-Instruct` |
| Fine-tuning method | QLoRA (4-bit, LoRA rank 16) |
| Training framework | `trl` SFTTrainer + `peft` + `bitsandbytes` |
| Compute | Kaggle 2× T4 (30 hrs/week free tier) |
| Deployment | Hugging Face Spaces (free tier) |

---

## Components

1. **AI Coding Assistant** — answers student questions in Kinyarwanda/English,
   suggests fixes, explains errors (Socratic style for projects)
2. **Student Risk Predictor** — classical ML (sklearn) on activity logs to flag
   students who need intervention
