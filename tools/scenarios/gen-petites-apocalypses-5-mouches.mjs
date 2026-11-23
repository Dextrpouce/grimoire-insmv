// Génère le fichier d'import « insmv-scenario » pour « On n'encule pas les mouches avec du vinaigre » (Les Petites Apocalypses, chap. 10, p. 84-95 ; adaptations p. 116)
// usage : node gen-petites-apocalypses-5-mouches.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Les Petites Apocalypses, chap. 10 « On n\'encule pas les mouches avec du vinaigre », p. 84-95';
const L = (s) => R.parseLvl(String(s));
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
const ARMES = new Map(R.ARMES.flatMap(([g, l]) => l.map((x) => [x[0], { prec: x[1], puis: x[2], melee: R.MELEE_GROUPS.includes(g) }])));
const arme = (n, table, lvl) => { const w = ARMES.get(table); if (!w) throw new Error('arme inconnue : ' + table); return { n, att: L(lvl), ...w }; };
// attaque au format des livres « seuil/RU+X/M+Y » : att = X×2, précision 0, puissance Y
const livre = (n, x, y, melee) => ({ n, att: x * 2, prec: 0, puis: y, melee });
const poing = (lvl) => arme('Coup de poing', 'Coup de poing', lvl);
const P = 'pa5-'; let n = 0; const id = (k) => P + k;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [poing(1)], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});
const CARS = 'Caractéristiques vérifiées sur la page rendue (p. 95).';

