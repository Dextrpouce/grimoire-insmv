// Génère le fichier d'import « insmv-scenario » pour « Ça complote dans la compote » (Angelots en gelée, scénario 3, p. 35-43)
// usage : node gen-angelots-3-ca-complote.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Angelots en gelée, « Ça complote dans la compote » (O. Fanton), p. 35-43';
const L = (s) => R.parseLvl(String(s));
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
const ARMES = new Map(R.ARMES.flatMap(([g, l]) => l.map((x) => [x[0], { prec: x[1], puis: x[2], melee: R.MELEE_GROUPS.includes(g) }])));
const arme = (n, table, lvl) => { const w = ARMES.get(table); if (!w) throw new Error('arme inconnue : ' + table); return { n, att: L(lvl), ...w }; };
const poing = (lvl) => arme('Coup de poing', 'Coup de poing', lvl);
const P = 'ag3-'; let n = 0; const id = (k) => P + k;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [poing(1)], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});
const SANS = 'Pas de caractéristiques dans le livre : fiche minimale (humain moyen, niveau 2 partout, coup de poing niveau 1).';
const QUICK = 'Talents regroupés façon « PNJ rapide » : Attaque = arme de prédilection, Physique / Mental / Social = tous les talents du groupe.';

// ---------------- Le seul PNJ chiffré ----------------
const ellemol = npc('ellemol', {
  nom: 'Ellèmol', source: 'Ange de Marc, grade 2 (Jerbé, filiale angélique de Brest)', type: 'ange', car: car('3 3 4 5 5 4'), def: L(4),
  pp: 25, pfFix: 8, seuilsFix: seuils('6/12/18/24'),
  armes: [poing(1)],
  pouvoirs: pows('Charme 4, Détection des ennemis 3, Détection du mensonge 3, Polymorphie 3, Volonté supra-normale 3'),
  talents: 'Baratin 7, Défense 4, Discussion 6',
  notes: 'Chargé par la multinationale angélique de racheter le secret de la compote : il a proposé à Henry une somme astronomique et une rente pour son brevet, et fait surveiller (et protéger) Henry jusqu\'à la vente. Négociateur redoutable, pas un combattant.\nAucune arme ni Corps à corps dans le livre : coup de poing niveau 1 estimé.',
});

// ---------------- Troupes de Jerbé (estimées) ----------------
const vigiles = npc('vigiles', {
  nom: 'Vigiles de Jerbé', source: 'Sécurité de l\'usine (humains incorruptibles)', qty: 4, car: car('2+ 2 2+ 2 2 2'), def: L(2),
  armes: [arme('Matraque', 'Matraque', 2), arme('Revolver', 'Revolver gros calibre', 2)],
  talents: 'Athlétisme 2, Corps à corps 2, Défense 2, Tir 2, Vigilance 2',
  notes: 'Un vigile à chaque coin de couloir, maîtres-chiens la nuit ; aucun ne se laisse corrompre.\nAucune caractéristique dans le livre : profil de vigile moyen entièrement estimé.',
});
const anges = npc('anges', {
  nom: 'Anges de Jerbé', source: 'Anges dirigeants de la filiale (profil estimé : ange de Marc, PNJ rapide de grade 0)', type: 'ange', qty: 2,
  car: car('3 3 3 5 5 3'), def: L(4), pp: 10,
  armes: [arme('Arme de prédilection', 'Revolver petit calibre', 2)],
  pouvoirs: pows('Charme 1, Lire les pensées 1'),
  talents: 'Attaque 2, Défense 4, Physique 3, Mental 5, Social 6',
  notes: `Les anges qui tiennent la direction et gardent le coffre du PDG, « dévoués corps et âme » à leur cause. Le livre ne les chiffre pas : profil « ange de Marc » des PNJ rapides (livret de l'écran), arme estimée ; nombre au choix du MJ.\n${QUICK}`,
});

