// Génère le fichier d'import « insmv-scenario » pour « La douloureuse absence de Clint Eastwood » (Les Petites Apocalypses, ch. 11, p. 96-108 ; adaptations p. 116)
// usage : node gen-petites-apocalypses-6-clint-eastwood.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Les Petites Apocalypses, ch. 11 « La douloureuse absence de Clint Eastwood », p. 96-108';
const L = (s) => R.parseLvl(String(s));
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
const ARMES = new Map(R.ARMES.flatMap(([g, l]) => l.map((x) => [x[0], { prec: x[1], puis: x[2], melee: R.MELEE_GROUPS.includes(g) }])));
// arme de la table des règles : nom affiché, nom dans la table, niveau du talent
const arme = (n, table, lvl) => { const w = ARMES.get(table); if (!w) throw new Error('arme inconnue : ' + table); return { n, att: L(lvl), ...w }; };
// attaque au format des livres « seuil/RU+X/M+Y »
const livre = (n, x, y, melee = true) => ({ n, att: x * 2, prec: 0, puis: y, melee });
const poing = (lvl) => arme('Coup de poing', 'Coup de poing', lvl);
const P = 'pa6-'; let n = 0; const id = (k) => P + k;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [poing(1)], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});
const MINI = 'Pas de caractéristiques dans le livre : fiche minimale (valeurs humaines moyennes par défaut).';
const PSI_MINI = 'Psi sans caractéristiques dans le livre : fiche minimale (valeurs moyennes par défaut).';

// =============== Étape 1 : démons de Bifrons (p. 100) ===============
const mortau = npc('mortau', {
  nom: 'Dr Alain Mortau, le dentiste fou', source: 'Démon de Bifrons, grade 2, chef de la bande', type: 'demon', car: car('4 3 4 5 1 3'), def: L(6),
  pp: 26, pfFix: 9, seuilsFix: seuils('6/12/18/24'),
  armes: [livre('Scalpel, fraise, instruments divers', 5, 4), livre('Décharge électrique (portée moyenne)', 5, 7, false)],
  pouvoirs: pows('Champ électrique 4, Champ magnétique 6, Décharge électrique 4, Immunité contre l\'électricité, Rebond 4'),
  talents: 'Baratin 1, Combat 3 (scalpel, fraise et instruments divers 6), Défense 6, Discrétion 3, Médecine 2, Métier : dentiste 2, Sixième sens 3, Survie 2 (bizutage 4), Torture 7',
  notes: `Le cliché du dentiste sadique à pousser au maximum : blouse blanche tachée, voix suraiguë ridicule, petites lunettes rondes, cheveux châtains frisés, lèvres minces et sourire sardonique ; 1,80 m, très baraqué. Mauvais praticien, peu de clientèle. Maison de brique et de silex à Montreuil (cabinet au rez-de-chaussée, appartements à l'étage, « laboratoire » à la cave). Amateur de vin. Le livre écrit son nom Mortau ou Morteau.
Il opère toujours avec un complice et une grande lame ; il épargne Firmin, dégoûté par ses dents.
Instruments : précision −2, puissance +0 dans le livre (63/RU+5/M+4) ; Décharge électrique 64/RU+5/M+7.
Rôle pour la suite : s'il reste libre, c'est lui qui greffe les cerveaux sur les gorilles (étape 3) ; il peut réapparaître à Sceaux.`,
});
const polo = npc('polo', {
  nom: 'Polo Jarmish', source: 'Démon de Bifrons, grade 1', type: 'demon', car: car('4 5 2 1 3 4'), def: L(7),
  pp: 13, pfFix: 5, seuilsFix: seuils('6/12/18/24'),
  armes: [livre('Machin qui fait boum (portée longue, pénétration importante)', 4, 4, false), poing(5)],
  pouvoirs: pows('Déphasage 2, Illusions 2, Invisibilité 2'),
  talents: 'Acrobatie 8, Corps à corps 5, Défense 7, Discrétion 8, Tir 3 (armes d\'épaule 6)',
  notes: `Belles moustaches noires et vraie tête de malfrat. Spécialiste de la filature discrète.
Arme d'épaule « machin qui fait boum » : 64/RU+4/M+4 dans le livre. Coup de poing ajouté (Corps à corps 5).`,
});
const martinez = npc('martinez', {
  nom: 'Alexandre Martinez', source: 'Démon de Bifrons, grade 0', type: 'demon', car: car('3 4 3 2 3 3'), def: L(4),
  pp: 9, pfFix: 5, seuilsFix: seuils('5/10/15/20'),
  armes: [livre('Jet d\'acide (portée très courte, pénétration importante)', 3, 6, false), poing(4)],
  pouvoirs: pows('Adhérence 1, Détection des ennemis 1, Jet d\'acide 2'),
  talents: 'Acrobatie 4, Aisance sociale 3, Baratin 3, Conduite 5, Corps à corps 4, Défense 4, Discrétion 5, Enquête 3, Fouille 4, Informatique 4, Intrusion 5',
  notes: `Tête de grenouille aux gros yeux globuleux : Alonzo peut en donner une description précise après l'agression ratée, et Aurélie peut le photographier.
Jet d'acide : 46/RU+3/M+6 dans le livre. Coup de poing ajouté (Corps à corps 4).`,
});
const mabel = npc('mabel', {
  nom: 'Mabel Otruc', source: 'Démon de Bifrons, grade 1, secrétaire (et maîtresse) de Mortau', type: 'demon', car: car('5 4 1 3 2 3'), def: L('7+'),
  pp: 20, pfFix: 9, seuilsFix: seuils('7/14/21/28'),
  armes: [livre('Ongles d\'acier', 9, 7), livre('Ongles d\'acier (combo)', 9, 10)],
  pouvoirs: pows('Augmentation de Force 4, Forme de combat 4, Graisse 4, Membre exotique : ongles d\'acier'),
  talents: 'Athlétisme 6, Conduite 6, Corps à corps 8+, Défense 7+, Intimidation 5, Médecine 2, Séduction 1+',
  notes: `Faux air de Cruella ; trop maigre et habillée trop jeune pour son âge. Sert d'appât (elle fait signe à Firmin de venir l'aider). Ses bas servent de cagoules aux deux plaisantins du FLG.
Combo : elle active ses quatre pouvoirs d'un coup pour 10 PP, pendant 1 minute ; Force 8 et protection 6 (non comptée sur la fiche : à ajouter en combat). Ongles d'acier 66/RU+9/M+7, M+10 avec la combo.`,
});

