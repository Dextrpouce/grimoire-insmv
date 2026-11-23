// Génère le fichier d'import « insmv-scenario » pour « Soigner le Bien par le Mal » (Fire and Ice, p. 56-68)
// usage : node gen-soigner-le-bien.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Fire and Ice, « Soigner le Bien par le Mal », p. 56-68';
const L = (s) => R.parseLvl(String(s)); // « 2+ » → 5
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
let n = 0; const id = (p) => `fi3-${p}`;
const POING = { n: 'Coup de poing', att: 2, prec: 0, puis: -3, melee: true };
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [{ ...POING }], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});

// ---------------- PNJ ----------------
const morlaix = npc('morlaix', {
  nom: 'Professeur Augustin Morlaix', source: 'Démon de Malthus, grade 2 – chef de clinique orthopédique', type: 'demon', car: car('2 3 3 3 2 4'),
  pp: 22, pfFix: 5, seuilsFix: seuils('4/8/12/16'),
  pouvoirs: pows('Infection 3, Malédiction : maladie 2, Corps liquide, Charme 2, Sommeil 2, Immunité contre les maladies et les poisons, Anaérobiose'),
  talents: 'Métier (chirurgien orthopédique) 5, Médecine 4, Séduction 3, Hobby (administration hospitalière) 2, Faux et usage de faux 3, Parler du nez 4. Couverture : chirurgien réputé',
  notes: 'Sexagénaire bedonnant au crâne dégarni, pince-nez, voix nasillarde. Hautain avec les patients, pédant avec les collègues, méprisant avec les internes, d\'abord agressif avec les PJ.\nCraint de perdre son poste et d\'être repéré par Notre-Dame : très prudent, prêt à tout arrêter à la moindre alerte.\nSecret : trafic de médicaments psychotropes (ordonnances falsifiées, doubles cahiers de commande, stagiaires payés) avec l\'ange Bernauld. N\'avoue qu\'avec insistance ; les « révélations » de Bernauld le font parler de colère.\nAucun talent de combat ni défense dans le livre : Défense 2 et coup de poing par défaut (estimation).',
});
const gonzague = npc('gonzague', {
  nom: 'Gonzague', source: 'Familier, majordome de Morlaix', type: 'familier', car: car('2 2+ 2 2 3 2'),
  pp: 8, pfFix: 4, seuilsFix: seuils('3/7/10/14'),
  armes: [{ n: 'Coup de poing', att: L(3), prec: 0, puis: -3, melee: true }],
  pouvoirs: pows('Armure corporelle 1, Jet de flammes 1'),
  talents: 'Aisance sociale 4, Corps à corps 3, Discussion 3, Séduction 4, Médecine 2',
  notes: 'Grande bringue d\'apparence quadragénaire, yeux apeurés, petite moustache, visage osseux, port princier, blouse trop ample. Vouvoie tout le monde, poli jusque dans la bagarre.\nFile les PJ dès le premier jour sous la blouse d\'une infirmière en congé parental (badge « Claude Novack ») : peu discret, sans imagination, tombe dans le moindre piège.\nDéfense non donnée : 2 (estimation).',
});
const bernauld = npc('bernauld', {
  nom: 'Christophe Bernauld', source: 'Ange de Marc, grade 1 – comptable du C.H.U.', type: 'ange', car: car('2 3 5 5 3 3'), def: L('3+'),
  pp: 13, pfFix: 7, seuilsFix: seuils('5/10/15/20'),
  armes: [{ n: 'Coup de poing', att: L('3+'), prec: 0, puis: -3, melee: true }],
  pouvoirs: pows('Contrat divin 2, Lire les pensées 2, Aura de pacification 2, Volonté supra-normale 1, Télépathie 1'),
  talents: 'Métier (comptable) 5, Arnaques diverses 4, Corps à corps 3+, Défense 3+',
  notes: 'Jeune cadre dynamique trentenaire, bronzé aux U.V. Rêve d\'entrer au Club 406 (anges fortunés) ; investit ses gains dans des arnaques (dont un trafic de déchets radioactifs vers le Golfe). Ne tiendrait pas trois heures face à un contrôle de sa hiérarchie.\nResponsable financier qui a découvert la combine de Morlaix il y a huit mois en falsifiant lui-même les comptes, et s\'y est associé.\nJour 2 : panique, détruit la moitié de ses dossiers, glisse l\'autre dans le bureau de Morlaix et se pose en comptable terrorisé et victime ; signale les PJ à Notre-Dame.',
});
const thanauser = npc('thanauser', {
  nom: 'Thanauser', source: 'Ange de Laurent, grade 2 – émissaire de Notre-Dame', type: 'ange', car: car('5 5 3 4 2 4'), def: L(5),
  pp: 23, pfFix: 9, seuilsFix: seuils('8/16/24/32'),
  armes: [
    { n: 'Épée bénie mineure', att: L(5), prec: 2, puis: 4, melee: true },
    { n: 'Revolvers 9 mm (deux à la fois)', att: L(3), prec: -2, puis: 3, melee: false },
  ],
  pouvoirs: pows('Armure corporelle 5, Juste-lame 3, Décharge électrique 2, Détection du mal 1, Volonté supra-normale 1, Esquive acrobatique 1'),
  talents: 'Combat 5, Défense 5, Conduite 4, Tir 1 (armes de poing 3), Avoir l\'air ténébreux et inquiétant 3, Fredonner l\'introduction de Thanauser 4. Avertissement sans frais : intégrisme',
  notes: 'Grand brun ténébreux, cache-poussière et Ray-Ban, grosse moto japonaise ; caricature d\'ange vengeur à monosyllabes et répliques de baston. Fredonne du Wagner sans desserrer les dents quand le stress monte.\nEnvoyé par Notre-Dame sur signalement de Bernauld : éliminer les PJ vite, de préférence hors du C.H.U. Discret ; une ou deux échauffourées, puis peut revenir pour le final.\nRevolvers : petit calibre de R.ARMES (estimation).',
});
const parasRam = npc('paras-ram', {
  nom: 'Professeur Paras Ram', source: 'Ange de Guy, grade 1 – chef de clinique psychiatrique', type: 'ange', car: car('1 5 5 5 2 3'),
  pp: 14, pfFix: 6, seuilsFix: seuils('4/8/12/16'),
  pouvoirs: pows('Guérison 3, Bénédiction : guérison de folies 3, Immunité contre les maladies et les poisons, Corps gazeux'),
  talents: 'Métier (psychiatre) 5, Médecine 5+, Parler plein de langues différentes 4, Sourire en hochant la tête en signe de compassion 3. Avertissement sans frais : lâche',
  notes: 'Malgache d\'origine tamoule, petit homme à la peau très noire, cheveux lisses, phalanges poilues. En poste depuis un an ; excellent médecin, souvent absent (missions pour Notre-Dame).\nNe repère pas les PJ au début s\'ils restent discrets. Fuit au premier danger ; repéré, il avoue tout et plus encore. Son acte le plus courageux : appeler des renforts.\nDéfense non donnée : 2 (estimation).',
});
const fous = npc('calvin-collaud', {
  nom: 'Calvin et Collaud', source: 'Patients psychiatriques fugueurs', car: car('1 2 2 2 2 2+'), def: L(2), qty: 2,
  pfFix: 3, seuilsFix: seuils('2/4/6/8'),
  armes: [{ n: 'Coup de poing', att: L(2), prec: 0, puis: -3, melee: true }],
  talents: 'Corps à corps 2, Défense 2, Baver 3, Crucifier des cadavres 3',
  notes: 'Trentenaires aux yeux révulsés, cheveux en bataille, barbe mal rasée, pyjamas verts trop grands. L\'un autiste prostré depuis quatre ans, l\'autre schizophrène paisible. Convertis par l\'influence du fœtus, mais pas plus loquaces qu\'un râle.\nLeur Ch (2+) est reportée en Foi.',
});
const chanterelle = npc('chanterelle', {
  nom: 'Xavier Chanterelle', source: 'Ange de Dominique, grade 1 – chef d\'escouade', type: 'ange', car: car('4 2 3 5 2 3'), def: L(3),
  pp: 16, pfFix: 9, seuilsFix: seuils('7/14/21/28'),
  pouvoirs: pows('Peur 3, Lire les pensées 3, Détection du mensonge 2, Jet d\'eau bénite 2, Jugement 2'),
  talents: 'Savoir militaire 1+ (tactique 3), Sixième sens 3, Défense 3, Avoir l\'air à côté de la plaque 3',
  notes: 'Surnommé « le champignon » : corps rachitique, membres courts, grosse tête surmontée d\'une touffe de cheveux crépus. Allure comique trompeuse : esprit redoutable, fidélité absolue au Bien.\nPrévenu par Paras Ram après la fugue des fous ; rôde autour du C.H.U. avec son escouade.\nAucune arme dans le livre : coup de poing par défaut (estimation).',
});
const gratchen = npc('gratchen', {
  nom: 'Ulrike, Tania, Veronika, Lotte et Gisella', source: 'Soldats de Dieu, les « Grätchen de Notre-Dame »', type: 'soldat', qty: 5,
  car: car('2 2 2 2 3 2+'), def: L(3), pp: 4, pfFix: 4, seuilsFix: seuils('3/6/9/12'),
  armes: [
    { n: 'M16', att: L(4), prec: -2, puis: 5, melee: false },
    { n: 'Couteau papillon', att: L(1), prec: -1, puis: -1, melee: true },
  ],
  pouvoirs: pows('Armure corporelle 2'),
  talents: 'Tir 2 (armes d\'épaule 4), Séduction 3, Défense 3, Jurer en allemand 3',
  notes: 'Belles blondes germano-scandinaves aux joues roses, en blouses blanches réglementaires (stéthoscope au cou). Air ingénu et effrayé : effet de surprise au combat.\nLotte porte aussi trois grenades (précision −4, puissance 4, aire d\'effet).\nM16 : fusil-mitrailleur de R.ARMES. Couteau papillon : cran d\'arrêt, sans talent de mêlée dans le livre (attaque estimée au niveau 1).',
});
const yolande = npc('yolande', {
  nom: 'Yolande Jolimont (Andrealphus)', source: 'Prince-démon du sexe, affaibli', type: 'demon', car: car('2 3 3 3 5 3'),
  pp: 3,
  pouvoirs: pows('Charme, Orgasme mortel, Absorption de douleur, Téléportation'),
  talents: 'Séduction, Kama sutra',
  notes: 'Caractéristiques complètes : livre de base INS/MV4, p. 106 (non reprises ici). Fiche minimale : caractéristiques et pouvoirs estimés, PF et seuils laissés au calcul automatique. PP 3 pendant la poursuite, remontent à 8 après la mort d\'Athanase.\nJeune femme mate aux yeux sombres, cheveux bruns très courts, beauté trop lisse et féline ; blouse d\'infirmière trop grande sur un ventre proéminent. Porte Damien, qui l\'oblige à se nourrir de nouveau-nés.\nInaffrontable dans ce scénario : se révèle (« flash » d\'aura de prince-démon), tue le bébé et se téléporte.',
});

