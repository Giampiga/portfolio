import test from "node:test";
import assert from "node:assert/strict";
import { advancePlayer, createPlayerState, integrateSpeed, PLAYER_SPEED, PLAYER_ACCELERATION, PLAYER_BRAKING, PLAYER_TURN_SPEED, roomDistance, walkingFrame, WALK_FRAME_DISTANCE } from "../src/studio-motion.js";
import { canPlayerWalk, isClearSegment, routePlayerTo, stationApproaches, walkableFloor } from "../src/studio-navigation.js";
import { primaryProjects } from "../src/projects.js";
import { personFrames, sideLegPose } from "../src/sprite-frames.js";

test("side legs alternate, loop without a seam, and keep contact at floor height", () => {
  for (const far of [false, true]) {
    assert.deepEqual(sideLegPose(0, false, far), sideLegPose(50, false, far));
    approximately(sideLegPose(0, true, far).angle, sideLegPose(5.8, true, far).angle);
    for (let distance = 0; distance < 5.8; distance += 0.1) {
      const { angle, offset, hip } = sideLegPose(distance, true, far);
      const contact = far ? [99.5, 265] : [46, 272];
      const radians = angle * Math.PI / 180;
      const ground = hip[1] + (contact[0] - hip[0]) * Math.sin(radians) + (contact[1] - hip[1]) * Math.cos(radians) + offset;
      assert.ok(ground >= 267 - 1e-8 && ground <= 272 + 1e-8);
    }
  }
  assert.ok(sideLegPose(1.45, true).angle > sideLegPose(4.35, true).angle);
  assert.ok(sideLegPose(1.45, true, true).angle < sideLegPose(4.35, true, true).angle);
});

test("the dogs' room-to-room corridor clears the furniture in both directions", () => {
  const corridor = [{ x: 56, y: 48.5 }, { x: 56, y: 58.5 }, { x: 65, y: 58.5 }, { x: 65, y: 49 }, { x: 68, y: 49 }];
  for (let i = 1; i < corridor.length; i += 1) {
    assert.ok(isClearSegment(corridor[i - 1], corridor[i]));
    assert.ok(isClearSegment(corridor[i], corridor[i - 1]));
  }
});

const approximately = (actual, expected) => assert.ok(Math.abs(actual - expected) < 0.00001, `${actual} != ${expected}`);
const firstSecondDistance = PLAYER_SPEED - PLAYER_SPEED ** 2 / (2 * PLAYER_ACCELERATION);
const simulate = (hz, direction, aspect = 0.78) => {
  let state = createPlayerState();
  for (let i = 0; i < hz; i += 1) state = advancePlayer(state, 1000 / hz, { direction, aspect });
  return state;
};

test("held-key movement is independent of display refresh rate", () => {
  for (const hz of [30, 60, 90, 120, 144]) {
    const state = simulate(hz, "right");
    approximately(state.position.x, 45 + firstSecondDistance);
    approximately(state.distance, firstSecondDistance);
    approximately(state.speed, PLAYER_SPEED);
    assert.equal(state.walking, true);
  }
});

test("all four directions move at equal screen speed at different room shapes", () => {
  for (const aspect of [0.5, 0.78, 1, 1.4]) {
    for (const direction of ["left", "right", "up", "down"]) {
      const state = simulate(60, direction, aspect);
      approximately(roomDistance(createPlayerState().position, state.position, aspect), firstSecondDistance);
      assert.equal(state.direction, direction);
    }
  }
});

test("idle and blocked movement stop the feet; a blocked step does not advance gait", () => {
  const state = createPlayerState();
  assert.equal(advancePlayer(state, 16).walking, false);
  const blocked = advancePlayer(state, 16, { direction: "up", canWalk: () => false });
  assert.equal(blocked.walking, false);
  assert.equal(blocked.distance, 0);
  assert.deepEqual(blocked.position, state.position);
  assert.equal(blocked.direction, "up");
});

test("walk frames advance with distance, not a competing wall-clock animation", () => {
  assert.deepEqual([0, 1, 2, 3, 4].map((n) => walkingFrame((n + 0.1) * WALK_FRAME_DISTANCE, true)), [0, 1, 2, 1, 0]);
  assert.equal(walkingFrame(200, false), 1);
});

test("long suspended frames cannot teleport through the room", () => {
  const state = advancePlayer(createPlayerState(), 60000, { direction: "right" });
  approximately(state.distance, integrateSpeed(0, PLAYER_SPEED, 0.05).distance);
  assert.ok(state.distance <= PLAYER_SPEED * 0.05);
});

test("acceleration builds over roughly 110ms instead of jumping to full speed", () => {
  let state = createPlayerState();
  const speeds = [];
  for (let i = 0; i < 8; i += 1) {
    state = advancePlayer(state, 1000 / 60, { direction: "right" });
    speeds.push(state.speed);
  }
  assert.ok(speeds[0] > 0 && speeds[0] < PLAYER_SPEED / 4);
  for (let i = 1; i < speeds.length; i += 1) assert.ok(speeds[i] >= speeds[i - 1]);
  approximately(speeds.at(-1), PLAYER_SPEED);
});

