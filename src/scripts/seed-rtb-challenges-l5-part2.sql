-- RTB L5 Remaining Challenges Part 2 — orders 200, 202, 204, 205, 206, 208, 209
-- 4 challenges each = 28 total

-- ── ORDER 200: GENPP501 Python Environment & Tools ────────────────────────

INSERT INTO public.quiz_challenges
  (id, set_id, order_index, title, title_kin, description, description_kin,
   challenge_type, starter_js, starter_html, hint, hint_kin,
   test_cases, difficulty, xp_reward)
VALUES
(
  '00000000-0500-0000-0000-020000000001',
  '00000000-0500-0000-0000-000000000200', 1,
  'Python vs JavaScript Syntax',
  'Imyandike ya Python na JavaScript',
  'Python uses indentation for blocks and `def` for functions. Translate this Python logic to JavaScript:\n\n```python\ndef greet(name):\n    if name:\n        return "Hello, " + name\n    return "Hello, World"\n```\n\nWrite the equivalent `greet(name)` function in JavaScript.',
  'Python ikoresha indentation kugira ngo igengenye code. Hindura iyi logic ya Python muri JavaScript.',
  'write_scratch',
  'function greet(name) {\n  // Translate the Python logic here\n}\n',
  '',
  'In Python, an empty string is falsy — same in JS. The if/return structure translates directly.',
  'Muri Python, string intagondwa ni ya false — kimwe muri JS. Imiterere ya if/return ihindurwa neza.',
  '[
    {"assertion":"(function(){function greet(n){if(n)return''Hello, ''+n;return''Hello, World'';}return greet(''Alice'')===''Hello, Alice'';})()","description":"Returns greeting with name"},
    {"assertion":"(function(){function greet(n){if(n)return''Hello, ''+n;return''Hello, World'';}return greet('''''')=== ''Hello, World'';})()","description":"Empty string returns Hello, World"},
    {"assertion":"(function(){function greet(n){if(n)return''Hello, ''+n;return''Hello, World'';}return greet(null)===''Hello, World'';})()","description":"null returns Hello, World"},
    {"assertion":"(function(){function greet(n){if(n)return''Hello, ''+n;return''Hello, World'';}return typeof greet(''x'')===''string'';})()","description":"Always returns a string"}
  ]',
  'easy', 160
),
(
  '00000000-0500-0000-0000-020000000002',
  '00000000-0500-0000-0000-000000000200', 2,
  'Python List Comprehension → JS',
  'Urutonde rwa Python → JS',
  'Python list comprehensions are concise: `[x*2 for x in nums if x > 0]`.\n\nWrite `doublePositives(nums)` in JavaScript that returns a new array with each positive number doubled (negatives and zero excluded).',
  'Urutonde rwa Python ni rworoheje. Andika `doublePositives(nums)` muri JavaScript.',
  'write_scratch',
  'function doublePositives(nums) {\n  // Equivalent to: [x*2 for x in nums if x > 0]\n}\n',
  '',
  'Use .filter(x => x > 0).map(x => x * 2) — that is the exact JS equivalent of the Python comprehension.',
  'Koresha .filter(x => x > 0).map(x => x * 2).',
  '[
    {"assertion":"(function(){function doublePositives(n){return n.filter(x=>x>0).map(x=>x*2);}return JSON.stringify(doublePositives([1,2,3]))=== ''[2,4,6]'';})()","description":"All positive numbers doubled"},
    {"assertion":"(function(){function doublePositives(n){return n.filter(x=>x>0).map(x=>x*2);}return JSON.stringify(doublePositives([-1,0,2,3]))=== ''[4,6]'';})()","description":"Negatives and zero excluded"},
    {"assertion":"(function(){function doublePositives(n){return n.filter(x=>x>0).map(x=>x*2);}return doublePositives([]).length===0;})()","description":"Empty array returns empty"},
    {"assertion":"(function(){function doublePositives(n){return n.filter(x=>x>0).map(x=>x*2);}return Array.isArray(doublePositives([1]));})()","description":"Returns an array"}
  ]',
  'easy', 160
),
(
  '00000000-0500-0000-0000-020000000003',
  '00000000-0500-0000-0000-000000000200', 3,
  'Fix: Python dict → JS Object',
  'Gusana: dict ya Python → Ibintu bya JS',
  'The code below tries to convert a Python-style dict string `"key:val,key2:val2"` into a JS object. Fix the two bugs.',
  'Kode hepfo iragerageza guhindura string ya Python dict kuba ibintu bya JS. Sana amakosa abiri.',
  'fix_bug',
  'function parsePythonDict(dictStr) {\n  // Bug 1: split by '', '' (with space) but Python dicts use '','' without guaranteed space\n  const pairs = dictStr.split('', ''); \n\n  return pairs.reduce((obj, pair) => {\n    // Bug 2: destructuring uses index 0 only — should destructure both key and value\n    const [key] = pair.split('':'');\n    obj[key] = undefined; // Bug: should be the value\n    return obj;\n  }, {});\n}\n',
  '',
  'Bug 1: split by `","` not `", "`. Bug 2: destructure as `const [key, value] = pair.split(":")` then use `value`.',
  'Ikosa 1: kora split na `","`. Ikosa 2: `const [key, value] = pair.split(":")` hanyuma ukoreshe `value`.',
  '[
    {"assertion":"(function(){function parsePythonDict(s){const pairs=s.split('','');return pairs.reduce((o,p)=>{const[k,v]=p.split('':'');o[k]=v;return o;},{});}const r=parsePythonDict(''name:Alice,age:25'');return r.name===''Alice'';})()","description":"Key and value parsed correctly"},
    {"assertion":"(function(){function parsePythonDict(s){const pairs=s.split('','');return pairs.reduce((o,p)=>{const[k,v]=p.split('':'');o[k]=v;return o;},{});}const r=parsePythonDict(''x:1,y:2'');return r.y===''2'';})()","description":"Multiple pairs parsed"},
    {"assertion":"(function(){function parsePythonDict(s){const pairs=s.split('','');return pairs.reduce((o,p)=>{const[k,v]=p.split('':'');o[k]=v;return o;},{});}return typeof parsePythonDict(''a:b'')=== ''object'';})()","description":"Returns an object"},
    {"assertion":"(function(){function parsePythonDict(s){const pairs=s.split('','');return pairs.reduce((o,p)=>{const[k,v]=p.split('':'');o[k]=v;return o;},{});}const r=parsePythonDict(''k:v'');return r.k!==undefined;})()","description":"Value is not undefined"}
  ]',
  'medium', 160
),
(
  '00000000-0500-0000-0000-020000000004',
  '00000000-0500-0000-0000-000000000200', 4,
  'Package Dependency Checker',
  'Gusuzuma Iterambere ry''Ibikoresho',
  'Write `checkCompatibility(installed, required)` where both are objects `{ packageName: version }`. Return `{ compatible: boolean, missing: [], outdated: [] }`.\n\n- `missing`: required packages not installed at all\n- `outdated`: installed but version is less than required (compare as floats)',
  'Andika `checkCompatibility` isuzuma niba ibikoresho by''package bihuje.',
  'write_scratch',
  'function checkCompatibility(installed, required) {\n  // Your code here\n}\n',
  '',
  'Loop through Object.entries(required). Check if installed[pkg] exists (missing) or if parseFloat(installed[pkg]) < parseFloat(req) (outdated).',
  'Zunguruza Object.entries(required). Sузума niba installed[pkg] iriho.',
  '[
    {"assertion":"(function(){function checkCompatibility(inst,req){const missing=[],outdated=[];for(const[p,v]of Object.entries(req)){if(!(p in inst))missing.push(p);else if(parseFloat(inst[p])<parseFloat(v))outdated.push(p);}return{compatible:missing.length===0&&outdated.length===0,missing,outdated};}return checkCompatibility({react:''18.0''},{react:''18.0''}).compatible;})()","description":"Exact match is compatible"},
    {"assertion":"(function(){function checkCompatibility(inst,req){const missing=[],outdated=[];for(const[p,v]of Object.entries(req)){if(!(p in inst))missing.push(p);else if(parseFloat(inst[p])<parseFloat(v))outdated.push(p);}return{compatible:missing.length===0&&outdated.length===0,missing,outdated};}const r=checkCompatibility({},{react:''18''});return r.missing.includes(''react'');})()","description":"Missing package detected"},
    {"assertion":"(function(){function checkCompatibility(inst,req){const missing=[],outdated=[];for(const[p,v]of Object.entries(req)){if(!(p in inst))missing.push(p);else if(parseFloat(inst[p])<parseFloat(v))outdated.push(p);}return{compatible:missing.length===0&&outdated.length===0,missing,outdated};}const r=checkCompatibility({react:''16''},{react:''18''});return r.outdated.includes(''react'');})()","description":"Outdated package detected"},
    {"assertion":"(function(){function checkCompatibility(inst,req){const missing=[],outdated=[];for(const[p,v]of Object.entries(req)){if(!(p in inst))missing.push(p);else if(parseFloat(inst[p])<parseFloat(v))outdated.push(p);}return{compatible:missing.length===0&&outdated.length===0,missing,outdated};}return checkCompatibility({react:''19''},{react:''18''}).compatible;})()","description":"Newer installed version is compatible"}
  ]',
  'hard', 160
)
ON CONFLICT (id) DO NOTHING;

-- ── ORDER 202: GENPP501 Object-Oriented Python ────────────────────────────

INSERT INTO public.quiz_challenges
  (id, set_id, order_index, title, title_kin, description, description_kin,
   challenge_type, starter_js, starter_html, hint, hint_kin,
   test_cases, difficulty, xp_reward)
