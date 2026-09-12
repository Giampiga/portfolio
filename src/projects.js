const github = "https://github.com/Giampiga";

const trucoImages = [
  { src: "/assets/projects/truco-vercel-practice.png", alt: "Truco on Vercel: an active practice hand against Truquito with cards on the table", label: "Truco · practice against Truquito" },
  { src: "/assets/projects/truco-vercel-cantos.png", alt: "Retruco confirmation beside the player's hand, available actions and Truquito's explanation", label: "Truco · cantos and guided practice" },
  { src: "/assets/projects/truco-vercel-lobby.png", alt: "Current Truco lobby with casual and competitive play options", label: "Truco · casual and competitive lobby" },
  { src: "/assets/projects/truco-vercel-mobile.png", alt: "Truco practice table adapted to a mobile screen", label: "Truco · mobile practice" },
];

const multiplayerGames = [
  {
    id: "truco-venezolano",
    title: "Truco venezolano",
    role: "Full-stack development · AI-assisted",
    date: "2026 · ongoing",
    status: "Work in progress",
    description: "A full-stack Venezuelan card-game platform with server-authoritative multiplayer, public and private rooms, and rule-based AI practice. I built the gameplay, player experience and persistent social features.",
    detail: "Built with React and TypeScript, with authenticated APIs and persistent data for Elo rankings, profiles, friendships, chat and match history. The responsive interface supports drag-and-drop cards, contextual controls and dark mode. Tested game rules power 1v1/2v2 tables and Truquito practice, with three difficulty levels, explanations, pause and undo/redo. AI practice is available on Vercel; hosted online services remain in progress.",
    stack: ["Next.js", "React", "TypeScript", "Supabase", "PostgreSQL"],
    access: "Vercel · AI practice available; online play in progress.",
    image: trucoImages[0],
    images: trucoImages,
    links: [{ label: "Open Truco", href: "https://truco-ve.vercel.app/" }],
  },
  {
    id: "stack-rush",
    title: "Stack Rush",
    role: "Product direction · AI-assisted engineering",
    date: "Aug–Sep 2026",
    status: "Live prototype",
    description: "Tower of Hanoi and Nuts & Bolts, built for solo practice, daily puzzles and head-to-head races.",
    detail: "Server-authoritative moves, shared countdowns, opponent progress, reconnects, and rematches keep both players on the same page.",
    stack: ["React", "TypeScript", "Cloudflare", "D1"],
    access: "Play on Vercel · public source.",
    image: { src: "/assets/projects/stack-rush-live.png", alt: "Current Stack Rush interface with Tower of Hanoi, Nuts & Bolts, solo practice and the daily puzzle", label: "Stack Rush · Hanoi & Nuts and Bolts" },
    links: [
      { label: "Play Stack Rush", href: "https://stack-rush-pi.vercel.app/" },
      { label: "Stack Rush source", href: "https://github.com/Giampiga/stack-rush" },
    ],
  },
  {
    id: "binaryrush",
    title: "Binaryrush",
    role: "Product direction · AI-assisted engineering",
    date: "Aug 2026 · ongoing",
    status: "Work in progress",
    description: "Race through JavaScript challenges solo or with up to five players. Hidden tests judge submissions and update the standings.",
    detail: "A bounded QuickJS sandbox, server-owned judging, and private opponent code form the engineering core. Built with Codex and published on GPT Sites.",
    stack: ["React", "TypeScript", "D1", "QuickJS WASM"],
    access: "Built with Codex · published on GPT Sites · controlled alpha.",
    image: { src: "/assets/projects/binaryrush-home.png", alt: "Binaryrush browser coding race home screen", label: "Binaryrush · work in progress" },
    links: [{ label: "Play Binaryrush", href: "https://binaryrush.gga.chatgpt.site/" }],
  },
];

