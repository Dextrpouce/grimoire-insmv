// Génère le fichier d'import « insmv-scenario » pour « Jésus Reviens ! », chapitre 2 :
// « Paris est un héros solitaire… » (p. 14-31 ; TRIC p. 9, IA p. 12, chronologie p. 8-9)
// usage : node gen-jesus-reviens-1-paris.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Jésus Reviens ! (INS/MV4), chap. 2 « Paris est un héros solitaire… », p. 14-31';
const L = (s) => R.parseLvl(String(s)); // « 2+ » → 5
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
const ARMES = new Map(R.ARMES.flatMap(([g, l]) => l.map((x) => [x[0], { prec: x[1], puis: x[2], melee: R.MELEE_GROUPS.includes(g) }])));
// arme de la table des règles : nom affiché, nom dans la table, niveau du talent
const arme = (n, table, lvl) => { const w = ARMES.get(table); if (!w) throw new Error('arme inconnue : ' + table); return { n, att: L(lvl), ...w }; };
// arme décrite par le livre (précision/puissance)
const livre = (n, lvl, prec, puis, melee) => ({ n, att: L(lvl), prec, puis, melee });
const poing = (lvl) => arme('Coup de poing', 'Coup de poing', lvl);

const P = 'jr1-'; let n = 0; const id = (k) => P + k;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [poing(1)], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${o.ref || REF}.`].filter(Boolean).join('\n'),
});
const MINI = 'Fiche minimale (pas de caractéristiques dans le livre).';

// ---------------- Alliés et commanditaires (jamais dans une scène de combat) ----------------
const regine = npc('regine', {
  nom: 'Régine Tien (Tyrgouz)', source: 'Ange de Marc, grade 1 – chargée de mission des PJ', type: 'ange',
  car: car('2 3 4 5 3 3'), def: L(3), pp: 9, pfFix: 7, seuilsFix: seuils('5/10/15/20'),
  armes: [poing(1)],
  pouvoirs: pows('Contrat divin 2, Détection du mensonge 1, Charme 2'),
  talents: 'Discussion 4, Aisance sociale 4, Métier (commerce) 4, Culture générale 2 (économie 4), Défense 3, Franglais de commercial frimeur 2, Technique 2 (économie 4)',
  notes: '158 cm, châtain aux yeux bleus. Physique ingrat (fort strabisme), allure de perdante qui se rêve en golden boy : séminaires de management, franglais commercial agaçant, tout se négocie avec elle.\nNommée par Ange et Alain, elle n\'a que les PJ comme équipe, est joignable en permanence et peut actionner pas mal de leviers sans en avoir l\'air. Son vrai souci : réunir témoignages et pièces en vue du procès. Elle cache sa mission secrète (monter un dossier contre Dominique, Laurent et Georges) et ne la dévoile que si les PJ la pressent vraiment ou menacent de tout balancer.\nAlliée : ne pas l\'inclure dans un combat. Pas d\'arme indiquée : coup de poing par défaut.',
});
const medes = npc('medes', {
  nom: 'Medes', source: 'Ange de Mathias, grade 3 – bras droit de Mathias à Paris', type: 'ange',
  car: car('4 6 6 7 6 7'), def: L(8), pp: 34, pfFix: 11, seuilsFix: seuils('7/14/21/28'),
  armes: [livre('Pistolet automatique chromé et béni (pénétration importante, portée moyenne)', 6, 0, 4, false), poing(5)],
  pouvoirs: pows('Apparence démoniaque 4, Aura de confusion 4, Chant angélique 1, Charme 4, Polymorphie 3, Jet d\'eau bénite 3, Lire les pensées 2, Téléportation 2'),
  talents: 'Corps à corps 5, Défense 8, Discrétion 8, Discussion 4, Enquête 5, Fouille 6, Intrusion 7, Tir 3 (armes de poing 6), Aisance sociale 9, Métier (PAO) 7, Informatique 8, Savoir occulte 4 (histoire secrète de Mathias 9), Promener son chien 4, Ne pas faire le ménage 9+, Être bordélique 7, Être constamment débordé 7',
  notes: '182 cm, châtain aux yeux verts. Nettoyeur de Mathias, en pleine purge anti-Emmanuel : toutes les opérations d\'infiltration de l\'Enfer sont gelées. Hyper nerveux, débordé, travaille 20 heures sur 24, colle la pression à tout le monde. Il soupçonne Pallard (la description du chauffeur du van l\'a mis sur la piste) mais n\'a pas de preuve.\nAllié possible : voir la scène « Sors tes griffes ». Ne pas l\'inclure dans un combat contre les PJ.',
});
const richard = npc('richard', {
  nom: 'Richard', source: 'Ange de Georges, grade 1 – bureau des réclamations de Notre-Dame', type: 'ange',
  car: car('5 3 3 3 2 4'), def: L(2), prot: 4, pp: 12, pfFix: 8, seuilsFix: seuils('8/16/24/32'),
  armes: [livre('Hache bénie (permanente)', 4, 2, 5, true), poing(4)],
  pouvoirs: pows('Augmentation de force 2, Armure corporelle 2, Régénération 2, Jet de flammes 1'),
  talents: 'Combat 2 (haches 4), Corps à corps 4, Défense 2, Culture générale 1+ (vie des grandes compagnies militaires de la guerre de Cent Ans 3), Métier (bureau des réclamations) 1, Intimidation 4, Savoir occulte 1 (projet de Georges 2), Savoir militaire 2 (bataille rangée du Moyen Âge 4), Foutre les formulaires à la poubelle 4',
  notes: '188 cm, blond aux yeux verts. A refusé de passer chez Laurent quand Georges a été mis au placard et l\'a suivi dans ce poste inutile, où il s\'entraîne à la hache et écoute ragots et plaintes. Il connaît très bien Francesco et Immaculus et les méprise (la discipline avant tout). Très intéressé par l\'opération JR : il interroge les PJ en douce, sourit, méprise et rapporte tout à Georges. Attitude volontairement ambiguë.\nCotte de mailles et heaume : protection 4.',
});

// ---------------- Les méchants de Paris ----------------
const lux = npc('lux-imperator', {
  nom: 'Lux Imperator (Pierre Dufour)', source: 'Ange, grade 1 (de Dominique selon sa fiche) – président de SOS Bébés', type: 'ange',
  car: car('4 2 2 3 4 3'), def: L(2), pp: 8, pfFix: 7, seuilsFix: seuils('7/14/21/28'),
  armes: [poing(1)],
  pouvoirs: pows('Jugement 1, Absorption de violence 1, Armure corporelle 2, Charme 2, Lueur insoutenable 2'),
  talents: 'Défense 2, Discussion 3, Aisance sociale 3, Intimidation 3, Métier (informatique) 3, Science 1+ (gynécologie 3), Gueuler dans un hygiaphone 3, Organiser des manifs à la con 3, Savoir occulte 1 (opération JR 2)',
  notes: '33 ans, 173 cm, 135 kg. Intégriste illuminé, arriviste, bouffi d\'orgueil ; le battage autour de sa « résurrection » lui est monté à la tête : il se voit en nouveau messie. Officiellement chef de service (emploi fictif du PPB) à la mairie de Versailles ; officiellement « en disponibilité », il est en fait détaché par Dominique auprès de l\'opération JR.\nArmure corporelle « en argent » (la lueur argentée visible sur la vidéo).\nIncohérence du livre : l\'introduction en fait un ange de Laurent de grade 2, sa fiche un ange de Dominique de grade 1 (fiche retenue). Pas d\'arme indiquée : coup de poing par défaut.',
});
const christine = npc('christine', {
  nom: 'Christine Bussy-Rabutin', source: 'Servante de Dieu – députée PPB, présidente de Familles Chrétiennes', type: 'serviteur',
  car: car('1 2 2 3 3 3'), def: 2, pfFix: 4, seuilsFix: seuils('2/4/6/8'),
  armes: [poing(1)],
  talents: 'Baratin 3, Discussion 2, Aisance sociale 2, Culture générale 1 (histoire de France 2), Métier (députée) 3, Savoir occulte 1 (opération JR 2), Hobby (chants liturgiques) 3',
  notes: '48 ans, mariée, sept enfants. Catholique bourgeoise d\'un racisme serein, jésuitique, oratrice opiniâtre qui n\'avoue jamais ses torts ; elle traite les PJ avec le respect dû à des anges tout en essayant de les embobiner. Elle ignore ce qu\'est vraiment l\'opération JR (elle imagine une croisade façon Jean-Paul II contre le communisme) et défendra son projet de loi bec et ongles, au besoin en lançant les PJ sur une fausse piste (le congrès de Saumur).\nElle sait que Pallard est un ange d\'Emmanuel et peut dire où Goth l\'a rencontré (la permanence du PSF, rue Lamartine). Convaincue sans preuve que Francesco est un des cerveaux de JR, mais ne le lâchera qu\'à l\'extrême limite.\nPP non indiqués (0). Pas d\'arme.',
});
const immaculus = npc('immaculus', {
  nom: 'Immaculus (abbé Jean-Luc Goth)', source: 'Ange de Dominique, grade 2 – curé de Saint-Nicolas-du-Chardonnet', type: 'ange',
  car: car('3 4 5 5+ 4 5+'), def: L(4), pp: 15, pfFix: 8, seuilsFix: seuils('6/12/18/24'),
  armes: [poing(1)],
  pouvoirs: pows('Jugement 3, Absorption du mal 2, Aura de courage 1, Chant angélique 1, Champ de force 1, Trait d\'énergie 1'),
  talents: 'Défense 4, Discussion 4, Culture générale 2+ (catholicisme 5), Hobby (maquettes de panzers) 3, Intimidation 4, Métier (curé intégriste) 3, Latin, Savoir occulte 2 (opération JR 4), Faire des déclarations de grand méchant de James Bond au moment de tuer ses ennemis 3',
  notes: '172 cm, 58 kg, métis indien chauve aux yeux noirs. Vit mal son corps « basané », d\'où un racisme viscéral. Petit, chafouin, lunetteux, charisme de chef de block ; adore humilier ses subordonnés. Aumônier parachutiste des scouts d\'Europe. En concurrence féroce avec Francesco. Toujours en soutane, entouré de gardes du corps de la légion Azul. Guernica est son meilleur ami.\nIl connaît les deux cerveaux de JR mais pas l\'ampleur planétaire de l\'opération ; il désigne Francesco comme LE cerveau et sait beaucoup de choses sur l\'Opus Dei, la Fraternité et les stages de la légion Azul chez Semper Fidelis.\nPP partiellement lisibles sur le scan (15 retenus). Pas d\'arme indiquée.',
});
const guernica = npc('guernica', {
  nom: 'Guernica (Angel Torres)', source: 'Ange de Laurent, grade 1 – chef de la légion Azul', type: 'ange',
  car: car('5 4 4 2 3 3'), def: L(3), pp: 8, pfFix: 7, seuilsFix: seuils('8/16/24/32'),
  armes: [livre('Tolède bénie (mineure)', 5, 2, 4, true), livre('Automag 44 (pénétration importante, portée moyenne)', 4, -2, 4, false), poing('4+')],
  pouvoirs: pows('Champ de force 2, Juste-lame 2, Sens surdéveloppés'),
  talents: 'Combat 2 (épées 5), Corps à corps 4+, Défense 3, Tir 2 (armes de poing 4), Athlétisme 4, Culture générale 2 (histoire de l\'Espagne fasciste 3), Français, Espagnol, Savoir militaire 2 (tactique 4+), Chants franquistes 2, Paella 3, Savoir occulte 0+ (opération JR et Grand Jeu 1+)',
  notes: '39 ans, 178 cm, brun aux yeux marron. Incarné dans le fils d\'un général franquiste, vétéran de la guerre d\'Espagne et du front russe ; voit des ennemis partout, ne sort jamais désarmé, bavures étouffées par la police espagnole. Bon vivant entre soudards, indifférent à la politique céleste ; il obéit et ne veut pas savoir. Envoyé spécial de l\'Opus Dei à Saint-Nicolas, presque toujours avec Immaculus.\nC\'est lui qui, avec une vingtaine de légionnaires, massacre les démons enquêteurs devant le centre de l\'Opus Dei.',
});
const helem = npc('helem', {
  nom: 'Helem (Raymond Chora)', source: 'Ange de Laurent, grade 2 – barbouze de Laurent', type: 'ange',
  car: car('3 5 3 4 4 5'), def: L(6), pp: 23, pfFix: 7, seuilsFix: seuils('6/12/18/24'),
  armes: [arme('Épée (Juste-lame)', 'Épée longue', 7), poing(4)],
  pouvoirs: pows('Juste-lame 4, Invisibilité 2, Téléportation 3, Armure corporelle 4, Régénération 2, Lire les pensées 2'),
  talents: 'Baratin 8, Combat 3 (épées 7), Corps à corps 4, Défense 6, Discrétion 8, Discussion 6, Fouille 4, Intrusion 2, Séduction 7, Athlétisme 4, Aisance sociale 6, Métier (travail à la chaîne chez Renault) 4, Savoir d\'espion 2 (filature urbaine 5), Faire disparaître les corps de ses victimes 3',
  notes: '47 ans, 182 cm, cheveux blancs, yeux bleus. Brave type d\'allure ouvrière qui joue les benêts ; en réalité exécuteur des meurtres illégaux commandés par Laurent (il a même tué un ange qui enquêtait sur la psychopathie de l\'archange). Chargé avec Luxor de décourager les PJ ; s\'ils s\'entêtent, il leur pourrit la vie à plein temps et mobilise ses obligés de Notre-Dame. Ne s\'énerve jamais.\nArmure corporelle (acier). Arme non précisée : épée longue des règles choisie pour aller avec Combat (épées 7) et Juste-lame.',
});
const luxor = npc('luxor', {
  nom: 'Luxor (Maude Toustous)', source: 'Ange de Dominique, grade 1 – police des polices de Dominique', type: 'ange',
  car: car('2 3 4 2 2+ 5'), def: L(2), pp: 9, pfFix: 4, seuilsFix: seuils('5/10/15/20'),
  armes: [arme('Arme de poing', 'Revolver petit calibre', 2), poing(1)],
  pouvoirs: pows('Jugement 1, Absorption de gentillesse 1, Caméléon 2, Rebond 1'),
  talents: 'Défense 2, Discrétion 4, Enquête 2, Intrusion 3, Fouille 4, Tir 1 (armes de poing 2), Métier (administration angélique) 5, Savoir occulte 0+ (magouilles de Dominique en France 1), Soupçonner tout le monde 5',
  notes: '52 ans, 162 cm, châtain aux yeux marron. Petite dame pommelée et joviale qui papote de bureau en bureau (elle n\'a même pas de bureau) : en fait elle surveille les anges soupçonnés de déviance pour Dominique. Envoyée par Francesco pour seconder Helem, qu\'elle n\'aime pas : elle a déjà un dossier sur lui et le soupçonne d\'avoir exécuté des collègues.\nArme non précisée : revolver petit calibre (Tir, armes de poing 2).',
});
const ogath = npc('ogath', {
  nom: 'Ogath (Simone Lallemand)', source: 'Ange de Dominique, grade 2 – cheffe de service à Notre-Dame', type: 'ange',
  car: car('3 4 5 6+ 5+ 6'), def: L(7), pp: 28, pfFix: 9, seuilsFix: seuils('6/12/18/24'),
  armes: [poing(1)],
  pouvoirs: pows('Invisibilité 2, Jugement 3, Voix impérieuse 3, Polymorphie 4, Aura de confusion 4, Champ de force 1, Lumière céleste 2, Lire les pensées 3'),
  talents: 'Baratin 8, Défense 7, Discussion 7, Enquête 8, Fouille 8, Intrusion 4, Intimidation 9, Savoir occulte 3 (connaissance du Grand Jeu en France 8), Métier (administration angélique) 5, Savoir d\'espion 3 (espionnage industriel dans les bureaux 9+)',
  notes: '86 ans, 152 cm, cheveux blancs aux yeux noirs. Tyran paranoïaque : pour elle les vrais ennemis sont les anges déviants, Jésus et le Grand Jeu sont responsables de la décadence, et une bonne théocratie réglerait tout. Elle convoque les PJ sous un vernis officiel pour les sommer d\'arrêter, en toute illégalité.\nPas d\'arme indiquée.',
});
const pallard = npc('pallard', {
  nom: 'Pallard (Richard Loreaux)', source: 'Ex-ange d\'Emmanuel, officiellement Mathias grade 2 – devenu démon de Malphas, grade 1 (futur Zanag)', type: 'demon',
  car: car('4 5 4 6 3 5'), def: L(7), pp: 27, pfFix: 10, seuilsFix: seuils('6/12/18/24'),
  armes: [arme('Arme automatique soviétique', 'Pistolet-mitrailleur', 1), poing(1)],
  pouvoirs: pows('Apparence angélique 3, Invisibilité 3, Champ de force 3, Ténèbres sataniques 2, Psychométrie 3, Lire les pensées 4, Polymorphie 3'),
  talents: 'Baratin 6, Défense 7, Discrétion 8, Discussion 4, Enquête 6, Fouille 9, Intrusion 9+, Séduction 3, Athlétisme 6, Acrobatie 7, Culture générale 2 (vie quotidienne du XXe siècle en Occident 6), Hobby (discuter avec les militants staliniens) 7, Informatique 4, Métier (représentant en bibles de Jérusalem) 5, Savoir criminel 2+ (cambriolage 8), Savoir occulte 2 (affaire Emmanuel 5), Pickpocket 6',
  notes: '174 cm, châtain aux yeux marron, bouc. Agent d\'élite des infiltrations en Enfer ; il a soutenu Emmanuel par rancœur contre Mathias (grade 3 sous Emmanuel, rétrogradé grade 2 au retour de Mathias, avec son ancien souffre-douleur Medes pour supérieur). Passé en Enfer avec Emmanuel/Zanag. Il a fourni l\'équipe de démons de la fusillade (en les sacrifiant : portes du van bloquées, rafale dans le dos) et le démon censé aider les Russes à ressusciter Lénine. Connaît Katioucha, Strachnov et Francesco.\nLâche et subtil : s\'il est intercepté, il nie tout et invoque ses ordres de mission (agent double de Mathias). Bousculé, il lâche ce qu\'il sait de Moscou et de Paris sans avouer qu\'il est démon et tente d\'envoyer les PJ vers Strachnov. Apparence angélique : pouvoir présenté à la fin du livre (renégats).\nArme non chiffrée : il tirait avec une arme automatique de type soviétique, ici pistolet-mitrailleur au niveau 1 (pas de talent Tir indiqué, estimation).',
});
const voelckel = npc('voelckel', {
  nom: 'Jean-Marc Voelckel', source: 'Soldat de Dieu – chef du camp des scouts d\'Europe', type: 'soldat',
  car: car('3+ 3 3 3 3 3+'), def: L(3), pp: 6, pfFix: 6, seuilsFix: seuils('4/9/13/18'),
  armes: [livre('Matraque (non létale)', 3, 0, 1, true), livre('Fusil d\'assaut (pénétration importante, portée longue, attaque multiple)', 3, -2, 5, false), poing(4)],
  pouvoirs: pows('Augmentation de force 2, Armure corporelle 1'),
  talents: 'Combat 1+ (contondantes 3), Corps à corps 4, Défense 3, Discrétion 2, Tir 1+ (armes d\'épaule 3), Athlétisme 3, Culture générale 1 (groupes fascistes européens 2), Hobby (chants fascistes) 2, Intimidation 3, Métier (entraîner des militaires) 3, Savoir militaire 1+ (tactique moderne 3), Survie 1 (forêt 2)',
  notes: '48 ans, 172 cm, chauve aux yeux bleus. Vétéran d\'Indochine et de Bosnie, ancien du service d\'ordre du Front Français, légende des fascistes européens. Bourru, sadique, ne pense pas : il gère le camp et s\'entend avec les Espagnols, sans états d\'âme.',
});
const scouts = npc('scouts', {
  nom: 'Scouts d\'Europe', source: 'Apprentis soldats de Dieu (jeunes gens de bonne famille)', qty: 6,
  car: car('2+ 3 2 1+ 2 2'), def: L(2), pfFix: 4, seuilsFix: seuils('3/7/10/14'),
  armes: [livre('Matraque ou batte de base-ball (non létale)', 2, 0, 1, true), poing(2)],
  talents: 'Combat 1 (contondantes 2), Corps à corps 2, Défense 2, Survie 1 (forêt 2), Chants catholiques 2, Chants fascistes 1, Distribuer des tracts à la sortie des écoles privées de la banlieue ouest 2, Vendre des calendriers scouts au porte-à-porte 2',
  notes: 'Formés à la discipline et à la haine raciale, ils se rêvent chevaliers modernes ; consanguinité fréquente (tarés, albinos, hanches démises). Obéissants, fanatiques, savent manier les armes à feu mais manquent d\'expérience : facilement débordés face à forte partie. Ils encadrent tous les PNJ du scénario (gardes de la clinique, du siège de SOS Bébés, de Familles Chrétiennes, de Saint-Nicolas) et sont une cinquantaine au camp.\nCh du livre reportée en Foi. Quantité de la scène à ajuster.',
});
const azul = npc('azul', {
  nom: 'Légionnaires de la légion Azul', source: 'Soldats de Dieu espagnols au service de l\'Opus Dei', type: 'soldat', qty: 4,
  car: car('3 2+ 3 2 1 2+'), def: L('2+'), pp: 5, pfFix: 5, seuilsFix: seuils('4/8/12/16'),
  armes: [livre('Épée lourde', 3, -1, 3, true), poing(2)],
  pouvoirs: pows('Augmentation de force 1, Armure corporelle 1'),
  talents: 'Combat 1+ (épées 3), Corps à corps 2, Défense 2+, Discrétion 2, Hobby (chants fascistes espagnols) 3, Espagnol, Français, Latin, Savoir militaire 1 (tactique 2)',
  notes: 'Soudards racistes qui se prennent pour de nouveaux SA ; bras armé de l\'Opus Dei (assassinats ciblés, lutte contre l\'ETA). Simples exécutants : ils ne savent rien de l\'opération JR. Huit d\'entre eux formaient le « service d\'ordre » aux épées cachées dans les hampes de pancartes lors de la fusillade.\nQuantité de la scène à ajuster (une vingtaine à Saint-Nicolas et autour de Guernica, dix à trente au camp).',
});
// Troupes génériques reprises du bestiaire de l'application
const serviteurs = npc('serviteurs', {
  nom: 'Serviteurs de Dieu de Saint-Nicolas', source: 'Humains au service du Bien (bestiaire : Serviteur de Dieu typique)', type: 'serviteur', qty: 8,
  car: car('2 3 3 2+ 2 2+'), def: 2, pp: 6, pfFix: 4, seuilsFix: seuils('3/6/9/12'),
  armes: [poing(2)],
  talents: 'Acrobatie 2, Aisance sociale 2, Corps à corps 2, Discrétion 2, Enquête 2, Fouille 2, Intrusion 2, Métier au choix 3 ; un pouvoir utilitaire au choix au niveau 1',
  ref: 'Livre de base, Règles, p. 88 (profil « Serviteur de Dieu typique » du bestiaire)',
  notes: 'Une centaine en permanence à Saint-Nicolas-du-Chardonnet, vitrine humaine de la Fraternité. Interrogés, ils permettent d\'apprendre la partie européenne de l\'opération JR. Le livre ne donne pas de fiche : profil type du livre de base.',
});
const soldatsDieu = npc('soldats-dieu', {
  nom: 'Soldats de Dieu harceleurs', source: 'Sympathisants de JR à Notre-Dame (bestiaire : Soldat de Dieu typique)', type: 'soldat', qty: 6,
  car: car('3 2+ 2 2+ 1+ 3'), def: L('2+'), pp: 8, pfFix: 5, seuilsFix: seuils('4/8/12/16'),
  armes: [arme('Pistolet-mitrailleur', 'Pistolet-mitrailleur', 3), arme('Grenade', 'Grenade', 3), poing(2)],
  talents: 'Athlétisme 3, Combat 2, Conduite 2+, Corps à corps 2, Intimidation 2, Savoir militaire 2 (tactique 2+), Survie 1, Tir 2 (au choix 3) ; un pouvoir défensif et un utilitaire au choix au niveau 1',
  ref: 'Livre de base, Règles, p. 88 (profil « Soldat de Dieu typique » du bestiaire)',
  notes: 'Une cinquantaine de soldats de Dieu (et une dizaine d\'anges) peuvent être lancés sur les PJ pour les agacer et les harceler (vexations, menaces, pneus crevés). Le livre ne donne pas de fiche : profil type du livre de base.',
});
const policiers = npc('policiers', {
  nom: 'Policiers et gendarmes', source: 'Forces de l\'ordre (profil rapide « Police municipale » de l\'écran)', qty: 4,
  car: car('2 2 2+ 2+ 2+ 2'), def: 2, pfFix: 4, seuilsFix: seuils('3/6/9/12'),
  armes: [arme('Arme réglementaire', 'Revolver petit calibre', 2), poing(1)],
  talents: 'Aisance sociale 2, Athlétisme 2, Défense 2, Discrétion 2, Discussion 2+, Enquête 3, Fouille 2, Informatique 1+, Intimidation 2, Savoir militaire 1 (discipline 2+), Survie 1 (milieu urbain 2), Tir 1+ (arme réglementaire 2)',
  ref: 'Livret de l\'écran du maître, p. 14 (profil « Police municipale »)',
  notes: 'Planton devant la maternité, subordonnés du capitaine Suir, et surtout la garde rapprochée de Christine Bussy-Rabutin à Versailles (police, gendarmes, police municipale, RG). Le livre ne donne pas de fiche : profil de l\'écran.',
});
const suir = npc('suir', {
  nom: 'Capitaine Jean-Dominique Suir', source: 'Policier chargé de l\'enquête au commissariat de Montreuil', armes: [],
  notes: 'Militant des droits de l\'homme, SOS Bébés le révulse : il met tout son zèle à ne pas enquêter et regrette que les agresseurs n\'aient pas eu le temps d\'abattre quelques bigots. Seules des menaces venues d\'autorités officielles le font bouger ; ses subordonnés le détestent et peuvent parler. Son dossier (maigre) contient les relevés des douilles, le casier de Dufour (une dizaine de condamnations pour entrave à l\'exercice de la médecine) et surtout les témoignages : les quatre agresseurs ont succombé aux balles et aux épées mais leurs corps n\'ont jamais été retrouvés, et le service d\'ordre parlait espagnol. Le van a été retrouvé carbonisé dans la forêt de Saint-Cucufa quelques heures après.\n' + MINI,
});
const francesco = npc('francesco', {
  nom: 'Francesco', source: 'Ange de Dominique, grade 3 – dirigeant de l\'Opus Dei, cerveau de l\'opération JR', type: 'ange', armes: [],
  notes: 'Ne passe qu\'une journée au centre José Maria Escriva de Balaguer pour la réunion européenne de JR (avec Guernica, Immaculus, Strachnov et les Russes). Paranoïaque, il ne dit à chacun que le strict nécessaire ; les dossiers de JR sont dans sa tête et au siège madrilène de l\'Opus Dei. Le capturer donnerait aux PJ une sérieuse option sur la victoire finale.\nFiche minimale : ses caractéristiques sont dans le chapitre Madrid.',
});
const congres = npc('congres', {
  nom: 'Participants du congrès de Saumur', source: 'Notables, élus et ecclésiastiques invités par Familles Chrétiennes', qty: 7, armes: [],
  notes: 'Pr Archibald Douressamy (67 ans, gynécologue retraité, fondateur de Logis de France) : violeur multirécidiviste couvert par l\'Église, sadique, se prend pour un parangon de vertu.\nÉvêque Amédée de Pouzillac (63 ans, évêque de Champoteux, Conseil catholique français de la famille).\nAlain Pablin (48 ans, député PPB) : ex-militant d\'extrême droite converti à l\'ultralibéralisme ; contre le projet de loi mais se tait.\nAlain Pubbé (62 ans, député et trésorier régional du PPB) : grand bourgeois méprisant ; contre la loi en privé, pour en public par intérêt.\nFrançois Tayrou (51 ans, Union des Centristes Modérés) : girouette qui attend le congrès pour savoir ce qu\'il pense.\nFrançois Belgique (48 ans, Parti Social Démocrate) : homme d\'appareil ; sa position de principe a été votée au dernier congrès de son parti, et il en a oublié les arguments.\nAlbertine Pourrac (78 ans, porte-parole du Parti Stalinien Français) : vétérane obéissante, contre la loi parce que c\'est la ligne du Parti.\nLeurs caractéristiques ne sont pas données par le livre (seulement celles des non-humains).\n' + MINI,
});
const admat = npc('admat', {
  nom: 'Marine Le Kervenec (Admat)', source: 'Démon de Nybbas, grade 2 – secrétaire départementale du Front Français', type: 'demon', armes: [],
  notes: '32 ans. Moderne et très communicante, elle dirige les jeunes du Front qui ont appris à policer leur discours ; Admat s\'amuse comme un fou à aider ce parti à nuire à la France. Elle se moque de l\'avortement mais se déclare contre le projet de loi, au nom de l\'ordre nouveau. Participante du congrès.\n' + MINI,
});
// Démons enquêteurs (encadré p. 31)
const zenif = npc('zenif', {
  nom: 'Zenif (Sabine Moloko)', source: 'Démon de Hornet, grade 1 – équipe d\'enquête de l\'Enfer', type: 'demon',
  car: car('5 4 2 3 3 2+'), def: L(4), pp: 8, pfFix: 8, seuilsFix: seuils('7/14/21/28'),
  armes: [livre('Sac à main plombé maudit (permanent)', 6, 1, 3, true), poing(1)],
  pouvoirs: pows('Résurrection macabre 3, Jet d\'acide 2, Absorption de douleur 1, Charme 2'),
  talents: 'Combat 2 (contondantes 6), Défense 4, Baratin 6, Enquête 4, Culture générale 1 (vie d\'une fille juive en métropole occidentale au troisième millénaire 2), Métier (télévendeuse chez la Redoute) 2, Faire des bougies en graisse humaine 3',
  notes: '26 ans, 168 cm, 102 kg. Sous l\'air d\'une jeune fille obèse et gentille, une âme très vicieuse qui adore se venger de ceux que ses kilos dégoûtent. Se fait passer pour une enquêtrice d\'autorités diverses (grande panoplie de fausses cartes).',
});
const zoram = npc('zoram', {
  nom: 'Zoram (Édouard Gougassian)', source: 'Démon de Malphas, grade 1 – équipe d\'enquête de l\'Enfer', type: 'demon',
  car: car('1+ 4 4 5+ 4 3'), def: L(5), pp: 12, pfFix: 7, seuilsFix: seuils('3/7/10/14'),
  armes: [poing(1)],
  pouvoirs: pows('Discorde 2, Charme 2, Rebond 1, Télépathie 2'),
  talents: 'Baratin 5, Défense 5, Discrétion 4, Discussion 4, Enquête 4, Fouille 5, Intrusion 4, Séduction 4, Culture générale 1+ (histoire de l\'Arménie 4), Hobby (philatélie du Pacifique Sud) 4, Métier (analyste programmeur sur langage dépassé) 3',
  notes: '48 ans, 165 cm. Calme, réservé, inoffensif d\'aspect ; s\'entend bien avec Sabine (alors qu\'elle sert un prince qu\'il méprise) : ils se font passer ensemble pour une paire d\'enquêteurs officiels pathétiques.\nPas d\'arme indiquée.',
});
const paanchi = npc('paanchi', {
  nom: 'Paanchi (Jean-François Foufon)', source: 'Démon de Nisroch, grade 0 – équipe d\'enquête de l\'Enfer', type: 'demon',
  car: car('2 3 3 2 2 4'), def: L(2), pp: 6, pfFix: 4, seuilsFix: seuils('4/8/12/16'),
  armes: [poing(1)],
  pouvoirs: pows('Accoutumance 3, Charme 1, Téléportation 1, Membre blindé'),
  talents: 'Baratin 2, Défense 2, Discrétion 5, Fouille 7, Intrusion 5, Culture générale 1+ (histoire des Macintosh et stupéfiants au troisième millénaire 5), Métier (technicien en micro-informatique) 2, Savoir criminel 2 (vendre de la dope 4)',
  notes: '28 ans, 172 cm. Zézaiement prononcé (« Jean-Français »), tête de perdant ; dealer qui ne consomme jamais, contact du groupe avec les marginaux et les jeunes. S\'énerve si l\'on utilise mal les drogues qu\'il conseille.\nPas de talent de combat indiqué : coup de poing au niveau 1.',
});
const midoni = npc('midoni', {
  nom: 'Midoni (« Bong », Loïc Aucud)', source: 'Ange de Mathias, grade 2, infiltré en démon de Belial, grade 1', type: 'ange',
  car: car('4 4 5 4 2 3'), def: L(6), pp: 23, pfFix: 8, seuilsFix: seuils('7/14/21/28'),
  armes: [poing(5)],
  pouvoirs: pows('Apparence démoniaque 4, Membre blindé, Polymorphie 2, Jet de flammes 3, Charme 1'),
  talents: 'Corps à corps 5, Défense 6, Discrétion 5, Enquête 4, Fouille 4, Intrusion 4, Aisance sociale 4, Culture générale 2 (culture des hackers 4), Hobby (bidouillage informatique) 5, Savoir d\'espion 1+ (se faire passer pour quelqu\'un d\'autre 3), Savoir occulte 1+ (connaissance de l\'affaire Mathias 3), Hobby (shiatsu) 7',
  notes: '25 ans, 172 cm, châtain aux yeux verts ; langage branché d\'informaticien. Anti-Emmanuel, infiltré depuis deux ans dans ce groupe de démons ; il soupçonne Emmanuel d\'être mêlé à l\'affaire et veut coincer l\'ange de Mathias derrière la fusillade. En cas de bagarre avec des anges, il ne fait pas de cadeau, sauf si sa vie est en danger : il tente alors de passer à l\'ennemi, grillant sa couverture. Ne connaît ni Pallard ni Medes, mais s\'allierait à Medes et lui obéirait s\'il le rencontrait.',
});

// Le bestiaire joint (types réutilisables) : mêmes fiches, sans quantité
const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });

// ---------------- Scènes ----------------
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  scene('briefing', '1. Antisocial, tu perds ton sang-froid : le briefing', 'Salle de conférence du Novotel de Rueil-Malmaison – jour J, midi',
    `Une douzaine d'heures après la fusillade, Régine, nouvelle chargée de mission des PJ, les convoque d'urgence et leur passe en boucle la vidéo de France 3 tournée devant la maternité Gagarine à Montreuil.
