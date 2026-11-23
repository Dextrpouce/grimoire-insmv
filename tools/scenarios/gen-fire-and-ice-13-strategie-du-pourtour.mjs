// Génère le fichier d'import « insmv-scenario » pour « La stratégie du pourtour » (Fire and Ice 2, p. 71-82, + Tempus Fugit p. 153-154)
// usage : node gen-fire-and-ice-13-strategie-du-pourtour.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Fire and Ice 2, « La stratégie du pourtour », p. 71-82';
const L = (s) => R.parseLvl(String(s)); // « 2+ » → 5
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
const ARMES = new Map(R.ARMES.flatMap(([g, l]) => l.map((x) => [x[0], { prec: x[1], puis: x[2], melee: R.MELEE_GROUPS.includes(g) }])));
// arme de la table des règles : nom affiché, nom dans la table, niveau du talent
const arme = (n, table, lvl) => { const w = ARMES.get(table); if (!w) throw new Error('arme inconnue : ' + table); return { n, att: L(lvl), ...w }; };
const poing = (lvl) => arme('Coup de poing', 'Coup de poing', lvl);
let n = 0; const id = (p) => `fi13-${p}`;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [poing(1)], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, o.noSource ? '' : `Source : ${REF}.`].filter(Boolean).join('\n'),
});

const PROMETHEE = (lvl) => `Feu de Prométhée ${lvl} (pouvoir de la Garde carmine absent des règles, Fire and Ice p. 140 : langue de feu bleutée, précision +2, puissance niveau +3, portée très courte, brûle même les immunisés au feu ; en constant, enflamme une arme de contact en métal)`;
const GARDE = 'Membre de la Garde carmine (élite de Belial) : écharpe rouge carmin, loge à la villa louée par Drummond sous le nom de Georges Michel.';

// ---------------- Monsieur Fabien (fiche commune de la campagne) ----------------
const FICHES = {
  fabien: { re: /fabien/i, nom: 'Monsieur Fabien', source: 'Démon de Baalberith, grade 2 (chef du Centre de Tri)', type: 'demon', car: car('2 2 5 4 2 4'), def: 2, pp: 24, pfFix: 6, seuilsFix: [4, 8, 12, 16],
    armes: [{ n: 'Coup de poing', att: 2, prec: 0, puis: -3, melee: true }],
    pouvoirs: pows('Message officiel, Télépathie 5, Boomerang 3, Cauchemar 3, Onde de choc 2, Téléportation 2, Corps gazeux, Détection du futur proche 2, Volonté supra-normale 2'),
    talents: 'Métier (administration) 7, Discussion 6, Baratin 4 ; avantage matériel : le Centre de Tri',
    note: 'Vétéran débonnaire, pipe, anecdote laponne. Secret : remplacé par Beleth (« le Grand Imposteur ») quelques semaines après l\'arrivée des PJ.' },
};
const F = FICHES.fabien;
const fabien = npc('fabien', {
  nom: F.nom, source: F.source, type: F.type, car: { ...F.car }, def: F.def, pp: F.pp, pfFix: F.pfFix, seuilsFix: [...F.seuilsFix],
  armes: JSON.parse(JSON.stringify(F.armes)), pouvoirs: JSON.parse(JSON.stringify(F.pouvoirs)), talents: F.talents, noSource: true,
  notes: [
    'Briefing du samedi matin : persuadé qu\'Andrealphus est derrière la mort de la reine de beauté, il a déjà réservé TGV pour Quimper et hôtel. Mission : mettre la main sur le prince du sexe, discrètement, et camoufler l\'étrangeté de l\'affaire en orientant police et anges vers un coupable local. Demande un rapport téléphonique régulier.',
    'Surpris par le dessin des pendentifs « B » et « C » ; conseille d\'éliminer le pharmacien ; laisse carte blanche pour Henry mais exige un retour rapide (la « fin du monde » l\'inquiète).',
    F.note, `Caractéristiques : Fire and Ice, « Le Centre de Tri », p. 24-26.`,
  ].join('\n'),
});