// =============== Étape 2 : démons de Caym (p. 103-104) ===============
const lucien = npc('lucien', {
  nom: 'Lucien Darfin', source: 'Démon de Caym, grade 2, chef de l\'enlèvement', type: 'demon', car: car('4 4 2 5 4 4'), def: L(6),
  pp: 31, pfFix: 9, seuilsFix: seuils('6/12/18/24'),
  armes: [livre('Griffes', 7, 8), livre('« Fusil à éléphant » (portée moyenne)', 5, 8, false)],
  pouvoirs: pows('Absorption de violence 4, Détection du bien 4, Esquive acrobatique 4, Membre exotique : griffes, Poison 6, Transformation 6, Vitesse 4'),
  talents: 'Baratin 5, Corps à corps 7, Défense 6, Discussion 6, Médecine 4, Survie 7, Tir 4 (armes d\'épaule 7)',
  notes: `La soixantaine, taille moyenne, cheveux et yeux gris ; commerçant retraité, propriétaire de la maison de Sceaux. Cruel, ambitieux, violent et tyrannique avec ses hommes : il a déjà exécuté ceux qui « dérapaient ». La cassette du FLG le met hors de lui.
Fusil à éléphant (cadeau d'un grade 3 de Kobal) : précision −3, puissance +8 (64/RU+5/M+8) ; il tire des éléphants de 4 tonnes qui se dissipent en une heure. Griffes 66/RU+7/M+8.`,
});
const jussyFannotNote = (desc) => `${desc}
Les deux plaisantins du « Front de libération des gorilles » : étudiants (véto et chaudronnerie), ils tournent la fausse revendication chez Mortau, visage couvert d'un bas, et l'envoient aux télés. Le livre donne un seul profil pour les deux.
Aucune arme dans le livre : coup de poing au niveau de Corps à corps (5).`;
const anthony = npc('anthony', {
  nom: 'Anthony Jussy', source: 'Démon de Caym, grade 0, plaisantin du FLG', type: 'demon', car: car('3 3 4 2 3 3'), def: L(5),
  pp: 10, pfFix: 5, seuilsFix: seuils('5/10/15/20'),
  armes: [poing(5)], pouvoirs: pows('Esquive acrobatique 2, Transformation 2'),
  talents: 'Baratin 4, Corps à corps 5, Défense 5, Discrétion 4, Hobby : art Caym 4, Humour 3',
  notes: jussyFannotNote('Petit, blond, une cicatrice en travers de la joue (l\'attribution de la description à l\'un ou l\'autre est libre).'),
});
const christian = npc('christian', {
  nom: 'Christian Fannot', source: 'Démon de Caym, grade 0, plaisantin du FLG', type: 'demon', car: car('3 3 4 2 3 3'), def: L(5),
  pp: 10, pfFix: 5, seuilsFix: seuils('5/10/15/20'),
  armes: [poing(5)], pouvoirs: pows('Esquive acrobatique 2, Transformation 2'),
  talents: 'Baratin 4, Corps à corps 5, Défense 5, Discrétion 4, Hobby : art Caym 4, Humour 3',
  notes: jussyFannotNote('Taille moyenne, roux en brosse, zozote ; il court vite (ce qui peut lui sauver la vie). Bon candidat pour le délateur.'),
});
const gorilleCaym = npc('gorille-caym', {
  nom: 'Gorille de Caym', source: 'Démon de Caym, grade 1 (la dizaine de sbires de Lucien)', type: 'demon', car: car('5 3 3 3 2 2+'), def: L(6),
  pp: 2, pfFix: 8, seuilsFix: seuils('7/14/21/28'),
  armes: [livre('Crocs (portée lutte, 1 PP)', 7, 6), livre('Ongles d\'acier (2 PP)', 7, 7), arme('Fusil à fléchettes tranquillisantes', 'Carabine', 5)],
  pouvoirs: pows('Champ de force 2, Membre exotique : crocs, Membre exotique : ongles d\'acier, Transformation 4'),
  talents: 'Athlétisme 5, Conduite 4, Corps à corps 6, Défense 6, Tir 3 (armes d\'épaule 5)',
  notes: `Démons-braconniers urbains qui prennent forme de gorille pour l'enlèvement. Valeurs identiques au « Gorille de Caym » du bestiaire de l'appli.
Crocs 66/RU+7/M+6, ongles d'acier 66/RU+7/M+7. Le fusil (fléchettes anesthésiantes du zoo) n'a pas de profil dans le livre : profil de carabine estimé, effet tranquillisant à l'appréciation du MJ.`,
});

