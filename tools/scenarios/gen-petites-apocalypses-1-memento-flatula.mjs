// Génère le fichier d'import « insmv-scenario » pour « Memento Flatula » (Les Petites Apocalypses, chap. 6, p. 44-51 ; adaptations p. 115)
// usage : node gen-petites-apocalypses-1-memento-flatula.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Les Petites Apocalypses, chap. 6 « Memento Flatula », p. 44-51';
const L = (s) => R.parseLvl(String(s));
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
const ARMES = new Map(R.ARMES.flatMap(([g, l]) => l.map((x) => [x[0], { prec: x[1], puis: x[2], melee: R.MELEE_GROUPS.includes(g) }])));
const arme = (n, table, lvl) => { const w = ARMES.get(table); if (!w) throw new Error('arme inconnue : ' + table); return { n, att: L(lvl), ...w }; };
// attaque au format des livres « seuil/RU+X/M+Y » : att = X×2, précision 0, puissance Y
const livre = (n, x, y, melee) => ({ n, att: x * 2, prec: 0, puis: y, melee });
const poing = (lvl) => arme('Coup de poing', 'Coup de poing', lvl);
const P = 'pa1-'; let n = 0; const id = (k) => P + k;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [poing(1)], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});

// ---------------- Les quatre démons (mêmes caractéristiques et talents) ----------------
const DEMON = {
  type: 'demon', car: car('5 4 3 2 2 3'), def: L('6+'), pp: 16, pfFix: 7, seuilsFix: seuils('7/14/21/28'),
  talents: 'Combat 3 (arme de prédilection 5+), Défense 6+, Discrétion 4, Médecine 2, Tir 3 (arme de prédilection 5)',
};
const MIB = 'Look « Men in Black » : costume noir, lunettes noires au moindre rayon de soleil, se prennent beaucoup trop au sérieux ; la trentaine, baraqués, bruns ou châtains. Parlent comme des charretiers avec un accent de titi parisien. Envoyés par un démon haut placé chez Vapula pour récupérer les informations ET l\'argent de Santofer ; ils filent Smirnoff depuis des jours sans qu\'il s\'en doute.';
const boner = npc('boner', {
  nom: 'Boner', source: 'Démon de Baal, grade 1', ...DEMON,
  armes: [livre('Katana', 5, 8, true), livre('Katana exalté', 6, 10, true)],
  pouvoirs: pows('Arme exaltée 4, Art de combat 4, Caméléon 4'),
  notes: `${MIB}\nLe chef de file au combat : katana, exalté dès que ça chauffe.`,
});
const turgid = npc('turgid', {
  nom: 'Turgid', source: 'Démon de Malthus, grade 1', ...DEMON,
  armes: [livre('Poignard', 5, 5, true)],
  pouvoirs: pows('Caméléon 4, Détection du danger 4, Sommeil 4'),
  notes: `${MIB}\nL'homme des basses œuvres discrètes : Sommeil pour neutraliser, Détection du danger pour ne pas se faire surprendre.`,
});
const bigdick = npc('bigdick', {
  nom: 'Big Dick', source: 'Démon de Furfur, grade 1', ...DEMON,
  armes: [livre('Jet de flammes (2 PP)', 7, 6, false), poing(3)],
  pouvoirs: pows('Conversion physique 2, Immunité contre le feu, Jet de flammes 4, Tourbillon de feu 4'),
  notes: `${MIB}\nJet de flammes : aire d'effet de rayon très court, inévitable, 2 PP. Le candidat idéal pour « faire sauter le chalet ».\nCoup de poing ajouté (niveau Combat 3) : estimation.`,
});
const chiken = npc('chiken', {
  nom: 'Chiken-safe', source: 'Démon d\'Uphir, grade 1 (le seul asiatique de l\'équipe)', ...DEMON,
  armes: [livre('Langue barbelée (2 PP)', 5, 8, true)],
  pouvoirs: pows('Armure corporelle 4, Forme de combat 4, Membre exotique : langue blindée, Vengeance toxique 4'),
  notes: `${MIB}\nLangue : portée très courte, 2 PP pour l'activer. Le livre parle de « langue blindée » dans les pouvoirs et de « langue barbelée » dans l'attaque : les deux sont conservés.\nSon surnom fait l'objet d'une blague graveleuse des autres démons.`,
});

