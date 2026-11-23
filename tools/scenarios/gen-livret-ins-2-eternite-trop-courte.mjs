// Génère le fichier d'import « insmv-scenario » pour « L'éternité est trop courte pour laisser les cons s'épanouir »
// (Livret In Nomine Satanis, livre de base 4e éd., p. 62-85 ; PDF 65-88)
// usage : node gen-livret-ins-2-eternite-trop-courte.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Livret In Nomine Satanis (4e éd.), « L\'éternité est trop courte pour laisser les cons s\'épanouir », p. 62-85';
const REF_ARCH = 'Livre de base, Règles, chapitre 4, fiche « Mathias, archange du double jeu », p. 103-104';
const L = (s) => R.parseLvl(String(s));
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)\*?$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
const ARMES = new Map(R.ARMES.flatMap(([g, l]) => l.map((x) => [x[0], { prec: x[1], puis: x[2], melee: R.MELEE_GROUPS.includes(g) }])));
const arme = (n, table, lvl) => { const w = ARMES.get(table); if (!w) throw new Error('arme inconnue : ' + table); return { n, att: L(lvl), ...w }; };
const poing = (lvl) => arme('Coup de poing', 'Coup de poing', lvl);
const P = 'ins2-'; let n = 0; const id = (k) => P + k;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [poing(1)], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${o.ref || REF}.`].filter(Boolean).join('\n'),
});
const NOATT = 'Aucun talent d\'attaque dans le livre : coup de poing au niveau 1 (estimé).';

// ================= Les gentils organisateurs =================
const pascal = npc('pascal', {
  nom: 'Pascal Collard', source: 'Humain damné, chef d\'agence de pub (co-organisateur)', car: car('2 2 2 1+ 1+ 2'), def: L('2+'),
  pfFix: 3, seuilsFix: seuils('3/6/9/12'),
  talents: 'Avoir l\'air fat et suffisant 3+, Baratin 2, Discussion 2, Mépriser les gens 3+, Paraître « in » 1+, Séduction 2',
  notes: '48 ans, petit, faux branché (sportswear et marques). Publicitaire vain et lâche qui a vendu son âme pour réussir ; Laurent Foux est venu réclamer la dette : animer ce stage de « communication infernale ». Veut à tout prix une ambiance détendue (rails de coke, sujets creux) et ne voit jamais qu\'il fait un bide.\n' + NOATT,
});
const chantal = npc('chantal', {
  nom: 'Chantal Artisan', source: 'Familier au service de Génocidax, stagiaire permanente dans la pub', type: 'familier', car: car('1+ 2+ 2 1+ 4+ 2'), def: L(3),
  pp: 8, pfFix: 3, seuilsFix: seuils('3/6/9/12'),
  pouvoirs: pows('Absorption de présence 1, Sommeil 1'),
  talents: 'Amener le café 2+, Discrétion 3, Faire des photocopies 0+, Remonter ses bas quand un visiteur arrive 3+, Séduction 4, Talents de séductrice 4+',
  notes: '28 ans, blonde, tenue étudiée pour être vulgaire. Démon rétrogradé familier qui se plaît dans ce poste sans risques ; joue la sotte pour ne pas être repromue. Méprise Pascal (son « maître ») et Loran sans jamais le montrer. Lit Kant en cachette.\n' + NOATT,
});
const loran = npc('loran', {
  nom: 'Loran (Laurent Foux)', source: 'Démon de Nybbas, grade 2 – directeur régional dans l\'industrie du pneu (co-organisateur)', type: 'demon', car: car('2 3 3+ 5+ 3+ 4+'), def: L('4+'),
  pp: 28, pfFix: 7, seuilsFix: seuils('4/8/12/16'),
  pouvoirs: pows('Absorption de présence 4, Aura d\'inattention 4, Cauchemar 3+, Charme 5+, Lire les pensées 5+, Message subliminal, Paralysie 4, Psychométrie 4, Volonté supra-normale 6'),
  talents: 'Baratin 5+, Discours stérile 5+, Discrétion 4+, Discussion 6+, Mettre les gens en confiance 3+, Séduction 5+',
  notes: '38 ans, businessman nouvelle vague à lunettes fluo, pin\'s et Palm Pilot. Ce stage est sa chance de passer grade 3 : prêt à tout, y compris sacrifier Pascal. Furieux qu\'on lui ait envoyé des bourrins ; fait la police pendant les cours (« sanctions », menace d\'Andromalius).\nSon Palm Pilot (table de rencontres, 5) contient un dossier sur Pascal et sur Génocidax : les mesquineries que Loran a commises et fait porter à d\'autres.\n' + NOATT,
});
const genocidax = npc('genocidax', {
  nom: 'Génocidax (Jamon Camora)', source: 'Démon de Nybbas, grade 3 – DRH dans l\'industrie, parrain de la promotion', type: 'demon', car: car('2 2 4 4+ 6+ 6'), def: L(6),
  pp: 43, pfFix: 6, seuilsFix: seuils('4/8/12/16'),
  pouvoirs: pows('Absorption d\'énergie sexuelle 4+, Augmentation de Présence 4, Charme 7+, Langage universel, Message subliminal, Onde de choc 4+, Paralysie 5+, Peur 6+, Télépathie 6+, Trait d\'énergie 3+, Volonté supra-normale 6+'),
  talents: 'Baratin 7+, Discussion 8+, Enquête 8, Fouille 6+, Séduction 8+',
  notes: '42 ans, manager poli et pimpant, roi du sous-entendu. Ne reconnaît jamais une erreur et sait toujours reporter la faute sur un autre ; prendra Loran comme fusible dès que le stage partira en vrille. A signé le mémo d\'affectation des PJ sur conseil de son subordonné Dellar.\n' + NOATT,
});

// ================= Les stagiaires =================
const youkaidi = npc('youkaidi', {
  nom: 'Youkaidi (Alexandre Adam)', source: 'Démon de Baal, grade 1 – informaticien dans la pub', type: 'demon', car: car('4+ 3+ 3 3 2 2+'), def: L('5+'),
  pp: 15, pfFix: 7, seuilsFix: seuils('6/13/19/26'),
  armes: [arme('Coup de boule', 'Coup de boule', '5+'), arme('Coup de poing', 'Coup de poing', '5+'), arme('Arme de poing', 'Revolver gros calibre', '5+')],
  pouvoirs: pows('Art de combat 1+, Arts martiaux 2, Augmentation de Force 1+, Éclats de glace 1, Forme de combat 1, Régénération 1'),
  talents: 'Causer informatique de façon incompréhensible 4+, Combat 5+, Corps à corps 5+, Franglais 4+, Informatique 2+, Surfer 2+, Tir 5+',
  notes: '33 ans, 120 kg, costume trois pièces fripé, PDA dernier cri ; complexe de supériorité, coupe la parole, ne regarde personne en face.\nAu XIXe siècle (indépendance de la Colombie), Tampax l\'a abandonné aux militaires espagnols : torturé, il en a perdu le souvenir, que la nuit de lundi lui rend. Il veut la tuer discrètement en maquillant le crime en œuvre d\'un « tueur psychopathe » (gardien mardi 5h15, scouts mercredi, jogger mercredi soir, gardien jeudi 2h). Combattra jusqu\'à la mort au final.\nArmes non précisées par le livre : il tue au coup de boule ; revolver estimé pour Tir 5+.',
});
const pitocrax = npc('pitocrax', {
  nom: 'Pitocrax (Cyril Duchemin)', source: 'Démon de Scox, grade 2 – chef de marque dans l\'eau minérale', type: 'demon', car: car('2 2 4 4 4+ 3+'), def: L(3),
  pp: 24, pfFix: 6, seuilsFix: seuils('4/8/12/16'),
  armes: [poing(1), arme('Revolver', 'Revolver petit calibre', 4)],
  pouvoirs: pows('Augmentation de Présence 3+, Cauchemar 3+, Détection des ennemis 3+, Détection du mensonge 2+, Paralysie 2+, Peur 2+, Possession 6+, Protection de l\'âme, Rêve 3+'),
  talents: 'Baratin 6, Discussion 6, Enquête 5+, Marketing 5+, Séduction 6, Tir 4',
  notes: '27 ans, provincial qui en fait trop pour paraître parisien : bobo, name-dropping, tutoie toutes les célébrités. Ravi d\'être là, consterné par la ringardise du lieu. Anime deux interventions du lundi. Emmanuel lui « avoue » mardi être un infiltré d\'Andromalius : il le répète à tout le monde. Tué par Duglor mercredi au pique-nique.\nArme de Tir non précisée : revolver estimé.',
});
const tampax = npc('tampax', {
  nom: 'Tampax (Corinne André)', source: 'Démone d\'Andrealphus, grade 1 – rédactrice dans la presse écrite', type: 'demon', car: car('2 3+ 2 2+ 5+ 3'), def: L(2),
  pp: 18, pfFix: 4, seuilsFix: seuils('4/8/12/16'),
  armes: [poing(2)],
  pouvoirs: pows('Cauchemar 1, Charme 3+, Orgasme mortel 2+, Peur 1'),
  talents: 'Baratin 4+, Corps à corps 2, Discrétion 3, Discussion 3+, Kama-sutra 2, Séduction 4',
  notes: '42 ans, fausse blonde, tenue toujours limite. Susceptible : voit une insulte sexiste dans chaque sous-entendu, mène sa cour à la baguette. A connu Youkaidi et Levothyrox au XIXe siècle en Amérique du Sud ; ignore qu\'ils ont été capturés peu après son départ et ne comprend pas ce que Youkaidi lui reproche (elle soupçonne Levothyrox d\'avoir parlé). Cible du « psychopathe » ; elle sera tuée si les PJ n\'interviennent pas.',
});
const torqus = npc('torqus', {
  nom: 'Torqus (Jean-François Sciure)', source: 'Démon de Caym, grade 1 – chef d\'équipe dans le BTP', type: 'demon', car: car('3+ 3+ 4+ 3 2 2'), def: L('3+'),
  pp: 15, pfFix: 6, seuilsFix: seuils('5/11/16/22'),
  armes: [poing(7)],
  pouvoirs: pows('Arts martiaux 1, Augmentation d\'Agilité 1, Augmentation de Perception 1, Contrôle des animaux 1+, Membre blindé 1+, Transformation 1'),
  talents: 'Baratin 2+, Corps à corps 7, Discrétion 5+, Fouille 3',
  notes: '47 ans, chauve, a has been. Limitation : Comportement inverse (gentil) – aime humains et animaux, soigne et protège ; dossier déjà très chargé. Toujours avec ses trois chiens. Conteste tout ce que dit Pascal ; dénoncé par Prosper, arrêté par Mollard dans la nuit de lundi à mardi et retiré du stage.',
});
const raoul = npc('raoul', {
  nom: 'Raoul Giver', source: 'Officier des sapeurs-pompiers à la retraite, sorcier et pyromane à ses heures', car: car('2 2 2+ 4 2+ 2+'), def: L('1+'),
  pfFix: 5, seuilsFix: seuils('3/6/9/12'),
  talents: 'Baratin 3+, Discussion 2+, Hobby (pyromanie) 2+, Médecine 3, Métier (pompier) 3+, Savoir occulte 1+ (démonologie 2+), Haute sorcellerie 1+, Basse sorcellerie 2+',
  notes: '57 ans, élégant et bien conservé, cigare et sourire énigmatique, dragueur à l\'ancienne. S\'ennuyait à la retraite ; l\'Enfer lui a promis beaucoup pour peu. Intervenant du mardi sur l\'invocation… et victime prévue du premier atelier (il ne le sait pas). Drogué au punch-LSD, il invoque par erreur Guillaume, ange de Georges.\nHaute et Basse sorcellerie sont des talents de sorcier (livret INS p. 87-91), notés ici dans les talents.\n' + NOATT,
});
const turgolak = npc('turgolak', {
  nom: 'Turgolak (Enzo Savaletto)', source: 'Démon de Bifrons, grade 1 – postier', type: 'demon', car: car('5+ 4 2+ 2 2+ 2'), def: L(5),
  pp: 12, pfFix: 7, seuilsFix: seuils('5/11/16/22'),
  armes: [arme('Hachette', 'Hachette (à une main)', 5), poing(5), arme('Revolver', 'Revolver petit calibre', '2+')],
  pouvoirs: pows('Armure corporelle 2, Éventration 1+, Jet de flammes 1+, Nécrose 1, Résurrection macabre 1'),
  talents: 'Baratin 2+, Combat (haches) 5, Corps à corps 5, Discrétion 5, Tir 2+',
  notes: '33 ans. Hargneux, teigneux, peu malin et paresseux, cache ses faiblesses sous une agressivité constante. Limitation : Comportement inverse (amoureux) de sa femme et des trois enfants de son corps d\'accueil : double vie, coups de fil mielleux dès qu\'il trouve un coin tranquille (repéré par les services de Mollard). Tué mardi 14h dans la bagarre contre Guillaume.\nSeuils de blessure repris tels quels du livre (5/11/16/22), bien que bas pour Fo 5+. Revolver estimé pour Tir 2+.',
});
const trogluk = npc('trogluk', {
  nom: 'Trogluk (Mirja Westberg)', source: 'Démone de Beleth, grade 2 – mannequin', type: 'demon', car: car('2 2 3+ 6+ 4+ 4+'), def: 2,
  pp: 25, pfFix: 8, seuilsFix: seuils('4/8/12/16'),
  pouvoirs: pows('Aura de pacification 1+, Cauchemar mortel 5+, Charme 5+, Déguisement superficiel 1, Détection du mensonge 1+, Rêve 2, Sommeil 2+, Télépathie 1, Trait d\'énergie 1'),
  talents: 'Baratin 5+, Discussion 8, Enquête 7+, Narcolepsie 4+, Séduction 4',
  notes: '22 ans, grande blonde au regard ravageur. Rend lentement fous les humains en infléchissant leurs rêves érotiques jusqu\'à la ruine ou au suicide ; en a tiré un livre (en démonique, avec l\'aide de Foutrak) et se voit écrivain. Objet des paris de Foutrak et Marcus ; intervention narcissique mardi 16h30. Tuée mercredi au pique-nique.\nDéfense non donnée : 2 (niveau 1).\n' + NOATT,
});
const duglor = npc('duglor', {
  nom: 'Duglor (Yves John)', source: 'Démon de Crocell, grade 1 – chasseur alpin à la retraite', type: 'demon', car: car('3+ 4+ 3 2 2 3+'), def: L(7),
  pp: 10, pfFix: 5, seuilsFix: seuils('5/11/16/22'),
  armes: [arme('Couteau de chasse', 'Poignard ou saï', '5+'), arme('Fusil', 'Carabine', '6+')],
  pouvoirs: pows('Armure corporelle 2+, Éclats de glace 2+, Froid polaire 1+, Immunité contre le froid'),
  talents: 'Combat 5+, Discrétion 4+, Savoir militaire 3 (combat en montagne 5+), Survie 2 (montagne 5), Tir 6+',
  notes: '34 ans, type méridional. Simple, discipliné, aime obéir et regrette son régiment ; ne comprend rien aux cours mais reste attentif. Boit et a de graves problèmes de comportement envers les femmes, surtout le soir : un des auteurs de l\'agression de la serveuse (mardi nuit). Mercredi au pique-nique il se sert de ses pouvoirs, tue Pandémonium et Pitocrax puis s\'enfuit et passe renégat.\nArmes non précisées : couteau et carabine estimés.',
});
const quinquin = npc('quinquin', {
  nom: 'Quinquin (Olivier Gras)', source: 'Démon de Belial, grade 1 – chômeur', type: 'demon', car: car('5+ 5+ 2+ 2 2 2'), def: L('5+'),
  pp: 13, pfFix: 7, seuilsFix: seuils('7/15/22/30'),
  armes: [poing('5+'), arme('Batte', 'Masse d\'arme ou batte', '5+'), arme('Revolver', 'Revolver petit calibre', 4)],
  pouvoirs: pows('Armure corporelle 1+, Augmentation de Force 1, Immunité contre le feu, Incendie 2+, Régénération 1'),
  talents: 'Combat 5+, Corps à corps 5+, Discrétion 2+, Médecine 4, Tir 4',
  notes: '25 ans, sale, mal fagoté, humour lourd et main leste : un soudard du Moyen Âge égaré au IIIe millénaire. Erre entre deux missions et cogne ce qui l\'énerve. Accusé du punch-LSD (à tort), co-auteur de l\'agression de mardi nuit, tue Trogluk au pique-nique ; exclu avec une limitation mercredi 15h. Combattra jusqu\'à la mort au final.\nArmes non précisées : batte et revolver estimés.',
});
const prophylactik = npc('prophylactik', {
  nom: 'Prophylactik (Régis Lavis)', source: 'Démon d\'Abalam, grade 1 – charcutier', type: 'demon', car: car('2 2 2+ 5 3 4'), def: L('3+'),
  pp: 16, pfFix: 7, seuilsFix: seuils('4/8/12/16'),
  armes: [poing('2+')],
  pouvoirs: pows('Augmentation de Foi 2+, Camisole 3, Esprit chaotique, Télékinésie 1'),
  talents: 'Baratin 7, Corps à corps 2+, Discussion 4+',
  notes: '38 ans. Humour gras et souvent mortel, plus intelligent qu\'il n\'en a l\'air mais incapable de s\'arrêter ; aucune morale. Envoyé en récompense par ses supérieurs : amèrement déçu. Le clown du stage (imite Marcus, Pitocrax…). Exclu mardi soir par Mollard, surpris en train de détailler des plans pour tuer Emmanuel.',
});
const pandemonium = npc('pandemonium', {
  nom: 'Pandémonium (Richard Tune)', source: 'Démon de Samigina, grade 1 – mannequin', type: 'demon', car: car('2 2 3 4+ 3+ 3+'), def: L(4),
  pp: 12, pfFix: 6, seuilsFix: seuils('4/8/12/16'),
  armes: [poing('2+')],
  pouvoirs: pows('Augmentation de Présence 1+, Baiser vampirique 2, Corps gazeux, Onde de choc 1, Sommeil 1+'),
  talents: 'Aisance sociale 4, Baratin 3+, Corps à corps 2+, Discrétion 2, Enquête 2+, Marcher en ayant l\'air classe 3+, Séduction 3+',
  notes: '27 ans, toujours tiré à quatre épingles, en avance d\'une mode. Monté par sa volonté de plaire et sa chance ; adopte l\'avis de son interlocuteur, n\'en a aucun lui-même. Intoxiqué au punch-LSD mardi, co-auteur de l\'agression de mardi nuit, tué par Duglor mercredi.',
});
const mollard = npc('mollard', {
  nom: 'Mollard (Joël Mormon)', source: 'Démon d\'Andromalius, grade 2 – directeur d\'une société de sécurité', type: 'demon', car: car('2+ 3+ 5+ 5 2 4+'), def: L(4),
  pp: 25, pfFix: 7, seuilsFix: seuils('4/9/13/18'),
  armes: [poing('3+'), arme('Arme de service', 'Revolver gros calibre', '3+')],
  pouvoirs: pows('Arme exaltée 2, Arts martiaux 1, Augmentation de Force 1, Champ de force 2+, Détection du bien 4+, Douleur 2+, Humanité 5, Rêve 3+'),
  talents: 'Baratin 1+, Corps à corps 3+, Discrétion 5+, Discussion 4+, Enquête 5, Fouille 5+, Intrusion 4, Médecine 3+, Séduction 3, Tir 3+',
  notes: '33 ans, petit, frêle, chafouin, mal à l\'aise partout. Incompétent arrivé par chance et mesquinerie : compense par la méchanceté et la peur qu\'il inspire ; terrifié qu\'on découvre sa nullité. Chargé de la « sécurité » du stage (arrive lundi minuit, avec sept démons d\'Andromalius pour les interrogatoires). Mathias (Izkra) est un de ses agents. Garde pour lui les indices du meurtre du gardien. Jeudi, Prosper lui apprend qu\'une enquête interne vise lui-même : il s\'effondre. Combattra jusqu\'à la mort au final.\nArme de Tir non précisée : revolver estimé.',
});
const salazax = npc('salazax', {
  nom: 'Salazax (Jean-Pierre Pernod, « JPP »)', source: 'Démon de Nybbas, grade 2 – « journaliste » de télévision, invité vedette', type: 'demon', car: car('2 2+ 5 4+ 2+ 4'), def: L(3),
  pp: 23, pfFix: 6, seuilsFix: seuils('4/8/12/16'),
  pouvoirs: pows('Augmentation de Présence 2, Charme 4, Détection des ennemis 3, Message subliminal, Onde de choc 2, Paralysie 1+, Peur 4, Trait d\'énergie 3+'),
  talents: 'Aisance sociale 2+, Avoir l\'air con 5, Baratin 6+, Discussion 4+, Faire pleurer 4+, Métier (journaliste) 1+',
  notes: '51 ans. Star du fait divers télévisé, vil et arriviste, maître du sous-entendu qui évite les procès. Se croit dû un grade 3. Arrive jeudi (atelier « hypocrisie et désinformation », dédicace, dîner de gala, Pacha Club) ; protégé par les videurs du club au final, il fuit dès que Mathias se révèle.\n' + NOATT,
});
const foutrak = npc('foutrak', {
  nom: 'Foutrak (Stéphane Barcouille)', source: 'Démon d\'Asmodée, grade 1 – éditeur', type: 'demon', car: car('2+ 2 3 2+ 1+ 3+'), def: L('2+'),
  pp: 12, pfFix: 5, seuilsFix: seuils('4/9/13/18'),
  pouvoirs: pows('Aura de confusion 1, Cauchemar 2, Lire les pensées 1, Pari stupide 2, Télépathie 1'),
  talents: 'Aisance sociale 2+, Art du cocktail 3+, Baratin 2+, Discussion 2, Enquête 3, Flagorner 4, Informatique 1+, Jeu 2, Séduction 2+',
  notes: '31 ans, petit, râblé, méchant ; se déteste et veut désespérément être aimé, d\'où une cour sado-maso de flatteurs. Joueur invétéré, se reconvertit dans l\'organisation de soirées : lance les paris (bagarres, Trogluk), chifoumi, poker, soirée casino. Mardi midi, il comprend que Mollard couvre quelque chose et conclut que tout le monde est infiltré : c\'est lui qui lance la rumeur. Hésitera entre fuite et collaboration au final.\n' + NOATT,
});
const marcus = npc('marcus', {
  nom: 'Marcus (Pierre Berrant)', source: 'Démon de Mammon, grade 1 – VRP en photocopieurs', type: 'demon', car: car('2 2 2 5 4 3+'), def: L('2+'),
  pp: 16, pfFix: 7, seuilsFix: seuils('4/8/12/16'),
  pouvoirs: pows('Augmentation de Présence 1, Aura de pacification 2, Corruption 2, Lire les pensées 1, Télépathie 1'),
  talents: 'Baratin 4+, Discrétion 2, Discussion 3+, Enquête 2, Séduction 2+',
  notes: '47 ans, roux, beauf de compétition, sous-commercial de banlieue qui ne parle qu\'en franglais. Aucun scrupule pour faire son chiffre. Revend des montres « de sa grand-mère » et des DVD douteux depuis le coffre de sa 307. Intervenant du vendredi (négociation). Hésitera entre fuite et collaboration au final.\n' + NOATT,
});
const prosper = npc('prosper', {
  nom: 'Prosper (Jean-Luc Bourremassy)', source: 'Démon de Malphas, grade 1 – comptable dans la distribution', type: 'demon', car: car('2 2 2 4+ 4 4'), def: L(2),
  pp: 14, pfFix: 6, seuilsFix: seuils('4/8/12/16'),
  pouvoirs: pows('Augmentation de Présence 1, Aura d\'inattention 2+, Discorde 1, Lire les pensées 1+, Onde de choc 1'),
  talents: 'Baratin 4+, Discrétion 3+, Discussion 4, Enquête 3',
  notes: '45 ans, cheveux blancs, type indien, frêle, affable et poli. Sournois, mesquin, nie tout avec aplomb. Le fauteur de troubles invisible du stage : chaque engueulade éclate juste après qu\'il a glissé un mot à quelqu\'un (running gag : on le voit s\'éloigner l\'air de rien). Dénonce Torqus, souffle sur les braises, va chercher Mollard au bon moment et l\'achève jeudi avec la nouvelle de l\'enquête interne. Hésitera entre fuite et collaboration au final.\n' + NOATT,
});
const levothyrox = npc('levothyrox', {
  nom: 'Levothyrox (Olivier Giliri)', source: 'Démon de Nisroch, grade 2 – RMIste', type: 'demon', car: car('2+ 2+ 3 4+ 4+ 3'), def: L(3),
  pp: 25, pfFix: 7, seuilsFix: seuils('4/9/13/18'),
  armes: [poing('1+')],
  pouvoirs: pows('Accoutumance 3+, Aura d\'inattention 2, Aura de pacification 3, Détection des ennemis 2+, Lire les pensées 3, Onde de choc 2, Peur 4'),
  talents: 'Baratin 3+, Corps à corps 1+, Discrétion 3, Discussion 2, Médecine 4+, Séduction 3+',
  notes: '27 ans, un des premiers et plus fidèles démons de Nisroch : junkie débonnaire, farceur, ne fait plus guère le mal. Ancien complice de Youkaidi en Colombie (il planait pendant la trahison) : ils se retrouvent lundi nuit. Verse du LSD dans le punch mardi midi (pari avec Foutrak) et recommence mercredi soir. Co-responsable de la mort de Trogluk. Combattra jusqu\'à la mort au final.',
});
const guillaume = npc('guillaume', {
  nom: 'Guillaume', source: 'Ange de Georges, grade 2, à la retraite (gardien de square)', type: 'ange', car: car('6 6 2 4 2 4'), def: L('6+'),
  pp: 28, pfFix: 10, seuilsFix: seuils('9/18/27/36'),
  armes: [arme('Épée exaltée', 'Épée longue', 8), poing('7+')],
  pouvoirs: pows('Arme exaltée 4, Armure corporelle 4+, Augmentation de Force 4, Colère divine 5+*, Onde de choc 3+, Volonté supra-normale 4'),
  talents: 'Combat 8, Corps à corps 7+, Discrétion 4, Engueuler les gens sans raison 4, Grommeler 6, Intrusion 4+, Ouvrir les portes du square 2+, Se plaindre 3+, Tir 3+',
  notes: '38 ans en apparence. Mis à la retraite avec son patron pour excès de violence et manque de diplomatie ; aigri, tyran de son square au Paradis, peste contre tout. Invoqué par erreur par Raoul Giver mardi 14h au milieu des démons : partagé entre haine et joie, il se bat comme un lion avant d\'être submergé.\nArme non précisée : épée longue estimée (Arme exaltée 4). L\'astérisque de Colère divine renvoie à une note du livre.',
});
// Les deux archanges : le livret renvoie au livret de règles ; seule la fiche « Mathias, archange du double jeu » existe.
const ARCH = {
  type: 'ange', car: car('5+ 6 6 7 6+ 7'), def: L(9), pp: 100, pfFix: 12, seuilsFix: seuils('9/19/28/38'), ref: `${REF} ; caractéristiques : ${REF_ARCH}`,
  armes: [arme('Dague bénite ancienne', 'Poignard ou saï', 8), poing(9)],
  pouvoirs: pows('Apparence démoniaque 13+, Armure corporelle 4, Arts martiaux 4, Aura d\'inattention 6, Corps liquide, Déguisement superficiel 8, Détection des créatures invisibles 6, Détection du danger 4, Détection du mal 6, Esprits multiples 4, Esquive acrobatique 4, Invisibilité 9, Lecture d\'aura 6, Non-détection 8, Obscurité 8, Polymorphie 10, Psychométrie 4, Télépathie 4, Trait d\'énergie 9, Vitesse 5'),
  talents: 'Acrobatie 9, Aisance sociale 9, Athlétisme 8, Baratin 13, Combat 8 (épées 10), Corps à corps 9, Discrétion 9, Discussion 9, Enquête 9, Fouille 7, Intimidation 8, Intrusion 9, Savoir criminel 8, Savoir d\'espion 11 (infiltration des forces du mal 13), Savoir occulte 8, Séduction 9, Survie 9, Ventriloquie 6',
};
ARCH.armes[0].prec = 6; ARCH.armes[0].puis = 6;
const mathias = npc('mathias', {
  ...ARCH, nom: 'Mathias (« Izkra »)', source: 'Archange de la confusion, se faisant passer pour Izkra, démon d\'Andromalius de grade 2, lui-même se faisant passer pour Izkra, démon de Valefor de grade 1',
  notes: '31 ans en apparence, châtain. Ex-archange du double jeu, faussement passé en Enfer comme renégat avec la complicité d\'Yves ; enquêteur interne d\'Andromalius (grade 2), agent de Mollard. Organisateur secret du piège : fait fuiter la « réunion secrète des meilleurs espions démoniaques », a fait convoquer les PJ, pousse Emmanuel à se découvrir pour avoir à le sauver devant témoins et récupérer les bandes vidéo (caméras de surveillance, équipe de TFcon).\nMercredi soir, il peut se révéler aux PJ comme « infiltré d\'Andromalius enquêtant sur un réseau d\'agents doubles » et leur demander de se tenir prêts. Au final, il pousse discrètement tout le monde contre Emmanuel, toujours devant les caméras.\nCaractéristiques : le livret renvoie au livret de règles ; fiche « archange du double jeu » reprise. Sous couverture démoniaque, il agit comme un démon de grade 2 et n\'utilise pas ses pouvoirs voyants.',
});
const emmanuel = npc('emmanuel', {
  ...ARCH, nom: 'Emmanuel (« Kikor »)', source: 'Archange du double jeu, officiellement Kikor, démon de Vapula de grade 1, en fait démon d\'Andromalius de grade 1, puis Thomas Boco, infographiste web',
  armes: [{ ...ARCH.armes[0] }, poing(9)],
  notes: '23 ans en apparence, petit, brun. A pris la place de Mathias et purgé ses services avec zèle, mais l\'infiltration angélique est devenue mauvaise ; critiqué, il veut un coup d\'éclat. Convaincu d\'assister à la réunion des « top guns » de l\'espionnage démoniaque, il s\'infiltre en personne avec une petite équipe d\'anges de grade 3 sans prévenir ses collègues.\nPendant le stage : boit les sous-entendus, s\'intéresse aux PJ (venus en groupe : équipe d\'Andromalius ou anges infiltrés ?), mardi se fait passer pour un infiltré d\'Andromalius puis fait son « coming out » public. Mercredi soir, s\'il voit les PJ, il les « réquisitionne au nom d\'Andromalius ». Jeudi 2h, il se révèle sur le parking et tente d\'arrêter tout le monde, promettant vie sauve et procès équitable à qui se rend.\nCaractéristiques : le livret renvoie au livret de règles, qui ne donne que la fiche « archange du double jeu » (celle de Mathias) : reprise telle quelle.',
});
const angesEmm = npc('anges-emmanuel', {
  nom: 'Anges d\'Emmanuel (équipe de soutien)', source: 'Anges de grade 3 infiltrés au stage', type: 'ange', qty: 2,
  car: car('4 4 4 4 4 4'), def: L(5), pp: 40, armes: [arme('Arme bénie', 'Épée longue', 5), arme('Arme de poing', 'Revolver gros calibre', 4)],
  notes: 'Mentionnés sans précisions (ni nombre, ni caractéristiques) : valeurs entièrement estimées pour des anges de grade 3, à ajuster. Infiltrés parmi le personnel ou les stagiaires ; peuvent épauler Emmanuel au final.',
});
const videurs = npc('videurs', {
  nom: 'Videurs du Pacha Club', source: 'Humains, gardes du corps improvisés de JPP', qty: 3,
  car: car('3 2 2 2 2 2'), def: L(2), pfFix: 5, seuilsFix: seuils('4/8/12/16'),
  armes: [arme('Pistolet', 'Revolver gros calibre', 2), poing(3)],
  notes: 'Sans caractéristiques dans le livre : valeurs estimées de videur armé. Protègent JPP et tirent sur Emmanuel au final ; décérébrés.',
});

const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });

// ================= Scènes =================
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  scene('convocation', '1. La convocation (et l\'enquête sur la liste)', 'Chez les PJ – quelques jours avant le lundi',
    `Les PJ reçoivent une cassette VHS : un clip d'un quart d'heure, tourné « à l'américaine », où Laurent Foux (en démonique) et Pascal Collard (en français) déambulent en costume dans le centre de conférences et vantent un stage « stimulant, amusant, enrichissant et obligatoire ». Beaucoup de mots, très peu d'informations ; la cassette s'autodétruit après lecture. À retenir : lundi 9 h, centre de formation Rhin Poulain, Cergy-Pontoise, présence obligatoire.
