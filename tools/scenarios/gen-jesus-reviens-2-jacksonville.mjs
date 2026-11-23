// Génère le fichier d'import « insmv-scenario » pour « The Last Rebel » (Jésus Reviens !, chapitre trois, Jacksonville, p. 32-47)
// usage : node gen-jesus-reviens-2-jacksonville.mjs <racine du projet> <fichier de sortie>
// Attention au scan : pages imprimées 32-42 = PDF 36-46, 43-46 = PDF 32-35, 47 = PDF 47.
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Jésus Reviens !, chapitre trois « The Last Rebel » (Jacksonville), p. 32-47';
const L = (s) => R.parseLvl(String(s));
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
const ARMES = new Map(R.ARMES.flatMap(([g, l]) => l.map((x) => [x[0], { prec: x[1], puis: x[2], melee: R.MELEE_GROUPS.includes(g) }])));
// arme de la table des règles : nom affiché, nom dans la table, niveau du talent
const arme = (n, table, lvl) => { const w = ARMES.get(table); if (!w) throw new Error('arme inconnue : ' + table); return { n, att: L(lvl), ...w }; };
// arme du livre : précision / puissance données par la fiche
const livre = (n, lvl, prec, puis, melee) => ({ n, att: L(lvl), prec, puis, melee });
const poing = (lvl) => arme('Coup de poing', 'Coup de poing', lvl);
const P = 'jr2-'; let n = 0; const id = (k) => P + k;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [poing(1)], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});
const MIN = 'Fiche minimale : aucune caractéristique dans le livre (valeurs par défaut).';