Ce que l'on voit : une centaine de manifestants âgés de SOS Bébés et leurs pancartes ; Pierre Dufour (Lux Imperator), énorme, hurlant dans son mégaphone sur un escabeau. Un œil attentif (ou un traitement d'image) repère une dizaine de gros bras, dont huit à oreillettes, avec des épées cachées dans les hampes.
Quatre agresseurs masqués et grotesques (un vieillard salace en imper armé d'une masse « décorée », une petite blonde au sac à main plombé, un jeune mannequin à dreadlocks et fusil à pompe, une Antillaise à deux pistolets) jaillissent d'un van. Le service d'ordre s'écarte pour leur laisser Dufour, qui est criblé de balles. Puis les épéistes taillent les agresseurs en pièces, tandis qu'une arme automatique tire depuis la cabine du van dans le dos des fuyards. Les masqués disparaissent dans de petits nuages de soufre ; le van file. Dufour, à moitié éventré, se relève et remercie le Seigneur ; un Espagnol coupe la caméra.
Indices sur la cassette : discipline parfaite des huit hispanophones, qui laissent tirer une fois avant d'agir ; Dufour n'a pas l'air surpris et une lueur argentée passe sur sa peau ; les agresseurs semblent tomber dans un piège ; l'Antillaise trouve la porte du van bloquée et une arme braquée sur elle depuis la cabine.
La presse parle de faits divers et d'hallucination collective ; Dufour est en convalescence à la clinique Saint-Jean de Béthune à Versailles. Mission : comprendre pourquoi un ange et des soldats de Dieu se sont laissé filmer en pleine violation du Grand Jeu, et ramener le ou les fautifs à Notre-Dame. Le scandale n'a pas pu être étouffé et la cassette n'a pas été « perdue ».
Contexte MJ : enquête sans ordre chronologique ; tous les PNJ sont protégés par les scouts d'Europe, voire la légion Azul, et se croient hors d'atteinte (ils n'accepteront jamais de suivre les PJ à Notre-Dame). Sans intervention des PJ, seuls le vote de la loi, le battage médiatique et l'enquête des démons font avancer les choses (voir la chronologie dans les notes du scénario). Une fois repérés, les PJ sont surveillés et mis sous pression en permanence.`,
    [inScene(regine)]),
  scene('maternite', '2. La maternité Gagarine', 'Avenue Lénine, Montreuil',
    `Bâtiment stalinien hideux. Depuis la fusillade, des militants de SOS Bébés campent jour et nuit sur les lieux du « miracle », chantent et prient en attendant la Vierge ; fleurs et cierges autour de la poubelle contre laquelle était l'escabeau, comme un pont de l'Alma. Un planton évite les débordements ; syndicalistes et féministes viennent perturber les pseudo-offices.
Le personnel, saturé, a ordre de ne plus parler aux journalistes ; baratin, fausses cartes de police ou d'une administration, ou argent délient les langues. Difficulté : trouver un vrai témoin plutôt qu'un ami d'ami. Les témoins s'accordent sur : quatre masqués disparus dans de petits éclairs souffreteux au moment de prendre balles ou coups d'épée ; huit membres du service d'ordre armés d'épées et disciplinés ; un conducteur de van, la trentaine, qui a tiré sur ses passagers avant de démarrer (les témoignages sont noyés dans les délires de chacun).
Dès le premier jour vers midi, les démons enquêteurs font la même tournée en se présentant comme des enquêteurs du ministère de la Défense : croiser leur route peut mener à une bonne baston (scène 5).`,
    [inScene(policiers, { qty: 1 })]),
  scene('commissariat', '3. Le commissariat de Montreuil', 'Commissariat de Montreuil',
    `Le capitaine Suir est chargé de l'enquête et n'en fait rien (voir sa fiche). Pour avancer : menaces d'autorités officielles, interroger un subordonné qui le déteste, ou s'emparer du dossier.
Le dossier : douilles, casier de Dufour, témoignages méthodiques. À retenir : les quatre agresseurs ont succombé mais aucun corps n'a été retrouvé ; le service d'ordre parlait espagnol ; le van a été retrouvé carbonisé dans la forêt de Saint-Cucufa quelques heures plus tard. L'enquête n'avance pas et n'avancera pas.`,
    [inScene(suir), inScene(policiers, { qty: 3 })]),
  scene('clinique', '4. La clinique Saint-Jean de Béthune', 'Clinique catholique, Versailles',
    `Lux Imperator y est alité, soigné par des médecins « dans la confidence ». Il donne des interviews enflammées (Paris Première, KTO) qui n'affirment ni ne nient le miracle. Les visiteurs sont fouillés par les scouts d'Europe, encadrés par des soldats de Dieu.
Approches : mentir (journalistes, policiers) ou dire la vérité à un soldat de Dieu de la garde. Dans tous les cas, Lux se moque ouvertement des PJ, sûr de son immunité, et joue le miraculé jusqu'au bout (il commence à y croire). Bousculé, torturé ou kidnappé (ce qui alimente encore les médias), il avoue que l'abbé Goth et Christine Bussy-Rabutin l'ont convaincu d'agir pour sauver l'Occident chrétien, avec l'aval tacite des plus hautes autorités et la protection de l'Opus Dei ; Goth et le chef de la légion Azul ont organisé le miracle pour relancer le débat sur l'avortement. Il ne sait presque rien de JR ni des deux cerveaux.
Le personnel est soit naïf, soit dans le secret (une dizaine d'humains) : en interroger un confirme que les blessures étaient mortelles et que sa guérison défie la médecine.
En planque : allées et venues de l'abbé Goth (toujours avec ses gardes du corps de la légion Azul), de Christine et des scouts qui se relaient.
Les démons : dès le premier soir ils planquent devant la clinique (ils n'osent pas entrer à cause de la chapelle et des soldats de Dieu), puis enlèvent une aide-soignante (Maryvonne Dessegnol), la torturent à mort dans un entrepôt abandonné de Meudon-la-Forêt et dissolvent son corps dans la chaux vive.`,
    [inScene(lux), inScene(scouts, { qty: 6 }), inScene(azul, { qty: 2 }), inScene(immaculus)], true,
    [choice('lux', 'Comment les PJ abordent-ils Lux Imperator ?', [
      ['En se faisant passer pour journalistes ou policiers', 'Fouille par les scouts, puis entretien où Lux joue le miraculé et se moque d\'eux : rien d\'utile.'],
      ['En se présentant comme anges à la garde', 'Même mépris ouvert : il se sent intouchable et refuse toute convocation à Notre-Dame.'],
      ['En le bousculant, le torturant ou l\'enlevant', 'Combat probable contre scouts et légionnaires ; s\'ils le tiennent, il avoue le rôle de Goth et de Christine (témoignage 0 à 1D). Un enlèvement relance le battage médiatique (TRIC +1 par jour).'],
    ])]),
  scene('demons', '5. Les enquêteurs du « ministère de la Défense »', 'Montreuil, Versailles, Le Chesnay, Paris – jours J à J+3',
    `L'Enfer a envoyé une équipe discrète de trois démons et d'un ange de Mathias infiltré pour comprendre la faille ; Mathias veut surtout retrouver l'ange d'Emmanuel qui conduisait le van. Andromalius, moins coulant que Dominique, veut un jeu subtil. Ils mènent la même enquête que les PJ, avec méthode.
Emploi du temps : J midi, briefing au QG infernal de la banlieue ; J 18 h à J+1 4 h, planque devant la clinique ; J+1, enlèvement et meurtre de l'aide-soignante, puis vol de dossiers inutiles chez SOS Bébés ; J+2 midi, planque devant Saint-Nicolas ; J+3 9 h, ils suivent Guernica et Immaculus jusqu'au centre de l'Opus Dei et se font repérer sans le savoir ; J+3 23 h, Guernica et vingt légionnaires les massacrent, leur voiture finit au fond d'une carrière inondée de Picardie.
Les PJ peuvent les croiser (baston), les suivre, ou les prévenir. Midoni est un allié potentiel s'il comprend que les PJ visent le traître d'Emmanuel ; pendant un combat, il ne se retourne contre les démons que si sa vie est menacée. Les démons peuvent aussi débarquer chez Pallard si les PJ s'y font suivre.`,
    [inScene(zenif), inScene(zoram), inScene(paanchi), inScene(midoni)], true,
    [choice('demons', 'Que font les PJ de l\'équipe de démons ?', [
      ['Ils l\'affrontent', 'Baston virile ; Midoni se bat jusqu\'à ce que sa vie soit en danger, puis cherche à passer aux anges.'],
      ['Ils la laissent faire ou la suivent', 'Les démons meurent sous les épées de la légion Azul à J+3 23 h devant le centre de l\'Opus Dei, sauf intervention.'],
      ['Ils retournent Midoni', 'Il les renseigne sur l\'Enfer et sur la fusillade, et s\'allie volontiers à Medes.'],
    ])]),
  scene('sos-bebes', '6. Le siège de SOS Bébés', 'Local de l\'association, Le Chesnay',
    `Rien d'intéressant à part la liste des membres et la comptabilité : on y voit que Familles Chrétiennes tient cette association fantoche à bout de bras (c'est son bras armé pour les actions commandos dans les maternités) et que beaucoup de juges de Versailles et Paris en sont membres, ce qui explique leur indulgence envers Dufour. Le local est mollement surveillé par des scouts qui s'ennuient ferme.
Les démons y passent en plein jour : Sabine et Édouard occupent l'association une bonne heure de questions pendant que leurs deux complices pillent les archives.
Preuve : fichiers de SOS Bébés (contrôle par Familles Chrétiennes) – 0 point d'IA.`,
    [inScene(scouts, { qty: 3 })]),
  scene('familles', '7. Familles Chrétiennes et la permanence du PPB', 'Deux boutiques d\'un immeuble bourgeois près de la cathédrale Saint-Louis, Versailles',
    `Sécurité tatillonne et foule d'allées et venues : Christine étant parlementaire, police, gendarmes, police municipale, RG, scouts d'Europe ET légion Azul montent la garde ; plus une place pour se garer à cause des camionnettes de « fleuristes » aux vitres teintées. L'approcher discrètement est un défi ultime mais faisable ; bousculée, elle résiste beaucoup.
Ce qu'elle sait : il s'agit de l'opération « Jésus Revient », un putsch politique d'une partie du Conseil divin ; son contact est l'abbé Goth, qui en fait son supérieur. Convaincue sans preuve que Francesco est un des cerveaux de JR, elle ne le dira qu'à l'extrême limite. Fanatique, elle se sait promise au Paradis si on la tue : l'interrogatoire sera viril.
Elle noie les PJ sous des noms de politiciens liés malgré eux au projet de loi et propose de les emmener à une réunion du PPB : c'est le congrès de Saumur (scène 14). Elle sait aussi que Pallard est un ange d'Emmanuel qui ne peut pas voir Mathias, et où Goth l'a rencontré : la permanence du PSF, rue Lamartine (scène 12).`,
    [inScene(christine), inScene(policiers, { qty: 4 }), inScene(scouts, { qty: 3 }), inScene(azul, { qty: 2 })], false,
    [choice('christine', 'Comment les PJ obtiennent-ils quelque chose de Christine ?', [
      ['Ils l\'interrogent en douceur', 'Elle les noie sous les fausses pistes et les invite au congrès de Saumur.'],
      ['Ils la menacent ou la frappent', 'Elle tente encore de les détourner vers Saumur ; poussée à bout, elle cite Goth, Pallard et la rue Lamartine, puis Francesco (témoignage 1 à 2D).'],
    ])]),
  scene('chardonnet', '8. Saint-Nicolas-du-Chardonnet', 'Église du Quartier latin, Paris 5e – crypte transformée en QG',
    `Siège parisien de la Fraternité Saint Pie X(II), l'association officielle des intégristes. L'abbé Goth y travaille dans l'ombre avec Guernica, envoyé spécial de l'Opus Dei : ils peaufinent l'opération, appellent Christine, les deux cerveaux, leurs contacts à Notre-Dame et dans la police, et veillent à ce que ni PJ ni démons ne viennent gêner la loi. Ils sortent rarement de la crypte, un QG à la James Bond.
Garde : une vingtaine de légionnaires Azul encadrant une centaine de serviteurs de Dieu et une dizaine de scouts. Accès à la crypte par une porte blindée sous caméras ; point faible : une seconde porte blindée, sans caméra, qui donne sur les égouts et que les soldats utilisent pour aller et venir discrètement (tout le personnel la connaît et la cachera).
Approches : forcer le passage, entrer discrètement, ou cueillir les deux affreux lors d'une de leurs rares sorties. Interrogatoire très musclé ou baratin très habile.
Ce que sait Goth : il connaît Francesco (« LE cerveau »), les liens Fraternité/Opus Dei, les stages de la légion Azul aux USA chez Semper Fidelis (un pur et dur) ; il ne connaît pas les rapports Francesco-Semper.
Le jackpot : leurs connaissances, plus les dossiers papier et informatiques et l'interrogatoire des serviteurs, révèlent la partie européenne de JR, les coordonnées de Dixie Securities, les dates des stages des scouts et de la légion Azul au camp de Géorgie, les traces du stage des Pink Queens au camp des scouts et son adresse, et l'adresse du centre José Maria Escriva de Balaguer (siège de l'Opus Dei en Île-de-France).
Visite officielle : Immaculus les fait éjecter en les injuriant ; jamais au-delà de la nef, quitte à les sortir manu militari.`,
    [inScene(immaculus), inScene(guernica), inScene(azul, { qty: 8 }), inScene(serviteurs, { qty: 8 }), inScene(scouts, { qty: 4 })], true,
    [choice('crypte', 'Comment les PJ entrent-ils dans la crypte ?', [
      ['Par la porte principale, en force', 'Alerte générale : vingt légionnaires, une centaine de serviteurs et les scouts. Très risqué.'],
      ['Par la porte des égouts', 'Pas de caméra : ils peuvent surprendre Goth et Guernica et saisir les dossiers (4L+4D).'],
      ['En cueillant Goth ou Guernica à l\'extérieur', 'Interrogatoire musclé ou baratin : témoignage d\'Immaculus (0 à 4, moitié D, moitié L) ou de Guernica (0 à 1L).'],
      ['Officiellement', 'Immaculus les injurie et les fait sortir ; aucune preuve.'],
    ])]),
  scene('pressions', '9. Les sectes : pressions à Notre-Dame', 'Cafétéria et bureaux de Notre-Dame (Paradis)',
    `Dès qu'ils sont identifiés comme « fouille-merde en mission », les PJ subissent une pression psychologique, hiérarchique et même physique. D'abord la manière douce : à la cafétéria, des collègues sympathiques leur font comprendre à demi-mot qu'il vaut mieux lâcher l'affaire, au nom des intérêts supérieurs de la chrétienté, et proposent de petits services en échange. Les principaux émissaires sont Luxor et Helem ; le MJ peut y ajouter une dizaine d'anges et une cinquantaine de soldats de Dieu chargés de les agacer.
S'ils continuent, Simone Lallemand (Ogath) les convoque de manière faussement officielle : discours sur l'immoralité et l'illégalité de leur mission, menaces, sommation d'arrêter. S'ils obéissent, la campagne s'arrête. Sinon : vexations, menaces, pneus crevés à chaque passage à Notre-Dame, sans nom mais sans gravité ; ils doivent redouter d'y aller.
S'ils se plaignent officiellement, on les envoie au bureau des réclamations : Richard, ange de Georges, les reçoit avec un rictus désabusé, les écoute, les interroge subtilement sur JR et rapporte tout à son archange.
Preuves possibles : témoignage d'Helem et/ou de Luxor sur les ordres de faire pression (IA officiel au moment du témoignage / 10) ; témoignage d'Ogath (IA officiel au moment du témoignage / 5, en D).`,
    [inScene(luxor), inScene(helem), inScene(ogath), inScene(richard), inScene(soldatsDieu, { qty: 6 })], false,
    [choice('ogath', 'Que répondent les PJ à la convocation d\'Ogath ?', [
      ['Ils obéissent et lâchent l\'enquête', 'La campagne s\'arrête là.'],
      ['Ils continuent', 'Harcèlement permanent (vexations, menaces, pneus crevés) à chaque passage à Notre-Dame.'],
      ['Ils portent plainte officiellement', 'Ils atterrissent chez Richard, qui écoute tout et renseigne Georges.'],
    ])]),
  scene('medes', '10. Sors tes griffes : Medes', 'Notre-Dame (services de Mathias)',
    `Si les PJ laissent entendre officiellement qu'un ange de Mathias est dans l'affaire, Mathias envoie Medes, son nettoyeur. Il soupçonne Pallard, sans preuve : c'est le meilleur allié possible si les PJ pensent eux aussi à Pallard.
Convaincu et sollicité, Medes leur donne l'adresse de Pallard et l'accès à son dossier, qui décrit le groupe de démons qu'il infiltrait : les quatre démons correspondent aux masqués de la maternité. Si les PJ lui apportent des preuves des méfaits de Pallard, il peut les protéger et demander à Mathias de les soutenir contre les harcèlements des anges de Laurent et de Dominique.
S'il assiste à la capture de Pallard, il est ravi de l'interroger à Notre-Dame (hors présence des PJ) et leur en donne le résultat : tout ce que sait Pallard. Si les PJ prouvent que Pallard est un démon, Medes part avec eux en Russie.`,
    [inScene(medes)]),
  scene('opus-dei', '11. L\'Opus Dei : le centre José Maria Escriva de Balaguer', 'Manoir du XVIIe siècle, vallée de Chevreuse',
    `Demeure fortifiée sur un parc d'une dizaine d'hectares, entourée de bâtiments modernes, gardée par la légion Azul. Officiellement centre de retraite spirituelle de l'Opus Dei ; en réalité une usine à endoctriner qui cache le lieu des grandes réunions européennes de JR (Francesco, Guernica, Immaculus, quelques serviteurs de Dieu). Stagiaires logés à la spartiate, invités angéliques dans le confort high-tech.
Les membres de la secte sont des fanatiques mous qui en savent très peu : leur arracher des bribes recoupables prend des heures. En planque, les PJ voient passer les agents de Nouvelle Russie et Pallard : l'Opus Dei sert d'intermédiaire entre les rebelles d'Emmanuel et les fascistes russes pour leur trouver un démon capable de ressusciter Lénine (voir le chapitre Moscou). Les Russes passent quelques jours au manoir.
Les démons enquêteurs y planquent aussi et se font massacrer la première nuit par Guernica et ses légionnaires.
Attaquer ou cambrioler le centre est très difficile et délicat vis-à-vis de la hiérarchie : aucune preuve d'activité illégale, et les dossiers de JR sont dans la tête de Francesco et au siège madrilène. Une attaque frontale est suicidaire mais peut rapporter des prisonniers. Francesco n'est là qu'une journée : le capturer donne une sérieuse option sur la victoire.
Les Russes, qui refusent toute protection, sont vulnérables à l'extérieur ; s'ils sont interceptés, voir le chapitre Moscou. Se présenter officiellement : éconduits, puis nouvelle convocation de Mme Lallemand ; ils seront grillés.`,
    [inScene(guernica), inScene(azul, { qty: 8 }), inScene(francesco)], true,
    [choice('opus', 'Que font les PJ au centre de l\'Opus Dei ?', [
      ['Ils planquent', 'Ils voient passer Pallard et les Russes de Nouvelle Russie ; piste vers Moscou.'],
      ['Ils interceptent les Russes à l\'extérieur', 'Cible vulnérable ; voir le chapitre Moscou pour ce qu\'ils savent.'],
      ['Ils attaquent ou cambriolent', 'Suicidaire et sans preuve préalable ; prisonniers possibles, et Francesco s\'il est là ce jour-là.'],
      ['Ils se présentent officiellement', 'Éconduits, reconvoqués par Mme Lallemand : grillés.'],
    ])]),
  scene('pallard', '12. Pallard : la permanence du PSF et son appartement', 'Ancienne boutique de la rue Lamartine (9e) ; appartement rue Hippolyte-Lebas (9e)',
    `Trois soirs par semaine, les derniers militants staliniens du 9e se réunissent rue Lamartine. Pallard y a pris sa carte, par goût ethnologique : immersion d'entraînement, et bière bon marché grâce à un militant CGT de Kronenbourg. Les PJ peuvent l'intercepter à la sortie ou obtenir ses coordonnées auprès des « camarades », ou dans le fichier papier mal protégé (un coffre toujours ouvert).
Son appartement ne contient rien qui trahisse autre chose qu'un employé de La Poste de la rue Hippolyte-Lebas. Paranoïaque (ange rebelle infiltré chez les démons, qui a trahi une équipe de l'Enfer, et maintenant démon), il compte sur sa discrétion, son air inoffensif et la Polymorphie.
Ce qu'il sait : tous les tenants et aboutissants de l'affaire SOS Bébés (dont il se moque : il agit sur ordre d'Emmanuel pour embêter Mathias) ; presque rien de JR, sauf que Francesco et Goth montent de grosses affaires en France et en Russie ; il est en contact avec des anges russes à qui il doit présenter un démon de Bifrons capable de ressusciter un cadavre.
Intercepté, il nie tout et se réfugie derrière ses ordres de mission d'agent double de Mathias. Vraiment bousculé, il lâche ce qu'il sait de Moscou et de Paris, sans avouer être démon, et pousse les PJ vers Strachnov. Avec Medes, voir la scène 10. Les démons enquêteurs le cherchent aussi : ils peuvent débarquer si les PJ se sont fait suivre, voire le cueillir avant eux.`,
    [inScene(pallard)], true,
    [choice('pallard', 'Que font les PJ de Pallard une fois trouvé ?', [
      ['Ils le livrent à Medes', 'Medes l\'interroge à Notre-Dame et leur transmet tout ce qu\'il sait ; s\'ils prouvent qu\'il est démon, Medes les suit en Russie.'],
      ['Ils l\'interrogent eux-mêmes', 'Il nie, puis livre Moscou et Paris (témoignages sur la fusillade 1 à 2 et sur Katioucha 1 à 2D) en les orientant vers Strachnov.'],
      ['Ils se font suivre par les démons', 'Les démons enquêteurs débarquent et peuvent emporter Pallard avant eux.'],
    ])]),
  scene('camp', '13. Le camp d\'entraînement des scouts d\'Europe', 'Parc de plus de quinze hectares au fond des Yvelines, en bordure de l\'Eure',
    `Mur de pierre de trois mètres surmonté de barbelés, patrouilles de scouts avec chiens, caméras aux endroits stratégiques ; entrée interdite à quiconque n'est pas néofasciste ou assimilé, et les sentinelles ne laissent entrer personne. Une dizaine d'Algeco camouflés autour d'une place d'armes au drapeau royaliste et une vingtaine de tentes militaires ; bois et prairies traversés par une rivière, traces de paintball partout. Toute présence suspecte est arrosée à balles réelles sans sommation, même devant une aura angélique : ordre de tirer sur ce qui n'est pas autorisé.
En permanence : une cinquantaine de scouts et dix à trente légionnaires Azul, sous Jean-Marc Voelckel.
Aux murs du mess des « officiers » : photos et fanions échangés avec tous les groupes venus s'entraîner, dont Nova Russkia et les instructeurs de l'Okefenokee Village (le camp de Dixie Securities). Interrogés, des scouts naïfs racontent les instructeurs étrangers. Aucune trace officielle des Pink Queens, mais le séjour de ces sept militants noirs et homosexuels, imposé par Semper Fidelis (qui ne pouvait pas les entraîner dans son propre camp de Géorgie), a laissé des souvenirs : blagues, photos crades dans les toilettes, entraînement aux explosifs, et l'étonnement qu'on les ait laissés repartir.
La Kommandantur (l'Algeco principal) : coffre-fort enterré sous la baraque, accessible en démontant le plancher. Archives méticuleuses : traces de tous les stages et contacts (scouts, Dixie Securities, Pink Queens, Russes) ; coordonnées de Semper Fidelis et de Dixie Securities ; coordonnées des Russes et de leur stage (Nova Russkia, Miroslav Makovski et Dimitri Polzoski) ; existence des Pink Queens et courriels de Semper Fidelis exigeant leur entraînement, confirmé par un courriel de Francesco expliquant que cela sert la cause blanche et chrétienne.`,
    [inScene(voelckel), inScene(scouts, { qty: 10 }), inScene(azul, { qty: 6 })], true,
    [choice('camp', 'Comment les PJ exploitent-ils le camp ?', [
      ['Ils interrogent des scouts', 'Témoignages sur l\'entraînement des Pink Queens (2L) et liens avec Dixie Securities (1L).'],
      ['Ils fouillent la Kommandantur', 'Dossiers de la Kommandantur (1L) : pistes vers Jacksonville, New York et Moscou.'],
      ['Ils neutralisent le camp', 'TRIC −2 ; combat contre Voelckel, scouts et légionnaires.'],
    ])]),
  scene('saumur', '14. Saumur : le congrès de Familles Chrétiennes', 'Vieux château de Saumur transformé en centre de conférences – J+6 et J+7',
    `Acculée, Christine tente de couvrir le projet de loi en lançant les PJ sur une fausse piste de complot politique national : elle les invite (s'ils la menacent) à ce lobbying officiel de la droite chrétienne auprès des représentants des partis, deux jours durant. Conférences de presse au début et à la fin ; entre les deux, black-out total. Intermède sans intérêt immédiat pour la campagne (à faire comprendre vite aux joueurs), mais bon moment de jeu de rôle : se faire des amis en politique, dénoncer des personnages peu catholiques.
Premier jour : midi accueil ; 13 h conférence de presse de Christine sur le « génocide franco-français », contre-manifestation de gauche, féministes et planning familial ; 14 h ouverture et présentation des participants ; 15 h conférence du Pr Douressamy sur les méfaits cliniques de l'avortement ; 17 h conférence de Mgr de Pouzillac sur l'âme des non-nés ; 18 h fin ; 20 h apéritif ; 21 h dîner ; 23 h 30 fin.
Deuxième jour : 9 h témoignages de trois jeunes filles (une ayant avorté, deux heureuses d'avoir gardé l'enfant d'un viol) ; 10 h 30 présentation du projet de loi ; 12 h déjeuner-débat ; 15 h conférence de presse de clôture.
Si le congrès se déroule sans accroc et sans contradiction, la TRIC grimpe (+5). Preuve : dossier sur le congrès (2D).`,
    [inScene(christine), inScene(congres), inScene(admat)], false,
    [choice('saumur', 'Que font les PJ au congrès ?', [
      ['Ils le laissent se dérouler', 'TRIC +5.'],
      ['Ils réfutent les conférenciers ou font scandale', 'Le congrès ne se déroule pas « sans problème » : pas de +5 ; possibilité de dénoncer Douressamy et consorts.'],
    ])]),
  scene('bilan', '15. Bilan et pistes', 'Rapport à Régine',
    `Les PJ transmettent (ou gardent pour le procès) leurs preuves : seules celles transmises à Régine entrent dans l'IA officiel, qui détermine aussi leurs PA ; mais les méchants réagissent à l'IA connu. Faire le compte de la TRIC et de l'IA (listes dans les notes du scénario).
Pistes ouvertes : Jacksonville (Dixie Securities, Semper Fidelis, camp de l'Okefenokee), New York (les Pink Queens), Moscou (Nouvelle Russie, Strachnov, Katioucha, le démon capable de ressusciter Lénine) et Madrid (Francesco, siège de l'Opus Dei). Medes peut accompagner les PJ en Russie s'ils ont prouvé que Pallard est démon.`),
];

