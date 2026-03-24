import {
  getAdjacentSlugs,
  getStageDetail,
  loadItinerary,
} from "@/application/itinerary";
import StageDetailHeader from "@/components/stages/StageDetailHeader";
import StageMapSection from "@/components/stages/StageMapSection";
import StagePagination from "@/components/stages/StagePagination";
import WeatherStageSection from "@/features/weather/WeatherStageSection";
import { isLongRangeForecast } from "@/lib/forecastWindow";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return loadItinerary().stages.map((s) => ({ slug: s.slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const detail = getStageDetail(slug);
  if (!detail) return { title: "Etapa" };
  const { stage } = detail;
  return {
    title: `${stage.origin.name} → ${stage.dest.name} — Camino`,
    description: `Etapa del ${stage.label}: ${stage.distanceKm} km, tiempo en origen y destino.`,
  };
}

export default async function StagePage({ params }: PageProps) {
  const { slug } = await params;
  const detail = getStageDetail(slug);
  if (!detail) notFound();

  const { stage, route } = detail;
  const { prev, next } = getAdjacentSlugs(slug);
  const longRange = isLongRangeForecast(stage.date);

  return (
    <div>
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

      <StagePagination prevSlug={prev} nextSlug={next} />
    </div>
  );
}
