import { readFileSync, readdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
const root = process.argv[2];
const store = {}; globalThis.localStorage = { getItem: (k) => store[k] ?? null, setItem: (k, v) => { store[k] = v; } };
const S = await import(pathToFileURL(root + '/js/scenario.js').href);
const R = await import(pathToFileURL(root + '/js/rules.js').href);
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const files = readdirSync(root + '/scenarios').filter((f) => f.endsWith('.json')).sort();
const seen = new Map(); let problems = 0;
for (const f of files) {
  const x = JSON.parse(readFileSync(`${root}/scenarios/${f}`, 'utf8'));
  const ids = [x.scenarios[0].id, ...x.scenarios[0].scenes.flatMap((sc) => [sc.id, ...sc.npcs.map((n) => n.id), ...(sc.choix || []).map((c) => c.id)]), ...x.bestiaire.map((t) => t.id)];
  for (const i of ids) { if (seen.has(i)) { console.log('ID EN DOUBLE', i, f, seen.get(i)); problems++; } seen.set(i, f); }
  const r = S.scen.importScenarios(JSON.stringify(x));
  const s = S.scen.get(x.scenarios[0].id);
  let units = 0, combats = 0, bad = [];
  for (const sc of s.scenes) {
    for (const n of sc.npcs) {
      const st = S.npcStats(n);
      if (![st.pf, st.bl, st.bg, st.bf, st.ms].every(Number.isFinite)) bad.push(n.nom + ' stats');
      if (!n.typeId || !S.scen.getType(n.typeId)) bad.push(n.nom + ' sans type');
      n.pouvoirs.forEach((p) => { if (!known.has(p.n.toLowerCase())) bad.push(n.nom + ' pouvoir ' + p.n); });
      n.armes.forEach((a) => { if (![a.att, a.prec, a.puis].every(Number.isFinite)) bad.push(n.nom + ' arme ' + a.n); });
    }
    if (sc.combat && sc.npcs.length) { S.startLive(sc); units += sc.live.units.length; combats++; }
    (sc.choix || []).forEach((c) => { if (!c.opts.length || c.opts.some((o) => !o.t)) bad.push('choix ' + c.q); });
  }
  problems += bad.length;
  console.log(`${f}\n  « ${s.nom} » : ${s.scenes.length} scènes, ${r.types} types, ${s.scenes.reduce((a, sc) => a + (sc.choix || []).length, 0)} choix, ${combats} combats (${units} unités)${bad.length ? '\n  PROBLÈMES : ' + bad.join(' ; ') : ''}`);
}
console.log('Scénarios:', S.scen.all().length, '| Types:', S.scen.types().length, '| Problèmes:', problems);
