import { wxLabel } from "./weatherCodes";

type Daily = {
  temperature_2m_max?: (number | null)[];
  temperature_2m_min?: (number | null)[];
  precipitation_sum?: (number | null)[];
  weathercode?: (number | null)[];
};

type Props = {
  data: { daily?: Daily };
};

export default function WeatherSummary({ data }: Props) {
  const daily = data.daily;
  const tmax = daily?.temperature_2m_max?.[0];
  const tmin = daily?.temperature_2m_min?.[0];
  const precip = daily?.precipitation_sum?.[0];
  const code = daily?.weathercode?.[0];
  const [icon, desc] =
    code !== undefined && code !== null ? wxLabel(code) : ["—", "—"];

  return (
    <div className="summary-bar">
      <div className="summary-item">
        <span style={{ fontSize: "1.3rem" }}>{icon}</span>
        <span>{desc}</span>
      </div>
      {tmax !== undefined && tmax !== null ? (
        <div className="summary-item">
          <span className="summary-label">Máx</span>
          <span className="summary-val temp-hi">{Math.round(tmax)}°C</span>
        </div>
      ) : null}
      {tmin !== undefined && tmin !== null ? (
        <div className="summary-item">
          <span className="summary-label">Mín</span>
          <span className="summary-val temp-lo">{Math.round(tmin)}°C</span>
        </div>
      ) : null}
      {precip !== null && precip !== undefined ? (
        <div className="summary-item">
          <span className="summary-label">Precip. total</span>
          <span className="summary-val summary-precip">
            {precip.toFixed(1)} mm
          </span>
        </div>
      ) : null}
      <span className="pill pill-walk" style={{ marginLeft: "auto" }}>
        🕘 Resaltado 8h–15h = ventana de marcha prevista
      </span>
    </div>
  );
}
