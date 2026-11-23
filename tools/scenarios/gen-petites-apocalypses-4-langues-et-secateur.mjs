// Génère le fichier d'import « insmv-scenario » pour « Langues et sécateur » (Les Petites Apocalypses, ch. 9, p. 74-83 ; adaptations p. 116)
// usage : node gen-petites-apocalypses-4-langues-et-secateur.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Les Petites Apocalypses, ch. 9 « Langues et sécateur », p. 74-83';
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
const P = 'pa4-'; let n = 0; const id = (k) => P + k;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [poing(1)], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});
const MINI = 'Pas de caractéristiques dans le livre : fiche minimale (valeurs humaines moyennes par défaut).';

// ---------------- Sorciers ----------------
const igor = npc('igor', {
  nom: 'Igor Tovniak, « le Chat »', source: 'Sorcier, voleur du grimoire et coupeur de langues', car: car('1 1 2 3 1+ 3'), def: L(2),
  pfFix: 4, seuilsFix: seuils('2/4/6/8'),
  armes: [arme('Sécateur', 'Cran d\'arrêt', 1)],
  talents: 'Aisance sociale 0+, Baratin 2, Défense 2, Discrétion 2, Discussion 4 ; Basse sorcellerie 3, Haute sorcellerie 2, Pentacle 2, Invocation 3, Demande 3, Lien 2',
  notes: `La quarantaine, blond aux yeux bleus, visage carré, 1,75 m ; marmonne au lieu d'articuler. Brillant mais flemmard, têtu, ronchon, pessimiste, malhonnête et odieux (surtout avec les femmes). Études abandonnées, petits boulots enchaînés ; vendeur au Vingt naturel jusqu'au vol.
Il vole le grimoire araméen de Jean-Louis, coupe des langues d'enfants au sécateur (signature : une patte de chat au tampon, d'où son surnom médiatique) et invoque puis lie Charles-Otto. Bien meilleur en sorts longs et préparés qu'en sorts instantanés : face aux PJ, sa sorcellerie ne va pas loin, et il ne se bat pas physiquement.
Corps à corps non donné : sécateur estimé au niveau 1 (profil d'arme du cran d'arrêt).`,
});
const jeanLouis = npc('jean-louis', {
  nom: 'Jean-Louis Lafrange', source: 'Sorcier, chimiste, commanditaire volé', car: car('2+ 2 1 2+ 3 1'), def: 2,
  pfFix: 5, seuilsFix: seuils('3/7/10/14'),
  armes: [poing(1)],
  talents: 'Baratin 3, Hobby : cuisine 3+, Kama-sutra 2, Séduction 3 ; Basse sorcellerie 2+, Haute sorcellerie 2+, Pentacle 1+, Invocation 1+',
  notes: `La quarantaine, très grand (1,95 m), maigre, brun, nez immense, oreilles décollées, grand sourire sympathique. Enthousiaste, sujet à de gros coups de déprime. Chimiste, divorcé, couche avec sa patronne (et le regrette). Sorcier moyen qui collectionne les vieux grimoires chinés en brocante sans tout comprendre ; excellent cuisinier.
Voit Igor une fois par mois, sans amitié véritable. Se sent responsable des agressions et vient chercher l'aide de la DTC.
Après le scénario : allié mineur possible (consultant en sorcellerie, par exemple face à Médée).
Défense et attaque non données : estimées au niveau 1.`,
});

// ---------------- Démon ----------------
const charlesOtto = npc('charles-otto', {
  nom: 'Charles-Otto Frèz', source: 'Démon de Kobal, grade 2, invoqué et lié par Igor', type: 'demon', car: car('6 5 2 4 3 4'), def: L('8+'),
  pp: 33, pfFix: 10, seuilsFix: seuils('8/16/24/32'),
  armes: [livre('Griffes', 6, 10)],
  pouvoirs: pows('Adhérence 2, Corps liquide, Détection du danger 3, Esquive acrobatique 3, Gag absurde 6+, Membre exotique : griffes, Perturbation de pouvoir 4, Rebond 4, Vitesse 5, Volonté supra-normale 3'),
  talents: 'Acrobatie 6+, Athlétisme 5+, Corps à corps 6+, Défense 8+, Humour 8, Intimidation 4+, Pickpocket 4+, Séduction 5+',
  notes: `Petit (1,60 m), châtain foncé, petits yeux noirs ; très vif, très fort, réflexes hors norme. Rictus inquiétant permanent, ricanements de dément en combat. Adore être un démon ; manipulateur et malin, il joue au chat et à la souris.
Griffes : 66/RU+6/M+10 dans le livre, 2 PP pour les sortir.
Moment clé : quand il est en difficulté, le MJ simule un 666 sur son Gag absurde, qui projette les PJ dans l'illusion Virtuavie (voir scène 7). Il n'a aucune envie de mourir pour Igor et fuit dès la fin de l'illusion.`,
});

