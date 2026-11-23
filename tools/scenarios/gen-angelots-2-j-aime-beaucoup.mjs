// Génère le fichier d'import « insmv-scenario » pour « J'aime beaucoup ce que vous faites ! » (Angelots en gelée, p. 26-34)
// usage : node gen-angelots-2-j-aime-beaucoup.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Angelots en gelée, « J\'aime beaucoup ce que vous faites ! », p. 26-34';
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
const P = 'ag2-'; let n = 0; const id = (k) => P + k;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [poing(1)], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});
const NOARM = 'Le livre ne donne pas de ligne d\'attaque : armes déduites des talents (Corps à corps, Combat, Tir).';

// ---------------- Démons de Mammon ----------------
const barakiel = npc('barakiel', {
  nom: 'Barakiel (Ludovic Laboutade)', source: 'Démon de Mammon, grade 1 – actuaire à la Scor', type: 'demon', car: car('2 3 2 3 3 4'), def: L(3),
  pp: 7, pfFix: 4, seuilsFix: seuils('4/8/12/16'),
  armes: [poing(1)],
  pouvoirs: pows('Corruption 3, Charme 2, Détection du mensonge 2'),
  talents: 'Métier (finance) 4, Discussion 4, Baratin 4, Intimidation 5, Défense 3, Séduction 4, Informatique 2, Aisance sociale 2',
  notes: `36 ans, brun. Le vrai manipulateur du scénario : meilleur commercial du Siège trois ans de suite, il se croit cette année parmi les derniers et dénonce son rival Chaldkydri à l'Église pour lui prendre son portefeuille de blanchiment. Il a payé Magnier (5 000 €, costume, portable) pour la fausse dénonciation et les trois gardes du corps de Maillet.\nAffable, serviable, refuse tout conflit : passe pour un brave type un peu con. S'amuse à pervertir sa famille (femme bigote, trois enfants) au lieu de s'en débarrasser.\nAucun talent de combat : coup de poing estimé au niveau 1. ${NOARM}`,
});
const bethor = npc('bethor', {
  nom: 'Bethor (Pamela Latouffe)', source: 'Familier de Barakiel – « secrétaire »', type: 'familier', car: car('4+ 3 4+ 2+ 3 2'), def: L(3),
  pp: 4, pfFix: 7, seuilsFix: seuils('6/12/18/24'),
  armes: [arme('Pistolet', 'Revolver petit calibre', 4), arme('Corps à corps', 'Coup de poing', 4), arme('Crocs', 'Morsure', 4)],
  pouvoirs: pows('Charme 1, Membre exotique : crocs'),
  talents: 'Métier (secrétariat) 4, Défense 3, Corps à corps 4, Tir 3 (armes de poing 4), Enquête 3, Intimidation 3, Discussion 4, Baratin 4, Séduction 3, Kama-sutra 3, Aisance sociale 4',
  notes: `21 ans d'apparence, grande blonde « bombasse » qui joue l'idiote pour passer inaperçue. Nettoyeuse de Barakiel : elle tue Magnier dès qu'il risque de parler (vertèbres brisées, corps déposé sur les voies du métro à Montreuil, ou plus tard sous la dalle de La Défense) et jette chaque fois son portable.\nArmes non données : pistolet choisi pour Tir (armes de poing 4), crocs rendus en morsure. ${NOARM}`,
});
const chaldkydri = npc('chaldkydri', {
  nom: 'Chaldkydri (Sébastien Maillet)', source: 'Démon de Mammon, grade 1 – courtier chez BNP Paribas', type: 'demon', car: car('3 3+ 3 2+ 4+ 3'), def: L(3),
  pp: 5, pfFix: 5, seuilsFix: seuils('5/10/15/20'),
  armes: [arme('Corps à corps', 'Coup de poing', 3), arme('Flingue sans permis', 'Revolver petit calibre', 1)],
  pouvoirs: pows('Corruption 2, Charme 1, Vitesse 1'),
  talents: 'Métier (finance) 4, Intimidation 3, Discussion 3, Aérobic 2, Danse 3, Défense 3, Corps à corps 3, Conduite 2, Informatique 2, Kama-sutra 3, Aisance sociale 3',
  notes: `29 ans, blond décoloré. Le démon dénoncé : bien un démon, mais victime du coup monté de Barakiel. Trader immonde, arrogant et inculte ; seul compte pour lui son travail au Siège.\nDuplex rue Lamartine (9e) : dossiers, coke, flingue sans permis, DVD du « Gendarme ». Ne croit pas vraiment à la menace mais accepte les gardes du corps payés par Barakiel.\nPas de Tir : flingue estimé au niveau 1. ${NOARM}`,
});
const hilaire = npc('hilaire', {
  nom: 'Ergadi (Laurent Hilaire)', source: 'Démon de Mammon, grade 2 – chef des services « fiscaux » infernaux France-Benelux', type: 'demon', car: car('3 3 4+ 5 5 4'), def: L(4),
  pp: 17, pfFix: 8, seuilsFix: seuils('5/10/15/20'),
  armes: [poing(1)],
  pouvoirs: pows('Corruption 4, Champ de force 2, Vitesse 1, Détection des ennemis 2, Détection du danger 2'),
  talents: 'Métier (gestion) 6, Métier (management à la dure) 5, Torture 5, Discussion 3, Baratin 4, Intimidation 5, Savoir d\'espion 5, Défense 4, Discrétion 5, Informatique 4, Langues (anglais) 4',
  notes: `53 ans. Patron hystérique du Siège, obsédé par les chiffres et le jargon de gestion. Vit et travaille au Siège, n'en sort que pour les paradis fiscaux. L'affaire Maillet lui fait perdre de l'argent : c'est pour cela qu'il oblige Maillet à confier son portefeuille à Barakiel.\nPanic button : fait exploser les bonbonnes d'acide des ordinateurs et ordonne l'évacuation par une quinzaine de sorties.\nNom démoniaque partiellement lisible dans le scan (« …rgadi ») : « Ergadi » supposé. Aucun talent de combat : coup de poing estimé au niveau 1.`,
});
const uwula = npc('uwula', {
  nom: 'Uwula', source: 'Démon de combat de Baal, gardien du Siège', type: 'combat', car: car('4 4 2 1+ 1 2'), def: L(5),
  pp: 5, pfFix: 5, seuilsFix: seuils('8/16/24/32'),
  armes: [arme('Clé à molette de chantier (deux mains)', 'Masse d\'arme ou batte', 5), poing(3)],
  pouvoirs: pows('Armure corporelle 3, Forme de combat 4, Art de combat 2, Apparence horrifique 1'),
  talents: 'Métier (bricolage) 3, Combat 3 (armes à deux mains 5), Défense 5, Discrétion 1, Faire le café 2, Réparer l\'imprimante 2, Répondre au téléphone 3',
  notes: `S'ennuie au Siège à faire le café et les photocopies ; la moindre alerte le met en transe. Ordre : couvrir la fuite des démons et ne rien laisser aux anges, au péril de sa vie.\nClé à molette rendue en masse d'arme (−1/+2). ${NOARM}`,
});

