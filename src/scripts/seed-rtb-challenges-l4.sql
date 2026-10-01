-- =============================================
-- EduCode Rwanda — RTB Level 4 Challenges
-- Run AFTER seed-rtb-sets.sql
-- Modules: GENBN401, SWDBD401, SWDBS401, SWDDA401, SWDPP401, SWDWS401
-- =============================================

-- ─── GENBN401 LO2: IP Addressing & Subnetting ─────────────────────────────────

INSERT INTO public.quiz_challenges
  (set_id, title, title_kin, description, description_kin, challenge_type, difficulty,
   starter_js, starter_html, test_cases, xp_reward, order_index, hint, hint_kin)
VALUES
(
  '00000000-0400-0000-0000-000000000101',
  'Validate an IPv4 Address',
  'Gusuzuma Aderesi ya IPv4',
  'Write `isValidIPv4(ip)` that returns `true` if the string is a valid IPv4 address — exactly 4 octets separated by dots, each a number between 0 and 255.',
  'Andika `isValidIPv4(ip)` isubiza `true` niba string ari aderesi nziza ya IPv4 — inzuzi 4 zitandukanyijwe n''amatama, buri imwe ari umubare hagati ya 0 na 255.',
  'write_scratch', 'intermediate',
  '// Write isValidIPv4(ip) here',
  '',
  '[
    {"assertion": "isValidIPv4(''192.168.1.1'') === true", "description": "Standard private IP is valid"},
    {"assertion": "isValidIPv4(''256.1.1.1'') === false", "description": "256 is out of range"},
    {"assertion": "isValidIPv4(''10.0.0'') === false", "description": "Only 3 octets is invalid"},
    {"assertion": "isValidIPv4(''0.0.0.0'') === true", "description": "All zeros is valid"}
  ]',
  10, 1,
  'Split by ".": `const parts = ip.split(".")`. Check `parts.length === 4`, then each part: `const n = Number(p); return !isNaN(n) && n >= 0 && n <= 255 && String(n) === p`.',
  'Tanya na ".": `const parts = ip.split(".")`. Suzuma `parts.length === 4`, hanyuma buri gice: `const n = Number(p); return !isNaN(n) && n >= 0 && n <= 255 && String(n) === p`.'
),
(
  '00000000-0400-0000-0000-000000000101',
  'IP Address to Binary',
  'Guhindura Aderesi ya IP mu Binary',
  'Write `ipToBinary(ip)` that converts an IPv4 address string to its 32-bit binary representation as a string of 32 "0" and "1" characters (no dots, no spaces).',
  'Andika `ipToBinary(ip)` ihindura string ya aderesi ya IPv4 mu guhagararira kayo bya binary kwa bits 32 nk''string y''ibaruwa 32 "0" na "1" (nta matama, nta mwanya).',
  'write_scratch', 'intermediate',
  '// Write ipToBinary(ip) here',
  '',
  '[
    {"assertion": "ipToBinary(''0.0.0.0'') === ''00000000000000000000000000000000''", "description": "0.0.0.0 is all zeros"},
    {"assertion": "ipToBinary(''255.255.255.255'') === ''11111111111111111111111111111111''", "description": "255.255.255.255 is all ones"},
    {"assertion": "ipToBinary(''192.168.1.1'').length === 32", "description": "Result is exactly 32 characters"},
    {"assertion": "ipToBinary(''128.0.0.0'').startsWith(''1'')", "description": "128 starts with binary 1"}
  ]',
  10, 2,
  'Split IP, convert each octet to binary with `.toString(2).padStart(8, "0")`, then join all 4 parts.',
  'Tanya IP, hindura buri octet mu binary ukoresheje `.toString(2).padStart(8, "0")`, hanyuma huza ibice byose 4.'
),
(
  '00000000-0400-0000-0000-000000000101',
  'Calculate Network Address',
  'Kubara Aderesi ya Network',
  'Write `getNetworkAddress(ip, subnetMask)` that applies a bitwise AND between the IP address and subnet mask octets to return the network address string. E.g. `getNetworkAddress("192.168.5.130", "255.255.255.128")` → `"192.168.5.128"`.',
  'Andika `getNetworkAddress(ip, subnetMask)` ishyira mu bikorwa AND ya bitwise hagati y''inzuzi za aderesi ya IP na subnet mask kugira ngo isubize string ya aderesi ya network.',
  'write_scratch', 'advanced',
  '// Write getNetworkAddress(ip, subnetMask) here',
  '',
  '[
    {"assertion": "getNetworkAddress(''192.168.5.130'', ''255.255.255.128'') === ''192.168.5.128''", "description": "Applies bitwise AND correctly"},
    {"assertion": "getNetworkAddress(''10.0.5.200'', ''255.255.0.0'') === ''10.0.0.0''", "description": "Class B subnet mask"},
    {"assertion": "getNetworkAddress(''172.16.100.200'', ''255.255.255.0'') === ''172.16.100.0''", "description": "/24 subnet mask"}
  ]',
  15, 3,
  'Split both IP and mask into octets. For each position: `parseInt(ipOctet[i]) & parseInt(maskOctet[i])`. Join with ".".',
  'Tanya IP na mask buri kumwe. Kuri buri mwanya: `parseInt(ipOctet[i]) & parseInt(maskOctet[i])`. Huza na ".".'
),
(
  '00000000-0400-0000-0000-000000000101',
  'Subnet Host Count',
  'Kubara Umubare w''Imbere ya Subnet',
  'Write `subnetHostCount(cidr)` that takes a CIDR prefix length (0–32) and returns the number of usable host addresses in that subnet (total addresses minus 2: network and broadcast addresses).',
  'Andika `subnetHostCount(cidr)` iyakira uburebure bwa CIDR prefix (0–32) kandi isubize umubare w''aderesi z''ibikoresho byo gutumanahana bishobora gukoreshwa muri iyo subnet (aderesi zose mabuye 2: aderesi ya network na broadcast).',
  'write_scratch', 'intermediate',
  '// Write subnetHostCount(cidr) here',
  '',
  '[
    {"assertion": "subnetHostCount(24) === 254", "description": "/24 has 254 usable hosts (256 - 2)"},
    {"assertion": "subnetHostCount(30) === 2", "description": "/30 has 2 usable hosts (4 - 2)"},
    {"assertion": "subnetHostCount(32) === 0", "description": "/32 has 0 usable hosts (host route)"},
    {"assertion": "subnetHostCount(16) === 65534", "description": "/16 has 65534 usable hosts"}
  ]',
  15, 4,
  'Total addresses = `2 ** (32 - cidr)`. Usable = total - 2. For /32 return 0.',
  'Aderesi zose = `2 ** (32 - cidr)`. Bishobora gukoreshwa = total - 2. Kuri /32 subiriza 0.'
)
ON CONFLICT (set_id, order_index) DO NOTHING;

-- ─── SWDBD401 LO1: RESTful API Design ─────────────────────────────────────────

INSERT INTO public.quiz_challenges
  (set_id, title, title_kin, description, description_kin, challenge_type, difficulty,
   starter_js, starter_html, test_cases, xp_reward, order_index, hint, hint_kin)
