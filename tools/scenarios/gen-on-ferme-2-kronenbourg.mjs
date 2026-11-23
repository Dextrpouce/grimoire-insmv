// Génère le fichier d'import « insmv-scenario » pour « Kronenbourg à La Poste, Chronopost à la bourre » (On Ferme !, p. 119-134)
// usage : node gen-on-ferme-2-kronenbourg.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'On Ferme !, « Kronenbourg à La Poste, Chronopost à la bourre », p. 119-134';
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
const P = 'of2-'; let n = 0; const id = (k) => P + k;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [poing(1)], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});

// ---------------- Anges ----------------
const fabiel = npc('fabiel', {
  nom: 'Fabiel (Guido Fozzi)', source: 'Ange de Didier, grade 2 — directeur du bureau central de la poste vaticane', type: 'ange',
  car: car('3 2 3 4 3 2'), def: L(1), pp: 17, pfFix: 7, seuilsFix: seuils('6/12/18/24'),
  armes: [poing(1)],
  pouvoirs: pows('Message officiel 3, Langage universel 3, Sommeil 2, Protection de l\'esprit 3, Téléportation 2'),
  talents: 'Aisance sociale 3, Baratin 2, Défense 1, Savoir occulte 3, Enquête 3, Métier (postier) 5, Informatique 3',
  notes: `La cinquantaine grisonnante, dégarni, 1 m 75. Fonctionnaire terne et méthodique que personne ne remarque. Incarné depuis 1603, déprimé par des siècles d'hypocrisie vaticane : il veut passer à l'Enfer, idéalement avec le DLIE. Agent double de Usigor depuis 1999.
Comportement : ne craint pas le témoignage de l'OESH (qui le prend pour un collègue sympa). Seuls les registres du Vatican et des archives romaines et florentines peuvent le confondre ; il joue alors l'imbécile et ment mal exprès. Brutalisé ou menacé, il avoue seulement une « chasse au sorcier » par passe-temps, puis tente de fuir avec le DLIE et appelle Usigor depuis une cabine… qui le tue (il ira en Enfer, mais pas comme il l'espérait).
Effrayé, il peut endormir le préposé de l'Enfer, voler le registre manuscrit, se téléporter dans sa cellule et le brûler (alerte incendie).
Combat non donné : coup de poing au niveau 1 (estimé).`,
});
const jeanPaul = npc('jean-paul', {
  nom: 'Eirnilus (Jean-Paul Berthier)', source: 'Ange de Daniel, grade 2 — caporal des gardes suisses, meneur de l\'OESH', type: 'ange',
  car: car('5 3 2 1 2 5'), def: L(4), pp: 12, pfFix: 6, seuilsFix: seuils('8/16/24/32'),
  armes: [arme('Extincteur', 'Masse d\'arme ou batte', 4), arme('Hallebarde', 'Hallebarde ou arme d\'hast', 3), arme('Pistolet de service', 'Revolver petit calibre', 2), poing(3)],
  pouvoirs: pows('Pétrification 4, Régénération 2, Vitesse 3, Aura de courage 1'),
  talents: 'Combat (contondantes) 4, Corps à corps 3, Défense 4, Tir (arme de poing) 2, Combat (hallebarde) 3, Athlétisme 3, Savoir militaire (garde suisse) 2',
  notes: `28 ans, 1 m 86, 102 kg, blond. Ange particulièrement obtus, muté chez les gardes suisses pour une insulte un soir de match. C'est lui qui a dé-pétrifié Usigor (sans rien comprendre) et qui a achevé Benito à l'extincteur.
Persuadé que les PJ sont les « autres » annoncés par le faux colonel : rien ne le fera douter. Refuse toute fouille de sa cellule (grade, statut d'ange) et la défend physiquement ; ne parle que sous la torture. Sur ordre du « colonel », il attaque l'Enfer de la bibliothèque pour voler le DLIE.
Dans sa cellule (four à micro-ondes) : schnaps drogué, crucifix « mithriaques » de l'OESH, émetteur-récepteur des MI pris sur Benito.
Armes : extincteur rendu en masse/batte, pistolet de service en revolver petit calibre (estimés).`,
});
const maurice = npc('maurice', {
  nom: 'Maurice Berthillon', source: 'Ange de Dominique, contact et donneur d\'ordres des PJ', type: 'ange',
  car: car('2 2 2 3 3 3'), def: 2, pp: 10,
  talents: 'Aisance sociale 3, Discussion 3, Savoir occulte 2',
  notes: `Tatillon, désapprouve la composition hétéroclite du groupe (surtout les serviteurs de Novalis, Blandine, Ange, Janus…). Remet passeports diplomatiques du Vatican et billets pour Rome.
Pendant l'enquête, il appelle les PJ toutes les heures pour exiger des résultats. S'ils coupent leurs portables, un ange de Dominique du Vatican leur tend un téléphone ; s'ils recommencent, c'est Dominique en personne au bout du fil.
Pas de caractéristiques dans le livre : fiche minimale estimée.`,
});

