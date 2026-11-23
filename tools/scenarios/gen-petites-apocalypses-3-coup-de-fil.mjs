// Génère le fichier d'import « insmv-scenario » pour « Un coup de fil à la patte » (Les Petites Apocalypses, p. 62-73, adaptations p. 115-116)
// usage : node gen-petites-apocalypses-3-coup-de-fil.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Les Petites Apocalypses, « Un coup de fil à la patte », p. 62-73';
const L = (s) => R.parseLvl(String(s)); // « 2+ » → 5
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
const ARMES = new Map(R.ARMES.flatMap(([g, l]) => l.map((x) => [x[0], { prec: x[1], puis: x[2], melee: R.MELEE_GROUPS.includes(g) }])));
// arme de la table des règles : nom affiché, nom dans la table, niveau du talent
const arme = (n, table, lvl) => { const w = ARMES.get(table); if (!w) throw new Error('arme inconnue : ' + table); return { n, att: L(lvl), ...w }; };
// attaque au format des livres « seuil/RU+X/M+Y » : att = X×2, précision 0, puissance Y
const bk = (n, x, y, melee = false) => ({ n, att: x * 2, prec: 0, puis: y, melee });
const poing = (lvl) => arme('Coup de poing', 'Coup de poing', lvl);
let n = 0; const id = (k) => `pa3-${k}`;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [poing(1)], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});
// membre de la famille sans caractéristiques dans le livre : humain moyen (tout à 2), fiche minimale
const EST = 'Pas de caractéristiques dans le livre : humain moyen (tout à 2, PF et seuils calculés), valeurs estimées.';
const civil = (key, nom, source, notes, o = {}) => npc(key, { nom, source, ...o, notes: [notes, o.est || EST].join('\n') });

