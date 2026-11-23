// Génère le fichier d'import « insmv-scenario » pour « Bayonne n'est pas en Crimée » (Angelots en gelée, p. 44-63)
// usage : node gen-angelots-4-bayonne.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const store = {}; globalThis.localStorage ??= { getItem: (k) => store[k] ?? null, setItem: (k, v) => { store[k] = v; }, removeItem: (k) => { delete store[k]; } };
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);
const S = await import(pathToFileURL(path.join(root, 'js/scenario.js')).href);

const REF = 'Angelots en gelée, « Bayonne n\'est pas en Crimée », p. 44-63';
const L = (s) => R.parseLvl(String(s));
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const pows = (s) => s.split(',').map((x) => x.trim()).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
const ARMES = new Map(R.ARMES.flatMap(([g, l]) => l.map((x) => [x[0], { prec: x[1], puis: x[2], melee: R.MELEE_GROUPS.includes(g) }])));
const arme = (n, table, lvl) => { const w = ARMES.get(table); if (!w) throw new Error('arme inconnue : ' + table); return { n, att: L(lvl), ...w }; };
const poing = (lvl) => arme('Coup de poing', 'Coup de poing', lvl);
// attaque au format du livre (seuil, +X, +Y) : att = X×2, précision 0, puissance Y
const bk = (n, x, y, melee) => ({ n, att: x * 2, prec: 0, puis: y, melee });
const P = 'ag4-'; let n = 0; const id = (k) => P + k;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [poing(1)], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});
// profil « PNJ rapide » de l'écran du maître (ange ou démon de tel supérieur, à tel palier de PP)
const quick = (key, camp, sup, palier, o = {}) => {
  const q = S.quickNpc(camp, sup, palier); if (!q) throw new Error('profil rapide inconnu : ' + sup);
  return { ...q, id: id(key), qty: 1, ...o, notes: [o.notes, q.notes, `Personnage : ${REF}.`].filter(Boolean).join('\n') };
};
// fiche toute prête du bestiaire de l'application
const fromBest = (key, bookId, o = {}) => {
  const b = S.BOOK.find((x) => x.id === 'livre-' + bookId); if (!b) throw new Error('bestiaire : ' + bookId);
  return { ...JSON.parse(JSON.stringify(b)), id: id(key), qty: 1, ...o, notes: [o.notes, b.notes, `Utilisé dans : ${REF}.`].filter(Boolean).join('\n') };
};
const ATT_NOTE = 'Attaque au format du livre (seuil, +X, +Y) : attaque = X×2, puissance Y.';

// ---------------- Fiches chiffrées du livre ----------------
const eunides = npc('eunides', {
  nom: 'Eunides Balmoth', source: 'Démon de Shaytan, grade 2 (gardien de nuit des Encres de Marine)', type: 'demon', car: car('5 3 3 4 2 4'), def: L(5),
  pp: 25, pfFix: 9, seuilsFix: seuils('7/14/21/28'),
  armes: [bk('Matraque avec un gros clou', 6, 6, true)],
  pouvoirs: pows('Armure corporelle 3, Décrépitude 5, Peur 5, Protection de l\'esprit, Volonté supra-normale 4'),
  talents: 'Athlétisme 6, Combat 6, Défense 5, Intimidation 6, Regarder d\'un œil torve 4',
  notes: `La cinquantaine, immense, large, impulsif et hideux. Gardien de nuit (et parfois de jour) de l'usine ; il délaisse la vidéosurveillance pour aller terroriser les rôlistes, GN et paintballeurs du sous-bois voisin, terrain non clôturé appartenant à l'usine. Parle peu : il a déjà coursé plusieurs fois la bande de Jean-Louis, rien de plus.\nMatraque : précision +0, puissance +1 dans le livre (65/RU+6/M+6).\n${ATT_NOTE}`,
});
const garfield = npc('garfield', {
  nom: 'Gary Garfield', source: 'Démon d\'Asmodée, grade 3 (chef du C.R.I., multimillionnaire du jeu de rôle)', type: 'demon', car: car('3 3 4 5 4 6'), def: L(6),
  pp: 42, pfFix: 8, seuilsFix: seuils('5/10/15/20'),
  armes: [bk('Tentacules (portée très courte)', 6, 4, true)],
  pouvoirs: pows('Absorption de volonté 6, Aura de confusion 4, Cauchemar 3, Charme 4, Illusions 5, Membre exotique : tentacules, Pari stupide 5, Ténèbres sataniques 4, Voix impérieuse 4, Volonté supra-normale 4'),
  talents: 'Art 2 (jeu de rôle 6), Baratin 6, Corps à corps 5, Défense 6, Manger deux pains au chocolat à la fois 3',
  notes: `Auteur américain prolifique de jeux de rôle, la cinquantaine, petit et obèse, toujours en bleu, baskets d'un modèle introuvable dont il a un stock. Cigares, soda et burgers ; méprisant, déteste perdre son temps et qu'on se moque de son physique. Ne vient au Havre que pour juger Questmaster lors de la convention sur le France, entouré de yes-men et d'une brigade de démons, puis repart en jet vers son palace parisien.\nL'éliminer est l'objectif ultime : sans lui le C.R.I. se disloque en tendances rivales.\nTentacules : précision +2, puissance +1 dans le livre (65/RU+6/M+4).\n${ATT_NOTE}`,
});
const nocnok = npc('nocnok', {
  nom: 'Nocnok Houzzère', source: 'Démon de Vephar, grade 1 (chef des saboteurs du France)', type: 'demon', car: car('5 4 2 3 2 3'), def: L(5),
  pp: 17, pfFix: 8, seuilsFix: seuils('7/14/21/28'),
  armes: [bk('Gros calibre (pénétration importante, portée moyenne)', 4, 4, false)],
  pouvoirs: pows('Armure corporelle 3, Jet d\'acide 3, Vie subaquatique 3'),
  talents: 'Combat 5, Défense 5, Discrétion 3, Intrusion 3, Tir 5',
  notes: `Couler des navires est sa spécialité et sa joie : le France à quai, médiatisé et bondé le jour de la convention, est une occasion rêvée. Déguisé en personnage de dessin animé (Bisounours, Télétubbies…) avec sa bande ; discours spectaculaire prévu pour la cause du NaN.\nLe livre donne « Disparition ou Vie subaquatique 3 » pour toute la bande : Vie subaquatique retenue pour les démons de Vephar.\nGros calibre : précision −2, puissance +4 dans le livre (55/RU+4/M+4).\n${ATT_NOTE}`,
});
const promo = npc('promo', {
  ...nocnok, id: id('promo'), nom: 'Copains de promo de Nocnok', source: 'Démons de Vephar, grade 1', qty: 2,
  notes: `Démons incarnés la même année que Nocnok, venus pour le plaisir de la catastrophe. Même profil que lui (fiche commune du livre).\nNombre non précisé : 2 par défaut.\n${ATT_NOTE}`,
});
const ouikka = npc('ouikka', {
  nom: 'Démons de Ouikka (infiltrés au NaN)', source: 'Démons de Ouikka, grade 1', type: 'demon', qty: 2, car: car('5 4 2 3 2 3'), def: L(5),
  pp: 17, pfFix: 8, seuilsFix: seuils('7/14/21/28'),
  armes: [bk('Gros calibre (pénétration importante, portée moyenne)', 4, 4, false)],
  pouvoirs: pows('Armure corporelle 3, Jet d\'acide 3, Disparition 3'),
  talents: 'Combat 5, Défense 5, Discrétion 3, Intrusion 3, Tir 5',
  notes: `Noyautent le NaN (Normandie aux Normands, groupuscule séparatiste et royaliste). Deux d'entre eux ont fait « disparaître » une bombe chacun et comptent les faire sauter dans la cale du France.\nFiche commune « Nocnok et ses sbires » : Disparition retenue pour les démons de Ouikka.\n${ATT_NOTE}`,
});

