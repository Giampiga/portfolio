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
import { canPlayerWalk, isClearSegment, routePlayerTo, stationApproaches } from "./studio-navigation.js";
import { personFrames, PERSON_WIDTH, sideLegPose, northLegPose } from "./sprite-frames.js";
import { facingBetween, PLAYER_SPEED, roomDistance } from "./studio-motion.js";

const directions = {
  down: 0,
  left: 3,
  right: 6,
  up: 9,
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const projectHref = (project) => `#project=${project.id}`;

const dogNavigationGraphs = {
  left: {
    rugNorthWest: { x: 31.5, y: 30.5, links: ["rugNorth", "rugWest"] },
    rugNorth: { x: 40.5, y: 30.5, links: ["rugNorthWest", "rugNorthEast"] },
    rugNorthEast: { x: 52, y: 30.5, links: ["rugNorth", "rugEastUpper", "corridorNorth"] },
    rugEastUpper: { x: 52, y: 39, links: ["rugNorthEast", "rugEastLower"] },
    rugEastLower: { x: 52, y: 48.5, links: ["rugEastUpper", "rugSouth", "corridorSouth"] },
    rugSouth: { x: 40.5, y: 48.5, links: ["rugEastLower", "rugSouthWest"] },
    rugSouthWest: { x: 31.5, y: 48.5, links: ["rugSouth", "rugWest"] },
    rugWest: { x: 31.5, y: 39, links: ["rugSouthWest", "rugNorthWest"] },
    corridorNorth: { x: 56, y: 30.5, links: ["rugNorthEast", "corridorMiddle"] },
    corridorMiddle: { x: 56, y: 39, links: ["corridorNorth", "corridorSouth"] },
    corridorSouth: { x: 56, y: 48.5, links: ["corridorMiddle", "rugEastLower"] },
  },
  right: {
    hallLeft: { x: 68, y: 49, links: ["hallMiddle"] },
    hallMiddle: { x: 74, y: 49, links: ["hallLeft", "hallTurn"] },
    hallTurn: { x: 81.25, y: 49, links: ["hallMiddle", "aisleUpper"] },
    aisleUpper: { x: 81.25, y: 58, links: ["hallTurn", "aisleMiddle"] },
    aisleMiddle: { x: 81.25, y: 68, links: ["aisleUpper", "aisleLower"] },
    aisleLower: { x: 81.25, y: 76, links: ["aisleMiddle", "rugTurn"] },
    rugTurn: { x: 75.25, y: 76, links: ["aisleLower", "rugNorth"] },
    rugNorth: { x: 75.25, y: 82, links: ["rugTurn", "rugMiddle"] },
    rugMiddle: { x: 70, y: 82, links: ["rugNorth", "rugWest"] },
    rugWest: { x: 66, y: 82, links: ["rugMiddle", "rugExit"] },
    rugExit: { x: 66, y: 78, links: ["rugWest"] },
  },
};

const dogPersonalities = {
  left: {
    cadence: 132,
    travelMsPerUnit: 70,
    paceVariance: 0.12,
    pauseMin: 500,
    pauseMax: 1750,
    burstMin: 2,
    burstMax: 4,
    anticipationMin: 100,
    anticipationMax: 170,
    cornerMin: 80,
    cornerMax: 135,
    settleDuration: 140,
    observeChance: 0.34,
    reverseChance: 0.12,
    idleDuration: 2100,
    idleDelay: -320,
  },
  right: {
    cadence: 164,
    travelMsPerUnit: 90,
    paceVariance: 0.1,
    pauseMin: 1300,
    pauseMax: 3400,
    burstMin: 1,
    burstMax: 3,
    anticipationMin: 155,
    anticipationMax: 245,
    cornerMin: 120,
    cornerMax: 190,
    settleDuration: 190,
    observeChance: 0.62,
    reverseChance: 0.38,
    idleDuration: 2700,
    idleDelay: -940,
  },
};

// Both companions can use the doorway; personality no longer confines a dog
// to a disconnected room. Prefix the workshop's repeated waypoint names.
const dogHouseGraph = {
  ...dogNavigationGraphs.left,
  ...Object.fromEntries(Object.entries(dogNavigationGraphs.right).map(([name, node]) =>
    [`workshop-${name}`, { ...node, links: node.links.map((link) => `workshop-${link}`) }])),
  doorwayWest: { x: 56, y: 58.5, links: ["corridorSouth", "doorwayEast"] },
  doorwayEast: { x: 65, y: 58.5, links: ["doorwayWest", "workshopEntry"] },
  workshopEntry: { x: 65, y: 49, links: ["doorwayEast", "workshop-hallLeft"] },
};
dogHouseGraph.corridorSouth = { ...dogHouseGraph.corridorSouth, links: [...dogHouseGraph.corridorSouth.links, "doorwayWest"] };
dogHouseGraph["workshop-hallLeft"] = { ...dogHouseGraph["workshop-hallLeft"], links: ["workshop-hallMiddle", "workshopEntry"] };

function validateDogNavigationGraphs() {
  Object.entries({ house: dogHouseGraph }).forEach(([zone, graph]) => {
    Object.entries(graph).forEach(([nodeName, node]) => {
      node.links.forEach((linkedName) => {
        const linkedNode = graph[linkedName];
        if (!linkedNode) throw new Error(`Missing ${zone} dog waypoint: ${linkedName}`);
        if (!linkedNode.links.includes(nodeName)) throw new Error(`Dog route must be reciprocal: ${nodeName} → ${linkedName}`);
        if (node.x !== linkedNode.x && node.y !== linkedNode.y) throw new Error(`Dog route must be axis-aligned: ${nodeName} → ${linkedName}`);
      });
    });
    const reached = new Set();
    const pending = ["rugNorthWest"];
    while (pending.length) {
      const name = pending.pop();
      if (reached.has(name)) continue;
      reached.add(name);
      pending.push(...graph[name].links);
    }
    if (reached.size !== Object.keys(graph).length) throw new Error("A dog is confined to a disconnected room");
    for (const name of ["doorwayWest", "doorwayEast", "workshopEntry"]) {
      for (const link of graph[name].links) {
        if (!isClearSegment(graph[name], graph[link])) throw new Error(`Blocked dog doorway: ${name} → ${link}`);
      }
    }
  });
}

if (import.meta.env.DEV) validateDogNavigationGraphs();

const gaitFrames = [0, 1, 2, 1];
const randomBetween = (min, max) => min + Math.random() * (max - min);
const randomInteger = (min, max) => Math.floor(randomBetween(min, max + 1));

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

function useWanderingDog(zone, mapRef) {
  const graph = dogHouseGraph;
  const personality = dogPersonalities[zone];
  const reducedMotion = useReducedMotionPreference();
  const [roomVisible, setRoomVisible] = useState(() => !document.hidden && window.matchMedia("(min-width: 861px)").matches);
  const initialNodeRef = useRef(null);
  if (initialNodeRef.current === null) {
    initialNodeRef.current = zone === "left" ? "rugNorthWest" : "rugSouthWest";
  }
  const [position, setPosition] = useState(graph[initialNodeRef.current]);
  const [direction, setDirection] = useState(zone === "right" ? "left" : "right");
  const [gaitStep, setGaitStep] = useState(1);
  const [walking, setWalking] = useState(false);
  const [duration, setDuration] = useState(1200);
  const [activity, setActivity] = useState("idle");
  const currentNodeRef = useRef(initialNodeRef.current);
  const previousNodeRef = useRef(null);
  const [cadence, setCadence] = useState(personality.cadence);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 861px)");
    const update = () => setRoomVisible(!document.hidden && desktop.matches);
    document.addEventListener("visibilitychange", update);
    desktop.addEventListener("change", update);
    return () => {
      document.removeEventListener("visibilitychange", update);
      desktop.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      const authoredNodeName = zone === "left" ? "rugNorthWest" : "rugSouthWest";
      currentNodeRef.current = authoredNodeName;
      previousNodeRef.current = null;
      setPosition(graph[authoredNodeName]);
      setDirection(zone === "left" ? "right" : "left");
      setWalking(false);
      setGaitStep(1);
      setActivity("idle");
      return undefined;
    }
    if (!roomVisible) {
      // CSS travel completes at its destination while hidden; resume from that
      // same graph node rather than starting an invisible random-walk loop.
      setWalking(false);
      setGaitStep(1);
      setActivity("idle");
      return undefined;
    }

    let cancelled = false;
    const timers = new Set();

    const schedule = (callback, delay) => {
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        if (!cancelled) callback();
      }, delay);
      timers.add(timer);
    };

    const faceRandomExit = () => {
      const node = graph[currentNodeRef.current];
      const lookName = node.links[Math.floor(Math.random() * node.links.length)];
      setDirection(facingBetween(node, graph[lookName]));
    };

    const chooseNextNode = () => {
      const current = graph[currentNodeRef.current];
      const previousName = previousNodeRef.current;
      const alternatives = current.links.filter((name) => name !== previousName);
      const canReverse = previousName && current.links.includes(previousName);
      if (canReverse && (!alternatives.length || Math.random() < personality.reverseChance)) return previousName;
      const candidates = alternatives.length ? alternatives : current.links;
      return candidates[Math.floor(Math.random() * candidates.length)];
    };

    const restAtNode = () => {
      setWalking(false);
      setActivity(Math.random() < personality.observeChance ? "observing" : "idle");
      const pause = randomBetween(personality.pauseMin, personality.pauseMax);

      if (pause > 1000) {
        schedule(() => {
          faceRandomExit();
          setActivity("alert");
        }, pause * randomBetween(0.42, 0.64));
      }

      schedule(() => {
        beginLeg(randomInteger(personality.burstMin, personality.burstMax));
      }, pause);
    };

    const beginLeg = (legsRemaining) => {
      const currentName = currentNodeRef.current;
      const current = graph[currentName];
      const targetName = chooseNextNode();
      const target = graph[targetName];
      const nextDirection = facingBetween(current, target);
      const room = mapRef.current?.getBoundingClientRect();
      const distance = roomDistance(current, target, room?.width ? room.height / room.width : 0.78);
      const pace = personality.travelMsPerUnit * randomBetween(1 - personality.paceVariance, 1 + personality.paceVariance);
      const travelTime = clamp(distance * pace, 520, 2100);

      setDirection(nextDirection);
      setActivity("anticipating");
      schedule(() => {
        setDuration(travelTime);
        setCadence(personality.cadence * (travelTime / distance) / personality.travelMsPerUnit);
        setWalking(true);
        setActivity("walking");
        previousNodeRef.current = currentName;
        currentNodeRef.current = targetName;
        setPosition(target);

        schedule(() => {
          previousNodeRef.current = currentName;
          currentNodeRef.current = targetName;
          setWalking(false);
          setGaitStep(1);

          if (legsRemaining > 1) {
            setActivity("cornering");
            schedule(() => beginLeg(legsRemaining - 1), randomBetween(personality.cornerMin, personality.cornerMax));
          } else {
            setActivity("settling");
            schedule(restAtNode, personality.settleDuration);
          }
        }, travelTime);
      }, randomBetween(personality.anticipationMin, personality.anticipationMax));
    };

    restAtNode();
    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
    };
  }, [graph, mapRef, personality, reducedMotion, roomVisible, zone]);

  useEffect(() => {
    if (!walking) return undefined;
    const frameTimer = window.setInterval(() => setGaitStep((value) => (value + 1) % gaitFrames.length), cadence);
    return () => window.clearInterval(frameTimer);
  }, [cadence, walking]);

  return {
    position,
    direction,
    frame: gaitFrames[gaitStep],
    walking,
    traveling: walking,
    duration,
    activity,
    idleDuration: personality.idleDuration,
    idleDelay: personality.idleDelay,
  };
}

