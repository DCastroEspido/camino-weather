import type { ElevationTotals } from "@/domain/itinerary";
import type { TrackPoint } from "./parseGpx";

/**
 * Simple accumulated gain/loss from consecutive elevation samples (no smoothing).
 * Returns null if fewer than two points carry elevation.
 */
export function elevationFromPoints(
  points: TrackPoint[],
): ElevationTotals | null {
  const elevations = points
    .map((p) => p.ele)
    .filter((e): e is number => e != null && Number.isFinite(e));
  if (elevations.length < 2) return null;

  let gainM = 0;
  let lossM = 0;
  for (let i = 1; i < elevations.length; i++) {
    const delta = elevations[i]! - elevations[i - 1]!;
    if (delta > 0) gainM += delta;
    else lossM += -delta;
  }

  return {
    gainM: Math.round(gainM),
    lossM: Math.round(lossM),
  };
}