// ---------------- Le C.R.I. ----------------
const thomassin = quick('thomassin', 'demon', 'Vapula', 20, {
  nom: 'Lucas Thomassin', source: 'Démon de Vapula, PDG des Encres de Marine (C.R.I. et Culte de la Bétonneuse)',
  notes: 'Inventeur de l\'encre « de poulpe » qui rend accro (poulpes nourris au soda éventé, frites congelées et télé en continu) : ses propres employés voulaient travailler nuit et week-end. Effet surtout physique selon la durée de contact ; Volonté supra-normale et pouvoirs semblables n\'y font rien. Dévoué au C.R.I. sans ambition de grade ; aime torturer les petites bêtes au nom de la science. A conçu Questmaster avec Marrifique.\nPas de caractéristiques dans le livre : profil rapide de démon de Vapula (20 PP), estimation.',
});
const marrifique = npc('marrifique', {
  nom: 'Jehan Marrifique', source: 'Patron du Diable Ludique, chef de la section havraise du C.R.I., membre du Culte de la Bétonneuse',
  car: car('2 2 3 3 3 2'), def: L(2),
  armes: [arme('Revolver', 'Revolver petit calibre', 2), poing(2)],
  talents: 'Baratin 3, Discussion 3, Aisance sociale 3, Intimidation 2, Tir 2, Savoir occulte 2 (C.R.I. 4), Réplique acerbe 4',
  notes: 'Taille moyenne, mince, grand nez, petits yeux perçants, sourire ironique, lunettes et chaussures hors de prix. Connaît la vraie nature du C.R.I. et lui est entièrement dévoué ; vise une promotion nationale. A infiltré le Culte de la Bétonneuse sur ordre et y prend du galon. Pas contre la violence à l\'occasion.\nAu magasin, toujours entouré (alarme sous le comptoir, renforts) ; tournée quotidienne des commerçants du centre-ville ; grande maison entre Le Havre et Honfleur (alarme, chiens, deux vigiles), où il détient Laëtitia. Capturé, il est coriace : menaces et violence ne donnent rien, il faut ruser.\nLe C.R.I. lui a donné « quelques pouvoirs spéciaux » non détaillés ; caractéristiques et arme entièrement estimées (humain).',
});
const jeanLouis = npc('jean-louis', {
  nom: 'Jean-Louis Lucien', source: 'MJ fou, membre du C.R.I., assassin des trois lycéens', car: car('2 2 2 2 2 2'), def: L(1),
  armes: [arme('Épée de reconstitution', 'Épée longue', 2), arme('Arbalète', 'Arbalète', 2)],
  talents: 'Combat 2, Tir 2, Technique 2 (pièges 3), Art 2 (jeu de rôle 4), Se croire plus malin que tout le monde 5',
  notes: 'La trentaine qui en paraît plus, gros, mou, un peu crade, célibataire. Accro au jeu de rôle au point de confondre joueurs et personnages. Ses quatre joueurs voulaient le quitter : il a étranglé Alban, tué Stéphane à l\'épée et piégé la porte de Toufik (six flèches, faux appel du « père » de David). Cherche encore Benjamin et suit toutes les fausses pistes.\nSe croit indispensable au C.R.I., qui le considère comme un danger et veut le mettre à l\'ombre au sous-sol du Diable Ludique. Flatté, il parle volontiers (et dit beaucoup de bêtises) ; mis face aux meurtres, il se ferme puis craque et avoue en détail.\nCaractéristiques et armes estimées (humain moyen, armes blanches de reconstitution et matériel de piège chez lui).',
});
const vendeurs = fromBest('vendeurs', 'hommes-en-noir', {
  nom: 'Équipe du C.R.I. (vendeurs, gros bras)', source: 'Personnel du Diable Ludique et nervis du complot', qty: 4,
  notes: 'Vendeurs tout en noir, discrets et nombreux, tous membres du C.R.I. ; ils tombent sur le dos des PJ trop curieux. Le livre parle de « démons ou humains du C.R.I. » sans chiffres : profil des hommes en noir du bestiaire réutilisé (estimation).',
});
const brigade = quick('brigade', 'demon', 'Asmodée', 15, {
  nom: 'Brigade de démons de Garfield', qty: 3,
  notes: 'Gardes du corps à lunettes noires et oreillette qui écartent les fans à la convention ; plus tard, des gros bras plus redoutables qu\'Eunides surveillent l\'usine. Pas de caractéristiques dans le livre : profil rapide de démon d\'Asmodée (15 PP), nombre estimé.',
});
const vigiles = fromBest('vigiles', 'hommes-en-noir', {
  nom: 'Vigiles de Marrifique', source: 'Gardes de la propriété entre Le Havre et Honfleur', qty: 2,
  notes: 'Deux vigiles qui patrouillent avec des chiens de garde autour de la maison ; alarme un peu parano. Profil des hommes en noir du bestiaire réutilisé (estimation).',
});
const chiens = npc('chiens', {
  nom: 'Chiens de garde', source: 'Chiens de la propriété Marrifique', type: 'monstre', qty: 2, car: car('2 3 3 1 1 1'), def: L(2),
  armes: [arme('Morsure', 'Morsure', 3)], talents: 'Athlétisme 3, Corps à corps 3, Vigilance 3',
  notes: 'Pas de caractéristiques dans le livre : gros chiens estimés.',
});

