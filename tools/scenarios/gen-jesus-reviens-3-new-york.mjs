// Génère le fichier d'import « insmv-scenario » pour « Can't Stop the Music » (New York),
// chapitre 4 de la campagne « Jésus Reviens ! » (p. 48-57, + TRIC p. 9-10 et IA p. 12)
// usage : node gen-jesus-reviens-3-new-york.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);
const store = {}; globalThis.localStorage = globalThis.localStorage || { getItem: (k) => store[k] ?? null, setItem: (k, v) => { store[k] = v; } };
const S = await import(pathToFileURL(path.join(root, 'js/scenario.js')).href);

const REF = 'Jésus Reviens !, chap. 4 « Can\'t Stop the Music » (New York), p. 48-57';
const L = (s) => R.parseLvl(String(s));
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
const ARMES = new Map(R.ARMES.flatMap(([g, l]) => l.map((x) => [x[0], { prec: x[1], puis: x[2], melee: R.MELEE_GROUPS.includes(g) }])));
// arme de la table des règles : nom affiché, nom dans la table, niveau du talent
const arme = (n, table, lvl) => { const w = ARMES.get(table); if (!w) throw new Error('arme inconnue : ' + table); return { n, att: L(lvl), ...w }; };
// arme décrite par le livre (précision / puissance)
const libre = (n, lvl, prec, puis, melee) => ({ n, att: L(lvl), prec, puis, melee });
const poing = (lvl) => arme('Coup de poing', 'Coup de poing', lvl);
const P = 'jr3-'; let n = 0; const id = (k) => P + k;
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
const PQ = 'Membre des Pink Queens. Pas de Corps à corps ni d\'arme dans le livre : coup de poing au niveau 1 et Défense 2 par défaut (estimés). Le jour J, il porte une fausse arme (sauf Chico et Colin).';

