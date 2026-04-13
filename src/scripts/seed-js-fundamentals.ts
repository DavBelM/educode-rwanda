/**
 * Seed script: JavaScript Fundamentals (SWDJF301)
 * Run with: npx tsx src/scripts/seed-js-fundamentals.ts
 *
 * Uses VITE_SUPABASE_URL + VITE_SUPABASE_SERVICE_ROLE_KEY from .env
 * (or VITE_SUPABASE_ANON_KEY if service role is unavailable)
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
  // ── 1.1 Introduction to JavaScript ──────────────────────────────────────────
  {
    title: 'What is JavaScript?',
    order_index: 1,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `**JavaScript** is a dynamic programming language used to build interactive and responsive websites. It runs directly in the browser — no installation needed.

**What can JavaScript do?**
- Add interactivity to web pages (buttons, forms, animations)
- Validate user input before sending to a server
- Build full web and mobile applications
- Run on servers using Node.js

**JavaScript Key Concepts**

**Variable** — a named storage location for a value.
\`\`\`javascript
let name = "Alice";
var age = 20;
const country = "Rwanda";
\`\`\`

**Data Types** — the kind of value a variable holds (String, Number, Boolean, etc.)

**Operator** — a symbol that performs an operation, like + - * /

**Expression** — a combination of values and operators that produces a result.
\`\`\`javascript
let result = 5 + 3; // expression that evaluates to 8
\`\`\`

**Keyword** — reserved words with special meaning: \`let\`, \`const\`, \`var\`, \`if\`, \`function\`, \`return\`

**Comment** — text ignored by JavaScript, used to explain code:
\`\`\`javascript
// This is a single-line comment

/* This is a
   multi-line comment */
