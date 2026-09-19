import test from "node:test";
import assert from "node:assert/strict";
import { advancePlayer, createPlayerState, integrateSpeed, PLAYER_SPEED, PLAYER_ACCELERATION, PLAYER_BRAKING, PLAYER_TURN_SPEED, roomDistance, walkingFrame, WALK_FRAME_DISTANCE } from "../src/studio-motion.js";
import { canPlayerWalk, dogHouseGraph, isClearSegment, routePlayerTo, stationApproaches, walkableFloor } from "../src/studio-navigation.js";
import { primaryProjects } from "../src/projects.js";
import { personFrames, PERSON_WIDTH, SIDE_WALK_DISTANCE, authoredWalkPose, DOG_GAIT_FRAMES, DOG_SIDE_STEP_DISTANCE, dogSidePose } from "../src/sprite-frames.js";

test("dog side paws stay planted through stance, lift on recovery and wrap without an idle twitch", () => {
  assert.equal(DOG_GAIT_FRAMES.length, 8);
  assert.ok(DOG_GAIT_FRAMES.every((frame) => [0, 1, 2].includes(frame)));
  for (let step = 0; step < 8; step++) {
    const pose = dogSidePose(step, true);
    assert.equal(pose.lift > 0, step > 4);
    if (step > 0 && step <= 4) {
      assert.equal(pose.travel - dogSidePose(step - 1, true).travel, 11);
      approximately(-step * DOG_SIDE_STEP_DISTANCE + pose.travel / 128 * 4.7, dogSidePose(0, true).travel / 128 * 4.7);
    }
    for (const offset of [0, 2, 4, 6]) {
      assert.deepEqual(dogSidePose(step, true, offset), dogSidePose(step + offset, true));
      assert.deepEqual(dogSidePose(step, true, offset), dogSidePose(step + 8, true, offset));
      assert.deepEqual(dogSidePose(step, true, offset), dogSidePose(step - 8, true, offset));
      assert.deepEqual(dogSidePose(step, false, offset), { travel: 0, lift: 0 });
    }
  }
});

test("authored walk keeps contact feet planted, opposite recovery and a level foot anchor", () => {
  const samePoint = (a, b) => a.forEach((value, i) => approximately(value, b[i]));
  for (const far of [false, true]) {
    for (const property of ["hip", "knee", "ankle"]) {
      samePoint(authoredWalkPose(0, false, far)[property], authoredWalkPose(50, false, far)[property]);
      samePoint(authoredWalkPose(0, true, far)[property], authoredWalkPose(SIDE_WALK_DISTANCE, true, far)[property]);
    }
    for (const stride of [0, 0.25, 0.5, 1]) {
      for (let distance = 0; distance < SIDE_WALK_DISTANCE; distance += 0.04) {
        const pose = authoredWalkPose(distance, true, far, stride);
        assert.equal(pose.hip[1], 190);
        assert.ok(pose.knee[1] >= 216 && pose.knee[1] <= 228);
        assert.ok(pose.ankle[1] + 14 <= 272 - (far ? 3 : 0));
        assert.ok(pose.lift >= 0 && pose.lift <= 12);
        assert.ok([3, 4, 5].includes(pose.torsoFrame));
        approximately(pose.lift, authoredWalkPose(distance + SIDE_WALK_DISTANCE / 2, true, !far, stride).lift);
      }
    }
    const start = (far ? 0.6 : 0.1) * SIDE_WALK_DISTANCE;
    const end = start + SIDE_WALK_DISTANCE * 0.2;
    const plantedX = (distance) => -distance + authoredWalkPose(distance, true, far).ankle[0] / 128 * PERSON_WIDTH;
    approximately(plantedX(start), plantedX(end));
    for (const contact of [0, 0.5, 1]) {
      const distance = contact * SIDE_WALK_DISTANCE, epsilon = 0.00001;
      const before = authoredWalkPose(distance - epsilon, true, far).ankle;
      const at = authoredWalkPose(distance, true, far).ankle;
      const after = authoredWalkPose(distance + epsilon, true, far).ankle;
      for (let axis = 0; axis < 2; axis += 1) assert.ok(Math.abs((at[axis] - before[axis]) / epsilon - (after[axis] - at[axis]) / epsilon) < 0.01);
    }
    assert.deepEqual(authoredWalkPose(2, true, far, 0), authoredWalkPose(2, false, far));
  }
  approximately(authoredWalkPose(0, true).ankle[1] + 14, 272);
  assert.ok(authoredWalkPose(SIDE_WALK_DISTANCE * 0.75, true).ankle[1] + 14 < 272);
  approximately(authoredWalkPose(SIDE_WALK_DISTANCE * 0.75, true, true).ankle[1] + 14, 269);
});

test("jacket poses oppose the leg and passing knees bend without stretching the sprite", () => {
  const contact = authoredWalkPose(0, true);
  const reverse = authoredWalkPose(SIDE_WALK_DISTANCE / 2, true);
  const passing = authoredWalkPose(SIDE_WALK_DISTANCE * 0.75, true);
  assert.equal(contact.torsoFrame, 3);
  assert.equal(reverse.torsoFrame, 5);
  assert.ok(contact.ankle[0] < contact.hip[0] && contact.arm > 0);
  assert.ok(reverse.ankle[0] > reverse.hip[0] && reverse.arm < 0);
  assert.ok(passing.knee[1] < contact.knee[1]);
  assert.equal(authoredWalkPose(2, false).torsoFrame, 3);
});

test("both dogs can explore the loft and every route clears furniture in both directions", () => {
  const reached = new Set(), pending = ["rugNorthWest"];
  while (pending.length) {
    const name = pending.pop();
    if (reached.has(name)) continue;
    reached.add(name);
    const from = dogHouseGraph[name];
    for (const link of from.links) {
      const to = dogHouseGraph[link];
      assert.ok(to?.links.includes(name), `${name} ↔ ${link}`);
      for (const [dx, dy] of [[0, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]]) {
        assert.ok(isClearSegment({ x: from.x + dx, y: from.y + dy }, { x: to.x + dx, y: to.y + dy }), `${name} → ${link}`);
      }
      pending.push(link);
    }
  }
  assert.equal(reached.size, Object.keys(dogHouseGraph).length);
  assert.ok(reached.has("rugSouthWest") && reached.has("workshopSouthEast"));
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

test("acceleration builds over roughly 100ms instead of jumping to full speed", () => {
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
  for (const point of [{ x: 19, y: 23 }, { x: 42, y: 23 }, { x: 18, y: 43 }, { x: 17, y: 55 }, { x: 16, y: 81 }, { x: 42, y: 82 }, { x: 75, y: 24 }, { x: 90, y: 23 }, { x: 93, y: 50 }, { x: 81, y: 82 }, { x: 62, y: 28 }, { x: 62, y: 75 }, { x: 0, y: 0 }, { x: 97, y: 97 }]) assert.equal(canPlayerWalk(point), false, JSON.stringify(point));
  assert.deepEqual(routePlayerTo(createPlayerState().position, { x: 18, y: 43 }), []);
});

test("the open living floor and wide workshop passage have no invisible corridor walls", () => {
  for (const [left, top, right, bottom] of [[31.5, 35, 58, 68], [58, 37, 65, 61], [65, 35, 89, 67]]) {
    for (let x = left; x <= right; x += 1) {
      for (let y = top; y <= bottom; y += 1) assert.ok(canPlayerWalk({ x, y }), `${x}, ${y}`);
    }
  }
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
