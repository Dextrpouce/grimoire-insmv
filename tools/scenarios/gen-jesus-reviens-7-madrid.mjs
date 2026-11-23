// Génère le fichier d'import « insmv-scenario » pour l'épisode de Madrid de la campagne « Jésus Reviens ! »
// (chapitre huit « Le sabre et le goupillon », p. 100-114) et l'épilogue (chapitre neuf « Heaven Can Wait », le procès, p. 115-119)
// usage : node gen-jesus-reviens-7-madrid.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Jésus Reviens !, chapitre huit « Le sabre et le goupillon », p. 100-114';
const REF9 = 'Jésus Reviens !, chapitre neuf « Heaven Can Wait » (épilogue), p. 115-119';
const L = (s) => R.parseLvl(String(s));
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const ARMES = new Map(R.ARMES.flatMap(([g, l]) => l.map((x) => [x[0], { prec: x[1], puis: x[2], melee: R.MELEE_GROUPS.includes(g) }])));
const arme = (n, table, lvl) => { const w = ARMES.get(table); if (!w) throw new Error('arme inconnue : ' + table); return { n, att: L(lvl), ...w }; };
const poing = (lvl) => arme('Coup de poing', 'Coup de poing', lvl);
const livre = (n, lvl, prec, puis, melee) => ({ n, att: L(lvl), prec, puis, melee });
const pw = (s) => s.split(/,\s*/).map((x) => { const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m[1], r: L(m[2]) }; });
const P = 'jr7-'; let n = 0; const id = (k) => P + k;
const npc = (key, o, ref = REF) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [poing(1)], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${ref}.`].filter(Boolean).join('\n'),
});
const S = (s) => s.split('/').map(Number);
const DEF1 = 'Défense non donnée : niveau 1 par défaut.';
const MINI = 'Pas de caractéristiques dans le livre : fiche minimale (valeurs par défaut), à ne pas utiliser telle quelle en combat.';
const ARCH = 'Archange : pas de fiche dans le livre.';

// ======================= PNJ de Madrid (fiches du livre) =======================
const francesco = npc('francesco', {
  nom: 'Francesco (Francesco Monti)', source: 'Ange de Dominique, grade 3, directeur du centre de l\'Opus Dei de la Plaza de Canalejas', type: 'ange',
  car: car('4 5 6+ 7+ 7 7'), def: L(6), pp: 59, pfFix: 11, seuilsFix: S('7/14/21/28'),
  armes: [poing(1)],
  pouvoirs: pw('Jugement 8, Absorption d\'amour 2, Aura de pacification 3, Champ de force 7, Télépathie 3, Paralysie 3, Peur 4, Régénération 3, Voix impérieuse 7, Vol 3, Trait d\'énergie 6'),
  talents: 'Baratin 6, Discussion 9, Enquête 8, Fouille 6, Aisance sociale 8, Intimidation 8, Culture générale 2 (Espagne moderne 4), Savoir occulte 7 (opérations JR et Torquemada 9+), Torture 4, Hobby (regarder ses sectateurs se flageller) 5, Latin, Français, Anglais',
  notes: `68 ans d'apparence, 1,69 m, brun aux yeux marron. Vrai cerveau de l'opération JR et chef de fait de l'Opus Dei espagnol (officiellement simple prêtre numéraire, directeur d'un centre de formation). Incarné depuis moins d'un siècle, droit, ordonné, glacial et toujours égal d'humeur ; sa seule passion est le travail bien fait. Il méprise en secret Dominique (qu'il juge usé et corrompu, notamment par l'affaire du Bureau) et espère le remplacer un jour, mais lui obéit au doigt et à l'œil, en devinant ses souhaits à demi-mot. Il agit masqué derrière des complices qu'il niera connaître.
Projet personnel : l'opération Torquemada, une reconquête lente et en profondeur de l'Espagne (lois, tribunaux, école, « milices de la vertu » à la saoudienne) plutôt qu'un coup d'éclat. Il se méfie de Semper Fidelis et de Laurent.
Assurance : il a monté sur ordre de Dominique un dossier contre Laurent, et en secret un dossier contre Dominique lui-même (voir scène du casse). S'il tombe, Dominique tombe avec lui. Immortel en pratique : s'il parle, Dominique le retrouvera.
Pas d'arme dans sa fiche : il combat avec ses pouvoirs (Trait d'énergie, Paralysie, Peur, Voix impérieuse, Champ de force). Il se déplace toujours sous forte escorte.`,
});
const nether = npc('nether', {
  nom: 'Nether (Juan Rocamora)', source: 'Ange de Joseph, grade 3, adjoint administratif et exécuteur de Francesco', type: 'ange',
  car: car('4 5 4 6 4 5'), def: L(4), pp: 53, pfFix: 10, seuilsFix: S('7/14/21/28'),
  armes: [livre('Scalpel béni ancien', 4, 8, 4, true), poing(1)],
  pouvoirs: pw('Torture 7, Trait d\'énergie 2, Charme 1, Peur 6, Rebond 4, Paralysie 2, Détection du danger 3, Absorption de violence 3, Volonté supra-normale 2'),
  talents: 'Torture 5, Torture psychologique 7, Savoir occulte 5 (Opus Dei 7), Baratin 4, Discussion 3, Combat 2 (armes improvisées 4), Culture générale 1+ (la torture du Moyen Âge à nos jours 6), Discrétion 3, Enquête 4, Fouille 6, Aisance sociale 4, Intimidation 8, Savoir d\'espion 2 (espionnage domestique 4), Métier (assistant du chef) 5, Se faire détester 4',
  notes: `1,58 m, 52 kg, brun aux yeux noirs. Le bras droit des basses œuvres : bourreau personnel de Francesco, sadique, calme et consciencieux. Détaché par Joseph, qui ne connaît le projet que de très loin (Nether lui est surtout prêté pour la durée de Torquemada).
Il sait presque tout de l'opération Torquemada mais il est quasiment impossible de le faire parler : fanatique, il aime la souffrance et se sait protégé par son archange. Il préférera mourir.
Scalpel : précision +8, puissance +4 (livre) ; niveau d'attaque d'après Combat (armes improvisées 4).`,
});
const diego = npc('diego', {
  nom: 'Diego Alonso', source: 'Serviteur de Dieu, bras droit de Francesco au centre', type: 'serviteur',
  car: car('2 2 1+ 3 2 2'), pp: 5, pfFix: 5, seuilsFix: S('3/6/9/12'),
  pouvoirs: pw('Charme 1'),
  talents: 'Baratin 3, Discussion 3, Savoir occulte 2 (Opus Dei 4), Savoir d\'espion 1, Torture 2, Fouille 3, Métier (directeur de centre de secte) 3+, Aisance sociale 2+',
  notes: `48 ans, 1,86 m, 62 kg. Intégriste fanatique, persuadé que le fondateur de l'Opus Dei annonçait le grand retour de la foi. Intraitable avec les membres, adepte des châtiments corporels qu'il inflige sans état d'âme, il gère pour Francesco la vie spirituelle du centre et tient à en être digne.
Il connaît en partie JR et Torquemada, a les codes d'accès de la partie privée et de l'appartement de Francesco, mais pas du coffre. Sous la torture, il parle vite (il déteste la douleur)… mais son cœur lâche peu après, ce qui en fait un martyr très présentable.
${DEF1}`,
});
const emron = npc('emron', {
  nom: 'Emron (Juan Albisu)', source: 'Ange de Laurent, grade 2, chef des légionnaires Azul détachés au centre', type: 'ange',
  car: car('6+ 4 2 2+ 4 5'), def: L(6), prot: 8, pp: 26, pfFix: 9, seuilsFix: S('9/19/28/38'),
  armes: [livre('Rapière de conquistador bénie majeure', 7, 5, 5, true), poing(4)],
  pouvoirs: pw('Arts martiaux 2, Aura de courage 3, Augmentation de force 2, Volonté supra-normale 2, Trait d\'énergie 3, Vitesse 2'),
  talents: 'Juste lame 3 (pouvoir absent des règles du Grimoire), Savoir militaire 1 (tactique 3), Combat 2+ (épées 7), Corps à corps 4, Tir 2 (armes de poing 5), Acrobatie 3, Athlétisme 5, Métier (soldat) 4, Savoir occulte 1 (Opus Dei et opération Torquemada 2), Culture générale 3 (histoire des conquistadors 5), Anglais',
  notes: `39 ans d'apparence, 1,72 m, 86 kg, brun aux yeux noirs. Officier important de la division Azul : chien de guerre fanatique, violent, qui adore écraser et torturer ses ennemis, exige le meilleur de ses hommes mais rien qu'il ne ferait lui-même ; ils lui vouent obéissance et respect. Ses vingt soldats de Dieu gardent le centre de Francesco.
Incarné depuis quelques décennies seulement, il regrette de n'avoir pas connu l'Espagne de Franco et les croisades. Il approuve totalement JR, connaît personnellement Guernica et a rencontré Semper Fidelis. Il ne déteste pas Sharah mais ne comprend pas qu'il soit devenu démocrate.
C'est lui que Francesco envoie dès qu'il se doute de quelque chose (coopérateurs inquiétés, infiltration suspecte).
Rapière : précision +5, puissance +5 ; plastron et casque de conquistador bénis : protection 8 (livre). Il ne porte pas d'arme à feu dans sa fiche (Tir armes de poing 5 s'il en ramasse une).`,
});
const exan = npc('exan', {
  nom: 'Exan (Almudena Gomez)', source: 'Ange de Laurent, grade 2, général de la division Azul', type: 'ange',
  car: car('4 5 4+ 2+ 4 4'), def: L(6), pp: 23, pfFix: 6, seuilsFix: S('7/14/21/28'),
  armes: [arme('Épée', 'Épée longue', 4), arme('Carabine', 'Carabine', '6+'), poing(4)],
  pouvoirs: pw('Aura de courage 2, Armure corporelle 2, Détection du danger 5, Lueur insoutenable 2'),
  talents: 'Juste lame 3 (pouvoir absent des règles du Grimoire), Combat 2 (épées 4), Corps à corps 4, Discrétion 5+, Tir 3 (armes d\'épaule 6+), Athlétisme 5, Culture générale 1+ (franquisme en Espagne 4), Savoir occulte 1+ (le Grand Jeu en Espagne et opération Torquemada 3), Intimidation 6, Savoir militaire 2 (tactique 6), Métier (chef de camp militaire) 5',
  notes: `38 ans d'apparence, 1,72 m, 73 kg. Général de la division Azul depuis une cinquantaine d'années ; il a connu l'Espagne de l'après-guerre et déplore sa chute dans la démocratie. Fier de son camp, satisfait de cette planque honorifique, il attend la fin du monde sans s'en faire. Ce qui l'agace : les consignes venues directement de Dominique qui donnent à Francesco tout pouvoir sur ses hommes. Il obéit, en bon soldat, mais n'aime pas ça.
