// Génère le fichier d'import « insmv-scenario » pour « Bifrons président ! » (On Ferme !, p. 109-119)
// usage : node gen-on-ferme-1-bifrons-president.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'On Ferme !, « Bifrons président ! », p. 109-119';
const L = (s) => R.parseLvl(String(s)); // « 2+ » → 5
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
const ARMES = new Map(R.ARMES.flatMap(([g, l]) => l.map((x) => [x[0], { prec: x[1], puis: x[2], melee: R.MELEE_GROUPS.includes(g) }])));
// arme de la table des règles : nom affiché, nom dans la table, niveau du talent
const arme = (n, table, lvl) => { const w = ARMES.get(table); if (!w) throw new Error('arme inconnue : ' + table); return { n, att: L(lvl), ...w }; };
// attaque au format des livres « seuil/RU+X/MR+Y » : att = X×2, précision 0, puissance Y
const bk = (n, x, y, melee = false) => ({ n, att: x * 2, prec: 0, puis: y, melee });
const poing = (lvl) => arme('Coup de poing', 'Coup de poing', lvl);
let n = 0; const id = (k) => `of1-${k}`;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 4, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [poing(1)], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});
const BEST = 'Mêmes valeurs que la fiche du bestiaire de l\'application (On Ferme).';

// ---------------- Première partie ----------------
const soldats = npc('soldats', {
  nom: 'Soldats de Dieu', source: 'Deux escouades au service des anges (12 + un sergent)', type: 'soldat', qty: 6,
  car: car('3 2 2 3 1+ 3'), def: L(3), pp: 9, pfFix: 6, seuilsFix: seuils('4/8/12/16'),
  armes: [bk('Pistolet-mitrailleur (attaque multiple, pénétration importante)', 2, 4), arme('Grenade (×2)', 'Grenade', 3)],
  talents: 'Combat 3, Conduite 2, Corps à corps 2, Défense 3, Tir 3, Jouer à la belote 2, Raconter des blagues racistes 1',
  notes: 'Pouvoirs : deux au choix du MJ (le livre conseille de ne pas s\'en soucier, ils changent rarement quelque chose).\nChair à canon idéale : en tuer un de temps en temps, de façon injuste, entretient la pression. Peuvent aussi servir de « personnes à protéger » dans la deuxième partie.\nGrenade : niveau Tir 3 estimé.',
});
const willy = npc('willy', {
  nom: 'Willy Gill', source: 'Sergent de Dieu', type: 'soldat',
  car: car('3+ 1 3 3 3 2'), def: L(4), pp: 12, pfFix: 6, seuilsFix: seuils('4/8/12/16'),
  armes: [bk('Pistolet-mitrailleur (attaque multiple, pénétration importante)', 3, 4), bk('Jet d\'eau du robinet (1 PP, pénétration réduite)', 5, 4), arme('Grenade (×2)', 'Grenade', 4)],
  pouvoirs: pows('Aura de courage 2, Jet d\'eau du robinet 3'),
  talents: 'Combat 3, Conduite 1, Corps à corps 3, Défense 4, Tir 4, Avoir l\'air excédé 3, Murmurer dans sa moustache 2',
  notes: 'Chef des deux escouades de soldats de Dieu confiées aux PJ. Râleur moustachu.\nGrenade : niveau Tir 4 estimé.',
});
const felix = npc('felix', {
  nom: 'Félix Furtin', source: 'Ange de Dominique, grade 2 (agent du Labyrinthe)', type: 'ange',
  notes: 'Brun, toujours tendu, commandant des forces du Bien au Tchad (QG dans les sous-sols de la cathédrale de N\'djamena). Donne les missions.\nSecret : agent du Labyrinthe. Quand le Paradis est coupé, il contacte son homologue d\'Andromalius, ce qui amène Andromalius, Beleth et Kronos à intervenir. Il revient en troisième partie (Sens surdéveloppés pour retrouver les PJ).\nPas de caractéristiques dans le livre.',
});
const gerard = npc('gerard', {
  nom: 'Gérard Martin', source: 'Ange de Guy, grade 2', type: 'ange',
  notes: 'Grand, mince, dégarni et jovial ; accueille les PJ et les accompagne à l\'aéroport. Pas de caractéristiques dans le livre.',
});
const miliciens = npc('miliciens', {
  nom: 'Miliciens du PCA', source: 'Rebelles du Parti du Cœur Africain (première partie)', qty: 6,
  car: car('2+ 2+ 2 2 2 1'), def: L(3), pfFix: 4, seuilsFix: seuils('3/7/10/14'),
  armes: [bk('Gourdin', 2, 4, true), bk('Machette', 3, 3, true)],
  talents: 'Baratin 2+, Combat 3, Corps à corps 3, Défense 3, Tir 2, Faire semblant de ne pas comprendre le français 2, Avoir l\'air très en colère 3',
  notes: 'Symbole en forme de cœur humain sur la chemise. Nerveux, agressifs, armés de bric et de broc (gourdins, machettes, une pétoire hors d\'âge). Ils gagnent pourtant toutes leurs batailles : aide démoniaque.',
});
const sergent = npc('sergent', {
  nom: 'Sergent du PCA', source: 'Chef des miliciens de Mongo',
  car: car('2 2 2+ 3 3 2'), def: L(3), pfFix: 5, seuilsFix: seuils('3/6/9/12'),
  armes: [bk('Petit revolver (pénétration importante)', 2, 3)],
  talents: 'Baratin 3+, Combat 2, Corps à corps 2, Défense 3, Tir 3, Torture 2, Se faire obéir 3+, S\'en foutre plein les poches 2',
});
const traore = npc('traore', {
  nom: 'Massa Traoré', source: '« Capitaine » du PCA, kamikaze',
  car: car('2 3 2 3 2 2'), def: L(3), pfFix: 5, seuilsFix: seuils('3/6/9/12'), armes: [],
  talents: 'Baratin 2, Corps à corps 2, Défense 3, Discussion 2, Tir 3, Paraître déterminé 3, Parler d\'une traite sans reprendre sa respiration 2',
  notes: 'Simple milicien fanatisé, victime du pouvoir Martyre d\'un démon de Ouikka. Ceinture de dynamite rendue invisible par Disparition : elle réapparaît au bout d\'une heure.\nExplosion : tous les humains de la salle meurent. Ange présent : test d\'Agilité difficile pour se jeter à terre ; dégâts 20, −1 par mètre de distance, − la MR du test réussi. Se jeter sur lui = mort automatique, sans rien empêcher.',
});
const dupuis = npc('dupuis', {
  nom: 'Patrick et Florence Dupuis', source: 'Couple de Français réfugiés à Mongo', qty: 1,
  armes: [arme('Revolver', 'Revolver gros calibre', 1)],
  notes: 'Barricadés chez eux, volets fermés. Patrick, très nerveux, a tiré deux balles (dont une en pleine tête) sur un assaillant nocturne qui s\'est relevé : un zombie. Leur voiture a été réquisitionnée.\nRestent à la cathédrale en deuxième partie (l\'aéroport tombe avant leur départ) : parfaits « civils à protéger ».\nPas de caractéristiques dans le livre (humains moyens, revolver estimé).',
});
const emeutier = npc('emeutier', {
  nom: 'Manifestant en colère', source: 'Foule de l\'aéroport (plusieurs milliers)', qty: 10,
  car: car('3 2 2 1 2 2'), def: L(2), pfFix: 3, seuilsFix: seuils('4/8/12/16'),
  armes: [bk('Gourdin', 1, 5, true)],
  talents: 'Combat 2, Corps à corps 2, Défense 2, Tout casser 2',
  notes: `Sous Hystérie collective (démon de Furfur) et Voix impérieuse (démon de Samigina) : ils ne reculent pas, même face aux soldats de Dieu. ${BEST}`,
});
const tremolo = npc('tremolo', {
  nom: 'Bob Trémolo', source: 'Démon de Furfur, grade 2', type: 'demon',
  car: car('4 2 1 3 3 4'), def: L(5), pp: 24, pfFix: 7, seuilsFix: seuils('6/12/18/24'),
  armes: [bk('Gros revolver (pénétration importante)', 4, 4), bk('Onde de choc (2 PP, pénétration importante, aire d\'effet rayon court, non létale)', 7, 7)],
  pouvoirs: pows('Champ de force 3, Onde de choc 5, Suicide 5'),
  talents: 'Conduite 4, Corps à corps 4, Défense 5, Tir 5, Replacer une mèche rebelle d\'un coup de tête 3, Faire craquer ses articulations 2\nPouvoir : Hystérie collective 5 (nouveau pouvoir d\'On Ferme p. 104, absent des règles de l\'application).',
  notes: 'Entretient la fureur de la foule de l\'aéroport avec Hystérie collective. Reste à l\'écart et n\'attaque pas les anges lui-même.',
});
const julio = npc('julio', {
  nom: 'Julio Ray', source: 'Démon de Samigina, grade 2', type: 'demon',
  car: car('4 4 2 3 5 4'), def: L(5), pp: 28, pfFix: 7, seuilsFix: seuils('6/12/18/24'),
  armes: [bk('Machette', 4, 5, true)],
  pouvoirs: pows('Augmentation de Force 4, Baiser vampirique 5, Corps gazeux, Voix impérieuse 5'),
  talents: 'Baratin 4, Combat 4, Corps à corps 5, Défense 5, Plisser les yeux quand il parle 2, Ne jamais rester immobile 3',
  notes: 'Meneur de l\'émeute : harangue la foule debout sur le toit d\'une voiture. S\'il est éliminé, les assauts faiblissent puis cessent une heure plus tard.\n« Forme gazeuse » du livre rendue par Corps gazeux.',
});

