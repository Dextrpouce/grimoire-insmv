// Génère le fichier d'import « insmv-scenario » pour « La vengeance des lapins nains » (Angelots en gelée, scénario 5, p. 64-87)
// usage : node gen-angelots-5-lapins-nains.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);
// Fiches déjà présentes au bestiaire des livres (js/data/bestiaire.js) : reprises telles quelles via scenario.js
const store = {}; globalThis.localStorage = globalThis.localStorage || { getItem: (k) => store[k] ?? null, setItem: (k, v) => { store[k] = v; } };
const S = await import(pathToFileURL(path.join(root, 'js/scenario.js')).href);

const REF = 'Angelots en gelée, « La vengeance des lapins nains », p. 64-87';
const L = (s) => R.parseLvl(String(s));
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
const ARMES = new Map(R.ARMES.flatMap(([g, l]) => l.map((x) => [x[0], { prec: x[1], puis: x[2], melee: R.MELEE_GROUPS.includes(g) }])));
// arme de la table des règles : nom affiché, nom dans la table, niveau du talent
const arme = (n, table, lvl) => { const w = ARMES.get(table); if (!w) throw new Error('arme inconnue : ' + table); return { n, att: L(lvl), ...w }; };
// arme décrite par le livre (précision / puissance données)
const libre = (n, lvl, prec, puis, melee = true) => ({ n, att: L(lvl), prec, puis, melee });
const poing = (lvl) => arme('Coup de poing', 'Coup de poing', lvl);
const P = 'ag5-'; let n = 0; const id = (k) => P + k;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [poing(1)], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});
// fiche du bestiaire des livres, avec une id propre au scénario et des notes de scène en plus
const fromBook = (bookId, key, o = {}) => {
  const b = S.BOOK.find((x) => x.id === 'livre-' + bookId); if (!b) throw new Error('absent du bestiaire : ' + bookId);
  const t = JSON.parse(JSON.stringify(b)); delete t.book;
  return { ...t, id: id(key), qty: 1, ...o, notes: [o.notes, 'Fiche reprise du bestiaire des livres (valeurs identiques).', t.notes].filter(Boolean).join('\n') };
};

