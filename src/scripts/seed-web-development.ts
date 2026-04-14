/**
 * Seed script: Website Development (SWDWD301)
 * Run with: npx tsx src/scripts/seed-web-development.ts
 *          npx tsx src/scripts/seed-web-development.ts --sql   (generates seed.sql)
 *
 * Uses VITE_SUPABASE_URL + VITE_SUPABASE_SERVICE_ROLE_KEY from .env
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { randomUUID } from 'crypto';
import { writeFileSync } from 'fs';
dotenv.config({ path: '.env' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ?? process.env.VITE_SUPABASE_ANON_KEY!
);

// ─── Module 1 Lessons ─────────────────────────────────────────────────────────

const module1Lessons = [
  // ── 1.1 Keyboard Layout & Key Groups ────────────────────────────────────────
  {
    title: 'Keyboard Layout & Key Groups',
    order_index: 1,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `A **keyboard** is the primary input device for a computer. Understanding its layout helps you type code faster and more accurately.

## QWERTY Layout

The most common keyboard layout is **QWERTY** (named after the first six letters on the top row). In some French-speaking countries, the **AZERTY** layout is used — the positions of A, Z, Q, and W are swapped.

## Key Groups

| Group | Keys | Purpose |
|-------|------|---------|
| **Alphanumeric** | A–Z, 0–9 | Letters, numbers, symbols |
| **Function keys** | F1–F12 | Special commands (e.g. F5 = refresh, F12 = dev tools) |
| **Navigation keys** | Arrows, Home, End, Page Up, Page Down | Move cursor or scroll |
| **Numeric keypad** | 0–9, +, -, *, / | Faster number entry |
| **Modifier keys** | Shift, Ctrl, Alt, Win/Cmd, Caps Lock | Modify other key actions |
| **Editing keys** | Insert, Delete, Backspace | Edit text |
| **Escape / Enter** | Esc, Enter | Cancel or confirm |

## Special Characters for Coding

As a web developer, these keys are essential:

\`\`\`
< >   — HTML tags (angle brackets)
" '   — Strings and attributes
{ }   — CSS rules and JS objects
( )   — Functions and selectors
[ ]   — Arrays and attribute selectors
;     — End of CSS declarations
:     — CSS property separator
=     — Attribute values in HTML
/     — Closing tags and comments
#     — IDs in CSS and HTML
.     — Classes in CSS
@     — Media queries and at-rules
\`\`\`

## Tips for Coding

- Learn where **semicolons (;)**, **colons (:)**, and **angle brackets (< >)** are — you will type them constantly
- Use the **number row** (not numpad) for angle brackets and symbols while coding
- **Shift + key** gives you uppercase letters and symbols like ! @ # $ % & * ( ) _ +`,
  },

  // ── 1.2 Combination Keys ────────────────────────────────────────────────────
  {
    title: 'Combination Keys & Keyboard Shortcuts',
    order_index: 2,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `**Combination keys** (also called keyboard shortcuts) use two or more keys pressed together to perform actions quickly — much faster than using a mouse.

## Essential Shortcuts

### Editing
| Shortcut | Action |
|----------|--------|
| Ctrl + C | Copy selected text |
| Ctrl + V | Paste |
| Ctrl + X | Cut |
| Ctrl + Z | Undo |
| Ctrl + Y | Redo |
| Ctrl + A | Select all |
| Ctrl + S | Save file |
| Ctrl + F | Find (search) |

### Browser & Tabs
| Shortcut | Action |
|----------|--------|
| Ctrl + T | New tab |
| Ctrl + W | Close tab |
| Ctrl + R | Reload page |
| Ctrl + Shift + I | Open Developer Tools |
| F12 | Open Developer Tools |
| F5 | Refresh page |
| Ctrl + L | Focus address bar |

### Window Management
| Shortcut | Action |
|----------|--------|
| Alt + F4 | Close window |
| Alt + Tab | Switch between windows |
| Win + D | Show desktop |
| Win + L | Lock screen |

### Text Navigation
| Shortcut | Action |
|----------|--------|
| Home | Jump to start of line |
| End | Jump to end of line |
| Ctrl + Home | Jump to start of document |
| Ctrl + End | Jump to end of document |
| Ctrl + → | Move cursor one word right |
| Ctrl + ← | Move cursor one word left |

### In Code Editors (VS Code)
| Shortcut | Action |
|----------|--------|
| Ctrl + / | Toggle comment |
| Ctrl + D | Select next occurrence |
| Alt + ↑/↓ | Move line up/down |
| Ctrl + Shift + K | Delete line |
| Ctrl + \` | Open terminal |

> **Practice tip:** Every time you reach for your mouse to copy/paste, use Ctrl+C and Ctrl+V instead. Within a week it becomes automatic.`,
  },

  // ── 1.3 Typing Technique ───────────────────────────────────────────────────
  {
    title: 'Proper Typing Technique',
    order_index: 3,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `Good typing technique helps you code faster and prevents repetitive strain injuries. The goal is **touch typing** — typing without looking at the keyboard.

## Home Row Position

The **home row** is the middle row of the keyboard. Your fingers should rest here when not typing:

\`\`\`
Left hand:   A  S  D  F  (index finger on F — feel the bump)
Right hand:  J  K  L  ;  (index finger on J — feel the bump)
Thumbs: rest on Spacebar
\`\`\`

The small bumps on **F** and **J** help you find the home row without looking.

## Finger Assignments

Each finger covers specific keys:

| Finger | Left hand keys | Right hand keys |
|--------|---------------|-----------------|
| Index | F, G, R, T, V, B | J, H, Y, U, N, M |
| Middle | D, E, C | K, I, , |
| Ring | S, W, X | L, O, . |
| Pinky | A, Q, Z, Shift, Ctrl | ;, P, /, Shift, Enter |
| Thumb | Left Spacebar | Right Spacebar |

## Correct Posture

- **Back**: Straight, supported by chair
- **Wrists**: Level with keyboard, not bent up or down
- **Elbows**: At roughly 90° angle
- **Feet**: Flat on the floor
- **Screen**: At eye level, about 50–70 cm away
- **Eyes**: On the screen, not the keyboard

## Touch Typing Tips

1. **Start slow** — accuracy matters more than speed at first
2. **Return to home row** after every keystroke
3. **Do not look at the keyboard** — trust your finger memory
4. **Practice daily** — even 10 minutes a day builds muscle memory
5. Use typing practice sites to build speed progressively

## Why It Matters for Web Development

Writing HTML, CSS, and JavaScript requires lots of special characters. The faster you can type \`<div class="container">\` without hunting for keys, the more productive you will be. Professional developers type 60–100+ words per minute.`,
  },

  // ── 1.4 Keyboard Characters in HTML (coding) ────────────────────────────────
  {
    title: 'Practice: Typing HTML',
    order_index: 4,
    lesson_type: 'coding',
    xp_reward: 15,
    content: 'Practice typing the special characters used in HTML by writing a complete web page from scratch.',
    exercise_data: {
      instructions: `Write a complete HTML page in the HTML editor that includes:

1. A \`<!DOCTYPE html>\` declaration
2. \`<html>\`, \`<head>\`, and \`<body>\` tags
3. A \`<title>\` with "My Keyboard Practice"
4. An \`<h1>\` heading: "Special Characters I Use in HTML"
5. A \`<p>\` paragraph explaining what HTML tags look like
6. An unordered list \`<ul>\` with 5 items listing special characters: < >, " ", { }, ( ), ;

**Challenge:** Focus on typing every character yourself — angle brackets, quotes, and semicolons are the most important characters in web development.`,
      starter_code: '',
      hint: 'Start with <!DOCTYPE html> then <html lang="en">. Inside <head> add a <title>. Inside <body> add your heading, paragraph, and list. Each <li> item in the list should name a character like &lt; &gt; for angle brackets.',
    },
  },

  // ── 1.5 Keyboard Skills Quiz ────────────────────────────────────────────────
  {
    title: 'Keyboard Skills Quiz',
    order_index: 5,
    lesson_type: 'quiz',
    xp_reward: 10,
    content: 'Test your knowledge of keyboard layouts, shortcuts, and typing technique.',
    exercise_data: {
      questions: [
        {
          id: 'q1',
          text: 'What is the name of the most common keyboard layout used globally?',
          options: ['AZERTY', 'QWERTY', 'DVORAK', 'COLEMAK'],
          correct: 1,
        },
        {
          id: 'q2',
          text: 'Which keys form the "home row" for the LEFT hand?',
          options: ['Q W E R', 'A S D F', 'Z X C V', 'F G H J'],
          correct: 1,
        },
        {
          id: 'q3',
          text: 'What does Ctrl + Z do?',
          options: ['Redo', 'Zoom in', 'Undo', 'Select all'],
          correct: 2,
        },
        {
          id: 'q4',
          text: 'Which keyboard shortcut opens Developer Tools in most browsers?',
          options: ['Ctrl + D', 'F12', 'Alt + T', 'Ctrl + B'],
          correct: 1,
        },
        {
          id: 'q5',
          text: 'What is the purpose of the Caps Lock key?',
          options: [
            'Lock the numeric keypad',
            'Toggle typing all uppercase letters',
            'Prevent accidental key presses',
            'Lock the function keys',
          ],
          correct: 1,
        },
        {
          id: 'q6',
          text: 'Which shortcut selects all text in a document?',
          options: ['Ctrl + S', 'Ctrl + V', 'Ctrl + A', 'Ctrl + F'],
          correct: 2,
        },
        {
          id: 'q7',
          text: 'In touch typing, which finger presses the letter "G"?',
          options: ['Left ring finger', 'Left index finger', 'Right index finger', 'Left middle finger'],
          correct: 1,
        },
        {
          id: 'q8',
          text: 'Which of these characters is used to open an HTML tag?',
          options: ['(', '{', '<', '['],
          correct: 2,
        },
        {
          id: 'q9',
          text: 'What does the shortcut Ctrl + T do in a web browser?',
          options: ['Open a new tab', 'Close the current tab', 'Open bookmarks', 'Translate the page'],
          correct: 0,
        },
        {
          id: 'q10',
          text: 'What is the correct posture advice for typing at a computer?',
          options: [
            'Lean forward toward the screen',
            'Keep wrists bent upward on the keyboard',
            'Sit with back straight, wrists level, feet flat on floor',
            'Hold the keyboard on your lap',
          ],
          correct: 2,
        },
      ],
    },
  },
];

// ─── Module 2 Lessons ─────────────────────────────────────────────────────────

const module2Lessons = [
  // ── 2.1 How the Web Works ───────────────────────────────────────────────────
  {
    title: 'How the Web Works',
    order_index: 1,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `Before writing code, it helps to understand what the web actually is and how it works.

## Key Terms

**Website** — A collection of related web pages linked together, hosted on a server, and accessible via a URL.

**Webpage** — A single document (an HTML file) that a browser can display. A website is made of many web pages.

**Web browser** — Software that requests, downloads, and displays web pages. Common browsers: **Chrome, Firefox, Safari, Edge, Opera**.

**URL** (Uniform Resource Locator) — The address of a web page:
\`\`\`
https://www.example.com/about
  │       │              │
  │       domain         path
  protocol (HTTPS)
\`\`\`

**Hyperlink** — A clickable element that navigates to another page or resource. Created with the \`<a>\` tag.

**Web server** — A computer that stores website files and sends them to browsers on request.

## How a Page Loads

1. You type a URL in the browser
2. Browser sends a **request** to the web server
3. Server sends back an **HTML file** (response)
4. Browser reads the HTML and requests any linked CSS and JavaScript files
5. Browser **renders** (draws) the page on screen

## Types of Websites

| Type | Purpose | Example |
|------|---------|---------|
| **E-commerce** | Sell products online | Amazon, Jumia |
| **Blog** | Share articles, personal journal | WordPress blogs |
| **Portfolio** | Showcase work/skills | Designer portfolios |
| **Corporate** | Business information | Company websites |
| **Social media** | User interaction and sharing | Facebook, Twitter |
| **Educational** | Learning content | EduCode Rwanda |

## HTTP vs HTTPS

- **HTTP** — HyperText Transfer Protocol, basic web communication
- **HTTPS** — Secure version (uses SSL/TLS encryption). Always use HTTPS for websites that handle sensitive data.

The padlock icon in your browser shows a site is using HTTPS.`,
  },

  // ── 2.2 HTML Document Structure ─────────────────────────────────────────────
  {
    title: 'HTML Document Structure',
    order_index: 2,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `**HTML** (HyperText Markup Language) is the standard language for creating web pages. It describes the structure and content of a page using **tags**.

## HTML5

The current version is **HTML5**, released in 2014. It introduced semantic tags, native audio/video support, canvas, and more.

## HTML Tags

Tags are keywords surrounded by angle brackets:
\`\`\`html
<tagname>Content goes here</tagname>
\`\`\`

- **Opening tag**: \`<p>\`
- **Closing tag**: \`</p>\` (note the slash)
- **Self-closing tag**: \`<br>\`, \`<img>\`, \`<input>\` (no content, no closing tag)

## HTML Document Skeleton

Every valid HTML page follows this structure:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title</title>
</head>
<body>
  <!-- Visible content goes here -->
  <h1>Hello World</h1>
  <p>This is a paragraph.</p>
</body>
</html>
\`\`\`

## What Each Part Does

| Tag | Purpose |
|-----|---------|
| \`<!DOCTYPE html>\` | Tells the browser this is HTML5 |
| \`<html lang="en">\` | Root element; lang sets the language |
| \`<head>\` | Contains metadata — not visible on the page |
| \`<meta charset="UTF-8">\` | Supports all characters (including accents) |
| \`<meta name="viewport"...>\` | Makes the page work on mobile screens |
| \`<title>\` | The text shown in the browser tab |
| \`<body>\` | All visible content goes here |
| \`<!-- comment -->\` | Comments — ignored by the browser |

## Points to Remember

- HTML is **not** case-sensitive, but lowercase tags are the standard
- Always close your tags — every \`<div>\` needs a \`</div>\`
- **Indentation** makes HTML readable — indent nested elements
- HTML handles the **structure**; CSS handles the **style**`,
  },

  // ── Your First Web Page ─────────────────────────────────────────────────────
  {
    title: 'Your First Web Page',
    order_index: 3,
    lesson_type: 'coding',
    xp_reward: 20,
    content: 'Build a complete HTML page from scratch using the correct document structure.',
    exercise_data: {
      instructions: `Create a complete HTML page for an EduCode Rwanda student profile:

**Requirements:**
1. Start with \`<!DOCTYPE html>\`
2. Add \`<html lang="en">\`, \`<head>\`, and \`<body>\` tags
3. In \`<head>\`: charset meta tag, viewport meta tag, title: "Student Profile"
4. In \`<body>\` add:
   - An \`<h1>\` with your name
   - An \`<h2>\` with "EduCode Rwanda Student"
   - A \`<p>\` with a short introduction about yourself
   - Another \`<p>\` with "Course: Website Development"
5. Add an HTML comment above the h1 explaining what the page is

Your page should display nicely in the preview panel.`,
      starter_code: '',
      hint: 'Start with <!DOCTYPE html> on line 1. Then <html lang="en">, <head>, and inside head add <meta charset="UTF-8">, <meta name="viewport" content="width=device-width, initial-scale=1.0">, and <title>. Close </head>, open <body>, add your content, close </body></html>.',
    },
  },

  // ── 2.2 HTML Headings & Paragraphs ──────────────────────────────────────────
  {
    title: 'HTML Headings & Paragraphs',
    order_index: 4,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `## Heading Tags

HTML has six levels of headings, from \`<h1>\` (most important) to \`<h6>\` (least important):

\`\`\`html
<h1>Main Page Title</h1>
<h2>Section Heading</h2>
<h3>Subsection</h3>
<h4>Sub-subsection</h4>
<h5>Minor heading</h5>
<h6>Smallest heading</h6>
\`\`\`

**Rules for headings:**
- There should be only **one \`<h1>\`** per page (the main title)
- Use headings in order — don't skip from h1 to h4
- Headings create a content hierarchy (important for SEO and accessibility)

## Paragraph Tags

\`\`\`html
<p>This is a paragraph of text. Browsers automatically
add space before and after each paragraph.</p>

<p>This is a second paragraph.</p>
\`\`\`

## Line Breaks & Horizontal Rules

\`\`\`html
<!-- Line break (self-closing) — use sparingly -->
<p>First line<br>Second line on same paragraph</p>

<!-- Horizontal rule — draws a dividing line -->
<hr>
\`\`\`

## Whitespace in HTML

HTML ignores extra spaces and line breaks in your code. This:
\`\`\`html
<p>Hello     World</p>
\`\`\`
Displays as: **Hello World** (extra spaces collapsed to one)

To force a non-breaking space, use: \`&nbsp;\`

## Block vs Inline

- \`<h1>\`–\`<h6>\` and \`<p>\` are **block elements** — they start on a new line and take full width
- Later you will learn **inline elements** that flow within a line of text

## Points to Remember

- Use headings for structure, not just to make text big (use CSS for that)
- Every block of text should be in a \`<p>\` tag
- \`<br>\` is for line breaks inside a paragraph, not for adding vertical space between elements`,
  },

  // ── Format a Blog Post ───────────────────────────────────────────────────────
  {
    title: 'Format a Blog Post',
    order_index: 5,
    lesson_type: 'coding',
    xp_reward: 15,
    content: 'Practice using headings, paragraphs, line breaks, and horizontal rules to structure a blog post.',
    exercise_data: {
      instructions: `Create a blog post page about "Learning Web Development in Rwanda":

**Structure your page with:**
1. \`<h1>\`: "Learning Web Development in Rwanda"
2. \`<p>\`: Publication date — "Published: April 2025"
3. \`<hr>\` — a horizontal divider
4. \`<h2>\`: "Why Web Development Matters"
5. \`<p>\`: 2–3 sentences about opportunities in tech in Rwanda
6. \`<h2>\`: "What You Will Learn"
7. \`<p>\`: A paragraph mentioning HTML, CSS, and JavaScript
8. \`<h3>\`: "Getting Started"
9. \`<p>\`: A short paragraph with some text and a \`<br>\` line break inside it
10. \`<hr>\` and a footer \`<p>\`: "© 2025 EduCode Rwanda"

Make sure the page has the full HTML skeleton (DOCTYPE, html, head, body).`,
      starter_code: '',
      hint: 'Build the full skeleton first: <!DOCTYPE html>, <html>, <head> (with charset, viewport, title), </head>, <body>. Then add your headings and paragraphs inside <body>. Close with </body></html>.',
    },
  },

  // ── 2.2 HTML Text Formatting ─────────────────────────────────────────────────
  {
    title: 'HTML Text Formatting Tags',
    order_index: 6,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `HTML provides tags for formatting text within paragraphs. These are **inline elements** — they format text without starting a new line.

## Formatting Tags

\`\`\`html
<b>Bold text</b>               — visual bold
<strong>Important text</strong>  — semantic bold (screen readers emphasize)

<i>Italic text</i>             — visual italic
<em>Emphasized text</em>       — semantic italic (screen readers emphasize)

<u>Underlined text</u>

<mark>Highlighted text</mark>  — yellow highlight by default

<del>Deleted text</del>        — strikethrough (crossed out)
<ins>Inserted text</ins>       — underlined (newly added)

<small>Smaller text</small>

<sub>Subscript</sub>           — H<sub>2</sub>O → H₂O
<sup>Superscript</sup>         — E=mc<sup>2</sup> → E=mc²
\`\`\`

## Code and Preformatted Text

\`\`\`html
<code>inline code snippet</code>

<pre>
  Preformatted text
  preserves spaces
  and line breaks
</pre>
\`\`\`

## Blockquote and Citation

\`\`\`html
<blockquote>
  "Education is the most powerful weapon which you can use to change the world."
  — Nelson Mandela
</blockquote>

<cite>The title of a work</cite>
\`\`\`

## Example

\`\`\`html
<p>
  Water has the chemical formula H<sub>2</sub>O.
  Albert Einstein discovered that <strong>E=mc<sup>2</sup></strong>.
  The <mark>important</mark> thing is to <em>practice every day</em>.
</p>
\`\`\`

## Semantic vs Visual

Use **semantic tags** (\`<strong>\`, \`<em>\`) when the meaning matters (important information, emphasis). Use visual tags (\`<b>\`, \`<i>\`) when it is purely a style choice. Screen readers announce semantic elements differently.`,
  },

  // ── Text Formatting Practice ─────────────────────────────────────────────────
  {
    title: 'Text Formatting Practice',
    order_index: 7,
    lesson_type: 'coding',
    xp_reward: 15,
    content: 'Apply HTML text formatting tags to create a well-styled content page.',
    exercise_data: {
      instructions: `Create a "Science Facts" page using text formatting tags:

**Build a page with:**
1. \`<h1>\`: "Amazing Science Facts"
2. A \`<p>\` that uses \`<strong>\` for an important fact and \`<em>\` for emphasis
3. A \`<p>\` that includes a chemical formula using \`<sub>\`: H<sub>2</sub>O or CO<sub>2</sub>
4. A \`<p>\` that includes a mathematical power using \`<sup>\`: E=mc<sup>2</sup>
5. A \`<blockquote>\` with a famous science quote
6. A \`<p>\` with \`<mark>\` highlighting a key term
7. A \`<p>\` with some \`<del>\` text (wrong info crossed out) and \`<ins>\` text (correct replacement)

Remember the full HTML skeleton (DOCTYPE, html, head with title, body).`,
      starter_code: '',
      hint: 'For subscript: H<sub>2</sub>O. For superscript: mc<sup>2</sup>. For blockquote: <blockquote>"Quote here" — Author</blockquote>. For mark: <mark>keyword</mark>.',
    },
  },

  // ── 2.2 HTML Lists ───────────────────────────────────────────────────────────
  {
    title: 'HTML Lists',
    order_index: 8,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `HTML provides three types of lists for organizing content.

## Unordered Lists

Items displayed with bullet points:

\`\`\`html
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>
\`\`\`

Change the bullet style with the \`type\` attribute:
- \`type="disc"\` — filled circle (default)
- \`type="circle"\` — hollow circle
- \`type="square"\` — filled square

## Ordered Lists

Items displayed with numbers or letters:

\`\`\`html
<ol>
  <li>Learn HTML</li>
  <li>Learn CSS</li>
  <li>Build a project</li>
</ol>
\`\`\`

Ordered list \`type\` options:
- \`type="1"\` — numbers (default): 1, 2, 3
- \`type="A"\` — uppercase letters: A, B, C
- \`type="a"\` — lowercase letters: a, b, c
- \`type="I"\` — uppercase Roman: I, II, III
- \`type="i"\` — lowercase Roman: i, ii, iii

Use \`start="5"\` to begin numbering at 5 instead of 1.

## Definition Lists

For terms and their definitions:

\`\`\`html
<dl>
  <dt>HTML</dt>
  <dd>HyperText Markup Language — structures web content</dd>

  <dt>CSS</dt>
  <dd>Cascading Style Sheets — styles web pages</dd>

  <dt>JavaScript</dt>
  <dd>Programming language that adds interactivity</dd>
</dl>
\`\`\`

## Nested Lists

Lists can be nested inside other lists:

\`\`\`html
<ul>
  <li>Frontend
    <ul>
      <li>HTML</li>
      <li>CSS</li>
    </ul>
  </li>
  <li>Backend
    <ul>
      <li>Node.js</li>
      <li>Python</li>
    </ul>
  </li>
</ul>
\`\`\``,
  },

  // ── Course Outline with Lists ─────────────────────────────────────────────────
  {
    title: 'Create a Course Outline',
    order_index: 9,
    lesson_type: 'coding',
    xp_reward: 15,
    content: 'Use HTML lists to create a well-structured course syllabus page.',
    exercise_data: {
      instructions: `Build a "Website Development Course Syllabus" page using different types of lists:

**Requirements:**
1. \`<h1>\`: "Website Development — Course Syllabus"
2. \`<h2>\`: "Course Modules" with an **ordered list** (\`<ol>\`) of 3 modules:
   - Apply Keyboard Skills
   - Create Web Structures
   - Style Web Elements
3. Under each module, add a **nested unordered list** of 2–3 topics covered
4. \`<h2>\`: "Technologies You Will Learn" with an **unordered list** with \`type="square"\`
5. \`<h2>\`: "Web Development Glossary" with a **definition list** (\`<dl>\`) defining at least 3 terms: HTML, CSS, URL
6. At the bottom, add an \`<ol type="A">\` listing 3 course prerequisites

Include the full HTML5 document skeleton.`,
      starter_code: '',
      hint: 'For nested lists, put the inner <ul> inside an <li> of the outer <ol>. For definition list: <dl><dt>HTML</dt><dd>HyperText Markup Language</dd></dl>. For type attribute: <ul type="square">.',
    },
  },

  // ── 2.2 HTML Media Tags ──────────────────────────────────────────────────────
  {
    title: 'HTML Media Tags',
    order_index: 10,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `HTML5 provides native support for images, audio, and video — no plugins required.

## Images

\`\`\`html
<img src="photo.jpg" alt="A student coding" width="400" height="300">
\`\`\`

Key attributes:
- **\`src\`** — path or URL to the image file
- **\`alt\`** — descriptive text if image cannot load (required for accessibility)
- **\`width\`** / **\`height\`** — dimensions in pixels (optional, use CSS instead)

Image formats: **JPG/JPEG** (photos), **PNG** (transparency), **GIF** (animation), **SVG** (scalable), **WebP** (modern, efficient)

## Audio

\`\`\`html
<audio controls>
  <source src="song.mp3" type="audio/mpeg">
  <source src="song.ogg" type="audio/ogg">
  Your browser does not support audio.
</audio>
\`\`\`

Attributes: \`controls\` (show player), \`autoplay\`, \`loop\`, \`muted\`

## Video

\`\`\`html
<video width="640" height="360" controls>
  <source src="video.mp4" type="video/mp4">
  Your browser does not support video.
</video>
\`\`\`

Attributes: \`controls\`, \`autoplay\`, \`muted\`, \`loop\`, \`poster\` (thumbnail image)

> **Note:** \`autoplay\` only works with \`muted\` in modern browsers.

## Embedding External Content

\`\`\`html
<!-- Embed another webpage (iframe) -->
<iframe src="https://www.example.com" width="600" height="400"
  title="Embedded page">
</iframe>

<!-- Embed multimedia (older method) -->
<embed src="video.mp4" type="video/mp4" width="640" height="360">
\`\`\`

## Points to Remember

- Always include \`alt\` on every image — required for accessibility and SEO
- Use \`<source>\` elements inside audio/video to provide multiple formats (browser compatibility)
- Avoid \`autoplay\` without \`muted\` — it annoys users and is blocked by browsers
- Keep media files optimized for fast loading`,
  },

  // ── Build a Media Page ────────────────────────────────────────────────────────
  {
    title: 'Build a Media Page',
    order_index: 11,
    lesson_type: 'coding',
    xp_reward: 20,
    content: 'Create a page that uses images (SVG), figures, and media elements.',
    exercise_data: {
      instructions: `Create a "Rwanda Tech News" media page:

**Build a page with:**
1. \`<h1>\`: "Rwanda Tech News"
2. An inline SVG image (code provided in the hint) as a banner
3. A \`<figure>\` element containing the SVG and a \`<figcaption>\`: "Rwanda's growing tech sector"
4. An \`<h2>\`: "Latest Video"
5. A \`<video>\` element with \`controls\` and \`width="400"\`. Inside it, add a \`<source>\` with \`src="video.mp4"\` and \`type="video/mp4"\`, and a fallback message paragraph.
6. An \`<h2>\`: "Our Podcast"
7. An \`<audio>\` element with \`controls\`. Inside, add a \`<source>\` with \`src="podcast.mp3"\` and \`type="audio/mpeg"\`, plus a fallback message.
8. A paragraph with an \`<img>\` using \`src\` set to a small SVG data URI and meaningful \`alt\` text.

Note: The video and audio won't play (no real files), but the elements should appear in the preview.`,
      starter_code: '',
      hint: `For the SVG banner, use this inline code:
<svg width="600" height="120" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="120" fill="#13161e"/>
  <text x="300" y="70" text-anchor="middle" fill="#00d4aa" font-size="32" font-family="Arial">Rwanda Tech News</text>
</svg>

For the img data URI: <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%2300d4aa'/%3E%3C/svg%3E" alt="Teal square icon">`,
    },
  },

  // ── 2.3 HTML Hyperlinks ───────────────────────────────────────────────────────
  {
    title: 'HTML Hyperlinks & Navigation',
    order_index: 12,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `Hyperlinks are what make the web a **web** — they connect pages together. The \`<a>\` (anchor) tag creates links.

## Basic Link Syntax

\`\`\`html
<a href="URL">Link text</a>
\`\`\`

## Types of Links

**External link** (to another website):
\`\`\`html
<a href="https://www.google.com" target="_blank" rel="noopener">Open Google</a>
\`\`\`
Use \`target="_blank"\` to open in a new tab. Always add \`rel="noopener"\` for security.

**Internal link** (to another page on the same site):
\`\`\`html
<a href="about.html">About Us</a>
<a href="/courses/html">HTML Course</a>
\`\`\`

**Anchor link** (jump to a section on the same page):
\`\`\`html
<!-- Link -->
<a href="#section2">Jump to Section 2</a>

<!-- Target element with matching id -->
<h2 id="section2">Section 2</h2>
\`\`\`

**Email link**:
\`\`\`html
<a href="mailto:info@educode.rw">Email Us</a>
\`\`\`

**Phone link**:
\`\`\`html
<a href="tel:+250788000000">Call Us</a>
\`\`\`

**Image as link**:
\`\`\`html
<a href="home.html">
  <img src="logo.png" alt="EduCode Home">
</a>
\`\`\`

## Navigation Menus

Use \`<nav>\` with an unordered list:
\`\`\`html
<nav>
  <ul>
    <li><a href="index.html">Home</a></li>
    <li><a href="courses.html">Courses</a></li>
    <li><a href="about.html">About</a></li>
    <li><a href="contact.html">Contact</a></li>
  </ul>
</nav>
\`\`\`

## Points to Remember

- Every \`<a>\` tag needs an \`href\` attribute
- Use descriptive link text — not "Click here" but "View course details"
- \`#\` as href creates a placeholder link that goes nowhere
- Use \`id\` attributes on headings/sections as anchor targets`,
  },

  // ── Navigation Links Practice ─────────────────────────────────────────────────
  {
    title: 'Build a Navigation Page',
    order_index: 13,
    lesson_type: 'coding',
    xp_reward: 20,
    content: 'Create a page with a navigation menu and anchor links that jump to sections.',
    exercise_data: {
      instructions: `Build a single-page website for "EduCode Rwanda" with anchor navigation:

**Requirements:**
1. A \`<nav>\` containing an unordered list with 3 anchor links:
   - "About Us" → links to \`#about\`
   - "Our Courses" → links to \`#courses\`
   - "Contact" → links to \`#contact\`
2. Three sections, each with the matching \`id\`:
   - \`<section id="about">\` with an \`<h2>\` and a paragraph about EduCode Rwanda
   - \`<section id="courses">\` with an \`<h2>\` and a list of 3 courses
   - \`<section id="contact">\` with an \`<h2>\`, an email link (\`mailto:\`), and a phone link (\`tel:\`)
3. In the contact section, include an external link to a website (use \`target="_blank"\`)
4. Add an \`<h1>\` at the top: "EduCode Rwanda"
5. A footer with a copyright paragraph

Test the anchor links by clicking them in the preview — they should jump to each section.`,
      starter_code: '',
      hint: 'For anchor links: <a href="#about">About Us</a>. For the target section: <section id="about">. For email: <a href="mailto:hello@educode.rw">. For external links: add target="_blank" rel="noopener".',
    },
  },

  // ── 2.3 HTML Graphics: Canvas & SVG ─────────────────────────────────────────
  {
    title: 'HTML Graphics: Canvas & SVG',
    order_index: 14,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `HTML5 provides two ways to draw graphics directly in the browser — without image files.

## SVG (Scalable Vector Graphics)

SVG is **HTML-like markup** that describes shapes. SVG images scale perfectly at any size.

\`\`\`html
<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">

  <!-- Rectangle -->
  <rect x="10" y="10" width="150" height="80" fill="blue" stroke="black" stroke-width="2"/>

  <!-- Circle -->
  <circle cx="250" cy="50" r="40" fill="red"/>

  <!-- Line -->
  <line x1="10" y1="150" x2="390" y2="150" stroke="green" stroke-width="3"/>

  <!-- Text -->
  <text x="50" y="180" font-size="18" fill="purple">Hello SVG!</text>

</svg>
\`\`\`

**SVG Attributes:**
- \`fill\` — fill color
- \`stroke\` — border/outline color
- \`stroke-width\` — border thickness
- For circles: \`cx\`, \`cy\` = center point; \`r\` = radius
- For rectangles: \`x\`, \`y\` = top-left corner; \`width\`, \`height\`

## Canvas (JavaScript Drawing)

Canvas provides a **drawing surface** that you control with JavaScript:

\`\`\`html
<canvas id="myCanvas" width="400" height="200"></canvas>

<script>
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');

  // Draw a filled rectangle
  ctx.fillStyle = 'teal';
  ctx.fillRect(10, 10, 150, 80);

  // Draw a circle
  ctx.beginPath();
  ctx.arc(250, 100, 50, 0, Math.PI * 2);
  ctx.fillStyle = 'orange';
  ctx.fill();

  // Draw text
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText('Hello Canvas!', 50, 180);
</script>
\`\`\`

## SVG vs Canvas

| Feature | SVG | Canvas |
|---------|-----|--------|
| Type | XML markup | JavaScript API |
| Scalable | Yes (vector) | No (raster) |
| Best for | Icons, logos, charts | Games, animations, image editing |
| DOM access | Yes (can style with CSS) | No (pixel-based) |`,
  },

  // ── Draw Shapes with Canvas ───────────────────────────────────────────────────
  {
    title: 'Draw Shapes with Canvas & SVG',
    order_index: 15,
    lesson_type: 'coding',
    xp_reward: 20,
    content: 'Practice drawing shapes using both SVG markup and the HTML5 Canvas API.',
    exercise_data: {
      instructions: `Create a graphics showcase page with both SVG and Canvas drawings:

**Part 1 — SVG Section:**
1. Add an \`<h2>\`: "SVG Graphics"
2. Add an \`<svg>\` (width=400, height=200) containing:
   - A rectangle with fill color and a stroke border
   - A circle with a different fill color
   - A text element with your name

**Part 2 — Canvas Section:**
1. Add an \`<h2>\`: "Canvas Graphics"
2. Add a \`<canvas id="c1"\` with width=400, height=200
3. In a \`<script>\` tag, get the canvas context and draw:
   - A filled rectangle (use fillRect)
   - A circle (use arc and fill)
   - Text on the canvas (use fillText)
   - Set different fillStyle colors for each shape

**Bonus:** Add a background rectangle to the canvas that fills the whole canvas in a dark color.`,
      starter_code: '',
      hint: `SVG circle: <circle cx="200" cy="100" r="50" fill="teal"/>
SVG text: <text x="10" y="180" font-size="16" fill="white">Your Name</text>

Canvas: const ctx = document.getElementById('c1').getContext('2d');
ctx.fillStyle = '#1a1a2e'; ctx.fillRect(0,0,400,200); // background
ctx.fillStyle = '#00d4aa'; ctx.fillRect(20,20,100,60); // rectangle
ctx.beginPath(); ctx.arc(250,100,50,0,Math.PI*2); ctx.fillStyle='orange'; ctx.fill();
ctx.fillStyle='white'; ctx.font='16px Arial'; ctx.fillText('Canvas!',150,180);`,
    },
  },

  // ── 2.2 HTML Comments & Grouping ─────────────────────────────────────────────
  {
    title: 'HTML Comments & Grouping Tags',
    order_index: 16,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `## HTML Comments

Comments are notes in your code that the browser ignores. They help you and your team understand the code.

\`\`\`html
<!-- This is a single-line comment -->

<!--
  This is a multi-line comment.
  Use these to explain complex sections.
-->

<!-- TODO: Add navigation menu here -->
<!-- FIXME: Fix layout on mobile -->
\`\`\`

Comments are also useful to **temporarily disable** code during testing.

## The \`<div>\` Tag (Block Container)

\`<div>\` (short for "division") is a **block-level** container with no visual meaning — it is used to group elements for styling or layout:

\`\`\`html
<div class="card">
  <h2>Course Title</h2>
  <p>Course description goes here.</p>
  <a href="course.html">Start Learning</a>
</div>
\`\`\`

- \`<div>\` starts on a new line and takes full width
- Use \`class\` or \`id\` attributes to target it with CSS
- Avoid nesting too many divs ("div soup") — use semantic tags instead

## The \`<span>\` Tag (Inline Container)

\`<span>\` is an **inline** container — it wraps text within a line without breaking it:

\`\`\`html
<p>The <span style="color: teal;">important</span> word is highlighted.</p>
\`\`\`

Use \`<span>\` when you need to style part of a sentence.

## id vs class Attributes

\`\`\`html
<!-- id: unique identifier — ONE per page -->
<div id="header">...</div>
<div id="footer">...</div>

<!-- class: reusable — use on many elements -->
<div class="card">...</div>
<div class="card">...</div>
<div class="card">...</div>
\`\`\`

**Rule:** \`id\` for unique elements, \`class\` for repeating patterns.`,
  },

  // ── 2.3 Semantic HTML ─────────────────────────────────────────────────────────
  {
    title: 'Semantic HTML & Page Layout',
    order_index: 17,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `**Semantic HTML** uses tags that describe the meaning of content — not just how it looks.

## Why Semantic HTML Matters

- **Accessibility** — screen readers understand the page structure
- **SEO** — search engines better understand your content
- **Readability** — developers can understand the page structure at a glance
- **Maintainability** — easier to update

## Semantic Layout Tags

| Tag | Purpose |
|-----|---------|
| \`<header>\` | Top section — logo, navigation, banner |
| \`<nav>\` | Navigation menu with links |
| \`<main>\` | The primary content of the page (one per page) |
| \`<section>\` | A thematic grouping of content with a heading |
| \`<article>\` | Self-contained content (blog post, news story) |
| \`<aside>\` | Side content related to main (sidebar, ads) |
| \`<footer>\` | Bottom section — copyright, links |

## Complete Page Structure

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>EduCode Rwanda</title>
</head>
<body>

  <header>
    <h1>EduCode Rwanda</h1>
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/courses">Courses</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section>
      <h2>Featured Course</h2>
      <article>
        <h3>Website Development</h3>
        <p>Learn HTML, CSS, and how the web works.</p>
      </article>
    </section>

    <aside>
      <h3>Quick Links</h3>
      <ul>
        <li><a href="/blog">Blog</a></li>
      </ul>
    </aside>
  </main>

  <footer>
    <p>&copy; 2025 EduCode Rwanda</p>
  </footer>

</body>
</html>
\`\`\`

## Non-Semantic vs Semantic

\`\`\`html
<!-- Non-semantic (avoid) -->
<div id="header">...</div>
<div id="main-content">...</div>
<div id="footer">...</div>

<!-- Semantic (preferred) -->
<header>...</header>
<main>...</main>
<footer>...</footer>
\`\`\``,
  },

  // ── Build a Semantic Page ─────────────────────────────────────────────────────
  {
    title: 'Build a Semantic Page Structure',
    order_index: 18,
    lesson_type: 'coding',
    xp_reward: 25,
    content: 'Create a complete semantic HTML page using all the structural tags.',
    exercise_data: {
      instructions: `Build a full "EduCode Rwanda" homepage using semantic HTML:

**Required structure:**
1. \`<header>\`: Contains \`<h1>\` "EduCode Rwanda" and a \`<nav>\` with 4 links (Home, Courses, About, Contact)
2. \`<main>\` containing:
   - A \`<section>\` with \`<h2>\` "Welcome" and a paragraph describing the platform
   - A \`<section>\` with \`<h2>\` "Our Courses" and an \`<article>\` for each of 3 courses (each article has an \`<h3>\` course title and a \`<p>\` description)
3. An \`<aside>\` (inside or outside main) with \`<h3>\` "Did You Know?" and a fun fact paragraph
4. A \`<footer>\` with:
   - A paragraph: "© 2025 EduCode Rwanda. All rights reserved."
   - A paragraph with an email link

**Add comments** in your code labeling each major section (header, main, aside, footer).`,
      starter_code: '',
      hint: 'Structure: <body> → <header> (h1 + nav) + <main> (sections + articles) + <aside> + <footer>. Add HTML comments like <!-- Header --> before each semantic tag to label them. Indent nested elements by 2 spaces.',
    },
  },

  // ── 2.4 SEO & Accessibility ───────────────────────────────────────────────────
  {
    title: 'SEO & Web Accessibility',
    order_index: 19,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `Building a website is not just about making it look good — it must also be **findable** and **usable by everyone**.

## SEO (Search Engine Optimization)

SEO helps your page rank higher in search results (Google, Bing). Key techniques:

**In \`<head>\`:**
\`\`\`html
<title>Website Development Course | EduCode Rwanda</title>
<meta name="description" content="Learn HTML, CSS, and web development in Rwanda. Free online courses for TVET students.">
<meta name="robots" content="index, follow">
\`\`\`

**In \`<body>\`:**
- **One \`<h1>\`** per page — contains your main keyword
- **Heading hierarchy** — h1 → h2 → h3 (don't skip levels)
- **Alt text** on every image: \`<img src="..." alt="Students learning to code in Kigali">\`
- **Semantic HTML** — search engines understand \`<article>\` better than \`<div>\`
- **Meaningful link text** — "Learn more about HTML" not "Click here"
- **Page speed** — compress images, minimize CSS/JS

## Web Accessibility

Accessibility (a11y) ensures your site works for people with disabilities.

**Screen reader support:**
\`\`\`html
<!-- ARIA landmarks help screen readers navigate -->
<nav aria-label="Main navigation">...</nav>
<main aria-label="Main content">...</main>

<!-- Buttons need accessible labels -->
<button aria-label="Close menu">✕</button>

<!-- Images need alt text -->
<img src="logo.png" alt="EduCode Rwanda logo">
<!-- Decorative images use empty alt -->
<img src="divider.png" alt="">
\`\`\`

**Keyboard navigation:**
- All links and buttons must be reachable with Tab key
- Visible focus styles (don't remove \`outline\` with CSS without a replacement)

**Color contrast:**
- Text must have sufficient contrast against its background
- Tool: WebAIM Contrast Checker

## Testing Tools

| Tool | Purpose |
|------|---------|
| **W3C Validator** | Check HTML for syntax errors |
| **Lighthouse** (Chrome DevTools) | SEO, accessibility, performance audit |
| **WAVE** | Web accessibility evaluation |
| **Axe** | Accessibility testing browser extension |

## Testing Workflow

1. Run automated tools (Lighthouse, WAVE)
2. Manual keyboard navigation testing
3. Test with a screen reader
4. Validate HTML at validator.w3.org
5. Implement fixes and retest`,
  },

  // ── Web Structures Quiz ───────────────────────────────────────────────────────
  {
    title: 'Web Structures Quiz',
    order_index: 20,
    lesson_type: 'quiz',
    xp_reward: 10,
    content: 'Test your knowledge of HTML and web structure concepts.',
    exercise_data: {
      questions: [
        {
          id: 'q1',
          text: 'What does HTML stand for?',
          options: [
            'Hyper Text Markup Language',
            'High Tech Modern Language',
            'Hyper Transfer Markup Language',
            'Home Tool Markup Language',
          ],
          correct: 0,
        },
        {
          id: 'q2',
          text: 'Which tag is used to define the most important heading on a page?',
          options: ['<heading>', '<h6>', '<h1>', '<title>'],
          correct: 2,
        },
        {
          id: 'q3',
          text: 'Which tag creates an unordered (bulleted) list?',
          options: ['<ol>', '<ul>', '<li>', '<list>'],
          correct: 1,
        },
        {
          id: 'q4',
          text: 'What attribute is REQUIRED on every <img> tag for accessibility?',
          options: ['src', 'width', 'alt', 'title'],
          correct: 2,
        },
        {
          id: 'q5',
          text: 'Which HTML tag is used to create a hyperlink?',
          options: ['<link>', '<a>', '<href>', '<url>'],
          correct: 1,
        },
        {
          id: 'q6',
          text: 'What does <!DOCTYPE html> tell the browser?',
          options: [
            'The page title',
            'The CSS file to load',
            'The document is HTML5',
            'The author of the page',
          ],
          correct: 2,
        },
        {
          id: 'q7',
          text: 'Which tag represents the main navigation menu of a page?',
          options: ['<menu>', '<nav>', '<header>', '<ul>'],
          correct: 1,
        },
        {
          id: 'q8',
          text: 'How do you open a link in a new browser tab?',
          options: [
            'target="new"',
            'rel="blank"',
            'target="_blank"',
            'open="tab"',
          ],
          correct: 2,
        },
        {
          id: 'q9',
          text: 'Which tag is used for self-contained content like a blog post or news article?',
          options: ['<section>', '<div>', '<article>', '<aside>'],
          correct: 2,
        },
        {
          id: 'q10',
          text: 'What is the correct HTML comment syntax?',
          options: [
            '// This is a comment',
            '/* This is a comment */',
            '<!-- This is a comment -->',
            '# This is a comment',
          ],
          correct: 2,
        },
      ],
    },
  },
];