// ---------------- PNJ sans caractéristiques ----------------
const lapin = npc('lapin', {
  nom: 'Le lapin de la Maison du Lapin', source: 'Démon commanditaire (petit lapin noir et blanc d\'animalerie)', type: 'demon', car: car('1 2 2 2 2 2'),
  armes: [arme('Morsure', 'Morsure', 1)],
  notes: `Donne la mission aux PJ au milieu des cages ; la vendeuse n'est au courant de rien. Les prévient que la compote pourrait être protégée par des anges.\n${SANS}`,
});
const henry = npc('henry', {
  nom: 'Henry Potier', source: 'Inventeur de la compote Poterne, 42 ans', car: car('2 2 2 2 2+ 2'),
  talents: 'Baratin 3 (estimé), Chimie amateur 2 (estimé)',
  notes: `Fils d'un prof de chimie, BTS de vente. Une compote ratée renversée sur un plan de travail souillé par ses expériences de chimie est devenue la compote qui rend heureux ; il a fait breveter la recette à son seul nom. Marié à Anne-Sophie, deux enfants, volage ; maîtresse régulière : Élisabeth. Rusé, il protège son secret ou exige une compensation équivalente à l'offre d'Ellèmol. Il a deux enveloppes dans le coffre de son hôtel de Brest, dont une falsifiée.\n${SANS} Talents estimés.`,
});
const elisabeth = npc('elisabeth', {
  nom: 'Élisabeth', source: 'Maîtresse d\'Henry (mariée, phobie des trains)',
  notes: `A passé le week-end à Honfleur avec Henry ; il lui a prêté sa voiture pour rentrer et elle l'a garée dans sa rue, à Rambouillet, où Lou Zeur l'a volée. Elle a remarqué la jolie blonde du restaurant AAA. Selon l'attitude des PJ, elle peut se mettre à douter de son amant, voire péter les plombs.\n${SANS}`,
});
const dutilleul = npc('dutilleul', {
  nom: 'Dutilleul', source: 'Collègue d\'Henry chez Poterne, son alibi habituel',
  notes: `Officiellement au colloque de Strasbourg à la place d'Henry. Sait qu'Henry était en week-end avec sa maîtresse. Méfiant (il croit à des détectives de l'épouse) mais facile à impressionner. Peut révéler que le brevet est au nom d'Henry et que la concurrence fait des offres juteuses.\n${SANS}`,
});
const lou = npc('lou', {
  nom: 'Lou Zeur', source: 'Voleur de la voiture, fils des fermiers (près de trente ans)',
  notes: `A volé la voiture d'Henry rue Victor-Huguenot à Rambouillet et s'est planté près de la ferme de ses parents. Blessé, caché au grenier, il a peur et s'ennuie.\n${SANS}`,
});
const brune = npc('brune', {
  nom: 'Brune Lampion', source: 'Fleuriste à Pont-l\'Évêque, 21 ans, fille cachée d\'Henry', car: car('1+ 2 2 2 2 2'),
  notes: `Petite blonde timide, élevée par une mère instable morte il y a deux ans. Au restaurant AAA de Honfleur, elle a reconnu son père (Henry) et l'a fait demander au téléphone ; ils ont passé la journée suivante ensemble. Elle a son numéro et sait qu'il est parti à Brest pour un déplacement « décisif ». Coopère plus ou moins selon la manière des PJ. Levier possible (menace) contre Henry.\n${SANS}`,
});

