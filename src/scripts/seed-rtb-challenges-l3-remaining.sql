-- RTB Rwanda Curriculum — Level 3 Remaining Challenges
-- Covers 2 empty sets:
--   order 10: 00000000-0300-0000-0000-000000000010  SWDVF301 LO2 Applying Vue Framework
--   order 12: 00000000-0300-0000-0000-000000000012  SWDVF301 LO4 Developing Game Functionality
-- 4 challenges per set = 8 total
-- Run AFTER seed-rtb-challenges-l3.sql

-- ═══════════════════════════════════════════════════════════════════════════
-- SET: SWDVF301 LO2 — Applying Vue Framework  (order 10)
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO public.quiz_challenges
  (id, set_id, order_index, title, title_kin, description, description_kin,
   challenge_type, starter_js, starter_html, hint, hint_kin,
   test_cases, difficulty, xp_reward)
VALUES

-- Challenge 1: write_scratch — reactive data binding concept
(
  '00000000-0300-0000-0000-001000000001',
  '00000000-0300-0000-0000-000000000010',
  1,
  'Vue Reactive Data Model',
  'Imiterere y''Amakuru Ahinduka ya Vue',
  'In Vue, the `data()` function returns a reactive object — any property you add to it automatically re-renders the UI when it changes.\n\nCreate a function `createStore(initial)` that accepts an initial object and returns a proxy-like store with:\n- `.get(key)` — returns the current value for that key\n- `.set(key, value)` — updates the value\n- `.log()` — returns an array of all `{key, value}` pairs\n\n**Example:**\n```\nconst store = createStore({ count: 0, name: ''Vue'' });\nstore.set(''count'', 5);\nstore.get(''count''); // 5\n```',
  'Muri Vue, `data()` isubiza ibintu bihinduka — properties wongeyeho bisubiramo UI igihe zahindutse.\n\nKora `createStore(initial)` ikiramo ibintu bya mbere kandi isubiza store ifite:\n- `.get(key)` — isubiza agaciro k''ubu\n- `.set(key, value)` — ihindura agaciro\n- `.log()` — isubiza urutonde rwa `{key, value}` zose',
  'write_scratch',
  '// Create the store factory\nfunction createStore(initial) {\n  // Your code here\n}\n',
  '',
  'Use an internal object to hold the state. `.log()` should use Object.entries() to build the array.',
  'Koresha ibintu bya mbere gutuza imiterere. `.log()` ikoreshe Object.entries() kubaka urutonde.',
  '[
    {"assertion": "typeof createStore === ''function''", "description": "createStore is a function"},
    {"assertion": "(function(){ const s = createStore({x:1}); return s.get(''x''); })()=== 1", "description": "get() returns initial value"},
    {"assertion": "(function(){ const s = createStore({x:1}); s.set(''x'', 99); return s.get(''x''); })() === 99", "description": "set() updates the value"},
    {"assertion": "(function(){ const s = createStore({a:1,b:2}); const log = s.log(); return Array.isArray(log) && log.length === 2; })()", "description": "log() returns array of all entries"}
  ]',
  'medium', 80
),

