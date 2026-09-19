import { roomDistance } from "./studio-motion.js";

// Ground contact coordinates, separate from labels pinned onto the furniture.
export const stationApproaches = {
  "restaurant-menu-pos": { x: 19, y: 34, facing: "up" },
  "realtime-multiplayer-lab": { x: 16, y: 64, facing: "down" },
  arkollab: { x: 42, y: 34, facing: "up" },
  "cognitive-load-mvp": { x: 42, y: 67, facing: "down" },
  "circle-accuracy": { x: 75, y: 37, facing: "up" },
  "revature-architectures": { x: 81, y: 67, facing: "down" },
  "algorithms-lab": { x: 90, y: 35, facing: "up" },
  "truco-venezolano": { x: 29, y: 58, facing: "left" },
};

// Open loft floor plus the aisles around the furniture. Bounds are for feet,
// not the upright sprite, which naturally overlaps objects behind it.
export const walkableFloor = [
  [7, 33, 58, 35],
  [28, 33, 58, 69],
  [26, 51, 58, 62],
  [7, 62, 58, 66],
  [27, 64, 30, 93],
  [7, 91.5, 58, 93],
  [58, 37, 65, 61],
  [65, 35, 90, 67],
  [90, 35, 94, 43],
  [90, 59, 94, 67],
];

// Both dogs share an open, connected house, but choose their own routes and
// pauses. Keep their bodies farther from furniture than player foot contacts.
export const dogHouseGraph = {
  rugNorthWest: { x: 34, y: 40, links: ["rugNorth", "rugWest", "loungeNorth"] },
  rugNorth: { x: 45, y: 40, links: ["rugNorthWest", "rugNorthEast", "rugCenter"] },
  rugNorthEast: { x: 55, y: 40, links: ["rugNorth", "rugEast"] },
  rugWest: { x: 34, y: 49, links: ["rugNorthWest", "rugSouthWest", "rugCenter", "loungeEast"] },
  rugCenter: { x: 45, y: 49, links: ["rugNorth", "rugWest", "rugEast", "rugSouth"] },
  rugEast: { x: 55, y: 49, links: ["rugNorthEast", "rugCenter", "rugSouthEast", "doorwayWest"] },
  rugSouthWest: { x: 34, y: 58, links: ["rugWest", "rugSouth"] },
  rugSouth: { x: 45, y: 58, links: ["rugSouthWest", "rugCenter", "rugSouthEast"] },
  rugSouthEast: { x: 55, y: 58, links: ["rugSouth", "rugEast"] },
  loungeNorth: { x: 29, y: 40, links: ["rugNorthWest", "loungeEast"] },
  loungeEast: { x: 29, y: 49, links: ["loungeNorth", "rugWest", "loungeSouth"] },
  loungeSouth: { x: 29, y: 64, links: ["loungeEast", "loungeTurn"] },
  loungeTurn: { x: 16, y: 64, links: ["loungeSouth"] },
  doorwayWest: { x: 58, y: 49, links: ["rugEast", "doorwayEast"] },
  doorwayEast: { x: 65, y: 49, links: ["doorwayWest", "workshopEntry"] },
  workshopEntry: { x: 71, y: 49, links: ["doorwayEast", "workshopNorthWest", "workshopCenter", "workshopSouthWest"] },
  workshopNorthWest: { x: 71, y: 39, links: ["workshopEntry", "workshopNorth"] },
  workshopNorth: { x: 80, y: 39, links: ["workshopNorthWest", "workshopNorthEast", "workshopCenter"] },
  workshopNorthEast: { x: 88, y: 39, links: ["workshopNorth", "workshopEast"] },
  workshopCenter: { x: 80, y: 49, links: ["workshopEntry", "workshopNorth", "workshopEast", "workshopSouth"] },
  workshopEast: { x: 88, y: 49, links: ["workshopNorthEast", "workshopCenter", "workshopSouthEast"] },
  workshopSouthWest: { x: 71, y: 63, links: ["workshopEntry", "workshopSouth"] },
  workshopSouth: { x: 80, y: 63, links: ["workshopSouthWest", "workshopCenter", "workshopSouthEast"] },
  workshopSouthEast: { x: 88, y: 63, links: ["workshopSouth", "workshopEast"] },
};