\`\`\`

**JavaScript Libraries** are collections of pre-written code you can reuse:
- **React** — for building user interfaces
- **jQuery** — for simplifying DOM manipulation
- **Three.js** — for 3D graphics

**JavaScript Frameworks** provide structure for building applications:
- **Vue.js**, **Angular**, **Express.js**

**JavaScript runs on:**
- Browsers (Chrome, Firefox) using engines like Google's **V8**
- Servers using **Node.js**

JavaScript was invented by Brendan Eich in **1995** and became an ECMA standard in 1997. The current standard is called **ECMAScript (ES)**.`,
  },
  {
    title: 'Your First JavaScript Program',
    order_index: 2,
    lesson_type: 'coding',
    xp_reward: 15,
    content: 'Practice writing basic JavaScript output statements using console.log().',
    exercise_data: {
      instructions: `Write a JavaScript program that does the following:
1. Declare a variable called **name** and assign it your name as a string
2. Declare a variable called **age** and assign it a number
3. Declare a variable called **country** and assign it "Rwanda"
4. Use console.log() to print: "My name is [name], I am [age] years old, from [country]"

Example output:
My name is Alice, I am 20 years old, from Rwanda`,
      starter_code: `// Step 1: Declare your variables
let name = "";
let age = 0;
let country = "";

// Step 2: Print them using console.log()
`,
      hint: 'Use the + operator or a template literal to join strings: `"My name is " + name` or use backticks: `My name is ${name}`',
    },
  },
  {
    title: 'Using Comments in JavaScript',
    order_index: 3,
    lesson_type: 'coding',
    xp_reward: 15,
    content: 'Practice using single-line and multi-line comments to document your code.',
    exercise_data: {
      instructions: `Complete the following tasks:
1. Add a **single-line comment** above the first variable explaining what it stores
2. Add a **multi-line comment** at the top of the file describing what the program does
3. Declare two number variables and calculate their sum
4. Print the result with a descriptive label

Expected output:
Sum of 15 and 25 is: 40`,
      starter_code: `/*
  TODO: Write your multi-line comment here
  describing what this program does
*/

// TODO: Add a single-line comment here
let num1 = 15;
let num2 = 25;

// Calculate the sum and print it
`,
      hint: 'Single-line comments start with //. Multi-line comments use /* and */. Use console.log("Sum:", num1 + num2) to print.',
    },
  },

  // ── 1.2 Integration of JavaScript to HTML ────────────────────────────────────
  {
    title: 'Integrating JavaScript into HTML',
    order_index: 4,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `JavaScript is integrated into HTML pages using the **\`<script>\`** tag.

**Three ways to add JavaScript to HTML:**

**1. Inline JavaScript (inside HTML file)**
Place the \`<script>\` tag inside \`<head>\` or \`<body>\`:
\`\`\`html
<!DOCTYPE html>
<html>
<body>
  <h1>Hello</h1>
  <script>
    console.log("JavaScript is running!");
  </script>
</body>
</html>
\`\`\`
Best practice: place \`<script>\` at the **end of \`<body>\`** so HTML loads first.

**2. External JavaScript File**
Save JS code in a separate \`.js\` file, then link it:
\`\`\`html
<script src="app.js"></script>
\`\`\`
Benefits: reusable across pages, cleaner HTML.

**3. CDN (Content Delivery Network)**
Load popular libraries from remote servers:
\`\`\`html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
\`\`\`

**JavaScript Output Methods**
JavaScript can display output in different ways:
\`\`\`javascript
console.log("Output to browser console");
document.write("Write directly to page");
window.alert("Show a popup alert");
document.getElementById("demo").innerHTML = "Change HTML content";
\`\`\`

**Points to Remember:**
- Always place \`<script>\` at the end of \`<body>\` for best performance
- External JS files cannot contain the \`<script>\` tag
- \`console.log()\` is the most common way to debug and test`,
  },
  {
    title: 'JavaScript Output Methods',
    order_index: 5,
    lesson_type: 'coding',
    xp_reward: 15,
    content: 'Practice the different ways JavaScript can display output.',
    exercise_data: {
      instructions: `Practice JavaScript output methods:
1. Use **console.log()** to print "Hello from the console!"
2. Declare a variable \`score\` = 95
3. Use console.log() to print: "Your score is: 95"
4. Declare a variable \`message\` = "JavaScript is fun!"
5. Print the message variable
6. Print the result of 10 * 5

Expected console output:
Hello from the console!
Your score is: 95
JavaScript is fun!
50`,
      starter_code: `// 1. Print a greeting
console.log("Hello from the console!");

// 2. Declare score variable
let score = 95;

// 3. Print the score
// your code here

// 4. Declare message variable
let message = "JavaScript is fun!";

// 5. Print the message
// your code here

// 6. Print 10 * 5
// your code here
`,
      hint: 'console.log() accepts variables directly: console.log(score). You can also combine strings: console.log("Your score is: " + score)',
    },
  },
  {
    title: 'Writing JavaScript in HTML',
    order_index: 6,
    lesson_type: 'coding',
    xp_reward: 20,
    content: 'Practice embedding JavaScript in an HTML page to create dynamic content.',
    exercise_data: {
      instructions: `Write an HTML page with embedded JavaScript that:
1. Has a heading: "Welcome to EduCode"
2. Has a paragraph with id="greeting"
3. Uses JavaScript to change the paragraph text to "Hello, Student! Ready to code?"
4. Uses JavaScript to change the paragraph's color to the teal color: #00d4aa

Write your code in the HTML tab.`,
      starter_code: ``,
      hint: 'Use document.getElementById("greeting").innerHTML to set text. Use .style.color to set the color.',
    },
  },

  // ── 1.3 Variables ─────────────────────────────────────────────────────────────
  {
    title: 'Variables in JavaScript',
    order_index: 7,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `A **variable** is a named container that stores a value in memory.

**Three ways to declare variables:**

| Keyword | Reassignable | Block Scoped | Hoisted |
|---------|-------------|--------------|---------|
| \`var\`   | Yes          | No (function) | Yes    |
| \`let\`   | Yes          | Yes           | No     |
| \`const\` | No           | Yes           | No     |

\`\`\`javascript
var city = "Kigali";       // old style, avoid when possible
let score = 100;            // can be changed later
const PI = 3.14159;         // cannot be changed
\`\`\`

**Variable Naming Rules:**
- Must start with a letter, \`_\`, or \`$\`
- Cannot use reserved keywords (\`let\`, \`if\`, \`return\`, etc.)
- Case-sensitive: \`name\` and \`Name\` are different
- Use **camelCase** convention: \`firstName\`, \`totalScore\`

**Variable Scope**

**Global scope** — declared outside any function, accessible everywhere:
\`\`\`javascript
let globalVar = "I am global";

function greet() {
  console.log(globalVar); // accessible here
}
\`\`\`

**Local/Block scope** — declared inside \`{}\`, only accessible within:
\`\`\`javascript
function calculate() {
  let localVar = 10; // only exists inside this function
  console.log(localVar); // works
}
console.log(localVar); // ERROR — not accessible here
\`\`\`

**Best Practices:**
- Prefer \`const\` by default
- Use \`let\` when you need to reassign
- Avoid \`var\` in modern JavaScript`,
  },
  {
    title: 'Declaring Variables: var, let, and const',
    order_index: 8,
    lesson_type: 'coding',
    xp_reward: 15,
    content: 'Practice declaring and using variables with var, let, and const.',
    exercise_data: {
      instructions: `Complete the following:
1. Declare a \`const\` called \`schoolName\` with value "EduCode Rwanda"
2. Declare a \`let\` called \`studentCount\` with value 30
3. Declare a \`let\` called \`courseName\` with value "JavaScript Fundamentals"
4. Update \`studentCount\` to 35 (a new student joined!)
5. Print all three variables
6. Try to reassign \`schoolName\` — read the error message in the console

Expected output:
EduCode Rwanda
35
JavaScript Fundamentals`,
      starter_code: `// 1. Declare schoolName as a constant
const schoolName = "EduCode Rwanda";

// 2. Declare studentCount
let studentCount = 30;

// 3. Declare courseName
let courseName = "JavaScript Fundamentals";

// 4. Update studentCount to 35
// your code here

// 5. Print all three
// your code here

// 6. Uncomment and observe the error:
// schoolName = "Other School";
`,
      hint: 'To update let variables just write: studentCount = 35; (no need for let again). const variables cannot be reassigned — you will get a TypeError.',
    },
  },
  {
    title: 'Variable Scope',
    order_index: 9,
    lesson_type: 'coding',
    xp_reward: 20,
    content: 'Understand how variable scope works in JavaScript.',
    exercise_data: {
      instructions: `Explore variable scope:
1. Declare a global variable \`appName\` = "EduCode"
2. Write a function \`showInfo()\` that:
   - Declares a local variable \`version\` = "1.0"
   - Prints both \`appName\` (global) and \`version\` (local)
3. Call \`showInfo()\`
4. Print \`appName\` outside the function (works!)
5. Try printing \`version\` outside the function — observe the error

Expected output (before the error):
App: EduCode, Version: 1.0
EduCode`,
      starter_code: `// 1. Global variable
let appName = "EduCode";

// 2. Function with local variable
function showInfo() {
  let version = "1.0";
  // print both appName and version here
  console.log("App: " + appName + ", Version: " + version);
}

// 3. Call the function
showInfo();

// 4. Print appName globally
console.log(appName);

// 5. Uncomment to see scope error:
// console.log(version);
`,
      hint: 'Global variables are accessible everywhere. Local variables only exist inside the function they are declared in.',
    },
  },

  // ── 1.4 Data Types ────────────────────────────────────────────────────────────
  {
    title: 'JavaScript Data Types',
    order_index: 10,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `**Data types** describe what kind of value a variable holds.

JavaScript has two categories:

---

**Primitive Data Types** (built-in, immutable):

| Type | Description | Example |
|------|------------|---------|
| String | Text | \`"Hello"\` |
| Number | Integer or decimal | \`42\`, \`3.14\` |
| Boolean | true or false | \`true\` |
| Undefined | No value assigned | \`let x;\` |
| Null | Intentional empty value | \`let x = null;\` |

\`\`\`javascript
let name = "Amina";        // String
let score = 95;            // Number
let passed = true;         // Boolean
let nickname;              // Undefined
let address = null;        // Null
\`\`\`

---

**Non-Primitive (Reference) Data Types:**

| Type | Description | Example |
|------|------------|---------|
| Object | Key-value pairs | \`{ name: "Ali", age: 20 }\` |
| Array | Ordered list of values | \`[1, 2, 3]\` |
| RegExp | Pattern matching | \`/[a-z]+/\` |

\`\`\`javascript
// Object
let student = { name: "Amina", age: 20, city: "Kigali" };

// Array
let grades = [85, 90, 78, 92];

// Check type using typeof
console.log(typeof "hello");   // "string"
console.log(typeof 42);        // "number"
console.log(typeof true);      // "boolean"
console.log(typeof undefined); // "undefined"
\`\`\`

**Type Conversion:**
\`\`\`javascript
// String to Number
let num = Number("42");     // 42
let num2 = parseInt("10px"); // 10

// Number to String
let str = String(100);      // "100"
let str2 = (100).toString(); // "100"

// To Boolean
let bool = Boolean(0);      // false
let bool2 = Boolean("hi");  // true
\`\`\``,
  },
  {
    title: 'Primitive Data Types in Practice',
    order_index: 11,
    lesson_type: 'coding',
    xp_reward: 15,
    content: 'Practice using all primitive data types and the typeof operator.',
    exercise_data: {
      instructions: `Create variables of each primitive type and check them:
1. Create a String variable \`studentName\` = "Kalisa"
2. Create a Number variable \`marks\` = 87.5
3. Create a Boolean variable \`isPassed\` = true
4. Create an Undefined variable \`nickname\` (declare without assigning)
5. Create a Null variable \`address\` = null
6. For each variable, print: the variable name, its value, and its type using \`typeof\`

Expected output:
studentName: Kalisa | type: string
marks: 87.5 | type: number
isPassed: true | type: boolean
nickname: undefined | type: undefined
address: null | type: object`,
      starter_code: `// Declare all 5 variables
let studentName = "Kalisa";
let marks = 87.5;
let isPassed = true;
let nickname;
let address = null;

// Print each with its type
console.log("studentName:", studentName, "| type:", typeof studentName);
// do the same for the other 4 variables
`,
      hint: 'Note that typeof null returns "object" — this is a known JavaScript quirk. Use the same console.log pattern for each variable.',
    },
  },
  {
    title: 'Type Conversion in JavaScript',
    order_index: 12,
    lesson_type: 'coding',
    xp_reward: 20,
    content: 'Practice converting between different data types.',
    exercise_data: {
      instructions: `Practice type conversion:
1. Convert the string "42" to a number and add 8 to it — print the result (should be 50, not "428")
2. Convert the number 2024 to a string and concatenate " is a great year!" — print it
3. Convert 0 to Boolean and print it (should be false)
4. Convert "Rwanda" to Boolean and print it (should be true)
5. Use parseInt to extract the number from "100px" and print it

Expected output:
50
2024 is a great year!
false
true
100`,
      starter_code: `// 1. String to Number
let strNum = "42";
let converted = Number(strNum);
console.log(converted + 8);

// 2. Number to String
let year = 2024;
// your code here

// 3. Boolean(0)
// your code here

// 4. Boolean("Rwanda")
// your code here

// 5. parseInt
// your code here
`,
      hint: 'Use Number(), String(), Boolean() for explicit conversion. Use parseInt() to get integer from a string like "100px".',
    },
  },

  // ── 1.5 Operators ─────────────────────────────────────────────────────────────
  {
    title: 'JavaScript Operators',
    order_index: 13,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `**Operators** are symbols that perform operations on values (operands).

---

**Arithmetic Operators**
\`\`\`javascript
let a = 10, b = 3;
console.log(a + b);  // 13 — addition
console.log(a - b);  // 7  — subtraction
console.log(a * b);  // 30 — multiplication
console.log(a / b);  // 3.33 — division
console.log(a % b);  // 1  — modulus (remainder)
console.log(a ** b); // 1000 — exponentiation
\`\`\`

**Increment / Decrement**
\`\`\`javascript
let x = 5;
x++;  // x becomes 6
x--;  // x becomes 5 again
\`\`\`

---

**Comparison Operators** (return true or false)
\`\`\`javascript
console.log(5 == "5");   // true  — equal value (loose)
console.log(5 === "5");  // false — equal value AND type (strict)
console.log(5 != 3);     // true
console.log(5 > 3);      // true
console.log(5 < 3);      // false
console.log(5 >= 5);     // true
\`\`\`
**Always prefer \`===\` over \`==\`** for strict comparison.

---

**Logical Operators**
\`\`\`javascript
let age = 20;
let hasID = true;

console.log(age >= 18 && hasID);  // true — AND: both must be true
console.log(age < 18 || hasID);   // true — OR: at least one true
console.log(!hasID);               // false — NOT: flips the value
\`\`\`

---

**Assignment Operators**
\`\`\`javascript
let score = 10;
score += 5;   // score = 15
score -= 3;   // score = 12
score *= 2;   // score = 24
score /= 4;   // score = 6
score %= 4;   // score = 2
\`\`\`

---

**String Operator**
\`\`\`javascript
let first = "Kigali";
let second = " Rwanda";
console.log(first + second); // "Kigali Rwanda" — concatenation
\`\`\``,
  },
  {
    title: 'Arithmetic and Comparison Operators',
    order_index: 14,
    lesson_type: 'coding',
    xp_reward: 15,
    content: 'Practice arithmetic and comparison operators in JavaScript.',
    exercise_data: {
      instructions: `A student scored marks in 3 subjects. Calculate their results:
1. Declare: \`math\` = 85, \`english\` = 72, \`science\` = 90
2. Calculate and print the **total** marks
3. Calculate and print the **average** marks
4. Print whether the average is **greater than or equal to 75** (passing grade)
5. Print whether math score is **strictly equal** to the string "85"
6. Print whether math score equals 85 using strict equality

Expected output:
Total: 247
Average: 82.33333333333333
Passed: true
Math equals "85" (loose): true
Math equals "85" (strict): false`,
      starter_code: `let math = 85;
let english = 72;
let science = 90;

// 2. Total
let total = math + english + science;
console.log("Total:", total);

// 3. Average
// your code here

// 4. Passed (average >= 75)?
// your code here

// 5. Loose equality with string "85"
console.log('Math equals "85" (loose):', math == "85");

// 6. Strict equality with string "85"
// your code here
`,
      hint: 'Average = total / 3. Use >= for comparison. Remember: == does type coercion, === does not.',
    },
  },
  {
    title: 'Logical and Assignment Operators',
    order_index: 15,
    lesson_type: 'coding',
    xp_reward: 20,
    content: 'Practice logical operators (&&, ||, !) and assignment operators (+=, -=, etc.).',
    exercise_data: {
      instructions: `Work through these operator exercises:
1. A student needs score >= 50 AND attendance >= 80% to pass.
   Set \`score\` = 65, \`attendance\` = 75. Print whether they pass.
2. A discount applies if age < 18 OR isStudent is true.
   Set \`age\` = 25, \`isStudent\` = true. Print whether discount applies.
3. Start with \`points\` = 100. Apply these operations in order:
   - Add 50 points (+=)
   - Subtract 30 points (-=)
   - Multiply by 2 (*=)
   - Print the final points

Expected output:
Student passes: false
Discount applies: true
Final points: 240`,
      starter_code: `// 1. Pass condition
let score = 65;
let attendance = 75;
let passes = score >= 50 && attendance >= 80;
console.log("Student passes:", passes);

// 2. Discount condition
let age = 25;
let isStudent = true;
// your code here

// 3. Assignment operators
let points = 100;
points += 50;
// continue with -= and *=
// print final points
`,
      hint: 'Use && for AND, || for OR. For assignment operators: points -= 30 subtracts 30, points *= 2 doubles the value.',
    },
  },

  // ── Module 1 Quiz ──────────────────────────────────────────────────────────────
  {
    title: 'Module 1 Assessment',
    order_index: 16,
    lesson_type: 'quiz',
    xp_reward: 30,
    content: 'Test your understanding of JavaScript basic concepts.',
    exercise_data: {
      questions: [
        {
          id: 'q1',
          text: 'What is JavaScript primarily used for?',
          options: [
            'Styling web pages',
            'Adding interactivity and dynamic behavior to web pages',
            'Defining the structure of a web page',
            'Managing databases',
          ],
          correct: 1,
        },
        {
          id: 'q2',
          text: 'Which keyword is used to declare a variable that CANNOT be reassigned?',
          options: ['var', 'let', 'const', 'static'],
          correct: 2,
        },
        {
          id: 'q3',
          text: 'What does the following code print?\n\nconsole.log(typeof 42);',
          options: ['"integer"', '"number"', '"int"', '"float"'],
          correct: 1,
        },
        {
          id: 'q4',
          text: 'Which of the following is a CORRECT way to add a single-line comment in JavaScript?',
          options: ['<!-- comment -->', '/* comment', '// comment', '# comment'],
          correct: 2,
        },
        {
          id: 'q5',
          text: 'What is the result of: 5 === "5"?',
          options: ['true', 'false', 'undefined', 'Error'],
          correct: 1,
        },
        {
          id: 'q6',
          text: 'Which HTML tag is used to include JavaScript in a web page?',
          options: ['<javascript>', '<js>', '<script>', '<code>'],
          correct: 2,
        },
        {
          id: 'q7',
          text: 'What will this code output?\n\nlet x = 10;\nx += 5;\nconsole.log(x);',
          options: ['10', '5', '15', 'x5'],
          correct: 2,
        },
        {
          id: 'q8',
          text: 'Which data type represents a sequence of characters?',
          options: ['Number', 'Boolean', 'String', 'Undefined'],
          correct: 2,
        },
        {
          id: 'q9',
          text: 'What is the value of a variable declared with let but not assigned?',
          options: ['null', '0', 'undefined', 'empty'],
          correct: 2,
        },
        {
          id: 'q10',
          text: 'What does the % operator do in JavaScript?',
          options: [
            'Calculates percentage',
            'Returns the remainder of division',
            'Multiplies two numbers',
            'Converts to percentage string',
          ],
          correct: 1,
        },
      ],
    },
  },
];

