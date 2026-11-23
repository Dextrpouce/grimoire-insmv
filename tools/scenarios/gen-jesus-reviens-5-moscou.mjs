// Génère le fichier d'import « insmv-scenario » pour « Jésus Reviens ! – 5. Moscou »
// (« Lénine, relève-toi, ils sont devenus fous », Jésus Reviens !, p. 78-89 ; TRIC p. 9-10, IA p. 12)
// usage : node gen-jesus-reviens-5-moscou.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Jésus Reviens !, chap. 6 « Lénine, relève-toi, ils sont devenus fous », p. 78-89';
const L = (s) => R.parseLvl(String(s)); // « 2+ » → 5
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
const ARMES = new Map(R.ARMES.flatMap(([g, l]) => l.map((x) => [x[0], { prec: x[1], puis: x[2], melee: R.MELEE_GROUPS.includes(g) }])));
// arme de la table des règles : nom affiché, nom dans la table, niveau du talent
const arme = (n, table, lvl) => { const w = ARMES.get(table); if (!w) throw new Error('arme inconnue : ' + table); return { n, att: L(lvl), ...w }; };
// arme décrite par le livre (précision / puissance données)
const armeB = (n, lvl, prec, puis, melee) => ({ n, att: L(lvl), prec, puis, melee });
const poing = (lvl) => arme('Coup de poing', 'Coup de poing', lvl);
const kalach = (lvl) => armeB('Kalachnikov (attaque multiple, pénétration importante, portée longue)', lvl, -2, 5, false);
const pistoletRusse = (lvl) => armeB('Pistolet russe (pénétration importante, portée moyenne)', lvl, -3, 4, false);
const batte = (lvl) => armeB('Batte de base-ball (non létale)', lvl, -1, 2, true);

const P = 'jr5-'; let n = 0; const id = (k) => P + k;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [poing(1)], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});