Point qui doit intriguer : leur contact habituel n'est au courant de rien (Mathias les a fait ajouter à la liste au dernier moment) et ils sont la seule équipe convoquée au complet, tous les autres venant seuls. Source de quiproquos toute la semaine.

Enquête « Convocation » (à tout moment) :
• Le chargé de mission des PJ, vexé d'avoir été court-circuité, peut creuser si on insiste ; un ami haut placé ou un démon administratif aussi.
• Le mémo d'affectation est signé de Génocidax, sur le conseil d'un subordonné administratif, Dellar (joignable surtout par des démons restés en Enfer). Dellar est en réalité un ange d'Emmanuel infiltré, membre du réseau de Mathias : agent triple très pro, il perd pied si on l'interroge finement sur cette affaire et peut lâcher une allusion. Au pire, il avoue avoir agi pour Izkra.
• Izkra (Mathias) explique alors, très calmement, qu'il est démon d'Andromalius, preuves à l'appui, qu'il soupçonne Kikor d'être un ange d'Emmanuel et qu'il a voulu une équipe extérieure, prête à lui obéir si ses soupçons se confirment (Andromalius étant lui-même infiltré).

Ton : faire croire aux joueurs à un « non-scénario » de dépaysement, avant de les faire basculer.`),
  scene('lundi-matin', '2. Lundi matin : accueil et premiers cours', 'Centre Rhin Poulain, Cergy-Pontoise – lundi 9 h-14 h',
    `Le lieu : centre de stage façon « gâteau raté » années 70 (restaurant médiocre, cafétéria, bureaux, 22 salles vieillottes, amphithéâtre) à côté de l'hôtel « Tupperware » de 50 chambres sur 8 étages, au bord du saumâtre lac des Corolles. Tout est réservé pour le stage ; une trentaine d'employés, tous humains. Huis clos : on sort peu. Remettre le programme officiel (voir notes du scénario).

