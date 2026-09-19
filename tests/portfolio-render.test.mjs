import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import react from "@vitejs/plugin-react";

test("Index keeps four games, native build details and a single Circle entry", async () => {
  const server = await createServer({
    configFile: false,
    plugins: [react()],
    optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, hmr: false, ws: false },
    appType: "custom",
  });
  try {
    const { RecruiterPortfolio, ProjectCarousel } = await server.ssrLoadModule("/src/RecruiterPortfolio.jsx");
    const { projectById } = await server.ssrLoadModule("/src/projects.js");
    const html = renderToStaticMarkup(createElement(RecruiterPortfolio, { onOpen() {}, onStudio() {} }));
    assert.equal((html.match(/id="game-/g) ?? []).length, 4);
    assert.equal((html.match(/<details class="game-entry__details">/g) ?? []).length, 4);
    assert.ok(!html.includes("<details open"));
    assert.ok(html.includes("Georgia Tech M.S. CS · in progress"));
    assert.ok(html.includes("Built with Codex · published on GPT Sites"));
    assert.ok(html.includes("https://truco-ve.vercel.app/"));
    assert.ok(!html.includes("evidence-slate") && !html.includes("src=\"undefined\""));
    assert.ok(!html.includes("Interfaces with care") && !html.includes("Public source with honest date framing"));
    const features = html.match(/<article class="work-feature [\s\S]*?<\/article>/g);
    assert.equal(features.length, 4);
    for (const feature of features) {
      assert.equal((feature.match(/<h3>/g) ?? []).length, 1);
      assert.equal((feature.match(/class="work-feature__proof"/g) ?? []).length, 1);
      assert.ok(!feature.includes('class="work-stack"') && !feature.includes('class="work-feature__name"'));
    }
    const restaurant = projectById["restaurant-menu-pos"];
    const preview = renderToStaticMarkup(createElement(ProjectCarousel, { project: restaurant }));
    const caseStudy = renderToStaticMarkup(createElement(ProjectCarousel, { project: restaurant, details: true }));
    assert.ok(preview.includes("ghost-current.jpg") && preview.includes("koe-current.jpg"));
    assert.ok(preview.includes('<span aria-live="polite" aria-atomic="true">1 / 2<span class="sr-only"> · Ghost storefront</span></span>'));
    assert.ok(!preview.includes("ghost-modifiers-live.jpg"));
    assert.ok(caseStudy.includes("ghost-modifiers-live.jpg") && caseStudy.includes("ghost-cart-live.jpg"));
    assert.ok(!caseStudy.includes("ghost-current.jpg") && !caseStudy.includes("koe-current.jpg"));
    const gameCase = renderToStaticMarkup(createElement(ProjectCarousel, { project: projectById["realtime-multiplayer-lab"], details: true }));
    assert.ok(!gameCase.includes("truco-"));
    const trucoCase = renderToStaticMarkup(createElement(ProjectCarousel, { project: projectById["truco-venezolano"], details: true }));
    assert.ok(trucoCase.includes("truco-sep18-practice.png"));
    const trucoCard = html.match(/<article class="game-entry" id="game-truco-venezolano">[\s\S]*?<\/article>/)[0];
    assert.ok(trucoCard.split("<details")[0].includes('href="#project=truco-venezolano"'));
    const engineering = html.match(/<section class="engineering-work"[\s\S]*?<\/section>/)[0];
    assert.ok(!engineering.includes("Circle Accuracy"));
    assert.ok(!engineering.includes("Truco"));
    assert.ok(engineering.includes("Revature") && engineering.includes("Algorithms"));
  } finally {
    await server.close();
  }
});
