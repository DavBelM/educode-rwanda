-- =============================================
-- EduCode Rwanda — Challenge Mode Seed Data
-- Run AFTER schema-quizzes.sql
-- 5 sets × 6 challenges = 30 total
-- =============================================

-- ─── QUIZ SETS ────────────────────────────────────────────────────────────────

INSERT INTO public.quiz_sets (id, title, title_kin, description, description_kin, order_index, xp_reward) VALUES
(
  'qs000001-0000-0000-0000-000000000001',
  'Variables & Data Types',
  'Impinduramimerere n''Ubwoko bw''Amakuru',
  'Learn to declare variables, work with strings, numbers, and booleans.',
  'Iga gushyiraho impinduramimerere no gukora na strings, numbers, na booleans.',
  1, 60
),
(
  'qs000002-0000-0000-0000-000000000002',
  'Functions & Conditionals',
  'Imikorere n''Imiterere',
  'Write reusable functions and control code flow with if/else.',
  'Andika imikorere ishobora gukoreshwa inshuro nyinshi kandi ugenzure uruhererekane rwa code.',
  2, 70
),
(
  'qs000003-0000-0000-0000-000000000003',
  'Arrays & Loops',
  'Urutonde rw''Amakuru n''Inzira zo Gusubiramo',
  'Store collections of data and process them with for loops and array methods.',
  'Bika imbumba z''amakuru kandi uzipangenye ukoresheje inzira zo gusubiramo na methods.',
  3, 80
),
(
  'qs000004-0000-0000-0000-000000000004',
  'Objects & Modern JS',
  'Ibintu n''JavaScript ya Kijyambere',
  'Master JavaScript objects, destructuring, arrow functions, and ES6+ features.',
  'Menya neza ibintu bya JavaScript, destructuring, arrow functions, na ES6.',
  4, 90
),
(
  'qs000005-0000-0000-0000-000000000005',
  'DOM Manipulation',
  'Kugenzura DOM',
  'Control webpage elements with JavaScript — change text, styles, and handle events.',
  'Genzura ibice by''urupapuro ukoresheje JavaScript — hindura inyandiko, imiterere, no gukemura ibikorwa.',
  5, 100
)
ON CONFLICT (id) DO UPDATE
  SET title = EXCLUDED.title,
      description = EXCLUDED.description,
      order_index = EXCLUDED.order_index;

-- ─── SET 1: Variables & Data Types ───────────────────────────────────────────

INSERT INTO public.quiz_challenges
  (set_id, title, title_kin, description, description_kin, challenge_type, difficulty, starter_js, starter_html, test_cases, xp_reward, order_index, hint, hint_kin)
