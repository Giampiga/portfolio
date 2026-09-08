export function resolveInitialView({ reducedMotion = false, explicitView, savedView } = {}) {
  if (reducedMotion) return "index";
  if (explicitView === "index" || explicitView === "studio") return explicitView;
  return savedView === "studio" ? "studio" : "index";
}
