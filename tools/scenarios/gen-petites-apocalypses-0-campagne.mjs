// Génère le fichier d'import « insmv-scenario » pour la campagne « Une apocalypse, ce n'est pas la fin du monde »
// (Les Petites Apocalypses, chapitre cinq, p. 24-43 ; fiche d'Hercule p. 21)
// usage : node gen-petites-apocalypses-0-campagne.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Les Petites Apocalypses, « Une apocalypse, ce n\'est pas la fin du monde » (campagne), p. 24-43';
const L = (s) => R.parseLvl(String(s));
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
const ARMES = new Map(R.ARMES.flatMap(([g, l]) => l.map((x) => [x[0], { prec: x[1], puis: x[2], melee: R.MELEE_GROUPS.includes(g) }])));
const arme = (n, table, lvl) => { const w = ARMES.get(table); if (!w) throw new Error('arme inconnue : ' + table); return { n, att: L(lvl), ...w }; };
const poing = (lvl) => arme('Coup de poing', 'Coup de poing', lvl);
// attaque au format des livres « 66/RU+X/M+Y » : puissance totale (Force déjà incluse), donc pas de Force ajoutée
const livre = (n, x, y) => ({ n, att: x * 2, prec: 0, puis: y, melee: false });
const P = 'pa0-'; let n = 0; const id = (k) => P + k;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [poing(1)], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});
const BOOKATT = 'Attaques au format du livre (66/RU+X/M+Y) : puissance totale, Force déjà comprise.';
const MINI = 'Pas de caractéristiques dans le livre : fiche minimale, à compléter si un affrontement survient.';

