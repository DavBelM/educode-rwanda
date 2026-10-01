-- =============================================
-- EduCode Rwanda — RTB Level 5 Challenges
-- Run AFTER seed-rtb-sets.sql
-- Modules: GENPP501, SWDFB501, SWDDT501, SWDFA501,
--          SWDMA501, NITML501, SWDND501, GENQA501
-- =============================================

-- ─── GENPP501 LO2: Core Python Programming ────────────────────────────────────

INSERT INTO public.quiz_challenges
  (set_id, title, title_kin, description, description_kin, challenge_type, difficulty,
   starter_js, starter_html, test_cases, xp_reward, order_index, hint, hint_kin)
VALUES
(
  '00000000-0500-0000-0000-000000000201',
  'Python List Comprehension → JS',
  'Python List Comprehension → JS',
  'Python list comprehensions like `[x**2 for x in range(10) if x % 2 == 0]` are powerful. Translate this into JavaScript: write `squaresOfEvens(n)` that returns an array of squares of even numbers from 0 to n-1.',
  'Python list comprehensions nka `[x**2 for x in range(10) if x % 2 == 0]` ni ingirakamaro. Hindura ibi muri JavaScript: andika `squaresOfEvens(n)` isubiza urutonde rw''inzuzu z''imibare y''amara kuva 0 kugeza n-1.',
  'write_scratch', 'intermediate',
  '// In Python: [x**2 for x in range(n) if x % 2 == 0]
// Write squaresOfEvens(n) in JavaScript',
  '',
  '[
    {"assertion": "squaresOfEvens(6).join('','') === ''0,4,16''", "description": "Squares of 0,2,4 = 0,4,16"},
    {"assertion": "squaresOfEvens(1).join('','') === ''0''", "description": "Only 0 is even in range(1)"},
    {"assertion": "squaresOfEvens(0).length === 0", "description": "Empty range returns empty array"}
  ]',
  10, 1,
  'Use `Array.from({length: n}, (_, i) => i).filter(x => x % 2 === 0).map(x => x ** 2)`.',
  'Koresha `Array.from({length: n}, (_, i) => i).filter(x => x % 2 === 0).map(x => x ** 2)`.'
),
(
  '00000000-0500-0000-0000-000000000201',
  'Python Dictionary → JS Object',
  'Python Dictionary → JS Object',
  'Python dicts and JS objects are similar. Write `wordFrequency(text)` that takes a string and returns an object where each key is a word (lowercase) and its value is the number of times it appears.',
  'Python dicts na JS objects bisa. Andika `wordFrequency(text)` iyakira string kandi isubize igiti kintu aho buri urufunguzo ari ijambo (ibice bito) kandi agaciro karwo ari umubare w''inshuro garagara.',
  'write_scratch', 'intermediate',
  '// Write wordFrequency(text) here',
  '',
  '[
    {"assertion": "wordFrequency(''the cat sat on the mat'').the === 2", "description": "''the'' appears twice"},
    {"assertion": "wordFrequency(''hello world hello'').hello === 2", "description": "''hello'' appears twice"},
    {"assertion": "wordFrequency(''Hi hi HI'').hi === 3", "description": "Case-insensitive counting"}
  ]',
  10, 2,
  'Split text by spaces, lowercase each word, then use a reduce or loop to count: `freq[word] = (freq[word] || 0) + 1`.',
  'Tanya umwandiko mu mwanya, ibice bito buri jambo, hanyuma koresha reduce cyangwa inzira yo kubarura: `freq[word] = (freq[word] || 0) + 1`.'
),
(
  '00000000-0500-0000-0000-000000000201',
  'Python File-like Processing',
  'Gukora nka File muri Python',
  'Python reads files line by line. Simulate this: write `processLines(text, transform)` that splits a multi-line string by newlines, applies `transform` to each non-empty line, and returns an array of results.',
  'Python isoma files umurongo umwe na umwe. Gushushanya ibi: andika `processLines(text, transform)` itanya string y''imirongo myinshi na indangakomeho nshya, ishyira mu bikorwa `transform` ku murongo wose utuzuye ubusa, kandi isubize urutonde rw''ibisubizo.',
  'write_scratch', 'intermediate',
  '// Write processLines(text, transform) here',
  '',
  '[
    {"assertion": "processLines(''hello\\nworld'', s => s.toUpperCase()).join('','') === ''HELLO,WORLD''", "description": "Transform applied to each line"},
    {"assertion": "processLines(''a\\n\\nb'', s => s).length === 2", "description": "Empty lines are skipped"},
    {"assertion": "processLines('''', s => s).length === 0", "description": "Empty input returns empty array"}
  ]',
  10, 3,
  'Split: `text.split("\\n")`. Filter: `.filter(line => line.trim().length > 0)`. Map: `.map(line => transform(line))`.',
  'Tanya: `text.split("\\n")`. Kinga: `.filter(line => line.trim().length > 0)`. Hindura: `.map(line => transform(line))`.'
),
(
  '00000000-0500-0000-0000-000000000201',
  'Fix the Fibonacci Generator',
  'Gukosora Gukora Fibonacci',
  'Fix `fibonacci(n)` that should return an array of the first n Fibonacci numbers. Currently it always returns `[0, 1]` regardless of n.',
  'Gukosora `fibonacci(n)` igomba gusubiza urutonde rw''imibare ya mbere n ya Fibonacci. Ubu isubiza `[0, 1]` buri gihe hatitawe ku n.',
  'fix_bug', 'intermediate',
  'function fibonacci(n) {
  if (n <= 0) return [];
  if (n === 1) return [0];
  const seq = [0, 1];
  // BUG: loop never runs because condition is wrong
  while (seq.length > n) {
    seq.push(seq[seq.length - 1] + seq[seq.length - 2]);
  }
  return seq;
}

console.log(fibonacci(7).join(","));',
  '',
  '[
    {"assertion": "fibonacci(7).join('','') === ''0,1,1,2,3,5,8''", "description": "First 7 Fibonacci numbers"},
    {"assertion": "fibonacci(1).join('','') === ''0''", "description": "First Fibonacci number is 0"},
    {"assertion": "fibonacci(0).length === 0", "description": "n=0 returns empty array"}
  ]',
  10, 4,
  'Change `while (seq.length > n)` to `while (seq.length < n)`. The loop should continue WHILE the sequence is too SHORT.',
  'Hindura `while (seq.length > n)` na `while (seq.length < n)`. Inzira igomba gukomeza NAHO urutonde ruri BUFUPI cyane.'
)
ON CONFLICT (set_id, order_index) DO NOTHING;

-- ─── SWDFB501 LO1: Blockchain Architecture ────────────────────────────────────

INSERT INTO public.quiz_challenges
  (set_id, title, title_kin, description, description_kin, challenge_type, difficulty,
   starter_js, starter_html, test_cases, xp_reward, order_index, hint, hint_kin)
