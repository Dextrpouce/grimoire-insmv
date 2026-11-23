// Génère le fichier d'import « insmv-scenario » pour « Le photocopillage tue le livre » (Fire and Ice, p. 30-42)
// usage : node gen-photocopillage.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Fire and Ice, « Le photocopillage tue le livre », p. 30-42';
const L = (s) => R.parseLvl(String(s)); // « 2+ » → 5
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
let n = 0; const id = (p) => `fi1-${p}`;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [{ n: 'Coup de poing', att: 2, prec: 0, puis: -3, melee: true }], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});

// ---------------- PNJ ----------------
const hakim = npc('hakim', {
  nom: 'Hakim Izmet', source: 'Démon de Morax, grade 1', type: 'demon', car: car('2 2 3 4 5 3'), def: L(2),
  pp: 15, pfFix: 6, seuilsFix: seuils('4/8/12/16'),
  pouvoirs: pows('Œuvre d\'art, Volonté supra-normale 3, Charme 2, Télépathie 1, Non-détection 3'),
  talents: 'Métier (PAO) 4, Hobby (gotha parisien branché) 4, Séduction 5+, Informatique 3, Conduite 2, Défense 2, trouver de la coke à 3 h du matin 5, vocabulaire non ratifié par l\'Académie 6',
  notes: 'Trentenaire d\'origine turque, beau gosse, yeux gris-bleu, style créatif-noceur (sac de DJ, lunettes Gucci, piercing à l\'arcade). Jargon pseudo-philosophique insupportable.\nNoceur égocentrique, aucune initiative ni organisation : suivra le plan des PJ tant qu\'il ne met pas sa vie ou son image en danger. Difficile à joindre pendant tout le scénario.\nNon-détection 3 : utile si un ange vient au procès. Avertissement sans frais : dandy.',
});
const yolande = npc('yolande', {
  nom: 'Yolande', source: 'Créature de rêve (stats volontairement non fournies)', type: 'humain',
  notes: 'Splendide brune aux cheveux très courts, peau caramel, âge indéfinissable, faux accent québécois ; se dit reporter canadienne. Tuniques et pulls amples pour cacher sa grossesse.\nNe doit pas être affrontée dans ce scénario : si les PJ s\'y essaient, la tentative échoue (dés truqués).\nSecret MJ : elle a déjà tué un démon de Nybbas il y a deux mois et tue Hakim avant la fin du procès.',
});
const humanCombat = { def: 2, armes: [] };
const lebourg = npc('lebourg', {
  nom: 'Maître Lebourg', source: 'Avocat des plaignants', car: car('1 1 2 3 2 2'), pfFix: 4, seuilsFix: seuils('2/4/6/8'), ...humanCombat,
  talents: 'Métier (avocat) 4, Discussion 3+',
  notes: 'Jeune, réac, raide et méprisant, raie gominée, adore les citations latines. Fils d\'un député du Loir-et-Cher ; a falsifié des documents juridiques pour son père (levier de chantage si les PJ enquêtent). Marié, une fillette de huit mois, un bouvier bernois.',
});
const dormois = npc('dormois', {
  nom: 'Maître Dormois', source: 'Avocat de la défense', car: car('1 1 2 3 2 2'), pfFix: 4, seuilsFix: seuils('2/4/6/8'), ...humanCombat,
  talents: 'Métier (avocat) 4, Discussion 3+',
  notes: 'Quinquagénaire « ténor du barreau », cheveux longs, cuir clouté, Harley. Soixante-huitard resté jeune dans sa tête, rit souvent et mal à propos, milite à Greenpeace.',
});
const juge = npc('juge', {
  nom: 'Julie Destivelle', source: 'Juge', car: car('1 1 2 3 2 2'), pfFix: 4, seuilsFix: seuils('2/4/6/8'), ...humanCombat,
  talents: 'Métier (juge) 4, Discussion 3+',
  notes: 'Pieds sur terre, voix posée, méthodique et plutôt impartiale ; physique ingrat qu\'elle compense par une réputation de sévérité. Sait faire taire une salle. Professionnellement irréprochable : difficile à faire chanter.',
});
const journalistes = npc('journalistes', {
  nom: 'Journaleux', source: 'Racaille médiatique', car: car('1 1 3 2 2 2'), pfFix: 3, seuilsFix: seuils('2/4/6/8'), ...humanCombat, qty: 4,
  talents: 'Piger 3, Prendre des photos 3, Parler devant une caméra 3, Baratin 2, Connaître tout le monde 2',
  notes: 'Du pigiste boutonneux à la star du JT avec son équipe technique. Leur nombre dépend du battage médiatique.',
});
const defenseurs = npc('defenseurs', {
  nom: 'Défenseurs des Arts et Lettres', source: 'Écrivains et intellectuels médiatiques', car: car('1 2 3 1 2 2'), pfFix: 2, seuilsFix: seuils('2/4/6/8'), ...humanCombat, qty: 2,
  talents: 'Discussions oiseuses 4, Ramper devant les Maîtres 3, Snober la piétaille 3, Prendre des poses 3, Hobby (littérature) 2',
  notes: 'Écrivains vedettes venus défendre la liberté d\'expression devant les caméras.',
});
const censeurs = npc('censeurs', {
  nom: 'Censeurs moralisateurs', source: 'Défenseurs de l\'ordre moral', car: car('1 2 2 2 1 2'), pfFix: 3, seuilsFix: seuils('2/4/6/8'), ...humanCombat, qty: 2,
  talents: 'Discussion 4, Citer les auteurs réactionnaires 3, Militer dans des organisations morales 3, Rester droit quoi qu\'il arrive 2',
  notes: 'Personnalités conservatrices venues défendre le droit des animaux… et celui des écrivains à se taire.',
});
const marieLise = npc('marie-lise', {
  nom: 'Marie-Lise Langrelier', source: 'Ange de Jordi, grade 1 (militante SPA)', type: 'ange', car: car('3 4 3 5 2 3'), def: L(5),
  pp: 16, pfFix: 8, seuilsFix: seuils('6/12/18/24'),
  armes: [{ n: 'Poing américain béni (non-létal)', att: L(4), prec: 2, puis: 0, melee: true }],
  pouvoirs: pows('Appel des animaux 2, Contrôle des animaux 2, Caméléon 2, Sommeil 2, Augmentation d\'Agilité 2, Lire les pensées 1'),
  talents: 'Défense 5, Science 1 (biologie animale 3), Hobby (Vespa) 3, Survie 3+, Corps à corps 4',
  notes: 'Mama métisse énergique d\'une quarantaine d\'années, survêtement mauve à slogan, Vespa bleu ciel des années 60. Envoyée par Notre-Dame, s\'ennuie ferme.\nPrésente dès 10 PR. Si elle a un doute : file les suspects (PJ ou Izmet), se renseigne ; si ses soupçons se confirment et qu\'on ne l\'arrête pas, elle prévient sa hiérarchie (renforts). Évite l\'affrontement frontal en ville.',
});
const lola = npc('lola', {
  nom: 'Lola Pichegrue', source: 'Ange de Walther, grade 2', type: 'ange', car: car('3 2 5 5 2 4'), def: L(4),
  pp: 23, pfFix: 8, seuilsFix: seuils('6/12/18/24'),
  armes: [{ n: 'Pistolet', att: L(4), prec: -2, puis: 3, melee: false }],
  pouvoirs: pows('Exorcisme 5, Déplacement temporel 4, Détection du Mal 3, Lire les pensées 3, Paralysie 2, Jet d\'eau bénite 2, Absorption de Volonté 2, Volonté supra-normale 2'),
  talents: 'Savoir militaire 2 (tactique 4), Tir 2 (armes de poing 4), Conduite 4, Défense 4',
  notes: 'Petite jeune femme en battledress de mode, casquette « peace and love », cheveux de poussin rose, voix rocailleuse, gros appareil photo et fausses cartes de presse.\nEnvoyée par la You-You Force (sans consulter Marie-Lise) dès 20 PR pour repérer et exorciser les suppôts du Mal. Fanatique : capture et exorcise dans un coin tranquille ce qu\'elle soupçonne.',
});
const soldats = npc('soldats', {
  nom: 'Soldats de Dieu (Gaspard, Melchior, Balthazar et Ta Gueule)', source: 'Escouade de Lola Pichegrue', type: 'soldat', qty: 4,
  car: car('3 2+ 2 2+ 1+ 3'), def: L('2+'), pp: 8, pfFix: 5, seuilsFix: seuils('4/8/12/16'),
  armes: [{ n: 'Pistolet-mitrailleur', att: L(3), prec: -2, puis: 4, melee: false }, { n: 'Chapelet de combat', att: L(2), prec: -1, puis: 1, melee: true }],
  talents: 'Athlétisme 3, Combat 2, Conduite 2+, Corps à corps 2, Intimidation 2, Savoir militaire 2 (tactique 2+), Tir 2',
  notes: 'Quatre hommes de 25 à 45 ans vivant en caserne, entassés dans une estafette. « Ta Gueule » est le souffre-douleur et le seul à ne pas vénérer Lola. Médiocres seuls, prêts à mourir quand elle les galvanise. Missels, chapelets de combat, pistolets-mitrailleurs.\nLe livre renvoie à la section légère de l\'écran : caractéristiques reprises du soldat de Dieu typique (Livre de base, Règles, p. 88).',
});
const anges4 = npc('anges-lc', {
  nom: 'Anges de Laurent et de Dominique', source: 'Collègues de Lola (battage type 4)', type: 'ange', qty: 2,
  car: car('3 3 3 3 2 3'), def: L(3), pp: 12, pfFix: 6, seuilsFix: seuils('6/12/18/24'),
  armes: [{ n: 'Arme de poing', att: L(3), prec: -2, puis: 3, melee: false }],
  notes: 'Le livre ne donne pas leurs caractéristiques : valeurs génériques d\'ange de grade 0, à ajuster. Présents uniquement si le battage atteint 30 PR.',
});

