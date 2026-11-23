// Génère le fichier d'import « insmv-scenario » pour « Les quais de Seine ne sont plus ce qu'ils étaient ! » (livret Magna Veritas, p. 58-67)
// usage : node gen-livret-mv-1-quais-de-seine.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Livret Magna Veritas (livre de base INS/MV 4e), « Les quais de Seine ne sont plus ce qu\'ils étaient ! », p. 58-67';
const L = (s) => R.parseLvl(String(s));
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
const ARMES = new Map(R.ARMES.flatMap(([g, l]) => l.map((x) => [x[0], { prec: x[1], puis: x[2], melee: R.MELEE_GROUPS.includes(g) }])));
const arme = (n, table, lvl) => { const w = ARMES.get(table); if (!w) throw new Error('arme inconnue : ' + table); return { n, att: L(lvl), ...w }; };
const poing = (lvl) => arme('Coup de poing', 'Coup de poing', lvl);
const P = 'mv1-'; let n = 0; const id = (k) => P + k;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [poing(1)], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});

// ---------------- Créatures de la Marche lovecraftienne ----------------
const chiens = npc('chiens', {
  nom: 'Chien de Tindalos', source: 'Molosse du cauchemar de Beleth', type: 'monstre', qty: 1, car: car('3+ 4+ 6 3 0+ 2+'), def: L('5+'),
  pfFix: 6, seuilsFix: seuils('5/10/15/20'),
  armes: [{ n: 'Langue munie d\'un dard', att: L('4+'), prec: 0, puis: 6, melee: false }],
  pouvoirs: pows('Anaérobiose, Immunité contre les maladies et les poisons, Jeûne'),
  talents: 'Corps à corps 4+, Défense 5+, Discrétion 4+, Fouille 4+, Narcolepsie 2',
  notes: 'Énorme molosse noir aux contours flous, deux yeux rouges ; ses grognements le précèdent de quelques minutes. Entre et sort par les angles droits des murs (coins de pièce, plafond).\nN\'existe que dans l\'obscurité : rallumer la lumière le fait disparaître. Emporte sa proie dans sa dimension pour la dévorer ; ayant mangé Josiane Franchon, la meute ne devrait pas revenir avant quelques jours (au MJ de voir).\nLangue : comme une langue barbelée (précision +0, puissance +6, bonus de Force inclus). Valeurs identiques à l\'entrée du bestiaire (p. 60).',
});
const profonds = npc('profonds', {
  nom: 'Profonds', source: 'Hommes-poissons amphibies', type: 'monstre', qty: 4, car: car('3+ 2+ 2+ 1+ 0+ 1+'), def: L('2+'), prot: 2,
  pfFix: 5, seuilsFix: seuils('5/11/16/22'),
  armes: [{ n: 'Griffes', att: L('3+'), prec: 2, puis: 5, melee: true }],
  pouvoirs: pows('Anaérobiose, Apparence horrifique 2+, Immunité contre les maladies et les poisons'),
  talents: 'Athlétisme 4, Corps à corps 3+, Défense 2+, Discrétion 2+',
  notes: 'Tête de poisson aux yeux globuleux, mâchoire de piranha, peau verdâtre sur un squelette rachitique. Une dizaine en tout, vivant dans la Seine et le bassin du port ; ils sortent la nuit par groupes de 1d6 (quantité de la scène : 4, à ajuster) pour attaquer les promeneurs isolés et les dévorer dans leur tanière (écluses ou local technique).\nGriffes : comme des ongles d\'acier (précision +2, puissance +5, bonus de Force inclus). Peau écailleuse : protection 2.',
});
const lovecraft = npc('lovecraft', {
  nom: 'Fantôme de H.P. Lovecraft', source: 'Âme de l\'écrivain prisonnière de la Marche de Beleth', type: 'monstre', car: car('1+ 3+ 4 4+ 1+ 5'), def: L('4+'),
  pp: 25, pfFix: 6, seuilsFix: seuils('3/7/10/14'), armes: [],
  pouvoirs: pows('Absorption de volonté 4+, Boomerang 2+, Malédiction : folie 4, Esprit chaotique, Déphasage 3+, Volonté supra-normale 2'),
  talents: 'Art 0+ (écriture 2), Défense 4+, Discrétion 5, Discussion 3+, Savoir occulte 1+ (mythe de Cthulhu 3+)',
  notes: 'Homme d\'une trentaine d\'années, visage fin et allongé, costume des années 20, air absent et mélancolique. Erre toute la nuit sur les quais en regardant l\'eau et disparaît à l\'aube.\nVocabulaire ampoulé, débit lent, fort accent anglais ; refuse de voir que le décor n\'a rien des années 20. Ne perçoit pas les créatures qui naissent de son esprit.\nLe détruire libère son âme vers le Purgatoire : c\'est l\'objectif implicite de la mission. Pas d\'arme : il se défend par ses pouvoirs.',
});

