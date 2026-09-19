import { useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, DownloadSimple } from "@phosphor-icons/react";
import { games, primaryProjects, profileLinks, projectById } from "./projects.js";
import { projectStories } from "./project-stories.js";

export const resumeUrl = "/Giampiero_Giovingo_2026.pdf";

const introductions = {
  "restaurant-menu-pos": {
    description: "Designed and built Ghost and Koë’s food-truck storefronts, from configurable menus to cart and checkout review.",
    proof: "Two distinct brands share one reusable ordering foundation.",
  },
  "realtime-multiplayer-lab": {
    description: "Developed two browser games with AI assistance, connecting player interactions to server-owned rules and shared state.",
    proof: "Stack Rush’s two-client tests cover competitive play and reconnects.",
  },
  arkollab: {
    description: "Led the team to develop a luxury-bag appraisal product and built its v0 frontend, from item intake to a readable report.",
    proof: "Photo and condition intake → mock comparables → saved appraisal.",
  },
  "cognitive-load-mvp": {
    description: "Built a research tool comparing hints, walkthroughs and adaptive guidance for beginner programming problems.",
    proof: "Four policies, eight tasks. Modeled predictions, not student outcomes.",
  },
};

const gameIntroductions = {
  "truco-venezolano": "Venezuelan card play with guided AI practice.",
  "stack-rush": "Tower of Hanoi and Nuts & Bolts, solo or head-to-head.",
  binaryrush: "JavaScript coding races for up to five players.",
  "circle-accuracy": "Draw a circle. Get a geometry-based accuracy score.",
};

export function ProjectLinks({ links = [] }) {
  if (!links.length) return null;
  return <div className="project-links">{links.map((link) => <a key={link.href + link.label} href={link.href} target="_blank" rel="noreferrer">{link.label} <ArrowUpRight size={15} aria-hidden="true" /></a>)}</div>;
}

export function ProjectCarousel({ project, onOpen, details = false }) {
  const rail = useRef(null);
  const [index, setIndex] = useState(0);
  const hasDetails = details && project.images.some((image) => image.detail);
  const images = project.images.filter((image) => hasDetails ? image.detail : !image.detail);
  const go = (next) => rail.current?.scrollTo({ left: Math.max(0, Math.min(images.length - 1, next)) * rail.current.clientWidth, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  return <section className="project-carousel" aria-label={`${project.shortTitle} screenshots`} aria-roledescription="carousel">
    <div className="project-carousel__rail" ref={rail} tabIndex={0} onScroll={(event) => setIndex(Math.round(event.currentTarget.scrollLeft / event.currentTarget.clientWidth))} onKeyDown={(event) => { if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); go(index + (event.key === "ArrowRight" ? 1 : -1)); } }}>
      {images.map((image, i) => <figure className="project-carousel__slide" key={image.src} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${images.length}: ${image.label}`}>
        {onOpen ? <a href={`#project=${project.id}`} onClick={(event) => { event.preventDefault(); onOpen(project); }} aria-label={`Read about ${image.label}`}><img src={image.src} alt={image.alt} loading={i ? "lazy" : "eager"} /></a> : <a href={image.src} target="_blank" rel="noreferrer" aria-label={`View full-size ${image.label}`}><img src={image.src} alt={image.alt} loading="lazy" /></a>}
        <figcaption>{image.label}</figcaption>
      </figure>)}
    </div>
    <div className="project-carousel__controls"><button type="button" disabled={index === 0} onClick={() => go(index - 1)} aria-label={`Previous screenshot: ${project.shortTitle}`}>←</button><span aria-live="polite" aria-atomic="true">{index + 1} / {images.length}<span className="sr-only"> · {images[index]?.label}</span></span><button type="button" disabled={index === images.length - 1} onClick={() => go(index + 1)} aria-label={`Next screenshot: ${project.shortTitle}`}>→</button></div>
  </section>;
}

