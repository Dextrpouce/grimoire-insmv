// Génère le fichier d'import « insmv-scenario » pour « De dollars et d'eau fraîche [Space Devils] » (Angelots en gelée, scénario 7, p. 98-109)
// usage : node gen-angelots-7-dollars-eau-fraiche.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Angelots en gelée, « De dollars et d\'eau fraîche [Space Devils] » (T. Cheilan), p. 98-109';
const L = (s) => R.parseLvl(String(s));
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
const ARMES = new Map(R.ARMES.flatMap(([g, l]) => l.map((x) => [x[0], { prec: x[1], puis: x[2], melee: R.MELEE_GROUPS.includes(g) }])));
// arme de la table des règles : nom affiché, nom dans la table, niveau du talent
const arme = (n, table, lvl) => { const w = ARMES.get(table); if (!w) throw new Error('arme inconnue : ' + table); return { n, att: L(lvl), ...w }; };
// arme avec précision / puissance données par le livre : « Nom (pr X ; pu Y) », niveau du talent
const livre = (n, lvl, prec, puis, melee) => ({ n, att: L(lvl), prec, puis, melee });
const poing = (lvl) => arme('Coup de poing', 'Coup de poing', lvl);
const P = 'ag7-'; let n = 0; const id = (k) => P + k;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [poing(1)], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});
const SANS = 'Pas de caractéristiques dans le livre : fiche minimale (humain moyen, niveau 2 partout, coup de poing niveau 1).';

// ---------------- Troupes (déjà dans le bestiaire des livres : mêmes valeurs) ----------------
const terroristes = npc('terroristes', {
  nom: 'Apprentis terroristes', source: 'Branche locale de la cellule (jeunes créoles armés d\'Uzi)', qty: 4,
  car: car('2 2 2 1 1 1'), def: L('1+'), pfFix: 3, seuilsFix: seuils('3/6/9/12'),
  armes: [arme('Uzi avec silencieux', 'Pistolet-mitrailleur', 2), poing(2)],
  talents: 'Athlétisme 2, Baratin 1+, Conduite 2, Corps à corps 2, Défense 1+, Tir 1+ (Uzi 2), Jurer sur la vie de la Mecque 3',
  notes: 'Douze en tout : deux tiennent le centre de sécurité, six (par deux) attaquent les trois accès de la tour de contrôle, quatre font irruption dans le sas de coordination. Ils ne savent rien : leur chef, qui a donné l\'ordre, a été corrompu et se trouve dans un camp d\'entraînement au Soudan.\nUtiliser des pouvoirs devant eux déclenche une crise mystique aux effets variables.\nMêmes valeurs que l\'entrée « Apprentis terroristes » du bestiaire des livres.',
});
const paras = npc('paras', {
  nom: 'Parachutistes en opération', source: 'Régiment en garnison à Kurukuku (humains)', qty: 6,
  car: car('3 2 2 1 1 1'), def: L(2), pfFix: 4, seuilsFix: seuils('4/8/12/16'),
  armes: [arme('Fusil d\'assaut', 'Carabine', 3), poing(3)],
  talents: 'Athlétisme 3+, Conduite 2, Corps à corps 3, Défense 2, Hobby (parachutisme) 3, Savoir militaire 2 (fermer sa gueule 3), Tir 2 (armes d\'épaule 3), Attendre la solde 3+',
  notes: 'Vingt prennent la base d\'assaut : dix autour des check-points, huit sur le toit du CoC (six arrivent avec les anges), deux ont raté leur atterrissage. Le reste du régiment encercle la station.\nIls ignorent tout du Grand Jeu : témoins de phénomènes surnaturels, ils deviennent fous, à tendance berserk suicidaire. Galvanisés par leurs chefs (les anges), ils font front.\nMêmes valeurs que l\'entrée « Parachutistes en opération » du bestiaire des livres.',
});