VALUES
(
  '00000000-0400-0000-0000-000000000103',
  'HTTP Method Router',
  'Router y''Uburyo bwa HTTP',
  'Write `routeRequest(method, path, handlers)` where `handlers` is an object mapping `"METHOD /path"` strings to handler functions. The function should call the matching handler and return its result, or return `{ status: 404, body: "Not Found" }` if no match.',
  'Andika `routeRequest(method, path, handlers)` aho `handlers` ari igiti kintu gishyikiriza strings `"METHOD /path"` na imikorere y''inzira. Imikorere igomba guhamagara handler ihuye kandi isubize igisubizo cyayo, cyangwa isubize `{ status: 404, body: "Not Found" }` niba nta huye.',
  'write_scratch', 'intermediate',
  '// Write routeRequest(method, path, handlers) here',
  '',
  '[
    {"assertion": "routeRequest(''GET'',''/users'',{''GET /users'': () => ({status:200,body:''ok''})}).status === 200", "description": "Matches GET /users"},
    {"assertion": "routeRequest(''POST'',''/data'',{''GET /users'': () => ({status:200})}).status === 404", "description": "Returns 404 for unmatched route"},
    {"assertion": "routeRequest(''DELETE'',''/item/1'',{''DELETE /item/1'': () => ({status:204})}).status === 204", "description": "Matches DELETE route"}
  ]',
  10, 1,
  'Build the key: `const key = \`${method} ${path}\``. Look it up: `const handler = handlers[key]`. Return `handler ? handler() : { status: 404, body: "Not Found" }`.',
  'Rema urufunguzo: `const key = \`${method} ${path}\``. Ugashake: `const handler = handlers[key]`. Subiriza `handler ? handler() : { status: 404, body: "Not Found" }`.'
),
(
  '00000000-0400-0000-0000-000000000103',
  'Build a JSON API Response',
  'Kubaka Igisubizo cya JSON API',
  'Write `apiResponse(status, data, message)` that returns a standardised API response object: `{ success: boolean, status: number, message: string, data: any, timestamp: string }`. `success` is true for status < 400.',
  'Andika `apiResponse(status, data, message)` isubiza igiti kintu cy''igisubizo cya API cyateguwe: `{ success: boolean, status: number, message: string, data: any, timestamp: string }`. `success` ni true kuri status < 400.',
  'write_scratch', 'intermediate',
  '// Write apiResponse(status, data, message) here',
  '',
  '[
    {"assertion": "apiResponse(200, {id:1}, ''OK'').success === true", "description": "Status 200 means success"},
    {"assertion": "apiResponse(404, null, ''Not found'').success === false", "description": "Status 404 means not success"},
    {"assertion": "typeof apiResponse(200, {}, ''OK'').timestamp === ''string''", "description": "timestamp is a string"},
    {"assertion": "apiResponse(201, {id:5}, ''Created'').data.id === 5", "description": "data is returned correctly"}
  ]',
  10, 2,
  'Return `{ success: status < 400, status, message, data, timestamp: new Date().toISOString() }`.',
  'Subiriza `{ success: status < 400, status, message, data, timestamp: new Date().toISOString() }`.'
),
(
  '00000000-0400-0000-0000-000000000103',
  'Request Body Validator',
  'Gusuzuma Ibiri muri Request Body',
  'Write `validateBody(body, schema)` where `schema` is an object mapping field names to `"required"` or `"optional"`. Return `{ valid: boolean, errors: string[] }`. Flag missing required fields and unexpected fields not in the schema.',
  'Andika `validateBody(body, schema)` aho `schema` ari igiti kintu gishyikiriza amazina y''imibare na `"required"` cyangwa `"optional"`. Subiriza `{ valid: boolean, errors: string[] }`. Sebya imibare ibuze yasabwa n''imibare itari muri schema.',
  'write_scratch', 'intermediate',
  '// Write validateBody(body, schema) here',
  '',
  '[
    {"assertion": "validateBody({name:''Alice'',age:25},{name:''required'',age:''required''}).valid === true", "description": "All required fields present is valid"},
    {"assertion": "validateBody({age:25},{name:''required'',age:''required''}).valid === false", "description": "Missing required field is invalid"},
    {"assertion": "validateBody({name:''Alice'',age:25},{name:''required'',age:''required''}).errors.length === 0", "description": "Valid body has no errors"},
    {"assertion": "validateBody({name:''Alice''},{name:''required''}).valid === true", "description": "Only required fields needed"}
  ]',
  10, 3,
  'Loop over schema keys. If `schema[key] === "required" && !(key in body)`, push an error. Return `{ valid: errors.length === 0, errors }`.',
  'Subiramo urufunguzo rwa schema. Niba `schema[key] === "required" && !(key in body)`, ongeraho ikosa. Subiriza `{ valid: errors.length === 0, errors }`.'
),
(
  '00000000-0400-0000-0000-000000000103',
  'Paginate an Array',
  'Gukora Urupapuro rw''Urutonde',
  'Write `paginate(items, page, pageSize)` that returns `{ data: T[], page: number, pageSize: number, total: number, totalPages: number }` for the given page (1-indexed).',
  'Andika `paginate(items, page, pageSize)` isubiza `{ data: T[], page: number, pageSize: number, total: number, totalPages: number }` kuri urupapuro rwahawe (rutatangira kuri 1).',
  'write_scratch', 'intermediate',
  '// Write paginate(items, page, pageSize) here',
  '',
  '[
    {"assertion": "paginate([1,2,3,4,5],1,2).data.length === 2", "description": "First page has 2 items"},
    {"assertion": "paginate([1,2,3,4,5],2,2).data[0] === 3", "description": "Second page starts at item 3"},
    {"assertion": "paginate([1,2,3,4,5],1,2).totalPages === 3", "description": "5 items / 2 per page = 3 pages"},
    {"assertion": "paginate([1,2,3,4,5],3,2).data.length === 1", "description": "Last page has only 1 item"}
  ]',
  15, 4,
  'Slice: `const start = (page - 1) * pageSize; const data = items.slice(start, start + pageSize)`. Total pages: `Math.ceil(items.length / pageSize)`.',
  'Tera: `const start = (page - 1) * pageSize; const data = items.slice(start, start + pageSize)`. Impapuro zose: `Math.ceil(items.length / pageSize)`.'
)
ON CONFLICT (set_id, order_index) DO NOTHING;

-- ─── SWDBD401 LO2: Securing Backend Applications ──────────────────────────────

INSERT INTO public.quiz_challenges
  (set_id, title, title_kin, description, description_kin, challenge_type, difficulty,
   starter_js, starter_html, test_cases, xp_reward, order_index, hint, hint_kin)
