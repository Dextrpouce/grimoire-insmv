// Génère le fichier d'import « insmv-scenario » pour « Elle est plus forte que toi, la crise » (Fire and Ice, p. 142-157, + Tempus Fugit p. 158-160)
// usage : node gen-plus-forte-que-toi.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Fire and Ice, « Elle est plus forte que toi, la crise », p. 142-157';
const L = (s) => R.parseLvl(String(s)); // « 2+ » → 5
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
let n = 0; const id = (p) => `fi9-${p}`;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [{ n: 'Coup de poing', att: 2, prec: 0, puis: -3, melee: true }], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});
const poing = (lvl) => ({ n: 'Coup de poing', att: L(lvl), prec: 0, puis: -3, melee: true });

// ---------------- PNJ : alliés et contacts ----------------
const anneClemence = npc('anne-clemence', {
  nom: 'Anne-Clémence', source: 'Humaine, thésarde en économie le jour, strip-teaseuse au Black Velvet la nuit', car: car('1 2 2 2 3 2'), armes: [],
  notes: 'Jeune femme trop maquillée en Mini Cooper, qui se lime les ongles en attendant devant le Centre de Tri. Paniquée par l\'ambiance de siège ; il faut la calmer (courtoisie, psychologie, pouvoir mental… ou baffe).\nTémoin de la descente au Black Velvet : flics en civil en nombre, un « policier » sortant une épée, le barman Gégé disparu dans un éclair, un incendie spontané, puis une embuscade de bikers qui ont fait disparaître jusqu\'aux corps. Dugomier lui a dit de prévenir les « responsables des chaudières » au Centre de Tri s\'il ne passait pas la nuit.\nMonsieur Fabien s\'en occupe : si les PJ la recroisent, elle a tout oublié (au mieux, elle les prend pour des collègues de fac).\nCaractéristiques non fournies par le livre : valeurs estimées d\'humaine ordinaire.',
});
const fabien = npc('fabien', {
  nom: 'Monsieur Fabien', source: 'Patron du Centre de Tri (pas de fiche dans ce scénario)', type: 'demon', armes: [],
  notes: 'Accorde dix jours de repos aux PJ au retour d\'Antarctique, puis les accueille dans un CdT transformé en base avancée. Vérifie sur la CRD que Dugomier était un démon de Nybbas grade 2.\nPerplexe et inquiet : ses téléphones sonnent sans arrêt, des gradés ont disparu, des services entiers ne répondent plus. Après une quinzaine d\'appels sans réponse à la hiérarchie, il admet que le Centre est seul.\nSecret MJ (Tempus Fugit) : depuis « Quatre fragments d\'une chronologie du hasard », Beleth occupe son corps et ses souvenirs. Il veut limiter la casse pendant le flou politique : pour lui ce n\'est pas (encore) la fin du monde.\nRécompense finale : 6 PA aux PJ.\nFiche minimale (pas de caractéristiques dans le livre).',
});
const gilbert = npc('gilbert', {
  nom: 'Gilbert', source: 'Démon de Morax, bras droit de Monsieur Fabien (pas de fiche dans ce scénario)', type: 'demon', armes: [],
  notes: 'En treillis, maquillage de guerre, gros calibre au poing : fait entrer tout le monde « go, go, go ! ». A monté un rack d\'armes, des munitions et des rations dans la cave pour une semaine de siège. Fournit du matériel (y compris militaire).\nÀ la fin, remet aux PJ l\'Accolade du Respect réservée aux plus valeureux.\nFiche minimale (pas de caractéristiques dans le livre).',
});
const aurelie = npc('aurelie', {
  nom: 'Aurélie', source: 'Démone du Centre de Tri (pas de fiche dans ce scénario)', type: 'demon', armes: [],
  notes: 'Porte une casquette kaki pour l\'occasion. Garde Anne-Clémence pendant que Fabien parle aux PJ ; soigne les blessés et débouche les bouteilles à l\'after party.\nFiche minimale (pas de caractéristiques dans le livre).',
});
const carmen = npc('carmen', {
  nom: 'Carmen', source: 'Démone de Malphas, grade 2 – bibliothécaire de l\'Aphte', type: 'demon', car: car('1 3 3 5 3 4'), def: 2,
  pp: 22, pfFix: 6, seuilsFix: seuils('3/6/9/12'),
  pouvoirs: pows('Discorde 4, Détection du mensonge 3, Lire les pensées 2, Charme 2, Polymorphie 2, Sommeil 1, Volonté supra-normale 1, Non-détection 3'),
  talents: 'Bibliothéconomie 7, Conduite 4, Séduction 3, Hobby (tricot) 3, Discrétion 3, Eau de Cologne cinq litres 2',
  notes: 'Petite cinquantenaire brune et boulotte, coupe à la Jeanne d\'Arc, pull à fleurs tricoté main, rit beaucoup. Assistante de conservation à la bibliothèque Saint-Exupéry de Massy, et archiviste de l\'Aphte (organisation secrète de Malphas).\nSur présentation de la carte de lecteur fournie par Fabien (via le docteur Gérald), mène les PJ aux réserves, pioche une fiche bristol en quinze secondes et débite tout d\'une traite : les faux mafieux sont les Incorruptibles, soldats de Dieu menés par Eliott, ange de Laurent ; dernière planque connue, un garage en tôle dans la zone industrielle de Buc.\nN\'aime pas qu\'on plaisante sur son classement ni sur l\'hygiène : refuse sa réserve à quiconque ne s\'est pas lavé depuis moins de 24 heures.\nAvertissement sans frais : monomaniaque (propreté). Pas d\'arme : défense non donnée, fixée à 2.',
});

// ---------------- PNJ : Incorruptibles (Buc) ----------------
const eliott = npc('eliott', {
  nom: 'Eliott', source: 'Ange de Laurent, grade 1 – chef des Incorruptibles', type: 'ange', car: car('5 5 3 2 2 3'), def: L(5),
  pp: 16, pfFix: 7, seuilsFix: seuils('8/16/24/32'),
  armes: [{ n: 'Mitraillette à camembert bénie mineure (attaque multiple, pénétration importante, portée moyenne)', att: L(5), prec: 0, puis: 7, melee: false }, poing(1)],
  pouvoirs: pows('Juste-lame 2, Armure corporelle 2, Décharge électrique 1, Esquive acrobatique 1, Protection de l\'âme'),
  talents: 'Combat 5, Tir 3 (armes d\'épaule 5), Défense 5, Conduite 4, Allumer du premier coup ses cigarettes au milieu d\'une tornade ou sous une averse tropicale 3',
  notes: 'Grand brun ténébreux, Burberry, chapeau feutre, lunettes argentées, mise en plis Prohibition, barbe de trois jours laborieuse. Pur malt et holster en peau de chamois. Poseur en combat, optimiste jusque dans les pires situations : ne se rend pas.\nC\'est lui qui, d\'après les témoins, portait des rangers, un feutre beige et une gabardine (douilles de fusil à pompe au Black Velvet, Psychométrie).',
});
const incorruptibles = npc('incorruptibles', {
  nom: 'Guiliani, Filip et Maréchal', source: 'Soldats de Dieu – Incorruptibles et inoxydables', type: 'soldat', qty: 3, car: car('3 2 3 2 1 2'), def: L(3),
  pp: 4, pfFix: 5, seuilsFix: seuils('4/8/12/16'),
  armes: [{ n: 'Fusil à pompe (portée moyenne)', att: L(3), prec: -2, puis: 5, melee: false }],
  pouvoirs: pows('Armure corporelle 1'),
  talents: 'Tir 2 (armes d\'épaule 3), Défense 3, Discrétion 3, Conduite 2, Mener des enquêtes dignes d\'une série américaine en noir et blanc 2',
  notes: 'Jeunes gens pétris de foi, chapeaux mous clairs, sportswear, veste en jean et rangers. Contrairement à Eliott, se rendent si la situation tourne mal.\nArme non précisée par le livre (seulement « armes d\'épaule ») : fusil à pompe retenu (douilles retrouvées au Black Velvet).',
});