const scenario = {
  id: 'jesus-reviens-1-paris',
  nom: 'Jésus Reviens ! – 1. Paris',
  resume: `Premier épisode de la campagne « Jésus Reviens ! » (MV, anges de grade 1 à 2). Envoyés en secret par Ange et Alain (aidés d'Yves, prévenus par Michel) via leur chargée de mission Régine, pour monter un dossier contre Laurent, Dominique et Georges, les PJ enquêtent sur une « guérison miraculeuse » filmée par France 3 : Lux Imperator, président de SOS Bébés, s'est fait cribler de balles par quatre démons devant une maternité de Montreuil, puis s'est relevé, tandis que des épéistes espagnols de la légion Azul massacraient les agresseurs. Le coup monté, organisé par l'abbé Goth (Immaculus) et Christine Bussy-Rabutin avec l'aide de Pallard, ange d'Emmanuel passé démon, doit relancer une loi anti-avortement. En remontant de la clinique à Saint-Nicolas-du-Chardonnet, à l'Opus Dei, au camp des scouts d'Europe et au congrès de Saumur, sous la pression des anges de Laurent et de Dominique et en concurrence avec une équipe de démons, les PJ découvrent les premiers fils de l'« opération JR » et des pistes vers Jacksonville, New York, Moscou et Madrid.`,
  notes: `Source : ${REF}. Jauges de campagne : TRIC p. 9-10, Index d'Accusation p. 11-12 ; chronologie p. 8-9.
Ton : satire politique très grinçante et volontairement outrancière (intégristes, extrême droite, racisme, meurtre d'une aide-soignante). Doser selon la table.
Structure : enquête ouverte sans ordre imposé ; les scènes 2 à 14 sont des lieux à visiter, la scène 5 (démons enquêteurs) est un fil parallèle. À part le vote de la loi, le battage médiatique et l'enquête des démons, il ne se passe rien si les PJ ne font rien.
Récompenses : pas de PA fixes ; les PA dépendent de l'IA transmis à Régine.

Contexte : Lux Imperator dirige SOS Bébés, façade de Familles Chrétiennes (Christine Bussy-Rabutin, députée PPB), elle-même bras armé du Parti Populiste Bourgeois, dont la frange traditionaliste obéit à la Fraternité Saint Pie XII, inféodée à l'Opus Dei ; Francesco tire les ficelles. Immaculus (abbé Goth), chef spirituel de Saint-Nicolas et aumônier des scouts d'Europe, a demandé à un ange d'Emmanuel de pimenter la campagne anti-avortement ; Emmanuel (devenu Zanag chez Malphas) a mandaté Pallard, qui a envoyé son propre groupe de démons se faire hacher par la légion Azul, prêtée par l'Opus Dei, pour accuser Mathias et se faire bien voir d'Andromalius.
Lux Imperator : ange de Laurent de grade 2 selon l'introduction, ange de Dominique de grade 1 selon sa fiche (fiche retenue).

Chronologie (campagne) :
• Il y a 3 semaines : à la demande de Lux, Immaculus demande à Emmanuel une équipe de démons ; Emmanuel l'oriente vers Pallard (dont il aimerait se débarrasser).
• Il y a 2 semaines : Lux Imperator et Pallard règlent le mode opératoire.
• La veille : fusillade et « résurrection » ; les démons sont abattus par les soldats de Dieu et par Pallard.
• J : les PJ sont convoqués par Régine ; l'Enfer envoie une équipe (dont un ange de Mathias infiltré), qui planque devant la clinique.
• J+1 : les démons torturent à mort une aide-soignante et volent des dossiers inutiles chez SOS Bébés.
• J+2 : les démons planquent devant Saint-Nicolas.
• J+3 : Pallard, Strachnov et Francesco se rencontrent près de Paris (siège de la Confrérie Saint Pie XII / centre de l'Opus Dei) et préparent l'opération Tempête Blanche en Russie.
• J+3/J+4 : les démons, qui ont suivi Immaculus et Guernica, sont déchiquetés par la légion Azul (J+3 23 h dans l'encadré des démons, J+4 dans la chronologie générale).
• J+5 : Pallard contacte Katioucha pour recruter un sorcier capable de ranimer un cadavre (Iossef accepte, surveillé par Edom, ange de Mathias).
• J+6 : début du congrès de Saumur (deux jours).
Ensuite, la TRIC décide de la suite (événements par seuils, p. 10-11 : à 10, début du Klonklave à Jacksonville et de l'opération Big Queen à New York ; à 15, Laurent oriente Semper Fidelis vers Moroni, etc.).

TRIC – modificateurs de l'épisode Paris :
• Fusillade et guérison miraculeuse de Lux Imperator : +5
• Par mois où l'abbé Goth agit impunément depuis Saint-Nicolas-du-Chardonnet : +1
• Une explication scientifique crédible est apportée à la résurrection de Lux Imperator : −2
• Par jour de battage médiatique de Lux Imperator et de Bussy-Rabutin : +1 (maximum +10)
• Le congrès de Saumur se déroule sans problème : +5
• Prouver aux médias que la fusillade est un coup monté : −5
• Empêcher les employés de la crypte de Saint-Nicolas-du-Chardonnet de continuer à travailler sur l'opération JR : −2
• La réunion entre Strachnov, Francesco et Immaculus se termine avec succès : +2
• Neutraliser le camp des scouts d'Europe : −2

Index d'Accusation – preuves de l'épisode Paris (L = Laurent, G = Georges, D = Dominique ; sans lettre = IA générique) :
• Témoignage de Lux Imperator sur l'opération JR : 0 à 1D
• Étude rigoureuse de la vidéo de la fusillade : 2
• Témoignage de Christine Bussy-Rabutin sur l'opération JR : 1 à 2D
• Fichiers de SOS Bébés montrant que l'association est entièrement contrôlée par Familles Chrétiennes : 0
• Témoignage d'Immaculus sur l'opération JR : 0 à 4 (moitié D, moitié L)
• Témoignage de Guernica sur l'opération JR : 0 à 1L
• Témoignage d'Helem et/ou de Luxor sur les ordres de faire pression sur les joueurs : IA officiel au moment du témoignage / 10
• Témoignage d'Ogath sur les ordres de faire pression sur les joueurs : IA officiel au moment du témoignage / 5, en D
• Dossier sur le congrès de Saumur : 2D
• Dossiers complets de Saint-Nicolas-du-Chardonnet : 4L + 4D
• Témoignages des scouts sur l'entraînement des Pink Queens chez les scouts d'Europe : 2L
• Liens entre les scouts d'Europe et Dixie Securities : 1L
• Dossiers de la Kommandantur : 1L
• Enregistrement ou minutes de la réunion entre Strachnov, Immaculus et Francesco : 2D + 2L + 1G
• Dossiers de l'Opus Dei français : 2D + 1L
• Témoignage de Pallard sur la fusillade : 1 à 2
• Témoignage de Pallard sur Katioucha : 1 à 2D

Règles de l'IA (rappel) : chaque preuve transmise à Régine alimente le dossier qu'Ange et Alain montent pour le conseil de discipline. Les fourchettes dépendent de la qualité de la preuve (témoignage confus ou précis…), le MJ est seul juge. IA officiel = somme des preuves transmises, avec ou sans lettre ; IA secret = somme des IA spécifiques (L, G, D) et génériques, transmis ou non. Les méchants réagissent à l'IA (les fuites sont inévitables à Notre-Dame) : les PJ ont intérêt à garder certaines preuves pour le procès, mais leurs PA dépendent de l'IA transmis.

Fiches : caractéristiques du livre pour les anges, démons et soldats de Dieu ; les humains du congrès n'en ont pas. Troupes génériques sans fiche (serviteurs et soldats de Dieu, policiers) : profils du bestiaire de l'application. Arme de Pallard, de Helem et de Luxor, et PP d'Immaculus (scan peu lisible) : estimations signalées dans les fiches.`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [regine, medes, richard, lux, christine, immaculus, guernica, helem, luxor, ogath, pallard, voelckel, scouts, azul,
  serviteurs, soldatsDieu, policiers, suir, francesco, congres, admat, zenif, zoram, paanchi, midoni].map(asType);

// Contrôle : pouvoirs inconnus des règles
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));

writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types,', scenes.reduce((a, s) => a + s.choix.length, 0), 'choix');