export const primaryProjects = [
  {
    id: "restaurant-menu-pos",
    carousel: true,
    number: "01",
    group: "Featured case study",
    title: "Restaurant Menu-to-POS Prototypes for Local Food Trucks",
    shortTitle: "Restaurant Menu-to-POS",
    role: "Product owner · Product designer · Frontend prototyper",
    ledgerRole: "Product Owner / Frontend",
    date: "Aug 2026",
    status: "Prototype · partner conversations",
    accent: "#ed3e32",
    summary:
      "Two food-truck storefront prototypes with distinct branding, configurable menus, modifiers and local carts: Ghost and Koë.",
    proof:
      "Responsive ordering flows and a reusable Codex skill for food-truck websites. Built for prospective partners; payment, order submission and POS integration are not live.",
    contribution:
      "I formed the effort, own the product direction, designed both brand experiences and built the frontend prototypes.",
    evidence: [
      "Two distinct restaurant brands on one reusable commerce foundation",
      "Responsive storefront and ordering flows",
      "A reusable Codex skill for food-truck site delivery",
    ],
    images: [
      { src: "/assets/projects/ghost-current.jpg", alt: "Current Ghost food-truck storefront prototype on desktop", label: "Ghost storefront" },
      { src: "/assets/projects/koe-current.jpg", alt: "Current Koë restaurant ordering prototype on desktop", label: "Koë storefront" },
      { src: "/assets/projects/ghost-modifiers-live.jpg", alt: "Ghost’s mixed-protein selector with steak and chicken selected, duplicate choices disabled and the item price updated to $20", label: "Ghost · two distinct proteins, one updated price", detail: true },
      { src: "/assets/projects/ghost-cart-live.jpg", alt: "Ghost’s demo cart preserves the mixed steak-and-chicken selection and shows quantity, subtotal and estimated tax", label: "Ghost · configured item carried into the demo cart", detail: true },
      { src: "/assets/projects/ghost-ipad.png", alt: "Ghost food-truck menu prototype on tablet", label: "Responsive menu", detail: true },
    ],
    links: [
      { label: "Open Ghost storefront", href: "https://ghost-prototype-mu.vercel.app/" },
      { label: "Open Koë storefront", href: "https://koe-usa-website.vercel.app/" },
    ],
    station: { x: 19, y: 46, screen: { x: 10.2, y: 41.1, w: 13.8, h: 8.7, rotate: 0 } },
  },
  {
    id: "realtime-multiplayer-lab",
    carousel: true,
    number: "02",
    group: "Featured case study",
    title: "Realtime Multiplayer Lab",
    shortTitle: "Realtime Multiplayer Lab",
    role: "Product direction · AI-assisted engineering",
    ledgerRole: "Product Direction / AI-Assisted Eng.",
    date: "Aug–Sep 2026",
    status: "Stack Rush live · Binaryrush & Truco in progress",
    accent: "#6256df",
    summary:
      "A coding race, a puzzle arcade and Venezuelan Truco—three explorations of shared game state. Binaryrush was built with Codex and published on GPT Sites.",
    proof:
      "Server-owned rules, hidden-test judging and reconnect flows, with two-client test evidence for Stack Rush and guided AI practice in Truco.",
    contribution:
      "I designed and developed the products with AI-assisted engineering, from game rules and interaction to server APIs and persistent state.",
    evidence: [
      "Realtime rooms, reconnects and rematches",
      "Server-authoritative competition state",
      "Two-client interaction and failure-state QA",
    ],
    images: [multiplayerGames[2].image, multiplayerGames[1].image, ...trucoImages],
    links: multiplayerGames.flatMap((game) => game.links),
    station: { x: 16, y: 70, screen: { x: 7.5, y: 60.8, w: 13.2, h: 9.9, rotate: 0 } },
  },
  {
    id: "arkollab",
    number: "03",
    group: "Featured case study",
    title: "Arkollab",
    shortTitle: "Arkollab",
    role: "Product + frontend prototype contributor",
    ledgerRole: "Product / Frontend Engineer",
    date: "Jun 2026",
    status: "Team project · open frontend PR",
    accent: "#7165e8",
    summary:
      "A luxury-bag appraisal workflow that turns marketplace evidence into a clear, inspectable valuation report instead of a black-box price.",
    proof:
      "A staged frontend journey from intake and condition through mock comparables, reports and saved records. Submitted as an open, unmerged PR.",
    contribution:
      "I designed and implemented the v0 appraisal journey. Authentication, backend services and the broader AI-search system are team work.",
    evidence: [
      "Sold comparables separated from active asking prices",
      "Condition and confidence made visible in the report",
      "My contribution isolated from the broader team system",
    ],
    images: [
      { src: "/assets/projects/arkollab-dashboard-live.jpg", alt: "Arkollab’s live dashboard showing saved luxury-bag appraisals, completion status and estimated values", label: "Team app · saved appraisals", caption: "Current team app · saved appraisals organized for review." },
      { src: "/assets/projects/arkollab-appraisal-live.jpg", alt: "Completed Hermès Kelly 28 appraisal in Arkollab showing a valuation range, confidence and sold-versus-active comparable summaries", label: "Team app · completed appraisal", caption: "Current team app · completed Hermès Kelly 28 appraisal, with valuation, confidence and comparable summaries." },
      { src: "/assets/projects/arkollab-intake-live.jpg", alt: "Arkollab’s current live app showing its empty appraisal form for brand, model, material and condition", label: "Live app · appraisal intake", caption: "Current team app · structured appraisal intake, with no saved records shown." },
    ],
    links: [
      { label: "Open live app", href: "https://project-21faf183-fcb8-4503-941.web.app/" },
    ],
    station: { x: 48, y: 65, screen: { x: 33.2, y: 55.7, w: 18.2, h: 12.8, rotate: 0 } },
  },
  {
    id: "cognitive-load-mvp",
    number: "04",
    group: "Featured case study",
    title: "Cognitive Load MVP",
    shortTitle: "Cognitive Load MVP",
    role: "Sole author · CS 6795",
    ledgerRole: "Research / Python Engineer",
    date: "Apr 2026",
    status: "Research prototype",
    accent: "#238861",
    summary:
      "An interpretable learning-support model comparing hints, walkthroughs, full explanations and adaptive guidance across a frozen task analysis.",
    proof:
      "Four assistance policies compared across eight tasks, with inspectable equations for reasoning effort and presentation load.",
    contribution:
      "I built the product and analysis. Its outputs are model predictions and heuristics—not measured student outcomes.",
    evidence: [
      "Four assistance policies compared consistently",
      "Inspectable task-level scoring",
      "Explicit limitations around modeled outcomes",
    ],
    images: [
      { src: "/assets/projects/cognitive-load-results.png", alt: "Cognitive Load MVP task-level analysis", label: "Task-level results" },
    ],
    links: [],
    station: { x: 48, y: 86, screen: { x: 33.5, y: 79.9, w: 17.8, h: 10.8, rotate: 0 } },
  },
  {
    id: "circle-accuracy",
    number: "05",
    group: "Supporting work",
    title: "Circle Accuracy",
    shortTitle: "Circle Accuracy",
    role: "Solo product + frontend engineer",
    ledgerRole: "Engineering Prototype",
    date: "2025–2026",
    status: "Prototype",
    accent: "#176e9d",
    summary:
      "Draw a circle and see how round, closed and smooth it is, with a 0–100 score and fitted geometry.",
    proof:
      "Least-squares circle fitting, pointer input and local attempt history, with tests for ideal, open and degenerate strokes.",
    contribution:
      "I designed and built the experience end to end.",
    evidence: [
      "Canvas geometry and pointer interaction",
      "Immediate visual scoring feedback",
      "Tested scoring · public source",
    ],
    images: [],
    links: [
      { label: "View source", href: "https://github.com/Giampiga/circle-accuracy-game" },
    ],
    station: { x: 73, y: 34 },
  },
  {
    id: "revature-architectures",
    number: "06",
    group: "Supporting work",
    title: "Revature — One API, Two Architectures",
    shortTitle: "Revature Architectures",
    role: "Java backend trainee",
    ledgerRole: "Java Backend Trainee",
    date: "Jan–Mar 2025",
    status: "Cohort proof of concept",
    accent: "#c94235",
    summary:
      "One backend brief implemented twice: first with Javalin and JDBC, then with Spring and JPA, making the architectural tradeoffs concrete.",
    proof:
      "The work was completed against provided cohort specifications and tests in private training repositories.",
    contribution:
      "I implemented both versions during Revature training. Revature is currently presenting me for client opportunities.",
    evidence: [
      "Javalin + JDBC implementation",
      "Spring + JPA re-architecture",
      "Private training code; no protected materials published",
    ],
    images: [],
    links: [],
    station: { x: 76, y: 62, labelOffsetX: -4.8, pinAnchorX: "83%" },
  },
  {
    id: "algorithms-lab",
    number: "07",
    group: "Supporting work",
    title: "Algorithms & Data Structures Lab",
    shortTitle: "Algorithms Lab",
    role: "Individual coursework · clean-room case study",
    ledgerRole: "Individual / Coursework",
    date: "2019–2020",
    status: "Private archive · clean-room revisit",
    accent: "#8b4bb5",
    summary:
      "C and Java implementations of hashing, trees, recursion, dynamic programming and constraint detection, with preserved coursework results.",
    proof:
      "Verified results include Hashtastic 40/40, Kindred Spirits 17/17, Domichar 21/21, GenericBST 10/10, Run Like Hell 20/20 and both Sneaky assignments at 21/21.",
    contribution:
      "The SkipList earned 17/24 with both bonuses, but the original implementation is not preserved. Any public version will be a clearly labeled clean-room revisit.",
    evidence: [
      "Seven verified coursework outcomes",
      "SkipList: partial result, 17/24 tests",
      "No private UCF assignment source published",
    ],
    images: [],
    links: [],
    station: { x: 87, y: 58, labelOffsetX: 1.7, pinAnchorX: "35%" },
  },
];

