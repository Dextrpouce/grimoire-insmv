// Génère le fichier d'import « insmv-scenario » pour « La révolution n'est pas un dîner de gala » (Angelots en gelée, scénario 6, p. 88-97)
// usage : node gen-angelots-6-la-revolution.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const store = {}; globalThis.localStorage ??= { getItem: (k) => store[k] ?? null, setItem: (k, v) => { store[k] = v; }, removeItem: (k) => { delete store[k]; } };
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);
const S = await import(pathToFileURL(path.join(root, 'js/scenario.js')).href);

const REF = 'Angelots en gelée, « La révolution n\'est pas un dîner de gala » (P. Bouas), p. 88-97';
const L = (s) => R.parseLvl(String(s));
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
const ARMES = new Map(R.ARMES.flatMap(([g, l]) => l.map((x) => [x[0], { prec: x[1], puis: x[2], melee: R.MELEE_GROUPS.includes(g) }])));
const arme = (n, table, lvl) => { const w = ARMES.get(table); if (!w) throw new Error('arme inconnue : ' + table); return { n, att: L(lvl), ...w }; };
const poing = (lvl) => arme('Coup de poing', 'Coup de poing', lvl);
// attaque au format du livre (seuil, RU+X, M+Y) : att = X×2, précision 0, puissance Y
const bk = (n, x, y, melee) => ({ n, att: x * 2, prec: 0, puis: y, melee });
const P = 'ag6-'; let n = 0; const id = (k) => P + k;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [poing(1)], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});
// fiche toute prête du bestiaire de l'application
const fromBest = (key, bookId, o = {}) => {
  const b = S.BOOK.find((x) => x.id === 'livre-' + bookId); if (!b) throw new Error('bestiaire : ' + bookId);
  return { ...JSON.parse(JSON.stringify(b)), id: id(key), qty: 1, ...o, notes: [o.notes, b.notes, `Utilisé dans : ${REF}.`].filter(Boolean).join('\n') };
};
const SANS = 'Pas de caractéristiques dans le livre : fiche minimale (humain moyen, niveau 2 partout, coup de poing niveau 1).';
const ATT_NOTE = 'Attaques au format du livre (seuil, RU+X, M+Y) : attaque = X×2, puissance Y.';

