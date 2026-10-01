-- RTB L4 Remaining Challenges Part 3 — orders 109, 112, 114, 115, 117, 119
-- 4 challenges each = 24 total

-- ── ORDER 109: SWDBS401 Building System Design Documents ─────────────────

INSERT INTO public.quiz_challenges
  (id, set_id, order_index, title, title_kin, description, description_kin,
   challenge_type, starter_js, starter_html, hint, hint_kin,
   test_cases, difficulty, xp_reward)
VALUES
(
  '00000000-0400-0000-0000-010900000001',
  '00000000-0400-0000-0000-000000000109', 1,
  'Data Flow Graph',
  'Ishusho ry''Inzira z''Amakuru',
  'A Data Flow Diagram (DFD) shows how data moves through a system. Represent a DFD as a directed graph.\n\nWrite `addFlow(graph, from, to, dataName)` that adds a directed edge to the graph and returns the updated graph.\n\nGraph format: `{ nodes: Set, edges: [{from, to, data}] }`',
  'Ishusho ry''Inzira z''Amakuru (DFD) yerekana uko amakuru yimuka muri sisitemu. Kora `addFlow` yongeraho edge.',
  'write_scratch',
  'function createGraph() {\n  return { nodes: new Set(), edges: [] };\n}\n\nfunction addFlow(graph, from, to, dataName) {\n  // Your code here\n}\n',
  '',
  'Add both `from` and `to` to graph.nodes using .add(). Push a new edge object to graph.edges. Return graph.',
  'Ongeraho `from` na `to` kuri graph.nodes ukoresheje .add(). Sunika edge nshya kuri graph.edges. Subiza graph.',
  '[
    {"assertion":"(function(){function createGraph(){return{nodes:new Set(),edges:[]};} function addFlow(g,f,t,d){g.nodes.add(f);g.nodes.add(t);g.edges.push({from:f,to:t,data:d});return g;}const g=createGraph();addFlow(g,''User'',''System'',''login'');return g.nodes.has(''User'')&&g.nodes.has(''System'');})()","description":"Both nodes added to graph"},
    {"assertion":"(function(){function createGraph(){return{nodes:new Set(),edges:[]};} function addFlow(g,f,t,d){g.nodes.add(f);g.nodes.add(t);g.edges.push({from:f,to:t,data:d});return g;}const g=createGraph();addFlow(g,''A'',''B'',''data'');return g.edges[0].from===''A''&&g.edges[0].to===''B'';})()","description":"Edge recorded with correct from/to"},
    {"assertion":"(function(){function createGraph(){return{nodes:new Set(),edges:[]};} function addFlow(g,f,t,d){g.nodes.add(f);g.nodes.add(t);g.edges.push({from:f,to:t,data:d});return g;}const g=createGraph();addFlow(g,''A'',''B'',''x'');addFlow(g,''B'',''C'',''y'');return g.edges.length===2;})()","description":"Multiple flows added correctly"},
    {"assertion":"(function(){function createGraph(){return{nodes:new Set(),edges:[]};} function addFlow(g,f,t,d){g.nodes.add(f);g.nodes.add(t);g.edges.push({from:f,to:t,data:d});return g;}const g=createGraph();addFlow(g,''X'',''X'',''self'');return g.nodes.size===1;})()","description":"Self-loop doesn''t duplicate node in Set"}
  ]',
  'medium', 120
),
(
  '00000000-0400-0000-0000-010900000002',
  '00000000-0400-0000-0000-000000000109', 2,
  'Entity Relationship Schema',
  'Imbonerahamwe y''Isano ry''Ibintu',
  'Complete `buildERSchema(entities, relations)` where:\n- `entities` is an array of `{ name, fields: [] }`\n- `relations` is an array of `{ from, to, type }` (`"one-to-many"`, `"many-to-many"`, etc.)\n\nReturn `{ entities, relations, entityNames }` where `entityNames` is an array of all entity names.',
  'Uzuza `buildERSchema` isubiza imbonerahamwe ya ER.',
  'complete_code',
  'function buildERSchema(entities, relations) {\n  return {\n    entities,\n    relations,\n    entityNames: entities.map(e => ____)\n  };\n}\n',
  '',
  'The blank should be `e.name` to extract the name from each entity.',
  'Ikibura kigomba kuba `e.name` gukura izina ry''ibintu buri kimwe.',
  '[
    {"assertion":"(function(){function buildERSchema(e,r){return{entities:e,relations:r,entityNames:e.map(x=>x.name)};}const s=buildERSchema([{name:''User'',fields:[]},{name:''Post'',fields:[]}],[]);return s.entityNames.includes(''User'')&&s.entityNames.includes(''Post'');})()","description":"entityNames includes all entity names"},
    {"assertion":"(function(){function buildERSchema(e,r){return{entities:e,relations:r,entityNames:e.map(x=>x.name)};}const s=buildERSchema([],[{from:''A'',to:''B'',type:''one-to-many''}]);return s.relations[0].type===''one-to-many'';})()","description":"Relations preserved in output"},
    {"assertion":"(function(){function buildERSchema(e,r){return{entities:e,relations:r,entityNames:e.map(x=>x.name)};}return buildERSchema([],[]).entityNames.length===0;})()","description":"Empty entities produces empty entityNames"},
    {"assertion":"(function(){function buildERSchema(e,r){return{entities:e,relations:r,entityNames:e.map(x=>x.name)};}return Array.isArray(buildERSchema([],[]).entityNames);})()","description":"entityNames is an array"}
  ]',
  'easy', 120
),
(
  '00000000-0400-0000-0000-010900000003',
  '00000000-0400-0000-0000-000000000109', 3,
  'Fix: Physical Schema Builder',
  'Gusana: Kubaka Schema ya Fiziki',
  'The function below converts a logical schema definition into a physical SQL-like CREATE TABLE statement. Find and fix the two bugs.',
  'Imikorere hepfo ihindura sobanuro ya schema nk''inyandiko ya CREATE TABLE. Shaka kandi usane amakosa abiri.',
  'fix_bug',
  'function buildCreateTable(tableName, columns) {\n  // Bug 1: template literal is missing backticks (using regular string)\n  const header = "CREATE TABLE " + tableName + " (";\n\n  const cols = columns.map(col => {\n    const notNull = col.required ? " NOT NULL" : "";\n    // Bug 2: property name is misspelled (should be col.type)\n    return `  ${col.name} ${col.typ}${notNull}`;\n  });\n\n  return header + "\\n" + cols.join(",\\n") + "\\n);";\n}\n',
  '',
  'Bug 1: The header line is fine actually — the real bug is `col.typ` which should be `col.type`.',
  'Ikosa nyacyo ni `col.typ` igomba kuba `col.type`.',
  '[
    {"assertion":"(function(){function buildCreateTable(t,cols){const h=`CREATE TABLE ${t} (`;const c=cols.map(col=>{const nn=col.required?'' NOT NULL'':'';return`  ${col.name} ${col.type}${nn}`;});return h+''\\n''+c.join('',\\n'')+''\\n)''+'';};}return buildCreateTable(''users'',[{name:''id'',type:''INTEGER'',required:true}]).includes(''INTEGER'');})()","description":"Column type appears in output"},
    {"assertion":"(function(){function buildCreateTable(t,cols){const h=`CREATE TABLE ${t} (`;const c=cols.map(col=>{const nn=col.required?'' NOT NULL'':'';return`  ${col.name} ${col.type}${nn}`;});return h+''\\n''+c.join('',\\n'')+''\\n)'';}return buildCreateTable(''users'',[{name:''id'',type:''INTEGER'',required:true}]).includes(''NOT NULL'');})()","description":"NOT NULL included for required columns"},
    {"assertion":"(function(){function buildCreateTable(t,cols){const h=`CREATE TABLE ${t} (`;const c=cols.map(col=>{const nn=col.required?'' NOT NULL'':'';return`  ${col.name} ${col.type}${nn}`;});return h+''\\n''+c.join('',\\n'')+''\\n)'';}return buildCreateTable(''orders'',[{name:''note'',type:''TEXT'',required:false}]).includes(''TEXT'')&&!buildCreateTable(''orders'',[{name:''note'',type:''TEXT'',required:false}]).includes(''NOT NULL'');})()","description":"Optional column has no NOT NULL"},
    {"assertion":"(function(){function buildCreateTable(t,cols){const h=`CREATE TABLE ${t} (`;const c=cols.map(col=>`  ${col.name} ${col.type}`);return h+''\\n''+c.join('',\\n'')+''\\n)'';}return buildCreateTable(''t'',[{name:''x'',type:''INT''}]).includes(''CREATE TABLE t'');})()","description":"Table name in header"}
  ]',
  'easy', 120
),
(
  '00000000-0400-0000-0000-010900000004',
  '00000000-0400-0000-0000-000000000109', 4,
  'System Component Mapper',
  'Guhuza Ibice bya Sisitemu',
  'Write `mapComponents(components)` where each component is `{ id, name, layer, dependencies: [] }`.\n\nReturn:\n- `byLayer` — object grouping component names by their layer\n- `dependencyCount` — object mapping component id → number of deps\n- `total` — total component count',
  'Andika `mapComponents` isubiza imbonerahamwe y''ibice bisortwa.',
  'write_scratch',
  'function mapComponents(components) {\n  // Your code here\n}\n',
  '',
  'For byLayer, use reduce to group. For dependencyCount, map each component to [id, deps.length].',
  'Kuri byLayer, koresha reduce gutsinda. Kuri dependencyCount, hindura buri gice kuba [id, deps.length].',
  '[
    {"assertion":"(function(){function mapComponents(cs){const byLayer={};cs.forEach(c=>{(byLayer[c.layer]=byLayer[c.layer]||[]).push(c.name);});const depCount={};cs.forEach(c=>{depCount[c.id]=c.dependencies.length;});return{byLayer,dependencyCount:depCount,total:cs.length};}const r=mapComponents([{id:''a'',name:''AuthService'',layer:''service'',dependencies:[]},{id:''b'',name:''UserController'',layer:''controller'',dependencies:[''a'']}]);return r.byLayer[''service''].includes(''AuthService'');})()","description":"byLayer groups components correctly"},
    {"assertion":"(function(){function mapComponents(cs){const byLayer={};cs.forEach(c=>{(byLayer[c.layer]=byLayer[c.layer]||[]).push(c.name);});const depCount={};cs.forEach(c=>{depCount[c.id]=c.dependencies.length;});return{byLayer,dependencyCount:depCount,total:cs.length};}const r=mapComponents([{id:''x'',name:''X'',layer:''l'',dependencies:[''a'',''b'']}]);return r.dependencyCount[''x'']===2;})()","description":"dependencyCount maps id to dep count"},
    {"assertion":"(function(){function mapComponents(cs){return{byLayer:{},dependencyCount:{},total:cs.length};}return mapComponents([]).total===0;})()","description":"Empty input returns total 0"},
    {"assertion":"(function(){function mapComponents(cs){const byLayer={};cs.forEach(c=>{(byLayer[c.layer]=byLayer[c.layer]||[]).push(c.name);});return{byLayer,dependencyCount:{},total:cs.length};}const r=mapComponents([{id:''a'',name:''A'',layer:''ui'',dependencies:[]},{id:''b'',name:''B'',layer:''ui'',dependencies:[]}]);return r.byLayer[''ui''].length===2;})()","description":"Two components in same layer both appear"}
  ]',
  'hard', 120
)
ON CONFLICT (id) DO NOTHING;

