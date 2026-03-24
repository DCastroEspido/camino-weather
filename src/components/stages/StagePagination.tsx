import { stageDetailPath } from "@/lib/routes";
import Link from "next/link";

export type StagePaginationProps = {
  prevSlug: string | null;
  nextSlug: string | null;
};

export default function StagePagination({
  prevSlug,
  nextSlug,
}: StagePaginationProps) {
  return (
    <div className="stage-prev-next">
      {prevSlug ? (
        <Link href={stageDetailPath(prevSlug)}>← Etapa anterior</Link>
      ) : (
        <span />
      )}
      {nextSlug ? (
        <Link href={stageDetailPath(nextSlug)}>Etapa siguiente →</Link>
      ) : null}
    </div>
  );
}
