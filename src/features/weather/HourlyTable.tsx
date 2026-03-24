import type { ReactNode } from "react";
import {
  HOURLY_TABLE_FIRST_HOUR,
  HOURLY_TABLE_LAST_HOUR,
  isMarchHighlightHour,
} from "./openMeteo";
import { wxLabel } from "./weatherCodes";
import { windDirFromDegrees } from "./windDirection";

type Hourly = {
  time?: string[];
  temperature_2m?: (number | null)[];
  precipitation_probability?: (number | null)[];
  precipitation?: (number | null)[];
  weathercode?: (number | null)[];
  windspeed_10m?: (number | null)[];
  winddirection_10m?: (number | null)[];
};

type Props = {
  data: { hourly?: Hourly };
  date: string;
  isEstimated: boolean;
};

export default function HourlyTable({ data, date, isEstimated }: Props) {
  const times = data.hourly?.time;
  if (!times?.length) {
    return (
      <p className="hourly-empty">
        Sin datos horarios disponibles para esta fecha.
      </p>
    );
  }

  const prefix = `${date}T`;
  const rows: ReactNode[] = [];

  const hourly = data.hourly!;

  for (let i = 0; i < times.length; i++) {
    const t = times[i];
    if (!t?.startsWith(prefix)) continue;
    const hour = parseInt(t.slice(11, 13), 10);
    if (hour < HOURLY_TABLE_FIRST_HOUR || hour > HOURLY_TABLE_LAST_HOUR) {
      continue;
    }

    const temp = hourly.temperature_2m?.[i];
    const precip = hourly.precipitation_probability?.[i];
    const precipMm = hourly.precipitation?.[i] ?? 0;
    const code = hourly.weathercode?.[i];
    const wind = hourly.windspeed_10m?.[i];
    const wdir = hourly.winddirection_10m?.[i];
    const [icon, desc] = wxLabel(code ?? undefined);
    const isWalk = isMarchHighlightHour(hour);

    rows.push(
      <tr key={t} className={isWalk ? "highlight" : undefined}>
        <td className="hour-cell">{String(hour).padStart(2, "0")}:00</td>
        <td className="temp-cell">
          {temp !== null && temp !== undefined ? `${Math.round(temp)}°C` : "—"}
        </td>
        <td>
          <span className="weather-icon">{icon}</span>
          <span className="wx-desc">{desc}</span>
        </td>
        <td className="precip">
          {precip !== null && precip !== undefined ? `${precip}%` : "—"}
          {typeof precipMm === "number" && precipMm > 0
            ? ` (${precipMm.toFixed(1)}mm)`
            : ""}
        </td>
        <td className="wind-cell">
          {wind !== null && wind !== undefined
            ? `${Math.round(wind)} km/h ${windDirFromDegrees(wdir ?? undefined)}`
            : "—"}
        </td>
      </tr>,
    );
  }

  if (rows.length === 0) {
    return (
      <p className="hourly-empty">
        Sin datos horarios disponibles para esta fecha.
      </p>
    );
  }

  return (
    <>
      <table className="hourly-table">
        <thead>
          <tr>
            <th>Hora</th>
            <th>Temp.</th>
            <th>Tiempo</th>
            <th>Precip.</th>
            <th>Viento</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
      {isEstimated ? (
        <div className="estimated-pill-wrap">
          <span className="pill pill-estimated">
            ⚠ Previsión a +7 días — menor fiabilidad
          </span>
        </div>
      ) : null}
    </>
  );
}
