// Génère le fichier d'import « insmv-scenario » pour « Jésus Reviens ! », chap. 5 « No Voices in the Sky » (Salt Lake City, p. 58-77)
// usage : node gen-jesus-reviens-4-salt-lake-city.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Jésus Reviens ! (INS/MV4), chap. 5 « No Voices in the Sky », p. 58-77';
const L = (s) => R.parseLvl(String(s));
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
// « Armure corporelle (chitine) 4 » → pouvoir « Armure corporelle » niveau 4 (la précision est reprise dans les notes)
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); const n = (m ? m[1] : x).replace(/\s*\(.*?\)\s*/g, '').trim(); return { n, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
const ARMES = new Map(R.ARMES.flatMap(([g, l]) => l.map((x) => [x[0], { prec: x[1], puis: x[2], melee: R.MELEE_GROUPS.includes(g) }])));
const arme = (n, table, lvl) => { const w = ARMES.get(table); if (!w) throw new Error('arme inconnue : ' + table); return { n, att: L(lvl), ...w }; };
// arme décrite dans le livre (précision / puissance)
const livre = (n, lvl, prec, puis, melee) => ({ n, att: L(lvl), prec, puis, melee });
const poing = (lvl) => arme('Coup de poing', 'Coup de poing', lvl);
const P = 'jr4-'; let n = 0; const id = (k) => P + k;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});
const SANS_ARME = 'Aucun talent de combat : pas d\'arme, Défense 1 (non donnée).';

// ---------------- Les deux vice-présidents ----------------
const monson = npc('monson', {
  nom: 'Thomas S. Monson', source: 'Premier vice-président de l\'Église mormone (86 ans)', car: car('1+ 1 1+ 2+ 2 3'),
  pfFix: 4, seuilsFix: seuils('2/5/7/10'),
  talents: 'Discussion 3, Savoir occulte 1 (Église des Saints des Derniers Jours 3+), Métier (vice-président mormon) 1+, Culture générale 1 (vie dans l\'Utah au XXIe siècle 2), Être convaincu de la supercherie de l\'Église 2+, Soupçonner tout le monde 2, Vouloir détruire l\'Église 2',
  notes: `Le plus âgé des vice-présidents, persuadé qu'il deviendrait prophète d'office : grosse déception. Secret : une « révélation » lui a montré que Joseph Smith était un imposteur ; depuis, il accumule en cachette les preuves des incohérences de la doctrine. Se prend un peu pour le vrai prophète qui chassera les marchands du temple, mais trop vieux, indécis et passif pour agir. Pense que la mort du prophète est un meurtre, n'ose pas faire de scandale. S'il est élu, il annoncera publiquement la supercherie (fin de l'Église).
Coffre-fort chez lui : notes, preuves et journal de recherche (dossiers de Monson, IA 2). Candidat déclaré (argument unique : la préséance) ; se retire à J+3 pour soutenir David Haight.
${SANS_ARME}`,
});
const faust = npc('faust', {
  nom: 'James E. Faust', source: 'Second vice-président de l\'Église mormone (78 ans)', car: car('1+ 1+ 2 1+ 2 2'),
  pfFix: 3, seuilsFix: seuils('2/5/7/10'),
  talents: 'Discussion 3, Baratin 2, Savoir occulte 0+ (Église des Saints des Derniers Jours 1), Métier (vice-président mormon) 1+, Culture générale 1 (vie dans l\'Utah au XXIe siècle 3), Paraître concerné en ne faisant rien 2, Se contenter de ce qu\'il a 2+',
  notes: `Apparatchik issu d'une vieille famille riche de l'Utah, très mauvais prêtre qui trouve les rites grotesques. Aime le pouvoir sans les responsabilités : ne veut surtout pas être prophète et espère un successeur peu réformateur. En réunion, silencieux, l'air inspiré.
${SANS_ARME}`,
});