// ---------------- MRC : laboratoire et île ----------------
const zombis = npc('zombis', {
  nom: 'Zombis à la con', source: 'Figurants du labo archi-traumatisant (MRC)', type: 'mortvivant', qty: 4, car: car('2+ 1 1 1 1 1'),
  pp: 6, pfFix: 3, seuilsFix: seuils('4/8/12/16'),
  armes: [libre('Crocs', 3, 3, 1)],
  pouvoirs: pows('Élastique 2, Membre exotique : crocs'),
  talents: 'Corps à corps 3, Euuuh 3+',
  notes: 'Look « délire » : décapité tête pendue aux boyaux, gros boursouflé hérissé de lames, dix yeux et pattes d\'araignée, deux têtes à mandibules.\nChaque zombi détruit en fait surgir deux autres dans les deux tours : il vaut mieux ralentir (jambe cassée, boyaux noués, portes barricadées) que massacrer. Ils bloquent les accès et encerclent.\nDéfense non donnée : 2 (niveau 1).',
});
const bob = fromBook('bob-marley-labo', 'bob', { nom: 'Bob Marley de laboratoire', notes: 'Amas d\'organes en bocaux qui s\'assemble quand les PJ vident les étagères pour trouver le cerveau de Jo Dassin. Il serre Jo Dassin dans ses bras (« Maman ! ») une fois celui-ci réveillé.' });
const lapin = npc('lapin', {
  nom: 'Le lapin blanc', source: 'Figurant récurrent de la MRC', type: 'humain', car: car('1 2 2 1 1 1'), armes: [],
  notes: 'En tenue de condamné à mort américain dans la cellule du début. Réplique-réflexe : si on lui demande s\'il n\'est pas en retard, il hurle qu\'il l\'est, devient le lapin d\'Alice et enfonce la porte blindée. On le retrouve pendu dans la chaufferie, puis en curé qui prend les traits de Hiurzé à l\'épisode 5.\nAucune caractéristique dans le livre : fiche de figurant.',
});
const hommesNoir = fromBook('hommes-en-noir', 'hommes-noir', { qty: 6, notes: 'Patrouilles du « gouvernement » sur l\'île aux lapins nains ; les six gobelins de La Peine en portent le costard (même fiche).' });
const vampire = fromBook('vampire', 'la-peine', { nom: 'Maxime La Peine', notes: 'Boss de fin de niveau de l\'île : vampire à la cool habillé comme Brad Pitt dans Fight Club, à la solde du gouvernement. Fuit devant les lapins nains volants, puis snipe les PJ du haut d\'une grue.' });
// ---------------- Flash-back 1 : Roissy, Roubaix ----------------
const hiurze = npc('hiurze', {
  nom: 'Hiurzé (Claude Vénar)', source: 'Démon de Zanag, grade 0, chef de mission', type: 'demon', car: car('2 3 3 4 4 3'), def: L(3),
  pp: 12, pfFix: 6, seuilsFix: seuils('4/8/12/16'),
  armes: [poing(2)],
  pouvoirs: pows('Apparence angélique 1, Lire les pensées 1, Psychométrie 1, Volonté supra-normale 1'),
  talents: 'Aisance sociale 5, Baratin 7, Corps à corps 2, Culture générale 2 (église 3), Défense 3, Discussion 5, Discrétion 4, Enquête 4, Intimidation 3, Savoir d\'espion 2 (procédure angélique 3), Métier (patron véreux) 4, Séduction 5, Être faux-cul 7',
  notes: 'Prend le corps de Claude Vénar (47 ans, patron de Vénar Cie, explosifs à Roubaix) au moment où les PJ le tuent, et joue l\'ange fraîchement incarné un peu naïf. Briefé avant son incarnation, mais ne connaît pas Furfalpac.\nManager démago et hypocrite : trouve toutes les idées géniales, mais recadre sans cesse les PJ en rappelant que c\'est lui qui rédige le rapport ; déteste ses subalternes et cherche à les diviser s\'il perd la main. Ne s\'énerve jamais. Exige une chorale de chants carmélites au comité d\'entreprise.\nObsédé par le plan à la lettre : pas de négociation avec Frugz, pas question de toucher à Krueger.',
});
const chauve = npc('chauve', {
  nom: 'Le petit chauve', source: 'Agent de liaison des services d\'Andromalius', type: 'demon', car: car('2 2 3 3 2 2'), def: 2, armes: [],
  notes: 'Aborde les PJ à Roissy (Mercedes avec chauffeur, porte 16) avec un ordre de mission officiel : vérifier que l\'opération de Hiurzé ne dérape pas et dénoncer quiconque glisse vers le Bien. Laconique sur le contact de Hong Kong.\nÀ Roubaix : usine truffée de micros, camionnette gris clair à cent mètres, entretiens individuels filmés au motel pour pousser chacun à dénoncer un collègue (chaque dénonciation doit être plus grave que la précédente). Quoi qu\'il arrive, les PJ récoltent un blâme pour activités bénéfiques ; le faire disparaître leur serait imputé dans tous les cas.\nS\'éclipse cinq minutes avant Thérébanto et revient à Berlin.\nAucune caractéristique dans le livre : fiche minimale estimée.',
});
const bandiku = npc('bandiku', {
  nom: 'Édouard Bandiku', source: 'Ingénieur responsable des protocoles de sécurité, 39 ans', car: car('1 2 2 1 2 2'), armes: [],
  notes: 'Petit blond timide, tête de turc des contremaîtres, intimidé pour qu\'il se taise. Dit d\'abord que tout est normal. Une fois convaincu en douceur, il donne des ordres d\'urgence (que les PJ doivent appuyer au nom de Vénar) puis rédige un rapport chiffré à plusieurs millions : pièce idéale pour le dossier envoyé à von Michton.\nSans stats dans le livre.',
});
const noisetier = npc('noisetier', {
  nom: 'Louis Noisetier', source: 'Directeur du personnel, 42 ans', car: car('2 2 2 2 2 2'), armes: [],
  notes: 'Coureur de jupons absent du bureau, il cale les plannings sur ses maîtresses. Ami d\'enfance de Vénar, il détient les preuves de ses détournements (dettes de jeu, escort-girls, pavillon) et menace de le faire chanter. Aucun remords : −8 colonnes aux jets pour le raisonner.\nFaille : sa mère, Laurence, qu\'il respecte ; mise au courant, elle le fait culpabiliser (son père était pareil). La rédemption tient une ou deux semaines, assez pour la mission.\nSans stats dans le livre.',
});
const lapelle = npc('lapelle', {
  nom: 'Maurice Lapelle', source: 'Opérateur et délégué du personnel, 35 ans', car: car('2 2 2 2 2 2'), armes: [],
  notes: 'Mormon prosélyte, élu sur la promesse d\'un baby-foot jamais acheté, mouchard de Vénar et Noisetier. Il monte le personnel contre les consultants : au matin du deuxième jour, grève sauvage sur la rumeur d\'un plan de licenciement, une vingtaine d\'employés tentent de les séquestrer. Évitable si ses manigances sont repérées la veille. Surtout ne pas répondre par l\'intimidation (ni par la menace de faire sauter la gomme-mère).\nSans stats dans le livre.',
});
const ferkat = npc('ferkat', {
  nom: 'Marcel Ferkat', source: 'Technicien maintenance, 51 ans', car: car('2 2 2 2 2 2'), armes: [arme('Clé de dix', 'Matraque', 1)],
  notes: 'Témoin d\'une catastrophe ailleurs, seul à voir la poudrière ; suicidaire, il rêve d\'une grosse explosion. L\'arrivée des consultants le fait basculer : il peut attaquer Bandiku à la clé de dix ou tout faire sauter. Lui porter des fleurs à l\'HP impressionne favorablement l\'enquêteur angélique.\nSans stats dans le livre : clé de dix rendue en matraque.',
});
const jaline = npc('jaline', {
  nom: 'Jaline Dupin', source: 'Opératrice machine, 37 ans', car: car('2 2 2 2 2 2'), armes: [],
  notes: 'Mariée, trois enfants, réputation sulfureuse. Coup de foudre pour le consultant à la meilleure Présence, qu\'elle colle ostensiblement : les ateliers 24 à 26 crient à la promotion canapé (graffitis jusque sur sa voiture). Repoussée, elle menace d\'une rumeur de liaison et réclame un poste de contremaître.\nSans stats dans le livre.',
});
const micheline = npc('micheline', {
  nom: 'Micheline Josefa', source: 'Secrétaire et déléguée du personnel, 43 ans', car: car('2 2 2 2 2 2'), armes: [],
  notes: 'Dévouée à son patron mais toujours le mot de travers, elle attise les rancœurs. Vénar veut qu\'elle dirige la chorale (elle a tenté le conservatoire) : tournée de recrutement dans l\'usine, où les « petits fours après la chorale » marchent mieux que les primes (qui créent des jalousies).\nSans stats dans le livre.',
});
const egwael = npc('egwael', {
  nom: 'Egwael (Herr von Michton)', source: 'Ange d\'Yves, grade 1', type: 'ange', car: car('3 3 3 5 4 5'), def: L(3),
  pp: 17, pfFix: 8, seuilsFix: seuils('6/12/18/24'),
  armes: [poing(3), libre('Eau bénite', 4, 2, 5, false)],
  pouvoirs: pows('Esprits multiples 2, Jet d\'eau bénite 1+, Philosophie 3+, Polymorphie 1, Volonté supra-normale 2'),
  talents: 'Aisance sociale 7, Baratin 4, Corps à corps 3, Culture générale 4 (philosophie 5), Défense 3, Discussion 7+, Enquête 5, Langues (anglais, espagnol, français), Métier (patron honnête) 4, Savoir occulte 2 (conspis 3), Séduction 4, Tir 1+ (jet d\'eau bénite 4), Avoir la larme à l\'œil 5',
  notes: 'Industriel allemand de la chimie, 40 ans, grand, blond et gras, regard d\'adolescent fougueux et sérénité de vieillard. Persuade les conseils d\'administration d\'investir dans la sécurité plutôt que dans les profits (Philosophie). Sa présence calme tout le monde.\nVient visiter Vénar Cie le troisième jour, interroge le personnel et prend un consultant à part ; craque au concert de la chorale quand Vénar lui parle en angélique. Organise ensuite le test de Berlin et le séminaire de St Bobitz.\n« Esprit multiple » du livre rendu par Esprits multiples.',
});
const therebanto = npc('therebanto', {
  nom: 'M. Thérébanto', source: 'Ange de Dominique, grade 1 (enquêteur de moralité)', type: 'ange', car: car('3 3 3 4 4 4'), def: 2,
  pp: 15, pfFix: 7, seuilsFix: seuils('6/12/18/24'),
  armes: [libre('Matraque télescopique', 3, 0, 1), arme('Petit calibre', 'Revolver petit calibre', 3)],
  pouvoirs: pows('Détection du mal 1, Détection du mensonge 1, Jugement 2, Psychométrie 2'),
  talents: 'Aisance sociale 4, Athlétisme 2, Baratin 3, Combat 2 (matraque 3), Conduite 3, Discussion 5, Enquête 6, Informatique 3, Savoir d\'espion 3 (écoutes 4), Tir 2 (armes de poing 3)',
  notes: 'Petit joufflu entre Kojak et Yves Duteil, flic à la retraite. Débarque le soir du troisième jour après que von Michton a signalé une erreur de dossier céleste ; fouille tout, chez Vénar comme à l\'usine (présenté comme agent d\'assurances). Avec Enquête 6, il relève toutes les bourdes des PJ ; sauf grosse boulette, « Bandiku reprend les commandes + Noisetier se repent » le persuade que Vénar est un ange.\nDéfense non donnée : 2 (niveau 1).',
});
// ---------------- Flash-back 3 : Berlin, Moskar Club ----------------
const krueger = fromBook('ange-laurent-1', 'krueger', { nom: 'Hans Krueger', notes: 'Grand blond façon hard rocker des années 80, exterminateur qui ne pense qu\'en termes de grosse épée. Remet à Vénar l\'ordre de mission de Berlin et attend en planque devant le Moskar ; n\'intervient que si Vénar est en danger. Revient en escorte d\'un ange de Walther (exorcisme de Hiurzé) ou avec vingt costards dans les raccords.' });
const frugz = fromBook('demon-samigina-1', 'frugz', { nom: 'Max Frugz', notes: 'Démon de Samigina, contact de mission et maître du Moskar Club (squat d\'artistes, dancefloor électro-goth au sous-sol). Dandy égocentrique à la cool, sauf énervé. Dort debout dans un cercueil à serrure de coffre (crochetage très difficile, ou microcaméra sur la combinaison) où il garde le CD volé.\nPrêt à rendre le CD si un PJ arrive à le craquer et le copier (difficulté Incroyable) avant l\'expert de Vapula attendu dans deux jours. Drague tout PJ de Présence supérieure à 3. Les cambrioleurs surpris ont droit à une opposition physique.' });
const vampirettes = fromBook('vampirette', 'vampirettes', { nom: 'Vampirettes', qty: 6, notes: 'Une demi-douzaine d\'humaines accros au Baiser vampirique de Max, persuadées d\'appartenir à la Mascarade. Gardent les caves (chacune a une clé de la porte blindée) et font des allers-retours toute la nuit. Sensibles aux pouvoirs, mais gros malus pour les convaincre d\'agir contre Max.' });
const zielbleth = fromBook('demon-malphas-0', 'zielbleth', { nom: 'Zielbleth', notes: 'Petite vieille d\'apparence inoffensive, venue avec Mörmun et Gerojug chercher un briefing auprès de Max (qui doit alors ouvrir son cercueil). Malins, vicelards et coopératifs, ils jouent les zélés serviteurs et repèrent tout ce qui cloche.' });
const mormun = fromBook('demon-abalam-0', 'mormun', { nom: 'Mörmun', notes: 'Grand sec qui a l\'air attardé ; même groupe que Zielbleth et Gerojug.' });
const gerojug = fromBook('demon-asmodee-0', 'gerojug', { nom: 'Gerojug', notes: 'Ado nerd accro aux jeux vidéo ; même groupe que Zielbleth et Mörmun.' });
const hilda = fromBook('demon-mariejolie-1', 'hilda', { nom: 'Yoztkx, dite Hilda', notes: 'Secrétaire SM explosive venue s\'éclater : cherche avec son pouvoir de grade le partenaire idéal, peut-être un PJ. Plutôt du côté de Max, sauf si elle découvre un démon de Marie Jolie parmi les PJ (solidarité de prince).' });
// ---------------- Flash-back 3 : séminaire de St Bobitz ----------------
const costards = fromBook('costards-oreillettes', 'costards', { qty: 10, notes: 'Vingt soldats de Dieu chargés de « protéger » les séminaristes : ils collent les PJ (cuisines interdites, murs à ne pas escalader…), guidés par la vidéosurveillance piratée depuis la piscine d\'été. Ressemblent étrangement aux hommes en noir de la MRC. Quantité de scène à ajuster (jusqu\'à 20).' });
const hutenbois = npc('hutenbois', {
  nom: 'Mlle Hutenbois', source: 'Ange de Novalis, grade 1 (ONG Citoyen du Globe)', type: 'ange', car: car('3 3 4 3 5 4'), def: L(6),
  pp: 20, pfFix: 6, seuilsFix: seuils('6/12/18/24'),
  armes: [poing(5)],
  pouvoirs: pows('Augmentation de Force 2, Aura de pacification 2+, Pollen 3, Vol 1'),
  talents: 'Aisance sociale 3, Athlétisme 4, Baratin 3+, Corps à corps 5, Culture générale 3 (écologie 6), Défense 6, Discussion 4+, Discrétion 4, Informatique 3, Intimidation 3, Séduction 4, Survie 3 (montagnes 4), Hobby (alpinisme) 4, Mettre en avant son physique explosif 4',
  notes: 'Superbe blonde enthousiaste aux tenues moulantes, « intervenante extérieure » qui colle les PJ pendant l\'aparté Vénar / von Michton. Ne se fâche que pour rire ; sa force augmentée lui donne un air de miss Hulk. Refuse que les costards fassent sauter la barque au fond du lac (l\'écosystème !) et impose son avis d\'un flash d\'aura. Son discours du lendemain retourne les séminaristes.\n« Augmentation temporaire de force » du livre rendue par Augmentation de Force.',
});
const peltonnel = npc('peltonnel', {
  nom: 'Peltonnel (Miss Rightway)', source: 'Ange de Marc, grade 2, coordinateur du réseau', type: 'ange', car: car('3 3 4 5 4 6'), def: L(5),
  pp: 25, pfFix: 8, seuilsFix: seuils('6/12/18/24'),
  armes: [libre('Club de golf', 4, 0, 0)],
  pouvoirs: pows('Caméléon 1, Charme 3+, Contrat divin 4, Détection du mensonge 3, Esquive acrobatique 1, Lire les pensées 3, Trait d\'énergie 2+, Vitesse 1'),
  talents: 'Aisance sociale 8, Baratin 5, Combat 2 (armes improvisées 4), Corps à corps 2+, Culture générale 4 (économie 8), Défense 5, Discrétion 2, Discussion 8, Enquête 6, Informatique 4, Langues (allemand, français, espagnol), Métier (finances) 6, Séduction 5, Rester digne et raide 6',
  notes: 'LA cible : vieille retraitée anglaise enrichie sur les fonds de pension avant sa révélation, entre Thatcher et Ally McBeal ; conduite quasi exemplaire, seuls travers le thé et le golf. Mène pour Marc une mission au long cours : rendre aux patrons d\'Europe du Nord leur libre arbitre face aux services d\'Uphir, de Mammon et de Marie Jolie.\nSe montre au séminaire le lendemain matin ; les courbettes de Hutenbois et von Michton la désignent. La zapper rapporte +8 PA.',
});
const elim = npc('elim', {
  nom: 'Elim', source: 'Ange de Blandine, grade 2 (ami des rêves divins)', type: 'ange', car: car('2 4 4 4 4 6'), def: L(3),
  pp: 34, pfFix: 6, seuilsFix: seuils('5/10/15/20'),
  armes: [poing(3)],
  pouvoirs: pows('Sommeil 4, Rêve 4, Rêve divin 6'),
  talents: 'Aisance sociale 3, Athlétisme 2, Baratin 4, Corps à corps 3, Culture générale 3 (jeux vidéo 4), Défense 3, Déguisement 4, Discussion 8, Discrétion 5, Hobby (relaxation) 5, Narcolepsie 6, Savoir occulte 4 (MRC 6), Séduction 8, Fantasmer sur sa sœur et sur les démons 5, Siphon onirique 3 (pouvoir)',
  notes: 'Faux jumeau androgyne de Jyel, déguisé en serveur. Piège Hiurzé par Rêve divin, puis aspire les PJ dans le rêve de Vénar par Siphon onirique 3 (usage hors normes : sans jet, il tombe à 4 PP par démon aspiré, d\'où « 34 (0) PP » dans le livre). Jet résisté Siphon contre Foi : un seul jet pour Elim, un par PJ ; la meilleure marge devient démiurge de la bulle. Peut fouiller leur mémoire (pas la modifier) pour trouver Furfalpac.\nDans la MRC, c\'est la blonde du labo puis de l\'épisode 5 (il pirate le physique de Hutenbois et assouvit ses fantasmes). 28 SR.\nSiphon onirique absent des règles : noté dans les talents.',
});
const jyel = npc('jyel', {
  nom: 'Jyel', source: 'Ange de Blandine, grade 2', type: 'ange', car: car('3 4 4 4 4 5'), def: L(6),
  pp: 23, pfFix: 7, seuilsFix: seuils('6/12/18/24'),
  armes: [poing(4)],
  pouvoirs: pows('Charme 2, Invisibilité 1, Sommeil 3, Rêve 3, Rêve divin 4'),
  talents: 'Aisance sociale 4, Athlétisme 3, Baratin 4, Corps à corps 4, Défense 6, Déguisement 3, Discussion 6, Discrétion 4, Hobby (relaxation) 4, Hypnotisme 5, Narcolepsie 5, Savoir occulte 2 (MRC 4), Séduction 5, Veiller sur Elim 7',
  notes: 'Sœur d\'Elim, passe son temps à couvrir ses écarts. Maintient Elim en rêve éveillé par hypnose pour suivre la séance ; coupe le contact si le rêve dérape vers l\'érotisme. 18 SR.',
});
// ---------------- Hong Kong et final ----------------
const furfalpac = npc('furfalpac', {
  nom: 'Furfalpac', source: 'Baron d\'Uphir, industriel hongkongais (commanditaire)', type: 'demon', car: car('3 3 3 5 5 4'), def: L(4),
  armes: [],
  notes: 'Chinois obèse en kimono, il a briefé les PJ à Hong Kong (souvenir effacé, rejoué au flash-back 0). Veut faire éliminer le coordinateur du réseau angélique qui lui gâche ses affaires. Après Berlin, il appelle les PJ dans le dos de Hiurzé : rester en ligne à l\'arrivée pour être localisés, photographier la cible et la transmettre (mail, fax, portable) à ses « troupes », les ninjas de Bélial. Impatient, menaçant.\nS\'il est localisé par les anges, il se fait zapper (−8 PA).\nAucune caractéristique dans le livre : niveaux estimés, à compléter (baron = grade 3).',
});
const ninjas = npc('ninjas', {
  nom: 'Stupides ninjas', source: 'Démons de Bélial punis, grade 1', type: 'demon', qty: 10, car: car('4 4 3 3 4 3'), def: L(7),
  pp: 16, pfFix: 7, seuilsFix: seuils('6/12/18/24'),
  armes: [arme('Katana', 'Espadon ou katana (à deux mains)', 6)],
  pouvoirs: pows('Adhérence 1, Immunité contre le feu, Incendie 1, Invisibilité 1, Jet de flammes 2, Vitesse 1'),
  talents: 'Acrobatie 6, Athlétisme 6, Combat 3 (katana 6), Conduite 3, Corps à corps 4, Défense 7, Discrétion 6, Savoir militaire 3, Séduction 4, Tir 5 (jet de flammes 5+), Faire le ninja 2',
  notes: 'Dix anciens traîtres repentis (cf. Fire and Ice) forcés de porter un costume de ninja dès la nuit tombée. Font le minimum, grillent leurs PP pour sauver leurs fesses puis se taillent. Arrivent une heure après la transmission de la cible, l\'exterminent et repartent sans s\'occuper des PJ restés sur place.\nLimitation : peur irraisonnée du feu.\nPP mal lisibles sur le scan : 16 estimé.',
});