// ---------------- Deuxième partie (fiches du bestiaire) ----------------
const milArmes = npc('miliciens-armes', {
  nom: 'Miliciens du PCA bien armés', source: 'Milice rebelle après le pillage d\'un arsenal', qty: 6,
  car: car('2 3 2 2 2 1'), def: L(3), pfFix: 4, seuilsFix: seuils('3/7/10/14'),
  armes: [bk('Machette', 2, 3, true), bk('Pistolet-mitrailleur (attaque multiple, pénétration importante)', 2, 4)],
  talents: 'Baratin 2+, Combat 2, Corps à corps 3, Défense 3, Tir 3, Porter des lunettes de soleil 2, Se prendre pour Rambo 1',
  notes: `Fiche donnée p. 116 ; ils apparaissent dès l'attaque sur la route du palais. ${BEST}`,
});
const zombie = npc('neo-zombie', {
  nom: 'Néo-zombie', source: 'Mort-vivant contagieux de Bifrons/Hornet', type: 'mortvivant', qty: 6,
  car: car('4+ 1 1 2 2 2'), def: L(4), pp: 8, pfFix: 6, seuilsFix: seuils('6/12/18/24'),
  armes: [bk('Ongles d\'acier', 5, 6, true), bk('Crocs (poison)', 5, 5, true)],
  pouvoirs: pows('Membre exotique : crocs, Membre exotique : ongles d\'acier, Poison 3'),
  talents: 'Corps à corps 4, Défense 4, Avancer les bras ballants 2, Avoir les yeux dans le vague 3',
  notes: `Croisement de zombie et de familier : plus malin et plus costaud qu'un zombie ordinaire, capable d'initiative. Contagieux : toute victime blessée par le poison devient néo-zombie dans l'heure. ${BEST}`,
});
const zombieSoldat = npc('zombie-soldat', {
  ...zombie, id: undefined,
  nom: 'Soldat français néo-zombifié', source: 'Garnison française de N\'djamena', qty: 6,
  armes: [...zombie.armes, bk('Famas (Tir 2+, attaque multiple, pénétration importante)', 1, 6)],
  notes: 'Mêmes caractéristiques que les néo-zombies. Ordre de faire de nouveaux zombies : le Famas ne sert qu\'en dernier recours.',
});
zombieSoldat.id = id('zombie-soldat');
zombieSoldat.notes = [zombieSoldat.notes.split('\nSource')[0], `Source : ${REF}.`].join('\n');
const vampire = npc('vampire', {
  nom: 'Vampire', source: 'Chef de milice mort-vivant', type: 'monstre', qty: 2,
  car: car('3+ 3+ 2 3 3+ 3'), def: L(3), pp: 10, pfFix: 6, seuilsFix: seuils('5/10/15/20'),
  armes: [bk('Crocs (portée lutte)', 4, 4, true)],
  pouvoirs: pows('Apparence horrifique 3, Baiser vampirique 2, Membre exotique : crocs, Obscurité 2'),
  talents: 'Corps à corps 3, Défense 3, Discrétion 3, Séduction 3, Grimacer ridiculement 2, Sauter partout 3',
  notes: `Épaulent les néo-zombies et s'occupent des humains récalcitrants (policiers, militaires). ${BEST}`,
});
const lion = npc('lion', {
  nom: 'Lion', source: 'Meute menée par un démon de Caym transformé', qty: 4,
  car: car('4 2 3 1 2 2'), def: L(3), pfFix: 5, seuilsFix: seuils('5/10/15/20'),
  armes: [bk('Griffes', 3, 5, true)],
  talents: 'Corps à corps 3, Défense 3, Rugir 2, Avancer nonchalamment 3',
  notes: `Douze lions en tout : quatre de face, deux groupes de quatre qui contournent. ${BEST}`,
});
const demonCaym = npc('demon-caym', {
  nom: 'Démon de Caym transformé', source: 'Meneur de la meute de lions', type: 'demon',
  notes: 'Pas de caractéristiques dans le livre : utiliser un « démon bourrin » de grade 1 (forme animale) ou un lion amélioré.',
});
const B1 = { notes_prince: 'Selon le prince : Bifrons Peur 2, Éventration 1 ; Crocell Éclats de glace 2, Paralysie 1 ; Furfur Onde de choc 3 ; Uphir Jet d\'acide 3, Vengeance toxique 2.' };
const bourrin1 = npc('bourrin-1', {
  nom: 'Démon bourrin, grade 1', source: 'Bifrons, Crocell, Furfur ou Uphir', type: 'demon', qty: 2,
  car: car('5+ 4 3 2 2 2'), def: L('6+'), pp: 15, pfFix: 7, seuilsFix: seuils('7/15/22/30'),
  armes: [bk('Griffes', 6, 9, true)],
  pouvoirs: pows('Armure corporelle 2, Forme de combat 2, Membre exotique : griffes'),
  talents: 'Corps à corps 7+, Défense 6+, Apparaître sans prévenir 2',
  notes: `${B1.notes_prince}\n${BEST}`,
});
const bourrin2 = npc('bourrin-2', {
  nom: 'Démon bourrin, grade 2', source: 'Bifrons, Crocell, Furfur ou Uphir', type: 'demon',
  car: car('6 4+ 3+ 2 2 3'), def: L(7), pp: 25, pfFix: 8, seuilsFix: seuils('8/16/24/32'),
  armes: [bk('Griffes', 8, 10, true)],
  pouvoirs: pows('Armure corporelle 4, Forme de combat 4, Membre exotique : griffes'),
  talents: 'Corps à corps 8+, Défense 7, Faire pleurer ta mère 3',
  notes: `Selon le prince : Bifrons Peur 4, Éventration 3, Douleur 3 ; Crocell Éclats de glace 4, Paralysie 3, Peur 2 ; Furfur Onde de choc 5, Hurlement démoniaque 2 ; Uphir Jet d'acide 5, Vengeance toxique 4, Corps liquide, Poison 2.\n${BEST}`,
});
const fin1 = npc('fin-1', {
  nom: 'Démon plutôt fin, grade 1', source: 'Samigina, Malthus, Shaytan ou Ouikka', type: 'demon', qty: 2,
  car: car('3 4 3 3 3 2'), def: L(5), pp: 15, pfFix: 6, seuilsFix: seuils('5/10/15/20'),
  armes: [bk('Griffes', 5, 7, true)],
  pouvoirs: pows('Champ magnétique 1, Charme 2, Membre exotique : griffes'),
  talents: 'Baratin 5, Corps à corps 5, Défense 5, Attirer les emmerdes 3',
  notes: `Selon le prince : Samigina Baiser vampirique 3, Corps gazeux ; Malthus Infection 3, Douleur 1 ; Shaytan Décrépitude 3, Peur 2 ; Ouikka Invisibilité 3, Non-détection 2, Téléportation 1.\n${BEST}`,
});
const fin2 = npc('fin-2', {
  nom: 'Démon plutôt fin, grade 2', source: 'Samigina, Malthus, Shaytan ou Ouikka', type: 'demon',
  car: car('3+ 4+ 3+ 3+ 3+ 3'), def: L(6), pp: 15, pfFix: 7, seuilsFix: seuils('5/11/16/22'),
  armes: [bk('Griffes', 6, 7, true)],
  pouvoirs: pows('Champ magnétique 2, Charme 4, Membre exotique : griffes'),
  talents: 'Baratin 6, Corps à corps 6, Défense 6, Attirer de grosses emmerdes 3',
  notes: `Selon le prince : Samigina Baiser vampirique 5, Corps gazeux, Contrôle des animaux 2, Peur 1 ; Malthus Infection 4, Douleur 3, Ténèbres sataniques 2 ; Shaytan Décrépitude 5, Peur 4, Armure corporelle 3 ; Ouikka Invisibilité 5, Non-détection 4, Téléportation 3, Vol 2, Jet de flammes 1.\nC'est un démon de Ouikka de ce genre qui a piégé Massa Traoré (Martyre, Disparition).\n${BEST}`,
});

