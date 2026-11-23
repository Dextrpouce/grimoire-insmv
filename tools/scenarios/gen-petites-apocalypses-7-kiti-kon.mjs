// Génère le fichier d'import « insmv-scenario » pour « L'épopée du Kiti-Kon » (Les Petites Apocalypses, ch. 12, p. 109-111)
// usage : node gen-petites-apocalypses-7-kiti-kon.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Les Petites Apocalypses, ch. 12 « L\'épopée du Kiti-Kon » (mini-scénario), p. 109-111';
const L = (s) => R.parseLvl(String(s));
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
const ARMES = new Map(R.ARMES.flatMap(([g, l]) => l.map((x) => [x[0], { prec: x[1], puis: x[2], melee: R.MELEE_GROUPS.includes(g) }])));
// arme de la table des règles : nom affiché, nom dans la table, niveau du talent
const arme = (n, table, lvl) => { const w = ARMES.get(table); if (!w) throw new Error('arme inconnue : ' + table); return { n, att: L(lvl), ...w }; };
// attaque au format des livres « seuil/RU+X/M+Y »
const livre = (n, x, y, melee = true) => ({ n, att: x * 2, prec: 0, puis: y, melee });
const poing = (lvl) => arme('Coup de poing', 'Coup de poing', lvl);
const P = 'pa7-'; let n = 0; const id = (k) => P + k;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [poing(1)], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});
const MINI = 'Pas de caractéristiques dans le livre : fiche minimale (valeurs humaines moyennes par défaut).';
const ESTIME = 'Le mini-scénario ne chiffre aucun adversaire : fiche entièrement estimée pour pouvoir lancer le combat.';

// ---------------- Alliés ----------------
const tapelku = npc('tapelku', {
  nom: 'Professeur Aimé Tapelku', source: 'Héros païen viking, chef de l\'expédition', type: 'paien', car: car('3 2 3 3 3 4'), def: 2,
  armes: [poing(2)],
  talents: 'Navigation 4, Savoir (histoire viking) 5, Métier : charpentier de marine 3, Discussion 3 (valeurs estimées)',
  notes: `Grand, la cinquantaine, crâne dégarni et couronne de cheveux blancs, yeux bleus, sourire franc. D'origine scandinave, installé en France après une quinzaine d'années aux États-Unis ; connu pour ses reconstitutions vikings. Courageux, digne, dévoué au panthéon viking, engagé dans l'écologie et les droits de l'homme. Adore naviguer.
Supervise la construction et commande la traversée. Si l'échec humiliant menace, il préfère saborder lui-même le bateau et mettre en scène un naufrage héroïque devant les caméras.
${MINI} Caractéristiques, talents et Défense estimés.`,
});
const njord = npc('njord', {
  nom: 'Njord', source: 'Dieu viking du voyage, commanditaire', type: 'paien', car: car('4 3 3 4 4 5'),
  notes: `Veut recharger Asgard en énergie onirique par un exploit médiatique : un langskip traditionnel qui relie Rouen à Tahiti. Engage la DTC pour protéger le bateau et son équipage.
Ne participe pas à l'action. ${MINI} Valeurs indicatives.`,
});
const hercule = npc('hercule', {
  nom: 'Hercule', source: 'Patron de la DTC, héros païen', type: 'paien', car: car('4 3 2 2 2 3'),
  notes: `Accepte le contrat de Njord et choisit les PJ. Peut affecter d'autres agents de la DTC à la surveillance du chantier pour garder les PJ pour les moments chauds.
Ses caractéristiques sont au ch. 4 (p. 21) ; non reprises ici, il ne combat pas dans ce scénario. Valeurs de la fiche indicatives.`,
});
const etudiant = npc('etudiant', {
  nom: 'Étudiant d\'équipage', source: 'Étudiant en histoire, bâtisseur puis rameur', qty: 4, car: car('2 2 2 2 2 2'),
  talents: 'Savoir (histoire) 2, Navigation 1, Athlétisme 1 (valeurs estimées)',
  notes: `Jeunes gens choisis par Tapelku : dynamiques, compétents, sympathisants de la cause viking. Certains restent à bord pour la traversée.
Option : l'un d'eux est un traître ou simplement insupportable (voir la scène des aléas de la mer).
${MINI}`,
});