// Le bestiaire joint (types réutilisables) : mêmes fiches, sans quantité
const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });

// ---------------- Scènes ----------------
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  scene('briefing', '1. Briefing au Centre de Tri', 'Centre de Tri, Paris – lundi matin pluvieux',
    `Convoqués par Message officiel deux ou trois jours plus tôt. Gilbert (démon de Morax) accueille les PJ, fait le tour des locaux, offre un thé au citron et fait remplir une fiche « en appuyant bien, pour les carbones ».
Monsieur Fabien prend le relais : s'enquiert longuement de leur santé et de leurs missions passées, recrute ceux qui n'ont pas d'emploi, puis raconte son anecdote favorite (Laponie, années 70).

Mission (nom de code « Opération tarte Tatin ») :
• Hakim Izmet, écrivain démon de Morax, est poursuivi pour son roman zoophile « Chaude lapine » (Éditions du fruit défendu) : plainte conjointe d'associations familiales, chrétiennes et de la SPA pour outrage aux bonnes mœurs.
• Les plaignants veulent un procès discret pour ne pas faire de publicité au livre.
• Objectif : que l'affaire s'ébruite au maximum et, si possible, que les plaignants soient déboutés au nom de la liberté d'expression.
• Carte blanche, mais discrétion absolue : si l'autre camp flaire une manipulation démoniaque, l'affaire tombe à l'eau. Gilbert est le contact en cas de pépin ou de besoin de matériel.
• Monsieur Fabien fournit les trois numéros de portable d'Izmet.

Sans intervention des PJ, le procès (jeudi 14 h) se conclut le soir même : amende de plusieurs milliers d'euros, livre retiré de la vente, oubli total.

Premier scénario de campagne : c'est le moment d'insister sur la subtilité exigée des agents démoniaques.`),
  scene('boule', '2. Rendez-vous à La Boule', 'La Boule, club select de Meudon – le soir',
    `Izmet ne répond pas sur ses portables ; sur son fixe, une annonce musicale. Après plusieurs messages, il donne rendez-vous le soir même à La Boule (il a des « obligations » avant).

Le club : décor blanc tout en courbes, serveurs en blouses d'hôpital, patron en masque de chantier, piste en revêtement miroir, ambiance cocooning années 90.
Entrée : dress code strict (vêtements monochromes, sans motif ni marque), videurs bornés et peu corruptibles. Si les PJ échouent, ils peuvent faire sortir Izmet et finir au PMU du coin… ce qui l'agace.

Izmet est attablé avec une demi-douzaine d'amis, la main sur la cuisse de Yolande. Il présente sa bande (peintre méconnu, graphiste, journaliste people, futur mannequin) et fait tourner un joint.
Yolande se présente comme reporter canadienne venue étudier la nuit parisienne. Un PJ attentif remarque qu'elle cache une grossesse (avec des vétérans d'INS, rester vague).
Il faut du temps pour parler seul à seul avec Izmet : enthousiaste, mais sans aucune idée ni initiative. Il suivra le plan des PJ tant qu'il ne risque ni sa vie ni son image. Il possède Non-détection.

Conseil : faire réapparaître Yolande discrètement une seconde fois pendant la phase suivante.`,
    [inScene(hakim), inScene(yolande)]),
  scene('enquete', '3. Enquête : éditeur, livre et tribunal', 'Paris 6e – du mardi au jeudi matin',
    `Éditions du fruit défendu : petite maison du 6e, un étage et demi, une dizaine d'employés humains, une quinzaine de titres invendables (les deux Izmet, du porno soft, de la poésie cryptique, un délire maçonnique…). Au bord de la liquidation. L'éditrice Bernadette Longe, optimiste incorrigible, rassure son équipe ; avec un motif crédible, les PJ obtiennent son soutien et son carnet d'adresses (éditeurs, écrivains, critiques).

Le livre : 80 pages, 21 €, couverture vert fluo, une seule critique (calamiteuse) dans Le Parisien, ventes désastreuses. Contenu : confessions postmodernes et scènes de ferme écœurantes.

Izmet : son site perso (journal intime pénible) révèle un noceur bisexuel sans attaches, sans le moindre talent ni zèle satanique. Dans les milieux branchés, on apprend qu'il a une nouvelle régulière depuis une semaine : Yolande.

Le tribunal d'instance du 6e : deux policiers fouillent les sacs, accès limité au rez-de-chaussée et aux secrétariats, ambiance feutrée. Les secrétaires donnent les noms : Maître Lebourg (plaignants), Maître Dormois (défense), la juge Julie Destivelle. Audience publique jeudi, une trentaine de places : arriver une demi-heure en avance.`,
    [inScene(lebourg), inScene(dormois), inScene(juge)]),
  scene('propagande', '4. Propagande : les points de ragot', 'Paris et les médias – jusqu\'au jeudi 14 h',
    `Phase de battage : chaque action des PJ rapporte des points de ragot (PR), à noter jusqu'au début du procès. Plus de bruit = procès plus dur à gérer et risque d'attirer la You-You Force. Moduler selon la mise en œuvre (Baratin, etc.) et récompenser les idées originales.
Ne compter que les PR dont les PJ sont directement responsables (pas les retombées automatiques). Une action renouvelée peut rapporter plusieurs fois.

Sur Hakim Izmet :
• Article presse locale 1-2 · presse nationale 2-3 · radio 3 · télé 5
• Polémique relayée par 2-3 organes de presse 6 · scandale 3-5 · tensions racistes 2-4
Sur « Chaude lapine » :
• Ventes 500 ex. 1 · 1 000 ex. 2 · 1 500 ex. (tirage épuisé) 4
• Critique positive 2-5 · personnalité qui en parle dans les médias 3-6
• Pub sur Paris 2-4 · pub nationale 3-5
Sur la maison d'édition :
• Incident 1-2 · scandale 3 · engouement pour ses livres 4 · personnalité qui la défend 3-5
Sur le procès :
• Presse locale 1 · presse nationale 2 · radio 2 · télé 3-4 · scandale sur un avocat ou la juge 2-3
Sur l'affaire :
• Mobiliser les amis d'Izmet 1 · l'intelligentsia littéraire 2 · des académiciens 3-6 · des politiciens en exercice 4-8

Seuils au début du procès :
• 0-9 PR « Hakim qui ? » — une étudiante en psycho et un journaliste du Parisien ; procès de trois heures.
• 10-19 PR « L'affaire Hakim Izmet » — partisans et opposants, journalistes de Charlie Hebdo, Libé, France 3 ; Marie-Lise Langrelier (ange de Jordi) incognito. Procès jusqu'au lendemain midi.
• 20-29 PR « C'est les beaux-arts qu'on assassine » — salle comble, TV devant le tribunal, grands journaux, personnalités ; Lola Pichegrue (ange de Walther) et ses soldats de Dieu envoyés par la You-You. Jugement pas avant samedi soir tard.
• 30 PR et plus « Toute la ville ne parle que de ça » — procès ajourné au vendredi au tribunal de grande instance, conférence de presse d'écrivains, ministre de la Culture présent, rumeurs d'attentat ; reporté au lundi. Lola est accompagnée de deux anges de Laurent et Dominique.`,
    [], false,
    [choice('battage', 'Total des points de ragot au début du procès ?', [
      ['0-9 PR : Hakim qui ?', 'Battage type 1 : aucun PA de battage. Procès de trois heures.'],
      ['10-19 PR : L\'affaire Hakim Izmet', 'Battage type 2 : aucun PA de battage. Marie-Lise Langrelier (Jordi) au procès.'],
      ['20-29 PR : C\'est les beaux-arts qu\'on assassine', 'Battage type 3 : +1 PA. Lola Pichegrue et ses soldats de Dieu au procès.'],
      ['30 PR et plus : Toute la ville ne parle que de ça', 'Battage type 4 : +2 PA. Lola + deux anges de Laurent et Dominique ; procès reporté au lundi.'],
    ])]),
  scene('proces', '5. Le procès', 'Tribunal d\'instance du 6e (ou de grande instance si 30 PR et plus) – jeudi 14 h',
    `Point d'orgue du scénario. Placer les PNJ selon le niveau de battage (retirer ceux qui ne viennent pas).
Le verdict se tranche par un test résisté de Métier (avocat) entre Maître Lebourg et Maître Dormois : la plus grosse MR l'emporte. Modificateurs :
• PJ passifs (trop occupés à traquer les anges…) : test sans bonus.
• Manipulation d'un avocat ou de la juge (Charme, chantage…) : +1 à +4 colonnes à la défense.
• Trouble de l'audience en faveur d'Izmet (témoin providentiel, esclandre d'une star) : +1 à +4 colonnes à la défense.
• Témoignage des PJ en faveur d'Izmet (rôle crédible exigé) : +2 ou +3 colonnes à la défense.
• Incident « neutre » (alerte à la bombe, manifestation…) : pas de bonus, le procès s'allonge ; s'il survient pendant les plaidoiries ou juste avant le verdict, refaire les deux jets.
• PJ qui plombent Izmet (manipulation ratée, sabotage) : +1 à +4 colonnes à Maître Lebourg.

Harceler les PJ : justifier leur présence, anges infiltrés, presse vorace, et Izmet instable qui peut péter les plombs en pleine audience.

Défense gagnante : Izmet blanchi, livre réimprimé, zoophilie trash à la mode, Fruit défendu remonte la pente.
Accusation gagnante : livre retiré, Izmet oublié en trois semaines, la maison d'édition ferme.
Dans tous les cas, samedi soir, Izmet donne rendez-vous aux PJ chez lui à 21 h pour un cocktail… et ne répond pas à l'interphone.`,
    [inScene(lebourg), inScene(dormois), inScene(juge), inScene(journalistes), inScene(defenseurs), inScene(censeurs), inScene(hakim),
      inScene(marieLise), inScene(lola), inScene(soldats), inScene(anges4)], true,
    [choice('verdict', 'Issue du procès ?', [
      ['Izmet blanchi', '+1 PA. Livre réimprimé, succès d\'édition honorable ; les Éditions du fruit défendu sont sauvées.'],
      ['Izmet condamné', '−1 PA. Livre retiré, Izmet oublié, la maison d\'édition met la clé sous la porte.'],
      ['Izmet disparu avant le verdict', 'Aucun PA pour le verdict ; il faudra justifier son absence au tribunal.'],
    ]),
    choice('anges', 'Les anges présents ont-ils identifié les PJ ?', [
      ['Non, discrétion préservée', ''],
      ['Marie-Lise a des soupçons', 'Elle file les PJ et se renseigne ; si on ne l\'arrête pas, elle prévient Notre-Dame (renforts).'],
      ['Lola les a repérés', 'Tentative de capture et d\'exorcisme dans un coin tranquille avec ses soldats de Dieu.'],
    ])]),
  scene('appartement', '6. L\'appartement d\'Izmet', 'Cinquante mètres carrés près des Champs-Élysées – samedi 21 h',
    `Deux portes à digicode (cour et immeuble). Intérieur branché : meubles IKEA repeints, cuisine design, moquette motif vache. Désert, abandonné depuis peu : lasagne dans le micro-ondes, bain moussant refroidi.
Chambre : futon défait, draps maculés, préservatif usagé dans le cendrier parmi des mégots marqués de rouge à lèvres, boîte de capotes sous le lit, cassette porno en bout de course sur la télé. Les vêtements d'Izmet de leur dernière rencontre sont dans le panier à linge.
Voisinage : une voisine du rez-de-chaussée a vu monter l'amie brune en tunique ample ; l'épicier du coin l'a vue partir en taxi avec un petit sac, une demi-heure avant l'arrivée des PJ.

Vérité : Hakim est mort, renvoyé en Enfer (« plop »), corps compris. Il ne donnera plus signe de vie. Si le procès court toujours, les PJ doivent justifier son absence.`),
  scene('yolande', '7. Sur la piste de Yolande', 'Clubs branchés de Paris – épilogue',
    `Facultatif : si les PJ lâchent l'affaire, ce n'est pas grave pour la suite.
Les fêtards de La Boule (avec doigté) apprennent que Yolande est apparue dans la nuit parisienne il y a trois mois ; personne ne connaît que son prénom. Plusieurs hommes (et une amie lesbienne d'Izmet) l'ont connue charnellement : fougue étonnante, partenaires laissés K.-O. ; depuis Izmet, elle a couché avec la plupart de ses amis. Ils parlent mal à l'aise de sa grossesse. Discrète, préoccupée, passé chargé ; elle ne remettra plus les pieds dans ces clubs.
Si les PJ transmettent au Centre de Tri : la base de données du prince des Messagers (CRD) signale une femme correspondant au signalement, soupçonnée d'avoir tué un démon de Nybbas il y a deux mois pendant l'amour. Dossier transmis aux services d'Andréalphus (on soupçonne une renégate utilisant Orgasme mortel contre son propre camp). Enquête au point mort.

Même s'ils devinent qui elle est, ils n'ont aucune preuve et l'information se perd dans l'administration infernale. Fil à reprendre plus tard dans la campagne.`,
    [inScene(yolande)], false,
    [choice('piste', 'Que font les PJ de la piste Yolande ?', [
      ['Ils transmettent au Centre de Tri', 'Le dossier rejoint celui du démon de Nybbas chez Andréalphus ; Yolande reviendra plus tard dans la campagne.'],
      ['Ils enquêtent seuls', 'Aucune preuve exploitable ; Yolande a disparu des clubs. À faire ressortir dans un scénario suivant.'],
      ['Ils lâchent l\'affaire', 'Rien d\'immédiat ; Yolande reste un mystère pour la suite de la campagne.'],
    ])]),
];

