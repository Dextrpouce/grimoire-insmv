// Génère le fichier d'import « insmv-scenario » pour « Le spartiate noir » (Les Petites Apocalypses, ch. 13, p. 112-114)
// usage : node gen-petites-apocalypses-8-spartiate-noir.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Les Petites Apocalypses, ch. 13 « Le spartiate noir » (mini-scénario), p. 112-114';
const L = (s) => R.parseLvl(String(s));
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
const ARMES = new Map(R.ARMES.flatMap(([g, l]) => l.map((x) => [x[0], { prec: x[1], puis: x[2], melee: R.MELEE_GROUPS.includes(g) }])));
// arme de la table des règles : nom affiché, nom dans la table, niveau du talent
const arme = (n, table, lvl) => { const w = ARMES.get(table); if (!w) throw new Error('arme inconnue : ' + table); return { n, att: L(lvl), ...w }; };
// attaque au format des livres « seuil/RU+X/M+Y »
const livre = (n, x, y, melee = true) => ({ n, att: x * 2, prec: 0, puis: y, melee });
const poing = (lvl) => arme('Coup de poing', 'Coup de poing', lvl);
const P = 'pa8-'; let n = 0; const id = (k) => P + k;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [poing(1)], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});
const MINI = 'Pas de caractéristiques dans le livre : fiche minimale (valeurs humaines moyennes par défaut).';

// ---------------- PNJ chiffrés ----------------
const medee = npc('medee', {
  nom: 'Médée (Clémentine Pinares)', source: 'Sorcière païenne, manipulatrice du spartiate noir', car: car('2+ 3 2 5 4 3'), def: L(4),
  pp: 10, pfFix: 7, seuilsFix: seuils('4/8/12/16'),
  armes: [poing(2)],
  pouvoirs: pows('Champ de force 4, Charme 4, Détection du danger 2, Volonté supra-normale 2'),
  talents: 'Baratin 4, Corps à corps 2, Défense 4, Discrétion 3, Discussion 5, Séduction 5 ; Basse sorcellerie 8, Haute sorcellerie 6, Pentacle 4, Invocation 6, Demande 6, Contrôle 6, Lien 4',
  notes: `Mangeuse d'hommes à travers toutes ses incarnations : humains, surnaturels, héros païens. Possessive, jalouse, mythomane, sujette aux hallucinations ; jadis, elle découpait ses victimes et les faisait bouillir. Ses ex la fuient (changement de numéro, déménagement).
En panne de séduction depuis deux ans, elle craque : par sa sorcellerie (Contrôle), elle asservit son dernier amant, Iphiclès, lui coud un costume de spartiate noir et l'envoie tuer un à un ses prédécesseurs.
Méthodique : elle veut d'abord achever Casimir avant de passer au suivant. Face aux PJ, elle peut donner le change un moment et paraître saine d'esprit, puis leur envoie son pantin dès qu'ils sont partis.
Type « humain » dans l'application (sorcière) ; seuils, PF et PP du livre.`,
});
const iphicles = npc('iphicles', {
  nom: 'Iphiclès, le spartiate noir (Geoffroy Jeupleur-Delanège)', source: 'Ange de Didier, grade 2, jumeau d\'Hercule, contrôlé par Médée', type: 'ange', car: car('6 4 5 4 3 4'), def: L(7),
  pp: 29, pfFix: 10, seuilsFix: seuils('9/18/27/36'), prot: 5,
  armes: [livre('Épée magique mineure', 9, 10)],
  pouvoirs: pows('Caméléon 4, Couche de glace 4, Éclats de glace 4, Immunité contre le froid, Langage universel, Message officiel, Paralysie 4, Parasite intellectuel 4, Vitesse 6'),
  talents: 'Combat 5 (épées 8), Défense 7, Discussion 6, Enquête 6, Fouille 6, Séduction 3',
  notes: `Jumeau d'Hercule, presque identique à lui de visage. Mortel sans pouvoirs il y a près de deux mille ans, passé par le Purgatoire puis le Paradis, recruté par Didier comme simple ange ; il ignore son passé légendaire. Brave type un peu naïf : il a voulu rompre poliment avec Médée, qui l'a asservi.
En costume de spartiate noir et casque qui masque ses traits. Démasqué, il marque un temps d'arrêt (surpris et déstabilisé) puis fuit : les PJ croient avoir reconnu Hercule.
Équipement : épée magique mineure permanente (précision +2, puissance +4 ; 66/RU+9/M+10 dans le livre, reprise au format livre), armure magique permanente (protection 5, couverture importante, renforcée), talisman de Téléportation (utile pour fuir).`,
});
const hercule = npc('hercule', {
  nom: 'Hercule (Héraclès Merkios)', source: 'Héros romain, patron de la DTC', type: 'paien', car: car('7 5 5 5 5 6'), def: L(7),
  pp: 55, pfFix: 12, seuilsFix: seuils('9/19/27/36'),
  armes: [livre('Massue magique ancienne', 10, 16), poing(7)],
  pouvoirs: pows('Aura de courage 5, Champ de force 5, Contrôle des animaux 4, Immunité contre les maladies et les poisons, Membre blindé 5, Némésis 5, Régénération 5, Supériorité martiale 7, Vitesse 4, Vol 4'),
  talents: 'Athlétisme 9, Combat 6 (armes contondantes 8), Corps à corps 7, Défense 7, Discrétion 4, Discussion 6, Métier : businessman 6, Savoir occulte 3 (marches intermédiaires 7), Technique 5',
  notes: `Se moque d'abord de la rumeur, puis prend l'affaire au sérieux quand Casimir, qui peut payer, vient le voir. Soupçonné par les PJ : il n'a d'alibi ni pour l'agression de Casimir ni pour la bagarre. Clame son innocence, sur la défensive et très susceptible.
Peut se joindre à l'assaut final pour laver son honneur ; le sort d'Iphiclès le regarde.
Fiche reprise du ch. 4 (p. 21), comme dans le fichier de la campagne (massue : précision +4, puissance +9 ; 66/RU+10/M+16).`,
});