// ---------------- PNJ avec caractéristiques ----------------
const hercule = npc('hercule', {
  nom: 'Hercule (Héraclès Merkios)', source: 'Héros romain, patron de la DTC et de Travelling Goods', type: 'paien', car: car('7 5 5 5 5 6'), def: L(7),
  pp: 55, pfFix: 12, seuilsFix: seuils('9/19/27/36'),
  armes: [livre('Massue magique ancienne', 10, 16), poing(7)],
  pouvoirs: pows('Aura de courage 5, Champ de force 5, Contrôle des animaux 4, Immunité contre les maladies et les poisons, Membre blindé 5, Némésis 5, Régénération 5, Supériorité martiale 7, Vitesse 4, Vol 4'),
  talents: 'Art 2+ (danser le sirtaki 5), Athlétisme 9, Combat 6 (armes contondantes 8), Corps à corps 7, Défense 7, Discrétion 4, Discussion 6, Informatique 4, Métier : businessman 6, Savoir occulte 3 (marches intermédiaires 7), Technique 5 ; pouvoir Voyage intermarches 6 (absent des règles de l\'application : seul trajet maîtrisé, Olympe-Terre, distance 30)',
  notes: `Patron des PJ. Joue le rôle de fil rouge : il les reçoit, leur confie les missions, s'ennuie dans les rendez-vous d'affaires. Absent pendant la trame égyptienne (en route vers l'Olympe), il revient le jour de la grande réunion.\nFiche du chapitre quatre (p. 21). Massue : précision +4, puissance +9 dans le livre (66/RU+10/M+16).\n${BOOKATT}`,
});
const jesus = npc('jesus', {
  nom: 'Jésus', source: 'Archange des hommes, barman Chez Régis', type: 'ange', car: car('5 5 6 7 8 9+'), def: L(6),
  pp: 102, pfFix: 12, seuilsFix: seuils('9/18/27/36'),
  armes: [poing(6)],
  pouvoirs: pows('Abondance 6, Absorption du mal 6, Aura de pacification 8, Bénédiction : guérison de folies 6, Bénédiction : guérison de maladies 6, Charme 6, Exorcisme 6, Illusions 9, Jeûne, Langage universel, Lecture d\'aura 9, Lire les pensées 9, Lumière céleste 6, Non-détection 9, Polymorphie 4, Télékinésie 6, Télépathie 6, Téléportation 6'),
  talents: 'Aisance sociale 6, Art 4 (menuiserie 6), Baratin 11, Corps à corps 6, Défense 6, Discussion 9, Kama sutra 5, Métier : barman 5, Savoir occulte 6 (tout ce qu\'on peut apprendre Chez Régis 9), Séduction 8, Survie 8 ; pouvoir Miracle 2 (propre à Jésus, absent des règles de l\'application)',
  notes: 'Barman Chez Régis, au courant de tous les ragots ; crétin ou génie, la question reste ouverte. S\'intéresse à la survie des troisièmes forces et aide discrètement les PJ. Son arrière-salle donne sur Mythopolis.\nMiracle (spécial, 1 PP) : attire l\'attention de Dieu ; transforme n\'importe quel jet en 111 sur un test de pouvoir standard, ou exauce une prière précise (difficulté fixée par le MJ).\nPlus tous les pouvoirs gratuits des supérieurs (INS/MV, p. 96).',
});
const seth = npc('seth', {
  nom: 'Seth', source: 'Fils d\'Adam et Ève, psionique, exilé sur Mythopolis', type: 'psi', car: car('3 3 4 7 6 6'), def: L(6),
  pp: 60, pfFix: 10, seuilsFix: seuils('5/11/16/22'),
  armes: [livre('Trait d\'énergie (portée courte, intangible)', 10, 10), poing(6)],
  pouvoirs: pows('Augmentation de Volonté 6, Boomerang 6, Cauchemar 3, Déphasage 6, Déplacement temporel 8, Détection du danger 6, Détection du futur proche 6, Lecture d\'aura 6, Polymorphie 3, Télékinésie 8, Télépathie 6, Téléportation 6, Trait d\'énergie 8, Volonté supra-normale 6'),
  talents: 'Corps à corps 6, Défense 6, Discrétion 6, Discussion 8, Savoir occulte 6, Science 6, Séduction 7, Technique 6',
  notes: `Après l'échec de son projet de pomme onirique (voir Habeas Corpus), exilé en spectre avec sa sœur ; tous deux ont fini par tomber sur Mythopolis. Vit presque nu dans le jardin d'Eden, main dans la main avec Naama. Trop faible pour retourner sur Terre, il veut renouer avec les conpsis.\nCaractéristiques lues sur le tableau du livre (3 3 4 7 6 6) ; Ch reportée en Foi.\n${BOOKATT}`,
});
const naama = npc('naama', {
  nom: 'Naama', source: 'Fille d\'Adam et Ève, psionique, exilée sur Mythopolis', type: 'psi', car: car('6 6 3 6 6 5'), def: L(10),
  pp: 11, pfFix: 12, seuilsFix: seuils('8/17/25/34'),
  armes: [livre('Arts martiaux', 7, 7), livre('Trait d\'énergie (portée courte, intangible)', 8, 8)],
  pouvoirs: pows('Absorption de force 6, Arme exaltée 6, Arts martiaux 4, Aura de courage 6, Cauchemar 2, Champ de force 8, Détection du danger 6, Esquive acrobatique 8, Lire les pensées 6, Polymorphie 3, Télékinésie 6, Télépathie 6, Téléportation 8, Trait d\'énergie 6, Volonté supra-normale 8'),
  talents: 'Combat 7 (épées 9), Corps à corps 6, Défense 10, Discrétion 7, Médecine 6, Savoir criminel 5, Savoir d\'espion 8, Savoir militaire 5, Séduction 8, Torture 6',
  notes: `Sœur et compagne d'exil de Seth. Elle n'a pas d'épée sur Mythopolis. Si les PJ arrivent en agresseurs, le couple lance une ou deux attaques puis se fond dans la ville.\nCh reportée en Foi.\n${BOOKATT}`,
});
const elfes = npc('elfes', {
  nom: 'Guerriers elfes boostés à la pomme d\'or', source: 'Garde rapprochée de Victor', type: 'fee', qty: 6, car: car('4 6 6 4 5 3'), def: L(8), prot: 6,
  pp: 40, pfFix: 8, seuilsFix: seuils('5/11/16/22'),
  armes: [livre('Épée longue magique mineure', 10, 8), livre('Arc long magique mineur (portée longue)', 8, 4)],
  pouvoirs: pows('Charme 6, Détection des créatures invisibles 6, Illusions 6, Peur 6'),
  talents: 'Acrobatie 9, Combat 7 (épées 9), Corps à corps 6, Défense 8, Discrétion 8, Séduction 8, Tir 7 (arcs 9)',
  notes: `Cotte de mailles elfique (6 points de protection). Guérison surnaturelle comme des anges ou démons incarnés (peuvent dépenser des PP pour refermer leurs blessures).\nLe livre ne donne volontairement pas leur nombre : 6 par défaut, à ajuster.\nMêmes valeurs que le « Guerrier elfe » du bestiaire de l'application, avec les caractéristiques du tableau (4 6 6 4 5 3).\n${BOOKATT}`,
});
const victor = npc('victor', {
  nom: 'Victor', source: 'Grand dragon rouge, dauphin de Faërie et futur archange du Feu', type: 'monstre', car: car('9 5 5 7 8 8+'), def: L(8),
  pp: 58, pfFix: 16, seuilsFix: seuils('13/26/39/52'),
  armes: [livre('Dents de sabre', 9, 11), livre('Grandes cornes', 8, 13), livre('Queue barbelée', 9, 12), livre('Jet de flammes (très courte portée, zone, inévitable)', 10, 10)],
  pouvoirs: pows('Apparence horrifique 6, Armure corporelle 8, Cauchemar 3, Champ de force 6, Charme 4, Esquive acrobatique 6, Jet de flammes 8, Membre exotique : dents de sabre, Membre exotique : grandes cornes, Membre exotique : queue barbelée, Polymorphie 3, Rêve 3, Sens surdéveloppés, Vol 8, Volonté supra-normale 6'),
  talents: 'Corps à corps 8, Défense 8 ; tous les autres talents utiles à 6',
  notes: `Fils d'Aubéron et de France d'Argon, éclos avec des siècles d'avance, élevé par Brand dans la haine de ses parents. Magnifique, imposant, regard terrible, cruauté palpable.\nForme humaine : pas d'Apparence horrifique, d'Armure corporelle, de Membres exotiques, de Sens surdéveloppés ni de Vol. La métamorphose en dragon coûte 10 PP et active ces pouvoirs pour une durée illimitée.\nGuérison surnaturelle (dépense de PP pour refermer ses blessures). Sous forme de dragon, il peut porter plusieurs attaques par seconde.\nLe livre insiste : trichez avec cette fiche (santé, attaques, défenses, immunités) pour que le combat final reste dramatique.\nArmure corporelle 8 non convertie en protection : à appliquer selon le pouvoir.\n${BOOKATT}`,
});
const licorne = npc('licorne', {
  nom: 'Licorne de Faërie', source: 'Échappée dans le Bois de Boulogne', type: 'monstre', car: car('4 5 4 2 3 3'), def: L(3),
  armes: [arme('Corne', 'Coup de poing', 4)],
  talents: 'Athlétisme 6, Discrétion 4, Course 6',
  notes: 'Pas de caractéristiques dans le livre : valeurs estimées (animal souple, puissant et rapide). Corne : attaque estimée au niveau 4, puissance de coup de poing + Force.\nElle se sert surtout de sa corne pour se défendre ; la capture doit être sportive mais rester discrète.',
});

