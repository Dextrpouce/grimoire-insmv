// Génère le fichier d'import « insmv-scenario » pour « Interzone » (Fire and Ice 2, p. 83-97, + Tempus Fugit p. 153-154)
// usage : node gen-fire-and-ice-14-interzone.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Fire and Ice 2, « Interzone », p. 83-97';
const L = (s) => R.parseLvl(String(s)); // « 2+ » → 5
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
const ARMES = new Map(R.ARMES.flatMap(([g, l]) => l.map((x) => [x[0], { prec: x[1], puis: x[2], melee: R.MELEE_GROUPS.includes(g) }])));
const arme = (n, table, lvl) => { const w = ARMES.get(table); if (!w) throw new Error('arme inconnue : ' + table); return { n, att: L(lvl), ...w }; };
const poing = (lvl) => arme('Coup de poing', 'Coup de poing', lvl);
let n = 0; const id = (p) => `fi14-${p}`;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [poing(1)], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});

// ---------------- Fiches de l'équipe du Centre de Tri (Fire and Ice, p. 24-26), reprises telles quelles ----------------
const pc = (s) => s.split(', ').map((x) => { const m = x.match(/^(.*?) (\d\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 }; });
const REF_CDT = 'Fire and Ice, « Le Centre de Tri », p. 24-26';
const FICHES = {
  fabien: { nom: 'Monsieur Fabien', source: 'Démon de Baalberith, grade 2 (chef du Centre de Tri)', type: 'demon', car: car('2 2 5 4 2 4'), def: 2, pp: 24, pfFix: 6, seuilsFix: [4, 8, 12, 16],
    armes: [{ n: 'Coup de poing', att: 2, prec: 0, puis: -3, melee: true }],
    pouvoirs: pc('Message officiel, Télépathie 5, Boomerang 3, Cauchemar 3, Onde de choc 2, Téléportation 2, Corps gazeux, Détection du futur proche 2, Volonté supra-normale 2'),
    talents: 'Métier (administration) 7, Discussion 6, Baratin 4 ; avantage matériel : le Centre de Tri',
    note: 'Vétéran débonnaire, pipe, anecdote laponne. Secret : remplacé par Beleth (« le Grand Imposteur ») quelques semaines après l\'arrivée des PJ.' },
  gilbert: { nom: 'Gilbert', source: 'Démon de Morax, grade 1 (Centre de Tri)', type: 'demon', car: car('3 2 4 4 3 3'), def: 2, pp: 18, pfFix: 7, seuilsFix: [5, 10, 15, 20],
    armes: [{ n: 'Coup de poing', att: 2, prec: 0, puis: -3, melee: true }],
    pouvoirs: pc('Œuvre d\'art, Télépathie 4, Jet de flammes 2, Sommeil 2, Invisibilité 1, Vitesse 1, Vol 1'),
    talents: 'Tartiner de la poésie 7, Trier du courrier 3, Conduite 4, Pilotage 3, Tir 2+ ; avertissement sans frais : gentil',
    note: 'Délégué CGT, gardien des lettres non distribuées, poète médiocre, habitué de Chez Régis ; bavard une fois éméché. Secret : s\'est perdu un jour dans un dédale lumineux sous les caves.' },
};
const fiche = (key, extra) => {
  const f = FICHES[key];
  return { id: id(key), nom: f.nom, source: f.source, type: f.type, qty: 1, car: { ...f.car }, def: f.def, prot: 0, pfFix: f.pfFix, pp: f.pp, seuilsFix: [...f.seuilsFix],
    armes: JSON.parse(JSON.stringify(f.armes)), pouvoirs: JSON.parse(JSON.stringify(f.pouvoirs)), talents: f.talents, esquive: false, volonte: false,
    notes: [extra, f.note, `Caractéristiques : ${REF_CDT}.`].filter(Boolean).join('\n') };
};

// ---------------- PNJ : prologue ----------------
const fabien = fiche('fabien', 'Dans ce scénario, Beleth (prince des cauchemars) se révèle sous les traits de Monsieur Fabien : Leviathan le salue de tous ses titres. Il calme les flics à la façon d\'un Obi-Wan, écoute le message de Baal, puis envoie les PJ au Purgatoire par la MRC (sommeil d\'un geste). Au retour, il récompense les PJ (+2 niveaux en Cauchemars, +1 PP).\nPas de fiche de Beleth dans ce scénario : fiche de Monsieur Fabien reprise (le prince est bien plus puissant).');
const gilbert = fiche('gilbert', 'Pendant l\'assaut de la Garde carmine, balance chaises de bureau et armoires de classement par une baie vitrée éclatée. Allié des PJ.');
const garde = npc('garde-carmine', {
  nom: 'Garde carmine (commando de Belial)', source: 'Démons de Belial, grade 1 – Membres de la Garde carmine', type: 'demon', qty: 10,
  car: car('4 4 3 3 2 3'), def: L('5+'), pp: 13, pfFix: 7, seuilsFix: seuils('6/12/18/24'),
  armes: [arme('Fusil d\'assaut', 'Fusil-mitrailleur', 4), arme('Lance-flammes', 'Lance-flammes', 4), arme('Corps à corps', 'Coup de poing', 5)],
  pouvoirs: pows('Jet de flammes 3, Armure corporelle 2, Vitesse 1, Régénération 2, Immunité contre le feu'),
  talents: 'Défense 5+, Corps à corps 5, Athlétisme 4, Tir 3 (armes de guerre 4), Conduite 4+, Pousser des cris de guerre 3, Se retourner tous en même temps 2. Feu de Prométhée 2 (pouvoir propre à la Garde carmine : langue de feu qui touche même les immunisés au feu)',
  notes: 'Une dizaine assiègent le Centre de Tri en tirant à l\'arme automatique par les fenêtres, pendant qu\'un début d\'incendie lèche le manoir (deux camions de pompiers sur le parking : leur véhicule fétiche).\nCaractéristiques de la Garde carmine de Fire and Ice 2, « Run like Hell », p. 65 (Jacques, Alexandre et compagnie) : le scénario ne donne pas de fiche. Armes : fusil d\'assaut (le texte parle d\'armes automatiques, valeurs du fusil-mitrailleur) et lance-flammes (arme de prédilection, valeurs de la table) ; niveau 4 en armes de guerre.',
});
const marieJolie = npc('marie-jolie', {
  nom: 'Marie-Jolie', source: 'Démone de Baal, grade 3 (succube, future prince du sexe)', type: 'demon', armes: [],
  notes: 'Grande brune pulpeuse sortie d\'une coccinelle rouge garée en catastrophe. Fait apparaître une hache de bataille géante et taille la Garde carmine en pièces avec Leviathan. Se lave les mains aux toilettes puis transmet le message de Baal : alliance pour restaurer l\'unité en Enfer, soldats expérimentés mis à disposition (aux ordres des PJ et du Centre), en échange d\'un soutien au Conseil pour une régence (pas le trône). Baal se dit sans doute père de l\'enfant d\'Andrealphus et veut la retrouver vite.\nAlliée : ne pas la traiter en adversaire. Fiche minimale (le livre ne donne que sa fiche de prince, p. 156, valable après la campagne).',
});
const leviathan = npc('leviathan', {
  nom: 'Leviathan', source: 'Démon de Baal (colosse)', type: 'demon', armes: [],
  notes: 'Colosse noir armé d\'une épée à deux mains, arrivé avec Marie-Jolie ; crache des flammes en combattant. Met genou à terre devant Monsieur Fabien et le salue comme Beleth, prince des cauchemars.\nAllié. Fiche minimale (pas de caractéristiques dans le livre).',
});

// ---------------- PNJ : MRC et train onirique ----------------
const neil = npc('neil', {
  nom: 'Neil (Nielle)', source: 'Démon de Beleth, grade 2 – gardien de la MRC', type: 'demon', car: car('2 5 3+ 5 2 4'), def: 2,
  pp: 22, pfFix: 7, seuilsFix: seuils('4/8/12/16'), armes: [],
  pouvoirs: pows('Cauchemar mortel 5, Sommeil 4, Cauchemar 3, Télépathie 3, Trait d\'énergie 3, Non-détection 3'),
  talents: 'Écrire des histoires qui déchirent leur mère 6, Vol onirique 6, Sonner une cloche en chocolat 5, Écumer des bouges infâmes 5, Piloter une montgolfière des rêves 5, Baratin 4, Tilleul-menthe 4',
  notes: 'Mince, cheveux noirs en bataille, blouson de cuir, jean, t-shirt noir ; joue avec un gros chat brun sur le quai de la gare des Limbes. A déjà pris les billets (première classe) et remet une clé : descendre à la station Pâle, forcer les objets trouvés, ouvrir la petite porte grise, descendre d\'un étage, prendre la porte 000. Conseils : ne pas semer le bazar dans l\'escalier, se méfier du mécano espagnol de la loco.\nAllié. Caractéristiques de Fire and Ice 2, « La Bibliothèque du Marchand de Sable », p. 49. Pas de talent de défense : 2.',
});
const rene = npc('rene', {
  nom: 'René', source: 'Humain dans le coma – le chauffeur du train', type: 'humain', car: car('2 1 4 3 1 2'), pfFix: 5, seuilsFix: seuils('3/6/9/12'), armes: [],
  talents: 'Conduire un train 4+, Réparer un train 3, Empathie avec le train 5, Siffloter 2',
  notes: 'Ancien chauffeur de 241P : a évité une catastrophe en freinant à fond et s\'est ouvert le crâne. Dans le coma depuis, dans un sanatorium du sud de la France ; plus de soixante ans mais en paraît trente dans le rêve (uniforme des années soixante, casquette, tabac brun roulé). Calme, laconique sauf sur l\'épopée du rail. Sent sa fin approcher : longues périodes de mutisme, il laisse l\'entretien de la machine à Miguel.\nEmpathie avec le train : voir la table dans les notes du scénario. Pas de combat.',
});
const miguel = npc('miguel', {
  nom: 'Miguel', source: 'Ange de Blandine, grade 1 – mécanicien du train', type: 'ange', car: car('2 3 5 5 2 3'), def: 2,
  pp: 14, pfFix: 7, seuilsFix: seuils('5/10/15/20'),
  armes: [{ n: 'Énorme clé à molette', att: L(3), prec: -1, puis: 1, melee: true }],
  pouvoirs: pows('Aura de pacification 2, Sommeil 3, Rêve 2, Rêve divin 2, Charme 1'),
  talents: 'Technique 3 (mécanique 6), Combat 3, Discussion 4, Empathie avec le train 2, Histoire du chemin de fer 5 ; avertissement sans frais : accès de colère',
  notes: 'Ange espagnol en poste à Madrid qui dort la plupart du temps ; petit, osseux, teint cireux, salopette tachée de graisse, joue sans cesse avec sa clé à molette. Sympathique mais soupe au lait. Il voit bien que les PJ sont des démons mais les laisse tranquilles tant qu\'ils ne s\'en prennent ni au train ni à René, son seul ami. Peut les aider s\'ils respectent le convoi.\nPas de talent de défense : 2.',
});
const stewart = npc('stewart', {
  nom: 'Stewart', source: 'Rêve matérialisé – serveur biclassé contrôleur', type: 'humain', car: car('3 2 3 4 3 2'), def: L(4), pfFix: 7, seuilsFix: seuils('4/8/12/16'),
  armes: [arme('Pistolet de service', 'Revolver petit calibre', '4+'), poing(1)],
  talents: 'Aisance sociale 4, Discussion 3, Défense 4, Tir 4+, Empathie avec le train 5+, Être obséquieux 5',
  notes: 'Né avec la voiture de l\'Orient-Express, il n\'existe que tant que le train roule. Assure le service en cuisine pendant les trajets et contrôle les billets après chaque arrêt. Aimable et serviable, impitoyable avec les resquilleurs ; toute agression contre le train lui fait perdre son calme.\nArme non précisée par le livre (seulement Tir 4+) : pistolet retenu. Pas de PP.',
});
const fantasmes = npc('fantasmes', {
  nom: 'Fantasmes oniriques', source: 'Créatures de rêve (tueurs de film d\'espionnage, contrôleurs sadiques, Indiens, Thug…)', type: 'monstre', qty: 4,
  car: car('3 2 1 4 2 2'), def: L(4), pp: 10, pfFix: 7, seuilsFix: seuils('4/9/13/18'),
  armes: [{ n: 'Griffes', att: L(4), prec: 0, puis: 4, melee: true }],
  pouvoirs: pows('Peur 2, Membre exotique : griffes, Invisibilité 2'),
  talents: 'Divers (Combat, Séduction, etc.) 4, Défense 4',
  notes: 'Profil de base à adapter : trois pouvoirs au choix entre les niveaux 1 et 3 parmi Peur, Membre exotique (griffes), Corps gazeux, Invisibilité, Déphasage, Absorption de force. Remplacer les griffes par l\'arme du fantasme (pistolets des tueurs, garrot et dague du Thug, arcs des Indiens…).\nValeurs reprises du bestiaire (Fire and Ice 2, p. 96).',
});

// ---------------- PNJ : escalier et Purgatoire ----------------
const concierge = npc('concierge', {
  nom: 'Le Concierge', source: 'Entité non euclidienne – gardien de la cage d\'escalier des Marches intermédiaires', type: 'monstre', car: car('4 5 4 6 2 2'), def: L('6+'),
  pp: 34, pfFix: 10, seuilsFix: seuils('6/12/18/24'),
  armes: [{ n: 'Griffes', att: L(7), prec: 0, puis: 4, melee: true }],
  pouvoirs: pows('Arts martiaux 6, Esquive acrobatique 4, Membre exotique : griffes, Douleur 4, Peur 6, Régénération 4, Volonté supra-normale 6, Non-détection 6'),
  talents: 'Corps à corps 7, Défense 6+, Connaissance de l\'escalier 7, Nettoyer par terre 7. Téléportation 6 (uniquement dans la cage d\'escalier)',
  notes: 'Très mince, énormes moustaches brunes, jogging Adidas bleu flic élimé. Bourru, ne parle que pour signaler une infraction à un règlement obscur qui change sans arrêt. Si on le menace ou lui désobéit, il cogne, mais ne quitte jamais la cage d\'escalier.\nN\'intervient que si les PJ explorent l\'escalier ou salissent par terre. Griffes : valeurs estimées (précision 0, puissance +4, comme les autres griffes du volume). Téléportation laissée en talent car limitée à l\'escalier.',
});
const lazare = npc('lazare', {
  nom: 'Lazare', source: 'Patron et barman de L\'Entremonde', type: 'humain', car: car('4 4 4 4 4 3+'), def: L(5), pfFix: 8, seuilsFix: seuils('5/10/15/20'),
  armes: [arme('Batte sous le comptoir', 'Masse d\'arme ou batte', 5), poing(5)],
  talents: 'Discussion 5, Combat 5, Commerce 5, Défense 5, Tirer de la bière 5+',
  notes: 'Petit homme au teint mat d\'une quarantaine d\'années, barbe noire taillée en pointe, longs doigts fins, regard d\'une sagesse millénaire. Tient seul le seul bar du Purgatoire, jour et nuit, sans jamais se fatiguer ; peut embaucher les PJ comme serveurs. Bonne oreille, bons conseils, prêt à rendre service si on lui raconte toute l\'histoire (il en commente la portée métaphysique comme s\'il en savait plus). À la fin, il peut leur ouvrir une porte dérobée dans sa cave qui débouche… Chez Régis.\nSecret (rumeurs fiables) : il connaît bien Jésus, il est juif ; « jamais mort ». Arme non précisée par le livre : batte estimée. Pas de PP.',
});
const jack = npc('jack', {
  nom: 'Jack', source: 'Démon de Malphas, grade 3 – meneur caché de la grève', type: 'demon', car: car('2 2 3 5 4 5'), def: 2,
  pp: 28, pfFix: 7, seuilsFix: seuils('4/8/12/16'),
  pouvoirs: pows('Discorde 5, Charme 3, Lire les pensées 5, Détection du mensonge 4, Polymorphie 3'),
  talents: 'Discussion 6, Baratin 7, Séduction 4+, Prendre un air innocent 7+ ; avertissement sans frais : besoin de perversion',
  notes: 'Petit, maigre, nerveux, l\'air d\'avoir vingt ans. Malphas l\'a chargé, à la demande de Beleth, de semer le chaos : il a convaincu Henri de lancer la première grève de l\'histoire du Purgatoire. Mesquin jusque dans les détails (vérifie qu\'il n\'a pas la monnaie exacte chez sa boulangère). Sympa avec les PJ, mais nie tout d\'abord ; dès qu\'ils parlent de Beleth, il se range à leurs côtés (même patron).\nSe fait passer pour un théologien de la machine n° 11. Pas de talent de défense : 2.',
});
const henri = npc('henri', {
  nom: 'Henri', source: 'Âme humaine récemment décédée – leader des grévistes', type: 'humain', armes: [],
  notes: 'Grand vieillard maigre et chauve, élocution difficile, communiste, pas encore « ramolli » par le Purgatoire. Reste à son centre de dispatching (le n° 12 782 annexe) et fait la tournée des autres une heure par jour. Lui mettre la pression le fait parler de Jack.\nFiche minimale (pas de caractéristiques dans le livre).',
});
const securite = npc('securite', {
  nom: 'La Sécurité (soldats du Purgatoire)', source: 'Forces de maintien de l\'ordre en uniforme gris', type: 'soldat', qty: 6,
  car: car('4 4 4 2 2 2'), def: L(4), pp: 12, pfFix: 6, seuilsFix: seuils('5/10/15/20'),
  armes: [{ n: 'Tonfa béni mineur (non-létal)', att: L(4), prec: 2, puis: 3, melee: true }],
  pouvoirs: pows('Membre blindé, Armure corporelle 2, Décharge électrique 1+'),
  talents: 'Corps à corps 3, Combat 4, Défense 4, Marcher au pas 2+',
  notes: 'Peu d\'initiative mais obéissance absolue à l\'administration et inflexibilité totale. Unités anti-émeute déployées partout ; quand les PJ approchent de la piste de Nathalie, arrestations arbitraires et une vingtaine d\'hommes en armes devant le CRI.',
});
const nathalie = npc('nathalie', {
  nom: 'Nathalie Hémon', source: 'Âme d\'une morte – sibylle possédée par la meuf', type: 'humain', armes: [],
  notes: 'La jeune reine de beauté bretonne du scénario précédent. A fait un scandale à son arrivée (sa mort n\'était pas naturelle) : un dossier de contentieux a été envoyé au CRI. Séjourne dans la zone d\'attente 432. Méfiante (prend les PJ pour l\'administration) ; leur parle s\'ils promettent de l\'aider pour son cas.\nRévélations : la possession par la meuf, ses souvenirs (deux frères angéliques qui l\'aimaient, la jalousie, la haine) et la prophétie (trône vide, meute de loups qui se le disputent, rire d\'enfant, un homme qui ne veut plus être ; si le trône reste vide, fin du monde).\nFiche minimale.',
});
const jocelyne = npc('jocelyne', {
  nom: 'Jocelyne Rochot', source: 'Âme d\'une morte – autre incarnation de la meuf', type: 'humain', armes: [],
  notes: 'A prophétisé à qui voulait l\'entendre, cherchait quelqu\'un (une fille), a parlé de ses problèmes au patron de l\'Entremonde, puis a hurlé des visions de fin du monde un soir avant de disparaître. Piste secondaire : les rumeurs à son sujet sont surtout des fausses pistes.\nFiche minimale.',
});

// Le bestiaire joint (types réutilisables) : mêmes fiches, sans quantité
const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });

// ---------------- Scènes ----------------
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  scene('assaut', '1. Prologue : assaut sur le Centre de Tri', 'Paris, puis Centre de Tri – peu après minuit, orage',
    `Retour de Bretagne par le dernier train, vers minuit. À la descente, un vieux clochard aviné chuchote à l'oreille d'un PJ : « Il est là, il vous attend, c'est un cancer… les rues n'aiment pas les intrus, il n'existe pas de rue Lucifer ! », avant d'être embarqué par une patrouille Vigipirate. (Il n'y a évidemment pas de rue Lucifer sur les plans : graine pour le scénario suivant.)
Au Centre de Tri : deux camions de pompiers sur le parking, début d'incendie, une dizaine de démons de la Garde carmine mitraillent les fenêtres. Gilbert leur jette du mobilier par une baie vitrée. Situation désespérée : même avec les PJ, le Centre doit tomber.
Au bout de trois tours de combat, un énorme corbeau noir crache des flammes sur un Belial qui disparaît (« pouf ») ; un second plonge dans la mêlée, puis une coccinelle rouge se gare en trombe : Marie-Jolie (hache géante) et Leviathan (épée à deux mains) arrivent et retournent la situation. Avec les PJ, ils nettoient vite les survivants.
Ne placer que la Garde carmine en adversaires ; Gilbert, Marie-Jolie et Leviathan sont des alliés (scène suivante).`,
    [inScene(garde)], true),
  scene('revelation', '2. Beleth se dévoile', 'Perron et salle de pause du Centre de Tri – nuit',
    `Monsieur Fabien sort sur le perron, très calme. Marie-Jolie et Leviathan mettent genou à terre ; Leviathan le salue comme Beleth, prince des cauchemars. Deux voitures de police et une horde de flics armés débarquent : Beleth leur fait comprendre, façon Obi-Wan, qu'il ne s'est rien passé, puis tout le monde va à la machine à café.
Message de Baal (par Marie-Jolie, après un passage aux toilettes pour laver le sang) : le trône vacille (guerre Belial-Crocell, princes absents, défection de Satan). Baal propose une alliance pour restaurer l'unité : il met à disposition des soldats aguerris qui n'obéiront qu'aux PJ et au Centre, contre un soutien au Conseil pour une régence et contre un coup d'État. Il serait le père de l'enfant que porte Andrealphus, qu'il faut retrouver d'urgence.
Beleth demande aux PJ de raconter leur histoire : moment idéal pour leur faire récapituler la campagne (Belial et Crocell rivaux à cause d'une fille que Belial veut incarner, Andrealphus enceinte d'un être surpuissant, Satan lassé et recherché par son frère Gabriel, prophéties de fin du monde). Compléter avec ce que savent Beleth et les gens de Baal.
Le problème : les humaines qui portaient ces prophéties sont mortes. Contre toutes les règles, Beleth envoie les PJ discrètement au Purgatoire pour retrouver les sibylles défuntes, par une porte de service via la MRC. Consigne : discrétion totale, ne pas se frotter à l'administration du Purgatoire. Il les installe dans une remise et les endort d'un geste : « Cherchez la gare dans les limbes. »`,
    [inScene(fabien), inScene(gilbert), inScene(marieJolie), inScene(leviathan)]),
  scene('limbes', '3. Acte 1 : la gare dans les limbes', 'Centre de Tri onirique, RER A, station Limbes – MRC',
    `Réveil dans la MRC : PP et PF au maximum, blessures refermées. Beleth leur accorde Cauchemar mortel niveau 1 (+1 rang pour qui l'a déjà, si possible). Ils sont entrés dans le rêve par Beleth : +2 colonnes à toutes leurs actions. S'ils meurent dans la MRC, ils se réveillent simplement en sueur au Centre de Tri.
Le Centre de Tri onirique est désert et poussiéreux. La gare : RER A, juste après Marne-la-Vallée, la station « Limbes ». Dans la rame, une jeune femme très belle, balafrée, mi-mendiante gitane mi-mannequin, dépose un carton « Aidez-nous », refuse l'argent, reste muette et descend à l'arrêt suivant (écho de la meuf).
Station déserte en plein air dans la brume, à la lisière de la MRC ; correspondance vers la Grande Ceinture. Petite gare de province en briques. Neil attend sur le quai avec un gros chat : billets de première classe, une clé, des instructions (station Pâle, objets trouvés, porte grise, un étage plus bas, porte 000) et deux conseils (pas de bazar dans l'escalier, méfiance envers le mécano espagnol).`,
    [inScene(neil)]),
  scene('train', '4. Le Midnightmare Express', 'Train onirique entre Limbes et Pâle – environ six heures de trajet',
    `Locomotive à vapeur noire tirant un bric-à-brac de wagons de toutes époques nés des rêves et des catastrophes ferroviaires. Stewart contrôle les billets peu après le départ.
Trajet et arrêts : brume épaisse et îlots oniriques ; Duster (gare abandonnée criblée de balles, odeur de vanille, voyageurs à l'accent germanique qui ne montent pas) ; plaine cendrée, tunnels et ponts au-dessus de canyons ; Éther (simple panneau, puits de pétrole abandonné) ; plaine lisse et grise, enseignes au néon ; Nowhere (gare ultramoderne vide, Las Vegas fantôme) ; plaine d'ossements sous une bruine tiède ; arrivée à Pâle, gare de métal et de boulons.
Une vingtaine de rêveurs, plus des Ombres (silhouettes sans visage). Wagons et péripéties au choix :
• Locomotive 241P : René (chauffeur dans le coma) et Miguel (ange de Blandine, mécano). Aide possible s'ils respectent le train.
• Locomotive brisée (Austerlitz, 1990) : test d'Agilité facile pour y circuler en marche.
• Orient-Express (salon-restaurant) : repas qui se préparent seuls ; un rêveur façon 007 et sa blonde, poursuivis par des tueurs jusqu'au wagon-lit Pullman (fantasmes contre son flegme et son Walter PPK).
• Wagon-lit Pullman : Randolph Carter lutte pour ne pas retomber dans ses cauchemars lovecraftiens.
• Voitures de TGV : une femme enceinte accouche seule dans un cauchemar.
• Wagon de marchandises américain : solde confédérée gardée par une Calamity Jane onirique ; une dizaine d'Indiens à cheval attaquent entre Duster et Éther.
• TER : José, militant basque mort en tombant du train, attire des contrôleurs fantômes qui veulent le dévorer ; si on l'aide il suit les PJ, mais descend pâle à Nowhere.
• Autorail (Vierzy) : pouvoir Peur 3 dans les tunnels, qui a peur doit fuir la voiture.
• Voiture anglaise (Paddington, 1999) : Absorption de douleur 2 ; à 10 PP, Télékinésie 2 (mobilier projeté) jusqu'à épuisement ; un jeune Anglais qui se croit dans Incassable s'interpose avec ses 9 mm.
• Vieille voiture anglaise (Inde, 2002) : un Thug onirique remonte après Éther et massacre les Ombres une à une.
• Wagon à bestiaux : poules, vaches, chiens, tigre en cage qui peut s'échapper.
• Autre wagon à bestiaux (déportation) : vide, glacial ; deux sans-papiers maliens sans billet que Stewart enferme pour les livrer à des policiers fantasmatiques.`,
    [inScene(fantasmes), inScene(stewart)], true,
    [choice('clandestins', 'Que font les PJ pour les clandestins maliens ?', [
      ['Ils paient leurs billets', 'Stewart reste aimable ; les deux passagers échappent aux policiers oniriques.'],
      ['Ils affrontent Stewart', 'Combat contre un contrôleur que toute agression rend furieux ; risque de se mettre Miguel à dos si le train souffre.'],
      ['Ils ne font rien', 'Les Maliens sont débarqués à l\'arrêt suivant et traînés dans un commissariat onirique.'],
    ]),
    choice('jose', 'Les PJ aident-ils José, le passager du TER ?', [
      ['Oui', 'Reconnaissant, il les suit partout dans le train, terrifié de rester seul, jusqu\'à Nowhere.'],
      ['Non, ils le rabrouent', 'Les contrôleurs fantômes reviennent aussitôt : l\'épisode cauchemardesque recommence.'],
    ])]),
  scene('escalier', '5. Le Concierge est dans l\'escalier', 'Gare de Pâle, objets trouvés, cage d\'escalier des Marches intermédiaires',
    `Le bureau des objets trouvés est fermé à clé : forcer la porte. Grande salle poussiéreuse d'étagères : les PJ peuvent y retrouver des objets perdus lors des scénarios précédents et, au gré du MJ, un coffret capitonné de velours rouge, vide, fait pour une grande épée (celle de Gabriel, à retrouver plus tard).
La clé de Neil ouvre la petite porte grise sur une cage d'escalier bien tenue, qui relie les Marches intermédiaires du Paradis à l'Enfer. Descendre vite et sans faire les malins : rien ne se passe. Explorer ou salir par terre fait surgir le Concierge, qui ne les lâchera pas tant qu'ils restent là.
Un étage plus bas, deux portes : « 000 » (le Purgatoire) et « V41 », qui ressort d'un placard à balais de la gare de King's Cross St Pancras à Londres.
Passage : sensation de traverser de la mélasse ; les PJ entrent au Purgatoire sous forme de simples rêves. Signature énergétique illisible : impossible d'invoquer leurs supérieurs. Tués au Purgatoire, ils se réveillent au Centre de Tri en perdant 1d6 points de Volonté (récupération : 1 par semaine ; à 0, coma jusqu'au retour à 1).`,
    [inScene(concierge)], true,
    [choice('porte', 'Quelle porte les PJ empruntent-ils ?', [
      ['La porte 000', 'Ils arrivent au Purgatoire (acte 2).'],
      ['La porte V41', 'Ils ressortent d\'un placard à balais à King\'s Cross St Pancras, Londres : il faut retrouver le chemin (et Beleth ne sera pas ravi).'],
    ])]),
  scene('purgatoire', '6. Acte 2 : le grand nulle part en grève', 'Purgatoire – grand flou gris sous la bruine',
    `Contexte MJ : Marche intermédiaire immense entre Paradis et Enfer, transformée par Yves (avec Kronos) en drain magique à âmes autour d'un puits temporel. Les morts y arrivent nus, on leur colle une toge grise. Rien à visiter : du gris, une bruine d'octobre breton, des files d'attente et des tickets. La durée du jugement est inversement proportionnelle à la gravité absolue des péchés ; les machines de transmigration sont réglées par des équipes d'anges et de démons qui se disputent l'interprétation des dogmes. La neutralité du lieu ramollit tout le monde : jamais de révolte… jusqu'à maintenant.
Pour aider les PJ, Beleth a demandé une faveur à Malphas, qui a envoyé Jack : il a poussé Henri, un vieux mort pas encore ramolli, à lancer la première grève de l'histoire de la Marche. Une vingtaine de centres de dispatching et d'administrations sont à l'arrêt, les toges ne sont plus distribuées, les nouveaux venus sont parqués dans des préfabriqués, piquets de grève, tracts, unités anti-émeute partout.
Les PJ passent inaperçus dans ce chaos, mais l'administration ne leur répondra pas. Ils ne connaissent que deux noms (Nathalie Hémon, Jocelyne Rochot) parmi des dizaines de milliards d'âmes : il faut faire la tournée du bar.`,
    [inScene(henri)]),
  scene('entremonde', '7. Brèves de comptoir à L\'Entremonde', 'L\'Entremonde, seul bar du Purgatoire (licence IV) – au centre de la Marche',
    `Petit troquet façon bistrot parisien qui rappelle Chez Régis, terrasse à perte de vue, boissons du monde entier. Lazare le tient seul, sans jamais se fatiguer ; il peut embaucher les PJ comme serveurs (en les scrutant d'un regard un peu trop perçant).
Rumeurs (fiabilité : 0 faux, 1 mi-vrai, 2 fiable ; à jouer en roleplay avec des âmes pittoresques ; si les PJ sont trop insistants, des anges ou démons s'intéressent à eux) :
La grève : partie du centre de dispatching annexe n° 12 782 (2) ; un coup des rouges (1 : Henri est communiste, Jack un démon) ; le leader s'appelle Henri (2) ; un type a refusé d'aller en Enfer (0) ; Henri reste à son centre (1 : il fait aussi une tournée d'une heure par jour) ; un démon derrière tout ça (2) ; Henri est un démon (0) ; le meneur a parlé avec un petit nerveux de l'administration (2) ; un certain Jack a discuté des revendications (1 : il est allé voir son pote Henri) ; coup monté des anges (0) ; revendications acceptées (0) ; les grévistes veulent autogérer le Purgatoire (1) ; ils demandent des attentes plus courtes et l'accès à leur dossier (2) ; une équipe d'anges et de démons négocie (2) ; les anges sont prêts à charger (2).
Jack : démon (2) ; théologien à la machine n° 12 (1 : c'est la n° 11) ; archange infiltré (0) ; traîne avec les grévistes (1) ; vrai fouteur de merde (2).
L'Entremonde : construit sur le centre du Purgatoire (2) ; micros partout (0) ; des hindous y conspirent (2) ; Jésus y a bu une Corona (1 : pas de bière de fillette) ; archanges et princes passent parfois (2) ; le bar existe partout dans l'Univers (1) ; l'Univers a été créé ici (0) ; tous les secrets du monde sont sous le bar (2) ; rafle prévue (1) ; les boissons rendent mou (0) ; le patron cache des gens qui refusent d'être jugés (1).
Le patron : espion (0) ; connaît bien Jésus (2) ; ange (0) ; jamais mort (1) ; entrées dans l'administration (0) ; connaît tous les secrets (1) ; juif (2) ; toujours prêt à rendre service (2) ; chef secret des grévistes (0).
Nathalie Hémon : jolie fille paumée (2) ; au Paradis depuis longtemps (0) ; gréviste (1) ; scandale à l'administration à son arrivée (2) ; travaille au 3e bureau des files de patience (0) ; l'administration a un dossier sur elle car elle dérange (1).
Jocelyne Rochot : en Enfer direct (0) ; cherchait quelqu'un, une fille (2) ; vit près du 121e centre de contrôle des arrivants (0) ; poursuivie par un ange amoureux (0) ; a parlé au patron (1 : elle a commandé un verre) ; a hurlé la fin du monde un soir puis est partie (2).
La guerre infernale : Yves est Dieu (0) ; deux princes se battent pour une fille connue avant le Schisme (2) ; les anges vont envahir l'Enfer, Apocalypse (0) ; tout est la faute de Malphas (1).`,
    [inScene(lazare), inScene(jack)]),
  scene('cri', '8. Ce n\'est qu\'un début, continuons le combat', 'Centre de recoupement des informations (CRI) du Purgatoire',
    `Seule vraie piste : la plainte de Nathalie. L'employé qui a rempli son dossier de contentieux s'en souvient ; le dossier est parti au CRI, administration qui gère plaintes et inspections… entourée d'un piquet de grève.
Dès que les PJ s'approchent de la piste, la grève se durcit : négociations rompues, arrestations arbitraires, quadrillage militaire ; une vingtaine d'hommes de la Sécurité dégagent les piquets et s'installent devant le CRI.
Pour atteindre le dossier, il faut une issue au mouvement. Faire pression sur Henri le fait parler de Jack (ou trouver sa trace par les rumeurs). Jack nie tout, puis demande pourquoi ça les intéresse ; s'ils parlent de Beleth, il se range de leur côté. Deux options :
• Arrêter la grève : Jack sème la discorde chez les grévistes, mais il faut attendre que tout reprenne pour consulter les dossiers du CRI.
• Fomenter une émeute contre le CRI : action commando à l'intérieur pendant que les grévistes saccagent et se barricadent et que la Sécurité matraque tout le monde. Les humains redeviennent vite mous, le rapport de force fait céder l'administration, qui lance quelques réformes prudentes vite oubliées.`,
    [inScene(securite)], true,
    [choice('greve', 'Comment les PJ débloquent-ils l\'accès au dossier de Nathalie ?', [
      ['Ils font cesser la grève avec Jack', 'Jack divise les grévistes ; après un temps d\'attente, retour à la normale et consultation tranquille des dossiers du CRI.'],
      ['Ils lancent une émeute contre le CRI', 'Action commando au milieu du saccage, face à la Sécurité ; l\'administration cède et promet des réformes vite oubliées.'],
    ])]),
  scene('prophetie', '9. Dark visions from the dead ones', 'Zone d\'attente 432 du Purgatoire',
    `Le dossier localise Nathalie dans la zone d'attente 432. Méfiante, elle prend les PJ pour des fonctionnaires ; s'ils promettent de l'aider pour son cas (promesse creuse), elle parle.
Son récit, en substance : des flashs d'un pays lointain, une jeune fille se baignant dans une rivière qu'elle était en même temps ; un ange grand, fort et fier qui l'a emmenée, des « sorciers » venus libérer son peuple de la peur ; il l'a confiée à son frère, plus doux, qui est tombé amoureux d'elle ; la colère et la haine entre les deux frères ; puis ils sont partis. Celui qui l'appelle aujourd'hui par-delà la mort veut en faire sa promise et régner avec elle, mais « ça n'a pas marché ». Ensuite, prisonnière dans un coin de sa tête, elle hurlait ses visions : la neige en flammes, un trône vide, une meute de loups qui se le disputent, du sang, un rire d'enfant, un homme qui ne veut plus du trône ni plus rien être ; si le trône reste vide, le monde s'arrête, explose, se fige : c'est la fin du monde.
(Pour le MJ : la meuf, amour d'avant le Schisme des deux frères Belial et Crocell ; Belial tente de l'incarner ; Satan ne veut plus du trône.)`,
    [inScene(nathalie), inScene(jocelyne)]),
  scene('retour', '10. Retour et débriefing', 'L\'Entremonde ou réveil au Centre de Tri – puis un Centre de Tri ravagé',
    `La porte d'entrée s'est refermée définitivement. Deux solutions : mourir et se réveiller au Centre de Tri (perte de 1d6 Volonté), ou demander un coup de main à Lazare, qui leur ouvre une porte dérobée dans sa cave… donnant sur Chez Régis.
Débriefing dans un Centre de Tri ravagé : Beleth les remercie (+2 niveaux dans le pouvoir de grade Cauchemars et +1 PP). Il conclut qu'une chose devient urgente : retrouver Satan.`,
    [inScene(fabien), inScene(gilbert)], false,
    [choice('sortie', 'Comment les PJ quittent-ils le Purgatoire ?', [
      ['Lazare leur ouvre la porte de sa cave', 'Ils ressortent Chez Régis, sans perte.'],
      ['Ils se font tuer pour se réveiller', 'Réveil au Centre de Tri avec 1d6 points de Volonté en moins (1 point regagné par semaine ; coma à 0).'],
    ])]),
];

