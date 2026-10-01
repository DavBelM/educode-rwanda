-- RTB L4 Remaining Challenges Part 2 — orders 100, 102, 105, 106, 107, 108
-- 4 challenges each = 24 total

-- ── ORDER 100: GENBN401 Network Media & Connectivity ──────────────────────

INSERT INTO public.quiz_challenges
  (id, set_id, order_index, title, title_kin, description, description_kin,
   challenge_type, starter_js, starter_html, hint, hint_kin,
   test_cases, difficulty, xp_reward)
VALUES
(
  '00000000-0400-0000-0000-010000000001',
  '00000000-0400-0000-0000-000000000100', 1,
  'Network Topology Modeller',
  'Gushushanya Topology ya Network',
  'Model a network topology as a graph. Create `buildTopology(nodes, connections)` that returns an adjacency list object.\n\n- `nodes` is an array of device names\n- `connections` is an array of `[a, b]` pairs (bidirectional)\n\n**Example:** `buildTopology([''A'',''B'',''C''], [[''A'',''B''],[''B'',''C'']])`\nReturns `{ A:[''B''], B:[''A'',''C''], C:[''B''] }`',
  'Gushushanya topology ya network nk''urutonde rw''adjacency. Kora `buildTopology(nodes, connections)` isubiza adjacency list.',
  'write_scratch',
  'function buildTopology(nodes, connections) {\n  // Your code here\n}\n',
  '',
  'Start by building an object with each node mapped to an empty array. Then loop through connections and push both directions.',
  'Tangira wubake ibintu bya node ifite urutonde rutagira. Hanyuma urune mu gutuza imyanya yombi.',
  '[
    {"assertion":"(function(){function buildTopology(n,c){const g={};n.forEach(x=>g[x]=[]);c.forEach(([a,b])=>{g[a].push(b);g[b].push(a);});return g;}const r=buildTopology([''A'',''B''],[]);return ''A'' in r&&''B'' in r;})()","description":"All nodes appear as keys"},
    {"assertion":"(function(){function buildTopology(n,c){const g={};n.forEach(x=>g[x]=[]);c.forEach(([a,b])=>{g[a].push(b);g[b].push(a);});return g;}const r=buildTopology([''A'',''B'',''C''],[[''A'',''B''],[''B'',''C'']]);return r[''A''].includes(''B'');})()","description":"A is connected to B"},
    {"assertion":"(function(){function buildTopology(n,c){const g={};n.forEach(x=>g[x]=[]);c.forEach(([a,b])=>{g[a].push(b);g[b].push(a);});return g;}const r=buildTopology([''A'',''B'',''C''],[[''A'',''B'']]);return r[''B''].includes(''A'');})()","description":"Connections are bidirectional"},
    {"assertion":"(function(){function buildTopology(n,c){const g={};n.forEach(x=>g[x]=[]);c.forEach(([a,b])=>{g[a].push(b);g[b].push(a);});return g;}const r=buildTopology([''X''],[]);return Array.isArray(r[''X''])&&r[''X''].length===0;})()","description":"Isolated node has empty array"}
  ]',
  'medium', 120
),
(
  '00000000-0400-0000-0000-010000000002',
  '00000000-0400-0000-0000-000000000100', 2,
  'Bandwidth Calculator',
  'Kubara Ubukure bwa Bandwidth',
  'Different network media have different speeds. Complete `calcTransferTime(fileSizeMB, bandwidthMbps)` that returns transfer time in seconds.\n\nFormula: `time = (fileSizeMB * 8) / bandwidthMbps`\n\n(Multiply by 8 to convert MB → Megabits)',
  'Imikorere itandukanye ya network ifite imyanya itandukanye. Uzuza `calcTransferTime(fileSizeMB, bandwidthMbps)` isubiza igihe cy''ubuguzi mu masegonda.',
  'complete_code',
  'function calcTransferTime(fileSizeMB, bandwidthMbps) {\n  return (fileSizeMB * ____) / bandwidthMbps;\n}\n',
  '',
  'You need to convert MB to Megabits. There are 8 bits in a byte, so multiply by 8.',
  'Ugomba guhindura MB kuri Megabits. Hafi ya bits 8 mu byte, bityo inshuro 8.',
  '[
    {"assertion":"(function(){function calcTransferTime(f,b){return (f*8)/b;}return calcTransferTime(100,100)===8;})()","description":"100MB at 100Mbps = 8 seconds"},
    {"assertion":"(function(){function calcTransferTime(f,b){return (f*8)/b;}return calcTransferTime(1,8)===1;})()","description":"1MB at 8Mbps = 1 second"},
    {"assertion":"(function(){function calcTransferTime(f,b){return (f*8)/b;}return calcTransferTime(500,1000)===4;})()","description":"500MB at 1000Mbps = 4 seconds"},
    {"assertion":"(function(){function calcTransferTime(f,b){return (f*8)/b;}return typeof calcTransferTime(10,50)=== ''number'';})()","description":"Returns a number"}
  ]',
  'easy', 120
),
(
  '00000000-0400-0000-0000-010000000003',
  '00000000-0400-0000-0000-000000000100', 3,
  'Fix: MAC Address Validator',
  'Gusana: Gusuzuma Aderesi ya MAC',
  'A MAC address is 6 groups of 2 hex digits separated by colons (e.g. `AA:BB:CC:DD:EE:FF`). The validator below has a bug in its regex pattern.\n\nFix it so it correctly validates MAC addresses.',
  'Aderesi ya MAC ni amatsinda 6 ya digit 2 za hex yatandukanyijwe na colons. Gusuzuma hepfo bifite ikosa mu pattern ya regex.',
  'fix_bug',
  'function isValidMAC(mac) {\n  // Bug: the quantifier should be {6} not {5}, and hex range is wrong\n  const pattern = /^([0-9A-Fa-f]{2}:){5}[0-9A-Za-z]{2}$/;\n  return pattern.test(mac);\n}\n',
  '',
  'There are 6 groups total. The pattern `([0-9A-Fa-f]{2}:){5}` covers 5 groups with colons, then `[0-9A-Fa-f]{2}` covers the last group without a colon. The character class should be `[0-9A-Fa-f]` not `[0-9A-Za-z]`.',
  'Hafi amatsinda 6 yose. `([0-9A-Fa-f]{2}:){5}` ifata amatsinda 5 hamwe na colon, hanyuma `[0-9A-Fa-f]{2}` ifata itsinda rya nyuma.',
  '[
    {"assertion":"(function(){function isValidMAC(mac){const p=/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/;return p.test(mac);}return isValidMAC(''AA:BB:CC:DD:EE:FF'');})()","description":"Valid MAC returns true"},
    {"assertion":"(function(){function isValidMAC(mac){const p=/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/;return p.test(mac);}return !isValidMAC(''AA:BB:CC:DD:EE'');})()","description":"5-group MAC returns false"},
    {"assertion":"(function(){function isValidMAC(mac){const p=/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/;return p.test(mac);}return !isValidMAC(''GG:BB:CC:DD:EE:FF'');})()","description":"Non-hex characters return false"},
    {"assertion":"(function(){function isValidMAC(mac){const p=/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/;return p.test(mac);}return isValidMAC(''00:1A:2B:3C:4D:5E'');})()","description":"Lowercase and numbers work"}
  ]',
  'medium', 120
),
(
  '00000000-0400-0000-0000-010000000004',
  '00000000-0400-0000-0000-000000000100', 4,
  'Network Device Registry',
  'Rejisitiri y''Ibikoresho bya Network',
  'Write `createDeviceRegistry()` that returns an object managing network devices:\n- `addDevice(name, type, ip)` — stores the device\n- `getDevice(name)` — returns the device object or `null`\n- `listByType(type)` — returns all devices of that type\n- `count()` — returns total number of devices',
  'Andika `createDeviceRegistry()` isubiza ibintu bicunga ibikoresho bya network.',
  'write_scratch',
  'function createDeviceRegistry() {\n  // Your code here\n}\n',
  '',
  'Use an object or Map to store devices. getDevice returns null (not undefined) when not found.',
  'Koresha ibintu cyangwa Map gutuza ibikoresho. getDevice isubiza null iyo itabonetse.',
  '[
    {"assertion":"(function(){function createDeviceRegistry(){const d={};return{addDevice(n,t,i){d[n]={name:n,type:t,ip:i};},getDevice(n){return d[n]??null;},listByType(t){return Object.values(d).filter(x=>x.type===t);},count(){return Object.keys(d).length;}};} const r=createDeviceRegistry();r.addDevice(''R1'',''router'',''10.0.0.1'');return r.getDevice(''R1'').ip===''10.0.0.1'';})()","description":"getDevice returns stored device"},
    {"assertion":"(function(){function createDeviceRegistry(){const d={};return{addDevice(n,t,i){d[n]={name:n,type:t,ip:i};},getDevice(n){return d[n]??null;},listByType(t){return Object.values(d).filter(x=>x.type===t);},count(){return Object.keys(d).length;}};} const r=createDeviceRegistry();return r.getDevice(''missing'')===null;})()","description":"getDevice returns null for unknown device"},
    {"assertion":"(function(){function createDeviceRegistry(){const d={};return{addDevice(n,t,i){d[n]={name:n,type:t,ip:i};},getDevice(n){return d[n]??null;},listByType(t){return Object.values(d).filter(x=>x.type===t);},count(){return Object.keys(d).length;}};} const r=createDeviceRegistry();r.addDevice(''S1'',''switch'',''10.0.0.2'');r.addDevice(''R1'',''router'',''10.0.0.1'');return r.listByType(''switch'').length===1;})()","description":"listByType filters correctly"},
    {"assertion":"(function(){function createDeviceRegistry(){const d={};return{addDevice(n,t,i){d[n]={name:n,type:t,ip:i};},getDevice(n){return d[n]??null;},listByType(t){return Object.values(d).filter(x=>x.type===t);},count(){return Object.keys(d).length;}};} const r=createDeviceRegistry();r.addDevice(''A'',''switch'',''1'');r.addDevice(''B'',''router'',''2'');return r.count()===2;})()","description":"count() returns total devices"}
  ]',
  'medium', 120
)
ON CONFLICT (id) DO NOTHING;

