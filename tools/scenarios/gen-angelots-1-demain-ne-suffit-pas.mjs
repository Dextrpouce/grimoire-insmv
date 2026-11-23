// Génère le fichier d'import « insmv-scenario » pour « Demain ne suffit pas toujours » (Angelots en gelée, scénario 1, p. 2-24 ; la p. 25 manque au scan)
// usage : node gen-angelots-1-demain-ne-suffit-pas.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
globalThis.localStorage ??= { getItem: () => null, setItem: () => {} }; // scenario.js lit le stockage au chargement
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);
const S = await import(pathToFileURL(path.join(root, 'js/scenario.js')).href);

const REF = 'Angelots en gelée, « Demain ne suffit pas toujours », p. 2-24';
const L = (s) => R.parseLvl(String(s));
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
const ARMES = new Map(R.ARMES.flatMap(([g, l]) => l.map((x) => [x[0], { prec: x[1], puis: x[2], melee: R.MELEE_GROUPS.includes(g) }])));
const arme = (n, table, lvl) => { const w = ARMES.get(table); if (!w) throw new Error('arme inconnue : ' + table); return { n, att: L(lvl), ...w }; };
// attaque au format du livre « (seuil, RU+X, M+Y) »
const livre = (n, x, y, melee) => ({ n, att: x * 2, prec: 0, puis: y, melee });
const poing = (lvl) => arme('Coup de poing', 'Coup de poing', lvl);
const P = 'ag1-'; let n = 0; const id = (k) => P + k;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [poing(1)], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});
const P25 = 'Fiche absente : sa fiche se trouvait sans doute sur la p. 25, qui manque au scan. Valeurs ESTIMÉES à partir du profil « PNJ rapide » de l\'écran du maître';
// PNJ dont la fiche manque : profil rapide de l'écran (pnjrapides.js), recopié sous nos ids
const rapide = (key, camp, sup, pp, o) => {
  const q = S.quickNpc(camp, sup, pp); delete q.id;
  return npc(key, { ...q, ...o, notes: [o.notes, `${P25} (${camp === 'ange' ? 'ange' : 'démon'} de ${sup}, ${pp} PP).`, q.notes].filter(Boolean).join('\n') });
};

// ---------------- Morts-vivants de l'île de Ré ----------------
const alice = npc('alice', {
  nom: 'Alice', source: 'Zombi en socquettes (fillette de 7 ans)', type: 'mortvivant', car: car('1 2 2+ 2+ 2+ 3'), def: L(1),
  pp: 0, pfFix: 3, seuilsFix: seuils('4/8/12/16'), armes: [],
  talents: 'Défense 1, Discrétion 2, Connaissance de l\'île 2, Vouloir être journaliste quand elle sera grande 2+, Ne jamais devenir grande 3+',
  notes: 'C\'est son anniversaire, elle porte un déguisement de fée et circule sur son petit vélo. Beaucoup plus vive que les autres morts (chance exceptionnelle) : elle sombrera parmi les derniers et encaisse les révélations avec maturité.\nSes parents l\'ont oubliée et sont partis à l\'hyper U de Saint-Martin. Excellente guide de l\'île si on est gentil avec elle.\nIndice : elle a espionné à La Couarde trois adultes (une jolie dame très pâle, un gros, un « zombi tout pourri en blouson de cuir ») qui se lamentaient au sujet d\'un certain Bifrons ; ils se sont séparés devant le cinéma La Maline. Elle peut les décrire et les reconnaître.',
});
const alban = npc('alban', {
  nom: 'Alban', source: 'Fantôme esseulé (ancien fantôme d\'Ultima Necat)', type: 'mortvivant', car: car('1 1+ 2 3 3 4'), def: 2,
  pp: 9, pfFix: 4, seuilsFix: seuils('2/5/7/10'), armes: [],
  pouvoirs: pows('Anaérobiose, Apparence horrifique 1, Déphasage 1, Jeûne, Immunité contre les maladies et les poisons, Télékinésie 1'),
  talents: 'Baratin 3, Discrétion 3, Tricher aux jeux de plateau 2, Savoir occulte 1 (inventer des rumeurs sur le Grand Jeu 3)',
  notes: 'Âme d\'un sorcier atlante, affranchi ce matin par Ultima Necat. Colle aux PJ comme leur ombre et ment comme il respire (Atlantide, Da Vinci Code, évasion de morts-vivants, bombe atomique imminente…), mais connaît une bonne partie de la vérité : la veille, il était caché avec le sorcier dans la maison louée par sa maîtresse.\nTabou : il ne trahira jamais Ultima Necat ; il couvre peu les deux autres. Ne dira rien de l\'invocation sans pouvoirs mentaux.\nDéphasage inversé (cf. écran). Défense non donnée : niveau 1.\nS\'il est ramené à Planglok, celui-ci félicite l\'équipe.',
});
const zombiMidi = npc('zombi-midi', {
  nom: 'Zombi rétais (midi)', source: 'Mort-vivant accidentel mais très frais', type: 'mortvivant', qty: 6, car: car('2+ 1+ 2 1+ 1+ 2'), def: L(2),
  pp: 4, pfFix: 4, seuilsFix: seuils('4/8/12/16'), armes: [poing(2)],
  pouvoirs: pows('Anaérobiose, Jeûne, Immunité contre les maladies et les poisons'),
  talents: 'Corps à corps 2, Défense 2, Hobby (vélo) 2, Connaissance de l\'île 1+',
  notes: 'Short de plage, chaussures bateau, polo marine, Ouest-France sous le bras.\nÉvolution : 11 h hagards mais polis ; 13 h tension, agressions au hasard ; 15 h Fo 3 et griffes, Pr et Ch à 1 ; 16 h vrais zombis (fiche « 16 h ») ; 21 h ils s\'effondrent pour de bon.\nCréatures alignées : utilisent la Foi, répondent à Détection du Mal, voient les auras, mais ne font pas « plop ».',
});
const zombi16 = npc('zombi-16h', {
  nom: 'Zombi rétais (16 h)', source: 'Mort-vivant en chasse', type: 'mortvivant', qty: 8, car: car('3 1 2 1 1 1'), def: L(2),
  pp: 4, pfFix: 4, seuilsFix: seuils('4/9/13/18'), armes: [livre('Griffes', 2, 7, true)],
  pouvoirs: pows('Anaérobiose, Apparence horrifique 1, Jeûne, Immunité contre les maladies et les poisons, Membre exotique : griffes, Membre exotique : crocs'),
  talents: 'Corps à corps 2+, Combat 1+ (au choix 2+), Défense 2, Beuargh 3',
  notes: 'Tenue de plage souillée de sang. Arme improvisée (1d6) : 1 parasol, 2 hachoir, 3 pompe à vélo, 4 fourchette à huîtres, 5 tire-bouchon, 6 tournevis.',
});

