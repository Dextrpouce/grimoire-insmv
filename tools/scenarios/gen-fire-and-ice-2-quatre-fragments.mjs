// Génère le fichier d'import « insmv-scenario » pour « Quatre fragments d'une chronologie du hasard » (Fire and Ice, p. 43-55)
// usage : node gen-quatre-fragments.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Fire and Ice, « Quatre fragments d\'une chronologie du hasard », p. 43-55';
const L = (s) => R.parseLvl(String(s)); // « 2+ » → 5
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
let n = 0; const id = (p) => `fi2-${p}`;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [{ n: 'Coup de poing', att: 2, prec: 0, puis: -3, melee: true }], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});
const poing = (lvl) => ({ n: 'Coup de poing', att: L(lvl), prec: 0, puis: -3, melee: true });

// ---------------- PNJ ----------------
const sechepine = npc('sechepine', {
  nom: 'Conrad Sechepine', source: 'Démon de Kobal, grade 2 (en préretraite)', type: 'demon', car: car('2 3 4 4 2 4'), def: L('3+'),
  pp: 21, pfFix: 6, seuilsFix: seuils('4/8/12/16'),
  armes: [poing('4+')],
  pouvoirs: pows('Gag absurde 4, Cauchemar 2, Invisibilité 2, Sommeil 2, Polymorphie 2, Vol 3'),
  talents: 'Corps à corps 4+, Défense 3+, Technique 2 (électronique 4), Calembours foireux poil aux pneus 3, Deviens toi aussi un petit espion en seulement trois leçons 3',
  notes: 'Quadragénaire aux cheveux noirs ternes, barbe mal taillée, énormes lunettes bricolées hérissées de fils, toujours en peignoir éponge. Appartement-Q.G. d\'espionnage années 50 dans une barre HLM près de la place d\'Italie.\nStar démoniaque parisienne des années 70, mis au placard par Kobal après une mission ratée pour Scox (capturé par des Rastas de Novalis, grosse perte de PA). Ne sort plus de chez lui depuis dix-huit ans.\nOdieux sous ses airs farfelus : méprise les « petits jeunes », ne supporte que ses propres blagues, fait d\'abord faire le ménage et les courses aux PJ. Imprévisible ; très efficace sous stress, insupportable au repos. Avertissement sans frais : paranoïaque.\nArme : à mains nues (Corps à corps 4+).',
});
const roumaines = npc('roumaines', {
  nom: 'Les trois Roumaines', source: 'Mendiantes du quartier (suspectes de Sechepine)', qty: 3, car: car('1 2 2 2 1 2'), def: 2,
  talents: 'Mendicité agressive, vol à la roulotte, faire semblant de ne pas comprendre le français',
  notes: 'Une vieille gitane édentée et deux jeunes filles, sans papiers, exploitées par un chef de famille mafieux qui garde leurs papiers. Pas des anges ni des soldats de Dieu : la vieille est négative à Détection du Mal et tomberait d\'une seule claque.\nCaractéristiques non fournies par le livre : valeurs estimées (humaines faibles).',
});
const poniatowsky = npc('poniatowsky', {
  nom: 'Jean-Daniel Poniatowsky', source: 'Démon de Scox, grade 2 (psychiatre médiatique)', type: 'demon',
  notes: 'Psychiatre de plateau télé sous un nom d\'emprunt (caution intellectuelle des reportages sur les « décérébrés à la mode »). Incarné depuis deux ans ; trouve que la famille de son corps d\'accueil l\'entrave et demande à l\'équipe de la faire disparaître pendant qu\'il est loin de Paris. Fournit renseignements et clés.\nAprès la mission : invite les PJ au restaurant, jovial, mais hanté chaque nuit par le plus jeune enfant.\nCaractéristiques non fournies par le livre (fiche minimale).',
});
const famille = npc('famille', {
  nom: 'Famille Poniatowsky', source: 'Françoise (37 ans), Muriel (8), Clotilde (6), Benjamin (3)', qty: 4, car: car('1 1 2 2 2 2'), def: 2, armes: [],
  notes: 'Gentille famille bourgeoise centriste, pavillon de Neuilly, deux vieux labradors. Humains ordinaires sans pouvoir ni capacité de résistance : ne pas les rendre antipathiques.\nCaractéristiques non fournies : valeurs estimées (Françoise ; les enfants sont encore plus fragiles).',
});
const deprofundis = npc('deprofundis', {
  nom: 'Deprofundis', source: 'Démon de Gaziel, grade 3', type: 'demon', car: car('6 3 2 5 2 5'), def: L('4+'),
  pp: 28, pfFix: 11, seuilsFix: seuils('8/16/24/32'),
  armes: [{ n: 'Violoncelle maudit mineur (non-létal)', att: L('4+'), prec: -1, puis: 4, melee: true }],
  pouvoirs: pows('Séisme 5, Armure corporelle 4, Corps gazeux, Couche de glace 2, Détection du danger 2, Peur 2, Vitesse 1, Anaérobiose, Jeûne, Immunité contre les maladies et les poisons'),
  talents: 'Combat 2+ (armes improvisées 4+), Défense 4+, Savoir militaire 2 (tactique 4), Hobby (violoncelle) 4, Jeu 4',
  notes: 'Incarné en 1886 dans un garçon boucher : petit, carré, très musclé, peau grisâtre, cheveux éclaircis. Habits d\'époque pour les visiteurs (sinon nu), accent de titi parisien.\nVit depuis des décennies dans les profondeurs sous Paris avec trois zombies cultivés ; mission permanente : provoquer de petits séismes sous la capitale (banalisés depuis que les anges ont fourni des sismographes). Naïf, chaleureux, ravi des visites ; aidera volontiers plus tard s\'il n\'a pas à quitter ses sous-sols.\nAvertissement sans frais : naïveté. Avantage matériel : zombies. Violoncelle : attaque au talent Combat (armes improvisées 4+).',
});
const zombiesDep = npc('zombies-deprofundis', {
  nom: 'Zombies de Deprofundis', source: 'Compagnons morts-vivants de Deprofundis', type: 'mortvivant', qty: 3,
  car: car('3 2 2 3 1 2'), def: 2, pp: 4,
  armes: [poing(2)],
  pouvoirs: pows('Anaérobiose, Jeûne, Immunité contre les maladies et les poisons'),
  talents: 'Russe (Dostoïevski dans le texte) 3, Musique (un instrument chacun) 3',
  notes: 'Un siècle de vie commune avec Deprofundis leur a donné un QI remarquable : citent Dostoïevski en russe, jouent chacun d\'un instrument, accent parisien à couper au couteau. L\'un d\'eux garde l\'accès au repaire et fait gronder la galerie si les intrus ne se présentent pas.\nCaractéristiques non fournies par le livre : valeurs estimées de mort-vivant ordinaire.',
});
const marins = npc('marins', {
  nom: 'Marins lituaniens (Alojzy, Ludwig, Jaroslaw, Wojciech…)', source: 'Équipage du Bijelo Dugme, matons pour la Rose', qty: 8,
  car: car('3 2 2 1 1 2'), def: L(2), pfFix: 4, seuilsFix: seuils('4/8/12/16'),
  armes: [{ n: 'Makarov 9 mm', att: L(2), prec: -2, puis: 3, melee: false }, { n: 'Uzi (deux marins seulement)', att: L(2), prec: -2, puis: 4, melee: false }, poing(3)],
  talents: 'Monter la garde 3, Corps à corps 3, Tir 2, Défense 2',
  notes: 'Une petite dizaine, du mousse à peine majeur au vieux briscard ex-sous-marinier de l\'Armée rouge. Alcool fort, échecs, bagarres. Déprimés après quatre mois au mouillage : sautent sur la moindre occasion de cogner ; les plus sobres hésitent face à une opposition trop forte et se doutent que leurs patrons ne sont pas des indépendantistes basques. Un canot va en ville tous les deux jours (quatre marins) : persuadés (le surnaturel visible l\'est toujours), ils parlent de « Mister H. » et peuvent fournir un plan grossier.\nMakarov : revolver petit calibre (R.ARMES) ; Uzi : pistolet-mitrailleur.',
});
const sorcier = (key, nom, armes, notes) => npc(key, {
  nom, source: 'Sorcier de la Rose (geôlier du Bijelo Dugme)', type: 'humain', car: car('1 1 2 4 1 2+'), def: L(2),
  pfFix: 5, seuilsFix: seuils('2/4/6/8'), armes,
  talents: 'Tir 3, Combat 2, Défense 2, Haute sorcellerie 4, Demande à un démon 5, Demande à un ange 5, Contrôle d\'un démon 4, Basse sorcellerie 3. Sorts : Protection, Vrai nom, Lecture d\'aura',
  notes: notes + '\nFiche commune aux quatre sorciers dans le livre. Sorts notés dans les talents (pas des pouvoirs).',
});
const barbara = sorcier('barbara', 'Barbara', [{ n: 'Couteau de cuisine', att: L(2), prec: 0, puis: 0, melee: true }],
  'Bourgeoise anglaise, robe rosâtre, chapeau ridicule, maquillée à outrance, fragile comme une porcelaine. Experte pour jouer les victimes et pousser des cris de souris. Couteau de cuisine (poignard de R.ARMES).');