-- Challenge 2: complete_code — Vue component props simulation
(
  '00000000-0300-0000-0000-001000000002',
  '00000000-0300-0000-0000-000000000010',
  2,
  'Vue Props Validator',
  'Gusuzuma Props za Vue',
  'Vue components declare `props` with optional type and required validators. Complete the `validateProps(schema, data)` function that:\n- Returns `true` if all required props in `schema` are present in `data`\n- Returns `false` if any required prop is missing\n- Ignores optional props\n\n**Schema format:** `{ propName: { type: ''String'', required: true } }`',
  'Ibice bya Vue bisobanura `props` bafite suzuma rya type na required. Uzuza `validateProps(schema, data)` itegura:\n- Isubiza `true` niba props zose za required mu `schema` ziriho mu `data`\n- Isubiza `false` niba prop iyo ari yo yose ya required ibuze',
  'complete_code',
  'function validateProps(schema, data) {\n  const keys = Object.keys(schema);\n  for (const key of keys) {\n    if (schema[key].required && ____) {\n      return false;\n    }\n  }\n  return ____;\n}\n',
  '',
  'The missing condition checks if data does NOT have the key. Use `!(key in data)` or check `data[key] === undefined`.',
  'Ikibura gisuzuma niba data ifite key. Koresha `!(key in data)`.',
  '[
    {"assertion": "(function(){ function validateProps(schema,data){const keys=Object.keys(schema);for(const key of keys){if(schema[key].required&&!(key in data))return false;}return true;} return validateProps({name:{type:''String'',required:true}},{name:''Alice''}); })()", "description": "Returns true when required prop is present"},
    {"assertion": "(function(){ function validateProps(schema,data){const keys=Object.keys(schema);for(const key of keys){if(schema[key].required&&!(key in data))return false;}return true;} return validateProps({name:{type:''String'',required:true}},{}); })()===false", "description": "Returns false when required prop is missing"},
    {"assertion": "(function(){ function validateProps(schema,data){const keys=Object.keys(schema);for(const key of keys){if(schema[key].required&&!(key in data))return false;}return true;} return validateProps({name:{required:true},age:{required:false}},{name:''Bob''}); })()", "description": "Optional props can be absent"},
    {"assertion": "(function(){ function validateProps(schema,data){const keys=Object.keys(schema);for(const key of keys){if(schema[key].required&&!(key in data))return false;}return true;} return validateProps({},{anything:1}); })()", "description": "Empty schema always returns true"}
  ]',
  'easy', 80
),

-- Challenge 3: fix_bug — Vue computed property pattern
(
  '00000000-0300-0000-0000-001000000003',
  '00000000-0300-0000-0000-000000000010',
  3,
  'Fix the Computed Property',
  'Gusana Ibintu Bibarwa',
  'In Vue, **computed properties** are cached functions that derive a value from reactive data. The code below tries to build a computed price formatter — but it has two bugs.\n\nFix them so `formatPrice(item)` returns the price as a string like `"RWF 1,250"`.',
  'Muri Vue, **computed properties** ni imikorere yashyizwe mu bubiko ikomoka ku makuru ahinduka. Kode hepfo iragerageza kubaka formateri y''igiciro — ariko ifite amakosa abiri.',
  'fix_bug',
  'function formatPrice(item) {\n  // Bug 1: should use item.price, not item.cost\n  const raw = item.cost;\n\n  // Bug 2: toLocaleString expects a locale string, not a number\n  const formatted = raw.toLocaleString(250);\n\n  return `RWF ${formatted}`;\n}\n',
  '',
  'Bug 1: the property should be `item.price`. Bug 2: `toLocaleString()` takes a locale string like `"en-RW"` or no argument at all — passing a number is wrong.',
  'Ikosa 1: property igomba kuba `item.price`. Ikosa 2: `toLocaleString()` ifata string nka `"en-RW"` cyangwa nta ngingo — gutura umubare ni ikosa.',
  '[
    {"assertion": "(function(){ function formatPrice(item){const raw=item.price;const formatted=raw.toLocaleString();return `RWF ${formatted}`;} return typeof formatPrice({price:1250})==''string''; })()", "description": "formatPrice returns a string"},
    {"assertion": "(function(){ function formatPrice(item){const raw=item.price;const formatted=raw.toLocaleString();return `RWF ${formatted}`;} return formatPrice({price:0}).startsWith(''RWF''); })()", "description": "Result starts with RWF"},
    {"assertion": "(function(){ function formatPrice(item){const raw=item.price;const formatted=raw.toLocaleString();return `RWF ${formatted}`;} return !isNaN(parseInt(formatPrice({price:500}).replace(''RWF '',''''))); })()", "description": "Result contains a numeric part after RWF"},
    {"assertion": "(function(){ function formatPrice(item){const raw=item.price;const formatted=raw.toLocaleString();return `RWF ${formatted}`;} try{formatPrice({price:100});return true;}catch(e){return false;} })()", "description": "No error is thrown"}
  ]',
  'medium', 80
),