// ---------------- Les dieux (fiches p. 95) ----------------
const lilith = npc('lilith', {
  nom: 'Lilith (Vanessa Lapierre)', source: 'Réincarnation imparfaite d\'Aphrodite (?), déesse païenne (?)', type: 'paien',
  car: car('2+ 5 4+ 6 7+ 5'), def: L(5), pp: 48, pfFix: 8, seuilsFix: seuils('5/10/15/20'),
  armes: [poing(4)],
  pouvoirs: pows('Absorption d\'énergie sexuelle 4, Bénédiction : beauté 4, Charme 4, Esquive acrobatique 4, Malédiction : stérilité 4, Phéromones 4, Polymorphie 3, Volonté supra-normale 6'),
  talents: 'Acrobatie 6, Aisance sociale 8, Baratin 7, Contorsionnisme 5, Corps à corps 4, Défense 5, Kama sutra 8, Séduction 7, Torture 4',
  notes: `Dans le corps de Vanessa, 20 ans, noyée près de Saint-Malo : mince, blond foncé, yeux gris, peau très claire et taches de rousseur. Amnésique, superficielle, versatile, pas très futée mais très débrouillarde ; ne veut que s'amuser, briller et être célèbre. Déteste les enfants.
Son aura érotique (Phéromones) déchaîne la libido de son entourage ; c'est pour cela qu'elle devient l'égérie des nuits tropéziennes, puis l'idole de la secte d'Hadès, chanteuse, et enfin star du porno.
Phéromones : physique, constant (1 PP par minute), aire d'effet de rayon court ; test de pouvoir à l'activation, chaque personne dans la zone résiste par un test de Volonté (Volonté supra-normale et Protection de l'esprit inopérants ; anges et démons incarnés à +4 colonnes). Transmet une émotion forte (chez elle, surtout l'excitation) ; jamais de contrôle du comportement.
Coup de poing au niveau de Corps à corps : estimation (pas d'attaque donnée).
${CARS}`,
});
const athena = npc('athena', {
  nom: 'Athéna', source: 'Ex-déesse païenne, prof de maths', type: 'paien',
  car: car('4 5 5 6 5 7'), def: L(8), pp: 65, pfFix: 10, seuilsFix: seuils('5/10/15/20'),
  armes: [livre('Lance magique ancienne', 11, 11, true)],
  pouvoirs: pows('Arme exaltée 10, Frappe ultime 10, Lire les pensées 4, Régénération 6, Supériorité martiale 10, Télékinésie 4, Télépathie 4, Téléportation 4, Trait d\'énergie 4, Transfert de blessures 6, Volonté supra-normale 6'),
  talents: 'Baratin 3, Combat 6 (lances 9), Culture générale 3 (Histoire 6), Défense 8, Discussion 7, Enquête 7, Fouille 7, Métier : prof de math 4, Sixième sens 7',
  notes: `Trentaine passée, 1,70 m, brune aux cheveux ondulés, regard franc ; fixe ses interlocuteurs en silence au milieu d'une conversation. Conduit très bien (Twingo rose). Petit appartement impeccable : salle de gym, bureau plein de livres de maths, salle de bains façon thermes romains. Hercule connaît son adresse.
A tué Zeus après le viol de Déméter ; a appris bien plus tard qu'Aphrodite l'avait envoûté. Juste et franche : refuse de mentir, n'aime pas commettre deux fois la même erreur de jugement.
Lance : précision +5, puissance +7 (66/RU+11/M+11).
${CARS}`,
});
const hades = npc('hades', {
  nom: 'Hadès (Eddy Salmingo)', source: 'Ex-dieu païen, démon de Morax de grade 0', type: 'demon',
  car: car('5 5 4 5 3 4'), def: L(6), pp: 50, pfFix: 10, seuilsFix: seuils('7/15/22/30'),
  armes: [livre('Épée magique majeure', 8, 11, true)],
  pouvoirs: pows('Cauchemar 2, Corps gazeux, Illusions 4, Invisibilité 4, Œuvre d\'art, Peur 2, Protection de l\'âme, Télékinésie 4, Télépathie 4, Téléportation 4, Volonté supra-normale 4'),
  talents: 'Art 2 (peinture 4), Baratin 6, Combat 4 (épées 6), Défense 6, Discrétion 4, Discussion 5, Intimidation 6, Métier : agent artistique 3, Prestidigitation 4',
  notes: `Petit gratte-papier en Enfer qui rêve de détrôner Apollon. Incarné dans un cadavre frais au look tropézien : la cinquantaine (en paraît dix de plus), trop bronzé, cheveux noirs gominés, tenue à la Dick Rivers, profil d'aigle ; parle en détachant chaque mot. Désagréable et méfiant, puis soudain mielleux ; prêche l'amour mais ne pense qu'à l'argent.
Manager de Lilith et gourou de la secte : il veut l'argent des adeptes et surtout leur énergie onirique. Prévenu par Antoine, héros païen romain qui lui est fidèle.
Épée : précision +4, puissance +6 (66/RU+8/M+11).
${CARS}`,
});
const catherine = npc('catherine', {
  nom: 'Catherine (Déméter, Ève)', source: 'Ex-déesse païenne, ex-archange des femmes', type: 'ange',
  car: car('6 5 6 9 7 7'), def: L(9), pp: 102, pfFix: 15, seuilsFix: seuils('10/20/30/40'),
  armes: [livre('Arc béni suprême (portée moyenne)', 12, 10, false), poing(8)],
  pouvoirs: pows('Arts martiaux 8, Aura de pacification 8, Bénédiction : fertilité 12+, Champ de force 8, Charme 8, Conscience 13+, Détection du danger 5, Lire les pensées 12+, Non-détection 13, Paralysie 8, Peur 8, Polymorphie 5, Télékinésie 10, Télépathie 10, Téléportation 10, Trait d\'énergie 12+'),
  talents: 'Baratin 8, Corps à corps 8, Défense 9, Discrétion 6, Discussion 12, Enquête 7, Médecine 10, Séduction 8, Tir 5 (arcs 10), Pouvoirs propres : Miracle 2, Voyage inter-marches 8',
  notes: `La petite quarantaine, brune, peau mate ; énergique, nerveuse, une violence contenue dans le regard : elle peut exploser à tout moment. Mère d'Hercule (qui la croit morte et ignore qui elle est). Victime du viol de Zeus, provoqué par Aphrodite : elle veut corriger Lilith, Aphrodite ou pas. Accompagnée d'anges.
Elle possède aussi tous les pouvoirs gratuits des supérieurs (livre de base, p. 96). Miracle et Voyage inter-marches ne sont pas dans la liste des pouvoirs de l'appli : notés dans les talents.
Conscience : spirituel, activé (5 PP), attaque spirituelle résistée par Chance/Foi, portée de combat. Libère la cible de tout contrôle mental ou spirituel (annule Charme, Domination…) et de ses illusions ou complexes.
Arc : précision +4, puissance +10 (66/RU+12/M+10). Coup de poing au niveau de Corps à corps : estimation.
Type « ange » choisi pour le camp au combat (elle mène des anges) ; seuils et PF du livre.
${CARS}`,
});