// ---------------- Victimes, témoins, BÂILLON ----------------
const benjamin = npc('benjamin', {
  nom: 'Benjamin Gorde', source: 'Lycéen de terminale STT, seul survivant du groupe de Jean-Louis', car: car('2 2+ 3 2 2 2'),
  talents: 'Athlétisme 3 (courir 4), Discrétion 2, Voile 3, Être parano 4',
  notes: 'Roux aux yeux pâles, réservé, très intelligent. A échappé à une tentative de meurtre ; caché sur le Tranquille, le voilier du père de son colocataire Jeanjean, au port du Havre ; ne sort que pour se ravitailler et acheter le journal. Ne fait confiance à personne, court vite. Soupçonne Jean-Louis mais aussi le gardien de l\'usine, ou un règlement de comptes de dealers.\nPas de caractéristiques dans le livre : lycéen estimé.',
});
const laetitia = npc('laetitia', {
  nom: 'Laëtitia Desmarins', source: 'Membre du BÂILLON, prisonnière de Marrifique', car: car('2 2+ 3 3 2 2'),
  talents: 'Athlétisme 2, Enquête 3, Discrétion 2, Résister à l\'interrogatoire 4',
  notes: 'Blonde de 30-35 ans, froide, caustique, déterminée, endurante. « Profileuse » qui s\'est trop approchée de Marrifique : ligotée dans le pavillon près de la maison des domestiques, mal nourrie, interrogée durement ; elle se tait ou distille de fausses pistes. Marrifique attend des ordres : le C.R.I. enverra des démons « adaptés » pour la faire parler, puis la « suicidera ».\nPas de caractéristiques dans le livre : estimation.',
});
const baillon = npc('baillon', {
  nom: 'Cellule normande du BÂILLON', source: 'Organisation gouvernementale anti-C.R.I. (agents de terrain)', qty: 4, car: car('2 2+ 2+ 2 2 2'), def: L(2),
  armes: [arme('Pistolet', 'Revolver petit calibre', 3), poing(2)],
  talents: 'Athlétisme 2, Corps à corps 2, Discrétion 2, Enquête 2, Tir 3, Intimidation 2',
  notes: 'Hommes et femmes d\'action cagoulés et bien armés, encadrés d\'éminences grises (psychologues, journalistes, spécialistes des sectes, policiers, militaires, peut-être un ange). Membres importants :\n• Alexandre Pranoff, la cinquantaine, chef de la cellule, amoureux transi de Laëtitia : il en néglige ses autres missions.\n• Desmond Desmarins, 45 ans, sociologue des sectes, mari de Laëtitia, incapable de montrer ses sentiments (ce qui exaspère Pranoff).\n• Aliette Gizpari, 42 ans, petite, ronde, cheveux violets, bon vivant : recoupe les rumeurs et prépare les opérations d\'espionnage.\nPas de caractéristiques dans le livre : agents estimés.',
});