// ---------------- Démons et morts-vivants ----------------
const usigor = npc('usigor', {
  nom: 'Usigor (Morizio Guidoni)', source: 'Démon de Scox, grade 2 (ancien de Malphas)', type: 'demon',
  car: car('5 4 4 3 2 3'), def: L(3), pp: 19, pfFix: 8, seuilsFix: seuils('7/14/24/28'),
  armes: [poing(3)],
  pouvoirs: pows('Possession 3, Protection de l\'âme 2, Onde de choc 1, Charme 3'),
  talents: 'Baratin 4, Corps à corps 3, Défense 3, Séduction 4+, Aisance sociale 5, Savoir occulte 5, Savoir criminel 4',
  notes: `La trentaine athlétique, 1 m 63, brun. Faux calme, expert du double jeu, de l'endoctrinement et de la guerre psychologique. Méprise Fabiel. Pétrifié 700 ans par Ricardo, il veut le DLIE (qui contient le pacte) pour envoyer Ricardo au 7e cercle : question de principe.
Se fait passer pour Jean-Yves Bartave, colonel des gardes suisses en retraite, auprès de l'OESH. Passe en « DefCon 4 » dès qu'il apprend l'enquête : appelle ses zombies et pousse l'OESH au hold-up dans l'Enfer de la bibliothèque. Toujours en mouvement : scooter, cabines, terrasses de café, hôtels bon marché ; joint les gardes (surtout Jean-Paul) par téléphone.
BG 14 / BF 24 / MS 28 tels que donnés par le livre (BF 21 probable).`,
});
const zombies = npc('zombies', {
  nom: 'Zombies prêtés', source: 'Escouade de 12 morts-vivants prêtée par un collègue romain d\'Usigor', type: 'mortvivant', qty: 12,
  car: car('4+ 2 1 1 1 3'), def: L(2), pp: 6, pfFix: 5, seuilsFix: seuils('6/12/18/24'),
  armes: [{ n: 'Ongles d\'acier', att: L(4), prec: 2, puis: 2, melee: true }],
  pouvoirs: pows('Douleur 1, Membre exotique : ongles d\'acier'),
  talents: 'Corps à corps 4, Défense 2',
  notes: `Obéissent à Usigor en attendant de retrouver leur maître. Planqués dans une camionnette de pizzeria non loin du scooter d'Usigor.
Ongles d'acier : précision +2, puissance +2 (valeurs du profil zombie des PNJ rapides).`,
});

// ---------------- Gardes suisses ----------------
const gardeArmes = () => [arme('Hallebarde', 'Hallebarde ou arme d\'hast', 3), arme('Pistolet de service', 'Revolver petit calibre', 2), poing(3)];
const oesh = npc('oesh', {
  nom: 'Membres survivants de l\'OESH', source: 'Soldats de Dieu, gardes suisses (Aldo Ballazo, Florent Delporte, Laurent Sage)', type: 'soldat', qty: 3,
  car: car('3 3 2 1 1 3'), def: L(2), pp: 8, pfFix: 4, seuilsFix: seuils('4/8/12/16'),
  armes: gardeArmes(), pouvoirs: pows('Champ magnétique 1'),
  talents: 'Athlétisme 2, Savoir militaire (garde suisse) 2, Défense 2, Combat (hallebarde) 3, Tir (arme de poing) 2, Corps à corps 3, Savoir occulte (OESH) 2',
  notes: `La vingtaine sportive. Ordre Étanche de Saint Hercule : société secrète montée par Usigor (faux colonel Bartave), réunions sous Saint-Clément, vin de messe aux euphorisants, sacrifices de poulets, « épreuves » qui ressemblent à des délits.
Ils commencent à douter et veulent surtout survivre à des ordres contradictoires. Interrogés séparément, d'un ton paternaliste et militaire, loin de leur hiérarchie, ils peuvent tout raconter (« on n'a fait qu'obéir »). Repris en main par téléphone par le « colonel » ou par Jean-Paul, ils replongent.
Mentent très mal. Persuadés d'appartenir à la « CIA du Vatican », ils demandent à parler au colonel Bartave.
Pistolet de service rendu en revolver petit calibre (estimé).`,
});
const gardes = npc('gardes', {
  nom: 'Gardes suisses', source: 'Soldats de Dieu, la vingtaine athlétique', type: 'soldat', qty: 6,
  car: car('3 3 2 1 1 3'), def: L(2), pp: 8, pfFix: 4, seuilsFix: seuils('4/8/12/16'),
  armes: gardeArmes(), pouvoirs: pows('Champ magnétique 1'),
  talents: 'Athlétisme 2, Savoir militaire (garde suisse) 2, Défense 2, Combat (hallebarde) 3, Tir (arme de poing) 2, Corps à corps 3',
  notes: `Servent le Vatican et le pape, pas les anges : se voient comme l'élite de la chrétienté. Hostiles à toute ingérence angélique (fouille des cellules, surveillance de la bibliothèque) ; n'hésitent pas à défendre leur colonel. 110 en tout, 52 à l'étage des cellules.
Pistolet de service rendu en revolver petit calibre (estimé).`,
});
const bailly = npc('bailly', {
  nom: 'Jean-Yves Bailly', source: 'Soldat de Dieu, colonel des gardes suisses', type: 'soldat',
  car: car('3 3 2 1 1 3+'), def: L(2), pp: 8, pfFix: 4, seuilsFix: seuils('4/8/12/16'),
  armes: gardeArmes(), pouvoirs: pows('Champ magnétique 1'),
  talents: 'Athlétisme 2, Savoir militaire (garde suisse) 4, Défense 2, Combat (hallebarde) 3, Tir (arme de poing) 2, Corps à corps 3, Hobby (montres suisses) 4',
  notes: `38 ans, 1 m 72, blond aux yeux verts. Colonel depuis un an. Calme, méthodique, maniaque de l'ordre et des montres anciennes (intarissable). Aucun sens de l'initiative. Méprise les anges : à celui qui le critique, il demande où il était lors du sac de Rome de 1527.
Les MI peuvent prendre son apparence (voir scène « Infiltration »).`,
});