// ---------------- Démons ----------------
const miju = npc('miju', {
  nom: 'Miju', source: 'Démon de combat (grandes cornes, QI d\'un enfant de huit ans)', type: 'combat',
  car: car('5 3 2 1+ 3 2'), def: L(3), pp: 10,
  armes: [arme('Grandes cornes', 'Coup de boule (casque)', 5), poing(5)],
  pouvoirs: pows('Armure corporelle 1, Forme de combat 1, Membre exotique : grandes cornes, Peur 1'),
  talents: 'Athlétisme 4, Corps à corps 5, Intimidation 4',
  notes: 'Garde le pavillon du 114 allée des Groseilles. Corrompu par Gojgat (déguisé en Nicole Kidman) pour un pot de sucettes Chubie Chuba : il a éliminé Ujkze, le contact, et jeté ses dossiers dans la grande poubelle de dehors. Menteur maladroit, il cache son pot de sucettes dans son dos. Se met à table si on le cuisine gentiment ; menaces physiques ou coups le rendent fou furieux.\nLe livre renvoie au démon de combat du livre de base (p. 127) sans donner ses chiffres : profil entièrement estimé (cornes traitées comme un coup de boule casqué : précision -2, puissance +2).',
});
const shaksaya = npc('shaksaya', {
  nom: 'Shaksaya, alias Andrej Belowahf', source: 'Démon de Vapula, grade 1 (chef de projet norvégien de Yukie 3)', type: 'demon',
  car: car('3 3 3 4 3 3'), def: L(4), pp: 22, pfFix: 7, seuilsFix: seuils('5/10/15/20'),
  armes: [livre('Jet d\'acide', 3, 2, 6, false), poing(3)],
  pouvoirs: pows('Corps liquide, Déguisement superficiel 3, Esprits multiples 1, Invention 5, Jet d\'acide 2, Langage universel, Non-détection 2, Poltergeist 3, Psychométrie 2, Télépathie 2, Volonté supra-normale 1'),
  talents: 'Athlétisme 2, Aisance sociale 3, Baratin 4, Conduite 4, Corps à corps 3, Défense 4, Discussion 5, Discrétion 4, Enquête 3, Informatique 6, Intrusion 2+, Science 3 (astrophysique 4), Technique (télécommunications) 8, Tir 3 (armes lourdes 6)',
  notes: 'A trafiqué Yukie 3 pour le projet Têtard du Cosmos, puis s\'est laissé corrompre par Gojgat (déguisé en Tom Cruise) : 100 000 $ (le livre parle aussi de 200 000 $) et une clé USB à brancher au CoC. Il a fait planter « Robert Mitchum » par Poltergeist pour faire diversion. Aigri : le logiciel de Vapula a donné « son » grade 2 à un grade 0.\nInterrogé, il se débat, se rend, puis tient le plus longtemps possible ; il propose ses 100 000 $ contre sa liberté. Il déteste les anges et ne leur dira rien (plutôt mourir). Fouiller sa mémoire (Rêve) révèle le nom de Gojgat.\nJet d\'acide : niveau de l\'attaque pris sur Tir 3 (le livre ne précise pas), précision +2, puissance +6 du livre. Esprit multiple du livre = Esprits multiples.',
});
const gojgat = npc('gojgat', {
  nom: 'Gojgat, alias Kidman, alias Cruise, alias Bawr', source: 'Démon de Mammon, grade 1', type: 'demon',
  car: car('2 3 3 4 4 4'), def: L(3), pp: 20, pfFix: 6, seuilsFix: seuils('4/8/12/16'),
  armes: [livre('Petit calibre', 2, -2, 3, false), poing(2)],
  pouvoirs: pows('Charme 2+, Corruption 3+, Lire les pensées 2, Non-détection 1, Polymorphie 1, Téléportation 1'),
  talents: 'Aisance sociale 5, Athlétisme 2, Baratin 5, Corps à corps 2, Culture générale 2 (économie 6), Défense 3, Discussion 5, Discrétion 3+, Enquête 5+, Informatique 3, Savoir criminel 3 (blanchiment d\'argent 4), Séduction 4, Tir 1+ (armes de poing 2)',
  notes: 'Malin, vicieux, avare, narcissique et ambitieux. Le cerveau du sabotage : il spécule sur l\'aérospatial et veut vendre ensuite à Ouikka son projet « Grenouille du sub-espace ». Il prend les traits de Nicole Kidman, Tom Cruise ou Abu Al Bawr (n° 3 de la cellule) selon les besoins.\nCorruption : il lui faut un million de dollars sur un compte suisse pour corrompre un démon. En cas de grabuge, il fuit par Téléportation.',
});
const grax = npc('grax', {
  nom: 'Grax, alias Annette Ferrojite', source: 'Démon d\'Haagenti, grade 1 (stagiaire informaticienne renvoyée)', type: 'demon',
  car: car('4 3 3 4 2 3'), def: L(4), pp: 18, pfFix: 8, seuilsFix: seuils('6/12/18/24'),
  armes: [livre('Crocs', 5, 3, 1, true), poing(5)],
  pouvoirs: pows('Goinfrerie 3, Graisse 2, Membre exotique : crocs, Peur 2'),
  talents: 'Aisance sociale 2, Athlétisme 2, Baratin 3, Corps à corps 5, Culture générale 2 (soap 4), Défense 4, Discussion 3, Discrétion 3, Informatique 6, Hobby (cuisine) 5, Séduction 1, Manger des confitures de goyave 7',
  notes: 'Jeune femme timide et complexée, suicidée après un chagrin d\'amour (Wilmid Cancan), dont l\'enveloppe a accueilli Grax. Recruté il y a trois mois par Gojgat pour saboter le réseau de Nanane Espace ; un démon d\'Abalam l\'a ensuite rendu fou : il se prend pour sa couverture et ne se souvient de rien. C\'est pourtant la seule capable de réparer le réseau en moins de dix minutes.\nQuand on la brusque, Grax prend le dessus : monstre colérique sans conscience de lui-même, qui frappe et dévore tout ce qui bouge jusqu\'à la fin de la crise. Le détruire, c\'est rater la mission. Le nourrir d\'ange le calme pour un moment.\nMembre exotique (croc) du livre = Membre exotique : crocs.',
});
const grenouille = npc('grenouille', {
  nom: 'La grenouille Gojgat', source: 'Familier (Gojgat puni par Mammon)', type: 'familier',
  car: car('1 4 3 3 2 3'), def: L(3), pp: 6, pfFix: 4, seuilsFix: seuils('2/5/7/10'),
  armes: [poing(2)],
  pouvoirs: pows('Anaérobiose, Caméléon 1, Contrôle des animaux 1, Vol 1'),
  talents: 'Acrobatie 3, Aisance sociale 3, Athlétisme 2, Baratin 3, Culture générale 1 (économie 3), Corps à corps 2, Défense 3, Discrétion 3, Survie 1 (étangs 3), Mal digérer 4',
  notes: 'Si Yukie 3 est sur orbite, Ouikka présente cette grosse grenouille : le PJ le moins efficace ou le plus corrompu voit tous les PA gagnés dans la mission convertis en acquisition de ce familier.\nAucune attaque dans le livre : coup (langue, pattes) traité comme un coup de poing niveau 2 (Corps à corps 2).',
});
const ouikka = npc('ouikka', {
  nom: 'Ouikka (avatar)', source: 'Prince-démon des terroristes, sous l\'apparence d\'un enfant de huit ans', type: 'demon', car: car('1 2 2 2 2 2'),
  notes: `Reçoit les PJ au débriefing, dans un temple bouddhiste réaménagé en mosquée. Il joue les naïfs, exige qu'ils dévoilent leur aura, et pousse chacun à dénoncer les autres. L'attaquer est suicidaire : il se téléporte et le temple explose une seconde plus tard.\n${SANS}`,
});

