import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  CaretDown,
  CaretLeft,
  CaretRight,
  MagnifyingGlass,
  X,
} from "@phosphor-icons/react";
import {
  archiveProjects,
  primaryProjects,
  profileLinks,
  projectById,
  repositoryCabinet,
} from "./projects.js";
import { RecruiterPortfolio, resumeUrl, ProjectCarousel, ProjectLinks as LinkRow } from "./RecruiterPortfolio.jsx";
import { projectStories } from "./project-stories.js";
import { resolveInitialView } from "./portfolio-view.js";
import { useStudioPlayer } from "./useStudioPlayer.js";
import { useWanderingDog } from "./useWanderingDog.js";
import { canPlayerWalk, routePlayerTo, stationApproaches } from "./studio-navigation.js";
import { personFrames, PERSON_WIDTH } from "./sprite-frames.js";
import { PlayerArtwork } from "./PlayerArtwork.jsx";
import { DogArtwork } from "./DogArtwork.jsx";
import { PLAYER_SPEED } from "./studio-motion.js";

const directions = {
  down: 0,
  left: 3,
  right: 6,
  up: 9,
};

const projectHref = (project) => `#project=${project.id}`;

function useReducedMotionPreference() {
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);

  useEffect(() => {
    const mediaQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mediaQuery) return undefined;
    const updatePreference = () => setReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener?.("change", updatePreference);
    return () => mediaQuery.removeEventListener?.("change", updatePreference);
  }, []);

  return reducedMotion;
}

function getInitialView() {
  return resolveInitialView({
    reducedMotion: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    explicitView: new URLSearchParams(window.location.search).get("view"),
  });
}

function Header({ view, onViewChange, theme, onThemeChange }) {
  return (
    <header className="masthead">
      <a className="wordmark" href="#top" aria-label="Giampiero Giovingo, home">
        Giampiero Giovingo
      </a>
      <div className="masthead__position">
        <strong>Product Engineer</strong>
        <span>I build playful interfaces and serious systems across realtime, AI-assisted workflows and commerce.</span>
      </div>
      <nav className="masthead__nav" aria-label="Primary navigation">
        <div className="view-switch" aria-label="Portfolio view">
          <button aria-pressed={view === "index"} className={view === "index" ? "is-active" : ""} type="button" onClick={() => onViewChange("index")}>Index</button>
          <span aria-hidden="true">/</span>
          <button aria-pressed={view === "studio"} className={view === "studio" ? "is-active" : ""} type="button" onClick={() => onViewChange("studio")}>Studio</button>
        </div>
        {view === "index" && <a className="index-nav-link" href="#work">Work</a>}
        {view === "index" && <a className="index-nav-link" href="#about">About</a>}
        <a href={resumeUrl} target="_blank" rel="noreferrer">Résumé ↗</a>
        <a href={profileLinks.email}>Contact</a>
        <button type="button" onClick={onThemeChange} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>{theme === "dark" ? "Light" : "Dark"}</button>
      </nav>
    </header>
  );
}

