import {
  getAdjacentSlugs,
  getStageDetail,
  loadItinerary,
} from "@/application/itinerary";
import StageDetailSections from "@/components/stages/StageDetailSections";
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

  return (
    <StageDetailSections
      stage={stage}
      route={route}
      prevSlug={prev}
      nextSlug={next}
    />
  );
}
