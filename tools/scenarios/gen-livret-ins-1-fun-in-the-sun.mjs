// Génère le fichier d'import « insmv-scenario » pour « Fun in the sun ! » (livret In Nomine Satanis, livre de base 4e éd., p. 54-61)
// usage : node gen-livret-ins-1-fun-in-the-sun.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Livret In Nomine Satanis (livre de base 4e éd.), « Fun in the sun ! », p. 54-61';
const L = (s) => R.parseLvl(String(s));
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
const ARMES = new Map(R.ARMES.flatMap(([g, l]) => l.map((x) => [x[0], { prec: x[1], puis: x[2], melee: R.MELEE_GROUPS.includes(g) }])));
// arme de la table des règles : nom affiché, nom dans la table, niveau du talent
const arme = (n, table, lvl) => { const w = ARMES.get(table); if (!w) throw new Error('arme inconnue : ' + table); return { n, att: L(lvl), ...w }; };
const poing = (lvl) => arme('Coup de poing', 'Coup de poing', lvl);
const P = 'ins1-'; let n = 0; const id = (k) => P + k;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [poing(1)], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});

// ---------------- Humains ----------------
const irakiens = npc('irakiens', {
  nom: 'Soldats irakiens', source: 'Du genre de ceux qui se battent un peu quand même', qty: 6, car: car('2 2+ 2+ 2 2 2+'), def: L(3),
  pfFix: 4, seuilsFix: seuils('3/6/9/12'),
  armes: [arme('Fusil-mitrailleur', 'Fusil-mitrailleur', '2+'), arme('Lance-roquettes antichar', 'Lance-roquettes antichar', 1), poing('2+')],
  talents: 'Corps à corps 2+, Défense 3, Discrétion 3+, Fouille 2+, Intrusion 2, Survie 1 (désert 3+), Tir 1 (armes automatiques 2+)',
  notes: 'Moral au plus bas, mais tentés de s\'en prendre à un petit groupe incapable d\'appeler l\'artillerie. Matériel lourd : lance-roquettes, mortiers. Avec des journalistes, souvent sympathiques et prêts à servir de guides contre quelques dollars.\nLance-roquettes au niveau de Tir (1), fusil-mitrailleur à la spécialité armes automatiques.',
});
const americains = npc('americains', {
  nom: 'Soldats américains', source: 'Du genre de ceux qui tirent sur tout ce qui bouge dans le désert', qty: 6, car: car('2+ 2 2+ 2 2+ 2'), def: L(2),
  pfFix: 4, seuilsFix: seuils('3/7/10/14'),
  armes: [arme('Fusil-mitrailleur', 'Fusil-mitrailleur', 3), arme('Lance-roquettes antichar', 'Lance-roquettes antichar', '1+'), poing(2)],
  talents: 'Corps à corps 2, Défense 2, Discrétion 1+, Fouille 2, Tir 1+ (armes automatiques 3)',
  notes: 'Rangers égarés dans le désert, GI des check-points ou escorte de l\'ange de Dominique (six GI parfaitement normaux, qui ignorent tout de sa nature).',
});
const anglais = npc('anglais', {
  nom: 'Soldats anglais', source: 'Les mêmes, mais en ville', qty: 6, car: car('2 2+ 3 2 2 2'), def: L('2+'),
  pfFix: 4, seuilsFix: seuils('3/6/9/12'),
  armes: [arme('Fusil-mitrailleur', 'Fusil-mitrailleur', '3+'), arme('Lance-roquettes antichar', 'Lance-roquettes antichar', 2), poing('2+')],
  talents: 'Corps à corps 2+, Défense 2+, Discrétion 2, Fouille 3, Intrusion 2+, Tir 2 (armes automatiques 3+)',
  notes: 'Troupes urbaines (Bassora). À éviter pendant la mission « d\'illumination » du colonel anglais.',
});
const soldatsDieu = npc('soldats-dieu', {
  nom: 'Soldats de Dieu anglais', source: 'Anglais, et ce n\'est pas là leur moindre défaut', type: 'soldat', qty: 4, car: car('2+ 3 3 2 2 2'), def: L('2+'),
  pp: 7, pfFix: 4, seuilsFix: seuils('3/7/10/14'),
  armes: [arme('Fusil-mitrailleur', 'Fusil-mitrailleur', '3+'), poing('2+')],
  pouvoirs: pows('Augmentation de Perception 1, Champ de force 1'),
  talents: 'Corps à corps 2+, Défense 2+, Discrétion 2, Fouille 3, Intrusion 2+, Tir 2 (armes automatiques 3+)',
  notes: 'Le commando qui a massacré le squad de Jo ; sous les ordres de l\'ange de Michel revanchard. Il en reste quatre lors de l\'attaque à Babylone.\nArmes non précisées : fusil-mitrailleur (comme les soldats anglais) estimé.',
});