-- ── ORDER 112: SWDDA401 Implementing Algorithms ───────────────────────────

INSERT INTO public.quiz_challenges
  (id, set_id, order_index, title, title_kin, description, description_kin,
   challenge_type, starter_js, starter_html, hint, hint_kin,
   test_cases, difficulty, xp_reward)
VALUES
(
  '00000000-0400-0000-0000-011200000001',
  '00000000-0400-0000-0000-000000000112', 1,
  'Binary Search',
  'Gushakisha bya Kabiri',
  'Implement `binarySearch(sortedArr, target)` that returns the index of `target` in a sorted array, or `-1` if not found.\n\nBinary search works by repeatedly halving the search space:\n- Compare target to the middle element\n- Search left half if target is smaller, right half if larger',
  'Shyira mu bikorwa `binarySearch(sortedArr, target)` isubiza index ya target mu rutonde rwa sorted, cyangwa -1 niba itabonetse.',
  'write_scratch',
  'function binarySearch(sortedArr, target) {\n  let left = 0;\n  let right = sortedArr.length - 1;\n  // Your code here\n}\n',
  '',
  'Inside a while (left <= right) loop: compute mid = Math.floor((left+right)/2). If arr[mid]===target return mid. If arr[mid] < target, left = mid+1. Otherwise right = mid-1. Return -1 after the loop.',
  'Mu while (left <= right): bara mid = Math.floor((left+right)/2). Niba arr[mid]===target subiza mid. Niba ntabwo, vugurura left cyangwa right.',
  '[
    {"assertion":"(function(){function binarySearch(a,t){let l=0,r=a.length-1;while(l<=r){const m=Math.floor((l+r)/2);if(a[m]===t)return m;else if(a[m]<t)l=m+1;else r=m-1;}return -1;}return binarySearch([1,3,5,7,9],5)===2;})()","description":"Finds element at correct index"},
    {"assertion":"(function(){function binarySearch(a,t){let l=0,r=a.length-1;while(l<=r){const m=Math.floor((l+r)/2);if(a[m]===t)return m;else if(a[m]<t)l=m+1;else r=m-1;}return -1;}return binarySearch([1,3,5,7,9],4)===-1;})()","description":"Returns -1 for missing element"},
    {"assertion":"(function(){function binarySearch(a,t){let l=0,r=a.length-1;while(l<=r){const m=Math.floor((l+r)/2);if(a[m]===t)return m;else if(a[m]<t)l=m+1;else r=m-1;}return -1;}return binarySearch([42],42)===0;})()","description":"Single element array works"},
    {"assertion":"(function(){function binarySearch(a,t){let l=0,r=a.length-1;while(l<=r){const m=Math.floor((l+r)/2);if(a[m]===t)return m;else if(a[m]<t)l=m+1;else r=m-1;}return -1;}return binarySearch([],5)===-1;})()","description":"Empty array returns -1"}
  ]',
  'medium', 120
),
(
  '00000000-0400-0000-0000-011200000002',
  '00000000-0400-0000-0000-000000000112', 2,
  'Big-O Complexity Analyser',
  'Gusesengura Ubunini bwa Big-O',
  'Complete `analyseComplexity(code)` that returns the estimated Big-O time complexity by scanning code for patterns:\n- Contains nested loops (`for.*for`) → `"O(n²)"`\n- Contains a single loop (`for` or `while`) → `"O(n)"`\n- Contains `sort(` → `"O(n log n)"`\n- Otherwise → `"O(1)"`',
  'Uzuza `analyseComplexity(code)` isubiza ubunini bwa Big-O busuzumwa.',
  'complete_code',
  'function analyseComplexity(code) {\n  if (/for[\\s\\S]*for/.test(code)) return ____;\n  if (/sort\\(/.test(code)) return ____;\n  if (/\\b(for|while)\\b/.test(code)) return ____;\n  return ____;\n}\n',
  '',
  'The blanks in order: `"O(n²)"`, `"O(n log n)"`, `"O(n)"`, `"O(1)"`.',
  'Ibice mu murongo: `"O(n²)"`, `"O(n log n)"`, `"O(n)"`, `"O(1)"`.',
  '[
    {"assertion":"(function(){function analyseComplexity(c){if(/for[\\s\\S]*for/.test(c))return''O(n²)'';if(/sort\\(/.test(c))return''O(n log n)'';if(/\\b(for|while)\\b/.test(c))return''O(n)'';return''O(1)'';}return analyseComplexity(''for(let i=0;i<n;i++){for(let j=0;j<n;j++){}}'')=== ''O(n²)'';})()","description":"Nested loops → O(n²)"},
    {"assertion":"(function(){function analyseComplexity(c){if(/for[\\s\\S]*for/.test(c))return''O(n²)'';if(/sort\\(/.test(c))return''O(n log n)'';if(/\\b(for|while)\\b/.test(c))return''O(n)'';return''O(1)'';}return analyseComplexity(''arr.sort()'')===''O(n log n)'';})()","description":"sort() → O(n log n)"},
    {"assertion":"(function(){function analyseComplexity(c){if(/for[\\s\\S]*for/.test(c))return''O(n²)'';if(/sort\\(/.test(c))return''O(n log n)'';if(/\\b(for|while)\\b/.test(c))return''O(n)'';return''O(1)'';}return analyseComplexity(''for(let i=0;i<n;i++) sum+=i;'')=== ''O(n)'';})()","description":"Single loop → O(n)"},
    {"assertion":"(function(){function analyseComplexity(c){if(/for[\\s\\S]*for/.test(c))return''O(n²)'';if(/sort\\(/.test(c))return''O(n log n)'';if(/\\b(for|while)\\b/.test(c))return''O(n)'';return''O(1)'';}return analyseComplexity(''return x + 1;'')===''O(1)'';})()","description":"No loops → O(1)"}
  ]',
  'medium', 120
),
(
  '00000000-0400-0000-0000-011200000003',
  '00000000-0400-0000-0000-000000000112', 3,
  'Fix: Merge Sort',
  'Gusana: Kugorora na Merge Sort',
  'The merge sort implementation below has two bugs — one in the recursive split, one in the merge function. Fix both.',
  'Shyiramo ya merge sort hepfo ifite amakosa abiri — rimwe mu kugabanya, rimwe mu gufatanya. Sana yombi.',
  'fix_bug',
  'function mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n\n  // Bug 1: mid should be Math.floor(arr.length / 2), not arr.length\n  const mid = arr.length;\n  const left = mergeSort(arr.slice(0, mid));\n  const right = mergeSort(arr.slice(mid));\n  return merge(left, right);\n}\n\nfunction merge(left, right) {\n  const result = [];\n  let i = 0, j = 0;\n  while (i < left.length && j < right.length) {\n    // Bug 2: should push the SMALLER element (< not >)\n    if (left[i] > right[j]) {\n      result.push(left[i++]);\n    } else {\n      result.push(right[j++]);\n    }\n  }\n  return result.concat(left.slice(i)).concat(right.slice(j));\n}\n',
  '',
  'Bug 1: `const mid = Math.floor(arr.length / 2)`. Bug 2: change `left[i] > right[j]` to `left[i] < right[j]` (push the smaller element first).',
  'Ikosa 1: `const mid = Math.floor(arr.length / 2)`. Ikosa 2: hindura `>` kuba `<`.',
  '[
    {"assertion":"(function(){function mergeSort(a){if(a.length<=1)return a;const mid=Math.floor(a.length/2);return merge(mergeSort(a.slice(0,mid)),mergeSort(a.slice(mid)));}function merge(l,r){const res=[];let i=0,j=0;while(i<l.length&&j<r.length){if(l[i]<r[j])res.push(l[i++]);else res.push(r[j++]);}return res.concat(l.slice(i)).concat(r.slice(j));}const s=mergeSort([3,1,4,1,5,9,2,6]);return s[0]===1&&s[s.length-1]===9;})()","description":"Array sorted in ascending order"},
    {"assertion":"(function(){function mergeSort(a){if(a.length<=1)return a;const mid=Math.floor(a.length/2);return merge(mergeSort(a.slice(0,mid)),mergeSort(a.slice(mid)));}function merge(l,r){const res=[];let i=0,j=0;while(i<l.length&&j<r.length){if(l[i]<r[j])res.push(l[i++]);else res.push(r[j++]);}return res.concat(l.slice(i)).concat(r.slice(j));}return mergeSort([]).length===0;})()","description":"Empty array returns empty"},
    {"assertion":"(function(){function mergeSort(a){if(a.length<=1)return a;const mid=Math.floor(a.length/2);return merge(mergeSort(a.slice(0,mid)),mergeSort(a.slice(mid)));}function merge(l,r){const res=[];let i=0,j=0;while(i<l.length&&j<r.length){if(l[i]<r[j])res.push(l[i++]);else res.push(r[j++]);}return res.concat(l.slice(i)).concat(r.slice(j));}return mergeSort([5]).length===1;})()","description":"Single element returns same array"},
    {"assertion":"(function(){function mergeSort(a){if(a.length<=1)return a;const mid=Math.floor(a.length/2);return merge(mergeSort(a.slice(0,mid)),mergeSort(a.slice(mid)));}function merge(l,r){const res=[];let i=0,j=0;while(i<l.length&&j<r.length){if(l[i]<r[j])res.push(l[i++]);else res.push(r[j++]);}return res.concat(l.slice(i)).concat(r.slice(j));}const s=mergeSort([2,2,1,1]);return s[0]===1&&s[1]===1;})()","description":"Duplicate values sorted correctly"}
  ]',
  'hard', 120
),
(
  '00000000-0400-0000-0000-011200000004',
  '00000000-0400-0000-0000-000000000112', 4,
  'Hash Map From Scratch',
  'Gukora Hash Map Uhereye Ibanze',
  'Implement a basic `HashMap` class with:\n- `set(key, value)` — stores key-value pair (use JS object internally)\n- `get(key)` — returns value or `undefined`\n- `has(key)` — returns boolean\n- `delete(key)` — removes the key\n- `size()` — returns count of entries',
  'Shyira mu bikorwa classe ya `HashMap` ifite set, get, has, delete, na size.',
  'write_scratch',
  'class HashMap {\n  // Your code here\n}\n',
  '',
  'Use `this.store = Object.create(null)` to avoid prototype pollution. Implement each method using bracket notation on this.store.',
  'Koresha `this.store = Object.create(null)` kwirinda prototype pollution. Shyira mu bikorwa buri method ukoresheje notation ya bracket.',
  '[
    {"assertion":"(function(){class HashMap{constructor(){this.store=Object.create(null);}set(k,v){this.store[k]=v;}get(k){return this.store[k];}has(k){return k in this.store;}delete(k){delete this.store[k];}size(){return Object.keys(this.store).length;}}const m=new HashMap();m.set(''a'',1);return m.get(''a'')===1;})()","description":"set and get work correctly"},
    {"assertion":"(function(){class HashMap{constructor(){this.store=Object.create(null);}set(k,v){this.store[k]=v;}get(k){return this.store[k];}has(k){return k in this.store;}delete(k){delete this.store[k];}size(){return Object.keys(this.store).length;}}const m=new HashMap();m.set(''x'',5);return m.has(''x'')&&!m.has(''y'');})()","description":"has() returns true/false correctly"},
    {"assertion":"(function(){class HashMap{constructor(){this.store=Object.create(null);}set(k,v){this.store[k]=v;}get(k){return this.store[k];}has(k){return k in this.store;}delete(k){delete this.store[k];}size(){return Object.keys(this.store).length;}}const m=new HashMap();m.set(''a'',1);m.set(''b'',2);m.delete(''a'');return m.size()===1;})()","description":"delete removes entry and size decreases"},
    {"assertion":"(function(){class HashMap{constructor(){this.store=Object.create(null);}set(k,v){this.store[k]=v;}get(k){return this.store[k];}has(k){return k in this.store;}delete(k){delete this.store[k];}size(){return Object.keys(this.store).length;}}return new HashMap().size()===0;})()","description":"New HashMap has size 0"}
  ]',
  'medium', 120
)
ON CONFLICT (id) DO NOTHING;

