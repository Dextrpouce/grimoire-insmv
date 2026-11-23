// Génère le fichier d'import « insmv-scenario » pour « Le démon est un animal politique » (Fire and Ice, p. 113-124)
// usage : node gen-demon-animal-politique.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Fire and Ice, « Le démon est un animal politique », p. 113-124';
const L = (s) => R.parseLvl(String(s)); // « 2+ » → 5
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
let n = 0; const id = (p) => `fi7-${p}`;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [{ n: 'Coup de poing', att: 2, prec: 0, puis: -3, melee: true }], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});
const poing = (lvl) => ({ n: 'Coup de poing', att: L(lvl), prec: 0, puis: -3, melee: true });

// ---------------- PNJ : acte 1 (Auxerre) ----------------
const fabien = npc('fabien', {
  nom: 'Monsieur Fabien', source: 'Responsable du Centre de Tri (stats non fournies)', type: 'demon',
  notes: 'Commanditaire. Gilbert lui a montré une lettre de 1566 de Nostradamus retrouvée parmi les lettres perdues ; il réserve train et auberge à Auxerre et envoie les PJ récupérer la page de prophéties.\nActe 2 : « retenu » dans son bureau par les émissaires ; calme le jeu, récupère les prophéties et accorde aux PJ un pouvoir au choix (8 PA maximum).',
});
const roffay = npc('roffay', {
  nom: 'Jean-Louis Roffay', source: 'Généalogiste local (stats non fournies)', car: car('1 1 2 2 2 2'),
  talents: 'Généalogie / recherche en archives (estimé 4)',
  notes: 'Soixantaine bedonnante, très myope. Accepte de chercher la cousine de Nostradamus mais prévient que ce sera long ; oriente les PJ vers le père Rouquin. Plus tard, retrouve en quelques heures la trace des familles des ouvriers de la Tour (→ Valet). Fiche minimale estimée.',
});
const rouquin = npc('rouquin', {
  nom: 'Le père Rouquin', source: 'Vieillard d\'Auxerre, 92 ans (stats non fournies)', car: car('1 1 1 2 1 2'),
  armes: [{ n: 'Canne en bois', att: 2, prec: 1, puis: 0, melee: true }],
  notes: 'Minuscule, deux dents, trois cheveux sous une casquette, canne brandie contre les gamins ; accent et élocution impossibles. Passe ses journées au bar. Il faut gagner sa confiance à coups de rouge (le brutaliser ou user de pouvoirs le tuerait vite).\nSait par tradition familiale que Nostradamus montait souvent dans la Tour de l\'Horloge pour y faire des « maléfices » ; savait aussi que la tour a brûlé, mais ne le dit que si on le lui demande. Fiche minimale estimée.',
});
const thierry = npc('thierry', {
  nom: 'Thierry Valet', source: 'Héritier de la famille Valet (stats non fournies)', car: car('2 2 2 2 2 2'),
  notes: 'Vingtaine, grand, maigre, blond, méprisant ; vêtements chers et ridicules, fume-cigarette. Parvenu inculte, orphelin depuis l\'accident de voiture de ses parents. Descendant de Louis Valet, l\'ouvrier qui a trouvé les papiers de Nostradamus lors de la restauration de la Tour (1891) et a fait fortune (élevage de poulets fermiers).\nReçoit sur le pas de la porte et ne parle que s\'il y a de l\'argent à gagner ; un bon baratin (agents immobiliers…) permet de visiter, sinon cambriolage. Fiche minimale estimée.',
});
const espion = npc('espion', {
  nom: 'Serviteur de Rectius', source: 'Serviteur de Dieu qui file les PJ', type: 'serviteur',
  car: car('2 3 3 2+ 2 2+'), def: 2, pp: 6, pfFix: 4, seuilsFix: seuils('3/6/9/12'), talents: 'Discrétion 2, Enquête 2, Fouille 2',
  notes: 'Envoyé par Rectius dès que les PJ ont fait des recherches suspectes à la bibliothèque. S\'il est repéré, il prévient son patron et tente de fuir.\nLe livre ne donne pas ses caractéristiques : serviteur de Dieu typique (Livre de base, Règles, p. 88).',
});
const rectius = npc('rectius', {
  nom: 'Rectius', source: 'Ange de Dominique, grade 2', type: 'ange', car: car('3 4 3 6 3 4'), def: L(5),
  pp: 21, pfFix: 9, seuilsFix: seuils('6/12/18/24'),
  armes: [{ n: 'Épée longue bénie mineure', att: L(5), prec: 2, puis: 4, melee: true }],
  pouvoirs: pows('Jugement 2, Peur 2, Volonté supra-normale 2, Lire les pensées 1, Régénération 2'),
  talents: 'Combat 5, Défense 5. Avantage matériel : deux sections lourdes (soldats de Dieu).',
  notes: 'Geek de seize ans au teint gras qui vit chez sa mère, pas encore mué, baskets jaune fluo, tee-shirt de Polytechnique. Membre de la cyberpolice du Réticulum : a piégé les ordinateurs de la bibliothèque d\'Auxerre pour être prévenu des recherches louches.\nTend un piège : se fait passer pour la bibliothèque au téléphone ou à l\'auberge, donne rendez-vous après la fermeture et tente d\'éliminer les PJ avec ses deux sections lourdes.\nAvertissement sans frais : monomaniaque.',
});
const sections = npc('sections', {
  nom: 'Sections lourdes de Rectius (Sécu Auxerre)', source: 'Soldats de Dieu, agents de sécurité', type: 'soldat', qty: 6,
  car: car('3 2+ 2 2+ 1+ 3'), def: L('2+'), pp: 8, pfFix: 5, seuilsFix: seuils('4/8/12/16'),
  armes: [{ n: 'Pistolet-mitrailleur', att: L(3), prec: -2, puis: 4, melee: false }, { n: 'Grenade', att: L(3), prec: -4, puis: 4, melee: false }],
  talents: 'Athlétisme 3, Combat 2, Conduite 2+, Corps à corps 2, Intimidation 2, Savoir militaire 2 (tactique 2+), Tir 2',
  notes: 'Deux sections entièrement dévouées à Rectius, employées par la société de sécurité Sécu Auxerre.\nLe livre renvoie à l\'écran d\'INS/MV4 : caractéristiques reprises du soldat de Dieu typique (Livre de base, Règles, p. 88) ; effectif estimé (ajuster le nombre).',
});
const yatagan = npc('yatagan', {
  nom: 'Yatagan', source: 'Ange de Laurent, grade 2 (lié au papier de Nostradamus)', type: 'ange', car: car('6 0+ 5 6 0+ 4'), def: 2,
  pp: 20, pfFix: 12,
  armes: [{ n: 'Objets et outils projetés (Télékinésie)', att: L(4), prec: -1, puis: 2, melee: false }],
  pouvoirs: pows('Télékinésie 4, Paralysie 3, Peur 2, Lire les pensées 3, Non-détection 2, Armure corporelle 3, Champ de force 3, Immunité contre le feu, Jeûne'),
  talents: 'Attendre qu\'on veuille bien le libérer 6',
  notes: 'Ange invoqué et lié par Nostradamus à sa dernière page de prophéties pour la protéger ; coincé là depuis quatre siècles, il ne veut qu\'une chose : qu\'on brûle le papier pour rentrer au Paradis. Se défend sans quartier.\nCombat dans la cave des Valet : tronçonneuses, tournevis et outils animés attaquent les PJ ; à l\'engagement, des livres se couvrent d\'une armure. Chaque PF de Yatagan est un livre à détruire (faciles à repérer).\nSi on le tue, le papier brûle et la prophétie est perdue : il faut le faire tomber pile à 0 PF ou l\'épuiser de ses PP.\nSeuils de blessure : aucun dans le livre (BL –/BG –/BF –/MS –) : ne compter que les PF. Défense et attaque (Télékinésie) estimées.\nAvertissement sans frais : abstinence.',
});