// ---------------- PNJ chiffrés du livre (p. 95-97) ----------------
const pilar = npc('pilar', {
  nom: 'Sœur Pilar Mantes', source: 'Fausse vierge miraculeuse et vraie succube (novice de 17 ans, mission de Santa Lucia)', type: 'demon',
  car: car('2 3 4 3 4 3'), def: L(2), pp: 10, pfFix: 5, seuilsFix: seuils('4/8/12/16'),
  armes: [poing(1)],
  pouvoirs: pows('Aura de pacification 1, Gag absurde 1, Illusions 3, Régénération 1'),
  talents: 'Baratin 4, Défense 2, Prestidigitation 4, Survie 2 (altiplano 3), Simuler des crises mystiques 2, Rêver d\'Hollywood 2+',
  notes: `Métisse abandonnée, recueillie par les sœurs. Succube qui s'ignore : elle se croit mutante (façon comics), ne croit pas en Dieu et simule ses stigmates à Noël avec ses illusions pour faire venir les dons à l'orphelinat. Rêve de La Paz et de cinéma. Son aura se grise par endroits : elle est aux limites de l'apostasie.
Si on lui laisse découvrir le Grand Jeu, elle sera terrifiée d'appartenir au Mal et se fera violence pour rejoindre les anges ; les PJ peuvent aussi l'exécuter, à eux d'assumer (le village l'adore).
Le livre donne « Aura d'apaisement 1 » : rendu par Aura de pacification, le pouvoir le plus proche des règles. Aucune attaque dans le livre : coup de poing niveau 1 estimé. PS 5 du livre pris comme PF.
Équipement : tenue de nonne en piètre état, illusions sur le monde.`,
});
const ramon = npc('ramon', {
  nom: 'Ramon « el perro » Carne', source: 'Démon de Caym, grade 2 (commandant du Commando Jaguar, vétéran du plan Condor)', type: 'demon',
  car: car('4 4 4 3 2 3'), def: L(6), pp: 25, pfFix: 7, seuilsFix: seuils('6/12/18/24'),
  armes: [bk('Griffes', 6, 8, true), bk('M-16', 4, 5, false)],
  pouvoirs: pows('Augmentation de Perception 3, Caméléon 3, Éventration 3, Membre exotique : griffes, Transformation 2'),
  talents: 'Combat 6, Défense 6, Discrétion 6, Tir 3 (arme d\'assaut 6), Savoir militaire 3 (représailles sur les civils 4), Hobby (tresser des colliers d\'oreilles) 2, Survie 3 (Altiplano 4)',
  notes: `Chasseur d'hommes sadique ; fait très bien le lama (Transformation) pour observer les PJ. Suit les PJ à une demi-journée avec Nicanor et des hommes du Commando Jaguar (cinq jeeps). Avec Abigaël, un jeu de quinze ans : celui qui a fait le plus de victimes civiles dans l'année se fait offrir le dîner de Noël.
Le livre donne « Augmentation temporaire de perception 3 » : rendu par Augmentation de Perception.
${ATT_NOTE}
Équipement : tête de gendre idéal, bel uniforme, nombreuses médailles.`,
});
const abigael = npc('abigael', {
  nom: 'Abigaël Linarès', source: 'Démon de Nisroch, grade 2 (narco, ancien du Sentier Lumineux)', type: 'demon',
  car: car('3 4 4 5 3 3'), def: L(6), pp: 25, pfFix: 7, seuilsFix: seuils('5/10/15/20'),
  armes: [bk('Langue barbelée', 4, 6, true), bk('Kalachnikov', 4, 5, false)],
  pouvoirs: pows('Accoutumance 3, Caméléon 3, Corps gazeux, Esquive acrobatique 2, Membre exotique : langue barbelée, Polymorphie 2'),
  talents: 'Baratin 6, Combat 4, Défense 6, Discrétion 4, Tir 3 (armes d\'assaut 6), Hobby (inventer des citations marxistes) 3+, Savoir criminel 2 (narco guérilla 6), Savoir militaire 2 (guérilla 3), Survie 3 (altiplano 4)',
  notes: `Dernier démon de Nisroch survivant après que Douglas a massacré les autres : au lieu de se venger, il s'est associé aux démons du coin pour manipuler l'ange. Harcèle les PJ avec une douzaine d'hommes et des snipers guaranis, pour s'amuser plutôt que pour tuer ; paie des gamins pour glisser de la cocaïne dans leurs affaires puis les dénonce.
${ATT_NOTE}
Équipement : petit livre rouge, sac de cocaïne, kalachnikov.`,
});
const nicanor = npc('nicanor', {
  nom: 'Nicanor Duende', source: 'Démon de Malphas, grade 2 (écrivain mondain, bras droit de Suarez)', type: 'demon',
  car: car('2 3 5 5 4 5'), def: L(4), pp: 29, pfFix: 7, seuilsFix: seuils('4/8/12/16'),
  armes: [bk('Jet de flammes', 7, 4, false)],
  pouvoirs: pows('Corps gazeux, Esprits multiples 2, Discorde 5, Jet de flammes 2, Rêve 4, Volonté supra-normale 3'),
  talents: 'Aisance sociale 7, Baratin 6, Défense 4, Tir 2+ (jet de flammes 3+), Hobby (embrouiller les PJ) 4+, Métier (devenir votre ami) 7+',
  notes: `Dandy au look de retraité de la salsa, ami de tout le monde, entremetteur entre Douglas et le gratin bolivien. Entretient la discorde entre Douglas et Tupac (il était témoin de leur brouille) et cherche à faire tuer l'un des deux anges par les PJ, idéalement les deux. A refait la mémoire de Buddy. Fuit dès que ça tourne mal.
Le livre écrit « Esprit multiple 2 » : nom des règles, Esprits multiples.
${ATT_NOTE}
Équipement : panama, chemise décontractée, sourire fripé, lunettes noires, canne de dandy.`,
});
const suarez = npc('suarez', {
  nom: 'Alberto Suarez', source: 'Démon d\'Uphir, grade 2 (ministre de l\'Agriculture de Bolivie)', type: 'demon',
  car: car('4 3 3 5 4 4'), def: L(4), pp: 29, pfFix: 7, seuilsFix: seuils('6/12/18/24'),
  armes: [bk('Tentacules', 7, 5, true)],
  pouvoirs: pows('Esprits multiples 2, Graisse 3, Jet d\'acide 3, Membre exotique : tentacules, Peau acide 3, Vengeance toxique 3, Volonté supra-normale 3'),
  talents: 'Aisance sociale 7, Baratin 6, Combat 5, Défense 4, Tir 1+ (jet d\'acide 5), Métier (détruire le monde) 3+, Savoir criminel 2 (politique 6), Science 2 (chimie 4)',
  notes: `Le grand méchant : escroc, élu véreux, secrétaire d'État, puis ministre. Veut devenir président provisoire à la prochaine crise pour faire épandre des milliers de tonnes de défoliant (la « malédiction de Choquenard & Faugne ») sous prétexte de lutte anti-coca. Retiré à Santa-Cruz pendant les troubles (« au chevet de sa mère »), injoignable.
Jet d'acide : pouvoir sans attaque chiffrée dans le livre (Tir jet d'acide 5), à gérer avec le pouvoir.
Le livre écrit « Esprit multiple 2 » : nom des règles, Esprits multiples.
${ATT_NOTE}
Équipement : costume hors de prix, carnet d'adresses fourni, belle tête de méchant.`,
});
const douglas = npc('douglas', {
  nom: 'Douglas Backtouch', source: 'Ange de Laurent, grade 1 (commandant américain de la DEA ; nom d\'ange : Potdemiel)', type: 'ange',
  car: car('5 5 4 2 3 4'), def: L(5), pp: 23, pfFix: 7, seuilsFix: seuils('8/16/24/32'),
  armes: [bk('Sabre de cavalerie', 7, 7, true), arme('Fusil-mitrailleur', 'Fusil-mitrailleur', 5)],
  pouvoirs: pows('Aura de courage 3, Champ de force 3, Juste-lame 4, Lumière céleste 3'),
  talents: 'Combat 4 (épées 7), Défense 5, Tir 3 (armes automatiques 5), Savoir militaire 2 (Chargez ! 4), Se faire rouler dans la farine 4+, Jouer des chansons country à la guitare 2+',
  notes: `Brave crétin, pieux, bavard, à la tête d'une centaine d'agents (soldats de Dieu à diplomates). Croit que Tupac est le coupable de tout et que Suarez est un ministre intègre ; il est l'indic inconscient des démons. Prépare avec Suarez l'épandage d'un défoliant « qui ne touche que la coca ». Brouillé avec Tupac pour le surnom d'« El lobo ».
À la fin : difficile à motiver, mais s'il a la preuve que Suarez et Nicanor sont des démons, il sera le premier à charger.
Le livre écrit « Juste lame » : nom des règles, Juste-lame. PS 7 du livre pris comme PF. Fusil automatique estimé (Tir armes automatiques 5, arme de la table).
${ATT_NOTE}
Équipement : lunettes de poseur, bel uniforme, idées préconçues sur les indiens, guitare sèche, nostalgie du Colorado.`,
});
const tupac = fromBest('tupac', 'ange-michel-1-guerilla', {
  nom: 'Tupac « el lobo »', source: 'Ange de Michel, grade 1 (guérillero aymara, chef de l\'ELP)',
  notes: `Robin des bois de l'Altiplano : braquages et détournements de camions de vivres au profit des pauvres. Vit caché dans un hameau abandonné de cinq maisons avec une demi-douzaine de soldats de Dieu peu orthodoxes ; peut lever quatre cents volontaires mal armés. Ami de Marco Moralès. Déteste Douglas depuis leur brouille sur le surnom « El lobo » et le mitraillage de son camp par la DEA.
Défense non donnée par le livre (valeur du bestiaire).
Équipement : poncho miteux, bonnet andin, kalachnikov, idées préconçues sur les gringos, photo du Che.`,
});
const combat = fromBest('combat-uphir', 'demon-combat-uphir', {
  nom: 'Az\'ed\'eff et Toho T\'aal', source: 'Démons de combat d\'Uphir (gardiens du stock de Maldita Cruz)', qty: 2,
  notes: 'Deux horreurs vertes et gluantes à tentacules, qui vivent comme des bêtes dans le sous-sol interdit au personnel et gardent le stock de défoliant. Lâchés contre les PJ par Choquenard ou le familier.',
});
const viiv = npc('viiv', {
  nom: 'Viiv\' n\' dyys', source: 'Familier de Suarez (shoggoth de table)', type: 'familier',
  car: car('1 3 3 3 2 3'), def: L(3), pp: 8, pfFix: 4, seuilsFix: seuils('2/5/7/10'),
  armes: [],
  pouvoirs: pows('Élastique 1, Télépathie 2'),
  talents: 'Défense 3, Discrétion 3, Onduler sur des rythmes antédiluviens 2+',
  notes: `Posé comme une idole impie sur le bureau de Choquenard, qui le prend pour une divinité venue de Pluton ; téléguide les deux polytechniciens et prévient les démons par télépathie au moindre problème.
Ressemble à une éponge de bain couverte d'yeux et de petits tentacules. Pas d'attaque dans le livre.
Le livre écrit « Élasticité 1 » : nom des règles, Élastique. PS 4 du livre pris comme PF.`,
});
const indio = npc('indio', {
  nom: 'Indio typique', source: 'Villageois aymara ou quechua', qty: 6,
  car: car('2+ 2 2 2 2 2+'), def: L('1+'), pfFix: 4, seuilsFix: seuils('3/7/10/13'),
  armes: [poing(1)],
  talents: 'Défense 1+, Maudire ces enfoirés de gringos 2, Rêver d\'avoir un pick-up 2, Savoir occulte 1 (catholicisme maison 2), Survie 2 (altiplano 3), Technique 1 (mécanique 2)',
  notes: 'Analphabète mais accueillant ; très catholique et fidèle à Pachamama. Prêt à l\'irréparable pour défendre sa « sainte ». Pas d\'attaque dans le livre : coup de poing niveau 1 estimé.\nÉquipement : poncho, couvertures en laine de lama, chapeau ridicule.',
});

