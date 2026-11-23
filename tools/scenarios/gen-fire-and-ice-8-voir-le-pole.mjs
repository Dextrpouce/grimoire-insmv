// Génère le fichier d'import « insmv-scenario » pour « Voir le Pôle et courir » (Fire and Ice, p. 125-136, aide de jeu p. 137-141)
// usage : node gen-voir-le-pole.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Fire and Ice, « Voir le Pôle et courir », p. 125-136';
const L = (s) => R.parseLvl(String(s)); // « 2+ » → 5
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
const W = Object.fromEntries(R.ARMES.flatMap(([g, l]) => l.map((x) => [x[0], { prec: x[1], puis: x[2], melee: R.MELEE_GROUPS.includes(g) }])));
const arme = (n, att, table, over = {}) => ({ n, att, ...W[table], ...over });
let n = 0; const id = (p) => `fi8-${p}`;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [{ n: 'Coup de poing', att: 2, prec: 0, puis: -3, melee: true }], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${o.ref || REF}.`].filter(Boolean).join('\n'),
});
const clean = (x) => { delete x.ref; return x; };

// ---------------- PNJ ----------------
// Paris / Le Cap (sans caractéristiques)
const gilbert = clean(npc('gilbert', {
  nom: 'Gilbert Blénot', source: 'Démon de Malthus, pompier de Paris', type: 'demon',
  notes: 'Jeune type musclé, cheveux courts, peau mate, superbe uniforme de pompier. Ami de Monsieur Fabien.\nA découvert le corps chambre 312, l\'a fait évacuer en « crise cardiaque » avec l\'aide d\'un démon de Bifrons à la morgue, et a tenu la police à l\'écart. Briefe les PJ au P.C. sécurité de l\'hôtel.\nFiche minimale : caractéristiques non fournies par le livre.',
}));
const luigi = clean(npc('luigi', {
  nom: 'Luigi', source: 'Prostitué, ami de la victime', type: 'humain',
  notes: 'Jeune Italien séduisant, cheveux gominés, poils qui dépassent du col. Erre paniqué dans l\'hôtel depuis l\'aube ; Margot (Marguerite Leblanc) l\'avait appelé la veille pour dire que tout allait bien.\nSi une voix d\'homme répond au portable de la victime, il explose en menaces. Rencontré, il fanfaronne puis craque et décrit le client : grand, roux, moustachu, yeux clairs, taches de rousseur.\nFiche minimale : caractéristiques non fournies.',
}));
const cliff = clean(npc('cliff', {
  nom: 'Cliff', source: 'Démon de Baalberith, comité d\'accueil au Cap', type: 'demon',
  notes: 'Grand Noir très maigre, anglais à fort accent bantou. Attend les PJ à l\'aéroport avec un panneau, fournit armes et liasses de rands. A fait filer Bjorn jusqu\'à son hôtel près du port.\nFiche minimale : caractéristiques non fournies.',
}));

// Base Dumont d'Urville
const dugland = clean(npc('dugland', {
  nom: 'Sergent Dugland', source: 'Bidasse touristique (humain normal)', car: car('2 2 2 1 1 1+'), def: L('2+'),
  pfFix: 3, seuilsFix: seuils('3/6/9/12'),
  armes: [arme('Fusil', L(3), 'Carabine')],
  talents: 'Tir 2 (armes d\'épaule 3), Défense 2+, Guide touristique en milieu froid 3',
  notes: 'Petit gros à moitié chauve, grosses lunettes, français de caserne, zozote un peu. Adjoint de Tricard, responsable des civils : traîne les touristes chaque matin en chenillette pour leur montrer les merveilles de la Terre Adélie. Pénible.\nArme : fusil non précisé (Carabine de la table, estimation).',
}));
const tricard = clean(npc('tricard', {
  nom: 'Lieutenant Tricard', source: 'Chef de la base (humain normal)', car: car('2 2 2 2 1 2'),
  pfFix: 4, seuilsFix: seuils('3/6/9/12'),
  armes: [arme('Fusil', L(3), 'Carabine')],
  talents: 'Tir 2 (armes d\'épaule 3), Savoir militaire 2 (tactique 3), Croire qu\'il dirige vraiment la base 4',
  notes: 'Taille moyenne, cheveux gris, air sévère, pète-sec. Persuadé de diriger la base sans rien comprendre à ce qui s\'y passe ; méprise civils et touristes.\nDéfense non donnée : 2 (niveau 1). Arme : Carabine de la table (estimation).',
}));
const mousseux = clean(npc('mousseux', {
  nom: 'André Mousseux', source: 'Ange de Daniel, grade 1 (soldat de 2e classe)', type: 'ange', car: car('5 5 3 3 1 3'), def: L('4+'),
  pp: 12, pfFix: 8, seuilsFix: seuils('8/16/24/32'),
  armes: [arme('Pistolet', L(5), 'Revolver gros calibre'), arme('Corps à corps', L(4), 'Coup de poing')],
  pouvoirs: pows('Trait d\'énergie 1, Armure corporelle 3, Déphasage 1, Pétrification 1, Détection du mal 1'),
  talents: 'Combat 4, Tir 3 (armes de poing 5), Défense 4+, Trier des cailloux 6',
  notes: 'Grand et gros costaud rougeaud, très lâche ; a foiré tant de missions qu\'on l\'a rangé ici (deuxième avertissement sans frais : lâche et asexué). Membre de la You-You Power Force, ostracisé par les autres soldats. Terrifié d\'être entouré de démons, larges cernes.\nMéfiant, puis donne rendez-vous aux PJ entre les chenillettes : il ignore qui ils sont, mais les supplie de ne pas être du côté des autres. Abattu d\'une balle de .50 par Vannier avant d\'avoir pu en dire plus.\nArmes : pistolet (Revolver gros calibre de la table) et mains nues (estimation).',
}));
const vanessa = clean(npc('vanessa', {
  nom: 'Vanessa', source: 'Démon de Crocell, grade 3 (infirmière)', type: 'demon', car: car('2 3 3 5 3 5'), def: L(4),
  pp: 27, pfFix: 7, seuilsFix: seuils('4/8/12/16'),
  pouvoirs: pows('Froid polaire 3, Couche de glace 3, Invisibilité 3, Non-détection 3, Protection de l\'esprit, Contrôle des animaux 5, Charme 3'),
  talents: 'Discussion 6, Aisance sociale 5, Comédie 5, Discrétion 5, Défense 4, Avoir l\'air idiote 6, Séduction 7+',
  notes: 'Grande brune aux yeux bleus, pas froid aux yeux. Infirmière qui n\'y connaît rien en médecine ; joue la gentille idiote en quête d\'un protecteur. En réalité très intelligente, servante efficace de Crocell depuis longtemps. Avertissement sans frais : phobie des croix.\nSe jette sur le PJ à la plus haute Présence pour lui soutirer des confidences sur l\'oreiller ; avoue trouver la station bizarre, mais toute question précise grille la couverture du PJ.\nAttaque à mains nues estimée (aucun talent de combat).',
}));
const vannier = clean(npc('vannier', {
  nom: 'Bernard « Pic à glace » Vannier', source: 'Démon de Crocell, grade 2 (sergent, sécurité)', type: 'demon', car: car('5 5 2 3 1 4'), def: L(7),
  pp: 19, pfFix: 8, seuilsFix: seuils('7/14/21/28'),
  armes: [{ n: 'Pic à glace maudit mineur (inadapté à la parade)', att: L(7), prec: 1, puis: 4, melee: true }, arme('Fusil de précision à lunette et silencieux', L('4+'), 'Fusil à lunette')],
  pouvoirs: pows('Armure corporelle 2, Froid polaire 3, Régénération 2, Couche de glace 3, Éclats de glace 2, Immunité contre le froid, Non-détection 2, Corps liquide'),
  talents: 'Combat 7, Défense 7, Tir 2+ (armes d\'épaule 4+), Conduite 5, Art 2 (sculpture sur glace 3+)',
  notes: 'Petit trapu barbu, cheveux ras ; chasse le phoque et le manchot au pic à glace. Plus malin qu\'il n\'en a l\'air, finit toujours par savoir ce qui se passe. Avertissement sans frais : besoin de violence.\nVrai maître de la base. Repère vite les PJ et lâche Kinderpinguy sur eux. Abat Mousseux au fusil depuis une planque, en tenue blanche cagoulée, puis fuit en chenillette.\nFusil : Fusil à lunette de la table (le livre parle de calibre .50).',
}));
const iceberg = clean(npc('iceberg', {
  nom: 'Isaac Iceberg', source: 'Démon de Crocell, grade 2 (directeur scientifique)', type: 'demon', car: car('4 2 3 6 2 4'), def: L('4+'),
  pp: 21, pfFix: 10, seuilsFix: seuils('6/12/18/24'),
  pouvoirs: pows('Volonté supra-normale 3, Éclats de glace 2, Couche de glace 2, Sommeil 4'),
  talents: 'Médecine 7, Discussion 5, Défense 4+, Technique 2+ (électronique 5)',
  notes: 'Énorme quadragénaire au crâne rasé, air de bouddha. Responsable de l\'équipe scientifique ; greffe des gadgets électroniques aux animaux (Kinderpinguy). Primesautier, bordélique, facétieux. Avertissement sans frais : gras.\nLes PJ ont déjà croisé son nom (scénario 1) : sa présentation doit les faire tiquer.\nAttaque à mains nues estimée.',
}));
const kinder = clean(npc('kinderpinguy', {
  nom: 'Kinderpinguy', source: 'Manchot espion', type: 'familier', car: car('1 1 2 1 2 2'),
  pfFix: 2, seuilsFix: seuils('2/4/6/8'), armes: [],
  talents: 'Discrétion 3, Ramasser des cailloux 3, Manger du poisson 5',
  notes: 'Manchot ridicule et mignon, caméra greffée sous le crâne et reliée au nerf optique : tout ce qu\'il voit part au poste de sécurité (Vannier). Suit les PJ partout comme s\'il les avait pris en affection.\nCh du livre reportée en Foi.',
}));
const bidasses = clean(npc('bidasses', {
  nom: 'Bidasses Flocons de sang', source: 'Soldats de la base envoûtés par Crocell', qty: 3, car: car('2 2 2 1 1 2'), def: L(2),
  pp: 6, pfFix: 3, seuilsFix: seuils('3/6/9/12'),
  armes: [arme('Fusil d\'assaut', L(3), 'Carabine')],
  pouvoirs: pows('Éclats de glace 1'),
  talents: 'Tir 3, Défense 2, Savoir militaire 1+ (tactique 2+), Obéir 3',
  notes: 'Raoul Petibonhomme, Michel Laverse, Bruno Duo, Éric Denerre, Alfred Dujnou, Marc Mourat, Philippe Lepont, Didier Artois, Adrien Lebuc, Pierre Raspail. Cheveux courts, rangers cirées, pas futés, subjugués par Crocell qui leur a donné plus de pouvoirs et de PP qu\'aux Flocons de sang ordinaires. Loyaux, mais paniquent face à une force surnaturelle conséquente.\nTrois gardent en permanence l\'entrepôt interdit (relève toutes les quatre heures) ; trois accompagnent Crocell dans le chalet. Valeurs du bestiaire (Bidasse envoûté, p. 135). Fusil d\'assaut : Carabine de la table.',
}));
const bjorn = clean(npc('bjorn', {
  nom: 'Bjorn Olsen', source: 'Géologue, Flocon de sang', car: car('1 1 2 4 1 2'),
  pp: 6, pfFix: 5, seuilsFix: seuils('2/4/6/8'),
  pouvoirs: pows('Éclats de glace 1'),
  talents: 'Science 2 (géologie 4), Discussion 3, Prendre des initiatives 4',
  notes: 'Grand rouquin moustachu d\'origine danoise, la cinquantaine, yeux bleus, taches de rousseur. Aime les jolies femmes, la bonne chère et les drogues. A perdu les pédales lors d\'un mauvais trip et tué Marguerite Leblanc avec son pouvoir à l\'hôtel d\'Orly ; depuis, angoissé à l\'idée d\'être retrouvé.\nFil conducteur du scénario : Orly → Le Cap → cargo L\'Anjou → base Dumont d\'Urville. Sur le bateau, joue les touristes et fait des exposés sur le socle antarctique.\nProfil des scientifiques Flocons de sang (p. 135). Attaque à mains nues estimée.',
}));
const scientifiques = clean(npc('scientifiques', {
  nom: 'Scientifiques Flocons de sang', source: 'Équipe d\'Isaac Iceberg', qty: 4, car: car('1 1 2 4 1 2'),
  pp: 6, pfFix: 5, seuilsFix: seuils('2/4/6/8'),
  pouvoirs: pows('Éclats de glace 1'),
  talents: 'Science 2 (spécialisations diverses 4), Discussion 3, Prendre des initiatives 4',
  notes: 'Albert Eiseinsteinbergenovitch (climatologie, petit monsieur au jargon abscons, imbibé de vodka), Isaac Lethon (météorologie, grand maigre à queue de cheval, adore faire des exposés aux touristes), Marie Vury (biogéographie, quinquagénaire nymphomane qui jette son dévolu sur les PJ), Baké Diouf (océanographie, taciturne, accent du Nord). Bjorn Olsen complète l\'équipe.\nAttaque à mains nues estimée.',
}));
const baleine = clean(npc('baleine', {
  nom: 'Baleine bleue déboussolée', source: 'Les dents de la mer (incident du cargo)', type: 'monstre', car: car('6 1 1 1 1 1'),
  pfFix: 24, seuilsFix: seuils('8/16/24/32'), prot: 8,
  armes: [{ n: 'Coup de boule contre la coque', att: L(3), prec: 0, puis: 0, melee: true }],
  talents: 'Corps à corps 3',
  notes: 'Trente mètres, plus de 150 tonnes, rendue folle par le chaos magnético-magique autour de Crocell. Tente de faire chavirer le cargo ; seule issue : la tuer (meurt à 0 PF). Armure 8.\nSi son attaque réussit : chaque PJ teste l\'Agilité, sinon blessure de gravité 1d6+2. Sur un RU de 6, voie d\'eau à colmater (les matelots s\'en chargent) ; au bout de cinq brèches, le navire coule.\nLe livre ne donne que PF 24, seuil de BL 8, armure 8 et Corps à corps 3 : caractéristiques et seuils BG/BF/MS estimés.',
}));

// Familiers de Crocell
const groumf = clean(npc('groumf', {
  nom: 'Groumf', source: 'Ours polaire familier de Crocell', type: 'familier', car: car('6 2 2 2 2 3'), def: L(3),
  pp: 12, pfFix: 8, seuilsFix: seuils('7/15/22/30'),
  armes: [{ n: 'Griffes', att: L(5), prec: -2, puis: 4, melee: true }],
  pouvoirs: pows('Éclats de glace 2, Couche de glace 2, Peur 3, Immunité contre le froid'),
  talents: 'Corps à corps 5, Défense 3, Athlétisme 3, Manger des manchots 6',
  notes: 'Ours blanc de quatre mètres et quelques tonnes, n\'a rien à faire dans cet hémisphère. Pas très malin. Valeurs du bestiaire (Ours polaire familier, p. 134).',
}));
const broumf = clean(npc('broumf', {
  nom: 'Broumf', source: 'Ours polaire familier de Crocell', type: 'familier', car: car('5 3 2 4 1 3'), def: L(4),
  pp: 13, pfFix: 9, seuilsFix: seuils('6/13/19/26'),
  armes: [{ n: 'Griffes', att: L('4+'), prec: -2, puis: 4, melee: true }],
  pouvoirs: pows('Vitesse 3, Éclats de glace 2, Détection du danger 2, Immunité contre le froid'),
  talents: 'Corps à corps 4+, Défense 4, Athlétisme 4, Affûter ses griffes sur la banquise 6',
  notes: 'Plus intelligent que Groumf, mais tout pelé.',
}));
const sculptures = clean(npc('sculptures', {
  nom: 'Sculptures de glace', source: 'Familiers lobotomisés de Crocell', type: 'familier', qty: 4, car: car('5 5 1 1 3 2'), def: L(6),
  pfFix: 6, seuilsFix: seuils('6/13/19/26'),
  armes: [{ n: 'Poings', att: L(6), prec: 1, puis: 2, melee: true }, { n: 'Pieds', att: L(6), prec: 1, puis: 3, melee: true }],
  pouvoirs: pows('Couche de glace 3, Immunité contre le froid'),
  talents: 'Corps à corps 6, Défense 6, Discrétion 6',
  notes: 'Statues de taille humaine cachées parmi les sculptures monumentales autour du chalet. Stupides mais très rapides, frappent par surprise puis se fondent parmi les autres statues. Couche de glace permanente, sans coût en PP. Avertissement sans frais : texture de la peau.\nAutant de sculptures que de PJ (quantité à ajuster). Pas de PP indiqués.',
}));

// Le chalet
const crocell = clean(npc('crocell', {
  nom: 'Crocell', source: 'Prince-démon du Froid (renégat de fait)', type: 'demon',
  notes: 'Adolescent aux cheveux bleutés, entièrement nu dans un vaste fauteuil, sirote un Cherry Coke. Insolent, colérique, séduisant, triste. Lit les pensées des PJ et reconnaît ceux qui l\'ont mis dans la bouse (Provence).\nS\'ils l\'attaquent : ne pas jouer le combat, ils meurent et la campagne s\'arrête (ou les pulvériser/paralyser).\nFiche minimale : un prince n\'a pas de caractéristiques.',
}));

// Le commando de Belial
const froutch = clean(npc('froutch', {
  nom: 'Froutch', source: 'Démon de Belial, grade 3 (Garde carmine)', type: 'demon', car: car('4 3 3 4 3 5'), def: L(5),
  pp: 22, pfFix: 8, seuilsFix: seuils('6/12/18/24'), prot: 4,
  armes: [{ n: 'Lance-flammes chromé (aire rayon court, inévitable)', att: L('5+'), prec: -1, puis: 10, melee: false }],
  pouvoirs: pows('Immunité contre le feu, Jet de flammes 3, Incendie 3, Caméléon 2, Non-détection 3, Régénération 2'),
  talents: 'Tir 2 (armes de guerre 5+), Défense 5, Discrétion 5, Beugler des ordres 5. Feu de Prométhée 3 (nouveau pouvoir, p. 140 : spirituel, activé 1 PP ou constant 1 PP/10 s ; enflamme un objet jusqu\'à la taille d\'une chaise à 4 m ; en attaque, langue de feu bleutée précision +2, puissance niveau+3, portée très courte, touche même les immunisés au feu ; en constant, enflamme une arme de contact en métal : bonus de puissance égal au niveau)',
  notes: 'Grand, musclé, crâne rasé, bouc noir ; treillis blanc, écharpe rouge de la Garde carmine, gilet pare-balles, lance-flammes chromé. Mégalo, se croit le bras droit de Belial et compte récupérer son titre une fois Belial maître des Enfers. Avertissement sans frais : mégalomane.\nGilet pare-balles assimilé à une Veste de Kevlar (protection 4, estimation). Lance-flammes chromé : équipement de la Garde carmine (p. 140).',
}));
const napalm = clean(npc('napalm', {
  nom: 'Division Napalm', source: 'Démons de Belial, grade 1', type: 'demon', qty: 12, car: car('4 3 3 3 2 3'), def: L('3+'),
  pp: 11, pfFix: 7, seuilsFix: seuils('6/12/18/24'), prot: 4,
  armes: [arme('Lance-flammes dorsal', L(5), 'Lance-flammes')],
  pouvoirs: pows('Armure corporelle 1, Incendie 2, Vitesse 1, Détection du bien 1, Immunité contre le feu, Jet de flammes 2'),
  talents: 'Tir 2 (armes de guerre 5), Défense 3+, Discrétion 3, Oui chef 4 (l\'un d\'eux a Pilotage à la place de Discrétion : le pilote de l\'hélicoptère)',
  notes: 'Une douzaine de types en treillis camouflage neige, casques et gilets pare-balles, lance-flammes dorsaux. Loyaux à leur chef, fanatisés pour la croisade de Belial contre son frère. Avertissement sans frais : un chacun, tous différents.\nGilet pare-balles assimilé à une Veste de Kevlar (protection 4, estimation). Lance-flammes de la table des règles.',
}));

// Le bestiaire joint (types réutilisables) : mêmes fiches, sans quantité
const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });

// ---------------- Scènes ----------------
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  scene('margarita', '1. Frozen Margarita', 'Hôtel Ibis d\'Orly, chambre 312 – au petit matin',
    `Contexte : la guerre ouverte entre Belial et Crocell vient d'éclater ; Crocell s'est réfugié sur Terre. Monsieur Fabien tire les PJ du lit et les envoie au P.C. sécurité de l'hôtel, où Gilbert Blénot (démon de Malthus, pompier) les briefe.