VALUES
(
  '00000000-0500-0000-0000-000000000203',
  'Create a Block',
  'Gukora Block',
  'Write a `Block` class with: `index` (number), `data` (any), `previousHash` (string), `timestamp` (Date.now() by default), and `hash` (initially empty string). Add a method `computeHash()` that returns a deterministic string hash based on the block''s contents.',
  'Andika classe `Block` ifite: `index` (umubare), `data` (ikintu cyose), `previousHash` (string), `timestamp` (Date.now() nk''amategeko), na `hash` (string yuzuye ubusa kuri mbere). Ongeraho uburyo `computeHash()` usubiza hash ya string yateguwe bitewe n''ibikubiyemo bya block.',
  'write_scratch', 'intermediate',
  '// Write the Block class here
// computeHash() can use: JSON.stringify({index, data, previousHash, timestamp})',
  '',
  '[
    {"assertion": "typeof Block === ''function''", "description": "Block class is defined"},
    {"assertion": "new Block(0, ''Genesis'', ''0'').index === 0", "description": "index is stored"},
    {"assertion": "typeof new Block(0, ''Genesis'', ''0'').computeHash() === ''string''", "description": "computeHash returns a string"},
    {"assertion": "new Block(0, ''A'', ''0'').computeHash() === new Block(0, ''A'', ''0'').computeHash()", "description": "computeHash is deterministic for same input"}
  ]',
  10, 1,
  'Use `JSON.stringify({...})` as the hash for simplicity, or implement a real hash by computing character codes. Same content → same hash.',
  'Koresha `JSON.stringify({...})` nk''hash y''ubworoherane, cyangwa gushyira mu bikorwa hash y''ukuri ukoresheje ibimero bya ibaruwa. Ibikubiyemo bisa → hash imwe.'
),
(
  '00000000-0500-0000-0000-000000000203',
  'Build a Blockchain',
  'Kubaka Blockchain',
  'Create a `Blockchain` class that: initialises with a genesis block, has `addBlock(data)` to append a new block (using the last block''s hash as `previousHash`), has `isValid()` to verify all blocks link correctly, and a `chain` getter.',
  'Rema classe `Blockchain` iyaka: itangira na block y''intangiriro, ifite `addBlock(data)` kwongeraho block nshya (ukoresheje hash ya block ya nyuma nk''`previousHash`), ifite `isValid()` gusuzuma ko blocks zose zihuriye neza, na getter `chain`.',
  'write_scratch', 'advanced',
  '// Write Blockchain class here (requires Block class from previous challenge)',
  '',
  '[
    {"assertion": "new Blockchain().chain.length === 1", "description": "Starts with genesis block"},
    {"assertion": "(() => { const bc = new Blockchain(); bc.addBlock(''tx1''); return bc.chain.length; })() === 2", "description": "addBlock increases chain length"},
    {"assertion": "new Blockchain().isValid() === true", "description": "Genesis chain is valid"},
    {"assertion": "(() => { const bc = new Blockchain(); bc.addBlock(''tx1''); return bc.isValid(); })() === true", "description": "Chain with added blocks is valid"}
  ]',
  15, 2,
  'In `isValid()`, loop from index 1. Check each block: `blocks[i].hash === blocks[i].computeHash()` and `blocks[i].previousHash === blocks[i-1].hash`.',
  'Muri `isValid()`, subiramo kuva index 1. Suzuma buri block: `blocks[i].hash === blocks[i].computeHash()` na `blocks[i].previousHash === blocks[i-1].hash`.'
),
(
  '00000000-0500-0000-0000-000000000203',
  'Detect Chain Tampering',
  'Kubona Guhindura Chain',
  'Write a test that demonstrates how tampering with a block makes `isValid()` return false. Create a blockchain, add 2 blocks, then directly modify the data of block at index 1, and verify that `isValid()` detects the tampering.',
  'Andika gerageza yerekana uburyo guhindura block bitwara `isValid()` gusubiza false. Rema blockchain, wongeraho blocks 2, hanyuma uhindure makuru ya block ku index 1 neza neza, kandi suzuma ko `isValid()` ibona guhindura.',
  'write_scratch', 'advanced',
  '// Demonstrate tamper detection
// Assume Blockchain and Block classes exist with computeHash()
// Create blockchain, add blocks, tamper, then check isValid()

// Your code here:
let bc;
let tamperDetected;',
  '',
  '[
    {"assertion": "typeof tamperDetected === ''boolean''", "description": "tamperDetected must be a boolean"},
    {"assertion": "tamperDetected === true", "description": "isValid() must return false after tampering"}
  ]',
  15, 3,
  'Create a blockchain, add blocks, set `bc.chain[1].data = "HACKED"`, then `tamperDetected = !bc.isValid()`.',
  'Rema blockchain, wongeraho blocks, shyiraho `bc.chain[1].data = "HACKED"`, hanyuma `tamperDetected = !bc.isValid()`.'
),
(
  '00000000-0500-0000-0000-000000000203',
  'Token Balance Tracker',
  'Gukurikirana Umutungo wa Token',
  'Implement a simple token ledger. Write `createLedger()` with: `mint(address, amount)` (create tokens), `transfer(from, to, amount)` (transfer between addresses — fail silently if insufficient balance), and `balanceOf(address)` (returns balance, 0 if not found).',
  'Gushyira mu bikorwa inyandiko yoroheje ya tokens. Andika `createLedger()` ifite: `mint(address, amount)` (gukora tokens), `transfer(from, to, amount)` (guhereza hagati y''aderesi — gucanganya mu mutekano niba umutungo uri mugufi), na `balanceOf(address)` (isubiza umutungo, 0 niba itabonetse).',
  'write_scratch', 'advanced',
  '// Write createLedger() here',
  '',
  '[
    {"assertion": "(() => { const l = createLedger(); l.mint(''alice'',100); return l.balanceOf(''alice''); })() === 100", "description": "mint creates tokens"},
    {"assertion": "createLedger().balanceOf(''unknown'') === 0", "description": "Unknown address has balance 0"},
    {"assertion": "(() => { const l = createLedger(); l.mint(''alice'',100); l.transfer(''alice'',''bob'',30); return l.balanceOf(''bob''); })() === 30", "description": "transfer moves tokens"},
    {"assertion": "(() => { const l = createLedger(); l.mint(''alice'',10); l.transfer(''alice'',''bob'',50); return l.balanceOf(''alice''); })() === 10", "description": "Transfer with insufficient balance does nothing"}
  ]',
  15, 4,
  'Store balances in `const balances = {}`. For transfer: first check `(balances[from] || 0) >= amount`. If yes, subtract from sender and add to receiver.',
  'Bika imitungo muri `const balances = {}`. Kuri transfer: banza suzuma `(balances[from] || 0) >= amount`. Niba ni byo, kura ku wohereza ongeraho ku wabona.'
)
ON CONFLICT (set_id, order_index) DO NOTHING;

-- ─── SWDFA501 LO1: React.js Core Concepts ─────────────────────────────────────

INSERT INTO public.quiz_challenges
  (set_id, title, title_kin, description, description_kin, challenge_type, difficulty,
   starter_js, starter_html, test_cases, xp_reward, order_index, hint, hint_kin)
