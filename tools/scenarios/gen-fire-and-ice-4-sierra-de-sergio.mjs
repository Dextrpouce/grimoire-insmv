// Génère le fichier d'import « insmv-scenario » pour « La sierra de Sergio » (Fire and Ice, p. 69-83)
// usage : node gen-sierra-de-sergio.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Fire and Ice, « La sierra de Sergio », p. 69-83';
const L = (s) => R.parseLvl(String(s)); // « 2+ » → 5
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
let n = 0; const id = (p) => `fi4-${p}`;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [{ n: 'Coup de poing', att: 2, prec: 0, puis: -3, melee: true }], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});
const W = Object.fromEntries(R.ARMES.flatMap(([g, l]) => l.map((x) => [x[0], { prec: x[1], puis: x[2], melee: R.MELEE_GROUPS.includes(g) }])));
const arme = (nom, table, lvl) => ({ n: nom, att: L(lvl), ...W[table] });

// ---------------- PNJ ----------------
const ignace = npc('ignace', {
  nom: 'Ignace Blanchoux', source: 'Ange (Laurent puis Ange, archange des convertis), grade 3', type: 'ange', car: car('4 4 3 5 2 5'), def: L(6),
  pp: 24, pfFix: 9, seuilsFix: seuils('7/14/21/28'),
  armes: [arme('Colt Python', 'Revolver gros calibre', 5), arme('Kalachnikov (démontée dans son sac)', 'Fusil-mitrailleur', 2), arme('Arts martiaux (mains nues)', 'Coup de poing', 2)],
  pouvoirs: pows('Assaut spirituel 4, Arts martiaux 3, Détection du mal 2, Aura de pacification 2, Détection du futur proche 1, Déplacement temporel 1, Régénération 1, Immunité contre le feu, Immunité contre le froid, Non-détection 4'),
  talents: 'Discrétion 8, Défense 6, Langues (nombreuses, dont le temné), Tir 2 (armes de poing 5), Conduite 5, Pilotage 4, Boire des vodkas martinis 3, Rester cool 3, Magie vaudou 4\nPouvoirs vaudous : Malédiction, Poudre de mort, Prison cauchemar, Mambo chevauchant',
  notes: 'Trentenaire maigre aux cheveux blonds filasse qui se dégarnissent ; chemise écrue, pantalon kaki, casque colonial, rangers. Sac de para : Colt Python, Kalachnikov démontée, boîte à outils de combat (pince-monseigneur, un peu d\'explosifs). Businessman louche dans le civil, habitué du Chez Régis.\nVétéran : a servi Laurent jusqu\'aux années 90, puis l\'archange des convertis ; travaille seul et prend des libertés avec le Grand Jeu. Envoyé retrouver Drina (la mère d\'Ange). A repéré les PJ grâce à son pouvoir de grade et préfère les garder à l\'œil.\nCouvertures successives : riche donateur belge de Médecins du Monde (parrain du petit Mangoulé de Kenema) → journaliste de guerre → ancien mercenaire avec des diamants cachés (promet un tiers). Le jouer inoffensif et sympathique ; mentir au mieux.\nArts martiaux à mains nues : niveau d\'attaque estimé (aucun talent de corps à corps donné).',
});
const drina = npc('drina', {
  nom: 'Martin Bucer / Drina', source: 'Démon d\'Andréalphus, grade 3 (« fantôme de la montagne noâre »)', type: 'demon', car: car('2 4 3 4 2 5'), def: 2,
  pp: 25, pfFix: 6, seuilsFix: seuils('4/8/12/16'),
  armes: [arme('Machette', 'Hachette (à une main)', 3), { n: 'Griffes (Membre exotique)', att: L(3), prec: 0, puis: 4, melee: true }, arme('Lance-grenades', 'Lance-grenades', 2)],
  pouvoirs: pows('Polymorphie 4, Orgasme mortel 3, Lire les pensées 3, Invisibilité 3, Membre exotique : griffes, Sommeil 2, Absorption d\'énergie sexuelle 2, Contrôle des animaux 2, Détection du bien 1, Immunité contre les maladies et les poisons'),
  talents: 'Séduction 4, Aisance sociale 4, Conduite 3, Athlétisme 2, Combat 3, Grimper dans les arbres 3, Construire des pièges 3',
  notes: 'Vraie apparence : petit chauve quinquagénaire bedonnant aux lèvres bleutées ; en Sierra Leone, grand brun athlétique en slip (quand il n\'est pas invisible). Mère d\'Ange dans sa précédente incarnation ; a voyagé avec Yolande sous le nom de Martin Bucer.\nAvertissement sans frais : paranoïaque. Survivant de l\'Orgasme mortel d\'Andréalphus (s\'est téléporté), il tue tout humain qui l\'aperçoit. Évite le combat frontal : pièges, Invisibilité, fuite, Polymorphie, animaux (fourmilier, gros singe). Se bat à fond s\'il croit les PJ envoyés par Andréalphus. Ne se confie qu\'à Ange.\nDéfense non donnée : 2. Niveau du lance-grenades estimé (aucun talent de tir donné) ; griffes : Combat 3, précision 0 / puissance +4 comme les autres griffes du bestiaire.',
});
const ange = npc('ange', {
  nom: 'Ange', source: 'Archange des convertis (stats non fournies)', type: 'ange', armes: [],
  notes: 'Apparaît en petite fille de six ou sept ans, robe rose, longues couettes blondes, bouche barbouillée de chocolat. Fille d\'un ange de Michel et de Drina : exception célèbre aux édits de stérilité.\nArchange : ne pas la combattre. Tant qu\'elle est présente (et que le feu brûle), les PJ ne risquent rien. Après le débriefing de la nuit, elle repart avec Drina.',
});
const faune = npc('faune', {
  nom: 'Faune de Freetown (Youssouf Mbenga, Mohez Ngolop, Christian Holomissa, Shakir Essy…)', source: 'Harceleurs et villageois', car: car('2 2 2 1 2 2'), def: L(2),
  pfFix: 3, seuilsFix: seuils('3/6/9/12'), qty: 3,
  armes: [arme('Couteau', 'Cran d\'arrêt', 3), arme('Pistolet', 'Revolver petit calibre', 2)],
  talents: 'Survie 1 (savane 3), Baratin 3, Corps à corps 3, Défense 2, Tir 1 (armes de poing 2), Spot the pigeon 2',
  notes: 'Survivants endurcis de la guerre civile : voient les Blancs comme des pompes à fric (racket au couteau dans une ruelle, ou ado qui propose drogue, filles, armes). La plupart lâchent l\'affaire si les PJ se montrent violents ; ceux qui restent sont les pires.\nSert aussi pour les ados armés du comité d\'accueil de Koinadugu. Armes choisies d\'après les talents.',
});
const militaires = npc('militaires', {
  nom: 'Militaires', source: 'Soldats réguliers, du RUF ou du MINUSIL', car: car('3 2 2 1 1 2'), def: 2,
  pfFix: 4, seuilsFix: seuils('4/8/12/16'), qty: 4,
  armes: [arme('Fusil d\'assaut', 'Carabine', 3), arme('Machette', 'Hachette (à une main)', 3)],
  talents: 'Tir 2 (armes d\'épaule 3), Combat 3, Savoir militaire 1 (explosifs 2), Conduite 2',
  notes: 'Souvent des enfants-soldats, parfois drogués (amphétamines, coke). Sensibles à la corruption et à la flatterie : certains affrontements s\'évitent en s\'humiliant devant eux.\nValeurs reprises du bestiaire (p. 82) ; défense non donnée : 2. Sert aussi pour les mercenaires.',
});
const michel = npc('michel', {
  nom: 'Casques bleus anges de Michel (Chuck Robertson, Karl Raabe, Jean-François Huster)', source: 'Anges de Michel, grade 1 (MINUSIL)', type: 'ange',
  car: car('5 4 3 3 2 3'), def: L(3), pp: 11, pfFix: 8, seuilsFix: seuils('8/16/24/32'), qty: 3,
  armes: [arme('Fusil d\'assaut', 'Fusil-mitrailleur', 7)],
  pouvoirs: pows('Maîtrise martiale 2, Arts martiaux 1, Armure corporelle 1'),
  talents: 'Tir 3 (armes d\'épaule 7), Défense 3, Conduite 2',
  notes: 'Anges guerriers en pénitence, réaffectés au maintien de la paix. N\'ont pas croisé de démons depuis des mois : surpris par une opposition surnaturelle, mais n\'hésitent pas à utiliser leurs pouvoirs si ça tourne mal, quitte à éliminer les témoins ensuite.\nÀ ajouter si les humains sont trop fragiles face aux PJ (le livre invite à majorer leurs caractéristiques pour un groupe de gros bourrins). Valeurs reprises du bestiaire (p. 82).',
});
const miliciens = npc('miliciens', {
  nom: 'Miliciens animistes (Run with the Wind, Quicksand, Night Panther, April Shower)', source: 'Sorciers de village', car: car('2 1 2 2 1 2'),
  pfFix: 4, seuilsFix: seuils('3/6/9/12'), qty: 4,
  talents: 'Dire la bonne aventure 3, Cuisine ésotérique 3, Météo divine 2, Raconter des légendes 2, Magie vaudou 4\nPouvoirs vaudous : Forme animale, Mambo chevauchant',
  notes: 'Chapeaux à plumes, pagnes, peaux de bête. Petite communauté magique sur le modèle vaudou, qui soulage surtout ses ouailles. Rendent ponctuellement service à Ignace pour passer le check point, mais rien de plus.\nAucune arme ni talent de combat donnés : coup de poing par défaut, défense 2.',
});

