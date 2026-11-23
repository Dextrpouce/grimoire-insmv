// Généré par tools/hierarchie/build-hierarchie.mjs : ne pas modifier à la main.
// Hiérarchie (livret de règles INS/MV 4e, ch. 4 « La hiérarchie » p. 91-96, fiches des supérieurs p. 96-119, Bibles à Dudule).
// Textes résumés ; chiffres et tables relevés sur les livres.
export const HIERARCHIE = {
 "invocation": {
  "principe": "Pouvoir spirituel de tout ange ou démon (pas morts-vivants, familiers, serviteurs ni soldats de Dieu) : appel au secours direct à son supérieur, où qu'il soit ; énoncer son nom complet prend une seconde.",
  "test": "Test de Foi (Chance interdite) contre une difficulté égale au facteur d'invocation du supérieur (ex. Alain : Légendaire), modifiée en colonnes par la table ci-dessous.",
  "modificateurs": [
   {
    "cond": "Demande futile",
    "mod": "-3 colonnes ou plus"
   },
   {
    "cond": "Situation de vie ou de mort",
    "mod": "+1 colonne"
   },
   {
    "cond": "Présence d'un supérieur du camp adverse",
    "mod": "+1 colonne"
   },
   {
    "cond": "Présence d'un ennemi personnel du supérieur",
    "mod": "+2 colonnes ou plus selon l'animosité entre les deux supérieurs"
   },
   {
    "cond": "Le supérieur est actuellement sur terre",
    "mod": "-1 colonne"
   },
   {
    "cond": "Deuxième essai dans la même heure",
    "mod": "-4 colonnes"
   },
   {
    "cond": "Dernière invocation réussie : moins d'un mois",
    "mod": "-4 colonnes"
   },
   {
    "cond": "Dernière invocation réussie : entre un et six mois",
    "mod": "-2 colonnes"
   },
   {
    "cond": "Dernière invocation réussie : entre sept et douze mois",
    "mod": "0"
   },
   {
    "cond": "Dernière invocation réussie : plus d'un an",
    "mod": "+1 colonne"
   },
   {
    "cond": "Personnage de grade 1",
    "mod": "+1 colonne"
   },
   {
    "cond": "Personnage de grade 2",
    "mod": "+2 colonnes"
   },
   {
    "cond": "Personnage de grade 3",
    "mod": "+3 colonnes"
   },
   {
    "cond": "Total de PA inférieur à -10",
    "mod": "-8 colonnes"
   },
   {
    "cond": "Total de PA entre -9 et 0",
    "mod": "-4 colonnes"
   },
   {
    "cond": "Total de PA entre 1 et 10",
    "mod": "-2 colonnes"
   },
   {
    "cond": "Total de PA entre 11 et 20",
    "mod": "0"
   },
   {
    "cond": "Total de PA entre 21 et 30",
    "mod": "+1 colonne"
   },
   {
    "cond": "Total de PA supérieur à 31",
    "mod": "+2 colonnes"
   }
  ],
  "resultats": [
   {
    "mr": "échec",
    "effet": "Rien : le supérieur n'a pas entendu, refuse de donner suite ou est occupé ailleurs."
   },
   {
    "mr": "0-3",
    "effet": "Aide ponctuelle : récupère 20 PP, ou 5 PF, ou guérit d'une blessure fatale/mort instantanée ; ou pouvoir temporaire niveau 6+, ou +6 rangs à un talent (au choix du MJ)."
   },
   {
    "mr": "4-6",
    "effet": "Délégation : un grade 3 de l'entourage du supérieur arrive en renfort par téléportation 1d6 secondes après l'appel."
   },
   {
    "mr": "7-9",
    "effet": "Intervention indirecte : le supérieur aide à distance avec ses pouvoirs de grade ; s'ils sont inopérants sur place, il délègue (comme Délégation)."
   },
   {
    "mr": "10+",
    "effet": "Intervention directe : le supérieur vient en personne via un avatar, utilise surtout ses pouvoirs de grade, ne reste jamais longtemps sur terre."
   }
  ],
  "notes": "+2 à la MR si le supérieur est actuellement sur terre (en plus du -1 colonne de la table). Hors combat, l'invocation permet aussi de discuter avec son supérieur, mais la plupart jugent cela futile (exceptions : Didier et Baalberith). Le facteur d'invocation de chaque supérieur figure dans sa fiche (p. 96-119 imprimées)."
 },
 "communication": {
  "principe": "Hors contacts de début et fin de mission, faire parvenir un message à un supérieur : test du facteur de communication du supérieur destinataire (traité comme une caractéristique), difficulté selon la méthode.",
  "methodes": [
   {
    "n": "Par le contact (administration)",
    "difficulte": "Difficile",
    "delai": "selon MR (table arrivee)",
    "risque": "interception d66 : allié du destinataire 14, ennemi du même camp 14, autre camp impossible"
   },
   {
    "n": "Par invocation (réussir une invocation et remettre l'information à son supérieur)",
    "difficulte": "Facile ; automatique si le supérieur invoqué est le destinataire",
    "delai": "selon MR",
    "risque": "interception d66 : allié 15, ennemi du même camp 12 (aucune chance si le supérieur invoqué est lui-même ennemi ou allié du destinataire), autre camp impossible"
   },
   {
    "n": "Par téléphone arabe (via un haut gradé connu incarné sur terre)",
    "difficulte": "Très difficile dans le même camp ; Incroyable d'un camp à l'autre (seul moyen de passer un message au camp adverse)",
    "delai": "selon MR",
    "risque": "interception d66 : allié 22, ennemi du même camp 21, autre camp 16"
   },
   {
    "n": "Par Notre-Dame (service courrier, anges uniquement)",
    "difficulte": "Difficile, avec +2 colonnes",
    "delai": "selon MR",
    "risque": "interception d66 : allié 13, ennemi du même camp 13, autre camp 11 (seulement si message donné par téléphone ; aucune chance en s'y rendant directement)"
   }
  ],
  "exceptions_camp_adverse": [
   {
    "cond": "Ange de Janus vers Valefor (ou l'inverse)",
    "difficulte": "Très difficile"
   },
   {
    "cond": "Démon vers l'archange Ange",
    "difficulte": "Difficile"
   },
   {
    "cond": "Ange de Mathias vers n'importe quel prince-démon",
    "difficulte": "Difficile"
   }
  ],
  "modificateurs": [
   {
    "cond": "Information triviale",
    "mod": "-4 colonnes ou plus"
   },
   {
    "cond": "Information capitale",
    "mod": "+2 colonnes ou plus"
   },
   {
    "cond": "Information liée au domaine du supérieur",
    "mod": "+2 colonnes"
   },
   {
    "cond": "Information liée au Grand Jeu",
    "mod": "+2 colonnes"
   },
   {
    "cond": "Personnage de grade 1",
    "mod": "+1 colonne"
   },
   {
    "cond": "Personnage de grade 2",
    "mod": "+2 colonnes"
   },
   {
    "cond": "Personnage de grade 3",
    "mod": "+3 colonnes"
   },
   {
    "cond": "Total de PA inférieur à -10",
    "mod": "-4 colonnes"
   },
   {
    "cond": "Total de PA entre -9 et 0",
    "mod": "-2 colonnes"
   },
   {
    "cond": "Total de PA entre 1 et 10",
    "mod": "-1 colonne"
   },
   {
    "cond": "Total de PA entre 11 et 20",
    "mod": "0"
   },
   {
    "cond": "Total de PA entre 21 et 30",
    "mod": "+2 colonnes"
   },
   {
    "cond": "Total de PA supérieur à 31",
    "mod": "+4 colonnes"
   },
   {
    "cond": "Supérieur du même camp bloquant le message",
    "mod": "malus en colonnes égal au facteur de communication du supérieur intervenant"
   },
   {
    "cond": "Supérieur accélérant le message",
    "mod": "bonus en colonnes égal au facteur de communication du supérieur intervenant"
   }
  ],
  "arrivee": [
   {
    "mr": "0-3",
    "delai": "1d6 mois"
   },
   {
    "mr": "4-6",
    "delai": "1d6 semaines"
   },
   {
    "mr": "7-9",
    "delai": "1d6 jours"
   },
   {
    "mr": "10+",
    "delai": "1d6 heures"
   }
  ],
  "notes": "Échec : message perdu (peut ressurgir des années plus tard, au gré du MJ). Interférences : seul un supérieur du même camp peut bloquer ou accélérer (sauf Mathias, Janus et Valefor qui agissent aussi sur le camp adverse) ; il doit connaître le message ou bloquer tout un sujet. Interception : jets séparés du MJ, indépendants de la réussite ; chaque ligne applicable est testée (2 ou 3 jets) ; valeurs données comme seuil sur d66 ; supérieur intercepteur tiré au hasard, libre d'agir ou non."
 },
 "recompenses": {
  "principe": "Après chaque mission (pas chaque scénario), la hiérarchie accorde ou retire des PA selon la réussite ; évaluation surtout via le débriefing, plus les sources propres de l'administration. Récompenses et punitions sont individuelles.",
  "bareme": [
   {
    "cond": "Mission réussie",
    "pa": "+1 à +3"
   },
   {
    "cond": "Mission échouée",
    "pa": "-1 à -3"
   },
   {
    "cond": "Orthodoxie vis-à-vis du supérieur (ses services administratifs)",
    "pa": "+2 à -2 (plus souvent en moins, plus souvent 1 que 2, très souvent 0)"
   },
   {
    "cond": "Critères de promotion propres à chaque supérieur",
    "pa": "voir fiche du supérieur"
   }
  ],
  "notes": "Les joueurs n'apprennent que le degré de réussite (catastrophe, échec, passable, bien, très bien), jamais le gain exact ni leur total de PA ; le MJ tient une feuille de route.",
  "demander": "Demande à l'administration, traitée en une semaine ; récompense tirée sur la table d66. Acceptée d'office si PA positifs (sauf veto du supérieur direct) ; sinon le MJ lance secrètement 1d6 : refusée si le résultat est inférieur au nombre de PA négatifs.",
  "exiger": "Demande d'une récompense précise, traitée en une semaine, acceptée seulement si le total de PA dépasse le double du coût habituel (ex. +1 Force coûte 2 PA, il faut au moins 4 PA) ; pas de jet de dé.",
  "table": [
   {
    "d": "11-13",
    "effet": "Amélioration de pouvoir mental : +1 rang à un pouvoir mental possédé. Coût variable, généralement 3 PA."
   },
   {
    "d": "14-16",
    "effet": "Amélioration de pouvoir physique : idem pour un pouvoir physique."
   },
   {
    "d": "21-23",
    "effet": "Amélioration de pouvoir spirituel : idem pour un pouvoir spirituel."
   },
   {
    "d": "24-26",
    "effet": "Caractéristique mentale : +1 rang en Volonté, Présence ou Foi (au choix du MJ). Coût 2 PA."
   },
   {
    "d": "31-33",
    "effet": "Caractéristique physique : idem pour Force, Agilité ou Perception."
   },
   {
    "d": "34-35",
    "effet": "Couverture ou ressource : nouvelle couverture, ressource ou autre avantage matériel."
   },
   {
    "d": "36",
    "effet": "Objet magique : arme ou armure magique, talisman ou relique."
   },
   {
    "d": "41-42",
    "effet": "Nouveau pouvoir mental au niveau 1, au choix du MJ. Coût variable, généralement 6 PA."
   },
   {
    "d": "43-44",
    "effet": "Nouveau pouvoir physique : idem."
   },
   {
    "d": "45-46",
    "effet": "Nouveau pouvoir spirituel : idem."
   },
   {
    "d": "51-54",
    "effet": "Point de Pouvoir : +1 PP. Coût 1 PA."
   },
   {
    "d": "55-56",
    "effet": "Servant : groupe d'humains, serviteur de Dieu, troupe de soldats de Dieu, familier ou troupe de morts-vivants."
   },
   {
    "d": "61-65",
    "effet": "Talent : +1 rang dans un talent principal (et +1 dans un talent secondaire), au choix du MJ. Coût 1 PA."
   },
   {
    "d": "66",
    "effet": "Grande générosité : le personnage choisit l'une des récompenses précédentes."
   }
  ],
  "table_note": "Relancer si le personnage a déjà le maximum de son grade dans le trait concerné."
 },
 "avertissements": {
  "principe": "Dès que le total de PA atteint -5 ou moins, l'administration inflige un avertissement (limitation voyante et gênante, rarement handicapante), retiré dès que les PA remontent à 0 ou plus. Table « Les avertissements sans frais ».",
  "table": [
   {
    "d": "11-14",
    "effet": "Atavisme : trait physique typique du camp (ailes, auréole, cornes, queue...) ; ailes inutilisables pour voler mais dissimulables."
   },
   {
    "d": "15-16",
    "effet": "Asexué : perd tout caractère sexuel, apparence androgyne ; d'autres traits peuvent aussi disparaître."
   },
   {
    "d": "21-22",
    "effet": "Baragouinage : incapable d'aligner une phrase correcte, bégaie, peut passer pour simple d'esprit."
   },
   {
    "d": "23-26",
    "effet": "Chromodermie : peau, yeux ou cheveux d'une couleur exotique impossible à masquer."
   },
   {
    "d": "31-34",
    "effet": "Comportement inverse : tare typique du camp adverse (vulgarité, luxure pour un ange ; gentillesse, chasteté pour un démon)."
   },
   {
    "d": "35-42",
    "effet": "Interdit : interdit strict ; s'il le brise, il perd aussitôt tous ses PP."
   },
   {
    "d": "43-44",
    "effet": "Ostentation : doit crier à voix haute le nom de ses pouvoirs (ou des surnoms)."
   },
   {
    "d": "45-52",
    "effet": "Peur irraisonnée : panique face à un élément du quotidien fixé ; refuse de s'en approcher, mal à l'aise s'il y est contraint."
   },
   {
    "d": "53-56",
    "effet": "Restriction : mentalement limité à un choix unique dans un acte courant (nourriture, sommeil, véhicule, vêtements...)."
   },
   {
    "d": "61-62",
    "effet": "Tic immonde : commet régulièrement un acte grossier, même en public."
   },
   {
    "d": "63-66",
    "effet": "Travers : trait de caractère gênant (naïveté, loyauté excessive, mégalomanie, kleptomanie...)."
   }
  ]
 },
 "blames": {
  "principe": "Infligés directement par le supérieur (ou ses proches) à sa discrétion, pour grosse faute : échec complet d'une mission critique, règles négligées (discrétion), manque de respect ou mépris des préoccupations du supérieur. Propres à chaque supérieur (table d6 dans sa fiche), ils visent souvent à placer le personnage dans la situation des humains, à le priver d'un pouvoir dont il abuse ou à l'obliger à un devoir négligé. Généralement temporaires, retirés quand le personnage fait amende honorable auprès de son supérieur.",
  "cumul": null
 },
 "pages": "Livret de règles, ch. 4 La hiérarchie : pages imprimées 91-96 (PDF 92-97). Invocation p. 91-92 (PDF 92-93), communication p. 92-93 (PDF 93-94), récompenses p. 93-95 (PDF 94-96), avertissements et blâmes p. 95-96 (PDF 96-97)."
};
// Par supérieur : grades (titres des grades 1-3), inv (difficulté d'invocation) et invKey (clé de R.DIFFICULTES),
// com (facteur de communication), intervention, blames (table d6), combat, page
export const SUP_HIER = {
 "Alain": {
  "grades": [
   "Serviteur des êtres humains",
   "Ami des pauvres",
   "Maître des affamés"
  ],
  "inv": "Légendaire (il est sur terre)",
  "invKey": "legendaire",
  "com": 1,
  "intervention": "Préfère la diplomatie mais se bat étonnamment bien avec son bâton béni, une crosse papale ornée d'un ankh.",
  "blames": [
   "skeletor : sa musculature fond, il devient squelettique et pitoyable ; Force divisée par deux.",
   "skeletor : sa musculature fond, il devient squelettique et pitoyable ; Force divisée par deux.",
   "odeur de fumier : une puanteur de fumier impossible à masquer le suit ; Présence divisée par deux.",
   "odeur de fumier : une puanteur de fumier impossible à masquer le suit ; Présence divisée par deux.",
   "indigent : ne récupère plus de PP normalement ; d'autres anges doivent lui en donner par contact.",
   "indigent : ne récupère plus de PP normalement ; d'autres anges doivent lui en donner par contact."
  ],
  "combat": "Fo 5, Ag 5+, Pe 9, Vo 7, Pr 6, Foi 7+ ; 90 PP, 12 PF, BL 9/BG 18/BF 27/MS 36 ; bâton béni ancien (précision +6, puissance +7)",
  "page": "96-97"
 },
 "Ange": {
  "grades": [
   "Serviteur des pécheurs",
   "Ami des fidèles",
   "Maître des convertis"
  ],
  "inv": "Incroyable",
  "invKey": "incroyable",
  "com": 2,
  "intervention": "Face à de nombreux ennemis, reste invisible ; frappe d'Assaut spirituel ceux dont la Lecture d'aura révèle des PP.",
  "blames": [
   "marques rituelles : tatouages noirs et rouges indélébiles et mouvants sur tout le corps ; Foi divisée par deux.",
   "marques rituelles : tatouages noirs et rouges indélébiles et mouvants sur tout le corps ; Foi divisée par deux.",
   "sangsue : ne récupère des PP qu'après avoir approché une créature du mal ou païenne dans les 24 h ; plus de dons de PP.",
   "sangsue : ne récupère des PP qu'après avoir approché une créature du mal ou païenne dans les 24 h ; plus de dons de PP.",
   "voilé : ne peut plus activer son aura angélique et doit réussir un test de Volonté incroyable pour parler l'angélique.",
   "voilé : ne peut plus activer son aura angélique et doit réussir un test de Volonté incroyable pour parler l'angélique."
  ],
  "combat": "Fo 6, Ag 7, Pe 5, Vo 8+, Pr 7, Foi 8+ ; 108 PP, 14 PF, BL 10/BG 20/BF 30/MS 40",
  "page": "97"
 },
 "Blandine": {
  "grades": [
   "Serviteur du bonheur éternel",
   "Ami des rêves divins",
   "Maître du sommeil"
  ],
  "inv": "Incroyable",
  "invKey": "incroyable",
  "com": 3,
  "intervention": "Évite l'affrontement direct : Voix impérieuse contre les humains, Chant angélique contre les démons, Sommeil contre les coriaces.",
  "blames": [
   "empathie : ressent la détresse des humains sur des kilomètres ; déprimé si l'un l'est, Volonté divisée par deux.",
   "empathie : ressent la détresse des humains sur des kilomètres ; déprimé si l'un l'est, Volonté divisée par deux.",
   "rêve réciproque : la victime de son Rêve divin lui rend visite au sommeil suivant et peut lui infliger cauchemar ou rêve (niveau 4).",
   "rêve réciproque : la victime de son Rêve divin lui rend visite au sommeil suivant et peut lui infliger cauchemar ou rêve (niveau 4).",
   "cauchemars : un cauchemar récurrent l'empêche de se reposer ; malus de 2 colonnes à toutes ses actions physiques ou mentales.",
   "cauchemars : un cauchemar récurrent l'empêche de se reposer ; malus de 2 colonnes à toutes ses actions physiques ou mentales."
  ],
  "combat": "Fo 3, Ag 5, Pe 7, Vo 8, Pr 9, Foi 9 ; 105 PP, 11 PF, BL 7/BG 14/BF 21/MS 28",
  "page": "97-98"
 },
 "Christophe": {
  "grades": [
   "Serviteur des bambins",
   "Ami des enfants",
   "Maître de l'éducation"
  ],
  "inv": "Incroyable",
  "invKey": "incroyable",
  "com": 2,
  "intervention": "En combat, se protège (Aura d'inattention, Membre blindé, Rebond), utilise Absorption de force tant qu'on le laisse, et Enfance s'il est attaqué.",
  "blames": [
   "babysitter : doit s'occuper en permanence d'un bébé illusoire qui revient toujours ; perd 2d6 PP s'il le maltraite.",
   "babysitter : doit s'occuper en permanence d'un bébé illusoire qui revient toujours ; perd 2d6 PP s'il le maltraite.",
   "adulte : devient un adulte caricatural sans imagination ; -4 colonnes à la plupart des talents physiques, plus de Coup de bol ni d'Enfance.",
   "adulte : devient un adulte caricatural sans imagination ; -4 colonnes à la plupart des talents physiques, plus de Coup de bol ni d'Enfance.",
   "poisse : chaque Coup de bol accumule un point de poisse ; au prochain échec, catastrophe, et il perd un point.",
   "poisse : chaque Coup de bol accumule un point de poisse ; au prochain échec, catastrophe, et il perd un point."
  ],
  "combat": "Fo 5, Ag 6+, Pe 6, Vo 8, Pr 8, Foi 8 ; 102 PP, 13 PF, BL 9/BG 18/BF 27/MS 36",
  "page": "98"
 },
 "Daniel": {
  "grades": [
   "Serviteur du monde souterrain",
   "Ami des skinheads",
   "Maître des continents"
  ],
  "inv": "Légendaire (il est sur terre)",
  "invKey": "legendaire",
  "com": 1,
  "intervention": "Cogne sans relâche avec sa batte bénie dès que le combat commence, sans guère d'autres pouvoirs ; il ne pense à se protéger qu'après une première blessure.",
  "blames": [
   "agoraphobie : terrifié par les espaces ouverts ; test de Volonté incroyable pour sortir, et perd tout de même 1d6 PP.",
   "agoraphobie : terrifié par les espaces ouverts ; test de Volonté incroyable pour sortir, et perd tout de même 1d6 PP.",
   "protecteur : gardien d'une église consacrée, il n'y récupère qu'1 PP toutes les 6 h et nulle part ailleurs.",
   "protecteur : gardien d'une église consacrée, il n'y récupère qu'1 PP toutes les 6 h et nulle part ailleurs.",
   "besoin de foot : fan de foot intarissable ; perd 2d6 PP s'il ne voit pas au moins un match par semaine.",
   "besoin de foot : fan de foot intarissable ; perd 2d6 PP s'il ne voit pas au moins un match par semaine."
  ],
  "combat": "Fo 8, Ag 8, Pe 5+, Vo 5+, Pr 5, Foi 7+ ; 99 PP, 13 PF, BL 12/BG 24/BF 36/MS 48 ; batte bénie suprême (précision +7, puissance +10) ; limitation : accès de colère",
  "page": "98-99"
 },
 "Didier": {
  "grades": [
   "Serviteur des messagers",
   "Ami des postiers",
   "Maître des messages officiels"
  ],
  "inv": "Difficile",
  "invKey": "difficile",
  "com": 5,
  "intervention": "N'aime pas se battre mais n'hésite pas à embrocher un démon pour défendre ses serviteurs.",
  "blames": [
   "muet : ne peut plus parler, seulement s'exprimer par signes ; le joueur ne s'adresse qu'au MJ.",
   "muet : ne peut plus parler, seulement s'exprimer par signes ; le joueur ne s'adresse qu'au MJ.",
   "en triple exemplaire : tout ce qu'il écrit ou dit doit être répété trois fois ; Présence divisée par deux.",
   "en triple exemplaire : tout ce qu'il écrit ou dit doit être répété trois fois ; Présence divisée par deux.",
   "garantie sur ma vie : lié aux messages qu'il porte ; perd 2d6 PP si l'un arrive abîmé ou en retard, meurt s'il est détruit ou perdu.",
   "garantie sur ma vie : lié aux messages qu'il porte ; perd 2d6 PP si l'un arrive abîmé ou en retard, meurt s'il est détruit ou perdu."
  ],
  "combat": "Fo 5, Ag 5, Pe 7, Vo 8, Pr 7, Foi 7 ; 101 PP, 13 PF, BL 9/BG 18/BF 27/MS 36 ; fleuret béni ancien (précision +7, puissance +7)",
  "page": "99"
 },
 "Dominique": {
  "grades": [
   "Serviteur du jugement dernier",
   "Ami des êtres purs",
   "Maître de la justice"
  ],
  "inv": "Légendaire",
  "invKey": "legendaire",
  "com": 4,
  "intervention": "Plus enquêteur que bagarreur ; redoutable contre les démons (Lumière céleste, Jet d'eau bénite), moins contre les païens (Perturbation de pouvoir).",
  "blames": [
   "doutes : rongé par l'autocritique au moindre écart ; Volonté divisée par deux.",
   "doutes : rongé par l'autocritique au moindre écart ; Volonté divisée par deux.",
   "pourfendeur d'impie : quand sa Détection du mal réagit, rage folle jusqu'à tuer une créature du mal ; -4 colonnes aux actions mentales.",
   "pourfendeur d'impie : quand sa Détection du mal réagit, rage folle jusqu'à tuer une créature du mal ; -4 colonnes aux actions mentales.",
   "audit permanent : interrogé chaque soir sur sa journée par un grade 3 ; à la moindre faute, perd 2d6 PP et ne récupère rien de la nuit.",
   "audit permanent : interrogé chaque soir sur sa journée par un grade 3 ; à la moindre faute, perd 2d6 PP et ne récupère rien de la nuit."
  ],
  "combat": "Fo 6, Ag 5, Pe 7, Vo 9, Pr 8+, Foi 9 ; 109 PP, 15 PF, BL 10/BG 20/BF 30/MS 40",
  "page": "99-100"
 },
 "Francis": {
  "grades": [
   "Serviteur des émissaires",
   "Ami des nouveaux amis",
   "Maître des alliances"
  ],
  "inv": "Très difficile",
  "invKey": "tres",
  "com": 4,
  "intervention": "Voit comme un aveu de faiblesse d'être appelé pour un conflit déjà violent ; cherche à réconcilier les protagonistes et ne frappe que pour se défendre.",
  "blames": [
   "pacifisme : test de Volonté incroyable pour tenir une arme ou user d'un pouvoir offensif, et blessure légère même en cas de réussite.",
   "pacifisme : test de Volonté incroyable pour tenir une arme ou user d'un pouvoir offensif, et blessure légère même en cas de réussite.",
   "cristallisation : les conflits latents ressurgissent et se focalisent sur lui ; au moins -8 colonnes en Discussion.",
   "cristallisation : les conflits latents ressurgissent et se focalisent sur lui ; au moins -8 colonnes en Discussion.",
   "malaise : perd des PP à chaque conflit proche (dispute 1d6, combat 2d6, conflit majeur 3d6), irrécupérables avant sa fin.",
   "malaise : perd des PP à chaque conflit proche (dispute 1d6, combat 2d6, conflit majeur 3d6), irrécupérables avant sa fin."
  ],
  "combat": "Fo 5, Ag 5, Pe 5+, Vo 8, Pr 9, Foi 7+ ; 101 PP, 13 PF, BL 9/BG 18/BF 27/MS 36",
  "page": "100"
 },
 "Guy": {
  "grades": [
   "Serviteur des blessés",
   "Ami des médecins",
   "Maître des chirurgiens"
  ],
  "inv": "Très difficile",
  "invKey": "tres",
  "com": 3,
  "intervention": "Déteste être appelé en plein combat ; il peut alors soigner indifféremment les deux camps (sauf les démons).",
  "blames": [
   "stigmates : chaque Guérison lui inflige une blessure légère qui ne se referme qu'au bout de 6 heures.",
   "stigmates : chaque Guérison lui inflige une blessure légère qui ne se referme qu'au bout de 6 heures.",
   "cicatrice : une large cicatrice indélébile lui barre le visage ; Présence divisée par deux.",
   "cicatrice : une large cicatrice indélébile lui barre le visage ; Présence divisée par deux.",
   "pacifisme : comme pour Francis (test de Volonté incroyable pour tenir une arme ou user d'un pouvoir offensif, blessure légère).",
   "pacifisme : comme pour Francis (test de Volonté incroyable pour tenir une arme ou user d'un pouvoir offensif, blessure légère)."
  ],
  "combat": "Fo 5+, Ag 5+, Pe 7, Vo 8, Pr 5, Foi 9 ; 103 PP, 13 PF, BL 9/BG 19/BF 28/MS 38",
  "page": "100"
 },
 "Janus": {
  "grades": [
   "Serviteur des pauvres",
   "Ami des pauvres",
   "Maître de l'emprunt"
  ],
  "inv": "Incroyable",
  "invKey": "incroyable",
  "com": 2,
  "intervention": "Privilégie la discrétion au combat ; s'il doit se battre, il sort un élégant pistolet semi-automatique.",
  "blames": [
   "prodigue : doit donner aux nécessiteux tout ce qu'il vole ; perd tous ses PP s'il garde un butin plus de 24 h.",
   "prodigue : doit donner aux nécessiteux tout ce qu'il vole ; perd tous ses PP s'il garde un butin plus de 24 h.",
   "misérable : ne récupère des PP qu'en réussissant un casse difficile (1d6 à 3d6 selon l'ampleur), une fois par semaine pour les petits larcins.",
   "misérable : ne récupère des PP qu'en réussissant un casse difficile (1d6 à 3d6 selon l'ampleur), une fois par semaine pour les petits larcins.",
   "mondain : ne perçoit plus les gens possédant moins d'un million d'euros que comme des formes floues, sauf effort de Foi.",
   "mondain : ne perçoit plus les gens possédant moins d'un million d'euros que comme des formes floues, sauf effort de Foi."
  ],
  "combat": "Fo 5, Ag 9, Pe 7+, Vo 7, Pr 7+, Foi 7 ; 100 PP, 12 PF, BL 9/BG 18/BF 27/MS 36 ; petit calibre béni ancien (précision +3, puissance +9 ; pénétration importante, portée moyenne)",
  "page": "100-101"
 },
 "Jean": {
  "grades": [
   "Serviteur des créateurs",
   "Ami des concepteurs illuminés",
   "Maître de la technologie"
  ],
  "inv": "Très difficile",
  "invKey": "tres",
  "com": 3,
  "intervention": "Préfère les projets aux affrontements ; active ses défenses puis attaque par décharges électriques ou, s'il est vraiment ennuyé, avec une arme expérimentale.",
  "blames": [
   "cyborg : cobaye de Jean, il reçoit un membre mécanique voyant et peu fiable ; Force, Agilité ou Perception divisée par deux.",
   "cyborg : cobaye de Jean, il reçoit un membre mécanique voyant et peu fiable ; Force, Agilité ou Perception divisée par deux.",
   "paratonnerre : attire la foudre ; une chance sur deux de prendre les attaques électriques à moins de 10 m, et dérègle les appareils fragiles.",
   "paratonnerre : attire la foudre ; une chance sur deux de prendre les attaques électriques à moins de 10 m, et dérègle les appareils fragiles.",
   "matérialiste : ne peut plus utiliser ses pouvoirs physiques ou mentaux et doit se reposer sur ses gadgets.",
   "matérialiste : ne peut plus utiliser ses pouvoirs physiques ou mentaux et doit se reposer sur ses gadgets."
  ],
  "combat": "Fo 5, Ag 5, Pe 6, Vo 7, Pr 7, Foi 7+ ; 100 PP, 12 PF, BL 9/BG 18/BF 27/MS 36 ; canon-laser expérimental béni ancien (précision +9, puissance +9 ; dangereux, intangible)",
  "page": "101"
 },
 "Jean-Luc": {
  "grades": [
   "Serviteur de l'armure divine",
   "Ami des opprimés",
   "Maître des défenseurs"
  ],
  "inv": "Difficile",
  "invKey": "difficile",
  "com": 3,
  "intervention": "Prêt à prendre les coups pour ses serviteurs : se poste au milieu du champ de bataille, toutes défenses activées, sauf s'il protège une personne précise.",
  "blames": [
   "cicatrice : comme pour Guy (large cicatrice indélébile au visage, Présence divisée par deux).",
   "cicatrice : comme pour Guy (large cicatrice indélébile au visage, Présence divisée par deux).",
   "flagellation : ne récupère plus de PP normalement, seulement autant de PP que les PF que lui coûte chaque blessure.",
   "flagellation : ne récupère plus de PP normalement, seulement autant de PP que les PF que lui coûte chaque blessure.",
   "mortification : ne sent plus la douleur et ne peut plus connaître magiquement ses PF ni ses blessures ; doit recourir à Médecine.",
   "mortification : ne sent plus la douleur et ne peut plus connaître magiquement ses PF ni ses blessures ; doit recourir à Médecine."
  ],
  "combat": "Fo 8, Ag 5+, Pe 6, Vo 7, Pr 5, Foi 8 ; 101 PP, 15 PF, BL 12/BG 24/BF 36/MS 48 ; gros calibre béni ancien (précision +4, puissance +9 ; pénétration importante, portée moyenne), veste de Kevlar bénie (protection 7)",
  "page": "101-102"
 },
 "Jordi": {
  "grades": [
   "Serviteur des animaux",
   "Ami des bêtes",
   "Maître de la puissance animale"
  ],
  "inv": "Légendaire (il est sur terre)",
  "invKey": "legendaire",
  "com": 1,
  "intervention": "Face à des démons belliqueux, il a de quoi survivre, mais pas forcément de quoi faire gagner ses serviteurs.",
  "blames": [
   "bouseux : ne récupère aucun PP en zone fortement urbanisée ; à la campagne, tout va bien.",
   "bouseux : ne récupère aucun PP en zone fortement urbanisée ; à la campagne, tout va bien.",
   "esprit de la proie : réagit comme un petit animal face aux prédateurs (chiens, la plupart des humains) : se fige ou fuit, sauf test de Volonté incroyable.",
   "esprit de la proie : réagit comme un petit animal face aux prédateurs (chiens, la plupart des humains) : se fige ou fuit, sauf test de Volonté incroyable.",
   "peau de bête : couvert d'une épaisse fourrure, yeux inhumains ; Présence divisée par deux (sauf face aux animaux).",
   "peau de bête : couvert d'une épaisse fourrure, yeux inhumains ; Présence divisée par deux (sauf face aux animaux)."
  ],
  "combat": "Fo 5+, Ag 7+, Pe 8, Vo 6+, Pr 5, Foi 7+ ; 100 PP, 12 PF, BL 9/BG 19/BF 28/MS 38",
  "page": "102"
 },
 "Joseph": {
  "grades": [
   "Serviteur des geôliers",
   "Ami des tortionnaires",
   "Maître de la vérité"
  ],
  "inv": "Légendaire",
  "invKey": "legendaire",
  "com": 3,
  "intervention": "Peu combatif, il préfère arriver après la bataille pour achever les restes ; contre un démon, il manie une lourde masse bénie à deux mains.",
  "blames": [
   "doutes : comme pour Dominique (autocritique permanente, Volonté divisée par deux).",
   "doutes : comme pour Dominique (autocritique permanente, Volonté divisée par deux).",
   "illuminé : son aura angélique reste allumée en permanence et ne peut être camouflée.",
   "illuminé : son aura angélique reste allumée en permanence et ne peut être camouflée.",
   "intégriste : doit faire avouer ou tuer dans les 24 h tout hérétique ou démon soupçonné qu'il approche, sous peine de perdre tous ses PP.",
   "intégriste : doit faire avouer ou tuer dans les 24 h tout hérétique ou démon soupçonné qu'il approche, sous peine de perdre tous ses PP."
  ],
  "combat": "Fo 4+, Ag 4+, Pe 6+, Vo 8+, Pr 5+, Foi 8+ ; 103 PP, 13 PF, BL 8/BG 17/BF 25/MS 34 ; masse lourde bénie ancienne (précision +4, puissance +9) ; limitation : paranoïaque",
  "page": "102-103"
 },
 "Laurent": {
  "grades": [
   "Serviteur des porteurs d'épée",
   "Ami des troupes du Seigneur",
   "Maître des armées de Dieu"
  ],
  "inv": "Difficile",
  "invKey": "difficile",
  "com": 3,
  "intervention": "Escrimeur quasi invincible avec sa Juste-lame ; ses défenses (Supériorité martiale, Esquive acrobatique, Champ de force) le rendent presque intouchable.",
  "blames": [
   "discipliné : doit suivre à la lettre tout ordre d'un supérieur, sous peine de perdre 2d6 PP.",
   "discipliné : doit suivre à la lettre tout ordre d'un supérieur, sous peine de perdre 2d6 PP.",
   "pourfendeur d'impie : comme pour Dominique (rage folle contre toute créature du mal détectée, -4 colonnes aux actions mentales).",
   "pourfendeur d'impie : comme pour Dominique (rage folle contre toute créature du mal détectée, -4 colonnes aux actions mentales).",
   "aveugle : perd la vue ; ne sert plus en combat que comme commandant et tacticien.",
   "aveugle : perd la vue ; ne sert plus en combat que comme commandant et tacticien."
  ],
  "combat": "Fo 8, Ag 9, Pe 6, Vo 8, Pr 5+, Foi 8 ; 102 PP, 16 PF, BL 12/BG 24/BF 36/MS 48 ; épée bénie suprême (précision +8, puissance +10) ; limitation : besoin de tuer",
  "page": "103-104"
 },
 "Marc": {
  "grades": [
   "Serviteur des économes",
   "Ami des actionnaires",
   "Maître des finances"
  ],
  "inv": "Très difficile",
  "invKey": "tres",
  "com": 4,
  "intervention": "Préfère la bourse aux champs de bataille ; attaque surtout par Charme et Paralysie et se défend au corps à corps avec Arts martiaux.",
  "blames": [
   "mondain : comme pour Janus (ne perçoit plus les gens possédant moins d'un million d'euros que comme des formes floues).",
   "mondain : comme pour Janus (ne perçoit plus les gens possédant moins d'un million d'euros que comme des formes floues).",
   "Géronimo ! : ne peut parler qu'en hurlant à pleins poumons ; Présence divisée par deux.",
   "Géronimo ! : ne peut parler qu'en hurlant à pleins poumons ; Présence divisée par deux.",
   "la dèche : perd tous ses PP sauf 1 ; n'en récupère 2d6 qu'à chaque Contrat divin signé.",
   "la dèche : perd tous ses PP sauf 1 ; n'en récupère 2d6 qu'à chaque Contrat divin signé."
  ],
  "combat": "Fo 4+, Ag 5, Pe 5, Vo 8, Pr 8+, Foi 7 ; 101 PP, 12 PF, BL 8/BG 17/BF 25/MS 34",
  "page": "103"
 },
 "Mathias": {
  "grades": [
   "Serviteur des délateurs",
   "Ami des traîtres",
   "Maître des agents doubles"
  ],
  "inv": "Incroyable",
  "invKey": "incroyable",
  "com": 2,
  "intervention": "Aime surgir déguisé en prince-démon (Apparence démoniaque, Polymorphie) pour poignarder un démon dans le dos.",
  "blames": [
   "schizophrène : 1d6 personnalités mineures, dont certaines se croient démons ; changements en situation de crise et au moins une fois par jour.",
   "schizophrène : 1d6 personnalités mineures, dont certaines se croient démons ; changements en situation de crise et au moins une fois par jour.",
   "mise à l'épreuve : Mathias, déguisé en démon, propose au personnage de passer renégat ; s'il accepte, il finit chez Dominique.",
   "mise à l'épreuve : Mathias, déguisé en démon, propose au personnage de passer renégat ; s'il accepte, il finit chez Dominique.",
   "redressement : perd tout statut d'ange (seuil de blessure -1, plus d'aura ni d'angélique) et tous les pouvoirs réservés aux anges.",
   "redressement : perd tout statut d'ange (seuil de blessure -1, plus d'aura ni d'angélique) et tous les pouvoirs réservés aux anges."
  ],
  "combat": "Fo 5+, Ag 6, Pe 6, Vo 7, Pr 6+, Foi 7 ; 100 PP, 12 PF, BL 9/BG 19/BF 28/MS 38 ; dague bénite ancienne (précision +6, puissance +6)",
  "page": "103-104"
 },
 "Michel": {
  "grades": [
   "Serviteur de la mort",
   "Ami des combattants",
   "Maître de guerre"
  ],
  "inv": "Légendaire (il est sur terre)",
  "invKey": "legendaire",
  "com": 1,
  "intervention": "Brute mais pas bourrin : choisit le pouvoir le plus efficace parmi un vaste arsenal, et adore trancher avec sa gigantesque hache bipenne.",
  "blames": [
   "barbare : perd toute étiquette et retenue ; Aisance sociale divisée par deux, incapable d'utiliser la technologie postérieure à 1800.",
   "barbare : perd toute étiquette et retenue ; Aisance sociale divisée par deux, incapable d'utiliser la technologie postérieure à 1800.",
   "prix de la lâcheté : perd 3d6 PP s'il fuit ou refuse un combat nécessaire.",
   "prix de la lâcheté : perd 3d6 PP s'il fuit ou refuse un combat nécessaire.",
   "démembré : perd son bras droit, qui repousse quand le blâme est levé.",
   "démembré : perd son bras droit, qui repousse quand le blâme est levé."
  ],
  "combat": "Fo 9, Ag 7, Pe 6, Vo 6, Pr 5, Foi 7 ; 99 PP, 15 PF, BL 13/BG 26/BF 39/MS 52 ; hache de bataille bénie suprême tueuse de démons (précision +8, puissance +11 ; inadaptée à la parade)",
  "page": "104"
 },
 "Novalis": {
  "grades": [
   "Serviteur du repos divin",
   "Ami des jardiniers",
   "Maître du calme éternel"
  ],
  "inv": "Légendaire (il est sur terre)",
  "invKey": "legendaire",
  "com": 1,
  "intervention": "Ne se bat que dans des conditions exceptionnelles, et cherche alors à neutraliser ses adversaires plutôt qu'à les détruire.",
  "blames": [
   "chlorophylle : peau verte ; sans deux heures de soleil par jour, subit une blessure grave qui ne guérit qu'au soleil.",
   "chlorophylle : peau verte ; sans deux heures de soleil par jour, subit une blessure grave qui ne guérit qu'au soleil.",
   "bouseux : comme pour Jordi (aucune récupération de PP en ville).",
   "bouseux : comme pour Jordi (aucune récupération de PP en ville).",
   "colérique : agressif et irritable ; Discussion divisée par deux, Pollen inopérant, perd 2d6 PP s'il déclenche une bagarre.",
   "colérique : agressif et irritable ; Discussion divisée par deux, Pollen inopérant, perd 2d6 PP s'il déclenche une bagarre."
  ],
  "combat": "Fo 4+, Ag 4+, Pe 7+, Vo 8, Pr 8, Foi 8+ ; 102 PP, 12 PF, BL 8/BG 17/BF 25/MS 34",
  "page": "104-105"
 },
 "Walther": {
  "grades": [
   "Serviteur des esprits perdus",
   "Ami des guerriers psychiques",
   "Maître des âmes"
  ],
  "inv": "Incroyable",
  "invKey": "incroyable",
  "com": 2,
  "intervention": "Adore faire souffrir les démons et use d'abord des pouvoirs qui les blessent le plus (Jet d'eau bénite, Lumière céleste, Chant angélique).",
  "blames": [
   "illuminé : comme pour Joseph (aura angélique allumée en permanence).",
   "illuminé : comme pour Joseph (aura angélique allumée en permanence).",
   "pitié : perd tous ses PP s'il tue un démon, et 2d6 PP si un membre de son groupe en tue un.",
   "pitié : perd tous ses PP s'il tue un démon, et 2d6 PP si un membre de son groupe en tue un.",
   "sacrifice sanglant : doit verser son sang pour chaque pouvoir utilisé, l'équivalent d'une blessure légère.",
   "sacrifice sanglant : doit verser son sang pour chaque pouvoir utilisé, l'équivalent d'une blessure légère."
  ],
  "combat": "Fo 6+, Ag 5, Pe 6+, Vo 8+, Pr 5, Foi 8+ ; 103 PP, 15 PF, BL 10/BG 21/BF 31/MS 42 ; lance bénie ancienne (précision +5, puissance +7 ; adaptée à la charge) ; limitation : schizophrénie",
  "page": "105"
 },
 "Yves": {
  "grades": [
   "Serviteur de la connaissance",
   "Ami des sages",
   "Maître du savoir divin"
  ],
  "inv": "Légendaire",
  "invKey": "legendaire",
  "com": 4,
  "intervention": "Ne s'est jamais battu de mémoire d'ange : il se contente de parler, souvent avec plus d'efficacité.",
  "blames": [
   "muet : comme pour Didier (ne peut plus parler, seulement par signes).",
   "muet : comme pour Didier (ne peut plus parler, seulement par signes).",
   "énigmatique : ne parle que par énigmes et répond aux questions par des questions ; Baratin, Discussion et Séduction divisés par deux.",
   "énigmatique : ne parle que par énigmes et répond aux questions par des questions ; Baratin, Discussion et Séduction divisés par deux.",
   "bibliomane : ne récupère plus de PP normalement, sauf dans une bibliothèque.",
   "bibliomane : ne récupère plus de PP normalement, sauf dans une bibliothèque."
  ],
  "combat": "Fo 5, Ag 5, Pe 8, Vo 9+, Pr 9+, Foi 9+ ; 110 PP, 14 PF, BL 9/BG 18/BF 27/MS 36",
  "page": "105-106"
 },
 "Abalam": {
  "grades": [
   "Chevalier des fous",
   "Capitaine de l'asile",
   "Baron des psychopathes"
  ],
  "inv": "Incroyable",
  "invKey": "incroyable",
  "com": 1,
  "intervention": "Redoutable sur le plan mental plutôt qu'au corps à corps ; peu de gens résistent à sa Camisole.",
  "blames": [
   "discours aberrant : incapable de s'exprimer clairement ; Discussion et Séduction divisées par deux.",
   "discours aberrant : incapable de s'exprimer clairement ; Discussion et Séduction divisées par deux.",
   "étêté : perd littéralement la tête, qu'il peut porter ; aucune récupération de PP si elle est à plus d'un mètre du corps.",
   "étêté : perd littéralement la tête, qu'il peut porter ; aucune récupération de PP si elle est à plus d'un mètre du corps.",
   "menteur invétéré : dit toujours le contraire de ce qu'il pense, même en essayant de ruser.",
   "menteur invétéré : dit toujours le contraire de ce qu'il pense, même en essayant de ruser."
  ],
  "combat": "Fo 4, Ag 4, Pe 6, Vo 8, Pr 5+, Foi 7+ ; 96 PP, 12 PF, BL 7/BG 14/BF 21/MS 28",
  "page": "106"
 },
 "Andrealphus": {
  "grades": [
   "Chevalier des plaisirs infernaux",
   "Capitaine de la jouissance démoniaque",
   "Baron de l'orgasme éternel"
  ],
  "inv": "Légendaire",
  "invKey": "legendaire",
  "com": 1,
  "intervention": "Un des rares à aimer être invoqué hors urgence ; assez inefficace en combat.",
  "blames": [
   "perversion : n'est plus excité que par une perversion précise ; Orgasme mortel et récupération spéciale n'opèrent que par elle.",
   "perversion : n'est plus excité que par une perversion précise ; Orgasme mortel et récupération spéciale n'opèrent que par elle.",
   "impuissance : désirs intacts mais totalement incapable de les satisfaire.",
   "impuissance : désirs intacts mais totalement incapable de les satisfaire.",
   "sexual healing : ne guérit plus naturellement ni en dépensant des PP, sauf pendant l'acte sexuel.",
   "sexual healing : ne guérit plus naturellement ni en dépensant des PP, sauf pendant l'acte sexuel."
  ],
  "combat": "Fo 3+, Ag 6, Pe 5+, Vo 7, Pr 8+, Foi 8 ; 96 PP, 10 PF, BL 6/BG 13/BF 19/MS 26",
  "page": "106"
 },
 "Andromalius": {
  "grades": [
   "Chevalier du jugement",
   "Capitaine des légions salvatrices",
   "Baron de la justice"
  ],
  "inv": "Légendaire",
  "invKey": "legendaire",
  "com": 4,
  "intervention": "Implacable contre les forces du bien (Absorption du bien, Ténèbres sataniques), moins à l'aise face aux humains ou aux héros païens.",
  "blames": [
   "pourfendeur des purs : rage folle dès qu'il détecte le bien, à l'inverse du blâme de Dominique.",
   "pourfendeur des purs : rage folle dès qu'il détecte le bien, à l'inverse du blâme de Dominique.",
   "responsable d'office : tenu pour responsable des fautes de son groupe ; subit une limitation pour chacune imposée à un membre.",
   "responsable d'office : tenu pour responsable des fautes de son groupe ; subit une limitation pour chacune imposée à un membre.",
   "audit permanent : comme pour Dominique, mais c'est Andromalius qui l'interroge chaque soir.",
   "audit permanent : comme pour Dominique, mais c'est Andromalius qui l'interroge chaque soir."
  ],
  "combat": "Fo 4+, Ag 5, Pe 6+, Vo 8+, Pr 6+, Foi 8+ ; 103 PP, 13 PF, BL 7/BG 15/BF 22/MS 30 ; hache d'arme maudite ancienne tueuse d'anges (précision +5, puissance +8 ; inadaptée à la parade)",
  "page": "107"
 },
 "Asmodée": {
  "grades": [
   "Chevalier du Morpion",
   "Capitaine du Juste Prix",
   "Baron de la Roue de la Fortune"
  ],
  "inv": "Incroyable",
  "invKey": "incroyable",
  "com": 2,
  "intervention": "N'aime guère se battre, mais dispose de quelques talents redoutables (Jet d'acide, Pari stupide).",
  "blames": [
   "parieur invétéré : avant chaque test, le joueur parie 1 PP sur l'issue ; il le perd s'il se trompe et ne gagne rien sinon.",
   "parieur invétéré : avant chaque test, le joueur parie 1 PP sur l'issue ; il le perd s'il se trompe et ne gagne rien sinon.",
   "jeu du Destin : tire une carte d'un paquet à chaque test, un pique fait échouer ; les cartes tirées pour les attaques sont retirées, paquet vide = plus de pouvoirs offensifs.",
   "jeu du Destin : tire une carte d'un paquet à chaque test, un pique fait échouer ; les cartes tirées pour les attaques sont retirées, paquet vide = plus de pouvoirs offensifs.",
   "perdant : perd à tous les jeux auxquels il participe, même en trichant.",
   "perdant : perd à tous les jeux auxquels il participe, même en trichant."
  ],
  "combat": "Fo 4, Ag 5, Pe 5+, Vo 8, Pr 6, Foi 8 ; 97 PP, 12 PF, BL 7/BG 14/BF 21/MS 28",
  "page": "107"
 },
 "Baal": {
  "grades": [
   "Chevalier de l'ordre noir",
   "Capitaine des armées infernales",
   "Baron de la victoire"
  ],
  "inv": "Légendaire",
  "invKey": "legendaire",
  "com": 1,
  "intervention": "Dispose de nombreuses options de combat et est assez rusé pour choisir la plus efficace.",
  "blames": [
   "aveugle : comme pour Laurent (perd la vue).",
   "aveugle : comme pour Laurent (perd la vue).",
   "prix de la lâcheté : comme pour Michel (perd 3d6 PP s'il fuit ou refuse un combat nécessaire).",
   "prix de la lâcheté : comme pour Michel (perd 3d6 PP s'il fuit ou refuse un combat nécessaire).",
   "monstre : son apparence trahit en permanence ses pouvoirs physiques (membre exotique à moitié sorti, langue de feu…).",
   "monstre : son apparence trahit en permanence ses pouvoirs physiques (membre exotique à moitié sorti, langue de feu…)."
  ],
  "combat": "Fo 7+, Ag 5, Pe 5, Vo 5, Pr 7, Foi 7 ; 93 PP, 12 PF, BL 10/BG 21/BF 31/MS 42 ; hache de bataille maudite suprême (précision +8, puissance +11 ; inadaptée à la parade)",
  "page": "107-108"
 },
 "Baalberith": {
  "grades": [
   "Chevalier des rumeurs",
   "Capitaine du téléphone arabe",
   "Baron du bouche à oreille"
  ],
  "inv": "Difficile",
  "invKey": "difficile",
  "com": 5,
  "intervention": "Déteste être appelé en plein combat et ne reste pas, sauf si son serviteur a une information capitale à transmettre.",
  "blames": [
   "La poste : le logo de la Poste apparaît, indélébile, sur son front.",
   "La poste : le logo de la Poste apparaît, indélébile, sur son front.",
   "bavard : parle sans arrêt, même en dormant ; une chance sur deux de laisser échapper une information secrète au pire moment.",
   "bavard : parle sans arrêt, même en dormant ; une chance sur deux de laisser échapper une information secrète au pire moment.",
   "en triple exemplaire : comme pour Didier (tout doit être dit ou écrit trois fois, Présence divisée par deux).",
   "en triple exemplaire : comme pour Didier (tout doit être dit ou écrit trois fois, Présence divisée par deux)."
  ],
  "combat": "Fo 4+, Ag 4+, Pe 7, Vo 6, Pr 5+, Foi 7+ ; 94 PP, 10 PF, BL 7/BG 15/BF 22/MS 30",
  "page": "108"
 },
 "Beleth": {
  "grades": [
   "Chevalier des preneurs de tête",
   "Capitaine des esprits torturés",
   "Baron des cauchemars"
  ],
  "inv": "Légendaire",
  "invKey": "legendaire",
  "com": 3,
  "intervention": "Mal à l'aise en confrontation directe, il neutralise ses adversaires à distance (Sommeil, Peur, Charme).",
  "blames": [
   "insomniaque : dort mais présente tous les signes d'un manque de sommeil ; PF maximum divisés par deux.",
   "insomniaque : dort mais présente tous les signes d'un manque de sommeil ; PF maximum divisés par deux.",
   "cauchemar réciproque : la victime de son Cauchemar mortel le visite au sommeil suivant et peut lui infliger rêve ou cauchemar (niveau 4).",
   "cauchemar réciproque : la victime de son Cauchemar mortel le visite au sommeil suivant et peut lui infliger rêve ou cauchemar (niveau 4).",
   "hallucinations : hallucinations éveillées ; sur un double à l'échec, coupé de la réalité 1d6 secondes.",
   "hallucinations : hallucinations éveillées ; sur un double à l'échec, coupé de la réalité 1d6 secondes."
  ],
  "combat": "Fo 4, Ag 5, Pe 6, Vo 8, Pr 6+, Foi 7+ ; 96 PP, 12 PF, BL 7/BG 14/BF 21/MS 28",
  "page": "108-109"
 },
 "Belial": {
  "grades": [
   "Chevalier des fournaises infernales",
   "Capitaine du feu éternel",
   "Baron du brasier démoniaque"
  ],
  "inv": "Légendaire",
  "invKey": "legendaire",
  "com": 1,
  "intervention": "Malgré ses airs raffinés, une brute qui adore la violence physique, surtout quand c'est lui qui frappe.",
  "blames": [
   "couronne de flammes : sa chevelure devient des flammèches orangées très voyantes.",
   "couronne de flammes : sa chevelure devient des flammèches orangées très voyantes.",
   "fièvres : le feu ronge son corps ; perd 1 PF à chaque pouvoir lié au feu.",
   "fièvres : le feu ronge son corps ; perd 1 PF à chaque pouvoir lié au feu.",
   "thermophile : ne regagne aucun PP sous 30° ou au-dessus de 50 % d'humidité.",
   "thermophile : ne regagne aucun PP sous 30° ou au-dessus de 50 % d'humidité."
  ],
  "combat": "Fo 7, Ag 7, Pe 5, Vo 6, Pr 6, Foi 7+ ; 94 PP, 13 PF, BL 10/BG 20/BF 30/MS 40 ; espadon maudit suprême (précision +7, puissance +11), lance-flammes factice (alimenté par Jet de flammes)",
  "page": "109"
 },
 "Bifrons": {
  "grades": [
   "Chevalier du cimetière",
   "Capitaine des légions infernales",
   "Baron du royaume des morts"
  ],
  "inv": "Incroyable",
  "invKey": "incroyable",
  "com": 1,
  "intervention": "Peu subtil dans ses affrontements, ce qui ne retire rien à sa dangerosité vu sa puissance.",
  "blames": [
   "état cadavérique : plus aucun signe vital, chair froide et odeur de viande avariée ; Présence divisée par deux.",
   "état cadavérique : plus aucun signe vital, chair froide et odeur de viande avariée ; Présence divisée par deux.",
   "vitaphobe : ne regagne aucun PP tant que des êtres vivants sont à moins de 10 m.",
   "vitaphobe : ne regagne aucun PP tant que des êtres vivants sont à moins de 10 m.",
   "syndicalisme morbide : ses morts-vivants réclament salaire, chair fraîche ou repos avant d'obéir.",
   "syndicalisme morbide : ses morts-vivants réclament salaire, chair fraîche ou repos avant d'obéir."
  ],
  "combat": "Fo 7, Ag 6, Pe 6+, Vo 6, Pr 5+, Foi 8 ; 95 PP, 13 PF, BL 10/BG 20/BF 30/MS 40",
  "page": "109"
 },
 "Caym": {
  "grades": [
   "Chevalier du chat noir",
   "Capitaine de la nuée mortelle",
   "Baron du loup démoniaque"
  ],
  "inv": "Incroyable",
  "invKey": "incroyable",
  "com": 2,
  "intervention": "Chasseur et assassin redoutable : il apparaît loin du combat et tire depuis une position embusquée.",
  "blames": [
   "charabia : ne parle plus aucune langue humaine, seulement par grognements et sifflements.",
   "charabia : ne parle plus aucune langue humaine, seulement par grognements et sifflements.",
   "répulsion animale : les animaux le craignent ; la plupart fuient, chiens de garde et prédateurs l'attaquent.",
   "répulsion animale : les animaux le craignent ; la plupart fuient, chiens de garde et prédateurs l'attaquent.",
   "sanguinaire : irrésistiblement attiré par le sang ; Volonté divisée par deux quand il en sent du frais.",
   "sanguinaire : irrésistiblement attiré par le sang ; Volonté divisée par deux quand il en sent du frais."
  ],
  "combat": "Fo 5+, Ag 7, Pe 8, Vo 5+, Pr 4, Foi 7 ; 93 PP, 11 PF, BL 8/BG 17/BF 25/MS 34 ; carabine maudite ancienne (précision +5, puissance +10 ; pénétration importante, portée longue)",
  "page": "110"
 },
 "Crocell": {
  "grades": [
   "Chevalier des glaces",
   "Capitaine du blizzard",
   "Baron des statues translucides"
  ],
  "inv": "Incroyable",
  "invKey": "incroyable",
  "com": 2,
  "intervention": "Adversaire redoutable au corps à corps (griffes, Éventration, Douleur) comme à distance (Éclats de glace).",
  "blames": [
   "bonhomme de glace : sa chair devient une glace légèrement translucide, sans les avantages de Couche de glace.",
   "bonhomme de glace : sa chair devient une glace légèrement translucide, sans les avantages de Couche de glace.",
   "engelure : perpétuellement engourdi ; Agilité divisée par deux.",
   "engelure : perpétuellement engourdi ; Agilité divisée par deux.",
   "cryophile : ne regagne aucun PP au-dessus de -5°.",
   "cryophile : ne regagne aucun PP au-dessus de -5°."
  ],
  "combat": "Fo 8, Ag 6, Pe 6, Vo 6, Pr 4+, Foi 7+ ; 94 PP, 14 PF, BL 11/BG 22/BF 33/MS 44",
  "page": "110"
 },
 "Furfur": {
  "grades": [
   "Chevalier des rave-parties",
   "Capitaine des DJ",
   "Baron du sampling"
  ],
  "inv": "Incroyable",
  "invKey": "incroyable",
  "com": 2,
  "intervention": "Plutôt que se battre, il déclenche des bagarres entre humains ou les dresse contre les anges (Voix impérieuse).",
  "blames": [
   "rebelle : perd 2d6 PP chaque fois qu'il se plie à une règle ou à une loi (sauf ordre de mission ou du chef de groupe).",
   "rebelle : perd 2d6 PP chaque fois qu'il se plie à une règle ou à une loi (sauf ordre de mission ou du chef de groupe).",
   "Géronimo ! : comme pour Marc (ne parle qu'en hurlant, Présence divisée par deux).",
   "Géronimo ! : comme pour Marc (ne parle qu'en hurlant, Présence divisée par deux).",
   "sourd : devient complètement sourd.",
   "sourd : devient complètement sourd."
  ],
  "combat": "Fo 7, Ag 8, Pe 5+, Vo 5, Pr 5, Foi 7 ; 93 PP, 12 PF, BL 10/BG 20/BF 30/MS 40",
  "page": "110-111"
 },
 "Gaziel": {
  "grades": [
   "Chevalier des cavernes",
   "Capitaine des armées cavernicoles",
   "Baron du monde souterrain"
  ],
  "inv": "Incroyable",
  "invKey": "incroyable",
  "com": 2,
  "intervention": "Adversaire tenace qui s'échauffe lentement ; recourt surtout aux attaques de zone (Onde de choc, Séisme).",
  "blames": [
   "agoraphobie : comme pour Daniel (phobie des espaces ouverts).",
   "agoraphobie : comme pour Daniel (phobie des espaces ouverts).",
   "lithophile : ne regagne de PP qu'au contact direct de la terre ; perd 2d6 PP au-dessus du 1er étage, tous en avion.",
   "lithophile : ne regagne de PP qu'au contact direct de la terre ; perd 2d6 PP au-dessus du 1er étage, tous en avion.",
   "golem : semble fait de glaise mal dégrossie.",
   "golem : semble fait de glaise mal dégrossie."
  ],
  "combat": "Fo 8+, Ag 5, Pe 7, Vo 5, Pr 4, Foi 7+ ; 93 PP, 13 PF, BL 11/BG 23/BF 34/MS 46 ; pioche maudite ancienne (précision +4, puissance +8 ; inadaptée à la parade)",
  "page": "111"
 },
 "Haagenti": {
  "grades": [
   "Chevalier des festins",
   "Capitaine des cannibales",
   "Baron des mets sataniques"
  ],
  "inv": "Très difficile",
  "invKey": "tres",
  "com": 3,
  "intervention": "A un faible gourmand pour les anges, même nature, mais les préfère au beurre d'ail.",
  "blames": [
   "obèse : énorme (près d'une tonne) ; Agilité divisée par deux, gêné partout.",
   "obèse : énorme (près d'une tonne) ; Agilité divisée par deux, gêné partout.",
   "gourmet : ne mange plus qu'une substance bizarre et difficile à obtenir ; ne récupère de PP qu'en en ingurgitant des kilos.",
   "gourmet : ne mange plus qu'une substance bizarre et difficile à obtenir ; ne récupère de PP qu'en en ingurgitant des kilos.",
   "rage de dents : souffre atrocement en mangeant ; test de Volonté très difficile pour utiliser Goinfrerie.",
   "rage de dents : souffre atrocement en mangeant ; test de Volonté très difficile pour utiliser Goinfrerie."
  ],
  "combat": "Fo 6+, Ag 7+, Pe 5, Vo 6, Pr 6, Foi 7 ; 13 PP (sic, coquille probable), 12 PF, BL 9/BG 19/BF 28/MS 38 ; banane maudite (précision +2, puissance +0 ; non létale)",
  "page": "111-112"
 },
 "Kobal": {
  "grades": [
   "Chevalier du calembour",
   "Capitaine du jeu de mots",
   "Baron du fou qui repeint son plafond"
  ],
  "inv": "Très difficile",
  "invKey": "tres",
  "com": 3,
  "intervention": "Peut se battre avec son poulet en plastique, mais préfère abuser de ses Illusions et de Gag absurde.",
  "blames": [
   "nez rouge : un gros nez rouge de clown, impossible à enlever.",
   "nez rouge : un gros nez rouge de clown, impossible à enlever.",
   "désarticulé : articulations en caoutchouc ; Agilité divisée par deux.",
   "désarticulé : articulations en caoutchouc ; Agilité divisée par deux.",
   "dissonant : ses actions font des bruits de dessin animé ridicules.",
   "dissonant : ses actions font des bruits de dessin animé ridicules."
  ],
  "combat": "Fo 6, Ag 7, Pe 5+, Vo 6, Pr 8, Foi 7 ; 94 PP, 12 PF, BL 9/BG 18/BF 27/MS 36 ; poulet en plastique maudit (précision +2, puissance +0 ; non létal)",
  "page": "112"
 },
 "Kronos": {
  "grades": [
   "Chevalier de la quatrième dimension",
   "Capitaine du sablier infernal",
   "Baron du temps"
  ],
  "inv": "Légendaire",
  "invKey": "legendaire",
  "com": 4,
  "intervention": "N'a qu'un pouvoir offensif, Projection temporelle, mais il est universellement redouté.",
  "blames": [
   "mode rétro : ses vêtements prennent peu à peu le style d'une autre époque.",
   "mode rétro : ses vêtements prennent peu à peu le style d'une autre époque.",
   "douleur temporelle : les paradoxes temporels lui infligent une douleur de blessure légère qui s'aggrave s'il ne les répare pas.",
   "douleur temporelle : les paradoxes temporels lui infligent une douleur de blessure légère qui s'aggrave s'il ne les répare pas.",
   "lapin blanc : perd 3d6 PP s'il arrive en retard à un rendez-vous.",
   "lapin blanc : perd 3d6 PP s'il arrive en retard à un rendez-vous."
  ],
  "combat": "Fo 4, Ag 4, Pe 7+, Vo 8+, Pr 6, Foi 9 ; 103 PP, 12 PF, BL 7/BG 14/BF 21/MS 28",
  "page": "112"
 },
 "Malphas": {
  "grades": [
   "Chevalier de l'embrouille",
   "Capitaine de la mauvaise foi",
   "Baron de la mesquinerie"
  ],
  "inv": "Incroyable",
  "invKey": "incroyable",
  "com": 3,
  "intervention": "Ne participe pas directement au conflit mais sème la zizanie chez l'adversaire (Lire les pensées, Discorde).",
  "blames": [
   "cristallisation : comme pour Francis (les conflits latents se focalisent sur lui, au moins -8 colonnes en Discussion).",
   "cristallisation : comme pour Francis (les conflits latents se focalisent sur lui, au moins -8 colonnes en Discussion).",
   "mondain : comme pour Janus (ne perçoit plus les gens possédant moins d'un million d'euros que comme des formes floues).",
   "mondain : comme pour Janus (ne perçoit plus les gens possédant moins d'un million d'euros que comme des formes floues).",
   "psychologie inversée : perd 2d6 PP chaque fois qu'il demande ou reçoit de l'aide.",
   "psychologie inversée : perd 2d6 PP chaque fois qu'il demande ou reçoit de l'aide."
  ],
  "combat": "Fo 4, Ag 5, Pe 6, Vo 7, Pr 8, Foi 7 ; 95 PP, 11 PF, BL 7/BG 14/BF 21/MS 28",
  "page": "113"
 },
 "Malthus": {
  "grades": [
   "Chevalier des épidémies",
   "Capitaine de la garde morbide",
   "Baron de la lente décrépitude"
  ],
  "inv": "Légendaire",
  "invKey": "legendaire",
  "com": 1,
  "intervention": "Ses maladies agissant trop lentement, il paralyse ses ennemis, les égorge, puis utilise Infection sur les cadavres.",
  "blames": [
   "porteur malsain : ne récupère aucun PP s'il n'est pas exposé à un vecteur d'infection.",
   "porteur malsain : ne récupère aucun PP s'il n'est pas exposé à un vecteur d'infection.",
   "allergique : les médicaments ont sur lui l'effet inverse ; entrer dans un hôpital lui inflige une blessure légère.",
   "allergique : les médicaments ont sur lui l'effet inverse ; entrer dans un hôpital lui inflige une blessure légère.",
   "fiévreux : forte fièvre ; Force et PF maximum divisés par deux.",
   "fiévreux : forte fièvre ; Force et PF maximum divisés par deux."
  ],
  "combat": "Fo 5, Ag 6, Pe 6, Vo 8, Pr 4, Foi 7+ ; 96 PP, 13 PF, BL 8/BG 16/BF 24/MS 32 ; dague maudite ancienne (précision +6, puissance +6)",
  "page": "113"
 },
 "Mammon": {
  "grades": [
   "Chevalier du pourboire",
   "Capitaine des pots-de-vin",
   "Baron de la corruption"
  ],
  "inv": "Difficile",
  "invKey": "difficile",
  "com": 4,
  "intervention": "Peu fait pour les champs de bataille, il calme ses agresseurs avec Charme.",
  "blames": [
   "pouvoir indexé : ne récupère des PP que si le CAC 40 est en hausse (un dé par heure à défaut).",
   "pouvoir indexé : ne récupère des PP que si le CAC 40 est en hausse (un dé par heure à défaut).",
   "avare : perd 2d6 PP chaque fois qu'il donne quelque chose sans contrepartie, services compris.",
   "avare : perd 2d6 PP chaque fois qu'il donne quelque chose sans contrepartie, services compris.",
   "mondain : comme pour Janus (ne perçoit plus les gens possédant moins d'un million d'euros que comme des formes floues).",
   "mondain : comme pour Janus (ne perçoit plus les gens possédant moins d'un million d'euros que comme des formes floues)."
  ],
  "combat": "Fo 4, Ag 5, Pe 6, Vo 7+, Pr 7+, Foi 7+ ; 96 PP, 11 PF, BL 7/BG 14/BF 21/MS 28",
  "page": "113-114"
 },
 "Morax": {
  "grades": [
   "Chevalier de l'imagination morbide",
   "Capitaine de l'inspiration ultime",
   "Baron du génie démoniaque"
  ],
  "inv": "Incroyable",
  "invKey": "incroyable",
  "com": 2,
  "intervention": "Peu de pouvoirs directement utilisables : il se défend par Charme et attaque avec Malédiction « folie ».",
  "blames": [
   "rimeur : ne s'exprime plus qu'en vers, en alexandrins si possible.",
   "rimeur : ne s'exprime plus qu'en vers, en alexandrins si possible.",
   "muse : ne récupère plus de PP normalement, seulement 1d6 à 3d6 par œuvre créée ou inspirée.",
   "muse : ne récupère plus de PP normalement, seulement 1d6 à 3d6 par œuvre créée ou inspirée.",
   "panne d'inspiration : perd toute créativité ; test de Foi incroyable pour utiliser un pouvoir spirituel.",
   "panne d'inspiration : perd toute créativité ; test de Foi incroyable pour utiliser un pouvoir spirituel."
  ],
  "combat": "Fo 3+, Ag 4, Pe 7, Vo 6, Pr 7+, Foi 7 ; 94 PP, 9 PF, BL 6/BG 13/BF 19/MS 26",
  "page": "114"
 },
 "Nisroch": {
  "grades": [
   "Chevalier du joint",
   "Capitaine des junkies",
   "Baron des dealers"
  ],
  "inv": "Difficile",
  "invKey": "difficile",
  "com": 4,
  "intervention": "Attaque rarement de front : tire depuis une cachette et se téléporte régulièrement.",
  "blames": [
   "en manque : symptômes de manque permanents envers une substance anodine qu'il ignore.",
   "en manque : symptômes de manque permanents envers une substance anodine qu'il ignore.",
   "accro aux accros : doit réussir son Accoutumance au moins une fois par jour, sinon subit le manque.",
   "accro aux accros : doit réussir son Accoutumance au moins une fois par jour, sinon subit le manque.",
   "retours d'acide : sur un échec spécial ou critique, hallucination qui le coupe de la réalité (1d6 rounds ou 1d6 minutes).",
   "retours d'acide : sur un échec spécial ou critique, hallucination qui le coupe de la réalité (1d6 rounds ou 1d6 minutes)."
  ],
  "combat": "Fo 5, Ag 6, Pe 5+, Vo 7+, Pr 6+, Foi 7 ; 95 PP, 12 PF, BL 8/BG 16/BF 24/MS 32 ; petit calibre maudit ancien (précision +4, puissance +9 ; pénétration importante, portée moyenne)",
  "page": "114"
 },
 "Nog": {
  "grades": [
   "Chevalier des bâillements",
   "Capitaine de la glande",
   "Baron de l'A.N.P.E"
  ],
  "inv": "Légendaire",
  "invKey": "legendaire",
  "com": 0,
  "intervention": "Très doué pour arrêter un combat (Glandage, Sommeil), beaucoup moins pour y prendre part.",
  "blames": [
   "somnambule : dort en permanence et agit en somnambule ; -4 colonnes à toutes ses actions.",
   "somnambule : dort en permanence et agit en somnambule ; -4 colonnes à toutes ses actions.",
   "grosse fatigue : son maximum de PF tombe à 1.",
   "grosse fatigue : son maximum de PF tombe à 1.",
   "oreiller maudit : trouve un gros oreiller en plumes dans chaque contenant qu'il ouvre.",
   "oreiller maudit : trouve un gros oreiller en plumes dans chaque contenant qu'il ouvre."
  ],
  "combat": "Fo 4, Ag 4, Pe 5, Vo 8, Pr 5, Foi 9 ; 103 PP, 12 PF, BL 7/BG 14/BF 21/MS 28",
  "page": "115"
 },
 "Nybbas": {
  "grades": [
   "Chevalier des divertissements de masse",
   "Capitaine des leaders d'opinion",
   "Baron de l'opium du peuple"
  ],
  "inv": "Difficile",
  "invKey": "difficile",
  "com": 4,
  "intervention": "Monte les humains contre les anges (Message subliminal, Voix impérieuse) ; attaqué, il lance Ténèbres sataniques et se fond dans la foule.",
  "blames": [
   "téléphage : ne récupère des PP qu'en regardant la télévision.",
   "téléphage : ne récupère des PP qu'en regardant la télévision.",
   "syndrome Guy Lux : voit et appelle toutes les femmes Simone et tous les hommes Léon, sosies de vedettes télé.",
   "syndrome Guy Lux : voit et appelle toutes les femmes Simone et tous les hommes Léon, sosies de vedettes télé.",
   "zapping : ne peut poursuivre une activité plus de 2d6 secondes ou minutes ; même ses rêves changent sans cesse.",
   "zapping : ne peut poursuivre une activité plus de 2d6 secondes ou minutes ; même ses rêves changent sans cesse."
  ],
  "combat": "Fo 4, Ag 4, Pe 4+, Vo 7, Pr 8+, Foi 7 ; 95 PP, 11 PF, BL 7/BG 14/BF 21/MS 28",
  "page": "115"
 },
 "Ouikka": {
  "grades": [
   "Chevalier des geôliers",
   "Capitaine des terroristes",
   "Baron des attentats"
  ],
  "inv": "Très difficile",
  "invKey": "tres",
  "com": 3,
  "intervention": "Préfère embuscades et guérilla aux attaques frontales, et excelle dans les premières.",
  "blames": [
   "terroriste : ne récupère plus de PP normalement, seulement 1d6 par victime d'un attentat qu'il organise.",
   "terroriste : ne récupère plus de PP normalement, seulement 1d6 par victime d'un attentat qu'il organise.",
   "kamikaze : Ouikka lui a implanté une bombe qu'il fera sauter au milieu d'anges au moment opportun (+2 au test de réincarnation).",
   "kamikaze : Ouikka lui a implanté une bombe qu'il fera sauter au milieu d'anges au moment opportun (+2 au test de réincarnation).",
   "voyageur : perd 1d6 PP après deux nuits au même endroit ; blessure légère après une semaine dans la même ville, fatale après un mois.",
   "voyageur : perd 1d6 PP après deux nuits au même endroit ; blessure légère après une semaine dans la même ville, fatale après un mois."
  ],
  "combat": "Fo 6, Ag 7, Pe 6, Vo 5, Pr 6, Foi 7 ; 12 PP (sic, coquille probable), 11 PF, BL 9/BG 18/BF 27/MS 36 ; gros calibre maudit suprême (précision +6, puissance +12 ; pénétration importante, portée moyenne)",
  "page": "115-116"
 },
 "Samigina": {
  "grades": [
   "Chevalier des Carpathes",
   "Capitaine de la Roumanie",
   "Baron des armées vampiriques"
  ],
  "inv": "Incroyable",
  "invKey": "incroyable",
  "com": 2,
  "intervention": "Accro au sang angélique, il est très doué pour la lutte (Étouffement, Baiser vampirique).",
  "blames": [
   "superstitions : soumis aux faiblesses classiques des vampires (invitation, ail, croix, soleil, pieu).",
   "superstitions : soumis aux faiblesses classiques des vampires (invitation, ail, croix, soleil, pieu).",
   "nocturne : -4 colonnes à toutes ses actions de jour ; ne récupère des PP que la nuit, dans un cercueil.",
   "nocturne : -4 colonnes à toutes ses actions de jour ; ne récupère des PP que la nuit, dans un cercueil.",
   "goût du sang : seul le sang humain du sexe opposé le rassasie ; chaque jour sans en boire compte comme un jour de jeûne.",
   "goût du sang : seul le sang humain du sexe opposé le rassasie ; chaque jour sans en boire compte comme un jour de jeûne."
  ],
  "combat": "Fo 7, Ag 5+, Pe 4, Vo 5, Pr 7+, Foi 7 ; 93 PP, 12 PF, BL 10/BG 20/BF 30/MS 40",
  "page": "116-117"
 },
 "Scox": {
  "grades": [
   "Chevalier de la possession",
   "Capitaine des armées humaines",
   "Baron de la communion démoniaque"
  ],
  "inv": "Difficile",
  "invKey": "difficile",
  "com": 2,
  "intervention": "Spécialiste de la manipulation mentale (Charme, Lire les pensées) ; il attaque les anges avec Ténèbres sataniques.",
  "blames": [
   "gourou : ne récupère plus de PP normalement, seulement 1 PP par humain entrant dans une secte qu'il contrôle.",
   "gourou : ne récupère plus de PP normalement, seulement 1 PP par humain entrant dans une secte qu'il contrôle.",
   "perte d'âme : Scox lui prend la moitié de son âme ; Chance/Foi et total de PP divisés par deux.",
   "perte d'âme : Scox lui prend la moitié de son âme ; Chance/Foi et total de PP divisés par deux.",
   "syndicalisme sectaire : comme pour Bifrons, mais ce sont ses démons mineurs qui réclament des compensations.",
   "syndicalisme sectaire : comme pour Bifrons, mais ce sont ses démons mineurs qui réclament des compensations."
  ],
  "combat": "Fo 4, Ag 4, Pe 5, Vo 7+, Pr 7, Foi 8+ ; 97 PP, 11 PF, BL 7/BG 14/BF 21/MS 28",
  "page": "117"
 },
 "Shaytan": {
  "grades": [
   "Chevalier du furoncle",
   "Capitaine des lépreux",
   "Baron de l'eczéma"
  ],
  "inv": "Incroyable",
  "invKey": "incroyable",
  "com": 2,
  "intervention": "Commence presque toujours par Décrépitude ; si cela ne suffit pas, il s'acharne sur un ennemi (Membre exotique, Éventration).",
  "blames": [
   "furoncle : couvert de furoncles et de boutons ; Présence divisée par deux.",
   "furoncle : couvert de furoncles et de boutons ; Présence divisée par deux.",
   "muse impure : ne récupère de PP que par des œuvres franchement laides (1d6 à 3d6) et 1 PP par personne défigurée.",
   "muse impure : ne récupère de PP que par des œuvres franchement laides (1d6 à 3d6) et 1 PP par personne défigurée.",
   "immondain : ne perçoit les personnes de Présence supérieure à 2 que comme des taches floues (voir « mondain » de Janus).",
   "immondain : ne perçoit les personnes de Présence supérieure à 2 que comme des taches floues (voir « mondain » de Janus)."
  ],
  "combat": "Fo 7, Ag 5, Pe 5, Vo 7+, Pr 4+, Foi 7+ ; 96 PP, 14 PF, BL 10/BG 20/BF 30/MS 40",
  "page": "117"
 },
 "Uphir": {
  "grades": [
   "Chevalier de la Strychnine",
   "Capitaine du Pyralène",
   "Baron de la Dioxine"
  ],
  "inv": "Incroyable",
  "invKey": "incroyable",
  "com": 2,
  "intervention": "Dangereux à attaquer (Peau acide, Vengeance toxique) ; projette de l'acide et use de Perturbation de pouvoir contre les coriaces.",
  "blames": [
   "anaturel : asphyxie en milieu sain ; blessures croissantes avec la durée (heure : BL, jour : BG, semaine : BG, mois : MS).",
   "anaturel : asphyxie en milieu sain ; blessures croissantes avec la durée (heure : BL, jour : BG, semaine : BG, mois : MS).",
   "toxique : empoisonne lentement son entourage, ses camarades et son équipement.",
   "toxique : empoisonne lentement son entourage, ses camarades et son équipement.",
   "bio-luminescent : émet une lueur verdâtre, discrète au jour mais très voyante la nuit.",
   "bio-luminescent : émet une lueur verdâtre, discrète au jour mais très voyante la nuit."
  ],
  "combat": "Fo 6, Ag 5+, Pe 5+, Vo 7+, Pr 5+, Foi 7 ; 95 PP, 13 PF, BL 9/BG 18/BF 27/MS 36",
  "page": "118"
 },
 "Valefor": {
  "grades": [
   "Chevalier des larcins",
   "Capitaine des brigands",
   "Baron du crime parfait"
  ],
  "inv": "Très difficile",
  "invKey": "tres",
  "com": 2,
  "intervention": "Privilégie la discrétion au combat ; s'il doit se battre, il sort un élégant pistolet semi-automatique.",
  "blames": [
   "prodigue : comme pour Janus (doit donner tout ce qu'il vole, perd tous ses PP s'il garde un butin plus de 24 h).",
   "prodigue : comme pour Janus (doit donner tout ce qu'il vole, perd tous ses PP s'il garde un butin plus de 24 h).",
   "misérable : comme pour Janus (ne récupère des PP qu'en réussissant des casses).",
   "misérable : comme pour Janus (ne récupère des PP qu'en réussissant des casses).",
   "borsalino : porte en permanence un borsalino noir impossible à ôter, même sous la douche.",
   "borsalino : porte en permanence un borsalino noir impossible à ôter, même sous la douche."
  ],
  "combat": "Fo 5, Ag 9, Pe 7+, Vo 7, Pr 7+, Foi 7 ; 100 PP, 12 PF, BL 9/BG 18/BF 27/MS 36 ; petit calibre maudit (précision +3, puissance +9 ; pénétration importante, portée moyenne)",
  "page": "118"
 },
 "Vapula": {
  "grades": [
   "Chevalier du moteur à explosion",
   "Capitaine du béton armé",
   "Baron de cyanure"
  ],
  "inv": "Très difficile",
  "invKey": "tres",
  "com": 2,
  "intervention": "N'aime pas se battre, pouvoirs surtout défensifs ; n'emploie Trait d'énergie que s'il ne risque rien et que l'invocateur le mérite.",
  "blames": [
   "rat de laboratoire : hors d'un laboratoire, malheureux et déplacé ; Présence divisée par deux.",
   "rat de laboratoire : hors d'un laboratoire, malheureux et déplacé ; Présence divisée par deux.",
   "cyborg : comme pour Jean (membre mécanique peu fiable, caractéristique divisée par deux).",
   "cyborg : comme pour Jean (membre mécanique peu fiable, caractéristique divisée par deux).",
   "interférences : perturbe l'électronique (téléphones inutilisables ; ordinateurs et voitures une chance sur deux de défaillir).",
   "interférences : perturbe l'électronique (téléphones inutilisables ; ordinateurs et voitures une chance sur deux de défaillir)."
  ],
  "combat": "Fo 4, Ag 4, Pe 6+, Vo 7, Pr 4, Foi 7+ ; 95 PP, 11 PF, BL 7/BG 14/BF 21/MS 28",
  "page": "118-119"
 },
 "Vephar": {
  "grades": [
   "Chevalier des mers",
   "Capitaine des légions aquatiques",
   "Baron du royaume au-delà du miroir"
  ],
  "inv": "Légendaire",
  "invKey": "legendaire",
  "com": 2,
  "intervention": "Dans l'eau, prend une forme monstrueuse (Forme de combat, Membre exotique, Poison) ; sur terre, combat au trident et garde Vie subaquatique pour les plus dangereux.",
  "blames": [
   "déshydratation : blessure légère par heure hors de l'eau ; ne récupère des PP qu'immergé.",
   "déshydratation : blessure légère par heure hors de l'eau ; ne récupère des PP qu'immergé.",
   "branchies : branchies voyantes, yeux globuleux, peau écailleuse, et sifflote du Schubert sans arrêt.",
   "branchies : branchies voyantes, yeux globuleux, peau écailleuse, et sifflote du Schubert sans arrêt.",
   "bébé phoque : un bébé phoque bruyant le suit partout ; s'il le tue, un autre le remplace dans l'heure.",
   "bébé phoque : un bébé phoque bruyant le suit partout ; s'il le tue, un autre le remplace dans l'heure."
  ],
  "combat": "Fo 7, Ag 5, Pe 6+, Vo 6, Pr 5, Foi 7+ ; 94 PP, 13 PF, BL 10/BG 20/BF 30/MS 40 ; trident maudit ancien (précision +5, puissance +7 ; adapté à la charge)",
  "page": "119"
 },
 "Catherine": {
  "grades": [
   "Serviteur du blé en herbe",
   "Ami des sages-femmes",
   "Maître du renouvellement"
  ],
  "inv": "Très difficile (elle est sur terre)",
  "invKey": "tres",
  "com": 1,
  "intervention": "N'aime pas être invoquée sans urgence extrême ; en combat, cherche à sauver son serviteur plutôt qu'à gagner.",
  "blames": [
   "chaînes : un maillon s'ajoute chaque jour à un fer à la cheville ; libérer un opprimé en retire un.",
   "chaînes : un maillon s'ajoute chaque jour à un fer à la cheville ; libérer un opprimé en retire un.",
   "grossesse : ventre de femme enceinte de huit mois, permanent jusqu'à la fin du blâme (anges mâles compris).",
   "grossesse : ventre de femme enceinte de huit mois, permanent jusqu'à la fin du blâme (anges mâles compris).",
   "accoucheur : plus de récupération normale des PP ; regagne 3d6 PP en assistant à un accouchement.",
   "accoucheur : plus de récupération normale des PP ; regagne 3d6 PP en assistant à un accouchement."
  ],
  "combat": null,
  "page": "74 (Bible Anges)"
 },
 "Georges": {
  "grades": [
   "Serviteur des exterminateurs intégristes",
   "Ami des purificateurs célestes",
   "Maître des tueurs consacrés"
  ],
  "inv": "Très difficile",
  "invKey": "tres",
  "com": 2,
  "intervention": "Arrive ravi de se battre enfin, une hache dans une main et une épée dans l'autre.",
  "blames": [
   "pourfendeur d'impie (comme pour Dominique).",
   "pourfendeur d'impie (comme pour Dominique).",
   "gardien impassible : perd 2d6 PP chaque fois qu'il parle à quelqu'un.",
   "gardien impassible : perd 2d6 PP chaque fois qu'il parle à quelqu'un.",
   "besoin de sang : une arme dégainée ne peut être rengainée avant d'avoir fait couler le sang.",
   "besoin de sang : une arme dégainée ne peut être rengainée avant d'avoir fait couler le sang."
  ],
  "combat": null,
  "page": "74-75 (Bible Anges)"
 },
 "Victor": {
  "grades": [
   "Serviteur des étincelles divines",
   "Ami du feu sacré",
   "Maître de la lumière"
  ],
  "inv": "Incroyable",
  "invKey": "incroyable",
  "com": 3,
  "intervention": "Cache sa vraie nature à ses serviteurs : jamais de métamorphose en dragon, il crache le feu ou attaque à l'épée.",
  "blames": [
   "ardeur : pupilles en flammes qui grandissent avec l'excitation ou la passion.",
   "ardeur : pupilles en flammes qui grandissent avec l'excitation ou la passion.",
   "ferveur : ne récupère ses PP qu'en priant dans une église ou agenouillé devant une bible ou un crucifix.",
   "ferveur : ne récupère ses PP qu'en priant dans une église ou agenouillé devant une bible ou un crucifix.",
   "rédemption : plus aucun PA gagné, et perte d'1 PA par jour sans athée converti la veille.",
   "rédemption : plus aucun PA gagné, et perte d'1 PA par jour sans athée converti la veille."
  ],
  "combat": null,
  "page": "75-76 (Bible Anges)"
 },
 "Eli": {
  "grades": [
   "Serviteur des animaux",
   "Ami des plantes",
   "Maître des minéraux"
  ],
  "inv": "Légendaire",
  "invKey": "legendaire",
  "com": 1,
  "intervention": "Piètre combattant ; si l'enjeu le justifie, crée des animaux pour aider ses serviteurs.",
  "blames": [
   "bouseux (comme pour Jordi).",
   "bouseux (comme pour Jordi).",
   "Midas vert : tout ce qu'il touche revient à l'état naturel (métal en minerai, synthétique en pétrole…).",
   "Midas vert : tout ce qu'il touche revient à l'état naturel (métal en minerai, synthétique en pétrole…).",
   "exo-invisibilité : ne perçoit presque plus les humains (cf. blâme mondain de Janus).",
   "exo-invisibilité : ne perçoit presque plus les humains (cf. blâme mondain de Janus)."
  ],
  "combat": null,
  "page": "76 (Bible Anges)"
 },
 "Hassan": {
  "grades": [
   "Serviteur de la tolérance",
   "Ami de l'alliance",
   "Maître du lien éternel"
  ],
  "inv": "Difficile",
  "invKey": "difficile",
  "com": 2,
  "intervention": "En plein combat, tente d'y mettre fin ou de faire fuir ses serviteurs plutôt que d'affronter les démons.",
  "blames": [
   "pacifisme (comme pour Francis).",
   "pacifisme (comme pour Francis).",
   "colombes : environ une fois par heure, une colombe sort de sa poche et lui roucoule à l'oreille.",
   "colombes : environ une fois par heure, une colombe sort de sa poche et lui roucoule à l'oreille.",
   "entraide : tout ce qu'il entreprend seul échoue ; il lui faut l'aide d'au moins une autre personne.",
   "entraide : tout ce qu'il entreprend seul échoue ; il lui faut l'aide d'au moins une autre personne."
  ],
  "combat": null,
  "page": "76-77 (Bible Anges)"
 },
 "Khalid": {
  "grades": [
   "Serviteur des gardiens de la foi",
   "Ami des musulmans",
   "Maître de la colère divine"
  ],
  "inv": "Incroyable",
  "invKey": "incroyable",
  "com": 2,
  "intervention": "Adore combattre les démons et se jette vite au milieu d'eux.",
  "blames": [
   "pourfendeur d'impies (comme pour Dominique).",
   "pourfendeur d'impies (comme pour Dominique).",
   "gardien : ne récupère plus ses PP que dans une mosquée.",
   "gardien : ne récupère plus ses PP que dans une mosquée.",
   "tout est bon dans le Coran : avant toute décision, consulte son Coran de poche 1d6 minutes (6 : d66, 66 : d666…).",
   "tout est bon dans le Coran : avant toute décision, consulte son Coran de poche 1d6 minutes (6 : d66, 66 : d666…)."
  ],
  "combat": null,
  "page": "77 (Bible Anges)"
 },
 "Hornet": {
  "grades": [
   "Chevalier du cimetière",
   "Capitaine des légions infernales",
   "Baron du royaume des morts"
  ],
  "inv": "Incroyable",
  "invKey": "incroyable",
  "com": 3,
  "intervention": "Évite de combattre lui-même et envoie morts-vivants et familiers ; poussé à bout, il se déchaîne.",
  "blames": [
   "état cadavérique (comme pour feu Bifrons).",
   "état cadavérique (comme pour feu Bifrons).",
   "serviteur de la Rose Noire : sur un 222, invoqué par un nécromancien, il disparaît 1d66 minutes.",
   "serviteur de la Rose Noire : sur un 222, invoqué par un nécromancien, il disparaît 1d66 minutes.",
   "syndicalisme morbide (comme pour feu Bifrons).",
   "syndicalisme morbide (comme pour feu Bifrons)."
  ],
  "combat": null,
  "page": "76 (Bible Démons)"
 },
 "Marie-Jolie": {
  "grades": [
   "Chevalier de la faciale",
   "Capitaine des meutes sodomites",
   "Baron des explosions séminales"
  ],
  "inv": "Incroyable",
  "invKey": "incroyable",
  "com": 2,
  "intervention": "N'aime pas être invoquée sans raison ; en combat, manie sa hache avec zèle.",
  "blames": [
   "romantisme : chaque matin, tombe amoureux de la première personne inconnue charnellement, jusqu'à conclure.",
   "romantisme : chaque matin, tombe amoureux de la première personne inconnue charnellement, jusqu'à conclure.",
   "besoin de viol : pulsion quotidienne ; test de Volonté Difficile (-1 colonne par jour de privation) pour se retenir.",
   "besoin de viol : pulsion quotidienne ; test de Volonté Difficile (-1 colonne par jour de privation) pour se retenir.",
   "impuissance (comme pour feu Andrealphus).",
   "impuissance (comme pour feu Andrealphus)."
  ],
  "combat": null,
  "page": "76-77 (Bible Démons)"
 },
 "Zanag": {
  "grades": [
   "Chevalier des vérités éludées",
   "Capitaine des coups de pute dans le dos",
   "Baron du retournement de veste taille XXL"
  ],
  "inv": "Incroyable",
  "invKey": "incroyable",
  "com": 3,
  "intervention": "Accepte volontiers d'être invoqué pour discuter ; en combat, prend l'apparence la plus innocente puis use de pouvoirs mentaux ou tire à bout portant.",
  "blames": [
   "magnétisme : ne récupère ses PP qu'en présence d'au moins un ange.",
   "magnétisme : ne récupère ses PP qu'en présence d'au moins un ange.",
   "girouette : chaque matin 1d6 ; 1 = habitudes d'ange, 2-5 = démon normal, 6 = démon intégriste.",
   "girouette : chaque matin 1d6 ; 1 = habitudes d'ange, 2-5 = démon normal, 6 = démon intégriste.",
   "menteur invétéré (comme pour Abalam).",
   "menteur invétéré (comme pour Abalam)."
  ],
  "combat": null,
  "page": "77 (Bible Démons)"
 },
 "Daiàl": {
  "grades": [
   "Chevalier des mauvais sentiments",
   "Capitaine de l'anarchie",
   "Baron de la révolte"
  ],
  "inv": "Incroyable",
  "invKey": "incroyable",
  "com": 1,
  "intervention": "Sème d'abord le trouble dans les rangs ennemis, puis seulement prend part au combat.",
  "blames": [
   "minoritaire : perd 2d6 PP quand il prend part à une action décidée collectivement par un groupe.",
   "minoritaire : perd 2d6 PP quand il prend part à une action décidée collectivement par un groupe.",
   "(nom illisible) : ne peut plus s'exprimer qu'en chuchotant (attribution 3-4 probable, ligne à moitié masquée).",
   "(nom illisible) : ne peut plus s'exprimer qu'en chuchotant (attribution 3-4 probable, ligne à moitié masquée).",
   "illisible (texte masqué par un défaut d'impression).",
   "illisible (texte masqué par un défaut d'impression)."
  ],
  "combat": null,
  "page": "77-78 (Bible Démons)"
 },
 "Majùj": {
  "grades": [
   "Chevalier de la vulgarité",
   "Capitaine des pulsions inavouables",
   null
  ],
  "inv": "Difficile",
  "invKey": "difficile",
  "com": 2,
  "intervention": "À l'aise en duel ; n'aime pas être invoqué face à des adversaires supérieurs en nombre.",
  "blames": [
   "(nom illisible) : parle un langage mêlant vulgarité, argot et images ; Baratin et Discussion divisés par deux.",
   "(nom illisible) : parle un langage mêlant vulgarité, argot et images ; Baratin et Discussion divisés par deux.",
   "happy slapping : ne récupère ses PP qu'en se filmant à gifler un inconnu, 1 PP par rieur devant la vidéo.",
   "happy slapping : ne récupère ses PP qu'en se filmant à gifler un inconnu, 1 PP par rieur devant la vidéo.",
   "cravate : ses vêtements se changent toujours en costume-cravate de marque de luxe.",
   "cravate : ses vêtements se changent toujours en costume-cravate de marque de luxe."
  ],
  "combat": null,
  "page": "78 (Bible Démons)"
 }
};
