// Scénarios du maître de jeu : scènes, combats préparés et PNJ, suivi des combats en cours.
// Tout est gardé sur l'appareil du MJ (export/import en fichier JSON).
import * as R from './rules.js';

const KEY = 'insmv.scenarios';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
const data = Object.assign({ list: {} }, load());
const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* stockage plein ou bloqué */ } };
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

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
export const gravite = (dmg, st) => (dmg >= st.ms ? 'MS' : dmg >= st.bf ? 'BF' : dmg >= st.bg ? 'BG' : dmg >= st.bl ? 'BL' : null);

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
  exportOne(id) { return JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [data.list[id]] }, null, 2); },
  importJSON(json) {
    const x = JSON.parse(json);
    const list = x.format === 'insmv-scenario' ? x.scenarios : null;
    if (!Array.isArray(list)) throw new Error('ce n\'est pas un scénario du Grimoire');
    let n = 0;
    for (const s of list) {
      if (!s || !Array.isArray(s.scenes)) continue;
      s.id = data.list[s.id] ? uid() : s.id || uid(); s.updatedAt = Date.now();
      data.list[s.id] = s; n++;
    }
    persist(); return n;
  },
};