// ---------------- PNJ sans caractéristiques ----------------
const casimir = npc('casimir', {
  nom: 'Casimir Groulard', source: 'Psionique d\'envergure, client de la DTC, ex-amant de Médée', type: 'psi', car: car('2 2 2 3 2 2'),
  notes: `Agressé par le spartiate noir, il s'en sort de justesse grâce à ses pouvoirs, mais vit dans la peur. Il a de quoi payer : la rumeur devient une enquête officielle de la DTC.
Il connaît l'identité terrestre actuelle de Médée : leur liaison est récente et elle vient seulement de le laisser tranquille. C'est à peu près sa seule ennemie connue. Au MJ de le jouer pudique (il faut lui arracher les détails) ou parfaitement coopératif.
Appât idéal : Médée veut l'achever avant de passer au suivant.
${MINI}`,
});

const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  scene('rumeur', '1. La rumeur et le client', 'Milieu de la troisième Force, puis locaux de la DTC',
    `En coulisses : le spartiate noir tue discrètement les ex de Médée. Un témoin assiste un jour à une exécution ; son récit circule et grossit, et toute disparition d'un surnaturel est bientôt mise sur le compte du tueur en armure.
Les PJ peuvent entendre la rumeur au détour d'un autre scénario (Chez Régis, par exemple). Hercule en rit, jusqu'au jour où Casimir Groulard vient le voir : il a survécu de peu à une attaque et veut être protégé. Il paie : enquête officielle, confiée aux PJ. Mission : identifier l'assassin et l'arrêter.`,
    [inScene(hercule), inScene(casimir)]),
  scene('piste', '2. Sur la piste du spartiate', 'Paris : chez Casimir, archives, lieux des meurtres',
    `Peu d'indices : laisser les joueurs proposer leurs idées. Deux voies prévues :
• le piège : Médée tient à finir Casimir avant de passer au suivant ; s'en servir comme appât fait venir le spartiate ;
• Médée : Casimir peut donner l'identité actuelle de son ex (Clémentine Pinares). La liste partielle des victimes et une enquête de routine confirment qu'elles ont toutes été ses amants.`,
    [inScene(casimir)], false,
    [choice('piste', 'Quelle voie les PJ choisissent-ils ?', [
      ['Tendre un piège avec Casimir', 'Le spartiate noir vient achever Casimir : bagarre directe (scène 4).'],
      ['Aller voir Médée', 'Elle paraît saine d\'esprit et innocente (scène 3), puis envoie son spartiate sur les PJ.'],
    ])]),
  scene('visite', '3. Visite chez Médée', 'Domicile de Clémentine Pinares',
    `Médée fait un effort et donne le change : charmante, raisonnable, étonnée. Elle tient tant que l'entretien ne dure pas trop ; un PJ attentif peut sentir que quelque chose cloche.
Dès que les PJ sont partis, elle fulmine et lâche le spartiate noir sur eux.`,
    [inScene(medee)]),
  scene('bagarre', '4. Bagarre avec le spartiate noir', 'Selon la piste : chez Casimir, dans la rue après la visite chez Médée',
    `Combat contre Iphiclès en armure noire. Il ne doit pas poser trop de problèmes aux PJ, mais il doit s'enfuir (talisman de Téléportation, Vitesse, ou Médée cachée non loin qui l'aide).
Point clé : son casque tombe. Surpris et déstabilisé, il s'arrête un instant puis fuit. Les PJ, eux, viennent de voir le visage d'Hercule, et peuvent interpréter ce temps d'arrêt comme la gêne d'un coupable reconnu.`,
    [inScene(iphicles)], true),
  scene('retour-dtc', '5. Retour à la DTC', 'Locaux de la DTC',
    `Les PJ préviennent ou cuisinent Hercule, selon la confiance qu'ils lui accordent. Problème : il n'a pas d'alibi, ni pour la bagarre ni pour l'agression de Casimir. Il jure qu'il est innocent ; c'est le patron, les PJ ont intérêt à le croire. Scène à jouer avec un Hercule susceptible et sur la défensive.
Pistes de résolution : penser au jumeau, Iphiclès (contacter Alain, selon le livre, pour savoir où le trouver : il n'est pas chez lui, mais des photos de sa liaison avec Médée traînent) ; ou retourner directement chez Médée si les PJ ne l'ont pas crue.`,
    [inScene(hercule)], false,
    [choice('soupcon', 'Comment les PJ traitent-ils Hercule ?', [
      ['Ils le croient', 'Hercule, rassuré, peut proposer de les accompagner pour laver son honneur.'],
      ['Ils le soupçonnent', 'Ambiance tendue ; Hercule vexé. Il faudra prouver l\'existence du jumeau pour se racheter.'],
    ]),
    choice('voie', 'Par où les PJ remontent-ils à Médée ?', [
      ['Par Iphiclès', 'Ils pensent au jumeau, le cherchent et trouvent chez lui les photos de sa liaison avec Médée.'],
      ['Directement chez Médée', 'Ils ne l\'ont pas crue la première fois et y retournent.'],
    ])]),
  scene('final', '6. Résolution chez Médée', 'Domicile de Médée',
    `Médée est furieuse : son pantin s'est fait battre, on a vu son visage et il a même perdu son masque. Elle passe ses nerfs sur Iphiclès quand les PJ arrivent. Plus question de discuter : baston contre la sorcière et son spartiate.
Si Hercule accompagne les PJ, la bataille n'en est que plus épique.
Après : le sort d'Iphiclès regarde Hercule (et donc le MJ) ; libéré du contrôle, c'est un ange de Didier qui ne se souvient pas de ses actes. Médée, si elle survit, finit définitivement folle.`,
    [inScene(medee), inScene(iphicles), inScene(hercule)], true,
    [choice('iphicles', 'Que devient Iphiclès ?', [
      ['Libéré et confié à Hercule', 'Retrouvailles de jumeaux ; un ange de Didier qui découvre son passé légendaire, et un futur contact ou une complication.'],
      ['Tué dans la bataille', 'Hercule le prend très mal ; les anges de Didier voudront des explications.'],
    ]),
    choice('medee', 'Que devient Médée ?', [
      ['Tuée ou neutralisée', 'Fin des meurtres ; Casimir est sauvé et paie.'],
      ['Elle survit, folle à lier', 'Menace latente : elle pourrait revenir hanter les PJ ou ses autres ex.'],
    ])]),
];

