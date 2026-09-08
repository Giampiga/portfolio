// Measured source origins in the existing 1536×1024 atlas. Each 128×288
// person crop keeps the foot baseline at y=272 and excludes adjacent frames.
export const personFrames = [
  { x: 8, y: 135 }, { x: 130, y: 135 }, { x: 255, y: 134 },
  { x: 389, y: 136 }, { x: 516, y: 137 }, { x: 637, y: 138 },
  { x: 766, y: 137 }, { x: 891, y: 142 }, { x: 1018, y: 138 },
  { x: 1156, y: 132 }, { x: 1280, y: 135 }, { x: 1401, y: 135 },
];

// Side views in the atlas repeat an open stride. Articulate those same pixels
// around the hips so each foot passes under the body instead of shuffling.
export function sideLegPose(distance, walking, far = false) {
  const phase = distance / 5.8 * Math.PI * 2 + (far ? Math.PI : 0);
  const angle = (far ? 13 : -12) + (walking ? Math.sin(phase) * 20 : 0);
  const radians = angle * Math.PI / 180;
  const hip = far ? [83, 194] : [63, 192];
  const contact = far ? [99.5, 265] : [46, 272];
  const ground = hip[1] + (contact[0] - hip[0]) * Math.sin(radians) + (contact[1] - hip[1]) * Math.cos(radians);
  const lift = walking ? Math.max(0, Math.cos(phase)) * 5 : 0;
  return { angle, offset: 272 - ground - lift, hip };
}