export const archiveProjects = [
  {
    id: "gummy",
    title: "Gummy",
    role: "Frontend build",
    date: "2024–2025",
    status: "Disbanded before mint integration",
    description: "A custom NFT collection and minting-site frontend built with React and Vite, including collection artwork, typography and carousel interactions. I completed the frontend before the team disbanded; backend, wallet and minting-service integration never began.",
    stack: ["React", "Vite", "Tailwind CSS"],
    links: [{ label: "Open archived build", href: "https://gummy-final.vercel.app/" }],
  },
  {
    id: "groov",
    title: "Groov",
    role: "Web frontend contributor",
    date: "2021",
    status: "Team archive",
    description: "A UCF team-built music social app where people record over beats, share posts and connect through profiles and comments.",
    contribution: "I built the initial profile layout and login page, added profile-image selection with local preview, and refined registration and login forms with password visibility controls, clearer navigation and layout fixes.",
    proof: "25 attributed commits · 7 merged pull requests. My work was on the web frontend, not the audio-recording or backend systems.",
    stack: ["JavaScript", "React", "Material UI", "React Router", "Axios", "Firebase"],
    links: [
      { label: "View source", href: "https://github.com/GroovTeam/groov-web" },
      { label: "Profile-image contribution", href: "https://github.com/GroovTeam/groov-web/pull/30" },
      { label: "Login & registration work", href: "https://github.com/GroovTeam/groov-web/pull/44" },
    ],
  },
  {
    id: "polybay",
    title: "Polybay",
    role: "Team contributor",
    date: "2021–2022",
    status: "Capstone archive",
    description: "A UCF capstone team project exploring a wallet-connected NFT marketplace. I initialized the codebase, authored its first ERC-721 URI-storage contract, and contributed later constructor and integration changes. The wider minting, listing and marketplace flows were a team effort.",
    stack: ["Next.js", "Solidity", "Hardhat", "Ethers.js", "IPFS"],
    links: [{ label: "View source", href: "https://github.com/ucf-nft-marketplace/polybay" }],
  },
  {
    id: "quick-baccarat",
    title: "Quick Baccarat",
    role: "Solo Python microbuild",
    date: "2023",
    status: "Archived",
    description: "A Python Discord bot for simulated baccarat, with daily virtual credits, bets, balances and hand payouts. I built the one-file prototype and 24-hour daily-claim checks; balances live in memory and reset when the bot restarts.",
    stack: ["Python", "Discord API"],
    links: [{ label: "View source", href: "https://github.com/Giampiga/quick-baccarat" }],
  },
  {
    id: "ucf-contact-manager",
    title: "UCF LAMP Contact Manager",
    role: "Team contributor",
    date: "2021",
    status: "Course archive",
    description: "A team-built contact manager for UCF’s COP 4331 course, using a LAMP stack. My two verified commits implemented and revised the registration and contact-deletion PHP endpoints.",
    stack: ["PHP", "MySQL", "Apache", "Linux"],
    links: [{ label: "View source", href: "https://github.com/LLemmers1030/G19-COP4331" }],
  },
];

