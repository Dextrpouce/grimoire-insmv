// Génère le fichier d'import « insmv-scenario » pour « C'est mon ami et bien plus encore » (Fire and Ice 2, p. 11-24,
// + prolégomènes p. 7-10, « La guerre en Enfer » p. 25-34, « Tempus Fugit » p. 152-154)
// usage : node gen-fire-and-ice-10-c-est-mon-ami.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Fire and Ice 2, « C\'est mon ami et bien plus encore », p. 11-24';
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

let n = 0; const id = (p) => `fi10-${p}`;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [poing(1)], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});

// ---------------- Centre de Tri : fiches officielles (Fire and Ice, « Le Centre de Tri », p. 24-26) ----------------
// Objet FICHES repris tel quel de fix-centre-de-tri.mjs
const REF_CDT = 'Fire and Ice, « Le Centre de Tri », p. 24-26';
const FICHES = {
  fabien: { re: /fabien/i, nom: 'Monsieur Fabien', source: 'Démon de Baalberith, grade 2 (chef du Centre de Tri)', type: 'demon', car: car('2 2 5 4 2 4'), def: 2, pp: 24, pfFix: 6, seuilsFix: [4, 8, 12, 16],
    armes: [{ n: 'Coup de poing', att: 2, prec: 0, puis: -3, melee: true }],
    pouvoirs: pows('Message officiel, Télépathie 5, Boomerang 3, Cauchemar 3, Onde de choc 2, Téléportation 2, Corps gazeux, Détection du futur proche 2, Volonté supra-normale 2'),
    talents: 'Métier (administration) 7, Discussion 6, Baratin 4 ; avantage matériel : le Centre de Tri',
    note: 'Vétéran débonnaire, pipe, anecdote laponne. Secret : remplacé par Beleth (« le Grand Imposteur ») quelques semaines après l\'arrivée des PJ.' },
  gilbert: { re: /gilbert/i, nom: 'Gilbert', source: 'Démon de Morax, grade 1 (Centre de Tri)', type: 'demon', car: car('3 2 4 4 3 3'), def: 2, pp: 18, pfFix: 7, seuilsFix: [5, 10, 15, 20],
    armes: [{ n: 'Coup de poing', att: 2, prec: 0, puis: -3, melee: true }],
    pouvoirs: pows('Œuvre d\'art, Télépathie 4, Jet de flammes 2, Sommeil 2, Invisibilité 1, Vitesse 1, Vol 1'),
    talents: 'Tartiner de la poésie 7, Trier du courrier 3, Conduite 4, Pilotage 3, Tir 2+ ; avertissement sans frais : gentil',
    note: 'Délégué CGT, gardien des lettres non distribuées, poète médiocre, habitué de Chez Régis ; bavard une fois éméché. Secret : s\'est perdu un jour dans un dédale lumineux sous les caves.' },
  aurelie: { re: /aur[ée]lie/i, nom: 'Aurélie', source: 'Démon de Baalberith, grade 0 (secrétaire du Centre de Tri)', type: 'demon', car: car('3 3 3 5 2 2'), def: 2, pp: 10, pfFix: 8, seuilsFix: [5, 10, 15, 20],
    armes: [{ n: 'Corps à corps', att: L('3+'), prec: 0, puis: -3, melee: true }],
    pouvoirs: pows('Message officiel, Charme 2+, Lire les pensées 2, Télépathie 1, Polymorphie 1'),
    talents: 'Corps à corps 3+, Baratin 4+, Hobby (vélo) 3',
    note: 'Secrétaire bavarde et épuisante, chef en second ; fait chaque matin à vélo la tournée des boîtes aux lettres secrètes. Secret : membre infiltrée du Daemonis Maleficum, meurtrière de Vanessa.' },
};
const cdt = (key, notes) => {
  const f = FICHES[key];
  return {
    id: id(key), nom: f.nom, source: f.source, type: f.type, qty: 1, car: { ...f.car }, def: f.def, prot: 0, pfFix: f.pfFix, pp: f.pp, seuilsFix: [...f.seuilsFix],
    armes: JSON.parse(JSON.stringify(f.armes)), pouvoirs: JSON.parse(JSON.stringify(f.pouvoirs)), talents: f.talents, esquive: false, volonte: false,
    notes: [notes, f.note, `Caractéristiques : ${REF_CDT}.`].filter(Boolean).join('\n'),
  };
};

const fabien = cdt('fabien', 'Rôle ici : convoque les PJ trois jours après « Nuit bleue », yeux rougis par l\'écran, et les envoie à Perpignan sur un message venu des bureaux de Baalberith (une « offensive angélique » qui n\'existe pas). Tous frais payés par le Centre. À la fin, reçoit le dossier des PJ (ou celui d\'Aurélie) et le transmet en Enfer.\nSecret MJ : c\'est Beleth qui occupe son corps ; il ignore tout du complot de Baalberith.');
const gilbert = cdt('gilbert', 'Rôle ici : sert le thé en salle de pause avec Aurélie et se montre de plus en plus pessimiste sur la guerre de succession.');
const aurelie = cdt('aurelie', 'Rôle ici : accompagne les PJ à Perpignan et s\'occupe des contacts locaux. Incompétente pour tout effort physique, très bonne dans l\'administratif. Peu d\'initiatives, saillies hystériques, mais insiste lourdement pour que l\'enquête avance.\nDouble jeu (Daemonis Malificum) : avec Valoche, elle tue Lentenoir le soir de l\'arrivée ; elle joue « Bright », faux ange de Dominique et du Labyrinthe (curé en soutane noire, teint gris, cheveux rares, grand chapelet), au volant du break Volkswagen ; elle sucre les réservoirs des PJ avant Prades et aide Denver contre Straight. Meilleure amie de Valoche.');