// =============== Étape 3 : gorilles psioniques-zombies-cyborgs (p. 106) ===============
const GOR = 'Gorille du zoo tué par la greffe d\'un cerveau de psi, ranimé par l\'âme d\'un damné envoyée par Bifrons : un familier amélioré (type Familier dans la fiche, pour le camp démoniaque ; seuils du livre). Plaques et écrous dépassent du crâne. Les pouvoirs marqués * sont d\'origine psionique (hérités du squatteur). Gadgets au choix du MJ (lance-grenades dans le bras, gatling dans le nombril, laser dans l\'œil…) et grenades de Vapula qui neutralisent les systèmes de sécurité.';
const gorille = (key, nom, o) => npc(key, { nom, source: 'Gorille psionique-zombie-cyborg', type: 'familier', ...o, notes: [o.notes, GOR].filter(Boolean).join('\n') });
const bart = gorille('bart', 'Bart', {
  car: car('5 5 4 2 3 2'), def: L('4+'), prot: 2, pp: 15, pfFix: 7, seuilsFix: seuils('6/13/19/26'),
  armes: [livre('Poings (non létal)', 4, 5), livre('Télékinésie (portée moyenne, 1 PP)', 2, 4, false)],
  pouvoirs: pows('Champ de force 4, Invisibilité 2, Régénération 2, Télékinésie 3'),
  talents: 'Acrobatie 3, Athlétisme 4, Corps à corps 4+, Défense 4+, Discrétion 3',
  notes: 'Psioniques : Champ de force*, Invisibilité*, Télékinésie*. Poings précision +0, puissance +0 (61/RU+4/M+5) ; Télékinésie 43/RU+2/M+4. 2 points de protection naturelle. Mêmes valeurs que le « Gorille psionique-zombie-cyborg » du bestiaire.',
});
const homere = gorille('homere', 'Homère', {
  car: car('7 4 3 2 2 3'), def: L(4), prot: 3, pp: 15, pfFix: 9, seuilsFix: seuils('8/17/25/34'),
  armes: [livre('Poings', 4, 7), livre('Grandes cornes (3 PP)', 4, 11)],
  pouvoirs: pows('Armure corporelle 4, Membre exotique : grandes cornes, Régénération 2, Onde de choc 4'),
  talents: 'Athlétisme 5, Corps à corps 4, Défense 4',
  notes: 'Psioniques : Armure corporelle (pierre)*, Onde de choc*. Poings 55/RU+4/M+7, grandes cornes 55/RU+4/M+11. 3 points de protection naturelle.',
});
const marge = gorille('marge', 'Marge', {
  car: car('6 3 4 3 2 3'), def: L('4+'), prot: 2, pp: 15, pfFix: 9, seuilsFix: seuils('7/15/22/30'),
  armes: [livre('Poings', 4, 6), livre('Jet de flammes (2 PP)', 6, 6, false)],
  pouvoirs: pows('Immunité contre le feu, Jet de flammes 4, Régénération 2, Tourbillon de feu 2, Vol 3'),
  talents: 'Acrobatie 2, Athlétisme 4, Corps à corps 4+, Défense 4+, Kama-sutra 3, Séduction 3',
  notes: 'Psioniques : Immunité contre le feu*, Jet de flammes*, Tourbillon de feu*. Poings 61/RU+4/M+6, jet de flammes 65/RU+6/M+6. 2 points de protection naturelle.',
});
const lisa = gorille('lisa', 'Lisa', {
  car: car('4 4 5 4 2 2'), def: L('4+'), prot: 2, pp: 15, pfFix: 8, seuilsFix: seuils('5/11/16/22'),
  armes: [livre('Poings', 4, 4)],
  pouvoirs: pows('Élastique 4, Étouffement 2, Régénération 4, Volonté supra-normale 2'),
  talents: 'Acrobatie 3, Athlétisme 3, Corps à corps 4+, Défense 4+, Science 3, Technique 3',
  notes: 'Psioniques : Élastique*, Étouffement*. Poings 61/RU+4/M+4. 2 points de protection naturelle.',
});
const maggie = gorille('maggie', 'Maggie', {
  car: car('6 5 4 2 2 2'), def: L('4+'), prot: 3, pp: 13, pfFix: 8, seuilsFix: seuils('7/15/22/30'),
  armes: [livre('Rapière', 5, 7), poing('3+')],
  pouvoirs: pows('Forme de combat 2, Membre exotique : queue barbelée, Obscurité 4, Régénération 2, Téléportation 2'),
  talents: 'Acrobatie 3, Athlétisme 4, Combat 2+ (épées 4+), Corps à corps 3+, Défense 4+, Discrétion 4',
  notes: 'Psioniques : Obscurité*, Téléportation*. Rapière 63/RU+5/M+7. Queue barbelée sans profil dans le livre (coup de poing ajouté au niveau de Corps à corps). 3 points de protection naturelle.',
});
const milouze = gorille('milouze', 'Milouze', {
  car: car('5 4 3 5 2 2'), def: L('4+'), prot: 2, pp: 15, pfFix: 10, seuilsFix: seuils('6/13/19/26'),
  armes: [livre('Poings', 3, 5)],
  pouvoirs: pows('Charme 4, Paralysie 2, Régénération 2, Télépathie 4, Volonté supra-normale 2'),
  talents: 'Acrobatie 3, Athlétisme 3, Corps à corps 3, Défense 4+, Discrétion 3',
  notes: 'Psioniques : Charme*, Paralysie*, Télépathie*. Poings 46/RU+3/M+5. 2 points de protection naturelle.',
});

