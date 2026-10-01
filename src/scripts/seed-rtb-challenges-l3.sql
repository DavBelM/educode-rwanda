-- =============================================
-- EduCode Rwanda — RTB Level 3 Challenges
-- Run AFTER seed-rtb-sets.sql
-- Modules: SWDPR301, SWDVF301, GENGD301
-- =============================================

-- ─── SWDPR301 LO1: Identifying Customer Needs ─────────────────────────────────

INSERT INTO public.quiz_challenges
  (set_id, title, title_kin, description, description_kin, challenge_type, difficulty,
   starter_js, starter_html, test_cases, xp_reward, order_index, hint, hint_kin)
VALUES
(
  '00000000-0300-0000-0000-000000000006',
  'Model a Customer Interview',
  'Gushushanya Ibiganiro by''Umukiriya',
  'Create a JavaScript object called `interview` that represents a customer interview. It should have: `customerName` (string), `date` (string in "YYYY-MM-DD" format), `responses` (array of at least 3 strings), and `priority` (number 1–5 where 5 is highest).',
  'Rema igiti kintu cya JavaScript cyitwa `interview` gihagarariye ibiganiro by''umukiriya. Bagomba kugira: `customerName` (string), `date` (igenekerezo mu buryo "YYYY-MM-DD"), `responses` (urutonde rw''inshuro 3 cyangwa ntarengwa), na `priority` (umubare 1–5 aho 5 ni ingenzi cyane).',
  'write_scratch', 'beginner',
  '// Create your interview object here
// It must have: customerName, date, responses[], priority',
  '',
  '[
    {"assertion": "typeof interview === ''object'' && interview !== null", "description": "interview must be an object"},
    {"assertion": "typeof interview.customerName === ''string'' && interview.customerName.length > 0", "description": "customerName must be a non-empty string"},
    {"assertion": "Array.isArray(interview.responses) && interview.responses.length >= 3", "description": "responses must be an array with at least 3 items"},
    {"assertion": "typeof interview.priority === ''number'' && interview.priority >= 1 && interview.priority <= 5", "description": "priority must be a number between 1 and 5"}
  ]',
  10, 1,
  'Start with `const interview = { ... }`. Fill in each property: `customerName: "Alice"`, `date: "2024-05-01"`, `responses: ["...", "...", "..."]`, `priority: 4`.',
  'Tangira na `const interview = { ... }`. Uzuza ibintu buri kimwe: `customerName: "Alice"`, `date: "2024-05-01"`, `responses: ["...", "...", "..."]`, `priority: 4`.'
),
(
  '00000000-0300-0000-0000-000000000006',
  'Count High-Priority Needs',
  'Kubara Ibisabwa by''Ingenzi',
  'Complete the function `countHighPriority(needs)` that receives an array of customer need objects (each with a `priority` number) and returns the count of needs with `priority >= 4`.',
  'Uzuza imikorere `countHighPriority(needs)` iyakira urutonde rw''ibintu bibisabwa by''umukiriya (buri kimwe gifite umubare wa `priority`) kandi isubize ingano y''ibisabwa bifite `priority >= 4`.',
  'complete_code', 'beginner',
  'function countHighPriority(needs) {
  let count = 0;
  for (const need of needs) {
    // TODO: add 1 to count if need.priority >= 4

  }
  return count;
}

const sampleNeeds = [
  { title: "Fast loading", priority: 5 },
  { title: "Dark mode", priority: 2 },
  { title: "Offline support", priority: 4 },
  { title: "Export PDF", priority: 3 },
  { title: "Real-time sync", priority: 5 }
];
console.log(countHighPriority(sampleNeeds));',
  '',
  '[
    {"assertion": "typeof countHighPriority === ''function''", "description": "countHighPriority must be a function"},
    {"assertion": "countHighPriority([{priority:5},{priority:2},{priority:4},{priority:3}]) === 2", "description": "Should count needs with priority >= 4"},
    {"assertion": "countHighPriority([{priority:1},{priority:2}]) === 0", "description": "Should return 0 when no needs are high priority"},
    {"assertion": "__output.includes(''3'')", "description": "Should log 3 for the sample (priorities 5, 4, 5)"}
  ]',
  10, 2,
  'Inside the loop, write: `if (need.priority >= 4) { count++; }`. This adds 1 to the counter each time a high-priority need is found.',
  'Mu nzira yo gusubiramo, andika: `if (need.priority >= 4) { count++; }`. Ibi ongeraho 1 ku mubare buri gihe ibisabwa by''ingenzi bibonetse.'
),
(
  '00000000-0300-0000-0000-000000000006',
  'Categorise Customer Needs',
  'Gutondeka Ibisabwa by''Umukiriya',
  'Write a function `categoriseNeeds(needs)` that takes an array of need objects (each with `title` and `type` — either "functional" or "non-functional") and returns an object with two keys: `functional` and `nonFunctional`, each containing an array of matching need titles.',
  'Andika imikorere `categoriseNeeds(needs)` iyakira urutonde rw''ibintu bibisabwa (buri kimwe gifite `title` na `type` — "functional" cyangwa "non-functional") kandi isubize igiti kintu gifite ibice bibiri: `functional` na `nonFunctional`, buri kimwe gifite urutonde rw''imitwe y''ibisabwa bihuye.',
  'write_scratch', 'intermediate',
  '// Write categoriseNeeds(needs) here',
  '',
  '[
    {"assertion": "typeof categoriseNeeds === ''function''", "description": "categoriseNeeds must be a function"},
    {"assertion": "JSON.stringify(categoriseNeeds([{title:''Login'',type:''functional''},{title:''Fast'',type:''non-functional''}])) === JSON.stringify({functional:[''Login''],nonFunctional:[''Fast'']})", "description": "Should separate functional and non-functional needs"},
    {"assertion": "categoriseNeeds([]).functional.length === 0 && categoriseNeeds([]).nonFunctional.length === 0", "description": "Should return empty arrays for empty input"}
  ]',
  15, 3,
  'Create a result object: `const result = { functional: [], nonFunctional: [] }`. Loop through needs and push each `need.title` into the right array based on `need.type`.',
  'Rema igiti kintu k''ibisubizo: `const result = { functional: [], nonFunctional: [] }`. Subiramo ibisabwa kandi shyira buri `need.title` mu rutonde rukwiye bitewe na `need.type`.'
),
(
  '00000000-0300-0000-0000-000000000006',
  'Find Duplicate Needs',
  'Kubona Ibisabwa Bisangiye',
  'Fix the bug in `findDuplicates(titles)`. It should return an array of strings that appear more than once in the input array. Currently it returns ALL items instead of only duplicates.',
  'Gukosora ikosa muri `findDuplicates(titles)`. Igomba gusubiza urutonde rw''ibisobanuro birekulikira inshuro imwe muri array y''ibinjizwa. Ubu isubiza ibintu BYOSE aho gusubiza asubiramo gusa.',
  'fix_bug', 'intermediate',
  'function findDuplicates(titles) {
  const seen = new Set();
  const duplicates = [];
  for (const title of titles) {
    // BUG: should only add to duplicates if already seen
    duplicates.push(title);
    seen.add(title);
  }
  return duplicates;
}