// ---------------- Anges de la Confédération ----------------
const semper = npc('semper', {
  nom: 'Semper Fidelis (Gary Medlocke)', source: 'Ange de Laurent, grade 3, patron de Dixie Holding et de la Confédération', type: 'ange',
  car: car('6+ 6 4 5 7+ 7'), def: L(7), pp: 48, pfFix: 11, seuilsFix: seuils('9/19/28/38'),
  armes: [livre('Sabre de cavalerie sudiste béni ancien', '9+', 7, 7, true), livre('M-16 (attaque multiple)', 9, -2, 5, false), livre('Revolver', 6, -3, 4, false)],
  pouvoirs: pows('Juste-lame 6, Armure corporelle 8, Supériorité martiale 5, Détection du mensonge 2, Immunité contre les maladies et les poisons, Anaérobiose, Caméléon 3'),
  talents: 'Combat 7 (épées 9+), Corps à corps 8, Défense 7, Tir 6 (armes d\'épaule 9), Discussion 7, Athlétisme 8, Culture générale 4 (histoire du sud des USA, mythes et légendes du KKK 7), Savoir occulte 3 (hiérarchie de Laurent depuis trois siècles, opération JR 7), Métier (businessman) 5, Savoir militaire 5 (tactique de 1860 à nos jours 9), Survie 5 (marais 8), Hobby (théorie des complots) 7',
  notes: `48 ans, 1,88 m, blond aux yeux bleus. Un des plus vieux et plus fidèles lieutenants de Laurent : près de cinq siècles sur Terre, pionnier du Nouveau Monde. Manichéen, xénophobe et intolérant : il hait les traîtres, les « mous » du Bien, les psis, les non-Blancs, les francs-maçons, puis l'Enfer. Aurait pu rejoindre la Terre Creuse si on lui avait offert un poste à sa mesure. La fin de la guerre froide l'a privé d'ennemi ; le 11 septembre l'a décidé. Francesco l'a convaincu d'agir avec lui, mais il ne lui fait qu'une confiance relative.
Look de cowboy sudiste (bottes, chapeau, six-coups à la ceinture quand la loi de Floride le permet). Bonhomie de façade avec ses alliés et ceux qu'il veut berner ; en tribune, orateur haineux et charismatique.
Arme : M-16 = pénétration importante, portée longue ; revolver = pénétration importante, portée moyenne.
Voir aussi la fiche minimale du cadre de campagne (type-jr0-semper).`,
});
const elio = npc('elio', {
  nom: 'Elio (Jack Poker)', source: 'Ange de Laurent, grade 2 (relations publiques et DRH de la Confédération)', type: 'ange',
  car: car('4 3 5 6+ 5 4'), def: L(5), pp: 24, pfFix: 10, seuilsFix: seuils('7/14/21/28'),
  armes: [livre('Épée bénie majeure', 6, 4, 6, true), livre('Revolver de cowboy', 1, -2, 4, false)],
  pouvoirs: pows('Juste-lame 3, Vitesse 2, Peur 3, Onde de choc 2, Armure corporelle 2'),
  talents: 'Baratin 6, Combat 4 (épées 6), Corps à corps 5, Défense 5, Discussion 5, Athlétisme 4, Culture générale 2 (sud des USA et Dixie Holding 4), Savoir occulte 1+ (opération JR et KKK 3), Métier (relations publiques et DRH) 5, Intimidation 4',
  notes: `52 ans, chauve aux yeux marron. Flagorneur et faire-valoir, carriériste, obéissant jusqu'à la bêtise, détesté de tous. Semper le garde pour son obéissance aveugle et comme bouc émissaire : c'est lui qui transmet les ordres impopulaires. C'est très probablement l'ange que Semper envoie aux PJ s'ils se présentent ouvertement chez Dixie.
Tir non donné : revolver estimé au niveau 1.`,
});
const www = npc('www', {
  nom: 'WWW (Patrick Chenoir)', source: 'Ange de Laurent, grade 1 (informaticien de la Confédération)', type: 'ange',
  car: car('4 3 5 5+ 1+ 4'), def: L(3), pp: 11, pfFix: 9, seuilsFix: seuils('7/14/21/28'),
  armes: [livre('Souris informatique plombée', 4, -2, -3, true)],
  pouvoirs: pows('Corps digital, Corps électrique, Champ électrique 3, Sens surdéveloppés, Membre blindé, Télékinésie 2'),
  talents: 'Combat 2 (souris informatique plombée 4), Défense 3, Discussion 2, Culture générale 2 (milieu informatique 4), Informatique 8+, Savoir occulte 0+ (KKK et opération JR 4)',
  notes: '32 ans, blond filasse. Incarné depuis quelques mois dans un informaticien, il s\'est passionné pour les nouvelles technologies qu\'il met au service de la Confédération (site du KKK fusionné, etc.). Plutôt naïf, apprécié pour sa gentillesse ; il se laisse aller (bedaine, T-shirts douteux). Peu conscient des enjeux réels.',
});
const stonewall = npc('stonewall', {
  nom: 'Stonewall Jackson (Robert J. Anderson)', source: 'Ange de Laurent, grade 2, commandant du camp d\'Okefenoke', type: 'ange',
  car: car('6 5 6+ 6 5 4'), def: L(7), pp: 27, pfFix: 12, seuilsFix: seuils('9/18/27/36'),
  armes: [livre('Canon de 1860 béni majeur', 9, 0, 15, false), livre('Sabre d\'infanterie', 8, 1, 1, true), livre('Revolver de la guerre de Sécession', 7, -3, 4, false)],
  pouvoirs: pows('Sens surdéveloppés, Juste-lame 6, Arme exaltée 4, Champ magnétique 5, Régénération 1, Voix impérieuse 2, Absorption de violence 4, Supériorité martiale 2'),
  talents: 'Combat 4 (épées 8), Défense 7, Tir 7 (armes d\'épaule 9), Athlétisme 8, Culture générale 3 (histoire du sud des USA et de la guerre de Sécession 8), Savoir occulte 2 (KKK 4), Métier (gérer un camp militaire) 6, Savoir militaire 3 (stratégie du XIXe siècle et tactique moderne 7), Survie 3 (forêt et marais 8), Obéir 9, Raconter la bataille de Gettysburg 9+. Pouvoir hors règles de l\'appli : Aura de confiance 3',
  notes: `51 ans, brun aux yeux bleus. Monomaniaque mais calme et maître de lui : il hurle sur les stagiaires sans jamais s'énerver vraiment. Surnommé d'après le général sudiste, il a survécu à toute la guerre de Sécession et garde son corps depuis : les Confédérés le vénèrent et lui font raconter Gettysburg à n'en plus finir. Curieusement peu de préjugés : en ange, il obéit et ne juge pas. Il obéit à Semper tant que Laurent ne dit pas le contraire, sans haine.
Canon : portée longue ; revolver : pénétration importante, portée moyenne.`,
});
const lehi = npc('lehi', {
  nom: 'Lehi (Michael Schaeffer)', source: 'Ange de Laurent, grade 1, conseiller en communication de Semper (taupe de Laurent)', type: 'ange',
  car: car('3 4 5 4 5+ 2'), def: L(5), pp: 9, pfFix: 7, seuilsFix: seuils('6/12/18/24'),
  armes: [livre('Fleuret', 4, 1, 1, true), livre('Pistolet à crosse de nacre', 4, -2, 2, false)],
  pouvoirs: pows('Arme exaltée 1, Charme 2, Aura de pacification 3, Lire les pensées 2'),
  talents: 'Combat 2 (épées 4), Défense 5, Discussion 6, Séduction 7, Tir 2 (armes de poing 4), Aisance sociale 6, Art 2 (arrangements floraux 5), Culture générale 2 (histoire des USA 4), Savoir occulte 0+ (KKK et opération JR 1+), Métier (relations publiques) 6, Langues : français, espagnol, Draguer en boîte homo 4, Backroom fucking 4',
  notes: `22 ans, blond aux yeux verts. Promu il y a quelques mois sur piston de Laurent : officiellement conseiller en communication, en réalité chargé par Laurent de jauger les chances de l'opération JR avant de s'y engager. Semper s'en doute et l'intoxique : réunions bidon, fausses informations exagérées que Lehi répercute à Laurent (d'où la neutralité bienveillante de l'archange).
Secret : il est homosexuel et fréquente les lieux gays de Jacksonville. Semper le sait mais préfère garder ce levier plutôt que provoquer Laurent. Levier de chantage idéal pour les PJ (voir scène 3).
Arme à feu : pénétration importante, portée moyenne.`,
});
const onidah = npc('onidah', {
  nom: 'Onidah (Nicolas Heintz)', source: 'Ange de Laurent, grade 1, chef du service juridique de la Confédération', type: 'ange',
  car: car('3 4 4 4 3 2'), def: L(3), pp: 9, pfFix: 7, seuilsFix: seuils('6/12/18/24'),
  armes: [livre('Couteau de survie', 2, 0, 0, true)],
  pouvoirs: pows('Juste-lame 1, Aura de confusion 2, Charme 2'),
  talents: 'Baratin 3, Corps à corps 2, Défense 3, Aisance sociale 3, Métier (juriste) 4, Savoir occulte 2 (KKK, opération JR et Confédération de Laurent 4), Culture générale 1 (vie dans le sud des USA 2), Intimidation 2, Langue : espagnol, Savoir criminel 1+ (trafic d\'armes et association de malfaiteurs 3)',
  notes: `32 ans, blond aux yeux verts. Bilieux, sec et austère. Défend les « patriotes » poursuivis, connaît toutes les lois fédérales et celles des États du Sud, ouvre les portes et règle les ennuis juridiques de la Confédération. Il abuse de la loi sans jamais l'enfreindre et adore coincer un Yankee. Impopulaire, sauf quand on a un problème avec la justice.
Le livre donne « Charme 1 » puis « Charme 2 » : Charme 2 retenu. Combat non donné : couteau au niveau de Corps à corps (2), estimé.`,
});