function ProjectInspector({ project, onOpenCaseStudy }) {
  const hero = project.images[0];

  return (
    <aside className="project-inspector" style={{ "--project-accent": project.accent }} aria-label="Selected project preview">
      <div className="inspector-heading">
        <p className="eyebrow">Selected work · {project.number} / {String(primaryProjects.length).padStart(2, "0")}</p>
        <h2 aria-live="polite" aria-atomic="true">{project.shortTitle}</h2>
        <p className="inspector-status">{project.date}<span>{project.status}</span></p>
      </div>
      <div className="inspector-actions">
        <button type="button" onClick={onOpenCaseStudy}>
          Open full case study
          <ArrowUpRight size={18} weight="bold" aria-hidden="true" />
        </button>
      </div>
      {project.carousel ? <ProjectCarousel key={project.id} project={project} onOpen={onOpenCaseStudy} /> : hero ? (
        <div className="inspector-artifacts">
          <figure className="inspector-hero">
            <img src={hero.src} alt={hero.alt} />
            <figcaption>{hero.caption ?? `${hero.label} · real product artifact`}</figcaption>
          </figure>
        </div>
      ) : (
        <div className="evidence-slate" aria-label="Verified project evidence">
          <span>Inside the case study</span>
          <ul>{project.evidence.slice(0, 2).map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      )}
      <p className="inspector-summary">{project.summary}</p>
      <p className="inspector-role"><span>Role</span>{project.role}</p>
      <LinkRow links={project.links} />
    </aside>
  );
}

function ProjectDialog({ project, open, onClose }) {
  const ref = useRef(null);
  const story = projectStories[project.id];

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (open && !node.open) { node.showModal(); node.scrollTop = 0; }
    if (!open && node.open) node.close();
  }, [open]);

  return (
    <dialog className="case-dialog" ref={ref} onClose={onClose} onCancel={onClose} aria-labelledby="case-title">
      <div className="case-reader__bar"><span>Selected work / {project.number}</span><button className="close-control" type="button" onClick={onClose} aria-label="Close case study"><X size={18} aria-hidden="true" /> Close</button></div>
      <article className="case-reader">
        <p className="eyebrow">{project.group}</p>
        <h2 id="case-title">{project.title}</h2>
        <dl className="case-reader__meta"><div><dt>My role</dt><dd>{project.role}</dd></div><div><dt>When</dt><dd>{project.date}</dd></div><div><dt>Status</dt><dd>{project.status}</dd></div></dl>
        <p className="work-stack">{story.stack.join(" / ")}</p>
        <p className="case-reader__lead">{story.challenge}</p>
        {project.links.length > 0 && <LinkRow links={project.links} />}
        {project.carousel ? <ProjectCarousel key={project.id} project={project} details /> : project.images[0] && <figure className="case-reader__main-artifact"><img src={project.images[0].src} alt={project.images[0].alt} /><figcaption>{project.images[0].caption ?? `${project.images[0].label} · captured from the actual product`}</figcaption></figure>}
        <section className="case-reader__section"><h3>My contribution</h3><div><p>{project.contribution}</p><ul>{story.approach.map((item) => <li key={item}>{item}</li>)}</ul></div></section>
        <section className="case-reader__section"><h3>Engineering decisions</h3><div>{story.decisions.map((decision) => <div className="case-decision" key={decision.title}><h4>{decision.title}</h4><p>{decision.detail}</p></div>)}</div></section>
        <section className="case-reader__section"><h3>Evidence & results</h3><p>{story.proof}</p></section>
        <section className="case-reader__scope"><h3>Scope & current status</h3><p>{story.boundary}</p></section>
        {!project.carousel && project.images.length > 1 && <div className="case-reader__gallery">{project.images.slice(1).map((image) => <figure key={image.src}><img src={image.src} alt={image.alt} loading="lazy" /><figcaption>{image.caption ?? `${image.label} · actual product screenshot`}</figcaption></figure>)}</div>}
        <footer className="case-reader__footer"><a href={profileLinks.email}>Ask me about this project ↗</a><button type="button" onClick={onClose}>Back to portfolio</button></footer>
      </article>
    </dialog>
  );
}