// ---------------- Les d'Astelin chiffrés ----------------
const egispee = npc('egispee', {
  nom: 'Louis-Égispée d\'Astelin', source: 'Démon de Ouikka, grade 2 – patriarche (90 ans)', type: 'demon', car: car('4 3 3+ 4 3 4+'), def: L(6),
  pp: 29, pfFix: 8, seuilsFix: seuils('6/12/18/24'),
  armes: [bk('Ongles d\'acier (2 PP pour le combat)', 5, 6, true), bk('Trait d\'énergie (intangible, 4 PP par tir)', 8, 5), poing(4)],
  pouvoirs: pows('Absorption de douleur 3, Arts martiaux 3, Augmentation de Force 3, Disparition 2, Lire les pensées 2, Membre exotique : ongles d\'acier, Peur 5, Poison 3, Trait d\'énergie 3, Voix impérieuse 2, Volonté supra-normale 3'),
  talents: 'Aisance sociale 4+, Baratin 5, Corps à corps 4, Défense 6, Discrétion 3, Discussion 5, Enquête 3, Hobby : ignorer sa famille 5, Intimidation 5+, Médecine 2+, Métier : grand monde 4, Séduction 3, Tir 3 (Trait d\'énergie 6)',
  notes: 'Vieillard grand, maigre, costume noir sur mesure, regard glaçant, petit claquement de langue en pleine conversation. Galanterie de façade, mépris des femmes, goût de nuire pour le plaisir. Patron de l\'entreprise familiale (ventilateurs, climatisations, chauffages), championne du licenciement. Tout le monde le vouvoie.\nVeuf d\'Ester Berthel, morte en couches à la naissance de Domitille dans des circonstances jamais éclaircies (rumeurs, conflit sourd avec Domitille). N\'apprécie que son arrière-petit-fils Louis, démon prometteur.\nIl n\'est pour rien dans la capture d\'Hercule : fausse piste idéale. Ludivine le soupçonne depuis longtemps. Quelques démons sont invités au week-end sur sa liste.',
});
const domitille = npc('domitille', {
  nom: 'Domitille de la Vibère (née d\'Astelin)', source: 'Héroïne païenne romaine – architecte à Lyon (55 ans)', type: 'paien', car: car('3 3 2 4 3 4'), def: L(4),
  pp: 20, pfFix: 7, seuilsFix: seuils('4/9/13/18'),
  armes: [bk('Glaive romain', 3, 4, true), poing(3)],
  pouvoirs: pows('Charme 2, Détection du futur proche 4, Sommeil 2'),
  talents: 'Combat 1+ (épées 3), Corps à corps 3, Défense 4, Discrétion 3, Discussion 4, Enquête 4, Fouille 3, Hobby : cuisine 3, Savoir occulte 3 (divination 7), Séduction 3',
  notes: 'Héroïne romaine depuis près de trente ans (a quitté son corps d\'adolescente pour l\'Olympe). Trapue, sportive, cheveux blonds longs, franche, susceptible, un peu brutale, très sûre d\'elle ; pas l\'élocution distinguée de la famille. Bonne cuisinière, excellente mémoire.\nDevin réputé à la romaine : entrailles de poulet, vol des oiseaux, et renards à la queue enflammée lâchés d\'une colline. Petite pièce secrète à côté de sa chambre.\nConnaît Hercule, qu\'elle a aidé financièrement à ses débuts (remboursée). Mariée à Abélard, qui ignore tout de sa nature. Haïe de Louis-André, ignorée par son père ; aimée du reste de la famille.\nPouvoir « Oracle » du livre = Détection du futur proche.',
});
const ludivine = npc('ludivine', {
  nom: 'Ludivine de la Vibère-d\'Astelin (née Lyons)', source: 'Ange de Jordi, grade 0 – sage-femme (24 ans)', type: 'ange', car: car('3 4 4 3 3 5'), def: L(5),
  pp: 12, pfFix: 6, seuilsFix: seuils('6/12/18/24'),
  armes: [bk('Masse d\'arme', 4, 5, true), poing(1)],
  pouvoirs: pows('Aura de pacification 2, Esquive acrobatique 1, Non-détection 1'),
  talents: 'Baratin 4, Combat 3 (contondantes 5), Défense 5, Discussion 4, Enquête 4, Fouille 4, Séduction 3',
  notes: 'Grande, brune, air buté, nez en trompette. Incarnée juste avant de rencontrer Charles-Louis, qu\'elle a rendu plus humaniste ; sage-femme dans un hôpital public parisien ; mère d\'Antonin (2 ans).\nSurveille Louis-Égispée, Marc-Jean et le petit Louis qu\'elle croit démons (elle se trompe pour Marc-Jean). Rêve d\'un coup d\'éclat : elle n\'en a encore jamais fait. Peut savoir une partie de l\'affaire grâce à ses pouvoirs et aider les PJ, mais ses soupçons iront d\'abord vers le vieux.',
});
const louis = npc('louis', {
  nom: 'Louis d\'Astelin', source: 'Démon de Shaytan, grade 1 – enfant de 9 ans', type: 'demon', car: car('2 3 4 3 4 3'), def: L(4),
  pp: 16, pfFix: 5, seuilsFix: seuils('4/8/12/16'),
  armes: [bk('Grandes cornes (3 PP pour le combat)', 3, 6, true), poing(3)],
  pouvoirs: pows('Cauchemar 2, Forme de combat 4, Membre exotique : grandes cornes, Vitesse 2'),
  talents: 'Acrobatie 5, Baratin 3, Corps à corps 3, Défense 4, Discrétion 5, Discussion 4, Intrusion 3, Médecine 3',
  notes: 'Fils de Philippe-Louis : électrocuté à 3 ans dans l\'atelier de son père, mort, puis « réanimé » par un démon. Regard dur, intelligence d\'adulte, ironique et cruel, cheveux frisés en bataille ; sait faire des yeux de biche irrésistibles pour manipuler les inconnus.\nFouine partout, a déjà entendu Domitille pratiquer la divination sans comprendre. Déteste Ludivine qui l\'observe trop, admire son arrière-grand-père, trouve Estelle divine, et rêve de savoir ce qui se passe dans le bureau de Louis-André. Ses sœurs le craignent.\nS\'il apprend l\'affaire (jeux de ses sœurs, observation), il fouine et cherche à en tirer profit.',
});

// ---------------- La victime ----------------
const hercule = npc('hercule', {
  nom: 'Hercule', source: 'Héros romain « de niveau pfff », patron de la DTC (prisonnier du téléphone)', type: 'paien', car: car('7 5 5 5 5 6'), def: L(7),
  pp: 55, pfFix: 12, seuilsFix: seuils('9/19/27/36'),
  armes: [bk('Massue magique ancienne (précision +4, puissance +9)', 10, 16, true), arme('Coup de poing', 'Coup de poing', 7)],
  pouvoirs: pows('Aura de courage 5, Champ de force 5, Contrôle des animaux 4, Immunité contre les maladies et les poisons, Membre blindé 5, Némésis 5, Régénération 5, Supériorité martiale 7, Vitesse 4, Vol 4'),
  talents: 'Art 2+ (danser le sirtaki 5), Athlétisme 9, Combat 6 (armes contondantes 8), Corps à corps 7, Défense 7, Discrétion 4, Discussion 6, Informatique 4, Métier : businessman 6, Savoir occulte 3 (marches intermédiaires 7), Technique 5 ; pouvoir propre Voyage intermarches 6 (spirituel, activé, 8 PP)',
  notes: 'Fiche du chapitre 4 (p. 21). Pendant le scénario il est enfermé dans le vieux portable, sans corps ni pouvoirs : il ne peut que parler si on met une carte SIM dans l\'appareil.\nÀ sa libération : en caleçon à poireaux, pas rasé, affamé et furieux. Sa première envie est de cogner le sorcier ; mieux vaut que les PJ restent discrets et n\'en reparlent pas.\nVoyage intermarches (pouvoir propre à Hercule) absent des règles de l\'application : noté dans les talents. Massue au format du livre 66/RU+10/M+16.',
});