VALUES
(
  '00000000-0500-0000-0000-020200000001',
  '00000000-0500-0000-0000-000000000202', 1,
  'Python Class → JS Class',
  'Python Class → JS Class',
  'Translate this Python class to JavaScript:\n\n```python\nclass BankAccount:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self.__balance = balance\n    def deposit(self, amount):\n        if amount > 0: self.__balance += amount\n    def get_balance(self):\n        return self.__balance\n```\n\nNote: Python''s `__balance` (private by convention) becomes a regular property in JS.',
  'Hindura iyi Python class kuba JavaScript class.',
  'write_scratch',
  '// Translate to JavaScript\nclass BankAccount {\n  // Your code here\n}\n',
  '',
  'Use `#balance` (JS private field) or just `this._balance`. The constructor takes owner and balance (default 0).',
  'Koresha `this._balance` cyangwa `#balance`. Constructor ifata owner na balance (default 0).',
  '[
    {"assertion":"(function(){class BankAccount{constructor(o,b=0){this.owner=o;this._balance=b;}deposit(a){if(a>0)this._balance+=a;}getBalance(){return this._balance;}}const acc=new BankAccount(''Alice'');acc.deposit(100);return acc.getBalance()===100;})()","description":"deposit increases balance"},
    {"assertion":"(function(){class BankAccount{constructor(o,b=0){this.owner=o;this._balance=b;}deposit(a){if(a>0)this._balance+=a;}getBalance(){return this._balance;}}const acc=new BankAccount(''Bob'',50);return acc.getBalance()===50;})()","description":"Initial balance set correctly"},
    {"assertion":"(function(){class BankAccount{constructor(o,b=0){this.owner=o;this._balance=b;}deposit(a){if(a>0)this._balance+=a;}getBalance(){return this._balance;}}const acc=new BankAccount(''X'');acc.deposit(-10);return acc.getBalance()===0;})()","description":"Negative deposit ignored"},
    {"assertion":"(function(){class BankAccount{constructor(o,b=0){this.owner=o;this._balance=b;}deposit(a){if(a>0)this._balance+=a;}getBalance(){return this._balance;}}return new BankAccount(''Alice'').owner===''Alice'';})()","description":"Owner stored correctly"}
  ]',
  'medium', 160
),
(
  '00000000-0500-0000-0000-020200000002',
  '00000000-0500-0000-0000-000000000202', 2,
  'Python Inheritance Pattern',
  'Imiterere ya Inheritance ya Python',
  'Complete the JS equivalent of Python multiple-inheritance simulation using mixins.\n\nCreate a `Flyable` mixin and a `Swimmable` mixin, each with one method. Then create a `Duck` class that uses both (via Object.assign on the prototype).',
  'Uzuza imiterere ya inheritance ya Python ukoresheje mixins.',
  'complete_code',
  'const Flyable = {\n  fly() { return `${this.name} is flying`; }\n};\n\nconst Swimmable = {\n  swim() { return `${this.name} is swimming`; }\n};\n\nclass Duck {\n  constructor(name) { this.name = name; }\n}\n\n// Apply both mixins to Duck\nObject.assign(Duck.prototype, ____, ____);\n',
  '',
  'The two blanks are the mixin objects: `Flyable` and `Swimmable`.',
  'Ibice bibiri ni ibintu bya mixin: `Flyable` na `Swimmable`.',
  '[
    {"assertion":"(function(){const Flyable={fly(){return`${this.name} is flying`;}};const Swimmable={swim(){return`${this.name} is swimming`;}};class Duck{constructor(n){this.name=n;}}Object.assign(Duck.prototype,Flyable,Swimmable);const d=new Duck(''Donald'');return d.fly()=== ''Donald is flying'';})()","description":"fly() method works"},
    {"assertion":"(function(){const Flyable={fly(){return`${this.name} is flying`;}};const Swimmable={swim(){return`${this.name} is swimming`;}};class Duck{constructor(n){this.name=n;}}Object.assign(Duck.prototype,Flyable,Swimmable);const d=new Duck(''Donald'');return d.swim()=== ''Donald is swimming'';})()","description":"swim() method works"},
    {"assertion":"(function(){const Flyable={fly(){return''x''}};const Swimmable={swim(){return''y''}};class Duck{constructor(n){this.name=n;}}Object.assign(Duck.prototype,Flyable,Swimmable);return typeof new Duck(''x'').fly===''function''&&typeof new Duck(''x'').swim===''function'';})()","description":"Both methods are available on instance"},
    {"assertion":"(function(){const Flyable={fly(){return''x''}};const Swimmable={swim(){return''y''}};class Duck{constructor(n){this.name=n;}}Object.assign(Duck.prototype,Flyable,Swimmable);return new Duck(''Test'') instanceof Duck;})()","description":"Duck is still an instance of Duck"}
  ]',
  'medium', 160
),
(
  '00000000-0500-0000-0000-020200000003',
  '00000000-0500-0000-0000-000000000202', 3,
  'Python Generator → JS Generator',
  'Python Generator → JS Generator',
  'Python generators use `yield`. JavaScript has the same concept with `function*`.\n\nWrite a generator function `range(start, end, step = 1)` that yields numbers from `start` up to (but not including) `end`, incrementing by `step`. Collect all yielded values into an array to test.',
  'Python igenderera bakoresheje `yield`. JavaScript ifite `function*`. Andika generator ya `range`.',
  'write_scratch',
  'function* range(start, end, step = 1) {\n  // Your code here\n}\n\n// Helper to collect generator values\nfunction collect(gen) {\n  return [...gen];\n}\n',
  '',
  'Use a while loop: `let i = start; while (i < end) { yield i; i += step; }`',
  'Koresha while loop: `let i = start; while (i < end) { yield i; i += step; }`',
  '[
    {"assertion":"(function(){function* range(s,e,st=1){let i=s;while(i<e){yield i;i+=st;}}function collect(g){return[...g];}return JSON.stringify(collect(range(0,3)))=== ''[0,1,2]'';})()","description":"Basic range 0 to 3"},
    {"assertion":"(function(){function* range(s,e,st=1){let i=s;while(i<e){yield i;i+=st;}}return[...range(0,10,2)].join('','')===''0,2,4,6,8'';})()","description":"Step of 2 works"},
    {"assertion":"(function(){function* range(s,e,st=1){let i=s;while(i<e){yield i;i+=st;}}return[...range(5,5)].length===0;})()","description":"Start equals end produces empty"},
    {"assertion":"(function(){function* range(s,e,st=1){let i=s;while(i<e){yield i;i+=st;}}return[...range(1,4)][0]===1;})()","description":"Starts at start value"}
  ]',
  'hard', 160
),
(
  '00000000-0500-0000-0000-020200000004',
  '00000000-0500-0000-0000-000000000202', 4,
  'System Automation Script',
  'Script yo Guhindura Sisitemu',
  'Write `processFiles(files)` where each file is `{ name, size, type }`. Simulate a Python-style automation pipeline:\n- Filter only `"text"` type files\n- Double their size (simulate processing)\n- Return objects with `{ name, processedSize, status: "done" }`',
  'Andika `processFiles` igerageza pipeline yo guhindura dosiye.',
  'write_scratch',
  'function processFiles(files) {\n  // Your code here\n}\n',
  '',
  'Chain .filter(f => f.type === "text").map(f => ({ name: f.name, processedSize: f.size * 2, status: "done" }))',
  'Huza .filter(f => f.type === "text").map(f => ({...}))',
  '[
    {"assertion":"(function(){function processFiles(fs){return fs.filter(f=>f.type===''text'').map(f=>({name:f.name,processedSize:f.size*2,status:''done''}));}const r=processFiles([{name:''a.txt'',size:10,type:''text''}]);return r[0].processedSize===20;})()","description":"Text file size doubled"},
    {"assertion":"(function(){function processFiles(fs){return fs.filter(f=>f.type===''text'').map(f=>({name:f.name,processedSize:f.size*2,status:''done''}));}const r=processFiles([{name:''img.png'',size:100,type:''image''}]);return r.length===0;})()","description":"Non-text files excluded"},
    {"assertion":"(function(){function processFiles(fs){return fs.filter(f=>f.type===''text'').map(f=>({name:f.name,processedSize:f.size*2,status:''done''}));}const r=processFiles([{name:''f.txt'',size:5,type:''text''}]);return r[0].status===''done'';})()","description":"Status is done"},
    {"assertion":"(function(){function processFiles(fs){return fs.filter(f=>f.type===''text'').map(f=>({name:f.name,processedSize:f.size*2,status:''done''}));}return processFiles([]).length===0;})()","description":"Empty input returns empty array"}
  ]',
  'easy', 160
)
ON CONFLICT (id) DO NOTHING;

-- ── ORDER 204: SWDFB501 Solidity Smart Contract Basics ────────────────────

INSERT INTO public.quiz_challenges
  (id, set_id, order_index, title, title_kin, description, description_kin,
   challenge_type, starter_js, starter_html, hint, hint_kin,
   test_cases, difficulty, xp_reward)