// ---------------- Démons ----------------
const caym2 = npc('caym-2', {
  nom: 'L\'observateur (démon de Caym)', source: 'Démon de Caym, grade 2, taciturne et mystérieux – officier opérationnel de la CIA', type: 'demon',
  car: car('4+ 4+ 4 2+ 2 2+'), def: L(4), pp: 28, pfFix: 7, seuilsFix: seuils('6/13/19/26'),
  armes: [poing(5), arme('Matraque', 'Matraque', 1)],
  pouvoirs: pows('Armure corporelle 3, Augmentation d\'Agilité 3, Augmentation de Perception 3, Contrôle des animaux 4+, Esquive acrobatique 4, Transformation 3'),
  talents: 'Combat 2 (contondantes 1), Corps à corps 5, Défense 4, Discrétion 4+, Discussion 2, Enquête 5, Fouille 6, Intrusion 5+',
  notes: 'Grand, blond, mâchoire carrée, cache-poussière de l\'armée américaine, yeux gris de serpent : on dirait un ange de Laurent. Envoyé par Caym pour suivre la mission ; il observe les PJ sans jamais intervenir directement, les stresse et peut les tirer d\'affaire en douce.\nCouverture de plus de vingt ans : officier de la CIA spécialisé dans l\'exfiltration. Dispose d\'un hélicoptère léger AH-6 Little Bird pour se déplacer et, au besoin, abattre le dragon s\'il file vers une zone peuplée.\nArmes non données : poing (Corps à corps 5) et matraque (contondantes 1) ; armement de l\'hélicoptère à la discrétion du MJ.',
});
const jo = npc('jo', {
  nom: 'Jo (démon de Baal)', source: 'Démon de Baal, grade 1, major des Rangers et emmerdeur à ses heures', type: 'demon',
  car: car('4+ 3+ 3 3 2 2+'), def: L('3+'), pp: 12, pfFix: 7, seuilsFix: seuils('6/13/19/26'),
  armes: [arme('Fusil-mitrailleur', 'Fusil-mitrailleur', '3+'), arme('Couteau de combat', 'Poignard ou saï', '5+'), poing('5+')],
  pouvoirs: pows('Art de combat 2+, Arts martiaux 2, Augmentation de Force 1+, Éventration 1, Forme de combat 1, Régénération 1'),
  talents: 'Combat 5+, Corps à corps 5+, Défense 3+, Discrétion 4+, Tir 3+',
  notes: 'Seul survivant de son squad, massacré par les soldats de Dieu anglais de l\'ange de Michel. Repère les PJ quand ils abusent de leurs pouvoirs et s\'incruste (version militaire). Ne dort presque jamais, retrouve toujours le groupe, cherche la bagarre en permanence, massacre même les Irakiens qui se rendent et invente des façons absurdes de tuer pour raconter ses exploits. Finit par appeler sa hiérarchie pour « demander l\'autorisation » : il faut le semer ou le faire tuer avant la fin, la mission étant officieuse.\nArmes non données : fusil-mitrailleur et couteau estimés (Rangers).',
});
const nybbas = npc('nybbas', {
  nom: 'Démon de Nybbas (reporter)', source: 'Démon de Nybbas, grade 1, et tout aussi chiant', type: 'demon',
  car: car('2 2 2+ 4 4 3+'), def: L('2+'), pp: 12, pfFix: 6, seuilsFix: seuils('4/8/12/16'),
  armes: [poing(1)],
  pouvoirs: pows('Absorption de Présence 1, Aura d\'inattention 1, Charme 1, Message subliminal, Paralysie 1, Volonté supra-normale 2'),
  talents: 'Baratin 3+, Défense 2+, Discrétion 2+, Discussion 4+, Séduction 3+',
  notes: 'Équivalent de Jo pour la version journaliste : complètement taré, son cameraman a été abattu par un sniper américain. Multiplie les directs au milieu des combats avec sa valise satellite, ce qui attire des frappes aériennes sur toute la zone.\nAucun talent de combat : coup de poing au niveau 1 estimé.',
});

