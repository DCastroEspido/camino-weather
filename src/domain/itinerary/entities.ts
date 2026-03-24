/**
 * Domain model for the walking itinerary.
 * Persistence-agnostic: no YAML, filesystem, or HTTP types here.
 */

export type Place = {
  name: string;
  lat: number;
  lon: number;
  alt: number;
};

export type Stage = {
  slug: string;
  /** ISO date yyyy-mm-dd */
  date: string;
  label: string;
  distanceKm: number;
  /** File name under the routes directory (e.g. stage.gpx) */
  gpxPath: string;
  origin: Place;
  dest: Place;
  elevationGainM?: number;
  elevationLossM?: number;
};

export type CalendarDay =
  | {
      kind: "rest";
      date: string;
      note?: string;
    }
  | {
      kind: "walk";
      date: string;
      stageSlug: string;
      note?: string;
    };

export type ItineraryMeta = {
  name: string;
  subtitle?: string;
};

/** Aggregate root: plan metadata, calendar days, and stages. */
export type Itinerary = {
  meta: ItineraryMeta;
  days: CalendarDay[];
  stages: Stage[];
};

export type ElevationTotals = {
  gainM: number;
  lossM: number;
};

export type RouteWaypoint = {
  lat: number;
  lon: number;
  /** Meters above sea level when known (e.g. from GPX) */
  elevationM?: number;
};

export type StageRoute = {
  waypoints: RouteWaypoint[];
  elevation: ElevationTotals | null;
};

export type StageDetail = {
  stage: Stage;
  route: StageRoute;
};