Armure corporelle « (or) » dans le livre. Armes non données : épée et carabine estimées d'après ses talents.`,
});
const azul = npc('legionnaire-azul', {
  nom: 'Légionnaire de la division Azul', source: 'Soldat de Dieu (Opus Dei / Laurent)', type: 'soldat',
  car: car('3 2+ 3 2 1 2+'), def: L('2+'), pp: 5, pfFix: 5, seuilsFix: S('4/8/12/16'),
  armes: [arme('Épée', 'Épée longue', 3), poing(2)],
  pouvoirs: pw('Augmentation de force 1, Armure corporelle 1'),
  talents: 'Combat 1+ (épées 3), Corps à corps 2, Discrétion 2, Hobby (chants fascistes espagnols) 2+, Savoir militaire 1 (tactique 2), Espagnol, Français, Latin',
  notes: `Les mêmes que dans le scénario de Paris. Vingt d'entre eux gardent le centre de la Plaza de Canalejas, déguisés en numéraires (sans tromper personne : ils ont l'air de tout sauf de zombies endoctrinés) ; trois en permanence à chaque porte blindée de la partie privée. Une centaine d'autres s'entraînent au camp de la division, en Andalousie.
Le livre ne précise pas leur arme : épée longue estimée (talent épées 3).`,
});
const garde = npc('garde-corps', {
  nom: 'Garde du corps d\'une personnalité', source: 'Humain, professionnel', type: 'humain',
  car: car('3 3 3 2 1+ 2'), def: L(3), pfFix: 5, seuilsFix: S('4/8/12/16'),
  armes: [livre('Pistolet', 3, -2, 4, false), poing(3)],
  talents: 'Corps à corps 3, Tir 1+ (armes de poing 3), Intimidation 2+, Discussion 2, Aisance sociale 2, Métier (garde du corps) 2+, Fouille 2, Culture générale 1 (Espagne moderne 2), Anglais',
  notes: 'Professionnels mais pas fanatiques : ils ne risqueront pas leur vie pour rien. Discrets et sobres, leur attitude dépend beaucoup de celle de la personne qu\'ils protègent. Nombre et compétence variables selon la personnalité.\nPistolet : précision −2, puissance +4, pénétration importante, portée moyenne (livre).',
});
const policier = npc('policier', {
  nom: 'Policier espagnol', source: 'Humain, fonctionnaire', type: 'humain',
  car: car('2+ 2 3 1+ 2 2'), def: L(2), pfFix: 4, seuilsFix: S('3/7/10/14'),
  armes: [livre('Pistolet', 2, -2, 4, false), poing(2)],
  talents: 'Tir 1 (armes de poing 2), Enquête 1, Métier (policier) 2, Corps à corps 2, Fouille 2+, Culture générale 1 (Espagne moderne 2), Hobby (bavures) 2, Intimidation 2',
  notes: 'Simples fonctionnaires qui font leur travail comme ils peuvent, avec les moyens du bord. Souvent à droite et racistes, sans le montrer ouvertement. Une caserne de police jouxte le centre de l\'Opus Dei.\nPistolet : précision −2, puissance +4 (livre).',
});