Le corps : grande blonde nue, déchiquetée, couverte d'entailles givrées, toute bleue — Gilbert soupçonne un pouvoir démoniaque. Corps déjà évacué en « crise cardiaque ».
La chambre : soirée très spéciale (alcool, préservatifs, joints, cocaïne, attirail SM). Rien d'autre que les affaires de la victime, sauf un slip kangourou bleu sous le lit. Sac à main : maquillage, portable, quelques centaines d'euros, papiers au nom de Marguerite Leblanc.
Pistes :
• L'hôtel accueille une convention internationale de géologues (environ 150 participants). Direction peu coopérative sauf fausse autorité ; les femmes de ménage (sous-traitance Arcade) parlent plus facilement.
• Chambre payée en liquide la veille par la victime ; le réceptionniste a deviné une prostituée et fermé les yeux.
• Portable : dernier appel à Luigi, qui a rappelé une dizaine de fois. Une voix d'homme le fait exploser ; rencontré, il décrit le client (grand roux moustachu, yeux clairs, taches de rousseur).
• À défaut, une femme de ménage a vu la victime monter avec le géologue.
Le réceptionniste, contre un billet, donne le nom : Bjorn Olsen, parti à l'aube après avoir avancé son vol Air France pour Le Cap. Les PJ arrivent juste après le décollage.`,
    [inScene(gilbert), inScene(luigi)], false,
    [choice('fabien', 'Les PJ tiennent-ils Monsieur Fabien au courant ?', [
      ['Oui', 'Deuxième voyageur mystérieux vers l\'Afrique du Sud (cf. Isaac Iceberg, scénario 1) : il ordonne de prendre le prochain avion pour Le Cap et contacte les forces locales (Cliff).'],
      ['Non', 'Les PJ doivent décider seuls de suivre Bjorn ; sans Fabien, pas de comité d\'accueil ni d\'armes au Cap (à l\'appréciation du MJ).'],
    ])]),
  scene('cap', '2. Fumer de la Boer', 'Le Cap, Afrique du Sud – aéroport, puis hôtel sordide près du port',
    `Une vingtaine d'heures de vol. Cliff (démon de Baalberith) attend les PJ avec un panneau, fournit armes et argent local (rands). Il a fait filer Bjorn jusqu'à son hôtel au lieu de l'intercepter.
Contexte : État fédéral, apartheid aboli au début des années 90, pays riche (or, diamants), Le Cap capitale législative, métropole portuaire cosmopolite.
Depuis son arrivée, Bjorn a passé du temps avec une prostituée, puis est monté à bord d'un navire, L'Anjou, et s'est couché. Les matelots ou la capitainerie révèlent la destination : la base française Dumont d'Urville en Terre Adélie (matériel scientifique et vivres). Le cargo embarque aussi des touristes : trois jours sur la base puis visite guidée, environ 3 000 € par personne.
Monsieur Fabien encourage les PJ à poursuivre jusqu'au pôle Sud, en redoublant de prudence.`,
    [inScene(cliff), inScene(bjorn)], false,
    [choice('bjorn', 'Que font les PJ de Bjorn ?', [
      ['Ils embarquent incognito sur L\'Anjou', 'Déroulement prévu : Bjorn les conduit sans le savoir jusqu\'à Crocell.'],
      ['Ils l\'interceptent au Cap', 'Hors scénario : Bjorn est un simple Flocon de sang paniqué ; il peut avouer sa destination, mais la base sera peut-être prévenue. Au MJ d\'adapter.'],
    ])]),
  scene('cargo', '3. Cargo de nuit', 'À bord du cargo L\'Anjou – près d\'une semaine, 8 500 km',
    `Bjorn se tient tranquille ; avec des PJ jouant les touristes, il se présente comme géologue et fait des exposés sur le socle antarctique. Incidents au choix du MJ :
• La tempête : test d'Agilité par tour pour quiconque est sur le pont (échec : 1d6, de 1 à 5 perte de 2 PF, sur 6 passé par-dessus bord). Trois réussites successives pour regagner sa cabine. Puis test de Force facile contre le mal de mer.
• L'épidémie : un démon de Malthus a infecté un réservoir (dysenterie). Ceux qui ont mangé la soupe d'aileron de requin et n'ont pas d'immunité testent la Force très difficile : réussite = mal de ventre ; échec = −2 colonnes à toutes les actions pendant une semaine ; échec avec RU 6 = diarrhée hémorragique, −4 PF et −2 colonnes pendant dix jours.
• Les dents de la mer : une baleine bleue déboussolée par Crocell tente de faire chavirer le cargo (voir sa fiche : chaque attaque réussie, test d'Agilité ou blessure 1d6+2 ; voie d'eau sur RU 6, naufrage à la cinquième).
En fin de traversée, la température tombe vers −10 °C le long de la côte ; au matin du septième jour, la Terre Adélie est en vue.`,
    [inScene(bjorn), inScene(baleine)], true,
    [choice('baleine', 'La baleine attaque-t-elle le cargo ?', [
      ['Oui, les PJ la tuent', 'Le cargo arrive avec quelques brèches colmatées.'],
      ['Oui, cinq voies d\'eau', 'L\'Anjou se disloque dans les eaux glacées : aux PJ de survivre et de rejoindre la côte.'],
      ['Non, autre incident ou traversée calme', ''],
    ])]),
  scene('base', '4. Pôle position', 'Base Dumont d\'Urville, Terre Adélie – trois jours',
    `Antarctique en plein été austral : jour permanent, −10 °C (Crocell refroidit le climat), vents jusqu'à 100 km/h. La base domine un fjord face à l'iceberg de l'Astrolabe : 500 m sur 300, une route enneigée, une douzaine de hangars, baraques, antenne radio, groupe électrogène, manchots partout. Gérée par l'armée pour la recherche.
Seuls humains « normaux » : le lieutenant Tricard et le sergent Dugland. Tous les soldats et scientifiques sont des Flocons de sang ; Iceberg, Vannier et Vanessa servent Crocell ; André Mousseux est un ange de Daniel mis au placard.
Déroulement : chambres doubles spartiates ; chaque matin, visite en chenillette avec Dugland, après-midi libre. Ne pas déranger les scientifiques ; un entrepôt est interdit, gardé par trois soldats (relève toutes les quatre heures). Repas avec les scientifiques, dont le directeur se présente comme Isaac Iceberg (les PJ doivent tiquer).
Rien de suspect en apparence, mais Vannier repère vite les PJ et leur colle Kinderpinguy, le manchot-caméra. Vanessa séduit le PJ à la plus haute Présence ; toute question précise grille sa couverture. Toute enquête renforce la surveillance de Vannier.`,
    [inScene(tricard), inScene(dugland), inScene(iceberg), inScene(vanessa), inScene(vannier), inScene(kinder), inScene(mousseux), inScene(scientifiques), inScene(bjorn), inScene(bidasses)], false),
  scene('espion', '5. L\'espion qui venait du froid', 'Entre les chenillettes, en marge de la base, puis la banquise',
    `Questionné, Mousseux se méfie puis donne rendez-vous entre les chenillettes. Discours enfiévré : il ignore qui sont les PJ mais les supplie de ne pas être du côté des autres habitants. Au moment d'évoquer le Malin, il prend une balle de .50 en pleine tête et meurt sur le coup.
Le tireur est Vannier, en blanc et cagoulé, à quelques dizaines de mètres avec son fusil à lunette ; il fuit aussitôt en chenillette. Poursuite (les chenillettes se conduisent toutes seules, trois places) pendant que le vent se lève ; laisser Vannier prendre de l'avance. Son véhicule abandonné au pied d'un promontoire, ses traces disparaissent derrière.
Embuscade : Groumf et Broumf, deux familiers ours blancs de quatre mètres, surgissent et se battent jusqu'à la mort dans un blizzard croissant.
Après le combat, violente tempête : tests de Perception très difficiles pour rentrer, MR cumulée de 15 à atteindre, une colonne de malus supplémentaire à chaque jet après le premier. À la station, tout le monde se calfeutre, communications coupées : la meilleure occasion de visiter l'entrepôt interdit.`,
    [inScene(mousseux), inScene(vannier), inScene(groumf), inScene(broumf)], true,
    [choice('mousseux', 'Les PJ vont-ils au rendez-vous de Mousseux ?', [
      ['Oui', 'Mousseux est abattu sous leurs yeux ; poursuite de Vannier et embuscade des ours.'],
      ['Non', 'Mousseux est éliminé de toute façon ; le MJ peut lancer les ours sur les PJ lors d\'une sortie en chenillette, puis la tempête.'],
    ])]),
  scene('etoile', '6. Étoile des neiges', 'Entrepôt interdit, puis caverne sous la station',
    `Entrepôt vide, sauf une lourde trappe à carte magnétique : il faut un pouvoir ou voler des explosifs dans la base. Échelle, couloir en pente, ascenseur à un seul bouton : descente de plusieurs minutes jusqu'à plusieurs centaines de mètres. Antichambre (fauteuils, magazines, mini-bar de sodas), porte à deux battants.
Caverne de plus d'un kilomètre de large et cent mètres de haut : neige, phoques et manchots autour d'un lac artificiel, pistes de ski, rampes de skate. Environ −50 °C : sans Immunité contre le froid ni combinaison, −2 colonnes à toutes les actions et −1 PF toutes les deux heures (règles du froid, INS/MV4 p. 33).
Au centre, sur une colline, un chalet en bois entouré de dizaines de sculptures (animaux, humains, formes abstraites) qui semblent regarder les PJ. Certaines statues humaines sont des familiers : autant que de PJ. Assauts violents et soudains, puis calme pesant ; les sculptures se cachent entre deux attaques. Ambiance oppressante, mais les PJ doivent s'en sortir sans trop de casse.`,
    [inScene(sculptures, { qty: 4 })], true),
  scene('chalet', '7. Le chalet de Crocell', 'Chalet au cœur de la caverne',
    `Attendent les PJ : Vanessa, Vannier, Iceberg et trois soldats armés de fusils d'assaut. Au fond, Crocell, adolescent nu aux cheveux bleutés, sirote un Cherry Coke et les invite à s'asseoir.
S'ils l'attaquent : ne pas jouer le combat, ils meurent (campagne terminée). Crocell, de mauvaise humeur, lit leurs pensées et reconnaît ceux qui l'ont mis dans le pétrin. Il se calme, demande ce qu'ils font là et pour qui ils travaillent, puis annonce qu'il va réfléchir à leur sort. Vannier les enferme « à la cave » (pièce tempérée) ; fuir est quasi impossible à cause de la tempête.
Moment fort : quelques dizaines de minutes plus tard, Crocell leur offre des sodas exotiques et explique ses motivations — rivalité avec Belial depuis leur arrivée en Enfer, la découverte (grâce à Malphas) que Belial infiltrait ses démons, la création paniquée des Flocons de sang, sa certitude que Belial a monté l'affaire de Provence pour justifier la guerre, l'état du conflit et sa conviction que cette guerre affaiblira tout le camp du Mal, et sa peur de perdre. Jouer un prince insolent, colérique, séduisant et triste.
Au bord des larmes, il commence à avouer que tout est arrivé « à cause d'une fille »… quand Vannier jure dans son oreillette : la station est attaquée.`,
    [inScene(crocell), inScene(vanessa), inScene(vannier), inScene(iceberg), inScene(bidasses, { qty: 3 })], false,
    [choice('attaque', 'Les PJ s\'en prennent-ils à Crocell ?', [
      ['Non, ils écoutent', 'Crocell les interroge, les enferme, puis leur expose ses motivations ; l\'attaque de Belial interrompt sa confession.'],
      ['Oui', 'Ne pas jouer le combat : les PJ sont tués (ou pulvérisés/paralysés) et la campagne s\'arrête.'],
      ['Ils tentent de fuir', 'Fuite quasi impossible à cause de la tempête ; leur faire comprendre qu\'il vaut mieux attendre.'],
    ])]),
  scene('assaut', '8. James Bond font du ski', 'Surface de la base Dumont d\'Urville – orage de feu',
    `Crocell remonte à la surface avec Vannier, Vanessa, les trois soldats et les PJ. Un hélicoptère noir arrose la base ; un commando de Belial (Froutch et la Division Napalm), venu détruire une base arrière du prince du froid sans savoir qu'il s'y trouve, élimine tout ce qui vit au lance-flammes. La tempête s'est calmée, place à un orage de feu.
Bataille rangée (règles de combat de masse de Fire and Ice si souhaité) : les forces sont équilibrées, le choix des PJ décide de l'issue.
Monsieur Fabien écoute ensuite leur rapport sans commenter leur choix, et leur conseille de faire attention à eux : la guerre continue.`,
    [inScene(froutch), inScene(napalm), inScene(crocell), inScene(vannier), inScene(vanessa), inScene(iceberg), inScene(bidasses, { qty: 3 })], true,
    [choice('camp', 'Quel camp choisissent les PJ ?', [
      ['Aucun', 'Les deux camps s\'entre-tuent ; Belial l\'emporte de justesse, Crocell doit fuir avant d\'être reconnu et qu\'un démon n\'invoque Belial.'],
      ['Les assaillants (Belial)', 'Les serviteurs de Crocell sont décimés, il s\'enfuit et garde rancune aux PJ, surtout après les avoir épargnés.'],
      ['Crocell', 'Victoire rapide sur le commando. Crocell offre à chacun +1 PP, un niveau de pouvoir de grade de sa sphère (Froid) et son numéro de portable (+2 colonnes pour l\'invoquer) s\'il n\'est pas officiellement renégat, puis se téléporte en lieu sûr.'],
    ])]),
];

