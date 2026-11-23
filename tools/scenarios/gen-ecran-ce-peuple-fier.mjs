// Génère le fichier d'import « insmv-scenario » pour « Ce peuple fier et farouche » (Écran du maître INS/MV4, livret p. 2-9)
// usage : node gen-ce-peuple-fier.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Livret de l\'écran du maître (INS/MV4), « Ce peuple fier et farouche », p. 2-9';
const L = (s) => R.parseLvl(String(s));
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
const ARMES = new Map(R.ARMES.flatMap(([g, l]) => l.map((x) => [x[0], { prec: x[1], puis: x[2], melee: R.MELEE_GROUPS.includes(g) }])));
// arme de la table des règles : nom affiché, nom dans la table, niveau du talent
const arme = (n, table, lvl) => { const w = ARMES.get(table); if (!w) throw new Error('arme inconnue : ' + table); return { n, att: L(lvl), ...w }; };
const poing = (lvl) => arme('Coup de poing', 'Coup de poing', lvl);
const P = 'ecran-'; let n = 0; const id = (k) => P + k;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [poing(1)], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});
const QUICK = 'Talents regroupés façon « PNJ rapide » : Attaque = arme de prédilection, Physique / Mental / Social = tous les talents du groupe.';

// ---------------- Humains ----------------
const durs = npc('durs', {
  nom: 'Nationalistes durs', source: 'Gardes et militants armés de toutes les factions', qty: 6, car: car('2+ 2 2+ 2 2 2'), def: L('2+'),
  pfFix: 4, seuilsFix: seuils('3/7/10/14'),
  armes: [arme('Fusil de chasse', 'Fusil à pompe', 2), arme('Revolver', 'Revolver gros calibre', 2), arme('Cran d\'arrêt', 'Cran d\'arrêt', 2)],
  talents: 'Athlétisme 1+, Baratin 2, Conduite 2, Corps à corps 2, Défense 2+, Discrétion 2+, Intimidation 3+, Tir 2, Avoir l\'air con en cagoule 1, Connaissance du maquis 2, Patois corse 2',
  notes: 'Les plus radicaux : se voient en résistants face à l\'occupant français tout en vivant de ses subventions. Cagoule, treillis, chiens de chasse.\nArmes « diverses » dans le livre : fusil de chasse et revolver choisis ici.',
});
const soldats = npc('soldats', {
  nom: 'Soldats de Dieu du Maréchal', source: 'Section au service du FLNC (Indipendenza)', type: 'soldat', qty: 6, car: car('2 3 2+ 2 2 2+'), def: L(3),
  pp: 6, pfFix: 4, seuilsFix: seuils('3/6/9/12'),
  armes: [arme('Revolver', 'Revolver gros calibre', '3+'), arme('Corps à corps', 'Coup de poing', 3)],
  pouvoirs: pows('Caméléon 1, Champ de force 1'),
  talents: 'Acrobatie 3, Athlétisme 3, Conduite 3, Corps à corps 3, Défense 3, Discrétion 4, Intimidation 2, Survie 2 (maquis 3), Tir 2 (armes de poing 3+), Chants nationalistes 1',
  notes: 'Ils sont vingt, restés sur place à la demande de leur chef : désemparés, ils veulent venger le double assassinat du Maréchal. Tous membres d\'Indipendenza. Armes légères et lourdes variées, véhicules, cagoules.\nQuantité de la scène à ajuster (6 par défaut sur 20).',
});
const mous = npc('mous', {
  nom: 'Nationalistes mous', source: 'Cadres autoproclamés du mouvement (deux tiers des participants)', qty: 6, car: car('2 2 2 2+ 2+ 2'), def: L(2),
  pfFix: 4, seuilsFix: seuils('3/6/9/12'),
  armes: [arme('Flingue', 'Revolver petit calibre', '1+'), arme('Cran d\'arrêt', 'Cran d\'arrêt', 2)],
  talents: 'Athlétisme 1+, Baratin 2, Conduite 2, Corps à corps 2, Défense 2, Discussion 2+, Discrétion 2, Intimidation 2, Tir 1+, Idéologie nationaliste 2, Patois corse 2',
  notes: 'Se prennent pour l\'élite de l\'armée de l\'ombre. Cagoule, treillis, littérature militante, flingues, crans d\'arrêt.',
});
const cooke = npc('cooke', {
  nom: 'Ed Cooke', source: 'Représentant de l\'IRA', car: car('1+ 2 2 3 2 2+'), def: L(2), pfFix: 4, seuilsFix: seuils('2/5/7/10'),
  armes: [poing(2)],
  talents: 'Aisance sociale 3, Athlétisme 2, Baratin 2, Conduite 2, Corps à corps 2, Défense 2, Discrétion 3, Discussion 3, Enquête 2, Savoir criminel 1 (IRA 3), Savoir militaire 1 (guérilla urbaine 3), Technique 1 (explosifs 3+), Boire de la Guinness sans être ivre 3, Chants celtes 2',
  notes: '28 ans. Envoyé là en punition d\'un attentat raté, il noie son malheur dans la bière en prenant des coups de soleil. Trois kilos de semtex (stock de l\'atelier) : c\'est lui qui arrête l\'affrontement du 24 au soir en menaçant de tout faire sauter.',
});
const yvon = npc('yvon', {
  nom: 'Yvon Le Creachcadec', source: 'Représentant du FLNB (Bretagne)', car: car('1+ 2 2 3 2 2+'), def: L(2), pfFix: 4, seuilsFix: seuils('2/5/7/10'),
  armes: [arme('Beretta', 'Revolver petit calibre', 1), poing(2)],
  talents: 'Aisance sociale 3, Athlétisme 2, Baratin 2, Conduite 2, Corps à corps 2, Défense 2, Discrétion 3, Discussion 3, Enquête 2, Savoir criminel 1 (FLNB 3), Gueuler 2+, Chants bretons 2+, Histoire celte 1+, Biniou 1+',
  notes: '35 ans. Ravi d\'être là, remercie tout le monde au biniou et veut être copain avec Ed, son « cousin » irlandais. Habits de marin breton.\nTir non donné : Beretta estimé au niveau 1.',
});
const lizarazu = npc('lizarazu', {
  nom: 'Lizarazu Voxinale', source: 'Représentant d\'ETA', car: car('1+ 2 2 3 2 2+'), def: L(2), pfFix: 4, seuilsFix: seuils('2/5/7/10'),
  armes: [arme('Fusil de chasse', 'Carabine', 3), poing(2)],
  talents: 'Aisance sociale 3, Athlétisme 2, Baratin 2, Conduite 2, Corps à corps 2, Défense 2, Discrétion 3, Discussion 3, Enquête 2, Savoir criminel 1 (ETA 3), Tir 1+ (armes d\'épaule 3), Langue : basque, Chants républicains espagnols 2',
  notes: '42 ans, fils de républicain espagnol, très à gauche : dégoûté par l\'extrême droite corse mais obéit aux ordres en bon soldat. Béret.',
});
const hans = npc('hans', {
  nom: 'Hans Wittmann', source: 'Représentant du FLNA (Alsace)', car: car('1 2 2 2 2 2+'), def: L(2), pfFix: 3, seuilsFix: seuils('2/4/6/8'),
  armes: [poing(2)],
  talents: 'Aisance sociale 3, Athlétisme 1, Baratin 2, Conduite 2, Corps à corps 2, Défense 2, Discrétion 0+, Discussion 3, Savoir criminel 1 (FLNA 3), Savoir militaire 1 (armée allemande 3), Faire la bouffe 2, Langue : alsacien, Chants nazis 2+, Accordéon 2+',
  notes: '48 ans, 135 kg. Néonazi bruyant, bière et accordéon ; son accordéon est plastiqué le 24 pendant l\'atelier.',
});