export function canPlayerWalk({ x, y }) {
  const epsilon = 0.0000001; // Keep floating-point interpolation on a floor edge valid.
  return walkableFloor.some(([left, top, right, bottom]) => x >= left - epsilon && x <= right + epsilon && y >= top - epsilon && y <= bottom + epsilon);
}

export function isClearSegment(from, to) {
  if (Math.abs(from.x - to.x) > 0.0001 && Math.abs(from.y - to.y) > 0.0001) return false;
  const steps = Math.ceil(Math.max(Math.abs(to.x - from.x), Math.abs(to.y - from.y)) / 0.2);
  for (let step = 0; step <= steps; step += 1) {
    const fraction = steps ? step / steps : 0;
    if (!canPlayerWalk({ x: from.x + (to.x - from.x) * fraction, y: from.y + (to.y - from.y) * fraction })) return false;
  }
  return true;
}

// A small orthogonal visibility grid. Including the exact start lets keyboard
// movement interrupt a journey and still rejoin a safe route without snapping.
export function routePlayerTo(from, destination) {
  if (!canPlayerWalk(from) || !canPlayerWalk(destination)) return [];
  const xs = [...new Set([from.x, destination.x, ...walkableFloor.flatMap(([l, , r]) => [l, (l + r) / 2, r])])].sort((a, b) => a - b);
  const ys = [...new Set([from.y, destination.y, ...walkableFloor.flatMap(([, t, , b]) => [t, (t + b) / 2, b])])].sort((a, b) => a - b);
  const key = (x, y) => `${x}:${y}`;
  const nodes = new Map();
  for (const x of xs) for (const y of ys) if (canPlayerWalk({ x, y })) nodes.set(key(x, y), { x, y, links: [] });
  const join = (a, b) => {
    if (!a || !b || !isClearSegment(a, b)) return;
    a.links.push(b); b.links.push(a);
  };
  for (const x of xs) for (let i = 1; i < ys.length; i += 1) join(nodes.get(key(x, ys[i - 1])), nodes.get(key(x, ys[i])));
  for (const y of ys) for (let i = 1; i < xs.length; i += 1) join(nodes.get(key(xs[i - 1], y)), nodes.get(key(xs[i], y)));

  const start = nodes.get(key(from.x, from.y));
  const end = nodes.get(key(destination.x, destination.y));
  const distances = new Map([[start, 0]]);
  const previous = new Map();
  const pending = new Set([start]);
  while (pending.size) {
    const current = [...pending].reduce((best, node) => distances.get(node) < distances.get(best) ? node : best);
    pending.delete(current);
    if (current === end) break;
    for (const next of current.links) {
      const distance = distances.get(current) + roomDistance(current, next);
      if (distance < (distances.get(next) ?? Infinity)) {
        distances.set(next, distance); previous.set(next, current); pending.add(next);
      }
    }
  }
  if (!distances.has(end)) return [];
  const route = [];
  for (let node = end; node !== start; node = previous.get(node)) route.unshift({ x: node.x, y: node.y });
  // Collapse intermediate collinear nodes so the gait never pauses on a seam.
  for (let i = route.length - 2; i >= 0; i -= 1) {
    if (isClearSegment(i === 0 ? from : route[i - 1], route[i + 1])) route.splice(i, 1);
  }
  // Equal-length grid paths can alternate tiny horizontal/vertical steps.
  // Prefer the longest clear, single-corner leg for deliberate RPG turns.
  const simplified = [];
  let anchor = from;
  let index = 0;
  while (index < route.length) {
    let endIndex = index;
    let corner = null;
    for (let candidate = route.length - 1; candidate >= index; candidate -= 1) {
      const target = route[candidate];
      const corners = [{ x: target.x, y: anchor.y }, { x: anchor.x, y: target.y }];
      const clear = corners.find((point) => isClearSegment(anchor, point) && isClearSegment(point, target));
      if (clear) { endIndex = candidate; corner = clear; break; }
    }
    if (corner && roomDistance(anchor, corner) > 0.0001 && roomDistance(corner, route[endIndex]) > 0.0001) simplified.push(corner);
    simplified.push(route[endIndex]);
    anchor = route[endIndex];
    index = endIndex + 1;
  }
  return simplified;
}
