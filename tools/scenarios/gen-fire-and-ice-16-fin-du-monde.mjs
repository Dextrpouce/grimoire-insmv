// Génère le fichier d'import « insmv-scenario » pour « Le jour où nous sommes allés voir la fin du monde »
// (Fire and Ice 2, p. 124-141, + Lux Aeterna p. 150-152, Tempus Fugit p. 152-154, Dramatis Personae p. 155-156, Casus Belli p. 157-159)
// usage : node gen-fire-and-ice-16-fin-du-monde.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Fire and Ice 2, « Le jour où nous sommes allés voir la fin du monde », p. 124-141';
const L = (s) => R.parseLvl(String(s));
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
const ARMES = new Map(R.ARMES.flatMap(([g, l]) => l.map((x) => [x[0], { prec: x[1], puis: x[2], melee: R.MELEE_GROUPS.includes(g) }])));
const arme = (n, table, lvl) => { const w = ARMES.get(table); if (!w) throw new Error('arme inconnue : ' + table); return { n, att: L(lvl), ...w }; };
const poing = (lvl) => arme('Coup de poing', 'Coup de poing', lvl);
let n = 0; const id = (k) => `fi16-${k}`;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [poing(1)], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${o.ref || REF}.`].filter(Boolean).join('\n'),
});
const strip = (x) => { delete x.ref; return x; };

// ---------------- Fiches du Centre de Tri (reprises de fix-centre-de-tri.mjs) ----------------
const REF_CDT = 'Fire and Ice, « Le Centre de Tri », p. 24-26';
const FICHES = {
  fabien: { nom: 'Monsieur Fabien', source: 'Démon de Baalberith, grade 2 (chef du Centre de Tri)', type: 'demon', car: car('2 2 5 4 2 4'), def: 2, pp: 24, pfFix: 6, seuilsFix: [4, 8, 12, 16],
    armes: [{ n: 'Coup de poing', att: 2, prec: 0, puis: -3, melee: true }],
    pouvoirs: pows('Message officiel, Télépathie 5, Boomerang 3, Cauchemar 3, Onde de choc 2, Téléportation 2, Corps gazeux, Détection du futur proche 2, Volonté supra-normale 2'),
    talents: 'Métier (administration) 7, Discussion 6, Baratin 4 ; avantage matériel : le Centre de Tri',
    note: 'Vétéran débonnaire, pipe, anecdote laponne. Secret : remplacé par Beleth (« le Grand Imposteur ») quelques semaines après l\'arrivée des PJ.' },
  gilbert: { nom: 'Gilbert', source: 'Démon de Morax, grade 1 (Centre de Tri)', type: 'demon', car: car('3 2 4 4 3 3'), def: 2, pp: 18, pfFix: 7, seuilsFix: [5, 10, 15, 20],
    armes: [{ n: 'Coup de poing', att: 2, prec: 0, puis: -3, melee: true }],
    pouvoirs: pows('Œuvre d\'art, Télépathie 4, Jet de flammes 2, Sommeil 2, Invisibilité 1, Vitesse 1, Vol 1'),
    talents: 'Tartiner de la poésie 7, Trier du courrier 3, Conduite 4, Pilotage 3, Tir 2+ ; avertissement sans frais : gentil',
    note: 'Délégué CGT, gardien des lettres non distribuées, poète médiocre, habitué de Chez Régis ; bavard une fois éméché. Secret : s\'est perdu un jour dans un dédale lumineux sous les caves.' },
};
const cdt = (key, f, note) => ({
  id: id(key), nom: f.nom, source: f.source, type: f.type, qty: 1, car: { ...f.car }, def: f.def, prot: 0, pfFix: f.pfFix, pp: f.pp, seuilsFix: [...f.seuilsFix],
  armes: JSON.parse(JSON.stringify(f.armes)), pouvoirs: JSON.parse(JSON.stringify(f.pouvoirs)), talents: f.talents, esquive: false, volonte: false,
  notes: [note, f.note, `Caractéristiques : ${REF_CDT}.`].join('\n'),
});
const fabien = cdt('fabien', FICHES.fabien, 'Dans ce scénario : Beleth, sous l\'apparence de Fabien, ne dort plus depuis des jours (cernes énormes) et a la migraine : la voix de Hornet le hante. Donne carte blanche aux PJ pour retrouver Andrealphus, leur avoue que quelque chose cloche (les démons ressentent la douleur). Déconseille de passer par la hiérarchie, conseille sur les alliés à solliciter, gère la logistique (cars, hôtels, coups de fil) mais n\'apporte pas d\'aide militaire.\nFin de campagne (Tempus Fugit) : au jour 12 il accompagne le nouveau monarque des Enfers chez Chez Régis pour les explications finales et les récompenses.');
const gilbert = cdt('gilbert', FICHES.gilbert, 'Dans ce scénario : se joint d\'office aux PJ pour l\'assaut final (« ben ouais, les p\'tits gars ») ; PS 26 dans le tableau de bataille. Au jour 1 après la fin du monde, débriefing au Centre de Tri avec lui.');

// ---------------- Montgrumeau ----------------
const laura = npc('laura', {
  nom: 'Laura Ferdinand', source: 'Humaine, 17 ans, fille des propriétaires du gîte', car: car('1 2 3 2 2 2'), armes: [],
  notes: 'Brune, pulpeuse, rêve de Paris et d\'hommes plus âgés « avec une vraie voiture » ; son petit ami vient la chercher en 103 SP. Intelligente mais naïve : la seule de la famille qui parle facilement aux PJ.\nInfos : les villageois croient à un crash d\'ovni, les vaches dépérissent et donnent de moins en moins de lait ; elle oriente vers le père Dugros. Au retour des PJ en ville, elle les prévient que des soldats sont venus poser des questions sur eux.\nCaractéristiques non fournies par le livre : valeurs estimées.',
});
const ferdinand = npc('ferdinand', {
  nom: 'Famille Ferdinand', source: 'Éleveurs, tenanciers du plus grand gîte de Montgrumeau', qty: 4, car: car('3 2 2 2 1 2'), armes: [arme('Fusil de chasse (Willy)', 'Fusil à pompe', 1)],
  notes: 'Charles (brun sec et barbu, bleu de travail, taciturne) et Caroline (grande blonde bavarde à voix haut perchée, s\'occupe des hôtes et des comptes), la cinquantaine. Willy, 30 ans, conseiller financier à la banque de la ville, méprise les « bouseux » et adore sa mère. Albert, 27 ans, près de deux mètres, s\'occupe des bêtes, intelligent mais muet comme son père.\nAu retour des PJ, Willy les accueille fusil en main et Caroline les prie de partir.\nFiche générique estimée (pas de caractéristiques dans le livre).',
});
const szymkowiak = npc('szymkowiak', {
  nom: 'Didier Szymkowiak', source: 'Humain, vétérinaire de Montgrumeau', car: car('2 2 3 2 3 2'), armes: [],
  notes: 'Ashkénaze athée de 43 ans, grand, chauve, yeux verts malicieux, petites lunettes rondes ; a fui Paris par amour de la nature. Accusé par les villageois d\'empoisonner les vaches pour Cantal.net : totalement innocent et démuni (la Direction régionale des services vétérinaires ne répond pas).\nUn des seuls à parler de l\'incendie, amusé par la rumeur d\'ovni. A vu chez les gens du voyage une jeune femme enceinte correspondant à Yolande (Andrealphus).\nFiche minimale (pas de caractéristiques dans le livre).',
});
const lazaros = npc('lazaros', {
  nom: 'Lazaros Turasca', source: 'Sorcier gitan, patriarche des gens du voyage', car: car('1 1 2+ 4 3 3+'), def: 2,
  pfFix: 5, seuilsFix: seuils('2/4/6/8'),
  armes: [arme('Bâton', 'Bâton (à deux mains)', 4)],
  talents: 'Histoire des Gitans 4+, Combat 4, Discussion 3, Conte 3+ ; sorcellerie : Pentacle pour ange 4, Invocation d\'un ange 3, Demande à un ange 4, Contrôle d\'un ange 3',
  notes: 'Près de cent ans, peau parcheminée et tatouée, très mince, longs cheveux blancs ; appelle les PJ « Mule ». Devine facilement leur nature (comme il avait deviné celle d\'Andrealphus, sans savoir que c\'était un prince en fuite). Accueillant si les démons se tiennent bien.\nAndrealphus a vécu trois semaines dans la communauté (appréciée, se nourrissait à Aurillac) ; elle est partie quand des militaires sont venus poser des questions, et a disparu la nuit de l\'incendie.\nArme non précisée (talent Combat 4) : bâton retenu. Défense non donnée : 2.',
});

// ---------------- Belial et la base ----------------
const brule = npc('brule', {
  nom: 'Brûle, Crame, Grille et Rôti', source: 'Démons de Belial, grade 0 (démons de base)', type: 'demon', qty: 4, car: car('4 4 4 3 1 2'), def: L(3),
  pp: 12, pfFix: 7, seuilsFix: seuils('6/12/18/24'),
  armes: [arme('Fusil d\'assaut', 'Fusil-mitrailleur', 4), arme('Corps à corps', 'Coup de poing', '3+')],
  pouvoirs: pows('Immunité contre le feu, Jet de flammes 2+, Armure corporelle 2, Incendie 2, Invisibilité 2+, Non-détection 2'),
  talents: 'Tir 4, Défense 3, Corps à corps 3+ ; avertissements sans frais : couleur des yeux, cicatrice, phobie des croix, mythomanie',
  notes: 'Quatre types en treillis et rangers armés de fusils d\'assaut. Fiche type des démons de base de Belial : comité d\'accueil sur la route de la ferme, patrouilles du puy de Dôme (avec un membre de la Garde carmine), cinquante démons de base (PS 20) dans la bataille.\nFusil d\'assaut rendu en fusil-mitrailleur (table des règles).',
});
const garde = npc('garde-carmine', {
  nom: 'Garde carmine', source: 'Démons de Belial, grade 1 (équipe d\'élite)', type: 'demon', qty: 2, car: car('4 4 3 3 2 3'), def: L('5+'),
  pp: 13, pfFix: 7, seuilsFix: seuils('6/12/18/24'),
  armes: [arme('Lance-flammes', 'Lance-flammes', 4), arme('Corps à corps', 'Coup de poing', 5)],
  pouvoirs: pows('Jet de flammes 3, Armure corporelle 2, Vitesse 1, Régénération 2, Immunité contre le feu'),
  talents: 'Défense 5+, Corps à corps 5, Athlétisme 4, Tir 3 (armes de guerre 4), Conduite 4+, Pousser des cris de guerre 3, Se retourner tous en même temps 2 ; pouvoir Feu de Prométhée 2 (absent des règles)',
  ref: 'Fire and Ice 2, « Run like Hell », p. 65 (fiche de la Garde carmine, recyclée comme le suggère le scénario)',
  notes: 'Jeunes hommes petits, poilus et lunetteux, déguisés en pompiers ou en militaires, vans noirs. Ont pourchassé Andrealphus et allumé l\'incendie de forêt, puis monté la fausse affaire d\'ovni et la fausse opération militaire. Deux membres au check point, un par patrouille sur le volcan, vingt-cinq dans la bataille (PS 28).\nLe scénario renvoie aux « précédents PNJ » : fiche de l\'équipe de Run like Hell.',
});
const soldats = npc('soldats', {
  nom: 'Soldats de la garnison', source: 'Militaires humains (caserne noyautée par Belial)', type: 'humain', qty: 4, car: car('2 2 2 1 1 2'), def: 2,
  pfFix: 3, seuilsFix: seuils('3/6/9/12'),
  armes: [arme('Fusil d\'assaut', 'Fusil-mitrailleur', '3+')],
  talents: 'Tir 1+ (armes d\'épaule 3+), Savoir militaire 2 (tactique 3)',
  notes: 'Kaki dehors, caca dedans : 20-40 ans, cheveux ras, vocabulaire limité ; des imbéciles engagés faute de mieux et une minorité de fachos. Patrouilles de quatre encadrées par un officier démoniaque dans Montgrumeau ; dix au check point du puy de Dôme.\nFusil d\'assaut (illustration) rendu en fusil-mitrailleur, au niveau des armes d\'épaule. Défense non donnée : 2.',
});
const malthus = npc('malthus', {
  nom: 'La secrétaire de Malthus', source: 'Démone de Malthus incarnée dans une secrétaire de la base', type: 'demon', armes: [],
  notes: 'Trentaine, cheveux roux en chignon serré, acné juvénile, petites lunettes. Aborde les PJ à la fin de l\'embuscade. Responsable de la maladie des vaches (deux mois) et du rachat des fermes par Cantal.net avec l\'argent détourné de la base : simple semeuse de zizanie, aucun projet occulte.\nInfos : quinze démons de Belial incarnés dans la base en plus des assaillants ; tout a commencé il y a un mois par un officier supérieur possédé qui a éliminé les gradés un à un ; vingt soldats patrouillent par quatre avec un officier démon, dix démons restent à la base avec plus de cent hommes normaux ; centre de formation d\'une dizaine de « nouveau-nés » de Belial. Base d\'un kilomètre carré, grilles de cinq mètres barbelées. Elle sait qu\'un prisonnier a été pris le jour de l\'incendie, qu\'il va être exfiltré et que le plan aura lieu dans une semaine.\nFiche minimale (pas de caractéristiques dans le livre).',
});
const sorciers = npc('sorciers', {
  nom: 'Sorciers encapuchonnés de rouge', source: 'Sorciers humains contraints par Belial', type: 'humain', qty: 6, car: car('2 2 2 3 2 2'), armes: [arme('Couteau rituel', 'Poignard ou saï', 1)],
  notes: 'Les « scientifiques » de la base (faciès hermetica), une trentaine sur le plateau du pentacle qui psalmodient l\'invocation. Ne combattent pas : ils fuient dans tous les sens quand le volcan entre en éruption.\nFiche estimée (pas de caractéristiques dans le livre).',
});
const belial = npc('belial', {
  nom: 'Belial', source: 'Prince-démon du feu', type: 'demon', armes: [],
  notes: 'Prépare dans le cratère du puy de Dôme le rituel d\'invocation de « la meuf » (la femme de la MRC qu\'il aime) dans le fœtus d\'Andrealphus, en puisant la puissance du volcan, quitte à raser la région. Au centre du pentacle, en sueur, extatique, trop concentré pour diriger la défense.\nSort : tué en combat singulier par les PJ s\'ils en ont les moyens, sinon par Baal (longue épée rouge) en quelques secondes.\nFiche minimale (prince-démon, pas de caractéristiques dans le livre ; PS 11 + équipement selon Casus Belli).',
});
const andrealphus = npc('andrealphus', {
  nom: 'Andrealphus (Yolande Jolimont)', source: 'Prince-démon du sexe, enceinte de Damien', type: 'demon', armes: [],
  notes: 'A épuisé ses PP dans sa fuite et utilisé les derniers pour appeler les PJ au secours. Plongée dans un coma profond, transportée dans un container d\'acier de la taille d\'un cercueil, puis attachée sur l\'autel du pentacle. Enlevée par « Gabriel » (Satan) pendant l\'éruption.\nÀ La Bourboule, les PJ doivent la tuer avec l\'épée de Gabriel pour sauver l\'Univers : Lucifer (Damien) naît à sa place.\nFiche minimale (ses caractéristiques sont dans les règles du jeu ; ici elle n\'a plus de PP).',
});

// ---------------- Paris : alliés et petits services ----------------
const marieJolie = npc('marie-jolie', {
  nom: 'Marie-Jolie', source: 'Succube, grade 3 de Baal (future prince du sexe)', type: 'demon', car: car('6 7 5 6 8 8'), def: L(9),
  pp: 90, pfFix: 12, seuilsFix: seuils('9/18/27/36'),
  armes: [{ n: 'Hache de bataille maudite ancienne (inadaptée à la parade)', att: L('9+'), prec: 6, puis: 9, melee: true }],
  pouvoirs: pows('Absorption d\'énergie sexuelle 12, Absorption de douleur 6, Armure corporelle 6, Boomerang 6, Caméléon 4, Charme 6, Déguisement superficiel 8, Détection des ennemis 6, Détection du bien 6, Esquive acrobatique 6, Humanité 6, Invisibilité 7, Jet de flammes 6, Lecture d\'aura 4, Lire les pensées 7, Malédiction : stérilité 6, Membre exotique : petites cornes, Non-détection 8, Obscurité 4, Orgasme mortel 11, Polymorphie 8, Télékinésie 4, Télépathie 4, Téléportation 8, Voix impérieuse 7'),
  talents: 'Acrobatie 9+, Aisance sociale 10+, Athlétisme 8, Baratin 10, Combat 7+ (haches 9+), Contorsionnisme 9, Corps à corps 7, Défense 9, Discrétion 9, Discussion 9+, Enquête 8, Fouille 6+, Intimidation 9, Intrusion 10, Kama Sutra 13, Médecine 5, Savoir militaire 6 (tactique 9), Séduction 13, Sixième sens 8, Torture 8',
  ref: 'Fire and Ice 2, « Dramatis Personae », p. 155-156 ; rôle : p. 134',
  notes: 'En contact permanent avec Monsieur Fabien. Rencontre les PJ au bar du Ritz avec Thomas Hobbes et Baal en personne (costume Armani noir, cravate Mickey rouge). Si on expose toute l\'affaire à Baal : dix serviteurs de Baal, Marie-Jolie (PS 38) et ses deux corbeaux (PS 15), Thomas Hobbes (PS 40, stratège), plus une demi-douzaine d\'anges de Michel envoyés en renfort (n\'interviennent que si la situation devient désespérée).\nAprès la campagne (jour 11), elle devient prince du sexe et peut proposer aux PJ de passer à son service. Au combat, se jette au contact à la hache.\nFiche : celle du prince (Dramatis Personae, valeurs « +8 » lues comme niveau 8) ; ses caractéristiques d\'avant sa promotion sont dans New World Order, p. 71. Facteur d\'invocation : incroyable ; communication : 2.',
});
const hobbes = npc('hobbes', {
  nom: 'Thomas Hobbes (Leviathan)', source: 'Démon stratège, allié de Baal', type: 'demon', armes: [],
  notes: 'Plus souriant que jamais au bar du Ritz. Dans la bataille, c\'est lui (« Leviathan ») qui fait manœuvrer les troupes pour ouvrir aux PJ une percée vers le plateau du pentacle. PS 40.\nFiche minimale : ses caractéristiques sont dans « Run like Hell ».',
});
const hornet = npc('hornet', {
  nom: 'Hornet', source: 'Sorcier mort-vivant, futur prince des morts (usurpateur de Bifrons)', type: 'mortvivant', car: car('5 6+ 7+ 8 6+ 5'), def: L('10+'),
  pp: 98, pfFix: 13, seuilsFix: seuils('8/16/24/32'),
  armes: [{ n: 'Dague maudite ancienne', att: L('10+'), prec: 6, puis: 6, melee: true }],
  pouvoirs: pows('Armure corporelle 7, Champ de force 5, Charme 6, Conversion physique 6, Détection du danger 6, Douleur 6, Larves sous-cutanées 9, Lire les pensées 4, Malédiction : vieillissement 9, Membre exotique : crocs, Membre exotique : griffes, Némésis 6, Nécrose 12+, Peur 9, Poison 6, Résurrection macabre 12+, Supériorité martiale 5, Télépathie 6, Ténèbres sataniques 5'),
  talents: 'Acrobatie 6, Aisance sociale 7, Athlétisme 9+, Baratin 7, Corps à corps 10+, Défense 10+, Discrétion 9, Discussion 7, Enquête 8, Fouille 9, Intimidation 12, Médecine 10, Savoir militaire 6 (stratégie 9), Séduction 7, Sixième sens 10, Torture 8 ; sorcellerie : tous les talents à 10+ et plusieurs dizaines de sorts',
  ref: 'Fire and Ice 2, « Dramatis Personae », p. 156 ; rôle : p. 124-125, 135, 154',
  notes: 'Presque fini d\'absorber les pouvoirs de Bifrons, il a lancé (jour 1) un sort expérimental : toutes les créatures surnaturelles incarnées ressentent la douleur comme des humains. Sa voix hante Beleth.\nPiste des sorciers : en contactant la Rose, les PJ obtiennent un rendez-vous avec Hornet lui-même, qui cherche surtout à en apprendre le plus possible. Aide : aucune.\nAprès la mort d\'Andrealphus, Bifrons meurt et Hornet devient en secret prince des morts. Évite le combat (morts-vivants, familiers) sauf poussé à bout.\nFiche : celle du prince (Dramatis Personae) ; valeurs antérieures dans le Guide de la troisième force, p. 221. Facteur d\'invocation : incroyable ; communication : 3.',
});
const girfalko = npc('girfalko', {
  nom: 'Girfalko', source: 'Ange de Blandine, grade 3', type: 'ange', car: car('2 2 4 5 2 5'), def: L(3),
  pp: 25, pfFix: 7, seuilsFix: seuils('5/10/15/20'),
  armes: [poing(1)],
  pouvoirs: pows('Non-détection 3, Rêve divin 4, Rêve 3, Sommeil 4, Absorption de gentillesse 2, Lire les pensées 3, Charme 3, Détection du futur proche 1'),
  talents: 'Discussion 5, Discrétion 4, Baratin 3, Défense 3, Intrusion 2 ; avertissement sans frais : interdit (musique)',
  notes: 'La quarantaine, taille moyenne, cheveux blonds rasés sur les côtés et queue de cheval, blouson de cuir élimé, velours côtelé noir, cols roulés pastel. Fuit à la première occasion.\nCible du « petit service » demandé par Malphas : il fouine sur l\'Aphte depuis l\'affaire New World Order ; il faut lui faire peur sans le tuer (appartement dans le 6e). Grade 3 « intouchable » surveillé par les forces du Mal : discrétion impérative.\nPas d\'arme : coup de poing estimé au niveau 1.',
});
const cassis = npc('cassis', {
  nom: 'Albert Cassis', source: 'Humain, spécialiste du maquereau (proxénète guadeloupéen)', car: car('3 2 1 2 1 2'), def: 2,
  pfFix: 5, seuilsFix: seuils('4/8/12/16'),
  armes: [arme('Revolver', 'Revolver gros calibre', 3), poing(3)],
  talents: 'Cuisine 3, Corps à corps 3, Tir 3',
  notes: 'Près de cinquante ans, dents du bonheur, cheveux crépus presque blancs, costumes immaculés à larges épaulettes, chemise ouverte sur ses médailles en or. Restaurant dans le 8e. Agréable puis arrogant quand on le menace, avant de ramper pour sa vie.\nCible du service demandé par Claude et Claude (Penthouse 69) : son réseau de prostituées africaines leur fait concurrence. On remonte à lui en enlevant et interrogeant une fille ; il faut une vraie leçon (restaurant brûlé, dénonciation, passage à tabac).\nArme non précisée : revolver estimé. Défense non donnée : 2.',
});
const strauss = npc('strauss', {
  nom: 'Julien Strauss', source: 'Ange de Daniel, grade 2 (chef des skinheads)', type: 'ange', car: car('4 4 4 2 2 4'), def: L('4+'),
  pp: 18, pfFix: 6, seuilsFix: seuils('7/14/21/28'),
  armes: [{ n: 'Épée longue bénie', att: L(5), prec: 2, puis: 4, melee: true }],
  pouvoirs: pows('Pétrification 3, Déphasage 2, Décharge électrique 1, Jeûne, Caméléon 3'),
  talents: 'Combat 5, Défense 4+, Chants de supporters 2 ; avantage en nature : skinheads ; avertissement sans frais : intégrisme',
  notes: 'Hooligan du kop de Boulogne, crâne rasé, grand crucifix tatoué sur chaque dos de main ; a des potes des deux côtés de la batte. Sûr de lui en bande, se bat jusqu\'à la mort contre des démons avérés.\nCible du service des zombies des galeries : le tuer désorganise les skins qui harcèlent les catacombes. Repérable à la sortie d\'un match, avec ses cinq copains skins (ou en le suivant jusque chez lui).',
});
const skins = npc('skins', {
  nom: 'Copains skins de Julien', source: 'Hooligans skinheads', qty: 5, car: car('3 2 2 2 1 2'), def: 2,
  pfFix: 4, seuilsFix: seuils('4/8/12/16'),
  armes: [arme('Batte de base-ball', 'Masse d\'arme ou batte', 2), arme('Coup de pied (rangers)', 'Coup de pied (botte ferrée)', 2)],
  talents: 'Corps à corps 2, Intimidation 2, Chants de supporters 2',
  notes: 'Fiche générique estimée (pas de caractéristiques dans le livre).',
});
const flics = npc('flics', {
  nom: 'Gardiens du dépôt de Mantes-la-Jolie', source: 'Policiers', qty: 5, car: car('2 2 2 2 1 2'), def: 2,
  pfFix: 4, seuilsFix: seuils('3/6/9/12'),
  armes: [arme('Revolver de service', 'Revolver petit calibre', '2+'), arme('Matraque', 'Matraque', 2)],
  talents: 'Athlétisme 2, Conduite 2, Tir 2+, Corps à corps 2',
  notes: 'Les cinq flics qui gardent encore le dépôt d\'armes de la police une fois que Pablo (grade 3 de Ouikka) a coupé l\'alarme et les caméras. À l\'intérieur : armes à feu, quelques kilos d\'explosifs, de la drogue.\nFiche générique estimée (pas de caractéristiques dans le livre).',
});

// ---------------- Fin du monde ----------------
const gabriel = npc('gabriel', {
  nom: 'Gabriel', source: 'Archange du feu', type: 'ange', armes: [],
  notes: 'Grand, large d\'épaules, cheveux blond presque blanc tombant sur le visage, épée de flammes. À la fin de la bataille, le vrai Gabriel rejoint les PJ : le « Gabriel » qui observait la bataille et a enlevé Andrealphus était Satan déguisé.\nÀ La Bourboule, Samaël lui demande de le tuer ; Gabriel le décapite puis meurt à son tour (Dieu les a créés par paires). Son épée, seule arme capable de tuer définitivement un ange, reste plantée dans la neige.\nFiche minimale (pas de caractéristiques dans le livre).',
});
const samael = npc('samael', {
  nom: 'Satan (Samaël, Lucifer)', source: 'Ange de lumière, ancien maître des Enfers', type: 'demon', armes: [],
  notes: 'Se présente aux PJ avant l\'attaque sous l\'apparence de Gabriel, demande à les accompagner et observe la bataille sans que personne ne songe à l\'attaquer. Enlève Andrealphus pendant l\'éruption et l\'emmène à La Bourboule, à une trentaine de kilomètres, où Dieu passe ses vacances.\nFatigué, il veut que celui qui règne sur Dis ait une foi pure en sa cause : il offre son cou à Gabriel et confie aux PJ le soin de sauver l\'Univers.\nFiche minimale (pas de caractéristiques dans le livre).',
});
const postier = npc('postier', {
  nom: 'Le petit postier', source: 'Mystérieux facteur de La Poste', armes: [],
  notes: 'Après la renaissance de Lucifer, tousse pour attirer l\'attention, fait signer un formulaire aux PJ, récupère l\'épée de Gabriel dans un tube en carton et repart en mobylette en chantonnant « The End » des Doors. (Clin d\'œil : sans doute un émissaire de Dieu.)\nFiche minimale.',
});

const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; delete t.ref; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => { const c = { ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over }; delete c.ref; return c; };
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const CASUS = `Règles « Casus Belli » (combat de masse, p. 157-159) :
1. Puissance (PS) de chaque combattant = type + équipement + pouvoirs.
• Types : humain normal 1, humain entraîné (flic, troufion) 2, humain très entraîné (commando, serviteur de Dieu) 2,5, soldat de Dieu 3, mort-vivant 2, familier 3, psi 1,5, démon 5, ange 5,5, héros 3,5, émanation d'un dieu 7, avatar de prince-démon 9,5, avatar d'archange 10, prince-démon 11, archange 11,5.
• Équipement : arme de contact 0,5, arme de poing 1, arme d'épaule 1,5, arme lourde 3, arme très lourde 9, arme ou armure magique PA/10 ; moto 2, voiture citadine 4, berline 6, van 8, semi-remorque ou hélicoptère 10, blindage +5 ; armure légère 0,2, gilet pare-balles 0,5, armure lourde 1.
• Pouvoirs : offensif à distance = coût en PP, membre exotique / arts martiaux / contact 1,5, défensif = PP/2, utilitaire 2.
2. Type de combat (bonus multiplicateur sur les dommages infligés ; pertes majorées après tous les autres modificateurs) :
• Escarmouche : aucun modificateur.
• Bataille rangée : pertes +20 % pour les deux camps.
• Assaut (A attaque une position tenue par B) : B ×2 ; pertes +10 % pour A.
• Embuscade (A surprend B) : A ×1,5, B ×0,5 ; pertes +10 % pour B.
3. Chefs : test résisté de Savoir militaire (tactique sous 30 combattants, stratégie au-delà) ; MR du vainqueur ×10 = % de pertes en plus infligées par son camp.
4. Chaque tour (10 s), chaque camp inflige PS/10 (modifié par le type de combat) + % du type de combat + % du test des chefs ; le MJ retire d'abord la piétaille. Exemple du livre : 2 000 PS en embuscade contre 1 000 PS, test réussi MR 4 → 330 PS de dommages contre 70.
5. Fuite : 20 % de pertes en plus pendant 2 tours et PS réduite de moitié (si le chef du fuyard gagne le test, MR ×10 = % de pertes en moins).
6. PJ dans la mêlée : chaque tour, 1d6+2 PF de dommages (le MJ répartit en blessures) et perte de 25 % des PP. Une action d'éclat tous les trois tours (viser un véhicule, un chef) se résout en combat normal ; une cible détruite retire ses PS à son camp en plus des pertes.`;

