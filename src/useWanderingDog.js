import { useEffect, useRef, useState } from "react";
import { dogHouseGraph } from "./studio-navigation.js";
import { facingBetween, roomDistance } from "./studio-motion.js";
import { DOG_GAIT_FRAMES, DOG_SIDE_STEP_DISTANCE } from "./sprite-frames.js";

const dogPersonalities = {
  left: {
    cadence: 132, travelMsPerUnit: 125, paceVariance: 0.12,
    pauseMin: 500, pauseMax: 1750, burstMin: 2, burstMax: 4,
    anticipationMin: 100, anticipationMax: 170, cornerMin: 80, cornerMax: 135,
    settleDuration: 140, observeChance: 0.34, reverseChance: 0.12,
    idleDuration: 2100, idleDelay: -320,
  },
  right: {
    cadence: 164, travelMsPerUnit: 155, paceVariance: 0.1,
    pauseMin: 1300, pauseMax: 3400, burstMin: 1, burstMax: 3,
    anticipationMin: 155, anticipationMax: 245, cornerMin: 120, cornerMax: 190,
    settleDuration: 190, observeChance: 0.62, reverseChance: 0.38,
    idleDuration: 2700, idleDelay: -940,
  },
};
const randomBetween = (min, max) => min + Math.random() * (max - min);
const randomInteger = (min, max) => Math.floor(randomBetween(min, max + 1));
const startNode = (zone) => zone === "left" ? "rugNorthWest" : "rugSouthWest";

// Own the roaming timers in one place so petting can interrupt a pause without
// interrupting a furniture-safe travel segment. Exported for timer-level checks.
export function createDogBehavior(zone, mapRef, roaming, route, update) {
  const graph = dogHouseGraph;
  const personality = dogPersonalities[zone];
  const timers = new Set();
  let cancelled = false;
  let traveling = false;
  let petRequested = false;

  const clearTimers = () => {
    timers.forEach((timer) => window.clearTimeout(timer));
    timers.clear();
  };
  const schedule = (callback, delay) => {
    const timer = window.setTimeout(() => {
      timers.delete(timer);
      if (!cancelled) callback();
    }, delay);
    timers.add(timer);
  };
  const faceRandomExit = () => {
    const node = graph[route.current];
    const lookName = node.links[Math.floor(Math.random() * node.links.length)];
    update({ direction: facingBetween(node, graph[lookName]) });
  };
  const chooseNextNode = () => {
    const current = graph[route.current];
    const alternatives = current.links.filter((name) => name !== route.previous);
    const canReverse = route.previous && current.links.includes(route.previous);
    if (canReverse && (!alternatives.length || Math.random() < personality.reverseChance)) return route.previous;
    const candidates = alternatives.length ? alternatives : current.links;
    return candidates[Math.floor(Math.random() * candidates.length)];
  };
  const greet = () => {
    clearTimers();
    petRequested = false;
    update({ walking: false, gaitStep: 1, activity: "greeting", isGreeting: true, direction: "down" });
    schedule(() => {
      update({ isGreeting: false, activity: "idle" });
      if (roaming) restAtNode();
    }, 2200);
  };
  const restAtNode = () => {
    update({ walking: false, activity: Math.random() < personality.observeChance ? "observing" : "idle" });
    const pause = randomBetween(personality.pauseMin, personality.pauseMax);
    if (pause > 1000) {
      schedule(() => {
        faceRandomExit();
        update({ activity: "alert" });
      }, pause * randomBetween(0.42, 0.64));
    }
    schedule(() => beginLeg(randomInteger(personality.burstMin, personality.burstMax)), pause);
  };
  const beginLeg = (legsRemaining) => {
    const currentName = route.current;
    const current = graph[currentName];
    const targetName = chooseNextNode();
    const target = graph[targetName];
    const room = mapRef.current?.getBoundingClientRect();
    const distance = roomDistance(current, target, room?.width ? room.height / room.width : 2 / 3);
    const pace = personality.travelMsPerUnit * randomBetween(1 - personality.paceVariance, 1 + personality.paceVariance);
    const travelTime = Math.min(Math.max(distance * pace, 520), 2100);
    const direction = facingBetween(current, target);
    update({ direction, activity: "anticipating" });
    schedule(() => {
      traveling = true;
      route.previous = currentName;
      route.current = targetName;
      update({
        duration: travelTime,
        cadence: direction === "left" || direction === "right"
          ? DOG_SIDE_STEP_DISTANCE * travelTime / distance
          : personality.cadence / 2 * (travelTime / distance) / personality.travelMsPerUnit,
        gaitStep: 0, walking: true, activity: "walking", position: target,
      });
      schedule(() => {
        traveling = false;
        update({ walking: false, gaitStep: 1 });
        if (petRequested) {
          greet();
        } else if (legsRemaining > 1) {
          update({ activity: "cornering" });
          schedule(() => beginLeg(legsRemaining - 1), randomBetween(personality.cornerMin, personality.cornerMax));
        } else {
          update({ activity: "settling" });
          schedule(restAtNode, personality.settleDuration);
        }
      }, travelTime);
    }, randomBetween(personality.anticipationMin, personality.anticipationMax));
  };

  update({ walking: false, gaitStep: 1, activity: "idle", isGreeting: false });
  if (roaming) restAtNode();
  return {
    pet() {
      if (cancelled) return;
      // Do not cancel the active CSS travel: its endpoint is already a safe node.
      if (traveling) petRequested = true;
      else greet();
    },
    dispose() {
      cancelled = true;
      clearTimers();
    },
  };
}

