// Génère le fichier d'import « insmv-scenario » pour « Un coup dans le chat, un coup dans le pot, c'est l'amour en chapeau ! »
// (Angelots en gelée, p. 110-128 imprimées = PDF 109-128, la page PDF 115 étant un doublon)
// usage : node gen-angelots-8-coup-dans-le-chat.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Angelots en gelée, « Un coup dans le chat, un coup dans le pot, c\'est l\'amour en chapeau ! », p. 110-128';
const L = (s) => R.parseLvl(String(s));
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
const ARMES = new Map(R.ARMES.flatMap(([g, l]) => l.map((x) => [x[0], { prec: x[1], puis: x[2], melee: R.MELEE_GROUPS.includes(g) }])));
// arme de la table des règles : nom affiché, nom dans la table, niveau du talent
const arme = (n, table, lvl) => { const w = ARMES.get(table); if (!w) throw new Error('arme inconnue : ' + table); return { n, att: L(lvl), ...w }; };
const poing = (lvl) => arme('Coup de poing', 'Coup de poing', lvl);
const P = 'ag8-'; let n = 0; const id = (k) => P + k;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [poing(1)], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});
const NOARM = 'Aucun talent de combat : coup de poing estimé au niveau 1. Défense non donnée : niveau 1.';
const INTERRO = 'Réactions aux six approches d\'interrogatoire : voir les notes de la scène des témoignages.';