// ---------------- Démons ----------------
const mamy = npc('mamy', {
  nom: 'Mamy Tromblon', source: 'Démon de Kronos, grade 2', type: 'demon', car: car('3+ 2+ 4+ 5 2 4+'), def: L('3+'),
  pp: 28, pfFix: 8, seuilsFix: seuils('5/11/16/22'),
  armes: [{ n: 'Thompson maudite (attaque multiple)', att: L('4+'), prec: 2, puis: 9, melee: false }, poing('3+')],
  pouvoirs: pows('Armure corporelle 2, Champ de force 3, Déplacement temporel 3+, Perturbation de pouvoir 2+, Projection temporelle 2, Volonté supra-normale 3+'),
  talents: 'Corps à corps 3+, Défense 3+, Discrétion 3+, Discussion 6+, Enquête 4, Fouille 4+, Médecine 2+, Sixième sens 5',
  notes: 'Incarnée dans une vieille mémé bourgeoise (cheveux blancs, manteau Dior, vieux cabas). Fine limière, discrète et professionnelle, envoyée par l\'Enfer enquêter en concurrence avec les PJ.\nRepère vite les anges. Acculée, ou face à un ange isolé dans un lieu désert la nuit, elle sort du cabas sa mitraillette Thompson à camembert et arrose en jurant comme un charretier.\nThompson maudite : arme majeure et indépendante 4+ (attaque au niveau 4+ ×2), précision +2, puissance +9, attaque multiple, pénétration importante, portée moyenne.\nÉliminée par Beleth au soir de J+2 avec ses deux zombies.',
});
const zombies = npc('zombies', {
  nom: 'Mémés zombies', source: 'Familiers de Mamy Tromblon (mortes-vivantes)', type: 'mortvivant', qty: 2, car: car('2+ 2+ 2 1+ 3 2+'), def: 2,
  pp: 8, pfFix: 4, seuilsFix: seuils('4/8/12/16'), armes: [poing(3)],
  pouvoirs: pows('Anaérobiose, Apparence horrifique 3, Jeûne, Immunité contre les maladies et les poisons, Maladie 2'),
  talents: 'Athlétisme 2, Corps à corps 3, Intimidation 3',
  notes: 'Deux mamies en grand deuil, visage fardé caché sous un voile noir de veuve ; teint gris et odeur douteuse. Crachent, distribuent des taloches aux gamins, fouinent partout.\nValeurs estimées : le livre ne donne que « morts-vivants avec Maladie 2 » ; fiche du mort-vivant typique (livre de règles p. 89) avec Maladie 2.',
});
const beleth = npc('beleth', {
  nom: 'Tom-Tom (Beleth)', source: 'Prince-démon des cauchemars, incarné en clochard', type: 'demon', armes: [], def: 2,
  notes: 'Vieux clochard dépenaillé, coupe afro, patchwork de vêtements jaune fluo et rose bonbon, sale et malodorant ; pousse un caddy plein d\'objets inutiles et sillonne le quartier jour et nuit. Les autres SDF le surnomment « Tom le fou ». Vocabulaire de normalien, discours incohérent.\nArrivé au matin du jour J pour étouffer la dérive de sa Marche (effacer la mémoire de témoins par leurs rêves, faire disparaître des indices) avant qu\'Andromalius ne l\'apprenne.\nPas de caractéristiques : un prince démon, intouchable pour des anges débutants (il les endort tous d\'un claquement de doigts). Ne doit pas être combattu ; toute tentative tourne au cauchemar.',
});