// =============== Étape 3 : Ozgur et ses acolytes (p. 107) ===============
const ozgur = npc('ozgur', {
  nom: 'Ozgur Phalange', source: 'Démon de Bifrons, grade 3, exécutant du plan sur Terre', type: 'demon', car: car('5 4 3 5 4 5'), def: L(7),
  pp: 41, pfFix: 10, seuilsFix: seuils('7/14/21/28'),
  armes: [livre('Crosse maudite majeure', 11, 9)],
  pouvoirs: pows('Adhérence 4, Anaérobiose, Armure corporelle 6, Boomerang 4, Éventration 6, Immunité contre le froid, Jeûne, Nécrose 6, Régénération 6, Résurrection macabre 7, Volonté supra-normale 4'),
  talents: 'Baratin 6, Combat 5 (contondantes 9), Défense 7, Discussion 4, Médecine 3',
  notes: `La cinquantaine, grand, bronzé aux UV, yeux bleus, sourire de séducteur carnassier. Visiteur médical, coureur de jupons. Grade 3 récent, perfectionniste, il veut faire ses preuves auprès de Bifrons et recycle l'idée du FLG pour signer les attentats.
Crosse maudite majeure : précision +5, puissance +4 (66/RU+11/M+9).
Il ne fuit pas lors de l'assaut final.`,
});
const lili = npc('lili', {
  nom: 'Lili Delanoix', source: 'Démon de Furfur, grade 2, acolyte d\'Ozgur', type: 'demon', car: car('5 3 2 3 4 5'), def: L(5),
  pp: 29, pfFix: 8, seuilsFix: seuils('7/14/21/28'),
  armes: [livre('Poings (arts martiaux)', 6, 6)],
  pouvoirs: pows('Arts martiaux 6, Hurlement démoniaque 3, Lecture d\'aura 3, Lire les pensées 3, Suicide 6, Téléportation 6'),
  talents: 'Baratin 6, Corps à corps 5, Défense 5, Discrétion 4, Intrusion 3, Séduction 3',
  notes: 'Grande bringue blonde décolorée aux dents en avant. Poings : précision +3, puissance +1 (66/RU+6/M+6).',
});
const valery = npc('valery', {
  nom: 'Valéry Lepers', source: 'Démon de Vapula, grade 2, inventeur', type: 'demon', car: car('3 1 3 6 2 4'), def: L(2),
  pp: 40, pfFix: 9, seuilsFix: seuils('5/10/15/20'),
  armes: [livre('Emberlificoteur (boule de laine)', 1, 0, false)],
  pouvoirs: pows('Absorption de volonté 6, Augmentation de Volonté 6, Esprits multiples 2, Invention 6, Parasite intellectuel 2, Volonté supra-normale 6'),
  talents: 'Corps à corps 2, Défense 2, Médecine 5, Science 7, Technique 7, Tir 3',
  notes: `Immense dadais dégarni, myope comme une taupe. Fournisseur des gadgets des gorilles (grenades anti-sécurité, jet-packs…).
Emberlificoteur : précision −3, pas de dégâts (33/RU+1/–). La cible touchée perd 1d6 points d'Agilité (à 0 ou moins, elle ne peut plus bouger) ; un round d'effort et un test de Force réussi retirent un point d'emberlificotage. Dégâts mis à 0 sur la fiche : appliquer l'effet à la main.`,
});
const marcel = npc('marcel', {
  nom: 'Marcel Ségur', source: 'Démon de Bifrons, grade 2, acolyte d\'Ozgur', type: 'demon', car: car('6 4 4 1 1 6'), def: L(5),
  pp: 26, pfFix: 7, seuilsFix: seuils('8/16/24/32'),
  armes: [livre('Hache de bataille rouillée', 7, 9)],
  pouvoirs: pows('Arme exaltée 6, Armure corporelle 6, Douleur 4, Peur 4, Résurrection macabre 6, Ténèbres sataniques 4'),
  talents: 'Combat 4 (haches 7), Défense 5, Torture 6',
  notes: 'Large d\'épaules, cheveux gris, mâchoire carrée, tape fort. Hache : 66/RU+7/M+9 (et risque de tétanos). Peut aussi être le démon de Bifrons qui échange les mails avec Ozgur (au choix du MJ).',
});

// =============== PNJ sans caractéristiques ===============
const hercule = npc('hercule', {
  nom: 'Hercule', source: 'Patron de la DTC, héros païen', type: 'paien', car: car('4 3 2 2 2 3'),
  notes: `Reçoit Pierre et Lucas (étape 1) puis Jordi (étape 2) et confie les missions aux PJ. Peut transmettre l'information d'Échelon à l'étape 3 si le MJ le préfère. Ses services peuvent identifier Mortau d'après la photo d'Aurélie.
Ses caractéristiques sont au ch. 4 (p. 21) ; non reprises ici, il ne combat pas dans ce scénario. Valeurs de la fiche indicatives.`,
});
const pierre = npc('pierre', {
  nom: 'Pierre Milon', source: 'Psi, « leader » du squat de Montreuil', type: 'psi',
  notes: `24 ans, grand et maigre, cheveux châtains en brosse, sourires trop larges, regard fuyant, un peu faux-jeton. Étudiant en psycho, psi assez doué. L'immeuble appartient en secret à son père, très riche (et non psi), qui paie la DTC. Lucas demande qu'on le protège en priorité : sans lui, plus de squat.
Dernier sur la liste des démons.\n${PSI_MINI}`,
});
const lucas = npc('lucas', {
  nom: 'Lucas Dupré', source: 'Psi, meilleur ami de Pierre, vrai ciment du squat', type: 'psi',
  notes: `Ivoirien, 1,95 m, cheveux très courts, regard doux ; étudiant en médecine (5e année). Réfléchi, diplomate, apaise les conflits, soigne les bobos. Rationnel et coopératif : c'est l'interlocuteur le plus utile aux PJ (il sait que l'immeuble est à Pierre). Il propose la DTC et se porte volontaire comme appât pour un « plan chèvre ». Avant-dernier sur la liste : sa survie dépend des PJ.\n${PSI_MINI}`,
});
const alonzo = npc('alonzo', {
  nom: 'Alonzo Gracco', source: 'Psi téléporteur, prof d\'espagnol', type: 'psi',
  pouvoirs: pows('Téléportation 4'),
  notes: `Brun, barbu, lunettes, teint mat, très colérique. Attaqué par Mabel et Martinez sur le chemin du lycée, il se téléporte au squat in extremis. Il décrit précisément Martinez, reconnaîtrait Mabel, a entrevu une grande lame… et a senti une odeur de clou de girofle (l'odeur des cabinets dentaires).
Niveau de Téléportation non donné : estimé.\n${PSI_MINI}`,
});
const squatteurs = npc('squatteurs', {
  nom: 'Les autres squatteurs', source: 'Une vingtaine de jeunes psis aisés (une dizaine à demeure)', type: 'psi',
  notes: `Victimes déjà décapitées : Georges-Antoine Delapierre (punk provocateur, disputé avec Alicia la veille), Alicia Latour (étudiante à HEC), Alister Mock (menuisier roux, apprécié).
Prochaines cibles, dans l'ordre : Sébastien Huart (pâle et sensible ; il découvre le premier corps, puis doit mourir quoi qu'il arrive), Alonzo (s'échappe), Arnold Elmer (allure de brute, en fait poète cultivé), Firmin Stragu (dents répugnantes, postillonne : épargné par Mortau), Aurélie Lillian (blondinette bavarde et soupe au lait, amoureuse d'Alister ; peut photographier ses agresseurs), Lucas, Pierre.
Ambiance : communauté anar-bourgeoise, sans électricité, réchauds, sacs de couchage, débats sans fin ; hostile à la police.\n${PSI_MINI}`,
});
const delabarre = npc('delabarre', {
  nom: 'Madame Delabarre', source: 'Vieille voisine de Mortau, à Montreuil',
  notes: `Passe ses journées à sa fenêtre du premier étage à espionner le voisinage ; désagréable mais précieuse. Aime la camomille et les sonates de Chopin, déteste qu'on salisse son parquet. Les PJ doivent sentir qu'on les observe dès l'étape 1.
Étape 2 : elle a vu des hommes patibulaires charger des cages dans un gros camion ; si les PJ sont aimables, boivent son infusion et respectent son parquet, elle donne l'immatriculation, qui mène à Sceaux.\n${MINI}`,
});
const jordi = npc('jordi', {
  nom: 'Jordi', source: 'Archange des animaux, commanditaire de l\'étape 2', type: 'ange',
  notes: `Inquiet pour les gorilles et surtout de voir la main de ses propres anges derrière le FLG : il préfère engager la DTC plutôt que ses troupes ou d'autres anges, par fierté. Une fois convaincu que ses anges sont innocents, il détache l'un d'eux auprès des PJ et exige qu'on élimine les démons responsables. À l'étape 3, il (ou son ange) transmet les mails interceptés par Échelon ; ses anges peuvent servir de cavalerie à l'usine.
Pas de caractéristiques dans ce scénario : fiche indicative.`,
});
const angeJordi = npc('ange-jordi', {
  nom: 'L\'ange de Jordi', source: 'Ange détaché auprès des PJ (étapes 2-3)', type: 'ange',
  notes: `Accompagne et assiste les PJ dans leurs recherches ; porteur possible de l'information d'Échelon. À créer selon la puissance du groupe.
Pas de caractéristiques dans le livre : fiche indicative.`,
});
const armand = npc('armand', {
  nom: 'Armand', source: 'Gardien de nuit du zoo de Vincennes',
  notes: `Quinze ans de maison, fait sa sieste après ses rondes, laisse quelques sans-abri dormir dans le zoo. N'a rien vu, rien entendu. Ne néglige aucune piste et fait confiance à Henri : c'est par lui que les PJ entendent parler du témoin.\n${MINI}`,
});
const henri = npc('henri', {
  nom: 'Henri', source: 'SDF alcoolique, témoin de l\'enlèvement',
  notes: `Dormait dans un fourré près de la cage. Il raconte avoir vu une bande de gorilles armés de fusils venir « libérer » les pensionnaires ; le dernier lui a fait signe de se taire. Il a entendu ensuite un gros moteur (camion). Personne ne l'a cru. Son témoignage oriente vers des démons de Caym (transformation animale).\n${MINI}`,
});

