import type {
  CalendarDay,
  Itinerary,
  ItineraryMeta,
  Place,
  Stage,
} from "@/domain/itinerary";
import type {
  ItineraryYamlDto,
  YamlDay,
  YamlLodgingContact,
  YamlPlace,
  YamlStage,
} from "./yamlDto";

function mapPlace(p: YamlPlace): Place {
  return {
    name: p.name,
    lat: p.lat,
    lon: p.lon,
    alt: p.alt,
  };
}

function mapLodging(l: YamlLodgingContact) {
  return {
    name: l.name,
    phone: l.phone,
    address: l.address,
    url: l.url,
  };
}

function mapStage(s: YamlStage): Stage {
  return {
    slug: s.slug,
    date: s.date,
    label: s.label,
    distanceKm: s.distanceKm,
    gpxPath: s.gpxPath,
    origin: mapPlace(s.origin),
    dest: mapPlace(s.dest),
    lodgingDeparture: s.lodgingDeparture
      ? mapLodging(s.lodgingDeparture)
      : undefined,
    lodgingArrival: s.lodgingArrival
      ? mapLodging(s.lodgingArrival)
      : undefined,
    elevationGainM: s.elevationGainM,
    elevationLossM: s.elevationLossM,
  };
}

function mapDay(d: YamlDay): CalendarDay {
  if (d.kind === "rest") {
    return { kind: "rest", date: d.date, note: d.note };
  }
  if (!d.stageSlug) {
    throw new Error(`YAML: walk day ${d.date} missing stageSlug`);
  }
  return {
    kind: "walk",
    date: d.date,
    stageSlug: d.stageSlug,
    note: d.note,
  };
}

export function mapYamlDtoToDomain(dto: ItineraryYamlDto): Itinerary {
  const meta: ItineraryMeta = {
    name: dto.camino.name,
    subtitle: dto.camino.subtitle,
  };
  return {
    meta,
    days: dto.days.map(mapDay),
    stages: dto.stages.map(mapStage),
  };
}