// ---------------- Les Pink Queens ----------------
const chico = npc('chico', {
  nom: 'Chico (Johnathan Schmetterer)', source: 'Soldat de Dieu de Semper Fidelis, chef réel des Pink Queens', type: 'soldat',
  car: car('3+ 3 1+ 2 3+ 2'), def: L(2), pp: 4, pfFix: 5, seuilsFix: seuils('4/9/13/18'),
  armes: [arme('Corps à corps', 'Coup de poing', 3), arme('Couteau', 'Poignard ou saï', 1), arme('Revolver gros calibre (n° limé)', 'Revolver gros calibre', 1)],
  pouvoirs: pows('Vitesse 2, Charme 1'),
  talents: 'Baratin 2, Combat 1 (contondantes 2), Corps à corps 3, Défense 2, Enquête 2, Fouille 2, Tir 1, Savoir militaire 1 (explosifs 2), Athlétisme 2, Art 1, Culture générale 1 (KKK et Dixie Holding 2), Kama Sutra 2, Savoir occulte 1 (opération Big Queen 3)',
  notes: `29 ans, 1,88 m, brun aux yeux bleus, seul Blanc du groupe et fier de l'être. Envoyé par Semper Fidelis pour monter un groupe terroriste de Noirs homosexuels qui servira de repoussoir ; il y a découvert sa propre homosexualité refoulée et couche avec tout le groupe.
Videur au Tunnel of Love, il loge dans une chambrette derrière les coulisses ; emploi du temps imprévisible, car il prépare activement l'attentat. Seul à s'y connaître en explosifs, seul à savoir que la statue doit sauter avec les otages.
Fanatique, discipliné, se sait damné : prêt à se battre jusqu'à la mort ou à se suicider (il compte mourir dans l'explosion plutôt que d'affronter son maître). Dès qu'il se sent menacé, il déclenche les explosifs à distance.
Point faible : sa culpabilité. Lui proposer de se confesser pour être absous est la meilleure façon de le faire parler (et l'issue idéale). Il se sait surveillé par l'Union et fait comme si de rien n'était.
Armes non données par le livre : couteau (il « joue du couteau » à Battery Park) et revolver caché dans sa chambre, au niveau de ses talents (estimés).`,
});
const stanley = npc('stanley', {
  nom: 'Stanley Levis', source: 'Vendeur de galerie d\'art à Tribeca (Pink Queens)',
  car: car('1+ 2 3 2+ 2 1+'), pfFix: 3, seuilsFix: seuils('2/5/7/10'),
  talents: 'Baratin 3, Métier (vendeur d\'art) 2, Culture générale 1 (art moderne 2), Verbiage de bobo new-yorkais 3, Connaissance de Friends 2, Aisance sociale 3, Briller lors des vernissages 2, Savoir militaire 0+ (explosifs 1), Tir 1',
  notes: `28 ans, petit et maigre, blond décoloré. Vie la plus rangée du groupe (horaires de bureau, sauf vernissages) ; vit avec Maurissio au loft au-dessus de sa galerie.
Voit l'opération comme un happening politique à la Warhol, rien de plus : lui parler d'explosifs, d'otages et de morts le fait craquer, il raconte le peu qu'il sait.
Rôle : obtient de Peter Brebant (mairie) les tampons sur les autorisations d'achat de dynamite ; le jour J, il s'occupe des otages (déguisé en golden boy).
${PQ}`,
});
const maurissio = npc('maurissio', {
  nom: 'Maurissio Giulivo', source: 'Technicien bidouilleur (Pink Queens)',
  car: car('3 2+ 2+ 1+ 2+ 1'), pfFix: 4, seuilsFix: seuils('4/8/12/16'),
  talents: 'Devenir hystérique 2, Parasiter son amant 2, Hobby (électronique) 2, Savoir militaire 0+ (explosifs 1), Tir 1, Culture générale 1 (ghetto gay new-yorkais) 2, Kama Sutra 2',
  notes: `25 ans, bel éphèbe cyclothymique, vit aux crochets de Stanley. Un des moins motivés, mais s'occupe de la partie technique (détonateurs) parce que ça l'amuse et que Chico lui a appris.
Il trouve qu'il y a beaucoup trop d'explosifs ; il en a parlé à Doug, qui l'a renvoyé vers Chico, sans suite. Menacé, il déballe tout à toute vitesse : il rêve d'aller en prison (fan de la série Oz) et collaborera avec la justice.
Le jour J vers 9 h 30, il craque, se confie à Stanley, libère les otages et menace Chico avec son faux pistolet : Colin l'abat.
${PQ}`,
});
const rolf = npc('rolf', {
  nom: 'Rolf Meusel', source: 'Barman et mannequin occasionnel (Pink Queens)',
  car: car('2+ 2+ 2 1+ 3+ 1'), pfFix: 3, seuilsFix: seuils('3/7/10/14'),
  talents: 'Métier (barman) 2, Aisance sociale 2, Jouer les grandes folles tordues 2, Culture générale 2 (ABBA 3), Tir 1, Savoir militaire 0+ (explosifs 1), Défiler 2, Être super casse-couilles 1, Kama Sutra 1+',
  notes: `22 ans, métis germano-afro-américain au charme certain, barman au Tunnel of Love ; mêmes horaires que Chico, dont il est très proche.
Très perturbé par sa rupture avec Doug (avec qui il vit toujours), sous calmants à haute dose, hystérique à la moindre contrariété. Avec de la patience, un peu de bousculade ou mieux une épaule réconfortante, il livre le peu qu'il a compris.
Rôle : devait trouver un camion de chantier ; finit par en acheter un avec l'argent de sa mère. Coud les uniformes (motard cuir, gardien de la statue).
${PQ}`,
});
const doug = npc('doug', {
  nom: 'Doug Smithsonian', source: 'Professeur de littérature anglaise à l\'université de New York (Pink Queens)',
  car: car('1+ 1+ 2 3+ 1+ 3'), pfFix: 3, seuilsFix: seuils('2/5/7/10'),
  talents: 'Discussion 3, Culture générale 2 (littérature anglaise et/ou homosexuelle, marxisme post-moderne 3), Métier (professeur) 2, Savoir militaire 0+ (explosifs 1), Tir 1, Art 1 (poésie 2), Prendre la tête 2, Hétérophobie 1',
  notes: `31 ans, intellectuel et théoricien du groupe, se croit le cerveau de l'organisation ; vit avec Rolf (17e séparation). Mélange de Woody Allen et de Sidney Poitier, perdu dans ses discussions sur la décadence de l'empire américain.
Volonté de fer mais physique lamentable : il ne résiste pas à un interrogatoire musclé. Il connaît bien les détails de l'opération, longuement discutés avec Chico. Membre du Parti stalinien américain ; rédige les tracts de revendication.
Le jour J, déguisé en gardien, il tient le téléphone et la radio du poste des gardiens pour éviter que des touristes débarquent avant 11 h.
Force à demi effacée sur le scan : lue 1+.
${PQ}`,
});
const israel = npc('israel', {
  nom: 'Israël Souchon-Epiphanie', source: 'Danseur haïtien clandestin (Pink Queens)',
  car: car('2+ 3 2 1+ 3+ 1'), pfFix: 3, seuilsFix: seuils('3/7/10/14'),
  talents: 'Strip-tease 3, Kama Sutra 3, Français, Anglais, Pickpocket 2, Vivre aux crochets de ses amants 2, Savoir militaire 0+ (explosifs 1), Faire la pute 2, Danser « Dancing Queen » 2',
  notes: `21 ans, immigré clandestin d'Haïti, danseur au Tunnel of Love ; vit la nuit, dort chez ses conquêtes et accepte cadeaux et argent. Recruté parce qu'il parle français (le « voyage en France »), il parle très mal l'anglais et ne comprend pas grand-chose au projet ; adresse officielle bidon.
Interrogatoire décevant, sauf en créole, et même alors il sait peu de chose : on lui a seulement expliqué de draguer Michael Bateman (pour son bateau). Il voit tout ça comme un grand bal masqué.
Le jour J, déguisé en capitaine de plaisance, il fait le guet ; quand la panique éclate, il croit que la fête commence et entame un strip-tease sur le socle.
${PQ}`,
});
const colin = npc('colin', {
  nom: 'Colin Powel', source: 'Gardien de supermarché, ancien Marine (Pink Queens)',
  car: car('3 2+ 3+ 2 1+ 1+'), def: L(2), pfFix: 5, seuilsFix: seuils('4/8/12/16'),
  armes: [arme('Fusil à pompe à canon scié', 'Canon scié', 1), arme('Revolver', 'Revolver gros calibre', 2), arme('Tonfa (non-létal)', 'Matraque', 2), poing(2)],
  talents: 'Tir 1 (armes de poing 2), Combat 1 (contondantes 2), Savoir militaire 1 (explosifs 2), Corps à corps 2, Défense 2, Pilotage 1, Conduite 1, Jouer les gros durs dans les backrooms 1, Kama Sutra 2, Métier (videur) 2',
  notes: `37 ans, 1,86 m, 112 kg. Homonyme du secrétaire d'État sans en avoir l'intelligence ; viré des Marines pour homosexualité. Pervers sadique, habitué des backrooms hard, vulgaire, méprise les « fiotes » du groupe sauf Chico (qui l'a déjà corrigé) et Doug (qu'il respecte).
Ultra-violent, déteste racistes et homophobes, se voit comme le bras armé du groupe ; dépense tout pour ses armes et vit dans un studio sordide près de Grand Central. Presque impossible à interroger (volonté, discipline, goût de la douleur) : il se croit dans un film d'action et débite des répliques hollywoodiennes.
Chargé de « voler » un uniforme de flic (il en a déjà un, trop petit et de Los Angeles). Seul, avec Chico, à avoir de vraies armes le jour J : il abat Maurissio puis tire sur tout ce qui bouge.
Armes du livre : canon scié (précision −3, puissance +6), revolver (−2, +4), tonfa (+0, +1, non-létal).`,
});