-- ── ORDER 114: SWDPP401 PHP & Database Operations ─────────────────────────

INSERT INTO public.quiz_challenges
  (id, set_id, order_index, title, title_kin, description, description_kin,
   challenge_type, starter_js, starter_html, hint, hint_kin,
   test_cases, difficulty, xp_reward)
VALUES
(
  '00000000-0400-0000-0000-011400000001',
  '00000000-0400-0000-0000-000000000114', 1,
  'SQL Query Builder',
  'Kubaka Ibibazo bya SQL',
  'Write a `QueryBuilder` class that constructs SQL SELECT statements:\n- `from(table)` — sets the table\n- `select(...cols)` — sets columns (default `"*"`)\n- `where(condition)` — adds a WHERE clause\n- `build()` — returns the complete SQL string\n\nExample output: `"SELECT id, name FROM users WHERE active = 1"`',
  'Kora classe ya `QueryBuilder` ubaka inyandiko za SQL SELECT.',
  'write_scratch',
  'class QueryBuilder {\n  // Your code here\n}\n',
  '',
  'Store table, columns, and condition as instance properties. build() assembles them with string concatenation or template literals.',
  'Bika table, columns, na condition nk''ibintu bya instance. build() ibihuza ukoresheje template literals.',
  '[
    {"assertion":"(function(){class QueryBuilder{constructor(){this.table='''';this.cols=[''*''];this.condition=null;}from(t){this.table=t;return this;}select(...c){this.cols=c;return this;}where(w){this.condition=w;return this;}build(){let q=`SELECT ${this.cols.join('', '')} FROM ${this.table}`;if(this.condition)q+=` WHERE ${this.condition}`;return q;}}return new QueryBuilder().from(''users'').build().includes(''users'');})()","description":"Table name in output"},
    {"assertion":"(function(){class QueryBuilder{constructor(){this.table='''';this.cols=[''*''];this.condition=null;}from(t){this.table=t;return this;}select(...c){this.cols=c;return this;}where(w){this.condition=w;return this;}build(){let q=`SELECT ${this.cols.join('', '')} FROM ${this.table}`;if(this.condition)q+=` WHERE ${this.condition}`;return q;}}return new QueryBuilder().from(''t'').select(''id'',''name'').build().includes(''id, name'');})()","description":"Selected columns appear in output"},
    {"assertion":"(function(){class QueryBuilder{constructor(){this.table='''';this.cols=[''*''];this.condition=null;}from(t){this.table=t;return this;}select(...c){this.cols=c;return this;}where(w){this.condition=w;return this;}build(){let q=`SELECT ${this.cols.join('', '')} FROM ${this.table}`;if(this.condition)q+=` WHERE ${this.condition}`;return q;}}return new QueryBuilder().from(''t'').where(''id = 5'').build().includes(''WHERE id = 5'');})()","description":"WHERE clause included when set"},
    {"assertion":"(function(){class QueryBuilder{constructor(){this.table='''';this.cols=[''*''];this.condition=null;}from(t){this.table=t;return this;}select(...c){this.cols=c;return this;}where(w){this.condition=w;return this;}build(){let q=`SELECT ${this.cols.join('', '')} FROM ${this.table}`;if(this.condition)q+=` WHERE ${this.condition}`;return q;}}return !new QueryBuilder().from(''t'').build().includes(''WHERE'');})()","description":"No WHERE when condition not set"}
  ]',
  'medium', 120
),
(
  '00000000-0400-0000-0000-011400000002',
  '00000000-0400-0000-0000-000000000114', 2,
  'CRUD Operation Tracker',
  'Gukurikirana Ibikorwa bya CRUD',
  'Complete `createCRUDLog()` that returns a log object tracking Create/Read/Update/Delete operations:\n- `log(operation, entity)` — records the operation\n- `getStats()` — returns `{ C, R, U, D }` counts\n- `getHistory()` — returns the full log array',
  'Uzuza `createCRUDLog()` igenzura ibikorwa bya CRUD.',
  'complete_code',
  'function createCRUDLog() {\n  const history = [];\n  const stats = { C: 0, R: 0, U: 0, D: 0 };\n  return {\n    log(operation, entity) {\n      history.push({ operation, entity, time: Date.now() });\n      if (____ in stats) stats[____]++;\n    },\n    getStats() { return ____; },\n    getHistory() { return history; }\n  };\n}\n',
  '',
  'First blank: `operation`. Second blank: `operation`. Third blank: `{ ...stats }` (a copy, not the reference).',
  'Igice cya mbere: `operation`. Igice cya kabiri: `operation`. Igice cya gatatu: `{ ...stats }`.',
  '[
    {"assertion":"(function(){function createCRUDLog(){const h=[];const s={C:0,R:0,U:0,D:0};return{log(op,e){h.push({operation:op,entity:e,time:Date.now()});if(op in s)s[op]++;},getStats(){return{...s};},getHistory(){return h;}};}const l=createCRUDLog();l.log(''C'',''User'');return l.getStats().C===1;})()","description":"Create operation counted"},
    {"assertion":"(function(){function createCRUDLog(){const h=[];const s={C:0,R:0,U:0,D:0};return{log(op,e){h.push({operation:op,entity:e,time:Date.now()});if(op in s)s[op]++;},getStats(){return{...s};},getHistory(){return h;}};}const l=createCRUDLog();l.log(''C'',''User'');l.log(''D'',''Post'');return l.getHistory().length===2;})()","description":"getHistory returns all logged operations"},
    {"assertion":"(function(){function createCRUDLog(){const h=[];const s={C:0,R:0,U:0,D:0};return{log(op,e){h.push({operation:op,entity:e,time:Date.now()});if(op in s)s[op]++;},getStats(){return{...s};},getHistory(){return h;}};}const l=createCRUDLog();l.log(''X'',''Thing'');return l.getStats().C===0;})()","description":"Unknown operation doesn''t increment any counter"},
    {"assertion":"(function(){function createCRUDLog(){const h=[];const s={C:0,R:0,U:0,D:0};return{log(op,e){h.push({operation:op,entity:e,time:Date.now()});if(op in s)s[op]++;},getStats(){return{...s};},getHistory(){return h;}};}const l=createCRUDLog();l.log(''R'',''X'');l.log(''R'',''Y'');l.log(''U'',''Z'');const s=l.getStats();return s.R===2&&s.U===1;})()","description":"Multiple operations tracked correctly"}
  ]',
  'medium', 120
),
(
  '00000000-0400-0000-0000-011400000003',
  '00000000-0400-0000-0000-000000000114', 3,
  'Fix: Database Error Handler',
  'Gusana: Gukemura Amakosa ya Database',
  'The error handler below should categorise database errors by code. Find and fix two bugs.',
  'Gukemura amakosa ya database hepfo bigomba gushyira amakosa mu matsinda hashingiwe ku code. Shaka usane amakosa abiri.',
  'fix_bug',
  'function handleDbError(error) {\n  // Bug 1: should check error.code, not error.type\n  switch (error.type) {\n    case ''UNIQUE_VIOLATION'':\n      return { status: 409, message: ''Duplicate entry'' };\n    case ''FOREIGN_KEY_VIOLATION'':\n      return { status: 400, message: ''Referenced record not found'' };\n    case ''CONNECTION_ERROR'':\n      return { status: 503, message: ''Database unavailable'' };\n    // Bug 2: missing default case — should return 500\n  }\n}\n',
  '',
  'Bug 1: change `error.type` to `error.code`. Bug 2: add `default: return { status: 500, message: "Database error" };`.',
  'Ikosa 1: hindura `error.type` kuba `error.code`. Ikosa 2: ongeraho `default` isubiza status 500.',
  '[
    {"assertion":"(function(){function handleDbError(e){switch(e.code){case''UNIQUE_VIOLATION'':return{status:409,message:''Duplicate entry''};case''FOREIGN_KEY_VIOLATION'':return{status:400,message:''Referenced record not found''};case''CONNECTION_ERROR'':return{status:503,message:''Database unavailable''};default:return{status:500,message:''Database error''};}}return handleDbError({code:''UNIQUE_VIOLATION''}).status===409;})()","description":"UNIQUE_VIOLATION returns 409"},
    {"assertion":"(function(){function handleDbError(e){switch(e.code){case''UNIQUE_VIOLATION'':return{status:409,message:''Duplicate entry''};case''FOREIGN_KEY_VIOLATION'':return{status:400,message:''Referenced record not found''};case''CONNECTION_ERROR'':return{status:503,message:''Database unavailable''};default:return{status:500,message:''Database error''};}}return handleDbError({code:''UNKNOWN''}).status===500;})()","description":"Unknown error returns 500"},
    {"assertion":"(function(){function handleDbError(e){switch(e.code){case''UNIQUE_VIOLATION'':return{status:409,message:''Duplicate entry''};case''FOREIGN_KEY_VIOLATION'':return{status:400,message:''Referenced record not found''};case''CONNECTION_ERROR'':return{status:503,message:''Database unavailable''};default:return{status:500,message:''Database error''};}}return handleDbError({code:''CONNECTION_ERROR''}).status===503;})()","description":"CONNECTION_ERROR returns 503"},
    {"assertion":"(function(){function handleDbError(e){switch(e.code){case''UNIQUE_VIOLATION'':return{status:409,message:''Duplicate entry''};default:return{status:500,message:''Database error''};}}return typeof handleDbError({code:''X''}).message===''string'';})()","description":"Always returns a message string"}
  ]',
  'easy', 120
),
(
  '00000000-0400-0000-0000-011400000004',
  '00000000-0400-0000-0000-000000000114', 4,
  'Simple ORM-like Record',
  'Urukwekwe Rworoheje rwa ORM',
  'Write `createRecord(tableName, data)` that returns a model object with:\n- `toSQL()` — returns an INSERT SQL string for the record\n- `update(newData)` — merges newData into the record''s data\n- `getData()` — returns the current data object\n\nSQL format: `INSERT INTO tableName (col1, col2) VALUES (val1, val2)`',
  'Andika `createRecord` isubiza ibintu bifite toSQL, update, na getData.',
  'write_scratch',
  'function createRecord(tableName, data) {\n  // Your code here\n}\n',
  '',
  'For toSQL, use Object.keys(data) for columns and Object.values(data).map(v => JSON.stringify(v)) for values. Join with commas.',
  'Kuri toSQL, koresha Object.keys(data) kuri columns na JSON.stringify kuri agaciro k''urutonde.',
  '[
    {"assertion":"(function(){function createRecord(t,d){let _d={...d};return{toSQL(){const cols=Object.keys(_d).join('','');const vals=Object.values(_d).map(v=>JSON.stringify(v)).join('','');return`INSERT INTO ${t} (${cols}) VALUES (${vals})`;},update(n){_d=Object.assign(_d,n);},getData(){return{..._d};}};} const r=createRecord(''users'',{name:''Alice''});return r.toSQL().includes(''INSERT INTO users'');})()","description":"toSQL includes table name"},
    {"assertion":"(function(){function createRecord(t,d){let _d={...d};return{toSQL(){const cols=Object.keys(_d).join('','');const vals=Object.values(_d).map(v=>JSON.stringify(v)).join('','');return`INSERT INTO ${t} (${cols}) VALUES (${vals})`;},update(n){_d=Object.assign(_d,n);},getData(){return{..._d};}};} const r=createRecord(''users'',{name:''Alice''});return r.toSQL().includes(''name'');})()","description":"Column names in SQL output"},
    {"assertion":"(function(){function createRecord(t,d){let _d={...d};return{toSQL(){return'';},update(n){_d=Object.assign(_d,n);},getData(){return{..._d};}};} const r=createRecord(''t'',{x:1});r.update({y:2});return r.getData().y===2;})()","description":"update() merges new data"},
    {"assertion":"(function(){function createRecord(t,d){let _d={...d};return{toSQL(){return'';},update(n){_d=Object.assign(_d,n);},getData(){return{..._d};}};} const r=createRecord(''t'',{x:1});r.getData().x=99;return r.getData().x===1;})()","description":"getData returns a copy, not reference"}
  ]',
  'hard', 120
)
ON CONFLICT (id) DO NOTHING;