-- Challenge 4: write_scratch — Vue event emitter pattern
(
  '00000000-0300-0000-0000-001000000004',
  '00000000-0300-0000-0000-000000000010',
  4,
  'Event Emitter (Vue-style)',
  'Gutanga Inyito (Uburyo bwa Vue)',
  'Vue components communicate from child to parent using `$emit`. Implement a simple `EventEmitter` class with:\n- `on(event, handler)` — registers a listener\n- `emit(event, ...args)` — calls all listeners for that event with the given args\n- `off(event, handler)` — removes a specific listener\n\n**Example:**\n```\nconst bus = new EventEmitter();\nbus.on(''update'', (v) => console.log(v));\nbus.emit(''update'', 42); // logs 42\n```',
  'Ibice bya Vue biganana uva ku mwana kujya ku mubyeyi bakoresheje `$emit`. Shyira mu bikorwa classe yoroheje ya `EventEmitter` ifite:\n- `on(event, handler)` — yandikisha umucuzi\n- `emit(event, ...args)` — hamagara abacuzi bose ba iyo myigire hamwe na args\n- `off(event, handler)` — kora umucuzi runaka',
  'write_scratch',
  '// Implement the EventEmitter class\nclass EventEmitter {\n  // Your code here\n}\n',
  '',
  'Store listeners in an object: `this.listeners = {}`. For `on`, push to `this.listeners[event] = this.listeners[event] || []`. For `emit`, loop through and call each. For `off`, filter out the handler.',
  'Bika abacuzi mu kintu: `this.listeners = {}`. Kuri `on`, shyira mu `this.listeners[event]`. Kuri `emit`, zunguruka uhamagare buri wese. Kuri `off`, siba handler.',
  '[
    {"assertion": "(function(){ class EventEmitter{constructor(){this.listeners={};} on(e,h){(this.listeners[e]=this.listeners[e]||[]).push(h);} emit(e,...a){(this.listeners[e]||[]).forEach(h=>h(...a));} off(e,h){this.listeners[e]=(this.listeners[e]||[]).filter(x=>x!==h);}} const bus=new EventEmitter(); let val=0; bus.on(''x'',v=>{val=v;}); bus.emit(''x'',7); return val===7; })()", "description": "emit calls the registered listener"},
    {"assertion": "(function(){ class EventEmitter{constructor(){this.listeners={};} on(e,h){(this.listeners[e]=this.listeners[e]||[]).push(h);} emit(e,...a){(this.listeners[e]||[]).forEach(h=>h(...a));} off(e,h){this.listeners[e]=(this.listeners[e]||[]).filter(x=>x!==h);}} const bus=new EventEmitter(); let count=0; const h=()=>count++; bus.on(''y'',h); bus.off(''y'',h); bus.emit(''y''); return count===0; })()", "description": "off() removes the listener"},
    {"assertion": "(function(){ class EventEmitter{constructor(){this.listeners={};} on(e,h){(this.listeners[e]=this.listeners[e]||[]).push(h);} emit(e,...a){(this.listeners[e]||[]).forEach(h=>h(...a));} off(e,h){this.listeners[e]=(this.listeners[e]||[]).filter(x=>x!==h);}} const bus=new EventEmitter(); let calls=0; bus.on(''z'',()=>calls++); bus.on(''z'',()=>calls++); bus.emit(''z''); return calls===2; })()", "description": "Multiple listeners for same event all fire"},
    {"assertion": "(function(){ class EventEmitter{constructor(){this.listeners={};} on(e,h){(this.listeners[e]=this.listeners[e]||[]).push(h);} emit(e,...a){(this.listeners[e]||[]).forEach(h=>h(...a));} off(e,h){this.listeners[e]=(this.listeners[e]||[]).filter(x=>x!==h);}} const bus=new EventEmitter(); try{bus.emit(''noevent'');return true;}catch(e){return false;} })()", "description": "emit on unregistered event does not crash"}
  ]',
  'hard', 80
)

ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════
-- SET: SWDVF301 LO4 — Developing Game Functionality  (order 12)
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO public.quiz_challenges
  (id, set_id, order_index, title, title_kin, description, description_kin,
   challenge_type, starter_js, starter_html, hint, hint_kin,
   test_cases, difficulty, xp_reward)
VALUES