const scenario = {
  id: 'pa8-spartiate-noir',
  nom: 'Petites Apocalypses – Le spartiate noir',
  resume: 'Mini-scénario pour agents de la troisième Force employés par la DTC d\'Hercule. Un tueur en armure de spartiate noir s\'attaque à des membres de la troisième Force. Casimir Groulard, psionique rescapé, engage la DTC. Le coupable est Iphiclès, jumeau d\'Hercule et ange de Didier, asservi par la sorcière Médée qui se venge de ses anciens amants. Démasqué, le tueur a le visage d\'Hercule : les PJ doivent démêler l\'affaire sans froisser leur patron, puis affronter Médée.',
  notes: `Source : ${REF}.

Structure : comme le Kiti-Kon, un mini-scénario peu détaillé, à placer entre deux scénarios ou au milieu d'un autre.
Le ressort : le coupable a les traits du patron. Hercule n'y est pour rien ; la bagarre doit laisser fuir le spartiate après que les PJ ont vu son visage, puis le retour à la DTC joue sur le doute et la susceptibilité d'Hercule.
Les victimes : les ex-amants de Médée, tués un par un, d'abord discrètement ; Casimir, le dernier rescapé, est la prochaine cible.

Adaptations : le ch. 14 (p. 115-116) ne propose rien pour ce mini-scénario. Suggestion : en MV, remplacer Hercule par le supérieur ou un ange connu des PJ ; Iphiclès, ange de Didier, rend l'affaire naturelle pour des anges de Didier. En INS, des démons peuvent vouloir exploiter (ou faire durer) la confusion entre les jumeaux.

Récompenses : le livre n'en donne pas. Suggestion : contrat payé par Casimir via la DTC, et la gratitude (ou la rancune) d'Hercule selon la façon dont il a été traité.

Fiches : Médée et Iphiclès reprises du livre (p. 112-113) ; Hercule repris du ch. 4 (p. 21) ; Casimir sans caractéristiques (fiche minimale).`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [medee, iphicles, hercule, casimir].map(asType);
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));
writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types,', scenes.reduce((a, s) => a + s.choix.length, 0), 'choix');
