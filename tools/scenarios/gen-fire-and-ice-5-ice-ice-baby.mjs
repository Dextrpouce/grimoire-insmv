// Génère le fichier d'import « insmv-scenario » pour « Ice, ice baby » (Fire and Ice, p. 90-102)
// usage : node gen-ice-ice-baby.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Fire and Ice, « Ice, ice baby », p. 90-102';
const L = (s) => R.parseLvl(String(s)); // « 2+ » → 5
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
let n = 0; const id = (p) => `fi5-${p}`;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [{ n: 'Coup de poing', att: 2, prec: 0, puis: -3, melee: true }], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});
const NOSTATS = 'Le livre ne donne volontairement pas de caractéristiques (simple humain) : fiche minimale générique (niveau 2 partout), à ajuster.';

// ---------------- PNJ ----------------
const raymond = npc('raymond', {
  nom: 'Raymond Bougoin (« Ray »)', source: 'Flocon de sang, braqueur renégat', type: 'humain',
  car: car('1 2 3 3 1 2+'), def: L(2), pp: 5, pfFix: 4, seuilsFix: seuils('2/4/6/8'),
  armes: [
    { n: 'Fusil à pompe (balles de gros calibre)', att: L('2+'), prec: -2, puis: 5, melee: false },
    { n: 'Lame artisanale (verre et scotch)', att: L(2), prec: -1, puis: -1, melee: true },
  ],
  pouvoirs: pows('Éclats de glace 1'),
  talents: 'Tir 2+, Intrusion 2+, Discrétion 2+, Défense 2, Jouer du couteau 2, Gouaille 3',
  notes: 'Grand échalas maigre, tignasse blonde, lunettes rondes à verres épais, look blouson noir des années 60 (jean, chemise, perfecto).\nBraqueur depuis les années 60, maoïste sur les bords, nombreux séjours en prison. Surpris en 1998 en train de cambrioler le coffre d\'Isaac Iceberg (démon de Crocell, grade 2), qui en a fait un Flocon de sang. S\'est enfui au bout de quatre ans et a braqué le fourgon (pneus et portes gelés par Éclats de glace, convoyeur abattu au fusil à pompe) pour financer sa fuite au Brésil.\nEn préventive à Fleury-Mérogis : un dur, jamais balancé personne, prêt à supporter la torture. Il faut des moyens de pression créatifs pour le faire parler.\nArmes : le livre ne donne que « Tir 2+ » et « Jouer du couteau 2 » ; fusil à pompe (utilisé pendant le braquage, pas en prison) et lame artisanale (assimilée à un cran d\'arrêt) estimés.',
});
const fabien = npc('fabien', {
  nom: 'Monsieur Fabien', source: 'Chef du Centre de Tri (démon)', type: 'demon',
  notes: 'Contact et commanditaire des PJ. Envoie l\'équipe sur l\'affaire, les rappelle quand Ray est arrêté, choisit leur juge d\'instruction et leur avocat, leur rend visite au parloir (avec Gilbert et Aurélie) et donne l\'ordre final d\'éliminer Raymond.\nCaractéristiques : voir l\'aide de jeu du Centre de Tri (livre p. 19-29) ; fiche minimale ici.',
});
const replet = npc('replet', {
  nom: 'Inspecteur Replet', source: 'Police locale de Sarcelles', car: car('3 2 2 2 2 2'),
  notes: 'Grand costaud d\'une quarantaine d\'années, nuque longue, barbe de trois jours, mâche des pastilles à la nicotine et fume quand même. Voix grave, toux, bourru mais amical. Flic communiste, peu malin, un peu raciste, furieux qu\'on ait refilé l\'affaire au GIR parisien.\nInfos : les pneus arrière ont gelé et éclaté, un second refroidissement a ouvert les portes ; le convoyeur a tiré une demi-douzaine de balles dans les platanes ; le braqueur a riposté de trois tirs de fusil à pompe gros calibre. Il pense que quelqu\'un de la banque a donné l\'itinéraire.\n' + NOSTATS,
});
const gerard = npc('gerard', {
  nom: 'Gérard Lepuis', source: 'Conseiller client de la banque, complice', car: car('2 2 2 1 2 2'),
  notes: 'Cinquantenaire séduisant, grosse moustache grise. Ancien de Mai 68 avec Ray (groupuscule maoïste), rangé, vote Verts, écœuré par les magouilles de son patron : il a donné l\'itinéraire du fourgon. Rongé de culpabilité depuis la mort du convoyeur (insomnies, café, clopes).\nToute menace physique ou pression psychologique un peu poussée le fait craquer : il livre Raymond et l\'adresse de sa planque (Paris 12e).\nSuite : il meurt dans un « accident de la circulation » avant la fin du scénario.\n' + NOSTATS,
});
const escaut = npc('escaut', {
  nom: 'Antoine Escaut', source: 'Directeur de la banque', car: car('2 2 2 2 2 2'),
  notes: 'Soixantaine élégante, grisonnant, méprisant. Terrifié par une poursuite pour recel d\'abus de biens sociaux : les 800 000 € étaient le dépôt en liquide d\'un élu local (caisse noire de parti). Muet devant des journalistes, il déballe tout face à un faux enquêteur du pôle financier de Bercy (dépôt couvert par la maison mère, à la demande d\'un député). Sans incidence sur l\'enquête, mais source de « contacts » politiques.\n' + NOSTATS,
});
const ludivine = npc('ludivine', {
  nom: 'Ludivine Cippe', source: 'Secrétaire, bavarde de la banque',
  notes: 'Pas très jolie, mal dans sa peau, gentille, sous Prozac, à l\'écoute de tous les ragots. Facile à faire parler : la banque magouille avec de l\'argent sale, Gérard est « communiste », Samantha et Innocent couchent ensemble, Michel tape dans la caisse.\n' + NOSTATS,
});
const innocent = npc('innocent', {
  nom: 'Innocent Coulibali', source: 'Vigile de la banque', car: car('4 2 2 2 1 2'),
  armes: [{ n: 'Matraque', att: L(2), prec: 0, puis: 1, melee: true }],
  notes: 'Géant au crâne rasé, air peu sympathique, mi-vigile mi-caillera (deale du shit). En couple avec Samantha Cissoko, la stagiaire. Difficile à faire parler, mais il a vu Gérard discuter, visiblement flippé, avec un inconnu (Raymond) dans un café la veille du braquage.\n' + NOSTATS + ' Matraque estimée.',
});
const anges = 'Membres de « l\'autre équipe » envoyée par la You-You Power Force (caractéristiques en fin de scénario).';
const alain = npc('alain', {
  nom: 'Alain', source: 'Ange de Daniel, grade 1', type: 'ange', car: car('4 3 4 3 2 3'), def: L(5),
  pp: 14, pfFix: 7, seuilsFix: seuils('7/14/21/28'),
  armes: [{ n: 'Piolet maudit mineur (inadapté à la parade)', att: L(5), prec: 0, puis: 4, melee: true }],
  pouvoirs: pows('Pétrification 1, Peur 1, Armure corporelle 2, Déphasage 1'),
  talents: 'Combat 5, Défense 5, Athlétisme 5. Avantage matériel : skinheads. Avertissement sans frais : interdiction d\'utiliser une arme à distance.',
  notes: anges + '\nGrand, maigre, la quarantaine, air sympa mais vrai bourrin qui adore chasser le démon. Jean trop court, Doc Martens cirées à lacets blancs, pull col en V, chemise à carreaux, veste en jean.',
});
const pascal = npc('pascal', {
  nom: 'Pascal', source: 'Ange de Jean-Luc, grade 1', type: 'ange', car: car('3 4 5 4 2 3'), def: L(4),
  pp: 16, pfFix: 7, seuilsFix: seuils('6/12/18/24'),
  armes: [{ n: 'Fusil à pompe', att: L(4), prec: -2, puis: 5, melee: false }],
  pouvoirs: pows('Sacrifice ultime 2, Armure corporelle 2, Régénération 2, Déplacement temporel 2'),
  talents: 'Tir 2+ (armes d\'épaule 4), Défense 4, Langue : créole. Avertissement sans frais : kleptomane.',
  notes: anges + '\nQuarantenaire antillais souriant, grisonnant, début d\'embonpoint, gabardine beige et pantalon de velours marron : un air de prof d\'histoire-géo. Encaisse les coups pour les autres et supporte de moins en moins Didier : il pourrait le laisser prendre les coups seul.\nArme d\'épaule non précisée : fusil à pompe estimé.',
});
const didier = npc('didier', {
  nom: 'Didier', source: 'Ange de Walther, grade 1', type: 'ange', car: car('3 3 4 5 2 3'), def: L(4),
  pp: 13, pfFix: 8, seuilsFix: seuils('6/12/18/24'),
  armes: [{ n: 'Revolver', att: L(4), prec: -2, puis: 3, melee: false }],
  pouvoirs: pows('Exorcisme 1, Décharge électrique 2, Volonté supra-normale 2, Charme 1, Lire les pensées 1, Détection du mal 2'),
  talents: 'Tir 2 (armes de poing 4), Défense 4, Discrétion 3, Culture générale 2 (théologie 4). Avertissement sans frais : paranoïaque.',
  notes: anges + '\nQuarantaine, cheveux gras, ventre rond, lueur inquiétante dans le regard ; tout de blanc vêtu (pantalon repassé, chemise amidonnée, veste de cuir blanc). Complètement jeté, ne fait confiance à personne : piètre esprit d\'équipe.\nArme de poing non précisée : revolver petit calibre estimé.',
});
const jambart = npc('jambart', {
  nom: 'Père Jambart', source: 'Aumônier de Fleury-Mérogis, ange de Guy, grade 2', type: 'ange', car: car('2 2 5 5 2 4'),
  pp: 19, pfFix: 7, seuilsFix: seuils('5/10/15/20'), armes: [],
  pouvoirs: pows('Guérison 2, Immunité contre les maladies et les poisons, Régénération 1, Lire les pensées 4, Détection du danger 2, Bénédiction : guérison de folies 1'),
  talents: 'Discussion 6, Droit pénal 3, Dire la messe à des fidèles menottés 5, Œcuménisme 5. Avertissement sans frais : abstinence.',
  notes: 'Petit trentenaire à calvitie précoce et lunettes en demi-lune, très gentil, humaniste (veut organiser un culte pour les détenus musulmans), mal vu des gardiens ; peu compréhensif sur la sexualité des détenus.\nS\'il comprend que les PJ sont des démons, il les observe un temps puis prévient sa hiérarchie : un ange de Dominique remplace alors un gardien et tente de les massacrer discrètement.\nDéfense non donnée : 2.',
});
const isaac = npc('isaac', {
  nom: 'Isaac Iceberg', source: 'Démon de Crocell, grade 2 (absent)', type: 'demon',
  notes: 'Celui qui a donné son pouvoir à Raymond et l\'a enrôlé dans les Flocons de sang. Vit à Paris, mais a fui pour Le Cap (Afrique du Sud) le lendemain de l\'arrestation de Ray : appartement vide (penderies vidées, dernier appel à Air France). La planque de Ray (12e) a brûlé dans un incendie mystérieux quelques jours plus tôt.\nN\'apparaît pas dans ce scénario ; pas de caractéristiques.',
});
const gardiens = npc('gardiens', {
  nom: 'Gardiens de Fleury-Mérogis', source: 'Matons (Mercier, Doleau, Diori, Mendez, Galand, Muraille…)', qty: 3, car: car('3 2 2 2 2 2'),
  armes: [{ n: 'Matraque', att: L(2), prec: 0, puis: 1, melee: true }],
  notes: 'Le livre précise qu\'ils savent se servir de leurs matraques, sans caractéristiques : fiche générique estimée.\n• Christophe Mercier : 35 ans, recalé de la police, discipline de fer.\n• Marc Doleau : jeune, ambitieux, lâche, planqué à la bibliothèque.\n• Patrick Diori : vingt ans de maison, blasé ; couvre le trafic de Moussa.\n• Rudy Mendez : un an de poste, idéaliste brisé, sous antidépresseurs.\n• Stéphane Galand (chef) : grand et massif, sévère quand il y est forcé, laisse les détenus s\'étriper.\n• Sébastien Muraille (chef) : maton sadique, mate les parloirs, détesté de tous.',
});
const detenus = npc('detenus', {
  nom: 'Détenus de Fleury-Mérogis', source: 'Codétenus et caïds de la promenade', qty: 4, car: car('2 2 2 2 2 2'),
  armes: [{ n: 'Couteau artisanal', att: L(2), prec: -1, puis: -1, melee: true }, { n: 'Coup de poing', att: L(2), prec: 0, puis: -3, melee: true }],
  notes: 'Pas de caractéristiques dans le livre ; la plupart savent se battre et n\'hésitent pas à sortir une lame : fiche générique estimée.\n• Moussa Abedi (19 ans) : caïd psychopathe, deale du shit avec la complicité d\'un maton, en guerre avec Steve.\n• Ulysse Mavreodis (50 ans) : double meurtrier, vieux tranquille, se croit en contact avec l\'ange Gabriel.\n• Dominique « Doumé » Mariani : mafieux corse, distille de la gnôle avec l\'alcool de l\'atelier.\n• César Mamedi (21 ans) : petit dealer pour Moussa, veut sa conditionnelle.\n• Michel Noumier (60 ans) : escroc à la Sécu, ami d\'Ulysse.\n• Joseph Nachelski (29 ans) : proxénète meurtrier, prostitue d\'autres détenus.\n• Bernard Nobert (45 ans) : tueur d\'enfants séduisant et manipulateur.\n• Cyril Kerguelec : lycéen arrêté à une manif anti-FN, perdu.\n• Saïd Boulila (18 ans) : voleur de voitures, petit politicien.\n• Désiré Mbaa (18 ans) : sans-papiers, double peine.\n• Jean-René Pichard : prévenu sous antidépresseurs (« ils disent que j\'ai tué mon beau-frère »).\n• Steve Bouabé : colosse à la dentition pourrie, se prend pour un caïd, a planté Moussa.\n• Brahim Radad (25 ans) : toxicomane malade du sida, isolé, suicidaire.\n• Éric Postier : chauffard alcoolique, souffre-douleur qui commence à péter les plombs.\n• Gilles Martin : violeur débonnaire, balance pour les matons ; beaucoup veulent sa peau.',
});

