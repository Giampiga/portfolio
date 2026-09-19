import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import react from "@vitejs/plugin-react";
import { authoredWalkPose, DOG_GAIT_FRAMES, SIDE_WALK_DISTANCE } from "../src/sprite-frames.js";
import { PLAYER_SPEED } from "../src/studio-motion.js";

function pixelPolygons(html) {
  return [...html.matchAll(/<polygon fill="(#[a-f0-9]+)" points="([^"]+)"/g)].map(([, fill, contour]) => {
    const points = contour.split(" ").map((point) => point.split(",").map(Number));
    for (const [index, [x, y]] of points.entries()) {
      const [nextX, nextY] = points[(index + 1) % points.length];
      assert.ok(x % 4 === 0 && y % 4 === 0, "Keep fabric and fur on the atlas-scale pixel grid");
      assert.ok(x === nextX || y === nextY, "Keep every contour edge stepped, including its closing edge");
    }
    return { fill, points };
  });
}

test("Studio keeps an accessible compact room, named dogs and the independent Index path", async () => {
  const server = await createServer({
    configFile: false,
    plugins: [react()],
    optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, hmr: false, ws: false },
    appType: "custom",
  });
  const previousWindow = globalThis.window;
  const previousDocument = globalThis.document;
  let compact = false;
  globalThis.window = {
    location: { search: "?view=studio", hash: "" },
    matchMedia: (query) => ({ matches: query.includes("max-width") ? compact : query.includes("min-width") ? !compact : false }),
  };
  globalThis.document = { hidden: false, documentElement: { dataset: { theme: "light" } } };
  try {
    const { App, Sprite } = await server.ssrLoadModule("/src/App.jsx");
    for (compact of [false, true]) {
      const html = renderToStaticMarkup(createElement(App));
      const pins = html.match(/<button class="station-pin[^>]*>/g) ?? [];
      assert.equal(pins.length, 8);
      assert.ok(pins.some((pin) => pin.includes("Truco Venezolano")));
      assert.ok(pins.every((pin) => pin.includes('type="button"') && pin.includes(`aria-label="${compact ? "Preview" : "Walk to"} `)));
      assert.equal(pins.filter((pin) => pin.includes('aria-current="true"')).length, 1);
      assert.ok(html.includes('src="/assets/portfolio-studio-loft.png"'));
      assert.ok(html.includes('aria-label="Pet Jojo"') && html.includes('aria-label="Pet Maui"'));
      assert.ok(html.includes('role="status"'));
      assert.ok(html.includes('href="?view=index#archive"'));
      assert.ok(html.includes('href="/Giampiero_Giovingo_2026.pdf"'));
      assert.ok(html.includes("Studio · Work in progress") && html.includes("Open full case study"));
      assert.ok(!html.includes('src="undefined"'));
      if (compact) assert.ok(html.includes("Tap a numbered station"));
    }
    for (const direction of ["left", "right", "up"]) {
      for (let phase = 0; phase <= 8; phase++) {
        const distance = phase / 8 * SIDE_WALK_DISTANCE, walking = phase < 8;
        const html = renderToStaticMarkup(createElement(Sprite, { kind: "person", position: { x: 45, y: 52 }, direction, distance, frame: 0, walking, speed: PLAYER_SPEED }));
        assert.ok(html.includes('class="player-artwork"'));
        assert.ok(!html.includes("NaN") && !html.includes("undefined"));
        const contours = pixelPolygons(html);
        assert.ok(contours.length >= 4, "Render both trouser outlines and fills");
        const legs = contours.filter(({ fill }) => fill === "#141418");
        assert.equal(legs.length, 2);
        if (direction === "up") continue;
        for (const [index, { points }] of legs.entries()) {
          const pose = authoredWalkPose(distance, walking, index === 0);
          for (const [joint, row, minimum] of [["thigh", pose.hip[1] + 4, 32], ["knee", pose.knee[1], 28], ["cuff", pose.ankle[1] - 2, 28]]) {
            const y = Math.round(row / 4) * 4 - 2;
            const crossings = points.flatMap(([x, fromY], pointIndex) => {
              const [toX, toY] = points[(pointIndex + 1) % points.length];
              return x === toX && y > Math.min(fromY, toY) && y < Math.max(fromY, toY) ? [x] : [];
            });
            assert.ok(crossings.length >= 2 && Math.max(...crossings) - Math.min(...crossings) >= minimum, `Keep the fuller side-view ${joint}: ${direction}, phase ${phase}`);
          }
        }
      }
    }
    for (const kind of ["pomsky-white", "pomsky-black"]) {
      const renderDog = (direction, gaitStep, walking = true) => renderToStaticMarkup(createElement(Sprite, {
        kind, direction, gaitStep, walking, frame: DOG_GAIT_FRAMES[gaitStep], position: { x: 45, y: 52 },
      }));
      for (const direction of ["left", "right"]) {
        const poses = new Set(), idlePoses = new Set();
        for (let phase = 0; phase < DOG_GAIT_FRAMES.length; phase++) {
          const html = renderDog(direction, phase);
          assert.ok(html.includes('class="dog-artwork"'));
          assert.equal(html.includes("scaleX(-1)"), direction === "right");
          const images = html.match(/<image [^>]+>/g) ?? [];
          assert.equal(images.length, 1, "Retain one stable original dog body");
          assert.ok(images[0].includes('href="/assets/character/portfolio-sprite-atlas.png"'));
          assert.ok(images[0].includes(`x="-392" y="${kind === "pomsky-black" ? -648 : -420}"`));
          const clip = html.match(/<clipPath id="([^"]+)"><path d="([^"]+)"/);
          assert.ok(clip && images[0].includes(`clip-path="url(#${clip[1]})"`), "Keep the body isolated from the atlas legs");
          assert.ok([...clip[2].matchAll(/V(\d+)/g)].every(([, y]) => Number(y) <= 154), "Keep the fur edge above the old paw artwork");
          const polygons = pixelPolygons(html);
          assert.equal(polygons.filter(({ fill }) => fill === "#171815").length, 4, "Give each dog four articulated paws");
          poses.add(JSON.stringify(polygons));
          idlePoses.add(JSON.stringify(pixelPolygons(renderDog(direction, phase, false))));
        }
        assert.equal(poses.size, 8, "Use distinct eight-phase side poses");
        assert.equal(idlePoses.size, 1, "Idle paws must not depend on the last gait phase");
      }
      for (const [direction, startColumn] of [["down", 0], ["up", 9]]) {
        for (let phase = 0; phase < DOG_GAIT_FRAMES.length; phase++) {
          const html = renderDog(direction, phase);
          assert.ok(!html.includes("dog-artwork") && !html.includes("<polygon"));
          assert.ok(html.includes(`--sprite-x:${(startColumn + DOG_GAIT_FRAMES[phase]) / 11 * 100}%`));
          assert.ok(html.includes(`--sprite-y:${kind === "pomsky-black" ? 100 : 50}%`));
        }
      }
    }
    window.location.search = "";
    const index = renderToStaticMarkup(createElement(App));
    assert.ok(index.includes('class="site-shell view-index"'));
    assert.ok(!index.includes('class="studio-map"'));
    assert.ok(index.includes("https://truco-ve.vercel.app/"));
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
    await server.close();
  }
});