// ---------------- PNJ nommés ----------------
const strachnov = npc('strachnov', {
  nom: 'Strachnov (Miroslav Makarovski)', source: 'Ange de Georges, grade 3 (en disponibilité)', type: 'ange', car: car('5 6 4 7 6 7'), def: L(7),
  pp: 49, pfFix: 12, seuilsFix: seuils('8/16/24/32'),
  armes: [armeB('Sabre court de cosaque béni et ancien', 9, 6, 8, true), kalach(4), poing(6)],
  pouvoirs: pows('Colère divine 6, Détection du danger 2, Esquive acrobatique 4, Lueur insoutenable 4, Némésis 4, Régénération 5, Sens surdéveloppés, Supériorité martiale 3, Voix impérieuse 4'),
  talents: 'Corps à corps 6, Combat 3 (épées 9), Défense 7, Discrétion 4, Discussion 5, Enquête 4, Fouille 4, Tir 2 (armes d\'épaule 4), Aisance sociale 5, Athlétisme 7, Culture générale 2+ (vie des Cosaques et histoire de la Russie de l\'an 800 à nos jours 6), Haine des communistes 4, Savoir occulte 3 (Ordre de Saint-Georges 8), Savoir occulte 2 (opération JR 4), Savoir occulte 2 (Église orthodoxe russe 5), Anglais, Géorgien, Art 2 (chants grégoriens 5), Savoir militaire 2 (commandement de compagnie mécanisée et de Cosaques 5), Équitation 4, Survie 3 (toundra 6)',
  esquive: true,
  notes: '48 ans, 1,92 m, blond aux yeux gris. Sur Terre depuis plus de quinze siècles, un des plus fidèles de Georges. Officiellement sans archange, il est secrétaire du chapitre moscovite de l\'Ordre de Saint-Georges (en réalité son plus haut gradé) et chef du groupuscule Nouvelle Russie.\nRusé, calme, réfléchi malgré son fanatisme ; rêve d\'une théocratie avec un tsar autocrate, chef de l\'Église orthodoxe, et de Moscou « troisième Rome ». Hait les communistes mais s\'allie à eux par pragmatisme.\nCoordinateur indispensable : s\'il est neutralisé avant le jour J, le putsch n\'a pas lieu. Toujours entouré d\'une trentaine de soldats de Dieu de Mémoire ; fuit un combat perdu (trou dans le plafond de son bureau) en détruisant les ordinateurs à la grenade.\nTémoignage : 2 à 5G à l\'Index d\'Accusation.',
});
const termienko = npc('termienko', {
  nom: 'Vladimir Termienko', source: 'Secrétaire du PCR (Parti communiste russe), humain', car: car('2 2 2 2+ 3 2'), def: 2,
  pfFix: 4, seuilsFix: seuils('3/6/9/12'),
  armes: [pistoletRusse(2)],
  talents: 'Discussion 3, Baratin 2, Culture générale 2 (marxisme-léninisme 3), Séduction 2, Aisance sociale 2, Hobby (jeu vidéo) 2, Savoir occulte 1 (histoire secrète du stalinisme 2), Savoir d\'espion 1 (espionnage style guerre froide 2), Métier (cadre du PCUS) 3+, Tir 1 (armes de poing 2)',
  notes: '48 ans, 1,72 m, blond roux aux yeux verts. Apparatchik de père en fils, étoile montante du PCR, moderne, cultivé, anglophone, communiste sincère qui veut un PCR réformé. Voit le réveil de Lénine comme un grand coup médiatique « à l\'hollywoodienne » sans savoir comment Strachnov compte s\'y prendre.\nAffable avec les étrangers cultivés et les journalistes ; laisse filtrer des allusions aux mafieux et nouveaux Russes « qui vont payer ». Secoué fort, il avoue tout : grande partie du volet militaire, politique et médiatique, beaucoup de noms (témoignage de membre communiste du complot : 0 à 1G).\nDéfense non donnée : 2 (niveau 1).',
});
const dimitri = npc('dimitri', {
  nom: 'Dimitri Polzoski', source: 'Soldat de Dieu de Strachnov, chef de Mémoire', type: 'soldat', car: car('3 2+ 2 2 2 2+'), def: L('3+'),
  pp: 6, pfFix: 5, seuilsFix: seuils('4/8/12/16'),
  armes: [armeB('Sabre cosaque', '3+', 0, 2, true), poing(2)],
  pouvoirs: pows('Arme exaltée 2, Volonté supra-normale 1+'),
  talents: 'Savoir occulte 1 (Ordre de Saint-Georges et opération JR 2+), Corps à corps 2, Défense 3+, Combat 1 (épées 3+), Tir 1+ (armes d\'épaule 3+), Culture générale 1 (Église orthodoxe russe 2+), Ukrainien, Hobby (pogrom) 2, Athlétisme 2+, Savoir militaire 1 (tactique moderne russe 2), Intimidation 2+',
  volonte: true,
  notes: '48 ans, 1,76 m, blond aux yeux bleus. Honnête et droit, il obéit mais sait que son supérieur fait le mal (il s\'en est confessé à son pope, qui lui a dit d\'obéir). Se défoule en cognant. Connaît le complot dans ses grandes lignes, les noms et coordonnées de Iossef, a croisé beaucoup de dignitaires complices (mais sa liste de suspects est trop longue : la transmettre telle quelle fait arrêter des innocents). Sait que Lénine se réveillera par un rituel satanique le jour de la fête nationale, ce qui le dégoûte.\nInterrogé, il crache tout et se sent mieux après : témoignage 0 à 2G. Jour J : avec l\'élite de ses hommes près du Goum, sur la Place Rouge.',
});
const edom = npc('edom', {
  nom: 'Edom (Vassiliev Dormoski)', source: 'Démon de Mathias, grade 2, agent du FSB', type: 'demon', car: car('4 5 4 5 3 4'), def: L(3),
  pp: 27, pfFix: 9, seuilsFix: seuils('7/14/21/28'),
  armes: [pistoletRusse(2), poing(1)],
  pouvoirs: pows('Apparence démoniaque 2, Polymorphie 2, Lire les pensées 2, Télépathie 3, Corps gazeux, Trait d\'énergie 1, Volonté supra-normale 2'),
  talents: 'Aisance sociale 8, Baratin 6, Discussion 7, Défense 3, Culture générale 2 (vie dans la Russie post-soviétique et doctrine du PCR 5), Savoir d\'espion 2 (contre-espionnage à la KGB 4), Savoir occulte 2+ (le Grand Jeu en Russie et affaire Mathias 5), Discrétion 5, Enquête 6, Fouille 5, Intrusion 4, Tir 1 (armes de poing 2), Anglais, Français, Espagnol, Ukrainien, Géorgien, Biélorusse, Métier (agent du FSB) 4',
  volonte: true,
  notes: '39 ans, 1,72 m, blond aux yeux noirs. Contact que Medes donne aux PJ en Russie. Poste obscur aux douanes de la Loubianka, en réalité agent du contre-espionnage, bien introduit au gouvernement et dans la sécurité.\nAgent quadruple sans loyauté (infiltré chez les rebelles d\'Emmanuel tout en servant Mathias, etc.), ne cherche qu\'à s\'en sortir. Fait chanter Iossef (exercice illégal de la médecine) sans encore s\'en servir ; Iossef ne sait pas qu\'il est un démon.\nFace aux PJ : sceptique de façade, très intéressé en fait ; il récupère tout, le rapporte à ses chefs et niera les avoir vus. Prévenu tôt et de façon convaincante, il fait échouer le coup d\'État.\nLe livre l\'appelle « ange de Mathias » ; ses pouvoirs (Apparence démoniaque) en font un démon.',
});
const katioucha = npc('katioucha', {
  nom: 'Katioucha (Igor Borisovitch Klinogof)', source: 'Démon de Hornet, grade 1, patron du Milady', type: 'demon', car: car('4 3+ 4 5 5 3'), def: L('3+'),
  pp: 14, pfFix: 9, seuilsFix: seuils('6/12/18/24'),
  armes: [armeB('Dard (membre exotique)', 4, 0, 2, true), poing(4)],
  pouvoirs: pows('Membre exotique, Augmentation de Force 1, Peur 2'),
  talents: 'Aisance sociale 4, Baratin 4, Combat 4, Culture générale 1 (vie en Russie post-soviétique 3), Savoir criminel 1 (mafia russe et traite des blanches 2+), Défense 3+, Discussion 3, Discrétion 2, Savoir occulte 1 (le Grand Jeu en Russie et les sorciers russes 2), Enquête 2, Fouille 2+, Séduction 2, Kama sutra 3+, Hobby (partouze nécrophile) 2, Faire semblant de boire 3',
  notes: '51 ans, 1,82 m, blond aux yeux verts. Démon fonctionnaire : fait le mal consciencieusement aux heures de bureau, veut qu\'on lui fiche la paix. Gère le Milady (blanchiment, traite, trafic de cadavres) et recense les sorciers de Moscou pour son nouveau prince-démon.\nContacté par Pallard, il a prévenu Hornet (qui n\'en a parlé à personne, pas même à Andromalius) et a envoyé un pion jetable, Iossef. Ignore tout de l\'opération JR. Prend les PJ pour des collègues blasés et joue au mafieux qu\'on interroge ; menacé physiquement, il préfère tout lâcher que mourir : témoignage 0 à 5G.\nArme : dard (Membre exotique) sans valeurs dans le livre, précision 0 / puissance +2 estimées.',
});
const iossef = npc('iossef', {
  nom: 'Iossef Djoukov', source: 'Sorcier géorgien, épicier et rebouteux', car: car('1+ 3 3 3+ 3+ 3+'), def: L(2),
  pfFix: 4, seuilsFix: seuils('2/5/7/10'),
  armes: [poing(1)],
  talents: 'Savoir occulte 1 (sorcellerie 3), Discrétion 2, Métier (épicier) 3, Métier (rebouteux charlatan) 3+, Défense 2, Faire pitié 3+, Culture générale 1 (vie dans la Russie post-soviétique 2+), Savoir occulte 0+ (opération JR 1), Baratin 3, Médecine 1+, Technique 0+ (herboristerie 1+), Séduction 2+, Aisance sociale 2+, Hobby (Spartak de Moscou) 1+, Basse sorcellerie 2+',
  notes: '52 ans, 1,72 m, blond aux yeux bleus. « Docteur Iossef », Raspoutine de quartier qui vend de la poudre de perlimpinpin aux vieilles du coin. Admirateur de Hornet (sans avoir compris qu\'il est devenu prince-démon), recruté par Katioucha.\nSait seulement qu\'il doit se présenter le jour de la fête nationale, en costume et avec tout son matériel, aux gardes de la Place Rouge avec une carte de membre d\'honneur du PCR, pour entrer dans le mausolée. Se doute d\'une abomination, n\'ose pas refuser. Fuit dès que ça tourne mal. Témoignage 0 à 3G.\nPouvoirs de sorcier (absents des règles de l\'appli) : Contrôle des morts-vivants, Créer des morts-vivants. C\'est lui qui réveille et contrôle Lénine : l\'abattre décapite le mouvement.',
});
const lenine = npc('lenine', {
  nom: 'Lénine (la momie)', source: 'Cadavre réanimé, marionnette de Iossef et Strachnov', type: 'mortvivant', car: car('2 1 2 1 3 1'), def: 2,
  notes: 'Aucune caractéristique dans le livre : fiche minimale, valeurs estimées. Contrôlé par Iossef, il « vit » dans son bureau historique du Kremlin. Détruire la momie ou son contrôleur met fin à la mascarade.',
});

