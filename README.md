# EduCode Rwanda

> **AI-powered bilingual JavaScript learning platform for Rwandan TVET students.**
> Structured courses, a real code editor, and an AI tutor — Mwarimu — that explains mistakes in both English and Kinyarwanda.

**Live app:** [educoderwanda.com](https://educoderwanda.com)
**Repository:** [github.com/DavBelM/educode-rwanda](https://github.com/DavBelM/educode-rwanda)

---

## Demo Video

> **[https://youtu.be/1d04DAo71SI]**
>

---

## Table of Contents

1. [About the Project](#about-the-project)
2. [Core Features](#core-features)
3. [Technology Stack](#technology-stack)
4. [Installation & Setup](#installation--setup)
5. [Related Files](#related-files)
6. [Testing Strategies & Results](#testing-strategies--results)
7. [Analysis of Results](#analysis-of-results)
8. [Deployment Plan & Execution](#deployment-plan--execution)
9. [Recommendations & Future Work](#recommendations--future-work)

---

## About the Project

EduCode Rwanda is a final-year BSc Software Engineering capstone project (African Leadership University, Kigali). It addresses a real classroom problem: JavaScript is a core subject in the Rwandan ICT TVET curriculum, but teachers in large classes (40–80 students) cannot give individual feedback. Students get stuck, copy from peers, and never truly understand the code.

EduCode Rwanda provides:

- A structured JavaScript course (165 lessons, 20 modules) aligned to the TVET ICT curriculum
- A browser-based code editor with live execution — no installs needed for students
- **Mwarimu**, a fine-tuned AI coding tutor that gives hint-first feedback (never the full answer) in English or Kinyarwanda
- A teacher dashboard for class management, assignment tracking, and progress monitoring

**Author:** Mitali Bela — BSc Software Engineering (ML specialization), African Leadership University, Kigali
**Supervisor:** Ndinelao Iitumba
**Capstone defence:** July 2026

---

## Core Features

### Mwarimu — AI Coding Tutor
Mwarimu watches the student's code and responds to questions or error triggers. It is designed to guide, not give answers — it asks questions, explains why a bug happened, and nudges the student toward the solution. Students can toggle between EN and RW (Kinyarwanda) at any time. The tutor uses a fine-tuned Qwen2.5-Coder-3B model hosted on HuggingFace, with a Gemini fallback and rule-based hints for common JavaScript errors.

### Structured Courses
JavaScript Fundamentals: 165 lessons across 20 modules. Each lesson is one of three types — **Reading** (theory), **Coding** (editor + auto-graded tests), or **Quiz**. Coding lessons run student code in a sandboxed iframe and check it against pre-written test cases. Each lesson awards XP.

### Student Dashboard
Progress bars, XP, streaks, level badges, achievements, and a "continue where you left off" card. XP is tied to lesson completion, not re-attempts, so gamification reflects real learning progress.

### Code Workspace (Free Practice)
An open editor with Mwarimu always present, not tied to any lesson. Students experiment freely and get contextual AI feedback on errors.

### Challenge Mode
Timed JavaScript quiz challenges, unlocked progressively. Each set covers one topic (variables, functions, loops, etc.) with 6 questions and awards XP on completion.

### Teacher Dashboard
Class overview, per-student progress tracking, assignment creation (coding or theoretical, with optional exam mode and timer), submission review, and manual grading with written feedback. An announcements system broadcasts messages to all enrolled students.

### Bilingual Throughout
Every interface element, lesson content, AI response, and error message is available in both English and Kinyarwanda.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, CodeMirror 6 |
| Routing | React Router v7 |
| Design system | Custom CSS (`design/educode.css`) — monochrome cream/warm-black palette, Geist font, fluid typography with `clamp()` |
| Auth & Database | Supabase (PostgreSQL + Row Level Security + Auth) |
| AI inference | HuggingFace ZeroGPU Space (`DavBelaa/educode-rwanda-mwarimu-v2`) |
| AI base model | Qwen2.5-Coder-3B-Instruct, fine-tuned with QLoRA (LoRA rank=8, α=16, trained on Kaggle 2×T4) |
| AI fallback | Google Gemini 2.0 Flash |
| RAG embeddings | Gemini `embedding-001` + Supabase pgvector |
| Translation | Google Gemini API (EN → KIN at inference time) |
| API layer | Vercel Serverless Functions (`/api/ai`, `/api/translate`, `/api/assess`) |
| Deployment | Vercel (frontend + API), Supabase Cloud (Frankfurt region) |

---

## Installation & Setup

### Prerequisites

- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- **npm** (included with Node.js)
- A **Supabase project** — [supabase.com](https://supabase.com) (free tier works)
- A **Google Gemini API key** — [aistudio.google.com](https://aistudio.google.com) (free tier works)

> **Note on local AI:** Mwarimu's AI responses call `/api/ai`, a Vercel Serverless Function. Use `vercel dev` (Step 5, Option A) to get working AI responses locally. `npm run dev` alone loads the full UI but AI calls will not work without the Vercel runtime.

---

### Step 1 — Clone the repository

```bash
git clone https://github.com/DavBelM/educode-rwanda.git
cd educode-rwanda
```

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Create the environment file

Create a `.env` file in the project root:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google Gemini (AI fallback + RAG embeddings + translation)
GEMINI_API_KEY=your_gemini_api_key

# Optional: override which HuggingFace Space Mwarimu uses
# HF_SPACE_URL=DavBelaa/educode-rwanda-mwarimu-v2
```

Get your Supabase values from: **Supabase Dashboard → Project Settings → API**.
Get your Gemini key from: **aistudio.google.com → Get API Key**.

### Step 4 — Set up the database

Open the **Supabase Dashboard → SQL Editor** and run the following migration files in order:

1. `seed.sql` — base schema, courses, and all 165 lessons
2. `gamification_migration.sql` — XP, streaks, achievements, and level system
3. `rag_migration.sql` — pgvector extension for RAG knowledge base
4. `rag_migration_patch_768.sql` — vector dimension patch (768-dimension embeddings)
5. `announcements_migration.sql` — teacher announcements schema

### Step 5 — Run the app

**Option A — Full local with working AI (recommended):**

```bash
npm install -g vercel     # install Vercel CLI once
vercel dev                # starts app + API routes together
```

App runs at `http://localhost:3000`. All features including Mwarimu work.

**Option B — UI only (fast, no AI):**

```bash
npm run dev
```

App runs at `http://localhost:5173`. All features except AI responses work.

### Step 6 — Build for production

```bash
npm run build
```

Output goes to `dist/`. To deploy, connect the GitHub repository in the Vercel dashboard and add the same environment variables under **Project → Settings → Environment Variables**.

---

## Related Files

```
educode-rwanda/
├── src/
│   ├── app/
│   │   ├── LandingPage.tsx            # Marketing / home page
│   │   ├── LoginPage.tsx              # Student / teacher login
│   │   ├── SignupPage.tsx             # New account registration
│   │   ├── Dashboard.tsx              # Student dashboard (XP, streak, progress)
│   │   ├── SelfLearnerDashboard.tsx   # Dashboard for self-enrolled learners
│   │   ├── TeacherDashboard.tsx       # Teacher class management
│   │   ├── SchoolAdminDashboard.tsx   # School admin overview
│   │   ├── CoursesPage.tsx            # Course catalogue
│   │   ├── LessonViewer.tsx           # Lesson renderer (reading / coding / quiz + Mwarimu rail)
│   │   ├── CodingWorkspace.tsx        # Free-practice code workspace
│   │   ├── ChallengePage.tsx          # Challenge set list
│   │   ├── ChallengeRunner.tsx        # Timed quiz runner
│   │   ├── TheoreticalAssignment.tsx  # Written assignment with exam mode
│   │   ├── MyResultsPage.tsx          # Student grades and teacher feedback
│   │   └── components/
│   │       ├── MwarimuPanel.tsx       # AI tutor chat panel (workspace)
│   │       └── AppNav.tsx             # Top navigation bar
│   ├── lib/
│   │   ├── ai.ts                      # Client-side AI helper functions
│   │   ├── auth.ts                    # Supabase auth context and hooks
│   │   ├── db.ts                      # Database queries (lessons, progress, assignments)
│   │   └── quiz-db.ts                 # Challenge/quiz database queries
│   └── styles/
│       ├── pages.css                  # Page-level layout and typography
│       └── workspace.css              # Code editor and workspace styles
├── design/
│   └── educode.css                    # Core design system (tokens, components, utilities)
├── api/
│   ├── ai.ts                          # /api/ai — Mwarimu inference (HF Space → Gemini → rule-based)
│   ├── translate.ts                   # /api/translate — EN→KIN translation via Gemini
│   └── assess.ts                      # /api/assess — AI-assisted teacher assessment helper
├── hf-space-v2/                       # HuggingFace Gradio Space source (deployed separately)
├── ml/                                # Model training notebooks and dataset preparation scripts
├── seed.sql                           # Base schema and all lesson content
├── gamification_migration.sql         # XP, streaks, achievements
├── rag_migration.sql                  # pgvector RAG setup
├── rag_migration_patch_768.sql        # Vector dimension correction
├── announcements_migration.sql        # Teacher announcements
└── vercel.json                        # Vercel routing and function configuration
```

---

## Testing Strategies & Results

### 1. Functional Testing — Feature walkthrough

Each core user flow was tested manually end-to-end across student, teacher, and admin roles:

| Feature | Test performed | Result |
|---|---|---|
| Student signup & class join | Created accounts; joined class via teacher code | Pass |
| Lesson progression — reading | Completed reading lessons; verified progress saves | Pass |
| Lesson progression — coding | Wrote code, ran tests, verified XP awarded on pass | Pass |
| Mwarimu AI feedback | Triggered errors, asked questions; verified guided hints returned | Pass |
| Mwarimu language toggle (EN ↔ RW) | Switched languages mid-conversation; responses translated | Pass |
| Teacher creates assignment | Created coding + theoretical assignments with due dates and exam mode | Pass |
| Student submits assignment | Submitted solution; verified teacher sees it in dashboard | Pass |
| Teacher grades + feedback | Entered marks and feedback; verified grade notification on student side | Pass |
| Challenge mode | Completed timed quiz sets; verified XP and unlock progression | Pass |
| Dark / light theme | Toggled theme; verified persistence across page reload | Pass |
| Announcements | Teacher posted announcement; students see it on dashboard | Pass |

### 2. Input Variation Testing — Different data values

Mwarimu and the coding lesson runner were tested with a range of student code inputs:

| Input scenario | Expected behaviour | Observed |
|---|---|---|
| Correct code on first attempt | Tests pass, XP awarded, confetti animation | Correct |
| `ReferenceError: X is not defined` | Mwarimu returns hint about variable typo | Correct |
| `SyntaxError`: missing closing quote | Mwarimu explains string syntax, points to line | Correct |
| `TypeError`: reassigning a `const` | Mwarimu explains `const` vs `let` | Correct |
| `SyntaxError`: unexpected token | Mwarimu points to missing bracket or semicolons | Correct |
| Empty editor submitted | Tests fail with "no output" message | Correct |
| Infinite loop (`while(true){}`) | Sandboxed iframe; does not crash the main page | Correct |
| Very long code (200+ lines) | Renders without overflow in CodeMirror editor | Correct |
| Student writes question in Kinyarwanda | Mwarimu responds in Kinyarwanda | Correct |
| Student asks for the full solution | Mwarimu declines and gives a guiding hint instead | Correct |

### 3. Role-based Testing — Different user types

Three separate accounts were tested:

- **Student:** lesson completion, XP accumulation, Mwarimu, challenges, viewing grades
- **Teacher:** class creation, posting assignments, grading submissions, announcements
- **School Admin:** school-level class management and student enrolment overview

### 4. Performance & Environment Testing

| Environment | Observation |
|---|---|
| Desktop 1920×1080, fast connection | Full layout renders; Mwarimu responds in 12–15 s (warm Space) |
| Laptop 1366×768, medium bandwidth | Responsive layout adapts correctly; all features functional |
| Mobile 375px viewport | Lesson viewer stacks to single column; workspace accessible |
| Slow network (3G throttle in DevTools) | SPA loads from cache; AI responses slower but complete |
| Firefox, Chrome, Edge | No browser-specific failures observed |
| Light theme / dark theme | Both themes tested; all components render correctly in both |

---

## Analysis of Results

### Objectives achieved

The project proposal identified four primary objectives:

**1. Bilingual learning experience** — Fully achieved. Every lesson, UI element, and AI response is available in English and Kinyarwanda. The toggle works mid-session without losing context or conversation history.

**2. AI-guided (not AI-giving) feedback** — Substantially achieved. Mwarimu is prompt-engineered to give hints and ask guiding questions rather than output working solutions. The system prompt, inline message instructions, and rule-based fallback all enforce this. Edge cases remain where the model provides more detail than intended on direct "show me the code" requests — this is a known fine-tuning target for v2.

**3. Structured curriculum alignment** — Achieved. The JavaScript Fundamentals course (165 lessons, 20 modules) maps to the Rwanda TVET Level 3 ICT module specification. The three lesson types (reading, coding, quiz) reflect the theoretical–practical balance required in TVET.

**4. Teacher tooling** — Achieved. Teachers can create classes, post assignments (with exam mode and countdown timer), review all submissions, grade, and send written feedback. The announcement system reaches enrolled students on their dashboard.

### Objectives partially met

**AI reliability** — The fine-tuned HuggingFace Space uses ZeroGPU and experiences cold-start delays (10–50 seconds depending on GPU queue). A Gemini fallback and an instant rule-based hint system cover most cases, but response latency is inconsistent. This is the primary limitation and is addressed in the v2 plan by migrating inference to Together AI.

**School pilot** — A 30-student pilot at Intango TSS was planned but had not started at the time of this submission. The platform is live and deployed; the pilot is the next capstone milestone.

### Findings beyond the original proposal

The rule-based hint system (added during development based on observed error patterns) covers approximately 80% of the errors TVET Level 3 students make, with zero latency and no API dependency. This pattern — fast deterministic responses for known patterns, AI for everything else — proved more reliable than relying entirely on the AI.

Gamification (streaks, XP, level badges) drove stronger re-engagement than anticipated: test users checked in on subsequent days to maintain streaks without being prompted.

---

## Deployment Plan & Execution

### Architecture overview

```
Browser (React SPA — Vite build)
       │
       ├── Static assets ──────────────────► Vercel CDN
       │                                     (auto-deployed from GitHub main)
       │
       ├── /api/ai ─────────────────────────────────────────────────────────┐
       │   Vercel Serverless Function (Node.js 20, 60 s limit)              │
       │   Step 1: Gemini embedding-001 → Supabase pgvector (RAG context)   │
       │   Step 2: HuggingFace Gradio Space — fine-tuned Qwen model (50 s)  │
       │   Step 3: Gemini 2.0 Flash fallback (8 s)                          │
       │   Step 4: Rule-based JS error hints (instant, no API)              │
       │                                                                     │
       ├── /api/translate ──────────────────► Gemini API (EN → KIN)         │
       └── /api/assess ───────────────────── Gemini API (teacher helper)    │
                                                                             │
Supabase (Frankfurt region, free tier)                                       │
  ├── PostgreSQL — users, lessons, progress, assignments, submissions        │
  ├── Auth — email/password sessions + JWT                                   │
  ├── Row Level Security — students can only access their own data           │
  └── pgvector — knowledge base for RAG (MDN + TVET curriculum chunks)      │
```

### Deployment steps (verified)

1. Code changes pushed to `main` branch on GitHub
2. Vercel detects the push and runs `npm run build` (Vite output to `dist/`)
3. Frontend is deployed to Vercel's global CDN automatically
4. `api/` directory functions are deployed as Node.js 20 Serverless Functions
5. Environment variables are set once in **Vercel → Project → Settings → Environment Variables**
6. Database schema changes are applied via Supabase SQL Editor (manual step)
7. Deployment is verified by visiting [educoderwanda.com](https://educoderwanda.com) and testing the full student flow

**Deployed and verified at:** [educoderwanda.com](https://educoderwanda.com)

---

## Recommendations & Future Work

### For educators and the TVET community

- **Adopt EduCode Rwanda for TVET ICT Level 3–5 classes.** The platform is free to use and aligned to the existing Rwanda TVET curriculum — teachers do not need to redesign lesson plans.
- **Use Mwarimu as a first-response tutor, not a replacement for teaching.** It handles the high-frequency "why is my code wrong?" questions that consume most of a teacher's class time, freeing teachers for higher-order discussion.
- **Do not rely on AI feedback alone for assessment.** Mwarimu is a tutor, not a grader. Teacher review of student code submissions remains essential for fair assessment.
- **Encourage Kinyarwanda use.** Students who ask Mwarimu questions in Kinyarwanda tend to write more complete questions — they aren't constrained by English vocabulary — which leads to better AI responses.

### Future development priorities

| Priority | Item |
|---|---|
| High | Migrate AI inference to Together AI — eliminates HuggingFace cold-start latency |
| High | 30-student pilot at Intango TSS and World Mission HS — real-world validation data |
| High | v2 model fine-tune with ES6+ coverage and Socratic dialogue examples |
| Medium | Offline / low-connectivity mode — cache lessons with a Service Worker |
| Medium | Pre-translated Kinyarwanda lesson content — faster than real-time translation |
| Medium | Parent / guardian read-only progress view |
| Low | Progressive Web App (PWA) manifest — enable "Add to Home Screen" on phones |
| Low | Additional courses — Website Development (HTML/CSS), aligned to TVET Level 4 |

---

## Author

**Mitali Bela**
BSc Software Engineering (ML specialization), African Leadership University, Kigali, Rwanda
JavaScript Instructor, Intango Technical Secondary School (TVET)