// Le bestiaire joint (types réutilisables) : mêmes fiches, sans quantité
const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });

// ---------------- Scènes ----------------
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  scene('briefing', '1. Briefing de nuit au Centre de Tri', 'Centre de Tri, Paris – deux jours après la fouille de l\'hôtel Bellevue, en pleine nuit',
    `Aurélie réveille les PJ : venir au CdT au plus vite, avec armes et bagages. Monsieur Fabien, Gilbert et Aurélie les attendent, nerveux, dans la salle de pause.
Mission : Monsieur Fabien a obtenu des crédits pour une enquête en Sierra Leone. Personne d'autre n'est au courant des soupçons sur Andréalphus. Rapporter des preuves (pour ou contre) d'une action occulte du prince du sexe en Afrique et comprendre ce qui se passe ; rappeler au besoin l'étrangeté d'une grossesse princière.

Logistique :
• Vol Roissy 5 h → Londres Heathrow, puis vol direct vers Freetown vers 7 h.
• Dossier géopolitique compilé par Gilbert (lecture du voyage) ; liste des banques où Yolande a retiré de l'argent, avec dates et heures.
• Container sécurisé pour le matériel illicite (armes) : à remplir à Roissy, à récupérer à l'aéroport de Freetown 24 h après l'arrivée.
• Visas, voyage et taxes payés ; vaccins : « j'espère que vous n'allez pas trop sucer d'amibes ».
• Aucun contact démoniaque local : ils seront seuls, même si ça tourne mal.
Monsieur Fabien règle au passage les dossiers en souffrance (enquête sur la propriété de Hornet en Allemagne, requêtes à la hiérarchie…). Aurélie les conduit à Roissy en estafette de La Poste.`),
  scene('freetown', '2. Freetown : sur la piste de Yolande', 'Freetown – centre-ville, banques, hôtel Panafrican',
    `Ambiance : chaleur écrasante, impacts de balles, toits défoncés, patrouilles en 4x4, couvre-feu à 22 h dans le centre. Les rares Blancs sont des mercenaires (à éviter) ou des « touristes » à plumer : sollicitations toutes les demi-heures (racket au couteau, ado qui propose drogue, filles ou armes, chauffeur de taxi changeur, groom qui vend sa sœur…). Rester dans les quartiers riches.

Indices :
• Relevés de carte : deux banques à Freetown (seuls distributeurs internationaux), une à Kenema (200 km à l'est). Retraits importants : jeep, une dizaine de kilos d'explosifs, deux lance-grenades, fusils d'assaut, munitions, vivres pour deux.
• Hôtel Panafrican (seul hôtel de luxe, près des banques) : avec bakchichs et une description ou photo, le réceptionniste se souvient d'une femme enceinte et de son « mari » sympathique, il y a six mois : fiches au nom de Yolande Jolimont et Martin Bucer, quatre jours sur place, beaucoup de temps au bar en terrasse (16e étage).
• Personnel et piliers de bar : le couple posait des questions, achetait du matériel et négociait des laissez-passer pour l'est ; un serveur les a mis en contact avec un trafiquant d'armes (il fera de même pour les PJ s'il les juge bons pigeons). Ils sont partis sans escorte, surarmés, vers les montagnes.

Ignace Blanchoux (ange grade 3) repère les PJ dès leur arrivée, comprend qu'ils sont démons et vient les trouver (à leur hôtel par exemple) sous sa couverture de donateur belge de Médecins du Monde, inquiet pour son filleul Mangoulé de Kenema ; trop peur de voyager seul. Il arrive « comme par magie » avec une liasse de laissez-passer et une jeep de location.

Complication : au-delà d'une centaine de kilomètres, routes bloquées par des barrages ; laissez-passer à obtenir auprès d'une administration kafkaïenne. Partir seuls sans papiers = refoulés par les soldats (avec casques bleus si besoin).
Incidents optionnels si l'enquête traîne : drive-by shooting, attentat du RUF contre l'ambassade d'Angleterre, rencontre avec des trafiquants qui finit à la machette, rixe avec un casque bleu ivre (ange de Laurent).`,
    [inScene(faune), inScene(ignace)], true,
    [choice('ignace', 'Comment les PJ accueillent-ils Ignace ?', [
      ['Ils acceptent de faire la route avec lui', 'Laissez-passer et jeep fournis ; départ quelques jours plus tard, dans un vieux véhicule défoncé, à travers les bidonvilles puis les marécages.'],
      ['Ils s\'en méfient et partent seuls', 'Démarches kafkaïennes pour les laissez-passer ; Ignace les suit discrètement et réapparaîtra plus loin (Kenema, montagne).'],
    ])]),
  scene('route', '3. Check point Charlot : la route de Kenema', 'Pistes de l\'ouest vers l\'est – environ trente heures de route',
    `Pistes ravinées, villages meurtris, paysages sauvages ; changer souvent de conducteur, carte et copilote indispensables.
Incidents au choix : serpent couché sur la route qui ne bouge pas tant qu'on ne lui roule pas dessus ; camion de radiographie humanitaire renversé dans un fossé (deux anges d'Alain parmi les occupants) ; erreur de carrefour menant chez des mercenaires reconvertis dans le racket (se laisser dépouiller ou petite fusillade) ; route qui disparaît et hors-piste dans la mangrove (silhouettes dans les arbres).
Une vingtaine de contrôles en deux jours : deux bidasses débraillés, papiers, tampon, une demi-heure. Parfois soupçons, papiers supplémentaires ou « frais de dossier » : la patience paie. À un barrage, Ignace négocie avec le responsable : il parle très bien le temné et se montre persuasif.
La nuit (le soleil tombe en dix minutes) : poste médical humanitaire (attention aux anges en maraude), hutte dans un village, ou bivouac prudent (feu toute la nuit, affaires dans les arbres).`,
    [inScene(militaires, { nom: 'Mercenaires racketteurs', qty: 4 }), inScene(militaires, { nom: 'Bidasses du barrage', qty: 2 })], true,
    [choice('racket', 'Face aux mercenaires racketteurs ?', [
      ['Les PJ se laissent dépouiller', 'Ils perdent leurs objets de valeur mais repartent sans casse.'],
      ['Ils se défendent', 'Petite fusillade contre des militaires/mercenaires ; attention à la discrétion.'],
    ])]),
  scene('barrage', '4. Le dernier barrage', 'Barrière en bois près des contreforts diamantifères, à l\'est – trois bâtiments dont un bunker',
    `Les marécages laissent place à une brousse aride et aux collines. Une demi-douzaine de jeeps, deux patrouilles de soldats réguliers et un escadron de casques bleus. Rien n'y fait (papiers, billets) : il manque une « accréditation » à aller chercher à Freetown. Même Ignace est mécontent, mais résolu à passer.
Options :
• Forcer le barrage : suicidaire (une trentaine de militaires armés à leurs trousses, plus les renforts).
• Contourner en pleine campagne : terrain très accidenté, peu de chemins carrossables, surveillés de loin ; de nuit en poussant la jeep moteur coupé, jouable au prix d'un ou deux échanges de coups de feu.
• Attendre : Ignace s'éclipse quelques heures (bois, repérage…). La nuit même, une trentaine de villageois visiblement ivres tentent de franchir le barrage en chantant : la confusion permet de passer. C'est l'œuvre d'Ignace, qui se fait reconnaître des miliciens animistes.
Quelques heures après, sirènes au loin : l'alerte est donnée, leur signalement circule. Mais ils ont quitté la zone gouvernementale : bienvenue chez les rebelles du RUF.`,
    [inScene(militaires, { nom: 'Soldats réguliers du barrage', qty: 6 }), inScene(michel, { qty: 1 }), inScene(miliciens)], true,
    [choice('barrage', 'Comment les PJ passent-ils le barrage ?', [
      ['Ils forcent le barrage', 'Une trentaine de militaires et des renforts : très probablement la fin (ou une fuite désespérée).'],
      ['Ils contournent par la campagne', 'De nuit, jeep poussée moteur coupé : un ou deux échanges de tirs avec les patrouilles.'],
      ['Ils attendent', 'Diversion des villageois « ivres » et des miliciens animistes orchestrée par Ignace : passage dans la confusion.'],
    ])]),
  scene('kenema', '5. Kenema : la pension de Célestin', 'Kenema, gros bourg poussiéreux perché sur une colline',
    `Peu de militaires sauf autour du quartier des diamantaires (une trentaine de bijouteries de luxe dans des baraques en béton et tôle). Presque personne ne parle anglais ; seul Blanc : un vieux missionnaire et sa petite chapelle.
Pension la moins sordide de la ville, près de la seule banque : bar/hôtel/épicerie/station-service tenu par Célestin, gros patron à favoris. Il raconte volontiers le couple : questions sur la géographie, départ 24 h après leur arrivée par la route du nord vers les montagnes, jamais revenus ; il pense qu'ils ont rejoint Sefadu. Il parle de la mauvaise saison des pluies et de la peur d'une offensive de l'armée régulière contre le RUF, aggravée par le passage en fraude d'« espions » il y a quelques heures (les PJ).
Ignace s'éclipse « pour ses affaires » et descend au même hôtel.`,
    [], false,
    [choice('kenema', 'Les PJ gardent-ils Ignace avec eux ?', [
      ['Oui, ils avalent son nouveau pipeau', 'Il prétend devoir aller lui aussi vers le nord et continue la route avec eux.'],
      ['Non, ils sont méfiants', 'Il leur donne rendez-vous à Kenema dans six jours pour rentrer, puis loue un véhicule et les suit à quelques heures avec des guides locaux.'],
    ])]),
  scene('koinadugu', '6. Koinadugu Roukoukou', 'Route du nord, puis le bourg de Koinadugu sur un haut plateau aride',
    `Route en corniche (falaise à buissons et à-pic) ; des pierres tombent : des soldats en treillis cavalent dans les hauteurs. Une demi-heure après, trois hélicoptères passent à cinq minutes d'intervalle : des troupes bougent. Incidents possibles : rocher, singes voleurs, balle perdue.
Koinadugu : une trentaine de cases et de maigres plantations, dominées au nord par un long promontoire rocheux. À l'approche, les habitants se barricadent ; une demi-douzaine d'ados armés font le guet. Sans Ignace, il faut baragouiner longtemps ; un vieillard prête quelques mots d'anglais.
Le chef les reçoit dans une grande case de torchis où brûlent des herbes aromatiques pour couvrir l'odeur des cadavres (rites de purification) : trois villageois sont morts la nuit dernière sur la montagne hantée.
Récit (avec patience et roleplay) : il y a cinq ans, une association humanitaire a fait d'un ancien fortin un hôpital sur le flanc nord. Le gros du personnel est reparti il y a un an et demi. Depuis six mois, la montagne est hantée : trois jours et trois nuits d'explosions, l'hospice disparu, des cadavres ; puis des enfants chevriers attaqués par des monstres invisibles, des expéditions punitives qui échouent, un « fantôme » de plus en plus proche du village.
Indice : certains villageois ont vu passer Yolande et Martin il y a quelques mois ; les explosions ont commencé ce soir-là.
S'ils veulent monter : fous ou serviteurs des démons aux yeux des villageois ; personne ne les accompagne, au mieux les ados les escortent jusqu'au sentier. Un grand oiseau de proie tournoie au-dessus d'eux.`,
    [inScene(faune, { nom: 'Ados armés du comité d\'accueil', qty: 6 })]),
  scene('montagne', '7. Le fantôme de la montagne noâre', 'Montagne au nord de Koinadugu – sentier, ruines de l\'hôpital, cabane au sommet',
    `Drina tue par nécessité, pas par cruauté : parano depuis que son prince a tenté de l'abattre, il élimine tout humain qui l'aperçoit (récemment des gamins, en descendant voler fruits et gnôle). Cabane près du sommet, à dix minutes des ruines ; il patrouille sous Invisibilité.
Pièges :
• Éboulis : blocs d'une ou deux tonnes prêts à dévaler sur les passages praticables.
• Balançoire de la mort : tronc suspendu à la verticale par des lianes ; Drina coupe les cordes depuis les cimes (un seul exemplaire).
• Trappe : falaise sapée sous le sentier ; à deux sur la même portion, ça glisse et on tombe.
Drina harcèle : saute d'arbre en arbre, Invisibilité, lance-grenades, fuit et revient avec une nouvelle ruse. Si les PJ révèlent leur nature infernale, il se bat à fond, persuadé qu'Andréalphus les envoie.
Ruines : terrain calciné, quelques moellons noircis, route de la vallée détruite elle aussi ; travail fait avec des quantités massives d'explosifs, aucun autre indice. Si les PJ avaient lâché Ignace, il réapparaît ici, casque colonial et .45 en main.
S'allier à Ignace simplifie tout : il veut épuiser les PP de Drina. Le démon acculé finit à leur merci ; Ignace ordonne « Ne le touchez pas ! » et invoque l'archange des convertis. « Pouf » : une petite fille en robe rose apparaît.`,
    [inScene(drina), inScene(ignace)], true,
    [choice('drina', 'Que font les PJ face à Drina ?', [
      ['Ils s\'allient à Ignace', 'Drina, épuisé, est maîtrisé ; Ignace invoque Ange avant qu\'on l\'achève.'],
      ['Ils l\'affrontent seuls', 'Combat long et retors sur son terrain ; Ignace intervient au moment où ils veulent l\'achever.'],
      ['Ils veulent achever Drina malgré Ignace', 'Ignace s\'interpose et invoque Ange : l\'archange arrive de toute façon.'],
    ])]),
  scene('chill', '8. Chill out : la nuit avec Ange', 'Sommet de la montagne, autour d\'un feu – la nuit',
    `Drina se jette en pleurant dans les bras d'Ange ; Ignace range son arme, tout sourire. Au loin, fusillades : prétextant le passage en force des PJ, l'armée a rompu le cessez-le-feu pour reprendre des mines au RUF ; certains chefs apprendront où sont les « espions » et attaqueront la montagne au matin.
La nuit tombe, calme surnaturel. Si les PJ veulent filer, Ange les envoie chercher du bois d'un ton sans réplique ; méchoui de bouc. Tant qu'elle est là, ils n'ont rien à craindre.
Débriefing après un entretien privé avec Drina (dire la vérité est préférable) :
• Ignace raconte son enquête et ce que les PJ ont manqué.
• Drina : Andréalphus est venu le voir à Paris et l'a emmené en Afrique ; ils ont emprisonné, torturé et assassiné les médecins, rasé l'hôpital, puis le prince a tenté de l'éliminer. Si on insiste : sous la torture, les médecins ont avoué la prise de l'hôpital il y a quatre ans par des mercenaires libériens et le viol d'une infirmière par leur chef, un gars énorme en treillis à cravate Mickey. Ange, à mi-voix : « le prince Baal… ».
• Les PJ racontent ce qu'ils savent ; Ange parle de sa propre naissance miraculeuse et s'inquiète du bébé du prince, déjà plus puissant qu'elle ne l'était pendant sa gestation.
Les détonations se rapprochent, des brasiers s'allument sur le plateau : « tant que notre feu brûle et que la nuit est là, nous ne risquons rien ». Au petit matin, le feu meurt ; Ange conseille aux PJ de rentrer en France porter ces informations à leur hiérarchie (l'avenir du Grand Jeu en dépend), puis disparaît avec Drina. Les combats reprennent.`,
    [inScene(ange), inScene(drina), inScene(ignace)]),
  scene('fuite', '9. Courage, fuyons !', 'Montagne et haut plateau de Koinadugu, puis Kenema ou la frontière',
    `La vraie guerre : une trentaine de militaires réguliers et un squad de mercenaires montent par l'ouest, une vingtaine de soldats du RUF et quelques villageois par l'est. Les PJ sont au milieu : dissuader toute résistance frontale. Ignace veut décamper au plus vite (encore faut-il que les PJ acceptent de collaborer avec un ange).
Descente : courir, se cacher, tirer ; échos trompeurs, une ou deux rencontres avec des squads qui tirent sur tout ce qui bouge. Sur le plateau, éviter les réserves (éclopés du RUF, médecin-charcutier).
Sorties possibles :
• Jeep et retour à Kenema : poursuite par deux ou trois véhicules à mitrailleuses sur des routes à ravins ; en ville, opposition décuplée (détourner un avion du petit aérodrome militaire, ou se constituer prisonniers et réclamer le consulat de France : une dizaine de jours de prison).
• L'hélicoptère (option conseillée par Ignace) : éliminer les deux gardes (un borgne et un manchot), décoller en vitesse, essuyer quelques roquettes depuis le sol. Pas assez de carburant au-delà de Kenema ; le plus malin est de passer au Liberia et de se livrer aux autorités : ambassade sous 24 h, rapatriement en France.
• Idées foireuses : se cacher des semaines dans les montagnes, demander asile à la mine de diamants voisine (gérants hollandais), invoquer leurs supérieurs.
Adieux avec Ignace à l'arrivée en France ou juste avant ; s'ils n'ont pas fait de coup fourré, il laisse son numéro « au cas où » (on le recroise au Chez Régis).`,
    [inScene(militaires, { nom: 'Militaires réguliers', qty: 8 }), inScene(militaires, { nom: 'Mercenaires', qty: 4 }), inScene(militaires, { nom: 'Soldats du RUF', qty: 6 }), inScene(militaires, { nom: 'Gardes de l\'hélicoptère (un borgne, un manchot)', qty: 2 }), inScene(ignace)], true,
    [choice('sortie', 'Comment les PJ quittent-ils la Sierra Leone ?', [
      ['L\'hélicoptère puis le Liberia', 'Deux gardes à neutraliser, tirs de roquettes ; reddition au Liberia, ambassade et rapatriement en 24 h.'],
      ['La jeep jusqu\'à Kenema', 'Poursuite endiablée ; en ville, détourner un avion ou se rendre et attendre le consulat (une dizaine de jours de prison).'],
      ['Une solution alternative', 'Cachette dans les montagnes, mine hollandaise ou appel aux supérieurs : à arbitrer, retour plus tardif.'],
    ])]),
  scene('retour', '10. Retour au Centre de Tri : glory and consequences', 'Centre de Tri, Paris',
    `Monsieur Fabien convoque les PJ dès leur retour et les interroge des heures durant. S'ils cachent des pans de l'aventure (alliance avec un ange, intervention d'un archange), il se montre bougon, insiste sur les détails qui clochent et les prie de dire la vérité. Puis il prévient la hiérarchie et les renvoie prendre une douche.
Suite : Beleth transmet les infos. Scandale à la Cour : Andréalphus est enceinte de Baal ! Baal le prend avec philosophie, Andromalius fulmine ; ses services invitent tous les démons d'Andréalphus à révéler où se cache leur supérieur. Beleth, qui a déjà rencontré Damien, voit ses soupçons confirmés : pour que le fœtus naisse et joue le rôle qu'il lui destine, il doit provoquer une vraie crise en Enfer, voire une guerre (entre deux frères…).
Récompenses : deux semaines de congés payés et 6 PA.`,
    [], false,
    [choice('verite', 'Les PJ disent-ils tout à Monsieur Fabien ?', [
      ['Toute la vérité', 'Débriefing complet ; Fabien prévient la hiérarchie et les laisse rentrer.'],
      ['Ils cachent l\'ange et l\'archange', 'Fabien bougon relève les incohérences et insiste pour avoir la vérité.'],
    ])]),
];

