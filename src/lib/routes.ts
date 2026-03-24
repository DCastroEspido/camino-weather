/** Base path for stage detail pages (App Router segment: `stages`). */
export const STAGES_SEGMENT = "stages";

export function stageDetailPath(slug: string): string {
  return `/${STAGES_SEGMENT}/${slug}/`;
}