VALUES
(
  '00000000-0500-0000-0000-000000000210',
  'useState Hook Logic',
  'Logic ya Hook ya useState',
  'React''s `useState` hook manages component state. Write `createState(initialValue)` that returns `[getValue, setValue]` — a getter function and a setter function. When `setValue(newVal)` is called, `getValue()` should return the new value.',
  'Hook ya React ya `useState` igenzura imiterere ya component. Andika `createState(initialValue)` isubiza `[getValue, setValue]` — imikorere yo gusubiza kandi yo gushyiraho. Iyo `setValue(newVal)` ihamagarwa, `getValue()` igomba gusubiza agaciro gashya.',
  'write_scratch', 'intermediate',
  '// Write createState(initialValue) here',
  '',
  '[
    {"assertion": "(() => { const [get, set] = createState(0); return get(); })() === 0", "description": "Initial value is returned by getter"},
    {"assertion": "(() => { const [get, set] = createState(0); set(42); return get(); })() === 42", "description": "setValue updates the value"},
    {"assertion": "(() => { const [get, set] = createState(''hello''); set(s => s + '' world''); return get(); })() === ''hello world''", "description": "setValue accepts an updater function"}
  ]',
  10, 1,
  'Store in a closure: `let _value = initialValue`. Getter: `() => _value`. Setter: `(newVal) => { _value = typeof newVal === "function" ? newVal(_value) : newVal; }`.',
  'Bika muri closure: `let _value = initialValue`. Gusubiza: `() => _value`. Gushyiraho: `(newVal) => { _value = typeof newVal === "function" ? newVal(_value) : newVal; }`.'
),
(
  '00000000-0500-0000-0000-000000000210',
  'useEffect Dependency Tracking',
  'Gukurikirana Dependencies za useEffect',
  'React''s `useEffect` only re-runs when dependencies change. Write `createEffect(fn, deps)` that: calls `fn()` immediately on creation; and has a `rerun(newDeps)` method that calls `fn()` only if any dependency in `newDeps` is different from the previous `deps`.',
  'React ya `useEffect` isubiramo gusa iyo dependencies zahindutse. Andika `createEffect(fn, deps)` iyaka: ihamagara `fn()` ako kanya iyo yoherezwa; kandi ifite uburyo `rerun(newDeps)` buhamagara `fn()` gusa niba hari dependency muri `newDeps` yatandukanye n''ibya `deps` bya mbere.',
  'write_scratch', 'intermediate',
  '// Write createEffect(fn, deps) here',
  '',
  '[
    {"assertion": "(() => { let count = 0; createEffect(() => count++, [1]); return count; })() === 1", "description": "fn runs on creation"},
    {"assertion": "(() => { let count = 0; const e = createEffect(() => count++, [1,2]); e.rerun([1,2]); return count; })() === 1", "description": "rerun does not re-run when deps unchanged"},
    {"assertion": "(() => { let count = 0; const e = createEffect(() => count++, [1]); e.rerun([2]); return count; })() === 2", "description": "rerun fires when deps change"}
  ]',
  10, 2,
  'Store `let prevDeps = deps`. In `rerun(newDeps)`: compare element by element. If any `newDeps[i] !== prevDeps[i]`, run `fn()` and update `prevDeps = newDeps`.',
  'Bika `let prevDeps = deps`. Muri `rerun(newDeps)`: biguranye igice na igice. Niba hari `newDeps[i] !== prevDeps[i]`, gukoresha `fn()` kandi uhindure `prevDeps = newDeps`.'
),
(
  '00000000-0500-0000-0000-000000000210',
  'Component Props Validation',
  'Gusuzuma Props za Component',
  'In React, PropTypes validates component props. Write `validateProps(props, propTypes)` where `propTypes` is an object mapping prop names to `"required"`, `"number"`, `"string"`, or `"boolean"`. Return an array of validation error strings.',
  'Muri React, PropTypes isuzuma props za component. Andika `validateProps(props, propTypes)` aho `propTypes` ari igiti kintu gishyikiriza amazina ya props na `"required"`, `"number"`, `"string"`, cyangwa `"boolean"`. Subiriza urutonde rw''strings z''amakosa yo gusuzuma.',
  'write_scratch', 'intermediate',
  '// Write validateProps(props, propTypes) here',
  '',
  '[
    {"assertion": "validateProps({name:''Alice'',age:25},{name:''string'',age:''number''}).length === 0", "description": "Valid props returns no errors"},
    {"assertion": "validateProps({age:25},{name:''required'',age:''number''}).length >= 1", "description": "Missing required prop returns error"},
    {"assertion": "validateProps({count:''not a number''},{count:''number''}).length >= 1", "description": "Wrong type returns error"}
  ]',
  10, 3,
  'For each key in propTypes: if "required" and missing, add error. If "number"/"string"/"boolean", check `typeof props[key] === propTypes[key]`, add error if wrong.',
  'Kuri buri urufunguzo muri propTypes: niba "required" kandi ibuye, ongeraho ikosa. Niba "number"/"string"/"boolean", suzuma `typeof props[key] === propTypes[key]`, ongeraho ikosa niba bitakwiye.'
),
(
  '00000000-0500-0000-0000-000000000210',
  'Fix the Context Provider',
  'Gukosora Context Provider',
  'Fix `createContext(defaultValue)`. It should return `{Provider, useContext}`. Currently `useContext` always returns `defaultValue` instead of the value provided by the `Provider`.',
  'Gukosora `createContext(defaultValue)`. Igomba gusubiza `{Provider, useContext}`. Ubu `useContext` isubiza `defaultValue` buri gihe aho gusubiza agaciro kaherezwa na `Provider`.',
  'fix_bug', 'advanced',
  'function createContext(defaultValue) {
  // BUG: context value is never updated when Provider is called
  let _value = defaultValue;

  function Provider(value) {
    // should store the provided value
  }

  function useContext() {
    return defaultValue; // BUG: always returns defaultValue
  }

  return { Provider, useContext };
}

const ThemeCtx = createContext("light");
ThemeCtx.Provider("dark");
console.log(ThemeCtx.useContext());',
  '',
  '[
    {"assertion": "(() => { const ctx = createContext(''light''); ctx.Provider(''dark''); return ctx.useContext(); })() === ''dark''", "description": "useContext returns provided value"},
    {"assertion": "createContext(''light'').useContext() === ''light''", "description": "Returns default when Provider not called"}
  ]',
  15, 4,
  'In `Provider(value)`, add `_value = value`. In `useContext()`, change `return defaultValue` to `return _value`.',
  'Muri `Provider(value)`, ongeraho `_value = value`. Muri `useContext()`, hindura `return defaultValue` na `return _value`.'
)
ON CONFLICT (set_id, order_index) DO NOTHING;

-- ─── NITML501 LO1: Data Pre-processing ────────────────────────────────────────

