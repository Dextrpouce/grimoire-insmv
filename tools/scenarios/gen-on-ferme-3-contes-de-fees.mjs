// Génère le fichier d'import « insmv-scenario » pour « Les contes de fées finissent mal en général » (On Ferme !, p. 135-153)
// usage : node gen-on-ferme-3-contes-de-fees.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const store = {}; globalThis.localStorage ??= { getItem: (k) => store[k] ?? null, setItem: (k, v) => { store[k] = v; }, removeItem: (k) => { delete store[k]; } };
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);
const S = await import(pathToFileURL(path.join(root, 'js/scenario.js')).href);

const REF = 'On Ferme !, « Les contes de fées finissent mal en général », p. 135-153';
const L = (s) => R.parseLvl(String(s));
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
const ARMES = new Map(R.ARMES.flatMap(([g, l]) => l.map((x) => [x[0], { prec: x[1], puis: x[2], melee: R.MELEE_GROUPS.includes(g) }])));
const arme = (n, table, lvl) => { const w = ARMES.get(table); if (!w) throw new Error('arme inconnue : ' + table); return { n, att: L(lvl), ...w }; };
const poing = (lvl) => arme('Coup de poing', 'Coup de poing', lvl);
// attaque au format du livre (seuil, +X, +Y) : att = X×2, précision 0, puissance Y
const bk = (n, x, y, melee) => ({ n, att: x * 2, prec: 0, puis: y, melee });
const P = 'of3-'; let n = 0; const id = (k) => P + k;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [poing(1)], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});
// profil « PNJ rapide » de l'écran du maître (ange ou démon de tel supérieur, à tel palier de PP)
const quick = (key, camp, sup, palier, o = {}) => {
  const q = S.quickNpc(camp, sup, palier); if (!q) throw new Error('profil rapide inconnu : ' + sup);
  return { ...q, id: id(key), qty: 1, ...o, notes: [o.notes, q.notes, `Personnage : ${REF}.`].filter(Boolean).join('\n') };
};
// fiche toute prête du bestiaire de l'application
const fromBest = (key, bookId, o = {}) => {
  const b = S.BOOK.find((x) => x.id === 'livre-' + bookId); if (!b) throw new Error('bestiaire : ' + bookId);
  return { ...JSON.parse(JSON.stringify(b)), id: id(key), qty: 1, ...o, notes: [o.notes, b.notes, `Utilisé dans : ${REF}.`].filter(Boolean).join('\n') };
};
const ATT_NOTE = 'Attaque au format du livre (seuil, +X, +Y) : attaque = X×2, puissance Y.';