console.log(findDuplicates(["Login", "Dashboard", "Login", "Search", "Dashboard"]));',
  '',
  '[
    {"assertion": "typeof findDuplicates === ''function''", "description": "findDuplicates must be a function"},
    {"assertion": "findDuplicates([''A'',''B'',''A'',''C'',''B'']).length === 2", "description": "Should find 2 duplicates"},
    {"assertion": "findDuplicates([''A'',''B'',''A'',''C'',''B'']).includes(''A'') && findDuplicates([''A'',''B'',''A'',''C'',''B'']).includes(''B'')", "description": "Should include both duplicated strings"},
    {"assertion": "findDuplicates([''X'',''Y'',''Z'']).length === 0", "description": "Should return empty array when no duplicates"}
  ]',
  15, 4,
  'Replace `duplicates.push(title)` with a conditional: first check `if (seen.has(title)) { duplicates.push(title); }`, then add to `seen` after the check.',
  'Hindura `duplicates.push(title)` n''ibigena: banza suzuma `if (seen.has(title)) { duplicates.push(title); }`, hanyuma ongeraho kuri `seen` nyuma y''isuzuma.'
)
ON CONFLICT (set_id, order_index) DO NOTHING;

-- ─── SWDPR301 LO2: Gathering Project Requirements ─────────────────────────────

INSERT INTO public.quiz_challenges
  (set_id, title, title_kin, description, description_kin, challenge_type, difficulty,
   starter_js, starter_html, test_cases, xp_reward, order_index, hint, hint_kin)
VALUES
(
  '00000000-0300-0000-0000-000000000007',
  'Model Project Requirements',
  'Gushushanya Ibisabwa by''Umushinga',
  'Create a `Requirement` class with properties: `id` (number), `title` (string), `type` ("functional" | "non-functional" | "constraint"), `priority` (1–5), and `status` ("open" | "accepted" | "rejected"). Add a method `isCritical()` that returns `true` when priority is 5.',
  'Rema classe `Requirement` ifite ibintu: `id` (umubare), `title` (string), `type` ("functional" | "non-functional" | "constraint"), `priority` (1–5), na `status` ("open" | "accepted" | "rejected"). Ongeraho uburyo `isCritical()` busubiza `true` iyo priority ari 5.',
  'write_scratch', 'intermediate',
  '// Write the Requirement class here',
  '',
  '[
    {"assertion": "typeof Requirement === ''function''", "description": "Requirement class must be defined"},
    {"assertion": "new Requirement(1,''Login'',''functional'',5,''open'').isCritical() === true", "description": "isCritical() returns true when priority is 5"},
    {"assertion": "new Requirement(2,''Speed'',''non-functional'',3,''open'').isCritical() === false", "description": "isCritical() returns false when priority < 5"},
    {"assertion": "new Requirement(3,''GDPR'',''constraint'',4,''accepted'').status === ''accepted''", "description": "status property is stored correctly"}
  ]',
  10, 1,
  'Use: `class Requirement { constructor(id, title, type, priority, status) { ... } isCritical() { return this.priority === 5; } }`',
  'Koresha: `class Requirement { constructor(id, title, type, priority, status) { ... } isCritical() { return this.priority === 5; } }`'
),
(
  '00000000-0300-0000-0000-000000000007',
  'Validate Requirement Completeness',
  'Gusuzuma Ko Ibisabwa Birangiye',
  'Write `validateRequirement(req)` that checks an object and returns an array of error messages. It should flag: missing `title`, `priority` outside 1–5, and invalid `type` (must be "functional", "non-functional", or "constraint"). Return an empty array if all is valid.',
  'Andika `validateRequirement(req)` isuzuma igiti kintu kandi isubize urutonde rw''ubutumwa bw''amakosa. Igomba kubona: `title` idahari, `priority` iri hanze ya 1–5, na `type` itari "functional", "non-functional", cyangwa "constraint". Subiriza urutonde rurimo ubusa niba byose birangiye neza.',
  'write_scratch', 'intermediate',
  '// Write validateRequirement(req) here',
  '',
  '[
    {"assertion": "validateRequirement({title:''Login'',type:''functional'',priority:3}).length === 0", "description": "Valid requirement returns no errors"},
    {"assertion": "validateRequirement({type:''functional'',priority:3}).length >= 1", "description": "Missing title returns at least 1 error"},
    {"assertion": "validateRequirement({title:''X'',type:''invalid'',priority:3}).length >= 1", "description": "Invalid type returns at least 1 error"},
    {"assertion": "validateRequirement({title:''X'',type:''functional'',priority:9}).length >= 1", "description": "Priority out of range returns at least 1 error"}
  ]',
  10, 2,
  'Build an errors array: `const errors = []`. Check each field and push a message like `errors.push("Title is required")` if invalid. Return `errors` at the end.',
  'Rema urutonde rw''amakosa: `const errors = []`. Suzuma buri gice kandi shyiramo ubutumwa nka `errors.push("Title is required")` niba bitari neza. Subiriza `errors` mu mpera.'
),
(
  '00000000-0300-0000-0000-000000000007',
  'Calculate Requirements Coverage',
  'Kubara Uburinzi bw''Ibisabwa',
  'Fix the bug in `coveragePercent(requirements)`. It should return the percentage of requirements with status "accepted" (as a number 0–100, rounded to 1 decimal place). Currently it always returns 0.',
  'Gukosora ikosa muri `coveragePercent(requirements)`. Igomba gusubiza umubare w''ibisabwa bifite status "accepted" (nk''umubare 0–100, wunganirwa ku ndangagaciro imwe). Ubu isubiza 0 buri gihe.',
  'fix_bug', 'intermediate',
  'function coveragePercent(requirements) {
  const total = requirements.length;
  if (total === 0) return 0;
  // BUG: this counts all requirements, not just accepted ones
  const accepted = total;
  return Math.round((accepted / total) * 1000) / 10;
}

const reqs = [
  { title: "Login", status: "accepted" },
  { title: "Search", status: "open" },
  { title: "Export", status: "accepted" },
  { title: "Offline", status: "rejected" }
];
console.log(coveragePercent(reqs));',
  '',
  '[
    {"assertion": "coveragePercent([{status:''accepted''},{status:''open''},{status:''accepted''}]) === 66.7", "description": "2 out of 3 accepted = 66.7%"},
    {"assertion": "coveragePercent([{status:''accepted''},{status:''accepted''}]) === 100", "description": "All accepted = 100%"},
    {"assertion": "coveragePercent([]) === 0", "description": "Empty array returns 0"},
    {"assertion": "__output.includes(''50'')", "description": "Sample (2 of 4 accepted) should log 50"}
  ]',
  15, 3,
  'Replace the buggy `const accepted = total` with: `const accepted = requirements.filter(r => r.status === "accepted").length;`',
  'Hindura `const accepted = total` ikosa na: `const accepted = requirements.filter(r => r.status === "accepted").length;`'
),
(
  '00000000-0300-0000-0000-000000000007',
  'Generate a Requirements Summary',
  'Gukora Incamake y''Ibisabwa',
  'Write `summariseRequirements(requirements)` that returns an object with: `total` (count), `byType` (object mapping each type to its count), `byStatus` (same for status), and `criticalCount` (count where priority === 5).',
  'Andika `summariseRequirements(requirements)` isubiza igiti kintu gifite: `total` (ingano), `byType` (igiti kintu gihuza buri type na ingano yarwo), `byStatus` (kimwe kuri status), na `criticalCount` (ingano aho priority === 5).',
  'write_scratch', 'advanced',
  '// Write summariseRequirements(requirements) here',
  '',
  '[
    {"assertion": "summariseRequirements([]).total === 0", "description": "Empty input returns total of 0"},
    {"assertion": "summariseRequirements([{type:''functional'',status:''open'',priority:5},{type:''functional'',status:''accepted'',priority:3}]).byType.functional === 2", "description": "byType counts correctly"},
    {"assertion": "summariseRequirements([{type:''functional'',status:''open'',priority:5},{type:''constraint'',status:''open'',priority:3}]).criticalCount === 1", "description": "criticalCount counts priority === 5"}
  ]',
  15, 4,
  'Loop through requirements once. Use counters: `byType[r.type] = (byType[r.type] || 0) + 1`. Do the same for `byStatus`. Increment `criticalCount` when `r.priority === 5`.',
  'Subiramo ibisabwa rimwe. Koresha imibare: `byType[r.type] = (byType[r.type] || 0) + 1`. Kora kimwe kuri `byStatus`. Ongeraho `criticalCount` iyo `r.priority === 5`.'
)
ON CONFLICT (set_id, order_index) DO NOTHING;

