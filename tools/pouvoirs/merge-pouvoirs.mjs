// Fusionne dans js/data/pouvoirs.js :
//  - les résumés courts (champ s) de tools/pouvoirs/sources/resumes.json ({ nom: résumé }) ;
//  - les nouveaux pouvoirs de tools/pouvoirs/sources/*.json (tableaux au format de POUVOIRS ; « __… » ignorés) ;
//  - les pouvoirs propres aux supérieurs de *-par-superieur.json ({ supérieur: ["Pouvoir 2", …] }) → a.sup.
// usage : node tools/pouvoirs/merge-pouvoirs.mjs <racine du projet>
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.argv[2] || '.';
const file = path.join(root, 'js/data/pouvoirs.js');
const srcDir = path.join(root, 'tools/pouvoirs/sources');
const txt = readFileSync(file, 'utf8');
const head = txt.slice(0, txt.indexOf('export const POUVOIRS'));
const { POUVOIRS } = await import(pathToFileURL(file).href + '?t=' + Date.now());
const { SUPERIEURS } = await import(pathToFileURL(path.join(root, 'js/data/superieurs.js')).href);
const SUPS = new Set(SUPERIEURS.map((s) => s.n));
const ALIAS = { 'Dajjâl': 'Daiàl', 'Majûj': 'Majùj' };
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const byNorm = new Map(POUVOIRS.map((p) => [norm(p.n), p]));
const log = [];

const files = existsSync(srcDir) ? readdirSync(srcDir).filter((f) => f.endsWith('.json')) : [];
// 1. Nouveaux pouvoirs
let added = 0;
for (const f of files.filter((x) => x !== 'resumes.json' && !x.includes('-par-superieur'))) {
  for (const p of JSON.parse(readFileSync(path.join(srcDir, f), 'utf8'))) {
    if (!p?.n || p.n.startsWith('__')) continue;
    if (byNorm.has(norm(p.n))) { log.push(`déjà présent : ${p.n} (${f})`); continue; }
    const a = { ...(p.a || {}) };
    if (a.sup) a.sup = Object.fromEntries(Object.entries(a.sup).map(([k, v]) => [ALIAS[k] || k, v]).filter(([k]) => SUPS.has(k) || (log.push(`supérieur inconnu ${k} pour ${p.n}`), false)));
    const e = { n: p.n, nat: p.nat || 'spirituel', act: p.act || '—', q: p.q || '—', acc: p.acc || '', a, d: p.d || '', src: p.src || 'autre' };
    if (p.s) e.s = p.s;
    if (p.ref) e.ref = p.ref;
    POUVOIRS.push(e); byNorm.set(norm(e.n), e); added++;
  }
}
// 2. Pouvoirs propres aux supérieurs
for (const f of files.filter((x) => x.includes('-par-superieur'))) {
  for (const [s0, list] of Object.entries(JSON.parse(readFileSync(path.join(srcDir, f), 'utf8')))) {
    const s = ALIAS[s0] || s0; if (!SUPS.has(s)) { log.push(`supérieur inconnu : ${s0}`); continue; }
    for (const item of list) {
      const m = String(item).match(/^(.*?)\s+(\d+)\s*$/); const nom = (m ? m[1] : item).trim(); const v = m ? +m[2] : null;
      const p = byNorm.get(norm(nom)); if (!p) { log.push(`pouvoir introuvable pour ${s} : ${nom}`); continue; }
      p.a ||= {}; p.a.sup ||= {}; if (p.a.sup[s] == null) p.a.sup[s] = v ?? p.a.gen ?? p.a[SUPERIEURS.find((x) => x.n === s).camp] ?? 3;
    }
  }
}
// 3. Résumés
let sums = 0;
if (files.includes('resumes.json')) {
  for (const [n, s] of Object.entries(JSON.parse(readFileSync(path.join(srcDir, 'resumes.json'), 'utf8')))) {
    const p = byNorm.get(norm(n)); if (!p) { log.push(`résumé sans pouvoir : ${n}`); continue; }
    if (!p.s) { p.s = s; sums++; }
  }
}
const out = head + 'export const POUVOIRS = [' + POUVOIRS.map((p) => JSON.stringify(p)).join(',\n') + '];\n';
writeFileSync(file, out, 'utf8');
console.log(`${POUVOIRS.length} pouvoirs (${added} ajoutés), ${sums} résumés ajoutés, ${POUVOIRS.filter((p) => !p.s).length} sans résumé`);
if (log.length) console.log(log.join('\n'));
