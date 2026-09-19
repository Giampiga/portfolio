import { useId } from "react";
import { dogSidePose, pixelContour as points } from "./sprite-frames.js";

function Paw({ step, walking, rear, far, black }) {
  const { travel, lift } = dogSidePose(step, walking, (rear ? 2 : 0) + (far ? 4 : 0));
  const hip = (rear ? 94 : 48) + (far ? 4 : 0);
  const knee = hip + travel * (rear ? 0.6 : 0.35);
  const ankle = hip + travel;
  const ground = 190 - lift - (far ? 4 : 0);
  const bend = 168 - lift / 2;
  const fur = black ? (far ? "#a77b4c" : "#d5a36d") : (far ? "#aaa58e" : "#e6dfc4");
  return <g>
    <polygon fill="#171815" points={points([[hip - 8, 140], [hip + 8, 140], [knee + 8, bend], [ankle + 8, ground - 8], [ankle + 8, ground], [ankle - 12, ground], [ankle - 12, ground - 8], [knee - 8, bend]])} />
    <polygon fill={black || rear ? "#34332e" : fur} points={points([[hip - 4, 144], [hip + 4, 144], [knee + 4, bend], [ankle + 4, ground - 4], [ankle - 8, ground - 4], [knee - 4, bend]])} />
    <polygon fill={fur} points={points([[knee - 4, bend], [knee + 4, bend], [ankle + 4, ground - 4], [ankle - 8, ground - 4], [ankle - 8, ground - 8]])} />
  </g>;
}

export function DogArtwork({ kind, direction, gaitStep, walking }) {
  const id = useId().replaceAll(":", "");
  const black = kind === "pomsky-black";
  return <svg className="dog-artwork" viewBox="0 0 128 224" aria-hidden="true" shapeRendering="crispEdges" style={{ transform: direction === "right" ? "scaleX(-1)" : undefined }}>
    <defs><clipPath id={`${id}-dog-body`}><path d="M0 0H128V144H116V148H108V152H96V148H76V144H60V148H48V152H36V144H0Z" /></clipPath></defs>
    <Paw step={gaitStep} walking={walking} rear far black={black} />
    <Paw step={gaitStep} walking={walking} far black={black} />
    <Paw step={gaitStep} walking={walking} rear black={black} />
    <Paw step={gaitStep} walking={walking} black={black} />
    <image href="/assets/character/portfolio-sprite-atlas.png" width="1536" height="1024" x="-392" y={black ? -648 : -420} clipPath={`url(#${id}-dog-body)`} />
  </svg>;
}
