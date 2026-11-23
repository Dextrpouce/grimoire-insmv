import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
const [root, file] = process.argv.slice(2);
const store = {}; globalThis.localStorage = { getItem: (k) => store[k] ?? null, setItem: (k, v) => { store[k] = v; } };
const S = await import(pathToFileURL(root + '/js/scenario.js').href);
const res = S.scen.importScenarios(readFileSync(file, 'utf8'));
console.log('import:', res);
console.log('bestiaire (carte):', S.scen.importTypes(readFileSync(file, 'utf8')));
const s = S.scen.all()[0];
for (const sc of s.scenes) {
  console.log(`- ${sc.nom} | ${sc.npcs.length} PNJ | ${sc.choix.length} choix`);
  for (const n of sc.npcs) { const st = S.npcStats(n); console.log(`    ${n.nom} x${n.qty}: PF ${st.pf} PP ${st.pp} seuils ${st.bl}/${st.bg}/${st.bf}/${st.ms} camp ${st.camp}`); }
}
const proces = s.scenes.find((x) => x.combat && x.npcs.length);
S.startLive(proces); console.log('combat:', proces.live.units.length, 'unités');
