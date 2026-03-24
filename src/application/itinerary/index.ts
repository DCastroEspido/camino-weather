/**
 * Application API for the itinerary. UI imports this module, not infrastructure.
 */
import { getItineraryReadPort } from "@/infrastructure/composition/itineraryContainer";

const port = getItineraryReadPort();

export function loadItinerary() {
  return port.loadItinerary();
}

export function getStageDetail(slug: string) {
  return port.getStageDetail(slug);
}

export function getAdjacentSlugs(slug: string) {
  return port.getAdjacentSlugs(slug);
}