// ---------------- Les autres (sans caractéristiques dans le livre) ----------------
const louisAndre = npc('louis-andre', {
  nom: 'Louis-André d\'Astelin', source: 'Sorcier, fils aîné du patriarche (68 ans) – le coupable', car: car('1+ 2 2 3 2 2'), def: L(1),
  pfFix: 4, seuilsFix: seuils('2/5/7/10'),
  armes: [poing(1)],
  talents: 'Aisance sociale 2, Baratin 2, Défense 1, Discussion 3, Intimidation 2, Savoir occulte 3 ; Basse sorcellerie 3, Haute sorcellerie 3, Pentacle 2, Invocation 2, Demande 2, Lien 2',
  notes: 'Sosie rabougri de son père : maigre (s\'est affamé enfant pour lui ressembler), 1,60 m – ne jamais évoquer sa taille –, visage en lame de couteau, regard noir, bégaie quand il s\'énerve. Héritier désigné de l\'entreprise sans jamais y travailler.\nVers 10 ans, il a trouvé au grenier le Codex Merlinus et s\'est fait un bureau-laboratoire fermé à clef sous les combles. Hait Domitille depuis toujours ; depuis qu\'il l\'a entendue prier les dieux romains il y a deux ans, il veut l\'écraser en tenant Hercule à sa merci. Se fait appeler « Louis » tout court pour entretenir la confusion avec son père.\nIncapable de se battre : il se défend par la sorcellerie, mal à l\'aise en sorts instantanés. Quelques sorciers sont invités au week-end sur sa liste.\nPas de caractéristiques dans le livre : profil de sorcier estimé d\'après Igor et Jean-Louis (« Langues et sécateur »).',
});
const catherine = civil('catherine', 'Catherine d\'Astelin (née von Irsch)', 'Épouse de Louis-André (65 ans)',
  'Bourgeoise riche et liftée, blonde de coiffeur, yeux verts, sourire figé en toutes circonstances. Mondanités, bienfaisance, médisances. Se plaint que son mari passe sa vie dans sa « cachette » du grenier : une piste involontaire. A été très surprise des assiduités de son mari la semaine où il a conçu son plan.');
const marcJean = civil('marc-jean', 'Marc-Jean d\'Astelin', 'Fils cadet du patriarche, comédien (64 ans)',
  'Seul d\'Astelin jovial : rondouillard, beau sourire, charmant et spirituel, séducteur impénitent qui a toujours refusé de se marier. Comédien parisien sans grande gloire, méprisé pour cela par son père et son frère. Affectueux envers Domitille.\nPère naturel de Bertille (une seule fois avec Estelle, alors fiancée d\'Henry) ; il en est convaincu, elle ne lui a jamais rien dit. Il est son parrain et veille sur elle. Ludivine le croit démon à tort.', { car: car('2 2 2 2 3 2') , est: 'Pas de caractéristiques dans le livre : humain moyen, Présence 3 (charme) estimée.' });
const abelard = civil('abelard', 'Abélard de la Vibère', 'Époux de Domitille, professeur de lettres anciennes (58 ans)',
  'Gringalet à lunettes, cheveux châtains frisés, honnête, distrait et rationnel au point de vouloir tout expliquer. N\'a jamais soupçonné la nature de sa femme. Louis-André a déjà tenté un sort contre sa virilité.');
const charlesLouis = civil('charles-louis', 'Charles-Louis de la Vibère-d\'Astelin', 'Fils de Domitille, jeune avocat parisien (26 ans)',
  'Baraqué comme sa mère, brun, élégant, ambitieux et travailleur ; porte le double nom par calcul (« d\'Astelin » ouvre des portes). Concilie confort bourgeois et nobles causes sous l\'influence de Ludivine. Un des six « Louis ».');
const philippeLouis = civil('philippe-louis', 'Philippe-Louis d\'Astelin', 'Fils aîné de Louis-André, ingénieur et inventeur (48 ans)',
  'Rêveur enthousiaste, cheveux frisés poivre et sel, yeux très pâles, sympathique. Ingénieur en automatismes, il bricole dans son atelier (une annexe du domaine) des machines farfelues, dont le robot Nestor. Ravi de se rendre utile, il peut prêter du matériel aux PJ. Ne parvient pas à communiquer avec son fils Louis.', { talents: 'Technique 4, Informatique 3, Électronique/robotique 4 (talents estimés)' });