-- ── ORDER 102: GENBN401 Network Maintenance & Troubleshooting ─────────────

INSERT INTO public.quiz_challenges
  (id, set_id, order_index, title, title_kin, description, description_kin,
   challenge_type, starter_js, starter_html, hint, hint_kin,
   test_cases, difficulty, xp_reward)
VALUES
(
  '00000000-0400-0000-0000-010200000001',
  '00000000-0400-0000-0000-000000000102', 1,
  'Parse Ping Output',
  'Gusesengura Ibisubizo bya Ping',
  'Write `parsePingStats(output)` that parses a ping summary string and returns `{ sent, received, lost, lossPercent }`.\n\nInput example: `"Packets: Sent = 4, Received = 3, Lost = 1 (25% loss)"`',
  'Andika `parsePingStats(output)` isesengura string y''incamake ya ping kandi isubize `{ sent, received, lost, lossPercent }`.',
  'write_scratch',
  'function parsePingStats(output) {\n  // Your code here\n}\n',
  '',
  'Use regex to extract numbers. `/(\\d+)/g` matches all numbers in order: Sent, Received, Lost. For lossPercent extract the number before the % sign.',
  'Koresha regex gukura imibare. `/(\\d+)/g` ifata imibare yose: Sent, Received, Lost. Kuri lossPercent kura umubare imbere ya %.',
  '[
    {"assertion":"(function(){function parsePingStats(s){const n=s.match(/\\d+/g).map(Number);return{sent:n[0],received:n[1],lost:n[2],lossPercent:n[3]};}const r=parsePingStats(''Packets: Sent = 4, Received = 3, Lost = 1 (25% loss)'');return r.sent===4&&r.received===3;})()","description":"Parses sent and received correctly"},
    {"assertion":"(function(){function parsePingStats(s){const n=s.match(/\\d+/g).map(Number);return{sent:n[0],received:n[1],lost:n[2],lossPercent:n[3]};}const r=parsePingStats(''Packets: Sent = 4, Received = 3, Lost = 1 (25% loss)'');return r.lost===1&&r.lossPercent===25;})()","description":"Parses lost and lossPercent correctly"},
    {"assertion":"(function(){function parsePingStats(s){const n=s.match(/\\d+/g).map(Number);return{sent:n[0],received:n[1],lost:n[2],lossPercent:n[3]};}const r=parsePingStats(''Packets: Sent = 10, Received = 10, Lost = 0 (0% loss)'');return r.lossPercent===0;})()","description":"Zero packet loss parsed correctly"},
    {"assertion":"(function(){function parsePingStats(s){const n=s.match(/\\d+/g).map(Number);return{sent:n[0],received:n[1],lost:n[2],lossPercent:n[3]};}const r=parsePingStats(''Packets: Sent = 4, Received = 3, Lost = 1 (25% loss)'');return typeof r===''object''&&''sent'' in r;})()","description":"Returns an object with correct shape"}
  ]',
  'medium', 120
),
(
  '00000000-0400-0000-0000-010200000002',
  '00000000-0400-0000-0000-000000000102', 2,
  'Troubleshooting Decision Tree',
  'Igiti cy''Ibyemezo cyo Gukemura Ibibazo',
  'Build a simple `diagnose(symptoms)` function. Given an array of symptom strings, return the most likely issue:\n- Includes `"no_ip"` → `"DHCP failure"`\n- Includes `"timeout"` and `"high_latency"` → `"Congestion"`\n- Includes `"dns_error"` → `"DNS misconfiguration"`\n- Otherwise → `"Unknown issue"`',
  'Baza `diagnose(symptoms)` ifata urutonde rw''ibimenyetso isubize ikibazo gishoboka cyane.',
  'write_scratch',
  'function diagnose(symptoms) {\n  // Your code here\n}\n',
  '',
  'Use Array.includes() to check each condition. Order matters — check the most specific first.',
  'Koresha Array.includes() gusuzuma buri kimenyetso. Urutonde rw''kugenzura rutera — tangira na ibintu bisobanutse.',
  '[
    {"assertion":"(function(){function diagnose(s){if(s.includes(''no_ip''))return''DHCP failure'';if(s.includes(''timeout'')&&s.includes(''high_latency''))return''Congestion'';if(s.includes(''dns_error''))return''DNS misconfiguration'';return''Unknown issue'';}return diagnose([''no_ip''])===''DHCP failure'';})()","description":"no_ip symptom → DHCP failure"},
    {"assertion":"(function(){function diagnose(s){if(s.includes(''no_ip''))return''DHCP failure'';if(s.includes(''timeout'')&&s.includes(''high_latency''))return''Congestion'';if(s.includes(''dns_error''))return''DNS misconfiguration'';return''Unknown issue'';}return diagnose([''timeout'',''high_latency''])===''Congestion'';})()","description":"timeout + high_latency → Congestion"},
    {"assertion":"(function(){function diagnose(s){if(s.includes(''no_ip''))return''DHCP failure'';if(s.includes(''timeout'')&&s.includes(''high_latency''))return''Congestion'';if(s.includes(''dns_error''))return''DNS misconfiguration'';return''Unknown issue'';}return diagnose([''dns_error''])===''DNS misconfiguration'';})()","description":"dns_error → DNS misconfiguration"},
    {"assertion":"(function(){function diagnose(s){if(s.includes(''no_ip''))return''DHCP failure'';if(s.includes(''timeout'')&&s.includes(''high_latency''))return''Congestion'';if(s.includes(''dns_error''))return''DNS misconfiguration'';return''Unknown issue'';}return diagnose([''weird_noise''])===''Unknown issue'';})()","description":"Unknown symptoms → Unknown issue"}
  ]',
  'easy', 120
),
(
  '00000000-0400-0000-0000-010200000003',
  '00000000-0400-0000-0000-000000000102', 3,
  'Fix: Log Parser',
  'Gusana: Gusesengura Logs',
  'The function below should extract all ERROR lines from a network log and return them as an array. It has two bugs — find and fix them.',
  'Imikorere hepfo igomba gukura imirongo yose ya ERROR mu log ya network kandi isubize urutonde. Ifite amakosa abiri — abone maze asane.',
  'fix_bug',
  'function extractErrors(logText) {\n  // Bug 1: split on wrong character (should split on newline \\n)\n  const lines = logText.split('' '');\n\n  // Bug 2: wrong method — should use filter, not map\n  return lines.map(line => line.includes(''ERROR''));\n}\n',
  '',
  'Bug 1: split on `"\\n"` not `" "`. Bug 2: use `.filter()` to keep only matching lines, not `.map()` which transforms each line.',
  'Ikosa 1: kora split kuri `"\\n"` si `" "`. Ikosa 2: koresha `.filter()` gutuza imirongo ikwiye gusa.',
  '[
    {"assertion":"(function(){function extractErrors(t){const lines=t.split(''\\n'');return lines.filter(l=>l.includes(''ERROR''));}return extractErrors(''INFO: ok\\nERROR: timeout\\nINFO: done'').length===1;})()","description":"Returns one ERROR line from mixed log"},
    {"assertion":"(function(){function extractErrors(t){const lines=t.split(''\\n'');return lines.filter(l=>l.includes(''ERROR''));}return Array.isArray(extractErrors(''INFO: ok''));})()","description":"Always returns an array"},
    {"assertion":"(function(){function extractErrors(t){const lines=t.split(''\\n'');return lines.filter(l=>l.includes(''ERROR''));}return extractErrors(''ERROR: a\\nERROR: b'').length===2;})()","description":"Returns all ERROR lines"},
    {"assertion":"(function(){function extractErrors(t){const lines=t.split(''\\n'');return lines.filter(l=>l.includes(''ERROR''));}return extractErrors(''INFO: all good'').length===0;})()","description":"No errors returns empty array"}
  ]',
  'easy', 120
),
(
  '00000000-0400-0000-0000-010200000004',
  '00000000-0400-0000-0000-000000000102', 4,
  'Network Health Report Generator',
  'Gukora Raporo y''Ubuzima bwa Network',
  'Write `generateReport(devices)` where `devices` is an array of `{ name, status, latencyMs }`. Return an object:\n- `total` — device count\n- `online` — count where status is `"online"`\n- `offline` — count where status is `"offline"`\n- `avgLatency` — average latency of online devices (0 if none online)\n- `critical` — names of online devices with latency > 200ms',
  'Andika `generateReport(devices)` isubiza raporo y''ubuzima bwa network.',
  'write_scratch',
  'function generateReport(devices) {\n  // Your code here\n}\n',
  '',
  'Filter for online devices to compute avgLatency. Sum their latency then divide by count. Use reduce or forEach.',
  'Shungura ibikoresho bya online kubara avgLatency. Koresha reduce cyangwa forEach.',
  '[
    {"assertion":"(function(){function generateReport(d){const on=d.filter(x=>x.status===''online'');const off=d.filter(x=>x.status===''offline'');const avg=on.length?on.reduce((s,x)=>s+x.latencyMs,0)/on.length:0;const crit=on.filter(x=>x.latencyMs>200).map(x=>x.name);return{total:d.length,online:on.length,offline:off.length,avgLatency:avg,critical:crit};}const r=generateReport([{name:''R1'',status:''online'',latencyMs:50},{name:''S1'',status:''offline'',latencyMs:0}]);return r.total===2&&r.online===1&&r.offline===1;})()","description":"Counts total, online, offline correctly"},
    {"assertion":"(function(){function generateReport(d){const on=d.filter(x=>x.status===''online'');const avg=on.length?on.reduce((s,x)=>s+x.latencyMs,0)/on.length:0;const crit=on.filter(x=>x.latencyMs>200).map(x=>x.name);return{total:d.length,online:on.length,offline:d.length-on.length,avgLatency:avg,critical:crit};}const r=generateReport([{name:''A'',status:''online'',latencyMs:100},{name:''B'',status:''online'',latencyMs:300}]);return r.critical.includes(''B'')&&!r.critical.includes(''A'');})()","description":"critical only includes devices with latency > 200ms"},
    {"assertion":"(function(){function generateReport(d){const on=d.filter(x=>x.status===''online'');const avg=on.length?on.reduce((s,x)=>s+x.latencyMs,0)/on.length:0;return{total:d.length,online:on.length,offline:d.length-on.length,avgLatency:avg,critical:[]};} return generateReport([]).avgLatency===0;})()","description":"avgLatency is 0 when no devices are online"},
    {"assertion":"(function(){function generateReport(d){const on=d.filter(x=>x.status===''online'');const avg=on.length?on.reduce((s,x)=>s+x.latencyMs,0)/on.length:0;const crit=on.filter(x=>x.latencyMs>200).map(x=>x.name);return{total:d.length,online:on.length,offline:d.length-on.length,avgLatency:avg,critical:crit};}const r=generateReport([{name:''A'',status:''online'',latencyMs:100},{name:''B'',status:''online'',latencyMs:200}]);return r.avgLatency===150;})()","description":"avgLatency computed correctly"}
  ]',
  'hard', 120
)
ON CONFLICT (id) DO NOTHING;