// ---------------- Humains et contacts ----------------
const jimmy = npc('jimmy', {
  nom: 'Jimmy Apple-Pie', source: 'Contact parisien des anges, gérant du « Palais des tartes »', armes: [],
  notes: 'Beau gosse gominé d\'une trentaine d\'années, sourire magnifique et hypocrite. Gère un restaurant bobo près des Champs-Élysées qui ne sert que des tartes expérimentales. Nouveau contact : c\'est à lui que les PJ font leurs rapports et qu\'ils peuvent demander des renforts (anges de Blandine). Pas de caractéristiques dans le livre.',
});
const maurice = npc('maurice', {
  nom: 'Maurice Benmoussa', source: 'Journaliste à « Infos du Monde et d\'ailleurs »', car: car('2 2 3 2 2 2'), def: 2,
  talents: 'Enquête 3, Filature 1 (ridicule), Photographie 3, Baratin 2',
  notes: 'Gilet multipoches, Nikon, collier de barbe, chemise à fleurs. Pigiste de tabloïd venu couvrir « l\'affaire du loup-garou du 4e ». Sûr de lui, pugnace ; colle aux PJ dès qu\'il les remarque (comportement bizarre ou faux « officiels »).\nPeut devenir un allié lourd mais utile, rapporter une photo floue de Profond, ou finir dévoré par un chien de Tindalos.\nCaractéristiques et talents estimés (le livre n\'en donne pas).',
});