// Personnalités (coopérateurs et visiteurs influents)
const ponz = npc('ponz', {
  nom: 'Jésus Ponz', source: 'Haut fonctionnaire du ministère de l\'Éducation, coopérateur', type: 'humain',
  car: car('2 2 3 2+ 2 2'), pfFix: 4, seuilsFix: S('3/6/9/12'),
  talents: 'Métier (haut fonctionnaire) 3, Savoir occulte 0+ (opération Torquemada 1), Culture générale 1+ (politique espagnole de 1950 à nos jours 3), Technique 1 (pédagogie 2+), Discussion 3, Aisance sociale 2, Français, Anglais',
  notes: `58 ans. Autodidacte devenu responsable d'une bonne partie de l'Éducation nationale ; ancien militant républicain (parents tués pendant la guerre civile), il a officiellement retourné sa veste sans devenir franquiste. Il fréquente l'Opus Dei pour comprendre ce qu'elle trame. Francesco le croit, à tort, artisan du retour du catéchisme à l'école (Ponz s'y est opposé en douce) et lui accorde une confiance exceptionnelle.
Effaré par les projets éducatifs de la secte (créationnisme, réécriture de la guerre civile) : s'il est sûr que cela restera discret, il raconte ce qu'il sait et peut fournir des dossiers de propositions de l'Opus Dei sur l'école. Allié potentiel.
${DEF1}`,
});
const cruz = npc('cruz', {
  nom: 'Basilio Cruz', source: 'Haut fonctionnaire du ministère de la Justice, coopérateur', type: 'humain',
  car: car('1+ 2 2+ 2 2 1+'), pfFix: 3, seuilsFix: S('2/5/7/10'),
  talents: 'Métier (haut fonctionnaire) 2, Culture générale 1 (droit espagnol, Espagne franquiste et post-franquiste 2+), Savoir occulte 1 (opération Torquemada et Opus Dei 2), Discussion 2, Aisance sociale 2+, Baratin 2',
  notes: `57 ans. Haut fonctionnaire « apolitique » qui a traversé tous les régimes, franquiste dans l'âme. Flatté d'être consulté comme expert juridique par l'Opus Dei, il prépare avec Francesco l'évolution de la justice vers un régime fort, moralisé et catholique. Admirateur de Francesco ; il a renoncé à devenir surnuméraire à cause des mortifications.
Il ne livrera jamais un secret d'État de son plein gré, mais il ne supporte pas du tout la douleur.
${DEF1}`,
});
const bravo = npc('bravo', {
  nom: 'Pablo Bravo', source: 'Haut fonctionnaire de la police, coopérateur', type: 'humain',
  car: car('2 2+ 3 2+ 2+ 2'), pfFix: 4, seuilsFix: S('3/6/9/12'),
  armes: [livre('Revolver de fonction', '2+', -2, 3, false), poing(1)],
  talents: 'Tir 1+ (armes de poing 2+), Torture 1+, Métier (officier de police) 2+, Métier (haut fonctionnaire) 2, Culture générale 1 (ETA militaire et Espagne moderne 2), Enquête 2+, Fouille 2, Discrétion 2+, Baratin 2, Discussion 2, Aisance sociale 1, Hobby (micro-informatique) 2, Hobby (rouler des joints) 2, Savoir criminel 1+ (ETA militaire 2+), Savoir occulte 0+ (opération Torquemada 1+), Anglais, Français',
  notes: `33 ans. Jeune cadre moderne de la police, passé par une cellule anti-ETA où il a appris des méthodes très musclées ; il rêve d'une vraie révolution civique dans une Espagne européenne, pas d'un retour au franquisme. Joue un jeu trouble : il sait que Francesco le dénoncerait s'il connaissait ses vrais buts. Francesco ne lui a confié que des dossiers peu compromettants.
C'est l'un des rares coopérateurs qu'on peut convaincre de la nocivité de l'Opus Dei. Retourné, il réclame à Francesco des propositions « plus fermes » : quelques jours plus tard, il reçoit une version allégée mais accablante du vrai projet. Allié potentiel.
Revolver : précision −2, puissance +3, pénétration importante, portée moyenne (livre). ${DEF1}`,
});
const lamanite = npc('lamanite', {
  nom: 'Lamanite (Angel Jimenez)', source: 'Démon de Nybbas, grade 2, présentateur de télé-réalité', type: 'demon',
  car: car('4 4 5 4+ 6 4'), def: L(3), pp: 23, pfFix: 8, seuilsFix: S('6/12/18/24'),
  pouvoirs: pw('Message subliminal 3, Charme 3, Non-détection 2, Champ magnétique 1, Jet d\'acide 2, Téléportation 1, Malédiction 1'),
  talents: 'Métier (présentateur télé) 3, Culture générale 3 (le monde de la télé 4), Baratin 6, Discussion 5, Meubler les blancs à la télé 6, Savoir occulte 1+ (le Grand Jeu en Espagne 3), Abrutir le public avec des émissions à la con 4, Hobby (séries télé débiles) 5, Intimidation 3, Aisance sociale 5, Séduction 5, Prendre des lignes de coke 4, Anglais, Portugais, Français ; pouvoir « Aura de confession 2 » (absent des règles du Grimoire ; peut-être une coquille pour Aura de confusion)',
  notes: `37 ans d'apparence, 1,71 m, blond aux yeux marron. Star nationale de la télé-réalité, venu d'au-delà des Pyrénées ; il humilie candidats et spectateurs pour abrutir le peuple. Francesco, qu'il soupçonne fortement d'être un ange, l'a engagé comme « consultant en nouveaux médias » (projet d'émission pieuse façon téléréalité au monastère) : il s'en délecte. Il est ravi d'aider des anges à détruire ce que d'autres anges construisent, mais, par subtilité, il ne lâchera pas les dossiers trop facilement pour rester crédible.
Malédiction : « laideur » dans le livre.`,
});
const peres = npc('peres', {
  nom: 'Jordi Peres', source: 'Banquier franquiste, coopérateur', type: 'humain',
  car: car('1 1 1+ 2+ 3 2'), pfFix: 3, seuilsFix: S('2/4/6/8'),
  talents: 'Métier (banquier) 2, Savoir criminel 1 (blanchiment d\'argent sale 3), Aisance sociale 3, Culture générale 1 (bourgeoisie et affaires madrilènes 2+), Hobby (vie du général Franco) 2+, Savoir occulte 1 (culte catholique et projet Torquemada 2), Hobby (tout noter sur des petits carnets) 1+, Faire chier ses employés de maison 2+, Français, Latin',
  notes: `88 ans. Fondateur d'une banque privée rachetée par l'État, franquiste resté notable sous la démocratie, toujours incontournable dans la finance. Il sert d'intermédiaire financier à Francesco (blanchiment) et relaie des messages de chantage. Il note tout depuis des décennies (noms, dates, sommes) dans de petits carnets rangés dans le coffre de sa villa madrilène, gardée par la police.
Rongé par sa conscience à l'approche de la mort : des PJ qui jouent sur son salut peuvent obtenir des aveux complets. La torture, en revanche, ne le fera pas craquer.
${DEF1}`,
});
const albares = npc('albares', {
  nom: 'Roberto Albares', source: 'Conseiller du Premier ministre, coopérateur', type: 'humain',
  car: car('2 2+ 2 3 2+ 1+'), pfFix: 5, seuilsFix: S('3/6/9/12'),
  talents: 'Métier (conseiller politique) 2+, Aisance sociale 3, Baratin 3, Discussion 3, Culture générale 1+ (vie politique en Espagne 2+), Savoir occulte 1, Hobby (aller aux putes) 2+, Anglais',
  notes: `48 ans. Homme d'appareil compétent et très puissant, que le pouvoir grise moins que les prostituées. Discret, mais pas assez : Francesco l'a coincé grâce à ses frasques et le fait culpabiliser. Il refuse de devenir numéraire mais transmet les dossiers de l'Opus Dei, organise des réunions et diffuse les idées de Francesco.
Approché, il ne parle qu'à des gens importants. Sous la menace ou la torture, il donne tous ses dossiers. Menacer d'envoyer ses photos à la presse suffit (il ignore que les journaux people les ont déjà et ont refusé de les publier).
${DEF1}`,
});
const izco = npc('izco', {
  nom: 'Miguel Izco', source: 'Avocat vedette, coopérateur', type: 'humain',
  car: car('2 1+ 2+ 2 3 3'), pfFix: 4, seuilsFix: S('3/6/9/12'),
  talents: 'Métier (avocat) 1+, Aisance sociale 3, Culture générale 1+ (jet-set madrilène 2+), Savoir occulte 1+, Être bordélique 3, Hobby (lire les jugements de crimes sexuels) 2+, Engueuler ses collaborateurs 2, Discussion 2, Baratin 3+, Savoir criminel 1 (détournement fiscal 2+)',
  notes: `58 ans. Star médiatique du barreau, narcissique, paresseux, égoïste ; il vit des grandes affaires et des soirées en vue. Francesco en fait le porte-parole de ses projets judiciaires (c'est lui qui, à TRIC 40, transforme les agresseurs de musulmans en victimes « identitaires »). Seul coopérateur qui touche de l'argent au lieu d'en verser.
Secoué ou menacé, il parle, mais il ne sait rien de clair et ses dossiers Opus Dei sont éparpillés entre son cabinet et chez lui. Sa collaboratrice Maria Vallagua, brillante et dévouée, a recoupé les dossiers et les coups de fil et rangé les morceaux dans les archives : elle ne parlera que sous la contrainte ou pour sauver son patron.
${DEF1}`,
});
// Membres du centre (infiltration)
const calvo = npc('calvo', {
  nom: 'Victor Hugo Calvo', source: 'Numéraire, intendant officieux de la partie publique du centre', type: 'humain',
  car: car('3 2 2+ 1+ 1+ 1+'), pfFix: 4, seuilsFix: S('4/8/12/16'),
  talents: 'Savoir occulte 1 (Opus Dei 3), Torture 1, Hobby (torture psychologique) 2, Humilier les gens 2+, Culture générale 1 (vie moderne en Espagne 2), Dénoncer les gens 2, Savoir d\'espion 1 (espionnage domestique 2+)',
  notes: `38 ans. Brute bornée, sadomasochiste, montée par la délation jusqu'à l'intendance officieuse de la partie publique. Il adore se faire humilier par ses supérieurs et le rendre aux apostolats. Très apprécié pour son obéissance aveugle ; chargé des corvées et des châtiments corporels. Les PJ qui entrent dans la secte lui seront confiés en premier.
${DEF1}`,
});
const munne = npc('munne', {
  nom: 'Luis Munne', source: 'Numéraire, théoricien et enseignant de la doctrine', type: 'humain',
  car: car('1+ 2 1 2+ 2 2'), pfFix: 3, seuilsFix: S('2/5/7/10'),
  talents: 'Savoir occulte 1 (Opus Dei 3), Hobby (mortifications rituelles) 2, Métier (enseignant de la doctrine) 2, Latin',
  notes: `62 ans. Numéraire depuis ses 21 ans, sorte de mystique que les membres viennent consulter ; il ne pense plus que par citations du fondateur. Coupé du réel, d'humeur égale, populaire. Il fait les cours de doctrine aux nouveaux venus : lectures monocordes, sans fin.
${DEF1}`,
});
const gonzalez = npc('gonzalez', {
  nom: 'Rosa Gonzalez', source: 'Ancienne assistante numéraire, intendante des bonnes', type: 'humain',
  car: car('2 1+ 1+ 1+ 1 2'), pfFix: 3, seuilsFix: S('3/6/9/12'),
  talents: 'Métier (intendante) 2, Savoir occulte 0+ (Opus Dei 1+), Humilier ses subordonnés 2, Hobby (détourner la nourriture) 2, Savoir d\'espion 1 (espionnage domestique 2), Latin',
  notes: `58 ans. Chef de fait des assistantes numéraires (les bonnes du centre), intraitable et cassante. Élevée dans l'Opus Dei, elle ignore tout du monde réel. Seul péché : la nourriture, qu'elle détourne grâce à l'intendance des cuisines. Dangereuse pour ses subordonnées, servile devant l'autorité, elle dénonce tout ce qu'elle remarque.
${DEF1}`,
});
const corachan = npc('corachan', {
  nom: 'Maria Corachan', source: 'Assistante numéraire', type: 'humain',
  car: car('2 2 2+ 1+ 3+ 1'), pfFix: 3, seuilsFix: S('3/6/9/12'),
  talents: 'Métier (femme de ménage) 2, Savoir occulte 1, Hobby (se flageller) 2+, Kama sutra 2, Espagnol',
  notes: `21 ans. Jeune et belle, fille cachée d'un évêque allemand et de sa bonne, abusée enfant ; timide et traumatisée, elle a été placée à l'Opus Dei pour éviter le scandale. Bizarrement épanouie dans les mortifications, droguée par ses consœurs, elle ne se plaint jamais et reste presque muette. Point de contact fragile pour des PJ compatissants (à manier avec tact).
${DEF1}`,
});
const leon = npc('leon', {
  nom: 'Juan Ignacio Leon y Castillo', source: 'Aristocrate désargenté, coopérateur assidu du centre', type: 'humain',
  car: car('2 1+ 2 1+ 2 1+'), pfFix: 3, seuilsFix: S('3/6/9/12'),
  talents: 'Aisance sociale 2, Baratin 2, Savoir occulte 1 (Opus Dei 3), Savoir occulte 1 (opération Torquemada 2), Savoir d\'espion 1, Discrétion 2, Discussion 2, Culture générale 1 (noblesse espagnole 2)',
  notes: `34 ans. Jeune noble vivant d'une petite rente dans un studio encombré de reliques familiales ; il passe ses journées au centre, qu'il fréquente comme un salon. Lénifiant, plus malin qu'il n'en a l'air : il connaît très bien les rouages du centre et de l'Opus Dei. Convenablement interrogé, c'est une mine de renseignements.
${DEF1}`,
});

// ======================= PNJ de l'épilogue (sans caractéristiques) =======================
const regine = npc('regine', { nom: 'Régine', source: 'Ange, chargée de mission des PJ', type: 'ange',
  notes: `Elle rassemble les dernières informations, distribue les PA de fin de mission et conduit les PJ au procès, escortée par Michel. Fin de campagne : elle presse les PJ de rapporter les dossiers de Madrid.\n${MINI}` }, REF9);
const michel = npc('michel', { nom: 'Michel', source: 'Archange de la Guerre, témoin', type: 'ange',
  notes: `Escorte les PJ avec une dizaine de ses grades 3 jusqu'à Notre-Dame. Au procès, il veut faire condamner les trois « fascistes » sans être amalgamé avec eux ; Laurent l'y aide malgré lui en le traitant de traître.\n${ARCH}` }, REF9);
const ange = npc('ange', { nom: 'Ange', source: 'Archange des Convertis, accusatrice', type: 'ange',
  notes: `Avec Alain, elle accuse et veut surtout faire tomber Dominique et Laurent (Georges en prime). Elle compte sur la participation totale des PJ et sera très surprise s'ils ont gardé des preuves.\n${ARCH}` }, REF9);
const alain = npc('alain', { nom: 'Alain', source: 'Archange des Cultures, accusateur', type: 'ange',
  notes: `Accusateur aux côtés d'Ange. Furieux si les PJ ménagent un archange.\n${ARCH}` }, REF9);
const yves = npc('yves', { nom: 'Yves', source: 'Archange des Sources, juge du conseil de discipline', type: 'ange',
  notes: `Juge impartial (procédure à l'américaine : arbitre, pas acteur). Il veut que les traîtres soient découverts et les règles appliquées ; un bon scandale remettra les choses dans le rang. Il prononce la sentence choisie par le jury et récompense lui-même les PJ.\n${ARCH}` }, REF9);
