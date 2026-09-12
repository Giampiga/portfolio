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
    const { RecruiterPortfolio } = await server.ssrLoadModule("/src/RecruiterPortfolio.jsx");
    const html = renderToStaticMarkup(createElement(RecruiterPortfolio, { onOpen() {}, onStudio() {} }));
    assert.equal((html.match(/id="game-/g) ?? []).length, 4);
    assert.equal((html.match(/<details class="game-entry__details">/g) ?? []).length, 4);
    assert.ok(!html.includes("<details open"));
    assert.ok(html.includes("Georgia Tech M.S. CS · in progress"));
    assert.ok(html.includes("Built with Codex · published on GPT Sites"));
    assert.ok(html.includes("https://truco-ve.vercel.app/"));
    assert.ok(!html.includes("evidence-slate") && !html.includes("src=\"undefined\""));
    const engineering = html.match(/<section class="engineering-work"[\s\S]*?<\/section>/)[0];
    assert.ok(!engineering.includes("Circle Accuracy"));
    assert.ok(engineering.includes("Revature") && engineering.includes("Algorithms"));
  } finally {
    await server.close();
  }
});
