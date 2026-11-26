// Bandit manchot du Grimoire : les trois dés du d666 deviennent les rouleaux d'une machine à sous.
// Les rouleaux s'arrêtent l'un après l'autre ; 111 et 666 sont les deux gros lots (céleste et infernal).
// Son synthétisé à la volée (Web Audio) : aucun fichier, marche hors ligne.
// Réglages (menu ⋮) mémorisés sur l'appareil ; l'animation se coupe aussi si le système demande moins de mouvement.
const K_SOUND = 'insmv.sound';
const K_SLOT = 'insmv.slot';
export const soundOn = () => localStorage.getItem(K_SOUND) !== 'off';
export const setSound = (on) => localStorage.setItem(K_SOUND, on ? 'on' : 'off');
const reduced = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
export const slotPref = () => localStorage.getItem(K_SLOT) !== 'off';
export const slotOn = () => slotPref() && !reduced();
export const setSlot = (on) => localStorage.setItem(K_SLOT, on ? 'on' : 'off');

// ---------- Son ----------
let ctx = null; let noise = null;
function audio() {
  if (!soundOn()) return null;
  try {
    ctx ||= new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    if (!noise) {
      noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.2), ctx.sampleRate);
      const d = noise.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    return ctx;
  } catch { return null; }
}
// Choc bref (mécanique) : bruit filtré
function knock(freq, len, vol, when = 0) {
  const a = audio(); if (!a) return;
  const t = a.currentTime + when;
  const src = a.createBufferSource(); src.buffer = noise;
  const bp = a.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = freq; bp.Q.value = 4;
  const g = a.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t + len);
  src.connect(bp).connect(g).connect(a.destination);
  src.start(t, Math.random() * 0.1, len + 0.02);
}
// Note : oscillateur avec enveloppe ; to = glissando vers cette fréquence
function tone(freq, len, { type = 'triangle', vol = 0.15, when = 0, to = null, vib = 0 } = {}) {
  const a = audio(); if (!a) return;
  const t = a.currentTime + when;
  const o = a.createOscillator(); o.type = type; o.frequency.setValueAtTime(freq, t);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + len);
  if (vib) { const l = a.createOscillator(); const lg = a.createGain(); l.frequency.value = 5.5; lg.gain.value = vib; l.connect(lg).connect(o.frequency); l.start(t); l.stop(t + len + 0.05); }
  const g = a.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + len);
  o.connect(g).connect(a.destination);
  o.start(t); o.stop(t + len + 0.05);
}
export const sfx = {
  unlock: () => { audio(); },
  // La manette : grincement puis ressort
  pull() { tone(320, 0.18, { type: 'sawtooth', vol: 0.05, to: 90 }); knock(500, 0.08, 0.3, 0.16); knock(1400, 0.05, 0.15, 0.22); },
  tick() { knock(2600 + Math.random() * 600, 0.02, 0.08); },
  // Un rouleau se bloque
  stop(i = 0) { knock(650 - i * 80, 0.1, 0.45); tone(196 - i * 20, 0.08, { type: 'square', vol: 0.05 }); },
  win() { tone(1318, 0.14, { vol: 0.12 }); tone(1760, 0.25, { vol: 0.12, when: 0.12 }); },
  lose() { tone(233, 0.32, { type: 'sawtooth', vol: 0.07, to: 220 }); tone(208, 0.6, { type: 'sawtooth', vol: 0.07, when: 0.34, to: 150 }); },
  double() { [1568, 1976, 2349].forEach((f, i) => tone(f, 0.12, { vol: 0.1, when: i * 0.08 })); },
  triple() { [1047, 1319, 1568, 2093, 1568, 2093].forEach((f, i) => tone(f, 0.16, { vol: 0.11, when: i * 0.09 })); for (let i = 0; i < 14; i++) knock(5000, 0.03, 0.06, 0.5 + i * 0.05); },
  // 111 : chœur céleste (accord majeur tenu, vibrato) et clochettes
  angel() { [523, 659, 784, 1047].forEach((f) => tone(f, 2.2, { type: 'sine', vol: 0.07, vib: 4 })); [2093, 2637, 3136, 4186].forEach((f, i) => tone(f, 0.5, { vol: 0.05, when: 0.3 + i * 0.15 })); },
  // 666 : orgue infernal (triton), grondement
  devil() { [110, 155.6, 220].forEach((f) => tone(f, 2, { type: 'sawtooth', vol: 0.06, vib: 2 })); tone(55, 1.6, { type: 'square', vol: 0.06, to: 40 }); knock(120, 0.8, 0.4, 0.05); },
  tilt() { tone(90, 0.5, { type: 'square', vol: 0.08 }); tone(85, 0.5, { type: 'square', vol: 0.08, when: 0.55 }); },
};