test("release brakes within 60ms and less than half a room-width percent", () => {
  for (const hz of [30, 60, 120, 144]) {
    let state = simulate(hz, "right");
    const initial = state;
    let frames = 0;
    while (state.speed > 0.0001 && frames < 30) {
      const next = advancePlayer(state, 1000 / hz);
      assert.ok(next.speed <= state.speed);
      state = next; frames += 1;
    }
    const stoppingDistance = PLAYER_SPEED ** 2 / (2 * PLAYER_BRAKING);
    approximately(state.distance - initial.distance, stoppingDistance);
    assert.ok(stoppingDistance < 0.5);
    assert.ok(frames / hz <= 0.06 + 1 / hz);
    assert.equal(state.walking, false);
    assert.equal(state.speed, 0);
  }
});

test("reversing remains responsive and never coasts in the previous direction", () => {
  const moving = simulate(60, "right");
  const turned = advancePlayer(moving, 1000 / 60, { direction: "left" });
  assert.ok(turned.position.x < moving.position.x);
  assert.equal(turned.position.y, moving.position.y);
  assert.equal(turned.direction, "left");
  assert.ok(turned.speed >= PLAYER_TURN_SPEED && turned.speed < PLAYER_SPEED);
});

test("a blocked coasting step stops immediately without advancing the gait", () => {
  const moving = simulate(60, "right");
  const stopped = advancePlayer(moving, 1000 / 60, { canWalk: () => false });
  assert.deepEqual(stopped.position, moving.position);
  assert.equal(stopped.speed, 0);
  assert.equal(stopped.walking, false);
  assert.equal(stopped.distance, moving.distance);
});

test("station travel eases into its destination without overshooting", () => {
  let state = { ...createPlayerState(), route: [{ x: 60, y: 52 }] };
  let slowedNearEnd = false;
  for (let i = 0; i < 200 && state.route.length; i += 1) {
    state = advancePlayer(state, 1000 / 60);
    assert.ok(state.position.x <= 60);
    if (state.position.x > 59.5 && state.route.length && state.speed < PLAYER_SPEED) slowedNearEnd = true;
  }
  assert.equal(slowedNearEnd, true);
  approximately(state.position.x, 60);
  assert.equal(state.speed, 0);
  assert.equal(state.walking, false);
});

test("every project has a valid, distinct ground-level approach point", () => {
  assert.deepEqual(Object.keys(stationApproaches).sort(), primaryProjects.map((p) => p.id).sort());
  for (const project of primaryProjects) {
    assert.equal(canPlayerWalk(stationApproaches[project.id]), true);
    assert.notDeepEqual(stationApproaches[project.id], project.station);
  }
});

test("every station-to-station trip is continuous, orthogonal and floor-safe", () => {
  const points = [createPlayerState().position, ...Object.values(stationApproaches)];
  for (const from of points) for (const target of points) {
    if (from === target) continue;
    const route = routePlayerTo(from, target);
    assert.ok(route.length, `Missing route ${JSON.stringify(from)} → ${JSON.stringify(target)}`);
    let previous = from;
    for (const waypoint of route) {
      assert.equal(isClearSegment(previous, waypoint), true);
      previous = waypoint;
    }
    let state = { ...createPlayerState(from), route };
    for (let i = 0; i < 1400 && state.route.length; i += 1) {
      state = advancePlayer(state, 1000 / 60, { canWalk: canPlayerWalk });
      assert.equal(canPlayerWalk(state.position), true);
    }
    approximately(state.position.x, target.x);
    approximately(state.position.y, target.y);
    assert.equal(state.route.length, 0);
  }
});

test("manual movement interrupts travel, and an arbitrary floor position can rejoin", () => {
  const state = { ...createPlayerState(), route: routePlayerTo(createPlayerState().position, stationApproaches.arkollab) };
  const manual = advancePlayer(state, 16, { direction: "left", canWalk: canPlayerWalk });
  assert.deepEqual(manual.route, []);
  const destinations = Object.values(stationApproaches);
  for (const [l, t, r, b] of walkableFloor) {
    const from = { x: l + (r - l) * 0.31, y: t + (b - t) * 0.67 };
    for (const target of destinations) assert.ok(routePlayerTo(from, target).length);
  }
});

test("furniture and outside-room points are not walkable", () => {
  for (const point of [{ x: 42, y: 41 }, { x: 45, y: 65 }, { x: 76, y: 62 }, { x: 87, y: 58 }, { x: 70, y: 20 }, { x: 0, y: 0 }, { x: 31, y: 65 }, { x: 29, y: 81 }, { x: 20, y: 89 }, { x: 66.5, y: 59 }, { x: 80, y: 82 }, { x: 57, y: 90.5 }]) assert.equal(canPlayerWalk(point), false, JSON.stringify(point));
  assert.deepEqual(routePlayerTo(createPlayerState().position, { x: 42, y: 41 }), []);
});

test("all existing person frames have a consistent 272px foot anchor and isolated source crop", () => {
  const bounds = [[11,155,124,407],[135,156,253,407],[261,155,377,406],[400,155,515,408],[525,155,631,409],[648,154,757,410],[771,152,888,409],[895,152,1009,414],[1023,152,1137,410],[1167,155,1273,404],[1291,155,1396,407],[1410,155,1518,407]];
  assert.equal(personFrames.length, 12);
  personFrames.forEach(({ x, y }, index) => {
    const [left, top, right, foot] = bounds[index];
    assert.ok(left >= x && right < x + 128 && top >= y && foot < y + 288);
    assert.equal(foot - y, 272);
    assert.ok(y + 288 < 435, "Person crop must not expose the dog row");
  });
});