const sven = sorcier('sven', 'Sven', [{ n: 'Grenade défensive (×3)', att: L(3), prec: -4, puis: 4, melee: false }, poing(1)],
  'Petit Hollandais au visage sadique, yeux fous, gestes nerveux, se frotte les mains et ricane. Contrôle les deux démons de Caym (Fish et Chips) et leur parle en néerlandais. Trois grenades défensives (jet au talent Tir : estimation).');
const ulrike = sorcier('ulrike', 'Ulrike', [{ n: 'Kalachnikov « Titine »', att: L(3), prec: -2, puis: 5, melee: false }, poing(1)],
  'Jeune Allemande très grande, cheveux roux mi-longs, se met en retrait et se déprécie pour paraître faible. Moins bonne sorcière, mais la plus dangereuse au combat. Vieille Kalachnikov rouillée (fusil-mitrailleur de R.ARMES).');
const thomson = sorcier('thomson', 'Thomson', [{ n: 'Canne à pommeau', att: L(2), prec: 0, puis: 1, melee: true }],
  'Vieux sorcier de famille : costard noir, tête de corbeau, canne à pommeau. Chef officiel, le plus savant et le moins impressionnable ; négocie âprement chaque renseignement (préfère mourir que trahir… mais préfère vivre que mourir). Sait que Mister H. est Hornet. Canne : matraque de R.ARMES (estimation).');
