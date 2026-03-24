import type { Itinerary, StageDetail } from "./entities";

/**
 * Inbound port: the application asks for itinerary data without knowing
 * whether it comes from YAML, a database, or an API.
 */
export type ItineraryReadPort = {
  loadItinerary(): Itinerary;
  getStageDetail(slug: string): StageDetail | null;
  getAdjacentSlugs(slug: string): {
    prev: string | null;
    next: string | null;
  };
};