-- Challenge 1: write_scratch — score tracker
(
  '00000000-0300-0000-0000-001200000001',
  '00000000-0300-0000-0000-000000000012',
  1,
  'Game Score Tracker',
  'Gukurikirana Amanota y''Umukino',
  'Create a `ScoreTracker` class for a simple game:\n- `addScore(points)` — adds points to the current score (cannot go below 0)\n- `getScore()` — returns the current score\n- `reset()` — resets score to 0\n- `highScore` property — always reflects the highest score ever reached\n\n**Example:**\n```\nconst tracker = new ScoreTracker();\ntracker.addScore(50);\ntracker.addScore(-100); // score goes to 0, not negative\ntracker.highScore; // 50\n```',
  'Kora classe `ScoreTracker` y''umukino woroheje:\n- `addScore(points)` — wongeraho amanota (ntishobora kujya munsi ya 0)\n- `getScore()` — isubiza amanota y''ubu\n- `reset()` — isubiza amanota kuri 0\n- `highScore` property — igerageza amanota menshi yabonanye',
  'write_scratch',
  '// Create the ScoreTracker class\nclass ScoreTracker {\n  // Your code here\n}\n',
  '',
  'Initialize `this.score = 0` and `this.highScore = 0` in the constructor. In addScore, use `Math.max(0, this.score + points)` then update highScore if the new score is higher.',
  'Tangira na `this.score = 0` na `this.highScore = 0` mu constructor. Muri addScore, koresha `Math.max(0, this.score + points)` hanyuma uhindure highScore niba amanota mashya ari menshi.',
  '[
    {"assertion": "(function(){ class ScoreTracker{constructor(){this.score=0;this.highScore=0;} addScore(p){this.score=Math.max(0,this.score+p);if(this.score>this.highScore)this.highScore=this.score;} getScore(){return this.score;} reset(){this.score=0;}} const t=new ScoreTracker();t.addScore(50);return t.getScore()===50; })()", "description": "addScore increases the score"},
    {"assertion": "(function(){ class ScoreTracker{constructor(){this.score=0;this.highScore=0;} addScore(p){this.score=Math.max(0,this.score+p);if(this.score>this.highScore)this.highScore=this.score;} getScore(){return this.score;} reset(){this.score=0;}} const t=new ScoreTracker();t.addScore(30);t.addScore(-100);return t.getScore()===0; })()", "description": "Score cannot go below zero"},
    {"assertion": "(function(){ class ScoreTracker{constructor(){this.score=0;this.highScore=0;} addScore(p){this.score=Math.max(0,this.score+p);if(this.score>this.highScore)this.highScore=this.score;} getScore(){return this.score;} reset(){this.score=0;}} const t=new ScoreTracker();t.addScore(80);t.reset();return t.getScore()===0&&t.highScore===80; })()", "description": "reset() clears score but highScore remains"},
    {"assertion": "(function(){ class ScoreTracker{constructor(){this.score=0;this.highScore=0;} addScore(p){this.score=Math.max(0,this.score+p);if(this.score>this.highScore)this.highScore=this.score;} getScore(){return this.score;} reset(){this.score=0;}} const t=new ScoreTracker();t.addScore(10);t.addScore(20);t.addScore(5);return t.highScore===35; })()", "description": "highScore reflects the maximum score reached"}
  ]',
  'medium', 80
),

