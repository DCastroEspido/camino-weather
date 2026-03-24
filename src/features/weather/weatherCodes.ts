export type WeatherLabel = readonly [string, string];

/** Map Open-Meteo weathercode to [emoji, Spanish label] */
export const WX_CODE: Record<number, WeatherLabel> = {
  0: ["☀️", "Despejado"],
  1: ["🌤", "Casi despejado"],
  2: ["⛅", "Parcialmente nuboso"],
  3: ["☁️", "Cubierto"],
  45: ["🌫", "Niebla"],
  48: ["🌫", "Niebla con escarcha"],
  51: ["🌦", "Llovizna débil"],
  53: ["🌦", "Llovizna moderada"],
  55: ["🌧", "Llovizna intensa"],
  61: ["🌧", "Lluvia débil"],
  63: ["🌧", "Lluvia moderada"],
  65: ["🌧", "Lluvia fuerte"],
  71: ["🌨", "Nieve débil"],
  73: ["🌨", "Nieve moderada"],
  75: ["❄️", "Nieve fuerte"],
  77: ["🌨", "Granizo"],
  80: ["🌦", "Chubascos débiles"],
  81: ["🌧", "Chubascos moderados"],
  82: ["⛈", "Chubascos fuertes"],
  85: ["🌨", "Chubascos de nieve"],
  95: ["⛈", "Tormenta"],
  96: ["⛈", "Tormenta con granizo"],
  99: ["⛈", "Tormenta con granizo fuerte"],
};

export function wxLabel(code: number | undefined): WeatherLabel {
  if (code === undefined) return ["🌡", "—"];
  return WX_CODE[code] ?? ["🌡", "—"];
}