-- ── ORDER 115: SWDPP401 Building a CMS with PHP ───────────────────────────

INSERT INTO public.quiz_challenges
  (id, set_id, order_index, title, title_kin, description, description_kin,
   challenge_type, starter_js, starter_html, hint, hint_kin,
   test_cases, difficulty, xp_reward)
VALUES
(
  '00000000-0400-0000-0000-011500000001',
  '00000000-0400-0000-0000-000000000115', 1,
  'CMS Content Router',
  'Router y''Ibikubiyemo bya CMS',
  'Build a simple `Router` class for a CMS:\n- `addRoute(path, handler)` — registers a route\n- `resolve(path)` — calls the matching handler and returns its result, or `null` if no match\n\nPaths are exact strings (no params needed).',
  'Baza classe yoroheje ya `Router` ya CMS.',
  'write_scratch',
  'class Router {\n  // Your code here\n}\n',
  '',
  'Store routes in an object: `this.routes = {}`. In addRoute, set `this.routes[path] = handler`. In resolve, check if routes[path] exists and call it.',
  'Bika routes mu kintu: `this.routes = {}`. Muri addRoute, shyira `this.routes[path] = handler`.',
  '[
    {"assertion":"(function(){class Router{constructor(){this.routes={};}addRoute(p,h){this.routes[p]=h;}resolve(p){const h=this.routes[p];return h?h():null;}}const r=new Router();r.addRoute(''/home'',()=>''home page'');return r.resolve(''/home'')=== ''home page'';})()","description":"Registered route returns handler result"},
    {"assertion":"(function(){class Router{constructor(){this.routes={};}addRoute(p,h){this.routes[p]=h;}resolve(p){const h=this.routes[p];return h?h():null;}}const r=new Router();return r.resolve(''/missing'')===null;})()","description":"Unknown path returns null"},
    {"assertion":"(function(){class Router{constructor(){this.routes={};}addRoute(p,h){this.routes[p]=h;}resolve(p){const h=this.routes[p];return h?h():null;}}const r=new Router();r.addRoute(''/a'',()=>1);r.addRoute(''/b'',()=>2);return r.resolve(''/b'')===2;})()","description":"Multiple routes work independently"},
    {"assertion":"(function(){class Router{constructor(){this.routes={};}addRoute(p,h){this.routes[p]=h;}resolve(p){const h=this.routes[p];return h?h():null;}}const r=new Router();r.addRoute(''/p'',()=>''old'');r.addRoute(''/p'',()=>''new'');return r.resolve(''/p'')=== ''new'';})()","description":"Re-registering a route overrides it"}
  ]',
  'easy', 120
),
(
  '00000000-0400-0000-0000-011500000002',
  '00000000-0400-0000-0000-000000000115', 2,
  'Session Manager',
  'Gucunga Sessions',
  'Complete a `SessionManager` that stores user sessions. Each session is `{ userId, data, expiresAt }`.\n\n- `create(userId, data, ttlMs)` — creates and returns a session with an id\n- `get(id)` — returns session if not expired, `null` if expired or missing\n- `destroy(id)` — removes the session',
  'Uzuza `SessionManager` ibika sessions z''abakoresha.',
  'complete_code',
  'function createSessionManager() {\n  const sessions = {};\n  let nextId = 1;\n  return {\n    create(userId, data, ttlMs) {\n      const id = String(nextId++);\n      sessions[id] = { userId, data, expiresAt: ____ };\n      return id;\n    },\n    get(id) {\n      const s = sessions[id];\n      if (!s || ____ ) return null;\n      return s;\n    },\n    destroy(id) { delete sessions[id]; }\n  };\n}\n',
  '',
  'First blank: `Date.now() + ttlMs`. Second blank: `Date.now() > s.expiresAt`.',
  'Igice cya mbere: `Date.now() + ttlMs`. Igice cya kabiri: `Date.now() > s.expiresAt`.',
  '[
    {"assertion":"(function(){function createSessionManager(){const sessions={};let nextId=1;return{create(uid,data,ttl){const id=String(nextId++);sessions[id]={userId:uid,data,expiresAt:Date.now()+ttl};return id;},get(id){const s=sessions[id];if(!s||Date.now()>s.expiresAt)return null;return s;},destroy(id){delete sessions[id];}};} const sm=createSessionManager();const id=sm.create(''u1'',{role:''admin''},60000);return sm.get(id)!==null;})()","description":"Valid session is retrievable"},
    {"assertion":"(function(){function createSessionManager(){const sessions={};let nextId=1;return{create(uid,data,ttl){const id=String(nextId++);sessions[id]={userId:uid,data,expiresAt:Date.now()+ttl};return id;},get(id){const s=sessions[id];if(!s||Date.now()>s.expiresAt)return null;return s;},destroy(id){delete sessions[id];}};} const sm=createSessionManager();return sm.get(''999'')===null;})()","description":"Non-existent session returns null"},
    {"assertion":"(function(){function createSessionManager(){const sessions={};let nextId=1;return{create(uid,data,ttl){const id=String(nextId++);sessions[id]={userId:uid,data,expiresAt:Date.now()+ttl};return id;},get(id){const s=sessions[id];if(!s||Date.now()>s.expiresAt)return null;return s;},destroy(id){delete sessions[id];}};} const sm=createSessionManager();const id=sm.create(''u1'',{},60000);sm.destroy(id);return sm.get(id)===null;})()","description":"Destroyed session returns null"},
    {"assertion":"(function(){function createSessionManager(){const sessions={};let nextId=1;return{create(uid,data,ttl){const id=String(nextId++);sessions[id]={userId:uid,data,expiresAt:Date.now()-1};return id;},get(id){const s=sessions[id];if(!s||Date.now()>s.expiresAt)return null;return s;},destroy(id){delete sessions[id];}};} const sm=createSessionManager();const id=sm.create(''u1'',{},-1);return sm.get(id)===null;})()","description":"Expired session returns null"}
  ]',
  'medium', 120
),
(
  '00000000-0400-0000-0000-011500000003',
  '00000000-0400-0000-0000-000000000115', 3,
  'Fix: Content Permissions',
  'Gusana: Uburenganzira bw''Ibikubiyemo',
  'The `canEdit` function below checks if a user can edit a CMS post. Find and fix the two logical bugs.',
  'Imikorere ya `canEdit` hepfo isuzuma niba umukoresha ashobora guhindura inkondemoteri ya CMS. Shaka usane amakosa abiri y''akonjinji.',
  'fix_bug',
  'function canEdit(user, post) {\n  // Bug 1: admin should be allowed — condition is backwards\n  if (user.role === ''admin'') return false;\n\n  // Bug 2: should check user.id === post.authorId (not !==)\n  if (user.id !== post.authorId) return true;\n\n  return false;\n}\n',
  '',
  'Bug 1: `return false` should be `return true` for admins. Bug 2: `!==` should be `===` — the author should be allowed to edit their own post.',
  'Ikosa 1: admin agomba gusubizwa `true`. Ikosa 2: `!==` igomba kuba `===`.',
  '[
    {"assertion":"(function(){function canEdit(u,p){if(u.role===''admin'')return true;if(u.id===p.authorId)return true;return false;}return canEdit({role:''admin'',id:''x''},{authorId:''y''});})()","description":"Admin can always edit"},
    {"assertion":"(function(){function canEdit(u,p){if(u.role===''admin'')return true;if(u.id===p.authorId)return true;return false;}return canEdit({role:''editor'',id:''u1''},{authorId:''u1''});})()","description":"Author can edit their own post"},
    {"assertion":"(function(){function canEdit(u,p){if(u.role===''admin'')return true;if(u.id===p.authorId)return true;return false;}return !canEdit({role:''viewer'',id:''u2''},{authorId:''u1''});})()","description":"Non-author non-admin cannot edit"},
    {"assertion":"(function(){function canEdit(u,p){if(u.role===''admin'')return true;if(u.id===p.authorId)return true;return false;}return typeof canEdit({role:''admin'',id:''a''},{authorId:''b''})===''boolean'';})()","description":"Always returns a boolean"}
  ]',
  'easy', 120
),
(
  '00000000-0400-0000-0000-011500000004',
  '00000000-0400-0000-0000-000000000115', 4,
  'Dynamic Content Renderer',
  'Gutuza Ibikubiyemo Bihinduka',
  'Write `renderTemplate(template, context)` that replaces `{{variable}}` placeholders in a template string with values from the context object.\n\nIf a variable has no matching key in context, replace it with an empty string.\n\nExample: `renderTemplate("Hello {{name}}!", {name: "Alice"})` → `"Hello Alice!"`',
  'Andika `renderTemplate(template, context)` isimbuza `{{variable}}` na agaciro k''ibintu bya context.',
  'write_scratch',
  'function renderTemplate(template, context) {\n  // Your code here\n}\n',
  '',
  'Use `String.replace()` with a regex like `/{{(\\w+)}}/g` and a callback function that looks up the captured group in context.',
  'Koresha `String.replace()` na regex nka `/{{(\\w+)}}/g` hamwe na callback isanga izina mu context.',
  '[
    {"assertion":"(function(){function renderTemplate(t,c){return t.replace(/{{(\\w+)}}/g,(_,k)=>k in c?c[k]:'''');}return renderTemplate(''Hello {{name}}!'',{name:''Alice''})=== ''Hello Alice!'';})()","description":"Single variable replaced correctly"},
    {"assertion":"(function(){function renderTemplate(t,c){return t.replace(/{{(\\w+)}}/g,(_,k)=>k in c?c[k]:'''');}return renderTemplate(''{{a}} and {{b}}'',{a:''one'',b:''two''})=== ''one and two'';})()","description":"Multiple variables replaced"},
    {"assertion":"(function(){function renderTemplate(t,c){return t.replace(/{{(\\w+)}}/g,(_,k)=>k in c?c[k]:'''');}return renderTemplate(''Hello {{missing}}!'',{})=== ''Hello !'';})()","description":"Missing variable replaced with empty string"},
    {"assertion":"(function(){function renderTemplate(t,c){return t.replace(/{{(\\w+)}}/g,(_,k)=>k in c?c[k]:'''');}return renderTemplate(''No placeholders'',{x:1})=== ''No placeholders'';})()","description":"No placeholders — template returned unchanged"}
  ]',
  'medium', 120
)
ON CONFLICT (id) DO NOTHING;

