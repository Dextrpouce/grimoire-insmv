// Génère le fichier d'import « insmv-scenario » pour « Twenty-two Tunes from Tokyo » (Jésus Reviens !, chapitre sept, p. 90-99)
// usage : node gen-jesus-reviens-6-tokyo.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Jésus Reviens !, chapitre sept « Twenty-two Tunes from Tokyo », p. 90-99';
const L = (s) => R.parseLvl(String(s));
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
const ARMES = new Map(R.ARMES.flatMap(([g, l]) => l.map((x) => [x[0], { prec: x[1], puis: x[2], melee: R.MELEE_GROUPS.includes(g) }])));
// arme de la table des règles : nom affiché, nom dans la table, niveau du talent
const arme = (n, table, lvl) => { const w = ARMES.get(table); if (!w) throw new Error('arme inconnue : ' + table); return { n, att: L(lvl), ...w }; };
// arme du livre : précision / puissance données par la fiche
const wpn = (n, lvl, prec, puis, melee) => ({ n, att: L(lvl), prec, puis, melee });
const poing = (lvl) => arme('Coup de poing', 'Coup de poing', lvl);
const P = 'jr6-'; let n = 0; const id = (k) => P + k;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [poing(1)], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});

// ---------------- Le démon et ses troupes ----------------
const monty = npc('monty', {
  nom: 'Monty (Mark Taylor)', source: 'Démon de Kobal, grade 2 (faux ange de Walther, « néo-Washington »)', type: 'demon', car: car('5 4 3 2+ 4 3'), def: L(4),
  pp: 24, pfFix: 7, seuilsFix: seuils('7/14/21/28'),
  armes: [wpn('Couteau de cuisine électrique maudit majeur', 5, 2, 5, true)],
  pouvoirs: pows('Gag absurde 4, Membre exotique : crocs, Aura de confusion 3, Caméléon 3, Esprit chaotique 2, Jet d\'acide 1, Malédiction : folie 1, Rebond 2'),
  talents: 'Métier (cuisinier) 2+, Discours stupides 2, Imiter Chaplin dans « Le Dictateur » 3, Défense 4, Corps à corps 3, Combat 3 (armes improvisées 5), Baratin 4, Aisance sociale 3, Séduction 3, Hobby (inventer des recettes immondes) 4, Japonais, Savoir occulte 1 (opération JR et Grand Jeu au Japon 2+), Culture générale 1+ (culture américaine du XXe siècle, vie quotidienne au Japon 2+)',
  notes: `38 ans, brun aux yeux verts. Exilé au Japon depuis une dizaine d'années par Kobal après une mission ratée qui a coûté la vie à tous ses collègues… mais a fait beaucoup rire son prince. Cuisinier dans un restaurant anglais, il glisse des bas morceaux immondes dans les plats des clients shintoïstes pour « pourrir leur karma ».
Infiltré depuis environ deux ans chez les soldats de Dieu du Garage, où il se fait passer pour un ange de Walther rescapé d'une mission tragique : il n'est pas officiellement membre du groupe mais en est le chef de fait. Peu de contacts avec l'Enfer (il est plus ou moins puni), mais correspondance régulière avec Katioucha (Moscou), dont il connaît l'adresse.
L'opération « Mickey Mouse über alles » est entièrement de son fait : il la monte pour le plaisir et pour faire assez rire Kobal afin de ne pas être blâmé comme la dernière fois. Aucun démon ne sera inquiété par l'Enfer pour cette affaire.
Ce qu'il sait de JR : peu de chose (ce que Katioucha et les soldats de Dieu lui ont raconté, brodé à sa façon). Interrogé « virilement », il répond par des calembours et des affabulations ; avec du temps et de la patience, on peut lui arracher le nom de son chargé de mission et d'un ou deux collègues (le MJ improvise alors une chasse aux démons au Japon).
Gag stupide 4 dans le livre : rendu par Gag absurde. Crocs : pouvoir Membre exotique : crocs.`,
});
const rob = npc('rob', {
  nom: 'Rob Parker', source: 'Soldat de Dieu, chef officiel du groupe du Garage', type: 'soldat', car: car('3 2+ 3 1+ 2+ 3'), def: L(2),
  pp: 4, pfFix: 4, seuilsFix: seuils('4/8/12/16'),
  armes: [wpn('Couteau de commando', 3, 0, 1, true), wpn('CAR15', '3+', -2, 5, false)],
  pouvoirs: pows('Arme exaltée 2'),
  talents: 'Combat 1+ (couteaux 3), Tir 1+ (armes d\'épaule 3+), Défense 2, Savoir militaire 1+ (tactique commando 3+), Survie 1, Hobby (sculpture sur bois au couteau) 2, Savoir occulte 0+ (Grand Jeu au Japon et opération JR 1), Culture générale 1+ (American Way of Life 2+), Infiltration 3+, Savoir d\'espion 1 (infiltration 3+)',
  notes: `37 ans, châtain aux yeux marron. Soldat de Dieu californien, caricature du vétéran américain : pour lui le Vietnam et le 11 septembre sont les seuls événements marquants du demi-siècle, et seul l'American Way of Life est valable. Sa bêtise lui a valu d'être placardisé au Japon ; Monty l'a convaincu sans peine que l'opération de Disneyland est la riposte au 11 septembre. Bras droit fidèle de Monty, il ne mesure pas le ridicule de la situation.
Il laisse Monty diriger tant qu'un semblant de discipline est respecté.
CAR15 : attaque multiple, pénétration importante, portée moyenne.
Seuils : le livre indique MS 12 (coquille probable) ; 16 retenu, selon la progression BL 4 / BG 8 / BF 12.`,
});
const soldats = npc('soldats', {
  nom: 'Soldats de Dieu du Garage', source: 'Groupe américanophile de Tokyo (25 hommes)', type: 'soldat', qty: 6, car: car('2+ 3 3+ 2 1+ 2'), def: 2,
  pp: 5, pfFix: 4, seuilsFix: seuils('3/7/10/14'),
  armes: [wpn('CAR15 silencieux', '3+', -2, 5, false), wpn('Fusil de sniper', '3+', 0, 5, false), wpn('Mitrailleuse', '3+', -2, 9, false)],
  pouvoirs: pows('Caméléon 2'),
  talents: 'Tir 1+ (armes d\'épaule 3+), Discrétion 3, Savoir militaire 1 (commando 3), Intrusion 3, Fouille 2, Acrobatie 2+, Athlétisme 2+, Japonais, Culture générale 1 (American Way of Life 2+), Savoir occulte 0+ (Grand Jeu au Japon et opération JR 1), Survie 1',
  notes: `« Pour Mickey, banzaï ! » Surtout des Occidentaux émigrés, mal intégrés, et quelques catholiques japonais descendants des survivants des persécutions du XVIIe siècle. Prépositionnés pour épauler l'armée américaine en cas de besoin, ils n'ont jamais eu de mission et s'ennuient ferme : le week-end, ils regardent des films américains au Garage en buvant de la bière. Une vingtaine d'entre eux a fait un stage de trois semaines au camp des marais d'Okefenokee (Semper Fidelis). L'opération Mickey est leur première vraie mission : ils veulent montrer ce qu'ils valent.
Une arme parmi les trois (une seule par soldat). Défense non donnée : niveau 1 (2).
Quantité de la scène à ajuster (25 au total).`,
});
const yakuzas = npc('yakuzas', {
  nom: 'Yakuzas', source: 'Hommes de main de la mafia japonaise (une centaine, payés par Monty)', qty: 8, car: car('2+ 3 2 2 2+ 2'), def: L(3),
  pfFix: 4, seuilsFix: seuils('3/7/10/14'),
  armes: [wpn('Pistolet', 2, -2, 3, false), wpn('Sabre court japonais', '2+', 0, 0, true)],
  talents: 'Savoir criminel 1 (yakuzas 2+), Tir 1 (armes de poing 2), Corps à corps 3, Défense 3, Baratin 2, Hobby (comparer leurs tatouages) 2, Intimidation 2+, Anglais, Culture générale 1 (traditions et code d\'honneur des yakuzas, vie quotidienne au Japon 2+), Combat 1 (épées 2+), Mah-jong 2',
  notes: `« Connards d'Américains ! » Racaille des bas-fonds qui singe les samouraïs : tatouages, code d'honneur de façade, petites frappes sans scrupules. Ils fuiront dès qu'ils sentiront l'affaire perdue, c'est-à-dire assez vite. Monty est leur seul contact ; ils n'aiment guère les soldats de Dieu, qui le leur rendent bien : les PJ peuvent exploiter cette rivalité.
Pistolet : pénétration importante, portée moyenne. Témoignages sans valeur pour l'IA (0).`,
});

