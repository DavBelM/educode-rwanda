-- =============================================
-- EduCode Rwanda — RTB Curriculum Quiz Sets
-- Run AFTER schema-quizzes.sql AND schema-v2-patches.sql
-- One set per Learning Outcome per module
-- =============================================

-- ─── Update existing JS Fundamentals sets to rqf_level=3 ──────────────────────
UPDATE public.quiz_sets SET rqf_level = 3
WHERE id IN (
  '10000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000002',
  '30000000-0000-0000-0000-000000000003',
  '40000000-0000-0000-0000-000000000004',
  '50000000-0000-0000-0000-000000000005'
);

-- ─── LEVEL 3 — RQF Level 3 Sets ───────────────────────────────────────────────
-- Module SWDPR301: Project Requirement Analysis

INSERT INTO public.quiz_sets (id, title, title_kin, description, description_kin, order_index, xp_reward, rqf_level) VALUES
(
  '00000000-0300-0000-0000-000000000006',
  'SWDPR301: Identifying Customer Needs',
  'SWDPR301: Kumenya Ibisabwa n''Umukiriya',
  'Learn to structure and analyse customer interview data using JavaScript objects and arrays.',
  'Iga guhuza no gusesengura makuru y''ibiganiro by''abakiriya ukoresheje ibintu na arrays bya JavaScript.',
  6, 80, 3
),
(
  '00000000-0300-0000-0000-000000000007',
  'SWDPR301: Gathering Project Requirements',
  'SWDPR301: Gukusanya Ibisabwa by''Umushinga',
  'Model and validate project requirements as structured data — functional, non-functional, and constraints.',
  'Tegura kandi suzuma ibisabwa by''umushinga nk''amakuru yateguwe — ibikorwa, bitari ibikorwa, n''ibibujijwe.',
  7, 80, 3
),
(
  '00000000-0300-0000-0000-000000000008',
  'SWDPR301: User Stories & Task Flow',
  'SWDPR301: Inkuru z''Abakoresha n''Inzira z''Imirimo',
  'Create structured user stories and model task flows using JavaScript linked objects and graphs.',
  'Rema inkuru z''abakoresha zateguwe kandi ushushanya inzira z''imirimo ukoresheje JavaScript.',
  8, 80, 3
),

-- Module SWDVF301: Vue JS Framework — Develop Simple Game in Vue Framework

(
  '00000000-0300-0000-0000-000000000009',
  'SWDVF301: Vue Environment Setup',
  'SWDVF301: Gutegura Ibikoresho bya Vue',
  'Understand Vue component structure, reactivity concepts, and project file organisation.',
  'Menya imiterere y''ibice bya Vue, uko ibintu bishobora gusubiramo, n''uburyo umushinga utunganyijwe.',
  9, 80, 3
),
(
  '00000000-0300-0000-0000-000000000010',
  'SWDVF301: Applying Vue Framework',
  'SWDVF301: Gukoresha Framework ya Vue',
  'Work with Vue component structures, routing, data binding, and state management patterns.',
  'Gukora na Vue components, routing, guhuza amakuru, n''imicungire y''imiterere.',
  10, 80, 3
),
(
  '00000000-0300-0000-0000-000000000011',
  'SWDVF301: Planning a Game',
  'SWDVF301: Gutegura Umukino',
  'Describe game mechanics, state, controls, and narrative using JavaScript data structures.',
  'Sobanura uburyo umukino ukora, imiterere yarwo, n''inzira yo kuwugenzura ukoresheje JavaScript.',
  11, 80, 3
),
(
  '00000000-0300-0000-0000-000000000012',
  'SWDVF301: Developing Game Functionality',
  'SWDVF301: Gukora Imikorere y''Umukino',
  'Implement game logic, score tracking, collision detection, and event handling with JavaScript.',
  'Gushyira mu bikorwa logic y''umukino, gukurikirana amanota, kumenya ibihurana, no gukemura ibikorwa.',
  12, 80, 3
),

-- Module GENGD301: Basic Graphic Design