// ---------------- Gardes du corps de Maillet ----------------
const galgalil = npc('galgalil', {
  nom: 'Galgalil (Pierre Terminet)', source: 'Démon de Baal, grade 1 – chauffeur de Maillet', type: 'demon', car: car('4 3 3 2 1 2'), def: L(4),
  pp: 4, pfFix: 6, seuilsFix: seuils('6/12/18/24'),
  armes: [arme('Garrot', 'Étranglement', '4+'), arme('Corps à corps', 'Coup de poing', 4), arme('Fusil', 'Carabine', 4)],
  pouvoirs: pows('Art de combat 2, Forme de combat 1, Vitesse 1, Membre blindé 1'),
  talents: 'Combat 3 (garrot 4+), Corps à corps 4, Défense 4, Discrétion 3, Aisance sociale 4, Rester propre et classe 3, Avoir l\'air de Lord Sinclair 3, Enquête 3, Tir 3 (armes d\'épaule 4), Athlétisme 4, Intimidation 3, Savoir militaire (embuscade 3)',
  notes: `42 ans, grand et émacié, très « classe » et ampoulé. Voit le meurtre comme un art ; aime le style et la mise en scène. Passe ses journées dans la voiture au parking à guetter les anges.\nGarrot rendu en étranglement, fusil en carabine. ${NOARM}`,
});
const gezuriah = npc('gezuriah', {
  nom: 'Gezuriah (Valérie Oukil)', source: 'Démone de Valefor, grade 1 – « coach personnel » de Maillet', type: 'demon', car: car('2 4+ 4+ 3 3+ 3'), def: L(3),
  pp: 6, pfFix: 5, seuilsFix: seuils('4/8/12/16'),
  armes: [arme('Corps à corps', 'Coup de poing', 3)],
  pouvoirs: pows('Déguisement superficiel 2, Ouverture 1, Obscurité 1, Charme 2'),
  talents: 'Discussion 4, Baratin 2, Métier (secrétariat) 4, Défense 3, Corps à corps 3, Discrétion 3, Culture générale 3 (vie à Paris 4), Aisance sociale 4',
  notes: `27 ans, brune. Escort-girl de l'Enfer, cultivée : vit chez Maillet, l'accompagne partout, répond au téléphone. Adore surprendre. ${NOARM}`,
});
const mordad = npc('mordad', {
  nom: 'Mordad (Véronique Houillière le Clouerec)', source: 'Démone de Baal, grade 2 – éclaireuse polymorphe', type: 'demon', car: car('3 4 4+ 2+ 2+ 2'), def: L(4),
  pp: 6, pfFix: 5, seuilsFix: seuils('5/10/15/20'),
  armes: [arme('Stylet', 'Poignard ou saï', 4), arme('Corps à corps', 'Coup de poing', 3)],
  pouvoirs: pows('Art de combat 2, Polymorphie 3, Invisibilité 1'),
  talents: 'Déguisement 4, Baratin 5, Discussion 2, Savoir militaire 2 (infiltration 4), Discrétion 3, Défense 4, Corps à corps 3, Combat 2 (stylet 4), Aisance sociale 3, Intimidation 2, Pickpocket 3, Enquête 2, Fouille 2',
  notes: `La plus subtile des trois : tourne autour de Maillet sous diverses identités (bigote qui prend le thé avec la concierge, stagiaire à l'accueil de la BNP, petit vieux qui sort son chien) pour repérer les anges, pas pour le protéger. Langage ordurier quand elle sort du rôle.\nStylet rendu en poignard. ${NOARM}`,
});