INSERT INTO public.quiz_challenges
  (set_id, title, title_kin, description, description_kin, challenge_type, difficulty,
   starter_js, starter_html, test_cases, xp_reward, order_index, hint, hint_kin)
VALUES
(
  '00000000-0500-0000-0000-000000000219',
  'Normalise a Dataset',
  'Guhindura Dataset mu Bwuri',
  'Min-max normalisation rescales values to the [0, 1] range. Write `minMaxNormalise(data)` that takes an array of numbers and returns a new array where each value is `(x - min) / (max - min)`. Return the original array unchanged if max === min.',
  'Min-max normalisation isubiranya agaciro ku murongo [0, 1]. Andika `minMaxNormalise(data)` iyakira urutonde rw''imibare kandi isubize urutonde rushya aho buri agaciro ari `(x - min) / (max - min)`. Subiriza urutonde rw''ibinjizwa rutahindutse niba max === min.',
  'write_scratch', 'intermediate',
  '// Write minMaxNormalise(data) here',
  '',
  '[
    {"assertion": "minMaxNormalise([0, 50, 100])[0] === 0 && minMaxNormalise([0, 50, 100])[2] === 1", "description": "Min maps to 0, max maps to 1"},
    {"assertion": "Math.round(minMaxNormalise([0,50,100])[1] * 100) === 50", "description": "Middle value maps to 0.5"},
    {"assertion": "minMaxNormalise([5,5,5]).join('','') === ''5,5,5''", "description": "Constant array returned unchanged"}
  ]',
  10, 1,
  'Find `min = Math.min(...data)` and `max = Math.max(...data)`. If `max === min`, return `[...data]`. Otherwise map: `(x - min) / (max - min)`.',
  'Bona `min = Math.min(...data)` na `max = Math.max(...data)`. Niba `max === min`, subiriza `[...data]`. Niba bitabaye, hindura: `(x - min) / (max - min)`.'
),
(
  '00000000-0500-0000-0000-000000000219',
  'Remove Outliers',
  'Gukuraho Amakuru Atangaje',
  'Write `removeOutliers(data)` that removes values more than 2 standard deviations from the mean. Return a new filtered array.',
  'Andika `removeOutliers(data)` ikuraho agaciro kari hejuru ya deviations 2 za standard kuva hagati. Subiriza urutonde rushya rutakingiriwe.',
  'write_scratch', 'advanced',
  '// Write removeOutliers(data) here
// Steps: calculate mean, calculate std dev, filter values within mean ± 2*stdDev',
  '',
  '[
    {"assertion": "removeOutliers([1,2,3,4,5,100]).includes(100) === false", "description": "Extreme outlier 100 is removed"},
    {"assertion": "removeOutliers([1,2,3,4,5,100]).length < 6", "description": "Array is shorter after removal"},
    {"assertion": "removeOutliers([1,1,1,1]).length === 4", "description": "Uniform data has no outliers"}
  ]',
  15, 2,
  'Mean = `sum / n`. Variance = `sum of (x - mean)² / n`. StdDev = `Math.sqrt(variance)`. Keep values where `Math.abs(x - mean) <= 2 * stdDev`.',
  'Hagati = `sum / n`. Variance = `sum wa (x - mean)² / n`. StdDev = `Math.sqrt(variance)`. Bika agaciro aho `Math.abs(x - mean) <= 2 * stdDev`.'
),
(
  '00000000-0500-0000-0000-000000000219',
  'One-Hot Encoding',
  'One-Hot Encoding',
  'One-hot encoding converts categorical values to binary vectors. Write `oneHotEncode(categories, value)` where `categories` is an array of all possible values. Return an array of 0s with a single 1 at the position of `value`.',
  'One-hot encoding ihindura agaciro k''inzego mu birangaminsi bya binary. Andika `oneHotEncode(categories, value)` aho `categories` ari urutonde rw''agaciro kose bishoboka. Subiriza urutonde rw''imibare 0 hamwe na 1 imwe aho `value` iri.',
  'write_scratch', 'intermediate',
  '// Write oneHotEncode(categories, value) here',
  '',
  '[
    {"assertion": "oneHotEncode([''cat'',''dog'',''bird''],''dog'').join('','') === ''0,1,0''", "description": "''dog'' at index 1 is encoded as [0,1,0]"},
    {"assertion": "oneHotEncode([''a'',''b'',''c''],''a'').join('','') === ''1,0,0''", "description": "First category is [1,0,0]"},
    {"assertion": "oneHotEncode([''x'',''y''],''z'').every(v => v === 0)", "description": "Unknown value results in all zeros"}
  ]',
  10, 3,
  'Create `Array(categories.length).fill(0)`. Find `idx = categories.indexOf(value)`. If `idx >= 0`, set `vec[idx] = 1`. Return the vector.',
  'Rema `Array(categories.length).fill(0)`. Bona `idx = categories.indexOf(value)`. Niba `idx >= 0`, shyiraho `vec[idx] = 1`. Subiriza vector.'
),
(
  '00000000-0500-0000-0000-000000000219',
  'Train/Test Split',
  'Gutandukanya Data yo Guha Ubumenyi/Gerageza',
  'Write `trainTestSplit(data, testRatio)` that returns `{train, test}` where `test` contains approximately `testRatio` fraction of the data (selected from the end), and `train` contains the rest.',
  'Andika `trainTestSplit(data, testRatio)` isubiza `{train, test}` aho `test` irimo ibice by''amakuru `testRatio` (bikuwe ku mpera), na `train` irimo ibindi.',
  'write_scratch', 'intermediate',
  '// Write trainTestSplit(data, testRatio) here',
  '',
  '[
    {"assertion": "trainTestSplit([1,2,3,4,5,6,7,8,9,10], 0.2).test.length === 2", "description": "20% of 10 items = 2 test items"},
    {"assertion": "trainTestSplit([1,2,3,4,5,6,7,8,9,10], 0.2).train.length === 8", "description": "Remaining 8 items in train"},
    {"assertion": "trainTestSplit([1,2,3,4,5], 0.4).test.length + trainTestSplit([1,2,3,4,5], 0.4).train.length === 5", "description": "Total items preserved"}
  ]',
  10, 4,
  '`const testSize = Math.round(data.length * testRatio)`. Then: `test = data.slice(-testSize)`, `train = data.slice(0, -testSize)`.',
  '`const testSize = Math.round(data.length * testRatio)`. Hanyuma: `test = data.slice(-testSize)`, `train = data.slice(0, -testSize)`.'
)
ON CONFLICT (set_id, order_index) DO NOTHING;

-- ─── NITML501 LO2: Developing ML Models ───────────────────────────────────────

INSERT INTO public.quiz_challenges
  (set_id, title, title_kin, description, description_kin, challenge_type, difficulty,
   starter_js, starter_html, test_cases, xp_reward, order_index, hint, hint_kin)