export function Sprite({ kind, position, direction, frame, walking, gaitStep = 0, distance = 0, speed = 0, traveling = false, duration = 120, activity, idleDuration, idleDelay, name, onPet, className = "" }) {
  const row = kind === "person" ? 0 : kind === "pomsky-white" ? 1 : 2;
  const column = directions[direction] + (walking ? frame : 1);
  const isDog = kind.startsWith("pomsky-");
  const dogSideView = isDog && (direction === "left" || direction === "right");
  const idleDog = isDog && !walking && (!activity || activity === "idle");
  const activityClass = isDog && activity ? `is-${activity}` : "";
  const gaitClass = isDog ? `gait-frame-${walking ? frame : 1}` : "";
  const personCrop = kind === "person" ? personFrames[column] : null;
  const sideView = kind === "person" && (direction === "left" || direction === "right");
  const northView = kind === "person" && direction === "up";
  const Element = onPet ? "button" : "span";
  return (
    <Element
      className={`game-sprite game-sprite--${kind} ${sideView ? "is-side-view" : ""} ${northView ? "is-north-view" : ""} ${dogSideView ? "is-dog-side-view" : ""} ${walking ? "is-walking" : ""} ${idleDog ? "is-idle" : ""} ${activityClass} ${gaitClass} ${traveling ? "is-traveling" : ""} ${className}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        "--person-width": kind === "person" ? `${PERSON_WIDTH}%` : undefined,
        "--sprite-x": `${personCrop ? personCrop.x / 1408 * 100 : column / 11 * 100}%`,
        "--sprite-y": `${personCrop ? personCrop.y / 736 * 100 : row / 2 * 100}%`,
        "--travel-duration": `${duration}ms`,
        "--dog-idle-duration": idleDuration ? `${idleDuration}ms` : undefined,
        "--dog-idle-delay": idleDelay ? `${idleDelay}ms` : undefined,
      }}
      aria-hidden={onPet ? undefined : true}
      aria-label={onPet ? `Pet ${name}` : undefined}
      type={onPet ? "button" : undefined}
      onClick={onPet}
    >
      {(sideView || northView) && <PlayerArtwork direction={direction} distance={distance} walking={walking} stride={speed / PLAYER_SPEED} />}
      {dogSideView && <DogArtwork kind={kind} direction={direction} gaitStep={gaitStep} walking={walking} />}
      {onPet && <span className="dog-greeting" aria-hidden="true">{name}{activity === "greeting" && <span> ♥</span>}</span>}
    </Element>
  );
}

function StudioView({ project, onSelect, onInspect, onShowIndex }) {
  const mapRef = useRef(null);
  const reducedMotion = useReducedMotionPreference();
  const [compact, setCompact] = useState(() => window.matchMedia("(max-width: 860px)").matches);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 860px)");
    const update = () => setCompact(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  const player = useStudioPlayer({ mapRef, canWalk: canPlayerWalk, routeTo: routePlayerTo, reducedMotion, enabled: !compact });
  const { position } = player;
  const whitePomsky = useWanderingDog("left", mapRef, reducedMotion);
  const blackPomsky = useWanderingDog("right", mapRef, reducedMotion);

  const nearestProject = useMemo(() => {
    return primaryProjects.reduce((best, candidate) => {
      const approach = stationApproaches[candidate.id];
      const distance = Math.hypot(position.x - approach.x, position.y - approach.y);
      return !best || distance < best.distance ? { project: candidate, distance } : best;
    }, null);
  }, [position]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (compact) return;
      if (document.querySelector("dialog[open]") || ["INPUT", "TEXTAREA", "BUTTON", "A"].includes(document.activeElement?.tagName)) return;
      if (!mapRef.current?.getBoundingClientRect().width) return;
      if (event.key === "Enter" && nearestProject?.distance < 9) {
        event.preventDefault();
        onSelect(nearestProject.project);
        onInspect(nearestProject.project);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [compact, nearestProject, onInspect, onSelect]);

  const walkToStation = (nextProject) => {
    if (compact) { onSelect(nextProject); return; }
    if (nearestProject?.project.id === nextProject.id && nearestProject.distance < 5) {
      onInspect(nextProject);
      return;
    }
    player.walkTo(stationApproaches[nextProject.id]);
    onSelect(nextProject);
  };

  const walkToFloor = (event) => {
    if (compact || event.target.closest("button, a")) return;
    const bounds = mapRef.current.getBoundingClientRect();
    const destination = { x: (event.clientX - bounds.left) / bounds.width * 100, y: (event.clientY - bounds.top) / bounds.height * 100 };
    if (canPlayerWalk(destination)) player.walkTo(destination);
  };

  return (
    <section className="studio-view" aria-label="Walkable portfolio studio">
      <div className="studio-map-wrap">
        <div className="studio-map-heading"><h1>The working studio</h1><span>{compact ? "Tap a numbered station" : "Living room / Workshop"}</span></div>
        <div className="studio-map" ref={mapRef} tabIndex={compact ? undefined : 0} onClick={walkToFloor} aria-label={compact ? "Tap a numbered station to preview a project" : "Click the floor or use W A S D or arrow keys to walk between project stations"}>
          <img className="studio-room" src="/assets/portfolio-studio-loft.png" alt="Open-plan pixel-art studio: a living-room lounge, project desks along the walls, and a wide passage into the workshop" draggable="false" />

          {primaryProjects.map((candidate) => candidate.station.screen && candidate.images[0] ? (
            <img
              key={`${candidate.id}-screen`}
              className="station-screen"
              src={candidate.images[0].src}
              alt=""
              style={{
                left: `${candidate.station.screen.x}%`,
                top: `${candidate.station.screen.y}%`,
                width: `${candidate.station.screen.w}%`,
                height: `${candidate.station.screen.h}%`,
                transform: `rotate(${candidate.station.screen.rotate}deg)`,
              }}
            />
          ) : null)}

          {primaryProjects.map((candidate) => {
            const selected = candidate.id === project.id;
            const nearby = !compact && nearestProject?.project.id === candidate.id && nearestProject.distance < 9;
            return (
              <button
                key={candidate.id}
                className={`station-pin${selected ? " is-selected" : ""}${nearby ? " is-nearby" : ""}`}
                style={{
                  left: `${candidate.station.x + (candidate.station.labelOffsetX ?? 0)}%`,
                  top: `${candidate.station.y}%`,
                  "--pin-accent": candidate.accent,
                  "--pin-anchor-x": candidate.station.pinAnchorX ?? "50%",
                }}
                type="button"
                onClick={() => walkToStation(candidate)}
                aria-current={selected ? "true" : undefined}
                aria-label={`${compact ? "Preview" : nearby && nearestProject.distance < 5 ? "Inspect" : "Walk to"} ${candidate.title}`}
              >
                <span>{candidate.number}</span>
                <strong className={candidate.station.x > 80 ? "station-label--left" : candidate.station.x < 25 ? "station-label--right" : ""}>{candidate.shortTitle}</strong>
              </button>
            );
          })}

          <a className="station-pin station-pin--archive" href="?view=index#archive" style={{ left: compact ? "65%" : "68.5%", top: "88%" }} aria-label="Open the project archive in Index"><span><ArrowUpRight size={14} aria-hidden="true" /></span><strong>Archive</strong></a>

          <Sprite kind="pomsky-white" {...whitePomsky} position={compact ? { x: 34, y: 40 } : whitePomsky.position} name="Jojo" onPet={whitePomsky.pet} />
          <Sprite kind="pomsky-black" {...blackPomsky} position={compact ? { x: 45, y: 58 } : blackPomsky.position} name="Maui" onPet={blackPomsky.pet} />
          <Sprite kind="person" {...player} />
          {player.route.length > 0 && <span className="floor-destination" aria-hidden="true" style={{ left: `${player.route.at(-1).x}%`, top: `${player.route.at(-1).y}%` }} />}
        </div>
        <span className="sr-only" role="status">{whitePomsky.isGreeting ? "Jojo says hello. " : ""}{blackPomsky.isGreeting ? "Maui says hello." : ""}</span>
        <div className="room-prompt" aria-live="polite">
          {compact ? <>Station {project.number} · {project.shortTitle}</> : nearestProject?.distance < 9 ? <><kbd>Enter</kbd> inspect {nearestProject.project.shortTitle}</> : <>Click the floor to walk · Choose a station · Say hello to a Pomsky</>}
        </div>
      </div>

      <ProjectInspector project={project} onOpenCaseStudy={onInspect} />

      <div className="studio-controls">
        <p><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd><span>/</span><kbd>↑</kbd><kbd>↓</kbd><kbd>←</kbd><kbd>→</kbd> to walk</p>
        <p><kbd>Enter</kbd> to inspect</p>
        <button type="button" onClick={onShowIndex}>Skip to Index <ArrowRight size={18} weight="bold" aria-hidden="true" /></button>
        <span>{primaryProjects.length} case studies · {archiveProjects.length} selected archive projects</span>
      </div>
    </section>
  );
}

function ArchiveSection() {
  const [openId, setOpenId] = useState(null);
  return (
    <section className="archive-section">
      <h3>Selected archive</h3>
      <div className="archive-table">
        {archiveProjects.map((item) => (
          <div className={`archive-entry${openId === item.id ? " is-open" : ""}`} key={item.id}>
            <button type="button" onClick={() => setOpenId((current) => current === item.id ? null : item.id)} aria-expanded={openId === item.id}>
              <strong>{item.title}</strong>
              <span>{item.role}</span>
              <span>{item.date}</span>
              <span>{item.status}</span>
              <CaretDown size={16} weight="bold" aria-hidden="true" />
            </button>
            {openId === item.id && (
              <div className="archive-entry__detail">
                <p>{item.description}</p>
                {item.contribution && <p><strong>My contribution.</strong> {item.contribution}</p>}
                {item.proof && <p className="archive-entry__proof">{item.proof}</p>}
                {item.stack && <p className="archive-entry__stack">{item.stack.join(" / ")}</p>}
                <LinkRow links={item.links} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function RepositoryCabinet() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const filtered = repositoryCabinet.filter((item) => `${item.title} ${item.type} ${item.note}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <section className={`repository-cabinet${open ? " is-open" : ""}`}>
      <button className="cabinet-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <span><Briefcase size={18} aria-hidden="true" /> Repository cabinet</span>
        <small>{repositoryCabinet.length} more repositories · learning & experiments</small>
        <CaretDown size={17} weight="bold" aria-hidden="true" />
      </button>
      {open && (
        <div className="cabinet-body">
          <label className="cabinet-search">
            <MagnifyingGlass size={17} aria-hidden="true" />
            <span className="sr-only">Search repository cabinet</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search early work" />
          </label>
          <div className="cabinet-grid">
            {filtered.map((item) => (
              <article key={item.title}>
                <p>{item.type}</p>
                <h4>{item.title}</h4>
                <span>{item.note}</span>
              </article>
            ))}
          </div>
          {filtered.length === 0 && <p role="status">No repositories match “{query}”. Try another name or topic.</p>}
          <a className="github-cabinet-link" href={profileLinks.github} target="_blank" rel="noreferrer">See the complete GitHub profile <ArrowUpRight size={16} weight="bold" /></a>
        </div>
      )}
    </section>
  );
}

export function App() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || "light");
  useEffect(() => { document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#1b1c1a" : "#f6f3eb"); }, [theme]);
  const changeTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("portfolio-theme", next); } catch { /* Theme works without storage. */ }
  };
  const [view, setView] = useState(getInitialView);
  useEffect(() => { document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ behavior: "instant" }); }, []);
  const initialProject = useMemo(() => {
    const match = window.location.hash.match(/project=([^&]+)/);
    return projectById[match?.[1]] ?? primaryProjects[0];
  }, []);
  const [selectedId, setSelectedId] = useState(initialProject.id);
  const [caseOpen, setCaseOpen] = useState(() => /project=/.test(window.location.hash) && Boolean(projectById[window.location.hash.match(/project=([^&]+)/)?.[1]]));
  const project = projectById[selectedId] ?? primaryProjects[0];

  const changeView = (nextView) => {
    setView(nextView);
    const url = new URL(window.location.href);
    url.searchParams.set("view", nextView);
    window.history.replaceState(null, "", url);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const selectProject = (nextProject) => {
    setSelectedId(nextProject.id);
    window.history.replaceState(null, "", projectHref(nextProject));
  };

  const openProject = (nextProject) => {
    setSelectedId(nextProject.id);
    window.history.pushState({ portfolioCase: true }, "", projectHref(nextProject));
    setCaseOpen(true);
  };

  const closeProject = () => {
    setCaseOpen(false);
    if (/project=/.test(window.location.hash)) window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${view === "index" ? "#work" : "#top"}`);
  };

  useEffect(() => {
    const onHashChange = () => {
      const match = window.location.hash.match(/project=([^&]+)/);
      if (projectById[match?.[1]]) { setSelectedId(match[1]); setCaseOpen(true); }
      else setCaseOpen(false);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    document.title = caseOpen ? `${project.shortTitle} — Giampiero Giovingo` : "Giampiero Giovingo — Software Engineer";
  }, [caseOpen, project.shortTitle]);

  return (
    <div className={`site-shell view-${view}`} id="top">
      <a className="skip-link" href={view === "index" ? "#main-content" : "#studio-content"}>Skip to content</a>
      <Header view={view} onViewChange={changeView} theme={theme} onThemeChange={changeTheme} />
      {view === "studio" && <p className="studio-status">Studio · Work in progress <span>An optional way to explore. Every project is also in Index.</span></p>}
      {view === "studio" ? (
        <main id="studio-content" tabIndex={-1}><StudioView
          project={project}
          onSelect={selectProject}
          onInspect={(candidate) => openProject(candidate?.id ? candidate : project)}
          onShowIndex={() => changeView("index")}
        /></main>
      ) : (
        <RecruiterPortfolio selectedId={selectedId} onOpen={openProject} onStudio={() => changeView("studio")} archive={<ArchiveSection />} cabinet={<RepositoryCabinet />} />
      )}
      <ProjectDialog project={project} open={caseOpen} onClose={closeProject} />
      <div className="mobile-project-nav" aria-label="Project navigation">
        <button type="button" onClick={() => selectProject(primaryProjects[(primaryProjects.indexOf(project) - 1 + primaryProjects.length) % primaryProjects.length])}><CaretLeft size={18} /> Previous</button>
        <span>{project.number} / {String(primaryProjects.length).padStart(2, "0")}</span>
        <button type="button" onClick={() => selectProject(primaryProjects[(primaryProjects.indexOf(project) + 1) % primaryProjects.length])}>Next <CaretRight size={18} /></button>
      </div>
    </div>
  );
}