const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  // ---------------- Étape 1 ----------------
  scene('squat', '1. Étape 1 – Le squat de Montreuil', 'Immeuble « squatté » près d\'un grand parc, Montreuil',
    `Ouverture de « La cervelle au girofle ». Trois squatteurs ont disparu en quelques jours (Georges-Antoine, Alicia, Alister) en laissant leurs affaires. Pendant que Pierre et Lucas s'en inquiètent, Sébastien, en sortant la poubelle, trébuche sur un corps décapité à demi caché sous un arbuste : Georges-Antoine, mort depuis quelques jours.
Lucas impose le silence (pas de police : les jeunes psis craignent l'expulsion et tiennent à leur discrétion) et propose la DTC ; Pierre soutire une grosse somme à son père sous un prétexte bidon.
Hercule confie aux PJ : trouver l'assassin, récupérer la tête avant quiconque, retrouver Alicia et Alister (entiers si possible) et, à la demande de Lucas, protéger Pierre.
Interrogatoires : peu productifs (portraits croisés, langues de vipère) ; la dispute violente entre Georges-Antoine et Alicia la veille de sa disparition rend Alicia suspecte tant qu'on n'a pas trouvé son corps. Lucas est le plus utile et révèle que l'immeuble est au père de Pierre.`,
    [inScene(pierre), inScene(lucas), inScene(squatteurs), inScene(hercule)]),
  scene('cadavres', '2. La découverte des cadavres', 'Jardin du squat, puis ancienne fabrique désaffectée sur le chemin du métro',
    `• Georges-Antoine : vêtu, aucune autre blessure, mort le soir de la dispute ; trop peu de sang sous le buisson, il a été tué ailleurs. Tête tranchée proprement.
• Lieu du meurtre : près d'une petite mare artificielle cachée par la verdure, loin de la maison (où il aimait traîner) : traces de lutte, sang sous un grand arbre et, en cherchant très bien, un éclat de lame de scalpel. Les tueurs l'attendaient et ont agi vite et en silence ; le scalpel servait à ne pas abîmer la tête, qui devait rester utilisable.
• Alister : décapité de la même façon, coincé à trois mètres dans le feuillage d'un arbre (sang au pied et sur le tronc ; il a fallu être costaud). Ses affaires de travail dans un buisson : pris au départ, tôt le matin.
• Alicia : aucune trace au squat. Il faut suivre son trajet vers HEC (Aurélie le connaît) : elle coupait par une fabrique désaffectée pour rejoindre le métro. Sang près d'un bâtiment, corps à l'intérieur, même mode opératoire, pas d'autre indice.
Reste à décider quoi faire des corps (avec les squatteurs et la DTC).`,
    [inScene(squatteurs)]),
  scene('traque', '3. Gare à vos têtes !', 'Montreuil : rues et parcs entre le squat et la maison du dentiste',
    `En coulisses : quatre démons de Bifrons (Mortau, Polo, Martinez, Mabel) doivent rapporter 5 à 10 cerveaux de psis, conservés en cuves (fluide, sang artificiel, oxygénateur) pour être greffés plus tard. Ils en ont trois. Ils n'opèrent plus dans le jardin du squat : ils suivent leurs cibles et les décapitent, toujours à deux, dans un coin discret près de chez Mortau (qui habite non loin), car le prélèvement doit être rapide.
Planning (au MJ de dérouler selon les progrès des PJ ; Sébastien doit mourir, pour garantir au moins quatre gorilles) :
• Sébastien, attiré pour tailler la haie d'une maison inoccupée, y est tué ; corps laissé sur place.
• Alonzo, suivi vers son lycée par Mabel et Martinez, se téléporte au dernier moment : description de Martinez, aperçu de Mabel et d'une grande lame, odeur de clou de girofle.
• Arnold : corps retrouvé dans une poubelle si les PJ piétinent.
• Firmin, attiré dans un parc par Mabel jouant la femme en détresse, tombe sur Mortau (en blouse si le MJ veut aider) qui renonce, écœuré par ses dents, et s'enfuit avec Mabel.
• Aurélie peut photographier Mortau et Martinez avec son portable avant d'être tuée : la DTC identifie le dentiste.
• Puis Lucas et Pierre. Si tous y passent, le squat se disperse et les meurtres cessent.
Déductions : meurtres tous situés entre le squat et la maison du dentiste ; girofle + lame + dents → un dentiste ; les pages jaunes recoupées donnent une ou deux adresses, dont celle de Mortau.
Plan chèvre : un squatteur sous surveillance (Lucas se porte volontaire) peut permettre de coincer deux des démons.
Dès qu'ils se sentent repérés, les démons préviennent leurs chefs, qui déplacent les cerveaux chez un démon de Caym à Sceaux (puis les cages). Comptez les cerveaux récoltés : c'est le nombre de gorilles de l'étape 3.`,
    [inScene(alonzo), inScene(mortau), inScene(mabel), inScene(martinez), inScene(polo)], true,
    [choice('chevre', 'Les PJ tendent-ils un piège (plan chèvre) ?', [
      ['Oui, et il réussit', 'Deux des quatre démons (le binôme envoyé) sont tués ou capturés ; les deux autres se replient chez Mortau et l\'alerte est donnée : les cerveaux partent pour Sceaux.'],
      ['Oui, mais il rate', 'L\'appât (souvent Lucas) risque sa tête ; les démons, méfiants, accélèrent le déménagement.'],
      ['Non', 'Les meurtres continuent selon le planning jusqu\'à ce que les PJ remontent jusqu\'au dentiste.'],
    ])]),
  scene('mortau', '4. Chez le docteur Mortau', 'Maison de brique et de silex du Dr Mortau, Montreuil (cabinet, étage, cave-laboratoire)',
    `Rez-de-chaussée : cabinet dentaire à l'ancienne, salle d'attente, secrétariat, cuisine. Étage : appartements. Une porte mène à la cave : néons, humidité, crasse, matériel chirurgical (voire de bûcheron), cuves de liquide épais et bouillonnant reliées à des tuyaux, table d'opération, sang partout, bocaux d'expériences, bonne cave à vin, matériel vidéo et deux grandes cages vides au fond. Ambiance de film gore grotesque.
Bagarre : les démons restants sont là (éventuellement avec deux ou trois démons de Caym venus aider) ou arrivent pendant la fouille. Un ou deux peuvent s'échapper, ce qui désigne les PJ comme fauteurs de troubles pour la suite.
À placer absolument pour l'étape 2 :
• un détail caractéristique de la maison (cloche fêlée voisine qui rate un « dong », pendule ou vase d'une laideur mémorable…) qui réapparaîtra sur la cassette du FLG ;
• Madame Delabarre à sa fenêtre : les PJ se sentent épiés jusqu'à découvrir que ce n'est que la voisine.
Aucun autre lien avec la suite pour l'instant. Reste à régler le sort des corps et des démons capturés, avec les squatteurs et la DTC.`,
    [inScene(mortau), inScene(mabel), inScene(martinez), inScene(polo), inScene(gorilleCaym, { qty: 2 }), inScene(delabarre)], true,
    [choice('dentiste', 'Qu\'advient-il du Dr Mortau ?', [
      ['Tué ou capturé', 'Un autre démon aussi « doué » le remplace pour les greffes ; les PJ ont arrêté le carnage.'],
      ['En fuite', 'Il pratiquera lui-même les greffes à Sceaux et pourra y être retrouvé à la fin de l\'étape 2.'],
    ])]),

  // ---------------- Étape 2 ----------------
  scene('jordi', '5. Étape 2 – Jordi à la DTC', 'Locaux de la DTC, Paris (quelque temps après l\'étape 1)',
    `« Ainsi, par le zoo tout sera » : à jouer après un autre scénario, ou en parallèle. Les sept gorilles du zoo de Vincennes ont disparu dans la nuit il y a quelques jours (affaire très médiatisée, ni trace ni témoin officiel). Nouveauté : plusieurs chaînes ont reçu une cassette de revendication du Front de libération des gorilles.
Jordi, archange des animaux, veut des extérieurs : il s'inquiète du sort des bêtes et craint que certains de ses anges soient derrière le FLG. Il engage la DTC.
En coulisses (la nuit de l'enlèvement) : une dizaine de démons de Caym armés de fusils franchissent le mur, se changent en gorilles, forcent la cage, endorment les vrais gorilles aux fléchettes et les emmènent en camion, alarme déclenchée trop tard. Le dernier de la file a vu Henri dans un fourré et lui a fait « chut ». Direction Sceaux, chez Lucien Darfin, où attendent des cages (dont celles de Mortau). En route, un gorille mal endormi s'échappe à Sceaux : il en reste six.`,
    [inScene(jordi), inScene(hercule)]),
  scene('zoo', '6. L\'enquête du zoo', 'Zoo de Vincennes, associations, marchés de gros',
    `• Armand, le gardien : n'a rien vu, mais mentionne Henri, à qui il fait confiance.
• Henri : décrit la scène devant la cage (gorilles armés, le « chut », un moteur de camion). Personne ne l'a cru. Pour qui sait que les démons de Caym prennent forme animale, la piste est claire.
• SPA, WWF : rencontres hautes en couleur, mais fausses pistes.
• Idées farfelues à récompenser (grossistes en bananes, Rungis…) : elles peuvent mener à l'adresse de Sceaux, mais les PJ arriveront après le départ des gorilles.
• Le gorille évadé est retrouvé à Sceaux peu après (parc de la ville, ou il saccage le lycée Lakanal) : indice que l'affaire se passe à Sceaux, sans plus.`,
    [inScene(armand), inScene(henri)]),
  scene('flg', '7. La cassette du FLG et la voisine', 'Maison de Mortau à Montreuil ; repaire de Sceaux (en coulisses)',
    `En coulisses : venus chercher les cages chez Mortau, les démons de Caym trouvent son matériel vidéo. Anthony et Christian, cagoulés avec des bas de Mabel, improvisent une revendication grandiloquente (libération de tous les gorilles, monument à Dian Fossey) ; tout le monde rit, et ils l'envoient aux télés. Lucien, furieux de ce manque de professionnalisme, les houspille : la dissension s'installe.
Pistes :
• Sur la cassette, le détail caractéristique de chez Mortau placé à l'étape 1 (bruit, objet) : les PJ doivent avoir l'impression de l'avoir repéré eux-mêmes. Ils ont aussi vu les cages dans la cave.
• Chez Mortau : cages disparues, matériel vidéo en place (la cassette a été tournée ici).
• Madame Delabarre : a vu des hommes patibulaires charger des cages dans un gros camion. Avec politesse, infusion et parquet propre, elle donne l'immatriculation → Sceaux.
• Le délateur : l'un des deux plaisantins, viré de l'affaire (ou en fuite après que Lucien a exécuté son complice pour « dérapage »), se venge en livrant l'adresse à la DTC, sans rien dire du but de l'opération.
Cerveaux de psis + gorilles : les joueurs devraient commencer à comprendre.`,
    [inScene(delabarre), inScene(christian)], false,
    [choice('delateur', 'Lucien exécute-t-il l\'un des plaisantins du FLG ?', [
      ['Oui', 'L\'autre (le roux, qui court vite) s\'enfuit et dénonce la bande à la DTC.'],
      ['Non, il est seulement viré', 'Rancunier, il livre quand même l\'adresse de Sceaux à la DTC.'],
    ])]),
  scene('sceaux', '8. Bagarre à Sceaux', 'Propriété de Lucien Darfin, Sceaux',
    `Si les PJ trouvent la propriété, les gorilles en sont déjà partis, greffés. Restent des démons de Caym qui rangent et effacent les traces (et peut-être des survivants de l'étape 1, Mortau compris) : grosse bagarre.
Sur place : cages vides, bacs à cerveaux vides (sauf cerveaux en surplus) et les cerveaux des gorilles dans un ou deux seaux. Aucun indice vers l'étape 3.
Fin de l'étape : la mission (retrouver les gorilles) n'est pas finie. Si les PJ ont prouvé que les anges n'y sont pour rien, Jordi exige l'élimination des démons et détache un de ses anges auprès d'eux ; sinon l'enquête continue. Hercule leur donne une autre mission en attendant une piste.
Si les PJ n'ont pas trouvé Sceaux : tant pis, les gorilles feront bientôt parler d'eux.`,
    [inScene(lucien), inScene(anthony), inScene(gorilleCaym, { qty: 4 }), inScene(mortau)], true,
    [choice('innocence', 'Les PJ ont-ils établi que les anges de Jordi sont innocents ?', [
      ['Oui', 'Jordi demande l\'élimination des démons et affecte un ange aux PJ ; c\'est lui qui apportera l\'information d\'Échelon.'],
      ['Non', 'Jordi maintient sa demande d\'enquête ; Hercule (ou Jordi en personne) transmettra l\'information plus tard.'],
    ])]),

  // ---------------- Étape 3 ----------------
  scene('renaissance', '9. Étape 3 – La méchante combo', 'Sceaux (en coulisses), puis banques de France et ciel d\'Europe',
    `Retour en arrière : avant la descente des PJ à Sceaux, Mortau (ou un démon aussi doué) greffe les cerveaux sur les gorilles, qui meurent dans l'opération comme prévu ; les pouvoirs survivent. Bifrons y loge l'âme d'un damné méritant : des familiers améliorés, gorilles psioniques-zombies-cyborgs (écrous et plaques sur le crâne), rebaptisés Bart, Homère, Marge, Lisa, Maggie et Milouze (autant qu'il reste de cerveaux et de gorilles). Plus faibles qu'une équipe d'anges ou de démons équivalente, mais redoutables.
Ozgur Phalange, grade 3 de Bifrons, les teste pour son prince : si l'essai réussit, Bifrons veut une armée. Vapula fournit les gadgets (grenades anti-sécurité, etc.).
1) Casses de banques de nuit dans toute la France, sans témoins, jusqu'au siège de la Banque de France : l'argent financera les explosifs.
2) Crash d'un avion de ligne : en jet-packs et combinaisons XXXXL, les gorilles se posent sur l'appareil en vol et détruisent les moteurs. Énorme bilan. Les rares survivants parlent de gorilles ; Bifrons recycle le FLG pour signer les attentats (on croira à des hommes déguisés) et pour ramener la DTC sur l'affaire.
Les PJ, sans piste, suivent l'actualité ; le crash et la revendication font le lien avec la cassette de l'étape 2.
Information providentielle (l'ange de Jordi, Jordi ou Hercule) : des mails décryptés par Échelon, sans adresse physique, échangés entre Ozgur et un autre démon de Bifrons. En substance : liste d'idées (barrage, centrales nucléaires, avions, tour Eiffel, prise d'otage du patron d'une enseigne de chasse et pêche), banques pour commencer, et le souhait du chef de tester les gorilles contre des anges et contre l'équipe d'Hercule. Trop de cibles possibles pour tout surveiller.`,
    [inScene(angeJordi), inScene(jordi)]),
  scene('gorilles', '10. Affrontement avec les gorilles', 'Selon le MJ : tour Eiffel (14 juillet, 31 décembre), centrale, barrage… ou là où sont les PJ',
    `Le MJ choisit les méfaits suivants et fait monter la pression sans dépasser les bornes (une attaque de centrale doit échouer). Si les PJ alertent les autorités, les sites sensibles sont renforcés ; reste à le faire discrètement.
Pour provoquer la rencontre : les gorilles viennent attaquer les PJ (objectif de Bifrons), ou les PJ devinent une cible et le MJ y place ses gorilles ; une date symbolique proche (14 juillet, Nouvel An) désigne la tour Eiffel pour un combat spectaculaire.
Grosse bagarre : n'aligner que les gorilles qui existent (selon les cerveaux récoltés à l'étape 1). Décrire les pouvoirs psioniques (*) comme des réminiscences des squatteurs, avec quelques souvenirs.
Pour la suite : un gorille peut avouer où se cachent ses maîtres, ou une étiquette avec l'adresse de l'usine Patachoco est collée sous un sac à dos.`,
    [inScene(bart), inScene(homere), inScene(marge), inScene(lisa), inScene(maggie), inScene(milouze)], true,
    [choice('cible', 'Où les PJ affrontent-ils les gorilles ?', [
      ['Les gorilles attaquent les PJ', 'Combat sur le terrain des PJ ; Bifrons teste ses créatures contre la DTC.'],
      ['Sur un site visé deviné par les PJ', 'Le MJ y place les gorilles ; attentat déjoué si les PJ gagnent.'],
      ['À la tour Eiffel', 'Combat spectaculaire lors d\'une date symbolique (14 juillet, Nouvel An).'],
    ])]),
  scene('patachoco', '11. Assaut à l\'usine Patachoco', 'Annexe « désaffectée » d\'une usine de pâte à tartiner chocolat-noisette, grande banlieue parisienne',
    `Le patron de l'usine, un démon, prête l'annexe aux démons de Bifrons et aux gorilles. Une partie de l'usine tourne normalement ; le site est petit, la planque facile à trouver. Les démons, prévenus du fiasco des gorilles, ne fuient pas : Bifrons ne leur pardonnerait pas de ne pas avoir essayé d'éliminer les PJ.
Décor à exploiter : glissades sur les noisettes, cuve de lait bouillant, bassin de chocolat fondu où noyer un adversaire…
Ozgur et ses trois acolytes (Lili, Valéry, Marcel), plus les gorilles survivants s'il en reste. Si le combat tourne mal pour les PJ, des anges de Jordi arrivent en renfort.
Fin : l'aventure est résolue ; avec un peu de chance, Bifrons sera déçu de ses gorilles.`,
    [inScene(ozgur), inScene(lili), inScene(valery), inScene(marcel)], true,
    [choice('fin', 'Comment se termine l\'assaut ?', [
      ['Victoire des PJ', 'Ozgur et ses acolytes éliminés ; Bifrons renonce (pour l\'instant) à son armée de gorilles. Jordi et la DTC sont satisfaits.'],
      ['Les PJ sont en difficulté', 'La cavalerie : des anges de Jordi interviennent pour sauver les PJ.'],
    ])]),
];