// ---------------- PNJ sans caractéristiques ----------------
const hercule = npc('hercule', {
  nom: 'Hercule', source: 'Patron de la DTC, héros païen', type: 'paien', car: car('4 3 2 2 2 3'),
  notes: `Commanditaire : fixe le tarif, fait signer le contrat à Jean-Louis et envoie les PJ ramener Igor et le grimoire. Les faits divers sur « le Chat » l'ont horrifié : il est ravi de faire arrêter ce malade.
Ses caractéristiques sont au ch. 4 (p. 21) ; non reprises ici, il ne combat pas dans ce scénario. Valeurs de la fiche indicatives.`,
});
const ludovic = npc('ludovic', {
  nom: 'Ludovic', source: 'Patron du Vingt naturel (boutique de jeux de rôles, Paris)',
  notes: `N'a pas vu Igor de la semaine et s'en réjouit (vendeur nul, méprisant envers les clients). Connaît son adresse (bulletins de salaire). Loutonoto l'a appelé : Igor a loué un utilitaire au nom du magasin avec un vieux chéquier de la boutique et ne l'a pas rendu.\n${MINI}`,
});
const patron = npc('patron-frite', {
  nom: 'Le patron du Roi de la Frite', source: 'Gérant de la friterie de Dunkerque, rue Poincaré',
  notes: `Grand gaillard rigolard et accueillant. Confirme avoir embauché un homme correspondant à Igor (petit CDD de 15 h). S'inquiète : police ? quels ennuis ? Demande qu'on le laisse tranquille pendant le carnaval (les frites se vendent bien). Ne connaît pas l'adresse d'Igor mais lui a suggéré des logements.\n${MINI}`,
});
const joseph = npc('joseph', {
  nom: 'Joseph', source: 'Opérateur de Virtuavie (illusion)',
  notes: `Antillais énergique au grand sourire et à l'accent chantant ; appelle tout le monde « les zogs ». Retire les casques, vérifie que tout va bien et pousse les PJ vers la salle de relaxation. Prend toute protestation (amnésie, autre identité) pour une tentative de se faire rembourser et éclate de rire.\n${MINI}`,
});
const simimz = npc('simimz', {
  nom: 'Simimz', source: 'Épicier de nuit (illusion)',
  notes: `Petit gros d'allure méditerranéenne, moustache qu'il roule en réfléchissant. Sa boutique ouverte tard prétend vendre « tout ce dont vous avez besoin ». Écoute les PJ et propose une sortie (pilules, portail au bout d'un tunnel sous sa boutique…) contre un service ou un paiement.\n${MINI}`,
});
const feirrera = npc('feirrera', {
  nom: 'Simon Feirrera', source: 'Conférencier sur les mondes parallèles (illusion)',
  notes: `Considéré comme un doux dingue, ses conférences font salle vide. Propose sa machine bricolée et visiblement dangereuse ; avoue des « mésaventures » (cobayes devenus fous) mais affirme avoir voyagé lui-même entre les univers. Au MJ de le rendre crédible ou inquiétant.\n${MINI}`,
});