// Le bestiaire joint (types réutilisables) : mêmes fiches, sans quantité
const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });

// ---------------- Scènes ----------------
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  scene('briefing', '1. Opération Brise matinale', 'Centre de Tri, Paris – après une semaine de congé syndical',
    `Secret MJ (« Péril en la demeure ») : depuis l'épisode précédent, Beleth a retrouvé la trace des PJ et s'est incarné dans le corps de Monsieur Fabien (l'âme du démon de Baalberith est expulsée). Il veut une équipe neutre, qui a vu Yolande de près, pour enquêter discrètement sur les projets de Damien.
Règles de la relation : le prince reste incognito le plus longtemps possible ; il garantit le silence des PJ (morts, lavage de cerveau, ou compromis jusqu'au cou). Il n'est pas omniscient et peut faire des erreurs de calcul.
Deux détails trahissent l'imposture : Fabien ne raconte plus son anecdote de Laponie spontanément (seulement si on la lui réclame) et allume désormais sa pipe au briquet au lieu des allumettes.

Briefing : Fabien accueille les PJ sur le perron, les félicite, puis Gilbert et Aurélie se joignent à eux autour du percolateur.
• Mission officielle : une circulaire de Beleth cherche un lieu de repos sûr, au contact de nombreux humains, pour une demi-douzaine de ses serviteurs (étude de créatures endormies). Plusieurs sites sont testés (maisons de retraite, cités-dortoirs, rayons literie…).
• Les PJ vont en sous-marin au C.H.U. Louis Pasteur (Hauts-de-Seine) pendant trois ou quatre jours ; contact sur place : le professeur Morlaix, démon de Malthus.
• Rapport circonstancié attendu ; signaler toute activité angélique ou de la troisième force. Moyens d'infiltration libres.
Si les PJ vérifient a posteriori : un pilier de bar du Chez Régis leur apprendra que Beleth a bien d'autres chats à fouetter… et leur enquête est la seule réellement lancée.`),
  scene('chu', '2. Arrivée au C.H.U. Louis Pasteur', 'C.H.U. Louis Pasteur – clinique d\'orthopédie, bâtiment E, 7e étage',
    `Le C.H.U. : énorme étoile de béton déformée par les ajouts (années 50), 8 étages, 3 sous-sols, 2 500 places de parking, 2 200 lits, 1 300 médicaux et 5 000 non-médicaux. Polyclinique tentaculaire, kafkaïenne, ouverte 24 h/24. Choisir quatre ou cinq lieux phares et laisser le reste dans le flou ; saupoudrer de jargon médical.
Après une demi-heure d'errance, les PJ trouvent Morlaix en pleine tournée, suivi de ses internes. Il faut patience et tact pour le voir seul, entre deux portes, avant qu'il ne file au bloc.
Morlaix n'a pas été prévenu et le prend mal : qu'ils ne traînent pas dans son service et se trouvent vite une couverture. Il nie toute activité angélique et ne lâche son numéro de bipeur que s'ils insistent.

Couverture : se faire passer pour patient est une très mauvaise idée (les démons ne souffrent pas, métabolisme différent) ; simple visiteur, ils seront vite refoulés. Une blouse et un badge suffisent, au risque d'être réquisitionné par un supérieur.
Trois intrigues surnaturelles se mêlent, dont deux liées à la campagne ; elles se traitent en parallèle.`,
    [inScene(morlaix)]),
  scene('incidents', '3. Incidents errants (table D66)', 'N\'importe quel service du C.H.U.',
    `À tirer quand le rythme faiblit (D66) :
• 11-12 Urgence : un accidenté arrive sur un brancard ; les PJ en blouse sont réquisitionnés.
• 13-14 Calme plat : service désert, néons qui clignotent, ambiance inquiétante.
• 15-16 Affluence : lits partout dans les couloirs, infirmières à bout.
• 21-22 Trois alcooliques en cure se sont barricadés… en fait ils se goinfrent dans les cuisines.
• 23-24 Eustache, patient de psychiatrie, ne veut que boire de l'eau (potomanie).
• 25-26 Un garçonnet de six ans, opéré de l'œil, s'est perdu et cherche l'ophtalmo.
• 31-32 Visite d'inspection ministérielle : tout le monde est sur les dents.
• 33-34 Deux vieilles dames se battent pour une histoire de ronflements.
• 35-36 Un patient s'effondre devant les PJ : gestes de premiers secours ou il meurt en trois minutes.
• 41-42 Des clowns bénévoles en pédiatrie ; des adultes exigent aussi leur visite.
• 43-44 Travaux en plein service, au grand dam du personnel.
• 45-46 Une star de la chanson hospitalisée : marée de fans.
• 51-52 Courses d'ambulances sur les parkings, avec paris du personnel.
• 53-54 Pot de départ en retraite d'un professeur, au champagne.
• 55-56 Un brancardier confie deux cadavres à descendre à la morgue (visite des sous-sols).
• 61-62 Début d'incendie : pompiers et évacuation.
• 63-64 Un tueur à gages (9 mm silencieux) vient finir une victime ratée.
• 65-66 Quatre héroïnomanes armés de couteaux et seringues pillent la pharmacie.`),
  scene('science', '4. Premier dossier : le trafic de Morlaix', 'Clinique d\'orthopédie, bureaux de la comptabilité – jours 1 à 3',
    `Morlaix arrondit ses fins de mois depuis deux ou trois ans avec un trafic de psychotropes (antalgiques, antidépresseurs…) vendu à la haute société et à ses collègues : ordonnanciers falsifiés, doubles cahiers de commande, stagiaires grassement payés.
Il y a huit mois, Christophe Bernauld (finances du C.H.U.) a découvert la combine en maquillant lui-même les comptes pour son propre trafic de matériel. Il s'est associé : Bernauld est un ange de Marc. Les deux compères s'apprécient (vol, falsification, croquet du dimanche à Châtenay-Malabry).

Déroulement :
• Jour 1 : Morlaix fait suivre les PJ par Gonzague (blouse et badge d'une infirmière en congé parental, « Claude Novack »). Piège même grossier = Gonzague pris.
• Jour 2 : Bernauld, averti, panique : brûle la moitié de ses dossiers, glisse le reste dans le bureau de Morlaix. Fouiller ce bureau révèle le trafic et mène à Bernauld, qui joue le comptable terrorisé et menacé (prétend avoir été endormi par Morlaix).
• Il faut insister et patienter pour que Morlaix avoue ; les « révélations » de Bernauld le font parler de son associé sous la colère.
• Entre-temps Bernauld a signalé les PJ à Notre-Dame : Thanauser (ange de Laurent) vient les éliminer, de préférence hors du C.H.U. Une ou deux échauffourées, puis le garder pour le final.
Si les PJ rament : un témoin providentiel (infirmière, patient, collègue de Bernauld).
Conséquences : à eux de choisir. Si Morlaix s'en sort, il devient bien plus coopératif et ouvre l'accès à des informations confidentielles.`,
    [inScene(morlaix), inScene(gonzague), inScene(bernauld), inScene(thanauser)], true,
    [choice('trafic', 'Que font les PJ du trafic Morlaix-Bernauld ?', [
      ['Ils dénoncent Morlaix', 'Morlaix est discrédité et ne les aidera plus ; Bernauld s\'en tire.'],
      ['Ils tuent Bernauld', 'Le trafic s\'arrête ; risque de nouvelles représailles angéliques.'],
      ['Ils livrent Bernauld à sa hiérarchie', 'Option élégante : jugé par ses pairs. Morlaix, reconnaissant et descendu de son piédestal, devient un allié.'],
      ['Ils laissent faire', 'Le trafic continue en paix ; Morlaix leur doit une faveur.'],
    ])]),
  scene('psy', '5. Deuxième dossier : le pavillon psychiatrique', 'Pavillon psychiatrique, caves et morgue du C.H.U.',
    `Rumeurs : depuis dix jours les fous sont intenables (pleine lune ? nouveau chef ?) et les calmants vont manquer ; en parallèle, huit morts suspectes en maternité en une semaine, que le personnel étouffe.
Le pavillon : bâtiment autonome au bout d'une esplanade-parking, relié aux sous-sols par des couloirs souterrains. Règlement strict (pièce d'identité, fouille, portes sécurisées), murs bleu ciel, fenêtres entrebâillées de 5 cm, prises au plafond, fumeurs dépendants des infirmiers.
Chef de clinique : Paras Ram, ange de Guy, en poste depuis un an. Le personnel signale une moitié de patients en crise, certains en pleine crise mystique (visions de la Vierge, du Christ) ; ceux qu'on approche débitent un charabia mystico-apocalyptique.
Événement : deux patients tranquilles, Calvin et Collaud, ont fugué par une porte mal fermée vers les sous-sols. Si les PJ les retrouvent les premiers, ils les voient se prosterner devant les petits cadavres de la morgue puis vouloir les crucifier aux murs. Faciles à maîtriser, incapables de parler.
Conséquence : prévenue par Paras Ram, une escouade de soldats de Dieu menée par Xavier Chanterelle (ange de Dominique) se met à rôder autour du C.H.U.
Indice : en interrogeant le personnel, on date la première crise mystique ; le registre des visites (accessible via Morlaix, ou à voler) mentionne ce jour-là, vers 17 h, une certaine Yolande Jolimont, enceinte, dont les infirmières se souviennent.`,
    [inScene(parasRam), inScene(fous)], false),
  scene('maternite', '6. Troisième dossier : la maternité', 'Clinique obstétrique, vestiaires et parking du C.H.U.',
    `Secret : Damien s'est réveillé dans le ventre d'Andrealphus il y a deux semaines, affamé. Après avoir tenté de se nourrir des fous (effet décevant), il pousse sa mère porteuse à tuer des nouveau-nés. Andrealphus, déguisée en infirmière stagiaire en obstétrique, a laissé assez de traces pour que Beleth la repère.
Les huit bébés : quatre morts dans leur sommeil au dortoir (étouffés à l'oreiller, pris pour des morts subites), deux prématurés lors d'une panne de couveuse (sabotée), deux mort-nés (Absorption de douleur pendant l'accouchement). À chaque fois, la « petite nouvelle » était dans les parages.
Personnel méfiant, enquête interne en cours ; une couverture solide est nécessaire. Quelques sages-femmes au bord de la crise de nerfs parlent avec un peu de psychologie.
Yolande est introuvable. L'infirmière en chef (ou Morlaix) ouvre son casier : boîte à outils, pantalon moulant et tunique ample, maquillage, Viagra, deux sacs de viande crue (poulet, haché, charcuterie, foie). Dans un sac à main : faux permis au nom de Yolande Jolimont (adresse bidon) et clés d'une Mégane de location beige sur le parking. Dans la boîte à gants : carte de l'hôtel Bellevue (Paris XIe) et une grosse clé n° 13.`),
  scene('poursuite', '7. Comme on se retrouve !', 'Clinique obstétrique puis sous-sols du C.H.U.',
    `Par hasard, en traversant l'obstétrique, les PJ voient Yolande parler à une jeune mère (son bébé Athanase dans les bras, le père fier à côté). Elle les reconnaît, sourit, arrache le bébé et s'enfuit.
Poursuite : couloirs bondés (pouvoirs visuels déconseillés), internes, lits roulants, fauteuils, plateaux-repas ; Yolande saute dans un ascenseur vers les sous-sols, labyrinthe de couloirs et de galeries bétonnées où ses pas résonnent de partout. Elle est très affaiblie (PP 3) et cherche un coin isolé pour tuer le bébé, s'en nourrir et se téléporter.
Dans un recoin, elle serre le cou du nourrisson. Si on la menace, elle se révèle : « flash » d'aura de prince-démon qui illumine tout le C.H.U. Les PJ devraient hésiter… Elle étrangle Athanase (arc lumineux rouge entre l'enfant et son ventre), reprend des couleurs (PP 8), leur souhaite bon courage et disparaît en laissant le corps.
C'est alors que débarquent les You-Yous attirés par l'aura (cris, prières en latin, jurons angéliques) : pour eux, les démons sont responsables de tout. Grosse baston dans les sous-sols ; ils ne lâchent prise que si le combat devient trop visible (en remontant dans la foule, par exemple). Thanauser peut se joindre au final.`,
    [inScene(yolande), inScene(chanterelle), inScene(gratchen), inScene(thanauser)], true,
    [choice('baston', 'Comment se termine l\'affrontement avec les You-Yous ?', [
      ['Les PJ l\'emportent', 'Les anges sont éliminés ou mis en fuite ; Notre-Dame risque de renvoyer du monde plus tard.'],
      ['Les PJ fuient dans la foule', 'Les anges renoncent pour ne pas se montrer ; les PJ sont fichés par Notre-Dame.'],
      ['Les PJ sont submergés', 'Capture ou mort ; Beleth veille à ce qu\'ils ne parlent pas.'],
    ])]),
  scene('hotel', '8. Séquelles postopératoires', 'Hôtel Bellevue (Paris XIe), chambre 13, puis Centre de Tri',
    `Débriefing : s'ils préviennent le Centre, ils sont rappelés d'urgence (Fabien, Gilbert, Aurélie, très préoccupés) ; Fabien fait répéter les points clés puis les accompagne à l'hôtel. Sinon, même séance après l'hôtel, avec un gentil reproche.
Hôtel Bellevue : bouge étroit, une étoile, patron scotché à sa télé et vivant des passes de quelques habituées ; on circule sans peine.
Chambre 13 : odeur de sang et de pourriture, mouches, viande crue partout (abats à divers stades de décomposition, certains morceaux mordus par des dents humaines). Valise de baise-en-ville : vêtements, lingerie, cuir et latex, calibre .45, couteau de commando, faux passeport suisse vierge, liasses d'euros, carte American Express au nom de Yolande Jolimont. Le personnel la trouve « gentille mais bizarre » et la date d'arrivée coïncide avec la mort d'Hakim Izmet. Elle ne reviendra pas : déjà à l'étranger.
Piste bancaire (Aurélie au besoin) : depuis six mois, retraits en Sierra Leone ; environ trois semaines sur place avec escale à Dakar à l'aller, grosses dépenses.
Fabien : rapport négatif envoyé sur le C.H.U. (jugé trop dangereux) ; les révélations sur Andrealphus ne remontent pas, il demande de garder le secret. Il promet de financer une mission en Sierra Leone et une récompense conséquente en cas de succès. Pas de cadeau pour ce scénario.`,
    [], false,
    [choice('prevenir', 'Les PJ préviennent-ils le Centre de Tri avant l\'hôtel ?', [
      ['Oui', 'Rappel d\'urgence et débriefing ; Fabien les accompagne à l\'hôtel Bellevue.'],
      ['Non', 'Débriefing après l\'hôtel ; Fabien leur reproche gentiment de ne pas l\'avoir prévenu.'],
    ])]),
];

