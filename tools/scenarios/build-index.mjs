// Construit js/data/scenarios-livres.js : l'index des scénarios des livres (dossier scenarios/) affiché dans l'appli.
// usage : node tools/scenarios/build-index.mjs <racine du projet>
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const root = process.argv[2] || '.';
// Livres, dans l'ordre d'affichage : préfixe du fichier → titre et camp par défaut
const LIVRES = [
  ['fire-and-ice', 'Fire and Ice', 'INS'],
  ['jesus-reviens', 'Jésus Reviens !', 'MV'],
  ['angelots', 'Angelots en gelée', null],
  ['on-ferme', 'On Ferme !', null],
  ['petites-apocalypses', 'Les Petites Apocalypses', '3e Force'],
  ['livret-ins', 'Livre de base – livret INS', 'INS'],
  ['livret-mv', 'Livre de base – livret MV', 'MV'],
  ['ecran', 'Écran du maître', 'MV'],
];
// Camp des scénarios des recueils mixtes
const CAMPS = {
  'angelots-1': 'INS', 'angelots-2': 'MV', 'angelots-3': 'INS', 'angelots-4': 'MV', 'angelots-5': 'INS', 'angelots-6': 'MV', 'angelots-7': 'INS', 'angelots-8': 'MV',
  'on-ferme-1': 'MV', 'on-ferme-2': 'MV', 'on-ferme-3': 'INS',
};
const dir = path.join(root, 'scenarios');
const out = [];
for (const f of readdirSync(dir).filter((x) => x.endsWith('.json'))) {
  const x = JSON.parse(readFileSync(path.join(dir, f), 'utf8'));
  const s = x.scenarios[0]; const file = f.replace(/\.json$/, '');
  const li = LIVRES.findIndex(([p]) => file.startsWith(p + '-'));
  if (li < 0) { console.warn('livre inconnu pour', f); continue; }
  const num = +(file.slice(LIVRES[li][0].length + 1).match(/^\d+/) || [0])[0];
  const key = `${LIVRES[li][0]}-${num}`;
  const npcs = new Set(s.scenes.flatMap((sc) => sc.npcs.map((n) => n.typeId || n.nom)));
  out.push({
    file, id: s.id, nom: s.nom, livre: LIVRES[li][1], li, num, camp: CAMPS[key] || LIVRES[li][2] || '',
    resume: (s.resume || '').slice(0, 400), scenes: s.scenes.length, pnj: npcs.size,
    combats: s.scenes.filter((sc) => sc.combat && sc.npcs.length).length,
    choix: s.scenes.reduce((a, sc) => a + (sc.choix || []).length, 0),
  });
}
out.sort((a, b) => a.li - b.li || a.num - b.num);
const js = `// Généré par tools/scenarios/build-index.mjs : ne pas modifier à la main.
// Index des scénarios des livres (fichiers du dossier scenarios/, chargés à la demande).
export const SCENARIOS_LIVRES = ${JSON.stringify(out.map(({ li, ...r }) => r), null, 1)};
`;
writeFileSync(path.join(root, 'js/data/scenarios-livres.js'), js, 'utf8');
console.log(out.length, 'scénarios indexés');