// Le bestiaire joint (types réutilisables) : mêmes fiches, sans quantité
const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });

// ---------------- Scènes ----------------
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  scene('briefing', '1. Briefing : le braquage du fourgon', 'Centre de Tri, Paris – bureau de Monsieur Fabien',
    `Monsieur Fabien tend aux PJ une coupure de France Soir (l'article en ouverture du scénario, livre p. 90, est fait pour être photocopié et remis aux joueurs).
Les faits : un fourgon de transport de fonds a été attaqué sur la N1 près de Sarcelles par un braqueur seul. Pneus arrière et portes arrière gelés puis éclatés (la police parle d'azote), un convoyeur tué, l'autre commotionné, environ 800 000 € emportés.
Monsieur Fabien flaire le soufre : renégat ou démon indiscret, une violation du principe de discrétion. La hiérarchie a répondu d'envoyer son équipe.

Pistes possibles : les lieux (N1, Sarcelles : nettoyés, plus aucun indice matériel), la police, la banque d'où partait le fourgon.`,
    [inScene(fabien)]),
  scene('police', '2. That\'s da sound of da police', 'Commissariat de Sarcelles',
    `Pas question de faire un casse au commissariat (monde fou, police noyautée par le Bien). Le plus simple : se faire passer pour journalistes, la police locale ne vérifie guère les cartes de presse. Le dossier a été transféré au GIR parisien, ce qui ulcère les flics locaux, ravis de s'en plaindre à la presse.
L'inspecteur Replet a été dessaisi avant d'aller loin. Ce qu'il sait :
• les deux pneus arrière ont gelé et éclaté, puis un second refroidissement a ouvert le fourgon ;
• le convoyeur tué a tiré le premier (une demi-douzaine de balles dans les platanes) ; le braqueur a répondu par trois tirs de fusil à pompe gros calibre, tous au but ;
• à son avis, quelqu'un de la banque a renseigné le braqueur sur l'itinéraire.`,
    [inScene(replet)]),
  scene('banque', '3. Banque – route', 'Agence bancaire (bâtiment de briques rouges)',
    `Les 800 000 € étaient le dépôt liquide d'un élu local (caisse noire) : la banque est réticente, ambiance tendue, tout le monde soupçonne tout le monde. Employés déjà interrogés par la police, consigne de ne pas parler aux journalistes. Chacun peut parler si l'on appuie sur le bon bouton :
• Antoine Escaut, directeur : craque face à un faux enquêteur de Bercy (dépôt couvert par la maison mère et un député) ; sans incidence sur l'enquête.
• Julie Teiller, sa secrétaire : amoureuse de lui, l'aidera s'il est en danger ; ne sait rien.
• Mathieu Averse, chargé de clientèle : jeune loup dragueur, n'a peur de rien, ne sait rien ; prétend à tort que le patron couche avec sa secrétaire.
• Ludivine Cippe, sa secrétaire : bavarde sous Prozac ; livre facilement les ragots (argent sale, Gérard « communiste », Samantha et Innocent ensemble, Michel tape dans la caisse).
• David Szymkoviak, second chargé de clientèle : proche de la retraite, sympa et blasé, s'interroge sur ce transfert dont il n'a pas entendu parler.
• Laure Deblas, sa secrétaire : froide, ne sait rien et ne dirait rien.
• Gérard Lepuis, conseiller client : LE COUPABLE. Ancien camarade maoïste de « Ray », il lui a donné l'itinéraire. Menace physique ou forte pression : il livre Raymond Bougoin et sa planque dans le 12e.
• Michel Douze, conseiller client : petit, désagréable, détourne l'argent des petits vieux ; ne sait rien mais parle sous la menace.
• Gilles Fucus, conseiller client : commercial onctueux et antigauchiste, soupçonne Gérard ; parle si on le flatte ou qu'on peste contre l'« État-providence ».
• Mireille Guisarme, secrétaire : enceinte jusqu'aux yeux, ne sait rien, s'en fiche.
• Samantha Cissoko, stagiaire compta : en couple avec Innocent ; pas au courant.
• Innocent Coulibali, vigile : dur à faire parler ; a vu Gérard, flippé, avec un inconnu (Ray) dans un café la veille du braquage.`,
    [inScene(escaut), inScene(ludivine), inScene(gerard), inScene(innocent)], false,
    [choice('gerard', 'Comment les PJ obtiennent-ils le nom du braqueur ?', [
      ['Gérard craque sous la pression', 'Il livre Raymond Bougoin et l\'adresse de sa planque (12e). Interlude dirigiste.'],
      ['Par les ragots (Ludivine, Innocent, Fucus)', 'Ils remontent jusqu\'à Gérard ; il faut encore le faire parler.'],
    ])]),
  scene('interlude', '4. Interlude dirigiste : l\'autre équipe', 'Sortie de la banque, puis terrain vague autour du Centre de Tri',
    `Dès que les PJ connaissent la complicité de Gérard et le nom du braqueur, Monsieur Fabien appelle, mécontent : les flics ont arrêté Ray à un barrage filtrant, il est en détention préventive. Retour immédiat au Centre de Tri.
Mais en sortant (de la banque ou de chez un employé), les PJ sont repérés par « l'autre équipe » de la You-You Power Force (Alain, Pascal, Didier), qui enquête aussi ; une Détection du mal les a démasqués. Les anges les filent pour les coincer dans un coin tranquille, les interroger et les éliminer. Arrivés devant le terrain vague du Centre de Tri, ils croient tenir la planque du braqueur : baston !
Les PJ doivent rester discrets pour ne pas alerter les postiers humains de La Poste. Idéalement, un postier humain assiste au combat et se met à agir bizarrement jusqu'à ce que Monsieur Fabien lui lave le cerveau.
Tactique des anges : Alain fonce au contact (interdit d'arme à distance), Pascal encaisse pour les autres (mais pourrait lâcher Didier), Didier se méfie de tous et joue perso.`,
    [inScene(alain), inScene(pascal), inScene(didier)], true,
    [choice('anges', 'Issue de l\'affrontement avec l\'autre équipe ?', [
      ['Anges éliminés discrètement', 'Monsieur Fabien reçoit les PJ et leur expose le plan prison.'],
      ['Un postier humain a tout vu', 'Il agit bizarrement jusqu\'à ce que Monsieur Fabien lui lave le cerveau.'],
      ['Des anges en fuite', 'La You-You sait désormais que le Centre de Tri abrite des démons : menace à reprendre plus tard.'],
    ])]),
  scene('gav', '5. Ça me GAV : se faire arrêter', 'Commissariat (garde à vue), puis cabinet du juge d\'instruction',
    `Raymond est à Fleury-Mérogis. En France, journalistes et policiers ne visitent pas les détenus (sauf député) : la seule solution est de se faire arrêter pour un délit assez grave pour finir quelques jours en préventive (outrage à agent, par exemple). Monsieur Fabien laisse les PJ choisir, du moment que la peine encourue ne les immobilise pas trop longtemps.
Garde à vue : cellule de trois mètres carrés, clim à fond, banc étroit, sandwich et pomme matin et soir. Traitement selon la gravité du délit (menottes, toilettes rationnées, « t'as pas de feu ? »). Deux jours plus tard, juge d'instruction et avocat choisis par Monsieur Fabien ; l'avocat refuse la comparution immédiate, d'où la préventive. Transfert le lendemain à Fleury-Mérogis.
PJ féminins : les prisons ne sont pas mixtes ; les faire embaucher aux services sociaux ou à l'infirmerie de la prison via Monsieur Fabien (accès discret aux dossiers, mais leur mettre des bâtons dans les roues).`),
  scene('prison', '6. Surveiller et punir : la vie à Fleury-Mérogis', 'Maison d\'arrêt de Fleury-Mérogis',
    `Arrivée : effets confisqués, cellules d'attente, greffe (empreintes, photos, numéro d'écrou), fouille (parfois intégrale), douche, cellule de 14 m² partagée à deux, trois ou quatre. Visite d'un adjoint du directeur, du médecin, du service socio-éducatif (Monsieur Fabien se fait passer pour la famille et envoie argent et vêtements).
Règles : « trousse entrant » ; cantine hors de prix (télé, radio, Canal+, clopes) ; pas d'alcool ; courrier et presse censurés ; tapage = faute du deuxième degré (30 jours de mitard). Javel tous les quinze jours, trois douches par semaine (trop chaudes ou trop froides). Lever 7 h, repas 12 h et 18 h, au moins une heure de promenade (terrain de sport ; fouilles au hasard avant et après ; seuls cigarettes et briquets autorisés). C'est à la promenade que tout se joue et qu'on peut retrouver Raymond.
La nuit, seuls les gradés ont les clés (à deux minimum) ; œilleton, rondes à horaires variables, lumière allumée de l'extérieur. Cellules fouillées en l'absence des détenus.
Visites : trois par semaine (Gilbert, Aurélie, Monsieur Fabien), mais il faut trois jours pour obtenir le permis. Palpation avant, fouille intégrale après.
Mitard : 3 m × 3 m, mobilier scellé, lumière contrôlée de l'extérieur. Jouer des matons sadiques : les PJ ne peuvent se rebeller sans griller leur couverture.
Père Jambart (aumônier, ange de Guy) : s'il démasque les PJ, il observe puis alerte sa hiérarchie, qui remplace un gardien par un ange de Dominique chargé de les massacrer discrètement.

Tables d'événements aléatoires (1d66) :
Nuit (toutes les trois heures de jeu) : 11-36 rien · 41-46 fouille surprise des cellules · 51-56 un détenu en manque hurle, tabassé par les matons au bout d'1d6 minutes · 61-65 un détenu agresse son codétenu au rasoir (1d6 : sur 1, c'est dans la cellule d'un PJ) · 66 un détenu se pend, les matons n'interviennent pas (nouveau d66 : sous 56, il se rate).
Journée (toutes les heures de jeu) : 11-21 rien · 22-26 fouille complète du bloc · 31-36 on propose du shit à un PJ · 41-46 deux détenus s'insultent jusqu'à l'arrivée des matons · 51-56 un maton tabasse un détenu un peu rebelle · 61-65 deux détenus tentent d'en violer un troisième dans sa cellule · 66 bagarre générale au déjeuner.
Promenade (toutes les dix minutes de jeu) : 11-21 rien · 22-26 on propose du shit à un PJ · 31-36 bagarre, matons au bout d'1d6 tours · 41-46 un détenu tabassé par quatre autres, matons au bout d'1d6 tours · 51-56 un détenu provoque un PJ pour le tester · 61 refus de rentrer, matons qui matraquent deux ou trois détenus · 62 rixe entre bandes au couteau, un mort, tirs en l'air · 63 crise de manque, matons indifférents sauf danger de mort · 64 un maton poignardé, gardiens encore plus durs · 65 un détenu tente de planter un PJ · 66 émeute : si les PJ s'en mêlent, les détenus prennent l'entrée de la cour et des otages (répression CRS/GIGN, matons rancuniers).

Chronologie (à chaque jour suffit sa peine) :
• Jour J (arrivée) : Gilles propose de la drogue à un PJ ; s'il achète, fouille de sa cellule et mitard.
• J+1 : Raymond harcelé par un détenu qui l'accuse de lui avoir volé sa drogue.
• J+2 : Joseph force Éric à une fellation ; Éric le mutile d'un coup de dents.
• J+3 : Ulysse annonce que l'ange Gabriel lui a dit qu'il allait se suicider.
• J+4 : Moussa envoie deux sbires faire la peau à Steve.
• J+5 : Saïd révèle à un PJ que Gilles veut le tuer (en fait Gilles veut le balancer : il l'a vu acheter du shit à César).
• J+6 : on retrouve gelé le cadavre du type qui prenait la tête à Ray.
Au-delà d'une semaine, improviser.`,
    [inScene(gardiens), inScene(detenus), inScene(jambart), inScene(raymond)], true),
  scene('raymond', '7. Beau comme une prison qui brûle : faire parler Ray', 'Promenade et cellules de Fleury-Mérogis',
    `Trouver Raymond n'est pas très difficile ; les autres détenus aident, mais jamais gratuitement (toujours un service en échange).
Le faire parler est autre chose : il n'a jamais balancé personne, la prison ne lui fait pas peur, et il s'y croit à l'abri des Flocons de sang. Il faut des moyens de pression créatifs (pouvoirs, torture extrême, plan à la Mission impossible).
S'il parle : toute l'histoire, et le nom de celui qui lui a donné son pouvoir, Isaac Iceberg, démon de Crocell vivant à Paris.
Monsieur Fabien, mis au courant, ordonne d'éliminer Raymond au plus vite et le plus discrètement possible. Le lendemain, le juge abandonne les charges contre les PJ (« un rêve cette nuit »), qui sont libérés.`,
    [inScene(raymond), inScene(gardiens), inScene(detenus)], true,
    [choice('ray', 'Raymond parle-t-il ?', [
      ['Oui', 'Il donne le nom d\'Isaac Iceberg (Crocell). Monsieur Fabien ordonne son élimination discrète.'],
      ['Non, il tient bon', 'Les PJ doivent improviser ; sans le nom d\'Iceberg, la piste se tarit (le MJ peut faire fuiter l\'info autrement).'],
    ]),
    choice('elim', 'Comment Raymond est-il éliminé ?', [
      ['Discrètement (accident, suicide maquillé)', 'Monsieur Fabien est satisfait.'],
      ['Bruyamment (émeute, meurtre voyant)', 'Risque de griller la couverture, de prolonger le séjour ou d\'attirer le père Jambart et un ange de Dominique.'],
    ])]),
  scene('epilogue', '8. Épilogue : l\'appartement d\'Isaac Iceberg', 'Appartement d\'Isaac Iceberg, Paris',
    `Iceberg a fui dès l'arrestation de Ray : appartement vide. Courrier en souffrance depuis le jour de l'arrestation, penderies vides, ni valise ni brosse à dents, dernier numéro composé : Air France. En creusant : il a embarqué pour Le Cap (Afrique du Sud) le lendemain de l'interpellation.
La planque de Ray (12e) a brûlé dans un incendie mystérieux quelques jours plus tôt. Gérard Lepuis est mort dans un accident de la circulation.
Monsieur Fabien félicite les PJ, leur donne 4 PA et leur conseille amicalement d'oublier toute cette affaire.`,
    [inScene(isaac)]),
];