// ---------------- PNJ : forces de l'opération « Nuit bleue » ----------------
const tenia = npc('tenia', {
  nom: 'Jean-Luc le Ténia', source: 'Ange de Daniel, grade 3 – chef des troupes de Daniel', type: 'ange', car: car('5 6 3 3 1 5'), def: L(6),
  pp: 26, pfFix: 8, seuilsFix: seuils('8/16/24/32'),
  armes: [{ n: 'Batte bénie mineure', att: L('5+'), prec: 1, puis: 4, melee: true }, poing(7)],
  pouvoirs: pows('Pétrification 4, Armure corporelle 4, Régénération 3, Trait d\'énergie 3, Peur 3, Détection du mal 2, Paralysie 2, Anaérobiose, Immunité contre les maladies et les poisons'),
  talents: 'Corps à corps 7, Défense 6, Combat 5+, Survie 2 (sous-sols 4), Savoir militaire 3 (tactique 5), Bertrand Cantat 3, Martyriser une guitare sèche 2',
  notes: 'Échalas d\'une vingtaine d\'années, cheveux et peau gras, aime exhiber son estomac rebondi torse nu. Allure d\'informaticien en fin de beuverie, mais stratège tordu et brute redoutable au corps à corps. Fanatique : frappe ses propres rangs en cas de tirage au flanc.\nPoint faible exploitable : ancien Hammerskin ayant fréquenté la Terre Creuse et failli passer chez eux avant que Daniel ne le reprenne en main ; il a recruté des anges aux idées brunes (bavures racistes à dénoncer).',
});
const ironSkull = npc('iron-skull', {
  nom: 'Iron Skull', source: 'Ange de Daniel moyen, grade 0', type: 'ange', car: car('5 5 3 2 2 2'), def: L(4),
  pp: 15, pfFix: 7, seuilsFix: seuils('8/16/24/32'),
  armes: [{ n: 'Batte bénie mineure', att: L(5), prec: 1, puis: 4, melee: true }, { n: 'Revolver gros calibre (pénétration importante, portée moyenne)', att: L(5), prec: -2, puis: 4, melee: false }],
  pouvoirs: pows('Pétrification 2, Armure corporelle 2, Déphasage 2, Trait d\'énergie 2, Anaérobiose'),
  talents: 'Combat 5, Tir 2 (armes de poing 5), Corps à corps 4, Défense 4, Chants de légionnaires 3',
  notes: 'Archétype de l\'ange de Daniel : crâne rasé, tatouages, bombers, batte et canettes de bière ; quelques skins « d\'autres horizons » ou trentenaires en costume et bretelles dans les rangs.\nRevolver : arme non précisée par le livre (seulement « armes de poing ») ; gros calibre retenu.\nTroupes de Daniel : 10 anges (1 gr3, 3 gr2, 4 gr1, 2 gr0) et 40 soldats de Dieu, en patrouilles de cinq (un ange pour quatre humains) ; deux sur cinq ont un talkie-walkie, chefs de patrouille avec Télépathie.',
});
const grosCharlie = npc('gros-charlie', {
  nom: 'Gros Charlie', source: 'Ange de Laurent, grade 2 – co-chef des troupes de Laurent', type: 'ange', car: car('5 5 3 3 1 4'), def: L('7+'),
  pp: 22, pfFix: 8, seuilsFix: seuils('8/16/24/32'),
  armes: [{ n: 'Sabre béni mineur', att: L('7+'), prec: 2, puis: 4, melee: true }],
  pouvoirs: pows('Juste-lame 4, Armure corporelle 4, Détection du mal 3, Décharge électrique 3, Volonté supra-normale 2'),
  talents: 'Combat 7+, Défense 7+, Conduite 6, Discussion 3, Culture générale 3 (procédures pénales 5), Savoir militaire 3 (stratégie 5), Savoir occulte 2 (administration angélique 4), Hobby (politique humaine) 4, Interrogatoires musclés 4, Avoir confiance en la justice de son pays 4',
  notes: 'Armoire de deux mètres sur deux, petits yeux, triple menton, haleine de pastis, accent du Sud, parle avec les mains. Triste réputation même chez les siens.\nNe peut pas voir P\'tit Nico en peinture : les deux se sont tirés dans les pattes pendant le conditionnement des policiers (Laurent les a mis tous deux sur l\'affaire).',
});
const ptitNico = npc('ptit-nico', {
  nom: 'P\'tit Nico', source: 'Ange de Laurent, grade 2 – co-chef des troupes de Laurent', type: 'ange', car: car('5 5 3 3 1 4'), def: L('7+'),
  pp: 22, pfFix: 8, seuilsFix: seuils('8/16/24/32'),
  armes: [{ n: 'Fleuret béni mineur', att: L('7+'), prec: 3, puis: 3, melee: true }],
  pouvoirs: pows('Juste-lame 4, Armure corporelle 4, Détection du mal 3, Décharge électrique 3, Volonté supra-normale 2'),
  talents: 'Combat 7+, Défense 7+, Conduite 6, Discussion 3, Culture générale 3 (procédures pénales 5), Savoir militaire 3 (stratégie 5), Savoir occulte 2 (administration angélique 4), Hobby (politique humaine) 4, Interrogatoires musclés 4, Avoir confiance en la justice de son pays 4',
  notes: 'Nain râblé, yeux globuleux sous des paupières gonflées, petite voix crispante, s\'agite sans cesse. Nouveau grade 2 aux dents longues : veut la place de Gros Charlie, qui n\'est pas dupe. Même fiche que Gros Charlie dans le livre.\nDents creuses à exploiter : les deux chefs ne s\'entendent que tant que personne ne s\'en mêle.',
});
const blade = npc('blade', {
  nom: 'Blade', source: 'Ange de Laurent moyen, grade 0', type: 'ange', car: car('4 4 3 3 2 2'), def: L(5),
  pp: 15, pfFix: 7, seuilsFix: seuils('7/14/21/28'),
  armes: [{ n: 'Épée bénie mineure', att: L(5), prec: 2, puis: 4, melee: true }],
  pouvoirs: pows('Juste-lame 2, Armure corporelle 2, Décharge électrique 2, Esquive acrobatique 2, Détection du mal 1'),
  talents: 'Combat 5, Défense 5, Corps à corps 4, Savoir militaire 2 (tactique 4), Scout toujours 4',
  notes: 'Blond, athlétique, propre sur lui, belle épée. Courageux jusqu\'à la témérité, obéissant jusqu\'à la servilité.\nTroupes de Laurent : 8 anges (3 gr2, 5 gr1), 10 soldats de Dieu, 50 policiers « normaux » ; chaque grade 2 mène une quinzaine d\'hommes (descentes dans les lieux publics), les cinq autres anges chassent chacun un démon ciblé avec une poignée d\'humains.\nBavure exploitable : un ange de grade 0 de la troupe est un tueur psychopathe qui a découpé une cliente du Black Velvet (restes retrouvés vendredi matin).',
});
const flic = npc('flic', {
  nom: 'Rémi Labavure (flic moyen)', source: 'Policier allié des troupes de Laurent', type: 'humain', qty: 4, car: car('2 2 2 2 1 2'), def: 2,
  pfFix: 4, seuilsFix: seuils('3/6/9/12'),
  armes: [{ n: 'Revolver de service (pénétration importante, portée moyenne)', att: L('2+'), prec: -2, puis: 3, melee: false }, { n: 'Matraque (non-létale)', att: L(2), prec: 0, puis: 1, melee: true }],
  talents: 'Athlétisme 2, Conduite 2, Tir 1+ (armes de poing 2+), Corps à corps 2, Police/menottes/prison 3',
  notes: 'Le flic moyen : cernes, caféine et nicotine, flingue, badge et uniforme. Conditionnement bâclé : certains craquent (un s\'est défenestré, un autre est en arrêt maladie, un troisième a parlé à un journaliste de magie noire au Quartier latin).\nArmes non précisées : revolver petit calibre et matraque retenus. Défense non donnée : 2. Pas de PP (humain).',
});
const poyPoy = npc('poy-poy', {
  nom: 'Poy-Poy', source: 'Ange de Michel, grade 3 – un des trois chefs motards', type: 'ange', car: car('6 5 2 4 1 5'), def: L(6),
  pp: 28, pfFix: 10, seuilsFix: seuils('9/18/27/36'),
  armes: [{ n: 'Sagaie bénie mineure (adaptée à la charge)', att: L(7), prec: 1, puis: 3, melee: true }, { n: 'Arme de poing', att: L(4), prec: -2, puis: 3, melee: false }],
  pouvoirs: pows('Maîtrise martiale 5, Armure corporelle 5, Arts martiaux 5, Esquive acrobatique 3, Champ de force 3, Décharge électrique 2, Trait d\'énergie 2, Vitesse 1, Membre blindé'),
  talents: 'Combat 7, Corps à corps 7, Défense 6, Conduite 6, Tenir l\'alcool 5, Tir 2 (armes de poing 4), À ses construire l\'envers phrases 3',
  notes: 'Vieux dread loqueteux au visage grêlé, mi-clochard mi-chaman (veste mitée, haut-de-forme à plumes, grigris), pilote une moto pourrie qui sent le kérosène ; charge à la sagaie sans descendre de selle.\nArme de poing : modèle non précisé (petit calibre retenu).',
});
const eddie = npc('eddie', {
  nom: 'Eddie', source: 'Ange de Michel, grade 3 – un des trois chefs motards', type: 'ange', car: car('6 5 2 4 1 5'), def: L(6),
  pp: 28, pfFix: 10, seuilsFix: seuils('9/18/27/36'),
  armes: [{ n: 'Pelle bénie mineure (inadaptée à la parade)', att: L(7), prec: -2, puis: 4, melee: true }, { n: 'Arme de poing', att: L(4), prec: -2, puis: 3, melee: false }],
  pouvoirs: pows('Maîtrise martiale 5, Armure corporelle 5, Arts martiaux 5, Esquive acrobatique 3, Champ de force 3, Décharge électrique 2, Trait d\'énergie 2, Vitesse 1, Membre blindé'),
  talents: 'Combat 7, Corps à corps 7, Défense 6, Conduite 6, Tenir l\'alcool 5, Tir 2 (armes de poing 4), Riiiio… Riiiio Graaaaande 3',
  notes: 'Le crooner des forces du Bien : Harley crème sans casque, brushing, smoking beige, chapeau de cow-boy et boots en croco, toujours impeccable. Se bat à la pelle de fossoyeur aiguisée en chantant de la country. Même fiche que Poy-Poy dans le livre.',
});
const krul = npc('krul', {
  nom: 'Krûl', source: 'Ange de Michel, grade 3 – un des trois chefs motards', type: 'ange', car: car('6 5 2 4 1 5'), def: L(6),
  pp: 28, pfFix: 10, seuilsFix: seuils('9/18/27/36'),
  armes: [{ n: 'Fléau d\'armes béni mineur « Ça » (parade difficile)', att: L(7), prec: 1, puis: 3, melee: true }, { n: 'Arme de poing', att: L(4), prec: -2, puis: 3, melee: false }],
  pouvoirs: pows('Maîtrise martiale 5, Armure corporelle 5, Arts martiaux 5, Esquive acrobatique 3, Champ de force 3, Décharge électrique 2, Trait d\'énergie 2, Vitesse 1, Membre blindé'),
  talents: 'Combat 7, Corps à corps 7, Défense 6, Conduite 6, Tenir l\'alcool 5, Tir 2 (armes de poing 4), Nope 3',
  notes: 'Trentenaire bodybuildé à dégaine de pitbull-garou, Honda jaune canari, vocabulaire de trente mots, tatouages aux biceps. Yeux invisibles sous les sourcils. Même fiche que Poy-Poy dans le livre.',
});
const bauduret = npc('bauduret', {
  nom: 'Patrick Bauduret', source: 'Ange de Michel moyen, grade 0', type: 'ange', car: car('5 4 3 3 2 2'), def: L(4),
  pp: 15, pfFix: 8, seuilsFix: seuils('8/16/24/32'),
  armes: [{ n: 'Hache à deux mains (inadaptée à la parade)', att: L(4), prec: 0, puis: 3, melee: true }],
  pouvoirs: pows('Maîtrise martiale 2, Armure corporelle 2, Champ de force 1, Arts martiaux 1, Décharge électrique 1, Membre blindé, Régénération 2'),
  talents: 'Combat 4, Défense 4, Corps à corps 4, Conduite 4, Hit the road Jack 3',
  notes: 'Motard chevelu et barbu sur grosse cylindrée à franges. Se bat bien à jeun, mieux encore ivre ; aime les armes lourdes (hache, marteau, parpaing). Sociable, violent, pas rancunier.\nArme non précisée par le livre : hache de bataille retenue (valeurs R.ARMES).\nTroupes de Michel : 20 anges (3 gr3, 6 gr2, 5 gr1, 6 gr0) à moto, toujours au moins par cinq, portables mains libres et langage de combat ; frustrés de leur petit rôle, ils boivent et dérapent (carambolages, bagarre au Saint-Quentin).',
});
const soldats = npc('soldats', {
  nom: 'Soldats de Dieu (patrouilles)', source: 'Soldat de Dieu typique (Livre de base)', type: 'soldat', qty: 4,
  car: car('3 2+ 2 2+ 1+ 3'), def: L('2+'), pp: 8, pfFix: 5, seuilsFix: seuils('4/8/12/16'),
  armes: [{ n: 'Pistolet-mitrailleur', att: L(3), prec: -2, puis: 4, melee: false }, { n: 'Matraque (non-létale)', att: L(2), prec: 0, puis: 1, melee: true }],
  talents: 'Athlétisme 3, Combat 2, Conduite 2+, Corps à corps 2, Intimidation 2, Savoir militaire 2 (tactique 2+), Tir 2',
  notes: 'Le livre renvoie au soldat de Dieu du livre de base : valeurs du bestiaire (p. 88 des règles). Escortent les anges de Daniel (patrouilles de cinq en sous-sol) et de Laurent. Certains, racistes, font du zèle (caves d\'une boucherie halal incendiées, violonistes tziganes tabassés).',
});

