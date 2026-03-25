"use client";

import type { MapEndpoint } from "@/features/coreMaps/RouteMapClient";
import dynamic from "next/dynamic";

const RouteMapClient = dynamic(
  () => import("@/features/coreMaps/RouteMapClient"),
  {
    ssr: false,
    loading: () => (
      <div className="loading-msg">
        <span className="spinner" />
        Cargando mapa…
      </div>
    ),
  },
);

export type StageRouteMapProps = {
  origin: MapEndpoint;
  dest: MapEndpoint;
  trackLatLng?: [number, number][];
};

export default function StageRouteMap({
  origin,
  dest,
  trackLatLng,
}: StageRouteMapProps) {
  return (
    <RouteMapClient origin={origin} dest={dest} trackLatLng={trackLatLng} />
  );
}