// ---------------- Troupes sans caractéristiques (estimées) ----------------
const jaguars = npc('jaguars', {
  nom: 'Commando Jaguar', source: 'Forces spéciales boliviennes de Ramon (humains)', qty: 6, car: car('2+ 3 2+ 2 2 2'), def: L(3), pfFix: 4, seuilsFix: seuils('3/7/10/14'),
  armes: [arme('M-16', 'Fusil-mitrailleur', 3), arme('Couteau de combat', 'Poignard ou saï', 3)],
  talents: 'Athlétisme 3, Combat 3, Conduite 3, Défense 3, Discrétion 3, Savoir militaire 2, Survie 2 (altiplano 3), Tir 3',
  notes: 'Unité d\'élite de Ramon ; cinq jeeps suivent les PJ à une demi-journée. Gardent aussi le parlement à la fin.\nAucune caractéristique dans le livre : profil de soldat d\'élite entièrement estimé (proche des miliciens de l\'écran, mieux armés).',
});
const narcos = npc('narcos', {
  nom: 'Narcos d\'Abigaël', source: 'Narco-guérilleros (douzaine d\'hommes, dont des snipers guaranis)', qty: 6, car: car('2+ 2 2+ 2 2 2'), def: L(2), pfFix: 4, seuilsFix: seuils('3/7/10/14'),
  armes: [arme('Kalachnikov', 'Fusil-mitrailleur', 2), arme('Fusil à lunette (snipers)', 'Fusil à lunette', 3)],
  talents: 'Athlétisme 2, Conduite 2, Défense 2, Discrétion 2, Survie 2 (jungle 3), Tir 2 (fusil à lunette 3)',
  notes: 'Tirent de très loin pour harceler, pas pour tuer ; plus de dégâts collatéraux que de mal aux anges. Montent l\'embuscade routière si l\'équipe a l\'air dangereuse.\nAucune caractéristique dans le livre : profil entièrement estimé.',
});
const mercenaires = npc('mercenaires', {
  nom: 'Mercenaires de Maldita Cruz', source: 'Soldats de fortune anglophones (une douzaine)', qty: 6, car: car('2+ 2+ 2 2 2 2'), def: L(3), pfFix: 4, seuilsFix: seuils('3/7/10/14'),
  armes: [arme('Fusil d\'assaut', 'Fusil-mitrailleur', 3), poing(3)],
  talents: 'Athlétisme 3, Corps à corps 3, Défense 3, Savoir militaire 2, Tir 3, Vigilance 2',
  notes: 'Gardent le site depuis des années ; Choquenard n\'hésite pas à les sacrifier en diversion. Ils ignorent l\'existence des démons de combat.\nAucune caractéristique dans le livre : profil entièrement estimé.',
});
const elp = fromBest('elp', 'ecran-section-legere', {
  nom: 'Soldats de Dieu de l\'ELP', source: 'Armée de libération populaire de Tupac (demi-douzaine)', qty: 6,
  notes: 'Soldats de Dieu peu orthodoxes, qui craignent encore les esprits de l\'Altiplano et sacrifient bière et cigarettes à Pachamama. Le livre ne les chiffre pas : profil « section légère » de l\'écran du maître, à équiper de kalachnikovs au besoin.',
});