const blondine = civil('blondine', 'Blondine d\'Astelin (née Dangeville)', 'Épouse de Philippe-Louis, biologiste (36 ans)',
  'Petite, ronde, brune à mèches rouges, dynamique et franche. N\'aime pas sa belle-famille ; vit dans une autre annexe du domaine. Se méfie de l\'atelier depuis l\'accident de Louis.');
const henry = civil('henry', 'Henry d\'Astelin', 'Fils cadet de Louis-André, cadre de l\'entreprise familiale (47 ans)',
  'Brave garçon effacé, sans menton, regard fuyant, mains moites, élocution confuse. Fait toujours ce qu\'on attend de lui. Croit être le père de Bertille et ignore les infidélités de sa femme.');
const estelle = civil('estelle', 'Estelle d\'Astelin (née Firambelle)', 'Épouse d\'Henry (40 ans)',
  'Très belle, grande, blond cendré, taches de rousseur ; collectionne les amants au vu de tous sauf de son mari. Bavarde incapable de se taire… sauf sur un secret : Bertille est la fille de Marc-Jean. Peut tout balancer en plein week-end. Le petit Louis la trouve divine.');
const bertille = civil('bertille', 'Bertille d\'Astelin', 'Fille d\'Estelle (et de Marc-Jean), étudiante en commerce (20 ans)',
  'Visage lourd, physique un peu mou comme Marc-Jean, énergique, colérique, blagueuse. Adore son parrain Marc-Jean et ignore qu\'il est son père. Karatéka de niveau national.\nVient présenter son petit ami Antoine à la famille, par goût de la provocation.',
  { car: car('2 3 2 2 2 2'), def: L(3), armes: [arme('Karaté (coup de pied)', 'Coup de pied', 3), poing(3)], talents: 'Corps à corps 3, Défense 3, Athlétisme 3 (estimés : karaté)', est: 'Pas de caractéristiques dans le livre : Agilité 3, Corps à corps et Défense 3 estimés (karaté).' });
const antoine = civil('antoine', 'Antoine de Saint-Louis', 'Petit ami de Bertille, musicien « rebelle » (22 ans)',
  'Fils de famille noble jouant au trotskiste aux frais de ses parents ; groupe alternatif « les Potirons des Années antérieures ». Très brun, piercings au nez et à la langue (élocution confuse), pessimiste et ironique. Le sixième « Louis » de la liste. Peut remarquer à voix haute la ressemblance entre Bertille et Marc-Jean.');
const fillettes = civil('fillettes', 'Sybille et Angeline d\'Astelin', 'Filles de Philippe-Louis (7 et 6 ans) – témoins de la capture',
  'Inséparables brunettes à nattes, curieuses, bavardes et pouffeuses ; fans d\'histoires de sorcellerie à la Harry Potter. Se méfient de leur frère Louis et du manoir, préfèrent l\'atelier de leur père.\nCachées derrière le paravent du bureau de Louis-André, elles ont tout vu (Sybille a trouvé ça drôle, Angeline bizarre) et n\'en ont parlé à personne. Elles peuvent parler à un PJ patient (interrogatoire possiblement exaspérant) ou rejouer la scène, en l\'enjolivant, dans leurs jeux.',
  { qty: 2, car: car('1 2 2 1 2 2'), armes: [], est: 'Enfants : caractéristiques estimées, sans combat.' });
const nestor = npc('nestor', {
  nom: 'Nestor', source: 'Robot expérimental de Philippe-Louis', type: 'monstre', car: car('3+ 1+ 2 1 1 1'), def: L(1), prot: 3,
  pfFix: 6, seuilsFix: seuils('5/10/15/20'),
  armes: [arme('Pince métallique', 'Coup de poing (poing américain)', 2)],
  talents: 'Corps à corps 2, Défense 1',
  notes: 'Censé avoir un semblant d\'intelligence ; les essais sont peu concluants. Diversion « Chapeau melon et bottes de cuir » : il échappe au contrôle de son créateur pendant le week-end, et les PJ peuvent le voir ou se battre avec lui. Mène à l\'atelier, à un faux coupable, ou à du matériel utile.\nAucune caractéristique dans le livre : fiche entièrement estimée (robot lourd et lent, protection 3).',
});
const domestiques = civil('domestiques', 'Domestiques et extras du traiteur', '12 domestiques du manoir + 10 serveurs de Barbak et Truffon',
  'Parmi les habituels : 3 jardiniers, 5 employés de cuisine et le majordome Armand (rigide, silencieux, prévenant). Extras et domestiques nommés : Lucie (grand sourire à bagues), Hippolyte (taches de rousseur), Morane (bob au soleil), Stéphane (petit brun maladroit), Grégory (grand blond maladroit), Estelle (zozote), Antoine (rien de spécial), Stéphanie (pipelette bouclée), Dorie (mémoire d\'éléphant).\nCouverture possible pour les PJ (embauche par le traiteur ou remplacement d\'un employé).', { qty: 4 });

