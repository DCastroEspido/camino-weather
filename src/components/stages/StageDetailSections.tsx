import StageDetailHeader from "@/components/stages/StageDetailHeader";
import StageLodgingContacts from "@/components/stages/StageLodgingContacts";
import StageMapSection from "@/components/stages/StageMapSection";
import StagePagination from "@/components/stages/StagePagination";
import WeatherStageSection from "@/features/weather/WeatherStageSection";
import { isLongRangeForecast } from "@/lib/forecastWindow";
import type { Stage, StageRoute } from "@/domain/itinerary";

export type StageDetailSectionsProps = {
  stage: Stage;
  route: StageRoute;
  prevSlug: string | null;
  nextSlug: string | null;
};

/**
 * Shared layout for a stage: header, map, weather, pagination.
 * Used by `/stages/[slug]` and by `/` when the home acts as “today’s stage”.
 */
export default function StageDetailSections({
  stage,
  route,
  prevSlug,
  nextSlug,
}: StageDetailSectionsProps) {
  const longRange = isLongRangeForecast(stage.date);

  return (
    <div>
      <StageLodgingContacts stage={stage} />

      <StageDetailHeader
        stage={stage}
        elevation={route.elevation}
        isLongRangeForecast={longRange}
      />

      <StageMapSection origin={stage.origin} dest={stage.dest} />

      <WeatherStageSection
        date={stage.date}
        label={stage.label}
        isEstimated={longRange}
        origin={stage.origin}
        dest={stage.dest}
      />

      <StagePagination prevSlug={prevSlug} nextSlug={nextSlug} />
    </div>
  );
}