// ---------------- Troupes ----------------
const mafiosi = npc('mafiosi', {
  nom: 'Mafiosi russes', source: 'Tueurs et gardes du corps de la mafia', qty: 4, car: car('3 2 3 1+ 2 1+'), def: L(2),
  pfFix: 4, seuilsFix: seuils('4/8/12/16'),
  armes: [kalach(2), pistoletRusse(2), poing(2)],
  talents: 'Savoir criminel 1 (trafic en tout genre 2), Corps à corps 2, Tir 1 (armes d\'épaule 2), Fouille 2+, Culture générale 1+ (milieux mafieux en Russie 2+), Torture 2, Trinquer 2, Tir 1+ (armes de poing 2), Défense 2, Intimidation 3',
  notes: 'Brutes sans foi ni loi, surarmées, qui répondent à une insulte par une rafale. Gardent le Milady et accompagnent chaque groupe de clients.',
});
const putes = npc('putes', {
  nom: 'Putes zombies', source: 'Mortes-vivantes du Milady', type: 'mortvivant', qty: 6, car: car('3 1 2 1 1 3'), def: 2,
  pp: 6, pfFix: 4, seuilsFix: seuils('4/8/12/16'),
  armes: [armeB('Langue barbelée (membre exotique)', '3+', 0, 1, true), arme('Corps à corps', 'Coup de poing', '3+')],
  pouvoirs: pows('Anaérobiose, Jeûne, Immunité contre les maladies et les poisons, Membre exotique, Régénération 2'),
  talents: 'Corps à corps 3+, Kama sutra 2, Séduction 2',
  notes: 'Restes de filles enlevées dans tout l\'ex-empire soviétique, mortes sous les sévices. Une trentaine gardent le Milady ; Katioucha les envoie « calmer » les importuns.\nLe livre dit qu\'elles servent Pallard : sans doute une coquille pour Katioucha.\nDéfense non donnée : 2 (niveau 1). Langue barbelée sans valeurs : précision 0 / puissance +1 estimées. « Immunité contre les maladies » du livre rattachée au pouvoir des règles.',
});
const sdd = npc('sdd-memoire', {
  nom: 'Soldats de Dieu de Mémoire', source: 'Soldats de Dieu de Strachnov déguisés en skins', type: 'soldat', qty: 6, car: car('3 2+ 2 1+ 2 2'), def: L('2+'),
  pp: 4, pfFix: 4, seuilsFix: seuils('4/8/12/16'),
  armes: [batte('3+'), poing(2)],
  pouvoirs: pows('Augmentation de Force 2'),
  talents: 'Corps à corps 2, Défense 2+, Discrétion 2, Fouille 3, Athlétisme 2, Culture générale 1 (vie de loser dans la Russie post-soviétique 2+), Savoir occulte 0+ (opération JR et Grand Jeu en Russie 1), Passer pour un skin de Mémoire 2+, Chants nazis 2, Savoir criminel 1 (petite frappe 2), Combat 1 (contondantes 3+)',
  notes: 'Fondus dans le groupe Mémoire, ils se connaissent entre eux ; les skins humains ne savent pas qui est soldat de Dieu. Chassent les Caucasiens dans les rues. Une vingtaine, parmi les plus tarés, gardent des preuves de leur séjour au camp d\'Okefenokee (Géorgie, USA) : passés par groupes de cinq via Miami il y a moins d\'un an, pour trois mois d\'entraînement commando (Stonewall Jackson, et « Môssieur » Medlocke, c\'est-à-dire Semper Fidelis).\nTémoignage : 1L (sauf si Dimitri a parlé) ; preuves du séjour chez Dixie Securities : 1L.',
});
const frappes = npc('frappes', {
  nom: 'Petites frappes de Mémoire', source: 'Skins humains du groupuscule', qty: 6, car: car('3 2+ 2 1 2 1'), def: L(2),
  pfFix: 4, seuilsFix: seuils('4/8/12/16'),
  armes: [batte(2), poing(2)],
  talents: 'Corps à corps 2, Défense 2, Discrétion 2, Fouille 2, Athlétisme 2, Culture générale 1 (vie de loser dans la Russie post-soviétique 2), Chants nazis 2, Savoir criminel 1 (petite frappe 2), Combat 1 (contondantes 2)',
  notes: 'Paumés qui ont trouvé en Dimitri un père et des boucs émissaires. Une centaine en tout, répartis en groupes, au parc Gorky.',
});
const komsomols = npc('komsomols', {
  nom: 'Miliciens des Komsomols et gardes du PCR', source: 'Service d\'ordre du parti', qty: 4, car: car('2+ 2+ 3 1+ 2 1'), def: 2,
  pfFix: 3, seuilsFix: seuils('3/7/10/14'),
  armes: [kalach('2+'), poing(2)],
  talents: 'Culture générale 1 (doctrine du PCUS 2), Survie 1 (Russie post-soviétique 2+), Savoir militaire 1 (tactique 2), Athlétisme 2, Hobby (collection des insignes soviétiques) 1+, Tir 2+, Corps à corps 2',
  notes: 'Nostalgiques ignares et dévoués : savent que quelque chose se prépare, pas quoi. Quatre d\'entre eux, l\'élite des Jeunesses communistes, protègent Iossef sur ordre de Termienko et mourront pour cette mission. Le service d\'ordre du Palais du Peuple (anciens du KGB, souvent encore au FSB) est plus professionnel : même profil, à durcir au besoin.\nDéfense non donnée : 2 (niveau 1). Témoignage : 0 à 1G.',
});