// ---------------- Troisième partie ----------------
const cysto = npc('cysto-balto', {
  nom: 'Cysto et Balto', source: 'Démons de Bifrons, grade 3 (gardes du corps d\'Hornet)', type: 'demon', qty: 2,
  car: car('5 5 4 4 2+ 5'), def: L(7), pp: 35, pfFix: 9, seuilsFix: seuils('7/14/21/28'),
  armes: [bk('Épée maudite', 9, 9, true)],
  pouvoirs: pows('Champ de force 5, Nécrose 3, Peur 5, Résurrection macabre 5'),
  talents: 'Combat 8, Défense 7, Combattre sans dire un mot 2',
  notes: 'Gardent le pentacle dans la brasserie ; les autres démons et morts-vivants n\'ont pas le droit d\'entrer. Il faut leur passer sur le corps.',
});
const hornet = npc('hornet', {
  nom: 'Hornet (monde des rêves)', source: 'Sorcier dans le corps de Bifrons, alias Jean Koundja', type: 'demon',
  car: car('4 5+ 6+ 7 5+ 4'), def: L(9), pp: 49, pfFix: 11, seuilsFix: seuils('7/14/21/28'),
  armes: [bk('Dague maudite ancienne', 12, 10, true)],
  pouvoirs: pows('Armure corporelle 5, Charme 4, Douleur 4, Larves sous-cutanées 7, Nécrose 10, Peur 7, Poison 4, Ténèbres sataniques 3'),
  talents: 'Combat 9, Défense 9, Discussion 5+',
  notes: 'Version très affaiblie, valable seulement dans son propre esprit (cité onirique géante et crasseuse, place bordée d\'arbres morts) ; il y paraît un peu perdu. 49 PP « plus une grosse réserve ».\nDans le monde réel (Jean Koundja, instituteur devenu chef du PCA), il est intouchable dans son pentacle : le livre renvoie à La Bible à Dudule pour ses vraies caractéristiques.\nLe livre écrit « BL 7/BG 14 » : seuils repris tels quels.',
});