// ---------------- PNJ importants sans caractéristiques ----------------
const michel = npc('michel', {
  nom: 'Michel', source: 'Archange de la Guerre, ancien héros viking de Thor', type: 'ange',
  notes: `Converti en 910, toujours proche des vikings et des troisièmes forces. Parle par phrases courtes, comme à des soldats. Porte un projet de « nouveau Chaudron » (légion étrangère de héros païens au service du Paradis). Accompagné de Rollon, ancien viking et proche collaborateur.\n${MINI}`,
});
const ange = npc('ange', {
  nom: 'Ange', source: 'Archange des Convertis', type: 'ange',
  notes: `Fillette de six ans au Paradis ; après sa première visite à la DTC, elle y apparaît en troublante jeune femme vêtue de noir (seul le regard ne change pas). Prudente sur le projet de Michel, elle sonde la moralité des PJ par des dilemmes.\n${MINI}`,
});
const alain = npc('alain', {
  nom: 'Alain', source: 'Archange des Cultures', type: 'ange',
  notes: `Ennemi de longue date des Égyptiens, soupçonné à tort par Isis et Osiris. Blessé d'être accusé, sincèrement attristé par la disparition d'Héliopolis.\n${MINI}`,
});
const isis = npc('isis', {
  nom: 'Isis', source: 'Déesse égyptienne incarnée, militante antimondialiste', type: 'paien',
  notes: `Avec Osiris, seule rescapée d'Héliopolis (ils étaient incarnés sur Terre lors de l'attaque). Convaincue qu'Alain est coupable, elle demande une réunion diplomatique à la DTC.\n${MINI}`,
});
const osiris = npc('osiris', {
  nom: 'Osiris', source: 'Dieu égyptien incarné, militant antimondialiste', type: 'paien',
  notes: `Compagnon d'Isis ; même histoire, même rancune envers Alain.\n${MINI}`,
});
const titania = npc('titania', {
  nom: 'Titania', source: 'Reine de Faërie en exil', type: 'fee',
  notes: `Témoin de la dévoration d'Aubéron par Victor sous forme de dragon. Exilée aux États-Unis, elle revient en France le jour de la réunion pour témoigner.\n${MINI}`,
});
const cuisinier = npc('cuisinier', {
  nom: '« Le cuisinier » (Haagenti)', source: 'Prince démon de la Gourmandise, incognito dans le camp de Victor', type: 'demon',
  notes: `Gros bonhomme loufoque qui chante à tue-tête en préparant une cuisine remarquable. En réalité Haagenti : c'est lui qui a rendu Victor insatiable, pour gagner un pari contre Baal. Les PJ ne doivent pas l'apprendre pendant la campagne (révélation finale facultative).\n${MINI}`,
});
const manolar = npc('manolar', {
  nom: 'Manolar', source: 'Proche d\'Aubéron, commanditaire de la mission licorne', type: 'fee',
  notes: `Veut récupérer la licorne avant que des humains ne comprennent ce qu'elle est. Sait seulement qu'elle a été perdue de vue dans Paris.\n${MINI}`,
});
const romain = npc('romain', {
  nom: 'Romain Journapassufipourlabatir', source: 'Mage urbain clochard', type: 'humain',
  notes: `Puissant mais complètement à l'ouest : vit des poubelles, délire sur la ville légendaire introuvable. Impossible d'en tirer une information claire.\n${MINI}`,
});
const malachite = npc('malachite', {
  nom: 'Malachite N\'Prophidjamé', source: 'Mage urbain', type: 'humain',
  notes: `Présentable, sensé, moins puissant que Romain. Connaît la légende de Mythopolis et cherche une copie des tablettes de Raämalû (piste qui mène à la DTC, voir Memento Flatula ; la copie est détruite à la fin de ce scénario). Plus tard, il mène les PJ à Chez Régis sans le comprendre.\n${MINI}`,
});
const carre = npc('carre', {
  nom: 'Pierre Carré', source: 'Chef du cercle de druides de la Serpe d\'Or', type: 'humain',
  notes: `Riche, peu courageux : paie la DTC pour aller voir pourquoi les dieux d'Avalon ne répondent plus. Le cercle compte surtout des fumeurs de gui et un ou deux vrais druides.\n${MINI}`,
});