const scenes = [
  scene('prologue', '1. Prologue : living in harmony', 'Centre de Tri, Paris – jour 1',
    `Contexte : à la fin du scénario précédent, Belial a enfin capturé Andrealphus (enceinte de Damien, sous les traits de Yolande Jolimont). Poursuivie par la Garde carmine, elle a brûlé tous ses PP et utilisé les derniers pour appeler au secours les seuls en qui elle a confiance : les PJ. Direction Montgrumeau, dans le Cantal, où Belial prépare justement son rituel d'invocation de « la meuf ».
Le même jour, Hornet lance son sort expérimental : toutes les créatures surnaturelles incarnées ressentent désormais la douleur comme des humains (à rappeler dès le premier combat, adversaires compris).
Si les PJ repassent au Centre de Tri : Beleth (sous l'apparence de Monsieur Fabien) ne dort plus depuis des jours, cernes énormes, migraine, la voix de Hornet dans la tête. Il leur donne carte blanche et leur avoue que quelque chose ne tourne plus rond.
Trajet : avion jusqu'à Clermont-Ferrand, puis une centaine de kilomètres de route ; panneaux vantant Vulcania et les cures de La Bourboule.`,
    [inScene(fabien), inScene(gilbert)]),
  scene('montgrumeau', '2. La petite maison dans la prairie', 'Montgrumeau (Cantal), gîte de la ferme Ferdinand – jours 2-3',
    `Montgrumeau : 21 548 habitants, à flanc de montagne, une trentaine de kilomètres au nord-ouest d'Aurillac ; commune étendue, fermes éloignées, vent du sud et buissons qui roulent comme dans un western. « Première commune câblée du Cantal ». Visages fermés, camions militaires partout, fermes délabrées et vaches faméliques, mais centre-ville rutilant refait à neuf et quelques maisons très luxueuses.
Sources de tension : camp de bohémiens mal accepté, rachat des fermes par Cantal.net, vaches malades, présence très active de l'armée depuis que « quelque chose » s'est écrasé dans la forêt (en grande partie calcinée).
Pas d'hôtel : le plus grand gîte rural est la ferme des Ferdinand (pavillon près de la grange, odeur de bouse). Laura est la porte d'entrée : la seule à parler des problèmes (ovni, vaches) ; elle oriente vers le père Dugros.
Ambiance : méfiance générale, villageois qui se taisent ou quittent le bar à l'arrivée des PJ.`,
    [inScene(laura), inScene(ferdinand)]),
  scene('fausses-pistes', '3. Pour une poignée d\'euros', 'Montgrumeau et environs – jours 2-3',
    `Fausses pistes qui retardent les démons (ils se méfient a priori de l'armée, tant l'infiltration de la troupe par les anges est connue : rappeler la discrétion).
• Le père Dugros, meilleur fromager du coin : tout est une affaire de gros sous ; Cantal.net rachète les fermes pour une usine électronique et rend les vaches malades avec l'aide du vétérinaire.
• Cantal.net : Armand Rouvillois et René Mangeot, trentenaires informaticiens de Clermont, au bout du rouleau (René aime en secret Chantal, la femme d'Armand). Câblage subventionné avec l'appui du maire communiste Paul Lebaron (soixante ans, replet, roublard, qui a refait son centre-ville avec l'argent et multiplie les recours contre les gitans). Les fonds viennent en réalité de l'armée, qui les utilise comme prête-noms sans explication ; ils ne l'avouent que sous la pression.
• Didier Szymkowiak, le vétérinaire : innocent, parle de l'incendie (la nuit de la disparition d'Andrealphus) et a vu une jeune femme enceinte ressemblant à Yolande chez les nomades.
• Dominique, l'idiot du village (quarantaine, obèse, hirsute, phrases de trois mots) : la nuit de l'incendie, des « hommes en noir » lui ont dit de rentrer chez lui ; il en a conclu à des espions cachant un vaisseau extraterrestre. Rien d'autre.
• La forêt : à quelques kilomètres, un cratère d'une trentaine de mètres avec quelques débris métalliques.
• Les gens du voyage : une trentaine, mobile homes et caravanes, famille Turasca menée par le patriarche Lazaros, sorcier qui devine la nature des PJ. Andrealphus est restée trois semaines chez eux et a disparu la nuit de l'incendie après une visite des militaires.`,
    [inScene(szymkowiak), inScene(lazaros)]),
  scene('embuscade', '4. Mon nom est personne', 'Route de la ferme Ferdinand – jour 3',
    `Au retour en ville : état de siège, militaires armés en patrouille, habitants cloîtrés. À la ferme, Willy les accueille fusil en main et Caroline les prie de partir ; Laura leur glisse que des soldats les recherchent.
Vérité : la Garde carmine nettoie la région. Ce sont les démons de Belial qui ont mis le feu à la forêt en poursuivant le prince ; ils ont exploité la rumeur d'ovni, posé de faux débris puis lancé une fausse opération militaire pour boucler le périmètre.
Un comité d'accueil de démons de Belial surveille la route de la ferme et suit les PJ jusqu'à un endroit tranquille pour les attaquer. Rappel : tout le monde ressent la douleur.`,
    [inScene(brule)], true),
  scene('base', '5. La base militaire', 'Caserne de Montgrumeau – jours 3-5',
    `À la fin du combat, une démone de Malthus (secrétaire de la base) aborde les PJ et leur décrit la base (voir sa fiche) : quinze démons de Belial incarnés, contamination partie d'un officier supérieur il y a un mois, vingt soldats en patrouilles de quatre avec un officier démon, plus de cent hommes normaux, une dizaine de nouveau-nés de Belial en formation. Le plan de Belial aura lieu dans une semaine.
Infiltration déconseillée mais possible : un peu plus d'un kilomètre carré, grilles de cinq mètres barbelées ; se déguiser en militaire et rester discret. La base grouille ; un convoi se prépare (une dizaine de camions), des « scientifiques » à tête de sorciers errent. Andrealphus est inapprochable : gardée par deux groupes de la Garde carmine dans un entrepôt, dans le coma.
En surveillant, les PJ voient charger un container d'acier de la taille d'un cercueil dans un camion ; un convoi d'une demi-douzaine de véhicules part vers le nord, rejoint l'autoroute de Clermont-Ferrand, dépasse Vulcania et prend la route du puy de Dôme, où un check point militaire bloque tout le monde (prétendue activité volcanique).`,
    [inScene(malthus), inScene(soldats, { qty: 4 }), inScene(garde, { qty: 2 })], false,
    [choice('base', 'Comment les PJ suivent-ils la piste d\'Andrealphus ?', [
      ['Ils observent la base de l\'extérieur', 'Ils voient le container partir avec le convoi et le suivent jusqu\'au check point du puy de Dôme.'],
      ['Ils s\'infiltrent dans la base', 'Très risqué : un repérage déclenche une bataille perdue d\'avance contre plus de cent hommes et une vingtaine de démons ; au mieux ils confirment le coma d\'Andrealphus et le départ imminent.'],
    ])]),
  scene('volcan', '6. Un être s\'éteint, un volcan s\'éveille', 'Vulcania, Clermont-Ferrand et puy de Dôme – jours 3-5',
    `Belial a choisi le puy de Dôme pour sa conjonction : les volcans lui permettent, à lui et ses serviteurs, de récupérer vite de la puissance, et il compte s'en servir pour booster l'invocation quitte à noyer la région sous la lave. Il reste une semaine à compter de l'arrivée d'Andrealphus. Rapport de force : un contre dix ; il faudra rentrer à Paris lever une armée.
• Vulcania : grand musée en béton au cône central ; à Clermont, on apprend que l'armée est là depuis un mois « en prévision d'une éruption ». Les volcanologues n'y croient pas (le puy de Dôme dort pour longtemps ; il faudrait évacuer, pas déployer des soldats).
• Martin Abrahamovitch, exovolcanologue de près de quatre-vingts ans, ours polaire à fort accent clermontois et un peu cinglé : selon lui une race extraterrestre déclenche l'Apocalypse par les volcans. Il a des échantillons : forte activité, prête à l'éruption. Il indique un sentier évitant les patrouilles : une heure de marche jusqu'à un trou d'un mètre d'où monte une fumée âcre au-dessus d'un puits de lave (activité doublée en quinze jours).
• Cratère principal : aux jumelles, baraquements préfabriqués, hommes en armes, vans noirs de la Garde carmine. Ascension difficile : au moins six heures, nombreux tests de Perception, possible rencontre d'une patrouille de démons de Belial.
• Au sommet : une demi-douzaine de baraquements, une dizaine de transports de troupes de l'armée, des véhicules de la Garde carmine ; derrière la crête, un camp retranché (deux grands entrepôts, une vingtaine de baraques, des dizaines d'hommes armés). Dans le cratère, lave et jets de plusieurs mètres ; cent mètres plus bas, un plateau rocheux accessible par des marches taillées : autel de pierre au centre d'un pentacle rouge d'une cinquantaine de mètres, pics de trois mètres à chaque pointe avec chaînes et traces de sang coagulé.
Libérer Andrealphus seuls est suicidaire : retour à Paris (Beleth les presse de revenir s'en occuper eux-mêmes, il n'a pas le temps de gérer les renforts).`,
    [inScene(garde, { qty: 1 }), inScene(brule, { qty: 3 })], true),
  scene('diplomacy', '7. Diplomacy : lever une armée', 'Paris – jours 3-10',
    `Beleth déconseille la hiérarchie (le chaos règne chez les forces du Mal). Les PJ font jouer leurs relations ; partie très ouverte, improviser au besoin. Pour chaque allié : condition → aide (PS individuelles du tableau de la scène 9).
• Andromalius, via Salomon (suite à l'hôtel Crillon, joue les transfuges) : exposer toute l'affaire et lui fournir les preuves du complot contre lui (dossier de Run like Hell, ou piste d'Alonzo jusqu'à Aurélie) → une dizaine de « démons » dont la moitié sont des anges (deux équipes du Labyrinthe) à Vulcania la nuit d'avant.
• Ange (via Ignace, lapin au premier rendez-vous, bar place Saint-Michel) : jouer l'équilibre Bien/Mal et garantir sa sécurité → trois anges vaudouisants et Ignace, à Clermont la veille.
• Baalberith : très mauvaise idée. Charmant, il loue une villa près de Clermont et prête trois serviteurs… et prévient Belial : une vingtaine de démons attaquent la villa à l'arme lourde. Pas d'effet de surprise.
• L'Aphte : Malphas en personne ; en échange, faire peur sans le tuer à Girfalko, ange de Blandine grade 3 « intouchable » → logistique : effectifs exacts de Belial et rumeur d'une attaque à Toulouse (Belial redéploie dix démons).
• Baskin Robbins (Nosferax) : Samigina refuse.
• Boul'Mich (Delikatessen, si bonne entente au scénario 9) : Haagenti trouve ça marrant → familles cannibales (transport à fournir) et trois bouchers de la « 103e division de gastronomie ».
• Chez Régis : Jésus refuse (neutre, a piscine) ; trois ou quatre démons recrutables parmi les clients selon le roleplay.
• Crocell (si aidé au scénario 8) : une dizaine de démons (moitié renégats) et une trentaine de Flocons de sang.
• Centre de Tri : conseils et logistique ; Gilbert participe à l'assaut.
• Deprofundis : vient avec ses zombies lettrés, sans véhicule ni permis (transport à organiser).
• Furfur : introuvable sauf au concert de 2MBC dans un squat de banlieue trois jours avant l'invocation ; il faut pogoter dans le pit → cinq serviteurs et une douzaine de teufeurs défoncés aux acides (squat à Clermont).
• Marie-Jolie (via Fabien) : bar du Ritz avec Thomas Hobbes et Baal ; tout expliquer à Baal → dix serviteurs de Baal, Marie-Jolie, ses deux corbeaux, Thomas Hobbes, et une demi-douzaine d'anges de Michel en renfort de dernier recours.
• Ouikka (paranoïaque, cabines téléphoniques, intermédiaires) : Pablo, autonomiste basque grade 3 ; insister sur la revanche de Crocell → accès au dépôt d'armes de la police de Mantes-la-Jolie.
• Paulo et Rotka : refus net ; Rotka prévient Belial (pas d'effet de surprise).
• Penthouse 69 : en échange, faire la leçon à Albert Cassis → armes automatiques et beaucoup d'argent (hôtel, villa, voire hélicoptère).
• Le Professeur (Kronos), via un attaché parlementaire au Café des ministres, rendez-vous à 11 h 11 dans un atelier du quartier de l'Horloge, neuf minutes d'entretien : ponctualité, politesse, « préserver le Grand Jeu » → il appelle au début de la bataille et anticipe les manœuvres de Belial.
• Sechepine : faire taire le chihuahua de sa voisine → Kobal, à une pièce d'Ibsen à la Comédie-Française, exige une blague qui le fasse rire en deux minutes → division « Runaway », une douzaine de démons incarnés dans des lapins blancs.
• Les sorciers : la Rose mène à Hornet lui-même. Aide : non.
• Zombies des galeries (si alliés au scénario 9) : tuer Julien Strauss, chef des skins → une dizaine de zombies (transport).
• U-Boat Crew (Vephar) : retrouver Marguerite, anaconda familier de trente mètres bleu pastel, capturée par les services vétérinaires (zoo de Vincennes) → Marguerite (transport).
• Uphir (si le miniscénario « Magie, magie et vos idées ont du génie » a été joué) : rendez-vous via Super Phénix → une dizaine de bourrins en camion antédiluvien.`,
    [inScene(fabien), inScene(marieJolie), inScene(hobbes), inScene(hornet)], false,
    [choice('princes', 'Quels grands alliés les PJ ont-ils ralliés ?', [
      ['Baal et Marie-Jolie', 'Marie-Jolie (PS 38), ses deux corbeaux (PS 15), Thomas Hobbes (PS 40), 10 démons (PS 30) ; 12 anges de Michel (PS 30) seulement en cas de situation désespérée.'],
      ['Andromalius (Salomon)', '5 démons (PS 25) et 5 anges du Labyrinthe (PS 30).'],
      ['Crocell', '3 grade 3 (PS 27) et 7 démons (PS 21), plus des Flocons de sang.'],
      ['Furfur', '5 démons (PS 24) et 12 teufeurs (PS 1,5).'],
      ['Ange (Ignace)', '3 anges vaudouisants (PS 30) et Ignace (PS 30).'],
    ]),
    choice('petits', 'Quels autres renforts ont-ils obtenus ?', [
      ['Boul\'Mich', '3 démons (PS 22) et jusqu\'à 40 cannibales (PS 1,5).'],
      ['Chez Régis', '3 ou 4 démons (PS 20, 21, 18, 20).'],
      ['Deprofundis', 'Deprofundis (PS 28) et 3 zombies (PS 8).'],
      ['Sechepine (Kobal)', '12 lapins (PS 20).'],
      ['Zombies des galeries', '10 zombies (PS 6).'],
      ['U-Boat Crew', 'Marguerite (PS 26).'],
      ['Uphir', '10 démons (PS 18).'],
    ]),
    choice('soutien', 'Quel soutien logistique ou quelle gaffe ?', [
      ['L\'Aphte (Malphas)', 'PS de Belial −200 (10 démons de moins, envoyés à Toulouse) et effectifs connus.'],
      ['Le Professeur', 'Bonus de 3 colonnes aux tests de Savoir militaire (stratégie) du chef des PJ.'],
      ['Ouikka ou Penthouse 69', 'Armes pour 12 PS (dépôt de Mantes) ou beaucoup d\'argent.'],
      ['Baalberith ou Paulo et Rotka', 'Belial est prévenu : pas d\'effet de surprise et PS de Belial +200 (non cumulatif). Avec Baalberith, attaque de la villa par une vingtaine de démons.'],
    ])]),
  scene('services', '8. Petits services', 'Paris et banlieue – jours 3-10',
    `Missions annexes exigées par certains alliés ; chacune peut tourner à la baston.
• Girfalko (pour Malphas) : appartement dans le 6e, lui faire peur sans le tuer ; il fuit à la première occasion. Grade 3 surveillé par les forces du Mal : être discret.
• Albert Cassis (pour Penthouse 69) : enlever et interroger une de ses filles, puis lui donner une vraie leçon dans son restaurant du 8e.
• Julien Strauss (pour les zombies des galeries) : le repérer à la sortie d'un match au Parc des Princes avec ses cinq copains skins, ou le suivre jusque chez lui.
• Dépôt de Mantes-la-Jolie (pour Ouikka) : Pablo neutralise alarme et caméras, il reste cinq flics.
• Marguerite (pour l'U-Boat Crew) : organiser son évasion des services vétérinaires du zoo de Vincennes sans se faire repérer.
• Le chihuahua de la voisine de Sechepine ; le pogo au concert de 2MBC pour Furfur ; la blague pour Kobal (le meujeu juge).`,
    [inScene(girfalko), inScene(cassis), inScene(strauss), inScene(skins), inScene(flics)], true),
  scene('approche', '9. Vulcania, la veille', 'Vulcania, Clermont-Ferrand, route du puy de Dôme – jour 10',
    `Les renforts arrivent à Vulcania ou à Clermont la veille. Les PJ doivent jouer les touristes et décourager les curieux de s'intéresser à leurs amis très bizarres. Option vicieuse : quelques espions de Belial dans les parages repèrent les nouveaux venus ; il faut s'en débarrasser avant qu'ils ne préviennent le prince.
Juste avant le départ, un homme grand, large d'épaules, aux cheveux blond presque blanc se présente : « Gabriel, archange du feu », venu observer. L'agresser est une mauvaise idée. Il demande à les accompagner, reste en retrait et traverse les combats sans que personne ne s'en inquiète (c'est Satan déguisé).
Timing idéal : minuit du septième jour après le transfert d'Andrealphus, début de l'invocation, quand Belial est trop concentré pour sa sécurité. Conditions de la surprise :
• Neutraliser le check point : dix soldats et deux membres de la Garde carmine.
• Éviter les trois patrouilles du volcan (chacune un membre de la Garde carmine et trois démons de base).
• Piste carrossable en lacets : couper les moteurs et finir à pied le dernier kilomètre.
Récapitulatif des forces (PS individuelles) : Andromalius 5 démons (25) et 5 anges (30) ; Ange 3 anges vaudouisants (30) et Ignace (30) ; Baalberith : pas de surprise, Belial +200* ; Aphte : Belial −200 ; Baskin Robbins : rien ; Boul'Mich 3 démons (22) et jusqu'à 40 cannibales (1,5) ; Chez Régis 3-4 démons (20, 21, 18, 20) ; Crocell 3 grade 3 (27) et 7 démons (21) ; Centre de Tri Gilbert (26) ; Deprofundis (28) et 3 zombies (8) ; Furfur 5 démons (24) et 12 teufeurs (1,5) ; Marie-Jolie (38), deux corbeaux (15), Thomas Hobbes (40), 10 démons (30), 12 anges (30) ; Ouikka armes pour 12 PS ; Paulo et Rotka : pas de surprise, Belial +200* ; Penthouse 69 : argent ; Le Professeur +3 colonnes en stratégie ; Sechepine 12 lapins (20) ; sorciers : rien ; zombies des galeries 10 zombies (6) ; U-Boat Crew Marguerite (26) ; Uphir 10 démons (18). (* non cumulatif.)
Ajuster selon les scénarios précédents (moins de cannibales si le Boul'Mich a été décimé pendant « Nuit bleue »…). Une armée bien montée dépasse 2 000 PS, hors PJ (à calculer).
Belial : 25 Garde carmine (PS 28), 50 démons de base (PS 20), 3 camions blindés (PS 30), 5 vans blindés à lance-flammes (PS 33) = 1 955 PS.`,
    [inScene(soldats, { qty: 10 }), inScene(garde, { qty: 2 }), inScene(brule, { qty: 3 })], true,
    [choice('surprise', 'Les PJ arrivent-ils sans être repérés ?', [
      ['Oui, surprise préservée', 'L\'effet de surprise compense la position de Belial : résoudre en « Bataille rangée » (pertes +20 % pour les deux camps).'],
      ['Non (alerte, patrouille, Baalberith ou Rotka)', 'Résoudre en « Assaut » : la puissance de Belial compte double pour les dommages et les PJ subissent +10 % de pertes.'],
    ])]),
  scene('bataille', '10. Baston sur le puy de Dôme', 'Cratère du puy de Dôme – jour 10, minuit',
    `Lune haute, lueur rouge montant du cratère, incantations déformées par l'écho, chaleur croissante. Mêlée générale : lance-flammes, armes automatiques, acide et jets de glace. En contrebas, sur le plateau : une trentaine de sorciers encapuchonnés de rouge psalmodient ; Belial chante au centre, en sueur, extatique ; aux pointes du pentacle, des jeunes filles nues égorgées ; la rune palpite au rythme d'une lueur rouge dans le ventre d'Andrealphus, attachée sur l'autel, hurlante. Il faut percer vers l'escalier : Thomas Hobbes (« Leviathan ») manœuvre pour ouvrir la voie ; reste un groupe de démons de Belial couverts de sang.
Les anges de Michel n'interviennent que si la situation est vraiment désespérée. La victoire des PJ n'est pas nécessaire pour la suite.
Climax : Belial lève les bras et hurle « Oui ! » ; la terre tremble, le volcan crache lave et fumée noire chargée de scories, les sorciers s'enfuient. « Gabriel » apparaît près d'Andrealphus et la prend dans ses bras. Si les PJ ont les moyens de battre Belial en combat singulier, les laisser faire ; sinon, au bout d'un ou deux tours, Baal (treillis noir, cravate Mickey) apparaît, sort une longue épée rouge, nargue Belial et le tue en quelques secondes.
Les serviteurs de Belial cessent le combat. Un homme à l'épée de flammes rejoint les PJ : « Bonjour, je suis Gabriel ». Le faux Gabriel a disparu avec Andrealphus ; le vrai jure et disparaît à son tour. Les PJ restent seuls au milieu des cadavres, le volcan sur le point d'exploser.

${CASUS}`,
    [inScene(garde, { qty: 4 }), inScene(brule, { qty: 8 }), inScene(sorciers, { qty: 6 }), inScene(belial)], true,
    [choice('belial', 'Qui tue Belial ?', [
      ['Les PJ, en combat singulier', 'Gloire immense ; Baal se contente d\'un sourire.'],
      ['Baal', 'Baal l\'exécute en quelques secondes à l\'épée rouge.'],
    ]),
    choice('issue', 'Quelle issue pour la bataille ?', [
      ['Victoire des forces des PJ', 'Les survivants de Belial se rendent ou fuient dès la mort de leur prince.'],
      ['Déroute des PJ', 'Pas grave pour la suite : Baal intervient quand même, et l\'éruption balaie tout le monde.'],
    ])]),
  scene('bourboule', '11. Épilogue : une fin du monde de plus', 'Route du puy de Dôme à La Bourboule – nuit',
    `Des joueurs malins comprennent que c'est Satan qui leur a joué ce tour et foncent à La Bourboule, où Dieu passe ses vacances. Sinon, Baal reconnaît Lucifer et se demande à voix haute ce qu'il faisait là : il lui avait murmuré avoir « un petit problème à régler » avant de prendre sa retraite… « Il n'irait quand même pas rendre visite à Dieu ? » Une trentaine de kilomètres.
Course contre le volcan en éruption : séismes, scories qui explosent, fumée noire brûlante qui calcine les poumons ; les morts se comptent par centaines, voire par milliers. Péripéties :
• Un chêne centenaire en travers de la route : contourner par le flanc (test de Conduite très difficile) ou dégager à plusieurs (Force totale de 20).
• Tempête de neige soudaine, même en août : deux colonnes de malus aux tests de Conduite.
• Une jeune femme paniquée avec son bébé se jette devant la voiture : test de Conduite pour l'éviter ; s'arrêter pour la prendre fait perdre du terrain.
Arrivée : Satan et Gabriel, silhouettes nimbées de lumière sur une colline enneigée, Andrealphus à terre, à demi consciente. Gabriel refuse de détruire la Création ; Samaël, épuisé, explique que celui qui règne sur Dis doit avoir une foi pure et que l'épée de feu a été conçue pour cela, depuis le début. Il s'agenouille et offre son cou, demandant le pardon de Dieu.
Gabriel le décapite, puis s'effondre : son épée est la seule arme capable de tuer définitivement un ange ; Dieu les a créés par paires, l'un ne vit pas sans l'autre ; Samaël pensait que les PJ sauraient sauver le monde ; l'Univers ne peut exister si le trône des Enfers est vide. Éclair aveuglant : les deux frères ont disparu, l'épée de Gabriel reste plantée dans la neige. Le cosmos commence à se disloquer.`,
    [inScene(samael), inScene(gabriel), inScene(andrealphus)]),
  scene('fin', '12. C\'est la fin du monde…', 'Colline enneigée près de La Bourboule – aube',
    `Ciel embrasé, étoiles aveuglantes qui tombent, abîmes qui s'ouvrent dans le ciel et la terre, une comète pulvérise la montagne voisine. Andrealphus hurle, larmes de sang, ventre déformé et écarlate.
Pour sauver leur peau et le monde, les PJ doivent tuer le prince du sexe : chaque pas coûte des siècles, l'Univers résiste, les démons se sentent devenir transparents. Une fois en main, l'épée de Gabriel s'enflamme et pénètre sans peine la chair du prince. Éclair, oreilles qui saignent, le volcan s'est tu, plus de neige.
À la place d'Andrealphus : un garçon d'environ treize ans, nu, longs cheveux presque blancs, yeux comme des gouffres. Lucifer (Damien) déclare que Samaël est mort et que son pouvoir est le sien, promet de récompenser les PJ et disparaît par une brèche vers l'Enfer. Quelque part, un vieillard dans une chambre d'hôtel rit doucement.
Un petit postier fait signer un formulaire aux PJ, range l'épée dans un tube en carton et repart en mobylette en chantant « The End ». L'Univers se remet à tourner dans le bon sens ; plus trace de l'éruption ; un oiseau siffle à l'aube.
Suite (Tempus Fugit) : jour 1, la césarienne tue Andrealphus ; Bifrons meurt et Hornet devient prince des morts en secret ; débriefing avec Gilbert. Jour 2, fin de la loi martiale. Jour 4, entrevue du jeune Satan avec Yves ; la zone de Gabriel est effacée. Jour 5, Cour exceptionnelle : Andromalius et Crocell réintégrés, Garde carmine, infiltrés et Flocons de sang dissous, Andrealphus déclaré renégat. Jour 8, Beleth va chercher la meuf dans la MRC. Jour 11, Marie-Jolie nommée prince du sexe. Jour 12, les PJ sont invités Chez Régis par le nouveau monarque, Beleth et Gilbert : explications finales et récompenses au choix (nature, avantages administratifs, pouvoirs, position), voire entrée dans l'unité secrète des démons agissant directement pour le Boss.`,
    [inScene(andrealphus), inScene(postier)], false,
    [choice('andrealphus', 'Les PJ tuent-ils Andrealphus avec l\'épée de Gabriel ?', [
      ['Oui', 'Lucifer renaît dans Damien, l\'Univers est sauvé et les PJ seront récompensés.'],
      ['Non ou trop tard', 'Le cosmos retourne au chaos premier : fin de partie (et de la gamme, selon les auteurs).'],
    ])]),
  scene('lux-aeterna', '13. Toute la misère du monde', 'Après la campagne',
    `Six postfaces au choix (ou à panacher) pour ne pas laisser les joueurs sur une chute trop abrupte (Lux Aeterna, p. 151).
Fils restés ouverts (Les cahiers du labyrinthe) :
• Les PJ : proches du grade 2, baroques et trop informés ; à faire sortir par une promotion ou à transformer en PNJ de luxe (contacts INS, adversaires récurrents à MV), voire scénario sur leur disparition.
• Le nouveau patron : Damien n'est pas Samaël ; même puissance mais ni expérience ni souvenirs, plus viscéralement mauvais. Seuls les Premiers Nés savent ; certains princes pourraient enquêter et remonter jusqu'aux PJ.
• Andromalius et Baalberith : « Lucifer » a blanchi Andromalius ; Baalberith redevenu sa carpette doit traquer… un traître qui n'est autre que lui-même (Kiel). Intrigues à tiroirs possibles.
• Belial et Crocell : sévèrement recadrés, groupuscules dissous ; la plupart des princes leur sont hostiles ; le Conseil offensif est redistribué au profit de Baal et Bifrons (Caym, Furfur et Gaziel ramassent des miettes).
• Hornet : la mort d'Andrealphus a tué Bifrons, qui lui avait cédé ses pouvoirs ; Hornet règne en secret sur les morts (Bifrons Connection). Seuls les PJ (et Yves) le savent.
• Marie-Jolie : nommée prince du sexe après une réunion de crise ; peut proposer aux PJ de la servir (scénarios politiques pour adultes).
• Beleth et la meuf : chargé de la faire disparaître, il l'a cachée dans un loft du Lupanar (MRC) et lui fait la cour ; une certaine Angela pourrait en parler à Blandine. Ménage à trois, voire à cinq avec Belial et Crocell.`,
    [], false,
    [choice('fin', 'Quelle fin pour la campagne ?', [
      ['La fin abrupte', 'Dès que l\'épée est en sécurité, on range tout : aux joueurs de déduire le reste ; le MJ peut répondre hors jeu autour d\'une bière.'],
      ['La fin descriptive', 'Retour au Centre de Tri : Monsieur Fabien débriefe toute la campagne, façon Hercule Poirot dévoilant le coupable.'],
      ['La fin festive', 'Grande beuverie Chez Régis : sangliers aux airelles, Jésus en tablier humoristique, Furfur ligoté derrière une baffle, princes et archanges qui tapent dans le dos des PJ.'],
      ['La fin glorieuse', 'Quelques semaines plus tard, convocation au Harry\'s Bar par Fabien et un beau jeune homme : Damien remercie les PJ et leur propose de rejoindre l\'unité d\'élite qui œuvre directement pour le Grand Chef.'],
      ['La fin méta', 'Le Centre de Tri est désert ; sur le bureau de Fabien, les nouvelles de conclusion du livre, à faire lire aux joueurs.'],
      ['La fin méta-méta', 'Le Centre de Tri est désert ; au sous-sol, une table de jeu, un paravent et, derrière, les deux volumes de Fire and Ice à leur donner.'],
    ])]),
];