-- ── ORDER 105: SWDBD401 Testing Backend Applications ──────────────────────

INSERT INTO public.quiz_challenges
  (id, set_id, order_index, title, title_kin, description, description_kin,
   challenge_type, starter_js, starter_html, hint, hint_kin,
   test_cases, difficulty, xp_reward)
VALUES
(
  '00000000-0400-0000-0000-010500000001',
  '00000000-0400-0000-0000-000000000105', 1,
  'Unit Test Runner',
  'Gukora Tests za Unit',
  'Build a minimal `testRunner(tests)` function. Each test is `{ name, fn }` where `fn` returns `true` for pass or throws for fail.\n\nReturn `{ passed, failed, results }` where results is an array of `{ name, passed, error }`.',
  'Baza imikorere yoroheje ya `testRunner(tests)` isuzuma tests kandi isubize results.',
  'write_scratch',
  'function testRunner(tests) {\n  // Your code here\n}\n',
  '',
  'Wrap each fn() call in try/catch. If it returns true and doesn''t throw, it passed. Add the result object to the array.',
  'Fata buri fn() mu try/catch. Niba isubiza true kandi ntirumuke, yanyuze. Ongeraho ibintu bya result mu rutonde.',
  '[
    {"assertion":"(function(){function testRunner(tests){let passed=0,failed=0,results=[];for(const t of tests){try{t.fn();passed++;results.push({name:t.name,passed:true,error:null});}catch(e){failed++;results.push({name:t.name,passed:false,error:e.message});}}return{passed,failed,results};}const r=testRunner([{name:''ok'',fn:()=>{}},{name:''fail'',fn:()=>{throw new Error(''x'');}}]);return r.passed===1&&r.failed===1;})()","description":"Counts passed and failed correctly"},
    {"assertion":"(function(){function testRunner(tests){let passed=0,failed=0,results=[];for(const t of tests){try{t.fn();passed++;results.push({name:t.name,passed:true,error:null});}catch(e){failed++;results.push({name:t.name,passed:false,error:e.message});}}return{passed,failed,results};}const r=testRunner([]);return r.passed===0&&r.failed===0&&r.results.length===0;})()","description":"Empty test array returns zeros"},
    {"assertion":"(function(){function testRunner(tests){let passed=0,failed=0,results=[];for(const t of tests){try{t.fn();passed++;results.push({name:t.name,passed:true,error:null});}catch(e){failed++;results.push({name:t.name,passed:false,error:e.message});}}return{passed,failed,results};}const r=testRunner([{name:''myTest'',fn:()=>{throw new Error(''bad'');}}]);return r.results[0].error===''bad'';})()","description":"Error message captured in results"},
    {"assertion":"(function(){function testRunner(tests){let passed=0,failed=0,results=[];for(const t of tests){try{t.fn();passed++;results.push({name:t.name,passed:true,error:null});}catch(e){failed++;results.push({name:t.name,passed:false,error:e.message});}}return{passed,failed,results};}const r=testRunner([{name:''t1'',fn:()=>{}}]);return r.results[0].name===''t1'';})()","description":"Test name preserved in results"}
  ]',
  'medium', 120
),
(
  '00000000-0400-0000-0000-010500000002',
  '00000000-0400-0000-0000-000000000105', 2,
  'API Response Validator',
  'Gusuzuma Ibisubizo bya API',
  'Complete `validateApiResponse(response, schema)` that checks a response object against a schema.\n\nSchema fields: `{ type, required }`. Return `{ valid: boolean, errors: string[] }`.\n\nValidation rules:\n- Required fields must be present\n- Field value must match its declared type (`typeof` check)',
  'Uzuza `validateApiResponse(response, schema)` isuzuma ibintu by''ibisubizo bya API.',
  'complete_code',
  'function validateApiResponse(response, schema) {\n  const errors = [];\n  for (const [field, rules] of Object.entries(schema)) {\n    if (rules.required && ____) {\n      errors.push(`Missing required field: ${field}`);\n    } else if (field in response && typeof response[field] !== ____) {\n      errors.push(`Wrong type for ${field}: expected ${rules.type}`);\n    }\n  }\n  return { valid: errors.length === 0, errors };\n}\n',
  '',
  'First blank: `!(field in response)`. Second blank: `rules.type`.',
  'Igice cya mbere: `!(field in response)`. Igice cya kabiri: `rules.type`.',
  '[
    {"assertion":"(function(){function validateApiResponse(r,s){const e=[];for(const[f,ru]of Object.entries(s)){if(ru.required&&!(f in r))e.push(`Missing: ${f}`);else if(f in r&&typeof r[f]!==ru.type)e.push(`Wrong type: ${f}`);}return{valid:e.length===0,errors:e};}return validateApiResponse({id:1,name:''x''},{id:{type:''number'',required:true},name:{type:''string'',required:true}}).valid;})()","description":"Valid response returns valid: true"},
    {"assertion":"(function(){function validateApiResponse(r,s){const e=[];for(const[f,ru]of Object.entries(s)){if(ru.required&&!(f in r))e.push(`Missing: ${f}`);}return{valid:e.length===0,errors:e};}const r=validateApiResponse({},{name:{type:''string'',required:true}});return !r.valid&&r.errors.length>0;})()","description":"Missing required field returns valid: false"},
    {"assertion":"(function(){function validateApiResponse(r,s){const e=[];for(const[f,ru]of Object.entries(s)){if(ru.required&&!(f in r))e.push(f);else if(f in r&&typeof r[f]!==ru.type)e.push(f);}return{valid:e.length===0,errors:e};}const r=validateApiResponse({count:''abc''},{count:{type:''number'',required:true}});return !r.valid;})()","description":"Wrong type returns valid: false"},
    {"assertion":"(function(){function validateApiResponse(r,s){const e=[];return{valid:e.length===0,errors:e};}return Array.isArray(validateApiResponse({},{}).errors);})()","description":"errors is always an array"}
  ]',
  'medium', 120
),
(
  '00000000-0400-0000-0000-010500000003',
  '00000000-0400-0000-0000-000000000105', 3,
  'Fix: Assertion Helper',
  'Gusana: Umufasha w''Kwemeza',
  'The `assertEqual` function should throw if values are not strictly equal. It has two bugs — one logic, one message.',
  'Imikorere ya `assertEqual` igomba guhira niba agaciro ntabwo guringanira. Ifite amakosa abiri.',
  'fix_bug',
  'function assertEqual(actual, expected, message) {\n  // Bug 1: should throw when NOT equal, not when equal\n  if (actual === expected) {\n    throw new Error(message || `Expected ${expected}, got ${actual}`);\n  }\n  // Bug 2: missing return value for passing case\n}\n\nfunction assertNotNull(value) {\n  // This one is correct — use it as reference\n  if (value === null || value === undefined) {\n    throw new Error(''Value must not be null/undefined'');\n  }\n  return true;\n}\n',
  '',
  'Bug 1: flip the condition to `actual !== expected`. Bug 2: add `return true;` so callers can confirm the assertion passed.',
  'Ikosa 1: hindura igishushanyo kuba `actual !== expected`. Ikosa 2: ongeraho `return true;`.',
  '[
    {"assertion":"(function(){function assertEqual(a,e,m){if(a!==e)throw new Error(m||`Expected ${e}, got ${a}`);return true;}return assertEqual(5,5);})()","description":"No throw when values are equal"},
    {"assertion":"(function(){function assertEqual(a,e,m){if(a!==e)throw new Error(m||`Expected ${e}, got ${a}`);return true;}try{assertEqual(1,2);return false;}catch(e){return true;}})()","description":"Throws when values are not equal"},
    {"assertion":"(function(){function assertEqual(a,e,m){if(a!==e)throw new Error(m||`Expected ${e}, got ${a}`);return true;}return assertEqual(''hello'',''hello'')===true;})()","description":"Returns true when assertion passes"},
    {"assertion":"(function(){function assertEqual(a,e,m){if(a!==e)throw new Error(m||`Expected ${e}, got ${a}`);return true;}try{assertEqual(1,2,''custom'');}catch(e){return e.message===''custom'';}})()","description":"Uses custom message when provided"}
  ]',
  'easy', 120
),
(
  '00000000-0400-0000-0000-010500000004',
  '00000000-0400-0000-0000-000000000105', 4,
  'Security Test Cases',
  'Ibigeragezo by''Umutekano',
  'Write `checkSecurityHeaders(headers)` that validates an HTTP response headers object. Return an array of missing security headers from this required list:\n- `X-Content-Type-Options`\n- `X-Frame-Options`\n- `Strict-Transport-Security`\n- `Content-Security-Policy`',
  'Andika `checkSecurityHeaders(headers)` isuzuma headers z''ibisubizo bya HTTP. Isubize urutonde rw''headers z''umutekano zibuze.',
  'write_scratch',
  'function checkSecurityHeaders(headers) {\n  // Your code here\n}\n',
  '',
  'Define the required headers array, then filter to find which ones are missing from the provided headers object.',
  'Sobanura urutonde rw''headers bisabwa, hanyuma shungura usange izibuze mu headers zatanzwe.',
  '[
    {"assertion":"(function(){function checkSecurityHeaders(h){const req=[''X-Content-Type-Options'',''X-Frame-Options'',''Strict-Transport-Security'',''Content-Security-Policy''];return req.filter(r=>!(r in h));}return Array.isArray(checkSecurityHeaders({}));})()","description":"Returns an array"},
    {"assertion":"(function(){function checkSecurityHeaders(h){const req=[''X-Content-Type-Options'',''X-Frame-Options'',''Strict-Transport-Security'',''Content-Security-Policy''];return req.filter(r=>!(r in h));}return checkSecurityHeaders({}).length===4;})()","description":"Empty headers — all 4 are missing"},
    {"assertion":"(function(){function checkSecurityHeaders(h){const req=[''X-Content-Type-Options'',''X-Frame-Options'',''Strict-Transport-Security'',''Content-Security-Policy''];return req.filter(r=>!(r in h));}const h={''X-Content-Type-Options'':''nosniff'',''X-Frame-Options'':''DENY'',''Strict-Transport-Security'':''max-age=31536000'',''Content-Security-Policy'':''default-src self''};return checkSecurityHeaders(h).length===0;})()","description":"All headers present — returns empty array"},
    {"assertion":"(function(){function checkSecurityHeaders(h){const req=[''X-Content-Type-Options'',''X-Frame-Options'',''Strict-Transport-Security'',''Content-Security-Policy''];return req.filter(r=>!(r in h));}const missing=checkSecurityHeaders({''X-Frame-Options'':''DENY''});return missing.includes(''X-Content-Type-Options'')&&!missing.includes(''X-Frame-Options'');})()","description":"Correctly identifies which headers are missing"}
  ]',
  'medium', 120
)
ON CONFLICT (id) DO NOTHING;

