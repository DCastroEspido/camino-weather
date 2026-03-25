"use client";

import type { Stage } from "@/domain/itinerary";
import { STAGES_SEGMENT } from "@/lib/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export type StagesNavProps = {
  stages: Stage[];
};

export default function StagesNav({ stages }: StagesNavProps) {
  const pathname = usePathname() ?? "";
  const activeTabRef = useRef<HTMLAnchorElement | null>(null);
  const firstScrollDone = useRef(false);

  useEffect(() => {
    const el = activeTabRef.current;
    if (!el) return;
    el.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: firstScrollDone.current ? "smooth" : "auto",
    });
    firstScrollDone.current = true;
  }, [pathname]);

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
            ref={active ? activeTabRef : undefined}
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