const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  scene('dtc', '1. La DTC entre en jeu', 'Locaux de la DTC, Paris – mi-mars',
    `Jean-Louis vient raconter son histoire à Hercule : le dîner, le grimoire chiné en brocante, sa disparition après la visite d'Igor, puis les faits divers des langues coupées. Il se souvient qu'un sort du livre demandait des langues humaines, mais pas de ce qu'il faisait. Il ne peut pas aller à la police (on le prendrait pour un fou) et se sent coupable d'avoir fanfaronné.
Hercule fixe le prix, fait signer le contrat et convoque les PJ : ramener Igor (Hercule décidera de son sort) et le grimoire.

Ce que sait Jean-Louis : nom et numéro de téléphone d'Igor, qu'il habite Paris (adresse inconnue), description physique et quelques traits de caractère (il refuse de jouer les psychologues : il se rend compte qu'il le connaissait mal). Igor travaillait dans une boutique de jeux de rôles dont le nom contient « alcool » (indice : vin → Vingt naturel).
Pistes : l'adresse se retrouve à partir du numéro (relations, piratage) ; la boutique dans l'annuaire, si les PJ font le lien alcool-vin-vingt.

Faits divers (pour les joueurs) : du 10 au 14 mars, quatre agressions à Paris par un homme blond armé d'un sécateur qui coupe la langue d'enfants de 6 à 12 ans à la tombée de la nuit, hors de vue des parents (trois squares ou jardins d'enfants, une cour d'immeuble). Une patte de chat tamponnée retrouvée à chaque fois sauf la dernière. Le 14, le père de la fillette visée a fait fuir l'agresseur et l'a perdu dans les rues. Rien depuis ; énorme mobilisation policière. Exemple : le 10 mars, Romain Navarres, 7 ans, square Bolivar, langue coupée pendant que sa mère le perdait de vue quelques minutes ; ni témoin ni trace, tampon de patte de chat sur son manteau.`,
    [inScene(jeanLouis), inScene(hercule)]),
  scene('paris', '2. L\'enquête parisienne', 'Paris : appartement d\'Igor, le Vingt naturel, le Chat qui rit',
    `En coulisses : Igor a cessé d'aller travailler, partage son temps entre la traduction (laborieuse) du sort araméen et la collecte des composantes : cinq langues d'enfants de moins de 14 ans, plus une part de flan, une salade, de la cardamome et de la glu achetées au Multiprix. Ravi de son surnom de super-méchant, il craint pourtant la police : il ferme ses comptes, loue un utilitaire chez Loutonoto et part pour Dunkerque, où le Roi de la Frite recrute.

Chez Igor : studio insalubre sous les toits (4e étage, sanitaires communs à l'étage du dessous). Meubles laissés sur place, étagères vidées mais sans poussière, ustensiles de cuisine manquants. Indices :
• bulletins de salaire : nom et adresse du Vingt naturel ;
• dans la pagaille du bureau : contrat de location Loutonoto pour un utilitaire ;
• sur le canapé-lit, un journal avec un article découpé : un exemplaire intact (bibliothèque) montre au recto l'ouverture d'une salle de spectacle, « le Chat qui rit », et au verso l'annonce de recrutement du Roi de la Frite (Paris, Caen, Le Havre, Lille, Dunkerque) ;
• des feuilles d'essais de pattes de chat imprimées.

Au Vingt naturel : voir Ludovic. Il confirme l'adresse et l'histoire de l'utilitaire loué au nom du magasin.

Fausse piste, le Chat qui rit : petite salle rétro (affiches façon Toulouse-Lautrec) dans un immeuble rénové, fermée le jour : il faut entrer par effraction. Pièces sombres, bruits incongrus en coulisses ou sous la scène… un simple chat et un vieux gardien endormi. À faire durer selon le goût de la table.`,
    [inScene(ludovic)], false,
    [choice('coupure', 'Quelle piste les PJ tirent-ils de la coupure de journal ?', [
      ['Le Chat qui rit', 'Fausse piste : ambiance inquiétante, mais rien qu\'un chat et un gardien endormi. Temps perdu.'],
      ['Le Roi de la Frite', 'Bonne piste, mais cinq villes possibles : il faut attendre de nouvelles agressions pour trancher.'],
    ])]),
  scene('nord', '3. Le Chat frappe dans le Nord', 'Paris puis route du Nord',
    `En coulisses : Igor prend la route au petit matin et « cueille » une langue près d'Arras, une près de Douai, puis une en rab à Wormhout (près de Dunkerque). À Dunkerque, il se fait embaucher au Roi de la Frite (personne d'autre ne veut de ces conditions de travail), loue une chambre minable dans un quartier pourri, y installe mini-four, bouilloire et dictionnaires, termine la traduction et lance son sort dans un entrepôt désaffecté du port : Charles-Otto apparaît et lui obéit.

Les PJ apprennent (radio, télé, ou Hercule en dernier recours) les agressions d'Arras, de Douai, puis de Wormhout. Laisser les joueurs chercher sur une carte : le recoupement avec l'annonce désigne Dunkerque, d'autant que Wormhout est la plus récente.
Variante sadique : retarder la nouvelle de Wormhout pour que les PJ hésitent (et filent peut-être à Lille).`,
    [], false,
    [choice('ville', 'Où les PJ vont-ils chercher Igor ?', [
      ['Dunkerque', 'Bonne pioche : ils arrivent en plein carnaval.'],
      ['Lille (ou autre)', 'Le Roi de la Frite local présente ses nouvelles recrues : aucune n\'est Igor. Retour vers Dunkerque, avec du retard.'],
    ])]),
  scene('dunkerque', '4. Dunkerque, son Roi de la Frite, son carnaval', 'Dunkerque : le Roi de la Frite (rue Poincaré), quartier de la chambre d\'Igor',
    `Carnaval annuel : foule déguisée, tambour-major, « bande » de fêtards bras dessus bras dessous avec les costauds devant, chahuts dont le rigodon final, et le maire qui lance des homards du balcon de la mairie. Tout cela doit parasiter la poursuite à venir.
Roi de la Frite : voir le patron. Il oriente vers des logements ; les suivre prend du temps, mais l'utilitaire Loutonoto garé près de chez Igor peut le trahir.
Quoi qu'il arrive, Igor, paranoïaque, remarque que des inconnus le cherchent (à la friterie ou près de chez lui). Son sort étant déjà lancé, il envoie Charles-Otto les neutraliser et prépare son départ pendant ce temps, en comptant récupérer son démon au passage.`,
    [inScene(patron)]),
  scene('poursuite', '5. Course-poursuite dans le carnaval', 'Rues de Dunkerque en plein carnaval',
    `Charles-Otto se fait remarquer exprès (filature trop voyante à distance prudente), puis s'enfuit en espérant être suivi ; si les PJ ne mordent pas, il revient les appâter. Son but : les attirer dans l'entrepôt désaffecté du port où Igor a lancé son sort.
Rythme trépidant : il traverse le cortège, chipe un masque, se fait perdre puis retrouver ; les PJ doivent se croire semés puis malins de l'avoir rattrapé. Gags de carnaval : homard reçu en pleine figure, horde de fêtards qui veut le récupérer, bande compacte impossible à traverser.`,
    [inScene(charlesOtto)]),
  scene('entrepot', '6. Bagarre à l\'entrepôt', 'Entrepôt désaffecté sur le port de Dunkerque',
    `Charles-Otto arrive avec de l'avance. Si les PJ ne savent pas dans quel hangar il est entré, il les attire ou le MJ leur en fait fouiller quelques-uns. Changement de rythme : silence, suspense, PJ sur leurs gardes.
Il joue la ruse et cherche à isoler ou écarter temporairement quelques PJ pour ne pas les affronter tous à la fois. Ricanements de dément, sourire à la Joker.

LA TRICHE : laisser le combat s'engager. Au tour de Charles-Otto, de préférence quand il est en difficulté, lancer les dés et feindre la réaction d'un 666 naturel (sans en faire trop). Son Gag absurde réussit au-delà de tout : les PJ basculent dans l'illusion (scène 7). Dans la réalité, cela ne dure que quelques instants ; pour eux, des heures voire des jours.`,
    [inScene(charlesOtto)], true),
  scene('illusion', '7. L\'illusion : Virtuavie, an 2560', 'Salle de réalité virtuelle de Virtuavie, puis une ville française vers 2560, 21 h',
    `Écran de neige façon télé en panne, puis la voix de Joseph : la séance est finie, il faut libérer la place. Les PJ se réveillent sur des couchettes en cuir usé, casques sur la tête et bracelets aux poignets reliés à un globe crépitant suspendu au plafond. Ils se reconnaissent, mais sont différents. Joseph les envoie à la salle de relaxation (six ou sept chaises, trois vieux magazines) où les attendent leurs affaires, repérées grâce au numéro tamponné sur leur main.
Ce qu'ils doivent comprendre : toutes leurs aventures n'étaient qu'un jeu de rôle virtuel, payé 167 nouveaux euros chacun. Affiches et magazines datés autour de 2560, technologie très avancée. Le but : semer le doute ne serait-ce qu'une minute sur la « vraie » réalité.

Nouvelles identités proposées (à adapter, à contre-emploi des PJ : le costaud devient gringalet, le macho devient femme, le filou devient ennemi public ou ténor du barreau) ; ils gardent un détail reconnaissable (voix, cicatrice, tic…). Point commun : une équipe soudée de cyber-jeu de rôles dans un univers d'anges, démons, psis et sorciers.
• Spart Maxis (Alli Maxence) : se rêve en preux chevalier moderne, honnête et serviable, look d'aviateur des années 1950, expressions désuètes ; contrôleur de « tube » (métro).
• Prillia Bonzo : brusque, langage fleuri ; étudiante en « samalologie » et serveuse dans un boui-boui du quartier mal famé.
• Arthur Millefeuille : sympathique, cernes énormes, apprenti plombier surmené, bricoleur de génie ; amoureux de Desmoneda.
• Desmoneda Papakicri : très mince, fort accent grec, vendeuse, sensible, s'évanouit pour un rien après une formule tirée de ses romans à l'eau de rose.
• Esmer Labille : lunettes, cheveux en pétard, rêveur ; brillant étudiant boursier en synthèse d'organes, gringalet.

Le monde : proche du nôtre, technologie avancée (médecine, aéronautique) mais société en piteux état ; Chine dominante, États-Unis affaiblis ; aucune créature surnaturelle. Dans leurs poches : carte d'identification unique, portable minuscule (comptes en banque à découvert ou presque), carte-clé du logement, grignotages chimiques aux noms bizarres, carte de voiture pour au moins l'un d'eux, gadgets inutiles. Dehors : nuit, rues désertes, architecture dépouillée mais colorée mêlée de bâtiments anciens, mini-caméras sur les lampadaires, magasins fermés par des rideaux hermétiques, quelques restaurants ouverts.

Sorties possibles (les idées des joueurs priment) : voir le choix ci-dessous. Se répéter « c'est une illusion » ne suffit pas. Si la table décroche, dissiper l'illusion tout de suite : elle doit cesser un jour de toute façon.`,
    [inScene(joseph), inScene(simimz), inScene(feirrera)], false,
    [choice('sortie', 'Comment les PJ sortent-ils de l\'illusion ?', [
      ['Une nouvelle séance chez Virtuavie', 'Ouvert jour et nuit ; il faut réunir une petite somme : petit boulot, prêt, ou plan louche qui risque de finir derrière les barreaux (et de les retarder).'],
      ['Le marché de Simimz', 'Pilules, portail sous la boutique… contre un service ou un paiement.'],
      ['La machine de Simon Feirrera', 'Engin bricolé et dangereux ; au MJ d\'en faire un vrai passage ou une source d\'angoisse.'],
      ['Le MJ dissipe l\'illusion', 'Si la scène s\'essouffle : retour immédiat à l\'entrepôt.'],
    ])]),
  scene('baston', '8. Après l\'illusion, baston !', 'Entrepôt du port puis alentours',
    `Retour brutal : quelques secondes seulement ont passé. Charles-Otto, en difficulté avant son coup d'éclat, n'a aucune envie de mourir pour Igor et file. Cette fois, pas de triche : les PJ le rattrapent ou non, et peuvent se défouler.`,
    [inScene(charlesOtto)], true,
    [choice('demon', 'Charles-Otto est-il mis hors d\'état de nuire ?', [
      ['Oui', 'Très bon point pour la mission ; Igor attend en vain son démon.'],
      ['Il s\'échappe', 'Il retourne auprès d\'Igor ou disparaît dans la nature, libre ou toujours lié : à reprendre plus tard.'],
    ])]),
  scene('igor', '9. Cueillir le Chat', 'Chambre d\'Igor à Dunkerque, ou son utilitaire coincé dans les embouteillages du carnaval',
    `Igor boucle fiévreusement ses affaires en attendant le retour victorieux de son démon (le livre écrit « Jean-Louis » à cet endroit : c'est bien Igor). On le cueille chez lui ou un peu plus loin, utilitaire bloqué par le carnaval. Il a le grimoire avec lui. Il ne se bat pas physiquement et tente sa sorcellerie, sans grand effet : il est bien meilleur en sorts mijotés qu'instantanés.
Preuves pour la police : une langue en rab, les tampons de patte de chat, la facture et l'utilitaire Loutonoto. S'il parle de sorcellerie ou de la DTC, personne ne le croira.`,
    [inScene(igor)], true,
    [choice('sort', 'Que font les PJ d\'Igor ?', [
      ['Ils le livrent à la police', 'Fin du Chat : les PJ suivront son procès à la radio. Le Roi de la Frite doit repasser une annonce.'],
      ['Ils le ramènent à Hercule', 'Conforme au contrat : Hercule décide de son sort.'],
      ['Autre (vengeance, marché…)', 'À juger selon le camp et la morale des PJ.'],
    ]),
    choice('grimoire', 'Qu\'advient-il du grimoire ?', [
      ['Rendu à Jean-Louis', 'Client satisfait, contrat rempli ; Jean-Louis devient un contact reconnaissant.'],
      ['Gardé par la DTC (ou les PJ)', 'Un sort d\'invocation de démon de Kobal entre de nouvelles mains.'],
    ])]),
];