-- ─── SWDPR301 LO3: User Stories & Task Flow ───────────────────────────────────

INSERT INTO public.quiz_challenges
  (set_id, title, title_kin, description, description_kin, challenge_type, difficulty,
   starter_js, starter_html, test_cases, xp_reward, order_index, hint, hint_kin)
VALUES
(
  '00000000-0300-0000-0000-000000000008',
  'Create User Stories',
  'Gukora Inkuru z''Abakoresha',
  'Write a function `createUserStory(role, action, benefit)` that returns a formatted user story string in the format: "As a {role}, I want to {action}, so that {benefit}." Also create an array `stories` with at least 2 user stories using this function.',
  'Andika imikorere `createUserStory(role, action, benefit)` isubiza string y''inkuru y''umukoreshafatizo mu buryo: "As a {role}, I want to {action}, so that {benefit}." Neza rema urutonde `stories` rufite byibuze inkuru 2 z''abakoresha ukoresheje iyi mikorere.',
  'write_scratch', 'beginner',
  '// Write createUserStory and the stories array here',
  '',
  '[
    {"assertion": "typeof createUserStory === ''function''", "description": "createUserStory must be a function"},
    {"assertion": "createUserStory(''student'',''track my progress'',''I can see how far I have come'').startsWith(''As a student'')", "description": "Story must start with ''As a {role}''"},
    {"assertion": "createUserStory(''teacher'',''grade assignments'',''students get feedback'').includes(''I want to grade assignments'')", "description": "Story must include the action phrase"},
    {"assertion": "Array.isArray(stories) && stories.length >= 2", "description": "stories array must have at least 2 items"}
  ]',
  10, 1,
  'Return a template literal: `return \`As a ${role}, I want to ${action}, so that ${benefit}.\`;`',
  'Subiriza template literal: `return \`As a ${role}, I want to ${action}, so that ${benefit}.\`;`'
),
(
  '00000000-0300-0000-0000-000000000008',
  'Validate User Story Format',
  'Gusuzuma Imiterere y''Inkuru z''Umukoreshafatizo',
  'Complete `isValidUserStory(story)` that returns `true` if the string is a valid user story — meaning it must start with "As a", contain "I want to", and contain "so that".',
  'Uzuza `isValidUserStory(story)` isubiza `true` niba string ari inkuru y''umukoreshafatizo nziza — bivuze yombi igutereka "As a", irimo "I want to", kandi irimo "so that".',
  'complete_code', 'beginner',
  'function isValidUserStory(story) {
  // TODO: return true only if story contains all three required phrases
  // Hint: use story.includes("...") with && to combine checks

}

console.log(isValidUserStory("As a student, I want to log in, so that I can access my courses."));
console.log(isValidUserStory("The user needs to log in."));',
  '',
  '[
    {"assertion": "isValidUserStory(''As a student, I want to log in, so that I can access courses.'') === true", "description": "Valid story returns true"},
    {"assertion": "isValidUserStory(''User needs login'') === false", "description": "Missing required phrases returns false"},
    {"assertion": "isValidUserStory(''As a teacher, I want to grade, so that students improve.'') === true", "description": "Another valid story returns true"},
    {"assertion": "__output.includes(''true'')", "description": "First console.log must output true"}
  ]',
  10, 2,
  'Use: `return story.includes("As a") && story.includes("I want to") && story.includes("so that");`',
  'Koresha: `return story.includes("As a") && story.includes("I want to") && story.includes("so that");`'
),
(
  '00000000-0300-0000-0000-000000000008',
  'Build a Task Flow Graph',
  'Kubaka Inzira ya Task Flow',
  'Model a task flow as a directed graph. Create an object `taskFlow` where each key is a task name, and its value is an array of next task names (dependencies). Then write `getStartTasks(flow)` that returns tasks with no incoming edges (nothing points to them).',
  'Gushushanya inzira ya task nk''graph ikurikirana. Rema igiti kintu `taskFlow` aho buri urufunguzo ari izina ry''umurimo, kandi agaciro karwo ari urutonde rw''amazina y''imirimo ikurikiraho. Hanyuma andika `getStartTasks(flow)` isubiza imirimo idafite ibigarura bijya mukati (nta kintu kinayigera).',
  'write_scratch', 'intermediate',
  '// Create taskFlow object and getStartTasks function here
// Example shape: { "Register": ["Login"], "Login": ["Dashboard"], "Dashboard": [] }',
  '',
  '[
    {"assertion": "typeof taskFlow === ''object'' && taskFlow !== null", "description": "taskFlow must be an object"},
    {"assertion": "typeof getStartTasks === ''function''", "description": "getStartTasks must be a function"},
    {"assertion": "getStartTasks({Register:[''Login''],Login:[''Dashboard''],Dashboard:[]}).includes(''Register'')", "description": "Register has no incoming edges so it is a start task"},
    {"assertion": "!getStartTasks({Register:[''Login''],Login:[''Dashboard''],Dashboard:[]}).includes(''Login'')", "description": "Login has an incoming edge so it is NOT a start task"}
  ]',
  15, 3,
  'To find start tasks: collect all tasks that are mentioned as targets of other tasks (they have incoming edges). Any task NOT in that set is a start task.',
  'Kugira ngo ubonye imirimo y''intangiriro: gukusanya imirimo yose ivugwa nk''intego za imirimo indi (ifite edges injya mukati). Umurimo wose utari muri icyo gice ni umurimo w''intangiriro.'
),
(
  '00000000-0300-0000-0000-000000000008',
  'Detect Task Flow Cycles',
  'Kubona Inzira z''Umuzingo mu Task Flow',
  'Fix the bug in `hasCycle(graph)`. It should return `true` if the directed graph has a cycle (a path that loops back to itself), but currently it always returns `false` because the visited set is never checked during DFS.',
  'Gukosora ikosa muri `hasCycle(graph)`. Igomba gusubiza `true` niba graph ikurikirana ifite umuzingo (inzira isubirayo kunyuma kuri yo), ariko ubu isubiza `false` buri gihe kuko visited set itasuzumwa mu gihe cya DFS.',
  'fix_bug', 'advanced',
  'function hasCycle(graph) {
  const visited = new Set();
  const inStack = new Set();

  function dfs(node) {
    visited.add(node);
    inStack.add(node);
    for (const neighbour of (graph[node] || [])) {
      // BUG: missing check — should return true if neighbour is already in inStack
      if (!visited.has(neighbour)) {
        if (dfs(neighbour)) return true;
      }
    }
    inStack.delete(node);
    return false;
  }

  for (const node of Object.keys(graph)) {
    if (!visited.has(node)) {
      if (dfs(node)) return true;
    }
  }
  return false;
}