// ---------------- PNJ de Douarnenez (sans caractéristiques) ----------------
const MIN = 'Fiche minimale (pas de caractéristiques dans le livre).';
const anneEdec = npc('anne-edec', {
  nom: 'Anne Edec', source: 'Humaine, logeuse de l\'hôtel de la place de l\'Enfer', armes: [],
  notes: `Vieille fille charmante qui tient l'hôtel avec son fils Erwan (quadragénaire maigrichon, grosses lunettes, pulls jacquard trop grands, un peu simplet). Accueille les PJ avec du kouign-amann et un « Lancelot » (bière blonde, cidre brut et chouchen à parts égales).\nConnaissait un peu Nathalie : donne l'adresse des parents si on le lui demande gentiment. Interrogée sur les préparations à base de champignons, elle cite le pharmacien André Carrefour, qui lui a vendu des remèdes « ancestraux ».\nAnnonce la visite de Drummond au bar de l'hôtel.\n${MIN}`,
});
const ascoet = npc('ascoet', {
  nom: 'Inspecteur Gwénaël Ascoët', source: 'Humain, police judiciaire, chargé de l\'enquête', armes: [],
  notes: `Près de deux mètres, gueule de bagnard de film avec Lino Ventura ; laconique, déteste journalistes et curieux. Sans très bonne excuse, il éconduit les PJ ; pouvoirs ou violence sur un policier se paieront en discrétion.\nCe qu'il sait : le touriste (écossais) qui a trouvé le corps a été relâché ; autopsie sans trace de violence ; suspects habituels sans consistance (Rachid, les rôlistes, Henri Petitbois).\nLundi, après la visite de Drummond, il débarque à l'hôtel : nouvelle victime, Émeline Duchez. Questions sur la nuit des PJ, contrôle des papiers, fouille des chambres (« et cette épée longue sous le lit ? »), questions sur la botanique et les champignons. Si on le fait parler, il lâche que la police scientifique a trouvé des traces d'un poison artisanal aux champignons locaux dans le sang de Nathalie (information non publiée).\n${MIN}`,
});
const guyHemon = npc('guy-hemon', {
  nom: 'Guy et Marie Hémon', source: 'Humains, parents de Nathalie', armes: [],
  notes: `Guy : professeur d'histoire-géo, militant d'un parti d'extrême droite dissident tendance catho intégriste, fier d'avoir une Miss Bretagne « de souche ». Ravi de parler à des journalistes ou à de « bons Français ». Marie : effacée, éplorée, réfugiée dans le ménage et le point de croix.\nRien d'utile dans leurs propos, mais ils montrent la chambre de Nathalie : pièce impersonnelle ; sur le bureau, des dessins au fusain dont un fleuve où se baigne une jeune femme noire vue de dos, observée par deux hommes portant des pendentifs « B » et « C » (Belial et Crocell : visions de la meuf pendant la possession).\n${MIN}`,
});
const marion = npc('marion', {
  nom: 'Marion Leguennec', source: 'Humaine, meilleure amie de Nathalie', armes: [],
  notes: `Petite brune boulotte, effondrée, facile à faire parler. Décrit Nathalie comme sérieuse et serviable (défilés mineurs, BTS Action commerciale). Mise en confiance, elle parle de son cousin Bernard et de ses amis rôlistes, et des mœurs d'Henri Petitbois, à qui Nathalie a dû céder pour ses ambitions de miss (confidence faite sous le sceau du secret).\n${MIN}`,
});
const rachid = npc('rachid', {
  nom: 'Rachid', source: 'Humain, jeune Kurde de Turquie sans papiers', armes: [],
  notes: `Coupable idéal n° 1. Réfugié parti de Sangatte après deux échecs pour passer en Angleterre, il espère embarquer clandestinement depuis Douarnenez. Dort sur la plage, mendie, a parlé plusieurs fois avec Nathalie devant témoins près de l'hôtel. Le soir du meurtre, il a tenté de monter sur un cargo et s'est fait tabasser par l'équipage ; depuis, il se cache sur la plage du Ris.\nFacile à accuser : cacher sur lui des affaires de Nathalie et le livrer à la police.\n${MIN}`,
});
const petitbois = npc('petitbois', {
  nom: 'Henri Petitbois', source: 'Humain, responsable du comité Miss France local', armes: [],
  notes: `Coupable idéal n° 2. Cinquantenaire mielleux qui abuse de sa position auprès des candidates ; Nathalie y est passée. Enregistre ses ébats sur un petit magnétophone posé sur la table de nuit et garde les cassettes : si la police les trouve, il sera fortement soupçonné d'avoir voulu faire taire la belle. On murmure qu'il était secrètement amoureux d'elle.\n${MIN}`,
});
const rolistes = npc('rolistes', {
  nom: 'Les rôlistes (Bernard, Grégoire, Ludovic, Tristan)', source: 'Humains, bande de joueurs de jeux de rôle', qty: 4, armes: [],
  notes: `Coupables idéaux n° 3. Bernard Mazéas (23 ans, maigrichon acnéique, cousin germain de Nathalie), Grégoire Nepont (19 ans, grand et gros, fan d'informatique), Ludovic Garnier (25 ans, hardos, pentacle au cou), Tristan Stivell (20 ans, meneur de jeu « charismatique », baggies et néométal).\nIls jouent à un In Nomine Satanis maison (personnages grade 3 à 70 PP…), font des chasses à l'ange dans les bois, des profanations de tombes et de l'épée en mousse chez Ludovic. Tous ont tenté leur chance avec Nathalie (parties dans la cave de Tristan), sans succès.\n${MIN}`,
});
const jocelyne = npc('jocelyne', {
  nom: 'Jocelyne Rochot', source: 'Humaine, vendeuse de poisson à la criée, corps d\'accueil de la meuf', armes: [],
  notes: `Mère de quatre enfants, mari alcoolique. Devenue le nouveau corps d'accueil de la meuf après la mort de Nathalie. Prisonnière de la Garde carmine dans la cave de la villa, interrogée sans grand résultat.\nPendant l'assaut de la Tierce, Stout l'enlève et la met dans la 4L ; elle en ressort en psalmodiant puis meurt de combustion spontanée devant tout le monde.\n${MIN}`,
});

// ---------------- André Carrefour ----------------
const andre = npc('andre', {
  nom: 'André Carrefour', source: 'Tueur en série possédé, pharmacien à Douarnenez', type: 'humain', car: car('1 2 2 3 1 2'), def: L(3),
  pp: 26, pfFix: 4, seuilsFix: seuils('2/4/6/8'), armes: [poing(3)],
  pouvoirs: pows('Peur 3, Charme 2, Augmentation de Volonté 3, Régénération 1, Détection des ennemis 2, Volonté supra-normale 3, Camisole 2'),
  talents: 'Corps à corps 3, Défense 3, Pharmacologie 4, Vélo 3, Faire des cocktails 3 ; avertissement sans frais : tueur psychopathe',
  notes: `Quinquagénaire, cheveu rare, moustache, sourire de pub pour dentifrice. Ancien pharmacien parisien coureur de jupons, mort d'une crise cardiaque en plein ébat puis « miraculeusement » ranimé ; installé à Douarnenez depuis un an. Obsédé par les femmes, créatures maléfiques, et par les chiffres de leurs corps.\nLe vrai meurtrier de Nathalie (sa 4e victime ; les trois autres pourrissent dans les bois) et d'Émeline Duchez : il les invite pour un « dernier verre » chez lui, les empoisonne à l'amanite phalloïde, relève leurs mensurations puis jette le corps dans un fourré.\nDans la journée, à la pharmacie toujours pleine : souriant, ment par omission (Détection du mensonge efficace s'il passe ses défenses mentales). Effraction de l'appartement : alarme, il arrive quelques minutes plus tard. Le soir, il traîne en « repérage » jusque vers minuit.\nAppartement : loft blanc, d'un ordre maniaque ; champignons dans le double fond du minibar ; derrière une tenture, des colonnes de mensurations écrites avec son propre sang, les noms de tous les princes-démons et d'une centaine de démons, et sous le numéro de Nathalie « Trône » et « Fin du monde » (les derniers mots de la mourante).\nMécanique sans conscience, il entend ces noms en dormant et ne sait rien d'Andrealphus ni de la meuf. Attaqué : Charme sur le démon le plus bourrin pour le retourner contre ses camarades, puis il grille tous ses PP. Pouvoirs démoniaques, mais ni aura, ni réaction à Détection du mal, ni langage démoniaque ; son corps ne disparaît pas à sa mort (il faut s'en débarrasser).\nPas d'arme : Corps à corps 3 à mains nues.`,
});