const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  scene('lapin', '1. La Maison du Lapin', 'Animalerie du quartier des PJ',
    `Convocation par la poste : enveloppe rose ornée d'un lapin, rendez-vous à l'animalerie « La maison du Lapin ». Magasin banal, vendeuse humaine qui ne sait rien.
Entre les cages, un petit lapin noir et blanc les interpelle et donne la mission : saboter la production de la compote Poterne, qui rend les gens heureux… et gentils les uns envers les autres (insupportable pour l'Enfer, sans parler de la pub et de son refrain).
Trois personnes connaissent l'ingrédient secret : Gérard Manvussat et Jean Évudotre seront éliminés par d'autres équipes, les PJ doivent s'occuper de la troisième, Henry Potier (tuer ou enlever), et détruire ou récupérer toute trace écrite de la recette, discrètement.
Le lapin donne la description et l'adresse d'Henry, et prévient que la compote pourrait être une opération angélique, ou au moins protégée par des anges.

Ce que les PJ ignorent : Henry n'est pas en danger, il est simplement parti vendre en douce sa recette à Jerbé, une filiale angélique de Brest. Le scénario est linéaire : chaque témoin mène au suivant, et le MJ doit tenir le compte du temps (arriver avant ou après la vente change tout).`,
    [inScene(lapin)]),
  scene('domicile', '2. La scène du futur crime', 'Domicile et bureau d\'Henry Potier',
    `Chez Henry : personne. Sa femme Anne-Sophie est en tournée de réunions « Boîtes-en-plastique », un enfant en colonie, l'autre en Bretagne chez une copine.
Quand ils la trouvent, elle croit Henry au colloque de Strasbourg sur les quotas européens de pommes, à la place de son collègue Dutilleul, empêché au dernier moment (Henry disait avoir une intervention importante à y faire).
Au bureau : personne ne s'inquiète, son absence était prévue. Si on demande Dutilleul : parti à Strasbourg, injoignable en journée (portable éteint pendant les conférences), au restaurant le soir.`),
  scene('voiture', '3. La voiture dans le champ', 'Parking de Poterne, puis un champ en pleine campagne',
    `Impasse : la piste passe par la voiture d'Henry. Sa place réservée au parking (avec l'immatriculation), un contact policier, la presse locale, France 3 (voire le journal national), un coup de chance ou une recherche GPS mènent à la voiture abandonnée dans un champ.
Elle est cabossée, inutilisable, avec du sang récent côté conducteur. Si les PJ concluent à la mort d'Henry et s'arrêtent là, leur hiérarchie leur tombera dessus.
Des traces de passage et de sang, de plus en plus rares, mènent à la seule ferme des environs. Si la police est passée, elle n'a rien trouvé : analyse du sang en cours, les fermiers n'ont rien vu.`),
  scene('ferme', '4. La ferme, sans célébrités dedans', 'Ferme isolée (vieux cheval, moutons, poules, oies)',
    `Un couple de fermiers robustes et rougeauds, la cinquantaine, potager et marchés. Interrogés ou non par la police, ils voient d'un mauvais œil les PJ, n'ont « rien vu » et pressent tout le monde de partir (empressement suspect). Autour, d'autres traces de sang : le blessé s'est traîné ou a été porté jusqu'à la ferme.
Pour entrer : se faire inviter (un duel à la liqueur d'oignon ?) ou fureter discrètement.
Au grenier : Lou Zeur, leur fils unique, presque trente ans, blessé et soigné à la maison. Ce n'est pas Henry : il a volé la voiture à Rambouillet, rue Victor-Huguenot, et s'est planté près de chez ses parents, qui le protègent.
Indice : la mère a vidé la voiture et tout brûlé (papiers, courrier, un préservatif usagé), sauf un rouge à lèvres qu'elle a gardé. Un bout de relevé de compte a échappé aux flammes.

[Page imprimée 39 absente du scan] La suite de la ferme et le début de la piste suivante manquent. D'après la p. 40, le relevé de compte et l'adresse du vol mènent à Élisabeth, la maîtresse d'Henry, chez qui la voiture était garée.`,
    [inScene(lou)]),
  scene('elisabeth', '5. Élisabeth (page manquante)', 'Rambouillet, chez Élisabeth',
    `[La page imprimée 39 manque : scène reconstituée d'après la p. 40.]
Élisabeth a passé le week-end avec Henry à Honfleur. Au restaurant AAA, une jolie jeune femme à la table voisine regardait Henry ; il s'est absenté en même temps qu'elle. Ensuite, Henry a écourté le week-end en prétextant une urgence liée à la compote. Comme elle a la phobie des trains, il lui a prêté sa voiture (garée dans sa rue, d'où le vol), refusé qu'elle reste seule à l'hôtel, puis il devait prendre le train pour Paris et Strasbourg.
Elle peut se mettre à douter de son amant selon ce que disent les PJ (surtout s'ils ont déjà semé la zizanie chez Anne-Sophie), ou péter les plombs et compliquer l'enquête. Elle n'en sait pas plus. Elle peut donner le nom du restaurant.`,
    [inScene(elisabeth)], false,
    [choice('elisabeth', 'Comment Élisabeth réagit-elle aux questions des PJ ?', [
      ['Elle doute de son amant', 'Elle confie l\'épisode de la jolie blonde du restaurant AAA.'],
      ['Elle pète les plombs', 'Scandale, crise de nerfs : les PJ devront retrouver le restaurant par eux-mêmes.'],
    ])]),
  scene('strasbourg', '6. Colloque à Strasbourg', 'Colloque « Les pommes en question », Strasbourg',
    `Facultatif : les PJ peuvent y aller dès qu'ils entendent parler du colloque. Producteurs, transformateurs et cuisiniers de pommes ; Dutilleul s'apprête à présenter la compote Poterne.
Dutilleul n'a pas de nouvelles d'Henry : au téléphone, Henry lui a dit partir en week-end avec sa maîtresse et l'a pris pour alibi, comme d'habitude (ils se rendent ce service). Méfiant au début (des privés de l'épouse ?), il cède vite si on le menace.
Il peut décrire Henry et laisser entendre que le vrai patron c'est lui (le brevet est à son nom), que la concurrence bave d'envie et qu'Henry refuse régulièrement des offres juteuses. Au MJ de distiller ces infos sans que les PJ devinent trop vite qu'Henry est parti vendre sa recette.`,
    [inScene(dutilleul)]),
  scene('honfleur', '7. Honfleur la romantique', 'Restaurant AAA, Honfleur',
    `Passage obligé : la jeune femme du restaurant mènera les PJ jusqu'à Henry.
Augustin, maître d'hôtel (grand, mince, vieux, digne), ne parle pas des clients aux inconnus. Mais les réservations (nom et numéro de table) et les paiements par chèque ou carte permettent de retrouver les clients. Il se souvient qu'une jeune fille de la table derrière Henry lui a demandé, contre un bon pourboire, de faire appeler Henry au téléphone ; elle est revenue ravie. Il ne parle que s'il y trouve un intérêt moral, financier, ou par instinct de survie.
Les trois tables voisines :
• Alain Delamotte, professeur d'université à Caen, déjeunait avec sa vieille mère : fausse piste vite écartée.
• Eliott Warsaw, jeune Anglais en vacances dans un hôtel de Honfleur avec sa copine : fausse piste.
• Romain De Ségur, peintre de Honfleur, avait invité ses amis pour fêter sa première expo dans une galerie connue (affiches partout, adresse sur son chèque). Sympathique et lunaire, il répond volontiers ; un bobard crédible suffit pour avoir les adresses. Avec lui : Antoine Bergeaux, Lucille Fère (laide, ce n'est pas elle), Brune Lampion (jolie blonde) et Sylvain Martine. Il a une photo du groupe, sait que Brune travaille chez un fleuriste à Pont-l'Évêque et a ses numéros de fixe et de portable.`),
  scene('pont-leveque', '8. Pont-l\'Évêque', 'Pont-l\'Évêque : petit immeuble du centre, puis boutique de fleuriste',
    `Brune est dans l'annuaire. Pas chez elle (au travail) ; les voisins peuvent indiquer la boutique de fleurs du centre-ville. Elle compose un bouquet et vient accueillir les PJ.
Ce qu'elle sait : née d'une mère instable et d'un homme de passage, elle avait vu des photos de son père sans connaître son nom. Au restaurant, l'homme qui s'est retourné pour leur demander moins de bruit, c'était lui. Elle l'a fait appeler au téléphone et s'est présentée ; il s'est souvenu de sa mère et a accepté de la revoir. Le lendemain, journée idyllique (glace, cadeaux, « je peux t'appeler papa ? »). Henry écoute plus qu'il ne parle.
Le soir, il est parti pour un déplacement d'affaires très important à Brest, « un tournant dans sa carrière ». Ils ont échangé leurs portables ; il l'a appelée la veille au soir depuis Brest.
Sa coopération dépend de la façon dont les PJ présentent les choses.`,
    [inScene(brune)]),
  scene('brest', '9. Brest la venteuse', 'Brest : hôtel de luxe d\'Henry, puis siège de Jerbé',
    `Henry loge dans un hôtel chic. Une entreprise agroalimentaire de la périphérie affiche le slogan « Manger bon rend meilleur » : Jerbé, filiale d'une multinationale (agroalimentaire, textile, services) dirigée par des anges pour rendre la vie des gens plus douce et les rendre meilleurs. La compote Poterne est leur rêve.
Ellèmol, ange de Marc, a proposé à Henry une somme astronomique et une rente pour son brevet. Henry hésite encore mais a accepté de le rencontrer ; ses associés ne savent rien (le brevet est à son seul nom, l'entreprise appartient à plusieurs). Ellèmol le fait surveiller et protéger.
Au MJ de décider selon la rapidité des PJ depuis le début : ils trouvent Henry avant la vente, ou trop tard.
Avant la vente : l'enveloppe est dans le coffre de l'hôtel, que seul Henry peut ouvrir ; il y en a deux, dont une falsifiée. Moyens de pression : menacer Henry ou sa fille, le faire chanter avec sa double vie… Henry ruse au maximum ou exige une compensation au moins égale à l'offre d'Ellèmol. S'en prendre physiquement à lui, c'est attirer les anges (qui ont peut-être déjà repéré les PJ et peuvent tenter de les capturer et de les garder à l'usine). Victime de chantage, Henry peut prévenir Ellèmol.`,
    [inScene(henry), inScene(ellemol)], true,
    [choice('timing', 'Les PJ arrivent-ils avant que Henry ait vendu son secret ?', [
      ['Oui, avant la vente', 'Il faut obtenir l\'enveloppe (la vraie) du coffre de l\'hôtel par la ruse, la menace ou le chantage.'],
      ['Non, trop tard', 'La recette est chez Jerbé : infiltration de l\'usine et baston avec les anges.'],
    ]),
    choice('henry', 'Que deviennent Henry et son secret ?', [
      ['Les PJ récupèrent la vraie enveloppe', 'Recette détruite ou rapportée : mission réussie.'],
      ['Ils récupèrent l\'enveloppe falsifiée', 'Les PJ se font avoir : le secret court toujours.'],
      ['Henry prévient Ellèmol', 'Les anges protègent Henry et traquent les PJ.'],
    ])]),
  scene('jerbe', '10. La forteresse de la bouffe', 'Usine et siège social de Jerbé, périphérie de Brest',
    `Site immense, grillagé et barbelé, chiens et maîtres-chiens la nuit, barrière gardée (il faut être attendu), accueil où des hôtesses gardent une pièce d'identité « pour vérification ». Un vigile à chaque coin de couloir, incorruptible. Au MJ de faire confiance aux idées des joueurs pour entrer.
Quatre pôles : l'entrée (accueil, commercial, commandes, SAV, réclamations) ; la conception (les grosses têtes) ; l'administration et les chefs ; la fabrication, le plus gros bâtiment.
Le secret est dans le coffre du bureau du PDG, côté administration, là où se trouvent les anges, décidés à le garder. Mais rien ne garantit qu'il y soit : un des anges dirigeants, voire Ellèmol, peut l'avoir gardé sur lui ou mis à l'abri.
Les PJ peuvent chercher l'enveloppe ou tout faire sauter.`,
    [inScene(vigiles, { qty: 4 }), inScene(anges, { qty: 2 }), inScene(ellemol)], true,
    [choice('jerbe', 'Comment les PJ règlent-ils l\'affaire Jerbé ?', [
      ['Ils volent la recette dans le coffre', 'Mission réussie si elle y est bien ; les anges savent désormais qui les a doublés.'],
      ['Ils font tout sauter', 'Le secret est sans doute détruit, mais impossible d\'en être sûr : à prouver à la hiérarchie.'],
      ['Ils sont capturés', 'Les anges les gardent dans l\'usine pour les interroger et décider de leur sort.'],
    ])]),
  scene('fin', '11. La fin', 'Retour chez le lapin',
    `Le succès n'est reconnu que si le secret est rapporté ou détruit, preuves à l'appui. Le sort d'Henry importe peu, tant que les gens cessent de se gaver de compote avec cet air béat.
Bonus appréciés : avoir contrecarré les plans des anges et leur avoir cassé la figure, et toutes les mauvaises actions commises en route.
Échec : la hiérarchie n'est pas contente ; les PJ doivent se racheter vite ou se faire oublier.
Le livre ne donne aucun barème chiffré de PA.`, [], false,
    [choice('resultat', 'Bilan de la mission ?', [
      ['Secret détruit ou rapporté, preuves à l\'appui', 'Succès ; bonus si les anges ont été humiliés.'],
      ['Échec', 'Colère des patrons : se racheter ou se faire tout petit.'],
    ])]),
];