const scenario = {
  id: 'fire-and-ice-3-soigner-le-bien',
  nom: 'Fire and Ice (scénario 3) – Soigner le Bien par le Mal',
  resume: `Nihil ex nihilo, scénario 3 (INS). Beleth, incarné en secret dans Monsieur Fabien, envoie les PJ en sous-marin au C.H.U. Louis Pasteur sous un prétexte. Trois intrigues en parallèle : le trafic de médicaments du professeur Morlaix (démon de Malthus) et de son associé angélique, la folie qui gagne le pavillon psychiatrique, et les morts de nouveau-nés en maternité. Toutes mènent à Yolande, alias Andrealphus, qui nourrit Damien de bébés ; elle se révèle, s'échappe et laisse les PJ face aux You-Yous. La piste mène en Sierra Leone.`,
  notes: `Source : ${REF}. Scénario d'enquête et d'ambiance médicale ; le climat se durcit à partir d'ici.
Déroulement : briefing → arrivée et couverture au C.H.U. → trois dossiers en parallèle (trafic de Morlaix, pavillon psychiatrique, maternité), ponctués d'incidents errants → poursuite de Yolande et baston avec les You-Yous → hôtel Bellevue et débriefing.
PNJ sans stats : Monsieur Fabien (Beleth incarné), Gilbert, Aurélie ; le bébé Athanase et ses parents.

Récompenses : aucune indiquée dans ces pages (« pas de cadeau de fin de scénario ») ; Fabien promet une récompense conséquente pour la mission suivante en Sierra Leone.

Fiches adaptées du livre : caractéristiques en niveaux INS/MV (Ch des humains reportée en Foi). Yolande/Andrealphus : fiche minimale estimée (voir livre de base p. 106).`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [morlaix, gonzague, bernauld, thanauser, parasRam, fous, chanterelle, gratchen, yolande].map(asType);

// Contrôle : pouvoirs inconnus des règles
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));

writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types');