VALUES
(
  'qs000001-0000-0000-0000-000000000001',
  'Declare Your First Variables',
  'Tangira Impinduramimerere Zawe za Mbere',
  'Declare a variable called **score** using `const` and give it the value `85`. Then declare a variable called **subject** using `let` and give it the value `''JavaScript''`. Use `console.log` to print both.',
  'Shyiraho impinduramimerere yitwa **score** ukoresheje `const` uyihe agaciro ka `85`. Neza impinduramimerere yitwa **subject** ukoresheje `let` uyihe `''JavaScript''`. Koresha `console.log` kugaragaza zombi.',
  'write_scratch',
  'beginner',
  '',
  '',
  $json$[
    {"assertion": "score === 85", "description": "score should equal 85"},
    {"assertion": "subject === 'JavaScript'", "description": "subject should equal 'JavaScript'"},
    {"assertion": "__output.includes('85')", "description": "Should log score with console.log"},
    {"assertion": "__output.includes('JavaScript')", "description": "Should log subject with console.log"}
  ]$json$::jsonb,
  10, 1,
  'Use `const score = 85;` for a value that will not change. Use `let subject = ''JavaScript'';` for one that might. Then call `console.log(score, subject);` to print them.',
  'Koresha `const score = 85;` kugira ngo unyuze agaciro gatahinduwe. Koresha `let subject = ''JavaScript'';`. Hanyuma hamagara `console.log(score, subject);`.'
),
(
  'qs000001-0000-0000-0000-000000000001',
  'Fix the Constant Variable',
  'Gusana Impinduramimerere ya Constant',
  'This code crashes because it tries to reassign a `const` variable. Fix it so the program successfully logs `''Hello''`.',
  'Iyi code ihaguruka kuko yagerageza kongera guha agaciro k''impinduramimerere ya `const`. Sana kugira ngo porogaramu igaragaze `''Hello''` neza.',
  'fix_bug',
  'beginner',
  'const greeting = "Muraho";
greeting = "Hello";
console.log(greeting);',
  '',
  $json$[
    {"assertion": "__output.includes('Hello')", "description": "Should log 'Hello'"},
    {"assertion": "!__output.includes('Muraho')", "description": "Should print the new value, not the old one"}
  ]$json$::jsonb,
  10, 2,
  'You cannot reassign a `const` variable after it is set. Change `const` to `let` so the variable can be updated to a new value.',
  'Ntushobora kongera guha agaciro impinduramimerere ya `const`. Hindura `const` ukore `let` kugira ngo ushobore kuhindura agaciro.'
),
(
  'qs000001-0000-0000-0000-000000000001',
  'Combine First and Last Name',
  'Guhuza Izina n''Inkomoko',
  'Complete the code to create **fullName** by combining `firstName` and `lastName` with a space between them.',
  'Uzuza kode kugira ngo uhunge **fullName** uhuza `firstName` na `lastName` ufite umwanya hagati yazo.',
  'complete_code',
  'beginner',
  'const firstName = "Jean";
const lastName = "Mugisha";
const fullName = ____; // combine them here
console.log(fullName);',
  '',
  $json$[
    {"assertion": "fullName === 'Jean Mugisha'", "description": "fullName should be 'Jean Mugisha'"},
    {"assertion": "__output.includes('Jean Mugisha')", "description": "Should log the full name"}
  ]$json$::jsonb,
  10, 3,
  'Use the `+` operator to join strings together: `firstName + '' '' + lastName` adds a space between them.',
  'Koresha operator `+` guhuza strings: `firstName + '' '' + lastName` yongeraho umwanya hagati.'
),
(
  'qs000001-0000-0000-0000-000000000001',
  'Build a Temperature Converter',
  'Kubaka Ihindura ry''Ubushyuhe',
  'Write a function called `celsiusToFahrenheit(c)` that converts Celsius to Fahrenheit. The formula is: **F = (C × 9/5) + 32**. Then call it and log `celsiusToFahrenheit(0)` — the result should be `32`.',
  'Andika imikorere yitwa `celsiusToFahrenheit(c)` ihindura Celsius ikagera Fahrenheit. Ifishi ni: **F = (C × 9/5) + 32**. Hanyuma uyihamagare kandi ugaragaze `celsiusToFahrenheit(0)` — igisubizo ni `32`.',
  'write_scratch',
  'beginner',
  '',
  '',
  $json$[
    {"assertion": "typeof celsiusToFahrenheit === 'function'", "description": "celsiusToFahrenheit should be a function"},
    {"assertion": "celsiusToFahrenheit(0) === 32", "description": "0°C should equal 32°F"},
    {"assertion": "celsiusToFahrenheit(100) === 212", "description": "100°C should equal 212°F"},
    {"assertion": "celsiusToFahrenheit(-40) === -40", "description": "-40°C should equal -40°F"}
  ]$json$::jsonb,
  15, 4,
  'Write: `function celsiusToFahrenheit(c) { return (c * 9/5) + 32; }` — the formula multiplies by 9/5 first, then adds 32.',
  'Andika: `function celsiusToFahrenheit(c) { return (c * 9/5) + 32; }` — ifishi ikuza kwa 9/5 mbere, hanyuma yongeraho 32.'
),
(
  'qs000001-0000-0000-0000-000000000001',
  'Fix the Total Calculation',
  'Gusana Ibarwa y''Igiteganyo',
  'The total is showing `''955''` instead of `100`. Find the bug and fix it so the program logs `Total: 100`.',
  'Igiteganyo cyerekana `''955''` aho kwerekana `100`. Shakisha ikosa kandi usane kugira ngo porogaramu igaragaze `Total: 100`.',
  'fix_bug',
  'beginner',
  'const price = "95";
const tax = 5;
const total = price + tax;
console.log("Total: " + total);',
  '',
  $json$[
    {"assertion": "__output.includes('100')", "description": "Total should print 100"},
    {"assertion": "!__output.includes('955')", "description": "Should not print 955"}
  ]$json$::jsonb,
  10, 5,
  'The `+` operator with a string causes concatenation, not addition. Convert `price` to a number first using `Number(price)` or `parseInt(price)`.',
  'Operator `+` hamwe na string itera guhuza inyandiko, si guteranya. Hindura `price` kugira ngo ibe inomero mbere ukoresheje `Number(price)` cyangwa `parseInt(price)`.'
),
(
  'qs000001-0000-0000-0000-000000000001',
  'Identify Data Types',
  'Gutahura Ubwoko bw''Amakuru',
  'Complete the `console.log` calls to print the type of each variable using `typeof`. The first one is done for you.',
  'Uzuza inyito za `console.log` kugira ngo ugaragaze ubwoko bw''impinduramimerere nziza ukoresheje `typeof`. Iya mbere yakoze kuri we.',
  'complete_code',
  'beginner',
  'const isLoggedIn = true;
const age = 16;
const schoolName = "IPRC Kigali";

console.log(typeof isLoggedIn); // "boolean"
console.log(typeof ____);       // should print "number"
console.log(typeof ____);       // should print "string"',
  '',
  $json$[
    {"assertion": "__output.includes('boolean')", "description": "Should print 'boolean' for isLoggedIn"},
    {"assertion": "__output.includes('number')", "description": "Should print 'number' for age"},
    {"assertion": "__output.includes('string')", "description": "Should print 'string' for schoolName"}
  ]$json$::jsonb,
  10, 6,
  'Use the variable name inside typeof: `typeof age` returns `''number''`, and `typeof schoolName` returns `''string''`.',
  'Koresha izina ry''impinduramimerere imbere ya typeof: `typeof age` isubiza `''number''`, na `typeof schoolName` isubiza `''string''`.'
);

-- ─── SET 2: Functions & Conditionals ─────────────────────────────────────────

INSERT INTO public.quiz_challenges
  (set_id, title, title_kin, description, description_kin, challenge_type, difficulty, starter_js, starter_html, test_cases, xp_reward, order_index, hint, hint_kin)