// ---------------- Civils et forces de l'ordre ----------------
const otages = npc('otages', {
  nom: 'Otages', source: 'Employés de Disneyland et visiteurs', qty: 10, car: car('2 2+ 2 1+ 2 1'), def: 2,
  pfFix: 3, seuilsFix: seuils('3/6/9/12'), armes: [poing(1)],
  talents: 'Métier (employé de parc d\'attractions) 2, Se déguiser en personnage Disney une demi-journée par mois 2, Rester discipliné 2, Faire pitié 2, Se faire exploiter par le capitalisme américain 3, Culture générale 1 (culture japonaise et culture Disney 2+), Anglais',
  notes: `« Haï, sama ! » Employés exploités et touristes venus se détendre, embringués dans une prise d'otages à grande échelle. La plupart fuiront dès qu'ils le pourront ; d'autres collaboreront avec leurs bourreaux dans l'espoir de s'en sortir.
Défense non donnée : niveau 1 (2).`,
});
const policiers = npc('policiers', {
  nom: 'Policiers japonais', source: 'Unités antiterroristes', qty: 6, car: car('2+ 2+ 3 2 2 2'), def: L(2),
  pfFix: 4, seuilsFix: seuils('3/7/10/14'),
  armes: [wpn('Tonfa (non létal)', 3, 0, 1, true), wpn('Pistolet', '2+', -2, 3, false)],
  talents: 'Métier (policier) 2, Enquête 2, Fouille 2, Intrusion 2, Corps à corps 3, Défense 2, Tir 1 (armes de poing 2+), Culture générale 1 (culture japonaise 2), Athlétisme 2, Respect envers l\'empereur 2, Intimidation 2, Anglais',
  notes: 'Rompus aux arts martiaux et à la lutte antiterroriste, sans états d\'âme envers des preneurs d\'otages, surtout depuis que ceux-ci ont insulté l\'Empereur. Tonfa : attaque au Corps à corps. Contacts possibles pour les PJ qui veulent entrer dans le parc avec les forces de l\'ordre.',
});
const journalistes = npc('journalistes', {
  nom: 'Journalistes', source: 'Presse nationale et internationale', qty: 4, car: car('2 3 3 1+ 1+ 2'), def: 2,
  pfFix: 4, seuilsFix: seuils('3/6/9/12'),
  talents: 'Métier (journaliste) 2, Remuer la merde 2, Poser des questions indécentes 2, Être les larbins du pouvoir 2+, Anglais, N\'avoir aucun respect pour les victimes 2+, Enquête 2, Fouille 3, Intrusion 2+',
  notes: 'Charognards en quête de scoop, prêts à filmer le désespoir des otages comme le grotesque des défilés « républicains ». Chassés par Monty (seule Disney Channel est autorisée), ils cherchent à s\'infiltrer illégalement dans le parc : couverture possible pour les PJ, et indispensables pour démontrer la supercherie aux médias. Défense non donnée : niveau 1 (2).',
});
const commandos = npc('commandos', {
  nom: 'Commandos japonais', source: 'Forces spéciales de l\'État', qty: 6, car: car('2 2 3 2+ 2+ 3'), def: L(2),
  pfFix: 3, seuilsFix: seuils('3/6/9/12'),
  armes: [wpn('Fusil-mitrailleur', 3, -2, 5, false)],
  talents: 'Tir 1 (armes d\'épaule 3), Défense 2, Corps à corps 2, Discrétion 3, Savoir militaire 1 (commando 3), Intimidation 2, Anglais, Athlétisme 2, Acrobatie 2+',
  notes: 'Machines à tuer bien dressées : ils font ce qu\'on leur dit de faire. Ils entrent dans le parc quand les autorités se décident à agir (après le massacre de Space Mountain) et tirent sur tout ce qui ressemble à un preneur d\'otages… ou à un intrus. Fusil-mitrailleur : attaque multiple, pénétration importante, portée longue.',
});