VALUES
(
  '00000000-0500-0000-0000-000000000220',
  'Linear Regression Prediction',
  'Guhanura ukoresheje Linear Regression',
  'Given a trained linear model with `slope` and `intercept`, write `linearPredict(slope, intercept, x)` that returns the predicted y value. Then write `meanSquaredError(predictions, actuals)` to evaluate the model.',
  'Bafashijwe na indangamiterere ya linear yize ifite `slope` na `intercept`, andika `linearPredict(slope, intercept, x)` isubiza agaciro ka y guhanurwa. Hanyuma andika `meanSquaredError(predictions, actuals)` gusuzuma indangamiterere.',
  'write_scratch', 'intermediate',
  '// Write linearPredict(slope, intercept, x) and meanSquaredError(predictions, actuals) here',
  '',
  '[
    {"assertion": "linearPredict(2, 1, 3) === 7", "description": "y = 2x + 1 at x=3 is 7"},
    {"assertion": "linearPredict(0, 5, 100) === 5", "description": "Zero slope returns intercept"},
    {"assertion": "meanSquaredError([2,4,6],[2,4,6]) === 0", "description": "Perfect predictions have 0 error"},
    {"assertion": "meanSquaredError([1,2],[3,4]) === 4", "description": "MSE of [(1-3)²+(2-4)²]/2 = [4+4]/2 = 4"}
  ]',
  10, 1,
  'linearPredict: `return slope * x + intercept`. MSE: average of `(pred - actual) ** 2` for each pair.',
  'linearPredict: `return slope * x + intercept`. MSE: hagati ya `(pred - actual) ** 2` kuri buri mahuriro.'
),
(
  '00000000-0500-0000-0000-000000000220',
  'K-Nearest Neighbours Classifier',
  'Classify ukoresheje K-Nearest Neighbours',
  'Implement `knnClassify(trainingData, k, query)` where each training point is `{features: number[], label: string}`. Find the k nearest points by Euclidean distance and return the most common label among them.',
  'Gushyira mu bikorwa `knnClassify(trainingData, k, query)` aho buri tuntu byo guha ubumenyi ari `{features: number[], label: string}`. Bona agatuntu k ageze hafi hafi ukoresheje intera ya Euclidean kandi usubize inkoranyamagambo nkunda cyane muri bo.',
  'write_scratch', 'advanced',
  '// Write knnClassify(trainingData, k, query) here
// Euclidean distance: sqrt(sum of (a[i] - b[i])^2)',
  '',
  '[
    {"assertion": "knnClassify([{features:[1,1],label:''A''},{features:[9,9],label:''B''}], 1, [2,2]) === ''A''", "description": "Point near [1,1] is classified as A"},
    {"assertion": "knnClassify([{features:[1],label:''X''},{features:[1],label:''X''},{features:[10],label:''Y''}], 2, [2]) === ''X''", "description": "Majority label wins"}
  ]',
  15, 2,
  'Calculate distance from query to each training point. Sort by distance. Take first k. Count labels. Return the label with the highest count.',
  'Bara intera kuva query kugeza buri tuntu byo guha ubumenyi. Tondeka ukoresheje intera. Fata k ya mbere. Bara inkoranyamagambo. Subiriza inkoranyamagambo ifite ingano nkunda.'
),
(
  '00000000-0500-0000-0000-000000000220',
  'Confusion Matrix',
  'Matrix y''Akaryoshye',
  'Write `confusionMatrix(actual, predicted, labels)` that returns a 2D matrix where `matrix[i][j]` is the count of times label `labels[i]` was actual and `labels[j]` was predicted.',
  'Andika `confusionMatrix(actual, predicted, labels)` isubiza matrix ya 2D aho `matrix[i][j]` ari ingano y''inshuro inkoranyamagambo `labels[i]` yari ukuri kandi `labels[j]` yanagiriwe guhanurwa.',
  'write_scratch', 'advanced',
  '// Write confusionMatrix(actual, predicted, labels) here',
  '',
  '[
    {"assertion": "confusionMatrix([''A'',''B'',''A''],[''A'',''A'',''A''],[''A'',''B''])[0][0] === 2", "description": "A predicted as A = 2 times"},
    {"assertion": "confusionMatrix([''A'',''B'',''A''],[''A'',''A'',''A''],[''A'',''B''])[1][0] === 1", "description": "B predicted as A = 1 time"},
    {"assertion": "confusionMatrix([''A''],[''B''],[''A'',''B''])[0][1] === 1", "description": "A predicted as B = 1 time"}
  ]',
  15, 3,
  'Build an n×n matrix of zeros. For each index i, find `rowIdx = labels.indexOf(actual[i])` and `colIdx = labels.indexOf(predicted[i])`. Increment `matrix[rowIdx][colIdx]`.',
  'Rema matrix y''imibare zeru n×n. Kuri buri index i, bona `rowIdx = labels.indexOf(actual[i])` na `colIdx = labels.indexOf(predicted[i])`. Ongeraho `matrix[rowIdx][colIdx]`.'
),
(
  '00000000-0500-0000-0000-000000000220',
  'Fix the Accuracy Calculator',
  'Gukosora Ubara bw''Ukuri',
  'Fix `calculateAccuracy(actual, predicted)`. It should return the fraction (0–1) of predictions that match actual labels. Currently it always returns 1.',
  'Gukosora `calculateAccuracy(actual, predicted)`. Igomba gusubiza igice (0–1) cy''ibyagiriwe guhanurwa bihuye n''ibikuri. Ubu isubiza 1 buri gihe.',
  'fix_bug', 'intermediate',
  'function calculateAccuracy(actual, predicted) {
  // BUG: always returns 1
  return 1;
}

console.log(calculateAccuracy(["A","B","A","B"], ["A","A","A","B"]));',
  '',
  '[
    {"assertion": "calculateAccuracy([''A'',''B'',''A'',''B''],[''A'',''A'',''A'',''B'']) === 0.75", "description": "3 out of 4 correct = 0.75"},
    {"assertion": "calculateAccuracy([''X'',''Y''],[''X'',''Y'']) === 1", "description": "All correct = 1"},
    {"assertion": "calculateAccuracy([''X'',''X''],[''Y'',''Y'']) === 0", "description": "None correct = 0"}
  ]',
  10, 4,
  'Count matches: `const correct = actual.filter((a, i) => a === predicted[i]).length`. Return `correct / actual.length`.',
  'Bara ibihuye: `const correct = actual.filter((a, i) => a === predicted[i]).length`. Subiriza `correct / actual.length`.'
)
ON CONFLICT (set_id, order_index) DO NOTHING;

-- ─── SWDND501 LO3: MongoDB CRUD & Queries ─────────────────────────────────────

INSERT INTO public.quiz_challenges
  (set_id, title, title_kin, description, description_kin, challenge_type, difficulty,
   starter_js, starter_html, test_cases, xp_reward, order_index, hint, hint_kin)