const laurent = npc('laurent', { nom: 'Laurent', source: 'Archange de l\'Épée, accusé (index L)', type: 'ange',
  notes: `Partisan du retour de Georges, qu'il croit prêt à soutenir son putsch ; pour lui la chrétienté est en crise et la mort de Gabriel lui laisse le champ libre. Il reconnaîtra les accusations fondées en ajoutant que Georges et Dominique en étaient, et videra son sac sur Michel, « l'hérétique ».\n${ARCH}` }, REF9);
const dominique = npc('dominique', { nom: 'Dominique', source: 'Archange de la Justice, accusé (index D)', type: 'ange',
  notes: `Premier procès où l'archange de la Justice est accusé (d'où le huis clos). Il nie toute violation des règles du Grand Jeu tout en trouvant « intéressante » l'idée de Laurent et Georges ; il ménage la chèvre et le chou, suivra le vainqueur et joue l'offusqué. Il veut le pouvoir de Laurent et le retour de Georges sans le montrer.\n${ARCH}` }, REF9);
const georges = npc('georges', { nom: 'Georges', source: 'Ex-archange de la Purification, accusé (index G)', type: 'renegat_a',
  notes: `Il joue les faux-culs : il n'a rien fait (vrai), ne comprend rien (faux), et répète qu'il suivra la décision du Conseil, comme toujours. Pour lui, des discussions entre archanges autour d'un verre ne justifient pas un conseil de discipline (ce qui est vrai). Il savoure la situation sans s'ouvrir à personne.\n${ARCH}` }, REF9);

const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });

// ======================= Scènes =======================
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const TRIC_MADRID = `Modificateurs TRIC — Madrid :
• Par semaine où Francesco dirige impunément l'Opus Dei : +2
• Par coopérateur travaillant activement pour Francesco, par tranche de 15 jours : +1
• Par coopérateur neutralisé : −2
• Francesco neutralisé : −10
• Les PJ démontrent clairement la nocivité de l'Opus Dei : −5
• L'Opus Dei est neutralisé : −5
• Neutraliser la division Azul : −2
Seuils de TRIC qui touchent l'Espagne : 20 (subventions accrues à la fondation pour la mémoire de Franco), 25 (journées d'action pour la foi), 40 (lois antiterroristes durcies, agressions antimusulmanes minimisées, plaidoiries de Miguel Izco), 55 (catéchisme obligatoire, éducation civique supprimée, avortement non médical interdit, émission « Héros espagnols »), 70 (Code civil réformé : statut de la femme dégradé, divorce limité), 85 (conseillers moraux catholiques dans les tribunaux), 100 (le roi dissout l'Assemblée et nomme un Conducator).`;

const IA_MADRID = `Preuves de Madrid — LISTE RECONSTITUÉE (la page imprimée 13, qui donnait la liste officielle, manque au scan). Valeurs proposées par analogie avec les autres villes ; le MJ reste seul juge :
• Dossiers du bureau de Francesco (JR et ses ramifications dans le monde et la hiérarchie angélique) : 4 à 8 + 2L + 2D + 1G
• Dossier sur Laurent (chemise au sceau angélique, préparé à la demande de Dominique : mémos de Sharah, affaire mormone depuis 1820, évasion de Moroni sans enquête) : 5 à 8L, +1 à 2D si les PJ prouvent qu'il a été commandé par Dominique
• Dossier secret de la chapelle (toutes les communications entre Francesco et Dominique sur Torquemada et JR) : 8 à 12D — le « jackpot »
• Témoignage de Francesco : 3 à 6D + 0 à 3L (presque impossible à obtenir ; il ne parle que s'il croit que Dominique veut le lâcher)
• Témoignage de Nether : 0 à 3D (il préfère mourir)
• Témoignage de Diego Alonso : 1 à 2D
• Témoignage d'Emron : 0 à 2L · d'Exan sur les ordres de Dominique concernant la division : 0 à 2D
• Archives de la division Azul (mouvements de troupes via Dixie Securities, envoi de Guernica en France, ordre de mettre la division à la disposition de Francesco) : 1L + 1D
• Témoignages ou dossiers des personnalités (non cumulables pour une même personne) : Jésus Ponz (dossiers sur l'école) 1 · Pablo Bravo (le vrai projet, version allégée) 1 à 2 · carnets de Jordi Peres 1 à 2 · dossiers de Roberto Albares 1 · Miguel Izco / Maria Vallagua 0 à 1 · Basilio Cruz 0 à 1 · Juan Ignacio Leon y Castillo 0 à 1 · Lamanite 0 à 1
• Témoignages des membres du centre (numéraires, bonnes) : 0`;