const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  scene('briefing', '1. Briefing chez Jimmy Apple-Pie', 'Le « Palais des tartes », près des Champs-Élysées – jour J, 11 h',
    `La veille au soir, chaque ange reçoit un ordre de mission cacheté apparu au pied de son lit (Ave Maria à l'orgue dès qu'on marche dessus). Rendez-vous pour un brunch avec le nouveau contact parisien, Jimmy Apple-Pie, autour d'une quiche au potiron.
Ambiance : Paris en plein automne, grand vent, feuilles mortes.

Ce que Jimmy leur apprend :
• Lila De Montrouge, 10 ans (10 boulevard Morland), a été attaquée la veille dans sa chambre par un « méchant loup » : morsures, une vingtaine de points de suture, aucune trace d'animal ni d'intrus. Plainte classée.
• Ce matin, deux voisins du 14 boulevard Morland (Hubert Grangier, médecin, et Vincent Milton, étudiant) ont porté plainte pour détention d'animal sauvage : un gros « molosse » grognait chez leur voisine du dessus, Josiane Franchon, inspectrice des impôts. Elle a disparu ; aucune trace d'animal chez elle.
Mission : aller sur place et tirer l'affaire au clair, puis rendre compte à Jimmy.`,
    [inScene(jimmy)]),
  scene('quartier', '2. Le quartier de l\'Arsenal', '4e arrondissement : port de plaisance, écluses, quais, boulevard Morland',
    `Zone surnaturelle : un rectangle d'un kilomètre sur deux, là où le port de plaisance rejoint la Seine. Quartier haussmannien bourgeois et ennuyeux.
Lieux importants :
• Port de plaisance : bassin creusé à 5 m sous la chaussée, promenade et jardins dégarnis, capitainerie miteuse, une vingtaine de petits bateaux. Débouche d'un côté sur le canal Saint-Martin (souterrain), de l'autre sur les écluses.
• Écluses : terre-plein sous la ligne de métro aérienne, aspect de caverne ; des clochards dorment sous le pont métallique.
• Ligne de métro aérienne : station Quai de la Rapée, entre le port et la morgue.
• Quais : promenade pavée et triste, quelques péniches de chantier près des écluses.
• Local de maintenance : grille verrouillée dans le mur du quai, grand hangar de béton obscur (matériel de jardinage de la Ville).
• Morgue de Paris : grand bâtiment carré de pierre rouge au bord de l'eau ; on y autopsie les morts suspectes.

À glisser dans les descriptions dès le début : un clochard en fluo aperçu de loin (Tom-Tom) et un trio de vieilles dames (Mamy Tromblon).`),
  scene('temoins', '3. Les témoins du boulevard Morland', '10 et 14 boulevard Morland – jour J',
    `• Les De Montrouge : quadragénaires BCBG, fille unique, immense appartement. Madame méprise la police et a fait défiler des « médecins parallèles ». Lila raconte un gros loup noir et poilu sorti du coin au-dessus de son armoire ; elle a allumé la lumière et s'est évanouie. Le médecin de l'Hôtel-Dieu confirme des morsures répétées (côtes, bras droit).
• Hubert Grangier : médecin quinquagénaire, pull poussiéreux. Rentrant de soirée (J-1), lui et sa femme ont vu dans la pénombre un énorme « chien-loup » filer vers l'étage de Mme Franchon. Ils ont été sauvés en rallumant la minuterie, sans le savoir.
• Vincent Milton : étudiant en histoire à la Sorbonne, chambre de bonne ; n'a rien vu mais a entendu grogner et gratter les murs ce soir-là, puis plus rien.
• Josiane Franchon : vieille fille acariâtre détestée de l'immeuble, inspectrice des impôts. Volatilisée depuis la veille ; sa chambre est sens dessus dessous, traces de lutte. Le chien de Tindalos l'a emportée et dévorée dans sa dimension.
Les PJ croiseront peut-être une mamie dans l'immeuble de Josiane : Mamy Tromblon fait la même enquête.`),
  scene('tindalos', 'Rencontre : un chien de Tindalos', 'Une pièce ou une cage d\'escalier plongée dans le noir – à placer selon les besoins',
    `Rencontre libre : la meute ne devrait pas revenir avant quelques jours, mais le MJ peut l'utiliser quand il veut (ou pour punir Maurice Benmoussa).
Grognements effroyables quelques minutes avant ; la bête surgit d'un angle droit (coin de mur, plafond). Elle ne peut exister que dans l'obscurité : allumer la lumière la fait disparaître aussitôt. Elle cherche à saisir une proie et à l'emporter.`,
    [inScene(chiens)], true),
  scene('buvert', '4. Le noyé de Notre-Dame', 'Domicile des Buvert, morgue, écluses – J+1',
    `Le corps déchiqueté de Léon Buvert, petit fonctionnaire du quartier, est repêché dans la Seine au niveau de Notre-Dame. Sa veuve, hystérique, dit seulement qu'il n'est pas rentré de sa promenade nocturne autour du port avec leur teckel Napoléon ; il portait son costume et son chapeau bordeaux.
À la morgue : autopsie pas encore faite, mais instructive si les PJ y assistent. Morsures, succions, griffures, peau arrachée… et des traces de mains à demi effacées sur les membres, comme si on l'avait empoigné.
Vérité : une bande de Profonds a tué l'homme et le chien près des écluses, les a dévorés et a jeté les restes à l'eau.
Aux écluses après cette date : le chapeau bordeaux dans les affaires d'un clochard (ramassé par terre) et le squelette de Napoléon flottant dans un bac.`),
  scene('quais-nuit', '5. Nuit sur les quais', 'Quais de Seine, écluses, bassin du port – de nuit',
    `Si les PJ se promènent seuls sur les quais ou font le guet toute la nuit, ils ont de bonnes chances de voir 1d6 Profonds émerger de l'eau pour attaquer un promeneur isolé (au besoin, l'un d'eux).
Les Profonds traînent leurs victimes dans leur tanière (écluses ou local technique) pour les dévorer en paix.
Rappel : les éléments de la Marche ne se manifestent que là où l'ambiance s'y prête — la nuit, au bord de l'eau, dans les lieux sinistres.`,
    [inScene(profonds)], true),
  scene('morgue', '6. La morgue de Miskatonic', 'Morgue de Paris – J+2',
    `Au matin, lors des premières autopsies, le corps de Jean-Pierre Valtin (garagiste alcoolique, au frigo depuis deux jours) a disparu. Dans le tiroir : un très vieux livre manuscrit en arabe archaïque, à moitié décomposé. Le directeur croit à une mauvaise blague et prend l'affaire très au sérieux ; le livre est envoyé à un linguiste réputé… et disparaît aussi vite qu'il était apparu.
Les PJ ne l'apprennent qu'en allant sur place ou par un policier allié.
Dès lors, chaque fois qu'un PJ vient à la morgue de nuit : test de Perception très difficile pour remarquer que l'enseigne indique « morgue municipale de Miskatonic ». Le personnel part une demi-heure avant la tombée de la nuit et n'a rien vu. De nuit, jouer à fond l'ambiance : grattements, chuchotements, bruits dans les frigos.`),
  scene('memes', '7. Ceux du troisième âge', 'Partout dans le quartier – de J après-midi à J+2',
    `Arrivée le même après-midi que les PJ, Mamy Tromblon (démon de Kronos) enquête avec deux mémés zombies voilées de noir. Le trio passe inaperçu : pigeons, thé au troquet comme trois vieilles Anglaises… mais elles traînent à des heures indues, crachent, giflent les gamins et posent des questions avec insistance.
Les PJ retombent sans cesse sur leurs traces : des témoins racontent leur conversation avec une vieille dame, une mamie dans l'immeuble de Josiane, etc.
Mamy Tromblon repère vite les anges. Elle ne se trahit pas, mais si elle est acculée, ou si elle surprend un ange isolé la nuit dans un lieu désert, elle sort sa Thompson de son cabas.
Au soir de J+2, Beleth les élimine discrètement : le gang des mémés disparaît de la circulation (et si les démons viennent enquêter, cette disparition pourra se retourner contre Beleth).`,
    [inScene(mamy), inScene(zombies)], true,
    [choice('memes', 'Comment les PJ gèrent-ils Mamy Tromblon ?', [
      ['Ils l\'affrontent avant J+2', 'Combat contre un démon de grade 2 armé d\'une Thompson : dangereux. Si elle survit et s\'échappe, son rapport risque d\'alerter l\'Enfer.'],
      ['Ils l\'évitent ou la surveillent', 'Elle disparaît au soir de J+2, éliminée par Beleth. Les PJ peuvent le remarquer et s\'en inquiéter.'],
    ])]),
  scene('j3', '8. Cauchemars et rencontres errantes', 'Quartier de l\'Arsenal – J+3 (et rencontres libres)',
    `J+3 : les habitants (restaurant, pharmacie, concierge…) se plaignent de cauchemars la nuit précédente, toujours les mêmes thèmes : rats difformes, vieille sorcière, fenêtres à pignons poussant sur les façades, impression de flotter dans l'espace et d'une présence qui approche.
J+3 midi : cadavre dépecé d'un clochard dans le local technique, dans une mare de sang. Non identifié, mais les PJ reconnaissent un des SDF des écluses : encore les Profonds.

Rencontres sans place fixe (relances si l'enquête s'enlise) :
• Maurice Benmoussa, journaliste de tabloïd, fouineur collant.
• Les indicibles cauchemars : les PJ aussi peuvent rêver de symboles lovecraftiens (un docteur ranimant des animaux, un pentacle jaune tracé à la main…) avec des effets physiques équivalents au pouvoir Cauchemar.
• Tom-Tom, le clochard en fluo : une silhouette récurrente, jamais vraiment rencontrée ; si on le coince, il parle comme un normalien mais délire.
• La cité cyclopéenne : un PJ rêve qu'il se réveille sur une tour démesurée, dans une cité en ruine de pierre verte comme du jade baignant dans un liquide jaunâtre. Il aperçoit au balcon d'une tour voisine Mme Despintos, la boulangère du boulevard Morland, qui se souvient avoir fait le même rêve et l'y avoir vu.`,
    [inScene(maurice)]),
  scene('rodeur', '9. Le rôdeur des quais', 'Quais de Seine – tard dans la nuit',
    `Tard dans la nuit, un homme mince en costume d'une autre époque contemple l'eau noire : le fantôme de H.P. Lovecraft, prisonnier depuis sa mort de la mini-Marche que Beleth s'est construite comme un musée-souvenir. Sa promenade dure toute la nuit et il s'évanouit à l'aube.
Il vit dans son monde (son bureau et quelques rues), ne voit pas ses propres créatures et nie que le décor ne soit pas celui des années 20. Discours ampoulé, accent anglais.
Pour que son âme monte au Purgatoire, les PJ doivent l'éliminer ; il se défend par ses pouvoirs (Absorption de volonté, Malédiction : folie, Déphasage…).`,
    [inScene(lovecraft)], true,
    [choice('lovecraft', 'Que font les PJ du fantôme de Lovecraft ?', [
      ['Ils le détruisent', 'Son âme est libérée vers le Purgatoire : le pire est évité (au minimum −1 à −3 PA plutôt que −4 à −6). Beleth ne leur en tient pas rigueur.'],
      ['Ils le laissent errer', 'Son âme reste prisonnière de la Marche de Beleth quand celle-ci repart à J+4.'],
    ])]),
  scene('beleth', '10. Excusez-nous, on faisait que passer…', 'Quartier de l\'Arsenal – J+3, fin de journée (ou plus tôt)',
    `Tom-Tom n'est pas un SDF : c'est Beleth, arrivé le matin du jour J. Il avait oublié sa Marche lovecraftienne et a senti sa dérive ; il veut limiter les dégâts sans que l'affaire remonte à Andromalius. Il repère vite les PJ et Mamy Tromblon.
Il n'intervient physiquement que si les anges préviennent leurs supérieurs ou font venir un ange de Blandine : il parlemente ou envoie un ou deux PJ à l'hôpital pour décourager les autres. À la fin du troisième jour, il sait que la Marche se détache et vient parler aux anges : explications vagues, mais il leur fait comprendre qu'il pourrait les vaporiser d'un claquement de doigts. Il préfère les acheter qu'avoir à expliquer leur disparition.
Si les PJ ne se laissent pas intimider, il les plonge dans un sommeil profond et leur montre sa puissance dans le monde des cauchemars (la cité cyclopéenne, par exemple). S'ils s'entêtent encore, c'est le carnage.
S'ils coopèrent, ils gagnent un « ami » : impossible à invoquer, mais Beleth leur rendra de petits services de temps en temps… au risque de se faire prendre par la hiérarchie angélique.
Ange de Dominique : complique la prise de position face à Beleth. Ange de Blandine : comprend vite qu'une Marche onirique est en cause, mais attire plus tôt l'attention de Beleth, qui cherchera activement à neutraliser le groupe.`,
    [inScene(beleth)], false,
    [choice('beleth', 'Quelle attitude face à Beleth ?', [
      ['Ils dealent avec lui', 'Ils mentent à leur hiérarchie et perdent un paquet de PA, mais survivent et gagnent un allié contre-nature.'],
      ['Ils lui résistent', 'Sommeil et démonstration de puissance dans les cauchemars ; s\'ils persistent, carnage. Tout rentre dans l\'ordre à J+4 quoi qu\'il arrive.'],
      ['Ils appellent Jimmy Apple-Pie', 'Un ou deux anges de Blandine viennent contenir la Marche ; les PJ doivent encore trouver Lovecraft. Beleth file avec une dent contre eux.'],
    ])]),
  scene('fin', '11. J+4 : conclusions diverses et variées', 'Notre-Dame / rapport à Jimmy Apple-Pie',
    `La Marche finit de traverser notre réalité ; les événements surnaturels cessent et tout rentre dans l'ordre, que les PJ aient agi ou non.
Les anges ont quatre jours pour comprendre l'essentiel, trouver le fantôme de Lovecraft et décider du sort de son âme. À défaut, ils pourront toujours rédiger un rapport bidon ou revenir la queue entre les jambes une semaine plus tard.`,
    [], false,
    [choice('fin', 'Comment l\'affaire se termine-t-elle ?', [
      ['Ils n\'ont rien compris', '−4 à −6 PA.'],
      ['À côté de la plaque, mais Lovecraft détruit', 'Une âme sauvée : −1 à −3 PA (corvée de secrétariat pour « Gériatrie Magazine »).'],
      ['Ils ont compris en gros et appelé des renforts', 'Anges de Blandine en soutien, Lovecraft détruit par les PJ, Beleth file en gardant une dent contre eux : +4 à +6 PA.'],
      ['Ils ont attiré l\'attention des démons', 'L\'Enfer envoie des démons, la disparition de Mamy Tromblon remonte jusqu\'à Andromalius et Beleth se fait taper sur les doigts : les PJ se font un ennemi juré du prince des cauchemars. +1 à +3 PA.'],
      ['Ils ont dealé avec Beleth', 'Mensonge à la hiérarchie, grosse perte de PA (montant au choix du MJ), mais survie et allié contre-nature.'],
    ])]),
];