(
  '00000000-0300-0000-0000-000000000013',
  'GENGD301: Working with Image Data',
  'GENGD301: Gukora na Makuru y''Amashusho',
  'Manipulate pixel colour values, apply filters, and transform images using JavaScript Canvas API.',
  'Guhindura agaciro k''umukara wa pixels, shyiraho filters, kandi hindura amashusho ukoresheje Canvas API.',
  13, 80, 3
),
(
  '00000000-0300-0000-0000-000000000014',
  'GENGD301: Vector Graphics & Shapes',
  'GENGD301: Imishusho ya Vector na Shapes',
  'Create, style, and transform vector shapes and paths using SVG and Canvas in JavaScript.',
  'Rema, shyiraho imiterere, kandi hindura imishusho ya vector ukoresheje SVG na Canvas muri JavaScript.',
  14, 80, 3
),
(
  '00000000-0300-0000-0000-000000000015',
  'GENGD301: File Formats & Export',
  'GENGD301: Ubwoko bw''Amafoto n''Kohereza',
  'Understand image file formats, quality settings, and encode/decode image data in JavaScript.',
  'Menya ubwoko bw''amafoto, ingano y''ubumenyi, no gushiraho no gusobanura amakuru y''amashusho muri JavaScript.',
  15, 80, 3
)

ON CONFLICT (id) DO UPDATE
  SET title = EXCLUDED.title, title_kin = EXCLUDED.title_kin,
      description = EXCLUDED.description, order_index = EXCLUDED.order_index,
      rqf_level = EXCLUDED.rqf_level;

-- ─── LEVEL 4 — RQF Level 4 Sets ───────────────────────────────────────────────
-- Module GENBN401: Basics of Networking

INSERT INTO public.quiz_sets (id, title, title_kin, description, description_kin, order_index, xp_reward, rqf_level) VALUES
(
  '00000000-0400-0000-0000-000000000100',
  'GENBN401: Network Media & Connectivity',
  'GENBN401: Itumanaho rya Network na Gutumanahana',
  'Model network topologies and connectivity requirements as JavaScript data structures.',
  'Shushanya imiterere ya network na gusaba gutumanahana nk''imiterere y''amakuru ya JavaScript.',
  100, 120, 4
),
(
  '00000000-0400-0000-0000-000000000101',
  'GENBN401: IP Addressing & Subnetting',
  'GENBN401: Aderesi za IP na Subnetting',
  'Implement IP address validation, binary conversion, and subnet mask calculations in JavaScript.',
  'Gushyira mu bikorwa gusuzuma aderesi za IP, guhindura mu binary, no kubara subnet masks muri JavaScript.',
  101, 120, 4
),
(
  '00000000-0400-0000-0000-000000000102',
  'GENBN401: Network Maintenance & Troubleshooting',
  'GENBN401: Kubungabunga no Gukemura Ibibazo bya Network',
  'Parse network diagnostic data and generate structured maintenance and troubleshooting reports.',
  'Sesa amakuru y''isuzuma rya network kandi rema raporo yateguwe yo kubungabunga no gukemura ibibazo.',
  102, 120, 4
),

-- Module SWDBD401: Backend Application Development

(
  '00000000-0400-0000-0000-000000000103',
  'SWDBD401: RESTful API Design',
  'SWDBD401: Ushushanya wa RESTful API',
  'Design and implement RESTful API route handlers, request validation, and response formatting.',
  'Ushushanya no gushyira mu bikorwa inzira za RESTful API, gusuzuma ibisabwa, no gutunganya ibisubizo.',
  103, 120, 4
),
(
  '00000000-0400-0000-0000-000000000104',
  'SWDBD401: Securing Backend Applications',
  'SWDBD401: Kurinda Application ya Backend',
  'Implement authentication, input sanitisation, environment variable handling, and basic encryption.',
  'Gushyira mu bikorwa kwemeza umunyamakuru, gukura amakuru mabi, gukurikirana ibidashyirwa ahagaragara, na cryptography.',
  104, 120, 4
),
(
  '00000000-0400-0000-0000-000000000105',
  'SWDBD401: Testing Backend Applications',
  'SWDBD401: Gerageza Application ya Backend',
  'Write unit tests, validate API responses, and structure security test cases in JavaScript.',
  'Andika gerageza za unit, suzuma ibisubizo bya API, kandi utunganye ibibazo by''isuzuma ry''umutekano.',
  105, 120, 4
),
(
  '00000000-0400-0000-0000-000000000106',
  'SWDBD401: Deployment & Documentation',
  'SWDBD401: Gushyira Hanze na Nyandiko',
  'Structure deployment configurations, manage environment variables, and generate API documentation.',
  'Tegura imiterere yo gushyira hanze, gucunga amakuru ashinzwe ibidashyirwa ahagaragara, no gukora inyandiko za API.',
  106, 120, 4
),

