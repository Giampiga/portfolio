const github = "https://github.com/Giampiga";

export const primaryProjects = [
  {
    id: "restaurant-menu-pos",
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
      "Exploring how independent food trucks can run faster and sell more through a reusable menu-to-operations system, tested through the distinct Ghost and Koë brands.",
    proof:
      "Responsive menus, modifiers, carts and checkout concepts, staged operator and POS workflows, and a reusable food-truck website skill that codifies the repeated build decisions. Ghost and Koë are prospective design partners—not paid clients or live POS deployments.",
    contribution:
      "I formed the effort, own the product direction, designed both brand experiences and built the frontend prototypes.",
    evidence: [
      "Two distinct restaurant brands on one reusable commerce foundation",
      "Responsive storefront and ordering flows",
      "A reusable Codex skill for food-truck site delivery",
    ],
    images: [
      { src: "/assets/projects/ghost-desktop.png", alt: "Ghost food-truck menu prototype on desktop", label: "Ghost storefront" },
      { src: "/assets/projects/koe-desktop.png", alt: "Koë restaurant ordering prototype on desktop", label: "Koë storefront" },
      { src: "/assets/projects/ghost-ipad.png", alt: "Ghost food-truck menu prototype on tablet", label: "Responsive menu" },
    ],
    links: [],
    station: { x: 19, y: 46, screen: { x: 10.2, y: 41.1, w: 13.8, h: 8.7, rotate: 0 } },
  },
  {
    id: "realtime-multiplayer-lab",
    number: "02",
    group: "Featured case study",
    title: "Realtime Multiplayer Lab",
    shortTitle: "Realtime Multiplayer Lab",
    role: "Product direction · AI-assisted engineering",
    ledgerRole: "Product Direction / AI-Assisted Eng.",
    date: "Aug 2026",
    status: "Controlled alpha + live prototype",
    accent: "#6256df",
    summary:
      "Two fast, no-fuss multiplayer experiments: a sandboxed coding race and a live puzzle arcade built around shared rooms, rematches and immediate feedback.",
    proof:
      "Binaryrush includes server-authoritative rooms, hidden-test judging and reconnect behavior. Stack Rush explores the same competitive loop through compact visual puzzles.",
    contribution:
      "I directed both products and used AI-assisted engineering to move from interaction design to tested multiplayer prototypes.",
    evidence: [
      "Realtime rooms, reconnects and rematches",
      "Server-authoritative competition state",
      "Two-client interaction and failure-state QA",
    ],
    images: [
      { src: "/assets/projects/binaryrush-home.png", alt: "Binaryrush coding race home screen", label: "Binaryrush" },
      { src: "/assets/projects/stack-rush-lounge.png", alt: "Stack Rush multiplayer puzzle lounge", label: "Stack Rush" },
    ],
    links: [
      { label: "Play Binaryrush", href: "https://binaryrush.gga.chatgpt.site/" },
      { label: "Play puzzle prototype (Peg Rush)", href: "https://peg-rush-hanoi.gga.chatgpt.site/" },
      { label: "Stack Rush source", href: "https://github.com/Giampiga/stack-rush" },
    ],
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
      "The v0 frontend PR covers intake, condition, mock market search, comparables, reports and saved records across 23 changed files. The PR remains open, not merged.",
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
      "A modular Python and Streamlit prototype, twelve commits, an eight-task frozen analysis and a 120-hour research/build report.",
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
      "A geometry-driven practice game focused on one legible interaction: estimate, draw and learn from the difference between intent and accuracy.",
    proof:
      "A public canvas-based implementation with its earliest remembered product work around December 2025 and visible repository activity in March 2026.",
    contribution:
      "I designed and built the experience end to end.",
    evidence: [
      "Canvas geometry and pointer interaction",
      "Immediate visual scoring feedback",
      "Public source with honest date framing",
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
      "I implemented both versions during Revature training. Revature is currently presenting me for client opportunities; this is not framed as an active client engineering role.",
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
      "A candid foundations case study: strong verified results across trees, recursion and complexity, plus a SkipList attempt that did not fully land.",
    proof:
      "Verified results include Hashtastic 40/40, Kindred Spirits 17/17, Domichar 21/21, GenericBST 10/10, Run Like Hell 20/20 and both Sneaky assignments at 21/21.",
    contribution:
      "The SkipList earned 17/24 with both bonuses, but the original implementation is not preserved. Any public version will be a clearly labeled clean-room revisit.",
    evidence: [
      "Seven verified coursework outcomes",
      "SkipList limitation stated instead of polished away",
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

export const profileLinks = {
  github,
  linkedin: "https://linkedin.com/in/giampiga",
  email: "mailto:giampiga.cs@gmail.com",
};