// ─── Module 2 Lessons ─────────────────────────────────────────────────────────

const module2Lessons = [
  // ── 2.1 Strings ──────────────────────────────────────────────────────────────
  {
    title: 'Working with Strings',
    order_index: 1,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `A **string** is a sequence of characters used to represent text.

**Creating Strings:**
\`\`\`javascript
let single = 'Hello';
let double = "World";
let backtick = \`Template Literal\`;
\`\`\`

**String Properties:**
\`\`\`javascript
let name = "Kigali";
console.log(name.length); // 6 — number of characters
\`\`\`

**Common String Methods:**
\`\`\`javascript
let str = "Hello, Rwanda!";

str.toUpperCase()        // "HELLO, RWANDA!"
str.toLowerCase()        // "hello, rwanda!"
str.indexOf("Rwanda")    // 7 — position where it starts
str.includes("Rwanda")   // true
str.slice(7, 13)         // "Rwanda"
str.replace("Rwanda", "World") // "Hello, World!"
str.trim()               // removes whitespace from both ends
str.split(", ")          // ["Hello", "Rwanda!"]
\`\`\`

**Template Literals** (backtick strings) allow embedded expressions:
\`\`\`javascript
let student = "Amina";
let score = 92;
let msg = \`Student \${student} scored \${score} marks.\`;
console.log(msg); // "Student Amina scored 92 marks."

// Multi-line strings
let poem = \`Line one
Line two
Line three\`;
\`\`\`

**String Concatenation:**
\`\`\`javascript
let first = "Java";
let second = "Script";
console.log(first + second); // "JavaScript"
\`\`\`

**Accessing Characters:**
\`\`\`javascript
let word = "Code";
console.log(word[0]);      // "C"
console.log(word[word.length - 1]); // "e" — last character
\`\`\``,
  },
  {
    title: 'String Methods Practice',
    order_index: 2,
    lesson_type: 'coding',
    xp_reward: 15,
    content: 'Practice using the most common string methods.',
    exercise_data: {
      instructions: `Work with the student's full name using string methods:
1. Declare \`fullName\` = "  amina uwimana  " (note: extra spaces, lowercase)
2. Remove the extra whitespace using \`.trim()\`
3. Convert to uppercase and print it
4. Print the length of the trimmed name
5. Check if the name includes "uwimana" (case-sensitive) — print the result
6. Replace "amina" with "Amina" and print the corrected name

Expected output:
AMINA UWIMANA
13
true
Amina uwimana`,
      starter_code: `let fullName = "  amina uwimana  ";

// 2. Trim whitespace
let trimmed = fullName.trim();

// 3. Uppercase
console.log(trimmed.toUpperCase());

// 4. Length of trimmed name
// your code here

// 5. Includes "uwimana"?
// your code here

// 6. Replace "amina" with "Amina"
// your code here
`,
      hint: 'Chain methods: trimmed.toUpperCase(). For length use trimmed.length. For replace: trimmed.replace("amina", "Amina").',
    },
  },
  {
    title: 'Template Literals and String Formatting',
    order_index: 3,
    lesson_type: 'coding',
    xp_reward: 20,
    content: 'Use template literals to build dynamic strings.',
    exercise_data: {
      instructions: `Build a student report card using template literals:
1. Declare variables: \`name\` = "Kalisa", \`math\` = 88, \`english\` = 74, \`science\` = 91
2. Calculate the average
3. Use a template literal to print a formatted report:

--- Student Report ---
Name: Kalisa
Math: 88
English: 74
Science: 91
Average: 84.33
Status: PASSED`,
      starter_code: `let name = "Kalisa";
let math = 88;
let english = 74;
let science = 91;

// Calculate average
let average = (math + english + science) / 3;

// Build the report using template literals
let report = \`--- Student Report ---
Name: \${name}
Math: \${math}
\`;

// Complete the template and print it
console.log(report);
`,
      hint: 'Template literals use backticks and ${} for variables. Use .toFixed(2) on a number to round to 2 decimal places: average.toFixed(2)',
    },
  },

  // ── 2.2 Conditional Statements ───────────────────────────────────────────────
  {
    title: 'Conditional Statements',
    order_index: 4,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `**Conditional statements** execute different code based on whether a condition is true or false.

**if / else if / else:**
\`\`\`javascript
let score = 75;

if (score >= 80) {
  console.log("Distinction");
} else if (score >= 60) {
  console.log("Merit");
} else if (score >= 50) {
  console.log("Pass");
} else {
  console.log("Fail");
}
// Output: "Merit"
\`\`\`

**Ternary Operator** — shorthand for simple if/else:
\`\`\`javascript
let age = 20;
let status = age >= 18 ? "Adult" : "Minor";
console.log(status); // "Adult"
\`\`\`

**switch Statement** — for multiple fixed values:
\`\`\`javascript
let day = "Monday";

switch (day) {
  case "Monday":
  case "Tuesday":
    console.log("Start of week");
    break;
  case "Friday":
    console.log("End of week");
    break;
  default:
    console.log("Midweek");
}
\`\`\`

**Important:** Always add \`break\` in switch cases to prevent fall-through.

**Truthy and Falsy values:**
\`\`\`javascript
// Falsy: false, 0, "", null, undefined, NaN
// Truthy: everything else

if ("") console.log("truthy"); // does NOT run
if ("hello") console.log("truthy"); // runs
if (0) console.log("truthy");  // does NOT run
if (1) console.log("truthy");  // runs
\`\`\``,
  },
  {
    title: 'if/else Statements in Practice',
    order_index: 5,
    lesson_type: 'coding',
    xp_reward: 15,
    content: 'Write conditional logic to grade student scores.',
    exercise_data: {
      instructions: `Write a grading system using if/else if/else:
- Score >= 80: "Distinction"
- Score >= 60: "Merit"
- Score >= 50: "Pass"
- Below 50: "Fail"

Test with these scores and print each result: 85, 65, 50, 35

Also use the ternary operator to check if a score of 72 is a "Pass" or "Fail".

Expected output:
85 → Distinction
65 → Merit
50 → Pass
35 → Fail
72 is: Pass`,
      starter_code: `function getGrade(score) {
  if (score >= 80) {
    return "Distinction";
  } else if (score >= 60) {
    // your code
  } else if (score >= 50) {
    // your code
  } else {
    // your code
  }
}

console.log("85 →", getGrade(85));
console.log("65 →", getGrade(65));
console.log("50 →", getGrade(50));
console.log("35 →", getGrade(35));

// Ternary operator
let check = 72;
let result = check >= 50 ? "Pass" : "Fail";
console.log("72 is:", result);
`,
      hint: 'Complete the else if and else branches by returning the correct grade string. The ternary operator format is: condition ? valueIfTrue : valueIfFalse',
    },
  },
  {
    title: 'The switch Statement',
    order_index: 6,
    lesson_type: 'coding',
    xp_reward: 20,
    content: 'Use switch statements to handle multiple fixed conditions.',
    exercise_data: {
      instructions: `Write a program that:
1. Takes a \`dayNumber\` (1-7) and uses a switch to print the day name
2. Takes a \`season\` string and prints activities for that season

Test day numbers: 1, 3, 5, 7
Test seasons: "summer", "winter", "unknown"

Expected output:
Day 1: Monday
Day 3: Wednesday
Day 5: Friday
Day 7: Sunday
summer: Swimming and outdoor sports
winter: Reading and indoor games
unknown: Season not recognized`,
      starter_code: `// Day of week switch
function getDayName(dayNumber) {
  switch (dayNumber) {
    case 1: return "Monday";
    case 2: return "Tuesday";
    // add cases 3-7
    default: return "Invalid day";
  }
}

console.log("Day 1:", getDayName(1));
console.log("Day 3:", getDayName(3));
console.log("Day 5:", getDayName(5));
console.log("Day 7:", getDayName(7));

// Season activities
function getActivities(season) {
  switch (season) {
    case "summer":
      return "Swimming and outdoor sports";
    // add winter and default
  }
}

console.log("summer:", getActivities("summer"));
console.log("winter:", getActivities("winter"));
console.log("unknown:", getActivities("unknown"));
`,
      hint: 'Each case needs a return or break. The default case handles anything that does not match. Add cases 3 through 7 for the days.',
    },
  },

  // ── 2.3 Loops ─────────────────────────────────────────────────────────────────
  {
    title: 'JavaScript Loops',
    order_index: 7,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `**Loops** repeat a block of code multiple times.

**for loop** — when you know how many times to repeat:
\`\`\`javascript
for (let i = 0; i < 5; i++) {
  console.log("Count:", i);
}
// Prints: Count: 0, Count: 1, Count: 2, Count: 3, Count: 4
\`\`\`
Structure: \`for (initialization; condition; update)\`

**while loop** — repeat while a condition is true:
\`\`\`javascript
let count = 0;
while (count < 3) {
  console.log("Hello", count);
  count++;
}
\`\`\`

**do...while loop** — runs at least once, checks condition after:
\`\`\`javascript
let n = 0;
do {
  console.log("n is:", n);
  n++;
} while (n < 3);
\`\`\`

**for...of loop** — iterate over arrays:
\`\`\`javascript
let fruits = ["apple", "mango", "banana"];
for (let fruit of fruits) {
  console.log(fruit);
}
\`\`\`

**for...in loop** — iterate over object keys:
\`\`\`javascript
let person = { name: "Ali", age: 20 };
for (let key in person) {
  console.log(key + ":", person[key]);
}
\`\`\`

**Loop Control:**
\`\`\`javascript
for (let i = 0; i < 10; i++) {
  if (i === 3) continue; // skip 3
  if (i === 6) break;    // stop at 6
  console.log(i);
}
// Prints: 0 1 2 4 5
\`\`\``,
  },
  {
    title: 'for and while Loops',
    order_index: 8,
    lesson_type: 'coding',
    xp_reward: 15,
    content: 'Practice writing for and while loops.',
    exercise_data: {
      instructions: `Complete these loop exercises:
1. Use a **for loop** to print numbers 1 to 10
2. Use a **for loop** to calculate the sum of numbers 1 to 100 — print the result
3. Use a **while loop** to count down from 5 to 1 and print "Go!" at the end
4. Use **for...of** to print each item in: ["Kigali", "Butare", "Musanze"]

Expected output (first few lines):
1
2
...
10
Sum 1-100: 5050
5
4
3
2
1
Go!
Kigali
Butare
Musanze`,
      starter_code: `// 1. Print 1 to 10
for (let i = 1; i <= 10; i++) {
  console.log(i);
}

// 2. Sum of 1 to 100
let sum = 0;
for (let i = 1; i <= 100; i++) {
  // add i to sum
}
console.log("Sum 1-100:", sum);

// 3. Countdown with while
let count = 5;
while (count >= 1) {
  // print count, then decrement
}
console.log("Go!");

// 4. for...of
let cities = ["Kigali", "Butare", "Musanze"];
// your code here
`,
      hint: 'For sum: sum += i inside the loop. For countdown: console.log(count); count--;. For for...of: for (let city of cities) { console.log(city); }',
    },
  },
  {
    title: 'Loop Control: break and continue',
    order_index: 9,
    lesson_type: 'coding',
    xp_reward: 20,
    content: 'Use break and continue to control loop execution.',
    exercise_data: {
      instructions: `Practice controlling loops:
1. Loop from 1 to 20. Use **continue** to skip even numbers. Print only odd numbers.
2. Loop from 1 to 100. Use **break** to stop when you find the first number divisible by both 7 and 11. Print that number.
3. Loop through this array and stop (break) when you find "mango": ["apple", "banana", "mango", "orange", "grape"]. Print each fruit until (and including) mango.

Expected output:
1 3 5 7 9 11 13 15 17 19
First divisible by 7 and 11: 77
apple
banana
mango`,
      starter_code: `// 1. Odd numbers only
let oddOutput = "";
for (let i = 1; i <= 20; i++) {
  if (i % 2 === 0) continue; // skip even
  oddOutput += i + " ";
}
console.log(oddOutput.trim());

// 2. First divisible by 7 AND 11
for (let i = 1; i <= 100; i++) {
  if (i % 7 === 0 && i % 11 === 0) {
    console.log("First divisible by 7 and 11:", i);
    break;
  }
}

// 3. Stop at mango
let fruits = ["apple", "banana", "mango", "orange", "grape"];
for (let fruit of fruits) {
  console.log(fruit);
  if (fruit === "mango") break;
}
`,
      hint: 'continue skips to the next iteration. break exits the loop entirely. i % 2 === 0 means the number is even.',
    },
  },

  // ── 2.4 Functions ─────────────────────────────────────────────────────────────
  {
    title: 'Functions in JavaScript',
    order_index: 10,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `A **function** is a reusable block of code that performs a specific task.

**Function Declaration:**
\`\`\`javascript
function greet(name) {
  return "Hello, " + name + "!";
}
console.log(greet("Amina")); // "Hello, Amina!"
\`\`\`

**Function Expression:**
\`\`\`javascript
const add = function(a, b) {
  return a + b;
};
console.log(add(3, 5)); // 8
\`\`\`

**Arrow Functions** (ES6 — shorter syntax):
\`\`\`javascript
const multiply = (a, b) => a * b;
console.log(multiply(4, 5)); // 20

// Single parameter — no parentheses needed
const double = n => n * 2;
console.log(double(7)); // 14

// No parameters
const sayHi = () => "Hi there!";
\`\`\`

**Default Parameters:**
\`\`\`javascript
function greet(name = "Student") {
  return \`Hello, \${name}!\`;
}
console.log(greet());         // "Hello, Student!"
console.log(greet("Kalisa")); // "Hello, Kalisa!"
\`\`\`

**Rest Parameters** (variable number of arguments):
\`\`\`javascript
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
console.log(sum(1, 2, 3, 4, 5)); // 15
\`\`\`

**Functions as values** (passed to other functions):
\`\`\`javascript
function applyTwice(fn, value) {
  return fn(fn(value));
}
const double = n => n * 2;
console.log(applyTwice(double, 3)); // 12
\`\`\``,
  },
  {
    title: 'Writing and Calling Functions',
    order_index: 11,
    lesson_type: 'coding',
    xp_reward: 15,
    content: 'Write and call functions to solve real problems.',
    exercise_data: {
      instructions: `Write these functions:
1. \`calculateArea(width, height)\` — returns width × height. Test with (5, 8)
2. \`isEven(number)\` — returns true if even, false if odd. Test with 4 and 7
3. \`greetStudent(name, score)\` — returns "Hello [name]! Your score is [score]/100." Test with "Amina", 88
4. \`celsiusToFahrenheit(c)\` — converts using formula: (c × 9/5) + 32. Test with 0, 100, 37

Expected output:
Area: 40
4 is even: true
7 is even: false
Hello Amina! Your score is 88/100.
0°C = 32°F
100°C = 212°F
37°C = 98.6°F`,
      starter_code: `// 1. Area calculator
function calculateArea(width, height) {
  return width * height;
}
console.log("Area:", calculateArea(5, 8));

// 2. Even or odd
function isEven(number) {
  // return true if number % 2 === 0
}
console.log("4 is even:", isEven(4));
console.log("7 is even:", isEven(7));

// 3. Greet student
function greetStudent(name, score) {
  // return the greeting string
}
console.log(greetStudent("Amina", 88));

// 4. Celsius to Fahrenheit
function celsiusToFahrenheit(c) {
  // your formula here
}
console.log("0°C =", celsiusToFahrenheit(0) + "°F");
console.log("100°C =", celsiusToFahrenheit(100) + "°F");
console.log("37°C =", celsiusToFahrenheit(37) + "°F");
`,
      hint: 'isEven: return number % 2 === 0. greetStudent: use template literals. celsiusToFahrenheit: return (c * 9/5) + 32.',
    },
  },
  {
    title: 'Arrow Functions',
    order_index: 12,
    lesson_type: 'coding',
    xp_reward: 20,
    content: 'Rewrite regular functions as arrow functions and use them as callbacks.',
    exercise_data: {
      instructions: `Practice arrow functions:
1. Write an arrow function \`square\` that returns a number squared. Test with 6.
2. Write an arrow function \`isAdult\` that returns true if age >= 18. Test with 16 and 21.
3. Write an arrow function \`formatName\` with default parameter name="Student". Test with no argument and with "Kalisa".
4. Use \`.map()\` with an arrow function to double every number in [1, 2, 3, 4, 5] and print the result.

Expected output:
6 squared: 36
16 is adult: false
21 is adult: true
Hello, Student!
Hello, Kalisa!
Doubled: [2, 4, 6, 8, 10]`,
      starter_code: `// 1. Square arrow function
const square = n => n * n;
console.log("6 squared:", square(6));

// 2. isAdult arrow function
const isAdult = age => age >= 18;
console.log("16 is adult:", isAdult(16));
console.log("21 is adult:", isAdult(21));

// 3. Default parameter
const formatName = (name = "Student") => \`Hello, \${name}!\`;
console.log(formatName());
console.log(formatName("Kalisa"));

// 4. map with arrow function
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled);
`,
      hint: 'Arrow functions: const fn = (param) => expression. For .map(): numbers.map(n => n * 2) creates a new array with each element doubled.',
    },
  },

  // ── 2.5 Objects ───────────────────────────────────────────────────────────────
  {
    title: 'JavaScript Objects',
    order_index: 13,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `An **object** is a collection of key-value pairs that represent a real-world entity.

**Creating Objects:**
\`\`\`javascript
// Object literal
let student = {
  name: "Amina",
  age: 20,
  school: "EduCode",
  isPassed: true
};
\`\`\`

**Accessing Properties:**
\`\`\`javascript
// Dot notation
console.log(student.name);    // "Amina"

// Bracket notation (useful for dynamic keys)
console.log(student["age"]);  // 20
\`\`\`

**Modifying Objects:**
\`\`\`javascript
student.age = 21;           // update
student.grade = "Merit";    // add new property
delete student.isPassed;    // remove property
\`\`\`

**Object Methods** (functions inside objects):
\`\`\`javascript
let student = {
  name: "Kalisa",
  score: 88,
  getGrade() {
    if (this.score >= 80) return "Distinction";
    if (this.score >= 60) return "Merit";
    return "Pass";
  },
  introduce() {
    return \`Hi, I'm \${this.name} and I got \${this.getGrade()}\`;
  }
};

console.log(student.getGrade());   // "Distinction"
console.log(student.introduce());  // "Hi, I'm Kalisa and I got Distinction"
\`\`\`

**\`this\`** refers to the current object.

**Looping over object properties:**
\`\`\`javascript
for (let key in student) {
  console.log(key + ":", student[key]);
}
\`\`\`

**Object destructuring:**
\`\`\`javascript
const { name, score } = student;
console.log(name, score); // "Kalisa" 88
\`\`\``,
  },
  {
    title: 'Creating and Using Objects',
    order_index: 14,
    lesson_type: 'coding',
    xp_reward: 15,
    content: 'Create objects to represent real-world data.',
    exercise_data: {
      instructions: `Create and use a student object:
1. Create an object \`student\` with: name, age, school, subjects (array of 3), averageScore
2. Print the student's name and school
3. Add a new property \`country\` = "Rwanda"
4. Update the averageScore to 89
5. Loop over all properties and print "key: value" for each
6. Use destructuring to extract name and averageScore, then print them

Use these values: name="Hirwa", age=19, school="EduCode Rwanda", subjects=["Math","English","Science"], averageScore=85`,
      starter_code: `// 1. Create student object
let student = {
  name: "Hirwa",
  age: 19,
  school: "EduCode Rwanda",
  subjects: ["Math", "English", "Science"],
  averageScore: 85
};

// 2. Print name and school
console.log(student.name);
console.log(student.school);

// 3. Add country property
// your code here

// 4. Update averageScore
// your code here

// 5. Loop over all properties
for (let key in student) {
  console.log(key + ":", student[key]);
}

// 6. Destructuring
const { name, averageScore } = student;
console.log("Name:", name, "| Score:", averageScore);
`,
      hint: 'Add property: student.country = "Rwanda". Update: student.averageScore = 89. Destructuring: const { name, averageScore } = student;',
    },
  },
  {
    title: 'Object Methods and this',
    order_index: 15,
    lesson_type: 'coding',
    xp_reward: 20,
    content: 'Add methods to objects and use the "this" keyword.',
    exercise_data: {
      instructions: `Build a bank account object with methods:
Create an object \`account\` with:
- \`owner\` = "Uwase"
- \`balance\` = 5000 (RWF)
- Method \`deposit(amount)\` — adds to balance, prints "Deposited [amount]. Balance: [new balance]"
- Method \`withdraw(amount)\` — subtracts from balance (if enough funds), prints result or "Insufficient funds"
- Method \`getStatement()\` — prints "Account owner: [owner] | Balance: [balance] RWF"

Test: deposit 2000, withdraw 1000, withdraw 10000, getStatement

Expected output:
Deposited 2000. Balance: 7000
Withdrew 1000. Balance: 6000
Insufficient funds
Account owner: Uwase | Balance: 6000 RWF`,
      starter_code: `let account = {
  owner: "Uwase",
  balance: 5000,

  deposit(amount) {
    this.balance += amount;
    console.log(\`Deposited \${amount}. Balance: \${this.balance}\`);
  },

  withdraw(amount) {
    if (amount > this.balance) {
      console.log("Insufficient funds");
    } else {
      // subtract and print
    }
  },

  getStatement() {
    // print the statement
  }
};

account.deposit(2000);
account.withdraw(1000);
account.withdraw(10000);
account.getStatement();
`,
      hint: 'Use this.balance to access balance inside methods. this.balance -= amount to subtract. Template literals make string building easy.',
    },
  },

  // ── 2.6 Arrays ────────────────────────────────────────────────────────────────
  {
    title: 'JavaScript Arrays',
    order_index: 16,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `An **array** is an ordered list of values stored under a single variable name.

**Creating Arrays:**
\`\`\`javascript
let scores = [85, 92, 78, 90, 88];
let names = ["Alice", "Bob", "Chloe"];
let mixed = [1, "hello", true, null];
\`\`\`

**Accessing Elements (0-indexed):**
\`\`\`javascript
console.log(scores[0]);  // 85 — first
console.log(scores[scores.length - 1]);  // 88 — last
\`\`\`

**Common Array Methods:**
\`\`\`javascript
let arr = [1, 2, 3];

arr.push(4);         // add to end → [1, 2, 3, 4]
arr.pop();           // remove last → [1, 2, 3]
arr.unshift(0);      // add to start → [0, 1, 2, 3]
arr.shift();         // remove first → [1, 2, 3]
arr.indexOf(2);      // 1 — position of 2
arr.includes(2);     // true
arr.slice(0, 2);     // [1, 2] — copy portion (non-destructive)
arr.splice(1, 1);    // removes 1 element at index 1
arr.reverse();       // reverses in place
arr.join(", ");      // "1, 2, 3" — joins to string
arr.sort();          // sorts alphabetically/numerically
\`\`\`

**Array Iteration Methods:**
\`\`\`javascript
let numbers = [1, 2, 3, 4, 5];

// forEach — run function on each element
numbers.forEach(n => console.log(n));

// map — transform each element, returns new array
let doubled = numbers.map(n => n * 2); // [2, 4, 6, 8, 10]

// filter — keep elements where condition is true
let evens = numbers.filter(n => n % 2 === 0); // [2, 4]

// reduce — accumulate to single value
let sum = numbers.reduce((total, n) => total + n, 0); // 15

// find — first element matching condition
let firstOver3 = numbers.find(n => n > 3); // 4
\`\`\``,
  },
  {
    title: 'Array Methods Practice',
    order_index: 17,
    lesson_type: 'coding',
    xp_reward: 15,
    content: 'Practice adding, removing, and searching elements in arrays.',
    exercise_data: {
      instructions: `Work with a list of student names:
1. Start with: \`let students = ["Amina", "Kalisa", "Uwase"]\`
2. Add "Hirwa" to the end
3. Add "Mugisha" to the beginning
4. Remove the last student and print who was removed
5. Check if "Kalisa" is in the array
6. Find the index of "Uwase"
7. Print the final array joined by " | "

Expected output:
Removed: Hirwa
Kalisa exists: true
Uwase is at index: 2
Students: Mugisha | Amina | Kalisa | Uwase`,
      starter_code: `let students = ["Amina", "Kalisa", "Uwase"];

// 2. Add to end
students.push("Hirwa");

// 3. Add to beginning
students.unshift("Mugisha");

// 4. Remove last
let removed = students.pop();
console.log("Removed:", removed);

// 5. Check if Kalisa exists
console.log("Kalisa exists:", students.includes("Kalisa"));

// 6. Find index of Uwase
// your code here

// 7. Join and print
console.log("Students:", students.join(" | "));
`,
      hint: 'indexOf returns the position (starting at 0). Use students.indexOf("Uwase") and console.log("Uwase is at index:", ...).',
    },
  },
  {
    title: 'Array Iteration Methods',
    order_index: 18,
    lesson_type: 'coding',
    xp_reward: 20,
    content: 'Use map, filter, and reduce to process arrays.',
    exercise_data: {
      instructions: `Given scores = [45, 88, 72, 91, 58, 65, 83]:
1. Use **filter** to get only passing scores (>= 60) and print them
2. Use **map** to add 5 bonus points to every score and print the new array
3. Use **reduce** to calculate the total of all scores and print it
4. Use **find** to get the first score above 85
5. Calculate and print the class average

Expected output:
Passing scores: [88, 72, 91, 65, 83]
With bonus: [50, 93, 77, 96, 63, 70, 88]
Total: 502
First above 85: 88
Average: 71.71`,
      starter_code: `let scores = [45, 88, 72, 91, 58, 65, 83];

// 1. Filter passing scores
let passing = scores.filter(score => score >= 60);
console.log("Passing scores:", passing);

// 2. Map — add 5 bonus points
let withBonus = scores.map(score => score + 5);
console.log("With bonus:", withBonus);

// 3. Reduce — total
let total = scores.reduce((sum, score) => sum + score, 0);
console.log("Total:", total);

// 4. Find first above 85
let firstAbove85 = scores.find(score => score > 85);
console.log("First above 85:", firstAbove85);

// 5. Average
let average = total / scores.length;
console.log("Average:", average.toFixed(2));
`,
      hint: 'filter, map, find, and reduce all take arrow functions. reduce takes (accumulator, current) => accumulator + current with a starting value of 0.',
    },
  },

  // ── 2.7 JavaScript in HTML (DOM) ─────────────────────────────────────────────
  {
    title: 'JavaScript and the DOM',
    order_index: 19,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `The **DOM (Document Object Model)** is a tree representation of an HTML page that JavaScript can read and modify.

**Selecting Elements:**
\`\`\`javascript
// By ID (returns one element)
let title = document.getElementById("title");

// By class (returns HTMLCollection)
let items = document.getElementsByClassName("item");

// CSS selector — most flexible
let btn = document.querySelector("#myButton");
let allBtns = document.querySelectorAll(".btn");
\`\`\`

**Changing Content:**
\`\`\`javascript
let el = document.getElementById("demo");
el.innerHTML = "<strong>Bold text</strong>"; // parses HTML
el.textContent = "Plain text only";           // no HTML parsing
\`\`\`

**Changing Styles:**
\`\`\`javascript
let box = document.getElementById("box");
box.style.color = "#00d4aa";
box.style.backgroundColor = "#1a1e2a";
box.style.fontSize = "20px";
\`\`\`

**Changing Attributes:**
\`\`\`javascript
let img = document.querySelector("img");
img.setAttribute("src", "new-image.jpg");
img.getAttribute("src");
\`\`\`

**Creating and Adding Elements:**
\`\`\`javascript
let newPara = document.createElement("p");
newPara.textContent = "I was created by JavaScript!";
document.body.appendChild(newPara);
\`\`\`

**Events:**
\`\`\`javascript
let btn = document.getElementById("myBtn");
btn.addEventListener("click", function() {
  alert("Button clicked!");
});
\`\`\`

**Common Events:** click, mouseover, mouseout, keyup, keydown, submit, change`,
  },
  {
    title: 'DOM Manipulation',
    order_index: 20,
    lesson_type: 'coding',
    xp_reward: 20,
    content: 'Use JavaScript to change HTML content and styles dynamically.',
    exercise_data: {
      instructions: `Build an interactive page in the HTML tab:
1. Create an HTML page with:
   - An \`<h1 id="title">\`Welcome\`</h1>\`
   - A \`<p id="info">\`Click the button to see info\`</p>\`
   - A \`<button id="btn">\`Show Info\`</button>\`
   - A \`<div id="result">\`\`</div>\`

2. In a \`<script>\` tag, make the button:
   - Change the title text to "EduCode Rwanda"
   - Change the title color to #00d4aa
   - Set the result div to show your name, today's date, and a greeting
   - Change the button text to "Info Shown!"

Write your code in the HTML tab.`,
      starter_code: ``,
      hint: 'Use document.getElementById("btn").addEventListener("click", function() { ... }). Inside the function, select each element and change .textContent and .style.color.',
    },
  },
  {
    title: 'Event Handling',
    order_index: 21,
    lesson_type: 'coding',
    xp_reward: 25,
    content: 'Handle user events like clicks, keyboard input, and form submissions.',
    exercise_data: {
      instructions: `Build a simple interactive counter in the HTML tab:
1. HTML structure:
   - A \`<h2>\`Counter: \`<span id="count">\`0\`</span>\`\`</h2>\`
   - A button \`id="increment"\` labelled "+"
   - A button \`id="decrement"\` labelled "-"
   - A button \`id="reset"\` labelled "Reset"

2. JavaScript behavior:
   - "+" button: increases count by 1
   - "-" button: decreases count (minimum 0)
   - "Reset" button: resets to 0
   - When count > 5: span color turns #00d4aa (teal)
   - When count = 0: span color turns white

Write your HTML and JavaScript in the HTML tab.`,
      starter_code: ``,
      hint: 'Store the count in a variable. Each button click updates the variable and then sets document.getElementById("count").textContent = count. Use an if/else to change the color based on count value.',
    },
  },

  // ── 2.8 Regular Expressions ───────────────────────────────────────────────────
  {
    title: 'Regular Expressions in JavaScript',
    order_index: 22,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `A **Regular Expression (RegExp)** is a pattern used to match, search, or replace text.

**Creating a RegExp:**
\`\`\`javascript
// Literal notation
let pattern = /hello/;

// Constructor
let pattern2 = new RegExp("hello");
\`\`\`

**Flags:**
- \`i\` — case insensitive
- \`g\` — global (find all matches)
- \`m\` — multiline

\`\`\`javascript
let re = /hello/i;  // matches "Hello", "HELLO", "hello"
\`\`\`

**Testing a Pattern:**
\`\`\`javascript
let pattern = /Rwanda/i;
console.log(pattern.test("I love Rwanda")); // true
console.log(pattern.test("I love Kenya"));  // false
\`\`\`

**Common Methods:**
\`\`\`javascript
let text = "My phone is 078-123-4567";

// test — returns true/false
/\\d{3}/.test(text);  // true

// match — returns array of matches
text.match(/\\d+/g);  // ["078", "123", "4567"]

// replace — substitutes matches
text.replace(/078/, "073"); // "My phone is 073-123-4567"

// split with regex
"one1two2three".split(/\\d/); // ["one", "two", "three"]
\`\`\`

**Common Patterns:**
\`\`\`javascript
/\\d/          // any digit (0-9)
/\\w/          // any word character (a-z, A-Z, 0-9, _)
/\\s/          // any whitespace
/^abc/        // starts with "abc"
/abc$/        // ends with "abc"
/[aeiou]/     // any vowel
/[0-9]{4}/    // exactly 4 digits
/.+/          // one or more of any character
\`\`\`

**Validation Example:**
\`\`\`javascript
function isValidEmail(email) {
  return /^[\\w.-]+@[\\w.-]+\\.[a-z]{2,}$/i.test(email);
}
console.log(isValidEmail("user@example.com")); // true
console.log(isValidEmail("notanemail"));        // false
\`\`\``,
  },
  {
    title: 'Using Regular Expressions',
    order_index: 23,
    lesson_type: 'coding',
    xp_reward: 20,
    content: 'Apply regular expressions to validate and process text.',
    exercise_data: {
      instructions: `Practice regular expressions:
1. Test if "JavaScript is awesome" contains "awesome" (case insensitive) — print result
2. Extract all numbers from "I have 3 cats, 2 dogs, and 10 fish" — print the array
3. Validate a phone number format: must be 10 digits. Test: "0781234567" (valid) and "078abc" (invalid)
4. Replace all vowels in "Hello Rwanda" with "*" and print the result
5. Check if "user@gmail.com" is a valid email format

Expected output:
Contains awesome: true
Numbers found: ["3", "2", "10"]
0781234567 valid: true
078abc valid: false
H*ll* Rw*nd*
Email valid: true`,
      starter_code: `// 1. Test for "awesome"
let text1 = "JavaScript is awesome";
console.log("Contains awesome:", /awesome/i.test(text1));

// 2. Extract all numbers
let text2 = "I have 3 cats, 2 dogs, and 10 fish";
let numbers = text2.match(/\\d+/g);
console.log("Numbers found:", numbers);

// 3. Validate phone (10 digits)
function isValidPhone(phone) {
  return /^\\d{10}$/.test(phone);
}
console.log("0781234567 valid:", isValidPhone("0781234567"));
console.log("078abc valid:", isValidPhone("078abc"));

// 4. Replace vowels with *
let text3 = "Hello Rwanda";
let result = text3.replace(/[aeiou]/gi, "*");
console.log(result);

// 5. Validate email
function isValidEmail(email) {
  return /^[\\w.-]+@[\\w.-]+\\.[a-z]{2,}$/i.test(email);
}
console.log("Email valid:", isValidEmail("user@gmail.com"));
`,
      hint: '/^\\d{10}$/ means: start, exactly 10 digits, end. The g flag in match() finds ALL occurrences. /[aeiou]/gi matches all vowels case-insensitively.',
    },
  },

  // ── 2.9 Error Handling ────────────────────────────────────────────────────────
  {
    title: 'Error Handling in JavaScript',
    order_index: 24,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `**Error handling** prevents programs from crashing when something goes wrong.

**Types of Errors:**
- **SyntaxError** — code is incorrectly written
- **ReferenceError** — using an undefined variable
- **TypeError** — wrong type used
- **RangeError** — value out of allowed range

**try / catch / finally:**
\`\`\`javascript
try {
  // code that might throw an error
  let result = riskyOperation();
  console.log(result);
} catch (error) {
  // runs only if an error occurred
  console.log("Error:", error.message);
} finally {
  // always runs regardless
  console.log("Done.");
}
\`\`\`

**Example:**
\`\`\`javascript
function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero!");
  }
  return a / b;
}

try {
  console.log(divide(10, 2));  // 5
  console.log(divide(10, 0));  // throws error
} catch (e) {
  console.log("Caught:", e.message); // "Caught: Cannot divide by zero!"
} finally {
  console.log("Division attempted.");
}
\`\`\`

**Throwing custom errors:**
\`\`\`javascript
function validateAge(age) {
  if (typeof age !== "number") {
    throw new TypeError("Age must be a number");
  }
  if (age < 0 || age > 120) {
    throw new RangeError("Age must be between 0 and 120");
  }
  return true;
}
\`\`\`

**Error object properties:**
- \`error.name\` — type of error
- \`error.message\` — description
- \`error.stack\` — where the error occurred

**Best Practices:**
- Only use try/catch where errors are expected
- Always provide meaningful error messages
- Use \`finally\` for cleanup (closing connections, etc.)`,
  },
  {
    title: 'try/catch/finally in Practice',
    order_index: 25,
    lesson_type: 'coding',
    xp_reward: 20,
    content: 'Handle errors gracefully using try/catch/finally.',
    exercise_data: {
      instructions: `Practice error handling:
1. Write a \`safeDivide(a, b)\` function that throws an Error if b is 0.
   Use try/catch to call it with (10, 2) and (10, 0). Print results or errors.

2. Write a \`validateScore(score)\` function that throws:
   - TypeError if score is not a number
   - RangeError if score is not between 0 and 100
   Test with: 85 (valid), "hello" (TypeError), 150 (RangeError)

3. Add a finally block to #1 that always prints "Calculation complete."

Expected output:
10 / 2 = 5
Error: Cannot divide by zero!
Calculation complete.
Score 85 is valid
Error (TypeError): Score must be a number
Error (RangeError): Score must be between 0 and 100`,
      starter_code: `// 1. Safe division
function safeDivide(a, b) {
  if (b === 0) throw new Error("Cannot divide by zero!");
  return a / b;
}

try {
  console.log("10 / 2 =", safeDivide(10, 2));
  console.log("10 / 0 =", safeDivide(10, 0));
} catch (e) {
  console.log("Error:", e.message);
} finally {
  console.log("Calculation complete.");
}

// 2. Score validation
function validateScore(score) {
  if (typeof score !== "number") {
    throw new TypeError("Score must be a number");
  }
  if (score < 0 || score > 100) {
    throw new RangeError("Score must be between 0 and 100");
  }
  return true;
}

function testScore(score) {
  try {
    validateScore(score);
    console.log("Score", score, "is valid");
  } catch (e) {
    console.log(\`Error (\${e.name}): \${e.message}\`);
  }
}

testScore(85);
testScore("hello");
testScore(150);
`,
      hint: 'throw new Error("message") creates and throws an error. In the catch block, e.name gives the error type and e.message gives the description.',
    },
  },

  // ── Module 2 Quiz ──────────────────────────────────────────────────────────────
  {
    title: 'Module 2 Assessment',
    order_index: 26,
    lesson_type: 'quiz',
    xp_reward: 30,
    content: 'Test your understanding of data manipulation with JavaScript.',
    exercise_data: {
      questions: [
        {
          id: 'q1',
          text: 'Which string method removes whitespace from both ends?',
          options: ['strip()', 'trim()', 'clean()', 'remove()'],
          correct: 1,
        },
        {
          id: 'q2',
          text: 'What does the following print?\n\nlet arr = [1, 2, 3];\nconsole.log(arr.map(x => x * 2));',
          options: ['[1, 2, 3]', '[2, 4, 6]', '6', '[3, 4, 5]'],
          correct: 1,
        },
        {
          id: 'q3',
          text: 'Which loop always executes at least once?',
          options: ['for', 'while', 'do...while', 'for...of'],
          correct: 2,
        },
        {
          id: 'q4',
          text: 'What is the correct arrow function syntax for squaring a number?',
          options: [
            'function n => n * n',
            'const square = n => n * n',
            'const square = (n) { return n * n }',
            'arrow n => n * n',
          ],
          correct: 1,
        },
        {
          id: 'q5',
          text: 'Inside an object method, what does "this" refer to?',
          options: [
            'The global window object',
            'The function itself',
            'The object the method belongs to',
            'The parent function',
          ],
          correct: 2,
        },
        {
          id: 'q6',
          text: 'Which array method returns a NEW array of elements where the condition is true?',
          options: ['map()', 'filter()', 'find()', 'forEach()'],
          correct: 1,
        },
        {
          id: 'q7',
          text: 'What does the "break" statement do inside a loop?',
          options: [
            'Skips the current iteration',
            'Restarts the loop from the beginning',
            'Exits the loop entirely',
            'Pauses execution for 1 second',
          ],
          correct: 2,
        },
        {
          id: 'q8',
          text: 'What will this print?\n\nlet x = 5;\nlet result = x > 3 ? "big" : "small";\nconsole.log(result);',
          options: ['small', 'big', 'true', 'undefined'],
          correct: 1,
        },
        {
          id: 'q9',
          text: 'Which block in try/catch always executes regardless of errors?',
          options: ['try', 'catch', 'finally', 'else'],
          correct: 2,
        },
        {
          id: 'q10',
          text: 'What does /^\\d{10}$/.test("0781234567") return?',
          options: ['false', 'null', 'true', '"0781234567"'],
          correct: 2,
        },
      ],
    },
  },
];