const scenario = {
  id: P + 'quais-de-seine',
  nom: 'Livret MV – Les quais de Seine ne sont plus ce qu\'ils étaient !',
  resume: 'Scénario court de Magna Veritas pour anges débutants (Patrick Renault), Paris en automne. Envoyés par leur nouveau contact Jimmy Apple-Pie enquêter sur des attaques de « loup » et une disparition près du port de l\'Arsenal (4e arrondissement), les anges découvrent qu\'une mini-Marche onirique de Beleth — son musée-souvenir de Lovecraft, où erre le fantôme de l\'écrivain — dérive à travers notre réalité pendant quatre jours : chiens de Tindalos, Profonds, cauchemars collectifs, morgue « de Miskatonic ». Un démon de Kronos enquête en concurrence, et Beleth lui-même, déguisé en clochard fluo, veut étouffer l\'affaire et acheter le silence des anges.',
  notes: `Source : ${REF}.

Histoire secrète : Beleth, grand admirateur de Lovecraft, a volé l'âme de l'écrivain juste avant sa mort et l'a enfermée dans une mini-Marche à l'image de son œuvre. Cette Marche dérive et se « coule » sans heurt dans le 4e arrondissement ; ses habitants n'apparaissent que la nuit, au bord de l'eau, dans les lieux sinistres, mais y deviennent réels. Les Grands Anciens sont suggérés (indices, visions) sans jamais s'incarner.

Chronologie :
• J-1 : les Grangier échappent de peu à un chien de Tindalos (minuterie rallumée) ; la nuit, Josiane Franchon est emportée et dévorée ; Lila De Montrouge est attaquée et sauvée en allumant la lumière.
• J matin : Beleth arrive sous l'apparence du clochard Tom-Tom. J après-midi : arrivée des PJ et de Mamy Tromblon.
• J+1 : le corps de Léon Buvert est repêché à Notre-Dame (tué par des Profonds).
• J+2 matin : disparition du corps de Valtin à la morgue, remplacé par un livre arabe ; la morgue devient « de Miskatonic » la nuit. J+2 soir : Beleth élimine Mamy Tromblon et ses zombies.
• J+3 : cauchemars collectifs ; cadavre de clochard au local technique ; en fin de journée, Tom-Tom/Beleth vient parlementer.
• J+4 : la Marche a fini de dériver, tout rentre dans l'ordre.

Joker du MJ débutant : si la partie part dans une impasse, déclarer que les dernières minutes n'étaient qu'un cauchemar et faire se réveiller les PJ un peu plus tôt dans l'aventure. À utiliser avec parcimonie.

Récompenses (conclusions) :
• Rien compris : −4 à −6 PA
• À côté de la plaque mais Lovecraft détruit : −1 à −3 PA
• Renforts de Blandine demandés à Jimmy, Lovecraft détruit : +4 à +6 PA
• Trop de bruit, les démons s'en mêlent (Beleth ennemi juré) : +1 à +3 PA
• Deal avec Beleth : grosse perte de PA, mais un allié contre-nature

Fiches : chiens de Tindalos repris du bestiaire ; Profonds, fantôme de Lovecraft et Mamy Tromblon d'après le livre ; zombies de Mamy Tromblon estimés (mort-vivant typique + Maladie 2) ; Beleth, Jimmy et Maurice sans caractéristiques dans le livre (fiches minimales, valeurs de Maurice estimées). Les anges typiques du livret (p. 92-95) peuvent servir de prétirés.`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [chiens, profonds, lovecraft, mamy, zombies, beleth, jimmy, maurice].map(asType);
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));
writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types');