// ---------------- Renégats de la Terre Creuse (chefs de Klan) ----------------
const zacharias = npc('zacharias', {
  nom: 'Zacharias (« David Duke »)', source: 'Ange renégat de Michel, ancien grade 2 (Grand Magicien des National Knights of the KKK)', type: 'renegat_a',
  car: car('6+ 6 4 5 3 1'), def: L(8), pp: 27, pfFix: 12, seuilsFix: seuils('9/18/29/36'),
  armes: [livre('Francisque bénie majeure', 8, 4, 9, true)],
  pouvoirs: pows('Maîtrise martiale 5, Absorption de violence 3, Illusions 3, Esquive acrobatique 2'),
  talents: 'Combat 4 (haches 8), Corps à corps 7, Défense 8, Discrétion 4, Discussion 3, Athlétisme 4, Culture générale 3 (mythes et traditions du KKK 6), Acrobatie 3, Savoir occulte 1 (la Terre Creuse 4), Savoir militaire 1 (tactique 3), Intimidation 8. Pouvoir hors règles de l\'appli : Aura de confiance 2',
  notes: `62 ans, blond aux yeux verts. Un des derniers membres de la Terre Creuse, aigri d'avoir été lâché par le Paradis et par la purge récente de Daniel ; il fait profil bas. Il voit dans la fusion des Klans l'objectif que la Terre Creuse n'a jamais atteint et soutient le Klonklave, mais refuse de se faire avoir une seconde fois : il veut garder le pouvoir et négocier d'ange à ange avec Semper pour lui démontrer qu'il vaut mieux utiliser la Terre Creuse que la combattre.
Seuils du livre conservés tels quels (BF 29).`,
});
const sardis = npc('sardis', {
  nom: 'Sardis (David Findell)', source: 'Démon renégat de Baal, ancien grade 1 (Grand Enseigne de l\'Invisible Empire)', type: 'renegat_d',
  car: car('5 3 5 2 2 2'), def: L(4), pp: 12, pfFix: 7, seuilsFix: seuils('6/12/18/24'), prot: 0,
  armes: [livre('Tronçonneuse (dangereuse, inadaptée à la parade)', 6, -4, 4, true)],
  pouvoirs: pows('Art de combat 3, Jet de flammes 2, Armure corporelle 2'),
  talents: 'Combat 3 (armes improvisées 6), Défense 4, Athlétisme 4, Intimidation 6, Hobby (découper des cadavres d\'animaux à la tronçonneuse) 4, Art 0+ (sculpture d\'animaux morts 4), Culture générale 1 (KKK 2), Savoir occulte 0+ (le Grand Jeu 1), Survie 1 (forêt 3), Savoir militaire 1 (tactique 3)',
  notes: '34 ans, 1,92 m, brun aux yeux noirs. Autre rescapé de la Terre Creuse : ultraviolent et revanchard, il en veut au Paradis de ce qu\'est devenue la Terre Creuse. Fou de joie à l\'idée que le KKK renaisse par la fusion, il n\'a pas tout compris à l\'histoire et attend surtout la castagne.\nArmure corporelle : chitine.',
});

// ---------------- Humains nommés ----------------
const hackard = npc('hackard', {
  nom: 'James Hackard', source: 'Missionnaire mormon, envoyé de Boyd Packer (Moroni)', type: 'humain',
  car: car('2 1+ 3 3+ 2 3+'), def: 2, pfFix: 5, seuilsFix: seuils('3/6/9/12'), armes: [poing(1)],
  talents: 'Discussion 3, Culture générale 1 (histoire de l\'Utah 2), Savoir occulte 1 (Église des Saints des Derniers Jours 3), Métier (missionnaire SDJ) 3, Langues : espagnol, portugais, Informatique 2, Hobby (généalogie) 2',
  notes: '34 ans, 122 kg. Mormon fanatique et mystique qui agace vite tout le monde ; missionnaire par vocation, ses collègues l\'ont envoyé loin pour ne plus le supporter. Il vient au Klonklave (mercredi) annoncer que l\'Utah deviendra bientôt une théocratie, premier domino du royaume de Dieu sur Terre.\nCorps à corps non donné : niveau 1 estimé.',
});
const pearce = npc('pearce', {
  nom: 'Greg Pearce', source: 'Shérif de Jacksonville', type: 'humain',
  car: car('3 2 2 1+ 1 1+'), def: L(2), pfFix: 4, seuilsFix: seuils('4/8/12/16'),
  armes: [arme('Matraque', 'Matraque', 2), arme('Revolver de service', 'Revolver gros calibre', 2)],
  talents: 'Baratin 2, Combat 1 (contondantes 2), Défense 2, Tir 1 (armes de poing 2), Fouille 3+, Enquête 1, Culture générale 1 (KKK 2), Métier (shérif) 1, Faire chier les étrangers 2, Roter de la Bud 1, Intimidation 2',
  notes: '38 ans, 143 kg. Beauf inculte, réformé des Marines pour insuffisance mentale (il accuse un Noir de lui avoir pris sa place). Doit son poste au soutien de Dixie, à qui il obéit au doigt et à l\'œil ; rêve d\'entrer au Klan. Ne connaît rien des enjeux réels.\nArmes non précisées : matraque et revolver choisis dans la table.',
});
const gerardht = npc('gerardht', {
  nom: 'Rudolf Gerardht', source: 'Führer de l\'American White Nationalist Party (taupe de Sharah)', type: 'humain',
  notes: `${MIN}\n42 ans. Chef d'un groupuscule nazi ultra-secret et paranoïaque, spécialiste des plasticages. Coincé par les agents de l'Union de Sharah, il est devenu leur taupe : c'est lui qui renseigne Sharah sur ce qui se trame dans le Sud, et il a insisté pour venir au Klonklave. Sharah ne le dénoncera aux PJ que si l'enjeu en vaut la peine. Allié potentiel (et piège pour des PJ trop zélés).`,
});
const venable = npc('venable', {
  nom: 'James Venable', source: 'Engoulevent Impérial des United Klans of America', type: 'humain',
  notes: `${MIN}\n53 ans. Chef d'un des plus vieux Klans, très religieux, fondé par un pasteur, QG en Alabama : c'est le Klan qui plaît le plus à Semper. Grand rival des National Knights (Zacharias).`,
});
const wilkinson = npc('wilkinson', {
  nom: 'Elbert Wilkinson', source: 'Grand Magicien de l\'Invisible Empire of the KKK', type: 'humain',
  notes: `${MIN}\n31 ans. Chef du plus gros Klan, relancé par une campagne marketing jeune ; les autres l'accusent de mollesse et de compromission. Son Grand Enseigne est Sardis.`,
});
const perce = npc('perce', {
  nom: 'William Perce', source: 'Président de New Order', type: 'humain',
  notes: `${MIN}\n43 ans. Organisation ultra-violente à la limite de la légalité (attaques de banques « juives » pour se financer), détestée par les courants traditionnels ; elle a son propre camp d'entraînement en Virginie (« Pocahontas »). Invitée pour sa puissance paramilitaire.`,
});