// ---------------- Les anges envoyés par Semper Fidelis, Francesco et Strachnov ----------------
const zenoch = npc('zenoch', {
  nom: 'Zenoch (Wilhelm Schwarz)', source: 'Ange de Georges, grade 1 (contacté par Strachnov)', type: 'ange', car: car('4 3 2 2 4 4'), def: L(3),
  pp: 8, pfFix: 6, seuilsFix: seuils('7/14/21/28'),
  armes: [wpn('Réplique d\'épée allemande à deux mains, démontable', 3, -1, 2, true)],
  pouvoirs: pows('Champ de force 2, Arme exaltée 2, Rebond 1, Vitesse 2'),
  talents: 'Hobby (foot) 4, Culture générale 0+ (championnats d\'Europe et d\'Allemagne de foot 3), Baratin 2, Défense 3, Métier (conseiller culturel) 1, Savoir d\'espion 3, Savoir occulte 1 (Grand Jeu au Japon 3), Discrétion 3, Aisance sociale 3, Japonais, Anglais, Chants nazis 2',
  notes: `35 ans, brun aux yeux marron. Chef autoproclamé des anges intégristes du Japon : une brute qui ne croit qu'à la force et a toujours le dernier mot. Officiellement conseiller culturel de l'ambassade d'Allemagne à Tokyo, il est au placard depuis des décennies et change d'identité tous les vingt ans.
Contacté en urgence par Strachnov pour régler le problème Mickey, ravi de participer à JR dont il a entendu parler sans en connaître les détails. Il connaît les coordonnées de Strachnov et de Nouvelle Russie (piste vers Moscou).
Témoignage : c'est « l'ange envoyé par Katioucha » des listes de l'IA (0 à 2G pour l'ensemble des anges de ce groupe).
Combat non donné par la fiche : attaque estimée au niveau 3 (Arme exaltée).`,
});
const shim = npc('shim', {
  nom: 'Shim (Charles-Hubert de Carbon-Tantrel)', source: 'Ange de Laurent, grade 1 (envoyé par Semper Fidelis)', type: 'ange', car: car('4 3 2 1+ 2 5'), def: L(3),
  pp: 12, pfFix: 5, seuilsFix: seuils('7/14/21/28'),
  armes: [wpn('Rapière bénie mineure', '4+', 3, 3, true)],
  pouvoirs: pows('Juste-lame 2, Boomerang 1, Paralysie 1'),
  talents: 'Culture générale 1 (histoire de France 3), Hobby (généalogie) 3, Parler avec un accent vieille France méprisant 2, Anglais, Japonais, Défense 3, Combat 2 (épées 4+), Métier (cadre commercial) 1+, Savoir occulte 1 (Grand Jeu au Japon 2), Aisance sociale 3, Discussion 3, Hobby (bonnes manières) 2',
  notes: `22 ans, 165 cm, albinos. Nobliau fin de race perdu dans ses rêves de grandeur passée, raciste mais incarné dans un descendant de békés réunionnais au huitième noir, ce qui le fait vomir. Le peuple, pour lui, est un troupeau qu'une élite doit diriger malgré lui. Emploi fictif d'expatrié chez un grand groupe de cosmétiques, qui lui laisse le temps d'étudier les Japonais, seuls non-Blancs qu'il juge dignes d'intérêt.
Chargé par Semper Fidelis, qu'il connaît et admire, de régler le problème Mickey : une injure à JR. Il est angoissé à l'idée d'agir, mais pour le bien de la race blanche et chrétienne. Il connaît les coordonnées de Francesco à Madrid.
Témoignage : « ange envoyé par Semper Fidelis » (0 à 2L).`,
});
const pahoran = npc('pahoran', {
  nom: 'Pahoran (Madouff Rhanaivoharivony)', source: 'Ange de Michel, grade 1 (venu par amitié pour Zenoch)', type: 'ange', car: car('4 3 4 2 3 3'), def: L(3),
  pp: 11, pfFix: 6, seuilsFix: seuils('7/14/21/28'),
  armes: [wpn('Fusil à éléphant béni mineur', 6, 2, 8, false), wpn('Machette', '4+', 1, 1, true)],
  pouvoirs: pows('Caméléon 2, Sens surdéveloppés, Non-détection 3'),
  talents: 'Combat 2 (épées 4+), Français, Anglais, Tir 2 (armes d\'épaule 6), Défense 3, Discrétion 4, Acrobatie 3, Athlétisme 4, Culture générale 2 (culture du Japon et de Madagascar 4), Savoir occulte 1 (Grand Jeu 2), Japonais',
  notes: `34 ans, 165 cm, Africain. Intégriste raciste coincé dans un corps noir (son hôte, chrétien pratiquant, se croyait bien intégré) : il le vit très mal, ce qui a encore aggravé son racisme. Il expie ce « péché » en tuant des non-Blancs, de préférence des non-Noirs. Son dossier de mutation est bloqué depuis 116 ans au Paradis ; membre permanent de la cellule du Japon, il apprécie le calme du pays même si ses collègues le regardent de travers.
Venu par amitié pour Zenoch, incognito : il n'a pas prévenu Michel. N'a pas d'information propre sur JR.
Fusil à éléphant : pénétration importante, portée longue.`,
});
const mohab = npc('mohab', {
  nom: 'Mohab (Kojiro Minofuke)', source: 'Ange de Dominique, grade 1 (envoyé par Francesco)', type: 'ange', car: car('3 3 3+ 5 4 3'), def: L(2),
  pp: 10, pfFix: 8, seuilsFix: seuils('6/12/18/24'),
  armes: [wpn('Katana béni mineur', 2, 3, 4, true), wpn('Revolver', 2, -2, 4, false)],
  pouvoirs: pows('Jugement 2, Peur 1, Corps gazeux'),
  talents: 'Métier (responsable administratif) 2, Savoir occulte 1 (Grand Jeu et opération JR 3), Culture générale 1 (culture japonaise 2), Combat 1 (épées 2), Défense 2, Corps à corps 2, Baratin 3, Discussion 4, Aisance sociale 3, Anglais, Intimidation 3, Tir 1 (armes de poing 2)',
  notes: `22 ans, brun aux yeux marron. Responsable administratif angélique pour tout le Japon, investi d'une mission divine… dans un pays où anges et démons n'ont presque rien à faire. Calme et raisonné, intégriste modéré : l'élément modérateur du groupe improvisé, impassible, aussi peu expressif qu'un héros de Kitano. Francesco l'a chargé du problème Mickey sans se faire prendre.
En cas de combat, il fuit plutôt que d'être capturé et n'hésite pas à tenter de tuer ses complices pour les empêcher de parler. Il connaît les coordonnées de Francesco à Madrid et en sait plus que les autres sur JR (Savoir occulte 3).
Témoignage : « ange envoyé par Francesco » (0 à 2D). Revolver : pénétration importante, portée moyenne.`,
});
const tarshish = npc('tarshish', {
  nom: 'Tarshish (Miroslav Marakic)', source: 'Ange de Michel, grade 1 (fidèle de Zenoch)', type: 'ange', car: car('3 3+ 4+ 2 1+ 4'), def: L(4),
  pp: 8, pfFix: 5, seuilsFix: seuils('6/12/18/24'),
  armes: [wpn('Kalachnikov bénie mineure', 5, 0, 7, false), wpn('Couteau commando', 5, 0, 0, true)],
  pouvoirs: pows('Maîtrise martiale 2, Armure corporelle 1, Jet de flammes 1'),
  talents: 'Corps à corps 4, Combat 2 (couteaux 5), Défense 4, Tir 2 (armes d\'épaule 5), Savoir militaire 2 (tactique 4), Anglais, Japonais, Hobby (collection d\'oreilles) 3+, Hobby (désacraliser les lieux de culte non catholiques) 5, Métier (mercenaire) 4, Athlétisme 3, Acrobatie 2, Torture 3, Culture générale 1+ (vie quotidienne en ex-Yougoslavie 3), Savoir occulte 1 (la Terre Creuse 3), Intimidation 4, Conduite 3, Survie 1 (montagne 3), Discrétion 3',
  notes: `42 ans, brun aux yeux marron. Ancien mercenaire en Yougoslavie, chaudement récompensé pour ses talents de « nettoyeur » (surnommé Monsieur Propre) : pour lui l'ennemi est le musulman, l'orthodoxe et tout ce qui n'est ni blanc ni catholique. Nommé à Tokyo par piston pour se rapprocher de Zenoch, qu'il admire sans limite ; brutal, borné, bourreau inhumain qui se complaît dans la souffrance d'autrui. Officiellement en mission auprès de la légation du Vatican, il passe son temps libre dans les académies d'arts martiaux.
Savoir occulte (la Terre Creuse) 3 : peut-être une piste vers la purge de Daniel (à l'appréciation du MJ, aucune valeur d'IA dans le livre).
Armure corporelle (argent) 1 dans le livre. Kalachnikov : attaque multiple, pénétration importante, portée longue. Un talent sordide de la fiche n'est pas repris.`,
});

