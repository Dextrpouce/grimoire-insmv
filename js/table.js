// Table de jeu : les joueurs partagent leur fiche, le maître de jeu la consulte en direct.
import * as cloud from './cloud.js';
import { store } from './store.js';

const KEY = 'insmv.tables';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
const data = Object.assign({ mine: {}, notes: {}, open: null }, load());
const persist = () => localStorage.setItem(KEY, JSON.stringify(data));
const listeners = new Set();
const emit = () => listeners.forEach((fn) => fn());
const newCode = () => Array.from({ length: 6 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]).join('');
const cleanCode = (s) => String(s || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
export const errText = (e) => (e?.code === 'permission-denied' ? 'Accès refusé par Firebase'
  : e?.code === 'resource-exhausted' ? 'Limite gratuite de Firebase atteinte pour aujourd’hui'
  : e?.code === 'unavailable' || !navigator.onLine ? 'Hors ligne'
  : e?.code === 'auth/popup-closed-by-user' ? 'Connexion annulée'
  : e?.message || 'Erreur');

let cur = null;      // table suivie par le MJ : { id, name, members, state, updatedAt }
let curError = '';
let stop = null;
const timers = {};

export const table = {
  onChange(fn) { listeners.add(fn); },
  get mine() { return Object.entries(data.mine).map(([id, t]) => ({ id, ...t })).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)); },
  get current() { return cur; },
  get error() { return curError; },
  get uid() { return cloud.user()?.uid || ''; },
  // Toutes mes tables, comme les groupes de Dragonbane : celles où je suis MJ, puis celles de mes personnages
  list() {
    const out = new Map();
    for (const [id, t] of Object.entries(data.mine)) out.set(id, { id, name: t.name, mj: true });
    for (const c of store.list()) if (c.table && !out.has(c.table)) out.set(c.table, { id: c.table, name: c.tableName || c.table, mj: false });
    return [...out.values()].sort((a, b) => (b.mj - a.mj) || String(a.name).localeCompare(String(b.name), 'fr'));
  },
  // Retrouve mes tables de MJ enregistrées sur Firebase (créées depuis un autre appareil) ; renvoie le nombre ajouté
  async discover() {
    if (!store.configured || !cloud.user()) return 0;
    let n = 0;
    try {
      for (const t of await cloud.myTables()) {
        if (t.gm && !data.mine[t.id]) { data.mine[t.id] = { name: t.name, createdAt: Date.now() }; n++; }
        else if (data.mine[t.id] && data.mine[t.id].name !== t.name) data.mine[t.id].name = t.name;
      }
    } catch { /* hors ligne ou requête refusée : on garde la liste de l'appareil */ }
    if (n) { persist(); emit(); }
    return n;
  },

  // ================= Joueur =================
  async share(c, code) {
    const id = cleanCode(code);
    if (!id) throw new Error('Code vide');
    await store.ensureUser();
    const name = await cloud.joinTable(id);
    c.table = id; c.tableName = name;
    await this.push(c);
    return name;
  },
  async push(c) {
    if (!c.table) return;
    await store.ensureUser();
    const snapshot = JSON.parse(JSON.stringify(c));
    if (c.notesPrivees) snapshot.notes = '';
    delete snapshot.portrait; // le document de la table regroupe toutes les fiches (1 Mo au plus) : seule la vignette part
    await cloud.updateTable(c.table, (st, uid, name) => {
      st.chars ||= {};
      const prev = st.chars[c.id];
      if (prev && prev.owner !== uid) return false;
      st.chars[c.id] = { owner: uid, player: name, json: JSON.stringify(snapshot), updatedAt: Date.now() };
    });
    c.tableSent = Date.now(); c.tableErr = '';
  },
  // Envoi différé après une modification (regroupe les changements rapprochés)
  schedule(c, after) {
    if (!c?.table || !store.configured) return;
    clearTimeout(timers[c.id]);
    timers[c.id] = setTimeout(async () => {
      try { await this.push(c); } catch (e) { c.tableErr = errText(e); }
      after?.();
    }, 8000);
  },
  async unshare(c) {
    const id = c.table;
    delete c.table; delete c.tableName; delete c.tableSent; delete c.tableErr;
    if (!id) return;
    try {
      await store.ensureUser();
      await cloud.updateTable(id, (st, uid) => {
        if (!st.chars?.[c.id] || st.chars[c.id].owner !== uid) return false;
        delete st.chars[c.id];
      });
    } catch (e) { /* hors ligne : la fiche restera visible chez le MJ jusqu'au prochain partage */ }
  },

  // ================= Maître de jeu =================
  async create(name) {
    await store.ensureUser();
    const id = newCode();
    await cloud.createTable(id, name);
    data.mine[id] = { name, createdAt: Date.now() }; persist();
    this.open(id);
    return id;
  },
  // Retrouver une de ses tables (autre appareil) avec son code
  async add(code) {
    const id = cleanCode(code);
    await store.ensureUser();
    const name = await cloud.joinTable(id, { asGm: true });
    data.mine[id] = { name, createdAt: Date.now() }; persist();
    this.open(id);
    return name;
  },
  forget(id) { delete data.mine[id]; delete data.notes[id]; if (data.open === id) this.close(); persist(); emit(); },
  async open(id) {
    stop?.(); stop = null; cur = null; curError = '';
    data.open = id; persist(); emit();
    try {
      await store.ensureUser();
      stop = cloud.watchTable(id, (t) => { cur = t; curError = ''; if (data.mine[id] && data.mine[id].name !== t.name) { data.mine[id].name = t.name; persist(); } emit(); },
        (e) => { curError = errText(e); emit(); });
    } catch (e) { curError = errText(e); emit(); }
  },
  close() { stop?.(); stop = null; cur = null; data.open = null; persist(); emit(); },
  get openId() { return data.open; },
  characters() {
    const chars = cur?.state?.chars || {};
    return Object.entries(chars).map(([id, x]) => {
      let c = null;
      try { c = JSON.parse(x.json); } catch { /* fiche illisible */ }
      return c ? { id, player: x.player, owner: x.owner, updatedAt: x.updatedAt, c } : null;
    }).filter(Boolean).sort((a, b) => (a.c.nom || '').localeCompare(b.c.nom || '', 'fr'));
  },
  async kick(charId) {
    await cloud.updateTable(cur.id, (st, uid) => {
      if (st.gm?.uid !== uid || !st.chars?.[charId]) return false;
      delete st.chars[charId];
    });
  },
  // Camp joué à la table ouverte (réglé par le MJ, gardé sur cet appareil) : demon, ange, tiers, tous ; '' = pas réglé
  camp() { return data.mine[data.open]?.camp || ''; },
  setCamp(v) { if (!data.mine[data.open]) return; data.mine[data.open].camp = v; persist(); emit(); },
  note(charId) { return data.notes[data.open]?.[charId] || ''; },
  setNote(charId, txt) { (data.notes[data.open] ||= {})[charId] = txt; persist(); },
  // Pour les tests et la démonstration hors ligne
  _mock(t) { cur = t; data.open = t.id; emit(); },
};