const scenario = {
  id: 'pa4-langues-et-secateur',
  nom: 'Petites Apocalypses – Langues et sécateur',
  resume: 'Scénario pour agents de la troisième Force employés par la DTC d\'Hercule (adaptable en INS/MV). Igor, sorcier flemmard et malhonnête, a volé le grimoire de son ami Jean-Louis et coupe des langues d\'enfants au sécateur pour invoquer un démon de Kobal. De Paris à Dunkerque en plein carnaval, les PJ le traquent jusqu\'à son démon, Charles-Otto, dont le Gag absurde (un faux 666 du MJ) les plonge dans une illusion où ils se croient des joueurs de 2560 sortant d\'une séance de réalité virtuelle. Une fois sortis, baston, puis arrestation du « Chat ».',
  notes: `Source : ${REF} ; adaptations p. 116.

Principe : le MJ triche une fois, en feignant d'avoir obtenu un 666 naturel lors de l'action de Charles-Otto. Cela justifie un Gag absurde d'une ampleur inouïe et signale aux joueurs attentifs qu'il se passe quelque chose. L'illusion dure quelques minutes dans la réalité mais des jours pour les PJ ; elle doit les faire douter de la réalité et leur faire jouer des rôles à contre-emploi.

Contexte : Jean-Louis invite Igor à dîner et lui montre un grimoire rare (en araméen) qu'il vient de chiner. Igor y repère un sort d'invocation et de lien d'un démon de Kobal, minimise l'ouvrage puis l'empoche. Une semaine plus tard, la lecture des faits divers fait comprendre à Jean-Louis ce qui s'est passé ; Igor est injoignable. Il va à la DTC.
Composantes du sort : cinq langues d'enfants de moins de 14 ans, une part de flan, une salade, de la cardamome, de la glu.
Chronologie d'Igor : quatre agressions à Paris du 10 au 14 mars (la dernière ratée), départ pour Dunkerque avec un utilitaire Loutonoto loué frauduleusement, agressions près d'Arras, de Douai et à Wormhout, embauche au Roi de la Frite, invocation dans un entrepôt du port.

Adaptations (ch. 14, p. 116) :
• MV : aucun problème. Un archange choqué par l'affaire (Christophe ou Jean-Luc, par exemple) envoie l'équipe. Il faut amener les PJ jusqu'à Jean-Louis, qui détient les infos de départ : ils le croisent plusieurs fois sur les lieux des agressions (il cherche à confirmer ou à démentir ses soupçons), il les aborde de lui-même en les voyant enquêter, ou ils entendent parler de lui quand il va témoigner à la police.
• INS : le plus dur est de motiver des démons. Idée du livre : Kobal ou l'un de ses sbires sait qu'il existe un rituel pour les invoquer à base de langues d'enfants et veut arrêter le sorcier avant qu'il ne frappe. Ensuite, on procède comme pour les anges.
• Dans les deux cas, ajuster la puissance de Charles-Otto à celle des PJ.

Récompenses : le livre n'en donne pas. Suggestion : contrat payé par la DTC (ou PA accordés par le supérieur en INS/MV) selon que le démon, Igor et le grimoire sont récupérés.
Suites : il est peu probable que les PJ aient déjà croisé ces deux sorciers. Ils pourront suivre le procès du Chat aux infos ; Jean-Louis peut devenir un contact (peu utile mais enthousiaste), par exemple face à des sorciers comme Médée.

Fiches : caractéristiques des sorciers et du démon reprises du livre ; armes non précisées estimées et signalées dans les notes. Les cinq identités de l'illusion sont décrites dans la scène 7 (pas de fiches).`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [igor, jeanLouis, charlesOtto, hercule, ludovic, patron, joseph, simimz, feirrera].map(asType);
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));
writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types,', scenes.reduce((a, s) => a + s.choix.length, 0), 'choix');
