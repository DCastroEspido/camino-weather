const STAGES = [
  {
    date: '2026-03-29',
    label: '29 Mar',
    origin: { name: 'O Cebreiro', lat: 42.7072, lon: -7.0428, alt: 1330 },
    dest:   { name: 'Triacastela', lat: 42.7561, lon: -7.2372, alt: 665 },
    km: 20.9
  },
  {
    date: '2026-03-30',
    label: '30 Mar',
    origin: { name: 'Triacastela', lat: 42.7561, lon: -7.2372, alt: 665 },
    dest:   { name: 'Sarria', lat: 42.7783, lon: -7.4125, alt: 453 },
    km: 18.8
  },
  {
    date: '2026-03-31',
    label: '31 Mar',
    origin: { name: 'Sarria', lat: 42.7783, lon: -7.4125, alt: 453 },
    dest:   { name: 'Portomarín', lat: 42.8100, lon: -7.6144, alt: 370 },
    km: 22.7
  },
  {
    date: '2026-04-01',
    label: '1 Abr',
    origin: { name: 'Portomarín', lat: 42.8100, lon: -7.6144, alt: 370 },
    dest:   { name: 'Palas de Rei', lat: 42.8736, lon: -7.8697, alt: 565 },
    km: 24.8
  },
  {
    date: '2026-04-02',
    label: '2 Abr',
    origin: { name: 'Palas de Rei', lat: 42.8736, lon: -7.8697, alt: 565 },
    dest:   { name: 'Arzúa', lat: 42.9292, lon: -8.1617, alt: 390 },
    km: 29.6
  },
  {
    date: '2026-04-03',
    label: '3 Abr',
    origin: { name: 'Arzúa', lat: 42.9292, lon: -8.1617, alt: 390 },
    dest:   { name: 'O Pedrouzo', lat: 42.9136, lon: -8.3572, alt: 310 },
    km: 19.3
  },
  {
    date: '2026-04-04',
    label: '4 Abr',
    origin: { name: 'O Pedrouzo', lat: 42.9136, lon: -8.3572, alt: 310 },
    dest:   { name: 'Santiago de Compostela', lat: 42.8782, lon: -8.5448, alt: 260 },
    km: 20.1
  }
];

const WX_CODE = {
  0:  ['☀️','Despejado'],
  1:  ['🌤','Casi despejado'],
  2:  ['⛅','Parcialmente nuboso'],
  3:  ['☁️','Cubierto'],
  45: ['🌫','Niebla'],
  48: ['🌫','Niebla con escarcha'],
  51: ['🌦','Llovizna débil'],
  53: ['🌦','Llovizna moderada'],
  55: ['🌧','Llovizna intensa'],
  61: ['🌧','Lluvia débil'],
  63: ['🌧','Lluvia moderada'],
  65: ['🌧','Lluvia fuerte'],
  71: ['🌨','Nieve débil'],
  73: ['🌨','Nieve moderada'],
  75: ['❄️','Nieve fuerte'],
  77: ['🌨','Granizo'],
  80: ['🌦','Chubascos débiles'],
  81: ['🌧','Chubascos moderados'],
  82: ['⛈','Chubascos fuertes'],
  85: ['🌨','Chubascos de nieve'],
  95: ['⛈','Tormenta'],
  96: ['⛈','Tormenta con granizo'],
  99: ['⛈','Tormenta con granizo fuerte'],
};

function wxLabel(code) {
  return WX_CODE[code] || ['🌡','—'];
}

const WALK_HOURS = [6,7,8,9,10,11,12,13,14,15];

