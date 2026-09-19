import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { games, primaryProjects, archiveProjects, projectById, repositoryCabinet } from "../src/projects.js";
import { projectStories } from "../src/project-stories.js";
import { resolveInitialView } from "../src/portfolio-view.js";

test("landing defaults to Index even with a saved Studio preference; explicit links still work", () => {
  assert.equal(resolveInitialView(), "index");
  assert.equal(resolveInitialView({ savedView: "studio" }), "index");
  assert.equal(resolveInitialView({ explicitView: "invalid", savedView: "studio" }), "index");
  assert.equal(resolveInitialView({ savedView: "invalid" }), "index");
  assert.equal(resolveInitialView({ explicitView: "index", savedView: "studio" }), "index");
  assert.equal(resolveInitialView({ explicitView: "studio", savedView: "index" }), "studio");
});

test("reduced-motion preference takes precedence over saved and linked Studio views", () => {
  assert.equal(resolveInitialView({ reducedMotion: true, explicitView: "studio", savedView: "studio" }), "index");
});

test("both portfolio views share eight unique projects with complete stories", () => {
  assert.equal(primaryProjects.length, 8);
  assert.equal(new Set(primaryProjects.map(({ id }) => id)).size, 8);
  assert.deepEqual(Object.keys(projectStories).sort(), Object.keys(projectById).sort());
  for (const project of primaryProjects) {
    assert.ok(project.role && project.date && project.status && project.station);
    const story = projectStories[project.id];
    assert.ok(story.challenge && story.proof && story.boundary);
    assert.ok(story.stack.length && story.approach.length >= 2 && story.decisions.length >= 2);
  }
});

test("all product screenshots exist and the four lead projects have real artifacts", async () => {
  assert.ok(primaryProjects.slice(0, 4).every((project) => project.images.length));
  for (const { images } of primaryProjects) {
    for (const image of images) {
      assert.ok(image.alt && image.label);
      assert.ok(image.src.startsWith("/assets/projects/"));
      await access(new URL(`../public${image.src}`, import.meta.url));
    }
  }
});

test("résumé is an actual PDF and is included in the production output", async () => {
  const file = await readFile(new URL("../public/Giampiero_Giovingo_2026.pdf", import.meta.url));
  assert.equal(file.subarray(0, 5).toString(), "%PDF-");
  assert.ok(file.length > 10000);
  const built = await readFile(new URL("../dist/client/Giampiero_Giovingo_2026.pdf", import.meta.url));
  assert.deepEqual(file, built);
});

test("private Koë source is not exposed and protected-course summaries stay bounded", () => {
  assert.ok(!primaryProjects.flatMap((p) => p.links).some((l) => l.href.startsWith("https://github.com/Giampiga/koe-usa-website")));
  assert.match(projectStories.arkollab.boundary, /open, not merged/);
  assert.match(projectStories["cognitive-load-mvp"].boundary, /not a human-subject/);
  assert.match(projectStories["revature-architectures"].boundary, /Protected materials remain private/);
  assert.match(projectStories["algorithms-lab"].boundary, /implementation is not preserved/);
});

test("theme startup respects saved choices, system preference, and blocked storage", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  for (const [saved, systemDark, blocked, expected] of [["dark", false, false, "dark"], ["light", true, false, "light"], [null, true, false, "dark"], ["invalid", false, false, "light"], [null, true, true, "dark"]]) {
    const document = { documentElement: { dataset: {} } };
    runInNewContext(script, { document, matchMedia: () => ({ matches: systemDark }), localStorage: { getItem: () => { if (blocked) throw new Error("blocked"); return saved; } } });
    assert.equal(document.documentElement.dataset.theme, expected);
  }
});

test("storefront and game carousels use current artifacts and publish supplied demo links", () => {
  const storefronts = projectById["restaurant-menu-pos"];
  const games = projectById["realtime-multiplayer-lab"];
  assert.equal(storefronts.carousel, true);
  assert.deepEqual(storefronts.images.filter((image) => !image.detail).map((image) => image.label), ["Ghost storefront", "Koë storefront"]);
  assert.equal(games.carousel, true);
  assert.equal(games.images[0], projectById["truco-venezolano"].images[0]);
  assert.ok(games.images.some((image) => image.src === "/assets/projects/stack-rush-live.png"));
  assert.equal(games.links.find((link) => link.label === "Play Stack Rush").href, "https://stack-rush-pi.vercel.app/");
  assert.match(games.summary, /Codex.*GPT Sites/);
  assert.match(games.status, /Truco.*in progress/);
  for (const url of ["https://ghost-prototype-mu.vercel.app/", "https://koe-usa-website.vercel.app/", "https://truco-ve.vercel.app/", "https://binaryrush.gga.chatgpt.site/"]) {
    assert.ok([...storefronts.links, ...games.links].some((link) => link.href === url));
  }
  assert.ok(!games.links.some((link) => link.href.startsWith("https://github.com/Giampiga/truco-venezolano")));
});