const scenario = {
  id: 'fire-and-ice-1-photocopillage',
  nom: 'Fire and Ice (scénario 1) – Le photocopillage tue le livre',
  resume: `Nihil ex nihilo, scénario 1 (INS). Les démons du Centre de Tri doivent transformer le procès discret de Hakim Izmet, écrivain démon de Morax poursuivi pour son roman zoophile « Chaude lapine », en scandale médiatique — et si possible le faire gagner — sans éveiller les soupçons des anges. Scénario de manipulation (propagande, procès), puis l'auteur disparaît, assassiné par la mystérieuse Yolande.`,
  notes: `Source : ${REF}. Pour démons débutants ; insister sur la discrétion.
Déroulement : briefing (lundi) → rencontre avec Izmet → enquête et propagande (points de ragot) → procès (jeudi 14 h) → appartement vide (samedi soir) → piste de Yolande.

Récompenses (postface) :
• Izmet disparu avant l'issue du procès : rien
• Izmet blanchi : +1 PA · Izmet condamné : −1 PA
• Battage type 1 ou 2 : rien · type 3 : +1 PA · type 4 : +2 PA

Fiches adaptées du livre : caractéristiques en niveaux INS/MV (Ch des humains reporté en Foi). Soldats de Dieu : soldat typique du livre de règles ; anges de Laurent et Dominique : valeurs génériques.`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [hakim, lebourg, journalistes, defenseurs, censeurs, marieLise, lola, soldats, anges4].map(asType);
// Juge et Dormois partagent la fiche de Lebourg dans le livre : types à part pour garder leurs notes
bestiaire.push(asType(dormois), asType(juge), asType(yolande));

// Contrôle : pouvoirs inconnus des règles
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));

writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types');