// ---------------- Chapitre 1 : les « Chevaliers du Saint Suaire » ----------------
const henri = npc('henri', {
  nom: 'Henri James', source: 'Ange d\'Yves, grade 1 (mentor des Chevaliers du Saint Suaire)', type: 'ange', car: car('3 3 3 5 3 4'), def: L(2),
  pp: 19, pfFix: 8, seuilsFix: seuils('6/12/18/24'),
  armes: [bk('Browning béni', 4, 5, false)],
  pouvoirs: pows('Conversion mentale 2, Philosophie 3, Sommeil 3, Volonté supra-normale 2'),
  talents: 'Baratin 4, Défense 2, Discussion 5, Enquête 4, Tir 2 (arme de poing 4), Hobby [Archéologie religieuse] 4, Savoir occulte 3 (Reliques 4), Citer Umberto Eco 4 (en italien 5+)',
  notes: `Professeur de français d'une cinquantaine d'années, poivre et sel, sourire énigmatique ; scrabble de voyage et Bible. Chef du club, ne lâche jamais ses notes : il faut s'en emparer (voir scène 3).\nAvec Roxane, chargé par Albrecht d'enquêter sur le regain d'activité des fées. Obsédé par le sujet, il en parle volontiers.\n${ATT_NOTE}`,
});
const roxane = npc('roxane', {
  nom: 'Roxane Linon de La Danetière', source: 'Ange de Blandine, grade 1', type: 'ange', car: car('3 4 3 4 4 4'), def: L(3),
  pp: 22, pfFix: 7, seuilsFix: seuils('6/12/18/24'),
  armes: [bk('Revolver petit calibre', 3, 3, false)],
  pouvoirs: pows('Augmentation d\'Agilité 2, Aura de confusion 2, Esquive acrobatique 2, Rêve divin 3'),
  talents: 'Baratin 3, Défense 3, Séduction 4+, Tir 3 (arme de poing 5), Aisance sociale 5, Savoir occulte 2 (Reliques 3), Vérifier son maquillage 4+',
  notes: `Belle brune bien pensante façon Lara Croft, manipulatrice et vaniteuse. Arrive à 16 h en voiture de sport avec Tarek ; s'enferme pour fouiller sa chambre à la recherche de micros (deux revolvers à portée de main), puis soins de beauté devant la télé.\nSes documents : un article contre les fées (exil dans une Marche « pour s'épanouir par le travail »), un carnet avec les numéros d'Albrecht et Nathan, l'adresse d'Henri et celle du centre culturel Ste Anne Claire (Paris 5e) avec les mots « Valfroy » et « Tinytoyland ».\nAvertissement : intégrisme.\n${ATT_NOTE}`,
});
const steven = npc('steven', {
  nom: 'Steven Chenaux', source: 'Ange de Christophe, grade 1', type: 'ange', car: car('3 4 4 3 3 4'), def: L(5),
  pp: 18, pfFix: 6, seuilsFix: seuils('6/12/18/24'),
  armes: [bk('Mains nues (non létal)', 5, 0, true)],
  pouvoirs: pows('Arts martiaux 2, Aura d\'inattention 2'),
  talents: 'Corps à corps 5, Défense 5, Discrétion 5, Athlétisme 5, Acrobatie 5, Hobby [Donner un coup de main] 3+, Frimer et prendre des risques inutiles 4',
  notes: `Vingt ans à peine, taches de rousseur, polo blanc et short, crucifix bien visible : ancien chef scout casse-cou au petit côté Tintin. Incapable de rater une bonne action : s'il croise le PJ qui joue le « vieux fou de la ferme », il l'aide pendant des heures aux travaux de la ferme.\nPouvoir « Chance 2 » du livre, absent des règles de l'application : à gérer à la main.\nAvertissement : exagérément altruiste.\n${ATT_NOTE}`,
});
const tarek = npc('tarek', {
  nom: 'Tarek Anelouk', source: 'Ange de Georges, grade 1 (ancien de Khalid)', type: 'ange', car: car('5 4 3 3 2 3'), def: L(4),
  pp: 19, pfFix: 8, seuilsFix: seuils('8/16/24/32'),
  armes: [bk('Cimeterre béni', 8, 4, true)],
  pouvoirs: pows('Colère divine 2, Jet de flammes 2, Membre blindé 2, Sens surdéveloppés'),
  talents: 'Baratin 2, Combat 4 (cimeterre 5), Défense 4, Tir 3 (arme d\'épaule 4), S\'énerver tout seul 3+',
  notes: `Crâne rasé, moustache en guidon de vélo, costume impeccable, « La Bible pour les nuls ». Remplace Alban Dubout (ange de Laurent décrit dans les notes de Karbalac, tombé au combat) : les PJ ne l'attendent pas.\nAncien ange de Khalid revenu à Georges ; « autochristianisation » laborieuse. Soupe au lait mais pas idiot. Un boulet à l'hôtel : visite des cuisines, conversation forcée, fixette sur la gravure des sept sorciers.\n${ATT_NOTE}`,
});
const bellasco = npc('bellasco', {
  nom: 'Kévin Pichegru (Bellasco)', source: 'Démon renégat de Scox, mercenaire des Templiers (ConPsi)', type: 'demon', car: car('2 3 4 4 3 4'), def: L(2),
  pp: 28, pfFix: 6, seuilsFix: seuils('4/8/12/16'),
  armes: [bk('Jet de flammes', 8, 4, false)],
  pouvoirs: pows('Champ de force 3, Charme 3, Jet de flammes 2, Possession 3, Volonté supra-normale 2'),
  talents: 'Baratin 5, Défense 2, Prendre un air mystérieux 3, Tir 2 (Jet de flammes 4), Aisance sociale 5, Savoir occulte 2 (rayon ésotérisme de la FNAC 3+), Avoir horreur de se faire traiter comme un bleu 5+',
  notes: `Dans le corps d'un enfant de dix ans (t-shirt « Shrek », petites lunettes, raie sur le côté), ce qui l'exaspère. Espionne lui aussi les Chevaliers ; ne connaît que des bribes de l'histoire de malédiction et veut la relique censée contenir l'âme de sept démons. Toute alliance avec les PJ finira vite et mal.\nSait qui sont les anges, se méfie des Arlot et du personnel de l'hôtel. Reste dans sa chambre avec un livre d'ésotérisme pendant que « maman » entretient quatre pistolets-mitrailleurs.\nS'il perd l'un des siens, il appelle des renforts : cinq psis des Templiers (10 PP).\n${ATT_NOTE}`,
});
const pichegru = npc('pichegru', {
  nom: 'Famille Pichegru (Bernard, Anna, Michaël, Clémentine)', source: 'Humains possédés par des démons mineurs, au service de Bellasco', type: 'demon', qty: 4, car: car('2 2 3 2 3 2'), def: L(2),
  armes: [bk('Pistolet-mitrailleur (attaque multiple)', 1, 4, false)],
  pouvoirs: pows('Charme 1, Membre exotique : griffes 1'),
  talents: 'Baratin 3, Défense 2, Discrétion 2, Tir 2 (arme de poing 3+), Aisance sociale 2+, Séduction 2+',
  notes: `Famille bourgeoise BCBG, conversations intellos : parents quadragénaires sportifs, enfants presque majeurs. Le père file au café observer Henri, l'aînée (« grande sœur ») fouine dans l'hôtel et allume Jacques Arlot, le cadet se promène jusqu'à la chapelle.\nPF, PP et seuils non donnés par le livre : calculés par l'application d'après le type démon (estimation).\n${ATT_NOTE}`,
});
const elvis = npc('elvis', {
  nom: 'Elvis', source: 'Familier d\'élite (ex-Foutrak), maître d\'hôtel de l\'Auberge Rouge', type: 'familier', car: car('2+ 3 3 2+ 2+ 2+'), def: L(3),
  pp: 9, pfFix: 5, seuilsFix: seuils('4/8/16/24'),
  armes: [arme('Revolver', 'Revolver petit calibre', '3+'), poing(1)],
  pouvoirs: pows('Augmentation de Présence 2, Polymorphie 1, Volonté supra-normale 2'),
  talents: 'Baratin 3, Défense 3, Discrétion 3, Discussion 3, Intrusion 2+, Médecine 2+, Aisance sociale 2+, Cuisine & Repassage 2+, Survie 2 (Forêt 3), Se rendre utile 3, Tir 3 (arme de poing 3+), Séduction 3',
  notes: 'Majordome entre deux âges, très british et pince-sans-rire. Connu au village : il passe pour être parti à Paris en confiant l\'hôtel à un « cousin ». Expose aux PJ le plan des trois démons morts et répond de son mieux.\nArme non précisée : revolver petit calibre estimé (Tir arme de poing 3+).\nCréé par le marquis Méphistophélès : s\'il survit et que l\'équipe lui fait une belle réputation, il deviendra démon.',
});
const socrate = npc('socrate', {
  nom: 'Socrate', source: 'Familier d\'élite (ex-Foutrak), ombre intangible', type: 'familier', car: car('2+ 3 3 2+ 2+ 2+'), def: L(3),
  pp: 9, pfFix: 5, seuilsFix: seuils('4/8/16/24'),
  armes: [{ n: 'Griffes', att: L('3+'), prec: 0, puis: 2, melee: true }],
  pouvoirs: pows('Anaérobiose, Déphasage 1, Immunité contre les maladies et les poisons, Jeûne, Membre exotique : griffes, Obscurité 2'),
  talents: 'Baratin 3, Défense 3, Discrétion 3, Discussion 3, Intrusion 2+, Médecine 2+, Aisance sociale 2+, Cuisine & Repassage 2+, Survie 2 (Forêt 3), Se rendre utile 3, Corps à corps 3+, Voyager dans un sac ou une valise 3',
  notes: 'Plus déluré qu\'Elvis : ombre très discrète la nuit (bonus de 10 colonnes en discrétion nocturne). A survécu à l\'accident de voiture grâce à sa nature éthérée.\nDéphasage « inversé » dans le livre (il est déphasé par défaut et se matérialise).\nGriffes : précision et puissance estimées (Corps à corps 3+).\nS\'il survit et que l\'équipe lui fait une belle réputation, il deviendra démon.',
});
const arlot = npc('arlot', {
  nom: 'Jacques Arlot et Sophie', source: 'Clients humains : agent commercial et sa secrétaire', qty: 2,
  notes: 'Couple adultère (il a prétexté un séminaire). Disputes tonitruantes, exigences princières, appels discrets à « Madame » depuis le jardin qui peuvent paraître suspects. Sert au MJ à relancer l\'action ou poser l\'ambiance ; témoins gênants si la fusillade éclate.\nPas de caractéristiques dans le livre : humains normaux.',
});
const psis = fromBest('psis', 'psi-templiers-10', { qty: 5, notes: 'Renforts de Bellasco : cinq psis des Templiers (10 PP), s\'il perd l\'un des siens avant le rituel.' });
const laurent15 = quick('laurent15', 'ange', 'Laurent', 15, { qty: 2, notes: 'Renforts des anges si l\'un d\'eux disparaît : deux anges de Laurent (15 PP) et deux sections de soldats de Dieu encerclent la chapelle à la tombée de la nuit.' });
const soldats = fromBest('soldats', 'soldat-dieu', { qty: 6 });
const mephisto = npc('mephisto', {
  nom: 'Marquis Méphistophélès', source: 'Démon puissant, rival déçu de Scox, créateur de familiers', type: 'demon',
  notes: 'Pas de caractéristiques : ne combat pas. Présent au débriefing pour évaluer Elvis et Socrate, dont il a choisi les âmes et modelé les corps. S\'ils ont été maltraités, sacrifiés bêtement ou critiqués devant lui, il en retire la garde et devient un ennemi puissant ; s\'ils ont été bien traités et qu\'on dit du bien de lui, il les laisse jusqu\'à la fin.\nVoir « Sur la Terre comme au Ciel ».',
});