// ---------------- Fondation Dubois (fausse piste) ----------------
const minion = fromBest('minion', 'familier-humain', {
  nom: 'Dominique Minion', source: 'Familier orphelin de Nicolas Dubois', notes: 'La quarantaine, très grand, voûté, yeux exorbités, rire effrayant et stupide. Le plus zélé, très fort et très bête.',
});
const alicia = fromBest('alicia', 'familier-humain', {
  nom: 'Alicia Groult', source: 'Familier orphelin de Nicolas Dubois',
  notes: 'Rousse, 35 ans, dents du bonheur, plus futée que Dominique mais inconsolable et timbrée depuis la mort de Dubois, qu\'elle aimait. Agressive, pratique le karaté.',
});
alicia.armes = [arme('Karaté', 'Coup de pied', 3)];
const nadine = fromBest('nadine', 'familier-humain', {
  nom: 'Nadine Vinci', source: 'Familier orphelin de Nicolas Dubois (enfant de 12 ans)',
  notes: 'Orpheline « adoptée » par Dubois : très intelligente, la plus sensée et la plus subtile de la maison, un peu barrée elle aussi. Profil du familier humain non adapté à l\'enfant (estimation).',
});
const loulou = fromBest('loulou', 'familier-animal', {
  nom: 'Loulou', source: 'Familier berger allemand de Nicolas Dubois', notes: 'Adore aboyer, poursuivre et mordre pour tromper l\'ennui ; fou de hamburgers.',
});
const titine = fromBest('titine', 'familier-objet', {
  nom: 'Titine', source: 'Familier deux-chevaux cabossée de Nicolas Dubois', notes: 'Dubois s\'en servait comme bouclier ou pour écraser ses cibles.',
});
titine.armes = [arme('Écrasement', 'Twingo', 2)];