// ---------------- Les douze apôtres ----------------
const moroni = npc('moroni', {
  nom: 'Moroni (Boyd K. Packer)', source: 'Ange de Laurent, grade 3 (officiellement prisonnier et dégradé en grade 0, mais avec ses pouvoirs) – apôtre', type: 'ange',
  car: car('6+ 6 5 7 7+ 5'), def: L(9), pp: 56, pfFix: 13, seuilsFix: seuils('9/19/28/38'),
  armes: [livre('Épée bâtarde du Moyen-Âge ancienne', 10, 6, 8, true)],
  pouvoirs: pows('Juste-lame 8, Télépathie 7, Armure corporelle 5, Bénédiction 2, Chant angélique 2, Invisibilité 2, Caméléon 2, Polymorphie 2, Peur 3, Supériorité martiale 6, Vitesse 4, Illusions 1, Vol 3'),
  talents: 'Combat 4 (épées 10), Défense 9, Discrétion 7, Discussion 6, Aisance sociale 5, Athlétisme 7, Culture générale 2 (vie des USA au XIXe siècle et Confédération de Laurent 5), Savoir occulte 3 (Église des Saints des Derniers Jours 10+), Intimidation 8, Langue bidon du Livre de Mormon, Savoir militaire 1 (tactique en bataille rangée du Moyen-Âge 6), Survie 2 (montagne 6), Français, Allemand',
  notes: `Grand méchant de l'épisode. Cofondateur du mormonisme avec Mormon (ange d'Yves), mis au placard depuis 1894, libéré en douce grâce à Semper Fidelis et à la complaisance de Laurent ; incarné dans l'apôtre Boyd K. Packer. A fait changer la règle de succession (élection par les pairs au lieu de l'ancienneté) puis étouffé le prophète avec un oreiller. Veut être élu ; sinon il se révélera comme ange fondateur. Fanatique, impatient, un peu perdu sans Mormon ; croit qu'un espion de Dominique noyaute l'Église. Tom Perry a remarqué son changement de personnalité.
Armure corporelle (argent), Bénédiction (fertilité). Épée : précision +6, puissance +8 (livre).`,
});
const viatix = npc('viatix', {
  nom: 'Viatix (L. Tom Perry)', source: 'Démon de Scox, grade 2 – apôtre', type: 'demon',
  car: car('3 5 5 6+ 3 4'), def: L(3), pp: 22, pfFix: 9, seuilsFix: seuils('5/10/15/20'),
  armes: [livre('Griffes (Membre exotique)', 4, 0, 1, true)],
  pouvoirs: pows('Illusions 3, Télépathie 5, Possession 3, Hurlement démoniaque 2, Malédiction 2, Peur 2, Télékinésie 3, Membre exotique'),
  talents: 'Baratin 5, Corps à corps 4, Défense 3, Discrétion 3, Séduction 5, Discussion 5, Aisance sociale 4, Savoir occulte 3 (témoins de Jéhovah 5), Métier (prêtre témoin de Jéhovah) 3, Métier (apôtre mormon) 3',
  notes: `Manipulateur formé chez les témoins de Jéhovah, premier démon à infiltrer durablement les mormons : incarné depuis 27 ans dans L. Tom Perry (mort dans un peep-show de Las Vegas). Veut mettre l'Église au service du Mal. Sait que le prophète a été assassiné, soupçonne un collègue humain, et cherche l'ange infiltré (il soupçonne d'abord David Haight, puis Boyd Packer). N'utilise plus ses pouvoirs depuis qu'il sent un ange dans le coin ; fait venir une équipe d'intervention de Las Vegas/Denver.
Coffre-fort chez lui : son agenda de démon (numéros codés de ses contacts, supérieurs et de l'équipe d'intervention).
Malédiction (folie), Membre exotique (griffes). Griffes : précision 0 / puissance +1 estimées.`,
});
const haight = npc('haight', {
  nom: 'David B. Haight', source: 'Psy indépendant – apôtre', type: 'psi',
  car: car('1+ 2 3 3+ 3+ 3'), def: L(2), pp: 8, pfFix: 5, seuilsFix: seuils('2/5/7/10'),
  talents: 'Baratin 3, Discussion 3, Défense 2, Aisance sociale 4, Savoir occulte 1 (Église des Saints des Derniers Jours 3), Métier (apôtre mormon) 3, Culture générale 1 (vie dans l\'Utah au XXIe siècle 2), Tchèque. Pouvoirs psioniques : Pouvoirs psychiques 3 (Télépathie 3), Pouvoirs offensifs 2 (Lire les pensées 2), Pouvoirs martiaux 2 (Détection des ennemis 2)',
  notes: `Le plus jeune et le plus sympathique du Quorum : psy qui s'ignore (pas « aware », ne connaît rien du Grand Jeu), converti parce que les mormons trouvent normal d'entendre des voix. Honnête, pieux, persuadé d'être l'élu. Blocage psychologique : n'utilise ses pouvoirs qu'en priant ou dans un temple. Moroni le prend pour un ange infiltré (de Dominique puis de l'Union), Viatix pour un ange ou un démon. Toute sa famille (femme, sept enfants) se vante qu'il entend des voix.
${SANS_ARME.replace(', Défense 1 (non donnée)', '')}`,
});
const maxwell = npc('maxwell', {
  nom: 'Neal A. Maxwell', source: 'Apôtre (81 ans)', car: car('1+ 1+ 2 3 2+ 1+'),
  pfFix: 4, seuilsFix: seuils('2/5/7/10'),
  talents: 'Discussion 2, Baratin 1, Savoir occulte 1 (Église des Saints des Derniers Jours 2), Métier (apôtre mormon) 2, Culture générale 1 (vie dans l\'Utah au XXIe siècle et films pornos trash 2+), Torture 3, Viol 3+, Séduction 3+, Hobby (photo) 2, Hobby (vidéo) 2, Russe',
  notes: `Ancien enfant martyrisé, sauvé de la rue par les missions mormones, devenu un pervers sexuel : polygame en secret (17 épouses qu'il maltraite). Soutenu par la branche la plus réactionnaire : non-candidat, mais son appui est indispensable à tout candidat. Donjon sado-maso chez lui, cassettes et photos ; ses femmes et petits-enfants peuvent parler (scandale : TRIC −2).
Cible de chantage de Moroni puis de Viatix ; se suicide à J+6 dans la chronologie par défaut.
${SANS_ARME}`,
});
const nelson = npc('nelson', {
  nom: 'Russell M. Nelson', source: 'Apôtre (79 ans)', car: car('1+ 2 2 2 1+ 3'),
  pfFix: 3, seuilsFix: seuils('2/5/7/10'),
  talents: 'Discussion 3, Baratin 2, Savoir occulte 1 (Église des Saints des Derniers Jours 3), Métier (apôtre mormon) 3, Culture générale 1 (vie dans l\'Utah au XXIe siècle 2), Entendre des voix 2+, Changer d\'avis subitement 2+, Portugais',
  notes: `Vieillard schizophrène, heureux et mystique : entend des voix (son subconscient), demande la réponse au Seigneur à la moindre question et change d'avis à chaque fois. Moroni se sert de lui à J pour « prophétiser » qu'un prophète doit être désigné sous un demi-mois. Sa femme, épuisée, parle volontiers de ses délires ; ses voisins non mormons racontent ses bourdes.
${SANS_ARME}`,
});
const oaks = npc('oaks', {
  nom: 'Dallin H. Oaks', source: 'Apôtre, doyen du Quorum (91 ans)', car: car('1 1 1+ 1 1 1'),
  pfFix: 2, seuilsFix: seuils('2/4/6/8'),
  talents: 'Baver 3+, Faire pipi sous lui 1, Ânonner 2',
  notes: `Totalement sénile, en fauteuil roulant dans son bureau médicalisé. Doyen : il aurait dû succéder d'office, ce qui a servi à Moroni pour faire voter l'élection. Jadis bon orateur et bon vivant.
${SANS_ARME}`,
});
const ballard = npc('ballard', {
  nom: 'M. Russell Ballard', source: 'Apôtre (88 ans)', car: car('2 1+ 2 3 3 2'),
  pfFix: 5, seuilsFix: seuils('3/6/9/12'),
  talents: 'Discussion 3, Savoir occulte 1 (Église des Saints des Derniers Jours 3), Métier (apôtre mormon) 3+, Culture générale 1 (vie dans l\'Utah au XXIe siècle 3), Prêcher avec conviction 3, Allemand',
  notes: `Bien conservé, croyant sincère, humble et honnête : un des modérateurs du Quorum. Rêve d'être élu mais sa modestie l'empêche de se déclarer. Le plus choqué en cas de scandale moral touchant l'Église ou le Quorum.
${SANS_ARME}`,
});
const wirthlin = npc('wirthlin', {
  nom: 'Joseph B. Wirthlin', source: 'Apôtre (67 ans)', car: car('1+ 2 2 3+ 1 3'),
  pfFix: 5, seuilsFix: seuils('2/5/7/10'),
  talents: 'Discussion 1, Savoir occulte 1 (Église des Saints des Derniers Jours 3+), Métier (apôtre mormon) 3+, Culture générale 1 (vie dans l\'Utah au XXIe siècle 2), Ne pas choisir 3, Français',
  notes: `L'indécis de la majorité silencieuse : suit toujours la majorité ou le plus bruyant ; peu estimé de ses pairs. Rallié à Tom Perry (ne va pas à la cathédrale à J+2).
${SANS_ARME}`,
});
const scott = npc('scott', {
  nom: 'Richard G. Scott', source: 'Apôtre (58 ans)', car: car('2 2+ 1+ 2 2 1+'),
  pfFix: 4, seuilsFix: seuils('3/6/9/12'),
  talents: 'Discussion 3+, Baratin 3, Savoir occulte 0+ (Église des Saints des Derniers Jours 1+), Métier (apôtre mormon) 1, Culture générale 1 (vie dans l\'Utah au XXIe siècle 2), Aisance sociale 3+, Vomir sur les gens 2, Faire des sous-entendus mesquins 3+, Écraser les autres 2, Séduction 2+, Espagnol, Humilier les gens 2, Flagorner 3+',
  notes: `Arriviste obséquieux, sans morale, lâche et mesquin ; se croit le seul candidat possible. Détesté jusque dans sa famille (facile à faire parler). Relation sado-masochiste psychologique avec Jeffrey Holland, qu'il humilie en public. S'il devient prophète : TRIC +1.
${SANS_ARME}`,
});
const hales = npc('hales', {
  nom: 'Robert D. Hales', source: 'Apôtre (83 ans)', car: car('1 1+ 2+ 3+ 2 2'),
  pfFix: 4, seuilsFix: seuils('2/4/6/8'),
  talents: 'Discussion 3, Savoir occulte 1+ (Église des Saints des Derniers Jours 3), Métier (apôtre mormon) 3+, Culture générale 1 (vie dans l\'Utah au XXIe siècle 2), Avoir le cancer de la prostate 3+, Perdre ses cheveux 3+, Faire chier le monde 2+, En vouloir au monde entier 2',
  notes: `Cancer en phase terminale, perfusion et infirmières jour et nuit, veuf. Candidat : Dieu ne laisserait pas mourir son prophète… et un prophète mourant ferait une trêve. Pousse à accélérer. Assassiné par Ve'eem lo ach'shav (déguisé en infirmière) à J+5 dans la chronologie par défaut.
${SANS_ARME}`,
});
const holland = npc('holland', {
  nom: 'Jeffrey R. Holland', source: 'Apôtre (71 ans)', car: car('2 2+ 3+ 2 1+ 1+'),
  pfFix: 4, seuilsFix: seuils('3/6/9/12'),
  talents: 'Discussion 2, Baratin 3+, Savoir occulte 0+ (Église des Saints des Derniers Jours 1), Métier (apôtre mormon) 1, Culture générale 1 (vie dans l\'Utah au XXIe siècle et films de peplum 2+), Médire 2, Soutenir Richard G. Scott 2, Se faire humilier par Richard G. Scott 3+, Hobby (sado-masochisme) 2, Aisance sociale 2+, Savoir d\'espion 1 (espionnage culturel 3+), Arabe',
  notes: `Bras droit et souffre-douleur de Richard G. Scott, à qui il doit tout ; célibataire (rare chez les mormons). Matériel porno masochiste caché dans un coffre-fort chez lui. Allié inconditionnel de Scott.
${SANS_ARME}`,
});
const eyring = npc('eyring', {
  nom: 'Henry B. Eyring', source: 'Apôtre (64 ans)', car: car('2 2+ 2+ 3+ 2 3'),
  pfFix: 5, seuilsFix: seuils('3/6/9/12'),
  talents: 'Discussion 3+, Savoir occulte 1+ (Église des Saints des Derniers Jours 3+), Métier (apôtre mormon) 3, Culture générale 1 (vie dans l\'Utah au XXIe siècle 2), Aisance sociale 2+, Démonter l\'argumentation de quelqu\'un 3+, Se prendre la tête sur un problème 2+, Hobby (chasse) 2, Allemand',
  notes: `Apôtre consciencieux et sans a priori, l'esprit le plus ouvert du Quorum ; prêt à être prophète seulement s'il peut apporter quelque chose. Rallié à Tom Perry à J+2. Un interlocuteur possible pour les PJ.
${SANS_ARME}`,
});