console.log(hasCycle({ A: ["B"], B: ["C"], C: ["A"] })); // true
console.log(hasCycle({ A: ["B"], B: ["C"], C: [] }));    // false',
  '',
  '[
    {"assertion": "hasCycle({A:[''B''],B:[''C''],C:[''A'']}) === true", "description": "A→B→C→A is a cycle"},
    {"assertion": "hasCycle({A:[''B''],B:[''C''],C:[]}) === false", "description": "A→B→C (no cycle) returns false"},
    {"assertion": "hasCycle({}) === false", "description": "Empty graph has no cycle"}
  ]',
  15, 4,
  'Add `if (inStack.has(neighbour)) return true;` BEFORE the `if (!visited.has(neighbour))` check. This catches back-edges that create cycles.',
  'Ongeraho `if (inStack.has(neighbour)) return true;` MBERE ya `if (!visited.has(neighbour))`. Ibi bibona back-edges zitwara imuzingo.'
)
ON CONFLICT (set_id, order_index) DO NOTHING;

-- ─── SWDVF301 LO1: Vue Environment Setup ──────────────────────────────────────

INSERT INTO public.quiz_challenges
  (set_id, title, title_kin, description, description_kin, challenge_type, difficulty,
   starter_js, starter_html, test_cases, xp_reward, order_index, hint, hint_kin)
VALUES
(
  '00000000-0300-0000-0000-000000000009',
  'Vue Component Data Model',
  'Indangamiterere y''Amakuru ya Vue Component',
  'Vue components hold reactive data in a `data()` function. Write a function `createComponentData()` that returns an object with: `count` (number, starts at 0), `message` (string, "Hello Vue"), and `isVisible` (boolean, starts as true).',
  'Ibice bya Vue bigumana amakuru ashobora gusubiramo muri imikorere ya `data()`. Andika imikorere `createComponentData()` isubiza igiti kintu gifite: `count` (umubare, utangira kuri 0), `message` (string, "Hello Vue"), na `isVisible` (boolean, itangira ari true).',
  'write_scratch', 'beginner',
  '// Vue''s data() pattern — write createComponentData() that returns the initial state',
  '',
  '[
    {"assertion": "typeof createComponentData === ''function''", "description": "createComponentData must be a function"},
    {"assertion": "createComponentData().count === 0", "description": "count starts at 0"},
    {"assertion": "createComponentData().message === ''Hello Vue''", "description": "message is ''Hello Vue''"},
    {"assertion": "createComponentData().isVisible === true", "description": "isVisible starts as true"}
  ]',
  10, 1,
  'Return an object literal: `return { count: 0, message: "Hello Vue", isVisible: true };`',
  'Subiriza igiti kintu: `return { count: 0, message: "Hello Vue", isVisible: true };`'
),
(
  '00000000-0300-0000-0000-000000000009',
  'Computed Property Logic',
  'Logic ya Computed Property',
  'In Vue, computed properties derive values from data. Complete `computeFullName(data)` that takes an object with `firstName` and `lastName` and returns `"Lastname, Firstname"` format. Also complete `computeIsAdult(data)` that returns true if `data.age >= 18`.',
  'Muri Vue, computed properties zikusanya agaciro mu makuru. Uzuza `computeFullName(data)` iyakira igiti kintu gifite `firstName` na `lastName` kandi isubize uburyo `"Lastname, Firstname"`. Neza uzuza `computeIsAdult(data)` isubiza true niba `data.age >= 18`.',
  'complete_code', 'beginner',
  'function computeFullName(data) {
  // TODO: return "Lastname, Firstname" format
  return "";
}

function computeIsAdult(data) {
  // TODO: return true if data.age >= 18
  return false;
}

const user = { firstName: "Amina", lastName: "Uwase", age: 20 };
console.log(computeFullName(user));
console.log(computeIsAdult(user));',
  '',
  '[
    {"assertion": "computeFullName({firstName:''Amina'',lastName:''Uwase''}) === ''Uwase, Amina''", "description": "Returns ''Lastname, Firstname'' format"},
    {"assertion": "computeIsAdult({age:20}) === true", "description": "Returns true for age 20"},
    {"assertion": "computeIsAdult({age:16}) === false", "description": "Returns false for age 16"},
    {"assertion": "__output.includes(''Uwase, Amina'')", "description": "Should log the formatted name"}
  ]',
  10, 2,
  'For fullName: `return \`${data.lastName}, ${data.firstName}\`;`. For isAdult: `return data.age >= 18;`',
  'Kuri fullName: `return \`${data.lastName}, ${data.firstName}\`;`. Kuri isAdult: `return data.age >= 18;`'
),
(
  '00000000-0300-0000-0000-000000000009',
  'Vue Router Path Matching',
  'Guhura Inzira za Vue Router',
  'Write `matchRoute(routes, path)` that searches an array of route objects (each with `path` and `component` strings) and returns the matching component name, or `null` if no route matches.',
  'Andika `matchRoute(routes, path)` ishaka urutonde rw''ibintu by''inzira (buri kimwe gifite `path` na `component` strings) kandi isubize izina ry''ibice bihuye, cyangwa `null` niba nta nzira ihuye.',
  'write_scratch', 'intermediate',
  '// Write matchRoute(routes, path) here',
  '',
  '[
    {"assertion": "matchRoute([{path:''/home'',component:''Home''},{path:''/about'',component:''About''}],''/home'') === ''Home''", "description": "Matches /home to Home component"},
    {"assertion": "matchRoute([{path:''/home'',component:''Home''}],''/missing'') === null", "description": "Returns null for unmatched path"},
    {"assertion": "matchRoute([],''/home'') === null", "description": "Returns null for empty routes array"}
  ]',
  10, 3,
  'Use `routes.find(r => r.path === path)`. If found, return `route.component`; otherwise return `null`.',
  'Koresha `routes.find(r => r.path === path)`. Niba ibonetse, subiriza `route.component`; niba batayo, subiriza `null`.'
),
(
  '00000000-0300-0000-0000-000000000009',
  'Vuex-Style State Management',
  'Gucunga Imiterere mu Buryo bwa Vuex',
  'Implement a minimal Vuex-style store. Create a `createStore(initialState)` function that returns an object with: `state` (the initial state), `commit(mutation, payload)` that applies a mutation function to state, and `getState()` that returns a copy of state.',
  'Gushyira mu bikorwa igenomero rito rya Vuex. Rema imikorere `createStore(initialState)` isubiza igiti kintu gifite: `state` (imiterere y''intangiriro), `commit(mutation, payload)` ishyira mu bikorwa imikorere ya mutation kuri state, na `getState()` isubiza kopi ya state.',
  'write_scratch', 'advanced',
  '// Implement createStore below',
  '',
  '[
    {"assertion": "typeof createStore === ''function''", "description": "createStore must be a function"},
    {"assertion": "createStore({count:0}).getState().count === 0", "description": "Initial state is returned by getState()"},
    {"assertion": "(() => { const store = createStore({count:0}); store.commit((s,p) => { s.count += p; }, 5); return store.getState().count; })() === 5", "description": "commit applies mutation to state"}
  ]',
  15, 4,
  'The store needs an internal `_state`. `commit(mutation, payload)` calls `mutation(this._state, payload)`. `getState()` returns `{ ...this._state }` (a shallow copy).',
  'Igenomero rikenera `_state` y''imbere. `commit(mutation, payload)` ihamagara `mutation(this._state, payload)`. `getState()` isubiza `{ ...this._state }` (kopi yoroheje).'
)
ON CONFLICT (set_id, order_index) DO NOTHING;