-- Module SWDBS401: Backend System Design

(
  '00000000-0400-0000-0000-000000000107',
  'SWDBS401: Analysing System Requirements',
  'SWDBS401: Gusesengura Ibisabwa by''Sisitemu',
  'Document FURPS requirements (Functionality, Usability, Reliability, Performance, Supportability) as code.',
  'Andika ibisabwa bya FURPS (Imikorere, Gukoresha, Gukomera, Imihigo, Gufashwa) nk''code.',
  107, 120, 4
),
(
  '00000000-0400-0000-0000-000000000108',
  'SWDBS401: Developing System Structure',
  'SWDBS401: Gukora Imiterere ya Sisitemu',
  'Apply OOP principles and SSADM methodology to model backend system architecture in JavaScript.',
  'Shyira mu bikorwa amahame ya OOP na SSADM kugira ngo ushushane imiterere ya sisitemu ya backend muri JavaScript.',
  108, 120, 4
),
(
  '00000000-0400-0000-0000-000000000109',
  'SWDBS401: Building System Design Documents',
  'SWDBS401: Kubaka Inyandiko z''Ushushanya wa Sisitemu',
  'Implement data flow diagrams as graph structures and model physical data schemas in code.',
  'Shyira mu bikorwa diagrams z''inzira z''amakuru nk''imiterere ya graph no gushushanya schema y''amakuru mu code.',
  109, 120, 4
),

-- Module SWDDA401: Data Structures & Algorithm Fundamentals

(
  '00000000-0400-0000-0000-000000000110',
  'SWDDA401: Algorithm Fundamentals',
  'SWDDA401: Ibidukikije by''Algorithm',
  'Convert between number systems (binary, decimal, hexadecimal), implement logic gates, and write algorithms.',
  'Hindura hagati y''inzira z''imibare (binary, decimal, hexadecimal), shyira mu bikorwa logic gates, kandi andika algorithms.',
  110, 120, 4
),
(
  '00000000-0400-0000-0000-000000000111',
  'SWDDA401: Data Structures',
  'SWDDA401: Imiterere y''Amakuru',
  'Implement stacks, queues, linked lists, trees, and graphs — the fundamental data structures.',
  'Shyira mu bikorwa stacks, queues, linked lists, trees, na graphs — imiterere y''amakuru y''ingenzi.',
  111, 120, 4
),
(
  '00000000-0400-0000-0000-000000000112',
  'SWDDA401: Implementing Algorithms in JavaScript',
  'SWDDA401: Gushyira Algorithms mu JavaScript',
  'Implement classic algorithms, analyse time and space complexity (Big-O), and optimise solutions.',
  'Shyira mu bikorwa algorithms z''ingenzi, sesengura complexity ya igihe na aho hafatirwa amakuru (Big-O), no kunoza ibisubizo.',
  112, 120, 4
),

-- Module SWDPP401: PHP Programming