// ---------------- Troupes ----------------
const californiens = npc('californiens', {
  nom: 'Soldats de Dieu californiens', source: 'Renforts envoyés par Sharah (20 hommes) – alliés des PJ', type: 'soldat', qty: 4,
  car: car('3+ 2+ 2+ 2 2+ 2'), def: L(3), pp: 5, pfFix: 5, seuilsFix: seuils('4/9/13/18'),
  armes: [livre('Pistolet', 3, -2, 4, false), arme('Corps à corps', 'Coup de poing', 3)],
  pouvoirs: pows('Anaérobiose 1, Vitesse 2'),
  talents: 'Surfer 2, Bronzer 2, Corps à corps 3, Défense 3, Tir 1+ (armes de poing 3), Séduction 3+, Athlétisme 2, Rouler des mécaniques en calbut de bain et chemise hawaïenne 2, Culture générale 1 (vie de surfer de la Côte Ouest 2), Savoir occulte 1 (l\'Union de Laurent 2+), Espagnol, Savoir militaire 1 (tactique 2), Se mettre du gel 2',
  notes: `Beaux gosses bronzés et cools, holster sous la chemise hawaïenne : détonnent à SLC. Motivés, protestants ouverts, capables d'initiative ; respectent les anges si le respect est réciproque.
Le livre donne « Tir 3 » et « Tir 1+ (armes de poing 3) » : pistolet au niveau 3. Pistolet : précision −2, puissance +4 (livre).`,
});
const marshals = npc('marshals', {
  nom: 'Marshals de la Confédération (Walther MacDougall et William Golding)', source: 'Serviteurs de Dieu de Semper Fidelis, marshals fédéraux (37 et 42 ans)', type: 'serviteur', qty: 2,
  car: car('2+ 2 3 2+ 2 2'), def: L(3), pp: 5, pfFix: 4, seuilsFix: seuils('3/7/10/14'),
  armes: [livre('Revolver de cowboy', 2, -2, 4, false), livre('Fusil à pompe', 3, -2, 5, false), arme('Corps à corps', 'Coup de poing', '2+')],
  pouvoirs: pows('Peur 1'),
  talents: 'Baratin 1, Corps à corps 2+, Défense 3, Enquête 3, Fouille 2+, Intrusion 2+, Métier (marshal fédéral) 2, Athlétisme 2, Culture générale 1 (droit fédéral américain et vie aux USA au troisième millénaire 2+), Savoir occulte 1 (la Confédération de Laurent 2), Être raciste sans en donner l\'air 2, Intimidation 2+, Savoir occulte 1 (KKK 2), Tir 2 (armes d\'épaule 3)',
  notes: `Pros, calmes, sûrs de leur bon droit, pères de famille honnêtes ; leur plaque leur permet d'enquêter dans tous les États. Arrivent à J+3 escortés par les soldats de Dieu d'Alabama. Leur témoignage vaut 2L à l'IA.`,
});
const alabama = npc('alabama', {
  nom: 'Soldats de Dieu d\'Alabama (Dixiemen)', source: 'Groupe d\'intervention de Semper Fidelis (20 hommes)', type: 'soldat', qty: 6,
  car: car('3 3 2+ 1+ 2 2'), def: L('2+'), pp: 5, pfFix: 4, seuilsFix: seuils('4/8/12/16'),
  armes: [livre('Barre de fer', '2+', -1, 2, true), livre('Fusil à pompe', 2, -2, 5, false)],
  pouvoirs: pows('Augmentation de force 2, Peur 1'),
  talents: 'Corps à corps 2+, Combat 1 (contondantes 2+), Défense 2+, Fouille 2, Tir 1 (armes d\'épaule 2), Athlétisme 2+, Culture générale 1 (vie du sud des USA 2), Savoir occulte 1 (KKK et Confédération de Laurent 2), Savoir militaire 1 (tactique 2), Hobby (lynchage) 2+, Regarder le super-bowl en rotant de la Bud 2+',
  notes: `Bœufs sponsorisés en T-shirts sudistes, grandes gueules, surarmés, brutaux et pas discrets : Moroni a du mal à les employer en pleine ville. Obéissent tant que ça va dans le sens de leurs convictions. Arrivent à J+3 ; douze d'entre eux meurent dans l'assaut de J+6 (chronologie par défaut).
Quantité de la scène à ajuster (6 par défaut sur 20).`,
});