-- ─── SWDVF301 LO3: Planning a Game ────────────────────────────────────────────

INSERT INTO public.quiz_challenges
  (set_id, title, title_kin, description, description_kin, challenge_type, difficulty,
   starter_js, starter_html, test_cases, xp_reward, order_index, hint, hint_kin)
VALUES
(
  '00000000-0300-0000-0000-000000000011',
  'Model Game State',
  'Gushushanya Imiterere y''Umukino',
  'Create a `GameState` class for a simple quiz game. It should have: `score` (0), `lives` (3), `level` (1), `isGameOver` (false). Add methods: `addScore(points)`, `loseLife()` (decrements lives; sets isGameOver to true when lives reach 0), and `nextLevel()` (increments level).',
  'Rema classe `GameState` yo gukino kya quiz koroheje. Igomba kugira: `score` (0), `lives` (3), `level` (1), `isGameOver` (false). Ongeraho uburyo: `addScore(points)`, `loseLife()` (igabanya ubuzima; ishyiraho isGameOver nk''true iyo ubuzima bugeraho 0), na `nextLevel()` (yongerera level).',
  'write_scratch', 'intermediate',
  '// Write the GameState class here',
  '',
  '[
    {"assertion": "new GameState().score === 0 && new GameState().lives === 3", "description": "Initial state is score=0, lives=3"},
    {"assertion": "(() => { const g = new GameState(); g.addScore(10); return g.score; })() === 10", "description": "addScore increases score"},
    {"assertion": "(() => { const g = new GameState(); g.loseLife(); g.loseLife(); g.loseLife(); return g.isGameOver; })() === true", "description": "Game over when lives reach 0"},
    {"assertion": "(() => { const g = new GameState(); g.nextLevel(); return g.level; })() === 2", "description": "nextLevel increments level"}
  ]',
  10, 1,
  'In the constructor set all initial values. `loseLife()` should do `this.lives--` and then check `if (this.lives <= 0) this.isGameOver = true;`.',
  'Muri constructor shyiraho agaciro kose k''intangiriro. `loseLife()` igomba gukora `this.lives--` hanyuma isuzume `if (this.lives <= 0) this.isGameOver = true;`.'
),
(
  '00000000-0300-0000-0000-000000000011',
  'Game Question Engine',
  'Injini y''Ibibazo by''Umukino',
  'Write `QuestionBank` class with: `questions` array (empty at start), `addQuestion(q)` method that adds a question object `{text, answer, points}`, `getRandom()` that returns a random question or `null` if empty, and `count` getter that returns the number of questions.',
  'Andika classe `QuestionBank` ifite: urutonde `questions` (rurimo ubusa ku ntangiriro), uburyo `addQuestion(q)` bongeraho igiti kintu cy''ikibazo `{text, answer, points}`, `getRandom()` isubiza ikibazo gikuwe haphazard cyangwa `null` niba rurimo ubusa, na getter `count` isubiza ingano y''ibibazo.',
  'write_scratch', 'intermediate',
  '// Write the QuestionBank class here',
  '',
  '[
    {"assertion": "new QuestionBank().count === 0", "description": "Starts with 0 questions"},
    {"assertion": "(() => { const qb = new QuestionBank(); qb.addQuestion({text:''Q'',answer:''A'',points:10}); return qb.count; })() === 1", "description": "addQuestion increments count"},
    {"assertion": "new QuestionBank().getRandom() === null", "description": "getRandom returns null when empty"},
    {"assertion": "(() => { const qb = new QuestionBank(); qb.addQuestion({text:''Q'',answer:''A'',points:10}); return qb.getRandom().text; })() === ''Q''", "description": "getRandom returns a question object"}
  ]',
  10, 2,
  'Use `get count() { return this.questions.length; }`. For `getRandom()`: if empty return null, else `return this.questions[Math.floor(Math.random() * this.questions.length)]`.',
  'Koresha `get count() { return this.questions.length; }`. Kuri `getRandom()`: niba rurimo ubusa subiriza null, wundi `return this.questions[Math.floor(Math.random() * this.questions.length)]`.'
),
(
  '00000000-0300-0000-0000-000000000011',
  'Collision Detection',
  'Kubona Ibihurana',
  'Write `checkCollision(rect1, rect2)` that returns `true` if two axis-aligned rectangles overlap. Each rectangle is `{x, y, width, height}` where x,y is the top-left corner.',
  'Andika `checkCollision(rect1, rect2)` isubiza `true` niba inkarehe ebyiri zihuranye. Buri mwaka karehe ni `{x, y, width, height}` aho x,y ari inzuzi yo ibumoso hejuru.',
  'write_scratch', 'advanced',
  '// Write checkCollision(rect1, rect2) here',
  '',
  '[
    {"assertion": "checkCollision({x:0,y:0,width:10,height:10},{x:5,y:5,width:10,height:10}) === true", "description": "Overlapping rectangles return true"},
    {"assertion": "checkCollision({x:0,y:0,width:5,height:5},{x:10,y:0,width:5,height:5}) === false", "description": "Non-overlapping rectangles return false"},
    {"assertion": "checkCollision({x:0,y:0,width:10,height:10},{x:10,y:0,width:5,height:5}) === false", "description": "Touching edges (not overlapping) return false"}
  ]',
  15, 3,
  'Two rectangles do NOT overlap when one is fully left, right, above, or below the other. Use: `return !(r1.x + r1.width <= r2.x || r2.x + r2.width <= r1.x || r1.y + r1.height <= r2.y || r2.y + r2.height <= r1.y);`',
  'Inkarehe ebyiri ZIHURANA ntizihurira iyo imwe yose iri ibumoso, iburyo, hejuru, cyangwa hasi y''indi. Koresha: `return !(r1.x + r1.width <= r2.x || r2.x + r2.width <= r1.x || r1.y + r1.height <= r2.y || r2.y + r2.height <= r1.y);`'
),
(
  '00000000-0300-0000-0000-000000000011',
  'Score Leaderboard',
  'Imbonerahamwe y''Amanota',
  'Fix `buildLeaderboard(scores)`. It should return the top 3 players sorted by score descending. Currently it sorts ascending instead of descending.',
  'Gukosora `buildLeaderboard(scores)`. Igomba gusubiza abakinyi ba mbere 3 batondetswe hakurikijwe amanota ava munsi hejuru. Ubu itondeka iva hejuru munsi aho kuva munsi hejuru.',
  'fix_bug', 'intermediate',
  'function buildLeaderboard(scores) {
  // BUG: sorting ascending instead of descending
  return scores
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);
}