const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  // ---------- Trame « marches » ----------
  scene('barrance', 'Marches 1 – Barrance en couille', 'Partout (rêves des héros, rencontres avec leurs dieux)',
    `Quand : dès la première séance, en introduction du premier scénario. Cette trame donne le ton et la motivation de toute la campagne.
Contexte : l'apocalypse avortée de la naissance de Damien (Fire & Ice) a abîmé les marches et leurs passages. Des pans d'Asgard, de l'Olympe et d'Héliopolis ont glissé dans le Rien. Asgard résiste le mieux (les runes vikings ont leurs propres réserves de PP).
Déroulement : les dieux contactent leurs héros (rêve, ou rencontre au comptoir) ; ils sont inquiets, perdent leurs pouvoirs, voient disparaître champs et palais. Ils chargent les PJ de trouver la cause et, si possible, d'y remédier.
Règle : un héros païen regagne normalement 1 PP toutes les six heures sans utiliser de pouvoir. Dès le début de la campagne, lancer 1d6 à chaque récupération : sur 1, rien. Pour mettre la pression (ou si les PJ se désintéressent du problème), passer à 1-2, puis 1-3.`, [inScene(hercule)]),
  scene('pareil', 'Marches 2 – Pour tout le monde pareil', 'Rencontres hors scénario, DTC',
    `Quand : au fil des premiers scénarios, jusqu'à ce que les joueurs aient mesuré l'ampleur du problème.
Déroulement : les PJ se renseignent sur les autres marches. Hercule confirme que l'Olympe va encore plus mal ; des héros ou dieux d'autres panthéons croisés pendant les scénarios répètent la même chose.
Solutions envisagées : opérations « publicitaires » des dieux, peu efficaces (images trop floues dans l'esprit du public). Le mini-scénario L'épopée du Kiti-Kon illustre une tentative viking (idée de Njord) ; laisser faire les PJ s'ils ont des idées de ce genre. Réparer le lien avec la MRC est hors de portée.
Solutions à long terme à faire émerger : le nouveau Chaudron de Michel, puis Mythopolis.`, [inScene(hercule)]),
  scene('baal', 'Marches 3 – Ça fait Baal ?', 'Où les PJ manquent de discrétion',
    `Quand : tout au long de la campagne.
Les attaques de démons (surtout de Baal, Bélial et Caym) contre les troisièmes forces s'intensifient. Dès que les PJ se font remarquer, un ou plusieurs démons peuvent les attaquer dans les jours qui suivent.
Secret : Baal a lancé un concours entre princes démons (Haagenti le gagnera grâce à Victor).
Adversaires : prendre des démons de combat dans le bestiaire (par exemple « Démon de grade 1 (combattant) » des Petites Apocalypses).`, [], true),
  // ---------- Trame « Michel » ----------
  scene('vikings', 'Michel 1 – Michel chez les vikings', 'Bar parisien fréquenté par les vikings',
    `Quand : tôt, si un PJ est viking (il peut déjà connaître Michel de réputation ou en personne).
Michel boit avec des héros vikings, entre souvenirs de bataille, comparaison de cicatrices et sujets graves : l'avenir de la marche, la religion viking.
À rappeler : les runes existent parce que l'usage des pouvoirs vidait Asgard plus vite que la MRC ne la remplissait ; elles ont leur propre réserve de PP.
Michel évoque un « projet » pour aider les païens, sans en dire plus.
Contexte MJ : Michel, ancien héros de Thor converti par Laurent, a toujours protégé les derniers vikings ; depuis 1997 il recense ses alliés païens dans un cahier Clairefontaine et a ravivé le Chaudron (anges aux pouvoirs animistes).`, [inScene(michel)]),
  scene('contacts', 'Michel 2 – Premiers contacts', 'Siège de la DTC',
    `Michel, accompagné de Rollon, rencontre Hercule à la DTC. Faire assister les PJ, au moins en partie.
Argumentaire de Michel (phrases courtes) : besoin de combattants sur Terre face à des démons de plus en plus violents ; valeur guerrière des héros païens (Ulysse, Achille, Hercule) ; les démons ont toujours été ennemis des dieux (Ragnarok, géants, titans). Le projet : une sorte de Légion étrangère des armées du Seigneur, ouverte à tous les héros païens volontaires.
Hercule éclate de rire. La réaction des joueurs est capitale.
Sur la fidélité aux dieux : les dieux seraient accueillis avec leurs héros ; mais pour Michel, la force des héros vient de leur foi, pas des dieux, et l'immortalité ne vient que de son Dieu.
Si l'entrevue se passe bien, Michel revient régulièrement et utilise les PJ comme intermédiaires avec leurs propres panthéons.
Secret : Yves fera échouer le projet en douce (il veut des troisièmes forces indépendantes, simples pions pour ralentir le Grand Jeu).`, [inScene(michel), inScene(hercule)], false,
    [choice('michel', 'Comment les PJ accueillent-ils le projet de Michel ?', [
      ['Ouvertement hostiles', 'Michel renonce à la DTC : plus de contact, les PJ suivent la suite par ouï-dire ; les autres troisièmes forces réagissent pareil et le conseil n\'aura peut-être même pas lieu.'],
      ['Franchement pour', 'Le projet est bien accueilli par les autres représentants de la troisième Force ; Michel monte son dossier plus vite.'],
      ['Mitigés ou pleins d\'objections', 'Michel argumente (conversions d\'Ange et la sienne, expérience du Chaudron, buts communs contre les démons et pour l\'humanité).'],
    ])]),
  scene('ange', 'Michel 3 – Présentation d\'Ange', 'Siège de la DTC',
    `Quelque temps plus tard, Michel revient avec Ange, archange des Convertis : c'est son service qui ferait des anges de tout ce monde, et elle est en bons termes avec les troisièmes forces.
Elle se demande encore si l'idée est bonne et réalisable. Elle interroge les PJ sur leur vision du Bien par des dilemmes sans bonne réponse (sauver un homme ou réussir la mission ; tuer un démon qui fait vivre plusieurs enfants…).
Après cette visite, elle adopte à la DTC l'apparence d'une jeune femme en noir.`, [inScene(ange), inScene(michel)], false,
    [choice('ange', 'Comment les PJ se comportent-ils face à Ange ?', [
      ['Comme des sagouins', 'Ange émet des doutes sur le projet.'],
      ['De façon irréprochable', 'Ange devient enthousiaste.'],
      ['Correctement, sans plus', 'Ange suit Michel avec réserve.'],
    ])]),
  scene('prepa', 'Michel 4 – Préparation du conseil', 'Terrain, DTC, églises, Croix-Rouge…',
    `Petites vignettes pour éprouver la valeur et la foi des futurs anges, et étendre le réseau de Michel :
• accompagner des anges de Michel pour casser du démon ;
• passer une journée à entraîner des soldats de Dieu ;
• assister à une messe, réciter des passages de la Bible ;
• faire du bénévolat à la Croix-Rouge ;
• organiser des rencontres entre les deux archanges et d'autres représentants (Isis et Osiris, l'Ankou, etc.).
Idéalement, au moment du conseil, le nouveau Chaudron doit apparaître aux joueurs comme la seule solution disponible.`, [inScene(michel), inScene(ange)], true),
  scene('conseil', 'Michel 5 – Le Conseil', 'DTC (le conseil a lieu hors champ, au Paradis)',
    `Quand : vers les deux tiers de la campagne. Attention, des vétérans d'INS/MV pourraient croire que ce conseil conclut la campagne : il doit au contraire marquer le début des choses sérieuses.
La veille, Michel passe voir les PJ et rit bêtement, sans doute pour chasser le trac. Trois jours plus tard, il revient, ivre et chancelant, annoncer l'échec : le nouveau Chaudron ne se fera pas (Yves s'est abstenu en poussant les autres à voter contre). Michel sort affaibli, mais l'histoire continue.`, [inScene(michel)]),
  // ---------- Entracte ----------
  scene('regis', 'Entracte – Jésus chez Régis', 'Chez Régis',
    `Quand : après le scénario Les kiwis se cachent pour mûrir, où les PJ ont rencontré Jésus qui les invite.
Les PJ sont seuls au bar ; Jésus bavarde, parle d'ajouter de la petite restauration. Entre un vieillard impressionnant, barbe blanche, toge bleutée, sandales : Dieu. Il jette un regard navré aux PJ et à Jésus, puis prend son fils à part, assez près pour qu'on entende.
Échange père-fils : reproches voilés, Jésus défend son bar (« il s'y passe des choses qui changent le monde ») et ses projets secrets, refuse encore de succéder à son père qui veut prendre sa retraite. Ça se termine autour d'un lait de chèvre.
Pas d'enjeu mécanique : une scène d'ambiance qui installe Chez Régis comme lieu clé (ragots, relance d'enquête, accès futur à Mythopolis).`, [inScene(jesus)]),
  // ---------- Trame « Mythopolis » ----------
  scene('legende', 'Mythopolis 1 – La légende de la ville', 'N\'importe où (bar, rue), même en plein scénario',
    `Un PJ est abordé par Romain, mage urbain clochard, qui délire sur une ville légendaire introuvable, Mythopolis. Impossible d'en tirer plus.
Contexte MJ : Seth et Naama, exilés dans le Rien (voir Habeas Corpus), sont tombés sur une marche stable et malléable : un nouveau jardin d'Eden entouré de quartiers évoquant Atlantis, Avalon, El Dorado, Utopie, Ur, R'lyeh, Laputa, Mildendo, Ys… Elle se nourrit des rêves de cités interdites et a hérité de leur discrétion : introuvable depuis la MRC. Les mages urbains la pressentent sans pouvoir la trouver. Seul accès : l'arrière-salle de Chez Régis.`, [inScene(romain)]),
  scene('recherche', 'Mythopolis 2 – Malachite et la recherche', 'Paris, sites de villes légendaires (Brocéliande…)',
    `Plus tard (éventuellement bien plus tard), les PJ rencontrent Malachite, mage urbain sensé. Il connaît la légende et cherche une copie des tablettes de Raämalû, censée décrire un accès ; la piste mène à la DTC (scénario Memento Flatula, à la fin duquel la copie est détruite).
Les PJ peuvent visiter des lieux légendaires : ils ne trouveront rien. Ne pas s'y attarder, sauf pour accrocher d'autres scénarios.`, [inScene(malachite)]),
  scene('trouvure', 'Mythopolis 3 – La trouvure de Mythopolis', 'Chez Régis, puis Mythopolis',
    `Quand : au moment choisi par le MJ, avant le grand final.
Malachite dit avoir une piste et donne rendez-vous aux PJ dans un PMU, La Selle de Cuir. À l'adresse, il n'y a que Chez Régis ; Malachite est là, perplexe. Jésus salue les PJ et, entendant le sujet, leur montre la porte du fond : Mythopolis est juste derrière.
Sur place : rues grandioses, bâtiments de deux étages au plus, styles et matériaux changeant d'un quartier à l'autre, ciel de crépuscule étoilé. Au centre, le jardin d'Eden et ses deux seuls habitants, Seth et Naama, presque nus et main dans la main (plus d'un an de huis clos les a rendus fous d'amour).
Ils se méfient d'abord, puis assaillent les PJ de questions (comment entrer, sortir, que se passe-t-il sur Terre depuis cinq ans ?). Trop faibles pour sortir, ils veulent renouer avec leurs conpsis : les PJ peuvent donner « l'adresse » de Chez Régis à un contact psi (ce qui arrange Jésus).`, [inScene(seth), inScene(naama), inScene(malachite), inScene(jesus)], true,
    [choice('seth', 'Comment les PJ abordent-ils Seth et Naama ?', [
      ['Pacifiquement', 'Le couple se détend ; il deviendra un allié (et un appel au secours possible lors du final).'],
      ['Agressivement', 'Une ou deux attaques, puis Seth et Naama disparaissent dans la ville, introuvables.'],
    ])]),
  // ---------- Trame « Victor » ----------
  scene('licorne', 'Victor 1 – Un petit tour en Faërie : la licorne', 'Bois de Boulogne, Paris',
    `Quand : entre deux scénarios vers le début de la campagne, ou au milieu d'un autre.
Contexte MJ : Victor est né de France d'Argon (dragonne) et d'Aubéron ; élevé par Brand dans la haine de ses parents, il est devenu en un an un capitaine estimé de la rébellion de Faërie.
Mission : Manolar, proche d'Aubéron, demande à la DTC de retrouver une licorne échappée à Paris avant que des humains ne comprennent ce qu'elle est.
Pistes : entrefilet « hallucination collective » dans un journal local ; un psi qui l'a vue appelle la DTC ; chercher les zones boisées ou se souvenir du portail vers Faërie du Bois de Boulogne.
Capture : plutôt de nuit, avec rencontres nocturnes cocasses au Bois et contrôle de police possible. La bête est rapide, puissante et se défend à coups de corne. Rester discret ; prévoir un bobard pour les témoins.`, [inScene(manolar), inScene(licorne)], true),
  scene('faerie', 'Victor 2 – Faërie : le camp de la rébellion', 'Faërie, campement d\'elfes',
    `Le portail du Bois de Boulogne s'ouvre par intermittence. Faërie est en pleine guerre civile (Aubéron et Titania contre Brand). Les PJ arrivent près d'un camp d'elfes armés jusqu'aux dents.
Victor vient à eux, sous forme humaine (il ne montrera ni n'évoquera jamais sa forme de dragon) : il s'enquiert de leur mission, ne les empêche pas de rendre la licorne à Manolar, mais leur conseille de filer avant les grands combats qui se préparent. Il doit faire très forte impression : beauté inhumaine, regard terrible, intelligence, cruauté.
Le cuisinier du camp, gros bonhomme loufoque qui chante à tue-tête, fait la meilleure cuisine de Faërie : c'est Haagenti, qui suit Victor de très près. Les PJ ne doivent pas l'apprendre.
Les PJ peuvent apercevoir Aubéron. Retour sans difficulté.
Hors champ, après leur départ : Victor mène l'assaut final, affronte Aubéron en duel, le dévore et absorbe ses pouvoirs. Titania s'enfuit aux États-Unis.`, [inScene(victor), inScene(cuisinier), inScene(manolar), inScene(elfes, { qty: 4 })]),
  scene('avalon', 'Victor 3 – Avalon ? Il y a quelqu\'un ?', 'Portail (Brocéliande, Stonehenge ou station Alésia), puis Avalon',
    `Hors champ : Victor et sa garde elfe passent de Faërie à Avalon et dévorent les dieux celtes, déjà affaiblis depuis l'attaque ratée contre Notre-Dame (Deus ex machina).
Mission : la Serpe d'Or (cercle de druides, chef Pierre Carré) ne parvient plus à parler à ses dieux et paie la DTC pour aller voir. Les druides ne viennent pas.
Sur place : marche ravagée, déserte, vidée d'énergie, à moitié partie dans le Rien. Rien à trouver.
Retour : annoncer aux druides qu'Avalon n'existe plus. Ils sont incrédules puis rongés de culpabilité (ils s'étaient éloignés de leurs dieux) ; ils gardent leurs pouvoirs. Aucun indice ne permet aux PJ de soupçonner autre chose que le délitement naturel.`, [inScene(carre)]),
  scene('egypte', 'Victor 4 – Ce soir, on mange égyptien !', 'Siège de la DTC',
    `Hors champ : Victor passe par la Vallée des Rois pour atteindre Héliopolis, dévore les dieux présents et découvre un arbre à pommes d'or de deuxième génération : sa puissance explose et il devient accro. Il se tourne vers les mythes grec et nordique du jardin aux pommes d'or.
Isis et Osiris, incarnés sur Terre pendant l'attaque, sont les seuls survivants. Ils refusent l'explication du délitement et finissent par se persuader que le coupable est Alain, leur vieil ennemi. Ils veulent d'abord une rencontre diplomatique, avec témoins.
Mission : Hercule est en route vers l'Olympe ; un sous-chef de la DTC charge les PJ d'organiser et d'animer une réunion avec Alain, et d'y convier Michel et Ange. Convaincre chacun de venir peut être plus ou moins difficile, au choix du MJ. La réunion elle-même a lieu dans la scène suivante.`, [inScene(isis), inScene(osiris), inScene(alain), inScene(michel), inScene(ange)]),
  scene('reunion', 'Final 1 – La réunion', 'Siège de la DTC',
    `Hors champ : Victor achève l'Olympe (Apollon, Héra…) et mange les pommes d'or. Hercule y arrive trop tard et rentre en catastrophe. Titania, ayant entendu parler de la réunion par un ange d'Ange, revient des États-Unis.
Le jour de la réunion, trois révélations en cascade, à mettre en scène de façon théâtrale (Hercule qui fait irruption en pleine séance, par exemple ; les PJ peuvent se répartir les témoignages) :
• Titania : Victor a dévoré Aubéron sous forme de dragon, il est surpuissant.
• Hercule : l'Olympe est vide, son arbre aux pommes d'or dévasté.
• La discussion montre qu'Alain n'y est pour rien ; échanges houleux, les PJ modèrent. Alain est triste et blessé.
Conclusions possibles : une attaque concertée vise les panthéons et leurs arbres à pommes d'or ; il ne reste qu'Asgard. Renforts possibles : les participants, et des PNJ croisés dans les scénarios (Athéna, Catherine, Lilith, Hadès…). France d'Argon reste introuvable. Michel peut se demander à voix haute où rebâtir un havre pour la troisième Force (rappel de Mythopolis).`, [inScene(hercule), inScene(titania), inScene(isis), inScene(osiris), inScene(alain), inScene(michel), inScene(ange)], false,
    [choice('asgard', 'Les PJ volent-ils au secours d\'Asgard ?', [
      ['Oui, avec ou sans renforts', 'Ils combattent les elfes à Asgard ; Victor, attaqué par les dieux, s\'enfuit (peut-être gravement blessé) vers Mythopolis.'],
      ['Non (« Ah ben merde alors ! »)', 'Victor pille les pommes d\'Asgard sans être dérangé, puis file vers Mythopolis au mieux de sa puissance.'],
    ])]),
  scene('asgard', 'Final 2 – Asgard se défend', 'Asgard, jardin d\'Idunn',
    `Victor trouve enfin Bifrost dans une aurore boréale. Asgard, plus stable et plus riche en énergie, résiste comme un beau diable. Victor ne vise que l'arbre à pommes d'or : il les mange, mange deux ou trois occupants, casse quelques trucs, puis cherche à repartir.
Si les PJ sont là : ils affrontent d'abord les guerriers elfes ; Victor, aux prises avec les dieux, s'en sort vivant (éventuellement gravement blessé). Affaibli, il part vers Mythopolis : il sent les vraies pommes du jardin d'Eden (il gagne Voyage onirique).
Gestion : voir les conseils de la scène suivante (laisser les gros bras entamer Victor, PJ contre la piétaille).`, [inScene(elfes, { qty: 6 }), inScene(victor)], true),
  scene('bataille', 'Final 3 – Mythopolis : l\'ultime bataille', 'Mythopolis, jardin d\'Eden',
    `Les PJ y viennent par déduction (Victor veut les pommes, et le jardin d'Eden est à Mythopolis) ou sur un appel au secours de Seth ou de Jésus. Présents : PJ, dieux païens, anges, renforts éventuels, Seth, Naama, Jésus, Victor et ses elfes.
Conseils du livre :
• Trichez : sur la santé de Victor, ses attaques, ses défenses, en ajoutant des immunités contre les combos trop efficaces, et dans les combats entre PNJ.
• Ne jouez pas les combats des PNJ : laissez les « gros bras » entamer Victor pendant que les PJ affrontent les elfes (nombre libre). Toutes les 1d6 secondes, un dieu tombe (Isis, Heimdall, Titania, Njord, Osiris, Seth…).
• Une fois la piétaille éliminée, les PJ affrontent Victor, qui n'attaque un PJ qu'une fois toutes les 1d6 secondes (plusieurs attaques par seconde possibles en dragon). C'est la fin : n'hésitez pas à tuer des PJ.
• Un beau triple doit suffire à toucher et blesser Victor : il explose dans une gerbe de lumière, reprend forme humaine et s'enfuit. Toute idée cool (tour qui s'effondre, bombe…) doit marcher.
Échec : à Asgard, une bonne partie des dieux est dévorée ; sur Mythopolis, Victor mange les dernières vraies pommes et part défier George au Paradis (issue hors de portée des PJ, apprise par Michel) ou l'appelle en duel devant eux.
Dans tous les cas, Victor en ressort apaisé, libéré d'Haagenti ; il marche jusqu'à la Bourboule où Dieu fait de lui le nouvel archange du Feu.`, [inScene(victor), inScene(elfes, { qty: 8 }), inScene(seth), inScene(naama), inScene(jesus), inScene(hercule)], true,
    [choice('victor', 'Issue de l\'ultime bataille ?', [
      ['Victor blessé, il s\'enfuit sous forme humaine', 'Victoire des PJ : Mythopolis est sauvée.'],
      ['Victor vainqueur', 'Il dévore les dieux restants, mange les dernières vraies pommes et affronte George (match nul conseillé, ou mort de George).'],
    ])]),
  scene('bilan', 'Final 4 – Il pense s\'épeler : le Sanctuaire', 'Mythopolis',
    `On panse ses plaies. Jésus soigne tout le monde à coups de Miracles et réunit les survivants autour d'une marmite de chocolat fondu. Un plan se dessine : Mythopolis devient le Sanctuaire des troisièmes forces.
• Maison des dieux incarnés restants et de leurs héros ; centre des psis et des conpsis ; refuge des renégats des deux camps.
• Michel, Ange et Alain détournent une partie de leurs flux de PP vers Mythopolis et cachent son existence aux extrémistes du Paradis (en échange d'un soutien au conseil).
• Seth et Naama mettent la logistique des conpsis au service des héros (appuis politiques, salaires, équipement).
• Jésus recrute les renégats qu'il connaît via Chez Régis ; Malachite, s'il est là, les mages urbains.
Règles du Sanctuaire : les dieux et héros sans marche (tous sauf les vikings) reviennent sur Mythopolis après la mort de leur corps et y forment un avatar ; les psis affiliés (Malum, Syndicat) y vont après leur mort au lieu du Purgatoire, les plus méritants pouvant revenir en « héros psis » ; idem pour sorciers et mages urbains qui rejoignent le Sanctuaire ; les renégats y trouvent aussi une maison. La nature des personnages (Chance ou Foi, aura, seuils…) ne change pas.
Épilogue : Victor s'installe au Paradis comme agent personnel de Dieu (et collectionne les cactus nains). Mythopolis s'ouvre, d'autres passages que Chez Régis sont construits. La troisième Force est partiellement unie ; tout reste à inventer.
Secret : Haagenti a gagné son pari contre Baal (plus de morts chez les païens que toutes les troupes de la Guerre). À révéler ou non.`, [inScene(jesus), inScene(seth), inScene(naama), inScene(michel), inScene(ange), inScene(alain), inScene(hercule)]),
];