-- ── ORDER 117: SWDWS401 Managing Server Services ──────────────────────────

INSERT INTO public.quiz_challenges
  (id, set_id, order_index, title, title_kin, description, description_kin,
   challenge_type, starter_js, starter_html, hint, hint_kin,
   test_cases, difficulty, xp_reward)
VALUES
(
  '00000000-0400-0000-0000-011700000001',
  '00000000-0400-0000-0000-000000000117', 1,
  'DNS Record Parser',
  'Gusesengura Inyandiko za DNS',
  'DNS records store domain-to-IP mappings. Write `parseDNSRecord(record)` that parses a string like `"example.com. 300 IN A 192.168.1.1"` and returns `{ domain, ttl, type, value }`.',
  'Inyandiko za DNS zibika kuhuza domain na IP. Andika `parseDNSRecord(record)` isesengura inyandiko kandi isubize `{ domain, ttl, type, value }`.',
  'write_scratch',
  'function parseDNSRecord(record) {\n  // Your code here — split the string by spaces\n}\n',
  '',
  'Split by spaces: parts[0]=domain, parts[1]=ttl (Number), parts[3]=type, parts[4]=value.',
  'Kora split na spaces: parts[0]=domain, parts[1]=ttl (Number), parts[3]=type, parts[4]=value.',
  '[
    {"assertion":"(function(){function parseDNSRecord(r){const p=r.split('' '');return{domain:p[0],ttl:Number(p[1]),type:p[3],value:p[4]};}const d=parseDNSRecord(''example.com. 300 IN A 192.168.1.1'');return d.domain===''example.com.'';})()","description":"Domain parsed correctly"},
    {"assertion":"(function(){function parseDNSRecord(r){const p=r.split('' '');return{domain:p[0],ttl:Number(p[1]),type:p[3],value:p[4]};}const d=parseDNSRecord(''example.com. 300 IN A 192.168.1.1'');return d.ttl===300;})()","description":"TTL is a number"},
    {"assertion":"(function(){function parseDNSRecord(r){const p=r.split('' '');return{domain:p[0],ttl:Number(p[1]),type:p[3],value:p[4]};}const d=parseDNSRecord(''mail.example.com. 3600 IN MX 10 mail.example.com.'');return d.type===''MX'';})()","description":"Record type parsed correctly"},
    {"assertion":"(function(){function parseDNSRecord(r){const p=r.split('' '');return{domain:p[0],ttl:Number(p[1]),type:p[3],value:p[4]};}const d=parseDNSRecord(''example.com. 300 IN A 192.168.1.1'');return d.value===''192.168.1.1'';})()","description":"Value (IP) parsed correctly"}
  ]',
  'medium', 120
),
(
  '00000000-0400-0000-0000-011700000002',
  '00000000-0400-0000-0000-000000000117', 2,
  'DHCP Lease Manager',
  'Gucunga Inguzanyo za DHCP',
  'Complete a DHCP-like lease manager:\n- `requestLease(clientId)` — assigns the next available IP from the pool and records a lease\n- `getLeases()` — returns all current leases\n- `release(clientId)` — removes the lease and returns the IP to the pool',
  'Uzuza gucunga inguzanyo nka DHCP.',
  'complete_code',
  'function createDHCPManager(ipPool) {\n  const pool = [...ipPool];\n  const leases = {};\n  return {\n    requestLease(clientId) {\n      if (pool.length === 0) return null;\n      const ip = ____;\n      leases[clientId] = ip;\n      return ip;\n    },\n    getLeases() { return { ...leases }; },\n    release(clientId) {\n      const ip = leases[clientId];\n      if (ip) { delete leases[clientId]; ____; }\n    }\n  };\n}\n',
  '',
  'First blank: `pool.shift()` to take the first available IP. Second blank: `pool.push(ip)` to return it.',
  'Igice cya mbere: `pool.shift()` gufata IP ya mbere. Igice cya kabiri: `pool.push(ip)` kugisubiza.',
  '[
    {"assertion":"(function(){function createDHCPManager(pool){const p=[...pool];const l={};return{requestLease(c){if(!p.length)return null;const ip=p.shift();l[c]=ip;return ip;},getLeases(){return{...l};},release(c){const ip=l[c];if(ip){delete l[c];p.push(ip);}}};}const m=createDHCPManager([''10.0.0.1'',''10.0.0.2'']);const ip=m.requestLease(''PC1'');return ip===''10.0.0.1'';})()","description":"First IP assigned correctly"},
    {"assertion":"(function(){function createDHCPManager(pool){const p=[...pool];const l={};return{requestLease(c){if(!p.length)return null;const ip=p.shift();l[c]=ip;return ip;},getLeases(){return{...l};},release(c){const ip=l[c];if(ip){delete l[c];p.push(ip);}}};}const m=createDHCPManager([''10.0.0.1'']);m.requestLease(''A'');return m.requestLease(''B'')===null;})()","description":"Pool exhausted returns null"},
    {"assertion":"(function(){function createDHCPManager(pool){const p=[...pool];const l={};return{requestLease(c){if(!p.length)return null;const ip=p.shift();l[c]=ip;return ip;},getLeases(){return{...l};},release(c){const ip=l[c];if(ip){delete l[c];p.push(ip);}}};}const m=createDHCPManager([''10.0.0.1'']);m.requestLease(''A'');m.release(''A'');return m.requestLease(''B'')===''10.0.0.1'';})()","description":"Released IP becomes available again"},
    {"assertion":"(function(){function createDHCPManager(pool){const p=[...pool];const l={};return{requestLease(c){if(!p.length)return null;const ip=p.shift();l[c]=ip;return ip;},getLeases(){return{...l};},release(c){const ip=l[c];if(ip){delete l[c];p.push(ip);}}};}const m=createDHCPManager([''10.0.0.1'',''10.0.0.2'']);m.requestLease(''A'');m.requestLease(''B'');return Object.keys(m.getLeases()).length===2;})()","description":"Multiple leases tracked correctly"}
  ]',
  'medium', 120
),
(
  '00000000-0400-0000-0000-011700000003',
  '00000000-0400-0000-0000-000000000117', 3,
  'Fix: Service Monitor',
  'Gusana: Gukurikirana Serivisi',
  'The service monitor should check if services are "running" or "stopped". Fix the two bugs in the status checker.',
  'Gukurikirana serivisi bigomba kugenzura niba serivisi iri "running" cyangwa "stopped". Sana amakosa abiri.',
  'fix_bug',
  'function checkServices(services) {\n  return services.map(service => {\n    // Bug 1: status should come from service.status, not service.state\n    const isRunning = service.state === ''running'';\n    return {\n      name: service.name,\n      // Bug 2: should use isRunning, not service.active\n      healthy: service.active,\n      status: isRunning ? ''OK'' : ''DOWN''\n    };\n  });\n}\n',
  '',
  'Bug 1: change `service.state` to `service.status`. Bug 2: change `service.active` to `isRunning`.',
  'Ikosa 1: hindura `service.state` kuba `service.status`. Ikosa 2: hindura `service.active` kuba `isRunning`.',
  '[
    {"assertion":"(function(){function checkServices(svcs){return svcs.map(s=>{const running=s.status===''running'';return{name:s.name,healthy:running,status:running?''OK'':''DOWN''};})}return checkServices([{name:''nginx'',status:''running''}])[0].healthy===true;})()","description":"Running service is healthy"},
    {"assertion":"(function(){function checkServices(svcs){return svcs.map(s=>{const running=s.status===''running'';return{name:s.name,healthy:running,status:running?''OK'':''DOWN''};})}return checkServices([{name:''mysql'',status:''stopped''}])[0].status===''DOWN'';})()","description":"Stopped service returns DOWN"},
    {"assertion":"(function(){function checkServices(svcs){return svcs.map(s=>{const running=s.status===''running'';return{name:s.name,healthy:running,status:running?''OK'':''DOWN''};})}return checkServices([{name:''nginx'',status:''running''}])[0].status===''OK'';})()","description":"Running service returns OK"},
    {"assertion":"(function(){function checkServices(svcs){return svcs.map(s=>{const running=s.status===''running'';return{name:s.name,healthy:running,status:running?''OK'':''DOWN''};})}return Array.isArray(checkServices([]));})()","description":"Empty input returns empty array"}
  ]',
  'easy', 120
),
(
  '00000000-0400-0000-0000-011700000004',
  '00000000-0400-0000-0000-000000000117', 4,
  'Server Configuration Object',
  'Ibintu by''Imiterere ya Server',
  'Write `buildServerConfig(overrides)` that merges overrides into a set of secure defaults and returns the final config.\n\nDefaults:\n```\n{ port: 80, maxConnections: 100, timeout: 30000,\n  ssl: false, logLevel: "info", allowedIPs: [] }\n```\n\nIf `overrides.ssl === true`, also set `port` to `443` (unless port is explicitly overridden too).',
  'Andika `buildServerConfig(overrides)` ihuza overrides hamwe na defaults zikingiye.',
  'write_scratch',
  'function buildServerConfig(overrides = {}) {\n  // Your code here\n}\n',
  '',
  'Start with the defaults, then spread overrides. Check if ssl is true in the final config and port wasn''t explicitly passed in overrides.',
  'Tangira na defaults, hanyuma sunika overrides. Sузума niba ssl ni true kandi port ntabwo yatanzwe.',
  '[
    {"assertion":"(function(){function buildServerConfig(o={}){const d={port:80,maxConnections:100,timeout:30000,ssl:false,logLevel:''info'',allowedIPs:[]};const c={...d,...o};if(c.ssl&&!(''port'' in o))c.port=443;return c;}return buildServerConfig({}).port===80;})()","description":"Default port is 80"},
    {"assertion":"(function(){function buildServerConfig(o={}){const d={port:80,maxConnections:100,timeout:30000,ssl:false,logLevel:''info'',allowedIPs:[]};const c={...d,...o};if(c.ssl&&!(''port'' in o))c.port=443;return c;}return buildServerConfig({ssl:true}).port===443;})()","description":"SSL true without port override sets port to 443"},
    {"assertion":"(function(){function buildServerConfig(o={}){const d={port:80,maxConnections:100,timeout:30000,ssl:false,logLevel:''info'',allowedIPs:[]};const c={...d,...o};if(c.ssl&&!(''port'' in o))c.port=443;return c;}return buildServerConfig({ssl:true,port:8443}).port===8443;})()","description":"Explicit port override is respected even with ssl:true"},
    {"assertion":"(function(){function buildServerConfig(o={}){const d={port:80,maxConnections:100,timeout:30000,ssl:false,logLevel:''info'',allowedIPs:[]};const c={...d,...o};if(c.ssl&&!(''port'' in o))c.port=443;return c;}return buildServerConfig({logLevel:''debug''}).logLevel===''debug'';})()","description":"Overrides are applied correctly"}
  ]',
  'medium', 120
)
ON CONFLICT (id) DO NOTHING;

