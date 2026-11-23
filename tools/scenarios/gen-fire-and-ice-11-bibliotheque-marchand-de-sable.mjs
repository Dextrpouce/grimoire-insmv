// Génère le fichier d'import « insmv-scenario » pour « La Bibliothèque du Marchand de Sable » (Fire and Ice 2, p. 35-50, + Tempus Fugit p. 153-154)
// usage : node gen-fire-and-ice-11-bibliotheque-marchand-de-sable.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const store = {}; globalThis.localStorage ??= { getItem: (k) => store[k] ?? null, setItem: (k, v) => { store[k] = v; }, removeItem: (k) => { delete store[k]; } };
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);
const S = await import(pathToFileURL(path.join(root, 'js/scenario.js')).href);

const REF = 'Fire and Ice 2, « La Bibliothèque du Marchand de Sable », p. 35-50';
const L = (s) => R.parseLvl(String(s)); // « 2+ » → 5
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
const ARMES = new Map(R.ARMES.flatMap(([g, l]) => l.map((x) => [x[0], { prec: x[1], puis: x[2], melee: R.MELEE_GROUPS.includes(g) }])));
const arme = (n, table, lvl) => { const w = ARMES.get(table); if (!w) throw new Error('arme inconnue : ' + table); return { n, att: L(lvl), ...w }; };
const poing = (lvl) => arme('Coup de poing', 'Coup de poing', lvl);
let n = 0; const id = (k) => `fi11-${k}`;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [poing(1)], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});
// fiche toute prête du bestiaire de l'application (troupes de ce volume déjà saisies)
const fromBest = (key, bookId, o = {}) => {
  const b = S.BOOK.find((x) => x.id === 'livre-' + bookId); if (!b) throw new Error('bestiaire : ' + bookId);
  return { ...JSON.parse(JSON.stringify(b)), id: id(key), qty: 1, ...o, notes: [o.notes, b.notes, `Utilisé dans : ${REF}.`].filter(Boolean).join('\n') };
};

// ---------------- Le Centre de Tri : fiches de référence (Fire and Ice, « Le Centre de Tri », p. 24-26) ----------------
const REF_CDT = 'Fire and Ice, « Le Centre de Tri », p. 24-26';
const FICHES = {
  fabien: { nom: 'Monsieur Fabien', source: 'Démon de Baalberith, grade 2 (chef du Centre de Tri)', type: 'demon', car: car('2 2 5 4 2 4'), def: 2, pp: 24, pfFix: 6, seuilsFix: [4, 8, 12, 16],
    armes: [{ n: 'Coup de poing', att: 2, prec: 0, puis: -3, melee: true }],
    pouvoirs: pows('Message officiel, Télépathie 5, Boomerang 3, Cauchemar 3, Onde de choc 2, Téléportation 2, Corps gazeux, Détection du futur proche 2, Volonté supra-normale 2'),
    talents: 'Métier (administration) 7, Discussion 6, Baratin 4 ; avantage matériel : le Centre de Tri',
    note: 'Vétéran débonnaire, pipe, anecdote laponne. Secret : remplacé par Beleth (« le Grand Imposteur ») quelques semaines après l\'arrivée des PJ.' },
  gilbert: { nom: 'Gilbert', source: 'Démon de Morax, grade 1 (Centre de Tri)', type: 'demon', car: car('3 2 4 4 3 3'), def: 2, pp: 18, pfFix: 7, seuilsFix: [5, 10, 15, 20],
    armes: [{ n: 'Coup de poing', att: 2, prec: 0, puis: -3, melee: true }],
    pouvoirs: pows('Œuvre d\'art, Télépathie 4, Jet de flammes 2, Sommeil 2, Invisibilité 1, Vitesse 1, Vol 1'),
    talents: 'Tartiner de la poésie 7, Trier du courrier 3, Conduite 4, Pilotage 3, Tir 2+ ; avertissement sans frais : gentil',
    note: 'Délégué CGT, gardien des lettres non distribuées, poète médiocre, habitué de Chez Régis ; bavard une fois éméché. Secret : s\'est perdu un jour dans un dédale lumineux sous les caves.' },
  aurelie: { nom: 'Aurélie', source: 'Démon de Baalberith, grade 0 (secrétaire du Centre de Tri)', type: 'demon', car: car('3 3 3 5 2 2'), def: 2, pp: 10, pfFix: 8, seuilsFix: [5, 10, 15, 20],
    armes: [{ n: 'Corps à corps', att: L('3+'), prec: 0, puis: -3, melee: true }],
    pouvoirs: pows('Message officiel, Charme 2+, Lire les pensées 2, Télépathie 1, Polymorphie 1'),
    talents: 'Corps à corps 3+, Baratin 4+, Hobby (vélo) 3',
    note: 'Secrétaire bavarde et épuisante, chef en second ; fait chaque matin à vélo la tournée des boîtes aux lettres secrètes. Secret : membre infiltrée du Daemonis Maleficum, meurtrière de Vanessa.' },
};
const cdt = (key, scen) => {
  const f = FICHES[key];
  return { id: id(key), nom: f.nom, source: f.source, type: f.type, qty: 1, car: { ...f.car }, def: f.def, prot: 0, pfFix: f.pfFix, pp: f.pp, seuilsFix: [...f.seuilsFix],
    armes: JSON.parse(JSON.stringify(f.armes)), pouvoirs: JSON.parse(JSON.stringify(f.pouvoirs)), talents: f.talents, esquive: false, volonte: false,
    notes: [scen, f.note, `Caractéristiques : ${REF_CDT}.`].filter(Boolean).join('\n') };
};
const fabien = cdt('fabien', 'Dans ce scénario : boit des bières de Noël avec les PJ et Gilbert au Chez Régis, leur présente Nielle (« au service de Blandine ») et leur rappelle l\'enquête de routine sur Gabriel Leminor. C\'est en réalité Beleth : il sort du bistrot en dernier et profite de la faille qu\'il crée pour expédier les PJ dans la MRC.\nAu retour, déboule dans la cave du CdT vers 10 h : la trace de Yolande est retrouvée, départ immédiat pour la Suisse (enchaîne sur « Run like Hell »). Écoute à peine le récit des PJ et l\'attribue à une farce des anges de Blandine.');
const gilbert = cdt('gilbert', 'Dans ce scénario : a invité les PJ à boire une mousse de fin de journée au Chez Régis ; il sort le premier du bistrot (il n\'est pas expédié dans la MRC). Au retour, accueille comme Fabien le récit des PJ avec scepticisme.');
const aurelie = cdt('aurelie', 'Dans ce scénario : n\'apparaît qu\'au retour au Centre de Tri ; comme ses collègues, écourte les confidences des PJ sur leur séjour onirique.');