// ---------------- Humains ----------------
const magnier = npc('magnier', {
  nom: 'Gilles Magnier', source: 'Truand aux petits pieds, faux témoin', car: car('2 2 1 1+ 3 1'), def: L(2),
  pfFix: 3, seuilsFix: seuils('3/6/9/12'),
  armes: [poing(1)],
  talents: 'Séduction 3, Baratin 2, Loto 3, PMU 3, Tenir le comptoir avec le coude droit 2, Défense 2, Kama-sutra 2',
  notes: `28 ans. Gigolo fainéant recherché pour escroquerie, plusieurs faux papiers. Squatte à Montreuil chez une employée de banque ; l'adresse donnée au curé (17 rue Joubert) est fausse. Croit à un canular entre bourgeois. A rencontré Barakiel à La Baraque (11e), ignore son nom ; a le numéro de Pamela.\nCoup de poing estimé au niveau 1 (pas de talent de combat).`,
});
const mimpontel = npc('mimpontel', {
  nom: 'Père Patrick Mimpontel', source: 'Prêtre de Notre-Dame de Pentecôte (La Défense), « aware »', car: car('2 1+ 2 2+ 2+ 2'), def: L(1),
  pfFix: 4, seuilsFix: seuils('3/6/9/12'), armes: [],
  talents: 'Métier (prêtre catholique) 2, Savoir occulte 1 (Grand Jeu 2), Discussion 2, Métier (gestion) 2',
  notes: 'Curé vieille France qui conforte les cadres de La Défense dans leur capitalisme. Croit dur comme fer que Maillet est un démon et poussera les PJ à prendre l\'affaire au sérieux. C\'est par lui que passe le deuxième tuyau (la planque du Comptoir).\nDéfense non donnée.',
});
const defer = npc('defer', {
  nom: 'Pascal Defer', source: 'Propriétaire du Comptoir de la Main d\'Or (antiquités chinoises)', car: car('2 2 2 2+ 2+ 1'), def: L(1),
  pfFix: 4, seuilsFix: seuils('3/6/9/12'), armes: [],
  talents: 'Culture générale 2 (histoire de la Chine 3), Métier (antiquaire) 2, Discussion 2, Métier (trafic de drogue) 2',
  notes: '45 ans, homme de goût. Endetté auprès de Barakiel, il fait passer de l\'héroïne dans ses meubles chinois ; il a prêté le dernier niveau (l\'entrepôt) comme planque.\nDéfense non donnée.',
});
const bolot = npc('bolot', {
  nom: 'Françoise Bolot', source: 'Concierge de Maillet, rue Lamartine', car: car('1+ 1+ 3+ 1+ 1+ 1'), def: L(1),
  pfFix: 3, seuilsFix: seuils('2/5/7/10'), armes: [],
  talents: 'Métier (concierge) 2, Baratin 3, Discussion 1, Parler pour ne rien dire 2, Fouiller 2, Enquête 2, Faire courir des rumeurs 2',
  notes: '57 ans, harpie réactionnaire. Fait les courses et le ménage de Maillet, le déteste mais se tait (gros pourboires). A un double des clés, ne le donne qu\'à la « police ». Mordad, déguisée en bigote, l\'a convaincue de la prévenir dès qu\'on pose des questions sur un habitant.\nDéfense non donnée.',
});