// ---------------- La force d'intervention démoniaque ----------------
const ukshe = npc('ukshe', {
  nom: 'U\'kshe (Gerry Carjaval)', source: 'Démon de Baal, grade 3 – chef de la force d\'intervention', type: 'demon',
  car: car('6+ 6 6+ 3 2 4'), def: L(8), pp: 48, pfFix: 9, seuilsFix: seuils('8/17/25/34'),
  armes: [livre('Hache de pompier (inadaptée à la parade)', 8, 0, 3, true), livre('Lance-roquettes maudit ancien et rapide (attaque multiple)', 7, -1, 19, false), livre('Griffes (Membre exotique)', '10+', 0, 1, true)],
  pouvoirs: pows('Art de combat 6, Armure corporelle 4, Douleur 4, Éventration 3, Supériorité martiale 3, Vitesse 3, Membre exotique'),
  talents: 'Baratin 3, Corps à corps 10+, Défense 8, Combat 3 (haches 8), Discrétion 5, Discussion 5, Enquête 5, Fouille 6, Intrusion 6, Tir 3 (armes de guerre 7), Acrobatie 8, Hobby (collection de cartes de joueurs de base-ball) 3, Athlétisme 6, Intimidation 4, Savoir d\'espion 2 (se déguiser 5), Savoir militaire 2 (tactique 6), Culture générale 2 (vie aux USA au troisième millénaire 5), Savoir occulte 2 (le Grand Jeu aux USA 4)',
  notes: `Professionnel méthodique qui planifie tout ; quand le plan déraille, il passe en force. Discipliné, indifférent à la mort de ses équipiers (28 partenaires morts avant ceux-ci). Se déguise selon la mission : à SLC, en missionnaire mormon avec badge et cravate.
Armure corporelle (chitine), Membre exotique (griffes, précision 0 / puissance +1 estimées). Lance-roquettes : précision −1, puissance +19, pénétration importante (livre).`,
});
const veeem = npc('veeem', {
  nom: 'Ve\'eem lo ach\'shav (David Deitzer)', source: 'Démon de Hornet, grade 2 – force d\'intervention', type: 'demon',
  car: car('6 5 4 3 2+ 4'), def: L(5), pp: 25, pfFix: 7, seuilsFix: seuils('8/16/24/32'),
  armes: [poing(4)],
  pouvoirs: pows('Polymorphie 3, Nécrose 2, Larves sous-cutanées 3, Résurrection macabre 4, Armure corporelle 4, Augmentation de force 4, Éventration 4, Ténèbres sataniques 3, Malédiction 2, Peur 3'),
  talents: 'Culture générale 1 (vie au XIXe siècle 3), Savoir occulte 1 (le Grand Jeu aux USA 3), Hobby (thé) 4, Paraître hors du coup 4, Baratin 3, Corps à corps 4, Défense 5, Discussion 4, Anglais du XIXe siècle 5, Enquête 4, Savoir militaire 2 (commander une escouade de zombies 4)',
  notes: `Incarné depuis plus d'un siècle, resté à la fin du XIXe : courtois, gentleman de la Côte Est, sportivité très britannique même au combat ; seul péché, le thé à la bergamote. Plus ancien partenaire vivant d'U'kshe, ne se lie pas aux nouveaux. Maître des neuf zombies (cachés dans son van).
C'est lui qui prend l'apparence de David Haight au Nevada (J+3) puis d'une infirmière pour tuer Robert Hales (J+5).
Armure corporelle (chitine), Malédiction (maladie). Arme non donnée : poings (Corps à corps 4).`,
});
const metatron = npc('metatron', {
  nom: 'Métatron (Colleen Dunn)', source: 'Démon de Furfur, grade 1 – force d\'intervention', type: 'demon',
  car: car('5+ 4 3 2 3 3'), def: L(2), pp: 15, pfFix: 7, seuilsFix: seuils('7/15/22/30'),
  armes: [livre('Guitare électrique maudite mineure (inadaptée à la parade)', 7, 1, 4, true)],
  pouvoirs: pows('Suicide 2, Hurlement démoniaque 2, Onde de choc 2, Absorption de violence 2, Esquive acrobatique 2'),
  talents: 'Art 1 (chant 1+), Culture générale 1 (hardcore américain 3), Savoir occulte 1 (le Grand Jeu 2), Combat 2+ (armes improvisées 7), Défense 2, Acrobatie 5, Athlétisme 4, Hobby (slam diving) 4, Parler en argot sans articuler et en mangeant ses cheveux 5, Survie 1 (concerts 4)',
  notes: `Le guignol de l'équipe : métalleux sympathique, limité mais enthousiaste, se bat en hurlant du Napalm Death. Refuse de quitter son look de hardeux, déteste l'ambiance puritaine de SLC.
Guitare : précision +1, puissance +4 (livre).`,
});
const zombies = npc('zombies', {
  nom: 'Zombies de Ve\'eem', source: 'Morts-vivants (9) cachés dans le van de leur maître', type: 'mortvivant', qty: 9,
  car: car('3 1 2 1 1 3'), def: 2, pp: 5, pfFix: 4, seuilsFix: seuils('4/8/12/16'),
  armes: [livre('Ongles d\'acier (Membre exotique)', '3+', 0, 1, true)],
  pouvoirs: pows('Anaérobiose, Apparence horrifique 1, Jeûne, Immunité contre les maladies et les poisons, Membre exotique, Régénération 1'),
  talents: 'Athlétisme 2, Corps à corps 3+, Intimidation 2',
  notes: `Calmes, obéissants, et cherchent sincèrement leur tante Alice.
Ongles d'acier : précision 0 / puissance +1 estimées ; Défense non donnée (1).`,
});