// ---------------- PNJ du scénario ----------------
const nielle = npc('nielle', {
  nom: 'Nielle (Niels, Nihil, Neil)', source: 'Démon de Beleth, grade 2 – surveillant de la MRC', type: 'demon', car: car('2 5 3+ 5 2 4'), def: 2,
  pp: 22, pfFix: 7, seuilsFix: seuils('4/8/12/16'),
  pouvoirs: pows('Cauchemar mortel 5, Sommeil 4, Cauchemar 3, Télépathie 3, Trait d\'énergie 3, Non-détection 3'),
  talents: 'Écrire des histoires qui déchirent leur mère 6, Vol onirique 6, Sonner une cloche en chocolat 5, Écumer des bouges infâmes 5, Piloter une montgolfière des rêves 5, Baratin 4, Tilleul-menthe 4',
  notes: 'Look « old rock\'n\'roll » immuable : cheveux longs, perfecto, santiags, lunettes de soleil même la nuit. Ancien alcoolique, ne boit plus que des tisanes tilleul-menthe. Dort vingt heures par jour : il vit surtout dans la MRC, où il écrit des récits de voyage qu\'il rêve de publier.\nRôle : en mission pour Beleth, il joue quatre personnages. Au Chez Régis, il se présente comme Nielle, serviteur de Blandine, et raconte avoir vu Gabriel nu sur une plage de Biarritz brandir une épée de feu entourée de petites sphères lumineuses. Dans la MRC, il devient Niels (aveugle du clocher, Toujours-Noël), Nihil (indic au Stinkin\' Blue Boy, WIP) puis Neil (montgolfière, Warp Zone) ; il nie toujours avoir déjà croisé les PJ, mais les aide à garder le fil.\nPas de talent de combat ni de Défense dans le livre : défense 2, coup de poing par défaut. Allié des PJ : ne pas le placer dans un combat.',
});
const meuf = npc('meuf', {
  nom: 'La meuf (Princesse Noire, Blackie, Noire Sœur d\'Icare)', source: 'Fantasme princier – projection onirique de l\'amour défunt de Belial et Crocell', type: 'monstre', car: car('2 4 3 3 6 4'), def: 2,
  pfFix: 5, seuilsFix: seuils('3/6/9/12'), armes: [],
  talents: 'Séduction 7+, Discussion 5',
  notes: 'Grande jeune femme à la peau sombre, cheveux bruns ondulés, yeux en amande, toujours les yeux fermés. Irradie la pureté ; torturée par sa condition : elle refuse d\'être l\'enjeu d\'une guerre fratricide entre les deux princes.\nIncarnations : la Princesse Noire qui pleure endormie dans sa cabane (Toujours-Noël, avec deux bols : une flamme bleue et un cube de glace qui ne fond pas) ; Blackie, top-modèle des affiches du WIP, dont l\'image parle depuis les écrans de sa suite ; la Noire Sœur d\'Icare qui tombe sans fin dans le ciel de la Warp Zone.\nElle fait partie du « fil » qui guide les PJ. Belial tente de l\'invoquer sur Terre (trois échecs : les corps d\'accueil brûlent).\nCh reportée en Foi. Pas d\'arme ni de Défense : défense 2.',
});
const habitants = npc('habitants', {
  nom: 'Hob, Mondine, Gédéon, Crutburge, Twiddledum…', source: 'Habitants du Pays du Toujours-Noël', type: 'humain', qty: 4, car: car('2 3 3 3 2 2+'),
  pfFix: 5, seuilsFix: seuils('3/6/9/12'),
  talents: 'Rigoler 5, Faire des gâteaux 6, Se marrer 5, Pelleter de la neige bleue 5, Se poiler 5, Jouer de la musique 4, Se fendre la gueule 5',
  notes: 'Lutins d\'un mètre aux joues roses et cheveux paille, feutre vert ou rouge, bonnets à grelots, noms ridicules. Une demi-douzaine de pères Noël plus grands et ventrus complètent la population. Hospitaliers, joyeux en permanence, totalement dépourvus de compassion ; ne savent pas qu\'ils sont des rêves.\nCh reportée en Foi. Pas d\'arme ni de Défense : coup de poing et défense 2 par défaut.',
});
const loups = fromBest('loups', 'loup-mrc', {
  qty: 2, notes: 'Bêtes disproportionnées au pelage noir, yeux rouges et crocs jaunes, nées des peurs ancestrales humaines. Toujours en meute (au moins deux). Nombre presque infini : un nouveau loup surgit 1D6 minutes après la mort du précédent. Craignent le feu (torches) ; on peut aussi les survoler en traîneau.',
});
const faune = fromBest('faune', 'faune-wip', {
  nom: 'John Smith, Kurt « The Blade », Cynthia Langour, BabylonFucker…', qty: 4,
  notes: 'Stéréotypes cyberpunk qui surjouent les durs à cuir et parlent un argot de téléfilm (« choomba »). Exemples : Pamela du Last Chance Bar, Dick le mercenaire au bras mécanique, Johnson le costard-cravate, Marley le taxi rasta, Zu le CharcuDoc, Void le dealer de MétaAmphets, Youri le hacker des RazorBladeFuckers. Sert aussi pour robots vigiles, dealers, gangsters et milices de sécurité.\nTalents complémentaires du livre : Être un vrai CyberDur/une vraie CyberPouffe 4, Ne jamais sortir sans son ParaPluie 4.',
});
const mercs = npc('mercs', {
  nom: 'Mercs CyberBoostés', source: 'Gardes du Fire & Ice Hotel (WIP)', type: 'humain', qty: 4, car: car('4 3 3 2 2 1+'), def: L(4), prot: 4,
  pfFix: 6, seuilsFix: seuils('5/10/15/20'),
  armes: [arme('Fusil-mitrailleur', 'Fusil-mitrailleur', 4), arme('Poing cybernétique', 'Coup de poing (poing américain)', 4)],
  talents: 'Corps à corps 4, Défense 4, Tir 2 (armes automatiques 4), StreetWise 3, Être un tas de muscles en armure 5',
  notes: 'Une vingtaine de « tas de muscles en armure totale » qui gardent la suite de Blackie au Fire & Ice Hotel, à la frontière du centre et des NéoBidonVilles.\nPas de caractéristiques dans le livre : fiche estimée à partir de la faune du WIP (Force, armure totale en protection 4, fusil-mitrailleur).',
});
const pirates = fromBest('pirates', 'pirates', {
  nom: 'Suce-Tripes, Brise-Burnes, Pète-Tibias, Ratatine-ta-Gueule…', qty: 4,
  notes: 'Équipage du Hollandais Violent (trois-mâts volant) : une demi-douzaine de loups de mer balafrés et édentés. Filets dérivants bleu ciel (trois adultes par filet) et harpons ; capturent les badauds, les dépouillent et les jettent par-dessus bord pieds et poings liés. Le chef, Ratatine-ta-Gueule, a un bandeau, une jambe de bois et un perroquet bavard, Bernard-Henri.\nTalent complémentaire du livre : Distiller de l\'alcool de nœud de bois 5.',
});
const yves = npc('yves', {
  nom: 'Yves', source: 'Archange des Sources, bibliothécaire de l\'Univers (Mikaël)', type: 'ange', armes: [],
  notes: 'Petit, fin, cheveux dressés sur la tête, lunettes et redingote. Propriétaire omniscient de la Bibliothèque du Marchand de Sable. Remet à Gabriel son agenda (le livre de ce qui doit advenir) et l\'épée de flammes : l\'heure de Gabriel est venue.\nInvite ensuite les « invisibles témoins » à descendre, les regarde longuement, une larme à l\'œil, puis les guide entre les rayons jusqu\'à une allée droite : « tout droit, sans vous arrêter ni vous retourner ». Réponses allusives ou silence.\nL\'attaquer relève du suicide ; fuir ne sert à rien (les étagères bloquent le passage).\nFiche minimale (pas de caractéristiques dans le livre).',
});
const gabriel = npc('gabriel', {
  nom: 'Gabriel (« le Grand Blond »)', source: 'Archange du Feu, dans la MRC sous forme de rêve conscient', type: 'ange', armes: [],
  notes: 'Très grand, musclé, cheveux longs presque blancs, yeux très clairs, longue épée lumineuse sous son pardessus. Parcourt consciemment la MRC depuis plusieurs nuits à la recherche d\'Yves (« grand, très mince, cheveux blancs, petites lunettes, toujours un livre à la main ») : c\'est sa trace que suivent les PJ (le Grand Blond au Toujours-Noël, le Blondin businessman au WIP, l\'élève pilote de la Warp Zone).\nDans la Bibliothèque, il confie à Yves que Samaël refuse de revenir ; il lit son agenda (Sodome, l\'Annonciation, les sourates…), reprend l\'épée, embrasse Yves et s\'en va : ils ne se reverront qu\'une fois.\nPas d\'interaction directe prévue avec les PJ. Fiche minimale (pas de caractéristiques dans le livre).',
});