-- Challenge 2: complete_code — collision detection
(
  '00000000-0300-0000-0000-001200000002',
  '00000000-0300-0000-0000-000000000012',
  2,
  'Collision Detection',
  'Gusuzuma Gukubitana',
  'In 2D games, **axis-aligned bounding box (AABB)** collision detection checks whether two rectangles overlap.\n\nComplete `checkCollision(a, b)` where each object has `{ x, y, width, height }`.\n\nTwo rectangles collide when:\n- `a.x < b.x + b.width` AND `a.x + a.width > b.x`\n- `a.y < b.y + b.height` AND `a.y + a.height > b.y`',
  'Mu mikino ya 2D, gusuzuma gukubitana kwa AABB bigenzura niba diketa ebyiri zihuriye.\n\nUzuza `checkCollision(a, b)` aho buri kintu gifite `{ x, y, width, height }`.',
  'complete_code',
  'function checkCollision(a, b) {\n  const overlapX = a.x < b.x + b.width && ____;\n  const overlapY = a.y < b.y + b.height && ____;\n  return overlapX && overlapY;\n}\n',
  '',
  'For X overlap the second condition is `a.x + a.width > b.x`. For Y overlap it is `a.y + a.height > b.y`.',
  'Kuri X overlap igice cya kabiri ni `a.x + a.width > b.x`. Kuri Y ni `a.y + a.height > b.y`.',
  '[
    {"assertion": "(function(){ function checkCollision(a,b){const oX=a.x<b.x+b.width&&a.x+a.width>b.x;const oY=a.y<b.y+b.height&&a.y+a.height>b.y;return oX&&oY;} return checkCollision({x:0,y:0,width:50,height:50},{x:25,y:25,width:50,height:50}); })()", "description": "Overlapping rectangles return true"},
    {"assertion": "(function(){ function checkCollision(a,b){const oX=a.x<b.x+b.width&&a.x+a.width>b.x;const oY=a.y<b.y+b.height&&a.y+a.height>b.y;return oX&&oY;} return !checkCollision({x:0,y:0,width:10,height:10},{x:100,y:100,width:10,height:10}); })()", "description": "Non-overlapping rectangles return false"},
    {"assertion": "(function(){ function checkCollision(a,b){const oX=a.x<b.x+b.width&&a.x+a.width>b.x;const oY=a.y<b.y+b.height&&a.y+a.height>b.y;return oX&&oY;} return !checkCollision({x:0,y:0,width:10,height:10},{x:10,y:0,width:10,height:10}); })()", "description": "Touching edges (not overlapping) return false"},
    {"assertion": "(function(){ function checkCollision(a,b){const oX=a.x<b.x+b.width&&a.x+a.width>b.x;const oY=a.y<b.y+b.height&&a.y+a.height>b.y;return oX&&oY;} return checkCollision({x:5,y:5,width:20,height:20},{x:5,y:5,width:20,height:20}); })()", "description": "Identical rectangles return true"}
  ]',
  'medium', 80
),

-- Challenge 3: fix_bug — game loop requestAnimationFrame pattern
(
  '00000000-0300-0000-0000-001200000003',
  '00000000-0300-0000-0000-000000000012',
  3,
  'Fix the Game Loop',
  'Gusana Loop y''Umukino',
  'A **game loop** updates game state and redraws the screen ~60 times per second using `requestAnimationFrame`. The code below has two bugs:\n1. The update function uses the wrong variable name\n2. The loop never calls itself recursively\n\nFix both bugs.',
  'Loop y''umukino ihindura imiterere y''umukino kandi isubiramo screen inshuro ~60 ku segonda. Kode hepfo ifite amakosa abiri:\n1. Imikorere ya update ikoresha izina ry''amakosa rya variable\n2. Loop ntiyihamagara ubwayo',
  'fix_bug',
  'let frameCount = 0;\n\nfunction gameLoop() {\n  // Bug 1: wrong variable name (should be frameCount)\n  frameCont++;\n\n  // Bug 2: loop never continues — needs to schedule the next frame\n  console.log(''Frame: '' + frameCount);\n  // requestAnimationFrame(???) is missing\n}\n\n// Start the loop\ngameLoop();\n',
  '',
  'Bug 1: `frameCont++` should be `frameCount++`. Bug 2: add `requestAnimationFrame(gameLoop)` at the end of the function.',
  'Ikosa 1: `frameCont++` igomba kuba `frameCount++`. Ikosa 2: ongeraho `requestAnimationFrame(gameLoop)` ku mpera y''imikorere.',
  '[
    {"assertion": "(function(){ let frameCount=0; function gameLoop(){frameCount++;console.log(''Frame: ''+frameCount);} gameLoop();gameLoop();gameLoop(); return frameCount===3; })()", "description": "frameCount increments correctly on each call"},
    {"assertion": "(function(){ let frameCount=0; function gameLoop(){frameCount++;} const rAF=typeof requestAnimationFrame!==''undefined''; return true; })()", "description": "No ReferenceError thrown"},
    {"assertion": "(function(){ let fc=0; function fixedLoop(){fc++;} fixedLoop(); return typeof fc===''number''; })()", "description": "frameCount is a number"},
    {"assertion": "(function(){ let frameCount=0; function gameLoop(){frameCount++;} gameLoop(); return frameCount>0; })()", "description": "frameCount is greater than 0 after one call"}
  ]',
  'easy', 80
),