// ---------------- Le clergé de la CEF ----------------
const lalanne = npc('lalanne', {
  nom: 'Père Stanislas Lalanne', source: 'Serviteur de Dieu de Didier – secrétaire général de la Conférence des évêques de France', type: 'serviteur',
  car: car('1 1 2 3+ 1 3'), pp: 6, pfFix: 4, seuilsFix: seuils('2/4/6/8'),
  pouvoirs: pows('Aura de pacification 1'),
  talents: 'Baratin 2, Discussion 3, Aisance sociale 3, Culture générale 2 (politique de la CEF 4), Savoir occulte 1 (hiérarchie angélique 3), Latin 2',
  notes: `71 ans, petit, chauve, lunettes. Jésuite, l'homme le plus puissant de l'Église de France. Joue au vieux sage modeste ; en réalité froid, calculateur, n'a que des intérêts. Répond par des questions.
A organisé le maquillage du meurtre en suicide (réunion de J-2 à 11 h) et compte bien en tirer parti. Nie jusqu'au bout avoir été au courant. Peut devenir le meilleur allié des PJ s'ils le convainquent qu'ils vont dans son sens.
Ce qu'il peut offrir : soutien de la CEF, facilités avec Notre-Dame, argent, serviteurs de Dieu, recommandations (des PA). Didier le lâche s'il apprend son rôle.
${INTERRO}
${NOARM}`,
});
const hayet = npc('hayet', {
  nom: 'Père Bernard Hayet', source: 'Serviteur de Dieu de Dominique – secrétaire pour les questions pastorales', type: 'serviteur',
  car: car('2 2+ 2 3 2 3+'), pp: 6, pfFix: 5, seuilsFix: seuils('3/6/9/12'),
  pouvoirs: pows('Détection du mal 1+'),
  talents: 'Baratin 1, Discussion 2, Enquête 3, Fouille 2, Aisance sociale 2, Intimidation 4, Savoir occulte 1 (hiérarchie angélique 2), Culture générale 2 (politique de la CEF 2), Latin 1',
  notes: `68 ans, cheveux blancs. Narcissique, théocrate d'extrême droite, coups de gueule légendaires. Bloqué dans sa carrière, il rêve de prendre la place de Lalanne et voit dans l'affaire un scandale à exploiter. Innocent : il ignore tout des soirées, que Wasselynck (son subordonné, inquisiteur de la CEF) lui cache.
Seul membre de la CEF à reconnaître la valeur des logs informatiques. Allié de poids si les PJ ont des preuves.
Ce qu'il peut offrir : l'appui de Dominique (prêt à tout pour que son poulain dirige la CEF), facilités judiciaires au Paradis, soldats de Dieu, recommandations (des PA).
${INTERRO}
${NOARM}`,
});
const larvols = npc('larvols', {
  nom: 'Père Jean-Paul Larvols', source: 'Serviteur de Dieu d\'Ange – secrétaire pour l\'apostolat des laïcs', type: 'serviteur',
  car: car('1 2 3 3+ 2 1'), pp: 4, pfFix: 5, seuilsFix: seuils('2/4/6/8'),
  pouvoirs: pows('Assaut spirituel 1'),
  talents: 'Baratin 4, Discussion 2, Aisance sociale 2, Intimidation 6, Savoir occulte 2 (hiérarchie angélique 3), Culture générale 2 (politique de la CEF 3), Latin 2',
  notes: `77 ans, petit, chauve, lunettes. « Honnête ordure » : manipulateur, lâche, opportuniste, il tient son monde par le chantage. Était l'amant de Fournier. Complice : présent à la soirée, c'est lui qui a mis Lalanne dans la confidence. Pseudo sur le site : « Gros Dégueulasse » (sa boîte est la plus ancienne de la CEF).
Ce qu'il peut offrir : soutien de son secrétariat, argent, serviteurs de Dieu. Ange le lâche si elle apprend son rôle.
${INTERRO}
${NOARM}`,
});
const lebel = npc('lebel', {
  nom: 'Olivier Lebel', source: 'Serviteur de Dieu au service de Marc – secrétaire pour les questions administratives, juridiques et financières', type: 'serviteur',
  car: car('2 2 2 2+ 3 1'), pp: 3, pfFix: 5, seuilsFix: seuils('3/6/9/12'),
  pouvoirs: pows('Augmentation de Présence 1'),
  talents: 'Culture générale 2 (économie 4), Informatique 2, Latin 1, Discussion 4, Connaissance occulte 0 (hiérarchie angélique 1)',
  notes: `49 ans. Laïc, calme, consciencieux, neutre dans les luttes de pouvoir ; tient les cordons de la bourse. Totalement innocent, mais sait que l'innocence ne suffit pas toujours à l'Église : il peut paniquer plus qu'un coupable.
Ce qu'il peut offrir pour avoir la paix : argent, biens, appartements, voitures.
${INTERRO}
${NOARM}`,
});
const defois = npc('defois', {
  nom: 'Père Gérard Défois', source: 'Serviteur de Dieu de Guy – conseiller pour Caritas (Secours catholique)', type: 'serviteur',
  car: car('2 1 2 1+ 1 1'), pp: 2, pfFix: 3, seuilsFix: seuils('3/6/9/12'),
  pouvoirs: pows('Bénédiction : guérison de maladies 2'),
  talents: 'Aisance sociale 1, Culture générale 2, Médecine 2, Savoir occulte 1 (hiérarchie angélique 2), Cinéma érotique européen 4, Latin 1',
  notes: `48 ans, chauve, corpulent. Croyant sincère rongé par une addiction sexuelle de plus en plus extrême ; premier client du site à la CEF, il y a entraîné ses collègues. Ignore la vraie nature des filles (ses notions de médecine le font douter). Pseudo : « Judas ».
Hanté par la culpabilité, il a fait envoyer le dossier à Notre-Dame et espère au fond être démasqué et puni : c'est le maillon qui craque le plus vite.
N'a rien à offrir.
${INTERRO}
${NOARM}`,
});
const wasselynck = npc('wasselynck', {
  nom: 'Père René Wasselynck', source: 'Serviteur de Dieu de Joseph – secrétaire délégué à la doctrine de la foi (inquisiteur de la CEF)', type: 'serviteur',
  car: car('1 1 1 2+ 2 1'), pp: 3, pfFix: 3, seuilsFix: seuils('2/4/6/8'),
  pouvoirs: pows('Détection du mensonge 1'),
  talents: 'Culture générale 2 (histoire 4), Baratin 1, Discussion 3, Intimidation 4, Savoir occulte 2 (hiérarchie angélique 4), Latin 4, Torture 1',
  notes: `77 ans, ancien aumônier de la Marine. Sadique, royaliste, homosexuel refoulé. A suivi Défois pour le prendre la main dans le sac, puis est devenu lui-même accro aux soirées, en simple spectateur. Pseudo : « Roberto Malone ».
A récupéré les bandes vidéo chez le gardien de nuit (J-2 à 6 h) : elles sont cachées dans son bréviaire creusé. A aidé Papin à monter le faux suicide.
Ce qu'il peut offrir : l'appui de Joseph (qui ne veut surtout pas de scandale), recommandations (des PA), soldats de Dieu, argent, facilités judiciaires au Paradis. Arrêter Wasselynck, c'est se mettre Joseph à dos.
${INTERRO}
${NOARM}`,
});
const papin = npc('papin', {
  nom: 'Jean-Louis Papin', source: 'Soldat de Dieu de Laurent – garde du corps du secrétaire général', type: 'soldat',
  car: car('3 3 3 1 1 1'), def: L(2), pp: 2, pfFix: 4, seuilsFix: seuils('4/8/12/16'),
  armes: [arme('Couteau Rambo', 'Poignard ou saï', 4), poing(2)],
  pouvoirs: pows('Juste-lame 2'),
  talents: 'Combat 2 (couteau Rambo 4), Défense 2, Fouille 3, Athlétisme 2, Intimidation 2, Savoir militaire (protection rapprochée 2), Acrobatie 1, Films de Stallone 2, Bodybuilding 1',
  notes: `27 ans, grand et costaud. Gros bras simple et timide, qui ne parle qu'en répliques de Stallone. Pseudo : « Rambo ». A conduit la camionnette du Secours catholique jusqu'à Pantin, a ramené le corps dans la cellule (aidé sans le savoir par Christophe Lemaire), puis a mis en scène le suicide avec un tournevis trop petit.
Bien interrogé, il lâche facilement toute l'affaire. Bouc émissaire idéal ; Laurent envoie un ange l'arrêter ou le tuer s'il apprend son rôle.
${INTERRO}
Coup de poing estimé au niveau de Combat (2).`,
});
const clemaire = npc('christophe', {
  nom: 'Christophe Lemaire', source: 'Gardien de nuit de la CEF', type: 'humain',
  car: car('2 2 2 1+ 2 1'), pfFix: 3, seuilsFix: seuils('3/6/9/12'),
  talents: 'Gardiennage 1, Balayage 1, Cantique 2',
  notes: `59 ans. Orphelin élevé par la CEF, comme sa sœur Isabelle ; innocent, naïf, incapable de voir le mal. A aidé Papin à porter Fournier jusqu'à son lit sans rien comprendre, et a remis les bandes vidéo à Wasselynck. Coupable idéal que les PJ pourraient être tentés d'accuser.
${INTERRO}
${NOARM}`,
});
const ilemaire = npc('isabelle', {
  nom: 'Isabelle Lemaire', source: 'Assistante du père Lalanne', type: 'humain',
  car: car('1 2 1 1 1 1'), pfFix: 2, seuilsFix: seuils('2/4/6/8'),
  talents: 'Métier (secrétariat) 2, Tricot 2, Bonnes actions 1',
  notes: `63 ans. Sœur de Christophe, aussi innocente que lui. Envoyée par Lalanne chercher Fournier (J-2 à 15 h), elle a découvert le corps ; Lalanne lui a interdit d'appeler les secours. Encore sous le choc.
${INTERRO}
${NOARM}`,
});
const besset = npc('besset', {
  nom: 'Patricia Besset-Vazin', source: 'Secrétaire personnelle du père Défois', type: 'humain',
  car: car('1 2 2 2 1+ 1'), pfFix: 3, seuilsFix: seuils('2/4/6/8'),
  talents: 'Culture générale 1, Savoir occulte 0+ (hiérarchie angélique 1), Métier (secrétariat) 1, Latin 1, Intimidation 1',
  notes: `47 ans, bourgeoise versaillaise mariée, sept enfants, aigrie et mesquine ; barrage redoutable devant la porte de Défois. A signé la demande d'enquête envoyée à Notre-Dame. Sait que son patron a un emploi du temps bizarre et fréquente des sites pornographiques, et a entendu des rumeurs sur les sorties nocturnes de la moitié de la CEF.
${INTERRO}
${NOARM}`,
});