VALUES
(
  '00000000-0500-0000-0000-000000000224',
  'MongoDB Filter Query',
  'Query yo Kinga ya MongoDB',
  'Write `queryCollection(docs, filter)` that simulates MongoDB''s `find(filter)`. The filter is an object — return only documents where ALL filter fields match the document''s fields.',
  'Andika `queryCollection(docs, filter)` gushushanya MongoDB ya `find(filter)`. Kinga ni igiti kintu — subiriza inyandiko gusa aho imibare YOSE y''ikinga ihuye n''imibare y''inyandiko.',
  'write_scratch', 'intermediate',
  '// Write queryCollection(docs, filter) here',
  '',
  '[
    {"assertion": "queryCollection([{name:''Alice'',age:25},{name:''Bob'',age:30}],{age:25})[0].name === ''Alice''", "description": "Filter by age returns correct document"},
    {"assertion": "queryCollection([{name:''Alice'',age:25},{name:''Bob'',age:30}],{age:25}).length === 1", "description": "Returns only matching documents"},
    {"assertion": "queryCollection([{name:''Alice''}],{name:''Alice'',age:25}).length === 0", "description": "Document missing a filter field does not match"}
  ]',
  10, 1,
  'Use `docs.filter(doc => Object.keys(filter).every(key => doc[key] === filter[key]))`.',
  'Koresha `docs.filter(doc => Object.keys(filter).every(key => doc[key] === filter[key]))`.'
),
(
  '00000000-0500-0000-0000-000000000224',
  'Aggregation Pipeline',
  'Inzira yo Guhuza ya Aggregation',
  'Implement a simple aggregation pipeline. Write `aggregate(docs, pipeline)` where `pipeline` is an array of stage objects: `{$match: filter}` (filter docs), `{$sort: {field: 1|-1}}` (sort), `{$limit: n}` (take first n).',
  'Gushyira mu bikorwa inzira yoroheje yo guhuza. Andika `aggregate(docs, pipeline)` aho `pipeline` ari urutonde rw''ibintu by''inzira: `{$match: filter}` (kinga inyandiko), `{$sort: {field: 1|-1}}` (tondeka), `{$limit: n}` (fata n ya mbere).',
  'write_scratch', 'advanced',
  '// Write aggregate(docs, pipeline) here',
  '',
  '[
    {"assertion": "aggregate([{n:3},{n:1},{n:2}],[{$sort:{n:1}}])[0].n === 1", "description": "$sort ascending puts 1 first"},
    {"assertion": "aggregate([{n:1},{n:2},{n:3}],[{$limit:2}]).length === 2", "description": "$limit reduces to 2 items"},
    {"assertion": "aggregate([{a:1},{a:2},{a:3}],[{$match:{a:2}}]).length === 1", "description": "$match filters by field"}
  ]',
  15, 2,
  'Process each stage sequentially. For `$match`, filter docs. For `$sort`, sort by the specified field (1=asc, -1=desc). For `$limit`, slice.',
  'Gukoresha buri nzira mu buryo bwateguwe. Kuri `$match`, kinga inyandiko. Kuri `$sort`, tondeka ukoresheje gice cyahawe (1=ava hasi hejuru, -1=ava hejuru munsi). Kuri `$limit`, tera.'
),
(
  '00000000-0500-0000-0000-000000000224',
  'Upsert Operation',
  'Ibikorwa bya Upsert',
  'Implement `upsert(collection, filter, update)` that: if a document matching `filter` exists, merges `update` fields into it; if not, inserts a new document with both `filter` and `update` fields merged. Returns the modified collection.',
  'Gushyira mu bikorwa `upsert(collection, filter, update)` iyaka: niba inyandiko ihuye na `filter` irabaho, huza imibare ya `update` nayo; niba bitabaye, shyiramo inyandiko nshya ifite imibare ya `filter` na `update` yombi. Subiriza imbumba yahindutse.',
  'write_scratch', 'advanced',
  '// Write upsert(collection, filter, update) here',
  '',
  '[
    {"assertion": "upsert([{id:1,name:''Alice''}],{id:1},{name:''Alicia''}).find(d=>d.id===1).name === ''Alicia''", "description": "Updates existing document"},
    {"assertion": "upsert([{id:1}],{id:2},{name:''Bob''}).length === 2", "description": "Inserts new document when not found"},
    {"assertion": "upsert([],{id:1},{name:''Carol''}).length === 1", "description": "Inserts into empty collection"}
  ]',
  15, 3,
  'Find matching index: `const idx = collection.findIndex(doc => Object.keys(filter).every(k => doc[k] === filter[k]))`. If idx >= 0, merge; else push new doc.',
  'Bona index ihuye: `const idx = collection.findIndex(doc => Object.keys(filter).every(k => doc[k] === filter[k]))`. Niba idx >= 0, huza; niba bitabaye, shyiramo inyandiko nshya.'
),
(
  '00000000-0500-0000-0000-000000000224',
  'Fix the Group-By',
  'Gukosora Group-By',
  'Fix `groupBy(docs, field)` that should group an array of objects by a field value. Currently it overwrites the group with each new item instead of pushing to an array.',
  'Gukosora `groupBy(docs, field)` igomba guhuza urutonde rw''ibintu ukoresheje agaciro k''igice. Ubu isubiranya itsinda na buri igice gishya aho gushyira muri urutonde.',
  'fix_bug', 'intermediate',
  'function groupBy(docs, field) {
  const groups = {};
  for (const doc of docs) {
    const key = doc[field];
    // BUG: overwrites instead of collecting into array
    groups[key] = doc;
  }
  return groups;
}

const students = [
  {name: "Alice", grade: "A"},
  {name: "Bob", grade: "B"},
  {name: "Carol", grade: "A"}
];
const result = groupBy(students, "grade");
console.log(result.A.length);',
  '',
  '[
    {"assertion": "groupBy([{k:''a''},{k:''a''},{k:''b''}],''k'').a.length === 2", "description": "Two items with key ''a'' are grouped together"},
    {"assertion": "groupBy([{k:''x''}],''k'').x.length === 1", "description": "Single item group has length 1"},
    {"assertion": "__output.includes(''2'')", "description": "Sample should log 2 for grade A group"}
  ]',
  10, 4,
  'Replace `groups[key] = doc` with: `if (!groups[key]) groups[key] = []; groups[key].push(doc);`',
  'Hindura `groups[key] = doc` na: `if (!groups[key]) groups[key] = []; groups[key].push(doc);`'
)
ON CONFLICT (set_id, order_index) DO NOTHING;

-- ─── GENQA501 LO2: Test Planning & Execution ──────────────────────────────────

INSERT INTO public.quiz_challenges
  (set_id, title, title_kin, description, description_kin, challenge_type, difficulty,
   starter_js, starter_html, test_cases, xp_reward, order_index, hint, hint_kin)