// ---------------- L'Union (Laurent, Nord des USA) : alliés potentiels, jamais en combat ----------------
const ALLIE = 'Allié potentiel des PJ : ne pas l\'inclure dans un combat.';
const sharah = npc('sharah', {
  nom: 'Sharah (Seymour Bronski)', source: 'Ange de Laurent, grade 3, responsable de l\'Union (Nord des USA et Canada)', type: 'ange',
  car: car('6+ 6 5 7+ 4 5'), def: L(8), pp: 53, pfFix: 14, seuilsFix: seuils('9/19/28/38'),
  armes: [libre('Claymore bénie ancienne', 8, 5, 9, true), arme('Pistolet', 'Revolver gros calibre', '9+'), poing(4)],
  pouvoirs: pows('Juste-lame 4, Trait d\'énergie 4, Polymorphie 3, Détection du mensonge 4, Non-détection 3, Champ de force 2, Domination 4, Détection du danger 4, Charme 3, Caméléon 2'),
  talents: 'Baratin 5, Combat 4 (épées 8), Corps à corps 4, Défense 8, Discrétion 4, Discussion 7, Enquête 5, Fouille 4, Intrusion 3, Tir 4+ (armes de poing 9+), Aisance sociale 7, Athlétisme 6, Conduite 5, Culture générale 3 (histoire des USA 6), Savoir occulte 2 (la hiérarchie de Laurent depuis deux siècles 6), Métier (directeur d\'une agence secrète de renseignements) 6, Informatique 4, Français, Latin, Gaélique, Espagnol, Yiddish, Allemand, Savoir d\'espion 2 (contre-espionnage 7), Prendre un air grave pendant les réunions 7, Sortir des répliques de film mal à propos 6',
  notes: `58 ans, petit, cheveux blancs, yeux verts. Ange de principe, rigoureux et travailleur, arrivé avec les premiers colons ; patriote américain jusqu'à passer pour chauvin, républicain proche des milieux gouvernementaux. Il ne rend compte qu'à Laurent.
Ennemi juré de Semper Fidelis (la Confédération, le Sud) : caractères et méthodes opposés, guerre fratricide qu'il a tenté de négocier en vain ; l'Enfer en profite. Par les indiscrétions de Rudolf Gerardht (chef de l'American White Nationalist Party), il sait qu'un groupe terroriste piloté par Semper Fidelis prépare un coup à New York. Ses rapports à Laurent puis ses mots à Dominique n'ont rien donné : il a peur, et à raison. Paranoïaque, il en a très peu parlé, même dans ses services.
QG : sous-sols de la cathédrale Saint-Patrick et immeuble d'en face (société écran General Export Corp, import-export avec l'Italie), entrepôts de matériel paramilitaire très gardés, bureaux paysagers de serviteurs façon X-Files ; des anges de nombreux supérieurs s'appuient sur son réseau pour toute la côte Est.
Négociation : il n'aide des anges d'autres archanges que s'il les sent du côté de l'Église ou utiles contre Semper Fidelis. Levier : lui faire mesurer l'énormité de l'opération JR et ses effets sur le Grand Jeu. Si les PJ lui parlent des allusions de Semper Fidelis aux mormons, il fait le lien et leur donne des contacts dans l'Utah (Salt Lake City).
S'il coopère : moyens logistiques, anges connaissant parfaitement la ville, puis son dossier sur les excès de Semper Fidelis.
${ALLIE}`,
});
const amaleki = npc('amaleki', {
  nom: 'Amaleki (sergent Philip Truning)', source: 'Ange de Laurent, grade 2, chef de l\'équipe affectée à Big Queen', type: 'ange',
  car: car('5 4 4 3+ 4 3'), def: L(4), pp: 28, pfFix: 8, seuilsFix: seuils('8/16/24/32'),
  armes: [libre('Baïonnette de Marine bénie majeure', 7, 4, 5, true), arme('Pistolet', 'Revolver gros calibre', 2)],
  pouvoirs: pows('Juste-lame 3, Anaérobiose, Corps liquide, Peur 2, Télékinésie 2'),
  talents: 'Combat 3 (couteaux 7), Défense 4, Discrétion 4, Discussion 4, Enquête 3, Fouille 2, Tir 1 (armes de poing 2), Athlétisme 3, Culture générale 1 (corps des Marines US et la vie new-yorkaise au troisième millénaire 2), Savoir occulte 1 (l\'Union de Laurent 3), Intimidation 5, Métier (US Marines) 5, Savoir militaire 2 (assaut amphibie 4), Rabâcher ses histoires de Marines 4, Reprendre les gens en disant SERGENT Truning lorsqu\'ils disent juste Truning 6',
  notes: `38 ans. Vieux briscard désabusé, usé par la bureaucratie angélique et les missions toujours pareilles ; seules sa paresse et son dégoût du conflit l'empêchent de tout envoyer promener. Dirige mollement, en prenant le moins de décisions possible.
Relation d'amour-haine avec Chantal (Jared) ; méprise Joe (Bashan), l'arriviste qui veut sa place ; pas encore d'avis sur Bernard (Coolax), le petit nouveau.
L'équipe surveille Chico sans comprendre l'ampleur de l'affaire (un véhicule d'écoute devant le Tunnel of Love, changé chaque jour).
${ALLIE}`,
});
const bashan = npc('bashan', {
  nom: 'Bashan (Joe Darmik)', source: 'Ange de Walther, grade 2 (équipe Big Queen)', type: 'ange',
  car: car('4 5 3 5 2+ 4'), def: L(4), pp: 21, pfFix: 9, seuilsFix: seuils('7/14/21/28'),
  armes: [libre('Perceuse électrique portable majeure', 4, 2, 6, true)],
  pouvoirs: pows('Exorcisme 3, Peur 4, Absorption du mal 2, Détection des créatures invisibles 2'),
  talents: 'Baratin 2, Combat 2 (exotiques 4), Défense 4, Discussion 2, Enquête 3, Intrusion 2, Athlétisme 4, Culture générale 1 (la vie new-yorkaise au troisième millénaire 2), Savoir occulte 1+ (l\'Union de Laurent 3), Hobby (collectionner des insectes) 3, Intimidation 3, Torture 5',
  notes: `36 ans, petit, chauve : une petite frappe teigneuse et hypocrite à la De Vito. Se venge sur les autres des misères que lui fait l'univers ; faux dans tous ses rapports, paranoïaque, d'une obséquiosité suintante, mais il ment très mal. Vise la place d'Amaleki.
Force à demi effacée sur le scan : lue 4.
${ALLIE}`,
});
const jared = npc('jared', {
  nom: 'Jared (Chantal Trader)', source: 'Ange de Didier, grade 1 (équipe Big Queen)', type: 'ange',
  car: car('3 5 4 3 5 3'), def: L(4), pp: 9, pfFix: 6, seuilsFix: seuils('6/12/18/24'), armes: [],
  pouvoirs: pows('Langage universel, Charme 2, Téléportation 1, Sommeil 2'),
  talents: 'Baratin 6, Défense 4, Discussion 5, Enquête 4, Intrusion 3, Séduction 6, Aisance sociale 5, Culture générale 1 (la vie new-yorkaise au troisième millénaire 2), Savoir occulte 1+ (l\'Union de Laurent 3), Hobby (shopping) 5, Métier (secrétaire) 2',
  notes: `48 ans, toute petite, brune. Cyclothymique, en pleine crise existentielle (son hôte vit mal la cinquantaine), très agressive, mais bonne négociatrice pour obtenir l'accès aux endroits interdits ; sans gêne, elle joue de sa taille et de son statut de femme pour s'incruster partout. Dénigre tout le monde en permanence.
Aucune arme dans le livre.
${ALLIE}`,
});
const coolax = npc('coolax', {
  nom: 'Coolax (Bernard Gottlieb)', source: 'Ange de Jean, grade 0 (équipe Big Queen)', type: 'ange',
  car: car('3 3 4 4+ 2 2+'), def: L(4), pp: 6, pfFix: 7, seuilsFix: seuils('6/12/18/24'), armes: [],
  pouvoirs: pows('Décharge électrique 2, Corps électrique, Psychométrie 1'),
  talents: 'Défense 4, Discussion 3, Enquête 5, Culture générale 1 (la vie new-yorkaise au troisième millénaire 2), Savoir occulte 1 (l\'Union de Laurent 3), Technique 1 (génie électrique 3), Informatique 5',
  notes: `22 ans, grand blond, tout juste débarqué du Paradis. Jeune hacker bonhomme nourri de pizzas et de coca, fan du Seigneur des Anneaux, membre de l'Église unifiée de Bill Gates ; maladroit avec les gens, il agace malgré sa gentillesse.
Aucune arme dans le livre (sa Décharge électrique en tient lieu).
${ALLIE}`,
});
const soldatsUnion = npc('soldats-union', {
  nom: 'Soldats de Dieu de l\'Union', source: 'Les 200 soldats de Dieu de Sharah', type: 'soldat', qty: 6,
  car: car('3 2+ 3+ 2 1+ 2'), def: L(3), pp: 6, pfFix: 5, seuilsFix: seuils('4/8/12/16'),
  armes: [arme('Fusil à pompe', 'Fusil à pompe', 2), arme('Pistolet', 'Revolver gros calibre', 3), arme('Matraque (non-létale)', 'Matraque', 2)],
  pouvoirs: pows('Volonté supra-normale 1, Arme exaltée 1'),
  talents: 'Corps à corps 2, Défense 3, Tir 2 (armes de poing 3), Enquête 2, Fouille 3, Athlétisme 2, Intimidation 2, Métier (gardien) 2, Informatique 1, Culture générale 1 (la vie à New York au troisième millénaire 2), Savoir militaire 1 (tactiques de combat urbain 2), Savoir criminel 1 (connaissance des gangs de New York 2), Savoir occulte 1 (l\'Union de Laurent 2)',
  notes: `Bons catholiques américains d'origine irlandaise ou italienne, en groupes qui ne se mélangent pas (rivalité ethnique entretenue). Très disciplinés, suréquipés, ils se voient comme l'élite divine sur Terre et en font souvent trop.
Armes du livre : fusil à pompe (−2, +5), pistolet (−2, +4), matraque (+0, +1). Pas de talent Combat : matraque au niveau de Corps à corps (estimé).
Quantité de scène à ajuster.
${ALLIE}`,
});
const serviteursUnion = npc('serviteurs-union', {
  nom: 'Serviteurs de Dieu de l\'Union', source: 'Les 150 serviteurs de Dieu de Sharah', type: 'serviteur', qty: 4,
  car: car('2 2 3 3+ 2 2+'), def: L(2), pp: 5, pfFix: 5, seuilsFix: seuils('3/6/9/12'),
  armes: [arme('Pistolet', 'Revolver gros calibre', 2)],
  pouvoirs: pows('Sens surdéveloppés'),
  talents: 'Baratin 2, Défense 2, Tir 1 (armes de poing 2), Enquête 3, Fouille 3, Intrusion 3, Discrétion 2, Culture générale 1 (la vie new-yorkaise au troisième millénaire 2), Intimidation 2, Droit new-yorkais 2, Métier (divers) 2',
  notes: `Les sans-grade très « FBI » de l'Union : administration, comptabilité, dîme, écoutes, recherches scientifiques pour les enquêtes. Ils fournissent aux anges tous les moyens nécessaires.
Arme non donnée par le livre : pistolet au niveau de Tir (armes de poing), estimé.
${ALLIE}`,
});