// ---------------- Autres témoins (sans caractéristiques) ----------------
const blanloeil = npc('blanloeil', {
  nom: 'Eric Blanloeil', source: 'Directeur des Pompes funèbres Saint-Jean', type: 'humain', car: car('2 2 2 2 2 2'),
  notes: `La soixantaine, l'air douloureusement compatissant. Pas « aware ». Admirateur de Lalanne. A vu tout de suite que le tournevis était trop petit et qu'il n'y avait pas assez de sang, et en a conclu à un vrai suicide maquillé pour épargner la CEF. Refuse d'admettre la moindre irrégularité (y compris le certificat signé sans examen) et pousse à un enterrement rapide.
Pas de caractéristiques dans le livre : fiche d'humain moyen (niveau 2 partout), estimée.`,
});
const biguet = npc('biguet', {
  nom: 'Docteur Gilles Biguet', source: 'Gynécologue à la Pitié-Salpêtrière, notable catholique intégriste', type: 'humain', car: car('2 2 2 2 2 2'),
  notes: `A signé le certificat de décès sans voir le corps, à la demande de son ami Blanloeil. Répond aux envoyés de l'Église avec un jargon pompeux, mais n'a rien à cacher d'autre que sa négligence.
Pas de caractéristiques dans le livre : fiche d'humain moyen (niveau 2 partout), estimée.`,
});
const montane = npc('montane', {
  nom: 'Nico Montane', source: 'PDG véreux de Montane Electronic, client du réseau', type: 'humain',
  car: car('2 2 1+ 1+ 1 2'), pfFix: 3, seuilsFix: seuils('3/6/9/12'),
  talents: 'Science 1 (électronique 2), Discussion 2, Gestion 2, Torture 2',
  notes: `58 ans, émigré roumain enrichi, méprisant et sadique, l'un des pires clients du site (pseudo « Don Juan »). C'est lui qui a tué Fournier, par accident, pendant la soirée de Pantin ; Trixi lui a extorqué une grosse somme pour étouffer l'affaire et le fait chanter depuis.
Société enregistrée dans le 19e, pavillon près des Buttes-Chaumont (bureaux au rez-de-chaussée et au 1er, logement au 2e). Facile à rencontrer si l'on passe sa secrétaire. Craque vite : propose 100 000 € aux PJ pour éliminer Trixi, peut les parrainer sur le site et leur donner le lieu et l'heure de la prochaine soirée. Ne sait presque rien de Trixi et de « Satan », sauf qu'ils ont peu de gardes et que les employés roumains ont peur de Trixi.
${NOARM}`,
});
const arad = npc('arad', {
  nom: 'Arad', source: 'Ange de Novalis, grade 1 – bureaucrate à Notre-Dame, chargé du dossier', type: 'ange',
  car: car('4 2 4 3 4 3'), pp: 6, pfFix: 7, seuilsFix: seuils('7/14/21/28'),
  pouvoirs: pows('Pollen 1, Sens surdéveloppés, Caméléon 2'),
  talents: 'Métier (bureaucratie) 3, Discussion 5, Science (botanique) 4, Informatique 4',
  notes: `38 ans d'apparence, chauve. Bureaucrate heureux, fanatique du « zéro papier » (pour sauver les arbres). Il a ouvert l'enquête obligatoire et juge seul la réussite de la mission : il veut un dossier cohérent, mené selon les règles. Il avale n'importe quelle conclusion crédible (suicide, faux coupable…) mais lance une enquête interne s'il repère des incohérences ou des mensonges (jusqu'à l'arrivée d'anges de Dominique). Déteste qu'on gaspille l'argent du Paradis.
Allié administratif des PJ, pas un adversaire.
${NOARM}`,
});

