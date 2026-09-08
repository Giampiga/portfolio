import { roomDistance } from "./studio-motion.js";

// Ground contact coordinates, separate from labels pinned onto the furniture.
export const stationApproaches = {
  "restaurant-menu-pos": { x: 26, y: 46, facing: "left" },
  "realtime-multiplayer-lab": { x: 26, y: 70, facing: "left" },
  arkollab: { x: 56, y: 65, facing: "left" },
  "cognitive-load-mvp": { x: 56, y: 85, facing: "left" },
  "circle-accuracy": { x: 72, y: 46.5, facing: "up" },
  "revature-architectures": { x: 81.25, y: 64, facing: "left" },
  "algorithms-lab": { x: 81.25, y: 58, facing: "right" },
};

// Connected floor strips around the existing, painted furniture. Bounds are
// for feet, not the full upright sprite (which can overlap objects behind it).
export const walkableFloor = [
  [25, 29, 27.5, 85],
  [26, 28.5, 56, 32],
  [26, 49.5, 56, 54],
  [51, 29, 58.2, 51],
  [53, 49.5, 58.2, 87],
  [56, 57, 65.5, 60.3],
  [64.4, 46.5, 81.25, 52],
  [64.4, 49, 65.5, 60.3],
  [79.5, 49, 83, 76],
  [65.5, 75, 81.25, 76],
  [65.5, 75, 76, 83],
];

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