const scores = [
  { name: "Alice", score: 850 },
  { name: "Bob", score: 920 },
  { name: "Carol", score: 780 },
  { name: "David", score: 1100 },
  { name: "Eve", score: 660 }
];
console.log(buildLeaderboard(scores).map(p => p.name).join(", "));',
  '',
  '[
    {"assertion": "buildLeaderboard([{name:''A'',score:100},{name:''B'',score:50},{name:''C'',score:200}])[0].name === ''C''", "description": "Highest score is first"},
    {"assertion": "buildLeaderboard([{name:''A'',score:100},{name:''B'',score:50},{name:''C'',score:200},{name:''D'',score:150}]).length === 3", "description": "Returns at most 3 entries"},
    {"assertion": "__output.includes(''David'')", "description": "David (1100) should be first in sample"}
  ]',
  10, 4,
  'Change `a.score - b.score` to `b.score - a.score` to sort in descending order.',
  'Hindura `a.score - b.score` na `b.score - a.score` kugira ngo utondeke ava munsi hejuru.'
)
ON CONFLICT (set_id, order_index) DO NOTHING;

-- ─── GENGD301 LO1: Working with Image Data ────────────────────────────────────

INSERT INTO public.quiz_challenges
  (set_id, title, title_kin, description, description_kin, challenge_type, difficulty,
   starter_js, starter_html, test_cases, xp_reward, order_index, hint, hint_kin)
VALUES
(
  '00000000-0300-0000-0000-000000000013',
  'RGB Colour Manipulation',
  'Guhindura Amabara ya RGB',
  'Write `adjustBrightness(r, g, b, factor)` that multiplies each channel by `factor`, clamps each result to 0–255, and returns `{r, g, b}`. Then write `toHex(r, g, b)` that converts RGB values to a hex colour string like `"#ff8040"`.',
  'Andika `adjustBrightness(r, g, b, factor)` ikubanya buri kanal na `factor`, igabanya buri kw''ibisubizo kuri 0–255, kandi isubize `{r, g, b}`. Hanyuma andika `toHex(r, g, b)` ihindura agaciro ka RGB mu string ya hex y''ibara nka `"#ff8040"`.',
  'write_scratch', 'beginner',
  '// Write adjustBrightness(r, g, b, factor) and toHex(r, g, b) here',
  '',
  '[
    {"assertion": "adjustBrightness(100, 150, 200, 2).r === 200 && adjustBrightness(100, 150, 200, 2).b === 255", "description": "Values clamped to 255 max"},
    {"assertion": "adjustBrightness(100, 100, 100, 0.5).r === 50", "description": "Halving brightness works correctly"},
    {"assertion": "toHex(255, 128, 0) === ''#ff8000''", "description": "RGB to hex conversion is correct"},
    {"assertion": "toHex(0, 0, 0) === ''#000000''", "description": "Black converts correctly"}
  ]',
  10, 1,
  'Clamp with `Math.min(255, Math.max(0, Math.round(value * factor)))`. For hex: `channel.toString(16).padStart(2, "0")` then concatenate with "#".',
  'Gabanya ukoresheje `Math.min(255, Math.max(0, Math.round(value * factor)))`. Kuri hex: `channel.toString(16).padStart(2, "0")` hanyuma huza na "#".'
),
(
  '00000000-0300-0000-0000-000000000013',
  'Greyscale Filter',
  'Filtre yo Gukora Grey',
  'Complete `applyGreyscale(pixels)` where `pixels` is an array of `{r, g, b}` objects. Convert each pixel to greyscale using the luminance formula: `grey = Math.round(0.299 * r + 0.587 * g + 0.114 * b)`. Return a new array with each pixel as `{r: grey, g: grey, b: grey}`.',
  'Uzuza `applyGreyscale(pixels)` aho `pixels` ari urutonde rw''ibintu `{r, g, b}`. Hindura buri pixel kugira ngo ibe grey ukoresheje formuliyi ya luminance: `grey = Math.round(0.299 * r + 0.587 * g + 0.114 * b)`. Subiriza urutonde rushya buri pixel nk''`{r: grey, g: grey, b: grey}`.',
  'complete_code', 'intermediate',
  'function applyGreyscale(pixels) {
  return pixels.map(pixel => {
    const grey = Math.round(/* TODO: use 0.299*r + 0.587*g + 0.114*b */ 0);
    return { r: grey, g: grey, b: grey };
  });
}

const testPixels = [
  { r: 255, g: 0, b: 0 },
  { r: 0, g: 255, b: 0 },
  { r: 128, g: 128, b: 128 }
];
const result = applyGreyscale(testPixels);
console.log(result[0].r, result[1].r);',
  '',
  '[
    {"assertion": "applyGreyscale([{r:255,g:0,b:0}])[0].r === 76", "description": "Red pixel grey value is 76 (0.299*255)"},
    {"assertion": "applyGreyscale([{r:128,g:128,b:128}])[0].r === 128", "description": "Mid-grey pixel stays the same"},
    {"assertion": "applyGreyscale([{r:0,g:255,b:0}])[0].g === 150", "description": "Green pixel grey value is 150 (0.587*255)"}
  ]',
  10, 2,
  'Replace the 0 with: `0.299 * pixel.r + 0.587 * pixel.g + 0.114 * pixel.b`',
  'Hindura 0 na: `0.299 * pixel.r + 0.587 * pixel.g + 0.114 * pixel.b`'
),
(
  '00000000-0300-0000-0000-000000000013',
  'Image Histogram',
  'Imbonerahamwe y''Amashusho',
  'Write `buildHistogram(pixels)` that takes an array of greyscale pixel values (0–255 integers) and returns an array of 256 numbers where index `i` is the count of pixels with value `i`.',
  'Andika `buildHistogram(pixels)` iyakira urutonde rw''agaciro ka pixels ya grey (imibare 0–255) kandi isubize urutonde rw''imibare 256 aho index `i` ari ingano ya pixels ifite agaciro `i`.',
  'write_scratch', 'intermediate',
  '// Write buildHistogram(pixels) here',
  '',
  '[
    {"assertion": "buildHistogram([0,0,255,128]).length === 256", "description": "Returns array of length 256"},
    {"assertion": "buildHistogram([0,0,255,128])[0] === 2", "description": "Value 0 appears twice"},
    {"assertion": "buildHistogram([0,0,255,128])[255] === 1", "description": "Value 255 appears once"},
    {"assertion": "buildHistogram([])[100] === 0", "description": "Empty input has all zeros"}
  ]',
  10, 3,
  'Create `const hist = new Array(256).fill(0)`. Then loop: `for (const v of pixels) hist[v]++`. Return `hist`.',
  'Rema `const hist = new Array(256).fill(0)`. Hanyuma subiramo: `for (const v of pixels) hist[v]++`. Subiriza `hist`.'
),
(
  '00000000-0300-0000-0000-000000000013',
  'Fix the Invert Filter',
  'Gukosora Filtre y''Gusubiranya',
  'Fix the bug in `invertColour(pixel)`. It should return a new pixel with each channel inverted (255 minus original). Currently it modifies the input pixel in place instead of returning a new object.',
  'Gukosora ikosa muri `invertColour(pixel)`. Igomba gusubiza pixel nshya buri kanal ihinduye (255 mabuye gwishi). Ubu ihindura pixel y''ibinjizwa aho gusubiza igiti kintu gishya.',
  'fix_bug', 'intermediate',
  'function invertColour(pixel) {
  // BUG: mutates the input object instead of returning a new one
  pixel.r = 255 - pixel.r;
  pixel.g = 255 - pixel.g;
  pixel.b = 255 - pixel.b;
  return pixel;
}

