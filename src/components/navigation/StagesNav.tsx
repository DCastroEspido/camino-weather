"use client";

import type { Stage } from "@/domain/itinerary";
import { STAGES_SEGMENT } from "@/lib/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type StagesNavProps = {
  stages: Stage[];
};

export default function StagesNav({ stages }: StagesNavProps) {
  const pathname = usePathname() ?? "";

  return (
    <nav className="stages-nav" aria-label="Stages">
      {stages.map((s) => {
        const href = `/${STAGES_SEGMENT}/${s.slug}/`;
        const base = `/${STAGES_SEGMENT}/${s.slug}`;
        const active =
          pathname === href ||
          pathname.endsWith(base) ||
          pathname.endsWith(`${base}/`);
        return (
          <Link
            key={s.slug}
            href={href}
            className={`stage-tab${active ? " active" : ""}`}
            prefetch
          >
            <span className="tab-date">{s.label}</span>
            <span className="tab-route">
              {s.origin.name} → {s.dest.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