VALUES
(
  'qs000002-0000-0000-0000-000000000002',
  'Write a Greeting Function',
  'Andika Imikorere y''Ubutumwa',
  'Write a function called `greet` that takes one parameter `name` and returns the string `''Hello, '' + name + ''!''`. Then call it and log the result.',
  'Andika imikorere yitwa `greet` ifata parameter imwe `name` kandi isubiza string `''Hello, '' + name + ''!''`. Hanyuma uyihamagare kandi ugaragaze igisubizo.',
  'write_scratch',
  'beginner',
  '',
  '',
  $json$[
    {"assertion": "typeof greet === 'function'", "description": "greet should be a function"},
    {"assertion": "greet('Aline') === 'Hello, Aline!'", "description": "greet('Aline') should return 'Hello, Aline!'"},
    {"assertion": "greet('Jean') === 'Hello, Jean!'", "description": "greet('Jean') should return 'Hello, Jean!'"},
    {"assertion": "greet('EduCode') === 'Hello, EduCode!'", "description": "greet('EduCode') should return 'Hello, EduCode!'"}
  ]$json$::jsonb,
  10, 1,
  'Write: `function greet(name) { return ''Hello, '' + name + ''!''; }` — a function takes input through parameters and gives back a value using `return`.',
  'Andika: `function greet(name) { return ''Hello, '' + name + ''!''; }` — imikorere ifata amakuru binyuze muri parameters kandi isubiza agaciro ukoresheje `return`.'
),
(
  'qs000002-0000-0000-0000-000000000002',
  'Fix the Missing Return',
  'Gusana Return Iyibuze',
  'This function should return the square of a number, but it always returns `undefined`. Add the missing statement to make it work.',
  'Iyi mikorere igomba gusubiza inomero nkana inomero, ariko isubiza `undefined` buri gihe. Ongeraho inyito yibuze kugira ngo ikore neza.',
  'fix_bug',
  'beginner',
  'function square(number) {
  const result = number * number;
  // something is missing here
}
console.log(square(5));  // should print 25
console.log(square(3));  // should print 9',
  '',
  $json$[
    {"assertion": "square(5) === 25", "description": "square(5) should return 25"},
    {"assertion": "square(3) === 9", "description": "square(3) should return 9"},
    {"assertion": "square(0) === 0", "description": "square(0) should return 0"}
  ]$json$::jsonb,
  10, 2,
  'A function needs a `return` statement to give back a value. Without it, the function returns `undefined`. Add `return result;` before the closing `}`.',
  'Imikorere ikeneye inyito ya `return` gusubiza agaciro. Nta yo hari, imikorere isubiza `undefined`. Ongeraho `return result;` mbere y''`}`.'
),
(
  'qs000002-0000-0000-0000-000000000002',
  'Complete the Age Checker',
  'Uzuza Isuzuma ry''Imyaka',
  'Complete the condition inside the `if` statement. If `age` is 18 or more, the function should return `''Adult''`. Otherwise it should return `''Minor''`.',
  'Uzuza condition iri imbere ya `if`. Niba `age` ari 18 cyangwa hejuru, imikorere igomba gusubiza `''Adult''`. Niba atari utyo, igomba gusubiza `''Minor''`.',
  'complete_code',
  'beginner',
  'function checkAge(age) {
  if (____) {
    return ''Adult'';
  } else {
    return ''Minor'';
  }
}
console.log(checkAge(20)); // Adult
console.log(checkAge(15)); // Minor',
  '',
  $json$[
    {"assertion": "checkAge(18) === 'Adult'", "description": "18 should return 'Adult'"},
    {"assertion": "checkAge(17) === 'Minor'", "description": "17 should return 'Minor'"},
    {"assertion": "checkAge(25) === 'Adult'", "description": "25 should return 'Adult'"},
    {"assertion": "checkAge(0) === 'Minor'", "description": "0 should return 'Minor'"}
  ]$json$::jsonb,
  10, 3,
  'Use `>=` to check if age is greater than or equal to 18: fill in `age >= 18` as the condition.',
  'Koresha `>=` kugenzura niba imyaka igeze kuri 18 cyangwa irarenga: uzuza `age >= 18` nka condition.'
),
(
  'qs000002-0000-0000-0000-000000000002',
  'Build a Grade Calculator',
  'Kubaka Ibarwa y''Amanota',
  'Write a function `getGrade(score)` that returns a letter grade: `''A''` for 90 and above, `''B''` for 80–89, `''C''` for 70–79, `''D''` for 60–69, and `''F''` for anything below 60.',
  'Andika imikorere `getGrade(score)` isubiza inyuguti y''amanota: `''A''` ku 90 no hejuru, `''B''` kuri 80–89, `''C''` kuri 70–79, `''D''` kuri 60–69, na `''F''` ku nka zose munsi ya 60.',
  'write_scratch',
  'beginner',
  '',
  '',
  $json$[
    {"assertion": "typeof getGrade === 'function'", "description": "getGrade should be a function"},
    {"assertion": "getGrade(95) === 'A'", "description": "95 should return 'A'"},
    {"assertion": "getGrade(85) === 'B'", "description": "85 should return 'B'"},
    {"assertion": "getGrade(75) === 'C'", "description": "75 should return 'C'"},
    {"assertion": "getGrade(65) === 'D'", "description": "65 should return 'D'"},
    {"assertion": "getGrade(50) === 'F'", "description": "50 should return 'F'"}
  ]$json$::jsonb,
  15, 4,
  'Use `if / else if / else`, starting from the highest score: `if (score >= 90) return ''A''; else if (score >= 80) return ''B'';` and so on down to F.',
  'Koresha `if / else if / else`, utangirira ku manota menshi: `if (score >= 90) return ''A''; else if (score >= 80) return ''B'';` ukageza kuri F.'
),
(
  'qs000002-0000-0000-0000-000000000002',
  'Fix the Comparison Operator',
  'Gusana Operator yo Gusuzuma',
  'This function checks if a number is even, but crashes with an error. Find the bug in the `if` condition and fix it.',
  'Iyi mikorere isuzuma niba inomero ari inomero y''incana, ariko ihaguruka iri ikosa. Shakisha ikosa muri condition ya `if` kandi usane.',
  'fix_bug',
  'beginner',
  'function isEven(number) {
  if (number % 2 = 0) { // spot the bug
    return true;
  }
  return false;
}
console.log(isEven(4));  // true
console.log(isEven(7));  // false',
  '',
  $json$[
    {"assertion": "isEven(4) === true", "description": "isEven(4) should return true"},
    {"assertion": "isEven(7) === false", "description": "isEven(7) should return false"},
    {"assertion": "isEven(0) === true", "description": "isEven(0) should return true"},
    {"assertion": "isEven(3) === false", "description": "isEven(3) should return false"}
  ]$json$::jsonb,
  10, 5,
  'A single `=` assigns a value — it is not a comparison. To compare, use `===`: change `number % 2 = 0` to `number % 2 === 0`.',
  'Umwe `=` ahanahana agaciro — si ugusuzuma. Kugira ngo usuzume, koresha `===`: hindura `number % 2 = 0` ukore `number % 2 === 0`.'
),
(
  'qs000002-0000-0000-0000-000000000002',
  'Use the Ternary Operator',
  'Koresha Operator ya Ternary',
  'Complete the function using a ternary operator. Return `20` if `isMember` is `true`, or `0` if it is `false`. The format is: `condition ? valueIfTrue : valueIfFalse`.',
  'Uzuza imikorere ukoresheje operator ya ternary. Subiza `20` niba `isMember` ari `true`, cyangwa `0` niba ari `false`. Imiterere ni: `condition ? agaciro niba ari ukuri : agaciro niba ari ikinyoma`.',
  'complete_code',
  'beginner',
  'function getDiscount(isMember) {
  return ____; // condition ? valueIfTrue : valueIfFalse
}
console.log(getDiscount(true));  // 20
console.log(getDiscount(false)); // 0',
  '',
  $json$[
    {"assertion": "getDiscount(true) === 20", "description": "Members should get a 20% discount"},
    {"assertion": "getDiscount(false) === 0", "description": "Non-members should get 0% discount"}
  ]$json$::jsonb,
  10, 6,
  'Ternary syntax: `condition ? valueIfTrue : valueIfFalse`. Fill in: `isMember ? 20 : 0`.',
  'Imiterere ya ternary: `condition ? agaciro niba ari ukuri : agaciro niba ari ikinyoma`. Uzuza: `isMember ? 20 : 0`.'
);

