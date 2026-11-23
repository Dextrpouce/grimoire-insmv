// Construit js/data/hierarchie.js à partir des relevés de tools/hierarchie/sources/ :
//   regles.json (livret de règles, ch. 4 « La hiérarchie », p. 91-96),
//   superieurs-regles.json ou sup-part*.json (fiches des supérieurs, p. 96-119),
//   superieurs-bibles.json (fiches des Bibles à Dudule).
// usage : node tools/hierarchie/build-hierarchie.mjs <racine du projet>
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.argv[2] || '.';
const src = path.join(root, 'tools/hierarchie/sources');
const read = (f) => JSON.parse(readFileSync(path.join(src, f), 'utf8'));
const { SUPERIEURS } = await import(pathToFileURL(path.join(root, 'js/data/superieurs.js')).href);
const NOMS = new Set(SUPERIEURS.map((s) => s.n));
// Orthographe des livres → noms de l'appli
const ALIAS = { 'Dajjâl': 'Daiàl', 'Majûj': 'Majùj', 'Daiàl': 'Daiàl', 'Majùj': 'Majùj' };

const regles = read('regles.json');
let fiches = {};
if (existsSync(path.join(src, 'superieurs-regles.json'))) fiches = read('superieurs-regles.json');
else for (const f of readdirSync(src).filter((x) => /^sup-part\d+\.json$/.test(x)).sort()) Object.assign(fiches, read(f));
const bibles = read('superieurs-bibles.json');

// Difficulté d'invocation (texte du livre) → clé de R.DIFFICULTES
const DIFF = [[/l[ée]gendaire/i, 'legendaire'], [/incroyable/i, 'incroyable'], [/tr[èe]s\s+difficile/i, 'tres'], [/difficile/i, 'difficile'], [/facile/i, 'facile']];
const diffKey = (s) => (s == null ? null : (DIFF.find(([re]) => re.test(String(s))) || [null, null])[1]);

const SUP = {}; const inconnus = [];
for (const [nom, v] of Object.entries({ ...fiches, ...bibles })) {
  const n = ALIAS[nom] || nom;
  if (!NOMS.has(n)) { inconnus.push(nom); continue; }
  // Le livre donne les blâmes en trois tranches (1-2, 3-4, 5-6) : on les étend aux six faces du d6
  let blames = Array.isArray(v.blames) ? v.blames.map((b) => (b == null ? null : String(b).replace(/^\s*\d(\s*-\s*\d)?\s*[:.)]\s*/, ''))) : null;
  if (blames && blames.length === 3) blames = blames.flatMap((b) => [b, b]);
  SUP[n] = {
    grades: Array.isArray(v.grades) && v.grades.some(Boolean) ? v.grades : null,
    inv: v.invocation ?? null, invKey: diffKey(v.invocation),
    com: v.communication ?? null,
    intervention: v.intervention || null,
    blames: blames && blames.some(Boolean) ? blames : null,
    combat: v.combat || null,
    page: v.page || null,
  };
}
const manquants = [...NOMS].filter((n) => !SUP[n]);
const js = `// Généré par tools/hierarchie/build-hierarchie.mjs : ne pas modifier à la main.
// Hiérarchie (livret de règles INS/MV 4e, ch. 4 « La hiérarchie » p. 91-96, fiches des supérieurs p. 96-119, Bibles à Dudule).
// Textes résumés ; chiffres et tables relevés sur les livres.
export const HIERARCHIE = ${JSON.stringify(regles, null, 1)};
// Par supérieur : grades (titres des grades 1-3), inv (difficulté d'invocation) et invKey (clé de R.DIFFICULTES),
// com (facteur de communication), intervention, blames (table d6), combat, page
export const SUP_HIER = ${JSON.stringify(SUP, null, 1)};
`;
writeFileSync(path.join(root, 'js/data/hierarchie.js'), js, 'utf8');
console.log(Object.keys(SUP).length, 'supérieurs ;', 'sans fiche :', manquants.join(', ') || 'aucun', '; noms inconnus :', inconnus.join(', ') || 'aucun');
console.log('sans difficulté reconnue :', Object.entries(SUP).filter(([, v]) => v.inv && !v.invKey).map(([n, v]) => `${n} (${v.inv})`).join(', ') || 'aucun');