// ─── Module 3 Lessons ─────────────────────────────────────────────────────────

const module3Lessons = [
  {
    title: 'Planning a JavaScript Project',
    order_index: 1,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `Before writing code, a good developer **plans** their project. This saves time and prevents confusion later.

**Steps to Plan a Project:**

**1. Define the Goal**
What should the project do? Who uses it?
Example: "A calculator that performs basic math operations for students."

**2. List the Features**
Break the goal into small features:
- Input two numbers
- Choose an operation (+, -, *, /)
- Display the result
- Handle division by zero

**3. Design the Structure**
Decide on your files and components:
\`\`\`
project/
  index.html    — page structure
  style.css     — visual design
  app.js        — JavaScript logic
\`\`\`

**4. Plan the Data**
What variables and functions do you need?
\`\`\`javascript
// Variables
let num1, num2, operator, result;

// Functions
function calculate(a, b, op) { ... }
function displayResult(result) { ... }
function clearInput() { ... }
\`\`\`

**5. Build Incrementally**
Start with the simplest version that works, then add features.

**6. Test as You Go**
Test each feature before moving to the next. Use \`console.log()\` to debug.

**Good Project Habits:**
- Use meaningful variable and function names
- Write comments explaining complex logic
- Keep functions small and focused (one task each)
- Use \`const\` for values that never change
- Handle edge cases (empty input, invalid data, division by zero)`,
  },
  {
    title: 'Build a Simple Calculator',
    order_index: 2,
    lesson_type: 'coding',
    xp_reward: 25,
    content: 'Apply variables, functions, and conditionals to build a working calculator.',
    exercise_data: {
      instructions: `Build a calculator using JavaScript functions:

Write a \`calculate(a, b, operator)\` function that:
- Takes two numbers and a string operator (+, -, *, /)
- Returns the correct result
- Throws an error for division by zero
- Returns "Invalid operator" for unknown operators

Test with:
- calculate(10, 5, "+") → 15
- calculate(10, 5, "-") → 5
- calculate(10, 5, "*") → 50
- calculate(10, 5, "/") → 2
- calculate(10, 0, "/") → Error
- calculate(10, 5, "^") → "Invalid operator"`,
      starter_code: `function calculate(a, b, operator) {
  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      // your code
    case "/":
      if (b === 0) throw new Error("Cannot divide by zero");
      // your code
    default:
      return "Invalid operator";
  }
}

// Test all operations
const tests = [
  [10, 5, "+"],
  [10, 5, "-"],
  [10, 5, "*"],
  [10, 5, "/"],
  [10, 0, "/"],
  [10, 5, "^"],
];

for (let [a, b, op] of tests) {
  try {
    console.log(\`\${a} \${op} \${b} = \${calculate(a, b, op)}\`);
  } catch (e) {
    console.log(\`\${a} \${op} \${b} = Error: \${e.message}\`);
  }
}
`,
      hint: 'Complete the * and / cases. For division: check if b === 0 first. The for...of loop with destructuring [a, b, op] unpacks each test array.',
    },
  },
  {
    title: 'Build a To-Do List',
    order_index: 3,
    lesson_type: 'coding',
    xp_reward: 30,
    content: 'Combine arrays, objects, and functions to build a to-do list manager.',
    exercise_data: {
      instructions: `Build a to-do list manager using arrays and objects:

Create a \`TodoList\` object with:
- \`tasks\` — empty array to store tasks
- \`addTask(title)\` — adds { id, title, done: false }
- \`completeTask(id)\` — marks task as done
- \`removeTask(id)\` — removes task by id
- \`listTasks()\` — prints all tasks as: "[✓] title" or "[ ] title"
- \`getPending()\` — returns array of incomplete tasks

Test it:
1. Add: "Learn JavaScript", "Build a project", "Study HTML"
2. Complete task with id 1
3. Remove task with id 2
4. List all tasks
5. Print count of pending tasks`,
      starter_code: `let TodoList = {
  tasks: [],
  nextId: 1,

  addTask(title) {
    this.tasks.push({ id: this.nextId++, title, done: false });
  },

  completeTask(id) {
    let task = this.tasks.find(t => t.id === id);
    if (task) task.done = true;
  },

  removeTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
  },

  listTasks() {
    this.tasks.forEach(t => {
      let status = t.done ? "[✓]" : "[ ]";
      console.log(\`\${status} \${t.title}\`);
    });
  },

  getPending() {
    return this.tasks.filter(t => !t.done);
  }
};

// Test it
TodoList.addTask("Learn JavaScript");
TodoList.addTask("Build a project");
TodoList.addTask("Study HTML");
TodoList.completeTask(1);
TodoList.removeTask(2);
TodoList.listTasks();
console.log("Pending:", TodoList.getPending().length);
`,
      hint: 'The starter code is mostly complete — run it and observe. Try adding your own tasks and completing them. The key patterns: find() to locate, filter() to remove, forEach() to list.',
    },
  },

  // ── 3.2 HTML Pages ────────────────────────────────────────────────────────────
  {
    title: 'Building HTML Pages with JavaScript',
    order_index: 4,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `A complete web project combines **HTML** (structure), **CSS** (style), and **JavaScript** (behavior).

**HTML Page Structure:**
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Page</title>
  <style>
    /* CSS goes here */
  </style>
</head>
<body>
  <!-- HTML content here -->

  <script>
    // JavaScript goes here (end of body)
  </script>
</body>
</html>
\`\`\`

**Connecting JavaScript to HTML Elements:**
\`\`\`html
<!-- HTML -->
<input id="nameInput" type="text" placeholder="Enter name">
<button onclick="greet()">Say Hello</button>
<p id="output"></p>

<script>
function greet() {
  let name = document.getElementById("nameInput").value;
  document.getElementById("output").textContent = "Hello, " + name + "!";
}
</script>
\`\`\`

**Reading Input Values:**
\`\`\`javascript
// Text input
let name = document.getElementById("nameInput").value;

// Number input
let age = parseInt(document.getElementById("ageInput").value);

// Checkbox
let isChecked = document.getElementById("agree").checked;
\`\`\`

**Dynamic Lists:**
\`\`\`javascript
let ul = document.getElementById("myList");

function addItem(text) {
  let li = document.createElement("li");
  li.textContent = text;
  ul.appendChild(li);
}
\`\`\`

**Best Practices:**
- Keep HTML, CSS, and JS in separate files for large projects
- Use \`id\` for unique elements, \`class\` for groups
- Validate user input before using it
- Place \`<script>\` tags at the end of \`<body>\``,
  },
  {
    title: 'Create a Student Profile Page',
    order_index: 5,
    lesson_type: 'coding',
    xp_reward: 25,
    content: 'Build a complete HTML page with dynamic JavaScript content.',
    exercise_data: {
      instructions: `Build a Student Profile Page in the HTML tab:

**Requirements:**
1. A heading: "Student Profile"
2. Input fields for: Name, Age, School
3. A "Generate Profile" button
4. A profile card (div) that shows after clicking:
   - Student's name as a heading
   - Age and School as paragraphs
   - A calculated "study years" (20 - age)
   - Background color: #13161e, text color: #f1f5f9, border: 1px solid #00d4aa

**Behavior:**
- Profile card is hidden initially (display: none)
- Clicking button reads input values and fills the card
- Shows the card (display: block)
- If name is empty, alert "Please enter a name"

Write your full HTML, CSS, and JavaScript in the HTML tab.`,
      starter_code: ``,
      hint: 'Use document.getElementById("nameInput").value to read input. Set element.style.display = "block" to show the card. Use parseInt() for the age to do arithmetic.',
    },
  },

  // ── 3.3 CSS ───────────────────────────────────────────────────────────────────
  {
    title: 'Styling Web Pages with CSS',
    order_index: 6,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `**CSS (Cascading Style Sheets)** controls the visual appearance of HTML elements.

**Three ways to add CSS:**
\`\`\`html
<!-- 1. Inline -->
<p style="color: red;">Red text</p>

<!-- 2. Internal (in <head>) -->
<style>
  p { color: blue; }
</style>

<!-- 3. External file (best practice) -->
<link rel="stylesheet" href="style.css">
\`\`\`

**CSS Selectors:**
\`\`\`css
p           { ... }   /* element */
#title      { ... }   /* ID */
.card       { ... }   /* class */
div p       { ... }   /* descendant */
button:hover{ ... }   /* pseudo-class */
\`\`\`

**Common Properties:**
\`\`\`css
.card {
  /* Colors */
  color: #f1f5f9;
  background-color: #13161e;

  /* Typography */
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: bold;

  /* Spacing */
  padding: 20px;
  margin: 10px;

  /* Border */
  border: 1px solid #00d4aa;
  border-radius: 8px;

  /* Size */
  width: 300px;
  max-width: 100%;

  /* Display */
  display: flex;
  gap: 10px;
}
\`\`\`

**JavaScript + CSS:**
\`\`\`javascript
let el = document.getElementById("card");

// Inline styles
el.style.backgroundColor = "#00d4aa";

// Toggle a class
el.classList.add("active");
el.classList.remove("active");
el.classList.toggle("active");

// Check if class exists
el.classList.contains("active"); // true/false
\`\`\`

**Responsive Design:**
\`\`\`css
@media (max-width: 600px) {
  .card {
    width: 100%;
    padding: 10px;
  }
}
\`\`\``,
  },
  {
    title: 'Style Your Web Page',
    order_index: 7,
    lesson_type: 'coding',
    xp_reward: 25,
    content: 'Use CSS and JavaScript together to create a styled, interactive page.',
    exercise_data: {
      instructions: `Create a styled card component in the HTML tab:

**Build a "Course Card" that:**
1. Shows: Course name, description, difficulty badge, and an "Enroll" button
2. Has dark background (#13161e), teal border (#00d4aa), rounded corners
3. Difficulty badge: green for "Beginner", orange for "Intermediate"

**JavaScript behavior:**
- Clicking "Enroll" changes button text to "Enrolled ✓" and button color to teal (#00d4aa)
- Button becomes disabled after clicking
- A message appears below: "You are enrolled in [course name]!"

**Use the EduCode color scheme:**
- Background: #0d0f14 (page), #13161e (card)
- Primary: #00d4aa (teal)
- Text: #f1f5f9 (headings), #94a3b8 (body)

Write full HTML, CSS, and JavaScript in the HTML tab.`,
      starter_code: ``,
      hint: 'Use classList.add() to add a CSS class for the enrolled state. button.disabled = true prevents further clicks. Style your badge with display: inline-block, padding, and border-radius.',
    },
  },

  // ── 3.4 Final Project ─────────────────────────────────────────────────────────
  {
    title: 'Applying JavaScript Concepts in a Project',
    order_index: 8,
    lesson_type: 'reading',
    xp_reward: 5,
    content: `You have now learned the core building blocks of JavaScript. This final section brings everything together into a real project.

**What you have learned:**
- Variables, data types, and operators
- Conditional statements and switch
- Loops (for, while, for...of)
- Functions and arrow functions
- Objects and arrays
- DOM manipulation and events
- Regular expressions
- Error handling

**Building a Complete Application — Checklist:**

✓ **HTML** — structure (inputs, buttons, containers for output)
✓ **CSS** — styling (colors, layout, responsive design)
✓ **JavaScript** — behavior (events, logic, DOM updates)

**Application Architecture Pattern:**
\`\`\`javascript
// 1. Get references to DOM elements
const input = document.getElementById("input");
const btn = document.getElementById("btn");
const output = document.getElementById("output");

// 2. Store application state
let appData = [];

// 3. Write functions for each feature
function processInput() { ... }
function updateUI() { ... }
function validateData(data) { ... }

// 4. Wire up events
btn.addEventListener("click", processInput);

// 5. Initialize
updateUI();
\`\`\`

**Tips for the Final Project:**
- Plan before coding — list features, sketch layout
- Build and test one feature at a time
- Use meaningful names: \`studentName\` not \`s\`
- Handle edge cases: empty input, wrong types
- Use the browser console to debug

You are ready to build something real!`,
  },
  {
    title: 'Final Project: Interactive Quiz App',
    order_index: 9,
    lesson_type: 'coding',
    xp_reward: 40,
    content: 'Build a complete interactive quiz application combining all JavaScript concepts.',
    exercise_data: {
      instructions: `Build a complete **Quiz App** in the HTML tab that:

**Features:**
1. Shows one question at a time from an array of questions
2. Each question has 4 multiple choice options (radio buttons or clickable cards)
3. User selects an answer and clicks "Next"
4. Tracks correct/incorrect answers
5. At the end shows: "You scored X/Y — Z%"
6. A "Restart" button resets the quiz

**Questions to include (at least 3):**
- Q1: What keyword declares a constant? Options: var, let, const, static → correct: const
- Q2: What does typeof "hello" return? Options: "text", "string", "word", "char" → correct: "string"
- Q3: Which method adds to the end of an array? Options: push(), pop(), shift(), add() → correct: push()

**Styling:** Use the EduCode dark theme (#0d0f14 background, #13161e cards, #00d4aa teal accents).

Write full HTML, CSS, and JavaScript in the HTML tab.`,
      starter_code: ``,
      hint: `Here's a structure to get started:
- Store questions in an array of objects: { question, options, correct }
- Track currentIndex and score variables
- showQuestion(index) function renders the current question
- nextQuestion() checks the answer and advances
- showResult() displays the final score
- Use document.createElement() to build option buttons dynamically`,
    },
  },

  // ── Module 3 Quiz ──────────────────────────────────────────────────────────────
  {
    title: 'Module 3 Assessment',
    order_index: 10,
    lesson_type: 'quiz',
    xp_reward: 30,
    content: 'Final assessment covering JavaScript projects, HTML, and CSS integration.',
    exercise_data: {
      questions: [
        {
          id: 'q1',
          text: 'What is the best practice for placing <script> tags in an HTML page?',
          options: [
            'Inside the <head> tag',
            'At the very top of the file',
            'At the end of the <body> tag',
            'Before the <!DOCTYPE html>',
          ],
          correct: 2,
        },
        {
          id: 'q2',
          text: 'Which method reads the value from an HTML input field?',
          options: [
            'document.getElementById("id").text',
            'document.getElementById("id").value',
            'document.getElementById("id").content',
            'document.getElementById("id").data',
          ],
          correct: 1,
        },
        {
          id: 'q3',
          text: 'What does element.classList.toggle("active") do?',
          options: [
            'Always adds the "active" class',
            'Always removes the "active" class',
            'Adds it if absent, removes it if present',
            'Checks if "active" class exists',
          ],
          correct: 2,
        },
        {
          id: 'q4',
          text: 'How do you prevent a button from being clicked again after it is used?',
          options: [
            'button.remove()',
            'button.hide()',
            'button.disabled = true',
            'button.active = false',
          ],
          correct: 2,
        },
        {
          id: 'q5',
          text: 'In the MVC pattern, what does the "Model" represent?',
          options: ['The HTML structure', 'The CSS styling', 'The data and business logic', 'The user events'],
          correct: 2,
        },
        {
          id: 'q6',
          text: 'Which CSS property controls spacing INSIDE an element (between content and border)?',
          options: ['margin', 'spacing', 'padding', 'gap'],
          correct: 2,
        },
        {
          id: 'q7',
          text: 'What does document.createElement("p") do?',
          options: [
            'Selects all <p> elements',
            'Deletes a <p> element',
            'Creates a new <p> element in memory',
            'Adds a <p> to the page immediately',
          ],
          correct: 2,
        },
        {
          id: 'q8',
          text: 'Which event fires when a user types in an input field?',
          options: ['change', 'input', 'keypress', 'Both input and keypress'],
          correct: 3,
        },
        {
          id: 'q9',
          text: 'What is the correct way to apply a CSS class "highlight" using JavaScript?',
          options: [
            'element.class = "highlight"',
            'element.addStyle("highlight")',
            'element.classList.add("highlight")',
            'element.setClass("highlight")',
          ],
          correct: 2,
        },
        {
          id: 'q10',
          text: 'Which of the following is NOT a good software development practice?',
          options: [
            'Writing comments to explain complex logic',
            'Using meaningful variable names',
            'Testing each feature as you build it',
            'Writing all code in one large function',
          ],
          correct: 3,
        },
      ],
    },
  },
];

