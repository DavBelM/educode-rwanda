Design a Teacher Dashboard for "EduCode Rwanda" showing class overview, 
student progress, and AI-powered insights for managing 50+ students.

=== USER CONTEXT ===
Teacher: Managing 2-3 classes (50-150 students total)
Main needs: 
- Quick overview of who's struggling
- AI alerts for students needing help
- Easy assignment creation
- Progress tracking without manual grading

=== LAYOUT (Desktop) ===

TOP NAVIGATION:
- Logo + "Teacher Dashboard" (left)
- Class selector dropdown: "Level 3A - JavaScript" (center)
- Create Assignment button (blue, prominent) (center-right)
- Notifications bell (1 alert badge) (right)
- Language toggle [EN] [KIN] (right)
- Profile "Teacher MS" (far right)

METRIC CARDS ROW (4 cards across top):
Card 1: Total Students
- Large number: "52"
- Subtext: "Active this week: 48"
- Icon: 👥

Card 2: Average Progress
- Large number: "68%"
- Trend: +5% from last week ↑ (green)
- Icon: 📊

Card 3: Assignments Due
- Large number: "3"
- Subtext: "Submissions: 45/52"
- Icon: 📝

Card 4: Students Needing Help (PURPLE - AI powered)
- Large number: "8"
- Subtext: "AI detected struggles"
- Icon: 🤖 (purple)
- Glowing purple border to highlight AI feature

MAIN CONTENT AREA (70% width):

Section Title: "Abanyeshuri / Students" (bilingual)
Filters: 
- All | Struggling | On Track | Excelling
- Sort by: Progress | Last Active | Name

STUDENT PROGRESS TABLE:
Columns:
1. Student (Avatar + Name)
2. Progress Bar (visual, color-coded)
3. Last Active (timestamp)
4. Assignments (5/8 completed)
5. AI Status (purple flag if struggling)
6. Actions (Quick View button)

Show 8-10 students visible, then "Load More"

Example rows:
┌─────────────────────────────────────────────────────────────────┐
│ 👤 Jean Mugisha    ████████░░ 80%  2h ago  7/8  ✓   [View]    │ ← On track
│ 👤 Uwase Grace     ███░░░░░░░ 30%  3d ago  3/8  🚨  [View]    │ ← AI Alert (purple)
│ 👤 Kamanzi Paul    ██████████ 100% 1h ago  8/8  🏆  [View]    │ ← Excelling (gold)
│ 👤 Iradukunda Mary ██████░░░░ 60%  5h ago  5/8  ✓   [View]    │ ← On track
└─────────────────────────────────────────────────────────────────┘

Progress bar colors:
- 0-40%: Red
- 41-70%: Amber
- 71-100%: Green

AI Alert flag (🚨) shows when student:
- Hasn't been active in 3+ days
- Failing multiple assignments
- Same error pattern 5+ times
- Below 40% progress

SIDE PANEL (30% width):

AI INSIGHTS PANEL (Purple theme):
Title: "Ibisobanuro by'AI / AI Insights" (bilingual)
Icon: 🤖

Section 1: Class Struggles (Priority!)
"⚠️ 60% of students struggling with Arrays"
- Show which concept
- Show % of class affected
- Suggested action: "Teach mini-lesson on Arrays"
- Button: "Create Targeted Assignment" (purple)

Section 2: Individual Alerts (3-4 students)
"🚨 Uwase Grace - No activity in 3 days"
"🚨 Nkusi David - Stuck on same error 6 times"
"💡 Suggestion: Schedule 1-on-1 help session"
Button: "Contact Student" (purple outline)

Section 3: Positive Insights
"🌟 5 students completed ahead of schedule!"
"🎉 Class average improved by 12% this week"
"✅ 82% assignment completion rate"

Bottom of sidebar:
"View Detailed Analytics" link

BOTTOM ACTION BAR (Sticky):
- "Create Assignment" button (blue, large)
- "Export Progress Report" button (gray outline)
- "Send Class Announcement" button (gray outline)

=== COLORS ===
PRIMARY (Blue): #0ea5e9
- Primary actions
- Class selector
- "On track" indicators

SUCCESS (Green): #10b981
- High progress (70%+)
- Positive metrics
- Completed assignments

WARNING (Amber): #f59e0b
- Medium progress (40-70%)
- Due soon indicators

DANGER (Red): #ef4444
- Low progress (<40%)
- Overdue assignments
- Inactive students

AI PURPLE: #8b5cf6
- AI insights panel
- AI alerts
- "Students Needing Help" card
- AI-powered suggestions

GOLD: #fbbf24
- Excelling students (100% progress)
- Achievement indicators
- Top performers badge

NEUTRAL:
- Text: #1e293b
- Background: #f8fafc
- Cards: #ffffff
- Borders: #e2e8f0

=== KEY FEATURES TO SHOW ===

1. AI-POWERED ALERTS (Your differentiator!)
- Purple flags on struggling students
- AI insights sidebar always visible
- Proactive suggestions (not just data)
- Specific, actionable recommendations

2. QUICK ACTIONS
- One-click "Contact Student"
- One-click "Create Assignment"
- One-click "View Student Details"
- No deep navigation needed

3. DATA VISUALIZATION
- Progress bars (visual, not just numbers)
- Color-coded status (red/amber/green)
- Trend indicators (↑ ↓)
- At-a-glance metrics

4. BILINGUAL INTERFACE
- All labels in EN/KIN
- Toggle always visible
- Kinyarwanda names for students

=== STATES TO CREATE ===

1. MAIN DASHBOARD (Standard day)
- Mix of struggling/on-track/excelling students
- 2-3 AI alerts
- Some assignments due
- Realistic data

2. HIGH ALERT STATE
- Multiple students struggling (8+ AI alerts)
- Low class average (45%)
- Several overdue assignments
- AI suggests "Schedule review session"

3. SUCCESS STATE
- High class average (85%+)
- Most students on track
- Few/no AI alerts
- Positive AI insights: "Great week! 🎉"

=== ASSIGNMENT CREATION MODAL (Bonus) ===
If you have space, show the "Create Assignment" modal:
- Assignment title input
- Description textarea
- Due date picker
- Difficulty selector (Beginner/Intermediate/Advanced)
- "AI Generate Assignment" button (purple)
- Test cases input (for auto-grading)
- "Create & Assign" button (blue)

=== MOBILE RESPONSIVENESS ===
Responsive layout:
- Metric cards: 2x2 grid (instead of 4 across)
- Student table: Card view (instead of table)
- AI sidebar: Collapsible panel at bottom
- Bottom nav: Simplified with key actions

=== SPECIAL TEACHER-FOCUSED TOUCHES ===
- Time-savers emphasized (quick actions, AI alerts)
- Professional color scheme (less playful than student view)
- Data-driven (charts, trends, metrics)
- Show Rwanda context (student names, RWF in examples)
- Bilingual throughout (teachers comfortable with both)
- Clear hierarchy (most urgent info at top)

=== TYPOGRAPHY ===
- Headings: Inter 600/700
- Body: Inter 400
- Data/Numbers: Inter 700 (make metrics stand out)
- Student names: Inter 500
- Code/Technical: JetBrains Mono

Create desktop version with all 3 states.
Include the AI Insights panel prominently - this is your unique selling point!