// ---------------- Ricardo et sa secte ----------------
const ricardo = npc('ricardo', {
  nom: 'Ricardo « de Montoya »', source: 'Sorcier immortel (ex-Montoni), rentier', type: 'heroique',
  car: car('2 3 3 3+ 3+ 3'), def: L(4), pfFix: 6, seuilsFix: seuils('3/6/9/12'),
  armes: [arme('Couteau', 'Poignard ou saï', 3)],
  talents: 'Défense 4, Savoir occulte 5, Discussion 4, Baratin 4, Charme 5, Intimidation 4, Aisance sociale 5, Langues (italien 3, français 3, allemand 2, anglais 2, latin 3, vieil italien 3, espagnol 3, sumérien 3, babylonien 2, suomi 3, magyar 2, baloutchi 2), Savoir criminel (sectes) 4, Basse sorcellerie 5, Haute sorcellerie 4+, Torture 4+, Combat (couteau) 3',
  notes: `La quarantaine classe, 1 m 58, brun. Paysan toscan qui a pactisé en 1245 avec Usigor (66 ans et 6 mois de faveurs ou jusqu'à la fin de l'incarnation du démon), puis l'a pétrifié en 1278 grâce au sort du DLIE : tant que le démon reste incarné, il est immortel. Escroc absolu, lâche, ne vise que son bien-être.
Prêt à tout pour que l'Enfer ne récupère pas le DLIE (qui contient le pacte). Gère la crise depuis la suite royale de l'Hôtel de Russie, entouré d'au moins 3 MI ; ne vient jamais en personne sur un lieu de combat.
Bague de métamorphose de sa conception (sacrifices humains pour la recharger). Si les PJ le mettent en présence du DLIE, il part immédiatement en Enfer, au carré VIP.
Ch reportée en Foi ; type « humain héroïque » choisi pour le sorcier.`,
});
const mi = npc('mi', {
  nom: 'Magister Impedimentae', source: 'Secte de sorciers de Ricardo, 30 à 50 ans, « francs-maçons glauques »', qty: 8,
  car: car('3 2 3 2 2 2'), def: 2,
  armes: [arme('Couteau gothique', 'Poignard ou saï', '3+'), arme('Pistolet', 'Revolver petit calibre', 2)],
  talents: 'Savoir occulte 4, Basse sorcellerie 3, Haute sorcellerie 3, Savoir criminel 3, Combat (couteau) 3+, Tir (arme de poing) 2',
  notes: `Sous la coupe de Ricardo, qu'ils prennent pour l'antéchrist qui leur donnera l'immortalité (et des places pour la finale de la Coupe du monde). Logent à l'Hôtel de Russie ; en planque devant l'entrée de service des gardes suisses ; tiennent l'usine désaffectée près de l'aéroport. Adorent les talkies-walkies.
Bagues de métamorphose : 1 PP par heure de métamorphose, rechargées par sacrifice humain (1 PP par point de Fo, Vo et Ch du sacrifié). Médaillon satanique sans pouvoir.
Membres connus : Benito Lavazzi (mort), Bakana M'Bala (homme de ménage de la bibliothèque, taupe), Silvio Bernano (en prison près de Pise).
PF, PP et seuils laissés vides dans le livre : calculés par l'application ; défense non donnée (niveau 1).`,
});
const bernano = npc('bernano', {
  nom: 'Silvio Bernano', source: 'Magister Impedimentae emprisonné', car: car('3 2 3 2 2 2'),
  talents: 'Savoir occulte 4, Basse sorcellerie 3, Savoir criminel 3',
  notes: `Arrêté à Bangkok en 2002, condamné à 7 ans (semi-liberté) dans une prison modèle près de Pise. Nie appartenir aux MI. Intouchable en prison ; au parloir, il cherche à soutirer des infos qu'il transmet par téléphone à Ricardo (écoute ou relevé d'appels : l'Hôtel de Russie). Enlevé hors de la prison, il résiste mal à la vraie douleur et parle : la secte, la villa moderne de Ricardo près de Florence, le livre « qui contient son âme ».
Profil repris de celui des MI (estimé).`,
});

