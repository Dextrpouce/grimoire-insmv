import * as R from './rules.js';
import { store } from './store.js';
import { table, errText } from './table.js';
import { scen, newNpc, newScene, npcChar, npcStats, gravite, npcFromCharacter, startLive, BOOK } from './scenario.js';

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
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  undo: '<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13 7l4 4"/>',
  check: '<path d="M5 12l5 5L20 7"/>',
  cloud: '<path d="M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 9.5 4.3 4.3 0 0 0 7 18z"/>',
  heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
};
const icon = (n) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]}</svg>`;
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
  screen: localStorage.getItem('insmv.screen') || 'perso', // perso | mj
  mjTab: 'vue', mjChar: null,
  mjSec: localStorage.getItem('insmv.mjsec') || (store.configured ? 'table' : 'scen'), // table | scen
  scenId: localStorage.getItem('insmv.scen') || null, npcEdit: null, // { scene, npc }
  live: localStorage.getItem('insmv.live') || null, // id de la scène dont le combat est affiché
};
const TABS = [['fiche', 'Fiche', 'sheet'], ['combat', 'Combat', 'sword'], ['pouvoirs', 'Pouvoirs', 'wing'], ['carnet', 'Carnet', 'folder'], ['biblio', 'Biblio', 'book']];
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
    <div class="who"><h1>${esc(c.nom || 'Sans nom')}</h1><div class="sub">${esc(sub)}</div></div>
    ${store.configured ? `<button class="ibtn" data-act="sync" title="${esc(store.status.message)}"><span class="sync ${st}"></span></button>` : ''}
    <button class="ibtn" data-act="freeroll" title="Lancer les dés">${icon('die')}</button>
    ${ui.mode === 'crea' ? '<span class="mode-btn crea">Création</span>' : `<button class="mode-btn ${ui.mode}" data-act="mode">${icon(MODES[ui.mode].icon)}${MODES[ui.mode].label}</button>`}
    <button class="ibtn" data-act="menu" title="Menu">${icon('dots')}</button>
  </header>
  <main>${renderBudget(c)}${renderTab(c)}</main>
  <nav class="tabs">${TABS.map(([k, l, ic]) => `<button class="${ui.tab === k ? 'on' : ''}" data-tab="${k}">${icon(ic)}${l}</button>`).join('')}</nav>`;
}