// Le bestiaire joint (types réutilisables) : mêmes fiches, sans quantité
const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });

// ---------------- Scènes ----------------
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  scene('regis', '1. Christmas time au Chez Régis', 'Chez Régis, Paris – soirée (J1)',
    `Le bistrot du Nazaréen fête Noël : Jésus tire des bières de Noël sous un bonnet à pompon, les clients lui souhaitent un bon anniversaire, Tino Rossi à la sono, pain d'épice et guirlandes. Moins de monde que d'habitude depuis la guerre, mais anges et démons s'y sourient toujours.
Les PJ y ont été invités par Gilbert ; Monsieur Fabien les rejoint. Moment calme pour faire le point sur la campagne : Fabien et Gilbert rappellent des détails oubliés et éclairent d'anciennes missions.
Vers la troisième bière, entre un homme en blouson de cuir, lunettes noires de nuit, cheveux bruns aux épaules. Fabien va lui parler puis le présente : Nielle, serviteur de Blandine. Devant sa tisane tilleul-menthe, il raconte avoir vu il y a deux semaines, sur une plage de Biarritz, un homme immense, blond, peau mate, yeux clairs, se déshabiller et tirer de son manteau une épée lumineuse entourée de sphères où l'on devine des silhouettes. Il a fui, terrifié.
Fabien fait le lien : c'est Gabriel Leminor, sur qui les PJ ont enquêté au début de la campagne ; c'est bien l'archange Gabriel, et il a retrouvé son épée de feu. Occasion de rappeler qui est Gabriel (Annonciation, Islam, lutte contre Laurent, la Chute…).
Secret MJ : Nielle est un démon de Beleth et « Fabien » est Beleth lui-même. Toute la scène est une comédie pour mettre les PJ sur la piste de Gabriel.
Sortie : Fabien laisse passer Gilbert, puis passe la porte juste devant les PJ ; Jésus leur souhaite un joyeux Noël. En sortant, léger picotement : Beleth a ouvert une faille très brève et le bistrot (Marche indépendante) est raccordé un instant à la MRC. Les PJ se retrouvent dans la neige d'une forêt de sapins, sous un ciel étoilé ; plus aucune trace du Chez Régis ni de pas derrière eux. En contrebas, une ville de chalets illuminés ; un traîneau tiré par quatre rennes passe au-dessus d'eux (« Ho ! Ho ! Ho ! »).`,
    [inScene(fabien), inScene(gilbert), inScene(nielle, { nom: 'Nielle' })]),
  scene('noel', '2. Le Pays du Toujours-Noël : le village et Niels', 'MRC – poche du Pays du Toujours-Noël, le village et le clocher',
    `Règles de la MRC à expliquer en jeu : les PJ y sont sous forme physique (tests habituels, dégâts et mort réels, retour en Enfer en cas de décès). Leurs objets les suivent, mais un objet posé disparaît vite. Impossible d'invoquer des armes magiques, d'appeler son supérieur ou de téléphoner. Impossible de se réveiller : il faut trouver une sortie. Changer de lieu se fait par la volonté, mais errer de bulle en bulle est très dangereux (un rêveur peut vous garder ou vous tuer) ; le plus sûr est de passer de poche en poche par leurs portes.
Le fil : trois éléments récurrents guident les PJ de poche en poche : le démon de Beleth (sous différents noms), la trace de Gabriel et une incarnation de la meuf. Les perdre de vue, c'est s'égarer.
La poche : vallée encaissée couverte de conifères, bourgade d'une centaine de chalets, nuit perpétuelle, guirlandes, odeur de bois et de pot-au-feu. Les habitants maternent les visiteurs (luge, bonhommes de neige, couettes épaisses). Détails irréels : neige bleu pastel au goût de glaçage, qui ne fond pas ; lune qui fait des clins d'œil. Des enfants rêveurs en baskets jouent avec les lutins (vrais gamins endormis sur Terre, sans aide possible). Adapter à la date : l'activité est maximale entre fin novembre et début janvier.
Renseignements des habitants : un Grand Blond est passé (« il y a un an », « hier »…), une Princesse Noire pleure dans sa chaumière au fond de la forêt ; pour le reste, « demandez à Niels », l'aveugle du clocher. Ils fournissent une carte absurde de la forêt (une tache grise et un pointillé de « Ici » à « Là-bas »), indispensable pour ne pas errer 1D6 heures. Ils redoutent la forêt à cause des loups.
Niels : six cents marches, sous une cloche géante en chocolat ; habits de cuir sombre et lunettes aux verres de bois. Après les politesses (tisane, tarte, bisou ?), il se présente comme démon de Beleth chargé de la MRC, nie avoir vu les PJ au Chez Régis, leur explique la MRC en version simplifiée et insiste sur l'importance du fil. Sorties : d'abord le Trou au Renard dans la forêt ; sinon le Puits Gelé, le Miroir de la Mère Noëlle et le Cratère de Fromage Lunaire.
Gabriel : le Grand Blond a longuement questionné les habitants sur un ami à lui (grand, mince, cheveux blancs, petites lunettes, toujours un livre) ; apprenant qu'il n'y avait pas de livres ici, il est parti par la forêt.`,
    [inScene(nielle, { nom: 'Niels (Nielle)' }), inScene(habitants)], false,
    [choice('porte-noel', 'Par quelle issue les PJ quittent-ils le Toujours-Noël ?', [
      ['Le Trou au Renard (suivre le fil)', 'Ils traversent la forêt et ses loups jusqu\'à la cabane de la Princesse Noire, puis rampent jusqu\'au WIP (scènes 3 à 5).'],
      ['Le Puits Gelé, le Miroir de la Mère Noëlle ou le Cratère de Fromage Lunaire', 'Mauvaise porte : improviser un ou deux univers transitoires inquiétants (le Cauchemar dans le Placard…) avant de les raccrocher au WIP ; Niels peut les rappeler à l\'ordre au dernier moment.'],
      ['Marcher tout droit hors de la poche', 'Ils s\'égarent dans des bulles hostiles : même traitement, en plus dangereux.'],
    ])]),
  scene('foret', '3. La forêt des loups', 'MRC – Pays du Toujours-Noël, forêt de sapins',
    `Partie la plus ardue du séjour : des loups géants, parasites venus des cauchemars voisins, rôdent entre les sapins. Ils chassent en meute d'au moins deux.
Leur nombre est presque infini : un nouveau loup surgit 1D6 minutes après la mort du précédent. Les combattre jusqu'au bout est donc vain.
Solutions : grosses torches (ils craignent le feu), éviter la forêt en la survolant (traîneau de père Noël emprunté), ou foncer vers la cabane avec la carte des habitants. Sans carte, retour en ville après 1D6 heures d'errance.`,
    [inScene(loups, { qty: 3 })], true),
  scene('cabane', '4. La cabane de la Princesse Noire et le Trou au Renard', 'MRC – Pays du Toujours-Noël, clairière au fond de la forêt',
    `Charmante bicoque aux fenêtres en cœur, adossée à une colline ; juste au-dessus du toit s'ouvre un tunnel où un adulte passe à quatre pattes : le Trou au Renard. Des sanglots s'échappent de la chaumière ; personne ne répond, mais il suffit de vouloir entrer pour que la porte cède.
Dedans, sur un lit entouré de tapis brodés, une splendide jeune femme noire dort et pleure sans fin. Sur la table de chevet, deux bols de terre : l'un porte une petite flamme bleue sans combustible, l'autre un cube de glace parfaitement pur qui ne fond pas (Belial et Crocell). Impossible de la réveiller ; rien d'autre à trouver.
Le Trou au Renard : quelques minutes de reptation, une grotte circulaire, une échelle rouillée, une trappe : les PJ sortent d'une bouche d'égout au milieu d'une avenue d'une ville immense et futuriste. Un néon rouge sur un gratte-ciel : WIP.`,
    [inScene(meuf, { nom: 'La Princesse Noire (la meuf)' })]),
  scene('wip', '5. Work in Progress : la ville et Nihil', 'MRC – pocket universe WIP, du quartier des affaires au Stinkin\' Blue Boy',
    `Dernier pocket universe de Beleth, inachevé : ciel gris de téléviseur sans signal, ville tentaculaire de verre et de chrome. Recette des descriptions : esthétique années 80 dans un futur crade, privés en imper doublé de kevlar et femmes fatales, mysticisme proto-Internet (la SchyzoMatrice), écologie (« Babylone a sali le soleil »), lutte sociale, argot freestyle et MotsComposésAvecMajuscules. Le sigle WIP est partout, jusque sur le pelage des rats mutants.
Géographie : au centre, un Wall Street fantasmé (tours de six cents étages) ; puis les quartiers chics (autoroutes traversant des immeubles, baobabs suspendus) ; les quartiers crades MultiÉthniques sous la pluie ; enfin les usines qui deviennent floues, en fil de fer, puis disparaissent dans la zone en travaux (en sortir par là est déconseillé).
Habitants : clichés cyberpunk qui surjouent leur rôle. Rares rêveurs : une trentaine d'humains forcés par Beleth à façonner la poche, présents sous forme de notables « décalés » (patron de boîte, PDG, meilleur privé du WIP).
Nihil : en cherchant des infos, les PJ sont orientés vers le Stinkin' Blue Boy, bar de la DeathArea près du stade de ShitBoxing (Scorpions version grunge). Le démon de Beleth, ici indic de l'underground en ThermoCuir et Ray-Ban miroir, sirote une CyberTisane tilleul-menthe ; il ne les reconnaît pas mais les renseigne : deux issues seulement, une fenêtre au dernier étage de la DoughTower#1 et un tapis roulant de l'usine JunkStuff près de la zone en travaux. Il rappelle l'importance du fil et conseille d'enquêter avant d'agir.
Gabriel : le « Blondin », businessman étranger aux accréditations puissantes, a consulté les DataBases de plusieurs entreprises du quartier des affaires ; personne ne l'a revu depuis qu'il est entré dans la DoughTower#1.`,
    [inScene(nielle, { nom: 'Nihil (Nielle)' }), inScene(faune, { qty: 2 })]),
  scene('wip-incidents', '6. Survivre dans le WIP', 'MRC – WIP, quartiers populaires, usines et quartiers chics',
    `Pocket universe violent : quel que soit le quartier, les autochtones cherchent des crosses aux PJ (robots vigiles dans les usines, dealers et gangsters dans les quartiers populaires, milices de sécurité dans les quartiers chics).
Il faut de l'argent pour tout (infos, droit de passage sur le territoire d'un gang, toit, portion de JunkPurée) et les PJ n'en ont pas : à eux de se procurer des crédits (trafics, contrats, braquages).
Pour retrouver Blackie (scène 7), il faut écumer les bars louches et tremper dans quelques trafics.`,
    [inScene(faune, { qty: 4 })], true),
  scene('blackie', '7. Blackie et la DoughTower#1', 'MRC – WIP, Fire & Ice Hotel puis DoughTower#1 (quartier des affaires)',
    `La meuf : son visage est partout sur des panneaux lumineux (« Blackie's beautiful »). Top-modèle star du WIP, récemment visée par des CyberTerroristes, elle est à l'abri au Fire & Ice Hotel, bâtiment miteux à la frontière du centre et des NéoBidonVilles, gardé par une vingtaine de Mercs CyberBoostés en armure totale. Sa suite : huit pièces en enfilade tapissées d'écrans où elle apparaît sous tous les angles. Si on parle à son image, elle ouvre les yeux et murmure quelques phrases : pourquoi ne peuvent-ils pas s'entendre, elle n'est pas un objet qu'on possède, ils sont si mignons tous les deux, elle ne veut pas retourner là-bas ni être encore obligée de choisir. Puis elle se rendort.
La porte : la DoughTower#1. Le rez-de-chaussée est très bien gardé : il faut pénétrer discrètement dans la tour et monter jusqu'au 512e étage. Une fenêtre ouverte y donne sur un ciel azur, des nuages et la pointe d'une montagne rouge brique : il suffit de se laisser tomber de l'autre côté.
Autres sorties (tapis roulant de JunkStuff, frontière de la poche) : improviser, renvoyer les PJ au Toujours-Noël, ou les punir avec la poche du Monde du Silence ou celle du Film d'Art et d'Essai Coréen.`,
    [inScene(mercs, { qty: 6 })], true,
    [choice('porte-wip', 'Comment les PJ quittent-ils le WIP ?', [
      ['La fenêtre du 512e étage de la DoughTower#1', 'Infiltration de la tour ; ils tombent dans la Warp Zone, sur un nuage (scène 8).'],
      ['Le tapis roulant de l\'usine JunkStuff ou la zone en travaux', 'Hors du fil : retour au Toujours-Noël si le MJ est gentil, sinon le Monde du Silence ou le Film d\'Art et d\'Essai Coréen.'],
    ])]),
  scene('warp', '8. La Warp Zone : apprendre à voler et Neil', 'MRC – Warp Zone (les Villages dans les Nuages)',
    `Poche aérienne psychédélique née des rêves d'humains voulant voler : nuages solides et élastiques, sommets rouges, ciel azur, panorama infini en contrebas. On passe d'un nuage à l'autre en volant, porté par les courants ascendants. Campements nomades de tentes de cuir alimentés par des éoliennes ; machines volantes (biplan, trois-mâts antigravité, vélo ailé de Léonard, bulle de savon familiale).
Les PJ atterrissent sur un nuage d'une dizaine de mètres carrés ; à force de sauts, ils rejoignent un campement et prennent leur première leçon de vol. Nouveau talent : Vol onirique (Volonté, acquis, exotique) ; après quatre ou cinq tests réussis, le MJ peut l'offrir à tout le groupe. Un échec avec un RU de plus de 6 entraîne une chute : le ciel n'a pas de fond, le tombeur réapparaît en haut puis s'écrase sur un nuage (blessure d'un niveau de dommages 1D6+1).
Habitants : grands, filiformes et pâlots, styles et époques mélangés (peaux de bête, redingotes, costumes de super-héros) ; tipis déplacés tous les deux ou trois jours, chasse à la fronde. Quelques-uns vivent sur les machines volantes ou en ermites, moines philosophes ou professeurs de vol sur les sommets. Les rêveurs (enfants, ménagères, cadres, SDF) se contentent de voltiger.
Neil : les autochtones parlent d'un petit gars qui ressemble aux PJ et qui a eu du mal à apprendre à voler. Il vit dans une montgolfière à nacelle aménagée en salon bourgeois, veste en daim, pince-nez fumé, longue-vue. Tilleul-menthe et liste des portes connues : le Cimetière des Poissons Volants (au levant), la Marmite de Tante Gudule (qui se déplace avec elle), la Bibliothèque du Marchand de Sable (au-delà de la zone des éclairs) et la Grande Échelle de Corde (au couchant).
Gabriel : un professeur de vol lui a appris les bases il y a quelques heures ; des campeurs racontent que le Grand Blond aux yeux clairs cherchait un ami et une librairie : ils l'ont orienté vers la Bibliothèque du Marchand de Sable.`,
    [inScene(nielle, { nom: 'Neil (Nielle)' })], false,
    [choice('porte-warp', 'Quelle porte les PJ choisissent-ils ?', [
      ['La Bibliothèque du Marchand de Sable', 'Bonne porte : traversée de la zone des éclairs jusqu\'à la demi-sphère rocheuse (scène 9 puis 10).'],
      ['Le Cimetière des Poissons Volants, la Marmite de Tante Gudule ou la Grande Échelle de Corde', 'Mauvaise porte, sans doute exprès : quelques heures dans la poche des Cauchemars de George Romero, puis retour dans la Warp Zone une fois leur quota de zombies tué.'],
    ])]),
  scene('ciel', '9. Le ciel de la Warp Zone et la Noire Sœur d\'Icare', 'MRC – Warp Zone, ciel et zone des éclairs',
    `La meuf : la « Noire Sœur d'Icare » tombe sans fin, tête la première, yeux fermés, flammèches autour de la silhouette et flocons dans son sillage ; arrivée en bas, elle réapparaît en haut. L'approcher est très dangereux (elle entraîne les intrus dans sa chute) et rien ne peut l'arrêter (elle perce les filets, traverse les murs).
Incidents :
• Apprendre à voler ou trouver un transport : une barque ailée maniable s'emprunte dans les campements, mais il faut la poser toutes les deux ou trois heures pour sa sieste.
• À midi et à 19 h, le ciel se remplit de gros volatiles mous (des autruches volant en zigzag) : très difficile de rester en l'air.
• Les pirates du Hollandais Violent : filets dérivants bleu ciel (test de Perception pour les voir), harpons ; ils capturent les badauds, les dépouillent et les jettent par-dessus bord ligotés. À bord, ils se battent au crochet, au sabre rouillé, au tesson ou à la chope.
• La zone des éclairs : ciel noir, vent violent, pluie battante ; 1 chance sur 6 par minute et par personne d'être frappé (blessure d'un niveau de dommages 1D6+1).
La porte : une demi-sphère rocheuse suspendue dans le vide juste derrière la zone des éclairs ; au centre, une petite boutique illuminée à l'enseigne « La Bibliothèque du Marchand de Sable ». Une clochette tinte ; une fois tous entrés, la porte ne s'ouvre plus dans l'autre sens. Chaleur, odeur de vieux papier et de café froid, rayonnages chaotiques : rester groupés. Au loin, des voix.`,
    [inScene(pirates, { qty: 6 })], true,
    [choice('pirates', 'Les PJ tombent-ils dans les filets du Hollandais Violent ?', [
      ['Ils repèrent les filets', 'Ils évitent l\'abordage, ou attaquent le trois-mâts pour lui prendre son navire volant.'],
      ['Capturés', 'Combat à bord ou dépouillés et jetés par-dessus bord ligotés : chute sans fond, puis écrasement sur un nuage (1D6+1).'],
    ])]),
  scene('bibliotheque', '10. La Bibliothèque du Marchand de Sable', 'Bibliothèque de l\'archange Yves (hors de l\'espace et du temps), le puits',
    `La bibliothèque d'Yves est, avec les escaliers des Marches intermédiaires, la seule construction présente dans toutes les strates de l'Univers : elle contient tous les livres possibles. Les PJ y entrent à la suite de Gabriel et doivent la traverser pour rentrer sur Terre.
En suivant les voix, ils voient les rayonnages se déplacer et entendent une lente respiration monter des livres. Curiosités : livres de poche banals, codex byzantins, papyrus, mais aussi des livres inexistants (Comédie complète d'Aristote, quatrième édition d'INS/MV…). Un gros volume mal relié intitulé Fire & Ice peut combler les lacunes des joueurs : n'en donner que l'essentiel, la plupart des pages manquent (presque toute la quatrième partie).
Le décor change : grande bibliothèque sous des voûtes, cage d'escalier donnant sur une forêt, murs métalliques rouillés et néons, puis un immense puits en spirale aux murs couverts de livres, lustres de cristal le long d'un filin. Toutes les trois ou quatre révolutions, une plate-forme avec bureau, lampe verte, lutrin et téléphone. Sur l'une d'elles, plus bas, deux hommes parlent : Yves et Gabriel. Il vaut mieux ne pas se manifester (il faut cinq minutes pour les rejoindre et la conversation s'arrêterait).
Ce que les PJ entendent, en substance : Gabriel est désemparé, Samaël refuse de revenir aux Enfers ; Yves répond que c'est son droit, que Gabriel et son frère sont les meilleurs agents de Dieu et que leur rôle est d'obéir. Il tend à Gabriel un petit livre de cuir rouge : son agenda, qui est aussi un livre de la bibliothèque. Gabriel y lit tout ce qui doit advenir et le repose, bouleversé. Yves lui rend l'épée de flammes : son heure est venue. Gabriel dit qu'il pourrait refuser ; Yves répond qu'alors c'était écrit, que personne n'a le choix. Gabriel lève l'épée (éclair aveuglant), embrasse Yves et s'éloigne : ils ne se reverront qu'une fois. Yves appelle alors ses « invisibles témoins ».
Fuir est inutile (les étagères acculent les PJ dans un cul-de-sac) ; attaquer l'archange est suicidaire. Yves, assis, une larme sur la joue mais souriant, les dévisage, puis annonce qu'il est temps de rentrer : ils ont encore tant à faire avant que la nuit ne vienne. Réponses allusives ou silence. Il les guide dans un dédale de rayons jusqu'à une allée droite et les laisse : avancer tout droit, sans s'arrêter ni se retourner. Grognements, mastications et rires derrière eux : rien à craindre s'ils obéissent.`,
    [inScene(yves), inScene(gabriel)], false,
    [choice('yves', 'Comment les PJ réagissent-ils à la conversation des archanges ?', [
      ['Ils écoutent en témoins invisibles', 'Ils entendent tout le dialogue (agenda, épée, départ de Gabriel), puis Yves les appelle et les guide vers la sortie.'],
      ['Ils se manifestent trop tôt', 'La conversation s\'arrête : ils perdent ces révélations, mais Yves les raccompagne quand même.'],
      ['Ils fuient ou attaquent Yves', 'Les étagères les acculent ; une attaque contre l\'archange des Sources est suicidaire.'],
      ['Ils se retournent dans l\'allée', 'À la discrétion du MJ : ils risquent de rester coincés dans les Marches pour quelques siècles.'],
    ])]),
  scene('retour', '11. The Wake : retour au Centre de Tri', 'Centre de Tri, Paris – cave, le lendemain vers 10 h (J2)',
    `Étagères métalliques, casiers de courrier, classeurs, néons grésillants, odeur de cave moisie, bruit familier de la trieuse automatique : les PJ sont dans les sous-sols du Centre de Tri. Derrière eux, un mur de briques : la Bibliothèque s'est refermée.
Le périple n'a duré que quelques heures en temps terrestre : on est le lendemain de la soirée au Chez Régis, vers dix heures. Monsieur Fabien déboule dans la cave : il les cherche depuis ce matin, la trace de Yolande est retrouvée, ils partent en Suisse sur-le-champ (enchaîne sur « Run like Hell »).
Raconter l'aventure n'intéresse personne : Fabien, Gilbert et Aurélie l'attribuent à une farce des anges de Blandine et écourtent les confidences. Ces souvenirs sont la seule trace du voyage : ni mission officielle ni récompense.`,
    [inScene(fabien), inScene(gilbert), inScene(aurelie)]),
];

