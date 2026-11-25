// Construit js/data/tables-mj.js à partir des relevés de tools/tables/sources/*.json (tableaux de tables).
// Vérifie les ids, les dés et la couverture des plages (trous, chevauchements).
// usage : node tools/tables/build-tables.mjs <racine du projet>
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.argv[2] || '.';
const src = path.join(root, 'tools/tables/sources');
const { SUPERIEURS } = await import(pathToFileURL(path.join(root, 'js/data/superieurs.js')).href);
const SUPS = new Set(SUPERIEURS.map((s) => s.n));
const ALIAS = { 'Dajjâl': 'Daiàl', 'Majûj': 'Majùj' };
// Ordre d'affichage des rubriques (les autres suivent)
const ORDRE = ['Morts et Marches', 'Événements', 'PNJ et ambiance', 'Intrigues', 'Cadeaux bonus'];
const VALUES = {
  d6: [1, 2, 3, 4, 5, 6], '2d6': [...Array(11)].map((_, i) => i + 2), '3d6': [...Array(16)].map((_, i) => i + 3),
  d66: [1, 2, 3, 4, 5, 6].flatMap((a) => [1, 2, 3, 4, 5, 6].map((b) => a * 10 + b)),
  d666: [1, 2, 3, 4, 5, 6].flatMap((a) => [1, 2, 3, 4, 5, 6].flatMap((b) => [1, 2, 3, 4, 5, 6].map((c) => a * 100 + b * 10 + c))),
};
const range = (s) => {
  s = String(s).trim(); let m;
  if ((m = s.match(/^(-?\d+)\s*\+$/))) return [+m[1], Infinity];
  if ((m = s.match(/^(-?\d+)\s*[-–à]\s*(-?\d+)$/))) return [+m[1], +m[2]];
  if ((m = s.match(/^(-?\d+)\s*-$/))) return [-Infinity, +m[1]];
  return [+s, +s];
};
const all = []; const warn = [];
for (const f of readdirSync(src).filter((x) => x.endsWith('.json')).sort()) {
  for (const t of JSON.parse(readFileSync(path.join(src, f), 'utf8'))) {
    if (!t?.id || !Array.isArray(t.lignes) || !t.lignes.length) { warn.push(`${f} : table sans id ou sans lignes (${t?.nom})`); continue; }
    if (all.some((x) => x.id === t.id)) { warn.push(`${f} : id en double ${t.id}`); continue; }
    if (t.sup) { t.sup = ALIAS[t.sup] || t.sup; if (!SUPS.has(t.sup)) warn.push(`${t.id} : supérieur inconnu ${t.sup}`); }
    // dé absent : table de consultation (lue selon une valeur, sans tirage)
    t.de = t.de === '' || t.de == null ? 'ref' : String(t.de).toLowerCase();
    const vals = VALUES[t.de];
    if (vals) {
      const rs = t.lignes.map((l) => range(l.d));
      const holes = vals.filter((v) => !rs.some(([a, b]) => v >= a && v <= b));
      const dbl = vals.filter((v) => rs.filter(([a, b]) => v >= a && v <= b).length > 1);
      if (holes.length) warn.push(`${t.id} (${t.de}) : valeurs sans ligne ${holes.slice(0, 8).join(', ')}${holes.length > 8 ? '…' : ''}`);
      if (dbl.length) warn.push(`${t.id} (${t.de}) : valeurs en double ${dbl.slice(0, 8).join(', ')}`);
    }
    all.push({ id: t.id, nom: t.nom, groupe: t.groupe || 'Divers', livre: t.livre || '', ref: t.ref || '', de: t.de, camp: t.camp || '',
      ...(t.sup ? { sup: t.sup } : {}), usage: t.usage || '', mods: t.mods || '', lignes: t.lignes.map((l) => ({ d: String(l.d), t: l.t, ...(l.camp ? { camp: l.camp } : {}) })), note: t.note || '' });
  }
}
const rank = (g) => { const i = ORDRE.indexOf(g); return i < 0 ? ORDRE.length : i; };
all.sort((a, b) => rank(a.groupe) - rank(b.groupe) || a.groupe.localeCompare(b.groupe, 'fr') || (a.sup || '').localeCompare(b.sup || '', 'fr'));
writeFileSync(path.join(root, 'js/data/tables-mj.js'), `// Généré par tools/tables/build-tables.mjs : ne pas modifier à la main.
// Tables aléatoires du MJ relevées dans les livres (résultats résumés, chiffres exacts).
export const TABLES_MJ = ${JSON.stringify(all, null, 1)};
`, 'utf8');
console.log(all.length, 'tables ;', [...new Set(all.map((t) => t.groupe))].join(' | '));
if (warn.length) console.log('À vérifier :\n' + warn.join('\n'));