// ---------------- Humains et psi ----------------
const smirnoff = npc('smirnoff', {
  nom: 'Alexeï Smirnoff', source: 'Psi, chercheur en fuite (ex-Simiscience)', type: 'psi', car: car('3 2+ 2+ 4+ 2+ 1'), def: L('2+'),
  pp: 18, pfFix: 7, seuilsFix: seuils('4/8/12/16'),
  armes: [poing(1)],
  pouvoirs: pows('Corps digital, Téléportation 2, Augmentation de Volonté 4, Parasite intellectuel 2'),
  talents: 'Défense 2+, Discrétion 2+, Discussion 4+, Informatique 4+, Science 3 (électronique 4+), Technique 3 (électronique 4+), Pouvoirs dimensionnels 2, Pouvoirs psychiques 4',
  notes: 'La quarantaine, beau gars baraqué et élancé, châtain-roux aux yeux verts, polyglotte et bardé de diplômes ; né en France, ne se sent pas du tout slave. Supporte mal l\'autorité, a la répartie facile, soupe au lait : les blagues sur la vodka le mettent hors de lui.\nAmoureux de Lolette, très dépensière, qui l\'attend déjà à Madrid (choisie justement parce qu\'il déteste l\'Espagne). Appartement rendu, comptes liquidés, nouvelle identité prête ; lentilles à la place des lunettes et postiche sur sa calvitie : un air de lapin russe ébouriffé.\nPrudent mais pas assez : il ne sait pas que les démons le filent. Pas de mot de passe prévu pour l\'échange (piège possible : « rappelez-moi le mot de passe… »).\nCoup de poing au niveau 1 : estimation (aucun talent de combat).',
});
const comtesse = npc('comtesse', {
  nom: 'La Comtesse (Illyana Padje-Heudmo)', source: 'Ex-espionne russe, cheffe de l\'équipe de Santofer', car: car('1 2 2 3 3 2'), def: 2,
  pfFix: 4, seuilsFix: seuils('2/4/6/8'),
  armes: [poing(1)],
  talents: 'Baratin 3, Défense 2, Enquête 4, Savoir d\'espion 4, Séduction 4',
  notes: 'Âge certain, chignon gris, tailleur strict, regard vert scrutateur devenu légendaire ; fierté de ses succès passés au service de l\'URSS puis de la Russie. Agit seule : elle a laissé ses deux gros bras au bar.\nOrdres de Santofer : échange loyal. Elle préférerait récupérer l\'argent après coup.\nTenace et rusée : la capturer demande ingéniosité et persévérance. Hercule pourrait la recruter à la DTC.\nCoup de poing au niveau 1 : estimation.',
});
const grosbras = npc('grosbras', {
  nom: 'Plazo et Mucid', source: 'Gros bras de la Comtesse', qty: 2, car: car('3+ 2 2 2+ 1+ 2'), def: 2,
  pfFix: 6, seuilsFix: seuils('4/9/13/18'),
  armes: [livre('Petit calibre', 2, 3, false), arme('Coup de poing', 'Coup de poing', 3)],
  talents: 'Corps à corps 3, Discrétion 0+, Métier : gros bras 2, Tir 2 (armes de poing 3)',
  notes: 'Empotés, la Comtesse ne leur fait pas confiance : pendant l\'échange, ils sirotent un chocolat chaud au bar. Faciles à capturer, mais sans grand intérêt.\nDéfense non donnée : 2. Mêmes valeurs que le « Gros bras » du bestiaire.',
});
const hercule = npc('hercule', {
  nom: 'Hercule', source: 'Héros romain (alias Héraclès, Alcide), patron de la DTC', type: 'paien', car: car('7 5 5 5 5 6'), def: L(7),
  pp: 55, pfFix: 12, seuilsFix: seuils('9/19/27/36'),
  armes: [livre('Massue magique ancienne', 10, 16, true)],
  pouvoirs: pows('Aura de courage 5, Champ de force 5, Contrôle des animaux 4, Immunité contre les maladies et les poisons, Membre blindé 5, Némésis 5, Régénération 5, Supériorité martiale 7, Vitesse 4, Vol 4'),
  talents: 'Art 2+ (danser le sirtaki 5), Athlétisme 9, Combat 6 (armes contondantes 8), Corps à corps 7, Défense 7, Discrétion 4, Discussion 6, Informatique 4, Métier : businessman 6, Savoir occulte 3 (marches intermédiaires 7), Technique 5, Voyage intermarches 6 (pouvoir propre)',
  notes: 'Commanditaire des PJ (client : Simiscience). Leur a seulement dit de récupérer les tablettes de Raämalû, sans parler du DVD caché dedans. Joignable par téléphone à la réception ; reçoit les PJ au retour et examine les tablettes en connaisseur d\'antiquités. Fan de gadgets technologiques.\nMassue magique ancienne : précision +4, puissance +9 (66/RU+10/M+16).\nVoyage intermarches 6 (spirituel, activé, 8 PP, propre à Hercule ; absent des règles de l\'appli) : rater volontairement une marche pour voyager dans le Rien ; test de pouvoir pour partir (Très difficile depuis la Terre), puis un test par jour en cumulant les MR jusqu\'à la distance du trajet (Olympe-Terre 30, le seul qu\'il maîtrise) ; test de Savoir occulte quotidien pour trouver son chemin.\nFiche : Les Petites Apocalypses, chap. 4, p. 21.',
});
const agent = npc('agent', {
  nom: 'L\'homme de Simiscience', source: 'Émissaire de la conpsi cliente',
  notes: 'Apparaît à la DTC pour récupérer les données. Froid, cynique, désagréable ; casse les tablettes et remercie les PJ avec un sourire glaçant. Pas de caractéristiques : ne doit pas être combattu.',
});