// ---------------- Anges ----------------
const michel1 = npc('michel-1', {
  nom: 'GI à la machette (ange de Michel)', source: 'Ange de Michel, grade 1, auteur d\'un massacre', type: 'ange',
  car: car('4+ 4+ 3+ 3+ 3 3'), def: L(4), pp: 15, pfFix: 8, seuilsFix: seuils('7/15/22/30'),
  armes: [arme('M16', 'Fusil-mitrailleur', '5+'), arme('Machette', 'Hachette (à une main)', '4+')],
  pouvoirs: pows('Arme exaltée 1+, Armure corporelle 2, Augmentation de Force 1+, Maîtrise martiale 2'),
  talents: 'Combat 4+, Défense 4, Discrétion 2+, Intrusion 3+, Survie 2+ (désert 4+), Tir 3+ (armes automatiques 5+)',
  notes: 'Rencontre « Méchoui de bébés » : dernier survivant d\'un affrontement contre un démon de Majûj, qui l\'a fait basculer avec Bestialité avant de mourir. Sous l\'emprise du pouvoir, il a torturé et massacré tout le village, puis s\'est effondré dans une cave. Il ne se souvient de rien au réveil ; la mémoire lui revient peu à peu au fil de la conversation.\nMachette rendue par la hachette de la table des armes.',
});
// Fiches déjà présentes au bestiaire des livres (js/data/bestiaire.js) : valeurs reprises telles quelles
const michel2 = npc('michel-2', {
  nom: 'Ange de Michel revanchard', source: 'Ange de Michel, grade 2, vétéran du Vietnam – chef des soldats de Dieu anglais', type: 'ange',
  car: car('6 4 4 2+ 3+ 4'), def: L('6+'), pp: 24, pfFix: 8, seuilsFix: seuils('9/18/27/36'),
  armes: [{ n: 'M16 béni (arme majeure, attaque multiple)', att: L(7), prec: 2, puis: 9, melee: false }],
  pouvoirs: pows('Armure corporelle 2+, Augmentation de Force 2, Maîtrise martiale 5+, Membre blindé, Trait d\'énergie 2, Volonté supra-normale 5+'),
  talents: 'Corps à corps 7+, Défense 6+, Discrétion 4, Fouille 2, Tir 3+ (armes automatiques 7)',
  notes: 'Crétin notoire, mais il dirige les Anglais qui ont massacré le squad de Jo et reviennent à la charge à Babylone. Son arrivée met le dragon dans une rage folle : il sent les créatures du Bien et n\'écoute plus les PJ.\nM16 béni : précision +2, puissance +9, pénétration importante, portée longue (livre).',
});
const dominique = npc('dominique-1', {
  nom: 'GI tatillon (ange de Dominique)', source: 'Ange de Dominique, grade 1, adepte de l\'administration', type: 'ange',
  car: car('3 3 4 5 2 5'), pp: 17, pfFix: 8, seuilsFix: seuils('6/12/18/24'),
  armes: [arme('Pistolet', 'Revolver petit calibre', 3)],
  pouvoirs: pows('Armure corporelle 1, Arts martiaux 1, Détection du mal 2, Jugement 2, Rêve 1'),
  talents: 'Baratin 4+, Discussion 5, Enquête 6, Fouille 5, Tir 1+ (armes de poing 3)',
  notes: 'Gradé obtus qui épluche papiers et identités et fait des prises de sang : il traque les anges de Michel infiltrés dans la coalition et n\'imagine pas croiser des démons ici. Débutant. Escorté de six GI normaux.\nDéfense non donnée : niveau de base d\'après les caractéristiques, comme au bestiaire des livres.',
});
dominique.def = R.talentBase({ car: dominique.car }, 'Défense');

