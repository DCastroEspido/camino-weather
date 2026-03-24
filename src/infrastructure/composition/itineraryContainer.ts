import type { ItineraryReadPort } from "@/domain/itinerary";
import { YamlItineraryAdapter } from "@/infrastructure/persistence/yaml/YamlItineraryAdapter";

let port: ItineraryReadPort | null = null;

/**
 * Composition root: wiring for Node (Next build / dev). Swap YamlItineraryAdapter
 * for another ItineraryReadPort to change persistence without touching the domain.
 */
export function getItineraryReadPort(): ItineraryReadPort {
  if (!port) {
    port = new YamlItineraryAdapter();
  }
  return port;
}
