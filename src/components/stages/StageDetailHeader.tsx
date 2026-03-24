import type { ElevationTotals, Stage } from "@/domain/itinerary";
import {
  defaultHikingPaceKmh,
  formatEstimatedHikingTime,
} from "@/lib/estimatedHikingTime";

export type StageDetailHeaderProps = {
  stage: Stage;
  elevation: ElevationTotals | null;
  isLongRangeForecast: boolean;
};

export default function StageDetailHeader({
  stage,
  elevation,
  isLongRangeForecast: longRange,
}: StageDetailHeaderProps) {
  const pace = defaultHikingPaceKmh();
  const timeEst = formatEstimatedHikingTime(stage.distanceKm, pace);

  return (
    <div className="stage-header">
      <div className="stage-icon">🥾</div>
      <div className="stage-title">
        <h2>
          {stage.origin.name} → {stage.dest.name}
        </h2>
        <p>
          {stage.label} · {stage.distanceKm} km
          {longRange ? (
            <>
              {" "}
              ·{" "}
              <span className="pill pill-estimated">
                Previsión a largo plazo
              </span>
            </>
          ) : null}
        </p>
      </div>
      <div className="stage-stats">
        {elevation ? (
          <>
            <div className="stat">
              <div className="stat-val">+{elevation.gainM}m</div>
              <div className="stat-lbl">Subida</div>
            </div>
            <div className="stat">
              <div className="stat-val">−{elevation.lossM}m</div>
              <div className="stat-lbl">Bajada</div>
            </div>
          </>
        ) : null}
        <div className="stat">
          <div className="stat-val">{stage.origin.alt}m</div>
          <div className="stat-lbl">Alt. origen</div>
        </div>
        <div className="stat">
          <div className="stat-val">{stage.dest.alt}m</div>
          <div className="stat-lbl">Alt. destino</div>
        </div>
        <div className="stat">
          <div className="stat-val">{stage.distanceKm}</div>
          <div className="stat-lbl">Km</div>
        </div>
        <div className="stat">
          <div className="stat-val stat-val-sm">{timeEst}</div>
          <div className="stat-lbl">Tiempo est. · ~{pace} km/h</div>
        </div>
      </div>
    </div>
  );
}