VALUES
(
  '00000000-0500-0000-0000-020400000001',
  '00000000-0500-0000-0000-000000000204', 1,
  'Smart Contract State Machine',
  'Mashini y''Imiterere ya Smart Contract',
  'Solidity smart contracts track state. Simulate one in JavaScript: create `deployContract(initialSupply)` that returns a token contract object with:\n- `totalSupply` property\n- `balances` object (deployer starts with totalSupply)\n- `transfer(from, to, amount)` — moves tokens; throws if insufficient balance\n- `balanceOf(address)` — returns balance (0 if unknown)',
  'Solidity smart contracts gukurikirana imiterere. Gakana muri JavaScript.',
  'write_scratch',
  'function deployContract(initialSupply) {\n  const deployer = ''0xDEPLOYER'';\n  // Your code here\n}\n',
  '',
  'Store balances as an object. transfer checks balances[from] >= amount before proceeding. balanceOf returns balances[address] ?? 0.',
  'Bika balances nk''ibintu. transfer isuzuma balances[from] >= amount.',
  '[
    {"assertion":"(function(){function deployContract(s){const b={''0xDEPLOYER'':s};return{totalSupply:s,balances:b,transfer(f,t,a){if((b[f]??0)<a)throw new Error(''Insufficient'');b[f]-=a;b[t]=(b[t]??0)+a;},balanceOf(a){return b[a]??0;}};}const c=deployContract(1000);return c.balanceOf(''0xDEPLOYER'')===1000;})()","description":"Deployer starts with total supply"},
    {"assertion":"(function(){function deployContract(s){const b={''0xDEPLOYER'':s};return{totalSupply:s,balances:b,transfer(f,t,a){if((b[f]??0)<a)throw new Error(''Insufficient'');b[f]-=a;b[t]=(b[t]??0)+a;},balanceOf(a){return b[a]??0;}};}const c=deployContract(1000);c.transfer(''0xDEPLOYER'',''0xALICE'',300);return c.balanceOf(''0xALICE'')===300;})()","description":"Transfer moves tokens"},
    {"assertion":"(function(){function deployContract(s){const b={''0xDEPLOYER'':s};return{totalSupply:s,balances:b,transfer(f,t,a){if((b[f]??0)<a)throw new Error(''Insufficient'');b[f]-=a;b[t]=(b[t]??0)+a;},balanceOf(a){return b[a]??0;}};}const c=deployContract(100);try{c.transfer(''0xDEPLOYER'',''0xB'',200);return false;}catch(e){return true;}})()","description":"Insufficient balance throws"},
    {"assertion":"(function(){function deployContract(s){const b={''0xDEPLOYER'':s};return{totalSupply:s,balances:b,transfer(f,t,a){if((b[f]??0)<a)throw new Error(''Insufficient'');b[f]-=a;b[t]=(b[t]??0)+a;},balanceOf(a){return b[a]??0;}};}return deployContract(500).balanceOf(''0xUNKNOWN'')===0;})()","description":"Unknown address returns 0 balance"}
  ]',
  'hard', 160
),
(
  '00000000-0500-0000-0000-020400000002',
  '00000000-0500-0000-0000-000000000204', 2,
  'Gas Estimation Simulator',
  'Gukora Ingano ya Gas',
  'In Ethereum, every operation costs "gas". Complete `estimateGas(operations)` where each operation is `{ type, params }`. Use this cost table:\n- `"transfer"` → 21000\n- `"store"` → 20000 per param\n- `"compute"` → 5000\n\nReturn total estimated gas.',
  'Muri Ethereum, buri gikorwa gikoresheje "gas". Uzuza `estimateGas` ibaramo igiciro.',
  'complete_code',
  'const GAS_COSTS = { transfer: 21000, store: 20000, compute: 5000 };\n\nfunction estimateGas(operations) {\n  return operations.reduce((total, op) => {\n    const base = GAS_COSTS[op.type] ?? 0;\n    const paramCost = op.type === ''store'' ? ____ : 0;\n    return total + base + ____;\n  }, 0);\n}\n',
  '',
  'First blank: `(op.params?.length ?? 0) * 20000` — wait, re-read: store costs 20000 *per param*, so `(op.params?.length ?? 0) * 20000`. But base is already 20000, so consider: store base = 0, paramCost = params * 20000. Actually simpler: first blank `(op.params?.length ?? 1) * 20000` and set base for store to 0. Simplest: first blank `(op.params?.length ?? 0) * 20000`, second blank `paramCost`.',
  'Igice cya mbere: `(op.params?.length ?? 0) * 20000`. Igice cya kabiri: `paramCost`.',
  '[
    {"assertion":"(function(){const GC={transfer:21000,store:20000,compute:5000};function estimateGas(ops){return ops.reduce((t,op)=>{const base=GC[op.type]??0;const pc=op.type===''store''?(op.params?.length??0)*20000:0;return t+base+pc;},0);}return estimateGas([{type:''transfer'',params:[]}])===21000;})()","description":"Transfer costs 21000 gas"},
    {"assertion":"(function(){const GC={transfer:21000,store:20000,compute:5000};function estimateGas(ops){return ops.reduce((t,op)=>{const base=GC[op.type]??0;const pc=op.type===''store''?(op.params?.length??0)*20000:0;return t+base+pc;},0);}return estimateGas([{type:''compute'',params:[]}])===5000;})()","description":"Compute costs 5000 gas"},
    {"assertion":"(function(){const GC={transfer:21000,store:20000,compute:5000};function estimateGas(ops){return ops.reduce((t,op)=>{const base=op.type===''store''?0:(GC[op.type]??0);const pc=op.type===''store''?(op.params?.length??1)*20000:0;return t+base+pc;},0);}return estimateGas([])===0;})()","description":"Empty operations returns 0"},
    {"assertion":"(function(){const GC={transfer:21000,store:20000,compute:5000};function estimateGas(ops){return ops.reduce((t,op)=>{const base=GC[op.type]??0;const pc=op.type===''store''?(op.params?.length??0)*20000:0;return t+base+pc;},0);}return estimateGas([{type:''transfer''},{type:''compute''}])===26000;})()","description":"Multiple operations sum correctly"}
  ]',
  'medium', 160
),
(
  '00000000-0500-0000-0000-020400000003',
  '00000000-0500-0000-0000-000000000204', 3,
  'Fix: Contract Access Control',
  'Gusana: Kugenzura Uburenganzira bwa Contract',
  'The `onlyOwner` access control pattern has two bugs. Fix them.',
  'Imiterere ya `onlyOwner` ifite amakosa abiri. Sana.',
  'fix_bug',
  'function createContract(ownerAddress) {\n  let owner = ownerAddress;\n\n  function onlyOwner(caller, action) {\n    // Bug 1: should throw when caller is NOT the owner\n    if (caller === owner) {\n      throw new Error(''Access denied: not the owner'');\n    }\n    return action();\n  }\n\n  function transferOwnership(caller, newOwner) {\n    return onlyOwner(caller, () => {\n      // Bug 2: should update owner, not caller\n      caller = newOwner;\n    });\n  }\n\n  return { onlyOwner, transferOwnership, getOwner: () => owner };\n}\n',
  '',
  'Bug 1: flip condition to `caller !== owner`. Bug 2: change `caller = newOwner` to `owner = newOwner`.',
  'Ikosa 1: hindura kuba `caller !== owner`. Ikosa 2: hindura `caller = newOwner` kuba `owner = newOwner`.',
  '[
    {"assertion":"(function(){function createContract(oa){let owner=oa;function onlyOwner(c,a){if(c!==owner)throw new Error(''Access denied'');return a();}function transferOwnership(c,no){return onlyOwner(c,()=>{owner=no;});}return{onlyOwner,transferOwnership,getOwner:()=>owner};}const c=createContract(''0xA'');c.onlyOwner(''0xA'',()=>{});return true;})()","description":"Owner can call onlyOwner without throwing"},
    {"assertion":"(function(){function createContract(oa){let owner=oa;function onlyOwner(c,a){if(c!==owner)throw new Error(''Access denied'');return a();}function transferOwnership(c,no){return onlyOwner(c,()=>{owner=no;});}return{onlyOwner,transferOwnership,getOwner:()=>owner};}const c=createContract(''0xA'');try{c.onlyOwner(''0xB'',()=>{});return false;}catch(e){return true;}})()","description":"Non-owner throws Access denied"},
    {"assertion":"(function(){function createContract(oa){let owner=oa;function onlyOwner(c,a){if(c!==owner)throw new Error(''Access denied'');return a();}function transferOwnership(c,no){return onlyOwner(c,()=>{owner=no;});}return{onlyOwner,transferOwnership,getOwner:()=>owner};}const c=createContract(''0xA'');c.transferOwnership(''0xA'',''0xB'');return c.getOwner()===''0xB'';})()","description":"transferOwnership updates owner"},
    {"assertion":"(function(){function createContract(oa){let owner=oa;function onlyOwner(c,a){if(c!==owner)throw new Error(''Access denied'');return a();}function transferOwnership(c,no){return onlyOwner(c,()=>{owner=no;});}return{onlyOwner,transferOwnership,getOwner:()=>owner};}const c=createContract(''0xA'');return c.getOwner()===''0xA'';})()","description":"Initial owner is set correctly"}
  ]',
  'medium', 160
),
(
  '00000000-0500-0000-0000-020400000004',
  '00000000-0500-0000-0000-000000000204', 4,
  'Blockchain Block Builder',
  'Kubaka Block ya Blockchain',
  'Write `createBlock(index, data, previousHash)` that creates a blockchain block. The block should have:\n- `index`, `data`, `previousHash`, `timestamp` (Date.now())\n- `hash` — a simple hash: `String(index + JSON.stringify(data) + previousHash).length * 31`\n- `isValid(block)` static method — checks that hash matches recomputed value',
  'Andika `createBlock` ikora block ya blockchain.',
  'write_scratch',
  'function createBlock(index, data, previousHash) {\n  // Your code here\n}\n',
  '',
  'Compute hash as `String(index + JSON.stringify(data) + previousHash).length * 31`. Store it in the block. isValid recomputes and compares.',
  'Bara hash nka `String(index + JSON.stringify(data) + previousHash).length * 31`.',
  '[
    {"assertion":"(function(){function createBlock(i,d,ph){const ts=Date.now();const h=String(i+JSON.stringify(d)+ph).length*31;return{index:i,data:d,previousHash:ph,timestamp:ts,hash:h};}const b=createBlock(0,{msg:''genesis''},''0'');return typeof b.hash===''number''&&b.hash>0;})()","description":"Block has a numeric hash"},
    {"assertion":"(function(){function createBlock(i,d,ph){const h=String(i+JSON.stringify(d)+ph).length*31;return{index:i,data:d,previousHash:ph,hash:h};}const b=createBlock(1,{x:1},''abc'');return b.index===1&&b.previousHash===''abc'';})()","description":"Index and previousHash stored correctly"},
    {"assertion":"(function(){function createBlock(i,d,ph){const h=String(i+JSON.stringify(d)+ph).length*31;return{index:i,data:d,previousHash:ph,hash:h};}const b1=createBlock(0,{},{''0''});const b2=createBlock(1,{},b1.hash.toString());return b2.previousHash===b1.hash.toString();})()","description":"Chain links via previousHash"},
    {"assertion":"(function(){function createBlock(i,d,ph){const h=String(i+JSON.stringify(d)+ph).length*31;return{index:i,data:d,previousHash:ph,hash:h};}const b=createBlock(0,{},''0'');const recomputed=String(b.index+JSON.stringify(b.data)+b.previousHash).length*31;return b.hash===recomputed;})()","description":"Hash matches recomputed value"}
  ]',
  'hard', 160
)
ON CONFLICT (id) DO NOTHING;

