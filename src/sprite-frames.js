// Measured source origins in the existing 1536×1024 atlas. Each 128×288
// person crop keeps the foot baseline at y=272 and excludes adjacent frames.
export const personFrames = [
  { x: 8, y: 135 }, { x: 130, y: 135 }, { x: 255, y: 134 },
  { x: 389, y: 136 }, { x: 516, y: 137 }, { x: 637, y: 138 },
  { x: 766, y: 137 }, { x: 891, y: 142 }, { x: 1018, y: 138 },
  { x: 1156, y: 132 }, { x: 1280, y: 135 }, { x: 1401, y: 135 },
];

export const SIDE_WALK_DISTANCE = 4.2;
export const PERSON_WIDTH = 5.5; // Room-width percent; also sets the rendered sprite width.

// Keep each trouser leg intact; cutting this small atlas at the knee leaves
// visible seams. A separate shoe keeps the sole level throughout the step.
export function sideLegPose(distance, walking, far = false, stride = 1) {
  const amount = walking ? Math.max(0, Math.min(1, stride)) : 0;
  const cycle = ((distance / SIDE_WALK_DISTANCE) % 1 + 1) % 1;
  const phase = (cycle + (far ? 0.5 : 0)) % 1;
  const swing = Math.max(0, (phase - 0.5) * 2);
  const sourceHip = [63, 194];
  const sourceAnkle = [46, 258];
  const bodyY = amount * 2 * Math.sin(cycle * Math.PI * 2) ** 2;
  const hip = [far ? 72 : 63, sourceHip[1] + bodyY];
  // Match the ground covered during half a cycle to avoid skating at full pace.
  const reach = SIDE_WALK_DISTANCE * 128 / PERSON_WIDTH / 4;
  const travel = phase < 0.5 ? phase * 4 - 1 : Math.cos(swing * Math.PI);
  const ankle = [hip[0] + (far ? 3 : -3) + amount * reach * travel, sourceAnkle[1] - (far ? 3 : 0) - amount * 12 * Math.sin(swing * Math.PI) ** 2];
  const dx = ankle[0] - hip[0], dy = ankle[1] - hip[1];
  const leg = { origin: sourceHip, x: hip[0] - sourceHip[0], y: bodyY,
    angle: (Math.atan2(dy, dx) - Math.atan2(64, -17)) * 180 / Math.PI,
    scale: Math.hypot(dx, dy) / Math.hypot(17, 64) };
  return { bodyY, hip, ankle, foot: [ankle[0], ankle[1] + 14], leg, shoe: { origin: sourceAnkle, x: ankle[0] - sourceAnkle[0], y: ankle[1] - sourceAnkle[1], angle: 0, scale: 1 } };
}

// The rear atlas has two left-foot contacts, not a neutral middle frame.
// A fixed torso and mirrored planted-leg pixels give both feet an equal turn.
export function northLegPose(distance, walking, right = false, stride = 1) {
  const amount = walking ? Math.max(0, Math.min(1, stride)) : 0;
  const phase = distance / SIDE_WALK_DISTANCE * Math.PI * 2 + (right ? Math.PI : 0);
  const lift = amount * 20 * Math.max(0, Math.sin(phase)) ** 2;
  return { scaleY: 1 - lift / 82, lift };
}