// ---------------- Le dragon ----------------
const dragon = npc('dragon', {
  nom: 'Le dragon de Caym', source: 'Le héros de ce sympathique scénario', type: 'monstre',
  car: car('8 1+ 3 4 1 2+'), def: L(5), pp: 22, pfFix: 12, seuilsFix: seuils('12/24/36/48'),
  armes: [{ n: 'Mâchoire', att: L(6), prec: 2, puis: 10, melee: false }],
  pouvoirs: pows('Apparence horrifique 3, Armure corporelle 4, Jet de flammes 3+, Vol 4'),
  talents: 'Corps à corps 6, Défense 5, Discrétion 1+, Survie 1+ (désert 5)',
  notes: 'Dernier survivant du zoo de Caym à Babylone, réveillé par un missile après des siècles de sommeil. Gros crapaud de quatre mètres, bave acide, queue ridicule, ailes décoratives (il vole par magie). Vrai abruti : ne parle qu\'avec peine des langues antiques. Repu, il dort dans une salle souterraine sous le cratère d\'un Tomahawk.\nIl veut s\'envoler pour narguer F-18 et Black Hawks, et fait des escapades matinales pour manger (jamais de véhicules : il n\'aime pas les conserves). Enragé par la présence d\'anges.\nMâchoire : caractéristiques de dents de sabre, précision +2, puissance +10, bonus de Force déjà compris (d\'où l\'absence de « contact + Force »).',
});

// ---------------- PNJ sans caractéristiques ----------------
const grue = npc('grue', {
  nom: 'La grue (familier de Caym)', source: 'Contact du briefing', type: 'familier',
  notes: 'Grande blonde vulgaire habillée en prostituée, plates-formes boots avec poisson rouge vivant dans chaque talon. Voix monocorde, air absent. Familier de Caym (qui n\'aime que les chiens, pas les grues). Donne la mission, l\'argent et les billets, puis gifle le plus costaud et file.\nPas de caractéristiques dans le livre.',
});
const toufik = npc('toufik', {
  nom: 'Toufik', source: 'Intendant de la villa de Koweït City, contact sur place',
  notes: 'Serviteur des forces du Mal qui veut rester discret : les PJ ne doivent pas le contacter avant d\'avoir le dragon. Intendant de la « salle de jeu » d\'un jeune Koweïtien.\nPas de caractéristiques dans le livre.',
});
const colonel = npc('colonel', {
  nom: 'Le colonel anglais', source: 'Officier en manque de commandos (version militaire)',
  notes: 'Reconnaît les insignes des PJ et les interpelle en public pour une mission prioritaire : guider au laser une bombe de B-2 sur un dignitaire irakien à Bassora. Il a vérifié auprès du QG des forces spéciales américaines.\nPas de caractéristiques dans le livre.',
});
const caym = npc('caym', {
  nom: 'Caym (dans le lapin blanc)', source: 'Prince-démon des animaux, commanditaire', type: 'demon',
  notes: 'Se crée un avatar en forme de petit lapin blanc (l\'original finit explosé dans les toilettes de la villa). Il tient à voir le dragon vivant… pour le tuer lui-même sous les yeux des PJ.\nPas de caractéristiques : prince-démon, hors combat.',
});

