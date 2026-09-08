// Positions use percentages of the room. Distances use room-width units so
// vertical and horizontal movement cover the same screen distance per second.
export const PLAYER_SPEED = 12.5;
export const PLAYER_ACCELERATION = 110;
export const PLAYER_BRAKING = 210;
export const PLAYER_TURN_SPEED = 8;
export const WALK_FRAME_DISTANCE = 1.45;
export const WALK_CYCLE = [0, 1, 2, 1];
export const PLAYER_START = { x: 45, y: 52 };
export const DIRECTION_VECTORS = {
  down: { x: 0, y: 1 }, left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }, up: { x: 0, y: -1 },
};

export function roomDistance(a, b, aspect = 0.78) {
  return Math.hypot(b.x - a.x, (b.y - a.y) * aspect);
}

export function facingBetween(from, to) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up");
}

export function walkingFrame(distance, walking) {
  return walking ? WALK_CYCLE[Math.floor(distance / WALK_FRAME_DISTANCE) % WALK_CYCLE.length] : 1;
}

export function createPlayerState(position = PLAYER_START) {
  return { position: { ...position }, direction: "down", distance: 0, speed: 0, walking: false, route: [] };
}

// Integrate the ramp exactly, including the part of a frame after reaching the
// target. This keeps the feel consistent on 60Hz and high-refresh displays.
export function integrateSpeed(initial, target, deltaSeconds) {
  const rate = target > initial ? PLAYER_ACCELERATION : PLAYER_BRAKING;
  const rampTime = Math.min(deltaSeconds, Math.abs(target - initial) / rate);
  const speed = rampTime < deltaSeconds ? target : Math.max(0, initial + Math.sign(target - initial) * rate * rampTime);
  return { speed, distance: (initial + speed) * rampTime / 2 + speed * (deltaSeconds - rampTime) };
}

function stepPlayer(state, deltaMs, { direction, aspect = 0.78, canWalk = () => true } = {}) {
  const dt = deltaMs / 1000;
  let position = { ...state.position };
  let facing = state.direction;
  let traveled = 0;
  let route = direction ? [] : [...state.route];
  let speed = state.speed ?? 0;
  let targetSpeed = direction || route.length ? PLAYER_SPEED : 0;

  // Turns respond immediately to the new key instead of drifting diagonally.
  // A short re-acceleration makes the change of footing feel deliberate.
  const requestedDirection = direction ?? (route.length ? facingBetween(position, route[0]) : state.direction);
  if (requestedDirection !== state.direction) speed = Math.min(speed, PLAYER_TURN_SPEED);
  if (!direction && route.length) {
    const endSpeed = route.length > 1 ? PLAYER_TURN_SPEED : 0;
    targetSpeed = Math.min(PLAYER_SPEED, Math.sqrt(endSpeed ** 2 + 2 * PLAYER_BRAKING * roomDistance(position, route[0], aspect)));
  }
  const integrated = integrateSpeed(speed, targetSpeed, dt);
  const budget = integrated.distance;
  speed = integrated.speed;

  if (direction || !route.length) {
    const vector = DIRECTION_VECTORS[direction ?? facing];
    facing = direction ?? facing;
    const target = { x: position.x + vector.x * budget, y: position.y + vector.y * budget / aspect };
    if (canWalk(target)) {
      traveled = roomDistance(position, target, aspect);
      position = target;
    } else speed = 0;
  } else {
    let remaining = budget;
    while (route.length && remaining > 0) {
      const target = route[0];
      const length = roomDistance(position, target, aspect);
      if (length < 0.0001) { route.shift(); continue; }
      facing = facingBetween(position, target);
      const step = Math.min(length, remaining);
      const next = { x: position.x + (target.x - position.x) * step / length, y: position.y + (target.y - position.y) * step / length };
      if (!canWalk(next)) { route = []; speed = 0; break; }
      position = next;
      traveled += step;
      remaining -= step;
      if (step === length) {
        route.shift();
        speed = route.length ? Math.min(speed, PLAYER_TURN_SPEED) : 0;
      }
    }
    if (!route.length) speed = 0;
  }

  return { position, direction: facing, speed, distance: state.distance + traveled, walking: traveled > 0.0001 && speed > 0.0001, route };
}

export function advancePlayer(state, deltaMs, options = {}) {
  // Substeps keep a low-refresh display from stepping across the whole narrow
  // braking zone. They also bound collision checks to less than half a pixel.
  let remaining = Math.min(Math.max(deltaMs, 0), 50);
  let next = state;
  while (remaining > 0.00001) {
    const step = Math.min(remaining, 1000 / 240);
    next = stepPlayer(next, step, options);
    remaining -= step;
  }
  return next;
}