// ---------------- Autres PNJ (sans caractéristiques) ----------------
const bateman = npc('bateman', {
  nom: 'Michael Bateman', source: 'Trader new-yorkais, propriétaire du Golden Trader', armes: [],
  notes: 'Client du Tunnel of Love dragué par Israël (J+2, 22 h) pour son bateau de plaisance. Le matin de J+3, Colin l\'assomme à bord et le jette à l\'eau, où il se noie. Le sauver ou l\'avertir prive le groupe de son bateau.\nFiche minimale (pas de caractéristiques dans le livre).',
});
const brebant = npc('brebant', {
  nom: 'Peter Brebant', source: 'Chef de service à la mairie de New York, client de Stanley', armes: [],
  notes: 'Fidèle client de Stanley : contre un 5 à 7 à l\'hôtel (J, 15 h), il tamponne les autorisations d\'achat de dynamite et les rapporte signées le lendemain (J+1, 16 h). Témoin compromis et facile à faire chanter ; ses coordonnées sont dans le bureau de Stanley.\nFiche minimale (pas de caractéristiques dans le livre).',
});
const voyous = fromBook('ecran-skinheads', 'voyous', {
  nom: 'Voyous homophobes de Battery Park', source: 'Petite bande venue « casser de la fiotte »', qty: 4,
  notes: 'J+3, 6 h-7 h : ils tombent sur les Pink Queens qui attendent le bateau ; Chico doit sortir le couteau pour protéger son groupe. Le livre ne les chiffre pas : fiche « Skinheads » des PNJ rapides de l\'écran reprise telle quelle.',
});