// ---------------- PNJ : acte 2 (guerre civile) ----------------
const oussaicho = npc('oussaicho', {
  nom: 'Oussaichô', source: 'Démon de Belial, grade 1 (« garde du corps »)', type: 'demon', car: car('4 3 4 3 1 3'), def: L(3),
  pp: 13, pfFix: 7, seuilsFix: seuils('6/12/18/24'),
  armes: [{ n: 'Revolver gros calibre', att: L(5), prec: -2, puis: 4, melee: false }],
  pouvoirs: pows('Jet de flammes 4, Incendie 2, Armure corporelle 1, Immunité contre le feu, Paralysie 3'),
  talents: 'Tir 2 (armes de poing 5), Défense 3',
  notes: 'Belial typique qui se prend pour un mafieux à la De Niro : sale tête, costume rayé à épaulettes. Intelligent, joue la sympathie et monte les PJ contre son rival de Crocell.\nArme non précisée dans le livre : revolver gros calibre estimé.\nAvertissement sans frais : phobie des enfants.',
});
const aglagla = npc('aglagla', {
  nom: 'Aglâglâ', source: 'Démon de Crocell, grade 1 (« garde du corps »)', type: 'demon', car: car('3 5 2 4 2 3'), def: L(6),
  pp: 14, pfFix: 7, seuilsFix: seuils('5/10/15/20'), armes: [poing(3)],
  pouvoirs: pows('Éclats de glace 2, Froid polaire 2, Vitesse 4, Détection du danger 1, Corps liquide'),
  talents: 'Défense 6, Baratin 2, Combat 3',
  notes: 'Jeune rappeur blanc d\'opérette (baggy, chaînes en or, gros bonnet qui cache ses cornes sur un crâne rasé). Aimable mais très impulsif ; méfiant envers les PJ qu\'il tient pour responsables des ennuis de son prince.\nAvertissement sans frais : cornes.',
});
const julie = npc('julie', {
  nom: 'Julie Delahaye', source: 'Démone de Belial, grade 2 (infiltrée chez Crocell)', type: 'demon', car: car('3 2 3 4 4 4'), def: L(3),
  pp: 23, pfFix: 7, seuilsFix: seuils('5/10/15/20'),
  pouvoirs: pows('Immunité contre le feu, Jet de flammes 4, Incendie 3, Éclats de glace 3, Invisibilité 2, Non-détection 2, Protection de l\'âme, Régénération 2, Volonté supra-normale 3, Téléportation 2'),
  talents: 'Baratin 5, Séduction 5, Défense 3, James Bond girl 5',
  notes: 'Caractéristiques du scénario précédent (Fire and Ice, p. 111), avec Jet de flammes passé au niveau 4.\nAmenée par la Garde carmine devant la commission : joue l\'innocente, nie connaître les PJ, puis avoue après la vidéo — en se présentant comme démone de Crocell.\nAvertissement sans frais : tueur psychopathe.',
});
const marieJolie = npc('marie-jolie', {
  nom: 'Marie-Jolie', source: 'Démone de Baal, grade 3 (commission d\'enquête)', type: 'demon', car: car('2 4 4 4 3 5'), def: L(6),
  pp: 30, pfFix: 6, seuilsFix: seuils('4/8/12/16'),
  armes: [{ n: 'Hache de bataille maudite mineure', att: L(6), prec: 2, puis: 5, melee: true },
    { n: 'Revolver gros calibre maudit indépendant mineur', att: L('4+'), prec: 0, puis: 6, melee: false }],
  pouvoirs: pows('Art de combat 3, Protection de l\'âme, Armure corporelle 3, Absorption d\'énergie sexuelle 2, Télépathie 1, Jet de flammes 3, Détection du danger 1, Détection du bien 1, Téléportation 2'),
  talents: 'Comédie 5, Baratin 5, Séduction 4, Hobby (archéologie) 2, Défense 6, Combat 6',
  notes: 'Succube grande, brune, belle, perverse et très intelligente ; ex-servante d\'Andromalius passée chez Baal. Deux corbeaux familiers (absents de cette partie).\nObjectif : démêler le conflit tout en préservant la stabilité de l\'Enfer (pour Baal, ce n\'est pas le moment de se diviser) ; la plus encline à croire que Belial a infiltré les rangs de son frère.\nHache : inadaptée à la parade. Revolver indépendant : il tire seul au niveau 4+ (pénétration importante, portée moyenne).\nAvertissement sans frais : besoin d\'acte sexuel.',
});
const salomon = npc('salomon', {
  nom: 'Salomon', source: 'Démon d\'Andromalius, grade 3 (président de fait de la commission)', type: 'demon', car: car('1 2 5 5 3 5'),
  pp: 28, pfFix: 6, seuilsFix: seuils('3/6/9/12'),
  pouvoirs: pows('Lire les pensées 3, Détection du mensonge 3, Invisibilité 2, Humanité 4, Détection du futur proche 2, Augmentation de Volonté 3, Volonté supra-normale 4, Charme 3'),
  talents: 'Séduction 4, Aisance sociale 4, Discussion 4, Savoir occulte 2 (droit infernal 5)',
  notes: 'Grand, brun, charmeur, toujours tiré à quatre épingles et conciliant : politicien-né, dévoué corps et âme à Andromalius qui lui a confié la politique infernale en France. Impitoyable une fois le point faible de l\'adversaire trouvé.\nObjectif : découvrir la vérité et tout apprendre des affaires de Belial et Crocell ; à la moindre occasion, il chargera Crocell pour qu\'Andromalius s\'en débarrasse, quitte à ignorer l\'infiltration de Belial. Menace de huis clos quand la salle s\'emballe.\nDéfense non donnée : 2.\nAvertissement sans frais : dandy.',
});
const professeur = npc('professeur', {
  nom: 'Le Professeur', source: 'Démon de Kronos, grade 3 (commission d\'enquête)', type: 'demon', car: car('2 2 3 6 3 5'),
  pp: 29, pfFix: 8, seuilsFix: seuils('4/8/12/16'), armes: [],
  pouvoirs: pows('Déplacement temporel 3, Télépathie 3, Projection temporelle 5, Lire les pensées 2, Sommeil 3, Volonté supra-normale 4, Anaérobiose'),
  talents: 'Hobby (histoire) 5, Discussion 6, Savoir occulte 3 (administration infernale 6+)',
  notes: 'Quinquagénaire chauve en fauteuil roulant (surnommé d\'après le professeur Xavier), dans ce corps depuis plus de deux siècles. Taciturne, écoute puis tranche d\'un avis laconique et définitif ; consigliere respecté des démons de France, pleins pouvoirs de Kronos.\nObjectif : maintenir la paix et l\'équilibre du Grand Jeu tout en découvrant le fin mot de l\'affaire ; prêt à écouter si les manœuvres de Belial sont révélées.\nDéfense non donnée : 2.\nAvertissement sans frais : paraplégique.',
});
const jezabel = npc('jezabel', {
  nom: 'Jézabel', source: 'Démone de Malphas, grade 3 (commission d\'enquête)', type: 'demon', car: car('1 2 2 5 5 5'),
  pp: 23, pfFix: 6, seuilsFix: seuils('3/6/9/12'),
  pouvoirs: pows('Polymorphie 3, Lire les pensées 4+, Détection du mensonge 2, Discorde 5, Charme 4, Télépathie 3, Invisibilité 2, Esprits multiples 2'),
  talents: 'Discussion 5, Séduction 5, Savoir occulte 3 (politique infernale 6)',
  notes: 'Grande femme très pâle aux cheveux noirs, tailleurs stricts et escarpins vernis, air innocent quand elle ment. Retorse, illusionniste, vicieuse et très ambitieuse ; membre de l\'Aphte (société secrète de Malphas).\nObjectif : semer le chaos, pousser les deux frères à se battre en défendant tour à tour l\'un et l\'autre, et détourner l\'attention du rôle de Malphas (c\'est lui qui a parlé à Crocell).\nDéfense non donnée : 2.\nAvertissement sans frais : besoin de perversion.',
});
const pyre = npc('pyre', {
  nom: 'Pyre', source: 'Démon de Belial, grade 1 (se fait passer pour un Crocell)', type: 'demon', car: car('5 3 3 3 2 3'), def: L(4),
  pp: 16, pfFix: 8, seuilsFix: seuils('7/14/21/28'),
  armes: [{ n: 'Énorme massue (cachée dans le chariot)', att: L(5), prec: -2, puis: 3, melee: true }],
  pouvoirs: pows('Jet de flammes 3, Incendie 2, Immunité contre le feu, Détection du bien 2, Éclats de glace 3, Couche de glace 2, Téléportation 2'),
  talents: 'Combat 5, Défense 4',
  notes: 'Vieille dame vénérable avec chariot à commissions plein de poireaux (et leur odeur), qui cache une énorme massue. Mission : faire croire aux PJ que Crocell veut leur peau et les débarrasser d\'Aglâglâ sans y laisser la sienne.\nMassue : profil de marteau de guerre estimé (précision −2, puissance +3).\nAvertissement sans frais : odeur suspecte.',
});
const cailleras = npc('cailleras', {
  nom: 'Les cailleras du froid', source: 'Familiers de Pyre (déguisés en Flocons de sang)', type: 'familier', qty: 4,
  car: car('3 3 2 2 1 2+'), def: L(3), pp: 5, pfFix: 5, seuilsFix: seuils('4/9/13/18'),
  armes: [{ n: 'Fusil à pompe', att: L('3+'), prec: -2, puis: 5, melee: false }],
  pouvoirs: pows('Éclats de glace 2'),
  talents: 'Tir 2 (armes d\'épaule 3+), Défense 3, Athlétisme 2',
  notes: 'Lascars classiques en joggings jaune poussin, avec quelques fusils à pompe. Leur seule fonction : se faire dessouder par les PJ (sans le savoir).',
});
const icetea = npc('icetea', {
  nom: 'Icetea', source: 'Démone de Crocell, grade 2 (vengeresse)', type: 'demon', car: car('3 3 3 4 2 4'), def: L(4),
  pp: 21, pfFix: 7, seuilsFix: seuils('5/10/15/20'),
  armes: [{ n: 'Uzi maudit mineur', att: L(4), prec: 0, puis: 6, melee: false }],
  pouvoirs: pows('Éclats de glace 3, Couche de glace 2, Froid polaire 3, Immunité contre le froid, Armure corporelle 3, Régénération 3'),
  talents: 'Tir 2 (armes automatiques 4), Défense 4, Discrétion 3',
  notes: 'Jeune Japonaise aux cheveux vert fluo en robe chinoise rouge. Veut éliminer les PJ pour venger la condamnation de Crocell : fanatique, prête à se sacrifier en emportant le plus de PJ possible.\nUzi : attaque multiple, pénétration importante, portée moyenne.\nAvertissement sans frais : couleur des cheveux.',
});
const flocons = npc('flocons', {
  nom: 'Les Flocons de sang', source: 'Humains au service de Crocell', type: 'humain', qty: 6,
  car: car('2 2 1 2 1 2'), def: L(3), pp: 4, pfFix: 4, seuilsFix: seuils('3/6/9/12'),
  armes: [{ n: 'Uzi', att: L(3), prec: -2, puis: 4, melee: false }],
  pouvoirs: pows('Éclats de glace 1'),
  talents: 'Tir 1+ (armes de poing 3), Défense 3, Discrétion 3',
  notes: 'Jeunes Asiatiques en ninjas de téléfilm, armés d\'Uzi. Accompagnent Icetea en cas d\'attaque des Crocell vengeurs. Nombre estimé ; attaque calculée sur la spécialité armes de poing (Uzi assimilé), profil de pistolet-mitrailleur.',
});