// ---------------- La Garde carmine ----------------
const drummond = npc('drummond', {
  nom: 'Monsieur Drummond', source: 'Démon de Belial, grade 3 – chef de l\'équipe de la Garde carmine', type: 'demon', car: car('4 2 4 3 2 5'), def: L(3),
  pp: 30, pfFix: 7, seuilsFix: seuils('6/12/18/24'),
  armes: [{ n: 'Club de golf maudit mineur', att: L(3), prec: 3, puis: 3, melee: true }],
  pouvoirs: pows('Jet de flammes 4, Incendie 4, Immunité contre le feu, Détection du bien 2, Vitesse 1, Armure corporelle 4, Peur 1, Régénération 1, Détection du danger 2, Anaérobiose, Tourbillon de feu 2, Corps gazeux'),
  talents: `Combat 3, Défense 3, Baratin 5, Conduite 3, Droit des affaires 4 ; avertissement sans frais : dandy. ${PROMETHEE(4)}`,
  notes: `Homme mince d'une soixantaine d'années, dégarni, tiré à quatre épingles, écharpe rouge carmin. Poli, réservé, violent à froid : chef sévère et juste, dévoué à Belial.\nLundi, il attend les PJ au bar de l'hôtel, ne cache ni sa nature ni son appartenance aux forces d'élite du prince du feu et les invite au thé. Belial, renseigné par Aurélie (ou par le micro qu'elle a posé dans le bureau de Fabien), le croit face à des alliés manipulables lancés sur Andrealphus ; plus froid si les PJ ont été reconnus lors des rixes précédentes.\nObjectif : les envoyer sur une fausse piste (Andrealphus aurait fait des recherches à la bibliothèque sur la cité d'Ys et loué un bateau la veille). Selon l'habileté des PJ, il peut lâcher qu'il est de la Garde carmine, avec une équipe complète, qu'il sait la reine de beauté possédée par la meuf, qu'il reste sur place et qu'il connaît leur mission. S'ils sont lents, c'est lui qui apprend qu'ils savent pour la meuf. Repart en van noir aux vitres teintées en leur conseillant de ne pas se mêler de ses affaires.\n${GARDE}`,
});
const virginia = npc('virginia', {
  nom: 'Virginia', source: 'Démone de Belial, grade 3 – Garde carmine', type: 'demon', car: car('3 4 2 4 3 5'), def: L(5),
  pp: 25, pfFix: 7, seuilsFix: seuils('5/10/15/20'),
  armes: [arme('Revolver petit calibre (arme estimée)', 'Revolver petit calibre', 3)],
  pouvoirs: pows('Jet de flammes 3, Incendie 3, Immunité contre le feu, Détection du bien 3, Armure corporelle 3, Peur 2, Régénération 2, Détection du danger 3, Anaérobiose, Tourbillon de feu 2, Corps gazeux, Charme 3, Volonté supra-normale 2, Lire les pensées 3'),
  talents: `Tir 3, Défense 5, Séduction 4, Rouler des joints 4 ; avertissement sans frais : besoin d'acte sexuel. ${PROMETHEE(3)}`,
  notes: `Grande rousse de 19 ans, mi-provocante mi-sainte-nitouche : chemisier, jupe plissée et couettes, mais bas résille et talons aiguilles démesurés. Mène Willy par le bout du nez.\n${GARDE}\nArme non précisée par le livre : revolver petit calibre estimé d'après son talent de Tir.`,
});
const arnold = npc('arnold', {
  nom: 'Arnold', source: 'Démon de Belial, grade 3 – Garde carmine', type: 'demon', car: car('2 4 4 3 2 5'), def: L(5),
  pp: 24, pfFix: 5, seuilsFix: seuils('4/8/12/16'), armes: [poing('5+')],
  pouvoirs: pows('Jet de flammes 4, Incendie 3, Armure corporelle 3, Immunité contre le feu, Réduction 4, Régénération 1, Détection du danger 2, Tourbillon de feu 2'),
  talents: `Corps à corps 5+, Défense 5, Combat 5, S'occuper des poissons rouges 3 ; avertissement sans frais : tic (« Qu'est-ce que tu me racontes là ? »). ${PROMETHEE(4)}`,
  notes: `Incarné dans un gamin noir de douze ans, petit, bouille sympathique et sourire permanent : joue l'enfant innocent, mais c'est un bagarreur cruel et vicieux.\n${GARDE}\nArme non précisée : attaque à mains nues avec Corps à corps 5+.`,
});
const willy = npc('willy', {
  nom: 'Willy', source: 'Démon de Belial, grade 3 – Garde carmine', type: 'demon', car: car('3 5 3 2 2 5'), def: L('6+'),
  pp: 26, pfFix: 5, seuilsFix: seuils('5/10/15/20'),
  armes: [arme('Batte (arme estimée)', 'Masse d\'arme ou batte', 7), poing(1)],
  pouvoirs: pows('Immunité contre le feu, Jet de flammes 3, Armure corporelle 3, Incendie 3, Invisibilité 3, Non-détection 3, Régénération 3'),
  talents: `Combat 7, Défense 6+, Basket-ball 5 ; avertissement sans frais : kleptomanie. ${PROMETHEE(3)}`,
  notes: `Grand ado noir, mince et musclé, coupe afro courte, habillé en petit bourgeois catholique (chemisette, pull marin, velours, mocassins). Obnubilé par Virginia, qui en fait ce qu'elle veut : il la protège toujours en combat.\nPendant l'assaut de la villa, descend avec Madame Garret à la cave pour exfiltrer les prisonniers.\n${GARDE}\nArme non précisée : batte estimée pour son talent de Combat 7.`,
});
const garret = npc('garret', {
  nom: 'Madame Garret', source: 'Démone de Belial, grade 3 – Garde carmine (intendante)', type: 'demon', car: car('6 1 3 3 1 5'), def: L(2),
  pp: 27, pfFix: 9, seuilsFix: seuils('8/16/24/32'),
  armes: [{ n: 'Aspirateur chromé', att: L('7+'), prec: -2, puis: 1, melee: true }],
  pouvoirs: pows('Jet de flammes 4, Incendie 4, Immunité contre le feu, Vitesse 3, Armure corporelle 4, Peur 3, Régénération 1, Détection du danger 2, Tourbillon de feu 2'),
  talents: `Combat 7+, Défense 2, Tir 3, Torture 3, Faire le thé 4 ; avertissement sans frais : grasse. ${PROMETHEE(4)}`,
  notes: `Grosse dame d'une cinquantaine d'années, chignon, tailleur beigeasse : mère poule souriante qui veille à la santé et à l'intendance du groupe. En combat, manie avec une redoutable efficacité un aspirateur chromé.\nPendant l'assaut de la villa, descend avec Willy à la cave pour exfiltrer les prisonniers.\n${GARDE}`,
});
const henry = npc('henry', {
  nom: 'Henry Leones', source: 'Sorcier humain, pisteur prisonnier de la Garde carmine', type: 'humain', car: car('1 1 2 4 2 2+'), def: 2,
  pfFix: 5, seuilsFix: seuils('5/10/15/20'), armes: [poing(1)],
  talents: 'Discussion 3, Aisance sociale 3, Baratin 2, Écrire des nouvelles fantastiques 4 ; sorcellerie : Pentacle pour ange 2, Invocation d\'un ange 2, Demande à un ange 2, Contrôle d\'un ange 2, Basse sorcellerie 3 ; sorts annexes : Vrai nom, Localisation',
  notes: `Vingtaine, long et maigre, grosses lunettes rondes, crâne rasé. Étudiant en sorcellerie et auteur de nouvelles (bière et bretzels) jusqu'à son enlèvement par les serviteurs de Belial pour pister les incarnations de la meuf. Malin : sa seule chance est de trahir ses employeurs.\nRepère les PJ dès qu'ils entrent dans la cave et les contacte par télépathie pour qu'ils le libèrent, contre tout ce qu'il sait.\nCe qu'il sait : la meuf est une humaine morte que Belial essaie d'invoquer ; les corps d'accueil humains ne tiennent pas (combustion spontanée en quelques jours ou quelques heures) ; l'invocation ratée la fait osciller entre Marches et Terre et la Garde est là pour effacer les traces ; elle sera bientôt proche de la Terre (quand, il l'ignore) et Belial a un projet pour cette occasion ; l'esprit de l'hôte reste et se mélange à celui de la meuf, d'où la prophétie ; Drummond lui a dit que ça avait à voir avec la fin du monde.\nPas de PP ni de défense indiquée : défense fixée à 2 (niveau 1).`,
});

