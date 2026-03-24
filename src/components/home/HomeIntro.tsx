export default function HomeIntro() {
  return (
    <div className="home-intro">
      <p>
        Calendario de caminata y etapas. El tiempo se carga al abrir cada etapa
        (Open-Meteo). Edita{" "}
        <code style={{ fontSize: "0.9em" }}>data/camino.yaml</code> y los GPX
        en <code style={{ fontSize: "0.9em" }}>data/routes/</code>.
      </p>
    </div>
  );
}