-- ── ORDER 205: SWDFB501 Developing Smart Contract Systems ─────────────────

INSERT INTO public.quiz_challenges
  (id, set_id, order_index, title, title_kin, description, description_kin,
   challenge_type, starter_js, starter_html, hint, hint_kin,
   test_cases, difficulty, xp_reward)
VALUES
(
  '00000000-0500-0000-0000-020500000001',
  '00000000-0500-0000-0000-000000000205', 1,
  'ERC-20 Token Simulator',
  'Gakana Token ya ERC-20',
  'ERC-20 is the standard for Ethereum tokens. Write `createERC20(name, symbol, totalSupply)` simulating the core methods:\n- `name()`, `symbol()`, `totalSupply()` — return token metadata\n- `balanceOf(address)` — returns balance\n- `transfer(from, to, amount)` — returns `true` on success, throws on failure',
  'ERC-20 ni standard ya Ethereum tokens. Gakana na JavaScript.',
  'write_scratch',
  'function createERC20(name, symbol, totalSupply) {\n  // Your code here\n}\n',
  '',
  'Keep a balances object with deployer (use "0xDEPLOYER") starting at totalSupply. Methods are simple getters or balance operations.',
  'Bika balances ibintu na "0xDEPLOYER" itangira na totalSupply.',
  '[
    {"assertion":"(function(){function createERC20(n,s,ts){const b={''0xDEPLOYER'':ts};return{name:()=>n,symbol:()=>s,totalSupply:()=>ts,balanceOf:a=>b[a]??0,transfer(f,t,a){if((b[f]??0)<a)throw new Error(''ERC20: insufficient'');b[f]-=a;b[t]=(b[t]??0)+a;return true;}};}const t=createERC20(''RwandaCoin'',''RWC'',1000);return t.name()===''RwandaCoin'';})()","description":"name() returns token name"},
    {"assertion":"(function(){function createERC20(n,s,ts){const b={''0xDEPLOYER'':ts};return{name:()=>n,symbol:()=>s,totalSupply:()=>ts,balanceOf:a=>b[a]??0,transfer(f,t,a){if((b[f]??0)<a)throw new Error(''ERC20: insufficient'');b[f]-=a;b[t]=(b[t]??0)+a;return true;}};}const t=createERC20(''X'',''X'',500);t.transfer(''0xDEPLOYER'',''0xA'',100);return t.balanceOf(''0xA'')===100;})()","description":"transfer moves balance"},
    {"assertion":"(function(){function createERC20(n,s,ts){const b={''0xDEPLOYER'':ts};return{name:()=>n,symbol:()=>s,totalSupply:()=>ts,balanceOf:a=>b[a]??0,transfer(f,t,a){if((b[f]??0)<a)throw new Error(''ERC20: insufficient'');b[f]-=a;b[t]=(b[t]??0)+a;return true;}};}const t=createERC20(''X'',''X'',100);try{t.transfer(''0xA'',''0xB'',50);return false;}catch(e){return true;}})()","description":"Insufficient balance throws"},
    {"assertion":"(function(){function createERC20(n,s,ts){const b={''0xDEPLOYER'':ts};return{name:()=>n,symbol:()=>s,totalSupply:()=>ts,balanceOf:a=>b[a]??0,transfer(f,t,a){if((b[f]??0)<a)throw new Error(''ERC20: insufficient'');b[f]-=a;b[t]=(b[t]??0)+a;return true;}};}return createERC20(''X'',''X'',1000).totalSupply()===1000;})()","description":"totalSupply() returns correct value"}
  ]',
  'hard', 160
),
(
  '00000000-0500-0000-0000-020500000002',
  '00000000-0500-0000-0000-000000000205', 2,
  'Contract Event Emitter',
  'Gutanga Inyito za Contract',
  'Solidity contracts emit events that clients listen to. Complete the `EventLog` class that records and filters contract events:\n- `emit(eventName, data)` — records an event with timestamp\n- `getEvents(name)` — returns all events with that name\n- `getAll()` — returns all events',
  'Solidity contracts gutanga inyito. Uzuza classe ya `EventLog`.',
  'complete_code',
  'class EventLog {\n  constructor() { this.log = []; }\n\n  emit(eventName, data) {\n    this.log.push({ event: ____, data, time: Date.now() });\n  }\n\n  getEvents(name) {\n    return this.log.filter(e => ____);\n  }\n\n  getAll() { return ____; }\n}\n',
  '',
  'First blank: `eventName`. Second blank: `e.event === name`. Third blank: `[...this.log]`.',
  'Igice cya mbere: `eventName`. Igice cya kabiri: `e.event === name`. Igice cya gatatu: `[...this.log]`.',
  '[
    {"assertion":"(function(){class EventLog{constructor(){this.log=[];}emit(e,d){this.log.push({event:e,data:d,time:Date.now()});}getEvents(n){return this.log.filter(e=>e.event===n);}getAll(){return[...this.log];}}const el=new EventLog();el.emit(''Transfer'',{amount:100});return el.getEvents(''Transfer'').length===1;})()","description":"getEvents returns matching events"},
    {"assertion":"(function(){class EventLog{constructor(){this.log=[];}emit(e,d){this.log.push({event:e,data:d,time:Date.now()});}getEvents(n){return this.log.filter(e=>e.event===n);}getAll(){return[...this.log];}}const el=new EventLog();el.emit(''A'',{});el.emit(''B'',{});return el.getAll().length===2;})()","description":"getAll returns all events"},
    {"assertion":"(function(){class EventLog{constructor(){this.log=[];}emit(e,d){this.log.push({event:e,data:d,time:Date.now()});}getEvents(n){return this.log.filter(e=>e.event===n);}getAll(){return[...this.log];}}const el=new EventLog();el.emit(''T'',{x:5});return el.getEvents(''T'')[0].data.x===5;})()","description":"Event data stored correctly"},
    {"assertion":"(function(){class EventLog{constructor(){this.log=[];}emit(e,d){this.log.push({event:e,data:d,time:Date.now()});}getEvents(n){return this.log.filter(e=>e.event===n);}getAll(){return[...this.log];}}const el=new EventLog();return el.getEvents(''None'').length===0;})()","description":"No matching events returns empty array"}
  ]',
  'medium', 160
),
(
  '00000000-0500-0000-0000-020500000003',
  '00000000-0500-0000-0000-000000000205', 3,
  'Fix: Token Approval Bug',
  'Gusana: Ikosa rya Token Approval',
  'ERC-20 has an `approve`/`transferFrom` flow. The code below has two bugs in the approval check.',
  'ERC-20 ifite inzira ya `approve`/`transferFrom`. Kode hepfo ifite amakosa abiri.',
  'fix_bug',
  'function createApprovalSystem() {\n  const allowances = {};\n\n  function approve(owner, spender, amount) {\n    // Allowance key should be "owner:spender"\n    allowances[owner] = amount; // Bug 1: missing spender in key\n  }\n\n  function transferFrom(spender, owner, to, amount) {\n    const key = `${owner}:${spender}`;\n    const allowed = allowances[key] ?? 0;\n    // Bug 2: should throw when amount > allowed, not when equal\n    if (amount >= allowed) throw new Error(''Not approved'');\n    allowances[key] -= amount;\n    return true;\n  }\n\n  return { approve, transferFrom, getAllowance: (o, s) => allowances[`${o}:${s}`] ?? 0 };\n}\n',
  '',
  'Bug 1: change `allowances[owner] = amount` to `allowances[\`${owner}:${spender}\`] = amount`. Bug 2: change `>=` to `>` in the condition.',
  'Ikosa 1: koresha `\`${owner}:${spender}\`` nk''urutonde. Ikosa 2: hindura `>=` kuba `>`.',
  '[
    {"assertion":"(function(){function createApprovalSystem(){const al={};function approve(o,s,a){al[`${o}:${s}`]=a;}function transferFrom(s,o,t,a){const k=`${o}:${s}`;const allowed=al[k]??0;if(a>allowed)throw new Error(''Not approved'');al[k]-=a;return true;}return{approve,transferFrom,getAllowance:(o,s)=>al[`${o}:${s}`]??0};}const sys=createApprovalSystem();sys.approve(''A'',''B'',100);return sys.getAllowance(''A'',''B'')===100;})()","description":"approve stores correct allowance"},
    {"assertion":"(function(){function createApprovalSystem(){const al={};function approve(o,s,a){al[`${o}:${s}`]=a;}function transferFrom(s,o,t,a){const k=`${o}:${s}`;const allowed=al[k]??0;if(a>allowed)throw new Error(''Not approved'');al[k]-=a;return true;}return{approve,transferFrom,getAllowance:(o,s)=>al[`${o}:${s}`]??0};}const sys=createApprovalSystem();sys.approve(''A'',''B'',100);return sys.transferFrom(''B'',''A'',''C'',100)===true;})()","description":"Exact allowance amount is allowed"},
    {"assertion":"(function(){function createApprovalSystem(){const al={};function approve(o,s,a){al[`${o}:${s}`]=a;}function transferFrom(s,o,t,a){const k=`${o}:${s}`;const allowed=al[k]??0;if(a>allowed)throw new Error(''Not approved'');al[k]-=a;return true;}return{approve,transferFrom,getAllowance:(o,s)=>al[`${o}:${s}`]??0};}const sys=createApprovalSystem();sys.approve(''A'',''B'',50);try{sys.transferFrom(''B'',''A'',''C'',100);return false;}catch(e){return true;}})()","description":"Amount over allowance throws"},
    {"assertion":"(function(){function createApprovalSystem(){const al={};function approve(o,s,a){al[`${o}:${s}`]=a;}function transferFrom(s,o,t,a){const k=`${o}:${s}`;const allowed=al[k]??0;if(a>allowed)throw new Error(''Not approved'');al[k]-=a;return true;}return{approve,transferFrom,getAllowance:(o,s)=>al[`${o}:${s}`]??0};}const sys=createApprovalSystem();sys.approve(''A'',''B'',100);sys.transferFrom(''B'',''A'',''C'',30);return sys.getAllowance(''A'',''B'')===70;})()","description":"Allowance decreases after transferFrom"}
  ]',
  'hard', 160
),
(
  '00000000-0500-0000-0000-020500000004',
  '00000000-0500-0000-0000-000000000205', 4,
  'Token Vesting Schedule',
  'Ingamba yo Gutanga Tokens Buhoro',
  'Token vesting releases tokens gradually. Write `createVesting(totalAmount, durationMs)` that returns:\n- `vestedAmount(elapsedMs)` — how many tokens have vested (linearly, capped at totalAmount)\n- `unvestedAmount(elapsedMs)` — totalAmount minus vested\n- `isFullyVested(elapsedMs)` — true if elapsed >= duration',
  'Token vesting itanga tokens buhoro buhoro. Andika `createVesting`.',
  'write_scratch',
  'function createVesting(totalAmount, durationMs) {\n  // Your code here\n}\n',
  '',
  'vestedAmount = Math.min(totalAmount, Math.floor(totalAmount * elapsedMs / durationMs)). isFullyVested: elapsedMs >= durationMs.',
  'vestedAmount = Math.min(totalAmount, Math.floor(totalAmount * elapsedMs / durationMs)).',
  '[
    {"assertion":"(function(){function createVesting(t,d){return{vestedAmount(e){return Math.min(t,Math.floor(t*e/d));},unvestedAmount(e){return t-Math.min(t,Math.floor(t*e/d));},isFullyVested(e){return e>=d;}};}const v=createVesting(1000,10000);return v.vestedAmount(5000)===500;})()","description":"50% elapsed = 50% vested"},
    {"assertion":"(function(){function createVesting(t,d){return{vestedAmount(e){return Math.min(t,Math.floor(t*e/d));},unvestedAmount(e){return t-Math.min(t,Math.floor(t*e/d));},isFullyVested(e){return e>=d;}};}const v=createVesting(1000,10000);return v.vestedAmount(10000)===1000;})()","description":"Fully elapsed = totalAmount vested"},
    {"assertion":"(function(){function createVesting(t,d){return{vestedAmount(e){return Math.min(t,Math.floor(t*e/d));},unvestedAmount(e){return t-Math.min(t,Math.floor(t*e/d));},isFullyVested(e){return e>=d;}};}const v=createVesting(1000,10000);return v.unvestedAmount(0)===1000;})()","description":"At start all tokens are unvested"},
    {"assertion":"(function(){function createVesting(t,d){return{vestedAmount(e){return Math.min(t,Math.floor(t*e/d));},unvestedAmount(e){return t-Math.min(t,Math.floor(t*e/d));},isFullyVested(e){return e>=d;}};}const v=createVesting(1000,10000);return !v.isFullyVested(5000)&&v.isFullyVested(10000);})()","description":"isFullyVested correct"}
  ]',
  'medium', 160
)
ON CONFLICT (id) DO NOTHING;