const scenario = {
  id: 'fire-and-ice-4-sierra-de-sergio',
  nom: 'Fire and Ice (scénario 4) – La sierra de Sergio',
  resume: `Nihil ex nihilo, fin du premier acte (INS). Les démons du Centre de Tri partent en Sierra Leone sur les traces du séjour secret d'Andréalphus (alias Yolande), il y a six mois. De Freetown à Kenema puis à la montagne hantée de Koinadugu, flanqués de l'ange Ignace Blanchoux et de ses mensonges, ils retrouvent Drina, démon paranoïaque survivant du prince, et apprennent par l'archange Ange que le père de l'enfant est Baal. Final en fuite au milieu d'une guerre qui reprend.`,
  notes: `Source : ${REF}.
Contexte MJ : il y a presque cinq ans, Andréalphus a conçu son enfant avec Baal dans l'est du pays, en zone de conflit (pas à Freetown) : prise de l'hôpital humanitaire par des mercenaires libériens, viol d'une infirmière par leur chef (Baal). La grossesse s'éternisant, il y a six mois le prince (sous l'identité de Yolande) est revenu avec Drina, grade 3 fidèle récemment réincarné, effacer toute trace : hôpital rasé, témoins et familles tués. Puis il a tenté d'éliminer Drina par Orgasme mortel ; prévenu par Lire les pensées, Drina s'est téléporté et se cache depuis dans la montagne. Drina était la mère de l'archange Ange dans sa précédente incarnation ; Ange, sans nouvelles depuis une carte postale, a envoyé Ignace.
Pays : guerre civile 1991-2002 pour les diamants ; trois forces simplifiées : gouvernement Kabbah, MINUSIL (casques bleus), RUF rebelle (est et sud). Langues : anglais, mendé, temné, krio.
Déroulement : briefing → Freetown (Panafrican, Ignace) → route et barrages → dernier barrage → Kenema → Koinadugu → montagne et Drina → nuit avec Ange → fuite → retour au CdT.

Récompenses : deux semaines de congés payés et 6 PA.

Fiches adaptées du livre : caractéristiques en niveaux INS/MV (Ch des humains reporté en Foi). Militaires et anges de Michel repris du bestiaire (p. 82). Pouvoirs vaudous (Malédiction, Poudre de mort, Prison cauchemar, Mambo chevauchant, Forme animale) absents des règles : notés dans les talents.`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [ignace, drina, ange, faune, militaires, michel, miliciens].map(asType);

// Contrôle : pouvoirs inconnus des règles
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));
const badW = bestiaire.flatMap((t) => t.armes).filter((a) => a.prec === undefined);
if (badW.length) console.warn('Armes absentes de la table :', badW.map((a) => a.n).join(', '));

writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types');