const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  scene('capture', '1. Prologue : Hercule dans le portable', 'Salle de bains d\'Hercule, puis bureau secret de Louis-André au grenier du manoir d\'Astelin',
    `Scène pour le MJ (à raconter ou non aux joueurs).
Un matin, en caleçon devant son miroir, Hercule sent des fourmillements l'envahir puis disparaît : il flotte dans un néant obscur, conscient mais sans corps ni voix.
Au grenier, Louis-André a enfin réussi un sort sérieux du Codex Merlinus : une boule de brume bleue tourbillonnante de la taille d'une clémentine. Faute d'avoir lu le sort jusqu'au bout, il n'avait pas prévu de réceptacle et l'a fourrée dans le premier objet venu : un vieux portable kaki-doré à grosses touches qui traînait dans un tiroir. Fou rire nerveux, puis il descend se faire un thé.
Témoins : Sybille et Angeline, entrées dans le bureau laissé ouvert, cachées derrière le paravent en bois. Elles n'ont rien dit à personne.
Plus tard, Louis-André glisse la carte SIM de son portable actuel dans le vieux téléphone et s'appelle : Hercule répond. Louis-André se présente comme « Louis d'Astelin, ton nouveau maître » et délire sur sa sœur. Pendant ce temps Hercule navigue dans les menus et envoie au QG de la DTC un SMS tronqué (« SOS, dans un portable, Louis de quelque chose, Herc »). Louis-André s'en aperçoit trop tard, retire la SIM, enferme le vieux portable dans le long tiroir central du bureau (fermé à clef, clef dans le vase bleu ébréché posé à côté) et range son portable actuel et la carte dans un autre tiroir, séparés.`,
    [inScene(louisAndre), inScene(fillettes)]),
  scene('domitille', '2. Pendant ce temps, Domitille', 'Manoir d\'Astelin – pièce secrète de Domitille',
    `Domitille et Abélard sont au domaine depuis deux semaines (trois semaines de famille chaque année). Louis-André, d'humeur étrangement aimable, lui sourit presque.
Un matin, en lisant les entrailles d'un poulet frais, Domitille reçoit un augure net : Hercule est (ou sera) en danger, emprisonné quelque part ; elle capte les mots « SOS » et « emprisonné », rien de plus.
Au choix du MJ : elle ne comprend pas et retentera avec un autre poulet, ou elle prévient la DTC (qui la prend à la rigolade ou dont le message se perd). De toute façon on ne peut rien empêcher. Option de campagne : placer cet avertissement avant la capture, et laisser la DTC s'agiter pour rien.
Nouvelles divinations au fil du scénario : arrivée des PJ, rire sardonique de son frère, un bureau inconnu, le téléphone, Hercule quelque part dans le manoir. Elle peut alors contacter les PJ, enquêter seule ou aller casser la figure à Louis-André.`,
    [inScene(domitille)], false,
    [choice('avertissement', 'Que fait Domitille de son augure ?', [
      ['Elle prévient la DTC', 'Avertissement pris à la légère ou perdu en route ; la DTC sait au moins qu\'elle est concernée, ce qui facilite une rencontre rapide avec les PJ.'],
      ['Elle garde ça pour elle et réessaie', 'Elle mène sa propre enquête et peut prendre les PJ pour des complices du ravisseur.'],
    ])]),
  scene('briefing', '3. SOS à la DTC', 'QG de la DTC',
    `La DTC reçoit le SMS d'Hercule. Le numéro n'est pas récupérable (la transmission n'a rien eu de normal), mais l'émetteur se localise : en cherchant un « Louis de quelque chose » dans le coin, on tombe sur le manoir des d'Astelin.
Ce que savent les PJ : le lieu, la nature du problème (Hercule est dans un « portable » : téléphone ou ordinateur ?), et qu'il faut trouver un certain Louis. Hic : la famille compte six Louis (Louis-Égispée, Louis-André, Philippe-Louis, Charles-Louis, le petit Louis, et Antoine de Saint-Louis, le petit ami de Bertille).
La DTC peut apprendre l'existence du grand week-end de chasse de Pâques en enquêtant, ou un PJ peut déjà y être invité s'il fréquente la haute société.
Moyens d'entrer : se faire engager par le traiteur Barbak et Truffon, remplacer (de force) un employé, se faire passer pour un invité (risqué), se faire inviter au dernier moment par relations… (le déguisement en sanglier est déconseillé). Chaque couverture donne accès à des informations différentes : encourager les approches variées.`,
    [], false,
    [choice('couverture', 'Comment les PJ s\'introduisent-ils au manoir ?', [
      ['Engagés comme extras du traiteur', 'Accès aux cuisines, aux ragots des domestiques et aux étages pendant le service ; peu de crédit auprès de la famille.'],
      ['À la place d\'un domestique', 'Accès libre au manoir mais il faut tenir le rôle face au majordome Armand.'],
      ['Comme invités (vrais ou faux)', 'Accès aux conversations de la famille et des notables ; risque d\'être démasqués, et les démons et sorciers invités les remarqueront.'],
      ['Infiltration discrète ou en force', 'Rapide mais bruyant : la famille, les démons et l\'ange risquent de s\'en mêler.'],
    ])]),
  scene('manoir', '4. Le manoir en effervescence', 'Domaine des d\'Astelin – samedi',
    `Depuis trois jours on prépare le week-end de chasse : une centaine d'invités (affaires, politique, hauts fonctionnaires, gens de l'ombre, futurs associés), plus quelques démons invités par le patriarche et quelques sorciers conviés par Louis-André, avec épouses et enfants. Certains arrivent samedi après-midi et dorment sur place, la plupart dimanche matin.
Douze domestiques (dont 3 jardiniers, 5 en cuisine, le majordome Armand) renforcés samedi par 10 serveurs du traiteur.
Le domaine : le manoir (bureau de Louis-André sous les combles, fermé à clef ; pièce secrète de Domitille près de sa chambre), l'atelier de Philippe-Louis et la maison de sa famille dans deux annexes, piscine, tennis, écuries, forêt.
Présenter la famille (voir notes du scénario) en noyant les joueurs sous les noms à rallonge et les rumeurs. Louis-André passe ses journées dans ses livres sans trouver comment reparler à Hercule sans risque ; Hercule cherche en vain à se manifester.`,
    [inScene(egispee), inScene(louisAndre), inScene(catherine), inScene(marcJean), inScene(domitille), inScene(abelard), inScene(charlesLouis), inScene(ludivine), inScene(philippeLouis), inScene(blondine), inScene(henry), inScene(estelle), inScene(louis), inScene(fillettes), inScene(bertille), inScene(antoine), inScene(domestiques)]),
  scene('chasse', '5. Le week-end de chasse : les pistes', 'Domaine des d\'Astelin – dimanche de Pâques',
    `Chasse à courre de 8 h 30 à 13 h 30 (meute et chevaux du manoir et des invités, départs échelonnés), pendant que les dames « supervisent » le lunch. Ensuite immense lunch, jeux pour les enfants, cancans, tennis, bridge, piscine, et diplomatie de coulisses.
Coups de pouce possibles :
• Sybille et Angeline : muettes d'elles-mêmes, elles parlent à un PJ doué avec les enfants (entretien possiblement exaspérant), ou rejouent la scène dans leurs jeux de sorcières… ce qui intéresse aussi leur frère Louis.
• Domitille : la DTC sait qui elle est, d'où une rencontre rapide ; mais elle peut prendre les PJ pour des complices s'ils restent ternes, notamment lors de son affrontement avec son frère. Le MJ peut cacher aux PJ qui est l'héroïne de la famille.
• Louis-André : il pète les plombs, s'absente trop dans sa « cachette » (Catherine s'en plaint), lance des sous-entendus lourds à Domitille.
• Le petit Louis : s'il a eu vent de l'affaire, il fouine et se fait remarquer.
• Ludivine : ses pouvoirs peuvent l'avoir mise au courant ; elle aide les PJ qui viennent la voir, mais soupçonne d'abord Louis-Égispée.
• Philippe-Louis : prête volontiers le matériel farfelu de son atelier, flatté qu'on s'intéresse à lui.`,
    [inScene(fillettes), inScene(domitille), inScene(louisAndre), inScene(louis), inScene(ludivine), inScene(philippeLouis), inScene(catherine), inScene(domestiques)], false,
    [choice('piste', 'Par quelle piste les PJ remontent-ils jusqu\'au bureau du grenier ?', [
      ['Les fillettes', 'Description du rire du « grand-papa », de la boule bleue et du vieux téléphone ; Louis peut les avoir entendues.'],
      ['Domitille', 'Alliée puissante, mais elle veut régler ses comptes elle-même avec son frère.'],
      ['Catherine ou le comportement de Louis-André', 'La « cachette » du grenier désignée sans le vouloir.'],
      ['Ludivine', 'Aide angélique… et soupçons orientés vers Louis-Égispée : risque de s\'attaquer au mauvais Louis.'],
    ])]),
  scene('diversions', '6. Diversions et fausses pistes', 'Domaine des d\'Astelin – tout le week-end',
    `À utiliser pour embrouiller les PJ :
• « Amour, gloire et beauté » : révéler que Bertille est la fille de Marc-Jean et non d'Henry (doutes de Bertille confiés à quelqu'un, crise de nerfs d'Estelle qui balance tout, remarque publique d'Antoine sur la ressemblance). Un esclandre à quatre (mère, deux pères, fille) dont les PJ ne saisissent pas la cause leur fera perdre du temps.
• « Chapeau melon et bottes de cuir » : Philippe-Louis perd le contrôle de Nestor, son dernier robot ; les PJ l'aperçoivent ou s'y frottent. Mène à l'atelier, à un faux coupable, ou à du matériel utile.
• « Buffy » : les PJ démasquent la nature démoniaque de Louis-Égispée ou du petit Louis, ou la nature angélique de Ludivine, et veulent en savoir plus : échanges physiques possibles. Rappel : ni le vieux démon ni l'enfant ne sont mêlés à la capture.`,
    [inScene(nestor), inScene(egispee), inScene(louis), inScene(ludivine), inScene(estelle), inScene(marcJean), inScene(henry), inScene(bertille), inScene(antoine)], true,
    [choice('diversion', 'Quelle diversion le MJ déclenche-t-il ?', [
      ['Le secret de Bertille', 'Scandale familial : tout le monde est sur les nerfs, et le patriarche méprise un peu plus Marc-Jean.'],
      ['Nestor en liberté', 'Combat possible contre le robot ; Philippe-Louis devient un allié reconnaissant (ou un suspect).'],
      ['Démons et ange démasqués', 'Combat possible contre Louis-Égispée ou Louis ; les démons invités par le patriarche peuvent s\'en mêler.'],
    ])]),
  scene('grenier', '7. Le bureau du grenier', 'Bureau secret de Louis-André, sous les combles',
    `Pièce fermée à clef (seul Louis-André a la clef), remplie de grimoires et d'objets ésotériques, paravent en bois. Le vieux portable est dans le long tiroir central verrouillé, la clef dans le vase bleu ébréché à côté du téléphone fixe ; le portable actuel de Louis-André et sa carte SIM sont rangés séparément dans un autre tiroir.
Si Louis-André est surpris, il tente de se défendre par la sorcellerie (il est nul en combat). Une bonne bagarre finale entre Domitille et son frère pimente la scène, et la présence des démons et de l'ange de la famille peut la rendre plus chaotique.
Pour libérer Hercule (au choix du MJ, d'autres solutions sont possibles) :
• mettre une carte SIM dans le vieux portable permet au moins de lui parler ;
• rapporter l'appareil à la DTC pour qu'un spécialiste brise le sort ou en lance un autre ;
• tuer Louis-André annule le sort ;
• détruire le portable libère Hercule ;
• forcer ou persuader Louis-André de le libérer.`,
    [inScene(louisAndre), inScene(domitille), inScene(louis), inScene(ludivine), inScene(egispee)], true,
    [choice('liberation', 'Comment Hercule est-il libéré ?', [
      ['Louis-André est forcé ou convaincu', 'Le sorcier survit, humilié ; Domitille et Hercule voudront sans doute lui régler son compte.'],
      ['Louis-André est tué', 'Le sort se dissipe ; une mort dans la famille en plein week-end mondain, à couvrir.'],
      ['Le portable est détruit', 'Hercule réapparaît aussitôt, en caleçon, au milieu du grenier.'],
      ['Le portable est rapporté à la DTC', 'Libération plus lente mais sûre ; Louis-André reste libre et rancunier.'],
    ])]),
  scene('denouement', '8. Le retour du boss', 'Manoir d\'Astelin ou DTC',
    `La brume bleue se rassemble en boule, grossit dans un éclair et laisse place à Hercule en chair et en os : en caleçon à poireaux, pas rasé, sans petit déjeuner depuis des jours, humilié d'avoir été impuissant. Il veut d'abord coller son poing dans la figure du sorcier. Les PJ ont intérêt à faire profil bas, ni trop protecteurs ni goguenards, et à ne plus en parler avant longtemps.
La famille d'Astelin a peut-être perdu quelques membres ou invités en route : au MJ et aux joueurs de démêler les conséquences.
Suite de campagne : Domitille peut devenir une PNJ récurrente, passant à la DTC ; comme d'autres devins païens, elle aura des visions de dieux morts et de marches en ruines (le délitement des marches, mais surtout Victor).`,
    [inScene(hercule), inScene(domitille), inScene(louisAndre)], false,
    [choice('domitille-suite', 'Comment finit la relation avec Domitille ?', [
      ['Alliée reconnaissante', 'Elle devient une PNJ récurrente de la DTC et apportera plus tard ses visions d\'apocalypse.'],
      ['Brouillée avec les PJ', 'Elle les a pris pour des complices ou leur reproche de lui avoir volé sa vengeance.'],
    ])]),
];

