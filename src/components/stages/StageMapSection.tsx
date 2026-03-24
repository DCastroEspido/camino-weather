import type { Place } from "@/domain/itinerary";
import StageRouteMap from "./StageRouteMap";

export type StageMapSectionProps = {
  origin: Place;
  dest: Place;
};

export default function StageMapSection({ origin, dest }: StageMapSectionProps) {
  return (
    <section className="map-section" aria-label="Mapa de la etapa">
      <h3>Mapa · origen y destino</h3>
      <StageRouteMap
        origin={{ lat: origin.lat, lon: origin.lon, label: origin.name }}
        dest={{ lat: dest.lat, lon: dest.lon, label: dest.name }}
      />
    </section>
  );
}