// ---------------- Chapitre 2 : fées et anges ----------------
const korrigans = npc('korrigans', {
  nom: 'Korrigans', source: 'Fées noires de Bretagne (protégées par Gaziel)', type: 'fee', qty: 6, car: car('1 4 3 4 2 3'), def: L(3),
  pp: 12, pfFix: 4, seuilsFix: seuils('2/5/7/10'),
  armes: [bk('Griffes (comme ongles d\'acier)', 4, 3, true)],
  pouvoirs: pows('Invisibilité'),
  talents: 'Baratin 3+, Corps à corps 2, Défense 3, Discrétion 5, Intrusion 3, Basse sorcellerie 3, Prestidigitation 5, Travailler la pierre 4',
  notes: `60 cm, petites cornes, pieds de bouc, griffes de chat, tous les vices. Bannis de leur peuple bien avant la tragédie, alliés de longue date des Celtes et de l'Enfer contre le christianisme (trois bistrots pour chaque église).\nInvisibilité « comme un elfe noir ». Certains ont en plus Augmentation de Force 4, ou Contrôle des pierres 2 et Faire parler les pierres 2 (pouvoirs absents des règles de l'application).\n${ATT_NOTE}`,
});
const mistigri = npc('mistigri', {
  nom: 'Mistigri', source: 'Chef des Korrigans de « la Sirène »', type: 'fee', car: car('1 4 3 4 2 3'), def: L(3),
  pp: 12, pfFix: 4, seuilsFix: seuils('2/5/7/10'),
  armes: [bk('Griffes', 4, 3, true)], pouvoirs: pows('Invisibilité'),
  talents: 'Baratin 3+, Corps à corps 2, Défense 3, Discrétion 5, Intrusion 3, Basse sorcellerie 3, Prestidigitation 5, Travailler la pierre 4',
  notes: 'Charismatique et velu, lucide : ne compte ni sur Puck ni sur Titania. Rassemble fées et sympathisants (Mary Morgans, Celtes comme Yvonne Glantec et ses cinq filles, druides) pour une contre-attaque contre Nathan. Plan inexistant : une embuscade.\nPas de caractéristiques propres : profil des Korrigans repris (estimation).',
});
const mary = npc('mary-morgans', {
  nom: 'Jack Rackham, Ann Bonny et Mary Read', source: 'Ex-Mary Morgans, démons de Vephar, grade 2', type: 'demon', qty: 3, car: car('4 4 4 3 4 3'), def: L(5),
  pp: 25, pfFix: 6, seuilsFix: seuils('6/12/18/24'),
  armes: [bk('Sabre de marine maudit (tueur de Français)', 9, 8, true)],
  pouvoirs: pows('Anaérobiose, Charme 2, Esquive acrobatique 2, Membre exotique : crocs, Poison 2, Vie subaquatique'),
  talents: 'Corps à corps 4, Combat 4 (Sabre 7), Défense 5, Discrétion 4, Hobby (Triolisme) 3, Métier (Frères de la côte) 4, Savoir militaire 3 (Pas de quartier ! 4+), Tir 3 (Arme de poing 4), Chants de marin et éclusage d\'alcool 6+',
  notes: `Fées très anciennes passées à l'Enfer avant la purge de Georges, puis pirates anglais ; ils ont survécu des siècles sous forme mémétique jusqu'à la nomination de Vephar. Séduisants, cruels, fêtards et arrangeants avec les PJ. Dreadlocks, bijoux, tatouages.\nBras armé des Korrigans : amènent Mariel (Jean-Luc renégat qui veut expier Durancum) et Grö Syrill (ex-Baal à la tronçonneuse).\nPouvoir « Corps mémétique » absent des règles de l'application.\n${ATT_NOTE}`,
});
const keraudy = npc('keraudy', {
  nom: 'Jean-Loup Keraudy', source: 'Maître-nageur retraité de Plouhinec, « boîte aux lettres » des fées', car: car('1 1 2 2 2 2'),
  notes: 'Près de quatre-vingts ans, intarissable sur l\'histoire de la natation et les maillots de bain. Confirme avoir chanté une nuit avec des Korrigans à « la Sirène ». Charmé par les fées, il cache chez lui trois émissaires (Jack, Ann et Mary).\nPas de caractéristiques dans le livre : vieillard estimé.',
});
const bubble = quick('bubble', 'ange', 'Didier', 15, { nom: 'Bubble et Mésange', qty: 2, notes: 'Anges de Didier, grade 1 (15 PP) : tiennent le centre culturel Ste Anne Claire, portes closes, et mènent le programme de « christianisation audiovisuelle » des lutins. Mésange enterre les cobayes morts dans la courette, sous des croix en bâtons d\'esquimaux.' });
const rene = quick('rene', 'ange', 'Jean', 15, { nom: 'René', pp: 17, notes: 'Ange de Jean (17 PP dans le livre ; profil rapide 15 PP). Au centre culturel avec Bubble, Mésange et Valfroy.' });
const valfroy = npc('valfroy', {
  nom: 'Valfroy', source: 'Ange de Didier, grade 2 (troisième initiateur de Tinytoyland)', type: 'ange', car: car('2 3 4 4 4 4'), def: L(3),
  pp: 26, pfFix: 6, seuilsFix: seuils('5/10/15/20'),
  pouvoirs: pows('Charme 4, Chant angélique 4, Langage universel, Lumière céleste 5, Message officiel, Sommeil 4'),
  talents: 'Baratin 3, Défense 3, Discussion 3, Casuistique 3, Passion [Accompagner les anges dans leurs projets] 4, Rêve [Créer chaque jour un monde meilleur] 4+, Vocation [se donner l\'excellence pour défi] 5',
  notes: 'Communicant tête à claques, sourire étincelant, costume blanc, auréole rétractable (reste d\'un vieil avertissement). Ambitieux et intégriste, mais sincère : il veut convertir et baptiser les fées pour sauver leurs âmes, quitte à toutes les tuer.\nChef du centre culturel. Aucune arme indiquée.',
});
const hildegarde = quick('hildegarde', 'ange', 'Joseph', 25, { nom: 'Mère Hildegarde', notes: 'Mère supérieure du couvent Ste Eulalie : vieille bique, ange de Joseph grade 2 (25 PP). Fière de la gravure de saint Georges du réfectoire, reçoit volontiers un faux historien prévenu par téléphone ; soupçonneuse envers vagabonds et voleurs. Chaque soir, elle torture une fée prisonnière pour lui arracher des aveux sur ses liens avec Satan.' });
const soeursJ = quick('soeurs-joseph', 'ange', 'Joseph', 15, { nom: 'Sœurs anges de Joseph', qty: 2, notes: 'Deux des neuf « sœurs » (Cunégonde, Radegonde, Frédégonde…) : anges de Joseph, 15 PP.' });
const soeursG = quick('soeurs-georges', 'ange', 'Michel', 10, { nom: 'Sœurs anges de Georges', source: 'Anges de Georges, grade 1', qty: 2, pp: 12, notes: 'Deux des « sœurs » : anges de Georges (12 PP dans le livre). Pas de profil rapide pour Georges : profil d’ange de Michel à 10 PP (estimation).' });
const soeursS = fromBest('soeurs-soldates', 'ecran-section-lourde', { nom: 'Sœurs soldates de Dieu (section lourde)', qty: 5, notes: 'Cinq soldates de Dieu de la section lourde déguisées en nonnes ; leurs cellules cachent plus de fusils-mitrailleurs que de chapelets.' });
const canine = npc('canine', {
  nom: 'Canine Toothkeeper', source: 'La fée des dents, sorcière unseelie', type: 'fee', car: car('2 3 3 5 4 5'), def: L(3),
  pp: 21, pfFix: 7, seuilsFix: seuils('3/6/9/12'),
  armes: [arme('Épée', 'Épée longue', 5)],
  pouvoirs: pows('Obscurité 4, Vol 4, Volonté supra-normale 4, Invisibilité'),
  talents: 'Baratin 4, Combat 3 (épée 5), Défense 3, Discrétion 4, Basse sorcellerie 7, Haute sorcellerie 5, Métier (Recueillir des dents) 3, Moto 4, Savoir occulte 3 (Fées et mystères anciens 7), Survie 3 (envers et contre tous 7)',
  notes: 'Cheveux et yeux de jais, sourire carnassier, combinaison de moto noire, collier de dents de lait. Passée pour morte à Durancum, réchappée de l\'Inquisition, devenue la fée des dents en Amérique ; revenue en France, écœurée par le retour de Georges. Prisonnière au couvent Ste Eulalie (sa moto noire est garée à l\'entrée).\nConnaît le rituel de Jérémy et veut le détourner au dernier moment : la porte s\'effondrerait et son énergie renforcerait toutes les fées. N\'attend rien de l\'Enfer, mais accepte son aide et se montre sous son meilleur jour.\nPouvoirs « Corps mémétique » et « Diminution 4 » absents des règles de l\'application ; Invisibilité « comme un elfe noir ».\nArme non précisée : épée longue estimée (Combat épée 5).',
});
const tordus = npc('tordus', {
  nom: 'Gang des tordus', source: 'Faux-monnayeurs nains et gobelins (Snil, Lard, Olf, Nulf, Greif, Troheim, Klaw)', type: 'fee', qty: 7,
  notes: 'Prisonniers du couvent depuis plus d\'un mois, à bout de forces (tenailles de la mère supérieure). Avaient monté un réseau d\'achat d\'armes et une caravane près d\'Évry. Reconnaissants : ils offriront à chaque démon 30 000 € en faux billets quelques jours plus tard.\nPas de caractéristiques dans le livre.',
});