const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  scene('labo', '1. Labo archi-traumatisant (MRC)', 'Bulle de rêve collectif – laboratoire de savants fous',
    `Ouverture « in medias res » : les PJ se réveillent sans souvenirs dans une cellule de béton de 3 × 3, porte blindée, caméra, gémissements en boucle. Un lapin blanc en tenue de condamné à mort fait les cent pas.
Sortir : test de Force incroyable, pouvoir acide, ou le « mot de passe » (demander au lapin s'il n'est pas en retard → il fonce et la porte s'ouvre). Un PJ qui se croit en rêve peut aussi trouver la réplique par Narcolepsie. Au pire, un zombi finit par venir chercher le lapin.

Décor (à alterner) : corridors suintants (1 zombi), labos d'expériences (2) avec savant fou opérant un captif qui réclame qu'on le remette sur la table, zones de stockage (2) aux bocaux d'organes, zones prison (1) avec un captif qui veut retourner dans son placard. Armes improvisées et chimie à disposition (un cocktail peut souffler une pièce).
Gérer la progression comme un long combat en tours (1 action par tour) ; préférer la finesse au massacre (les zombis se multiplient).

Puzzle :
1. Apprendre ce que cherchent les savants (on n'obtient rien par la torture ; il faut nouer le contact). Invasion de lapins nains qui forniquent partout : le savant interdit de les tuer sauf légitime défense. Crier « ils nous attaquent ! » fait apparaître de grosses armes façon South Park ; après le carton, le savant demande pourquoi les morts reviennent. Variante : un PJ s'offre comme assistant.
2. La réponse : le labo est bâti sur un cimetière indien (ou « quand l'Enfer est plein, les morts reviennent »). Indices : squelette de Scoubidou enchaîné et ses griffures → escalier vers la chaufferie, lapin pendu, fantôme de Gaulois pleurnichard qui avoue ne pas pouvoir rejoindre les morts.
3. Dire le secret aux savants : ils montrent un corridor caché vers une salle de torture médiévale où Jo Dassin, crâne vidé, est sanglé sur la machine à électrocuter. C'est lui qui ouvre la sortie.
4. Trouver son cerveau derrière les bocaux de la réserve : les organes jetés au sol s'assemblent en « Bob Marley de laboratoire » qui poursuit les PJ.
À part : derrière une vitre incassable, une blonde ligotée appelle au secours (si on l'atteint, la table devient une rose géante qui l'engloutit). C'est le témoin de l'ange (Elim) qui s'amuse.

Cerveau remis en place : arc électrique, un mur s'efface sur un escalier, flash → flash-back 2. Au retour (0,8), Jo Dassin reconnaît « Maman » en Bob Marley, la voie est libre, bruit d'un Boeing en approche.`,
    [inScene(lapin), inScene(zombis, { qty: 4 }), inScene(bob)], true,
    [choice('labo', 'Comment les PJ obtiennent-ils le secret du labo ?', [
      ['En jouant la légitime défense contre les lapins', 'Le savant les remercie et leur confie la question à résoudre.'],
      ['Un PJ devient assistant', 'Le savant explique ses recherches et l\'envoie à la chaufferie (plomb à changer).'],
      ['En massacrant les lapins sans être « attaqués »', 'Le savant se plaint du gouvernement et ne dit rien : passer par Scoubidou et le fantôme.'],
    ])]),
  scene('pavillon', '2. Pavillon classe (flash-back 2)', 'Pavillon kitsch isolé dans la campagne près de Roubaix',
    `Courte description, sans initiative : les PJ viennent de tuer Claude Vénar, patron d'une usine d'explosifs de Roubaix, qui gît en convulsions sur le tapis. Il se relève et les salue en démoniaque, prêt à se mettre au boulot.
Puis retour au labo (fin de la scène 1).
Les PJ ne savent pas encore pourquoi : c'est le flash-back 1 qui l'expliquera (ils y reconnaîtront ce pavillon sans pouvoir s'en souvenir en jeu).`),
  scene('mission', '3. La mission (flash-back 1)', 'Roissy-Charles-de-Gaulle, puis Roubaix',
    `Informations (sans souvenir de la MRC) : retour de Hong Kong, où un contact dont ils ne se soucient pas les a briefés. Mission officielle avec sceau : infiltrer le réseau d'anges qui soustrait les patrons d'Europe du Nord aux services d'Uphir et de Marie Jolie, localiser et faire disparaître son coordinateur.
Moyen : dossiers complets sur Herr von Michton (industriel chimiste qui convertit les actionnaires à la sécurité : sans doute un ange) et sur Claude Vénar. Hiurzé, démon de Zanag, va prendre le corps de Vénar pour se faire passer pour un ange tout juste incarné et solliciter le réseau de von Michton pour sauver l'usine. Il sera le chef ; les PJ couvrent ses arrières. Chacun porte une alliance de Non-détection 4.
Ce soir, Vénar est seul chez lui (femme sortie, fils en pension) : le tuer pour que Hiurzé s'y installe.

Action : à la sortie, le petit chauve d'Andromalius les embarque en Mercedes, montre son ordre de mission de surveillance et les accompagne à Roubaix. Le meurtre ne pose aucun problème (c'est le pavillon du flash-back 2).
Hiurzé s'incarne au dernier souffle de Vénar et expose son planning dans l'heure :
• couverture : les PJ deviennent les consultants RH de Vénar (CV à arrondir : humains au passé louche, touchés par la rencontre d'un être extraordinaire) ;
• Vénar cherche un repreneur, harcèle banquiers et von Michton au téléphone en patron en détresse ;
• les PJ doivent faire « le Bien » à l'usine en en laissant le mérite à Vénar, et monter une chorale de chants carmélites via le comité d'entreprise.
Yvette Vénar rentre (un PJ de Perception supérieure à 3 sent sur elle un musc masculin).
Si les joueurs refusent le scénario : annexe « antijeu » (notes du scénario).`,
    [inScene(chauve), inScene(hiurze)], false,
    [choice('fb1', 'Les PJ suivent-ils l\'ordre de mission ?', [
      ['Oui, Vénar est tué et Hiurzé s\'incarne', ''],
      ['Non (chauve tabassé, fausse piste…)', 'Raccord « clinique » : accélérer le temps, puis un grade 2 d\'Andromalius les renvoie à Roubaix avec −5 PA et un avertissement sans frais chacun.'],
    ])]),
  scene('usine', '4. Vénar Cie (flash-back 1, suite)', 'Usine de traitement de pâte de dynamite, Roubaix (site SEVESO)',
    `L'usine : recyclage de gomme-mère (Superdopatex, Duracuire 700) et stock sauvage de munitions de 14-18. Une centaine d'employés, sous-effectif, sécurité ignorée grâce aux arrangements de la famille avec l'administration. Hangar de tri et hangar de traitement reliés par des chariots filoguidés souterrains, une quarantaine d'ateliers chacun, bâtiment administratif à l'écart, R&D dans le hangar de traitement, six vigiles seulement.
Les PJ ont l'autorité du patron. Ils voient vite la poudrière : clé tombée dans le malaxeur, un opérateur pour quatre machines, maintenance en pleine production, piétons sur les voies des chariots. Avec plus de 3+ dans la compétence adaptée, inutile de lancer les dés face à des humains. Hiurzé connaît tout le monde par la mémoire de Vénar.

Personnel (fiches) : Bandiku (sécurité, à remettre en selle en douceur), Noisetier (DRH qui fait chanter Vénar ; passer par sa mère), Lapelle (délégué mormon : grève sauvage le 2e jour), Bonzigue (vieux contremaître buveur, suit le meneur ; rallié par un baby-foot), Ferkat (technicien suicidaire), Jaline Dupin (coup de foudre encombrant), Micheline Josefa (secrétaire maladroite, cheffe de chorale).
Règle d'or : pas d'intimidation ni de vice, Vénar doit rester l'ange sympa et naïf.

Vénar expert : l'usine devrait être sur la bonne voie dès le 1er ou 2e jour ; faire défiler le temps et relancer les problèmes restants (rancœur contre Jaline, gendarmes après l'acte de Ferkat). Les démons peuvent souffrir de faire le bien (mauvaise humeur, tics). Ils peuvent aussi faire le ménage dans le carnet d'adresses de Vénar (escort-girls, casino et recouvreurs, club de notables, Yvette).
Faille du plan : Notre-Dame n'a aucune trace d'un ange incarné à Roubaix. Hiurzé jouera la victime d'une erreur administrative ; ne pas laisser les PJ s'enliser dans des arnaques compliquées.
Le chauve en tapisserie : micros, camionnette gris clair, entretiens filmés au motel pour pousser aux dénonciations en cascade. N'y entrer sous aucun prétexte : blâme pour activités bénéfiques assuré, pire en cas de délation ; le supprimer leur serait reproché dans tous les cas.
Le soir du 2e jour, Hiurzé annonce la visite de von Michton.`,
    [inScene(bandiku), inScene(noisetier), inScene(lapelle), inScene(ferkat), inScene(jaline), inScene(micheline), inScene(hiurze), inScene(chauve)], false,
    [choice('greve', 'La grève sauvage du deuxième jour a-t-elle lieu ?', [
      ['Non, Lapelle a été repéré la veille', ''],
      ['Oui, et les PJ la désamorcent en douceur', ''],
      ['Oui, et ils intimident ou menacent de tout faire sauter', 'Boulette : couverture de Vénar abîmée, à compenser par une bonne action avant l\'enquête de Thérébanto.'],
    ]),
    choice('noisetier', 'Noisetier est-il ramené dans le droit chemin ?', [
      ['Oui, grâce à sa mère', 'Rédemption d\'une ou deux semaines ; épisode que Hiurzé ressortira dans la MRC comme « bonne action » des PJ.'],
      ['Non', 'Il menace de faire chanter Vénar : risque pour la couverture.'],
    ]),
    choice('ferkat', 'Que devient Ferkat ?', [
      ['Il est apaisé ou soigné (fleurs à l\'HP)', 'Très bon effet sur l\'enquête de moralité.'],
      ['Il agresse Bandiku ou tente de tout faire sauter', 'Gendarmerie sur place ; l\'usine peut sauter.'],
    ])]),
  scene('michton', '5. Visite de von Michton et enquête de Thérébanto', 'Vénar Cie, Roubaix – 3e et 4e jours',
    `Rencontre avec von Michton : il arrive seul, en taxi, de bon matin. Il compte faire reprendre l'usine par un groupe « ami » (trois mois au moins). Enjeu : qu'il croie Vénar ange.
Visite de l'usine avec les consultants : Vénar enchaîne les banalités, les PJ montrent les ruines et le stock d'explosifs et contiennent le personnel s'il est mécontent ; von Michton interroge les employés. Il prend un consultant à part pour savoir si Vénar n'est pas un peu fêlé de montrer tous les défauts de l'affaire (perche tendue : y répondre bien).
Concert de la chorale carmélite (un carnage) : von Michton pleure, Vénar lui glisse quelques mots en angélique, il tombe dans le panneau. Longue conversation privée, puis départ : il rappellera pour un rendez-vous à Berlin.

Attente de contact (à jouer plus ou moins longuement) : von Michton signale à Notre-Dame un nouveau venu victime d'une erreur de dossier ; Thérébanto (Dominique) débarque le soir du 3e jour, fouille vie privée et usine, interroge le personnel. Chaque boulette doit être compensée par une bonne action attribuée à Vénar. Si les PJ sont partis en vrille, rien ne les sauve (annexe).
Le chauve disparaît cinq minutes avant son arrivée. Couper ensuite brutalement : les PJ courent dans l'escalier du labo (retour MRC).`,
    [inScene(egwael), inScene(therebanto), inScene(hiurze)], false,
    [choice('therebanto', 'Thérébanto est-il convaincu que Vénar est un ange ?', [
      ['Oui', 'Von Michton rappelle Vénar pour un rendez-vous à Berlin.'],
      ['Non, les PJ sont grillés', 'Raccord « clinique » : Hiurzé est cueilli dans son pavillon et livre les PJ contre son exfiltration ; ils sont siphonnés chez lui (voir notes).'],
    ])]),
  scene('ile', '6. L\'île aux lapins nains syndicalistes (MRC)', 'Bulle de rêve – forêt de nuit, donjon, port de fret',
    `Les objets du labo ont disparu. Figurants gentils : archétypes de MMORPG médiéval-fantastique (troll, magicien, ranger, gobelin malin) qui cherchent l'entrée du donjon et des compagnons, dans une langue incompréhensible sauf Langage universel, Culture générale (MMORPG) ou un magicien traducteur. Guerriers : ex-manutentionnaires de La Peine (son donjon cache la seule porte de sortie de l'île). Rangers : pistent les hommes en noir. Gobelins : veulent savoir où est le labo sans aider. Obstacles : hommes en noir. Opportunités : lapins nains syndicalistes (« négative attitude »).
Événement 1, le troll : seul troll connecté, il cueille des fleurs et parle clairement. Une patrouille le recherche (il refuse de combattre les lapins nains, prime de La Peine). Le livrer = être guidés au donjon ; le protéger ne rapporte rien.
Événement 2, le donjon : La Peine harangue six gobelins en costard d'homme en noir et veut enrôler les PJ contre l'assaut des lapins. Nuée de lapins nains volants : il fuit par un passage secret vers une zone de fret portuaire.
2 bis, massacre de figurants : chaque figurant éclaté donne un niveau de Forme de combat (permanente) : les PJ deviennent costauds et monstrueux.
Événement 3, règlement de comptes : La Peine rameute les patrouilles et snipe du haut d'une grue. Fuir par un hors-bord à quai.`,
    [inScene(hommesNoir, { qty: 6 }), inScene(vampire)], true,
    [choice('troll', 'Les PJ livrent-ils le troll ?', [
      ['Oui', 'La patrouille les guide jusqu\'au donjon de La Peine.'],
      ['Non', 'Ils n\'y gagnent rien.'],
    ])]),
  scene('berlin', '7. En voiture ! Le Moskar Club (flash-back 3)', 'Berlin : hôtel Alexander Platz, puis Moskar Club',
    `48 h après la visite, von Michton donne rendez-vous à Vénar à Berlin ; Hiurzé emmène ses consultants avec un van de planque, matériel audio/vidéo courte portée, armes légères (fusils d'assaut, grenades) et plans du quartier. Il porte un micro et ordonne aux PJ de rester invisibles. Le chauve refait surface : à eux de le convaincre qu'il est de trop.
À l'hôtel : c'est Hans Krueger qui attend Vénar (la scène d'ouverture du livre, vue de l'autre côté) avec un ordre de mission test : au Moskar, remplacer le CD volé par Max Frugz (infos sur les anges de la région) par un faux, sans que Frugz s'en aperçoive. Krueger attend dehors.

Le Moskar : entrepôt de l'ère communiste devenu squat (ateliers, greniers à toxicos, prostituées, artistes, truands) sous la coupe de Frugz ; s'y faire accepter suppose d'être présenté et de lui plaire. Sous-sol en dancefloor électro-indus-goth, facile d'accès la nuit ; de jour, entrées barricadées du rez-de-chaussée.
Planque de Max : caves labyrinthiques par une porte blindée du sous-sol ou une porte de service sur le métro ; salons privés, salle de briefing, sauna, chambre aux deux cents CD, cercueil à serrure de coffre et double fond (le vrai CD).
Hiurzé : squatte le dancefloor et laisse le travail aux PJ ; pas de négociation avec Max, pas question d'écarter Krueger, échange à l'insu de Max.
Max : prêt à rendre le CD contre une copie craquée (difficulté Incroyable) avant l'expert de Vapula, mais ce serait négocier dans le dos de Hiurzé. Invités ce soir : Zielbleth, Mörmun et Gerojug (briefing qui oblige Max à ouvrir son cercueil) et Hilda.

Résultats : CD ramené = von Michton satisfait. Frugz zappé = suspect (un ange tout neuf qui tue un quasi grade 2 ?), sauf si Krueger s'en est chargé (échec, mais rattrapé si Vénar a le CD). Les anges ne remarquent pas tout de suite sa mort, mais Samigina enquêtera et remontera aux PJ (mille ans de larve dans le Styx).
Conclusion : von Michton invite Vénar et ses consultants à un séminaire, rendez-vous à l'aéroport de Milan sous 24 h. Furfalpac appelle alors les PJ dans le dos de Hiurzé : ne rien lui dire, rester en ligne à l'arrivée pour être localisés, photographier la cible et la transmettre.`,
    [inScene(krueger), inScene(frugz), inScene(vampirettes, { qty: 6 }), inScene(zielbleth), inScene(mormun), inScene(gerojug), inScene(hilda), inScene(hiurze)], true,
    [choice('cd', 'Comment se règle l\'affaire du CD ?', [
      ['CD échangé à l\'insu de Max', 'Mission réussie : invitation au séminaire.'],
      ['Copie négociée avec Max', 'Réussite, mais dans le dos de Hiurzé ; une copie aux mains de l\'Enfer vaut +1 PA au barème.'],
      ['Max zappé par les PJ', 'Von Michton a des doutes ; Samigina finira par remonter jusqu\'aux PJ.'],
      ['Krueger a dû intervenir', 'Échec, rattrapé si Vénar rapporte le CD (von Michton plaide pour lui).'],
    ]),
    choice('furfalpac', 'Les PJ acceptent-ils le marché de Furfalpac ?', [
      ['Oui', 'Ils restent en ligne et devront transmettre la photo de la cible aux ninjas.'],
      ['Non, ou ils préviennent Hiurzé', 'Le baron menace de mort et de sanctions hiérarchiques.'],
    ])]),
  scene('bobitz', '8. Au pays des youyous (flash-back 3, suite)', 'St Bobitz (Alpes suisses), Grand Hôtel des Douches',
    `Milan, minibus, train de 1re classe, minibus : séminaire « le rôle des patrons dans l'Europe de demain », sponsorisé par six grandes sociétés où le réseau a des contacts. Une centaine de patrons venus pour le cinq étoiles, le golf et le casino, mains baladeuses comprises. Peltonnel veut tester Vénar et, avec deux anges de Blandine en renfort, retoucher la mémoire des patrons les plus récalcitrants.
Hôtel : salons, bars, restaurants, piscine, sauna ; la piscine d'été (annexe en verrière) est fermée au public : QG des anges, qui y piratent la vidéosurveillance. Von Michton seul en apparence, huit patrons acquis animent les groupes de travail, vingt costards-oreillettes collent les PJ.
Après le dîner, Vénar et von Michton s'isolent ; Mlle Hutenbois colle les PJ.

Hiurzé se fait piéger, inévitablement : drogué au dîner, Elim (serveur, sous hypnose de Jyel) l'attire par Rêve divin, découvre un démon ; Peltonnel veut connaître son contact, Hiurzé l'ignore, les anges se rabattent sur les PJ. Convoqués au salon, ils trouvent Vénar dormant les yeux ouverts et sont aspirés par Siphon onirique (voir fiche d'Elim : jet résisté Siphon contre Foi, la meilleure marge devient démiurge).
Option, les démons rentrent dans le tas : dès qu'ils se dévoilent, les anges tentent de les capturer discrètement. Hiurzé est pris quoi qu'il arrive ; il faut au moins un PJ capturé, les autres deviennent des chimères qui fuient en lapins nains et le PJ capturé joue seul la suite.
Option, escamotage linéaire : jouer jusqu'à ce que ça parte en vrille, puis couper et envoyer en MRC (décrire le siphonnage plus tard, flash-back 3,5).`,
    [inScene(egwael), inScene(hutenbois), inScene(costards, { qty: 10 }), inScene(elim), inScene(jyel), inScene(hiurze)], true,
    [choice('siphon', 'Qui remporte le jet résisté Siphon onirique contre Foi ?', [
      ['Elim', 'Elim est démiurge : avec une marge d\'au moins 2 contre un PJ, celui-ci livre l\'identité et la localisation de Furfalpac.'],
      ['Un PJ', 'Le PJ est démiurge : il peut modifier une fois décor et figurants, et utiliser Rêve ou Cauchemar contre Elim.'],
    ]),
    choice('demasques', 'Les PJ se sont-ils dévoilés à l\'hôtel ?', [
      ['Non, ils sont restés humains lambda', ''],
      ['Oui', 'Au réveil : option « démasqués » (hors-bord sur le lac).'],
    ])]),
  scene('boss', '9. Who is the boss ? (MRC) et Hong Kong (flash-back 0)', 'Bulle de rêve – lac de St Bobitz, puis Hong Kong',
    `Fuite de l'île en bateau : le ciel se brise comme un vitrail, plein jour sur le lac. Sur la rive, les séminaristes en toges blanches attendent devant un autel ; le lapin blanc en curé arrive en retard et prend les traits de Hiurzé pour prêcher.
Si Elim est démiurge : les PJ gardent la forme monstrueuse de l'île, Hiurzé les accuse de tous les maux, les séminaristes fuient. La blonde du labo (Elim) plaide pour eux : Hiurzé rappelle une bonne action à Vénar Cie (Noisetier…) et la blonde tente de leur faire avouer qu'ils ont aimé faire le Bien (pur roleplay). Avec une marge de 2 contre un PJ, celui-ci révèle le contact.
Si un PJ est démiurge : apparences normales, Elim discute pour le sport ; le démiurge remodèle une fois décor et figurants (sans les contrôler), peut retourner ses pouvoirs de rêve contre Elim et découvrir qui est le coordinateur et où il est.
Dans les deux cas, Cthulhu surgit du lac et balaie tout à coups de tentacules.

Hong Kong (flash-back 0, dans la MRC) : limousine, Furfalpac obèse en kimono répète la mission, dévoile son aura de baron dans une cour néo-traditionnelle… des ninjas surgissent (« encore ces renégats ! ») et se font exploser dans une baston sanglante. Si un PJ dévoile l'identité du baron, c'est que la blonde, invisible pour Furfalpac, était là.
Flash-back 3,5 (option) : si ce n'est pas encore fait, décrire comment les PJ ont été siphonnés.`,
    [inScene(lapin), inScene(furfalpac), inScene(ninjas, { qty: 4 })], true,
    [choice('contact', 'Les anges ont-ils appris l\'identité de Furfalpac ?', [
      ['Oui', 'Il sera zappé rapidement : −8 PA au barème.'],
      ['Non', ''],
    ])]),
  scene('final', '10. Réveil : une vieille querelle (présent)', 'Grand Hôtel des Douches et lac de St Bobitz',
    `Pour la première fois, les PJ jouent dans le présent. Fin ouverte selon les options.
Dans tous les cas : un PJ à 0 SR se réveille à 0 PP ; les autres avec les PP restants de leur fiche flash-back 3 (moins ce qu'un démiurge a dépensé). Ceux qui ont réussi un jet de Narcolepsie pour sortir se réveillent un peu avant les autres (surprise possible).

Option, démasqués par Elim ou dévoilés à l'hôtel : réveil ligotés sur deux hors-bord avec dix costards et Hutenbois. Les costards veulent couler le bateau des PJ et le faire exploser au fond ; Hutenbois refuse (écosystème) et l'emporte. On repart vers une rive tranquille au pied des montagnes pour les fusiller : de quoi improviser. Puis encore démasquer Peltonnel.
Option, Elim entourloupé : à court de PP, il dort ; rapport « RAS » puis rêve érotique, Jyel a coupé. Les anges croient les PJ humains manipulés par Hiurzé, transporté à la piscine d'été (un ange de Walther arrive sous 12 h avec Krueger pour l'exorciser). Von Michton cherche à remettre les PJ dans le droit chemin. Le lendemain, Hutenbois retourne les séminaristes ; Peltonnel apparaît et éblouit par sa science financière, les salamalecs la désignent comme la cible.
La cavalerie : les dix ninjas de Bélial interviennent une heure après la transmission de la photo ; ils tuent la cible à coup sûr puis repartent. Mauvaise photo ou PJ encore sur place : gros ennuis.`,
    [inScene(peltonnel), inScene(hutenbois), inScene(costards, { qty: 10 }), inScene(egwael), inScene(ninjas, { qty: 10 }), inScene(krueger)], true,
    [choice('cible', 'Que devient Peltonnel ?', [
      ['Zappée (ninjas ou PJ)', '+8 PA.'],
      ['Elle survit', 'Aucun PA pour la cible.'],
    ])]),
  scene('bilan', '11. Conclusion et barème', 'Après la mission',
    `Barème (cumulable) :
• Peltonnel zappé : +8 PA
• Par autre ange exterminé : +1 PA
• Par démon exterminé (hors PJ) : −1 PA
• Copie du CD de Frugz aux mains de la hiérarchie démoniaque : +1 PA
• Furfalpac localisé par les anges (il sera zappé) : −8 PA
Les alliances de Non-détection tombent en poussière à la fin du scénario.
Penser au blâme du chauve pour activités bénéfiques, et à l'enquête de Samigina si Frugz a été zappé par les PJ.`, [], false,
    [choice('furfalpac-fin', 'Furfalpac a-t-il été localisé par les anges ?', [
      ['Non', ''],
      ['Oui', '−8 PA : le baron se fait zapper rapidement.'],
    ])]),
];

