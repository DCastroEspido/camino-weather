/**
 * Rough walking time for planning (Camino-style day stage), not GPS duration.
 * Pace is indicative; does not include long stops.
 */
const DEFAULT_PACE_KMH = 4.5;

export function formatEstimatedHikingTime(
  distanceKm: number,
  paceKmh: number = DEFAULT_PACE_KMH,
): string {
  if (!Number.isFinite(distanceKm) || distanceKm <= 0) return "—";
  const totalMinutes = Math.max(
    1,
    Math.round((distanceKm / paceKmh) * 60),
  );
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}

export function defaultHikingPaceKmh(): number {
  return DEFAULT_PACE_KMH;
}