// ---------------- Anges ----------------
const trondin = npc('trondin', {
  nom: 'Lieutenant Trondin', source: 'Ange de Laurent, grade 1 (exterminateur sous couverture militaire)', type: 'ange',
  car: car('4 4 3 3 4 3'), def: L(5), pp: 16, pfFix: 7, seuilsFix: seuils('7/14/21/28'),
  armes: [livre('Épée bénie mineure', 7, 2, 4, true), livre('Famas', 5, -2, 5, false), poing(4)],
  pouvoirs: pows('Esquive acrobatique 1, Juste-lame 2, Vol 1'),
  talents: 'Acrobatie 4, Athlétisme 5, Baratin 2, Corps à corps 4, Combat 3 (épée 7), Conduite 2, Défense 5, Discrétion 4, Intimidation 5, Hobby (parachutisme) 4, Savoir militaire 3, Survie 3, Séduction 3, Tir 3 (armes automatiques 5), Parler rarement 6, Épée bénie mineure (objet)',
  notes: 'Taiseux, se voit en héros du film. Ne rêve que d\'exterminer la racaille démoniaque mais attend le feu vert de Dupont ; il compte laisser ensuite les humains s\'entretuer. Il peut aller jusqu\'à séduire Annette pour l\'approcher, et les PJ peuvent même le manipuler pour qu\'il joue le prince charmant à leur place.\nN\'utilise ses pouvoirs que si les démons ont commencé (sauf devant des témoins qu\'il compte éliminer).',
});
const dupont = npc('dupont', {
  nom: 'Capitaine Dupont', source: 'Ange de Laurent, grade 1 (chef du détachement de paras)', type: 'ange',
  car: car('4 4 3 3 3 3'), def: L(4), pp: 17, pfFix: 7, seuilsFix: seuils('7/14/21/28'),
  armes: [livre('Épée bénie mineure', 7, 2, 4, true), livre('Famas', 5, -2, 5, false), poing(3)],
  pouvoirs: pows('Armure corporelle 1, Juste-lame 2, Vol 1'),
  talents: 'Acrobatie 4, Athlétisme 5, Baratin 3, Corps à corps 3, Combat 3 (épée 7), Conduite 2, Défense 4, Discrétion 4, Discussion 3, Intimidation 5, Hobby (parachutisme) 4, Savoir militaire 3 (tactique 5), Survie 3, Tir 3 (armes automatiques 5), Vouloir négocier 4, Épée bénie mineure (objet)',
  notes: 'La mission avant tout : il adore discuter avec le camp d\'en face avant de se battre et préfère prêcher la bonne parole. C\'est lui qui ouvre les négociations entre les minutes 8 et 10 ; en cas de succès au lancement, il peut aller jusqu\'à embrasser un démon.',
});
const moustache = npc('moustache', {
  nom: 'Colonel Louis Moustache', source: 'Ange de Joseph, grade 1 (haut gradé de l\'armée, chef de la cellule angélique du 9-7)', type: 'ange',
  car: car('4 2 3 4 2 5'), def: L(3), pp: 19, pfFix: 8, seuilsFix: seuils('7/14/21/28'),
  armes: [livre('Gros calibre', 3, -2, 4, false), livre('Jet d\'eau bénite', 2, 2, 5, false), poing(3)],
  pouvoirs: pows('Détection du mensonge 2, Invisibilité 1, Jet d\'eau bénite 1+, Psychométrie 2, Torture 3'),
  talents: 'Aisance sociale 3, Athlétisme 3, Baratin 4, Corps à corps 3, Combat 3, Conduite 2, Défense 3, Discussion 4, Discrétion 3, Enquête 4+, Fouille 3, Savoir militaire 2 (« guerre totale » 4), Survie 2 (jungle 3), Torture 7, Tir 2 (armes de poing 3), Se lisser la moustache 5',
  notes: 'Barbouze plus qu\'ange ; autorité sur le régiment de paras, excellentes relations avec la préfecture et la gendarmerie. Arrive à la minute 19 + 2 ; deux heures plus tard, Gojgat lui fait parvenir le dossier Têtard du Cosmos. S\'il tient Shaksaya, il le fait parler (Torture) vers la minute 181, puis ordonne à Dupont et Trondin d\'éliminer Annette en priorité.\nJet d\'eau bénite : niveau d\'attaque pris sur Tir 2 (non précisé dans le livre), précision +2, puissance +5 du livre.',
});

// ---------------- Humains ----------------
const mariemadeleine = npc('marie-madeleine', {
  nom: '« Marie-Madeleine »', source: 'Ingénieur du CoC, serviteur de Dieu infiltré', type: 'serviteur',
  car: car('2 3 3 2+ 2 2+'), def: L(2), pp: 6, pfFix: 4, seuilsFix: seuils('3/6/9/12'),
  armes: [poing(2)],
  talents: 'Acrobatie 2, Aisance sociale 2, Corps à corps 2, Discrétion 2, Enquête 2, Fouille 2, Intrusion 2, Informatique 3',
  notes: 'Surnommé ainsi parce qu\'il cherche ostensiblement à convertir ses collègues. A repéré les terroristes une heure avant et prévenu les anges ; quand il entend son surnom au haut-parleur (minute 4), il file en douce. Si les PJ contrôlent les accès, ils peuvent l\'attraper : il ne sait que ce qui se passera entre les minutes 5 et 7 (l\'arrivée des anges).\nLe livre ne le chiffre pas : profil « serviteur de Dieu typique » du livre de base (p. 88), Informatique estimée.',
});
const geogie = npc('geogie', {
  nom: 'Geogie Pepelkuet', source: 'Directrice de la mission Nanane 5', car: car('2 2 2 3 2+ 2'),
  talents: 'Aisance sociale 3 (estimé), Technique 3 (estimé)',
  notes: `Petite brune impeccable qui dirige le CoC d'une main de fer ; elle prend d'abord les faux agents de la DST pour des subalternes. Les catastrophes la font craquer peu à peu, jusqu'à s'en remettre totalement aux PJ s'ils se montrent « les hommes de la situation ». Elle peut leur donner l'adresse d'Annette et, en cas de réussite, leur propose un rendez-vous à la minute 800. S'ils se sont mis le personnel à dos, elle se tourne vers Dupont et Trondin.\n${SANS} Talents estimés.`,
});
const marcsoin = npc('marcsoin', {
  nom: 'Marcsoin Debonnaire', source: 'Responsable de la sécurité de Nanane Espace', car: car('3 2 2 2 2 2'),
  notes: `Grand métis baraqué, aux petits soins pour Geogie, méprisant avec les autres, totalement dépassé, mais prompt à s'attribuer les idées d'autrui. Sous pression, il appelle le centre de sécurité pour prouver que tout va bien (réponse : « RAS »).\n${SANS}`,
});
const podzeron = npc('podzeron', {
  nom: 'Herbert Podzeron', source: 'Ingénieur maintenance réseau de Nanane Espace',
  notes: `A l'air à moitié hébété : il prétend maîtriser la situation mais avoue vite qu'il ne comprend rien. C'est sa stagiaire Annette Ferrojite qui a refait toute l'architecture du réseau pendant qu'il jouait au golf, et il l'a virée la semaine dernière. Ses excuses minables pourraient déclencher une crise de Grax.\n${SANS}`,
});