const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  scene('briefing', '1. Crime blitz au Vatican', 'Salon officiel de l\'aéroport (Roissy de préférence), puis vol pour Rome',
    `Convocation urgente. Maurice Berthillon, ange de Dominique très tatillon, remet passeports diplomatiques du Vatican et billets pour Rome-Da Vinci.
Mission : une infiltration grave a eu lieu chez les gardes suisses, avec un ange de Daniel impliqué ; le Vatican est d'ordinaire hors juridiction angélique, mais Dominique a obtenu l'envoi d'anges dotés des pleins pouvoirs. Maurice ne donne pas d'autres détails et laisse voir son mépris pour un groupe hétéroclite.
Vol en business, apéro, arrivée le jour même du double assassinat.
Encadré « Le Vatican » : depuis les accords de Latran, les anges n'y ont que les pouvoirs que la hiérarchie catholique leur concède (Fabiel n'est que postier, Jean-Paul simple caporal). Humains comme anges locaux opposeront une forte résistance : diplomatie, menaces et coups de fil haut placés.`,
    [inScene(maurice)]),
  scene('caserne', '2. Les lieux du crime', 'Caserne des gardes suisses, derrière Saint-Pierre – 2e étage (cellules de l\'OESH)',
    `Dominique a fait geler les lieux, mais les gardes ont « un peu » bousculé les indices, parfois exprès. Caméras partout.
• Cellule d'Alphonse Viger : poignardé huit fois, en pyjama, pistolet à la main (une seule balle tirée sur Benito à bout portant). Enquête : fouille précise mais peu discrète (Jean-Paul et l'OESH ont retiré crucifix mithriaques et vin de messe drogué).
• Cellule de Werner Schmurz : assis comme s'il buvait avec quelqu'un (le second verre a été jeté par la fenêtre, brisé dans la cour). Pentacle et « In Gloria Lucifer » au marqueur : Enquête, l'auteur a imité une main tremblante. Overdose de barbituriques ; autopsie : drogué aux opiacés. Pistolet caché dans le micro-ondes. Indice clé : sur son grand tableau Velleda, au milieu des listes de courses, la mention « Daemonis Libris In Extenso ».
• Cellule de Jean-Claude Gachet : trop rangée, fouillée deux fois. Le corps de « Jean-Claude » y a été traîné. Dans le placard, sac de sport négligé par l'OESH : maquillage de théâtre, batteries de l'émetteur des MI, trois couteaux gothiques, plan de la caserne avec le chemin vers la cellule et, au dos, les noms des six membres de l'OESH (traces de sang : fruit de l'interrogatoire).
• Corps de Benito Lavazzi : visage détruit par l'extincteur, balle dans le ventre. Traces de maquillage ; Perception : le menton ne colle pas avec la photo de Gachet. Oreillette Bluetooth (le boîtier a été prélevé par l'OESH), bague de métamorphose au pentacle à l'aura malsaine (auriculaire droit), couteau du meurtre de Werner en main, médaillon satanique des Magister Impedimentae.`,
    [inScene(gardes, { qty: 4 }), inScene(jeanPaul)]),
  scene('temoins', '3. Bandes vidéo, témoignages et fouilles', 'Caserne des gardes suisses',
    `Bandes vidéo : droit théorique, résistance pratique (hypocrisie et mesquinerie). Les six de l'OESH sortent vers 21 h « dîner » à la pizzeria Romana, à côté de Saint-Clément (patron payé pour l'alibi). Cinq rentrent vers minuit ; « Jean-Claude » vers 2 h, hésitant, gros sac de sport, main à l'oreille dans le couloir, puis schnaps vers la chambre de Werner (2 h), visite chez Alphonse, ressort blessé un couteau en main et se fait abattre par un objet rouge (l'extincteur de Jean-Paul). Vers 5 h le colonel Bailly arrive, le corps est emmené. Le matin, Jean-Paul et au moins un membre de l'OESH entrent dans chaque cellule de victime avec un sac et ressortent plus chargés.
Témoignages : réveil vers 4 h 45 (détonation, porte, cris, choc). Jean-Paul, voisin de Werner, a frappé l'imposteur armé d'un couteau. Gachet a été croisé vers 2 h, nerveux. L'OESH reconnaît les faits si on les lui présente mais se retranche derrière le « secret défense » ; Jean-Paul ne lâche rien sauf torture. Les soldats de Dieu craquent si on joue sur l'autorité angélique et réclament le colonel Bartave. Le vrai Bartave, retraité à Lucerne (consultant en sécurité bancaire), se joint facilement : il n'a jamais entendu parler de l'OESH ni remis les pieds en Italie depuis un an.
Autres cellules : fouilles très mal vues ; on y trouve de tout (revues nazies, porno, Das Kapital…) sans rapport avec l'affaire. Celles des survivants de l'OESH sont « clean ». Tout est chez Jean-Paul (micro-ondes) : schnaps à la morphine, crucifix de l'OESH, émetteur des MI de très haut niveau. Matériel adéquat, des heures et un jet de Savoir d'espion extrêmement difficile : on localise l'émetteur dans la suite de Ricardo à l'Hôtel de Russie. Jean-Paul défend sa cellule : ruser ou attendre qu'il s'absente.`,
    [inScene(jeanPaul), inScene(oesh), inScene(gardes, { qty: 6 }), inScene(bailly)], true,
    [choice('cellule', 'Comment les PJ accèdent-ils à la cellule de Jean-Paul ?', [
      ['Ruse ou absence de Jean-Paul', 'Ils trouvent schnaps drogué, crucifix et l\'émetteur des MI (piste de l\'Hôtel de Russie).'],
      ['De force', 'Jean-Paul se bat, les gardes s\'en mêlent : incident grave reproché par Dominique et la hiérarchie humaine.'],
      ['Ils laissent tomber', 'Pas d\'émetteur : la piste de Ricardo passera par les MI ou les archives.'],
    ]),
    choice('oesh', 'Les PJ font-ils parler les survivants de l\'OESH ?', [
      ['Oui, séparément et avec autorité', 'Ils racontent l\'Ordre, Saint-Clément et le colonel Bartave : le vrai Bartave, à Lucerne, dément tout.'],
      ['Non', 'Le faux colonel garde la main sur eux.'],
    ])]),
  scene('biblio', '4. La bibliothèque et l\'Enfer du Vatican', 'Bibliothèque vaticane et son « Enfer » (fonds interdit)',
    `Registres : informatisé à badges pour la bibliothèque (jet d'Informatique une fois les autorisations obtenues), manuscrit pour l'Enfer.
• Bibliothèque : très peu de gardes y viennent. Une requête sur Guido Fozzi fait ressortir toute son enquête sur Ricardo, y compris des demandes de prêt aux archives romaines et florentines.
• Enfer : Werner, Jean-Claude et Jean-Paul y sont venus récemment, dix minutes à chaque fois, pour du repérage du DLIE. En épluchant le registre : Guido Fozzi a beaucoup consulté le DLIE (85 visites notées, dont 68 consultations, alors que trois des quatre préposés sont dans sa poche et ne notent qu'un quart de ses venues).
• Le DLIE : gros vélin relié, abîmé, consultable sur place seulement, avec des gants et en caisson isobare. Recueil médiéval de démons (écrit au XIe siècle par un moine fou, exemplaire unique, saisi en 1629). Contient le pacte (caché dans la couverture) et une demi-douzaine de sortilèges dont la pétrification (plus de 8 h d'invocation, conjonction astrologique annuelle, duel de Volonté). Le sortir de l'Enfer est quasi impossible ; l'Enfer est surveillé par des gardes suisses hostiles aux PJ.
Indice humain : Bakana M'Bala, homme de ménage togolais, est la taupe des MI.`,
    [inScene(gardes, { qty: 2 })], false,
    [choice('fabiel', 'Les PJ confrontent-ils Fabiel aux registres ?', [
      ['Oui, avec les preuves', 'Il joue l\'idiot, puis avoue une simple « chasse au sorcier » ; il tente ensuite de fuir avec le DLIE et appelle Usigor, qui le tue.'],
      ['Oui, sans preuves', 'Il nie tranquillement : rien ne le relie aux meurtres.'],
      ['Pas encore', 'Il peut, s\'il prend peur, voler et brûler le registre de l\'Enfer.'],
    ])]),
  scene('mi', '5. Sur la piste des Magister Impedimentae', 'Archives du Vatican, prison près de Pise',
    `Les archives vaticanes signalent le nom (Vera Cruz au XVIIe, Boston au XVIIIe, Paris au XIXe) et surtout Florence depuis la fin du XIXe : meurtres, enlèvements, sacrifices, jamais prouvés. Seule prise : Silvio Bernano, arrêté à Bangkok avec un attirail sataniste, condamné à 7 ans avec semi-liberté, détenu près de Pise.
Au parloir, il ne dit rien et renseigne Ricardo par téléphone. Avec un mandat ou des contacts : écoute de sa ligne → appels vers l'Hôtel de Russie à Rome. Les plus extrêmes l'enlèvent quand il sort : il parle vite (secte, villa moderne de Ricardo près de Florence, livre qui contient l'âme du maître). La secte étant une arnaque de Ricardo, ses infos restent limitées.`,
    [inScene(bernano)]),
  scene('archives', '6. Archives romaines et florentines, villa Montoni', 'Rome, Florence, ruines de la villa Montoni dans le Chianti',
    `Archives : accès souple mais inertie de l'administration italienne (patience, psychologie, italien parfait ; des amis haut placés accélèrent). En suivant les traces de Guido, tout est déjà classé : la famille Montoni traverse les siècles avec des patriarches étrangement semblables, jusqu'au pillage d'une « maison de sorciers » par des moines exaltés (1527). Les cadastres de Florence localisent les ruines.
Villa Montoni (à ne pas confondre avec la villa moderne de Ricardo) : accès en 4×4, traces de terrassement récent (pelleteuse louée par Fabiel jusqu'à la cave). Matériel de spéléo et débroussaillage : dans la cave, un mur de brique éventré masquait une alcôve avec un poteau de bois pourri et des restes de corde (là où Usigor était emmuré).`),
  scene('gachet', '7. Événements : cadavre de Gachet et registres en flammes', 'Quais du Tibre devant le château Saint-Ange ; caserne',
    `Le MJ distille ces événements selon les actions des PJ, pour qu'ils sentent le chrono (Maurice appelle toutes les heures).
• Découverte du cadavre de Jean-Claude Gachet : déposé par les MI sur les quais, devant le château Saint-Ange, méconnaissable, un pentacle tracé à la tronçonneuse sur le torse. Paranoïa accrue de l'OESH, colère de tous les gardes : relations encore plus tendues avec les PJ.
• Disparition des registres de l'Enfer : si Fabiel a peur, il endort le préposé, vole le registre, se téléporte dans sa cellule et le brûle dans l'évier (alerte incendie ; il embobine les gardes pompiers, non sans mal).`,
    [inScene(fabiel)]),
  scene('faux-colonel', '8. Infiltration d\'un MI sous la forme du colonel Bailly', 'Vatican, caserne des gardes suisses',
    `Les MI voient sortir le vrai colonel : l'un d'eux prend son apparence et entre au bluff, en civil, avec un signe discret aux gardes. Il rassure l'OESH, approuve les ordres de « l'ancien colonel » et désigne les PJ comme des envoyés des « autres » à éliminer d'urgence, puis repart avant le retour du vrai.
S'il croise un PJ, il pousse le bluff jusqu'à l'engueuler et à le provoquer devant des gardes normaux, qui défendront leur chef. Un MJ retors fait entrer le vrai colonel en plein combat.`,
    [inScene(mi, { qty: 1, nom: 'MI déguisé en colonel Bailly' }), inScene(gardes, { qty: 6 }), inScene(bailly)], true,
    [choice('faux', 'Les PJ démasquent-ils le faux colonel ?', [
      ['Oui', 'La bague de métamorphose s\'épuise (1 PP/h) ; un MI capturé mène à l\'Hôtel de Russie.'],
      ['Non, bagarre avec les gardes', 'Gardes suisses blessés ou tués : réprimande sévère de Dominique et de la hiérarchie humaine.'],
    ])]),
  scene('attaque', '9. Vous l\'avez en Bibliothèque rose ? L\'attaque de l\'Enfer', 'Entrée de service au creux des murailles du Vatican',
    `Quand Usigor croit le DLIE sur le point d'être confisqué ou volé, il lance les survivants de l'OESH (et Jean-Paul) sur l'Enfer de la bibliothèque. Le vol réussit (le préposé meurt discrètement), mais la taupe M'Bala prévient Ricardo. Un MI grimé en garde dénonce les voleurs « d'une relique » : les gardes interpellent l'OESH et veulent ouvrir l'attaché-case. Jean-Paul, persuadé d'une embuscade des « autres », charge. Les MI s'en mêlent, puis Usigor et ses zombies. Le tout devant quelques touristes ébahis.
Sans les PJ, Usigor devrait l'emporter : il prend l'attaché-case et fuit.`,
    [inScene(usigor), inScene(zombies, { qty: 12 }), inScene(jeanPaul), inScene(oesh), inScene(gardes, { qty: 6 }), inScene(mi, { qty: 4 })], true,
    [choice('dlie', 'Qui repart avec le DLIE ?', [
      ['Les PJ', 'Le livre est sécurisé ; Ricardo peut être mis en sa présence (il part aussitôt en Enfer).'],
      ['Usigor', 'Il récupère le pacte : Ricardo est condamné, l\'Enfer marque un point.'],
      ['Les gardes suisses', 'Le livre retourne à l\'Enfer de la bibliothèque, sous haute surveillance.'],
    ])]),
  scene('echange', '10. Échange à la viennoise', 'Usine désaffectée près de l\'aéroport Da Vinci',
    `Si Ricardo apprend l'implication de Fabiel (indiscrétion des PJ, destruction des registres), il lui propose par téléphone le DLIE contre la vie éternelle. Fabiel, déjà immortel, accepte un faux échange : il sort de l'Enfer avec un sac contenant l'annuaire de Rome Nord et prévient Usigor.
À l'usine : les MI en force (Ricardo reste à l'abri et parle au talkie-walkie), les survivants crédules de l'OESH amenés par le faux colonel. Fabiel fait traîner jusqu'à l'intervention de l'OESH, puis se téléporte à la gare de l'aéroport et rentre au Vatican. Interrogé, il nie maladroitement puis prétend avoir servi d'appât pour l'OESH (aider des soldats de Dieu à coincer des sorciers, c'est légal…).`,
    [inScene(fabiel), inScene(mi, { qty: 8 }), inScene(oesh), inScene(usigor), inScene(zombies, { qty: 6 })], true),
  scene('ricardo', '11. L\'Hôtel de Russie', 'Suite royale de l\'Hôtel de Russie, Rome',
    `Repaire de Ricardo, toujours entouré d'au moins 3 MI ; les autres MI y logent et viennent y « travailler ». On y arrive par l'émetteur de Benito, les appels de Silvio Bernano ou un MI capturé.
Ricardo est lâche : il marchande tout (MI, fortune, collection Gucci) pour rester en vie, et n'a qu'une crainte, que l'Enfer obtienne le DLIE. Mis en présence du livre, il est immédiatement envoyé en Enfer, au carré VIP.`,
    [inScene(ricardo), inScene(mi, { qty: 3 })], true,
    [choice('ricardo', 'Que font les PJ de Ricardo ?', [
      ['Ils le mettent en présence du DLIE', 'Envoyé aussitôt en Enfer : super bonus pour Dominique (l\'Enfer, prison des injustes).'],
      ['Ils le livrent à la hiérarchie', 'Coupable identifié ; Ricardo tente de marchander.'],
      ['Il s\'échappe', 'Il reste une menace pour le DLIE et pour les PJ.'],
    ])]),
  scene('fin', '12. Fins ?', 'Après l\'enquête',
    `But des anges : identifier les coupables, Ricardo, Usigor et idéalement Fabiel. Ricardo envoyé en Enfer via le DLIE : gros bonus pour Dominique.
À l'inverse, toute action d'envergure au Vatican, toute mort de garde suisse innocent et à plus forte raison de touristes est sévèrement réprimandée par Dominique comme par la hiérarchie humaine : régler l'affaire avec doigté (et autour d'une bière).
Si Fabiel a appelé Usigor depuis une cabine pour lui annoncer sa défection, il est tué et part en Enfer.`, [], false,
    [choice('coupables', 'Quels coupables les PJ ont-ils identifiés ?', [
      ['Ricardo, Usigor et Fabiel', 'Réussite complète.'],
      ['Ricardo et Usigor', 'Réussite ; le traître Fabiel reste en place.'],
      ['Aucun ou presque', 'Échec : Dominique est furieux.'],
    ])]),
];