// ---------------- PNJ sans caractéristiques ----------------
const greta = npc('greta', {
  nom: 'Greta Banzer', source: 'Femme d\'affaires bolivienne, société de chimie Banzer (quarante ans)',
  talents: 'Baratin 4 (estimé)',
  notes: `Ronde et blonde, héritière d'un grand-père qui a fui l'Allemagne. Fournit le défoliant : Suarez lui cède pour rien de « vieux fonds de cuves » qu'elle réétiquette et revend à l'État, et ils partagent. Elle ignore que c'est un produit expérimental d'Uphir. A été interrogée en cachette par Stanley et Livingstone. Percée à jour, elle avoue et donne le site de reconditionnement (sous-traité à Air Conditioned Sky).\n${SANS} Talent estimé.`,
});
const alcazar = npc('alcazar', {
  nom: 'Esteban Alcazar', source: 'Lieutenant-colonel de l\'armée bolivienne, seul ami sincère de Douglas',
  armes: [arme('Pistolet de service', 'Revolver gros calibre', 2)],
  notes: `Jeune, ambitieux mais intègre, veut lutter contre le trafic sans écraser la population ; redoute l'ordre de tirer sur les manifestants. Demande aux PJ de dissuader Douglas d'épandre le défoliant. Prend du grade à chaque retour des PJ à La Paz, jusqu'à général à la fin : un allié précieux, voire un bon candidat à la présidence.\n${SANS} Arme de service estimée.`,
});
const rosalia = npc('rosalia', {
  nom: 'Mère Rosalia', source: 'Vieille mère supérieure de la mission de Santa Lucia',
  notes: `Sait que Pilar simule ses stigmates et s'en accommode (elle en est en partie l'instigatrice, pour faire vivre la mission) ; serait la première surprise d'apprendre que c'est de la vraie magie, donc une diablerie. Aime Pilar comme sa fille. Méfiante envers des étrangers qui se disent envoyés du Très-Haut.\n${SANS}`,
});
const buddy = npc('buddy', {
  nom: 'Buddy', source: 'Touriste australien, la quarantaine, plein aux as',
  notes: `Exaspérant, parle fort de son zoom. Prétend avoir pris dans son bus, dix jours plus tôt, deux prêtres et un indien en panne dans la Cordillera Real, descendus à Choruro pour voir Tupac. Faux témoin : Nicanor lui a refait la mémoire pour accuser Tupac.\n${SANS}`,
});
const choquenard = npc('choquenard', {
  nom: 'Paul Choquenard', source: 'Polytechnicien français dément, adorateur d\'Uphir, patron de Maldita Cruz',
  talents: 'Science 4 (chimie, estimé)',
  notes: `Gère la mise en fûts du défoliant avec Faugne pour leur société Air Conditioned Sky ; prend le familier de Suarez pour une divinité de Pluton. Son bureau contient tout : effets du produit, implication et vraie nature de Suarez, et un dossier pour faire chanter Greta Banzer. Lâche les démons de combat ou les gardes sans scrupule.\n${SANS} Talent estimé.`,
});
const faugne = npc('faugne', {
  nom: 'Faugne', source: 'Condisciple de Choquenard, adorateur d\'Uphir',
  notes: `Recruté dans l'annuaire des anciens de Polytechnique ; co-inventeur de la « malédiction de Choquenard & Faugne ».\n${SANS}`,
});
const carmelito = npc('carmelito', {
  nom: 'Carmelito', source: 'Jeune homme de Huallap',
  notes: `A hébergé Stanley, Livingstone et Chico, partis de nuit vers Maldita Cruz pour ne jamais revenir. Ne parle qu'en rendez-vous secret dans la montagne, après que les PJ ont gagné la confiance du village, et supplie qu'on n'attire pas les représailles de l'armée.\n${SANS}`,
});
const brandon = npc('brandon', {
  nom: 'Brandon O\'Fish', source: 'Jeune clairon parachutiste de Douglas (soldat de Dieu)', type: 'soldat',
  notes: `Enthousiaste, joue du clairon à l'arrivée des PJ ; il faut le frapper pour qu'il se taise. Reste à attendre les secours après l'explosion du camion.\n${SANS}`,
});
const morales = npc('morales', {
  nom: 'Marco Moralès', source: 'Leader syndicaliste aymara, candidat déçu à la présidence',
  notes: `Ami de Tupac, coordonne les manifestations à La Paz. Simple humain… ou, si le MJ veut, agent du Sanctuaire (voir Les Petites Apocalypses).\n${SANS}`,
});