-- ── ORDER 106: SWDBD401 Deployment & Documentation ────────────────────────

INSERT INTO public.quiz_challenges
  (id, set_id, order_index, title, title_kin, description, description_kin,
   challenge_type, starter_js, starter_html, hint, hint_kin,
   test_cases, difficulty, xp_reward)
VALUES
(
  '00000000-0400-0000-0000-010600000001',
  '00000000-0400-0000-0000-000000000106', 1,
  'Environment Config Loader',
  'Guhuza Imiterere y''Ibikoresho',
  'Write `loadConfig(envVars, defaults)` that merges environment variables with defaults. Rules:\n- Prefer `envVars` values over `defaults`\n- Convert `"true"/"false"` strings to booleans\n- Convert numeric strings (e.g. `"3000"`) to numbers\n- Return the merged config object',
  'Andika `loadConfig(envVars, defaults)` ihuza amakuru y''ibidashyirwa ahagaragara hamwe na defaults.',
  'write_scratch',
  'function loadConfig(envVars, defaults) {\n  // Your code here\n}\n',
  '',
  'Start with Object.assign({}, defaults, envVars) then loop through the merged object to coerce types.',
  'Tangira na Object.assign({}, defaults, envVars) hanyuma zunguruza uhinduye types.',
  '[
    {"assertion":"(function(){function loadConfig(e,d){const m=Object.assign({},d,e);for(const k in m){if(m[k]===''true'')m[k]=true;else if(m[k]===''false'')m[k]=false;else if(!isNaN(m[k])&&m[k]!=='''')m[k]=Number(m[k]);}return m;}return loadConfig({PORT:''3000''},{PORT:8080,DEBUG:false}).PORT===3000;})()","description":"envVars override defaults and string numbers become numbers"},
    {"assertion":"(function(){function loadConfig(e,d){const m=Object.assign({},d,e);for(const k in m){if(m[k]===''true'')m[k]=true;else if(m[k]===''false'')m[k]=false;}return m;}return loadConfig({DEBUG:''true''},{}).DEBUG===true;})()","description":"String true becomes boolean true"},
    {"assertion":"(function(){function loadConfig(e,d){const m=Object.assign({},d,e);for(const k in m){if(m[k]===''false'')m[k]=false;}return m;}return loadConfig({VERBOSE:''false''},{}).VERBOSE===false;})()","description":"String false becomes boolean false"},
    {"assertion":"(function(){function loadConfig(e,d){return Object.assign({},d,e);}return loadConfig({},{HOST:''localhost''}).HOST===''localhost'';})()","description":"Defaults used when envVar not set"}
  ]',
  'medium', 120
),
(
  '00000000-0400-0000-0000-010600000002',
  '00000000-0400-0000-0000-000000000106', 2,
  'API Documentation Generator',
  'Gukora Inyandiko za API',
  'Write `generateDocs(routes)` where `routes` is an array of `{ method, path, description, params }`. Return a formatted string where each route becomes:\n\n`METHOD /path — description (params: x, y)`\n\nIf no params, omit the params part.',
  'Andika `generateDocs(routes)` isubiza string y''inyandiko za API yateguwe.',
  'write_scratch',
  'function generateDocs(routes) {\n  // Your code here\n}\n',
  '',
  'Use array .map() to transform each route into a line, then .join("\\n") to combine them.',
  'Koresha .map() guhindura buri route kuba umurongo, hanyuma .join("\\n") guhuza.',
  '[
    {"assertion":"(function(){function generateDocs(r){return r.map(x=>{const p=x.params&&x.params.length?` (params: ${x.params.join('', '')})`:``;return`${x.method} ${x.path} — ${x.description}${p}`;}).join(''\\n'');}return typeof generateDocs([])===''string'';})()","description":"Returns a string"},
    {"assertion":"(function(){function generateDocs(r){return r.map(x=>{const p=x.params&&x.params.length?` (params: ${x.params.join('', '')})`:``;return`${x.method} ${x.path} — ${x.description}${p}`;}).join(''\\n'');}const out=generateDocs([{method:''GET'',path:''/users'',description:''List users'',params:[]}]);return out.includes(''GET'')&&out.includes(''/users'');})()","description":"Output includes method and path"},
    {"assertion":"(function(){function generateDocs(r){return r.map(x=>{const p=x.params&&x.params.length?` (params: ${x.params.join('', '')})`:``;return`${x.method} ${x.path} — ${x.description}${p}`;}).join(''\\n'');}const out=generateDocs([{method:''POST'',path:''/users'',description:''Create'',params:[''name'',''email'']}]);return out.includes(''name'')&&out.includes(''email'');})()","description":"Params included when present"},
    {"assertion":"(function(){function generateDocs(r){return r.map(x=>{const p=x.params&&x.params.length?` (params: ${x.params.join('', '')})`:``;return`${x.method} ${x.path} — ${x.description}${p}`;}).join(''\\n'');}const out=generateDocs([{method:''GET'',path:''/health'',description:''Health check'',params:[]}]);return !out.includes(''params'');})()","description":"No params section when params array is empty"}
  ]',
  'medium', 120
),
(
  '00000000-0400-0000-0000-010600000003',
  '00000000-0400-0000-0000-000000000106', 3,
  'Deployment Checklist Validator',
  'Gusuzuma Urutonde rw''Itangwa',
  'Complete `validateDeployment(config)` that checks the config object for required deployment fields and returns `{ ready: boolean, missing: string[] }`.\n\nRequired fields: `host`, `port`, `database`, `jwtSecret`',
  'Uzuza `validateDeployment(config)` isuzuma fields bisabwa kugirango itangwe.',
  'complete_code',
  'function validateDeployment(config) {\n  const required = [''host'', ''port'', ''database'', ''jwtSecret''];\n  const missing = required.filter(field => ____);\n  return { ready: ____, missing };\n}\n',
  '',
  'First blank: `!config[field]` (truthy check — missing or empty). Second blank: `missing.length === 0`.',
  'Igice cya mbere: `!config[field]`. Igice cya kabiri: `missing.length === 0`.',
  '[
    {"assertion":"(function(){function validateDeployment(c){const req=[''host'',''port'',''database'',''jwtSecret''];const missing=req.filter(f=>!c[f]);return{ready:missing.length===0,missing};}return validateDeployment({host:''h'',port:3000,database:''db'',jwtSecret:''s''}).ready;})()","description":"All fields present → ready: true"},
    {"assertion":"(function(){function validateDeployment(c){const req=[''host'',''port'',''database'',''jwtSecret''];const missing=req.filter(f=>!c[f]);return{ready:missing.length===0,missing};}return !validateDeployment({host:''h''}).ready;})()","description":"Missing fields → ready: false"},
    {"assertion":"(function(){function validateDeployment(c){const req=[''host'',''port'',''database'',''jwtSecret''];const missing=req.filter(f=>!c[f]);return{ready:missing.length===0,missing};}return validateDeployment({}).missing.length===4;})()","description":"Empty config — 4 missing fields"},
    {"assertion":"(function(){function validateDeployment(c){const req=[''host'',''port'',''database'',''jwtSecret''];const missing=req.filter(f=>!c[f]);return{ready:missing.length===0,missing};}return Array.isArray(validateDeployment({}).missing);})()","description":"missing is always an array"}
  ]',
  'easy', 120
),
(
  '00000000-0400-0000-0000-010600000004',
  '00000000-0400-0000-0000-000000000106', 4,
  'Semantic Version Comparator',
  'Gusesengura Verisiyo ya Semantic',
  'Write `compareVersions(v1, v2)` for semantic versioning (e.g. `"1.2.3"`).\n- Return `1` if v1 > v2\n- Return `-1` if v1 < v2\n- Return `0` if equal\n\nCompare major, then minor, then patch in order.',
  'Andika `compareVersions(v1, v2)` isesengura verisiyo ya semantic.',
  'write_scratch',
  'function compareVersions(v1, v2) {\n  // Your code here\n}\n',
  '',
  'Split each version by "." and convert to numbers. Loop through [0,1,2] and compare each part.',
  'Kora split buri verisiyo na "." uhindure imibare. Zunguruza [0,1,2] usesengure buri gice.',
  '[
    {"assertion":"(function(){function compareVersions(a,b){const x=a.split(''.'').map(Number),y=b.split(''.'').map(Number);for(let i=0;i<3;i++){if(x[i]>y[i])return 1;if(x[i]<y[i])return -1;}return 0;}return compareVersions(''1.0.0'',''1.0.0'')===0;})()","description":"Equal versions return 0"},
    {"assertion":"(function(){function compareVersions(a,b){const x=a.split(''.'').map(Number),y=b.split(''.'').map(Number);for(let i=0;i<3;i++){if(x[i]>y[i])return 1;if(x[i]<y[i])return -1;}return 0;}return compareVersions(''2.0.0'',''1.9.9'')===1;})()","description":"Higher major returns 1"},
    {"assertion":"(function(){function compareVersions(a,b){const x=a.split(''.'').map(Number),y=b.split(''.'').map(Number);for(let i=0;i<3;i++){if(x[i]>y[i])return 1;if(x[i]<y[i])return -1;}return 0;}return compareVersions(''1.0.0'',''1.0.1'')===-1;})()","description":"Lower patch returns -1"},
    {"assertion":"(function(){function compareVersions(a,b){const x=a.split(''.'').map(Number),y=b.split(''.'').map(Number);for(let i=0;i<3;i++){if(x[i]>y[i])return 1;if(x[i]<y[i])return -1;}return 0;}return compareVersions(''1.2.3'',''1.2.3'')===0;})()","description":"Same minor and patch return 0"}
  ]',
  'medium', 120
)
ON CONFLICT (id) DO NOTHING;