(
  '00000000-0400-0000-0000-000000000113',
  'SWDPP401: PHP Fundamentals & OOP',
  'SWDPP401: Ibidukikije bya PHP na OOP',
  'Apply PHP programming concepts — OOP, classes, inheritance, and security — adapted to JavaScript.',
  'Shyira mu bikorwa imyumvire ya PHP — OOP, classes, kuragira, no kubungabunga — ivugurura muri JavaScript.',
  113, 120, 4
),
(
  '00000000-0400-0000-0000-000000000114',
  'SWDPP401: PHP & Database Operations',
  'SWDPP401: PHP na Ibikorwa bya Database',
  'Model PHP database CRUD patterns, authentication logic, and error handling in JavaScript.',
  'Gushushanya imiterere ya CRUD ya database ya PHP, logic yo kwemeza umunyamakuru, no gukemura amakosa muri JavaScript.',
  114, 120, 4
),
(
  '00000000-0400-0000-0000-000000000115',
  'SWDPP401: Building a CMS with PHP',
  'SWDPP401: Kubaka CMS na PHP',
  'Implement content management system patterns — routing, sessions, permissions, and dynamic content.',
  'Shyira mu bikorwa imiterere ya CMS — routing, sessions, uburenganzira, n''ibikubiyemo bihinduka.',
  115, 120, 4
),
(
  '00000000-0400-0000-0000-000000000116',
  'SWDPP401: MVC Framework Patterns (Laravel)',
  'SWDPP401: Imiterere ya MVC (Laravel)',
  'Implement the Model-View-Controller pattern, routing, and form validation in JavaScript.',
  'Shyira mu bikorwa imiterere ya Model-View-Controller, routing, no gusuzuma amakuru y''ibyemeza muri JavaScript.',
  116, 120, 4
),

-- Module SWDWS401: Windows Server Administration

(
  '00000000-0400-0000-0000-000000000117',
  'SWDWS401: Managing Server Services',
  'SWDWS401: Gucunga Serivisi za Server',
  'Model server configuration — DNS, DHCP, domain controllers — as structured JavaScript objects.',
  'Gushushanya imiterere ya server — DNS, DHCP, domain controllers — nk''ibintu byateguwe bya JavaScript.',
  117, 120, 4
),
(
  '00000000-0400-0000-0000-000000000118',
  'SWDWS401: Managing Users & Permissions',
  'SWDWS401: Gucunga Abakoresha n''Uburenganzira',
  'Implement user account management, group permissions, and role-based access control logic.',
  'Gushyira mu bikorwa gucunga konti z''abakoresha, uburenganzira bw''itsinda, na logic yo kugenzura uburenganzira.',
  118, 120, 4
),
(
  '00000000-0400-0000-0000-000000000119',
  'SWDWS401: Web Application Deployment',
  'SWDWS401: Gushyira Hanze za Application za Web',
  'Structure web application deployment configurations and validate hosting environment requirements.',
  'Tegura imiterere yo gushyira hanze za application za web no gusuzuma ibyangombwa by''ibikoresho byo gutuza.',
  119, 120, 4
)

ON CONFLICT (id) DO UPDATE
  SET title = EXCLUDED.title, title_kin = EXCLUDED.title_kin,
      description = EXCLUDED.description, order_index = EXCLUDED.order_index,
      rqf_level = EXCLUDED.rqf_level;

-- ─── LEVEL 5 — RQF Level 5 Sets ───────────────────────────────────────────────
-- Module GENPP501: Python Programming Fundamentals

INSERT INTO public.quiz_sets (id, title, title_kin, description, description_kin, order_index, xp_reward, rqf_level) VALUES
(
  '00000000-0500-0000-0000-000000000200',
  'GENPP501: Python Environment & Tools',
  'GENPP501: Ibikoresho na Aho Gukora Python',
  'Compare Python and JavaScript syntax, select appropriate tools, and understand the Python ecosystem.',
  'Biguranye imyandike ya Python na JavaScript, hitamo ibikoresho bikwiye, kandi menya isi ya Python.',
  200, 160, 5
),
(
  '00000000-0500-0000-0000-000000000201',
  'GENPP501: Core Python Programming',
  'GENPP501: Ibikorwa Ngenderwaho bya Python',
  'Apply Python variables, control structures, functions, collections, and file handling — adapted to JS.',
  'Shyira mu bikorwa impinduramimerere za Python, imiterere yo kugenzura, imikorere, imbumba, no gukurikirana files — ivugurura muri JS.',
  201, 160, 5
),
(
  '00000000-0500-0000-0000-000000000202',
  'GENPP501: Object-Oriented Python',
  'GENPP501: Python Ikurikira Ibintu',
  'Implement Python OOP patterns — classes, inheritance, libraries, and system automation — in JavaScript.',
  'Shyira mu bikorwa imiterere ya OOP ya Python — classes, kuragira, libraries, no guhindura sisitemu — muri JavaScript.',
  202, 160, 5
),