const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  scene('arrivee', '1. En chantant : arriver à Moscou', 'Moscou – avant ou après le jour J',
    `Pas de chronologie : un seul vrai événement, le réveil de Lénine le jour de la fête nationale (seuil 45 de la TRIC). Tout dépend du moment où les PJ arrivent.
• Avant : ils ont appris ailleurs (surtout en Floride, ou à Paris par Pallard) qu'il se trame quelque chose ; ils arrivent avec des adresses liées au complot (Nouvelle Russie, Mémoire, Iossef, Milady…).
• Après : Lénine réveillé, guerre civile, blocus ; quasi impossible d'entrer dans le pays. À éviter : donner des indices plus tôt pour qu'ils arrivent à temps, ou les laisser forcer le blocus.
Rattrapage : Medes (démon de Mathias, bras droit qui a dénoncé Pallard à l'Enfer) sait par Iossef que quelque chose se prépare. S'il apprécie les PJ, il leur souffle l'affaire en donnant-donnant : il ne veut pas envoyer ses propres démons (trop visible pour les Emmanuel), les PJ deviennent ses envoyés officieux. Il leur donne Edom comme contact.
Ambiance : ville immense, plate et aérée, avenues démesurées, métro-palais, poids de l'Histoire partout, gens fermés dans la rue.`, [], false,
    [choice('timing', 'Quand les PJ arrivent-ils à Moscou ?', [
      ['Avant le jour J', 'Enquête libre dans les lieux du scénario ; but : neutraliser Strachnov ou Iossef, ou faire tomber la liste des complices aux mains du gouvernement.'],
      ['Après le réveil de Lénine', 'Blocus et chaos : passer directement à la scène 10 (La maladie d\'amour) pour limiter les dégâts.'],
    ])]),
  scene('nouvelle-russie', '2. Le siège de Nouvelle Russie', 'Appartement de huit pièces, grande banlieue de Moscou',
    `QG secret du groupuscule de Strachnov : porte blindée, deux ou trois gros bras de Mémoire en permanence, une vingtaine de militants qui se relaient (téléphone, affiches, vodka, samovar). Aucun visiteur toléré. Miroslav y vit quand il ne roule pas dans sa Mercedes aux vitres teintées ; il n'y reçoit aucun complice important.
Dans le foutoir (antiquités tsaristes et soviétiques, armes, argent) : deux ordinateurs à clavier cyrillique, avec les coordonnées de pontes du PCR, de l'armée et du KGB, et de tous les complices du putsch avec leur rôle. Pas une preuve juridique, mais le FSB (ou le FBI) s'en contentera.
• Remise au gouvernement russe assez tôt : arrestations ou surveillance suffisantes pour empêcher le putsch. Très grande victoire. Edom peut faire suivre la liste aux bonnes personnes très vite.
• Strachnov s'il est là : une trentaine de soldats de Dieu de Mémoire surarmés autour de lui. Il fuit par le trou aménagé dans le plafond de son bureau (appartement désert au-dessus, loué par Nova Russkia) et fait sauter les ordinateurs à la grenade, quitte à sacrifier ses hommes.
• Strachnov arrêté avant le jour J : pas de putsch (il est le coordinateur indispensable).
IA : dossiers de l'appartement 2G+1L ; témoignage de Strachnov 2 à 5G.`,
    [inScene(strachnov), inScene(sdd, { qty: 8 }), inScene(frappes, { qty: 3 })], true,
    [choice('liste', 'Que font les PJ des ordinateurs de Nouvelle Russie ?', [
      ['Liste remise au gouvernement (via Edom) avant le jour J', 'Le putsch échoue : « L\'insurrection n\'a pas lieu et Lénine repose en paix » (TRIC −2). Copie gardée : dossiers 2G+1L.'],
      ['Gardée pour le procès seulement', 'Dossiers 2G+1L à l\'IA, mais le putsch reste possible.'],
      ['Strachnov a eu le temps de tout faire sauter', 'Plus de liste ; il faut passer par Dimitri, Termienko ou le Palais du Peuple.'],
    ]),
    choice('strachnov', 'Strachnov est-il neutralisé avant le jour J ?', [
      ['Oui (capturé ou tué)', 'Pas de putsch. Capturé, il peut témoigner : 2 à 5G.'],
      ['Il s\'enfuit', 'Il redouble de prudence ; le jour J est maintenu.'],
    ])]),
  scene('gorky', '3. Le parc Gorky', 'Parc paysager du centre de Moscou, buvette abandonnée',
    `Repaire de Mémoire : une centaine de skins en plusieurs groupes, qui squattent pelouses et buvettes l'été, tunnels piétons l'hiver ; adresse officielle : une buvette abandonnée où brûle un feu, ambiance post-apocalyptique. Bière, chasse au touriste ; la milice ferme les yeux contre des pots-de-vin.
Les soldats de Dieu de Strachnov s'y fondent (même tenue, même attitude) ; Dimitri traite tout le monde pareil, ce qui soude le groupe. Il y est souvent, sauf quand il accompagne Strachnov.
• Dimitri : connaît le complot dans les grandes lignes, Iossef et ses coordonnées, le rituel prévu à la fête nationale ; il parle s'il est interrogé un peu rudement (et veut se soulager). Méfiance : sa liste de suspects est trop large, la transmettre telle quelle fait arrêter des innocents.
• Une vingtaine des plus tarés gardent des preuves de leur séjour aux USA (via Miami, par groupes de cinq) ; un peu bousculés, ils avouent le stage commando au camp d'Okefenokee avec Stonewall Jackson et Medlocke (Semper Fidelis).
IA : témoignage de Dimitri 0 à 2G ; preuves du séjour chez Dixie Securities 1L ; témoignage des soldats de Dieu de Mémoire 1L (sauf si Dimitri a parlé).`,
    [inScene(dimitri), inScene(sdd, { qty: 6 }), inScene(frappes, { qty: 10 })], true,
    [choice('dimitri', 'Dimitri parle-t-il ?', [
      ['Oui, il crache tout', 'Témoignage 0 à 2G ; mène à Iossef et au Goum le jour J. Le témoignage de ses soldats ne compte plus.'],
      ['Non, ou il est tué', 'Témoignage des soldats de Dieu de Mémoire (1L) et preuves Dixie (1L) restent possibles.'],
    ])]),
  scene('loubianka', '4. La Loubianka', 'Siège du FSB (ex-KGB), près de la Place Rouge',
    `Bâtiment pharaonique où rouille la statue de Dzerjinski. Edom y occupe un poste obscur aux douanes, couverture d'agent du contre-espionnage.
Contact donné par Medes. Avec des preuves ou des soupçons sérieux sur le putsch, il fait le sceptique (« sans doute bidon ») tout en tirant les vers du nez des PJ, puis porte tout à ses chefs et en récolte les lauriers. Il niera les avoir vus et ne leur reconnaîtra rien.
Même roulés, les PJ empêchent le coup d'État s'ils l'ont prévenu tôt et de façon convaincante.
Edom tient Iossef par le chantage (exercice illégal de la médecine) mais garde cet atout pour lui.`,
    [inScene(edom)], false,
    [choice('edom', 'Les PJ préviennent-ils Edom à temps, avec des éléments convaincants ?', [
      ['Oui, tôt et preuves à l\'appui', 'Le FSB démantèle le complot : pas d\'insurrection (TRIC −2). Edom s\'en attribue tout le mérite.'],
      ['Trop tard ou trop vague', 'Edom empoche les infos sans agir ; le jour J a lieu.'],
    ])]),
  scene('iossef', '5. L\'épicerie de Iossef', 'Petite épicerie de la Prospiekt Mira (perspective de la Paix)',
    `Iossef vend nourriture et bricoles et joue le marabout pour les vieilles du quartier, en forçant son accent géorgien. Il sait seulement qu'il doit, le jour de la fête nationale, se présenter endimanché avec tout son matériel et sa carte de membre d'honneur du PCR aux gardes de la Place Rouge pour entrer dans le mausolée. Il se doute d'une abomination, mais sait que s'il se défile, les gros bras du PCR le rattraperont.
Une voiture de milice stationne devant l'échoppe et le suit le soir : quatre miliciens du service d'ordre du PCR (élite des Komsomols, mission venant directement de Termienko) veillent sur lui et sur sa tranquillité. Si les PJ sont peu discrets : combat rapide et sanglant, les miliciens se font tuer pour lui. Interrogés, ils ne savent presque rien.
• Neutraliser ou enlever Iossef : plus de réveil de Lénine.
IA : témoignage de Iossef 0 à 3G ; témoignages des Komsomols 0 à 1G.`,
    [inScene(iossef), inScene(komsomols, { qty: 4 })], true,
    [choice('iossef', 'Que devient Iossef ?', [
      ['Neutralisé ou enlevé avant le jour J', 'Pas de réveil : « L\'insurrection n\'a pas lieu et Lénine repose en paix » (TRIC −2). Témoignage 0 à 3G s\'il est vivant.'],
      ['Laissé en place', 'Le jour J, il entre au mausolée avec des membres du FSB et réveille Lénine.'],
    ])]),
  scene('cathedrale', '6. La cathédrale Saint-Pierre-et-Saint-Paul', 'Cathédrale orthodoxe en béton, à deux pas de la Place Rouge et du Kremlin',
    `Rebâtie sur l'emplacement de l'originale dynamitée par Staline, c'est le vrai QG des anges de l'Ordre de Saint-Georges. La cinquantaine d'anges prévus pour le putsch logent dans le quartier et font les derniers préparatifs, noyés parmi les nobliaux convoqués à une « réunion exceptionnelle » de l'Ordre (l'Ordre de Saint-Georges ou la Mémoire de la Russie) : une sorte de Klonklave à la russe, qui place la haute noblesse près du Kremlin pour acclamer le passage du pouvoir au tsar.
Le clergé a flairé quelque chose, mais Strachnov a étouffé l'affaire : le Paradis n'est pas au courant. Va-et-vient suspect d'hommes et de femmes derrière l'iconostase (interdit aux visiteurs), comme à Notre-Dame.
Les anges de l'Ordre sont très fermés, surtout envers des catholiques occidentaux ; en en faisant boire un ou deux, on apprend que l'opération a lieu le jour de la fête nationale et doit rendre sa puissance à l'Ordre, à Georges et à la Russie.
Un assaut serait suicidaire (cinquante anges, sans fiche dans le livre).`, [], false),
  scene('palais', '7. Le Palais du Peuple', 'Bâtiment stalinien, état-major du putsch côté PCR',
    `Le PCR fournit 95 % des hommes et de la logistique : prise de commissariats, casernes, radios et bâtiments officiels dans plus de cent villes, plus une « opération marketing » : le réveil de Lénine. Trois étages bourdonnent ; le service d'ordre (anciens du KGB, souvent encore au FSB) contrôle sévèrement les conjurés. Les membres de l'Ordre et du PCR placés dans l'armée, le gouvernement et le FSB étouffent les signaux d'alerte.
Le bâtiment est ouvert au public, mais les étages du complot sont gardés : il faut des cartes du parti, qu'on peut subtiliser à des membres préalablement suivis. Une fois dedans, avec un air grave et un peu de russe, on entend beaucoup (langue de bois pleine de sous-entendus). Bureaux ouverts et dossiers mal rangés, surtout la nuit et pendant les réunions de cellules : en voler ou les photographier au numérique.
Vladimir Termienko y passe ses journées, épuisé mais avenant avec les étrangers cultivés et les journalistes ; secoué, il avoue tout.
IA : dossiers du Palais du Peuple 1 à 4G ; témoignage de membres communistes du complot 0 à 1G.`,
    [inScene(termienko), inScene(komsomols, { qty: 4 })], false,
    [choice('palais', 'Les PJ obtiennent-ils les dossiers du Palais du Peuple ?', [
      ['Oui (vol ou photos)', 'Dossiers 1 à 4G selon la qualité ; de quoi alerter le gouvernement via Edom.'],
      ['Ils sont repérés', 'Le service d\'ordre du PCR intervient ; le complot se méfie.'],
    ])]),
  scene('milady', '8. Le Milady', 'Bar à putes, boîte de nuit et restaurant au rez-de-chaussée et au sous-sol d\'un HLM géant',
    `Repaire de Katioucha, qui en est gérant et barman : blanchiment, traite, trafic de cadavres. Entrée invisible de l'extérieur, réservée aux habitués. 500 m² sur trois niveaux (deux ouverts au public) : alcôves, bars, pistes, backrooms, salles de snuff-movies, temples satanistes, réserve à zombies ; plus on descend, plus c'est malsain. Le pseudo-restaurant est un haut lieu des négociations mafieuses ; la milice ne descend jamais.
Sécurité discrète : clients tous armés avec leurs gardes du corps (équilibre de la terreur). Plusieurs tueurs de la mafia et une trentaine de putes zombies (organes vendus) gardent la boîte ; Katioucha en envoie une ou plusieurs régler les problèmes. Soirées nécro avec ses amis sorciers.
Katioucha connaît Pallard et Iossef, ignore l'opération JR mais trouve louche cette histoire de momie ; ses rapports s'arrêtent à Hornet. Menacé physiquement, il lâche tout plutôt que mourir.
IA : témoignage de Katioucha 0 à 5G.`,
    [inScene(katioucha), inScene(mafiosi, { qty: 4 }), inScene(putes, { qty: 6 })], true,
    [choice('katioucha', 'Comment se passe la rencontre avec Katioucha ?', [
      ['Les PJ jouent les collègues ou le menacent', 'Il parle (0 à 5G) : Pallard, Iossef, la momie ; il reste un ennemi rancunier.'],
      ['Massacre au Milady', 'Mafiosi et putes zombies en masse ; Katioucha, s\'il survit, prévient Hornet.'],
    ])]),
  scene('jour-j', '9. Le jour J : la fête « spontanée »', 'Place Rouge et mausolée de Lénine – jour de la fête nationale',
    `Si les PJ n'ont rien empêché (seuil 45 de la TRIC) :
• Iossef et des agents du FSB chargés de la sécurité entrent dans le mausolée et réveillent la momie. Lénine, contrôlé par Iossef, monte au-dessus du mausolée, sourit à la foule et annonce au porte-voix son retour. Dimitri et l'élite de Mémoire sont près du Goum.
• Chaos : le PCR s'empare d'une bonne partie des points stratégiques (médias, casernes, aéroports, frontières, bases de missiles, ports). Incrédulité jusqu'à ce que Lénine montre ses cicatrices aux journalistes ; la foule le porte au Kremlin, où il fait un discours trop nationaliste au goût des communistes.
• Le soir, le Soviet suprême se réunit au Palais du Peuple ; Lénine, Iossef, Strachnov et l'aristocratie de l'Ordre tiennent le Kremlin, gardé par les anges, soldats de Dieu et militants de Nouvelle Russie. La délégation du PCR repart en comprenant que Lénine est la marionnette de l'Ordre.
• Les jours suivants : environ 75 % des objectifs atteints, mais le gouvernement tient la capitale grâce aux divisions d'élite ; combats entre rebelles et loyalistes.
• Au bout de trois semaines, Lénine déclare avoir vu la Lumière et donne le pouvoir à l'Église orthodoxe, puis se suicide. La foule réclame le tsar ; le patriarche couronne Strachnov. La plupart des communistes basculent chez les loyalistes : guerre civile de quelques mois, victoire de la mafia et des loyalistes, Strachnov et l'aristocratie presque tous tués.
TRIC : réveil +10 ; pouvoir à l'Église +10 ; Strachnov tsar +10 ; puis +1 par semaine de guerre civile et +3 par semaine de règne de Strachnov.`,
    [inScene(dimitri), inScene(sdd, { qty: 6 }), inScene(frappes, { qty: 6 }), inScene(iossef), inScene(lenine)], true),
  scene('kremlin', '10. La maladie d\'amour : décapiter le mouvement', 'Kremlin, bureau historique de Lénine – après le réveil',
    `Si l'insurrection a commencé, on peut encore limiter les dégâts en frappant à la tête : abattre Iossef ou Strachnov, et mettre Lénine hors d'état de nuire. Les deux sont toujours au Kremlin : l'un contrôle Lénine, l'autre négocie avec les staliniens, le gouvernement légitime, l'aristocratie et l'Ordre. Ils craignent les représailles et un assaut des commandos loyalistes du FSB.
• La ruse s'impose : se faire passer pour des membres de l'opération JR (Strachnov est loin de tous les connaître), puis passer à l'action.
• Kremlin survolté, gardes et militants partout, ambiance de révolution d'Octobre. Plans du Kremlin trouvables sur Internet et dans les livres d'histoire.
• Lénine « vit » dans son bureau historique ; Iossef est toujours près de lui, avec une dizaine de soldats de Dieu de Mémoire déguisés en gardes du Kremlin. Strachnov va et vient mais ne quitte pas le bâtiment.`,
    [inScene(strachnov), inScene(iossef), inScene(lenine), inScene(sdd, { qty: 10, nom: 'Soldats de Dieu de Mémoire (en gardes du Kremlin)' })], true,
    [choice('decapiter', 'Le mouvement est-il décapité ?', [
      ['Strachnov et/ou Iossef abattus, Lénine neutralisé', 'L\'Ordre de Saint-Georges s\'effondre (TRIC −5) ; selon la suite, démocrates (−10) ou communistes (−10, puis +2 par semaine) reprennent le pouvoir.'],
      ['Échec', 'Le scénario du jour J se déroule jusqu\'au couronnement du tsar.'],
    ])]),
  scene('bilan', '11. Bilan : TRIC et Index d\'Accusation', 'Après Moscou',
    `Faire le compte avec les listes des notes du scénario (modificateurs de TRIC et preuves de l'IA).
Rappel : seules les preuves effectivement transmises à Régine comptent dans l'IA officiel ; les PJ peuvent en garder pour le procès final. Les PA dépendent de l'IA (pas de barème propre au chapitre).
Fils à suivre : Katioucha et Hornet (Tokyo : témoignage d'un ange envoyé par Katioucha) ; Okefenokee et Dixie Securities (Jacksonville) ; Pallard et Medes (Paris).`, [], false,
    [choice('issue', 'Issue à Moscou ?', [
      ['Putsch empêché avant le jour J', 'TRIC −2 ; si l\'Ordre de Saint-Georges est démantelé, −5 de plus.'],
      ['Lénine réveillé puis mouvement décapité', 'TRIC +10, puis −5 (Ordre neutralisé) et −10 au retour des démocrates ou des communistes.'],
      ['Rien n\'a été empêché', 'TRIC +10 +10 +10, puis +1 par semaine de guerre civile et +3 par semaine de tsar Strachnov.'],
    ])]),
];