function ProjectFeature({ project, onOpen, selected }) {
  const intro = introductions[project.id];
  return (
    <article className={`work-feature work-feature--${project.id}`} id={`work-${project.id}`}>
      <div className="work-feature__top"><span>{project.number}</span><span>{project.date}</span></div>
      {project.carousel ? <ProjectCarousel project={project} onOpen={onOpen} /> : <a className="work-feature__image" href={`#project=${project.id}`} onClick={(event) => { event.preventDefault(); onOpen(project); }} aria-label={`Read ${project.title} case study`}>
        <img src={project.images[0].src} alt={project.images[0].alt} width="1440" height="1000" loading={project.number === "01" ? "eager" : "lazy"} />
        <span className="artifact-caption">{project.images[0].label}<ArrowUpRight size={20} aria-hidden="true" /></span>
      </a>}
      <div className="work-feature__body">
        <h3><a href={`#project=${project.id}`} onClick={(event) => { event.preventDefault(); onOpen(project); }}>{project.shortTitle}</a></h3>
        <p className="work-feature__role">{project.role}</p>
        <p className="work-feature__description">{intro.description}</p>
        <p className="work-feature__proof">{intro.proof}</p>
        <div className="work-feature__bottom"><span>{project.status}</span><button type="button" onClick={() => onOpen(project)} aria-label={`Read case study: ${project.shortTitle}`}>Read case study <ArrowRight size={18} aria-hidden="true" /></button></div>
        <ProjectLinks links={project.links} />
        {selected && <span className="sr-only">Currently selected project</span>}
      </div>
    </article>
  );
}