const original = { r: 100, g: 150, b: 200 };
const inverted = invertColour(original);
console.log(original.r, inverted.r);',
  '',
  '[
    {"assertion": "(() => { const p = {r:100,g:150,b:200}; invertColour(p); return p.r; })() === 100", "description": "Original pixel must not be modified"},
    {"assertion": "invertColour({r:100,g:150,b:200}).r === 155", "description": "255 - 100 = 155"},
    {"assertion": "invertColour({r:0,g:0,b:0}).r === 255", "description": "Inverted black is white"}
  ]',
  10, 4,
  'Return a new object instead of modifying the parameter: `return { r: 255 - pixel.r, g: 255 - pixel.g, b: 255 - pixel.b };`',
  'Subiriza igiti kintu gishya aho ko uhindura parameter: `return { r: 255 - pixel.r, g: 255 - pixel.g, b: 255 - pixel.b };`'
)
ON CONFLICT (set_id, order_index) DO NOTHING;

-- ─── GENGD301 LO2: Vector Graphics & Shapes ───────────────────────────────────

INSERT INTO public.quiz_challenges
  (set_id, title, title_kin, description, description_kin, challenge_type, difficulty,
   starter_js, starter_html, test_cases, xp_reward, order_index, hint, hint_kin)
VALUES
(
  '00000000-0300-0000-0000-000000000014',
  'SVG Shape Generator',
  'Gukora Imishusho ya SVG',
  'Write `createCircleSVG(cx, cy, r, fill)` that returns an SVG circle element string: `<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}" />`. Also write `createRectSVG(x, y, w, h, fill)` for rectangles.',
  'Andika `createCircleSVG(cx, cy, r, fill)` isubiza string y''igice cya SVG: `<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}" />`. Neza andika `createRectSVG(x, y, w, h, fill)` kuri dikare.',
  'write_scratch', 'beginner',
  '// Write createCircleSVG and createRectSVG here',
  '',
  '[
    {"assertion": "createCircleSVG(50,50,30,''red'').includes(''cx=\"50\"'')", "description": "Circle SVG includes cx attribute"},
    {"assertion": "createCircleSVG(50,50,30,''red'').includes(''r=\"30\"'')", "description": "Circle SVG includes r attribute"},
    {"assertion": "createRectSVG(10,20,100,50,''blue'').includes(''width=\"100\"'')", "description": "Rect SVG includes width attribute"},
    {"assertion": "createRectSVG(10,20,100,50,''blue'').includes(''fill=\"blue\"'')", "description": "Rect SVG includes fill attribute"}
  ]',
  10, 1,
  'Use template literals: `return \`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" />\`;`',
  'Koresha template literals: `return \`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" />\`;`'
),
(
  '00000000-0300-0000-0000-000000000014',
  'Calculate Shape Area and Perimeter',
  'Kubara Ubuso na Ingano y''Imishusho',
  'Create a `Shape` class with a `type` ("circle" or "rectangle") and relevant dimensions (`radius` for circles; `width` and `height` for rectangles). Add an `area()` method and a `perimeter()` method.',
  'Rema classe `Shape` ifite `type` ("circle" cyangwa "rectangle") na ingano zihuye (`radius` kuri circles; `width` na `height` kuri dikare). Ongeraho uburyo `area()` na `perimeter()`.',
  'write_scratch', 'intermediate',
  '// Write the Shape class here',
  '',
  '[
    {"assertion": "Math.round(new Shape(''circle'', {radius:5}).area() * 100) === Math.round(Math.PI * 25 * 100)", "description": "Circle area = π × r²"},
    {"assertion": "new Shape(''rectangle'', {width:4, height:6}).area() === 24", "description": "Rectangle area = width × height"},
    {"assertion": "Math.round(new Shape(''circle'', {radius:5}).perimeter()) === Math.round(2 * Math.PI * 5)", "description": "Circle perimeter = 2πr"},
    {"assertion": "new Shape(''rectangle'', {width:4, height:6}).perimeter() === 20", "description": "Rectangle perimeter = 2(w+h)"}
  ]',
  10, 2,
  'In `area()`, use `if (this.type === "circle") return Math.PI * this.dims.radius ** 2; else return this.dims.width * this.dims.height;`',
  'Muri `area()`, koresha `if (this.type === "circle") return Math.PI * this.dims.radius ** 2; else return this.dims.width * this.dims.height;`'
),
(
  '00000000-0300-0000-0000-000000000014',
  'SVG Path Builder',
  'Kubaka Inzira ya SVG',
  'Write `buildPath(commands)` that takes an array of move/line commands and returns an SVG path `d` attribute string. Each command is an object: `{type: "M"|"L"|"Z", x?, y?}`. M = moveto, L = lineto, Z = closepath.',
  'Andika `buildPath(commands)` iyakira urutonde rw''amategeko yo gusunika/kora umurongo kandi isubize string ya attribute `d` ya SVG path. Buri tegeko ni igiti kintu: `{type: "M"|"L"|"Z", x?, y?}`. M = gusunika, L = kora umurongo, Z = gufunga inzira.',
  'write_scratch', 'intermediate',
  '// Write buildPath(commands) here',
  '',
  '[
    {"assertion": "buildPath([{type:''M'',x:0,y:0},{type:''L'',x:100,y:100},{type:''Z''}]) === ''M 0 0 L 100 100 Z''", "description": "Correct path string format"},
    {"assertion": "buildPath([{type:''M'',x:10,y:20}]) === ''M 10 20''", "description": "Single moveto command"},
    {"assertion": "buildPath([]) === ''''", "description": "Empty input returns empty string"}
  ]',
  10, 3,
  'Map each command: `if (cmd.type === "Z") return "Z"; return \`${cmd.type} ${cmd.x} ${cmd.y}\`;`. Then `.join(" ")`.',
  'Gushushanya buri tegeko: `if (cmd.type === "Z") return "Z"; return \`${cmd.type} ${cmd.x} ${cmd.y}\`;`. Hanyuma `.join(" ")`.'
),
(
  '00000000-0300-0000-0000-000000000014',
  'Bounding Box',
  'Indobi z''Icihuza',
  'Write `getBoundingBox(shapes)` that takes an array of rectangle objects `{x, y, width, height}` and returns the smallest bounding box `{x, y, width, height}` that contains all of them.',
  'Andika `getBoundingBox(shapes)` iyakira urutonde rw''ibintu bya dikare `{x, y, width, height}` kandi isubize indobi nto cyane `{x, y, width, height}` irimo byose.',
  'write_scratch', 'advanced',
  '// Write getBoundingBox(shapes) here',
  '',
  '[
    {"assertion": "getBoundingBox([{x:0,y:0,width:10,height:10},{x:5,y:5,width:20,height:20}]).x === 0", "description": "Min x is 0"},
    {"assertion": "getBoundingBox([{x:0,y:0,width:10,height:10},{x:5,y:5,width:20,height:20}]).width === 25", "description": "Width covers from x=0 to x=25"},
    {"assertion": "getBoundingBox([{x:10,y:10,width:5,height:5}]).y === 10", "description": "Single shape returns its own bounds"}
  ]',
  15, 4,
  'Find `minX = min(s.x)`, `minY = min(s.y)`, `maxX = max(s.x + s.width)`, `maxY = max(s.y + s.height)`. Return `{x:minX, y:minY, width:maxX-minX, height:maxY-minY}`.',
  'Bona `minX = min(s.x)`, `minY = min(s.y)`, `maxX = max(s.x + s.width)`, `maxY = max(s.y + s.height)`. Subiriza `{x:minX, y:minY, width:maxX-minX, height:maxY-minY}`.'
)
ON CONFLICT (set_id, order_index) DO NOTHING;

