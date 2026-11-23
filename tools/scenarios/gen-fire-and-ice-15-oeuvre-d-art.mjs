// Génère le fichier d'import « insmv-scenario » pour « De l'œuvre d'art à l'époque de sa reproductibilité technique »
// (Fire and Ice 2, p. 110-123, + « Fluctuat Nec Mergitur » p. 98-109 et Tempus Fugit p. 152-154)
// usage : node gen-fire-and-ice-15-oeuvre-d-art.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Fire and Ice 2, « De l\'œuvre d\'art à l\'époque de sa reproductibilité technique », p. 110-123';
const L = (s) => R.parseLvl(String(s)); // « 2+ » → 5
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
let n = 0; const id = (p) => `fi15-${p}`;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [{ n: 'Coup de poing', att: 2, prec: 0, puis: -3, melee: true }], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});

// ---------------- Fiches du Centre de Tri (objet FICHES de fix-centre-de-tri.mjs, repris tel quel) ----------------
const pw = (s) => s.split(', ').map((x) => { const m = x.match(/^(.*?) (\d\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 }; });
const carF = (s) => { const v = s.split(' ').map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const REF_CDT = 'Fire and Ice, « Le Centre de Tri », p. 24-26';
const FICHES = {
  fabien: { nom: 'Monsieur Fabien', source: 'Démon de Baalberith, grade 2 (chef du Centre de Tri)', type: 'demon', car: carF('2 2 5 4 2 4'), def: 2, pp: 24, pfFix: 6, seuilsFix: [4, 8, 12, 16],
    armes: [{ n: 'Coup de poing', att: 2, prec: 0, puis: -3, melee: true }],
    pouvoirs: pw('Message officiel, Télépathie 5, Boomerang 3, Cauchemar 3, Onde de choc 2, Téléportation 2, Corps gazeux, Détection du futur proche 2, Volonté supra-normale 2'),
    talents: 'Métier (administration) 7, Discussion 6, Baratin 4 ; avantage matériel : le Centre de Tri',
    note: 'Vétéran débonnaire, pipe, anecdote laponne. Secret : remplacé par Beleth (« le Grand Imposteur ») quelques semaines après l\'arrivée des PJ.' },
  gilbert: { nom: 'Gilbert', source: 'Démon de Morax, grade 1 (Centre de Tri)', type: 'demon', car: carF('3 2 4 4 3 3'), def: 2, pp: 18, pfFix: 7, seuilsFix: [5, 10, 15, 20],
    armes: [{ n: 'Coup de poing', att: 2, prec: 0, puis: -3, melee: true }],
    pouvoirs: pw('Œuvre d\'art, Télépathie 4, Jet de flammes 2, Sommeil 2, Invisibilité 1, Vitesse 1, Vol 1'),
    talents: 'Tartiner de la poésie 7, Trier du courrier 3, Conduite 4, Pilotage 3, Tir 2+ ; avertissement sans frais : gentil',
    note: 'Délégué CGT, gardien des lettres non distribuées, poète médiocre, habitué de Chez Régis ; bavard une fois éméché. Secret : s\'est perdu un jour dans un dédale lumineux sous les caves.' },
};
const fiche = (key, f, notes) => ({
  id: id(key), nom: f.nom, source: f.source, type: f.type, qty: 1, car: { ...f.car }, def: f.def, prot: 0, pfFix: f.pfFix, pp: f.pp, seuilsFix: [...f.seuilsFix],
  armes: JSON.parse(JSON.stringify(f.armes)), pouvoirs: JSON.parse(JSON.stringify(f.pouvoirs)), talents: f.talents, esquive: false, volonte: false,
  notes: [notes, f.note, `Caractéristiques : ${REF_CDT}.`].filter(Boolean).join('\n'),
});

const fabien = fiche('fabien', FICHES.fabien, 'Dans ce scénario : Beleth a révélé sa vraie identité dans « Interzone » et occupe toujours le corps de Fabien. Avec Gilbert et une dizaine de serviteurs de Baal, il tente de regrouper les démons parisiens dans un Centre de Tri ravagé ; il voudrait mettre la main sur Satan, mais n\'a pas une minute à consacrer aux PJ.');
const gilbert = fiche('gilbert', FICHES.gilbert, 'Dans ce scénario : seconde Beleth/Fabien pour réorganiser les démons parisiens au milieu des ruines du Centre ; aucune aide concrète pour retrouver la rue Lucifer.');

// ---------------- PNJ : Paris ----------------
const angeYves = npc('ange-yves', {
  nom: 'L\'ange d\'Yves de Chez Régis', source: 'Ange d\'Yves, habitué de Chez Régis', type: 'ange', armes: [],
  notes: 'Si les PJ interrogent les habitués sur la rue Lucifer, il leur apprend qu\'ils ne sont pas les seuls à avoir vécu ce genre de phénomène. Sa théorie : Paris est vivante, à demi consciente, et parle à travers ses éléments typiques (clochards, graffitis, cabines téléphoniques…). Il a raison, mais cela n\'aide pas encore les PJ.\nFiche minimale (pas de caractéristiques dans le livre).',
});
const harangueur = npc('harangueur', {
  nom: 'Le prêcheur de la place du Tertre', source: 'Humain, illuminé à col Mao', armes: [],
  talents: 'Pouvoirs de mage urbain possibles (adaptation, voir notes) : Les rebuts se rebiffent, Connaissance de la rue',
  notes: 'Quinquagénaire barbu en costume à col Mao vert d\'eau poussiéreux, juché sur un cageot : il mélange chansons sur Paris et prophéties sur le Diable venu sur Terre. Réponses incompréhensibles et cryptiques.\nSi les PJ emploient la manière forte, une dizaine de clochards au regard vide s\'interposent sous les yeux des touristes.\nAdaptation : le livre ne le dit pas, mais il peut servir de porte-voix de la Ville ou de mage urbain (voir « Fluctuat Nec Mergitur » dans les notes du scénario) ; pouvoirs absents des règles, laissés dans les talents.\nFiche minimale (pas de caractéristiques dans le livre).',
});
const clochards = npc('clochards', {
  nom: 'Clochards au regard vide', source: 'SDF parisiens manipulés par la Ville', qty: 10, car: car('2 2 2 1 1 1'), def: 2,
  armes: [{ n: 'Coup de poing', att: L(2), prec: 0, puis: -3, melee: true }],
  talents: 'Corps à corps 2, Survie (rue) 3',
  notes: 'S\'interposent en silence si l\'on brutalise le prêcheur ; ils ne cherchent pas à tuer, seulement à protéger.\nCaractéristiques non fournies par le livre : valeurs estimées d\'humains ordinaires affaiblis.',
});
const caricaturiste = npc('caricaturiste', {
  nom: 'Le caricaturiste nordique', source: 'Jeune peintre de la place du Tertre', armes: [],
  talents: 'Dessin (fusain) 2 : maladroit, mais montre la vraie nature des modèles',
  notes: 'Jeune homme d\'une maigreur maladive, regard inexpressif, peau marbrée de plaques rouges ; aucun touriste ne s\'arrête devant lui. Ses fusains malhabiles mettent mal à l\'aise : il dessine ce qu\'il « ressent ». Le policier du carrefour apparaît sur sa toile avec des ailes et une épée (c\'est bien un ange de Laurent).\nParle un français laborieux avec un fort accent nordique, ne sait pas pourquoi ses dessins sont si « réalistes ».\nPortrait des PJ en quelques minutes : ils y sont représentés en démons ; un PJ de Perception surnaturelle (supérieure à 3+) remarque que les traits gras dessinent un plan en filigrane (vers l\'impasse).\nFiche minimale (pas de caractéristiques dans le livre).',
});
const flicAnge = npc('flic-ange', {
  nom: 'Le policier du carrefour', source: 'Ange de Laurent en faction', type: 'ange', armes: [],
  notes: 'En faction au carrefour de la place du Tertre ; modèle du caricaturiste. Un moyen de détection quelconque confirme que c\'est un ange au service de Laurent. Rien ne l\'oblige à intervenir : à éviter plutôt qu\'à affronter.\nFiche minimale (pas de caractéristiques dans le livre).',
});
const chauvesSouris = npc('chauves-souris', {
  nom: 'Nuée de chauves-souris du puits', source: 'Bestioles du puits sous la rue Lucifer', type: 'monstre', qty: 20,
  car: car('1 3 3 1 1 1'), def: 2, pfFix: 1,
  armes: [{ n: 'Morsure (effet de Douleur 1)', att: L('2+'), prec: 0, puis: 0, melee: true }],
  talents: 'Corps à corps 2+, Vol',
  notes: 'Une bonne vingtaine, 1 PF chacune. Se battre accroché à l\'échelle impose trois colonnes de malus aux actions offensives des PJ.\nMorsure (Corps à corps 2+, dommages +0) : mêmes effets que le pouvoir Douleur niveau 1 ; test d\'Agilité (avec les quatre colonnes de malus de la douleur) pour ne pas lâcher l\'échelle et entraîner les autres dans sa chute.\nCaractéristiques autres que l\'attaque et les PF non fournies : valeurs estimées. Défense non donnée : 2.',
});

// ---------------- PNJ : habitants de la rue Lucifer (simulacres créés par le fantasme de Satan) ----------------
const hab = (key, o) => npc(key, { armes: [], ...o, notes: [o.notes, 'Simulacre : un des humains imaginés par Satan pour peupler son délire.', 'Fiche minimale (pas de caractéristiques dans le livre).'].join('\n') });
const durand = hab('durand', {
  nom: 'Monsieur et Madame Durand', source: 'Bouchers de la rue Lucifer', qty: 2,
  notes: 'Couple lyonnais sans enfant d\'une cinquantaine d\'années. Elle, ronde et rose, tablier immaculé, regard absent, tient la caisse ; elle se méfie, car elle a compris un soir que la viande n\'était pas normale et se tait depuis que les affaires prospèrent. Lui, corpulent, chauve, moustache poivre et sel, index droit arraché par la machine, tablier taché de sang : il débite de la chair humaine sans s\'en rendre compte (il croit tailler du bœuf). Ferment à 21 h 30 et vont au cirque.\nL\'abattoir de la boucherie est un des trois passages vers la rue.',
});
const pariet = hab('pariet', {
  nom: 'Famille Pariet (boulangerie Au bon pain)', source: 'Boulangers de la rue Lucifer', qty: 4,
  notes: 'Couple de sexagénaires, fils aîné de 27 ans chocolatier, et deux vendeuses : Rosine (quarantaine fatiguée, sympathique) et Yu (vingt ans, jolie, très incompétente).\nProblème : le cadet, 15 ans, environ 150 kg, boulimique, terrorise la maison : privé de viennoiseries, il pique des crises de larmes qui ameutent la rue ; la mère le surprotège et accuse le père, qui cuit sans arrêt pour le nourrir et noie sa peine dans la Suze. Le soir, le frère aîné pousse son fauteuil roulant jusqu\'au cirque.\nSolution (une des deux plus difficiles) : le retirer à sa famille pour le confier à un médecin… ou le tuer.',
});
const hadot = hab('hadot', {
  nom: 'Monsieur Hadot et Djamel', source: 'Épicier (vieux Félix Potin) et son commis', qty: 2,
  notes: 'Hadot : sexagénaire en blouse grise et casquette à carreaux, mâche un vieux chewing-gum, se croit drôle et accable ses clients de conseils sarcastiques. Ancien d\'Algérie.\nDjamel : 19 ans, petit, malingre, énorme touffe frisée, d\'une maladresse chronique. Son patron l\'humilie en public, et chaque soir après la fermeture (22 h 30) le maltraite (brûlures de cigarette, coups de ceinture) ; tout le quartier le sait et se tait. Djamel va ensuite au cirque.\nProblème à résoudre : faire cesser les sévices.',
});
const cure = hab('cure', {
  nom: 'Le curé de la rue Lucifer', source: 'Ange de Guy, prêtre de l\'église désaffectée', type: 'ange',
  notes: 'L\'église pseudo-gothique aux vitraux condamnés n\'a plus aucun pouvoir. Le prêtre est un des rares à avoir conscience de revivre la même nuit. Trop fier pour l\'admettre et trop lâche pour enquêter, il s\'est réfugié au presbytère après avoir vu les statues des saints danser de façon obscène.\nInterrogé, il se dit ange et prétend maîtriser la situation ; poussé un peu, il s\'effondre en larmes. Il entend chaque soir la petite Claudine en confession, mais n\'ose pas s\'en prendre à son père, le notable le plus respecté du quartier.\nProblème à résoudre : lui rendre le courage d\'agir (en mettant fin aux crimes de M. de Monsac, il règle deux problèmes d\'un coup).',
});
const regis = hab('regis', {
  nom: 'Régis et Marion (bar Chez Régis)', source: 'Patron breton du bar et sa fille', qty: 2,
  notes: 'Régis, Breton en perfecto et banane, fan de Johnny ; bar décoré aux couleurs de la Bretagne. Habitués imbibés devant le même match de foot chaque soir, encore moins conscients que les autres que quelque chose cloche.\nMarion, 17 ans, idolâtre Lorie et en fredonne les chansons ; boulimique, elle se fait vomir après chaque repas et se mutile quand elle a « trop » mangé (son péché mignon : l\'éclair au café de la boulangerie), musique à fond pour que son père ne l\'entende pas.\nProblème (un des deux plus difficiles) : lui rendre confiance en elle, par exemple en se faisant passer pour un producteur qui veut lui faire enregistrer un disque.',
});
const robert = hab('eric-robert', {
  nom: 'Éric Robert', source: 'Veilleur de nuit de l\'imprimerie Lebowski',
  armes: [{ n: 'Matraque (non-létale)', att: L(2), prec: 0, puis: 1, melee: true }],
  notes: 'Petit homme sec d\'environ 35 ans, coupe militaire, treillis noir et coupe-vent « Sécurité Associates 88 », Maglite et matraque. Dort tout le temps.\nPendant son sommeil, les jumeaux Crocus amènent le petit Martinez à l\'imprimerie, l\'attachent aux machines et le mutilent ; ensuite les machines s\'animent et dévorent le corps pendant que les gamins filent au cirque.\nLe vrai problème n\'est pas le lynchage mais l\'inaction du vigile : si les PJ se contentent d\'arrêter les gamins, les machines se vengent en dévorant le veilleur. Il faut qu\'il intervienne lui-même.\nMatraque : arme citée par le livre, valeurs de la matraque des règles.',
});
const monsac = hab('monsac', {
  nom: 'Famille de Monsac', source: 'Notables de la rue (hôtel particulier XVIIe)', qty: 2,
  notes: 'Monsieur, dernier rejeton d\'une noblesse désargentée enrichi dans l\'immobilier, généreux, collectionneur de voitures de sport ; Madame, présidente de l\'association de quartier, fait et défait les réputations. Cinq enfants polis : Agnan (12 ans), Hugues (11), Venceslas (10), Marc-François (9) et Claudine (8).\nSecret : le père abuse de Claudine chaque soir pendant que Madame dort sous somnifère et que la bonne emmène les garçons au cirque ; il la conduit ensuite se confesser à l\'église, puis ils vont au spectacle.\nProblème à résoudre : Claudine (le curé peut y mettre fin, voir sa fiche).',
});
const crocus = hab('crocus', {
  nom: 'Famille Crocus (Jean-Marie et Bruno)', source: 'Jeunes retraités de la fonction publique et leurs jumeaux de 15 ans', qty: 2,
  notes: 'Parents cinquantenaires, militants d\'une France « pure » ; leurs jumeaux Jean-Marie et Bruno sont de petits nazillons en herbe. Ce sont eux qui torturent le petit Martinez à l\'imprimerie Lebowski avant d\'aller voir les magiciens et les clowns.',
});
const martinez = hab('martinez', {
  nom: 'Famille Martinez', source: 'Concierges du plus grand immeuble de la rue', qty: 2,
  notes: 'Sympathiques et ouverts ; Miguel, 13 ans, joue à la « racaille » (mauvais rap, joggings sales) ; une grande fille étudie les fossiles dans le Sud. C\'est le petit Martinez que les jumeaux Crocus lynchent à l\'imprimerie.\nÉpilogue : le réceptionniste de l\'hôtel miteux ressemble trait pour trait à M. Martinez.',
});
const clocharde = hab('clocharde', {
  nom: 'La jeune clocharde', source: 'Vagabonde sans nom de la rue Lucifer (« la meuf de la MRC »)',
  notes: 'Peau très mate, longs cheveux noirs, lourde parka rouge et short bleu ; erre dans les rues sans même connaître son prénom.\nAvant le spectacle, Belial (le cracheur de feu) la rencontre, l\'invite au cirque et en tombe amoureux ; pendant le numéro, elle discute passionnément avec Crocell, sous l\'œil amusé de Malphas ; Crocell l\'enlace, elle le repousse et s\'enfuit en pleurs. Andrealphus la recueille alors dans sa roulotte pour un café.\nUne fois informé de la « trahison » de son frère, Belial l\'enlève devant Andrealphus et l\'attache dans sa roulotte.\nSuite (Les cahiers du labyrinthe) : Beleth est chargé de la faire disparaître mais la cache dans le Lupanar de la MRC.',
});
const autres = hab('autres-habitants', {
  nom: 'Autres habitants de la rue', source: 'Mamedi, Declancy, Menon et Grossman, Osberg, Dulong…', qty: 6,
  notes: 'Mère seule Mamedi et ses deux petits métis Samuel (2 ans) et Isaac (1 an), qui attendent le père en prison pour trafic de shit ; Robert Declancy, lecteur chez un grand éditeur, qui corrige la nuit sur la place le manuscrit d\'un auteur de romans zoophiles (clin d\'œil à Hakim Izmet) ; Joséphine Menon (peintre dépressive) et Luc Grossman (employé chez Quick) ; Georges-Louis Osberg, Espagnol solitaire biographe d\'un auteur fantastique ; Sylvie Dulong, 23 ans, blonde ardéchoise, thèse sur les monstres de la littérature.\nLe MJ est libre d\'en inventer d\'autres en s\'inspirant de scénarios précédents ou de personnes réelles : tous ne sont que des fantasmes de Satan.',
});

// ---------------- PNJ : Santa Claws Circus (caricatures des princes-démons) ----------------
const PRINCE = 'Caricature d\'un prince-démon : mêmes caractéristiques et pouvoirs que le prince réel (non chiffrés dans le livre), aucune chance pour les PJ en combat.';
const emp = (key, o) => npc(key, { type: 'demon', armes: [], ...o, notes: [o.notes, PRINCE, 'Fiche minimale.'].join('\n') });
const pantin = emp('pantin', {
  nom: 'Le pantin au bonnet de père Noël (Satan)', source: 'Satan lui-même, « maître » du cirque',
  notes: 'Pantin de bois pourri de la taille d\'un enfant de dix ans, rictus haineux, cornes rouges sous un bonnet de père Noël sale, sur un trône de velours fané. Le rue Lucifer est la manifestation de son inconscient : Samaël, déprimé de s\'être découvert simple pion du plan divin, s\'est terré depuis un mois dans un hôtel miteux entre Montmartre et Château Rouge.\nÀ la fin du spectacle, le public vote : grâce (= exécution) ou non. S\'il est décapité, Satan « démissionne ».',
});
const loyal = emp('loyal', {
  nom: 'Monsieur Loyal', source: 'Présentateur du cirque (Nybbas, d\'après l\'ordre d\'apparition)',
  notes: 'Pantalon crème, mocassins à glands, costume élégant, visage poupin à la Jean-Pierre Foucault ; harangue le public par-dessus la musique, commente les numéros et organise le vote final.\nIdentité de prince déduite de la liste du livre (par ordre d\'apparition), non explicite.',
});
const beleth = emp('beleth-cirque', {
  nom: 'L\'homme à la pipe (Beleth)', source: 'Beleth, employé du cirque sans tâche précise',
  notes: 'Le spectateur assis à côté des PJ, qu\'ils n\'avaient pas remarqué, qui bourre sa pipe pendant le dernier numéro. Il leur conseille de fouiner du côté des forains, qu\'il y a une logique derrière tout ça, de prendre des notes et d\'aider les gens du quartier à contre-emploi pour changer le résultat du vote, puis attaque une anecdote laponne des années 70.\nLes nuits suivantes, il erre entre les roulottes en fumant ; il ne sait rien de plus, mais sert de joker au MJ pour remettre les joueurs sur la piste. Ravi de leur raconter encore l\'anecdote de Monsieur Fabien.\nAllié : ne pas l\'inclure dans un combat.',
});
const bifrons = emp('bifrons', {
  nom: 'Elvis (Bifrons)', source: 'Bifrons, hercule du cirque',
  notes: 'Elvis de la fin, gras et suant dans son costume blanc à brillants : tours de force (parpaings, chaînes, haltères, table entre les dents) en chantant les standards du King, puis s\'effondre épuisé en coulisses. Aide aussi l\'infirmier à évacuer les blessés.\nEn coulisses : vocalises dans sa roulotte, puis un appel téléphonique le rend fixe et raide (« Oui, Maître ») ; il réunit Malthus, Crocell, Vephar, Shaytan, Samigina, Uphir et Ouikka pour comploter : prendre le cirque et se voir sur le trône. Quand il est seul, toute intelligence quitte son visage.\nÀ l\'exécution, il éclate d\'un rire dément et jette son déguisement (indice : Hornet manipule Bifrons, cf. la fin de la campagne).',
});
const belial = emp('belial', {
  nom: 'Le cracheur de feu (Belial)', source: 'Belial',
  notes: 'Torse nu bronzé et musclé, pantalon de cuir, bottes, borsalino noir ; crache des flammes qui sculptent formes et visages, puis fait fondre en ricanant des statues de glace à l\'effigie de son frère. Heurte l\'épaule de Crocell en sortant de piste.\nAvant le spectacle, rencontre la jeune clocharde et en tombe amoureux. S\'il apprend (de la bouche de Malphas) que Crocell « drague sa meuf », il l\'enlève devant Andrealphus et l\'enferme dans sa roulotte ; à l\'exécution, il se jette sur Crocell.',
});
const crocell = emp('crocell', {
  nom: 'L\'homme à la baignoire gelée (Crocell)', source: 'Crocell',
  notes: 'Vingtaine, cheveux blond presque blanc, simple maillot de bain bleu ; ressemble aux statues de glace. Se moque du numéro précédent, se fige dans un bloc de glace dans sa baignoire, puis tire de ses mains de petites sculptures de glace ; reste dans un coin de la piste jusqu\'à ce que la glace fonde.\nDispute la jeune clocharde à Belial (ils se toisent en silence quand ils se croisent).',
});
const andrealphus = emp('andrealphus', {
  nom: 'L\'assistante du lanceur de couteaux (Andrealphus)', source: 'Andrealphus',
  notes: 'Grande, longs cheveux noirs, peau très blanche, body de dentelle rouge et noire ; attachée tête en bas sur la roue, entaillée à chaque lancer, elle semble y prendre plaisir.\nVit dans la même roulotte que Baal (armes, bodys). Indice à remarquer : elle n\'a pas l\'air enceinte. En début de soirée, Malthus lui apprend à l\'infirmerie qu\'elle est enceinte, et elle sait que l\'enfant n\'est pas de son « mari » ; elle renonce à l\'annoncer à Baal, trop mal luné. Recueille la clocharde en pleurs.\nÀ l\'exécution, elle s\'écroule en hurlant, les mains sur le ventre ; si l\'intrigue est remise en place, Baal la tue d\'un coup d\'épée dans le ventre. Sa voix appelle ensuite les PJ à l\'aide (« Montgrumeau »).',
});
const baal = emp('baal', {
  nom: 'Le lanceur de couteaux (Baal)', source: 'Baal',
  notes: 'Grand, massif, visage inexpressif, smoking à queue-de-pie et cravate Mickey. Numéro de lancer de couteaux sur Andrealphus (de dos au miroir, yeux bandés, deux à la fois), puis lèche ses plaies en retirant les lames.\nS\'il apprend (preuve à l\'appui : le test de grossesse de l\'infirmerie) qu\'Andrealphus est enceinte, il rentre et casse tout dans sa roulotte, assure son numéro, puis, au final, ramasse l\'épée et l\'éventre malgré ses supplications.',
});
const malphas = emp('malphas', {
  nom: 'Le devin bon père de famille (Malphas)', source: 'Malphas',
  notes: 'Quadragénaire en costume trois pièces, début de calvitie, léger embonpoint, sourire de père de famille provincial. Numéro de divination qui vire à l\'étalage public des secrets sordides du quartier (Claudine, Djamel…) sous les rires du public.\nObserve, amusé, la scène entre Crocell et la clocharde : le pousser à suivre sa nature en révélant tout à Belial suffit à lancer la machine.',
});
const malthus = emp('malthus', {
  nom: 'L\'infirmier en blouse blanche (Malthus)', source: 'Malthus',
  notes: 'Évacue les blessés sur une civière avec Elvis ; ceux-ci testent des traitements très expérimentaux à l\'infirmerie. Apprend à Andrealphus sa grossesse en début de soirée : le test de grossesse est à l\'infirmerie (preuve à aller chercher pour Baal).\nConspire avec Bifrons.',
});
const ouikka = emp('ouikka', {
  nom: 'Le clown jongleur barbu (Ouikka)', source: 'Ouikka',
  armes: [{ n: 'Cocktail Joliot-Curie (attaque multiple, lancé)', att: L('3+'), prec: 0, puis: 2, melee: false }],
  notes: 'Clown à passe-montagne d\'où dépasse une grande barbe noire : jongle avec les « cocktails Joliot-Curie » (Molotov sans mèche) du savant fou en chantonnant à la gloire de Ben Laden, puis les jette sur la foule, et un sur les PJ (Tir 3+, puissance +2, attaque multiple).\nSeule l\'attaque du cocktail est chiffrée par le livre ; le reste de la fiche est par défaut : ne pas chercher à le vaincre (prince).\nConspire avec Bifrons.',
});
const baalberith = emp('baalberith', {
  nom: 'L\'ouvreur aigri (Baalberith)', source: 'Baalberith, placeur à chapeau melon',
  notes: 'Petit bonhomme aux cheveux rares, grosses lunettes, chapeau melon, qui guide les spectateurs en marmonnant qu\'il était là le premier. À l\'exécution, il fait un croche-pied au chef de la sécurité puis lui jette un dinosaure en peluche (allusion à « C\'est mon ami et bien plus encore »).\nIdentité déduite de l\'ordre d\'apparition et du final.',
});
const andromalius = emp('andromalius', {
  nom: 'Le chef de la sécurité (Andromalius)', source: 'Andromalius',
  notes: 'Grand, mince, crâne rasé, costume noir, oreillette, lunettes noires, badge de responsable de la sécurité ; surveille l\'entrée et le spectacle. À l\'exécution, se précipite pour séparer Belial et Crocell mais s\'étale, victime du croche-pied de Baalberith.',
});
const employes = emp('employes', {
  nom: 'Autres employés du cirque', source: 'Les autres princes-démons caricaturés', qty: 6,
  notes: 'Ordre d\'apparition donné par le livre : Nog, Kronos, Mammon, Baalberith, Uphir, Andromalius, Morax, Nybbas, Furfur, Scox, Abalam, Andrealphus, Baal, Belial, Crocell, Caym, Bifrons, Gaziel, Vapula, Haagenti, Kobal, Ouikka, Malphas, Samigina, Shaytan, Valefor, Vephar, Beleth et Asmodée.\nRôles explicites : Uphir (balayeur au pic à glace et aux détergents), Vephar (homme-poisson de l\'aquarium), Samigina et Shaytan (hypnotiseur vampirique à l\'accent roumain et son « freak » couturé de plaies).\nRôles déduits (à confirmer par le MJ) : Nog (dormeur couvert de poussière) et Kronos (vieux diseur de bonne aventure à Swatch jaune : « vous allez avoir une vie intéressante »), Mammon (caissier qui accepte les paiements en nature), Morax (peintre façon Bosch à l\'oreille unique), Furfur (DJ à piercings), Scox (maigrichon à tête de psychanalyste qui astique le trône et apporte l\'épée), Abalam (fou à la camisole), Caym (dompteur sadique), Gaziel (homme aux bottes d\'égoutier et à la pluie de cendres), Vapula (savant fou clown blanc), Haagenti et Kobal (les deux clowns farceurs), Valefor (prestidigitateur au smoking bicolore et à la vierge de fer), Asmodée (homme à la roue de loterie).\nLe jeune garçon tiré au sort (place 66) s\'appelle Gabriel.',
});

// Le bestiaire joint (types réutilisables) : mêmes fiches, sans quantité
const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });

// ---------------- Scènes ----------------
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  scene('prologue', '1. Prologue : Paris sera toujours Paris', 'Centre de Tri ravagé et Chez Régis, Paris – jour 1',
    `Enchaîne directement sur « Interzone » : retour des Marches, et Beleth (qui a révélé être Monsieur Fabien) veut mettre la main sur Satan, qu'on sait à Paris.
Le Centre de Tri ressemble à une fourmilière éventrée, murs criblés de traces de combat. Fabien/Beleth et Gilbert tentent vaguement de regrouper les démons parisiens, épaulés par une dizaine de serviteurs de Baal : personne n'a de temps pour les PJ.
Pistes mortes : la rue Lucifer, évoquée dans les scénarios précédents, ne figure sur aucun plan ; cadastre et bibliothèques (même en supposant qu'elle ait existé jadis) ne donnent rien.
Chez Régis : personne ne sait où est Satan, mais beaucoup sont persuadés qu'il est à Paris (les PJ aussi en ont l'impression, sans preuve). Un ange d'Yves leur explique sa théorie de la Ville vivante qui communique par ses clochards, graffitis et cabines téléphoniques. Juste, mais inutile pour l'instant.
Contexte MJ : les rêves des hommes, nourris depuis des siècles, ont rendu Paris consciente dans la MRC ; la présence de Satan lui donne une migraine carabinée et elle a compris que les démons pourraient l'en débarrasser (voir « Fluctuat Nec Mergitur » dans les notes du scénario).`,
    [inScene(fabien), inScene(gilbert), inScene(angeYves)]),
  scene('montmartre', '2. Suivis par la Ville', 'Rues de Paris, puis place du Tertre (Montmartre) – jours 1 à 3',
    `Quand les joueurs tournent en rond, Paris prend contact. D'abord l'impression d'être suivis, surtout la nuit ; Détection des ennemis et pouvoirs semblables ne donnent rien ; un mouvement furtif à la limite du champ de vision. Finalement : une dizaine de rats, qui fuient dans les murs et les égouts (les capturer ou les tuer ne sert à rien).
Puis les pigeons : une douzaine d'éclopés qui fientent sur les PJ, puis s'envolent vers le centre. Suivre un vol d'oiseau à pied est difficile (compliquer la poursuite) ; ils mènent place du Tertre, parmi les touristes et les portraitistes, et redeviennent des pigeons ordinaires.
Sur la place : le prêcheur au col Mao, inutile à interroger ; si on le brutalise, une dizaine de clochards s'interposent devant les touristes ébahis.
Laisser errer les PJ, puis attirer leur attention sur le caricaturiste que personne ne regarde : ses fusains dérangeants montrent la vraie nature des modèles (le policier du carrefour en ange de Laurent, ailes et épée). Se faire tirer le portrait : les PJ en démons, et un plan en filigrane pour qui a une Perception surnaturelle (supérieure à 3+).`,
    [inScene(harangueur), inScene(clochards), inScene(caricaturiste), inScene(flicAnge)]),
  scene('impasse', '3. L\'impasse et les trois passages', 'Impasse entre Montmartre et Château Rouge',
    `Le plan mène à une impasse sale : murs noircis, affiches électorales en lambeaux, tags rouges. Sous les affiches : un vers des centuries de Nostradamus, des passages de l'Apocalypse, des signatures… et une flèche rouge « rue Lucifer » vers le mur du fond.
Satan a verrouillé sa retraite, mais Paris a ménagé trois points faibles :
• Les égouts : avec l'aide des zombies amis ou une carte, on retrouve la ruelle fermée par une grille rouillée (matériel ou Force 4+). Derrière, un puits vertigineux et une échelle branlante ; une vingtaine de chauves-souris attaquent pendant la montée (voir leur fiche : 1 PF, malus de trois colonnes sur l'échelle, morsure à effet de Douleur 1, test d'Agilité pour ne pas tomber). En haut, une plaque d'égout s'ouvre sur la rue Lucifer.
• La boucherie Durand : petit entrepôt à porte de fer cadenassée, odeur d'abattoir, pas d'électricité. À la lumière : carrelage taché de sang, carcasses humaines aux crochets dont les yeux suivent les PJ, bruits étouffés, cafards, retour du courant qui fait bouger les crochets sur leurs rails… Ambiance, aucun danger réel. Une porte mène dans la rue Lucifer, à côté de la boutique.
• Le toit : échelle au début de l'impasse, cabanon à porte vitrée, escalier sans palier d'une centaine de marches. Une cavalcade enfle au-dessus ; qu'ils attendent ou fuient, l'escalier s'effondre : 2d6 PF moins la MR d'un test d'Agilité très difficile ; ils atterrissent dans un hall d'immeuble donnant sur la rue.
Le chemin inverse est ensuite impossible (puits sans issue, abattoir à une seule porte, aucune trace d'effondrement). Dehors, nuit sans étoiles, lune basse et rousse ; pas de réseau, ni invocation de supérieur, ni Chez Régis, ni armes magiques ; plus de récupération de PP. Ils sont coincés.`,
    [inScene(chauvesSouris)], true,
    [choice('passage', 'Par où les PJ entrent-ils dans la rue Lucifer ?', [
      ['Par les égouts', 'Grille à forcer (Force 4+ ou matériel), puis combat contre la nuée de chauves-souris sur l\'échelle. Arrivée par une plaque d\'égout.'],
      ['Par la boucherie Durand', 'Pur moment d\'angoisse dans l\'abattoir, sans danger ; arrivée à côté de la boutique des Durand.'],
      ['Par le toit', 'Effondrement de l\'escalier : 2d6 PF moins la MR d\'Agilité (très difficile) ; arrivée dans un hall d\'immeuble.'],
    ])]),
  scene('rue', '4. Magique et… hermétique : la rue Lucifer', 'Rue Lucifer (fantasme de Satan) – 20 h 30, sans fin',
    `Les montres marquent 20 h 30. Ruelle tortueuse et pavée, neige épaisse sur les trottoirs mais air printanier, réverbères, odeur de lilas : un Montmartre d'Amélie Poulain filmé à travers un filtre rouge. Une mélancolie palpable (tristesse et colère). D'un côté des murs gigantesques qui se perdent dans les nuages ; s'envoler fait tourner en rond dans les nuages jusqu'à l'épuisement. En bas, la Place, ceinte de briques rouges, où se dresse un petit chapiteau rouge entouré de roulottes.
Boutiques : boucherie Durand, boulangerie Au bon pain (Pariet), épicerie Félix Potin (Hadot et Djamel), église (curé ange de Guy), bar Chez Régis (Régis et Marion), imprimerie Lebowski (Éric Robert), galerie d'art Fire & Ice, hôtel particulier des Monsac.
La galerie Fire & Ice, minuscule et sanglante, éclairée d'un néon : trois expositions, « body part » (cadavres à tous les stades de décomposition), « slow down » (voitures accidentées maculées) et « Jacques Henry » (écrans où passent les scènes de la campagne vécues, ratées ou possibles par les PJ).
Tous les habitants sont des simulacres imaginés par Satan ; chacun cache une misère. Ils se rendent tous au cirque le soir (affiches annonçant le Santa Claws Circus à minuit). Les PJ peuvent visiter le cirque avant le spectacle : voir la scène 7 pour ce qu'ils y trouvent.
Les fiches des habitants détaillent les sept problèmes à résoudre plus tard (scène 6).`,
    [inScene(durand), inScene(pariet), inScene(hadot), inScene(cure), inScene(regis), inScene(robert), inScene(monsac), inScene(crocus), inScene(martinez), inScene(clocharde), inScene(autres)]),
  scene('cirque', '5. Viens voir les magiciens : le Santa Claws Circus', 'Chapiteau rouge sur la Place – minuit',
    `Chapiteau d'une centaine de places, gradins vermoulus, éclairage halogène. Entre deux roulottes : un dormeur poussiéreux et un vieux diseur de bonne aventure gratuit. Entrée à 30 € (20 € enfant) ou paiement en nature chez le caissier souriant ; placeur aigri à chapeau melon ; balayeur couturé ; chef de la sécurité en noir ; toile peinte façon Bosch par un petit peintre à une oreille.
Ouverture : Monsieur Loyal sous la poursuite, DJ à piercings, trône où siège le pantin de Satan, astiqué par un maigrichon à lunettes.
Les numéros (résumés) : le fou à la camisole qui se libère en se disloquant ; Baal lançant des couteaux sur Andrealphus ; Belial cracheur de feu qui fait fondre des statues de glace ; Crocell figé dans sa baignoire ; le dompteur sadique et ses bêtes faméliques ; Elvis (Bifrons) et ses tours de force ; l'homme aux trous et à la pluie de cendres, qui fait trembler le sol (test d'Agilité avec deux colonnes de malus pour ne pas perdre 1 PF ; gradins effondrés, morts parmi les enfants, blessés emportés à l'infirmerie) ; les clowns (savant fou, deux farceurs cruels, jongleur barbu qui jette ses cocktails Joliot-Curie sur la foule et sur un PJ : Tir 3+, puissance +2, attaque multiple) ; le devin Malphas qui étale en public les secrets du quartier ; l'hypnotiseur vampirique et son freak ; le prestidigitateur et sa vierge de fer ; l'homme-poisson qui noie deux enfants. Le public applaudit tout.
Beleth, assis à côté des PJ, leur glisse son conseil (fouiller chez les forains, aider les habitants à contre-emploi, prendre des notes) avant de partir dans son anecdote laponne.
Final : le trône au centre, roue de loterie, tirage du numéro 66 : un petit garçon blond nommé Gabriel. On lui apporte une longue épée. Vote à main levée : qui est pour le pardon (= l'exécution) ? La première fois, l'écrasante majorité vote contre : les employés jaillissent des coulisses et massacrent le public, ruelle à feu et à sang, PJ compris. Inévitable : les employés ont la puissance des vrais princes.`,
    [inScene(loyal), inScene(ouikka)], true,
    [choice('vote1', 'Premier vote (inévitable) : que deviennent les PJ ?', [
      ['Ils subissent le massacre', 'Tous meurent : le noir, puis retour au début de la rue Lucifer à 20 h 30 (scène 6).'],
      ['Ils tentent de s\'enfuir ou de résister', 'Peine perdue face aux princes : même issue, la boucle recommence.'],
    ])]),
  scene('boucle', '6. La méthode du docteur Chestel : la boucle', 'Rue Lucifer – nuits successives',
    `Après le noir, les PJ se réveillent au début de la rue, à 20 h 30. Désormais, quiconque meurt ressuscite ainsi une fois tous les autres tués. Impossible de sortir : il faut montrer au Diable la solution de ses problèmes en étudiant la logique de son fantasme.
Première condition : que le public vote enfin le pardon. Pour cela, rendre un peu de joie au quartier en résolvant ses sept problèmes (laisser les joueurs inventer leurs moyens) :
1. Les Durand et leur viande humaine ;
2. Le gamin boulimique de la boulangerie (le plus dur : le confier à un médecin loin de sa famille, ou le tuer) ;
3. Marion, la fille du bar (le plus dur : lui redonner confiance, par exemple un faux producteur) ;
4. Le petit Martinez lynché à l'imprimerie : c'est le veilleur Éric Robert qui doit intervenir, sinon les machines le dévorent ;
5. Claudine de Monsac ;
6. Djamel, le commis de l'épicerie ;
7. Le curé, ange de Guy, à qui il faut rendre courage (en s'attaquant à M. de Monsac, il règle aussi le cas de Claudine).
Un problème résolu ne revient plus les nuits suivantes ; l'ambiance s'allège et le public devient moins passif et fasciné. Une fois les sept résolus, le public vote le pardon.
Mais cela ne suffit pas : Gabriel décapite le pantin, Andrealphus s'effondre en hurlant, Elvis éclate de rire, Belial et Crocell se battent, le chapiteau s'embrase, le ciel flambe, les murs se rapprochent, les étoiles tombent et une comète pulvérise la Place : les PJ meurent encore. Il faut aussi remettre l'intrigue en place (scène 7).`,
    [inScene(pariet), inScene(regis), inScene(robert), inScene(crocus), inScene(cure), inScene(monsac)], false,
    [choice('probleme-boulangerie', 'Comment les PJ règlent-ils le cas du gamin boulimique ?', [
      ['Ils le confient à un médecin, loin de sa famille', 'Problème résolu ; la boulangerie retrouve la paix.'],
      ['Ils le tuent', 'Ça marche aussi, même si ce n\'est pas joli.'],
      ['Ils tentent autre chose', 'À l\'appréciation du MJ ; sans solution radicale, le problème revient chaque nuit.'],
    ]),
    choice('probleme-imprimerie', 'Que font les PJ à l\'imprimerie Lebowski ?', [
      ['Ils poussent le veilleur à intervenir', 'Problème résolu.'],
      ['Ils arrêtent eux-mêmes les jumeaux Crocus', 'Les machines se vengent en dévorant Éric Robert : problème non résolu.'],
    ])]),
  scene('coulisses', '7. RSVP : les coulisses du cirque', 'Roulottes et infirmerie du Santa Claws Circus – avant minuit',
    `Chaque employé est la caricature d'un prince-démon (voir leurs fiches et la liste d'ordre d'apparition) ; les joueurs gagneront à s'intéresser à ceux qui ont joué un rôle dans la campagne.
Ce qui se passe hors piste :
• Beleth erre en fumant la pipe ; ne sait rien de plus, sert à remettre les joueurs sur la voie et à raconter l'anecdote de Monsieur Fabien.
• Bifrons, après un appel (« Oui, Maître »), réunit Malthus, Crocell, Vephar, Shaytan, Samigina, Uphir et Ouikka pour prendre le cirque ; seul, il redevient vide.
• Belial rencontre la jeune clocharde et l'invite ; pendant le spectacle, elle parle avec Crocell qui l'enlace, la repousse et s'enfuit en pleurs, sous l'œil de Malphas. Andrealphus la recueille.
• Andrealphus et Baal partagent une roulotte ; Malthus lui apprend à l'infirmerie qu'elle est enceinte d'un autre ; elle n'ose rien dire à Baal.
Pour sortir, boucher les trous de l'intrigue : Belial doit savoir que Crocell drague « sa meuf » et Baal doit apprendre la grossesse d'Andrealphus. Moyens : pousser Malphas à suivre sa nature (tout révéler à Belial), et récupérer le test de grossesse à l'infirmerie pour Baal. Annoncer soi-même les nouvelles sans preuve échoue : les employés méprisent les gens du quartier et ne croient pas un « étranger ».
Conséquences : Belial enlève la clocharde devant Andrealphus et l'enferme dans sa roulotte ; Baal casse tout chez lui puis assure son numéro normalement.`,
    [inScene(beleth), inScene(bifrons), inScene(belial), inScene(crocell), inScene(andrealphus), inScene(baal), inScene(malphas), inScene(malthus), inScene(baalberith), inScene(andromalius), inScene(employes), inScene(clocharde)], false,
    [choice('intrigue', 'Comment les PJ remettent-ils l\'intrigue en place ?', [
      ['Ils poussent Malphas à parler à Belial et rapportent le test de grossesse à Baal', 'Ça marche : grand final complet (scène 8).'],
      ['Ils annoncent eux-mêmes les nouvelles, sans preuve', 'Les employés ne les croient pas : nouveau massacre, la boucle recommence.'],
      ['Ils ne règlent qu\'une des deux intrigues', 'Final incomplet : cataclysme, mort des PJ, retour à 20 h 30.'],
    ])]),
  scene('final', '8. Le grand final et le réveil', 'Chapiteau, puis l\'impasse et l\'hôtel miteux – jours 2 à 4',
    `Une fois les sept problèmes résolus et l'intrigue remise en place : même rituel, Gabriel décapite le pantin d'un coup d'épée enflammée. Andrealphus s'écroule en se tenant le ventre, Bifrons rit et jette son costume, Belial se jette sur Crocell, Andromalius s'étale (croche-pied et dinosaure en peluche de Baalberith). Le chapiteau s'embrase, le ciel flambe, les murs se resserrent, une comète frappe la Place… et Baal ramasse l'épée et éventre Andrealphus qui le supplie. Le noir.
Réveil dans l'impasse du prologue : des tags rouges et bleus remercient les PJ. Le mur du fond est devenu la façade d'un hôtel miteux ; le réceptionniste ressemble à M. Martinez (personnel et clients ressemblent aux habitants). Le client de la chambre 666 vient de partir : grand, blond, casquette House of Pain. Chambre poussiéreuse et vide ; sur une chaise, une boule à neige figurant la ruelle et la Place, posée sur un mot élégant signé « S. » : merci, il a démissionné, inutile de le chercher sous peine de mort.
Alors, la voix d'Andrealphus résonne dans leur tête et appelle à l'aide, coupée net ; l'image d'une petite ville se superpose, panneau « Montgrumeau ». À suivre : « Le jour où nous sommes allés voir la fin du monde ».
Clé (Lux Aeterna / Tempus Fugit) : ils ont assisté à la mort symbolique du Patron et au meurtre d'Andrealphus par Baal.`,
    [inScene(andrealphus), inScene(baal), inScene(bifrons), inScene(martinez)], false,
    [choice('suite', 'Que font les PJ du message de Satan ?', [
      ['Ils cherchent à le retrouver', 'Il a promis de les tuer : aucune piste, et la voix d\'Andrealphus les appelle déjà vers Montgrumeau.'],
      ['Ils répondent à l\'appel d\'Andrealphus', 'Enchaîner sur le scénario final dans le Massif central.'],
    ])]),
];

