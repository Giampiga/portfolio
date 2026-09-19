import { useEffect, useRef, useState } from "react";
import { advancePlayer, createPlayerState, walkingFrame } from "./studio-motion.js";

const movementKeys = {
  arrowdown: "down", s: "down", arrowleft: "left", a: "left",
  arrowright: "right", d: "right", arrowup: "up", w: "up",
};
const isControl = (target) => target?.closest?.("a, button, input, textarea, select, [contenteditable='true']");

export function useStudioPlayer({ mapRef, canWalk, routeTo, reducedMotion, enabled = true }) {
  const stateRef = useRef(createPlayerState());
  const [state, setState] = useState(stateRef.current);
  const keysRef = useRef(new Map());
  const animationRef = useRef(0);
  const lastTickRef = useRef(null);
  const aspectRef = useRef(0.78);
  const configRef = useRef({ canWalk, routeTo, reducedMotion, enabled });
  const arrivalFacingRef = useRef(null);
  configRef.current = { canWalk, routeTo, reducedMotion, enabled };

  const publish = (next) => { stateRef.current = next; setState(next); };
  const stop = () => {
    keysRef.current.clear();
    cancelAnimationFrame(animationRef.current);
    animationRef.current = 0;
    lastTickRef.current = null;
    publish({ ...stateRef.current, speed: 0, walking: false, route: [] });
  };

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) aspectRef.current = entry.contentRect.height / entry.contentRect.width;
      else stop();
    });
    observer.observe(map);
    return () => observer.disconnect();
  }, [mapRef]);

  const advanceTo = (timestamp) => {
    const now = Math.max(timestamp, lastTickRef.current ?? timestamp);
    const dt = lastTickRef.current === null ? 0 : now - lastTickRef.current;
    lastTickRef.current = now;
    const heldDirection = [...keysRef.current.values()].at(-1);
    const next = advancePlayer(stateRef.current, dt, { direction: heldDirection, aspect: aspectRef.current, canWalk: configRef.current.canWalk });
    // The final travel frame lands cleanly in the standing pose.
    if (!heldDirection && !next.route.length && next.speed < 0.0001) {
      next.walking = false;
      if (arrivalFacingRef.current) next.direction = arrivalFacingRef.current;
    }
    publish(next);
    return next;
  };

  const tick = (timestamp) => {
    animationRef.current = 0;
    if (document.hidden || document.querySelector("dialog[open]")) { stop(); return; }
    const next = advanceTo(timestamp);
    const heldDirection = [...keysRef.current.values()].at(-1);
    if (heldDirection || next.route.length || next.speed > 0.0001) animationRef.current = requestAnimationFrame(tick);
    else lastTickRef.current = null;
  };

  const start = () => {
    if (!animationRef.current) {
      lastTickRef.current ??= performance.now();
      animationRef.current = requestAnimationFrame(tick);
    }
  };

  useEffect(() => {
    const down = (event) => {
      const key = event.key.toLowerCase();
      const direction = movementKeys[key];
      if (!configRef.current.enabled || !direction || event.altKey || event.ctrlKey || event.metaKey || isControl(event.target) || document.querySelector("dialog[open]")) return;
      if (!mapRef.current?.getBoundingClientRect().width) return;
      event.preventDefault();
      if (keysRef.current.has(key)) return; // Ignore operating-system repeats.
      const now = performance.now();
      if (lastTickRef.current !== null) advanceTo(now);
      keysRef.current.set(key, direction);
      arrivalFacingRef.current = null;
      publish({ ...stateRef.current, route: [] });
      lastTickRef.current = now;
      start();
    };
    const up = (event) => {
      const key = event.key.toLowerCase();
      if (!movementKeys[key] || !keysRef.current.has(key)) return;
      // Integrate real held time even if a short tap ends before the first RAF;
      // never add a synthetic frame of movement per key press.
      if (document.hidden || document.querySelector("dialog[open]")) { stop(); return; }
      advanceTo(performance.now());
      keysRef.current.delete(key);
      // Release brakes over a few frames (only a few screen pixels), while
      // blur/dialog/hidden-tab stops remain immediate for safety.
      if (!keysRef.current.size) start();
    };
    const visibility = () => { if (document.hidden) stop(); };
    document.addEventListener("keydown", down);
    document.addEventListener("keyup", up);
    window.addEventListener("blur", stop);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      document.removeEventListener("keydown", down);
      document.removeEventListener("keyup", up);
      window.removeEventListener("blur", stop);
      document.removeEventListener("visibilitychange", visibility);
      cancelAnimationFrame(animationRef.current);
      animationRef.current = 0;
      keysRef.current.clear();
    };
  }, [mapRef]);

  useEffect(() => { if (reducedMotion || !enabled) stop(); }, [reducedMotion, enabled]);

  const walkTo = (destination) => {
    if (!configRef.current.enabled) return;
    if (lastTickRef.current !== null) advanceTo(performance.now());
    keysRef.current.clear();
    const route = configRef.current.routeTo(stateRef.current.position, destination);
    arrivalFacingRef.current = destination.facing;
    if (!route.length) {
      stop();
      publish({ ...stateRef.current, direction: destination.facing ?? stateRef.current.direction });
      mapRef.current?.focus({ preventScroll: true });
      return;
    }
    if (configRef.current.reducedMotion) {
      stop();
      publish({ ...stateRef.current, position: { ...route.at(-1) }, direction: destination.facing ?? stateRef.current.direction, speed: 0, route: [], walking: false });
      mapRef.current?.focus({ preventScroll: true });
      return;
    }
    publish({ ...stateRef.current, route });
    start();
    mapRef.current?.focus({ preventScroll: true });
  };

  return { ...state, frame: walkingFrame(state.distance, state.walking && !reducedMotion), walking: state.walking && !reducedMotion, walkTo };
}
