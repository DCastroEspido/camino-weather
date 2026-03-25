import fs from "fs";
import path from "path";

/** [latitude, longitude] in WGS84, same order Leaflet expects. */
export type LatLngPair = readonly [number, number];

let cachedTrack: LatLngPair[] | null = null;
let loadFailed = false;

/**
 * Reads `data/camino-route.json` once (lon/lat pairs) and caches [lat, lon] for the map.
 * If the file is missing or invalid, returns an empty array and does not retry.
 */
export function getFullCaminoTrackLatLng(): LatLngPair[] {
  if (cachedTrack) return cachedTrack as LatLngPair[];
  if (loadFailed) return [];

  const filePath = path.join(process.cwd(), "data", "camino-route.json");
  if (!fs.existsSync(filePath)) {
    loadFailed = true;
    return [];
  }

  try {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as {
      coordinates?: [number, number][];
    };
    const coords = raw.coordinates ?? [];
    cachedTrack = coords.map(([lon, lat]) => [lat, lon] as LatLngPair);
    return cachedTrack;
  } catch {
    loadFailed = true;
    return [];
  }
}

function nearestTrackIndex(
  track: readonly LatLngPair[],
  lat: number,
  lon: number,
): number {
  let bestIdx = 0;
  let bestSq = Infinity;
  for (let i = 0; i < track.length; i++) {
    const dLat = track[i][0] - lat;
    const dLon = track[i][1] - lon;
    const sq = dLat * dLat + dLon * dLon;
    if (sq < bestSq) {
      bestSq = sq;
      bestIdx = i;
    }
  }
  return bestIdx;
}

/**
 * Takes the master Camino polyline and keeps the ordered segment between the two places.
 * Indices follow trail order (start of JSON ≈ Roncesvalles; end ≈ Santiago).
 */
export function sliceCaminoTrackForEndpoints(
  originLat: number,
  originLon: number,
  destLat: number,
  destLon: number,
): LatLngPair[] {
  const track = getFullCaminoTrackLatLng();
  if (track.length === 0) return [];

  let i0 = nearestTrackIndex(track, originLat, originLon);
  let i1 = nearestTrackIndex(track, destLat, destLon);
  if (i0 > i1) {
    const t = i0;
    i0 = i1;
    i1 = t;
  }

  return track.slice(i0, i1 + 1);
}