const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  scene('situation', '1. Mickey Mouse über alles : la situation', 'Tokyo – avant le déclenchement (seuil 50 de la TRIC)',
    `À lire par le MJ. Le Japon est un trou perdu du Grand Jeu : chrétiens rares, shintoïstes et bouddhistes étrangers au conflit, et une secte psionique très puissante (la Soka Gakai) qui tient l'archipel à l'écart des anges et des démons. Les quelques anges en poste sont des placardisés.
Monty, démon de Kobal en exil, s'est infiltré dans un petit groupe de soldats de Dieu américanophiles qui se réunit le week-end au « Garage », un vieil entrepôt de la lointaine banlieue de Tokyo. Une vingtaine d'entre eux revient d'un stage de trois semaines au camp d'Okefenokee (Semper Fidelis), sans lien direct avec JR, mais avec des bribes de conversation sur le « retour des valeurs de l'Occident chrétien ». Pour deux canettes de bière, Monty apprend tout ce qu'ils savent, recoupe avec son ami Katioucha à Moscou, et comprend que les anges trichent avec le Grand Jeu.
Sa réponse : une parodie de JR, l'opération « Mickey Mouse über alles ». Prendre le Disneyland de Tokyo et y proclamer la République américanophile du Soleil Levant, premier pas vers un Japon devenu 52e État américain. Il ne sait pas ce que veulent les anges : il s'amuse, et veut faire rire Kobal.
Les soldats de Dieu croient à une mission officielle : Monty leur a dit qu'elle faisait partie d'une campagne plus vaste baptisée « JR » (en hommage au héros de Dallas).

Arriver avant le jour J : des indices mènent ici depuis Moscou (correspondance de Katioucha avec Monty) et depuis le marais d'Okefenokee (liste des stagiaires japonais). Il suffit de retrouver les coordonnées du groupe, voire de le faire convoquer par la hiérarchie des soldats de Dieu. Attention : une convocation bidon met Monty en alerte et il disparaît ; une descente éclair au Garage permet en revanche une belle prise (scène 2).
Déclenchement : l'opération part quand la TRIC atteint 50 (voir les notes du scénario). Le MJ peut l'annoncer par quelques indices.`,
    [inScene(monty), inScene(rob)], false,
    [choice('approche', 'Comment les PJ remontent-ils jusqu\'au groupe du Garage ?', [
      ['Descente éclair au Garage', 'Scène 2 : chance de capturer Monty et Rob Parker avant le jour J ; la prise d\'otages n\'a pas lieu.'],
      ['Convocation par la hiérarchie', 'Si elle sonne faux, Monty flaire le piège et file : il lance son opération plus tôt ou disparaît dans la nature.'],
      ['Trop tard : l\'opération est lancée', 'Scène 3 : jour J, TRIC +10, puis +2 par jour de prise d\'otages.'],
    ])]),
  scene('garage', '2. Descente au Garage', 'Entrepôt de la grande banlieue de Tokyo, rebaptisé « le Garage » – un week-end avant le jour J',
    `Le groupe s'y retrouve tous les week-ends : entraînement et endoctrinement, films américains, bières, vague rêve américain et, de temps en temps, un peu d'arts martiaux. Rob Parker en est le chef officiel ; Monty, présenté comme un ange de Walther rescapé d'une mission où tous ses collègues sont morts, en est le meneur réel. Il a refusé de suivre les autres au stage américain, de peur de son caractère officiel.
Les soldats de Dieu sont convaincus de servir le Paradis : ils ne s'en prendront pas à des anges qui s'annoncent comme tels. Bien joué (preuve que Monty n'est pas un ange, démonstration de son aura…), ils peuvent se retourner contre lui.
Monty, s'il est pris, tente de fuir (Caméléon, Aura de confusion) ou de semer la zizanie. Interrogé, voir sa fiche : peu d'informations, beaucoup de calembours.
Ce qu'on peut trouver : préparatifs de l'opération (plans du parc, contacts avec la mafia, explosifs), témoignages des soldats sur leur séjour chez Dixie Securities (0 à 1L), témoignage de Rob Parker (0 à 1L, non cumulable avec le précédent).`,
    [inScene(monty), inScene(rob), inScene(soldats, { qty: 8 })], true,
    [choice('garage', 'Issue de la descente ?', [
      ['Monty capturé avant le jour J', 'L\'opération Mickey n\'a pas lieu : pas de TRIC à Tokyo. Témoignage de Monty sur JR possible (0 à 2L).'],
      ['Monty s\'échappe', 'Il lance l\'opération plus tôt avec ce qui lui reste (scène 3) ou disparaît : le MJ décide.'],
      ['Les soldats se retournent contre Monty', 'Témoignages des soldats (0 à 1L) et de Rob Parker obtenus facilement.'],
    ])]),
  scene('jourj', '3. Jour J : la République américanophile du Soleil Levant', 'Disneyland Tokyo – du jour J au lendemain soir',
    `Chronologie si les PJ n'interviennent pas :
• Jour J, au petit matin : les 25 soldats de Dieu et une centaine de yakuzas prennent le contrôle du parc. Des centaines d'otages, surtout des employés, sont menacés et entourés d'explosifs aux points stratégiques. Jusqu'à 13 h, les visiteurs entrent normalement et sont discrètement faits prisonniers par des yakuzas déguisés en employés et en personnages Disney. Puis Monty, néo-Washington autoproclamé, convoque la presse.
• 18 h : installé dans le château de Cendrillon, rebaptisé palais de la Liberté, il explique que le Japon doit payer sa dette à la démocratie américaine et rejoindre le camp du capitalisme ; il attend les envoyés du gouvernement pour négocier sa reddition. Il demande aux Japonais de porter des oreilles de Mickey en signe de soutien, et appelle les soldats américains de l'archipel à le rejoindre. Visite de la « république » devant les caméras, otages assis sur des caisses d'explosifs.
• 22 h : des policiers trop zélés tentent d'entrer en force pendant la visite de presse ; ils sont hachés par les tirs croisés du bateau Mark Twain et du ballon publicitaire plein de tireurs d'élite. Monty les fait raccompagner aux portes, en direct.
• Vers 23 h : furieux contre les télés, Monty décrète que seule Disney Channel est objective et en fait la chaîne officielle de la république.
• L'ambassadeur américain condamne l'acte sur CNN Asia ; Monty répond par une diatribe sur la décadence de l'Amérique.
• Minuit : les forces de l'ordre encerclent le parc sans riposter aux tirs.
• J+1, 2 h : premiers négociateurs, reçus au restaurant du Buffalo Bill Wild West Show pour un grand show de propagande en direct (applaudissements forcés des otages). Ils attendent la fin de la retransmission, à 8 h, pour négocier.
• 17 h : négociations rompues par épuisement ; seul accord, l'échange des enfants et des malades contre des médicaments.
• 20 h : conférence de presse où Monty insulte l'Empereur : plus aucune négociation possible, communications du parc coupées, les forces de l'ordre préparent l'assaut (blindés, mitrailleuses lourdes). Yakuzas et soldats de Dieu s'inquiètent ; Monty ne réagit pas.
• Pendant ce temps, Semper Fidelis, Francesco et Strachnov, écœurés par cette « république » de clowns, envoient chacun un ou deux anges présents au Japon (scène 6).
• 22 h : les derniers employés réfugiés dans les Pirates des Caraïbes sont arrêtés par les yakuzas.

Ton : parodique, mais la prise d'otages fait de vraies victimes. Chaque heure compte pour la TRIC.`,
    [inScene(monty), inScene(rob), inScene(journalistes), inScene(policiers)], false,
    [choice('medias', 'Les PJ utilisent-ils les journalistes pour démonter la supercherie ?', [
      ['Oui, preuves à l\'appui', 'TRIC −5 si la démonstration est convaincante (voir scène 7).'],
      ['Non', ''],
    ])]),
  scene('parc', '4. Le parc assiégé : les lieux', 'Disneyland Tokyo, au bord de la mer – pendant la prise d\'otages',
    `Accès : le parc, entouré d'autres parcs (dont Disney SeaWorld), est coupé du monde. Les ponts routiers et ferroviaires, seuls accès, sont minés et surveillés. Un ballon Mickey géant plein d'otages patrouille au-dessus, avec soldats et yakuzas équipés de jumelles, micros, brouilleurs et fusils à lunette.
Entrer : seule une approche discrète et subtile a une chance ; un assaut frontal est doublement risqué (parc fortifié, forces de l'ordre tout autour). Profiter de la diversion causée par les anges de JR, ou de contacts dans les forces de l'ordre, ou se glisser parmi les journalistes.

Lieux :
• Arbre des Robinsons suisses : une trentaine d'otages attachés au pied, trois soldats de Dieu et une dizaine de yakuzas retranchés dans la cabane avec des mitrailleuses ; abords minés (des corps déchiquetés le prouvent). C'est là que frapperont les anges de JR.
• Pirates des Caraïbes : train sur rails dans une caverne de pantins animés. Le dédale des tunnels techniques abrite des dizaines d'employés cachés après avoir coupé le courant ; les yakuzas mettent des heures à « nettoyer » ce foyer de résistance. Quelques employés connaissent les coulisses et ont accès aux caméras, à l'informatique et aux téléphones de service : ils peuvent repérer les PJ sur les écrans et les aider, si ceux-ci pensent à décrocher les téléphones qui sonnent.
• Splash Mountain : montagne de grands huit aquatiques, attraction arrêtée, bateaux en barricades ; des dizaines d'otages creusent des tranchées puis sont attachés autour des bunkers. Le « Stalingrad » de la république, où doit mourir son élite.
• Château de Cendrillon : palais de la république, drapeau Mickey au sommet, accès très contrôlés. Monty y joue au dictateur de république bananière (discours au balcon, ministres, réunions, réception des « émissaires étrangers », le tout en direct sur Disney Channel). Une poignée d'otages jugés fiables sert de fonctionnaires et de population.
• Manège de Cendrillon : des dizaines d'enfants attachés sans leurs parents sur un manège qui tourne sans fin. Quelques yakuzas sadiques les gardent et s'y livrent à des exactions, loin des caméras et des soldats.
• Maison hantée : manoir néo-gothique, labyrinthe encore plus compliqué que les Pirates ; des employés s'y cachent aussi.
• Space Mountain : grands huit sous une pyramide futuriste ; trains pleins d'otages (surtout les parents des enfants du manège) qui tournent dans le noir. Une vingtaine de yakuzas les gardent mollement.
• Maison de Mickey : résidence présidentielle gardée par l'élite des soldats de Dieu, où Monty reçoit la presse (scène 5).
• Mark Twain Riverboat : bateau à aubes transformé en canonnière, il patrouille lentement sur le lac et les canaux en tirant sur tout ce qui bouge ; pont rempli d'otages, mitrailleuses, blindage de sacs de sable et de plaques d'acier.
• Main Street : théâtre des défilés « spontanés » : otages encadrés, quelques collaborateurs, employés habitués à obéir déguisés en clowns ; parade mêlant carnaval métallique néo-nazi, défilé de l'Armée rouge et attraction Disney, retransmise sur Internet via Disney Channel.`,
    [inScene(yakuzas, { qty: 10 }), inScene(soldats, { qty: 3 })], true,
    [choice('entree', 'Comment les PJ entrent-ils dans le parc ?', [
      ['Discrètement, par leurs propres moyens', 'Éviter assiégeants et assiégés ; les employés cachés des Pirates ou de la Maison hantée peuvent les guider.'],
      ['Parmi les journalistes ou comme émissaires', 'Accès direct à Monty (scène 5), mais sous l\'œil des caméras.'],
      ['Avec les forces de l\'ordre', 'Contacts japonais nécessaires ; ils entrent avec les commandos après le massacre (scène 6).'],
      ['En profitant de l\'attaque des anges', 'Diversion à l\'arbre des Robinsons ; risque de se retrouver entre trois feux.'],
    ])]),
  scene('mickey', '5. Chez Son Excellence', 'Maison de Mickey (résidence présidentielle) et château de Cendrillon',
    `Monty y mène sa vie « sociale » et y reçoit une partie des journalistes. Des PJ qui se font passer pour des émissaires ou se mêlent aux journalistes ont de bonnes chances de dîner ou de déjeuner avec Son Excellence le président de la république.
Garde : une vingtaine de yakuzas et une demi-douzaine de soldats de Dieu quand Monty est là ; sinon une dizaine de fonctionnaires (otages) et cinq yakuzas. Rob Parker ne le quitte pas.
Monty adore la parlote : discours absurdes, imitation de Chaplin dans « Le Dictateur », menus immondes. Il ne sait presque rien de JR mais peut lâcher, par vantardise, qu'il est en contact avec un « ami de Moscou » (Katioucha).
Démasquer Monty devant les soldats de Dieu (preuve qu'il est un démon) peut retourner le groupe contre lui et les yakuzas, qui n'attendent qu'un prétexte pour filer.`,
    [inScene(monty), inScene(rob), inScene(soldats, { qty: 6 }), inScene(yakuzas, { qty: 10 })], true,
    [choice('masque', 'Les PJ démasquent-ils Monty devant ses troupes ?', [
      ['Oui', 'Les soldats de Dieu se retournent contre lui, les yakuzas fuient : la république s\'effondre. Témoignages des soldats et de Rob Parker (0 à 1L).'],
      ['Non', 'La république continue jusqu\'au tribunal (scène 6).'],
    ])]),
  scene('massacre', '6. Le tribunal, Space Mountain et l\'arrivée des anges', 'Disney Store de Main Street, Space Mountain, arbre des Robinsons – J+2',
    `Si personne n'a arrêté Monty :
• 10 h : il ouvre un tribunal au Disney Store de Main Street (accusés, juges, avocats, public, policiers, tous costumés en personnages Disney), retransmis par Disney Channel puis piraté sur Internet ; le gouvernement ne parvient pas à localiser la liaison.
• Après huit heures de parodie de justice, les 18 accusés sont reconnus coupables de trahison et d'« esprit anti-Bambi » et condamnés à mort par Space Mountain. Monty fait déplacer les otages de l'attraction pour les remplacer par les condamnés.
• Profitant de la confusion, une partie des otages de Space Mountain se rebelle, s'empare d'armes et se retranche ; soldats de Dieu et une vingtaine de yakuzas donnent l'assaut : carnage télévisé et diffusé sur Internet. Monty est emmené par ses gardes sous un tas de corps.
• Les anges de JR profitent de la fusillade pour pénétrer dans le parc et libérer les otages, en commençant par l'arbre des Robinsons.
• 4 h : le calme revient à Space Mountain ; les otages survivants sont pendus devant l'attraction, en direct sur Disney Channel et les télés internes : malaise général.
• Pendant ce temps, les anges libèrent discrètement les otages des Robinsons mais se font repérer par le ballon Mickey en essayant de les faire sortir. Le parc devient un champ de bataille confus.
• Devant le massacre, les autorités se décident à agir : les commandos entrent dans le parc et ajoutent à la confusion.

Les anges de JR : Zenoch (Georges, contacté par Strachnov) mène le groupe ; Shim (Laurent, envoyé par Semper Fidelis), Mohab (Dominique, envoyé par Francesco), Pahoran et Tarshish (Michel, venus pour Zenoch). Ils veulent régler le problème dans le sang et sans témoins. Ce ne sont pas des alliés des PJ : des anges qui enquêtent sur JR sont pour eux des gêneurs, voire des traîtres. Capturés et interrogés, ils rapportent gros à l'IA (voir les notes du scénario) ; Mohab tente de fuir et de faire taire ses complices.
Les commandos tirent sur tout ce qui ressemble à un preneur d'otages… ou à un intrus.`,
    [inScene(zenoch), inScene(shim), inScene(mohab), inScene(pahoran), inScene(tarshish), inScene(soldats, { qty: 4 }), inScene(yakuzas, { qty: 6 }), inScene(commandos, { qty: 6 })], true,
    [choice('anges', 'Que deviennent les anges de JR ?', [
      ['Capturés et interrogés par les PJ', 'Témoignages : Semper Fidelis 0 à 2L (Shim), Francesco 0 à 2D (Mohab), groupe de Strachnov 0 à 2G en tout (Zenoch et les siens). Pistes vers Madrid et Moscou.'],
      ['Ils règlent l\'affaire dans le sang', 'TRIC +5, puis +1 par tranche de 10 morts.'],
      ['Ils repartent sans être identifiés', 'Rien pour l\'IA ; ils savent peut-être qu\'une équipe d\'anges fouine.'],
    ]),
    choice('preuves-anges', 'Les PJ trouvent-ils des preuves des motifs de la venue des anges ?', [
      ['Pour l\'ange de Semper Fidelis', '+1L à l\'IA.'],
      ['Pour l\'ange de Francesco', '+1D à l\'IA.'],
      ['Pour les anges de Strachnov', '+1G à l\'IA (« Katioucha » dans la liste du livre).'],
      ['Aucune', ''],
    ])]),
  scene('fin', '7. Wipeout : dénouement et bilan', 'Disneyland Tokyo, puis le reste du monde',
    `Que les PJ agissent ou non, la république ne tient pas plus de quelques dizaines d'heures : elle est trop ridicule et trop grave. Mais chaque heure fait monter la TRIC et risque de déclencher d'autres événements : les PJ ont intérêt à s'en mêler au plus tôt.
Deux options : laisser faire, ou intervenir. Intervenir est plus délicat mais plus malin : cela limite la tension mondiale et permet de récupérer des informations (interrogatoire des anges de JR).

Fin de Monty si personne ne l'arrête : devant les caméras, du haut de son château, il joue Salvador Allende, explique que son peuple l'a trahi et préfère s'abrutir de hamburgers, puis simule un suicide d'une balle dans la tête (ça fait très mal mais ne le tue pas). Une fois les caméras parties, il se relève, s'habille en Donald et disparaît dans la nuit pour toujours.

Bilan (voir les notes du scénario) : modificateurs de la TRIC et preuves de l'Index d'Accusation obtenues dans l'épisode. L'épisode se veut une récréation au milieu de la campagne : bruit, fureur et absurdité, un peu comme un après-midi au parc Disney.`,
    [], false,
    [choice('issue', 'Comment se termine la prise d\'otages ?', [
      ['Désamorcée par les PJ, sans massacre', 'Pas de bonus de bain de sang ; la prise d\'otages a duré le moins possible (+2 TRIC par jour écoulé).'],
      ['Dans le sang, par les anges de JR', 'TRIC +5, et +1 par tranche de 10 morts.'],
      ['Assaut des forces de l\'ordre', 'Morts à compter (+1 TRIC par tranche de 10 si les anges de JR y ont pris part).'],
    ]),
    choice('supercherie', 'Les PJ démontrent-ils aux médias que c\'est une supercherie ?', [
      ['Oui', 'TRIC −5.'],
      ['Non', ''],
    ]),
    choice('monty', 'Sort de Monty ?', [
      ['Capturé', 'Témoignage sur JR (0 à 2L) ; il connaît l\'adresse de Katioucha (piste vers Moscou).'],
      ['Enfui, déguisé en Donald', 'Il disparaît pour de bon ; Kobal a bien ri.'],
      ['Renvoyé en Enfer', 'Aucune enquête infernale : l\'Enfer s\'en lave les mains.'],
    ])]),
];