// ---------------- Troupes ----------------
const soldats = npc('soldats', {
  nom: 'Soldats de Dieu de la Confédération', source: '250 soldats au service de Semper Fidelis', type: 'soldat', qty: 6,
  car: car('3 2+ 3 2 2 2+'), def: L(2), pp: 5, pfFix: 5, seuilsFix: seuils('4/8/12/16'),
  armes: [livre('M-16 (attaque multiple)', '3+', -2, 5, false), livre('Couteau de survie', 3, 0, 1, true)],
  pouvoirs: pows('Sens surdéveloppés, Augmentation de Perception 2'),
  talents: 'Combat 2 (couteaux 3), Corps à corps 2, Défense 2, Tir 2 (armes d\'épaule 3+), Athlétisme 2, Culture générale 0+ (KKK 2), Savoir occulte 0+ (opération JR 1), Hobby (ratonner les Nègres) 2, Survie 1 (marais 2), Métier (agent de sécurité) 3, Intimidation 3',
  notes: 'Très obéissants mais peu expérimentés malgré leur foi inébranlable ; tous blancs, racistes et convaincus. Regroupés en sections rivales (émulation, mais tendance à se tirer dans les pattes). Ils vouent une haine farouche à l\'Union de Sharah et méprisent les gardes et employés humains.\nM-16 : pénétration importante, portée longue. Quantité de la scène à ajuster (250 au total).',
});
const serviteurs = npc('serviteurs', {
  nom: 'Serviteurs de Dieu de la Confédération', source: '50 serviteurs (cadres, informaticiens, enquêteurs)', type: 'serviteur', qty: 2,
  car: car('2 2 2+ 2+ 2 3'), def: 2, pp: 6, pfFix: 4, seuilsFix: seuils('3/6/9/12'),
  armes: [livre('Pistolet discret', 2, -2, 2, false)],
  pouvoirs: pows('Volonté supra-normale 1'),
  talents: 'Discussion 2, Enquête 2, Fouille 3, Intrusion 3, Informatique 3, Métier (divers) 3, Culture générale 1 (Dixie Holding et KKK 2), Tir 1 (armes de poing 2)',
  notes: 'Ultra-professionnels et superbement organisés : spécialistes administratifs, financiers et juridiques qui font tourner la holding et la Confédération. Fiers, méprisants envers les employés, ils détestent la rivalité des soldats.\nDéfense non donnée : 2. Pistolet : pénétration importante, portée moyenne.',
});
const gardes = npc('gardes', {
  nom: 'Gardes de Dixie Securities LLC', source: '1 200 gardes (humains)', type: 'humain', qty: 6,
  car: car('3 2 3 1+ 1+ 1+'), def: L(2), pfFix: 4, seuilsFix: seuils('4/8/12/16'),
  armes: [livre('Fusil militaire semi-automatique', 2, -2, 5, false), livre('Revolver de cowboy', 3, -2, 4, false), livre('Matraque (non létale)', 2, 0, 1, true), livre('Couteau', 1, 0, 0, true)],
  talents: 'Combat 1 (contondantes 2), Corps à corps 2, Défense 2, Fouille 3, Tir 2 (armes de poing 3), Athlétisme 2, Métier (agent de sécurité) 2, Intimidation 2, Culture générale 1 (KKK 2), Savoir militaire 1, Être un gros connard impérialiste 3+',
  notes: 'Simples vigiles employés pour le gardiennage et le convoyage de fonds. Lourdement armés pour des gardiens, mais pas des soldats : ils craquent vite face à une vraie résistance.\nArmes à feu : pénétration importante (fusil portée longue, revolver portée moyenne).',
});
const employes = npc('employes', {
  nom: 'Employés des sociétés Dixie', source: '300 employés sur le site principal', type: 'humain', qty: 4,
  car: car('2 2 2 1+ 1+ 2+'), def: 2, pfFix: 3, seuilsFix: seuils('3/6/9/12'),
  armes: [livre('Revolver de cowboy', 2, -2, 4, false)],
  talents: 'Métier (divers) 2, Culture générale 0+ (vie du sud des USA 1), Être un crétin inculte et bouffi d\'orgueil 2, Savoir occulte 0+ (KKK 2), Tir 1 (armes de poing 2)',
  notes: 'Citoyens plus ou moins bornés et opportunistes qui ignorent tout des desseins de Semper ; leur fanatisme varie, Semper garde les plus fiables aux postes sensibles.\nDéfense non donnée : 2.',
});
const klanistes = npc('klanistes', {
  nom: 'Klanistes', source: 'Délégués et membres des Klans', type: 'humain', qty: 6,
  car: car('2+ 2+ 2 1 2 2+'), def: L(1), pfFix: 3, seuilsFix: seuils('3/7/10/14'),
  armes: [arme('Batte', 'Masse d\'arme ou batte', 2), arme('Fusil de chasse', 'Carabine', 2)],
  talents: 'Combat 1 (contondantes 2), Défense 1, Tir 1 (armes d\'épaule 2), Culture générale 1 (mythes et traditions du KKK 2), Faire brûler des croix en criant Sieg Heil 3, Avoir l\'air d\'un con avec un chapeau pointu 3+, Savoir occulte 1+ (les complots cosmopo-juifs 3)',
  notes: 'Quelques rares « intellectuels » au milieu d\'un troupeau d\'aigris, de ratés et de bouseux en quête de bouc émissaire.\nArmes non précisées par le livre : batte et fusil de chasse (carabine) choisis dans la table d\'après leurs talents.',
});
const alligators = npc('alligators', {
  nom: 'Gentils alligators sauvages', source: 'Faune du marais d\'Okefenoke', type: 'monstre', qty: 3,
  car: car('5 5 4 0+ 0+ 1'), def: 2, prot: 2, pfFix: 8, seuilsFix: seuils('6/12/18/24'),
  armes: [livre('Mâchoire', 3, 0, 8, true)],
  talents: 'Discrétion 4, Rester en attente dans l\'eau 4, Corps à corps 3',
  notes: 'Ils n\'attaquent que des proies affaiblies, blessées ou de petite taille, et attendent longtemps d\'être sûrs que la cible ne se défendra pas : attaques brusques venues de l\'eau boueuse, jamais d\'empoignade virile. Peau écailleuse : protection 2.\nDéfense non donnée : 2. Type « monstre » faute de type animal dans les règles.',
});

const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const TRIC = `Modificateurs de TRIC (Jacksonville) :
• Fusion des Klans : +30, plus +1 par Klan qui les rejoint
• Par société de Dixie Holding neutralisée : −1
• Dixie Securities neutralisée : −5
• Semper Fidelis neutralisé : −5
• Par Klan neutralisé ou refusant la fusion : −1
• Par ange de Semper Fidelis neutralisé : −1
• Par semaine où Semper Fidelis agit à la tête du KKK fusionné : +3
• Par semaine où Semper Fidelis agit impunément à la tête de Dixie Securities : +1
• Le KKK soutient l'Utah dans sa sécession : +10`;
const IA = `Preuves de l'Index d'Accusation obtenables à Jacksonville :
• Dossiers de la Confédération : 7L
• Dossiers de Semper Fidelis : 9L + 1D
• Témoignage de Semper Fidelis : 6L + 1D
• Témoignages des soldats ou des serviteurs de Dieu : 1L (un seul valable)
• Témoignage d'Elio : 0 à 2L
• Témoignage de WWW : 0 à 1L
• Témoignage de Lehi : −3 à +2L (selon le tri que les PJ font dans les intox qu'il a gobées)
• Témoignage d'Onidah : 0 à 2L
• Témoignage de James Hackard : 0
• Témoignage des Klans : 0 (par Klan)
• Dossiers du marais d'Okefenoke : 5L
• Témoignage de Stonewall Jackson : 0 à 2L
• Témoignage d'un Dixieman du marais (si Stonewall n'a pas témoigné) : 1L
• Preuve de la « chasse au Nègre » : 1L`;