-- Module SWDFB501: Fundamentals of Blockchain Application

(
  '00000000-0500-0000-0000-000000000203',
  'SWDFB501: Blockchain Architecture',
  'SWDFB501: Imiterere ya Blockchain',
  'Model blockchain data structures — blocks, chains, hashes, and consensus — in JavaScript.',
  'Gushushanya imiterere y''amakuru ya blockchain — blocks, ingorofa, hash, na consensus — muri JavaScript.',
  203, 160, 5
),
(
  '00000000-0500-0000-0000-000000000204',
  'SWDFB501: Solidity Smart Contract Basics',
  'SWDFB501: Ibidukikije bya Solidity Smart Contracts',
  'Implement smart contract logic — state variables, functions, gas optimisation — in JavaScript.',
  'Shyira mu bikorwa logic ya smart contracts — variables z''imiterere, imikorere, no kunoza gas — muri JavaScript.',
  204, 160, 5
),
(
  '00000000-0500-0000-0000-000000000205',
  'SWDFB501: Developing Smart Contract Systems',
  'SWDFB501: Gukora Sisitemu ya Smart Contracts',
  'Implement token creation, contract security patterns, and event emission in JavaScript.',
  'Shyira mu bikorwa gukora tokens, imiterere yo gukingira contracts, no gutanga inyito muri JavaScript.',
  205, 160, 5
),
(
  '00000000-0500-0000-0000-000000000206',
  'SWDFB501: Frontend Blockchain Integration',
  'SWDFB501: Guhuza Frontend na Blockchain',
  'Connect smart contracts to a frontend — load Web3 dependencies, call contract methods, handle events.',
  'Huza smart contracts na frontend — shyira Web3 dependencies, hamagara methods za contract, gukemura inyito.',
  206, 160, 5
),

-- Module SWDDT501: DevOps Techniques Application

(
  '00000000-0500-0000-0000-000000000207',
  'SWDDT501: Server Configuration & Linux',
  'SWDDT501: Gushyiraho Server na Linux',
  'Parse and execute Linux shell commands, model server configuration, and manage services in code.',
  'Soma no gushyira mu bikorwa amategeko ya Linux shell, gushushanya imiterere ya server, no gucunga serivisi mu code.',
  207, 160, 5
),
(
  '00000000-0500-0000-0000-000000000208',
  'SWDDT501: Deployment & Containerisation',
  'SWDDT501: Gushyira Hanze na Containerisation',
  'Model CI/CD pipeline stages, Docker container configurations, and migration scripts in JavaScript.',
  'Gushushanya inzira za CI/CD, imiterere ya Docker containers, na scripts zo guhindura muri JavaScript.',
  208, 160, 5
),
(
  '00000000-0500-0000-0000-000000000209',
  'SWDDT501: Monitoring & Performance',
  'SWDDT501: Gukurikirana no Gusuzuma Imikorere',
  'Parse performance metrics, analyse system logs, and generate structured monitoring reports.',
  'Sesa ibipimo by''imikorere, sesengura inyandiko za sisitemu, kandi rema raporo yateguwe yo gukurikirana.',
  209, 160, 5
),

-- Module SWDFA501: Frontend Application Development with React.js