// ---------------- Démons de Perpignan ----------------
const anais = npc('anais', {
  nom: 'Anaïs « la limande »', source: 'Démone de Kronos, grade 1 – Luxe Studio', type: 'demon', car: car('2 2 5 5 2 3'), def: 2,
  pp: 12, pfFix: 7, seuilsFix: seuils('4/8/12/16'), armes: [],
  pouvoirs: pows('Projection temporelle 1, Déplacement temporel 2, Détection du futur proche 2, Télépathie 1, Sommeil 1'),
  talents: 'Savoir occulte 2 (administration infernale 5), Sens de l\'organisation 5, Classeur/fichier/perforeuse/trombone 4, Informatique 4, Chuinter en travaillant 3',
  notes: 'Grande perche de près de deux mètres, cheveux décolorés en parasol, dents en avant et défaut d\'élocution qui postillonne. Timide, rougit, tripote sa jupe quand elle se sent en faute. Seule avec ses dossiers, c\'est une virtuose de l\'administratif ; sur le terrain, nulle.\nAvec Jasmin, l\'organisation infernale de Perpignan en pleine crise : façade de microboîte de PAO (Luxe Studio, bulletin municipal). Ils avaient demandé de l\'aide il y a deux mois… pour ranger leurs archives. Étrangers au complot, ils aiguillent malgré eux les PJ.\nPas d\'arme ni de défense donnée : défense 2.',
});
const jasmin = npc('jasmin', {
  nom: 'Jasmin « le shooté »', source: 'Démon de Vapula, grade 1 – Luxe Studio', type: 'demon', car: car('2 3 4 4 2 3'), def: 2,
  pp: 11, pfFix: 6, seuilsFix: seuils('4/8/12/16'), armes: [],
  pouvoirs: pows('Invention 2, Trait d\'énergie 2, Détection du danger 1, Douleur 1'),
  talents: 'Informatique 7+, Mac Gyving 5, Discussion 4, Conduite 3, Culture générale 2 (musiques traditionnelles jamaïcaines 4), Monoculture intensive sous des lampes au sodium 4',
  notes: 'Grand ado méditerranéen au teint mat, pulls aux manches trop longues, cheveux frisés dans les yeux, yeux rougis par l\'écran. « Coolitude » absolue : vit deux fois plus lentement que tout le monde. Webmaster d\'un site de jardinage en placard. Très bon infographiste (il a dessiné l\'affiche de la conférence).\nIndice : la veille de l\'arrivée des PJ, un certain Straight, démon d\'Andromalius, est passé lui demander si Lentenoir était un démon local (réponse : non) ; il peut le décrire précisément.\nPas d\'arme ni de défense donnée : défense 2 (Trait d\'énergie pour se battre).',
});

// ---------------- Humains et anges de l'enquête ----------------
const ursule = npc('ursule', {
  nom: 'Ursule Jeanpaulhan', source: 'Ange de Jean-Luc, grade 0 – policier de Perpignan', type: 'ange', car: car('5 4 3 3 2 2'), def: L('4+'),
  pp: 8, pfFix: 8, seuilsFix: seuils('8/16/24/32'),
  armes: [arme('Revolver de service', 'Revolver petit calibre', 4), poing(1)],
  pouvoirs: pows('Armure corporelle 2, Sacrifice ultime 1, Champ électrique 1, Conversion physique 1, Immunité contre l\'électricité'),
  talents: 'Défense 4+, Tir 2 (armes de poing 4), Savoir militaire 2 (procédures policières 4), Discrétion 3, Psychologie 3',
  notes: 'Flic affable aux tempes grises et aux yeux malicieux, « flic gentil » qui laisse toujours le bénéfice du doute. Loyauté angélique à pleurer : moitié de sa paye à Notre-Dame, le reste au Secours catholique, courses équitables, veillées œcuméniques.\nArrive avec la police chez Lentenoir ; étouffe ensuite l\'affaire. Si les PJ sont trop peu discrets, prévient Notre-Dame et mène l\'« enquête préliminaire » avec des soldats de Dieu déguisés en pionniers ; une fois convaincu, fait arrêter les PJ puis les fait abattre discrètement en garde à vue.\nArme non précisée (« armes de poing ») : revolver de service petit calibre retenu.',
});
const soldats = npc('soldats', {
  nom: 'Soldats de Dieu « pionniers »', source: 'Soldat de Dieu typique (Livre de base) aux ordres d\'Ursule', type: 'soldat', qty: 4,
  car: car('3 2+ 2 2+ 1+ 3'), def: L('2+'), pp: 8, pfFix: 5, seuilsFix: seuils('4/8/12/16'),
  armes: [arme('Pistolet-mitrailleur', 'Pistolet-mitrailleur', 3), arme('Grenade (×2)', 'Grenade', 3)],
  talents: 'Athlétisme 3, Combat 2, Conduite 2+, Corps à corps 2, Intimidation 2, Savoir militaire 2 (tactique 2+), Survie 1 (au choix 2+), Tir 2 (au choix 3)',
  notes: 'Le livre cite seulement « une faction de soldats de Dieu déguisés en pionniers » : valeurs du soldat de Dieu typique (livre de base, p. 88), nombre estimé. Un pouvoir défensif et un pouvoir utilitaire au choix au niveau 1.',
});
const loris = npc('loris', {
  nom: 'Loris Giaddana', source: 'Humain, thésard en paléontologie', type: 'humain', car: car('1 1 2 3 2 2'), def: 2,
  pfFix: 4, seuilsFix: seuils('2/4/6/8'), armes: [],
  talents: 'Science 2 (paléontologie 3), Informatique 2+, Conduite 2, « Hail Eris ! » 2, Greuh 2',
  notes: 'Mi-vingtaine, cheveux noirs dressés sur la tête, parle très vite en se frottant les mains, tics nerveux. Trois mois de fouilles sous escorte de chefs de guerre dans le Panchir l\'ont rendu paranoïaque : ne tourne jamais le dos à une fenêtre, sursaute au moindre bruit. Susceptible : mal abordé, il part en vrille et déblatère sur le « discordianisme ».\nDepuis la disparition de Lentenoir, réfugié chez sa copine Claire Martinez, chez les parents de celle-ci à Albi (famille bourgeoise méfiante).\nBien mis en condition, mine d\'informations : le balouchosaure (créature unique), le séjour afghan, et surtout, s\'il est pressé, que les os sont dans une chambre forte du muséum (seuls lui, Lentenoir et le directeur le savent).\nPas d\'arme ; défense 2. Humain : Ch reportée en Foi, pas de PP.',
});
const gardiens = npc('gardiens', {
  nom: 'César, Panisse, Escartefigue et Eblis O\'Shaughnessy', source: 'Humains, gardiens de nuit du muséum', type: 'humain', qty: 4, car: car('2 1 2 1 2 2'), def: 2,
  pfFix: 3, seuilsFix: seuils('3/6/9/12'),
  armes: [arme('Matraque en caoutchouc', 'Matraque', '2+')],
  talents: 'Métier (gardien) 3, Corps à corps 2+, Tenir l\'alcool 2, Jouer à la manille 2, « Tu me fends le cœur » 2',
  notes: 'Trois caricatures pagnolesques (petit gilet, moustache improbable, accent à couper au couteau, odeur de criée) et un colosse au physique de basketteur américain. Fonctionnaires fiers de l\'être, pas courageux : face à des intrus, ils appellent la police. Entre deux rondes, manille et perroquets. Ils ont un double de la clé de la chambre forte.\nDéfense non donnée : 2.',
});

