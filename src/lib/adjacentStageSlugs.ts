import type { Stage } from "@/domain/itinerary";

/** Previous/next stage slug following YAML `stages` order. */
export function adjacentStageSlugs(
  stages: Stage[],
  slug: string,
): { prev: string | null; next: string | null } {
  const idx = stages.findIndex((s) => s.slug === slug);
  if (idx < 0) return { prev: null, next: null };
  return {
    prev: idx > 0 ? stages[idx - 1]!.slug : null,
    next: idx < stages.length - 1 ? stages[idx + 1]!.slug : null,
  };
}