const scenario = {
  id: 'fire-and-ice-14-interzone',
  nom: 'Fire and Ice (scénario 14) – Interzone',
  resume: `Dies Irae, scénario 14 (INS). De retour de Bretagne, les PJ trouvent le Centre de Tri assiégé par la Garde carmine ; Marie-Jolie et Leviathan, envoyés par Baal, renversent la situation et Monsieur Fabien se révèle être Beleth. Les sibylles qui annonçaient la fin du monde étant mortes, le prince des cauchemars envoie les démons au Purgatoire par la MRC : train onirique, cage d'escalier gardée par le Concierge, puis un Purgatoire paralysé par une grève fomentée par un démon de Malphas. Il faut écumer les rumeurs de L'Entremonde, débloquer l'accès au dossier de Nathalie Hémon et entendre sa prophétie du trône vide.`,
  notes: `Source : ${REF}. Chronologie : Tempus Fugit, p. 153-154.
Scénario d'exploration et d'ambiance qui brise les règles habituelles d'INS (visite du Purgatoire), enchaîné juste après « La stratégie du pourtour ». Déroulement : assaut du CdT → révélation de Beleth → gare des Limbes → train onirique → cage d'escalier → Purgatoire en grève → rumeurs de L'Entremonde → CRI → prophétie de Nathalie → retour.

Règles spéciales :
• Dans la MRC : PP et PF restaurés, Cauchemar mortel 1 offert par Beleth, +2 colonnes à toutes les actions (entrés par le prince) ; mort = réveil au Centre de Tri.
• Au Purgatoire : PJ sous forme de rêves, signature illisible, invocation des supérieurs impossible ; mort = réveil au CdT avec −1d6 Volonté (+1 par semaine ; coma à 0).

Récompenses : Beleth accorde +2 niveaux dans le pouvoir de grade Cauchemars et +1 PP.

Talent « Empathie avec le train » (talent-pouvoir développé dans les trains oniriques, sur Perception, sans coût en PP ; ne fonctionne que dans les trains). Pouvoirs obtenus selon le niveau :
• 1 ou 1+ : Caméléon 1, Détection des ennemis 1
• 2 ou 2+ : Vitesse 1, Caméléon 1, Détection des ennemis 1
• 3 ou 3+ : Vitesse 1, Caméléon 2, Détection des ennemis 1
• 4 ou 4+ : Vitesse 2, Caméléon 3, Paralysie 1, Télékinésie 1, Détection des ennemis 2
• 5 ou 5+ : Vitesse 2, Caméléon 4, Téléportation 1, Paralysie 3, Télékinésie 1, Détection des ennemis 3
• 6 et + : Vitesse 3, Caméléon 5, Téléportation 2, Paralysie 5, Télékinésie 3, Détection des ennemis 4
Effets : Vitesse (se faufiler entre banquettes et valises, hors combat) ; Caméléon (camouflage, habillé) ; Téléportation (le wagon avale et recrache plus loin) ; Paralysie (portes bloquées, ensevelissement sous les bagages) ; Télékinésie (valises, tapis, jets d'eau bouillante) ; Détection des ennemis (savoir quand et dans quelle voiture on attaque le train).

Chronologie (Tempus Fugit) : J−1 Malphas, via Jack, déclenche la grève au Purgatoire. J1 arrivée à Paris peu après minuit, attaque du CdT par la Garde carmine, intervention de Marie-Jolie et Leviathan, Fabien révèle son identité et envoie les PJ au Purgatoire par la MRC ; train onirique jusqu'à Pâle, cage d'escalier, Purgatoire ; enquête à L'Entremonde, contact avec Jack, consultation du dossier de Nathalie Hémon ; entrevue avec la morte et sa prophétie. J2 retour sur Terre et débriefing dans un CdT ravagé.
Suite : « De l'œuvre d'art à l'époque de sa reproductibilité technique » (la rue Lucifer annoncée par le clochard du prologue ; retrouver Satan).

Fiches adaptées du livre : caractéristiques en niveaux INS/MV (Ch des humains reportée en Foi). Monsieur Fabien et Gilbert : fiches de référence du Centre de Tri. Garde carmine : fiche de « Run like Hell ». Valeurs estimées signalées dans chaque fiche.`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [garde, fabien, gilbert, marieJolie, leviathan, neil, rene, miguel, stewart, fantasmes, concierge, lazare, jack, henri, securite, nathalie, jocelyne].map(asType);

// Contrôle : pouvoirs inconnus des règles
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));

writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types,', scenes.reduce((a, s) => a + s.choix.length, 0), 'choix');
