/**
 * Shape of data/camino.yaml as parsed (DTO). Lives in infrastructure only.
 * Root key `camino` matches the YAML file; types are English.
 */

export type YamlPlace = {
  name: string;
  lat: number;
  lon: number;
  alt: number;
};

export type YamlLodgingContact = {
  name: string;
  phone?: string;
  address: string;
  url?: string;
};

export type YamlStage = {
  slug: string;
  date: string;
  label: string;
  distanceKm: number;
  gpxPath: string;
  origin: YamlPlace;
  dest: YamlPlace;
  lodgingDeparture?: YamlLodgingContact;
  lodgingArrival?: YamlLodgingContact;
  elevationGainM?: number;
  elevationLossM?: number;
};

export type YamlDay =
  | {
      date: string;
      kind: "walk";
      stageSlug: string;
      note?: string;
    }
  | {
      date: string;
      kind: "rest";
      stageSlug?: string;
      note?: string;
    };

export type ItineraryYamlDto = {
  camino: { name: string; subtitle?: string };
  days: YamlDay[];
  stages: YamlStage[];
};
