-- RTB RQF Level 3 SOD — Full Course Seed (Briefs 3–7 complement)
-- Courses: SWDVC301, SWDPR301, SWDUX301, SWDVF301, GENGD301
-- Run in Supabase SQL Editor (service role bypasses RLS)
-- Safe to re-run: ON CONFLICT (id) DO NOTHING on courses & modules

-- ============================================================
-- COURSES
-- ============================================================
INSERT INTO courses (id, title, title_kin, description, difficulty, is_published) VALUES
  ('cccccccc-0000-0000-0000-000000000003',
   'Version Control',
   'Kugenzura Verisiyo',
   'Learn Git and GitHub to track changes, collaborate with teammates, and ship code safely. RTB RQF Level 3 — SWDVC301.',
   'beginner', true),
  ('dddddddd-0000-0000-0000-000000000004',
   'Project Requirements Analysis',
   'Isesengura ry''Ibisabwa mu Mushinga',
   'Gather customer needs, research requirements, and define user stories to plan software projects. RTB RQF Level 3 — SWDPR301.',
   'beginner', true),
  ('eeeeeeee-0000-0000-0000-000000000005',
   'UI/UX Design',
   'Igenamiterere ry''Urubuga',
   'Analyse user experience, define user personas, and create wireframes and prototypes using Figma. RTB RQF Level 3 — SWDUX301.',
   'beginner', true),
  ('ffffffff-0000-0000-0000-000000000006',
   'Vue.JS Framework',
   'Imiterere ya Vue.JS',
   'Build interactive single-page applications and a simple game using the Vue.js progressive JavaScript framework. RTB RQF Level 3 — SWDVF301.',
   'intermediate', true),
  ('a1a1a1a1-0000-0000-0000-000000000007',
   'Basic Graphic Design',
   'Ibintu bya Mbere mu Kuremera Imiterere',
   'Edit photos in Adobe Photoshop, create vector graphics in Illustrator, and export professional artwork. RTB RQF Level 3 — GENGD301.',
   'beginner', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- MODULES
-- ============================================================

-- SWDVC301 Modules
INSERT INTO course_modules (id, course_id, title, title_kin, order_index) VALUES
  ('cc000001-0000-0000-0000-000000000000', 'cccccccc-0000-0000-0000-000000000003', 'Setup Repository', 'Gushyiraho Ububiko', 1),
  ('cc000002-0000-0000-0000-000000000000', 'cccccccc-0000-0000-0000-000000000003', 'Manipulate Files', 'Gukora no Guhindura Dosiye', 2),
  ('cc000003-0000-0000-0000-000000000000', 'cccccccc-0000-0000-0000-000000000003', 'Ship Code', 'Kohereza Kode', 3)
ON CONFLICT (id) DO NOTHING;

-- SWDPR301 Modules
INSERT INTO course_modules (id, course_id, title, title_kin, order_index) VALUES
  ('dd000001-0000-0000-0000-000000000000', 'dddddddd-0000-0000-0000-000000000004', 'Identify Customer Needs', 'Kumenya Ibisabwa n''Umukiriya', 1),
  ('dd000002-0000-0000-0000-000000000000', 'dddddddd-0000-0000-0000-000000000004', 'Gather Project Requirements', 'Gukusanya Ibisabwa mu Mushinga', 2),
  ('dd000003-0000-0000-0000-000000000000', 'dddddddd-0000-0000-0000-000000000004', 'Determine User Requirements', 'Kugena Ibisabwa by''Ukoresha', 3)
ON CONFLICT (id) DO NOTHING;

-- SWDUX301 Modules
INSERT INTO course_modules (id, course_id, title, title_kin, order_index) VALUES
  ('ee000001-0000-0000-0000-000000000000', 'eeeeeeee-0000-0000-0000-000000000005', 'Analyse User Experience', 'Gusesengura Uburambe bw''Ukoresha', 1),
  ('ee000002-0000-0000-0000-000000000000', 'eeeeeeee-0000-0000-0000-000000000005', 'Define the User', 'Kugena Ukoresha', 2),
  ('ee000003-0000-0000-0000-000000000000', 'eeeeeeee-0000-0000-0000-000000000005', 'Design Mockup', 'Gukora Icyitegererezo', 3)
ON CONFLICT (id) DO NOTHING;

-- SWDVF301 Modules
INSERT INTO course_modules (id, course_id, title, title_kin, order_index) VALUES
  ('ff000001-0000-0000-0000-000000000000', 'ffffffff-0000-0000-0000-000000000006', 'Set Up Environment', 'Gutegura Ibikoresho', 1),
  ('ff000002-0000-0000-0000-000000000000', 'ffffffff-0000-0000-0000-000000000006', 'Apply Vue Framework', 'Gukoresha Imiterere ya Vue', 2),
  ('ff000003-0000-0000-0000-000000000000', 'ffffffff-0000-0000-0000-000000000006', 'Plan the Game', 'Gutegura Umukino', 3),
  ('ff000004-0000-0000-0000-000000000000', 'ffffffff-0000-0000-0000-000000000006', 'Develop the Game', 'Gukora Umukino', 4)
ON CONFLICT (id) DO NOTHING;

-- GENGD301 Modules
INSERT INTO course_modules (id, course_id, title, title_kin, order_index) VALUES
  ('a1000001-0000-0000-0000-000000000000', 'a1a1a1a1-0000-0000-0000-000000000007', 'Edit Photos with Adobe Photoshop', 'Guhindura Amafoto na Adobe Photoshop', 1),
  ('a1000002-0000-0000-0000-000000000000', 'a1a1a1a1-0000-0000-0000-000000000007', 'Manipulate Graphics with Adobe Illustrator', 'Gukora Intera na Adobe Illustrator', 2),
  ('a1000003-0000-0000-0000-000000000000', 'a1a1a1a1-0000-0000-0000-000000000007', 'Export Files', 'Kohereza Dosiye', 3)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- LESSONS — SWDVC301: Version Control
-- ============================================================

-- Module 1: Setup Repository
INSERT INTO course_lessons (module_id, title, title_kin, content, content_kin, lesson_type, order_index, xp_reward) VALUES
('cc000001-0000-0000-0000-000000000000',
'Introduction to Version Control',
'Inzobere mu Kugenzura Verisiyo',
'## What is Version Control?

**Version control** is a system that records changes to files over time so you can recall specific versions later. Think of it like a "save history" for your entire project — you can see who changed what, when, and why.

## Why Version Control Matters

Without version control, teams face serious problems:
- Overwriting each other''s work
- No way to go back to a working version after a bug
- Confusion about which file is the "latest" version
- Lost work when a hard drive fails

## Types of Version Control Systems

| Type | Description | Example |
|------|-------------|---------|
| **Local VCS** | Changes tracked only on your computer | RCS |
| **Centralised VCS (CVCS)** | Single server holds all versions | SVN (Subversion) |
| **Distributed VCS (DVCS)** | Every developer has a full copy | Git, Mercurial |

## Why Distributed is Best

Git is **distributed** — every developer''s machine has the complete history. This means:
- You can work **offline** and sync later
- No single point of failure — if the server goes down, everyone still has the history
- Faster operations (most happen locally)

## Key Concepts

**Repository (repo):** A folder tracked by Git — it contains your project files plus a hidden `.git` folder storing the history.

**Commit:** A snapshot of your project at a specific moment. Each commit has a unique ID and a message explaining what changed.

**Branch:** An independent line of development. The default branch is called `main` (or `master` in older projects).

**Merge:** Combining changes from one branch into another.

## Points to Remember

- Version control is essential for any professional software project
- Git is the most widely used VCS in the world (used by GitHub, GitLab, Bitbucket)
- Every commit should have a clear, descriptive message
- The `.git` folder should never be manually edited',
NULL, 'reading', 1, 10),

('cc000001-0000-0000-0000-000000000000',
'Description of Git',
'Ibisobanuro bya Git',
'## What is Git?

**Git** was created by Linus Torvalds in 2005 to manage the Linux kernel source code. It stands for "Global Information Tracker." Today it is used by millions of developers worldwide.

## Installing Git

### Windows
Download the installer from git-scm.com. During installation, select "Git Bash" and "Use Git from the Windows Command Line."

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install git
```

### Verify installation
```bash
git --version
# git version 2.43.0
```

## First-Time Setup

Before using Git, configure your identity (this appears in every commit):

```bash
git config --global user.name "Your Full Name"
git config --global user.email "you@example.com"
```

Check your configuration:
```bash
git config --list
```

## Core Git Commands

| Command | Purpose |
|---------|---------|
| `git init` | Initialise a new repository |
| `git status` | Show the state of your working directory |
| `git add` | Stage changes for the next commit |
| `git commit` | Save a snapshot with a message |
| `git log` | View commit history |
| `git diff` | Show changes not yet staged |

## The Three Areas of Git

Git has three main areas your files move through:

```
Working Directory → Staging Area → Repository
  (your edits)       (git add)     (git commit)
```

1. **Working Directory:** Where you edit files normally
2. **Staging Area (Index):** Where you prepare changes before committing
3. **Repository:** The permanent history stored in `.git`

## Your First Repository

```bash
mkdir my-project
cd my-project
git init          # creates .git folder
```

Create a file, then commit it:
```bash
echo "# My Project" > README.md
git add README.md
git commit -m "Initial commit: add README"
```

## Points to Remember

- Always run `git status` before and after commands to understand what Git sees
- Commit messages should be short (50 chars) but descriptive
- `git init` only needs to be run once per project',
NULL, 'reading', 2, 10),

('cc000001-0000-0000-0000-000000000000',
'Using GitHub Repository',
'Gukoresha Ububiko bwa GitHub',
'## What is GitHub?

**GitHub** is a cloud hosting service for Git repositories. It adds collaboration features on top of Git: pull requests, issues, code review, and team management. It is owned by Microsoft and is free for public repositories.

> Git = the tool. GitHub = the website that hosts your Git repositories.

## Creating a GitHub Account

1. Go to github.com and sign up
2. Choose a professional username (you will share this with employers)
3. Verify your email address

## Creating a Remote Repository

1. Click the **+** button → **New repository**
2. Name your repository (e.g. `my-first-project`)
3. Choose **Public** or **Private**
4. Do NOT initialise with README if you already have a local repo
5. Click **Create repository**

## Connecting Local to Remote

After creating the repo on GitHub, run these commands in your terminal:

```bash
# Add the remote (GitHub URL)
git remote add origin https://github.com/your-username/my-first-project.git

# Push your local commits to GitHub
git push -u origin main
```

The `-u` flag sets `origin main` as the default, so future pushes only need `git push`.

## Cloning an Existing Repository

To download someone else''s project (or your own on a new machine):

```bash
git clone https://github.com/username/repo-name.git
cd repo-name
```

## Key GitHub Concepts

| Term | Meaning |
|------|---------|
| **Remote** | A version of your repo hosted elsewhere (GitHub) |
| **Origin** | The default name for your GitHub remote |
| **Fork** | Your personal copy of someone else''s repo |
| **Pull Request (PR)** | A request to merge your changes into another branch |
| **Issue** | A task, bug report, or feature request |
| **Star** | Bookmark a repo you find useful |

## Viewing History on GitHub

GitHub shows:
- All commits with messages and timestamps
- Diffs (what changed in each commit)
- Contributors and activity graphs

## Points to Remember

- Never store passwords or secret keys in GitHub repositories — they are public!
- Use `.gitignore` to exclude files like `node_modules/` and `.env`
- A good README.md is the first thing people see on your repository',
NULL, 'reading', 3, 10);

-- Module 2: Manipulate Files
INSERT INTO course_lessons (module_id, title, title_kin, content, content_kin, lesson_type, order_index, xp_reward) VALUES
('cc000002-0000-0000-0000-000000000000',
'Add File Changes to Git Staging Area',
'Kongeramo Impinduka mu Nteruro ya Git',
'## The Staging Area Explained

The **staging area** (also called the Index) is a preparation zone. Before Git permanently records your changes, you select exactly what goes into the next commit.

This gives you control: you might have changed 5 files but only want to commit 2 of them.

## Checking File Status

```bash
git status
```

Git uses these labels:
- **Untracked:** New file Git has never seen
- **Modified:** Git knows this file, and it has changed
- **Staged:** Ready to be committed
- **Unmodified:** No changes since last commit

## Staging Commands

### Stage a single file
```bash
git add filename.txt
```

### Stage multiple files
```bash
git add file1.js file2.js
```

### Stage all changes in current directory
```bash
git add .
```

### Stage parts of a file (interactive)
```bash
git add -p filename.txt
```

## Unstaging a File

If you added a file by mistake:
```bash
git restore --staged filename.txt
```

## Viewing What is Staged

```bash
git diff --staged
```
This shows the exact lines that will be included in your next commit.

## Viewing Unstaged Changes

```bash
git diff
```
This shows what has changed in your working directory that has NOT been staged yet.

## Ignoring Files with .gitignore

Create a `.gitignore` file in your project root to tell Git which files to ignore:

```
# Node.js
node_modules/
npm-debug.log

# Environment variables
.env
.env.local

# Build output
dist/
build/

# OS files
.DS_Store
Thumbs.db
```

## Practical Workflow

```bash
# 1. Make changes to files
# 2. Check what changed
git status

# 3. Review the actual differences
git diff

# 4. Stage what you want to commit
git add src/app.js src/utils.js

# 5. Verify staging
git diff --staged

# 6. Commit
git commit -m "feat: add user login function"
```

## Points to Remember

- `git add .` stages everything — review with `git status` first
- The staging area lets you craft clean, focused commits
- A commit should represent one logical change, not "everything I did today"',
NULL, 'reading', 1, 10),

('cc000002-0000-0000-0000-000000000000',
'Commit Changes & Manage Branches',
'Gushyiraho Impinduka no Gucunga Amashami',
'## Making a Commit

A commit is a permanent snapshot saved to your repository history.

```bash
git commit -m "Your descriptive message here"
```

### Writing Good Commit Messages

A good message has two parts:
1. **Short summary (50 chars):** What changed
2. **Body (optional):** Why it changed

```
feat: add password validation to login form

Validates that passwords are at least 8 characters and
contain a number. Prevents weak passwords at signup.
```

Common prefixes (Conventional Commits):
- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation changes
- `refactor:` — code restructuring (no behaviour change)
- `test:` — adding tests

## Viewing Commit History

```bash
git log              # Full log with author and date
git log --oneline    # Compact one-line view
git log --graph      # Visual branch graph
```

## Branching

A **branch** is an independent line of work. The `main` branch is your production-ready code. You create feature branches to work without affecting `main`.

```
main:    A --- B --- C
                      \
feature:               D --- E
```

### Creating a Branch

```bash
git branch feature/login       # Create branch
git checkout feature/login     # Switch to it

# Or do both in one command:
git checkout -b feature/login
```

### Modern syntax (Git 2.23+):
```bash
git switch -c feature/login    # Create and switch
git switch main                # Switch to main
```

### Listing Branches

```bash
git branch           # Local branches
git branch -r        # Remote branches
git branch -a        # All branches
```

### Deleting a Branch

After merging, delete the branch:
```bash
git branch -d feature/login    # Safe delete (fails if unmerged)
git branch -D feature/login    # Force delete
```

## Typical Feature Branch Workflow

```bash
# 1. Start from main
git switch main
git pull

# 2. Create feature branch
git switch -c feature/user-profile

# 3. Work, commit, repeat
git add .
git commit -m "feat: add profile photo upload"

# 4. Push branch to GitHub
git push -u origin feature/user-profile

# 5. Open Pull Request on GitHub, get code review

# 6. After merge, clean up
git switch main
git pull
git branch -d feature/user-profile
```

## Points to Remember

- Never commit directly to `main` on a team project — always use a branch
- Each commit should be small and focused
- `git log --oneline --graph` is your best friend for visualising history',
NULL, 'reading', 2, 15);

-- Module 3: Ship Code
INSERT INTO course_lessons (module_id, title, title_kin, content, content_kin, lesson_type, order_index, xp_reward) VALUES
('cc000003-0000-0000-0000-000000000000',
'Fetching from GitHub',
'Gukura Kode kuri GitHub',
'## Remote Operations Overview

When working with a team, the remote repository on GitHub is the shared source of truth. You need commands to download updates from it.

## fetch vs pull

| Command | What it does |
|---------|-------------|
| `git fetch` | Downloads updates but does NOT merge them |
| `git pull` | Downloads AND merges into your current branch |

`git fetch` is safer — it lets you inspect before merging.

## git fetch

```bash
git fetch origin           # Download all remote changes
git fetch origin main      # Download only the main branch
```

After fetching, compare your branch with the remote:
```bash
git diff main origin/main
```

Then decide to merge:
```bash
git merge origin/main
```

## git pull

`git pull` = `git fetch` + `git merge` in one step:

```bash
git pull                   # Pull from tracked remote/branch
git pull origin main       # Explicitly pull main from origin
```

### Rebase instead of merge (cleaner history):
```bash
git pull --rebase origin main
```

## Keeping Your Branch Updated

While working on a feature branch, `main` may get new commits from teammates. Stay updated:

```bash
git switch feature/my-feature
git fetch origin
git rebase origin/main     # Apply your commits on top of latest main
```

## Handling Conflicts After Pull

If two people changed the same lines, Git cannot auto-merge — you get a conflict:

```
<<<<<<< HEAD
Your version of the line
=======
Teammate''s version of the line
>>>>>>> origin/main
```

To resolve:
1. Edit the file — keep what should stay
2. Remove the conflict markers (`<<<<`, `====`, `>>>>`)
3. Stage the resolved file: `git add filename.js`
4. Complete the merge: `git commit`

## Points to Remember

- Always `git pull` before starting new work to avoid conflicts
- `git fetch` before `git pull` gives you a chance to inspect changes
- Conflicts are normal — resolve them calmly line by line',
NULL, 'reading', 1, 10),

('cc000003-0000-0000-0000-000000000000',
'Push Files to Remote Branch',
'Kohereza Dosiye ku Gashami ka Kure',
'## Pushing to GitHub

After committing locally, use `git push` to upload your commits to GitHub.

## Basic Push

```bash
git push origin main         # Push main branch to GitHub
```

## First Push of a New Branch

When pushing a branch for the first time, set the upstream:

```bash
git push -u origin feature/login
```

After this, you only need `git push` for subsequent pushes on the same branch.

## Checking Remote Branches

```bash
git branch -r              # List remote branches
git remote -v              # Show remote URLs
```

## Push Rejected: What To Do

If your push is rejected, it usually means the remote has commits you don''t have:

```
! [rejected] main -> main (fetch first)
```

Solution:
```bash
git pull --rebase origin main   # Get remote changes first
git push                         # Now push succeeds
```

## Force Push (Use Carefully!)

Only use force push when you know what you are doing:

```bash
git push --force-with-lease      # Safer force push
```

**Never force push to `main`** on a shared repository — it rewrites history for everyone.

## Push Tags

Tags mark release versions:

```bash
git tag v1.0.0               # Create a tag
git push origin v1.0.0       # Push the tag
git push origin --tags       # Push all tags
```

## Setting Up SSH Authentication

HTTPS push requires username/password. SSH is more convenient:

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your@email.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add the key to GitHub → Settings → SSH and GPG keys
```

Then use SSH remote URLs: `git@github.com:username/repo.git`

## Points to Remember

- Push often — it backs up your work on GitHub
- Always pull before push to avoid rejection
- Use branch names that describe the feature: `feature/user-auth`, `fix/login-bug`',
NULL, 'reading', 2, 10),

('cc000003-0000-0000-0000-000000000000',
'Merging Branches on Remote Repository',
'Guhuza Amashami ku Bubiko bwa Kure',
'## What is Merging?

**Merging** combines the history of two branches into one. When your feature branch is complete, you merge it back into `main`.

## Local Merge

```bash
git switch main
git merge feature/login
```

Git does one of two things:

### Fast-Forward Merge
If `main` has not changed since you branched, Git simply moves the pointer forward — no merge commit created.

```
Before:  main: A-B     feature: A-B-C-D
After:   main: A-B-C-D
```

### Three-Way Merge
If `main` has new commits, Git creates a merge commit:

```
Before:  main: A-B-E     feature: A-B-C-D
After:   main: A-B-C-D-E-M  (M = merge commit)
```

## Pull Requests (PRs) on GitHub

In a team, **never merge directly** — use Pull Requests:

1. Push your branch: `git push -u origin feature/login`
2. On GitHub, click **Compare & pull request**
3. Write a description of your changes
4. Request a reviewer
5. Reviewer leaves comments
6. Fix issues and push more commits
7. Reviewer approves → you or the reviewer clicks **Merge**

## Squash and Merge

GitHub offers "Squash and merge" — combines all your branch commits into one clean commit on `main`. Good for keeping history readable.

## Resolving Merge Conflicts

```bash
git switch main
git merge feature/login
# CONFLICT (content): Merge conflict in src/app.js
```

Open `src/app.js` — find conflict markers:
```
<<<<<<< HEAD
const port = 3000;
=======
const port = process.env.PORT || 3000;
>>>>>>> feature/login
```

Keep the correct version, remove markers, then:
```bash
git add src/app.js
git commit -m "merge: resolve port conflict in app.js"
```

## Rebasing vs Merging

| Merge | Rebase |
|-------|--------|
| Preserves exact history | Creates a linear history |
| Creates a merge commit | No extra commits |
| Safer on shared branches | Cleaner for personal branches |

## After Merging

```bash
git branch -d feature/login      # Delete local branch
git push origin --delete feature/login  # Delete remote branch
```

## Points to Remember

- Use Pull Requests for all team merges — code review catches bugs early
- Delete branches after merging to keep the repo clean
- Resolve conflicts by understanding both changes, not just picking one blindly',
NULL, 'reading', 3, 15);

-- ============================================================
-- LESSONS — SWDPR301: Project Requirements Analysis
-- ============================================================

-- Module 1: Identify Customer Needs
INSERT INTO course_lessons (module_id, title, title_kin, content, content_kin, lesson_type, order_index, xp_reward) VALUES
('dd000001-0000-0000-0000-000000000000',
'Data Gathering Techniques',
'Uburyo bwo Gukusanya Amakuru',
'## Why Gather Data?

Before building any software, you must understand **who** will use it and **what** they need. Data gathering is the process of collecting information from stakeholders, users, and the environment to understand the problem you are solving.

## Stakeholders

A **stakeholder** is anyone who has an interest in or is affected by the software:
- **End users:** The people who will actually use it daily
- **Clients/customers:** Who pays for or commissioned the project
- **Managers:** Who oversee the business process the software supports
- **Technical teams:** Developers, testers, IT administrators

## Primary Data Gathering Methods

### 1. Interviews
Face-to-face or virtual conversations with stakeholders.

**Structured interview:** Fixed questions, consistent answers across participants.
**Unstructured interview:** Open conversation, exploratory.
**Semi-structured:** Prepared questions but allows follow-up.

**Tips:**
- Prepare questions in advance
- Listen more than you talk
- Ask "Why?" and "Can you show me how you do that today?"
- Take notes or record (with permission)

### 2. Questionnaires / Surveys
Written questions distributed to many users at once.

**Good for:**
- Large groups where individual interviews are impractical
- Collecting quantitative data (ratings, yes/no)

**Types of questions:**
- Closed (multiple choice, rating scales)
- Open (free text answers)

### 3. Observation
Watch users doing their actual work without interrupting.

**Two types:**
- **Active:** You ask questions as you watch
- **Passive:** You observe silently

Reveals what users do, not just what they say they do.

### 4. Document Analysis
Study existing documents: reports, forms, databases, manuals, organisational charts.

Helps understand current processes and data flows without taking up users'' time.

### 5. Focus Groups
Small group discussion (6–10 people) guided by a facilitator.

Good for exploring opinions and brainstorming ideas.

### 6. Workshops / JAD Sessions
Joint Application Development — structured workshops where stakeholders and developers work together to define requirements.

## Choosing the Right Method

| Situation | Best Method |
|-----------|-------------|
| Few users, complex domain | In-depth interviews |
| Many users, simple questions | Questionnaire |
| Understanding current workflow | Observation |
| Existing paper-based process | Document analysis |
| Gathering opinions from a group | Focus group |

## Points to Remember

- Always use more than one data gathering method to get a complete picture
- Data gathered is only useful if it is recorded, organised, and analysed
- Users often cannot fully articulate what they want — observation reveals hidden needs',
NULL, 'reading', 1, 10),

('dd000001-0000-0000-0000-000000000000',
'Interpretation & Organisation of Customer Needs',
'Gusobanura no Gutondeka Ibisabwa by''Umukiriya',
'## From Raw Data to Requirements

After gathering data, you have notes, recordings, and documents. The next step is to **interpret** this data — find patterns, extract needs, and separate important information from noise.

## Data Interpretation Steps

### Step 1: Transcribe and Organise
- Type up interview notes
- Convert survey responses into a spreadsheet
- Tag each piece of data by topic

### Step 2: Identify Patterns
Look for:
- **Recurring themes:** Multiple users mention the same problem
- **Contradictions:** Different users want opposite things (you will need to prioritise)
- **Gaps:** Nobody mentioned X — is that because they assume it exists, or because they don''t need it?

### Step 3: Classify Needs

**Functional needs:** What the system must DO
- "Users must be able to log in with their email and password"
- "The system must send a confirmation email after registration"

**Non-functional needs:** How the system must PERFORM
- "The page must load in under 3 seconds"
- "The system must support 500 simultaneous users"
- "All data must be encrypted"

**Constraints:** Limitations the system must work within
- "Must run on Android 10 and above"
- "Budget is 500,000 RWF"
- "Must be delivered in 3 months"

## Organising Customer Needs

### MoSCoW Prioritisation

| Category | Meaning |
|----------|---------|
| **Must have** | Critical — system fails without this |
| **Should have** | Important but not critical |
| **Could have** | Nice to have if time allows |
| **Won''t have** | Agreed out of scope for this version |

### Use Cases

A **use case** describes a goal a user wants to achieve using the system.

Format:
```
Use Case: Register for an account
Actor: New user
Precondition: User has an email address
Steps:
  1. User clicks "Sign Up"
  2. User enters name, email, password
  3. System validates inputs
  4. System sends verification email
  5. User clicks link in email
  6. Account is activated
Postcondition: User can log in
```

## Writing a Requirements Document

Structure:
1. **Executive summary** — what the project is and why
2. **Stakeholders** — who is involved
3. **Functional requirements** — numbered list
4. **Non-functional requirements**
5. **Constraints**
6. **Appendix** — raw data, interview notes

## Points to Remember

- Requirements must be **clear**, **complete**, **consistent**, and **testable**
- A requirement like "the system should be fast" is too vague — specify measurable criteria
- Prioritise with stakeholders — you cannot build everything at once',
NULL, 'reading', 2, 10);

-- Module 2: Gather Project Requirements
INSERT INTO course_lessons (module_id, title, title_kin, content, content_kin, lesson_type, order_index, xp_reward) VALUES
('dd000002-0000-0000-0000-000000000000',
'Types of Requirements & Research Methodology',
'Ubwoko bw''Ibisabwa no Gushakisha',
'## Functional vs Non-Functional Requirements

Every software project has two categories of requirements:

### Functional Requirements

Describe **what the system does** — its features and behaviours.

Examples:
- The system shall allow users to create an account using email
- The system shall display a list of available courses
- The system shall send password reset emails within 30 seconds

### Non-Functional Requirements (NFRs)

Describe **how well** the system performs. Also called quality attributes.

| Type | Description | Example |
|------|-------------|---------|
| **Performance** | Speed and responsiveness | Page loads in <2 seconds |
| **Security** | Data protection | All passwords hashed with bcrypt |
| **Reliability** | Uptime and error rate | 99.9% uptime per month |
| **Usability** | Ease of use | New users complete registration in <3 minutes |
| **Scalability** | Handle growth | Support 10× current user load |
| **Maintainability** | Easy to update | Codebase follows MVC pattern |
| **Portability** | Platform compatibility | Works on Chrome, Firefox, Edge, Safari |

## Research Methodology

When you need to understand a problem deeply before defining requirements, you conduct **research**.

### Qualitative Research
Explores *why* and *how* — understanding motivations, experiences, opinions.
- Interviews, focus groups, observation
- Results: themes, patterns, quotes
- Best for: understanding user behaviour

### Quantitative Research
Measures *how many* and *how much* — numerical data.
- Surveys with rating scales, usage analytics
- Results: statistics, percentages, averages
- Best for: validating assumptions at scale

### Mixed Methods
Combines both for a complete picture:
- Survey 200 users → identify top 3 problems (quantitative)
- Interview 10 users → understand *why* those are problems (qualitative)

## Requirements Elicitation vs Requirements Analysis

| Elicitation | Analysis |
|-------------|---------|
| Gathering raw information | Processing and structuring it |
| Talking to stakeholders | Writing formal requirements |
| "What do you need?" | "What does the system need to do?" |

## Conducting a Requirements Workshop

A structured workshop with stakeholders:

**Agenda:**
1. Introduction (15 min) — explain the purpose
2. Current state (30 min) — how things work today
3. Pain points (20 min) — what does not work
4. Desired future state (30 min) — what they want
5. Prioritisation (20 min) — MoSCoW voting
6. Wrap-up (15 min) — next steps

## Points to Remember

- Start with functional requirements — they define the scope
- NFRs are often forgotten until deployment and are expensive to add late
- Always ask "What happens if this requirement is NOT met?" to test its importance',
NULL, 'reading', 1, 10),

('dd000002-0000-0000-0000-000000000000',
'Analyse Results & Report Findings',
'Gusesengura Ibisubizo no Gutanga Raporo',
'## Analysing Research Results

Once data is collected, you need to turn it into actionable requirements.

## Thematic Analysis (Qualitative)

1. **Read through all data** — get familiar with what was said
2. **Code the data** — tag each idea with a label (e.g. "login problem", "slow loading")
3. **Group codes into themes** — related codes form a theme
4. **Review themes** — do they tell a coherent story?
5. **Name and define themes** — "Authentication Difficulties", "Performance Concerns"
6. **Write up findings**

## Statistical Analysis (Quantitative)

For survey data:

```
Question: How satisfied are you with the current system? (1-5)
Results:
  1 (Very dissatisfied): 35%
  2: 28%
  3: 22%
  4: 10%
  5 (Very satisfied): 5%

Mean: 2.2 → Most users are dissatisfied
```

Present with charts:
- **Bar charts** for comparing categories
- **Pie charts** for proportions
- **Line graphs** for trends over time

## Gap Analysis

Compare the current state to the desired state:

| Aspect | Current State | Desired State | Gap |
|--------|-------------|--------------|-----|
| Login | Username only | Email + 2FA | Need 2FA feature |
| Reporting | Manual Excel | Automatic PDF | Need report generation |
| Mobile | Desktop only | Mobile-friendly | Need responsive design |

## Writing the Requirements Report

### Structure

**Executive Summary** (1 page)
- Project name and purpose
- Key findings
- Top 3 recommendations

**Methodology** (how data was gathered)
- Sample size, methods used, dates

**Findings** (what you discovered)
- Organised by theme, with evidence (quotes, statistics)

**Requirements List** (numbered)
```
FR-001: The system shall allow users to register with email and password
FR-002: The system shall send a welcome email upon successful registration
NFR-001: Registration shall complete in under 5 seconds
```

**Recommendations** (your professional suggestions)

**Appendices** (raw data, interview transcripts)

## Presenting Findings to Stakeholders

- Use simple language — avoid technical jargon with non-technical stakeholders
- Lead with what they care about most (business impact)
- Use visuals — screenshots of competitor apps, diagrams of proposed flow
- Be prepared for challenges — stakeholders may disagree; listen and note concerns

## Points to Remember

- Requirements must be verifiable — "The system shall load in <3 seconds" can be tested
- Number all requirements for easy reference
- Get stakeholder sign-off on requirements before development begins — this prevents scope creep',
NULL, 'reading', 2, 10);

-- Module 3: Determine User Requirements
INSERT INTO course_lessons (module_id, title, title_kin, content, content_kin, lesson_type, order_index, xp_reward) VALUES
('dd000003-0000-0000-0000-000000000000',
'User Stories & Target Audience',
'Inkuru z''Abakoresha no Kugena Abo Mushingira',
'## What is a Target Audience?

Your **target audience** is the specific group of people who will use your software. Defining them precisely ensures you build the right features for the right people.

## Audience Analysis Framework

Ask these questions:

**Demographics:**
- Age range
- Education level
- Location / language
- Profession / role

**Technical literacy:**
- Are they developers? Office workers? Students?
- Do they use smartphones, desktops, or both?
- Comfort with technology (beginner, intermediate, expert)

**Goals and context:**
- Why do they need this software?
- When and where will they use it? (at a desk? on the go?)
- What problem are they currently solving without your software?

## User Personas

A **persona** is a fictional but realistic character representing a segment of your users. Based on real research, not assumptions.

### Persona Template

```
Name: Amina Uwimana
Age: 22
Occupation: TVET student, Year 3 Software Development
Location: Kigali, Rwanda
Device: Android smartphone (primary), school lab desktop
Technical level: Intermediate

Goals:
- Learn JavaScript to get a job as a junior developer
- Track her progress through the curriculum
- Practice coding exercises between classes

Frustrations:
- Textbooks are in English; she thinks better in Kinyarwanda
- Limited internet at home — needs offline access
- No way to get feedback on her code without the teacher

Quote: "I know how to write a function but I never know if I''ve done it correctly."
```

## User Stories

A **user story** describes a feature from the user''s perspective:

```
As a [type of user],
I want to [goal],
so that [benefit].
```

### Examples

```
As a student,
I want to see which lessons I have already completed,
so that I can focus on what I still need to learn.

As a teacher,
I want to view my students'' code submissions,
so that I can give individual feedback.

As a new user,
I want to sign up with my school email,
so that I can access my class assignments.
```

### Acceptance Criteria

Each user story has criteria that define when it is "done":

```
Story: As a student, I want to reset my password.

Acceptance Criteria:
✓ A "Forgot Password" link is visible on the login page
✓ Entering email sends a reset link within 60 seconds
✓ The reset link expires after 24 hours
✓ The user can set a new password with at least 8 characters
✓ After reset, the user is redirected to the login page
```

## Task Flow

A **task flow** shows the steps a user takes to complete one specific goal.

```
Goal: Student submits a coding assignment

[Open assignment] → [Read instructions] → [Write code]
→ [Run tests] → [Review results] → [Submit]
→ [See confirmation message]
```

## Points to Remember

- Create 3–5 personas — enough to represent your audience without being overwhelming
- User stories must come from real user data, not developer assumptions
- "The user wants a dashboard" is not a user story — identify the goal behind the request',
NULL, 'reading', 1, 10);

-- ============================================================
-- LESSONS — SWDUX301: UI/UX Design
-- ============================================================

-- Module 1: Analyse User Experience
INSERT INTO course_lessons (module_id, title, title_kin, content, content_kin, lesson_type, order_index, xp_reward) VALUES
('ee000001-0000-0000-0000-000000000000',
'UX Research & Brand Identity',
'Ubushakashatsi bwa UX no Icyangombwa cy''Ikigo',
'## Understanding UI vs UX

**UX (User Experience):** How a person feels when using a product — is it easy? frustrating? enjoyable?

**UI (User Interface):** The visual elements a user interacts with — buttons, colours, typography, layout.

> UX is the problem; UI is the solution. Great UI without good UX is a beautiful product nobody wants to use.

## What is UX Research?

**UX Research** is the systematic study of target users to understand their needs, behaviours, and pain points. It informs design decisions with evidence instead of guesses.

### Research Methods

| Method | When to Use | Output |
|--------|------------|--------|
| **User interviews** | Explore deep motivations | Themes and quotes |
| **Usability testing** | Evaluate an existing design | List of usability issues |
| **A/B testing** | Compare two design options | Conversion rate data |
| **Card sorting** | Understand mental models for navigation | Information architecture |
| **Surveys** | Collect opinions at scale | Statistical data |
| **Heuristic evaluation** | Expert review against UX principles | Issue list |

## The 10 Nielsen Norman Usability Heuristics

These are widely-accepted principles every designer should know:

1. **Visibility of system status** — Always keep users informed
2. **Match real world** — Use familiar language and concepts
3. **User control and freedom** — Allow undo and redo
4. **Consistency and standards** — Same word = same thing throughout
5. **Error prevention** — Design to prevent mistakes
6. **Recognition over recall** — Make options visible, not memorised
7. **Flexibility** — Support both novice and expert users
8. **Aesthetic and minimalist design** — No irrelevant information
9. **Help users with errors** — Clear error messages with solutions
10. **Help and documentation** — Easy to search, focused on tasks

## Brand Identity in Design

**Brand identity** is the visual language of an organisation. For UI designers, you must translate the brand into:

### Colour Palette
- **Primary colour:** Main brand colour (used most)
- **Secondary colour:** Accent, calls-to-action
- **Neutral colours:** Background, text, borders
- **Semantic colours:** Red (error), green (success), yellow (warning)

### Typography
- **Heading font:** Distinctive, establishes brand personality
- **Body font:** Highly readable, comfortable at small sizes
- Rule: use maximum 2–3 font families

### Logo Usage Rules
- Clear space (minimum padding around logo)
- Minimum sizes
- Allowed colour variations (full colour, white, dark)
- What NOT to do (rotate, stretch, add effects)

### Brand Voice
How the product speaks: formal or friendly? technical or simple?

EduCode Rwanda example: Clear, encouraging, bilingual — never intimidating.

## Points to Remember

- UX research must come BEFORE design — designing without research is guessing
- Brand guidelines ensure consistency across all screens and platforms
- Accessibility is part of UX: ensure sufficient colour contrast (4.5:1 ratio minimum for text)',
NULL, 'reading', 1, 10),

('ee000001-0000-0000-0000-000000000000',
'Defining Tasks & User Pain Points',
'Kugena Akazi no Ingorane z''Abakoresha',
'## What is Task Analysis?

**Task analysis** breaks down what a user is trying to accomplish into specific steps. It helps designers understand the real workflow before designing a solution.

## Hierarchical Task Analysis (HTA)

HTA breaks a goal into sub-tasks and steps:

```
Goal: Post a new assignment (teacher)
  1. Log in
  2. Select class
  3. Click "Create Assignment"
     3.1. Enter title and description
     3.2. Set due date
     3.3. Set marks (total marks, weight)
     3.4. Choose type (coding/theoretical)
     3.5. Add questions or test cases
  4. Publish assignment
  5. Verify it appears in student view
```

## Cognitive Walkthrough

A **cognitive walkthrough** evaluates a design by stepping through a task from the user''s perspective:

For each step, ask:
1. Will the user know what to do?
2. Will they see how to do it?
3. Will they understand the feedback after doing it?

## Identifying Pain Points

A **pain point** is any frustration, inefficiency, or barrier the user experiences.

### Categories of Pain Points

| Category | Description | Example |
|----------|-------------|---------|
| **Process** | The workflow is inefficient | "I have to click 7 times to submit an assignment" |
| **Support** | No help when stuck | "Error messages say ''Something went wrong'' — nothing useful" |
| **Financial** | Too expensive | "The mobile data cost to use this app is too high" |
| **Productivity** | Slows users down | "The page takes 10 seconds to load on mobile" |

### How to Find Pain Points

- **Direct observation:** Watch users struggle (they rarely complain out loud)
- **Customer support logs:** What do users contact support about?
- **User interviews:** Ask "What frustrates you most about the current system?"
- **Analytics:** High drop-off rates on a page = a pain point
- **Competitor reviews:** What do people hate about similar apps? (App Store reviews)

## Empathy Map

A tool to capture what a user thinks, feels, says, and does:

```
+------------------+------------------+
|   THINKS         |   FEELS          |
|  "Will my data   |  Anxious about   |
|   be private?"   |  data security   |
+------------------+------------------+
|   SAYS           |   DOES           |
|  "It''s okay,     |  Clicks quickly, |
|   I guess"       |  rarely reads    |
+------------------+------------------+
```

## Defining the Problem Statement (How Might We?)

Convert pain points into design challenges:

Pain point: "Students don''t know how many lessons are left in a module."

"How might we help students clearly understand their progress through each module?"

This reframes the problem as a design opportunity.

## Points to Remember

- Pain points discovered through observation are more reliable than self-reported ones
- Define tasks from the user''s perspective, not the system''s perspective
- "How might we?" questions invite creative solutions without prescribing a specific solution',
NULL, 'reading', 2, 10);

-- Module 2: Define the User
INSERT INTO course_lessons (module_id, title, title_kin, content, content_kin, lesson_type, order_index, xp_reward) VALUES
('ee000002-0000-0000-0000-000000000000',
'User Personas & User Journey Maps',
'Ibisura by''Abakoresha no Inzira z''Uburambe',
'## User Personas (Deep Dive)

A persona is a research-based archetype representing a group of users. It makes abstract user data concrete and relatable for the design team.

### Creating a Persona

**Step 1: Conduct research** (interviews, surveys, observation)

**Step 2: Identify patterns** — group participants with similar goals/behaviours

**Step 3: Build the persona**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  CLAUDE NKURUNZIZA
  Age: 28 | Teacher, TVET School
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Bio: Teaches JavaScript and Web Development.
  Has 45 students across 2 classes. Uses a
  smartphone and school desktop.

  Goals:
  • Track student progress efficiently
  • Give timely feedback on assignments
  • Identify struggling students early

  Frustrations:
  • Paper-based grading takes 2 days
  • No visibility into who is falling behind
  • Students submit work at different times

  Quote: "I want to spend my time teaching,
  not chasing submissions."
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Primary vs Secondary Personas

- **Primary persona:** The main design target — every decision is made for them
- **Secondary persona:** Important but secondary — design should not actively exclude them

## User Journey Map

A **user journey map** visualises the complete experience of a user achieving a goal — including emotions at each step.

### Components

1. **Actor:** The persona
2. **Scenario:** The goal they are trying to achieve
3. **Phases:** Stages of the journey (before, during, after)
4. **Actions:** What they do at each phase
5. **Thoughts:** What they are thinking
6. **Emotions:** How they feel (visualised as a curve: frustrated → neutral → delighted)
7. **Pain points and opportunities**

### Example: Student submitting first assignment

| Phase | Awareness | Registration | First Login | Submitting Work |
|-------|-----------|-------------|-------------|-----------------|
| **Action** | Teacher tells her about app | Creates account | Explores dashboard | Finds assignment, codes, submits |
| **Thought** | "Will this be hard?" | "Hope this is quick" | "Where do I start?" | "Did it save correctly?" |
| **Emotion** | 😐 Curious | 😊 Hopeful | 😕 Confused | 😰 Anxious |
| **Pain point** | — | Email verification slow | Dashboard unclear | No submission confirmation |
| **Opportunity** | — | One-click school login | Guided onboarding | Clear success message |

## How Journey Maps Drive Design Decisions

- Low-emotion moments → redesign to increase engagement
- High-frustration moments → eliminate pain points first
- Positive peaks → amplify and repeat this pattern

## Points to Remember

- One journey map per persona and goal — do not mix scenarios
- Include real emotions, not just steps — empathy is the point
- Journey maps should be reviewed with actual users to verify accuracy',
NULL, 'reading', 1, 10);

-- Module 3: Design Mockup
INSERT INTO course_lessons (module_id, title, title_kin, content, content_kin, lesson_type, order_index, xp_reward) VALUES
('ee000003-0000-0000-0000-000000000000',
'Wireframes & Figma Prototyping',
'Amashusho ya mbere no Gukora Icyitegererezo na Figma',
'## The Design Process Stages

```
Research → Ideation → Wireframe → Prototype → Test → Iterate
```

Jumping straight to high-fidelity design without wireframing wastes time on ideas that do not work.

## Wireframes

A **wireframe** is a low-fidelity sketch of a screen showing layout and content structure — without colours, fonts, or images.

### Why Wireframe?

- Cheap to create and cheap to change
- Focuses discussion on structure, not aesthetics
- Easy to share and get feedback before investing in visual design

### Fidelity Levels

| Level | Description | Tool |
|-------|-------------|------|
| **Low-fi** | Hand-drawn sketches | Paper and pen |
| **Mid-fi** | Grayscale digital boxes and labels | Figma, Balsamiq |
| **High-fi** | Pixel-perfect with real colours and content | Figma |

### Wireframe Elements

- **Boxes:** Images and media (marked with an X)
- **Lines:** Text (wavy lines for body text, thicker for headings)
- **Buttons:** Rectangles with action labels
- **Navigation:** Header with links
- **Annotations:** Notes explaining behaviour

## Figma Overview

**Figma** is a browser-based design tool for creating wireframes, UI designs, and interactive prototypes. It is free for individuals and supports real-time collaboration.

### Figma Interface

- **Layers panel (left):** All design elements organised hierarchically
- **Canvas (centre):** Your design workspace
- **Design panel (right):** Properties of selected elements
- **Assets panel:** Components, colours, fonts

### Key Figma Features

**Frames:** The equivalent of artboards — define screen sizes (Mobile 390×844, Desktop 1440×1024)

**Components:** Reusable design elements (buttons, cards, nav bars). Change the component once → all instances update.

**Auto Layout:** Frames that automatically resize to fit their contents. Essential for responsive design.

**Variants:** Multiple states of a component (button: default, hover, disabled, loading)

## Creating an Interactive Prototype in Figma

1. Design at least 2 screens (e.g. Login screen, Dashboard)
2. In Prototype mode, click a button → drag connection arrow to the next screen
3. Set trigger (On Click) and animation (Instant, Dissolve, Slide)
4. Click **Present** to test your prototype

### Sharing Prototypes

- Click **Share** → set to "Anyone with the link can view"
- Send link to stakeholders for feedback
- Use **Comment** mode for stakeholders to leave notes directly on the design

## Presenting a Prototype

Structure your presentation:
1. Remind the audience of the user and goal
2. Walk through the key user flow (not every screen)
3. Explain your design decisions — "I chose this layout because..."
4. Show the prototype in action
5. Ask for specific feedback: "Does this navigation make sense for our students?"

## Points to Remember

- Wireframe before you design — separate layout decisions from visual decisions
- In Figma, use components for everything you repeat — it saves enormous time
- A prototype is a tool for communication, not a finished product — expect feedback',
NULL, 'reading', 1, 15);

-- ============================================================
-- LESSONS — SWDVF301: Vue.JS Framework
-- ============================================================

-- Module 1: Set Up Environment
INSERT INTO course_lessons (module_id, title, title_kin, content, content_kin, lesson_type, order_index, xp_reward) VALUES
('ff000001-0000-0000-0000-000000000000',
'Vue.js Key Concepts',
'Ibintu by''ingenzi bya Vue.js',
'## What is Vue.js?

**Vue.js** (pronounced "view") is a progressive JavaScript framework for building user interfaces. It is designed to be incrementally adoptable — you can use just a little Vue in an existing page, or build a full Single-Page Application (SPA).

Created by Evan You in 2014, Vue is now one of the three most popular frontend frameworks alongside React and Angular.

## Why Vue?

| Feature | Description |
|---------|-------------|
| **Approachable** | Easy to learn if you know HTML, CSS, and JavaScript |
| **Performant** | Fast virtual DOM and fine-grained reactivity |
| **Versatile** | Works for simple widgets or complex SPAs |
| **Great tooling** | Vite, Vue DevTools, Vue Router, Pinia |

## Core Concepts

### Reactivity
Vue automatically updates the DOM when your data changes. You define data once, and every reference to it in the template stays in sync.

```javascript
const count = ref(0)  // reactive variable
// When count changes, every {{ count }} in template updates automatically
```

### Components
Vue apps are built from reusable **components**. A component combines:
- **Template:** HTML structure
- **Script:** Logic and data
- **Style:** Scoped CSS

```vue
<template>
  <button @click="count++">Clicked {{ count }} times</button>
</template>

<script setup>
import { ref } from ''vue''
const count = ref(0)
</script>

<style scoped>
button { background: #42b883; color: white; }
</style>
```

### The Options API vs Composition API

**Options API** (traditional, easier for beginners):
```javascript
export default {
  data() { return { count: 0 } },
  methods: { increment() { this.count++ } }
}
```

**Composition API** (modern, recommended for new projects):
```javascript
import { ref } from ''vue''
const count = ref(0)
const increment = () => count.value++
```

This course uses the **Composition API with `<script setup>`** — the current standard.

## Virtual DOM

Vue maintains a **virtual DOM** — a JavaScript copy of the real DOM. When data changes, Vue:
1. Updates the virtual DOM (fast)
2. Compares it with the previous version (diffing)
3. Only updates the real DOM where necessary (patching)

This makes Vue very fast for dynamic interfaces.

## Vue Ecosystem

| Package | Purpose |
|---------|---------|
| **Vite** | Build tool — fast dev server and bundler |
| **Vue Router** | Client-side routing (SPA navigation) |
| **Pinia** | State management (global data store) |
| **Axios** | HTTP requests to APIs |
| **Vue DevTools** | Browser extension for debugging |

## Points to Remember

- Vue is reactive by design — data and UI stay in sync automatically
- Everything in Vue is a component — think in components, not pages
- The Composition API with `<script setup>` is the modern way to write Vue',
NULL, 'reading', 1, 10),

('ff000001-0000-0000-0000-000000000000',
'Vue Project Installation & Folder Structure',
'Gushyiraho Umushinga wa Vue n''Uko Urindwi',
'## Installing Vue with Vite

**Vite** is the official build tool for Vue. It provides a fast dev server with Hot Module Replacement (HMR) — your browser updates instantly when you save a file.

### Prerequisites

- Node.js (v18 or higher) — download from nodejs.org
- npm (comes with Node.js)

### Create a New Project

```bash
npm create vue@latest my-game
```

You will be asked several questions:
```
✓ Add TypeScript?              → No (for now)
✓ Add JSX Support?             → No
✓ Add Vue Router?              → Yes
✓ Add Pinia?                   → Yes
✓ Add Vitest for testing?      → No
✓ Add ESLint?                  → Yes
✓ Add Prettier?                → Yes
```

Then:
```bash
cd my-game
npm install
npm run dev
```

Open http://localhost:5173 — your Vue app is running!

## Folder Structure

```
my-game/
├── public/              ← Static files served as-is
│   └── favicon.ico
├── src/                 ← Your application code
│   ├── assets/          ← Images, fonts, global CSS
│   ├── components/      ← Reusable Vue components
│   ├── router/          ← Vue Router configuration
│   │   └── index.js
│   ├── stores/          ← Pinia state stores
│   ├── views/           ← Page-level components
│   │   ├── HomeView.vue
│   │   └── AboutView.vue
│   ├── App.vue          ← Root component
│   └── main.js          ← Application entry point
├── index.html           ← HTML shell (Vite injects JS here)
├── package.json         ← Dependencies and scripts
└── vite.config.js       ← Vite configuration
```

## Key Files Explained

### main.js
```javascript
import { createApp } from ''vue''
import { createPinia } from ''pinia''
import App from ''./App.vue''
import router from ''./router''

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount(''#app'')
```
This creates the Vue app and mounts it to the `<div id="app">` in index.html.

### App.vue
```vue
<template>
  <RouterView />  <!-- Renders the current route''s component -->
</template>
```

### router/index.js
```javascript
import { createRouter, createWebHistory } from ''vue-router''
import HomeView from ''../views/HomeView.vue''

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: ''/'', component: HomeView },
    { path: ''/about'', component: () => import(''../views/AboutView.vue'') }
  ]
})
export default router
```

## npm Scripts

```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Build for production → dist/ folder
npm run preview  # Preview the production build locally
npm run lint     # Check code quality with ESLint
```

## Points to Remember

- `src/` is where you do all your work
- `public/` files are copied to the output unchanged — use for icons and static images
- `npm run build` creates the `dist/` folder ready for deployment',
NULL, 'reading', 2, 10);

-- Module 2: Apply Vue Framework
INSERT INTO course_lessons (module_id, title, title_kin, content, content_kin, lesson_type, order_index, xp_reward) VALUES
('ff000002-0000-0000-0000-000000000000',
'Vue Components & Data Binding',
'Ibice bya Vue no Guhuza Amakuru',
'## Single File Components (SFCs)

Every Vue component is a `.vue` file with three sections:

```vue
<template>
  <!-- HTML goes here -->
  <div class="card">
    <h2>{{ title }}</h2>
    <p>Score: {{ score }}</p>
    <button @click="addPoint">+1</button>
  </div>
</template>

<script setup>
import { ref, computed } from ''vue''

// Reactive state
const title = ref(''My Game'')
const score = ref(0)

// Method
function addPoint() {
  score.value++
}

// Computed property (derived value)
const message = computed(() => {
  return score.value >= 10 ? ''You win!'' : ''Keep going...''
})
</script>

<style scoped>
.card { padding: 20px; background: #f0f0f0; }
button { padding: 8px 16px; }
</style>
```

## Template Syntax

### Interpolation (displaying data)
```html
<p>{{ message }}</p>
<p>{{ score * 2 }}</p>
<p>{{ isLoggedIn ? ''Welcome!'' : ''Please log in'' }}</p>
```

### Directives

| Directive | Purpose | Example |
|-----------|---------|---------|
| `v-if` | Conditionally render | `v-if="isLoggedIn"` |
| `v-else` | Else block | `v-else` |
| `v-show` | Toggle visibility (keeps in DOM) | `v-show="loading"` |
| `v-for` | Loop and render lists | `v-for="item in items"` |
| `v-bind` / `:` | Bind attribute to data | `:class="activeClass"` |
| `v-on` / `@` | Listen to events | `@click="handleClick"` |
| `v-model` | Two-way binding for form inputs | `v-model="username"` |

### v-for Example
```html
<ul>
  <li v-for="(player, index) in players" :key="player.id">
    {{ index + 1 }}. {{ player.name }} — {{ player.score }} pts
  </li>
</ul>
```
Always use `:key` with `v-for` for Vue to track elements efficiently.

### v-model for Forms
```vue
<input v-model="username" placeholder="Enter your name" />
<p>Hello, {{ username }}!</p>
```
`v-model` keeps the input and the variable in sync automatically.

## Props: Passing Data to Child Components

```vue
<!-- ParentComponent.vue -->
<template>
  <PlayerCard :name="playerName" :score="playerScore" />
</template>

<!-- PlayerCard.vue -->
<script setup>
const props = defineProps({
  name: { type: String, required: true },
  score: { type: Number, default: 0 }
})
</script>
<template>
  <div>{{ props.name }}: {{ props.score }}</div>
</template>
```

## Emits: Sending Events to Parent

```vue
<!-- ChildComponent.vue -->
<script setup>
const emit = defineEmits([''score-updated''])
function handleClick() {
  emit(''score-updated'', 10)
}
</script>

<!-- Parent.vue -->
<ChildComponent @score-updated="handleScoreUpdate" />
```

## Points to Remember

- `ref()` makes primitive values reactive — always access with `.value` in script
- Use `computed()` for values derived from other reactive data
- Props flow down (parent → child), events emit up (child → parent)',
NULL, 'reading', 1, 15),

('ff000002-0000-0000-0000-000000000000',
'Vue Router & State Management with Pinia',
'Inzira ya Vue Router no Kubika Amakuru na Pinia',
'## Vue Router

**Vue Router** enables navigation between pages in a SPA without full page reloads.

### Defining Routes

```javascript
// src/router/index.js
import { createRouter, createWebHistory } from ''vue-router''

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: ''/'', name: ''home'', component: () => import(''../views/HomeView.vue'') },
    { path: ''/game'', name: ''game'', component: () => import(''../views/GameView.vue'') },
    { path: ''/score/:id'', name: ''score'', component: () => import(''../views/ScoreView.vue'') },
    { path: ''/:pathMatch(.*)*'', redirect: ''/'' }  // 404 redirect
  ]
})
export default router
```

### Navigating in Templates

```html
<!-- Declarative: use RouterLink (renders as <a> tag) -->
<RouterLink to="/">Home</RouterLink>
<RouterLink :to="{ name: ''game'' }">Play Game</RouterLink>
```

### Navigating Programmatically

```javascript
import { useRouter } from ''vue-router''
const router = useRouter()

// Navigate after an action
function startGame() {
  router.push(''/'')               // Go to home
  router.push({ name: ''game'' })  // Go by route name
  router.push(''/score/42'')      // Go with parameter
  router.back()                  // Browser back
}
```

### Route Parameters

```javascript
// Route: /score/:playerId
import { useRoute } from ''vue-router''
const route = useRoute()
const playerId = route.params.playerId  // Access the :playerId part
const searchTerm = route.query.q        // Access ?q=... query string
```

## Pinia State Management

**Pinia** is Vue''s official state management library. It stores data that needs to be shared across multiple components.

### When to Use Pinia?

When data needs to be accessed in components that are not parent-child, pass it through Pinia instead of prop-drilling.

### Defining a Store

```javascript
// src/stores/game.js
import { defineStore } from ''pinia''
import { ref, computed } from ''vue''

export const useGameStore = defineStore(''game'', () => {
  // State
  const score = ref(0)
  const playerName = ref('''')
  const isGameOver = ref(false)

  // Getters (computed)
  const level = computed(() => Math.floor(score.value / 10) + 1)

  // Actions
  function addPoints(points) {
    score.value += points
    if (score.value >= 100) isGameOver.value = true
  }

  function resetGame() {
    score.value = 0
    isGameOver.value = false
  }

  return { score, playerName, isGameOver, level, addPoints, resetGame }
})
```

### Using the Store in a Component

```vue
<script setup>
import { useGameStore } from ''../stores/game''
const game = useGameStore()
</script>

<template>
  <div>
    <p>Level {{ game.level }} — Score: {{ game.score }}</p>
    <button @click="game.addPoints(5)">+5 Points</button>
    <button @click="game.resetGame()">Restart</button>
  </div>
</template>
```

## Points to Remember

- Use `RouterLink` instead of `<a href>` — it prevents full page reloads
- Pinia stores are like "global reactive variables" shared across the whole app
- Keep stores focused: one store per domain (game, user, settings)',
NULL, 'reading', 2, 15);

-- Module 3: Plan the Game
INSERT INTO course_lessons (module_id, title, title_kin, content, content_kin, lesson_type, order_index, xp_reward) VALUES
('ff000003-0000-0000-0000-000000000000',
'Game Design & Planning',
'Gushyiraho Imigengereze y''Umukino',
'## Why Plan Before Coding?

A game without a plan becomes a confusing mix of features. Planning answers: What is the game? Who is it for? What do players actually do?

## Game Design Document (GDD)

A lightweight GDD captures the essential decisions:

### 1. Concept
```
Title: Code Quiz Challenge
Genre: Educational quiz game
Target audience: TVET Level 3 JavaScript students
Platform: Web browser (mobile-friendly)
One-line description: A timed quiz game that tests JavaScript knowledge
  through multiple-choice questions and earns XP.
```

### 2. Gameplay Loop

The **core loop** is what the player does repeatedly:

```
Start round → Read question → Select answer → See result →
  Gain/lose points → Next question → (Loop) → End of round → Score screen
```

### 3. Game Mechanics

**Mechanics** are the rules:
- 10 questions per round, randomly selected
- 30-second timer per question
- Correct: +10 points
- Wrong or timeout: 0 points, reveal correct answer
- Streak bonus: 3 correct in a row = +5 bonus points

### 4. Narrative

Even educational games benefit from a story frame:

```
Story: You are a junior developer joining a Kigali tech startup.
The team needs to verify your JavaScript skills before your
first project. Answer correctly to earn your place on the team.
```

### 5. Game States

Map out all the states the game can be in:

```
IDLE → LOADING → IN_GAME → QUESTION_RESULT → GAME_OVER → LEADERBOARD
```

### 6. Screens / Views

| Screen | Purpose | Key Elements |
|--------|---------|-------------|
| **Home** | Entry point | Title, Play button, Leaderboard link |
| **Game** | Active play | Question, 4 options, Timer, Score, Progress |
| **Result** | After each question | Correct/wrong feedback, explanation |
| **Game Over** | End of round | Final score, rank, Play again |
| **Leaderboard** | High scores | Player names and scores |

### 7. Data Structure

Plan your data before coding:

```javascript
// A question object
{
  id: 1,
  text: "What does the === operator check?",
  options: [
    "Value only",
    "Type only",
    "Value and type",
    "Reference"
  ],
  correct: 2,       // index of correct option
  explanation: "=== checks both value and type (strict equality)."
}

// Game state
{
  playerName: "Amina",
  currentQuestion: 0,
  score: 0,
  streak: 0,
  answers: [],      // track all selected answers
  timeLeft: 30
}
```

## Identifying Game Controls

For a web-based quiz:
- **Primary:** Mouse click / Touch tap (select answer)
- **Keyboard:** Number keys 1-4 for options (power user shortcut)
- **Timer:** Auto-advance after 30s if no answer

## Points to Remember

- Plan the core gameplay loop first — everything else builds around it
- Keep the scope small for a first game — one mechanic done well beats five half-done
- A GDD does not need to be long — 1–2 pages of clear decisions is enough',
NULL, 'reading', 1, 10);

-- Module 4: Develop Game
INSERT INTO course_lessons (module_id, title, title_kin, content, content_kin, lesson_type, order_index, xp_reward) VALUES
('ff000004-0000-0000-0000-000000000000',
'Build & Deploy the Game',
'Gukora no Gutangaza Umukino',
'## Building the Game Interface

With your game planned, translate each screen into a Vue component.

### Component Structure

```
src/
├── views/
│   ├── HomeView.vue        ← Landing screen
│   ├── GameView.vue        ← Main game screen
│   └── GameOverView.vue    ← Score screen
├── components/
│   ├── QuestionCard.vue    ← Shows question and options
│   ├── TimerBar.vue        ← Countdown timer
│   └── ScoreDisplay.vue    ← Current score
├── stores/
│   └── game.js             ← Pinia store for all game state
└── data/
    └── questions.js        ← Array of question objects
```

### Implementing the Timer

```vue
<script setup>
import { ref, onMounted, onUnmounted } from ''vue''
const props = defineProps({ duration: Number })
const emit = defineEmits([''timeout''])

const timeLeft = ref(props.duration)
let interval = null

onMounted(() => {
  interval = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      clearInterval(interval)
      emit(''timeout'')
    }
  }, 1000)
})

onUnmounted(() => clearInterval(interval))
</script>

<template>
  <div class="timer" :class="{ urgent: timeLeft <= 5 }">
    {{ timeLeft }}s
  </div>
</template>
```

### Fetching Questions from an API

```javascript
// Instead of hardcoded data, fetch from an API:
import { ref, onMounted } from ''vue''
import axios from ''axios''

const questions = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await axios.get(''https://api.example.com/questions?topic=javascript'')
    questions.value = response.data
  } catch (error) {
    console.error(''Failed to load questions'', error)
  } finally {
    loading.value = false
  }
})
```

## Deploying on Netlify

**Netlify** is a free hosting platform for static web apps (including Vue SPAs built with Vite).

### Method 1: Drag and Drop

```bash
# Build the project
npm run build

# This creates a dist/ folder
```

1. Go to netlify.com → Log in
2. Drag the `dist/` folder onto the Netlify dashboard
3. Your site is live in seconds at `random-name.netlify.app`

### Method 2: Continuous Deployment (Recommended)

1. Push your project to GitHub
2. In Netlify: **Add new site** → **Import from Git** → Select your repo
3. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Click **Deploy site**

Now every `git push` automatically deploys a new version.

### Fix: Vue Router on Netlify

SPAs need a redirect rule for Vue Router to work properly on Netlify:

Create `public/_redirects` file:
```
/* /index.html 200
```

This tells Netlify to serve `index.html` for all routes, letting Vue Router handle navigation.

### Custom Domain

1. Buy a domain (or use a free Netlify subdomain)
2. In Netlify: **Site settings** → **Custom domains** → Add domain
3. Update your domain''s DNS records as instructed

## Points to Remember

- Always `npm run build` and test the production build locally (`npm run preview`) before deploying
- The `_redirects` file in `public/` is essential for Vue Router to work on Netlify
- Netlify''s free tier is more than enough for a student project',
NULL, 'reading', 1, 15);

-- ============================================================
-- LESSONS — GENGD301: Basic Graphic Design
-- ============================================================

-- Module 1: Edit Photos with Photoshop
INSERT INTO course_lessons (module_id, title, title_kin, content, content_kin, lesson_type, order_index, xp_reward) VALUES
('a1000001-0000-0000-0000-000000000000',
'Introduction to Adobe Photoshop',
'Inzobere muri Adobe Photoshop',
'## What is Adobe Photoshop?

**Adobe Photoshop** is the industry-standard software for editing raster images (photos made of pixels). Used by photographers, graphic designers, web designers, and digital artists worldwide.

## Key Concepts

### Raster vs Vector

| Raster (Photoshop) | Vector (Illustrator) |
|--------------------|--------------------|
| Made of pixels | Made of mathematical paths |
| Loses quality when scaled up | Scales infinitely without quality loss |
| Best for photos | Best for logos, icons |

### Resolution and DPI/PPI

- **PPI (Pixels Per Inch):** How many pixels fit in one inch
- **72 PPI:** Standard for web/screen
- **300 PPI:** Required for print quality

Always work at 300 PPI for print projects. For web-only, 72 PPI is sufficient and keeps file sizes small.

## The Photoshop Interface

### Key Panels

**Tools Panel (left):** Move, Selection, Crop, Brush, Eraser, Text, etc.

**Layers Panel (right):** Every element on a separate layer — non-destructive editing.

**Properties Panel:** Context-sensitive settings for the selected tool.

**History Panel:** Undo multiple steps (not just Ctrl+Z once).

### Essential Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+Z / Cmd+Z | Undo |
| Ctrl+Alt+Z | Step back multiple times |
| Ctrl+S | Save |
| Ctrl+Shift+S | Save As |
| Ctrl+T | Free Transform |
| Ctrl+D | Deselect |
| V | Move tool |
| B | Brush tool |
| E | Eraser tool |
| Ctrl+0 | Fit canvas to screen |
| Spacebar | Pan (hand tool) |

## Opening and Creating Files

**Open existing image:** File → Open (Ctrl+O)

**New document:**
- File → New
- Set Width, Height, Resolution, Colour Mode (RGB for screen, CMYK for print)

**Common formats:**

| Format | Use case |
|--------|---------|
| **PSD** | Photoshop native — keeps all layers, for editing |
| **JPEG** | Photos for web — compressed, no transparency |
| **PNG** | Graphics with transparency |
| **WebP** | Modern web format — smaller than JPEG/PNG |
| **TIFF** | High-quality print files |

## Selection Tools

You must select an area before editing only that area.

| Tool | Use |
|------|-----|
| **Rectangular/Elliptical Marquee** | Simple geometric shapes |
| **Lasso** | Freehand drawing around an object |
| **Magic Wand** | Select by colour similarity |
| **Quick Selection** | Drag over what you want to select |
| **Select Subject** | AI auto-selects the main subject |

## Points to Remember

- Work non-destructively: use layers, masks, and adjustment layers — never edit the original pixel directly
- Ctrl+Z is your best friend — Photoshop has extensive undo history
- Save your working file as PSD; export as JPEG or PNG for final delivery',
NULL, 'reading', 1, 10),

('a1000001-0000-0000-0000-000000000000',
'Layers, Masks & Retouching',
'Amacupa, Imifubire no Gusunika Amafoto',
'## Layers

**Layers** are like transparent sheets stacked on top of each other. Each layer contains part of the image and can be edited independently.

### Layer Types

| Type | Description |
|------|-------------|
| **Normal layer** | Pixel content (photos, painted areas) |
| **Adjustment layer** | Non-destructive colour/exposure changes |
| **Text layer** | Editable text |
| **Shape layer** | Vector shapes |
| **Smart Object** | Embedded file that can be edited without quality loss |

### Working with Layers

```
Layer Panel buttons:
+  New Layer
🗑  Delete Layer
👁  Show/Hide Layer
🔒  Lock Layer
⊕  Add Layer Mask
```

**Layer Blending Modes:** Control how a layer interacts with layers below it.
- **Normal:** Default — fully covers what is below
- **Multiply:** Darkens (good for shadows)
- **Screen:** Lightens (good for glows)
- **Overlay:** Increases contrast

**Opacity:** Control transparency of an entire layer (0% = invisible, 100% = solid)

## Layer Masks

A **mask** lets you hide parts of a layer non-destructively. Black = hidden, White = visible.

**How to add a mask:**
1. Select the layer
2. Click the mask icon at the bottom of the Layers panel
3. Paint with a black brush to hide, white brush to reveal

Used for:
- Removing backgrounds without deleting pixels
- Blending two photos together smoothly
- Revealing text through an image

## Removing Background (Select & Mask)

Modern approach:
1. Open your image
2. Select → Subject (AI selects the person/object)
3. Select → Select and Mask → refine the edge
4. Output to: Layer Mask
5. The background is now hidden — add a new background layer below

## Retouching Tools

### Healing Brush
Fixes blemishes by sampling nearby texture:
- **Spot Healing Brush (J):** Click on a blemish — auto-heals
- **Healing Brush:** Alt+click to sample, then paint over the problem area

### Clone Stamp (S)
Copies pixels from one area and paints them elsewhere:
- Alt+click to set the source point
- Paint over the area you want to fix/replace

### Dodge and Burn
- **Dodge tool (O):** Lightens specific areas
- **Burn tool (O, shift):** Darkens specific areas

Used for: removing dark circles under eyes, adding highlights to hair, sculpting shadows.

## Adjustment Layers for Non-Destructive Editing

Instead of editing pixels directly, add an adjustment layer:

**Brightness/Contrast:** Quick exposure fix

**Curves:** Precise control over shadows, midtones, highlights

**Hue/Saturation:** Change colours, increase/decrease vibrancy

**Levels:** Set black point and white point for better contrast

**Vibrance:** Boosts less saturated colours (safer than Saturation)

## Points to Remember

- Always work on a duplicate of your original layer (Ctrl+J)
- Adjustment layers are non-destructive — you can always go back and change them
- Masks are the professional way to remove backgrounds — never use the eraser',
NULL, 'reading', 2, 10);

-- Module 2: Adobe Illustrator
INSERT INTO course_lessons (module_id, title, title_kin, content, content_kin, lesson_type, order_index, xp_reward) VALUES
('a1000002-0000-0000-0000-000000000000',
'Adobe Illustrator: Workspace & Vector Graphics',
'Adobe Illustrator: Aho Bakoreraho n''Intera',
'## What is Adobe Illustrator?

**Adobe Illustrator** is the industry-standard software for creating vector graphics. Unlike Photoshop''s pixel-based images, Illustrator uses mathematical paths — so artwork scales to any size without quality loss.

Used for: logos, icons, infographics, illustrations, posters, packaging.

## The Illustrator Interface

**Toolbar (left):** Selection, Pen, Shape, Type, Gradient tools

**Control Bar (top):** Context-sensitive options for selected object

**Artboard:** Your working canvas — can have multiple artboards in one file

**Panels (right):** Layers, Properties, Colour, Swatches, Appearance

## Core Concepts

### Paths and Anchor Points

Every shape in Illustrator is a **path** made of:
- **Anchor points:** The corners and curves that define the shape
- **Handles:** Control the direction and curvature of curved segments
- **Segments:** The lines or curves connecting anchor points

### The Pen Tool (P)

The most powerful tool — create any shape:
- **Click:** Create corner anchor point (sharp corner)
- **Click and drag:** Create smooth anchor point (curve)
- **Click first anchor:** Close the path

Practice tip: Trace simple shapes (circles, letters) to learn the pen tool.

### Shape Tools

| Tool | Shortcut | Creates |
|------|----------|---------|
| Rectangle | M | Squares and rectangles |
| Ellipse | L | Circles and ovals |
| Polygon | — | Regular polygons |
| Star | — | Stars |
| Line | \ | Straight lines |

Hold **Shift** while drawing to constrain proportions (perfect circle, perfect square).

## Fills and Strokes

Every vector object has:
- **Fill:** The colour inside the shape
- **Stroke:** The colour of the border/outline (can set width)

```
Fill: [solid colour] or [gradient] or [pattern] or [none]
Stroke: [colour] [weight in points] [dash pattern]
```

## Creating Vector Paths

### Pathfinder Operations

Combine shapes to create complex forms:

| Operation | Result |
|-----------|--------|
| **Unite** | Merges all selected shapes into one |
| **Minus Front** | Subtracts the top shape from the bottom |
| **Intersect** | Keeps only the overlapping area |
| **Exclude** | Removes the overlapping area |

### Example: Creating a Logo Mark

1. Draw a circle
2. Draw a smaller circle overlapping the first
3. Select both → Pathfinder → Minus Front
4. Result: a crescent moon shape

## Typography in Illustrator

**Type Tool (T):** Click to create a text point, or drag to create a text area.

Text can be:
- Placed on a straight path (point type)
- Flowed in a box (area type)
- Placed on a curved path (Type on a Path tool)

**Convert text to outlines:** Type → Create Outlines (Ctrl+Shift+O)
Makes text into vector shapes — safe to share without font files, but no longer editable as text.

## Colour in Illustrator

### Colour Modes
- **RGB:** For screen/web (0-255 per channel)
- **CMYK:** For print (percentages of Cyan, Magenta, Yellow, Black)

### Swatches Panel
Save brand colours as swatches for consistent use across the document.

### Colour Guides
Illustrator suggests harmonious colour palettes: complementary, triadic, analogous.

## Points to Remember

- Vector graphics are resolution-independent — always use Illustrator for logos
- Group related objects (Ctrl+G) to keep your workspace organised
- Use Layers in Illustrator to separate text, graphics, and backgrounds',
NULL, 'reading', 1, 10),

('a1000002-0000-0000-0000-000000000000',
'Brand Identity & Infographics',
'Icyangombwa cy''Ikigo n''Amakuru Agaragarira Amaso',
'## Brand Identity in Illustrator

**Brand identity** is the complete visual system of an organisation. Illustrator is the primary tool for creating brand assets.

### Components of Brand Identity

1. **Logo** — The primary brand mark
2. **Colour palette** — 2–5 colours with specific values
3. **Typography** — Font choices for headings and body text
4. **Iconography** — Consistent icon style
5. **Photography style** — Warm/cool, lifestyle/product, etc.
6. **Pattern/texture** — Optional decorative elements

## Logo Design Process

### 1. Research and Sketch
- Study the organisation, its values, industry
- Look at competitors (to differentiate)
- Sketch 20+ rough ideas on paper

### 2. Digitise in Illustrator
- Select 3–5 strongest sketches
- Trace with pen tool or build from shapes
- Explore in black and white first (colour comes last)

### 3. Colour Exploration
- Test the logo in the brand''s colour palette
- Check legibility on light AND dark backgrounds
- Check if it works in one colour (for embroidery, engraving)

### 4. Logo Variations
- **Primary logo:** Full version with icon + name + tagline
- **Secondary logo:** Icon + name (no tagline)
- **Icon only:** For small sizes (favicon, app icon)
- **Horizontal layout** and **stacked layout**

## Creating Infographics

An **infographic** presents data and information visually — making complex ideas easy to understand at a glance.

### Types of Infographics

| Type | Best for |
|------|---------|
| **Statistical** | Showing data with charts/percentages |
| **Timeline** | Events in chronological order |
| **Process** | Steps in a workflow |
| **Comparison** | Showing differences between options |
| **Geographic** | Data on a map |

### Infographic Design Principles

**1. Start with the story**
What is the ONE key message? Every element must support it.

**2. Use a clear visual hierarchy**
- Title → Subheadings → Data → Source
- Use size and weight to guide the eye

**3. Choose chart types wisely**

| Data type | Best chart |
|-----------|-----------|
| Parts of a whole | Pie chart (max 5 segments) |
| Comparing values | Bar chart |
| Trends over time | Line graph |
| Relationships | Scatter plot |

**4. Keep it simple**
- Remove chart gridlines when the data labels are visible
- Limit to 2–3 colours + neutrals
- White space is not wasted space

### Building a Chart in Illustrator

1. Window → Show Graph Tools
2. Select graph type (Bar, Column, Pie, Line)
3. Draw the graph area on your artboard
4. Enter data in the spreadsheet dialog
5. Click Apply
6. Ungroup and style with your brand colours

## Points to Remember

- A logo must work in black and white before adding colour
- Infographics should take complex data and make it immediately understandable
- Consistency is the hallmark of professional brand identity — use exact colour values',
NULL, 'reading', 2, 10);

-- Module 3: Export Files
INSERT INTO course_lessons (module_id, title, title_kin, content, content_kin, lesson_type, order_index, xp_reward) VALUES
('a1000003-0000-0000-0000-000000000000',
'Exporting Files: Formats, Quality & Artwork',
'Kohereza Dosiye: Ubwoko, Ubwiza n''Ibikorwa',
'## Why Exporting Matters

Your design is only as useful as the file you deliver. The wrong format causes: blurry logos, files too large to email, transparency lost, colours shifted.

## Understanding File Formats

### Raster Formats (Pixel-based)

| Format | Transparency | Best Use | Notes |
|--------|-------------|---------|-------|
| **JPEG** | No | Photos, complex images | Lossy compression — quality degrades each save |
| **PNG** | Yes | Web graphics, logos with background | Lossless — no quality loss |
| **PNG-8** | Yes (limited) | Simple icons, illustrations | Smaller than PNG-24 |
| **WebP** | Yes | Modern web | 25-35% smaller than JPEG at same quality |
| **TIFF** | Yes | Professional print | Large files, lossless |
| **GIF** | Yes | Simple animations | Only 256 colours |

### Vector Formats

| Format | Use |
|--------|-----|
| **SVG** | Web and screen — scalable, can be styled with CSS |
| **EPS** | Print production — widely supported by print shops |
| **PDF** | Universal document format — keeps vector quality |
| **AI** | Illustrator native file — for further editing |

## Choosing the Right Format

**Logo for a website:** SVG (or PNG if SVG not supported)

**Photo for a blog post:** WebP (with JPEG fallback)

**File to send to a printer:** PDF (CMYK colour mode, 300 DPI)

**Infographic for social media:** PNG (transparent background) or JPEG (white background)

**Animated banner:** GIF or animated WebP

## Image Quality Settings

### JPEG Quality

JPEG quality is a trade-off between file size and visual quality (0–100 or 0–12 depending on software):

| Quality | Use |
|---------|-----|
| 90–100 | Professional photography, large prints |
| 70–85 | Web photos — good balance |
| 50–69 | Thumbnails, email — small file size |
| Below 50 | Visible artifacts — avoid for final delivery |

### PNG Compression

PNG is lossless, but you can optimise file size:
- Use **PNG-8** instead of **PNG-24** for simple graphics with few colours
- Run through tools like **TinyPNG** (free online) for additional compression without quality loss

## Exporting from Photoshop

**For web:** File → Export → Export As (newer, recommended)
- Choose format (JPEG, PNG, WebP)
- Set quality
- Preview file size before saving

**For print:** File → Save As → TIFF or PDF

**Batch export:** File → Export → Export Layers to Files

## Exporting from Illustrator

**Single artboard:** File → Export → Export As

**Multiple artboards at once:** File → Export → Export for Screens (Ctrl+Alt+E)
- Select all artboards
- Choose format (SVG, PNG, PDF)
- Set scale factors (1x for normal, 2x for retina screens)

**Save as PDF for print:**
File → Save As → PDF → PDF/X-1a (print standard)

## Colour Mode for Print vs Screen

**IMPORTANT:** Convert colour mode before exporting for print:

In Illustrator: Edit → Document Colour Mode → CMYK

In Photoshop: Image → Mode → CMYK

**RGB → CMYK conversion causes colour shifts.** Always check with the print shop which colour mode they require.

## Organising Deliverables

When delivering files to a client or print shop, include:
```
Project_Name_Deliverables/
├── Logos/
│   ├── logo-primary.svg
│   ├── logo-primary.png
│   ├── logo-white.png
│   └── logo-dark.png
├── Print/
│   ├── poster-A3.pdf
│   └── business-card.pdf
└── Web/
    ├── banner-1200x628.png
    └── thumbnail-800x600.jpg
```

## Points to Remember

- Never deliver a JPEG when an SVG or PNG is needed — logos must be crisp at any size
- Always keep your original editable file (PSD, AI) — you will need it for revisions
- Compress images for web — a 5MB photo on a webpage is unacceptable; aim for under 200KB',
NULL, 'reading', 1, 10);