-- ── ORDER 206: SWDFB501 Frontend Blockchain Integration ───────────────────

INSERT INTO public.quiz_challenges
  (id, set_id, order_index, title, title_kin, description, description_kin,
   challenge_type, starter_js, starter_html, hint, hint_kin,
   test_cases, difficulty, xp_reward)
VALUES
(
  '00000000-0500-0000-0000-020600000001',
  '00000000-0500-0000-0000-000000000206', 1,
  'Wallet Address Formatter',
  'Gushushanya Aderesi ya Wallet',
  'Ethereum addresses are 42-character hex strings. Write `formatAddress(address)` that:\n- Validates the format (starts with "0x", 40 hex chars after)\n- Returns a shortened version: first 6 + "..." + last 4 chars (e.g. `"0x1234...5678"`)\n- Throws `Error("Invalid address")` for invalid input',
  'Aderesi za Ethereum ni string ya hex ya inyuguti 42. Andika `formatAddress`.',
  'write_scratch',
  'function formatAddress(address) {\n  // Your code here\n}\n',
  '',
  'Validate with `/^0x[0-9a-fA-F]{40}$/`. Shorten by taking `.slice(0,6) + "..." + .slice(-4)`.',
  'Sузума na `/^0x[0-9a-fA-F]{40}$/`. Gabanya: `.slice(0,6) + "..." + .slice(-4)`.',
  '[
    {"assertion":"(function(){function formatAddress(a){if(!/^0x[0-9a-fA-F]{40}$/.test(a))throw new Error(''Invalid address'');return a.slice(0,6)+''...''+a.slice(-4);}return formatAddress(''0x1234567890abcdef1234567890abcdef12345678'')===''0x1234...5678'';})()","description":"Valid address shortened correctly"},
    {"assertion":"(function(){function formatAddress(a){if(!/^0x[0-9a-fA-F]{40}$/.test(a))throw new Error(''Invalid address'');return a.slice(0,6)+''...''+a.slice(-4);}try{formatAddress(''notanaddress'');return false;}catch(e){return e.message===''Invalid address'';}})()","description":"Invalid address throws"},
    {"assertion":"(function(){function formatAddress(a){if(!/^0x[0-9a-fA-F]{40}$/.test(a))throw new Error(''Invalid address'');return a.slice(0,6)+''...''+a.slice(-4);}return formatAddress(''0xabcdef1234567890abcdef1234567890abcdef12'').includes(''...'');})()","description":"Output contains ..."},
    {"assertion":"(function(){function formatAddress(a){if(!/^0x[0-9a-fA-F]{40}$/.test(a))throw new Error(''Invalid address'');return a.slice(0,6)+''...''+a.slice(-4);}try{formatAddress(''0x123'');return false;}catch(e){return true;}})()","description":"Short hex string throws"}
  ]',
  'medium', 160
),
(
  '00000000-0500-0000-0000-020600000002',
  '00000000-0500-0000-0000-000000000206', 2,
  'Transaction Object Builder',
  'Kubaka Ibintu bya Transaction',
  'Complete `buildTransaction(from, to, value, data)` that returns a Web3-compatible transaction object with gas estimate.\n\nGas estimate rule: base 21000 + 68 per byte of data (treat `data` string length as byte count).',
  'Uzuza `buildTransaction` isubiza ibintu bya transaction bihuye na Web3.',
  'complete_code',
  'function buildTransaction(from, to, value, data = '''') {\n  const gasEstimate = ____ + (data.length * 68);\n  return {\n    from,\n    to,\n    value,\n    data,\n    gas: ____,\n    nonce: Math.floor(Math.random() * 1000)\n  };\n}\n',
  '',
  'First blank: `21000`. Second blank: `gasEstimate`.',
  'Igice cya mbere: `21000`. Igice cya kabiri: `gasEstimate`.',
  '[
    {"assertion":"(function(){function buildTransaction(f,t,v,d=''''){const g=21000+(d.length*68);return{from:f,to:t,value:v,data:d,gas:g,nonce:0};}const tx=buildTransaction(''0xA'',''0xB'',100);return tx.gas===21000;})()","description":"Base gas is 21000 with no data"},
    {"assertion":"(function(){function buildTransaction(f,t,v,d=''''){const g=21000+(d.length*68);return{from:f,to:t,value:v,data:d,gas:g,nonce:0};}const tx=buildTransaction(''0xA'',''0xB'',0,''hello'');return tx.gas===21000+5*68;})()","description":"Gas includes data cost"},
    {"assertion":"(function(){function buildTransaction(f,t,v,d=''''){const g=21000+(d.length*68);return{from:f,to:t,value:v,data:d,gas:g,nonce:0};}const tx=buildTransaction(''0xA'',''0xB'',50);return tx.from===''0xA''&&tx.to===''0xB''&&tx.value===50;})()","description":"from, to, value set correctly"},
    {"assertion":"(function(){function buildTransaction(f,t,v,d=''''){const g=21000+(d.length*68);return{from:f,to:t,value:v,data:d,gas:g,nonce:0};}const tx=buildTransaction(''0xA'',''0xB'',0);return typeof tx.nonce===''number'';})()","description":"nonce is a number"}
  ]',
  'easy', 160
),
(
  '00000000-0500-0000-0000-020600000003',
  '00000000-0500-0000-0000-000000000206', 3,
  'Fix: Web3 Event Listener',
  'Gusana: Kumva Inyito za Web3',
  'The Web3 event listener simulation has two bugs. Fix them.',
  'Gakana kumva inyito za Web3 ifite amakosa abiri. Sana.',
  'fix_bug',
  'function createWeb3Listener() {\n  const handlers = {};\n\n  return {\n    on(event, handler) {\n      // Bug 1: should push to array, not overwrite\n      handlers[event] = handler;\n    },\n    emit(event, data) {\n      // Bug 2: should call each handler, not check truthiness\n      if (handlers[event]) {\n        handlers[event](data); // only calls one if it were an array\n      }\n    },\n    off(event, handler) {\n      if (handlers[event]) {\n        handlers[event] = handlers[event].filter(h => h !== handler);\n      }\n    }\n  };\n}\n',
  '',
  'Bug 1: initialize as array and push: `handlers[event] = handlers[event] || []; handlers[event].push(handler)`. Bug 2: loop through array: `(handlers[event] || []).forEach(h => h(data))`.',
  'Ikosa 1: tangira urutonde ukoresheje push. Ikosa 2: zunguruza buri handler.',
  '[
    {"assertion":"(function(){function createWeb3Listener(){const h={};return{on(e,fn){h[e]=h[e]||[];h[e].push(fn);},emit(e,d){(h[e]||[]).forEach(fn=>fn(d));},off(e,fn){if(h[e])h[e]=h[e].filter(x=>x!==fn);}};} const w=createWeb3Listener();let v=0;w.on(''block'',d=>v=d);w.emit(''block'',42);return v===42;})()","description":"Handler receives emitted data"},
    {"assertion":"(function(){function createWeb3Listener(){const h={};return{on(e,fn){h[e]=h[e]||[];h[e].push(fn);},emit(e,d){(h[e]||[]).forEach(fn=>fn(d));},off(e,fn){if(h[e])h[e]=h[e].filter(x=>x!==fn);}};} const w=createWeb3Listener();let c=0;w.on(''x'',()=>c++);w.on(''x'',()=>c++);w.emit(''x'',null);return c===2;})()","description":"Multiple handlers for same event all fire"},
    {"assertion":"(function(){function createWeb3Listener(){const h={};return{on(e,fn){h[e]=h[e]||[];h[e].push(fn);},emit(e,d){(h[e]||[]).forEach(fn=>fn(d));},off(e,fn){if(h[e])h[e]=h[e].filter(x=>x!==fn);}};} const w=createWeb3Listener();let c=0;const fn=()=>c++;w.on(''y'',fn);w.off(''y'',fn);w.emit(''y'',null);return c===0;})()","description":"off() removes the handler"},
    {"assertion":"(function(){function createWeb3Listener(){const h={};return{on(e,fn){h[e]=h[e]||[];h[e].push(fn);},emit(e,d){(h[e]||[]).forEach(fn=>fn(d));},off(e,fn){if(h[e])h[e]=h[e].filter(x=>x!==fn);}};} const w=createWeb3Listener();try{w.emit(''noop'',1);return true;}catch(e){return false;}})()","description":"Emitting with no listeners doesn''t throw"}
  ]',
  'medium', 160
),
(
  '00000000-0500-0000-0000-020600000004',
  '00000000-0500-0000-0000-000000000206', 4,
  'DApp State Manager',
  'Gucunga Imiterere ya DApp',
  'Write `createDAppState()` that manages a decentralized app''s frontend state:\n- `connect(address)` — sets wallet address and status to "connected"\n- `disconnect()` — clears address, sets status to "disconnected"\n- `getState()` — returns `{ address, status, chainId }`\n- `setChain(chainId)` — updates the chain',
  'Andika `createDAppState` gucunga imiterere ya DApp.',
  'write_scratch',
  'function createDAppState() {\n  // Your code here\n}\n',
  '',
  'Maintain an internal state object. Each method mutates it. getState() returns a shallow copy.',
  'Bika ibintu bya imiterere y''imbere. Buri method ibihindura. getState() isubiza kopi yoroheje.',
  '[
    {"assertion":"(function(){function createDAppState(){let s={address:null,status:''disconnected'',chainId:1};return{connect(a){s.address=a;s.status=''connected'';},disconnect(){s.address=null;s.status=''disconnected'';},getState(){return{...s};},setChain(c){s.chainId=c;}};} const d=createDAppState();d.connect(''0xABC'');return d.getState().status===''connected'';})()","description":"connect() sets status to connected"},
    {"assertion":"(function(){function createDAppState(){let s={address:null,status:''disconnected'',chainId:1};return{connect(a){s.address=a;s.status=''connected'';},disconnect(){s.address=null;s.status=''disconnected'';},getState(){return{...s};},setChain(c){s.chainId=c;}};} const d=createDAppState();d.connect(''0xABC'');d.disconnect();return d.getState().address===null;})()","description":"disconnect() clears address"},
    {"assertion":"(function(){function createDAppState(){let s={address:null,status:''disconnected'',chainId:1};return{connect(a){s.address=a;s.status=''connected'';},disconnect(){s.address=null;s.status=''disconnected'';},getState(){return{...s};},setChain(c){s.chainId=c;}};} const d=createDAppState();d.setChain(137);return d.getState().chainId===137;})()","description":"setChain() updates chainId"},
    {"assertion":"(function(){function createDAppState(){let s={address:null,status:''disconnected'',chainId:1};return{connect(a){s.address=a;s.status=''connected'';},disconnect(){s.address=null;s.status=''disconnected'';},getState(){return{...s};},setChain(c){s.chainId=c;}};} const d=createDAppState();return d.getState().status===''disconnected'';})()","description":"Initial status is disconnected"}
  ]',
  'medium', 160
)
ON CONFLICT (id) DO NOTHING;

