// Génère le fichier d'import « insmv-scenario » pour « The roof is on fire ! » (Fire and Ice, p. 103-112)
// usage : node gen-the-roof-is-on-fire.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Fire and Ice, « The roof is on fire ! », p. 103-112';
const L = (s) => R.parseLvl(String(s)); // « 2+ » → 5
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
let n = 0; const id = (p) => `fi6-${p}`;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [{ n: 'Coup de poing', att: 2, prec: 0, puis: -3, melee: true }], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});

// ---------------- PNJ ----------------
const julie = npc('julie', {
  nom: 'Julie Delahaye', source: 'Démon de Belial, grade 2 (infiltrée chez Crocell)', type: 'demon', car: car('3 2 3 4 4 4'), def: L(3),
  pp: 23, pfFix: 7, seuilsFix: seuils('5/10/15/20'),
  armes: [{ n: 'Revolver petit calibre', att: 2, prec: -2, puis: 3, melee: false }, { n: 'Coup de poing', att: 2, prec: 0, puis: -3, melee: true }],
  pouvoirs: pows('Immunité contre le feu, Jet de flammes 3, Incendie 3, Éclats de glace 3, Invisibilité 2, Non-détection 2, Protection de l\'âme, Régénération 2, Volonté supra-normale 3, Téléportation 2'),
  talents: 'Baratin 5, Séduction 5, Défense 3, James Bond girl 5',
  notes: 'Grande, mince, très jolie ; cheveux châtains à la garçonne, yeux bleus virant au vert. Look de petite catholique sage, maquillage un peu trop appuyé. Officiellement « capitaine du blizzard », agent de terrain de Crocell sans équipe, conseillère de l\'adjoint à la culture à la mairie.\nInfiltrée chez Crocell depuis cinq ans pour Belial ; très intelligente, manipulatrice et franchement psychopathe : elle a tué ses quatre camarades de vacances (Frimas, Sérac, Kalt, Inlandsis). Gère en sous-main la société Associates 88 pour Belial.\nAvertissement sans frais : tueuse psychopathe. Acculée, elle encaisse un ou deux coups puis se téléporte pour simuler sa mort.\nEstimations : le livre ne donne pas de talent de tir ; revolver (vu dans le prologue) à att 2 par défaut (son arme principale reste ses pouvoirs).',
});

const prokk = npc('prokk', {
  nom: 'Prôkk', source: 'Démon d\'Andromalius, grade 0', type: 'demon', car: car('1 2 5 5 2 2'), def: 2,
  pp: 9, pfFix: 6, seuilsFix: seuils('3/6/9/12'),
  pouvoirs: pows('Humanité 2, Lire les pensées 1, Télékinésie 1, Télépathie 1'),
  talents: 'Culture générale 3 (droit 5), Discussion 5, Baratin 4, Voir le Bien partout 6',
  notes: 'Allure d\'étudiant en droit modèle (veste de chasse brune, mocassins cirés, pantalon à pli), crâne rasé sous un chapeau pour cacher la repousse de ses cheveux bleu cobalt (avertissement sans frais). Fraîchement incarné, vrai serviteur d\'Andromalius tuyauté anonymement par le faux contact.\nNe devrait pas tenir plus d\'un tour face aux PJ. Défense non donnée : 2.',
});

const fx = npc('fx', {
  nom: 'Père François-Xavier de Mollebranche', source: 'Ange de Joseph, grade 1 (Terre Creuse)', type: 'ange', car: car('3 2 5 4 2 3+'), def: 2,
  pp: 15, pfFix: 7, seuilsFix: seuils('6/12/18/24'),
  armes: [{ n: 'Coup de poing', att: L(4), prec: 0, puis: -3, melee: true }],
  pouvoirs: pows('Torture 3, Détection du mensonge 2, Peur 2, Lire les pensées 2'),
  talents: 'Combat 4, Aisance sociale 3, Conspuer le complot judéo-bolchévico-maçonnique 5',
  notes: 'Curé quinquagénaire sec et austère, toujours en noir, issu d\'une vieille lignée noble très influente dans la région. Intégriste assumé, finance l\'extrême droite locale et la mairie. Membre de la Terre Creuse sans être officiellement renégat ; prêt à s\'allier à des sorciers et à des renégats.\nTrès paranoïaque (difficile à filer), peu intelligent mais extrêmement opiniâtre : se bat jusqu\'à la mort. Avertissement sans frais : paranoïaque.\nLundi soir : messe pour les anges de la région partageant ses idées (un Laurent, deux Daniel, un Walther). Mercredi soir : réunion locale de la Terre Creuse chez lui. Coffre-fort : rapports, comptes rendus d\'actions, factures d\'Associates 88.\nEstimations : arme non précisée, Combat 4 appliqué aux poings ; Défense non donnée : 2.',
});

