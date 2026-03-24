import Link from "next/link";

type Props = {
  subtitle?: string;
  fallbackSubtitle: string;
};

export default function SiteHeader({ subtitle, fallbackSubtitle }: Props) {
  return (
    <div className="header">
      <div className="header-inner">
        <div>
          <h1>
            <Link href="/" className="header-title-link">
              ✦ <span>Camino</span> de Santiago
            </Link>
          </h1>
          <div className="header-sub">{subtitle ?? fallbackSubtitle}</div>
        </div>
      </div>
    </div>
  );
}