// ─── Module 3 Lessons ─────────────────────────────────────────────────────────

const module3Lessons = [
  // ── 3.1 Introduction to CSS ──────────────────────────────────────────────────
  {
    title: 'Introduction to CSS',
    order_index: 1,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `**CSS** (Cascading Style Sheets) is the language used to control the visual appearance of HTML elements — colors, fonts, layout, spacing, and more.

## Why CSS?

Without CSS, web pages are plain black-and-white text. CSS separates **presentation** from **structure**:

- **HTML** — *what* is on the page (structure)
- **CSS** — *how* it looks (presentation)
- **JavaScript** — *how* it behaves (behavior)

## Key Benefits of CSS

| Benefit | Description |
|---------|-------------|
| **Separation of concerns** | HTML and CSS kept separate — easier to maintain |
| **Reusability** | One stylesheet can style an entire website |
| **Consistency** | Same styles applied across all pages |
| **Responsive design** | Different styles for different screen sizes |
| **Design flexibility** | Colors, fonts, layouts, animations |
| **Performance** | Browser caches the CSS file |

## The Cascade

"Cascading" means styles can come from multiple sources and **cascade** (flow down) from general to specific:

1. **Browser default styles** (lowest priority)
2. **External stylesheet** (your styles.css file)
3. **Internal styles** (\`<style>\` in head)
4. **Inline styles** (\`style="..."\` on element)
5. **!important** (overrides everything — use sparingly)

When rules conflict, the more **specific** rule wins. If specificity is equal, the **last rule** wins.

## CSS in Practice

\`\`\`css
/* Change all paragraphs to gray */
p {
  color: gray;
  font-size: 16px;
}

/* Specifically target the intro paragraph */
#intro {
  color: black;
  font-size: 20px;
}
\`\`\`

The \`#intro\` rule wins because IDs are more specific than element selectors.`,
  },

  // ── 3.1 CSS Types ─────────────────────────────────────────────────────────────
  {
    title: 'CSS Types: Inline, Internal & External',
    order_index: 2,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `There are three ways to apply CSS to an HTML document.

## 1. Inline CSS

Applied directly on an HTML element using the \`style\` attribute:

\`\`\`html
<p style="color: blue; font-size: 18px;">This paragraph is blue.</p>
<h1 style="text-align: center; color: teal;">Welcome</h1>
\`\`\`

**Advantages:** Quick to write, highest specificity
**Disadvantages:** Hard to maintain, no reusability, mixes HTML and CSS

## 2. Internal CSS

CSS rules placed inside a \`<style>\` tag in the \`<head>\`:

\`\`\`html
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f0f0f0;
    }
    h1 {
      color: teal;
      text-align: center;
    }
    .card {
      background: white;
      padding: 20px;
      border-radius: 8px;
    }
  </style>
</head>
\`\`\`

**Advantages:** No extra file, styles for whole page in one place
**Disadvantages:** Can only style that one page, makes HTML file larger

## 3. External CSS (Best Practice)

CSS rules in a separate \`.css\` file, linked to the HTML:

\`\`\`html
<!-- In the HTML <head> -->
<link rel="stylesheet" href="styles.css">
\`\`\`

\`\`\`css
/* In styles.css */
body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
}

h1 {
  color: #00d4aa;
}
\`\`\`

**Advantages:** One file styles the whole website, fully reusable, separation of concerns
**Disadvantages:** Requires an extra HTTP request (usually cached quickly)

## How to Create a CSS File

1. Open your text editor
2. Create a new file and save as **\`styles.css\`**
3. Write your CSS rules
4. Link it in your HTML: \`<link rel="stylesheet" href="styles.css">\`
5. Save and test in browser

## Which Should You Use?

- **Inline** — only for quick tests or unique one-off overrides
- **Internal** — for single-page projects or prototypes
- **External** — for all real projects (websites with multiple pages)`,
  },

  // ── Your First CSS Styles ─────────────────────────────────────────────────────
  {
    title: 'Your First CSS Styles',
    order_index: 3,
    lesson_type: 'coding',
    xp_reward: 15,
    content: 'Apply internal CSS to style a web page with colors, fonts, and background.',
    exercise_data: {
      instructions: `Create a styled profile card using internal CSS:

**HTML Structure (in \`<body>\`):**
1. A \`<div class="page">\` wrapping everything
2. Inside: a \`<div class="card">\` containing:
   - An \`<h1>\` with your name
   - A \`<p class="role">\` with "Web Developer Student"
   - A \`<p>\` with a short bio

**CSS (in \`<style>\` inside \`<head>\`):**
Style the following:
- \`body\`: background-color: #0d0f14; font-family: Arial, sans-serif; margin: 0; padding: 40px
- \`.card\`: background-color: #13161e; color: #f1f5f9; padding: 32px; border-radius: 12px; max-width: 400px; margin: 0 auto; border: 1px solid #00d4aa
- \`h1\`: color: #00d4aa; font-size: 28px; margin-bottom: 8px
- \`.role\`: color: #64748b; font-size: 14px; margin-bottom: 16px
- \`p\`: color: #94a3b8; line-height: 1.6

The preview should show a dark card with teal accents.`,
      starter_code: '',
      hint: 'Put all CSS inside <style> tags in <head>. Use class selectors (.card, .role) with a dot prefix. Property names use hyphens: background-color, font-size, border-radius. Each CSS rule ends with a semicolon.',
    },
  },

  // ── 3.2 CSS Selectors ─────────────────────────────────────────────────────────
  {
    title: 'CSS Selectors & Common Properties',
    order_index: 4,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `**CSS selectors** determine which HTML elements a rule applies to. Choosing the right selector is fundamental to writing good CSS.

## Basic Selectors

\`\`\`css
/* Element selector — targets all <p> tags */
p { color: gray; }

/* Class selector — targets elements with class="highlight" */
.highlight { background: yellow; }

/* ID selector — targets the element with id="header" */
#header { background: teal; }

/* Universal selector — targets everything */
* { box-sizing: border-box; margin: 0; }
\`\`\`

## Combination Selectors

\`\`\`css
/* Descendant — <p> inside any <div> */
div p { color: blue; }

/* Direct child — <li> directly inside <ul> */
ul > li { list-style: none; }

/* Adjacent sibling — <p> immediately after <h2> */
h2 + p { font-weight: bold; }

/* Multiple selectors — apply same rule to h1, h2, h3 */
h1, h2, h3 { font-family: 'Georgia', serif; }
\`\`\`

## Pseudo-classes

\`\`\`css
/* Link states */
a:link    { color: blue; }
a:visited { color: purple; }
a:hover   { color: teal; text-decoration: underline; }
a:active  { color: red; }

/* Form states */
input:focus { border-color: teal; outline: none; }
button:disabled { opacity: 0.5; cursor: not-allowed; }

/* Position-based */
li:first-child { font-weight: bold; }
li:last-child  { border-bottom: none; }
li:nth-child(2) { background: lightgray; }
\`\`\`

## Common CSS Properties

\`\`\`css
.example {
  /* Color */
  color: #f1f5f9;
  background-color: #13161e;

  /* Typography */
  font-family: 'Inter', Arial, sans-serif;
  font-size: 16px;
  font-weight: bold;        /* or 400, 700, etc. */
  font-style: italic;

  /* Spacing */
  margin: 16px;             /* outside the element */
  padding: 12px 24px;       /* inside the element */

  /* Border */
  border: 1px solid #00d4aa;
  border-radius: 8px;

  /* Size */
  width: 300px;
  max-width: 100%;
  height: auto;
}
\`\`\``,
  },

  // ── Style with Selectors ──────────────────────────────────────────────────────
  {
    title: 'Style with CSS Selectors',
    order_index: 5,
    lesson_type: 'coding',
    xp_reward: 20,
    content: 'Practice using element, class, ID, and pseudo-class selectors.',
    exercise_data: {
      instructions: `Create a styled course listing page demonstrating different CSS selectors:

**HTML to build:**
1. An \`<h1 id="page-title">\`: "Available Courses"
2. Three \`<div class="course-card">\` elements, each containing:
   - An \`<h2>\` with a course name
   - A \`<p>\` with a description
   - A \`<span class="badge">\` with a difficulty level
   - An \`<a href="#">\` "Enroll Now"
3. Make the FIRST card also have \`class="course-card featured"\`

**CSS rules to write:**
- **ID selector** \`#page-title\`: centered text, teal color
- **Element selector** \`body\`: dark background (#0d0f14), white text
- **Class selector** \`.course-card\`: dark card background (#13161e), padding, border, border-radius, margin-bottom
- **Multi-class** \`.course-card.featured\`: add a teal left border (4px solid #00d4aa)
- **Class selector** \`.badge\`: small, rounded, colored background
- **Pseudo-class** \`a:hover\`: change color on hover

Demonstrate at least 5 different selector types.`,
      starter_code: '',
      hint: 'Use internal CSS in <style>. Multi-class selector: .course-card.featured { } (no space between classes). Hover: a:hover { color: #00d4aa; }. Badge: .badge { background: rgba(0,212,170,0.1); color: #00d4aa; padding: 2px 8px; border-radius: 12px; font-size: 12px; }',
    },
  },

  // ── 3.2 CSS Box Model ─────────────────────────────────────────────────────────
  {
    title: 'The CSS Box Model',
    order_index: 6,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `Every HTML element is a rectangular **box**. The **CSS Box Model** describes the space each box occupies.

## Box Model Layers (inside → outside)

\`\`\`
+-------------------------------+
|         MARGIN                |  ← outside the border (pushes other elements away)
|  +-------------------------+  |
|  |       BORDER            |  |  ← the visible border line
|  |  +-------------------+  |  |
|  |  |     PADDING       |  |  |  ← space inside the border (between border & content)
|  |  |  +-------------+  |  |  |
|  |  |  |   CONTENT   |  |  |  |  ← actual text/images
|  |  |  +-------------+  |  |  |
|  |  +-------------------+  |  |
|  +-------------------------+  |
+-------------------------------+
\`\`\`

## Box Model Properties

\`\`\`css
.box {
  /* Content size */
  width: 300px;
  height: 150px;

  /* Padding — space inside the border */
  padding: 20px;              /* all sides */
  padding: 10px 20px;         /* top/bottom  left/right */
  padding: 10px 20px 15px 5px; /* top right bottom left */
  padding-top: 10px;
  padding-right: 20px;

  /* Border */
  border: 2px solid #00d4aa;
  border-top: 3px dashed red;
  border-radius: 8px;          /* rounded corners */

  /* Margin — space outside the border */
  margin: 16px;               /* all sides */
  margin: 16px auto;          /* top/bottom: 16px; left/right: auto (centers element) */
  margin-bottom: 24px;
}
\`\`\`

## box-sizing

By default, \`width\` only sets the **content** width. Padding and border are **added** on top:

\`\`\`css
/* Default — width=300px, but total width = 300 + 40 (padding) + 4 (border) = 344px */
.box { width: 300px; padding: 20px; border: 2px solid; }

/* Better — width=300px is the TOTAL width including padding and border */
* { box-sizing: border-box; }
\`\`\`

Always add \`* { box-sizing: border-box; }\` to your CSS — it makes sizing much more predictable.

## Shadows

\`\`\`css
.card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  /* offset-x offset-y blur-radius color */

  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}
\`\`\``,
  },

  // ── Box Model Practice ────────────────────────────────────────────────────────
  {
    title: 'CSS Box Model Practice',
    order_index: 7,
    lesson_type: 'coding',
    xp_reward: 20,
    content: 'Create a layout that demonstrates padding, borders, margins, and box shadows.',
    exercise_data: {
      instructions: `Create a "Student Dashboard" with cards that demonstrate the box model:

**Build a page with:**
1. \`<body>\` with dark background (#0d0f14), font-family Arial, padding: 32px
2. A \`<h1>\` "Student Dashboard" styled with teal color and margin-bottom
3. A \`<div class="grid">\` containing 3 \`<div class="stat-card">\` elements
4. Each \`stat-card\` has an \`<h3>\` (number/stat) and a \`<p>\` (label)
   - Card 1: "12" / "Lessons Completed"
   - Card 2: "340" / "XP Earned"
   - Card 3: "7" / "Day Streak"

**CSS Requirements — demonstrate the box model:**
- \`* { box-sizing: border-box; }\` at the top
- \`.grid\`: display: flex; gap: 16px
- \`.stat-card\`:
  - background: #13161e
  - **padding**: 24px (inner space)
  - **border**: 1px solid rgba(255,255,255,0.08)
  - **border-radius**: 12px
  - **margin**: 0 (cards spaced by grid gap)
  - **box-shadow**: 0 4px 12px rgba(0,0,0,0.3)
  - flex: 1 (equal width)
- \`h3\`: font-size: 36px; color: #00d4aa; margin: 0 0 4px 0
- \`p\`: color: #64748b; margin: 0`,
      starter_code: '',
      hint: 'Start with * { box-sizing: border-box; margin: 0; padding: 0; }. Use display: flex on .grid for side-by-side cards. The box model is visible: border draws the card outline, padding gives breathing room inside, margin-0 means gap property spaces them.',
    },
  },

  // ── 3.2 CSS Display & Positioning ─────────────────────────────────────────────
  {
    title: 'CSS Display & Positioning',
    order_index: 8,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `CSS gives you precise control over how elements are displayed and positioned on the page.

## The \`display\` Property

\`\`\`css
.element {
  display: block;        /* Full width, new line (div, p, h1 default) */
  display: inline;       /* Flows in text, no width/height (span, a default) */
  display: inline-block; /* Flows in text, BUT can have width/height */
  display: flex;         /* Flexible box layout (children become flex items) */
  display: grid;         /* Grid layout */
  display: none;         /* Hides element completely (removed from layout) */
}
\`\`\`

**Flexbox basics:**
\`\`\`css
.container {
  display: flex;
  flex-direction: row;        /* or column */
  justify-content: center;   /* horizontal alignment */
  align-items: center;       /* vertical alignment */
  gap: 16px;                 /* space between items */
}
\`\`\`

## CSS Positioning

| Value | Description |
|-------|-------------|
| \`static\` | Default — normal document flow, top/left/etc. have no effect |
| \`relative\` | Offset from its normal position |
| \`absolute\` | Positioned relative to nearest positioned ancestor |
| \`fixed\` | Stays in viewport even when scrolling |
| \`sticky\` | Acts like relative until it reaches a scroll threshold, then sticks |

\`\`\`css
/* Relative — moves 10px down from where it would normally be */
.box { position: relative; top: 10px; left: 20px; }

/* Absolute — positioned within a relative parent */
.parent { position: relative; width: 400px; height: 300px; }
.child  { position: absolute; top: 20px; right: 20px; }

/* Fixed — always in bottom-right corner */
.chat-button { position: fixed; bottom: 24px; right: 24px; }

/* Sticky navigation — sticks to top when scrolled past */
nav { position: sticky; top: 0; z-index: 100; }
\`\`\`

## Z-Index & Overflow

\`\`\`css
/* z-index controls stacking order (higher number = on top) */
.modal    { position: fixed; z-index: 1000; }
.overlay  { position: fixed; z-index: 999; }

/* overflow controls what happens when content is too big */
.box { overflow: hidden; }   /* clip content */
.box { overflow: scroll; }   /* always show scrollbar */
.box { overflow: auto; }     /* scrollbar only when needed */
\`\`\``,
  },

  // ── CSS Layout Practice ───────────────────────────────────────────────────────
  {
    title: 'CSS Layout Practice',
    order_index: 9,
    lesson_type: 'coding',
    xp_reward: 20,
    content: 'Use flexbox and CSS positioning to build a complete page layout.',
    exercise_data: {
      instructions: `Build a "Course Dashboard" page demonstrating display and positioning:

**Required layout:**
1. A \`<header>\` styled as a fixed top bar:
   - Dark background (#13161e), full width, padding
   - Contains \`<h1>\` "EduCode" (left) and a \`<nav>\` with links (right)
   - Use \`display: flex; justify-content: space-between; align-items: center;\`
   - \`position: fixed; top: 0; left: 0; right: 0;\` + \`z-index: 100\`
2. A \`<main>\` with \`margin-top: 64px\` (to clear the fixed header), padding: 32px
3. A \`<div class="course-grid">\` with 3 course cards:
   - Use \`display: flex; flex-wrap: wrap; gap: 20px\`
   - Each card: \`position: relative\`, dark background, padding, border-radius
   - Each card has a \`<span class="badge">\` (position: absolute; top: 12px; right: 12px)
4. A \`<button class="scroll-top">\` with text "↑":
   - \`position: fixed; bottom: 24px; right: 24px;\`
   - Circular (border-radius: 50%), teal background

Show the difference between static, relative, absolute, and fixed positioning.`,
      starter_code: '',
      hint: 'Fixed header needs position: fixed; top: 0; width: 100%; z-index: 100. Add margin-top: 64px to main to prevent content hiding behind header. For absolute badge inside relative card: .card { position: relative; } .badge { position: absolute; top: 12px; right: 12px; }',
    },
  },

  // ── 3.3 CSS Typography ────────────────────────────────────────────────────────
  {
    title: 'CSS Typography',
    order_index: 10,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `**Typography** is the art of arranging text to make it readable and visually appealing. CSS gives you full control over how text looks.

## Typefaces & Font Categories

There are three basic kinds of typefaces:
- **Serif** — has decorative strokes at letter ends (Times New Roman, Georgia). Formal, traditional.
- **Sans-serif** — clean, no decorative strokes (Arial, Helvetica, Inter). Modern, readable on screens.
- **Monospace** — each character same width (Courier, JetBrains Mono). Used for code.
- **Decorative** — artistic fonts for logos/headings only.

## Font Properties

\`\`\`css
.text {
  /* Font family — always provide fallbacks */
  font-family: 'Inter', Arial, sans-serif;

  /* Size */
  font-size: 16px;      /* pixels — most common for web */
  font-size: 1rem;      /* relative to root element (usually 16px) */
  font-size: 1.2em;     /* relative to parent element */

  /* Weight (thickness) */
  font-weight: normal;  /* = 400 */
  font-weight: bold;    /* = 700 */
  font-weight: 300;     /* light */
  font-weight: 600;     /* semi-bold */

  /* Style */
  font-style: normal;
  font-style: italic;
  font-style: oblique;
}
\`\`\`

## Text Properties

\`\`\`css
.text {
  /* Alignment */
  text-align: left;     /* default */
  text-align: center;
  text-align: right;
  text-align: justify;

  /* Decoration */
  text-decoration: none;       /* removes link underline */
  text-decoration: underline;
  text-decoration: line-through; /* strikethrough */

  /* Transform */
  text-transform: uppercase;
  text-transform: lowercase;
  text-transform: capitalize;  /* First Letter Of Each Word */

  /* Spacing */
  line-height: 1.6;         /* 1.6x the font size — good for readability */
  letter-spacing: 0.05em;   /* space between characters */
  word-spacing: 4px;        /* space between words */
  text-indent: 32px;        /* indent first line */
}
\`\`\`

## Font Size Units

| Unit | Meaning | Example |
|------|---------|---------|
| \`px\` | Absolute pixels | \`16px\` |
| \`rem\` | Relative to root (html) font-size | \`1.5rem\` = 24px |
| \`em\` | Relative to parent element font-size | \`1.2em\` |
| \`%\` | Percentage of parent | \`120%\` |
| \`pt\` | Points (print) | \`12pt\` |

**Best practice:** Use \`rem\` for font sizes — it respects user browser settings and scales consistently.

## Typography Principles

- **Contrast** — vary sizes/weights to create hierarchy (big h1, smaller body text)
- **Consistency** — stick to 2 fonts maximum (one for headings, one for body)
- **White space** — generous \`line-height\` (1.5–1.8) improves readability
- **Color** — sufficient contrast between text and background`,
  },

  // ── Typography Practice ───────────────────────────────────────────────────────
  {
    title: 'Typography Styling Practice',
    order_index: 11,
    lesson_type: 'coding',
    xp_reward: 20,
    content: 'Apply CSS typography properties to create a well-designed article page.',
    exercise_data: {
      instructions: `Create a styled magazine article page demonstrating CSS typography:

**HTML to build:**
1. Full HTML5 skeleton with a Google Fonts link in \`<head>\`:
   \`<link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;600&display=swap" rel="stylesheet">\`
2. An \`<article>\` containing:
   - \`<h1>\`: "The Future of Tech Education in Africa"
   - \`<p class="byline">\`: "By EduCode Rwanda | April 2025"
   - \`<hr>\`
   - 2–3 \`<p>\` paragraphs of article text (can be lorem ipsum)
   - A \`<blockquote>\`: a meaningful quote with attribution

**CSS Requirements — demonstrate typography:**
- \`body\`: font-family Inter, line-height: 1.7, max-width: 700px, margin: 40px auto, padding: 20px
- \`h1\`: font-family Merriweather, font-size: 2.2rem, line-height: 1.2, color: #1e293b, margin-bottom: 8px
- \`.byline\`: color: #64748b, font-size: 0.875rem, letter-spacing: 0.05em, text-transform: uppercase
- \`p\`: font-size: 1.125rem, color: #334155, margin-bottom: 1.5rem
- \`blockquote\`: border-left: 4px solid #00d4aa, padding-left: 24px, font-style: italic, color: #475569`,
      starter_code: '',
      hint: 'Google Fonts link goes inside <head> before </head>. Then in CSS use font-family: "Merriweather", serif for the heading and font-family: "Inter", sans-serif for body text. For blockquote with border-left, use padding-left to create space between the bar and text.',
    },
  },

  // ── 3.3 Google Fonts ──────────────────────────────────────────────────────────
  {
    title: 'Google Fonts & Font Stacks',
    order_index: 12,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `Web fonts let you use thousands of fonts beyond the basic system fonts — no need to install anything.

## Web-Safe Fonts

These fonts are pre-installed on most operating systems:
\`\`\`css
font-family: Arial, Helvetica, sans-serif;
font-family: 'Times New Roman', Times, serif;
font-family: 'Courier New', Courier, monospace;
font-family: Georgia, 'Times New Roman', serif;
\`\`\`

## Google Fonts (Recommended)

Google Fonts provides thousands of free, open-source fonts:

**Step 1 — Find a font** at fonts.google.com

**Step 2 — Add the link to your HTML \`<head>\`:**
\`\`\`html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
\`\`\`

**Step 3 — Use it in CSS:**
\`\`\`css
body {
  font-family: 'Inter', sans-serif;
}
h1 {
  font-family: 'Merriweather', serif;
  font-weight: 700;
}
\`\`\`

## Font Stacks

A **font stack** is a comma-separated list of fonts. The browser uses the first available font:

\`\`\`css
/* Try Inter first, then fall back to Arial, then any sans-serif */
font-family: 'Inter', Arial, Helvetica, sans-serif;

/* Serif stack */
font-family: 'Merriweather', Georgia, 'Times New Roman', serif;

/* Code font stack */
font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
\`\`\`

Always end with a **generic family** (sans-serif, serif, monospace) as final fallback.

## Self-Hosted Fonts with \`@font-face\`

For custom or downloaded fonts:

\`\`\`css
@font-face {
  font-family: 'MyFont';
  src: url('fonts/myfont.woff2') format('woff2'),
       url('fonts/myfont.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}

body {
  font-family: 'MyFont', sans-serif;
}
\`\`\`

## Font Pairing Tips

Good combinations:
- **Headings:** Merriweather (serif) + **Body:** Inter (sans-serif)
- **Headings:** Montserrat (sans-serif) + **Body:** Open Sans (sans-serif)
- **Code:** JetBrains Mono + **UI:** Inter

Limit yourself to **2 font families** per project.`,
  },

  // ── 3.4 CSS Media Queries ─────────────────────────────────────────────────────
  {
    title: 'CSS Media Queries & Responsive Design',
    order_index: 13,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `A **responsive** website adapts its layout to different screen sizes — from mobile phones to large desktop monitors. CSS **media queries** make this possible.

## The Viewport Meta Tag

First, add this to your \`<head>\` — essential for mobile responsiveness:
\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
\`\`\`
Without this, mobile browsers zoom out and display the desktop version.

## Media Query Syntax

\`\`\`css
/* Applies only when viewport width is 768px or less */
@media (max-width: 768px) {
  .sidebar { display: none; }
  .main-content { width: 100%; }
}

/* Applies only when viewport width is 1024px or more */
@media (min-width: 1024px) {
  .container { max-width: 1200px; }
}

/* Multiple conditions */
@media (min-width: 480px) and (max-width: 768px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* Orientation */
@media (orientation: landscape) { ... }
@media (orientation: portrait)  { ... }
\`\`\`

## Common Breakpoints

| Name | Width | Typical device |
|------|-------|---------------|
| Mobile | ≤ 480px | Smartphones |
| Tablet | ≤ 768px | Tablets |
| Desktop | ≤ 1024px | Laptops |
| Wide | ≥ 1200px | Large monitors |

## Mobile-First vs Desktop-First

**Mobile-first** (recommended): Write base styles for mobile, then add larger styles with \`min-width\`:
\`\`\`css
/* Base = mobile */
.grid { display: block; }

/* Tablet and up */
@media (min-width: 768px) {
  .grid { display: flex; }
}
\`\`\`

**Desktop-first**: Write styles for desktop, then simplify with \`max-width\`:
\`\`\`css
.grid { display: flex; }

@media (max-width: 768px) {
  .grid { display: block; }
}
\`\`\`

## Practical Example

\`\`\`css
/* Navigation */
nav ul {
  display: flex;
  gap: 24px;
}

@media (max-width: 768px) {
  nav ul {
    flex-direction: column;  /* stack vertically on mobile */
    gap: 8px;
  }
}

/* Cards */
.card-grid {
  display: flex;
  gap: 20px;
}

@media (max-width: 600px) {
  .card-grid {
    flex-direction: column;  /* one column on mobile */
  }
}
\`\`\``,
  },

  // ── Responsive Page Design ────────────────────────────────────────────────────
  {
    title: 'Responsive Page Design',
    order_index: 14,
    lesson_type: 'coding',
    xp_reward: 25,
    content: 'Build a fully responsive web page that adapts to mobile and desktop screen sizes.',
    exercise_data: {
      instructions: `Build a responsive "EduCode Rwanda" landing page:

**Required HTML structure:**
1. \`<header>\` with logo text and \`<nav>\` links
2. \`<main>\` with:
   - A \`<section class="hero">\` with a big headline and subtext
   - A \`<section class="courses">\` with 3 \`<div class="course-card">\` elements

**CSS — Desktop layout (base styles):**
- Body: dark background, white text, margin: 0, font-family
- Header: flex, space-between, sticky top-0
- \`.courses\`: display: flex, gap: 20px (3 columns side by side)
- \`.course-card\`: flex: 1, padding, border, border-radius, dark background

**Media Query — Mobile (\`max-width: 768px\`):**
- Header nav: \`flex-direction: column\` (stack nav links)
- \`.courses\`: \`flex-direction: column\` (cards stack vertically)
- \`.hero h1\`: smaller font-size

**Media Query — Small mobile (\`max-width: 480px\`):**
- Header: \`flex-direction: column; text-align: center\`
- Body: padding: 12px

**Test it:** resize the preview by making the browser window narrower — the layout should change at 768px.`,
      starter_code: '',
      hint: 'Write base (desktop) styles first. Then add @media (max-width: 768px) { } for tablet/mobile. Inside the media query, override display: flex with display: block or flex-direction: column. The viewport meta tag <meta name="viewport" content="width=device-width, initial-scale=1.0"> must be in <head>.',
    },
  },

  // ── CSS Styling Quiz ──────────────────────────────────────────────────────────
  {
    title: 'CSS Styling Quiz',
    order_index: 15,
    lesson_type: 'quiz',
    xp_reward: 10,
    content: 'Test your knowledge of CSS styling, selectors, box model, and media queries.',
    exercise_data: {
      questions: [
        {
          id: 'q1',
          text: 'What does CSS stand for?',
          options: [
            'Computer Style Sheets',
            'Cascading Style Sheets',
            'Creative Style System',
            'Colorful Styling Syntax',
          ],
          correct: 1,
        },
        {
          id: 'q2',
          text: 'Which CSS selector targets an element with class="btn"?',
          options: ['btn { }', '#btn { }', '.btn { }', '*btn { }'],
          correct: 2,
        },
        {
          id: 'q3',
          text: 'Which property controls the space INSIDE an element, between the content and the border?',
          options: ['margin', 'spacing', 'padding', 'gap'],
          correct: 2,
        },
        {
          id: 'q4',
          text: 'What does position: fixed do?',
          options: [
            'Fixes the element at its current position in the document flow',
            'Keeps the element visible in the viewport even when scrolling',
            'Positions the element relative to its parent',
            'Removes the element from the layout',
          ],
          correct: 1,
        },
        {
          id: 'q5',
          text: 'Which CSS at-rule is used to apply styles only on screens narrower than 600px?',
          options: [
            '@screen (max-width: 600px)',
            '@responsive (600px)',
            '@media (max-width: 600px)',
            '@breakpoint 600px',
          ],
          correct: 2,
        },
        {
          id: 'q6',
          text: 'What is the correct way to link an external stylesheet called "styles.css" to an HTML page?',
          options: [
            '<style href="styles.css">',
            '<link rel="stylesheet" href="styles.css">',
            '<css src="styles.css">',
            '<script src="styles.css">',
          ],
          correct: 1,
        },
        {
          id: 'q7',
          text: 'Which font-weight value produces bold text?',
          options: ['400', '200', '700', 'heavy'],
          correct: 2,
        },
        {
          id: 'q8',
          text: 'What does display: flex do to a container element?',
          options: [
            'Makes the element disappear',
            'Makes children display in a row or column with flexible sizing',
            'Fixes the element to the top of the screen',
            'Creates a grid with equal columns',
          ],
          correct: 1,
        },
        {
          id: 'q9',
          text: 'Which CSS property sets the space between lines of text?',
          options: ['text-spacing', 'line-height', 'letter-spacing', 'word-gap'],
          correct: 1,
        },
        {
          id: 'q10',
          text: 'What HTML meta tag is essential for responsive mobile design?',
          options: [
            '<meta name="mobile" content="true">',
            '<meta name="responsive" content="yes">',
            '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
            '<meta name="screen" content="adaptive">',
          ],
          correct: 2,
        },
      ],
    },
  },
];