const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  scene('briefing', '1. La routine, toujours la routine', 'Chez le chargé de mission des PJ – Paris',
    `Prologue possible : lire ou résumer la confession de Magnier au curé (un « démon » cornu crachant le feu rue de Provence, suivi jusqu'à sa boîte aux lettres).
Le supérieur convoque les PJ sans urgence, presque en s'excusant : une dénonciation enregistrée par un curé « aware » ; ce genre d'enquête tombe à l'eau 99 fois sur 100, mais il faut ménager le clergé.
Infos données : Sébastien Maillet (dénoncé, 9e), Gilles Magnier (délateur, 9e), le père Patrick Mimpontel (Notre-Dame de Pentecôte, La Défense). Mission : vérifier si Maillet est un démon, et si oui l'appréhender avec ses complices. Conseil appuyé : aller rassurer le curé.`),
  scene('mimpontel', '2. Notre-Dame de Pentecôte', 'Église de La Défense (« la dalle »)',
    `Église moderne d'une laideur remarquable, fréquentée par des cadres. Mimpontel, ravi qu'on le prenne au sérieux, raconte le témoignage : trois jours avant la confession, rue de Provence, des jeunes agressent un passant qui se transforme (cornes, feu, langue sulfureuse), tue l'un d'eux ; Magnier, caché dans une poubelle, le suit jusqu'à son immeuble et lit son nom sur la boîte aux lettres.
Indices : Magnier semblait mal à l'aise dans un costume trop grand, récitait une leçon, vocabulaire d'emprunt ; il a laissé un portable que le curé a rappelé le lendemain. Pour le prêtre, un pauvre garçon qui s'en sort par la foi.
Fausses pistes vérifiables : aucun PV, aucun cadavre brûlé, aucune trace rue de Provence (commissariat du 9e, hôpitaux, morgue) : il y a anguille sous roche.`,
    [inScene(mimpontel)]),
  scene('magnier', '3. Gilles Magnier', '17 rue Joubert (adresse bidon), puis Montreuil',
    `Personne ne connaît de Magnier à l'adresse donnée : il squatte à Montreuil chez une employée de banque. Le portable (dernier modèle, cadeau de Laboutade) répond : Magnier, surpris, rejoue mal son rôle de cadre dévot, ne peut justifier son adresse ni sa présence dans le 9e. Pris en défaut, il raccroche et jette le portable.
Il appelle alors Pamela, qui lui donne rendez-vous dans une station de métro de Montreuil et le tue dans la nuit (vertèbres brisées, corps sur les rails), puis jette son propre portable.
Si les PJ le localisent (relais GSM, si vous l'admettez) avant : chez sa logeuse ou dans ses bistrots. Il avoue tout : 5 000 €, costume Hugo Boss et portable pour un faux témoignage, demandé à La Baraque (11e) par un homme accompagné d'une blonde sublime ; il a le numéro de Pamela, ignore les noms.`,
    [inScene(magnier), inScene(bethor)], false,
    [choice('magnier', 'Comment les PJ abordent-ils Magnier ?', [
      ['Par téléphone, et il se trahit', 'Il raccroche, prévient Pamela et meurt dans la nuit à Montreuil : la piste humaine est coupée.'],
      ['Ils le retrouvent en personne avant Pamela', 'Il avoue le coup monté, décrit La Baraque et donne le numéro de Pamela.'],
      ['Ils le laissent tranquille', 'Il reste vivant : c\'est lui qui donnera plus tard la planque du Comptoir au curé.'],
    ])]),
  scene('pam', '4. Le bonheur, c\'est simple comme un coup de fil', 'Téléphone',
    `Si les PJ appellent Pamela avant que Magnier ne l'ait prévenue : elle devine qui appelle, joue l'amie effrayée et idiote, refuse de donner son nom, raccroche et jette le portable. Puis elle va voir Magnier, lui fait dire ce qu'il a raconté aux PJ et le tue pour couper toute piste vers elle et Laboutade.`,
    [inScene(bethor)]),
  scene('baraque', '5. La Baraque', 'Bar-resto-boîte branché, 11e',
    `Le personnel connaît bien Laboutade (pourboires princiers) et sa secrétaire, ainsi que Maillet, son « ami » : deux financiers en compétition permanente (salaires, voitures, conquêtes). Ils ne connaissent que le nom de Laboutade (vu sur sa carte de crédit platine), pas ses coordonnées.
Laboutade n'y remet plus les pieds : il sait que c'est une piste.`),
  scene('taniere', '6. La tanière du loup', 'Duplex rue Lamartine (9e), face à Notre-Dame-de-Lorette ; bureau rue de Provence',
    `Prévenu « en ami » par Laboutade, Maillet est surveillé par trois démons payés par Laboutade : leur mission est de repérer les anges, de leur faire peur et surtout de les empêcher de prendre Maillet la première fois.
• Galgalil : chauffeur, guette dans la voiture au parking.
• Gezuriah : « coach personnel », vit chez lui et le suit partout.
• Mordad : rôde autour sous diverses apparences pour repérer les anges ; tous les jours, en bigote, elle prend le thé avec la concierge, qui la prévient dès qu'on pose des questions.
Le duplex : digicode, interphone, concierge, porte blindée ; rien d'infernal à l'intérieur (dossiers, coke, flingue, DVD). Voisins : le détestent ; les Bigler, les plus anciens, se souviennent qu'il a changé après son accident de Porsche de 89 (plus épanoui, plus méchant).
Emploi du temps : 6 h lever et gym ; 7 h 30 voiture ; 8 h bureau rue de Provence ; 9 h–17 h salle des marchés ; 18 h retour ou réunion au « Siège » ; 22 h dîner branché ; minuit retour. Week-end : blanchiment, Siège, golf.
Confrontation : les gardes évacuent Maillet vers le Siège en lui prouvant que l'avertissement était fondé. Arrangez-vous, sans tricher, pour que Maillet s'enfuie avec au moins un démon et voie quelques beaux pouvoirs angéliques.`,
    [inScene(chaldkydri), inScene(galgalil), inScene(gezuriah), inScene(mordad), inScene(bolot)], true,
    [choice('fuite', 'Maillet échappe-t-il aux PJ lors de la première rencontre ?', [
      ['Oui, il fuit vers le Siège', 'Le plan de Laboutade marche : Hilaire oblige Maillet à lui confier son portefeuille et à se terrer au Comptoir de la Main d\'Or.'],
      ['Non, les PJ le capturent', 'Le plan échoue ; interrogé, Maillet peut livrer le Siège et accuser Laboutade (qu\'il soupçonne vite).'],
    ])]),
  scene('siege', '7. Le « Siège »', 'Locaux techniques sous les Galeries Lafayette (9e)',
    `Bureau secret de la dizaine de démons de Mammon qui blanchissent l'argent sale de Paris (apporté par Nisroch). Une centaine de m² de locaux techniques sordides, rayés des cadastres, une quinzaine d'accès (magasins, métro, égouts, RER, arrière-cours). Tout est crypté, presque sans papier ; peu protégé, la discrétion étant sa défense.
Hilaire y vit. Uwula, démon de combat, garde les lieux. Panic button : bonbonnes d'acide sur chaque PC et évacuation par des sorties différentes.
Après la fuite de Maillet : Laboutade vient expliquer que son « informateur chez les anges » avait raison, propose de gérer les affaires de Maillet pendant qu'il se cache ; Hilaire engueule Maillet et l'oblige à accepter. Si les PJ suivent Maillet jusqu'ici, ils peuvent démanteler le Siège.`,
    [inScene(hilaire), inScene(uwula), inScene(barakiel), inScene(chaldkydri)], true,
    [choice('siege', 'Les PJ trouvent-ils le Siège ?', [
      ['Oui et ils frappent vite', 'Démantèlement possible : réussite magistrale.'],
      ['Oui mais Hilaire déclenche le panic button', 'Ordinateurs détruits, démons dispersés ; Uwula couvre la fuite.'],
      ['Non', 'Le Siège continue ; seuls Maillet et ses gardes sont exposés.'],
    ])]),
  scene('tuyau', '8. Le deuxième tuyau', 'Notre-Dame de Pentecôte, La Défense',
    `Laboutade fait indiquer au curé la nouvelle planque. Si Magnier vit, c'est lui qui s'en charge (il prétend avoir suivi le démon jusqu'à un magasin d'antiquités chinoises du 11e) ; Pamela le tue ensuite discrètement dans un local technique sous la dalle. Sinon, Pamela se présente comme une amie de Magnier : bouleversé par sa découverte, il se serait suicidé, non sans lui avoir donné l'adresse. Si Magnier est mort trop tôt, elle invente une autre histoire crédible.
Indices pour des PJ attentifs : la même blonde, un témoin de nouveau éliminé, un tuyau trop commode.`,
    [inScene(mimpontel), inScene(bethor), inScene(magnier)], false,
    [choice('pamela', 'Les PJ font-ils le lien avec Pamela ?', [
      ['Oui', 'Ils peuvent la suivre ou l\'interroger et remonter jusqu\'à Laboutade.'],
      ['Non', 'Ils filent droit au Comptoir, comme prévu par Laboutade.'],
    ])]),
  scene('comptoir', '9. Le Comptoir de la Main d\'Or', 'Ancien atelier d\'ameublement au fond d\'une impasse, près de Bastille (11e)',
    `Trois niveaux peu défendables mais discrets : magasin et showroom ouverts au public, entrepôt au dernier niveau prêté par Pascal Defer, qui fait passer de l'héroïne dans ses meubles pour Laboutade. Maillet et ses trois gardes y vivent entassés et à cran.
Affrontement probable. Une fouille découvre l'héroïne et peut mener à Laboutade (créancier de Defer).`,
    [inScene(chaldkydri), inScene(galgalil), inScene(gezuriah), inScene(mordad), inScene(defer)], true),
  scene('conclusion', '10. Conclusion', 'Rapport à la hiérarchie',
    `Si les PJ suivent docilement le plan de Laboutade, ils ont « brillamment » réussi : quatre démons repérés et tués. S'ils ont vu clair, ils peuvent aussi appréhender Laboutade, voire démanteler le Siège : réussite magistrale et sérieux coup de pouce à leur carrière.`, [], false,
    [choice('fin', 'Quelle issue pour les PJ ?', [
      ['Plan de Laboutade suivi', 'Réussite officielle : Maillet et ses gardes éliminés, Laboutade récupère le portefeuille et reste premier.'],
      ['Laboutade démasqué', 'Réussite supplémentaire : le vrai manipulateur tombe.'],
      ['Siège démantelé', 'Réussite magistrale : coup dur pour les finances de l\'Enfer à Paris.'],
    ])]),
];