// ---------------- Le réseau ----------------
const gildas = npc('gildas', {
  nom: 'Gildas Brunet (« Satan »)', source: 'Faux sorcier en formation, ex-trader, gérant de sexybitches.vu', type: 'humain',
  car: car('2 3 1 3 1 1'), pfFix: 5, seuilsFix: seuils('3/6/9/12'),
  talents: 'Baratin 2, Séances SM extrêmes 4+, Métier (finance) 2, Torture 4',
  notes: `33 ans, petit et gras, habillé cher. Ex-trader licencié pour fraude, ruiné, jambes brisées par deux souteneurs roumains (dévorés depuis par ses zombies). Son invocation ratée a attiré Trixi. Se fait appeler « Satan » sur le site (l'auteur instable de 10 % des messages), reçoit ses invités depuis son fauteuil roulant et met en scène les soirées. Fou, mégalomane, persuadé d'être le chef alors que Trixi contrôle tout.
Au moindre signe d'anges, Trixi ordonne aux zombies de tuer tout le monde, Gildas en premier.
${NOARM}`,
});
const trixi = npc('trixi', {
  nom: 'Trixi (Franck Fauvin)', source: 'Démon d\'Hornet, grade 1 – le vrai patron du réseau', type: 'demon',
  car: car('4 4 3 4 2 3'), def: L(4), pp: 12, pfFix: 8, seuilsFix: seuils('5/10/15/20'),
  armes: [arme('Corps à corps', 'Coup de poing', 4), arme('Pistolet', 'Revolver gros calibre', 4)],
  pouvoirs: pows('Résurrection macabre 4, Nécrose 3, Champ de force 2'),
  talents: 'Corps à corps 4, Défense 4, Métier (gestion) 3, Discussion 3, Intimidation 5, Tir 2 (armes de poing 4)',
  notes: `47 ans d'apparence, costume trois pièces, lunettes. Démon consciencieux, plein d'humour, qui fait le Mal par métier plus que par goût ; il se lasse de diriger cette « usine à zombies » et demande en vain à Hornet d'être remplacé. Le plan d'Hornet : acheter des filles à l'Est, les tuer, les relever en zombies, les faire travailler, puis fournir des escouades de morts-vivants aux démons méritants.
Rédige 90 % des messages de « Satan ». Repère lui-même les lieux des soirées. Joignable seulement par une messagerie qu'il relève toutes les six heures (les caporaux ont le numéro) : piège possible.
En cas de problème, fait évacuer les clients et lance les zombies sur les agresseurs ; s'il sent des anges, il fuit en ordonnant le massacre puis fait le tour de ses hangars pour mettre ses zombies à l'abri.
Arme de poing non précisée : revolver gros calibre choisi pour Tir (armes de poing 4).`,
});
const maquereaux = npc('maquereaux', {
  nom: 'Maquereaux et hommes de main', source: 'Employés de Trixi et Brunet', type: 'humain', qty: 4,
  car: car('3 3 2 2 1 2'), def: L(1), pfFix: 5, seuilsFix: seuils('4/8/12/16'),
  armes: [arme('Pistolet', 'Revolver petit calibre', 3), poing(1)],
  talents: 'Intimidation 3, Tir 2 (armes de poing 3), Défense 1, Séduction 2',
  notes: `Petits criminels ralliés au réseau. Ne savent pas grand-chose : ont vu « Satan » et Trixi, connaissent une ou deux planques. Une dizaine de « caporaux » ont le numéro de Trixi. Peu habitués au combat : faciles à surprendre, mais tirent dans le tas à la moindre alerte.
Arme de poing non précisée : revolver petit calibre choisi. Coup de poing au niveau 1 (pas de Corps à corps).`,
});
const zombies = npc('zombies', {
  nom: 'Prostituées zombies', source: 'Mortes-vivantes de Trixi', type: 'mortvivant', qty: 4,
  car: car('4+ 1 1 1 1 1'), pp: 2, pfFix: 5, seuilsFix: seuils('6/12/18/24'),
  armes: [arme('Corps à corps', 'Coup de poing', 4)],
  pouvoirs: pows('Douleur 1'),
  talents: 'Corps à corps 4, Kama-sutra 3',
  notes: `Jeunes femmes achetées en Europe de l'Est, tuées et relevées par Trixi. Parfaitement dociles, capables de se défendre seules, elles obéissent à Trixi jusqu'au massacre.
Défense non donnée : niveau 1.`,
});

const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const GRILLE = `Grille d'interrogatoire (du plus doux au plus dur) :
1. Décontractée : simple formalité, aucune suspicion affichée.
2. Officielle un peu dure : les PJ jouent les flics, personne n'est tout à fait innocent.
3. Accusation voilée avec proposition de discussion : les PJ laissent entendre qu'ils savent et proposent un arrangement.
4. Accusation claire avec ouverture : attaque frontale, preuves sur la table, mais une porte de sortie (dénoncer les autres).
5. Accusation ferme sans preuve : l'interrogatoire dérape sur une accusation non étayée.
6. Accusation ferme avec preuves : procès anticipé, preuves (réelles ou supposées) présentées.
Ces réactions sont des repères : adaptez-les aux pouvoirs, aux jets et au jeu des joueurs, et récompensez les pièges subtils.`;

