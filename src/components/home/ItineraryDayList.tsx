import type { CalendarDay, Stage } from "@/domain/itinerary";
import { stageDetailPath } from "@/lib/routes";
import Link from "next/link";

export type ItineraryDayListProps = {
  days: CalendarDay[];
  stages: Stage[];
};

export default function ItineraryDayList({
  days,
  stages,
}: ItineraryDayListProps) {
  const stageBySlug = Object.fromEntries(
    stages.map((s) => [s.slug, s] as const),
  );

  return (
    <>
      <h2
        className="loc-label"
        style={{ marginBottom: "0.75rem", color: "var(--ink-light)" }}
      >
        Días
      </h2>
      <ul className="day-list">
        {days.map((d) => {
          if (d.kind === "rest") {
            return (
              <li key={d.date} className="day-item">
                <span className="tab-date" style={{ opacity: 0.85 }}>
                  {d.date}
                </span>
                <div className="day-meta day-meta-rest">
                  Día de descanso{d.note ? ` · ${d.note}` : ""}
                </div>
              </li>
            );
          }
          const slug = d.stageSlug;
          const stage = slug ? stageBySlug[slug] : undefined;
          if (!stage || !slug) {
            return (
              <li key={d.date} className="day-item">
                <span>{d.date}</span>
                <div className="day-meta">
                  Etapa no encontrada en YAML (revisa stageSlug).
                </div>
              </li>
            );
          }
          return (
            <li key={d.date} className="day-item">
              <Link href={stageDetailPath(slug)}>
                {d.date} · {stage.label} — {stage.origin.name} →{" "}
                {stage.dest.name}
              </Link>
              <div className="day-meta">{stage.distanceKm} km</div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