test("the requested archive is retained and source links are public URL shapes", () => {
  for (const id of ["gummy", "groov", "polybay", "quick-baccarat"]) assert.ok(archiveProjects.some((p) => p.id === id));
  for (const project of [...primaryProjects, ...archiveProjects]) {
    for (const link of project.links) assert.equal(new URL(link.href).protocol, "https:");
  }
});

test("Games presents four projects with explicit WIP labels and shared evidence", async () => {
  assert.deepEqual(games.map((game) => game.id), ["truco-venezolano", "stack-rush", "binaryrush", "circle-accuracy"]);
  const lab = projectById["realtime-multiplayer-lab"];
  const truco = projectById["truco-venezolano"];
  assert.deepEqual(lab.images, games.slice(0, 3).map((game) => game.image));
  for (const game of games) {
    assert.ok(game.date && game.description && game.access && game.stack.length);
  }
  for (const game of games.slice(0, 3)) {
    assert.equal(game.status, game.id === "stack-rush" ? "Live prototype" : "Work in progress");
    assert.ok(lab.images.includes(game.image));
    await access(new URL(`../public${game.image.src}`, import.meta.url));
    for (const link of game.links) assert.ok(lab.links.includes(link));
  }
  assert.match(games[0].description, /full-stack.*server-authoritative.*rule-based/);
  assert.match(games[0].detail, /Elo rankings, profiles, friendships, chat and match history/);
  assert.match(games[0].detail, /drag-and-drop.*dark mode/);
  assert.match(games[0].detail, /three difficulty levels/);
  assert.match(games[0].access, /Vercel/);
  assert.match(games[0].stack.join(" "), /Next.js.*Supabase.*PostgreSQL/);
  assert.ok(!games[0].stack.some((item) => /D1|Drizzle/.test(item)));
  assert.equal(games[0].images.length, 4);
  assert.equal(games[0].image, games[0].images[0]);
  for (const image of games[0].images) {
    assert.ok(image.alt && image.label && truco.images.includes(image));
    assert.equal(lab.images.includes(image), image === truco.images[0]);
    for (const directory of ["public", "dist/client"]) await access(new URL(`../${directory}${image.src}`, import.meta.url));
  }
  assert.match(games[2].detail, /Codex.*GPT Sites/);
  const circle = games[3];
  assert.equal(circle.status, "Prototype");
  assert.equal(circle.date, projectById[circle.id].date);
  assert.equal(circle.links, projectById[circle.id].links);
  assert.equal(circle.evidence, projectById[circle.id].evidence);
  assert.equal(circle.access, "Prototype · public source.");
  assert.ok(!JSON.stringify(games).includes("honest date framing"));
  assert.equal(lab.links.some((link) => circle.links.includes(link)), false);
  assert.ok(!games.flatMap((game) => game.links).some((link) => link.href.includes("github.com/Giampiga/truco")));
});

test("public cabinet omits the old portfolio and empty repositories", () => {
  for (const title of ["Old portfolio", "Rock Paper Scissors", "GH-ML4T24"]) {
    assert.ok(!repositoryCabinet.some((item) => item.title === title));
  }
  assert.ok(!repositoryCabinet.some((item) => /empty|placeholder/i.test(item.type)));
});

test("Groov explains the product and specific frontend contribution", () => {
  const groov = archiveProjects.find((item) => item.id === "groov");
  assert.match(groov.description, /music social app/);
  assert.match(groov.contribution, /profile-image selection with local preview/);
  assert.ok(groov.stack.includes("React"));
  assert.ok(groov.links.some((link) => link.href.endsWith("/pull/30")));
});

test("Arkollab uses approved current team-app dashboard, report and intake captures", async () => {
  const images = projectById.arkollab.images;
  assert.deepEqual(images.map((image) => image.src), [
    "/assets/projects/arkollab-dashboard-live.jpg",
    "/assets/projects/arkollab-appraisal-live.jpg",
    "/assets/projects/arkollab-intake-live.jpg",
  ]);
  for (const image of images) {
    assert.match(image.caption, /Current team app/);
    for (const directory of ["public", "dist/client"]) {
      const bytes = await readFile(new URL(`../${directory}${image.src}`, import.meta.url));
      assert.deepEqual([...bytes.subarray(0, 3)], [0xff, 0xd8, 0xff]);
    }
  }
});