// ---------------- Adversaires sans fiche dans le livre (valeurs estimées) ----------------
const demons = npc('demons-hades', {
  nom: 'Démons engagés par Hadès', source: 'Démons de grade 1 (gros bras)', type: 'demon', qty: 4,
  car: car('5 4 3 2 2 3'), def: L('6+'), pp: 16, pfFix: 7, seuilsFix: seuils('7/14/21/28'),
  armes: [livre('Katana', 5, 8, true), livre('Poignard', 5, 5, true)],
  pouvoirs: pows('Arme exaltée 4, Art de combat 4, Caméléon 4'),
  talents: 'Combat 3 (arme de prédilection 5+), Défense 6+, Discrétion 4, Médecine 2, Tir 3 (arme de prédilection 5)',
  notes: 'Le livre ne donne ni leur nombre ni leurs caractéristiques. Valeurs reprises du « Démon de grade 1 (combattant) » du bestiaire (Memento Flatula, p. 52) : estimation, à adapter à la puissance des PJ.\nIls filent discrètement les PJ, puis tentent de les coincer pour savoir où est Lilith. Peuvent être repérés, semés ou interrogés (ils avouent travailler pour Hadès et savent que la police recherche les PJ).',
});
const anges = npc('anges-catherine', {
  nom: 'Anges de Catherine', source: 'Anges qui accompagnent Catherine', type: 'ange', qty: 3,
  car: car('3 3 3 3 3 3'), def: L(3), pp: 12,
  armes: [arme('Pistolet', 'Revolver petit calibre', 3), poing(3)],
  talents: 'Corps à corps 3, Défense 3, Discrétion 3, Enquête 3, Tir 3',
  notes: 'Aucune fiche dans le livre : ange de grade 1 générique, valeurs estimées. Ils cherchent Lilith avec Catherine et sont présents aux Hots d\'or.',
});
const policiers = npc('policiers', {
  nom: 'Policiers', source: 'Agents lancés sur les traces des PJ', qty: 4,
  car: car('2+ 2 2+ 2 2 2'), def: L(2),
  armes: [arme('Pistolet de service', 'Revolver petit calibre', 2), arme('Matraque', 'Matraque', 2)],
  talents: 'Conduite 2, Corps à corps 2, Défense 2, Enquête 2, Fouille 2, Tir 2',
  notes: 'Aucune fiche dans le livre : policiers ordinaires, valeurs estimées. Persuadés que les PJ ont enlevé Lilith (dénonciation d\'Hadès ou simple déduction).',
});