// ---------------- Adversaires (tous estimés) ----------------
const saboteur = npc('saboteur', {
  nom: 'Démon saboteur', source: 'Démon de grade 1 qui s\'amuse (chantier de Rouen)', type: 'demon', qty: 2, car: car('5+ 4 3 2 2 2'), def: L('6+'),
  pp: 15, pfFix: 7, seuilsFix: seuils('7/15/22/30'),
  armes: [livre('Griffes', 6, 9)],
  pouvoirs: pows('Armure corporelle 2, Forme de combat 2, Membre exotique : griffes'),
  talents: 'Corps à corps 7+, Discrétion 3',
  notes: `Auteurs des deux sabotages (incendie de la réserve de bois, puis tentative de raser le hangar presque terminé). Fuient dès qu'ils sont repérés : prétexte à une poursuite nocturne dans le centre de Rouen.
${ESTIME} Profil repris du « démon bourrin, grade 1 » (On Ferme, p. 116, déjà au bestiaire) ; prince non précisé.`,
});
const serpent = npc('serpent', {
  nom: 'Serpent de mer', source: 'Démon de Velphar, grade 2, transformé', type: 'demon', car: car('7 4 3 3 2 3'), def: L(6),
  pp: 25, pfFix: 10, seuilsFix: seuils('10/20/30/40'), prot: 4,
  armes: [livre('Morsure', 8, 10), livre('Coup de queue (renverse les rameurs)', 7, 8)],
  pouvoirs: pows('Transformation 4, Armure corporelle 4, Membre exotique : crocs'),
  talents: 'Corps à corps 8, Natation 8, Discrétion 4',
  notes: `Agacé par le regain d'intérêt pour les vikings : un Asgard en déclin arrangeait bien les démons. Attaque le drakkar en pleine mer ; l'assaut doit être terrible, voire faire chavirer le bateau.
${ESTIME} Base « démon bourrin, grade 2 » (On Ferme, p. 116) renforcée : Force 7, seuils plus hauts et écailles (protection 4) pour une forme de serpent de mer.`,
});
const pirate = npc('pirate', {
  nom: 'Pirate des Caraïbes', source: 'Pirate de roman, déjanté et désorganisé', qty: 6, car: car('3 2 2 1 1 2'), def: 2,
  pfFix: 6, seuilsFix: seuils('4/9/13/18'),
  armes: [arme('Sabre ébréché', 'Épée longue', 2), arme('Pistolet', 'Revolver petit calibre', 2)],
  talents: 'Combat 2, Tir 2, Navigation 2, Intimidation 1, Ricaner bêtement 3',
  notes: `Sabre usé entre les dents, portable à la ceinture : à jouer dans le cliché. La bagarre, filmée, ravit le public et dope l'énergie onirique.
${ESTIME} Seuils et PF repris des « gros bras » (Petites Apocalypses, ch. 6, déjà au bestiaire) ; armes à niveau 1.`,
});
const gardeCote = npc('garde-cote', {
  nom: 'Garde-côte américain', source: 'Agent des US Coast Guard, manipulé par Dominique', qty: 3, car: car('3 2 2 2 2 2'),
  armes: [arme('Pistolet de service', 'Revolver gros calibre', 2)],
  talents: 'Tir 2, Administration 3, Poser des questions idiotes 4',
  notes: `Arraisonnent le drakkar dans les eaux des États-Unis et infligent un interrogatoire interminable. Ne cherchent pas le combat : frapper un garde-côte ferait un scandale qui couperait court à l'expédition, exactement ce que veut Dominique.
${MINI} Tir et arme estimés.`,
});

