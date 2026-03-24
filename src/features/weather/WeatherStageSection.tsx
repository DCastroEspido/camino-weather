"use client";

import { useCallback, useEffect, useState } from "react";
import type { Place } from "@/domain/itinerary";
import HourlyTable from "./HourlyTable";
import { fetchWeatherJson, type OpenMeteoResponse } from "./openMeteo";
import WeatherSummary from "./WeatherSummary";

type Props = {
  date: string;
  label: string;
  /** True when stage date is more than 7 days ahead (legacy behaviour) */
  isEstimated: boolean;
  origin: Place;
  dest: Place;
};

/**
 * Fetches Open-Meteo in the browser so static hosting (GitHub Pages) stays viable.
 */
export default function WeatherStageSection({
  date,
  label,
  isEstimated,
  origin,
  dest,
}: Props) {
  const [originWx, setOriginWx] = useState<OpenMeteoResponse | null>(null);
  const [destWx, setDestWx] = useState<OpenMeteoResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [o, d] = await Promise.all([
        fetchWeatherJson(origin.lat, origin.lon, date),
        fetchWeatherJson(dest.lat, dest.lon, date),
      ]);
      setOriginWx(o);
      setDestWx(d);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
      setOriginWx(null);
      setDestWx(null);
    } finally {
      setLoading(false);
    }
  }, [date, origin.lat, origin.lon, dest.lat, dest.lon]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <div className="loading-msg">
        <span className="spinner" />
        Obteniendo datos meteorológicos para el {label}...
      </div>
    );
  }

  if (error || !originWx || !destWx) {
    return (
      <div className="error-msg">
        No se pudieron obtener datos meteorológicos. Comprueba tu conexión e
        inténtalo de nuevo.
        {error ? (
          <>
            <br />
            <small>{error}</small>
          </>
        ) : null}
        <div style={{ marginTop: "0.75rem" }}>
          <button type="button" className="update-btn" onClick={() => void load()}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="locations-grid">
        <div className="location-card origin">
          <div className="loc-label">▲ Origen</div>
          <div className="loc-name">
            {origin.name}{" "}
            <span className="loc-alt">({origin.alt}m)</span>
          </div>
          <WeatherSummary data={originWx} />
          <HourlyTable data={originWx} date={date} isEstimated={isEstimated} />
        </div>
        <div className="location-card destination">
          <div className="loc-label loc-label-dest">▼ Destino</div>
          <div className="loc-name">
            {dest.name}{" "}
            <span className="loc-alt">({dest.alt}m)</span>
          </div>
          <WeatherSummary data={destWx} />
          <HourlyTable data={destWx} date={date} isEstimated={isEstimated} />
        </div>
      </div>
      <div className="source-note">
        Datos:{" "}
        <a href="https://open-meteo.com" target="_blank" rel="noreferrer">
          Open-Meteo
        </a>{" "}
        (modelo ECMWF) · Coordenadas por localidad · Actualizado:{" "}
        {new Date().toLocaleString("es-ES")}
      </div>
    </>
  );
}