-- ─── SET 3: Arrays & Loops ────────────────────────────────────────────────────

INSERT INTO public.quiz_challenges
  (set_id, title, title_kin, description, description_kin, challenge_type, difficulty, starter_js, starter_html, test_cases, xp_reward, order_index, hint, hint_kin)
VALUES
(
  'qs000003-0000-0000-0000-000000000003',
  'Build Your First Array',
  'Kubaka Urutonde Rwawe rwa Mbere',
  'Create an array called `fruits` with at least 3 fruit names. Then add `''mango''` to the end using `.push()`. Finally, log `fruits.length` to show how many fruits are in the array.',
  'Shiraho urutonde yitwa `fruits` ufite nibura amazina ya mbuto 3. Hanyuma ongeraho `''mango''` ku iherezo ukoresheje `.push()`. Mu iherezo, garagaza `fruits.length` kwerekana umubare w''imbuto.',
  'write_scratch',
  'beginner',
  '',
  '',
  $json$[
    {"assertion": "Array.isArray(fruits)", "description": "fruits should be an array"},
    {"assertion": "fruits.includes('mango')", "description": "fruits should include 'mango'"},
    {"assertion": "fruits.length >= 4", "description": "fruits should have at least 4 items after push"},
    {"assertion": "__output.length > 0", "description": "Should log something with console.log"}
  ]$json$::jsonb,
  10, 1,
  'Create the array: `const fruits = [''banana'', ''orange'', ''apple''];`, then add: `fruits.push(''mango'');`, then log: `console.log(fruits.length);`.',
  'Shiraho urutonde: `const fruits = [''banana'', ''orange'', ''apple''];`, hanyuma ongeraho: `fruits.push(''mango'');`, hanyuma ugaragaze: `console.log(fruits.length);`.'
),
(
  'qs000003-0000-0000-0000-000000000003',
  'Fix the Array Index',
  'Gusana Indangagaciro y''Urutonde',
  'This code tries to print the last student in the list, but it prints `undefined`. Arrays start at index 0 — find the correct index and fix it.',
  'Iyi kode igerageza gukora umunyeshuri w''inzira bwa nyuma, ariko igaragaza `undefined`. Urutonde rutangira ku ndangagaciro 0 — shakisha indangagaciro nziza kandi usane.',
  'fix_bug',
  'beginner',
  'const students = [''Aline'', ''Jean'', ''Marie'', ''Patrick''];
console.log(students[4]); // Bug: prints undefined — fix this',
  '',
  $json$[
    {"assertion": "__output.includes('Patrick')", "description": "Should print 'Patrick'"},
    {"assertion": "!__output.includes('undefined')", "description": "Should not print undefined"}
  ]$json$::jsonb,
  10, 2,
  'Array indexes start at 0. A 4-item array has indexes 0, 1, 2, 3. The last index is 3, not 4. Use `students[3]` or `students[students.length - 1]`.',
  'Indangagaciro z''urutonde zitangira kuri 0. Urutonde rufite ibintu 4 rufite indangagaciro 0, 1, 2, 3. Indangagaciro ya nyuma ni 3, si 4. Koresha `students[3]` cyangwa `students[students.length - 1]`.'
),
(
  'qs000003-0000-0000-0000-000000000003',
  'Add Up Numbers with a Loop',
  'Guteranya Inomero ukoresheje Inzira yo Gusubiramo',
  'Complete the `for` loop to add all the numbers in the array together. The result should be `150`.',
  'Uzuza inzira ya `for` yo gusubiramo kugira ngo uteranya inomero zose mu rutonde hamwe. Igisubizo kigomba kuba `150`.',
  'complete_code',
  'beginner',
  'const numbers = [10, 20, 30, 40, 50];
let sum = 0;

for (let i = 0; i < ____; i++) {
  sum += numbers[____];
}

console.log(sum); // 150',
  '',
  $json$[
    {"assertion": "__output.includes('150')", "description": "Sum should equal 150"},
    {"assertion": "sum === 150", "description": "Variable sum should be 150"}
  ]$json$::jsonb,
  10, 3,
  'Use `numbers.length` as the loop limit and `numbers[i]` to access each element: `for (let i = 0; i < numbers.length; i++) { sum += numbers[i]; }`.',
  'Koresha `numbers.length` nka nomero ya nyuma y''inzira kandi `numbers[i]` kugera kuri buri kintu: `for (let i = 0; i < numbers.length; i++) { sum += numbers[i]; }`.'
),
(
  'qs000003-0000-0000-0000-000000000003',
  'Double Every Number',
  'Guteranya Inomero Zose Inshuro Ebyiri',
  'Write a function `doubleAll(arr)` that takes an array of numbers and returns a **new** array with each number multiplied by 2. Use the `.map()` method.',
  'Andika imikorere `doubleAll(arr)` ifata urutonde rw''inomero kandi isubiza urutonde **rushya** ufite buri nomero ikuzwe inshuro ebyiri. Koresha method ya `.map()`.',
  'write_scratch',
  'beginner',
  '',
  '',
  $json$[
    {"assertion": "typeof doubleAll === 'function'", "description": "doubleAll should be a function"},
    {"assertion": "JSON.stringify(doubleAll([1, 2, 3])) === JSON.stringify([2, 4, 6])", "description": "doubleAll([1,2,3]) should return [2,4,6]"},
    {"assertion": "JSON.stringify(doubleAll([5, 10])) === JSON.stringify([10, 20])", "description": "doubleAll([5,10]) should return [10,20]"},
    {"assertion": "JSON.stringify(doubleAll([0])) === JSON.stringify([0])", "description": "doubleAll([0]) should return [0]"}
  ]$json$::jsonb,
  15, 4,
  'Write: `function doubleAll(arr) { return arr.map(num => num * 2); }` — `.map()` creates a new array by transforming each element.',
  'Andika: `function doubleAll(arr) { return arr.map(num => num * 2); }` — `.map()` ishyiraho urutonde rushya iguindura buri kintu.'
),
(
  'qs000003-0000-0000-0000-000000000003',
  'Use the Right Array Method',
  'Koresha Method Nziza y''Urutonde',
  'This code should return **all** scores above 80, but it only returns the first one it finds. Fix it by using the correct array method.',
  'Iyi kode igomba gusubiza amanota **yose** hejuru ya 80, ariko isubiza iya mbere gusa isanga. Sana ukoresheje method nziza y''urutonde.',
  'fix_bug',
  'beginner',
  'const scores = [75, 90, 65, 88, 92, 55];
const highScores = scores.find(score => score > 80);
console.log(highScores);',
  '',
  $json$[
    {"assertion": "Array.isArray(highScores)", "description": "highScores should be an array"},
    {"assertion": "highScores.length === 3", "description": "Should find 3 scores above 80"},
    {"assertion": "highScores.includes(90) && highScores.includes(88) && highScores.includes(92)", "description": "Should include 90, 88, and 92"}
  ]$json$::jsonb,
  10, 5,
  '`.find()` returns only the **first** matching element. Use `.filter()` instead to return **all** elements that match the condition.',
  '`.find()` isubiza gusa igice **cya mbere** gikurikirana. Koresha `.filter()` aho gusubiza **ibice byose** bikurikirana condition.'
),
(
  'qs000003-0000-0000-0000-000000000003',
  'Capitalize Every Name',
  'Gushyira Inyuguti Nkuru kuri Buri Zina',
  'Use `.map()` to create a new array where each name starts with a capital letter. The first letter of each name should be uppercase, the rest lowercase.',
  'Koresha `.map()` gushyiraho urutonde rushya aho buri zina ritangira inyuguti nkuru. Inyuguti ya mbere ya buri zina igomba kuba nkuru, izisigaye zibe ntoyi.',
  'complete_code',
  'beginner',
  'const names = [''aline'', ''jean'', ''marie'', ''patrick''];

const capitalized = names.map(name => ____);

console.log(capitalized); // [''Aline'', ''Jean'', ''Marie'', ''Patrick'']',
  '',
  $json$[
    {"assertion": "capitalized[0] === 'Aline'", "description": "First name should be 'Aline'"},
    {"assertion": "capitalized[1] === 'Jean'", "description": "Second name should be 'Jean'"},
    {"assertion": "capitalized[2] === 'Marie'", "description": "Third name should be 'Marie'"},
    {"assertion": "capitalized[3] === 'Patrick'", "description": "Fourth name should be 'Patrick'"}
  ]$json$::jsonb,
  10, 6,
  '`name[0].toUpperCase()` gets the first letter as uppercase. `name.slice(1)` gets all letters after the first. Combine them: `name[0].toUpperCase() + name.slice(1)`.',
  '`name[0].toUpperCase()` ifata inyuguti ya mbere ikayigira nkuru. `name.slice(1)` ifata inyuguti zose nyuma ya mbere. Zihuze: `name[0].toUpperCase() + name.slice(1)`.'
);