// ---------------- Équipe de Jean ----------------
const renaud = npc('renaud', {
  nom: 'Renaud', source: 'Ange de Jean, grade 1 (scientifique)', type: 'ange', car: car('3 4 4 5 2 4'), def: L(2),
  pp: 21, pfFix: 8, seuilsFix: seuils('6/12/18/24'), armes: [livre('Décharge électrique', 7, 6, false)],
  pouvoirs: pows('Champ magnétique 2, Corps électrique, Décharge électrique 3, Innovation 4'),
  talents: 'Défense 2, Tir 2 (décharge électrique 4), Science 4 (règle de trois 4+), Hobby (antimilitarisme) 2+',
  notes: 'Sosie tyrannique de Raspoutine en blouse blanche. Méprise son escorte de soldats et la sème dans les ruelles. Trouve le point d\'explosion, ramasse des fragments et conclut que l\'arme vient des labos de Jean, puis part à l\'apéro.\nSait que la bombe a tué tout le monde, ignore pourquoi les morts se relèvent. Comprend vite qui sont les PJ ; poli avec des PJ polis, par curiosité et pour ne pas exposer Hubert. Les deux groupes peuvent se séparer sans combattre.\n21 PP (14 hors bidule). Bidule de poche : Détection du danger 3, Téléportation 1 et 7 PP.',
});
const olga = npc('olga', {
  nom: 'Olga', source: 'Ange de Jean, grade 1 (assistante)', type: 'ange', car: car('3 4 4 4 4 3'), def: L(2),
  pp: 16, pfFix: 7, seuilsFix: seuils('6/12/18/24'), armes: [livre('Mega-Holy-Water-Blaster', 6, 6, false)],
  pouvoirs: pows('Champ magnétique 2, Corps électrique, Innovation 4'),
  talents: 'Défense 2, Tir 2 (armes lourdes 4), Science 2 (influence du champ magnétique terrestre sur la photosynthèse du brocoli 4+), Hobby (ja, professeur ! Quelle belle équation !) 3+, Métier (agiter ses nattes avec l\'accent bavarois) 2',
  notes: 'Assistante bavaroise à nattes. Le blaster contient Eau bénite 2, un accumulateur à Absorption du mal 2 et 12 PP.\nTraîtrise : dès que les démons ont le dos tourné, elle signale leur présence aux hélicoptères.',
});
const hubert = npc('hubert', {
  nom: 'Hubert', source: 'Disciple humain de Renaud', car: car('2 2 2 2 2 2'), pfFix: 4, seuilsFix: seuils('2/4/6/8'), armes: [],
  notes: 'Lunettes et boutons ; « humain de base » selon le livre (caractéristiques et seuils estimés).',
});

// ---------------- Les conjurés ----------------
const belboth = npc('belboth', {
  nom: 'Belboth', source: 'Démon de Bifrons ramené au grade 1 (le « cavalier sans tête »)', type: 'demon', car: car('5+ 5 4 2+ 1+ 5'), def: L(7), prot: 4,
  pp: 25, pfFix: 8, seuilsFix: seuils('7/15/22/30'), armes: [livre('Faux maudite mineure', 7, 9, true)],
  pouvoirs: pows('Apparence horrifique 1+, Immunité contre les maladies et les poisons, Immunité contre le froid, Jeûne, Résurrection macabre 4, Supériorité martiale 3, Régénération 1'),
  talents: 'Acrobatie 6, Combat 3 (faux 7+), Défense 7, Discrétion 6, Bricoler sa moto 3+, Écraser ses ennemis, les voir mourir à ses pieds et ne pas savoir pourquoi 8+',
  notes: 'Ancien humain corrompu par Bifrons, coursier préféré du prince. Combinaison de moto cloutée « HELLRIDER » (agressive, permanente, protection 4), Harley noire, tête de déterré ; déguisé en Mort dans la seconde partie.\nAvertissement sans frais : gentillesse envers les enfants. Blâme : aspect cadavérique avancé (vraie apparence horrifique).\nFaux : aura de glace ; RU+9 au lieu de +7 avec la suprématie martiale (livre : « Suprématie martiale », nommée ici Supériorité martiale d\'après les règles).\n1er novembre : effondré d\'avoir tué des enfants, il veut mourir de la main d\'un ange. 31 octobre : fanatique, mais ignore que la bombe va tuer des milliers d\'enfants.',
});
const ultima = npc('ultima', {
  nom: 'Ultima Necat', source: 'Démone de Bifrons ramenée au grade 1 (meneuse)', type: 'demon', car: car('4 4 3 4 5 4'), def: L(7),
  pp: 25, pfFix: 8, seuilsFix: seuils('6/12/18/24'), armes: [livre('Fusil de sniper maudit mineur', 10, 7, false), livre('Ongles d\'acier', 7, 6, true)],
  pouvoirs: pows('Charme 3, Déphasage 2, Esquive acrobatique 2, Éventration 4, Membre exotique : ongles d\'acier, Membre exotique : crocs, Malédiction : vieillissement 3, Résurrection macabre 3, Volonté supra-normale 2+'),
  talents: 'Baratin 4, Corps à corps 5, Défense 7, Tir 6 (armes d\'épaule 8+), Savoir occulte 1 (sorcellerie 1+), Séduction 4, Faire du stop 3, Transformer le trajet en cauchemar 4+, Kama-sutra 4',
  notes: 'Belle ténébreuse au corps rapiécé de gros fils (cadeau de Bifrons), peau de marbre ; passe pour humaine habillée. Auto-stoppeuse fatale entre Lille et Marseille.\nAvertissement sans frais : corps froid et recousu. Blâme : vitaphobe.\n1er novembre : retranchée dans le clocher de La Couarde, elle tire pour tuer et préfère mourir que se rendre ; déteste les pacifistes (drapeau blanc = balle entre les yeux).',
});
const abigor = npc('abigor', {
  nom: 'Abigor', source: 'Démon de Bifrons ramené au grade 1 (cinéaste gore)', type: 'demon', car: car('5 2 3 3 3 4'), def: L(5),
  pp: 25, pfFix: 8, seuilsFix: seuils('7/14/21/28'), armes: [livre('Griffes', 6, 9, true)],
  pouvoirs: pows('Charme 2, Esprit chaotique, Immunité contre les maladies et les poisons, Graisse 2, Larves sous-cutanées 4, Membre exotique : griffes, Nécrose 3, Résurrection macabre 3'),
  talents: 'Aisance sociale 3, Baratin 4, Corps à corps 6, Défense 5, Hobby (faire courir des blondes) 2+, Humour 2, Métier (films gores) 4+',
  notes: 'Obèse rougeaud, lunettes noires (orbites vides peuplées de cloportes ; il voit normalement), maillot provocateur, caméra. Réalisateur de « Real Gore Movies » pour les circuits démoniaques, ringardisé ; a laissé ses goules en Californie.\nAvertissement sans frais : atavisme (orbites vides). Blâme : syndicalisme morbide.\nC\'est lui qui a trouvé la bombe (achetée à Yikkz) ; Loscar est son débiteur.',
});