const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const NIV = 'Chaque scène existe en trois versions, de la plus vague à la plus précise : plus vous donnez de détails, plus le joueur cherchera à recoller au plan ; moins vous en donnez, plus il improvisera. Le joueur doit compléter lui-même la situation (pourquoi il est là, ce qu\'il dit).';
const scenes = [
  scene('principe', '0. Avant de jouer : la non-introduction', 'Hors jeu',
    `Premier scénario de la campagne : il sert à faire connaître les personnages. Pas d'introduction : on démarre en pleine action, et ce sont les joueurs qui inventent le contexte (raisons de leur présence, détails du plan) à partir de quelques phrases d'ouverture. Prévenez-les explicitement si besoin.
• Le MJ ne donne que la ligne de départ et une description de l'environnement ; il dose la liberté selon la personnalité de chaque joueur.
• Si un joueur contredit le scénario (ex. : « on est à Paris »), corriger de préférence par la bouche d'un PNJ, ou accepter et adapter la suite.
• Règle d'or : rester constructif, ne pas chercher à coincer les autres joueurs ni le MJ.
• Seules les scènes 1 à 3 sont indispensables (elles introduisent les PNJ). Choisir avec soin quel joueur ouvre le bal : le premier à improviser a la tâche la plus dure.

Le plan des PJ (déjà lancé, conçu par Hercule ou par eux) : un PJ travesti remplace la Comtesse pour l'échange ; un autre retarde ou neutralise la vraie Comtesse dans sa chambre ; un troisième rampe dans le conduit d'aération au-dessus de la salle d'échange (aucune cachette dans la pièce), un quatrième attend dehors près de la fenêtre ; un dernier fouille la chambre de Smirnoff au cas où il n'aurait pas apporté l'objet. Une fois les tablettes obtenues, elles doivent filer au plus vite chez Hercule.`),
  scene('chambre-comtesse', '1. Dans la chambre de la Comtesse', 'Chalet, chambre de la vraie Comtesse',
    `PJ chargé de retarder la Comtesse. ${NIV}
Ouverture : il referme la porte, la neige recommence à tomber sur les pistes ; la Comtesse sort de la salle de bains, le fixe de ses yeux verts et, avec un fort accent russe, lui demande ce qu'il fait dans sa chambre. Version la plus précise : elle est pressée, tendue, et serre une petite mallette (l'argent de Santofer).
Décrire la Comtesse servira aussi au PJ de la scène 2. Elle est très déterminée : la retenir ou la neutraliser n'est pas une formalité.`,
    [inScene(comtesse)]),
  scene('echange', '2. La fausse Comtesse', 'Chalet, pièce de l\'échange',
    `PJ travesti (idéalement un personnage et un joueur masculins). ${NIV}
Ouverture : tailleur trop serré, perruque grise qui tient chaud, mallette en main ; Smirnoff entre, le regarde avec curiosité, salue « madame la Comtesse » et demande si elle a apporté ce qui était convenu. Le PJ doit répondre d'une voix féminine avec l'accent russe. Version la plus précise : la mallette est pleine de faux billets.
Smirnoff est sur ses gardes : une réponse incongrue (« je vais l'exposer dans un musée ») peut l'amuser, le faire reculer (« Qui êtes-vous ? ») ou le pousser à tendre un piège (mot de passe inexistant). Il apporte les tablettes de Raämalû, objet pseudo-mésopotamien couvert de runes ; les PJ ignorent qu'un DVD est moulé à l'intérieur.`,
    [inScene(smirnoff)]),
  scene('chambre-smirnoff', '3. La tête dans les toilettes', 'Chalet, chambre de Smirnoff',
    `PJ venu fouiller la chambre de Smirnoff. ${NIV}
Ouverture : un des quatre types lui relève la tête de la cuvette ; ils ont tout fouillé sans rien trouver et exigent de savoir où sont cachées les informations, en l'appelant Smirnoff dans la version la plus précise (« tu ne les as pas déjà données à la vieille ? »).
Les démons le prennent pour Smirnoff : soit ils pensent à une Polymorphie, soit ils ne sont pas physionomistes, soit ils sont simplement idiots. Le PJ peut baratiner pour s'en sortir, mais des démons lancés sont durs à arrêter. Combat possible.`,
    [inScene(boner), inScene(turgid), inScene(bigdick), inScene(chiken)], true),
  scene('conduit', '4. Le conduit d\'aération', 'Chalet, faux plafond au-dessus de la réception',
    `PJ chargé de surgir par la trappe du plafond. ${NIV}
Ouverture : le conduit, trop étroit, craque, cède avec le faux plafond ; le PJ s'écrase deux mètres cinquante plus bas, dans les débris, devant un réceptionniste médusé (un peu benêt) qui lui demande poliment s'il peut l'aider. Raté : la fausse Comtesse devra se débrouiller seule.`),
  scene('fenetre', '5. Accroché à la fenêtre', 'Chalet, façade extérieure',
    `PJ posté dehors près d'une fenêtre. ${NIV}
Ouverture : la neige engourdit ses doigts ; près du but, la fenêtre où il s'agrippe s'ouvre et une créature blonde, nue et plantureuse se penche pour lui proposer de venir se réchauffer. Adapter l'« âme sœur » aux goûts du personnage. Version la plus précise : l'échange a lieu en ce moment même.`),
  scene('bonus', '5 bis. Situations pour plus de cinq joueurs', 'Chalet et pistes',
    `Idées supplémentaires, à déformer à volonté :
• Descente à ski à toute allure dans la tempête : il faut atteindre le chalet avant 12 h 12, sinon… (au joueur de compléter : bombe, épisode des Télétubbies raté…).
• Un homme s'effondre mort devant la porte ; une femme de ménage arrive, bouche grande ouverte : va-t-elle hurler ?
• Le plan est enfin lancé ; appel à la réception : Hercule demande où ils en sont (objet, argent, Smirnoff ?) au moment où un PJ traverse le plafond dans un nuage de poussière. Que lui répondre ?`,
    [inScene(hercule)]),
  scene('bazar', '6. Le joli bazar', 'Chalet de Chamonix',
    `Tout le monde est dans le chalet : Smirnoff, la Comtesse, Plazo et Mucid (au bar), les quatre démons et les PJ. La suite dépend entièrement des improvisations ; le but est de finir en bagarre générale.
• Les démons veulent les informations et la mallette. S'ils les obtiennent, ils tentent de tuer tout le monde ou de faire sauter le chalet ; s'ils échouent, c'est pire.
• La Comtesse veut l'objet, et si possible garder l'argent ; ses gros bras rappliquent si ça tourne mal.
• Smirnoff, coincé, peut se téléporter, se réfugier dans un réseau (Corps digital) ou parasiter un esprit.
• Mission principale : récupérer les tablettes. Ramener Smirnoff est secondaire, et le livrer à Simiscience revient à le condamner : on peut le dire aux PJ pour qu'ils choisissent.`,
    [inScene(boner), inScene(turgid), inScene(bigdick), inScene(chiken), inScene(smirnoff), inScene(comtesse), inScene(grosbras, { qty: 2 })], true,
    [choice('demons', 'Que deviennent les démons ?', [
      ['Vaincus ou chassés', 'Le butin reste à portée des PJ.'],
      ['Ils s\'emparent des tablettes ou de la mallette', 'Ils cherchent à éliminer les témoins ou à faire sauter le chalet ; les informations partent chez Vapula.'],
    ]),
    choice('comtesse', 'Et la Comtesse et l\'argent de Santofer ?', [
      ['Capturée et ramenée à Hercule', 'Hercule pourrait l\'engager à la DTC.'],
      ['Elle s\'échappe', 'Santofer garde une dent contre la DTC ; l\'argent suit qui l\'a en main.'],
    ])]),
  scene('retour', '7. Retour à la DTC', 'Bureaux de la DTC',
    `Si les PJ ont les tablettes : Hercule, amateur d'antiquités, admire les signes gravés ; l'homme de Simiscience, venu sur-le-champ, lui prend l'objet des mains et le brise. Dedans, un petit DVD. Il remercie froidement les PJ. Laisser un goût amer : mission accomplie, mais était-ce une bonne idée ? Hercule est mal à l'aise, encore plus si les PJ ont livré Smirnoff.
Si les PJ ont échoué : Hercule leur passe un savon, voire pète un câble et menace de sanctions ; Simiscience est un client occasionnel mais prestigieux et généreux.`,
    [inScene(hercule), inScene(agent)], false,
    [choice('infos', 'Les informations sont-elles récupérées ?', [
      ['Oui', 'Scène du DVD ; Simiscience satisfaite, la DTC conserve son client.'],
      ['Non', 'Hercule furieux, menaces de sanctions ; coup dur pour la réputation de la DTC.'],
    ]),
    choice('smirnoff', 'Que font les PJ de Smirnoff ?', [
      ['Ils le livrent à Simiscience', 'Mission remplie à la lettre ; Smirnoff est probablement condamné et Hercule encore plus gêné.'],
      ['Ils le laissent partir', 'Il rejoint Lolette, pauvre mais entier ; Simiscience s\'en remet tant qu\'elle récupère ses données.'],
    ])]),
];