-- ─── SET 4: Objects & Modern JS ──────────────────────────────────────────────

INSERT INTO public.quiz_challenges
  (set_id, title, title_kin, description, description_kin, challenge_type, difficulty, starter_js, starter_html, test_cases, xp_reward, order_index, hint, hint_kin)
VALUES
(
  'qs000004-0000-0000-0000-000000000004',
  'Create a Student Object',
  'Gushyiraho Ikintu cy''Umunyeshuri',
  'Create an object called `student` with three properties: `name` (a string), `age` (a number), and `grade` (a string like `''S4''`). Then log the student''s name.',
  'Shiraho ikintu yitwa `student` gifite ibintu bitatu: `name` (string), `age` (inomero), na `grade` (string nka `''S4''`). Hanyuma ugaragaze izina ry''umunyeshuri.',
  'write_scratch',
  'beginner',
  '',
  '',
  $json$[
    {"assertion": "typeof student === 'object' && student !== null", "description": "student should be an object"},
    {"assertion": "typeof student.name === 'string' && student.name.length > 0", "description": "student.name should be a non-empty string"},
    {"assertion": "typeof student.age === 'number'", "description": "student.age should be a number"},
    {"assertion": "typeof student.grade === 'string'", "description": "student.grade should be a string"},
    {"assertion": "__output.includes(student.name)", "description": "Should log the student's name"}
  ]$json$::jsonb,
  10, 1,
  'Create: `const student = { name: ''Aline'', age: 17, grade: ''S4'' };` then access a property with a dot: `console.log(student.name);`.',
  'Shiraho: `const student = { name: ''Aline'', age: 17, grade: ''S4'' };` hanyuma ugere kuri property ukoresheje idomu: `console.log(student.name);`.'
),
(
  'qs000004-0000-0000-0000-000000000004',
  'Fix the Property Name',
  'Gusana Izina rya Property',
  'This code should print the car''s brand but it prints `undefined`. JavaScript property names are **case-sensitive** — find and fix the bug.',
  'Iyi kode igomba gukora brand y''imodoka ariko igaragaza `undefined`. Amazina ya property muri JavaScript **agenzura imikorere y''inyuguti nkuru na ntoyi** — shakisha kandi usane ikosa.',
  'fix_bug',
  'beginner',
  'const car = {
  brand: ''Toyota'',
  model: ''Corolla'',
  year: 2020
};
console.log(car.Brand); // Bug: wrong property name',
  '',
  $json$[
    {"assertion": "__output.includes('Toyota')", "description": "Should print 'Toyota'"},
    {"assertion": "!__output.includes('undefined')", "description": "Should not print undefined"}
  ]$json$::jsonb,
  10, 2,
  'JavaScript is case-sensitive: `car.Brand` is not the same as `car.brand`. Use the exact name as written in the object: `car.brand`.',
  'JavaScript ikengurira imikorere y''inyuguti: `car.Brand` si nka `car.brand`. Koresha izina ryo nk''uko ryandikwa mu kintu: `car.brand`.'
),
(
  'qs000004-0000-0000-0000-000000000004',
  'Filter Even Numbers with an Arrow Function',
  'Gutoranya Inomero z''Incana ukoresheje Arrow Function',
  'Use `.filter()` with an arrow function to create a new array containing **only the even numbers**.',
  'Koresha `.filter()` hamwe na arrow function gushyiraho urutonde rushya rufite **inomero z''incana gusa**.',
  'complete_code',
  'intermediate',
  'const numbers = [1, 2, 3, 4, 5, 6, 7, 8];

const evens = numbers.filter(____);

console.log(evens); // [2, 4, 6, 8]',
  '',
  $json$[
    {"assertion": "JSON.stringify(evens) === JSON.stringify([2,4,6,8])", "description": "Should return [2,4,6,8]"},
    {"assertion": "evens.length === 4", "description": "Should have exactly 4 even numbers"}
  ]$json$::jsonb,
  10, 3,
  'Arrow function syntax: `num => num % 2 === 0`. This returns `true` for even numbers (where dividing by 2 has no remainder).',
  'Imiterere ya arrow function: `num => num % 2 === 0`. Isubiza `true` ku zinomero z''incana (aho igabanywa na 2 nta sura isigara).'
),
(
  'qs000004-0000-0000-0000-000000000004',
  'Introduce Yourself with Template Literals',
  'Iyerekane ukoresheje Template Literals',
  'Write a function `introduce(name, age, school)` that returns the string:\n`''My name is [name], I am [age] years old and I study at [school].''`\nUse **template literals** (backticks) with `${expression}` syntax.',
  'Andika imikorere `introduce(name, age, school)` isubiza string:\n`''My name is [name], I am [age] years old and I study at [school].''`\nKoresha **template literals** (backticks) hamwe na `${expression}`.',
  'write_scratch',
  'intermediate',
  '',
  '',
  $json$[
    {"assertion": "typeof introduce === 'function'", "description": "introduce should be a function"},
    {"assertion": "introduce('Aline', 17, 'IPRC Kigali') === 'My name is Aline, I am 17 years old and I study at IPRC Kigali.'", "description": "Should return the correct introduction string"},
    {"assertion": "introduce('Jean', 20, 'ADEPR') === 'My name is Jean, I am 20 years old and I study at ADEPR.'", "description": "Should work with different values"}
  ]$json$::jsonb,
  15, 4,
  'Use backticks and `${}`: `function introduce(name, age, school) { return `My name is ${name}, I am ${age} years old and I study at ${school}.`; }`.',
  'Koresha backticks na `${}`: `function introduce(name, age, school) { return `My name is ${name}, I am ${age} years old and I study at ${school}.`; }`.'
),
(
  'qs000004-0000-0000-0000-000000000004',
  'Fix the Object Destructuring',
  'Gusana Guturuhu gw''Ibintu',
  'The code tries to extract `name` and `age` from the object, but it uses the **wrong syntax**. Fix the destructuring so both variables are printed correctly.',
  'Kode igerageza gukura `name` na `age` mu kintu, ariko ikoresha **imiterere itari nziza**. Sana guturuhu kugira ngo impinduramimerere zombi zigaragazwe neza.',
  'fix_bug',
  'intermediate',
  'const person = { name: ''Jean'', age: 20, city: ''Kigali'' };

const [name, age] = person; // Bug: wrong destructuring syntax for objects

console.log(name); // Jean
console.log(age);  // 20',
  '',
  $json$[
    {"assertion": "name === 'Jean'", "description": "name should equal 'Jean'"},
    {"assertion": "age === 20", "description": "age should equal 20"}
  ]$json$::jsonb,
  10, 5,
  'Square brackets `[]` are for **array** destructuring. For **objects**, use curly braces: `const { name, age } = person;`.',
  'Ibintu bifunganye `[]` ni byerekeza **guturuhu k''urutonde**. Ku **binyabuzima**, koresha ibinyabuzima bifunganye: `const { name, age } = person;`.'
),
(
  'qs000004-0000-0000-0000-000000000004',
  'Combine Arrays with the Spread Operator',
  'Guhuza Inzitari ukoresheje Spread Operator',
  'Use the **spread operator** (`...`) to combine `group1` and `group2` into a single `allStudents` array.',
  'Koresha **spread operator** (`...`) guhuza `group1` na `group2` mu rutonde rumwe `allStudents`.',
  'complete_code',
  'intermediate',
  'const group1 = [''Aline'', ''Jean'', ''Marie''];
const group2 = [''Patrick'', ''Alice'', ''Eric''];

const allStudents = [____]; // use spread here

console.log(allStudents.length); // 6',
  '',
  $json$[
    {"assertion": "allStudents.length === 6", "description": "Combined array should have 6 students"},
    {"assertion": "allStudents.includes('Aline')", "description": "Should include students from group1"},
    {"assertion": "allStudents.includes('Patrick')", "description": "Should include students from group2"},
    {"assertion": "__output.includes('6')", "description": "Should log 6"}
  ]$json$::jsonb,
  10, 6,
  'Spread each array with `...`: `[...group1, ...group2]`. The `...` operator expands all elements of an array into the new array.',
  'Ambika buri rutonde na `...`: `[...group1, ...group2]`. Operator `...` icagura ibintu byose by''urutonde mu rutonde rushya.'
);