VALUES
(
  '00000000-0500-0000-0000-000000000227',
  'Write Unit Test Cases',
  'Gukora Ibibazo by''Unit Tests',
  'Write test cases for a `divide(a, b)` function. Create an array `testCases` where each item is `{input: [a, b], expected: number | "error"}`. Cover: normal division, division by zero (expected: "error"), negative numbers, and decimal results (round to 2 decimal places).',
  'Gukora ibibazo bya gerageza kuri imikorere `divide(a, b)`. Rema urutonde `testCases` aho buri kimwe ari `{input: [a, b], expected: number | "error"}`. Kwivuguruza: isesanzwe, isesanzure na zeru (biteganywa: "error"), imibare migufi, na ibisubizo bya decimali (wunganira kuri indangagaciro 2).',
  'write_scratch', 'intermediate',
  '// Write your testCases array here
// Each test case: { input: [a, b], expected: number | "error" }',
  '',
  '[
    {"assertion": "Array.isArray(testCases) && testCases.length >= 4", "description": "At least 4 test cases defined"},
    {"assertion": "testCases.some(tc => tc.input[1] === 0 && tc.expected === ''error'')", "description": "Has a division-by-zero test case"},
    {"assertion": "testCases.some(tc => tc.input[0] < 0 || tc.input[1] < 0)", "description": "Has a negative number test case"},
    {"assertion": "testCases.every(tc => Array.isArray(tc.input) && tc.input.length === 2)", "description": "All test cases have [a, b] input format"}
  ]',
  10, 1,
  'Include cases like: `{input:[10,2],expected:5}`, `{input:[7,0],expected:"error"}`, `{input:[-6,2],expected:-3}`, `{input:[1,3],expected:0.33}`.',
  'Shyiramo ibibazo nka: `{input:[10,2],expected:5}`, `{input:[7,0],expected:"error"}`, `{input:[-6,2],expected:-3}`, `{input:[1,3],expected:0.33}`.'
),
(
  '00000000-0500-0000-0000-000000000227',
  'Test Runner',
  'Gukoresha Gerageza',
  'Write `runTests(fn, testCases)` where `fn` is the function under test and each test case is `{input: any[], expected: any}`. Call `fn(...input)` and compare the result. Return `{passed: number, failed: number, results: Array<{input, expected, actual, pass}>}`.',
  'Andika `runTests(fn, testCases)` aho `fn` ari imikorere igengerwa kandi buri gibazo ni `{input: any[], expected: any}`. Hamagara `fn(...input)` kandi biguranye ibisubizo. Subiriza `{passed: number, failed: number, results: Array<{input, expected, actual, pass}>}`.',
  'write_scratch', 'intermediate',
  '// Write runTests(fn, testCases) here',
  '',
  '[
    {"assertion": "runTests(x => x * 2, [{input:[5],expected:10}]).passed === 1", "description": "Correct prediction counts as passed"},
    {"assertion": "runTests(x => x * 2, [{input:[5],expected:99}]).failed === 1", "description": "Wrong prediction counts as failed"},
    {"assertion": "runTests(x => x, [{input:[1],expected:1},{input:[2],expected:3}]).results.length === 2", "description": "Results array has one entry per test case"}
  ]',
  10, 2,
  'For each test: `const actual = fn(...tc.input); const pass = actual === tc.expected`. Collect results, count passed/failed.',
  'Kuri buri gerageza: `const actual = fn(...tc.input); const pass = actual === tc.expected`. Gukusanya ibisubizo, kubarura byashoboye/byanze.'
),
(
  '00000000-0500-0000-0000-000000000227',
  'Boundary Value Analysis',
  'Gusesengura Agaciro k''Ingufu',
  'Write test cases for `clamp(value, min, max)` using Boundary Value Analysis. Create `bvaCases` array covering: exact min, exact max, just inside min, just inside max, just outside min (error), just outside max (error), and a mid-range value.',
  'Gukora ibibazo bya gerageza kuri `clamp(value, min, max)` ukoresheje Boundary Value Analysis. Rema urutonde `bvaCases` kivuguruza: min nayo nayo, max nayo nayo, hafi nziza ya min, hafi nziza ya max, hafi hanze ya min (ikosa), hafi hanze ya max (ikosa), na agaciro hagati.',
  'write_scratch', 'intermediate',
  '// clamp(value, min, max) returns value clamped to [min, max]
// For example: clamp(5, 0, 10) => 5, clamp(-1, 0, 10) => 0, clamp(15, 0, 10) => 10

// Write bvaCases array: [{value, min, max, expected}]',
  '',
  '[
    {"assertion": "Array.isArray(bvaCases) && bvaCases.length >= 6", "description": "At least 6 boundary test cases"},
    {"assertion": "bvaCases.some(tc => tc.value === tc.min)", "description": "Has exact-min boundary case"},
    {"assertion": "bvaCases.some(tc => tc.value === tc.max)", "description": "Has exact-max boundary case"},
    {"assertion": "bvaCases.every(tc => ''expected'' in tc)", "description": "Every test case has an expected field"}
  ]',
  15, 3,
  'For `clamp(v, 0, 10)`: exact min `{value:0,min:0,max:10,expected:0}`, exact max `{value:10,...,expected:10}`, below min `{value:-1,...,expected:0}`, above max `{value:11,...,expected:10}`, mid `{value:5,...,expected:5}`.',
  'Kuri `clamp(v, 0, 10)`: min nayo `{value:0,min:0,max:10,expected:0}`, max nayo `{value:10,...,expected:10}`, munsi ya min `{value:-1,...,expected:0}`, hejuru ya max `{value:11,...,expected:10}`, hagati `{value:5,...,expected:5}`.'
),
(
  '00000000-0500-0000-0000-000000000227',
  'Fix the Test Assertion',
  'Gukosora Kwemeza kwa Gerageza',
  'Fix `assertEqual(actual, expected, message)`. It should throw an Error with the message if actual !== expected, and return true if they match. Currently it never throws even when values differ.',
  'Gukosora `assertEqual(actual, expected, message)`. Igomba gutanga Ikosa hamwe n''ubutumwa niba actual !== expected, kandi isubize true niba bihuye. Ubu ntiyigera itanga ikosa naho agaciro katahuye.',
  'fix_bug', 'advanced',
  'function assertEqual(actual, expected, message) {
  // BUG: condition is wrong — should throw when NOT equal
  if (actual === expected) {
    throw new Error(message || `Expected ${expected} but got ${actual}`);
  }
  return true;
}

try {
  assertEqual(5, 5, "Should not throw");
  console.log("PASS");
} catch (e) {
  console.log("FAIL: " + e.message);
}',
  '',
  '[
    {"assertion": "assertEqual(5, 5, ''msg'') === true", "description": "Equal values return true"},
    {"assertion": "(() => { try { assertEqual(1, 2, ''Not equal''); return false; } catch(e) { return e.message === ''Not equal''; } })()", "description": "Unequal values throw with correct message"},
    {"assertion": "__output.includes(''PASS'')", "description": "assertEqual(5, 5) should not throw, logging PASS"}
  ]',
  10, 4,
  'Change `if (actual === expected)` to `if (actual !== expected)`. The assertion should throw when values are NOT equal.',
  'Hindura `if (actual === expected)` na `if (actual !== expected)`. Kwemeza bigomba gutanga naho agaciro KATAHUYE.'
)
ON CONFLICT (set_id, order_index) DO NOTHING;