-- ─── GENGD301 LO3: File Formats & Export ──────────────────────────────────────

INSERT INTO public.quiz_challenges
  (set_id, title, title_kin, description, description_kin, challenge_type, difficulty,
   starter_js, starter_html, test_cases, xp_reward, order_index, hint, hint_kin)
VALUES
(
  '00000000-0300-0000-0000-000000000015',
  'Detect Image Format',
  'Kumenya Ubwoko bw''Amashusho',
  'Write `detectFormat(filename)` that returns the image format based on file extension: "jpeg" for .jpg/.jpeg, "png" for .png, "svg" for .svg, "webp" for .webp, or "unknown" for anything else. Case-insensitive.',
  'Andika `detectFormat(filename)` isubiza ubwoko bw''amashusho bitewe n''extension ya file: "jpeg" kuri .jpg/.jpeg, "png" kuri .png, "svg" kuri .svg, "webp" kuri .webp, cyangwa "unknown" kuri ibindi byose. Ntiyitaho ibice bya majuscules.',
  'write_scratch', 'beginner',
  '// Write detectFormat(filename) here',
  '',
  '[
    {"assertion": "detectFormat(''photo.jpg'') === ''jpeg''", "description": ".jpg maps to jpeg"},
    {"assertion": "detectFormat(''logo.SVG'') === ''svg''", "description": "Case-insensitive .SVG maps to svg"},
    {"assertion": "detectFormat(''image.PNG'') === ''png''", "description": "Case-insensitive .PNG maps to png"},
    {"assertion": "detectFormat(''data.csv'') === ''unknown''", "description": "Non-image extension returns unknown"}
  ]',
  10, 1,
  'Extract the extension: `const ext = filename.split(".").pop().toLowerCase()`. Then use a switch/object map: `{jpg:"jpeg", jpeg:"jpeg", png:"png", svg:"svg", webp:"webp"}`.',
  'Vomora extension: `const ext = filename.split(".").pop().toLowerCase()`. Hanyuma koresha switch/object map: `{jpg:"jpeg", jpeg:"jpeg", png:"png", svg:"svg", webp:"webp"}`.'
),
(
  '00000000-0300-0000-0000-000000000015',
  'Image Quality Score',
  'Amanota y''Ubwiza bw''Amashusho',
  'Write `calculateFileSize(width, height, format, quality)` that estimates image file size in KB. For "png": `(width * height * 3) / 1024` bytes → KB. For "jpeg": same formula multiplied by `quality / 100` (quality is 1–100). For "webp": jpeg size × 0.8.',
  'Andika `calculateFileSize(width, height, format, quality)` ipima ingano y''amashusho muri KB. Kuri "png": `(width * height * 3) / 1024` bytes → KB. Kuri "jpeg": formuliyi imwe yisubiranya na `quality / 100` (quality ni 1–100). Kuri "webp": ingano ya jpeg × 0.8.',
  'write_scratch', 'intermediate',
  '// Write calculateFileSize(width, height, format, quality) here',
  '',
  '[
    {"assertion": "Math.round(calculateFileSize(100,100,''png'',100)) === Math.round((100*100*3)/1024)", "description": "PNG size formula"},
    {"assertion": "calculateFileSize(1000,1000,''jpeg'',50) < calculateFileSize(1000,1000,''jpeg'',100)", "description": "Lower JPEG quality means smaller file"},
    {"assertion": "calculateFileSize(1000,1000,''webp'',100) < calculateFileSize(1000,1000,''jpeg'',100)", "description": "WebP is 20% smaller than JPEG at same quality"}
  ]',
  10, 2,
  'Calculate base PNG size first, then apply quality factor for JPEG, then multiply by 0.8 for WebP.',
  'Banza ubaze ingano ya PNG, hanyuma shyiraho ingaruka ya quality kuri JPEG, hanyuma gusobanura 0.8 kuri WebP.'
),
(
  '00000000-0300-0000-0000-000000000015',
  'Base64 Encoder',
  'Gushiraho Base64',
  'Complete the simple `base64Encode(str)` function that encodes a string to Base64 using `btoa()`. Handle the case where the string contains characters outside ASCII (non-Latin) by first encoding to URI components.',
  'Uzuza imikorere yoroheje ya `base64Encode(str)` ishiraho string muri Base64 ukoresheje `btoa()`. Gukemura aho string irimo ibaruwa ari hanze ya ASCII (zitari Latin) banza woye ibikoresho bya URI.',
  'complete_code', 'intermediate',
  'function base64Encode(str) {
  try {
    // TODO: use btoa() to encode the string
    // For non-ASCII: btoa(unescape(encodeURIComponent(str)))
    return "";
  } catch (e) {
    return null;
  }
}

console.log(base64Encode("Hello"));
console.log(base64Encode("EduCode Rwanda"));',
  '',
  '[
    {"assertion": "base64Encode(''Hello'') === ''SGVsbG8=''", "description": "''Hello'' encodes to correct base64"},
    {"assertion": "typeof base64Encode(''test'') === ''string''", "description": "Returns a string"},
    {"assertion": "__output.includes(''SGVsbG8='')", "description": "Should log correct base64 for Hello"}
  ]',
  10, 3,
  'Use `btoa(unescape(encodeURIComponent(str)))` to handle all Unicode characters safely.',
  'Koresha `btoa(unescape(encodeURIComponent(str)))` kugira ngo ukuremo ibaruwa zose za Unicode mu mutekano.'
),
(
  '00000000-0300-0000-0000-000000000015',
  'Fix the Resize Calculator',
  'Gukosora Ikibazo cyo Guhindura Ingano',
  'Fix `calculateResizeDimensions(origW, origH, maxW, maxH)`. It should proportionally resize to fit within maxW × maxH while preserving aspect ratio. Currently it ignores the aspect ratio.',
  'Gukosora `calculateResizeDimensions(origW, origH, maxW, maxH)`. Igomba guhindura ingano mu buryo bw''amahererekane kugira ngo injire muri maxW × maxH igumana ingano y''inzira. Ubu itumva ingano y''inzira.',
  'fix_bug', 'advanced',
  'function calculateResizeDimensions(origW, origH, maxW, maxH) {
  // BUG: just clamps to max without preserving ratio
  return {
    width: Math.min(origW, maxW),
    height: Math.min(origH, maxH)
  };
}

console.log(calculateResizeDimensions(2000, 1000, 800, 800));',
  '',
  '[
    {"assertion": "(() => { const d = calculateResizeDimensions(2000,1000,800,800); return d.width / d.height; })() === 2", "description": "Aspect ratio 2:1 is preserved"},
    {"assertion": "calculateResizeDimensions(2000,1000,800,800).width === 800", "description": "Width is clamped to 800"},
    {"assertion": "calculateResizeDimensions(100,100,800,800).width === 100", "description": "Image smaller than max is not resized up"}
  ]',
  15, 4,
  'Calculate the ratio: `const ratio = Math.min(maxW / origW, maxH / origH, 1)`. Then: `{ width: Math.round(origW * ratio), height: Math.round(origH * ratio) }`.',
  'Bara ratio: `const ratio = Math.min(maxW / origW, maxH / origH, 1)`. Hanyuma: `{ width: Math.round(origW * ratio), height: Math.round(origH * ratio) }`.'
)
ON CONFLICT (set_id, order_index) DO NOTHING;