const scenes = [
  scene('intro', '1. Direction Madrid : Francesco et l\'opération Torquemada', 'Madrid – fin de campagne (l\'épisode peut aussi se jouer plus tôt)',
    `Au fil de la campagne, les PJ ont entendu parler de Francesco, ou l'ont vu. Tôt ou tard, ils voudront s'en prendre à lui et viser Madrid, siège officieux de l'Opus Dei et repaire de l'autre moitié de JR. Régine les y pousse : elle attend des dossiers solides pour le procès.

Qui est Francesco : officiellement simple prêtre numéraire à la tête d'un centre de formation, il est en réalité l'un des dirigeants occultes de l'Opus Dei. Fin politique (il a fait canoniser le fondateur en un temps record), il est dans les petits papiers de Dominique, qui lui a confié en douce deux missions : mener JR (qu'il a plutôt organisé lui-même) et monter un dossier sur Laurent, au cas où. Pour lui, JR signifie le retour d'un ordre moral ; les Lumières, les droits de l'homme et la démocratie sont les plaies de l'Occident.

L'opération Torquemada : un travail de fond sur la durée, pas un coup d'éclat. S'appuyer sur l'alignement de l'Espagne sur les États-Unis et sur la peur de l'islam ; remettre la religion dans les lois, les tribunaux et l'école ; une morale catholique dans le droit ; à terme, des « milices de la vertu » à la saoudienne. Il n'y a ni prise d'otages ni révolution à empêcher : les PJ ont le temps, mais Régine les presse.

L'Opus Dei (contexte) : prélature personnelle qui ne répond qu'au pape. Membres : numéraires (célibataires, vivent dans les centres, reversent leur salaire, mortifications : cilice, discipline), associés, surnuméraires (mariés), assistantes numéraires (les bonnes), prêtres numéraires, et coopérateurs (bienfaiteurs extérieurs, pas forcément croyants). Contrôle total de la vie des membres, délation encouragée, coupure avec la famille, culte du fondateur : une secte. Surnommée la « mafia catholique » en Espagne. Dominique, archange de la Justice, l'a toujours couverte.

Trois options principales (on peut les combiner) :
• Un casse au siège, façon Mission impossible : faisable mais très difficile (scène 4).
• S'infiltrer dans la secte : plus subtil, plus long et plus pénible (scène 3).
• Enlever Francesco lors d'une sortie : envisageable, mais il est très escorté, immortel, et ne parlera pas facilement ; surtout, les dossiers resteront au coffre du centre (scène 5).
Les coopérateurs influents qui viennent au centre sont une quatrième piste, complémentaire (scène 2b).

Conseil du livre (encadré « Régis ») : si les joueurs tuent Francesco dès qu'ils le voient, soit tant pis, soit on le remplace par un autre méchant ; ne pas inventer de « boss de fin de niveau ».`,
    [inScene(regine), inScene(francesco)], false,
    [choice('approche', 'Quelle approche pour atteindre les dossiers de Francesco ?', [
      ['Le casse du centre', 'Longue préparation (plans, horaires, gardes) puis scène 4. Une caserne de police jouxte le bâtiment.'],
      ['L\'infiltration de la secte', 'Recrutement par un apostolat puis vie de numéraire (scène 3) ; peu d\'informations sur le complot, mais un accès pour un casse de l\'intérieur ou aux personnalités.'],
      ['L\'enlèvement de Francesco', 'Scène 5 : témoignage très difficile à obtenir, dossiers inaccessibles ; Dominique ne laissera pas faire.'],
      ['L\'enquête auprès des personnalités', 'Scène 2b : témoignages et dossiers partiels, utiles au procès ; à plus d\'un coopérateur inquiété, Francesco envoie Emron.'],
    ])]),

  scene('centre', '2. Le centre de la Plaza de Canalejas', 'Madrid – hôtel particulier de la fin du XIXe siècle, Plaza de Canalejas',
    `Francesco dirige un centre de formation de l'Opus Dei, petit et anodin d'apparence, en plein cœur de Madrid, dans un grand hôtel particulier bourgeois. Diego Alonso, son bras droit, en assure la marche courante. Une centaine de numéraires (zombifiés) et des étrangers y logent, servis par une vingtaine d'assistantes numéraires, sous la férule de sept prêtres numéraires ; quelque cinq cents associés, coopérateurs, surnuméraires et sympathisants passent chaque jour pour des cours, payés au prix fort.

Sécurité : vingt soldats de Dieu de la division Azul, commandés par Emron (ange de Laurent détaché auprès de Francesco), déguisés en numéraires mais reconnaissables entre mille. Le bâtiment est coupé en deux parties presque étanches :
• Partie publique (accessible aux membres et aux invités) : bureaux administratifs, réfectoire, cuisines, salles de cours, chapelle.
• Partie privée (dernier étage) : accessible par deux escaliers seulement, derrière des portes blindées camouflées ; à chaque porte, trois légionnaires en permanence (un devant, deux derrière, qui n'ouvrent qu'après vérification par caméra). On y trouve l'appartement de fonction de Francesco et sa chapelle privée, les quartiers des soldats et ceux des membres influents du complot : Diego Alonso, Juan Rocamora (Nether) et Emron.

Ambiance de la partie privée : fébrile, tendue, paranoïaque ; tout le monde obéit sans question, seul Francesco décide, et lui-même applique les consignes que Dominique lui souffle. Les planning sont calés sur son agenda, réglé comme une horloge : réunions, voyages, rendez-vous, opérations de lobbying. Faille exploitable par des PJ psychologues : personne ici ne sait improviser face à une situation imprévue.

Journée type d'un numéraire (utile aux infiltrés) : lever à 5 h 40 (prière, douche froide, autoflagellation), messe à 6 h 45, cilice deux heures par jour, ménage, rencontre avec le directeur (prospects à recruter, confession des doutes), travail ou études au dehors en évitant les tentations, déjeuner avec un non-membre à convertir, « cercle » hebdomadaire, méditation, dîner silencieux, cours de théologie, examen de conscience, coucher à 22 h sur une planche, une nuit par semaine sans oreiller.`,
    [inScene(diego), inScene(leon)], false),

  scene('personnalites', '2b. Les personnalités : coopérateurs et visiteurs influents', 'Madrid – ministères, cabinets, villas, plateaux de télévision',
    `De nombreuses personnalités viennent au centre, comme coopérateurs ou pour voir Francesco dans le cadre de JR. Aucune ne sait qu'un complot mondial d'anges se trame avec sa complicité, mais toutes savent aider une branche zélée du Vatican à infléchir les lois et la société espagnoles. Chacune connaît le morceau qui la concerne ; reconstituer le plan d'ensemble suppose de recouper de nombreux témoignages réticents, et cela ne passera pas inaperçu tant ces gens sont connus. À encourager quand même, même discrètement : ces témoignages serviront au procès.

Le panel du livre (voir les fiches) :
• Jésus Ponz (Éducation) : opposé en secret aux projets scolaires, prêt à parler et à fournir des dossiers s'il est sûr de la discrétion.
• Basilio Cruz (Justice) : franquiste fidèle, muet sur les secrets d'État, mais incapable de supporter la douleur.
• Pablo Bravo (police) : le seul vraiment retournable ; convaincu, il obtient de Francesco le vrai projet en version allégée.
• Lamanite (télé-réalité) : démon de Nybbas ravi de nuire aux anges, mais qui ne cède pas trop vite.
• Jordi Peres (banque) : carnets de toute une vie dans son coffre ; avoue tout si l'on joue sur son salut, jamais sous la torture.
• Roberto Albares (conseiller du Premier ministre) : craque sous la menace de la presse people.
• Miguel Izco (avocat) : parle vite mais ne sait rien de clair ; sa collaboratrice Maria Vallagua sait où sont les dossiers.

Logistique : les horaires de ces personnes sont irréguliers (le MJ les fait aller et venir selon les besoins) ; toutes ont des gardes du corps, plus ou moins nombreux et professionnels mais efficaces. Enlèvements : à moins que les victimes, relâchées, n'aient aucune envie d'en parler, Francesco se doute de quelque chose dès que plus d'un coopérateur est inquiété ; il envoie alors Emron (scène 6).`,
    [inScene(ponz), inScene(cruz), inScene(bravo), inScene(lamanite), inScene(peres), inScene(albares), inScene(izco)], false,
    [choice('cooperateurs', 'Comment les PJ traitent-ils les coopérateurs ?', [
      ['Approches discrètes, sans casse', 'Témoignages partiels pour le procès, sans alerter Francesco. TRIC −2 par coopérateur neutralisé.'],
      ['Pablo Bravo retourné', 'Quelques jours plus tard, il rapporte le vrai projet (version allégée mais accablante) ; allié possible pour la suite.'],
      ['Plusieurs coopérateurs enlevés ou menacés', 'Francesco s\'inquiète et lâche Emron et ses légionnaires sur l\'affaire (scène 6).'],
    ])]),

  scene('enlevement-cooperateur', '2c. Enlever un coopérateur', 'Madrid – dans la rue, à la sortie d\'un ministère ou d\'une villa',
    `Combat possible si les PJ s'en prennent physiquement à une personnalité. Les gardes du corps sont des professionnels qui ne meurent pas pour leur client : une démonstration de force bien menée peut suffire à les faire décrocher. Près des lieux officiels, la police intervient vite (et la villa de Jordi Peres est gardée par des policiers).
Après coup : si plus d'un coopérateur est inquiété et parle de ce qui lui est arrivé, Francesco envoie Emron (scène 6).`,
    [inScene(garde, { qty: 3 }), inScene(policier, { qty: 2 })], true),

  scene('infiltration', '3. S\'infiltrer dans la secte', 'Madrid – partie publique du centre de la Plaza de Canalejas',
    `Le point faible de la protection de Francesco : la secte recrute en permanence, et pour entrer, il faut se faire inviter. Les apostolats (activités de recrutement) visent surtout les gens influents, riches ou éduqués, en particulier dans les universités ; numéraires et prospects doivent toujours ramener du monde, au nombre et à la qualité. Le premier entretien porte sur le statut social du candidat. Des PJ qui comprennent l'appétit de pouvoir de l'ordre peuvent se faire repérer en se présentant comme des cibles de choix (riche héritier, chercheur, intellectuel…).

Une fois ferrés, ils ne seront plus lâchés : jugés, évalués, espionnés en permanence. Ils doivent tenir leur couverture et supporter la vie de numéraire (voir la journée type, scène 2) au moins le temps de gagner la confiance des responsables. Ni le temps ni l'ambiance ne jouent pour eux : Régine les relance. Victor Hugo Calvo s'occupe des nouveaux, Luis Munne leur fait cours, Rosa Gonzalez et ses bonnes surveillent tout, et la jeune Maria Corachan n'est que souffrance silencieuse.

Ce que l'infiltration rapporte : une bonne compréhension du fonctionnement du centre, peu de choses sur le complot lui-même. Il faut en profiter pour préparer un casse jusqu'au bureau de Francesco (scène 4) ou pour repérer les personnalités et obtenir leurs informations (scène 2b). Juan Ignacio Leon y Castillo, habitué des lieux, est une mine d'informations.

Si Francesco se doute de quelque chose, il charge Emron de régler le problème et de vérifier que tout va bien : il est alors temps pour les PJ d'aller jouer ailleurs (scène 6).`,
    [inScene(calvo), inScene(munne), inScene(gonzalez), inScene(corachan), inScene(leon)], false,
    [choice('infiltration', 'Comment se passe l\'infiltration ?', [
      ['Couverture tenue', 'Accès aux habitudes du centre, aux horaires des gardes et aux visiteurs : bonus de préparation pour le casse.'],
      ['Couverture éventée', 'Francesco envoie Emron (scène 6) ; les PJ doivent fuir ou se battre.'],
      ['Abandon (les PJ craquent)', 'Ils repartent avec quelques témoignages de membres (valeur nulle pour l\'IA) et des plans partiels.'],
    ])]),

  scene('casse', '4. Le casse : le bureau et la chapelle de Francesco', 'Madrid – dernier étage du centre (partie privée)',
    `Attaquer de front est presque impossible : le bâtiment jouxte une caserne de police et les légionnaires sont toujours là. Un cambriolage est envisageable, à condition d'une préparation hors pair (portes blindées, trois gardes à chaque porte, caméras ; Diego Alonso a les codes d'accès de la partie privée et de l'appartement, mais pas du coffre).

Dans le bureau de Francesco, des dossiers tenus au cordeau : des centaines de preuves sur JR, ses ramifications en Europe, dans le monde et jusque dans la hiérarchie angélique. De quoi faire le grand déballage au conseil de discipline et, si les PJ n'ont pas fini les autres villes, de quoi relancer l'enquête :
• les coordonnées de l'ordre de Saint-Georges et de Nouvelle Russie, et les grandes lignes de la contre-révolution russe ;
• tout sur la division Azul ;
• les coordonnées de Pallard et son rôle à Moscou et dans l'affaire de la maternité Gagarine ;
• les coordonnées de l'abbé Goth et de Bussy-Rabutin, et leurs plans en France (avortement, ordre moral) ; celles de Lux Imperator et son rôle de martyr ; celles de la Fraternité Saint Pie XII ;
• l'adresse de Dixie Securities et des indications sur la fusion des Klans ;
• les contacts entre Semper Fidelis et Moroni sur l'Église mormone, et l'annonce de l'évasion de Moroni.

Le dossier Laurent : dans une chemise frappée d'un sceau angélique, un dossier préparé à la demande expresse de Dominique. Copies des mémos de Sharah sur les délires de son rival, toute l'affaire mormone depuis 1820 : Laurent savait et a laissé faire, il a été très clément lors de la condamnation de Moroni, et l'évasion de celui-ci n'a fait l'objet d'aucune enquête, signe de complicités haut placées. De quoi poignarder l'archange de l'Épée dans le dos.

Le dossier secret : Francesco ne tombera pas seul. Il a consigné tous ses échanges, officiels ou non, avec Dominique sur Torquemada et JR, et les cache dans sa chapelle privée attenante à son appartement. Personne n'en connaît l'existence ; il ne le sortirait que si son archange voulait le sacrifier. Les PJ n'ont presque aucune chance de tomber dessus par hasard, et encore moins de soupçonner son existence : s'ils le trouvent, c'est le jackpot.

Combat : en cas d'alerte, les légionnaires de garde, puis Emron et le reste des vingt soldats ; les policiers de la caserne voisine si le bruit s'entend dans la rue. Nether et Francesco peuvent être présents selon l'heure (voir l'agenda de Francesco).`,
    [inScene(azul, { qty: 6 }), inScene(emron)], true,
    [choice('butin', 'Que rapportent les PJ du dernier étage ?', [
      ['Rien : repérés avant le bureau', 'Fuite sous le feu ; Francesco renforce la garde et Emron les traque (scène 6).'],
      ['Les dossiers du bureau', 'Grosse prise pour l\'IA (voir bilan) et toutes les pistes des autres villes.'],
      ['Les dossiers du bureau et le dossier Laurent', 'En plus : de quoi charger lourdement Laurent, et montrer que Dominique préparait sa chute.'],
      ['Le dossier secret de la chapelle', 'Jackpot contre Dominique. Francesco comprend qu\'il est perdu s\'il découvre le vol : il peut chercher à négocier ou à fuir.'],
    ])]),

  scene('rapt', '5. Enlever Francesco', 'Madrid – trajet ou rendez-vous de Francesco hors de la prélature',
    `Kidnapper Francesco hors du centre est faisable, mais il est très escorté (légionnaires, Nether, parfois Emron) et il sait se défendre (Champ de force, Paralysie, Peur, Voix impérieuse, Trait d'énergie). Il est surtout quasi immortel au sens du Grand Jeu : s'il parle, Dominique le retrouvera et lui fera pire que ce que les PJ peuvent imaginer. Il ne parle donc que s'il croit que son archange cherche à le lâcher.
Même réussi, l'enlèvement ne donne pas les dossiers, qui restent dans le coffre et la chapelle du centre. Dommage pour le procès.
TRIC : Francesco neutralisé −10 (et l'Opus Dei espagnol s'en trouve fortement désorganisé).`,
    [inScene(francesco), inScene(nether), inScene(azul, { qty: 4 })], true,
    [choice('rapt', 'Issue de l\'enlèvement ?', [
      ['Francesco parle', 'Il faut le convaincre que Dominique le sacrifie (par exemple avec le dossier Laurent ou des preuves de trahison) : témoignage précieux contre Dominique, et l\'emplacement du dossier secret.'],
      ['Francesco se tait', 'TRIC −10 s\'il reste neutralisé, mais aucune preuve. Dominique sait désormais que les PJ sont dangereux.'],
      ['Francesco est tué', 'TRIC −10. L\'ange retourne au Paradis, où Dominique le prend en main ; les dossiers du centre restent à prendre.'],
    ])]),

  scene('emron', '6. Riposte : Emron enquête', 'Madrid – partout où les PJ ont laissé des traces',
    `Dès que Francesco se doute de quelque chose (plusieurs coopérateurs inquiétés, infiltrés suspects, casse raté), il envoie Emron avec une escouade de légionnaires tirer l'affaire au clair : filatures, interrogatoires musclés, puis élimination. Emron est un tueur qui aime son travail ; il n'a aucun scrupule à frapper dans la rue. À ce stade, le message est clair : il est temps de quitter Madrid avec ce que l'on a.`,
    [inScene(emron), inScene(azul, { qty: 4 })], true),

  scene('azul', '7. Le camp de la division Azul', 'Andalousie – ancienne hacienda dans le désert, camp d\'entraînement paramilitaire',
    `La division (ou légion) Azul est une bizarrerie ibérique : un centre commun d'entraînement pour les soldats de Dieu, où chaque ange vient chercher ses troupes. Ancienne hacienda (on y élevait des chiens et des tourterelles, puis l'endroit a été transformé en camp paramilitaire : champ de tir, parcours du combattant, chapelle). Les légionnaires cultivent une tradition raciste et intégriste qui remonte à la Reconquista ; la division porte le nom des volontaires fascistes envoyés par Franco sur le front de l'Est, et le portrait du Caudillo trône dans le mess, à côté de ceux de Jean-Paul II et du fondateur de l'Opus Dei.

Une centaine de soldats de Dieu y sont présents en permanence. Seuls des officiels de l'Église y entrent, et un ange a besoin d'une autorisation officielle ; à l'intérieur, rien de militaire n'est laissé au hasard. Les archives sont tenues au cordeau : on y voit que Guernica et deux escouades ont été envoyés en France pour protéger l'abbé Goth, que des mouvements de troupes sont passés par Dixie Securities, et que depuis quelques années Dominique a fait donner à Francesco tout pouvoir sur l'emploi de la division. Le général Exan obéit, sans plaisir.

Neutraliser la division : TRIC −2. Une attaque frontale est suicidaire ; mieux vaut convaincre, compromettre ou saboter.`,
    [inScene(exan), inScene(azul, { qty: 8 })], true,
    [choice('azul', 'Que deviennent la division Azul et ses archives ?', [
      ['Division neutralisée', 'TRIC −2 ; Francesco perd sa force armée en Espagne et en France.'],
      ['Archives copiées discrètement', 'Preuves pour l\'IA (voir bilan), sans alerter Francesco.'],
      ['Rien', 'La division continue de fournir des hommes à JR.'],
    ])]),

  scene('bilan', '8. Bilan de Madrid : TRIC et preuves', 'Rapport à Régine',
    `${TRIC_MADRID}

${IA_MADRID}

Rappels de campagne : seules les preuves transmises à Régine comptent dans l'IA officiel ; les autres peuvent être sorties au procès. Les conspirateurs réagissent à l'IA officiel. Les PA de fin de mission sont distribués par Régine juste avant le procès.`,
    [inScene(regine)], false,
    [choice('transmission', 'Les PJ transmettent-ils les dossiers de Madrid à Régine ?', [
      ['Tout est transmis', 'IA officiel au plus haut ; les conspirateurs savent que le procès sera dur et pressent les PJ jusqu\'au bout (huissiers, grades 3).'],
      ['Une partie est gardée', 'Les preuves gardées serviront de coup de théâtre au procès ; Ange et Alain seront surpris, voire vexés.'],
      ['Le dossier de la chapelle est gardé pour négocier', 'Arme absolue contre Dominique, mais tentation d\'un marché (scène 10) ; Yves sanctionnera les tractations s\'il les découvre.'],
    ])]),

  // ---------------- Épilogue : le procès ----------------
  scene('attente', '9. Épilogue : en route pour le Paradis', 'Paris, Notre-Dame, puis le Paradis (escalier, couloirs, salle des témoins)',
    `La campagne se termine quand Ange et Alain estiment avoir assez d'éléments pour réunir le conseil de discipline, une procédure exceptionnelle. En pratique, le MJ décide : de préférence quand les PJ ont fait le tour des villes, ou quand la campagne s'enlise et qu'il faut arrêter les frais. Si les PJ meurent avant, le conseil a lieu quand même : Ange et Alain les font revenir témoigner, et ils peuvent même se réincarner en gardant la mémoire (une vie gratuite).

Après les dernières informations et les PA remis par Régine, les PJ doivent rassembler toutes leurs preuves (là où ils les ont cachées), sous la pression des anges de Dominique et de Laurent qui les talonnent : c'est le moment d'improviser une course finale selon leurs éventuelles erreurs. Régine arrive alors avec Michel en personne, escorté d'une dizaine de ses grades 3, et les mène jusqu'à Notre-Dame sous l'œil torve des grades 3 de Laurent et de Dominique qui les harcèlent depuis des semaines. Dans la cathédrale, les portes s'ouvrent vers les profondeurs, jusqu'au Paradis. Longue marche, escalier interminable, couloirs et bureaux : Ange et Alain les y attendent et les briefent ; le conseil commence quelques minutes plus tard.

Le cadre : les PJ sont témoins à charge d'Ange et d'Alain, qui attendent d'eux une participation intelligente et totale. Huis clos à cause de Dominique (premier procès où l'archange de la Justice est accusé). Accusateurs : Ange et Alain. Accusés : Laurent, Dominique, Georges. Juge : Yves, arbitre impartial à l'américaine. Jurés tirés au sort parmi les archanges non impliqués : Blandine, Francis, Jean, Joseph et Marc. Témoins : les PJ, Michel, et ceux que citent les deux parties.

La salle des témoins : Ange et Alain repartent, laissant les PJ avec des huissiers… anges de Dominique, très bien briefés, qui les travaillent au corps : faire comprendre l'énorme erreur qu'ils commettent, la carotte et le bâton, menaces de représailles s'ils sortent toutes leurs preuves, surtout contre Laurent. S'ils se plaignent aux gardes, rien ne bouge ; s'ils parviennent à prévenir Yves, celui-ci envoie un grade 3 calmer le jeu, mais les huissiers les feront payer à l'écart. Dominique saura alors que les PJ ne sont pas vraiment avec lui.

Pendant l'attente, les joueurs doivent définir leur stratégie : leur carrière et l'équilibre des forces au Paradis en dépendent. Vont-ils tout donner ? Sauver Georges, Laurent ou Dominique ? Reculer au dernier moment ? Ils ne sortiront pas du conseil sans ennemis, et avoir Dominique pour ennemi personnel n'est pas une sinécure. C'est le prix d'un bon ange.`,
    [inScene(regine), inScene(michel), inScene(ange), inScene(alain)], false,
    [choice('huissiers', 'Comment les PJ réagissent-ils aux pressions des huissiers ?', [
      ['Ils encaissent sans rien dire', 'Les huissiers croient avoir gagné ; surprise au moment des témoignages.'],
      ['Ils préviennent Yves', 'Un grade 3 d\'Yves intervient ; Dominique sait que les PJ ne sont pas des siens.'],
      ['Ils cèdent et décident de ménager quelqu\'un', 'À reporter dans la pondération des index ; Ange et Alain (ou Laurent) s\'en rendront peut-être compte.'],
    ])]),

  scene('conseil', '10. Le conseil de discipline', 'Le Paradis – salle du Conseil divin, à huis clos',
    `Positions des belligérants :
• Yves : veut que les traîtres soient démasqués et les règles appliquées ; un bon scandale fera rentrer certains dans le rang et préservera le statu quo. Impartial, quel que soit le résultat.
• Laurent : pour le retour de Georges, qu'il croit prêt à soutenir son putsch. La chrétienté est en crise majeure, seule une croisade remettra les infidèles à leur place ; la mort de Gabriel lui laisse le champ libre. Il reconnaîtra les accusations fondées, en ajoutant que Georges et Dominique sont avec lui, et videra son sac sur Michel, « le traître hérétique ».
• Dominique : plus vicieux. Il nie toute faute contre les règles du Grand Jeu mais concède que l'idée de Laurent et Georges est bonne tant qu'elle respecte les règles. Si les durs gagnent, il est avec eux ; s'ils perdent, contre eux. Il veut ardemment le pouvoir de Laurent et le retour de Georges, sans rien en laisser paraître, et jouera l'archange choqué d'être dans le box, garant d'une apparence de neutralité orthodoxe.
• Georges : le faux-cul. Il savoure le mauvais tour que s'est joué Laurent, explique calmement qu'il n'a rien fait (vrai) et qu'il ne comprend rien (faux). Il voit tout cela comme une revanche, ne s'ouvre à personne et répète qu'il suivra la décision du Conseil. Pour lui, des discussions entre archanges autour d'un verre ne méritent pas un conseil de discipline (ce qui est vrai).
• Michel : veut faire condamner les trois sans être amalgamé avec eux, ce qui n'est pas simple ; Laurent l'y aide en le traitant de traître.
• Ange et Alain : veulent surtout faire tomber Dominique et Laurent ; Georges en prime, mais il est moins dangereux. Agréablement surpris si les PJ ont gardé des preuves en réserve… à condition qu'ils les sortent.

Interruptions de séance :
• Dominique demande une suspension et propose aux PJ de l'épargner en échange de sa protection : quelques-uns de ses anges ont mal agi, cela ne peut lui être imputé, et condamner un serviteur de la Justice discréditerait la justice divine. Mieux vaut que seul Laurent tombe. Il est prêt à monnayer, en nature voire en PA, un témoignage qui l'épargne. Si les PJ acceptent, Ange et Alain leur feront une guerre sans précédent, mais Dominique les protégera.
• Laurent se calme et demande une suspension, surtout s'il se retrouve accusé principal. S'il sent que Dominique le lâche, il cherche à l'entraîner dans sa chute et menace les PJ : si les durs gagnent, mieux vaut être du bon côté du manche. Il ne propose rien lui-même mais écoute les offres.
• Ange et Alain demandent aussi des suspensions pour parler aux PJ s'ils semblent retenir des preuves.
Les possibilités sont trop nombreuses pour être listées : le MJ improvise selon la campagne et le camp que les PJ privilégient, et laisse les joueurs non seulement répondre aux archanges mais influer sur leur avenir.

Méthodes pour jouer le procès (voir le choix ci-dessous). Le procès dure une seule « journée » de plusieurs heures, mais au Paradis le temps ne compte pas.`,
    [inScene(yves), inScene(ange), inScene(alain), inScene(michel), inScene(laurent), inScene(dominique), inScene(georges)], false,
    [choice('methode', 'Comment jouer le procès ?', [
      ['Méthode intermédiaire (recommandée)', 'Les joueurs annoncent chaque preuve et la manière de la présenter ; les archanges adverses objectent, les PJ contre-argumentent ; le MJ additionne par archange, pondère selon les arguments et le jeu, puis Yves annonce le verdict.'],
      ['Méthode rapide et mathématique', 'Les joueurs listent leurs preuves, le MJ fait les totaux et lit les résultats d\'une voix monocorde.'],
      ['Méthode « GN »', 'Plusieurs MJ ont préparé les dossiers et jouent en direct Alain, Ange, Laurent, Georges, Dominique, Michel et Yves : objections, plaidoiries, jusqu\'à dix heures de procès.'],
    ]),
    choice('marche', 'Les PJ passent-ils un marché avec un accusé ?', [
      ['Aucun marché', 'Les index sont calculés sur toutes les preuves produites.'],
      ['Marché avec Dominique', 'Les PJ retirent ou atténuent des lettres D (jets possibles pour que les autres s\'en aperçoivent). Dominique les protège, Ange et Alain leur déclarent la guerre ; Yves réduit leur récompense s\'il découvre la tractation.'],
      ['Marché avec Laurent', 'Les PJ ménagent les L. Laurent s\'en sort mieux mais, s\'il comprend qu\'il a été le dindon de la farce, il se venge ; Alain, Ange et Michel sont furieux.'],
    ])]),

  scene('index', '11. Délibération : calcul des index', 'Le Paradis – fin des débats',
    `Débats clos : le MJ totalise les preuves effectivement produites (en les pondérant selon le jeu des joueurs et leurs réponses aux objections), séparément pour chaque archange. Yves prononcera la sentence choisie par le jury.

Les quatre valeurs (sur les preuves présentées par l'accusation, principalement les PJ) :
• Index générique : somme des valeurs sans lettre.
• IA Laurent = somme des L + index générique.
• IA Dominique = somme des D + index générique.
• IA Georges = somme des G + un dixième de l'index générique (Georges étant bien moins impliqué, il ne subit qu'un dixième des accusations générales).

Pondération : le MJ a toute latitude selon la présentation des preuves et les marchés passés (notamment avec Dominique). Beaucoup de preuves portent plusieurs lettres : il est possible, quoique difficile, d'en retirer ou d'en atténuer une (par exemple purger un dossier 5L + 2D de ses D). Un MJ taquin fait faire des jets pour que les protagonistes s'aperçoivent de la supercherie. Ange et Alain seront furieux s'ils voient les PJ ménager un archange ; Laurent aussi, s'il comprend qu'il est le couillonné de l'histoire.

Ensuite, consulter les tables de verdict des trois scènes suivantes (dans l'ordre : Dominique, Georges, Laurent, certaines lignes dépendant des autres index).

Rappel : les tables du cadre de campagne donnaient pour Laurent 0-10 / 11-30 / 31+ ; la page du livre (p. 118-119) en a en fait quatre : 0-10 / 11-30 / 31-50 / 51+.`,
    [inScene(yves)], false),

  scene('verdict-d', '12. Verdict : Dominique (IA D)', 'Le Paradis – annonce par Yves',
    `Table de résultat selon l'IA Dominique (somme des D + index générique, pondérée). Choisir la ligne correspondante ci-dessous.`,
    [inScene(dominique)], false,
    [choice('verdict-d', 'IA Dominique ?', [
      ['0 à 5', 'Dominique sort avec les honneurs et se permet d\'être choqué d\'avoir été accusé. Beau joueur, il dit n\'en vouloir à personne et inflige un blâme symbolique à ses anges coupables d\'exactions. Il sort grandi, exige une contre-enquête sur ses accusateurs (qu\'il soupçonne de vouloir affaiblir le Paradis) : Alain, Ange et Michel sont furieux.'],
      ['6 à 10', 'Mouillé, il se contente d\'envoyer Francesco et ses confrères au Purgatoire et, pour détourner l\'attention, décrète une purge totale contre un bouc émissaire : la Terre Creuse. Ange, Alain et Michel crient à la parodie de justice mais n\'y peuvent rien, pour le moment.'],
      ['11 à 30', 'Sérieusement compromis, il doit accepter un audit complet de son service par Yves, Ange et Alain. Il perd beaucoup de crédibilité et, pour des décennies ou des siècles, n\'est plus l\'archange tout-puissant qui juge les autres : un ange soupçonné d\'hérésie passe désormais devant une commission collégiale. La justice gagne en efficacité ce qu\'elle perd en sévérité ; Emmanuel et les anges hors-la-loi en profitent. Les PJ deviennent ses ennemis personnels, mais il aura du mal à mettre ses menaces à exécution.'],
      ['31 et plus', 'Placé sous la tutelle directe du Conseil divin : chaque décision importante doit être approuvée, et le Conseil se venge de millénaires d\'arrogance. Furieux, il cherchera à détruire les PJ mais aura du mal sous ce contrôle strict. Ses cours de justice sont abolies au profit de commissions paritaires plus justes, plus lentes et moins sévères. Ange et Alain sabrent le champagne toute la nuit ; Yves annonce le verdict avec presque un sourire.'],
    ])]),

  scene('verdict-g', '13. Verdict : Georges (IA G)', 'Le Paradis – annonce par Yves',
    `Table de résultat selon l'IA Georges (somme des G + un dixième de l'index générique, pondérée). Deux lignes dépendent de l'IA Laurent : la calculer d'abord.`,
    [inScene(georges)], false,
    [choice('verdict-g', 'IA Georges ?', [
      ['0 à 4', 'Lavé de tout soupçon. Si l\'IA Laurent dépasse 50, Dominique propose de rendre à Georges sa place, son successeur ayant manifestement échoué. Georges, de marbre, déclare s\'en remettre au Conseil.'],
      ['5 à 10', 'Déclaré mauvais exemple pour ses collègues et pour la chrétienté, sommé de faire amende honorable et de faire rentrer ses anges dans le rang. Sa punition : aller détruire la Terre Creuse, ce qu\'il fait à contrecœur mais avec l\'efficacité redoutable qui a fait sa réputation.'],
      ['11 à 30', 'Reconnu instigateur moral de JR, sans participation active. Il ne peut plus communiquer qu\'en présence de témoins désignés par le Conseil et doit faire pénitence une dizaine d\'années. Ses anges actifs doivent choisir un archange en activité sous peine d\'être déclarés renégats : beaucoup choisissent la seconde option et rejoignent la Terre Creuse, ce qui n\'arrangera pas Dominique s\'il a décidé de la purger.'],
      ['31 et plus', 'Dégradé, il devient ange de Laurent (si l\'IA Laurent est inférieure à 31) ou de Michel, cantonné à des tâches administratives : le comble de l\'humiliation. Ange et Alain sont ravis.'],
    ])]),

  scene('verdict-l', '14. Verdict : Laurent (IA L)', 'Le Paradis – annonce par Yves',
    `Table de résultat selon l'IA Laurent (somme des L + index générique, pondérée). Certaines lignes dépendent des IA Dominique et Georges.`,
    [inScene(laurent)], false,
    [choice('verdict-l', 'IA Laurent ?', [
      ['0 à 10', 'Laurent s\'en tire étonnamment bien, sans doute grâce à un accord avec les PJ. Il convoque Semper Fidelis pour une conversation privée. Sharah passe chez Michel avec toute son organisation pour éviter les représailles. Alain, Michel et Ange sont hors d\'eux.'],
      ['11 à 30', 'Éclaboussé mais toujours en place, il purge ses éléments corrompus et subit une inspection complète de ses troupes : par Dominique si l\'IA D est inférieure à 31 (inspection lourde pour l\'enfoncer et montrer qui commande), sinon par Yves, bien plus objectif. Son service repart après une sérieuse perturbation.'],
      ['31 à 50', 'Salement compromis : il reste à la tête de son service mais perd tout droit de vote et ne siège plus au Conseil qu\'à titre informatif. Son service passe sous la tutelle d\'Yves et du Conseil, et Sharah devient le tuteur de son archange. Laurent enrage et en veut à la terre entière, surtout aux PJ. Grande fête chez Alain et Ange : les PJ sont invités !'],
      ['51 et plus', 'Démis de ses fonctions. Si l\'IA Georges est inférieure à 11, Georges, son ancien supérieur, est nommé à sa place, reprend les choses en main et fusionne le service de Laurent avec ses vétérans. Sinon, Sharah devient archange de l\'Épée et lance une grande purge avec l\'aide de Michel ; beaucoup d\'anges de Laurent passent chez Georges par dépit. Alain et Ange se soûlent toute la nuit.'],
    ])]),

  scene('fin', '15. Récompenses, représailles et version officielle', 'Le Paradis, puis la Terre',
    `Récompense : Yves remercie les PJ et décide, vu l'importance politique du procès, de les récompenser lui-même : de 1 à 10 PA, uniquement selon des critères « yviens » (objectivité, raison, justice, abnégation). Peu importe qui est condamné, et les témoignages influencés après coup ne comptent pas. S'il s'aperçoit que les PJ ont trafiqué preuves ou témoignages, il sera intraitable mais ne sanctionnera pas : un sermon et peu de PA. Il interdit aux archanges de leur donner le moindre PA, leur fournit un numéro d'appel spécial en cas de menaces ou de pressions, et annonce devant tous les archanges que le conseil de discipline ne plaisante pas : représailles et remerciements sont exclus. Les PJ qui ont passé un accord avec un archange auront donc du mal à le cacher et à toucher leur dû, ce qui peut donner des scénarios amusants au Paradis.

Quoi qu'il arrive, les PJ se sont fait des ennemis, peut-être des amis ; même protégés, cela pèsera sur leur avenir.

Version officielle de l'histoire d'INS/MV (pour qui suit la chronologie officielle) :
• Dominique plante superbement Laurent et le rend seul responsable ; il se sert de la Terre Creuse pour détourner l'attention et éviter le gros du scandale (IA D 20). Paranoïaque, il lance ses anges dans une campagne de terreur dans toute la hiérarchie angélique pour « amputer la gangrène ». L'Enfer se tord de rire.
• Georges reste calme : on ne peut lui reprocher d'avoir eu des opinions, même si elles ont inspiré des esprits limités. Il sort un temps de sa retraite, sur suggestion de Dominique, pour prouver sa bonne foi en purgeant la Terre Creuse (IA G 15).
• Laurent, bouc émissaire, se retrouve comme un gamin devant le jury ; sa défense l'enfonce. Presque démis, il voit Sharah devenir son tuteur et avaliser toutes ses décisions. Humilié, il rumine sa revanche ; ses rapports avec Dominique et Michel tournent à la guerre larvée (IA L 40).
• Ange, pragmatique, est satisfaite : elle aurait aimé faire tomber Dominique, mais lui avoir fait peur est déjà une victoire qui le calmera pour des décennies. Elle veille sur les PJ contre les représailles. Alain et Michel, dégoûtés par tant de mesquinerie et d'injustice divine, commencent à comploter… mais ceci est une autre histoire.

Et non : Jésus ne revient pas.`,
    [inScene(yves), inScene(ange), inScene(alain), inScene(michel)], false,
    [choice('pa', 'Comment Yves juge-t-il la conduite des PJ ?', [
      ['Objectifs, justes, désintéressés', 'Jusqu\'à 10 PA et le numéro d\'appel d\'Yves.'],
      ['Corrects, avec quelques calculs', 'Entre 4 et 7 PA environ (au jugement du MJ).'],
      ['Ils ont trafiqué preuves ou témoignages', 'Sermon et 1 à 3 PA. Leurs marchés avec les archanges seront difficiles à honorer.'],
    ])]),
];

