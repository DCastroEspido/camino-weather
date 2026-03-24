import { getStageDetail, loadItinerary } from "@/application/itinerary";
import HomePageClient from "@/components/home/HomePageClient";
import type { StageDetail } from "@/domain/itinerary";

export default function HomePage() {
  const data = loadItinerary();
  const detailsBySlug: Record<string, StageDetail> = {};
  for (const s of data.stages) {
    const d = getStageDetail(s.slug);
    if (d) detailsBySlug[s.slug] = d;
  }

  return <HomePageClient itinerary={data} detailsBySlug={detailsBySlug} />;
}