// ---------------- Anges et démons ----------------
const jeanPierre = npc('jean-pierre', {
  nom: 'Jean-Pierre (Simon Renucci)', source: 'Ange de Didier, grade 1 (FLNC Canal Habituel)', type: 'ange', car: car('3 3 3 5 5 3'), def: L(3),
  pp: 11, pfFix: 8, seuilsFix: seuils('6/12/18/24'),
  armes: [arme('Arme de prédilection', 'Revolver petit calibre', 3)],
  pouvoirs: pows('Détection du danger 1, Message officiel, Langage universel, Télépathie 2'),
  talents: 'Attaque 3, Défense 3, Physique 3, Mental 5, Social 5',
  notes: `Chargé de la « com » du mouvement depuis 1976 (couverture médiatique) ; paresseux, et ravi que son défaut passe inaperçu en Corse. Content de la mort du Maréchal, qui le faisait travailler. Obéit désormais à Tuogloriam. Avertissement sans frais : paresse.\nArme non précisée : revolver petit calibre estimé.\n${QUICK}`,
});
const tuo = npc('tuogloriam', {
  nom: 'Tuogloriam (François-Xavier Arrii)', source: 'Ange de Jordi, grade 1 (chef de l\'UPC)', type: 'ange', car: car('3 3 5 4 3 4'), def: L(4),
  pp: 13, pfFix: 7, seuilsFix: seuils('6/12/18/24'),
  armes: [arme('Fusil', 'Carabine', 4)],
  pouvoirs: pows('Appel des animaux 1, Caméléon 1, Contrôle des animaux 2, Déguisement superficiel 1+'),
  talents: 'Attaque 4, Défense 4, Physique 4, Mental 4, Social 5, Langage animal 6',
  notes: `Contact des PJ sur place, haut gradé non violent, pas ravi de les voir arriver. Nouveau chef depuis la mort du Maréchal.\nSecret honteux : il savait que l'ANC préparait l'assassinat de Santoni et n'a pas prévenu le Maréchal. Il a peur que les PJ le découvrent et les enverra au casse-pipe. Lâcheté maladive (avertissement sans frais) : évite toute violence directe.\nTrois chats, sept chiens, habits de routard.\n${QUICK}`,
});
const marechal = npc('marechal', {
  nom: 'Maréchal (dans Bruno-André Sarelli)', source: 'Ange de Michel, grade 1, dégradé et évadé du Paradis', type: 'ange', car: car('5 4 3 4 3 3'), def: L(6),
  pp: 14, pfFix: 9, seuilsFix: seuils('8/16/24/32'),
  armes: [arme('Arme exaltée (mains nues)', 'Coup de poing', 7)],
  pouvoirs: pows('Arme exaltée 1, Armure corporelle 1, Maîtrise martiale 2'),
  talents: 'Attaque 7, Défense 6, Physique 5, Mental 2, Social 2, Intimidation 7, Savoir militaire 5 (talents non donnés : profil d\'ange de Michel des PNJ rapides)',
  notes: `Fondateur du FLNC en 1976, assassiné deux fois (dans Rossi puis Santoni). Dégradé par Michel et condamné au purgatoire, il a obtenu l'envoi des PJ mais pas son propre retour. Avec la complicité de Dominique, il s'évade et possède Bruno-André Sarelli (chef du FARC) le 26 août à 13 h, au milieu des journées.\nVanuatu le reconnaît et déclenche une baston générale pour le faire tuer.\nTalents absents du livre : repris du profil « ange de Michel » (PNJ rapides).\n${QUICK}`,
});
const tranxene = npc('tranxene', {
  nom: 'Tranxène (Don Batista)', source: 'Démon de Nisroch, grade 2 (chef de Corsica Viva)', type: 'demon', car: car('3+ 2+ 2+ 5 5 5+'), def: L(6),
  pp: 24, pfFix: 8, seuilsFix: seuils('5/11/16/22'), prot: 4,
  armes: [arme('Beretta 93', 'Pistolet-mitrailleur', '4+'), arme('Petites cornes', 'Coup de poing', '4+')],
  pouvoirs: pows('Accoutumance 5, Aura d\'inattention 4, Lire les pensées 4, Membre exotique : petites cornes, Volonté supra-normale 3, Boomerang 3, Charme 3'),
  talents: 'Attaque 4+, Défense 6, Physique 4+, Mental 5+, Social 4+, Savoir criminel 8',
  notes: `Ancien démon d'Andromalius passé chez Nisroch par admiration pour les films de parrain ; se prend pour Marlon Brando. Contrôle les mafieux pro-Maréchal (Corsica Viva, influence sur Armata Corsa et A Cuncolta), allié de Vanuatu. Paranoïa (avertissement sans frais).\nGilet pare-balles (protection 4 estimée), berger allemand, BMW et yacht blindés, héroïne.\nBeretta 93 (rafales) rendu en pistolet-mitrailleur ; cornes : précision −2, puissance +1 dans le livre.\n${QUICK}`,
});
const zgong = npc('zgong', {
  nom: 'Zgong (Jean-Édouard Badalamenti)', source: 'Démon d\'Andromalius, grade 1 (chef d\'Armata Corsa)', type: 'demon', car: car('2 2 2 4 3 5'), def: L(3),
  pp: 14, pfFix: 6, seuilsFix: seuils('4/8/12/16'),
  armes: [arme('Cran d\'arrêt', 'Cran d\'arrêt', 4)],
  pouvoirs: pows('Détection du mensonge 1, Humanité 3, Lire les pensées 2, Télépathie 2'),
  talents: 'Attaque 4, Défense 3, Physique 3, Mental 4, Social 5, Enquête 6, Sixième sens 6',
  notes: `Espion d'Andromalius chargé de surveiller le processus et d'éviter que l'Enfer ne dérape ; délateur zélé. Tranxène et Vanuatu ignorent sa présence. Timidité (avertissement sans frais).\n${QUICK}`,
});
const manix = npc('manix', {
  nom: 'Manix (Marie-Hélène Mattéi)', source: 'Démon d\'Andrealphus, grade 1 (Accolta Naziunale Corsa)', type: 'demon', car: car('2 3 2 1+ 5 3'), def: L(3),
  pp: 10, pfFix: 3, seuilsFix: seuils('4/8/12/16'),
  armes: [arme('Cran d\'arrêt', 'Cran d\'arrêt', 3)],
  pouvoirs: pows('Charme 2, Orgasme mortel 1, Polymorphie 1'),
  talents: 'Attaque 3, Défense 3, Physique 4, Mental 3, Social 5, Kama Sutra 7, Séduction 7',
  notes: `Sœur de Jean-Guy Mattéi, avocate à Bastia aussi peu douée qu'heureuse de vivre. A séduit Charles Pierri pendant la détention de Santoni et provoqué la scission puis la guerre. Croit tout ce qu'on lui dit, surtout Vanuatu. Naïveté (avertissement sans frais).\nVanuatu s'en sert le 25 pour envenimer la dispute sur les OGM (citation de Brigitte Bardot à la clé).\n${QUICK}`,
});
const vanuatu = npc('vanuatu', {
  nom: 'Vanuatu (Jean-Erasme Santi)', source: 'Démon de Malphas, grade 2 (A Cuncolta Nazionalista)', type: 'demon', car: car('2 2 3+ 3+ 6 4+'), def: L('3+'),
  pp: 28, pfFix: 5, seuilsFix: seuils('4/8/12/16'),
  armes: [arme('Beretta 92', 'Revolver petit calibre', '2+'), arme('Cran d\'arrêt', 'Cran d\'arrêt', '2+')],
  pouvoirs: pows('Détection du mensonge 4, Discorde 5, Lire les pensées 4, Aura de confusion 3, Charme 2, Cauchemar 1'),
  talents: 'Attaque 2+, Défense 3+, Physique 2+, Mental 4+, Social 7, Baratin 8+',
  notes: `Grand méchant du scénario : infiltré au FLNC depuis 1985, il a transformé le projet du Paradis en guerre civile (scissions, assassinat du préfet, double meurtre du Maréchal). Seul démon violent de Malphas, mais seulement par procuration : il fait tuer, ne tue jamais lui-même. Méprisé par son prince, il méprise à son tour son garde du corps Claymore. Carnet de notes codé.\n${QUICK}`,
});
const claymore = npc('claymore', {
  nom: 'Claymore (Jean-Dominique Allegrini)', source: 'Démon de Baal, grade 1 (Groupe des Anonymes)', type: 'demon', car: car('5 3 3 2 3 2'), def: L(6),
  pp: 12, pfFix: 7, seuilsFix: seuils('7/14/21/28'), prot: 4,
  armes: [arme('Fusil d\'assaut', 'Fusil-mitrailleur', 7), arme('Hache', 'Hache de bataille (à deux mains)', 7), arme('Grandes cornes', 'Coup de poing', 7)],
  pouvoirs: pows('Armure corporelle 1, Art de combat 2, Champ de force 2, Forme de combat 1, Membre exotique : grandes cornes'),
  talents: 'Attaque 7, Défense 6, Physique 5, Mental 3, Social 3, Savoir militaire 6, Médecine 5+, Torture 6+',
  notes: `Garde du corps et bras armé de Vanuatu : psychopathe qui découpe lentement les victimes désignées. Méprisé par sa hiérarchie pour son goût du meurtre de civils. Arsenal : fusil d'assaut, grenades, semtex, bazooka, Beretta 93, haches et couteaux, gilet pare-balles (protection 4 estimée), Volvo pleine de sang.\nLes cornes se règlent avec le pouvoir Membre exotique : grandes cornes.\n${QUICK}`,
});