function renderHome() {
  return `<div class="home">
    <img class="cover" src="img/cover.webp" alt="In Nomine Satanis / Magna Veritas">
    <h1>Grimoire INS/MV</h1>
    <p class="muted d">Feuille de personnage et générateur pour In Nomine Satanis / Magna Veritas, 4<sup>e</sup> édition.</p>
    <div class="row" style="justify-content:center;margin-top:14px">
      <button class="btn pri" data-act="new">${icon('plus')} Créer un personnage</button>
      <button class="btn" data-act="import">Importer un fichier</button>
    </div>
    <div style="margin-top:10px"><button class="btn dark" style="border:1px solid #4a4a55" data-act="mj-enter">${icon('book')} Mode maître de jeu</button></div>
    ${store.configured ? `<div style="margin-top:12px"><button class="btn ghost" style="color:var(--on-dark);border-color:#4a4a55" data-act="sync">${icon('cloud')} Récupérer mes personnages (compte Google)</button>
      <p class="small muted d">${store.status.state === 'needauth' ? 'Tes personnages créés sur un autre appareil apparaîtront ici après connexion.' : esc(store.status.message || '')}</p></div>` : ''}
    <div class="row" style="justify-content:center;margin-top:24px;gap:24px">
      <img src="img/mv.webp" style="width:min(300px,42vw);border-radius:8px" alt="Magna Veritas">
      <img src="img/ins.webp" style="width:min(300px,42vw);border-radius:8px" alt="In Nomine Satanis">
    </div>
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
    case 'pouvoirs': return renderPouvoirs(c);
    case 'carnet': return renderCarnet(c);
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
  const weapons = c.armes.map((w, i) => {
    const tl = weaponLevel(c, w);
    return `<div class="trow">
      <div class="tn"><b>${esc(w.n)}</b><br><small>${esc(w.talent)}${w.spe ? ' (' + esc(w.spe) + ')' : ''} ${L(tl)} · précision ${sgn(+w.prec || 0)} · puissance ${sgn(+w.puis || 0)}${w.melee ? ` + Force ${fo}` : ''}${w.q ? ' · ' + esc(w.q) : ''}</small></div>
      <button class="btn sm pri" data-act="attack" data-i="${i}">Attaquer</button>
      ${ui.mode !== 'normal' ? `<button class="ibtn" style="width:32px;height:32px" data-act="weapon-del" data-i="${i}">${icon('trash')}</button>` : ''}
    </div>`;
  }).join('');
  return `
  <section class="card">
    <h2>État <span class="tag">${malus ? `malus des blessures ouvertes ${malus} col.` : 'aucun malus'}</span></h2>
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
    ${weapons || '<div class="empty">Aucune arme</div>'}
    <div class="row" style="margin-top:8px">
      <button class="btn pri" data-act="defense">Se défendre</button>
      <button class="btn" data-act="weapon-add">${icon('plus')} Arme</button>
    </div>
    <p class="small muted" style="margin-bottom:0">Attaque et défense : test résisté. Si la défense réussit, sa MR est retranchée à celle de l'attaquant ; le coup porte si la MR finale est positive ou nulle. <b>Niveau de dommage</b> = MR finale + puissance de l'arme (+ Force au contact) – protection.</p>
  </section>

  <section class="card">
    <h2>Protections <span class="tag">armure portée : ${prot}</span></h2>
    ${c.armures.map((x, i) => `<div class="trow"><div class="tn"><b>${esc(x.n)}</b><br><small>${esc(x.q || '')}${x.fmin ? ' · Force min. ' + esc(x.fmin) : ''}</small></div>
      <div class="tl">${x.p}</div>
      <button class="btn sm ${x.portee === false ? '' : 'dark'}" data-act="armor-toggle" data-i="${i}">${x.portee === false ? 'Rangée' : 'Portée'}</button>
      <button class="ibtn" style="width:32px;height:32px" data-act="armor-del" data-i="${i}">${icon('trash')}</button></div>`).join('') || '<div class="empty">Aucune</div>'}
    <div class="row" style="margin-top:8px"><button class="btn" data-act="armor-add">${icon('plus')} Armure ou bouclier</button></div>
  </section>

  <section class="card">
    <h2>Modificateurs</h2>
    <table class="ref">${R.MODIFS_ATTAQUE.map(([a2, b]) => `<tr><td>${a2}</td><td>${b}</td></tr>`).join('')}</table>
    <p class="small muted" style="margin-bottom:0">Main gauche (Ag 3) : +1 Combat, +1 Défense, –1 puissance. Deux armes (Fo 3) : +1 Combat, +1 puissance, –1 Défense. Arme à deux mains tenue à une main (Fo 4) : –1 puissance. Talent inférieur à 2 : une attaque tous les deux tours.</p>
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
      <div class="row" style="margin-top:6px">
        ${!t.nopp && pp ? `<button class="btn sm pri" data-act="pow-use" data-i="${i}">Activer (${pp} PP)</button>` : ''}
        ${!inv ? `<button class="btn sm" data-act="pow-roll" data-i="${i}">Test de pouvoir</button>` : ''}
        <button class="btn sm ghost" data-act="toggle" data-key="p${i}">${open ? 'Masquer' : 'Description'}</button>
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
    ${isEdit() || isProg() ? `<div class="row"><button class="btn" data-act="pow-add">${icon('plus')} Ajouter un pouvoir</button></div>` : ''}
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
function renderCarnet(c) {
  const t = R.typeOf(c); const sup = R.supByName(c.superieur);
  const id = c.identite;
  const locked = ui.mode === 'normal';
  const supOpts = [['', '— aucun —'], ...R.SUPERIEURS.filter((s) => s.camp === t.camp || t.camp === 'neutre').map((s) => [s.n, s.n + ' — ' + s.titre + (s.src === 'dudule' ? ' (Dudule)' : '')])];
  const av = (+c.pa.total || 0) - (+c.pa.spent || 0);
  return `
  <section class="card">
    <h2>Identité</h2>
    <div class="grid g2" data-form="id">
      ${F.text('nom', 'Nom', c.nom, 'full')}
      ${F.text('identite.corps', 'Corps d\'accueil / identité humaine', id.corps)}
      ${F.text('identite.age', 'Âge apparent', id.age)}
      ${F.text('identite.metier', 'Métier / couverture', id.metier)}
      ${F.text('identite.contact', 'Contact', id.contact)}
      ${F.area('identite.apparence', 'Apparence, personnalité', id.apparence)}
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
    </div>` : ''}
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
    <p class="small muted" style="margin-bottom:0">L'administration ne communique jamais le total de PA : c'est le MJ qui les distribue. Passer en mode « PA » (bouton en haut) pour les dépenser.</p>
  </section>` : ''}
  ${renderTableCard(c)}
  <section class="card">
    <h2>Limitations</h2>
    ${c.limitations.map((l, i) => `<div class="trow"><div class="tn"><span class="badge ${l.k === 'Blâme' ? 'no' : ''}">${esc(l.k)}</span> ${esc(l.txt)}</div><button class="ibtn" style="width:30px;height:30px" data-act="lim-del" data-i="${i}">${icon('x')}</button></div>`).join('') || '<div class="empty">Aucune</div>'}
    <div class="row" style="margin-top:8px"><select class="inp" id="lim-k" style="max-width:150px"><option>Avertissement</option><option>Blâme</option><option>Mesure disciplinaire</option></select><input class="inp" id="lim-txt" style="flex:1;min-width:140px" placeholder="Description"><button class="btn" data-act="lim-add">Ajouter</button></div>
  </section>
  <section class="card">
    <h2>Possessions et notes</h2>
    <div class="grid" data-form="id">${F.area('possessions', 'Possessions, planques, contacts, ressources', c.possessions)}${F.area('notes', 'Notes', c.notes)}</div>
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
        return `<div class="pow"><div class="ph"><div class="pn">${esc(p.n)}</div><span class="small muted">${R.powerUnitCost(c, p)} PA${p.a?.inv ? '' : '/rang'}</span>
          <button class="btn sm ghost" data-act="toggle" data-key="b${esc(p.n)}">${open ? '–' : '+'}</button></div>
          <div class="meta"><span class="badge ${p.nat}">${p.nat}</span>${esc(p.act)} · <i>${esc(accessTxt(p))}</i>${p.q && p.q !== '—' ? ' · ' + esc(p.q) : ''}</div>
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
  return o.join(', ') + (o.length && !a.inv ? ' PA/rang' : ' PA');
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
  <h3>Grades</h3><table class="ref"><tr><th>Grade</th><th>Caracs</th><th>Talents</th><th>Pouvoirs</th><th>PP</th></tr>${R.GRADES.map((g) => `<tr><td>${g.g}</td><td>${L(g.car)}</td><td>${L(g.tal)}</td><td>${L(g.pow)}</td><td>${g.pp}</td></tr>`).join('')}</table>`;
}

// ================= Lanceur de dés =================
let rollState = null;
const NOBODY = { type: 'humain', car: { fo: 4, ag: 4, pe: 4, vo: 4, pr: 4, foi: 4 }, blessures: [] }; // lancer sans personnage (écran MJ)
function openRoll(opts) {
  const c = C();
  rollState = {
    label: opts.label, r: opts.r ?? 4, levels: opts.levels || null, shift: 0, diff: 'difficile', risk: 0, prec: opts.prec || 0,
    opp: false, oppR: 4, wound: opts.wound !== false, result: null, after: opts.after || null, free: !!opts.free, kind: opts.kind || 'test',
    char: opts.char || null,
  };
  if (rollState.levels) rollState.r = rollState.levels[rollState.levels.length - 1][1];
  showRoll();
}
function showRoll() {
  const s = rollState; const c = s.char || C() || NOBODY;
  const malus = s.wound ? R.woundMalus(c) : 0;
  const diff = R.DIFFICULTES.find((d) => d.k === s.diff);
  const totalShift = (diff.s || 0) + s.shift + s.prec + malus;
  let seuilInfo;
  if (s.opp) seuilInfo = R.seuilOppose(s.r + s.shift + s.prec + malus - s.oppR, s.risk);
  else if (s.diff === 'triviale') seuilInfo = 66;
  else if (s.diff === 'impossible') seuilInfo = null;
  else seuilInfo = R.seuilStandard(s.r, totalShift, s.risk).seuil;
  const res = s.result;
  let out = '';
  if (res) {
    const cls = res.divin && (res.ok !== undefined) && (res.divin === 'unique' ? R.typeOf(c).camp === 'ange' : R.typeOf(c).camp === 'demon') ? 'divin' : res.ok ? 'ok' : 'ko';
    out = `<div class="dice">${res.dice.map((d, i) => `<div class="die roll ${['', 'd2', 'u'][i]}">${d}</div>`).join('')}</div>
      <div class="verdict ${cls}">${res.divin === 'unique' ? '111 — Dieu s\'en mêle ! ' : res.divin === 'bete' ? '666 — le Nombre de la Bête ! ' : ''}${res.ok ? 'Réussite' : 'Échec'}</div>
      <div class="vsub">Résultat ${res.res} / seuil ${res.seuil ?? '×'} · RU ${res.ru}${res.triple ? ' · TRIPLE' : res.double ? ' · double' : ''}</div>
      <div class="vsub" style="color:#fff;font-size:17px;margin-top:4px">${res.ok ? `MR <b>${res.mr}</b> — ${R.MR_TXT(res.mr)}` : R.ECHEC_TXT(res.ru)}</div>
      ${res.ok && s.after ? `<div class="vsub" style="margin-top:6px">${s.after(res)}</div>` : ''}`;
  }
  const lvlSel = s.levels ? `<div class="seg" style="margin-bottom:8px">${s.levels.map(([lab, r]) => `<button class="${s.r === r ? 'on' : ''}" data-ract="lvl" data-v="${r}">${esc(lab)} ${L(r)}</button>`).join('')}</div>` : '';
  dlg.innerHTML = `<div class="dlg-h"><h2>${esc(s.label)}</h2><button class="ibtn" data-ract="close">${icon('x')}</button></div>
  <div class="dlg-b">
    ${lvlSel}
    <div class="row"><span>Niveau</span><span class="stepper"><button data-ract="r" data-v="-1">–</button><b>${L(s.r)}</b><button data-ract="r" data-v="1">+</button></span>
      <span class="spacer"></span><span>Seuil <b style="font-size:22px">${seuilInfo ?? '×'}</b></span></div>
    <div class="list-h">Difficulté</div>
    <div class="seg">${R.DIFFICULTES.map((d) => `<button class="${s.diff === d.k && !s.opp ? 'on' : ''}" data-ract="diff" data-v="${d.k}">${d.n}</button>`).join('')}<button class="${s.opp ? 'on' : ''}" data-ract="opp">Opposé</button></div>
    ${s.opp ? `<div class="row" style="margin-top:8px"><span>Niveau adverse</span><span class="stepper"><button data-ract="oppR" data-v="-1">–</button><b>${L(s.oppR)}</b><button data-ract="oppR" data-v="1">+</button></span></div>` : ''}
    <div class="row" style="margin-top:10px;gap:18px">
      <span>Modificateur <span class="stepper"><button data-ract="shift" data-v="-1">–</button><b>${sgn(s.shift)}</b><button data-ract="shift" data-v="1">+</button></span></span>
      <span>Prise de risque <span class="stepper"><button data-ract="risk" data-v="-1">–</button><b>${s.risk}</b><button data-ract="risk" data-v="1">+</button></span></span>
    </div>
    ${s.prec ? `<div class="small muted" style="margin-top:6px">Précision de l'arme : ${sgn(s.prec)} colonne(s)</div>` : ''}
    ${R.woundMalus(c) ? `<label class="small" style="display:block;margin-top:6px"><input type="checkbox" data-ract="wound" ${s.wound ? 'checked' : ''}> Appliquer le malus des blessures (${R.woundMalus(c)})</label>` : ''}
    ${out}
  </div>
  <div class="dlg-f"><button class="btn pri" data-ract="go">${icon('die')} Lancer d66+6</button></div>`;
  if (!dlg.open) dlg.showModal();
}
function doRoll() {
  const s = rollState; const c = s.char || C() || NOBODY;
  const malus = s.wound ? R.woundMalus(c) : 0;
  const diff = R.DIFFICULTES.find((d) => d.k === s.diff);
  const totalShift = (diff.s || 0) + s.shift + s.prec + malus;
  let seuil, eff;
  if (s.opp) { seuil = R.seuilOppose(s.r + s.shift + s.prec + malus - s.oppR, s.risk); eff = s.r + s.shift + s.prec + malus; }
  else if (s.diff === 'triviale') { seuil = 66; eff = s.r; }
  else if (s.diff === 'impossible') { seuil = null; eff = s.r; }
  else { const x = R.seuilStandard(s.r, totalShift, s.risk); seuil = x.seuil; eff = x.eff; }
  s.result = R.resolve(R.rollD666(), { seuil, mrLevel: R.lvlInt(eff), risk: s.risk, foi: c.car.foi, camp: R.typeOf(c).camp });
  showRoll();
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
      const d = roll({ '1d6': 1, '2d6': 2, d66: 2, d666: 3 }[k]);
      const total = k === '2d6' ? d[0] + d[1] : k === '1d6' ? d[0] : d.join('');
      show('Dés', `<div class="dice">${d.map((x, i) => `<div class="die roll ${['', 'd2', 'u'][i]}">${x}</div>`).join('')}</div><div class="verdict">${k} = ${total}</div>`);
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
  if (!dlg.open) dlg.showModal();
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
  const items = R.POUVOIRS.filter((p) => !p.multi).map((p) => ({
    p, label: p.n, sub: `${R.powerAccessible(c, p) ? '' : '[accès restreint] '}${R.powerUnitCost(c, p)} PA${p.a?.inv ? '' : '/rang'} · ${p.nat} · ${p.act}`,
  })).sort((a, b) => (R.powerAccessible(c, b.p) - R.powerAccessible(c, a.p)) || a.label.localeCompare(b.label, 'fr'));
  chooseList('Ajouter un pouvoir', items, ({ p }) => {
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
  const prot = c.armures.filter((x) => x.portee !== false && !/bouclier/i.test(x.n + x.q)).reduce((s, x) => s + (+x.p || 0), 0);
  dialog('Encaisser un coup', `<div class="grid g2">${F.num('dmg', 'Niveau de dommage reçu', '')}${F.num('prot', 'Protection à retirer', prot)}${F.text('note', 'Localisation, arme…', '', 'full')}</div>
    <div id="hit-res" class="verdict" style="margin-top:10px"></div><p class="small muted">Seuils : BL ${a.bl}, BG ${a.bg}, BF ${a.bf}, MS ${a.ms}. Couverture partielle : armure ignorée sur un double ou un triple ; importante : sur un triple.</p>`,
  `<button class="btn" data-dact="close">Annuler</button><button class="btn pri" id="hit-ok">Appliquer</button>`);
  const calc = () => {
    const d = (+dlg.querySelector('[name=dmg]').value || 0) - (+dlg.querySelector('[name=prot]').value || 0);
    const g = d >= a.ms ? 'MS' : d >= a.bf ? 'BF' : d >= a.bg ? 'BG' : d >= a.bl ? 'BL' : null;
    dlg.querySelector('#hit-res').textContent = g ? R.BLESSURES[g].n : 'Pas de blessure';
    return g;
  };
  dlg.querySelectorAll('input').forEach((x) => { x.oninput = calc; });
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
  ['Livre de base', ['ange', 'demon']],
  ['Autres personnages (livre de base, chap. 5)', ['humain', 'heroique', 'serviteur', 'soldat', 'fils', 'mortvivant', 'familier', 'incube', 'combat']],
  ['Troisième Force (Les Petites Apocalypses)', ['psi', 'paien', 'renegat_a', 'renegat_d', 'fee', 'monstre']],
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
function startGenerator() { gen = { step: 'type' }; drawGen(); }
function drawGen() {
  const g = gen;
  let body = '', foot = '', title = 'Nouveau personnage';
  if (g.step === 'type') {
    body = GTYPES.map(([h, list]) => `<div class="list-h">${h}</div>` + list.map((k) => `<button class="choice" data-g="type" data-v="${k}">
      ${k === 'ange' ? '<img src="img/mv.webp" alt="">' : k === 'demon' ? '<img src="img/ins.webp" alt="">' : ''}
      <span><b>${R.TYPES[k].n}</b><small>${TYPE_DESC[k]}</small></span></button>`).join('')).join('');
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
function charsDialog() {
  const list = store.list();
  dialog('Personnages', list.map((c) => `<button class="choice ${c.id === C()?.id ? 'on' : ''}" data-dact="sel" data-id="${c.id}"><span><b>${esc(c.nom || 'Sans nom')}</b><small>${esc(R.typeOf(c).n)}${c.superieur ? ' · ' + esc(c.superieur) : ''}</small></span></button>`).join('') || '<div class="empty">Aucun</div>',
    `<button class="btn pri" data-dact="new">${icon('plus')} Nouveau</button>`);
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
    ${c ? `<button class="choice" data-dact="delete" style="border-color:#5a1a1d"><span><b style="color:#ff8a8f">Supprimer ce personnage</b></span></button>` : ''}
    <p class="small muted">Données enregistrées sur l'appareil. Règles : In Nomine Satanis / Magna Veritas 4e édition (Siroz / Asmodée), Les Petites Apocalypses, La Bible à Dudule.</p>`);
}
function cloudDialog() {
  dialog('Sauvegarde en ligne', `<p class="small">Colle la configuration web de ton projet Firebase (Paramètres du projet > Vos applications). Voir le README.</p>
    <div class="field"><label>Configuration</label><textarea id="fbcfg" style="min-height:140px">${esc(store.meta.firebase ? JSON.stringify(store.meta.firebase, null, 2) : '')}</textarea></div>`,
  `${store.userEmail ? '<button class="btn" data-dact="logout">Déconnexion</button>' : ''}<button class="btn pri" data-dact="cfgsave">Enregistrer et se connecter</button>`);
}
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
  <p><b>Possessions</b> : ${esc(c.possessions)}</p><p><b>Notes</b> : ${esc(c.notes)}</p>
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
function enterMJ() {
  ui.screen = 'mj'; localStorage.setItem('insmv.screen', 'mj');
  if (store.configured && table.openId && !table.current) table.open(table.openId);
  render(); window.scrollTo(0, 0);
}
function renderMJ() {
  const t = table.current; const openId = store.configured ? table.openId : null;
  const s = ui.mjSec === 'scen' ? scen.get(ui.scenId) : null;
  const sub = ui.mjSec === 'scen' ? (s ? s.nom : 'Scénarios') : openId ? (t ? `${t.name} · code ${t.id}` : 'Connexion…') : 'Tables de jeu';
  const body = ui.mjSec === 'scen' ? renderScen(s)
    : !store.configured ? `<section class="card"><h2>Table partagée</h2><p>La table de jeu partagée passe par la sauvegarde en ligne (Firebase) : chacun se connecte avec son compte Google.</p>
      <div class="row"><button class="btn pri" data-act="mj-cloud">${icon('cloud')} Configurer la sauvegarde en ligne</button></div>
      <p class="small muted" style="margin-bottom:0">Les <b>scénarios</b> (scènes, combats préparés, PNJ) fonctionnent sans connexion.</p></section>`
    : openId ? renderMJTable() : renderMJTables();
  return `<header class="top">
    <button class="ibtn" data-act="mj-exit" title="Retour à mes personnages">${icon('folder')}</button>
    <div class="who"><h1>Maître de jeu</h1><div class="sub">${esc(sub)}</div></div>
    <button class="ibtn" data-act="freeroll" title="Lancer les dés">${icon('die')}</button>
  </header>
  <main><div class="seg mjnav">${[['table', 'Table des joueurs'], ['scen', 'Scénarios & combats']].map(([k, l]) => `<button class="${ui.mjSec === k ? 'on' : ''}" data-act="mj-sec" data-v="${k}">${l}</button>`).join('')}</div>${body}</main>`;
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
    <p class="small muted" style="margin-bottom:0">Crée une table et donne son code à tes joueurs. Dans le <b>Carnet</b> de leur personnage, carte « Table de jeu », ils saisissent le code et touchent « Partager ma fiche ». Leurs fiches apparaissent alors ici et se mettent à jour en direct. Chacun doit être connecté avec son compte Google.</p>
  </section>`;
}
function mjBar(cur, max, cls = '') {
  return `<div class="tracker"><span class="lab">${cls === 'pf' ? 'PF' : 'PP'}</span>${bar(cur, max, cls)}</div>`;
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
  const tabs = [['vue', 'Vue d\'ensemble'], ['comp', 'Comparatif'], ...(sel ? [['fiche', sel.c.nom || 'Fiche']] : [])];
  let body;
  if (!list.length) body = `<section class="card"><div class="empty">Aucune fiche partagée pour l'instant.</div><p class="small muted">Donne le code <b class="type">${esc(t.id)}</b> à tes joueurs : Carnet de leur personnage > Table de jeu > Partager ma fiche.</p></section>`;
  else if (ui.mjTab === 'comp') body = renderMJComp(list);
  else if (ui.mjTab === 'fiche') body = renderMJFiche(sel);
  else body = list.map(renderMJCard).join('');
  return `<section class="card dark">
      <div class="row"><div style="flex:1"><div class="small muted d">Code à donner aux joueurs</div><div class="type" style="font-size:28px;letter-spacing:.15em">${esc(t.id)}</div></div>
        <button class="btn sm" data-act="mj-copy">Copier</button><button class="btn sm" data-act="mj-close">Changer de table</button></div>
      <div class="small muted d" style="margin-top:4px">${list.length} fiche(s) partagée(s) · mise à jour ${esc(ago(t.updatedAt))}${table.error ? ' · ⚠ ' + esc(table.error) : ''}</div>
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
    <h2><span data-act="mj-char" data-key="${esc(x.id)}" style="cursor:pointer;text-decoration:underline dotted">${esc(c.nom || 'Sans nom')}</span><span class="tag">${esc(x.player || '')} · ${esc(ago(x.updatedAt))}</span></h2>
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
function renderScen(s) {
  if (ui.npcEdit?.type) { const t = scen.getType(ui.npcEdit.type); if (t) return renderNpcEdit(s, null, t); ui.npcEdit = null; }
  if (!s) return renderScenList();
  const sc = ui.npcEdit && curScene(s, ui.npcEdit.scene);
  const n = sc && sc.npcs.find((x) => x.id === ui.npcEdit.npc);
  if (n) return renderNpcEdit(s, sc, n);
  const live = curScene(s, ui.live);
  if (live?.live) return renderLive(s, live);
  const nbPnj = s.scenes.reduce((t, x) => t + x.npcs.reduce((u, y) => u + (+y.qty || 1), 0), 0);
  return `<section class="card dark">
      <div class="row"><button class="btn sm ghost" data-act="sc-back">← Scénarios</button><span class="spacer"></span>
        <button class="btn sm" data-act="sc-export">Exporter</button><button class="btn sm" data-act="sc-dup">Dupliquer</button><button class="btn sm danger" data-act="sc-del">Supprimer</button></div>
      <div class="small muted d" style="margin-top:6px">${s.scenes.length} scène(s) · ${nbPnj} PNJ · modifié ${esc(ago(s.updatedAt))}</div>
    </section>
    <section class="card" data-scform>
      <h2>Synopsis</h2>
      <div class="grid">${F.text('', 'Titre du scénario', s.nom, '', 'data-sf="nom"')}
        <div class="field"><label>Résumé (ce que les joueurs vont vivre)</label><textarea data-sf="resume" placeholder="Accroche, enjeux, mission confiée par le supérieur…">${esc(s.resume)}</textarea></div>
        <div class="field"><label>Secrets du MJ</label><textarea data-sf="notes" placeholder="Ce qui se passe vraiment, PNJ importants, fils à tirer…">${esc(s.notes)}</textarea></div></div>
    </section>
    ${s.scenes.map((sc, i) => renderSceneCard(s, sc, i)).join('')}
    <div class="row" style="justify-content:center;margin-bottom:12px"><button class="btn pri" data-act="sc-scene-add">${icon('plus')} Ajouter une scène</button></div>`;
}
function renderScenList() {
  const list = scen.all();
  return `<section class="card">
    <h2>Mes scénarios <span class="tag">gardés sur cet appareil</span></h2>
    ${list.map((s) => {
      const fights = s.scenes.filter((x) => x.npcs.length).length; const running = s.scenes.filter((x) => x.live).length;
      return `<div class="trow click" data-act="sc-open" data-key="${esc(s.id)}"><div class="tn"><b>${esc(s.nom)}</b><br><small>${s.scenes.length} scène(s) · ${fights} combat(s) préparé(s)${running ? ` · <b style="color:var(--red)">${running} en cours</b>` : ''} · ${esc(ago(s.updatedAt))}</small></div><div class="tl">›</div></div>`;
    }).join('') || '<div class="empty">Aucun scénario pour l\'instant</div>'}
    <h3>Nouveau scénario</h3>
    <div class="row"><input class="inp" id="sc-name" placeholder="Titre du scénario" style="flex:1;min-width:160px"><button class="btn pri" data-act="sc-create">${icon('plus')} Créer</button></div>
    <div class="row" style="margin-top:8px"><button class="btn sm" data-act="sc-import">Importer un scénario ou un bestiaire (fichier)</button></div>
    <p class="small muted" style="margin-bottom:0">Découpe ton scénario en scènes et prépare à l'avance les adversaires de chaque combat : attaque, défense, Volonté, Foi, seuils de blessure, PF, PP, pouvoirs. Le jour de la partie, « Lancer le combat » crée une fiche de suivi par adversaire (PF, PP, blessures et malus) avec les jets d'attaque et de défense à portée de main.</p>
  </section>
  ${renderBestiaire()}`;
}
function renderBestiaire() {
  const types = scen.types();
  return `<section class="card">
    <h2>Bestiaire <span class="tag">types d'ennemis réutilisables</span></h2>
    ${types.map((t) => `<div class="trow click" data-act="sc-type-edit" data-key="${esc(t.id)}"><div class="tn"><b>${esc(t.nom)}</b>${t.source ? ` <small>· ${esc(t.source)}</small>` : ''}<br><small>${esc(npcSummary(t))}</small></div><div class="tl">›</div></div>`).join('') || '<div class="empty">Aucun type d\'ennemi pour l\'instant</div>'}
    <div class="row" style="margin-top:8px"><button class="btn sm pri" data-act="sc-type-new">${icon('plus')} Nouveau type</button><button class="btn sm" data-act="sc-type-book">${icon('book')} Bestiaire des livres (${BOOK.length})</button><button class="btn sm" data-act="sc-type-char">Depuis un personnage</button>
      <span class="spacer"></span><button class="btn sm" data-act="sc-import">Importer</button>${types.length ? '<button class="btn sm" data-act="sc-type-export">Exporter</button>' : ''}</div>
    <p class="small muted" style="margin-bottom:0">Prépare une fois un type d'ennemi (sbire de la Mafia, démon de Baal, soldat de Dieu…), puis ajoute-le à n'importe quelle scène en choisissant combien il en faut : bouton « Depuis le bestiaire » d'une scène, ou « Renfort » pendant un combat.</p>
  </section>`;
}
// Choix d'un type : bestiaire personnel puis fiches des livres pas encore copiées
function typeItems(exclude = () => false) {
  const mine = scen.types().filter((t) => !exclude(t)).map((t) => ({ t, label: t.nom, sub: [t.source, npcSummary(t)].filter(Boolean).join(' · ') }));
  const book = BOOK.filter((t) => !scen.getType(t.id) && !exclude(t)).map((t) => ({ t, book: true, label: t.nom, sub: `📖 ${t.book}${t.source ? ' · ' + t.source : ''} · ${npcSummary(t)}` }));
  return [...mine, ...book];
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
  return `<section class="card">
    <h2>${i + 1}. ${esc(sc.nom)}${sc.live ? '<span class="stamp" style="margin-left:6px">En cours</span>' : ''}<span class="tag">${esc(sc.lieu || '')}</span></h2>
    ${edit ? `<div class="grid g2" data-scform>${F.text('', 'Nom de la scène', sc.nom, '', `data-scf="nom" data-scene="${esc(sc.id)}"`)}${F.text('', 'Lieu', sc.lieu, '', `data-scf="lieu" data-scene="${esc(sc.id)}"`)}
      <div class="field" style="grid-column:1/-1"><label>Déroulement, indices, réactions des PNJ</label><textarea data-scf="notes" data-scene="${esc(sc.id)}">${esc(sc.notes)}</textarea></div></div>
      <div class="row" style="margin-top:8px"><button class="btn sm" data-act="sc-scene-up" data-key="${esc(sc.id)}" ${i ? '' : 'disabled'}>↑ Monter</button><button class="btn sm danger" data-act="sc-scene-del" data-key="${esc(sc.id)}">Supprimer la scène</button><span class="spacer"></span><button class="btn sm pri" data-act="toggle" data-key="${k}">Terminé</button></div>`
    : sc.notes ? `<p class="small" style="white-space:pre-line;margin-top:0">${esc(sc.notes)}</p>` : ''}
    ${sc.npcs.length ? `<div style="overflow-x:auto;margin-top:6px"><table class="ref comp npcs"><tr><th>PNJ (source)</th><th></th><th>Attaque</th><th>Déf.</th><th>Vol.</th><th>Foi</th><th>Per</th><th>BL/BG/BF/MS</th><th>PF</th><th>PP</th><th>Prot.</th></tr>${rows}</table></div>
      ${scenAlerts(sc.npcs)}` : '<div class="empty">Pas d\'adversaire préparé (scène sans combat ?)</div>'}
    <div class="row" style="margin-top:8px">
      <button class="btn sm pri" data-act="sc-npc-best" data-scene="${esc(sc.id)}">${icon('plus')} Depuis le bestiaire</button>
      <button class="btn sm" data-act="sc-npc-add" data-scene="${esc(sc.id)}">${icon('plus')} PNJ unique</button>
      <button class="btn sm" data-act="sc-npc-import" data-scene="${esc(sc.id)}">Depuis un personnage</button>
      ${edit ? '' : `<button class="btn sm ghost" data-act="toggle" data-key="${k}">${icon('edit')} Modifier</button>`}
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
  return `<section class="card dark"><div class="row"><button class="btn sm ghost" data-act="sc-npc-done">← ${isType ? 'Bestiaire' : esc(sc.nom)}</button><span class="spacer"></span>
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
      <div class="row"><button class="btn sm ghost" data-act="lv-back">← ${esc(s.nom)}</button><span class="spacer"></span>
        <span>Round</span><span class="stepper"><button data-act="lv-round" data-v="-1">–</button><b>${lv.round}</b><button data-act="lv-round" data-v="1">+</button></span></div>
      <h2 style="margin:10px 0 0">${icon('sword')} ${esc(sc.nom)}</h2>
      <div class="small muted d">${alive.length} adversaire(s) debout sur ${lv.units.length}${sc.lieu ? ' · ' + esc(sc.lieu) : ''}</div>
      ${scenAlerts(sc.npcs.filter((n) => alive.some((u) => u.npc === n.id)))}
      <div class="row" style="margin-top:8px"><button class="btn sm" data-act="lv-add">${icon('plus')} Renfort</button><span class="spacer"></span><button class="btn sm danger" data-act="lv-end">Terminer le combat</button></div>
    </section>
    ${pjs.length ? `<section class="card"><h2>Personnages joueurs <span class="tag">toucher pour lancer en secret</span></h2>
      <div style="overflow-x:auto"><table class="ref comp"><tr><th>PJ</th><th>Per</th><th>Vol.</th><th>Foi</th><th>Déf.</th><th>BL/BG/BF/MS</th><th>PF</th><th>Malus</th></tr>
      ${pjs.map((x) => { const c = x.c; const a = R.annexes(c); const cell = (k2, key, v) => `<td><button class="cell" data-act="mj-roll" data-id="${esc(x.id)}" data-k="${k2}" data-key="${esc(key)}">${L(v)}</button></td>`;
        return `<tr><td><b>${esc(c.nom || '?')}</b></td>${cell('car', 'pe', c.car.pe)}${cell('car', 'vo', c.car.vo)}${cell('car', 'foi', c.car.foi)}${cell('tal', 'Défense', R.talentLevel(c, 'Défense'))}
          <td>${a.bl}/${a.bg}/${a.bf}/${a.ms}</td><td>${c.pfCur ?? a.pf}/${a.pf}</td><td>${R.woundMalus(c) || ''}</td></tr>`; }).join('')}</table></div></section>` : ''}
    ${lv.units.map((u) => renderUnit(sc, u)).join('')}`;
}
function renderUnit(sc, u) {
  const n = sc.npcs.find((x) => x.id === u.npc);
  if (!n) return '';
  const st = npcStats(n); const c = npcChar(n, u.bl); const malus = R.woundMalus(c);
  const at = (extra = '') => `data-u="${esc(u.uid)}" ${extra}`;
  const pill = (lab, r, kind, key) => `<button class="pill light" data-act="lv-roll" ${at(`data-k="${kind}" data-key="${esc(key)}"`)}>${lab} <b>${L(r)}</b></button>`;
  const open = u.bl.map((b, i) => ({ b, i }));
  return `<section class="card unit ${u.out ? 'out' : ''}">
    <h2>${esc(u.label)}${u.out ? '<span class="stamp" style="margin-left:6px">Hors de combat</span>' : ''}<span class="tag">${esc(n.source || R.TYPES[n.type]?.n || '')}</span></h2>
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
      return `<button class="pill light" data-act="lv-pow" ${at(`data-i="${i}"`)} title="${esc(d.act || par?.act || '')}">${esc(p.n)} <b>${p.r ? L(p.r) : '—'}</b>${cost ? ` <small>${cost} PP</small>` : ''}</button>`;
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
  return openRoll({ label: `${u.label} — ${w.n}`, r: w.att, prec: +w.prec || 0, char: npcChar(n, u.bl), after: (res) => {
    const dmg = res.mr + (+w.puis || 0) + (w.melee ? fo : 0);
    return `Niveau de dommage avant défense : <b style="font-size:20px;color:#fff">${dmg}</b> (MR ${res.mr} + puissance ${sgn(+w.puis || 0)}${w.melee ? ' + Force ' + fo : ''}). Retrancher la MR de la défense du PJ, puis sa protection.`;
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
    case 'sc-import': {
      const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.json,application/json';
      inp.onchange = async () => { try { toast(`${scen.importJSON(await inp.files[0].text())} élément(s) importé(s) (scénarios, types d'ennemis)`); render(); } catch (e) { toast('Fichier illisible : ' + e.message); } };
      return inp.click();
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
    case 'sc-scene-add': { const x = newScene(`Scène ${s.scenes.length + 1}`); s.scenes.push(x); ui.open['scn' + x.id] = true; return save(); }
    case 'sc-scene-up': { const i = s.scenes.findIndex((x) => x.id === key); if (i > 0) s.scenes.splice(i - 1, 0, s.scenes.splice(i, 1)[0]); return save(); }
    case 'sc-scene-del': {
      const x = curScene(s, key);
      if (!(await confirmDlg('Supprimer', `Supprimer la scène « ${esc(x.nom)} » et ses ${x.npcs.length} PNJ ?`))) return;
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
      ui.live = sc.id; localStorage.setItem('insmv.live', sc.id); scen.save(s); render(); return window.scrollTo(0, 0);
    case 'lv-back': ui.live = null; localStorage.removeItem('insmv.live'); render(); return window.scrollTo(0, 0);
    case 'lv-round': sc.live.round = Math.max(1, sc.live.round + +b.dataset.v); return save();
    case 'lv-end':
      if (!(await confirmDlg('Terminer le combat', 'Effacer le suivi de ce combat (PF, blessures) ? Les PNJ préparés sont conservés et le combat pourra être relancé.'))) return;
      sc.live = null; ui.live = null; localStorage.removeItem('insmv.live'); return save();
    case 'lv-add':
      return chooseList('Renfort', [
        ...sc.npcs.map((x) => ({ x, label: x.nom, sub: [x.source, 'déjà dans la scène'].filter(Boolean).join(' · ') })),
        ...typeItems((t) => sc.npcs.some((x) => x.typeId === t.id)),
      ], async (it) => {
        if (it.book) it.t = scen.adoptBook(it.t);
        const q = await askQty(it.label); if (!q) return;
        let x = it.x;
        if (!x) { x = scen.instantiate(it.t.id, 0); x.qty = 0; sc.npcs.push(x); }
        const st = npcStats(x); const same = sc.live.units.filter((u) => u.npc === x.id).length;
        for (let k = 1; k <= q; k++) sc.live.units.push({ uid: newNpc().id, npc: x.id, label: `${x.nom} ${same + k}`, pf: st.pf, pp: st.pp, bl: [], out: false });
        x.qty = (+x.qty || 0) + (it.x ? 0 : q);
        save();
      });
  }
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
      if (k === 'def') return openRoll({ label: `${u.label} — Défense`, r: un.def, char: c, after: (res) => `MR de défense <b>${res.mr}</b> à retrancher à celle de l'attaquant.` });
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
  const fo = R.lvlInt(c.car.fo);
  return openRoll({ label: 'Attaque : ' + w.n, r: weaponLevel(c, w), prec: +w.prec || 0, char, after: (res) => {
    const dmg = res.mr + (+w.puis || 0) + (w.melee ? fo : 0);
    return `Niveau de dommage avant défense : <b style="font-size:20px;color:#fff">${dmg}</b> (MR ${res.mr} + puissance ${sgn(+w.puis || 0)}${w.melee ? ' + Force ' + fo : ''}). Retrancher la MR de la défense adverse${/multiple/i.test(w.q || '') ? ' ; arme multiple : 2 coups sur un double, 3 sur un triple (+4 par coup supplémentaire)' : ''}.`;
  } });
}
async function mjAction(act, b) {
  const key = b.dataset.key;
  try {
    switch (act) {
      case 'mj-enter': return enterMJ();
      case 'mj-sec': ui.mjSec = b.dataset.v; localStorage.setItem('insmv.mjsec', ui.mjSec); render(); return window.scrollTo(0, 0);
      case 'mj-cloud': return cloudDialog();
      case 'mj-exit': ui.screen = 'perso'; localStorage.setItem('insmv.screen', 'perso'); return render();
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
      case 'mj-char': ui.mjChar = key; ui.mjTab = 'fiche'; render(); return window.scrollTo(0, 0);
      case 'mj-roll': {
        const x = mjCharById(b.dataset.id); if (!x) return;
        const c = x.c; const k = b.dataset.k;
        if (k === 'car') return openRoll({ label: `${c.nom} — ${R.caracName(c, key)}`, r: c.car[key], char: c });
        if (k === 'pow') { const p = c.pouvoirs[+key]; return openRoll({ label: `${c.nom} — ${p.n}`, r: p.r, char: c }); }
        const T = c.tal[key];
        const levels = T?.spe ? [['Général', R.talentLevel(c, key)], [T.spe, R.talentSpe(c, key)]] : null;
        return openRoll({ label: `${c.nom} — ${key}`, r: R.talentLevel(c, key), levels, char: c });
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
      return openRoll({ label: key, r: R.talentLevel(c, key), levels });
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
    case 'defense': return openRoll({ label: 'Défense', r: R.talentLevel(c, 'Défense'), after: (res) => `MR de défense <b>${res.mr}</b> à retrancher à celle de l'attaquant.` });
    case 'weapon-add': return weaponDialog();
    case 'weapon-del': c.armes.splice(i, 1); return commit();
    case 'armor-add': return armorDialog();
    case 'armor-del': c.armures.splice(i, 1); return commit();
    case 'armor-toggle': c.armures[i].portee = c.armures[i].portee === false; return commit();
    // ---- pouvoirs ----
    case 'pow-add': return addPowerDialog();
    case 'pow-del': if (await confirmDlg('Retirer', `Retirer ${esc(c.pouvoirs[i].n)} ?`)) { c.pouvoirs.splice(i, 1); commit(); } return;
    case 'pow-use': {
      const p = c.pouvoirs[i]; const d = R.powerDef(p.n) || R.powerDef(R.powerDef(p.n)?.parent); const cost = ppCostOf(d?.act);
      if ((c.ppCur ?? R.ppMax(c)) < cost) return toast('Pas assez de PP');
      c.ppCur = (c.ppCur ?? R.ppMax(c)) - cost; commit(false);
      toast(`${p.n} : –${cost} PP (reste ${c.ppCur})`);
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
    switch (r.dataset.ract) {
      case 'close': dlg.close(); rollState = null; return;
      case 'go': return doRoll();
      case 'r': s.r = Math.max(0, s.r + v); break;
      case 'lvl': s.r = v; break;
      case 'diff': s.diff = r.dataset.v; s.opp = false; break;
      case 'opp': s.opp = !s.opp; break;
      case 'oppR': s.oppR = Math.max(0, s.oppR + v); break;
      case 'shift': s.shift += v; break;
      case 'risk': s.risk = Math.max(0, Math.min(R.lvlInt(s.r), s.risk + v)); break;
      case 'wound': s.wound = r.checked; break;
    }
    s.result = null;
    return showRoll();
  }
  const d = e.target.closest('[data-dact]'); if (!d) return;
  const c = C();
  switch (d.dataset.dact) {
    case 'close': return closeDlg();
    case 'sel': store.select(d.dataset.id); closeDlg(); ui.mode = 'normal'; return render();
    case 'new': closeDlg(); return startGenerator();
    case 'export1': closeDlg(); return download((c.nom || 'personnage').replace(/\W+/g, '_') + '.json', store.exportOne(c));
    case 'exportAll': closeDlg(); return download('insmv-personnages.json', store.exportAll());
    case 'import': closeDlg(); return importFile();
    case 'print': closeDlg(); return printSheet();
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
  if (el.closest('[data-scform]')) return scenChange(el);
  const form = el.closest('[data-form]'); if (!form || !el.name) return;
  const c = C(); let v = el.value;
  if (el.name.startsWith('identite.')) c.identite[el.name.slice(9)] = v;
  else if (el.name === 'type') { c.type = v; c.tier = 0; c.chance = !!R.TYPES[v].chance; }
  else if (['tier', 'grade'].includes(el.name)) c[el.name] = +v;
  else if (el.name === 'chance' || el.name === 'apostat') c[el.name] = v === '1';
  else c[el.name] = v;
  commit(['type', 'tier', 'grade', 'superieur', 'chance', 'apostat', 'nom'].includes(el.name));
});
document.addEventListener('input', (e) => {
  if (e.target.id === 'bq') {
    ui.q = e.target.value; const pos = e.target.selectionStart; render();
    const n = document.getElementById('bq'); if (n) { n.focus(); n.setSelectionRange(pos, pos); }
  }
});

store.onStatus((s, info) => {
  if (info?.reloaded || (!C() && !dlg.open)) { render(); if (s.state === 'error' || s.state === 'synced') toast(s.message); return; }
  if (s.state === 'error') toast(s.message);
  { const el = document.querySelector('.sync'); if (el) el.className = 'sync ' + s.state; } });
render();
if (store.configured) store.sync();
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => {});