const scenes = [
  scene('ville', '1. Sweet Home Alabama : arrivée à Jacksonville', 'Jacksonville (Floride), ville et banlieues',
    `Plusieurs pistes (Paris, Moscou…) mènent à Dixie Securities LLC, société de gardiennage et de conseil en sécurité noyautée par le KKK, basée à Jacksonville, berceau du rock sudiste au nord de la Floride, collée à la Géorgie et très sudiste d'esprit. Ville immense et vide : une banlieue étale sur des dizaines de kilomètres autour d'un petit centre. Les habitants, chauvins et méfiants, cultivent la xénophobie et le racisme (« Nègres » et Yankees). Semper Fidelis y récolte un soutien massif : sa holding fait vivre la ville et finance la campagne du shérif Greg Pearce. La radio locale National Alliance est l'un des plus gros médias racistes du pays.
Enquêter sur Dixie en ville : à peu près impossible de l'espionner, et les gens ne parlent pas aux étrangers. Les « Dixiemen » sont partout, admirés ou craints. Pistes : la population latino, noire ou asiatique, les nordistes, les bars des quartiers chicanos et noirs (les anti-Dixiemen, souvent plus nombreux qu'on ne croit, parlent sous couvert d'anonymat) ; dans les bons quartiers, autour d'une bière, certains habitants critiquent la holding pour des raisons personnelles. On peut ainsi apprendre l'organisation de Dixie, ses sociétés, les accointances politiques du shérif, l'imminence du Klonklave et la localisation du camp d'Okefenoke (son existence n'est pas un secret parmi les Dixiemen).
Le shérif Pearce harcèle les étrangers trop curieux et rapporte tout à Dixie.`,
    [inScene(pearce)], false,
    [choice('approche', 'Comment les PJ comptent-ils obtenir les dossiers de Semper Fidelis ?', [
      ['Se présenter ouvertement en anges', 'Scène 2 : Semper les reçoit selon leur couverture (Elio, fausse piste mormone, embuscade possible).'],
      ['Infiltrer les Klans du Klonklave', 'Scène 5 : l\'option la plus sûre ; ouvre aussi l\'accès au camp (scène 6).'],
      ['Casse à la Tanière', 'Scène 7 : très difficile, laisser leur une chance façon Mission impossible.'],
      ['Faire chanter Lehi', 'Scène 3 : badges et codes, mais beaucoup d\'intox.'],
    ])]),
  scene('campus', '2. Le campus Dixie et la réception de Semper', 'Site de Dixie Holding, zone marécageuse à l\'écart du centre',
    `Le site regroupe une dizaine de bâtiments bas sur une île au milieu des marais infestés d'alligators ; une seule route y mène. Semper, paranoïaque, travaille illégalement avec la bénédiction tacite de son archange : sécurité maximale (soldats de Dieu, gardes armés, chiens, alligators, employés de bureau armés). Pas de plan : les bâtiments, dans l'ordre d'arrivée :
• Guérite blindée avec chenil : cinq gardes sous l'œil d'un soldat de Dieu, reliée au QG de sécurité ; écrans de toutes les caméras du site, contrôlables depuis la console centrale.
• Bâtiment d'accueil (parking visiteurs) : standard, hôtesses, une vingtaine de gardes. Tout visiteur non attendu est escorté du parking jusqu'à son départ.
• Radio National Alliance et son local technique (le bâtiment le plus peuplé, près de deux cents employés, une dizaine de gardes) : centre d'écoute, la radio pirate les fréquences de la police.
• Le « bazar » : long couloir de béton qui abrite une dizaine de petites sociétés extrémistes (éditions, sites, objets nazis), souvent attaquées en justice.
• Studios National Alliance Production : « documentaires » et fictions sur la race blanche ; marotte de Semper, qui rêve d'un remake de Naissance d'une nation ; une dizaine de gardes.
• Hangar de Dixie Import Export : le plus gros chiffre d'affaires ; blanchiment, armes, documents, fugitifs ; une trentaine de gardes et une dizaine de soldats de Dieu au déchargement.
• Services généraux, centre de conférences et cafétéria cajun (auditorium du Klonklave, une demi-douzaine de gardes), garage (détecteurs de radars).
• La Tanière : cinq étages, siège de Dixie Holding et de Dixie Securities et QG de la Confédération (voir scène 7).

Réaction de Semper si les PJ le rencontrent :
• Anges en mission : il les soigne aux petits oignons sans éveiller leurs soupçons sur l'ampleur de ses crimes, puis les appâte avec une fausse piste vers les mormons (qu'il juge sacrifiables). En dernier recours, il les entraîne dans un coin discret (les entrepôts) et les jette dans une embuscade (scène 4).
• Anges intégristes voulant participer à l'opération JR (couverture crédible) : il est beaucoup plus bavard, s'emballe sur ses projets sans tout révéler. Il ne résiste pas à se vanter de l'attentat contre la statue de la Liberté par les Pink Queens (il y compte pour le Klonklave, et l'ironie de frapper le territoire de Sharah le ravit), évoque le retour de Moroni et montre un ciboire dédicacé par Moroni.
• Dans tous les autres cas, il ne les reçoit pas et leur envoie Elio.`,
    [inScene(semper), inScene(elio), inScene(onidah), inScene(lehi), inScene(gardes, { qty: 6 }), inScene(employes, { qty: 4 })], false,
    [choice('accueil', 'Sous quelle couverture les PJ rencontrent-ils Semper ?', [
      ['Anges en mission officielle', 'Fausse piste mormone (Salt Lake City) ; embuscade aux entrepôts s\'ils insistent (scène 4).'],
      ['Anges intégristes candidats à l\'opération JR', 'Semper parle de Big Queen (New York) et de Moroni : Témoignage de Semper possible plus tard (6L + 1D).'],
      ['Aucune, ils sont éconduits', 'Elio les reçoit et les surveille.'],
    ])]),
  scene('lehi', '3. Le maillon faible : Michael Schaeffer', 'Bars gays de Jacksonville, parking désert au bord d\'une route',
    `Lehi (Michael Schaeffer), conseiller de Semper, est le lieutenant le plus vulnérable : en creusant, les PJ apprennent qu'il fréquente les rares lieux homosexuels de la ville et un parking isolé où il drague. Un endroit bien connu des homos : le coincer sur le fait est facile. Il est prêt à beaucoup pour que son secret reste caché, car il se croit en danger de mort (Klan) et redoute aussi le Paradis.
Ce qu'il sait : une description très claire et précise… mais presque entièrement fausse de l'opération JR, l'intox que Semper lui sert pour Laurent (révolte mondiale avec l'appui du Pentagone, de l'OTAN, de l'armée française…). Le MJ peut en rajouter. Les seuls éléments vrais : Laurent a fait libérer Moroni, Francesco est l'autre cerveau de l'opération, un grade 3 de Dominique planqué en Espagne.
Ce qu'il peut faire : donner accès au cœur de la holding (mots de passe, badges, clés), mais pas au coffre des archives. Les PJ peuvent profiter de sa visite pour entrer, à condition de rester discrets.
Témoignage de Lehi : de −3 à +2L selon le tri que les PJ font dans ses intox.`,
    [inScene(lehi)], false,
    [choice('chantage', 'Que font les PJ de Lehi ?', [
      ['Chantage discret', 'Badges, codes et accès à la Tanière (pas au coffre) ; son témoignage reste truffé d\'intox.'],
      ['Ils le retournent en lui montrant l\'intox de Semper', 'Lehi peut prévenir Laurent : témoignage mieux trié (jusqu\'à +2L).'],
      ['Ils le dénoncent ou le neutralisent', 'TRIC −1 (ange de Semper neutralisé) ; Semper perd son levier sur Laurent.'],
    ])]),
  scene('embuscade', '4. Embuscade aux entrepôts', 'Hangar de Dixie Import Export, entrepôts du site',
    `Si des anges « officiels » deviennent trop curieux, Semper les attire vers les entrepôts (visite, rendez-vous discret) et les fait tomber dans une embuscade démesurée : Elio en tête, sections de soldats de Dieu, gardes de Dixie. Ils ont peu de chances d'en sortir indemnes : leur laisser une issue (marais, camions, diversion).
Les témoins humains de l'embuscade ne savent rien. Un soldat ou serviteur capturé vivant peut témoigner (1L, un seul valable). Chaque ange de Semper neutralisé : TRIC −1.`,
    [inScene(elio), inScene(soldats, { qty: 6 }), inScene(gardes, { qty: 8 })], true,
    [choice('issue', 'Comment se termine l\'embuscade ?', [
      ['Les PJ s\'échappent', 'Semper sait qu\'ils sont hostiles : sécurité renforcée, chasse aux anges au camp si on les y repère.'],
      ['Les PJ capturent un soldat ou Elio', 'Témoignage d\'un soldat (1L) ou d\'Elio (0 à 2L).'],
      ['Les PJ sont capturés', 'Interrogatoire à la Tanière ; Semper hésite à tuer des anges, mais Stonewall obéira.'],
    ])]),
  scene('klonklave', '5. Le Klonklave : infiltrer les Klans', 'Centre de conférences de Dixie, hôtels et motels de Jacksonville',
    `Le moyen le plus simple : attaquer le maillon faible, les Klans en pleine négociation au Klonklave. Semper veut fédérer toutes les branches du KKK et retrouver le « Klan originel » (avec lui comme Magicien Impérial). Il a invité une dizaine de Klans et rallié quelques groupes nazis ; nombre de délégués limité par Klan, logés en ville dans des hôtels séparés par groupe (pour éviter les heurts) : c'est là qu'il faut frapper. Les Klansmen, moins disciplinés que les Dixiemen et ne connaissant pas les autres Klans, se laissent remplacer facilement. Invitations non nominatives ; certains Klans qui avaient refusé viennent quand même sans prévenir. Remplacer tout un groupe est plus simple que remplacer un seul membre (les autres le connaissent) : un kidnapping est le plus subtil. Ensuite, il faut se mettre au diapason des us, coutumes, rites et costumes (voir les notes du scénario) sans en faire trop.
Klans présents (chef, âge) : United Klans of America (James Venable, 53), National Knights of the KKK (Zacharias alias « David Duke », 62, rival des UKA, veut protéger le camp d'Okefenoke), Invisible Empire (Elbert Wilkinson, 31 ; Grand Enseigne : Sardis), Confederation of Independent Orders (amicale d'une vingtaine de petits Klans : Texas, Mystic, White Camelia Knights…), National-Socialist Alliance (le plus vieux groupe nazi), New Order (William Perce, ultra-violent, camp en Virginie), American White Nationalist Party (Rudolf Gerardht, taupe de Sharah).

Programme (volontairement flou, Semper improvise) :
• Lundi : accueil, présentation de Dixie Holding, visite, déjeuner, présentation du projet « Klan originel » à l'auditorium.
• Mardi : entretiens Klan par Klan dans le bureau de Semper.
• Mercredi : débat sur la restauration de la suprématie blanche ; James Hackard, envoyé de Moroni, annonce que l'Utah va devenir une théocratie et sera le premier domino. Discours enflammé, accueilli entre rires et sarcasmes.
• Jeudi et vendredi : excursion au camp d'Okefenoke (scène 6).
• Samedi : grande assemblée de fusion (scène 8).
But : le Klonklave n'est PAS l'objet du scénario, c'est une porte d'entrée : écouter Semper (Big Queen, fusion, théocratie aux USA, allusions à l'opération JR), interroger ses lieutenants (retour de Moroni, sympathisants en Europe et en Russie, Pink Queens entraînées en France…), et entrer au camp. Les Confédérés pérorent volontiers devant leurs invités.`,
    [inScene(semper), inScene(elio), inScene(lehi), inScene(onidah), inScene(www), inScene(zacharias), inScene(sardis), inScene(hackard), inScene(gerardht), inScene(venable), inScene(wilkinson), inScene(perce), inScene(klanistes, { qty: 6 })], false,
    [choice('infiltration', 'Comment les PJ s\'introduisent-ils au Klonklave ?', [
      ['Ils remplacent tout un Klan', 'Le plus sûr ; un Klan neutralisé ou retiré de la fusion : TRIC −1.'],
      ['Ils remplacent un seul délégué', 'Ses camarades le connaissent : jets de baratin fréquents.'],
      ['Ils démasquent Gerardht', 'Sharah est furieux qu\'on grille sa taupe, à moins que les PJ ne passent par lui.'],
    ]),
    choice('zacharias', 'Les PJ découvrent-ils les renégats de la Terre Creuse (Zacharias, Sardis) ?', [
      ['Oui, et ils négocient', 'Zacharias peut être retourné contre Semper pour garder son Klan.'],
      ['Oui, et ils les combattent', 'Bagarre chez les Klans : l\'infiltration risque d\'être grillée.'],
      ['Non', 'Zacharias marchande avec Semper d\'ange à ange.'],
    ])]),
  scene('okefenoke', '6. Vodoo Lake : le camp d\'Okefenoke', 'Camp d\'entraînement dans le marais d\'Okefenoke (frontière Floride-Géorgie)',
    `Utilisé par les « amis » de Semper et par des anges réactionnaires, le camp est une vraie base militaire cachée au cœur du marais, sans autre accès que le bateau ; personne n'y est entré sans l'accord des occupants. Il est dirigé par Stonewall Jackson, qui mène à la baguette une petite centaine de soldats de Dieu, entraîne tous les stagiaires et n'hésite pas à jeter un lâche aux alligators. Un seul bâtiment en dur (en bois) ; le reste sous tente, sur les îles. Le parc naturel autour (des centaines de km²) est ouvert aux touristes en bateau ; les alligators y pullulent.
Les archives : un coffre-fort de western au cœur du bâtiment révèle les noms, dates et état civil de presque tous les fascistes et racistes des USA et d'une bonne partie des groupes étrangers (Nova Russkia, légion Azul, « Mickey » japonais) : Dossiers du marais d'Okefenoke (5L). Y accéder est quasi impossible, sauf comme groupe raciste en visite (Klonklave) ou en stage d'entraînement : il faut alors subir au moins un stage (de l'eau jusqu'au cou, insultes, humiliations).
Pendant le Klonklave (jeudi-vendredi), Stonewall est là pour ses invités : illuminations, croix enflammées, saluts hitlériens, chansons, feux de camp. La nuit de jeudi à vendredi, après une cérémonie « Cross Lightning », a lieu la « chasse au Nègre » : cinq pauvres Afro-Américains raflés en Géorgie sont lâchés dans le marais avec un collier radio ; chaque Klan les traque (10 points par Noir ramené vivant, 5 mort). Les survivants sont crucifiés au matin. Preuve de la chasse : 1L. Si les PJ se sont fait repérer, ce sera une chasse aux anges ennemis, pour la plus grande joie de Semper et de ses soldats.
Témoignage de Stonewall : 0 à 2L (s'il ne parle pas, un Dixieman du marais : 1L).`,
    [inScene(stonewall), inScene(soldats, { qty: 8 }), inScene(alligators, { qty: 3 }), inScene(sardis), inScene(klanistes, { qty: 6 })], true,
    [choice('chasse', 'Que font les PJ pendant la « chasse au Nègre » ?', [
      ['Ils sauvent les victimes', 'Couverture probablement grillée : chasse aux anges ; preuve de la chasse (1L) si un rescapé témoigne.'],
      ['Ils documentent sans intervenir', 'Preuve de la chasse (1L), mais cinq morts sur la conscience (et sur le rapport à Régine).'],
      ['Ils profitent de la diversion pour le coffre', 'Dossiers du marais d\'Okefenoke (5L).'],
    ]),
    choice('stonewall', 'Que devient Stonewall Jackson ?', [
      ['Il témoigne', 'Il obéit tant que Laurent ne dit pas le contraire : un ordre convaincant venu d\'en haut le fait parler (0 à 2L).'],
      ['Il est neutralisé', 'TRIC −1.'],
      ['Il reste en place', 'Le camp continue à former les soldats de Dieu de l\'opération JR.'],
    ])]),
  scene('taniere', '7. La Tanière : le casse des archives', 'La Tanière, siège de Dixie Holding (cinq étages)',
    `Bâtiment le plus haut du site, vu d'en haut en forme de peigne à six dents. Officiellement siège social de Dixie Holding et de Dixie Securities, en réalité QG de la Confédération. Les trois premiers étages abritent les bureaux officiels ; les deux derniers sont réservés aux « aware » munis d'un badge, et on ne peut y monter qu'en passant devant le QG de sécurité, au quatrième. Ce QG centralise la domotique, les alarmes et les communications. L'étage des archives est encore plus fermé : deux portes entièrement blindées mènent à ses sept salles, qui pourraient servir de banque.
Les archives de la Confédération (les plus accessibles) et la salle d'archives où Semper garde tous ses dossiers depuis son arrivée dans le Nouveau Monde se trouvent dans un énorme coffre-fort ; seule une formule angélique prononcée par Semper (ou d'un certain ton) l'ouvre. Si les PJ y pénètrent, ils ont gagné la campagne… ou presque : dommage que ce soit à peu près impossible.
Dossiers de la Confédération : 7L. Dossiers de Semper Fidelis : 9L + 1D. WWW (informatique, domotique) peut être un point faible, ou un adversaire redoutable sur le réseau.
Lehi peut donner badges et codes (scène 3). En cas d'alerte : gardes, soldats de Dieu, Semper en personne.`,
    [inScene(semper), inScene(www), inScene(gardes, { qty: 8 }), inScene(soldats, { qty: 6 }), inScene(serviteurs, { qty: 2 })], true,
    [choice('coffre', 'Le casse réussit-il ?', [
      ['Coffre ouvert', 'Dossiers de la Confédération (7L) et de Semper Fidelis (9L + 1D) ; noms et projets de Francesco.'],
      ['Seulement les archives de la Confédération', 'Dossiers de la Confédération (7L).'],
      ['Échec et fuite', 'Semper verrouille tout ; il accélère la fusion des Klans.'],
    ]),
    choice('semper', 'Semper Fidelis est-il neutralisé ?', [
      ['Oui', 'TRIC −5 ; s\'il est capturé et convaincu, Témoignage de Semper (6L + 1D).'],
      ['Non', 'TRIC +1 par semaine où il agit impunément à la tête de Dixie Securities.'],
    ])]),
  scene('samedi', '8. Samedi : l\'assemblée de fusion', 'Auditorium du centre de conférences de Dixie',
    `Le Klonklave commence une semaine avant l'opération Big Queen (New York), prévue le sixième jour (un samedi) à 10 h. Si les PJ n'ont rien fait, la statue de la Liberté explose (+10 TRIC) et l'émotion permet la fusion des Klans (+30, +1 par Klan fusionné) : Semper devient le chef du KKK unifié. Il espère que l'attentat sera retransmis en direct pendant l'assemblée.
Selon la TRIC et les actions des PJ (Klans neutralisés, renégats retournés, Semper discrédité, Big Queen déjouée), la fusion échoue, ne réunit qu'une partie des Klans ou triomphe.
Suites possibles : le Klan fusionné soutient la sécession de l'Utah si Moroni devient prophète (+10, voir Salt Lake City) ; chaque semaine où Semper dirige le KKK fusionné : +3.`,
    [inScene(semper), inScene(elio), inScene(zacharias), inScene(sardis), inScene(klanistes, { qty: 6 }), inScene(gardes, { qty: 6 })], false,
    [choice('fusion', 'La fusion des Klans a-t-elle lieu ?', [
      ['Oui, complète', 'TRIC +30, +1 par Klan ; +3 par semaine où Semper dirige le KKK fusionné.'],
      ['Partielle', 'TRIC +30, +1 par Klan rallié et −1 par Klan qui refuse.'],
      ['Non', 'Pas de +30 ; −1 par Klan neutralisé ou refusant la fusion.'],
    ])]),
  scene('bilan', '9. Bilan : TRIC et Index d\'Accusation', 'Rapport à Régine',
    `${TRIC}

${IA}

Pistes vers les autres villes : New York (opération Big Queen, Pink Queens, Sharah), Salt Lake City (Moroni, Hackard), Moscou (soldats de Dieu de Mémoire passés par Dixie), Tokyo (soldats de Dieu formés chez Dixie), Madrid (Francesco, légion Azul).`, [], false),
];