const scenario = {
  id: 'pa1-memento-flatula',
  nom: 'Petites Apocalypses – Memento Flatula',
  resume: 'Scénario d\'ouverture de la campagne des Petites Apocalypses pour agents de la troisième Force employés par la DTC d\'Hercule. Dans un chalet de Chamonix, un psi en fuite, Alexeï Smirnoff, doit vendre à la Comtesse (Santofer) les tablettes de Raämalû, fausse antiquité qui cache un DVD de recherches d\'armement volé à Simiscience. Les PJ ont déjà lancé leur plan pour prendre la place de l\'acheteuse quand le scénario commence ; quatre démons convoitent le même butin. Exercice d\'improvisation où les joueurs inventent le contexte, qui se termine en bagarre.',
  notes: `Source : ${REF}.
Contexte :
• Simiscience : filiale de la conpsi NRG, multinationale chimie/aéronautique à la vitrine exemplaire, qui développe en secret des armes vendues au plus offrant. Son patron, un psi, a déjà fait appel à la DTC.
• Santofer : petite société française d'armement dépendant de la conpsi 3GU ; poussée par le gouvernement à devenir plus agressive, elle s'est dotée d'une équipe d'espions industriels menée par la Comtesse.
• Démons : un démon haut placé chez Vapula a appris le vol par ses contacts chez Simiscience et a lâché quatre démons de grade 1 sur Smirnoff.
Chronologie : trois ans de recherche sur une arme révolutionnaire, prototypes en test ; le secret s'évente, tentatives d'effraction. Smirnoff copie les données sur DVD, le moule dans une imitation des tablettes de Raämalû (prophéties sur la fin du monde) et contacte Santofer. Hercule localise l'échange ; il sait seul que les données sont dans les tablettes et ne dit aux PJ que de récupérer l'objet.
Récompenses : aucune en PA indiquée par le livre (à fixer par le MJ selon l'issue).

Adaptations pour anges et démons (p. 115) :
• INS : inverser les rôles des deux équipes ; les PJ démons remplacent les quatre démons et agissent pour leur propre mission, pas pour une conpsi. Au MJ de décider s'ils savent qu'ils cherchent un DVD ou les tablettes.
• MV : soit les anges remplacent l'équipe de démons, soit ils s'ajoutent aux PNJ présents (la DTC devient alors une équipe PNJ). Motivations : Laurent ou Michel veulent l'arme révolutionnaire ; Francis, plus pacifiste, veut éviter ce fléau à l'humanité.
• Dans tous les cas, ajuster la puissance des adversaires à celle des PJ.

Fiches : caractéristiques vérifiées sur les pages rendues (p. 21, 47-48). Attaques du livre au format « seuil/RU+X/M+Y ». Valeurs estimées signalées dans les notes des fiches.`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [boner, turgid, bigdick, chiken, smirnoff, comtesse, grosbras, hercule, agent].map(asType);
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));
writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types');