// ---------------- Daemonis Malificum ----------------
const valoche = npc('valoche', {
  nom: 'Valoche (alias Straight)', source: 'Démone de Baalberith, grade 1 – membre du Daemonis Malificum (se fait passer pour Straight, démon d\'Andromalius)', type: 'demon',
  car: car('2 3 3 5 3 3'), def: L(4), pp: 18, pfFix: 7, seuilsFix: seuils('4/8/12/16'),
  armes: [arme('Épée', 'Épée longue', 4), poing(3)],
  pouvoirs: pows('Polymorphie 3, Message officiel, Télékinésie 2, Volonté supra-normale 2, Télépathie 3, Armure corporelle 1, Corps gazeux'),
  talents: 'Séduction 7+, Comédie 4, Discrétion 5, Défense 4, Combat 4, Corps à corps 3, « Ça fait mal quand j\'appuie là ? » 3 ; Limitation : Daemonis Malificum',
  notes: 'Vraie forme : pin-up brune à forte poitrine. Les PJ la voient surtout en Straight, soi-disant grade 1 d\'Andromalius et membre du Labyrinthe : beau garçon de vingt ans, style étudiant en droit (jean à pli, veste de velours noir col relevé, mocassins).\nAnge déchu rendu fou par la Chute : hait anges et démons, prête à mourir pour la cause. Meilleure amie d\'Aurélie.\nEn scène finale, si les PJ l\'aident contre Denver, elle se retourne contre eux et se bat jusqu\'à la mort ; sinon elle se fait « tuer » par la bête avec l\'aide d\'Aurélie.\nArme : « se bat à l\'épée » ; épée longue retenue (valeurs des règles). Limitation (Daemonis Malificum) reportée dans les talents.',
});
const ishtar = npc('ishtar', {
  nom: 'Ishtar (alias Denver, le dinosaure de Dieu)', source: 'Démon de Caym, grade 2 – membre du Daemonis Malificum', type: 'demon',
  car: car('6 4 3 2 2 4'), def: 2, pp: 19, pfFix: 8, seuilsFix: seuils('8/16/24/32'),
  armes: [
    { n: 'Griffes (Membre exotique)', att: L(5), prec: 0, puis: 4, melee: true },
    { n: 'Ergots (Membre exotique)', att: L(5), prec: 1, puis: 3, melee: true },
    { n: 'Petites cornes (Membre exotique)', att: L(5), prec: -2, puis: 1, melee: true },
  ],
  pouvoirs: pows('Transformation 3, Augmentation de Force 1, Vitesse 1, Membre exotique : ergots, Membre exotique : griffes, Membre exotique : petites cornes, Absorption de force 1, Étouffement 1, Armure corporelle 1, Vol 1'),
  talents: 'Corps à corps 5, Survie 3+, Athlétisme 3, « Oh, non, pas Morton Fizbac ! » 3 ; Limitation : Daemonis Malificum',
  notes: 'Vraie forme : petit garçon propret d\'une dizaine d\'années, raie sur le côté, lunettes à la Harry Potter, petite voix fluette qui part dans les aigus (même transformé). Boit du whisky sec.\nDenver : chimère grâce à une faille du pouvoir de son prince (corps de rhinocéros, écailles de serpent, cou de girafe, queue de crocodile, tête d\'ornithorynque) ; Augmentation de Force et Étouffement pour faire illusion. Sa seule faille : il en fait trop.\nAvec Valoche, a vidé la chambre forte du muséum (charge en rhinocéros contre le mur, os jetés aux égouts), puis s\'est caché dans une cabane près de Prades d\'où il terrorise la région la nuit.\nAttaques : Corps à corps 5 avec les membres exotiques (précision et puissance des règles). Défense non donnée : 2 (estimée).',
});
const alonzo = npc('alonzo', {
  nom: 'Alonzo', source: 'Démon, membre du Daemonis Malificum (agent de liaison à Paris)', type: 'demon', armes: [],
  notes: 'Méditerranéen mal rasé en salopette verte, sirote une Suze en se grattant. Présent à la réunion du Daemonis Malificum du prologue ; c\'est l\'agent de liaison parisien de l\'opération « Jurassic Park ». N\'intervient pas dans ce scénario (on le retrouve plus tard dans la campagne).\nFiche minimale (pas de caractéristiques dans ce scénario).',
});