const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  scene('prologue', '0. Prologue (pour le MJ)', 'New York, suite de luxe ; puis le 114 allée des Groseilles',
    `À lire ou à jouer pour planter le décor, sans les PJ.
Gojgat, démon de Mammon, spécule sur l'aérospatial : il mise tout sur un concurrent de Nanane Espace en attendant une catastrophe au prochain lancement. Mammon le surprend, flaire la combine et réclame sa part (66,6 % du chiffre d'affaires). Il refuse d'avoir l'air d'y tremper mais lui donne l'adresse du contact de la mission officielle qu'il vient d'envoyer à Kurukuku.
Gojgat se rend au 114 allée des Groseilles, polymorphé en femme, et corrompt le démon de combat qui lui ouvre avec un pot de sucettes. On entend des hurlements dans le bureau.`),
  scene('briefing', '1. Requiem pour un non-briefing', '114 allée des Groseilles (pavillon dans un quartier résidentiel désert)',
    `Chaque PJ reçoit un ordre de mission officiel, apporté par un livreur cul-de-jatte de Spaza' Trente (il surgit de la rue, du sol ou de sous le lit : témoins humains à faire disparaître). Ordre : contacter au plus vite le démon Ujkze au 114 allée des Groseilles.
Par la fenêtre : un démon de combat à grandes cornes fait les cent pas, un pot de sucettes Chubie Chuba à la main. Il ouvre si on sonne, cache maladroitement le pot dans son dos, transpire la culpabilité, et affirme qu'Ujkze est sorti.
Miju a l'esprit d'un enfant de huit ans : en le cuisinant gentiment, il avoue tout. Une « Nicole Kidman » est passée le matin et lui a offert les sucettes pour éliminer Ujkze et faire disparaître ses dossiers (Corruption de Mammon). Ujkze a fait PLOP ; les dossiers sont dans la grande poubelle de dehors… et les PJ se souviennent avoir croisé le camion des éboueurs en arrivant.
Menacer Miju ou le frapper le met dans une colère noire.`,
    [inScene(miju)], true,
    [choice('miju', 'Comment les PJ font-ils parler Miju ?', [
      ['En douceur (flatterie, sucettes, ruse)', 'Il raconte la visite de « Nicole Kidman », la mort d\'Ujkze et la poubelle.'],
      ['Par la menace ou les coups', 'Miju se fâche tout rouge : combat contre un démon de combat. Les dossiers restent à retrouver seuls.'],
    ])]),
  scene('camion', '2. La chasse au camion-poubelle', 'Rues du chef-lieu, camion des éboueurs',
    `Seule solution : rattraper et détourner le camion, puis plonger les mains dedans. Le fouiller sur la voie publique attire l'attention des humains et entraîne des complications en chaîne ; un peu de professionnalisme est attendu.
Une fouille minutieuse rapporte : fausses cartes de la DST et faux passeports aux noms bidon mais avec les photos des couvertures des PJ, accréditations pour la base spatiale de Kurukuku (Guyane), billets pour le prochain vol.
Option (pour ne pas jouer en mode « demi-dieu ») : un dossier technique avec l'objectif. Plans du lanceur Nanane 5 et des satellites de télécommunication, dont Yukie 3 (norvégien), trafiqué pour offrir aux sbires d'Ouikka des canaux de fréquences sécurisés contre les anges : opération « Têtard du Cosmos ». Les PJ doivent s'assurer que Yukie 3 soit bien mis en orbite, car une tentative de détournement de Nanane 5 au décollage est redoutée.
Le décollage a lieu dans douze heures, à peu près le temps du voyage.`, [], false,
    [choice('fouille', 'Où les PJ fouillent-ils le camion ?', [
      ['À l\'abri des regards', 'Ils récupèrent tout tranquillement.'],
      ['En pleine rue', 'Témoins, police, presse locale : complications en chaîne, au MJ de broder.'],
    ])]),
  scene('base', '3. Le 9-7 et sa base spatiale', 'Kurukuku (Guyane), base de Nanane Espace, centre de commandement (CoC)',
    `Pas de tourisme : taxi, puis la base. Grâce aux accréditations, les PJ passent six check-points en jeep jusqu'au CoC. La base comprend la rampe d'assemblage (BIF), le stockage des satellites (BAF), le pas de tir (Truz), la R&D (RuD) et le centre logistique (LOG), plein de produits chimiques prêts à sauter.
Dans la tour de contrôle : 150 ingénieurs en open space devant les écrans, la rampe derrière les baies vitrées. Au-dessus, dans le sas de coordination, quatre coordinateurs, les douze directeurs techniques des satellites, la directrice Geogie Pepelkuet et le chef de la sécurité Marcsoin Debonnaire. Le personnel fait de la figuration (« Hourra ! », « Mon Dieu ! »).
Ce que personne ne sait : douze jeunes créoles de la branche locale de la cellule terroriste ont infiltré le centre de sécurité du CoC avec de faux badges ; ils contrôlent les portes et la vidéosurveillance.
Pendant que Marcsoin vient s'enquérir de la visite de la DST, le haut-parleur égrène la procédure de mise à feu, à imiter au micro. Les PJ ont environ deux minutes : sous pression, Marcsoin appelle le centre de sécurité, qui répond que tout va bien… en jurant sur la Mecque.`,
    [inScene(geogie), inScene(marcsoin)]),
  scene('detournement', '4. Détournement de Nanane', 'Tour de contrôle du CoC : sas de coordination, coursives, centre de sécurité',
    `Les terroristes : deux au centre de sécurité, six par équipes de deux contre les trois accès de la tour (ils abattent les agents de sécurité à l'Uzi silencieux), quatre qui font irruption dans le sas.
Si les PJ ne font rien en deux minutes : les quatre déboulent, tout le monde se jette au sol (Marcsoin en profite pour plaquer Geogie… par la poitrine), ils tirent sur les terminaux et la mission est fichue.
S'ils réagissent à temps : ils nettoient les coursives, grimpent par une échelle externe au centre de sécurité, etc. Toute idée, même fumeuse, doit marcher : ce ne sont que des humains et les PJ doivent se sentir puissants. Nanane 5 décolle, les terroristes sont maîtrisés.
Pendant la lutte, un terminal du sas surnommé « Robert Mitchum » plante ; on passe en manuel. Un PJ resté dans le sas voit un directeur technique en profiter pour brancher une clé USB dans un autre ordinateur. Geogie appelle le centre de télémesure de Toulouse : « Toulouse, nous avons un problème. »
Présents mais non combattants : Geogie, Marcsoin, le personnel du sas (otages potentiels). Les autres terroristes (2 au centre de sécurité, 6 aux accès) peuvent être ajoutés.`,
    [inScene(terroristes, { qty: 4 })], true,
    [choice('deux-minutes', 'Les PJ réagissent-ils dans les deux minutes ?', [
      ['Oui', 'Terroristes maîtrisés, Nanane 5 décolle ; Robert Mitchum plante et un directeur glisse une clé USB.'],
      ['Non', 'Les terroristes détruisent les terminaux : la mission de lancement est perdue.'],
    ])]),
  scene('shaksaya', '5. Dix-huit minutes : le Norvégien', 'Sas de coordination, puis les toilettes du CoC',
    `Au ralenti : le directeur à la clé USB est Andrej Belowahf, chef de projet norvégien de Yukie 3, en réalité Shaksaya, démon de Vapula de l'équipe qui a trafiqué le satellite. Corrompu par Gojgat, il sabote sa propre mission. Robert Mitchum n'était qu'une diversion (Poltergeist). La clé envoie un signal au réseau du CoC ; une stagiaire a piégé l'architecture du réseau pour déclencher le « grand bug » dès réception du signal, dix-huit minutes plus tard, au largage des satellites.
Minute 1 : panique. Un PJ qui l'a vu faire, ou qui a Perception supérieure à 3, remarque le Norvégien qui file vers la porte.
Interrogatoire aux toilettes : il se débat, se rend, essaie de tenir dix-huit minutes. Il finit par lâcher : « Tom Cruise » lui a donné 100 000 $ et la clé il y a deux jours ; il propose l'argent contre sa liberté. Avec Rêve, on trouve le nom de Gojgat (Mammon), avec qui il fait la fête de temps à autre.
Minute 3 : Geogie remotive ses troupes, Nanane 5 est sur la bonne trajectoire.
Minute 4 : au haut-parleur, « Marie-Madeleine est demandée à son poste ». Cet ingénieur prosélyte, serviteur de Dieu infiltré, a prévenu les anges et s'éclipse : on peut l'attraper si on contrôle les accès.`,
    [inScene(shaksaya), inScene(mariemadeleine)], true,
    [choice('shaksaya', 'Que font les PJ de Shaksaya ?', [
      ['Ils le gardent sous la main', 'Il reste un levier (ses 100 000 $) mais ne doit surtout pas tomber aux mains des anges.'],
      ['Ils le laissent filer contre l\'argent', 'Les 100 000 $ changent de mains ; il peut être capturé plus tard par Moustache.'],
      ['Ils le détruisent', '-1 PA au débriefing.'],
      ['Les anges le capturent', 'Ils le font parler : sous Torture, le projet Têtard du Cosmos est révélé (vers la minute 181).'],
    ])]),
  scene('paras', '6. Minutes 5 à 10 : la cavalerie', 'CoC encerclé : check-points, toit, centre de sécurité, tour de contrôle',
    `Minute 5 : rafales à l'extérieur, Debonnaire (ou son adjoint) hurle des ordres sans rien comprendre.
Minutes 5 à 7 : vingt parachutistes donnent l'assaut avec le feu vert de la Défense (alerte terroriste). Dix encerclent les check-points, huit sautent sur le toit, deux ratent leur atterrissage. Ils tirent sur la sécurité si elle ne se rend pas ; si les PJ ne font rien, elle se rend à la minute 7 avec deux blessés graves.
Si les PJ s'en mêlent : prendre le commandement de la sécurité par radio (jet d'opposition tactique contre le capitaine : réussite, la sécurité se retranche dans le CoC ; échec, deux morts et douze blessés graves) et tenir le centre de sécurité, qui commande les portes.
Avec les paras : le capitaine Dupont et le lieutenant Trondin, anges de Laurent sous couverture, qui s'attendent à une présence démoniaque. Six paras tiennent le toit pendant que les anges foncent au centre de sécurité. Ils n'emploient leurs pouvoirs qu'après les démons (« c'est toi qui as commencé ») ; témoins humains de la sécu : à éliminer. L'idée : les forcer à se retrancher dans la tour. Si la résistance est trop forte, les anges se replient sur le toit avec les paras ; une grenade « salvatrice » enverra ensuite les témoins au paradis.
Minute 8 : Robert Mitchum redémarre.
Minutes 8 à 10 : trois cas (PJ retranchés dans la tour ; PJ maîtres du CoC et anges sur le toit ; bagarre générale sur le toit). Dans tous les cas Dupont ouvre la négociation. En jouant fin, les PJ comprennent que Notre-Dame a infiltré la Défense, donc Nanane Espace, et qu'un échec serait sans doute le dernier lancement d'une entreprise au bord de la faillite. Les anges sont là pour protéger les intérêts franco-européens… tant qu'ils ignorent Têtard du Cosmos. Shaksaya ne doit pas tomber entre leurs mains.
Dehors, l'armée est prête à l'assaut et le personnel ne restera pas longtemps derrière les PJ. Arrangez-vous pour qu'au moins un PJ soit encore dans le CoC à la minute 19.
Non-combattants présents : Geogie, Marcsoin, le personnel (à protéger ou à prendre en otage).`,
    [inScene(paras, { qty: 6 }), inScene(dupont), inScene(trondin)], true,
    [choice('treve', 'Comment se terminent les négociations avec Dupont ?', [
      ['Trêve', 'Les anges attendent la mise en orbite pour régler leurs comptes dans la jungle ; ils accompagnent les PJ et fouinent partout.'],
      ['Guerre', 'Les PJ doivent quitter une base encerclée ; les anges retrouvent seuls la piste d\'Annette et débarquent chez elle.'],
      ['Les anges apprennent Têtard du Cosmos', 'Ils sabotent l\'alimentation et le groupe de secours : mission ratée, « attentat terroriste » à la une.'],
    ])]),
  scene('bug', '7. Le grand bug de la minute dix-neuf', 'Tour de contrôle du CoC',
    `Ambiance téléfilm catastrophe. Orbite de transfert atteinte, séparation réussie : « Hourra ! » général (Dupont, s'il est là, embrasse un démon). Trois secondes plus tard, tout le réseau de la tour plante.
Coup de fil d'Okinawa : Yukie 3 n'a pas lancé son logiciel de vol automatique. Tant que le réseau est en panne, rien ne peut être transmis : le satellite ne déploie pas son générateur solaire et, dans 799 minutes, il sera à court d'énergie et fondra comme une aspirine.
Geogie convoque l'ingénieur réseau Herbert Podzeron, à moitié hébété, qui finit par avouer : c'est sa stagiaire, Mlle Annette Ferrojite, qui a refait toute l'architecture il y a trois mois pendant qu'il jouait au golf, et il l'a renvoyée la semaine dernière. Personne sur place ne sait réparer.
Un PJ avec Informatique supérieure à 3 voit qu'il s'agit d'un sabotage de petit génie : il pourrait relancer le réseau, mais en des heures, voire des jours. Cas particuliers : s'il s'y est mis dès la clé USB, il voit le signal mais doit chercher des heures ; s'il fait 666, il comprend tout d'avance (le bug, le logiciel de vol, un saboteur aux capacités surhumaines) mais ne peut que couper le courant, et Nanane 5 file droit dans l'espace (échec ; bonus : une vidéo compromettante de Margaret Thatcher).`,
    [inScene(geogie), inScene(podzeron)], false,
    [choice('reseau', 'Comment les PJ réagissent-ils au bug ?', [
      ['Ils remontent la piste de la stagiaire', 'Direction Annette Ferrojite (scène suivante).'],
      ['Un PJ coupe l\'alimentation', 'Nanane 5 poursuit sa course : Yukie 3 est perdu.'],
    ])]),
  scene('ferrojite', '8. Ferrojite aiguë', 'CoC, bâtiments administratifs de la base',
    `Bilan : les terroristes ne savent rien (leur chef, corrompu, est au Soudan). Shaksaya a tout dit sauf qu'il a gardé 100 000 $ ; il ne parlera pas aux anges, mais leur chef, un expert de Joseph, peut le faire parler en trois heures s'il est capturé.
L'adresse d'Annette : Geogie la récupère et la donne aux PJ s'ils ont bien joué ; sinon il faut s'introduire dans l'administration et fouiller les fichiers du personnel. Si les PJ se sont mis le personnel à dos (menaces, refus de négocier, attitude bien peu DST), Geogie se tourne vers Dupont et Trondin.
Trêve : les anges veulent comprendre pourquoi les démons sauvent le lancement ; l'histoire d'un démon renégat qui aurait commandité l'attaque peut les convaincre. Ils accompagnent les PJ chez Annette.
Guerre : les PJ doivent quitter la base encerclée ; les anges apprennent l'adresse et arrivent chez Annette. Ils doivent gêner les PJ tout le long : évitez qu'ils meurent trop tôt.
Ce que révèle l'enquête : Grax, démon d'Haagenti et informaticien hors pair, a été recruté il y a trois mois par Gojgat pour piéger le réseau (plan A ; les terroristes ne servaient qu'à brouiller les pistes). Pour effacer ses traces, Gojgat l'a fait rendre fou par un démon d'Abalam : Grax se prend pour sa couverture humaine et ne se souvient de rien, mais il peut réparer le réseau en dix minutes.`, [], false),
  scene('annette', '9. Annette et la confiture de goyave', 'Appartement de 90 m² dans une résidence chic du quartier du Lac au Diable',
    `Annette vit le renvoi comme un échec cuisant et se gave de confiture de goyave devant les soaps depuis une semaine : l'appartement est jonché de pots vides. Fragile, elle croit les pires bobards. Elle refuse catégoriquement de revenir au centre, et ne croira jamais qu'on lui offre un emploi.
Si on la brusque, Grax prend le dessus, comme une possession : il frappe tout ce qui bouge et dévore tout. On peut la pousser à s'inscrire au Club Med ou à vendre son âme, mais pas la maltraiter.
Pouvoirs : Charme marche, mais parler de Nanane Espace déclenche Grax (qui s'en prend aux autres ou au mobilier) ; Possession est sans effet sur un démon ; Camisole la rend encore plus folle ; Corruption coûte au moins un million de dollars ; un Pari stupide (« pas cap' de réparer le réseau ») peut marcher.
La seule vraie solution : lui redonner confiance, être gentil (le pire des supplices pour un démon). Son complexe vient de Wilmid Cancan, l'amour de jeunesse qui l'a poussée à se jeter par la fenêtre : il faut jouer au prince charmant (dîner aux chandelles, limousine sur la côte, panne sèche dans la jungle). Le coup de maître : convaincre Trondin de faire le prince charmant à leur place. Attention avec Rêve, Lire les pensées ou Polymorphie (elle pense sans cesse à Wilmid) : un faux Wilmid qui disparaît faute de PP met Grax en rage. Plus elle reprend confiance, plus vite Grax s'énerve quand on la contrarie.
Si Grax est détruit, la mission est perdue.`,
    [inScene(grax)], true,
    [choice('annette', 'Comment les PJ convainquent-ils Annette ?', [
      ['Gentillesse et prince charmant', 'Elle reprend confiance et accepte de réparer le réseau.'],
      ['Charme, Pari stupide ou Corruption', 'Possible, à condition de ne pas évoquer Nanane Espace trop tôt (Corruption : un million de dollars).'],
      ['Menaces ou maltraitance', 'Crise de Grax : combat contre un démon d\'Haagenti affamé. Le nourrir d\'ange le calme.'],
      ['Grax est détruit', 'Le réseau ne sera pas réparé : Yukie 3 est perdu.'],
    ])]),
  scene('moustache', '10. L\'arrivée du colonel Moustache', 'Abords du centre spatial, domicile d\'Annette, partout où sont les PJ',
    `Troisième ange de la cellule du 9-7 : le colonel Louis Moustache (Joseph), sous couverture de haut gradé, qui commande le régiment de paras et a l'oreille de la préfecture et de la gendarmerie. Les trois anges sont de grade 1, mais ils se réfèrent à leurs grades militaires : Moustache a autorité morale sur les deux autres.
Il arrive à la minute 19 + 2 et prend en main le bataillon autour du centre. Deux heures plus tard, un admirateur anonyme (Gojgat) lui envoie le dossier Têtard du Cosmos. Méfiant (intox démoniaque ?), il enquête minutieusement.
Si Shaksaya est aux mains de l'armée, Moustache le fait parler vers la minute 181 (Torture) : convaincu, il ordonne à Dupont et Trondin d'éliminer Annette en priorité, puis les démons s'ils ont le temps. Avec finesse… autant que possible : Trondin propose par exemple de séduire Annette pour se retrouver seul avec elle.
Sinon, Moustache cherche à capturer Shaksaya, ou rejoint ses acolytes pour capturer un PJ en douce et le faire parler. Les PJ n'ont alors qu'une marge très réduite pour faire croire qu'ils réparent juste les bêtises d'un collègue et que Yukie 3 est un banal satellite.`,
    [inScene(moustache), inScene(dupont), inScene(trondin)], true,
    [choice('moustache', 'Moustache découvre-t-il la vérité sur Têtard du Cosmos ?', [
      ['Oui (Shaksaya ou un PJ a parlé)', 'Les anges cherchent à tuer Annette en priorité.'],
      ['Non, les PJ le bluffent', 'Les anges restent méfiants mais ne visent pas Annette.'],
      ['Les anges sont détruits', '+1 PA par ange exterminé ; l\'entrée au CoC devient facile.'],
    ])]),
  scene('gojgat', '11. Gojgat entre en scène', 'Rendez-vous « neutre » choisi par Gojgat',
    `Gojgat roule pour lui : beaucoup d'argent, donc de puissance, et des « super plans » à vendre à ses supérieurs. Certains PJ pourraient s'y retrouver. Il suit l'opération de loin grâce à des employés de Kurukuku, Toulouse et Okinawa, et croit Grax hors d'état de nuire. Il espère que Moustache les gênera, voire les renverra en Enfer.
Plutôt que de corrompre les anges, il tente sa chance sur un PJ. Au téléphone, il se présente comme Abu Al Bawr, n° 3 de la cellule terroriste, parle en démoniaque et promet des informations sur Têtard du Cosmos. Il vient seul, polymorphé en barbu, mais il a corrompu le préfet : si les PJ appellent les forces de l'ordre pour arrêter un terroriste, la gendarmerie déclenche le plan « Pépépervier » et tente de les arrêter pour usurpation de fonction.
Au rendez-vous, il fait profil bas, flatte les PJ, et leur propose un compte en Suisse garni d'un million de dollars pour qu'ils laissent tomber Yukie 3. Corruption visera un seul PJ, de préférence le « butor » ; un PJ joué « loyauté sans faille » est incorruptible. Dans tous les cas, les PJ repartent avec un crédit d'un million (condition de son pouvoir). En cas de grabuge, Gojgat se téléporte.
S'il a corrompu un PJ sans être attaqué, il lui dévoile le projet Grenouille du sub-espace, sur place ou plus tard au téléphone.`,
    [inScene(gojgat)], true,
    [choice('gojgat', 'Comment se passe le rendez-vous avec Gojgat ?', [
      ['Un PJ est corrompu', 'Il touche le million (que Ouikka saisira) et apprend le projet Grenouille du sub-espace ; +1 PA par PJ corrompu et dénoncé au débriefing.'],
      ['Les PJ refusent ou le démasquent', '+3 PA si Gojgat est démasqué devant Ouikka.'],
      ['Les PJ l\'attaquent', 'Gojgat se téléporte ; le compte suisse reste crédité.'],
      ['Les PJ appellent la police', 'Plan Pépépervier : la gendarmerie tente de les arrêter.'],
    ])]),
  scene('retour', '12. Annette et les moustachus : retour au CoC', 'Check-points et tour de contrôle de Nanane Espace',
    `À un moment, la nature démoniaque d'Annette la fait pencher vers les PJ (par exemple si on donne un ange à manger à Grax en pleine crise).
Entrer au CoC avec elle : facile si les trois anges sont détruits, ou s'ils vivent sans connaître Têtard du Cosmos (les paras laissent passer les agents de la DST attendus par Geogie ; les anges proposent un règlement de comptes à l'ancienne ensuite). Sinon, il faut s'infiltrer.
Pendant qu'Annette répare le réseau, éviter toute crise de Grax (par exemple si Podzeron vient s'excuser).
Minute 800 : « Oh mon Dieu » ou « Hourra », selon que le générateur solaire de Yukie 3 se déploie ou non. En cas de succès, Geogie propose un rendez-vous à un PJ.
À cette même minute, chaque PJ reçoit par Chronopost un ordre de mission officiel et un billet pour Kuala Lumpur, avec ordre de ramener Grax, et Shaksaya s'il est encore dans les parages.`,
    [inScene(geogie), inScene(podzeron)], false,
    [choice('minute800', 'Yukie 3 déploie-t-il son générateur solaire à la minute 800 ?', [
      ['Oui', '« Hourra » : Yukie 3 est sur orbite (+6 PA).'],
      ['Non', '« Oh mon Dieu » : Yukie 3 est foutu (-6 PA).'],
    ])]),
  scene('debriefing', '13. Débriefing chez Ouikka', 'Kuala Lumpur : temple bouddhiste réaménagé en mosquée',
    `Ne pas venir, c'est devenir renégat. Un enfant de huit ans accueille les PJ ; c'est Ouikka, qui cache son aura mais exige qu'ils dévoilent la leur. Il fait semblant de les féliciter d'avoir voulu détourner Nanane 5 et leur propose un stage de pilotage d'Airbus.
Il veut leur faire croire qu'il les soupçonne : pourquoi ce compte d'un million en Suisse ? (Le compte a été récupéré pour le budget « Bagdad 2005 » : les PJ ne verront jamais l'argent.) Il attend que chacun dénonce les autres (Shaksaya, le PJ corrompu…). Ceux qui jouent les fortes têtes gagnent la limitation « bombe humaine » de la table d'Ouikka, en fait une bonne impression : il les garde sous le coude (éviter les transports en commun quelque temps).
Sentence selon le résultat :
• Yukie 3 irrécupérable : Ouikka présente Gojgat, créatif de Mammon venu lui vendre le projet Grenouille du sub-espace pour rattraper le coup. Les PJ perdent des PA. Ouikka n'est pas dupe mais apprécie l'initiative : Gojgat reviendra, plus riche encore.
• Yukie 3 sur orbite : stage d'une semaine en Afghanistan. Ouikka présente une grosse grenouille nommée Gojgat (Mammon l'a puni pour lui apprendre l'humilité) : le PJ le moins efficace ou le plus corrompu voit ses PA de la mission convertis en acquisition de ce familier, et doit veiller sur Annette jusqu'à ce que Grax retrouve ses esprits.
• Grand Jeu non respecté (ou attaque contre l'avatar d'Ouikka) : accident d'avion au retour, réincarnation en grosses grenouilles guyanaises chargées de détraquer l'écosystème de leur étang (ou explosion du temple une seconde après la téléportation du prince).
Résultat de la mission : par ange exterminé +1 PA ; Yukie 3 sur orbite +6 PA ; Gojgat démasqué +3 PA ; Shaksaya détruit -1 PA ; Yukie 3 foutu -6 PA ; par PJ corrompu et dénoncé +1 PA.`,
    [inScene(ouikka), inScene(grenouille)], false,
    [choice('sentence', 'Quelle est la sentence d\'Ouikka ?', [
      ['Yukie 3 sur orbite', 'Stage en Afghanistan ; le PJ le moins efficace hérite de la grenouille Gojgat et de la garde d\'Annette.'],
      ['Yukie 3 irrécupérable', 'Perte de PA ; Gojgat vend son projet Grenouille du sub-espace et devient un PNJ récurrent.'],
      ['Grand Jeu non respecté ou prince attaqué', 'Mort des PJ et réincarnation en grenouilles guyanaises.'],
    ])]),
];