const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  scene('briefing', '1. Briefing au Quick de Créteil', 'Quick de Créteil – un matin d\'avril 2003',
    `Un pitbull gratte à la porte des PJ et leur dépose un bras d'enfant ensanglanté ; la main serre un papier : rendez-vous au Quick de Créteil dans deux heures (message pas du tout officiel).
Le Quick est un coupe-gorge de banlieue : chaque client peut être dangereux, les PJ doivent se tenir à carreau.
La contact est une grande blonde vulgaire au regard absent (familier de Caym). Mission officieuse, mais Caym promet beaucoup de PA :
• aller dans les ruines de Babylone récupérer un « animal » oublié par Caym (elle ne sait pas ce que c'est : « vous le reconnaîtrez ») ;
• le ramener vivant à une adresse de Koweït City ; contact sur place : Toufik (numéro de téléphone), à ne joindre qu'une fois l'animal récupéré ;
• l'affaire n'a rien à voir avec la guerre, c'est la guerre qui la complique.
Elle remet environ 20 000 dollars en petites coupures, des billets Roissy–Koweït City open et des visas. Pas question de demander comment aller de Koweït à Babylone (fou rire de hyène). Elle finit son menu, gifle le plus costaud et part.
Grand Jeu : la tuer devant témoins serait une faute.`,
    [inScene(grue)]),
  scene('voyage', '2. Le voyage pour l\'Irak', 'Paris, Roissy',
    `Partir sans préparer sa couverture est une erreur : à Koweït City il sera trop tard. Deux options viables :
• Soldats : le mieux est de passer pour un squad de forces spéciales (armes exotiques, lunettes de soleil, tatouages, coupe de surfer). Il faut connaître les usages de l'armée, des papiers et ordres de mission pour les check-points, et des contacts sérieux dans l'armée américaine (ou anglaise). Attention : l'armée américaine est truffée d'anges, et certains vrais agents de terrain savent qui est censé être où.
• Journalistes : plus facile mais plus dangereux. Les journalistes intégrés sont choisis de longue date ; il faut donc être indépendants avec de vraies cartes de presse. Les Américains ont la liste des journalistes des grands médias : il faudra des contacts ou un chantage (par exemple sur un rédacteur en chef). Un démon de Nybbas dans le groupe aide beaucoup.
• Mauvaise idée : se faire passer pour des humanitaires (convoyeurs de sacs de riz) – mission quasiment ratée d'avance.
Roissy ne pose pas de problème, surtout avec des caméras : les douaniers cherchent sans conviction des islamistes en route pour l'Irak. On peut quand même demander aux PJ le motif du voyage.`,
    [], false,
    [choice('couverture', 'Quelle couverture choisissent les PJ ?', [
      ['Forces spéciales', 'Scène 3 : infiltrer une base, obtenir matériel et papiers ; le colonel anglais les réquisitionne. Rencontre de Jo (démon de Baal).'],
      ['Journalistes indépendants', 'Scène 3 : filtrage serré à Koweït City, capture probable par des francs-tireurs. Rencontre du démon de Nybbas.'],
      ['Humanitaires', 'Quasi-échec : le MJ peut considérer la mission comme compromise.'],
    ])]),
  scene('road', '3. Road to Babylon', 'Koweït City, frontière, routes d\'Irak (Babylone à 160 km au sud de Bagdad)',
    `Arrivée à Koweït City : le point le plus risqué. Les Américains filtrent les arrivées, surtout les journalistes (promesse de ne pas quitter la ville…). Détention possible de 2 à 48 heures, avec ou sans rudesse. Les PJ sont suivis tout le séjour et doivent semer leurs « anges gardiens », trouver un véhicule et un guide pour passer sans tomber sur les Américains. Pris à la frontière : retour en cellule pour quelques jours, voire expulsion.
Version militaire : il faut entrer dans une base américaine, se faire attribuer matériel, papiers et véhicule et en ressortir, le tout en parlant anglais.
L'observateur : à l'aéroport, sur une base, en pleine zone de combat, un grand blond impassible les regarde, toujours en public, sans rien faire (démon de Caym grade 2, voir sa fiche). Il les met sous pression et les aide en douce si besoin.
Selon la couverture : suivre les axes de l'armée ou s'en tenir loin.
• Journalistes hors des sentiers battus : capture probable par des francs-tireurs irakiens qui veulent des otages ; ils s'en sortent, mais le véhicule est détruit. Véhicule de remplacement : un T-54 avec pilote menacé ou un camion de transport de troupes ; attaque aérienne une fois par jour sur 1d6 (1-2 pour le camion, 1-4 pour le char). Émettre un flux vidéo par satellite = frappe aérienne dans les dix minutes.
• Avec persuasion et dollars, des Irakiens sympathisants peuvent les guider jusqu'à Babylone (plus ou moins de volontaires selon la date).
• Version militaire : le colonel anglais les interpelle devant tout le monde et les envoie « illuminer » au laser un dignitaire irakien réfugié dans une villa des faubourgs de Bassora pour une bombe guidée de B-2. Progression de maison en maison sans se faire abattre par les Anglais. Ils peuvent faire semblant d'avoir vu la cible, mais doivent aller jusqu'à la villa ; si la cible survit, personne ne soupçonnera les forces spéciales.
En avance sur l'armée, les PJ s'exposent aux soldats irakiens et aux tirs amis.
Note : pas de mort « au hasard » (bombe, obus, sniper) ; un PJ ne meurt que d'une erreur tactique. Les traumatiser, en revanche, est recommandé.`,
    [inScene(caym2), inScene(colonel), inScene(irakiens), inScene(americains), inScene(anglais, { qty: 4 })], true,
    [choice('bassora', 'Version militaire : que font les PJ de la mission du colonel ?', [
      ['Ils l\'accomplissent', 'Temps perdu, risques dans Bassora ; le dignitaire est éliminé.'],
      ['Ils font semblant', 'Ils vont quand même jusqu\'à la villa ; la cible survit, personne ne les soupçonne.'],
      ['Ils refusent ou désertent', 'Couverture grillée auprès des Anglais et de leur colonel.'],
    ])]),
  scene('boulet', '4. Un compagnon encombrant', 'En route vers Babylone',
    `À force de prises de risques et d'usage de pouvoirs, les PJ sont repérés par un collègue :
• Version militaire : Jo, démon de Baal, major des Rangers et seul survivant de son squad, massacré par des Anglais menés par un ange de Michel (sûrement des soldats de Dieu : ils ont tiré sans hésiter). Il s'en est tiré en fuyant au lieu de se battre. Il veut juste s'amuser et s'incruste. Il finit par appeler sa hiérarchie pour demander l'autorisation, puisque les PJ ne veulent pas en prendre la responsabilité : la mission étant officieuse, il faudra le semer (il retrouve toujours le groupe) ou le faire tuer avant la fin. Puissance de feu utile, mais il provoque tous les combats et ramène des soldats agonisants pour raconter ses exploits.
• Version journaliste : un démon de Nybbas taré, cameraman tué par un sniper, qui fait des directs en plein combat avec sa valise satellite (frappes aériennes garanties).
Les rencontres avec des soldats irakiens sont à éviter (lance-roquettes, mortiers) : pas trop longues, et pas forcément de combat.`,
    [inScene(jo), inScene(nybbas), inScene(irakiens)], true,
    [choice('boulet', 'Comment les PJ se débarrassent-ils de leur compagnon ?', [
      ['Ils le sèment', 'Difficile : il revient toujours (« Vous auriez pu me prévenir ! »).'],
      ['Il se fait tuer en route', 'Problème réglé ; à Babylone, les PJ n\'ont pas son aide contre les Anglais.'],
      ['Il est encore là à la fin', 'Sa hiérarchie est au courant : risque d\'ébruiter la mission officieuse de Caym.'],
    ])]),
  scene('mechoui', '5. Rencontre : Méchoui de bébés (annexe A)', 'Petit village irakien au bord d\'un cours d\'eau',
    `Rencontre facultative, à placer sur la route. Le village a subi un massacre : femmes, vieillards et enfants torturés puis tués à l'arme blanche.
En fouillant, les PJ trouvent un GI couvert de sang, machette à la main, endormi dans une cave (il ne sent pas l'alcool). C'est le seul responsable.
Les plus perspicaces voient qu'anges et démons se sont battus ici (traces de flammes, douilles partout, mais personne n'est reparti : les combattants ont disparu en mourant). Les derniers survivants, un ange de Michel et un démon de Majûj, se sont affrontés ; le démon a utilisé Bestialité sur l'ange avant d'être tué. Sous l'emprise du pouvoir, l'ange a massacré le village puis s'est effondré.
Il ne se souvient de rien ; au fil de la discussion, sa mémoire revient peu à peu…`,
    [inScene(michel1)], true,
    [choice('massacreur', 'Que font les PJ de l\'ange amnésique ?', [
      ['Ils l\'achèvent avant qu\'il comprenne', 'Un ange de moins, mais attention aux témoins et aux traces.'],
      ['Ils le laissent se souvenir', 'Il comprend vite ce qu\'ils sont : combat contre un ange de Michel grade 1.'],
      ['Ils filent discrètement', ''],
    ])]),
  scene('babylone', '6. Tais-toi et cherche !', 'Ruines de Babylone, zone semi-montagneuse',
    `Ruines en piteux état, traces d'un violent combat entre forces spéciales américaines et un ennemi invisible (ce que le dragon et les chacals ont laissé). Le dragon, repu et encore engourdi, est retourné dormir dans sa tanière.
Les PJ quadrillent la zone et trouvent, en périphérie (le zoo n'était pas en pleine ville), le cratère d'un Tomahawk : deux pick-up et un petit bus calcinés, avec femmes, vieillards et enfants. Sous le bus, le sol creusé mène à une salle souterraine à moitié effondrée où dort le dragon.
Le dragon : gros crapaud de quatre mètres, bave acide, queue ridicule, ailes purement décoratives (il vole par magie). Complètement abruti, il ne parle qu'avec peine des langues antiques. Le sortir du trou et le faire monter dans un camion sera laborieux.
C'est alors que reviennent les Anglais qui ont décimé le squad de Jo : quatre soldats de Dieu et leur chef, l'ange de Michel revanchard. Le dragon, qui n'a pas senti de créature du Bien depuis des millénaires, entre dans une rage folle et n'écoute plus les PJ qui veulent le calmer pour le garder en vie. Il se charge du plus gros du travail.`,
    [inScene(dragon), inScene(michel2), inScene(soldatsDieu), inScene(jo)], true,
    [choice('dragon', 'Le dragon survit-il à l\'attaque des Anglais ?', [
      ['Oui, et les PJ l\'embarquent', 'Scène 7 : retour avec la bestiole.'],
      ['Il est blessé mais vivant', 'Retour plus lent ; il réclame à manger.'],
      ['Il meurt (ou les PJ le tuent)', 'Ramener sa dépouille à Caym comme preuve (épilogue : 1 à 3 PA).'],
    ])]),
  scene('retour', '7. Le voyage de retour', 'D\'Irak vers Koweït City',
    `Même trajet qu'à l'aller, mais avec une grosse bête baveuse qui n'a qu'une idée : s'envoler pour aller narguer les F-18 et les Black Hawks. Pour le Grand Jeu, ce serait carton rouge. Si les PJ craquent et le tuent, c'est ce que Caym aurait fait de toute façon, mais la récompense sera moindre.
Les PJ sont déjà bien éprouvés : alléger les combats. Rencontres possibles : « Promenade du matin, chagrin » et « Petites tracasseries administratives » (scènes 8 et 9).
L'observateur de Caym peut abattre le dragon depuis son hélicoptère s'il file vers une zone peuplée.`,
    [inScene(dragon), inScene(caym2)], false,
    [choice('envol', 'Le dragon parvient-il à s\'envoler et à se montrer ?', [
      ['Non, il reste discret', ''],
      ['Oui, il passe sur Fox News', 'Voir l\'épilogue : sanction seulement si les autorités infernales identifient les PJ.'],
    ])]),
  scene('promenade', '8. Rencontre : Promenade du matin, chagrin (annexe A)', 'Désert, entre Babylone et le Koweït',
    `De temps en temps, le dragon part se dégourdir les pattes et dévorer ce qu'il trouve. S'il choisit des civils, les PJ ne s'en aperçoivent pas (sauf garde permanente). S'il tombe sur des militaires, ça tourne mal et il revient se mettre à l'abri près des PJ, avec à ses trousses une demi-douzaine de soldats irakiens, ou américains (rangers sans véhicule ou égarés dans le désert). Il n'attaque jamais de véhicules (il déteste les conserves).`,
    [inScene(dragon), inScene(irakiens), inScene(americains)], true),
  scene('tracasseries', '9. Rencontre : Petites tracasseries administratives (annexe A)', 'Check-point américain',
    `Avec ou sans dragon, les autorités américaines contrôlent les déplacements. En général les GI ne posent pas de problème, mais un gradé obtus décide d'éplucher papiers d'identité, de faire des prises de sang, etc.
C'est un ange de Dominique débutant qui traque les anges de Michel infiltrés dans la coalition ; il n'imagine pas trouver des démons dans le coin, vu le nombre d'anges présents. Il est accompagné de six GI normaux qui ignorent tout de sa nature.
Aux PJ de garder un profil bas… ou de massacrer tout le monde.`,
    [inScene(dominique), inScene(americains)], true,
    [choice('controle', 'Comment se passe le contrôle ?', [
      ['Profil bas, ils passent', ''],
      ['L\'ange les démasque', 'Combat contre l\'ange de Dominique et ses six GI ; risque d\'alerte.'],
      ['Ils massacrent tout le monde', 'Témoins et Grand Jeu : attention aux suites.'],
    ])]),
  scene('villa', '10. La villa de Koweït City', 'Grande villa au sud de Koweït City',
    `L'adresse correspond à une grande villa un peu à l'écart, barbelés et gardes armés, mais paisible. C'est la « salle de jeu » d'un jeune Koweïtien, remplie de tous les jeux rapportés par son père de ses voyages. Le contact est l'intendant, Toufik.
Le destinataire du dragon est un adorable petit lapin blanc logé dans 60 m² climatisés. Caym s'incarne dans un avatar en forme de lapin (le vrai finit explosé dans les toilettes de la villa ; le gamin pleurera).
Si les PJ ramènent le dragon vivant, Caym s'empresse de le tuer lui-même sous leurs yeux.`,
    [inScene(toufik), inScene(caym), inScene(dragon)]),
  scene('epilogue', '11. Épilogue', 'Après la mission',
    `Barème des récompenses (PA donnés directement par Caym) :
• Dragon ramené vivant et livré à Caym : 4 à 6 PA.
• Dragon tué, avec preuve (dépouille rapportée à Caym) : 1 à 3 PA.
• Dragon tué sans preuve, mais sans avoir bafoué le Grand Jeu : ni gain ni perte.
• Dragon passé sur Fox News : pas de punition si rien ne relie les PJ à l'affaire.
• Si les autorités démoniaques découvrent leur implication : −1 à −3 PA et convocation par un grade 3 d'Andromalius. S'ils nient le rôle de Caym : encore −1 à −3 PA. S'ils le dénoncent : pertes annulées, mais Caym devient leur ennemi juré.`, [], false,
    [choice('issue', 'Sort du dragon ?', [
      ['Livré vivant à Caym', '+4 à +6 PA.'],
      ['Tué, dépouille rapportée', '+1 à +3 PA.'],
      ['Tué sans preuve, Grand Jeu respecté', 'Ni gain ni perte de PA.'],
    ]),
    choice('andromalius', 'Le dragon s\'est montré et Andromalius a identifié les PJ ?', [
      ['Non', 'Aucune sanction.'],
      ['Oui, ils couvrent Caym', '−2 à −6 PA au total (1 à 3 pour l\'affaire, 1 à 3 pour le mensonge).'],
      ['Oui, ils balancent Caym', 'Pertes de PA annulées, mais Caym devient un ennemi personnel.'],
    ])]),
];