// ---------------- La Tierce irlandaise (Saint Patrick's Irish Crew) ----------------
const TIERCE = 'Membre de la Tierce européenne d\'Yves (la « Saint Patrick\'s Irish Crew »), basée en Irlande et en service depuis le VIe siècle : accent, tatouages celtiques, shamrocks, odeur de Guinness, 4L verte crachant des chansons traditionnelles. Bagarreurs mais très expérimentés et très intelligents. Tiers parti : ni alliés ni ennemis des PJ.';
const patrick = npc('saint-patrick', {
  nom: 'Saint Patrick', source: 'Ange d\'Yves, grade 3 – chef de la Tierce européenne', type: 'ange', car: car('4 3 3 5 3 5'), def: L(6), prot: 7,
  pp: 38, pfFix: 9, seuilsFix: seuils('7/14/21/28'), armes: [poing(6)],
  pouvoirs: pows('Aura de pacification 3, Télépathie 2, Philosophie 4, Charme 3, Bénédiction 1, Sommeil 2, Lire les pensées 2, Volonté supra-normale 3, Détection du futur proche 1, Augmentation de Volonté 2, Psychométrie 1, Arts martiaux 2, Esquive acrobatique 3, Invisibilité 1, Téléportation 2, Champ de force 2'),
  talents: 'Combat 6+, Corps à corps 6, Défense 6, Culture irlandaise 6, Gaélique 6, Savoir militaire 4 (tactique 7), Tenir l\'alcool 5 ; Bénédiction « guérison de folies » ; avantages : Section d\'enquête de serviteurs de Dieu (IRA – n\'intervient pas ici), Contact avec un politicien (Sinn Féin) ; gilet pare-balles béni (protection 7)',
  notes: `Ange quadragénaire de Belfast, froid, renfermé, solitaire et têtu ; près de deux mètres, épaules larges, bras comme des troncs, roux, taches de rousseur et collier de barbe. Évangélisateur de l'Irlande, chargé par Yves de veiller sur l'Angleterre, il préfère défendre la culture irlandaise.\n${TIERCE}\nPas d'arme indiquée : attaque à mains nues (Corps à corps 6, Arts martiaux).`,
});
const stout = npc('stout', {
  nom: 'Stout', source: 'Ange d\'Yves, grade 3 – Tierce européenne', type: 'ange', car: car('3 2 3 5 5 5'), def: L(6),
  pp: 35, pfFix: 8, seuilsFix: seuils('6/12/18/24'),
  armes: [arme('Revolver gros calibre (arme estimée)', 'Revolver gros calibre', 5), poing(5)],
  pouvoirs: pows('Télépathie 4, Philosophie 4, Charme 3, Bénédiction 1, Sommeil 2, Lire les pensées 2, Volonté supra-normale 3, Détection du futur proche 1, Augmentation de Volonté 2, Psychométrie 4, Détection des créatures invisibles 1, Polymorphie 4, Esquive acrobatique 1, Corps gazeux, Invisibilité 1, Téléportation 2, Déphasage 1, Non-détection 2+'),
  talents: 'Combat 6+, Tir 3 (armes de poing 5), Corps à corps 5, Discrétion 5, Défense 6, Culture irlandaise 5+, Gaélique 5, Tenir l\'alcool 4 ; Bénédiction « fertilité » ; avantage : Lieu de réunion (château)',
  notes: `Vingtaine apparente, blond, yeux verts, menton puissant, nez cassé avec élégance, plus d'1,90 m : plaît beaucoup aux femmes. Habitant de Derry, gardien des lutins et du gaélique depuis le Ve siècle ; le plus discret et subtil du trio.\nPendant l'assaut de la villa : Invisibilité, Déphasage dans la cave, puis Téléportation dehors avec Jocelyne qu'il range dans la 4L avant de se jeter dans la mêlée.\n${TIERCE}\nArme non précisée : revolver gros calibre estimé (Tir, armes de poing 5).`,
});
const pureMalt = npc('pure-malt', {
  nom: 'Pure Malt', source: 'Ange d\'Yves, grade 3 – Tierce européenne', type: 'ange', car: car('3 2 4 4 2 5'), def: L(6),
  pp: 35, pfFix: 7, seuilsFix: seuils('6/12/18/24'), armes: [poing(6)],
  pouvoirs: pows('Aura de pacification 2, Télépathie 2, Philosophie 4, Sommeil 2, Lire les pensées 2, Volonté supra-normale 2, Détection du futur proche 1, Psychométrie 3, Arts martiaux 3, Esquive acrobatique 1, Invisibilité 1, Téléportation 1, Régénération 3, Membre blindé, Décharge électrique 3'),
  talents: 'Combat 6, Corps à corps 6, Défense 6, Culture irlandaise 5+, Gaélique 5+, Baratin 7, Danses folkloriques irlandaises 5, Tenir l\'alcool 7+ ; avertissement sans frais : gras',
  notes: `Trentaine apparente, caricature d'Irlandais : gros ventre, oreilles décollées, nez rougi par la Guinness, cheveux roux frisés. Habitant de Cork, en poste depuis le Ve siècle ; jovial, blagueur, toujours prêt à payer sa tournée… et à la fois très malin et très bourrin.\n${TIERCE}\nPas d'arme indiquée : attaque à mains nues (Corps à corps 6, Arts martiaux, Membre blindé).`,
});