const scenario = {
  id: 'jesus-reviens-2-jacksonville',
  nom: 'Jésus Reviens ! – 2. Jacksonville',
  resume: 'Épisode de la campagne « Jésus Reviens ! » pour anges de grade 1 ou 2, envoyés par Ange et Alain (via Régine) pour monter le dossier de l\'opération JR. À Jacksonville (Floride), Semper Fidelis, grade 3 de Laurent, dirige Dixie Holding et sa Confédération de soldats de Dieu, et réunit le Klonklave pour fusionner les Klans le jour de l\'attentat contre la statue de la Liberté. Les PJ doivent infiltrer les Klans, le campus Dixie ou le camp d\'Okefenoke pour obtenir ses dossiers, et empêcher la fusion.',
  notes: `Source : ${REF} ; modificateurs de TRIC et preuves : chapitre un, p. 9-12. Fichier cadre de la campagne : jesus-reviens-0-cadre (commanditaires Ange et Alain avec Yves, prévenus par Michel ; Georges est l'un des trois archanges visés par l'IA, pas un commanditaire).
Lecture du scan : pages imprimées 32-42 = PDF 36-46, 43-46 = PDF 32-35, 47 = PDF 47.

Contexte : Semper Fidelis (Gary Medlocke) dirige Dixie Holding (Dixie Securities LLC, Dixie Import Export, radio et productions National Alliance…) et, en secret, la Confédération : 250 soldats de Dieu, 50 serviteurs, plus 1 200 gardes et 300 employés humains. Le camp d'Okefenoke forme les soldats de Dieu des alliés de l'opération JR dans le monde. Il prépare la fusion des Klans (le Klonklave) et la sécession du Sud, en lien avec Moroni (Utah) et l'opération Big Queen (New York). Francesco l'a convaincu de lancer l'opération ; Laurent attend de voir (Lehi est sa taupe, intoxiquée par Semper). Sharah (New York), rival de Semper, a une taupe au Klonklave (Rudolf Gerardht).
Conseil : Dixie est quasi impénétrable par la force. L'infiltration des Klans est la voie la plus sûre ; le casse de la Tanière façon Mission impossible est possible mais doit rester exceptionnel.

${TRIC}

${IA}

Seuils de TRIC qui concernent Jacksonville (événements du cadre) :
• 10 : début du Klonklave, une semaine avant Big Queen ; le samedi, si les PJ n'ont rien fait, la statue explose (+10) et les Klans fusionnent (+30, +1 par Klan).
• 15 : Laurent signale Moroni à Semper, qui le fait libérer.
• 50 : le Klan devient une machine de lobbying (élus, juges, shérifs).
• 60 : si Moroni fait faire sécession à l'Utah et que les Klans ont fusionné, le Klan l'appuie (+10).
• 65 : le Klan soutient ouvertement la ségrégation.
• 80 : le Sud menace de faire sécession ; le Klan dépose un projet de partition raciale des USA.
• 100 : les USA aux mains de la droite chrétienne, ségrégation de fait.

Le KKK (lore du chapitre, résumé) :
• Histoire : né après la guerre de Sécession, anéanti par le gouvernement fédéral, ressuscité en 1915 grâce au film Naissance d'une nation, puis émietté en dizaines de petits Klans rivaux et infiltrés par le FBI. Trois courants aujourd'hui : klanistes historiques, nazis, Identité chrétienne. Semper n'a invité que les Klans et quelques nazis.
• Hiérarchie : Empire Invisible dirigé par le Grand Magicien (Magicien Impérial), royaumes (Grand Dragon), dominions (Grand Titan), provinces (Grand Géant), Tanières (Grand Cyclope) ; titres grotesques (Grand Turc, Grand Scribe, Klavalier, Klexter, Klarogo…). Lexique : Alien (non-membre), Klonvokation (congrès), Klavern (Tanière), Kloran (livre sacré), KBI (police interne), Wrecking Krew (groupe de choc).
• Costumes : robe et cagoule pointue blanches (couleurs pour les officiers, noir pour les Wrecking Krews) ; les groupes paramilitaires préfèrent le treillis.
• Signes de reconnaissance : « AYAK ? » (Are You A Klansman ?) – « AKIA ! » (A Klansman I Am !) ; « SANBOG ! » (Strangers Are Near, Be On Guard !).

PA : le chapitre ne donne pas de barème ; les PA dépendent de l'IA (voir le cadre et l'épilogue).
Fiches : seuils, PF et armes du livre (« précision/puissance ») ; valeurs estimées signalées dans les notes. « Aura de confiance » (Stonewall, Zacharias) n'existe pas dans les règles de l'appli : laissée dans les talents. Troupes génériques : aucune n'existait dans le bestiaire ni dans les PNJ rapides (les fiches du livre sont reprises telles quelles).`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [semper, elio, www, stonewall, lehi, onidah, zacharias, sardis, hackard, pearce, gerardht, venable, wilkinson, perce,
  soldats, serviteurs, gardes, employes, klanistes, alligators].map(asType);
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));
writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types,', scenes.reduce((a, s) => a + s.choix.length, 0), 'choix');