const scenario = {
  id: 'ag3-ca-complote',
  nom: 'Angelots en gelée – Ça complote dans la compote',
  resume: 'Scénario d\'In Nomine Satanis, parodique et linéaire. La compote Poterne rend les gens heureux et gentils : l\'Enfer charge les PJ, via un lapin démoniaque d\'animalerie, d\'éliminer Henry Potier, le dernier humain qui connaît l\'ingrédient secret, et de détruire la recette. De fausse piste en fausse piste (une voiture volée, une ferme, une maîtresse, un colloque, un restaurant de Honfleur, une fille cachée), ils remontent jusqu\'à Brest, où Henry s\'apprête à vendre son brevet à Jerbé, une filiale tenue par des anges.',
  notes: `Source : ${REF}.
Page manquante : la page imprimée 39 n'est pas dans le scan (PDF 35-42 = imprimé 35-38 et 40-43). Elle contenait la fin de la scène de la ferme et la piste vers Élisabeth (sans doute par le relevé de compte et l'adresse du vol, à Rambouillet). La scène 5 est reconstituée d'après la p. 40 : vérifier sur un exemplaire papier si possible.

Histoire secrète (résumé) : Henry Potier, 42 ans, a inventé la compote par accident (une compote renversée sur un plan de travail où il avait fait des expériences de chimie). Avec des copains du foot, il a monté l'entreprise Poterne, mais a fait breveter la recette à son seul nom. Volage, il couvre ses escapades avec l'alibi de son collègue Dutilleul. Ce week-end-là, à Honfleur avec sa maîtresse Élisabeth, il a rencontré par hasard sa fille cachée Brune, puis il est parti à Brest vendre en secret son brevet à Ellèmol (ange de Marc) pour Jerbé, filiale d'une multinationale angélique. Il a prêté sa voiture à Élisabeth, qui se l'est fait voler par Lou Zeur ; l'accident de Lou fait croire à la mort d'Henry.
Fil de l'enquête : domicile et bureau → voiture dans le champ → ferme (Lou Zeur, relevé de compte) → Élisabeth → (Strasbourg, Dutilleul, facultatif) → restaurant AAA de Honfleur (Augustin, Romain De Ségur) → Brune à Pont-l'Évêque → Brest (hôtel d'Henry, Jerbé).
Gestion du temps : le MJ décide si les PJ arrivent avant ou après la vente, selon leur rapidité.
Récompenses : le livre ne donne pas de barème de PA ; succès seulement si le secret est détruit ou rapporté avec preuves, bonus pour les anges contrariés et les mauvaises actions commises en route.
Fiches : seul Ellèmol est chiffré dans le livre. Les vigiles et les anges de Jerbé sont estimés (profil « ange de Marc » des PNJ rapides pour les anges) ; les autres PNJ ont une fiche minimale.`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [ellemol, vigiles, anges, lapin, henry, elisabeth, dutilleul, lou, brune].map(asType);
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));
writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types');