// ─── Main Seed Function ───────────────────────────────────────────────────────

async function seed() {
  console.log('🌱 Seeding JavaScript Fundamentals course...\n');

  // 1. Use existing course (inserted directly in DB) or insert via service role
  let course: { id: string } | null = null;

  const { data: existing } = await supabase
    .from('courses')
    .select('id')
    .eq('title', 'JavaScript Fundamentals')
    .single();

  if (existing) {
    course = existing;
    console.log('✅ Using existing course:', course.id);
  } else {
    const { data: inserted, error: courseError } = await supabase
      .from('courses')
      .insert({
        title: 'JavaScript Fundamentals',
        title_kin: null,
        description: 'Master JavaScript from the basics to building real projects. Learn variables, data types, functions, arrays, objects, DOM manipulation, and more. Based on the Rwanda TVET Board curriculum (SWDJF301).',
        description_kin: null,
        difficulty: 'beginner',
        topic: 'JavaScript',
        estimated_hours: 90,
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

  // 2. Insert modules
  const moduleDefs = [
    { title: 'Apply JavaScript Basic Concepts', order_index: 1, lessons: module1Lessons },
    { title: 'Manipulate Data with JavaScript', order_index: 2, lessons: module2Lessons },
    { title: 'Apply JavaScript in Project', order_index: 3, lessons: module3Lessons },
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

    // 3. Insert lessons for this module
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
  const courseId = 'aaaaaaaa-0000-0000-0000-000000000001';
  const modIds = [randomUUID(), randomUUID(), randomUUID()];

  const q = (s: string | null): string => {
    if (s === null) return 'NULL';
    return "'" + s.replace(/'/g, "''") + "'";
  };

  const moduleDefs = [
    { title: 'Apply JavaScript Basic Concepts', order_index: 1, lessons: module1Lessons },
    { title: 'Manipulate Data with JavaScript', order_index: 2, lessons: module2Lessons },
    { title: 'Apply JavaScript in Project', order_index: 3, lessons: module3Lessons },
  ];

  const lines: string[] = [
    '-- JavaScript Fundamentals Course Seed',
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
        `(${q(modIds[mi])}, ${q(lesson.title)}, NULL, ${q(lesson.content ?? null)}, NULL, ` +
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