// ---------------- Bidasses et bénévoles du bon Dieu ----------------
const soldats = npc('soldats', {
  nom: 'Soldats de Dieu de la Marine', source: 'Commandos de l\'amiral Mabuse', type: 'soldat', qty: 5, car: car('2+ 2 3 2+ 2 2'), def: L(3),
  pp: 6, pfFix: 5, seuilsFix: seuils('3/7/10/14'),
  armes: [arme('Famas', 'Fusil-mitrailleur', 4), arme('Grenade', 'Grenade', 3)],
  pouvoirs: pows('Obscurité 2'),
  talents: 'Défense 3, Tir 3 (armes d\'assaut 4), Savoir militaire 1 (Argh, sergent ils m\'ont eu ! 2+)',
  notes: 'Masque à gaz, tenue de combat bactériologique, Famas, grenades. Unités de cinq (un sergent et quatre hommes), parfois un lance-flammes. Contact radio tous les quarts d\'heure : en attaquer une patrouille attire vite renforts et hélicoptères Tigre.',
});
const dark = npc('dark', {
  nom: 'Dark', source: 'Ange de Laurent, grade 2 (flic)', type: 'ange', car: car('4 5 4 4 3 4'), def: L(5),
  pp: 27, pfFix: 8, seuilsFix: seuils('7/14/21/28'),
  armes: [livre('Décharge électrique', 8, 6, false), livre('Épée longue bénite mineure', 8, 8, true)],
  pouvoirs: pows('Décharge électrique 3, Détection du danger 3, Esquive acrobatique 2, Juste-lame 4, Régénération 2, Sens surdéveloppés'),
  talents: 'Baratin 3, Combat 3 (épées 6), Défense 5, Discrétion 4, Enquête 5, Tir 3 (décharge électrique 5), Mener une affaire jusqu\'au bout 5, Appeler son ex-femme 3+',
  notes: 'Loup solitaire épuisé, manteau noir, barbe de trois jours, carte de police ; anneau d\'obscurité 2. Son ex-femme (celle de son corps d\'accueil) l\'appelle sans cesse.\nArrivé chez Zeta à 2 h, il capture Loscar ; achève Yikkz vers 12 h 30 (reste d\'abord coincé une demi-heure au téléphone dans l\'entrée).',
});
const heisenberg = npc('heisenberg', {
  nom: 'Cardinal Heisenberg', source: 'Ange de Walther, grade 2', type: 'ange', car: car('2 3 3 6 4 6'), def: L(2),
  pp: 27, pfFix: 8, seuilsFix: seuils('5/10/15/20'), armes: [livre('Petit calibre', 1, 3, false)],
  pouvoirs: pows('Détection du mensonge 3, Exorcisme 5, Téléportation 3, Volonté supra-normale 5'),
  talents: 'Baratin 7, Défense 2, Tir 2 (armes de poing 3), Savoir occulte 2 (réseau angélique 4), Se tenir au courant des progrès de l\'enquête 3, Faire traquer vos PJ jusqu\'en Enfer s\'il le faut 4',
  notes: 'Robe de cardinal, berline avec chauffeur, réseau d\'influence. Encadre bénévolement des anges « difficiles » (zélotes et inadaptés) et lâche aujourd\'hui la bride : aucune différence pour lui entre les nostalgiques de Bifrons et les PJ.\nSupervise la chasse depuis 4 h 30 ; espère achever un démon lui-même, sans prendre trop de risques.',
});
const eva = npc('eva', {
  nom: 'Eva', source: 'Ange de Joseph, grade 1 (tortionnaire)', type: 'ange', car: car('3 4 4 4 3 4'), def: L(2),
  pp: 16, pfFix: 7, seuilsFix: seuils('6/12/18/24'), armes: [livre('Petit calibre', 2, 3, false)],
  pouvoirs: pows('Charme 2, Corps électrique, Détection du mensonge 1, Torture 3, Volonté supra-normale 2'),
  talents: 'Baratin 3, Défense 2, Tir 2 (armes de poing 4), Torture 5+, Hobby (sculpture sur visage) 3',
  notes: 'Tailleur sombre, cheveux blonds presque blancs, lunettes carrées. Méfiante : au moindre bruit, elle fuit par Corps électrique et rejoint le cardinal. Possible renfort au collège Saint-Charles.',
});