const scenario = {
  id: 'fire-and-ice-11-bibliotheque-marchand-de-sable',
  nom: 'Fire and Ice (scénario 11) – La Bibliothèque du Marchand de Sable',
  resume: `Fire and Ice 2, acte « Et Nox Facta Est », scénario 11 (INS, PJ démons du Centre de Tri). Lors d'une soirée de Noël au Chez Régis, Monsieur Fabien (en réalité Beleth) et son serviteur Nielle mettent les PJ sur la piste de l'archange Gabriel, puis Beleth les expédie physiquement dans la Marche des rêves et des cauchemars. Pour en sortir, ils suivent un « fil » de poche en poche (Pays du Toujours-Noël, Work in Progress cyberpunk, Warp Zone aérienne) : le démon de Beleth sous divers noms, la trace de Gabriel et les incarnations de la meuf aimée de Belial et Crocell. Ils arrivent dans la Bibliothèque du Marchand de Sable, assistent en témoins au dialogue où Yves rend à Gabriel son épée et son destin, puis l'archange les ramène au Centre de Tri. Scénario onirique et linéaire, sans récompense.`,
  notes: `Source : ${REF}. Aide de jeu « Tempus Fugit », p. 153-154.
Ton : scénario bizarre et non euclidien, hommage à Neil Gaiman (titres des parties empruntés à Sandman). L'argument « c'est magique » fonctionne dans la MRC, mais improviser autour des fausses routes est préférable.

Contexte MJ (« Preludes and Nocturnes ») :
• La guerre en Enfer se répercute jusque dans la MRC, Marche intermédiaire née des rêves de Dieu et nourrie des songes de toutes les créatures.
• La meuf, humaine aimée jadis par Belial et Crocell, a acquis une seconde existence floue dans la MRC à force d'être rêvée par les deux princes. Belial veut la ramener sur Terre en l'invoquant grâce à des sorciers ; trois tentatives ont échoué (le corps d'accueil brûle et renvoie l'âme). Ces essais déforment la MRC et ont attiré Blandine et Beleth.
• Beleth a constaté les dégâts et repéré un être très puissant (Gabriel) qui fouille la MRC à la recherche d'un ami ; plutôt que de se montrer, il envoie les PJ suivre sa trace.

La MRC (« Dream Country ») : bulles (rêves individuels où le rêveur est roi, poreuses), poches (rêves communs devenus stables, sans propriétaire : le Lupanar, la Ville infinie, la poche Cuisine, la poche des Eaux…, surveillées par Blandine et Beleth ; les plus puissantes peuvent se détacher, origine des panthéons) et pocket universes (poches artificielles inventées par Beleth). Trois types d'habitants : rêveurs (aspect flou et décalé), autochtones (créés par les rêves, inconscients de l'être), créatures surnaturelles (anges et démons policiers de la Marche, psis, sorciers, rares êtres vivant là à plein temps comme Seth).
Règles pour les PJ : présence physique, tests habituels, dégâts et mort réels ; objets laissés sur place vite disparus ; pas d'armes magiques invoquées, pas de supérieur, pas de réseau. Portes symboliques entre poches ; sans elles, s'éloigner mène dans une bulle voisine, très dangereuse.

Le fil : dans chaque poche, le démon de Beleth (Niels, Nihil, Neil), la trace de Gabriel (le Grand Blond) et une incarnation de la meuf (Princesse Noire, Blackie, Noire Sœur d'Icare). Fausses portes : improviser une ou deux poches transitoires (le Cauchemar dans le Placard, le Monde du Silence, le Film d'Art et d'Essai Coréen, les Cauchemars de George Romero) avant de raccrocher les PJ au fil.

Récompense : aucune (pas de mission officielle) ; seuls restent les souvenirs, que personne ne veut entendre. Possibilité de combler les lacunes des joueurs avec le livre « Fire & Ice » trouvé dans la Bibliothèque.

Chronologie (Tempus Fugit) : environ une semaine après le scénario précédent. J-? Gabriel part chercher Yves par les chemins flous de la MRC. J1 fête de Noël au Chez Régis, conversation avec Nielle ; Beleth envoie les PJ dans la MRC. ? séjour au Pays du Toujours-Noël, dans le Work in Progress puis dans la Warp Zone. ? arrivée dans la Bibliothèque du Marchand de Sable, dialogue entre Yves et Gabriel. J2 retour sur Terre dans les sous-sols du Centre de Tri ; Fabien les envoie en Suisse sur la trace de Yolande (scénario suivant, « Run like Hell »).
Suite de la campagne (Les cahiers du labyrinthe) : chargé de faire disparaître la meuf de la MRC pour éviter une nouvelle querelle Belial-Crocell, Beleth n'en a pas eu le courage ; il l'a cachée dans un loft du Lupanar où il lui fait la cour.

Personnages récurrents : Monsieur Fabien, Gilbert et Aurélie reprennent les fiches du Centre de Tri (Fire and Ice, p. 24-26). Jésus, barman du Chez Régis, apparaît sans fiche.
Fiches adaptées du livre : caractéristiques en niveaux INS/MV (Ch reportée en Foi). Loups de la MRC, faune du WIP et pirates du Hollandais Violent : valeurs du bestiaire de l'application. Valeurs estimées signalées dans chaque fiche (Mercs CyberBoostés).`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [fabien, gilbert, aurelie, nielle, meuf, habitants, loups, faune, mercs, pirates, yves, gabriel].map(asType);

// Contrôle : pouvoirs inconnus des règles
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));

writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types,', scenes.reduce((a, s) => a + s.choix.length, 0), 'choix');