const scenario = {
  id: 'fire-and-ice-5-ice-ice-baby',
  nom: 'Fire and Ice (scénario 5) – Ice, ice baby',
  resume: `De bello civili, scénario 1 (INS). Les démons du Centre de Tri enquêtent sur le braquage d'un fourgon blindé dont les portes ont été gelées : l'auteur, Raymond Bougoin, est un Flocon de sang en fuite, humain doté par un démon de Crocell. Après une enquête à la banque et une bagarre contre une équipe d'anges, les PJ doivent se faire incarcérer à Fleury-Mérogis pour faire parler Ray, apprendre le nom de son maître (Isaac Iceberg) et l'éliminer. Première découverte des Flocons de sang et de la guerre Belial–Crocell.`,
  notes: `Source : ${REF}. Scénario « à l'ancienne », ambiance INS classique : enquête, puis séjour en prison où l'atmosphère compte plus que l'intrigue. Adversaires surtout humains ; beaucoup d'improvisation à prévoir.
Déroulement : briefing (coupure de presse) → police / banque → nom du braqueur → arrestation de Ray et combat contre l'autre équipe → garde à vue → Fleury-Mérogis (tables d'événements, chronologie J à J+6) → faire parler Ray, l'éliminer → appartement vide d'Iceberg.

Récompense : 4 PA donnés par Monsieur Fabien à la fin (conseil : oublier l'affaire).

Introduction de l'acte « De bello civili » (livre p. 85-89), ce que le MJ doit savoir :
• L'acte met en scène l'éclatement d'une guerre ouverte entre Belial (prince du Feu) et Crocell (prince du Froid). En temps de guerre, discrétion et interdiction des combats entre princes ne tiennent plus ; les PJ vont y être mêlés malgré eux.
• Origine : deux anges frères, amis querelleurs, qui suivent Samaël sur Terre. Belial tombe amoureux d'une humaine, la confie à Crocell, qui s'éprend d'elle à son tour ; elle repousse Belial et reste l'amie de Crocell. Belial frappe son frère : la haine est née.
• Après la Chute, Beleth efface leurs souvenirs (seuls Satan et ses lieutenants gardent les leurs ; les démons les retrouvent au grade 3). Belial garde une haine instinctive de Crocell, qui conserve un esprit railleur et un fond d'idéalisme (le Mal comme liberté contre la crainte de Dieu).
• Belial fait carrière sous Baal, est placardisé, atteint le grade 3 « au lance-flammes », retrouve la mémoire et devient obsédé par la perte de son frère. En 1666, après l'incendie de Londres, il est nommé prince du Feu. Crocell, sous Bifrons, retrouve ses souvenirs au grade 3, puis devient prince du Froid deux siècles plus tard par provocation. Belial rêve désormais de prendre la place de Satan.
• La Terre Creuse : organisation secrète raciste née après la guerre de Sécession (le KKK en est un avatar), infiltrée par anges et démons. Belial s'en sert pour semer le chaos, désormais pour faire remonter de fausses infos et envoyer des anges peu subtils au casse-pipe ; affaiblie depuis la croisade de Daniel (1997).
• La Garde carmine : élite de Belial, démons de grade 3 qui traquent ses renégats ; lance-flammes chromé, van blindé « Prométhée chauffage » par groupe de cinq, écharpe rouge ignifugée, pouvoir Feu de Prométhée (brûle même les immunisés au feu). Sert aussi de service de renseignement.
• Malphas a falsifié des dossiers pour que des démons de Belial infiltrent les rangs de Crocell, puis a prévenu Crocell pour attiser la guerre.
• Les Flocons de sang : en réponse, Crocell dote des humains de pouvoirs pour grossir ses troupes ; nombreuses pertes à l'entraînement, environ trois mille humains aujourd'hui. Entorse grave au Grand Jeu, que Belial ne respecte pas davantage. Satan est en vacances : terrain libre pour la guerre.
• Objectif de ce scénario : faire découvrir aux PJ les Flocons de sang en douceur, via un braqueur supposé démon indiscret.

Fiches adaptées du livre : caractéristiques en niveaux INS/MV. Prisonniers, gardiens et employés n'ont pas de stats dans le livre (fiches génériques estimées). Armes des anges et de Raymond partiellement estimées (voir notes des fiches).`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [raymond, alain, pascal, didier, jambart, gardiens, detenus, replet, gerard, escaut, ludivine, innocent, fabien, isaac].map(asType);

// Contrôle : pouvoirs inconnus des règles
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));

writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types');