const scenario = {
  id: 'angelots-5-lapins-nains',
  nom: 'Angelots en gelée – La vengeance des lapins nains',
  resume: 'Scénario INS pour démons de grade 0. Mission pour Furfalpac, baron d\'Uphir : couvrir Hiurzé, démon de Zanag qui joue l\'ange incarné dans le corps d\'un patron d\'usine d\'explosifs de Roubaix, pour remonter jusqu\'au coordinateur d\'un réseau angélique (Peltonnel, ange de Marc) par l\'intermédiaire d\'Egwael (von Michton, ange d\'Yves). Les PJ commencent capturés dans un rêve collectif (MRC) où un ange de Blandine fouille leur mémoire : épisodes délirants dans le rêve (labo de zombis, île aux lapins nains syndicalistes, lac de St Bobitz) alternant avec des flash-backs de la mission (Roissy et Roubaix, Berlin, séminaire en Suisse), jusqu\'au réveil dans le présent.',
  notes: `Source : ${REF}. Pour démons de grade 0 et MJ expérimenté. Ton parodique, références pop.

Structure : le scénario se joue dans le désordre. Les PJ débutent dans la MRC sans souvenirs ; chaque épisode de rêve se conclut par un flash-back joué normalement, comme un puzzle de mémoire. Ordre du livre : labo (MRC) → flash-back 2 (pavillon) → fin du labo → flash-back 1 (Roissy, Roubaix, usine, von Michton, Thérébanto) → île aux lapins nains (MRC) → flash-back 3 (Berlin, Moskar) → flash-back 3 suite (St Bobitz, siphonnage) → Who is the boss (MRC) → Hong Kong (flash-back 0) → réveil dans le présent. Les tests d'opposition ange contre démons ne se font qu'après tous les flash-backs.
En flash-back, les personnages ne se souviennent pas de la MRC ; de retour dans la MRC, ils se souviennent de ce qu'ils viennent de revivre.

Règle propre : la Marche des rêves collective (MRC) (résumé, d'après Les Petites Apocalypses)
• Un rêve est une bulle dans la MRC. L'inconscient du rêveur en est le démiurge (décor, ambiance, figurants) ; son conscient est un témoin. Plusieurs témoins peuvent partager une bulle (rêve collectif), attirés par certains pouvoirs ou de force.
• Dans la bulle, les PJ utilisent caractéristiques, talents et pouvoirs comme d'habitude, sauf les pouvoirs spirituels ; les PP y sont considérés comme non dépensés.
• Dès qu'ils se savent en rêve, ils gagnent une réserve de Substance Rêve (SR, à calculer en secret) : SR = Volonté + (niveau de Narcolepsie + Volonté supra-normale + Rêve + Cauchemar) + 2 × (niveau de Rêve divin ou Cauchemar mortel) + 3 × (grade du pouvoir de domaine de Beleth), chaque terme seulement si le personnage l'a. Seuls ceux qui ont la compétence Narcolepsie peuvent dépenser de la SR.
• Narcolepsie, seuls usages possibles dans cette bulle : créer un objet de taille standard (clé, arme, hachoir…) : test standard, −1 SR · sortir le bon mot de passe indiqué dans le scénario : standard, −1 SR · charmer un figurant : difficile, −2 SR · éviter une blessure physique (chute, poignard dans le cœur) : difficile, −2 SR · faire apparaître un éléphant rose inutile : standard, −1 SR · modifier la déco d'une pièce : difficile, −2 SR · modifier l'architecture d'une pièce (mur, sol, plafond ; pas de téléportation sur une plage) : incroyable, −4 SR.
• Tenter de se réveiller par Narcolepsie ou tomber à 0 SR : rien sur le moment, conséquences au réveil (0 SR = réveil à 0 PP ; réveil réussi = un peu d'avance sur les autres).
• Rêve, Cauchemar et Cauchemar mortel des PJ ne servent à rien ici (sauf pour un PJ démiurge à la fin).
• Deux feuilles par PJ : un état MRC et un état flash-back, chacun avec ses PP, blessures et récupérations. Les compteurs ne se remettent pas à zéro en passant de l'un à l'autre ; pas de récupération dans la MRC hors régénération par PP et pouvoirs d'absorption.
• Sous-titres du livre : Informations (ce que les PJ savent d'office au début d'un flash-back), Description (saynète sans initiative), Action (jeu normal).

Histoire secrète : Egwael (von Michton, ange d'Yves, grade 1) pousse les industriels de la chimie à respecter la sécurité, contre l'influence d'Uphir. Furfalpac, baron d'Uphir et industriel hongkongais, veut éliminer son supérieur, Peltonnel (ange de Marc, grade 2, en vieille retraitée anglaise), qui coordonne une offensive douce de Marc sur le patronat nord-européen. Il a obtenu un démon de Zanag, Hiurzé, pour infiltrer le réseau en ange fraîchement incarné dans un patron corrompu au bord de la faillite (Claude Vénar), les PJ servant d'intérimaires pour l'incarner et le couvrir. Au séminaire de St Bobitz, Hiurzé est démasqué et les anges de Blandine Elim et Jyel aspirent les PJ dans un rêve pour trouver leur commanditaire.
Ouverture du livre : la rencontre de Vénar et Hans Krueger à Berlin, vue côté démons (à lire ou paraphraser au début du flash-back 3).

Annexe « antijeu du vendredi soir » (raccords si les joueurs sabotent ou partent en vrille) :
• Flash-back 1 clinique, refus d'aller à Roubaix : les laisser s'agiter, accélérer le temps (2 min réelles par jour), constater qu'ils n'ont rien, puis un grade 2 d'Andromalius les renvoie à Roubaix avec −5 PA et un avertissement sans frais chacun.
• Flash-back 1 clinique, n'importe quoi à Vénar Cie : von Michton les démasque ; puis Thérébanto, puis Krueger ; grosse baston à l'usine. Si les PJ capturent un ange, Furfalpac envoie un démon de Beleth fouiller sa mémoire dans la MRC, l'épisode de l'île est rejoué avec un avatar de l'ange captif à la place de La Peine, et les PJ apprennent où trouver Peltonnel (hôtel des Douches, avant le séminaire, en négociation avec des anges de grade 1 de Laurent, Michel et Dominique ; les ninjas s'y font ramasser). S'ils sont capturés à court de compteurs (Krueger et vingt costards), on joue les épisodes 2 et 3 de la MRC, Jyel use de Rêve divin sur l'un d'eux, et ils se réveillent en train de couler au large de Dunkerque, avec un échec à expliquer.
• Flash-back 1 et 3 clinique, grillés malgré leurs efforts : Hiurzé, cueilli par les anges, livre les PJ contre son exfiltration ; convoqués chez lui, ils le trouvent endormi et sont siphonnés. On joue la MRC restante et le test contre Elim ; au réveil, face à Krueger, von Michton, Hutenbois, Elim et Peltonnel : passer dans le camp d'en face (Contrat divin) ou baston finale.
• Linéaire : jouer les épisodes de la MRC puis un flash-back expliquant le siphonnage (une des options, ou le 3,5). Les PJ ne jouent le présent qu'une fois la MRC terminée.

Récompenses : barème de la scène 11.
Fiches : PNJ chiffrés du livre (p. 68, 70, 77-80, 85-87). Dix fiches reprises du bestiaire des livres (Bob Marley de laboratoire, hommes en noir, Maxime La Peine, Krueger, Frugz, vampirettes, Zielbleth, Mörmun, Gerojug, Hilda, costards-oreillettes). Furfalpac, le chauve, le lapin blanc et le personnel de Vénar Cie n'ont pas de stats : fiches minimales. Défense non donnée : 2.`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [zombis, bob, lapin, hommesNoir, vampire, hiurze, chauve, bandiku, noisetier, lapelle, ferkat, jaline, micheline, egwael, therebanto,
  krueger, frugz, vampirettes, zielbleth, mormun, gerojug, hilda, costards, hutenbois, peltonnel, elim, jyel, furfalpac, ninjas].map(asType);
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));
writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types,', scenes.reduce((s, x) => s + x.choix.length, 0), 'choix');
