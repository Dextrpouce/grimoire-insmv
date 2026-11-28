// Scénarios du maître de jeu : scènes, combats préparés et PNJ, suivi des combats en cours.
// Tout est gardé sur l'appareil du MJ (export/import en fichier JSON).
import * as R from './rules.js';
import { BESTIAIRE } from './data/bestiaire.js';
import { QUICK_ANGES, QUICK_DEMONS, QUICK_SERVITEURS, QUICK_PP, T_GRADE, T_CAR, T_TAL, T_POW, ECRAN } from './data/pnjrapides.js';

const KEY = 'insmv.scenarios';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
// types : bestiaire (types d'ennemis réutilisables) ; journal : mémoire des choix des joueurs
const data = Object.assign({ list: {}, types: {}, journal: [] }, load());
let ctxTable = null;
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
export const newScene = (nom = 'Nouvelle scène') => ({ id: uid(), nom, lieu: '', notes: '', combat: true, npcs: [], live: null, choix: [] });

// ---- Mémoire des choix des joueurs ----
// Entrée du journal : ce que les PJ ont fait, et la suite qu'il faudra leur faire payer (ou récompenser).
// scen/scene : où c'est arrivé ; rappel : scénario dans lequel la suite doit ressortir ; done/res : fil refermé et comment.
export const KINDS = [['choix', 'Choix'], ['promesse', 'Promesse'], ['dette', 'Dette / faveur'], ['ennemi', 'Ennemi'], ['allie', 'Allié'],
  ['secret', 'Secret découvert'], ['superieur', 'Supérieur / hiérarchie'], ['mort', 'Mort / destruction']];
export const newEntry = (over = {}) => ({ id: uid(), at: Date.now(), scen: null, scene: null, kind: 'choix', txt: '', pjs: [], suite: '', rappel: null, done: false, res: '', ...over });
// Embranchement préparé dans une scène : question, options (avec leur conséquence) ; entry : entrée du journal une fois tranché
export const newChoice = (q = '') => ({ id: uid(), q, opts: [], entry: null });

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
export const BOOK = [...BESTIAIRE, ...QUICK_SERVITEURS].map(fromBook);