async function fetchWeather(lat, lon, date) {
  // start_date/end_date must not be combined with forecast_days (API returns 400).
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation_probability,precipitation,weathercode,windspeed_10m,winddirection_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=Europe%2FMadrid&start_date=${date}&end_date=${date}`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error('API error');
  return resp.json();
}

function windDir(deg) {
  const dirs = ['N','NE','E','SE','S','SO','O','NO'];
  return dirs[Math.round(deg / 45) % 8];
}

function renderHourlyTable(data, date, isEstimated) {
  const times = data.hourly.time;
  const prefix = date + 'T';
  const rows = [];

  for (let i = 0; i < times.length; i++) {
    if (!times[i].startsWith(prefix)) continue;
    const hour = parseInt(times[i].slice(11,13));
    if (hour < 6 || hour > 15) continue;

    const temp = data.hourly.temperature_2m[i];
    const precip = data.hourly.precipitation_probability[i];
    const precipMm = data.hourly.precipitation[i];
    const code = data.hourly.weathercode[i];
    const wind = data.hourly.windspeed_10m[i];
    const wdir = data.hourly.winddirection_10m[i];
    const [icon, desc] = wxLabel(code);
    const isWalk = WALK_HOURS.includes(hour);

    rows.push(`
      <tr class="${isWalk ? 'highlight' : ''}">
        <td class="hour-cell">${String(hour).padStart(2,'0')}:00</td>
        <td class="temp-cell">${temp !== null ? Math.round(temp) + '°C' : '—'}</td>
        <td><span class="weather-icon">${icon}</span><span class="wx-desc">${desc}</span></td>
        <td class="precip">${precip !== null ? precip + '%' : '—'}${precipMm > 0 ? ` (${precipMm.toFixed(1)}mm)` : ''}</td>
        <td class="wind-cell">${wind !== null ? Math.round(wind) + ' km/h ' + windDir(wdir) : '—'}</td>
      </tr>
    `);
  }

  if (rows.length === 0) {
    return `<p style="font-style:italic;color:var(--ink-faint);padding:0.5rem 0;font-size:0.85rem;">Sin datos horarios disponibles para esta fecha.</p>`;
  }

  return `
    <table class="hourly-table">
      <thead>
        <tr>
          <th>Hora</th>
          <th>Temp.</th>
          <th>Tiempo</th>
          <th>Precip.</th>
          <th>Viento</th>
        </tr>
      </thead>
      <tbody>${rows.join('')}</tbody>
    </table>
    ${isEstimated ? '<div style="margin-top:0.5rem;"><span class="pill pill-estimated">⚠ Previsión a +7 días — menor fiabilidad</span></div>' : ''}
  `;
}

function renderSummaryBar(data, date) {
  const tmax = data.daily?.temperature_2m_max?.[0];
  const tmin = data.daily?.temperature_2m_min?.[0];
  const precip = data.daily?.precipitation_sum?.[0];
  const code = data.daily?.weathercode?.[0];
  const [icon, desc] = code !== undefined ? wxLabel(code) : ['—','—'];

  return `
    <div class="summary-bar">
      <div class="summary-item">
        <span style="font-size:1.3rem">${icon}</span>
        <span>${desc}</span>
      </div>
      ${tmax !== undefined ? `<div class="summary-item"><span class="summary-label">Máx</span><span class="summary-val temp-hi">${Math.round(tmax)}°C</span></div>` : ''}
      ${tmin !== undefined ? `<div class="summary-item"><span class="summary-label">Mín</span><span class="summary-val temp-lo">${Math.round(tmin)}°C</span></div>` : ''}
      ${precip !== null && precip !== undefined ? `<div class="summary-item"><span class="summary-label">Precip. total</span><span class="summary-val" style="color:var(--rain)">${precip.toFixed(1)} mm</span></div>` : ''}
      <span class="pill pill-walk" style="margin-left:auto">🕘 Franjas resaltadas = horario de marcha</span>
    </div>
  `;
}

let stageData = {};

async function loadStage(idx) {
  const stage = STAGES[idx];
  const today = new Date();
  const stageDate = new Date(stage.date);
  const diffDays = Math.ceil((stageDate - today) / (1000*60*60*24));
  const isEstimated = diffDays > 7;

  const content = document.getElementById('content');
  content.innerHTML = `<div class="loading-msg"><span class="spinner"></span> Cargando datos para el ${stage.label}...</div>`;

  document.querySelectorAll('.stage-tab').forEach((t,i) => t.classList.toggle('active', i === idx));

  if (stageData[idx]) {
    renderStage(idx, stageData[idx].origin, stageData[idx].dest, isEstimated);
    return;
  }

  try {
    const [originData, destData] = await Promise.all([
      fetchWeather(stage.origin.lat, stage.origin.lon, stage.date),
      fetchWeather(stage.dest.lat, stage.dest.lon, stage.date)
    ]);
    stageData[idx] = { origin: originData, dest: destData };
    renderStage(idx, originData, destData, isEstimated);
  } catch(e) {
    content.innerHTML = `<div class="error-msg">No se pudieron obtener datos meteorológicos. Comprueba tu conexión a internet e inténtalo de nuevo.<br><small>${e.message}</small></div>`;
  }
}

function renderStage(idx, originData, destData, isEstimated) {
  const stage = STAGES[idx];
  const content = document.getElementById('content');

  content.innerHTML = `
    <div class="stage-header">
      <div class="stage-icon">🥾</div>
      <div class="stage-title">
        <h2>${stage.origin.name} → ${stage.dest.name}</h2>
        <p>${stage.label} · ${stage.km} km${isEstimated ? ' · <span class="pill pill-estimated">Previsión a largo plazo</span>' : ''}</p>
      </div>
      <div class="stage-stats">
        <div class="stat">
          <div class="stat-val">${stage.origin.alt}m</div>
          <div class="stat-lbl">Alt. origen</div>
        </div>
        <div class="stat">
          <div class="stat-val">${stage.dest.alt}m</div>
          <div class="stat-lbl">Alt. destino</div>
        </div>
        <div class="stat">
          <div class="stat-val">${stage.km}</div>
          <div class="stat-lbl">Km</div>
        </div>
      </div>
    </div>

    <div class="locations-grid">
      <div class="location-card origin">
        <div class="loc-label">▲ Origen</div>
        <div class="loc-name">${stage.origin.name} <span style="font-size:0.75rem;color:var(--ink-faint);font-family:'Crimson Pro'">(${stage.origin.alt}m)</span></div>
        ${renderSummaryBar(originData, stage.date)}
        ${renderHourlyTable(originData, stage.date, isEstimated)}
      </div>
      <div class="location-card destination">
        <div class="loc-label" style="color:var(--shell)">▼ Destino</div>
        <div class="loc-name">${stage.dest.name} <span style="font-size:0.75rem;color:var(--ink-faint);font-family:'Crimson Pro'">(${stage.dest.alt}m)</span></div>
        ${renderSummaryBar(destData, stage.date)}
        ${renderHourlyTable(destData, stage.date, isEstimated)}
      </div>
    </div>

    <div class="source-note">
      Datos: <a href="https://open-meteo.com" target="_blank">Open-Meteo</a> (modelo ECMWF) · Coordenadas reales de cada localidad · Actualizado: ${new Date().toLocaleString('es-ES')}
    </div>
  `;
}

function buildNav() {
  const nav = document.getElementById('stages-nav');
  STAGES.forEach((s, i) => {
    const tab = document.createElement('div');
    tab.className = 'stage-tab' + (i === 0 ? ' active' : '');
    tab.innerHTML = `<span class="tab-date">${s.label}</span><span class="tab-route">${s.origin.name} → ${s.dest.name}</span>`;
    tab.onclick = () => loadStage(i);
    nav.appendChild(tab);
  });
}

async function loadAll() {
  stageData = {};
  document.getElementById('last-update').textContent = 'Actualizando...';
  await loadStage(0);
  document.getElementById('last-update').textContent = 'Última actualización: ' + new Date().toLocaleTimeString('es-ES');
}

buildNav();
loadAll();