function getInitialView() {
  let savedView;
  try { savedView = window.localStorage.getItem("portfolio-view"); } catch { /* Optional device-local preference. */ }
  return resolveInitialView({
    reducedMotion: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    explicitView: new URLSearchParams(window.location.search).get("view"),
    savedView,
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
    <aside className="project-inspector" style={{ "--project-accent": project.accent }} aria-live="polite">
      <div className="inspector-heading">
        <p className="eyebrow">{project.number} / 07 · {project.group}</p>
        <h2>{project.title}</h2>
        <p className="project-meta">{project.role} · {project.date} · {project.status}</p>
      </div>

      <p className="inspector-summary">{project.summary}</p>

      {project.carousel ? <ProjectCarousel key={project.id} project={project} onOpen={onOpenCaseStudy} /> : hero ? (
        <div className="inspector-artifacts">
          <figure className="inspector-hero">
            <img src={hero.src} alt={hero.alt} />
            <figcaption>{hero.caption ?? `${hero.label} · real product artifact`}</figcaption>
          </figure>
        </div>
      ) : (
        <div className="evidence-slate" aria-label="Verified project evidence">
          <span>Evidence, not decoration</span>
          <ul>{project.evidence.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      )}

      <div className="inspector-actions">
        <button type="button" onClick={onOpenCaseStudy}>
          Inspect case study
          <ArrowRight size={18} weight="bold" aria-hidden="true" />
        </button>
        <LinkRow links={project.links} />
      </div>
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
        {project.carousel ? <ProjectCarousel key={project.id} project={project} /> : project.images[0] && <figure className="case-reader__main-artifact"><img src={project.images[0].src} alt={project.images[0].alt} /><figcaption>{project.images[0].caption ?? `${project.images[0].label} · captured from the actual product`}</figcaption></figure>}
        <section className="case-reader__section"><h3>My contribution</h3><div><p>{project.contribution}</p><ul>{story.approach.map((item) => <li key={item}>{item}</li>)}</ul></div></section>
        <section className="case-reader__section"><h3>Engineering decisions</h3><div>{story.decisions.map((decision) => <div className="case-decision" key={decision.title}><h4>{decision.title}</h4><p>{decision.detail}</p></div>)}</div></section>
        <section className="case-reader__section"><h3>Evidence & results</h3><p>{story.proof}</p></section>
        <section className="case-reader__scope"><h3>Scope & current status</h3><p>{story.boundary}</p></section>
        {project.images.length > 1 && <div className="case-reader__gallery">{(project.carousel ? project.images.filter((image) => image.detail) : project.images.slice(1)).map((image) => <figure key={image.src}><img src={image.src} alt={image.alt} loading="lazy" /><figcaption>{image.caption ?? `${image.label} · actual product screenshot`}</figcaption></figure>)}</div>}
        <footer className="case-reader__footer"><a href={profileLinks.email}>Ask me about this project ↗</a><button type="button" onClick={onClose}>Back to portfolio</button></footer>
      </article>
    </dialog>
  );
}

export function Sprite({ kind, position, direction, frame, walking, distance = 0, speed = 0, traveling = false, duration = 120, activity, idleDuration, idleDelay, className = "" }) {
  const row = kind === "person" ? 0 : kind === "pomsky-white" ? 1 : 2;
  const column = directions[direction] + (walking ? frame : 1);
  const isDog = kind.startsWith("pomsky-");
  const idleDog = isDog && !walking && (!activity || activity === "idle");
  const activityClass = isDog && activity ? `is-${activity}` : "";
  const gaitClass = isDog ? `gait-frame-${walking ? frame : 1}` : "";
  const personCrop = kind === "person" ? personFrames[column] : null;
  const sideView = kind === "person" && (direction === "left" || direction === "right");
  const northView = kind === "person" && direction === "up";
  const sidePoses = sideView ? [true, false].map((far) => sideLegPose(distance, walking, far, speed / PLAYER_SPEED)) : [];
  return (
    <span
      className={`game-sprite game-sprite--${kind} ${sideView ? "is-side-view" : ""} ${northView ? "is-north-view" : ""} ${walking ? "is-walking" : ""} ${idleDog ? "is-idle" : ""} ${activityClass} ${gaitClass} ${traveling ? "is-traveling" : ""} ${className}`}
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
      aria-hidden="true"
    >
      {sideView && <span className="side-walk" style={{ transform: direction === "right" ? "scaleX(-1)" : undefined }}>
        {sidePoses.map((pose, index) => ["leg", "shoe"].map((part) => {
          const joint = pose[part];
          return <span key={`${index}-${part}`} className={`side-walk__segment side-walk__segment--${part}`} style={{ transformOrigin: `${joint.origin[0] / 128 * 100}% ${joint.origin[1] / 288 * 100}%`, transform: `translate(${joint.x / 128 * 100}%, ${joint.y / 288 * 100}%) rotate(${joint.angle}deg) scale(${joint.scale})` }}>
            <span className="side-walk__pixels side-walk__leg--near" />
          </span>;
        }))}
        <span className="side-walk__body" style={{ transform: `translateY(${sidePoses[0].bodyY / 288 * 100}%)` }}>
          <span className="side-walk__pixels side-walk__pelvis" />
          <span className="side-walk__pixels side-walk__torso" />
        </span>
      </span>}
      {northView && <span className="north-walk">
        {[false, true].map((right) => <span key={String(right)} className="north-walk__leg" style={{ transform: `scale(${right ? -1 : 1}, ${northLegPose(distance, walking, right, speed / PLAYER_SPEED).scaleY})` }}><span className="north-walk__pixels north-walk__leg-pixels" /></span>)}
        <span className="north-walk__pixels north-walk__torso" />
      </span>}
    </span>
  );
}

function StudioView({ project, onSelect, onInspect, onShowIndex }) {
  const mapRef = useRef(null);
  const reducedMotion = useReducedMotionPreference();
  const player = useStudioPlayer({ mapRef, canWalk: canPlayerWalk, routeTo: routePlayerTo, reducedMotion });
  const { position } = player;
  const whitePomsky = useWanderingDog("left", mapRef);
  const blackPomsky = useWanderingDog("right", mapRef);

  const nearestProject = useMemo(() => {
    return primaryProjects.reduce((best, candidate) => {
      const approach = stationApproaches[candidate.id];
      const distance = Math.hypot(position.x - approach.x, position.y - approach.y);
      return !best || distance < best.distance ? { project: candidate, distance } : best;
    }, null);
  }, [position]);

  useEffect(() => {
    const onKeyDown = (event) => {
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
  }, [nearestProject, onInspect, onSelect]);

  const walkToStation = (nextProject) => {
    player.walkTo(stationApproaches[nextProject.id]);
    onSelect(nextProject);
  };

  return (
    <section className="studio-view" aria-label="Walkable portfolio studio">
      <div className="studio-map-wrap">
        <div className="studio-map" ref={mapRef} tabIndex="0" aria-label="Use W A S D or arrow keys to walk between project stations">
          <img className="studio-room" src="/assets/portfolio-house-room-v2.png" alt="Two-room pixel-art working studio with project stations and an open connecting doorway" />

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
            const nearby = nearestProject?.project.id === candidate.id && nearestProject.distance < 9;
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
                onDoubleClick={() => onInspect(candidate)}
                aria-label={`Walk to ${candidate.title}`}
              >
                <span>{candidate.number}</span>
                <strong>{candidate.shortTitle}</strong>
              </button>
            );
          })}

          <Sprite kind="pomsky-white" {...whitePomsky} />
          <Sprite kind="pomsky-black" {...blackPomsky} />
          <Sprite kind="person" {...player} />

          <div className="room-prompt" aria-live="polite">
            {nearestProject?.distance < 9 ? <><kbd>Enter</kbd> inspect {nearestProject.project.shortTitle}</> : <>Walk to an object · Enter to inspect</>}
          </div>
        </div>
      </div>

      <div className="mobile-studio-list" aria-label="Studio project stations">
        <div className="mobile-studio-list__intro">
          <div className="mobile-party" aria-hidden="true">
            <Sprite kind="pomsky-white" position={{ x: 28, y: 50 }} direction="right" frame={1} walking={false} activity="mobile-white" />
            <Sprite kind="person" position={{ x: 50, y: 42 }} direction="down" frame={1} walking={false} />
            <Sprite kind="pomsky-black" position={{ x: 72, y: 52 }} direction="left" frame={1} walking={false} activity="mobile-black" />
          </div>
          <p className="eyebrow">Portfolio House · touch edition</p>
          <h2>Choose a station.</h2>
          <p>The same seven case studies, recomposed for a smaller screen—no tiny fake game controls required.</p>
        </div>
        <div className="mobile-stations">
          {primaryProjects.map((candidate) => (
            <button
              key={`${candidate.id}-mobile`}
              className={candidate.id === project.id ? "is-selected" : ""}
              style={{ "--mobile-accent": candidate.accent }}
              type="button"
              onClick={() => onSelect(candidate)}
            >
              {candidate.images[0] && <img src={candidate.images[0].src} alt="" />}
              <span>{candidate.number}</span>
              <strong>{candidate.shortTitle}</strong>
              <small>{candidate.date}</small>
            </button>
          ))}
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
    try { window.localStorage.setItem("portfolio-view", nextView); } catch { /* Storage can be disabled in private browsing. */ }
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
      {view === "studio" && <p className="studio-status">Studio · Work in progress <span>Movement and room interactions are still being refined. All projects are also available in Index.</span></p>}
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
        <span>{project.number} / 07</span>
        <button type="button" onClick={() => selectProject(primaryProjects[(primaryProjects.indexOf(project) + 1) % primaryProjects.length])}>Next <CaretRight size={18} /></button>
      </div>
    </div>
  );
}