// Le bestiaire joint (types réutilisables) : mêmes fiches, sans quantité
const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });

// ---------------- Scènes ----------------
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  scene('briefing', '1. Jogging like Hell : le briefing', 'Centre de Tri, Paris – samedi, petit matin gris',
    `Environ dix jours après « Run like Hell ». Monsieur Fabien convoque les PJ et leur montre un article d'Ouest-France : Nathalie Hémon, Miss Bretagne en route pour Miss France, disparue jeudi, retrouvée morte vendredi à l'aube par un touriste dans le ravin du sentier des Plomarc'h, à Douarnenez. Ni violence ni effraction ; l'inspecteur Ascoët attend l'autopsie ; on l'aurait vue parler à un inconnu la veille de sa mort. Le journal évoque aussi la montée de la violence en Bretagne (cache d'armes du FLB).
Pour Fabien, c'est encore un coup d'Andrealphus : billets de TGV pour Quimper dans la matinée et chambres d'hôtel déjà réservés. Mission : retrouver enfin le prince du sexe, mais discrètement (la guerre civile met les démons en position délicate face aux anges, qui ne doivent pas se lancer eux aussi sur la piste), et camoufler l'étrangeté de l'affaire en livrant à la police un coupable local. Conseils de prudence, rapport téléphonique régulier.

Vérité (pour le MJ) : Andrealphus n'y est pour rien. Belial essaie depuis le début de la campagne d'invoquer son ex, la meuf (humaine morte qui oscille entre Paradis, MRC et Terre, déjà croisée en rêve dans « La Bibliothèque du Marchand de Sable »). Elle s'incarne malgré elle dans des corps d'accueil qui finissent par une combustion spontanée. Elle possédait Nathalie, mais le hasard s'en est mêlé : André Carrefour, tueur en série local, a empoisonné la jeune femme avant terme. La meuf a trouvé un nouvel hôte, Jocelyne Rochot. Yves a envoyé sa Tierce irlandaise (trois anges) chercher la meuf ; Belial a envoyé cinq membres de la Garde carmine et un sorcier pisteur pour effacer les traces et exploiter ses dons de prophétie (il veut savoir quand il accédera au trône).
Aurélie (si elle vit encore) renseigne le Daemonis Malificum et s'est rangée du côté de Belial : le prince du feu connaît la mission des PJ (sinon, Baalberith l'a apprise par le micro qu'elle avait posé dans le bureau de Fabien).`,
    [inScene(fabien)]),
  scene('douarnenez', '2. Aux sombres héros de l\'amer : arrivée à Douarnenez', 'Quimper puis Douarnenez – hôtel de la place de l\'Enfer, samedi',
    `De Quimper, voiture de location ou car jusqu'à Douarnenez (« Douar an Enez », la terre de l'île : Douarnenez, Ploaré, Tréboul, Pouldavid). Ville de pêche sur le déclin, plages (le Ris, Pors Cad, plage des Dames…), sentiers des Roches Blanches et des Plomarc'h, port du Rosmeur, port de plaisance de Tréboul, port-musée du Port-Rhu. Légendes locales sans incidence sur l'intrigue : Tristan et Iseult (l'île Tristan), la cité d'Ys et Dahut (une touche ajoutée par un ange de Didier).
L'hôtel est, ironiquement, place de l'Enfer : chambres confortables à la déco orange et marron des années Pompidou. Anne Edec et son fils Erwan accueillent les PJ (kouign-amann, Lancelot). Anne connaissait Nathalie et donne l'adresse des parents si on le lui demande gentiment.`,
    [inScene(anneEdec)]),
  scene('enquete', '3. Et la lauréate est… : l\'enquête', 'Douarnenez – sentier des Plomarc\'h, commissariat, maison des Hémon – dimanche',
    `Pistes : la victime, ses parents, la police, le lieu du crime.
• Les Plomarc'h : sentier qui monte au-dessus de la baie depuis le port de pêche, vestiges gallo-romains, aires de jeu. Un pilier de comptoir à qui l'on paie à boire indique l'endroit ; la police a déjà tout nettoyé, aucun indice. Balade agréable.
• La police : l'inspecteur Ascoët envoie promener les curieux sans une très bonne excuse. Il n'en sait guère plus que le journal : touriste relâché, autopsie sans trace de traumatisme, suspects habituels inconsistants (Rachid, les rôlistes, Henri Petitbois). Pouvoirs ou violence contre un policier : mauvais pour la discrétion.
• Les parents : Guy (extrême droite catho) et Marie (éplorée). La chambre de Nathalie, sans caractère, contient l'indice clé : un dessin au fusain d'une jeune femme noire se baignant, vue de dos, observée par deux hommes portant des pendentifs « B » et « C ». Nathalie dessinait les visions de la meuf pendant la possession. Prévenu, Fabien est aussi surpris que les PJ : continuer l'enquête, prudemment, et trouver vite un coupable.
• Marion Leguennec, la meilleure amie : sérieuse et gentille Nathalie ; mise en confiance, elle parle des rôlistes (son cousin Bernard et ses amis) et des mœurs d'Henri Petitbois.`,
    [inScene(ascoet), inScene(guyHemon), inScene(marion)]),
  scene('dirty-work', '4. Dirty work : fabriquer un coupable', 'Douarnenez – plage du Ris, comité Miss France, cave de Tristan – dimanche',
    `Les PJ doivent faire porter le chapeau à un innocent. Laisser les joueurs inventer et improviser, sans leur rendre la tâche trop facile, et leur montrer le côté sale de leur travail : la population est remontée, une manifestation de vindicte populaire ou une tentative de lynchage est possible si le pigeon est mal vu.
Les trois suspects déjà dans le collimateur de la police :
• Rachid, sans-papiers kurde caché sur la plage du Ris : vu parlant avec Nathalie, introuvable depuis le meurtre ; il suffit de glisser sur lui des affaires de la victime et de le livrer (la police sera brutale).
• Henri Petitbois : les cassettes de ses ébats avec Nathalie, si la police les trouve, en font un suspect parfait.
• Les rôlistes : jeux macabres, chasses à l'ange en forêt, profanations, avances repoussées par Nathalie (dont le cousin Bernard).
Si les joueurs choisissent d'autres victimes, improviser.`,
    [inScene(rachid), inScene(petitbois), inScene(rolistes)], false,
    [choice('coupable', 'À qui les PJ font-ils porter le chapeau ?', [
      ['Rachid', 'Affaires de Nathalie cachées sur lui, livré à la police : arrestation musclée, l\'affaire se tasse côté presse ; risque de lynchage si la rumeur court avant.'],
      ['Henri Petitbois', 'Les cassettes trouvées chez lui en font le suspect idéal (avoir voulu faire taire la belle) ; scandale local.'],
      ['Les rôlistes', 'Jeux de rôle « sataniques », chasses à l\'ange et profanations : la population s\'enflamme, débordements possibles.'],
      ['Un autre bouc émissaire', 'Improviser selon le plan des joueurs.'],
      ['Personne pour l\'instant', 'La police et la presse continuent de fouiner ; le meurtre d\'Émeline Duchez (lundi) relance l\'affaire.'],
    ])]),
  scene('drummond', '5. Personne au monde ne marche du même pas : Monsieur Drummond', 'Hôtel de la place de l\'Enfer – bar, lundi',
    `En rentrant à l'hôtel, la logeuse annonce un visiteur au bar : un homme âgé, élégant, écharpe rouge carmin, Monsieur Drummond, qui les invite au thé et ne cache ni sa nature ni son appartenance à l'élite du prince du feu. Belial sait (par Aurélie) que les PJ sont là et veut s'assurer de leur collaboration ; Drummond les croit encore sur la fausse piste d'Andrealphus et les traite en alliés manipulables (plus froidement s'ils ont été reconnus dans les rixes précédentes).
Conversation feutrée et hypocrite : chacun essaie de tromper l'autre et de jauger ce qu'il sait. Drummond oriente les PJ vers une fausse piste : Andrealphus aurait fait des recherches à la bibliothèque sur la cité d'Ys et loué un bateau la veille. Des PJ habiles peuvent apprendre qu'il est de la Garde carmine avec une équipe complète, qu'il sait la reine de beauté possédée par la meuf, qu'il reste sur place, et qu'il connaît leur mission. S'ils sont lents, c'est lui qui découvre qu'ils savent pour la meuf, et il se ferme. Il part au bout de quelques minutes en conseillant à demi-mot de ne pas se mêler de ses affaires ; un van noir de location aux vitres teintées passe le prendre.
Aussitôt après, l'inspecteur Ascoët entre, énervé : une nouvelle victime, Émeline Duchez. Questions sur la nuit des PJ, papiers d'identité, fouille des chambres, questions sur la botanique et les champignons. Si on le fait parler : traces d'un poison artisanal aux champignons locaux dans le sang de Nathalie (non publié). Bizarre pour une possédée, mais c'est la piste à suivre.`,
    [inScene(drummond), inScene(ascoet)], false,
    [choice('the', 'Comment tourne la conversation avec Drummond ?', [
      ['Les PJ le percent à jour', 'Ils apprennent qu\'il est de la Garde carmine avec une équipe complète, qu\'il sait pour la meuf, qu\'il reste sur place et connaît leur mission ; ils gardent l\'avantage.'],
      ['Match nul', 'Chacun garde ses cartes ; les PJ repartent avec la fausse piste de la bibliothèque et du bateau (cité d\'Ys).'],
      ['Drummond prend l\'avantage', 'Il comprend qu\'ils savent pour la meuf et se ferme comme une huître : la Garde carmine sera sur ses gardes à la villa.'],
    ])]),
  scene('carrefour', '6. Dementia profondis : André Carrefour', 'Douarnenez – pharmacie et appartement d\'André Carrefour, lundi',
    `Le coupable est facile à trouver, c'est un notable : la logeuse (question sur les préparations aux champignons) ou la tournée des médecins, étudiants en chimie et pharmacies mènent au pharmacien André Carrefour, auteur des deux meurtres.
• De jour, à la pharmacie bondée : sourire et mensonges par omission (connaît bien les champignons, ne connaissait pas Nathalie, jamais de décoction mortelle). Détection du mensonge : efficace s'il franchit ses défenses mentales (difficile). La manière forte est impossible sans briser la discrétion.
• Effraction de l'appartement au-dessus : alarme dans la boutique, André arrive quelques minutes plus tard. Le soir, il erre en « repérage » jusqu'à minuit environ : champ libre.
• L'appartement : loft blanc d'un ordre maniaque (bibelots espacés de 6,66 cm). Double fond du minibar : champignons vénéneux. Derrière une tenture, écrits avec son sang : colonnes de mensurations numérotées, noms de tous les princes-démons et d'une centaine de démons, et sous le numéro et les mesures de Nathalie : « Trône » et « Fin du monde » (ses derniers mots).
Il n'y a rien à tirer d'André, mécanique meurtrière qui ignore pourquoi il a écrit ces noms (il les entend en dormant) et ne sait rien d'Andrealphus ni de la meuf. Fabien conseille de se débarrasser de l'empoisonneur. Au combat, il Charme le démon le plus bourrin pour qu'il attaque ses camarades et grille ses PP, mais ne tient pas face au nombre. Son corps ne disparaît pas : il faut s'en débarrasser (le livre laisse le mystère ouvert).`,
    [inScene(andre)], true,
    [choice('andre', 'Que deviennent André Carrefour et son corps ?', [
      ['Éliminé, corps escamoté', 'Le tueur disparaît sans bruit ; les meurtres cessent et la piste du coupable fabriqué tient.'],
      ['Éliminé, corps laissé ou mal caché', 'Un notable mort de façon suspecte : Ascoët et la presse s\'agitent, la discrétion en prend un coup.'],
      ['Livré à la police', 'Preuves de l\'appartement (champignons, inscriptions) : affaire close côté humains, mais les noms des princes-démons sur le mur posent question.'],
    ])]),
  scene('sorcier', '7. C\'est pas sorcier : la piste de la villa', 'Quimper (Vroom Locations), agences immobilières, abords de la villa – lundi soir / mardi',
    `Partie optionnelle : les PJ peuvent déjà avoir compris que le meurtre est une fausse piste. Sinon, la Tierce irlandaise leur donne un coup de pouce en taguant à la bombe verte le nom du démon de Belial sur les murs de leurs chambres.
Drummond a lui-même loué le van à Quimper sous un faux nom avec faux papiers, mais un employé de Vroom Locations se souvient de lui (« accompagné par Arnold et Willy ») et donne le nom de la location : Georges Michel. Chou blanc dans les hôtels ; les agences immobilières révèlent une petite villa louée sous la même identité à quelques kilomètres de Douarnenez.
Sur place : Drummond et son équipe y sont en permanence et y interrogent, sans grand résultat, la poissonnière. Cinq démons de Belial à écharpe rouge : une attaque frontale est une très mauvaise idée, le faire bien comprendre aux joueurs.
La Tierce (Saint Patrick, Stout, Pure Malt) rôde dans les environs en 4L verte : tiers parti, elle cherche la meuf pour Yves.`,
    [inScene(patrick), inScene(stout), inScene(pureMalt)]),
  scene('villa', '8. La villa de la Garde carmine', 'Villa louée près de Douarnenez – deux étages et une cave, mardi',
    `Infiltration : un démon patrouille en permanence dans le jardin, aucune alarme. La cave abrite les prisonniers, Jocelyne Rochot et Henry Leones, le sorcier pisteur. Dès que les PJ y entrent, Henry les repère et leur parle par télépathie : il indique sa pièce et promet de tout dire s'ils le sauvent. Porte épaisse, serrure facile à crocheter.
Dès que les PJ entrent dans sa pièce, la Tierce attaque : énorme explosion à l'étage et chaos total. Madame Garret et Willy descendent à la cave exfiltrer les prisonniers et tombent sur les PJ ; les autres démons de Belial affrontent Saint Patrick et Pure Malt ; Stout entre dans la cave (Invisibilité, Déphasage), se téléporte dehors avec Jocelyne, la range dans la 4L et se jette dans la mêlée.
Idéalement, les PJ sont au milieu du carnage quand Jocelyne sort de la voiture en psalmodiant quelque chose d'incompréhensible, puis s'enflamme et fond de l'intérieur (combustion spontanée). Henry hurle qu'il dira tout si on l'aide à fuir. Drummond et ses compagnons survivants tentent de poursuivre les PJ, la Tierce à leurs trousses : les anges éliminent les démons de Belial mais laissent fuir les PJ (ils savent ce qu'ils voulaient et Yves pense que les PJ ont un rôle à jouer).
PNJ du combat : la Garde carmine (adversaires). La Tierce, Henry et Jocelyne sont décrits dans les scènes voisines.`,
    [inScene(drummond), inScene(virginia), inScene(arnold), inScene(willy), inScene(garret)], true,
    [choice('villa', 'Comment les PJ abordent-ils la villa ?', [
      ['Infiltration discrète par la cave', 'Henry les contacte par télépathie ; l\'assaut de la Tierce éclate quand ils ouvrent sa porte : Garret et Willy leur tombent dessus à la cave.'],
      ['Attaque frontale', 'Les cinq gardes de grade 3 les reçoivent au complet avant l\'arrivée de la Tierce : très dangereux.'],
      ['Ils restent en observation', 'La Tierce attaque seule ; les PJ assistent de loin à la combustion de Jocelyne et peuvent récupérer Henry en fuite.'],
    ])]),
  scene('omen', '9. A good omen : l\'interrogatoire d\'Henry', 'En lieu sûr, puis le train du retour pour Paris – mardi',
    `Au calme, Henry raconte : la meuf est une humaine morte que Belial essaie d'invoquer depuis un moment ; les corps d'accueil humains ne tiennent pas et finissent en combustion spontanée au bout de quelques jours ou heures ; l'invocation ratée la fait osciller entre les Marches et la Terre, et la Garde carmine est là pour effacer les traces. Elle se rapprochera de la Terre d'ici quelque temps (il ne sait pas quand) et Belial semble avoir un projet pour cette occasion. D'après les conversations des démons, l'incarnation ne chasse pas l'esprit de l'hôte : leurs esprits se mêlent, ce qui donne à la meuf le don de prophétie. Il n'a jamais eu le droit d'approcher les incarnations, mais Drummond lui a avoué que cela avait à voir avec la fin du monde.
Fabien laisse carte blanche pour Henry mais ordonne de rentrer au plus vite : cette histoire de fin du monde ne le rassure pas du tout. Les PJ prennent le train pour Paris (suite : « Interzone », qui commence par l'attaque du Centre de Tri par la Garde carmine).`,
    [inScene(henry), inScene(fabien)], false,
    [choice('henry', 'Que font les PJ d\'Henry Leones ?', [
      ['Ils le ramènent au Centre de Tri', 'Fabien récupère un sorcier capable de pister la meuf ; Belial a une raison de plus d\'en vouloir au Centre (voir « Interzone »).'],
      ['Ils le relâchent', 'Henry disparaît dans la nature, trop heureux d\'avoir échappé à Belial.'],
      ['Ils le tuent', 'Plus de témoin humain ; ce qu\'il savait ne survit que dans le rapport des PJ.'],
    ])]),
];

