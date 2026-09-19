import { useId } from "react";
import { authoredWalkPose, personFrames, pixelContour as points } from "./sprite-frames.js";

const atlas = "/assets/character/portfolio-sprite-atlas.png";
const pixel = (value) => Math.round(value / 2) * 2;

function SideLeg({ pose, far }) {
  const [hx, hy] = pose.hip, [kx, ky] = pose.knee, [ax, ay] = pose.ankle;
  return <g>
    <polygon fill="#141418" points={points([[hx - 18, hy], [hx + 18, hy], [kx + 17, ky - 4], [ax + 16, ay + 3], [ax - 18, ay + 3], [kx - 17, ky + 4]])} />
    <polygon fill={far ? "#25252d" : "#30303a"} points={points([[hx - 12, hy + 2], [hx + 12, hy + 2], [kx + 11, ky], [ax + 10, ay], [ax - 12, ay], [kx - 11, ky]])} />
    {!far && <polygon fill="#3a3a43" points={points([[hx - 12, hy + 4], [hx - 6, hy + 4], [kx - 5, ky], [ax - 5, ay - 3], [ax - 11, ay - 3], [kx - 11, ky]])} />}
    {!far && <polygon fill="#25252d" points={points([[kx - 8, ky], [kx + 8, ky + 4], [kx + 4, ky + 8], [kx - 8, ky + 4]])} />}
    <g transform={`translate(${pixel(ax)} ${pixel(ay)})`}>
      <path fill="#111216" d="M-12 0H10V10H6V14H-24V10H-28V4H-20V-2H-12Z" />
      <path fill="#ddd5bc" d="M-24 5H-18V9H6V12H-24ZM-19 1H-13V5H-19Z" />
      <path fill="#69675e" d="M-24 12H5V14H-24Z" />
      <path fill="#ad4c37" d="M5 1H10V8H5Z" />
      <path fill="#ede5ce" d="M-12 1H-3V4H-12Z" />
    </g>
  </g>;
}

function RearLeg({ pose, right }) {
  const x = right ? 79 : 47;
  const lift = pixel(pose.lift);
  const kneeX = x + pixel(pose.arm * (right ? -2 : 2));
  return <g>
    <polygon fill="#141418" points={points([[x - 14, 190], [x + 14, 190], [kneeX + 12, 226], [x + 11, 260 - lift], [x - 11, 260 - lift], [kneeX - 12, 226]])} />
    <polygon fill="#30303a" points={points([[x - 9, 193], [x + 8, 193], [kneeX + 7, 227], [x + 6, 258 - lift], [x - 6, 258 - lift], [kneeX - 8, 227]])} />
    <polygon fill="#3a3a43" points={points([[x - 8, 196], [x - 3, 196], [kneeX - 3, 224], [kneeX - 8, 224]])} />
    <polygon fill="#25252d" points={points([[kneeX - 8, 228], [kneeX + 4, 228], [kneeX + 4, 232], [kneeX - 8, 232]])} />
    <g transform={`translate(${x} ${258 - lift})`}>
      <path fill="#111216" d="M-11-2H10V3H13V14H-13V3H-11Z" />
      <path fill="#ba513c" d="M-8 0H7V5H-8Z" />
      <path fill="#e3dcc4" d="M-9 6H8V10H10V12H-11V10H-9Z" />
    </g>
  </g>;
}

export function PlayerArtwork({ direction, distance, walking, stride = 1 }) {
  const id = useId().replaceAll(":", "");
  const rear = direction === "up";
  const near = authoredWalkPose(distance, walking, false, stride);
  const far = authoredWalkPose(distance, walking, true, stride);
  const headCrop = personFrames[rear ? 9 : 3];
  const torsoCrop = personFrames[rear ? 9 : near.torsoFrame];
  return <svg className="player-artwork" viewBox="0 0 128 288" aria-hidden="true" shapeRendering="crispEdges" style={{ transform: direction === "right" ? "scaleX(-1)" : undefined }}>
    <defs>
      <clipPath id={`${id}-head`}><rect width="128" height="125" /></clipPath>
      <clipPath id={`${id}-torso`}><rect x={rear ? 30 : 0} y="123" width={rear ? 68 : 128} height="73" /></clipPath>
      {rear && <><clipPath id={`${id}-arm-left`}><rect y="123" width="34" height="73" /></clipPath><clipPath id={`${id}-arm-right`}><rect x="94" y="123" width="34" height="73" /></clipPath></>}
    </defs>
    {rear ? <><RearLeg pose={near} /><RearLeg pose={far} right /></> : <><SideLeg pose={far} far /><SideLeg pose={near} /></>}
    {rear && [near, far].map((pose, index) => <g key={index} transform={`translate(0 ${pixel(pose.arm * 4)})`}><image href={atlas} width="1536" height="1024" x={-headCrop.x} y={-headCrop.y} clipPath={`url(#${id}-arm-${index ? "right" : "left"})`} /></g>)}
    <image href={atlas} width="1536" height="1024" x={-torsoCrop.x} y={-torsoCrop.y} clipPath={`url(#${id}-torso)`} />
    <image href={atlas} width="1536" height="1024" x={-headCrop.x} y={-headCrop.y} clipPath={`url(#${id}-head)`} />
  </svg>;
}