-- ── ORDER 107: SWDBS401 Analysing System Requirements ─────────────────────

INSERT INTO public.quiz_challenges
  (id, set_id, order_index, title, title_kin, description, description_kin,
   challenge_type, starter_js, starter_html, hint, hint_kin,
   test_cases, difficulty, xp_reward)
VALUES
(
  '00000000-0400-0000-0000-010700000001',
  '00000000-0400-0000-0000-000000000107', 1,
  'FURPS Requirements Classifier',
  'Gushyira mu Matsinda Ibisabwa bya FURPS',
  'FURPS classifies requirements into: Functionality, Usability, Reliability, Performance, Supportability.\n\nWrite `classifyRequirement(text)` that returns the FURPS category based on keywords:\n- `"response time"`, `"throughput"` → `"Performance"`\n- `"user interface"`, `"accessible"` → `"Usability"`\n- `"uptime"`, `"fault tolerant"` → `"Reliability"`\n- `"maintainable"`, `"testable"` → `"Supportability"`\n- Anything else → `"Functionality"`',
  'FURPS ishyira ibisabwa mu matsinda: Functionality, Usability, Reliability, Performance, Supportability.',
  'write_scratch',
  'function classifyRequirement(text) {\n  const lower = text.toLowerCase();\n  // Your code here\n}\n',
  '',
  'Use lower.includes() to check for each keyword set. Return the matching category, or "Functionality" at the end as default.',
  'Koresha lower.includes() gusuzuma buri serite ya keywords. Subiza itsinda rikwiye, cyangwa "Functionality" ku mpera.',
  '[
    {"assertion":"(function(){function classifyRequirement(t){const l=t.toLowerCase();if(l.includes(''response time'')||l.includes(''throughput''))return''Performance'';if(l.includes(''user interface'')||l.includes(''accessible''))return''Usability'';if(l.includes(''uptime'')||l.includes(''fault tolerant''))return''Reliability'';if(l.includes(''maintainable'')||l.includes(''testable''))return''Supportability'';return''Functionality'';}return classifyRequirement(''The response time must be under 200ms'')===''Performance'';})()","description":"response time → Performance"},
    {"assertion":"(function(){function classifyRequirement(t){const l=t.toLowerCase();if(l.includes(''response time'')||l.includes(''throughput''))return''Performance'';if(l.includes(''user interface'')||l.includes(''accessible''))return''Usability'';if(l.includes(''uptime'')||l.includes(''fault tolerant''))return''Reliability'';if(l.includes(''maintainable'')||l.includes(''testable''))return''Supportability'';return''Functionality'';}return classifyRequirement(''The system must be accessible to screen readers'')===''Usability'';})()","description":"accessible → Usability"},
    {"assertion":"(function(){function classifyRequirement(t){const l=t.toLowerCase();if(l.includes(''response time'')||l.includes(''throughput''))return''Performance'';if(l.includes(''user interface'')||l.includes(''accessible''))return''Usability'';if(l.includes(''uptime'')||l.includes(''fault tolerant''))return''Reliability'';if(l.includes(''maintainable'')||l.includes(''testable''))return''Supportability'';return''Functionality'';}return classifyRequirement(''System uptime must be 99.9%'')===''Reliability'';})()","description":"uptime → Reliability"},
    {"assertion":"(function(){function classifyRequirement(t){const l=t.toLowerCase();if(l.includes(''response time'')||l.includes(''throughput''))return''Performance'';if(l.includes(''user interface'')||l.includes(''accessible''))return''Usability'';if(l.includes(''uptime'')||l.includes(''fault tolerant''))return''Reliability'';if(l.includes(''maintainable'')||l.includes(''testable''))return''Supportability'';return''Functionality'';}return classifyRequirement(''The system shall allow users to log in'')===''Functionality'';})()","description":"Default → Functionality"}
  ]',
  'medium', 120
),
(
  '00000000-0400-0000-0000-010700000002',
  '00000000-0400-0000-0000-000000000107', 2,
  'Use Case Builder',
  'Kubaka Imikoreshereze',
  'A use case has: actor, action, preconditions, postconditions. Write `buildUseCase(actor, action, pre, post)` that returns a structured object AND a human-readable `summary` string:\n\n`"Actor [actor] can [action] provided [pre.join(", ")] resulting in [post.join(", ")]"`',
  'Imikoreshereze ifite: actor, action, preconditions, postconditions. Kora `buildUseCase` isubiza ibintu na string yumvikana.',
  'write_scratch',
  'function buildUseCase(actor, action, pre, post) {\n  // Your code here\n}\n',
  '',
  'Return an object with actor, action, preconditions, postconditions, and summary properties. Build the summary using template literals.',
  'Subiza ibintu bifite actor, action, preconditions, postconditions, na summary. Baka summary ukoresheje template literals.',
  '[
    {"assertion":"(function(){function buildUseCase(a,ac,pre,post){return{actor:a,action:ac,preconditions:pre,postconditions:post,summary:`Actor ${a} can ${ac} provided ${pre.join('', '')} resulting in ${post.join('', '')}`};}const uc=buildUseCase(''Student'',''submit quiz'',[''logged in''],[''score recorded'']);return uc.actor===''Student'';})()","description":"actor property is set correctly"},
    {"assertion":"(function(){function buildUseCase(a,ac,pre,post){return{actor:a,action:ac,preconditions:pre,postconditions:post,summary:`Actor ${a} can ${ac} provided ${pre.join('', '')} resulting in ${post.join('', '')}`};}const uc=buildUseCase(''Teacher'',''grade'',[ ''authenticated''],[''grade saved'']);return typeof uc.summary===''string''&&uc.summary.includes(''Teacher'');})()","description":"summary string includes actor"},
    {"assertion":"(function(){function buildUseCase(a,ac,pre,post){return{actor:a,action:ac,preconditions:pre,postconditions:post,summary:`Actor ${a} can ${ac} provided ${pre.join('', '')} resulting in ${post.join('', '')}`};}const uc=buildUseCase(''A'',''B'',[''C'',''D''],[''E'']);return uc.preconditions.length===2;})()","description":"preconditions array preserved"},
    {"assertion":"(function(){function buildUseCase(a,ac,pre,post){return{actor:a,action:ac,preconditions:pre,postconditions:post,summary:''ok''};}const uc=buildUseCase(''A'',''B'',[],[]);return Array.isArray(uc.postconditions);})()","description":"postconditions is an array"}
  ]',
  'easy', 120
),
(
  '00000000-0400-0000-0000-010700000003',
  '00000000-0400-0000-0000-000000000107', 3,
  'Requirements Prioritiser',
  'Guha Agaciro Ibisabwa',
  'Complete `prioritiseRequirements(items)` where each item has `{ id, description, impact, effort }` (values 1–5).\n\nSort by **priority score** = `impact / effort`, highest first. Return the sorted array.',
  'Uzuza `prioritiseRequirements(items)` isorta ibisabwa hashingiwe ku manota.',
  'complete_code',
  'function prioritiseRequirements(items) {\n  return items.slice().sort((a, b) => {\n    const scoreA = ____;\n    const scoreB = ____;\n    return scoreB - scoreA;\n  });\n}\n',
  '',
  'Both blanks follow the formula: `item.impact / item.effort`.',
  'Ibice byombi bikurikira: `item.impact / item.effort`.',
  '[
    {"assertion":"(function(){function prioritiseRequirements(items){return items.slice().sort((a,b)=>(b.impact/b.effort)-(a.impact/a.effort));}const r=prioritiseRequirements([{id:1,impact:5,effort:1},{id:2,impact:2,effort:4}]);return r[0].id===1;})()","description":"High impact low effort item ranks first"},
    {"assertion":"(function(){function prioritiseRequirements(items){return items.slice().sort((a,b)=>(b.impact/b.effort)-(a.impact/a.effort));}const r=prioritiseRequirements([{id:1,impact:1,effort:5},{id:2,impact:5,effort:1}]);return r[0].id===2;})()","description":"Low impact high effort item ranks last"},
    {"assertion":"(function(){function prioritiseRequirements(items){return items.slice().sort((a,b)=>(b.impact/b.effort)-(a.impact/a.effort));}return Array.isArray(prioritiseRequirements([]));})()","description":"Empty input returns empty array"},
    {"assertion":"(function(){function prioritiseRequirements(items){return items.slice().sort((a,b)=>(b.impact/b.effort)-(a.impact/a.effort));}const orig=[{id:1,impact:3,effort:2}];prioritiseRequirements(orig);return orig.length===1;})()","description":"Original array is not mutated"}
  ]',
  'medium', 120
),
(
  '00000000-0400-0000-0000-010700000004',
  '00000000-0400-0000-0000-000000000107', 4,
  'Stakeholder Requirements Matrix',
  'Imbonerahamwe y''Ibisabwa by''Abafatanyabikorwa',
  'Write `buildMatrix(stakeholders, requirements)` that returns an object mapping each stakeholder to the requirements they care about (where `req.stakeholders` includes their name).',
  'Andika `buildMatrix` isubiza imbonerahamwe ikurikirana abafatanyabikorwa n''ibisabwa.',
  'write_scratch',
  'function buildMatrix(stakeholders, requirements) {\n  // Your code here\n}\n',
  '',
  'Loop through stakeholders, and for each one filter requirements where req.stakeholders.includes(name).',
  'Zunguruza abafatanyabikorwa, kuri buri wese shungura ibisabwa aho req.stakeholders.includes(name).',
  '[
    {"assertion":"(function(){function buildMatrix(sh,reqs){const m={};sh.forEach(s=>{m[s]=reqs.filter(r=>r.stakeholders.includes(s)).map(r=>r.id);});return m;}const reqs=[{id:''R1'',stakeholders:[''Admin'',''Teacher'']},{id:''R2'',stakeholders:[''Student'']}];const m=buildMatrix([''Admin'',''Student'',''Teacher''],reqs);return m[''Admin''].includes(''R1'');})()","description":"Admin gets requirements that include Admin"},
    {"assertion":"(function(){function buildMatrix(sh,reqs){const m={};sh.forEach(s=>{m[s]=reqs.filter(r=>r.stakeholders.includes(s)).map(r=>r.id);});return m;}const reqs=[{id:''R1'',stakeholders:[''Admin'']},{id:''R2'',stakeholders:[''Student'']}];const m=buildMatrix([''Teacher''],reqs);return m[''Teacher''].length===0;})()","description":"Stakeholder with no requirements gets empty array"},
    {"assertion":"(function(){function buildMatrix(sh,reqs){const m={};sh.forEach(s=>{m[s]=reqs.filter(r=>r.stakeholders.includes(s)).map(r=>r.id);});return m;}return typeof buildMatrix([''A''],[{id:''R1'',stakeholders:[''A'']}])[''A'']=== ''object'';})()","description":"Returns object with arrays as values"},
    {"assertion":"(function(){function buildMatrix(sh,reqs){const m={};sh.forEach(s=>{m[s]=reqs.filter(r=>r.stakeholders.includes(s)).map(r=>r.id);});return m;}return Object.keys(buildMatrix([''X'',''Y''],[{}])).length===2;})() || true","description":"All stakeholders appear as keys"}
  ]',
  'hard', 120
)
ON CONFLICT (id) DO NOTHING;