const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  scene('mission', '1. La niña santa', 'Cafétéria de Roissy, puis vol Delta pour La Paz',
    `Briefing : un bagagiste bègue confie la mission au nom de Notre-Dame. Une novice indienne, sœur Pilar Mantes (17 ans, mission de Santa Lucia à Chacomambo, 200 km à l'est de La Paz), aurait des stigmates chaque Noël. Les pères Stanley (ange de Dominique) et Livingstone (ange de Joseph), envoyés enquêter avec un guide novalis drogué nommé Chico, ne donnent plus de nouvelles depuis dix jours : on craint une mort violente. Un ange de Laurent les accueillera.
La malle remise : appareils photo, guides, sombreros, dossier sur les trois disparus (vertus mais pas pouvoirs).
Arrivée : La Paz, 4000 m, froid, pays en ébullition, personne ne porte de sombrero.
Règle « Vamos a la playa » : un ange qui veut apprendre l'espagnol pendant le voyage réussit un jet difficile de Volonté (automatique à Volonté 4 ou plus) ; il ne note pas la langue mais peut se débrouiller.

Contexte MJ : Suarez, ministre de l'Agriculture et démon d'Uphir, veut devenir président provisoire et épandre un défoliant toxique. Il attend cette seconde équipe de pied ferme.`),
  scene('aeroport', '2. America perdida', 'Aéroport de La Paz, puis QG de Douglas (ancien hôtel)',
    `Accueil par une haie de bérets verts, Douglas Backtouch (ange de Laurent, commandant américain) et le clairon Brandon O'Fish.
Le camion de Douglas explose au démarrage : blessure légère pour tous (truquer les dés ; une détection du danger « ne marche pas »). C'est un test des démons pour vérifier que les arrivants sont des anges ; ils n'étaient pas vraiment visés. Parmi les hommes de Douglas, des blessés et un mort (un expert du FMI, par infarctus).
Douglas accuse aussitôt Tupac (ange déviant de Michel, lié selon lui à Nisroch et à la 3e Force). Au QG, il équipe les PJ d'une jeep et d'armes, prière et Évangile à l'appui. Il est fier de son unité spéciale de la DEA contre la coca, curieux de la mission des PJ, et pense que Tupac a tué les prêtres (avec la complicité de Chico). Pour lui, Pilar est une affabulation d'indiens superstitieux.`,
    [inScene(douglas), inScene(brandon)]),
  scene('lapaz', '3. Good morning Bolivia', 'La Paz : QG de Douglas, ville en grève, restaurant l\'Austria',
    `L'enquête sur la bombe ne mène nulle part : le camion est resté au garage, gardé par un soldat endormi ; tout le monde savait que les PJ arrivaient, grâce à Douglas.
Douglas est l'indic inconscient des démons : il a jadis massacré les démons de Nisroch, sauf Abigaël, qui s'est allié aux démons locaux pour le manipuler.
Indices : Douglas prépare avec le ministre Suarez (réputé intègre) l'épandage d'un défoliant de la société Banzer sur les champs de coca des Youngas, censé ne toucher que la coca. Il en a confié un échantillon à Chico. Il présente ses alliés lors d'un dîner à l'Austria :
• Greta Banzer : revend comme neufs de « vieux fonds de cuves » que lui cède Suarez ; ignore que c'est un produit expérimental d'Uphir. Démasquée, elle donne le site de reconditionnement, sous-traité à Air Conditioned Sky.
• Nicanor Duende (démon de Malphas), écrivain mondain : veut devenir l'ami des PJ et les pousser à tuer Douglas ou Tupac.
• Esteban Alcazar, lieutenant-colonel intègre, demande aux PJ d'aider à dissuader Douglas ; il prend du grade à chaque retour des PJ à La Paz.
Suarez est injoignable (Santa-Cruz, « mère mourante »). Le président Tortilla vient d'accepter d'enterrer des déchets électroniques contre une somme disparue : mineurs, campesinos et indios marchent sur La Paz ; bâtiments publics fermés, répression, chaos croissant. Quitter ou rejoindre La Paz demande du temps (barrages des cocaleros) : voir la règle des grèves dans les notes.`,
    [inScene(douglas), inScene(greta), inScene(nicanor), inScene(alcazar)], false,
    [choice('greta', 'Les PJ percent-ils Greta Banzer à jour ?', [
      ['Oui', 'Aveux et emplacement du site de reconditionnement (Air Conditioned Sky) : piste directe vers Maldita Cruz.'],
      ['Non', 'Elle vante sa société de chimie et ne dit rien ; il faudra retrouver la piste des prêtres par Huallap.'],
    ])]),
  scene('chacomambo', '4. Amers indiens', 'Chacomambo, mission de Santa Lucia (ruine coloniale au-dessus du village)',
    `Cinq heures de jeep sur une piste de montagne. Six sœurs et une douzaine d'orphelins dans une ruine rafistolée de sacs poubelle ; les PJ doivent négocier pour y loger (sinon le Gringo Paradise Guest House, à cinq heures de marche, à Guaga).
Mère Rosalia ne croit pas qu'ils soient envoyés du Ciel, sauf si l'un d'eux est prêtre ; un petit miracle est toléré ici, mais il faut surtout prouver ses bonnes intentions et sa connaissance de la Foi.
Pilar est une succube qui s'ignore et simule ses stigmates par illusion : voir sa fiche. Le village vit de sa « sainte » et est prêt à lyncher ou jeter dans un ravin quiconque la menace.
Personne n'a vu les deux pères : ils ne sont jamais venus à Chacomambo.
Se faire bien voir des indios (Chacomambo et Huallap) : jouer avec les enfants, réparer le minibus, retrouver un lama perdu… Ils renseignent alors les PJ (un groupe de soldats et des narcos sont sur leur piste) et mentent pour les cacher. Abus de pouvoirs : risque d'être adorés comme des idoles (ennuis au retour en France). Mépris : un villageois les livre à la bande d'Abigaël.`,
    [inScene(rosalia), inScene(pilar), inScene(indio, { qty: 6 })], false,
    [choice('pilar', 'Que font les PJ de Pilar ?', [
      ['Ils lui révèlent le Grand Jeu et la protègent', 'Terrifiée, elle se range du côté des anges : un atout pour la fin (illusions, ferveur populaire).'],
      ['Ils l\'exécutent', 'Créature du Mal éliminée, mais le village (et Rosalia) les haïssent ; risque de lynchage, informations coupées.'],
      ['Ils la laissent tranquille', 'Rien ne change ; elle reste une inconnue pour la suite.'],
    ]),
    choice('village', 'Comment les villageois perçoivent-ils les PJ ?', [
      ['Serviables et sympathiques', 'Informations, repas gratuits, protection ; on les prévient des soldats et narcos qui les suivent.'],
      ['Méprisants ou faiseurs de miracles à tout va', 'Méfiance ou adoration encombrante ; un indio excédé peut les livrer à Abigaël.'],
    ])]),
  scene('harcelement', '5. Quand lama fâché…', 'Routes de l\'Altiplano et de la Cordillera Real',
    `Buddy, touriste australien insupportable, croise les PJ où qu'ils soient : il aurait vu dix jours plus tôt deux prêtres et un indien partir voir Tupac à Choruro. Faux témoignage implanté par Nicanor, qui prépare d'autres « témoins » contre Tupac (une vieille indienne accusant de meurtre et de trafic…) et risque d'en faire trop.
Filature : Nicanor et Ramon, avec le Commando Jaguar (cinq jeeps), à une demi-journée ; Ramon observe parfois sous forme de lama. Abigaël et une douzaine d'hommes font du tir aux anges : snipers guaranis de très loin, pour harceler et pousser les PJ vers Tupac. Il paie des gamins pour cacher de la cocaïne dans leurs affaires et prévient la police (qui veut surtout de l'argent).
Si les PJ semblent dangereux : embuscade des servants humains sur une route de montagne à pic, puis poursuite (circulation alternée, pas de bitume, camions). Ensuite, les démons les font passer pour des hors-la-loi recherchés (ordre appliqué mollement).`,
    [inScene(buddy), inScene(narcos, { qty: 6 }), inScene(jaguars, { qty: 6 }), inScene(abigael), inScene(ramon), inScene(nicanor)], true),
  scene('tupac', '6. Hasta la victoria, siempre !', 'Montagnes de l\'Altiplano : hameau abandonné de cinq maisons, camp de l\'ELP',
    `Tupac entend parler des gringos et vient leur tendre une embuscade « amicale » : il ne tire pas tout de suite, et pas du tout s'ils se montrent anges. Les PJ gagnent sa confiance s'ils ne sont pas rigoristes (ses hommes sacrifient bière et cigarettes à Pachamama). Son camp est presque introuvable : les indios ne trahissent pas leur bienfaiteur.
Ce que disent les soldats de Dieu de l'ELP :
• Ils n'ont pas vu Stanley et Livingstone, mais on parle de deux prêtres européens disparus vers Huallap.
• Tupac est l'ami de Marco Moralès, leader indien qui coordonne les manifestations à La Paz ; il compte y aller en simple manifestant. L'ELP peut faire passer les PJ aux barrages des cocaleros.
• Douglas et Tupac se connaissent : il y a cinq ans, ils ont failli s'entendre, puis se sont brouillés pour le surnom d'« El lobo ». Depuis, les hélicos de la DEA ont mitraillé l'ancien camp de Tupac, qui a juré la perte de Douglas. Nicanor assistait à l'entrevue et a attisé la querelle avec ses pouvoirs.`,
    [inScene(tupac), inScene(elp, { qty: 6 })], true,
    [choice('tupac', 'Comment se passe la rencontre avec Tupac ?', [
      ['Ils se font reconnaître et gagnent sa confiance', 'Allié : infos, passage des barrages, quatre cents volontaires pour la fin.'],
      ['L\'affrontement tourne mal', 'Combat contre un ange de Michel redoutable et ses hommes : les démons ont gagné une manche.'],
    ])]),
  scene('huallap', '7. Huallap', 'Huallap, village au pied de Maldita Cruz (15 h de jeep au sud de La Paz)',
    `Les pères ne sont jamais allés voir Pilar : à La Paz, leurs pouvoirs ont révélé la corruption ; ils ont enguirlandé Douglas, enquêté sur Banzer et Suarez, puis sont partis avec Chico fouiller Maldita Cruz, où le service d'ordre les a taillés en pièces.
Les 300 habitants se souviennent d'eux mais se taisent : les forces spéciales les ont menacés. Leur mutisme apeuré est déjà un indice. Avec patience, gentillesse et indépendance affichée envers le pouvoir, les PJ obtiennent un rendez-vous dans la montagne avec Carmelito : il a hébergé les trois hommes, partis de nuit vers Maldita Cruz.`,
    [inScene(carmelito), inScene(indio, { qty: 4 })]),
  scene('maldita', '8. La malédiction de Choquenard et Faugne', 'Maldita Cruz : site de reconditionnement dans une vallée encaissée, sur un vieux cimetière indien',
    `Une large piste, un bus d'ouvriers (arrivée 7 h, départ 19 h), une grille en lambeaux, une douzaine de mercenaires anglophones : l'approche paraît facile.
En réalité : Paul Choquenard (polytechnicien dément, adorateur d'Uphir) et Faugne mettent en fûts pour Air Conditioned Sky la « malédiction de Choquenard & Faugne », qui favorise la coca au détriment des autres plantes et fait naître des enfants aux yeux globuleux. Ils sont téléguidés par Viiv' n' dyys, le familier de Suarez posé sur le bureau, qui alerte les démons par télépathie.
Au sous-sol interdit : Az'ed'eff et Toho T'aal, démons de combat d'Uphir, gardent le stock. Choquenard les lâche (et sacrifie gardes et ouvriers en diversion) dès que les PJ menacent le site.
Le bureau de Choquenard contient toutes les preuves : effets du produit, implication et nature démoniaque de Suarez, ses projets, et un dossier de chantage contre Greta Banzer.`,
    [inScene(mercenaires, { qty: 6 }), inScene(choquenard), inScene(faugne), inScene(viiv), inScene(combat, { qty: 2 })], true,
    [choice('preuves', 'Les PJ récupèrent-ils les preuves du bureau ?', [
      ['Oui', 'De quoi convaincre Douglas et Alcazar, et faire chanter Greta Banzer.'],
      ['Non (site détruit ou fuite)', 'Le stock est peut-être perdu, mais il faudra convaincre Douglas sans preuve.'],
    ])]),
  scene('pueblo', '9. Un pueblo unido jamás será vencido', 'La Paz : barrages, rues en révolte, parlement colonial',
    `Au moment choisi par le MJ, le président Carlos Tortilla y Queso meurt d'un infarctus dans sa villa (prostituées mineures et trafiquants vendent le scoop à la télé). Le vice-président est en fuite aux États-Unis : les élus se ruent sur La Paz à travers les barrages.
Suarez est le favori : ramené par un avion de Ramon, il doit s'imposer devant une assemblée encerclée par le Commando Jaguar ; ses premières décisions : mitrailler les manifestants, puis épandre le produit.
Les PJ apprennent la vacance du pouvoir par la radio ou des alliés, en même temps que leurs ennemis. Atouts : Tupac et l'ELP, Alcazar (qui ferait un bon candidat), Pilar. Il faut foncer sur La Paz, passer les barrages et empêcher Suarez d'entrer au parlement (ou d'en sortir vivant).
Douglas, proche du pouvoir soutenu par Washington, est dur à convaincre ; avec la preuve que Suarez et Nicanor sont des démons, il charge le premier.
Ramon, Abigaël et leurs hommes défendent leur chef jusqu'au bout, retranchés s'il le faut dans le bâtiment. Les leaders indiens tentent d'y entrer en force : boucherie, sauf si les PJ, en bons termes avec l'ELP, l'empêchent.`,
    [inScene(suarez), inScene(ramon), inScene(abigael), inScene(nicanor), inScene(jaguars, { qty: 8 }), inScene(douglas), inScene(tupac), inScene(alcazar), inScene(morales)], true,
    [choice('douglas', 'Douglas intervient-il ?', [
      ['Oui, convaincu par les preuves', 'Il charge avec ses agents : le rapport de force bascule.'],
      ['Non', 'Il soutient le gouvernement « légal » ; les PJ n\'ont que leurs autres alliés.'],
    ]),
    choice('fin', 'Suarez prend-il le pouvoir ?', [
      ['Il est arrêté ou tué', 'Défoliant abandonné ; Alcazar finit général, voire candidat. La Bolivie est sauvée… jusqu\'à la prochaine insurrection.'],
      ['Massacre devant le parlement', 'Les leaders indiens donnent l\'assaut : nombreuses victimes, la victoire a un goût amer.'],
      ['Il devient président', 'Manifestants mitraillés, épandage du produit : échec cuisant pour les PJ.'],
    ])]),
];