const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });
const demons = () => [inScene(ukshe), inScene(veeem), inScene(metatron)];

const scenes = [
  scene('arrivee', '1. Arrivée à Salt Lake City', 'Salt Lake City (Utah), territoire de la Confédération – Jour J',
    `Les PJ arrivent sur une piste laissée (plus ou moins volontairement) par Semper Fidelis ou ses proches, en pleine « campagne électorale » : le prophète vient de mourir (officiellement d'une crise cardiaque, à 93 ans) et le Quorum des Douze Apôtres doit désigner son successeur, pour la première fois par un vote.
Objectif : empêcher Moroni (incarné dans l'apôtre Boyd K. Packer) de prendre l'Église en main, et rassembler des preuves pour l'Index d'Accusation.
Contraintes :
• Le clergé mormon refuse toute ingérence des forces du Bien et ne pense qu'à l'élection.
• Sharah (grade 3 de Laurent pour l'Union) ne peut aider qu'indirectement : intervenir en Confédération romprait son statu quo avec Semper Fidelis. Si les PJ lui font remarquer que Semper Fidelis ne s'est pas gêné à New York, il devient plus généreux (matériel, renseignements, voire soldats de Dieu : scène 11).
• Huis clos urbain dans les hautes sphères mormones. Moroni veut rester discret (le meurtre du prophète était déjà « limite »). Le Quorum cache aussi un démon de Scox (Viatix = Tom Perry) et un psy (David Haight) qui s'ignorent mutuellement ; Moroni sait qu'il y a des êtres à pouvoirs parmi les apôtres et espère, à tort, qu'il s'agit d'un espion de Dominique.
• Ville : quadrillage de blocks sans vrai centre-ville ; Temple Square (le « Vatican » des mormons, temple interdit aux non-mormons, gratte-ciel des bureaux de l'Église, musée de la foi kitsch), tramway gratuit, lac salé immense. Deux communautés qui se côtoient sans se mélanger : les « gentils » (non-mormons, clubs privés pour boire) et les LDS. Police et presse locales contrôlées par l'Église. Racisme ambiant : des PJ blancs et bien portants passent inaperçus, d'autres beaucoup moins.
• Plus la TRIC est haute, plus les méchants sont sûrs d'eux.`,
    [inScene(monson), inScene(faust), inScene(moroni), inScene(viatix), inScene(haight)]),
  scene('j0', '2. J : la prophétie de Russell Nelson', 'Temple de Temple Square, puis hôtel Wigham – Jour J',
    `• Tôt le matin, le Quorum prie au temple. Moroni envoie des messages subliminaux à Russell Nelson, qui entend pour la première fois une voix étrangère et répète qu'un nouveau prophète doit être désigné avant un demi-mois.
• David Haight panique (les voix parlent à un autre que lui), mitraille Russell de questions et lit ses pensées. Moroni et Tom Perry sentent le pouvoir, prennent chacun David pour un ennemi infiltré et ne remarquent pas leur propre étrangeté.
• Richard G. Scott fait fixer une date butoir : trois heures de débat pour retenir « dans une semaine pile ».
• En sortant, Tom, convaincu qu'un ange est infiltré au Quorum, appelle ses collègues de Las Vegas. L'après-midi, une équipe de trois démons décolle de Denver ; elle atterrit à SLC dans la nuit et s'installe à l'hôtel Wigham, à côté de Temple Square. Tom leur rend visite : trouver l'ange et le neutraliser discrètement.`,
    [inScene(nelson), inScene(haight), inScene(moroni), inScene(viatix), inScene(scott)]),
  scene('j1', '3. J+1 : la campagne électorale', 'Gratte-ciel de l\'Église et ville – J+1',
    `• Les démons repèrent la ville séparément, déguisés en touristes, et recensent les présences angéliques autour du temple : les PJ doivent rester discrets.
• Au gratte-ciel, les apôtres se rendent visite de bureau en bureau. Candidats déclarés : Thomas Monson, Moroni, Tom Perry, David Haight, Richard G. Scott, Robert Hales (Jeffrey Holland fait campagne pour Scott).
• Méthodes : Monson invoque sa place de premier vice-président ; Moroni joue la doctrine et la tradition (efficace sur les croyants) ; Tom joue la psychologie et laisse entendre à Neal Maxwell que certains secrets pourraient sortir (sans preuve) ; Scott et Holland flattent et menacent à mots couverts ; Hales, depuis son fauteuil médicalisé, vend une candidature de transition puisqu'il va mourir.
Bon moment pour que les PJ rencontrent les apôtres (fiches et motivations dans les PNJ).`,
    [inScene(monson), inScene(moroni), inScene(viatix), inScene(haight), inScene(scott), inScene(holland), inScene(hales), inScene(maxwell)]),
  scene('j2', '4. J+2 : la journée œcuménique', 'Cathédrale catholique de SLC, puis appartement de l\'évêque – J+2',
    `• Après avoir vérifié auprès de Semper Fidelis qu'aucun ange de la Confédération n'est infiltré, Moroni organise une journée œcuménique à la cathédrale catholique pour démasquer David. Absents : Tom (il dénigre la visite chez les « papistes »), qui a rallié Joseph Wirthlin et Henry Eyring ; Dallin Oaks (fauteuil) ; Robert Hales (reste avec ses infirmières).
• Pendant la messe, Moroni envoie des visions à l'évêque, qui se jette sur David en hurlant « Vade retro satanas » et l'asperge d'eau bénite : mêlée, fidèles en fuite, apôtres outrés (TRIC +1). Moroni est critiqué, perd du crédit et conclut que David est un ange de l'Union.
• Au retour des apôtres, Tom comprend que la journée était un piège tendu par quelqu'un qui croit David démon : le piégeur est donc un ange, sans doute Boyd Packer, l'organisateur. Il demande à ses démons d'accélérer et de surveiller Packer. Les démons arpentent la ville à la recherche d'anges en mission.
• Le soir, les démons torturent l'évêque chez lui (un ange télépathe l'a manipulé, sans savoir lequel), puis lestent son corps de béton et le jettent dans le Grand Lac Salé. David y voit une épreuve divine.
Combat possible si les PJ protègent l'évêque ou surprennent les démons.`,
    [...demons()], true,
    [choice('eveque', 'Les PJ interviennent-ils pour l\'évêque catholique ?', [
      ['Oui, ils le protègent', 'Affrontement avec la force d\'intervention ; l\'évêque devient un témoin (Moroni lui a envoyé des visions). Les démons savent qu\'il y a d\'autres anges en ville.'],
      ['Non', 'L\'évêque disparaît dans le lac ; sa disparition, signalée à J+3, sert de prétexte à Semper Fidelis pour envoyer des renforts.'],
    ])]),
  scene('j3', '5. J+3 : la chute de David Haight', 'Salle du conseil du gratte-ciel ; casino du Nevada – J+3',
    `• Débriefing du Quorum : Moroni est critiqué, David affirme sincèrement que les papistes démoniaques ne veulent pas de lui, donc qu'il doit être élu. Euphorique, il prie à voix haute et envoie des messages télépathiques à Robert Hales, Jeffrey Holland et Richard G. Scott ; Moroni (persuadé que David est un ange de l'Union) envoie des contre-messages. Robert, affaibli, fait une crise : séance levée. David sent un autre télépathe, sans l'identifier.
• Tom fait cambrioler la maison de David par ses démons (vêtements, cartes de crédit). David prie au temple tout l'après-midi. Thomas Monson se retire et soutient David : il devient favori.
• La police (contrôlée par l'Église) note mollement la disparition de l'évêque. Moroni appelle Semper Fidelis, qui envoie une vingtaine de soldats de Dieu d'Alabama escortant deux marshals fédéraux de la Confédération.
• La nuit, Ve'eem lo ach'shav prend l'apparence de David, va se saouler dans un casino du Nevada avec des prostituées et se fait arrêter puis photographier par la presse locale (Polymorphie limitée : il ne se transforme qu'en présence des journalistes). Il paie sa caution et disparaît ; ses collègues surveillent la maison de David, dont la famille jure qu'il n'est pas sorti.
TRIC : si les PJ révèlent la machination (Ve'eem photographié bourré sous l'apparence de David), −5.`,
    [inScene(veeem), inScene(zombies, { qty: 3 })], true,
    [choice('nevada', 'Les PJ empêchent-ils ou exposent-ils la mise en scène du Nevada ?', [
      ['Ils l\'empêchent', 'David reste favori ; Tom doit trouver autre chose. Affrontement probable avec Ve\'eem et ses zombies.'],
      ['Ils la prouvent publiquement', 'TRIC −5. David est blanchi ; les démons sont repérés.'],
      ['Ils ne voient rien', 'Le scandale accable David à J+4.'],
    ])]),
  scene('j4', '6. J+4 : le conseil de discipline', 'Gratte-ciel de l\'Église ; temple (enterrement du prophète) – J+4',
    `• À midi, séance extraordinaire du Quorum sur les « écarts » de David. Rapport de police du Nevada, photos, presse : tout l'accable. Tom insinue en plus que David a acheté l'évêque puis l'a fait disparaître par la mafia du Nevada. Sans vrai procès, David ne peut se défendre.
• Richard G. Scott fait reporter le « procès » après la désignation et propose une déclaration de soutien (jésuitique) : David est à moitié blanchi mais hors course.
• Les deux marshals enquêtent et apprennent, par des petits-enfants, les vices de Neal Maxwell ; ils préviennent Moroni.
• En fin d'après-midi, enterrement du prophète au temple devant une foule recueillie (fenêtre pour examiner le corps avant : scène 11).`,
    [inScene(marshals), inScene(haight), inScene(scott), inScene(viatix)]),
  scene('j5', '7. J+5 : chantage et meurtre à l\'hôpital', 'Bureaux de l\'Église ; chevet de Robert Hales ; maison de Neal Maxwell – J+5',
    `• Restent en course : Tom, Scott, Hales et Moroni (David est mis à l'écart). Scott et Holland font la tournée des apôtres. Moroni, mal vu depuis la cathédrale, en fait autant et fait chanter Neal Maxwell (les marshals ont découvert ses travers) : Neal fait campagne pour lui, efficacement. Moroni soupçonne désormais qu'un démon a monté l'affaire du Nevada.
• Tom comprend l'accord Neal-Moroni et passe aux grands moyens : le soir, ses démons assomment l'infirmière de relève de Robert Hales ; Ve'eem prend son apparence et tue Robert d'une bulle d'air dans la perfusion. L'infirmière est replacée dans son fauteuil après avoir été forcée à fumer du crack (pour expliquer l'« erreur médicale »).
• La nuit, les démons fouillent la maison de Neal, découvrent son donjon et emportent photos et gadgets.
Combat possible si les PJ veillent sur Robert ou sur Neal.`,
    [...demons()], true,
    [choice('hales', 'Robert Hales survit-il à la nuit ?', [
      ['Oui, les PJ déjouent le meurtre', 'Affrontement avec les démons ; l\'infirmière droguée devient une piste.'],
      ['Non', 'Second « accident » au Quorum : la pression monte.'],
    ])]),
  scene('j6', '8. J+6 : le massacre chez Boyd Packer', 'Gratte-ciel (25e étage) ; villa de Boyd Packer au bord du lac – J+6',
    `• Tom montre à Neal les photos et objets volés, apprend que Packer le faisait chanter et le « reprend » à son compte. Paniqué, Neal se jette du 25e étage du gratte-ciel.
• Le Quorum se réunit malgré les deux morts : consensus vers un vote à un tour. David, sans chance, frappe un grand coup : il souffle aux vice-présidents que le Seigneur choisira lui-même son prophète par un miracle ; le Quorum crie au miracle et adopte l'idée. Scott passe la nuit à prier. Tom craint que Packer, s'il est vraiment un ange, fabrique ce miracle : il envoie ses démons le tuer et prendre sa place.
• Nuit : les trois démons massacrent la femme et les sept enfants de Packer. Absent (il cherchait David avec les soldats de Dieu et les marshals ; ceux-ci, chez David, interrogent sa famille), Moroni repère l'anomalie et appelle ses renforts : assaut de la villa. Dans la chronologie par défaut, les démons retournent en Enfer après avoir tué un marshal et douze soldats de Dieu.
• Moroni maquille ensuite tout : ses soldats et le marshal survivant ramènent quatre ou cinq jeunes Afro-Américains (de préférence des rappeurs) qu'il abat au fusil à pompe et dispose parmi les corps ; les morts de son camp sont enterrés dans les étendues salées. Il joue la victime face à la police : la presse fait de lui un héros de l'autodéfense contre des « gangsters drogués ». Soldats et marshal survivants filent vers l'Alabama.
Scène de combat probable : démons et zombies d'un côté, Moroni et ses troupes de l'autre, tous hostiles aux PJ. Des PJ témoins du maquillage tiennent une preuve énorme contre Moroni.`,
    [...demons(), inScene(zombies), inScene(moroni), inScene(alabama), inScene(marshals)], true,
    [choice('massacre', 'Que deviennent les témoins du massacre chez Packer ?', [
      ['Les PJ ont des preuves du maquillage de Moroni', 'Preuves accablantes contre Moroni (témoignages, corps dans les étendues salées) ; le scandale peut l\'empêcher d\'être prophète.'],
      ['Les PJ capturent un soldat de Dieu ou le marshal survivant', 'Témoignage des marshals de la Confédération : 2L.'],
      ['Rien', 'Moroni passe pour un héros ; l\'enquête de police est bâclée et orientée.'],
    ])]),
  scene('j7', '9. J+7 : le miracle qui ne vient pas', 'Temple de Temple Square – J+7, vers 10 h',
    `Chronologie par défaut (échec total des PJ) :
• Grande prière du Quorum au temple : chacun attend le miracle. David envoie à tous un message télépathique disant qu'il est le prophète.
• Tom se lève, se déclare ange, accuse David d'être l'agent de Satan et s'entoure d'un halo (Illusions). Moroni se lève à son tour, se révèle comme l'ange fondateur, fait apparaître son épée bénie et attaque Tom en hurlant en angélique. Combat bref : Tom part en nuage de soufre après un Hurlement démoniaque qui glace l'assistance.
• Moroni fait avouer à David ses pouvoirs, l'absout… et le décapite. Il dissout le Quorum, exige la fidélité des apôtres et des vice-présidents et le secret, puis s'installe aux bureaux de l'Église pour restaurer la théocratie (TRIC +10, puis +3 par semaine ; il peut ensuite déclencher la sécession de l'Utah : TRIC +10).
Les PJ doivent l'empêcher de se révéler ou de parader devant ses ouailles, avec l'aide éventuelle des catholiques de SLC et de Sharah.`,
    [inScene(moroni), inScene(viatix), inScene(haight)], true,
    [choice('prophete', 'Qui devient prophète de l\'Église mormone ?', [
      ['Moroni', 'TRIC +10, puis +3 par semaine où il est prophète. TRIC 60 : sécession de l\'Utah (+10, et +10 de plus si les Klans ont fusionné).'],
      ['Thomas S. Monson (il dénonce l\'arnaque)', 'TRIC −5. L\'Église mormone s\'effondre.'],
      ['Viatix (Tom Perry)', 'TRIC −3 : il commence à pervertir l\'Église (problème pour plus tard).'],
      ['Richard G. Scott', 'TRIC +1.'],
      ['Un autre humain', 'TRIC −1 (David Haight, Henry Eyring, Russell Ballard…).'],
    ]),
    choice('moroni', 'Moroni est-il neutralisé ?', [
      ['Oui', 'TRIC −1. Son témoignage peut être obtenu (2 à 6L).'],
      ['Non', 'Il reste dans l\'Église, prophète ou non, et peut se révéler.'],
    ])]),
  scene('enquete', '10. L\'enquête : maisons, coffres et témoins', 'Collines au bord du Grand Lac Salé, morgue, Régine – à tout moment',
    `Les maisons des apôtres et vice-présidents : grandes villas de plain-pied sur les collines du lac, modestes d'aspect, rarement équipées d'alarme (criminalité la plus basse des USA), toujours pleines d'enfants et petits-enfants. Exceptions : Robert Hales (veuf, avec ses infirmières), Jeffrey Holland (célibataire), Dallin Oaks (bureau médicalisé).
Ce qu'on trouve :
• Thomas Monson : coffre-fort avec notes, preuves extérieures et son journal de recherche sur l'escroquerie mormone et son projet de la révéler (dossiers de Monson).
• Neal Maxwell : donjon sado-maso ; ses femmes, enfants et petits-enfants parlent ; cassettes et photos prises par des appareils automatiques.
• Russell Nelson : rien de caché ; sa femme raconte longuement ses délires et ses revirements. Ses voisins (surtout non mormons) ont des dizaines d'anecdotes sur sa nullité.
• Tom Perry : dans son coffre, son agenda de démon (numéros codés des contacts, supérieurs et équipe d'intervention).
• Jeffrey Holland : matériel porno masochiste dans un coffre.
• David Haight : sa famille se vante auprès des voisins qu'il entend des voix.
• Richard G. Scott : détesté jusque dans sa famille ; les gens parlent facilement, Jeffrey aussi en prend pour son grade. Sa femme le méprise mais parle plus difficilement.
La mort du prophète : version officielle, crise cardiaque dans son lit à 93 ans (Gordon B. Hinckley ; la fiche de Monson l'appelle Kindsey). En vérité, Moroni lui rendait visite (femme et secrétaire particulier, Simon Nattanun, présents) ; vers 22 h 30, il s'est absenté « aux toilettes », est monté invisible et l'a étouffé avec l'oreiller, puis est reparti vers 23 h 30. Rapport de police et témoignages des trois témoins de la soirée disponibles ; Moroni a étouffé les questions et évité l'autopsie. À la morgue, avant l'enterrement (J+4), un examen du corps révèle des traces de housse d'oreiller dans la bouche et de légères ecchymoses sur le visage.
Mormon : l'ange d'Yves cofondateur est au purgatoire pour quelques siècles. Si les PJ en parlent à Régine, ses supérieurs demanderont à Yves de l'interroger : son témoignage s'ajoute au dossier (2L).
Rappel : seules les informations transmises à Régine comptent dans l'IA officiel ; les méchants réagissent à l'IA (garder des preuves pour le procès est possible).`,
    [inScene(nelson), inScene(scott), inScene(holland), inScene(maxwell), inScene(eyring), inScene(ballard), inScene(wirthlin), inScene(oaks)], false,
    [choice('mormon', 'Les PJ demandent-ils à Régine de faire interroger Mormon ?', [
      ['Oui', 'Témoignage de Mormon versé au dossier : 2L.'],
      ['Non', ''],
    ]),
    choice('scandale', 'Les PJ révèlent-ils des scandales sur les apôtres ?', [
      ['Oui', 'TRIC −2 par scandale révélé (Maxwell, Holland, Scott…). Ballard est le plus choqué.'],
      ['Non', ''],
    ])]),
  scene('sharah', '11. Les renforts de Sharah', 'Planque des PJ à SLC – si Sharah est convaincu',
    `Si les PJ convainquent Sharah que Semper Fidelis a rompu le statu quo (attentat de New York, soldats d'Alabama à SLC…), il envoie matériel, renseignements, voire vingt soldats de Dieu californiens : surfeurs bronzés en chemise hawaïenne, bons combattants, capables d'initiative, qui respectent les anges à condition d'être respectés. Ils sont des alliés des PJ (à jouer à leurs côtés, pas comme adversaires).
Voir aussi les modificateurs de TRIC de New York sur Sharah (notes du scénario).`,
    [inScene(californiens)]),
  scene('bilan', '12. Bilan : TRIC et Index d\'Accusation', 'Après la désignation du prophète',
    `Faire le compte des modificateurs de TRIC et des preuves transmises (listes dans les notes du scénario).
Les PA des PJ dépendent de l'IA transmis ; les preuves gardées peuvent encore servir au procès final (épilogue « Heaven Can Wait »).
Suites possibles : sécession de l'Utah (TRIC 60) si Moroni est prophète ; Viatix prophète = Église pervertie à surveiller ; soldats et marshal survivants repartis en Alabama (pistes vers Jacksonville).`),
];