// ---------------- PNJ : démons et humains du Quartier latin (sans stats) ----------------
const paulo = npc('paulo', {
  nom: 'Paulo et Rotka', source: 'Démon de Nisroch et son second Belial – dealers de la Sorbonne', type: 'demon', qty: 2, armes: [],
  notes: 'Contrôlent shit, coke, ecstasy et amphètes autour de la Sorbonne. Roulent pour eux-mêmes depuis des années ; les nouvelles de la Cour les confortent dans leur envie de rester à l\'écart. Rotka est un Belial aussi neuneu que violent.\nS\'ils sont convaincus : aide financière conséquente et une dizaine d\'hommes de main humains peu armés.\nSans intervention : repérés à 23 h, poursuivis en voiture de sport, éliminés par Laurent et Michel.\nFiche minimale (pas de caractéristiques dans le livre).',
});
const delikatessen = npc('delikatessen', {
  nom: 'Delikatessen', source: 'Démon de Haagenti – communauté « osso buco » du Boul\'Mich', type: 'demon', armes: [],
  notes: 'Freluquet ombrageux et moite, méfiant envers la hiérarchie depuis un avertissement sans frais qui a abîmé son goût. Depuis dix mois, tous les habitants d\'un immeuble bourgeois du Boul\'Mich mangent de la chair humaine le dimanche midi.\nRallié : une dizaine de familles de gastronomes lobotomisés.\nSans intervention : 21 h, l\'immeuble est investi par Laurent, Michel et une vingtaine de flics ; Delikatessen est tué sur les toits, deux adolescents gravement blessés.\nFiche minimale (pas de caractéristiques dans le livre).',
});
const nosferax = npc('nosferax', {
  nom: 'Nosferax', source: 'Démon de Samigina – patron des glaciers Baskin Robbins', type: 'demon', armes: [],
  pouvoirs: pows('Corps gazeux'),
  notes: 'Vieux Samigina gothique et punk ; les deux glaciers Baskin Robbins sont tenus par ses familiers vampires. Allié pompeux, prétentieux et assommant, mais ne rechigne pas s\'il comprend le danger. Peut rameuter Groquick (Crocell, tas de graisse qui pouffe) et Sabbath (Furfur, énorme tatoué flûtiste d\'indus acoustique).\nSans intervention : 22 h, il fuit les Michel par Corps gazeux dans les égouts, est capturé par Daniel vers 23 h ; à minuit, Laurent lui arrache les coordonnées de Groquick et Sabbath, tués à 1 h (Molodoï).\nFiche minimale : Corps gazeux cité par le livre, niveau non donné.',
});
const claudes = npc('claudes', {
  nom: 'Claude et Claude', source: 'Démons de Scox et de Mammon, grade 2 – Penthouse 69', type: 'demon', qty: 2, armes: [],
  notes: 'Starlettes androgynes maquillées « Boy George au saut du lit ». Dirigent Penthouse 69, fausse agence d\'escort girls couvrant un réseau de prostitution hardcore étendu à l\'Europe de l\'Est.\nContactés à temps : une dizaine d\'hommes de main de la mafia polonaise.\nSans intervention : 2 h, les trois factions investissent l\'immeuble (deux démons, des familiers, quelques mafieux polonais). À 2 h 20, plus aucune résistance maléfique dans le quartier.\nFiche minimale (pas de caractéristiques dans le livre).',
});
const zombies = npc('zombies', {
  nom: 'Zombies des arènes de Lutèce', source: 'Une trentaine de morts-vivants portés disparus depuis le XIe siècle', type: 'mortvivant', qty: 6, armes: [],
  notes: 'Vivent en autarcie dans des galeries sous les arènes de Lutèce. Les convaincre demande du roleplay inspiré, mais ce sont des alliés de poids pour les combats souterrains.\nSans intervention : 21 h, Daniel boucle les sous-sols des arènes et les élimine.\nFiche minimale : pas de caractéristiques dans le livre (valeurs par défaut, à ajuster).',
});
const beauLulu = npc('beau-lulu', {
  nom: 'Lucien Chasle « le Beau Lulu »', source: 'Ex-maquereau, parrain de la criminalité « touristique »', type: 'humain', armes: [],
  notes: 'Gangster old school gominé : cabarets-bordels, deal en club, pickpockets mondains, tripots. Préfère chantage et corruption à la violence. Se rencontre au Quat\'Zarts (bistro faux Montmartre).\nGrâce à ses contacts policiers, peut réduire de moitié les effectifs humains des troupes de Laurent. Refuse toute collaboration avec Aldo Romani (et réciproquement).\nSans intervention : ses hommes se font tuer au Quat\'Zarts par les Michel vers minuit (trois morts).\nFiche minimale (pas de caractéristiques dans le livre).',
});
const romani = npc('romani', {
  nom: 'Aldo Romani', source: 'Responsable local de la mafia calabraise', type: 'humain', armes: [],
  notes: 'Moins de trente ans, poussah rougeaud, vit à l\'année dans une suite de l\'hôtel Americana. Difficile à motiver sans un gros apport financier ; refuse de travailler avec le Beau Lulu.\nRallié : une quinzaine d\'hommes de main armés, entraînés et sans scrupules.\nFiche minimale (pas de caractéristiques dans le livre).',
});
const hommesMain = npc('hommes-main', {
  nom: 'Hommes de main (mafia, dealers, motards)', source: 'Renforts humains recrutables', type: 'humain', qty: 6, car: car('2 2 2 2 1 2'), def: 2,
  pfFix: 4, seuilsFix: seuils('3/6/9/12'),
  armes: [{ n: 'Revolver petit calibre (pénétration importante, portée moyenne)', att: L(2), prec: -2, puis: 3, melee: false }, { n: 'Cran d\'arrêt', att: L(2), prec: -1, puis: -1, melee: true }],
  talents: 'Tir 2, Corps à corps 2, Intimidation 2',
  notes: 'Fiche générique estimée (pas de caractéristiques dans le livre) pour les renforts : dizaine d\'hommes de Paulo (peu armés : cran d\'arrêt, pistolet d\'alarme), mafia polonaise de Claude et Claude, quinzaine de Calabrais d\'Aldo Romani (mieux armés), motards parisiens éméchés.',
});