const scenario = {
  id: 'fire-and-ice-13-strategie-du-pourtour',
  nom: 'Fire and Ice (scénario 13) – La stratégie du pourtour',
  resume: `Dies Irae, scénario 13 (INS), premier de l'acte, suite de « Run like Hell ». La mort mystérieuse de Nathalie Hémon, Miss Bretagne, à Douarnenez, envoie les PJ en Bretagne sur une supposée piste d'Andrealphus. Ils enquêtent, fabriquent un coupable pour la police, démasquent le vrai tueur (le pharmacien André Carrefour), croisent Monsieur Drummond de la Garde carmine, puis remontent jusqu'à la villa où Belial retient la nouvelle hôte de la meuf et un sorcier pisteur, en plein assaut de la Tierce irlandaise d'Yves. Ils y apprennent pourquoi tout le monde court après la meuf : Belial veut l'invoquer et elle prophétise la fin du monde.`,
  notes: `Source : ${REF}. Aide de jeu « Tempus Fugit », p. 153-154.
Scénario d'enquête avec beaucoup de fausses pistes et d'intrigues secondaires : il demande aux joueurs réflexion et évaluation des forces en présence ; joué en bourrins, ils se feront écraser.
Déroulement : briefing au CdT → Douarnenez (hôtel place de l'Enfer) → enquête (Plomarc'h, police, parents, Marion) → fabrication d'un coupable → Drummond et Ascoët → André Carrefour → piste de la villa (optionnelle) → assaut de la villa → interrogatoire d'Henry → retour à Paris.

Récompense : le livre n'indique pas de PA pour ce scénario.

Les forces en présence :
• Les PJ, pour Fabien/Baalberith : retrouver Andrealphus, discrètement, et étouffer l'affaire.
• La Garde carmine de Belial (Drummond, Virginia, Arnold, Willy, Madame Garret), cinq démons de grade 3, plus le sorcier Henry Leones : effacer les traces des invocations ratées de la meuf et exploiter sa prophétie (Belial veut connaître la date de son accession au trône).
• La Tierce européenne d'Yves (Saint Patrick, Stout, Pure Malt), trois anges de grade 3 : chercher la meuf. Elle aide discrètement les PJ (tags verts) puis élimine la Garde.
• André Carrefour, tueur en série possédé : le hasard qui a tué Nathalie avant terme.
• Aurélie (si elle vit) renseigne le Daemonis Malificum et Belial.

Chronologie (Tempus Fugit ; une dizaine de jours après le scénario précédent) : jeudi, disparition de Nathalie Hémon ; vendredi, corps retrouvé par un touriste écossais ; samedi, article d'Ouest-France, briefing au CdT et départ pour Douarnenez ; dimanche, enquête et fabrication d'un coupable idéal ; lundi, entrevues avec Drummond et l'inspecteur Ascoët, identification et élimination d'André Carrefour ; mardi, villa de la Garde carmine, baston contre les Belial, interrogatoire d'Henry Leones, train de retour pour Paris. Suite : « Interzone » (attaque du CdT par la Garde carmine dès l'arrivée à Paris, révélation de Fabien, voyage au Purgatoire pour consulter le dossier de Nathalie Hémon et entendre sa prophétie).

Fiches adaptées du livre : caractéristiques en niveaux INS/MV (Ch des humains reporté en Foi). Le pouvoir Feu de Prométhée (Garde carmine), absent des règles de l'application, est indiqué dans les talents. Les armes non précisées sont estimées et signalées dans chaque fiche. Monsieur Fabien : fiche commune de la campagne (« Le Centre de Tri »).`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [fabien, anneEdec, ascoet, guyHemon, marion, rachid, petitbois, rolistes, jocelyne, andre,
  drummond, virginia, arnold, willy, garret, henry, patrick, stout, pureMalt].map(asType);

// Contrôle : pouvoirs inconnus des règles
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));

writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types,', scenes.reduce((a, s) => a + s.choix.length, 0), 'choix');