// ─── Main Seed Function ───────────────────────────────────────────────────────

async function seed() {
  console.log('🌱 Seeding Website Development course...\n');

  let course: { id: string } | null = null;

  const { data: existing } = await supabase
    .from('courses')
    .select('id')
    .eq('title', 'Website Development')
    .single();

  if (existing) {
    course = existing;
    console.log('✅ Using existing course:', course.id);
  } else {
    const { data: inserted, error: courseError } = await supabase
      .from('courses')
      .insert({
        title: 'Website Development',
        title_kin: null,
        description: 'Learn to build websites from scratch. Master keyboard skills, HTML structure, CSS styling, and responsive design. Based on the Rwanda TVET Board curriculum (SWDWD301).',
        description_kin: null,
        difficulty: 'beginner',
        topic: 'Web Development',
        estimated_hours: 150,
        is_published: true,
      })
      .select()
      .single();

    if (courseError) {
      console.error('❌ Failed to insert course:', courseError.message);
      console.error('Tip: Add VITE_SUPABASE_SERVICE_ROLE_KEY to .env to bypass RLS, or insert the course row manually.');
      process.exit(1);
    }
    course = inserted;
    console.log('✅ Course created:', course!.id);
  }

  const moduleDefs = [
    { title: 'Apply Keyboard Skills', order_index: 1, lessons: module1Lessons },
    { title: 'Create Web Structures', order_index: 2, lessons: module2Lessons },
    { title: 'Style Web Elements', order_index: 3, lessons: module3Lessons },
  ];

  for (const mod of moduleDefs) {
    const { data: module, error: modError } = await supabase
      .from('course_modules')
      .insert({
        course_id: course!.id,
        title: mod.title,
        title_kin: null,
        order_index: mod.order_index,
      })
      .select()
      .single();

    if (modError) {
      console.error(`❌ Failed to insert module "${mod.title}":`, modError.message);
      continue;
    }
    console.log(`  ✅ Module ${mod.order_index}: ${mod.title}`);

    for (const lesson of mod.lessons) {
      const { error: lessonError } = await supabase
        .from('course_lessons')
        .insert({
          module_id: module.id,
          title: lesson.title,
          title_kin: null,
          content: lesson.content ?? null,
          content_kin: null,
          lesson_type: lesson.lesson_type,
          exercise_data: lesson.exercise_data ?? null,
          order_index: lesson.order_index,
          xp_reward: lesson.xp_reward,
        });

      if (lessonError) {
        console.error(`    ❌ Failed to insert lesson "${lesson.title}":`, lessonError.message);
      } else {
        const icon = lesson.lesson_type === 'reading' ? '📖' : lesson.lesson_type === 'coding' ? '💻' : '📝';
        console.log(`    ${icon} ${lesson.title}`);
      }
    }
  }

  console.log('\n✅ Seed complete!');
  console.log(`📊 Summary:`);
  console.log(`   Modules: ${moduleDefs.length}`);
  const totalLessons = moduleDefs.reduce((sum, m) => sum + m.lessons.length, 0);
  console.log(`   Lessons: ${totalLessons}`);
}