const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  scene('briefing', '1. Briefing', 'Contact habituel des PJ – août 2001',
    `Convocation en urgence. Mission : rejoindre sous fausse identité les journées nationalistes de Corte, dans l'entourage d'un ange haut gradé non violent (Tuogloriam) qui ne se réjouit pas de leur arrivée.
But : prendre la place de nationalistes « mous » et démasquer traîtres, démons et fauteurs de troubles. Les démons sont la priorité absolue : le double assassinat du Maréchal prouve qu'ils sont à l'œuvre. Les neutraliser, eux et leurs alliés.
Chaque PJ reçoit un gadget techno-magique (Polymorphie 12 h par jour) et la description de la personne qu'il va remplacer. L'agent de liaison ne sait presque rien de la Corse de l'ombre : au MJ de donner quelques infos générales sur chaque groupe (voir notes du scénario).

Gadgets (à répartir) : médaille de saint Christophe, reliquaire de saint Mathias (dent et autre relique), faux fragment de la vraie croix, lacet de sandale de sainte Ursule, tête momifiée de sainte Thérèse dans une boîte de 50 cm, fragment de tunique de sainte Monique.
Le pouvoir ne dure que 12 h : la moitié du temps, les PJ ont leur vrai visage. Cagoule et déguisement peuvent suffire, mais demander l'apparence exacte de chaque PJ pour juger des différences.`),
  scene('brombillu', '2. Brombillu : les couvertures', 'Village de Brombillu, à une heure d\'Ajaccio – le 22 au soir',
    `Tuogloriam a invité au village six membres de l'UPC et des Verts. Une escouade de soldats de Dieu venue d'Ajaccio les endort, les déshabille et les garde inconscients pendant les journées ; ils seront relâchés au retour discret des PJ.
Dans une grande maison : six corps nus et un chien. Les PJ choisissent qui remplacer. Tuogloriam répond aux questions et conseille de rester tranquilles jusqu'au début des journées.

Les couvertures :
• Marie-Simone Fapucchi, 52 ans, institutrice à mi-temps en arrêt maladie, secrétaire administrative appréciée de l'UPC. Militante écologiste modérée, entrée à l'UPC pour son défunt mari. Fiat Punto, cagoule tricotée main.
• Jean-Bernard Siémonucci, 67 ans, ancien résistant et pensionné, fou d'armes mais terrifié par la mort : chef du service d'ordre de l'UPC. Arsenal sans permis. Il a copié à l'insu de Tuogloriam une cassette des RG : Charles Pierri y donne à Yvan Colona le programme de Santoni pour l'embuscade du 14 août, avec des infos d'une précision suspecte. Il ne comprend pas pourquoi le FLNC n'a pas protégé Santoni. Interrogé, il dit tout.
• Raoul Fantucci, 27 ans, gendarme pistonné (neveu du colonel) qui passe son temps au maquis avec ses amis militants et fait sauter leurs amendes. Uniforme, 4L de gendarmerie, Thompson, labrador anémique.
• Jean-Laurent Turcoli, 45 ans, faux cultivateur vivant des subventions européennes, agent de terrain des Verts qui rêve de fonder son groupe. Mercedes 4×4 aux fausses plaques, 17 kg de plastic et un détonateur.
• Guido Petruciani, 29 ans, cultivateur d'herbe, tenté par le grand banditisme, rêve de noyer les continentaux dans la drogue. Fusil à canon scié, rat.
• Hervé Federicci, 27 ans, chanteur corse sans succès qui accuse le colonialisme, caution culturelle des Verts. Guitare, scooter.`),
  scene('famille', '3. Une grande famille : 24 août', 'Grande bastide près de Corte, au bord du maquis',
    `Les journées existent depuis plus de dix ans avec la complicité du gouvernement : nationalistes corses et invités étrangers s'y retrouvent. Des gardes cagoulés de toutes les factions patrouillent dans un rayon d'un kilomètre, sans aucune coordination (inefficaces), en attendant surtout la conférence de presse télévisée.
Factions et groupuscules : voir les notes du scénario.

Programme du 24 :
• 10 h : arrivée, cocktail sous la pergola ; tension virile, regards noirs.
• 12 h : déjeuner, discours de Simon Renucci (Jean-Pierre) sur la lutte : les PJ doivent rire et siffler au bon moment.
• 14 h : sieste, regroupements par alliances ; sérénade d'accueil de Hans à l'accordéon.
• 18 h : atelier d'Indipendenza « l'indépendance par les armes ET la politique ».
• 21 h : dîner ; l'accordéon de Hans a été plastiqué pendant l'atelier (non revendiqué).
• 23 h : atelier de pose de bombe de l'IRA ; un stagiaire du FARC saute. Le FARC accuse Resistenza ; Corsica Nazione défend son sous-groupe, Indipendenza riposte : face-à-face armé général. Les autres factions et Renucci tentent de calmer ; Ed Cooke finit par arrêter tout le monde en menaçant de faire sauter le stock de semtex.
• Minuit : échauffourées et guerre de sabotages, tracts et menaces entre Indipendenza et Corsica Nazione toute la nuit. Vers 4 h, Hans, Ed, Yvon et Lizarazu font un bœuf (biniou, accordéon, Guinness) qui exaspère les Corses.`,
    [inScene(tuo), inScene(jeanPierre), inScene(durs, { qty: 4 }), inScene(mous, { qty: 6 }), inScene(soldats, { qty: 6 }), inScene(cooke), inScene(yvon), inScene(lizarazu), inScene(hans)], true,
    [choice('cassette', 'Les PJ font-ils écouter la cassette de Jean-Bernard à Tuogloriam ?', [
      ['Oui', 'Tuogloriam cache mal son malaise et prétend ne pas comprendre comment Jean-Bernard l\'a eue : premier indice de son secret (il a laissé tuer le Maréchal).'],
      ['Non, ils la gardent', 'Preuve que Pierri (ANC, Corsica Nazione) a organisé l\'assassinat de Santoni avec des infos venues de haut.'],
    ]),
    choice('nuit24', 'Comment se termine le face-à-face armé de 23 h ?', [
      ['Les PJ calment le jeu', ''],
      ['Ed Cooke l\'arrête au semtex', 'Les factions se séparent mais la nuit est faite de sabotages.'],
      ['Ça dégénère en fusillade', 'Morts à compter dans le barème final.'],
    ])]),
  scene('j2', '4. 25 août : l\'escalade', 'Bastide de Corte',
    `• 10 h : petit déjeuner, peu de monde debout.
• 12 h : atelier de l'Associu sur les corridas et les camps de la mort (provocation garantie).
• 13 h : déjeuner : grosse dispute entre Corsica Viva et les Verts sur les OGM (le « hachisch transgénique »). Vanuatu pousse Manix dans le débat ; elle cite Brigitte Bardot et déchaîne Verts et partisans du défunt Santoni. Les flingues suivent : sans intervention des PJ, il y a des morts.
• 14 h : sieste ; coups de feu pour faire taire les invités étrangers ; bagarre entre étrangers et Resistenza.
• 16 h : une bouteille de pastis piégée tue un membre de Resistenza. Ed Cooke est prié de partir ; une voiture de touristes anglais est plastiquée deux kilomètres plus loin. Les gendarmes arrivent, saluent tout le monde et repartent.
• 18 h : débat « quels accords pour l'indépendance ? », vite vidé par les engueulades.
• 20 h : dîner : le Groupe des Anonymes se dispute sur l'amnistie et tire sur Fronte Ribellu (deux morts). Les PJ doivent encore empêcher l'embrasement.
• 22 h : défilé cagoulé et conférence de presse armée, de nuit, devant des journalistes complaisants. Si les PJ n'ont pas apaisé Indipendenza et Corsica Nazione, les deux factions se disputent la conférence et s'engueulent en direct sur toutes les télés.
• Minuit : atelier guérilla rurale, dont le Groupe des Anonymes est exclu (il s'énerve).`,
    [inScene(manix), inScene(vanuatu), inScene(tranxene), inScene(zgong), inScene(claymore), inScene(durs, { qty: 6 }), inScene(mous, { qty: 4 })], true,
    [choice('conference', 'Les PJ ont-ils calmé Indipendenza et Corsica Nazione avant la conférence de 22 h ?', [
      ['Oui', 'Conférence de presse sans incident.'],
      ['Non', 'Engueulade en direct à la télé : le processus est ridiculisé.'],
    ])]),
  scene('j3', '5. 26 août : la horde sauvage', 'Bastide de Corte',
    `• 10 h : petit déjeuner. 12 h : atelier PAO « création de tracts ».
• 13 h : au déjeuner, Bruno-André Sarelli (chef du FARC) s'effondre le nez dans la charcuterie. Ses camarades crient à l'empoisonnement et sortent les armes. Il se relève indemne, le regard durci : le Maréchal le possède désormais.
Vanuatu reconnaît son regard, panique, et lance une baston générale en espérant que le Maréchal y reste. Fusillade et mêlée générale façon final de western : tous les PNJ présents s'en mêlent.
Rappel du barème : tuer des humains coûte cher, tuer des démons rapporte gros, un ange tué par les PJ est une catastrophe.`,
    [inScene(marechal), inScene(vanuatu), inScene(claymore), inScene(tranxene), inScene(manix), inScene(zgong), inScene(soldats, { qty: 6 }), inScene(durs, { qty: 6 }), inScene(mous, { qty: 6 }), inScene(tuo), inScene(jeanPierre)], true,
    [choice('marechal', 'Que font les PJ du Maréchal évadé ?', [
      ['Ils l\'aident à purger le mouvement', 'Dominique leur sera reconnaissant ; Michel beaucoup moins (il est là illégalement).'],
      ['Ils le dénoncent à la hiérarchie', 'Ennemi juré du Maréchal ; bon point auprès de Michel.'],
      ['Ils le laissent se faire tuer', 'Vanuatu atteint son but.'],
    ]),
    choice('tuo', 'Les PJ ont-ils percé le secret de Tuogloriam ?', [
      ['Oui, et ils le dénoncent', 'Tuogloriam devient un ennemi ; sa lâcheté sera sanctionnée.'],
      ['Oui, mais ils se taisent', 'Il leur doit une faveur (ou les craint).'],
      ['Non', 'Il continue de les envoyer au casse-pipe.'],
    ])]),
  scene('bilan', '6. Conditions de victoire', 'Après les journées',
    `Scénario très ouvert. Faire le compte :
• Homme tué par les PNJ : −1 · par les PJ : −2
• Démon tué par les PNJ : +5 · par les PJ : +10
• Ange tué par les PNJ : −5 · par les PJ : −20
• PJ tué : −10
Résultat : −11 et moins = défaite totale (−6 PA) ; −10 à 0 = défaite mineure (−3 PA) ; 1 à 10 = victoire mineure (+3 PA) ; 11 et plus = victoire totale (+6 PA).
Penser à libérer les six couvertures de Brombillu.`, [], false,
    [choice('resultat', 'Score final des PJ ?', [
      ['−11 et moins : défaite totale', '−6 PA'],
      ['−10 à 0 : défaite mineure', '−3 PA'],
      ['1 à 10 : victoire mineure', '+3 PA'],
      ['11 et plus : victoire totale', '+6 PA'],
    ])]),
];