const scenario = {
  id: 'jr4-salt-lake-city',
  nom: 'Jésus Reviens ! – 4. Salt Lake City',
  resume: 'Campagne « Jésus Reviens ! » (opération JR), épisode de Salt Lake City (« No Voices in the Sky »), pour anges de grade 1 à 2 envoyés par Ange et Alain (avec Yves, prévenus par Michel) via leur chargée de mission Régine. Le prophète mormon vient d\'être assassiné par Moroni, ange de Laurent cofondateur du mormonisme, incarné dans un apôtre et libéré avec la complicité de Semper Fidelis. En une semaine d\'élection au Quorum des Douze Apôtres, entre un démon de Scox infiltré, un psy qui s\'ignore, une équipe de démons venue de Denver et les renforts sudistes de Semper Fidelis, les PJ doivent empêcher Moroni de devenir prophète (et de faire sécession) tout en accumulant des preuves contre Laurent.',
  notes: `Source : ${REF}. Commanditaires des PJ : Ange et Alain (avec Yves), prévenus par Michel, via Régine ; Laurent, Dominique et Georges sont les archanges visés par l'Index d'Accusation (index L, G, D). Voir le fichier « Jésus Reviens ! – Cadre de la campagne » pour les PNJ récurrents (Régine, Sharah, Semper Fidelis…).
Huis clos urbain dans les hautes sphères mormones, scénario non linéaire : la chronologie (J à J+7) décrit ce qui se passe sans les PJ ; au MJ d'improviser selon les motivations des PNJ.

Histoire secrète (résumé) :
• Début du XIXe : Moroni, grade 3 de Laurent dégoûté par l'Europe post-napoléonienne, s'associe à Mormon (ange d'Yves, renégat). Ils écrivent le Livre de Mormon et le font « découvrir » à Joseph Smith (années 1820-1830), qui fonde l'Église des Saints des Derniers Jours ; polygamie pour canaliser les appétits du prophète.
• Après le lynchage de Smith, Brigham Young prend la tête de l'Église ; exode vers l'Ouest et fondation de Salt Lake City, théocratie du Deseret (1848), fortune tirée de l'or de Californie, massacre des dissidents.
• Le Paradis découvre l'affaire. 1894 : accord négocié par Sharah, Semper Fidelis et Yves ; l'Utah rejoint les USA, rattaché à la Confédération (Semper Fidelis) ; fin officielle de la polygamie ; Moroni arrêté, dégradé et mis au placard, Mormon envoyé au purgatoire.
• 1978 : révélation opportune autorisant les Noirs dans l'Église.
• Opération JR : Laurent laisse Moroni « s'évader » de sa résidence surveillée ; Semper Fidelis lui expose son plan ; Moroni s'incarne dans l'apôtre Boyd K. Packer, fait passer la succession à l'élection et tue le prophète quand l'opération commence. Plan à long terme : prendre l'Utah, puis les USA, puis le monde.

Organisation de l'Église : un président (prophète et voyant), deux vice-présidents, le Quorum des Douze Apôtres (douze régions), les Septante (évêques des pieux), un prêtre par paroisse ; tout homme est prêtre entre 12 et 19 ans et part deux ans en mission à 18 ans. Doctrine secrète : Dieu est un homme exalté, tout homme peut devenir Dieu. Les temples mormons ne sont pas des lieux sacrés au regard du Grand Jeu.

Le Quorum (12) : Moroni (Boyd K. Packer), Viatix (L. Tom Perry), David B. Haight (psy), Neal A. Maxwell, Russell M. Nelson, Dallin H. Oaks, M. Russell Ballard, Joseph B. Wirthlin, Richard G. Scott, Robert D. Hales, Jeffrey R. Holland, Henry B. Eyring. Vice-présidents : Thomas S. Monson, James E. Faust.

TRIC – modificateurs de l'épisode :
• Vade retro satanas dans la cathédrale catholique de SLC : +1
• Moroni est neutralisé : −1
• Thomas S. Monson devient prophète et dénonce l'arnaque qu'est l'Église mormone : −5
• Viatix devient prophète et commence à pervertir l'Église mormone : −3
• Ve'eem lo ach'shav se fait photographier bourré, métamorphosé en David Haight : −5
• Richard G. Scott devient prophète : +1
• Par scandale révélé sur un des apôtres : −2
• Un humain autre que Thomas S. Monson et Richard G. Scott devient prophète : −1
• Moroni devient le prophète des mormons : +10
• Par semaine où Moroni est prophète : +3
• Moroni déclenche la sécession de l'Utah : +10
• (Jacksonville) Le KKK soutient l'Utah dans sa sécession : +10
Seuils liés à l'épisode : TRIC 15, Semper Fidelis fait libérer Moroni, qui s'incarne dans un apôtre et fait changer la règle de succession ; TRIC 25, Moroni tue le prophète, la course à la succession commence et, sans les PJ, il devient prophète au bout d'une semaine (+10) ; TRIC 60, si Moroni est prophète, l'Utah fait sécession (+10), soutenu par le Klan s'il a fusionné (+10).

Index d'Accusation – preuves de l'épisode :
• Témoignage de Moroni : 2 à 6L
• Témoignage de Mormon : 2L
• Témoignage de Thomas S. Monson : 1
• Dossiers de Thomas S. Monson : 2
• Témoignage des apôtres : 0
• Témoignage de Viatix : 1
• Témoignage des marshals de la Confédération : 2L
(Valeur sans lettre : compte dans l'IA officiel seulement ; L = Laurent. Le MJ choisit dans la fourchette selon la qualité de la preuve.)

Récompenses : pas de barème de PA propre à l'épisode ; les PA dépendent de l'IA transmis à Régine.
Fiches : caractéristiques en niveaux INS/MV (Ch des humains reporté en Foi). Valeurs estimées signalées dans les notes des fiches (griffes et ongles d'acier, Défense des zombies). Les soldats de Dieu californiens de Sharah sont des alliés et ne figurent dans aucune scène de combat.`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [monson, faust, moroni, viatix, haight, maxwell, nelson, oaks, ballard, wirthlin, scott, hales, holland, eyring,
  californiens, marshals, alabama, ukshe, veeem, metatron, zombies].map(asType);
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));
writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types');