const helmut = npc('helmut', {
  nom: 'Helmut', source: 'Sorcier (Terre Creuse)', type: 'humain', car: car('1 1 2 4 2 3'), def: 2,
  pfFix: 5, seuilsFix: seuils('2/4/6/8'),
  talents: 'Langue (français), Discussion 3, Médecine 4, Dressage 4, Ésotérisme de pacotille 5\nSorcellerie : Haute sorcellerie 3, Pentacle pour ange 4, Pentacle pour démon 4, Invocation d\'un ange 5, Invocation d\'un démon 5, Demande à un ange 3, Demande à un démon 4, Contrôle d\'un ange 3, Contrôle d\'un démon 4, Basse sorcellerie 3. Sorts annexes : Vrai nom, Protection.',
  notes: 'Gros bonhomme chauve, petites lunettes cerclées de fer, transpire beaucoup, accent bavarois pénible. Passions : chiens de combat, sorcellerie, avènement du IVe Reich.\nEn combat : lâche ses chiens (Sieg et Heil), tente un sort de protection puis fuit le plus loin possible.\nPas de type « sorcier » dans l\'application : fiche humaine, sorcellerie dans les talents.',
});

const dogNotes = 'Anges de Daniel passés à la Terre Creuse ; invoqués par Helmut pour échapper à la dissection de Joseph, ils n\'ont pu s\'incarner que dans ses deux rottweilers. Énormes molosses noirs aux mâchoires impressionnantes.';
const sieg = npc('sieg', {
  nom: 'Sieg', source: 'Clébard renégat de Daniel, grade 0', type: 'renegat_a', car: car('5 5 4 2 1 3'), def: L(5),
  pp: 9, pfFix: 7, seuilsFix: seuils('8/16/24/32'),
  armes: [{ n: 'Morsure', att: L(6), prec: -1, puis: 1, melee: true }],
  pouvoirs: pows('Décharge électrique 1, Peur 2, Armure corporelle 1'),
  talents: 'Corps à corps 6, Athlétisme 5, Défense 5, Aboyer comme un cinglé 5',
  notes: dogNotes + '\nAvertissement sans frais : yeux blancs. Hurle à la mort.',
});
const heil = npc('heil', {
  nom: 'Heil', source: 'Clébard renégat de Daniel, grade 0', type: 'renegat_a', car: car('5 5 4 2 1 3'), def: L(5),
  pp: 9, pfFix: 7, seuilsFix: seuils('8/16/24/32'),
  armes: [{ n: 'Morsure', att: L(6), prec: -1, puis: 1, melee: true }],
  pouvoirs: pows('Détection du danger 1, Déphasage 2, Jet d\'eau bénite 2'),
  talents: 'Corps à corps 6, Athlétisme 5, Défense 5, Chier dans la maison 5',
  notes: dogNotes + '\nAvertissement sans frais : colérique. Souille les tapis.',
});

