// Measured source origins in the existing 1536×1024 atlas. Each 128×288
// person crop keeps the foot baseline at y=272 and excludes adjacent frames.
export const personFrames = [
  { x: 8, y: 135 }, { x: 130, y: 135 }, { x: 255, y: 134 },
  { x: 389, y: 136 }, { x: 516, y: 137 }, { x: 637, y: 138 },
  { x: 766, y: 137 }, { x: 891, y: 142 }, { x: 1018, y: 138 },
  { x: 1156, y: 132 }, { x: 1280, y: 135 }, { x: 1401, y: 135 },
];

export const SIDE_WALK_DISTANCE = 5.2;
export const PERSON_WIDTH = 5.5; // Room-width percent; also sets the rendered sprite width.

// Step fabric and fur contours on the same source-pixel grid as the atlas.
export const pixelContour = (values) => {
  const corners = values.map((point) => point.map((value) => Math.round(value / 4) * 4));
  return corners.flatMap(([x, y], index) => {
    const [endX, endY] = corners[(index + 1) % corners.length];
    const steps = Math.max(1, Math.abs(endX - x) / 4, Math.abs(endY - y) / 4);
    return Array.from({ length: steps }, (_, step) => {
      const nextX = x + Math.round((endX - x) * (step + 1) / steps / 4) * 4;
      const nextY = y + Math.round((endY - y) * (step + 1) / steps / 4) * 4;
      const previousY = y + Math.round((endY - y) * step / steps / 4) * 4;
      return `${nextX},${previousY} ${nextX},${nextY}`;
    });
  }).join(" ");
};

export const DOG_GAIT_FRAMES = [0, 0, 1, 1, 2, 2, 1, 1];
export const DOG_SIDE_STEP_DISTANCE = 44 / 128 * 4.7 / 4;
export function dogSidePose(step, walking, offset = 0) {
  const phase = ((step + offset) % 8 + 8) % 8;
  return {
    travel: walking ? [-22, -11, 0, 11, 22, 16, 0, -16][phase] : 0,
    lift: walking ? [0, 0, 0, 0, 0, 8, 12, 8][phase] : 0,
  };
}

// Contact, recoil, passing and reach. The lower body is drawn in each pose,
// rather than stretching one diagonal trouser crop through the whole cycle.
const SIDE_KNEES = [[-13, 0], [-9, 2], [1, 0], [13, -2], [16, -2], [17, -6], [1, -10], [-17, -4]];
const samplePose = (poses, cycle) => {
  const offset = cycle * poses.length;
  const index = Math.floor(offset), mix = offset - index;
  return poses[index].map((value, axis) => value + (poses[(index + 1) % poses.length][axis] - value) * mix);
};

export function authoredWalkPose(distance, walking, opposite = false, stride = 1) {
  const amount = walking ? Math.max(0, Math.min(1, stride)) : 0;
  const cycle = ((distance / SIDE_WALK_DISTANCE) % 1 + 1) % 1;
  const phase = (cycle + (opposite ? 0.5 : 0)) % 1;
  const swing = Math.max(0, (phase - 0.5) * 2);
  const travel = phase < 0.5 ? phase * 4 - 1 : 8 * swing ** 3 - 12 * swing ** 2 + 2 * swing + 1;
  const reach = SIDE_WALK_DISTANCE * 128 / PERSON_WIDTH / 4;
  const [kneeX, kneeY] = samplePose(SIDE_KNEES, phase);
  const lift = amount * 12 * Math.sin(swing * Math.PI) ** 2;
  return {
    phase,
    hip: [opposite ? 70 : 62, 190],
    knee: [(opposite ? 70 : 62) + amount * kneeX, 226 + amount * kneeY],
    ankle: [(opposite ? 70 : 62) + amount * reach * travel, 258 - (opposite ? 3 : 0) - lift],
    lift,
    // Retain the original jacket/cuff poses and hold the original head still.
    torsoFrame: amount < 0.15 ? 3 : [3, 3, 4, 5, 5, 5, 4, 3][Math.floor(cycle * 8)],
    arm: -amount * travel,
  };
}