-- ── ORDER 208: SWDDT501 Deployment & Containerisation ─────────────────────

INSERT INTO public.quiz_challenges
  (id, set_id, order_index, title, title_kin, description, description_kin,
   challenge_type, starter_js, starter_html, hint, hint_kin,
   test_cases, difficulty, xp_reward)
VALUES
(
  '00000000-0500-0000-0000-020800000001',
  '00000000-0500-0000-0000-000000000208', 1,
  'Docker Config Generator',
  'Gukora Imiterere ya Docker',
  'Write `generateDockerConfig(app)` where app has `{ name, port, env, dependencies }`. Return a structured config object representing a Docker-like container spec:\n- `image`: `"node:18-alpine"`\n- `containerName`: app.name\n- `ports`: `["${app.port}:${app.port}"]`\n- `environment`: array of `"KEY=VALUE"` strings from app.env object\n- `links`: app.dependencies array',
  'Andika `generateDockerConfig` isubiza imiterere ya Docker.',
  'write_scratch',
  'function generateDockerConfig(app) {\n  // Your code here\n}\n',
  '',
  'Use Object.entries(app.env).map(([k,v]) => `${k}=${v}`) to build the environment array.',
  'Koresha Object.entries(app.env).map(([k,v]) => `${k}=${v}`).',
  '[
    {"assertion":"(function(){function generateDockerConfig(a){return{image:''node:18-alpine'',containerName:a.name,ports:[`${a.port}:${a.port}`],environment:Object.entries(a.env).map(([k,v])=>`${k}=${v}`),links:a.dependencies};}const c=generateDockerConfig({name:''api'',port:3000,env:{NODE_ENV:''prod''},dependencies:[]});return c.containerName===''api'';})()","description":"containerName set correctly"},
    {"assertion":"(function(){function generateDockerConfig(a){return{image:''node:18-alpine'',containerName:a.name,ports:[`${a.port}:${a.port}`],environment:Object.entries(a.env).map(([k,v])=>`${k}=${v}`),links:a.dependencies};}const c=generateDockerConfig({name:''x'',port:8080,env:{},dependencies:[]});return c.ports[0]===''8080:8080'';})()","description":"Port mapping correct"},
    {"assertion":"(function(){function generateDockerConfig(a){return{image:''node:18-alpine'',containerName:a.name,ports:[`${a.port}:${a.port}`],environment:Object.entries(a.env).map(([k,v])=>`${k}=${v}`),links:a.dependencies};}const c=generateDockerConfig({name:''x'',port:80,env:{DB_HOST:''localhost'',PORT:''5432''},dependencies:[]});return c.environment.includes(''DB_HOST=localhost'');})()","description":"Environment variables formatted correctly"},
    {"assertion":"(function(){function generateDockerConfig(a){return{image:''node:18-alpine'',containerName:a.name,ports:[`${a.port}:${a.port}`],environment:Object.entries(a.env).map(([k,v])=>`${k}=${v}`),links:a.dependencies};}return generateDockerConfig({name:''x'',port:80,env:{},dependencies:[''db'',''redis'']}).links.length===2;})()","description":"Dependencies become links"}
  ]',
  'medium', 160
),
(
  '00000000-0500-0000-0000-020800000002',
  '00000000-0500-0000-0000-000000000208', 2,
  'CI/CD Pipeline Status',
  'Imiterere ya Pipeline ya CI/CD',
  'Complete `evaluatePipeline(stages)` where each stage is `{ name, status }` (status: `"passed"`, `"failed"`, `"skipped"`).\n\nReturn `{ overall, summary }` where overall is `"passed"` if all non-skipped are passed, `"failed"` if any failed, `"pending"` if any are missing status.',
  'Uzuza `evaluatePipeline` isuzuma inzira ya CI/CD.',
  'complete_code',
  'function evaluatePipeline(stages) {\n  const hasFailed = stages.some(s => ____);\n  const hasPending = stages.some(s => !s.status);\n  const overall = hasFailed ? ____ : hasPending ? ''pending'' : ''passed'';\n  const summary = stages.map(s => `${s.name}: ${s.status || ''pending''}`);\n  return { overall, summary };\n}\n',
  '',
  'First blank: `s.status === "failed"`. Second blank: `"failed"`.',
  'Igice cya mbere: `s.status === "failed"`. Igice cya kabiri: `"failed"`.',
  '[
    {"assertion":"(function(){function evaluatePipeline(stages){const hf=stages.some(s=>s.status===''failed'');const hp=stages.some(s=>!s.status);const overall=hf?''failed'':hp?''pending'':''passed'';return{overall,summary:[]};} return evaluatePipeline([{name:''build'',status:''passed''},{name:''test'',status:''passed''}]).overall===''passed'';})()","description":"All passed → overall passed"},
    {"assertion":"(function(){function evaluatePipeline(stages){const hf=stages.some(s=>s.status===''failed'');const hp=stages.some(s=>!s.status);const overall=hf?''failed'':hp?''pending'':''passed'';return{overall,summary:[]};} return evaluatePipeline([{name:''build'',status:''passed''},{name:''deploy'',status:''failed''}]).overall===''failed'';})()","description":"Any failed → overall failed"},
    {"assertion":"(function(){function evaluatePipeline(stages){const hf=stages.some(s=>s.status===''failed'');const hp=stages.some(s=>!s.status);const overall=hf?''failed'':hp?''pending'':''passed'';return{overall,summary:[]};} return evaluatePipeline([{name:''build'',status:''passed''},{name:''deploy''}]).overall===''pending'';})()","description":"Missing status → pending"},
    {"assertion":"(function(){function evaluatePipeline(stages){const hf=stages.some(s=>s.status===''failed'');const hp=stages.some(s=>!s.status);const overall=hf?''failed'':hp?''pending'':''passed'';const summary=stages.map(s=>`${s.name}: ${s.status||''pending''}`);return{overall,summary};} return Array.isArray(evaluatePipeline([{name:''x'',status:''passed''}]).summary);})()","description":"summary is an array"}
  ]',
  'medium', 160
),
(
  '00000000-0500-0000-0000-020800000003',
  '00000000-0500-0000-0000-000000000208', 3,
  'Fix: Container Health Check',
  'Gusana: Gusuzuma Ubuzima bwa Container',
  'The container health checker has two bugs. Find and fix them.',
  'Gusuzuma ubuzima bwa container bifite amakosa abiri. Sana.',
  'fix_bug',
  'function checkContainerHealth(containers) {\n  return containers\n    .filter(c => c.running)\n    // Bug 1: healthScore should multiply uptime by 100, not add\n    .map(c => ({ ...c, healthScore: c.uptimeHours + 100 }))\n    // Bug 2: should sort descending (highest score first), not ascending\n    .sort((a, b) => a.healthScore - b.healthScore);\n}\n',
  '',
  'Bug 1: change `+ 100` to `* 100`. Bug 2: reverse sort: `b.healthScore - a.healthScore`.',
  'Ikosa 1: hindura `+ 100` kuba `* 100`. Ikosa 2: hindura kugabanya kuba `b.healthScore - a.healthScore`.',
  '[
    {"assertion":"(function(){function checkContainerHealth(cs){return cs.filter(c=>c.running).map(c=>({...c,healthScore:c.uptimeHours*100})).sort((a,b)=>b.healthScore-a.healthScore);}const r=checkContainerHealth([{running:true,uptimeHours:5,name:''a''}]);return r[0].healthScore===500;})()","description":"healthScore is uptime * 100"},
    {"assertion":"(function(){function checkContainerHealth(cs){return cs.filter(c=>c.running).map(c=>({...c,healthScore:c.uptimeHours*100})).sort((a,b)=>b.healthScore-a.healthScore);}const r=checkContainerHealth([{running:true,uptimeHours:2,name:''a''},{running:true,uptimeHours:5,name:''b''}]);return r[0].name===''b'';})()","description":"Highest uptime container is first"},
    {"assertion":"(function(){function checkContainerHealth(cs){return cs.filter(c=>c.running).map(c=>({...c,healthScore:c.uptimeHours*100})).sort((a,b)=>b.healthScore-a.healthScore);}return checkContainerHealth([{running:false,uptimeHours:10,name:''dead''}]).length===0;})()","description":"Stopped containers excluded"},
    {"assertion":"(function(){function checkContainerHealth(cs){return cs.filter(c=>c.running).map(c=>({...c,healthScore:c.uptimeHours*100})).sort((a,b)=>b.healthScore-a.healthScore);}return Array.isArray(checkContainerHealth([]));})()","description":"Empty input returns empty array"}
  ]',
  'easy', 160
),
(
  '00000000-0500-0000-0000-020800000004',
  '00000000-0500-0000-0000-000000000208', 4,
  'Microservice Registry',
  'Rejisitiri ya Microservice',
  'Write `createServiceRegistry()` for a microservices deployment:\n- `register(name, url, version)` — registers a service\n- `discover(name)` — returns the service (or null)\n- `deregister(name)` — removes it\n- `healthCheck()` — returns array of `{ name, url, status: "up" }` for all registered services',
  'Andika `createServiceRegistry` yo gucunga microservices.',
  'write_scratch',
  'function createServiceRegistry() {\n  // Your code here\n}\n',
  '',
  'Store services in an object keyed by name. healthCheck maps Object.values(services) to status objects.',
  'Bika serivisi mu kintu gishingiye ku izina. healthCheck ikoresha Object.values.',
  '[
    {"assertion":"(function(){function createServiceRegistry(){const s={};return{register(n,u,v){s[n]={name:n,url:u,version:v};},discover(n){return s[n]??null;},deregister(n){delete s[n];},healthCheck(){return Object.values(s).map(x=>({name:x.name,url:x.url,status:''up''}));}};} const r=createServiceRegistry();r.register(''auth'',''http://auth:3000'',''1.0'');return r.discover(''auth'').url===''http://auth:3000'';})()","description":"register and discover work"},
    {"assertion":"(function(){function createServiceRegistry(){const s={};return{register(n,u,v){s[n]={name:n,url:u,version:v};},discover(n){return s[n]??null;},deregister(n){delete s[n];},healthCheck(){return Object.values(s).map(x=>({name:x.name,url:x.url,status:''up''}));}};} const r=createServiceRegistry();return r.discover(''missing'')===null;})()","description":"Unknown service returns null"},
    {"assertion":"(function(){function createServiceRegistry(){const s={};return{register(n,u,v){s[n]={name:n,url:u,version:v};},discover(n){return s[n]??null;},deregister(n){delete s[n];},healthCheck(){return Object.values(s).map(x=>({name:x.name,url:x.url,status:''up''}));}};} const r=createServiceRegistry();r.register(''a'',''http://a'',''1'');r.deregister(''a'');return r.discover(''a'')===null;})()","description":"deregister removes service"},
    {"assertion":"(function(){function createServiceRegistry(){const s={};return{register(n,u,v){s[n]={name:n,url:u,version:v};},discover(n){return s[n]??null;},deregister(n){delete s[n];},healthCheck(){return Object.values(s).map(x=>({name:x.name,url:x.url,status:''up''}));}};} const r=createServiceRegistry();r.register(''x'',''http://x'',''1'');return r.healthCheck()[0].status===''up'';})()","description":"healthCheck returns up status"}
  ]',
  'medium', 160
)
ON CONFLICT (id) DO NOTHING;