const scenario = {
  id: 'ag2-j-aime-beaucoup',
  nom: 'Angelots en gelée – J\'aime beaucoup ce que vous faites',
  resume: 'Scénario de Magna Veritas à Paris. Une dénonciation « de routine » envoie les anges des PJ enquêter sur Sébastien Maillet, trader soupçonné d\'être un démon. Il en est bien un, mais la dénonciation est un coup monté par son rival Barakiel (Ludovic Laboutade), démon de Mammon qui veut lui voler son portefeuille de blanchiment au « Siège », la cellule financière infernale cachée sous les Galeries Lafayette. Les PJ peuvent se contenter d\'éliminer Maillet et ses gardes du corps, ou voir clair dans la manipulation, faire tomber Laboutade et démanteler le Siège.',
  notes: `Source : ${REF}. Ton parodique et grinçant (finance, clergé, bourgeoisie parisienne).

Contexte : l'Enfer finance ses opérations par le blanchiment. Nisroch fournit l'argent sale, Mammon le nettoie et le redistribue. À Paris, une dizaine de démons de Mammon, cadres de la finance le jour, blanchissent la nuit au « Siège », sous la coupe d'Hilaire. Objectifs chiffrés et compétition féroce : Barakiel, trois fois meilleur commercial, se croit cette année parmi les derniers et risque de perdre son familier de fonction (Bethor). Il fait dénoncer Chaldkydri (Maillet) à l'Église par Magnier, prévient Maillet « en ami », lui paie trois gardes du corps, compte récupérer ses actifs pendant qu'il se cache… puis livrer sa planque aux anges.

Plan de Laboutade, en bref : anges repérés → Maillet évacué au Siège → portefeuille confié à Laboutade → planque au Comptoir de la Main d'Or → tuyau au curé (via Magnier ou Pamela) → les anges tuent Maillet et ses gardes. Pamela élimine Magnier dès qu'il devient gênant.

Récompenses : aucun barème chiffré dans le livre ; la réussite se juge à la conclusion (scène 10). Démasquer Laboutade et démanteler le Siège valent un vrai bonus de carrière (PA à l'appréciation du MJ).

Fiches : aucune ligne d'attaque dans le livre ; armes déduites des talents et choisies dans la table des règles (signalé dans chaque fiche). Ch des humains reportée en Foi. Défense non donnée : niveau 1.`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [barakiel, bethor, chaldkydri, hilaire, uwula, galgalil, gezuriah, mordad, magnier, mimpontel, defer, bolot].map(asType);
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));
writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types');