const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const RUMEURS = `Table 3d des « théories fumeuses mais certifiées conformes » sur les Pink Queens (ce qu'on raconte au Tunnel of Love et dans le Village) :
• 3 : elles vont repeindre la statue de la Liberté en drag-queen ;
• 4-6 : un site web gay les paie pour une pub géante sur l'Empire State Building ;
• 7-9 : elles veulent surprendre le maire de New York en pleins ébats homosexuels et passer les images sur l'écran géant de Times Square ;
• 10-11 : elles veulent attaquer les nazis new-yorkais pendant leur défilé annuel et les peindre en rose ;
• 12-14 : elles veulent se venger, de la pire des façons et avec un doberman, du policier homophobe qui a tué plusieurs homosexuels en les tabassant ;
• 15-17 : elles préparent une partouze géante avec Liza Minnelli et un faux Frank Sinatra à Ground Zero ;
• 18 : elles vont faire sauter la statue de la Liberté.`;

const scenes = [
  scene('arrivee', '1. In the Navy : arrivée à New York', 'New York – jour J ou avant',
    `Course contre la montre mêlée d'enquête : les PJ arrivent sans doute de Jacksonville en suivant la piste d'un attentat imminent organisé par Semper Fidelis. Idéalement, ils ont peu de temps.
Ce qu'il faut savoir (MJ) : choqué en bien par la poussée réactionnaire de l'après-11 septembre, Semper Fidelis (Laurent grade 3, la Confédération) a fait monter par son soldat de Dieu Chico un groupe terroriste de Noirs homosexuels, les Pink Queens, pour qu'ils commettent un attentat aussi spectaculaire que stupide : l'opération Big Queen. Officiellement, il s'agit de peindre la statue de la Liberté en rose ; en réalité, Chico va la faire sauter avec trois tonnes de dynamite, otages compris. L'explosion doit servir de prétexte à la fusion des Klans (voir la TRIC dans les notes du scénario). Les autres membres ignorent le commanditaire comme le vrai but : pour eux, l'action sera propre et sans victime.
L'Union (le Nord, Laurent, dirigée par Sharah) surveille Chico sans mesurer l'enjeu ; un véhicule d'écoute stationne en permanence devant le Tunnel of Love.
Date du jour J : à fixer selon le planning de la campagne et la TRIC (seuil 10 : le Klonklave commence et Big Queen est lancée ; si personne n'intervient, la statue explose le sixième jour, un samedi, à 10 h).
Pistes : aller voir Sharah (scène 2), le Tunnel of Love (scène 3), puis les domiciles des membres (scènes 4 à 6) ; la chronologie (scène 7) dit où sont les Pink Queens à chaque instant.`),
  scene('sharah', '2. Négocier avec Sharah', 'Cathédrale Saint-Patrick (sous-sols) et General Export Corp, en face',
    `Si les joueurs ont compris que Semper Fidelis déteste Sharah, ils peuvent lui demander de l'aide. Entrevue tendue : Sharah, paranoïaque et loyal à Laurent, sait qu'il risque sa place et que l'affaire peut ébranler la chrétienté. Il n'aidera des anges d'autres archanges que s'il les sent du côté de l'Église ou s'ils lui donnent des armes contre Semper Fidelis.
Le meilleur moyen de le faire basculer : lui faire entrevoir l'énormité de l'opération JR et ses conséquences sur le Grand Jeu. S'ils évoquent les allusions de Semper Fidelis aux mormons, il fait le lien (il connaît bien les mormons, très radicalisés depuis peu) et leur donne des contacts dans l'Utah.
S'il accepte : moyens logistiques, anges et serviteurs connaissant la ville, présentation de l'équipe affectée à Big Queen (Amaleki et ses trois anges), et si tout se passe bien son dossier sur les excès de Semper Fidelis. L'aventure new-yorkaise devient bien plus simple.
Preuves (IA) : dossiers de Sharah sur Semper Fidelis 1L ; son témoignage sur ses rapports à Laurent 3L ; sur ses rapports à Dominique 3D. TRIC : Sharah accepte de lutter contre l'opération JR aux USA −5, puis −1 par semaine de lutte active.
Monnaie d'échange possible : le dossier sur l'Union trouvé chez Chico (scène 3).`,
    [inScene(sharah), inScene(amaleki), inScene(bashan), inScene(jared), inScene(coolax), inScene(soldatsUnion, { qty: 4 }), inScene(serviteursUnion, { qty: 4 })], false,
    [choice('sharah', 'Sharah accepte-t-il d\'aider les PJ ?', [
      ['Oui, convaincu par l\'ampleur de l\'opération JR', 'TRIC −5 (puis −1 par semaine de lutte active). Logistique, guides, équipe Big Queen à disposition, dossier sur Semper Fidelis (1L) ; témoignages possibles (3L, 3D) ; contacts mormons pour Salt Lake City.'],
      ['Il reste méfiant', 'Pas d\'aide ; l\'équipe d\'Amaleki continue de surveiller Chico de son côté et peut gêner les PJ (ou les prendre pour des complices).'],
      ['Les PJ lui cachent tout', 'L\'Union reste un acteur imprévisible ; le véhicule d\'écoute repère les PJ s\'ils fréquentent le Tunnel of Love.'],
    ])]),
  scene('tunnel', '3. Tunnel of Love', 'Boîte gay très tendance, Greenwich Village',
    `C'est là que les Pink Queens se sont rencontrés et qu'ils tiennent leurs réunions dans une des alcôves. Entrée difficile : dress code et cooptation très stricte. Bien joué, les PJ peuvent prendre toute la bande lors de sa dernière réunion avant le grand jour.
Employés et habitués connaissent tous les membres (ils y travaillent ou y passent leur temps libre) : très liés, ils préparent « quelque chose de grand », une action à la Act Up, mais personne n'en sait plus. Les rumeurs vont bon train : tirer sur la table 3d des notes du scénario. Chico est connu comme un nouveau venu très actif, vrai chef du groupe, très occupé ces temps-ci, logé dans une chambrette derrière les coulisses (clés aux gardiens, videurs et propriétaires, qui ne les donnent pas à des inconnus ; Chico est populaire, personne n'y mènera des étrangers).
La chambre de Chico (quatre mètres carrés pouilleux) : gadgets SM, un uniforme de gardien de la statue un peu trop grand pour lui, des documents sur les services de la mairie qui délivrent les autorisations d'achat de dynamite, des photos du Golden Trader, le bateau de Bateman.
Fouille très poussée (démonter l'arrivée d'air) : revolver gros calibre au numéro limé, vrai permis au nom de Jonathan Schmetterer, badge d'employé de Dixie Securities avec photo, plans précis de la statue avec l'emplacement des explosifs (aucune peinture prévue, calculs de structure montrant que la statue sera détruite). Sous une latte du parquet : enveloppe kraft au sceau des services de Laurent de la Confédération, avec tout un dossier sur l'Union (adresse du QG, photos de Sharah et des anges affectés à l'opération, photos d'une trentaine de véhicules banalisés de filature). Un joli pactole à donner à l'Enfer… ou à Sharah.
Le fichier du personnel donne les adresses officielles : Jonathan (le Tunnel), Rolf (chez Doug), et une fausse adresse pour Israël.
Preuves (IA) : dossier de Chico sur l'Union 3L ; preuves de son appartenance à la Confédération 2L ; preuves sur l'opération Big Queen 1L.
Coincé, Chico se bat à mort ou déclenche ce qu'il peut ; l'interroger par la force est très difficile, mais lui proposer de se confesser pour être absous le fait parler (témoignage 2 à 5L).`,
    [inScene(chico), inScene(rolf), inScene(israel), inScene(colin), inScene(doug), inScene(stanley), inScene(maurissio)], true,
    [choice('chambre', 'Que font les PJ du dossier sur l\'Union trouvé chez Chico ?', [
      ['Ils le remettent à Sharah', 'Gage de bonne foi : Sharah devient bien plus coopératif. La preuve (3L) peut quand même être transmise à Régine.'],
      ['Ils le gardent pour le dossier d\'accusation', 'Preuve 3L contre Laurent.'],
      ['Il tombe entre les mains de l\'Enfer', 'Les démons new-yorkais savent tout de l\'Union : catastrophe pour Sharah.'],
    ]),
    choice('chico', 'Comment les PJ font-ils parler Chico ?', [
      ['En lui proposant de se confesser', 'Issue idéale : il avoue tout (témoignage 2 à 5L) ; s\'il le fait publiquement, TRIC −10.'],
      ['Par la force', 'Fanatique et discipliné, il ne lâche presque rien ; risque qu\'il se suicide ou déclenche les explosifs.'],
      ['Ils l\'abattent', 'Plus de témoignage ; les autres Pink Queens ne savent presque rien (0 à 1L).'],
    ])]),
  scene('loft', '4. Le loft de Stanley et Maurissio', 'Loft au-dessus de la galerie d\'art, Tribeca',
    `Le comble du loft branché : chaque objet se veut œuvre d'art, jusqu'à la cuvette des toilettes ; on ne distingue pas le privé de la galerie. Fouiller est déroutant (le MJ peut jouer sur le côté non euclidien du lieu). Alarme hi-tech, et Stanley est presque toujours dans sa boutique au rez-de-chaussée ou chez lui.
Atelier de Maurissio (fond du troisième étage, derrière un mobile de Nicolas Gome) : des centaines d'appareils électroniques en pièces, détonateurs et bâtons de dynamite sur l'établi parmi de minuscules tubes de peinture, une dizaine de petites statues de la Liberté pour touristes à moitié repeintes.
Bureau de Stanley : fausses attestations d'achat de dynamite et coordonnées exactes du bureau de la mairie qui les tamponne (piste Peter Brebant).
Dressing commun : deux « uniformes » prêts sur des chevalets, touriste allemand (tongs, perruque) et golden boy (attaché-case).
Stanley craque si on lui parle d'explosifs, d'otages et de morts ; Maurissio, menacé, déballe tout et se réjouit d'aller en prison. Témoignage des Pink Queens : 0 à 1L.`,
    [inScene(stanley), inScene(maurissio), inScene(brebant)], false,
    [choice('maurissio', 'Les PJ exploitent-ils les doutes de Maurissio sur la quantité d\'explosifs ?', [
      ['Oui', 'Il confirme que la charge dépasse de loin ce qu\'il faut pour de la peinture et retourne Stanley : deux membres de moins le jour J.'],
      ['Non', 'Il craquera seul, le jour J vers 9 h 30, et Colin l\'abattra.'],
    ])]),
  scene('rolf-doug', '5. L\'appartement de Rolf et Doug', 'Petit deux-pièces près du Tunnel of Love',
    `Deux pièces encombrées de livres, pamphlets, posters et tracts gauchistes, altermondialistes et homosexuels ; une odeur de charogne (une portée de chatons morte sous les papiers près du radiateur). Rolf et Doug y passent peu, pris par leur militantisme : pour eux, l'attentat est l'œuvre d'une vie et leur entrée dans l'Histoire.
On y trouve : brouillons de tracts de revendication, plans de la statue, et deux uniformes cousus main par Rolf d'après des photos au mur (motard cuir, gardien de la statue). Coffre-fort sous des prospectus : seulement les cartes du Parti stalinien américain de Doug et Rolf.
Les tracts expliquent le but « officiel » : peindre la statue en rose pour montrer que les homosexuels sont la nouvelle minorité opprimée, comme les immigrés pour qui elle était un phare ; Doug y a ajouté une logorrhée néo-marxiste, raturée après d'âpres disputes.`,
    [inScene(rolf), inScene(doug)]),
  scene('colin', '6. L\'appartement de Colin Powel', 'Studio sordide près de Grand Central',
    `Aussi sordide que vide : Colin n'y fait que dormir, astiquer ses armes et regarder des DVD d'arts martiaux et de reportages sur la Delta Force. Placard : trois revolvers (dont deux d'alarme), deux fusils à pompe à canon scié, nécessaire de nettoyage.
Bien en évidence, une pochette rouge « Opération Big Queen » avec tout ce que Colin sait : photos d'un chantier de la 52e rue et plans du cadastre, livres de navigation, cartes marines de la baie, photos du bateau de Bateman et du quai de Battery Park, horaires des ferries. Dans la penderie, parmi le fatras paramilitaire, un uniforme de policier authentique mais trop petit… de la police de Los Angeles.
Colin, s'il est là, ne se rend pas : il se croit dans un film d'action et ne lâchera rien à l'interrogatoire.`,
    [inScene(colin)], true),
  scene('chrono', '7. Sodom and Gomorrha : la chronologie de Big Queen', 'New York – de J à J+2',
    `Déroulement par défaut si personne n'intervient. Seul Chico connaît tous les détails ; les autres ne retiennent que des bribes. Chaque étape est une occasion d'interception.
• J, 12 h : Doug se fait livrer cinq tonnes de peinture rose à sa galerie (sic : c'est la galerie de Stanley).
• J, 15 h : Stanley obtient de Peter Brebant, chef de service à la mairie, les tampons sur les autorisations d'achat de dynamite, contre un 5 à 7 à l'hôtel ; Peter emporte les formulaires.
• J, 22 h : réunion du Parti stalinien new-yorkais : Doug explique que l'émancipation prolétarienne de la femme passe par celle des homosexuels, il se fait expulser ; Maurissio frappe le secrétaire de séance. Poursuivis, ils se réfugient au Tunnel ; Colin les défend, longue altercation sur le trottoir avec les militants.
• J+1, 2 h : Chico et Colin volent casques, outils et bleus de travail sur un chantier de Manhattan.
• J+1, 12 h : déjeuner de Chico et Rolf ; Rolf se fait engueuler, faute d'avoir trouvé le camion promis.
• J+1, 15 h : Rolf emprunte à sa mère de quoi acheter un camion.
• J+1, 16 h : Peter rapporte les formulaires signés à Stanley.
• J+1, 18 h : Rolf achète un camion à grue chez un concessionnaire du New Jersey et le livre, papiers en règle, à Chico et Colin.
• J+1, 19 h : déguisés en ouvriers, Chico et Colin achètent trois tonnes de dynamite sur un chantier du nord de l'État (« pour un chantier à Manhattan ») ; Colin trouve ça génial sans voir que c'est beaucoup trop pour de la peinture.
• J+2, 22 h : Israël drague ouvertement Michael Bateman au Tunnel et se fait emmener sur son bateau.
• J+2, 4 h (placé après 22 h par le livre) : Doug, Stanley, Maurissio et Rolf chargent à la grue les cinq tonnes de peinture à côté des explosifs.`,
    [inScene(brebant), inScene(bateman)], false,
    [choice('interception', 'Où les PJ interceptent-ils le groupe ?', [
      ['À la mairie (Peter Brebant)', 'Pas d\'autorisations, pas de dynamite légale : Chico doit improviser et prendre des risques.'],
      ['À l\'achat de la dynamite ou au camion', 'Les explosifs sont saisis ou piégés ; Chico et Colin résistent.'],
      ['Sur le bateau de Bateman', 'Bateman est sauvé ; plus de moyen de rejoindre l\'île.'],
      ['Ils n\'interceptent rien', 'Le groupe embarque à Battery Park (scène 8).'],
    ])]),
  scene('battery', '8. Battery Park : l\'embarquement', 'Golden Trader et quai de Battery Park, sud de Manhattan – J+3, 6 h-7 h',
    `• J+3, 6 h : sur le bateau, Colin assomme Michael Bateman en plein ébat et le jette à l'eau, où il se noie. Israël et Colin conduisent le bateau jusqu'à Battery Park. Les cinq autres attendent dans le parc ; des voyous venus « casser de la fiotte » les agressent et Chico doit jouer du couteau.
• J+3, 7 h : les Pink Queens embarquent explosifs et peinture en vrac sur le pont et filent vers la statue. À bord, chacun enfile son déguisement : Chico en ouvrier, Colin en flic de Los Angeles, Rolf en motard cuir, Doug en gardien de la statue, Stanley en golden boy, Israël en capitaine de plaisance, Maurissio en touriste allemand.
Dernière occasion de les arrêter avant la prise d'otages. Rappel : si Chico se sent menacé, il fait sauter la charge (ici, en pleine baie ou sur le quai).`,
    [inScene(voyous), inScene(chico), inScene(colin), inScene(israel), inScene(rolf), inScene(doug), inScene(stanley), inScene(maurissio)], true),
  scene('statue', '9. Big Queen : la prise de la statue de la Liberté', 'Liberty Island – J+3, 8 h-10 h',
    `• 8 h : armés de fausses armes (sauf Chico et Colin), les Pink Queens prennent la statue ; les rares employés présents sont pris en otages et chacun gagne son poste. Chico et Colin posent les explosifs et les quelques bidons de peinture ; Maurissio installe les détonateurs, inquiet de la quantité ; Doug tient le téléphone et la radio des gardiens pour retarder les touristes jusqu'à 11 h, gêné par Rolf qui sanglote ; Stanley rassure les otages ; Israël fait le guet en vieux loup de mer.
• 9 h 30 : Maurissio craque et se confie à Stanley ; les otages paniquent, un gardien les supplie d'arrêter. Ils libèrent les otages et vont annoncer à Chico et Colin que tout est annulé. Refus ; Maurissio brandit son faux pistolet, Colin l'abat. Panique générale : Colin poursuit Stanley en tirant comme un fou, Rolf fait une crise de nerfs, Israël lance un strip-tease au ghetto-blaster sur le socle. Écœuré, Chico appuie sur la télécommande.
• 10 h : les charges du socle explosent, détruisant la statue et tous ceux qui sont sur l'île.
Quoi qu'il arrive, dès que Chico se sent menacé, il déclenche l'explosion, quels que soient les risques pour lui ou les autres.
TRIC : la prise d'otages a lieu +5 ; la statue explose +10.`,
    [inScene(chico), inScene(colin), inScene(maurissio), inScene(stanley), inScene(doug), inScene(rolf), inScene(israel)], true,
    [choice('issue', 'Comment se termine l\'opération Big Queen ?', [
      ['La statue explose', 'TRIC +10 (en plus des +5 de la prise d\'otages) ; prétexte à la fusion des Klans.'],
      ['Prise d\'otages, mais charge désamorcée', 'TRIC +5 seulement.'],
      ['Le groupe est arrêté avant la prise d\'otages', 'Aucune TRIC ; l\'opération tombe à plat.'],
      ['Chico avoue publiquement avoir agi pour le KKK', 'TRIC −10 : le coup se retourne contre Semper Fidelis.'],
    ])]),
  scene('bilan', '10. Bilan : preuves et TRIC', 'Après l\'opération',
    `Faire le compte des preuves transmises à Régine (seules celles-ci comptent dans l'IA officiel ; l'IA secret compte toutes celles que les PJ détiennent) et des modificateurs de TRIC : voir les listes des notes du scénario.
Selon le choix des PJ, Sharah devient un allié durable contre la Confédération (et une piste pour Salt Lake City), ou un rival qui sait qu'ils fouinent dans les affaires de Laurent.
Survivants des Pink Queens : la plupart ne savent presque rien (0 à 1L) ; Maurissio se fera un plaisir de collaborer avec la justice.`, [], false,
    [choice('suite', 'Où mène l\'enquête ensuite ?', [
      ['Salt Lake City', 'Grâce aux contacts mormons de Sharah, si les PJ ont évoqué les allusions de Semper Fidelis.'],
      ['Retour à Jacksonville', 'Contre Semper Fidelis et le Klonklave, avec le dossier de Sharah.'],
      ['Ailleurs (Moscou, Tokyo, Madrid)', 'Selon la TRIC et le planning de la campagne.'],
    ])]),
];