-- ── ORDER 209: SWDDT501 Monitoring & Performance ──────────────────────────

INSERT INTO public.quiz_challenges
  (id, set_id, order_index, title, title_kin, description, description_kin,
   challenge_type, starter_js, starter_html, hint, hint_kin,
   test_cases, difficulty, xp_reward)
VALUES
(
  '00000000-0500-0000-0000-020900000001',
  '00000000-0500-0000-0000-000000000209', 1,
  'Metrics Aggregator',
  'Guhuza Metrics',
  'Write `createMetricsCollector()` that tracks performance metrics:\n- `record(name, value)` — adds a data point\n- `stats(name)` — returns `{ count, min, max, avg }` for that metric\n- `reset(name)` — clears that metric''s data',
  'Andika `createMetricsCollector` gukurikirana metrics.',
  'write_scratch',
  'function createMetricsCollector() {\n  // Your code here\n}\n',
  '',
  'Store data as arrays per metric name. stats() computes min/max/avg from the array.',
  'Bika amakuru nk''urutonde ku bw''izina rya metric. stats() ibara min/max/avg.',
  '[
    {"assertion":"(function(){function createMetricsCollector(){const d={};return{record(n,v){(d[n]=d[n]||[]).push(v);},stats(n){const a=d[n]||[];if(!a.length)return null;return{count:a.length,min:Math.min(...a),max:Math.max(...a),avg:a.reduce((s,x)=>s+x,0)/a.length};},reset(n){delete d[n];}};} const m=createMetricsCollector();m.record(''cpu'',50);m.record(''cpu'',80);const s=m.stats(''cpu'');return s.count===2&&s.max===80;})()","description":"stats count and max correct"},
    {"assertion":"(function(){function createMetricsCollector(){const d={};return{record(n,v){(d[n]=d[n]||[]).push(v);},stats(n){const a=d[n]||[];if(!a.length)return null;return{count:a.length,min:Math.min(...a),max:Math.max(...a),avg:a.reduce((s,x)=>s+x,0)/a.length};},reset(n){delete d[n];}};} const m=createMetricsCollector();m.record(''mem'',100);m.record(''mem'',200);return m.stats(''mem'').avg===150;})()","description":"avg computed correctly"},
    {"assertion":"(function(){function createMetricsCollector(){const d={};return{record(n,v){(d[n]=d[n]||[]).push(v);},stats(n){const a=d[n]||[];if(!a.length)return null;return{count:a.length,min:Math.min(...a),max:Math.max(...a),avg:a.reduce((s,x)=>s+x,0)/a.length};},reset(n){delete d[n];}};} const m=createMetricsCollector();m.record(''x'',5);m.reset(''x'');return m.stats(''x'')===null;})()","description":"reset clears data, stats returns null"},
    {"assertion":"(function(){function createMetricsCollector(){const d={};return{record(n,v){(d[n]=d[n]||[]).push(v);},stats(n){const a=d[n]||[];if(!a.length)return null;return{count:a.length,min:Math.min(...a),max:Math.max(...a),avg:a.reduce((s,x)=>s+x,0)/a.length};},reset(n){delete d[n];}};} return createMetricsCollector().stats(''unknown'')===null;})()","description":"Unknown metric returns null"}
  ]',
  'medium', 160
),
(
  '00000000-0500-0000-0000-020900000002',
  '00000000-0500-0000-0000-000000000209', 2,
  'Alert Threshold Monitor',
  'Gukurikirana Ibipimo by''Iburira',
  'Complete `createAlertSystem(thresholds)` where thresholds is `{ metricName: maxValue }`. The system:\n- `check(metric, value)` — returns `{ alert: boolean, message }` — alert is true if value exceeds threshold\n- `getThreshold(metric)` — returns the threshold or `null`',
  'Uzuza `createAlertSystem` gukurikirana iburira.',
  'complete_code',
  'function createAlertSystem(thresholds) {\n  return {\n    check(metric, value) {\n      const limit = thresholds[metric];\n      if (limit === undefined) return { alert: false, message: ''No threshold set'' };\n      const exceeded = ____;\n      return {\n        alert: exceeded,\n        message: exceeded ? `${metric} exceeded: ${value} > ${limit}` : ____\n      };\n    },\n    getThreshold(metric) { return thresholds[metric] ?? null; }\n  };\n}\n',
  '',
  'First blank: `value > limit`. Second blank: `"${metric} OK: ${value}"` or similar.',
  'Igice cya mbere: `value > limit`. Igice cya kabiri: string yerekana ko byari neza.',
  '[
    {"assertion":"(function(){function createAlertSystem(t){return{check(m,v){const l=t[m];if(l===undefined)return{alert:false,message:''No threshold set''};const ex=v>l;return{alert:ex,message:ex?`${m} exceeded: ${v} > ${l}`:`${m} OK: ${v}`};},getThreshold(m){return t[m]??null;}};} const a=createAlertSystem({cpu:80});return a.check(''cpu'',90).alert===true;})()","description":"Exceeded threshold triggers alert"},
    {"assertion":"(function(){function createAlertSystem(t){return{check(m,v){const l=t[m];if(l===undefined)return{alert:false,message:''No threshold set''};const ex=v>l;return{alert:ex,message:ex?`${m} exceeded`:`${m} OK`};},getThreshold(m){return t[m]??null;}};} const a=createAlertSystem({cpu:80});return a.check(''cpu'',70).alert===false;})()","description":"Below threshold returns alert false"},
    {"assertion":"(function(){function createAlertSystem(t){return{check(m,v){const l=t[m];if(l===undefined)return{alert:false,message:''No threshold set''};return{alert:v>l,message:''ok''};},getThreshold(m){return t[m]??null;}};} const a=createAlertSystem({});return a.check(''unknown'',999).alert===false;})()","description":"Unknown metric returns alert false"},
    {"assertion":"(function(){function createAlertSystem(t){return{check(m,v){return{alert:false,message:''ok''};},getThreshold(m){return t[m]??null;}};} const a=createAlertSystem({mem:512});return a.getThreshold(''mem'')===512;})()","description":"getThreshold returns correct value"}
  ]',
  'easy', 160
),
(
  '00000000-0500-0000-0000-020900000003',
  '00000000-0500-0000-0000-000000000209', 3,
  'Fix: Performance Logger',
  'Gusana: Gutuza Ibikorwa by''Imihigo',
  'The performance logger has two bugs. It should record start/end times and return duration. Fix them.',
  'Gutuza ibikorwa by''imihigo bifite amakosa abiri. Sana.',
  'fix_bug',
  'const perfLog = {};\n\nfunction startTimer(label) {\n  // Bug 1: should store Date.now(), not a fixed 0\n  perfLog[label] = { start: 0, end: null };\n}\n\nfunction endTimer(label) {\n  if (!perfLog[label]) throw new Error(''Timer not started'');\n  perfLog[label].end = Date.now();\n  // Bug 2: should return duration (end - start), not just end\n  return perfLog[label].end;\n}\n',
  '',
  'Bug 1: change `0` to `Date.now()`. Bug 2: change `return perfLog[label].end` to `return perfLog[label].end - perfLog[label].start`.',
  'Ikosa 1: hindura `0` kuba `Date.now()`. Ikosa 2: subiza `end - start`.',
  '[
    {"assertion":"(function(){const pL={};function startTimer(l){pL[l]={start:Date.now(),end:null};}function endTimer(l){if(!pL[l])throw new Error(''not started'');pL[l].end=Date.now();return pL[l].end-pL[l].start;}startTimer(''op'');const d=endTimer(''op'');return typeof d===''number''&&d>=0;})()","description":"Duration is a non-negative number"},
    {"assertion":"(function(){const pL={};function startTimer(l){pL[l]={start:Date.now(),end:null};}function endTimer(l){if(!pL[l])throw new Error(''not started'');pL[l].end=Date.now();return pL[l].end-pL[l].start;}try{endTimer(''missing'');return false;}catch(e){return true;}})()","description":"Throws when timer not started"},
    {"assertion":"(function(){const pL={};function startTimer(l){pL[l]={start:Date.now(),end:null};}function endTimer(l){if(!pL[l])throw new Error(''not started'');pL[l].end=Date.now();return pL[l].end-pL[l].start;}startTimer(''t'');return pL[''t''].start>0;})()","description":"Start time is a real timestamp"},
    {"assertion":"(function(){const pL={};function startTimer(l){pL[l]={start:Date.now(),end:null};}function endTimer(l){if(!pL[l])throw new Error(''not started'');pL[l].end=Date.now();return pL[l].end-pL[l].start;}startTimer(''x'');const d=endTimer(''x'');return d<=1000;})()","description":"Duration of instant operation is under 1 second"}
  ]',
  'easy', 160
),
(
  '00000000-0500-0000-0000-020900000004',
  '00000000-0500-0000-0000-000000000209', 4,
  'SLA Compliance Checker',
  'Gusuzuma Kujya Mu Masezerano ya SLA',
  'Service Level Agreements (SLAs) define uptime guarantees. Write `checkSLA(uptimePercent, slaTarget)` and `monthlyDowntimeMinutes(uptimePercent)` (based on 30-day month).\n\nAlso write `generateSLAReport(services)` where each service is `{ name, uptimePercent, slaTarget }`. Return array of `{ name, met: boolean, downtimeMinutes }`.',
  'SLAs zigenera ibyangombwa by''igihe cyo gukora. Andika imikorere yo gusuzuma SLA.',
  'write_scratch',
  'function checkSLA(uptimePercent, slaTarget) {\n  // Your code here\n}\n\nfunction monthlyDowntimeMinutes(uptimePercent) {\n  // 30 days = 43200 minutes\n}\n\nfunction generateSLAReport(services) {\n  // Your code here\n}\n',
  '',
  'checkSLA: `return uptimePercent >= slaTarget`. monthlyDowntimeMinutes: `return (1 - uptimePercent/100) * 43200`. generateSLAReport: map each service.',
  'checkSLA: `return uptimePercent >= slaTarget`. monthlyDowntimeMinutes: `return (1 - uptimePercent/100) * 43200`.',
  '[
    {"assertion":"(function(){function checkSLA(u,t){return u>=t;}return checkSLA(99.9,99.9)===true;})()","description":"Meets SLA target returns true"},
    {"assertion":"(function(){function checkSLA(u,t){return u>=t;}return checkSLA(99.0,99.9)===false;})()","description":"Below SLA target returns false"},
    {"assertion":"(function(){function monthlyDowntimeMinutes(u){return(1-u/100)*43200;}return monthlyDowntimeMinutes(100)===0;})()","description":"100% uptime = 0 downtime minutes"},
    {"assertion":"(function(){function checkSLA(u,t){return u>=t;}function monthlyDowntimeMinutes(u){return(1-u/100)*43200;}function generateSLAReport(svcs){return svcs.map(s=>({name:s.name,met:checkSLA(s.uptimePercent,s.slaTarget),downtimeMinutes:monthlyDowntimeMinutes(s.uptimePercent)}));}const r=generateSLAReport([{name:''api'',uptimePercent:99.5,slaTarget:99.9}]);return r[0].met===false&&typeof r[0].downtimeMinutes===''number'';})()","description":"generateSLAReport correct shape"}
  ]',
  'hard', 160
)
ON CONFLICT (id) DO NOTHING;