const scenario = {
  id: 'jr5-moscou',
  nom: 'Jésus Reviens ! – 5. Moscou',
  resume: 'Campagne « Jésus Reviens ! » (MV, anges de grade 1 à 2 envoyés par Ange et Alain, avec Yves, prévenus par Michel, via leur chargée de mission Régine, pour enquêter sur l\'opération JR), épisode moscovite. Strachnov, ange de Georges qui dirige en sous-main l\'Ordre de Saint-Georges en Russie, s\'est rallié à l\'opération JR par Francesco et Semper Fidelis : avec le PCR de Vladimir Termienko, il veut faire réveiller la momie de Lénine par un sorcier (Iossef, fourni par Katioucha, démon de Hornet) le jour de la fête nationale, lancer une insurrection communiste, puis faire proclamer par Lénine le retour de l\'orthodoxie et du tsar. Les PJ doivent empêcher le réveil ou décapiter le mouvement, tout en rassemblant des preuves contre Georges (index G), l\'un des trois archanges visés avec Laurent et Dominique.',
  notes: `Source : ${REF} ; TRIC p. 9-10 ; Index d'Accusation p. 12.

Commanditaires des PJ : Ange et Alain (avec Yves), prévenus par Michel ; les PJ ne connaissent que Régine. Georges n'est pas un commanditaire : c'est l'un des archanges visés (index G), et Strachnov est son ange.

Contexte (résumé) :
• Strachnov (Miroslav Makarovski) est un des anges de Georges restés sur Terre quand Georges a cédé ses troupes à Laurent, mais toujours fidèles à leur archange ; il préside dans l'ombre l'Ordre de Saint-Georges (ordre militaire et nobiliaire officiel depuis la chute de l'URSS) et dirige Nouvelle Russie, groupuscule nationaliste-orthodoxe dont le bras armé est Mémoire (skins encadrés par Dimitri Polzoski et des soldats de Dieu).
• Il a rencontré Semper Fidelis et Francesco, qui l'ont mis dans le secret de l'opération JR. Il propose à Termienko (PCR) de ressusciter Lénine pour prendre le pouvoir, en taisant que Lénine rendra ensuite le pouvoir au tsar et à l'Église. Francesco, sur conseil d'Emmanuel, lui présente Pallard, qui trouve Katioucha.
• Pallard est soupçonné de trahison par l'Enfer (dénoncé par Medes, bras droit de Mathias) : Katioucha prévient Hornet, nouveau prince-démon des morts, qui ne dit rien à personne. Iossef, le sorcier choisi, est tenu par Edom (démon de Mathias). Medes sait donc qu'il se passe quelque chose et peut aiguiller les PJ.
• Pas de chronologie : un seul événement, le réveil de Lénine (seuil 45 de la TRIC). S'il a lieu, la Russie plonge pour longtemps dans le chaos.

Façons de gagner : neutraliser Strachnov avant le jour J (coordinateur indispensable) ; neutraliser Iossef ; transmettre au gouvernement russe (via Edom) la liste des complices ou des preuves convaincantes assez tôt ; après le réveil, abattre Iossef ou Strachnov et neutraliser Lénine au Kremlin.

Modificateurs de la TRIC (Moscou) :
• Insurrection sur la Place Rouge et réveil de Lénine : +10
• L'insurrection n'a pas lieu et Lénine repose en paix : −2
• Lénine donne le pouvoir à l'Église orthodoxe russe : +10
• L'Église orthodoxe russe donne le pouvoir à Strachnov et le couronne tsar : +10
• Par semaine de guerre civile en Russie : +1
• Par semaine où Strachnov est tsar : +3
• L'Ordre de Saint-Georges est neutralisé : −5
• Les démocrates récupèrent le pouvoir : −10
• Les communistes récupèrent le pouvoir : −10
• Par semaine où les communistes ont le pouvoir : +2
Liés à Moscou ailleurs : réunion Strachnov-Francesco-Immaculus réussie (Paris) +2. Seuil 45 : réveil de Lénine (+10), puis pouvoir à l'Église (+10) et Strachnov tsar (+10). Seuil 65 : la Russie tsariste décide de raser la Tchétchénie.

Preuves de l'Index d'Accusation (Moscou) :
• Dossiers de l'appartement de Nouvelle Russie : 2G+1L
• Témoignage de Dimitri Polzoski : 0 à 2G
• Preuves que les skins de Mémoire sont allés chez Dixie Securities : 1L
• Témoignage des soldats de Dieu de Mémoire : 1L (sauf si Dimitri a parlé)
• Témoignage de Iossef : 0 à 3G
• Témoignages des Komsomols : 0 à 1G
• Dossiers du Palais du Peuple : 1 à 4G
• Témoignage de membres communistes du complot : 0 à 1G
• Témoignage de Katioucha : 0 à 5G
• Témoignage de Strachnov : 2 à 5G
Lié : témoignage de Pallard sur Katioucha (Paris) 1 à 2D.
Les fourchettes dépendent de la qualité de la preuve (le MJ juge). Seules les preuves transmises à Régine entrent dans l'IA officiel ; les méchants réagissent à l'IA.

Récompenses : PA selon l'IA (règle de la campagne), pas de barème propre au chapitre.
Fiches : caractéristiques du livre (niveaux convertis), armes du livre (Kalachnikov −2/+5, pistolet russe −3/+4, sabre cosaque 0/+2, batte −1/+2) ; valeurs estimées signalées dans les notes des fiches. Les cinquante anges de l'Ordre et Medes n'ont pas de fiche.`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [strachnov, termienko, dimitri, edom, katioucha, iossef, lenine, mafiosi, putes, sdd, frappes, komsomols].map(asType);
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));
writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types,', scenes.reduce((a, s) => a + s.choix.length, 0), 'choix');