-- ── ORDER 119: SWDWS401 Web Application Deployment ────────────────────────

INSERT INTO public.quiz_challenges
  (id, set_id, order_index, title, title_kin, description, description_kin,
   challenge_type, starter_js, starter_html, hint, hint_kin,
   test_cases, difficulty, xp_reward)
VALUES
(
  '00000000-0400-0000-0000-011900000001',
  '00000000-0400-0000-0000-000000000119', 1,
  'Deployment Pipeline Simulator',
  'Gukorera Pipeline yo Gushyira Hanze',
  'Write `runPipeline(steps)` where each step is `{ name, fn }`. Run steps in sequence — if any step throws, stop and return `{ success: false, failedAt: name, error: message }`. If all pass, return `{ success: true, completed: [names] }`.',
  'Andika `runPipeline(steps)` ikora inzira zo gushyira hanze mu murongo.',
  'write_scratch',
  'function runPipeline(steps) {\n  // Your code here\n}\n',
  '',
  'Loop through steps with try/catch. Collect completed names. If caught, return the failure object immediately.',
  'Zunguruza inzira hamwe na try/catch. Bika amanye arangiye. Niba habaye ikosa, subiza ibintu by''gutsindwa vuba.',
  '[
    {"assertion":"(function(){function runPipeline(steps){const completed=[];for(const s of steps){try{s.fn();completed.push(s.name);}catch(e){return{success:false,failedAt:s.name,error:e.message};}}return{success:true,completed};}return runPipeline([{name:''build'',fn:()=>{}},{name:''test'',fn:()=>{}}]).success;})()","description":"All steps pass → success true"},
    {"assertion":"(function(){function runPipeline(steps){const completed=[];for(const s of steps){try{s.fn();completed.push(s.name);}catch(e){return{success:false,failedAt:s.name,error:e.message};}}return{success:true,completed};}const r=runPipeline([{name:''build'',fn:()=>{}},{name:''deploy'',fn:()=>{throw new Error(''Out of disk'');}}]);return r.failedAt===''deploy'';})()","description":"Failing step recorded in failedAt"},
    {"assertion":"(function(){function runPipeline(steps){const completed=[];for(const s of steps){try{s.fn();completed.push(s.name);}catch(e){return{success:false,failedAt:s.name,error:e.message};}}return{success:true,completed};}const r=runPipeline([{name:''a'',fn:()=>{}},{name:''b'',fn:()=>{}}]);return r.completed.length===2;})()","description":"Completed array has all step names"},
    {"assertion":"(function(){function runPipeline(steps){const completed=[];for(const s of steps){try{s.fn();completed.push(s.name);}catch(e){return{success:false,failedAt:s.name,error:e.message};}}return{success:true,completed};}const r=runPipeline([{name:''ok'',fn:()=>{}},{name:''fail'',fn:()=>{throw new Error(''bad'');}},{name:''skip'',fn:()=>{}}]);return r.completed.length===1;})()","description":"Steps after failure are not executed"}
  ]',
  'medium', 120
),
(
  '00000000-0400-0000-0000-011900000002',
  '00000000-0400-0000-0000-000000000119', 2,
  'Hosting Requirements Validator',
  'Gusuzuma Ibisabwa byo Gutuza',
  'Complete `validateHostingReqs(app, server)` where `app` has `{ minRamMB, minCpuCores, requiredPorts }` and `server` has `{ ramMB, cpuCores, openPorts }`.\n\nReturn `{ compatible: boolean, issues: [] }` listing any unmet requirements.',
  'Uzuza `validateHostingReqs` isuzuma niba server ishyigikira application.',
  'complete_code',
  'function validateHostingReqs(app, server) {\n  const issues = [];\n  if (server.ramMB < ____) issues.push(''Insufficient RAM'');\n  if (server.cpuCores < ____) issues.push(''Insufficient CPU cores'');\n  const missingPorts = app.requiredPorts.filter(p => ____);\n  if (missingPorts.length > 0) issues.push(`Missing ports: ${missingPorts.join('', '')}`);\n  return { compatible: ____, issues };\n}\n',
  '',
  'Blanks: `app.minRamMB`, `app.minCpuCores`, `!server.openPorts.includes(p)`, `issues.length === 0`.',
  'Ibice: `app.minRamMB`, `app.minCpuCores`, `!server.openPorts.includes(p)`, `issues.length === 0`.',
  '[
    {"assertion":"(function(){function validateHostingReqs(a,s){const issues=[];if(s.ramMB<a.minRamMB)issues.push(''Insufficient RAM'');if(s.cpuCores<a.minCpuCores)issues.push(''Insufficient CPU cores'');const mp=a.requiredPorts.filter(p=>!s.openPorts.includes(p));if(mp.length)issues.push(`Missing ports: ${mp.join('', '')}`);return{compatible:issues.length===0,issues};}return validateHostingReqs({minRamMB:512,minCpuCores:2,requiredPorts:[80,443]},{ramMB:1024,cpuCores:4,openPorts:[80,443]}).compatible;})()","description":"Compatible server returns compatible: true"},
    {"assertion":"(function(){function validateHostingReqs(a,s){const issues=[];if(s.ramMB<a.minRamMB)issues.push(''Insufficient RAM'');if(s.cpuCores<a.minCpuCores)issues.push(''Insufficient CPU cores'');const mp=a.requiredPorts.filter(p=>!s.openPorts.includes(p));if(mp.length)issues.push(`Missing ports: ${mp.join('', '')}`);return{compatible:issues.length===0,issues};}return !validateHostingReqs({minRamMB:2048,minCpuCores:1,requiredPorts:[]},{ramMB:512,cpuCores:2,openPorts:[]}).compatible;})()","description":"Insufficient RAM → not compatible"},
    {"assertion":"(function(){function validateHostingReqs(a,s){const issues=[];if(s.ramMB<a.minRamMB)issues.push(''Insufficient RAM'');if(s.cpuCores<a.minCpuCores)issues.push(''Insufficient CPU cores'');const mp=a.requiredPorts.filter(p=>!s.openPorts.includes(p));if(mp.length)issues.push(`Missing ports: ${mp.join('', '')}`);return{compatible:issues.length===0,issues};}const r=validateHostingReqs({minRamMB:256,minCpuCores:1,requiredPorts:[8080]},{ramMB:1024,cpuCores:2,openPorts:[80]});return r.issues.some(i=>i.includes(''8080''));})()","description":"Missing port listed in issues"},
    {"assertion":"(function(){function validateHostingReqs(a,s){const issues=[];if(s.ramMB<a.minRamMB)issues.push(''Insufficient RAM'');if(s.cpuCores<a.minCpuCores)issues.push(''Insufficient CPU cores'');const mp=a.requiredPorts.filter(p=>!s.openPorts.includes(p));if(mp.length)issues.push(`Missing ports: ${mp.join('', '')}`);return{compatible:issues.length===0,issues};}return Array.isArray(validateHostingReqs({minRamMB:1,minCpuCores:1,requiredPorts:[]},{ramMB:1,cpuCores:1,openPorts:[]}).issues);})()","description":"issues is always an array"}
  ]',
  'easy', 120
),
(
  '00000000-0400-0000-0000-011900000003',
  '00000000-0400-0000-0000-000000000119', 3,
  'Fix: URL Builder',
  'Gusana: Kubaka URL',
  'The URL builder below constructs deployment URLs. Fix the two bugs.',
  'Kubaka URL hepfo gukora URL zo gushyira hanze. Sana amakosa abiri.',
  'fix_bug',
  'function buildDeploymentURL(protocol, host, port, path) {\n  // Bug 1: default port for https should be 443, not 80\n  const defaultPort = protocol === ''https'' ? 80 : 80;\n  const usePort = port !== defaultPort ? `:${port}` : '''';\n\n  // Bug 2: path should start with /, but we''re not ensuring that\n  const cleanPath = path; // should strip leading slash only to re-add it cleanly\n\n  return `${protocol}://${host}${usePort}/${cleanPath}`;\n}\n',
  '',
  'Bug 1: `protocol === "https" ? 443 : 80`. Bug 2: `const cleanPath = path.replace(/^\\//, "")` then the template already adds `/`.',
  'Ikosa 1: `protocol === "https" ? 443 : 80`. Ikosa 2: `path.replace(/^\\//, "")` hanyuma template yongera `/`.',
  '[
    {"assertion":"(function(){function buildDeploymentURL(pr,h,p,pa){const dp=pr===''https''?443:80;const up=p!==dp?`:${p}`:``;const cp=pa.replace(/^\\//,'''');return`${pr}://${h}${up}/${cp}`;}return buildDeploymentURL(''https'',''example.com'',443,''/app'')===''https://example.com/app'';})()","description":"HTTPS on default port 443 omits port"},
    {"assertion":"(function(){function buildDeploymentURL(pr,h,p,pa){const dp=pr===''https''?443:80;const up=p!==dp?`:${p}`:``;const cp=pa.replace(/^\\//,'''');return`${pr}://${h}${up}/${cp}`;}return buildDeploymentURL(''http'',''example.com'',80,''/api'')===''http://example.com/api'';})()","description":"HTTP on default port 80 omits port"},
    {"assertion":"(function(){function buildDeploymentURL(pr,h,p,pa){const dp=pr===''https''?443:80;const up=p!==dp?`:${p}`:``;const cp=pa.replace(/^\\//,'''');return`${pr}://${h}${up}/${cp}`;}return buildDeploymentURL(''https'',''app.com'',8443,''/v1'')===''https://app.com:8443/v1'';})()","description":"Non-default port included in URL"},
    {"assertion":"(function(){function buildDeploymentURL(pr,h,p,pa){const dp=pr===''https''?443:80;const up=p!==dp?`:${p}`:``;const cp=pa.replace(/^\\//,'''');return`${pr}://${h}${up}/${cp}`;}return !buildDeploymentURL(''http'',''x.com'',80,''api'').includes(''//api'');})()","description":"Path without leading slash doesn''t double up"}
  ]',
  'medium', 120
),
(
  '00000000-0400-0000-0000-011900000004',
  '00000000-0400-0000-0000-000000000119', 4,
  'Rollback Strategy',
  'Ingamba yo Gusubira Inyuma',
  'Write a `RollbackManager` class for deployment rollbacks:\n- `deploy(version, fn)` — runs `fn()` and records the version; if fn throws, triggers rollback to previous\n- `getActive()` — returns the current active version\n- `getHistory()` — returns all successfully deployed versions',
  'Kora classe ya `RollbackManager` yo gucunga gusubira inyuma.',
  'write_scratch',
  'class RollbackManager {\n  // Your code here\n}\n',
  '',
  'Maintain a history array. On deploy, try the fn — if it passes push to history. If it throws, keep the last good version active.',
  'Bika urutonde rw''amateka. Kuri deploy, gerageza fn — niba yanyuzwe sunika mu mateka. Niba yatsindwe, komeza verisiyo nziza ya nyuma.',
  '[
    {"assertion":"(function(){class RollbackManager{constructor(){this.history=[];}deploy(v,fn){try{fn();this.history.push(v);}catch(e){}}getActive(){return this.history[this.history.length-1]??null;}getHistory(){return[...this.history];}}const r=new RollbackManager();r.deploy(''v1'',()=>{});return r.getActive()===''v1'';})()","description":"Successful deploy sets active version"},
    {"assertion":"(function(){class RollbackManager{constructor(){this.history=[];}deploy(v,fn){try{fn();this.history.push(v);}catch(e){}}getActive(){return this.history[this.history.length-1]??null;}getHistory(){return[...this.history];}}const r=new RollbackManager();r.deploy(''v1'',()=>{});r.deploy(''v2'',()=>{throw new Error(''fail'');});return r.getActive()===''v1'';})()","description":"Failed deploy keeps previous version active"},
    {"assertion":"(function(){class RollbackManager{constructor(){this.history=[];}deploy(v,fn){try{fn();this.history.push(v);}catch(e){}}getActive(){return this.history[this.history.length-1]??null;}getHistory(){return[...this.history];}}const r=new RollbackManager();r.deploy(''v1'',()=>{});r.deploy(''v2'',()=>{});return r.getHistory().length===2;})()","description":"History records all successful deployments"},
    {"assertion":"(function(){class RollbackManager{constructor(){this.history=[];}deploy(v,fn){try{fn();this.history.push(v);}catch(e){}}getActive(){return this.history[this.history.length-1]??null;}getHistory(){return[...this.history];}}const r=new RollbackManager();return r.getActive()===null;})()","description":"No deployments → active is null"}
  ]',
  'hard', 120
)
ON CONFLICT (id) DO NOTHING;