// ---------------- PNJ dont la fiche manque (p. 25) : valeurs estimées ----------------
const enrique = rapide('enrique', 'ange', 'Laurent', 15, {
  nom: 'Enrique', source: 'Ange de Laurent (garde chez Tantine)',
  notes: 'Censé garder le rez-de-chaussée du Psycho Show, il joue en ligne à « Words of Witchcraft III » sur le PC du magasin, PM posé à côté : proie facile.',
});
enrique.armes.push(arme('Pistolet-mitrailleur', 'Pistolet-mitrailleur', 3));
const yrene = rapide('yrene', 'ange', 'Didier', 10, {
  nom: 'Yrène Lalue', source: 'Ange de Didier, fraîchement incarnée (prof de français)',
  notes: 'Grande croix exubérante, tenue du siècle dernier ; passe pour folle au collège Saint-Charles (Athis-Mons), où elle enseigne aux 5e 8. Totalement irresponsable, jamais confrontée au Mal. Les affaires de Belboth sont dans son casier en salle des profs.',
});
const rufus = rapide('rufus', 'demon', 'Andromalius', 20, {
  nom: 'Rufus Bonamy', source: 'Démon d\'Andromalius se faisant passer pour le « sorcier de secours »',
  notes: 'Petit homme moustachu, poli, en charentaises, fumeur de pipe ; 28 rue Michel-Ange (16e), escalier C, 3e gauche. Plus gradé que les PJ (le livre l\'impose) : grade 2 retenu.\nInfiltré grâce à un ami de Haagenti pour démasquer les conjurés au dernier moment. Ignore les voyages dans le temps ; veut tout diriger. Dans la version originelle, il se trahit dans le van (il tend un briquet quand Ultima Necat demande du feu en démoniaque) et est exécuté sur une aire d\'autoroute à minuit.',
});
const tantine = rapide('tantine', 'demon', 'Shaytan', 15, {
  nom: 'Tantine', source: 'Démone de Shaytan, boutique Psycho Show (Corbeil-Essonnes)',
  notes: 'Vieux laideron à pustules, receleuse de colis « mal notés » de l\'administration. Ligotée dans la cave et torturée par Eva au début de la scène. Offre un déguisement à ses sauveurs ; ment selon l\'attitude des PJ (bombe volée par Malaki, démon de Valefor, ou confiée à Zeta) : aucune version n\'est la vraie.',
});
const pumpkin = npc('pumpkin', {
  nom: 'Pumpkin', source: 'Familier de Tantine (gamin à tête de citrouille)', type: 'familier', car: car('1 2 2 2 2 2'), def: L(1), armes: [],
  notes: `${P25} : fiche minimale, caractéristiques arbitraires.\nC\'est lui qui a donné à Yikkz la vraie localisation de la bombe (chez Zeta) en échange d\'un rôle dans un film d\'Abigor, dont il est fan. Tousse et grogne quand Tantine ment. Lucide si on lui explique les enjeux.`,
});
const yikkz = rapide('yikkz', 'demon', 'Ouikka', 15, {
  nom: 'Yikkz', source: 'Démon d\'Ouikka, pilote de ligne (Roissy)',
  notes: 'Vendeur de la bombe à Abigor (35 millions de dollars promis, payés en faux billets de cinéma). Empoisonné par Loscar : paralysie progressive dans sa baignoire, mort à 14 h 32. Soins : médecine incroyable. Sous pouvoir mental il avoue tout, mais ne sait que l\'adresse de la planque de Belboth et le dîner à la tour Eiffel ce soir.',
});
const loscar = npc('loscar', {
  nom: 'Loscar « la potion »', source: 'Démon de Malthus, empoisonneur et acteur d\'Abigor', type: 'demon', armes: [],
  notes: `${P25} : fiche minimale sans valeurs.\nDébiteur d\'Abigor. Empoisonne Yikkz, retourne chez Zeta et s\'y fait prendre par Dark à 2 h ; transféré à Notre-Dame à 3 h, il balance tout aux anges. Hors d\'atteinte des PJ (ils arrivent après sa capture).`,
});
const planglok = npc('planglok', {
  nom: 'Planglok', source: 'Démon de Baalberith (contact des PJ)', type: 'demon', armes: [],
  notes: 'Petit avorton roux, planque sous l\'aire du péage du pont de Ré (avec des amis de Gaziel). Vend aux PJ carte routière et appareil jetable (remboursement exigé), loue pelles, râteaux et son petit calibre 100 € la journée. Ne sait rien de plus et le dit. Pas de caractéristiques dans le livre.',
});
const anges = rapide('anges-epee', 'ange', 'Laurent', 15, {
  nom: 'Anges spadassins', source: 'Anges qui surveillent le Jules Verne', qty: 3,
  notes: 'Sans fiche dans le livre (ou sur la p. 25 manquante). Dans la version originelle, Belboth les renvoie au Paradis après quelques passes d\'armes sur les marches de la tour.',
});
const catechumenes = npc('catechumenes', {
  nom: 'Catéchumènes d\'Yrène', source: 'Mères de famille bigotes', qty: 6, car: car('1 2 2 2 2 2'), pfFix: 3, seuilsFix: seuils('2/4/6/8'),
  notes: `${P25} : humaines quelconques, valeurs arbitraires.\nSixtine Curaide, la plus inconsciente, garde seule l\'entrepôt de Belboth en lisant Valeurs actuelles : facile à faire parler (elle ne sait rien du Grand Jeu).`,
});
const policiers = npc('policiers', {
  nom: 'Policiers municipaux', source: 'Gardiens de la maison de Zeta', qty: 3, car: car('2 2 2 2 2 1'), pfFix: 4, seuilsFix: seuils('3/6/9/12'),
  armes: [arme('Matraque', 'Matraque', 2)], talents: 'Corps à corps 2, Défense 2',
  notes: 'Pas de fiche dans le livre : valeurs estimées. Défendent les lieux avec acharnement… sauf à l\'heure de l\'apéro.',
});

const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });

// ---------------- Scènes ----------------
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  scene('briefing', '1. Rendez-vous au péage', 'Aire de péage du pont de l\'île de Ré – 1er novembre, 10 h 30',
    `Réveil à l'aube par un appel anonyme et injurieux : quatre heures pour rejoindre le péage, retard interdit. Pont fermé, péage bloqué par la police ; l'inconnu les guide par téléphone jusqu'aux toilettes pour handicapés, d'où Planglok surgit d'une trappe.
Briefing dans sa planque : les agents de Vapula à Météo France ont détecté à 6 h 35 une forte explosion centrée sur La Couarde, accompagnée d'une vibration inconnue ; la marine encercle déjà l'île. Mission : y aller sans se faire repérer, comprendre ce qui se passe et ce que veulent les anges, et revenir. Pas besoin de résoudre le problème ni de tuer les coupables : des preuves (photos, voire vidéo avec le matériel d'Abigor) suffisent.
Planglok fournit carte et appareil jetable contre remboursement, loue un armement minable et propose deux accès.
Infos selon le supérieur des PJ : un serviteur de la « Bifrons connection », de Baal ou de Kronos apprend que le prince des morts n'y est pour rien ; un serviteur de Bifrons reçoit en fin d'après-midi un appel d'Hornet qui demande le matériel occulte et le nom des assistants d'un éventuel sorcier. Hornet a compris qu'on a tenté d'invoquer le vrai Bifrons mais n'en dira rien.`,
    [inScene(planglok)], false,
    [choice('acces', 'Comment les PJ gagnent-ils l\'île ?', [
      ['À la nage (un petit kilomètre)', 'Arrivée trempée sur la côte ; discrets mais en k-way face à des troupes en tenue NBC.'],
      ['Par le tunnel de maintenance du pont', 'Accès caché depuis l\'abri de Planglok : arrivée sèche et discrète au bout du pont.'],
    ])]),
  scene('ile', '2. L\'île des morts paisibles', 'Île de Ré, du pont au Bois-Plage – 1er novembre, fin de matinée',
    `Seize mille habitants triplés par les vacances de la Toussaint, tous morts dans un flash blanc et relevés en zombis tranquilles. Vitres fissurées, batteries vides, rien d'électrique ne marche (sauf ce qu'apportent les PJ) : vélo obligatoire. Mouettes et animaux zombis plus vite sauvages.
Évolution des morts : 11 h hagards et mornes mais capables de conversation ; 13 h agressions au hasard ; 15 h Fo 3 et griffes ; 16 h vrais zombis ; 21 h ils s'effondrent définitivement. Un jet de médecine facile (ou prendre le pouls) révèle qu'ils sont morts. Un démon de Bifrons le sent vite et gagne des bonus pour se faire écouter.
Actions possibles : se baigner, bavarder (personne ne se souvient de l'explosion), jouer les touristes (pulls marins), observer les « youyous » (zodiacs, hélicos ; on entend parler d'un assaut en fin d'après-midi et d'une unité qui débarque des scientifiques à La Couarde). Les gendarmes zombis contrôlent l'alcoolémie autour d'un radar dès 11 h. Attaquer une patrouille de soldats de Dieu déclenche un déluge de feu : laissez fuir les PJ.
Rencontres facultatives :
• Bernard Grosjean, propriétaire de Porsche aux vitres brisées, traque les « racailles » au club de golf avec des sympathisants.
• La dernière patrouille des volontaires rétais : quatre survivalistes chrétiens zombis (treillis, fusils de chasse) guidés par Max, ange de Laurent, qui avait failli intercepter les conjurés ; ils ont un croquis des trois « rougeauds ». Seuls morts à réagir aux pouvoirs visibles : ils encerclent et menacent.
• Alice, fillette zombie en fée : guide et témoin (trois adultes devant le cinéma de La Couarde).
• Alban, fantôme mythomane d'Ultima Necat, qui ne les lâche plus.`,
    [inScene(alice), inScene(alban), inScene(zombiMidi, { nom: 'Volontaires rétais (zombis)', qty: 4, armes: [arme('Fusil de chasse (en massue)', 'Masse d\'arme ou batte', 2), arme('Poignard commando', 'Poignard ou saï', 2)] }), inScene(zombiMidi)], false),
  scene('jean', '3. Renaud et la seconde équipe de Jean', 'Rue soufflée menant à la mer, La Couarde',
    `Débarqués d'un sous-marin, Renaud, Olga et Hubert (tenues antiradiations, instruments qui bipent) cherchent le point d'explosion et sèment leur escorte de soldats. Ils trouvent la rue aux maisons soufflées, prélèvent des fragments, et Renaud annonce que l'arme vient des labos de son archange avant d'aller boire un verre.
Ils tiennent les démons pour responsables du massacre, mais Renaud discute volontiers avec des PJ polis. Après une séparation à l'amiable, Olga signale les démons aux hélicoptères.`,
    [inScene(renaud), inScene(olga), inScene(hubert), inScene(soldats)], true,
    [choice('jean', 'Comment se passe la rencontre avec l\'équipe de Jean ?', [
      ['Discussion polie', 'Renaud lâche l\'origine angélique de la bombe ; dès que les PJ s\'éloignent, Olga appelle les hélicoptères.'],
      ['Affrontement', 'Les soldats de Dieu de l\'escorte et les hélicoptères arrivent vite ; à éviter.'],
    ])]),
  scene('indices', '4. Coquillages et crucifiés', 'Bois-Plage, Saint-Martin et La Couarde',
    `Lieux d'enquête :
• Mégane blanche encastrée dans une façade du Bois-Plage : ses passagers, des anges chargés d'intercepter les conjurés, ont fait « plop ». Coffre : pistolets-mitrailleurs et fusils à pompe ; boîte à gants : portraits-robots d'Ultima Necat et d'Abigor.
• Hyper U de Saint-Martin (ouvert jusqu'à 13 h 30, « prix à réveiller les morts ») : foire d'empoigne tournant au pugilat ; on y croise les parents d'Alice.
• Monument aux morts de La Couarde : un petit homme nu enchaîné en croix, lacéré de griffes (traces de Nécrose), mort vers 7-8 h : le réceptacle, réanimé puis défoulé par Abigor. À ses pieds, le sorcier tué d'un coup de griffe au cœur, dans un pentacle rouge, en combinaison brillante à croix dorée ; une autre combinaison sanglante dans le square voisin.
• Van Renault Trafic d'Abigor, criblé de balles près du cinéma (jet de sécurité très facile) : fusils-mitrailleurs, treillis, chargeurs, grenades, caisse vide « fragile » avec un manuel en latin de la bombe expérimentale Requiem, trois combinaisons brillantes, et un guide de Paris annoté : adresses à Corbeil (Essonne) et Morteau-la-Centrale (Picardie), et deux lieux encadrés, le salon de thé Le Chrysanthème (5e) et le Jules Verne (tour Eiffel).`,
    [inScene(zombiMidi, { nom: 'Chasseurs de soldes (zombis de l\'hyper U)', qty: 6 })], false),
  scene('ultima', '5. Le silence de l\'amer', 'Clocher de l\'église de La Couarde',
    `Ultima Necat a juré de ne pas survivre à l'échec : retranchée au clocher avec son fusil de sniper, elle guette l'approche des anges. Quand les PJ sont à deux ou trois kilomètres, elle snipe une patrouille ; un hélicoptère réplique aux roquettes et fauche le clocher. Elle part pour son jugement.
Dans les décombres : son sac à main en cuir noir (affaires de dame, deux gros calibres, photo d'elle avec l'avatar de Bifrons, portable détruit, le grimoire « De verita mortis » pris au sorcier, un portefeuille de 5 000 € et un papier « Chrysanthème 17 h, Jules Verne 21 h » avec un numéro de téléphone).
Si les PJ la localisent avant les anges, c'est sur eux qu'elle tire : elle tue, et se tue plutôt que d'être prise. Le sac ne doit pas disparaître.`,
    [inScene(ultima), inScene(soldats)], true,
    [choice('ultima', 'Les PJ atteignent-ils Ultima Necat avant les anges ?', [
      ['Non : l\'hélicoptère détruit le clocher', 'Ils fouillent les décombres et trouvent le sac à main et ses indices.'],
      ['Oui : ils l\'affrontent', 'Combat contre une démone qui tire pour tuer et refuse d\'être prise ; récupérer le sac après.'],
    ])]),
  scene('belboth1', '6. Le cavalier prostré', 'Ruelle de La Couarde, au pied d\'une Harley',
    `Belboth, en combinaison cloutée « HELLRIDER », très décomposé, est assis près de sa moto devant des enfants zombis. Il ne supporte pas d'avoir tué des enfants et attend avec ferveur qu'un ange romantique l'achève (il aurait préféré l'aube blanche et l'eau bénite ; détrompé, il se tire une balle de canon scié).
Peu bavard et confus : il évoque la bombe, ses complices, sa responsabilité, puis, interrogé avec finesse, la disparition de son prince et l'usurpateur. Si les PJ hésitent à le tuer ou parlent trop, il les menace puis attaque.`,
    [inScene(belboth, { notes: belboth.notes + '\nIci : désespéré et suicidaire.' })], true,
    [choice('belboth1', 'Que font les PJ de Belboth ?', [
      ['Ils l\'exécutent', 'Il se laisse presque faire ; un conjuré de moins (dans cette chronologie).'],
      ['Ils le laissent', 'Il finit par provoquer les PJ ou les anges pour mourir.'],
    ])]),
  scene('abigor1', '7. Le tournage d\'Abigor', 'Rues de La Couarde',
    `Abigor, qui a compris que le plan était une ânerie, veut plaire au nouveau prince : il tourne un film gore avec une vingtaine de zombis dociles (vengeance et blondes poursuivies). Il ne voit même pas les hélicos.
Il prend les PJ de haut comme pour une interview de Télérama ; une couverture de démon débutant voulant faire du cinéma marche, mais toute question pertinente le rend méfiant. Au moindre agacement, il lance ses acteurs dans la mêlée.
Une escouade de soldats de Dieu l'observe depuis une maison : il est leur cible principale (sauf si les PJ se sont trahis). Le combat bref et chaotique voit Abigor tomber entre deux feux ; les zombis se remettent à errer, les soldats se replient.`,
    [inScene(abigor), inScene(zombiMidi, { nom: 'Acteurs zombis d\'Abigor', qty: 8 }), inScene(soldats)], true),
  scene('fuite', '8. Fuite apocalyptique', 'Île de Ré – 16 h à 17 h 30',
    `Une fois les conjurés croisés et assez d'indices réunis, lâchez les fauves. Vers 16 h la flotte se positionne ; 17 h 02, les Tigre pilotés par des soldats de Dieu tirent à la roquette sur les attroupements (au son de Bach), puis des sections lourdes nettoient La Couarde maison par maison jusqu'à 21 h.
Les PJ fuient au milieu des zombis en chasse, des snipers et des hélicos : forêt de griffes, pluie de feu, vélos qui déraillent. Les démons de Bifrons ne sont pas encore les grands méchants.`,
    [inScene(zombi16), inScene(soldats)], true),
  scene('entracte', '9. Entracte : débriefing avec Kronos', 'Tour des Quatre Sergents, La Rochelle – 1er novembre au soir',
    `Planglok conduit les PJ en camionnette jusqu'à la tour, fermée au public, en jouant les mystérieux. Au dernier étage, le prince Kronos en personne mène le débriefing avec bonhomie et leur tire les vers du nez, puis les félicite et leur annonce un dernier travail : retourner la veille, éliminer les trois démons, identifier leurs complices et récupérer la bombe.
Ce que l'administration peut dire (si les conjurés sont identifiés) : ils étaient des proches de Bifrons, de sa suite lors de ses descentes, tous blâmés peu après la guerre civile ; Belboth parcourait l'Europe à moto, Abigor officiait en Californie encore le mois dernier ; Ultima Necat est sans doute la meneuse.
Barème de la première partie :
• Éléments suffisants pour un vrai exposé (noms, motivations, moyens des responsables) : +2 PA
• Du zombi et du youyou cassé, coupables peut-être châtiés, mais peu de preuves : +1 PA
• Rien que des coups de soleil et des photos de fesses : −2 PA`,
    [], false,
    [choice('bilan1', 'Bilan de la première partie', [
      ['Noms, motivations et moyens connus', '+2 PA'],
      ['De la casse mais peu de preuves', '+1 PA'],
      ['Presque rien', '−2 PA'],
    ])]),
  scene('veille', '10. Retour à la veille', 'Lieu choisi par les PJ – 31 octobre (Halloween, un vendredi 13)',
    `Beleth et Nybbas ont demandé à Kronos un coup de pouce ; il accepte un service minimal : un aller simple pour la veille. Il laisse les PJ croire qu'ils choisissent l'heure mais vise un jour pile avant l'explosion (quelques heures de rab si c'est bien justifié) ; le lieu d'arrivée est libre. Quiconque conteste finit en touriste au Crétacé. Il interdit toute rencontre avec leurs alter ego de la veille (réunis depuis une demi-heure par le Kronos de la veille).
Déshabillage, danse sur le Rocky Horror Picture Show, tourbillon psychédélique : ils arrivent nus et grelottants, avec une enveloppe contenant deux perles de pouvoir et un mot signé du prince.
Chronologie « originelle » (encadré) :
30 oct. : 18 h Loscar et Yikkz secouent Tantine, qui les renvoie à Zeta ; 23 h massacre chez Zeta et vol de la bombe ; 23 h 30 Loscar raccompagne Yikkz.
31 oct. : 0 h 15 police chez Zeta ; 1 h Loscar empoisonne Yikkz, l'enquête change de mains ; 2 h Dark chez Zeta, Loscar pris ; 3 h Loscar à Notre-Dame ; 4 h 30 Heisenberg seconde Dark ; 5 h 20 anges chez Tantine ; 9 h 20 planque de Belboth découverte ; 12 h 30 Dark achève Yikkz ; 17 h Rufus attend en vain au salon de thé ; 21 h 30 Jules Verne, coup de filet raté des anges ; 22 h 10 départ vers Ré ; 0 h Rufus exécuté sur une aire d'autoroute ; 2 h 40 passage du pont ; 6 h 35 explosion.
Contexte : Ultima Necat a recruté Gwen Brancusi, sorcier évadé du pénitencier de Saint-Martin ; Belboth a ajouté un second sorcier, Rufus ; Abigor a acheté la bombe à Yikkz, qui l'avait laissée chez Tantine, laquelle l'a perdue chez Zeta. La bombe dort sous une couverture à l'arrière du van, garé à l'hôtel Hilton du Champ-de-Mars où logent Abigor et Ultima Necat (Belboth dort dans un cimetière picard de 14-18).
Les PJ veulent sans doute d'abord passer chez eux s'habiller.`,
    [], false,
    [choice('arrivee', 'Où les PJ arrivent-ils ?', [
      ['Chez eux, pour s\'habiller', 'Temps perdu mais équipement récupéré ; éviter leurs alter ego.'],
      ['Directement à Corbeil ou en Picardie', 'Arrivée nue sur place : discrétion compromise.'],
    ])]),
  scene('tantine', '11. Chez Tantine', 'Psycho Show, 6 rue Saint-Spire, Corbeil-Essonnes – matinée',
    `Boutique de déguisements d'épouvante, rideau métallique tagué (l'ouvrir prévient les occupants ; la porte de la cour permet la surprise). Enrique, ange de Laurent, devait garder le rez-de-chaussée mais joue en ligne sur le PC. Au sous-sol, Eva torture Tantine, ligotée sur un fauteuil près de son familier Pumpkin (masque de citrouille qui fait partie de lui). Eva a déjà transmis au cardinal l'adresse de Yikkz ; au moindre bruit, elle fuit par Corps électrique.
Tantine libérée offre un costume et parle : receleuse de colis égarés de l'administration, elle avait reçu de Yikkz un paquet « It's dangerous » venu de Los Angeles, qu'il lui avait montré ; Yikkz l'a ensuite vendu à Abigor (35 millions promis). Le stock a été saisi par Zeta après une affaire d'œuvres d'art détournées. Elle donne l'adresse de Yikkz et une version mensongère (Malaki, démon de Valefor, ou Zeta pour se faire bien voir). Pumpkin, qui a lui-même indiqué la vraie cachette à Yikkz contre un rôle chez Abigor, grogne quand elle ment.`,
    [inScene(enrique), inScene(eva), inScene(tantine), inScene(pumpkin)], true,
    [choice('tantine', 'Quelle version Tantine sert-elle ?', [
      ['La version « gentils couillons » : volée par Malaki (Valefor)', 'Fausse piste : Malaki, démon de Valefor à Paris, lui doit juste de l\'argent.'],
      ['La version « fouineurs de l\'administration » : donnée à Zeta', 'Plus proche du vrai : la bombe était chez Zeta, mais saisie et non donnée.'],
      ['Pumpkin parle', 'Il confirme que la bombe était chez Zeta et que Yikkz l\'a récupérée avec les conjurés.'],
    ])]),
  scene('zeta', '12. Chez Zeta', 'Demeure de Zeta, environs de Morteau-la-Centrale (Picardie)',
    `La nuit du 30, Zeta, démone de Baalberith, recevait six notables pour une partouze ; les conjurés et leurs sbires cagoulés ont tout massacré au fusil d'assaut, récupéré la bombe (Yikkz a expliqué la mise à feu, croyant à un gros pétard au gaz, et insisté sur les combinaisons), puis tué Zeta.
La police est arrivée vers 2 h ; l'affaire est passée aux anges flics, puis au cardinal. La maison a été vidée de tout ce qui gênait (armes anciennes, œuvres sulfureuses, colis). Seul indice : la quantité invraisemblable de douilles. Trois policiers municipaux gardent les lieux.`,
    [inScene(policiers)], false),
  scene('yikkz', '13. Tant qu\'on a la santé', 'Appartement de Yikkz près de Roissy – fin de matinée ou début d\'après-midi',
    `Appartement spartiate de serviteur d'Ouikka : bustes de dictateurs, kalachnikovs, grenades, cassettes de terroristes, plan de Roissy, mallette de faux billets ouverte. Pas de bombe.
Loscar a empoisonné Yikkz en lui laissant la mallette (faux billets de cinéma) ; paralysé dans son bain au champagne, il agonise jusqu'à 14 h 32. Le sauver : médecine incroyable, et il reste paralysé ; il demande qu'on l'achève. Sous pouvoir mental il avoue tout, espérant être vengé, mais ne sait que la planque de Belboth et le dîner à la tour Eiffel ce soir.
Dark peut arriver à tout moment, coincé une demi-heure au téléphone avec l'ex-femme de son corps ; la Mégane du Bois-Plage est garée en bas (vide).`,
    [inScene(yikkz), inScene(dark)], true),
  scene('planque', '14. Les cahiers au feu, la maîtresse au milieu', 'Entrepôt SNCF de Juvisy, puis collège Saint-Charles d\'Athis-Mons',
    `Belboth squattait deux vieilles rames de RER : vinyles de métal, fémurs, outils, pièces de moto, armes. Sur dénonciation de Loscar, Yrène Lalue (ange de Didier, prof de français) a fait déménager les pièces à conviction par ses catéchumènes vers le collège Saint-Charles ; Sixtine Curaide garde seule l'entrepôt. Belboth ne reviendra pas aujourd'hui.
Le collège n'a rien d'une base angélique : il suffit de se faire passer pour des parents. Tous les élèves connaissent Yrène (5e 8). Si les PJ ont déjà semé la pagaille, Heisenberg envoie un renfort (Eva ?) quelques minutes après eux. Dans son casier, en salle des profs : rien d'intéressant, sauf la photo et l'adresse du sorcier Rufus.`,
    [inScene(catechumenes, { nom: 'Sixtine Curaide', qty: 1 }), inScene(yrene), inScene(catechumenes, { qty: 5 })], true),
  scene('rufus', '15. Le vrai faux sorcier', 'Paris : 28 rue Michel-Ange (16e) ou salon de thé Le Chrysanthème (5e) à 17 h',
    `Le numéro du portefeuille d'Ultima Necat (minitel) mène à Rufus Bonamy. Sinon, les PJ le repèrent au salon de thé, attendant les amis de Belboth : il les prend pour eux. À 17 h, Belboth laisse sur son répondeur un nouveau rendez-vous à 21 h au Jules Verne.
Rufus avoue fièrement être sorcier, mais un jet de savoir occulte montre qu'il connaît très bien l'administration et rien aux pentacles : c'est un démon d'Andromalius infiltré, ravi de rencontrer des serviteurs réglos (il félicite ceux qui le cognent). Il veut faire tomber les conjurés à la dernière seconde et ne croit pas aux missions dans le temps. Plus gradé que les PJ, il prétend diriger : il faut le convaincre (insister sur la bombe et la férocité des conjurés).`,
    [inScene(rufus)], false,
    [choice('rufus', 'Comment les PJ traitent-ils Rufus ?', [
      ['Ils le convainquent de coopérer', 'Il les accompagne au Jules Verne sous son rôle de sorcier ; allié gradé mais encombrant.'],
      ['Ils le laissent suivre son plan', 'Il se trahira dans le van et sera exécuté sur une aire d\'autoroute vers minuit.'],
      ['Ils le neutralisent ou le remplacent', 'Les conjurés attendront un sorcier qui ne vient pas, ou un imposteur.'],
    ])]),
  scene('jules-verne', '16. Trois flingués et l\'addition', 'Restaurant Jules Verne, tour Eiffel (125 m) – 21 h 30',
    `Version originelle : Abigor et Ultima Necat arrivent en retard et dînent en interrogeant Rufus ; Belboth, déguisé en mort-vivant, guette dans les poutrelles et surprend trois anges qui surveillent le restaurant. Combat sur les marches, éclair perdu, Belboth renvoie les trois au Paradis. Heisenberg, qui dînait incognito, se manifeste ; dans la panique, les deux autres partent avec Rufus et jettent le cardinal par une baie vitrée. Les trois filent vers Ré sous les tirs de Dark. Vent violent, plate-forme ouverte jusqu'à 23 h 30.
Options des PJ :
• L'affrontement final : acrobaties dans la structure, chutes, lancer de démon d'Andromalius.
• Laisser filer les conjurés et leur tendre un piège plus loin (route de Ré, aire d'autoroute, pont). Le van et la bombe sont aussi au parking du Hilton du Champ-de-Mars.
• Ruse 1 : guider les anges sur les conjurés et compter les points avant d'achever les survivants.
• Ruse 2 : révéler à Belboth que la bombe va tuer des milliers d'enfants ; ses complices le lui cachaient. Abigor le traite de fiotte, la dispute peut finir dans le sang. Méthode particulièrement récompensée.
Récompense : Kronos offre un week-end à Center Parcs et des bons d'achat… dont on ne revient peut-être jamais si l'on raconte l'histoire de l'usurpateur.
Barème final :
• Bombe rendue à l'administration et trois démons morts : +3 PA
• Un démon en fuite : +2 PA · Bombe récupérée par les anges : +0 PA · Bombe et démons disparus : −3 PA
• Modificateurs : PJ trop bavards −2 PA ; PJ discrets (dans tous les sens du terme) +1 PA`,
    [inScene(belboth, { notes: belboth.notes + '\nIci : fanatique, déguisé en Mort.' }), inScene(ultima), inScene(abigor), inScene(rufus), inScene(anges), inScene(dark), inScene(heisenberg)], true,
    [choice('final', 'Comment les PJ règlent-ils le sort des conjurés ?', [
      ['Affrontement au Jules Verne', 'Combat acrobatique avec anges et conjurés ; les survivants filent vers Ré.'],
      ['Piège plus loin (route, pont, van du Hilton)', 'Plus discret ; la bombe peut être récupérée avant le départ.'],
      ['Ils retournent Belboth contre ses complices', 'Les conjurés s\'entretuent ; PA mérités d\'autant plus.'],
      ['Ils guident les anges sur les conjurés', 'Les anges font le gros du travail ; risque qu\'ils gardent la bombe (+0 PA).'],
    ]),
    choice('bareme', 'Barème final', [
      ['Bombe à l\'administration, trois démons morts', '+3 PA'],
      ['Un démon s\'est enfui', '+2 PA'],
      ['Les anges ont la bombe', '+0 PA'],
      ['Bombe et démons disparus', '−3 PA'],
    ])]),
];