• 9 h – Pot d'accueil : les PJ découvrent qu'ils sont la seule équipe. Pascal et Loran font le tour des groupes.
• 9 h 30 – Génocidax, parrain : le stage serait « l'arme secrète » qui damnera l'humanité. Ricanements discrets ; Emmanuel y voit la confirmation de sa théorie. Rappel : aucun pouvoir hors des ateliers encadrés, sous peine d'exclusion et de limitation.
• 10 h – Plénière de Pascal (diaporama « Pauvre Point ») : les démons refusent qu'un humain leur fasse la leçon ; Loran doit rappeler le règlement.
• 11 h – Pitocrax sur les principes de la damnation : soporifique, tout le monde bavarde. Youkaidi veut rétablir l'ordre, manque de se battre avec Turgolak et Quinquin ; Duglor se range avec Youkaidi ; Loran calme tout. Foutrak réclame le paiement des paris : Loran le met dehors et écourte l'exposé.
• 11 h 30 – Apéro surprise : Mathias lâche des allusions sur le « vrai but » du stage, la rumeur se répand (joie d'Emmanuel). Foutrak règle les paris par un chifoumi (Youkaidi et Duglor gagnent).
• 12 h 30 – Déjeuner au self : Foutrak et Marcus parient sur qui séduira Trogluk le premier ; tout le monde parie en douce ; Tampax est vexée de ne pas être l'objet du pari ; Pandémonium entre dans la course.`,
    [inScene(pascal), inScene(loran), inScene(chantal), inScene(genocidax), inScene(pitocrax), inScene(youkaidi), inScene(turgolak), inScene(quinquin), inScene(duglor), inScene(foutrak), inScene(mathias), inScene(emmanuel)]),
  scene('lundi-apres-midi', '3. Lundi après-midi : joutes verbales et cocktail', 'Salles de cours et bar du centre – lundi 14 h-22 h 30',
    `• 14 h – Pascal sur le message marketing : Torqus conteste tout ; Prosper (assis à côté, « par hasard ») demande si c'est un stage de com' ou un entraînement militaire. Pitocrax, Emmanuel, Prosper, Trogluk, Pandémonium, Foutrak et Marcus se lancent dans une heure de joute rhétorique ; les bourrins sont mouchés. Fracture intellos / bourrins. Mathias glisse aux PJ que « décidément, ils sont forts dans les services secrets ».
• 16 h – Goûter : Marcus drague lourdement Trogluk ; Prophylactik, déguisé en clown, l'imite. Marcus nie : Foutrak empoche le pari (un croissant) et le cède à Prophylactik. Emmanuel commence à s'intéresser aux PJ (venus en groupe : équipe d'Andromalius ? anges ?) et vient les sonder avec Youkaidi.
• 16 h 30 – Jeu de rôles de Pitocrax : Turgolak (à côté de Prosper) le démonte sans cesse ; Prophylactik arrive déguisé en Pitocrax. Loran insulte les trouble-fêtes ; Mathias renchérit sur « l'importance cachée » du stage. Paranoïa.
• 18 h – Fin des séminaires : Emmanuel écume le bar à la recherche des « chefs », Mathias l'encourage. Dialogue de sourds entre Emmanuel, Mathias, Youkaidi, Torqus, Trogluk, Duglor, puis Quinquin et Prophylactik, qui ressemble à une réunion d'anciens combattants (le personnel humain impose la langue de bois). Silence gêné à l'arrivée de Loran et Pascal.
• 19 h – Cocktail : réflexions à voix haute de Pitocrax, Tampax, Torqus et Emmanuel ; Loran menace d'appeler Andromalius. Torqus hurle ; Prosper glisse un mot à Turgolak, qui se jette sur Torqus (pas de pouvoirs, vite séparés).
• 20 h – Dîner : Pascal tente l'ambiance « club » et échoue lamentablement.`,
    [inScene(pascal), inScene(loran), inScene(torqus), inScene(prosper), inScene(marcus), inScene(prophylactik), inScene(trogluk), inScene(turgolak), inScene(emmanuel), inScene(mathias)]),
  scene('lundi-nuit', '4. Lundi nuit : vaudeville à l\'hôtel', 'Hôtel, bar, cafétéria et parc – lundi 22 h 30-4 h',
    `• 22 h 30 – Temps libre, chaos total : chacun cherche qui couche avec qui, qui a le pouvoir, qui est d'Andromalius. Gros temps de roleplay : présenter les PNJ, utiliser la table de rencontres. Ambiance de vaudeville (portes qui claquent, cocus).
  – Emmanuel va de groupe en groupe, questions ouvertes et sous-entendus.
  – Mathias lâche des allusions sur cet « étrange démon, sûrement d'Andromalius » et surveille si les PJ soupçonnent Emmanuel.
  – Pascal enchaîne les sujets creux et propose de la coke ; bide.
  – Chantal joue la blonde avec Tampax et Trogluk ; les bourrins (Quinquin, Turgolak, Duglor, Prophylactik) les draguent.
  – Foutrak raconte au barman sa contribution à la SF croate ; Marcus brade des montres ; Levothyrox fume au bord du lac.
• 23 h – Tampax rejoint Youkaidi ; un geste réveille en lui le souvenir d'une trahison au XIXe siècle (Colombie) et il conclut que c'était elle. Il la chasse, elle l'humilie bruyamment dans le couloir (tout l'hôtel en profite), puis finit la nuit avec Pitocrax, Torqus et ses chiens. Emmanuel s'intéresse à ce dialogue de sourds.
• 0 h – La partie fine de la chambre 22 est interrompue : Mollard (Andromalius, grade 2), arrivé pour « la sécurité du stage », arrête Torqus, dénoncé par Prosper pour mauvais esprit.
• 0 h 30 – Pascal et Loran, dans le hall, assurent que tout va bien ; personne n'y croit, chacun maudit les infiltrés. Emmanuel jubile.
• 1 h 30 – Mollard discute discrètement avec Mathias, un de ses agents ; Emmanuel les observe en se demandant qui est le plus infiltré.
• 2 h 30 – Emmanuel, ayant entendu Mollard citer Prosper comme mouchard, l'espionne (Prosper s'en moque).
• 3 h 30 – Levothyrox reconnaît en Youkaidi son ancien complice de Colombie : souvenirs et joints dans sa chambre. Emmanuel surprend une partie de la conversation.

Table de rencontres aléatoires (2d6) : voir notes du scénario ; à utiliser toute la semaine pour relancer.`,
    [inScene(mollard), inScene(tampax), inScene(youkaidi), inScene(levothyrox), inScene(torqus), inScene(chantal), inScene(emmanuel), inScene(mathias)]),
  scene('mardi-matin', '5. Mardi matin : le sorcier et le punch-LSD', 'Salles de cours et restaurant – mardi 8 h-14 h',
    `• 8 h – Petit-déjeuner : Youkaidi fusille Tampax du regard ; Mollard calme une bagarre naissante et annonce qu'il restera toute la semaine, avec ses infiltrés. « Les vacances sont finies » (Prophylactik).
• 9 h – Raoul Giver, sorcier pyromane, sur les invocations : vif intérêt, Pascal est ravi.
• 10 h 40 – Turgolak (qui vient de parler cinq minutes avec Prosper) cogne Pascal, qui finit à l'infirmerie. Pause prolongée jusqu'à la diatribe de Mollard contre le bordel et les « pseudo-renégats ». Tampax drague Raoul ; Loran voit son stage et sa carrière en péril (« ta gueule ! » à Pascal).
• 12 h – Deuxième intervention de Raoul : décontracté, sept whiskys, clins d'œil à Tampax.
• 12 h 30 – Déjeuner : Levothyrox a parié avec Foutrak qu'il verserait du LSD dans le punch ; Emmanuel, Mathias, Quinquin et Prosper le remarquent. Marcus délire (veut dépecer un serveur à la petite cuillère) et part à l'infirmerie avec Pandémonium et Raoul. Quinquin, accusé, accuse Levothyrox. Prosper accuse Mollard d'incompétence par l'entremise de Foutrak, Emmanuel et Mathias en rajoutent. Mollard convoque Levothyrox, Quinquin, Foutrak, Emmanuel et Mathias : punition = suivre le stage, limitation promise s'ils dérapent ; il insiste sur la portée « historique » du stage (Emmanuel et Mathias sont ravis).
  Foutrak comprend qu'une limitation promise au lieu d'être donnée cache quelque chose : il conclut que tout le monde est infiltré et lance la rumeur dans le quart d'heure. Dès lors Emmanuel, Mathias, Levothyrox et Youkaidi (ami de Levothyrox) passent pour les traîtres qui ont monté le piège.`,
    [inScene(raoul), inScene(mollard), inScene(levothyrox), inScene(foutrak), inScene(quinquin), inScene(marcus), inScene(pandemonium), inScene(pascal)]),
  scene('mardi-sacrifice', '6. Mardi 14 h : le sacrifice de Raoul Giver', 'Salle du premier atelier, puis le hall – mardi 14 h',
    `Premier atelier « faiblesses humaines » : Raoul doit en être la victime. Toujours sous LSD, il profite de l'occasion pour invoquer… Guillaume, ange de Georges à la retraite, furieux d'être téléporté au milieu de démons.
Bagarre mémorable à laquelle tout le monde participe (les PJ aussi, s'ils le veulent) ; elle déborde dans le hall devant trois serveurs venus installer la pause café. Un employé meurt dans la mêlée, ainsi que Turgolak et Guillaume, submergé par le nombre. Les deux autres serveurs sont achevés pour ne pas parler.
Mollard fait évacuer les corps, étouffe l'affaire et sermonne les stagiaires ; murmures : tout le monde pense désormais que le stage est un piège géant, une sorte de « Koh-Lanta démoniaque ».
14 h 30 – Programme arrêté pour la journée.`,
    [inScene(guillaume), inScene(raoul), inScene(turgolak), inScene(mollard), inScene(quinquin), inScene(duglor), inScene(youkaidi)], true),
  scene('mardi-complots', '7. Mardi après-midi et soir : complots et coming out', 'Bar, salles et parc ; puis « Le Bureau », bar de Cergy – mardi 14 h 30-1 h',
    `• Après-midi libre consacré aux complots : tout le monde enquête sans agir. Emmanuel, soupçonné d'être d'Andromalius, préfère avouer à Pitocrax une fausse identité : il serait en mission pour Andromalius pour découvrir le vrai but du stage. Pitocrax le répète à tout le monde. Les bourrins (Quinquin, Duglor, Prophylactik, Pandémonium) décident de le tuer discrètement ; deux heures d'engueulade sans plan.
• 16 h 30 – Trogluk parle de sa vie infiltrée de mannequin : défilé narcissique ; Tampax et Chantal, jalouses, la débinent. Loran menace d'expulsion ; presque tous se font sortir. Vers 17 h 30 Pandémonium revient de l'infirmerie ; vers 18 h 15 il ne reste que lui, Prosper, Loran, Pascal et peut-être les PJ.
• 19 h – Sermon de Loran sur le « mauvais esprit ». Désormais : le traître (Emmanuel), les suspects (Levothyrox, Youkaidi, Mathias) et deux camps de bourrins (Quinquin et Duglor contre Prophylactik et Pandémonium) qui s'accusent de ménager l'ennemi. Prosper attise et va chercher Mollard au moment où Prophylactik détaille ses plans pour tuer Emmanuel : limitation et exclusion.
• 19 h 30 – Dîner : Prosper laisse entendre que Prophylactik a été viré pour tentative d'assassinat. Emmanuel se lève et avoue publiquement être un infiltré, mais compte suivre le stage. Mollard, furieux qu'il ait grillé sa couverture, le garde sous condition qu'il fasse ses preuves.
• 22 h 30 – Soirée pub au « Bureau » : Emmanuel est ostracisé ; Prosper suggère que c'est une ruse pour que les autres infiltrés travaillent mieux. L'alcool échauffe les esprits.`,
    [inScene(emmanuel), inScene(pitocrax), inScene(trogluk), inScene(prophylactik), inScene(pandemonium), inScene(prosper), inScene(mollard), inScene(loran)]),
  scene('mardi-nuit', '8. Nuit de mardi : interrogatoires et meurtre du gardien', 'Caves, bar et hall du centre – mercredi 1 h 30-7 h 30',
    `• 1 h 30 – Duglor, Quinquin et Pandémonium, réconciliés pour l'occasion, agressent sexuellement une serveuse. Mollard arrive avec sept démons d'Andromalius, les arrête et les interroge dans les caves (virilement mais courtoisement) ; il comprend que Prosper est au centre de bien des problèmes, sans surprise.
  Au bar, les autres se racontent leurs missions : la suspicion cède à une étrange solidarité d'anciens combattants. Vers 4 h, Youkaidi raconte sa trahison en fixant Tampax, qui nie tout et parle de malentendu ; il la menace et manque de passer à l'acte, Chantal le retient en lui rappelant le sort des apprentis assassins. Foutrak propose un poker, en vain.
• 5 h 15 – Youkaidi, qui veut tuer Tampax discrètement en accusant un « tueur psychopathe », s'entraîne : embusqué derrière une plante du hall, il tue d'un coup de tête le gardien de nuit Simon Cohenovitch, casse une vitre, ouvre la fenêtre et sort le corps pour faire croire à un tueur venu de dehors.
• 6 h – Une femme de ménage découvre le corps. Mollard, prévenu, relève les indices mais ne dit rien (il sort de cinq heures d'interrogatoires).
• 7 h 30 – Les trois agresseurs sont relâchés avec un blâme et mis sous surveillance (pour Mollard, ce n'est qu'une « petite erreur »).

Enquête « Voisinage » (scène du meurtre) :
• Le corps montre que le gardien a été tué par une force surhumaine.
• Les traces de sang prouvent qu'il a été tué à l'intérieur ; les bris de vitre montrent que la fenêtre a été cassée et ouverte de l'intérieur.
• Empreintes de rangers taille 44.
• Conclusion : un démon a tué le gardien d'un coup de tête dans le centre puis a maquillé (très mal) le meurtre. Mollard a vu tout cela et le garde pour le dossier Youkaidi ; si les PJ lui en parlent, il les remercie : « c'est classé et pris en compte ».`,
    [inScene(youkaidi), inScene(mollard), inScene(duglor), inScene(quinquin), inScene(pandemonium), inScene(tampax), inScene(chantal)]),
  scene('mercredi-usine', '9. Mercredi : l\'usine et le pique-nique sanglant', 'Usine désaffectée du Val-d\'Oise, puis bords de l\'Oise – mercredi 8 h-14 h',
    `• 8 h – Mollard sermonne sur l'attitude des agresseurs sans sanction officielle.
• 9 h – Bus : Pascal explique qu'il s'agit de mettre en pratique le message marketing.
• 10 h – Atelier : une dizaine d'humains (recrutés par questionnaire à la sortie d'un PMU et d'un institut d'esthétique, on leur a promis une réunion « Tupperware » pleine de cadeaux) ; chaque stagiaire doit en convaincre un de signer un pacte de sang. Exercice libre mais difficile : faire jouer les PJ. Mauvais : Youkaidi, Emmanuel, Duglor, Quinquin, Pandémonium, Marcus (sa « vente flash » rate), Levothyrox. Bons : Pitocrax, Tampax, Trogluk, Foutrak, Prosper, Mathias.
• 12 h – Pique-nique : les gagnants ont un meilleur plateau-repas. Jalousie, puis bagarre entre gagnants et perdants (fracture intellos / bourrins) en l'absence de Mollard, resté à l'usine. Duglor utilise ses pouvoirs et tue Pandémonium ; panique générale.
  Pendant ce temps (seuls absents : Tampax, avec un garde champêtre, et Youkaidi), Youkaidi tue et mutile un scout en course d'orientation, puis doit massacrer les huit autres. Foutrak, fuyant Duglor, découvre le massacre ; les deux s'arrêtent net et rameutent tout le monde, ce qui met fin à la bagarre.
  Bilan : Pitocrax tué par Duglor ; Trogluk tuée par Quinquin avec la complicité de Levothyrox (violée à mort dans le livre ; à adapter selon la table). Duglor, perdu pour la cause, s'enfuit et passe renégat.
• 14 h – Retour en bus dans un silence glacial ; Mollard reprend les choses en main.`,
    [inScene(duglor), inScene(pandemonium), inScene(pitocrax), inScene(trogluk), inScene(quinquin), inScene(levothyrox), inScene(foutrak), inScene(youkaidi), inScene(marcus)], true),
  scene('mercredi-tribunal', '10. Mercredi après-midi et soir : le tribunal de Mollard', 'Salle de débriefing, bureau de Mollard, bar ; puis le lac – mercredi 15 h-nuit',
    `• 15 h – L'atelier de débriefing devient un tribunal : Mollard exclut Quinquin avec une limitation, dénonce Duglor renégat, fustige ceux qui nuisent à l'Enfer, évoque les scouts (ses services ont dû tout camoufler). Il demande le nom du coupable, personne ne parle : interrogatoires individuels dans son bureau jusqu'à 18 h, PJ compris (voir le choix).
• 18 h – Concours de slogans sur l'Enfer : ambiance morose malgré Pascal ; seul Prosper est motivé (il veut gagner).
• 18 h 30-19 h – Remise des copies, conciliabules discrets et paranoïaques ; trophées contestés (Quinquin, voisin de Prosper…), Mollard lâche du lest.
• 20 h 30 – Dîner. 23 h – Soirée casino de Foutrak (franc succès) ; Levothyrox refait du punch-LSD ; Tampax danse la salsa nue. Youkaidi craque et sort, suivi d'Emmanuel puis de Mathias : tous deux le voient tuer un jogger au bord du lac (pour se calmer et nourrir sa théorie du psychopathe) et se taisent.
• Mathias et Emmanuel approchent les PJ (voir le choix).
• La nuit : tout le monde passe de chambre en chambre pour sonder et survivre : un séminaire d'espionnage, pouvoirs discrets utilisés à fond (récupération de PP difficile). Le MJ a les mains libres ; si l'ambiance retombe, au lit.
• Mathias fait savoir à tous qu'un énorme événement aura lieu la nuit suivante, pendant la soirée en boîte, sans doute contre l'invité surprise Jean-Pierre Pernod.`,
    [inScene(mollard), inScene(youkaidi), inScene(tampax), inScene(prosper), inScene(foutrak), inScene(emmanuel), inScene(mathias)], false,
    [choice('denonciation', 'Interrogés par Mollard, les PJ parlent-ils de Youkaidi ?', [
      ['Ils dénoncent Youkaidi ou apportent des preuves', 'Youkaidi est immédiatement arrêté : plus de « psychopathe », Tampax est sauvée et la scène du parking (jeudi 2 h) devra trouver un autre déclencheur.'],
      ['Une rumeur ou une information persistante circule', 'Youkaidi fuit dès que possible et se jette sur Tampax pour se venger : sauf intervention des PJ ou circonstances exceptionnelles, elle est massacrée ; il tente ensuite de passer renégat.'],
      ['Ils se taisent', 'Les événements suivent leur cours : Mollard, presque sûr que c\'est Youkaidi, le laisse faire pour piéger ceux qui ne le dénoncent pas.'],
    ]),
    choice('approche', 'Mercredi soir, qui gagne la confiance des PJ ?', [
      ['Mathias (« Izkra »)', 'Il se révèle comme infiltré d\'Andromalius enquêtant sur un vaste réseau d\'agents doubles et leur demande de se tenir prêts à intervenir, surtout contre Emmanuel. Les PJ risquent de devenir ses pions au final.'],
      ['Emmanuel (« Kikor »)', 'Il prétend mener une mission ultra-secrète au nom d\'Andromalius et réquisitionne les PJ : il veut des informations sur le but du stage et l\'activité séditieuse qu\'il cache. Les PJ peuvent lui fournir (ou lui fabriquer) des indices.'],
      ['Personne : ils jouent leur propre jeu', 'Les deux archanges les surveillent de près ; les PJ arrivent au final libres de leurs choix, mais sans allié.'],
    ])]),
  scene('jeudi', '11. Jeudi : la débâcle de Mollard et la venue de JPP', 'Salles du centre – jeudi 8 h-23 h',
    `• 8 h – Mollard redemande qui sait quelque chose sur le psychopathe ; il pense que c'est Youkaidi mais attend pour piéger ceux qui ne le dénoncent pas.
• 9 h-10 h 30 – Jeu de rôles de Pascal sans entrain ; pause café sans une blague.
• 11 h – Mollard interrompt le jeu : limitation pour tout le monde si le coupable n'est pas dénoncé. Pluie de dénonciations sur tout et n'importe quoi. Prosper va glisser quelque chose à l'oreille de Mollard, qui sort en hurlant qu'il les laisse dans leur merde. Personne ne sait ce que Prosper a dit.
• 12 h 30 – Déjeuner détendu, Prosper est le héros du jour mais refuse de répéter ce qu'il a dit (« rien »).
• 14 h – Atelier « hypocrisie et désinformation » par Jean-Pierre Pernod (Salazax) : reportages bidon et arnaques télévisuelles, l'assistance rit aux larmes ; même Loran se décrispe.
• 18 h – Dédicace de JPP : Tampax le drague ouvertement, Youkaidi verdit.
• 19 h – Youkaidi s'en prend à JPP ; Mollard revient, foudroie Prosper du regard, hurle sur Youkaidi mais passe mal et Loran l'invite à se détendre. Prosper s'approche de lui, compatit (trahi par les siens…) : Mollard fond en larmes – un subordonné a lancé une enquête interne sur lui après dénonciation. Il ne comprend pas comment son équipe a su. Prosper cache mal un demi-sourire.
• 19 h 30 – Dîner de gala : ambiance de fête, JPP rivalise de cynisme ; Mollard déprime, sursaute à chaque entrée, terrorisé à l'idée d'être arrêté par ses collègues.`,
    [inScene(mollard), inScene(prosper), inScene(salazax), inScene(youkaidi), inScene(tampax), inScene(loran), inScene(pascal)]),
  scene('pacha', '12. Jeudi 23 h : sortie au Pacha Club', 'Pacha Club, Louveciennes – jeudi 23 h-2 h',
    `JPP provoque une mini-émeute en entrant, drague tout ce qui bouge, humilie le personnel ; un petit aréopage de démons se forme autour de lui, ravis d'être vus avec « JPP ». Une équipe de TFcon filme tout.
Au milieu des danses, Mathias annonce que c'est pour ce soir et que ce sera énorme. La rumeur se répand en une seconde sans gâcher l'ambiance : tout le monde se prépare à quelque chose, sans savoir quoi.
À l'approche de la fin, accélérer : les joueurs doivent sentir qu'ils ne peuvent pas grand-chose face aux archanges, mais que ce qu'ils feront et diront comptera.`,
    [inScene(salazax), inScene(videurs), inScene(mathias), inScene(emmanuel), inScene(tampax), inScene(youkaidi)]),
  scene('parking', '13. Jeudi 2 h : la bataille du parking', 'Parking du Pacha Club, Louveciennes – vendredi 2 h',
    `Tampax se laisse emmener par JPP sur le parking. Mathias le voit et va chercher Youkaidi, qui craque : il tue un gardien, Philippe Delacour, et met en scène son cadavre entre deux voitures, arme au poing, comme s'il avait tiré avant de mourir. Puis il va chercher Tampax, officiellement pour s'excuser, en fait pour la tuer et accuser le gardien. Mathias devine le plan et envoie un gardien chercher Emmanuel et les autres.
Toute l'assistance, quelques flagorneurs humains et trois videurs voient Tampax fuir un Youkaidi furieux. Emmanuel juge que c'est le moment : il se révèle (« archange du double jeu », tous en état d'arrestation, « agents doubles ») et attaque ceux qui résistent, promettant la vie sauve, un procès équitable et une place dans ses rangs à ceux qui l'aident.

Chaos : humains ivres ou drogués, videurs, équipe de télé qui filme jusqu'au bout, démons partagés entre fuite, combat et collaboration, au milieu des 607 et des BM d'un parking de banlieue.
Comportements :
• Humains : fuient dès que possible, sauf les plus ivres ; les videurs protègent JPP et tirent sur Emmanuel ; la télé filme tout.
• Pascal, Loran, Génocidax, Tampax : fuient dès que possible (pas forcément dans la bonne direction).
• Chantal et JPP : combattent mais fuient si ça tourne mal et dès que Mathias se révèle.
• Youkaidi, Quinquin, Mollard, Levothyrox : combattent jusqu'à la mort, préférant retourner en Enfer.
• Prosper, Foutrak, Marcus : hésitent entre fuite et collaboration ; selon les premiers rounds, ils peuvent passer du côté d'Emmanuel.
• Mathias : pousse discrètement les gens à lutter contre Emmanuel et fait en sorte que tout se passe devant les caméras de surveillance et de la télé ; son but est de récupérer les bandes pour prouver les âneries d'Emmanuel, et éventuellement de le sauver devant témoins.

Ce que font les PJ (combattre Emmanuel, l'achever, protéger les bandes ou les détruire, laisser Mathias agir…) détermine la fin (scène suivante).`,
    [inScene(emmanuel), inScene(angesEmm), inScene(mathias), inScene(youkaidi), inScene(mollard), inScene(levothyrox), inScene(tampax), inScene(salazax), inScene(chantal), inScene(videurs), inScene(prosper), inScene(foutrak), inScene(marcus)], true),
  scene('conclusion', '14. Conclusion : les quatre fins', 'Paradis et Enfer – après le stage',
    `Selon le sort d'Emmanuel et des bandes vidéo, déterminer la fin (voir le choix). Toutes les fins sont possibles : rester souple ; si la partie a pris un tout autre chemin, juger l'esprit d'initiative des PJ pour en déduire le type de victoire.
Rappel : ce n'est pas une mission. Si rien ne se passe ou si les démons ne découvrent rien, il n'y a pas de débriefing, donc ni récompense ni limitation. Les actions des PJ influent néanmoins fortement sur les modalités du retour de Mathias chez les anges.
Pour la suite de la campagne, Ze Siroz Dream Team considère que le résultat officiel est une défaite mineure.
Le programme officiel prévoyait encore le vendredi (intervention de Tampax, de Marcus, discours de fin de Génocidax, remise des diplômes, fin à 16 h) : après la nuit du parking, il n'a sans doute jamais lieu.`,
    [], false,
    [choice('fin', 'Comment se termine la bataille du parking ?', [
      ['Victoire totale : Emmanuel meurt ou fuit, Mathias n\'a pas agi ni récupéré les bandes', 'Gain de 4 à 6 PA. Mathias devient vice-archange au même titre qu\'Emmanuel : le service est coupé en deux, les deux camps passent plus de temps à se combattre qu\'à infiltrer l\'Enfer et deviennent quasiment inefficaces, pour la plus grande joie des Enfers.'],
      ['Victoire mineure : Emmanuel est sauvé de justesse par Mathias, qui ne récupère pas les bandes', 'Gain de 1 à 3 PA. Mathias reprend sa place ; Emmanuel, rétrogradé grade 3, garde une partie de ses troupes. Lutte d\'influence entre mathiasiens et emmanuelliens dans les services d\'infiltration, dont l\'efficacité est nettement amoindrie.'],
      ['Défaite mineure : Emmanuel meurt mais Mathias récupère les bandes', 'Perte de 1 à 3 PA. Mathias reprend sa place, purge les pires éléments d\'Emmanuel, place son réseau ; Emmanuel est rétrogradé grade 0. (Résultat officiel retenu pour la suite.)'],
      ['Défaite totale : Emmanuel est sauvé par Mathias, qui récupère aussi les bandes', 'Perte de 4 à 6 PA. Mathias reprend sa place de plein droit, Emmanuel est jeté au Purgatoire ; purge sévère de ses anges, presque aussi dure que celle qu\'il avait menée.'],
    ])]),
];