// ---------------- PNJ sans caractéristiques ----------------
const darond = npc('darond', {
  nom: 'Lucien et Ginette Darond', source: 'Humains, retraités franciliens voisins de Lentenoir', type: 'humain', qty: 2, armes: [],
  notes: 'Seuls habitants à l\'année du village-vacances en saison basse. Accent et mépris du Parisien de souche, gonflants, solitaires, ennuyeux… et seuls témoins crédibles.\nLa veille de la conférence, vers 18 h, un break Volkswagen marron devant chez Lentenoir : autocollant de poisson sur le pare-chocs, petit Jésus en plastique au rétro. À la sortie, dans l\'obscurité, deux hommes : l\'un correspond à Straight, l\'autre petit, chauve, en robe ou soutane (Bright). Ils ont fermé à clé et sont partis en voiture.\nFiche minimale (pas de caractéristiques dans le livre).',
});
const gremissieux = npc('gremissieux', {
  nom: 'Gonzague Octave de Grémissieux', source: 'Humain, directeur du muséum d\'Histoire naturelle', type: 'humain', armes: [],
  notes: 'Quarantenaire snob tiré à quatre épingles, couvert de plaques d\'allergie, nez qui coule. Supérieur et inaccessible : il faut de solides références pour une brève entrevue. Doit à Lentenoir une bonne part de ses notices de squelettes ; lui a prêté une chambre forte pour ses os afghans et lui a remis une des clés.\nSans pouvoir, impossible d\'obtenir de lui la visite des sous-sols et l\'ouverture du sanctuaire.\nFiche minimale (pas de caractéristiques dans le livre).',
});
const claire = npc('claire', {
  nom: 'Claire Martinez', source: 'Humaine, copine albigeoise de Loris', type: 'humain', armes: [],
  notes: 'Héberge Loris chez ses parents à Albi. On la retrouve en fouillant la chambre de Loris en cité U (lettres d\'amour enflammées) ou en interrogeant ses voisins de palier.\nFiche minimale (pas de caractéristiques dans le livre).',
});
const chasseurs = npc('chasseurs', {
  nom: 'Chasseurs de Prades', source: 'Humains, montagnards organisés en battues', type: 'humain', qty: 6,
  car: car('2 2 2 2 1 2'), def: 2, pfFix: 4, seuilsFix: seuils('3/6/9/12'),
  armes: [arme('Fusil de chasse', 'Carabine', 2)],
  talents: 'Survie 2, Tir 2, Tenir l\'alcool 3',
  notes: 'Montagnards remontés contre « la Bête », battues nocturnes avec chiens et matériel lourd ; question de fierté, ils veulent l\'abattre avant l\'arrivée d\'un expert lyonnais. Admiratifs de qui tient l\'alcool, entretient un fusil et reprend une paillarde en catalan : ils racontent alors tout et montrent les lieux.\nAvinés à la nuit tombée : tirs « préventifs » possibles sur les PJ.\nFiche estimée (pas de caractéristiques dans le livre) : humains ordinaires armés de carabines de chasse.',
});

// Le bestiaire joint (types réutilisables) : mêmes fiches, sans quantité
const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });

// ---------------- Scènes ----------------
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  scene('prologue', '0. Prologue : la réunion du bar perdu (secret MJ)', 'Bar-restaurant sordide de banlieue – trois jours avant la convocation',
    `Scène d'ambiance à lire ou paraphraser, sans les PJ. Cinq inconnus à une table d'angle, sous un brochet empaillé : un homme pâle et silencieux à grosses lunettes (Baalberith), Aurélie au diabolo grenadine, Alonzo en salopette, Valoche la pin-up, et un gamin à lunettes rondes qui boit du whisky sec (Ishtar).
Ils cherchent comment discréditer Andromalius : fausse rumeur sexuelle, membre du Bureau qui balancerait… Ishtar propose un dinosaure, et Baalberith tranche : ce sera Denver, le dernier dinosaure.
Ce que le MJ doit savoir : Baalberith, ancien ange Kiel, a été jeté en Enfer par Dominique et Andromalius lors de l'« affaire Denver » (Dieu voulait se révéler aux dinosaures). Il tient enfin sa vengeance : Andromalius est favori pour le trône. Opération « Jurassic Park » : trois démons du Daemonis Malificum sur le terrain (Aurélie, Valoche, Ishtar), un agent de liaison à Paris (Alonzo) et toute la machinerie administrative qu'il contrôle. Les PJ, réputés fiables, doivent déterrer les preuves plantées pour eux puis rencontrer un témoin fabriqué : Denver.`,
    [inScene(alonzo)]),
  scene('cdt', '1. Convocation au Centre de Tri', 'Centre de Tri, Paris – jour 1',
    `Trois jours après « Nuit bleue ». Gilbert et Aurélie offrent le thé dans l'ancienne salle de pause. Nouvelles d'Enfer : plusieurs Premiers Nés briguent le trône ; les deux finalistes probables sont Andromalius et Baal ; l'administration craque, Gilbert est pessimiste, Aurélie prend l'air grave.
Monsieur Fabien, yeux explosés par l'écran, félicite les PJ pour « Nuit bleue » : on se les arrache. Une offensive angélique se préparerait à Perpignan et les démons locaux ont demandé de l'aide ; message venu directement des bureaux de Baalberith. Frais payés, Aurélie les accompagne au moins au début pour les contacts locaux. Puis ses téléphones sonnent et il les congédie.
Logistique : sans véhicule, Aurélie propose une camionnette de La Poste.
Conseil : sous-jouer Aurélie (peu d'initiatives, saillies drolatiques), pour qu'on l'oublie.`,
    [inScene(fabien), inScene(gilbert), inScene(aurelie)]),
  scene('luxe-studio', '2. Perpignan : Luxe Studio', 'Locaux de Luxe Studio, vieux quartiers de Perpignan – jour 1',
    `Après une interminable autoroute du soleil, Aurélie conduit les PJ chez les deux derniers démons de la ville : Anaïs (Kronos) et Jasmin (Vapula), dans un appartement-bureau au bordel réglementaire (placards débordants, Velleda illisibles, stickers Linux). Pastis de bienvenue, mais surprise : leur appel à l'aide date d'il y a deux mois et visait… des familiers pour ranger les archives. Aucun lien avec « Nuit bleue ». Aurélie rétorque que, puisque les PJ sont là, ils vont aider.
Aurélie reste classer et envoie les PJ « voir ce qu'il y a à faire en ville ». Pistes fournies par Anaïs et Jasmin :
• Pollution maritime : depuis trois semaines, une algue orange plus coriace que Caulerpa taxifolia ravage la côte. Recoupement possible : trois démons de Vephar du musée océanographique de Monaco ont disparu au début de la propagation ; planqués en Corse, ils travaillent sur une mutation pire encore (accroche pour plus tard).
• Visite du roi d'Espagne : Juan Carlos et Sofia viennent dans quatre jours (manifestation sur les liens franco-catalans). Rumeurs d'actions anti-Carlos (autonomistes, anti-royalistes, opposants à la guerre en Irak, entarteurs). Guirlandes, fanfares, chasseurs pyrénéens : la visite se passe sans souci si les démons ne s'en mêlent pas.
• Concert hip-hop : le soir même, l'association Bouge ta France organise un concert qui dégénère en bataille rangée entre deux cités puis mini-émeute. Derrière : une escouade d'anges de Khalid venue rosser des Laurent en goguette, eux-mêmes chauffés par un gros Majûj incarné dans Souad, la « rebeute » qui dirige l'association. Le lendemain, crédits coupés, éditos indignés.
• Conférence de presse : le lendemain à 14 h, salle de la mairie, Ernest Lentenoir annonce une découverte qui bouleverserait la préhistoire (affiche dessinée par Anaïs et Jasmin ; il reviendrait d'Afghanistan). Si on insiste, Jasmin raconte la visite de Straight la veille.
Chronologie : la nuit même, Valoche et Aurélie (ou Valoche seule si les PJ surveillent leur collègue) assassinent Lentenoir. Premiers incidents attribués au dinosaure.`,
    [inScene(anais), inScene(jasmin), inScene(aurelie)], false,
    [choice('pistes', 'Quelle piste les PJ suivent-ils d\'abord ?', [
      ['La conférence de Lentenoir', 'Piste principale : conférencier absent, enquête chez lui (scène 3).'],
      ['Le concert de hip-hop', 'Bagarre Khalid / Laurent / Majûj : diversion savoureuse, sans lien avec le complot ; risque d\'attirer l\'attention d\'Ursule.'],
      ['La pollution maritime', 'Accroche vers les démons de Vephar en Corse ; Aurélie ramène vite les PJ vers Lentenoir.'],
      ['La visite royale', 'Sans intervention, rien ne se passe ; s\'ils s\'en mêlent, gros risque de scandale (et d\'enquête de Notre-Dame).'],
    ])]),
  scene('lentenoir', '3. La conférence sans conférencier', 'Mairie de Perpignan, puis maison de Lentenoir (village-vacances dans les dunes) – jours 2-4',
    `La conférence est annulée faute de conférencier (journalistes scientifiques furieux d'avoir sacrifié un congrès à Tahiti) ; les journaux relaient la disparition dès le lendemain. Si les PJ traînent, Aurélie insiste : on n'est pas en congé.
Ernest Lentenoir : vieux savant dispensé de cours, chasseur d'os de dinosaures, vit à quelques kilomètres au sud de Perpignan dans un village-vacances fantôme en basse saison.
Témoins : Lucien et Ginette Darond (break Volkswagen marron, poisson stylisé, petit Jésus au rétro ; Straight et un petit chauve en soutane la veille vers 18 h).
La maison (en échappant aux pipelettes) : trois pièces de savant fou, rangement hermétique ; des heures de fouille donnent :
• le Post-it des coordonnées en cité U de Loris Giaddana, sous une maquette de bateau ;
• un article en scientific english sur le « balouchosaure » ;
• au bout de plusieurs heures, une bibliothèque trop épaisse : double fond de 50 cm, le professeur plié dedans, décapité à l'arme blanche (médecine ou bouteille démoniaque).
Pendant qu'ils pataugent dans le sang, la police arrive (première visite ou vérification) : parmi eux Ursule Jeanpaulhan, ange de Jean-Luc, qui fera tout ensuite pour étouffer l'affaire.`,
    [inScene(darond), inScene(ursule)], false,
    [choice('police', 'Comment les PJ gèrent-ils l\'arrivée de la police ?', [
      ['Fuite discrète ou pouvoirs', 'Ursule étouffe l\'affaire sans soupçonner les PJ ; l\'enquête continue.'],
      ['Bluff ou coopération', 'Possible avec de bons arguments ; Ursule reste affable mais garde un œil sur eux.'],
      ['Grabuge, violence ou pouvoirs voyants', 'Ursule prévient Notre-Dame et lance une enquête préliminaire (scène 4).'],
    ])]),
  scene('notre-dame', '4. Notre-Dame s\'en mêle (optionnel)', 'Perpignan – à tout moment si les PJ sont trop voyants',
    `Si les démons ont été trop peu discrets (police, concert, visite royale, muséum), Ursule prévient Notre-Dame et prend la tête d'une faction de soldats de Dieu déguisés en pionniers pour une « enquête préliminaire » destinée à éviter une réaction trop hâtive.
Filatures, questions aux voisins, contrôle d'identité. Une fois convaincu de leur culpabilité, Ursule les fait arrêter puis abattre discrètement en garde à vue. Les PJ peuvent fuir, le piéger, l'acheter (peine perdue) ou l'affronter.`,
    [inScene(ursule), inScene(soldats)], true,
    [choice('ursule', 'Comment se règle le problème Ursule ?', [
      ['Les PJ le semant ou le neutralisent discrètement', 'Notre-Dame reste dans le flou ; l\'enquête continue.'],
      ['Affrontement ouvert', 'Victoire possible, mais Notre-Dame sait désormais que des démons s\'agitent à Perpignan.'],
      ['Arrestation', 'Garde à vue mortelle prévue : les PJ doivent s\'évader, Aurélie appelle le Centre à l\'aide.'],
    ])]),
  scene('albi', '5. Recherches et virée à Albi', 'Bibliothèques, faculté des sciences, cité U, puis Albi – jours 2-4',
    `Aurélie, Anaïs et Jasmin n'aident pas beaucoup (Aurélie insiste, hystérique). Recherches : Lentenoir, spécialiste de races de dinosaures, fouilles à Spokane (Illinois) fin des années 80 ; depuis dix ans convaincu que les derniers dinosaures se sont concentrés en Extrême-Orient. Revenu d'Afghanistan avec plusieurs conteneurs d'os ; ses collègues, qui lui en veulent, ignorent où il les a mis.
Loris Giaddana a fui Perpignan, persuadé d'un Grand Complot. Ses amis de fac donnent sa chambre en cité U ; de là (lettres d'amour ou voisins), on remonte à Claire Martinez, à Albi.
Albi : quelques heures d'autoroute. Loris et Claire vivent chez les parents de Claire : parano du jeune homme, méfiance bourgeoise ; venir avec un bon prétexte. Mis en confiance, Loris parle du balouchosaure (presque complet, pièce unique), du Panchir et, si on insiste, de la chambre forte du muséum. Il ajoute que, selon Lentenoir, le balouchosaure aurait beaucoup à apprendre sur l'histoire des dinosaures.
En sortant : face-à-face avec le break Volkswagen conduit par un curé en soutane (Aurélie polymorphée en Bright, ange de Dominique). La rencontre doit tourner court ; le « curé » s'éclipse. Les PJ se savent repérés.
Retour à Perpignan : dans les montagnes, une dizaine de chèvres écrasées comme par un énorme 4×4. Au journal local : cabane de randonneurs rasée, vieux arbres abattus, un touriste hollandais sous champignons a vu une bête de la taille d'un petit éléphant. Personne n'a fait le rapprochement.`,
    [inScene(loris), inScene(claire)]),
  scene('museum', '6. Retour au temple du mal élémentaire', 'Muséum d\'Histoire naturelle de Perpignan (bâtiment XVIe classé) – de jour ou de nuit',
    `Visite légale : collections de papillons, squelettes, égyptienneries maudites, guide moustachu monocorde. Le directeur, Gonzague Octave de Grémissieux, ne reçoit que sur solides références et refuse toute visite des sous-sols sans pouvoir. S'ils obtiennent l'ouverture, on saute directement à la chambre forte (sans dungeon crawling).
Version recommandée : effraction par une nuit sans lune sous l'orage. Le jour, une dizaine de jeunes gardiens blasés ; la nuit, quatre gardiens à matraque en caoutchouc qui jouent à la manille et appellent vite la police au moindre pépin.
Avant d'entrer : le break de Straight et Bright garé dans une ruelle (bible et Code civil dans la boîte à gants, revues pornos, une vingtaine de litres d'essence en jerricans).
Pendant l'exploration, Straight et Bright (Valoche et Aurélie, qui a « disparu » un moment) font peur aux PJ sans les blesser : Télékinésie sur un gnou empaillé, bruits pour attirer les gardiens, une main dans le dos dans l'escalier, un lustre qui tombe… Exploiter l'ambiance Adèle Blanc-Sec (vitrines, parquets qui grincent, squelettes aux ombres longues).
Les chambres fortes : sas de sous-marin, boîtes de conserve géantes. Pour ouvrir la bonne : la clé (les gardiens ont un double), chalumeau ou dynamite, le pouvoir Ouverture, ou frapper très fort longtemps.
Dedans : rien. Le mur du fond est défoncé de l'intérieur (blindage replié en peau de banane), donnant sur un large tunnel d'égout. Comme si le dinosaure s'était réassemblé et enfui…
Vérité (à ne pas dire) : un ou deux jours plus tôt, Valoche et Ishtar sont entrés avec le trousseau de Lentenoir ; Ishtar en rhinocéros a défoncé le mur, ils ont jeté les os aux égouts et refermé. Ishtar attend dans les montagnes.`,
    [inScene(gremissieux), inScene(gardiens)], false,
    [choice('museum', 'Comment les PJ entrent-ils dans la chambre forte ?', [
      ['Visite autorisée (pouvoirs sur le directeur)', 'Accès direct à la chambre vide, sans la séquence de cache-cache nocturne.'],
      ['Effraction nocturne discrète', 'Cache-cache avec les gardiens et les farces de Straight et Bright ; mur défoncé découvert.'],
      ['Effraction bruyante', 'Les gardiens appellent la police : risque d\'enquête d\'Ursule (scène 4).'],
    ])]),
  scene('prades', '7. La bête est entrée dans le village', 'Prades et ses montagnes, à une vingtaine de kilomètres de Perpignan – jours 3-5',
    `Une carte ou Anaïs et Jasmin montrent que tous les incidents ont eu lieu à moins de deux kilomètres de Prades. Si les joueurs patinent : des chasseurs locaux annoncent une battue contre la bête.
Aurélie a fini son classement et veut venir ; sinon, elle suit avec Anaïs et Jasmin (« c'est notre juridiction »).
Pour que Valoche arrive avant eux, elle (ou Aurélie) met du sucre dans les réservoirs : panne sur une bretelle d'autoroute, et pendant le garage, Straight briefe le faux dinosaure.
Ishtar vit dans une cabane en rondins à un kilomètre et demi de Prades ; la nuit, il devient Denver et sème la terreur.
À Prades, montagnards remontés, battues avec chiens et matériel lourd, expert lyonnais attendu. Trois épreuves pour gagner leur estime : tenir l'alcool, entretenir un fusil, reprendre une paillarde en catalan ; ils racontent alors tout et montrent les lieux. Seuls, les PJ se perdent sur des sentiers non balisés et croisent des chasseurs avinés à la nuit tombée.
Le soir, le faux Denver se fait repérer : arbres abattus, pylône renversé, piétinements. Poursuite d'une demi-heure (Vitesse, voire Vol hors de vue) pour épuiser les PJ et les éloigner de la civilisation ; tirs préventifs de chasseurs possibles.`,
    [inScene(chasseurs), inScene(anais), inScene(jasmin), inScene(aurelie)], false,
    [choice('chasseurs', 'Comment les PJ abordent-ils les gens de Prades ?', [
      ['Réussir les trois épreuves', 'Témoignages intarissables et visite des lieux : la piste de la bête est vite trouvée.'],
      ['Se débrouiller seuls', 'Errance, mauvaises rencontres et chasseurs avinés ; Denver se fait repérer quand même.'],
    ])]),
  scene('straight', '8. Straight contre Denver', 'Champ de cailloux en montagne au-dessus de Prades – nuit',
    `Denver fait mine de peiner dans un pierrier pour se laisser rattraper. Au milieu du champ de cailloux, Straight surgit entre les PJ et la bête (Corps gazeux) et proclame en démoniaque qu'il est serviteur d'Andromalius et membre du Labyrinthe, et que ce dinosaure est à lui.
Si les PJ acquiescent, il se jette sur la bête, qui implore à l'aide d'une voix de fausset ; Aurélie surenchérit pour qu'on sauve la pauvre bête.
Aux joueurs de choisir leur camp : l'idéal (pour le complot) est qu'ils défendent Denver ou retiennent Straight. Dans ce cas, Straight se retourne contre eux et se bat jusqu'à la mort pendant que Denver tente de fuir. Même si les PJ ne bougent pas, la bête l'emporte : Valoche/Straight se fait tuer par Denver, aidé plus ou moins discrètement par Aurélie.
Combat : seul Straight est un adversaire ; Denver et Aurélie jouent la comédie (fiches dans les scènes 7 et 9 si le MJ en a besoin).`,
    [inScene(valoche)], true,
    [choice('camp', 'Quel camp choisissent les PJ ?', [
      ['Ils défendent Denver', 'Straight se bat jusqu\'à la mort ; Denver, sauvé, remercie et propose de discuter (scène 9).'],
      ['Ils laissent faire', 'Denver tue Straight avec l\'aide d\'Aurélie ; le plan suit son cours.'],
      ['Ils aident Straight', 'Straight se retourne quand même contre eux ; Denver s\'enfuit et se laisse retrouver plus tard.'],
    ])]),
  scene('denver', '9. Denver témoigne : être dino, c\'était l\'enfer', 'Coin tranquille en montagne',
    `Denver remercie Aurélie (et peut-être les PJ) et propose de discuter : il est Denver, dinosaure de Dieu revenu à la vie. Il demande d'abord qui ils sont et pour qui ils travaillent, puis raconte à rebours :
• sa survie dans les Pyrénées, les battues, la traque de Straight et Bright (qu'il prétend avoir tué) ;
• son réveil conscient dans les sous-sols du muséum, sa fuite par les égouts, sa sortie de Perpignan en petit garçon, les vagues souvenirs de son exhumation au Panchir ;
• sa première vie : deux anges de puissance jumeaux, Sariel et Raguel, lui ont donné la parole pour évangéliser les autres dinosaures, accompagnés d'un ange plus petit et sceptique, Kiel. Échec : les dinosaures broutaient et se battaient. Les jumeaux décident de le crucifier pour frapper un grand coup ; Kiel s'y oppose, et ils le rouent de coups jusqu'à ce qu'il disparaisse dans des plumes blanches. Denver est crucifié, entend Dieu dire que c'était une erreur, puis sent le sol trembler : le Créateur efface son expérience.
Aurélie rappelle au besoin que Sariel et Raguel sont aujourd'hui Dominique et Andromalius, et que le Labyrinthe est leur service secret commun ; elle n'a jamais entendu parler de Kiel. Elle propose de rentrer vite à Paris.
Ironie pour le MJ : Kiel est devenu Baalberith, qui monte toute la farce.
Le sort de Denver : la solution retenue par le Daemonis Malificum dépend des PJ ; ils garderont le personnage crédible jusqu'au bout, quitte à se sacrifier.`,
    [inScene(ishtar), inScene(aurelie)], false,
    [choice('sort', 'Que font les PJ de Denver ?', [
      ['Le laisser dans les montagnes', 'Solution préférée du dino : quelques jours pour reprendre forme humaine et filer vivre dans une jungle.'],
      ['Le ramener au Centre de Tri', 'Transport et hébergement acrobatiques ; Denver fausse compagnie à la première occasion avec un mot déchirant (plutôt mourir que vivre en cage).'],
      ['Lui céder de la force', 'Absorption de force : il « prend forme humaine » (reprend en fait son apparence) puis disparaît avec le même mot d\'adieu.'],
      ['Le tuer', 'Il fait « plop » ; ou Aurélie, ou Valoche si elle vit encore, l\'élimine si les PJ sont trop soupçonneux ; au pire, il se suicide.'],
    ])]),
  scene('justice', '10. Justice à deux vitesses', 'Centre de Tri, Paris – jours 4-7',
    `Rapport à Monsieur Fabien (ou par Aurélie si les PJ rechignent). Contexte : Andromalius est sur le point de monter sur le trône (voir « La guerre en Enfer ») ; des outsiders veulent peut-être le saboter, mais ces révélations à quelques jours de la réunion extraordinaire de la Cour ne peuvent être ignorées.
Enquête complémentaire (CRD, Aphte, Chez Régis, anciens contacts angéliques) : tout concorde. Kiel est un ange porté disparu depuis l'affaire Denver, ni chez Ceux Qui Ont Chuté ni chez Ceux Qui Sont Restés (« effacé par un coup de gomme divin »). Les magouilles Andromalius-Dominique ont laissé des traces (Bureau, projet Antéchrist, opération « J'adore ce que vous faites ! ») et leur connivence est légendaire. L'évangélisation des dinosaures serait le plus gros raté du Pré-Grand-Jeu.
Le dossier doit parvenir à Fabien juste avant la réunion en Enfer. Si les PJ, paranoïaques, refusent de cautionner ou soupçonnent Aurélie, Baalberith fabrique lui-même un vrai faux dossier signé de leurs noms.
Dénouement : réunion extraordinaire, les princes ajournent la succession. Andromalius est écarté de la course ; ses serviteurs et ses outils de contrôle passent sous les ordres de Baalberith. Baal reste le seul candidat crédible mais se contente de faire tourner les Enfers. Sous 48 heures : 6 PA pour chaque PJ.
La vérité éclatera dans le quatrième scénario de cet acte.`,
    [inScene(fabien), inScene(gilbert), inScene(aurelie)], false,
    [choice('rapport', 'Qui transmet le dossier en Enfer ?', [
      ['Les PJ eux-mêmes', 'Andromalius est écarté ; 6 PA. Les PJ ont, sans le savoir, servi la vengeance de Baalberith.'],
      ['Aurélie, faute de mieux', 'Même résultat ; les PJ restent un peu en retrait mais touchent leurs 6 PA.'],
      ['Personne : ils soupçonnent un coup monté', 'Baalberith fabrique un faux dossier à leur nom ; même récompense, mais les PJ seront plus méfiants pour la suite (et ils auront raison).'],
    ])]),
];

