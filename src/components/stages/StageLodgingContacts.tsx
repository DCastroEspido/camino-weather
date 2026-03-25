import type { LodgingContact, Stage } from "@/domain/itinerary";

export type StageLodgingContactsProps = {
  stage: Stage;
};

function telHref(phone: string): string {
  const digits = phone.replace(/\s/g, "");
  return digits.startsWith("+") ? digits : `+${digits}`;
}

/** Opens Google Maps search for the full address string (works on mobile app + web). */
function googleMapsSearchUrl(address: string): string {
  const q = address.trim();
  if (!q) return "https://www.google.com/maps/";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

function LodgingName({ lodging }: { lodging: LodgingContact }) {
  if (lodging.url) {
    return (
      <div className="stage-lodging-name">
        <a
          href={lodging.url}
          target="_blank"
          rel="noopener noreferrer"
          className="stage-lodging-name-link"
        >
          {lodging.name}
        </a>
      </div>
    );
  }
  return <div className="stage-lodging-name">{lodging.name}</div>;
}

function LodgingBlock({
  title,
  lodging,
}: {
  title: string;
  lodging: LodgingContact;
}) {
  return (
    <div className="stage-lodging-block">
      <div className="stage-lodging-block-title">{title}</div>
      <LodgingName lodging={lodging} />
      {lodging.phone ? (
        <div className="stage-lodging-phone">
          <a href={`tel:${telHref(lodging.phone)}`}>{lodging.phone}</a>
        </div>
      ) : null}
      <div className="stage-lodging-address">
        <a
          href={googleMapsSearchUrl(lodging.address)}
          target="_blank"
          rel="noopener noreferrer"
          className="stage-lodging-address-link"
        >
          {lodging.address}
        </a>
      </div>
    </div>
  );
}

/**
 * Departure / arrival lodging contacts at the top of the stage view.
 */
export default function StageLodgingContacts({ stage }: StageLodgingContactsProps) {
  const dep = stage.lodgingDeparture;
  const arr = stage.lodgingArrival;
  if (!dep && !arr) {
    return null;
  }

  return (
    <section className="stage-lodging" aria-label="Contactos de alojamiento">
      <h3 className="stage-lodging-heading">Contactos</h3>
      <div className="stage-lodging-grid">
        {dep ? (
          <LodgingBlock title="Salida (noche anterior)" lodging={dep} />
        ) : null}
        {arr ? (
          <LodgingBlock title="Llegada (esta noche)" lodging={arr} />
        ) : null}
      </div>
    </section>
  );
}
