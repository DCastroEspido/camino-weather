import { XMLParser } from "fast-xml-parser";

export type TrackPoint = { lat: number; lon: number; ele?: number };

export type ParsedTrack = {
  points: TrackPoint[];
};

/**
 * Minimal GPX 1.1 parser: collects all trkpt across trk/trkseg.
 */
export function parseGpxXml(xml: string): ParsedTrack {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });
  const doc = parser.parse(xml) as Record<string, unknown>;
  const gpx = doc.gpx as Record<string, unknown> | undefined;
  if (!gpx) return { points: [] };

  const tracks = gpx.trk;
  const trkList = tracks == null ? [] : Array.isArray(tracks) ? tracks : [tracks];

  const points: TrackPoint[] = [];

  for (const trk of trkList) {
    const trkObj = trk as Record<string, unknown>;
    const segments = trkObj.trkseg;
    const segList =
      segments == null ? [] : Array.isArray(segments) ? segments : [segments];

    for (const seg of segList) {
      const segObj = seg as Record<string, unknown>;
      const rawPts = segObj.trkpt;
      if (rawPts == null) continue;
      const pts: unknown[] = Array.isArray(rawPts) ? rawPts : [rawPts];
      for (const p of pts) {
        const pt = p as Record<string, unknown>;
        const lat = parseFloat(String(pt["@_lat"]));
        const lon = parseFloat(String(pt["@_lon"]));
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
        const rawEle = pt.ele;
        let ele: number | undefined;
        if (rawEle != null) {
          const n = parseFloat(String(rawEle));
          if (Number.isFinite(n)) ele = n;
        }
        points.push({ lat, lon, ele });
      }
    }
  }

  return { points };
}