// Le bestiaire joint (types réutilisables) : mêmes fiches, sans quantité
const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });

// ---------------- Scènes ----------------
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  scene('cdt', '1. Le Centre de Tri en état de siège', 'Centre de Tri, Paris – mardi matin',
    `Après dix jours de repos accordés par Monsieur Fabien, les PJ sont convoqués. Le CdT a l'air fermé : tract syndical sur la porte (les employés humains sont en grève illimitée), fenêtres condamnées par des sacs de sable, mitrailleuse sur trépied face à l'entrée. Le personnel démoniaque se relaie en trois-huit autour des téléphones de la salle de pause, des ordinateurs sont branchés en direct sur la CRD, Gilbert a monté un rack d'armes et de quoi tenir une semaine de siège dans la cave.
Contexte : le CdT est devenu une base avancée de l'Enfer, sur ordre d'en haut et à l'initiative de Beleth, qui veut limiter la casse pendant la guerre civile. Des rumeurs de percées angéliques courent dans Paris.

Arrivée : Anne-Clémence attend dans sa Mini Cooper et demande le « responsable des chaudières ». Gilbert, en treillis et peinturluré, fait entrer tout le monde au pas de course. Il faut calmer l'humaine paniquée.
Dans le bureau de Fabien, elle raconte : effeuilleuse au Black Velvet (bar à hôtesses du Quartier latin tenu par Guillaume « Main froide » Dugomier) ; descente de police la nuit dernière avec des flics en civil en nombre, fusillade, un policier armé d'une épée, le barman Gégé disparu dans un éclair, incendie spontané ; Dugomier l'a exfiltrée puis un groupe de bikers les a massacrés. Plus aucune trace, même des corps.
Fabien confirme via la CRD : Dugomier était un démon de Nybbas grade 2, le Black Velvet un repaire démoniaque réputé. Une attaque frontale à découvert de l'autre camp, flics et bikers de concert : mission d'enquête, en lien étroit avec le Centre.
Fabien prend en charge Anne-Clémence : si les PJ la recroisent, elle a tout oublié.`,
    [inScene(anneClemence), inScene(fabien), inScene(gilbert), inScene(aurelie)]),
  scene('velvet', '2. Le Black Velvet', 'Ruelle près du boulevard Saint-Michel – rez-de-chaussée et deux sous-sols',
    `Porte principale sous scellés (fermeture judiciaire). Quartier calme : entrée possible en crochetant, en forçant ou par pouvoir ; de l'autre côté du pâté de maisons, un soupirail (entrée des artistes) donne sur le premier sous-sol.
Intérieur : deux salles de spectacle, salons privés, alcôves, deux bars, vestiaire et loges ; déco érotico-kitsch saccagée. Odeur de cochon grillé, murs noircis, verre brisé, flaques de sang, présentoirs pillés.
Indices :
• Une dizaine de douilles (revolver et fusil à pompe), impacts dans les murs et les canapés, sacs à main vidés.
• Le petit bureau près des réserves est retourné : meubles éventrés, ordinateur ouvert en deux, traces de pompes sur la paperasse.
• Psychométrie (douilles de fusil à pompe) : grand gaillard mal rasé, chapeau de feutre beige et gabardine assortie (Eliott). Même info possible via un témoin (propriétaire d'un permis tombé près du bar) ou une enquête de voisinage.
• Voisins et passants : une dizaine de flics en uniforme et quatre gaillards habillés « comme dans les films en noir et blanc », mitraillettes, façon Lino Ventura. Pimenter l'enquête de voisinage avec les rumeurs du quartier (voir notes du scénario).
Pour retrouver les faux mafieux : relations humaines (police, justice), PNJ alliés des scénarios précédents, ou retour au CdT : Fabien consulte les bases, appelle un certain docteur Gérald et remet une carte de lecteur plastifiée pour la bibliothèque de Massy-Palaiseau (« demandez Carmen »).`),
  scene('aphte', '3. Les archives de l\'Aphte', 'Bibliothèque Saint-Exupéry, Massy',
    `Carmen, assistante de conservation (et démone de Malphas grade 2, archiviste de l'Aphte, l'organisation secrète et hors-la-loi du prince de la discorde), accueille les PJ sur présentation de la carte. Elle les emmène dans les réserves où pourrissent une dizaine de cartons de déménagement pleins de fiches bristol, en tire une au bout de quinze secondes et débite d'une traite :
• les gens recherchés se font appeler les Incorruptibles ;
• des soldats de Dieu menés par un ange de Laurent, Eliott ;
• dernière planque connue : un garage en tôle, zone industrielle de Buc.
Elle refuse l'accès à quiconque ne s'est pas lavé dans les 24 heures.
Désormais, les PJ peuvent exploiter les archives de l'Aphte pour leurs enquêtes ; en cas d'abus, leur mettre des bâtons dans les roues. Croisements possibles avec d'autres PNJ de la gamme (docteur Gérald, Memorex, un vieux lecteur acariâtre).`,
    [inScene(carmen)]),
  scene('buc', '4. Descente à Buc : les Incorruptibles', 'Hangar en tôle, zone industrielle de Buc, puis siège d\'un éditeur de jeux voisin',
    `Les Incorruptibles vivent à quatre dans un soixante mètres carrés spartiate : évier, toilettes, quatre lits de camp, demi-bouteilles de whisky frelaté. Le hangar a deux issues.
Attaqués par surprise, ils fuient à découvert et se réfugient dans le premier bâtiment ouvert et éclairé : le siège d'un célèbre éditeur de jeux de simulation. Baston brève et brutale entre les piles de cartes et les invendus.
Eliott ne se rend pas ; Guiliani, Filip et Maréchal se rendent si ça tourne mal.
Une fois maîtrisés, les survivants parlent ; sinon, leur local contient assez de documents compromettants. Dans tous les cas, les PJ découvrent l'existence de l'opération « Nuit bleue » (encadré du dossier N+D, à remettre aux joueurs).`,
    [inScene(eliott), inScene(incorruptibles)], true,
    [choice('buc', 'Comment se termine l\'assaut contre les Incorruptibles ?', [
      ['Prisonniers interrogés', 'Les soldats (et peut-être Eliott) révèlent l\'opération « Nuit bleue » : objectifs, archanges impliqués, date et zone. Bonus possible sur les effectifs ou les chefs.'],
      ['Main trop lourde (tous morts)', 'Les documents du hangar suffisent à reconstituer le dossier « Nuit bleue ». Pas d\'infos bonus.'],
      ['Ils s\'échappent', 'Les PJ récupèrent le dossier dans la planque ; Eliott, s\'il survit, peut réapparaître dans une des équipes de Laurent samedi soir.'],
    ])]),
  scene('nuit-bleue', '5. Opération « Nuit bleue » : le plan de bataille', 'Centre de Tri – mercredi à samedi',
    `Le dossier N+D (résolution du Conseil angélique) : action militaire test pour mesurer les chances d'une attaque frontale. Samedi à partir de 21 h, 4 à 6 heures, Quartier latin. Trois archanges collaborent :
• Daniel : prend les sous-sols et élimine la résistance surnaturelle (chef : Jean-Luc le Ténia).
• Laurent : avec la police humaine, arrête les démons, ferme leurs établissements, achemine les suspects à Notre-Dame (chefs : Gros Charlie et P'tit Nico).
• Michel : élimine les hauts gradés et maintient la pression (trois grade 3 motards : Poy-Poy, Eddie, Krûl).
Au CdT, Fabien est perplexe : depuis 48 heures, missions mal distribuées, gradés disparus, contacts muets, services entiers hors service. Après quinze tentatives pour joindre la hiérarchie, verdict : ils sont seuls.
Enjeu : si les anges tiennent facilement le Quartier latin, ils lanceront une offensive plus vaste. Mission double : résister physiquement et faire croire aux anges que l'organisation infernale tient malgré la guerre.
Moyens : base de données de l'Aphte, téléphones du CdT, Fabien, Gilbert, Aurélie et leurs propres ressources.
Trois approches combinables (scènes 6 à 8) ; on peut réussir sur une seule, mais c'est plus facile en jouant sur les trois. Les princes des PJ, même sollicités officiellement, ne bougeront que symboliquement.`,
    [inScene(fabien), inScene(gilbert)], false,
    [choice('strategie', 'Quelle approche les PJ privilégient-ils ?', [
      ['Résistance démoniaque', 'Prévenir et fédérer les démons du Quartier latin (scène 6).'],
      ['Résistance alternative', 'Mobiliser humains (pègre, motards, manifestants) et alliés surnaturels marginaux (scène 7).'],
      ['Déstabilisation de l\'ennemi', 'Exploiter les bavures et rivalités des trois factions pour briser l\'alliance (scène 8).'],
      ['Tout à la fois', 'Le plus efficace, mais demande une vraie organisation de « petits chefs ».'],
    ])]),
  scene('resistance-d', '6. Résistance démoniaque', 'Quartier latin – mercredi à samedi',
    `Fédérer les forces du Mal est difficile (indiscipline, méfiance depuis la mise à l'index de Crocell) : les PJ doivent prendre leurs responsabilités et jouer les petits chefs.
Organisations :
• CdT : soutien total de Fabien, Gilbert et Aurélie (y compris militaire) ; accès à la CRD de Baalberith (test d'Informatique) pour lister les démons du quartier.
• Aphte : convaincre les démons de Malphas, les acheter ou promettre une récompense. Rencontrer leur prince en personne prend du temps mais s'avère très efficace ; leurs dossiers compromettants sur les serviteurs des trois archanges sont idéaux pour les monter les uns contre les autres.
Nids démoniaques du secteur :
• Paulo (Nisroch) et Rotka (Belial), dealers de la Sorbonne : argent et une dizaine d'hommes de main peu armés.
• Delikatessen (Haagenti) et la communauté « osso buco » du Boul'Mich : une dizaine de familles cannibales lobotomisées.
• Nosferax (Samigina) et ses familiers vampires des glaciers Baskin Robbins, plus ses potes Groquick (Crocell) et Sabbath (Furfur).
• Claude et Claude (Scox et Mammon, grade 2), Penthouse 69 : une dizaine d'hommes de la mafia polonaise.
• Une trentaine de zombies sous les arènes de Lutèce : alliés de poids sous terre.
Autres démons isolés : amis des scénarios précédents (habitués du Chez Régis…), Deprofundis (redoutable contre Daniel), les égoutiers du U-Boat Crew, Conrad Sechepine, des membres de la commission d'enquête ; Marie-Jolie, Salomon, Jézabel ou Le Professeur, durs à convaincre mais précieux.`,
    [inScene(paulo), inScene(delikatessen), inScene(nosferax), inScene(claudes), inScene(zombies)], false,
    [choice('nids', 'Quels nids démoniaques les PJ parviennent-ils à rallier ?', [
      ['Paulo et Rotka', 'Fonds et une dizaine d\'hommes de main ; sinon, ils meurent en fuyant vers 23 h.'],
      ['Delikatessen', 'Une dizaine de familles de gastronomes ; sinon, mort sur les toits à 21 h.'],
      ['Nosferax et ses potes', 'Familiers vampires, Groquick et Sabbath ; sinon, capturés puis tués entre 22 h et 1 h.'],
      ['Claude et Claude', 'Mafia polonaise en renfort ; sinon, Penthouse 69 tombe à 2 h.'],
      ['Les zombies de Lutèce', 'Alliés solides dans les galeries ; sinon, éliminés par Daniel dès 21 h.'],
    ])]),
  scene('resistance-h', '7. Résistance alternative', 'Quartier latin et Paris – mercredi à samedi',
    `Les démons seuls ne suffiront pas : se tourner vers les humains, dont certains commencent à se poser des questions.
• Le Beau Lulu (Lucien Chasle), pègre « touristique », au Quat'Zarts : ses contacts policiers peuvent diviser par deux les effectifs humains de Laurent.
• Aldo Romani, mafia calabraise (suite à l'hôtel Americana) : une quinzaine d'hommes armés et sans morale, mais exige beaucoup d'argent. Les deux parrains refusent de travailler ensemble.
• Motards parisiens (fans de Johnny, Hells de Malakoff) agacés par l'omniprésence des anges de Michel : un discours et de l'alcool suffisent pour qu'ils causent des ennuis aux motards angéliques.
• Mouvement pacifique (manifestations, sit-in, tracts, résistance passive), efficace car les anges restent tenus par la discrétion : associations de résidents excédés par les motos, syndicats étudiants, égoutiers au chômage technique, agents RATP inquiets des sous-sols.
• Alliés surnaturels marginaux : renégats ou musulmans (des anges de Khalid adoreraient casser du Laurent), Ignace Blanchoux contre de futures faveurs (renseignements), sorciers, psis ou autres membres de la troisième force.`,
    [inScene(beauLulu), inScene(romani), inScene(hommesMain)], false,
    [choice('parrain', 'Quel parrain de la pègre les PJ s\'allient-ils ?', [
      ['Le Beau Lulu', 'Effectifs humains de Laurent réduits de moitié ; Romani reste à l\'écart.'],
      ['Aldo Romani', 'Une quinzaine d\'hommes armés contre une forte somme ; le Beau Lulu refuse alors toute aide.'],
      ['Aucun', 'Les hommes du Beau Lulu se feront quand même tabasser par les Michel au Quat\'Zarts vers minuit.'],
    ])]),
  scene('destabilisation', '8. Déstabiliser l\'alliance', 'Quartier latin – mercredi à samedi',
    `Option plus pacifique, compatible avec les deux autres, demandant enquête et tactique. Chaque faction a des débordements honteux :
• Daniel : le Ténia est un ancien Hammerskin passé près de rejoindre la Terre Creuse ; il a recruté des anges aux idées brunes. Bilan : deux violonistes tziganes du métro tabassés (dans le coma), caves d'une boucherie halal incendiées, stations couvertes d'autocollants FN ; jeudi soir, un clochard africain changé en pierre.
• Laurent : Gros Charlie et P'tit Nico se détestent et ont bâclé le conditionnement des policiers. Après le Black Velvet, un flic se défenestre, un autre se met en arrêt maladie, un troisième raconte la magie noire à un journaliste (article dans France-Soir vendredi). Un ange de grade 0 psychopathe a découpé une cliente du Black Velvet (restes retrouvés vendredi matin).
• Michel : motards ivres, carambolage sur le périph' mardi puis mercredi, bagarre au Saint-Quentin vendredi (bâtiment ravagé, une dizaine de blessés).
Plutôt que de signaler à la hiérarchie : faire circuler les infos entre groupes (dénoncer le racisme des Daniel aux Michel), accuser une faction des fautes d'une autre, ou provoquer soi-même des incidents attribués aux anges (saccager un kebab en chantant des cantiques de légionnaires en allemand).`,
    [inScene(tenia), inScene(grosCharlie), inScene(ptitNico)], false,
    [choice('zizanie', 'Comment les PJ sèment-ils la zizanie ?', [
      ['Faire circuler les bavures entre factions', 'Rapide et efficace : la coordination entre archanges se grippe samedi soir.'],
      ['Accuser une faction des crimes d\'une autre', 'Les factions se méfient : poursuites et assauts communs moins bien coordonnés.'],
      ['Provoquer des incidents attribués aux anges', 'Risqué mais efficace ; renforce aussi la résistance humaine.'],
      ['Signaler les exactions à la hiérarchie angélique', 'Procédurier et lent : peu d\'effet avant samedi.'],
    ])]),
  scene('assaut-1', '9. Paris sous les bombes : 21 h – minuit', 'Quartier latin, surface et sous-sols – samedi soir',
    `Les PJ dirigent la résistance depuis le CdT, les sous-sols ou la rue. Planning prévu sans intervention des démons (à modifier selon leurs actions) :
• 21 h : Laurent, appuyé de motards de Michel et d'une vingtaine de flics, investit l'immeuble osso buco, perquisitionne et embarque tous les habitants ; Delikatessen tué en fuyant par les toits, deux adolescents grièvement blessés. Daniel boucle les galeries des arènes de Lutèce et élimine les zombies.
• 22 h : des Michel attaquent le domicile de Nosferax, qui fuit dans les égouts par Corps gazeux. Les flics sont occupés au poste avec les prisonniers. Laurent cherche Paulo autour de la Sorbonne. Daniel abat un mur porteur vers les catacombes et une base de la Terre Creuse : mini-effondrement, une heure de déblaiement.
• 23 h : Paulo et Rotka, repérés, fuient en voiture de sport ; Laurent et Michel coordonnés les arrêtent et les éliminent. Des Daniel retardataires capturent Nosferax dans les égouts.
• Minuit : grosse mêlée souterraine entre Daniel, des guérilleros de la Terre Creuse et un anaconda géant bleu pâle. Nosferax, livré à Laurent, livre sous pouvoirs mentaux les coordonnées de Groquick et Sabbath. Des Michel vident une chope au Quat'Zarts et déclenchent une rixe avec les hommes du Beau Lulu : trois morts.
Conseil de MJ : noyer les joueurs sous l'information, plusieurs échauffourées simultanées, alliances qui craquent, humains qui pètent les plombs. Prendre des notes sur qui est où.`,
    [inScene(tenia), inScene(ironSkull, { qty: 2 }), inScene(soldats, { qty: 8 }), inScene(grosCharlie), inScene(blade, { qty: 2 }), inScene(flic, { qty: 6 }), inScene(bauduret, { qty: 5 })], true),
  scene('assaut-2', '10. Paris sous les bombes : 1 h – 2 h 20', 'Quartier latin – nuit de samedi à dimanche',
    `• 1 h : flics et anges de Laurent investissent la salle de concert du Molodoï pour un contrôle d'identité musclé (une dizaine d'arrestations) et tuent discrètement Sabbath en coulisses. Les Michel traquent et démolissent Groquick à pied (dix minutes d'avance pour le sport). Daniel pose des charges pour entrer chez Penthouse 69 par les sous-sols.
• 2 h : les trois factions investissent Penthouse 69 ensemble ; faible résistance (deux démons, des familiers, quelques mafieux polonais).
• 2 h 20 : sans intervention des PJ, plus aucune résistance maléfique dans le Quartier latin ; les anges rentrent à Notre-Dame avec leurs prisonniers.
Évaluation : aucun système de règles possible vu la liberté des PJ ; juger honnêtement. Des PJ qui se sont démenés ne doivent pas être punis même s'ils ont été mauvais sur le terrain ; des PJ passifs comptant sur leurs griffes peuvent subir un joli massacre.`,
    [inScene(ptitNico), inScene(blade, { qty: 2 }), inScene(flic, { qty: 6 }), inScene(poyPoy), inScene(eddie), inScene(krul), inScene(bauduret, { qty: 5 }), inScene(soldats, { qty: 4 }), inScene(claudes)], true,
    [choice('issue', 'Quel bilan pour la résistance démoniaque ?', [
      ['Les anges sont tenus en échec', 'Notre-Dame juge l\'attaque frontale prématurée ; pas d\'offensive plus vaste à court terme. Quart d\'heure de gloire pour les PJ.'],
      ['Victoire angélique partielle', 'Plusieurs nids tombent, mais l\'organisation infernale a montré qu\'elle réagissait : Notre-Dame hésite.'],
      ['Déroute totale à 2 h 20', 'Les anges contrôlent le Quartier latin et préparent une offensive plus large.'],
    ])]),
  scene('epilogue', '11. After party et message de Lucifer', 'Centre de Tri – nuit de samedi à dimanche',
    `Retour au CdT, harassés, blessés, démoralisés : surprise, une petite after party a été organisée (chips, Curly, bouteilles de roteuse débouchées par Aurélie), même si le succès est douteux. Fabien leur accorde 6 PA ; Gilbert leur remet l'Accolade du Respect. Aurélie soigne les blessés, on écoute leur récit.
Puis tous les téléphones, portables compris, sonnent en même temps, les ordinateurs se rallument seuls, le moniteur de vidéosurveillance grésille. Sur tous les écrans, un jeune homme blond aux cheveux courts et lunettes noires parle en langage démoniaque : Lucifer. En substance, il est fatigué, il a réfléchi, il a appris la guerre entre Belial et Crocell et les tensions à la Cour ; il ne reviendra pas. Il abandonne la cité de Dis à qui voudra la prendre (« organisez des élections »), il est inutile de le chercher. Adieu.
La communication s'achève sur la plus grosse déflagration d'aura jamais vue par des démons. Puis le noir, le silence. Fin de la première moitié de la campagne (suite dans Fire and Ice 2).`,
    [inScene(fabien), inScene(gilbert), inScene(aurelie)]),
];