const fishChips = npc('fish-chips', {
  nom: 'Fish et Chips', source: 'Démons de Caym, grade 1 – liés par les sorciers', type: 'demon', qty: 2, car: car('4 4 3 2 1 3'), def: L('4+'),
  pp: 11, pfFix: 6, seuilsFix: seuils('6/12/18/24'),
  armes: [{ n: 'Morsure (forme de requin)', att: L('4+'), prec: 3, puis: 1, melee: true }],
  pouvoirs: pows('Transformation 3, Poison 1, Membre exotique : crocs, Vitesse 1, Anaérobiose'),
  talents: 'Corps à corps 4+, Athlétisme 3, Défense 4+',
  notes: 'Contrôlés par Sven, ils rôdent autour de la coque en requins blancs et suivent les embarcations qui approchent. Ne peuvent pas garder la forme en permanence : en cas d\'attaque, 1d6 → 1-3 les deux en mer, 4-5 un seul requin, 6 tous deux dans leur cabine à récupérer leurs PP. Reviennent à toute vitesse au rappel de leur sorcier.\nLe livre indique « Membre exotique (dents) » : rendu par Membre exotique : crocs (précision +3, puissance +1).',
});
const tomo = npc('tomo', {
  nom: 'Tomo, Tommy, Lobo et Lobby', source: 'Zombies spéciaux issus du Gothic Horror (fournis par Hornet et Bifrons)', type: 'mortvivant', qty: 4,
  car: car('4 3 3 2 1 2'), def: L(2), pp: 6, pfFix: 6, seuilsFix: seuils('5/11/16/22'),
  armes: [{ n: 'Hachoir maudit mineur (inadapté à la parade)', att: L(3), prec: 0, puis: 4, melee: true }, { n: 'Griffes', att: L(4), prec: 0, puis: 4, melee: true }, { n: 'Crocs', att: L(4), prec: 3, puis: 1, melee: true }],
  pouvoirs: pows('Membre exotique : griffes, Membre exotique : crocs, Régénération 2'),
  talents: 'Corps à corps 4, Combat 3, Athlétisme 2, Défense 2',
  notes: 'Grands, costauds, très laids, un peu pourris (vermisseaux dans le nez), peu bavards ; tenues de sport, deux portent des hauts-de-forme. Parqués dans des cabines loin des marins : arrivent 3 ou 4 tours après le début de la baston.\nHachoir au talent Combat ; griffes et crocs au Corps à corps. « Membre exotique (dents) » du livre rendu par Membre exotique : crocs.',
});
const heterodosk = npc('heterodosk', {
  nom: 'Heterodosk', source: 'Démon de Malphas, grade 0 (prisonnier)', type: 'demon', car: car('2 3 3 4 3 2'), def: L(3),
  pp: 9, pfFix: 6, seuilsFix: seuils('4/8/12/16'),
  armes: [poing(2)],
  pouvoirs: pows('Discorde 2, Polymorphie 1, Lire les pensées 1'),
  talents: 'Baratin 3, Défense 3, Corps à corps 2',
  notes: 'Incarné dans une jeune fille frêle et presque diaphane. Seul prisonnier à avoir résisté au contrôle : joue la comédie, profil bas. Auteur de la lettre au Centre de Tri.\nLibéré avant la fin du combat, il sème la zizanie entre les sorciers grâce à Discorde. Ensuite, il demande aux PJ de le tuer (retour en Enfer) ainsi que ses trois compagnons.',
});
const traumatises = [
  ['kisskool', 'Kisskool', 'Démon de Haagenti (prisonnier traumatisé)', 'demon', 'Incarné dans un petit garçon. Ne dit plus qu\'un mot, « maison », sur tous les tons et dans toutes les langues ; se balance et bave.'],
  ['brad', 'Brad', 'Ange de Janus (prisonnier traumatisé)', 'ange', 'Incarné dans une vieille dame. Débite d\'une voix monocorde des phrases sans queue ni tête.'],
  ['lumpen', 'Lumpen', 'Ange de Marc (prisonnier traumatisé)', 'ange', 'Incarné dans un ado néogothique. Paraît lucide jusqu\'à ce qu\'il hurle et frappe le sol de ses poings en invoquant Dieu.'],
].map(([k, nom, source, type, notes]) => npc(k, {
  nom, source, type, armes: [],
  notes: notes + '\nContrôlé brutalement par les sorciers, traumatisé même après leur mort ; aucune animosité envers les autres prisonniers. Caractéristiques volontairement non fournies : trop à la masse pour combattre (fiche minimale).',
}));