const scenario = {
  id: 'ins2-eternite-trop-courte',
  nom: 'Livret INS – L\'éternité est trop courte…',
  resume: `Scénario long pour démons (INS), en huis clos. Les PJ sont convoqués à un stage obligatoire de « communication infernale » animé par un publicitaire damné et un démon de Nybbas dans un centre de conférences de Cergy-Pontoise. En réalité, l'archange Mathias, infiltré en Enfer comme démon d'Andromalius, a fait croire à son successeur Emmanuel qu'il s'agissait d'une réunion secrète de l'élite de l'espionnage démoniaque : Emmanuel s'infiltre en personne. Une semaine de chaos (paris, bagarres, meurtres, interrogatoires d'Andromalius, rumeurs d'infiltrés), jusqu'à la révélation d'Emmanuel sur un parking de boîte de nuit. Les actions des PJ décident de l'issue de la lutte entre les deux archanges (quatre fins).`,
  notes: `Source : ${REF}. Fiches des archanges : ${REF_ARCH}.
Ton : comédie noire et paranoïa ; présenter d'abord un « non-scénario » de dépaysement (vie quotidienne des démons), puis faire basculer. Ne jamais laisser les joueurs souffler : s'ils se concertent ou s'isolent, un PNJ s'invite ou une scène surréaliste éclate. Insister sur les personnalités caricaturales et des running gags (Prosper qui s'éloigne de chaque dispute, Turgolak au téléphone avec sa femme, Pascal éconduit par le personnel féminin). Ce n'est pas un scénario d'enquête classique : les PJ doivent réfléchir au milieu d'une avalanche de faits et de non-événements. Leitmotiv : un avion sans pilote, mais ils restent maîtres de leur destin.
Contenu adulte : le livre décrit plusieurs violences sexuelles et des meurtres gratuits ; à adoucir, mettre hors champ ou supprimer selon la table.

Participants (stagiaires) et motivations : lèche-bottes qui veulent de bonnes notes aux tests de fin de stage ; récalcitrants punis (bourrins de Bifrons, de Crocell…) ; infiltrés d'Andromalius chargés de tester la loyauté (dont Mathias) ; un démon de Baal venu se venger d'une ancienne collègue ; une démone d'Andrealphus venue s'éclater ; un ange d'Emmanuel ; des humains destinés à servir de victimes ; les PJ.

Programme officiel (remis aux PJ) :
• Lundi : 9 h accueil · 9 h 30 allocution de Génocidax · 10 h plénière de Pascal · 11 h Pitocrax (principes de la damnation) · 12 h 30 déjeuner · 14 h Pascal (message marketing) · 16 h goûter · 16 h 30 jeu de rôles de Pitocrax · 18 h fin · 19 h cocktail · 20 h dîner · 22 h 30 temps libre
• Mardi : 8 h petit-déjeuner · 9 h Raoul Giver (invocations) · 10 h 30 pause · 11 h Raoul Giver (2) · 12 h 30 déjeuner · 14 h sacrifice de Raoul Giver (atelier faiblesses humaines) · 16 h pause · 16 h 30 Trogluk (vie infiltrée) · 19 h 30 dîner · 22 h 30 soirée au « Bureau »
• Mercredi : 8 h petit-déjeuner · 9 h bus pour l'usine · 10 h atelier de damnation · 12 h pique-nique au bord de l'Oise · 14 h retour · 15 h débriefing · 16 h 30 pause · 18 h concours de slogans · 18 h 30 remise des copies · 19 h trophées · 20 h 30 dîner · 23 h soirée libre
• Jeudi : 8 h petit-déjeuner · 9 h jeu de rôles sur la pub (Pascal) · 10 h 30 pause · 11 h reprise · 12 h 30 déjeuner · 14 h « hypocrisie et désinformation » (Jean-Pierre Pernod) · 18 h dédicace · 19 h 30 dîner de gala · 23 h Pacha Club à Louveciennes · 5 h bus de retour
• Vendredi : 8 h petit-déjeuner · 9 h Tampax (le sexe comme pouvoir) · 10 h 30 pause · 11 h Marcus (la négociation) · 12 h déjeuner · 14 h discours de fin de Génocidax · 15 h remise des diplômes · 16 h fin

Table de rencontres aléatoires et relanceur d'ambiance (2d6) :
• 2 – Pascal veut parler du « contrat » à Loran, qui le remet sèchement à sa place (il lui appartient).
• 3 – Chantal lit un roman à l'eau de rose ; dérangée, elle laisse tomber le Kant caché dedans.
• 4 – Chantal s'isole avec un serveur marié (elle ne choisit que des hommes mariés).
• 5 – Loran oublie son Palm Pilot sur une table ; sinon Emmanuel le lit et le repose. Il contient des éléments biographiques sur Pascal et un dossier sur Génocidax (les mesquineries de Loran attribuées à d'autres), que Génocidax ignore.
• 6 – Youkaidi tente de pirater le réseau du centre et découvre qu'une chambre était réservée pour Mollard dès le départ : son arrivée n'a rien à voir avec la discipline.
• 7 – Génocidax papote et dit tout et son contraire selon son interlocuteur.
• 8 – Pitocrax fait le beau devant Chantal (soirées mondaines) ; elle le démolit méchamment et intelligemment, puis s'éclipse furieuse ; Emmanuel en conclut que même elle est un agent secret.
• 9 – Tampax et Trogluk parlent crûment de sexe ; Duglor, éméché, s'invite lourdement et se fait renvoyer.
• 10 – Le réceptionniste transmet à Turgolak un message de « sa fille » ; il nie violemment, fait une crise, puis s'éclipse pour rappeler.
• 11 – Pandémonium part avec un serveur ; le garçon disparaît à jamais.
• 12 – Marcus brade des DVD pornographiques ; l'un montre Torqus, qui rachète tous les exemplaires et les jette dans le lac.

Récompenses (conclusion) :
• Victoire totale : +4 à 6 PA · Victoire mineure : +1 à 3 PA
• Défaite mineure (« moyenne ») : −1 à 3 PA · Défaite totale : −4 à 6 PA
• Rien ne se passe / rien découvert : pas de débriefing, ni récompense ni limitation (c'est un non-scénario).

Fiches : caractéristiques en niveaux INS/MV (Ch des humains en Foi). Emmanuel et Mathias reprennent la fiche « archange du double jeu » du livret de règles. Armes non précisées dans le livre estimées d'après les talents (indiqué sur chaque fiche). Anges d'Emmanuel et videurs : valeurs entièrement estimées. Non fichés : les sept démons d'Andromalius de Mollard, Dellar, les employés (gardiens Simon Cohenovitch et Philippe Delacour), les scouts, l'équipe de TFcon.`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [pascal, chantal, loran, genocidax, youkaidi, pitocrax, tampax, torqus, raoul, turgolak, trogluk, duglor, quinquin, prophylactik, pandemonium,
  mollard, salazax, foutrak, marcus, prosper, levothyrox, guillaume, emmanuel, mathias, angesEmm, videurs].map(asType);

const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));

writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types,', scenes.reduce((s, x) => s + x.choix.length, 0), 'choix');
