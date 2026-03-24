/**
 * First/last hour (local, Europe/Madrid) shown in the hourly table.
 * Includes full day through evening; "marcha" highlight is narrower.
 */
export const HOURLY_TABLE_FIRST_HOUR = 6;
export const HOURLY_TABLE_LAST_HOUR = 22;

/**
 * Hours that get the highlighted row background (planned walking window).
 */
export const MARCH_HIGHLIGHT_FIRST_HOUR = 8;
export const MARCH_HIGHLIGHT_LAST_HOUR = 15;

export function isMarchHighlightHour(hour: number): boolean {
  return (
    hour >= MARCH_HIGHLIGHT_FIRST_HOUR &&
    hour <= MARCH_HIGHLIGHT_LAST_HOUR
  );
}

export type OpenMeteoResponse = Record<string, unknown>;

/**
 * One-day forecast slice for a point. start_date/end_date must match; do not mix with forecast_days.
 */
export function buildForecastUrl(lat: number, lon: number, date: string): string {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    hourly: [
      "temperature_2m",
      "precipitation_probability",
      "precipitation",
      "weathercode",
      "windspeed_10m",
      "winddirection_10m",
    ].join(","),
    daily: [
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_sum",
      "weathercode",
    ].join(","),
    timezone: "Europe/Madrid",
    start_date: date,
    end_date: date,
  });
  return `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
}

export async function fetchWeatherJson(
  lat: number,
  lon: number,
  date: string,
): Promise<OpenMeteoResponse> {
  const url = buildForecastUrl(lat, lon, date);
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Open-Meteo HTTP ${resp.status}`);
  return resp.json() as Promise<OpenMeteoResponse>;
}