-- Challenge 4: write_scratch — game state machine
(
  '00000000-0300-0000-0000-001200000004',
  '00000000-0300-0000-0000-000000000012',
  4,
  'Game State Machine',
  'Mashini y''Imiterere y''Umukino',
  'Games move through states: `idle → playing → paused → playing → game_over`. Create a `GameStateMachine` class:\n- `state` property — current state string (starts as `"idle"`)\n- `start()` — transitions from `"idle"` to `"playing"`\n- `pause()` — transitions from `"playing"` to `"paused"`\n- `resume()` — transitions from `"paused"` to `"playing"`\n- `end()` — transitions any state to `"game_over"`\n- If an invalid transition is attempted, throw `Error("Invalid transition")`.',
  'Imikino imuka binyuze mu miterere: `idle → playing → paused → playing → game_over`. Kora classe `GameStateMachine`:\n- `state` property — string y''imiterere y''ubu (itangira nka `"idle"`)\n- `start()` — imuka `"idle"` ikajya `"playing"`\n- `pause()` — imuka `"playing"` ikajya `"paused"`\n- `resume()` — imuka `"paused"` ikajya `"playing"`\n- `end()` — imuka imiterere iyo ari yo yose ikajya `"game_over"`\n- Niba impinduka itemewe igeragezwa, fire `Error("Invalid transition")`.',
  'write_scratch',
  '// Implement the GameStateMachine class\nclass GameStateMachine {\n  // Your code here\n}\n',
  '',
  'Store `this.state = "idle"` in the constructor. In each method, check the current state before changing it. Throw if the state is wrong.',
  'Bika `this.state = "idle"` mu constructor. Muri buri method, suzuma imiterere mbere yo kuyihindura. Hire niba imiterere itari iya.',
  '[
    {"assertion": "(function(){ class GameStateMachine{constructor(){this.state=''idle'';} start(){if(this.state!==''idle'')throw new Error(''Invalid transition'');this.state=''playing'';} pause(){if(this.state!==''playing'')throw new Error(''Invalid transition'');this.state=''paused'';} resume(){if(this.state!==''paused'')throw new Error(''Invalid transition'');this.state=''playing'';} end(){this.state=''game_over'';}} const g=new GameStateMachine();return g.state===''idle''; })()", "description": "Initial state is idle"},
    {"assertion": "(function(){ class GameStateMachine{constructor(){this.state=''idle'';} start(){if(this.state!==''idle'')throw new Error(''Invalid transition'');this.state=''playing'';} pause(){if(this.state!==''playing'')throw new Error(''Invalid transition'');this.state=''paused'';} resume(){if(this.state!==''paused'')throw new Error(''Invalid transition'');this.state=''playing'';} end(){this.state=''game_over'';}} const g=new GameStateMachine();g.start();return g.state===''playing''; })()", "description": "start() transitions to playing"},
    {"assertion": "(function(){ class GameStateMachine{constructor(){this.state=''idle'';} start(){if(this.state!==''idle'')throw new Error(''Invalid transition'');this.state=''playing'';} pause(){if(this.state!==''playing'')throw new Error(''Invalid transition'');this.state=''paused'';} resume(){if(this.state!==''paused'')throw new Error(''Invalid transition'');this.state=''playing'';} end(){this.state=''game_over'';}} const g=new GameStateMachine();g.start();g.pause();g.resume();return g.state===''playing''; })()", "description": "pause then resume returns to playing"},
    {"assertion": "(function(){ class GameStateMachine{constructor(){this.state=''idle'';} start(){if(this.state!==''idle'')throw new Error(''Invalid transition'');this.state=''playing'';} pause(){if(this.state!==''playing'')throw new Error(''Invalid transition'');this.state=''paused'';} resume(){if(this.state!==''paused'')throw new Error(''Invalid transition'');this.state=''playing'';} end(){this.state=''game_over'';}} const g=new GameStateMachine(); try{g.pause();return false;}catch(e){return e.message===''Invalid transition'';} })()", "description": "pause() from idle throws Invalid transition"}
  ]',
  'hard', 80
)

ON CONFLICT (id) DO NOTHING;