-- ─── SET 5: DOM Manipulation ─────────────────────────────────────────────────

INSERT INTO public.quiz_challenges
  (set_id, title, title_kin, description, description_kin, challenge_type, difficulty, starter_js, starter_html, test_cases, xp_reward, order_index, hint, hint_kin)
VALUES
(
  'qs000005-0000-0000-0000-000000000005',
  'Change the Page Title',
  'Guhindura Umutwe w''Urupapuro',
  'Use JavaScript to find the element with id `''title''` and change its text content to `''Welcome to EduCode!''`.',
  'Koresha JavaScript gushaka igice gifite id `''title''` kandi uhindure ibiri muri yo kugira ngo bigire `''Welcome to EduCode!''`.',
  'write_scratch',
  'beginner',
  '',
  '<h1 id="title">Hello World</h1>',
  $json$[
    {"assertion": "document.getElementById('title') !== null", "description": "Element with id 'title' should exist"},
    {"assertion": "document.getElementById('title').textContent === 'Welcome to EduCode!'", "description": "Title text should be 'Welcome to EduCode!'"}
  ]$json$::jsonb,
  10, 1,
  'Use `document.getElementById(''title'')` to find the element, then set `.textContent`: `document.getElementById(''title'').textContent = ''Welcome to EduCode!'';`.',
  'Koresha `document.getElementById(''title'')` gushaka igice, hanyuma ushyireho `.textContent`: `document.getElementById(''title'').textContent = ''Welcome to EduCode!'';`.'
),
(
  'qs000005-0000-0000-0000-000000000005',
  'Fix the Wrong Selector',
  'Gusana Selector Itari Nziza',
  'The code tries to change the paragraph text but it crashes. The problem is the wrong selector method is being used. Fix it.',
  'Kode igerageza guhindura inyandiko y''paragarafu ariko ihaguruka. Ikibazo ni uko method itari nziza ya selector ikoreshwa. Sana.',
  'fix_bug',
  'beginner',
  'const msg = document.getElementById(''message''); // Bug: wrong method for a class
msg.textContent = ''Text changed!'';',
  '<p class="message">Original text</p>',
  $json$[
    {"assertion": "document.querySelector('.message').textContent === 'Text changed!'", "description": "Paragraph text should be 'Text changed!'"}
  ]$json$::jsonb,
  10, 2,
  '`getElementById` looks for an `id` attribute. The element has a `class`, not an `id`. Use `querySelector(''.message'')` — note the dot for class names.',
  '`getElementById` ishaka attribute ya `id`. Igice gifite `class`, si `id`. Koresha `querySelector(''.message'')` — werekeza indome ku mazina ya class.'
),
(
  'qs000005-0000-0000-0000-000000000005',
  'Create and Append a List Item',
  'Gushyiraho no Kongeraho Igice cy''Urutonde',
  'Complete the code to create a new `<li>` element and append it to the existing list.',
  'Uzuza kode gushyiraho igice gishya `<li>` kandi ugikurikize ku rutonde ruriho.',
  'complete_code',
  'beginner',
  'const newItem = document.createElement(''____'');
newItem.textContent = ''Item 3'';
document.getElementById(''____'').appendChild(newItem);',
  '<ul id="list"><li>Item 1</li><li>Item 2</li></ul>',
  $json$[
    {"assertion": "document.getElementById('list').children.length === 3", "description": "List should have 3 items"},
    {"assertion": "document.getElementById('list').lastElementChild.textContent === 'Item 3'", "description": "Last item should say 'Item 3'"}
  ]$json$::jsonb,
  10, 3,
  'Create an `''li''` element: `createElement(''li'')`. Then append it to the list with id `''list''`: `getElementById(''list'').appendChild(newItem)`.',
  'Shiraho igice `''li''`: `createElement(''li'')`. Hanyuma ugikurikize ku rutonde rufite id `''list''`: `getElementById(''list'').appendChild(newItem)`.'
),
(
  'qs000005-0000-0000-0000-000000000005',
  'Handle a Button Click',
  'Gukemura Kugunda kw''Buto',
  'Add a **click event listener** to the button with id `''btn''`. When the button is clicked, set the text content of the element with id `''output''` to `''Button clicked!''`.',
  'Ongeraho **event listener yo gukunda** ku buto bufite id `''btn''`. Iyo buto bugundwa, shyiraho ibiri muri igice gifite id `''output''` ngo bibe `''Button clicked!''`.',
  'write_scratch',
  'intermediate',
  '',
  '<button id="btn">Click me</button>
<p id="output"></p>',
  $json$[
    {"assertion": "(function(){ document.getElementById('btn').click(); return document.getElementById('output').textContent === 'Button clicked!'; })()", "description": "Clicking the button should update #output"}
  ]$json$::jsonb,
  15, 4,
  'Use `addEventListener`: `document.getElementById(''btn'').addEventListener(''click'', function() { document.getElementById(''output'').textContent = ''Button clicked!''; });`.',
  'Koresha `addEventListener`: `document.getElementById(''btn'').addEventListener(''click'', function() { document.getElementById(''output'').textContent = ''Button clicked!''; });`.'
),
(
  'qs000005-0000-0000-0000-000000000005',
  'Fix the Method Name Typo',
  'Gusana Ikosa ry''Izina rya Method',
  'The code should log `''Clicked!''` when the button is pressed, but it crashes. There is a **typo** in one method name — find it and fix it.',
  'Kode igomba kugaragaza `''Clicked!''` iyo buto bugundwa, ariko ihaguruka. Hari **ikosa ry''inyandiko** mu izina rimwe rya method — rishake kandi usane.',
  'fix_bug',
  'intermediate',
  'document.getElementById(''myBtn'').addEventListner(''click'', function() {
  console.log(''Clicked!'');
});',
  '<button id="myBtn">Click</button>',
  $json$[
    {"assertion": "(function(){ document.getElementById('myBtn').click(); return __output.includes('Clicked!'); })()", "description": "Clicking the button should log 'Clicked!'"}
  ]$json$::jsonb,
  10, 5,
  'Look closely at the method name: it should be `addEventListener` — with an `e` before `Listener`. The typo is `addEventListner` (missing the ''e'').',
  'Reba neza izina rya method: rigomba kuba `addEventListener` — ufite `e` mbere ya `Listener`. Ikosa ni `addEventListner` (irengagije ''e'').'
),
(
  'qs000005-0000-0000-0000-000000000005',
  'Change Element Styles',
  'Guhindura Imiterere y''Igice',
  'Complete the code to change the box''s background color to `''blue''` and its text color to `''white''`.',
  'Uzuza kode guhindura ibara ry''inyuma y''isanduku kugira ngo ibe `''blue''` n''ibara ry''inyandiko kugira ngo ibe `''white''`.',
  'complete_code',
  'intermediate',
  'const box = document.getElementById(''box'');
box.style.____ = ''blue'';
box.style.____ = ''white'';',
  '<div id="box" style="width:150px;height:80px;background:red;color:black;padding:10px">Style me!</div>',
  $json$[
    {"assertion": "document.getElementById('box').style.backgroundColor === 'blue'", "description": "Background should be blue"},
    {"assertion": "document.getElementById('box').style.color === 'white'", "description": "Text color should be white"}
  ]$json$::jsonb,
  10, 6,
  'In JavaScript, CSS `background-color` is written as `backgroundColor` (camelCase). Use `box.style.backgroundColor = ''blue'';` and `box.style.color = ''white'';`.',
  'Muri JavaScript, CSS `background-color` yandikwa nka `backgroundColor` (camelCase). Koresha `box.style.backgroundColor = ''blue'';` na `box.style.color = ''white'';`.'
);