// Le bestiaire joint (types réutilisables) : mêmes fiches, sans quantité
const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });

// ---------------- Scènes ----------------
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  scene('briefing', '1. La lettre de Nostradamus', 'Centre de Tri, Paris',
    `Gilbert a trouvé parmi les lettres perdues une enveloppe de 1566 : Michel de Nostre-Dame (« Michou ») y écrit à un ami parisien qu'il a retrouvé une page égarée de sa traduction et qu'elle évoque une guerre entre Belial et Crocell (et une femme enceinte, et la fin du monde…). Mort quelques mois plus tard, son séjour chez une vieille cousine d'Auxerre est resté inconnu.
Monsieur Fabien réserve train et chambres dans une auberge d'Auxerre et envoie les PJ récupérer cette prophétie.

Contexte MJ : Nostradamus descend des mekoubals, kabbalistes initiés par Kronos. Ses vraies prophéties ont été escamotées avant publication et cachées par Kronos dans un bibliobus vendéen ; seule une page, glissée par mégarde dans un livre de Villon, lui a échappé. Ce qui y est écrit concerne la campagne en cours (le poème d'introduction).
Thème du scénario : tout est écrit d'avance, mais les PJ restent libres ; leurs moindres actes ont des conséquences énormes.`,
    [inScene(fabien)]),
  scene('auxerre', '2. Toc, toc… : enquête à Auxerre', 'Auxerre (Yonne) – bibliothèque, archives, bar du père Rouquin',
    `Auxerre : préfecture de l'Yonne, ~50 000 habitants, vin, vieille ville médiévale et club de foot omniprésent.
Pistes :
• Bibliothèque : rien. MAIS ses ordinateurs sont piégés par Rectius (ange de Dominique, cyberpolice du Réticulum) : dès lors, un serviteur de Dieu file discrètement les PJ.
• Archives municipales : aucune trace, et difficiles d'accès sans justificatif de recherche.
• Sociétés d'histoire locales : jamais entendu parler, mais ça les excite ; contre la promesse de sources, elles envoient vers le généalogiste Jean-Louis Roffay.
• Roffay : la cousine prendra longtemps à retrouver ; il conseille plutôt le père Rouquin (adresse et bar où il passe ses journées).
• Le père Rouquin (92 ans) : confiance à gagner à force de patience, de verres de rouge et de roleplay. Il se souvient que, selon un aïeul, on voyait Nostradamus grimper dans la Tour de l'Horloge pour y faire des « maléfices ».`,
    [inScene(roffay), inScene(rouquin), inScene(espion)]),
  scene('tour', '3. Le donjon, le donjon !', 'Tour de l\'Horloge, Auxerre – puis archives municipales',
    `La tour est une impasse : elle a brûlé en 1825 (le père Rouquin le savait, mais on ne lui avait pas demandé). Construite au XVe siècle sur une tour du castrum gallo-romain, ancienne prison comtale devenue horloge et beffroi. Michou y avait caché sa page, tomba malade, fut rapatrié à Paris et mourut sans rien révéler.
La tour fut restaurée à partir de 1891 : un ouvrier y a trouvé les papiers et les a emportés chez lui… puis est soudain devenu très riche.
Les noms des ouvriers sont aux archives municipales : Roffay retrouve leurs familles en quelques heures. Un nom saute aux yeux : Thierry Valet, descendant direct de l'ouvrier Louis Valet, à la tête d'une fortune obscène pour une famille de prolos.`,
    [inScene(roffay)]),
  scene('rectius', '4. Traque sur Internet : le piège de Rectius', 'Auxerre – bibliothèque après la fermeture (ou autre lieu de rendez-vous)',
    `Le serviteur de Rectius file les PJ depuis la bibliothèque ; repéré, il prévient son patron et tente de fuir.
Tôt ou tard, Rectius passe à l'action : il appelle les PJ ou laisse un message à leur auberge en se faisant passer pour un employé de la bibliothèque ayant trouvé une information intéressante, donne rendez-vous après la fermeture et tente de les éliminer avec ses deux sections lourdes (soldats de Dieu de Sécu Auxerre).
Auxerre abrite une forte concentration de forces du Bien : ne pas trop faire de bruit.`,
    [inScene(rectius), inScene(sections), inScene(espion)], true,
    [choice('rectius', 'Comment tourne l\'embuscade de Rectius ?', [
      ['Les PJ flairent le piège', 'Ils peuvent retourner l\'embuscade, éviter le rendez-vous ou attaquer Rectius chez sa mère.'],
      ['Combat au rendez-vous', 'Rectius et ses sections lourdes tentent d\'éliminer les PJ ; attention aux autres forces du Bien d\'Auxerre.'],
      ['Rectius survit et s\'enfuit', 'Il signale les démons à sa hiérarchie : Auxerre devient dangereuse pour la suite de l\'enquête.'],
    ])]),
  scene('manoir', '5. Le sombre manoir des Valet', 'Propriété Valet, sur une colline près d\'Auxerre (élevage de poulets fermiers)',
    `Énorme bâtisse de la fin du XIXe siècle, chaque génération ayant ajouté sa touche, défigurée récemment par le design branché de Thierry. Autour, un immense terrain avec des milliers de poulets labellisés, entrepôts, couveuses et bureaux.
Thierry Valet reçoit sur le pas de la porte et refuse d'écouter s'il n'y a pas d'argent à gagner. Sans baratin efficace (se faire passer pour agents immobiliers…), il faut cambrioler.
La bibliothèque familiale a été démontée pour un coin multimédia : livres et étagères sont en vrac à la cave, encombrée d'outils coupants et contondants.`,
    [inScene(thierry)], false,
    [choice('entree', 'Comment les PJ entrent-ils dans la maison ?', [
      ['Baratin auprès de Thierry', 'Visite autorisée ; accès discret à la cave.'],
      ['Cambriolage', 'Accès à la cave, au risque d\'être surpris par Thierry ou le personnel de l\'élevage.'],
    ])]),
  scene('cave', '6. La cave : Yatagan', 'Cave de la maison Valet',
    `Dès que les PJ fouillent le tas de livres, la cave s'anime : tronçonneuses et tournevis les attaquent (Télékinésie).
Vérité : Nostradamus était aussi un sorcier compétent. Il a invoqué et lié l'ange Yatagan (Laurent) à sa page pour la protéger et empêcher sa destruction. Louis Valet (lointaine ascendance fée) a étudié les notes et fini par contrôler sans le savoir les pouvoirs de l'ange : d'où la fortune de la famille.
Yatagan, coincé dans la page entre deux livres depuis des siècles, veut juste qu'on brûle le papier pour rentrer au Paradis, mais il se défend. Il « déborde » sur les livres voisins : un livre par PF, qui se couvrent d'une armure au début du combat (faciles à repérer) ; il faut les détruire.
Piège : si Yatagan est tué, le papier brûle et la prophétie est perdue. Il faut l'amener pile à 0 PF ou l'épuiser jusqu'à ce qu'il n'ait plus de PP.
Ensuite, retour à Paris pour remettre la prophétie à Monsieur Fabien.`,
    [inScene(yatagan)], true,
    [choice('prophetie', 'Les PJ récupèrent-ils la prophétie ?', [
      ['Oui, Yatagan neutralisé (0 PF pile ou à court de PP)', 'La page est intacte ; Monsieur Fabien la récupérera au Centre de Tri.'],
      ['Non, Yatagan tué : le papier brûle', 'La prophétie de Nostradamus est perdue ; Monsieur Fabien n\'a rien à récupérer (pas de pouvoir en récompense, au choix du MJ).'],
    ])]),
  scene('cdt', '7. CdT, zone occupée', 'Centre de Tri, Paris – retour d\'Auxerre',
    `Acte 2. Belial a révélé à la Cour que Crocell dote des humains de pouvoirs (affaire Raymond Bougoin et Julie, scénarios précédents) et prétend avoir des preuves ; bagarre à la Cour, Andromalius impose le silence et lance une enquête. Sur Terre, Belial et Crocell se battent ouvertement.
Au CdT : lumières allumées en pleine nuit, deux voitures et un van garés n'importe comment, humains renvoyés chez eux. Monsieur Fabien, Gilbert et Aurélie sont « retenus » dans le bureau.
Belial a envoyé un démon « protéger » ses témoins (Oussaichô), Crocell un autre pour l'en empêcher (Aglâglâ), Andromalius une équipe pour éviter le dérapage. À l'arrivée des PJ : le Belial braque le Crocell, qui lui rend la pareille, les deux Andromalius les braquent chacun. Monsieur Fabien rassure les PJ.
Un démon d'Andromalius (grand Noir à dreadlocks, costume gris) convoque les PJ dans deux jours devant une commission d'enquête sur l'implication de Crocell. Insultes, refus de partir des deux gardes ; les Andromalius finissent par partir en laissant aux deux démons la sécurité des PJ jusqu'à leur comparution, avec menaces de représailles.
Monsieur Fabien récupère les prophéties, félicite les PJ et leur accorde un pouvoir au choix (8 PA maximum) qui prend effet immédiatement.`,
    [inScene(fabien), inScene(oussaicho), inScene(aglagla)]),
  scene('securite', '8. C\'est pour votre sécurité…', 'Paris – villa / CdT où les PJ sont hébergés, jusqu\'à la commission',
    `Oussaichô et Aglâglâ protègent et surveillent les PJ en permanence ; ils passent surtout leur temps à s'insulter par PJ interposés, à se provoquer et à frôler la bagarre. Ils tentent aussi d'influencer les dépositions et de se faire confier ce que savent les PJ. Rendre ces deux jours aussi pesants que possible.
Si les PJ tapent sur l'un d'eux, le laissent se faire étriper ou les tuent : avertissement sans frais, et s'ils sont reconnus directement responsables d'une mort, ils finiront la campagne en renégats.

Embuscade (soir du premier jour d'audition) : Pyre (Belial) et ses quatre familiers, se faisant passer pour un serviteur de Crocell et une escouade de Flocons de sang, attaquent les PJ sur le chemin du CdT (où ils sont hébergés le temps de l'enquête). Oussaichô en profite pour paralyser Aglâglâ, que les agresseurs criblent d'une « balle perdue » ; ils combattent encore quelques secondes puis fuient.
Oussaichô en profite pour rappeler que Crocell est un salaud et qu'il faut bien choisir son camp. Le lendemain matin, avant l'affaire Julie, il conseille de ne pas étaler leurs doutes : leur villa était truffée de caméras, et un montage prouve leur complicité avec Julie et la Terre Creuse.`,
    [inScene(oussaicho), inScene(aglagla), inScene(pyre), inScene(cailleras)], true,
    [choice('gardes', 'Que deviennent les deux gardes du corps ?', [
      ['Les deux survivent', 'Tensions jusqu\'au bout ; Oussaichô continue de pousser les PJ vers le camp de Belial.'],
      ['Aglâglâ meurt dans l\'embuscade', 'Le plan de Pyre réussit ; si les PJ y sont pour quelque chose, avertissement sans frais (ou renégats s\'ils sont reconnus directement responsables).'],
      ['Les PJ s\'en prennent eux-mêmes à un garde', 'Avertissement sans frais ; renégats s\'ils sont directement responsables d\'une mort.'],
    ])]),
  scene('commission', '9. La commission d\'enquête', 'Hôtel Lutetia, Paris 6e – salon de réception, de 8 h à 18 h',
    `Commission menée par quatre démons représentant Andromalius (Salomon), Baal (Marie-Jolie), Kronos (le Professeur) et Malphas (Jézabel) ; Andréalphus et Bifrons sont absents. Ambiance entre commission anticommuniste des années 50 et réunion de la Mafia. Une foule de démons curieux (surtout Crocell et Belial) dans la salle intervient bruyamment et tente de coincer les PJ en privé, sous l'œil de la sécurité d'Andromalius (PNJ génériques au besoin).
Les PJ ouvrent le bal :
• « Vous avez le droit de garder le silence » : accueil chaleureux, « audition » et non interrogatoire. Ils racontent l'affaire Raymond Bougoin, puis répondent sur d'autres incidents avec des Crocell et sur le caractère isolé ou non de Raymond. On leur demande de revenir aux séances.
• « Vidéo gag » : le lendemain, projection d'une vidéo anonyme des aveux de Julie (tirée des caméras de la villa, pas de la cassette des PJ ; seule Julie apparaît). Julie est identifiée comme démone de Crocell : tollé, séance ajournée.
• « Mea culpa » : une demi-douzaine de membres de la Garde carmine amènent une Julie terrifiée ; elle feint l'incompréhension puis avoue tout devant la salle. Salomon menace de huis clos. Si les PJ dénoncent la manipulation, Julie joue la comédie et nie les connaître ; les PJ sont réinterrogés sans ménagement. Même une Détection du mensonge favorable ne suffit pas faute de preuve tangible : avertissement sans frais pour ne pas avoir parlé plus tôt.
• « C'est pas moi, c'est lui » : un démon de Crocell vient affirmer que des Belial infiltrent les rangs de son prince ; sa seule preuve est l'aveu fait par Malphas à Crocell… pas très probant.`,
    [inScene(salomon), inScene(marieJolie), inScene(professeur), inScene(jezabel), inScene(julie), inScene(oussaicho), inScene(aglagla)], false,
    [choice('denonce', 'Les PJ révèlent-ils leurs soupçons sur Belial ?', [
      ['Oui, devant la commission', 'Julie nie ; les PJ sont réinterrogés durement et prennent un avertissement sans frais pour ne pas avoir parlé plus tôt. Le Professeur et Marie-Jolie peuvent être réceptifs ; Oussaichô ressort le montage vidéo.'],
      ['Ils se taisent', 'Le dossier contre Crocell se renforce ; Belial a les mains libres.'],
    ])]),
  scene('verdict', '10. Belial 1 – Crocell 0', 'Paris et les Enfers – après la dernière audition',
    `Le résultat dépend surtout de la prestation des PJ.
Dans tous les cas, une guerre ouverte éclate entre les deux frères, sur Terre comme en Enfer. Crocell doit quitter les Enfers et se cacher sur Terre ; la Cour panique, n'ose chasser ni l'un ni l'autre (ou soutient à contrecœur la croisade de Belial en freinant ses ardeurs s'il a gagné).
Représailles contre les PJ selon leur attitude : un squad de Crocell vengeurs (Icetea et ses Flocons de sang) ou des Belial en goguette (division Napalm, scénario suivant). Les effets de jeu sont détaillés dans l'aide de jeu en annexe de la deuxième partie de la campagne.`,
    [inScene(icetea), inScene(flocons)], true,
    [choice('crocell', 'Les PJ ont-ils convaincu la commission que Belial manipule l\'enquête ?', [
      ['Oui, intervention convaincante', 'Crocell n\'est pas tiré d\'affaire, mais la manipulation de Belial paraît plausible : aucune sanction disciplinaire contre lui. Risque de Belial en goguette.'],
      ['Non', 'Crocell est déclaré renégat quelques jours plus tard ; tous ses démons doivent se présenter chez Andromalius pour réaffectation. Risque d\'attaque des Crocell vengeurs (Icetea).'],
    ])]),
];