// ---- PNJ rapides de l'écran du maître : un profil par supérieur, de 10 à 40 PP ----
export const QUICK = { ange: QUICK_ANGES, demon: QUICK_DEMONS };
const WEAPON_TOKEN = /^(.*?)\s*\[([+-]?\d+)\/([+-]?\d+)\/(cac|tir)\]$/;
export function quickNpc(camp, sup, pp) {
  const p = QUICK[camp].find((x) => x[0] === sup); if (!p) return null;
  const [, carS, [A, D, Ph, Me, So], extra, init, steps] = p;
  const i = Math.max(0, QUICK_PP.indexOf(+pp));
  const tal = (b) => T_TAL[Math.min(7, Math.max(1, b))][i];
  const v = carS.split(/\s+/).map((x) => R.parseLvl(T_CAR[x]?.[i] ?? x));
  const car = { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: Math.max(v[5], T_GRADE[i][1] * 2) };
  const att = R.parseLvl(tal(A));
  const armes = [{ n: 'Arme de prédilection', att, prec: 0, puis: 0, melee: true }];
  const pouvoirs = []; const notes = [];
  const add = (list, col) => splitTop(list).forEach((x) => {
    if (x.startsWith('!')) return notes.push(x.slice(1));
    const w = x.match(WEAPON_TOKEN);
    if (w) {
      const nom = w[1].replace(/^Membre exotique : /, '');
      const arm = { n: nom.charAt(0).toUpperCase() + nom.slice(1), att, prec: +w[2], puis: +w[3], melee: w[4] === 'cac' };
      // une arme bénie ou maudite plus puissante remplace la précédente de la même famille
      const fam = (s) => s.replace(/ (mineure?|majeure?|ancienne?)$/, '');
      const j = armes.findIndex((a) => fam(a.n) === fam(arm.n));
      if (j >= 0) armes[j] = arm; else armes.push(arm);
      if (!w[1].startsWith('Membre exotique')) return;
      x = w[1];
    }
    const m = x.match(/^(.*?)\s+(\d)$/);
    // niveau 2 initial → colonne 0, niveau 1 initial → colonne 1, gagné à 15/20/25/30 PP → colonnes 2 à 5 ; pouvoir sans niveau : 0
    const r = m ? T_POW[i][col ?? (m[2] === '2' ? 0 : 1)] : 0;
    pouvoirs.push({ n: m ? m[1] : x, r: r * 2 });
  });
  add(init);
  steps.forEach((s, k) => { if (+pp >= 15 + 5 * k) add(s, 2 + k); });
  const extraT = splitTop(extra).map((x) => { const m = x.match(/^(.*?)\s+(\d)$/); return m ? `${m[1]} ${tal(+m[2])}` : x; });
  const label = camp === 'ange' ? 'Ange' : 'Démon';
  return newNpc({
    nom: `${label} de ${sup} (${pp} PP)`, source: `${label} de ${sup}, grade ${T_GRADE[i][0]}`, type: camp, car,
    def: R.parseLvl(tal(D)), pp: +pp, armes, pouvoirs,
    talents: [`Attaque ${tal(A)}, Défense ${tal(D)}, Physique ${tal(Ph)}, Mental ${tal(Me)}, Social ${tal(So)}`, ...extraT].join(', '),
    notes: [...notes, 'PNJ rapide : talents regroupés (Attaque = arme de prédilection, précision et puissance à régler ; Physique, Mental, Social = tous les talents de ce groupe).',
      `Source : ${ECRAN}, p. ${camp === 'ange' ? '10-11' : '12-14'} (tables d'évolution p. 10).`].join('\n'),
  });
}

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
  remove(id) {
    delete data.list[id];
    data.journal.forEach((e) => { if (e.rappel === id) e.rappel = null; }); // les entrées restent (la campagne s'en souvient)
    persist();
  },
  save(s) { if (s) s.updatedAt = Date.now(); persist(); },
  duplicate(id) {
    const s = JSON.parse(JSON.stringify(data.list[id])); s.id = uid(); s.nom += ' (copie)'; s.createdAt = s.updatedAt = Date.now();
    s.cur = null; s.fini = false; s.scenes.forEach((sc) => { sc.live = null; sc.done = false; (sc.choix || []).forEach((ch) => { ch.entry = null; }); }); data.list[s.id] = s; persist(); return s;
  },
  // ---- Journal des choix (commun à toute la campagne) ----
  journal() { return [...data.journal].sort((a, b) => b.at - a.at); },
  entry(id) { return data.journal.find((e) => e.id === id) || null; },
  // Table de jeu ouverte par le MJ : les nouveaux choix du journal lui sont rattachés (journal par campagne)
  setTable(id) { ctxTable = id || null; },
  saveEntry(e) { if (!data.journal.includes(e) && !data.journal.some((x) => x.id === e.id) && e.table === undefined) e.table = ctxTable; if (!data.journal.includes(e)) { const i = data.journal.findIndex((x) => x.id === e.id); if (i >= 0) data.journal[i] = e; else data.journal.push(e); } persist(); return e; },
  removeEntry(id) {
    data.journal = data.journal.filter((e) => e.id !== id);
    Object.values(data.list).forEach((s) => s.scenes.forEach((sc) => (sc.choix || []).forEach((ch) => { if (ch.entry === id) ch.entry = null; })));
    persist();
  },
  // Noms des PJ déjà cités dans le journal (pour les proposer hors connexion)
  pjNames() { return [...new Set(data.journal.flatMap((e) => e.pjs))].sort((a, b) => a.localeCompare(b, 'fr')); },
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
    return JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [s], bestiaire: [...used].map((t) => data.types[t]).filter(Boolean),
      memoire: data.journal.filter((e) => e.scen === id || e.rappel === id) }, null, 2);
  },
  exportJournal() { return JSON.stringify({ format: 'insmv-memoire', version: 1, memoire: this.journal() }, null, 2); },
  importJournal(json) {
    const x = JSON.parse(json);
    if (x.format !== 'insmv-memoire' || !Array.isArray(x.memoire)) throw new Error('ce n\'est pas une mémoire de campagne du Grimoire');
    let n = 0;
    for (const e of x.memoire) if (e?.id && !data.journal.some((y) => y.id === e.id)) { data.journal.push(newEntry({ ...e, pjs: Array.isArray(e.pjs) ? e.pjs : [] })); n++; }
    persist(); return { memo: n, already: x.memoire.length - n };
  },
  exportTypes() { return JSON.stringify({ format: 'insmv-bestiaire', version: 1, bestiaire: this.types() }, null, 2); },
  // Ajoute les types d'ennemis absents ; retourne le nombre ajouté
  _addTypes(list) { let n = 0; for (const t of list || []) if (t?.id && Array.isArray(t.armes) && !data.types[t.id]) { data.types[t.id] = t; n++; } return n; },
  // Fichier de scénario : les scénarios, plus les types du bestiaire qu'ils utilisent
  // opts.types === false : les types d'ennemis restent dans le scénario (bibliothèque des livres) ; opts.livre : fichier d'origine
  importScenarios(json, opts = {}) {
    const x = JSON.parse(json);
    const list = x.format === 'insmv-scenario' && Array.isArray(x.scenarios) ? x.scenarios.filter((s) => s && Array.isArray(s.scenes)) : [];
    if (!list.length) throw new Error(x.format === 'insmv-bestiaire' ? 'c\'est un bestiaire : importe-le depuis la carte Bestiaire' : 'ce n\'est pas un scénario du Grimoire');
    const ids = {}; // ancien id → nouvel id (si le scénario existe déjà ici)
    for (const s of list) {
      const old = s.id; s.id = data.list[s.id] ? uid() : s.id || uid(); ids[old] = s.id; s.updatedAt = Date.now();
      if (opts.livre) s.livre = opts.livre;
      data.list[s.id] = s;
    }
    const types = opts.types === false ? 0 : this._addTypes(x.bestiaire);
    let memo = 0;
    for (const e of Array.isArray(x.memoire) ? x.memoire : []) {
      if (!e?.id || data.journal.some((y) => y.id === e.id)) continue;
      data.journal.push(newEntry({ ...e, scen: ids[e.scen] ?? e.scen, rappel: ids[e.rappel] ?? e.rappel, pjs: Array.isArray(e.pjs) ? e.pjs : [] })); memo++;
    }
    persist(); return { scenarios: list.length, types, memo, ids: list.map((s) => s.id) };
  },
  // Fichier de bestiaire (ou bestiaire joint à un scénario exporté) : seulement les types d'ennemis
  importTypes(json) {
    const x = JSON.parse(json);
    const list = ['insmv-bestiaire', 'insmv-scenario'].includes(x.format) && Array.isArray(x.bestiaire) ? x.bestiaire : null;
    if (!list || !list.length) throw new Error(x.format === 'insmv-scenario' ? 'ce scénario ne contient pas de types d\'ennemis : importe-le depuis Mes scénarios' : 'ce n\'est pas un bestiaire du Grimoire');
    const n = this._addTypes(list); persist(); return { types: n, already: list.length - n };
  },
};
