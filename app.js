const STORAGE_KEY = 'mon-ping-v1';
const BAR = [
  { max: 24, normalWin: 6, normalLoss: -5, abnormalWin: 6, abnormalLoss: -5 },
  { max: 49, normalWin: 5.5, normalLoss: -4.5, abnormalWin: 7, abnormalLoss: -6 },
  { max: 99, normalWin: 5, normalLoss: -4, abnormalWin: 8, abnormalLoss: -7 },
  { max: 149, normalWin: 4, normalLoss: -3, abnormalWin: 10, abnormalLoss: -8 },
  { max: 199, normalWin: 3, normalLoss: -2, abnormalWin: 13, abnormalLoss: -10 },
  { max: 299, normalWin: 2, normalLoss: -1, abnormalWin: 17, abnormalLoss: -12.5 },
  { max: 399, normalWin: 1, normalLoss: -0.5, abnormalWin: 22, abnormalLoss: -16 },
  { max: 499, normalWin: 0.5, normalLoss: 0, abnormalWin: 28, abnormalLoss: -20 },
  { max: Infinity, normalWin: 0, normalLoss: 0, abnormalWin: 40, abnormalLoss: -29 }
];

let data = load();
const $ = id => document.getElementById(id);
const fmt = n => Number(n).toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const signed = n => `${n > 0 ? '+' : ''}${fmt(n)}`;
const today = () => new Date().toISOString().slice(0, 10);

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { name: '', startingPoints: 500, matches: [] }; }
  catch { return { name: '', startingPoints: 500, matches: [] }; }
}
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
function totalPoints() { return data.matches.reduce((total, m) => total + Number(m.delta), Number(data.startingPoints)); }
function getCalculation(myPoints, opponentPoints, result, coefficient) {
  if (!Number.isFinite(opponentPoints)) return null;
  const difference = Math.abs(myPoints - opponentPoints);
  const row = BAR.find(item => difference <= item.max);
  const abnormal = result === 'win' ? opponentPoints > myPoints : opponentPoints <= myPoints;
  const key = result === 'win' ? (abnormal ? 'abnormalWin' : 'normalWin') : (abnormal ? 'abnormalLoss' : 'normalLoss');
  return { delta: row[key] * coefficient, label: `${result === 'win' ? 'Victoire' : 'Défaite'} ${abnormal ? 'anormale' : 'normale'}`, difference };
}
function nav(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === page));
  document.querySelectorAll('[data-nav]').forEach(button => button.classList.toggle('active', button.dataset.nav === page));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function escapeHtml(value = '') { const d = document.createElement('div'); d.textContent = value; return d.innerHTML; }
