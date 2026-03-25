"use client";

import { useEffect } from "react";
import type { DivIconOptions, LatLngExpression } from "leaflet";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

export type MapEndpoint = {
  lat: number;
  lon: number;
  label: string;
};

type Props = {
  origin: MapEndpoint;
  dest: MapEndpoint;
  /** Stage segment of the master Camino track (lat, lon); omit or empty to show pins only. */
  trackLatLng?: [number, number][];
};

function pinIcon(fill: string, options?: Partial<DivIconOptions>): L.DivIcon {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 24 30" aria-hidden="true"><path fill="${fill}" stroke="#ffffff" stroke-width="1.25" d="M12 0C7 0 3 4 3 9c0 7 9 15 9 15s9-8 9-15c0-5-4-9-9-9z"/><circle fill="#ffffff" cx="12" cy="9" r="2.75"/></svg>`;
  return L.divIcon({
    html: svg,
    className: "map-endpoint-pin",
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -34],
    ...options,
  });
}

const ORIGIN_ICON = pinIcon("#0d8a4a");
const DEST_ICON = pinIcon("#c62828");

function FitRouteBounds({
  a,
  b,
  track,
}: {
  a: LatLngExpression;
  b: LatLngExpression;
  track: [number, number][];
}) {
  const map = useMap();
  useEffect(() => {
    const bounds = L.latLngBounds([a, b] as L.LatLngBoundsLiteral);
    for (const p of track) bounds.extend(p);
    if (!bounds.isValid()) return;
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
  }, [map, a, b, track]);
  return null;
}

/**
 * Green pin = start, red pin = finish; optional Camino track polyline between them.
 */
export default function RouteMapClient({ origin, dest, trackLatLng = [] }: Props) {
  const o: LatLngExpression = [origin.lat, origin.lon];
  const d: LatLngExpression = [dest.lat, dest.lon];

  const same =
    origin.lat === dest.lat && origin.lon === dest.lon;
  const center: LatLngExpression = same ? o : [(origin.lat + dest.lat) / 2, (origin.lon + dest.lon) / 2];

  const showTrack = !same && trackLatLng.length >= 2;

  return (
    <div className="route-map-wrap">
      <MapContainer
        center={center}
        zoom={same ? 14 : 11}
        className="route-map route-map-themed"
        scrollWheelZoom={false}
        attributionControl
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" rel="noreferrer">OpenStreetMap</a> · <a href="https://carto.com/attributions" rel="noreferrer">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
        />
        {!same ? (
          <FitRouteBounds a={o} b={d} track={showTrack ? trackLatLng : []} />
        ) : null}
        {showTrack ? (
          <Polyline
            positions={trackLatLng}
            pathOptions={{
              color: "#1565c0",
              weight: 4,
              opacity: 0.88,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
        ) : null}
        <Marker position={o} icon={ORIGIN_ICON}>
          <Popup>
            <strong>Inicio</strong>
            <br />
            {origin.label}
          </Popup>
        </Marker>
        <Marker position={d} icon={DEST_ICON}>
          <Popup>
            <strong>Fin</strong>
            <br />
            {dest.label}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
