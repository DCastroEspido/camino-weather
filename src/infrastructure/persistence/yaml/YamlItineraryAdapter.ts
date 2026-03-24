import type {
  ElevationTotals,
  Itinerary,
  ItineraryReadPort,
  RouteWaypoint,
  StageDetail,
} from "@/domain/itinerary";
import { adjacentStageSlugs } from "@/lib/adjacentStageSlugs";
import { elevationFromPoints } from "@/infrastructure/gpx/elevationFromTrack";
import { parseGpxXml } from "@/infrastructure/gpx/parseGpx";
import fs from "fs";
import path from "path";
import { parse as parseYaml } from "yaml";
import { mapYamlDtoToDomain } from "./mapYamlDtoToDomain";
import type { ItineraryYamlDto } from "./yamlDto";

type AdapterOptions = {
  dataDir?: string;
};

/**
 * Driven adapter: reads camino.yaml + GPX files and exposes domain objects.
 */
export class YamlItineraryAdapter implements ItineraryReadPort {
  private readonly dataDir: string;
  private readonly routesDir: string;

  constructor(options: AdapterOptions = {}) {
    this.dataDir = options.dataDir ?? path.join(process.cwd(), "data");
    this.routesDir = path.join(this.dataDir, "routes");
  }

  private readDto(): ItineraryYamlDto {
    const raw = fs.readFileSync(
      path.join(this.dataDir, "camino.yaml"),
      "utf8",
    );
    return parseYaml(raw) as ItineraryYamlDto;
  }

  loadItinerary(): Itinerary {
    return mapYamlDtoToDomain(this.readDto());
  }

  getStageDetail(slug: string): StageDetail | null {
    const itinerary = this.loadItinerary();
    const stage = itinerary.stages.find((s) => s.slug === slug);
    if (!stage) return null;

    const gpxFullPath = path.join(this.routesDir, stage.gpxPath);
    const xml = fs.readFileSync(gpxFullPath, "utf8");
    const { points } = parseGpxXml(xml);

    const waypoints: RouteWaypoint[] = points.map((p) => ({
      lat: p.lat,
      lon: p.lon,
      elevationM: p.ele,
    }));

    let elevation: ElevationTotals | null = elevationFromPoints(points);
    if (!elevation) {
      if (
        stage.elevationGainM != null &&
        stage.elevationLossM != null
      ) {
        elevation = {
          gainM: stage.elevationGainM,
          lossM: stage.elevationLossM,
        };
      } else if (stage.elevationGainM != null) {
        elevation = {
          gainM: stage.elevationGainM,
          lossM: stage.elevationLossM ?? 0,
        };
      }
    }

    return {
      stage,
      route: { waypoints, elevation },
    };
  }

  getAdjacentSlugs(slug: string): {
    prev: string | null;
    next: string | null;
  } {
    const { stages } = this.loadItinerary();
    return adjacentStageSlugs(stages, slug);
  }
}