// PNJ importants sans caractéristiques
const contact = npc('contact', {
  nom: 'Le « contact » (pète-sec de la fonderie)', source: 'Démon de Belial se faisant passer pour un agent d\'Andromalius', type: 'demon',
  notes: 'Trentenaire en costume et chemise noirs, cravate rouge, petites lunettes cerclées de fer ; antipathique et spartiate. Joue au chat et à la souris, pose les questions, ne répond à rien. Rapport quotidien exigé à 19 h.\nMonte toute l\'opération pour Belial : il veut des « aveux » filmés prouvant que Crocell complote. Fait surveiller les PJ, les tuyaute puis disparaît après la mission (jamais revu à la fonderie).\nPas de caractéristiques dans le livre : fiche minimale à compléter si les PJ le cherchent.',
});
const frozen = npc('frozen', {
  nom: '« Frozen »', source: 'Infiltré de Belial se prétendant démon de Crocell', type: 'demon',
  notes: 'Maigrichon aux cheveux longs, tee-shirt Miko. Se fait chahuter par trois démons de Belial (mise en scène), puis vient boire avec les PJ et les sonde maladroitement sur l\'affaire « Raymond gèle les camions », les humains à pouvoirs et les manigances de Crocell. Louche à souhait ; s\'éclipse vite.\nPas de caractéristiques dans le livre.',
});
const voyous = npc('voyous-belial', {
  nom: 'Démons de Belial (gros bras de chez Régis)', source: 'Complices de Frozen', type: 'demon', qty: 3,
  notes: 'Trois types sortis d\'un mauvais film de mafieux, menacent Frozen, Crocell et ses démons. Jésus les menace de les mettre dehors : pas de bagarre possible à Chez Régis (lieu « off limit »).\nPas de caractéristiques dans le livre : fiche minimale.',
});
const gaspard = npc('gaspard', {
  nom: 'Gaspard Tullier', source: 'Petit proxénète local (fausse piste)', type: 'humain',
  notes: 'Figure sur la liste « d\'humains à pouvoirs de froid » laissée par Julie dans la corbeille de son ordinateur. Petit maquereau minable : menacé, il se met à table aussitôt et dénonce Julie.\nPas de caractéristiques dans le livre.',
});
const terreCreuse = npc('terre-creuse', {
  nom: 'Membres humains de la Terre Creuse', source: 'Employés de mairie, commissaire, cousin du maire', type: 'humain', qty: 4,
  notes: 'Deux employés administratifs de la mairie, un commissaire de police, un cousin du maire. Ignorent tout des anges et démons ; croient appartenir à une société secrète unifiant l\'extrême droite mondiale. Parlent facilement sous la pression (ou les coups).\nPas de caractéristiques dans le livre : fiche humaine moyenne.',
});
const gilbert = npc('gilbert', {
  nom: 'Gilbert', source: 'Démon de Morax du Centre de Tri', type: 'demon',
  notes: 'Paniqué, appelle les PJ pour parler de Monsieur Fabien (qu\'il trouve « différent »), puis leur pose un lapin. Le lendemain : prétend une panne d\'oreiller et une fausse alerte (il croyait que des anges voulaient éliminer Monsieur Fabien) et refuse d\'en dire plus.\nPas de caractéristiques dans ces pages.',
});
const aurelie = npc('aurelie', {
  nom: 'Aurélie', source: 'Centre de Tri', type: 'demon',
  notes: 'Coupe court aux explications de Gilbert et transmet la convocation « des services d\'Andromalius ». A été contactée chez elle par un démon se disant d\'Andromalius (en réalité un ami du Daemonis Maleficum, serviteur de Belial ; elle le sait et se taira).\nPas de caractéristiques dans ces pages.',
});
const fabien = npc('fabien', {
  nom: 'Monsieur Fabien', source: 'Responsable du Centre de Tri', type: 'demon',
  notes: 'Ignore tout de l\'opération ; tente de joindre les PJ à plusieurs reprises. S\'ils lui répondent (en désobéissant), il enquête de son côté — à condition qu\'ils lui fassent encore confiance. Après coup, peut confirmer qu\'aucune mission officielle d\'Andromalius ne leur a été adressée.\nPas de caractéristiques dans ces pages.',
});

// Le bestiaire joint (types réutilisables) : mêmes fiches, sans quantité
const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });

// ---------------- Scènes ----------------
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  scene('prologue', '0. Prologue : la fin des vacances', 'Station de ski en Savoie – une semaine plus tôt (texte d\'ambiance)',
    `À lire ou résumer : depuis des siècles, quatre démons de Crocell (Frimas, grade 3 et supérieur direct, Sérac, Kalt et Inlandsis) se retrouvent chaque hiver en Savoie. Cette année, Frimas amène une jeune fille rencontrée en mission dont il est amoureux. Inlandsis s'en méfie, la provoque : la fille la frappe avec une force surhumaine, carbonise les trois démons d'un geste, puis l'achève d'une balle en lui annonçant que « c'est la guerre ».
C'est Julie Delahaye. Les PJ n'en savent rien ; le MJ s'en servira pour la mise en scène et la paranoïa.

Ton du scénario : les forces du Mal sont un nid de crabes ; ambiance oppressante, personne n'est digne de confiance.`),
  scene('regis', '1. Mon ami Monsieur Fabien – Chez Régis', 'Chez Régis, le bar de Jésus – le soir',
    `Un soir, Gilbert, paniqué, appelle un PJ : rendez-vous dans une heure chez Régis pour parler de Monsieur Fabien, qu'il trouve « différent ». Il insiste mais refuse d'en dire plus au téléphone.
Rappel : Chez Régis est le bar tenu par Jésus, qui apparaît n'importe où quand on réclame une bière fraîche ; on ne peut pas s'y battre.

Ambiance : une douzaine d'anges et de démons, concours de slam d'un démon de Morax désespéré par le manque de candidats (pousser les PJ sur scène). Gilbert ne vient pas et ne répond plus. Un grand blond ténébreux (un ange) déclame un texte mystique.
Frozen, voisin de table, se fait chahuter par trois démons de Belial qui menacent Crocell et ses démons ; Jésus menace de les jeter dehors. Frozen vient boire avec les PJ, parle de Belial qui prépare une croisade contre le prince du froid, puis embraye lourdement sur l'affaire « Raymond gèle les camions », les humains à pouvoirs, les secrets de Crocell.
Vérité : Frozen est un infiltré de Belial, toute l'altercation est une mise en scène pour le rendre crédible. Le faire paraître louche. Il prétexte un rendez-vous urgent et s'éclipse. Atmosphère morbide.`,
    [inScene(gilbert), inScene(frozen), inScene(voyous)], false,
    [choice('frozen', 'Que lâchent les PJ à Frozen ?', [
      ['Ils parlent de Raymond et des humains à pouvoirs', 'Belial dispose de leurs confidences : l\'existence des Flocons de sang lui est confirmée.'],
      ['Ils restent muets ou le démasquent', 'Frozen file au plus vite ; les PJ ont un premier indice que quelqu\'un s\'intéresse à eux.'],
    ])]),
  scene('cdt', '2. Back to le CdT (air connu)', 'Centre de Tri, puis fonderie de la banlieue nord – lendemain matin et midi',
    `Au CdT (de leur propre chef ou convoqués par Aurélie à 10 h), Gilbert invoque une panne d'oreiller et affirme que c'était une fausse alerte : il croyait les anges décidés à éliminer Monsieur Fabien après l'affaire précédente. Son histoire ne tient pas debout et il refuse d'en parler. Aurélie interrompt : les PJ sont convoqués d'urgence par « les services d'Andromalius » à midi, dans une aciérie de la banlieue nord ; demander Raoul de la part de Dédé.

Fonderie dickensienne : Raoul, contremaître, les mène entre les bacs de métal en fusion à un local technique miteux. Une demi-heure d'attente, puis arrive le « contact » (complet noir, cravate rouge), qui fait flasher son aura, pose les questions et n'en accepte aucune.
Mission : enveloppe kraft avec la photo de Julie Delahaye, « capitaine du blizzard ». Elle est soupçonnée d'avoir tué son supérieur (Frimas, grade 3 de Crocell) et trois autres démons pendant leurs vacances, sans autre preuve que sa survie.
• Phase 1 : enquêter discrètement sur ses activités et sa déviance éventuelle.
• Phase 2 : gagner sa confiance en se faisant passer pour des alliés, lui faire avouer meurtres et projets subversifs, preuve matérielle (vidéo idéale).
• Sécurité absolue : aucun contact avec leurs relations habituelles ni avec les forces du Mal locales.
• Billets d'avion pour Avignon, numéro de téléphone (rapport quotidien à 19 h), adresse et clés d'une villa.

Vérité (« Où est l'arnaque ? ») : le contact sert Belial, et Julie aussi. Belial veut faire croire qu'elle a éliminé des démons intègres prêts à dénoncer Crocell et ses Flocons de sang, et qu'elle est l'exécutrice d'un Crocell allié à des anges de la Terre Creuse : prétexte à sa guerre contre son frère. Le rapport sur Raymond a fuité vers un démon de Belial. Belial sous-estime le réseau de Crocell. Les PJ sont observés en permanence.
Un PJ de Crocell devrait sentir le piège : voir le cadre de fin de partie sur la loyauté (Belial ou Crocell).`,
    [inScene(gilbert), inScene(aurelie), inScene(contact)], false,
    [choice('fabien', 'Monsieur Fabien appelle : que font les PJ ?', [
      ['Ils respectent la consigne et ne répondent pas', 'Personne ne vérifie la mission ; le piège se referme normalement.'],
      ['Ils répondent malgré l\'interdiction', 'Si les PJ ont encore sa confiance, Monsieur Fabien enquête de son côté : il découvrira qu\'aucune mission officielle n\'existe. Désobéissance que le contact (qui les surveille) peut remarquer.'],
    ])]),
  scene('villa', '3. Stalag-en-Provence : la villa', 'Ville provençale à municipalité d\'extrême droite (près d\'Avignon) – villa des forces du Mal',
    `La ville : maire d'extrême droite réélu, programme municipal à l'avenant ; cité fondée par une légion romaine, théâtre antique avec statue d'Auguste, arc de triomphe, festival d'art théâtral déclinant depuis le virage à droite. Pas de troisième force à craindre ici.

La villa, à quelques kilomètres : piscine, alarme (code 666), tout le confort. Sur le miroir du salon, une enveloppe : clé et indications pour une porte dérobée sous l'escalier menant à un réduit derrière la glace sans tain (place pour caméra sur trépied et micro). Les PJ devraient se croire bien servis.
Piège : toute la villa est truffée de caméras et micros intégrés dans la construction. Pour les détecter, il faut les chercher explicitement et réussir un test de Perception incroyable (une seule tentative par personnage).
Sur la table du salon : quelques milliers d'euros en petites coupures et un dossier sur Julie (adresse, travail à la mairie, affectation officielle d'agent de terrain sans équipe, adresse de son supérieur).

Maison de Frimas (Jacob Stern dans le civil) : grande bâtisse impersonnelle mais de bon goût ; penser à couper l'alarme, sinon des vigiles nerveux de la gâchette débarquent. Aucun document de travail. Personne n'a remarqué sa disparition (Crocell est occupé à rattraper ses Flocons de sang).`,
    [], false,
    [choice('frimas', 'Les PJ visitent la maison de Frimas : l\'alarme ?', [
      ['Ils la neutralisent', 'Visite tranquille : rien d\'exploitable, personne ne s\'est inquiété de Frimas.'],
      ['Ils la déclenchent', 'Une équipe de vigiles armés et nerveux arrive : fuite ou affrontement discret (fiches de vigiles à improviser).'],
    ])]),
  scene('enquete', '4. La jeune fille et l\'Abwehr : enquête', 'Mairie, presbytère de FX, siège d\'A88 à Marseille, villa de « Marcel Dumont » – quelques jours',
    `Julie : conseillère de l'adjoint à la culture, jugée efficace et charmante ; prépare un festival sur l'identité romaine et traditionnelle de la ville, placé sous le patronage du Vatican pour plaire à l'électorat catholique.
Elle fréquente le père François-Xavier de Mollebranche, curé intégriste de vieille noblesse : en réalité ange de Joseph lié à la Terre Creuse. Facile à renseigner (prosélyte, défenseur de « l'ordre moral et de la race blanche », finance associations et mairie). Très paranoïaque s'ils le filent.
• Lundi soir : messe angélique chez lui pour un ange de Laurent, deux de Daniel, un de Walther (danger si les PJ se font repérer).
• Mercredi soir : réunion locale de la Terre Creuse : Julie, Helmut (sorcier) et ses deux chiens renégats, deux employés de mairie, un commissaire, un cousin du maire.
Les humains, interrogés, avouent vite : société secrète voulant unir l'extrême droite mondiale. FX garde dans un coffre rapports, comptes rendus (ratonnades, collecte de fonds, lobbying anti-mosquée) et factures d'Associates 88.

Associates 88 (A88) : officine de « conseil en sécurité » très à droite. Siège fictif dans un centre de domiciliation à Marseille ; un commercial mercenaire fait signer les contrats. Le PDG « Marcel Dumont » n'existe pas ; A88 paie le loyer d'un studio voisin de la villa des PJ. Un cambriolage révèle que A88 appartient à Hyperborea Financing (structure financière de la Terre Creuse) et les devis liés aux factures de FX (audit d'une pétrochimie du neveu d'un élu, audit de la ville payé par FX, diagnostics privés).
C'est Julie qui gère A88 pour Belial ; on peut la voir y venir. Elle y a semé des pistes dans la corbeille de l'ordinateur : dossiers sur les quatre démons de Crocell tués, liste d'humains de la région dotés de pouvoirs de froid (dont Gaspard Tullier en ville), et un vieux mail où elle annonce vouloir éliminer les « nuisibles » fidèles à un combat stupide avant de lancer la grande offensive contre « B. ». (Belial a réellement fourni ces pouvoirs à ces humains, après une visite où Julie s'est présentée comme servante du prince du froid.)
Gaspard, menacé, se met à table et dénonce Julie.

Fin de phase : enquête trop facile ; le contact félicite les PJ, promet de grandes récompenses et ordonne la phase 2.`,
    [inScene(julie), inScene(fx), inScene(helmut), inScene(terreCreuse), inScene(gaspard)], false,
    [choice('piste', 'Quelle piste les PJ suivent-ils en priorité ?', [
      ['Filer FX et ses réunions', 'Découverte de la Terre Creuse ; risque de se faire repérer par FX (paranoïaque) ou les anges du lundi.'],
      ['Cambrioler Associates 88', 'Lien avec Hyperborea Financing et les pistes « plantées » par Julie (liste des humains à pouvoirs de froid, mail sur « B. »).'],
      ['Faire parler Gaspard Tullier ou un humain de la Terre Creuse', 'Aveux rapides : Gaspard dénonce Julie ; les humains décrivent la société secrète et le coffre de FX.'],
    ])]),
  scene('confiance', '5. Frankreich über alles : gagner la confiance de Julie', 'Ville et villa des PJ',
    `Partie très ouverte : improviser selon les initiatives des joueurs. Julie se montre méfiante, puis teste les PJ en les faisant parler de Crocell, de Belial et des forces du Mal.
Quand elle semble prête à céder, le contact « aide » : il tuyaute anonymement Prôkk, vrai démon d'Andromalius fraîchement incarné, censé n'être qu'un familier. Julie vient se réfugier chez les PJ, avoue avoir des choses graves à se reprocher qui menacent Crocell ; elle s'est laissée filer exprès. Prôkk déboule dans le salon en accusant tout le monde de trahison : les PJ doivent le faire disparaître pour gagner la confiance de Julie (il ne tient guère plus d'un tour).

Aveux de Julie (devant les caméras de la villa) : Crocell veut renverser Belial, a levé une armée mondiale d'humains à pouvoirs et attend son heure ; elle s'est alliée aux anges d'une organisation secrète fasciste interdite par le Bien, que Crocell noyaute pour asseoir sa suprématie en Enfer. Elle propose de leur présenter ses amis le soir même, vers 20 h.`,
    [inScene(julie), inScene(prokk)], true,
    [choice('prokk', 'Que font les PJ de Prôkk ?', [
      ['Ils l\'éliminent', 'Julie leur fait confiance et passe aux aveux ; un vrai serviteur d\'Andromalius a disparu (conséquences possibles plus tard).'],
      ['Ils l\'épargnent ou le protègent', 'Julie se méfie, la phase 2 se complique ; Prôkk peut témoigner plus tard auprès d\'Andromalius.'],
    ])]),
  scene('soiree', '6. La soirée chez les PJ', 'Villa des PJ – vers 20 h',
    `Ordre du contact : faire parler les invités au maximum devant les caméras, puis éliminer tout le monde de façon à devoir utiliser leurs pouvoirs à l'image.
Invités : FX, Helmut et ses deux chiens (Sieg hurle à la mort, Heil souille les tapis). FX se bat jusqu'à la mort ; Helmut lâche les chiens, lance un sort de protection et fuit.
Quand le combat s'engage, Julie simule sa mort grâce à Téléportation et s'éclipse. Elle est très dangereuse : elle peut prendre trop de plaisir à tuer et aller confier à FX l'existence des PJ ; acculée, elle encaisse un ou deux coups puis se téléporte.`,
    [inScene(julie), inScene(fx), inScene(helmut), inScene(sieg), inScene(heil)], true,
    [choice('soiree', 'Comment tourne la soirée ?', [
      ['Les PJ exécutent les ordres et tuent les invités', 'Vidéo complète : pouvoirs démoniaques, ange et renégats tués à l\'écran. Julie « meurt » (téléportée).'],
      ['Les PJ refusent ou flairent le piège', 'Pas de vidéo exploitable ; le contact menace et Julie disparaît quand même. Monsieur Fabien peut devenir un allié.'],
    ])]),
  scene('epilogue', '7. Épilogue : retour à Paris', 'Aéroport d\'Avignon, puis Paris',
    `Les PJ déposent la vidéo dans une consigne de l'aéroport d'Avignon. Le contact les félicite au téléphone et promet des récompenses qui ne viendront jamais (mission non officielle).
Introuvable ensuite : jamais revenu à la fonderie, inconnu de tous. Monsieur Fabien, sollicité, vérifie : aucune mission d'Andromalius ne leur a été adressée. Aurélie ne dira rien (elle sait qu'il s'agit d'un serviteur de Belial, ami du Daemonis Maleficum).
Les PJ doivent se sentir floués… à raison : ils viennent de fournir à Belial ses preuves contre Crocell. Voir le cadre de fin de partie sur la gestion des PJ fidèles à Belial ou à Crocell.`,
    [inScene(fabien)]),
];