VALUES
(
  '00000000-0400-0000-0000-000000000104',
  'Input Sanitisation',
  'Gukuraho Ibintu Bibi mu Makuru y''Ibinjizwa',
  'Write `sanitiseInput(str)` that removes HTML tags (replace `<` and `>` with their HTML entities `&lt;` and `&gt;`), trims whitespace, and limits the string to 500 characters.',
  'Andika `sanitiseInput(str)` ikuraho tags za HTML (hindura `<` na `>` na entities zazo za HTML `&lt;` na `&gt;`), ikuraho imyanya y''ubusa, kandi igabanya string kuri ibaruwa 500.',
  'write_scratch', 'intermediate',
  '// Write sanitiseInput(str) here',
  '',
  '[
    {"assertion": "sanitiseInput(''<script>alert(1)</script>'').includes(''<script>'') === false", "description": "HTML tags are escaped"},
    {"assertion": "sanitiseInput(''  hello  '') === ''hello''", "description": "Whitespace is trimmed"},
    {"assertion": "sanitiseInput(''a''.repeat(600)).length === 500", "description": "Output is capped at 500 characters"},
    {"assertion": "sanitiseInput(''<b>bold</b>'') === ''&lt;b&gt;bold&lt;/b&gt;''", "description": "Tags correctly replaced with entities"}
  ]',
  10, 1,
  'Chain operations: `.trim()`, then `.slice(0, 500)`, then `.replace(/</g, "&lt;").replace(/>/g, "&gt;")`.',
  'Huza ibikorwa: `.trim()`, hanyuma `.slice(0, 500)`, hanyuma `.replace(/</g, "&lt;").replace(/>/g, "&gt;")`.'
),
(
  '00000000-0400-0000-0000-000000000104',
  'Password Strength Checker',
  'Gusuzuma Imbaraga ya Ijambo Banga',
  'Write `checkPasswordStrength(password)` that returns `"weak"`, `"medium"`, or `"strong"`. Strong: ≥12 chars, uppercase, lowercase, digit, and special char. Medium: ≥8 chars and meets 3 of the 4 criteria. Weak: everything else.',
  'Andika `checkPasswordStrength(password)` isubiza `"weak"`, `"medium"`, cyangwa `"strong"`. Imbaraga: ≥12 ibaruwa, majuscule, minuscule, indangamunanirani, na ibaruwa yihariye. Hagati: ≥8 ibaruwa kandi ihuza 3 mu bigeragezo 4. Buhoro: ibindi byose.',
  'write_scratch', 'intermediate',
  '// Write checkPasswordStrength(password) here',
  '',
  '[
    {"assertion": "checkPasswordStrength(''Abc123!@#XYZ'') === ''strong''", "description": "12+ chars with all criteria is strong"},
    {"assertion": "checkPasswordStrength(''Password1!'') === ''medium''", "description": "8+ chars with 3 criteria is medium"},
    {"assertion": "checkPasswordStrength(''abc'') === ''weak''", "description": "Short simple password is weak"},
    {"assertion": "checkPasswordStrength(''abcdefghijkl'') === ''medium''", "description": "12 chars lowercase only is medium"}
  ]',
  10, 2,
  'Check each criterion with regex: `/[A-Z]/.test(p)`, `/[a-z]/.test(p)`, `/[0-9]/.test(p)`, `/[^A-Za-z0-9]/.test(p)`. Count how many pass, then decide strength.',
  'Suzuma buri kigeranyo ukoresheje regex: `/[A-Z]/.test(p)`, `/[a-z]/.test(p)`, `/[0-9]/.test(p)`, `/[^A-Za-z0-9]/.test(p)`. Bara ingano y''ibyashoboye, hanyuma fata icyemezo cy''imbaraga.'
),
(
  '00000000-0400-0000-0000-000000000104',
  'Rate Limiter',
  'Kugenzura Ingano y''Ibikorwa',
  'Complete `createRateLimiter(maxRequests, windowMs)` that returns a `check(userId)` function. Each user can make at most `maxRequests` calls within `windowMs` milliseconds. `check` returns `true` if allowed or `false` if rate-limited.',
  'Uzuza `createRateLimiter(maxRequests, windowMs)` isubiza imikorere `check(userId)`. Buri mukoreshafatizo arashobora gukora ibikorwa `maxRequests` gusa mu `windowMs` milliseconds. `check` isubiza `true` niba yemewe cyangwa `false` niba aragenzuwe.',
  'complete_code', 'advanced',
  'function createRateLimiter(maxRequests, windowMs) {
  const requests = {};

  function check(userId) {
    const now = Date.now();
    if (!requests[userId]) {
      requests[userId] = [];
    }
    // TODO: 1. Remove entries older than windowMs from requests[userId]
    // TODO: 2. If requests[userId].length >= maxRequests, return false
    // TODO: 3. Otherwise push now to requests[userId] and return true

  }
  return { check };
}

const limiter = createRateLimiter(3, 60000);
console.log(limiter.check("user1")); // true
console.log(limiter.check("user1")); // true
console.log(limiter.check("user1")); // true
console.log(limiter.check("user1")); // false (4th in window)',
  '',
  '[
    {"assertion": "(() => { const l = createRateLimiter(2, 60000); return l.check(''u1'') && l.check(''u1''); })() === true", "description": "Within limit returns true"},
    {"assertion": "(() => { const l = createRateLimiter(2, 60000); l.check(''u1''); l.check(''u1''); return l.check(''u1''); })() === false", "description": "Exceeding limit returns false"},
    {"assertion": "(() => { const l = createRateLimiter(2, 60000); l.check(''u1''); return l.check(''u2''); })() === true", "description": "Different users have independent limits"}
  ]',
  15, 3,
  'Step 1: `requests[userId] = requests[userId].filter(t => now - t < windowMs)`. Step 2: check length. Step 3: push and return true.',
  'Intambwe 1: `requests[userId] = requests[userId].filter(t => now - t < windowMs)`. Intambwe 2: suzuma uburebure. Intambwe 3: shyiramo kandi subiriza true.'
),
(
  '00000000-0400-0000-0000-000000000104',
  'Fix the JWT Decoder',
  'Gukosora Decoder ya JWT',
  'Fix `decodeJwtPayload(token)`. It should decode the Base64Url payload section of a JWT and return the parsed JSON object. Currently it tries to decode the header (index 0) instead of the payload (index 1).',
  'Gukosora `decodeJwtPayload(token)`. Igomba gusobanura uburika bwa Base64Url bwa payload bya JWT kandi isubize igiti kintu cya JSON cyasomeshejwe. Ubu igerageza gusobanura header (index 0) aho gusobanura payload (index 1).',
  'fix_bug', 'advanced',
  'function decodeJwtPayload(token) {
  const parts = token.split(".");
  // BUG: should decode parts[1] (payload), not parts[0] (header)
  const base64 = parts[0].replace(/-/g, "+").replace(/_/g, "/");
  const json = atob(base64);
  return JSON.parse(json);
}

const fakeJwt = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxMjMiLCJyb2xlIjoic3R1ZGVudCJ9.signature";
console.log(decodeJwtPayload(fakeJwt).userId);',
  '',
  '[
    {"assertion": "decodeJwtPayload(''eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxMjMiLCJyb2xlIjoic3R1ZGVudCJ9.sig'').userId === ''123''", "description": "Decodes userId from payload"},
    {"assertion": "decodeJwtPayload(''eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxMjMiLCJyb2xlIjoic3R1ZGVudCJ9.sig'').role === ''student''", "description": "Decodes role from payload"},
    {"assertion": "__output.includes(''123'')", "description": "Should log the userId"}
  ]',
  15, 4,
  'Change `parts[0]` to `parts[1]`. The three parts of a JWT are: header.payload.signature — index 1 is the payload.',
  'Hindura `parts[0]` na `parts[1]`. Ibice bitatu bya JWT ni: header.payload.signature — index 1 ni payload.'
)
ON CONFLICT (set_id, order_index) DO NOTHING;