const scenario = {
  id: 'jesus-reviens-3-new-york',
  nom: 'Jésus Reviens ! – 3. New York',
  resume: `Campagne « Jésus Reviens ! » (MV, anges de grade 1 à 2 envoyés par Ange et Alain, avec Yves et prévenus par Michel, via leur chargée de mission Régine, pour réunir des preuves contre l'opération JR et les archanges Laurent, Georges et Dominique). Chapitre « Can't Stop the Music » : à New York, Chico, soldat de Dieu de Semper Fidelis, a monté les Pink Queens, un groupuscule gay activiste qui croit aller peindre la statue de la Liberté en rose ; il compte en réalité la faire sauter avec ses otages pour justifier la fusion des Klans. Course contre la montre : enquêter au Tunnel of Love et chez les membres, négocier l'aide de Sharah (grade 3 de Laurent, rival de Semper Fidelis), intercepter le groupe avant que Chico n'appuie sur le bouton.`,
  notes: `Source : ${REF} ; TRIC p. 9-10 ; Index d'Accusation p. 11-12.
Déroulement : arrivée (scène 1) → Sharah (2) et/ou Tunnel of Love (3) → domiciles (4 à 6) → chronologie et interceptions (7) → Battery Park (8) → prise de la statue (9) → bilan (10). Les scènes 2 à 7 se jouent dans l'ordre que choisissent les joueurs.
Jour J : à placer selon le planning de la campagne. Seuil 10 de la TRIC : début du Klonklave d'une semaine à Jacksonville et lancement de Big Queen, cinq jours après ; le sixième jour (un samedi) à 10 h, si les PJ n'ont rien fait, la statue explose (+10), ce qui permet la fusion des Klans (+30, +1 par Klan fusionné).
Ton : parodique et volontiers outrancier (clichés gay assumés par le livre) ; à doser selon la table.
Récompenses : pas de barème propre au chapitre ; les PA dépendent de l'IA transmis (règles du cadre de la campagne).

TRIC – modificateurs de New York :
• La prise d'otages a lieu : +5
• La statue explose : +10
• Chico avoue publiquement avoir agi pour le compte du KKK : −10
• Sharah accepte de lutter contre l'opération JR aux USA : −5
• Par semaine de lutte active de la part de Sharah : −1

Index d'Accusation – preuves obtenables à New York (L = Laurent, D = Dominique ; les fourchettes dépendent de la qualité de la preuve, au jugement du MJ) :
• Dossiers de Sharah sur Semper Fidelis : 1L
• Témoignage de Sharah sur ses rapports à Laurent concernant Semper Fidelis : 3L
• Témoignage de Sharah sur ses rapports à Dominique concernant Semper Fidelis : 3D
• Témoignage de Chico : 2 à 5L
• Témoignage des Pink Queens : 0 à 1L
• Dossier de Chico sur l'Union : 3L
• Preuves chez Chico sur son appartenance à la Confédération : 2L
• Preuves chez Chico sur l'opération Big Queen : 1L
Rappel : seules les preuves transmises à Régine entrent dans l'IA officiel (que les méchants finissent par connaître et auquel ils réagissent) ; l'IA secret compte toutes les preuves détenues, à garder pour le procès.

${RUMEURS}

Fiches : Pink Queens, Chico, Sharah, l'équipe Big Queen (Amaleki, Bashan, Jared, Coolax) et les troupes de l'Union d'après le livre ; Sharah, l'équipe Big Queen et les troupes de l'Union sont des alliés potentiels, laissés hors des scènes de combat. Armes non données par le livre (Chico, serviteurs) choisies dans la table des règles et signalées dans les notes. Voyous de Battery Park : fiche « Skinheads » de l'écran. Le livre écrit « Juste lame » : nom des règles, Juste-lame. Bashan et Coolax sont des anges (Walther grade 2, Jean grade 0), pas des démons.`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [chico, stanley, maurissio, rolf, doug, israel, colin, sharah, amaleki, bashan, jared, coolax, soldatsUnion, serviteursUnion, bateman, brebant, voyous].map(asType);
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));
writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types');