(
  '00000000-0500-0000-0000-000000000210',
  'SWDFA501: React.js Core Concepts',
  'SWDFA501: Imyumvire Ngenderwaho ya React.js',
  'Build React component logic, manage props and state, implement hooks, and handle events.',
  'Rema logic y''ibice bya React, gucunga props na state, shyira mu bikorwa hooks, no gukemura inyito.',
  210, 160, 5
),
(
  '00000000-0500-0000-0000-000000000211',
  'SWDFA501: Tailwind CSS Utility Classes',
  'SWDFA501: Amato ya CSS ya Tailwind',
  'Apply utility-first CSS principles, implement responsive design, and customise design tokens.',
  'Shyira mu bikorwa amahame ya CSS y''ibikoresho, gushyira mu bikorwa ushushanya wa responsive, no guhindura tokens z''ushushanya.',
  211, 160, 5
),
(
  '00000000-0500-0000-0000-000000000212',
  'SWDFA501: Next.js & TypeScript',
  'SWDFA501: Next.js na TypeScript',
  'Apply TypeScript type system, implement Next.js routing, SSR, SSG, and API route patterns.',
  'Shyira mu bikorwa uburyo bwa TypeScript, gushyira mu bikorwa routing ya Next.js, SSR, SSG, na imiterere ya API routes.',
  212, 160, 5
),
(
  '00000000-0500-0000-0000-000000000213',
  'SWDFA501: Progressive Web Applications',
  'SWDFA501: Application za Web Zigenda Imbere',
  'Implement service workers, Web App Manifests, offline caching strategies, and PWA patterns.',
  'Shyira mu bikorwa service workers, Web App Manifests, imiterere y''kugumana amakuru nta internet, na imiterere ya PWA.',
  213, 160, 5
),
(
  '00000000-0500-0000-0000-000000000214',
  'SWDFA501: Deployment & Environment Config',
  'SWDFA501: Gushyira Hanze na Imiterere y''Aho Gukora',
  'Handle environment variables securely, configure deployment pipelines, and set up custom domains.',
  'Gucunga amakuru y''ibidashyirwa ahagaragara mu mutekano, shyiraho inzira zo gushyira hanze, no gushyiraho domains.',
  214, 160, 5
),

-- Module SWDMA501: Mobile Application Development

(
  '00000000-0500-0000-0000-000000000215',
  'SWDMA501: Dart & Flutter Fundamentals',
  'SWDMA501: Ibidukikije bya Dart na Flutter',
  'Apply Dart language concepts — OOP, collections, null safety — translated to equivalent JavaScript.',
  'Shyira mu bikorwa imyumvire ya Dart — OOP, imbumba, null safety — ivugururwa muri JavaScript y''ingero.',
  215, 160, 5
),
(
  '00000000-0500-0000-0000-000000000216',
  'SWDMA501: Flutter UI & State Management',
  'SWDMA501: Flutter UI na Imicungire y''Imiterere',
  'Model Flutter widget tree structures, implement state management patterns, and handle user interactions.',
  'Gushushanya imiterere y''igi ya widgets za Flutter, shyira mu bikorwa imiterere yo gucunga imiterere, no gukemura gukora k''abakoresha.',
  216, 160, 5
),
(
  '00000000-0500-0000-0000-000000000217',
  'SWDMA501: Backend Integration & APIs',
  'SWDMA501: Guhuza Backend na APIs',
  'Implement REST API integration, local storage, error handling, and testing patterns for mobile apps.',
  'Gushyira mu bikorwa guhuza REST API, kubika amakuru hafi, gukemura amakosa, na imiterere yo gerageza za application za mobile.',
  217, 160, 5
),
(
  '00000000-0500-0000-0000-000000000218',
  'SWDMA501: App Publishing & Distribution',
  'SWDMA501: Gutanga na Gukwirakwiza App',
  'Structure app build configurations, validate release requirements, and handle post-deployment issues.',
  'Tegura imiterere yo kubaka app, suzuma ibyangombwa byo gutanga, no gukemura ibibazo nyuma yo gushyira hanze.',
  218, 160, 5
),

-- Module NITML501: Machine Learning Fundamentals

(
  '00000000-0500-0000-0000-000000000219',
  'NITML501: Data Pre-processing',
  'NITML501: Gutegura Amakuru Mbere yo Gukoresha',
  'Collect, clean, normalise, and visualise datasets — the essential first step in machine learning.',
  'Gukusanya, gukarura, guhindura mu bwuri, kandi kwerekana datasets — intambwe ya mbere ingenzi muri machine learning.',
  219, 160, 5
),
(
  '00000000-0500-0000-0000-000000000220',
  'NITML501: Developing ML Models',
  'NITML501: Gukora Indangamiterere za ML',
  'Implement and evaluate machine learning algorithms — regression, classification, and clustering in JS.',
  'Shyira mu bikorwa no gusuzuma algorithms za machine learning — regression, classification, na clustering muri JS.',
  220, 160, 5
),
(
  '00000000-0500-0000-0000-000000000221',
  'NITML501: Model Deployment',
  'NITML501: Gushyira Hanze Indangamiterere',
  'Serialise trained models, load them in a runtime, and integrate predictions into an application.',
  'Tungshe indangamiterere zize, toziye muri runtime, kandi huza amasezerano muri application.',
  221, 160, 5
),