// Le bestiaire joint (types réutilisables) : mêmes fiches, sans quantité
const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });

// ---------------- Scènes ----------------
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  scene('beleth', '0. En coulisses : Beleth et la Bête', 'Marche des rêves – pendant tout le scénario',
    `Secret MJ, à ne pas révéler aux joueurs.
Prologue (château, phase B) : le docteur Theobaldy, sorcier, a orchestré des semaines d'invocations pour « Monsieur H. » (Hornet) et « Monsieur B. » (Bifrons) ; la phase suivante consiste à évacuer les séides et effacer toute trace, hommes de main compris. Bifrons massacre tout le monde, Theobaldy inclus. Ce sont ces séides qu'on retrouve au scénario « Boum boum boum boum ».

Yolande était Andréalphus ; dans son ventre grandit Damien, rejeton deux fois démoniaque. Elle se terre dans un hôtel de banlieue sordide à dévorer des steaks. Damien rêve, erre dans la Marche et rencontre Beleth : longue discussion qui fait basculer le Grand Jeu. Beleth part ensuite à la recherche des PJ, que Damien a vus par les yeux d'Andréalphus.

Effet en jeu : pendant les missions de ce scénario, à chaque nuit de sommeil, test de Volonté facile pour chaque démon. Ceux qui s'en souviennent notent qu'un personnage de leur rêve (Zozo le lapin marrant, Torghul, Marcel le serveur de La Tour d'argent…) signale un type qui les cherche. RU ≥ 6 : description vague (grand gars sinistre, deux grandes ailes noires).
Un démon de Beleth dans le groupe n'est pas concerné. Beleth retrouve les PJ assez vite ; suite au chapitre suivant.`),
  scene('affectation', '1. Baby-sitting blues : l\'équipe d\'intervention', 'Centre de Tri, Paris – dix jours après l\'affaire Izmet',
    `Aurélie convoque les PJ pour le lendemain : ils deviennent « l'équipe d'intervention », chargée des Missions d'Intervention (une sorte de SAV démoniaque : les démons affiliés au Centre y envoient leurs demandes).
• Horaires : 8 h-14 h, du lundi au vendredi (hors jours fériés), jusqu'à épuisement de la pile ; l'après-midi reste libre pour les couvertures.
• Accès à la salle de pause, soutien amical des démons du Centre ; Gilbert est très attentif et peut donner un coup de main musclé.
• Quatre dossiers (pochettes avec la lettre du demandeur et un mot de Monsieur Fabien), sans date butoir.

Scénario d'interlude : missions courtes, à étoffer à volonté (le Centre de Tri peut fournir d'autres dossiers). But : faire oublier la disparition d'Izmet pendant que la campagne se met en place.`),
  scene('sechepine', '2. Burlesque de boulevard : Conrad Sechepine', 'HLM près de la place d\'Italie, puis le quartier',
    `Dossier 1 : lettre truffée de « poil au… » de Conrad Sechepine, vieux gradé de Kobal mis au placard depuis vingt ans. Monsieur Fabien : rester poli, inutile de le croire.
L'appartement : Q.G. d'espionnage années 50 (longues-vues à chaque fenêtre, magnétophones à bandes, TSF dans la salle de bain, câbles et micros chromés, tableau noir couvert de plans), odeur de moisi. Sechepine ouvre en peignoir, salut militaire. Il exige d'abord ménage (frigo de produits périmés) et courses au Lidl ; s'ils refusent, il boude quelques heures.
Ses trois « enquêtes de voisinage » :
• Le boucher-charcutier Benjamin Sachs serait un chef de guerre viking (photos floues au téléobjectif, « viande d'élan séchée »). Faux : simple humain, l'homme sur la photo est Justin Topère, instituteur gaucho ; Sachs n'a jamais mis les pieds en Scandinavie et va à la messe à Noël et à Pâques.
• Les trois Roumaines qui mendient : la vieille serait un ange de Dominique, les jeunes des soldats de Dieu (signe de croix, « Que justice soit faite ! » à un policier). Difficiles à interroger (sans papiers, exploitées par un chef mafieux, feignent de ne pas comprendre). Faux : la vieille est négative à Détection du Mal.
• Le voisin du dessus : voir scène suivante.`,
    [inScene(sechepine), inScene(roumaines)]),
  scene('leminor', '3. Barnabé is back : le voisin du cinquième', 'Appartement de Gabriel Leminor, cinquième étage',
    `Sechepine jure que son voisin Gabriel Leminor, emménagé comme chercheur d'emploi, est un ange de Laurent : il l'a vu sortir avec un objet long et rigide sous son manteau (une épée !) et a senti une aura hostile. Pas revu depuis trois semaines.
Sur le palier : test de Perception difficile pour entendre plusieurs voix ; MR ≥ 6 : elles parlent arabe. Dès qu'on sonne ou qu'on entre de force, silence : l'appartement est vide.
Fouille : aucune cachette possible ; départ depuis un moment (armoire presque vide, frigo vide, ordinateur débranché). Tapis de prière, Coran en arabe, photomatons (trentenaire aux cheveux très blonds en queue de cheval, yeux gris très clair, teint hâlé, sourire crispé), photocopies de passeports et calques de tampons (faux papiers). Disque dur effacé il y a trois semaines, mais l'historique du navigateur montre des sites arabo-musulmans, la SNCF et un site de cartes routières.
Sechepine, blasé, réclame un rapport circonstancié et propose aux PJ de loger chez lui pour l'aider.

Vérité MJ : pour une fois, Sechepine a raison. Leminor est l'archange Gabriel en personne, revenu en France depuis un an et demi pour retrouver son frère déchu, avec son épée de feu. Il a quitté Paris depuis plusieurs semaines et laissé trois djinns (les voix) qui l'ont prévenu de l'intrusion. Il ne reviendra pas de sitôt.`,
    [inScene(sechepine)], false,
    [choice('rapport', 'Les PJ font-ils remonter l\'information ?', [
      ['Oui, à Monsieur Fabien', 'Monsieur Fabien monte un dossier confié à Aurélie pour l\'Enfer… qui n\'arrivera mystérieusement jamais à destination.'],
      ['Non, ils classent l\'affaire', 'Rien d\'immédiat ; Gabriel reste hors de portée et a été prévenu par ses djinns.'],
    ])]),
  scene('poniatowsky', '4. Bruit blanc : la famille Poniatowsky', 'Centre de Tri, puis pavillon de Neuilly',
    `Dossier 2, le plus sombre : l'équivalent démoniaque d'une « mission de facho ». Jean-Daniel Poniatowsky, démon de Scox grade 2 et psychiatre médiatique, veut que l'équipe élimine la famille de son corps d'accueil (sa femme Françoise et leurs trois enfants) pendant qu'il sera loin de Paris, en maquillant le tout (accident, cambriolage, incendie). Il fournit renseignements et clés.
Les victimes sont une famille ordinaire et attachante : ne pas les rendre antipathiques. Aucune difficulté technique ; tout l'enjeu est moral.
Après coup, Poniatowsky invite les PJ au restaurant (gibier en sauce), plein d'entrain… mais chaque nuit, il voit le petit dernier lui demander en pleurant pourquoi il a fait mal à sa maman.
Épisode à rappeler plus tard dans la campagne, lorsque des choix graves se présenteront.`,
    [inScene(poniatowsky), inScene(famille)], true,
    [choice('famille', 'Que font les PJ du dossier Poniatowsky ?', [
      ['Ils exécutent la mission', '+1 PA s\'ils le font sans râler. Repas avec Poniatowsky ; souvenir pesant à réutiliser dans la campagne.'],
      ['Ils enterrent le dossier', 'Quelques semaines plus tard, toute la famille meurt dans un carambolage autoroutier (18 morts, 46 blessés graves).'],
    ])]),
  scene('deprofundis', '5. Une bien belle balade : chez Deprofundis', 'Sous-sols de Paris, depuis la station Louvre',
    `Dossier 3, détendu : un mot de Monsieur Fabien rappelle qu'il faut ravitailler Deprofundis (serviteur de Gaziel) tous les cinq ans. Liste d'une trentaine d'articles : les cinq premiers CD du top 50, trois litres de thé à la menthe, cinq Pléiade, dix piles de lampe de poche, un Jungle Speed, six jeux de cordes de guitare folk, une flûte à bec alto, un tapis de bain…
Gilbert peut les accompagner (ravi) ou fournir un plan détaillé mais complexe. Prévoir lampes, casques de spéléo, baudriers, cordes.
Itinéraire : local d'entretien du métro Louvre (éviter les agents en orange qui jouent à la belote), échelle, galeries bétonnées, lourde trappe (Force très difficile sans barre à mine), échelons jusqu'aux égouts, une demi-heure de traversée (rencontres au choix : égoutiers, rats affamés, valise de billets, anges de Daniel, guérilleros de la Terre Creuse, anaconda du U-Boat Crew), porte blindée intacte depuis la Libération, anciennes carrières de la Résistance (squelette au Luger), puits masqués par des planches pourries (10 à 15 m de chute).
Le gardien : un homme assis dans une galerie demande qui va là ; un grondement monte. Il faut vite se présenter comme démons (aura, mot de passe…), sinon la galerie s'effondre.
Le repaire : une centaine de grottes humides, en partie immergées (Anaérobiose requise). Grotte principale meublée à l'ancienne (acajou, armure, tentures, lampes à pétrole). Deprofundis et ses trois zombies, cultivés et charmants, sont enchantés. Démonstration de séisme sous Paris. Remontée : deux à trois heures en suivant le plan à l'envers.`,
    [inScene(deprofundis), inScene(zombiesDep)], false,
    [choice('gardien', 'Comment les PJ réagissent-ils face au zombie gardien ?', [
      ['Ils se présentent vite comme démons', 'Conduits au repaire ; accueil chaleureux. +1 PA s\'ils deviennent potes avec Deprofundis.'],
      ['Ils hésitent ou se montrent hostiles', 'Le grondement s\'amplifie : effondrement de la galerie s\'ils ne déguerpissent pas.'],
    ])]),
  scene('heterodosk', '6. Bafouille baveuse : direction Dunkerque', 'Centre de Tri, puis Dunkerque',
    `Dossier 4 : un mot au crayon gras sur du papier toilette, signé Heterodosk (démon de Malphas). Il est retenu sur Terre par un sorcier, avec trois autres prisonniers dont deux anges, en route vers Dunkerque. Enveloppe non timbrée « au responsable des chaudières du Centre de Tri », tachée de boue, jetée d'un train et postée par un passant ; arrivée il y a quinze jours.
Sur demande, Monsieur Fabien, Gilbert ou Aurélie font un briefing sur la sorcellerie (invocation, lien, vrai nom…). Psychométrie sur l'enveloppe : elle raconte sa chute du train et son trajet par un champ de maïs de la Beauce.

Dunkerque : ville laide reconstruite à la va-vite, complexe pétrochimique, centre désert le samedi soir, hôtel abandonné aux ouvertures murées. Enquête de terrain (bars, journaux, interrogatoires) : cambriolage à l'usine sidérurgique Solac, pyromane d'animaux, expulsions de squatters de l'hôtel désaffecté, marins lituaniens bloqués au port depuis la faillite de leur armateur. Seule la dernière piste est la bonne ; laisser les PJ errer un peu.

Contexte MJ : Hornet a compris que Bifrons perd ses pouvoirs et c'est lui qui en profite. Avec les vrais noms fournis par Bifrons et une trentaine de sorciers européens de la Rose, il invoque anges et démons pour les interroger sur la situation au Paradis et en Enfer, puis les parque dans des planques. Il compte bien profiter de la guerre qui menace la Cour démoniaque.`),
  scene('cargo', '7. Boum boum boum boum : le Bijelo Dugme', 'Cargo lituanien en rade de Dunkerque',
    `Cargo mixte de faible tonnage, vide depuis quatre mois ; le propriétaire a filé avec la caisse et la Rose paie les anciens marins comme matons.
Observation à la jumelle : activité permanente, rondes jour et nuit. Tous les deux jours, un canot amène quatre marins en ville (courses, bars à matelots) : à cuisiner pour obtenir le nom de « Mister H. », un plan grossier et les forces en présence.
Forces à bord :
• Une petite dizaine de marins lituaniens, guetteurs relayés toutes les trois heures par deux (souvent un seul en état aux heures sombres).
• Quatre sorciers de la Rose (Barbara, Sven, Ulrike, Thomson), en poste depuis des mois, discipline relâchée.
• Fish et Chips, démons de Caym liés, en requins blancs autour de la coque (1d6 en cas d'attaque : 4-5 un seul requin, 6 tous deux en cabine).
• Tomo, Tommy, Lobo et Lobby, zombies spéciaux, arrivent 3 ou 4 tours après le début du combat.
• Prisonniers à fond de cale, entravés, affamés : Kisskool, Brad, Lumpen (traumatisés par la torture en Forêt-Noire) et Heterodosk, encore lucide et prêt à se battre (Discorde contre les sorciers).
Le cargo est assez loin du port pour une grosse bataille discrète. Tout tuer marche (les séides retournent d'où ils viennent), mais l'idéal est de garder vivants les prisonniers et un ou plusieurs sorciers.
Renseignements obtenus si on fait parler les survivants : incarnation forcée, tortures dans une résidence de montagne, transport en train ; nombreux sorciers, zombies et « Monsieur H. » et « Monsieur B. » à la tête de l'organisation. Les sorciers donnent les coordonnées de la base de torture (relais et château en Allemagne, abandonnés) ; ils savent que Monsieur H. est Hornet (le cachent ou monnayent l'info) et que Monsieur B. est son très bon ami… qui lui ressemble beaucoup.`,
    [inScene(marins), inScene(barbara), inScene(sven), inScene(ulrike), inScene(thomson), inScene(fishChips), inScene(tomo),
      inScene(heterodosk), ...traumatises.map((x) => inScene(x))], true,
    [choice('approche', 'Comment les PJ abordent-ils le cargo ?', [
      ['Ils cuisinent d\'abord les marins du canot', 'Plan grossier, nom de Mister H. et effectifs connus : assaut mieux préparé.'],
      ['Assaut direct', 'Aucun renseignement préalable ; les guetteurs donnent l\'alerte selon leur état d\'ébriété.'],
    ]),
    choice('requins', 'Jet de 1d6 pour Fish et Chips au moment de l\'attaque', [
      ['1-3 : les deux requins en mer', 'Fish et Chips harcèlent toute embarcation qui approche.'],
      ['4-5 : un seul requin', 'L\'autre démon de Caym est à bord et revient au rappel de Sven.'],
      ['6 : tous deux en cabine', 'Ils récupèrent leurs PP ; ils accourent à toute vitesse dès que Sven les rappelle.'],
    ]),
    choice('survivants', 'Qui reste vivant à la fin de l\'assaut ?', [
      ['Sorciers et prisonniers capturés', '+1 PA si on les fait parler : plan de Hornet en partie révélé.'],
      ['Seulement les prisonniers', 'Témoignages sur l\'incarnation forcée et les tortures ; aucun nom précis.'],
      ['Personne', 'Les séides retournent d\'où ils viennent ; aucune information.'],
    ])]),
  scene('bilan', '8. Bravo les blaireaux ! : bilan', 'Centre de Tri, Paris',
    `Les PJ décident de faire remonter (ou non) les informations et du sort des prisonniers. Conseil de Monsieur Fabien : tuer les démons (retour en Enfer) et garder les anges pour les interroger. Il refuse de les héberger au Centre : aux PJ de trouver une planque s'ils les gardent. S'ils ont laissé du bazar sur le cargo, mieux vaut quitter Dunkerque vite.
Ensuite, une semaine de congés loin du Centre.
Points d'aventure : voir les notes du scénario.`,
    [], false,
    [choice('prisonniers', 'Que font les PJ des prisonniers surnaturels ?', [
      ['Ils suivent le conseil de Fabien', 'Démons renvoyés en Enfer, anges gardés pour information (planque à trouver hors du Centre).'],
      ['Ils les tuent tous', 'Conforme à la demande d\'Heterodosk ; aucune source d\'information conservée.'],
      ['Ils les gardent tous', 'Planque à organiser ; anges et démons traumatisés à surveiller.'],
    ])]),
];

