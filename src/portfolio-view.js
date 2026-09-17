export function resolveInitialView({ reducedMotion = false, explicitView } = {}) {
  if (reducedMotion) return "index";
  if (explicitView === "index" || explicitView === "studio") return explicitView;
  return "index";
}