const scenes = [
  scene('briefing', '1. Sale affaire, patron', 'Notre-Dame – bureau du chargé de mission des PJ',
    `Le chargé de mission, blasé, confie aux PJ (en intermission) un dossier de routine : il attend un « non-résultat » sous quelques jours et les prie de ménager les susceptibilités de la Conférence des évêques de France (CEF).
Le dossier : le formulaire de mort violente d'Armand Fournier (35 ans, bras droit du secrétaire général), retrouvé avec un tournevis dans la tête dans sa cellule de fonction ; l'ordre de mission ; le formulaire 0412078 rempli par Arad, ange bureaucrate de Novalis. Seul nom donné : le découvreur officiel, Mgr Stanislas Lalanne, secrétaire général de la CEF.
Rappel pour le MJ : la CEF (7 rue Saint-Vincent, derrière le Sacré-Cœur) est la vraie tête humaine de l'Église en France, divisée en trois secrétariats rivaux (pastoral : Hayet ; apostolat des laïcs : Larvols ; administratif et financier : Lebel), arbitrés par Lalanne. Environ 120 personnes y vivent et travaillent.`,
    [inScene(arad)]),
  scene('cellule', '2. La cellule de Fournier', 'Siège de la CEF, Montmartre – studio sous les toits',
    `Studio confortable, intact depuis la découverte ; le corps est à la morgue des pompes funèbres. Les PJ ont accès à tout : Lalanne joue la transparence pour qu'ils repartent vite. Des milliers de dossiers : autant de fausses pistes.
Indices :
- Le PC portable : Fournier surfait beaucoup, mais un logiciel efface toute trace. Informatique moyen pour s'en rendre compte ; difficile pour penser au pare-feu du fournisseur d'accès de la CEF, KTOSI.
- Le tournevis, bien en évidence : seulement les empreintes de Fournier, mais mal placées (Savoir d'espion, Enquête ou Perception très difficile, puis Perception).
- Médecine : trop peu de sang pour une arme blanche ; très difficile : le sang sur la tige a été badigeonné, déjà sec ; très difficile : l'heure du décès ne colle pas avec la « visite » de Papin et Wasselynck.
Aucune trace des perversions de Fournier dans le studio : il était paranoïaque.`),
  scene('ktosi', '3. KTOSI, les logs et la boîte aux lettres', 'KTOSI, petite SSII de la CEF – puis les locaux techniques de la CEF',
    `KTOSI : douze employés catholiques fiers de servir le clergé ; le PDG Luc Favier de Coulomb ne donne rien sans la justice ou l'accord de Lalanne. On peut l'impressionner en se faisant passer pour des envoyés du Vatican (ou d'encore plus haut). Sinon, piratage sur place, dans les locaux de la CEF (Informatique très difficile).
Les logs (trois mois, quelques heures d'étude) : 80 % des PC de la CEF visitent des sites pornographiques, 20 % des sites extrêmes, et 10 % ont une adresse webmail sur sexybitches.vu, dont tous les comploteurs sauf Lalanne. Les noms se déduisent avec l'annuaire. Mots de passe chiffrés : Informatique et une dizaine d'heures par boîte. Personne à la CEF ne reconnaît ces logs comme preuve, sauf Hayet ; mais ils donnent prise sur 10 % du personnel.
La boîte de Fournier : pseudos Judas (Défois), Rambo (Papin), Roberto Malone (Wasselynck), Satan M'habite (Fournier), Gros Dégueulasse (Larvols) ; huit autres membres de la CEF au choix du MJ. Les plus vieilles boîtes ont quatre mois (celle de Larvols d'abord). Le webmaster « Satan » envoie la liste de diffusion ; Science (psychologie) : deux auteurs différents, l'un froid et professionnel (90 % des messages, Trixi), l'autre impulsif et paranoïaque (Gildas).
Deux messages clés de J-3 : l'invitation de « Satan » à une soirée réservée aux initiés avec sept « sujets » sacrifiés, et le transfert de Judas aux quatre autres. Fournier s'inscrivait à une de ces soirées la veille de sa mort.`,
    [], false,
    [choice('logs', 'Les PJ obtiennent-ils les logs ?', [
      ['Oui, par KTOSI ou par piratage', 'Ils identifient les clients du site à la CEF et ont barre sur eux ; avec Hayet, ces preuves pèsent.'],
      ['Non', 'Ils doivent s\'appuyer sur les témoignages, le corps et les bandes vidéo.'],
    ])]),
  scene('corps', '4. Le corps et les pompes funèbres', 'Pompes funèbres Saint-Jean (morgue) – CHU de la Pitié-Salpêtrière',
    `Le corps : coup de tournevis sous l'oreille droite, de bas en haut, jusqu'au cerveau (possible seul, mais jamais vu) ; le tournevis responsable n'a pas la même taille que celui retrouvé ; des morsures profondes (féminines, Médecine) sur les cuisses ; l'analyse toxicologique révèle une MST et la séropositivité.
Eric Blanloeil, directeur des pompes funèbres, a tout remarqué mais s'en tient à un suicide maquillé par charité, refuse toute autre idée et cherche à faire enterrer le corps au plus vite.
Le docteur Biguet a signé le certificat sans se déplacer, pour rendre service à Blanloeil : négligence, rien de plus.`,
    [inScene(blanloeil), inScene(biguet)], false,
    [choice('enterrement', 'Les PJ arrivent-ils avant l\'enterrement ?', [
      ['Oui', 'Ils peuvent faire examiner le corps (Médecine) et relever toutes les incohérences.'],
      ['Non', 'Le corps est enterré : il faut une exhumation, ou se contenter des autres indices.'],
    ])]),
  scene('bandes', '5. Bandes vidéo et emplois du temps', 'Siège de la CEF – poste des gardiens de nuit, cellules',
    `Caméras à toutes les issues. Christophe Lemaire, gardien de nuit, dit naïvement avoir remis les bandes à Wasselynck. Wasselynck prétend les avoir prises à cause du suicide (découvert pourtant bien plus tard) ; confronté, il invoque la Providence, accepte de les rendre puis « découvre » qu'on les lui a volées. Elles sont dans son bréviaire creusé : on y voit Papin entrer en portant Fournier, puis les trois autres se faufiler ensemble.
Emplois du temps : en interrogeant les pensionnaires, on établit que Wasselynck, Papin, Larvols et Défois sont rentrés vers 6 h le matin du « suicide » ; les voisins levés pour matines les ont entendus.
Chronologie réelle (pour le MJ) : J-3 17 h, Défois confirme sa venue et celle de quatre collègues ; J-3 23 h, départ en civil dans une camionnette du Secours catholique, conduite par Papin, vers une ancienne usine électrique de Pantin (une dizaine de clients, dont Montane, plus Trixi et Gildas) ; J-2 2 h, Montane tue Fournier d'un coup de tournevis, Trixi renvoie les prêtres avec le corps et rançonne Montane ; 5 h 30, Papin remonte le corps (aidé par Lemaire) ; 6 h, Wasselynck prend les bandes ; 9 h, Larvols prévient Lalanne, qui propose le faux suicide ; 11 h, réunion chez Lalanne ; 12 h, Papin et Wasselynck mettent en scène le suicide ; 15 h, Isabelle Lemaire découvre le corps ; 17 h, les pompes funèbres l'emportent ; J-1 15 h, Défois fait envoyer la demande d'enquête à Arad.`,
    [inScene(clemaire), inScene(wasselynck)]),
  scene('temoins-chefs', '6. Témoignages : les dirigeants de la CEF', 'Siège de la CEF – bureaux des secrétariats',
    `${GRILLE}

Lalanne (complice du maquillage) :
1. Hypocrite, faussement coopératif, imbu de son rang.
2. Faussement choqué : on ne traite pas ainsi un homme de son rang.
3. Très réceptif ; n'avoue au pire que des négligences « par bonté d'âme », prêt à tous les compromis pour rester hors de cause.
4. Calme, déçu ; menaces floues mais répétées sur les conséquences pour leur carrière ; leur demande où est leur intérêt.
5. Sourit, leur répète qu'ils se mettent dans une situation très pénible, sans préciser.
6. Propose un arrangement à l'amiable sans rien reconnaître ; négocie leur silence contre des PA ou des services.

Hayet (innocent, ambitieux) :
1. Les prend de haut et met en doute leur professionnalisme.
2. Approuve et leur conseille d'être fermes avec tout le monde.
3. Rit ; menace de représailles. Négocie seulement si on lui fait comprendre que la conduite de Wasselynck, son subordonné, va rejaillir sur lui.
4. Accusé, il brandit l'Inquisition ; sinon il met ses moyens au service des PJ et accable Lalanne, sauf si celui-ci démissionne en sa faveur.
5. Seuls les aveux comptent pour lui : il offre ses moyens « d'interrogatoire ». Accusé, il fait venir des anges de Dominique enquêter sur les PJ pour outrage.
6. Ravi, il sonne l'hallali : allié de poids, mais il rend toute négociation avec les accusés difficile.

Larvols (complice, amant de Fournier) :
1. Affable, choqué, pleure et prie pour Fournier.
2. Se plie avec servilité à toutes les humiliations.
3. Cherche ce que savent les PJ ; laisse entendre qu'un tel scandale ne doit pas sortir ; lâche des bribes sur le meurtre selon ce qu'ils savent déjà.
4. Pareil.
5. Pareil, en plus paniqué : prêt à plaider coupable pour obtenir l'indulgence et faire tomber les autres.
6. Très tendu : dit tout contre l'immunité et lâche des informations importantes pour appâter.

Lebel (innocent) :
1. Professionnel et respectueux envers des immortels.
2. Courbe l'échine, mais les PJ baissent dans son estime.
3. Fait semblant de ne pas comprendre les avances.
4. Très tendu ; prouve son ignorance, prêt à tout pour être blanchi, jusqu'à s'accuser au début.
5. Panique et perd pied : prêt à n'importe quel témoignage pour éviter la damnation.
6. Impossible : il est innocent.

Ce que chacun peut offrir : voir les fiches. Lalanne n'a pas de garde du corps en dehors de Papin.`,
    [inScene(lalanne), inScene(hayet), inScene(larvols), inScene(lebel)]),
  scene('temoins-complices', '7. Témoignages : les complices et le personnel', 'Siège de la CEF – cellules, secrétariats, loge',
    `Même grille d'approches (1 décontractée → 6 accusation avec preuves).

Défois (complice, rongé par la culpabilité) :
1. Très disponible, veut que la vérité éclate.
2. Se soumet, prêche que tout le monde est coupable.
3. Grandes phrases sur la justice, refuse de transiger.
4. Refuse tout arrangement ; ne parle que s'il est sûr que tous les coupables tomberont avec lui.
5. Soulagé : il déballe tout.
6. Avoue tout et exige que tous tombent, sans arrangement.

Wasselynck (complice, inquisiteur) :
1. Cassant, met en doute la compétence des PJ : l'affaire est close.
2. Contre-attaque, se porte garant de la CEF, colère bien feinte.
3. Paranoïaque : ne lâche rien avant de savoir ce qu'ils savent, évoque des « hérétiques » à la CEF.
4. Dévoile certaines cartes (les bandes) ; offre un ou deux coupables, Papin d'abord, contre son immunité, voire un piège ; nie toute culpabilité ou se dit infiltré.
5. Joue le collègue enquêteur infiltré sur des hérétiques, en accord avec Lalanne ; ordonne aux PJ de ne pas gâcher son enquête.
6. Colère noire, reprend l'histoire de l'infiltré, prévient que l'affaire les dépasse, propose un témoignage arrangé de Lalanne. N'avoue jamais.

Papin (complice, garde du corps) :
1. Formalité ; discute entre collègues, surtout avec les PJ combattants.
2. Répond en soldat (« Colonel ! »), ment mal.
3. Ne comprend pas les allusions.
4. Laisse entendre que le repos du guerrier est permis et que ce n'est pas lui qui a versé le premier sang.
5. Se raidit, reconnaît les faits si tous plongent avec lui ; demande à voir ses complices, qu'il nomme.
6. Baisse la tête, se met aux arrêts, attend l'Inquisition et prie.

Christophe Lemaire (innocent) :
1. Très respectueux, raconte tout ce qu'il a vu sans malice.
2. Panique, bégaie, se contredit.
3. Trop naïf pour comprendre que l'Église pourrait être en faute.
4. Finit par se croire lui-même coupable et avoue tout ce qu'on lui reproche.
5. Transe mystique : se flagelle, prie à grands cris, propos incohérents.
6. Pareil.

Isabelle Lemaire (innocente) :
1. Très coopérative, mais ne sait presque rien.
2. Sanglote.
3. Ne comprend pas qu'on négocie la vérité ; de plus en plus choquée.
4. Craque, pleure, prie.
5. Hurle, doit être internée (retraite spirituelle dans un couvent des Vosges).
6. Impossible : elle est innocente.

Patricia Besset-Vazin (innocente) :
1. Joue la secrétaire importante.
2. Courbe l'échine en se plaignant du manque de respect.
3. Outrée, nie tout ; si on lui fait entrevoir qu'elle sera épargnée, elle détaille l'emploi du temps de Défois et ses visites de sites, puis règle tous ses comptes.
4. Charge son patron et ses compagnons de sortie ; d'après les rumeurs, plus de la moitié de la CEF serait coupable.
5. Prostrée, répète qu'elle est innocente ; ne sait pas mentir : l'emploi du temps de Défois et son insistance pour la demande d'enquête.
6. Impossible : elle est innocente.`,
    [inScene(defois), inScene(wasselynck), inScene(papin), inScene(clemaire), inScene(ilemaire), inScene(besset)]),
  scene('arad', '8. Arrangements et rapport à Arad', 'Notre-Dame – bureau d\'Arad',
    `Le vrai but n'est pas de trouver les coupables, mais de faire découvrir le trafic et de placer les PJ dans un jeu de pouvoirs : les prélats ont des archanges derrière eux et proposent des arrangements (voir les fiches). Les anges veulent des PA et de l'avancement, pas forcément la justice.
Choix cornélien : faire éclater la vérité et se mettre à dos la CEF et des archanges (Joseph surtout, si Wasselynck tombe), ou accepter des PA pour accuser un innocent (Lemaire), ne frapper qu'une partie des coupables (Papin) ou conclure au suicide.
Arad juge seul le résultat : il veut un dossier cohérent mené selon les règles. Suicide, faux coupable tremblant ou vérité, tout lui va si le rapport tient. S'il repère incohérences, approximations ou mensonges, il ouvre une enquête interne, qui peut s'éteindre vite ou amener des anges de Dominique à la recherche de ripoux.`,
    [inScene(arad)], false,
    [choice('conclusion', 'Que concluent les PJ dans leur rapport ?', [
      ['La vérité', 'Scandale : la CEF et certains archanges (Joseph si Wasselynck tombe, Didier lâche Lalanne, Ange lâche Larvols, Laurent fait arrêter ou tuer Papin) leur en veulent ; Hayet et Dominique deviennent des alliés.'],
      ['Un arrangement', 'Les prélats tiennent parole : PA, appuis, argent ; Arad est satisfait si le dossier est cohérent.'],
      ['Un innocent accusé ou le suicide', 'Arad classe l\'affaire si rien ne cloche ; sinon, enquête interne contre les PJ.'],
    ])]),
  scene('site', '9. La suite : sexybitches.vu', 'Internet – société SB Inc (boîte postale au Vanuatu)',
    `Quelle que soit la conclusion, les PJ devraient apprendre l'existence des soirées et vouloir enquêter. Officiellement, il faut demander à Arad d'ouvrir une enquête : une dizaine de formulaires électroniques et autant de fois les mêmes questions ; il refuse de payer les « frais ».
Le site est hébergé au Vanuatu, sans aucune obligation de renseignement ; les prestations extrêmes ne sont visibles que des « membres ». Pour le devenir, il faut le parrainage d'un membre : faire pression sur Montane ou un comploteur. Le parrain introduit, « Satan » envoie un mail (pseudo, mot de passe) qui ouvre la messagerie des membres et l'annonce des soirées.
Les comploteurs (sauf Papin) ont entendu Montane crier le nom de sa société pendant la soirée : ils le donnent contre une remise de peine.`,
    [], false,
    [choice('parrain', 'Qui parraine les PJ ?', [
      ['Montane', 'Il les inscrit et leur donne le lieu et l\'heure de la prochaine soirée.'],
      ['Un comploteur de la CEF', 'Inscription possible, mais le comploteur peut prévenir « Satan » s\'il se sent trahi.'],
      ['Personne', 'Il faut passer par le milieu ou les hommes de main pour remonter le réseau.'],
    ])]),
  scene('montane', '10. Montane Electronic', 'Pavillon près des Buttes-Chaumont (19e)',
    `Rendez-vous facile, à condition de forcer le barrage de la secrétaire. Montane, que Trixi fait chanter, craque vite face à des PJ un peu virils et pas tout à fait légaux : il propose 100 000 € pour qu'ils éliminent Trixi, en se justifiant par le sort des filles. Il n'ira jamais à la police. Il parraine volontiers les PJ (pseudo « Don Juan ») et donne le lieu et l'heure de la prochaine soirée.`,
    [inScene(montane)], false,
    [choice('contrat', 'Les PJ acceptent-ils l\'argent de Montane ?', [
      ['Oui', 'Ils deviennent les tueurs à gages d\'un meurtrier ; à Arad et à leur conscience d\'en juger.'],
      ['Non', 'Ils obtiennent tout de même le parrainage et la date de la soirée ; Montane reste à leur merci.'],
    ])]),
  scene('milieu', '11. Le milieu, les hommes de main et les hangars', 'Boulevards des Maréchaux, baraques de chantier, pavillons de banlieue',
    `Le milieu : par des contacts dans la police ou la justice, on apprend qu'une organisation menée par un certain « Satan », fou en fauteuil roulant, a pris le contrôle de la prostitution à Paris en quelques mois ; les bandes rivales ont été anéanties ou ralliées, avec des rumeurs de cannibalisme.
Les services : exploitation de filles vivantes sur les Maréchaux, gardées par de nombreux employés ; séances livrées à domicile ou à l'hôtel avec une fille zombie (qui sait se défendre) ; et les soirées réservées aux membres.
Les hommes de main sont le maillon faible : ils connaissent une ou deux planques, ont vu « Satan » et Trixi. Les caporaux ont le numéro de messagerie de Trixi : un faux appel peut l'attirer dans une planque et lui tendre une embuscade.
Les hangars : plusieurs pavillons de banlieue où les zombies sont stockées sous la garde de deux ou trois employés. Trixi y passe souvent, notamment pour remettre des escouades de morts-vivants à des démons récompensés par l'Enfer.`,
    [inScene(maquereaux, { qty: 3 }), inScene(zombies, { qty: 6 })], true,
    [choice('piege', 'Les PJ tendent-ils un piège à Trixi par sa messagerie ?', [
      ['Oui', 'Trixi vient régler le « problème » dans une planque : embuscade possible, mais il fuit s\'il sent des anges.'],
      ['Non', 'Il reste la soirée à thème pour atteindre Trixi et Gildas.'],
    ])]),
  scene('soiree', '12. C\'est lundi, c\'est ravioli !', 'Lieu de la prochaine soirée : maison en ruine, lotissement inachevé ou usine désaffectée',
    `Une ou deux soirées par mois, toutes d'une violence extrême, certaines avec mise à mort. Trixi choisit les lieux et y place deux ou trois employés une semaine avant. Le soir venu, une trentaine d'employés armés patrouillent discrètement autour : pas des soldats, faciles à surprendre et à neutraliser un par un, mais ils tirent dans le tas à la moindre alerte.
Déroulement (à résumer sobrement) : Gildas accueille les invités depuis son fauteuil, Trixi tient le rôle de majordome ; dix à trente clients, voyeurs ou participants ; des mises en scène à thème orchestrées par Gildas, au terme desquelles une fille est souvent tuée (pour devenir zombie) ou une zombie « décommissionnée ». Entrée : 1 000 € pour un voyeur, 10 000 € pour un participant.
Les PJ peuvent venir en invités (parrainage) ou en commando.
En cas d'incident, Trixi fait évacuer les clients et lance les zombies (qui feignent de fuir en appelant à l'aide) sur les intrus, qu'il prend pour la police ou des rivaux. Au moindre signe d'anges, il s'enfuit en ordonnant aux zombies de tuer tout le monde, Gildas et les employés compris, puis fait le tour de ses hangars pour mettre son cheptel à l'abri : c'est la fin de sexybitches.vu.`,
    [inScene(trixi), inScene(gildas), inScene(maquereaux, { qty: 6 }), inScene(zombies, { qty: 7 }), inScene(montane)], true,
    [choice('trixi', 'Trixi parvient-il à fuir ?', [
      ['Non', 'Le réseau est démantelé à la source ; les hangars restent à nettoyer.'],
      ['Oui', 'Il met ses zombies à l\'abri et reste une menace (PNJ récurrent possible) ; le site ferme.'],
    ])]),
  scene('epilogue', '13. Épilogue', 'Notre-Dame – bureau d\'Arad',
    `Les PA dépendent du caractère officiel ou non de la mission, et Arad est intraitable : même si les PJ ont démantelé tout un réseau de morts-vivants, il estime qu'ils n'avaient pas à prendre cette initiative sans enquête officielle. Les arrangements passés avec les prélats (PA, appuis, argent) et les rancunes des archanges s'appliquent selon les choix faits en scène 8.`,
    [inScene(arad)]),
];