-- ─── SWDDT501 LO1: Server Configuration & Linux ────────────────────────────────

INSERT INTO public.quiz_challenges
  (set_id, title, title_kin, description, description_kin, challenge_type, difficulty,
   starter_js, starter_html, test_cases, xp_reward, order_index, hint, hint_kin)
VALUES
(
  '00000000-0500-0000-0000-000000000207',
  'Parse Linux Commands',
  'Gusoma Amategeko ya Linux',
  'Write `parseCommand(cmdString)` that parses a Linux command string into `{command: string, flags: string[], args: string[]}`. Flags start with `-` (single) or `--` (double dash). Example: `"ls -la /home/user"` → `{command:"ls", flags:["-la"], args:["/home/user"]}`.',
  'Andika `parseCommand(cmdString)` isoma string y''itegeko rya Linux ikahindura muri `{command: string, flags: string[], args: string[]}`. Flags zitangira na `-` (rimwe) cyangwa `--` (inzuzu ebyiri). Urugero: `"ls -la /home/user"` → `{command:"ls", flags:["-la"], args:["/home/user"]}`.',
  'write_scratch', 'intermediate',
  '// Write parseCommand(cmdString) here',
  '',
  '[
    {"assertion": "parseCommand(''ls -la /home'').command === ''ls''", "description": "First token is the command"},
    {"assertion": "parseCommand(''ls -la /home'').flags.includes(''-la'')", "description": "Flags are detected"},
    {"assertion": "parseCommand(''ls -la /home'').args.includes(''/home'')", "description": "Non-flag tokens are args"},
    {"assertion": "parseCommand(''ls'').flags.length === 0", "description": "Command with no flags has empty flags array"}
  ]',
  10, 1,
  'Split by spaces. First token is command. Remaining: if starts with "-", it''s a flag; otherwise it''s an arg.',
  'Tanya mu mwanya. Token ya mbere ni itegeko. Ibisigaye: niba ritangira na "-", ni flag; niba bitabaye, ni arg.'
),
(
  '00000000-0500-0000-0000-000000000207',
  'File Permission Parser',
  'Gusoma Uburenganzira bwa File',
  'Linux file permissions are displayed as strings like `"-rwxr-xr--"`. Write `parsePermissions(permStr)` that returns `{owner: {read,write,execute}, group: {read,write,execute}, other: {read,write,execute}}`.',
  'Uburenganzira bwa Linux buragaragazwa nk''strings nka `"-rwxr-xr--"`. Andika `parsePermissions(permStr)` isubiza `{owner: {read,write,execute}, group: {read,write,execute}, other: {read,write,execute}}`.',
  'write_scratch', 'intermediate',
  '// Write parsePermissions(permStr) here
// Format: type + owner(rwx) + group(rwx) + other(rwx)',
  '',
  '[
    {"assertion": "parsePermissions(''-rwxr-xr--'').owner.read === true", "description": "Owner has read permission"},
    {"assertion": "parsePermissions(''-rwxr-xr--'').owner.execute === true", "description": "Owner has execute permission"},
    {"assertion": "parsePermissions(''-rwxr-xr--'').other.write === false", "description": "Other has no write permission"},
    {"assertion": "parsePermissions(''-rwxr-xr--'').group.write === false", "description": "Group has no write permission"}
  ]',
  10, 2,
  'Skip position 0 (file type). Positions 1-3 = owner, 4-6 = group, 7-9 = other. Check each: `r` at pos 0 = read, `w` at pos 1 = write, `x` at pos 2 = execute.',
  'Siga aho 0 (ubwoko bwa file). Ahantu 1-3 = nyirabuja, 4-6 = itsinda, 7-9 = abandi. Suzuma buri kimwe: `r` aho 0 = gusoma, `w` aho 1 = kwandika, `x` aho 2 = gukoresha.'
),
(
  '00000000-0500-0000-0000-000000000207',
  'Process Monitor',
  'Gukurikirana Imikorere ya Sisitemu',
  'Write `getTopProcesses(processes, n)` where each process is `{pid, name, cpuPercent, memMB}`. Return the top `n` processes sorted by `cpuPercent` descending.',
  'Andika `getTopProcesses(processes, n)` aho buri ikoresha ari `{pid, name, cpuPercent, memMB}`. Subiriza `n` nkunda cyane ya imikorere y''isitemu itondetswe na `cpuPercent` ava munsi hejuru.',
  'write_scratch', 'intermediate',
  '// Write getTopProcesses(processes, n) here',
  '',
  '[
    {"assertion": "getTopProcesses([{pid:1,name:''a'',cpuPercent:30,memMB:100},{pid:2,name:''b'',cpuPercent:80,memMB:200}], 1)[0].name === ''b''", "description": "Highest CPU is first"},
    {"assertion": "getTopProcesses([{pid:1,cpuPercent:10},{pid:2,cpuPercent:20},{pid:3,cpuPercent:30}], 2).length === 2", "description": "Returns at most n processes"},
    {"assertion": "getTopProcesses([], 3).length === 0", "description": "Empty process list returns empty array"}
  ]',
  10, 3,
  'Sort by `cpuPercent` descending: `.sort((a,b) => b.cpuPercent - a.cpuPercent)`. Then `.slice(0, n)`.',
  'Tondeka na `cpuPercent` ava munsi hejuru: `.sort((a,b) => b.cpuPercent - a.cpuPercent)`. Hanyuma `.slice(0, n)`.'
),
(
  '00000000-0500-0000-0000-000000000207',
  'Cron Expression Parser',
  'Gusoma Ibisobanuro bya Cron',
  'Write `parseCron(expr)` that parses a 5-field cron expression like `"0 * * * *"` and returns `{minute, hour, day, month, weekday}` — each as a string. Validate that the expression has exactly 5 fields.',
  'Andika `parseCron(expr)` isoma ibisobanuro bya cron bifite inzego 5 nka `"0 * * * *"` kandi isubize `{minute, hour, day, month, weekday}` — buri kimwe nk''string. Suzuma ko ibisobanuro bifite nzego 5 nzima nzima.',
  'write_scratch', 'intermediate',
  '// Write parseCron(expr) here',
  '',
  '[
    {"assertion": "parseCron(''0 * * * *'').minute === ''0''", "description": "Minute field is parsed"},
    {"assertion": "parseCron(''30 6 * * 1'').weekday === ''1''", "description": "Weekday field is parsed"},
    {"assertion": "parseCron(''invalid'') === null", "description": "Invalid expression returns null"},
    {"assertion": "parseCron(''0 0 1 1 *'').month === ''1''", "description": "Month field is parsed"}
  ]',
  10, 4,
  'Split by spaces. If not exactly 5 parts, return null. Destructure: `const [minute, hour, day, month, weekday] = parts`.',
  'Tanya mu mwanya. Niba ntabwo ari ibice 5 nzima nzima, subiriza null. Vomora: `const [minute, hour, day, month, weekday] = parts`.'
)
ON CONFLICT (set_id, order_index) DO NOTHING;
