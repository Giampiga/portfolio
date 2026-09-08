import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import test from "node:test";
import { primaryProjects, archiveProjects, projectById, repositoryCabinet } from "../src/projects.js";
import { projectStories } from "../src/project-stories.js";
import { resolveInitialView } from "../src/portfolio-view.js";

test("new visitors get Index, while explicit links and saved view preferences work", () => {
  assert.equal(resolveInitialView(), "index");
  assert.equal(resolveInitialView({ savedView: "studio" }), "studio");
  assert.equal(resolveInitialView({ savedView: "invalid" }), "index");
  assert.equal(resolveInitialView({ explicitView: "index", savedView: "studio" }), "index");
  assert.equal(resolveInitialView({ explicitView: "studio", savedView: "index" }), "studio");
});

test("reduced-motion preference takes precedence over saved and linked Studio views", () => {
  assert.equal(resolveInitialView({ reducedMotion: true, explicitView: "studio", savedView: "studio" }), "index");
});

test("both portfolio views share seven unique projects with complete stories", () => {
  assert.equal(primaryProjects.length, 7);
  assert.equal(new Set(primaryProjects.map(({ id }) => id)).size, 7);
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
  assert.ok(!primaryProjects.flatMap((p) => p.links).some((l) => l.href.includes("koe-usa-website")));
  assert.match(projectStories.arkollab.boundary, /open, not merged/);
  assert.match(projectStories["cognitive-load-mvp"].boundary, /not a human-subject/);
  assert.match(projectStories["revature-architectures"].boundary, /Protected materials remain private/);
  assert.match(projectStories["algorithms-lab"].boundary, /implementation is not preserved/);
});

test("the requested archive is retained and source links are public URL shapes", () => {
  for (const id of ["gummy", "groov", "polybay", "quick-baccarat"]) assert.ok(archiveProjects.some((p) => p.id === id));
  for (const project of [...primaryProjects, ...archiveProjects]) {
    for (const link of project.links) assert.equal(new URL(link.href).protocol, "https:");
  }
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