const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  scene('commande', '1. Le contrat de Njord', 'Locaux de la DTC, puis Rouen',
    `Njord passe commande à la DTC : protéger le Kiti-Kon et son équipage, de la construction à l'arrivée. Hercule confie la mission aux PJ. Objectif simple à énoncer : que le bateau arrive à Tahiti avec tout le monde en un seul morceau.
Présenter Aimé Tapelku, qui supervise la construction et commandera la traversée ; les PJ rejoignent l'équipage.
Le bateau : langskip en bois goudronné d'une quinzaine de mètres sur quatre, 24 rames, grande voile carrée. Coque renforcée pour la haute mer ; boîte noire et caméras reliées à des relais radio (l'équipage n'y a pas accès), mais ni radio ni électronique de navigation.
Médias présents dès le début ; une équipe télé tourne un documentaire de bout en bout.`,
    [inScene(njord), inScene(hercule), inScene(tapelku)]),
  scene('chantier', '2. Le chantier de Rouen', 'Hangar de construction, Rouen (plusieurs mois)',
    `Artisans venus de Norvège, du Danemark, du Japon et du Canada, étudiants en histoire triés par Tapelku. Les PJ peuvent sympathiser avec l'équipage et repérer les personnalités (dont un éventuel futur traître).
Premier sabotage, au bout d'une semaine : des démons qui s'amusent mettent le feu à la réserve de bois. Selon l'organisation choisie, les PJ arrivent après coup (enquête sur les traces) ou sont là pour éteindre et chasser les fauteurs de trouble.
Rouen, capitale historique des vikings de France : profiter de la ville (vieux centre piéton, monuments).`,
    [inScene(tapelku), inScene(etudiant), inScene(saboteur)], false,
    [choice('surveillance', 'Qui surveille le chantier ?', [
      ['Les PJ eux-mêmes', 'Ils affrontent les saboteurs dès l\'incendie de la réserve de bois.'],
      ['D\'autres agents de la DTC', 'Hercule garde les PJ pour d\'autres missions en parallèle ; ils sont rappelés pour la seconde tentative.'],
    ])]),
  scene('sabotage', '3. Second sabotage et poursuite nocturne', 'Hangar presque achevé, puis rues de Rouen la nuit',
    `Vers la fin de la construction, les démons reviennent pour détruire purement et simplement le hangar et le bateau quasi terminé. Idéalement les PJ sont sur place : bagarre, puis course-poursuite dans le centre de Rouen, désert la nuit (personne pour gêner).
Si les PJ échouent, le chantier prend du retard et la presse s'en mêle ; le projet reste viable.`,
    [inScene(saboteur, { qty: 3 })], true),
  scene('serpent', '4. Le serpent de mer', 'Plein océan Atlantique',
    `Une fois en mer, un démon de Velphar sous forme de serpent de mer attaque le drakkar. Le plan de Njord marche trop bien à son goût : le public suit la vie à bord et l'énergie onirique remonte vers Asgard.
L'attaque doit être spectaculaire : rameurs renversés, rames brisées, coque menacée. Protéger Tapelku et les étudiants autant que le bateau.
Question médiatique : un monstre marin à l'écran, ça ne passe pas inaperçu. Décider si les caméras enregistrent tout, si l'image est inexploitable (embruns, roulis), ou si elles sont neutralisées (par le démon ou par les PJ).`,
    [inScene(serpent)], true,
    [choice('cameras', 'Qu\'enregistrent les caméras pendant l\'attaque ?', [
      ['Tout', 'Images sensationnelles : énorme audience, mais questions gênantes et attention de tous les camps.'],
      ['Des images floues', 'Rumeurs et débats sans preuve ; la légende du Kiti-Kon grandit.'],
      ['Rien (caméras neutralisées)', 'Discrétion préservée, mais une coupure d\'images suspecte à expliquer aux médias.'],
    ])]),
  scene('garde-cotes', '5. Arraisonnés par les gardes-côtes', 'Eaux territoriales des États-Unis',
    `Dominique, agacé par tout ce tapage, veut faire échouer l'expédition sans gloire. Il manipule des gardes-côtes américains qui arraisonnent le drakkar et soumettent Tapelku, les PJ et les étudiants à un interrogatoire long et absurde.
Questions possibles (à pousser plus loin dans l'absurde) : substances illicites à bord ? but de la visite ? animaux ? vaccins à jour ? hygiène dentaire ? fréquence de changement de chaussettes ? Coca ou Pepsi ? interdiction (imaginaire) des vêtements orange sur un bateau dans les eaux américaines ? Examen médical en prime.
Issues au choix du MJ : escale forcée le temps des vérifications, passager déclaré porteur d'une maladie indésirable, cannabis trouvé sur un étudiant ou un PJ… Les PJ doivent combiner diplomatie et initiative pour repartir. Un échec ici est le pire : l'expédition tombe vite dans l'oubli.`,
    [inScene(gardeCote), inScene(tapelku)], false,
    [choice('issue', 'Comment le Kiti-Kon se sort-il de l\'arraisonnement ?', [
      ['Diplomatie ou astuce', 'Le drakkar repart, avec un peu de retard et une anecdote de plus pour le documentaire.'],
      ['Escale forcée', 'Retard important et vérifications ; nouvelle occasion pour Dominique de compliquer les choses.'],
      ['Expédition arrêtée', 'Échec sans gloire : Tapelku préférera peut-être un sabordage spectaculaire (voir conclusion).'],
    ])]),
  scene('pirates', '6. Pirates des Caraïbes', 'Mer des Caraïbes',
    `À partir des Caraïbes, des pirates attaquent le drakkar. Les jouer en pirates de roman : ricanants, désorganisés, sabre entre les dents et portable à la ceinture.
Bagarre héroïque et filmée contre des méchants caricaturaux : exactement ce qu'attend le public. Elle devrait bien finir, les PJ ne sont pas venus les mains vides.`,
    [inScene(pirate)], true),
  scene('aleas', '7. Les aléas de la traversée', 'Atlantique, canal de Panama, Pacifique (triangle des Bermudes en passant)',
    `Incidents à placer à volonté entre les grandes scènes :
• le Kiti-Kon se perd (pas d'électronique) ;
• pénurie d'eau ;
• avarie : voile, gouvernail ;
• tempête soudaine et violente ;
• un étudiant traître ou insupportable : il monte l'équipage les uns contre les autres, provoque des pannes, jette du matériel par-dessus bord ;
• près du triangle des Bermudes, tout peut arriver.
Ces incidents peuvent faire échouer l'expédition de façon ridicule (rebrousser chemin, accoster faute d'eau), ce qui ferait ricaner le monde entier.`,
    [inScene(etudiant), inScene(tapelku)], false,
    [choice('traitre', 'Y a-t-il un traître parmi les étudiants ?', [
      ['Oui', 'À démasquer avant qu\'il ne sabote une étape cruciale ; pour qui travaille-t-il ? (démons, Dominique, simple jaloux…).'],
      ['Juste un pénible', 'Tensions à bord, disputes, petites pannes : du jeu de rôle à bord plutôt qu\'un ennemi.'],
      ['Non', 'L\'équipage reste soudé ; garder les autres aléas.'],
    ])]),
  scene('tahiti', '8. Arrivée à Tahiti (ou naufrage héroïque)', 'Papeete, Tahiti',
    `Réussite : accueil en héros ; Njord a remis les vikings à la mode et Asgard reprend des forces. Tapelku gère l'après : best-sellers, jouets et maquettes vikings, prolongation de l'effet médiatique.
Échec : l'opération peut quand même avoir porté ses fruits, selon la manière. Couler sous les crocs d'un serpent de mer reste glorieux ; être stoppé par les gardes-côtes, se perdre ou manquer d'eau fait sombrer le projet dans l'oubli ou le ridicule. Face à un échec humiliant, Tapelku saborde lui-même le drakkar et met en scène un naufrage héroïque.`,
    [inScene(tapelku), inScene(njord)], false,
    [choice('fin', 'Comment se termine l\'épopée ?', [
      ['Arrivée triomphale', 'Plein succès pour Njord : énergie onirique pour Asgard, contrat rempli pour la DTC.'],
      ['Naufrage héroïque', 'Succès partiel : l\'émotion du public profite encore au panthéon viking.'],
      ['Échec ridicule', 'Effet médiatique quasi nul ; Njord est mécontent de la DTC.'],
    ])]),
];