const scenario = {
  id: 'ag1-demain-ne-suffit-pas',
  nom: 'Angelots en gelée – Demain ne suffit pas toujours',
  resume: `Scénario INS (suite de Fire & Ice). Trois capitaines de Bifrons, persuadés que leur prince est le prisonnier d'un usurpateur (Hornet), font exploser à l'aube du 1er novembre une bombe angélique volée sur l'île de Ré pour l'invoquer. Bifrons ne vient pas, mais l'île entière se relève en zombis. Les PJ enquêtent sur l'île au milieu des forces du Bien, puis Kronos les renvoie la veille pour arrêter les conjurés et récupérer la bombe, jusqu'au dîner au Jules Verne.`,
  notes: `Source : ${REF}. La page imprimée 25 manque au scan (fin des fiches de PNJ).
Structure : première partie « L'Enfer marche à mes côtés » (1er novembre, île de Ré, scènes 1-8), entracte avec Kronos (9), deuxième partie « Ça ira mieux demain » (31 octobre, Essonne, Picardie, Roissy, Paris, scènes 10-16), situations datées que la présence des PJ dérègle.
La bombe Requiem : prototype de Jean (fin des années 70) censé ne détruire que l'électronique par la vibration Saint-Rémi ; en fait elle tue tous les vertébrés dans 15 km. Rangée dans une base du Nevada.
L'opération de la marine : l'amiral Mabuse (ange de Laurent) encercle l'île et fait attaquer La Couarde à 17 h ; combats jusqu'à 21 h.

Barème première partie : éléments complets +2 PA ; casse sans preuves +1 PA ; presque rien −2 PA.
Barème final : bombe à l'administration et trois démons morts +3 PA ; un démon en fuite +2 PA ; anges ont la bombe +0 PA ; tout disparu −3 PA ; PJ trop bavards −2 PA ; PJ discrets +1 PA.

Fiches : caractéristiques en niveaux INS/MV (Ch des humains reportée en Foi) ; attaques « (seuil, RU+X, M+Y) » converties en attaque X×2, puissance Y.
Valeurs estimées (la p. 25 manque) : Enrique, Yrène Lalue, Rufus, Tantine, Yikkz et les anges spadassins viennent des profils « PNJ rapide » de l'écran ; Pumpkin, Loscar, catéchumènes, policiers municipaux et Hubert ont des valeurs arbitraires ou pas de valeurs. Par transparence sur la p. 26, la p. 25 semble contenir au moins Enrique et Pumpkin (« Jack O'Lantern, familier »).`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [alice, alban, zombiMidi, zombi16, renaud, olga, hubert, belboth, ultima, abigor, soldats, dark, heisenberg, eva,
  enrique, yrene, rufus, tantine, pumpkin, yikkz, loscar, planglok, anges, catechumenes, policiers].map(asType);

const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));

writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types,', scenes.reduce((a, s) => a + s.choix.length, 0), 'choix');
