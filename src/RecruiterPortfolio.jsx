import { ArrowDown, ArrowRight, ArrowUpRight, DownloadSimple } from "@phosphor-icons/react";
import { primaryProjects, profileLinks } from "./projects.js";
import { projectStories } from "./project-stories.js";

export const resumeUrl = "/Giampiero_Giovingo_2026.pdf";

const introductions = {
  "restaurant-menu-pos": {
    discipline: "Commerce · Product design · Frontend",
    headline: "Two brands. One better ordering journey.",
    description: "Distinct Ghost and Koë storefronts with configurable menus, modifiers and carts. A product I’m shaping with prospective local food-truck partners.",
    proof: "Responsive ordering flows + a reusable food-truck website skill.",
  },
  "realtime-multiplayer-lab": {
    discipline: "Realtime systems · Browser games",
    headline: "Friendly competition. Serious state management.",
    description: "Binaryrush and Stack Rush: a sandboxed coding race and a multiplayer puzzle arcade, with shared rooms, server-owned results and rematches.",
    proof: "Bounded code execution, reconnect flows and two-client test coverage.",
  },
  arkollab: {
    discipline: "Product workflows · Team contribution",
    headline: "An appraisal you can actually follow.",
    description: "A luxury-bag appraisal journey from photos and condition to comparable listings and a readable valuation report. My contribution: the v0 frontend prototype.",
    proof: "A 23-file frontend contribution, submitted as an open PR.",
  },
  "cognitive-load-mvp": {
    discipline: "Python · Research · Learning tools",
    headline: "When does more help become more work?",
    description: "A Georgia Tech prototype comparing four learning-support policies. An inspectable model of the tradeoffs between explanation and cognitive load.",
    proof: "Four policies, eight tasks. Modeled predictions, not student outcomes.",
  },
};

function ProjectFeature({ project, onOpen, selected }) {
  const intro = introductions[project.id];
  const story = projectStories[project.id];
  return (
    <article className={`work-feature work-feature--${project.id}`} id={`work-${project.id}`}>
      <div className="work-feature__top"><span>{project.number} / {intro.discipline}</span><span>{project.date}</span></div>
      <a className="work-feature__image" href={`#project=${project.id}`} onClick={(event) => { event.preventDefault(); onOpen(project); }} aria-label={`Read ${project.title} case study`}>
        <img src={project.images[0].src} alt={project.images[0].alt} width="1440" height="1000" loading={project.number === "01" ? "eager" : "lazy"} />
        <span className="artifact-caption">{project.images[0].label}<ArrowUpRight size={20} aria-hidden="true" /></span>
      </a>
      <div className="work-feature__body">
        <p className="work-feature__name">{project.title}</p>
        <h3><a href={`#project=${project.id}`} onClick={(event) => { event.preventDefault(); onOpen(project); }}>{intro.headline}</a></h3>
        <p className="work-feature__description">{intro.description}</p>
        <p className="work-feature__proof">{intro.proof}</p>
        <p className="work-feature__role">My role: {project.ledgerRole}</p>
        <p className="work-stack">{story.stack.slice(0, 5).join(" / ")}</p>
        <div className="work-feature__bottom"><span>{project.status}</span><button type="button" onClick={() => onOpen(project)} aria-label={`Read case study: ${project.shortTitle}`}>Read case study <ArrowRight size={18} aria-hidden="true" /></button></div>
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
            <h2>Software engineer.<br />Product-minded builder.</h2>
            <p>I turn fuzzy requirements into usable interfaces and working systems—from restaurant ordering to multiplayer games and research tools.</p>
            <p className="intro-context">React & TypeScript, Python & Java.<br />Georgia Tech M.S. CS · UCF B.S. CS.</p>
            <div className="intro-actions"><a className="editorial-button" href="#work">Explore the work <ArrowDown size={18} aria-hidden="true" /></a><a className="text-action" href={resumeUrl} target="_blank" rel="noreferrer">Résumé PDF <ArrowUpRight size={17} aria-hidden="true" /></a></div>
          </div>
        </div>
        <div className="intro-foot"><p>Interfaces with care. Systems with a reason.</p><button type="button" onClick={onStudio}>Prefer to wander? Enter the Studio <ArrowUpRight size={17} aria-hidden="true" /></button></div>
      </section>

      <section className="selected-work" id="work" aria-labelledby="work-heading">
        <div className="section-heading"><h2 id="work-heading">Selected work<span>01—04</span></h2><p>Product decisions. Implementation. Evidence.</p></div>
        <div className="work-grid">{primaryProjects.slice(0, 4).map((project) => <ProjectFeature key={project.id} project={project} selected={project.id === selectedId} onOpen={onOpen} />)}</div>
      </section>

      <section className="engineering-work" aria-labelledby="engineering-heading">
        <div className="section-heading"><h2 id="engineering-heading">Under the hood<span>05—07</span></h2><p>Smaller interfaces. Deeper implementation details.</p></div>
        <div className="engineering-list">{primaryProjects.slice(4).map((project) => (
          <a key={project.id} href={`#project=${project.id}`} onClick={(event) => { event.preventDefault(); onOpen(project); }}>
            <span className="engineering-number">{project.number}</span>
            <div><h3>{project.title}</h3><p>{projectStories[project.id].challenge}</p><p className="work-feature__role">{project.role}</p><span className="work-stack">{projectStories[project.id].stack.join(" / ")}</span></div>
            <div className="engineering-meta"><span>{project.date}</span><span>{project.status}</span><ArrowUpRight size={24} aria-hidden="true" /></div>
          </a>
        ))}</div>
      </section>

      <section className="about-section" id="about" aria-labelledby="about-heading">
        <div className="about-copy"><p className="section-kicker">The person behind the work</p><h2 id="about-heading">Curious about the whole thing.</h2><p>I like being close to both the problem and the implementation: mapping a confusing workflow, building the interface, then working through what happens when a request fails or a player disconnects.</p><p>My projects span independent prototypes, team contributions and graduate research. I use AI-assisted tools, and I document the decisions, tests and limitations that make the work mine to explain.</p><p className="about-personal">Away from the screen: two miniature Pomskies, both blue-eyed, both wandering around my <button type="button" onClick={onStudio}>little portfolio house <ArrowUpRight size={15} aria-hidden="true" /></button>.</p></div>
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