const scenario = {
  id: 'pa6-clint-eastwood',
  nom: 'Petites Apocalypses – La douloureuse absence de Clint Eastwood',
  resume: 'Scénario en trois étapes pour agents de la troisième Force employés par la DTC d\'Hercule, à espacer en intercalant d\'autres aventures. 1) La cervelle au girofle : des psis d\'un squat de Montreuil sont décapités par un dentiste fou, démon de Bifrons, et ses complices, qui collectent leurs cerveaux. 2) Ainsi, par le zoo tout sera : les gorilles du zoo de Vincennes disparaissent, enlevés par des démons de Caym, et un faux Front de libération des gorilles revendique l\'affaire ; Jordi engage la DTC. 3) La méchante combo : les cerveaux greffés sur les gorilles donnent des gorilles psioniques-zombies-cyborgs qu\'Ozgur Phalange, grade 3 de Bifrons, lâche sur des banques puis sur un avion de ligne, jusqu\'à l\'assaut final dans une usine de pâte à tartiner. Ton kitsch et grand-guignol assumé, beaucoup de bagarre.',
  notes: `Source : ${REF} ; adaptations p. 116.

Structure : trois étapes liées par l'histoire et par des indices (un détail de chez Mortau repéré à l'étape 1 réapparaît sur la cassette de l'étape 2 ; la voisine sert aux deux). Le livre conseille d'intercaler d'autres scénarios entre elles pour que les liens ne soient pas trop évidents. Chaque étape mêle un peu d'enquête et une grosse bagarre. Tout est à jouer dans l'excès : dentiste fou, FLG, gorilles psioniques-zombies-cyborgs.

Comptabilité des gorilles : chaque cerveau récolté à l'étape 1 (au moins quatre : Sébastien meurt quoi qu'il arrive) et chaque gorille livré à l'étape 2 (sept enlevés, un s'échappe) détermine combien de gorilles psioniques-zombies-cyborgs (six au maximum) affrontent les PJ à l'étape 3. Les PJ ne peuvent ni démanteler toute l'organisation à l'étape 1 ni retrouver les gorilles à l'étape 2 : il en faut pour la suite.

Commanditaires : étape 1, les squatteurs (argent du père de Pierre) ; étapes 2 et 3, Jordi.
Récompenses : le livre n'en donne pas. Suggestion : salaire DTC à chaque étape, modulé selon les squatteurs sauvés, les démons éliminés et les attentats évités.

Adaptations (ch. 14, p. 116) :
• INS : le livre juge l'adaptation quasi impossible, sauf équipe de démons ravie de saboter les projets de leurs collègues. Variante lourde : remplacer Bifrons par un renégat de Jean ; les gorilles ne sont alors plus zombies et il faut admettre une vraie greffe de cerveau réussie (limite du grotesque, reconnaît l'auteur).
• MV : le père de Pierre Milon est un soldat de Dieu qui, pour protéger son fils, obtient d'un grade 3 qui lui doit un service l'envoi d'une équipe d'anges. Pour les étapes 2 et 3, la même équipe est envoyée pour le compte de Jordi (moins méfiant que dans la version DTC, puisqu'il emploie alors des anges).
• Dans tous les cas, ajuster la puissance des adversaires à celle des PJ.

Fiches : caractéristiques, PP, PF, seuils et attaques repris du livre (vérifiés sur les pages 100-107). Attaques converties depuis la notation « seuil/RU+X/M+Y » (précision et puissance d'origine rappelées dans les notes). Estimations signalées dans les notes des fiches : coups de poing ajoutés aux démons sans arme au corps à corps, fusil à fléchettes des gorilles de Caym, Téléportation d'Alonzo, gorilles psioniques classés Familier, protection temporaire de la combo de Mabel non comptée. Les squatteurs, la voisine, Jordi, Hercule, Armand et Henri ont des fiches minimales.`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [mortau, polo, martinez, mabel, lucien, anthony, christian, gorilleCaym, bart, homere, marge, lisa, maggie, milouze, ozgur, lili, valery, marcel,
  hercule, pierre, lucas, alonzo, squatteurs, delabarre, jordi, angeJordi, armand, henri].map(asType);
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));
writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types,', scenes.reduce((a, s) => a + s.choix.length, 0), 'choix');