const scenario = {
  id: 'fire-and-ice-15-oeuvre-d-art',
  nom: 'Fire and Ice (scénario 15) – De l\'œuvre d\'art à l\'époque de sa reproductibilité technique',
  resume: `Dies Irae, pénultième scénario de la campagne (INS). Beleth veut retrouver Satan, terré à Paris. Guidés par la Ville vivante (rats, pigeons, un caricaturiste qui peint la vérité), les démons du Centre de Tri découvrent la rue Lucifer, une ruelle née de l'inconscient d'un Satan dépressif, et y restent prisonniers. Chaque nuit, le Santa Claws Circus, dont les employés sont des caricatures des princes-démons, se termine par un vote sur l'exécution du pantin de Satan, puis par un massacre. Pour sortir de la boucle, les PJ doivent soulager la misère des habitants et remettre en place les fils de l'intrigue (Belial, Crocell, la grossesse d'Andrealphus, Baal), jusqu'à la « démission » de Satan et l'appel au secours d'Andrealphus.`,
  notes: `Source : ${REF}. Aide de jeu associée : « Fluctuat Nec Mergitur », p. 98-109. Chronologie : Tempus Fugit, p. 154.
Ton : très noir et grotesque (violences sur enfants, sévices, cannibalisme involontaire). Prévenir la table et doser selon les joueurs.
Déroulement : prologue au Centre de Tri et Chez Régis → la Ville guide les PJ (rats, pigeons, place du Tertre, caricaturiste) → l'impasse et trois passages → la rue Lucifer → premier spectacle et massacre → boucle : sept problèmes du quartier → coulisses : remettre l'intrigue en place → grand final, hôtel et message de « S. ».
Récompenses : le livre n'en donne pas pour ce scénario.

Chronologie (Tempus Fugit) – immédiatement après « Interzone » :
• J−1 mois : Samaël se planque dans un hôtel miteux entre Montmartre et Château Rouge.
• J1-3 : les démons cherchent la rue Lucifer ; Paris les guide jusqu'à la place du Tertre, portrait, plan, impasse, rue Lucifer.
• Durée indéterminée : séjour dans la retraite terrestre de Satan, cirque circulaire et nuit sans fin ; ils résolvent les problèmes des habitants, votent le pardon et bouchent les trous de la mise en scène ; mort symbolique du Patron et meurtre d'Andrealphus par Baal.
• J2-4 : retour dans la réalité, message de Satan, appel d'Andrealphus.
Suite (Les cahiers du labyrinthe) : Damien remplace Samaël à la tête des Enfers ; Beleth cache « la meuf de la MRC » dans le Lupanar au lieu de la faire disparaître ; Hornet a volé la puissance de Bifrons après la mort d'Andrealphus.

Fluctuat Nec Mergitur (résumé utile au scénario) :
• Paris vivante : les rêves des habitants depuis des siècles ont rendu la Ville consciente dans la MRC ; la présence de Satan l'a éveillée davantage. Elle perçoit tout ce qui se passe dans ses rues, son métro et ses égouts ; quelques humains (et même des anges et démons) se sont liés à elle. Pour l'instant, elle veut seulement se débarrasser de Satan.
• Mystères de Paris (accroches) : égouts réinvestis par les anges depuis l'affaire de la Terre Creuse, sauf le U-Boat Crew de Vephar (anaconda géant Marguerite) ; métro : rame fantôme d'Octave Pinchu (démon de Kobal, Gag absurde), rats mangeurs d'hommes (Force 2, Agilité 4, Corps à corps 3+, Défense 4, puissance +0), le « Roumain » de la ligne 7 qui aspire l'énergie des dormeurs (Volonté 3, Absorption de force 2+) ; catacombes (skins de Daniel, Terre Creuse, punks, sociétés secrètes) et RIP, anges de Laurent, Walther ou Joseph qui chassent les intrus des cimetières et gênent les Errants de Kronos au Père-Lachaise ; Petite Ceinture et son vieillard aveugle prophète (« La Stella Inquisitorus n'aura pas lieu… ») ; la petite fille au chat en peluche perché sur un réverbère (Coup de bol pour 24 h si on l'aide, morsure de crocs sinon).
• Mages urbains (PNJ seulement) : humains normaux (Volonté jusqu'à 4+) dotés d'une Foi (max 6) qui mesure leur accord avec la Ville et limite leurs pouvoirs. Niveaux à obtenir dans l'ordre, obligations cumulatives : 1 étudier la Ville 3 h par semaine ; 2 sacrifier un nuisible (rat, pigeon, chien, policier) à l'aube dans un lieu public chaque mois ; 3 méditer une heure dans un haut lieu, chaque mois à un endroit différent (parle alors aux rats et aux pigeons) ; 4 interrompre la circulation au moins dix minutes chaque mois sans magie ; 5 tout abandonner pour vivre de la Ville (observation et sacrifices plus fréquents) ; 6 modifier durablement le visage de la Ville ; 7 mythique.
  Un pouvoir par point de Volonté, de type spirituel et activé ; (Foi + Volonté) utilisations par jour ; bonus de concentration avec un focus : 1 tour +1 colonne, 1 minute +2, 1 heure +3, 1 jour +4, 1 semaine +5.
  Pouvoirs (absents des règles de l'application) : niv. 1 Aujourd'hui c'est gratuit (transports gratuits une journée), Caramba encore raté (−3 colonnes aux attaques contre le mage pendant Foi minutes), Connaissance de la rue (deviner ce qui se passe dans la Ville ou un groupe, pas un individu ; ex. « quelque chose de bizarre rue Lucifer »), Je suis un lampadaire (se fondre dans le mobilier urbain immobile), Paris sous les bombes (message caché lisible par les seuls destinataires choisis, une semaine), Pour la musique (20 × Foi € de manche en une heure) ; niv. 2 Anonyme (disparaître dans la foule, Non-détection 2 pendant Foi minutes), Attention à la marche (attaque par l'environnement, test de Foi, puissance +1), Sur ses gardes (sent les sentiments et les attaques imminentes, Foi heures), Je l'ai trouvé par terre (objet de moins de 100 € en 10 − Foi minutes, ou localiser un objet possédé), Saloperie de bestiole (posséder un animal touché) ; niv. 3 C'est chez moi (territoire de 200 m² maximum, test de Foi, une semaine, cumulable jusqu'à +3 colonnes ; détecte le surnaturel, Anonyme/Sur ses gardes/Caramba permanents, un pouvoir gratuit par jour), Déjà arrivé (trajet rapide et sans danger), Où ça ? (invisible Foi minutes), T'es pas au courant ? (rumeur crue de tous pendant Foi mois) ; niv. 4 L'autre droite (forcer quelqu'un à se rendre dans un lieu public), L'effet villageoise (posséder un SDF ou un fou Foi heures, test résisté de Volonté), Paria (une semaine de mise au ban sociale) ; niv. 5 Attention au camion (version +3 d'Attention à la marche, Foi tours), Les rebuts se rebiffent (contrôler Foi SDF ou fous pendant Foi heures) ; niv. 6 White riot (déclencher une émeute une demi-heure plus tard).

Fiches : les employés du cirque ont les caractéristiques des vrais princes (non chiffrées) ; seules la nuée de chauves-souris et l'attaque du clown jongleur sont chiffrées dans le livre. Monsieur Fabien et Gilbert : fiches du Centre de Tri (Fire and Ice, p. 24-26). Clochards : valeurs estimées.`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [fabien, gilbert, angeYves, harangueur, clochards, caricaturiste, flicAnge, chauvesSouris,
  durand, pariet, hadot, cure, regis, robert, monsac, crocus, martinez, clocharde, autres,
  pantin, loyal, beleth, bifrons, belial, crocell, andrealphus, baal, malphas, malthus, ouikka, baalberith, andromalius, employes].map(asType);
// Le pantin (Satan) : joint aux coulisses, hors scène de combat
scenes[6].npcs.unshift(inScene(pantin));

// Contrôle : pouvoirs inconnus des règles
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));

writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types');