const scenario = {
  id: 'jr6-tokyo',
  nom: 'Jésus Reviens ! – 6. Tokyo',
  resume: 'Campagne « Jésus Reviens ! », épisode de Tokyo (« Twenty-two Tunes from Tokyo »), pour anges de grade 1 ou 2 envoyés par Régine pour le compte d\'Ange et d\'Alain. Monty, démon de Kobal infiltré chez des soldats de Dieu japonais américanophiles qu\'il fait passer pour un ange, parodie l\'opération JR : avec 25 soldats de Dieu et une centaine de yakuzas, il prend en otage le Disneyland de Tokyo et proclame la République américanophile du Soleil Levant. Les PJ peuvent le coiffer au poteau au Garage, s\'infiltrer dans le parc assiégé, démonter la supercherie devant les médias et surtout capturer les anges que Semper Fidelis, Francesco et Strachnov envoient régler l\'affaire dans le sang. Ton parodique, épisode récréatif.',
  notes: `Source : ${REF}. Liste des modificateurs et des preuves : chapitre un, p. 9-12 (la p. 13 manque au scan ; la liste de Tokyo semble complète en p. 12).
Commanditaires : Ange et Alain (avec Yves, prévenus par Michel), via leur chargée de mission Régine. Georges est l'un des trois archanges visés par l'IA (index G), comme Laurent (L) et Dominique (D).
Déclenchement : la prise d'otages a lieu quand la TRIC atteint 50 (« Monty prend en otage Disneyland Tokyo et proclame une république américanophile, +10 ; Semper Fidelis et Francesco envoient des anges régler ça dans le sang, +5 »). Les PJ peuvent arriver avant via les pistes de Moscou (Katioucha) et d'Okefenokee.
Déroulement : situation → descente au Garage (facultative, avant le jour J) → jour J et J+1 → infiltration du parc → chez Son Excellence → tribunal, massacre et anges de JR (J+2) → dénouement.

Modificateurs de la TRIC (Tokyo) :
• Début de la prise d'otages : +10
• Par jour de prise d'otages : +2
• Prise d'otages résolue dans le sang par les anges de Semper Fidelis : +5
• Par tranche de 10 morts : +1
• Les PJ démontrent aux médias que c'est une supercherie : −5
(Le seuil 50 de la TRIC déclenche l'épisode ; le livre ajoute que chaque heure qui passe fait monter la tension.)

Preuves de l'Index d'Accusation obtenables (Tokyo) :
• Témoignages de soldats de Dieu sur leur séjour chez Dixie Securities : 0 à 1L
• Témoignage de Rob Parker : 0 à 1L (non cumulable avec la preuve précédente)
• Témoignage de Monty sur l'opération JR : 0 à 2L
• Témoignage de l'ange envoyé par Semper Fidelis (Shim) : 0 à 2L
• Témoignage de l'ange envoyé par Francesco (Mohab) : 0 à 2D
• Témoignage d'un des anges envoyés par « Katioucha » : 0 à 2G (en tout)
• Preuves des motifs de la venue des anges de Semper Fidelis : 1L
• Preuves des motifs de la venue des anges de Francesco : 1D
• Preuves des motifs de la venue des anges de « Katioucha » : 1G
• Témoignages des yakuzas : 0
Adaptation : la liste du livre attribue des anges à Katioucha (démon de Moscou), alors que le chapitre les fait envoyer par Strachnov, ange de Georges (index G) : il s'agit du groupe de Zenoch (Zenoch, avec Pahoran et Tarshish qui l'ont suivi).

Pistes vers la suite : Monty connaît l'adresse de Katioucha ; Zenoch connaît les coordonnées de Strachnov et de Nouvelle Russie (Moscou) ; Shim et Mohab celles de Francesco (Madrid).
Récompenses : le livre ne donne pas de PA propres à l'épisode ; elles découlent de l'IA (voir le cadre de la campagne et l'épilogue).

Fiches : caractéristiques du livre en niveaux INS/MV (Ch des humains en Foi). Armes avec la précision et la puissance du livre. Valeurs estimées : défense des soldats de Dieu, otages et journalistes (non donnée : niveau 1) ; attaque de Zenoch (pas de Combat sur sa fiche : niveau 3) ; MS de Rob Parker (12 dans le livre, 16 retenu). Pouvoirs renommés : « Gag stupide » → Gag absurde, « Juste lame » → Juste-lame, « Malédiction (folie) » → Malédiction : folie. Les otages, policiers et journalistes ne sont pas des alliés des PJ mais des tiers.`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [monty, rob, soldats, yakuzas, otages, policiers, journalistes, commandos, zenoch, shim, pahoran, mohab, tarshish].map(asType);
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));
writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types');
