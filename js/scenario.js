// Scénarios du maître de jeu : scènes, combats préparés et PNJ, suivi des combats en cours.
// Tout est gardé sur l'appareil du MJ (export/import en fichier JSON).
import * as R from './rules.js';
import { BESTIAIRE } from './data/bestiaire.js';

const KEY = 'insmv.scenarios';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
const data = Object.assign({ list: {}, types: {} }, load()); // types : bestiaire (types d'ennemis réutilisables)
const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* stockage plein ou bloqué */ } };
const clone = (o) => JSON.parse(JSON.stringify(o));
export const uid =() => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export function newNpc(over = {}) {
  return {
    id: uid(), nom: 'Nouveau PNJ', source: '', type: 'humain', qty: 1,
    car: { fo: 4, ag: 4, pe: 4, vo: 4, pr: 4, foi: 4 },
    def: 4, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
    armes: [{ n: 'Coup de poing', att: 4, prec: 0, puis: -3, melee: true }],
    pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
    ...over,
  };
}
export const newScene = (nom = 'Nouvelle scène') => ({ id: uid(), nom, lieu: '', notes: '', combat: true, npcs: [], live: null });

// Fiche minimale compatible avec les règles (seuils, PF, malus, camp pour 111/666)
export function npcChar(n, blessures = []) {
  return { type: n.type, tier: 0, car: { ...n.car }, tal: {}, blessures, nom: n.nom, chance: !!R.TYPES[n.type]?.chance };
}
export function npcStats(n) {
  const c = npcChar(n);
  const a = R.annexes(c);
  const s = n.seuilsFix && n.seuilsFix.every((x) => x !== '' && x != null) ? n.seuilsFix.map(Number) : [a.bl, a.bg, a.bf, a.ms];
  const pf = n.pfFix != null && n.pfFix !== '' ? +n.pfFix : a.pf;
  const pows = n.pouvoirs.map((p) => p.n.toLowerCase());
  return {
    pf, pp: +n.pp || 0, bl: s[0], bg: s[1], bf: s[2], ms: s[3], camp: R.typeOf(c).camp,
    esquive: n.esquive || pows.some((p) => p.includes('esquive acrobatique')),
    volonte: n.volonte || pows.some((p) => p.includes('volonté supra')),
  };
}
// ---- Bestiaire des livres (js/data/bestiaire.js) : fiches saisies dans un format compact ----
// Attaques au format des livres « nom (seuil/RU+X/M+Y) » : MR = RU + X, dommages = MR + Y
// (Force et puissance déjà comprises), d'où att = X, précision 0, puissance Y, sans ajout de Force.
const splitTop = (s) => { const out = []; let depth = 0, cur = ''; for (const ch of s || '') { if (ch === '(') depth++; if (ch === ')') depth--; if (ch === ',' && !depth) { out.push(cur); cur = ''; } else cur += ch; } out.push(cur); return out.map((x) => x.trim()).filter(Boolean); };
const POW_IDX = new Map(R.POUVOIRS.map((p) => [p.n.toLowerCase(), p.n]));
function bookPowers(s) {
  return splitTop(s).map((x) => {
    const m = x.match(/^(.*?)\s+(\d+\+?)$/);
    let nom = (m ? m[1] : x).trim();
    const me = nom.match(/^Membre exotique \((.+)\)$/i); // « Membre exotique (griffes) » → « Membre exotique : griffes »
    if (me && POW_IDX.has(`membre exotique : ${me[1].toLowerCase()}`)) nom = `Membre exotique : ${me[1]}`;
    const key = nom.toLowerCase().replace(/\s+/g, ' ');
    return { n: POW_IDX.get(key) || POW_IDX.get(key.replace(/ /g, '-')) || nom, r: m ? R.parseLvl(m[2]) : 0 };
  });
}
function fromBook(b) {
  const T = R.TYPES[b.type] || R.TYPES.humain;
  const [bl, bg, bf, ms] = b.s ? String(b.s).split('/').map(Number) : [];
  let car;
  if (b.car) { const v = b.car.trim().split(/\s+/).map((x) => R.parseLvl(x) ?? 4); car = { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; }
  else { // caractéristiques non données : Force tirée du seuil BL, Volonté des PF, le reste à 2
    const fo = Math.max(1, bl - (T.bl ?? 2)); const vo = Math.max(1, (b.pf || 0) - fo);
    car = { fo: fo * 2, ag: 4, pe: 4, vo: vo * 2, pr: 4, foi: 4 };
  }
  return newNpc({
    id: 'livre-' + b.id, book: b.ref, nom: b.nom, source: b.src || '', type: b.type, car,
    // Défense non donnée : niveau de base du talent (d'après sa caractéristique)
    def: b.def != null ? R.parseLvl(String(b.def)) ?? 4 : R.talentBase({ car }, 'Défense'), prot: b.prot || 0, pp: b.pp || 0, pfFix: b.pf ?? null, seuilsFix: b.s ? [bl, bg, bf, ms] : null,
    // [nom, X, Y] : format des livres ; { n, lvl, arme } : niveau de talent + arme de la table (précision, puissance, Force au contact)
    armes: (b.att || []).map((a) => {
      if (Array.isArray(a)) return { n: a[0], att: a[1] * 2, prec: 0, puis: a[2], melee: false };
      const w = R.ARMES.flatMap(([g, l]) => l.map((x) => [g, ...x])).find((x) => x[1] === a.arme);
      return { n: a.n || a.arme, att: R.parseLvl(String(a.lvl)) ?? 4, prec: a.prec ?? (w ? w[2] : 0), puis: a.puis ?? (w ? w[3] : 0), melee: a.melee ?? (w ? R.MELEE_GROUPS.includes(w[0]) : true) };
    }),
    pouvoirs: bookPowers(b.pow), talents: b.tal || '',
    notes: [b.notes, b.car ? '' : 'Caractéristiques non données par le livre : estimées (Force d\'après les seuils, Volonté d\'après les PF).', `Source : ${b.ref}.`].filter(Boolean).join('\n'),
  });
}
export const BOOK = BESTIAIRE.map(fromBook);

export const gravite =(dmg, st) => (dmg >= st.ms ? 'MS' : dmg >= st.bf ? 'BF' : dmg >= st.bg ? 'BG' : dmg >= st.bl ? 'BL' : null);

// Personnage complet du Grimoire → PNJ
export function npcFromCharacter(c, weaponLevel) {
  const tal = Object.keys(c.tal || {}).filter((t) => (+c.tal[t].r || 0) > 0 && t !== 'Défense')
    .map((t) => `${t} ${R.lvl(R.talentLevel(c, t))}${c.tal[t].spe ? ` (${c.tal[t].spe} ${R.lvl(R.talentSpe(c, t))})` : ''}`).join(', ');
  return newNpc({
    nom: c.nom || 'PNJ', source: [R.typeOf(c).n, c.superieur].filter(Boolean).join(' de '), type: R.TYPES[c.type] ? c.type : 'humain',
    car: { ...c.car }, def: R.talentLevel(c, 'Défense'),
    prot: (c.armures || []).filter((x) => x.portee !== false && !/bouclier/i.test(x.n + (x.q || ''))).reduce((s, x) => s + (+x.p || 0), 0),
    pfFix: null, pp: R.ppMax(c), seuilsFix: null,
    armes: (c.armes || []).map((w) => ({ n: w.n, att: weaponLevel(c, w), prec: +w.prec || 0, puis: +w.puis || 0, melee: !!w.melee })),
    pouvoirs: (c.pouvoirs || []).map((p) => ({ n: p.n, r: p.r || 0 })), talents: tal,
    notes: [c.identite?.apparence, c.notes].filter(Boolean).join('\n'),
  });
}

// Combat : chaque PNJ devient une ou plusieurs unités (quantité) avec leurs propres PF, PP et blessures.
export function startLive(scene) {
  const units = [];
  scene.npcs.forEach((n) => {
    const st = npcStats(n); const q = Math.max(1, +n.qty || 1);
    for (let i = 1; i <= q; i++) units.push({ uid: uid(), npc: n.id, label: q > 1 ? `${n.nom} ${i}` : n.nom, pf: st.pf, pp: st.pp, bl: [], out: false });
  });
  scene.live = { round: 1, units, log: [], started: Date.now() };
}

export const scen = {
  all() { return Object.values(data.list).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)); },
  get(id) { return data.list[id] || null; },
  create(nom) { const s = { id: uid(), nom, resume: '', notes: '', scenes: [newScene('Scène 1')], createdAt: Date.now(), updatedAt: Date.now() }; data.list[s.id] = s; persist(); return s; },
  remove(id) { delete data.list[id]; persist(); },
  save(s) { if (s) s.updatedAt = Date.now(); persist(); },
  duplicate(id) {
    const s = JSON.parse(JSON.stringify(data.list[id])); s.id = uid(); s.nom += ' (copie)'; s.createdAt = s.updatedAt = Date.now();
    s.scenes.forEach((sc) => { sc.live = null; }); data.list[s.id] = s; persist(); return s;
  },
  // ---- Bestiaire : types d'ennemis communs à tous les scénarios ----
  types() { return Object.values(data.types).sort((a, b) => (a.nom || '').localeCompare(b.nom || '', 'fr')); },
  getType(id) { return data.types[id] || null; },
  newType() { const t = newNpc({ nom: 'Nouveau type d\'ennemi' }); delete t.qty; data.types[t.id] = t; persist(); return t; },
  // Enregistre une copie d'un PNJ comme type ; met à jour le type d'origine s'il existe encore
  saveAsType(n) {
    const t = clone(n); delete t.qty; delete t.typeId;
    t.id = n.typeId && data.types[n.typeId] ? n.typeId : uid();
    data.types[t.id] = t; n.typeId = t.id; persist(); return t;
  },
  dupType(id) { const t = clone(data.types[id]); t.id = uid(); t.nom += ' (copie)'; data.types[t.id] = t; persist(); return t; },
  removeType(id) { delete data.types[id]; persist(); },
  // Bestiaire des livres : copie un type prêt à l'emploi dans le bestiaire personnel (une seule fois)
  adoptBook(t) { if (!data.types[t.id]) { data.types[t.id] = clone(t); persist(); } return data.types[t.id]; },
  // PNJ d'une scène créé à partir d'un type, en qty exemplaires
  instantiate(typeId, qty) { const t = data.types[typeId]; return t ? { ...clone(t), id: uid(), qty: Math.max(1, qty || 1), typeId } : null; },
  exportOne(id) {
    const s = data.list[id]; const used = new Set(s.scenes.flatMap((sc) => sc.npcs.map((n) => n.typeId).filter(Boolean)));
    return JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [s], bestiaire: [...used].map((t) => data.types[t]).filter(Boolean) }, null, 2);
  },
  exportTypes() { return JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [], bestiaire: this.types() }, null, 2); },
  importJSON(json) {
    const x = JSON.parse(json);
    const list = x.format === 'insmv-scenario' ? x.scenarios : null;
    if (!Array.isArray(list)) throw new Error('ce n\'est pas un scénario du Grimoire');
    let n = 0;
    for (const t of x.bestiaire || []) if (t?.id && !data.types[t.id]) { data.types[t.id] = t; n++; }
    for (const s of list) {
      if (!s || !Array.isArray(s.scenes)) continue;
      s.id = data.list[s.id] ? uid() : s.id || uid(); s.updatedAt = Date.now();
      data.list[s.id] = s; n++;
    }
    persist(); return n;
  },
};