export function RecruiterPortfolio({ selectedId, onOpen, onStudio, archive, cabinet }) {
  return (
    <main className="recruiter-page" id="main-content" tabIndex={-1}>
      <section className="portfolio-intro" aria-labelledby="intro-title">
        <div className="intro-overline"><span>Orlando, Florida</span><span>Open to software engineering roles</span></div>
        <div className="intro-grid">
          <h1 id="intro-title">Giampiero<br />Giovingo<span>.</span></h1>
          <div className="intro-copy">
            <h2>Software engineer.</h2>
            <p>I build web products with React, TypeScript, Python and Java.</p>
            <p className="intro-context">Georgia Tech M.S. CS · in progress<br />UCF B.S. Computer Science.</p>
            <div className="intro-actions"><a className="editorial-button" href="#work">Explore the work <ArrowDown size={18} aria-hidden="true" /></a><a className="text-action" href={resumeUrl} target="_blank" rel="noreferrer">Résumé PDF <ArrowUpRight size={17} aria-hidden="true" /></a></div>
          </div>
        </div>
      </section>

      <section className="selected-work" id="work" aria-labelledby="work-heading">
        <div className="section-heading"><h2 id="work-heading">Selected work<span>01—04</span></h2></div>
        <div className="work-grid">{primaryProjects.slice(0, 4).map((project) => <ProjectFeature key={project.id} project={project} selected={project.id === selectedId} onOpen={onOpen} />)}</div>
      </section>

      <section className="games-section" id="games" aria-labelledby="games-heading">
        <div className="section-heading"><h2 id="games-heading">Games <span>Play the projects</span></h2></div>
        <div className="games-grid">
          {games.map((game) => (
            <article className={`game-entry${game.image ? "" : " game-entry--source-only"}`} id={`game-${game.id}`} key={game.id}>
              {game.image ? <a className="game-entry__image" href={game.links[0].href} target="_blank" rel="noreferrer" aria-label={`Open ${game.title} in a new tab`}>
                <img src={game.image.src} alt={game.image.alt} loading="lazy" width="1280" height="720" />
              </a> : null}
              <div className="game-entry__body">
                <div className="game-entry__meta"><span className={game.status === "Work in progress" ? "game-entry__wip" : ""}>{game.status}</span></div>
                <h3>{game.title}</h3>
                <p>{gameIntroductions[game.id]}</p>
                {game.status === "Work in progress" && <p className="game-entry__access">{game.access}</p>}
                <ProjectLinks links={game.links} />
                {projectById[game.id] && <a className="text-action" href={`#project=${game.id}`} onClick={(event) => { event.preventDefault(); onOpen(projectById[game.id]); }}>Read case study <ArrowRight size={18} aria-hidden="true" /></a>}
              </div>
              <details className="game-entry__details"><summary>Build details<span className="sr-only"> for {game.title}</span></summary><p className="work-feature__role">{game.role ?? "Product direction · AI-assisted engineering"} · {game.date}</p><p>{game.description}</p><p>{game.detail}</p><p className="work-stack">{game.stack.join(" / ")}</p>{game.images?.length > 0 && <ProjectCarousel project={{ ...game, shortTitle: game.title }} />}</details>
            </article>
          ))}
        </div>
        <a className="text-action" href="#project=realtime-multiplayer-lab" onClick={(event) => { event.preventDefault(); onOpen(projectById["realtime-multiplayer-lab"]); }}>Read the multiplayer engineering case study <ArrowRight size={18} aria-hidden="true" /></a>
      </section>

      <section className="engineering-work" aria-labelledby="engineering-heading">
        <div className="section-heading"><h2 id="engineering-heading">Under the hood<span>06—07</span></h2><p>Backend systems & computer-science foundations.</p></div>
        <div className="engineering-list">{[projectById["revature-architectures"], projectById["algorithms-lab"]].map((project) => (
          <article className="engineering-entry" key={project.id}><a href={`#project=${project.id}`} onClick={(event) => { event.preventDefault(); onOpen(project); }}>
            <span className="engineering-number">{project.number}</span>
            <div><h3>{project.title}</h3><p className="work-feature__role">{project.role}</p><span className="work-stack">{projectStories[project.id].stack.slice(0, 4).join(" / ")}</span></div>
            <div className="engineering-meta"><span>{project.date}</span><span>{project.status}</span><ArrowUpRight size={24} aria-hidden="true" /></div>
          </a><ProjectLinks links={project.links} /></article>
        ))}</div>
      </section>

      <section className="about-section" id="about" aria-labelledby="about-heading">
        <div className="about-copy"><p className="section-kicker">The person behind the work</p><h2 id="about-heading">Curious about the whole thing.</h2><p>I like turning an unclear problem into a working product: shaping the interface, building the system and testing what happens when things go wrong.</p><p className="about-personal">Away from the screen: two blue-eyed Pomskies, both wandering around my <button type="button" onClick={onStudio}>little portfolio house <ArrowUpRight size={15} aria-hidden="true" /></button>.</p></div>
        <div className="background-record">
          <h3>Background</h3>
          <article><span>2024—present</span><h4>Georgia Institute of Technology</h4><p>M.S. Computer Science · in progress</p></article>
          <article><span>Jan—Mar 2025 · training</span><h4>Revature</h4><p>Java backend cohort · ongoing client-placement activity</p></article>
          <article><span>Sep 2024—Sep 2025</span><h4>ScribeAmerica</h4><p>Remote Medical Scribe</p></article>
          <article><span>Aug—Dec 2024</span><h4>Outlier AI</h4><p>Generalist & STEM model evaluation</p></article>
          <article><span>2019—2022</span><h4>University of Central Florida</h4><p>B.S. Computer Science · Mathematics minor</p></article>
          <a className="text-action" href={resumeUrl} download>Download full résumé <DownloadSimple size={17} aria-hidden="true" /></a>
        </div>
      </section>

      <div className="extended-archive" id="archive"><div className="section-heading"><h2>More from the archive</h2><p>Team projects, early builds, and experiments.</p></div>{archive}{cabinet}</div>

      <footer className="contact-section" id="contact">
        <p className="section-kicker">Have a role or a problem in mind?</p><h2>Let’s build<br />something useful.</h2>
        <a className="contact-email" href={profileLinks.email}>giampiga.cs@gmail.com <ArrowUpRight size={27} aria-hidden="true" /></a>
        <div className="contact-footer"><span>Giampiero Giovingo · Orlando, FL</span><div><a href={profileLinks.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={16} aria-hidden="true" /></a><a href={profileLinks.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={16} aria-hidden="true" /></a><a href={resumeUrl} target="_blank" rel="noreferrer">Résumé <ArrowUpRight size={16} aria-hidden="true" /></a><a href="#top">Back to top ↑</a></div></div>
      </footer>
    </main>
  );
}