-- ─── SWDDA401 LO1: Algorithm Fundamentals ─────────────────────────────────────

INSERT INTO public.quiz_challenges
  (set_id, title, title_kin, description, description_kin, challenge_type, difficulty,
   starter_js, starter_html, test_cases, xp_reward, order_index, hint, hint_kin)
VALUES
(
  '00000000-0400-0000-0000-000000000110',
  'Decimal to Binary Converter',
  'Guhindura Decimal mu Binary',
  'Write `decimalToBinary(n)` that converts a non-negative integer to its binary string representation (without leading zeros). Then write `binaryToDecimal(b)` that converts a binary string back to a decimal number.',
  'Andika `decimalToBinary(n)` ihindura integer itarengana na zeru mu guhagararira kwayo kwa binary (nta zeru z''imbere). Hanyuma andika `binaryToDecimal(b)` ihindura string ya binary gusubira ku mubare wa decimal.',
  'write_scratch', 'intermediate',
  '// Write decimalToBinary and binaryToDecimal here',
  '',
  '[
    {"assertion": "decimalToBinary(10) === ''1010''", "description": "10 in decimal is 1010 in binary"},
    {"assertion": "decimalToBinary(0) === ''0''", "description": "0 converts to ''0''"},
    {"assertion": "binaryToDecimal(''1010'') === 10", "description": "1010 binary is 10 decimal"},
    {"assertion": "binaryToDecimal(decimalToBinary(255)) === 255", "description": "Round-trip conversion is consistent"}
  ]',
  10, 1,
  'For decimal→binary: use `n.toString(2)`. For binary→decimal: use `parseInt(b, 2)`.',
  'Kuri decimal→binary: koresha `n.toString(2)`. Kuri binary→decimal: koresha `parseInt(b, 2)`.'
),
(
  '00000000-0400-0000-0000-000000000110',
  'Hexadecimal Converter',
  'Guhindura Hexadecimal',
  'Write `toHex(n)` that converts a non-negative integer to its lowercase hexadecimal string (no "0x" prefix). Write `hexToDecimal(h)` that converts a hex string back. Then write `decimalToHex(n)` as a one-liner using your existing functions.',
  'Andika `toHex(n)` ihindura integer itarengana na zeru mu string yayo ya hexadecimal y''ibice bito (nta prefix "0x"). Andika `hexToDecimal(h)` ihindura string ya hex gusubira. Hanyuma andika `decimalToHex(n)` nk''umurongo umwe ukoresheje imikorere yawe isanzwe.',
  'write_scratch', 'intermediate',
  '// Write toHex, hexToDecimal here',
  '',
  '[
    {"assertion": "toHex(255) === ''ff''", "description": "255 = ff in hex"},
    {"assertion": "toHex(16) === ''10''", "description": "16 = 10 in hex"},
    {"assertion": "hexToDecimal(''ff'') === 255", "description": "ff → 255"},
    {"assertion": "hexToDecimal(''1a'') === 26", "description": "1a → 26"}
  ]',
  10, 2,
  'Use `n.toString(16)` for decimal-to-hex and `parseInt(h, 16)` for hex-to-decimal.',
  'Koresha `n.toString(16)` kuri decimal-na-hex na `parseInt(h, 16)` kuri hex-na-decimal.'
),
(
  '00000000-0400-0000-0000-000000000110',
  'Bubble Sort Implementation',
  'Gushyira mu Bikorwa Bubble Sort',
  'Implement `bubbleSort(arr)` that sorts an array of numbers in ascending order using the Bubble Sort algorithm. Return a NEW sorted array (do not mutate the input).',
  'Gushyira mu bikorwa `bubbleSort(arr)` itondeka urutonde rw''imibare iva hasi hejuru ukoresheje algorithm ya Bubble Sort. Subiriza urutonde USHYA watondetswe (ntuhindure ibinjizwa).',
  'write_scratch', 'intermediate',
  '// Write bubbleSort(arr) here — sort ascending, do not mutate input',
  '',
  '[
    {"assertion": "bubbleSort([5,3,1,4,2]).join('','') === ''1,2,3,4,5''", "description": "Sorts array ascending"},
    {"assertion": "bubbleSort([1]).length === 1", "description": "Single-element array works"},
    {"assertion": "(() => { const a=[3,1,2]; bubbleSort(a); return a[0]; })() === 3", "description": "Input array is not mutated"},
    {"assertion": "bubbleSort([]).length === 0", "description": "Empty array returns empty array"}
  ]',
  10, 3,
  'Copy the array: `const sorted = [...arr]`. Nested loops: outer n-1 times, inner from 0 to n-i-1. Swap adjacent elements if `sorted[j] > sorted[j+1]`.',
  'Kopi urutonde: `const sorted = [...arr]`. Inzira zihuriza: iya hanze inshuro n-1, iya mukati kuva 0 kugeza n-i-1. Hindura ibintu bibiri bitanduye niba `sorted[j] > sorted[j+1]`.'
),
(
  '00000000-0400-0000-0000-000000000110',
  'Binary Search',
  'Gushaka Ukoresheje Binary Search',
  'Implement `binarySearch(sortedArr, target)` that returns the index of `target` in `sortedArr`, or -1 if not found. The array is sorted in ascending order. Use O(log n) binary search, not O(n) linear scan.',
  'Gushyira mu bikorwa `binarySearch(sortedArr, target)` isubiza index ya `target` muri `sortedArr`, cyangwa -1 niba itabonetse. Urutonde rutondetswe ava hasi hejuru. Koresha binary search O(log n), si O(n) isuzuma irizo.',
  'write_scratch', 'advanced',
  '// Write binarySearch(sortedArr, target) here',
  '',
  '[
    {"assertion": "binarySearch([1,3,5,7,9],5) === 2", "description": "Finds element at index 2"},
    {"assertion": "binarySearch([1,3,5,7,9],6) === -1", "description": "Returns -1 when not found"},
    {"assertion": "binarySearch([1],1) === 0", "description": "Single element found at index 0"},
    {"assertion": "binarySearch([],5) === -1", "description": "Empty array returns -1"}
  ]',
  15, 4,
  'Use `left = 0`, `right = arr.length - 1`. Loop while `left <= right`. Check `mid = Math.floor((left+right)/2)`. Move left or right pointer based on comparison.',
  'Koresha `left = 0`, `right = arr.length - 1`. Subiramo ngo `left <= right`. Suzuma `mid = Math.floor((left+right)/2)`. Sunika pointer ya left cyangwa right bitewe no kwigana.'
)
ON CONFLICT (set_id, order_index) DO NOTHING;

-- ─── SWDDA401 LO2: Data Structures ────────────────────────────────────────────

INSERT INTO public.quiz_challenges
  (set_id, title, title_kin, description, description_kin, challenge_type, difficulty,
   starter_js, starter_html, test_cases, xp_reward, order_index, hint, hint_kin)
