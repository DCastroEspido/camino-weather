"use client";

import HomeIntro from "@/components/home/HomeIntro";
import ItineraryDayList from "@/components/home/ItineraryDayList";
import StageDetailSections from "@/components/stages/StageDetailSections";
import type { Itinerary, StageDetail } from "@/domain/itinerary";
import { adjacentStageSlugs } from "@/lib/adjacentStageSlugs";
import { localCalendarYmd, resolveHomeStageSlug } from "@/lib/resolveHomeStageSlug";
import { useEffect, useState } from "react";

export type HomePageClientProps = {
  itinerary: Itinerary;
  /** Preloaded at build time so the client never needs the filesystem / GPX loader. */
  detailsBySlug: Record<string, StageDetail>;
};

/**
 * Static export cannot know the visitor’s “today” at build time, so we resolve
 * the home view after mount using the device’s local calendar date.
 */
export default function HomePageClient({
  itinerary,
  detailsBySlug,
}: HomePageClientProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <p className="home-loading" aria-live="polite">
        Cargando…
      </p>
    );
  }

  const slug = resolveHomeStageSlug(itinerary, localCalendarYmd(new Date()));

  if (slug == null) {
    return (
      <div>
        <HomeIntro />
        <ItineraryDayList days={itinerary.days} stages={itinerary.stages} />
      </div>
    );
  }

  const detail = detailsBySlug[slug];
  if (!detail) {
    return (
      <div>
        <HomeIntro />
        <ItineraryDayList days={itinerary.days} stages={itinerary.stages} />
      </div>
    );
  }

  const { prev, next } = adjacentStageSlugs(itinerary.stages, slug);

  return (
    <StageDetailSections
      stage={detail.stage}
      route={detail.route}
      prevSlug={prev}
      nextSlug={next}
    />
  );
}
