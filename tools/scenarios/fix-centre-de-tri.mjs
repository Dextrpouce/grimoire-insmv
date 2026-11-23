// Remplace les fiches de remplissage de Monsieur Fabien, Gilbert et Aurélie (Fire and Ice, p. 24-26) dans les JSON de la campagne
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
const root = process.argv[2];
const R = await import(pathToFileURL(root + '/js/rules.js').href);
const L = (s) => R.parseLvl(String(s));
const car = (s) => { const v = s.split(' ').map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(', ').map((x) => { const m = x.match(/^(.*?) (\d\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 }; });
const REF = 'Fire and Ice, « Le Centre de Tri », p. 24-26';
const FICHES = {
  fabien: { re: /fabien/i, nom: 'Monsieur Fabien', source: 'Démon de Baalberith, grade 2 (chef du Centre de Tri)', type: 'demon', car: car('2 2 5 4 2 4'), def: 2, pp: 24, pfFix: 6, seuilsFix: [4, 8, 12, 16],
    armes: [{ n: 'Coup de poing', att: 2, prec: 0, puis: -3, melee: true }],
    pouvoirs: pows('Message officiel, Télépathie 5, Boomerang 3, Cauchemar 3, Onde de choc 2, Téléportation 2, Corps gazeux, Détection du futur proche 2, Volonté supra-normale 2'),
    talents: 'Métier (administration) 7, Discussion 6, Baratin 4 ; avantage matériel : le Centre de Tri',
    note: 'Vétéran débonnaire, pipe, anecdote laponne. Secret : remplacé par Beleth (« le Grand Imposteur ») quelques semaines après l\'arrivée des PJ.' },
  gilbert: { re: /gilbert/i, nom: 'Gilbert', source: 'Démon de Morax, grade 1 (Centre de Tri)', type: 'demon', car: car('3 2 4 4 3 3'), def: 2, pp: 18, pfFix: 7, seuilsFix: [5, 10, 15, 20],
    armes: [{ n: 'Coup de poing', att: 2, prec: 0, puis: -3, melee: true }],
    pouvoirs: pows('Œuvre d\'art, Télépathie 4, Jet de flammes 2, Sommeil 2, Invisibilité 1, Vitesse 1, Vol 1'),
    talents: 'Tartiner de la poésie 7, Trier du courrier 3, Conduite 4, Pilotage 3, Tir 2+ ; avertissement sans frais : gentil',
    note: 'Délégué CGT, gardien des lettres non distribuées, poète médiocre, habitué de Chez Régis ; bavard une fois éméché. Secret : s\'est perdu un jour dans un dédale lumineux sous les caves.' },
  aurelie: { re: /aur[ée]lie/i, nom: 'Aurélie', source: 'Démon de Baalberith, grade 0 (secrétaire du Centre de Tri)', type: 'demon', car: car('3 3 3 5 2 2'), def: 2, pp: 10, pfFix: 8, seuilsFix: [5, 10, 15, 20],
    armes: [{ n: 'Corps à corps', att: L('3+'), prec: 0, puis: -3, melee: true }],
    pouvoirs: pows('Message officiel, Charme 2+, Lire les pensées 2, Télépathie 1, Polymorphie 1'),
    talents: 'Corps à corps 3+, Baratin 4+, Hobby (vélo) 3',
    note: 'Secrétaire bavarde et épuisante, chef en second ; fait chaque matin à vélo la tournée des boîtes aux lettres secrètes. Secret : membre infiltrée du Daemonis Maleficum, meurtrière de Vanessa.' },
};
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
Object.values(FICHES).forEach((f) => f.pouvoirs.forEach((p) => { if (!known.has(p.n.toLowerCase())) console.warn('pouvoir inconnu', p.n); }));
const pick = (n) => Object.values(FICHES).find((f) => f.re.test(n.nom || ''));
let count = 0;
for (const file of readdirSync(root + '/scenarios').filter((f) => f.startsWith('fire-and-ice-'))) {
  const path = `${root}/scenarios/${file}`; const x = JSON.parse(readFileSync(path, 'utf8')); let c = 0;
  const fix = (n) => {
    const f = pick(n); if (!f || /beleth/i.test(n.nom)) return;
    const keep = (n.notes || '').split('\n').filter((l) => !/caract[ée]ristiques|estim|Source :/i.test(l)).join('\n');
    Object.assign(n, { nom: f.nom, source: f.source, type: f.type, car: { ...f.car }, def: f.def, pp: f.pp, pfFix: f.pfFix, seuilsFix: [...f.seuilsFix],
      armes: JSON.parse(JSON.stringify(f.armes)), pouvoirs: JSON.parse(JSON.stringify(f.pouvoirs)), talents: f.talents,
      notes: [keep, f.note, `Caractéristiques : ${REF}.`].filter(Boolean).join('\n') });
    c++;
  };
  x.scenarios.forEach((s) => s.scenes.forEach((sc) => sc.npcs.forEach(fix)));
  x.bestiaire.forEach(fix);
  if (c) { writeFileSync(path, JSON.stringify(x, null, 2), 'utf8'); console.log(file, ':', c, 'fiche(s) corrigée(s)'); count += c; }
}
console.log('Total', count);