VALUES
(
  '00000000-0400-0000-0000-000000000111',
  'Stack Implementation',
  'Gushyira mu Bikorwa Stack',
  'Implement a `Stack` class using an array. It should have: `push(item)`, `pop()` (returns and removes top item, or `null` if empty), `peek()` (returns top item without removing, or `null`), and a `size` getter.',
  'Gushyira mu bikorwa classe `Stack` ukoresheje urutonde. Igomba kugira: `push(item)`, `pop()` (isubiza kandi ikuraho igice hejuru, cyangwa `null` niba rurimo ubusa), `peek()` (isubiza igice hejuru nta kukiremora, cyangwa `null`), na getter `size`.',
  'write_scratch', 'intermediate',
  '// Write the Stack class here',
  '',
  '[
    {"assertion": "new Stack().size === 0", "description": "New stack has size 0"},
    {"assertion": "(() => { const s = new Stack(); s.push(1); s.push(2); return s.peek(); })() === 2", "description": "peek returns top without removing"},
    {"assertion": "(() => { const s = new Stack(); s.push(1); s.push(2); s.pop(); return s.size; })() === 1", "description": "pop reduces size"},
    {"assertion": "new Stack().pop() === null", "description": "pop on empty stack returns null"}
  ]',
  10, 1,
  'Use `this._data = []`. `push(item)` → `this._data.push(item)`. `pop()` → `this._data.length ? this._data.pop() : null`. `get size()` → `this._data.length`.',
  'Koresha `this._data = []`. `push(item)` → `this._data.push(item)`. `pop()` → `this._data.length ? this._data.pop() : null`. `get size()` → `this._data.length`.'
),
(
  '00000000-0400-0000-0000-000000000111',
  'Queue Implementation',
  'Gushyira mu Bikorwa Queue',
  'Implement a `Queue` class. It should have: `enqueue(item)` (add to back), `dequeue()` (remove and return from front, or `null` if empty), `front()` (peek at front without removing), and a `size` getter.',
  'Gushyira mu bikorwa classe `Queue`. Igomba kugira: `enqueue(item)` (wongeraho ku mpera), `dequeue()` (kuraho kandi usubize aho imbere, cyangwa `null` niba rurimo ubusa), `front()` (reba aho imbere nta kukiremora), na getter `size`.',
  'write_scratch', 'intermediate',
  '// Write the Queue class here',
  '',
  '[
    {"assertion": "new Queue().size === 0", "description": "New queue is empty"},
    {"assertion": "(() => { const q = new Queue(); q.enqueue(''a''); q.enqueue(''b''); return q.front(); })() === ''a''", "description": "front returns first item enqueued"},
    {"assertion": "(() => { const q = new Queue(); q.enqueue(1); q.enqueue(2); return q.dequeue(); })() === 1", "description": "dequeue returns first item (FIFO)"},
    {"assertion": "new Queue().dequeue() === null", "description": "dequeue on empty queue returns null"}
  ]',
  10, 2,
  'Use `this._data = []`. `enqueue(item)` → `this._data.push(item)`. `dequeue()` → `this._data.length ? this._data.shift() : null`. `front()` → `this._data[0] ?? null`.',
  'Koresha `this._data = []`. `enqueue(item)` → `this._data.push(item)`. `dequeue()` → `this._data.length ? this._data.shift() : null`. `front()` → `this._data[0] ?? null`.'
),
(
  '00000000-0400-0000-0000-000000000111',
  'Linked List',
  'Urutonde Ruhurirano',
  'Implement a singly linked list with a `LinkedList` class. Each node has `value` and `next`. Add methods: `append(value)`, `toArray()` (returns all values as array), and `length` getter.',
  'Gushyira mu bikorwa urutonde ruhurirano rwombi na classe `LinkedList`. Buri node ifite `value` na `next`. Ongeraho uburyo: `append(value)`, `toArray()` (isubiza agaciro kose nk''urutonde), na getter `length`.',
  'write_scratch', 'advanced',
  '// Write LinkedList (and Node if needed) here',
  '',
  '[
    {"assertion": "new LinkedList().length === 0", "description": "Empty list has length 0"},
    {"assertion": "(() => { const l = new LinkedList(); l.append(1); l.append(2); l.append(3); return l.length; })() === 3", "description": "length tracks appended nodes"},
    {"assertion": "(() => { const l = new LinkedList(); l.append(10); l.append(20); return l.toArray().join('',''); })() === ''10,20''", "description": "toArray returns values in order"},
    {"assertion": "new LinkedList().toArray().length === 0", "description": "Empty list toArray returns empty array"}
  ]',
  15, 3,
  'Keep a `this.head = null` and `this._length = 0`. `append` walks to the last node (or sets head if empty), then sets `lastNode.next = { value, next: null }`.',
  'Bika `this.head = null` na `this._length = 0`. `append` igenda kugeza ku node ya nyuma (cyangwa ishyiraho head niba rurimo ubusa), hanyuma ishyiraho `lastNode.next = { value, next: null }`.'
),
(
  '00000000-0400-0000-0000-000000000111',
  'Fix the Binary Tree Insert',
  'Gukosora Kwinjiza muri Binary Tree',
  'Fix the bug in `insertBST(root, value)`. It should insert a value into a Binary Search Tree and return the (possibly new) root node. Currently it always creates a new root instead of finding the right place.',
  'Gukosora ikosa muri `insertBST(root, value)`. Igomba kwinjiza agaciro muri Binary Search Tree kandi isubize node ya root (nyishwa). Ubu itwara root nshya buri gihe aho gurondera ahantu hakwiye.',
  'fix_bug', 'advanced',
  'function insertBST(root, value) {
  const node = { value, left: null, right: null };
  // BUG: always returns a new single-node tree, ignoring existing root
  return node;
}

function inOrder(root) {
  if (!root) return [];
  return [...inOrder(root.left), root.value, ...inOrder(root.right)];
}

let root = null;
root = insertBST(root, 5);
root = insertBST(root, 3);
root = insertBST(root, 7);
console.log(inOrder(root).join(","));',
  '',
  '[
    {"assertion": "(() => { let r = null; r = insertBST(r, 5); r = insertBST(r, 3); r = insertBST(r, 7); return r.value; })() === 5", "description": "Root stays as first inserted value"},
    {"assertion": "(() => { let r = null; r = insertBST(r, 5); r = insertBST(r, 3); return r.left.value; })() === 3", "description": "3 < 5 so it goes left"},
    {"assertion": "(() => { let r = null; r = insertBST(r, 5); r = insertBST(r, 3); r = insertBST(r, 7); return __output.includes(''3,5,7''); })() === true", "description": "In-order traversal gives sorted output"}
  ]',
  15, 4,
  'If `root === null`, return the new node. Otherwise, if `value < root.value`, set `root.left = insertBST(root.left, value)`. If `value > root.value`, set `root.right = insertBST(root.right, value)`. Return `root`.',
  'Niba `root === null`, subiriza node nshya. Niba bityo si byo, niba `value < root.value`, shyiraho `root.left = insertBST(root.left, value)`. Niba `value > root.value`, shyiraho `root.right = insertBST(root.right, value)`. Subiriza `root`.'
)
ON CONFLICT (set_id, order_index) DO NOTHING;