const scenario = {
  id: 'pa7-kiti-kon',
  nom: 'Petites Apocalypses – L\'épopée du Kiti-Kon',
  resume: 'Mini-scénario de protection pour agents de la troisième Force employés par la DTC d\'Hercule. Pour regagner des fidèles, Njord fait construire un drakkar traditionnel, le Kiti-Kon, et lance une traversée Rouen-Tahiti suivie par les médias. Les PJ escortent le professeur Aimé Tapelku et ses étudiants : sabotages démoniaques sur le chantier de Rouen, serpent de mer envoyé par un démon de Velphar, gardes-côtes manipulés par Dominique, pirates des Caraïbes et aléas de la mer.',
  notes: `Source : ${REF}.

Structure : pas d'enquête mais une mission de protection, peu détaillée et ouverte, à jouer en interlude à n'importe quel moment de la campagne. Les incidents s'ajoutent, se retirent ou se déplacent à volonté ; on peut étendre le voyage.
Contexte : avec le délitement des marches, Asgard s'affaiblit et manque d'énergie onirique ; les fidèles se font rares. Njord mise sur un exploit télévisé pour toucher le grand public. La médiatisation est l'enjeu : chaque péripétie spectaculaire (et réussie) fait monter l'énergie, chaque échec ridicule la fait retomber.
Itinéraire : Rouen, Atlantique, canal de Panama, Pacifique, Tahiti.
Ennemis : des démons qui s'amusent (sabotages), un démon de Velphar (serpent de mer), Dominique (gardes-côtes), des pirates.

Adaptations : le ch. 14 (p. 115-116) ne propose rien pour ce mini-scénario. Suggestion : en MV, remplacer Njord par un archange qui soutient le projet (Christophe pour les jeunes, par exemple) ; en INS, inverser le point de vue et faire jouer les saboteurs.

Récompenses : le livre n'en donne pas. Suggestion : contrat de la DTC payé selon l'issue (plein tarif à l'arrivée, moitié pour un naufrage héroïque), et la reconnaissance de Njord.

Fiches : aucun PNJ n'est chiffré dans le livre. Tapelku, Njord et les figurants ont des fiches minimales ; les adversaires (démons saboteurs, serpent de mer, pirates, gardes-côtes) sont entièrement estimés à partir de profils du bestiaire, comme indiqué dans leurs notes.`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [tapelku, njord, hercule, etudiant, saboteur, serpent, pirate, gardeCote].map(asType);
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));
writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types,', scenes.reduce((a, s) => a + s.choix.length, 0), 'choix');