// ---------------- Chapitre 3 : le pèlerinage ----------------
const nathan = npc('nathan', {
  nom: 'Nathan', source: 'Ange de Georges, grade 3 (sécurité de Tinytoyland)', type: 'ange', car: car('6 4 4 3 4 4'), def: L(6),
  pp: 35, pfFix: 9, seuilsFix: seuils('9/18/27/36'), prot: 0,
  armes: [bk('Lance bénite majeure (aura électrique)', 12, 11, true)],
  pouvoirs: pows('Armure corporelle 4, Aura de courage 4, Colère divine 6, Décharge électrique 6, Némésis 6, Régénération 2, Télépathie 1, Téléportation 2, Volonté supra-normale 6'),
  talents: 'Combat 6 (Lance 9), Défense 6, Discussion 6, Intimidation 9, Culture générale 3 (Histoire chrétienne 5), Savoir militaire 7 (Ouvrir une canette avec ses dents 8+)',
  notes: `Gendre idéal, lunettes fumées même dans le brouillard, treillis, tatouage « Dieu le veut », sifflet. A servi Laurent puis Daniel pendant la retraite de Georges, qu'il a rejoint à son retour. Optimiste, soutenu en secret par son archange ; craint seulement une intervention du Conseil. Expulse sans hésiter anges ou humains de « son » pèlerinage.\nArmure corporelle « de bronze ». Si l'on tarde à le gêner, il risque de vaincre Grö Syrill puis de foncer sur les PJ pendant les cinq tours du rituel.\n${ATT_NOTE}`,
});
const albrecht = npc('albrecht', {
  nom: 'Albrecht', source: 'Ange d\'Yves, grade 2 (théoricien de Tinytoyland)', type: 'ange', car: car('3 3 4 5 3 5'), def: L(3),
  pp: 29, pfFix: 8, seuilsFix: seuils('6/12/18/24'),
  pouvoirs: pows('Chant angélique 4, Conversion mentale 4, Lumière céleste 4, Philosophie 4, Sommeil 2, Volonté supra-normale 4'),
  talents: 'Défense 3, Discussion 8, Enquête 5, Culture générale 8 (Histoire chrétienne 9), Savoir occulte 6 (Faërie 8), Casuistique 4+ (Justifier le massacre des fées 6+)',
  notes: 'Papy gâteau aux lunettes d\'écaille, sourire faussement doux, flasques d\'eau bénite sous la soutane. Grade 2 aigri, mis sur une voie de garage pour ses positions contraires à Yves, qu\'il savoure de contrarier. Surveille l\'occulte du bassin parisien et du centre depuis vingt ans, apprécié des anges « durs ». Ne s\'intéresse qu\'à la réussite du rituel.\nAucune arme indiquée.',
});
const jeremy = npc('jeremy', {
  nom: 'Père Jérémy Marne', source: 'Serviteur de Dieu très spécial (sorcier d\'Albrecht)', type: 'serviteur', car: car('1 2 2 4 2+ 3+'), def: L('1+'),
  pp: 7, pfFix: 5, seuilsFix: seuils('2/4/6/8'),
  pouvoirs: pows('Volonté supra-normale 2'),
  talents: 'Défense 1+, Discussion 3, Basse sorcellerie 4, Savoir occulte 4 (Sorcellerie 5)',
  notes: 'Tenue de prêtre des grands jours, grimoire ancien. Au service d\'Albrecht depuis trente ans ; seul (avec Nathan et Valfroy) à connaître le projet. Mène le rituel de basse sorcellerie déguisé en messe en latin. Canine compte l\'égorger pour finir le rituel à sa façon.\nCh du livre reportée en Foi.',
});
const john = quick('john', 'ange', 'Laurent', 20, { nom: 'John the Revelator', pp: 22,
  talents: undefined, notes: 'Ange de Laurent british en costard (22 PP dans le livre ; profil rapide 20 PP). Repère les trouble-fêtes démoniaques, mais Kronos contre ses pouvoirs. Bonus du livre : Savoir d\'espion 2 (coups de fil sibyllins 4), Détection du mal 2, Détection du danger 3. Gros calibre avec silencieux.' });
john.talents = S.quickNpc('ange', 'Laurent', 20).talents + ', Savoir d\'espion 2 (Passer des coups de fil sibyllins 4)';
const purs = quick('purs', 'ange', 'Michel', 10, { nom: 'Compagnie des Purs (anges)', source: 'Anges de Georges, Joseph et Laurent, grade 1', qty: 6, pp: 13, notes: 'Yvan, Gus, Raymond (Georges), Robert, Aaron (Joseph), Boris (Laurent), tous à 13 PP : profil rapide d\'ange de Georges à 10 PP pour tous (simplification). Pénitents cagoulés qui s\'autoflagellent sous une croix de six mètres ; PM et poignards dans les sacs. Avertissement : fanatique.' });
const grosyrill = quick('gro-syrill', 'demon', 'Baal', 20, { nom: 'Grö Syrill', notes: 'Ex-démon de Baal amoureux de sa tronçonneuse vert pomme, ami des Mary Morgans, motivé par les anges de Georges à découper. Se téléporte au milieu de la bataille à la recherche de Nathan.\nPas de caractéristiques dans le livre : profil rapide de démon de Baal (20 PP), tronçonneuse ajoutée (estimation).' });
grosyrill.armes.push({ n: 'Tronçonneuse', att: grosyrill.armes[0].att, prec: -4, puis: 4, melee: true });
const carmilla = npc('carmilla', {
  nom: 'Carmilla', source: 'Ancienne fée au service de Samigina', type: 'demon',
  notes: 'Lance ses goules sur les anges pendant l\'embuscade. Pas de caractéristiques dans le livre : utiliser un démon de Samigina ou le vampire du bestiaire si besoin.',
});