const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; delete t.typeId; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  scene('mission', '1. Un lycée bien typique', 'Le Havre – briefing des anges',
    `Mission : trois élèves du lycée Labuse ont été tués en quelques jours, la police patauge, la presse s'emballe contre l'Éducation nationale, et des démons semblent mêlés à l'affaire. Il faut résoudre ce triple meurtre vite, avant une quatrième victime.
Les faits :
• Alban Nicostel (terminale L, timide, poète) : étranglé dans un terrain vague en périphérie, près de l'usine d'encre ; longue lutte, agresseur peu costaud.
• Stéphane Chamois (première S redoublant, fan d'informatique et président du club de JdR) : tué de face d'un coup de lame large (une épée) dans le local à mobylettes, le soir, après son squash UNSS.
• Toufik Imdir (terminale S, interne, charismatique) : tué dans sa chambre d'internat par plusieurs flèches.
Vérité : les quatre lycéens (avec Benjamin Gorde, encore en vie et caché) formaient la table de Jean-Louis Lucien, MJ fou membre du C.R.I. ; ils voulaient changer de MJ et avaient passé une annonce au Diable Ludique. Jean-Louis les élimine un par un de sa propre initiative ; le C.R.I. le juge incontrôlable.`,
    []),
  scene('victimes', '2. Trouver indice caché', 'Domiciles des victimes et internat du lycée Labuse',
    `Chez Alban (appartement du centre avec parents et sœur) : posters, poèmes enflammés, deux classeurs de fiches de personnages, agenda plein de « JL&Co » le samedi après-midi. Les parents croient à un suicide d'amour. Sa sœur Cindy (14 ans) sait qu'il jouait à des « jeux de société » avec ses copains, connaît le prénom « Ben » et a entendu parler d'un « JL ».
Chez Stéphane (pavillon) : chambre rangée, livres de JdR étiquetés « Diable Ludique » (adresse dans l'annuaire), carte du club. Au mur, au stylo plume : « Dubois, la fondation sait tout, même dans l'obscurité des démons » (énigme du dernier scénario de Jean-Louis, fausse piste). Portable aux contacts en initiales. Parents aveuglés, persuadés d'une vengeance de jaloux.
Chez Toufik (internat) : même inscription, carte du club, rendez-vous réguliers à l'usine « EM » (Encres de Marine) jusqu'à il y a quinze jours, carnet d'adresses avec Benjamin (et son adresse), un Jean-Louis et un Jean-Luc avec portables. Son voisin David n'a pas grand-chose à dire, sinon qu'un faux appel de son « père » l'a éloigné ce jour-là.
Ce que la police a trouvé : un peu de shit chez Alban, de la drogue chez Toufik (cachée là par David, petit dealer, qui l'avoue si on insiste) ; l'inscription dans deux chambres ; et surtout la « machine » artisanale de Toufik, déclenchée par la porte (six flèches, quatre au but), sans empreintes, posée longuement. Les fuites sur ce piège ne vont pas tarder. C'est Jean-Louis qui a appelé le lycée en se faisant passer pour le père de David.`,
    []),
  scene('benjamin', '3. Retrouver Benjamin', 'Colocation de Benjamin, puis le voilier « le Tranquille » au port du Havre',
    `Benjamin se cache, terrifié et parano, sur le Tranquille, voilier du père de son colocataire Jeanjean. Chez lui : manuels de JdR et de cours, photos de mer, et une photo de lui avec Jeanjean et son père sur le bateau (nom lisible en regardant bien). Jeanjean sait tout et sert de fausses pistes (parents à Coutances, grand-mère à Honfleur, sœur à Paris) ; il ne parle qu'avec beaucoup de persuasion.
Jean-Louis cherche aussi Benjamin, suit les mêmes fausses pistes et peut croiser les PJ. Selon leur rythme, il le trouve ou non avant eux. Benjamin peut servir d'appât, mais il déjouera probablement la ruse.
Une fois rattrapé (il court vite) et convaincu : il confirme le groupe de jeu, le MJ Jean-Louis (il retrouvera son nom de famille, Lucien, avec de l'aide ; pas son adresse), les crises de colère, les scénarios incompréhensibles et le harcèlement, jusqu'à ce que Toufik lui dise ses quatre vérités. Il doute encore et soupçonne aussi le gardien de l'usine ou des dealers.`,
    [inScene(benjamin), inScene(jeanLouis)], false,
    [choice('ben', 'Qui trouve Benjamin en premier ?', [
      ['Les PJ', 'Témoignage complet sur Jean-Louis ; Benjamin est sauvé (à protéger jusqu\'à la fin).'],
      ['Jean-Louis', 'Benjamin est tué : échec partiel à la fin du scénario.'],
      ['Personne pour l\'instant', 'Jean-Louis continue de le chercher ; laisser planer la menace.'],
    ])]),
  scene('usine', '4. L\'usine de poulpes', 'Usine des Encres de Marine et son sous-bois, périphérie du Havre',
    `Grande usine hypermoderne entourée d'un terrain arboré plein de lapins ; encre de luxe tirée de poulpes élevés en batterie, qu'on effraie trois fois par jour (tête de requin, photo de crevette). Peu d'ombre, vidéosurveillance. Une petite porte mène à un hangar avec une chaîne d'impression à l'arrêt.
Eunides, gardien de nuit (démon de Shaytan), préfère traquer les rôlistes, GN et paintballeurs du sous-bois voisin (terrain de l'usine, non clôturé) : il surgit, malmène, rugit que c'est une propriété privée. Si les PJ fouinent, il se montre ; s'ils le démasquent, ça tourne à la baston.
Bureau du PDG Lucas Thomassin (démon de Vapula) : documents du Culte de la Bétonneuse, essais de maquette d'un jeu de cartes, flyers de la convention ; dans les entrepôts, des caisses de Questmaster prêtes à la vente. Éviter que les PJ détruisent tout trop tôt : vigiles, alarme incendie ou police peuvent contrarier un incendie prématuré.`,
    [inScene(eunides), inScene(thomassin)], true,
    [choice('usine', 'Les PJ détruisent-ils l\'usine ou les jeux dès maintenant ?', [
      ['Non', 'La production suit son cours jusqu\'à la convention.'],
      ['Ils essaient', 'Le MJ contrarie le plan (vigiles, alarme, police) ; s\'ils réussissent, le C.R.I. est alerté et renforce la sécurité.'],
    ])]),
  scene('club', '5. Le club de JdR du lycée Labuse', 'Lycée Labuse, salle de permanence (le midi)',
    `Le « Gobelin bicéphale », animé par Stéphane : environ deux cents membres sur 1 500 élèves, tournois, GN, conventions, fanzine ; réunion tous les midis. Les membres peuvent évoquer Jean-Louis, la disparition de Benjamin, le Diable Ludique où les victimes étaient clientes, le gardien de l'usine qui interrompt leurs GN, et la convention prochaine.
La convention est quasi secrète (flyers sauvages, bouche-à-oreille) : les PJ l'apprennent en se faisant passer pour des rôlistes (il faudra le prouver), par une maladresse d'un interlocuteur, ou en fouillant les documents du club.`,
    []),
  scene('diable', '6. Le Diable Ludique', 'Rue Baldaquin, centre-ville du Havre',
    `Façade sinistre à enseigne de cordonnier ; dedans, une boutique immense et baroque sur quatre niveaux (cartes et jeux de société, plateau et figurines, jeux de rôle, étage des joueurs avec bibliothèque), vendeurs en noir discrets et nombreux, tous du C.R.I. Au quatrième, réserves poussiéreuses fermées à clé ; le sous-sol est une autre histoire.
Derrière la caisse, la porte « toilettes » donne sur deux portes : les vraies toilettes (déco dragon) et une porte toujours fermée vers la salle de réunion du C.R.I. (comptes, bons de commande, documents sur le C.R.I. et le Culte, liste de notables havrais membres du Culte, documents sur la convention). Indices : le patron reste trop longtemps « aux toilettes » ; des voix à travers la cloison. Entrer pendant les heures d'ouverture demande une méthode astucieuse.
En fouillant bien : une gourmette « Laëtitia » et un portable éteint (répertoire du BÂILLON) dans un tiroir ; des flyers plus ou moins précis (le France, date au choix du MJ) ; une dizaine de paquets de Questmaster sous blister, « le jeu qui rend accro ».
Questmaster, dernier-né de Gary Garfield : l'encre de l'usine rend dépendant. Cible : les 8-12 ans, futurs rôlistes et recrues. Test à l'ouverture de la convention, en présence de Garfield.
Climat de paranoïa depuis « l'épisode Laëtitia » : questions indiscrètes = personnel sur le dos, sans griller la couverture du magasin. Jean-Louis y passe tous les jours, très fier de ses « exploits » ; si le C.R.I. a fait le lien, il sera attiré au sous-sol et « stocké ».`,
    [inScene(marrifique), inScene(vendeurs, { qty: 4 }), inScene(jeanLouis)], true,
    [choice('diable', 'Les PJ éveillent-ils les soupçons au Diable Ludique ?', [
      ['Non', 'Ils repartent avec leurs indices ; Marrifique ne se doute de rien.'],
      ['Oui', 'L\'équipe du C.R.I. leur tombe dessus ; Marrifique renforce la sécurité de la convention.'],
    ])]),
  scene('dubois', '7. Fausse piste : la fondation Dubois', 'Immeuble moche du Havre, musée de la fondation Dubois',
    `L'inscription des chambres a mis la ville en émoi (lycéens satanistes ?) et peut lancer les PJ sur cette piste. Par hasard, il existe bien une fondation Dubois : musée à la mémoire de Nicolas Dubois, démon mort il y a quelques années, entretenu par ses familiers oubliés (portraits, biographie, objets).
Habitants : Dominique Minion, Alicia Groult, Nadine Vinci, Loulou le berger allemand et Titine la deux-chevaux (voir les fiches). Ils ne savent rien des meurtres, mais sont ravis d'avoir des visiteurs : visite guidée, quête pour l'entretien, discours sans fin sur leur bienfaiteur. S'en débarrasser est difficile. À jouer haut en couleur, louche et déjanté.`,
    [inScene(minion), inScene(alicia), inScene(nadine), inScene(loulou), inScene(titine)], false),
  scene('baillon', '8. Le BÂILLON', 'Le Havre – contact discret ou enlèvement',
    `Des PJ trop visibles dans le milieu du JdR sont repérés par le C.R.I. (une équipe leur tombe dessus) ou par le BÂILLON, cellule normande d'une organisation gouvernementale anti-C.R.I. en lien avec Paris. Pour lui, les PJ sont des alliés possibles ou une autre organisation nuisible.
Selon l'ambiance : simple prise de contact pour les sonder, ou enlèvement « à la corse » par des cagoulés armés, dans le style d'une organisation secrète un peu bricolée. Ils interrogent les PJ sur le C.R.I., le Culte de la Bétonneuse (louche à leurs yeux) et surtout Laëtitia, qui mobilise tous leurs efforts.
Ce qu'ils savent : le C.R.I. réunit de méchants rôlistes, certains dotés de pouvoirs conférés selon le rang et révocables, avec des sanctions cruelles ; ex-membres rares et fous ; il infiltre politique, justice, police, enseignement ; la plupart des rôlistes le croisent sans le savoir ; un ponte doit venir très bientôt au Havre pour un grand événement (lequel et quand, ils l'ignorent).`,
    [inScene(baillon, { qty: 4 })], true,
    [choice('baillon', 'Comment se passe la rencontre avec le BÂILLON ?', [
      ['Contact amical', 'Échange d\'informations ; le BÂILLON peut aider à libérer Laëtitia et à perturber la convention.'],
      ['Enlèvement et interrogatoire', 'Tension, voire baston ; une fois la méfiance levée, mêmes informations.'],
    ])]),
  scene('marrifique', '9. Choper Jehan Marrifique', 'Diable Ludique, centre-ville ou propriété entre Le Havre et Honfleur',
    `Trois occasions : au magasin (jamais seul, alarme sous le comptoir et renforts : ça devient vite physique), pendant sa tournée quotidienne des commerçants « bétonneurs » (enlèvement possible), ou chez lui. Son adresse s'obtient par des informateurs.
La propriété : alarme, chiens de garde, deux vigiles qui patrouillent. La maison regorge de documents : la vérité sur le C.R.I. en recoupant, sur Gary Garfield, sur des membres célèbres du monde entier (le révéler serait une grave erreur), sur la convention et le jeu, et des accréditations ou invitations pour le France. S'il s'en aperçoit, Marrifique renforce la sécurité de la convention.
Laëtitia est enfermée dans un petit pavillon près de la maison des domestiques, menottée dans une pièce sombre. Elle tient bon, sachant qu'on la tuera dès qu'elle aura parlé, et lâche au besoin de fausses infos. Marrifique attend des ordres : le C.R.I. va envoyer des démons « adaptés » pour la faire craquer, puis la faire passer pour suicidée (le Culte couvrira auprès de la police et de la presse).
Capturé, Marrifique est coriace : ni menaces ni violence, il faut ruser ; le MJ dose ce qu'il lâche.`,
    [inScene(marrifique), inScene(vigiles, { qty: 2 }), inScene(chiens, { qty: 2 }), inScene(laetitia)], true,
    [choice('laetitia', 'Laëtitia est-elle libérée à temps ?', [
      ['Oui', 'Le BÂILLON devient un allié solide ; succès à la fin du scénario.'],
      ['Non', 'Elle est « suicidée » (ou parle d\'abord, et le BÂILLON en pâtit) : la cellule normande est déstabilisée.'],
    ]),
    choice('marrifique', 'Les PJ capturent-ils Marrifique ?', [
      ['Oui', 'Interrogatoire difficile ; il peut livrer la convention, Thomassin et Garfield.'],
      ['Non', 'Il reste libre et participe à la convention.'],
    ])]),
  scene('jean-louis', '10. Retrouver Jean-Louis (pour de vrai)', 'Appartement de Jean-Louis, centre-ville près du Diable Ludique',
    `Recherché par les PJ, le C.R.I. et peut-être la police, Jean-Louis ne se cache pas : il se croit trop malin et rentre chez lui manger et se doucher. On le croise aussi au Diable Ludique (trois fois par jour, au grand agacement du personnel) ou dans le quartier. Le capturer est facile ; le flatter est encore plus efficace (il est très seul et colle ensuite à ses nouveaux « amis »).
Il sait peu de chose du C.R.I. (une « assoc' géniale ») et débite ses théories fumeuses. Sur les meurtres, il se ferme et ne pense qu'à fuir ; habilement poussé, il avoue en détail puis perd définitivement pied.
Chez lui : plans de la machine qui a tué Toufik, le scénario contenant l'énigme (il faut chercher longtemps), des armes (surtout blanches, de reconstitution), et la pub de la convention aimantée sur le frigo.
Si les PJ le ratent : il se cache, ou le C.R.I. l'enlève sous leurs yeux ; suivre les ravisseurs mène au BÂILLON, au magasin, à l'usine ou chez Marrifique (bon moyen de relancer des joueurs perdus).`,
    [inScene(jeanLouis), inScene(vendeurs, { qty: 3 })], false,
    [choice('jl', 'Que devient Jean-Louis ?', [
      ['Arrêté par les PJ', 'Aveux complets : l\'enquête sur les meurtres est résolue.'],
      ['Enlevé par le C.R.I.', 'Les PJ peuvent filer les ravisseurs vers un lieu clé.'],
      ['En fuite', 'Il court toujours ; la police finira sans doute par l\'attraper à force de vantardise.'],
    ])]),
  scene('betonneuse', '11. Trouver le Culte de la Bétonneuse', 'Cryptes sous le macadam du Havre, par les égouts',
    `Tous les chemins y mènent : documents de l'usine ou du magasin, filatures de Marrifique ou Thomassin. Les notables du Culte (bourgeoisie, élus, commerçants, avocats) se retrouvent dans trois cryptes décorées avec soin (torches, tapis, portraits de notables des XVIIIe-XIXe siècles, coins lecture et cigares), atteintes par les égouts et les canalisations municipales. Réunions le mardi soir (150 à 200 personnes) et le vendredi soir (moins de monde, week-ends obligent).
Activité réelle : papotages, médisance, canapés et bons vins. Officiellement gardiens du Havre et de sa splendeur ; en pratique, « opérations commando » nocturnes contre la verdure (parc saccagé, arboretum changé en supermarché, tags « vive le béton, à bas les arbres », demande d'inscription du Havre bétonné à l'UNESCO). Ils méprisent quiconque se moque de leur ville ; leur légende de protecteurs occultes leur donne une réputation utile. Le C.R.I. les noyaute. Igor Matchenko, qui a racheté le France, en est.
Ce sont surtout des innocents ridicules : les « casser » sans discernement serait une bavure.`,
    [], false),
  scene('convention', '12. La convention sur le France', 'Le paquebot France, amarré au port du Havre',
    `Le C.R.I. organise une convention discrète (bouche-à-oreille, prospectus) mais marquante pour ses membres, sur le France, paquebot fétiche des Havrais racheté par Igor Matchenko pour en faire un hôtel et des salles de réception.
Programme : petit déjeuner des invités ; ouverture vers 10 h à tous (recrutement) ; jeux anodins, costumés, tournois, duels à l'épée, saynètes, goodies jusqu'à 16 h. Foule, animations et diversions : facile d'être discret, difficile de suivre quelqu'un ; les rôlistes du C.R.I. sont nombreux et solidaires.
À 16 h, le public non identifié repart avec un sac de goodies ; restent les inscrits du Diable Ludique : membres du C.R.I. et gamins cobayes. Gary Garfield arrive alors en star avec yes-men et brigade de démons, réclame un soda et lance le tournoi de Questmaster. Les cobayes accrochent dès la première partie (encore réversible si l'on agit vite) ; au bout de deux ou trois heures, la dépendance est acquise et Garfield jubile. Les perdants refusent d'arrêter (discorde ou parties parallèles, au choix). À la fermeture, on vide la salle en distribuant d'autres blisters.
Puis Garfield part en voiture de luxe et en jet vers Paris avec Thomassin et Marrifique pour parler production à grande échelle ; l'usine sera ensuite gardée par des démons bien plus durs qu'Eunides. Si les PJ n'ont rien fait d'ici là, la mission est un échec quasi irrattrapable.`,
    [inScene(garfield), inScene(brigade, { qty: 3 }), inScene(thomassin), inScene(marrifique), inScene(vendeurs, { qty: 6 })], true,
    [choice('garfield', 'Gary Garfield est-il mis hors d\'état de nuire ?', [
      ['Oui', 'Objectif ultime atteint : le C.R.I. va se fissurer en tendances rivales puis éclater.'],
      ['Non, il repart', 'Les plans sont seulement reportés ; il garde le procédé de l\'encre.'],
    ]),
    choice('jeu', 'Questmaster est-il lancé ?', [
      ['Non, ou presque plus de jeux utilisables', 'Convention sabotée ou usine détruite : au moins ça de réglé.'],
      ['Oui', 'Les gamins deviennent accros et futurs apôtres du C.R.I.'],
    ])]),
  scene('sabordage', '13. Nocnok et le sabordage du France', 'Le France : ponts, salons et cale',
    `Indépendamment du C.R.I., Nocnok Houzzère (démon de Vephar) veut couler le France le jour de la convention. Avec des copains de promo et le NaN (Normandie aux Normands, séparatistes royalistes noyautés par des démons de Ouikka), il monte une opération commando : ils ont intercepté les vrais animateurs et entrent déguisés en personnages de dessins animés, armés ; deux démons de Ouikka ont chacun une bombe à faire sauter dans la cale ; grand discours prévu.
Usage conseillé : faire tourner les PJ en bourrique en lâchant les saboteurs au milieu de leur plan contre le jeu ; ou tout régler en coulisses.
Option « Titanic » : grand guignol, larmes et angoisse. Bande incompétente : le bateau coule à quai, on évacue et repêche presque tout le monde. Bande très efficace : ils font appareiller le navire avant de le couler, bien plus meurtrier.
Si personne ne les arrête, le naufrage peut aussi écourter l'opération du C.R.I. tout en noyant beaucoup de monde.`,
    [inScene(nocnok), inScene(promo, { qty: 2 }), inScene(ouikka, { qty: 2 })], true,
    [choice('france', 'Le France est-il sauvé ?', [
      ['Oui, saboteurs arrêtés', 'Succès des PJ.'],
      ['Il coule à quai', 'Évacuation, peu de victimes, mais succès démoniaque.'],
      ['Il coule en mer', 'Catastrophe meurtrière : lourd échec.'],
    ])]),
  scene('fin', '14. La fin', 'Bilan devant la hiérarchie',
    `Le livre ne donne pas de barème chiffré : à apprécier par le MJ.
Échecs (foudres de la hiérarchie) :
• convention intacte, jeu lancé, Garfield, Thomassin et Marrifique repartent en jet : les PJ sont passés à côté de tout ;
• les méchants s'en sortent en partie (Garfield repart avec le procédé de l'encre ; Thomassin et Marrifique n'étaient que des pions) ;
• Jean-Louis court toujours (moins grave ; la police finira par l'attraper) ;
• Benjamin a été tué ;
• le France a coulé ;
• Laëtitia n'est pas retrouvée, ou morte : coup dur pour le BÂILLON en Normandie et au-delà ;
• le Culte de la Bétonneuse a été cassé : des innocents ridicules, donc une bavure.
Succès (gloire) :
• Garfield hors d'état de nuire : le C.R.I. se disloquera ;
• jeu non lancé ou presque plus d'exemplaires ;
• Benjamin et Laëtitia sauvés, Jean-Louis arrêté, saboteurs déjoués, Marrifique et Thomassin neutralisés ;
• tout dépend aussi de la présentation : des notables « bétonneurs » mêlés aux créateurs du jeu empoisonné passent facilement pour démoniaques…`,
    [], false,
    [choice('bilan', 'Bilan global de la mission ?', [
      ['Triomphe', 'Garfield neutralisé, jeu stoppé, innocents sauvés : les PJ sont couverts de gloire.'],
      ['Mitigé', 'Une partie des objectifs atteints : la hiérarchie fait la moue.'],
      ['Échec', 'Jeu lancé, Garfield en fuite ou France coulé : les foudres de la hiérarchie.'],
    ])]),
];