const scenario = {
  id: 'ag7-dollars-eau-fraiche',
  nom: 'Angelots en gelée – De dollars et d\'eau fraîche',
  resume: 'Scénario d\'In Nomine Satanis parodique (« Space Devils »), en une grosse séance, pour 3 à 5 démons de grade 0 ou bas grade 1 (100-120 PA chacun). En mission officielle, les PJ doivent garantir la mise en orbite de Yukie 3, un satellite trafiqué pour Ouikka (projet « Têtard du Cosmos »), lancé par Nanane 5 depuis la base guyanaise de Kurukuku. Après un contact assassiné et une fouille de camion-poubelle, ils affrontent en temps réel des apprentis terroristes, un démon de Vapula corrompu, des parachutistes menés par des anges de Laurent, puis un bug informatique que seule une stagiaire possédée par un démon d\'Haagenti peut réparer. Derrière tout cela : Gojgat, démon de Mammon, qui spécule en bourse sur la catastrophe.',
  notes: `Source : ${REF}.
Pages : imprimées 98-109 = PDF 97-108 (scan en bandes inversées). Pour 3 à 5 démons à 100-120 PA ; pour des PJ plus puissants, gonfler les PNJ.

Histoire secrète (annexe, résumé) : Yukie 3, satellite de télécommunication norvégien, a été modifié par Shaksaya (Vapula) pour offrir aux réseaux d'Ouikka des fréquences protégées des anges : d'abord pour des terroristes humains, puis pour tout le réseau démoniaque (projet Têtard du Cosmos). Gojgat, démon de Mammon de grade 1, l'a appris en graissant la patte de Shaksaya. Il préparait déjà le sabotage d'un lancement de Nanane 5, financé par un concurrent humain : un échec ruinerait l'aérospatiale franco-européenne et l'influence de Notre-Dame sur le secteur. Il a avancé l'opération pour ensuite vendre à Ouikka son projet « Grenouille du sub-espace ». Mammon, qui a senti la spéculation, laisse faire mais ne veut pas y être mêlé : il envoie une mission officielle (les PJ) pour « vérifier les rumeurs d'attentat », prévient Ouikka par Baalberith, et donne à Gojgat l'adresse du contact des PJ.
Les complices de Gojgat : Miju (démon de combat, corrompu avec des sucettes, tue le contact Ujkze), Shaksaya (100 000 $ et une clé USB), Grax alias Annette Ferrojite (démon d'Haagenti infiltré comme stagiaire, qui a piégé le réseau, puis rendu fou par un démon d'Abalam), le chef de la cellule terroriste (corrompu pour le « détournement »), le préfet (corrompu).
Les anges du 9-7 : capitaine Dupont et lieutenant Trondin (Laurent), colonel Moustache (Joseph). Ils protègent les intérêts franco-européens : alliés de fait tant qu'ils ignorent Têtard du Cosmos.
Chronologie : décollage, deux minutes pour réagir aux terroristes ; minutes 1 à 4 (Shaksaya, Marie-Madeleine) ; minutes 5 à 7 (paras et anges) ; minutes 8 à 10 (négociation) ; minute 19 (grand bug) ; minute 21 (arrivée de Moustache, dossier deux heures plus tard) ; minute 181 (Shaksaya torturé s'il est capturé) ; minute 800 (fin de l'énergie de Yukie 3, Chronopost pour Kuala Lumpur).
Récompenses (résultat de la mission) : par ange exterminé +1 PA ; Yukie 3 sur orbite +6 PA ; Gojgat démasqué +3 PA ; Shaksaya détruit -1 PA ; Yukie 3 foutu -6 PA ; par PJ corrompu et dénoncé +1 PA. Suite possible : Gojgat en PNJ récurrent.
Fiches : chiffres du livre pour les terroristes, les parachutistes (mêmes valeurs que le bestiaire des livres), Shaksaya, Trondin, Dupont, Moustache, Gojgat, la grenouille Gojgat et Grax. Miju (renvoi au livre de base) est estimé ; Marie-Madeleine reprend le serviteur de Dieu typique du livre de base ; Geogie, Marcsoin, Podzeron et Ouikka ont une fiche minimale.`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [terroristes, paras, miju, shaksaya, gojgat, grax, grenouille, ouikka, trondin, dupont, moustache, mariemadeleine, geogie, marcsoin, podzeron].map(asType);
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));
writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types');