const scenario = {
  id: 'fire-and-ice-10-c-est-mon-ami',
  nom: 'Fire and Ice (scénario 10) – C\'est mon ami et bien plus encore',
  resume: `Et Nox Facta Est, scénario 10 (INS), premier scénario de Fire and Ice 2. Lucifer a renoncé au trône ; Andromalius est favori de la succession. Baalberith (l'ancien ange Kiel) veut se venger de lui avec ses alliés du Daemonis Malificum. Les PJ sont envoyés à Perpignan sur une fausse alerte, enquêtent sur la disparition d'un paléontologue et des os de « balouchosaure », visitent un muséum la nuit et traquent une bête dans les montagnes de Prades. Ils y recueillent le témoignage de Denver, « dinosaure de Dieu » (en réalité Ishtar, un démon de Caym), qui accuse Andromalius et Dominique. Leur rapport écarte Andromalius du trône.`,
  notes: `Source : ${REF}. Aides de jeu : prolégomènes « Et Nox Facta Est » (p. 7-10), « La guerre en Enfer » (p. 25-34), « Tempus Fugit » (p. 152-154).
Enquête de faux-semblants façon med-fan : ville étrange de province, amorce tirée par les cheveux, donjon (le muséum) et bête à traquer en plein air (le « Messie préhistorique »). Le fond est une magouille de la hiérarchie : tout ce que les PJ trouvent a été planté pour eux.
Déroulement : prologue (secret) → Centre de Tri → Luxe Studio et pistes de Perpignan → conférence annulée et maison de Lentenoir → (Notre-Dame, optionnel) → Albi → muséum → Prades → Straight contre Denver → témoignage de Denver → rapport à Paris.

Récompense : 6 PA chacun dans les 48 heures qui suivent la transmission du dossier (même si Baalberith l'a fabriqué lui-même).

Le complot (opération « Jurassic Park » de Baalberith) :
• Aurélie (Centre de Tri) : guide les PJ, tue Lentenoir avec Valoche, joue « Bright », faux ange de Dominique du Labyrinthe (curé en soutane), sabote les véhicules, fait le rapport si les PJ rechignent.
• Valoche : joue « Straight », faux démon d'Andromalius du Labyrinthe ; s'est renseignée auprès de Jasmin, se fait tuer (ou se bat à mort) devant Denver.
• Ishtar (Caym) : joue Denver ; a vidé la chambre forte, terrorise Prades, livre le faux témoignage.
• Alonzo : agent de liaison à Paris.
Anaïs et Jasmin, Ursule, Loris et les autres sont de bonne foi.
Conseil de MJ : sous-jouer Aurélie pour qu'elle passe inaperçue ; les membres du Daemonis Malificum défendent la crédibilité de Denver jusqu'au bout, quitte à se sacrifier.

Contexte (prolégomènes) : Lucifer, parti en vacances sur Terre en 1997 (en même temps que la retraite de Dieu à La Bourboule), a compris que son pouvoir venait de Dieu et vient d'annoncer à la télévision qu'il ne reviendra pas. La Cour se dispute le trône. Andrealphus a disparu, enceint de Damien ; Bifrons est la marionnette de Hornet ; Baal doit gérer sa paternité ; Kronos sait qu'il ne doit pas bouger ; Belial et Crocell se déchirent pour une femme morte depuis dix mille ans ; Uphir est de retour et furieux contre l'usurpateur. Baalberith, jadis l'ange Kiel proche d'Yves et de Kronos, a été précipité en Enfer par Dominique et Andromalius pendant l'affaire Denver ; il en a gardé une haine qu'il partage avec les parias du Daemonis Malificum, anges devenus fous par la Chute à qui il a rendu une liberté illégale.

« La guerre en Enfer » (positions des princes, extrait utile) :
• Andromalius : pro-Belial, anti-Crocell, candidat à la régence (le Premier Né le plus compétent selon lui) ; une fois écarté, il rumine dans l'ombre.
• Baal : pro-Belial (ordre et discipline) ; se résigne à régir les Enfers en l'absence du patron.
• Baalberith : contre tout le monde ; en façade, pour un châtiment exemplaire de Belial et Crocell, et soutien affiché d'Andromalius.
• Asmodée : plutôt pro-Belial, légitimiste, mais prêt à soutenir Andromalius si Lucifer tarde.
• Beleth : discret, sait que la crise ne durera pas et cherche à sauver le monde à sa manière.
• Belial et Crocell : chacun contre l'autre ; Crocell, écarté, rassemble des preuves contre son frère.
• Abalam : tape au hasard ; Andrealphus et Damien s'en moquent ; Bifrons a postulé sous la pression de ses amis et s'endort aux réunions ; Caym refuse de choisir et propose un ou deux mois de réflexion ; Furfur pro-Crocell, soutient Baal ; Gaziel pro-Belial, soutient mollement Baal ; Haagenti et Kobal pro-Crocell (Kobal mène une candidature parodique).

Chronologie (Tempus Fugit) : J-10 Lentenoir et Loris reviennent du Panchir et mettent les os à l'abri au muséum ; J-3 réunion de crise du Daemonis Malificum ; J-2 Valoche (Straight) et Ishtar (Denver) arrivent à Perpignan ; J-1 Straight passe voir Jasmin, Ishtar et elle cambriolent le muséum, puis le faux dino file se cacher dans les montagnes ; à la Cour, deux grands finalistes se détachent. J1 convocation, départ pour Perpignan avec Aurélie ; le concert de Bouge ta France dégénère ; la même nuit, Valoche et Aurélie tuent Lentenoir (Valoche seule si les PJ surveillent leur collègue) ; premiers incidents du dinosaure. J2-4 conférence annulée, enquête autour du professeur, séjour à Albi, descente au muséum ; Denver continue ses méfaits. J4 arrivée du couple royal espagnol. J3-5 séjour à Prades, battues nocturnes, combat contre Straight, entretien avec Denver. J4-6 retour à Paris, enquête complémentaire. J5-7 le dossier est remis à la hiérarchie ; Andromalius est écarté de la course au trône et de la tête de l'administration infernale.

Suite de la campagne (Lux Aeterna, « Les cahiers du labyrinthe ») : une fois Lucifer revenu, Andromalius est blanchi et rétabli ; Baalberith redevient sa carpette et doit organiser la traque de Kiel, c'est-à-dire de lui-même.

Fiches adaptées du livre : caractéristiques en niveaux INS/MV (Ch des humains reportée en Foi). Fiches de Monsieur Fabien, Gilbert et Aurélie : aide de jeu « Le Centre de Tri » (Fire and Ice, volume 1, p. 24-26). Valeurs estimées signalées dans chaque fiche.`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [fabien, gilbert, aurelie, anais, jasmin, ursule, soldats, loris, gardiens, valoche, ishtar, alonzo,
  darond, gremissieux, claire, chasseurs].map(asType);

// Contrôle : pouvoirs inconnus des règles
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));

writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types,', scenes.reduce((a, s) => a + s.choix.length, 0), 'choix');