-- Module SWDND501: NoSQL Database Development

(
  '00000000-0500-0000-0000-000000000222',
  'SWDND501: NoSQL Database Fundamentals',
  'SWDND501: Ibidukikije bya NoSQL Database',
  'Compare SQL vs NoSQL paradigms, select the right database type, and understand document-based models.',
  'Biguranye SQL na NoSQL, hitamo ubwoko bw''igenomero ry''amakuru bukwiye, kandi menya indangamiterere zifatirwa mu nyandiko.',
  222, 160, 5
),
(
  '00000000-0500-0000-0000-000000000223',
  'SWDND501: Designing NoSQL Schemas',
  'SWDND501: Gushushanya Imiterere ya NoSQL',
  'Design MongoDB-style document schemas, embed vs reference decisions, and index strategies.',
  'Ushushanya imiterere ya documents ya MongoDB, gufata icyemezo cyo kwinjiza cyangwa guhuza, n''imiterere y''indexes.',
  223, 160, 5
),
(
  '00000000-0500-0000-0000-000000000224',
  'SWDND501: MongoDB CRUD & Queries',
  'SWDND501: CRUD na Ibipimo bya MongoDB',
  'Implement MongoDB-style CRUD operations, aggregation pipelines, and query optimisation patterns.',
  'Shyira mu bikorwa ibikorwa bya CRUD bya MongoDB, inzira zo guhuza, na imiterere yo kunoza ibipimo.',
  224, 160, 5
),
(
  '00000000-0500-0000-0000-000000000225',
  'SWDND501: Database Security & Administration',
  'SWDND501: Umutekano no Gucunga Database',
  'Implement MongoDB user management, access control, connection security, and deployment configurations.',
  'Shyira mu bikorwa gucunga abakoresha ba MongoDB, kugenzura ingiro, umutekano wo gutumanahana, na imiterere yo gushyira hanze.',
  225, 160, 5
),

-- Module GENQA501: Quality Assurance Application

(
  '00000000-0500-0000-0000-000000000226',
  'GENQA501: Requirements Analysis for QA',
  'GENQA501: Gusesengura Ibisabwa kuri QA',
  'Parse Terms of Reference, extract testable requirements, and structure test analysis documents.',
  'Sesa amasezerano y''ikiciro, vomora ibisabwa bishobora gugeragezwa, kandi teguza inyandiko z''isesengura ry''ibizamini.',
  226, 160, 5
),
(
  '00000000-0500-0000-0000-000000000227',
  'GENQA501: Test Planning & Execution',
  'GENQA501: Gutegura no Gushyira mu Bikorwa Ibizamini',
  'Write test plans, create test cases with inputs and expected outputs, and report test results.',
  'Andika amategeko y''ibizamini, rema ibibazo by''ibizamini hamwe n''ibinjizwa n''ibisubizo biteganywa, kandi tanga ibisubizo by''ibizamini.',
  227, 160, 5
),
(
  '00000000-0500-0000-0000-000000000228',
  'GENQA501: Test Documentation & Reporting',
  'GENQA501: Inyandiko z''Ibizamini na Raporo',
  'Consolidate test results, generate User Acceptance Testing reports, and write recommendation documents.',
  'Huza ibisubizo by''ibizamini, rema raporo za User Acceptance Testing, kandi andika inyandiko z''inama.',
  228, 160, 5
)

ON CONFLICT (id) DO UPDATE
  SET title = EXCLUDED.title, title_kin = EXCLUDED.title_kin,
      description = EXCLUDED.description, order_index = EXCLUDED.order_index,
      rqf_level = EXCLUDED.rqf_level;