export function useWanderingDog(zone, mapRef, reducedMotion) {
  const personality = dogPersonalities[zone];
  const routeRef = useRef({ current: startNode(zone), previous: null });
  const behaviorRef = useRef(null);
  const [roomVisible, setRoomVisible] = useState(() => !document.hidden && window.matchMedia("(min-width: 861px)").matches);
  const [dog, setDog] = useState(() => ({
    position: dogHouseGraph[startNode(zone)], direction: zone === "right" ? "left" : "right",
    gaitStep: 1, walking: false, duration: 1200, activity: "idle", isGreeting: false,
    cadence: personality.cadence,
  }));

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 861px)");
    const update = () => setRoomVisible(!document.hidden && desktop.matches);
    document.addEventListener("visibilitychange", update);
    desktop.addEventListener("change", update);
    return () => {
      document.removeEventListener("visibilitychange", update);
      desktop.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      routeRef.current = { current: startNode(zone), previous: null };
      setDog((current) => ({ ...current, position: dogHouseGraph[startNode(zone)], direction: zone === "left" ? "right" : "left" }));
    }
    // While hidden, CSS travel finishes at its safe node; no roaming timers run.
    const behavior = createDogBehavior(zone, mapRef, roomVisible && !reducedMotion, routeRef.current,
      (patch) => setDog((current) => ({ ...current, ...patch })));
    behaviorRef.current = behavior;
    return () => {
      behavior.dispose();
      behaviorRef.current = null;
    };
  }, [mapRef, reducedMotion, roomVisible, zone]);

  useEffect(() => {
    if (!dog.walking) return undefined;
    const frameTimer = window.setInterval(() => setDog((current) => ({ ...current, gaitStep: (current.gaitStep + 1) % DOG_GAIT_FRAMES.length })), dog.cadence);
    return () => window.clearInterval(frameTimer);
  }, [dog.cadence, dog.walking]);

  return {
    ...dog,
    frame: DOG_GAIT_FRAMES[dog.gaitStep],
    traveling: dog.walking,
    idleDuration: personality.idleDuration,
    idleDelay: personality.idleDelay,
    pet: () => behaviorRef.current?.pet(),
  };
}
