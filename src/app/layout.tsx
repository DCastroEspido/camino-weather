import { loadItinerary } from "@/application/itinerary";
import SiteHeader from "@/components/layout/SiteHeader";
import StagesNav from "@/components/navigation/StagesNav";
import type { Metadata, Viewport } from "next";
import { Cinzel, Crimson_Pro } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-cinzel",
});

const crimson = Crimson_Pro({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400"],
  variable: "--font-crimson",
});

export const metadata: Metadata = {
  title: "Camino de Santiago — Tiempo",
  description:
    "Previsión meteorológica por etapa y planificación del Camino (datos en YAML / GPX).",
  robots: { index: false, follow: false },
};

/** Lets `env(safe-area-inset-*)` apply on notched iPhones when using full-bleed chrome. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = loadItinerary();

  return (
    <html lang="es" className={`${cinzel.variable} ${crimson.variable}`}>
      <body>
        <SiteHeader
          subtitle={data.meta.subtitle}
          fallbackSubtitle="Itinerario y tiempo por etapa"
        />

        <StagesNav stages={data.stages} />

        <div className="content">{children}</div>
      </body>
    </html>
  );
}