// ---------------- PNJ sans caractéristiques ----------------
const delaivre = npc('delaivre', {
  nom: 'Commissaire Justine Délaivre', source: 'Police de Saint-Malo',
  notes: '45 ans, taille moyenne, un peu ronde, très jolies jambes, châtain ; brusque, sûre d\'elle, déteste perdre son temps (« bon allez, on active les neurones ! »). Chargée de l\'affaire de la noyée, elle a un sentiment d\'inachevé : elle a identifié Vanessa grâce à son ancien patron (un Shopi parisien) et retrouvé ses parents, rustres et indifférents. Elle veut venir à Paris même sans enquête officielle. Son attitude dépend de l\'impression que lui ont faite les PJ.\nPas de caractéristiques dans le livre.',
});
const louise = npc('louise', {
  nom: 'Louise Delafosse', source: 'Infirmière à l\'hôpital de Saint-Malo',
  notes: 'Crie au miracle dans la presse. Gentille et dévote : Lilith l\'a attendrie pour s\'évader (vêtements, 80 €, café drogué pour le vigile). Peut raconter la convalescence et la guérison anormalement rapide.\nPas de caractéristiques dans le livre.',
});
const tartin = npc('tartin', {
  nom: 'Bruno Tartin', source: 'Promoteur immobilier de Melun, meurtrier de Vanessa',
  notes: 'La petite quarantaine, grand et baraqué, blond aux yeux bleu froid, élégant, plein d\'humour : un joli-cœur qui cache un fou furieux. Vanessa s\'étant refusée à lui sur son bateau, il l\'a assommée d\'un coup de pichet et elle est tombée à l\'eau ; il a écourté son séjour et regagné Melun. Retrouvé par les PJ, il ment (accident, ou « jamais vu cette fille »).\nPas de caractéristiques dans le livre.',
});
const hercule = npc('hercule', {
  nom: 'Hercule', source: 'Héros païen, patron de la DTC', type: 'paien',
  notes: 'Commanditaire. Intrigué par cette affaire visiblement liée à Vénus et à son panthéon, il a rapproché les articles de presse de l\'apparition de Lilith dans le show-biz. Il ignore que Catherine est Déméter (il croit sa mère morte) et qu\'Aphrodite a envoûté Zeus. Connaît l\'adresse d\'Athéna et l\'identifie d\'après une description.\nFiche complète : Les Petites Apocalypses, p. 21 (non reprise ici).',
});
const antoine = npc('antoine', {
  nom: 'Antoine', source: 'Héros païen romain fidèle à Hadès', type: 'paien',
  notes: 'Fêtard de Saint-Tropez qui a soupçonné de la troisième Force chez Lilith et a prévenu Hadès. Peut servir de piste ou d\'homme de main.\nPas de caractéristiques dans le livre.',
});
const adeptes = npc('adeptes', {
  nom: 'Adeptes de la secte', source: 'Paumés béats, babas cool et amateurs de galipettes', qty: 6,
  notes: 'Tous consentants et enthousiastes, ils paient très cher au regard de leurs moyens et répètent « amour » à tout bout de champ. Quelques membres dévoués aident Hadès à rechercher Lilith.\nPas de caractéristiques dans le livre.',
});