const scenario = {
  id: 'fire-and-ice-2-quatre-fragments',
  nom: 'Fire and Ice (scénario 2) – Quatre fragments d\'une chronologie du hasard',
  resume: `Nihil ex nihilo, scénario 2 (INS). Interlude : devenus « l'équipe d'intervention » du Centre de Tri, les démons traitent quatre dossiers en souffrance — un vieux Kobal paranoïaque dont le voisin est en fait l'archange Gabriel, une famille à éliminer pour un démon de Scox, un ravitaillement chez Deprofundis au fond des sous-sols de Paris, et la libération de séides invoqués par la Rose sur un cargo à Dunkerque, première trace du complot de Hornet. En coulisses, Beleth rencontre Damien et se met à chercher les PJ.`,
  notes: `Source : ${REF}.
Déroulement : affectation au Centre de Tri → quatre dossiers dans l'ordre de votre choix (Sechepine et son voisin, Poniatowsky, Deprofundis, Heterodosk/Dunkerque) → bilan. Rêves de Beleth tout au long (test de Volonté facile chaque nuit).
Scénario modulable : on peut ajouter d'autres missions d'intervention.

Récompenses (fin du scénario) :
• Restés en bons termes avec Sechepine : +1 PA
• Ont exécuté sans râler toute la famille Poniatowsky : +1 PA
• Sont devenus potes avec Deprofundis : +1 PA
• Ont fait parler les sorciers de la Rose ou leurs prisonniers : +1 PA
Puis une semaine de congés.

Fiches adaptées du livre : caractéristiques en niveaux INS/MV (Ch des humains reporté en Foi). Valeurs estimées : Roumaines, famille Poniatowsky, zombies de Deprofundis ; Poniatowsky, Kisskool, Brad et Lumpen en fiches minimales. « Membre exotique (dents) » rendu par Membre exotique : crocs.`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [sechepine, roumaines, poniatowsky, famille, deprofundis, zombiesDep, marins, barbara, sven, ulrike, thomson, fishChips, tomo, heterodosk, ...traumatises].map(asType);

// Contrôle : pouvoirs inconnus des règles
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));

writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types');
