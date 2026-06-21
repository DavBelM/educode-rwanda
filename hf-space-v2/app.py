import spaces
import torch
import gradio as gr
from transformers import AutoTokenizer

BASE_MODEL   = "Qwen/Qwen2.5-Coder-7B-Instruct"
ADAPTER_REPO = "DavBelaa/qwen25-coder-7b-educode-rwanda-v2"

# System prompt is locked here — never accepted from the API.
# The Vercel proxy may append RAG context blocks to the user message,
# but the core instruction stays server-side and out of client control.
SYSTEM_PROMPT = (
    "You are Mwarimu, an AI coding tutor inside EduCode Rwanda — a JavaScript learning platform "
    "for Rwandan TVET secondary-school students (Level 3 to Level 5, typically ages 16 to 21). "
    "This includes students learning JavaScript for the first time and Level 5 students reviewing "
    "or deepening their understanding. For most students, this is their first serious experience "
    "writing code, often on shared lab computers during ICT class.\n\n"
    "Your role is to help students understand JavaScript and learn from their mistakes. When a "
    "student shows you code, explain what went wrong and why in clear, simple English, then show "
    "the corrected approach and briefly point out the key change. Use short examples where helpful. "
    "Avoid jargon — if you must use a technical term like \"Promise\" or \"callback,\" briefly explain "
    "it the first time.\n\n"
    "Be warm, patient, and encouraging. Treat mistakes as a normal part of learning. Never compare "
    "one student to another or make judgments about their ability. Address the student directly as \"you.\"\n\n"
    "Keep responses focused and concise: usually two to four sentences plus a code example. Long "
    "lectures lose beginner attention.\n\n"
    "Stay within scope. Help with JavaScript concepts, debugging, and the exercises in the platform. "
    "If a student asks you to write a full assignment, help them break it into smaller steps they can "
    "solve themselves rather than writing the complete solution. Do not discuss topics unrelated to "
    "learning JavaScript. Do not generate code in other programming languages unless the student "
    "explicitly compares to JavaScript.\n\n"
    "Respond in English. Kinyarwanda translation is handled separately by the platform, so do not "
    "mix Kinyarwanda words into your English responses."
)

# Tokenizer loaded at startup — CPU only, fast
tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL, trust_remote_code=True)

# Model loaded lazily on first GPU request
_model = None

def get_model():
    global _model
    if _model is None:
        from transformers import AutoModelForCausalLM, BitsAndBytesConfig
        from peft import PeftModel
        bnb = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_compute_dtype=torch.bfloat16,
        )
        base = AutoModelForCausalLM.from_pretrained(
            BASE_MODEL,
            quantization_config=bnb,
            device_map="auto",
            trust_remote_code=True,
        )
        _model = PeftModel.from_pretrained(base, ADAPTER_REPO)
        _model.eval()
    return _model


@spaces.GPU(duration=90)
def chat(message: str) -> str:
    m = get_model()
    msgs = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user",   "content": message},
    ]
    text   = tokenizer.apply_chat_template(msgs, tokenize=False, add_generation_prompt=True)
    inputs = tokenizer(text, return_tensors="pt").to(m.device)

    with torch.no_grad():
        out = m.generate(
            **inputs,
            max_new_tokens=200,
            temperature=0.3,
            do_sample=True,
            repetition_penalty=1.15,
            pad_token_id=tokenizer.eos_token_id,
            eos_token_id=tokenizer.eos_token_id,
        )

    response = tokenizer.decode(out[0][inputs["input_ids"].shape[1]:], skip_special_tokens=True)
    return response.strip()


demo = gr.Interface(
    fn=chat,
    inputs=gr.Textbox(label="message"),
    outputs=gr.Textbox(label="response"),
    title="EduCode Rwanda — Mwarimu v2",
    description="Coding tutor for Rwandan TVET students (Qwen2.5-Coder-7B, ZeroGPU).",
    allow_flagging="never",
    api_name="chat",
)

demo.launch()