const scenario = {
  id: 'fire-and-ice-8-voir-le-pole',
  nom: 'Fire and Ice (scénario 8) – Voir le Pôle et courir',
  resume: `De bello civili, scénario 4 de l'acte 2 (INS). Au début de la guerre ouverte entre Belial et Crocell, Monsieur Fabien envoie les PJ enquêter sur une prostituée tuée par un pouvoir de froid dans un hôtel d'Orly. La piste du géologue Bjorn Olsen, un Flocon de sang, les mène au Cap puis, en cargo, jusqu'à la base Dumont d'Urville en Terre Adélie, repaire de Crocell. Ange assassiné, ours familiers, caverne glacée, rencontre avec le prince du froid… puis un commando de Belial attaque, et les PJ doivent choisir leur camp. Scénario potentiellement très meurtrier.`,
  notes: `Source : ${REF} ; aide de jeu « Remedium amoris », p. 137-141.
Déroulement : Orly (Frozen Margarita) → Le Cap → cargo L'Anjou → base Dumont d'Urville → mort de Mousseux, ours et tempête → caverne et sculptures → chalet de Crocell → assaut du commando de Belial.
Crocell a choisi la base pour son isolement, le froid et le nœud de lignes telluriques du pôle magnétique, qui l'alimente sans passer par l'Enfer. Officiellement déclaré renégat, il garde tous ses pouvoirs (seul Satan pourrait le destituer).

Récompenses :
• Camp de Crocell : +1 PP, un niveau de pouvoir de grade de la sphère du Froid, numéro de portable de Crocell (+2 colonnes pour l'invoquer) s'il n'est pas officiellement renégat.
• Pas d'autre récompense chiffrée ; Monsieur Fabien ne commente pas le choix de camp.

Aide de jeu « Remedium amoris » (PJ serviteurs de Belial ou de Crocell) — scénario 4 :
• Serviteur de Belial : Belial ne devrait pas intervenir. Si son serviteur le prévient, il mène lui-même l'assaut, la base est rasée, Crocell fuit quoi qu'il arrive et le serviteur reçoit le grade 2. Au chalet, si les PJ sont trop agressifs, le serviteur de Belial est le premier haché menu. S'il se laisse convaincre par Crocell et le prévient de l'attaque, Crocell quitte la station avant l'assaut, Belial fait chou blanc et le serviteur doit trouver une excuse pour éviter blâme ou statut de renégat.
• Serviteur de Crocell : si le prince a été déclaré renégat par sa faute, il lui passe un savon ; sinon, il est bien plus amical au chalet. S'il l'aide pendant l'assaut : grade 2. S'il se range du côté de Belial : un démon de Crocell vient le punir à la scie circulaire.
• Faux démon du froid chez Belial : doit éviter que Crocell ne découvre son secret par Lire les pensées, sinon il est gelé à mort. S'il est démasqué par ses camarades qui le dénoncent à la commission, ceux-ci gagnent +1 PP de Crocell (non déclaré renégat) et Belial lui inflige un blâme.
• Démon de Crocell blâmé : Belial efface discrètement le blâme. Mission confiée par Crocell : réussite éclatante = avertissement sans frais et annulation des récompenses de Crocell ; réussite mitigée = annulation des récompenses ; échec = annulation des blâmes de Crocell et +2 à +4 PA selon la qualité du foirage.
• Crocell peut accorder à un humain un de ses pouvoirs de niveau 1 (« assistés »), avec PP = Volonté + nouvelle Foi (commençant à 1) ; le démon perd 1 PP récupéré en sept jours. Dix fois maximum ; si moins de la moitié pètent les plombs, +1 PP, si tous meurent ou deviennent fous, blâme.
• Querelles entre PJ des deux camps : les laisser faire si cela sert le jeu, recadrer s'ils ne font que s'entre-tuer.
• Feu de Prométhée (Froutch) et équipement de la Garde carmine (lance-flammes chromé précision −1, puissance +10 ; gabardine ignifugée protection 1, 3 contre le feu) : voir la fiche de Froutch.

Fiches adaptées du livre : caractéristiques en niveaux INS/MV (Ch des humains reporté en Foi). Valeurs estimées signalées dans les notes des fiches (armes de la table, baleine, gilets pare-balles).`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [gilbert, luigi, cliff, bjorn, baleine, tricard, dugland, iceberg, vanessa, vannier, kinder, mousseux, scientifiques, bidasses,
  groumf, broumf, sculptures, crocell, froutch, napalm].map(asType);

// Contrôle : pouvoirs inconnus des règles
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));
const badW = bestiaire.flatMap((t) => t.armes).filter((a) => a.prec == null || a.puis == null);
if (badW.length) console.warn('Armes sans précision/puissance :', badW.map((a) => a.n).join(', '));

writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types');