// ─── SQL Generator (fallback when no service role key) ───────────────────────

function generateSQL() {
  const courseId = 'bbbbbbbb-0000-0000-0000-000000000002';
  const modIds = [randomUUID(), randomUUID(), randomUUID()];

  const q = (s: string | null): string => {
    if (s === null) return 'NULL';
    return "'" + s.replace(/'/g, "''") + "'";
  };

  const moduleDefs = [
    { title: 'Apply Keyboard Skills', order_index: 1, lessons: module1Lessons },
    { title: 'Create Web Structures', order_index: 2, lessons: module2Lessons },
    { title: 'Style Web Elements', order_index: 3, lessons: module3Lessons },
  ];

  const lines: string[] = [
    '-- Website Development Course Seed (SWDWD301)',
    '-- Run this entire script in the Supabase SQL Editor (bypasses RLS)',
    '',
    '-- Modules',
    'INSERT INTO course_modules (id, course_id, title, title_kin, order_index) VALUES',
    ...moduleDefs.map((m, i) =>
      `  (${q(modIds[i])}, ${q(courseId)}, ${q(m.title)}, NULL, ${m.order_index})${i < moduleDefs.length - 1 ? ',' : ';'}`
    ),
    '',
    '-- Lessons',
  ];

  for (let mi = 0; mi < moduleDefs.length; mi++) {
    const mod = moduleDefs[mi];
    lines.push(`-- Module ${mod.order_index}: ${mod.title}`);
    for (const lesson of mod.lessons) {
      const exData = lesson.exercise_data
        ? q(JSON.stringify(lesson.exercise_data)) + '::jsonb'
        : 'NULL';
      lines.push(
        `INSERT INTO course_lessons ` +
        `(module_id, title, title_kin, content, content_kin, lesson_type, exercise_data, order_index, xp_reward) VALUES ` +
        `(${q(modIds[mi])}, ${q(lesson.title)}, NULL, ${q((lesson.content as string | undefined) ?? null)}, NULL, ` +
        `${q(lesson.lesson_type)}, ${exData}, ${lesson.order_index}, ${lesson.xp_reward});`
      );
    }
    lines.push('');
  }

  lines.push(`-- Total: ${moduleDefs.length} modules, ${moduleDefs.reduce((s, m) => s + m.lessons.length, 0)} lessons`);

  return lines.join('\n');
}

// ─── Entry Point ──────────────────────────────────────────────────────────────

if (process.argv[2] === '--sql') {
  const sql = generateSQL();
  writeFileSync('seed.sql', sql, 'utf8');
  console.log('✅ Generated seed.sql');
  console.log('   Paste it into the Supabase SQL Editor to insert all modules + lessons.');
} else {
  seed().catch(console.error);
}