const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  scene('mission', '1. La mission d\'Hercule', 'Bureaux de la DTC, Paris',
    `Quelques mois après les faits de Saint-Malo. Les remous causés par Lilith (égérie de Saint-Tropez, secte, carrière de chanteuse) sentent la troisième Force à plein nez. Hercule a fait le lien avec les articles sur la « miraculée » : il charge les PJ de retrouver cette Lilith et de comprendre ce qui se passe.
Aide de jeu : trois coupures de presse à résumer aux joueurs.
• Ouest-France, 14 mai : une jeune femme nue retrouvée morte sur la plage de Saint-Malo par un couple de joggeurs reprend connaissance à l'hôpital ; une infirmière parle de miracle.
• Le Pays malouin, 16 mai : vigiles devant sa chambre, appel à témoins ; la miraculée est amnésique.
• Ouest-France, 21 mai : elle a disparu de l'hôpital malgré la surveillance ; la police exclut l'enlèvement.
Les PJ connaissent l'adresse de la secte de Lilith (Paris, près de Saint-Lazare). Deux pistes : Saint-Malo (scène 2) ou la secte (scène 3).`,
    [inScene(hercule)]),
  scene('saint-malo', '2. Un p\'tit week-end à Saint-Malo (optionnel)', 'Saint-Malo, puis Melun',
    `Piste facultative sur le passé de Lilith.
• Le joggeur, Louise l'infirmière et la presse locale confirment : noyade, avec une grosse blessure à la tête (coup porté avec un objet contondant), corps froid et sans pouls, puis retour à la vie dans l'ambulance. Les médecins parlent de métabolisme ralenti par l'eau froide ; fracture du crâne guérie à une vitesse anormale.
• Au port de plaisance : les bateaux sortis la veille de la mort mènent (si le MJ le veut) à Bruno Tartin, à Melun. Il ment.
• La commissaire Délaivre, si les PJ sont diplomates : la victime s'appelle Vanessa Lapierre (identifiée par son ancien patron d'un Shopi parisien) ; parents frustes qui l'avaient mise à la porte et s'en moquent. Elle trouve toute l'affaire louche.
Tous les témoins sont formels : la noyée et la chanteuse sont la même personne.
Ce qui s'est passé : Vanessa, 20 ans, venait de perdre travail, copain et logement ; elle a suivi Tartin sur son bateau, l'a repoussé, il l'a assommée et elle s'est noyée. Une âme errante, un fragment abîmé d'Aphrodite, a pris possession du corps. Réveillée amnésique, elle s'est évadée avec l'aide de Louise et s'est rebaptisée Lilith.`,
    [inScene(delaivre), inScene(louise), inScene(tartin)], false,
    [choice('tartin', 'Les PJ remontent-ils jusqu\'à Bruno Tartin ?', [
      ['Oui, et ils le livrent à la police', 'Délaivre leur en sera reconnaissante : alliée possible quand la police les traquera.'],
      ['Oui, mais ils le laissent', 'Aucune suite prévue par le livre ; au MJ de voir.'],
      ['Non', ''],
    ])]),
  scene('secte', '3. Bienvenue à Nœudnœud-land !', 'Siège de la secte, immeuble désaffecté près de Saint-Lazare, Paris',
    `Approche au choix : discrétion, infiltration comme futurs adeptes ou méthode bourrine. Si les PJ cherchent plutôt Lilith à l'extérieur (plateau télé, radio, studio), faites-la-leur rater systématiquement et ramenez-les ici.
• Ambiance : salles de détente, de méditation et de joints, d'autres franchement orgiaques façon romaine ; beaucoup de monde, tous consentants et béats. Posters et statues de Vénus, poèmes et professions de foi peints au-dessus des portes. Décor cheap malgré l'argent brassé. Le mot « amour » partout.
• Fonctionnement : on paie cher pour entrer, on travaille « pour la communauté », on paie encore, on vénère un être suprême incarné par Lilith, et en sortir est très difficile. Ça ressemble à un culte de Vénus, sans que ce soit dit.
• Hadès (maître Salmingo) ne reçoit que les candidats à l'adhésion : méfiant puis mielleux, il jauge leur sincérité et surtout leur portefeuille.
• Lilith se lasse déjà de la secte ; seule sa carrière de chanteuse l'intéresse, et elle se croit dépendante de son manager.`,
    [inScene(hades), inScene(adeptes), inScene(lilith)]),
  scene('enlevement', '4. Athéna enlève Lilith', 'Secte, puis rues de Paris',
    `Athéna, qui soupçonne Lilith d'être Aphrodite, est venue l'interroger ; le babillage décousu de Lilith la lasse et elle décide de l'emmener pour discuter au calme. Les PJ (ou Hadès) peuvent interrompre la conversation.
Quand les PJ arrivent jusqu'à Lilith : son bureau porte des traces de lutte, des adeptes ont entendu des appels au secours, la fenêtre est ouverte. En bas, Athéna pousse Lilith dans une Twingo rose et démarre en trombe.
Course-poursuite possible, mais Athéna a de l'avance et doit gagner. Si les PJ l'ont vue, ils la reconnaissent s'ils l'ont déjà croisée à la DTC ; sinon leur description suffit à Hercule pour l'identifier.
En coulisses (« papotages de filles ») : dans une chambre d'hôtel, après une ou deux gifles, Athéna interroge Lilith pendant des heures. Elle conclut que Lilith n'a aucun souvenir, qu'elle n'est pas vraiment Aphrodite et ne peut être tenue responsable. Elle la relâche en lui conseillant de fuir la secte et Eddy. Lilith, qui l'admire déjà, s'en va vers de nouvelles aventures.`,
    [inScene(athena), inScene(lilith)]),
  scene('branle-bas', '5. Branle-bas de combat à Nœudnœud-land', 'Secte',
    `Panique générale : Lilith aurait été enlevée, assassinée, ou rappelée au Panthéon selon les adeptes. Hadès n'a pas vu Athéna : il accuse les PJ (rencontrés, aperçus ou signalés par leur guide).
• Il lance des adeptes dévoués sur leurs traces et dénonce les PJ à la police.
• Si elle l'apprend, la commissaire Délaivre finit par rappliquer ; son attitude dépend de ce qui s'est passé à Saint-Malo.`,
    [inScene(hades), inScene(adeptes)]),
  scene('traque', '6. Youhou, Athéna ! Un peu d\'action', 'Appartement d\'Athéna, Paris et ses rues',
    `Laissez les PJ avoir quelques idées avant de leur tomber dessus.
• Chez Athéna (Hercule a l'adresse) : personne. Appartement propret, salle de gym, livres de maths, tiramisu au frigo, salle de bains en mosaïque. Contacts, Chez Régis et le Labyrinthe ne donnent rien.
• Les démons d'Hadès filent les PJ et tentent de les coincer pour leur arracher où est Lilith. Les PJ peuvent les repérer, les semer, les battre ou les faire parler (employeur : Hadès ; la police vous cherche).
• La police : le journal télévisé parle d'eux, des passants les reconnaissent et téléphonent. Faire monter la pression : arrestation et garde à vue possibles. Pour s'en sortir : se faire libérer, s'évader, ou intervention d'Hercule, d'Hadès (qui veut les interroger lui-même), de Délaivre ou d'Athéna (qui témoigne que Lilith est partie d'elle-même).`,
    [inScene(demons, { qty: 4 }), inScene(policiers, { qty: 4 })], true,
    [choice('police', 'Les PJ tombent-ils entre les mains de la police ?', [
      ['Non, ils lui échappent', 'Ils restent recherchés tant que personne n\'a prouvé que Lilith est libre.'],
      ['Garde à vue, ils s\'en sortent seuls', 'Libérés ou évadés ; une évasion aggrave leur cas.'],
      ['Garde à vue, quelqu\'un intervient', 'Hercule, Hadès (qui les interroge à son tour), Délaivre ou Athéna : le sauveteur attend quelque chose en retour.'],
    ]),
    choice('demons', 'Que font les PJ des démons d\'Hadès ?', [
      ['Ils les battent ou les font parler', 'Ils savent qu\'Hadès les fait chercher et que la police est à leurs trousses.'],
      ['Ils les sèment', 'Les démons réapparaîtront aux Hots d\'or.'],
    ])]),
  scene('catherine', '7. Catherine a les nerfs', 'Là où sont les PJ (ou au commissariat)',
    `Athéna avoue tout à Catherine : elle a interrogé Lilith seule malgré sa promesse, et l'a relâchée. Catherine, furieuse contre Aphrodite, se lance à son tour à la recherche de Lilith pour lui flanquer une raclée. Athéna, inquiète pour une Lilith sans défense, ne veut ni s'interposer ni impliquer Hercule (trop concerné) : elle contacte directement les PJ, en les aidant au besoin à sortir de prison.
Elle peut tout leur raconter, y compris qu'Aphrodite a envoûté Zeus pour qu'il viole Déméter (voir notes du scénario), et leur laisser la responsabilité d'en parler ou non à Hercule. Au MJ de décider si elle révèle que Catherine est Déméter, la mère d'Hercule, ou si elle évoque seulement un vieux contentieux : les PJ peuvent aussi recouper les indices eux-mêmes.`,
    [inScene(athena)], false,
    [choice('verite', 'Qu\'apprennent les PJ d\'Athéna ?', [
      ['Toute l\'histoire, y compris que Catherine est Déméter', 'Ils détiennent le secret des origines d\'Hercule.'],
      ['L\'envoûtement de Zeus, mais pas l\'identité de Catherine', 'À eux de recouper les indices.'],
      ['Seulement qu\'il faut protéger Lilith de Catherine', ''],
    ])]),
  scene('cavale', '8. Lilith la bienheureuse, avec le monde entier aux fesses', 'Monaco, la France, les tournages',
    `Tout le monde cherche Lilith : Catherine et ses anges pour se défouler, les PJ pour la protéger (et se disculper), Hadès et ses démons pour relancer la secte, la police parce qu'elle la croit enlevée. Elle ne se cache pas, mais change sans cesse de projet et de lieu.
• Monaco : elle allume la principauté, mais on veut la faire poser avec des enfants, qu'elle déteste ; elle repart.
• Presse people et contacts du show-biz signalent son passage, toujours trop tard.
• Elle se lance dans le porno, où elle excelle ; tournages rapides et discrets : les PJ arrivent toujours après. Ils peuvent croiser Catherine.
Peut s'étaler sur plusieurs scénarios : les PJ partent sur d'autres missions en suivant les nouvelles de Lilith ; Hercule veut toujours la voir et lui faire comprendre que tant de bruit nuit à la troisième Force.`,
    [inScene(catherine), inScene(anges, { qty: 3 })]),
  scene('hots-dor', '9. La cérémonie des Hots d\'or', 'Cérémonie des Hots d\'or',
    `Lilith est nommée et vient en star, très entourée. Un PJ en entend parler, ou Hercule le leur signale.
Sont présents : les PJ, Hadès et ses démons, Catherine et ses anges, la commissaire Délaivre et quelques policiers. Agir pendant la cérémonie est difficile ; juste après, c'est plus simple. Chacun a repéré les autres : si un groupe bouge, les autres lui tombent dessus. Bagarre générale prévue. Si elle en a le temps, Lilith reçoit le trophée de la révélation de l'année.`,
    [inScene(lilith), inScene(hades), inScene(demons, { qty: 4 }), inScene(catherine), inScene(anges, { qty: 3 }), inScene(delaivre), inScene(policiers, { qty: 4 })], true,
    [choice('lilith', 'Qui s\'empare de Lilith ?', [
      ['Les PJ', 'Ils la ramènent à Hercule (scène 10).'],
      ['Personne : elle file dans la confusion', 'Elle continue de papillonner, aussi insouciante qu\'avant.'],
      ['Catherine', 'Elle se défoule sur elle avant de comprendre qu\'elle n\'est pas l\'Aphrodite d\'autrefois ; Hercule charge les PJ de la tirer de là.'],
      ['Hadès', 'Il veut relancer la secte et viser le trône d\'Apollon ; Hercule charge les PJ de la récupérer.'],
      ['La police', 'Elle veut seulement s\'assurer que Lilith va bien.'],
    ])]),
  scene('fin', '10. Fin de l\'histoire', 'DTC',
    `• Si les PJ ramènent Lilith : Hercule l'interroge, arrive aux mêmes conclusions qu'Athéna et la relâche avec une couverture qui la satisfait tout en protégeant la troisième Force. Il tente même de lui expliquer qu'elle en fait partie (bon courage).
• Hadès s'obstine un temps, puis se lasse (le culte a pris un coup) et repart peut-être d'où il vient, vexé. S'il persiste, Hercule cherchera à le neutraliser.
• Catherine garde sa rancune ; le métier de Lilith l'exaspère d'autant plus.
• Lilith a pu retenir des bribes (Catherine l'a connue jadis, elle lui a fait du tort) : Hercule assemble le puzzle et interroge les PJ sur le reste. À eux de décider ce qu'ils lui révèlent.
Récompenses : aucune en PA indiquée par le livre (à fixer par le MJ).`,
    [inScene(hercule), inScene(lilith)], false,
    [choice('hercule', 'Que révèlent les PJ à Hercule ?', [
      ['Tout : Catherine est sa mère et Zeus était envoûté', 'Hercule cherchera Catherine (aussi introuvable qu\'Ève) et harcèlera Athéna ; il pourra peut-être arrêter sa psychanalyse.'],
      ['L\'envoûtement de Zeus seulement', 'Un poids en moins pour Hercule, sans savoir que sa mère est vivante.'],
      ['Rien', 'Secret gardé ; Hercule peut tout de même deviner par recoupement.'],
    ])]),
];