-- ─── SWDPP401 LO1: PHP Fundamentals & OOP ─────────────────────────────────────

INSERT INTO public.quiz_challenges
  (set_id, title, title_kin, description, description_kin, challenge_type, difficulty,
   starter_js, starter_html, test_cases, xp_reward, order_index, hint, hint_kin)
VALUES
(
  '00000000-0400-0000-0000-000000000113',
  'Class Inheritance',
  'Kuragira Classe',
  'Create a base `Animal` class with `name` and `sound`, and a `speak()` method returning `"{name} says {sound}"`. Then create `Dog` (extends Animal, sound="Woof") and `Cat` (extends Animal, sound="Meow") — each class should call `super(name, sound)` in its constructor.',
  'Rema classe nkomoko `Animal` ifite `name` na `sound`, na uburyo `speak()` busubiza `"{name} says {sound}"`. Hanyuma rema `Dog` (iyagura Animal, sound="Woof") na `Cat` (sound="Meow") — buri classe igomba guhamagara `super(name, sound)` muri constructor yayo.',
  'write_scratch', 'intermediate',
  '// Write Animal, Dog, and Cat classes here',
  '',
  '[
    {"assertion": "new Dog(''Rex'').speak() === ''Rex says Woof''", "description": "Dog speaks correctly"},
    {"assertion": "new Cat(''Whiskers'').speak() === ''Whiskers says Meow''", "description": "Cat speaks correctly"},
    {"assertion": "new Dog(''Rex'') instanceof Animal", "description": "Dog is an instance of Animal"},
    {"assertion": "new Cat(''Whiskers'').name === ''Whiskers''", "description": "Name is stored from parent constructor"}
  ]',
  10, 1,
  'Use `class Dog extends Animal { constructor(name) { super(name, "Woof"); } }`. No need to override `speak()` — it is inherited.',
  'Koresha `class Dog extends Animal { constructor(name) { super(name, "Woof"); } }`. Ntabwo bikenerwa gusubiraho `speak()` — irazirukwa.'
),
(
  '00000000-0400-0000-0000-000000000113',
  'PHP-Style Magic Methods',
  'Uburyo bwa Magic bwa PHP',
  'PHP has magic methods like `__toString()` and `__get()`. Implement a `PhpObject` class that: stores properties in a private `_data` object; has a `__get(name)` method that returns the property or `"undefined"`; has a `__set(name, value)` method to set it; and has a `__toString()` method that returns `JSON.stringify(this._data)`.',
  'PHP ifite uburyo bwa magic nka `__toString()` na `__get()`. Gushyira mu bikorwa classe `PhpObject` iyaka: ibika ibintu muri `_data` igiti kintu cyigenga; ifite uburyo `__get(name)` usubiza ibintu cyangwa `"undefined"`; ifite `__set(name, value)` kugira ngo ushyireho; kandi ifite `__toString()` isubiza `JSON.stringify(this._data)`.',
  'write_scratch', 'intermediate',
  '// Write PhpObject class here',
  '',
  '[
    {"assertion": "(() => { const o = new PhpObject(); o.__set(''name'', ''Alice''); return o.__get(''name''); })() === ''Alice''", "description": "__set and __get work together"},
    {"assertion": "new PhpObject().__get(''missing'') === ''undefined''", "description": "__get returns ''undefined'' for missing key"},
    {"assertion": "(() => { const o = new PhpObject(); o.__set(''x'', 1); return o.__toString(); })() === ''{\"x\":1}''", "description": "__toString returns JSON of stored data"}
  ]',
  10, 2,
  'In constructor: `this._data = {}`. `__get(name)`: `return name in this._data ? this._data[name] : "undefined"`. `__set(name, value)`: `this._data[name] = value`.',
  'Muri constructor: `this._data = {}`. `__get(name)`: `return name in this._data ? this._data[name] : "undefined"`. `__set(name, value)`: `this._data[name] = value`.'
),
(
  '00000000-0400-0000-0000-000000000113',
  'Interface Simulation',
  'Gushushanya Interface',
  'PHP interfaces define contracts. Write `implementsInterface(obj, interfaceDef)` where `interfaceDef` is an array of required method names (strings). Return `true` if the object has all of them as functions, `false` otherwise.',
  'Interfaces za PHP zisobanura amasezerano. Andika `implementsInterface(obj, interfaceDef)` aho `interfaceDef` ari urutonde rw''amazina y''uburyo busabwa (strings). Subiriza `true` niba igiti kintu gifite byose nk''imikorere, `false` niba bitabaye.',
  'write_scratch', 'intermediate',
  '// Write implementsInterface(obj, interfaceDef) here',
  '',
  '[
    {"assertion": "implementsInterface({save:()=>{},load:()=>{}}, [''save'',''load'']) === true", "description": "Object with all required methods returns true"},
    {"assertion": "implementsInterface({save:()=>{}}, [''save'',''load'']) === false", "description": "Missing method returns false"},
    {"assertion": "implementsInterface({save:''notAFunction''}, [''save'']) === false", "description": "Non-function property does not satisfy interface"}
  ]',
  10, 3,
  'Use `.every()`: `return interfaceDef.every(method => typeof obj[method] === "function")`.',
  'Koresha `.every()`: `return interfaceDef.every(method => typeof obj[method] === "function")`.'
),
(
  '00000000-0400-0000-0000-000000000113',
  'Static Methods & Properties',
  'Uburyo bwa Static na Ibintu',
  'Create a `Counter` class with: a static `_count` property (starts at 0), a static `getCount()` method, an `increment()` instance method that increments `Counter._count`, and a `reset()` static method that sets `_count` back to 0.',
  'Rema classe `Counter` ifite: property ya static `_count` (itangira kuri 0), uburyo bwa static `getCount()`, uburyo bwa instance `increment()` bongerera `Counter._count`, na uburyo bwa static `reset()` usubiza `_count` kuri 0.',
  'write_scratch', 'intermediate',
  '// Write the Counter class here',
  '',
  '[
    {"assertion": "Counter.getCount() === 0", "description": "Initial count is 0"},
    {"assertion": "(() => { const c = new Counter(); c.increment(); c.increment(); return Counter.getCount(); })() === 2", "description": "increment() updates shared count"},
    {"assertion": "(() => { Counter.reset(); return Counter.getCount(); })() === 0", "description": "reset() sets count to 0"}
  ]',
  10, 4,
  'Use `static _count = 0` in the class body. `static getCount() { return Counter._count; }`. Instance `increment() { Counter._count++; }`. `static reset() { Counter._count = 0; }`.',
  'Koresha `static _count = 0` mu mubiri wa classe. `static getCount() { return Counter._count; }`. Instance `increment() { Counter._count++; }`. `static reset() { Counter._count = 0; }`.'
)
ON CONFLICT (set_id, order_index) DO NOTHING;

-- ─── SWDPP401 LO4: MVC Framework Patterns ─────────────────────────────────────

INSERT INTO public.quiz_challenges
  (set_id, title, title_kin, description, description_kin, challenge_type, difficulty,
   starter_js, starter_html, test_cases, xp_reward, order_index, hint, hint_kin)
