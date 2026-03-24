# Camino weather

Static Next.js app for planning a Camino stage list with **YAML + GPX** files, **Open-Meteo** forecasts in the browser, and optional deploy to **GitHub Pages**.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3050](http://localhost:3050) (`npm run dev` uses port **3050** so it does not clash with 3000/8000). No `BASE_PATH` is needed locally.

## Data

- **`data/camino.yaml`** — Camino title, `days` (calendar: `walk` / `rest`), and `stages` (slug, date, km, origin/dest coordinates, `gpxPath`).
- **`data/routes/*.gpx`** — One GPX per stage; the app parses track points and `<ele>` for map + ascent/descent. Replace the placeholder two-point tracks with real files when you have them.
- Optional overrides on a stage: `elevationGainM`, `elevationLossM` if the GPX has no usable elevations.

## Production build (static export)

```bash
npm run build
```

Output is written to **`out/`**.

### GitHub Pages (project site)

For `https://<user>.github.io/<repo>/`, the workflow sets `BASE_PATH=/<repo>` during `npm run build`. Enable **Settings → Pages → GitHub Actions** for the repository.

If you use a **user/organization site** (`<user>.github.io` repository), set `BASE_PATH` to empty in the workflow or remove the env block so assets load from the domain root.

## Architecture (short)

Hexagonal-style layout: **domain** has no YAML/fs knowledge; **application** is the facade; **infrastructure** implements ports. **UI strings** stay Spanish where needed; **folder and file names** are in English.

- **`src/domain/itinerary`** — Entities (`Stage`, `Place`, `Itinerary`, …) and **`ItineraryReadPort`**.
- **`src/application/itinerary`** — `loadItinerary`, `getStageDetail`, `getAdjacentSlugs`.
- **`src/infrastructure/persistence/yaml`** — `YamlItineraryAdapter`, DTO `ItineraryYamlDto`, mapping from `camino.yaml`.
- **`src/infrastructure/gpx`** — GPX parsing and elevation totals.
- **`src/infrastructure/composition`** — `getItineraryReadPort()` wires the YAML adapter.
- **`src/components`** — Presentational modules: `layout/`, `navigation/`, `home/`, `stages/`.
- **`src/lib`** — Small helpers (`routes.ts` for `/stages/[slug]`, `forecastWindow.ts`).
- **`src/app`** — Routes only; stage URLs live under **`/stages/[slug]`**.
- **`src/features/coreMaps`** — Leaflet map (client-only).
- **`src/features/weather`** — Open-Meteo in the browser (static hosting).