const scenario = {
  id: 'pa5-mouches',
  nom: 'Petites Apocalypses – On n\'encule pas les mouches avec du vinaigre',
  resume: 'Scénario d\'enquête et de poursuite pour agents de la troisième Force employés par la DTC d\'Hercule. Une jeune femme noyée près de Saint-Malo revient à la vie, habitée par un fragment abîmé d\'Aphrodite : amnésique, irrésistible et écervelée, elle se fait appeler Lilith. Hadès, incarné en manager, fait d\'elle l\'idole d\'une secte vénusienne pour voler l\'énergie onirique des adeptes. Hercule envoie les PJ enquêter ; Athéna enlève Lilith sous leur nez, la police les accuse, les démons d\'Hadès les traquent, Catherine (Déméter) veut sa revanche, et tout le monde se retrouve aux Hots d\'or pour une bagarre générale.',
  notes: `Source : ${REF}.
Ton : comédie paillarde et décalée ; le texte assume que les PJ lancent parfois les dés pour rien (la course-poursuite, la recherche de Lilith). Scénario d'ambiance qui peut s'étaler sur plusieurs séances.

Histoire secrète (résumé, à connaître : voir aussi p. 20 et suivantes sur Hercule et la guerre civile de l'Olympe) :
• Aphrodite, mariée à Héphaïstos, le trompait avec Arès. Humiliée par le piège du filet invisible, elle a envoûté Héphaïstos pour qu'il viole une déesse, ce qui l'a fait chasser de l'Olympe (il vit toujours sur Terre).
• Plus tard, elle a envoûté Zeus pour qu'il viole Déméter (d'où la naissance d'Hercule), espérant une révolte qui mettrait Arès sur le trône. Déméter s'est confiée à Athéna, qui a tué son père ; mais c'est le camp d'Athéna qui a gagné la guerre civile (Apollon sur le trône), et Aphrodite et Arès ont été bannis dans le vide intermarches.
• Bien plus tard, Athéna a découvert la manipulation et l'a dite à Déméter, devenue Catherine (ex-archange des femmes, aussi appelée Ève). Elles ont gardé le secret.
• Personne ne sait au juste ce qui cloche dans la réincarnation d'Aphrodite : le livre laisse la question ouverte.

Qui cherche Lilith et pourquoi :
• Hercule et les PJ : comprendre, protéger la troisième Force du tapage.
• Hadès (démon de Morax de grade 0, ex-dieu) : l'argent et l'énergie onirique de la secte, puis le trône d'Apollon.
• Athéna puis Catherine : leur vieux contentieux avec Aphrodite.
• Anges (qui pensent à la troisième Force ou à Scox) et démons (qui flairent Aphrodite) : surveillance discrète.
• La police et la commissaire Délaivre.

Notes de campagne :
• Avant : les PJ peuvent croiser Athéna à la DTC comme simple visiteuse et connaître l'histoire d'Hercule (par lui ou par Domitille). On peut distiller les nouvelles de Lilith sur plusieurs scénarios.
• Après : si Hercule comprend que Catherine est sa mère, il la cherchera sans succès et s'énervera auprès d'Athéna. Il instruira Lilith sur la discrétion et l'introduira dans la troisième Force : elle fréquentera le Labyrinthe et la DTC en draguant ouvertement les PJ.
• L'intermède d'ouverture (Ange interroge les archanges sur l'amour, puis Jésus Chez Régis) est une vignette de la campagne, sans lien direct avec l'intrigue.

Adaptations pour anges et démons (p. 116) :
• MV : les anges qui surveillent Lilith restent en coulisses, sauf ceux de Catherine. Pour une équipe d'anges, l'impliquer dès le « miracle » de Saint-Malo (ils n'y croiront guère, les médecins ayant une explication rationnelle), puis quand la secte et le show-biz rendent l'affaire voyante : ils soupçonnent la troisième Force ou les démons de Scox. Garder l'équipe d'Hercule en PNJ maladroits et peu discrets qui peuvent leur fournir des indices ; les anges prennent la place des PJ dès la visite à la secte. Ils peuvent rencontrer Catherine ou ses anges et en apprendre plus sur le fond mythologique.
• INS : même principe. Les démons s'intéressent à Lilith par curiosité, pour l'exploiter au profit du Mal, ou pour comprendre le jeu très personnel d'Hadès. La DTC reste en PNJ. Les révélations d'Athéna (ou de Catherine pour les anges) viennent d'Hadès : Lilith envolée, il change de stratégie, prétend avoir agi pour son patron et s'associe aux PJ, mais il ignore une partie de l'histoire (approche plus « baston » que rôle).
• Dans tous les cas, ajuster la puissance des adversaires à celle des PJ.

Récompenses : aucune en PA indiquée par le livre.
Fiches : les quatre dieux ont des caractéristiques (p. 95) ; démons d'Hadès, anges de Catherine et policiers sont estimés (voir leurs notes). Attaques du livre au format « seuil/RU+X/M+Y ».`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [lilith, athena, hades, catherine, demons, anges, policiers, delaivre, louise, tartin, hercule, antoine, adeptes].map(asType);
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));
writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types,', scenes.reduce((a, s) => a + s.choix.length, 0), 'choix');