const scenario = {
  id: 'ins1-fun-in-the-sun',
  nom: 'Livret INS – Fun in the sun !',
  resume: 'Court scénario d\'introduction pour In Nomine Satanis. Avril 2003, début de la guerre d\'Irak : un dragon, dernier survivant du zoo de créatures fabuleuses que Caym tenait jadis à Babylone, a été réveillé par un missile. Briefés dans un Quick de Créteil par un familier de Caym, les PJ doivent entrer en Irak (comme forces spéciales ou journalistes), trouver la bête dans les ruines de Babylone et la ramener vivante à Koweït City, sans bafouer le Grand Jeu, malgré soldats, anges et collègues encombrants.',
  notes: `Source : ${REF}. Ambiance : film de guerre absurde (Les Rois du désert). Date conseillée : 21 avril 2003, juste avant la prise de Bagdad, quand la confusion facilite les déplacements.

Contexte secret : il y a des siècles, Caym avait monté à Babylone un zoo de créatures fantastiques (licornes, trolls…), déjà limite pour le Grand Jeu. Lors d'une orgie avec Haagenti et Kobal, presque tout le zoo a été dévoré ; seul a survécu un dragon, qui s'est endormi, enseveli par le séisme que les princes ont provoqué pour effacer le zoo. Un grade 3 de Caym a appris, par un tabloïd anglais, qu'une créature hors normes avait été aperçue à 160 km au sud de Bagdad. Caym n'a jamais parlé de ce zoo à Satan : il veut récupérer la bête vivante, discrètement, et la voir lui-même pour être sûr que l'affaire est close. La tuer et brûler le corps est un pis-aller.

Prétirés conseillés pour une initiation : les « Démons typiques » du livret (p. 92-95).
Récompenses : barème de l'épilogue (de −6 à +6 PA).
Fiches : caractéristiques du livre (niveaux convertis ; Ch des humains en Foi). Ange de Michel grade 2, ange de Dominique et dragon : valeurs reprises du bestiaire des livres. Armes non précisées choisies dans la table des règles et signalées dans les notes des fiches. PNJ sans caractéristiques (grue, Toufik, colonel, Caym) : fiches minimales.`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [irakiens, americains, anglais, soldatsDieu, caym2, jo, nybbas, michel1, michel2, dominique, dragon, grue, toufik, colonel, caym].map(asType);
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));
writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types,', scenes.reduce((a, s) => a + s.choix.length, 0), 'choix');