const npcs = [soldats, willy, felix, gerard, miliciens, sergent, traore, dupuis, emeutier, tremolo, julio, milArmes, zombie, zombieSoldat, vampire, lion, demonCaym, bourrin1, bourrin2, fin1, fin2, cysto, hornet];

const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  // ===== Acte 1 =====
  scene('arrivee', 'Acte 1 – Un bien joli voyage', 'N\'djamena, sous-sols de la cathédrale',
    `Arrivée en avion (voyage pendant le générique), taxi jusqu'à la cathédrale : long bâtiment moderne sans clocher, QG du Bien au Tchad.
Sur place : Félix Furtin (Dominique, grade 2, commandant), Gérard Martin (Guy, grade 2, accueil), cinq anges de grade 1 et une douzaine de serviteurs, tous en mission ailleurs.
Ce que les PJ apprennent :
• la guerre du PCA a fait en deux mois autant de victimes que le régime en quinze ans ;
• plus aucun contact avec les villages pris par le PCA (câbles et communications coupés) ;
• un millier de soldats français, officiellement là pour les ressortissants, soutiennent en fait Idriss Déby ;
• des miliciens mal armés et indisciplinés qui gagnent toutes leurs batailles : aide démoniaque probable ;
• deux escouades de soldats de Dieu (12 + le sergent Willy Gill) passent sous leurs ordres.
Les scènes suivantes décrivent ce qui arrive si les PJ « suivent le mouvement » : toute initiative est permise, adapter (les soldats de Dieu peuvent les accompagner).
PJ tué : le joueur reprend un des anges de grade 1 du poste, qui rentre opportunément à N'djamena.`,
    [inScene(felix), inScene(gerard), inScene(willy), inScene(soldats, { qty: 12 })]),
  scene('mongo', 'Un tour à la campagne', 'Mongo, ville occupée par le PCA (400 km à l\'est, une journée de route)',
    `Mission : faire le point et rapatrier les derniers Blancs (Patrick et Florence Dupuis, Hubert Delatrique). Ville de 30 000 habitants quasi déserte ; les rares passants fuient la voiture.
Les PJ sont arrêtés par des miliciens du PCA très énervés qui exigent qu'on les suive au commissariat « pour enregistrement ». On peut les acheter ou se battre.
Commissariat : fouille, voiture, armes et objets de valeur confisqués, prison sans explication. Le soir, le sergent du PCA les interroge.
Chez Delatrique : son cadavre, battu à mort ; sa voiture est là mais sans clefs (Intrusion ou Technologie pour la démarrer).
Chez les Dupuis : maison barricadée, Patrick armé et à cran ; ils ont été attaqués la nuit, et un assaillant a encaissé deux balles dont une dans la tête avant de se relever (un zombie). Leur voiture a été réquisitionnée.
Sans voiture : en voler une, récupérer celle de Delatrique (attendre un camion est inutile, ou il est plein de miliciens). Retour à N'djamena sans incident.`,
    [inScene(miliciens), inScene(sergent), inScene(dupuis)], true,
    [choice('barrage', 'Face aux miliciens du barrage ?', [
      ['Les suivre au commissariat', 'Prison, voiture et équipement confisqués ; interrogatoire par le sergent le soir.'],
      ['Les acheter', 'Ils laissent passer ; voiture et équipement conservés.'],
      ['Se battre', 'Combat contre les miliciens (gourdins, machettes).'],
    ]),
    choice('sergent', 'Interrogatoire du sergent : les PJ disent-ils venir de la cathédrale ?', [
      ['Oui', 'Libérés en « bons chrétiens », mais à pied : la voiture a disparu.'],
      ['Non', 'Ordre de les abattre : à genoux derrière le commissariat, une balle dans la tête par PJ (Mort subite automatique) s\'ils se laissent faire.'],
    ])]),
  scene('universite', 'Une discussion au calme', 'Université de N\'djamena',
    `Réunion de conciliation entre gouvernement et rebelles, organisée par l'Association des Citoyens pour la Paix (journalistes, intellectuels). Félix veut que les PJ assurent la sécurité ; précautions possibles si elles sont rapides.
Côté gouvernement : quelques ministres et officiers, une dizaine de soldats. Côté PCA : une poignée d'hommes menés par le « capitaine » Massa Traoré, inconnu de tous.
Traoré est un simple milicien fanatisé sous Martyre (démon de Ouikka allié du PCA) ; sa ceinture de dynamite est rendue invisible par Disparition et réapparaîtra au bout d'une heure. La fouille ne donne rien ; lire ses pensées révèle son intention de se faire sauter.
Il fait traîner : insultes et exigences absurdes (raser les mosquées, christianisme d'État, Koundja président…). Explosifs revenus et salle pleine : rire dément et explosion.
Tous les humains de la salle meurent. Ange présent : test d'Agilité difficile pour plonger ; dégâts 20 −1 par mètre −MR. Se jeter sur lui = mort sans rien changer.
Prolonger la scène : victimes impossibles à sauver (sauf un ange de Guy, peut-être), secours dérisoires, panique dans le bâtiment, incendie possible.`,
    [inScene(traore)], false,
    [choice('traore', 'Les PJ démasquent-ils Traoré à temps ?', [
      ['Oui (lecture des pensées, intuition)', 'Ils peuvent l\'isoler ou évacuer avant que la ceinture réapparaisse : la réunion échoue, mais sans carnage.'],
      ['Non', 'Explosion : tous les humains présents meurent ; dégâts aux anges selon la distance.'],
    ])]),
  scene('aeroport', 'La liberté ou la mort', 'Aéroport de N\'djamena',
    `Le lendemain, Félix envoie les PJ et Gérard : une foule de plusieurs milliers de manifestants assiège bâtiments administratifs et tour de contrôle (pierres, cocktails Molotov, symboles du PCA, deux avions en feu).
Foule quasi désarmée (quelques bâtons) mais sous Hystérie collective (Bob Trémolo, Furfur) et Voix impérieuse (Julio Ray, Samigina, juché sur le toit d'une voiture) : elle ne recule devant rien.
Percer jusqu'aux bâtiments (en voiture par exemple) permet de se barricader et défendre ; la foule tient jusqu'à ce que la tour brûle, toute la nuit s'il le faut, et défonce la piste à la pioche.
Seul moyen de disperser : tirer dans le tas à l'arme automatique (une centaine de morts). Les démons restent à l'écart. Éliminer Julio fait baisser la pression, puis tout s'arrête une heure après. Dispersion au petit matin quoi qu'il arrive.
Le but n'est pas le combat mais la décision désagréable : massacrer la foule ou la laisser faire.`,
    [inScene(gerard), inScene(emeutier, { qty: 20 }), inScene(julio), inScene(tremolo)], true,
    [choice('foule', 'Que font les PJ face à la foule ?', [
      ['Tirer dans le tas', 'Une centaine de morts et la foule abandonne : aéroport sauvé, conscience lourde.'],
      ['Éliminer Julio Ray', 'Les assauts faiblissent puis cessent une heure plus tard.'],
      ['Laisser faire / se barricader', 'La tour finit en flammes ; dispersion au petit matin, aéroport hors service.'],
    ])]),
  scene('palais', 'Le palais des merveilles', 'Route du palais présidentiel, N\'djamena',
    `De retour à la cathédrale : l'armée tchadienne et le contingent français ont été écrasés en périphérie, le palais va tomber.
Sur la route, les PJ arrivent trop tard mais sont attaqués par des miliciens désormais bien armés (arsenal pillé) : une rafale rend leur voiture inutilisable, puis tirs dans le tas. Tuer quelques soldats de Dieu au passage.
Si les joueurs veulent sauver le président, leur en laisser la chance : le palais n'est pas encore pris, ils peuvent couvrir la fuite d'Idriss Déby. Sinon, le palais est aux mains du PCA et Jean Koundja prononce son discours de victoire au balcon.`,
    [inScene(milArmes, { qty: 8 }), inScene(soldats), inScene(willy)], true,
    [choice('president', 'Les PJ ont-ils voulu sauver le président ?', [
      ['Oui', 'Ils peuvent protéger la fuite d\'Idriss Déby, qui devient un civil à protéger en deuxième partie.'],
      ['Non', 'Palais tombé : Koundja au balcon. Le président et les ministres seront condamnés à mort par une « cour martiale extraordinaire ».'],
    ])]),

  // ===== Acte 2 =====
  scene('nuits', 'Acte 2 – 28 nuits en enfer des morts-vivants', 'N\'djamena sous le PCA',
    `Nouveau régime : président et ministres condamnés à mort, gouvernement d'urgence et pleins pouvoirs pour Koundja. Liaison satellite, radios et aéroport détruits, frontières fermées.
Influence de Koundja/Bifrons/Hornet : plus aucune récupération de PP, plus d'invocation, plus d'accès au Réticulum. Pas de fuite facile, pas de renfort.
Le jour : bandes de miliciens qui attaquent les Blancs, contrôlent les Noirs sans croix (réciter le Notre Père), raflent journalistes, intellectuels, porteurs d'appareils photo, harcèlent les femmes seules. Les raflés partent en camion vers les camps.
La nuit (couvre-feu 20 h) : fourgons de miliciens, néo-zombies (contagieux), quelques vampires pour les humains récalcitrants, et autant de démons de Bifrons, Samigina et consorts que nécessaire. Ils vident les maisons une à une pour grossir l'armée de Bifrons. Les miliciens savent vaguement et laissent faire.
Camps de conversion : mouroirs grillagés. Hornet veut 6 666 666 sacrifices humains pour son rituel ; il se moque de la discrétion et compte sur l'inertie internationale et l'incrédulité occidentale.
Ambiance survival : donner aux PJ des gens à protéger (soldats de Dieu, Dupuis, Déby, ou un PNJ cliché : enfant, jolie fille, futur traître). Faire monter la tension lentement, laisser l'initiative aux joueurs, multiplier les questions de détail (tours de garde, pièces, toilettes…). Tout est difficile : manger, trouver un véhicule ; quitter la ville est impossible. S'ils s'en sortent sans dépenser de PP, sortir les démons. Tuer des PNJ de façon injuste et inattendue (le soldat de Dieu happé par la fenêtre).`,
    [inScene(zombie, { qty: 8 }), inScene(vampire), inScene(fin1), inScene(bourrin1)], true),
  scene('qg', 'Le retour au QG', 'Cathédrale de N\'djamena',
    `Si les PJ étaient sortis (palais) : la cathédrale est occupée par les miliciens, en pleine messe ; sous-sols saccagés, anges introuvables.
S'ils étaient restés : assaut massif en direct ; Félix juge la cathédrale perdue (« de si dévoués chrétiens ! »), ordonne de l'abandonner et file discrètement le premier.
Pas de protections ni de garde angélique ici. Un assaut des PJ est stupide mais possible à grands renforts de pouvoirs : il attire une escouade de démons au round suivant. Mieux vaut se faire oublier… difficile quand on est les seuls Blancs d'une ville de près d'un million d'habitants.`,
    [inScene(milArmes, { qty: 10 })], true,
    [choice('cathedrale', 'Les PJ tentent-ils de reprendre la cathédrale ?', [
      ['Oui', 'Possible à coups de pouvoirs, mais une escouade de démons les prend en chasse ensuite.'],
      ['Non, ils se cachent', 'Début de la survie en ville.'],
    ])]),
  scene('lynchage', 'Réagir ou ne pas réagir', 'Rue de N\'djamena, la nuit',
    `Planqués, les anges entendent une clameur : quelques centaines de personnes poussent deux Blancs (un quadragénaire et une jeune femme) vers une pendaison.
Pas de forces surnaturelles dans la foule, mais le surnombre est écrasant. Intervenir trahit leur position : le PCA envoie ensuite une escouade de miliciens accompagnée de quelques démons.`,
    [inScene(emeutier, { qty: 15 })], true,
    [choice('pendaison', 'Les PJ interviennent-ils ?', [
      ['Oui', 'Deux civils de plus à protéger ; escouade de miliciens et démons à leurs trousses.'],
      ['Non', 'Les deux Blancs sont pendus sous leurs yeux.'],
    ])]),
  scene('poursuite', 'L\'escouade', 'N\'djamena',
    'Conséquence possible de la scène précédente (ou de tout éclat) : escouade de miliciens bien armés et démons lancée à la recherche des PJ. Ajuster le nombre à l\'état du groupe.',
    [inScene(milArmes, { qty: 6 }), inScene(fin1), inScene(bourrin1)], true),
  scene('zoo', 'Le zoo dans la rue', 'Larges avenues de N\'djamena',
    'Une meute de lions conduite par un démon de Caym transformé flaire les PJ, même cachés. Manœuvre d\'encerclement : quatre lions avancent à découvert pendant que deux groupes aussi nombreux contournent par les côtés.',
    [inScene(lion, { qty: 12 }), inScene(demonCaym)], true),
  scene('helico', 'Faux espoir', 'N\'djamena, la nuit',
    'Bruit d\'hélicoptère : une Gazelle de l\'armée française balaie le sol de son projecteur. Se signaler est une mauvaise idée : l\'appareil a été réquisitionné par le PCA et transporte six miliciens bien armés.',
    [inScene(milArmes, { qty: 6 })], true,
    [choice('signal', 'Les PJ se signalent-ils à l\'hélicoptère ?', [
      ['Oui', 'Six miliciens bien armés débarquent.'],
      ['Non', 'L\'hélicoptère passe son chemin.'],
    ])]),
  scene('caserne', 'Les soldats sont sympas', 'Caserne française de N\'djamena',
    'De jour : calme, désert, traces de combat sans corps. De nuit : des dizaines de soldats français néo-zombifiés, Famas en main, sortent des caves et attaquent tout ce qui bouge. Si les PJ insistent, sortir les lance-roquettes, voire un char Leclerc.',
    [inScene(zombieSoldat, { qty: 12 })], true),
  scene('sortie', 'Par ici la sortie', 'Hors de N\'djamena',
    `Quitter la ville n'apporte rien : le PCA tient toutes les villes voisines (déportation et zombification, villes fantômes). À pied, il faut des jours pour atteindre une frontière en évitant routes et postes ; en voiture, repérage rapide par le PCA ou les démons.
La fuite n'est de toute façon pas une solution : il faut arrêter ce qui se passe au Tchad.`),

  // ===== Acte 3 =====
  scene('briefing', 'Acte 3 – Le briefing de la mort', 'Planque des PJ, puis le fleuve Logone',
    `Coulisses : Félix, agent du Labyrinthe, a contacté son homologue d'Andromalius (l'Enfer communique normalement). Andromalius, venu en personne sans être reconnu, a identifié Bifrons en Koundja. Il s'allie à Beleth (humiliée par Hornet depuis Gothic Horror, et liée à l'Afrique par la Meuf) et à Kronos (nœud des futurs possibles très sombre).
Quand les joueurs ont eu leur dose de l'acte 2, Félix retrouve les PJ (Sens surdéveloppés) et les enrôle : Koundja est Hornet, sorcier « introduit en Enfer » ; depuis deux ans il incarne des démons dans des sorciers du monde entier, désormais plusieurs dizaines au Tchad, chacun à la tête d'un camp. Dès demain, ils sacrifient tous les prisonniers pour alimenter un rituel géant (plusieurs millions de morts). QG d'Hornet : la brasserie industrielle de Moundou ; fin du rituel dans quatre jours, en pleine nuit. Impossible de couvrir tous les camps : il faut frapper Hornet.
Les civils restent : un serviteur de Dieu de Félix les évacue (ou les garder si un lien fort s'est noué).
Un petit tour en bateau : un pilote serviteur de Dieu, les PJ cachés sous une couche de purin ; un ou deux contrôles, sinon sans accroc. Les miliciens gèrent maintenant les sacrifices ; les morts-vivants tiennent les villes.`,
    [inScene(felix)]),
  scene('moundou', 'Moundou', 'Moundou',
    `Ville presque entièrement peuplée de néo-zombies (environ douze mille) et de démons de toutes sortes, qui s'ennuient (télé, partie de Magna Veritas) et comptent sur les morts-vivants pour repérer les intrus.
Selon la Discrétion, une ou deux attaques de néo-zombies : l'enjeu est de les empêcher de donner l'alerte, alors que les PP manquent cruellement.`,
    [inScene(zombie, { qty: 4 })], true),
  scene('brasserie', 'La brasserie du Logone', 'Brasserie industrielle de Moundou',
    `Grand bâtiment de pierre à deux étages : entrée administrative sur un côté (bureaux), grande porte de livraison en façade. Équipes de démons sur le toit, devant chaque porte et en patrouille dans les rues voisines (chacune avec une meute de zombies). Grade et nombre libres : assaut très risqué mais pas impossible.
L'air est saturé de l'énergie des sacrifices : le MJ peut en profiter pour rendre quelques PP aux PJ.
Laisser les joueurs bâtir un plan spectaculaire (déguisement en morts-vivants, camion volé contre le portail, téléportation sur le toit, sniper…) ; Félix rappelle qu'il faut entrer à tout prix. Éviter que le groupe se sépare : un PJ qui se sacrifie en diversion doit pouvoir rejoindre les autres.
Faire tout sauter à la dynamite est festif mais inutile : le sanctuaire d'Hornet est protégé magiquement. Quelques combats, puis on entre.`,
    [inScene(bourrin2), inScene(fin2), inScene(bourrin1), inScene(zombie, { qty: 6 })], true),
  scene('pentacle', 'Le pentacle', 'Intérieur de la brasserie',
    `Usine vide, psalmodie au fond. Hornet, toge noire brodée de rouge, bras levés et yeux fermés, au centre d'un pentacle de quelques mètres ; devant lui un second pentacle vide, sauf des composantes mineures (arme, préservatif usagé, cœur humain, tête de chèvre…).
Deux grades 3 de Bifrons le gardent, Cysto et Balto ; aucun autre démon ni mort-vivant n'entre (Hornet ne veut pas de témoins). Il faut les vaincre.
Ensuite : Hornet est intouchable (ni coups, ni armes, ni pouvoirs). Seule issue : qu'il sorte de lui-même du pentacle (provocation, moquerie, réflexe idiot : lui lancer une balle, lui offrir une bière), ce qui a peu de chances de marcher. Disperser les composantes du second pentacle l'énerve et le gêne, sans plus.`,
    [inScene(cysto, { qty: 2 })], true,
    [choice('provoquer', 'Les PJ parviennent-ils à faire sortir Hornet du pentacle ?', [
      ['Oui (miracle)', 'Le rituel est interrompu : passer directement à « Le rituel échoue ».'],
      ['Non', 'L\'invocation va à son terme : voir la scène suivante.'],
    ])]),
  scene('denouement', 'Ben tout ça pour ça ?', 'Brasserie, pentacle d\'invocation',
    `Les anges ne peuvent en fait rien faire pour l'instant : la fin dépend de la suite que le MJ veut donner à sa campagne. Hornet, devenu prince-démon, invoque… Satan (jeune homme au regard de braise, puissance infernale palpable).
• Le rituel réussit : Satan se met à son service ; fin du Grand Jeu, la Terre devient un monde de zombies régné par Hornet, et Dieu part fonder une autre réalité.
• Le rituel échoue (intervention des PJ, ou invocation prévue pour Samael plutôt que Damien) : Satan, détendu, traite Hornet de sorcier de pacotille et le réduit en cendres.
• Le rituel réussit… avec un mais (option préférée de l'auteur) : Kronos fige Hornet dans une stase, Andromalius ouvre une brèche noircie dans la barrière du pentacle, et Beleth projette l'esprit des PJ dans celui d'Hornet pour l'y vaincre, vite.`,
    [], false,
    [choice('fin', 'Quelle fin choisit le MJ ?', [
      ['Le rituel réussit', 'Fin du monde : Hornet règne sur une Terre de zombies.'],
      ['Le rituel échoue', 'Satan anéantit Hornet ; voir l\'épilogue.'],
      ['Réussite avec un mais', 'Combat dans l\'esprit d\'Hornet (scène suivante).'],
    ])]),
  scene('reve', 'Dans l\'esprit d\'Hornet', 'Cité onirique gigantesque et crasseuse, place bordée d\'arbres morts',
    'Hornet fait face aux PJ, un peu perdu, avec des caractéristiques très réduites (fiche « monde des rêves »). Si les PJ perdent, ils meurent et Hornet reprend ses esprits : retour à la fin du monde.',
    [inScene(hornet)], true,
    [choice('duel', 'Issue du combat onirique ?', [
      ['Les PJ gagnent', 'Retour dans la brasserie : épilogue.'],
      ['Les PJ perdent', 'Ils meurent ; Hornet achève le rituel et c\'est la fin du monde.'],
    ])]),
  scene('epilogue', 'Épilogue', 'Brasserie, puis le Tchad',
    `Victoire : les PJ se réveillent ; Andromalius pousse du pied le corps vide d'Hornet et l'emporte sur l'épaule. Satan, sorti de sa transe, épargne les anges (« c'est votre récompense ») et disparaît avec les princes.
Les communications avec le Paradis reviennent : on peut invoquer Dominique ou un autre archange. Les démons impliqués sont déclarés renégats, traqués par Andromalius et les services de Damien. Les néo-zombies peuvent encore causer des problèmes ou s'effondrer à court de PP. Le PCA, sans chef, se délite : la guerre civile qui s'éternise expliquera au monde les millions de morts.
Hornet survit, prisonnier d'un univers de poche grand comme un bocal sur la MRC, où Beleth vient le taquiner. Le corps de Bifrons est animé par un fidèle d'Andromalius infiltré chez le prince des morts : un prince décérébré, fan de grosses motos et de hard rock, ami de tout le monde. « Bifrons est redevenu lui-même ! »`),
];