function formatDate(value) { return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${value}T12:00:00`)); }
function displayName(match) { return match.opponent ? escapeHtml(match.opponent) : `Adversaire (${fmt(match.opponentPoints)} pts)`; }
function matchRow(match, detailed = false) {
  const kind = match.result === 'win' ? 'win' : 'loss';
  return `<article class="match-row" ${detailed ? `data-id="${match.id}"` : ''}><div class="match-badge ${kind}">${kind === 'win' ? 'V' : 'D'}</div><div class="match-meta"><strong>${displayName(match)}</strong><span>${formatDate(match.date)} · ${fmt(match.opponentPoints)} pts · coeff. ${String(match.coefficient).replace('.', ',')}</span></div><div class="delta ${kind}">${signed(match.delta)}</div>${detailed ? `<button class="delete-match" aria-label="Supprimer ce match" data-delete="${match.id}">×</button>` : ''}</article>`;
}
function renderChart() {
  const host = $('chart');
  const values = [Number(data.startingPoints), ...data.matches.slice(-14).map((_, index, arr) => Number(data.startingPoints) + data.matches.slice(0, data.matches.length - arr.length + index + 1).reduce((s, m) => s + Number(m.delta), 0))];
  if (values.length < 2) { host.innerHTML = '<div class="empty-chart">Ajoute ton premier match pour voir ta progression.</div>'; return; }
  const min = Math.min(...values), max = Math.max(...values), range = Math.max(max - min, 8), w = 300, h = 125, pad = 8;
  const points = values.map((value, i) => `${pad + i * (w - pad * 2) / (values.length - 1)},${h - pad - ((value - min) / range) * (h - pad * 2)}`);
  const line = points.join(' '), area = `${pad},${h - pad} ${line} ${w - pad},${h - pad}`;
  host.innerHTML = `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><line class="baseline" x1="0" y1="${h - pad}" x2="${w}" y2="${h - pad}"/><polygon class="area" points="${area}"/><polyline class="line" points="${line}"/>${points.map(p => `<circle class="dot" cx="${p.split(',')[0]}" cy="${p.split(',')[1]}" r="3.5"/>`).join('')}</svg>`;
}
function render() {
  const total = totalPoints(), delta = total - Number(data.startingPoints), matches = data.matches;
  $('currentPoints').textContent = fmt(total);
  $('seasonDelta').textContent = `${signed(delta)} cette saison`;
  $('seasonDelta').className = delta >= 0 ? 'positive' : 'negative';
  $('matchCount').textContent = matches.length;
  const wins = matches.filter(m => m.result === 'win').length;
  $('winRate').textContent = matches.length ? `${Math.round(wins / matches.length * 100)} %` : '—';
  let streak = 0, maxStreak = 0; matches.forEach(m => { streak = m.result === 'win' ? streak + 1 : 0; maxStreak = Math.max(maxStreak, streak); });
  $('bestStreak').textContent = maxStreak;
  $('trendLabel').textContent = `${signed(delta)} pt${Math.abs(delta) > 1 ? 's' : ''}`;
  $('recentMatches').innerHTML = matches.length ? matches.slice(-4).reverse().map(m => matchRow(m)).join('') : '<p class="empty-state">Aucun match enregistré pour le moment.</p>';
  $('historyList').innerHTML = matches.length ? matches.slice().reverse().map(m => matchRow(m, true)).join('') : '<div class="panel empty-state">Ton historique est vide. Ajoute ton premier match !</div>';
  $('playerName').value = data.name;
  $('startingPoints').value = data.startingPoints;
  renderChart();
}
function updateEstimate() {
  const opponentPoints = Number($('opponentPoints').value), coefficient = Number($('coefficient').value), result = document.querySelector('input[name="result"]:checked').value;
  const calculation = getCalculation(totalPoints(), opponentPoints, result, coefficient);
  if (!calculation) { $('estimateType').textContent = result === 'win' ? 'Victoire' : 'Défaite'; $('estimatePoints').textContent = '—'; $('estimateDetail').textContent = 'Renseigne les points de l’adversaire.'; return; }
  $('estimateType').textContent = calculation.label;
  $('estimatePoints').textContent = `${signed(calculation.delta)} pt`;
  $('estimateDetail').textContent = `Écart actuel : ${fmt(calculation.difference)} points · coefficient ${String(coefficient).replace('.', ',')}`;
}
function toast(message) { const el = $('toast'); el.textContent = message; el.classList.add('visible'); clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('visible'), 2800); }

document.querySelectorAll('[data-nav]').forEach(button => button.addEventListener('click', () => nav(button.dataset.nav)));
$('settingsButton').addEventListener('click', () => nav('settings'));
$('matchDate').value = today();
['opponentPoints', 'coefficient'].forEach(id => $(id).addEventListener('input', updateEstimate));
document.querySelectorAll('input[name="result"]').forEach(input => input.addEventListener('change', updateEstimate));
$('matchForm').addEventListener('submit', event => {
  event.preventDefault();
  const opponentPoints = Number($('opponentPoints').value), coefficient = Number($('coefficient').value), result = document.querySelector('input[name="result"]:checked').value;
  const calculation = getCalculation(totalPoints(), opponentPoints, result, coefficient);
  if (!calculation) return toast('Indique les points de ton adversaire.');
  data.matches.push({ id: crypto.randomUUID(), date: $('matchDate').value, opponent: $('opponent').value.trim(), opponentPoints, coefficient, result, delta: calculation.delta });
  save(); render(); event.target.reset(); $('matchDate').value = today(); updateEstimate(); nav('dashboard'); toast(`Match enregistré : ${signed(calculation.delta)} point${Math.abs(calculation.delta) !== 1 ? 's' : ''}`);
});
$('historyList').addEventListener('click', event => { const id = event.target.dataset.delete; if (!id) return; if (confirm('Supprimer ce match ?')) { data.matches = data.matches.filter(m => m.id !== id); save(); render(); toast('Match supprimé.'); } });
$('profileForm').addEventListener('submit', event => { event.preventDefault(); data.name = $('playerName').value.trim(); data.startingPoints = Number($('startingPoints').value); save(); render(); updateEstimate(); toast('Réglages enregistrés.'); });
$('exportButton').addEventListener('click', () => { const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `mon-ping-sauvegarde-${today()}.json`; link.click(); URL.revokeObjectURL(url); });
$('importInput').addEventListener('change', async event => { const file = event.target.files[0]; if (!file) return; try { const imported = JSON.parse(await file.text()); if (!Array.isArray(imported.matches) || !Number.isFinite(Number(imported.startingPoints))) throw new Error(); data = { name: imported.name || '', startingPoints: Number(imported.startingPoints), matches: imported.matches }; save(); render(); updateEstimate(); toast('Sauvegarde importée.'); } catch { toast('Ce fichier de sauvegarde est invalide.'); } event.target.value = ''; });
$('resetButton').addEventListener('click', () => { if (confirm('Effacer définitivement tous tes matchs ?')) { data.matches = []; save(); render(); updateEstimate(); toast('Historique effacé.'); } });
if ('serviceWorker' in navigator) navigator.serviceWorker.register('service-worker.js');
render(); updateEstimate();