const scenario = {
  id: 'ecran-ce-peuple-fier',
  nom: 'Écran du maître – Ce peuple fier et farouche',
  resume: 'Scénario de Magna Veritas pour anges débutants (introduction à MV). Août 2001, juste après l\'assassinat de Santoni : sous l\'apparence de nationalistes modérés (gadgets de Polymorphie), les PJ assistent aux journées nationalistes de Corte pour démasquer les démons qui ont fait dérailler le projet indépendantiste du Paradis. Huis clos d\'ambiance sur trois jours d\'ateliers, d\'attentats et de provocations, jusqu\'au retour illégal du Maréchal et à la mêlée générale.',
  notes: `Source : ${REF}. Univers INS/MV : la Corse décrite est volontairement délirante. Pour jouer à une autre date, il suffit de décaler l'assassinat de Santoni.

Histoire secrète (résumé) :
• 1976 : le Maréchal, ange de Laurent, fonde le FLNC (rêve d'une nouvelle Rome) ; Jean-Pierre, ange de Didier, en fait un phénomène médiatique ; soutien de Dominique, de l'Église et d'une partie du gouvernement.
• 1985 : l'Enfer infiltre le FLNC avec Vanuatu (Malphas). Scissions et guerre interne. 1989 : il crée en secret l'Accolta Naziunale Corsa (vitrine A Cuncolta Nazionalista, bras armé Resistenza).
• 1990 : Tuogloriam (Jordi) fonde l'UPC, seul groupe non violent. Tranxène (Nisroch) rejoint Vanuatu et pousse le mouvement vers la mafia (Corsica Viva, Armata Corsa…).
• 1995-1998 : guerre fratricide orchestrée par Vanuatu ; Dominique impose une trêve ; le Groupe des Anonymes (manipulé par Vanuatu) assassine le préfet.
• Août 2000 : le Maréchal, dans Jean-Michel Rossi, est abattu sur ordre de Vanuatu ; Dominique l'autorise à revenir dans François Santoni.
• 2000-2001 : Manix (Andrealphus) séduit Charles Pierri et provoque la rupture avec Santoni. Pierri fait abattre Santoni le 14 août 2001 ; Tuogloriam était au courant et s'est tu. Le Maréchal obtient l'envoi d'anges pour purger le mouvement ; Tuogloriam convoque tous les chefs à Corte via les accords de Matignon.

Factions présentes (chef ; membres notables) :
• Pro-Maréchal (Indipendenza) : FLNC Canal historique (Faitucci), FARC (Bruno-André Sarelli, les plus violents), FLNC Canal habituel (Faidutti, sous les ordres de Jean-Pierre = Simon Renucci).
• Mafieux pro-Maréchal infiltrés par Tranxène : Corsica Viva (Don Bastida = Tranxène), Fronte Ribellu (venu par politesse).
• Mafieux indépendants : Armata Corsa (Badalamenti = Zgong, espion d'Andromalius, inconnu de Tranxène et Vanuatu), A Cuncolta (Jean-Guy Mattéi).
• Manipulés par Vanuatu (Corsica Nazione) : Accolta Naziunale Corsa (Charles Pierri ; Marie-Hélène Mattéi = Manix), A Cuncolta Nazionalista (Stasio ; Jean-Erasme Santi = Vanuatu), Resistenza (trois frères Fillippedu), Groupe des Anonymes (Yvan Colona ; Jean-Dominique Allegrini = Claymore).
• Pro-Tuogloriam (Associu per a suvranità) : UPC (François-Xavier Arrii = Tuogloriam), Verts corses (Baldochi) — les PJ y sont infiltrés.
• Invités étrangers : IRA, FLNB, ETA, FLNA, FARC (le « stagiaire »).

Conseils : huis clos d'ambiance, amitié virile, tension permanente, vendettas et honneur à fleur de peau ; soleil écrasant, maisons aux rideaux tirés, accents et vieilles histoires de famille.
Récompenses : barème de la scène 6 (de −6 à +6 PA).
Fiches : anges et démons au format « PNJ rapide » du livret (Attaque, Défense, Physique, Mental, Social) ; armes non précisées choisies dans la table des règles et signalées dans les notes.`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [durs, soldats, mous, cooke, yvon, lizarazu, hans, jeanPierre, tuo, marechal, tranxene, zgong, manix, vanuatu, claymore].map(asType);
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));
writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types');
