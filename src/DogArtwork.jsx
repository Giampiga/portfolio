import { DOG_GAIT_FRAMES, dogSideFrames } from "./sprite-frames.js";

export function DogArtwork({ kind, direction, gaitStep, walking }) {
  const frame = dogSideFrames[kind][walking ? DOG_GAIT_FRAMES[gaitStep] ?? 1 : 1];
  return <svg className="dog-artwork" viewBox="0 0 128 224" aria-hidden="true" style={{ transform: direction === "right" ? "scaleX(-1)" : undefined }}>
    <svg x="4" width="120" height="224" viewBox="4 0 120 224" overflow="hidden">
      <image href="/assets/character/portfolio-sprite-atlas.png" width="1536" height="1024" x={-frame.x} y={-frame.y} />
    </svg>
  </svg>;
}