const scenario = {
  id: 'pa0-campagne',
  nom: 'Petites Apocalypses – Une apocalypse, ce n\'est pas la fin du monde',
  resume: 'Campagne de fond pour PJ de la troisième Force (agents de la DTC d\'Hercule). Les marches païennes se délitent ; Michel tente de faire accueillir les païens au Paradis (le nouveau Chaudron) et échoue ; pendant ce temps, Victor, jeune dragon fils d\'Aubéron rendu insatiable par Haagenti, dévore un à un les panthéons et leurs pommes d\'or. Tout se termine sur Mythopolis, refuge secret de Seth et Naama derrière Chez Régis, par une bataille finale et la fondation du Sanctuaire des troisièmes forces.',
  notes: `Source : ${REF}.
Ce n'est pas un scénario : ce sont des trames et des vignettes (de la simple discussion avec un PNJ à une courte aventure) à intercaler entre les scénarios du livre, comme l'arc de fond d'une saison de série télé. Chaque scène de ce fichier est une trame ou une vignette ; elles sont rangées par trame, pas dans l'ordre de jeu.

Comment l'intercaler (ordre conseillé) :
• Début de campagne : Marches 1 en ouverture du premier scénario ; Marches 2 au fil des premières séances ; Victor 1-2 (licorne, Faërie) entre deux des premiers scénarios ou au milieu de l'un d'eux ; Michel 1 tôt si un PJ est viking ; Mythopolis 1 (Romain) n'importe quand.
• Milieu : Michel 2-4 (premiers contacts, Ange, préparation) réparties entre plusieurs scénarios ; Entracte après Les kiwis se cachent pour mûrir ; Mythopolis 2 (Malachite) après Memento Flatula ; Victor 3 (Avalon) ; Michel 5 (le Conseil) vers les deux tiers, quand le nouveau Chaudron semble la seule solution ; puis Victor 4 (Isis et Osiris).
• Fin : Mythopolis 3 (découverte) avant le final, sinon le final s'appuie sur un appel au secours ; Final 1 à 4 enchaînés, éventuellement sur une séance entière.
• Marches 3 (attaques de démons) : en fond tout au long de la campagne, dès que les PJ se font remarquer.
Les six scénarios du livre (Memento Flatula, Les kiwis se cachent pour mûrir, Un coup de fil à la patte, Langues et sécateur, On n'encule pas les mouches avec du vinaigre, La douloureuse absence de Clint Eastwood) et les deux mini-scénarios (L'épopée du Kiti-Kon, Le spartiate noir) sont indépendants : les placer librement entre les vignettes, ou écrire les vôtres.

Résumé de l'arc : la naissance de Damien a fragilisé les marches ; les dieux cherchent une nouvelle maison. Michel propose le Paradis, le conseil refuse (manœuvre d'Yves). Victor dévore Faërie (Aubéron), Avalon, Héliopolis, l'Olympe, attaque Asgard puis Mythopolis. Les PJ, les dieux survivants et les fondateurs des conpsis l'affrontent et fondent le Sanctuaire avec l'appui de Michel, Ange et Alain. Dieu fait de Victor le nouvel archange du Feu.

Création des PJ (chapitre quatre) : psionique, héros païen de base ou renégat de grade 0 ; pour équilibrer, PA supplémentaires aux héros païens ou 120 PA pour tous.
Règle de campagne : récupération des PP des héros païens ratée sur 1 au d6 (puis 1-2, 1-3 si la situation empire).
Récompenses : le livre ne donne pas de barème de PA ; à fixer selon les scénarios joués.

Fiches : Jésus, Seth, Naama, guerriers elfes et Victor ont les caractéristiques du livre ; Hercule vient du chapitre quatre (p. 21). Les attaques « 66/RU+X/M+Y » sont saisies au format du livre (attaque X×2, puissance Y Force comprise, sans Force ajoutée). Michel, Ange, Alain, Isis, Osiris, Titania, le cuisinier, Manolar, Romain, Malachite et Pierre Carré n'ont pas de caractéristiques (fiches minimales). La licorne est estimée.`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [hercule, jesus, seth, naama, elfes, victor, licorne, michel, ange, alain, isis, osiris, titania, cuisinier, manolar, romain, malachite, carre].map(asType);
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));
writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types,', scenes.reduce((a, s) => a + s.choix.length, 0), 'choix');