const scenario = {
  id: 'pa3-coup-de-fil',
  nom: 'Petites Apocalypses – Un coup de fil à la patte',
  resume: 'Scénario pour agents de la troisième Force employés par la DTC. Hercule a été enfermé dans un vieux téléphone portable par un sorcier, Louis-André d\'Astelin, qui veut s\'en servir pour humilier sa sœur Domitille, héroïne romaine. Seul indice : un SMS tronqué signé « Louis de quelque chose »… or la famille compte six Louis. Profitant du grand week-end de chasse de Pâques au manoir, les PJ s\'infiltrent parmi une famille noble pleine de secrets, d\'un ange, de deux démons et d\'une héroïne païenne, trouvent le bon Louis et libèrent leur patron.',
  notes: `Source : ${REF} ; adaptations p. 115-116. Scénario ouvert d'enquête et de roleplay : noyer les joueurs sous les noms, rumeurs et secrets ; on peut aussi simplifier les PNJ si les histoires de famille ne plaisent pas à la table. Plusieurs dénouements possibles, aucun imposé.

Arbre généalogique :
• Louis-Égispée (90 ans, démon de Ouikka gr. 2) ∞ Ester Berthel (morte à la naissance de Domitille).
  – Louis-André (68, sorcier) ∞ Catherine von Irsch (65).
     · Philippe-Louis (48, inventeur) ∞ Blondine Dangeville (36, biologiste) → Louis (9, démon de Shaytan gr. 1), Sybille (7), Angeline (6).
     · Henry (47) ∞ Estelle Firambelle (40) → Bertille (20, en réalité fille de Marc-Jean), avec son petit ami Antoine de Saint-Louis (22).
  – Marc-Jean (64, comédien, célibataire).
  – Domitille (55, héroïne romaine) ∞ 1) Adrien Berthel, cousin, mort ; 2) Abélard de la Vibère (58).
     · Charles-Louis de la Vibère-d'Astelin (26, avocat) ∞ Ludivine Lyons (24, ange de Jordi gr. 0) → Antonin (2 ans).
Les six « Louis » : Louis-Égispée, Louis-André (le coupable, qui se fait appeler « Louis »), Philippe-Louis, Charles-Louis, le petit Louis, Antoine de Saint-Louis.

Secrets et fausses pistes : mort mystérieuse d'Ester ; Bertille fille de Marc-Jean ; infidélités d'Estelle ; nature démoniaque du patriarche et du petit Louis (étrangers à l'affaire) ; Ludivine ange ; robot Nestor de Philippe-Louis ; démons et sorciers parmi les invités.

Notes de campagne : l'avertissement de Domitille peut être placé avant le scénario ; après, elle peut revenir avec des visions de l'apocalypse à venir (Victor).

Récompenses : le livre n'en donne pas ; à fixer par le MJ.

Adaptations pour anges et démons (ch. 14, p. 115-116) : la famille compte déjà un ange et des démons, donc il faut éviter que des PJ angéliques ou démoniaques y trouvent un appui trop facile.
• MV (anges) : remplacer Hercule par un ange que le sorcier a pu « capturer » ; Ludivine cesse d'être un ange (héroïne païenne ou, à la rigueur, ange renégat).
• INS (démons) : remplacer Hercule par un démon que les PJ doivent récupérer ; transformer les démons de la famille, surtout Louis-Égispée, en autre chose (psi, héros païen, ange ou démon renégat).
• Dans tous les cas, ajuster la puissance des adversaires à celle des PJ.

Fiches : Louis-Égispée, Domitille, Ludivine et Louis sont chiffrés dans le livre ; Hercule vient du chapitre 4 (p. 21). Attaques au format du livre « seuil/RU+X/M+Y » converties en att = 2X, puissance Y. Les autres membres de la famille, le robot Nestor et les domestiques n'ont pas de caractéristiques : fiches minimales estimées (signalées dans leurs notes).`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [egispee, domitille, ludivine, louis, hercule, louisAndre, catherine, marcJean, abelard, charlesLouis, philippeLouis, blondine, henry, estelle, bertille, antoine, fillettes, nestor, domestiques].map(asType);
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));
writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types,', scenes.reduce((a, s) => a + s.choix.length, 0), 'choix');