const scenario = {
  id: 'fire-and-ice-9-plus-forte-que-toi',
  nom: 'Fire and Ice (scénario 9) – Elle est plus forte que toi, la crise',
  resume: `De bello civili, scénario 9 (INS), conclusion de la première moitié de la campagne. Paris, guerre civile en Enfer : Notre-Dame teste une attaque frontale contre les démons du Quartier latin, l'opération « Nuit bleue », menée par les troupes de Daniel, Laurent et Michel. Les PJ remontent la piste depuis une descente de police au Black Velvet, découvrent le plan, puis doivent organiser la résistance (démons locaux, pègre humaine, zizanie entre archanges) avant la nuit de samedi. Scénario ouvert, conclu par l'annonce télévisée de la démission de Lucifer.`,
  notes: `Source : ${REF}. Aide de jeu « Tempus Fugit », p. 158-160.
Scénario ouvert : enquête, diplomatie, magouille ou baston selon les goûts. Déroulement : CdT (mardi) → Black Velvet → Aphte → Buc → plan « Nuit bleue » → préparatifs (résistance démoniaque, alternative, déstabilisation) → nuit de samedi 21 h-2 h 20 → after party et message de Lucifer.

Récompense : 6 PA (Monsieur Fabien) et l'Accolade du Respect de Gilbert, quel que soit le succès réel ; le MJ juge honnêtement l'efficacité des plans des PJ (pas de système de règles).

Forces angéliques (Fiend Folio) :
• Daniel : 10 anges (1 gr3, 3 gr2, 4 gr1, 2 gr0), 40 soldats de Dieu, sans véhicule, armes légères. Sous-sols (égouts, parkings, catacombes, métro) ; patrouilles de cinq façon dungeon crawling, talkies, chefs télépathes. Forts sous terre, mais obsédés par la Terre Creuse (capables d'abandonner un combat contre des démons pour un renégat). Bases avancées installées sous le quartier (travaux municipaux suspendus).
• Laurent : 8 anges (3 gr2, 5 gr1), 10 soldats de Dieu, 50 policiers ; véhicules de police, armement lourd (épées, matraques, flashballs, lacrymos, canons sciés, PM). Descentes, fausses arrestations, interrogatoires ; liste de lieux démoniaques récupérée au Black Velvet. Vernis de légalité (préfet acquis via les anges de Blandine, Didier et Francis), mais policiers mal conditionnés et descentes impopulaires.
• Michel : 20 anges (3 gr3, 6 gr2, 5 gr1, 6 gr0) sur vingt motos, haches, barres à mine, Molotov, fusils d'assaut. Rattrapent les fuyards, intimident, font du « show ». Forts en frappe et mobilité ; faibles par sentiment d'invulnérabilité, frustration et dérapages (alcool).
Pour les soldats de Dieu : soldat typique du livre de base. Démons divers : improviser.

Rumeurs du Quartier latin (D66 ; dizaine 2 = Daniel, 3 = Laurent, 5 = Michel ; interroger le bavard donne des infos bonus) :
• 11-12 : café à 1 € dans un bar de Versailles (rien).
• 13-14 : le mari de Céline Dion remplacé par un sosie (rien).
• 15-16 : propos racistes de comptoir (rien).
• 21-22 : montée du racisme, épicerie incendiée par des skins.
• 23-24 : plus d'eau courante, « problème de voirie » (travaux souterrains).
• 25-26 : nouvelle bande de squatters dans le métro.
• 31-32 : quatrième descente de police en huit jours, réunion de protestation ce soir.
• 33-34 : le sex-shop de la rue Lepic a fermé.
• 35-36 : la police chasse les filles « mal habillées ».
• 41-42 : querelle de voisinage (rien).
• 43-44 : le violeur du campus des années 80, jamais arrêté.
• 45-46 : un bavard en sait trop sur ce violeur… (piste annexe).
• 51-52 : plein de Harley dans le quartier.
• 53-54 : motards barbus et crasseux.
• 55-56 : motards ivres et armés roulant par dix.
• 61-62 : prêcheurs de l'Apocalypse.
• 63-64 : « la rue Lucifer », vous connaissez ?
• 65-66 : un nouveau bar sympa vers la Sorbonne, Chez Régis.

Chronologie du scénario (Tempus Fugit) : J-5 grève des humains du CdT, transformé en base ; J-4 le préfet accepte l'opération sous l'influence des anges de Blandine ; J-3 concentrations de motards ; J-2 Daniel prend les sous-sols (boucherie halal, Tziganes) ; lundi soir descente au Black Velvet, mort de Dugomier ; mardi Anne-Clémence, Black Velvet, Aphte, Buc, défenestration d'un flic, carambolage ; mercredi autocollants FN, nouveau carambolage ; jeudi SDF pétrifié, bagarre au Saint-Quentin ; vendredi article de France-Soir, restes d'une cliente retrouvés ; samedi 21 h-2 h opération, puis Lucifer branche le DIF666 et annonce sa démission.

Aide de jeu « Tempus Fugit » (conclut la première moitié de la campagne) : chronologie secrète de toute la campagne, utile pour relier les fils. Points clés :
• Arrière-plan : chute de Kiel (devenu Baalberith), brouille Belial-Crocell née de leur rivalité amoureuse, Belial prince du feu (1566) puis Crocell prince du froid (1834) ; manuscrit inédit de Nostradamus caché à Auxerre ; Gilbert sauve Fabien en Laponie (années 70) ; Ange Luther, fille d'un ange de Michel et d'une démone d'Andrealphus (Drina), dernière exception aux édits de stérilité ; été 1997 « Nuit des longues battes », Dieu et Lucifer en vacances ; Belial infiltre ses démons chez Crocell (dont Julie Delahaye) ; Crocell crée les Flocons de sang ; Hornet invoque Bifrons.
• Andrealphus a conçu Damien avec Baal en 1999 ; descendu sur Terre sous les traits de Yolande Jolimont, il pompe l'énergie de séides assassinés (Hakim Izmet tué par Orgasme mortel au scénario 1).
• Beleth occupe le corps et les souvenirs de Monsieur Fabien depuis le scénario 2 ; via la MRC, il cherche à provoquer une guerre en Enfer pour justifier le retour de Lucifer.
• Gabriel, à Paris sous le nom de Gabriel Leminor, est parti à la recherche de Samaël.
• Enchaînement des scénarios : 1 Le photocopillage tue le livre, 2 Quatre fragments d'une chronologie du hasard, 3 Soigner le Bien par le Mal, 4 La Sierra de Sergio, 5 Ice, ice baby, 6 The roof is on fire, 7 Le démon est un animal politique, 8 Voir le pôle et courir, 9 Elle est plus forte que toi, la crise. Après le scénario 8 : loi martiale en Enfer, guerre reconnue, Andromalius et Baal se disputent la coordination des troupes en l'absence de Satan.

Fiches adaptées du livre : caractéristiques en niveaux INS/MV (Ch des humains reporté en Foi). Valeurs estimées signalées dans chaque fiche.`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [anneClemence, fabien, gilbert, aurelie, carmen, eliott, incorruptibles, tenia, ironSkull, grosCharlie, ptitNico, blade, flic,
  poyPoy, eddie, krul, bauduret, soldats, paulo, delikatessen, nosferax, claudes, zombies, beauLulu, romani, hommesMain].map(asType);

// Contrôle : pouvoirs inconnus des règles
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));

writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types,', scenes.reduce((a, s) => a + s.choix.length, 0), 'choix');
