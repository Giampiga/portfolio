// Public case-study copy distilled from docs/PORTFOLIO_MASTER_BRIEF.md.
// Keep individual contributions separate from team architecture and modeled outcomes.
export const projectStories = {
  "restaurant-menu-pos": {
    stack: ["React", "TypeScript", "Vite", "Playwright"],
    challenge:
      "Built two branded food-truck storefronts with configurable menus, local carts and checkout-review flows, creating a reusable foundation for future operator tools.",
    approach: [
      "Designed and built distinct Ghost and Koë storefronts, with responsive menus, product modifiers and local carts.",
      "Prototyped checkout review, pickup and delivery handoffs, plus owner-facing POS setup and sync concepts.",
      "Converted the repeated product and build decisions into a reusable Codex skill for food-truck websites.",
    ],
    proof:
      "Working frontend flows include Ghost’s protein and topping rules, Koë’s pickup checkout concept, and verified mobile, tablet and desktop states.",
    boundary:
      "Frontend prototypes for prospective design partners. No paid client engagement, live payment, order submission or connected POS is claimed.",
    decisions: [
      {
        title: "Reuse the journey; preserve the brand",
        detail:
          "Both experiences share menu, modifier and cart patterns. Ghost’s dense, Spanish-first presentation and Koë’s spacious imagery remain distinct.",
      },
      {
        title: "Stage integration around real access",
        detail:
          "The reusable skill defines a progression from handoffs and imports to read-only sync, webhooks and write-back. Provider access and operational requirements come before payments or POS promises.",
      },
      {
        title: "Test the ordering details",
        detail:
          "Runtime testing and visual QA accompany responsive menu, modifier, cart and checkout-review prototypes across mobile, tablet and desktop.",
      },
    ],
  },
  "realtime-multiplayer-lab": {
    stack: ["React", "TypeScript", "Cloudflare", "D1", "Drizzle", "QuickJS WASM"],
    challenge:
      "Keep a shared competition coherent when players submit code, make puzzle moves, disconnect or request a rematch.",
    approach: [
      "Directed Binaryrush’s browser coding race and Stack Rush’s multiplayer puzzle arcade through AI-assisted engineering.",
      "Built Binaryrush with Codex and published it on GPT Sites, with a bounded JavaScript judge and hidden tests.",
      "Implemented shared rooms and competition state with server-authoritative judging, moves, timers and results.",
      "Developed reconnect and rematch flows, with multiplayer test evidence for Stack Rush.",
    ],
    proof:
      "Binaryrush has nine judged problems and explicit code-execution limits. Stack Rush has unit, rendered-HTML and multiplayer tests, including a reported 8/8 two-client suite.",
    boundary:
      "Binaryrush is a work in progress with unpublished source. Stack Rush remains a live prototype. Production-scale load and abuse resistance have not been validated.",
    decisions: [
      {
        title: "Let the server settle the race",
        detail:
          "Judging and standings in Binaryrush, and moves, timers and results in Stack Rush, are server-authoritative. The browser presents the competition state.",
      },
      {
        title: "Bound code execution",
        detail:
          "Binaryrush uses QuickJS WASM with a 1.5-second interrupt, 24 MB heap, 512 KB stack and a 12,000-character source cap, plus throttling.",
      },
      {
        title: "Keep answers private during competition",
        detail:
          "Binaryrush keeps judging tests on the server and opponent source hidden until completion. Its current judge supports JavaScript and a deliberately small problem set.",
      },
    ],
  },
  arkollab: {
    stack: ["React", "TypeScript", "Vite"],
    challenge:
      "Turn an ambiguous luxury-bag appraisal process into a sequence a user can follow and a valuation report they can inspect.",
    approach: [
      "Led the team to develop the luxury-bag appraisal product.",
      "Designed and implemented the v0 frontend flow across intake, photos, condition, mock market search, comparables and reports.",
      "Added saved-record screens and deployment/compliance wiring within the frontend demo contribution.",
      "Kept the individual frontend contribution distinct from the team’s authentication, backend and AI-assisted marketplace service.",
    ],
    proof:
      "The open v0 PR implements the appraisal journey from intake and photos to condition, mock comparables, reports and saved records. The screenshots show the current team app, not a claim that this unmerged PR powers it.",
    boundary:
      "Team project. The v0 frontend PR is open, not merged, and its market-search flow is mocked. The broader backend and AI architecture are team work.",
    decisions: [
      {
        title: "Make the appraisal a visible sequence",
        detail:
          "Intake, condition, comparable listings and the final report each have a dedicated stage, making the inputs behind a valuation inspectable.",
      },
      {
        title: "Distinguish sale evidence from asking prices",
        detail:
          "The team system separates realized sold prices from active listings. Those sources provide different evidence and should not read as equivalent market outcomes.",
      },
      {
        title: "Keep a fallback when synthesis fails",
        detail:
          "The team architecture retains deterministic market calculations if LLM synthesis fails. This reliability choice belongs to the broader team system, not the individual frontend contribution.",
      },
    ],
  },
  "cognitive-load-mvp": {
    stack: ["Python", "Streamlit"],
    challenge:
      "Make the tradeoff between giving a learner more help and giving them more material to process explicit and inspectable.",
    approach: [
      "Built modular task data, scaffold generation, scoring and interpretation layers for beginner algorithms problems.",
      "Compared hints, step-by-step support, full explanations and a rule-based adaptive policy.",
      "Evaluated the policies through a frozen eight-task analysis with explicit heuristic equations.",
    ],
    proof:
      "An eight-task report compares four assistance policies. Denser support reduced modeled reasoning effort while increasing modeled presentation load.",
    boundary:
      "Georgia Tech research prototype. Results are heuristic model predictions, not a human-subject study or evidence of improved student performance. Course source remains private.",
    decisions: [
      {
        title: "Keep the model interpretable",
        detail:
          "Explicit equations expose intrinsic load, extraneous load, total load and modeled reasoning effort so the basis of each comparison can be inspected.",
      },
      {
        title: "Compare policies on the same tasks",
        detail:
          "A frozen eight-task analysis holds the task set constant while changing the support policy, making differences between assistance modes easier to examine.",
      },
      {
        title: "Use an explicit adaptive rule",
        detail:
          "The adaptive mode applies a rule-based support policy and sits between the fixed modes in the analysis. Its behavior can be explained without claiming a validated learning intervention.",
      },
    ],
  },
  "circle-accuracy": {
    stack: ["Next.js", "React", "TypeScript", "Canvas", "Pointer Events", "Vitest"],
    challenge:
      "Turn a freehand circle into useful, immediate feedback across mouse, touch and pen input.",
    approach: [
      "Built pointer-driven drawing and resampled the captured stroke before fitting a least-squares circle.",
      "Combined weighted roundness, closure and smoothness into a 0–100 score with fitted geometry shown on the canvas.",
      "Stored recent and best attempts locally and tested both ideal shapes and problematic input.",
    ],
    proof:
      "Public source includes tests for ideal circles, ellipses, open shapes, normalization and degenerate strokes.",
    boundary:
      "Local-first prototype with public source, no backend, account system or leaderboard. Work began around December 2025; repository activity dates to March 2026.",
    decisions: [
      {
        title: "Normalize the stroke before scoring",
        detail:
          "Resampling and least-squares fitting turn raw pointer points into a geometric comparison rather than relying only on the appearance of the drawn path.",
      },
      {
        title: "Reward more than roundness",
        detail:
          "The weighted score includes closure and smoothness alongside roundness, with tests covering incomplete and degenerate strokes.",
      },
      {
        title: "Keep the feedback loop local",
        detail:
          "Canvas rendering and locally stored attempts keep drawing, scoring and practice inside the browser without an account or server round trip.",
      },
    ],
  },
  "revature-architectures": {
    stack: ["Java", "Javalin", "JDBC", "Spring Boot", "JPA", "H2", "JUnit"],
    challenge:
      "Implement the same social API with two backend architectures and understand where persistence and dependency-management responsibilities move.",
    approach: [
      "Built Account and Message operations with Javalin controllers, services, DAOs and prepared SQL.",
      "Reimplemented the contract using Spring REST controllers, injected services, JPA entities and repositories.",
      "Implemented validation and HTTP-status behavior against provided cohort specifications and integration-test suites.",
    ],
    proof:
      "The private training repositories preserve both implementations, with eight provided integration-test classes for the Javalin version and nine test classes for the Spring version.",
    boundary:
      "Training APIs built with provided specifications, tests and some scaffolding. Password handling is not production-secure, and token/session authentication is absent. Protected materials remain private.",
    decisions: [
      {
        title: "Make persistence explicit first",
        detail:
          "The Javalin version separates controller, service and DAO layers, with prepared SQL making database operations and their responsibilities visible.",
      },
      {
        title: "Move common persistence work into repositories",
        detail:
          "The Spring version uses JPA entities and repositories with dependency-injected services, providing a concrete comparison with the hand-written JDBC implementation.",
      },
      {
        title: "Use the API contract as the comparison",
        detail:
          "Registration, login, message operations and per-user feeds provide a common brief for examining how the two implementations handle validation and response behavior.",
      },
    ],
  },
  "algorithms-lab": {
    stack: ["C", "Java", "Hash tables", "Trees", "Dynamic programming"],
    challenge:
      "Implement core data structures and algorithms against concrete correctness constraints, then distinguish preserved evidence from incomplete historical work.",
    approach: [
      "Implemented hashing, probing, resizing and deletion in C, plus binary-tree recursion and traversal comparison.",
      "Built generic Java tree operations, dynamic-programming solutions and board-conflict detection exercises.",
      "Curated verified grading results while documenting the missing SkipList implementation and its partial result.",
    ],
    proof:
      "Verified results include Hashtastic 40/40, Kindred Spirits 17/17, Domichar 21/21, GenericBST 10/10, Run Like Hell 20/20 and both Sneaky assignments at 21/21.",
    boundary:
      "Individual coursework against provided specifications and tests. SkipList passed 17/24, including both bonuses, but its implementation is not preserved. Public explanations must be original; protected coursework stays private.",
    decisions: [
      {
        title: "Make collisions part of the implementation",
        detail:
          "Hashtastic includes a custom hash function, probing, collision tracking, resizing, search and deletion, with a verified 40/40 result.",
      },
      {
        title: "Use the structure the problem calls for",
        detail:
          "The archive spans binary-tree recursion, generic BST operations, dynamic programming and efficient board-conflict detection rather than repeating a single algorithm pattern.",
      },
      {
        title: "Preserve the limits of the evidence",
        detail:
          "SkipList’s grading report survives but the submitted implementation does not. Any new public visualizer is a clearly labeled clean-room revisit, not a recovered original.",
      },
    ],
  },
  "truco-venezolano": {
    stack: ["Next.js", "React", "TypeScript", "Supabase", "PostgreSQL"],
    challenge:
      "Translate Venezuelan Truco’s card hierarchy, bidding and team rules into a browser game that can explain a decision in practice and validate it in multiplayer.",
    approach: [
      "Developed server-authoritative 1v1/2v2 gameplay and public/private rooms with AI-assisted engineering.",
      "Built authenticated APIs and persistent data for Elo rankings, player profiles, friendships, chat and match history.",
      "Designed a responsive card interface with drag-and-drop, contextual game controls and dark mode.",
      "Built guided practice against rule-based Truquito, with three difficulty levels, explanations, pause and undo/redo.",
    ],
    proof:
      "The implementation includes game-rules tests. Vercel practice was played through a completed trick and captured on desktop and mobile; the screenshots show the real app.",
    boundary:
      "Work in progress · AI-assisted development. AI practice is available on Vercel; online multiplayer and social features are still being developed. Source remains private.",
    decisions: [
      {
        title: "Make the rules explicit",
        detail:
          "A shared rules engine powers local practice and the server-side room implementation. It validates turns and projects only each player’s private hand. Table presets expose the vira, Perico/Perica, bidding, Flor and parda rules; competitive play uses fixed rules and separate 1v1/2v2 Elo.",
      },
      {
        title: "Let practice explain the table",
        detail:
          "Truquito has three rule-based difficulty levels and cannot inspect the rival’s hand. Explanations, pause, undo/redo and locally saved practice let players explore decisions without affecting competitive rankings.",
      },
      {
        title: "Validate identity and concurrent moves",
        detail:
          "Next.js APIs verify Supabase identities and use parameterized PostgreSQL queries. Room revisions and command IDs guard concurrent or repeated moves; clients poll for updates. The current Vercel implementation is separate from the older GPT Sites/D1 build.",
      },
    ],
  },
};