export const repositoryCabinet = [
  { title: "JustCubes", type: "Early experiment", note: "Kept for provenance; claims remain intentionally modest." },
  { title: "Wave at Me", type: "Tutorial archive", note: "An obsolete Rinkeby-era web3 learning build." },
  { title: "Pomodular", type: "Early product experiment", note: "A small productivity interface from the learning archive." },
  { title: "Weather", type: "Practice build", note: "API and interface practice, not presented as product work." },
  { title: "Vite deployment test", type: "Infrastructure test", note: "A deployment check with no portfolio claim attached." },
  { title: "Image Search", type: "Tutorial archive", note: "Frontend/API practice." },
  { title: "HTML form practice", type: "Learning exercise", note: "Foundational web exercise." },
  { title: "Revature curriculum labs", type: "Private training collection", note: "112 small training repositories represented once through the Revature architecture case study." },
];

export const experience = [
  { organization: "Revature", title: "Java Backend Cohort + client placement", date: "Jan–Mar 2025 training", note: "Currently being presented for client opportunities." },
  { organization: "Georgia Tech", title: "M.S. Computer Science", date: "2024–present", note: "Expected 2028–2029; enrollment timing may change." },
  { organization: "ScribeAmerica", title: "Remote Medical Scribe", date: "Sep 2024–Sep 2025", note: "High-volume, accuracy-sensitive documentation workflow." },
  { organization: "Outlier AI", title: "Generalist + STEM tasker", date: "Aug–Dec 2024", note: "AI model evaluation work; task and review counts are not claimed." },
  { organization: "UCF", title: "B.S. Computer Science · Mathematics minor", date: "2019–2022", note: "Earlier education intentionally omitted." },
];

export const projectById = Object.fromEntries(primaryProjects.map((project) => [project.id, project]));

export const games = [
  ...multiplayerGames,
  {
    ...projectById["circle-accuracy"],
    description: "How close can you get to a perfect circle? Draw with a mouse, touch or pen, then get a 0–100 score based on roundness, closure and smoothness.",
    detail: "Resampled strokes and least-squares circle fitting turn each attempt into geometric feedback. Best and recent attempts are saved locally in the browser.",
    stack: ["Next.js", "React", "TypeScript", "Canvas", "Pointer Events", "Vitest"],
    access: "Prototype · public source.",
  },
];

export const profileLinks = {
  github,
  linkedin: "https://linkedin.com/in/giampiga",
  email: "mailto:giampiga.cs@gmail.com",
};