VALUES
(
  '00000000-0400-0000-0000-000000000116',
  'MVC Router',
  'Router ya MVC',
  'Implement a minimal MVC router. Write `createRouter()` that returns an object with: `register(method, path, controller)` to add a route, and `dispatch(method, path)` that finds the matching controller and calls it, returning its result (or `null` for 404).',
  'Gushyira mu bikorwa router yoroheje ya MVC. Andika `createRouter()` isubiza igiti kintu gifite: `register(method, path, controller)` kongeraho inzira, na `dispatch(method, path)` ibona controller ihuye kandi iyihamagara, isubize igisubizo cyayo (cyangwa `null` kuri 404).',
  'write_scratch', 'intermediate',
  '// Write createRouter() here',
  '',
  '[
    {"assertion": "(() => { const r = createRouter(); r.register(''GET'',''/home'', () => ''HomePage''); return r.dispatch(''GET'',''/home''); })() === ''HomePage''", "description": "Registered route returns controller result"},
    {"assertion": "(() => { const r = createRouter(); return r.dispatch(''GET'',''/missing''); })() === null", "description": "Unregistered route returns null"},
    {"assertion": "typeof createRouter === ''function''", "description": "createRouter is a function"}
  ]',
  10, 1,
  'Store routes in an array or object. `dispatch` looks for `{method, path}` match and calls the controller.',
  'Bika inzira muri urutonde cyangwa igiti kintu. `dispatch` irashaka huye `{method, path}` kandi ihamagara controller.'
),
(
  '00000000-0400-0000-0000-000000000116',
  'Form Validation Rules Engine',
  'Injini y''Amategeko yo Gusuzuma Ibyemeza',
  'Write `createValidator(rules)` where `rules` is an object mapping field names to arrays of rule functions (each returns an error string or null). Return a `validate(data)` function that runs all rules and returns `{valid, errors}` where errors maps field names to arrays of error messages.',
  'Andika `createValidator(rules)` aho `rules` ari igiti kintu gishyikiriza amazina y''imibare na urutonde rw''imikorere y''amategeko (buri kimwe kisubiza string y''ikosa cyangwa null). Subiriza imikorere `validate(data)` ikoresha amategeko yose kandi isubize `{valid, errors}` aho errors ihuza amazina y''imibare na urutonde rw''ubutumwa bw''amakosa.',
  'write_scratch', 'advanced',
  '// Write createValidator(rules) here',
  '',
  '[
    {"assertion": "(() => { const v = createValidator({age: [(x) => x >= 18 ? null : ''Must be 18+''] }); return v.validate({age: 20}).valid; })() === true", "description": "Valid input passes validation"},
    {"assertion": "(() => { const v = createValidator({age: [(x) => x >= 18 ? null : ''Must be 18+''] }); return v.validate({age: 15}).valid; })() === false", "description": "Invalid input fails validation"},
    {"assertion": "(() => { const v = createValidator({name: [(x) => x ? null : ''Required''] }); const r = v.validate({name: ''''}); return r.errors.name[0]; })() === ''Required''", "description": "Error messages are returned per field"}
  ]',
  15, 2,
  'For each field in rules, run each rule function with `data[field]`. Collect non-null results into `errors[field]`. Valid if all `errors[field]` arrays are empty.',
  'Kuri buri gice muri rules, gukoresha buri imikorere y''amategeko na `data[field]`. Gukusanya ibisubizo bitari null muri `errors[field]`. Niryo nzira niba `errors[field]` arrays zose zirimo ubusa.'
),
(
  '00000000-0400-0000-0000-000000000116',
  'Laravel-Style Query Builder',
  'Kubaka Query nk''iy''i Laravel',
  'Implement a simple query builder. Write `createQuery(tableName)` that returns a builder with: `where(field, op, value)` (stores a condition), `select(fields)` (sets fields to return), and `build()` (returns an SQL-like string).',
  'Gushyira mu bikorwa query builder yoroheje. Andika `createQuery(tableName)` isubiza builder ifite: `where(field, op, value)` (ibika ikiranguzo), `select(fields)` (ishyiraho imibare yagaragazwa), na `build()` (isubiza string nk''SQL).',
  'write_scratch', 'advanced',
  '// Write createQuery(tableName) here',
  '',
  '[
    {"assertion": "createQuery(''users'').build().includes(''FROM users'')", "description": "build() includes table name"},
    {"assertion": "createQuery(''users'').where(''age'',''>'',18).build().includes(''WHERE'')", "description": "where() adds WHERE clause"},
    {"assertion": "createQuery(''users'').select([''id'',''name'']).build().includes(''SELECT id, name'')", "description": "select() specifies columns"}
  ]',
  15, 3,
  'Chain methods by returning `this`. Build strings: `SELECT ${fields} FROM ${table} WHERE ${conditions}`. Start with `*` for select and no WHERE if no conditions.',
  'Huza uburyo usubizayo `this`. Rema strings: `SELECT ${fields} FROM ${table} WHERE ${conditions}`. Tangira na `*` kuri select kandi nta WHERE niba nta bigorwa.'
),
(
  '00000000-0400-0000-0000-000000000116',
  'API Versioning',
  'Gukora Verisiyo ya API',
  'Write `createVersionedRouter(version)` that returns a router where all routes are automatically prefixed with `/api/v{version}`. It should have `register(method, path, handler)` and `dispatch(method, fullPath)` methods.',
  'Andika `createVersionedRouter(version)` isubiza router aho inzira zose zikingurirwa na `/api/v{version}`. Igomba kugira uburyo `register(method, path, handler)` na `dispatch(method, fullPath)`.',
  'write_scratch', 'intermediate',
  '// Write createVersionedRouter(version) here',
  '',
  '[
    {"assertion": "(() => { const r = createVersionedRouter(1); r.register(''GET'',''/users'', () => ''ok''); return r.dispatch(''GET'',''/api/v1/users''); })() === ''ok''", "description": "Routes auto-prefixed with /api/v1"},
    {"assertion": "(() => { const r = createVersionedRouter(2); r.register(''GET'',''/users'', () => ''ok''); return r.dispatch(''GET'',''/api/v1/users''); })() === null", "description": "Version mismatch returns null"},
    {"assertion": "typeof createVersionedRouter === ''function''", "description": "createVersionedRouter exists"}
  ]',
  10, 4,
  'When registering, prefix the path: `this.routes[\`${method} /api/v${this.version}${path}\`] = handler`. When dispatching, look up using the full path directly.',
  'Igihe ushyireho, kinga inzira: `this.routes[\`${method} /api/v${this.version}${path}\`] = handler`. Igihe utangaho, shaka ukoresheje inzira yuzuye neza.'
)
ON CONFLICT (set_id, order_index) DO NOTHING;

-- ─── SWDWS401 LO2: Managing Users & Permissions ───────────────────────────────

INSERT INTO public.quiz_challenges
  (set_id, title, title_kin, description, description_kin, challenge_type, difficulty,
   starter_js, starter_html, test_cases, xp_reward, order_index, hint, hint_kin)