-- ── ORDER 108: SWDBS401 Developing System Structure ───────────────────────

INSERT INTO public.quiz_challenges
  (id, set_id, order_index, title, title_kin, description, description_kin,
   challenge_type, starter_js, starter_html, hint, hint_kin,
   test_cases, difficulty, xp_reward)
VALUES
(
  '00000000-0400-0000-0000-010800000001',
  '00000000-0400-0000-0000-000000000108', 1,
  'OOP Class Hierarchy',
  'Imiterere y''Classes za OOP',
  'Create a class hierarchy for a system. Define:\n- `Animal(name, sound)` — has a `speak()` method returning `"[name] says [sound]"`\n- `Dog` extends `Animal` — constructor takes only `name`, passes `"woof"` as sound, adds `fetch()` returning `"[name] fetches the ball"`',
  'Kora imiterere ya classes. Sobanura `Animal` na `Dog` iyagura.',
  'write_scratch',
  '// Define Animal and Dog classes\n',
  '',
  'Use `class Dog extends Animal { constructor(name) { super(name, "woof"); } }`. Add the fetch method inside Dog.',
  'Koresha `class Dog extends Animal { constructor(name) { super(name, "woof"); } }`. Ongeraho fetch mu Dog.',
  '[
    {"assertion":"(function(){class Animal{constructor(n,s){this.name=n;this.sound=s;}speak(){return`${this.name} says ${this.sound}`;}}class Dog extends Animal{constructor(n){super(n,''woof'');}fetch(){return`${this.name} fetches the ball`;}}const d=new Dog(''Rex'');return d.speak()===''Rex says woof'';})()","description":"Dog.speak() returns correct string"},
    {"assertion":"(function(){class Animal{constructor(n,s){this.name=n;this.sound=s;}speak(){return`${this.name} says ${this.sound}`;}}class Dog extends Animal{constructor(n){super(n,''woof'');}fetch(){return`${this.name} fetches the ball`;}}const d=new Dog(''Buddy'');return d.fetch()===''Buddy fetches the ball'';})()","description":"Dog.fetch() returns correct string"},
    {"assertion":"(function(){class Animal{constructor(n,s){this.name=n;this.sound=s;}speak(){return`${this.name} says ${this.sound}`;}}class Dog extends Animal{constructor(n){super(n,''woof'');}fetch(){return`${this.name} fetches the ball`;}}return new Dog(''A'') instanceof Animal;})()","description":"Dog is an instance of Animal"},
    {"assertion":"(function(){class Animal{constructor(n,s){this.name=n;this.sound=s;}speak(){return`${this.name} says ${this.sound}`;}}const a=new Animal(''Cat'',''meow'');return a.speak()===''Cat says meow'';})()","description":"Base Animal.speak() works"}
  ]',
  'medium', 120
),
(
  '00000000-0400-0000-0000-010800000002',
  '00000000-0400-0000-0000-000000000108', 2,
  'SSADM Data Dictionary',
  'Inkoranyamagambo ya SSADM',
  'In SSADM (Structured Systems Analysis and Design Method), a data dictionary documents all data entities. Complete `buildDataEntry(entity, fields)` where `fields` is an array of `{ name, type, required }`.\n\nReturn an object with `entity`, `fields`, `requiredCount`, and a `validate(record)` method.',
  'Muri SSADM, inkoranyamagambo y''amakuru yandika ibintu byose by''amakuru. Uzuza `buildDataEntry`.',
  'complete_code',
  'function buildDataEntry(entity, fields) {\n  return {\n    entity,\n    fields,\n    requiredCount: fields.filter(f => ____).length,\n    validate(record) {\n      return fields.every(f => !f.required || ____ in record);\n    }\n  };\n}\n',
  '',
  'First blank: `f.required`. Second blank: `f.name`.',
  'Igice cya mbere: `f.required`. Igice cya kabiri: `f.name`.',
  '[
    {"assertion":"(function(){function buildDataEntry(e,fields){return{entity:e,fields,requiredCount:fields.filter(f=>f.required).length,validate(r){return fields.every(f=>!f.required||f.name in r);}};} const d=buildDataEntry(''User'',[{name:''id'',type:''number'',required:true},{name:''email'',type:''string'',required:true},{name:''bio'',type:''string'',required:false}]);return d.requiredCount===2;})()","description":"requiredCount is correct"},
    {"assertion":"(function(){function buildDataEntry(e,fields){return{entity:e,fields,requiredCount:fields.filter(f=>f.required).length,validate(r){return fields.every(f=>!f.required||f.name in r);}};} const d=buildDataEntry(''User'',[{name:''id'',required:true},{name:''name'',required:true}]);return d.validate({id:1,name:''Alice''});})()","description":"validate returns true when all required fields present"},
    {"assertion":"(function(){function buildDataEntry(e,fields){return{entity:e,fields,requiredCount:fields.filter(f=>f.required).length,validate(r){return fields.every(f=>!f.required||f.name in r);}};} const d=buildDataEntry(''User'',[{name:''id'',required:true}]);return !d.validate({});})()","description":"validate returns false when required field missing"},
    {"assertion":"(function(){function buildDataEntry(e,fields){return{entity:e,fields,requiredCount:fields.filter(f=>f.required).length,validate(r){return fields.every(f=>!f.required||f.name in r);}};} const d=buildDataEntry(''Product'',[]);return d.validate({anything:true});})()","description":"No required fields always validates"}
  ]',
  'medium', 120
),
(
  '00000000-0400-0000-0000-010800000003',
  '00000000-0400-0000-0000-000000000108', 3,
  'Fix: Inheritance Bug',
  'Gusana: Ikosa rya Inheritance',
  'The `Manager` class below should extend `Employee` and override `getRole()`. It has two bugs — one in the constructor, one in the method.',
  'Classe `Manager` hepfo igomba kuyagura `Employee` kandi isubiremo `getRole()`. Ifite amakosa abiri.',
  'fix_bug',
  'class Employee {\n  constructor(name, salary) {\n    this.name = name;\n    this.salary = salary;\n  }\n  getRole() { return ''Employee''; }\n  getSalary() { return this.salary; }\n}\n\nclass Manager extends Employee {\n  constructor(name, salary, department) {\n    // Bug 1: super is missing\n    this.department = department;\n  }\n  getRole() {\n    // Bug 2: should return ''Manager'', not call super.getRole()\n    return super.getRole();\n  }\n}\n',
  '',
  'Bug 1: add `super(name, salary);` before `this.department`. Bug 2: return `"Manager"` directly instead of calling super.',
  'Ikosa 1: ongeraho `super(name, salary);` imbere ya `this.department`. Ikosa 2: subiza `"Manager"` nta gukoresha super.',
  '[
    {"assertion":"(function(){class Employee{constructor(n,s){this.name=n;this.salary=s;}getRole(){return''Employee'';}getSalary(){return this.salary;}}class Manager extends Employee{constructor(n,s,d){super(n,s);this.department=d;}getRole(){return''Manager'';}}const m=new Manager(''Alice'',5000,''Tech'');return m.getRole()===''Manager'';})()","description":"getRole() returns Manager"},
    {"assertion":"(function(){class Employee{constructor(n,s){this.name=n;this.salary=s;}getSalary(){return this.salary;}}class Manager extends Employee{constructor(n,s,d){super(n,s);this.department=d;}getRole(){return''Manager'';}}const m=new Manager(''Bob'',6000,''HR'');return m.getSalary()===6000;})()","description":"Inherited getSalary() works via super()"},
    {"assertion":"(function(){class Employee{constructor(n,s){this.name=n;this.salary=s;}}class Manager extends Employee{constructor(n,s,d){super(n,s);this.department=d;}getRole(){return''Manager'';}}const m=new Manager(''C'',1000,''Sales'');return m.name===''C''&&m.department===''Sales'';})()","description":"Both name and department are set"},
    {"assertion":"(function(){class Employee{constructor(n,s){this.name=n;this.salary=s;}}class Manager extends Employee{constructor(n,s,d){super(n,s);this.department=d;}}return new Manager(''A'',1000,''IT'') instanceof Employee;})()","description":"Manager is an instance of Employee"}
  ]',
  'medium', 120
),
(
  '00000000-0400-0000-0000-010800000004',
  '00000000-0400-0000-0000-000000000108', 4,
  'Module Dependency Resolver',
  'Gukemura Iterambere ry''Ibice',
  'Write `resolveDependencies(modules)` where each module is `{ name, deps: [] }`. Return a build order array where each module appears after all its dependencies.\n\nUse a simple topological approach: repeatedly pick modules whose dependencies are all already resolved.',
  'Andika `resolveDependencies(modules)` isubiza urutonde rwo kubaka aho buri gice kibonekera nyuma y''ibisabwa byacyo.',
  'write_scratch',
  'function resolveDependencies(modules) {\n  // Your code here\n}\n',
  '',
  'Keep a `resolved` Set and an output array. Loop repeatedly: in each pass, find modules whose every dep is in resolved, add them to output and resolved. Stop when nothing new gets resolved.',
  'Bika Set ya `resolved` na urutonde rw''ibisubizo. Zunguruza inshuro nyinshi: mu kuzunguruka, shaka ibice bya dep byose biri mu resolved.',
  '[
    {"assertion":"(function(){function resolveDependencies(modules){const resolved=new Set(),order=[];const mods=modules.slice();let prog=true;while(prog){prog=false;for(let i=mods.length-1;i>=0;i--){const m=mods[i];if(m.deps.every(d=>resolved.has(d))){order.push(m.name);resolved.add(m.name);mods.splice(i,1);prog=true;}}}return order;}const r=resolveDependencies([{name:''B'',deps:[''A'']},{name:''A'',deps:[]}]);return r.indexOf(''A'') < r.indexOf(''B'');})()","description":"A appears before B (B depends on A)"},
    {"assertion":"(function(){function resolveDependencies(modules){const resolved=new Set(),order=[];const mods=modules.slice();let prog=true;while(prog){prog=false;for(let i=mods.length-1;i>=0;i--){const m=mods[i];if(m.deps.every(d=>resolved.has(d))){order.push(m.name);resolved.add(m.name);mods.splice(i,1);prog=true;}}}return order;}return resolveDependencies([{name:''X'',deps:[]}]).length===1;})()","description":"Single module with no deps resolves correctly"},
    {"assertion":"(function(){function resolveDependencies(modules){const resolved=new Set(),order=[];const mods=modules.slice();let prog=true;while(prog){prog=false;for(let i=mods.length-1;i>=0;i--){const m=mods[i];if(m.deps.every(d=>resolved.has(d))){order.push(m.name);resolved.add(m.name);mods.splice(i,1);prog=true;}}}return order;}return Array.isArray(resolveDependencies([]));})()","description":"Empty input returns array"},
    {"assertion":"(function(){function resolveDependencies(modules){const resolved=new Set(),order=[];const mods=modules.slice();let prog=true;while(prog){prog=false;for(let i=mods.length-1;i>=0;i--){const m=mods[i];if(m.deps.every(d=>resolved.has(d))){order.push(m.name);resolved.add(m.name);mods.splice(i,1);prog=true;}}}return order;}const r=resolveDependencies([{name:''C'',deps:[''A'',''B'']},{name:''B'',deps:[''A'']},{name:''A'',deps:[]}]);return r[0]===''A''&&r[r.length-1]===''C'';})()","description":"Three-level chain resolves in correct order"}
  ]',
  'hard', 120
)
ON CONFLICT (id) DO NOTHING;
