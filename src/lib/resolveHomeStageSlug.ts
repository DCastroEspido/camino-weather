import type { Itinerary } from "@/domain/itinerary";

/**
 * Picks which stage slug to show on "/", based on the traveller calendar in YAML.
 *
 * - Before the first calendar day → first walk stage (warm-up view).
 * - On a walk day → that stage.
 * - On a rest day or calendar gap → overview (caller should show list home).
 * - After the last calendar day → overview (original home).
 */
export function resolveHomeStageSlug(
  itinerary: Itinerary,
  todayYmd: string,
): string | null {
  const days = [...itinerary.days].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  if (days.length === 0) return null;

  const firstDate = days[0]!.date;
  const lastDate = days[days.length - 1]!.date;

  if (todayYmd < firstDate) {
    const firstWalk = days.find((d) => d.kind === "walk");
    return firstWalk?.kind === "walk" ? firstWalk.stageSlug : null;
  }

  if (todayYmd > lastDate) {
    return null;
  }

  const todayEntry = days.find((d) => d.date === todayYmd);
  if (!todayEntry) {
    return null;
  }
  if (todayEntry.kind === "rest") {
    return null;
  }
  return todayEntry.stageSlug;
}

/** Local calendar date as yyyy-mm-dd (matches YAML). */
export function localCalendarYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