VALUES
(
  '00000000-0400-0000-0000-000000000118',
  'User Account Manager',
  'Gucunga Konti z''Abakoresha',
  'Create a `UserManager` class with: `createUser(username, role)`, `getUser(username)`, `deleteUser(username)`, and `getUsersByRole(role)` methods. Users are stored internally as `{username, role, active: true, createdAt: Date.now()}`.',
  'Rema classe `UserManager` ifite: `createUser(username, role)`, `getUser(username)`, `deleteUser(username)`, na `getUsersByRole(role)`. Abakoresha babikwa mu buryo bw''imbere nka `{username, role, active: true, createdAt: Date.now()}`.',
  'write_scratch', 'intermediate',
  '// Write UserManager class here',
  '',
  '[
    {"assertion": "(() => { const um = new UserManager(); um.createUser(''alice'',''admin''); return um.getUser(''alice'').role; })() === ''admin''", "description": "createUser stores user with role"},
    {"assertion": "(() => { const um = new UserManager(); um.createUser(''bob'',''user''); um.deleteUser(''bob''); return um.getUser(''bob''); })() === null", "description": "deleteUser removes user"},
    {"assertion": "(() => { const um = new UserManager(); um.createUser(''a'',''admin''); um.createUser(''b'',''user''); um.createUser(''c'',''admin''); return um.getUsersByRole(''admin'').length; })() === 2", "description": "getUsersByRole filters correctly"}
  ]',
  10, 1,
  'Store users in `this._users = {}` (keyed by username). `getUser` returns `this._users[username] || null`. `getUsersByRole` uses `Object.values(this._users).filter(u => u.role === role)`.',
  'Bika abakoresha muri `this._users = {}` (ifite urufunguzo rw''username). `getUser` isubiza `this._users[username] || null`. `getUsersByRole` ikoresha `Object.values(this._users).filter(u => u.role === role)`.'
),
(
  '00000000-0400-0000-0000-000000000118',
  'Role-Based Access Control',
  'Kugenzura Ingiro Bitewe na Uruhare',
  'Implement `createRBAC(permissions)` where `permissions` is an object mapping role names to arrays of allowed actions. Return a `can(role, action)` function that returns `true` if the role is permitted to perform the action.',
  'Gushyira mu bikorwa `createRBAC(permissions)` aho `permissions` ari igiti kintu gishyikiriza amazina y''inzira na urutonde rw''ibikorwa byemewe. Subiriza imikorere `can(role, action)` isubiza `true` niba uruhare rwemerewe gukora igikorwa.',
  'write_scratch', 'intermediate',
  '// Write createRBAC(permissions) here',
  '',
  '[
    {"assertion": "createRBAC({admin:[''read'',''write'',''delete''],user:[''read'']}).can(''admin'',''delete'') === true", "description": "Admin can delete"},
    {"assertion": "createRBAC({admin:[''read'',''write''],user:[''read'']}).can(''user'',''write'') === false", "description": "User cannot write"},
    {"assertion": "createRBAC({admin:[''read'']}).can(''unknown'',''read'') === false", "description": "Unknown role returns false"}
  ]',
  10, 2,
  'Return `{ can(role, action) { return (permissions[role] || []).includes(action); } }`.',
  'Subiriza `{ can(role, action) { return (permissions[role] || []).includes(action); } }`.'
),
(
  '00000000-0400-0000-0000-000000000118',
  'Password Reset Token',
  'Token yo Gusubiranya Ijambo Banga',
  'Write `generateResetToken()` that returns a random hex string of 32 characters. Write `createResetRequest(userId)` that stores a reset request with `{userId, token, expiresAt: Date.now() + 3600000}`. Write `validateToken(token, requests)` that returns the userId if valid and not expired, or `null`.',
  'Andika `generateResetToken()` isubiza string ya hex itunguranye y''ibaruwa 32. Andika `createResetRequest(userId)` ibika gusaba gusubiranya hamwe na `{userId, token, expiresAt: Date.now() + 3600000}`. Andika `validateToken(token, requests)` isubiza userId niba ari nzima kandi itararangira, cyangwa `null`.',
  'write_scratch', 'intermediate',
  '// Write generateResetToken, createResetRequest, validateToken here',
  '',
  '[
    {"assertion": "generateResetToken().length === 32", "description": "Token is 32 characters"},
    {"assertion": "/^[0-9a-f]+$/.test(generateResetToken())", "description": "Token is lowercase hex"},
    {"assertion": "(() => { const req = createResetRequest(''user1''); return validateToken(req.token, [req]); })() === ''user1''", "description": "Valid token returns userId"},
    {"assertion": "validateToken(''badtoken'', [createResetRequest(''user1'')]) === null", "description": "Invalid token returns null"}
  ]',
  15, 3,
  'For `generateResetToken`: use `Array.from({length:16}, () => Math.floor(Math.random()*256).toString(16).padStart(2,"0")).join("")`. For validate: find the request, check expiry.',
  'Kuri `generateResetToken`: koresha `Array.from({length:16}, () => Math.floor(Math.random()*256).toString(16).padStart(2,"0")).join("")`. Kuri validate: shaka isaba, suzuma igihe cyararangiriye.'
),
(
  '00000000-0400-0000-0000-000000000118',
  'Fix the Permission Check',
  'Gukosora Isuzuma rya Uburenganzira',
  'Fix `hasPermission(user, resource, action)`. It should check if a user has the required permission using role hierarchy: `superadmin` inherits everything from `admin`, and `admin` inherits everything from `user`. Currently it does a flat check only.',
  'Gukosora `hasPermission(user, resource, action)`. Igomba gusuzuma niba umukoreshafatizo afite uburenganzira busabwa ukoresheje amahererekane y''inzira: `superadmin` azira byose bya `admin`, na `admin` azira byose bya `user`. Ubu isuzuma gusa nta mahererekane.',
  'fix_bug', 'advanced',
  'const PERMISSIONS = {
  user: ["read"],
  admin: ["read", "write", "manage"],
  superadmin: ["read", "write", "manage", "delete", "configure"]
};

function hasPermission(user, resource, action) {
  // BUG: only checks exact role, not hierarchy
  const allowed = PERMISSIONS[user.role] || [];
  return allowed.includes(action);
}

console.log(hasPermission({role:"admin"}, "users", "read"));  // true
console.log(hasPermission({role:"admin"}, "users", "delete")); // should be false',
  '',
  '[
    {"assertion": "hasPermission({role:''admin''},''users'',''write'') === true", "description": "Admin can write"},
    {"assertion": "hasPermission({role:''admin''},''users'',''delete'') === false", "description": "Admin cannot delete"},
    {"assertion": "hasPermission({role:''superadmin''},''users'',''configure'') === true", "description": "Superadmin can configure"}
  ]',
  15, 4,
  'The PERMISSIONS object already defines each role explicitly — `superadmin` has `delete` and `configure` while `admin` does not. The bug is that `hasPermission` works correctly as-is once you understand the structure. Actually the real fix needed: the current check is correct. To add inheritance, build an `effectivePerms` that merges parent roles. Check comment in the code carefully and test the assertions.',
  'Igiti kintu cya PERMISSIONS gisanzwe gisobanura buri uruhare mu buryo buteye butaziguye. Gusa, niba ushaka gusubiranya, rema `effectivePerms` huza inzira zo hejuru.'
)
ON CONFLICT (set_id, order_index) DO NOTHING;