const scenario = {
  id: 'fire-and-ice-7-demon-animal-politique',
  nom: 'Fire and Ice (scénario 7) – Le démon est un animal politique',
  resume: `De bello civili (INS). Acte 1 : le Centre de Tri envoie les PJ à Auxerre récupérer une page inédite des prophéties de Nostradamus, cachée dans la cave d'une famille de parvenus et gardée par un ange lié au papier, tandis qu'un ange geek de Dominique les traque. Acte 2 : Belial déclenche sa guerre contre Crocell ; les PJ, témoins clés, sont flanqués de deux gardes du corps rivaux et convoqués devant une commission d'enquête infernale où Belial manipule tout le monde. Leur témoignage décide en partie du sort de Crocell.`,
  notes: `Source : ${REF}.
Déroulement : lettre de Nostradamus → enquête à Auxerre (Roffay, père Rouquin) → Tour de l'Horloge et archives → piège de Rectius → manoir Valet → cave et Yatagan → retour au CdT occupé → deux jours sous « protection » (embuscade de Pyre) → commission d'enquête à l'hôtel Lutetia → verdict et guerre ouverte.

Récompenses :
• Monsieur Fabien accorde un pouvoir au choix (8 PA maximum), effet immédiat, au retour avec la prophétie.
• Sanctions : avertissement sans frais si les PJ s'en prennent aux gardes du corps ou s'ils dénoncent Belial trop tard ; renégats pour la fin de la campagne s'ils sont reconnus directement responsables de la mort d'un garde.

Conséquences : guerre ouverte Belial/Crocell quoi qu'il arrive ; Crocell déclaré renégat si les PJ n'ont pas convaincu la commission. Représailles : Crocell vengeurs (Icetea, Flocons de sang) ou Belial en goguette (division Napalm du scénario suivant).

Fiches adaptées du livre : caractéristiques en niveaux INS/MV (Ch des humains reporté en Foi). Julie Delahaye : fiche du scénario précédent avec Jet de flammes 4. Sections lourdes et serviteur de Rectius : soldat et serviteur de Dieu typiques du livre de règles. Yatagan : pas de seuils de blessure (PF seulement). Valeurs estimées signalées dans les notes des fiches.`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [fabien, roffay, rouquin, thierry, espion, rectius, sections, yatagan, oussaicho, aglagla, julie,
  marieJolie, salomon, professeur, jezabel, pyre, cailleras, icetea, flocons].map(asType);

// Contrôle : pouvoirs inconnus des règles
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));

writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types');