const scenario = {
  id: 'jesus-reviens-7-madrid',
  nom: 'Jésus Reviens ! – 7. Madrid et le procès',
  resume: `Dernière ville de la campagne : à Madrid, Francesco, grade 3 de Dominique et vrai cerveau de l'opération JR, dirige depuis un centre de l'Opus Dei de la Plaza de Canalejas l'opération Torquemada, une lente reconquête morale et légale de l'Espagne. Les PJ, toujours envoyés par Régine pour le compte d'Ange et d'Alain (avec Yves, et prévenus en secret par Michel), doivent obtenir ses dossiers : casse du centre gardé par la division Azul, infiltration de la secte, enlèvement de Francesco, ou enquête auprès des personnalités qui le fréquentent. Les dossiers contiennent les pistes de toutes les autres villes, un dossier préparé par Dominique contre Laurent, et, caché dans la chapelle, le dossier secret de Francesco contre Dominique. Puis vient l'épilogue : le conseil de discipline au Paradis, où les PJ témoignent contre Laurent, Georges et Dominique ; Yves juge, et les index L, G et D fixent les verdicts.`,
  notes: `Sources : ${REF} ; ${REF9}. Voir aussi le cadre de campagne (jesus-reviens-0-cadre) pour la TRIC, l'Index d'Accusation et les PNJ récurrents.

Structure : scènes 1 à 8 = Madrid (épisode très ouvert, pas de chronologie imposée : Francesco ne prépare pas de coup d'éclat, l'opération se joue dans la durée) ; scènes 9 à 15 = le procès, avec les tables de verdict en choix (scènes 12 à 14).

${TRIC_MADRID}

Index d'Accusation : ${IA_MADRID}

Calcul des index au procès : index générique = valeurs sans lettre ; IA L = L + générique ; IA D = D + générique ; IA G = G + un dixième du générique ; pondération libre du MJ.
Verdicts : Dominique 0-5 / 6-10 / 11-30 / 31+ ; Georges 0-4 / 5-10 / 11-30 / 31+ ; Laurent 0-10 / 11-30 / 31-50 / 51+ (le cadre de campagne ne citait que trois tranches pour Laurent : la page p. 118-119 en donne quatre).
Récompense : 1 à 10 PA donnés par Yves selon l'objectivité, la raison, la justice et l'abnégation des PJ ; aucun PA des archanges. Les PA de fin de mission (Régine) ne sont pas chiffrés dans ces pages.

Adaptations : Juste lame (Emron, Exan) et Aura de confession (Lamanite) n'existent pas dans les règles du Grimoire : notés dans les talents. Les armes de la division Azul (épée longue) et d'Exan (épée, carabine) ne sont pas données : estimées d'après leurs talents. Francesco n'a pas d'arme : il combat avec ses pouvoirs. Les archanges, Régine et les jurés n'ont pas de fiche (fiches minimales). Aucun allié des PJ (Régine, Michel, Ange, Alain, Yves, ni les coopérateurs retournables Ponz et Bravo) ne figure dans une scène de combat.`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [francesco, nether, diego, emron, exan, azul, garde, policier, ponz, cruz, bravo, lamanite, peres, albares, izco,
  calvo, munne, gonzalez, corachan, leon, regine, michel, ange, alain, yves, laurent, dominique, georges].map(asType);

const at = Date.now();
const mem = (key, kind, txt, suite, scene = null) => ({ id: id('mem-' + key), at, scen: scenario.id, scene: scene && id('sc-' + scene), kind, txt, pjs: [], suite, rappel: null, done: false, res: '' });
const memoire = [
  mem('chapelle', 'secret', 'Francesco cache dans sa chapelle privée toutes ses communications avec Dominique sur Torquemada et JR.',
    'Jackpot contre Dominique au procès. Personne n\'en connaît l\'existence : il faut un indice (Francesco qui parle, fouille minutieuse).', 'casse'),
  mem('dossier-laurent', 'secret', 'Francesco détient un dossier contre Laurent préparé à la demande de Dominique.',
    'Preuve contre Laurent, et preuve que Dominique préparait la chute de son complice : à produire au procès.', 'casse'),
  mem('bravo', 'allie', 'Pablo Bravo, cadre de la police coopérateur de l\'Opus Dei, peut être retourné.',
    'Convaincu, il soutire à Francesco le vrai projet Torquemada (version allégée) et devient un allié en Espagne.', 'personnalites'),
  mem('emron', 'ennemi', 'Emron, ange de Laurent à la tête des légionnaires Azul du centre, traque quiconque inquiète Francesco.',
    'Il frappe dès que plusieurs coopérateurs sont inquiétés ou qu\'une infiltration est suspecte.', 'emron'),
  mem('marche', 'dette', 'Marché éventuel des PJ avec Dominique ou Laurent pendant le procès.',
    'Yves interdit tout remerciement : le payer sera délicat ; Ange et Alain feront la guerre aux PJ s\'ils l\'apprennent.', 'conseil'),
];

const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));
const ids = [scenario.id, ...scenes.map((s) => s.id), ...scenes.flatMap((s) => s.npcs.map((x) => x.id)), ...scenes.flatMap((s) => s.choix.map((c) => c.id)), ...bestiaire.map((t) => t.id)];
if (new Set(ids).size !== ids.length) console.warn('Identifiants en double !');
writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types,', scenes.reduce((a, s) => a + s.choix.length, 0), 'choix,', memoire.length, 'fils');