const scenario = {
  id: 'ag4-bayonne',
  nom: 'Angelots en gelée – Bayonne n\'est pas en Crimée',
  resume: 'Scénario parodique de Magna Veritas au Havre. Les anges des PJ enquêtent sur le meurtre de trois lycéens rôlistes. Ils passent par une usine d\'encre « de poulpe » gardée par un démon, une boutique de JdR repaire du C.R.I. (Complot Rôliste International), une fondation de familiers orphelins, le Culte de la Bétonneuse et le BÂILLON, une cellule anti-C.R.I. Le coupable est leur MJ fou. Derrière lui, Gary Garfield, démon d\'Asmodée, veut lancer sur le paquebot France un jeu de cartes imprimé avec une encre qui rend accro, le jour même où une bande de démons veut couler le navire.',
  notes: `Source : ${REF}. Ton parodique : dans le monde d'INS/MV, tous les clichés sur les rôlistes sont vrais.

Fils de l'intrigue :
• Les meurtres : Jean-Louis Lucien, MJ fou membre du C.R.I., élimine les joueurs qui voulaient le quitter (Alban, Stéphane, Toufik ; Benjamin reste). Le C.R.I. veut le mettre à l'ombre.
• Le C.R.I. : secte de MJ et de rôlistes manipulée par des démons ; pouvoirs magiques accordés selon le rang et révocables ; but : contrôler le monde en coulisses. Section havraise : Jehan Marrifique (Diable Ludique) ; Lucas Thomassin (démon de Vapula, Encres de Marine) a mis au point l'encre addictive de Questmaster.
• Le Culte de la Bétonneuse : notables havrais ridicules et pro-béton, noyautés par le C.R.I.
• Le BÂILLON : cellule normande anti-C.R.I., dont l'agente Laëtitia Desmarins est prisonnière de Marrifique.
• La fondation Dubois : fausse piste (familiers d'un démon mort).
• Nocnok Houzzère (Vephar) et le NaN : couler le France pendant la convention.
Objectif ultime : neutraliser Gary Garfield (le C.R.I. se disloquera) et empêcher le lancement de Questmaster.
Ordre souple : les scènes 2 à 11 sont des pistes à prendre dans n'importe quel ordre ; la convention (12-13) est le climax, à placer quand ça arrange le MJ.

Récompenses : pas de barème chiffré dans le livre ; voir les succès et échecs de la scène 14.

Fiches : trois fiches complètes dans le livre (Eunides, Gary Garfield, Nocnok et ses sbires), caractéristiques converties en niveaux et attaques au format du livre (attaque = X×2, puissance Y). Toutes les autres fiches sont estimées et le disent dans leurs notes : profil rapide pour Thomassin et la brigade de Garfield, hommes en noir du bestiaire pour les nervis et les vigiles, familiers du livre de base pour la fondation Dubois, humains estimés pour les autres.`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [eunides, garfield, nocnok, promo, ouikka, thomassin, marrifique, jeanLouis, vendeurs, brigade, vigiles, chiens,
  benjamin, laetitia, baillon, minion, alicia, nadine, loulou, titine].map(asType);
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));
const ids = [scenario.id, ...scenes.flatMap((s) => [s.id, ...s.npcs.map((x) => x.id), ...s.choix.map((c) => c.id)]), ...bestiaire.map((t) => t.id)];
const dup = ids.filter((x, i) => ids.indexOf(x) !== i); if (dup.length) console.warn('Ids en double :', dup.join(', '));
writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types,', scenes.reduce((a, s) => a + s.choix.length, 0), 'choix');