const scenario = {
  id: 'of1-bifrons-president',
  nom: 'On Ferme – Bifrons président !',
  resume: 'Scénario de Magna Veritas pour un groupe d\'anges de toute taille et de toute puissance, en trois actes. Envoyés au Tchad en pleine guerre civile pour protéger civils et ressortissants, les PJ découvrent que le chef rebelle Jean Koundja est Hornet, le sorcier qui a pris la place de Bifrons. Acte 1 : missions dirigistes (Mongo, attentat, émeute de l\'aéroport, chute du palais). Acte 2 : survie dans N\'djamena envahie par les néo-zombies, sans récupération de PP. Acte 3 : avec l\'aide d\'Andromalius, Beleth et Kronos, interrompre à Moundou le rituel qui doit invoquer Satan.',
  notes: `Source : ${REF} (les fiches de Cysto et Balto et d'Hornet sont p. 119). Mieux apprécié par des joueurs qui connaissent Fire & Ice (Bifrons remplacé par Hornet).
Le livre précise que le Tchad n'est qu'une toile de fond pour un « film décomplexé », sans prétention documentaire.

Contexte (fiction) : Hornet s'est incarné dans un instituteur, Jean Koundja, et en a fait en quelques mois le chef du Parti du Cœur Africain (PCA) : milliers de miliciens surtout chrétiens, opposants ralliés ou remplacés par des démons, escalade vers un génocide des populations musulmanes du nord. N'djamena est encore épargnée à l'arrivée des PJ.
But secret : 6 666 666 sacrifices humains pour un rituel qui fera de lui l'invocateur de Satan.

Trois ambiances : acte 1 dirigiste et rapide (les PJ suivent le mouvement), acte 2 film de zombies et survie (prendre son temps, faire sentir l'impuissance), acte 3 film d'action et final spectaculaire.
Règles spéciales : à partir de l'acte 2, plus de récupération de PP ni d'invocation ni de Réticulum ; le MJ peut rendre quelques PP près de la brasserie.
PJ mort : il reprend un ange de grade 1 du poste de N'djamena.
Nouveaux pouvoirs cités (On Ferme, p. 99-107) : Hystérie collective, Martyre, Disparition.
Récompenses : le livre ne donne pas de barème de PA ; la vraie récompense est d'être épargnés par Satan. À l'appréciation du MJ.
Fiches : les miliciens bien armés, manifestants, néo-zombies, vampires, lions et démons « bourrins » et « fins » reprennent les valeurs du bestiaire de l'application. Les attaques au format du livre (seuil/RU+X/MR+Y) sont converties en att = 2X, puissance Y.`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = npcs.map(asType);
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));
const nch = scenes.reduce((a, s) => a + s.choix.length, 0);
writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types,', nch, 'choix');