const scenario = {
  id: 'fire-and-ice-6-the-roof-is-on-fire',
  nom: 'Fire and Ice (scénario 6) – The roof is on fire !',
  resume: `De bello civili (INS). Après un étrange rendez-vous manqué avec Gilbert chez Régis, les PJ sont envoyés par un prétendu agent d'Andromalius en Provence pour enquêter sur Julie Delahaye, démon de Crocell soupçonnée d'avoir tué quatre collègues, puis obtenir ses aveux filmés. En réalité, le contact et Julie servent Belial : les PJ fabriquent sans le savoir la preuve d'un complot de Crocell avec les anges fascistes de la Terre Creuse, prétexte à la guerre entre les deux princes.`,
  notes: `Source : ${REF}. Scénario paranoïaque : personne n'est fiable.
Déroulement : prologue (meurtres en Savoie) → Chez Régis (Gilbert absent, Frozen) → CdT puis fonderie (mission) → villa piégée en Provence → enquête sur Julie, FX, la Terre Creuse et Associates 88 → gagner la confiance de Julie (élimination de Prôkk) → soirée-massacre filmée → retour à Paris et désillusion.

Récompenses : le livre n'en précise pas dans ces pages (les récompenses promises par le contact ne viennent jamais) ; voir le cadre de fin de partie sur la loyauté envers Belial ou Crocell.

Fiches adaptées du livre : caractéristiques en niveaux INS/MV (Ch de Helmut reporté en Foi). Helmut, sorcier, est une fiche humaine (pas de type sorcier). Sieg et Heil : type renégat angélique. PNJ sans caractéristiques (contact, Frozen, démons de Belial, Gaspard, humains de la Terre Creuse, Gilbert, Aurélie, Monsieur Fabien) : fiches minimales à compléter.`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [julie, prokk, fx, helmut, sieg, heil, contact, frozen, voyous, gaspard, terreCreuse, gilbert, aurelie, fabien].map(asType);

// Contrôle : pouvoirs inconnus des règles
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));

writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types');