const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; delete t.typeId; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  scene('briefing', '1. Briefing à l\'Auberge Rouge', 'Hôtel « l\'Auberge Rouge », Champigny-le-Château – samedi 14 h',
    `Le contact habituel (sinon Turbigo, Baalberith grade 2) convoque les PJ à 14 h dans l'hôtel fermé ; buffet froid, exposé à l'heure pile.
Situation : Foutrak (Beleth), Gorgoroth (Morax) et Karbalac (Kobal) ont attiré un cercle d'anges, les « Chevaliers du Saint Suaire », dans un faux rituel satanique prévu à minuit (documents laissés à portée d'une taupe de Mathias, ensuite éliminée). Mais les trois démons se sont tués en voiture, ivres, au retour de boîte. Les PJ doivent les remplacer au pied levé.
Mission : éliminer les anges, surtout récupérer les notes d'Henri James et tout document utile. Agir de nuit : le bled est calme, une action de jour serait désastreuse.
Elvis (le maître d'hôtel) et Socrate passent sous la tutelle des PJ. Elvis expose le plan :
• Roxane a réservé quatre chambres, arrivée vers 16 h.
• Cérémonie à minuit dans la chapelle en ruine, à 3 km du village et à deux pas de la forêt (idéal pour une embuscade). Calice satanique, faux grimoire, bures rouges.
• Passage secret de la cave vers un réduit : objets du « rituel », deux fusils-mitrailleurs, un fusil à lunette, un magnétophone et une cassette de chants inuits.
• Rôles prévus : Foutrak = Régis Monmoulin, patron ; Gorgoroth = un employé (les deux vrais sont en congé) ; Karbalac = le « vieux fou » de la ferme isolée (le vrai fermier, Patrick Charnu, est en vacances et a laissé ses clefs).
• Notes de Karbalac sur les quatre anges (Henri, Steven, Roxane, Alban) : voir les fiches.
• L'hôtel (deux étages, une dizaine de chambres) est à 500 m du hameau. Un couple et une famille sont attendus vers 17 h. Rien pour espionner les clients.
• Gravure de l'exécution de sept sorciers en 1366 dans l'escalier : un faux de Gorgoroth, sans lien, mais qui fera cogiter les anges.
• Ni l'église ni la chapelle n'ont de pouvoir. Gendarmerie à 12 km.
Astuce de table : un minuteur de cuisine pour limiter la préparation ; quand il sonne, il est 16 h.`,
    [inScene(elvis), inScene(socrate)]),
  scene('arrivees', '2. Devine qui vient t\'épier ce soir', 'Auberge Rouge et village – samedi 16 h à 20 h',
    `Arrivées : 16 h Roxane et Tarek (imprévu : il remplace Alban) ; 16 h 30 Steven et Henri repèrent la place de l'église en vieille Fiat ; 16 h 50 M. et Mme « Arlot » ; 17 h 05 la famille Pichegru. Deux amis rejoindront Roxane au souper.
Les PJ doivent rendre crédible la vie de l'hôtel tout en espionnant. Comportements des anges si rien ne les dérange :
• Tarek : en-cas, mouche « trouvée » dans son plat, insiste pour voir les cuisines, fixette sur la gravure.
• Roxane : fouille sa chambre une heure (micros), revolvers à portée, puis soins de beauté et séries TV.
• Henri : paye des verres au café du village pour glaner des rumeurs (rien d'occulte), revient frustré.
• Steven : visite discrète de l'église, du cimetière et de la chapelle ; s'il croise le « vieux fou », il l'aide toute l'après-midi à la ferme.
Les anges se téléphonent souvent.
Les Arlot : Jacques est venu avec sa secrétaire Sophie ; engueulade au champagne, exigences de chieurs, appels suspects à sa femme depuis le jardin.
Les Pichegru : Kévin est Bellasco, renégat de Scox au service des Templiers, venu coiffer les anges au poteau ; sa famille est possédée. Le père observe Henri au café, l'aînée fouine et allume Jacques, le cadet va droit à la chapelle, la mère entretient quatre PM. Très discrets.
Documents à voler : carnet d'Henri (bar breton fantôme avec un nom encadré en rouge, réouverture d'un passage vers Faërie que l'ange Albrecht veut fermer par un rituel, captures de fées par les serviteurs de Nathan : un gang de faux nains trafiquants près d'Évry, une fée sanguinaire revenue du Québec ; détenus au couvent Ste Eulalie près de Reims). Les informations « entre crochets » (Albrecht grade 2 d'Yves, Nathan grade 3 de Georges, rituel de basse sorcellerie à pèlerinage, « Chez Régis ») ne sont données qu'aux PJ assez savants en occulte. Papiers de Roxane : voir sa fiche.
Les démons peuvent pousser la farce (objets sataniques chez les Arlot…).`,
    [inScene(roxane), inScene(tarek), inScene(henri), inScene(steven), inScene(arlot), inScene(bellasco), inScene(pichegru), inScene(elvis), inScene(socrate)], false,
    [choice('notes', 'Les PJ récupèrent-ils les notes d\'Henri et les papiers de Roxane ?', [
      ['Oui', '+2 PA au débriefing ; le chapitre 2 s\'appuie dessus.'],
      ['Non', 'Au chapitre 2, le contact donne l\'adresse d\'Henri (tenue de Foutrak) : replacer chez lui ce qui manque.'],
    ])]),
  scene('nuit', '3. Nid de vipères dans un panier de crabes', 'Auberge Rouge, puis chapelle en ruine à l\'orée de la forêt – samedi soir et nuit, orage',
    `Si personne n'a déraillé : vers 20 h les quatre anges se réunissent chez Tarek, doutent du rituel, puis apéro au bar et dîner (un seul service). Les anges surveillent les autres clients. Après le dîner, « chevaliers » et « templiers » partent en « promenade digestive » avec de lourds sacs de sport et se cachent près de la chapelle.
Les deux groupes se repèrent probablement vers 23 h et s'entretuent ; les anges gagnent, affaiblis, restent en planque puis rentrent vers 2 h fouiller les affaires des Pichegru avant de filer. Un groupe méfiant peut revenir espionner l'hôtel.
Tout est possible : faux rituel joué par les PJ, baston à l'hôtel, Auberge Rouge en feu dans une fusillade à trois (l'orage couvre le bruit). L'essentiel : plus aucun témoin à l'arrivée des pompiers et gendarmes (pauvres Arlot). Une faction qui se replie en bon ordre reviendra pimenter la suite.
Renforts si un groupe perd un membre (assassinat discret) avant le soir : il quitte l'hôtel et attend le rituel dans la forêt. Pichegru : cinq psis des Templiers (10 PP). Anges : deux anges de Laurent (15 PP) et deux sections de soldats de Dieu encerclent la chapelle à la tombée de la nuit.`,
    [inScene(henri), inScene(roxane), inScene(steven), inScene(tarek), inScene(bellasco), inScene(pichegru, { qty: 4 }), inScene(elvis), inScene(socrate)], true,
    [choice('renforts', 'Un des groupes a-t-il perdu un membre avant la nuit ?', [
      ['Non', 'Pas de renforts.'],
      ['Les Pichegru', 'Cinq psis des Templiers (10 PP) rejoignent Bellasco dans la forêt.'],
      ['Les anges', 'Deux anges de Laurent (15 PP) et deux sections de soldats de Dieu encerclent la chapelle ; −1 PA au débriefing.'],
    ]),
    choice('issue1', 'Comment finit la nuit ?', [
      ['Tous les anges sont morts, aucun témoin', 'Débriefing à l\'Auberge Rouge (+2 PA).'],
      ['Des anges se sont enfuis', '−1 PA par ange ; les survivants reviendront dans la suite, et l\'alerte est donnée dès le lundi.'],
      ['Des humains ont vu des choses et vivent', '−2 PA ; lieu grillé, débriefing au Hilton du Champ-de-Mars.'],
    ])]),
  scene('renforts', '3 bis. Renforts possibles', 'Forêt près de la chapelle',
    'Fiches des renforts de la scène 3, à n\'utiliser que si le choix correspondant a été fait.',
    [inScene(psis, { qty: 5 }), inScene(laurent15, { qty: 2 }), inScene(soldats, { qty: 6 }), inScene(soldats, { qty: 6 })], true),
  scene('debriefing', '4. Le livre d\'or de l\'Auberge Rouge', 'Auberge Rouge (ou Hilton du Champ-de-Mars, Paris) – dimanche matin',
    `Si l'affaire a été bien menée, débriefing à l'Auberge Rouge ; sinon, lieu grillé : convocation au Hilton du Champ-de-Mars.
Le contact vient avec le marquis Méphistophélès, créateur de familiers, qui évalue Elvis et Socrate (voir sa fiche) : maltraités, sacrifiés ou critiqués, il les reprend et devient un ennemi ; bien traités et flatté, il les laisse jusqu'à la fin.
Barème du chapitre 1 (p. 140) :
• Débriefing à l'Auberge Rouge : +2 PA
• Des humains ont vu des choses et sont toujours en vie : −2 PA
• Des anges ont pu s'enfuir : −1 PA par ange
• Des renforts angéliques sont venus : −1 PA
• Les PJ ont pu récupérer des infos : +2 PA`,
    [inScene(mephisto), inScene(elvis), inScene(socrate)], false,
    [choice('pa1-lieu', 'Barème ch. 1 : où se tient le débriefing ?', [['À l\'Auberge Rouge', '+2 PA'], ['Au Hilton (lieu grillé)', '0 PA']]),
    choice('pa1-temoins', 'Barème ch. 1 : des humains ont-ils vu des choses et sont-ils toujours en vie ?', [['Non', '0 PA'], ['Oui', '−2 PA']]),
    choice('pa1-fuite', 'Barème ch. 1 : combien d\'anges se sont enfuis ?', [['Aucun', '0 PA'], ['Un', '−1 PA'], ['Deux', '−2 PA'], ['Trois', '−3 PA'], ['Quatre', '−4 PA']]),
    choice('pa1-renforts', 'Barème ch. 1 : des renforts angéliques sont-ils venus ?', [['Non', '0 PA'], ['Oui', '−1 PA']]),
    choice('pa1-infos', 'Barème ch. 1 : les PJ ont-ils récupéré des infos ?', [['Oui', '+2 PA'], ['Non', '0 PA']]),
    choice('mephisto', 'Méphistophélès laisse-t-il Elvis et Socrate aux PJ ?', [
      ['Oui, ils ont été bien traités', 'Les familiers restent jusqu\'à la fin ; s\'ils survivent avec une belle réputation, ils deviendront démons.'],
      ['Non, il les reprend', 'Méphistophélès devient un ennemi puissant des PJ.'],
    ])]),
  scene('ch2', '5. Chapitre 2 : il était une fois…', 'Rappel du contact – lundi',
    `Kronos exige de battre le fer : les anges n'étaient pas à Champigny sur ordre, leur disparition mettra plusieurs jours à être remarquée. Kronos considère les fées comme des protégées de l'Enfer : aider celles qu'on croise. Il veut être invoqué dès que le bistrot fantôme est localisé.
Objectifs : comprendre le projet Tinytoyland et le lien avec la procession de Nathan et Albrecht pour fermer la porte ; contacter les activistes fées et libérer leurs prisonniers. Récompense : 3 PA quand c'est fait.
Les opposants : une nébuleuse mal coordonnée d'administratifs de Notre-Dame, d'agents d'archanges durs et de serviteurs aigris d'archanges doux, surtout bénévoles. Après quatre jours sans nouvelles d'Henri et Roxane (dès le lundi si des anges ont fui), Nathan s'active : à partir du jeudi, l'appartement d'Henri, le centre culturel et le couvent ont chacun un ou deux combattants de plus, et des anges méfiants.
Contexte (encadré « Arcadia dreaming ») : les fées croient en tous les dieux sans en adorer aucun, proches des païens, Celtes et Vikings ; ni bonnes ni mauvaises, société archaïque. Les fées noires ont su s'adapter au monde moderne. Deux petits groupes à part : les guerriers elfes rebelles qui servent toujours Victor, et les fées ralliées au Sanctuaire. Toutes se méfient de l'Enfer et méprisent l'humanité. Mary Morgans (naufrageuses, protégées de Vephar) ; gangs RedCap (gobelins, nains, elfes noirs : chaperons trempés dans le sang ennemi = Frénésie 2 et Frappe ultime 2 pour une lune, avec Vo+Ch+5 PP).`,
    [], false,
    [choice('pa2', 'Les PJ ont-ils compris Tinytoyland et libéré les fées prisonnières ?', [['Oui', '+3 PA'], ['Pas entièrement', '0 PA']])]),
  scene('montreuil', '6. La chanson de Thierry Roland', 'Appartement d\'Henri James, 7e étage, Montreuil',
    `Appartement partagé avec Tonio, ange de Daniel champion de foot (en mission aux Philippines) : hymne au ballon rond (maillot de Platini dédicacé sous verre), héraldique, crucifix sanguinolent, bric-à-brac pieux.
Trois manuscrits anonymes en latin calent une épée bâtarde gravée et authentique : l'œuvre de Georges et de ses lieutenants (Khalid, Laurent) et les mœurs de Faërie (lecture longue : +2 rangs en Savoir occulte, +1 en spécialité fées). À la fin, deux feuillets annotés par Henri (en angélique si un PJ sert Zanag, sinon en latin, voire en français) :
• Un passage vers Faërie s'est rouvert sur une butte près d'un cromlech à Rouenche (lieu fictif : Limousin ou Auvergne). Fermé en 709 par un sorcier converti devenu saint Martin de Rouenche ; butte sanctifiée, calvaire, messe annuelle oubliée depuis la télévision. Rouverte depuis un an.
• Henri travaillait pour Albrecht. Fermeture prévue lors d'un pèlerinage façon saint Martin : tracts (certains ouvertement anti-fées) pour le week-end suivant, départ samedi matin de St-Ambroise-la-Bastide, arrivée dimanche soir à la butte du « Calvaire aux fées ».`,
    [], false),
  scene('plouhinec', '7. Les contes de l\'apéro', 'Chez Jean-Loup Keraudy, Plouhinec (Bretagne)',
    `Rumeur aware bretonne : un bistrot, « la Sirène », apparaît en fin de soirée aux ivrognes ; Korrigans et Mary Morgans y paient à boire à qui injurie Dieu et chante des horreurs en breton. Henri avait retrouvé un témoin, Jean-Loup Keraudy (le nom encadré en rouge), qui n'accepte de parler que chez lui.
Le vieux maître-nageur raconte surtout la natation… puis confirme sa nuit à la Sirène, sans savoir comment la retrouver. En réalité il est la boîte aux lettres des fées : trois émissaires (Jack Rackham, Ann Bonny, Mary Read) écoutent, prêts à tomber sur les PJ ; ce sont des démons, donc tout devrait bien finir. Ils proposent d'emmener les PJ le soir même à la Sirène.`,
    [inScene(keraudy), inScene(mary, { qty: 3 })]),
  scene('sirene', '8. La Sirène', '« La Sirène », bistrot fantôme (stella daemonis) – la nuit',
    `Le rade est une stella daemonis, petite Marche intelligente, alliée à une poignée de Korrigans qui en ont fait leur QG. Accueil chaleureux, alcool à volonté, décor de taverne de marins. Mistigri y rassemble fées et sympathisants (Mary Morgans, Mariel le Jean-Luc renégat, Grö Syrill l'ex-Baal, la famille Glantec, des druides) : plan inexistant, une embuscade contre Nathan.
Si les PJ invoquent Kronos : il apparaît et ordonne de sortir en courant ; la stella s'effraie et se transforme (tentacules, comptoir à crocs), puis la porte disparaît dans un plop. Kronos revient en se léchant les babines, sermonne Mistigri et les Mary Morgans, félicite les PJ et leur propose de reloger discrètement une vingtaine de fées.`,
    [inScene(mistigri), inScene(korrigans, { qty: 6 }), inScene(mary, { qty: 3 })], false,
    [choice('kronos', 'Les PJ invoquent-ils Kronos à la Sirène ?', [
      ['Oui', 'La stella est démasquée ; Kronos félicite les PJ et leur confie le relogement d\'une vingtaine de fées.'],
      ['Non', 'La stella daemonis attend son heure pour dévorer tout le monde ; Kronos sera mécontent.'],
    ])]),
  scene('centre', '9. Goebbels au pays des merveilles', 'Centre culturel Ste Anne Claire (ancien cinéma), Paris 5e',
    `Ancien cinéma racheté par le Bien : salle de réunion, salle d'impression, salle de projection pour films édifiants. Bubble et Mésange (Didier, 15 PP) s'y sont enfermés avec René (Jean, 17 PP) et leur chef Valfroy ; ils n'ouvrent que deux fois par jour au livreur de pizza.
Projet : « christianisation audiovisuelle » des fées façon Orange mécanique (calmants et vies de saints). Dans une cabine de projection, une dizaine de lutins survivants sur quarante, en cages à lapins, déguisés en aides du père Noël, sans chaussettes ni ceintures (tentatives de pendaison), répètent « Dieu est amour » et fabriquent des jouets en bois. Cobayes morts enterrés dans la courette (croix en bâtons d'esquimaux).
Salle de réunion : maquette 2 × 2 m des baraquements de Tinytoyland (village des Schtroumpfs version Bauhaus), documents, et un dessin animé de dix minutes très réussi sur la rééducation des fées.
Accès : lourde porte de sécurité sur la cour (Intrusion difficile) ou ruse (faux livreur de pizza). Le vrai problème : quatre anges en permanence, en plein Paris : privilégier l'élimination discrète.`,
    [inScene(valfroy), inScene(bubble, { qty: 2 }), inScene(rene)], true,
    [choice('lutins', 'Que deviennent les lutins captifs ?', [
      ['Libérés', 'Les fées en sont reconnaissantes (objectif du chapitre 2).'],
      ['Abandonnés', ''],
    ])]),
  scene('couvent', '10. Notre-Dame du dernier soupir', 'Couvent Ste Eulalie (XIIIe siècle), Champagne, isolé',
    `Couvent en ruine en rénovation par une dizaine de sœurs : chapelle et sacristie, dortoir et réfectoire autour d'un cloître (idéal pour une fusillade), grand potager. Gravure de saint Georges et le Dragon (XIVe) au réfectoire ; faux historiens bienvenus sur rendez-vous.
Non « googlable » : seule la chapelle est dangereuse pour les démons (Bénédiction (jeunesse) 2 et 12 PP, peu de chose) ; le dortoir cache une cave-oubliette ; une moto noire décorée d'une fée clochette est garée à l'entrée ; une épave de moissonneuse sur la colline voisine offre un poste d'observation.
Mère Hildegarde (Joseph, grade 2, 25 PP) et ses neuf sœurs : deux anges de Joseph (15 PP), deux de Georges (12 PP), cinq soldates de Dieu (section lourde). La croix décorée pour le pèlerinage de saint Martin trahit leur participation. La nuit, Hildegarde torture une prisonnière dans sa cellule.
Huit détenus : le gang des tordus (sept faux-monnayeurs nains et gobelins) et Canine Toothkeeper, la fée des dents, qui sait tout du rituel et veut le détourner (voir sa fiche). Bien faire comprendre aux joueurs que ce n'est pas un bunker : un peu de finesse suffit à entrer en éclaireur.`,
    [inScene(hildegarde), inScene(soeursJ, { qty: 2 }), inScene(soeursG, { qty: 2 }), inScene(soeursS, { qty: 5 }), inScene(canine), inScene(tordus, { qty: 7 })], true,
    [choice('canine', 'Les PJ libèrent-ils Canine et les tordus ?', [
      ['Oui', 'Canine devient l\'alliée clé du chapitre 3 ; les tordus offrent 30 000 € en faux billets à chaque démon.'],
      ['Non', 'Sans Canine, le plan de Kronos au chapitre 3 n\'a plus d\'objet : le MJ doit improviser.'],
    ])]),
  scene('ch3', '11. Chapitre 3 : le plan de Kronos', 'Chez Valefor, puis convocation des PJ',
    `Kronos combine les espoirs suicidaires des fées et le plan de Canine : attaquer la procession dans les derniers instants du rituel pour lui permettre de le détourner. Problème : la discrétion. Il faut que seuls les anges et leurs laquais assistent à l'assaut.
Kronos fait chanter Valefor (menace de révéler sa double nature) pour obtenir la bannière de saint Ganelon (fausse relique créée par Andromalius) : Humanité 4 à ceux qui la portent et apparence de fervents chrétiens ; défaut : quatre mètres de long.
Mission des PJ : participer à la procession avec la bannière, protéger Canine jusqu'à ce qu'elle prenne la main sur le rituel quand Mistigri attaque, et surtout faire abandonner le pèlerinage à un maximum d'humains (trop de témoins innocents = action annulée). Une fois le tour joué, se replier au pas de course. Kronos voile les détections du danger et du futur.`,
    [], false),
  scene('pelerinage1', '12. Vol au-dessus d\'un nid de youyous : samedi', 'De St-Ambroise-la-Bastide à St-Julien-les-deux-ânes – samedi',
    `Près de trois cents participants, messe en plein air abrégée par une averse, croix immenses, chants en latin, déguisés. Atouts des PJ : divisions des anges (venus d'eux-mêmes, par chapelles rivales), alcool, sujets qui fâchent (constitution européenne, équipe de France, retour des anges musulmans) ; dénivelé (900 m le premier jour, −400/+600 le second) ; météo truquée par les druides de Mistigri (pluie le premier jour, brume le second).
Les pèlerins marchent par grappes d'affinité : une démotivation ou une dispute en entraîne d'autres. Faire ressortir une faction seulement quand ça booste la partie. Les bastons entre anges restent sans armes ni pouvoirs voyants.
Planning (retards de 30 min à 1 h pour les traînards) : 8 h RDV ; 9 h-10 h messe et averse ; 12 h-13 h pause ; 16 h 30-17 h 30 camp près de St-Julien (12 000 âmes, bistrot, musée du sabot, bar-boîte près de la nationale) ; 17 h 30 messe sous la pluie ; 18 h 30 débats ou apéro-foot ; 20 h dîner, la pluie s'arrête ; 21 h psaumes ou virée au bar ; 22 h extinction des feux, chartreuse, jeunes en boîte.
1. Les brebis (à écarter absolument, ignorantes du Grand Jeu) :
• Bénévoles du bon Dieu : Aline (Blandine, 16 PP), Aimé (Christophe, 16 PP), Marie-Jo (Guy, 23 PP) avec 72 pensionnaires d'hospices. Bonus : Médecine 3. Faciles à décourager dès le premier soir.
• Jeunes cathos : Alban (Ange, 14 PP), Sophia (Didier, 13 PP), 30 lycéens. Une virée en boîte et la gueule de bois feront le reste.
• Scouts « Godefroy de Bouillon » : chef Jean-Louis (Christophe, 17 PP), 5 soldats de Dieu, 40 gamins. Immobiliser un scout (maladie, hasch, vol, ivresse) arrête toute la troupe.
2. Les électrons libres (peuvent rester, mais leur éjection affaiblit le Bien) :
• Les abonnés de l'Équipe : Étienne, Momo (Daniel, 14 PP), Raoul (Michel, 13 PP), 15 soldats de Dieu. Malus cumulatif de 1 par tranche de 4 h à cause de l'alcool.
• 3e section d'intervention de l'Essonne : Alex (Michel), Gwen (Janus), Mathieu (Mathias), 19 PP chacun, en pénitence avec une croix de 3 m ; Albrecht les fera blâmer à la moindre incartade.`,
    [], false,
    [choice('brebis', 'Les PJ ont-ils fait partir les brebis (hospices, jeunes cathos, scouts) ?', [
      ['Toutes', 'Moins d\'innocents à l\'embuscade.'],
      ['En partie', 'Compter les innocents restants pour le barème (−2 PA par tranche de 20).'],
      ['Non', 'Trop de témoins : Kronos peut annuler l\'action.'],
    ])]),
  scene('pelerinage2', '13. Le noyau dur : dimanche', 'De St-Julien aux collines de Rouenche – dimanche',
    `Dimanche : 1 h les abonnés ivres réveillent le camp ; 1 h 30 les jeunes rentrés de boîte se font prendre ; 4 h un compagnon tire sur un lapin pris pour un familier ; 7 h réveil difficile ; 9 h 15 départ en retard ; 9 h 25 averses, abandons ; 11 h-12 h messe, l'équipe essonnienne se bat avec les Purs et Nathan l'expulse ; 13 h déjeuner, abandons ; 18 h 15 collines de Rouenche, brouillard ; 18 h 30 messe au « Calvaire aux fées » (cromlech) ; 18 h 40 les fées attaquent.
3. Le noyau dur (méfiant, ira probablement jusqu'au bout) :
• Les énervés de Notre-Dame : une douzaine d'anges de Blandine, Daniel, Didier, Jean-Luc ou Marc (vers 12 PP), plus intégristes que leurs archanges.
• John the Revelator (Laurent, 22 PP) et 5 soldats de Dieu : traque les démons, contré par Kronos.
• Compagnie des Purs : Yvan, Gus, Raymond (Georges), Robert, Aaron (Joseph), Boris (Laurent), tous 13 PP, 30 soldats de Dieu ; croix de six mètres, pénitents cagoulés, PM et poignards.
• Séminaire traditionaliste : pères Benoît (Dominique, 13 PP), Ghislain (Joseph, 20 PP), Octave (Walther, 16 PP), 9 futurs prêtres aware, statue de saint Martin.
• Nathan, Albrecht et Jérémy, et les survivants des chapitres précédents.`,
    [], false),
  scene('embuscade', '14. La brume cachera que nous sommes si peu nombreux', 'Le « Calvaire aux fées », butte et cromlech de Rouenche – dimanche 18 h 30',
    `Albrecht et Nathan dressent un autel ; Albrecht annonce une messe « selon l'ancien rite médiéval ». Jérémy lance le rituel déguisé en messe en latin ; un brouillard épais tombe, la porte vers Faërie s'agite. Canine murmure les paroles à l'unisson.
Cri de guerre : Mistigri et ses alliés attaquent (une quinzaine de Celtes, vétérans de Durancum, fées infernales, renégats ; Carmilla lâche ses goules ; Grö Syrill se téléporte vers Nathan ; les soldats de Dieu tirent au hasard ; les Mary Morgans viennent épauler les PJ mais John et ses hommes leur barrent la route).
Si les démons occupent Albrecht, Canine égorge Jérémy et achève le rituel au pied du calvaire : au moins cinq tours pendant lesquels les PJ doivent tenir (Nathan, vainqueur de Grö Syrill, est le danger). « Je dédie ce sortilège à Féerie » : perturbation de pouvoir de niveau 4 pour tous, la porte s'effondre. Il faut encore fuir par la butte détrempée vers la vallée boisée, poursuivis par des anges entraînés.
Issues : échec (attaque repoussée ou trop d'innocents tués) = nouvel exemple de la cruauté des fées, Tinytoyland soutenu officiellement par Georges et Joseph, Kronos réprimandé. Réussite = les anges ignorants se retournent contre Nathan et Albrecht, Notre-Dame condamne leur initiative, Tinytoyland reste dans les cartons ; toutes les fées à mille lieues gagnent 3 PP et un niveau de pouvoir, et partagent leur savoir dans un bref instant de communion.`,
    [inScene(nathan), inScene(albrecht), inScene(jeremy), inScene(valfroy), inScene(john), inScene(soldats, { qty: 5 }), inScene(purs, { qty: 6 }), inScene(canine), inScene(mistigri), inScene(korrigans, { qty: 6 }), inScene(mary, { qty: 3 }), inScene(grosyrill), inScene(carmilla)], true,
    [choice('rituel', 'Canine parvient-elle à détourner le rituel ?', [
      ['Oui', 'La porte s\'effondre, les fées sont renforcées ; Nathan et Albrecht sont désavoués (+3 PA).'],
      ['Non', 'La porte est fermée par les anges ; Tinytoyland obtient le soutien de Georges et Joseph.'],
    ])]),
  scene('bilan', '15. Barème du chapitre 3', 'Après la bataille',
    `Barème du chapitre 3 (p. 151) :
• Il n'y a plus d'humains innocents lors de l'embuscade : +2 PA
• Le rituel est détourné par Canine : +3 PA
• Nathan, Albrecht et « Nicolas » sont morts : +2 PA (le livre nomme Nicolas ; sans doute Valfroy, le troisième initiateur)
• Par initiateur du projet Tinytoyland survivant : −1 PA
• Par 20 innocents présents lors de l'embuscade : −2 PA
Rappel : Elvis et Socrate deviennent démons s'ils ont survécu avec une belle réputation.`, [], false,
    [choice('pa3-innocents', 'Barème ch. 3 : restait-il des humains innocents lors de l\'embuscade ?', [['Aucun', '+2 PA'], ['Moins de 20', '0 PA'], ['20 à 39', '−2 PA'], ['40 à 59', '−4 PA'], ['60 et plus', '−6 PA (−2 par tranche de 20)']]),
    choice('pa3-rituel', 'Barème ch. 3 : le rituel est-il détourné par Canine ?', [['Oui', '+3 PA'], ['Non', '0 PA']]),
    choice('pa3-initiateurs', 'Barème ch. 3 : combien d\'initiateurs de Tinytoyland (Nathan, Albrecht, Valfroy) survivent ?', [['Aucun', '+2 PA'], ['Un', '−1 PA'], ['Deux', '−2 PA'], ['Trois', '−3 PA']]),
    choice('familiers', 'Elvis et Socrate ont-ils survécu avec une belle réputation ?', [['Oui', 'Ils passent démons.'], ['Non', '']])]),
];

