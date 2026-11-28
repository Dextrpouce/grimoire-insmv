import * as R from './rules.js';
import { store } from './store.js';
import * as cloud from './cloud.js';
import { mjLock } from './mjlock.js';
import { MANUEL_JOUEUR, MANUEL_MJ } from './manuel.js';
import { table, errText } from './table.js';
import { scen, newNpc, newScene, npcChar, npcStats, gravite, npcFromCharacter, startLive, BOOK, KINDS, newEntry, newChoice, QUICK, quickNpc } from './scenario.js';
import { QUICK_PP } from './data/pnjrapides.js';
import { SCENARIOS_LIVRES } from './data/scenarios-livres.js';
import { HIERARCHIE, SUP_HIER } from './data/hierarchie.js';
import { TABLES_MJ } from './data/tables-mj.js';
import * as slot from './slot.js';

// ---- Ordre de parution des livres (gamme INS/MV 4e, Siroz/Asmodée) ----
// Livre de base fév. 2003 · Écran avr. 2003 · Fire & Ice sept. et nov. 2003 · Jésus Reviens ! janv. 2004 ·
// Les Petites Apocalypses nov. 2004 · Angelots en gelée juin 2005 · La Bible à Dudule sept. 2005 · On Ferme ! oct. 2006
// ---- Icônes de camp : auréole (anges), cornes (démons), œil ouvert (Troisième Force) ----
const CAMP_ICO = {
  ange: '<svg viewBox="0 0 60 18" aria-hidden="true"><ellipse cx="30" cy="9" rx="26" ry="6.5" fill="none" stroke="currentColor" stroke-width="3.2"/></svg>',
  demon: '<svg viewBox="0 0 60 28" aria-hidden="true"><path d="M14 2c2 9 7 15 13 20-7-2-12-7-15-13zM46 2c-2 9-7 15-13 20 7-2 12-7 15-13z" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/></svg>',
  tiers: '<svg viewBox="0 0 60 28" aria-hidden="true"><path d="M4 14C14 3 46 3 56 14 46 25 14 25 4 14z" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linejoin="round"/><circle cx="30" cy="14" r="6.5" fill="none" stroke="currentColor" stroke-width="2.8"/><circle cx="30" cy="14" r="2.4" fill="currentColor"/></svg>',
};
const CAMP_TXT = { ange: 'anges', demon: 'démons', tiers: 'Troisième Force' };
const campIco = (k) => (CAMP_ICO[k] ? `<span class="camp-ico ${k}" title="${CAMP_TXT[k]}">${CAMP_ICO[k]}</span>` : '');
const campTag = (k) => (CAMP_ICO[k] ? `<span class="camp-tag ${k}">${campIco(k)}${CAMP_TXT[k]}</span>` : '');
const BOOK_RANK = [[/écran/i, 2], [/règles|livre de base|livret (in nomine|magna|ins|mv)/i, 1], [/fire (and|&) ice (2|volume 2)/i, 4], [/fire (and|&) ice/i, 3],
  [/jésus reviens/i, 5], [/petites apocalypses/i, 6], [/angelots/i, 7], [/bible à dudule/i, 8], [/on ferme/i, 9]];
const bookRank = (s) => BOOK_RANK.find(([re]) => re.test(String(s || '')))?.[1] ?? 99;
const byBook = (f) => (a, b) => bookRank(f(a)) - bookRank(f(b)); // tri stable : l'ordre du livre est gardé
// Questionnaires de vie privée (On Ferme !, p. 70) : sortis des tables aléatoires, ils vont dans l'onglet Vie privée
// une question par ligne, réponses « a. … ; b. … » ; « Si … » : question qui dépend de la réponse précédente
const VIE_Q = {};
for (const [id, camp] of [['of-vie-privee-ange', 'ange'], ['of-vie-privee-demon', 'demon']]) {
  const i = TABLES_MJ.findIndex((t) => t.id === id); if (i < 0) continue;
  const t = TABLES_MJ.splice(i, 1)[0]; let base = -1;
  VIE_Q[camp] = { ref: `${t.livre}, ${t.ref}`, qs: t.lignes.map((r, k) => {
    const opts = r.t.split(/\s*;\s*(?=[a-d]\.\s)/).map((x) => { const m = x.trim().match(/^([a-d])\.\s*([\s\S]*?)\.?$/); return m ? { k: m[1], t: m[2] } : null; }).filter(Boolean);
    let dep = null;
    if (/^Si /.test(r.d) && base >= 0) {
      const cond = r.d.slice(3).trim().toLowerCase();
      const prevOpts = t.lignes[base].t.toLowerCase();
      const v = /^[a-d]$/.test(cond) ? cond : (prevOpts.match(new RegExp(`([a-d])\\.\\s*${cond}`)) || [])[1];
      dep = v ? { q: base, v } : null;
    } else base = k;
    return { q: r.d, opts, dep };
  }) };
}
TABLES_MJ.sort(byBook((t) => t.livre));
SCENARIOS_LIVRES.sort(byBook((x) => x.livre));
BOOK.sort(byBook((t) => t.book));

// ================= Utilitaires =================
const $app = document.getElementById('app');
const dlg = document.getElementById('dlg');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const C = () => store.current();
const L = R.lvl;
const sgn = (n) => (n > 0 ? '+' + n : String(n));
const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const ICONS = {
  sheet: '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h7M9 9h3"/>',
  sword: '<path d="M20 4l-.6 3.4L10 16.8 7.2 14 16.6 4.6z"/><path d="M5.2 12.4l6.4 6.4"/><path d="M8.4 15.6 4.2 19.8"/>',
  wing: '<path d="M3 20c4-1 7-4 9-9 1-3 4-6 9-7-1 5-3 8-6 10l3 1c-2 2-5 3-8 3l2 1c-3 1-6 1-9 1z"/>',
  book: '<path d="M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z"/>',
  folder: '<path d="M3 6h6l2 2h10v11H3z"/><path d="M3 10h18"/>',
  dots: '<circle cx="12" cy="5" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="12" cy="19" r="1.3"/>',
  die: '<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1.2"/><circle cx="15" cy="15" r="1.2"/><circle cx="15" cy="9" r="1.2"/><circle cx="9" cy="15" r="1.2"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.3a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.8"/><circle cx="12" cy="17.2" r=".6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  undo: '<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13 7l4 4"/>',
  check: '<path d="M5 12l5 5L20 7"/>',
  cloud: '<path d="M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 9.5 4.3 4.3 0 0 0 7 18z"/>',
  heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  bag: '<path d="M6 8h12l1 12H5z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/><path d="M9 12h6"/>',
  shield: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/>',
  bolt: '<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>',
  refresh: '<path d="M20 11a8 8 0 0 0-14.5-4.5L4 8"/><path d="M4 4v4h4"/><path d="M4 13a8 8 0 0 0 14.5 4.5L20 16"/><path d="M20 20v-4h-4"/>',
  stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
  hand: '<path d="M8 13V6.5a1.5 1.5 0 0 1 3 0V11"/><path d="M11 11V4.5a1.5 1.5 0 0 1 3 0V11"/><path d="M14 11V6a1.5 1.5 0 0 1 3 0v7a6 6 0 0 1-6 6h-1a5 5 0 0 1-4.3-2.5L4 12.5a1.5 1.5 0 0 1 2.6-1.5L8 13"/>',
  box: '<path d="M4 7h16v4H4z"/><path d="M6 11v8h12v-8"/><path d="M10 14h4"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  download: '<path d="M12 4v11"/><path d="M7 10l5 5 5-5"/><path d="M5 20h14"/>',
  upload: '<path d="M12 20V9"/><path d="M7 14l5-5 5 5"/><path d="M5 4h14"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  back: '<path d="M15 6l-6 6 6 6"/>',
  next: '<path d="M5 6l6 6-6 6"/><path d="M12 6l6 6-6 6"/>',
  play: '<path d="M7 5l12 7-12 7z"/>',
  flag: '<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>',
  crown: '<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
  send: '<path d="M4 12l16-8-6 16-3-7z"/><path d="M11 13l9-9"/>',
  logout: '<path d="M15 4h4v16h-4"/><path d="M10 8l-4 4 4 4"/><path d="M6 12h10"/>',
  save: '<path d="M5 4h11l3 3v13H5z"/><path d="M8 4v5h7V4"/><rect x="8" y="13" width="8" height="5"/>',
  print: '<path d="M7 9V4h10v5"/><rect x="4" y="9" width="16" height="7" rx="1"/><path d="M7 14h10v6H7z"/>',
  sound: '<path d="M4 10v4h4l5 4V6l-5 4z"/><path d="M16 9a4 4 0 0 1 0 6"/><path d="M18.5 6.5a7.5 7.5 0 0 1 0 11"/>',
  medic: '<path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z"/>',
  up: '<path d="M12 19V5"/><path d="M6 11l6-6 6 6"/>',
  skull: '<path d="M12 3a7 7 0 0 0-7 7v3l2 2v3h10v-3l2-2v-3a7 7 0 0 0-7-7z"/><circle cx="9" cy="11" r="1.4"/><circle cx="15" cy="11" r="1.4"/><path d="M10 18v2M14 18v2"/>',
  gift: '<rect x="4" y="9" width="16" height="11" rx="1"/><path d="M12 9v11M4 13h16"/><path d="M12 9c-2-4-6-3-5 0M12 9c2-4 6-3 5 0"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  image: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M21 16l-5-5-8 8"/>',
  warn: '<path d="M12 3l10 18H2z"/><path d="M12 10v5"/><circle cx="12" cy="18" r=".6"/>',
};
const icon = (n) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]}</svg>`;
// ---- Icônes des boutons : posées d'office sur chaque bouton qui n'en a pas (aide l'œil à trouver le bon bouton) ----
// Clé : data-act / data-ract / data-dact / id du bouton ; sinon d'après son texte. Une fonction choisit selon l'état.
const BTN_ICON = {
  // fiche, combat, sac, pouvoirs, carnet
  attack: 'sword', defense: 'shield', hit: 'heart', 'wound-add': 'plus', 'wound-close': 'check', 'close-med': 'medic', 'close-pp': 'bolt',
  'pf-full': 'heart', 'pp-full': 'refresh', 'pp-1': 'clock', 'pp-to-pf': 'heart', 'pow-use': 'bolt', 'pow-roll': 'die', 'pow-add': 'plus',
  'fx-off': 'stop', 'go-sac': 'bag', 'weapon-add': 'plus', 'armor-add': 'plus', 'sac-add': 'plus', toggle: 'eye',
  'weapon-hand': (b) => (/main/i.test(b.textContent) ? 'hand' : 'box'), 'armor-toggle': (b) => (/port/i.test(b.textContent) ? 'shield' : 'box'),
  'add-multi': 'plus', 'add-lang': 'plus', 'add-exo': 'plus', 'lim-add': 'plus', 'pa-gain': 'star', 'crea-done': 'check', 'crea-cancel': 'x',
  'hier-rules': 'book', 'hier-reward': 'gift', 'hier-invoke': 'wing', 'hier-blame': 'warn', 'hier-avert': 'warn', help: 'help',
  'table-share': 'send', 'table-push': 'send', 'table-stop': 'x', sync: 'cloud', new: 'plus', import: 'upload', go: 'die',
  // maître de jeu
  'mj-enter': 'crown', 'mj-create': 'plus', 'mj-add': 'plus', 'mj-copy': 'copy', 'mj-close': 'refresh', 'mj-retry': 'refresh', 'mj-kick': 'x',
  'mj-cloud': 'cloud', 'mj-char': 'eye', 'mj-roll': 'die', 'mj-attack': 'sword', 'mj-alea-roll': 'die', 'mj-alea-note': 'edit',
  'mj-cb-impro': 'plus', 'mj-cb-open': 'play', 'mj-sec': 'book',
  'lv-init': 'die', 'lv-iadd': 'plus', 'lv-inext': 'next', 'lv-attack': 'sword', 'lv-hit': 'heart', 'lv-wclose': 'check', 'lv-out': 'skull',
  'lv-end': 'flag', 'lv-back': 'back', 'lv-add': 'plus',
  'sc-finish': 'flag', 'sc-next': 'next', 'sc-reset': 'refresh', 'sc-cur': 'play', 'sc-tab-add': 'die', 'sc-tab-del': 'trash', 'sc-back': 'back', 'sc-create': 'plus', 'sc-library': 'book', 'sc-import': 'upload', 'sc-export': 'download', 'sc-dup': 'copy', 'sc-del': 'trash',
  'sc-live': 'sword', 'sc-scene-add': 'plus', 'sc-scene-del': 'trash', 'sc-scene-up': 'up', 'sc-npc-add': 'plus', 'sc-npc-del': 'trash',
  'sc-npc-dup': 'copy', 'sc-npc-done': 'back', 'sc-npc-best': 'book', 'sc-npc-tobest': 'book', 'sc-npc-import': 'user',
  'sc-w-add': 'plus', 'sc-w-free': 'plus', 'sc-w-del': 'trash', 'sc-p-add': 'plus', 'sc-p-del': 'trash',
  'sc-type-new': 'plus', 'sc-type-quick': 'bolt', 'sc-type-book': 'book', 'sc-type-char': 'user', 'sc-type-import': 'upload',
  'sc-type-export': 'download', 'sc-type-dup': 'copy', 'sc-type-del': 'trash',
  'sc-memo-new': 'edit', 'sc-memo-edit': 'edit', 'sc-memo-done': 'check', 'sc-memo-all': 'list', 'sc-memo-import': 'upload', 'sc-memo-export': 'download',
  'sc-ch-add': 'plus', 'sc-ch-edit': 'edit', 'sc-ch-del': 'trash', 'sc-ch-undo': 'undo',
  // menus et fenêtres
  'portrait-pick': (b) => (b.dataset.cam ? 'camera' : 'image'), 'portrait-change': 'image', 'portrait-del': 'trash',
  close: 'x', export1: 'download', exportAll: 'download', print: 'print', recrea: 'edit', mj: 'crown', cloud: 'cloud', slot: 'die',
  sound: 'sound', delete: 'trash', mjhome: 'crown', mjquit: 'logout', logout: 'logout', cfgsave: 'save',
};
const BTN_TXT = [[/^(annuler|non|fermer)\b/i, 'x'], [/^(oui|ok|valider|appliquer|enregistrer|terminer|confirmer|entrer)\b/i, 'check'],
  [/^(créer|ajouter|nouveau|nouvelle)\b/i, 'plus'], [/^(lancer|tirer|relancer)\b/i, 'die'], [/(supprim|retirer|effacer|oublier)/i, 'trash'],
  [/export/i, 'download'], [/import/i, 'upload'], [/copier/i, 'copy'], [/(connexion|se connecter|compte)/i, 'user'], [/(noter|modifier)/i, 'edit']];
// Boutons concernés : les .btn, et les grands boutons de menu (.choice) qui ont une action
const NO_ICON = '.seg, .stepper, .pill, .cell, .rt-car, .rt-chips, nav.tabs';
function decorateButtons(root = document) {
  root.querySelectorAll('button.btn, button.choice[data-dact]').forEach((b) => {
    if (b.dataset.ico || b.querySelector('svg, .crest') || b.closest(NO_ICON)) return;
    if (/^\p{Extended_Pictographic}/u.test(b.textContent.trim())) return; // déjà un pictogramme dans le texte (👑 Maître de jeu…)
    b.dataset.ico = '1';
    const k = b.dataset.act || b.dataset.ract || b.dataset.dact || b.id;
    let n = BTN_ICON[k];
    if (typeof n === 'function') n = n(b);
    if (!n) n = BTN_TXT.find(([re]) => re.test(b.textContent.trim()))?.[1];
    if (n && ICONS[n]) b.insertAdjacentHTML('afterbegin', icon(n));
  });
}
let decoQueued = false;
new MutationObserver(() => {
  if (decoQueued) return;
  decoQueued = true;
  requestAnimationFrame(() => { decoQueued = false; decorateButtons(); });
}).observe(document.body, { childList: true, subtree: true });
let toastTimer;
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}
function commit(rerender = true) {
  const c = C();
  if (c) c.updatedAt = Date.now();
  store.save();
  if (c?.table) table.schedule(c, () => { store.save(); const el = document.getElementById('table-status'); if (el) el.textContent = tableStatus(c); });
  if (rerender) render();
}
const F = {
  text: (name, label, val, cls = '', attrs = '') => `<div class="field ${cls}"><label>${label}</label><input name="${name}" value="${esc(val)}" ${attrs}></div>`,
  num: (name, label, val, cls = '', attrs = '') => `<div class="field ${cls}"><label>${label}</label><input type="number" inputmode="numeric" name="${name}" value="${esc(val)}" ${attrs}></div>`,
  area: (name, label, val, cls = 'full') => `<div class="field ${cls}"><label>${label}</label><textarea name="${name}">${esc(val)}</textarea></div>`,
  select: (name, label, val, opts, cls = '') => `<div class="field ${cls}"><label>${label}</label><select name="${name}">${opts.map((o) => {
    const [v, l] = Array.isArray(o) ? o : [o, o];
    return `<option value="${esc(v)}" ${String(v) === String(val) ? 'selected' : ''}>${esc(l)}</option>`;
  }).join('')}</select></div>`,
};

// ================= État de l'interface =================
const ui = {
  tab: localStorage.getItem('insmv.tab') || 'fiche',
  mode: 'normal', // normal | prog | libre | crea
  biblio: 'pouvoirs', q: '', onlyAccess: true, talFilter: 'tous', open: {},
  screen: (localStorage.getItem('insmv.screen') === 'mj' && mjLock.unlocked) ? 'mj' : 'perso', // perso | mj
  mjTab: 'vue', mjChar: null,
  // joueurs | combat | scen | journal | outils (anciens noms : table, memo, alea)
  mjSec: ({ table: 'joueurs', memo: 'journal', alea: 'outils' })[localStorage.getItem('insmv.mjsec')] || localStorage.getItem('insmv.mjsec') || (store.configured ? 'joueurs' : 'scen'),
  memoF: { open: false, pj: '', scen: '' }, // filtres du journal des choix
  scenId: localStorage.getItem('insmv.scen') || null, npcEdit: null, // { scene, npc }
  live: localStorage.getItem('insmv.live') || null, // id de la scène dont le combat est affiché
};
const TABS = [['fiche', 'Fiche', 'sheet'], ['combat', 'Combat', 'sword'], ['pouvoirs', 'Pouvoirs', 'wing'], ['sac', 'Sac', 'bag'], ['carnet', 'Carnet', 'folder'], ['vie', 'Vie privée', 'user'], ['biblio', 'Biblio', 'book']];
const MODES = {
  normal: { label: 'Jeu', icon: 'die', desc: 'Pour jouer : tout est verrouillé, toucher une valeur lance un test.' },
  prog: { label: 'PA', icon: 'star', desc: 'Dépenser les points d\'administration (PA) gagnés : caractéristique 2 PA/rang, talent 1 PA (principal + 1 secondaire offert), pouvoir selon son coût, PP 1 PA.' },
  libre: { label: 'Libre', icon: 'edit', desc: 'Corriger ou saisir un personnage existant : tout se modifie sans coût.' },
};
const isEdit = () => ui.mode === 'libre' || ui.mode === 'crea';
const isProg = () => ui.mode === 'prog';

// ================= Rendu principal =================
function render() {
  if (ui.screen === 'mj') { document.body.className = 'camp-mj'; $app.innerHTML = renderMJ(); return; }
  const c = C();
  document.body.className = c ? 'camp-' + (R.typeOf(c).camp) : '';
  if (!c) { $app.innerHTML = renderHome(); return; }
  if (c.creation === 'crea') ui.mode = 'crea';
  else if (ui.mode === 'crea') ui.mode = 'normal';
  const t = R.typeOf(c);
  const sup = R.supByName(c.superieur);
  const sub = [t.n + (t.tierName ? ' (' + t.tierName + ')' : ''), sup ? (t.camp === 'ange' ? 'de ' : 'de ') + sup.n : '', t.sup ? 'grade ' + (c.grade || 0) : ''].filter(Boolean).join(' · ');
  const st = store.status.state;
  $app.innerHTML = `
  <header class="top">
    <button class="ibtn" data-act="chars" title="Personnages">${icon('folder')}</button>
    ${miniOf(c) ? `<button class="avatar" data-act="chars" style="background-image:url('${miniOf(c)}')" aria-label="Personnages et tables"></button>` : ''}
    <div class="who click" data-act="chars" title="Personnages et tables"><h1>${esc(c.nom || 'Sans nom')} <span class="caret">▾</span></h1><div class="sub">${esc(sub)}${c.table ? ` · <span class="tbl">${esc(c.tableName || c.table)}</span>` : ''}</div></div>
    ${store.configured ? `<button class="ibtn" data-act="sync" title="${esc(store.status.message)}"><span class="sync ${st}"></span></button>` : ''}
    <button class="ibtn" data-act="help" data-v="joueur" title="Manuel du joueur">${icon('help')}</button>
    <button class="ibtn" data-act="freeroll" title="Lancer les dés">${icon('die')}</button>
    ${ui.mode === 'crea' ? '<span class="mode-btn crea">Création</span>' : `<button class="mode-btn ${ui.mode}" data-act="mode">${icon(MODES[ui.mode].icon)}${MODES[ui.mode].label}</button>`}
    <button class="ibtn" data-act="menu" title="Menu">${icon('dots')}</button>
  </header>
  <main>${renderBudget(c)}${renderTab(c)}</main>
  <nav class="tabs">${TABS.map(([k, l, ic]) => `<button class="${ui.tab === k ? 'on' : ''}" data-tab="${k}">${icon(ic)}${l}</button>`).join('')}</nav>`;
}

function renderHome() {
  return `<div class="home">
    <img class="cover" src="img/accueil.webp" alt="In Nomine Satanis / Magna Veritas">
    <h1>Grimoire INS/MV</h1>
    <p class="muted d">Feuille de personnage et générateur pour In Nomine Satanis / Magna Veritas, 4<sup>e</sup> édition.</p>
    <div class="row" style="justify-content:center;margin-top:14px">
      <button class="btn pri" data-act="new">${icon('plus')} Créer un personnage</button>
      <button class="btn" data-act="import">Importer un fichier</button>
      <button class="btn" data-act="help" data-v="joueur">${icon('help')} Manuel</button>
    </div>
    <div style="margin-top:10px"><button class="btn dark" style="border:1px solid #4a4a55" data-act="mj-enter">${icon('book')} Mode maître de jeu</button></div>
    ${store.configured ? `<div style="margin-top:12px"><button class="btn ghost" style="color:var(--on-dark);border-color:#4a4a55" data-act="sync">${icon('cloud')} Récupérer mes personnages (se connecter)</button>
      <p class="small muted d">${store.status.state === 'needauth' ? 'Tes personnages créés sur un autre appareil apparaîtront ici après connexion.' : esc(store.status.message || '')}</p></div>` : ''}
  </div>`;
}

function renderBudget(c) {
  if (ui.mode === 'crea') {
    const b = R.bilan(c); const t = b.t; const w = R.checks(c);
    const cat = (lab, v, q) => `<div class="${q && (v < q[0] || v > q[1]) ? 'bad' : ''}">${lab}<br><b>${v}</b>${q ? ` <span class="small">/ ${q[0]}–${q[1]}</span>` : ''}</div>`;
    return `<div class="budget"><div class="bt">Création sur mesure <span class="spacer"></span> PA restants <b>${b.reste}</b> / ${b.budget}</div>
      <div class="cats">${cat('Caracs', b.car, t.q.car)}${cat('Talents', b.tal, t.q.tal)}${t.q.pow ? cat('Pouvoirs', b.pow, t.q.pow) : '<div>Pouvoirs<br>—</div>'}${t.nopp ? '<div>PP<br>—</div>' : cat('PP', b.pp, t.tiers ? null : t.q.pp)}</div>
      ${w.length ? `<div class="warn">⚠ ${w.map(esc).join(' · ')}</div>` : ''}
      <div class="small hint" style="margin-top:4px">Talents : ${b.talP} rang(s) principal(aux), ${b.talS} secondaire(s) — 1 PA = 1 principal + 1 secondaire offert.${t.note ? ' ' + esc(t.note) : ''}</div>
      <div class="row end" style="margin-top:6px"><button class="btn sm" data-act="crea-cancel">Abandonner</button><button class="btn sm pri" data-act="crea-done">${icon('check')} Terminer la création</button></div></div>`;
  }
  if (ui.mode === 'prog') {
    const av = (+c.pa.total || 0) - (+c.pa.spent || 0);
    return `<div class="budget prog"><div class="bt">Progression <span class="spacer"></span> PA disponibles <b>${av}</b>
      ${c.secCredit ? `<span class="small">+ ${c.secCredit} rang(s) secondaire(s) offert(s)</span>` : ''}</div>
      <div class="small">Boutons dorés : coût en PA. Limites du grade ${c.grade || 0} : caracs ${L(R.gradeMax(c).car)}, talents ${L(R.gradeMax(c).tal)}, pouvoirs ${L(R.gradeMax(c).pow)}, ${R.gradeMax(c).pp} PP.</div></div>`;
  }
  return '';
}

function renderTab(c) {
  switch (ui.tab) {
    case 'combat': return renderCombat(c);
    case 'sac': return renderSac(c);
    case 'pouvoirs': return renderPouvoirs(c);
    case 'carnet': return renderCarnet(c);
    case 'vie': return renderVie(c);
    case 'biblio': return renderBiblio(c);
    default: return renderFiche(c);
  }
}

// ================= Fiche =================
function pmButtons(kind, key, sub = '') {
  const c = C();
  if (isEdit()) {
    return `<span class="pm"><button data-act="dec" data-k="${kind}" data-key="${esc(key)}" data-sub="${sub}">–</button><button class="plus" data-act="inc" data-k="${kind}" data-key="${esc(key)}" data-sub="${sub}">+</button></span>`;
  }
  if (isProg()) {
    const q = progQuote(c, kind, key, sub);
    if (!q) return '';
    return `<span class="pm"><span class="cost">${q.label}</span><button class="gold" ${q.ok ? '' : 'disabled'} data-act="buy" data-k="${kind}" data-key="${esc(key)}" data-sub="${sub}">+</button></span>`;
  }
  return '';
}

function renderFiche(c) {
  const a = R.annexes(c); const t = R.typeOf(c);
  const caracs = R.CARACS.map((k) => {
    const name = R.caracName(c, k.k);
    const inner = `<div class="ab">${k.k === 'foi' && c.chance ? 'Ch' : k.ab}</div><div class="v">${L(c.car[k.k])}</div><div class="n">${name}</div>`;
    return `<div>${ui.mode === 'normal' ? `<button class="carac" data-act="roll-car" data-key="${k.k}">${inner}</button>` : `<div class="carac">${inner}</div>`}
      ${ui.mode !== 'normal' ? `<div style="text-align:center;margin-top:4px">${pmButtons('car', k.k)}</div>` : ''}</div>`;
  }).join('');
  const ppm = R.ppMax(c);
  return `
  <section class="card">
    <h2>Caractéristiques <span class="tag">base 2 · un « + » = un rang</span></h2>
    <div class="grid g3 g-md-6">${caracs}</div>
    <div class="annexes">
      <span class="pill"><b>${a.pf}</b> PF</span>
      ${t.nopp ? '' : `<span class="pill"><b>${ppm}</b> PP</span>`}
      <span class="pill light">BL <b>${a.bl}</b></span><span class="pill light">BG <b>${a.bg}</b></span><span class="pill light">BF <b>${a.bf}</b></span><span class="pill light">MS <b>${a.ms}</b></span>
    </div>
    ${!t.nopp && (isEdit() || isProg()) ? `<div class="row" style="margin-top:8px"><span class="small muted">PP : base ${a.ppBase} (Vo + ${c.chance ? 'Ch' : 'Foi'}) + achetés ${c.ppAchat || 0} + bonus ${c.ppBonus || 0}</span><span class="spacer"></span>${pmButtons('pp', 'pp')}</div>` : ''}
  </section>
  ${renderTalents(c)}`;
}

function talentRow(c, name) {
  const d = R.talentDef(name);
  const t = c.tal[name] || {};
  const base = R.talentBase(c, name);
  const lvlG = base + (+t.r || 0);
  const novice = d && !d.inne && !(+t.r) && !(t.spe && +t.sr);
  const cat = R.talentCat(c, name);
  const speHtml = d && d.kind === 's' ? (t.spe
    ? `<button class="spe" data-act="spe" data-key="${esc(name)}">${esc(t.spe)} ${L(base + (+t.sr || 0))}</button>`
    : (isEdit() ? `<button class="spe" data-act="spe" data-key="${esc(name)}">+ spécialité</button>` : '')) : '';
  const click = ui.mode === 'normal' ? `class="trow click" data-act="roll-tal" data-key="${esc(name)}"` : 'class="trow"';
  const speBtns = d && d.kind === 's' && t.spe && ui.mode !== 'normal' ? `<span class="small muted">spé.</span>${pmButtons('spe', name)}` : '';
  return `<div ${click}>
    <div class="tn">${esc(name)} ${speHtml}${novice ? '<span class="novice">novice</span>' : ''}
      <br><small>${d?.car ? R.caracName(c, d.car) : 'aucune'} · ${d?.inne ? 'inné' : 'acquis'}${d?.cat === 'e' || d?.cat === 'psi' ? (cat === 's' ? ' · secondaire pour ce supérieur' : ' · exotique') : ''}</small></div>
    ${speBtns}
    <div class="tl ${+t.r ? '' : 'base'}">${L(lvlG)}</div>
    ${ui.mode !== 'normal' ? pmButtons('tal', name) : ''}
  </div>`;
}

function renderTalents(c) {
  const shown = (cat) => R.TALENTS.filter((t) => t.cat === cat && t.kind !== 'm' && t.kind !== 'lang');
  const filt = (list) => (ui.talFilter === 'acquis' ? list.filter((t) => +c.tal[t.n]?.r || c.tal[t.n]?.spe) : list);
  const exo = R.TALENTS.filter((t) => (t.cat === 'e' || t.cat === 'psi') && (c.tal[t.n] || (t.cat === 'psi' && c.type === 'psi')));
  const multi = c.multi.map((m, i) => `<div class="trow ${ui.mode === 'normal' ? 'click' : ''}" ${ui.mode === 'normal' ? `data-act="roll-multi" data-i="${i}"` : ''}>
      <div class="tn">${esc(m.t)} <button class="spe" data-act="multi-edit" data-i="${i}">${esc(m.label || '?')}</button></div>
      <div class="tl">${L(2 + (+m.r || 0))}</div>
      ${isEdit() ? `<span class="pm"><button data-act="dec" data-k="multi" data-key="${i}">–</button><button class="plus" data-act="inc" data-k="multi" data-key="${i}">+</button></span>` : ''}
      ${isProg() ? pmButtons('multi', i) : ''}
    </div>`).join('');
  return `
  <section class="card">
    <h2>Talents <span class="tag"><span class="seg"><button class="${ui.talFilter === 'tous' ? 'on' : ''}" data-act="talf" data-v="tous">Tous</button><button class="${ui.talFilter === 'acquis' ? 'on' : ''}" data-act="talf" data-v="acquis">Développés</button></span></span></h2>
    <div class="cols2">
      <h3>Principaux</h3>${filt(shown('p')).map((t) => talentRow(c, t.n)).join('')}
      <h3>Secondaires</h3>${filt(shown('s')).map((t) => talentRow(c, t.n)).join('')}
      ${exo.length ? `<h3>Exotiques</h3>${exo.map((t) => talentRow(c, t.n)).join('')}` : ''}
      <h3>Hobbies et métiers</h3>${multi || '<div class="empty">Aucun</div>'}
      <h3>Langues</h3>
      <div class="row">${c.langues.map((l, i) => `<span class="pill light">${esc(l)}${isEdit() ? ` <button class="spe" data-act="lang-del" data-i="${i}">×</button>` : ''}</span>`).join('') || '<span class="empty">Langue maternelle uniquement</span>'}</div>
    </div>
    ${isEdit() || isProg() ? `<div class="row" style="margin-top:10px">
      <button class="btn sm" data-act="add-exo">${icon('plus')} Talent exotique</button>
      <button class="btn sm" data-act="add-multi" data-v="Hobby">${icon('plus')} Hobby</button>
      <button class="btn sm" data-act="add-multi" data-v="Métier">${icon('plus')} Métier</button>
      <button class="btn sm" data-act="add-lang">${icon('plus')} Langue</button></div>` : ''}
    <p class="small muted" style="margin-bottom:0">Niveau de base = moitié de la caractéristique associée (1 si aucune). Un talent acquis au niveau de base ne permet que des tâches simples (« novice »). Le niveau général d'un talent spécifique ne peut dépasser celui de sa spécialité.</p>
  </section>`;
}

// ================= Combat =================
function bar(cur, max, cls = '') {
  const p = max > 0 ? Math.max(0, Math.min(100, (cur / max) * 100)) : 0;
  return `<div class="bar ${cls} ${cur <= max / 4 ? 'low' : ''}"><span style="width:${p}%"></span><em>${cur} / ${max}</em></div>`;
}
function renderCombat(c) {
  const a = R.annexes(c); const t = R.typeOf(c);
  const ppm = R.ppMax(c);
  if (c.pfCur == null) c.pfCur = a.pf;
  if (c.ppCur == null) c.ppCur = ppm;
  const malus = R.woundMalus(c);
  const prot = c.armures.filter((x) => x.portee !== false && !/bouclier/i.test(x.n + x.q)).reduce((s, x) => s + (+x.p || 0), 0);
  const fo = R.lvlInt(c.car.fo);
  const inHand = c.armes.map((w, i) => ({ w, i })).filter(({ w }) => w.main !== false);
  const weapons = inHand.map(({ w, i }) => {
    const tl = weaponLevel(c, w); const wf = weaponFx(c, w); const fo = effFo(c);
    return `<div class="trow">
      <div class="tn"><b>${esc(w.n)}</b><br><small>${esc(w.talent)}${w.spe ? ' (' + esc(w.spe) + ')' : ''} ${L(tl)} · précision ${sgn((+w.prec || 0) + wf.prec)} · puissance ${sgn((+w.puis || 0) + wf.puis)}${w.melee ? ` + Force ${fo}` : ''}${w.q ? ' · ' + esc(w.q) : ''}</small>
        ${fxLine([...wf.list.map((f) => `${esc(f.n)} : ${[f.prec ? `précision +${f.prec}` : '', f.puis ? `puissance +${f.puis}` : ''].filter(Boolean).join(', ')}`), ...wf.force.map((f) => `${esc(f.n)} : Force +${f.force} rang(s)`)])}</div>
      <button class="btn sm pri" data-act="attack" data-i="${i}">Attaquer</button>
    </div>`;
  }).join('');
  const stowed = c.armes.length - inHand.length;
  const worn = c.armures.filter((x) => x.portee !== false);
  const combatPows = c.pouvoirs.map((p, i) => ({ p, i })).filter(({ p }) => isCombatPower(p.n));
  const fx = activeFx(c);
  const human = t.camp === 'neutre' && c.chance;
  const etats = [c.pfCur <= -5 || (human && c.pfCur <= 0) ? 'Assommé' : c.pfCur <= 0 ? 'Étourdi (garde ses facultés mentales)' : ''].filter(Boolean);
  const fxCard = fx.length || etats.length ? `<div class="fx-box">
      ${etats.map((e) => `<span class="pill" style="background:var(--red)">${esc(e)}</span>`).join(' ')}
      ${fx.map((f) => { const i = c.pouvoirs.findIndex((x) => x.n === f.n); const d = R.powerDef(f.n) || {};
        return `<div class="fx-row"><div class="tn"><b>✦ ${esc(f.n)}</b><br><small>${esc(fxText(f))}${d.act ? ` · <span class="muted">${esc(d.act)}</span>` : ''}</small></div>
          ${f.once ? '' : `<button class="btn sm" data-act="pow-use" data-i="${i}" title="Repayer le coût pour prolonger">Renouveler</button>`}
          <button class="btn sm ghost" data-act="fx-off" data-key="${esc(f.n)}">Arrêter</button></div>`; }).join('')}
    </div>` : '';
  const dfx = defFx(c); const supM = fx.find((f) => f.n === 'Supériorité martiale');
  const pfx = protFx(c);
  return `
  <section class="card">
    <h2>État <span class="tag">${malus ? `malus des blessures ouvertes ${malus} col.` : 'aucun malus'}</span></h2>
    ${fxCard}
    <div class="tracker"><span class="lab">PF</span>${bar(c.pfCur, a.pf, 'pf')}<span class="pm"><button data-act="pf" data-v="-1">–</button><button class="plus" data-act="pf" data-v="1">+</button></span></div>
    ${t.nopp ? '' : `<div class="tracker" style="margin-top:8px"><span class="lab">PP</span>${bar(c.ppCur, ppm)}<span class="pm"><button data-act="pp" data-v="-1">–</button><button class="plus" data-act="pp" data-v="1">+</button></span></div>`}
    <div class="row" style="margin-top:10px">
      <button class="btn sm" data-act="pf-full">PF au maximum</button>
      ${t.nopp ? '' : `<button class="btn sm" data-act="pp-1">+1 PP (6 h sans pouvoir)</button><button class="btn sm" data-act="pp-full">PP au maximum</button><button class="btn sm" data-act="pp-to-pf">1 PP → 1 PF</button>`}
    </div>
    <p class="small muted" style="margin:8px 0 0">${t.camp === 'neutre' && c.chance ? 'Un humain à 0 PF est assommé (coma si blessures ouvertes) ; il récupère 1 PF par heure de repos.' : 'À 0 PF, l\'ange ou le démon est étourdi (il garde ses facultés mentales) ; à –5, assommé. Récupère 1 PF par minute.'}${R.supByName(c.superieur)?.rec ? ' Récupération des PP : ' + esc(R.supByName(c.superieur).rec) + '.' : ''}</p>
  </section>

  <section class="card">
    <h2>Blessures</h2>
    <div class="seuils"><div>BL<b>${a.bl}</b></div><div>BG<b>${a.bg}</b></div><div>BF<b>${a.bf}</b></div><div>MS<b>${a.ms}</b></div></div>
    <div style="margin-top:8px">${c.blessures.map((b, i) => `<div class="wound">
      <span class="g ${b.g}">${b.g}</span>
      <div class="tn" style="flex:1">${R.BLESSURES[b.g].n} ${b.note ? '<small class="muted">' + esc(b.note) + '</small>' : ''}<br><small class="muted">${b.ouverte ? `Ouverte${R.BLESSURES[b.g].malus ? ' · ' + R.BLESSURES[b.g].malus + ' col.' : ''} · hémorragie ${b.g === 'BL' ? 'rare' : '1 chance sur 6'}` : 'Refermée'}</small></div>
      ${b.ouverte && t.camp !== 'neutre' || (b.ouverte && ['paien', 'renegat_a', 'renegat_d'].includes(c.type)) ? `<button class="btn sm" data-act="close-med" data-i="${i}">Médecine</button>${t.nopp ? '' : `<button class="btn sm" data-act="close-pp" data-i="${i}">${R.GUERISON[b.g][1]} PP</button>`}` : ''}
      ${b.ouverte ? `<button class="btn sm" data-act="wound-close" data-i="${i}">Fermer</button>` : ''}
      <button class="ibtn" style="width:32px;height:32px" data-act="wound-del" data-i="${i}" title="Guérie">${icon('x')}</button>
    </div>`).join('') || '<div class="empty">Aucune blessure</div>'}</div>
    <div class="row" style="margin-top:8px"><button class="btn pri" data-act="hit">${icon('heart')} Encaisser un coup</button><button class="btn" data-act="wound-add">Ajouter une blessure</button></div>
    <p class="small muted" style="margin-bottom:0">Perte de PF : BL 1, BG 2, BF 4, MS 12 (ou la mort ; une créature surnaturelle survit sur un test standard de Force). Refermer une blessure : 1 minute et un test de Médecine (BL facile, BG difficile, BF très difficile, MS incroyable) ou 1 seconde et 1/2/4/12 PP.</p>
  </section>

  <section class="card">
    <h2>Attaques <span class="tag">Défense ${L(R.talentLevel(c, 'Défense'))}</span></h2>
    ${weapons || `<div class="empty">${c.armes.length ? 'Aucune arme en main' : 'Aucune arme'}</div>`}
    <div class="row" style="margin-top:8px">
      <button class="btn pri" data-act="defense">Se défendre</button>
      ${fxLine([...dfx.map((f) => `${esc(f.n)} : Défense ${sgn(f.v)}${f.once ? ' (prochain jet)' : ''}`), ...(supM ? [`Supériorité martiale : adversaires −${half(R.lvlInt(c.pouvoirs.find((x) => x.n === supM.n).r))} col. pour t’attaquer`] : [])])}
      <span class="spacer"></span>
      <button class="btn sm ghost" data-act="go-sac">${icon('bag')} ${stowed ? `${stowed} arme(s) rangée(s) · ` : ''}Gérer dans le Sac</button>
    </div>
    <p class="small muted" style="margin-bottom:0">Attaque et défense : test résisté. Si la défense réussit, sa MR est retranchée à celle de l'attaquant ; le coup porte si la MR finale est positive ou nulle. <b>Niveau de dommage</b> = MR finale + puissance de l'arme (+ Force au contact) – protection.</p>
  </section>

  <section class="card">
    <h2>Protection <span class="tag">${prot}${pfx.length ? ` + ${pfx.reduce((t2, f) => t2 + f.prot, 0)} (pouvoirs)` : ''}</span></h2>
    ${worn.length ? `<div class="small">${worn.map((x) => `<b>${esc(x.n)}</b> ${x.p}${x.q ? ` <span class="muted">(${esc(x.q)})</span>` : ''}`).join('<br>')}</div>` : (pfx.length ? '' : '<div class="empty">Aucune armure portée</div>')}
    ${fxLine(pfx.map((f) => `${esc(f.n)} : +${f.prot} contre les attaques ${esc(f.vs)}${f.note ? ' · ' + esc(f.note) : ''}`))}
    <p class="small muted" style="margin:6px 0 0">Couverture partielle : ignorée sur un double ou un triple de l'attaquant ; importante : sur un triple.</p>
    <div class="row" style="margin-top:6px"><span class="spacer"></span><button class="btn sm ghost" data-act="go-sac">${icon('bag')} Armures dans le Sac</button></div>
  </section>

  ${combatPows.length ? `<section class="card">
    <h2>Pouvoirs de combat ${t.nopp ? '' : `<span class="tag">${c.ppCur} / ${ppm} PP</span>`}</h2>
    ${combatPows.map(({ p, i }) => {
      const d = R.powerDef(p.n) || {}; const par = d.parent ? R.powerDef(d.parent) : null; const pp = ppCostOf(d.act || par?.act);
      const inv = (d.a && d.a.inv) || !p.r; const q = d.q || par?.q;
      return `<div class="trow"><div class="tn"><b>${esc(p.n)}</b>${inv ? '' : ` <span class="muted">${L(p.r)}</span>`}<br><small>${esc(d.s || par?.s || '')}${q && q !== '—' ? ' · ' + esc(q) : ''}</small></div>
        ${!t.nopp && pp ? `<button class="btn sm pri" data-act="pow-use" data-i="${i}" title="Dépense les PP (et lance le test si le pouvoir en demande un)">Activer · ${pp} PP</button>` : ''}
        ${inv ? '' : `<button class="btn sm" data-act="pow-roll" data-i="${i}" title="Lance le test sans dépenser de PP">Test</button>`}</div>`;
    }).join('')}
    <p class="small muted" style="margin-bottom:0">Tous les pouvoirs, avec leur description, sont dans l'onglet Pouvoirs.</p>
  </section>` : ''}

  <section class="card">
    <h2>Modificateurs</h2>
    <table class="ref">${R.MODIFS_ATTAQUE.map(([a2, b]) => `<tr><td>${a2}</td><td>${b}</td></tr>`).join('')}</table>
    <p class="small muted" style="margin-bottom:0">Main gauche (Ag 3) : +1 Combat, +1 Défense, –1 puissance. Deux armes (Fo 3) : +1 Combat, +1 puissance, –1 Défense. Arme à deux mains tenue à une main (Fo 4) : –1 puissance. Talent inférieur à 2 : une attaque tous les deux tours.</p>
  </section>`;
}
// ---- Effets actifs des pouvoirs (texte des pouvoirs, livre de règles chap. 3) ----
// n = niveau du pouvoir (sans les « + »). prot : protection contre « vs » ; force : rangs de Force ;
// def : colonnes au test de Défense (once : seulement le prochain) ; prec/puis : bonus aux attaques,
// scope : all (toutes les armes), contact (armes de contact), mains (Corps à corps, mains nues) ; note : rappel affiché
const half = (n, up) => (up ? Math.ceil(n / 2) : Math.floor(n / 2));
const POW_FX = {
  'Armure corporelle': (n) => ({ prot: n + 1, vs: 'solides et énergie' }),
  'Champ de force': (n) => ({ prot: n + 1, vs: 'solides' }),
  'Rebond': (n) => ({ prot: n, vs: 'solides', note: 'blessé : 2 PP pour renvoyer le coup à l’agresseur' }),
  'Couche de glace': (n) => ({ prot: n + 2, vs: 'solides et feu' }),
  'Champ magnétique': (n) => ({ prot: n + 2, vs: 'métal et électricité' }),
  'Graisse': (n) => ({ prot: n, vs: 'solides' }),
  'Élastique': (n) => ({ prot: n + 1, vs: 'contondantes' }),
  'Colère divine': (n) => ({ prot: n + 1, vs: 'solides et énergie', puis: n + 2, scope: 'contact' }),
  'Tourbillon de feu': (n) => ({ prot: n + 3, vs: 'froid et glace', puis: n, scope: 'mains', note: 'qui le touche est brûlé' }),
  'Champ électrique': (n) => ({ puis: n, scope: 'mains', note: 'qui le touche reçoit un choc électrique' }),
  'Peau acide': (n) => ({ puis: n, scope: 'mains', note: 'qui le touche est brûlé par l’acide' }),
  'Furie': (n) => ({ force: n + 1, def: -2 }),
  'Fureur guerrière': (n) => ({ force: n + 1, def: -2, note: 'impossible d’arrêter tant qu’il reste des ennemis et des PP' }),
  'Feu prométhéen': (n) => ({ puis: n + 2, scope: 'all' }),
  'Arme exaltée': (n) => ({ prec: half(n), puis: half(n, true), scope: 'all' }),
  'Supériorité martiale': (n) => ({ prec: half(n, true), scope: 'all', note: `ses adversaires : −${half(n)} col. pour l’attaquer` }),
  'Juste-lame': (n) => ({ note: `+${n + 3} puissance contre les forces du mal (épées)` }),
  'Esquive acrobatique': (n) => ({ def: 2 * n + 3, once: true, note: 'même contre une attaque normalement imparable' }),
};
const SCOPE_TXT = { all: 'toutes les armes', contact: 'armes de contact', mains: 'mains nues' };
// Effets en cours du personnage : pouvoirs activés qui ont un effet connu
function activeFx(c) {
  return (c.effets || []).map((e) => {
    const p = c.pouvoirs.find((x) => x.n === e.n); const f = POW_FX[e.n];
    return p && f ? { n: e.n, ...f(R.lvlInt(p.r)) } : null;
  }).filter(Boolean);
}
const fxForce = (c) => activeFx(c).reduce((t, f) => t + (f.force || 0), 0);
const effFo = (c) => R.lvlInt(c.car.fo + fxForce(c)); // niveau de Force ajouté aux dégâts au contact
function weaponFx(c, w) {
  const ok = (sc) => sc === 'all' || (sc === 'contact' && w.melee) || (sc === 'mains' && w.talent === 'Corps à corps');
  const list = activeFx(c).filter((f) => (f.prec || f.puis) && ok(f.scope));
  const force = w.melee ? activeFx(c).filter((f) => f.force) : [];
  return { prec: list.reduce((t, f) => t + (f.prec || 0), 0), puis: list.reduce((t, f) => t + (f.puis || 0), 0), list, force };
}
const defFx = (c) => activeFx(c).filter((f) => f.def).map((f) => ({ n: f.n, v: f.def, once: !!f.once }));
const protFx = (c) => activeFx(c).filter((f) => f.prot);
function fxText(f) {
  return [f.prot ? `protection +${f.prot} (${f.vs})` : '', f.force ? `Force +${f.force} rang(s)` : '',
    f.def ? `Défense ${sgn(f.def)} col.${f.once ? ' au prochain jet' : ''}` : '', f.prec ? `précision +${f.prec}` : '',
    f.puis ? `puissance +${f.puis} (${SCOPE_TXT[f.scope]})` : '', f.note || ''].filter(Boolean).join(' · ');
}
// Une ligne « ✦ effet » dans une carte
const fxLine = (items) => (items.length ? `<div class="fx-line">${items.map((x) => `<span>✦ ${x}</span>`).join('')}</div>` : '');
// Pouvoirs utiles en combat : attaques physiques, attaques qui blessent, pouvoirs de protection ou de bonus au combat
const COMBAT_POW = /^(armure corporelle|arme exaltée|art de combat|art de la parade|arts martiaux|augmentation d'agilité|augmentation de force|aura de courage|champ de force|champ électrique|champ magnétique|colère divine|conversion physique|couche de glace|cri de guerre|douleur|élastique|esquive acrobatique|éventration|feu prométhéen|forme de combat|frappe ultime|fureur guerrière|furie|graisse|guérison|juste-lame|maîtrise martiale|maladie|membre blindé|membre exotique|némésis|peau acide|poison|rebond|régénération|sacrifice ultime|supériorité martiale|tourbillon de feu|transfert de blessures|vitesse|volonté supra-normale)/i;
function isCombatPower(name) {
  if (COMBAT_POW.test(name)) return true;
  const d = R.powerDef(name) || {}; const par = d.parent ? R.powerDef(d.parent) : null;
  const q = d.q || par?.q || ''; const txt = d.s || par?.s || '';
  return /attaque physique/i.test(q) || (/attaque/i.test(q) && /(dégât|dommage|bless|brûl|électrocut|frapp|\bPF\b)/i.test(txt));
}
// ================= Sac : armes, armures et boucliers, équipement, possessions =================
function renderSac(c) {
  c.sac ||= [];
  const fo = R.lvlInt(c.car.fo);
  const prot = c.armures.filter((x) => x.portee !== false && !/bouclier/i.test(x.n + x.q)).reduce((t, x) => t + (+x.p || 0), 0);
  const weapons = c.armes.map((w, i) => `<div class="trow ${w.main === false ? 'stowed' : ''}">
      <div class="tn"><b>${esc(w.n)}</b><br><small>${esc(w.talent)}${w.spe ? ' (' + esc(w.spe) + ')' : ''} ${L(weaponLevel(c, w))} · précision ${sgn(+w.prec || 0)} · puissance ${sgn(+w.puis || 0)}${w.melee ? ` + Force ${fo}` : ''}${w.q ? ' · ' + esc(w.q) : ''}</small></div>
      <button class="btn sm ${w.main === false ? '' : 'dark'}" data-act="weapon-hand" data-i="${i}" title="Les armes en main apparaissent dans l'onglet Combat">${w.main === false ? 'Rangée' : 'En main'}</button>
      <button class="ibtn" style="width:32px;height:32px" data-act="weapon-del" data-i="${i}" title="Retirer">${icon('trash')}</button>
    </div>`).join('');
  const armors = c.armures.map((x, i) => `<div class="trow ${x.portee === false ? 'stowed' : ''}"><div class="tn"><b>${esc(x.n)}</b><br><small>protection ${x.p}${x.q ? ' · ' + esc(x.q) : ''}${x.fmin ? ' · Force min. ' + esc(x.fmin) : ''}</small></div>
      <button class="btn sm ${x.portee === false ? '' : 'dark'}" data-act="armor-toggle" data-i="${i}">${x.portee === false ? 'Rangée' : 'Portée'}</button>
      <button class="ibtn" style="width:32px;height:32px" data-act="armor-del" data-i="${i}" title="Retirer">${icon('trash')}</button></div>`).join('');
  const items = c.sac.map((it, i) => `<div class="trow sac-item">
      <input class="inp" value="${esc(it.n)}" data-sac="${i}" aria-label="Objet">
      <span class="stepper"><button data-act="sac-nb" data-i="${i}" data-v="-1">–</button><b>${it.nb ?? 1}</b><button data-act="sac-nb" data-i="${i}" data-v="1">+</button></span>
      <button class="ibtn" style="width:32px;height:32px" data-act="sac-del" data-i="${i}" title="Retirer">${icon('trash')}</button></div>`).join('');
  return `
  <section class="card">
    <h2>Armes <span class="tag">${c.armes.filter((w) => w.main !== false).length} en main</span></h2>
    ${weapons || '<div class="empty">Aucune arme</div>'}
    <div class="row" style="margin-top:8px"><button class="btn" data-act="weapon-add">${icon('plus')} Arme</button></div>
    <p class="small muted" style="margin-bottom:0">Les armes <b>en main</b> sont proposées dans l'onglet Combat pour attaquer ; les autres restent rangées ici.</p>
  </section>
  <section class="card">
    <h2>Armures et boucliers <span class="tag">protection portée : ${prot}</span></h2>
    ${armors || '<div class="empty">Aucune</div>'}
    <div class="row" style="margin-top:8px"><button class="btn" data-act="armor-add">${icon('plus')} Armure ou bouclier</button></div>
    <p class="small muted" style="margin-bottom:0">Les protections <b>portées</b> sont retirées des dégâts dans l'onglet Combat. Force minimale non atteinte : −2 colonnes à toutes les actions physiques.</p>
  </section>
  <section class="card">
    <h2>Équipement</h2>
    ${items || '<div class="empty">Sac vide</div>'}
    <div class="row" style="margin-top:8px"><input class="inp" id="sac-new" placeholder="Téléphone, crucifix, lampe torche…" style="flex:1;min-width:160px"><button class="btn" data-act="sac-add">${icon('plus')} Ajouter</button></div>
  </section>
  <section class="card">
    <h2>Possessions</h2>
    <div class="grid" data-form="id">${F.area('possessions', 'Biens, planques, contacts, ressources', c.possessions)}</div>
  </section>`;
}
function weaponLevel(c, w) {
  if (w.talent === 'Combat' || w.talent === 'Tir') {
    const t = c.tal[w.talent];
    if (t && t.spe && w.spe && norm(t.spe) === norm(w.spe)) return R.talentSpe(c, w.talent);
    if (w.talent === 'Tir' && w.pouvoir) { const p = c.pouvoirs.find((x) => x.n === w.pouvoir); if (p) return Math.max(p.r, R.talentLevel(c, 'Tir')); }
  }
  return R.talentLevel(c, w.talent);
}

// ================= Pouvoirs =================
const ppCostOf = (act) => { const m = String(act || '').match(/(\d+)\s*PP/); return m ? +m[1] : null; };
// Résumé d'un pouvoir (1 ou 2 phrases), affiché sans ouvrir la description
const powSum = (d, par) => { const s = d?.s || par?.s; return s ? `<div class="psum">${esc(s)}</div>` : ''; };
function renderPouvoirs(c) {
  const t = R.typeOf(c); const sup = R.supByName(c.superieur);
  const list = c.pouvoirs.map((p, i) => {
    const d = R.powerDef(p.n) || {}; const par = d.parent ? R.powerDef(d.parent) : null;
    const desc = d.d || par?.d || '';
    const pp = ppCostOf(d.act || par?.act);
    const inv = (d.a && d.a.inv) || !p.r;
    const open = ui.open['p' + i];
    return `<div class="pow">
      <div class="ph"><div class="pn">${esc(p.n)}${p.free ? ' <span class="badge">gratuit</span>' : ''}</div>
        ${ui.mode !== 'normal' && !inv ? pmButtons('pow', i) : ''}
        <div class="pl">${inv ? '—' : L(p.r)}</div></div>
      <div class="meta">${d.nat ? `<span class="badge ${d.nat}">${d.nat}</span>` : ''}${esc(d.act || par?.act || '')}${d.q && d.q !== '—' ? ' · ' + esc(d.q) : ''}</div>
      ${powSum(d, par)}
      <div class="row" style="margin-top:6px">
        ${!t.nopp && pp ? `<button class="btn sm pri" data-act="pow-use" data-i="${i}">Activer (${pp} PP)</button>` : ''}
        ${!inv ? `<button class="btn sm" data-act="pow-roll" data-i="${i}">Test de pouvoir</button>` : ''}
        ${d.rune ? '' : `<button class="btn sm ghost" data-act="toggle" data-key="p${i}">${open ? 'Masquer' : 'Description'}</button>`}
        <span class="spacer"></span>
        ${ui.mode !== 'normal' ? `<button class="ibtn" style="width:32px;height:32px" data-act="pow-del" data-i="${i}">${icon('trash')}</button>` : ''}
      </div>
      ${open ? `<div class="desc">${esc(desc || 'Pas de description.')}${d.var ? '\n\n' + esc(d.var) : ''}${p.notes ? '\n\nNotes : ' + esc(p.notes) : ''}</div>` : ''}
    </div>`;
  }).join('');
  const doms = sup && sup.dom ? sup.dom.split(',').map((x) => x.trim()) : [];
  return `
  <section class="card">
    <h2>Pouvoirs ${t.nopp ? '' : `<span class="tag">${c.ppCur ?? R.ppMax(c)} / ${R.ppMax(c)} PP</span>`}</h2>
    ${list || '<div class="empty">Aucun pouvoir</div>'}
    ${isEdit() || isProg() ? `<div class="row"><button class="btn" data-act="pow-add">${icon('plus')} ${c.type === 'paien' ? 'Ajouter une rune ou un pouvoir' : 'Ajouter un pouvoir'}</button></div>` : ''}
    <p class="small muted" style="margin-bottom:0">Pouvoir activé : une seconde de concentration. Constant : se renouvelle en repayant le coût. Les PP se récupèrent à raison de 1 toutes les 6 heures sans utiliser de pouvoir.${c.type === 'psi' ? ' Psionique : un test du talent associé est nécessaire avant chaque utilisation.' : ''}</p>
  </section>
  ${t.sup ? `<section class="card">
    <h2>Pouvoirs de grade <span class="tag">grade ${c.grade || 0}</span></h2>
    ${doms.length ? doms.map((dm) => { const k = dm.replace('*', ''); const v = +c.gradeDom[k] || 0; return `<div class="trow"><div class="tn">${esc(k)}${dm.includes('*') ? ' <small class="muted">(grade 2+, accord du MJ)</small>' : ''}<br><small class="muted">${esc(R.GRADE_POUVOIRS.slice(1, v + 1).join(' · ') || 'non développé')}</small></div>
      <div class="tl">${v}</div>${ui.mode !== 'normal' ? `<span class="pm"><button data-act="dom" data-key="${esc(k)}" data-v="-1">–</button><button class="plus" data-act="dom" data-key="${esc(k)}" data-v="1">+</button></span>` : ''}</div>`; }).join('') : '<div class="empty">Choisis un supérieur dans le carnet.</div>'}
    <p class="small muted" style="margin-bottom:0">Gratuits, sans PP. À chaque grade : deux niveaux dans un domaine ou un niveau dans deux domaines. 1 détection, 2 création mineure (tentation/sermon), 3 perception, 4 création majeure (ruine/vertu), 5 connaissance, 6 contrôle.</p>
  </section>` : ''}
  ${c.type === 'paien' ? `<section class="card"><h2>Héros païens</h2>${Object.entries(R.PANTHEONS).map(([k, v]) => `<p><b>${k}</b> : <span class="small">${esc(v)}</span></p>`).join('')}
    <h3>Runes vikings</h3><table class="ref">${R.RUNES.map(([n, pa, d]) => `<tr><td><b>${n}</b></td><td>${pa} PA</td><td class="small">${esc(d)}</td></tr>`).join('')}</table></section>` : ''}`;
}

// ================= Carnet =================
// ---- Hiérarchie : invocation, blâmes, avertissements, récompenses (livret de règles, ch. 4) ----
const d66 = () => (1 + Math.floor(Math.random() * 6)) * 10 + 1 + Math.floor(Math.random() * 6);
// Ligne d'une table d66 dont la colonne d vaut « 11-14 » ou « 36 »
const d66Row = (table, d) => table.find((r) => { const [a, b] = String(r.d).split('-').map(Number); return d >= a && d <= (b || a); });
// Faces du d6 qui partagent le même blâme : [[1, 2, texte], [3, 4, texte]…]
const blameGroups = (b) => b.reduce((g, t, i) => { const last = g[g.length - 1]; if (last && last[2] === t) last[1] = i + 1; else g.push([i + 1, i + 1, t]); return g; }, []);
function hierBlock(c, sup) {
  const h = SUP_HIER[sup.n]; const g = +c.grade || 0;
  return `<div class="small" style="margin-top:8px">
      ${h?.grades && g > 0 && h.grades[g - 1] ? `<b>Titre de grade ${g}</b> : ${esc(h.grades[g - 1])}<br>` : ''}
      ${h?.inv ? `<b>Invocation</b> : ${esc(h.inv)}` : ''}${h?.com != null ? `${h?.inv ? ' · ' : ''}<b>Communication</b> : ${esc(String(h.com))}` : ''}${h?.inv || h?.com != null ? '<br>' : ''}
      ${h?.intervention ? `<b>Quand on l'invoque</b> : ${esc(h.intervention)}<br>` : ''}
      ${h?.blames ? `<b>Blâmes (d6)</b> : ${blameGroups(h.blames).map(([a, b, txt]) => `${a === b ? a : a + '-' + b}. ${esc(txt || '—')}`).join(' · ')}` : ''}
    </div>
    <div class="row" style="margin-top:8px">${h?.invKey ? `<button class="btn sm pri" data-act="hier-invoke">Invoquer ${esc(sup.n)}</button>` : ''}<button class="btn sm" data-act="hier-rules">Règles de la hiérarchie</button></div>`;
}
// Invocation du supérieur : test de Foi contre son facteur d'invocation, modifié par la table du livre
function invokeDialog(c) {
  const sup = R.supByName(c.superieur); const h = SUP_HIER[sup?.n]; if (!h?.invKey) return;
  if (c.chance) return toast('L\'invocation se fait avec la Foi : impossible avec la Chance');
  const av = (+c.pa.total || 0) - (+c.pa.spent || 0); const g = +c.grade || 0;
  const paMod = av < -10 ? -8 : av <= 0 ? -4 : av <= 10 ? -2 : av <= 20 ? 0 : av <= 30 ? 1 : 2;
  const SIT = [['futile', 'Demande futile', -3], ['vie', 'Situation de vie ou de mort', 1], ['adv', 'Supérieur du camp adverse présent', 1],
    ['ennemi', 'Ennemi personnel du supérieur présent', 2], ['terre', 'Le supérieur est sur terre (et +2 à la MR)', -1], ['retry', 'Deuxième essai dans l\'heure', -4]];
  const LAST = [['', 'Jamais / plus d\'un an', 1], ['1', 'Moins d\'un mois', -4], ['6', 'Entre un et six mois', -2], ['12', 'Entre sept et douze mois', 0]];
  const diff = R.DIFFICULTES.find((d) => d.k === h.invKey);
  dialog(`Invoquer ${sup.n}`, `<p class="small" style="margin-top:0">Test de <b>Foi</b> (${L(c.car.foi)}) contre la difficulté <b>${esc(h.inv)}</b> (${diff.n}).</p>
    ${SIT.map(([k, n, m]) => `<label class="small" style="display:block"><input type="checkbox" data-inv="${k}" data-m="${m}"> ${esc(n)} (${sgn(m)})</label>`).join('')}
    <div class="field" style="margin-top:8px"><label>Dernière invocation réussie</label><select id="inv-last">${LAST.map(([k, n, m]) => `<option value="${m}">${esc(n)} (${sgn(m)})</option>`).join('')}</select></div>
    <p class="small muted">Automatique : grade ${g} (${sgn(g)}), PA disponibles ${av} (${sgn(paMod)}).</p>`,
  `<button class="btn" data-dact="close">Annuler</button><button class="btn pri" id="inv-go">Lancer le test</button>`);
  dlg.querySelector('#inv-go').onclick = () => {
    const boxes = [...dlg.querySelectorAll('[data-inv]:checked')];
    const shift = boxes.reduce((a, b) => a + +b.dataset.m, 0) + +dlg.querySelector('#inv-last').value + g + paMod;
    const terre = boxes.some((b) => b.dataset.inv === 'terre');
    closeDlg();
    openRoll({ label: `Invocation de ${sup.n}`, r: c.car.foi, char: c, after: (res) => {
      const mr = res.mr + (terre ? 2 : 0);
      const row = HIERARCHIE.invocation.resultats.find((x) => { const m = String(x.mr).match(/^(\d+)(?:-(\d+)|\+)?/); return m && mr >= +m[1] && (x.mr.endsWith('+') || mr <= +(m[2] || m[1])); });
      return `${terre ? `MR ${mr} avec le bonus du supérieur sur terre. ` : ''}${esc(row?.effet || '')}${h.intervention ? `<br><i>${esc(h.intervention)}</i>` : ''}`;
    } });
    rollState.diff = h.invKey; rollState.shift = shift; showRoll();
  };
}
function hierRulesDialog(c) {
  const H = HIERARCHIE; const li = (rows, a, b) => `<ul class="small">${rows.map((r) => `<li><b>${esc(String(r[a]))}</b> : ${esc(String(r[b] ?? ''))}</li>`).join('')}</ul>`;
  const com = H.communication;
  dialog('Règles de la hiérarchie', `<div class="small">
    <h3>Invocation</h3><p>${esc(H.invocation.principe)}</p><p>${esc(H.invocation.test)}</p>${li(H.invocation.modificateurs, 'cond', 'mod')}${li(H.invocation.resultats, 'mr', 'effet')}<p class="muted">${esc(H.invocation.notes || '')}</p>
    <h3>Communication</h3><p>${esc(com.principe)}</p>${(com.methodes || []).map((m) => `<p><b>${esc(m.n)}</b> — ${esc(m.difficulte || '')}${m.risque ? ` · ${esc(m.risque)}` : ''}</p>`).join('')}
    ${com.modificateurs ? li(com.modificateurs, 'cond', 'mod') : ''}${com.arrivee ? `<p><b>Délai d'arrivée</b> : ${esc(typeof com.arrivee === 'string' ? com.arrivee : (Array.isArray(com.arrivee) ? com.arrivee.map((a) => Object.values(a).join(' : ')).join(' ; ') : JSON.stringify(com.arrivee)))}</p>` : ''}
    <h3>Récompenses</h3><p>${esc(H.recompenses.principe || '')}</p>${H.recompenses.bareme ? li(H.recompenses.bareme, 'cond', 'pa') : ''}<p><b>Demander</b> : ${esc(H.recompenses.demander || '')}</p><p><b>Exiger</b> : ${esc(H.recompenses.exiger || '')}</p>${li(H.recompenses.table, 'd', 'effet')}
    <h3>Avertissements</h3><p>${esc(H.avertissements.principe)}</p>${li(H.avertissements.table, 'd', 'effet')}
    <h3>Blâmes</h3><p>${esc(H.blames.principe)}</p>
    <p class="muted">${esc(H.pages || '')}</p></div>`);
}
// ---- Portrait du personnage (comme la fiche Dragonbane) ----
// Image réduite en JPEG et gardée dans la fiche : elle suit la sauvegarde en ligne et l'export.
// portrait : 600 × 800 au plus (~200 Ko) ; portraitMini : vignette (~15 Ko) pour la bannière, le sélecteur et la table du MJ
function readPortrait(file, maxW = 600, maxH = 800, maxLen = 270000) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const k = Math.min(1, maxW / img.width, maxH / img.height);
      const cv = document.createElement('canvas');
      cv.width = Math.round(img.width * k); cv.height = Math.round(img.height * k);
      const g = cv.getContext('2d');
      g.fillStyle = '#1d1d23'; g.fillRect(0, 0, cv.width, cv.height); // fond des images transparentes
      g.drawImage(img, 0, 0, cv.width, cv.height);
      let q = 0.85; let data = cv.toDataURL('image/jpeg', q);
      while (data.length > maxLen && q > 0.45) { q -= 0.1; data = cv.toDataURL('image/jpeg', q); }
      resolve(data);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image illisible')); };
    img.src = url;
  });
}
// Téléphone ou tablette : on propose aussi l'appareil photo
const canCamera = () => matchMedia('(pointer: coarse)').matches;
function chooseImage(camera, onFile) {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = 'image/*';
  if (camera) inp.setAttribute('capture', 'user');
  inp.onchange = () => { const f = inp.files[0]; if (f) onFile(f); };
  inp.click();
}
function pickPortrait(camera = false) {
  const c = C(); if (!c) return;
  chooseImage(camera, async (f) => {
    try {
      c.portrait = await readPortrait(f);
      c.portraitMini = await readPortrait(f, 160, 200, 20000);
      commit(); toast('Portrait ajouté');
    } catch (e) { toast(e.message || 'Image illisible'); }
  });
}
const miniOf = (c) => c?.portraitMini || c?.portrait || '';
// Pastille ronde : portrait, sinon l'initiale
const crest = (c, cls = '') => (miniOf(c) ? `<span class="crest photo ${cls}" style="background-image:url('${miniOf(c)}')"></span>`
  : `<span class="crest ${cls}">${esc((c?.nom || '?').trim().charAt(0).toUpperCase())}</span>`);
// Colonne portrait de la carte Identité : l'image, ou un cadre vide avec les boutons d'ajout
function portraitBox(c) {
  if (!c.portrait) {
    return `<div class="id-photo empty">
      <div class="ph-frame">${icon('image')}<small>Portrait</small></div>
      ${canCamera() ? '<button class="btn sm" data-act="portrait-pick" data-cam="1">Photo</button>' : ''}
      <button class="btn sm" data-act="portrait-pick">${canCamera() ? 'Image' : 'Ajouter'}</button>
    </div>`;
  }
  return `<div class="id-photo"><button class="portrait" data-act="portrait-view" aria-label="Voir le portrait"><img src="${c.portrait}" alt="Portrait de ${esc(c.nom || 'ton personnage')}"></button></div>`;
}
function portraitDialog() {
  const c = C(); if (!c?.portrait) return;
  dialog(esc(c.nom || 'Portrait'), `<img class="portrait-full" src="${c.portrait}" alt="Portrait de ${esc(c.nom || 'ton personnage')}">`,
    `<button class="btn ghost" data-dact="portrait-del">Retirer</button><span class="spacer"></span>${canCamera() ? '<button class="btn" data-dact="portrait-cam">Photo</button>' : ''}<button class="btn pri" data-dact="portrait-change">Changer</button>`);
}
// ================= Vie privée =================
// c.vie = { q: { 'ange-0': 'b', … }, bg: 'background' }
const vieCamp = (c) => (R.TYPES[c.type]?.sup ? R.TYPES[c.type].camp : '');
function vieAnswers(c) { // [question, réponse choisie] des questions qui s'appliquent
  const camp = vieCamp(c); const Q = VIE_Q[camp]; const a = c.vie?.q || {};
  if (!Q) return [];
  return Q.qs.map((x, i) => [x, a[`${camp}-${i}`], i]).filter(([x]) => !x.dep || a[`${camp}-${x.dep.q}`] === x.dep.v);
}
function renderVie(c) {
  const camp = vieCamp(c); const Q = VIE_Q[camp]; const a = c.vie?.q || {};
  const qs = vieAnswers(c);
  const done = qs.filter(([, v]) => v).length;
  return `${Q ? `<section class="card">
    <h2>${campIco(camp)} Questionnaire de vie privée <span class="tag">${done}/${qs.length}</span></h2>
    <p class="small muted" style="margin-top:0">Ce que fait ton ${camp === 'ange' ? 'ange' : 'démon'} quand il n’est pas en mission. Choisis une réponse par question (touche-la de nouveau pour l’enlever). <i>${esc(Q.ref)}</i></p>
    ${qs.map(([x, v, i]) => `<div class="vie-q${x.dep ? ' sub' : ''}"><div class="vie-h">${esc(x.q)}</div>
      ${x.opts.map((o) => `<button class="choice vie-o${v === o.k ? ' on' : ''}" data-act="vie-pick" data-key="${camp}-${i}" data-v="${o.k}"><span><b>${o.k}.</b> ${esc(o.t)}</span></button>`).join('')}</div>`).join('')}
  </section>` : `<section class="card"><h2>Questionnaire de vie privée</h2><p class="small muted" style="margin:0">Le livre en propose un pour les anges et un pour les démons. Pour ton personnage, raconte sa vie privée dans le background ci-dessous.</p></section>`}
  <section class="card"><h2>Background</h2>
    <div class="grid" data-form="vie"><div class="field full"><label>Histoire du personnage, avant et depuis son incarnation</label>
      <textarea name="vie.bg" rows="10" placeholder="D’où il vient, ce qu’il a vécu, ses proches, ses secrets, ce qui le fait avancer…">${esc(c.vie?.bg || '')}</textarea></div></div>
    <p class="small muted" style="margin-bottom:0">Visible du MJ quand ta fiche est partagée avec une table.</p>
  </section>`;
}
function renderCarnet(c) {
  const t = R.typeOf(c); const sup = R.supByName(c.superieur);
  const id = c.identite;
  const locked = ui.mode === 'normal';
  const supOpts = [['', '— aucun —'], ...R.SUPERIEURS.filter((s) => s.camp === t.camp || t.camp === 'neutre').map((s) => [s.n, s.n + ' — ' + s.titre + (s.src === 'dudule' ? ' (Dudule)' : '')])];
  const av = (+c.pa.total || 0) - (+c.pa.spent || 0);
  return `
  <section class="card">
    <h2>Identité</h2>
    <div class="id-wrap">
      <div class="grid g2" data-form="id">
        ${F.text('nom', 'Nom', c.nom, 'full')}
        ${F.text('identite.corps', 'Corps d\'accueil / identité humaine', id.corps)}
        ${F.text('identite.age', 'Âge apparent', id.age)}
        ${F.text('identite.metier', 'Métier / couverture', id.metier)}
        ${F.text('identite.contact', 'Contact', id.contact)}
        ${F.area('identite.apparence', 'Apparence, personnalité', id.apparence)}
      </div>
      ${portraitBox(c)}
    </div>
  </section>
  <section class="card">
    <h2>${t.camp === 'ange' ? 'Hiérarchie céleste' : t.camp === 'demon' ? 'Hiérarchie infernale' : 'Nature'}</h2>
    <div class="grid g2" data-form="id">
      ${F.select('type', 'Type', c.type, Object.entries(R.TYPES).map(([k, v]) => [k, v.n]), '', locked ? 'disabled' : '')}
      ${t.tiers ? F.select('tier', 'Puissance', c.tier || 0, t.tiers.map((x, i) => [i, x[0] + ' (' + x[1] + ' PA)'])) : '<div></div>'}
      ${t.sup || t.camp !== 'neutre' ? F.select('superieur', t.camp === 'ange' ? 'Archange' : 'Prince-démon', c.superieur, supOpts) : ''}
      ${t.sup ? F.select('grade', 'Grade', c.grade || 0, [0, 1, 2, 3].map((g) => [g, 'Grade ' + g])) : ''}
      ${F.select('chance', 'Caractéristique d\'âme', c.chance ? '1' : '0', [['0', 'Foi'], ['1', 'Chance']])}
      ${t.renegat ? F.select('apostat', 'Apostat', c.apostat ? '1' : '0', [['0', 'Non'], ['1', 'Oui (Chance, aura grise)']]) : ''}
    </div>
    ${sup ? `<div style="margin-top:10px" class="small">
      <b>${esc(sup.n)}</b>, ${esc(sup.titre)}${sup.prof ? ` · profil courant : ${esc(sup.prof)}` : ''}<br>
      ${sup.desc ? `<p class="supdesc">${esc(sup.desc)}</p>` : ''}
      ${sup.rec ? `<b>Récupération des PP</b> : ${esc(sup.rec)}<br>` : ''}
      ${sup.promo ? `<b>Gagner des PA</b> : ${esc(sup.promo)}<br>` : ''}
      ${sup.dom ? `<b>Domaines</b> : ${esc(sup.dom.replace(/\*/g, ' (grade 2+)'))}<br>` : ''}
      ${sup.pw ? `<b>Pouvoirs de base</b> : ${esc(sup.pw)}` : ''}
      ${sup.avantage ? `<br><b>Avantage</b> : ${esc(sup.avantage)}` : ''}
    </div>${t.sup ? hierBlock(c, sup) : ''}` : ''}
    ${t.sup ? `<p class="small muted">${esc(R.GRADES[c.grade || 0].txt)}</p>` : ''}
    ${t.note ? `<p class="small muted">${esc(t.note)}</p>` : ''}
  </section>
  ${t.sup || t.camp !== 'neutre' || true ? `<section class="card">
    <h2>Points d'administration <span class="tag">${av} disponibles</span></h2>
    <div class="annexes"><span class="pill">Gagnés <b>${c.pa.total || 0}</b></span><span class="pill light">Dépensés <b>${c.pa.spent || 0}</b></span></div>
    <div class="row" style="margin-top:8px"><input class="inp" style="max-width:90px" type="number" id="pa-gain" placeholder="PA"><input class="inp" style="flex:1;min-width:140px" id="pa-why" placeholder="Mission, raison…"><button class="btn pri" data-act="pa-gain">Ajouter</button></div>
    ${c.pa.log.length ? `<h3>Historique</h3>${c.pa.log.slice().reverse().slice(0, 30).map((e, j) => {
      const i = c.pa.log.length - 1 - j;
      return `<div class="trow small"><div class="tn">${esc(e.label)} <span class="muted">${new Date(e.t).toLocaleDateString('fr-FR')}</span></div><b>${e.gain ? '+' + e.gain : '–' + e.cost}</b>${i === c.pa.log.length - 1 ? `<button class="ibtn" style="width:30px;height:30px" data-act="pa-undo" title="Annuler">${icon('undo')}</button>` : ''}</div>`;
    }).join('')}` : ''}
    ${t.sup ? `<div class="row" style="margin-top:8px"><button class="btn sm" data-act="hier-reward">Récompense de l'administration (d66)</button></div>` : ''}
    <p class="small muted" style="margin-bottom:0">L'administration ne communique jamais le total de PA : c'est le MJ qui les distribue. Passer en mode « PA » (bouton en haut) pour les dépenser.</p>
  </section>` : ''}
  ${renderTableCard(c)}
  <section class="card">
    <h2>Limitations</h2>
    ${c.limitations.map((l, i) => `<div class="trow"><div class="tn"><span class="badge ${l.k === 'Blâme' ? 'no' : ''}">${esc(l.k)}</span> ${esc(l.txt)}</div><button class="ibtn" style="width:30px;height:30px" data-act="lim-del" data-i="${i}">${icon('x')}</button></div>`).join('') || '<div class="empty">Aucune</div>'}
    <div class="row" style="margin-top:8px"><select class="inp" id="lim-k" style="max-width:150px"><option>Avertissement</option><option>Blâme</option><option>Mesure disciplinaire</option></select><input class="inp" id="lim-txt" style="flex:1;min-width:140px" placeholder="Description"><button class="btn" data-act="lim-add">Ajouter</button></div>
    ${t.sup ? `<div class="row" style="margin-top:8px"><button class="btn sm" data-act="hier-avert">Tirer un avertissement (d66)</button>${sup && SUP_HIER[sup.n]?.blames ? `<button class="btn sm" data-act="hier-blame">Tirer un blâme de ${esc(sup.n)} (d6)</button>` : ''}</div>
    <p class="small muted" style="margin-bottom:0">Avertissement dès que le total de PA tombe à –5 (retiré quand il remonte à 0) ; blâme infligé par le supérieur pour une grosse faute, jusqu'à ce que le personnage fasse amende honorable.</p>` : ''}
  </section>
  <section class="card">
    <h2>Notes</h2>
    <div class="grid" data-form="id">${F.area('notes', 'Notes', c.notes)}</div>
    <p class="small muted" style="margin-bottom:0">Possessions, armes, armures et équipement : onglet <b data-act="go-sac" style="cursor:pointer;text-decoration:underline">Sac</b>.</p>
  </section>`;
}

// ================= Bibliothèque =================
function renderBiblio(c) {
  const tabs = [['pouvoirs', 'Pouvoirs'], ['sup', 'Supérieurs'], ['talents', 'Talents'], ['armes', 'Armes'], ['regles', 'Règles']];
  let body = '';
  const q = norm(ui.q);
  if (ui.biblio === 'pouvoirs') {
    const list = R.POUVOIRS.filter((p) => !q || norm(p.n + ' ' + p.d).includes(q)).filter((p) => !ui.onlyAccess || R.powerAccessible(c, p));
    body = `<div class="row" style="margin-bottom:8px"><label class="small"><input type="checkbox" data-act="only-access" ${ui.onlyAccess ? 'checked' : ''}> Seulement ceux accessibles à ${esc(c.nom || 'ce personnage')}</label><span class="spacer"></span><span class="small muted">${list.length} pouvoirs</span></div>` +
      list.slice(0, 150).map((p) => {
        const par = p.parent ? R.powerDef(p.parent) : null;
        const open = ui.open['b' + p.n];
        return `<div class="pow"><div class="ph"><div class="pn">${esc(p.n)}</div><span class="small muted">${hasPA(p) ? `${R.powerUnitCost(c, p)} PA${p.a?.inv ? '' : '/rang'}` : ''}</span>
          <button class="btn sm ghost" data-act="toggle" data-key="b${esc(p.n)}">${open ? '–' : '+'}</button></div>
          <div class="meta"><span class="badge ${p.nat}">${p.nat}</span>${esc(p.act)} · <i>${esc(accessTxt(p))}</i>${p.q && p.q !== '—' ? ' · ' + esc(p.q) : ''}</div>
          ${powSum(p, par)}
          ${open ? `<div class="desc">${esc(p.d || (par ? 'Voir ' + par.n + ' : ' + par.d : ''))}${p.var ? '\n\n' + esc(p.var) : ''}</div>` : ''}</div>`;
      }).join('');
  } else if (ui.biblio === 'sup') {
    const list = R.SUPERIEURS.filter((s) => !q || norm(s.n + ' ' + s.titre + ' ' + (s.dom || '')).includes(q));
    body = ['ange', 'demon'].map((camp) => `<h3>${camp === 'ange' ? 'Archanges' : 'Princes-démons'}</h3>` + list.filter((s) => s.camp === camp).map((s) => {
      const open = ui.open['s' + s.n];
      return `<div class="pow"><div class="ph"><div class="pn">${esc(s.n)} <small class="muted">${esc(s.titre)}</small></div>${s.src === 'dudule' ? '<span class="badge">Bible à Dudule</span>' : ''}<button class="btn sm ghost" data-act="toggle" data-key="s${esc(s.n)}">${open ? '–' : '+'}</button></div>
        ${s.desc ? `<p class="supdesc ${open ? '' : 'clamp'}" data-act="toggle" data-key="s${esc(s.n)}">${esc(s.desc)}</p>` : ''}
        ${open ? `<div class="desc small">${s.prof ? `<b>Profil</b> : ${esc(s.prof)}\n` : ''}${s.c ? `<b>Caractéristiques</b> : ${R.CARACS.map((k, i) => k.ab + ' ' + (s.c[i] ? sgn(s.c[i]) : '—')).join(', ')}\n` : ''}${s.tp ? `<b>Talents principaux</b> : ${esc(s.tp)}\n<b>Talents secondaires</b> : ${esc(s.ts)}\n` : ''}${s.pw ? `<b>Pouvoirs</b> : ${esc(s.pw)}${s.pp ? ', +' + s.pp + ' PP' : ''}\n` : ''}${s.rec ? `<b>Récupération</b> : ${esc(s.rec)}\n` : ''}${s.promo ? `<b>Promotion</b> : ${esc(s.promo)}\n` : ''}${s.dom ? `<b>Domaines</b> : ${esc(s.dom)}` : ''}</div>` : ''}</div>`;
    }).join('')).join('');
  } else if (ui.biblio === 'talents') {
    body = ['p', 's', 'e', 'psi'].map((cat) => `<h3>${{ p: 'Principaux', s: 'Secondaires', e: 'Exotiques', psi: 'Psioniques' }[cat]}</h3>` + R.TALENTS.filter((t) => t.cat === cat && (!q || norm(t.n).includes(q))).map((t) =>
      `<div class="trow"><div class="tn"><b>${t.n}</b> <small class="muted">${t.car ? R.caracName(c, t.car) : 'aucune'} · ${t.inne ? 'inné' : 'acquis'} · ${{ g: 'générique', s: 'spécifique', m: 'multiple', lang: 'multiple' }[t.kind]}</small><br><small>${esc(R.TALENT_INFO[t.n] || (cat === 'psi' ? R.PSI_POUVOIRS[t.n].join(', ') : ''))}</small></div></div>`).join('')).join('');
  } else if (ui.biblio === 'armes') {
    body = R.ARMES.map(([g, list]) => `<h3>${g}</h3><table class="ref"><tr><th>Arme</th><th>Préc.</th><th>Puiss.</th><th>Qualités</th></tr>${list.map(([n, p, pu, qq]) => `<tr><td>${n}</td><td>${sgn(p)}</td><td>${sgn(pu)}</td><td class="small">${esc(qq)}</td></tr>`).join('')}</table>`).join('') +
      `<h3>Armures et boucliers</h3><table class="ref"><tr><th>Protection</th><th></th><th>Force min.</th><th>Qualités</th></tr>${R.ARMURES.map(([n, p, f, qq]) => `<tr><td>${n}</td><td>${p}</td><td>${f || '—'}</td><td class="small">${esc(qq)}</td></tr>`).join('')}</table>`;
  } else {
    body = renderRegles();
  }
  return `<div class="search"><div class="seg">${tabs.map(([k, l]) => `<button class="${ui.biblio === k ? 'on' : ''}" data-act="btab" data-v="${k}">${l}</button>`).join('')}</div>
    ${ui.biblio !== 'regles' && ui.biblio !== 'armes' ? `<input class="inp" id="bq" style="margin-top:8px" placeholder="Rechercher…" value="${esc(ui.q)}">` : ''}</div>
    <section class="card">${body}</section>`;
}
// Le pouvoir s'achète-t-il en PA ? (non pour les pouvoirs de mage urbain et ceux propres à un PNJ)
const hasPA = (p) => ['gen', 'ange', 'demon', 'psi', 'paien', 'special'].some((k) => p.a?.[k] != null) || Object.keys(p.a?.sup || {}).length > 0;
function accessTxt(p) {
  const a = p.a || {}; const o = [];
  if (a.gen != null) o.push('général ' + a.gen);
  if (a.ange != null) o.push('anges ' + a.ange);
  if (a.demon != null) o.push('démons ' + a.demon);
  if (a.psi != null) o.push('psioniques ' + a.psi);
  if (a.paien != null) o.push('païens ' + a.paien);
  if (a.special != null) o.push('spécial ' + a.special);
  for (const [k, v] of Object.entries(a.sup || {})) o.push(k + ' ' + v);
  if (a.inv) o.push('invariable');
  if (a.cond) o.push('condition : ' + a.cond);
  // Accès sans coût en PA : pouvoirs de mage urbain (niveau de Foi requis) et pouvoirs propres à un PNJ
  const extra = [a.mage != null ? `mage urbain de niveau ${a.mage}` : '', a.propre ? `propre à ${a.propre}` : ''].filter(Boolean);
  if (!o.length) return extra.join(', ') || '—';
  return o.join(', ') + (!a.inv ? ' PA/rang' : ' PA') + (extra.length ? ', ' + extra.join(', ') : '');
}
function renderRegles() {
  return `<h3>Table Unique-Multiple</h3>
  <div class="tum"><div class="h">abs.</div>${R.LN.slice(1).map((_, i) => `<div class="h">${i + 1 - R.COL0 >= 0 ? L(i + 1 - R.COL0) : '–'}</div>`).join('')}
  <div class="h">LN</div>${R.LN.slice(1).map((v) => `<div>${v}</div>`).join('')}
  <div class="h">rel.</div>${R.LN.slice(1).map((_, i) => `<div>${sgn((i + 1 - 9) / 2).replace('.', ',')}</div>`).join('')}</div>
  <p class="small">Lancer un <b>d66+6</b> : les deux premiers dés forment le résultat (dizaines, unités), le dé blanc est le <b>RU</b>. Réussite si le résultat est inférieur ou égal au seuil.</p>
  <h3>Difficultés</h3><table class="ref">${R.DIFFICULTES.map((d) => `<tr><td>${d.n}</td><td>${d.s == null ? (d.k === 'triviale' ? 'seuil 66' : 'échec automatique') : sgn(d.s) + ' colonnes'}</td></tr>`).join('')}</table>
  <p class="small">Au-delà de 6+, les malus réduisent d'abord le niveau jusqu'à 6+. Règle d'or : jamais plus de 10 colonnes de bonus cumulées (sauf une source unique).</p>
  <h3>Marge de réussite</h3>
  <p class="small">MR = RU + niveau (modifié, sans les « + »). Double (les deux premiers dés identiques) : + Chance/Foi. Triple : + 2 × Chance/Foi. Prise de risque : décaler volontairement de 1 à niveau colonnes vers la gauche, ajouté à la MR en cas de réussite.</p>
  <table class="ref"><tr><td>1–3</td><td>Réussite faible</td></tr><tr><td>4–6</td><td>Réussite moyenne</td></tr><tr><td>7–9</td><td>Réussite forte</td></tr><tr><td>10+</td><td>Réussite exceptionnelle</td></tr></table>
  <p class="small">Échec : RU 1–3 faible, 4–5 fort, 6 catastrophe. <b>111</b> : Dieu intervient (réussite critique des anges avec RU 12, échec terrible des démons). <b>666</b> : Satan s'en mêle (réussite des démons avec RU 8, échec des anges).</p>
  <h3>Tests opposés et résistés</h3>
  <p class="small">Opposé : différence de niveaux sur la ligne relative (≥ 5 : on bloque aux extrémités). Résisté : chacun fait un test standard ; si les deux réussissent, MR finale = MR attaquant – MR défenseur.</p>
  <p class="small muted">Exemple : Régis (Discrétion 4+) passe derrière un garde (Perception 3). Les « + » valent 0,5 : 4,5 – 3 = +1,5 sur la ligne relative, soit un seuil de 53. Le MJ peut garder secret le score du PNJ.</p>
  <h3>Combat</h3>
  <p class="small"><b>Initiative</b> : jet au premier tour seulement, ensuite on joue chacun son tour dans le sens des aiguilles d'une montre. Le MJ choisit la caractéristique ou le talent selon la situation : Agilité en général, Volonté si le combat s'ouvre sur une attaque mentale, Perception sur une attaque à distance, un trait comme Survie (Jungle) selon le terrain…</p>
  <table class="ref">
    <tr><td>Duel</td><td>Jet d'Agilité opposé.</td></tr>
    <tr><td>Surprise des deux camps</td><td>Agilité Très difficile au premier tour. En cas d'échec, on ne joue pas ce tour et il faut réussir un test d'Agilité Difficile au deuxième tour pour agir.</td></tr>
    <tr><td>Embuscade</td><td>Les victimes font un test de Perception opposé à la Discrétion des embusqués (le moins discret du groupe). En cas d'échec, elles ne jouent pas ce tour et doivent réussir un test d'Agilité Difficile au deuxième tour pour agir.</td></tr>
  </table>
  <p class="small"><b>Actions du tour</b> : déplacement, attaque, activation de pouvoir (pas de jet sauf si le pouvoir le précise). On peut se déplacer en attaquant ou en utilisant un pouvoir, avec un malus selon la situation : –4 colonnes au tir ; une charge donne –2 colonnes, ou +2 colonnes avec une arme « adaptée à la charge ».</p>
  <p class="small"><b>Attaque</b> : l'attaquant fait un test de son talent (la précision de l'arme décale les colonnes), le défenseur un jet de défense. <b>MR de résolution</b> = MR de l'attaquant – MR du défenseur ; l'attaque touche si elle vaut 0 ou plus.</p>
  <table class="ref"><tr><th>Attaque</th><th>Dégâts finaux</th></tr>
    <tr><td>Corps à corps</td><td>MR de résolution + Force – Protection du défenseur</td></tr>
    <tr><td>Arme de contact</td><td>MR de résolution + Force + Puissance de l'arme – Protection du défenseur</td></tr>
    <tr><td>Arme à distance</td><td>MR de résolution + Puissance de l'arme – Protection du défenseur</td></tr></table>
  <p class="small">On compare les dégâts aux seuils de blessure du défenseur (BL, BG, BF, MS) et on coche la ligne correspondante. Une créature surnaturelle peut survivre à une mort subite en réussissant un test de Force.</p>
  <table class="ref"><tr><th>Blessure</th>${Object.keys(R.BLESSURES).map((k) => `<th>${k}</th>`).join('')}</tr>
    <tr><td>Perte de PF</td>${Object.entries(R.BLESSURES).map(([k, b]) => `<td>${k === 'MS' ? 'mort ou ' + b.pf : b.pf}</td>`).join('')}</tr>
    <tr><td>Malus</td>${Object.values(R.BLESSURES).map((b) => `<td>${b.malus ? b.malus + ' col.' : '–'}</td>`).join('')}</tr></table>
  <p class="small">Un ange ou un démon perd des points de fatigue (PF) à chaque nouvelle blessure ; à 0 PF, c'est l'inconscience.</p>
  <h3>Grades</h3><table class="ref"><tr><th>Grade</th><th>Caracs</th><th>Talents</th><th>Pouvoirs</th><th>PP</th></tr>${R.GRADES.map((g) => `<tr><td>${g.g}</td><td>${L(g.car)}</td><td>${L(g.tal)}</td><td>${L(g.pow)}</td><td>${g.pp}</td></tr>`).join('')}</table>`;
}

// ================= Lanceur de dés =================
let rollState = null;
// Attaque et défense : test résisté (livre de règles p. 42) — ni jet opposé ni difficulté, seulement des colonnes
const COMBAT_KINDS = ['attaque', 'defense'];
// Situations d'attaque du livre (p. 42) : décalages de colonnes à cocher
const SIT = {
  charge: { n: 'Charge', v: -2 }, chargeA: { n: 'Charge (arme adaptée)', v: 2 },
  mouv: { n: 'Tir en mouvement', v: -4 }, sansdef: { n: 'Adversaire sans défense', v: 4 },
};
// Situations possibles selon l'arme : charge au contact (+2 si « Adaptée à la charge »), tir en mouvement à distance
function weaponSits(w) {
  if (!w) return Object.keys(SIT);
  if (!w.melee) return ['mouv', 'sansdef'];
  const adapted = /adaptée à la charge/i.test(w.q || '') || /(^|\s)(lance|baïonnette|hallebarde|hast|pique)/i.test(w.n || '');
  return [adapted ? 'chargeA' : 'charge', 'sansdef'];
}
const fxShift = (s) => (s.fx || []).reduce((t, f) => t + (f.v || 0), 0);
const sitShift = (s) => (s.sit || []).reduce((t, k) => t + (SIT[k]?.v || 0), 0);
const NOBODY = { type: 'humain', car: { fo: 4, ag: 4, pe: 4, vo: 4, pr: 4, foi: 4 }, blessures: [] }; // lancer sans personnage (écran MJ)
function openRoll(opts) {
  const c = C();
  rollState = {
    label: opts.label, r: opts.r ?? 4, levels: opts.levels || null, shift: 0, diff: 'difficile', risk: 0, prec: opts.prec || 0,
    opp: false, oppR: 4, wound: opts.wound !== false, result: null, after: opts.after || null, free: !!opts.free, kind: opts.kind || 'test',
    char: opts.char || null, sit: [], sits: opts.sits || Object.keys(SIT),
    fx: opts.fx || [], // effets de pouvoirs appliqués d'office (v : colonnes ; la précision est déjà dans prec)
  };
  if (rollState.levels) rollState.r = rollState.levels[rollState.levels.length - 1][1];
  showRoll();
}
function showRoll() {
  const s = rollState; const c = s.char || C() || NOBODY;
  const malus = s.wound ? R.woundMalus(c) : 0;
  const diff = R.DIFFICULTES.find((d) => d.k === s.diff);
  const totalShift = (diff.s || 0) + s.shift + s.prec + malus + sitShift(s) + fxShift(s);
  let seuilInfo;
  if (s.opp) seuilInfo = R.seuilOppose(s.r + s.shift + s.prec + malus - s.oppR, s.risk);
  else if (s.diff === 'triviale') seuilInfo = 66;
  else if (s.diff === 'impossible') seuilInfo = null;
  else seuilInfo = R.seuilStandard(s.r, totalShift, s.risk).seuil;
  const res = s.result;
  let out = '';
  const camp = R.typeOf(c).camp;
  if (slot.slotOn()) {
    s.tag ||= slot.tagline(camp);
    out = slot.machine({ dice: res?.dice, spin: !!s.spin, tag: s.tag, fx: s.spin ? null : slot.outcome(res, camp) });
  }
  if (res && !s.spin) {
    const cls = res.divin && (res.ok !== undefined) && (res.divin === 'unique' ? R.typeOf(c).camp === 'ange' : R.typeOf(c).camp === 'demon') ? 'divin' : res.ok ? 'ok' : 'ko';
    // Avec le bandit manchot, le bandeau de la machine dit déjà Réussite ou Échec
    out = (out || `<div class="dice">${res.dice.map((d, i) => `<div class="die roll ${['', 'd2', 'u'][i]}">${d}</div>`).join('')}</div>
      <div class="verdict ${cls}">${res.divin === 'unique' ? '111 — Dieu s\'en mêle ! ' : res.divin === 'bete' ? '666 — le Nombre de la Bête ! ' : ''}${res.ok ? 'Réussite' : 'Échec'}</div>`) + `
      <div class="vsub">Résultat ${res.res} / seuil ${res.seuil ?? '×'} · RU ${res.ru}${res.triple ? ' · TRIPLE' : res.double ? ' · double' : ''}</div>
      <div class="vsub" style="color:#fff;font-size:17px;margin-top:4px">${res.ok ? `MR <b>${res.mr}</b> — ${R.MR_TXT(res.mr)}` : R.ECHEC_TXT(res.ru)}</div>
      ${res.ok && s.after ? `<div class="vsub" style="margin-top:6px">${s.after(res)}</div>` : ''}`;
  }
  const lvlSel = s.levels ? `<div class="seg" style="margin-bottom:10px">${s.levels.map(([lab, r]) => `<button class="${s.r === r ? 'on' : ''}" data-ract="lvl" data-v="${r}">${esc(lab)} ${L(r)}</button>`).join('')}</div>` : '';
  // Difficulté : sélecteur ‹ › et barre de progression (de Triviale à Impossible)
  const di = R.DIFFICULTES.findIndex((d) => d.k === s.diff);
  const diffCtl = `<div class="rt-car"><button data-ract="dstep" data-v="-1" ${di <= 0 ? 'disabled' : ''} aria-label="Plus facile">‹</button><b>${esc(diff.n)}</b><button data-ract="dstep" data-v="1" ${di >= R.DIFFICULTES.length - 1 ? 'disabled' : ''} aria-label="Plus difficile">›</button></div>
    <div class="rt-bar">${R.DIFFICULTES.map((d, i) => `<i class="${i <= di ? 'on' : ''}" data-ract="diff" data-v="${d.k}" title="${esc(d.n)}"></i>`).join('')}</div>`;
  // Ajustements (repliés) : modificateur, prise de risque, malus de blessure ; résumé quand quelque chose est réglé
  const wm = R.woundMalus(c);
  const combat = COMBAT_KINDS.includes(s.kind);
  const adjSum = [s.shift ? `Mod ${sgn(s.shift)}` : '', s.risk ? `Risque ${s.risk}` : '', s.prec ? `Précision ${sgn(s.prec)}` : '', wm && s.wound ? `Blessures ${wm}` : ''].filter(Boolean).join(' · ') || 'aucun';
  const toggle = (act, on) => `<button class="rt-sw ${on ? 'on' : ''}" data-ract="${act}" role="switch" aria-checked="${on}"><span></span></button>`;
  const stepper = (act, val) => `<span class="stepper"><button data-ract="${act}" data-v="-1">–</button><b>${val}</b><button data-ract="${act}" data-v="1">+</button></span>`;
  // Seuil de base : niveau et difficulté seuls (sans modificateur, prise de risque ni blessure)
  const base = combat ? R.seuilStandard(s.r, 0).seuil : s.opp ? R.seuilOppose(s.r - s.oppR) : s.diff === 'triviale' ? 66 : s.diff === 'impossible' ? null : R.seuilStandard(s.r, diff.s || 0).seuil;
  dlg.innerHTML = `<div class="dlg-h"><h2>${esc(s.label)}</h2><button class="ibtn" data-ract="close">${icon('x')}</button></div>
  <div class="dlg-b rt">
    ${lvlSel}
    <div class="rt-row"><span>Niveau</span>${s.free ? stepper('r', L(s.r)) : `<b class="rt-lvl">${L(s.r)}</b>`}</div>
    ${combat ? `<div class="small muted">${s.kind === 'attaque' ? 'Test résisté : le défenseur fait ensuite son jet de Défense, sa MR est retranchée.' : 'Test résisté : ta MR de Défense est retranchée à celle de l’attaquant.'}</div>`
      : `<div class="rt-row"><span>Jet opposé</span>${toggle('opp', s.opp)}</div>
    ${s.opp ? `<div class="rt-row"><span>Niveau adverse</span>${stepper('oppR', L(s.oppR))}</div>` : `<div class="rt-lab">Difficulté</div>${diffCtl}`}`}
    ${s.fx.length ? `<div class="rt-lab">Pouvoirs actifs</div>${fxLine(s.fx.map((f) => `${esc(f.n)} : ${esc(f.txt || sgn(f.v))}`))}` : ''}
    ${s.kind === 'attaque' ? `<div class="rt-lab">Situation</div><div class="rt-chips">${Object.entries(SIT).filter(([k]) => s.sits.includes(k)).map(([k, x]) => `<button class="${s.sit.includes(k) ? 'on' : ''}" data-ract="sit" data-v="${k}">${esc(x.n)} <b>${sgn(x.v)}</b></button>`).join('')}</div>` : ''}
    <button class="rt-row rt-adj" data-ract="adj"><span>Ajustements</span><span class="muted">${esc(adjSum)} <i class="rt-chev ${s.adjOpen ? 'open' : ''}">⌄</i></span></button>
    ${s.adjOpen ? `<div class="rt-adjb">
      <div class="rt-row"><span>${combat ? 'Bonus de manœuvre' : 'Modificateur'} <small class="muted">${combat ? 'jusqu’à +3 sans justifier' : 'colonnes'}</small></span>${stepper('shift', sgn(s.shift))}</div>
      <div class="rt-row"><span>Prise de risque <small class="muted">max ${R.lvlInt(s.r)}</small></span>${stepper('risk', s.risk)}</div>
      ${wm ? `<div class="rt-row"><span>Malus des blessures <small class="muted">${wm}</small></span>${toggle('wound', s.wound)}</div>` : ''}
      ${s.prec ? `<div class="small muted">Précision de l'arme : ${sgn(s.prec)} colonne(s), toujours appliquée</div>` : ''}
    </div>` : ''}
    ${out}
  </div>
  <div class="dlg-f rt-foot">
    <div class="rt-seuil"><small>Seuil</small><b>${seuilInfo ?? '×'}</b></div>
    <span class="rt-detail">Base ${base ?? '×'} · Mod ${sgn(s.shift + s.prec + sitShift(s) + fxShift(s) + (s.wound ? wm : 0))} · Risque ${s.risk}</span>
    ${slot.slotOn() ? '' : `<button class="btn pri" data-ract="go">${icon('die')} Lancer d66+6</button>`}
  </div>`;
  if (!dlg.open) dlg.showModal();
}
function doRoll() {
  const s = rollState; const c = s.char || C() || NOBODY;
  const malus = s.wound ? R.woundMalus(c) : 0;
  const diff = R.DIFFICULTES.find((d) => d.k === s.diff);
  const totalShift = (diff.s || 0) + s.shift + s.prec + malus + sitShift(s) + fxShift(s);
  let seuil, eff;
  if (s.opp) { seuil = R.seuilOppose(s.r + s.shift + s.prec + malus - s.oppR, s.risk); eff = s.r + s.shift + s.prec + malus; }
  else if (s.diff === 'triviale') { seuil = 66; eff = s.r; }
  else if (s.diff === 'impossible') { seuil = null; eff = s.r; }
  else { const x = R.seuilStandard(s.r, totalShift, s.risk); seuil = x.seuil; eff = x.eff; }
  s.result = R.resolve(R.rollD666(), { seuil, mrLevel: R.lvlInt(eff), risk: s.risk, foi: c.car.foi, camp: R.typeOf(c).camp });
  if (s.fx.some((f) => f.once) && !s.char && C()) { const ch = C(); ch.effets = (ch.effets || []).filter((e) => !s.fx.some((f) => f.once && f.n === e.n)); commit(); } // la page derrière la fenêtre de jet se met à jour
  if (!slot.slotOn()) { showRoll(); return slot.celebrate(null, slot.outcome(s.result, R.typeOf(c).camp)); }
  // Bandit manchot : les rouleaux tournent, puis le verdict s'affiche
  // La machine (puis le verdict) reste visible même quand la fenêtre défile (petit écran, ajustements ouverts)
  const reveal = (sel) => dlg.querySelector(sel)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  s.spin = true; slot.sfx.unlock(); slot.sfx.pull(); showRoll(); reveal('.slot');
  slot.spin(dlg, () => {
    if (rollState !== s || !dlg.open) return;
    s.spin = false; showRoll();
    // Jusqu'au verdict et à la MR : selon la mise en page, c'est le contenu ou la fenêtre entière qui défile
    const body = dlg.querySelector('.dlg-b'); const box = body && body.scrollHeight > body.clientHeight ? body : dlg;
    box.scrollTo({ top: box.scrollHeight, behavior: 'smooth' });
    slot.celebrate(dlg, slot.outcome(s.result, R.typeOf(c).camp));
  });
}
function freeRoll() {
  const roll = (n) => Array.from({ length: n }, R.d6);
  const show = (title, html) => {
    dlg.innerHTML = `<div class="dlg-h"><h2>Dés</h2><button class="ibtn" data-ract="close">${icon('x')}</button></div>
    <div class="dlg-b"><div class="seg">${['1d6', '2d6', 'd66', 'd666', 'Test'].map((k) => `<button data-fr="${k}">${k}</button>`).join('')}</div>${html || ''}</div>`;
    if (!dlg.open) dlg.showModal();
  };
  show('Dés');
  dlg.onclick = (e) => {
    const b = e.target.closest('[data-fr]');
    if (b) {
      const k = b.dataset.fr;
      if (k === 'Test') { dlg.onclick = null; openRoll({ label: 'Test libre', r: 4, free: true }); return; }
      if (dlg.querySelector('.slot.spinning')) return;
      const d = roll({ '1d6': 1, '2d6': 2, d66: 2, d666: 3 }[k]);
      const total = k === '2d6' ? d[0] + d[1] : k === '1d6' ? d[0] : d.join('');
      const cls = k === '1d6' ? ['u'] : k === '2d6' ? ['u', 'u'] : ['', 'd2', 'u'];
      const res = k === 'd666' ? { dice: d, divin: d.join('') === '111' ? 'unique' : d.join('') === '666' ? 'bete' : null, triple: d[0] === d[1] && d[1] === d[2], double: d[0] === d[1] && d[1] !== d[2] }
        : { dice: d, double: d.length === 2 && d[0] === d[1] };
      const fin = () => show('Dés', `${slot.slotOn() ? slot.machine({ dice: d, n: d.length, tag: 'Dés libres', fx: slot.outcome(res), lever: `data-fr="${k}"`, cls }) : `<div class="dice">${d.map((x, i) => `<div class="die roll ${['', 'd2', 'u'][i]}">${x}</div>`).join('')}</div>`}<div class="verdict">${k} = ${total}</div>`);
      if (!slot.slotOn()) return fin();
      slot.sfx.unlock(); slot.sfx.pull();
      show('Dés', slot.machine({ dice: d, n: d.length, spin: true, tag: 'Dés libres', lever: `data-fr="${k}"`, cls }));
      slot.spin(dlg, () => { if (!dlg.open) return; fin(); slot.celebrate(dlg, slot.outcome(res)); });
      return;
    }
    if (e.target.closest('[data-ract="close"]')) { dlg.close(); dlg.onclick = null; }
  };
}

// ================= Progression (dépense de PA) =================
function progQuote(c, kind, key, sub) {
  const av = (+c.pa.total || 0) - (+c.pa.spent || 0);
  const gm = R.gradeMax(c);
  const mk = (cost, ok, free = false) => ({ cost, ok: ok && (free || cost <= av), label: free ? 'offert' : cost + ' PA' });
  if (kind === 'car') return mk(2, c.car[key] < gm.car);
  if (kind === 'pp') return mk(1, R.ppMax(c) < (gm.pp || 15));
  if (kind === 'tal' || kind === 'spe') {
    const t = c.tal[key] || {};
    const base = R.talentBase(c, key);
    const L2 = kind === 'tal' ? base + (+t.r || 0) : base + (+t.sr || 0);
    let ok = L2 < gm.tal;
    if (kind === 'tal' && t.spe && (+t.r || 0) >= (+t.sr || 0)) ok = false; // général ≤ spécialité
    const sec = R.talentCat(c, key) === 's';
    if (sec && c.secCredit > 0) return mk(0, ok, true);
    return mk(1, ok);
  }
  if (kind === 'multi') { const m = c.multi[key]; return c.secCredit > 0 ? mk(0, 2 + m.r < gm.tal, true) : mk(1, 2 + m.r < gm.tal); }
  if (kind === 'pow') { const p = c.pouvoirs[key]; const u = R.powerUnitCost(c, R.powerDef(p.n)); return mk(u, p.r < gm.pow); }
  return null;
}
function buy(kind, key, sub) {
  const c = C();
  const q = progQuote(c, kind, key, sub);
  if (!q || !q.ok) return;
  const entry = { t: Date.now(), cost: q.cost, kind, key, credit: 0 };
  if (kind === 'car') { c.car[key]++; entry.label = `${R.caracName(c, key)} → ${L(c.car[key])}`; }
  else if (kind === 'pp') { c.ppBonus = (+c.ppBonus || 0) + 1; c.ppCur = (c.ppCur ?? R.ppMax(c) - 1) + 1; entry.label = `+1 PP (${R.ppMax(c)})`; }
  else if (kind === 'tal' || kind === 'spe' || kind === 'multi') {
    let sec;
    if (kind === 'multi') { c.multi[key].r++; sec = true; entry.label = `${c.multi[key].t} (${c.multi[key].label}) → ${L(2 + c.multi[key].r)}`; }
    else {
      const t = (c.tal[key] ||= { r: 0 });
      if (kind === 'tal') t.r = (+t.r || 0) + 1; else t.sr = (+t.sr || 0) + 1;
      sec = R.talentCat(c, key) === 's';
      entry.label = kind === 'tal' ? `${key} → ${L(R.talentLevel(c, key))}` : `${key} (${t.spe}) → ${L(R.talentSpe(c, key))}`;
    }
    if (sec) { if (q.cost === 0) { c.secCredit--; entry.credit = -1; } else { c.secCredit = (c.secCredit || 0) + 1; entry.credit = 1; } }
    else { c.secCredit = (c.secCredit || 0) + 1; entry.credit = 1; }
  } else if (kind === 'pow') { c.pouvoirs[key].r++; entry.label = `${c.pouvoirs[key].n} → ${L(c.pouvoirs[key].r)}`; }
  c.pa.spent = (+c.pa.spent || 0) + q.cost;
  c.pa.log.push(entry);
  commit();
}
function undoPA() {
  const c = C(); const e = c.pa.log.pop(); if (!e) return;
  if (e.gain) c.pa.total -= e.gain;
  else {
    c.pa.spent -= e.cost;
    const k = e.kind, key = e.key;
    if (k === 'car') c.car[key]--;
    else if (k === 'pp') { c.ppBonus--; c.ppCur = Math.min(c.ppCur ?? 0, R.ppMax(c)); }
    else if (k === 'tal') c.tal[key].r--;
    else if (k === 'spe') c.tal[key].sr--;
    else if (k === 'multi') c.multi[key].r--;
    else if (k === 'pow') c.pouvoirs[key].r--;
    else if (k === 'newpow') c.pouvoirs.splice(key, 1);
    if (e.credit) c.secCredit = (c.secCredit || 0) - e.credit;
  }
  commit();
}

// ================= Édition libre / création =================
function adjust(kind, key, d) {
  const c = C();
  const crea = ui.mode === 'crea';
  if (kind === 'car') {
    const min = ['ange', 'demon', 'combat', 'renegat_a', 'renegat_d'].includes(c.type) && crea ? 3 : 0;
    c.car[key] = Math.max(min, c.car[key] + d);
  } else if (kind === 'pp') c[crea ? 'ppAchat' : 'ppBonus'] = Math.max(0, (+c[crea ? 'ppAchat' : 'ppBonus'] || 0) + d);
  else if (kind === 'tal') {
    const t = (c.tal[key] ||= { r: 0 });
    t.r = Math.max(0, (+t.r || 0) + d);
    if (t.spe && t.r > (+t.sr || 0)) t.sr = t.r;
    if (!t.r && !t.spe && R.talentDef(key)?.cat !== 'e' && R.talentDef(key)?.cat !== 'psi') delete c.tal[key];
  } else if (kind === 'spe') {
    const t = (c.tal[key] ||= { r: 0 });
    t.sr = Math.max(+t.r || 0, (+t.sr || 0) + d);
  } else if (kind === 'multi') {
    const m = c.multi[key];
    m.r = (+m.r || 0) + d;
    if (m.r < 0) c.multi.splice(key, 1);
  } else if (kind === 'pow') {
    const p = c.pouvoirs[key];
    p.r = Math.max(2, p.r + d);
  }
  commit();
}

// ================= Dialogues divers =================
function dialog(title, body, foot = '') {
  dlg.onclick = null;
  dlg.innerHTML = `<div class="dlg-h"><h2>${title}</h2><button class="ibtn" data-dact="close">${icon('x')}</button></div><div class="dlg-b">${body}</div>${foot ? `<div class="dlg-f">${foot}</div>` : ''}`;
  if (!dlg.open) {
    dlg.showModal();
    dlg.querySelector('.dlg-b input[placeholder^="Rechercher"]')?.focus(); // fenêtre avec recherche : on peut taper tout de suite
  }
}
const closeDlg = () => { dlg.close(); dlg.onclick = null; };
// L'évènement « close » est envoyé en différé : quand une fenêtre se ferme et qu'une autre s'ouvre aussitôt
// (menu → confirmation), la nouvelle recevrait la fermeture de l'ancienne. On ignore donc toute fermeture
// arrivée alors que la fenêtre est de nouveau ouverte.
function onRealClose(fn) {
  const h = () => { if (dlg.open) return; dlg.removeEventListener('close', h); fn(); };
  dlg.addEventListener('close', h);
}
function ask(title, label, val = '') {
  return new Promise((resolve) => {
    dialog(title, `<div class="field"><label>${label}</label><input id="ask-in" value="${esc(val)}"></div>`, `<button class="btn" data-dact="close">Annuler</button><button class="btn pri" id="ask-ok">OK</button>`);
    const inp = dlg.querySelector('#ask-in'); inp.focus(); inp.select();
    const ok = () => { const v = inp.value; closeDlg(); resolve(v); };
    dlg.querySelector('#ask-ok').onclick = ok;
    inp.onkeydown = (e) => { if (e.key === 'Enter') ok(); };
    onRealClose(() => resolve(null));
  });
}
function confirmDlg(title, txt) {
  return new Promise((resolve) => {
    dialog(title, `<p>${txt}</p>`, `<button class="btn" data-dact="close">Non</button><button class="btn pri" id="cf-ok">Oui</button>`);
    dlg.querySelector('#cf-ok').onclick = () => { closeDlg(); resolve(true); };
    onRealClose(() => resolve(false));
  });
}

function chooseList(title, items, onPick, opts = {}) {
  let q = '';
  const draw = () => {
    const list = items.filter((it) => !q || norm(it.label + ' ' + (it.sub || '')).includes(norm(q)));
    dialog(title, `${opts.search !== false ? `<input class="inp" id="cl-q" placeholder="Rechercher…" value="${esc(q)}" style="margin-bottom:8px">` : ''}
      ${list.slice(0, 200).map((it, i) => `<button class="choice" data-pick="${items.indexOf(it)}"><span><b>${esc(it.label)}</b>${it.sub ? `<small>${esc(it.sub)}</small>` : ''}</span></button>`).join('') || '<div class="empty">Rien</div>'}`);
    const inp = dlg.querySelector('#cl-q');
    if (inp) { inp.oninput = () => { q = inp.value; const pos = inp.selectionStart; draw(); const n = dlg.querySelector('#cl-q'); n.focus(); n.setSelectionRange(pos, pos); }; }
    dlg.onclick = (e) => {
      if (e.target.closest('[data-dact="close"]')) return closeDlg();
      const b = e.target.closest('[data-pick]');
      if (b) { closeDlg(); onPick(items[+b.dataset.pick]); }
    };
  };
  draw();
}

function addPowerDialog() {
  const c = C();
  const pool = R.POUVOIRS.filter((p) => !p.multi);
  const runes = c.type === 'paien' ? R.RUNE_DEFS.filter((r) => !c.pouvoirs.some((p) => p.n === r.n)) : [];
  const items = runes.map((p) => ({ p, label: p.n, sub: `${p.a.paien} PA · héros viking, à la place des pouvoirs — ${p.d}` })).concat(pool.map((p) => ({
    p, label: p.n, sub:`${R.powerAccessible(c, p) ? '' : '[accès restreint] '}${hasPA(p) ? `${R.powerUnitCost(c, p)} PA${p.a?.inv ? '' : '/rang'} · ` : `${accessTxt(p)} · `}${p.nat} · ${p.act}${p.s || R.powerDef(p.parent)?.s ? ' — ' + (p.s || R.powerDef(p.parent).s) : ''}`,
  })).sort((a, b) => (R.powerAccessible(c, b.p) - R.powerAccessible(c, a.p)) || a.label.localeCompare(b.label, 'fr')));
  chooseList(runes.length ? 'Ajouter une rune ou un pouvoir' : 'Ajouter un pouvoir', items, ({ p }) => {
    const inv = !!p.a?.inv;
    const np = { n: p.n, r: inv ? 0 : 2 };
    if (isProg()) {
      const cost = R.powerUnitCost(c, p) * (inv ? 1 : 2);
      const av = (+c.pa.total || 0) - (+c.pa.spent || 0);
      if (cost > av) return toast(`Il faut ${cost} PA (${av} disponibles)`);
      c.pouvoirs.push(np);
      c.pa.spent += cost; c.pa.log.push({ t: Date.now(), cost, kind: 'newpow', key: c.pouvoirs.length - 1, label: `Nouveau pouvoir : ${p.n}` });
    } else c.pouvoirs.push(np);
    commit();
  });
}

function weaponDialog() {
  const c = C();
  const items = [];
  for (const [g, list] of R.ARMES) for (const [n, prec, puis, q] of list) items.push({ label: n, sub: `${g} · préc. ${sgn(prec)} · puiss. ${sgn(puis)}${q ? ' · ' + q : ''}`, g, n, prec, puis, q });
  for (const p of c.pouvoirs) { const d = R.powerDef(p.n); if (d && /attaque physique/.test(d.q || '')) { const m = d.q.match(/précision ([+\-–]\d)/); items.unshift({ label: p.n + ' (pouvoir)', sub: d.q, pouvoir: p.n, prec: m ? +m[1].replace('–', '-') : 0, puis: 0, q: d.q }); } }
  items.push({ label: 'Arme personnalisée…', custom: true });
  chooseList('Ajouter une arme', items, async (it) => {
    let w;
    if (it.custom) {
      const n = await ask('Arme', 'Nom'); if (!n) return;
      w = { n, talent: 'Combat', spe: '', prec: 0, puis: 0, melee: true, q: '' };
    } else if (it.pouvoir) {
      w = { n: it.label, talent: 'Tir', pouvoir: it.pouvoir, prec: it.prec, puis: 0, melee: false, q: it.q + ' (puissance = niveau + X)' };
    } else {
      const melee = R.MELEE_GROUPS.includes(it.g);
      const talent = it.g === 'Mains nues' ? 'Corps à corps' : melee ? 'Combat' : 'Tir';
      const spe = talent === 'Corps à corps' ? '' : (it.g === 'Armes improvisées' ? 'armes improvisées' : it.g.toLowerCase());
      w = { n: it.n, talent, spe, prec: it.prec, puis: it.puis, melee, q: it.q };
    }
    c.armes.push(w); commit();
    editWeapon(c.armes.length - 1);
  });
}
function editWeapon(i) {
  const c = C(); const w = c.armes[i];
  dialog('Arme', `<div class="grid g2">
    ${F.text('n', 'Nom', w.n, 'full')}
    ${F.select('talent', 'Talent', w.talent, ['Combat', 'Corps à corps', 'Tir'])}
    ${F.text('spe', 'Spécialité (si elle correspond à la tienne)', w.spe)}
    ${F.num('prec', 'Précision', w.prec)}${F.num('puis', 'Puissance', w.puis)}
    ${F.select('melee', 'Ajouter la Force', w.melee ? '1' : '0', [['1', 'Oui (contact)'], ['0', 'Non (distance)']])}
    ${F.text('q', 'Qualités', w.q, 'full')}</div>
    <p class="small muted">Ta spécialité : Combat ${esc(c.tal.Combat?.spe || '—')}, Tir ${esc(c.tal.Tir?.spe || '—')}.</p>`,
  `<button class="btn pri" id="w-ok">OK</button>`);
  dlg.querySelector('#w-ok').onclick = () => {
    const v = (n) => dlg.querySelector(`[name="${n}"]`).value;
    Object.assign(w, { n: v('n'), talent: v('talent'), spe: v('spe'), prec: +v('prec') || 0, puis: +v('puis') || 0, melee: v('melee') === '1', q: v('q') });
    closeDlg(); commit();
  };
}
function armorDialog() {
  const c = C();
  const items = R.ARMURES.map(([n, p, f, q]) => ({ label: n, sub: `protection ${p}${f ? ' · Force min. ' + f : ''} · ${q}`, n, p, f, q }));
  items.push({ label: 'Protection personnalisée…', custom: true });
  chooseList('Protection', items, async (it) => {
    if (it.custom) { const n = await ask('Protection', 'Nom'); if (!n) return; const p = await ask('Protection', 'Valeur de protection', '1'); c.armures.push({ n, p: +p || 0, q: '' }); }
    else c.armures.push({ n: it.n, p: it.p, fmin: it.f, q: it.q });
    commit();
  }, { search: false });
}

function hitDialog() {
  const c = C(); const a = R.annexes(c);
  const armor = c.armures.filter((x) => x.portee !== false && !/bouclier/i.test(x.n + x.q)).reduce((s, x) => s + (+x.p || 0), 0);
  const pfx = protFx(c); // pouvoirs de protection actifs : cochés d'office contre les attaques solides
  const prot = armor + pfx.filter((f) => /solides/.test(f.vs)).reduce((s, f) => s + f.prot, 0);
  dialog('Encaisser un coup', `<div class="grid g2">${F.num('dmg', 'Niveau de dommage reçu', '')}${F.num('prot', 'Protection à retirer', prot)}${F.text('note', 'Localisation, arme…', '', 'full')}</div>
    ${pfx.length ? `<div class="fx-chk"><div class="small muted">Armure portée : ${armor}. Pouvoirs actifs (décoche ceux qui ne protègent pas contre ce coup) :</div>${pfx.map((f, i) => `<label class="chk"><input type="checkbox" data-fxp="${i}" ${/solides/.test(f.vs) ? 'checked' : ''}> ${esc(f.n)} +${f.prot} <span class="muted">(${esc(f.vs)})</span></label>`).join('')}</div>` : ''}
    <div id="hit-res" class="verdict" style="margin-top:10px"></div><p class="small muted">Seuils : BL ${a.bl}, BG ${a.bg}, BF ${a.bf}, MS ${a.ms}. Couverture partielle : armure ignorée sur un double ou un triple ; importante : sur un triple.</p>`,
  `<button class="btn" data-dact="close">Annuler</button><button class="btn pri" id="hit-ok">Appliquer</button>`);
  const calc = () => {
    const d = (+dlg.querySelector('[name=dmg]').value || 0) - (+dlg.querySelector('[name=prot]').value || 0);
    const g = d >= a.ms ? 'MS' : d >= a.bf ? 'BF' : d >= a.bg ? 'BG' : d >= a.bl ? 'BL' : null;
    dlg.querySelector('#hit-res').textContent = g ? R.BLESSURES[g].n : 'Pas de blessure';
    return g;
  };
  dlg.querySelectorAll('input').forEach((x) => { x.oninput = calc; });
  dlg.querySelectorAll('[data-fxp]').forEach((x) => { x.onchange = () => {
    dlg.querySelector('[name=prot]').value = armor + [...dlg.querySelectorAll('[data-fxp]:checked')].reduce((t, y) => t + pfx[+y.dataset.fxp].prot, 0);
    calc();
  }; });
  dlg.querySelector('#hit-ok').onclick = () => {
    const g = calc();
    if (g) addWound(g, dlg.querySelector('[name=note]').value);
    closeDlg(); render();
  };
}
function addWound(g, note = '') {
  const c = C();
  c.blessures.push({ g, ouverte: true, note });
  c.pfCur = (c.pfCur ?? R.annexes(c).pf) - R.BLESSURES[g].pf;
  commit(false);
  if (g === 'MS') toast(R.typeOf(c).camp === 'neutre' && c.chance ? 'Mort subite : le personnage meurt…' : 'Mort subite : test standard de Force pour survivre !');
  else toast(`${R.BLESSURES[g].n} : –${R.BLESSURES[g].pf} PF`);
}

// ================= Générateur de personnage =================
let gen = null;
const GTYPES = [
  ['', ['ange', 'demon']], // cartes Ange et Démon, sans titre
  ['Autres personnages (livre de base, chap. 5)', ['humain', 'heroique', 'serviteur', 'soldat', 'fils', 'mortvivant', 'familier', 'incube', 'combat']],
  [`${campIco('tiers')} Troisième Force (Les Petites Apocalypses)`, ['psi', 'paien', 'renegat_a', 'renegat_d', 'fee', 'monstre']],
];
const TYPE_DESC = {
  ange: 'Serviteur d\'un archange, incarné dans un corps humain. 100 PA.', demon: 'Serviteur d\'un prince-démon, incarné dans un corps humain. 80 PA.',
  humain: 'Humain ordinaire, sans pouvoir. 20 PA.', heroique: 'Humain compétent et aguerri. 40 PA.', serviteur: 'Humain au service des forces du bien. 32 PA.',
  soldat: 'Humain intégriste qui sert de troupe aux anges. 40 PA.', fils: 'Enfant d\'un ange et d\'une humaine, élite des soldats de Dieu. 100 PA.',
  mortvivant: 'Cadavre animé par une âme arrachée aux enfers. 25 PA.', familier: 'Esprit démoniaque incarné dans un animal ou un objet. 40 PA.',
  incube: 'Enfant d\'un démon et d\'un(e) humain(e). 80 PA.', combat: 'Démon façonné pour la guerre. 80 PA.',
  psi: 'Humain doté de pouvoirs psioniques, membre d\'une conpsi. 40 à 120 PA.', paien: 'Âme d\'un héros des anciens dieux réincarnée. 60 à 120 PA.',
  renegat_a: 'Ange qui a quitté sa hiérarchie. 100 à 120 PA.', renegat_d: 'Démon qui a quitté sa hiérarchie. 80 à 120 PA.',
  fee: 'Lutin, elfe, nymphe… réfugié de Faërie. 40 à 120 PA.', monstre: 'Fantôme, expérience ratée, créature mythologique. 60 à 120 PA.',
};
// table : code d'une table de jeu à rejoindre une fois le personnage créé (« Nouveau personnage dans cette table »)
function startGenerator(tableId = null) { gen = { step: 'type', table: tableId }; drawGen(); }
function drawGen() {
  const g = gen;
  let body = '', foot = '', title = 'Nouveau personnage';
  if (g.step === 'type') {
    // Ange et démon : deux grandes cartes illustrées ; les autres types en liste
    const DUO = { demon: 'img/demon.webp', ange: 'img/ange.webp' };
    const DUO_ICO = CAMP_ICO; // auréole et cornes au-dessus du titre
    body = GTYPES.map(([h, list]) => (h ? `<div class="list-h">${h}</div>` : '') + (list.every((k) => DUO[k])
      ? `<div class="duo">${['ange', 'demon'].filter((k) => list.includes(k)).map((k) => `<button class="duo-card ${k}" data-g="type" data-v="${k}">
          <span class="dc-ico">${DUO_ICO[k]}</span><b>${R.TYPES[k].n}</b><small>${TYPE_DESC[k].replace(/\s*\d+ PA\.?\s*$/, '')}</small>
          <span class="dc-pa">${R.TYPES[k].pa} PA</span><span class="dc-img"><img src="${DUO[k]}" alt="${R.TYPES[k].n}"></span></button>`).join('')}</div>`
      : list.map((k) => `<button class="choice" data-g="type" data-v="${k}"><span><b>${R.TYPES[k].n}</b><small>${TYPE_DESC[k]}</small></span></button>`).join(''))).join('');
  } else if (g.step === 'tier') {
    const t = R.TYPES[g.type];
    title = t.n;
    body = `<p class="small muted">${esc(t.note || '')}</p>` + t.tiers.map((x, i) => `<button class="choice" data-g="tier" data-v="${i}"><span><b>${esc(x[0])} — ${x[1]} PA</b><small>Caracs ${x[2].join('–')} PA · Talents ${x[3].join('–')} PA · Pouvoirs ${x[4].join('–')} PA · ${x[5]} PP max</small></span></button>`).join('');
  } else if (g.step === 'method') {
    title = R.TYPES[g.type].n;
    body = `<button class="choice" data-g="method" data-v="rapide"><span><b>Création rapide</b><small>Un profil, un supérieur, deux pouvoirs tirés aux dés : le personnage est prêt en deux minutes. Conseillée pour débuter.</small></span></button>
      <button class="choice" data-g="method" data-v="inter"><span><b>Création intermédiaire</b><small>Création rapide, puis retouches en dépensant les mêmes PA (échanger un talent, choisir ses pouvoirs…).</small></span></button>
      <button class="choice" data-g="method" data-v="mesure"><span><b>Création sur mesure</b><small>${R.TYPES[g.type].pa} PA à répartir librement entre caractéristiques, talents, pouvoirs et PP.</small></span></button>`;
  } else if (g.step === 'profil') {
    title = 'Le profil';
    body = R.PROFILS.map((p, i) => {
      const vs = p.v.filter(([, camp]) => camp === 'both' || camp === g.camp);
      return vs.map(([vn]) => `<button class="choice" data-g="profil" data-v="${i}" data-var="${p.v.findIndex((x) => x[0] === vn)}"><span><b>${vn}</b><small>${esc(p.desc)}</small></span></button>`).join('');
    }).join('');
  } else if (g.step === 'sup') {
    title = 'Le supérieur';
    const pname = R.PROFILS[g.profil].v[g.variant][0];
    const list = R.SUPERIEURS.filter((s) => s.camp === g.camp && (g.method === 'mesure' || s.src === 'base'));
    const reco = list.filter((s) => s.prof && norm(s.prof).includes(norm(pname)));
    const reco2 = reco.filter((s) => !/éventuellement/.test(s.prof) || norm(s.prof.split('(')[0]).includes(norm(pname)));
    const item = (s) => `<button class="choice" data-g="sup" data-v="${esc(s.n)}"><span><b>${esc(s.n)}</b><small>${esc(s.titre)} · profil : ${esc(s.prof || '—')} · pouvoirs : ${esc(s.pw || '—')}</small>${s.desc ? `<small class="clamp">${esc(s.desc)}</small>` : ''}</span></button>`;
    body = (reco2.length ? `<div class="list-h">Conseillés pour un ${pname}</div>` + reco2.map(item).join('') : '') +
      `<div class="list-h">Tous</div>` + list.filter((s) => !reco2.includes(s)).map(item).join('');
  } else if (g.step === 'supMesure') {
    title = 'Le supérieur';
    const t = R.TYPES[g.type];
    const list = R.SUPERIEURS.filter((s) => s.camp === t.camp);
    body = `<button class="choice" data-g="supM" data-v=""><span><b>Aucun / plus tard</b></span></button>` + list.map((s) => `<button class="choice" data-g="supM" data-v="${esc(s.n)}"><span><b>${esc(s.n)}</b>${s.src === 'dudule' ? ' <span class="badge">Dudule</span>' : ''}<small>${esc(s.titre)} · ${esc(s.pw || '')}</small>${s.desc ? `<small class="clamp">${esc(s.desc)}</small>` : ''}</span></button>`).join('');
  } else if (g.step === 'spe') {
    title = 'Spécialités et langues';
    const c = g.c;
    const fields = [];
    for (const [n, t] of Object.entries(c.tal)) if (t.spe !== undefined && t.choix) fields.push(F.text('spe:' + n, `${n} — spécialité au choix`, t.spe));
    c.langues.forEach((l, i) => fields.push(F.text('lang:' + i, `Langue ${i + 1}`, l === 'au choix' ? '' : l, '', 'placeholder="au choix"')));
    c.multi.forEach((m, i) => fields.push(F.text('multi:' + i, m.t, m.label)));
    body = `<p class="small muted">Les spécialités proposées sont celles « généralement » choisies par les serviteurs ; tu peux les changer. On ne peut avoir qu'une spécialité par talent.</p><div class="grid g2">${fields.join('') || '<p>Rien à préciser.</p>'}</div>`;
    foot = `<button class="btn pri" data-g="speOk">Continuer</button>`;
  } else if (g.step === 'pouvoirs') {
    title = 'Les pouvoirs';
    const c = g.c; const sup = R.supByName(c.superieur);
    body = `<p><b>Pouvoirs de ${esc(sup.n)}</b> : ${esc(sup.pw)}${sup.pp ? ` (+${sup.pp} PP)` : ''}</p>
      <p class="small muted">Puis deux tirages d66 sur la table du profil ${esc(R.PROFILS[g.profil].n)} (un doublon ou une ligne interdite à ton camp se relance).</p>
      ${g.rolls.map((r, i) => `<div class="choice" style="align-items:center"><div class="die ${r ? '' : 'u'}" style="width:48px;height:48px;font-size:22px">${r ? r.d66 : '?'}</div><span style="flex:1"><b>${r ? esc(r.n) + (r.l ? ' ' + r.l : '') : 'Pas encore tiré'}</b>${r ? `<small>${r.pp ? '+' + r.pp + ' PP' : 'pas de PP bonus'}${r.plus ? ' · ' + esc(r.plus) : ''}${r.note ? ' · ' + esc(r.note) : ''}</small>` : ''}</span></div>`).join('')}
      <div class="row"><button class="btn pri" data-g="roll">${icon('die')} ${g.rolls.every(Boolean) ? 'Relancer les deux' : 'Lancer les dés'}</button><button class="btn" data-g="pickPow">Choisir sur la table (MJ)</button></div>`;
    foot = g.rolls.every(Boolean) ? `<button class="btn pri" data-g="powOk">Continuer</button>` : '';
  } else if (g.step === 'nom') {
    title = 'Dernière touche';
    const c = g.c;
    body = `<div class="grid">${F.text('gnom', 'Nom du personnage', c.nom)}${F.text('gcorps', 'Corps d\'accueil / identité humaine', c.identite.corps)}</div>
      ${g.method !== 'mesure' && c.creation !== 'crea' ? `<p class="small muted">Bilan : ${R.bilan(c).total} PA (référence : ${R.TYPES[c.type].pa} PA).</p>` : ''}
      ${['ange', 'demon'].includes(c.type) && g.method === 'mesure' ? `<label class="small"><input type="checkbox" id="gavert"> +5 PA en commençant avec un avertissement</label>` : ''}`;
    foot = `<button class="btn pri" data-g="finish">${icon('check')} ${g.method === 'rapide' ? 'Créer' : 'Créer et répartir les PA'}</button>`;
  }
  const back = g.step !== 'type' ? `<button class="btn ghost" data-g="back">Retour</button>` : '';
  dlg.innerHTML = `<div class="dlg-h"><h2>${title}</h2><button class="ibtn" data-g="close">${icon('x')}</button></div><div class="dlg-b">${body}</div><div class="dlg-f">${back}<span class="spacer"></span>${foot}</div>`;
  if (!dlg.open) dlg.showModal();
  dlg.onclick = genClick;
}
function genClick(e) {
  const b = e.target.closest('[data-g]'); if (!b) return;
  const g = gen; const a = b.dataset.g; const v = b.dataset.v;
  const go = (s) => { (g.hist ||= []).push(g.step); g.step = s; drawGen(); };
  if (a === 'close') { closeDlg(); gen = null; return; }
  if (a === 'back') { g.step = g.hist.pop(); drawGen(); return; }
  if (a === 'type') {
    g.type = v; g.camp = R.TYPES[v].camp;
    if (R.TYPES[v].tiers) return go('tier');
    if (v === 'ange' || v === 'demon') return go('method');
    g.method = 'mesure';
    if (R.TYPES[v].sup || R.TYPES[v].camp !== 'neutre') return go('supMesure');
    g.c = customCreate(g); return go('nom');
  }
  if (a === 'tier') {
    g.tier = +v; g.method = 'mesure';
    if (R.TYPES[g.type].sup) return go('supMesure');
    g.c = customCreate(g); return go('nom');
  }
  if (a === 'method') { g.method = v; return go(v === 'mesure' ? 'supMesure' : 'profil'); }
  if (a === 'profil') { g.profil = +v; g.variant = +b.dataset.var; return go('sup'); }
  if (a === 'sup') { g.c = quickCreate(g.type, g.profil, g.variant, v); g.rolls = [null, null]; return go('spe'); }
  if (a === 'supM') { g.sup = v; g.c = customCreate(g); return go('nom'); }
  if (a === 'speOk') {
    const c = g.c;
    dlg.querySelectorAll('input').forEach((inp) => {
      const [k, key] = inp.name.split(':');
      if (k === 'spe') c.tal[key].spe = inp.value.trim() || c.tal[key].spe;
      if (k === 'lang') c.langues[+key] = inp.value.trim() || 'au choix';
      if (k === 'multi') c.multi[+key].label = inp.value.trim();
    });
    return go('pouvoirs');
  }
  if (a === 'roll') { rollPowers(g); return drawGen(); }
  if (a === 'pickPow') {
    const table = R.TABLES_POUVOIRS[R.PROFILS[g.profil].n];
    const items = table.map((r) => ({ r, label: (r.a === r.b ? r.a : r.a + '–' + r.b) + ' : ' + r.n, sub: '' }));
    const slot = g.rolls[0] ? 1 : 0;
    chooseList('Pouvoir ' + (slot + 1), items, ({ r }) => {
      const x = R.tirageLigne(r, g.camp, g.c.superieur);
      if (!x) { toast('Ce pouvoir est interdit à ton camp'); } else g.rolls[slot] = { ...x, d66: r.a };
      drawGen();
    }, { search: false });
    return;
  }
  if (a === 'powOk') { applyRolledPowers(g); return go('nom'); }
  if (a === 'finish') {
    const c = g.c;
    c.nom = dlg.querySelector('[name=gnom]').value.trim() || 'Sans nom';
    c.identite.corps = dlg.querySelector('[name=gcorps]').value.trim();
    const av = dlg.querySelector('#gavert');
    if (av && av.checked) { c.avertissement = true; c.limitations.push({ k: 'Avertissement', txt: 'Avertissement de départ (+5 PA à la création)' }); }
    if (g.method === 'inter') c.creation = 'crea';
    c.pfCur = R.annexes(c).pf; c.ppCur = R.ppMax(c);
    c.updatedAt = Date.now();
    store.add(c); closeDlg(); gen = null;
    if (g.table) {
      table.share(c, g.table).then((name) => { store.save(); render(); toast(`${c.nom} rejoint la table « ${name} »`); })
        .catch((e) => { c.tableErr = errText(e); toast('Partage avec la table impossible : ' + errText(e)); });
    }
    ui.tab = 'fiche';
    ui.mode = c.creation === 'crea' ? 'crea' : 'normal';
    render();
    toast(c.creation === 'crea' ? 'Répartis tes PA avec les boutons + et –, puis « Terminer la création »' : 'Personnage créé !');
  }
}
function quickCreate(type, pi, vi, supName) {
  const c = R.blankCharacter(type);
  const p = R.PROFILS[pi]; const sup = R.supByName(supName);
  c.superieur = supName; c.profil = p.v[vi][0]; c.creation = 'rapide';
  const keys = ['fo', 'ag', 'pe', 'vo', 'pr', 'foi'];
  keys.forEach((k, i) => { c.car[k] = 4 + (p.c[vi][i] || 0) + (sup.c[i] || 0); });
  const apply = (mods) => {
    for (const m of mods) {
      if (m.langues) { c.langues.push(...m.langues); continue; }
      const def = R.talentDef(m.t);
      if (def?.kind === 'm') { c.multi.push({ t: m.t, label: m.spe || '', r: m.s ?? m.g ?? 0 }); continue; }
      const t = (c.tal[m.t] ||= { r: 0 });
      t.r = (+t.r || 0) + (m.g || 0);
      if (m.s != null) {
        if (!t.spe || (t.choix && !m.choix)) t.spe = m.spe || t.spe || '';
        t.sr = (+t.sr || 0) + m.s;
        if (m.choix && t.choix !== false) t.choix = true;
        if (!m.choix) t.choix = false;
      }
    }
  };
  apply(R.parseMods(p.tp, vi)); apply(R.parseMods(p.ts, vi));
  apply(R.parseMods(sup.tp)); apply(R.parseMods(sup.ts));
  for (const [n, t] of Object.entries(c.tal)) if (t.spe !== undefined && (+t.sr || 0) < (+t.r || 0)) t.sr = t.r;
  c.langues = [...new Set(c.langues.filter((l) => l !== 'au choix'))].concat(c.langues.filter((l) => l === 'au choix'));
  for (const s of (sup.pw || '').split(',').map((x) => x.trim()).filter(Boolean)) {
    const m = s.match(/^(.*?)\s*(\d+)?$/);
    const def = R.powerDef(m[1]);
    c.pouvoirs.push({ n: m[1], r: m[2] && !def?.a?.inv ? +m[2] * 2 : 0 });
  }
  c.ppBonus = sup.pp || 0;
  if (sup.avantage) c.possessions = sup.avantage;
  return c;
}
function rollPowers(g) {
  const table = R.TABLES_POUVOIRS[R.PROFILS[g.profil].n];
  const have = new Set(g.c.pouvoirs.map((p) => p.n));
  g.rolls = [null, null];
  for (let i = 0; i < 2; i++) {
    for (let tries = 0; tries < 50; tries++) {
      const d66 = R.d6() * 10 + R.d6();
      const x = R.tirageLigne(R.lookupTable(R.PROFILS[g.profil].n, d66), g.camp, g.c.superieur);
      if (!x || have.has(x.n) || g.rolls.some((r) => r && r.n === x.n)) continue;
      g.rolls[i] = { ...x, d66 };
      break;
    }
  }
}
function applyRolledPowers(g) {
  const c = g.c; let bonus = c.ppBonus || 0;
  for (const r of g.rolls) {
    const def = R.powerDef(r.n);
    c.pouvoirs.push({ n: r.n, r: r.l && !def?.a?.inv ? r.l * 2 : 0 });
    if (r.plus) c.pouvoirs.push({ n: r.plus, r: 0 });
    bonus += r.pp || 0;
  }
  const base = R.annexes(c).ppBase;
  c.ppBonus = Math.max(0, Math.min(bonus, 15 - base));
}
function customCreate(g) {
  const c = R.blankCharacter(g.type);
  c.tier = g.tier || 0; c.superieur = g.sup || ''; c.creation = 'crea';
  const t = R.TYPES[g.type];
  if (g.type === 'psi') c.tal['Pouvoirs psychiques'] = { r: 0 };
  for (const n of t.free || []) c.pouvoirs.push({ n, r: R.powerDef(n)?.a?.inv ? 0 : 2, free: true });
  return c;
}

// ================= Menus =================
// Sélecteur hiérarchique (comme Dragonbane) : un bloc par table — mener la partie si j'en suis le MJ,
// mes personnages qui y jouent, nouveau personnage dans cette table — puis les personnages sans table.
function charsDialog() {
  const list = store.list(); const tables = table.list();
  const inMJ = ui.screen === 'mj'; const cur = inMJ ? null : C();
  const row = (c) => `<button class="choice ${c.id === cur?.id ? 'on' : ''}" data-dact="sel" data-id="${c.id}">${crest(c)}<span><b>${esc(c.nom || 'Sans nom')}</b><small>${esc(R.typeOf(c).n)}${c.superieur ? ' · ' + esc(c.superieur) : ''}</small></span></button>`;
  const blocks = tables.map((t) => {
    const chars = list.filter((c) => c.table === t.id); const active = inMJ && table.openId === t.id;
    return `<section class="pick-group ${active || chars.some((c) => c.id === cur?.id) ? 'active' : ''}">
      <div class="pick-head"><b>${esc(t.name)}</b><small>code ${esc(t.id)}${t.mj ? ' · 👑 tu es le MJ' : ''}</small></div>
      ${t.mj ? `<button class="choice ${active ? 'on' : ''}" data-dact="mjt" data-id="${esc(t.id)}"><span class="crest">👑</span><span><b>Mener la partie</b><small>Joueurs, Combat, Scénarios, Journal, Outils</small></span></button>` : ''}
      ${chars.map(row).join('')}
      ${t.mj ? '' : `<button class="pick-add" data-dact="newin" data-id="${esc(t.id)}">${icon('plus')} Nouveau personnage dans cette table</button>`}
    </section>`;
  }).join('');
  const loose = list.filter((c) => !c.table);
  dialog('Personnages et tables', `${blocks}
    ${loose.length || !tables.length ? `<section class="pick-group ${loose.some((c) => c.id === cur?.id) ? 'active' : ''}"><div class="pick-head"><b>${tables.length ? 'Sans table' : 'Mes personnages'}</b>${tables.length ? '<small>pas partagés avec un MJ</small>' : ''}</div>
      ${loose.map(row).join('') || '<p class="small muted">Aucun personnage.</p>'}</section>` : ''}
    <p class="small muted">Un personnage rejoint une table depuis son Carnet (carte « Table de jeu ») ou avec « Nouveau personnage dans cette table ».</p>`,
  `<button class="btn ghost" data-dact="mjhome">👑 ${inMJ ? 'Mes tables de MJ' : 'Maître de jeu…'}</button>${inMJ ? '<button class="btn ghost" data-dact="mjquit">Quitter le mode MJ</button>' : ''}<button class="btn pri" data-dact="new">${icon('plus')} Nouveau</button>`);
  // Tables de MJ créées depuis un autre appareil : on les ajoute puis on redessine le sélecteur
  table.discover().then((n) => { if (n && dlg.open && dlg.querySelector('.pick-group, .pick-head')) charsDialog(); });
}
function menuDialog() {
  const c = C();
  dialog('Menu', `
    <button class="choice" data-dact="new"><span><b>Nouveau personnage</b><small>Générateur : création rapide, intermédiaire ou sur mesure</small></span></button>
    ${c ? `<button class="choice" data-dact="export1"><span><b>Exporter ce personnage</b><small>Fichier JSON à partager ou sauvegarder</small></span></button>` : ''}
    <button class="choice" data-dact="exportAll"><span><b>Exporter tous les personnages</b></span></button>
    <button class="choice" data-dact="import"><span><b>Importer un fichier</b></span></button>
    ${c ? `<button class="choice" data-dact="print"><span><b>Imprimer la fiche</b><small>Version papier simplifiée</small></span></button>` : ''}
    ${c && c.creation !== 'crea' ? `<button class="choice" data-dact="recrea"><span><b>Reprendre en création sur mesure</b><small>Affiche le bilan des PA et les quotas</small></span></button>` : ''}
    <button class="choice" data-dact="mj"><span><b>Mode maître de jeu</b><small>Préparer scénarios et combats ; table partagée pour suivre en direct les fiches des joueurs</small></span></button>
    <button class="choice" data-dact="cloud"><span><b>Sauvegarde en ligne</b><small>${store.configured ? esc(store.status.message || 'Configurée') : 'Facultatif : synchronise entre appareils (Firebase gratuit)'}</small></span></button>
    <button class="choice" data-dact="slot"><span><b>Bandit manchot : ${slot.slotPref() ? 'activé' : 'coupé'}</b><small>Les dés du d666 tournent comme les rouleaux d'une machine à sous</small></span></button>
    <button class="choice" data-dact="sound"><span><b>Son des dés : ${slot.soundOn() ? 'activé' : 'coupé'}</b><small>Manette, rouleaux, gros lots du 111 et du 666</small></span></button>
    ${c ? `<button class="choice" data-dact="delete" style="border-color:#5a1a1d"><span><b style="color:#ff8a8f">Supprimer ce personnage</b></span></button>` : ''}
    <p class="small muted">Données enregistrées sur l'appareil. Règles : In Nomine Satanis / Magna Veritas 4e édition (Siroz / Asmodée), Les Petites Apocalypses, La Bible à Dudule.</p>`);
}
function cloudDialog() {
  dialog('Sauvegarde en ligne', `<p class="small">Colle la configuration web de ton projet Firebase (Paramètres du projet > Vos applications). Voir le README.</p>
    <div class="field"><label>Configuration</label><textarea id="fbcfg" style="min-height:140px">${esc(store.meta.firebase ? JSON.stringify(store.meta.firebase, null, 2) : '')}</textarea></div>`,
  `${store.userEmail ? '<button class="btn" data-dact="logout">Déconnexion</button>' : ''}<button class="btn pri" data-dact="cfgsave">Enregistrer et se connecter</button>`);
}
// ----- Connexion : compte Google ou e-mail + mot de passe (utile sur iPad / sans compte Google) -----
const authErr = (e) => ({
  'auth/invalid-credential': 'E-mail ou mot de passe incorrect',
  'auth/wrong-password': 'E-mail ou mot de passe incorrect',
  'auth/user-not-found': 'Aucun compte avec cet e-mail',
  'auth/invalid-email': 'Adresse e-mail invalide',
  'auth/missing-password': 'Mot de passe manquant',
  'auth/email-already-in-use': 'Un compte existe déjà avec cet e-mail : connecte-toi',
  'auth/weak-password': 'Mot de passe trop court (6 caractères minimum)',
  'auth/too-many-requests': 'Trop d’essais : réessaie dans quelques minutes',
  'auth/network-request-failed': 'Pas de connexion internet',
  'auth/operation-not-allowed': 'Connexion par e-mail non activée dans Firebase (voir README)',
  'auth/popup-blocked': 'Fenêtre Google bloquée par le navigateur',
  'auth/unauthorized-domain': 'Domaine non autorisé dans Firebase (voir README)',
}[e?.code] || e?.message || 'Erreur de connexion');
function loginDialog() {
  return new Promise((resolve, reject) => {
    let mode = 'login', done = false;
    const st = { email: '', pw: '', name: '' };
    const draw = (msg = '') => {
      const isNew = mode === 'new';
      dialog(isNew ? 'Créer un compte' : 'Connexion', `
        <p class="small muted">Le compte sert à retrouver tes personnages sur tous tes appareils et à rejoindre une table de jeu.</p>
        ${isNew ? '' : `<button class="btn" id="lg-google" style="width:100%;justify-content:center">Continuer avec Google</button>
        <p class="small muted" style="text-align:center;margin:12px 0 4px">ou avec ton e-mail (iCloud, Gmail, Outlook…)</p>`}
        ${isNew ? `<div class="field"><label>Pseudo (affiché au maître de jeu)</label><input id="lg-name" autocomplete="nickname" value="${esc(st.name)}"></div>` : ''}
        <div class="field"><label>E-mail</label><input id="lg-email" type="email" autocomplete="email" autocapitalize="off" value="${esc(st.email)}"></div>
        <div class="field"><label>Mot de passe${isNew ? ' (6 caractères minimum)' : ''}</label><input id="lg-pw" type="password" autocomplete="${isNew ? 'new-password' : 'current-password'}" value="${esc(st.pw)}"></div>
        ${msg ? `<p class="small" id="lg-msg" style="color:#ff8a8f">${esc(msg)}</p>` : ''}
        <p class="small" style="margin-bottom:0">${isNew
          ? '<a href="#" id="lg-mode">J’ai déjà un compte</a>'
          : '<a href="#" id="lg-mode">Créer un compte</a> · <a href="#" id="lg-reset">Mot de passe oublié</a>'}</p>`,
      `<button class="btn" data-dact="close">Annuler</button><button class="btn pri" id="lg-ok">${isNew ? 'Créer le compte' : 'Se connecter'}</button>`);
      const $ = (id) => dlg.querySelector('#' + id);
      const keep = () => { st.email = $('lg-email').value; st.pw = $('lg-pw').value; if ($('lg-name')) st.name = $('lg-name').value; };
      const busy = (on) => dlg.querySelectorAll('button, input').forEach((el) => { if (el.dataset.dact !== 'close') el.disabled = on; });
      const finish = () => { done = true; closeDlg(); resolve(); };
      const run = async (fn) => {
        keep(); busy(true);
        try { await fn(); finish(); } catch (e) { busy(false); draw(authErr(e)); }
      };
      const submit = () => run(() => (isNew ? cloud.signUpEmail(st.email, st.pw, st.name) : cloud.signInEmail(st.email, st.pw)));
      $('lg-ok').onclick = submit;
      $('lg-pw').onkeydown = (e) => { if (e.key === 'Enter') submit(); };
      if ($('lg-google')) $('lg-google').onclick = () => run(() => cloud.signInGoogle());
      $('lg-mode').onclick = (e) => { e.preventDefault(); keep(); mode = isNew ? 'login' : 'new'; draw(); };
      if ($('lg-reset')) $('lg-reset').onclick = async (e) => {
        e.preventDefault(); keep();
        if (!st.email.trim()) return draw('Saisis d’abord ton e-mail');
        try { await cloud.resetPassword(st.email); toast('E-mail de réinitialisation envoyé (vérifie aussi les spams)'); }
        catch (err) { draw(authErr(err)); }
      };
      (isNew ? $('lg-name') : $('lg-email')).focus();
    };
    draw();
    onRealClose(() => { if (!done) reject(Object.assign(new Error('Connexion annulée'), { code: 'auth/popup-closed-by-user' })); });
  });
}
cloud.setLoginUI(loginDialog);
function download(name, text) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
function importFile() {
  const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.json,application/json';
  inp.onchange = async () => {
    try { const n = store.importAll(await inp.files[0].text()); toast(`${n} personnage(s) importé(s)`); render(); } catch (e) { toast('Fichier illisible : ' + e.message); }
  };
  inp.click();
}
function printSheet() {
  const c = C(); const a = R.annexes(c);
  const w = window.open('', '_blank');
  const tal = Object.keys(c.tal).map((n) => `${n} ${L(R.talentLevel(c, n))}${c.tal[n].spe ? ` (${c.tal[n].spe} ${L(R.talentSpe(c, n))})` : ''}`).join(', ');
  w.document.write(`<html><head><meta charset="utf-8"><title>${esc(c.nom)}</title><style>body{font-family:Georgia,serif;max-width:800px;margin:20px auto;color:#111}h1{margin:0}td,th{border:1px solid #999;padding:4px 8px}table{border-collapse:collapse;margin:8px 0}</style></head><body>
  <h1>${esc(c.nom)}</h1><p>${esc(R.typeOf(c).n)}${c.superieur ? ' de ' + esc(c.superieur) : ''} · grade ${c.grade || 0}</p>
  <table><tr>${R.CARACS.map((k) => `<th>${R.caracName(c, k.k)}</th>`).join('')}</tr><tr>${R.CARACS.map((k) => `<td>${L(c.car[k.k])}</td>`).join('')}</tr></table>
  <p><b>PF</b> ${a.pf} · <b>PP</b> ${R.ppMax(c)} · <b>BL</b> ${a.bl} / <b>BG</b> ${a.bg} / <b>BF</b> ${a.bf} / <b>MS</b> ${a.ms}</p>
  <p><b>Talents</b> (autres au niveau de base) : ${esc(tal)}${c.multi.length ? ', ' + c.multi.map((m) => `${m.t} (${m.label}) ${L(2 + m.r)}`).join(', ') : ''}</p>
  <p><b>Langues</b> : ${esc(c.langues.join(', ') || '—')}</p>
  <p><b>Pouvoirs</b> : ${esc(c.pouvoirs.map((p) => p.n + (p.r ? ' ' + L(p.r) : '')).join(', '))}</p>
  <p><b>Armes</b> : ${esc(c.armes.map((x) => `${x.n} (préc. ${sgn(x.prec)}, puiss. ${sgn(x.puis)})`).join(', ') || '—')}</p>
  ${(c.sac || []).length ? `<p><b>Équipement</b> : ${esc(c.sac.map((x) => (x.nb ?? 1) > 1 ? `${x.n} ×${x.nb}` : x.n).join(', '))}</p>` : ''}<p><b>Possessions</b> : ${esc(c.possessions)}</p>${vieAnswers(c).some(([, v]) => v) ? `<p><b>Vie privée</b> : ${esc(vieAnswers(c).filter(([, v]) => v).map(([x, v]) => `${x.q} : ${x.opts.find((o) => o.k === v)?.t || v}`).join(' ; '))}</p>` : ''}${c.vie?.bg ? `<p><b>Background</b> : ${esc(c.vie.bg)}</p>` : ''}<p><b>Notes</b> : ${esc(c.notes)}</p>
  <script>print()<\/script></body></html>`);
  w.document.close();
}

// ================= Table de jeu : côté joueur =================
function ago(t) {
  if (!t) return '—';
  const m = Math.round((Date.now() - t) / 60000);
  return m < 1 ? 'à l\'instant' : m < 60 ? `il y a ${m} min` : m < 1440 ? `il y a ${Math.round(m / 60)} h` : 'le ' + new Date(t).toLocaleDateString('fr-FR');
}
function tableStatus(c) { return c.tableErr ? 'Erreur : ' + c.tableErr : c.tableSent ? 'Dernier envoi ' + ago(c.tableSent) : 'Envoi en cours…'; }
function renderTableCard(c) {
  if (!store.configured) return '';
  return `<section class="card">
    <h2>Table de jeu <span class="tag">partage avec le MJ</span></h2>
    ${c.table ? `<p style="margin-top:0">Fiche partagée avec la table <b>${esc(c.tableName || c.table)}</b> (code <span class="type">${esc(c.table)}</span>).<br>
      <span class="small muted" id="table-status">${esc(tableStatus(c))}</span></p>
      <label class="small"><input type="checkbox" data-act="table-private" ${c.notesPrivees ? 'checked' : ''}> Ne pas montrer mes notes au MJ</label>
      <div class="row" style="margin-top:8px"><button class="btn sm" data-act="table-push">Envoyer maintenant</button><button class="btn sm danger" data-act="table-stop">Arrêter le partage</button></div>`
    : `<div class="row"><input class="inp" id="table-code" style="max-width:170px;text-transform:uppercase" placeholder="Code de la table" autocomplete="off"><button class="btn pri" data-act="table-share">Partager ma fiche</button></div>`}
    <p class="small muted" style="margin-bottom:0">Le MJ voit ta fiche en lecture seule (caractéristiques, talents, pouvoirs, PF, PP, blessures…) ; elle se met à jour toute seule quelques secondes après chaque modification.</p>
  </section>`;
}

// ================= Table de jeu : écran du maître de jeu =================
// Manuel utilisateur : rubriques repliables, version joueur ou maître de jeu
function helpDialog(who) {
  const mj = who === 'mj';
  const list = mj ? MANUEL_MJ : MANUEL_JOUEUR;
  dialog(mj ? 'Manuel du maître de jeu' : 'Manuel du joueur', `<div class="manuel">
    ${list.map((r, i) => `<details${i === 0 ? ' open' : ''}><summary>${r.titre}</summary><div class="manuel-b">${r.html}</div></details>`).join('')}
  </div>`);
}
// Mot de passe du mode MJ (si un verrou est défini dans config.js), demandé une fois par appareil
function mjPasswordDialog() {
  return new Promise((resolve) => {
    let ok = false;
    const draw = (msg = '') => {
      dialog('Mode maître de jeu', `<p class="small muted">Réservé au maître de jeu : saisis le mot de passe MJ. Il ne sera plus demandé sur cet appareil.</p>
        <div class="field"><label>Mot de passe MJ</label><input id="mjpw" type="password" autocomplete="off"></div>
        ${msg ? `<p class="small" style="color:#ff8a8f;margin-bottom:0">${esc(msg)}</p>` : ''}`,
      `<button class="btn" data-dact="close">Annuler</button><button class="btn pri" id="mjpw-ok">Entrer</button>`);
      const inp = dlg.querySelector('#mjpw'); inp.focus();
      const go = async () => {
        try {
          if (await mjLock.tryUnlock(inp.value)) { ok = true; closeDlg(); resolve(true); } else draw('Mot de passe incorrect');
        } catch (e) { draw(e.message); }
      };
      dlg.querySelector('#mjpw-ok').onclick = go;
      inp.onkeydown = (e) => { if (e.key === 'Enter') go(); };
    };
    draw();
    onRealClose(() => { if (!ok) resolve(false); });
  });
}
function enterMJ(opts = {}) {
  if (!mjLock.unlocked) { mjPasswordDialog().then((ok) => { if (ok) enterMJ(opts); }); return; }
  ui.screen = 'mj'; localStorage.setItem('insmv.screen', 'mj');
  if (opts.table && store.configured) {
    if (table.openId !== opts.table) { table.open(opts.table); ui.mjChar = null; ui.mjTab = 'vue'; }
    ui.mjSec = 'joueurs'; localStorage.setItem('insmv.mjsec', 'joueurs');
  }
  table.discover();
  if (store.configured && table.openId && !table.current) table.open(table.openId);
  render(); window.scrollTo(0, 0);
}
const MJ_SECS = [['joueurs', 'Joueurs', 'user'], ['combat', 'Combat', 'sword'], ['scen', 'Scénarios', 'book'], ['journal', 'Journal', 'list'], ['outils', 'Outils', 'box']];
// Outils du MJ : tables aléatoires et bestiaire (types d'ennemis réutilisables)
function renderOutils() {
  if (ui.npcEdit?.type) { const t = scen.getType(ui.npcEdit.type); if (t) return renderNpcEdit(null, null, t); ui.npcEdit = null; }
  return `${renderAlea()}${renderBestiaire()}`;
}
function renderMJ() {
  const t = table.current; const openId = store.configured ? table.openId : null;
  if (!MJ_SECS.some(([k]) => k === ui.mjSec)) ui.mjSec = 'joueurs';
  scen.setTable(openId); // les choix notés au journal sont rattachés à la table ouverte
  const s = ui.mjSec === 'scen' ? scen.get(ui.scenId) : null;
  const tName = openId ? (t?.name || table.list().find((x) => x.id === openId)?.name || 'Connexion…') : null;
  const sub = openId ? `Maître de jeu · code ${openId}` : store.configured ? 'Maître de jeu · aucune table ouverte' : 'Maître de jeu · hors ligne';
  const body = ui.mjSec === 'journal' ? renderMemo() : ui.mjSec === 'outils' ? renderOutils() : ui.mjSec === 'scen' ? renderScen(s) : ui.mjSec === 'combat' ? renderMJCombat()
    : !store.configured ? `<section class="card"><h2>Table partagée</h2><p>La table de jeu partagée passe par la sauvegarde en ligne (Firebase) : chacun se connecte avec son compte Google ou un e-mail et un mot de passe.</p>
      <div class="row"><button class="btn pri" data-act="mj-cloud">${icon('cloud')} Configurer la sauvegarde en ligne</button></div>
      <p class="small muted" style="margin-bottom:0">Les <b>scénarios</b> (scènes, combats préparés, PNJ) fonctionnent sans connexion.</p></section>`
    : openId ? renderMJTable() : renderMJTables();
  return `<header class="top">
    <button class="ibtn" data-act="chars" title="Personnages et tables">${icon('folder')}</button>
    <div class="who click" data-act="chars" title="Changer de table ou de personnage"><h1>👑 ${esc(tName || 'Maître de jeu')} <span class="caret">▾</span></h1><div class="sub">${esc(sub)}</div></div>
    ${mjLock.enabled ? `<button class="ibtn" data-act="mj-lock" title="Verrouiller le mode MJ sur cet appareil">${icon('x')}</button>` : ''}
    <button class="ibtn" data-act="help" data-v="mj" title="Manuel du maître de jeu">${icon('help')}</button>
    <button class="ibtn" data-act="freeroll" title="Lancer les dés">${icon('die')}</button>
  </header>
  <main>${body}</main>
  <nav class="tabs">${MJ_SECS.map(([k, l, ic]) => `<button class="${ui.mjSec === k ? 'on' : ''}" data-act="mj-sec" data-v="${k}">${icon(ic)}${l}</button>`).join('')}</nav>`;
}
// ---- Tables aléatoires du MJ (js/data/tables-mj.js) ----
// Jet selon le dé de la table ; mod : modificateur ajouté aux jets additionnés (d6, 2d6, 3d6)
function rollTable(t, mod = 0) {
  const d6 = () => 1 + Math.floor(Math.random() * 6);
  const pick = (n) => 1 + Math.floor(Math.random() * n);
  switch (t.de) {
    case 'd66': return d6() * 10 + d6();
    case 'd666': return d6() * 100 + d6() * 10 + d6();
    case '2d6': return d6() + d6() + mod;
    case '3d6': return d6() + d6() + d6() + mod;
    case 'd6': return d6() + mod;
    default: return pick(t.lignes.length); // d26, liste : une ligne au hasard (rang)
  }
}
// Ligne correspondant au jet : « 3 », « 1-2 », « 11-14 », « 12+ », « -1 » ; pour une liste, le rang
function tableRow(t, v) {
  if (!['d6', '2d6', '3d6', 'd66', 'd666'].includes(t.de)) return t.lignes[v - 1];
  const rows = t.lignes.map((r) => {
    const s = String(r.d).trim(); let m;
    if ((m = s.match(/^(-?\d+)\s*\+$/))) return [r, +m[1], Infinity];
    if ((m = s.match(/^(-?\d+)\s*[-–à]\s*(-?\d+)$/))) return [r, +m[1], +m[2]];
    if ((m = s.match(/^(-?\d+)\s*-$|^-\s*(\d+)$/))) return [r, -Infinity, +(m[1] || -m[2])];
    return [r, +s, +s];
  });
  const hit = rows.find(([, a, b]) => v >= a && v <= b);
  if (hit) return hit[0];
  // hors table (modificateurs) : première ou dernière ligne
  return v < rows[0][1] ? rows[0][0] : rows[rows.length - 1][0];
}
// Tables écrites pour des scénarios des livres : table → fichiers des scénarios (s.livre des copies)
const FI = (n) => SCENARIOS_LIVRES.filter((x) => /^fire-and-ice-\d+/.test(x.file) && (!n || n.includes(+x.file.match(/\d+/)[0]))).map((x) => x.file);
const TABLE_SCENS = {
  'evenements-guerre': ['livret-mv-2-notre-peuple-vaincra'],
  'incidents-centre-de-tri': FI(),
  'trouver-chez-regis': FI([6, 11]),
  'theories-pink-queens': ['jesus-reviens-3-new-york'],
};
const scenNom = (file) => SCENARIOS_LIVRES.find((x) => x.file === file)?.nom || file;
function tableScenTxt(t) {
  const l = TABLE_SCENS[t.id]; if (!l) return '';
  const fi = l.length > 2 && l.every((f) => f.startsWith('fire-and-ice'));
  return ` · <b>scénario${l.length > 1 ? 's' : ''} : ${esc(fi ? 'campagne Fire and Ice' : l.map(scenNom).join(', '))}</b>`;
}
// Tables d'un scénario : celles du livre (selon son fichier d'origine) puis celles ajoutées par le MJ
const bookTables = (s) => (s.livre ? TABLES_MJ.filter((t) => TABLE_SCENS[t.id]?.includes(s.livre)) : []);
const tableById = (id) => TABLES_MJ.find((t) => t.id === id);
function renderScenTables(s) {
  const book = bookTables(s); const mine = (s.tables || []).map(tableById).filter(Boolean).filter((t) => !book.includes(t));
  if (!book.length && !mine.length) return '';
  return `<section class="card"><h2>Tables aléatoires <span class="tag">${book.length + mine.length}</span></h2>
    ${book.map((t) => aleaCard(t)).join('')}
    ${mine.map((t) => aleaCard(t, `<button class="btn sm ghost" data-act="sc-tab-del" data-key="${esc(t.id)}">Retirer</button>`)).join('')}
    <div class="row"><button class="btn sm" data-act="sc-tab-add">${icon('plus')} Ajouter une table</button></div>
    ${book.length ? '<p class="small muted" style="margin-bottom:0">Les tables écrites pour ce scénario sont reliées automatiquement.</p>' : ''}</section>`;
}
function sceneTables(s, sc) {
  const l = (sc.tables || []).map(tableById).filter(Boolean); if (!l.length) return '';
  return `<div style="margin-top:8px"><div class="small muted" style="margin-bottom:4px">Tables de la scène</div>${l.map((t) => aleaCard(t, `<button class="btn sm ghost" data-act="sc-tab-del" data-scene="${esc(sc.id)}" data-key="${esc(t.id)}">Retirer</button>`)).join('')}</div>`;
}
function addTableDialog(s, sc) {
  const have = new Set([...(sc ? sc.tables || [] : [...(s.tables || []), ...bookTables(s).map((t) => t.id)])]);
  const items = TABLES_MJ.filter((t) => !have.has(t.id)).map((t) => ({ t, label: t.nom, sub: `${t.groupe} · ${t.livre}${t.usage ? ' — ' + t.usage : ''}` }));
  chooseList(sc ? `Table pour « ${sc.nom} »` : 'Table pour le scénario', items, ({ t }) => {
    const o = sc || s; (o.tables ||= []).push(t.id); scen.save(s); render();
  });
}
const aleaRes = (t) => { const r = ui.aleaRes?.[t.id]; return r ? `<div class="alea-res"><b>${esc(t.de === 'liste' || t.de === 'd26' ? String(r.row?.d ?? '') : String(r.v))}</b> ${esc(r.row?.t || '—')}${r.row?.camp ? ` ${campTag(r.row.camp)}` : ''}
      <div class="row" style="margin-top:6px"><button class="btn sm" data-act="mj-alea-roll" data-key="${esc(t.id)}">Relancer</button><button class="btn sm ghost" data-act="mj-alea-note" data-key="${esc(t.id)}">Noter dans le journal</button></div></div>` : ''; };
const aleaRef = (t) => t.de === 'ref';
// Table en colonnes : jet, résultat (et camp si la table en a) ; la ligne tirée est surlignée
function aleaTable(t) {
  const hit = ui.aleaRes?.[t.id]?.row; const camp = t.lignes.some((r) => r.camp);
  const h = { liste: 'N°', d26: 'Lettre', ref: '' }[t.de] ?? t.de;
  return `<div class="alea-tab"><table class="ref alea">${h !== '' || camp ? `<tr><th>${esc(h || 'Cas')}</th><th>Résultat</th>${camp ? '<th>Camp</th>' : ''}</tr>` : ''}
    ${t.lignes.map((r) => `<tr${r === hit ? ' class="hit"' : ''}><td class="d">${esc(String(r.d))}</td><td>${esc(r.t)}</td>${camp ? `<td class="small">${campTag(r.camp)}</td>` : ''}</tr>`).join('')}</table></div>`;
}
function aleaCard(t, rm = '') {
  const res = aleaRes; const ref = aleaRef;
  return `<div class="pow"><div class="ph"><div class="pn">${esc(t.nom)}</div><span class="small muted">${esc(ref(t) ? 'consultation' : t.de)}</span>
      ${t.mods && !ref(t) ? `<input class="inp" type="number" style="width:64px" placeholder="mod." value="${esc(String(ui.aleaMod?.[t.id] ?? ''))}" data-alea-mod="${esc(t.id)}" title="Modificateur au jet">` : ''}
      ${ref(t) ? '' : `<button class="btn sm pri" data-act="mj-alea-roll" data-key="${esc(t.id)}">Tirer</button>`}</div>
    <div class="meta">${esc(t.livre)}${t.ref ? ', ' + esc(t.ref) : ''}${tableScenTxt(t)}${t.camp ? ` · ${campTag(t.camp)}` : ''}</div>
    ${t.usage ? `<div class="psum">${esc(t.usage)}</div>` : ''}${t.mods ? `<div class="small muted">Modificateurs : ${esc(t.mods)}</div>` : ''}
    ${res(t)}
    ${ref(t) ? '' : `<button class="btn sm ghost" data-act="toggle" data-key="al${esc(t.id)}">${ui.open['al' + t.id] ? 'Masquer la table' : 'Voir la table'}</button>`}${rm}
    ${ui.open['al' + t.id] || ref(t) ? `${aleaTable(t)}${t.note ? `<p class="small muted">${esc(t.note)}</p>` : ''}` : ''}</div>`;
}
function renderAlea() {
  const q = norm(ui.aleaQ || ''); const camp = ui.aleaCamp ?? tableCamp();
  // deux sortes : générales (toute partie) et propres à un scénario des livres ; par défaut, les générales
  const kind = ui.aleaKind || 'gen'; const isScen = (t) => !!TABLE_SCENS[t.id];
  const nScen = TABLES_MJ.filter(isScen).length;
  const ok = (t) => (kind === 'tout' || (kind === 'scen') === isScen(t)) && (!camp || !t.camp || t.camp === camp) && (!q || norm(`${t.nom} ${t.groupe} ${t.livre} ${t.usage || ''} ${t.sup || ''}`).includes(q));
  const list = TABLES_MJ.filter((t) => !t.sup && ok(t));
  const supTables = TABLES_MJ.filter((t) => t.sup && ok(t));
  const groups = [...new Set([...list.map((t) => t.groupe), ...(supTables.length ? [supTables[0].groupe] : [])])];
  const supSel = ui.aleaSup && supTables.find((t) => t.sup === ui.aleaSup) ? ui.aleaSup : supTables[0]?.sup;
  return `<section class="card"><h2>Tables aléatoires <span class="tag">${TABLES_MJ.length} tables</span></h2>
    <div class="row"><input class="inp" id="alea-q" placeholder="Rechercher une table…" value="${esc(ui.aleaQ || '')}" style="flex:1;min-width:160px">
      <select class="inp" id="alea-camp" style="max-width:150px">${[['', 'Tous les camps'], ['ange', 'Anges'], ['demon', 'Démons'], ['tiers', 'Troisième Force']].map(([v, l]) => `<option value="${v}" ${camp === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
    <div class="seg" style="margin-top:8px">${[['gen', `Générales (${TABLES_MJ.length - nScen})`], ['scen', `Propres aux scénarios (${nScen})`], ['tout', 'Toutes']].map(([k, l]) => `<button class="${kind === k ? 'on' : ''}" data-act="mj-alea-kind" data-v="${k}">${l}</button>`).join('')}</div>
    <p class="small muted" style="margin-bottom:0">Tables relevées dans les livres. Les tables propres à un scénario apparaissent aussi d’elles-mêmes dans ce scénario. Le résultat peut être noté dans le journal de la campagne (onglet « Choix des joueurs »).</p></section>
    ${groups.map((g) => `<section class="card"><h2>${esc(g)}</h2>
      ${g === supTables[0]?.groupe ? `<div class="row" style="margin-bottom:8px"><select class="inp" id="alea-sup">${supTables.map((t) => `<option ${t.sup === supSel ? 'selected' : ''}>${esc(t.sup)}</option>`).join('')}</select></div>${supTables.filter((t) => t.sup === supSel).map((t) => aleaCard(t)).join('')}` : ''}
      ${list.filter((t) => t.groupe === g).map((t) => aleaCard(t)).join('')}</section>`).join('') || '<section class="card"><div class="empty">Aucune table</div></section>'}`;
}
function renderMJTables() {
  return `<section class="card">
    <h2>Mes tables</h2>
    ${table.mine.map((x) => `<div class="trow click" data-act="mj-open" data-key="${esc(x.id)}"><div class="tn"><b>${esc(x.name)}</b><br><small>code ${esc(x.id)}</small></div>
      <button class="ibtn" style="width:34px;height:34px" data-act="mj-forget" data-key="${esc(x.id)}" title="Oublier sur cet appareil">${icon('trash')}</button></div>`).join('') || '<div class="empty">Aucune table pour l\'instant</div>'}
    <h3>Nouvelle table</h3>
    <div class="row"><input class="inp" id="mj-name" placeholder="Nom de la campagne ou du groupe" style="flex:1;min-width:160px"><button class="btn pri" data-act="mj-create">${icon('plus')} Créer</button></div>
    <h3>Retrouver une table sur cet appareil</h3>
    <div class="row"><input class="inp" id="mj-code" placeholder="Code" style="max-width:150px;text-transform:uppercase"><button class="btn" data-act="mj-add">Ajouter</button></div>
    <p class="small muted" style="margin-bottom:0">Crée une table et donne son code à tes joueurs. Dans le <b>Carnet</b> de leur personnage, carte « Table de jeu », ils saisissent le code et touchent « Partager ma fiche ». Leurs fiches apparaissent alors ici et se mettent à jour en direct. Chacun doit être connecté (compte Google ou e-mail).</p>
  </section>`;
}
function mjBar(cur, max, cls = '') {
  return `<div class="tracker"><span class="lab">${cls === 'pf' ? 'PF' : 'PP'}</span>${bar(cur, max, cls)}</div>`;
}
// ---- Camp de la table : les scénarios et tables des livres proposés s'y limitent ----
const CAMPS = [['demon', 'Démons (INS)'], ['ange', 'Anges (MV)'], ['tiers', 'Troisième Force (Petites Apocalypses)'], ['tous', 'Tous les camps']];
const campLabel = (k) => CAMPS.find((x) => x[0] === k)?.[1] || '';
const TIERS = ['psi', 'paien', 'fee', 'monstre'];
const charCamp = (c) => (TIERS.includes(c.type) ? 'tiers' : ['ange', 'demon'].includes(R.TYPES[c.type]?.camp) ? R.TYPES[c.type].camp : '');
// camp déduit des fiches partagées : tous les PJ du même camp
function autoCamp() {
  const l = [...new Set(table.characters().map((x) => charCamp(x.c)).filter(Boolean))];
  return l.length === 1 ? l[0] : '';
}
// camp en vigueur : réglé par le MJ, sinon déduit des fiches ; '' = pas de filtre
function tableCamp() {
  if (!store.configured || !table.openId) return '';
  const c = table.camp() || (table.current ? autoCamp() : '');
  return c === 'tous' ? '' : c;
}
const LIB_CAMP = { INS: 'demon', MV: 'ange', '3e Force': 'tiers' };
const libCamp = (x) => LIB_CAMP[x?.camp] || '';
const scenCamp = (s) => libCamp(SCENARIOS_LIVRES.find((x) => x.file === s.livre));
function campBar() {
  const c = tableCamp();
  return c ? `<div class="small muted" style="margin:0 0 8px">Camp de la table : ${campIco(c)} <b>${esc(campLabel(c))}</b>${table.camp() ? '' : ' (d’après les fiches)'}</div>` : '';
}
// Idées d'accroches pour le MJ, une par réponse (« camp-question-réponse ») : la vie privée qui s'invite dans la partie
const VIE_HOOKS = {
  'ange-0-a': 'Son service dans l’Administration le convoque pour une urgence de bureau… le jour de la mission.',
  'ange-0-b': 'Son métier humain le rattrape : un collègue a besoin de lui, un client important débarque.',
  'ange-1-a': 'Un client mécontent ou un contrôle fiscal menace son activité au pire moment.',
  'ange-1-b': 'Son patron exige un justificatif pour sa dernière absence : une de plus et c’est le licenciement.',
  'ange-2-a': 'Mariage, baptême ou anniversaire : toute la famille compte sur lui ce week-end.',
  'ange-2-b': 'Garde alternée : il doit récupérer les enfants à 18 h, mission ou pas.',
  'ange-2-c': 'Un oncle malade ou un cousin dans le pétrin appelle à l’aide.',
  'ange-3-a': 'Un proche le suit pour comprendre ses absences… et tombe sur une scène surnaturelle.',
  'ange-3-b': 'Un proche a engagé un détective privé (ou un démon se fait passer pour lui).',
  'ange-3-c': 'Sa famille sait : un démon l’apprend et menace de s’en servir.',
  'ange-4-a': 'À l’association, il croise une personne en détresse liée à l’affaire en cours.',
  'ange-4-b': 'Son samedi tranquille est gâché par un voisin bruyant… peut-être possédé.',
  'ange-4-c': 'Une soirée qui dérape : trou de mémoire et photos compromettantes sur les réseaux.',
  'ange-5-a': 'Le curé de sa paroisse lui confie un secret troublant.',
  'ange-5-b': 'Un serviteur de Dieu zélé lui reproche ses absences à la messe et le signale.',
  'ange-5-c': 'Ses propos ont été rapportés : un ange de Dominique enquête sur sa loyauté.',
  'demon-0-a': 'L’enquête sur la disparition de sa famille est rouverte : un inspecteur tenace frappe à sa porte.',
  'demon-0-b': 'Quelqu’un de son ancienne vie le reconnaît dans la rue.',
  'demon-0-c': 'Sa famille découvre quelque chose : un objet, une brûlure, un familier.',
  'demon-1-a': 'Un ange menace sa famille pour le faire plier.',
  'demon-1-b': 'Un parent sorti de prison ou de l’asile veut se venger.',
  'demon-1-c': 'Ses serviteurs familiaux font du zèle et attirent l’attention.',
  'demon-2-a': 'Son poste fait des envieux : un démon ambitieux veut sa place.',
  'demon-2-b': 'Séminaire obligatoire, promotion en jeu… pendant la mission.',
  'demon-2-c': 'Son supérieur lui demande un service lié à son travail.',
  'demon-2-d': 'Les égouts sont inspectés : travaux, police, chasseurs d’alligators.',
  'demon-3-a': 'Un client douteux propose un contrat trop beau pour être honnête.',
  'demon-3-b': 'Son patron exige un justificatif, un collègue fouineur pose des questions.',
  'demon-4-a': 'Témoin d’un crime, il est convoqué au commissariat.',
  'demon-4-b': 'Un indic l’a balancé : l’enquête se rapproche.',
  'demon-4-c': 'Un ancien complice réapparaît et le fait chanter.',
  'demon-4-d': 'Une battue est organisée après des témoignages sur une « bête ».',
  'demon-5-a': 'Un ami démon lui demande de couvrir une grosse bêtise.',
  'demon-5-b': 'Quelqu’un s’intéresse sincèrement à lui… ou c’est un piège d’ange.',
  'demon-5-c': 'Un pote humain est mêlé malgré lui à l’affaire en cours.',
};
// ---- Vue MJ : la vie privée des PJ de la table ----
// réponses regroupées (qui a répondu quoi), accroches, recherche dans les réponses et les backgrounds
function renderMJVie(list) {
  const q = norm(ui.vieQ || '');
  const nm = (x) => x.c.nom || x.player || 'PJ';
  const txt = (x) => norm([...vieAnswers(x.c).filter(([, v]) => v).map(([y, v]) => `${y.q} ${y.opts.find((o) => o.k === v)?.t || ''}`), x.c.vie?.bg || ''].join(' '));
  const found = q ? list.filter((x) => txt(x).includes(q)) : [];
  const empty = list.filter((x) => !vieAnswers(x.c).some(([, v]) => v) && !x.c.vie?.bg);
  const camps = ['ange', 'demon'].filter((k) => list.some((x) => vieCamp(x.c) === k));
  const block = (camp) => {
    const Q = VIE_Q[camp]; const pcs = list.filter((x) => vieCamp(x.c) === camp);
    return `<section class="card"><h2>${campIco(camp)} Vie privée des ${camp === 'ange' ? 'anges' : 'démons'} <span class="tag">${pcs.length} PJ</span></h2>
      ${Q.qs.map((y, i) => {
        const rows = y.opts.map((o) => {
          const who = pcs.filter((x) => x.c.vie?.q?.[`${camp}-${i}`] === o.k && vieAnswers(x.c).some(([z]) => z === y));
          if (!who.length) return '';
          const hook = VIE_HOOKS[`${camp}-${i}-${o.k}`];
          return `<div class="vie-r"><div class="vie-who">${who.map((x) => `<span class="pj">${crest(x.c)} ${esc(nm(x))}</span>`).join('')}</div>
            <div class="small"><b>${o.k}.</b> ${esc(o.t)}</div>
            ${hook ? `<div class="vie-hook small"><span>💡 ${esc(hook)}</span><button class="btn sm ghost" data-act="mj-vie-note" data-key="${camp}-${i}-${o.k}" data-pjs="${esc(who.map(nm).join('|'))}">Noter</button></div>` : ''}</div>`;
        }).join('');
        return rows ? `<div class="vie-q"><div class="vie-h">${esc(y.q)}</div>${rows}</div>` : '';
      }).join('') || '<div class="empty">Aucune réponse pour l’instant</div>'}</section>`;
  };
  const bgs = list.filter((x) => x.c.vie?.bg);
  return `<section class="card">
      <h2>Vie privée</h2>
      <input class="inp" id="vie-q" placeholder="Rechercher dans les réponses et les backgrounds (famille, patron, police…)" value="${esc(ui.vieQ || '')}">
      ${q ? `<div style="margin-top:8px">${found.length ? found.map((x) => `<span class="pj">${crest(x.c)} ${esc(nm(x))}</span>`).join(' ') : '<span class="small muted">Aucun PJ ne correspond</span>'}</div>` : ''}
      <p class="small muted" style="margin-bottom:0">Les joueurs remplissent l’onglet <b>Vie privée</b> de leur fiche. Ici, leurs réponses sont regroupées avec une idée d’accroche pour chacune : « Noter » la met au journal de la campagne, rattachée aux PJ concernés.${empty.length ? ` Pas encore rempli : ${esc(empty.map(nm).join(', '))}.` : ''}</p>
    </section>
    ${camps.map(block).join('')}
    ${bgs.length ? `<section class="card"><h2>Backgrounds</h2>${bgs.map((x) => `<details class="vie-bg"><summary>${crest(x.c)} <b>${esc(nm(x))}</b></summary><p class="small" style="white-space:pre-line">${esc(x.c.vie.bg)}</p></details>`).join('')}</section>` : ''}`;
}
function renderMJTable() {
  const t = table.current;
  if (!t) {
    return `<section class="card"><p>${table.error ? '⚠ ' + esc(table.error) : 'Connexion à la table…'}</p>
      <div class="row"><button class="btn" data-act="mj-close">Changer de table</button>${table.error ? '<button class="btn pri" data-act="mj-retry">Réessayer</button>' : ''}</div></section>`;
  }
  const list = table.characters();
  const sel = list.find((x) => x.id === ui.mjChar);
  if (ui.mjTab === 'fiche' && !sel) ui.mjTab = 'vue';
  const tabs = [['vue', 'Vue d\'ensemble'], ['comp', 'Comparatif'], ['vie', 'Vie privée'], ...(sel ? [['fiche', sel.c.nom || 'Fiche']] : [])];
  let body;
  if (!list.length) body = `<section class="card"><div class="empty">Aucune fiche partagée pour l'instant.</div><p class="small muted">Donne le code <b class="type">${esc(t.id)}</b> à tes joueurs : Carnet de leur personnage > Table de jeu > Partager ma fiche.</p></section>`;
  else if (ui.mjTab === 'comp') body = renderMJComp(list);
  else if (ui.mjTab === 'vie') body = renderMJVie(list);
  else if (ui.mjTab === 'fiche') body = renderMJFiche(sel);
  else body = list.map(renderMJCard).join('');
  return `<section class="card dark">
      <div class="row"><div style="flex:1"><div class="small muted d">Code à donner aux joueurs</div><div class="type" style="font-size:28px;letter-spacing:.15em">${esc(t.id)}</div></div>
        <button class="btn sm" data-act="mj-copy">Copier</button><button class="btn sm" data-act="mj-close">Changer de table</button></div>
      <div class="small muted d" style="margin-top:4px">${list.length} fiche(s) partagée(s) · mise à jour ${esc(ago(t.updatedAt))}${table.error ? ' · ⚠ ' + esc(table.error) : ''}</div>
      <div class="field" style="margin:10px 0 0"><label class="d">Camp de la table ${campIco(tableCamp())}</label><select id="mj-camp">
        <option value="" ${table.camp() ? '' : 'selected'}>Automatique${autoCamp() ? ` : ${esc(campLabel(autoCamp()))}` : ' (d’après les fiches)'}</option>
        ${CAMPS.map(([k, l]) => `<option value="${k}" ${table.camp() === k ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select>
        <div class="small muted d" style="margin-top:4px">Les scénarios des livres et les tables aléatoires proposés se limitent à ce camp.</div></div>
    </section>
    <div class="seg" style="margin-bottom:10px">${tabs.map(([k, l]) => `<button class="${ui.mjTab === k ? 'on' : ''}" data-act="mj-tab" data-v="${k}">${esc(l)}</button>`).join('')}</div>
    ${body}`;
}
function supLine(c) {
  const ty = R.typeOf(c); const sup = R.supByName(c.superieur);
  return [ty.n + (ty.tierName ? ' (' + ty.tierName + ')' : ''), sup ? 'de ' + sup.n : '', ty.sup ? 'grade ' + (c.grade || 0) : ''].filter(Boolean).join(' · ');
}
function renderMJCard(x) {
  const c = x.c; const a = R.annexes(c); const ty = R.typeOf(c); const ppm = R.ppMax(c);
  const pf = c.pfCur ?? a.pf; const pp = c.ppCur ?? ppm; const malus = R.woundMalus(c);
  const open = c.blessures.filter((b) => b.ouverte);
  const pill = (lab, val, kind, key) => `<button class="pill light" data-act="mj-roll" data-id="${esc(x.id)}" data-k="${kind}" data-key="${esc(key)}">${lab} <b>${val}</b></button>`;
  return `<section class="card">
    <h2>${miniOf(c) ? crest(c, 'mj') : ''}<span data-act="mj-char" data-key="${esc(x.id)}" style="cursor:pointer;text-decoration:underline dotted">${esc(c.nom || 'Sans nom')}</span><span class="tag">${esc(x.player || '')} · ${esc(ago(x.updatedAt))}</span></h2>
    <div class="small muted" style="margin:-4px 0 8px">${esc(supLine(c))}</div>
    ${mjBar(pf, a.pf, 'pf')}${ty.nopp ? '' : `<div style="margin-top:6px">${mjBar(pp, ppm)}</div>`}
    <div class="annexes">
      ${open.length ? open.map((b) => `<span class="pill" style="background:${b.g === 'BL' ? '#8a7a3a' : b.g === 'BG' ? '#b0601c' : b.g === 'BF' ? 'var(--red)' : '#000'}">${b.g}${b.note ? ' · ' + esc(b.note) : ''}</span>`).join('') + `<span class="pill light">malus <b>${malus}</b></span>` : '<span class="pill light">aucune blessure ouverte</span>'}
    </div>
    <div class="annexes">
      ${pill('Défense', L(R.talentLevel(c, 'Défense')), 'tal', 'Défense')}${pill('Pe', L(c.car.pe), 'car', 'pe')}${pill('Vo', L(c.car.vo), 'car', 'vo')}${pill(c.chance ? 'Ch' : 'Foi', L(c.car.foi), 'car', 'foi')}
      <span class="pill light">BL <b>${a.bl}</b> BG <b>${a.bg}</b> BF <b>${a.bf}</b> MS <b>${a.ms}</b></span>
    </div>
    ${c.limitations.length ? `<div class="small" style="margin-top:6px">${c.limitations.map((l) => `<span class="badge ${l.k === 'Blâme' ? 'no' : ''}">${esc(l.k)}</span> ${esc(l.txt)}`).join('<br>')}</div>` : ''}
    <div class="row" style="margin-top:8px"><button class="btn sm pri" data-act="mj-char" data-key="${esc(x.id)}">Voir la fiche</button></div>
  </section>`;
}
const MJ_COLS = [['car', 'fo', 'Fo'], ['car', 'ag', 'Ag'], ['car', 'pe', 'Pe'], ['car', 'vo', 'Vo'], ['car', 'pr', 'Pr'], ['car', 'foi', 'Foi'],
  ['tal', 'Défense', 'Déf.'], ['tal', 'Fouille', 'Fouille'], ['tal', 'Discrétion', 'Discr.'], ['tal', 'Enquête', 'Enquête'], ['tal', 'Discussion', 'Discus.'],
  ['tal', 'Baratin', 'Baratin'], ['tal', 'Séduction', 'Séduc.'], ['tal', 'Médecine', 'Méd.'], ['tal', 'Sixième sens', '6e sens']];
function renderMJComp(list) {
  return `<section class="card"><h2>Comparatif <span class="tag">toucher une valeur pour lancer en secret</span></h2>
    <div style="overflow-x:auto"><table class="ref comp"><tr><th>Personnage</th>${MJ_COLS.map(([, , l]) => `<th>${l}</th>`).join('')}<th>PF</th><th>PP</th><th>Malus</th></tr>
    ${list.map((x) => {
      const c = x.c; const a = R.annexes(c);
      return `<tr><td><b data-act="mj-char" data-key="${esc(x.id)}" style="cursor:pointer">${esc(c.nom || '?')}</b></td>${MJ_COLS.map(([k, key]) => {
        const v = k === 'car' ? c.car[key] : R.talentLevel(c, key);
        return `<td><button class="cell" data-act="mj-roll" data-id="${esc(x.id)}" data-k="${k}" data-key="${esc(key)}">${L(v)}</button></td>`;
      }).join('')}<td>${c.pfCur ?? a.pf}/${a.pf}</td><td>${R.typeOf(c).nopp ? '—' : `${c.ppCur ?? R.ppMax(c)}/${R.ppMax(c)}`}</td><td>${R.woundMalus(c) || ''}</td></tr>`;
    }).join('')}</table></div>
    <p class="small muted" style="margin-bottom:0">Règle du grand secret : le MJ peut lancer lui-même les tests de Perception, Fouille ou Sixième sens sans que les joueurs connaissent le résultat.</p></section>`;
}
function renderMJFiche(x) {
  const c = x.c; const a = R.annexes(c); const ty = R.typeOf(c); const sup = R.supByName(c.superieur); const ppm = R.ppMax(c);
  const id = c.identite || {};
  const roll = (kind, key, label, val) => `<button class="pill light" data-act="mj-roll" data-id="${esc(x.id)}" data-k="${kind}" data-key="${esc(key)}">${esc(label)} <b>${val}</b></button>`;
  const talents = R.TALENTS.filter((t) => t.kind !== 'm' && t.kind !== 'lang' && (t.cat === 'p' || c.tal[t.n]));
  const av = (+c.pa?.total || 0) - (+c.pa?.spent || 0);
  return `
  <section class="card">
    <h2>${esc(c.nom || 'Sans nom')} <span class="tag">${esc(x.player || '')} · ${esc(ago(x.updatedAt))}</span></h2>
    <div class="small">${esc(supLine(c))}${sup ? ` — <i>${esc(sup.titre)}</i>` : ''}</div>
    ${id.corps || id.metier || id.age ? `<div class="small muted" style="margin-top:4px">${esc([id.corps, id.age && id.age + ' ans', id.metier].filter(Boolean).join(' · '))}</div>` : ''}
    ${id.apparence ? `<p class="small" style="white-space:pre-line">${esc(id.apparence)}</p>` : ''}
    ${vieAnswers(c).some(([, v]) => v) ? `<div class="small" style="margin-top:6px"><b>Vie privée</b> : ${esc(vieAnswers(c).filter(([, v]) => v).map(([x, v]) => `${x.q} : ${x.opts.find((o) => o.k === v)?.t || v}`).join(' · '))}</div>` : ''}
    ${c.vie?.bg ? `<details class="small" style="margin-top:6px"><summary><b>Background</b></summary><p style="white-space:pre-line;margin:4px 0 0">${esc(c.vie.bg)}</p></details>` : ''}
    ${ty.sup ? `<div class="small" style="margin-top:6px">PA : <b>${c.pa?.total || 0}</b> gagnés, <b>${av}</b> disponibles${sup?.rec ? ` · Récupération : ${esc(sup.rec)}` : ''}</div>` : ''}
  </section>
  <section class="card">
    <h2>Caractéristiques</h2>
    <div class="annexes">${R.CARACS.map((k) => roll('car', k.k, R.caracName(c, k.k), L(c.car[k.k]))).join('')}</div>
    ${mjBar(c.pfCur ?? a.pf, a.pf, 'pf')}${ty.nopp ? '' : `<div style="margin-top:6px">${mjBar(c.ppCur ?? ppm, ppm)}</div>`}
    <div class="seuils" style="margin-top:8px"><div>BL<b>${a.bl}</b></div><div>BG<b>${a.bg}</b></div><div>BF<b>${a.bf}</b></div><div>MS<b>${a.ms}</b></div></div>
    <h3>Blessures</h3>
    ${c.blessures.map((b) => `<div class="wound"><span class="g ${b.g}">${b.g}</span><div class="tn" style="flex:1">${R.BLESSURES[b.g].n} ${b.note ? '<small class="muted">' + esc(b.note) + '</small>' : ''}<br><small class="muted">${b.ouverte ? 'Ouverte' : 'Refermée'}</small></div></div>`).join('') || '<div class="empty">Aucune</div>'}
  </section>
  <section class="card">
    <h2>Talents <span class="tag">toucher pour lancer</span></h2>
    <div class="cols2">${talents.map((t) => {
      const T = c.tal[t.n] || {};
      return `<div class="trow click" data-act="mj-roll" data-id="${esc(x.id)}" data-k="tal" data-key="${esc(t.n)}"><div class="tn">${esc(t.n)}${T.spe ? ` <span class="spe">${esc(T.spe)} ${L(R.talentSpe(c, t.n))}</span>` : ''}</div><div class="tl ${+T.r ? '' : 'base'}">${L(R.talentLevel(c, t.n))}</div></div>`;
    }).join('')}
    ${c.multi.map((m) => `<div class="trow"><div class="tn">${esc(m.t)} <span class="spe">${esc(m.label)}</span></div><div class="tl">${L(2 + (+m.r || 0))}</div></div>`).join('')}</div>
    ${c.langues.length ? `<div class="small" style="margin-top:6px">Langues : ${esc(c.langues.join(', '))}</div>` : ''}
  </section>
  <section class="card">
    <h2>Pouvoirs</h2>
    ${c.pouvoirs.map((p, i) => {
      const d = R.powerDef(p.n) || {}; const par = d.parent ? R.powerDef(d.parent) : null; const k = 'mj' + x.id + i;
      return `<div class="pow"><div class="ph"><div class="pn">${esc(p.n)}</div><div class="pl">${p.r ? L(p.r) : '—'}</div></div>
        <div class="meta">${d.nat ? `<span class="badge ${d.nat}">${d.nat}</span>` : ''}${esc(d.act || par?.act || '')}${d.q && d.q !== '—' ? ' · ' + esc(d.q) : ''}</div>
        ${powSum(d, par)}
        <div class="row" style="margin-top:6px">${p.r ? `<button class="btn sm" data-act="mj-roll" data-id="${esc(x.id)}" data-k="pow" data-key="${i}">Test de pouvoir</button>` : ''}<button class="btn sm ghost" data-act="toggle" data-key="${k}">${ui.open[k] ? 'Masquer' : 'Description'}</button></div>
        ${ui.open[k] ? `<div class="desc">${esc(d.d || par?.d || '')}</div>` : ''}</div>`;
    }).join('') || '<div class="empty">Aucun</div>'}
    ${sup?.dom ? `<div class="small" style="margin-top:6px">Pouvoirs de grade : ${esc(sup.dom.split(',').map((dm) => { const n = dm.trim().replace('*', ''); return n + ' ' + (+c.gradeDom?.[n] || 0); }).join(', '))}</div>` : ''}
  </section>
  <section class="card">
    <h2>Combat</h2>
    ${roll('tal', 'Défense', 'Défense', L(R.talentLevel(c, 'Défense')))}
    ${c.armes.map((w, i) => `<div class="trow"><div class="tn"><b>${esc(w.n)}</b><br><small>${esc(w.talent)}${w.spe ? ' (' + esc(w.spe) + ')' : ''} ${L(weaponLevel(c, w))} · préc. ${sgn(+w.prec || 0)} · puiss. ${sgn(+w.puis || 0)}</small></div>
      <button class="btn sm pri" data-act="mj-attack" data-id="${esc(x.id)}" data-key="${i}">Attaquer</button></div>`).join('') || '<div class="empty">Aucune arme</div>'}
    ${c.armures.length ? `<div class="small" style="margin-top:6px">Protections : ${esc(c.armures.map((p) => `${p.n} ${p.p}${p.portee === false ? ' (rangée)' : ''}`).join(', '))}</div>` : ''}
  </section>
  ${c.limitations.length || c.possessions || c.notes ? `<section class="card"><h2>Carnet</h2>
    ${c.limitations.map((l) => `<div><span class="badge ${l.k === 'Blâme' ? 'no' : ''}">${esc(l.k)}</span> ${esc(l.txt)}</div>`).join('')}
    ${c.possessions ? `<h3>Possessions</h3><p class="small" style="white-space:pre-line">${esc(c.possessions)}</p>` : ''}
    ${c.notes ? `<h3>Notes du joueur</h3><p class="small" style="white-space:pre-line">${esc(c.notes)}</p>` : ''}</section>` : ''}
  <section class="card">
    <h2>Mes notes de MJ <span class="tag">gardées sur cet appareil</span></h2>
    <div class="field"><textarea id="mj-note" data-key="${esc(x.id)}" placeholder="Secrets, plans, rancunes du supérieur…">${esc(table.note(x.id))}</textarea></div>
    <div class="row end" style="margin-top:8px"><button class="btn sm danger" data-act="mj-kick" data-key="${esc(x.id)}">Retirer de la table</button></div>
  </section>`;
}
// ================= Scénarios : préparation des scènes et des combats =================
const lvlOpts = (max = 16) => Array.from({ length: max + 1 }, (_, r) => [r, L(r)]);
const GCOL = { BL: '#8a7a3a', BG: '#b0601c', BF: 'var(--red)', MS: '#000' };
function scrollToScene(id) { requestAnimationFrame(() => document.getElementById('scene-' + id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })); }
function curScene(s, id) { return s?.scenes.find((x) => x.id === id) || null; }
function scenAlerts(npcs) {
  const st = npcs.map((n) => [n, npcStats(n)]);
  const esq = st.filter(([, x]) => x.esquive).map(([n]) => n.nom); const vol = st.filter(([, x]) => x.volonte).map(([n]) => n.nom);
  return (esq.length ? `<div class="alert">⚠ Prévenir les joueurs avant leurs <b>attaques physiques</b> (Esquive acrobatique) : ${esc(esq.join(', '))}</div>` : '')
    + (vol.length ? `<div class="alert">⚠ Prévenir les joueurs avant leurs <b>attaques mentales</b> (Volonté supra-normale) : ${esc(vol.join(', '))}</div>` : '');
}
// PNJ en cours d'édition : type du bestiaire ou PNJ d'une scène
function npcTarget(s) {
  const e = ui.npcEdit; if (!e) return null;
  if (e.type) return scen.getType(e.type);
  return curScene(s, e.scene)?.npcs.find((x) => x.id === e.npc) || null;
}
const npcSummary = (n) => { const st = npcStats(n); const w = n.armes[0]; return `${w ? `Att. ${L(w.att)} (${w.n}) · ` : ''}Déf. ${L(n.def)} · Vo ${L(n.car.vo)} · PF ${st.pf} · ${st.bl}/${st.bg}/${st.bf}/${st.ms}${st.pp ? ` · ${st.pp} PP` : ''}`; };
// ---- Progression : s.cur = scène en cours, sc.done = scène jouée ----
const curIdx = (s) => s.scenes.findIndex((x) => x.id === s.cur);
const isFini = (s) => !s.impro && s.scenes.length > 0 && curIdx(s) < 0 && (s.fini || s.scenes.every((x) => x.done));
function scenProgress(s) {
  const i = curIdx(s); const played = s.scenes.filter((x) => x.done).length;
  if (i >= 0) return `scène ${i + 1}/${s.scenes.length} en cours`;
  if (isFini(s)) return 'terminé';
  return played ? `${played}/${s.scenes.length} scène(s) jouée(s)` : 'pas commencé';
}
function renderProgress(s) {
  const i = curIdx(s); const sc = s.scenes[i];
  if (!s.scenes.length || s.impro) return '';
  if (!sc) {
    const fini = isFini(s); const played = s.scenes.filter((x) => x.done).length;
    return `<section class="card prog${fini ? ' fini' : ''}"><div class="row"><div style="flex:1;min-width:0"><b>${fini ? 'Scénario terminé' : 'Pas encore commencé'}</b><div class="small muted">${fini ? (played === s.scenes.length ? 'Toutes les scènes ont été jouées.' : `Terminé avant la fin : ${played}/${s.scenes.length} scène(s) jouée(s).`) : 'Marque la scène que vous jouez pour la retrouver à chaque ouverture.'}</div></div>
      ${fini ? `<button class="btn sm" data-act="sc-reset">Rejouer</button>` : `<button class="btn sm pri" data-act="sc-cur" data-key="${esc((s.scenes.find((x) => !x.done) || s.scenes[0]).id)}">Commencer</button>`}</div></section>`;
  }
  const next = s.scenes[i + 1];
  return `<section class="card prog on"><div class="row"><div style="flex:1;min-width:0"><div class="small muted">Scène en cours · ${i + 1}/${s.scenes.length}</div><b class="click" data-act="sc-goto" data-key="${esc(sc.id)}">${esc(sc.nom)}</b>${sc.lieu ? `<div class="small muted">${esc(sc.lieu)}</div>` : ''}</div>
    <button class="btn sm ghost" data-act="sc-goto" data-key="${esc(sc.id)}">Voir</button>
    <button class="btn sm pri" data-act="sc-next">${next ? 'Scène suivante' : 'Fin du scénario'}</button></div>
    <div class="row" style="margin-top:4px"><div class="small muted" style="flex:1">${next ? `Ensuite : ${esc(next.nom)}` : 'Dernière scène'}</div>
      ${next ? '<button class="btn sm ghost" data-act="sc-finish">Terminer le scénario</button>' : ''}</div></section>`;
}
function renderScen(s) {
  if (ui.npcEdit?.type) { const t = scen.getType(ui.npcEdit.type); if (t) return renderNpcEdit(s, null, t); ui.npcEdit = null; }
  if (!s) return renderScenList();
  const sc = ui.npcEdit && curScene(s, ui.npcEdit.scene);
  const n = sc && sc.npcs.find((x) => x.id === ui.npcEdit.npc);
  if (n) return renderNpcEdit(s, sc, n);
  const nbPnj = s.scenes.reduce((t, x) => t + x.npcs.reduce((u, y) => u + (+y.qty || 1), 0), 0);
  return `<section class="card dark">
      <div class="row"><button class="btn sm ghost" data-act="sc-back">Scénarios</button><span class="spacer"></span>
        <button class="btn sm" data-act="sc-export">Exporter</button><button class="btn sm" data-act="sc-tab-add">Table aléatoire</button><button class="btn sm" data-act="sc-dup">Dupliquer</button><button class="btn sm danger" data-act="sc-del">Supprimer</button></div>
      <div class="small muted d" style="margin-top:6px">${s.scenes.length} scène(s) · ${nbPnj} PNJ · modifié ${esc(ago(s.updatedAt))}</div>
    </section>
    <section class="card" data-scform>
      <h2>Synopsis</h2>
      <div class="grid">${F.text('', 'Titre du scénario', s.nom, '', 'data-sf="nom"')}
        <div class="field"><label>Résumé (ce que les joueurs vont vivre)</label><textarea data-sf="resume" placeholder="Accroche, enjeux, mission confiée par le supérieur…">${esc(s.resume)}</textarea></div>
        <div class="field"><label>Secrets du MJ</label><textarea data-sf="notes" placeholder="Ce qui se passe vraiment, PNJ importants, fils à tirer…">${esc(s.notes)}</textarea></div></div>
    </section>
    ${renderProgress(s)}
    ${renderScenTables(s)}
    ${renderScenMemo(s)}
    ${s.scenes.map((sc, i) => renderSceneCard(s, sc, i)).join('')}
    <div class="row" style="justify-content:center;margin-bottom:12px"><button class="btn pri" data-act="sc-scene-add">${icon('plus')} Ajouter une scène</button></div>`;
}
function renderScenList() {
  const camp = tableCamp(); const all = scen.all();
  const other = camp ? all.filter((s) => scenCamp(s) && scenCamp(s) !== camp) : [];
  const list = all.filter((s) => !other.includes(s));
  const row = (s) => {
      const fights = s.scenes.filter((x) => x.npcs.length).length; const running = s.scenes.filter((x) => x.live).length;
      return `<div class="trow click" data-act="sc-open" data-key="${esc(s.id)}"><div class="tn"><b>${scenCamp(s) ? campIco(scenCamp(s)) + ' ' : ''}${esc(s.nom)}</b>${isFini(s) ? ' <span class="badge ok">Terminé</span>' : curIdx(s) >= 0 ? ' <span class="badge cur">En cours</span>' : ''}<br><small>${s.scenes.length} scène(s) · ${s.impro ? '' : esc(scenProgress(s)) + ' · '}${fights} combat(s) préparé(s)${running ? ` · <b style="color:var(--red)">${running} en cours</b>` : ''} · ${esc(ago(s.updatedAt))}</small></div><div class="tl">›</div></div>`;
  };
  return `<section class="card">
    <h2>Mes scénarios <span class="tag">gardés sur cet appareil</span></h2>
    ${campBar()}
    ${list.map(row).join('') || '<div class="empty">Aucun scénario pour l\'instant</div>'}
    ${other.length ? `<button class="btn sm ghost" data-act="toggle" data-key="scOther" style="margin-top:6px">${ui.open.scOther ? 'Masquer' : 'Voir'} les scénarios d’un autre camp (${other.length})</button>${ui.open.scOther ? other.map(row).join('') : ''}` : ''}
    <h3>Nouveau scénario</h3>
    <div class="row"><input class="inp" id="sc-name" placeholder="Titre du scénario" style="flex:1;min-width:160px"><button class="btn pri" data-act="sc-create">${icon('plus')} Créer</button></div>
    <div class="row" style="margin-top:8px"><button class="btn sm pri" data-act="sc-library">${icon('book')} Scénarios des livres (${SCENARIOS_LIVRES.length})</button><button class="btn sm" data-act="sc-import">Importer un scénario (fichier)</button></div>
    <p class="small muted" style="margin-bottom:0">Découpe ton scénario en scènes et prépare à l'avance les adversaires de chaque combat : attaque, défense, Volonté, Foi, seuils de blessure, PF, PP, pouvoirs. Le jour de la partie, « Lancer le combat » crée une fiche de suivi par adversaire (PF, PP, blessures et malus) avec les jets d'attaque et de défense à portée de main.</p>
    <p class="small muted" style="margin-bottom:0">Les types d'ennemis réutilisables sont rangés dans <b data-act="mj-sec" data-v="outils" style="cursor:pointer;text-decoration:underline">Outils › Bestiaire</b>.</p>
  </section>`;
}
function renderBestiaire() {
  const types = scen.types();
  return `<section class="card">
    <h2>Bestiaire <span class="tag">types d'ennemis réutilisables</span></h2>
    ${types.map((t) => `<div class="trow click" data-act="sc-type-edit" data-key="${esc(t.id)}"><div class="tn"><b>${esc(t.nom)}</b>${t.source ? ` <small>· ${esc(t.source)}</small>` : ''}<br><small>${esc(npcSummary(t))}</small></div><div class="tl">›</div></div>`).join('') || '<div class="empty">Aucun type d\'ennemi pour l\'instant</div>'}
    <div class="row" style="margin-top:8px"><button class="btn sm pri" data-act="sc-type-new">${icon('plus')} Nouveau type</button><button class="btn sm" data-act="sc-type-book">${icon('book')} Bestiaire des livres (${BOOK.length})</button><button class="btn sm" data-act="sc-type-quick">PNJ rapide</button><button class="btn sm" data-act="sc-type-char">Depuis un personnage</button>
      <span class="spacer"></span><button class="btn sm" data-act="sc-type-import">Importer un bestiaire</button>${types.length ? '<button class="btn sm" data-act="sc-type-export">Exporter le bestiaire</button>' : ''}</div>
    <p class="small muted" style="margin-bottom:0">Prépare une fois un type d'ennemi (sbire de la Mafia, démon de Baal, soldat de Dieu…), puis ajoute-le à n'importe quelle scène en choisissant combien il en faut : bouton « Depuis le bestiaire » d'une scène, ou « Renfort » pendant un combat.</p>
  </section>`;
}
// Choix d'un type : bestiaire personnel puis fiches des livres pas encore copiées
function typeItems(exclude = () => false) {
  const mine = scen.types().filter((t) => !exclude(t)).map((t) => ({ t, label: t.nom, sub: [t.source, npcSummary(t)].filter(Boolean).join(' · ') }));
  const book = BOOK.filter((t) => !scen.getType(t.id) && !exclude(t)).map((t) => ({ t, book: true, label: t.nom, sub: `📖 ${t.book}${t.source ? ' · ' + t.source : ''} · ${npcSummary(t)}` }));
  return [...mine, ...book];
}
// Bibliothèque des scénarios des livres : classée par livre, chargée à la demande depuis scenarios/
function libraryDialog(go) {
  let q = ''; let all = false;
  const draw = () => {
    const camp = all ? '' : tableCamp();
    const list = SCENARIOS_LIVRES.filter((x) => (!camp || libCamp(x) === camp) && (!q || norm(`${x.nom} ${x.livre} ${x.camp} ${x.resume}`).includes(norm(q))));
    const livres = [...new Set(list.map((x) => x.livre))];
    dialog('Scénarios des livres', `<input class="inp" id="lib-q" placeholder="Rechercher (titre, livre, INS, MV…)" value="${esc(q)}" style="margin-bottom:8px">
      <p class="small muted" style="margin-top:0">Scènes, PNJ chiffrés, choix possibles et récompenses, résumés pour le MJ. Les PNJ restent dans le scénario ; « Enregistrer dans le bestiaire » sur une fiche pour la réutiliser ailleurs.</p>
      ${tableCamp() ? `<div class="row small" style="margin:0 0 6px"><span class="muted" style="flex:1">${all ? 'Tous les camps' : `Camp de la table : ${campIco(tableCamp())} <b>${esc(campLabel(tableCamp()))}</b>`}</span><button class="btn sm ghost" id="lib-all">${all ? 'Seulement ce camp' : 'Voir tout'}</button></div>` : ''}
      ${livres.map((l) => `<h3>${esc(l)}</h3>${list.filter((x) => x.livre === l).map((x) => {
        const had = scen.all().some((s) => s.livre === x.file);
        return `<button class="choice" data-lib="${esc(x.file)}"><span><b>${had ? '✓ ' : ''}${campIco(libCamp(x))} ${esc(x.nom.replace(/^[^–]*– /, ''))}</b><small>${esc([x.camp, `${x.scenes} scènes`, `${x.pnj} PNJ`, `${x.combats} combat(s)`, `${x.choix} choix`].filter(Boolean).join(' · '))}</small><small>${esc(x.resume.length > 220 ? x.resume.slice(0, 220) + '…' : x.resume)}</small></span></button>`;
      }).join('')}`).join('') || '<div class="empty">Rien</div>'}`);
    const la = dlg.querySelector('#lib-all'); if (la) la.onclick = () => { all = !all; draw(); };
    const inp = dlg.querySelector('#lib-q');
    inp.oninput = () => { q = inp.value; const pos = inp.selectionStart; draw(); const n = dlg.querySelector('#lib-q'); n.focus(); n.setSelectionRange(pos, pos); };
    dlg.onclick = async (e) => {
      if (e.target.closest('[data-dact="close"]')) return closeDlg();
      const b = e.target.closest('[data-lib]'); if (!b) return;
      const x = SCENARIOS_LIVRES.find((y) => y.file === b.dataset.lib);
      closeDlg();
      const had = scen.all().find((s) => s.livre === x.file);
      if (had && !(await confirmDlg('Déjà ajouté', `« ${esc(x.nom)} » est déjà dans tes scénarios. En ajouter une seconde copie ?`))) return go(had.id);
      try {
        const res = await fetch(`scenarios/${x.file}.json`);
        if (!res.ok) throw new Error(`fichier introuvable (${res.status})`);
        const r = scen.importScenarios(await res.text(), { types: false, livre: x.file });
        toast(`${x.nom} ajouté${r.memo ? ` (${r.memo} fil(s) de campagne)` : ''}`);
        go(r.ids[0]);
      } catch (err) { toast(`Impossible de charger le scénario : ${err.message}${navigator.onLine ? '' : ' (hors connexion : ouvre-le une fois en ligne)'}`); }
    };
  };
  draw();
}
// Choisit un fichier JSON et le passe à fn (qui renvoie le message de confirmation)
function pickJSON(fn) {
  const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.json,application/json';
  inp.onchange = async () => { try { toast(fn(await inp.files[0].text())); render(); } catch (e) { toast(e instanceof SyntaxError ? 'Fichier illisible' : 'Import impossible : ' + e.message); } };
  inp.click();
}
// PNJ rapide : ange ou démon de l'écran du maître (supérieur + PP, tables d'évolution),
// ou profil type des livres pour la troisième Force, les humains et les créatures
const QK_KINDS = [
  ['ange', 'Ange'], ['demon', 'Démon'], ['psi', 'Psionique'], ['paien', 'Héros païen'],
  ['humain', 'Humain', ['humain', 'serviteur', 'soldat']], ['creature', 'Créature', ['monstre', 'fee', 'mortvivant', 'familier', 'combat']],
];
// psionique / païen : profils « livre-psi-<groupe>-<PP> » regroupés par conpsi ou panthéon
function qkGroups(kind) {
  const g = new Map();
  for (const t of BOOK) {
    const m = t.id.startsWith(`livre-${kind}-`) && t.id.slice(kind.length + 7).match(/^(.+)-(\d+)$/); if (!m) continue;
    if (!g.has(m[1])) g.set(m[1], { lab: t.nom.replace(/^(Psionique|Héros païen)\s+/, '').replace(/\s*\(\d+ PP\)$/, ''), pp: [] });
    g.get(m[1]).pp.push([+m[2], t]);
  }
  return [...g.values()];
}
const qkCopy = (t) => ({ ...JSON.parse(JSON.stringify(t)), id: newNpc().id });
function askQuickNpc() {
  return new Promise((resolve) => {
    const help = {
      ange: 'Profils du livret de l’écran du maître : un ange type par supérieur, de 10 PP (grade 0) à 40 PP (grade 3).',
      demon: 'Profils du livret de l’écran du maître : un démon type par prince, de 10 PP (grade 0) à 40 PP (grade 3).',
      psi: 'Psionique type de chaque conpsi (Les Petites Apocalypses, p. 128), débutant ou confirmé.',
      paien: 'Héros païen type de chaque panthéon (Les Petites Apocalypses, p. 128), débutant ou confirmé.',
      humain: 'Humains types des livres : serviteurs, soldats, bandes, mortels ordinaires.',
      creature: 'Créatures des livres : monstres, fées, morts-vivants, familiers.',
    };
    dialog('PNJ rapide', `<p class="small muted" id="qk-help" style="margin-top:0"></p>
      <div class="field"><label>Type</label><select id="qk-kind">${QK_KINDS.map(([k, l]) => `<option value="${k}">${l}</option>`).join('')}</select></div>
      <div class="field"><label id="qk-l1">Supérieur</label><select id="qk-a"></select></div>
      <div class="field" id="qk-f2"><label>Puissance</label><select id="qk-b"></select></div>`,
    `<button class="btn" data-dact="close">Annuler</button><button class="btn pri" id="qk-ok">Créer</button>`);
    const $ = (id) => dlg.querySelector(id);
    const kind = $('#qk-kind'); const a = $('#qk-a'); const b = $('#qk-b');
    const fill = () => {
      const k = kind.value; const def = QK_KINDS.find((x) => x[0] === k);
      $('#qk-help').textContent = help[k];
      if (k === 'ange' || k === 'demon') {
        $('#qk-l1').textContent = k === 'ange' ? 'Supérieur' : 'Prince';
        a.innerHTML = QUICK[k].map((p) => `<option>${esc(p[0])}</option>`).join('');
        b.innerHTML = QUICK_PP.map((p) => `<option value="${p}">${p} PP</option>`).join('');
        $('#qk-f2').hidden = false;
      } else if (k === 'psi' || k === 'paien') {
        const gs = qkGroups(k);
        $('#qk-l1').textContent = k === 'psi' ? 'Conpsi' : 'Panthéon';
        a.innerHTML = gs.map((g, i) => `<option value="${i}">${esc(g.lab)}</option>`).join('');
        const pp = () => { b.innerHTML = gs[+a.value].pp.map(([n], i) => `<option value="${i}">${n} PP${i ? ' (confirmé)' : ''}</option>`).join(''); };
        a.onchange = pp; pp();
        $('#qk-f2').hidden = false;
        return;
      } else {
        $('#qk-l1').textContent = 'Profil';
        const list = BOOK.filter((t) => def[2].includes(t.type)); // ordre de parution des livres
        const dup = (t) => list.filter((x) => x.nom === t.nom).length > 1; // même nom : on précise le livre
        a.innerHTML = list.map((t) => `<option value="${esc(t.id)}">${esc(t.nom)}${dup(t) ? ` (${esc(String(t.book).split(',')[0])})` : ''}</option>`).join('');
        $('#qk-f2').hidden = true;
      }
      a.onchange = null;
    };
    kind.onchange = fill; fill();
    $('#qk-ok').onclick = () => {
      const k = kind.value; let r = null;
      if (k === 'ange' || k === 'demon') r = quickNpc(k, a.value, +b.value);
      else if (k === 'psi' || k === 'paien') r = qkCopy(qkGroups(k)[+a.value].pp[+b.value][1]);
      else { const t = BOOK.find((x) => x.id === a.value); r = t && qkCopy(t); }
      closeDlg(); resolve(r);
    };
    onRealClose(() => resolve(null));
  });
}
// Demande un nombre d'exemplaires
async function askQty(nom, def = 1) {
  const v = await ask(nom, 'Combien ?', String(def));
  if (v === null) return 0;
  const q = Math.floor(+v);
  if (!(q >= 1)) { toast('Nombre invalide'); return 0; }
  return Math.min(q, 50);
}
function renderSceneCard(s, sc, i) {
  const k = 'scn' + sc.id; const edit = ui.open[k];
  const rows = sc.npcs.map((n) => {
    const st = npcStats(n); const w = n.armes[0];
    return `<tr class="click" data-act="sc-npc-edit" data-scene="${esc(sc.id)}" data-key="${esc(n.id)}">
      <td><b>${esc(n.nom)}</b>${n.source ? `<br><small class="muted">${esc(n.source)}</small>` : ''}</td><td>${(+n.qty || 1) > 1 ? '×' + n.qty : ''}</td>
      <td>${w ? `${L(w.att)}<br><small class="muted">${esc(w.n)}${n.armes.length > 1 ? ' +' + (n.armes.length - 1) : ''}</small>` : '—'}</td>
      <td>${L(n.def)}</td><td>${L(n.car.vo)}</td><td>${L(n.car.foi)}</td><td>${L(n.car.pe)}</td>
      <td class="nowrap">${st.bl}/${st.bg}/${st.bf}/${st.ms}</td><td>${st.pf}</td><td>${st.pp || '—'}</td><td>${+n.prot || ''}</td></tr>`;
  }).join('');
  const isCur = s.cur === sc.id;
  return `<section class="card scene${isCur ? ' cur' : ''}${sc.done && !isCur ? ' done' : ''}" id="scene-${esc(sc.id)}">
    <h2>${i + 1}. ${esc(sc.nom.replace(/^\s*\d+\s*[.)–:-]\s*/, '') || sc.nom)}${isCur ? '<span class="badge cur">Scène en cours</span>' : sc.done ? '<span class="badge">Jouée</span>' : ''}${sc.live ? '<span class="stamp" style="margin-left:6px">Combat en cours</span>' : ''}<span class="tag">${esc(sc.lieu || '')}</span></h2>
    ${edit ? `<div class="grid g2" data-scform>${F.text('', 'Nom de la scène', sc.nom, '', `data-scf="nom" data-scene="${esc(sc.id)}"`)}${F.text('', 'Lieu', sc.lieu, '', `data-scf="lieu" data-scene="${esc(sc.id)}"`)}
      <div class="field" style="grid-column:1/-1"><label>Déroulement, indices, réactions des PNJ</label><textarea data-scf="notes" data-scene="${esc(sc.id)}">${esc(sc.notes)}</textarea></div></div>
      <div class="row" style="margin-top:8px"><button class="btn sm" data-act="sc-scene-up" data-key="${esc(sc.id)}" ${i ? '' : 'disabled'}>Monter</button><button class="btn sm danger" data-act="sc-scene-del" data-key="${esc(sc.id)}">Supprimer la scène</button><span class="spacer"></span><button class="btn sm pri" data-act="toggle" data-key="${k}">Terminé</button></div>`
    : sc.notes ? `<p class="small" style="white-space:pre-line;margin-top:0">${esc(sc.notes)}</p>` : ''}
    ${sc.npcs.length ? `<div style="overflow-x:auto;margin-top:6px"><table class="ref comp npcs"><tr><th>PNJ (source)</th><th></th><th>Attaque</th><th>Déf.</th><th>Vol.</th><th>Foi</th><th>Per</th><th>BL/BG/BF/MS</th><th>PF</th><th>PP</th><th>Prot.</th></tr>${rows}</table></div>
      ${scenAlerts(sc.npcs)}` : '<div class="empty">Pas d\'adversaire préparé (scène sans combat ?)</div>'}
    ${renderChoices(s, sc, edit)}
    ${sceneTables(s, sc)}
    <div class="row" style="margin-top:8px">
      <button class="btn sm pri" data-act="sc-npc-best" data-scene="${esc(sc.id)}">${icon('plus')} Depuis le bestiaire</button>
      <button class="btn sm" data-act="sc-npc-add" data-scene="${esc(sc.id)}">${icon('plus')} PNJ unique</button>
      <button class="btn sm" data-act="sc-npc-import" data-scene="${esc(sc.id)}">Depuis un personnage</button>
      <button class="btn sm" data-act="sc-tab-add" data-scene="${esc(sc.id)}">Table aléatoire</button>
      ${edit ? '' : `<button class="btn sm ghost" data-act="toggle" data-key="${k}">${icon('edit')} Modifier</button>`}
      ${isCur ? '' : `<button class="btn sm ghost" data-act="sc-cur" data-key="${esc(sc.id)}">Jouer cette scène</button>`}
      <span class="spacer"></span>
      ${sc.npcs.length ? `<button class="btn sm pri" data-act="sc-live" data-scene="${esc(sc.id)}">${icon('sword')} ${sc.live ? `Reprendre (round ${sc.live.round})` : 'Lancer le combat'}</button>` : ''}
    </div>
  </section>`;
}
function renderNpcEdit(s, sc, n) {
  const st = npcStats(n); const a = R.annexes(npcChar(n));
  const isType = !sc;
  const at = isType ? `data-key="${esc(n.id)}"` : `data-scene="${esc(sc.id)}" data-key="${esc(n.id)}"`;
  const nf = (f) => `data-nf="${f}"`;
  const fromType = !isType && n.typeId && scen.getType(n.typeId);
  return `<section class="card dark"><div class="row"><button class="btn sm ghost" data-act="sc-npc-done">${isType ? 'Bestiaire' : esc(sc.nom)}</button><span class="spacer"></span>
      ${isType ? `<button class="btn sm" data-act="sc-type-dup" ${at}>Dupliquer</button><button class="btn sm danger" data-act="sc-type-del" ${at}>Supprimer du bestiaire</button>`
        : `<button class="btn sm" data-act="sc-npc-tobest" ${at}>${fromType ? 'Mettre à jour le type du bestiaire' : 'Enregistrer dans le bestiaire'}</button><button class="btn sm" data-act="sc-npc-dup" ${at}>Dupliquer</button><button class="btn sm danger" data-act="sc-npc-del" ${at}>Supprimer</button>`}</div>
      ${isType ? '<div class="small muted d" style="margin-top:6px">Type d\'ennemi du bestiaire : les scènes qui l\'utilisent en ont une copie, modifier le type ne change pas les scènes déjà préparées.</div>'
        : fromType ? `<div class="small muted d" style="margin-top:6px">Créé à partir du type « ${esc(fromType.nom)} » du bestiaire.</div>` : ''}</section>
  <div data-scform>
  <section class="card">
    <h2>Identité</h2>
    <div class="grid g2">${F.text('', 'Nom', n.nom, '', nf('nom'))}${F.text('', 'Source (supérieur, organisation…)', n.source, '', nf('source') + ' placeholder="Ex. Démon de Baal, sbire de la Mafia"')}
      ${F.select('', 'Type (seuils, Foi/Chance, 111/666)', n.type, Object.entries(R.TYPES).map(([k2, t]) => [k2, t.n])).replace('<select ', `<select ${nf('type')} `)}
      ${isType ? '' : F.num('', 'Nombre d\'exemplaires', n.qty, '', nf('qty') + ' min="1"')}</div>
  </section>
  <section class="card">
    <h2>Caractéristiques</h2>
    <div class="grid g3 g-md-6">${R.CARACS.map((k2) => F.select('', k2.k === 'foi' && R.TYPES[n.type]?.chance ? 'Chance' : k2.n, n.car[k2.k], lvlOpts(14)).replace('<select ', `<select ${nf('car.' + k2.k)} `)).join('')}</div>
    <h3>Combat</h3>
    <div class="grid g3 g-md-6">
      ${F.select('', 'Défense', n.def, lvlOpts()).replace('<select ', `<select ${nf('def')} `)}
      ${F.num('', 'Protection', n.prot, '', nf('prot'))}
      ${F.num('', 'PP', n.pp, '', nf('pp'))}
      ${F.num('', 'PF', n.pfFix ?? '', '', nf('pfFix') + ` placeholder="${a.pf}"`)}</div>
    <div class="grid g3 g-md-6" style="margin-top:8px">${['BL', 'BG', 'BF', 'MS'].map((g, j) => F.num('', 'Seuil ' + g, n.seuilsFix?.[j] ?? '', '', nf('seuilsFix.' + j) + ` placeholder="${[a.bl, a.bg, a.bf, a.ms][j]}"`)).join('')}</div>
    <p class="small muted" style="margin-bottom:0">Calculé d'après les règles : PF ${a.pf} (Fo/2 + Vo/2), seuils ${a.bl}/${a.bg}/${a.bf}/${a.ms} (Fo/2 + ${R.TYPES[n.type]?.bl ?? 2}, ×2, ×3, ×4). Laisser vide pour garder le calcul ; retenu : PF <b>${st.pf}</b>, seuils <b>${st.bl}/${st.bg}/${st.bf}/${st.ms}</b>.</p>
  </section>
  <section class="card">
    <h2>Attaques</h2>
    ${n.armes.map((w, i) => `<div class="grid g3 g-md-6 weap">${F.text('', 'Arme', w.n, '', `data-wf="n" data-i="${i}"`)}
      ${F.select('', 'Niveau d\'attaque', w.att, lvlOpts()).replace('<select ', `<select data-wf="att" data-i="${i}" `)}
      ${F.num('', 'Précision', w.prec, '', `data-wf="prec" data-i="${i}"`)}${F.num('', 'Puissance', w.puis, '', `data-wf="puis" data-i="${i}"`)}
      <label class="small chk"><input type="checkbox" data-wf="melee" data-i="${i}" ${w.melee ? 'checked' : ''}> Contact (+Force)</label>
      <div class="field"><label>&nbsp;</label><button class="btn sm danger" data-act="sc-w-del" data-i="${i}">Retirer</button></div></div>`).join('') || '<div class="empty">Aucune attaque</div>'}
    <div class="row" style="margin-top:8px"><button class="btn sm" data-act="sc-w-add">${icon('plus')} Arme du livre</button><button class="btn sm" data-act="sc-w-free">${icon('plus')} Attaque libre (griffes, pouvoir…)</button></div>
  </section>
  <section class="card">
    <h2>Pouvoirs</h2>
    ${n.pouvoirs.map((p, i) => {
      const d = R.powerDef(p.n) || {}; const par = d.parent ? R.powerDef(d.parent) : null; const k = 'npw' + n.id + i;
      return `<div class="pow"><div class="ph"><div class="pn">${esc(p.n)}</div>
        <select class="inp" style="width:auto" data-pw="${i}">${lvlOpts(14).map(([r, l]) => `<option value="${r}" ${r === +p.r ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
        <div class="meta">${d.nat ? `<span class="badge ${d.nat}">${d.nat}</span>` : ''}${esc(d.act || par?.act || '')}${d.q && d.q !== '—' ? ' · ' + esc(d.q) : ''}</div>
        ${powSum(d, par)}
        <div class="row" style="margin-top:6px">${d.d || par?.d ? `<button class="btn sm ghost" data-act="toggle" data-key="${k}">${ui.open[k] ? 'Masquer' : 'Description'}</button>` : ''}<button class="btn sm danger" data-act="sc-p-del" data-i="${i}">Retirer</button></div>
        ${ui.open[k] ? `<div class="desc">${esc(d.d || par?.d || '')}</div>` : ''}</div>`;
    }).join('') || '<div class="empty">Aucun</div>'}
    <div class="row" style="margin-top:8px"><button class="btn sm" data-act="sc-p-add">${icon('plus')} Pouvoir</button></div>
    <label class="small chk" style="margin-top:8px"><input type="checkbox" data-nf="esquive" ${n.esquive ? 'checked' : ''}> Esquive acrobatique : les joueurs doivent annoncer leurs attaques physiques</label>
    <label class="small chk"><input type="checkbox" data-nf="volonte" ${n.volonte ? 'checked' : ''}> Volonté supra-normale : les joueurs doivent annoncer leurs attaques mentales</label>
  </section>
  <section class="card">
    <h2>Talents et notes</h2>
    <div class="field"><label>Talents utiles</label><textarea data-nf="talents" style="min-height:60px" placeholder="Discrétion 3, Intimidation 4, Conduite 2…">${esc(n.talents)}</textarea></div>
    <div class="field" style="margin-top:8px"><label>Notes (tactique, motivations, butin…)</label><textarea data-nf="notes">${esc(n.notes)}</textarea></div>
  </section></div>`;
}

// ---- Mémoire des choix des joueurs ----
const KIND = Object.fromEntries(KINDS);
const fmtDay = (t) => new Date(t).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
const isOpen = (e) => !!e.suite && !e.done; // fil en suspens : une suite reste à jouer
function memoWhere(e) { const s = scen.get(e.scen); const sc = s && curScene(s, e.scene); return s ? s.nom + (sc ? ' › ' + sc.nom : '') : ''; }
// PJ proposés : ceux de la table ouverte et ceux déjà cités dans le journal
function memoPjNames() {
  const t = store.configured && table.current ? table.characters().map((x) => x.c.nom).filter(Boolean) : [];
  return [...new Set([...t, ...scen.pjNames()])].sort((a, b) => a.localeCompare(b, 'fr'));
}
function memoItem(e, here = null) {
  const rap = e.rappel && e.rappel !== here && scen.get(e.rappel); const where = memoWhere(e);
  return `<div class="memo ${e.done ? 'done' : ''}">
    <div class="mh"><span class="badge k-${esc(e.kind)}">${esc(KIND[e.kind] || e.kind)}</span>${e.pjs.map((p) => `<span class="pj">${esc(p)}</span>`).join('')}<span class="spacer"></span><small class="muted">${fmtDay(e.at)}</small></div>
    <div class="mt">${esc(e.txt)}</div>
    ${e.suite ? `<div class="ms"><b>${e.done ? 'Suite' : 'À suivre'} :</b> ${esc(e.suite)}${rap ? ` <small class="muted">(à faire ressortir dans « ${esc(rap.nom)} »)</small>` : ''}</div>` : ''}
    ${e.done && e.res ? `<div class="small muted" style="margin-top:4px">Fil refermé : ${esc(e.res)}</div>` : ''}
    <div class="row" style="margin-top:6px"><small class="muted" style="flex:1">${esc(where)}</small>
      ${e.suite ? `<button class="btn sm ${e.done ? 'ghost' : ''}" data-act="sc-memo-done" data-key="${esc(e.id)}">${e.done ? 'Rouvrir' : 'Refermer le fil'}</button>` : ''}
      <button class="btn sm ghost" data-act="sc-memo-edit" data-key="${esc(e.id)}">${icon('edit')} Modifier</button></div>
  </div>`;
}
function renderMemo() {
  const tid = store.configured ? table.openId : null; const f = ui.memoF;
  const tName = tid && (table.current?.name || table.list().find((x) => x.id === tid)?.name || tid);
  // Journal par table : les choix de cette table et ceux notés sans table ; « Toutes les tables » montre tout
  const all = scen.journal().filter((e) => !tid || f.allTables || !e.table || e.table === tid); const names = memoPjNames(); const scens = scen.all();
  if (f.pj && !names.includes(f.pj)) f.pj = '';
  if (f.scen && !scen.get(f.scen)) f.scen = '';
  const open = all.filter(isOpen);
  const list = all.filter((e) => (!f.open || isOpen(e)) && (!f.pj || e.pjs.includes(f.pj)) && (!f.scen || e.scen === f.scen || e.rappel === f.scen));
  const sel = (id, label, val, opts) => `<div class="field"><label>${label}</label><select id="${id}">${opts.map(([v, l]) => `<option value="${esc(v)}" ${v === val ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></div>`;
  return `<section class="card dark">
      <div class="row"><div style="flex:1"><div class="type" style="font-size:22px">${all.length} choix noté(s)</div><div class="small muted d">${open.length} fil(s) en suspens${open.filter((e) => !e.rappel).length ? ` · ${open.filter((e) => !e.rappel).length} sans scénario prévu` : ''}</div></div>
        <button class="btn sm pri" data-act="sc-memo-new">${icon('plus')} Noter un choix</button></div>
    </section>
    <section class="card">
      ${tid ? `<div class="seg" style="margin-bottom:8px">${[['0', `Table « ${tName} »`], ['1', 'Toutes les tables']].map(([v, l]) => `<button class="${(f.allTables ? '1' : '0') === v ? 'on' : ''}" data-act="sc-memo-t" data-v="${v}">${esc(l)}</button>`).join('')}</div>` : ''}
      <div class="seg">${[['0', 'Tout le journal'], ['1', `Fils en suspens (${open.length})`]].map(([v, l]) => `<button class="${(f.open ? '1' : '0') === v ? 'on' : ''}" data-act="sc-memo-f" data-v="${v}">${l}</button>`).join('')}</div>
      <div class="grid g2" style="margin-top:8px">${sel('memo-pj', 'Personnage', f.pj, [['', 'Tous'], ...names.map((p) => [p, p])])}${sel('memo-scen', 'Scénario', f.scen, [['', 'Tous'], ...scens.map((x) => [x.id, x.nom])])}</div>
      <div style="margin-top:6px">${list.map((e) => memoItem(e)).join('') || `<div class="empty">${all.length ? 'Rien avec ces filtres' : 'Aucun choix noté pour l\'instant'}</div>`}</div>
    </section>
    <section class="card">
      <h2>Comment ça marche</h2>
      <p class="small" style="margin-top:0">Note ici ce que les joueurs ont décidé (épargner un PNJ, promettre un service à un démon, trahir leur supérieur…) et la <b>suite</b> qu'il faudra leur faire vivre. Une suite non refermée est un <b>fil en suspens</b> ; choisis le scénario où la faire ressortir : elle s'affichera en tête de ce scénario. Dans une scène, prépare les <b>choix possibles</b> (bouton « Modifier » de la scène) : le jour de la partie, touche l'option choisie et c'est noté.</p>
      <div class="row"><button class="btn sm" data-act="sc-memo-import">Importer une mémoire</button>${all.length ? '<button class="btn sm" data-act="sc-memo-export">Exporter la mémoire</button>' : ''}</div>
      <p class="small muted" style="margin-bottom:0">Le journal est gardé sur cet appareil ; l'export d'un scénario emporte aussi les choix qui le concernent.</p>
    </section>`;
}
function renderScenMemo(s) {
  const all = scen.journal();
  const rap = all.filter((e) => e.rappel === s.id && !e.done);
  const here = all.filter((e) => e.scen === s.id && !rap.includes(e));
  const open = all.filter(isOpen).length;
  return `<section class="card">
    <h2>Choix des joueurs <span class="tag">${here.length + rap.filter((e) => e.scen === s.id).length} noté(s) ici</span></h2>
    ${rap.length ? `<div class="alert">↩ <b>À faire ressortir dans ce scénario</b> : conséquences de choix passés.</div>${rap.map((e) => memoItem(e, s.id)).join('')}` : ''}
    ${here.length ? `<details ${rap.length ? '' : 'open'}><summary class="small muted" style="margin-top:6px">Notés pendant ce scénario (${here.length})</summary>${here.map((e) => memoItem(e, s.id)).join('')}</details>` : ''}
    ${rap.length || here.length ? '' : '<div class="empty">Rien de noté pour l\'instant</div>'}
    <div class="row" style="margin-top:8px"><button class="btn sm pri" data-act="sc-memo-new" data-sid="${esc(s.id)}">${icon('plus')} Noter un choix</button><span class="spacer"></span>
      <button class="btn sm ghost" data-act="sc-memo-all">${open ? `${open} fil(s) en suspens dans la campagne` : 'Journal de la campagne'} ›</button></div>
  </section>`;
}
// Choix possibles préparés dans une scène
function renderChoices(s, sc, edit) {
  const list = sc.choix || [];
  if (!list.length && !edit) return '';
  const at = (ch, extra = '') => `data-scene="${esc(sc.id)}" data-key="${esc(ch.id)}" ${extra}`;
  return `<div class="choix"><h3>Choix possibles</h3>
    ${list.map((ch) => {
      const e = ch.entry && scen.entry(ch.entry);
      return `<div class="ch"><div class="cq"><b>${esc(ch.q)}</b>${edit ? `<button class="btn sm ghost" data-act="sc-ch-edit" ${at(ch)}>${icon('edit')}</button><button class="btn sm danger" data-act="sc-ch-del" ${at(ch)}>${icon('trash')}</button>` : ''}</div>
        ${e ? `<div class="small" style="margin-top:4px"><span class="badge ok">Tranché</span> ${esc(e.txt)}${e.pjs.length ? ` <span class="muted">— ${esc(e.pjs.join(', '))}</span>` : ''}</div>
          <div class="row" style="margin-top:4px"><button class="btn sm ghost" data-act="sc-memo-edit" data-key="${esc(e.id)}">${icon('edit')} Modifier</button><button class="btn sm ghost" data-act="sc-ch-undo" ${at(ch)}>Annuler ce choix</button></div>`
        : `<div class="annexes">${ch.opts.map((o, j) => `<button class="pill light" data-act="sc-ch-pick" ${at(ch, `data-i="${j}"`)}>${esc(o.t)}</button>`).join('')}<button class="pill light" data-act="sc-ch-pick" ${at(ch, 'data-i="-1"')}>Autre…</button></div>
          ${ch.opts.some((o) => o.suite) ? `<div class="small muted" style="margin-top:4px">${ch.opts.filter((o) => o.suite).map((o) => `<b>${esc(o.t)}</b> → ${esc(o.suite)}`).join('<br>')}</div>` : ''}`}
      </div>`;
    }).join('')}
    ${edit ? `<div class="row" style="margin-top:6px"><button class="btn sm" data-act="sc-ch-add" data-scene="${esc(sc.id)}">${icon('plus')} Choix possible</button></div>` : ''}</div>`;
}
function choiceDialog(ch, done) {
  dialog('Choix possible', `<div class="grid">${F.text('q', 'Situation ou dilemme', ch.q, '', 'placeholder="Livrer le traître à Laurent ou le laisser filer ?"')}
    <div class="field"><label>Options, une par ligne (conséquence après « => »)</label><textarea name="opts" style="min-height:120px" placeholder="Le livrer => Laurent leur doit une faveur&#10;Le laisser filer => il revient avec les hommes de Baal">${esc(ch.opts.map((o) => o.t + (o.suite ? ' => ' + o.suite : '')).join('\n'))}</textarea></div></div>`,
  `<button class="btn" data-dact="close">Annuler</button><button class="btn pri" id="ch-ok">Enregistrer</button>`);
  dlg.querySelector('[name=q]').focus();
  dlg.querySelector('#ch-ok').onclick = () => {
    const q = dlg.querySelector('[name=q]').value.trim(); if (!q) return toast('Décris la situation');
    ch.q = q;
    ch.opts = dlg.querySelector('[name=opts]').value.split('\n').map((l) => l.trim()).filter(Boolean)
      .map((l) => { const [t, ...r] = l.split('=>'); return { t: t.trim(), suite: r.join('=>').trim() }; }).filter((o) => o.t);
    closeDlg(); done();
  };
}
function memoDialog(e, onSaved) {
  const isNew = !scen.entry(e.id);
  const names = [...new Set([...memoPjNames(), ...e.pjs])];
  const scens = scen.all(); const sOpts = scens.map((x) => [x.id, x.nom]);
  dialog(isNew ? 'Noter un choix' : 'Choix des joueurs', `<div class="grid g2">
    ${F.select('kind', 'Nature', e.kind, KINDS)}${F.select('scen', 'Arrivé pendant', e.scen || '', [['', '—'], ...sOpts])}
    <div class="field full"><label>Ce que les joueurs ont fait ou décidé</label><textarea name="txt" placeholder="Ont épargné le vampire de la rue Saint-Denis contre ses informations">${esc(e.txt)}</textarea></div>
    <div class="field full"><label>Personnages concernés</label><div class="annexes" style="margin-top:0">${names.map((p) => `<label class="chk pjchk"><input type="checkbox" name="pj" value="${esc(p)}" ${e.pjs.includes(p) ? 'checked' : ''}> ${esc(p)}</label>`).join('') || '<span class="small muted">Aucun PJ connu : saisis leurs noms ci-dessous.</span>'}</div>
      <input name="pjx" style="margin-top:6px" placeholder="Autres noms (séparés par des virgules)"></div>
    <div class="field full"><label>Suite à faire vivre (vide si rien à rappeler)</label><textarea name="suite" placeholder="Il leur doit un service… ou les vendra à Baal">${esc(e.suite)}</textarea></div>
    ${F.select('rappel', 'À faire ressortir dans le scénario', e.rappel || '', [['', '— pas encore prévu'], ...sOpts], 'full')}
    ${isNew ? '' : `<label class="chk full"><input type="checkbox" name="done" ${e.done ? 'checked' : ''}> Fil refermé</label>${F.text('res', 'Comment il s\'est refermé', e.res, 'full')}`}
  </div>`, `${isNew ? '' : `<button class="btn danger" id="me-del">${icon('trash')}</button><span class="spacer"></span>`}<button class="btn" data-dact="close">Annuler</button><button class="btn pri" id="me-ok">Enregistrer</button>`);
  const g = (n) => dlg.querySelector(`[name=${n}]`);
  const t = g('txt'); t.focus(); t.setSelectionRange(t.value.length, t.value.length);
  dlg.querySelector('#me-ok').onclick = () => {
    const txt = g('txt').value.trim(); if (!txt) return toast('Décris ce qu\'ont fait les joueurs');
    const pjs = [...dlg.querySelectorAll('[name=pj]:checked')].map((x) => x.value).concat(g('pjx').value.split(',').map((x) => x.trim()).filter(Boolean));
    const sid = g('scen').value || null;
    Object.assign(e, { kind: g('kind').value, txt, pjs: [...new Set(pjs)], suite: g('suite').value.trim(), rappel: g('rappel').value || null, scene: sid === e.scen ? e.scene : null, scen: sid });
    if (g('done')) { e.done = g('done').checked; e.res = g('res').value.trim(); }
    scen.saveEntry(e); closeDlg(); toast(isNew ? 'Choix noté' : 'Enregistré'); onSaved?.(e); render();
  };
  const del = dlg.querySelector('#me-del');
  if (del) del.onclick = async () => { closeDlg(); if (await confirmDlg('Supprimer', 'Retirer ce choix du journal ?')) { scen.removeEntry(e.id); render(); } };
}

// ---- Combat en cours ----
function liveCtx(s, sc, unitId) {
  const u = sc.live.units.find((x) => x.uid === unitId); if (!u) return {};
  const n = sc.npcs.find((x) => x.id === u.npc);
  return { u, n, st: n ? npcStats(n) : null, c: n ? npcChar(n, u.bl) : null };
}
function renderLive(s, sc) {
  const lv = sc.live;
  const alive = lv.units.filter((u) => !u.out);
  const pjs = store.configured && table.current ? table.characters() : [];
  return `<section class="card dark">
      <div class="row"><button class="btn sm ghost" data-act="lv-back">Combats</button>${s.impro ? '' : `<button class="btn sm ghost" data-act="mj-sec" data-v="scen">${esc(s.nom)}</button>`}<span class="spacer"></span>
        <span>Round</span><span class="stepper"><button data-act="lv-round" data-v="-1">–</button><b>${lv.round}</b><button data-act="lv-round" data-v="1">+</button></span></div>
      <h2 style="margin:10px 0 0">${icon('sword')} ${s.impro ? `<input class="inp" style="max-width:320px" value="${esc(sc.nom)}" data-lvname="${esc(sc.id)}">` : esc(sc.nom)}</h2>
      <div class="small muted d">${alive.length} adversaire(s) debout sur ${lv.units.length}${sc.lieu ? ' · ' + esc(sc.lieu) : ''}</div>
      ${scenAlerts(sc.npcs.filter((n) => alive.some((u) => u.npc === n.id)))}
      <div class="row" style="margin-top:8px"><button class="btn sm" data-act="lv-add">${icon('plus')} ${lv.units.length ? 'Renfort' : 'Ajouter des adversaires'}</button><button class="btn sm" data-act="sc-memo-new" data-sid="${esc(s.id)}" data-scene="${esc(sc.id)}">${icon('edit')} Noter un choix</button><span class="spacer"></span><button class="btn sm danger" data-act="lv-end">Terminer le combat</button></div>
    </section>
    ${renderInit(sc)}
    ${pjs.length ? `<section class="card"><h2>Personnages joueurs <span class="tag">toucher pour lancer en secret</span></h2>
      <div style="overflow-x:auto"><table class="ref comp"><tr><th>PJ</th><th>Per</th><th>Vol.</th><th>Foi</th><th>Déf.</th><th>BL/BG/BF/MS</th><th>PF</th><th>Malus</th></tr>
      ${pjs.map((x) => { const c = x.c; const a = R.annexes(c); const cell = (k2, key, v) => `<td><button class="cell" data-act="mj-roll" data-id="${esc(x.id)}" data-k="${k2}" data-key="${esc(key)}">${L(v)}</button></td>`;
        return `<tr><td><b>${esc(c.nom || '?')}</b></td>${cell('car', 'pe', c.car.pe)}${cell('car', 'vo', c.car.vo)}${cell('car', 'foi', c.car.foi)}${cell('tal', 'Défense', R.talentLevel(c, 'Défense'))}
          <td>${a.bl}/${a.bg}/${a.bf}/${a.ms}</td><td>${c.pfCur ?? a.pf}/${a.pf}</td><td>${R.woundMalus(c) || ''}</td></tr>`; }).join('')}</table></div></section>` : ''}
    ${lv.units.map((u) => renderUnit(sc, u)).join('')}`;
}
// ---- Onglet Combat du MJ : combats en cours, combats préparés, combat improvisé ----
function liveCombats() {
  const out = [];
  for (const s of scen.all()) for (const sc of s.scenes) if (sc.live) out.push({ s, sc });
  return out.sort((a, b) => (b.sc.live.started || 0) - (a.sc.live.started || 0));
}
function renderMJCombat() {
  const s = scen.get(ui.scenId); const sc = curScene(s, ui.live);
  if (sc?.live) return renderLive(s, sc);
  const live = liveCombats();
  const ready = [];
  for (const x of scen.all()) for (const y of x.scenes) if (!y.live && y.npcs.length && !y.done) ready.push({ s: x, sc: y });
  ready.sort((a, b) => (b.s.cur === b.sc.id) - (a.s.cur === a.sc.id));
  const row = ({ s: x, sc: y }, act, lab) => {
    const lv = y.live; const up = lv ? lv.units.filter((u) => !u.out).length : 0;
    const info = lv ? `round ${lv.round} · ${up}/${lv.units.length} adversaire(s) debout${lv.init ? ' · initiative lancée' : ''}`
      : `${y.npcs.reduce((t, n) => t + (+n.qty || 1), 0)} PNJ préparé(s)${y.lieu ? ' · ' + y.lieu : ''}`;
    return `<div class="init-row"><div style="flex:1;min-width:0"><b>${esc(y.nom)}</b><div class="small muted">${x.cur === y.id && !lv ? '<b style="color:var(--red)">scène en cours</b> · ' : ''}${esc(x.impro ? 'Combat improvisé' : x.nom)} · ${esc(info)}</div></div>
      <button class="btn sm ${lv ? 'pri' : ''}" data-act="${act}" data-sid="${esc(x.id)}" data-scene="${esc(y.id)}">${lab}</button></div>`;
  };
  return `<section class="card dark">
      <h2 style="margin-top:0">${icon('sword')} Combat</h2>
      <p class="small muted d" style="margin-top:0">Ordre d'initiative, tour en cours, PF et blessures des adversaires, PJ de la table ouverte. Un combat improvisé se lance sans préparer de scénario : ajoute les adversaires depuis le bestiaire ou un PNJ rapide.</p>
      <div class="row"><button class="btn pri" data-act="mj-cb-impro">${icon('plus')} Combat improvisé</button><button class="btn sm ghost" data-act="mj-sec" data-v="scen">Préparer dans un scénario</button></div>
    </section>
    <section class="card"><h2>Combats en cours</h2>${live.length ? live.map((x) => row(x, 'mj-cb-open', 'Reprendre')).join('') : '<div class="empty">Aucun combat en cours</div>'}</section>
    ${ready.length ? `<section class="card"><h2>Combats préparés <span class="tag">scènes avec des PNJ</span></h2>${ready.slice(0, 15).map((x) => row(x, 'mj-cb-open', 'Lancer')).join('')}</section>` : ''}`;
}
// ---- Initiative ----
// sc.live.init = { k: caractéristique testée, diff, order: [{ t: 'u' | 'pj' | 'x', id, ok, mr, r, dice }], turn }
// u : adversaire (unité du combat), pj : personnage de la table ouverte, x : participant ajouté à la main
const INIT_CARS = [['ag', 'Agilité', 'en général'], ['vo', 'Volonté', 'le combat s\'ouvre sur une attaque mentale'], ['pe', 'Perception', 'attaque à distance']];
function fighters(sc) {
  const lv = sc.live; const k = lv.init?.k || 'ag'; const out = [];
  for (const u of lv.units) {
    const n = sc.npcs.find((x) => x.id === u.npc); if (!n) continue;
    out.push({ t: 'u', id: u.uid, nom: u.label, r: n.car[k], char: npcChar(n, u.bl), out: u.out, pf: u.pf, pfMax: npcStats(n).pf });
  }
  if (store.configured && table.current) for (const x of table.characters()) {
    const c = x.c; const a = R.annexes(c); const pf = c.pfCur ?? a.pf;
    out.push({ t: 'pj', id: x.id, nom: c.nom || x.player || 'PJ', r: c.car[k], char: c, out: pf <= 0, pf, pfMax: a.pf });
  }
  for (const e of lv.extra || []) out.push({ t: 'x', id: e.id, nom: e.nom, r: null, char: null, out: false });
  return out;
}
const fKey = (f) => f.t + ':' + f.id;
function initTest(f, ini) {
  if (f.r == null || !f.char) return { ok: null, mr: null }; // participant ajouté à la main : MR annoncée par le joueur
  const diff = R.DIFFICULTES.find((d) => d.k === ini.diff)?.s || 0;
  const st = R.seuilStandard(f.r, diff + R.woundMalus(f.char));
  const res = R.resolve(R.rollD666(), { seuil: st.seuil, mrLevel: R.lvlInt(st.eff), foi: f.char.car.foi, camp: R.typeOf(f.char).camp });
  return { ok: !!res.ok, mr: res.ok ? res.mr : null, dice: res.dice.join('') };
}
// Réussites d'abord (MR décroissante, puis niveau testé), puis échecs, puis MR pas encore annoncées
const initRank = (e) => (e.ok ? 2 : e.ok === false ? 1 : 0);
const initCmp = (a, b) => initRank(b) - initRank(a) || (b.mr ?? -99) - (a.mr ?? -99) || (b.r ?? 0) - (a.r ?? 0);
function sortInit(ini) {
  const cur = ini.order[ini.turn];
  ini.order.sort(initCmp);
  ini.turn = Math.max(0, cur ? ini.order.indexOf(cur) : 0);
}
// Place un seul participant (nouveau ou MR modifiée) sans défaire l'ordre réglé à la main avec ▲▼
function placeInit(ini, e) {
  const cur = ini.order[ini.turn];
  const i = ini.order.indexOf(e); if (i >= 0) ini.order.splice(i, 1);
  const j = ini.order.findIndex((x) => initCmp(e, x) < 0);
  ini.order.splice(j < 0 ? ini.order.length : j, 0, e);
  ini.turn = Math.max(0, cur ? ini.order.indexOf(cur) : 0);
}
function renderInit(sc) {
  const lv = sc.live; const ini = lv.init; const fs = fighters(sc);
  const byKey = new Map(fs.map((f) => [fKey(f), f]));
  if (!ini) {
    return `<section class="card"><h2>Initiative</h2>
      <p class="small" style="margin-top:0">Jet au premier tour seulement, ensuite chacun joue dans l'ordre. ${fs.length ? `${fs.length} participant(s) : ${esc(fs.map((f) => f.nom).join(', '))}.` : 'Ajoute d\'abord des adversaires.'}</p>
      <div class="row"><button class="btn pri" data-act="lv-init" ${fs.length ? '' : 'disabled'}>${icon('die')} Lancer l'initiative</button><button class="btn sm" data-act="lv-iadd">${icon('plus')} Participant</button></div></section>`;
  }
  const car = INIT_CARS.find(([k]) => k === ini.k);
  const cur = ini.order[ini.turn]; const curF = cur && byKey.get(fKey(cur));
  const rows = ini.order.map((e, i) => {
    const f = byKey.get(fKey(e)); if (!f) return '';
    const res = e.ok ? `MR <b>${e.mr}</b>` : e.ok === false ? 'échec' : '<i>à annoncer</i>';
    const pf = f.pfMax ? `<span class="small muted">PF ${f.pf}/${f.pfMax}</span>` : '';
    return `<div class="init-row ${i === ini.turn ? 'cur' : ''} ${f.out ? 'out' : ''}">
      <span class="init-n">${i + 1}</span>
      <div style="flex:1;min-width:0"><b ${f.t === 'u' ? `data-act="lv-igo" data-key="${esc(f.id)}" style="cursor:pointer"` : ''}>${esc(f.nom)}</b> <span class="badge ${f.t === 'u' ? 'no' : ''}">${f.t === 'u' ? 'PNJ' : 'PJ'}</span>${f.out ? ' <span class="small muted">hors de combat</span>' : ''}<div>${pf}</div></div>
      <button class="pill light" data-act="lv-iset" data-key="${esc(fKey(e))}" title="Saisir la MR annoncée">${res}</button>
      <span class="stepper"><button data-act="lv-imove" data-key="${esc(fKey(e))}" data-v="-1" title="Monter">▲</button><button data-act="lv-imove" data-key="${esc(fKey(e))}" data-v="1" title="Descendre">▼</button></span>
      ${f.t === 'x' ? `<button class="ibtn" style="width:30px;height:30px" data-act="lv-idel" data-key="${esc(fKey(e))}" title="Retirer">${icon('x')}</button>` : ''}
    </div>`;
  }).join('');
  const inOrder = new Set(ini.order.map(fKey));
  const missing = fs.filter((f) => !inOrder.has(fKey(f)));
  return `<section class="card init">
    <h2>Initiative <span class="tag">${esc(car ? car[1] : '')}${ini.diff === 'tres' ? ', Très difficile (surprise)' : ''}</span></h2>
    <div class="init-now">${curF ? `Round ${lv.round} · à <b>${esc(curF.nom)}</b> de jouer` : 'Ordre du tour'}</div>
    ${rows}
    ${missing.length ? `<div class="small" style="margin-top:8px"><b>Pas encore placés :</b> ${missing.map((f) => `<button class="pill light" data-act="lv-iroll" data-key="${esc(fKey(f))}">${esc(f.nom)} ${f.r == null ? '· saisir' : '· lancer'}</button>`).join(' ')}</div>` : ''}
    <div class="row" style="margin-top:10px"><button class="btn pri" data-act="lv-inext">Tour suivant</button><span class="spacer"></span>
      <button class="btn sm" data-act="lv-iadd">${icon('plus')} Participant</button><button class="btn sm ghost" data-act="lv-init">Relancer</button></div>
    <p class="small muted" style="margin-bottom:0">Les PJ sont lancés en secret par le MJ ; touche un résultat pour saisir la MR annoncée par un joueur (vide = échec). Les blessures ouvertes comptent dans le jet.</p>
  </section>`;
}
function initDialog(s, sc) {
  const pjs = fighters(sc).some((f) => f.t !== 'u');
  dialog('Initiative', `<div class="field"><label>Caractéristique testée</label><select id="in-k">${INIT_CARS.map(([k, n, w]) => `<option value="${k}" ${sc.live.init?.k === k ? 'selected' : ''}>${n} — ${w}</option>`).join('')}</select></div>
    <div class="field"><label>Situation</label><select id="in-d"><option value="difficile">Normale (Difficile)</option><option value="tres" ${sc.live.init?.diff === 'tres' ? 'selected' : ''}>Surprise des deux camps (Très difficile : qui échoue ne joue pas ce tour)</option></select></div>
    ${pjs ? '<label class="chk"><input type="checkbox" id="in-pj" checked> Lancer aussi pour les PJ (sinon chaque joueur annonce sa MR)</label>' : ''}
    <p class="small muted">Embuscade : test de Perception des victimes opposé à la Discrétion des embusqués (le moins discret), à faire avant avec le lanceur de dés. Duel : jet d'Agilité opposé.</p>`,
  `<button class="btn" data-dact="close">Annuler</button><button class="btn pri" id="in-ok">Lancer</button>`);
  dlg.querySelector('#in-ok').onclick = () => {
    const rollPj = dlg.querySelector('#in-pj')?.checked !== false;
    const ini = { k: dlg.querySelector('#in-k').value, diff: dlg.querySelector('#in-d').value, order: [], turn: 0 };
    closeDlg();
    sc.live.init = ini; // fighters() lit la caractéristique choisie
    ini.order = fighters(sc).map((f) => ({ t: f.t, id: f.id, r: f.r, ...(f.t === 'pj' && !rollPj ? { ok: null, mr: null } : initTest(f, ini)) }));
    ini.turn = -1; sortInit(ini); ini.turn = 0;
    const first = ini.order.find((e) => e.ok);
    scen.save(s); render();
    toast(first ? `Initiative lancée : ${fighters(sc).find((f) => fKey(f) === fKey(first))?.nom} commence` : 'Initiative lancée');
  };
}
async function initAction(act, b, s, sc) {
  const lv = sc.live; const ini = lv.init; const key = b.dataset.key;
  const save = () => { scen.save(s); render(); };
  switch (act) {
    case 'lv-init': return initDialog(s, sc);
    case 'lv-iadd': {
      const nom = await ask('Participant', 'Nom (PJ sans table partagée, allié, PNJ joué à part…)'); if (!nom?.trim()) return;
      const e = { id: newNpc().id, nom: nom.trim() };
      (lv.extra ||= []).push(e);
      if (ini) placeInit(ini, { t: 'x', id: e.id, r: null, ok: null, mr: null });
      return save();
    }
    case 'lv-igo': { const el = document.getElementById('u-' + key); return el?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  }
  if (!ini) return;
  const idx = ini.order.findIndex((e) => fKey(e) === key);
  switch (act) {
    case 'lv-iroll': {
      const f = fighters(sc).find((x) => fKey(x) === key); if (!f) return;
      const e = { t: f.t, id: f.id, r: f.r, ...initTest(f, ini) }; placeInit(ini, e);
      if (f.r == null) return save();
      toast(`${f.nom} : ${e.ok ? 'MR ' + e.mr : 'échec'}`); return save();
    }
    case 'lv-iset': {
      if (idx < 0) return;
      const f = fighters(sc).find((x) => fKey(x) === key);
      const v = await ask(f?.nom || 'Initiative', 'MR d\'initiative (vide = échec)', ini.order[idx].mr ?? '');
      if (v === null) return;
      const e = ini.order[idx];
      if (String(v).trim() === '') { e.ok = false; e.mr = null; } else if (Number.isFinite(+v)) { e.ok = true; e.mr = +v; } else return toast('Nombre invalide');
      placeInit(ini, e); return save();
    }
    case 'lv-imove': {
      const j = idx + +b.dataset.v; if (idx < 0 || j < 0 || j >= ini.order.length) return;
      const cur = ini.order[ini.turn];
      [ini.order[idx], ini.order[j]] = [ini.order[j], ini.order[idx]];
      ini.turn = Math.max(0, ini.order.indexOf(cur)); return save();
    }
    case 'lv-idel': {
      if (idx < 0) return;
      const cur = ini.order[ini.turn]; const [e] = ini.order.splice(idx, 1);
      if (e.t === 'x') lv.extra = (lv.extra || []).filter((x) => x.id !== e.id);
      ini.turn = cur === e ? Math.min(idx, ini.order.length - 1) : ini.order.indexOf(cur);
      ini.turn = Math.max(0, ini.turn); return save();
    }
    case 'lv-inext': {
      const byKey = new Map(fighters(sc).map((f) => [fKey(f), f]));
      const n = ini.order.length; if (!n) return;
      let i = ini.turn; let wrapped = false;
      for (let step = 0; step < n; step++) {
        i++; if (i >= n) { i = 0; wrapped = true; }
        const f = byKey.get(fKey(ini.order[i]));
        if (f && !f.out) break;
      }
      ini.turn = i;
      if (wrapped) lv.round++;
      const f = byKey.get(fKey(ini.order[i]));
      toast(`${wrapped ? `Round ${lv.round} · ` : ''}à ${f?.nom || '?'} de jouer`);
      save();
      if (f?.t === 'u') document.getElementById('u-' + f.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
  }
}
function renderUnit(sc, u) {
  const n = sc.npcs.find((x) => x.id === u.npc);
  if (!n) return '';
  const st = npcStats(n); const c = npcChar(n, u.bl); const malus = R.woundMalus(c);
  const at = (extra = '') => `data-u="${esc(u.uid)}" ${extra}`;
  const pill = (lab, r, kind, key) => `<button class="pill light" data-act="lv-roll" ${at(`data-k="${kind}" data-key="${esc(key)}"`)}>${lab} <b>${L(r)}</b></button>`;
  const open = u.bl.map((b, i) => ({ b, i }));
  const ini = sc.live.init; const cur = ini && ini.order[ini.turn];
  const isCur = cur && cur.t === 'u' && cur.id === u.uid;
  return `<section class="card unit ${u.out ? 'out' : ''} ${isCur ? 'cur' : ''}" id="u-${esc(u.uid)}">
    <h2>${isCur ? '▶ ' : ''}${esc(u.label)}${u.out ? '<span class="stamp" style="margin-left:6px">Hors de combat</span>' : ''}<span class="tag">${esc(n.source || R.TYPES[n.type]?.n || '')}</span></h2>
    <div class="tracker"><span class="lab">PF</span>${bar(u.pf, st.pf, 'pf')}<span class="stepper"><button data-act="lv-pf" ${at('data-v="-1"')}>–</button><button data-act="lv-pf" ${at('data-v="1"')}>+</button></span></div>
    ${st.pp ? `<div class="tracker" style="margin-top:6px"><span class="lab">PP</span>${bar(u.pp, st.pp)}<span class="stepper"><button data-act="lv-pp" ${at('data-v="-1"')}>–</button><button data-act="lv-pp" ${at('data-v="1"')}>+</button></span></div>` : ''}
    <div class="annexes">
      ${n.armes.map((w, i) => `<button class="btn sm pri" data-act="lv-attack" ${at(`data-i="${i}"`)}>${icon('sword')} ${esc(w.n)} ${L(w.att)}</button>`).join('')}
      ${pill('Défense', n.def, 'def', '')}${pill('Vo', n.car.vo, 'car', 'vo')}${pill('Pe', n.car.pe, 'car', 'pe')}${pill(c.chance ? 'Ch' : 'Foi', n.car.foi, 'car', 'foi')}
    </div>
    <div class="annexes"><span class="pill light">BL <b>${st.bl}</b> BG <b>${st.bg}</b> BF <b>${st.bf}</b> MS <b>${st.ms}</b></span>${+n.prot ? `<span class="pill light">Prot. <b>${n.prot}</b></span>` : ''}
      ${malus ? `<span class="pill" style="background:var(--red)">malus <b>${malus}</b></span>` : ''}</div>
    ${open.length ? `<div style="margin-top:6px">${open.map(({ b, i }) => `<div class="wound"><span class="g ${b.g}">${b.g}</span><div class="tn" style="flex:1">${R.BLESSURES[b.g].n}${b.note ? ' <small class="muted">' + esc(b.note) + '</small>' : ''}${b.ouverte ? '' : ' <small class="muted">(refermée)</small>'}</div>
      ${b.ouverte ? `<button class="btn sm" data-act="lv-wclose" ${at(`data-i="${i}"`)}>Refermer</button>` : ''}<button class="ibtn" style="width:32px;height:32px" data-act="lv-wdel" ${at(`data-i="${i}"`)}>${icon('x')}</button></div>`).join('')}</div>` : ''}
    ${n.pouvoirs.length ? `<div class="small" style="margin-top:8px">${n.pouvoirs.map((p, i) => {
      const d = R.powerDef(p.n) || {}; const par = d.parent ? R.powerDef(d.parent) : null; const cost = ppCostOf(d.act || par?.act);
      return `<button class="pill light" data-act="lv-pow" ${at(`data-i="${i}"`)} title="${esc([d.s || par?.s, d.act || par?.act].filter(Boolean).join(' — '))}">${esc(p.n)} <b>${p.r ? L(p.r) : '—'}</b>${cost ? ` <small>${cost} PP</small>` : ''}</button>`;
    }).join(' ')}</div>` : ''}
    ${n.talents ? `<div class="small muted" style="margin-top:6px">${esc(n.talents)}</div>` : ''}
    ${n.notes ? `<details class="small" style="margin-top:6px"><summary class="muted">Notes ▾</summary><div style="white-space:pre-line">${esc(n.notes)}</div></details>` : ''}
    <div class="row" style="margin-top:8px"><button class="btn sm dark" data-act="lv-hit" ${at()}>Encaisser un coup</button><span class="spacer"></span><button class="btn sm ghost" data-act="lv-out" ${at()}>${u.out ? 'Remettre en jeu' : 'Hors de combat'}</button></div>
  </section>`;
}
function lvHit(s, sc, u, n) {
  const st = npcStats(n);
  dialog('Encaisser : ' + esc(u.label), `<div class="grid g2">${F.num('dmg', 'Niveau de dommage reçu', '')}${F.num('prot', 'Protection à retirer', +n.prot || 0)}${F.text('note', 'Localisation, arme…', '', 'full')}</div>
    <div id="hit-res" class="verdict" style="margin-top:10px"></div><p class="small muted">Seuils : BL ${st.bl}, BG ${st.bg}, BF ${st.bf}, MS ${st.ms}. Couverture partielle : armure ignorée sur un double ou un triple ; importante : sur un triple.</p>`,
  `<button class="btn" data-dact="close">Annuler</button><button class="btn pri" id="hit-ok">Appliquer</button>`);
  const calc = () => {
    const g = gravite((+dlg.querySelector('[name=dmg]').value || 0) - (+dlg.querySelector('[name=prot]').value || 0), st);
    dlg.querySelector('#hit-res').textContent = g ? `${R.BLESSURES[g].n} (–${R.BLESSURES[g].pf} PF)` : 'Pas de blessure';
    return g;
  };
  dlg.querySelectorAll('input').forEach((x) => { x.oninput = calc; });
  dlg.querySelector('[name=dmg]').focus();
  dlg.querySelector('#hit-ok').onclick = () => {
    const g = calc(); const note = dlg.querySelector('[name=note]').value; closeDlg();
    if (g) {
      u.bl.push({ g, ouverte: true, note });
      u.pf -= R.BLESSURES[g].pf;
      const c = npcChar(n);
      if (g === 'MS') toast(R.typeOf(c).camp === 'neutre' && c.chance ? `${u.label} : mort subite, il meurt…` : `${u.label} : mort subite ! Test standard de Force pour survivre`);
      else if (u.pf <= 0) toast(`${u.label} : plus de PF, hors de combat`);
      else toast(`${u.label} : ${R.BLESSURES[g].n}, –${R.BLESSURES[g].pf} PF`);
      if (u.pf <= 0 || g === 'MS') u.out = true;
      scen.save(s);
    }
    render();
  };
}
function npcAttack(u, n, w) {
  const fo = R.lvlInt(n.car.fo);
  return openRoll({ label: `${u.label} — ${w.n}`, r: w.att, prec: +w.prec || 0, char: npcChar(n, u.bl), kind: 'attaque', sits: weaponSits(w), after: (res) => {
    const dmg = res.mr + (+w.puis || 0) + (w.melee ? fo : 0);
    return `Dommages : <b style="font-size:20px;color:#fff">${dmg}</b> <span class="muted">(MR ${res.mr} + puissance ${sgn(+w.puis || 0)}${w.melee ? ' + Force ' + fo : ''})</span>`;
  } });
}
function scenChange(el) {
  const s = scen.get(ui.scenId);
  const d = el.dataset; let v = el.type === 'checkbox' ? el.checked : el.value;
  let redraw = el.tagName === 'SELECT' || el.type === 'checkbox';
  if (d.sf) { if (!s) return; s[d.sf] = v; if (d.sf === 'nom') redraw = true; }
  else if (d.scf) { const sc = curScene(s, d.scene); if (sc) sc[d.scf] = v; }
  else {
    const n = npcTarget(s); if (!n) return;
    if (d.nf) {
      const [f, sub] = d.nf.split('.');
      if (f === 'car') n.car[sub] = +v;
      else if (f === 'seuilsFix') { n.seuilsFix ||= ['', '', '', '']; n.seuilsFix[+sub] = v === '' ? '' : +v; if (n.seuilsFix.every((x) => x === '')) n.seuilsFix = null; redraw = true; }
      else if (f === 'pfFix') { n.pfFix = v === '' ? null : +v; redraw = true; }
      else if (['def', 'prot', 'pp'].includes(f)) n[f] = +v || 0;
      else if (f === 'qty') n.qty = Math.max(1, +v || 1);
      else n[f] = v;
    } else if (d.wf) { const w = n.armes[+d.i]; if (w) w[d.wf] = d.wf === 'n' ? v : d.wf === 'melee' ? v : +v || 0; }
    else if (d.pw != null) { n.pouvoirs[+d.pw].r = +v; }
  }
  scen.save(s);
  if (redraw) render();
}
async function scenAction(act, b) {
  const key = b.dataset.key; const s = scen.get(ui.scenId);
  const sc = s && curScene(s, b.dataset.scene || ui.npcEdit?.scene || ui.live);
  const n = npcTarget(s);
  const go = (id) => { ui.scenId = id; ui.npcEdit = null; ui.live = null; if (id) localStorage.setItem('insmv.scen', id); else localStorage.removeItem('insmv.scen'); localStorage.removeItem('insmv.live'); render(); window.scrollTo(0, 0); };
  const save = () => { scen.save(s); render(); };
  switch (act) {
    case 'sc-open': return go(key);
    case 'sc-back': return go(null);
    case 'sc-create': {
      const nom = document.getElementById('sc-name').value.trim();
      if (!nom) return toast('Donne un titre au scénario');
      return go(scen.create(nom).id);
    }
    case 'sc-library': return libraryDialog(go);
    case 'sc-import': return pickJSON((txt) => {
      const r = scen.importScenarios(txt);
      return `${r.scenarios} scénario(s) importé(s)${r.types ? `, ${r.types} type(s) d'ennemis ajouté(s) au bestiaire` : ''}${r.memo ? `, ${r.memo} choix des joueurs` : ''}`;
    });
    case 'sc-type-import': return pickJSON((txt) => {
      const r = scen.importTypes(txt);
      return `${r.types} type(s) d'ennemis ajouté(s) au bestiaire${r.already ? ` (${r.already} déjà présent(s))` : ''}`;
    });
    // ---- mémoire des choix ----
    case 'sc-memo-new': return memoDialog(newEntry({ scen: b.dataset.sid || (ui.mjSec === 'journal' && ui.memoF.scen) || null, scene: b.dataset.scene || null }));
    case 'sc-memo-edit': { const e = scen.entry(key); return e && memoDialog(e); }
    case 'sc-memo-done': {
      const e = scen.entry(key); if (!e) return;
      if (e.done) { e.done = false; scen.saveEntry(e); return render(); }
      const res = await ask('Refermer le fil', 'Comment ça s\'est terminé ? (facultatif)', e.res);
      if (res === null) return;
      e.done = true; e.res = res.trim(); scen.saveEntry(e); toast('Fil refermé'); return render();
    }
    case 'sc-memo-t': ui.memoF.allTables = b.dataset.v === '1'; return render();
    case 'sc-memo-all': ui.mjSec = 'journal'; ui.memoF = { ...ui.memoF, open: true, pj: '', scen: '' }; localStorage.setItem('insmv.mjsec', 'journal'); render(); return window.scrollTo(0, 0);
    case 'sc-memo-f': ui.memoF.open = b.dataset.v === '1'; return render();
    case 'sc-memo-export': return download('memoire-campagne-insmv.json', scen.exportJournal());
    case 'sc-memo-import': return pickJSON((txt) => { const r = scen.importJournal(txt); return `${r.memo} choix ajouté(s) au journal${r.already ? ` (${r.already} déjà présent(s))` : ''}`; });
    case 'sc-ch-add': { const ch = newChoice(); return choiceDialog(ch, () => { (sc.choix ||= []).push(ch); save(); }); }
    case 'sc-ch-edit': case 'sc-ch-del': case 'sc-ch-pick': case 'sc-ch-undo': {
      const ch = (sc?.choix || []).find((x) => x.id === key); if (!ch) return;
      if (act === 'sc-ch-edit') return choiceDialog(ch, save);
      if (act === 'sc-ch-del') {
        if (!(await confirmDlg('Supprimer', `Retirer le choix « ${esc(ch.q)} » de la scène ?${ch.entry ? ' (Ce qui a été noté dans le journal est conservé.)' : ''}`))) return;
        sc.choix = sc.choix.filter((x) => x !== ch); return save();
      }
      if (act === 'sc-ch-undo') {
        if (!(await confirmDlg('Annuler ce choix', 'Effacer ce qui a été noté dans le journal pour ce choix ?'))) return;
        scen.removeEntry(ch.entry); ch.entry = null; return save();
      }
      const o = ch.opts[+b.dataset.i];
      return memoDialog(newEntry({ scen: s.id, scene: sc.id, txt: `${ch.q} → ${o ? o.t : ''}`, suite: o?.suite || '' }), (e) => { ch.entry = e.id; scen.save(s); });
    }
    // ---- bestiaire ----
    case 'sc-type-new': { const t = scen.newType(); ui.npcEdit = { type: t.id }; render(); return window.scrollTo(0, 0); }
    case 'sc-type-edit': ui.npcEdit = { type: key }; render(); return window.scrollTo(0, 0);
    case 'sc-type-dup': { const t = scen.dupType(key); ui.npcEdit = { type: t.id }; toast('Type dupliqué'); render(); return window.scrollTo(0, 0); }
    case 'sc-type-del':
      if (!(await confirmDlg('Supprimer', `Retirer « ${esc(n.nom)} » du bestiaire ? Les PNJ déjà placés dans des scènes sont conservés.`))) return;
      scen.removeType(key); ui.npcEdit = null; render(); return window.scrollTo(0, 0);
    case 'sc-type-export': return download('bestiaire-insmv.json', scen.exportTypes());
    case 'sc-type-book':
      return chooseList('Bestiaire des livres', BOOK.map((t) => ({ t, label: (scen.getType(t.id) ? '✓ ' : '') + t.nom, sub: `${t.book}${t.source ? ' · ' + t.source : ''} · ${npcSummary(t)}` })), (it) => {
        const had = scen.getType(it.t.id); const t = scen.adoptBook(it.t);
        ui.npcEdit = { type: t.id }; toast(had ? 'Déjà dans ton bestiaire' : `${t.nom} ajouté à ton bestiaire`); render(); window.scrollTo(0, 0);
      });
    case 'sc-type-quick': {
      const q = await askQuickNpc(); if (!q) return;
      const t = scen.saveAsType(q); ui.npcEdit = { type: t.id }; toast(`${t.nom} ajouté à ton bestiaire`); render(); return window.scrollTo(0, 0);
    }
    case 'sc-type-char': {
      const list = store.list();
      if (!list.length) return toast('Aucun personnage dans le Grimoire');
      return chooseList('Type depuis un personnage', list.map((c) => ({ c, label: c.nom || 'Sans nom', sub: supLine(c) })), (it) => {
        const t = scen.saveAsType(npcFromCharacter(it.c, weaponLevel)); toast(`${t.nom} ajouté au bestiaire`); render();
      });
    }
    case 'sc-npc-best': {
      return chooseList('Depuis le bestiaire', typeItems(), async (it) => {
        if (it.book) it.t = scen.adoptBook(it.t);
        const q = await askQty(it.t.nom); if (!q) return;
        const ex = sc.npcs.find((x) => x.typeId === it.t.id && x.nom === it.t.nom);
        if (ex) ex.qty = (+ex.qty || 1) + q; else sc.npcs.push(scen.instantiate(it.t.id, q));
        scen.save(s); toast(`${q} × ${it.t.nom}${ex ? ` (${ex.qty} en tout)` : ''}`); render();
      });
    }
    case 'sc-npc-tobest': {
      const upd = n.typeId && scen.getType(n.typeId);
      if (upd && !(await confirmDlg('Bestiaire', `Remplacer le type « ${esc(upd.nom)} » du bestiaire par ce PNJ ? (Les autres scènes ne changent pas.)`))) return;
      scen.saveAsType(n); toast(upd ? 'Type mis à jour' : `${n.nom} enregistré dans le bestiaire`); return save();
    }
    case 'sc-export': return download(s.nom.replace(/\W+/g, '_') + '.scenario.json', scen.exportOne(s.id));
    case 'sc-dup': toast('Scénario dupliqué'); return go(scen.duplicate(s.id).id);
    case 'sc-del': if (await confirmDlg('Supprimer', `Supprimer définitivement le scénario « ${esc(s.nom)} » ?`)) { scen.remove(s.id); go(null); } return;
    case 'sc-tab-add': return addTableDialog(s, b.dataset.scene ? sc : null);
    case 'sc-tab-del': { const o = b.dataset.scene ? sc : s; if (o) o.tables = (o.tables || []).filter((x) => x !== key); return save(); }
    case 'sc-scene-add': { const x = newScene(`Scène ${s.scenes.length + 1}`); s.scenes.push(x); ui.open['scn' + x.id] = true; return save(); }
    case 'sc-cur': { // cette scène devient la scène en cours ; celles d'avant sont jouées
      const i = s.scenes.findIndex((x) => x.id === key); if (i < 0) return;
      s.fini = false;
      s.scenes.forEach((x, j) => { if (j < i) x.done = true; }); s.scenes[i].done = false; s.cur = key;
      save(); return scrollToScene(key);
    }
    case 'sc-next': {
      const i = curIdx(s); if (i < 0) return;
      s.scenes[i].done = true; const nx = s.scenes[i + 1]; s.cur = nx ? nx.id : null;
      if (!nx) toast('Scénario terminé');
      save(); return nx ? scrollToScene(nx.id) : window.scrollTo(0, 0);
    }
    case 'sc-goto': return scrollToScene(key);
    case 'sc-finish': { // fin anticipée : la scène en cours compte comme jouée, les suivantes restent non jouées
      if (!(await confirmDlg('Terminer le scénario', `Marquer « ${esc(s.nom)} » comme terminé ? Les scènes suivantes resteront non jouées.`))) return;
      const i = curIdx(s); if (i >= 0) s.scenes[i].done = true;
      s.cur = null; s.fini = true; toast('Scénario terminé'); save(); return window.scrollTo(0, 0);
    }
    case 'sc-reset':
      s.fini = false; s.cur = s.scenes[0]?.id || null; s.scenes.forEach((x) => { x.done = false; }); save(); return window.scrollTo(0, 0);
    case 'sc-scene-up': { const i = s.scenes.findIndex((x) => x.id === key); if (i > 0) s.scenes.splice(i - 1, 0, s.scenes.splice(i, 1)[0]); return save(); }
    case 'sc-scene-del': {
      const x = curScene(s, key);
      if (!(await confirmDlg('Supprimer', `Supprimer la scène « ${esc(x.nom)} » et ses ${x.npcs.length} PNJ ?`))) return;
      if (s.cur === key) s.cur = null;
      s.scenes = s.scenes.filter((y) => y.id !== key); return save();
    }
    case 'sc-npc-add': { const x = newNpc(); sc.npcs.push(x); scen.save(s); ui.npcEdit = { scene: sc.id, npc: x.id }; render(); return window.scrollTo(0, 0); }
    case 'sc-npc-import': {
      const list = store.list();
      if (!list.length) return toast('Aucun personnage dans le Grimoire');
      return chooseList('PNJ depuis un personnage', list.map((c) => ({ c, label: c.nom || 'Sans nom', sub: supLine(c) })), (it) => {
        const x = npcFromCharacter(it.c, weaponLevel); sc.npcs.push(x); scen.save(s); toast(`${x.nom} ajouté`); render();
      });
    }
    case 'sc-npc-edit': ui.npcEdit = { scene: sc.id, npc: key }; render(); return window.scrollTo(0, 0);
    case 'sc-npc-done': ui.npcEdit = null; render(); return window.scrollTo(0, 0);
    case 'sc-npc-dup': { const x = { ...JSON.parse(JSON.stringify(n)), id: newNpc().id, nom: n.nom + ' (copie)' }; sc.npcs.splice(sc.npcs.indexOf(n) + 1, 0, x); ui.npcEdit.npc = x.id; toast('PNJ dupliqué'); return save(); }
    case 'sc-npc-del':
      if (!(await confirmDlg('Supprimer', `Supprimer ${esc(n.nom)} ?`))) return;
      sc.npcs = sc.npcs.filter((x) => x.id !== n.id); ui.npcEdit = null; return save();
    case 'sc-w-add': {
      const items = R.ARMES.flatMap(([g, l]) => l.map(([nm, p, pu, q]) => ({ label: nm, sub: `${g} · préc. ${sgn(p)} · puiss. ${sgn(pu)}${q ? ' · ' + q : ''}`, p, pu, melee: R.MELEE_GROUPS.includes(g) })));
      return chooseList('Arme', items, (it) => { n.armes.push({ n: it.label, att: n.armes[0]?.att ?? 4, prec: it.p, puis: it.pu, melee: it.melee }); save(); });
    }
    case 'sc-w-free': n.armes.push({ n: 'Griffes', att: n.armes[0]?.att ?? 4, prec: 0, puis: 0, melee: true }); return save();
    case 'sc-w-del': n.armes.splice(+b.dataset.i, 1); return save();
    case 'sc-p-add': {
      const items = R.POUVOIRS.filter((p) => !p.multi).map((p) => ({ label: p.n, sub: [p.nat, p.act].filter(Boolean).join(' · ') }));
      return chooseList('Pouvoir', items, (it) => { n.pouvoirs.push({ n: it.label, r: 4 }); save(); });
    }
    case 'sc-p-del': n.pouvoirs.splice(+b.dataset.i, 1); return save();
    // ---- combat en cours ----
    case 'sc-live':
      if (!sc.live) startLive(sc);
      if (!s.impro && !sc.done) s.cur = sc.id;
      ui.live = sc.id; localStorage.setItem('insmv.live', sc.id); ui.mjSec = 'combat'; localStorage.setItem('insmv.mjsec', 'combat'); scen.save(s); render(); return window.scrollTo(0, 0);
    case 'lv-back': ui.live = null; localStorage.removeItem('insmv.live'); render(); return window.scrollTo(0, 0);
    case 'lv-round': sc.live.round = Math.max(1, sc.live.round + +b.dataset.v); return save();
    case 'lv-end':
      if (s.impro) {
        if (!(await confirmDlg('Terminer le combat', 'Effacer ce combat improvisé (adversaires, PF, blessures, initiative) ? Les types ajoutés à ton bestiaire sont conservés.'))) return;
        s.scenes = s.scenes.filter((x) => x !== sc);
        if (!s.scenes.length) { scen.remove(s.id); ui.scenId = null; localStorage.removeItem('insmv.scen'); ui.live = null; localStorage.removeItem('insmv.live'); render(); return; }
      } else if (!(await confirmDlg('Terminer le combat', 'Effacer le suivi de ce combat (PF, blessures, initiative) ? Les PNJ préparés sont conservés et le combat pourra être relancé.'))) return;
      sc.live = null; ui.live = null; localStorage.removeItem('insmv.live'); return save();
    case 'lv-add':
      return chooseList(sc.live.units.length ? 'Renfort' : 'Adversaires', [
        { quick: true, label: 'PNJ rapide', sub: 'Ange, démon, psionique, héros païen, humain ou créature type' },
        ...sc.npcs.map((x) => ({ x, label: x.nom, sub: [x.source, 'déjà dans la scène'].filter(Boolean).join(' · ') })),
        ...typeItems((t) => sc.npcs.some((x) => x.typeId === t.id)),
      ], async (it) => {
        if (it.quick) { const p = await askQuickNpc(); if (!p) return; p.qty = 0; sc.npcs.push(p); it = { x: p, label: p.nom }; }
        if (it.book) it.t = scen.adoptBook(it.t);
        const q = await askQty(it.label); if (!q) return;
        let x = it.x;
        if (!x) { x = scen.instantiate(it.t.id, 0); x.qty = 0; sc.npcs.push(x); }
        const st = npcStats(x); const same = sc.live.units.filter((u) => u.npc === x.id).length;
        for (let k = 1; k <= q; k++) sc.live.units.push({ uid: newNpc().id, npc: x.id, label: `${x.nom} ${same + k}`, pf: st.pf, pp: st.pp, bl: [], out: false });
        x.qty = (+x.qty || 0) + (it.x && !it.quick ? 0 : q);
        save();
      });
  }
  if (['lv-init', 'lv-iadd', 'lv-igo', 'lv-iroll', 'lv-iset', 'lv-imove', 'lv-idel', 'lv-inext'].includes(act)) return sc?.live ? initAction(act, b, s, sc) : undefined;
  if (!act.startsWith('lv-') || !sc?.live) return;
  const { u, n: un, st, c } = liveCtx(s, sc, b.dataset.u); if (!u || !un) return;
  const i = +b.dataset.i;
  switch (act) {
    case 'lv-pf': u.pf = Math.min(st.pf, u.pf + +b.dataset.v); return save();
    case 'lv-pp': u.pp = Math.max(0, Math.min(st.pp, u.pp + +b.dataset.v)); return save();
    case 'lv-out': u.out = !u.out; return save();
    case 'lv-hit': return lvHit(s, sc, u, un);
    case 'lv-wclose': u.bl[i].ouverte = false; return save();
    case 'lv-wdel': { const w = u.bl.splice(i, 1)[0]; if (w?.ouverte) u.pf = Math.min(st.pf, u.pf + R.BLESSURES[w.g].pf); return save(); }
    case 'lv-attack': return npcAttack(u, un, un.armes[i]);
    case 'lv-roll': {
      const k = b.dataset.k;
      if (k === 'def') return openRoll({ label: `${u.label} — Défense`, r: un.def, char: c, kind: 'defense', after: (res) => `MR de défense <b>${res.mr}</b> à retrancher à celle de l'attaquant.` });
      return openRoll({ label: `${u.label} — ${R.caracName(c, b.dataset.key)}`, r: un.car[b.dataset.key], char: c });
    }
    case 'lv-pow': {
      const p = un.pouvoirs[i]; const d = R.powerDef(p.n) || {}; const par = d.parent ? R.powerDef(d.parent) : null; const cost = ppCostOf(d.act || par?.act);
      if (cost && st.pp) {
        if (u.pp < cost) toast(`${u.label} n'a plus assez de PP (${u.pp}/${cost})`);
        else { u.pp -= cost; scen.save(s); toast(`${p.n} : –${cost} PP (reste ${u.pp})`); }
      }
      if (!p.r) return render();
      return openRoll({ label: `${u.label} — ${p.n}`, r: p.r, char: c });
    }
  }
}

function mjCharById(id) { return table.characters().find((x) => x.id === id); }
function attackRoll(c, w, char) {
  const fo = effFo(c); const wf = weaponFx(c, w); const puis = (+w.puis || 0) + wf.puis;
  return openRoll({ label: 'Attaque : ' + w.n, r: weaponLevel(c, w), prec: (+w.prec || 0) + wf.prec, char, kind: 'attaque', sits: weaponSits(w),
    fx: [...wf.list, ...wf.force].map((f) => ({ n: f.n, txt: [f.prec ? `précision +${f.prec}` : '', f.puis ? `puissance +${f.puis}` : '', f.force ? `Force +${f.force} rang(s)` : ''].filter(Boolean).join(', ') })), after: (res) => {
    const dmg = res.mr + puis + (w.melee ? fo : 0);
    return `Dommages : <b style="font-size:20px;color:#fff">${dmg}</b> <span class="muted">(MR ${res.mr} + puissance ${sgn(puis)}${w.melee ? ' + Force ' + fo : ''})</span>${/multiple/i.test(w.q || '') ? '<br><small>Arme multiple : 2 coups sur un double, 3 sur un triple (+4 par coup supplémentaire)</small>' : ''}`;
  } });
}
async function mjAction(act, b) {
  const key = b.dataset.key;
  try {
    switch (act) {
      case 'mj-enter': return enterMJ();
      case 'mj-alea-kind': ui.aleaKind = b.dataset.v; return render();
      case 'mj-alea-roll': {
        const t = TABLES_MJ.find((x) => x.id === key); if (!t) return;
        const v = rollTable(t, +(ui.aleaMod?.[t.id]) || 0);
        (ui.aleaRes ||= {})[t.id] = { v, row: tableRow(t, v) }; return render();
      }
      case 'mj-alea-note': {
        const t = TABLES_MJ.find((x) => x.id === key); const r = ui.aleaRes?.[key]; if (!t || !r) return;
        return memoDialog(newEntry({ kind: 'choix', txt: `${t.nom}${['liste', 'd26'].includes(t.de) ? '' : ` (${r.v})`} : ${r.row?.t || ''}` }));
      }
      case 'mj-cb-open': case 'mj-cb-impro': {
        let s = scen.get(b.dataset.sid); let sc = curScene(s, b.dataset.scene);
        if (act === 'mj-cb-impro') {
          s = scen.all().find((x) => x.impro);
          if (!s) { s = scen.create('Combats improvisés'); s.impro = true; s.scenes = []; s.resume = 'Combats lancés depuis l’onglet Combat sans préparation.'; }
          const d = new Date();
          sc = newScene(`Combat du ${d.toLocaleDateString('fr-FR')} à ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`);
          s.scenes.push(sc);
        }
        if (!sc) return;
        if (!sc.live) startLive(sc);
        if (!s.impro && !sc.done) s.cur = sc.id;
        scen.save(s);
        ui.scenId = s.id; ui.live = sc.id; ui.npcEdit = null; localStorage.setItem('insmv.scen', s.id); localStorage.setItem('insmv.live', sc.id);
        render(); return window.scrollTo(0, 0);
      }
      case 'mj-sec': ui.mjSec = b.dataset.v; ui.npcEdit = null; localStorage.setItem('insmv.mjsec', ui.mjSec); render(); return window.scrollTo(0, 0);
      case 'mj-cloud': return cloudDialog();
      case 'mj-exit': ui.screen = 'perso'; localStorage.setItem('insmv.screen', 'perso'); return render();
      case 'mj-lock': mjLock.lock(); ui.screen = 'perso'; localStorage.setItem('insmv.screen', 'perso'); toast('Mode MJ verrouillé sur cet appareil'); return render();
      case 'mj-create': {
        const name = document.getElementById('mj-name').value.trim();
        if (!name) return toast('Donne un nom à la table');
        const id = await table.create(name);
        toast(`Table créée : code ${id}`); return render();
      }
      case 'mj-add': { const n = await table.add(document.getElementById('mj-code').value); toast(`Table « ${n} » ajoutée`); return render(); }
      case 'mj-open': ui.mjTab = 'vue'; ui.mjChar = null; table.open(key); return render();
      case 'mj-forget': if (await confirmDlg('Oublier la table', 'Retirer cette table de cet appareil ? (Les fiches partagées ne sont pas effacées.)')) table.forget(key); return render();
      case 'mj-close': table.close(); return render();
      case 'mj-retry': table.open(table.openId); return render();
      case 'mj-copy': {
        const code = table.current?.id; if (!code) return;
        try { await navigator.clipboard.writeText(code); toast('Code copié'); } catch { toast('Code : ' + code); }
        return;
      }
      case 'mj-tab': ui.mjTab = b.dataset.v; render(); return window.scrollTo(0, 0);
      case 'mj-vie-note': return memoDialog(newEntry({ kind: 'choix', txt: 'Vie privée : ' + (VIE_HOOKS[key] || ''), pjs: (b.dataset.pjs || '').split('|').filter(Boolean) }));
      case 'mj-char': ui.mjChar = key; ui.mjTab = 'fiche'; render(); return window.scrollTo(0, 0);
      case 'mj-roll': {
        const x = mjCharById(b.dataset.id); if (!x) return;
        const c = x.c; const k = b.dataset.k;
        if (k === 'car') return openRoll({ label: `${c.nom} — ${R.caracName(c, key)}`, r: c.car[key], char: c });
        if (k === 'pow') { const p = c.pouvoirs[+key]; return openRoll({ label: `${c.nom} — ${p.n}`, r: p.r, char: c }); }
        const T = c.tal[key];
        const levels = T?.spe ? [['Général', R.talentLevel(c, key)], [T.spe, R.talentSpe(c, key)]] : null;
        return openRoll({ label: `${c.nom} — ${key}`, r: R.talentLevel(c, key), levels, char: c, kind: key === 'Défense' ? 'defense' : undefined });
      }
      case 'mj-attack': { const x = mjCharById(b.dataset.id); if (x) return attackRoll(x.c, x.c.armes[+key], x.c); return; }
      case 'mj-kick': {
        const x = mjCharById(key);
        if (!(await confirmDlg('Retirer', `Retirer la fiche de ${esc(x?.c.nom || '?')} de la table ? Le joueur pourra la partager à nouveau.`))) return;
        await table.kick(key); ui.mjTab = 'vue'; ui.mjChar = null; return render();
      }
    }
  } catch (e) { toast(errText(e)); }
}
async function tableAction(act, b, c) {
  try {
    if (act === 'table-share') {
      const code = document.getElementById('table-code').value;
      const name = await table.share(c, code);
      store.save(); render(); return toast(`Fiche partagée avec « ${name} »`);
    }
    if (act === 'table-push') { await table.push(c); store.save(); render(); return toast('Fiche envoyée au MJ'); }
    if (act === 'table-stop') {
      if (!(await confirmDlg('Arrêter le partage', 'Le MJ ne verra plus cette fiche. Continuer ?'))) return;
      await table.unshare(c); store.save(); return render();
    }
    if (act === 'table-private') { c.notesPrivees = b.checked; store.save(); table.schedule(c, () => store.save()); }
  } catch (e) { c.tableErr = errText(e); toast(errText(e)); render(); }
}
table.onChange(() => {
  if (ui.screen !== 'mj' || dlg.open) return;
  const a = document.activeElement;
  if (a && (a.tagName === 'TEXTAREA' || a.tagName === 'INPUT') && $app.contains(a)) return; // ne pas interrompre une saisie
  render();
});

// ================= Évènements =================
document.addEventListener('click', async (e) => {
  if (dlg.open && dlg.contains(e.target)) return handleDlgClick(e);
  const tabBtn = e.target.closest('[data-tab]');
  if (tabBtn) { ui.tab = tabBtn.dataset.tab; localStorage.setItem('insmv.tab', ui.tab); render(); window.scrollTo(0, 0); return; }
  const b = e.target.closest('[data-act]'); if (!b) return;
  const act = b.dataset.act; const c = C();
  if (act.startsWith('mj-')) return mjAction(act, b);
  if (act.startsWith('table-')) return tableAction(act, b, c);
  if (act.startsWith('sc-') || act.startsWith('lv-')) return scenAction(act, b);
  const i = +b.dataset.i; const key = b.dataset.key;
  switch (act) {
    case 'new': return startGenerator();
    case 'import': return importFile();
    case 'chars': return charsDialog();
    case 'menu': return menuDialog();
    case 'freeroll': return freeRoll();
    case 'sync': return store.sync({ interactive: true });
    case 'help': return helpDialog(b.dataset.v);
    case 'mode': {
      dialog('Mode de la fiche', Object.entries(MODES).map(([k, m]) => `<button class="choice ${ui.mode === k ? 'on' : ''}" data-dact="setmode" data-v="${k}">${icon(m.icon)}<span><b>${m.label === 'PA' ? 'Progression (PA)' : m.label === 'Jeu' ? 'Jeu' : 'Libre'}</b><small>${m.desc}</small></span></button>`).join(''));
      return;
    }
    case 'talf': ui.talFilter = b.dataset.v; return render();
    case 'inc': return adjust(b.dataset.k, b.dataset.k === 'multi' ? +key : key, 1);
    case 'dec': return adjust(b.dataset.k, b.dataset.k === 'multi' ? +key : key, -1);
    case 'buy': return buy(b.dataset.k, ['multi', 'pow'].includes(b.dataset.k) ? +key : key, b.dataset.sub);
    case 'roll-car': return openRoll({ label: R.caracName(c, key), r: c.car[key] });
    case 'roll-tal': {
      const t = c.tal[key];
      const levels = t?.spe ? [['Général', R.talentLevel(c, key)], [t.spe, R.talentSpe(c, key)]] : null;
      return openRoll({ label: key, r: R.talentLevel(c, key), levels, kind: key === 'Défense' ? 'defense' : undefined });
    }
    case 'roll-multi': { const m = c.multi[i]; return openRoll({ label: `${m.t} (${m.label})`, r: 2 + m.r }); }
    case 'spe': {
      if (ui.mode === 'normal') return;
      const t = (c.tal[key] ||= { r: 0 });
      const v = await ask(key, 'Spécialité (vide pour retirer)', t.spe || '');
      if (v === null) return;
      if (v.trim()) { t.spe = v.trim(); t.sr = Math.max(+t.sr || 0, +t.r || 0); } else { delete t.spe; delete t.sr; }
      return commit();
    }
    case 'multi-edit': {
      if (ui.mode === 'normal') return;
      const v = await ask(c.multi[i].t, 'Intitulé (vide pour supprimer)', c.multi[i].label);
      if (v === null) return;
      if (!v.trim()) c.multi.splice(i, 1); else c.multi[i].label = v.trim();
      return commit();
    }
    case 'add-exo': {
      const items = R.TALENTS.filter((t) => (t.cat === 'e' || t.cat === 'psi') && !c.tal[t.n]).map((t) => ({ label: t.n, sub: (R.TALENT_INFO[t.n] || (t.cat === 'psi' ? R.PSI_POUVOIRS[t.n].join(', ') : '')) }));
      return chooseList('Talent exotique', items, (it) => { c.tal[it.label] = { r: 0 }; commit(); });
    }
    case 'add-multi': { const v = await ask(b.dataset.v, 'Intitulé'); if (v) { c.multi.push({ t: b.dataset.v, label: v, r: isProg() ? 0 : 0 }); commit(); } return; }
    case 'add-lang': {
      const v = await ask('Langue', 'Langue');
      if (!v) return;
      if (isProg()) { // une langue = un rang secondaire
        const av = (+c.pa.total || 0) - (+c.pa.spent || 0);
        if (c.secCredit > 0) { c.secCredit--; c.pa.log.push({ t: Date.now(), cost: 0, credit: -1, kind: 'lang', label: 'Langue : ' + v }); }
        else if (av >= 1) { c.pa.spent++; c.secCredit = (c.secCredit || 0) + 1; c.pa.log.push({ t: Date.now(), cost: 1, credit: 1, kind: 'lang', label: 'Langue : ' + v }); }
        else return toast('Pas assez de PA');
      }
      c.langues.push(v); return commit();
    }
    case 'lang-del': c.langues.splice(i, 1); return commit();
    // ---- combat ----
    case 'pf': c.pfCur = (c.pfCur ?? R.annexes(c).pf) + +b.dataset.v; return commit();
    case 'pp': c.ppCur = Math.max(0, Math.min(R.ppMax(c) + 20, (c.ppCur ?? R.ppMax(c)) + +b.dataset.v)); return commit();
    case 'pf-full': c.pfCur = R.annexes(c).pf; return commit();
    case 'pp-full': c.ppCur = R.ppMax(c); return commit();
    case 'pp-1': c.ppCur = Math.min(R.ppMax(c), (c.ppCur ?? 0) + 1); return commit();
    case 'pp-to-pf': if ((c.ppCur ?? 0) < 1) return toast('Plus de PP'); c.ppCur--; c.pfCur = Math.min(R.annexes(c).pf, (c.pfCur ?? 0) + 1); return commit();
    case 'hit': return hitDialog();
    case 'wound-add': return chooseList('Blessure', Object.entries(R.BLESSURES).map(([g, w]) => ({ g, label: w.n, sub: `–${w.pf} PF` })), (it) => { addWound(it.g); render(); }, { search: false });
    case 'wound-close': c.blessures[i].ouverte = false; return commit();
    case 'wound-del': c.blessures.splice(i, 1); return commit();
    case 'close-pp': {
      const cost = R.GUERISON[c.blessures[i].g][1];
      if ((c.ppCur ?? 0) < cost) return toast(`Il faut ${cost} PP`);
      c.ppCur -= cost; c.blessures[i].ouverte = false; toast('Blessure refermée'); return commit();
    }
    case 'close-med': {
      const g = c.blessures[i].g; const d = { BL: 'facile', BG: 'difficile', BF: 'tres', MS: 'incroyable' }[g];
      openRoll({ label: 'Refermer : Médecine', r: R.talentLevel(c, 'Médecine'), wound: false });
      rollState.diff = d; rollState.after = (res) => { c.blessures[i].ouverte = false; commit(false); return 'Blessure refermée.'; };
      return showRoll();
    }
    case 'attack': return attackRoll(c, c.armes[i]);
    case 'defense': return openRoll({ label: 'Défense', r: R.talentLevel(c, 'Défense'), kind: 'defense', fx: defFx(c).map((f) => ({ ...f, txt: `Défense ${sgn(f.v)}${f.once ? ' (ce jet)' : ''}` })), after: (res) => `MR de défense <b>${res.mr}</b> à retrancher à celle de l'attaquant.` });
    case 'weapon-add': return weaponDialog();
    case 'weapon-del': c.armes.splice(i, 1); return commit();
    case 'armor-add': return armorDialog();
    case 'armor-del': c.armures.splice(i, 1); return commit();
    case 'armor-toggle': c.armures[i].portee = c.armures[i].portee === false; return commit();
    case 'portrait-pick': return pickPortrait(!!b.dataset.cam);
    case 'vie-pick': { c.vie ||= {}; c.vie.q ||= {}; const k = b.dataset.key; c.vie.q[k] = c.vie.q[k] === b.dataset.v ? '' : b.dataset.v; return commit(); }
    case 'portrait-view': return portraitDialog();
    case 'fx-off': c.effets = (c.effets || []).filter((e) => e.n !== key); return commit();
    case 'weapon-hand': c.armes[i].main = c.armes[i].main === false; return commit();
    case 'go-sac': ui.tab = 'sac'; localStorage.setItem('insmv.tab', 'sac'); render(); return window.scrollTo(0, 0);
    case 'sac-add': {
      const n = document.getElementById('sac-new')?.value.trim(); if (!n) return toast('Nom de l’objet ?');
      (c.sac ||= []).push({ n, nb: 1 }); return commit();
    }
    case 'sac-del': c.sac.splice(i, 1); return commit();
    case 'sac-nb': { const it = c.sac[i]; it.nb = Math.max(0, (it.nb ?? 1) + +b.dataset.v); return commit(); }
    // ---- pouvoirs ----
    case 'pow-add': return addPowerDialog();
    case 'pow-del': if (await confirmDlg('Retirer', `Retirer ${esc(c.pouvoirs[i].n)} ?`)) { c.pouvoirs.splice(i, 1); commit(); } return;
    case 'pow-use': {
      const p = c.pouvoirs[i]; const d = R.powerDef(p.n) || R.powerDef(R.powerDef(p.n)?.parent); const cost = ppCostOf(d?.act);
      if ((c.ppCur ?? R.ppMax(c)) < cost) return toast('Pas assez de PP');
      c.ppCur = (c.ppCur ?? R.ppMax(c)) - cost;
      if (POW_FX[p.n]) { c.effets = (c.effets || []).filter((e) => e.n !== p.n); c.effets.push({ n: p.n, at: Date.now() }); }
      commit(); // jauge de PP et effets à jour avant d'ouvrir le test
      toast(`${p.n} : –${cost} PP (reste ${c.ppCur})${POW_FX[p.n] ? ' · effet actif' : ''}`);
      if (p.r && /attaque|test/.test((d?.q || '') + (d?.d || ''))) {
        const psiT = c.type === 'psi' ? Object.entries(R.PSI_POUVOIRS).find(([, l]) => l.includes(p.n))?.[0] : null;
        if (psiT) return openRoll({ label: `${psiT} (activation de ${p.n})`, r: R.talentLevel(c, psiT) });
        return openRoll({ label: p.n, r: p.r });
      }
      return render();
    }
    case 'pow-roll': { const p = c.pouvoirs[i]; return openRoll({ label: p.n, r: p.r }); }
    case 'toggle': ui.open[key] = !ui.open[key]; return render();
    case 'dom': c.gradeDom[key] = Math.max(0, Math.min(6, (+c.gradeDom[key] || 0) + +b.dataset.v)); return commit();
    // ---- carnet ----
    case 'pa-gain': {
      const n = +document.getElementById('pa-gain').value;
      if (!n) return;
      c.pa.total = (+c.pa.total || 0) + n;
      c.pa.log.push({ t: Date.now(), gain: n, label: document.getElementById('pa-why').value || 'PA reçus' });
      return commit();
    }
    case 'pa-undo': return undoPA();
    case 'hier-invoke': return invokeDialog(c);
    case 'hier-rules': return hierRulesDialog(c);
    case 'hier-reward': {
      const d = d66(); const row = d66Row(HIERARCHIE.recompenses.table, d);
      return dialog(`Récompense : ${d}`, `<p>${esc(row?.effet || '—')}</p><p class="small muted">${esc(HIERARCHIE.recompenses.table_note || '')} C'est le MJ qui accorde la récompense et en fixe le coût en PA.</p>`);
    }
    case 'hier-avert': {
      const d = d66(); const row = d66Row(HIERARCHIE.avertissements.table, d); if (!row) return;
      c.limitations.push({ k: 'Avertissement', txt: `${row.effet} (d66 : ${d})` }); toast(`Avertissement (${d}) : ${row.effet.split(' :')[0]}`); return commit();
    }
    case 'hier-blame': {
      const sup = R.supByName(c.superieur); const b = SUP_HIER[sup?.n]?.blames; if (!b) return;
      const d = 1 + Math.floor(Math.random() * 6); const txt = b[d - 1] || 'blâme au choix du supérieur (case illisible dans le livre)';
      c.limitations.push({ k: 'Blâme', txt: `${sup.n} (${d}) : ${txt}` }); toast(`Blâme de ${sup.n} (${d})`); return commit();
    }
    case 'lim-add': { const txt = document.getElementById('lim-txt').value.trim(); if (!txt) return; c.limitations.push({ k: document.getElementById('lim-k').value, txt }); return commit(); }
    case 'lim-del': c.limitations.splice(i, 1); return commit();
    // ---- biblio ----
    case 'btab': ui.biblio = b.dataset.v; ui.q = ''; return render();
    case 'only-access': ui.onlyAccess = b.checked; return render();
    // ---- création ----
    case 'crea-done': {
      const w = R.checks(c);
      if (w.length && !(await confirmDlg('Terminer la création', `Le personnage ne respecte pas tout à fait les règles :<br>• ${w.map(esc).join('<br>• ')}<br><br>Terminer quand même (avec l'accord du MJ) ?`))) return;
      c.creation = 'fini'; c.pfCur = R.annexes(c).pf; c.ppCur = R.ppMax(c); ui.mode = 'normal'; commit(); toast('Création terminée'); return;
    }
    case 'crea-cancel':
      if (!(await confirmDlg('Abandonner', 'Supprimer ce personnage en cours de création ?'))) return;
      store.remove(c.id); ui.mode = 'normal'; render(); return;
  }
});

function handleDlgClick(e) {
  if (dlg.onclick) return; // dialogues avec gestion propre
  const r = e.target.closest('[data-ract]');
  if (r && rollState) {
    const s = rollState; const v = +r.dataset.v;
    if (s.spin && r.dataset.ract !== 'close') return; // rouleaux en train de tourner
    switch (r.dataset.ract) {
      case 'close': dlg.close(); rollState = null; return;
      case 'go': return doRoll();
      case 'r': s.r = Math.max(0, s.r + v); break;
      case 'lvl': s.r = v; break;
      case 'diff': s.diff = r.dataset.v; s.opp = false; break;
      case 'sit': {
        const k = r.dataset.v; const on = s.sit.includes(k);
        s.sit = s.sit.filter((x) => x !== k && !(k.startsWith('charge') && x.startsWith('charge'))); // une seule sorte de charge
        if (!on) s.sit.push(k);
        break;
      }
      case 'dstep': { const i = R.DIFFICULTES.findIndex((d) => d.k === s.diff) + v; if (R.DIFFICULTES[i]) s.diff = R.DIFFICULTES[i].k; break; }
      case 'adj': s.adjOpen = !s.adjOpen; return showRoll(); // n'efface pas le résultat affiché
      case 'opp': s.opp = !s.opp; break;
      case 'oppR': s.oppR = Math.max(0, s.oppR + v); break;
      case 'shift': s.shift += v; break;
      case 'risk': s.risk = Math.max(0, Math.min(R.lvlInt(s.r), s.risk + v)); break;
      case 'wound': s.wound = !s.wound; break;
    }
    s.result = null;
    return showRoll();
  }
  const d = e.target.closest('[data-dact]'); if (!d) return;
  const c = C();
  switch (d.dataset.dact) {
    case 'close': return closeDlg();
    case 'sel': store.select(d.dataset.id); closeDlg(); ui.mode = 'normal'; ui.screen = 'perso'; localStorage.setItem('insmv.screen', 'perso'); return render();
    case 'mjt': closeDlg(); return enterMJ({ table: d.dataset.id });
    case 'mjhome': closeDlg(); if (store.configured && table.openId) table.close(); ui.mjSec = 'joueurs'; localStorage.setItem('insmv.mjsec', 'joueurs'); return enterMJ();
    case 'mjquit': closeDlg(); ui.screen = 'perso'; localStorage.setItem('insmv.screen', 'perso'); return render();
    case 'newin': closeDlg(); return startGenerator(d.dataset.id);
    case 'new': closeDlg(); return startGenerator();
    case 'export1': closeDlg(); return download((c.nom || 'personnage').replace(/\W+/g, '_') + '.json', store.exportOne(c));
    case 'exportAll': closeDlg(); return download('insmv-personnages.json', store.exportAll());
    case 'import': closeDlg(); return importFile();
    case 'print': closeDlg(); return printSheet();
    case 'portrait-change': closeDlg(); return pickPortrait(false);
    case 'portrait-cam': closeDlg(); return pickPortrait(true);
    case 'portrait-del':
      closeDlg();
      return confirmDlg('Retirer le portrait', 'Retirer l’image de ce personnage ?').then((ok) => { if (ok) { delete c.portrait; delete c.portraitMini; commit(); } });
    case 'slot': slot.setSlot(!slot.slotPref()); toast(slot.slotPref() ? 'Bandit manchot activé' : 'Dés classiques'); return menuDialog();
    case 'sound': slot.setSound(!slot.soundOn()); toast(slot.soundOn() ? 'Son des dés activé' : 'Son des dés coupé'); if (slot.soundOn()) { slot.sfx.unlock(); slot.sfx.win(); } return menuDialog();
    case 'recrea': closeDlg(); c.creation = 'crea'; return commit();
    case 'cloud': return cloudDialog();
    case 'cfgsave': try { store.setFirebaseConfig(dlg.querySelector('#fbcfg').value); closeDlg(); store.sync({ interactive: true }); render(); } catch (err) { toast(err.message); } return;
    case 'logout': store.disconnect(); return closeDlg();
    case 'setmode': ui.mode = d.dataset.v; closeDlg(); return render();
    case 'delete':
      closeDlg();
      confirmDlg('Supprimer', `Supprimer définitivement ${esc(c.nom)} ?`).then((ok) => { if (ok) { if (c.table) table.unshare(c); store.remove(c.id); render(); } });
      return;
    case 'mj': closeDlg(); return enterMJ();
  }
}
dlg.addEventListener('close', () => { if (!dlg.open) rollState = null; });

// Champs de formulaire (carnet)
document.addEventListener('change', (e) => {
  const el = e.target;
  if (dlg.contains(el)) return;
  if (el.id === 'mj-note') { table.setNote(el.dataset.key, el.value); return; }
  if (el.id === 'memo-pj' || el.id === 'memo-scen') { ui.memoF[el.id.slice(5)] = el.value; return render(); }
  if (el.id === 'alea-camp') { ui.aleaCamp = el.value; return render(); }
  if (el.id === 'mj-camp') { table.setCamp(el.value); ui.aleaCamp = undefined; return render(); }
  if (el.id === 'alea-sup') { ui.aleaSup = el.value; return render(); }
  if (el.dataset.aleaMod) { (ui.aleaMod ||= {})[el.dataset.aleaMod] = el.value; return; }
  if (el.dataset.lvname) { const s = scen.get(ui.scenId); const sc = curScene(s, el.dataset.lvname); if (sc) { sc.nom = el.value.trim() || sc.nom; scen.save(s); } return; }
  if (el.closest('[data-scform]')) return scenChange(el);
  if (el.dataset.sac != null) { const c = C(); const it = c?.sac?.[+el.dataset.sac]; if (it) { it.n = el.value.trim() || it.n; commit(false); } return; }
  const form = el.closest('[data-form]'); if (!form || !el.name) return;
  const c = C(); let v = el.value;
  if (el.name.startsWith('identite.')) c.identite[el.name.slice(9)] = v;
  else if (el.name === 'vie.bg') { (c.vie ||= {}).bg = v; return commit(false); }
  else if (el.name === 'type') { c.type = v; c.tier = 0; c.chance = !!R.TYPES[v].chance; }
  else if (['tier', 'grade'].includes(el.name)) c[el.name] = +v;
  else if (el.name === 'chance' || el.name === 'apostat') c[el.name] = v === '1';
  else c[el.name] = v;
  commit(['type', 'tier', 'grade', 'superieur', 'chance', 'apostat', 'nom'].includes(el.name));
});
document.addEventListener('input', (e) => {
  if (e.target.id === 'vie-q') {
    ui.vieQ = e.target.value; const pos = e.target.selectionStart; render();
    const n = document.getElementById('vie-q'); if (n) { n.focus(); n.setSelectionRange(pos, pos); }
    return;
  }
  if (e.target.id === 'bq') {
    ui.q = e.target.value; const pos = e.target.selectionStart; render();
    const n = document.getElementById('bq'); if (n) { n.focus(); n.setSelectionRange(pos, pos); }
  }
  if (e.target.id === 'alea-q') {
    ui.aleaQ = e.target.value; const pos = e.target.selectionStart; render();
    const n = document.getElementById('alea-q'); if (n) { n.focus(); n.setSelectionRange(pos, pos); }
  }
  if (e.target.dataset?.aleaMod) (ui.aleaMod ||= {})[e.target.dataset.aleaMod] = e.target.value;
});

store.onStatus((s, info) => {
  if (info?.reloaded || (!C() && !dlg.open)) { render(); if (s.state === 'error' || s.state === 'synced') toast(s.message); return; }
  if (s.state === 'error') toast(s.message);
  { const el = document.querySelector('.sync'); if (el) el.className = 'sync ' + s.state; } });
render();
if (store.configured) store.sync();
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => {});