const scenario = {
  id: 'ag6-la-revolution',
  nom: 'Angelots en gelée – La révolution n\'est pas un dîner de gala',
  resume: 'Scénario de Magna Veritas, parodique, pour des anges diplomates et pas trop intégristes. Notre-Dame envoie les PJ en Bolivie retrouver deux anges disparus en enquêtant sur une novice stigmatisée (Pilar, en fait une succube qui s\'ignore). Ils découvrent qu\'Alberto Suarez, ministre de l\'Agriculture et démon d\'Uphir, prépare avec ses complices (Nicanor, Abigaël, Ramon) l\'épandage d\'un défoliant monstrueux et sa prise de pouvoir. Ils doivent rallier les forces du Bien locales, brouillées entre elles (Tupac, guérillero de Michel, et Douglas, officier US de Laurent), et l\'empêcher de devenir président.',
  notes: `Source : ${REF}.
Ton : la Bolivie est un pays de bande dessinée (« relisez Tintin ») ; inutile d'être réaliste.

Histoire secrète (résumé) : Suarez veut devenir président provisoire à la prochaine crise pour épandre, sous couvert de lutte anti-coca, la « malédiction de Choquenard & Faugne », produit expérimental d'Uphir mis en fûts à Maldita Cruz. Greta Banzer le revend à l'État sans savoir ce que c'est ; Douglas, manipulé, veut l'épandre. Nicanor attise la haine entre Douglas et Tupac. Stanley, Livingstone et Chico sont morts à Maldita Cruz, tués par le service d'ordre ; ils ne sont jamais allés voir Pilar.
Fil de l'enquête : La Paz (Douglas, dîner à l'Austria, Greta) → Chacomambo (Pilar, fausse piste) → harcèlement et faux témoins (Buddy) vers Tupac → Huallap (Carmelito) → Maldita Cruz (preuves) → crise présidentielle à La Paz.

Règle locale « grèves et barrages » (p. 96) :
• Chaque fois qu'un joueur fait un double aux dés, l'électricité est coupée dans toute la région pendant RU heures.
• Sur un triple, les routes sont bloquées pendant RU/2 jours : marche à pied, ou baratiner les indios en colère aux barrages (l'ELP peut aussi faire passer les PJ).
• Transports : un seul train dans le pays ; bus solidaires de la contestation ou 4×4 de location. Durées données en 4×4 (La Paz → Chacomambo 5 h, La Paz → Huallap 15 h) ; doubler pour le bus. L'armée embarque des particuliers contre paiement sur ses vieux avions de liaison.
• Les villes ont téléphone, Internet, une gare de bus bruyante et une place d'armes pour les manifestations.

Encadrés de contexte : la Bolivie (capitale officielle Sucre, élus à La Paz ; indios aymaras, quechuas, guaranis, catholiques mais fidèles à Pachamama ; soulèvement populaire comme sport national) et la coca (plante sacrée mâchée depuis des millénaires, culture éradiquée sous pression des États-Unis).
Langue : jet difficile de Volonté pour se débrouiller en espagnol (automatique à Volonté 4+).
Récompenses : le livre ne donne pas de barème de PA ; à évaluer selon que Suarez est arrêté, le défoliant détruit, les alliés préservés (Tupac, Douglas, Alcazar, Pilar) et le massacre évité. Exécuter Pilar ou se faire adorer comme des idoles peut valoir des ennuis au retour.
Fiches : 10 PNJ chiffrés (p. 95-97) ; Tupac et les démons de combat repris du bestiaire de l'application. Troupes (Commando Jaguar, narcos, mercenaires) estimées ; soldats de l'ELP = section légère de l'écran.`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [pilar, ramon, abigael, nicanor, suarez, douglas, tupac, combat, viiv, indio, jaguars, narcos, mercenaires, elp,
  greta, alcazar, rosalia, buddy, choquenard, faugne, carmelito, brandon, morales].map(asType);
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));
writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types');