const scenario = {
  id: 'of3-contes-de-fees',
  nom: 'On Ferme – Les contes de fées finissent mal en général',
  resume: 'Scénario d\'In Nomine Satanis pour 3 à 6 diablotins rusés et expérimentés, en trois chapitres. Des anges intégristes (Albrecht, Nathan, Valfroy) montent le projet Tinytoyland : enfermer les fées revenues sur Terre dans une Marche pour les rééduquer, en commençant par fermer un passage vers Faërie lors d\'un pèlerinage. Pour Kronos, les PJ remplacent au pied levé trois démons morts dans un guet-apens contre des anges à l\'Auberge Rouge, enquêtent entre Paris, la Bretagne et un couvent-prison, puis infiltrent le pèlerinage de saint Martin pour permettre à la fée des dents de détourner le rituel.',
  notes: `Source : ${REF}.
Contexte : Georges avait exterminé les fées ; les survivantes sont devenues fées blanches (Faërie) ou noires (restées sur Terre à l'ombre des démons, grâce à Kronos qui a envoyé des démons à la bataille de Durancum en 478). Faërie ravagée, les fées reviennent sur Terre. Albrecht (Yves, grade 2), Nathan (Georges, grade 3) et Valfroy (Didier, grade 2) ne peuvent compter sur le Conseil ; ils veulent rendre Tinytoyland populaire chez les anges de base (enquête d'Henri et Roxane) et tester leur poids politique en fermant publiquement le passage de Rouenche.
Structure : chapitre 1 « La quête des dupes » (scènes 1-4), chapitre 2 « Il était une fois… » (scènes 5-10), chapitre 3 « Le dernier pèlerinage de saint Martin » (scènes 11-15).

Récompenses (barèmes propres au scénario) :
Chapitre 1 (p. 140) : débriefing à l'Auberge Rouge +2 PA ; des humains ont vu des choses et vivent −2 PA ; −1 PA par ange enfui ; renforts angéliques venus −1 PA ; infos récupérées +2 PA.
Chapitre 2 (p. 142) : +3 PA quand Tinytoyland est compris et les fées prisonnières libérées.
Chapitre 3 (p. 151) : plus d'humains innocents à l'embuscade +2 PA ; rituel détourné par Canine +3 PA ; Nathan, Albrecht et « Nicolas » (Valfroy ?) morts +2 PA ; −1 PA par initiateur de Tinytoyland survivant ; −2 PA par tranche de 20 innocents présents.
Autres : Elvis et Socrate deviennent démons s'ils survivent avec une belle réputation ; Méphistophélès peut devenir un ennemi ; les tordus offrent 30 000 € en faux billets à chaque démon ; reconnaissance des fées et de Kronos.

Fiches : caractéristiques du livre converties en niveaux (Ch des humains et des fées en Foi). Attaques au format du livre (seuil, +X, +Y) : attaque = X×2, puissance Y. Anges et démons cités avec seulement leur supérieur et leurs PP : profils « PNJ rapide » de l'écran du maître au palier le plus proche (PP réels dans la fiche). Pouvoirs absents des règles de l'application (Chance, Corps mémétique, Diminution, Contrôle et Faire parler les pierres, Avertissement) laissés dans les notes.`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [henri, roxane, steven, tarek, bellasco, pichegru, elvis, socrate, arlot, psis, laurent15, soldats, mephisto,
  korrigans, mistigri, mary, keraudy, bubble, rene, valfroy, hildegarde, soeursJ, soeursG, soeursS, canine, tordus,
  nathan, albrecht, jeremy, john, purs, grosyrill, carmilla].map(asType);
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));
const ids = [scenario.id, ...scenes.flatMap((s) => [s.id, ...s.npcs.map((x) => x.id), ...s.choix.map((c) => c.id)]), ...bestiaire.map((t) => t.id)];
const dup = ids.filter((x, i) => ids.indexOf(x) !== i); if (dup.length) console.warn('Ids en double :', dup.join(', '));
writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types,', scenes.reduce((a, s) => a + s.choix.length, 0), 'choix');