const scenario = {
  id: 'ag8-coup-dans-le-chat',
  nom: 'Angelots en gelée – Un coup dans le chat… c\'est l\'amour en chapeau',
  resume: 'Scénario de Magna Veritas à Paris, réservé aux tables adultes et averties. Les anges des PJ héritent d\'une enquête de routine sur le « suicide » d\'Armand Fournier, bras droit du secrétaire général de la Conférence des évêques de France. En réalité, Fournier a été tué par accident lors d\'une soirée sordide organisée par un réseau de prostitution dont les filles sont des mortes-vivantes, tenu par Gildas Brunet, ex-trader devenu proxénète, et Trixi, démon d\'Hornet. Quatre prélats présents ont maquillé la mort avec l\'aval du secrétaire général. Enquête libre (cellule, logs informatiques, corps, bandes vidéo, interrogatoires gradués) puis choix entre vérité et arrangements, avant de remonter éventuellement jusqu\'au réseau pour le démanteler.',
  notes: `Source : ${REF}. Ton parodique, très cru et anticlérical dans le livre : la conversion résume sobrement les scènes sexuelles et violentes. À réserver à des joueurs avertis ; prévoir des limites claires avec la table.

Contexte : Gildas Brunet, trader licencié et ruiné, se fait briser les jambes par deux souteneurs roumains ; dans son délire, il tente une invocation à laquelle Hornet répond en envoyant Trixi. Plan d'Hornet : acheter à bas prix des jeunes femmes d'Europe de l'Est sans attaches, les tuer et les relever en zombies, les faire travailler via le site sexybitches.vu, puis fournir des escouades de morts-vivants aux démons. Le père Défois découvre le site, y entraîne des collègues (10 % de la CEF). Lors d'une soirée à Pantin, Nico Montane tue Fournier ; Défois, Larvols, Wasselynck et Papin ramènent le corps et, avec Lalanne, maquillent un suicide.

Chronologie : il y a 17 mois, Gildas licencié ; 14 mois, sa compagne le quitte ; 7 mois, jambes brisées par Nicolas et Tonino Balardio ; 5 mois et demi, « invocation » de Trixi ; 5 mois, premières filles zombifiées ; 4 mois et demi, ouverture du site ; 3 mois, première visite de Défois ; 2 mois, les Balardio dévorés par des zombies ; il y a deux jours, mort de Fournier ; hier, « découverte » du corps ; ce matin, Arad ouvre l'enquête. Détail heure par heure : scène 5.

Il n'y a pas de chronologie imposée pour l'enquête : tout dépend des PJ. Les scènes 2 à 7 peuvent se jouer dans n'importe quel ordre ; la grille des six approches d'interrogatoire et la réaction de chaque témoin figurent dans les scènes 6 et 7.

Récompenses : pas de barème chiffré. Arad accorde ou non des PA selon le caractère officiel de la mission et la cohérence du rapport ; les prélats peuvent offrir PA, appuis et argent en échange d'arrangements ; démanteler le réseau sans enquête officielle ne rapporte rien auprès d'Arad.

Fiches : seuls Papin, Trixi, les hommes de main et les zombies ont des talents de combat ; armes choisies dans la table des règles (signalé dans les fiches). Ch des humains reportée en Foi. Défense non donnée : niveau 1. Blanloeil et Biguet n'ont pas de caractéristiques (fiches minimales estimées). Le lexique du milieu (p. 115) n'est pas repris.`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [lalanne, hayet, larvols, lebel, defois, wasselynck, papin, clemaire, ilemaire, besset, blanloeil, biguet, montane, arad, gildas, trixi, maquereaux, zombies].map(asType);
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));
writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types');