const scenario = {
  id: 'of2-kronenbourg',
  nom: 'On Ferme – Kronenbourg à La Poste, Chronopost à la bourre',
  resume: 'Scénario de Magna Veritas. Juin 2006 : deux membres d\'une société secrète de gardes suisses (l\'OESH) sont assassinés au Vatican par un sorcier déguisé, lui-même tué. Envoyés par Dominique avec les pleins pouvoirs dans un Vatican hostile, les PJ démêlent trois intrigues croisées autour du « Daemonis Libris In Extenso » (DLIE), caché dans l\'Enfer de la bibliothèque vaticane : le démon Usigor veut le pacte qu\'il contient, le sorcier immortel Ricardo veut l\'en empêcher, et Fabiel, ange postier dépressif, veut passer à l\'Enfer. Enquête sous pression façon « 24 h chrono ».',
  notes: `Source : ${REF}. Camp : MV. Récompenses en PA non chiffrées par le livre : à apprécier selon les coupables identifiés et la casse au Vatican (voir scène 12).

Histoire secrète (résumé) :
• 1245 : Ricardo Montoni, viticulteur toscan ruiné, signe un pacte avec Usigor (démon de Malphas) : faveurs de l'Enfer pendant 66 ans et 6 mois ou jusqu'à la fin de l'incarnation du démon.
• 1278 : grâce à un sort du DLIE, Ricardo pétrifie Usigor, l'emmure dans sa cave et fait relier le pacte dans le DLIE : il est immortel tant que la statue tient.
• 1527-1545 : la villa est brûlée par des fanatiques ; Ricardo s'en sort par une bague de métamorphose mais perd la statue et le DLIE. 1629 : le DLIE rejoint l'Enfer de la bibliothèque vaticane (saisie de l'Inquisition).
• 1603 : incarnation de Fabiel (Didier) à Rome ; 1937 directeur de la poste vaticane et grade 2 ; 1971 identité de Guido Fozzi. Dégoûté par des siècles d'hypocrisie, il fouille l'Enfer de la bibliothèque, trouve le pacte (1994) et la statue (1999), qu'il fait dé-pétrifier par Jean-Paul Berthier, ange de Daniel benêt.
• 1999-2005 : Usigor libéré, Fabiel devient son agent double. Usigor passe chez Scox (grade 2, 2005) et veut le pacte pour expédier Ricardo au pire des Enfers. Fabiel refuse de voler le livre lui-même.
• 2005-2006 : opération « Petit Suisse à la confiture » : sous l'apparence du colonel en retraite Bartave, Usigor crée l'Ordre Étanche de Saint Hercule (OESH) avec six gardes de l'escouade de Jean-Paul (réunions dans le temple de Mithra sous Saint-Clément) et leur fait préparer le vol du DLIE.
• Mai-juin 2006 : les repérages maladroits sont remarqués par Bakana M'Bala, taupe des Magister Impedimentae (MI), la secte de Ricardo. Ricardo s'installe à l'Hôtel de Russie, reconnaît Usigor, enlève et torture Jean-Claude Gachet (24 juin). Le MI Benito Lavazzi prend sa place (25 juin) : il empoisonne Werner Schmurz, poignarde Alphonse Viger et meurt sous l'extincteur de Jean-Paul. Arrivée des PJ.

Trois factions : Usigor et ses zombies (récupérer le DLIE, via l'OESH et Fabiel) ; Ricardo et les MI (empêcher que le DLIE quitte le Vatican ou soit détruit) ; Fabiel (passer à l'Enfer avec le DLIE). Les gardes suisses humains font obstacle à l'ingérence angélique.

Placement des PNJ : Fabiel au Vatican (jusqu'à sa fuite) ; Usigor en scooter entre terrasses, cabines et hôtels bon marché ; zombies dans une camionnette de pizzeria près du scooter ; gardes suisses au Vatican ; Ricardo dans la suite royale de l'Hôtel de Russie avec au moins 3 MI ; MI à l'Hôtel de Russie, devant l'entrée de service des gardes et à l'usine désaffectée près de l'aéroport.

Rythme : environnement complexe et hostile, chaque mouvement entraîne une réaction ; le MJ fait sentir le chrono (Maurice appelle toutes les heures) tout en laissant l'enquête possible.

Remarques : le livre appelle le faux colonel Bartave (retraité, à Lucerne) et le colonel en poste Bailly ; la chronologie cite un « Hervé Tardieux » parmi l'OESH (nom absent du reste du texte). L'OESH compte six membres dans le texte, la fiche des survivants en nomme trois.
Fiches : armes de service rendues avec la table des règles et signalées dans les notes.`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [fabiel, jeanPaul, maurice, usigor, zombies, oesh, gardes, bailly, ricardo, mi, bernano].map(asType);
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));
writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types,', scenes.reduce((a, s) => a + s.choix.length, 0), 'choix');