// ---------- Machine ----------
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const TAGS = {
  ange: ['Casino du Paradis · mise : une prière', 'Les anges ne perdent jamais (sauf au 666)', 'Machine bénie par Laurent', 'Gains reversés aux bonnes œuvres', 'Jouer est un péché véniel'],
  demon: ['Casino des Enfers · mise : ton âme', 'La maison gagne toujours', 'Machine trafiquée par Baal', 'Crédit illimité, intérêts éternels', 'Jackpot garanti par Satan (non contractuel)'],
  neutre: ['Grand Casino de l\'Apocalypse', 'Ni Dieu ni maître, juste des cerises', 'Faites vos jeux, rien ne va plus', 'Interdit aux moins de 6 666 ans'],
};
export const tagline = (camp) => { const t = TAGS[camp] || TAGS.neutre; return t[Math.floor(Math.random() * t.length)]; };
const H = 64; // hauteur d'une case du rouleau (px), reprise en CSS
const REEL_CLS = ['', 'd2', 'u'];
// Effet du tirage : bandeau et classe de la machine
export function outcome(res, camp) {
  if (!res) return { cls: '', banner: '' };
  if (res.divin === 'unique') return { cls: 'fx-ange', banner: `✦ JACKPOT DIVIN ✦${camp === 'demon' ? '<small>… pas pour toi</small>' : ''}`, kind: 'angel' };
  if (res.divin === 'bete') return { cls: 'fx-demon', banner: `☠ JACKPOT INFERNAL ☠${camp === 'ange' ? '<small>… pas pour toi</small>' : ''}`, kind: 'devil' };
  if (res.ok === false && res.ru === 6) return { cls: 'fx-tilt', banner: 'TILT', kind: 'tilt' };
  if (res.triple) return { cls: 'fx-triple', banner: 'TRIPLE !!!', kind: 'triple' };
  if (res.double) return { cls: 'fx-double', banner: 'DOUBLE !', kind: 'double' };
  if (res.ok === true) return { cls: 'fx-win', banner: 'GAGNÉ', kind: 'win' };
  if (res.ok === false) return { cls: 'fx-lose', banner: 'PERDU', kind: 'lose' };
  return { cls: '', banner: '' };
}
// dice : valeurs finales (null = machine au repos) ; spin : rouleaux prêts à tourner ; n : nombre de rouleaux
export function machine({ dice = null, n = 3, spin = false, tag = '', fx = null, lever = 'data-ract="go"', cls = REEL_CLS }) {
  const reels = Array.from({ length: n }, (_, i) => {
    const v = dice ? dice[i] : null;
    const strip = spin ? [...Array.from({ length: 12 + i * 6 }, () => 1 + Math.floor(Math.random() * 6)), v] : [v ?? '?'];
    return `<div class="reel ${cls[i] ?? ''}"><div class="strip" data-len="${strip.length - 1}">${strip.map((x) => `<b>${x}</b>`).join('')}</div></div>`;
  }).join('');
  const bulbs = '<i></i>'.repeat(14);
  return `<div class="slot ${spin ? 'spinning' : ''} ${fx?.cls || ''}">
    <div class="bulbs">${bulbs}</div>
    <div class="slot-sign">${esc(tag)}</div>
    <div class="slot-body"><div class="slot-reels">${reels}<div class="payline"></div></div>
      ${lever ? `<button class="slot-lever ${spin ? 'pulled' : ''}" ${lever} aria-label="Tirer la manette" title="Tirer la manette"><i></i></button>` : ''}</div>
    <div class="slot-banner">${spin ? '· · ·' : fx?.banner || '&nbsp;'}</div>
    <div class="bulbs">${bulbs}</div>
  </div>`;
}
// Fait tourner les rouleaux de la machine affichée dans root, puis appelle done()
export function spin(root, done) {
  const strips = [...(root?.querySelectorAll('.slot .strip') || [])];
  if (!strips.length) { done(); return; }
  const ticker = setInterval(() => sfx.tick(), 75);
  let left = strips.length;
  strips.forEach((st, i) => {
    const dur = 650 + i * 420;
    st.style.transform = 'translateY(0)';
    void st.offsetHeight; // applique la position de départ avant la transition
    st.style.transition = `transform ${dur}ms cubic-bezier(.15,.6,.25,1.12)`;
    st.style.transform = `translateY(-${+st.dataset.len * H}px)`;
    setTimeout(() => {
      st.parentElement.classList.add('stopped'); sfx.stop(i);
      if (--left === 0) { clearInterval(ticker); setTimeout(done, 220); }
    }, dur);
  });
}
// Bouquet final : son et pluie de symboles selon le tirage
const RAIN = { angel: ['✦', '😇', '🪶', '✝'], devil: ['🔥', '😈', '☠', '🔥'], triple: ['🪙', '💰', '🍒', '🪙'], double: ['🍒', '🪙'] };
export function celebrate(host, fx) {
  if (!fx?.kind) return;
  sfx[fx.kind]?.();
  const set = RAIN[fx.kind]; if (!set || !host || !slotOn()) return;
  const box = document.createElement('div'); box.className = 'slot-rain';
  const count = fx.kind === 'double' ? 10 : 26;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span'); s.textContent = set[i % set.length];
    s.style.left = Math.random() * 100 + '%'; s.style.animationDelay = (Math.random() * 0.8).toFixed(2) + 's';
    s.style.fontSize = (16 + Math.random() * 18).toFixed(0) + 'px';
    box.appendChild(s);
  }
  host.appendChild(box);
  setTimeout(() => box.remove(), 3200);
}