const scenario = {
  id: 'fire-and-ice-16-fin-du-monde',
  nom: 'Fire and Ice (scénario 16) – Le jour où nous sommes allés voir la fin du monde',
  resume: `Dies Irae, scénario 16 (INS), final de la campagne Fire and Ice. Andrealphus, capturée par la Garde carmine, appelle les PJ au secours depuis Montgrumeau (Cantal) ; depuis le sort de Hornet, toutes les créatures surnaturelles ressentent la douleur. Fausses pistes (ovni, vaches malades, Cantal.net), embuscade, base militaire noyautée, puis découverte du rituel de Belial dans le cratère du puy de Dôme. Les PJ lèvent une armée en sollicitant tous leurs alliés de la campagne, livrent une grande bataille (règles « Casus Belli »), assistent à la mort de Belial, puis rattrapent Satan et Gabriel à La Bourboule : Gabriel tue Samaël, les PJ doivent tuer Andrealphus avec l'épée de l'archange et Lucifer renaît dans Damien.`,
  notes: `Source : ${REF}. Aides de jeu utilisées : « Casus Belli » (p. 157-159, résumé dans la scène 10), tableau de puissance des troupes (p. 136-137, scène 9), « Lux Aeterna » (p. 150-152, scène 13), « Tempus Fugit » (p. 152-154), « Dramatis Personae » (p. 155-156 : fiches de Marie-Jolie et Hornet).
Trois parties : 1) Montgrumeau (enquête, embuscade, base) ; 2) le volcan et la diplomatie (lever une armée à Paris) ; 3) la bataille, la course vers La Bourboule et la fin du monde.
Règle spéciale : les démons (et tous leurs adversaires surnaturels) ressentent la douleur comme des humains pendant tout le scénario.

Récompenses : le livre ne donne pas de PA ; au jour 12, le nouveau monarque des Enfers offre aux PJ les récompenses de leur choix (nature, avantages administratifs, pouvoirs, position) et leur propose de servir directement le Boss. Gilbert a sans doute encore une Accolade du Respect en réserve.

Chronologie (Tempus Fugit) : J-2 mois, le démon de Malthus commence à empoisonner les vaches ; J-1 mois, le premier démon de Belial s'incarne et élimine les officiers ; J-3 semaines, Yolande Jolimont se planque chez les gitans du Cantal ; J-3 jours, repérée par la Garde carmine, elle fuit, les Belial déclenchent un incendie de forêt (rumeur d'ovni), l'armée boucle le secteur ; J-2 jours, fausses preuves du crash ; J1, Hornet lance son sort de douleur, les PJ partent dans le Massif central ; J2-3, enquête à Montgrumeau, vétérinaire de Malthus ; J3-5, piste jusqu'à Vulcania, découverte de la plate-forme d'invocation ; J3-10, levée des troupes ; J10, minuit, invocation, bataille, mort de Belial, enlèvement d'Andrealphus par Satan, course à La Bourboule, exécution de Lucifer et sauvetage du monde. Suite des événements : voir la scène 12.

Mystères de la campagne (Lux Aeterna, « Les cahiers du labyrinthe ») : voir la scène 13.

Fiches : Monsieur Fabien et Gilbert reprennent la fiche du Centre de Tri (Fire and Ice, p. 24-26). Garde carmine : fiche de « Run like Hell » (p. 65), comme le suggère le texte. Marie-Jolie et Hornet : fiches de prince (Dramatis Personae). Les alliés des PJ ne figurent dans aucune scène de combat ; la bataille se résout avec Casus Belli. Valeurs estimées signalées dans chaque fiche.`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [fabien, gilbert, laura, ferdinand, szymkowiak, lazaros, brule, garde, soldats, malthus, sorciers, belial, andrealphus,
  marieJolie, hobbes, hornet, girfalko, cassis, strauss, skins, flics, gabriel, samael, postier].map(asType);

const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));

writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types,', scenes.reduce((a, s) => a + s.choix.length, 0), 'choix');
