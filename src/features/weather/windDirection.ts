const DIRS = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"] as const;

export function windDirFromDegrees(deg: number | null | undefined): string {
  if (deg == null || !Number.isFinite(deg)) return "—";
  return DIRS[Math.round(deg / 45) % 8]!;
}
