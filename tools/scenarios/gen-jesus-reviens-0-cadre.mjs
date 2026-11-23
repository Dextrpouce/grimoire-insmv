// Génère le fichier d'import « insmv-scenario » pour le cadre de la campagne « Jésus Reviens ! »
// (chapitre un « Mesquins sans frontières ! », p. 2-12 imprimées ; résumé du chapitre dix « Les renégats, j'en suis gaga », p. 120-124)
// usage : node gen-jesus-reviens-0-cadre.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Jésus Reviens !, chapitre un « Mesquins sans frontières ! », p. 2-12 (la p. 13 manque au scan)';
const REF10 = 'Jésus Reviens !, chapitre dix « Les renégats, j\'en suis gaga » (O. Fanton), p. 120-124';
const L = (s) => R.parseLvl(String(s));
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
const ARMES = new Map(R.ARMES.flatMap(([g, l]) => l.map((x) => [x[0], { prec: x[1], puis: x[2], melee: R.MELEE_GROUPS.includes(g) }])));
const arme = (n, table, lvl) => { const w = ARMES.get(table); if (!w) throw new Error('arme inconnue : ' + table); return { n, att: L(lvl), ...w }; };
const poing = (lvl) => arme('Coup de poing', 'Coup de poing', lvl);
const P = 'jr0-'; let n = 0; const id = (k) => P + k;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [poing(1)], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});
const MINI = 'Pas de caractéristiques dans le cadre de campagne : fiche minimale (valeurs par défaut), à ne pas utiliser telle quelle en combat.';
const ARCH = 'Archange : pas de fiche dans le livre, il n\'apparaît pas en jeu sur le terrain.';

// ---------------- PNJ récurrents (aucun n'a de caractéristiques dans ces pages) ----------------
// Commanditaires
const ange = npc('ange', {
  nom: 'Ange', source: 'Archange des Convertis, commanditaire secrète', type: 'ange',
  notes: `Alertée par Alain, elle décide avec lui d'agir en secret contre l'opération JR. Ni elle ni Alain n'emploient leurs propres anges : ils font nommer un chargé de mission (Régine) qui leur doit un service, et choisissent une équipe neuve et peu connue, sans ange de Laurent, Dominique, Ange ou Alain. Les PJ ne doivent pas savoir qui tire les ficelles.\nAvec Alain et Yves, elle monte le dossier qui servira au Conseil divin exceptionnel (conseil de discipline).\n${ARCH}`,
});
const alain = npc('alain', {
  nom: 'Alain', source: 'Archange des Cultures, commanditaire secret', type: 'ange',
  notes: `Ami de longue date de Michel (tous deux anciens de la troisième force) et l'un des « pédés du slip » que méprisent les extrémistes. Michel lui a tout raconté sans dévoiler ses sources ; effrayé par ce que donnerait le monde si le complot réussissait (et piqué par l'insulte), il entraîne Ange.\nBut : moins empêcher les coups d'éclat du complot que réunir un dossier en béton contre Laurent, Georges et Dominique.\n${ARCH}`,
});
const yves = npc('yves', {
  nom: 'Yves', source: 'Archange des Sources, allié des commanditaires', type: 'ange',
  notes: `Ange et Alain montent le dossier avec lui pour lancer le conseil de discipline. Il remplace Georges dans ses fonctions depuis sa chute : Georges ne reviendra que sur décision du Conseil, et seulement si Yves l'accepte.\n${ARCH}`,
});
const regine = npc('regine', {
  nom: 'Régine', source: 'Ange, chargée de mission des PJ', type: 'ange',
  notes: `Nommée par Ange et Alain parce qu'elle leur doit un service. Sous couvert de missions ordinaires, elle aiguille les PJ sur les affaires liées à l'opération JR et rapporte tout ce qu'ils lui transmettent. Elle convoque les PJ le jour J pour l'affaire « SOS Bébés » (Paris).\nPendant la campagne, elle joue le rôle de juge d'instruction : elle presse les PJ de rassembler preuves et témoins prêts à témoigner. Seules les preuves transmises à Régine comptent dans l'IA officiel.\nLe livre ne précise ni son supérieur ni son grade.\n${MINI}`,
});
const michel = npc('michel', {
  nom: 'Michel', source: 'Archange de la Guerre, informateur caché', type: 'ange',
  notes: `L'un des quatre « durs » qui discutent depuis des siècles de rétablir un ordre chrétien musclé, mais un brave type borné, violent et honnête. Il a surpris il y a sept mois Laurent et Dominique se vantant de JR. Il aime la violence et l'ordre, mais aussi la diversité, et refuse un nouveau Ragnarök qui massacrerait ses frères vikings : il a tout confié à Alain sans révéler ses sources.\nIl se sent coupable d'avoir rompu un pacte tacite avec Laurent, Dominique et Georges, cherche du réconfort auprès d'Ange et Alain et veille à ne pas éveiller leurs soupçons. Il veut l'échec de JR et le retour à l'ordre, sans que Laurent prenne le pouvoir ni que Georges revienne, mais ne le dira jamais officiellement.\nIl ne se doute pas que les autres l'ont trahi ; s'il l'apprend, il sera furieux mais ne fera rien, sauf si on menace les vikings de la Terre Creuse.\n${ARCH}`,
});
// Conspirateurs
const laurent = npc('laurent', {
  nom: 'Laurent', source: 'Archange de l\'Épée, conspirateur (index L)', type: 'ange',
  notes: `Encourage en sous-main Semper Fidelis. Pour lui, JR teste l'influence des durs au Paradis ; il rêve, sans trop y croire, d'une révolution de palais et d'une dictature « forte et éclairée » au Paradis, prélude à son extension sur Terre.\nIl ne soupçonne pas la duplicité de Dominique, espère que Georges suivra, méprise Michel (un parvenu) tout en comptant sur lui, et le croit plus bête qu'il n'est.\nLa campagne réunit contre lui l'index L.\n${ARCH}`,
});
const dominique = npc('dominique', {
  nom: 'Dominique', source: 'Archange de la Justice, conspirateur (index D)', type: 'ange',
  notes: `Attend son heure : ses hommes se mouillent moins que ceux de Laurent mais récolteront les fruits d'un succès. Il doute de l'entreprise, garde un dossier sur Laurent (et Semper Fidelis) et efface toute trace de son implication. Si tout tourne mal, il fera tomber Laurent, dont l'indépendance l'agace, et remettra Georges à sa place ; en cas de succès, Georges redevient archange de la guerre aux côtés de Michel et Laurent. Georges est son joker.\nSes moyens d'espionnage (avec ceux d'Emmanuel) informent les conspirateurs de la gravité du dossier des PJ.\nLa campagne réunit contre lui l'index D.\n${ARCH}`,
});
const georges = npc('georges', {
  nom: 'Georges', source: 'Ex-archange de la Purification (chu en 527), conspirateur discret (index G)', type: 'renegat_a',
  notes: `Mis sur la touche depuis environ 1 500 ans, il travaille au service des réclamations du Paradis, ce qui le rend très au fait des intrigues. Confident de Laurent, Dominique et Michel, il les influence sans en avoir l'air et attise leurs envies d'Inquisition et de croisade. Mouillé de loin dans l'affaire de la Terre Creuse (officiellement purgée par Daniel, en réalité toujours peuplée d'anges, de renégats et de démons nostalgiques du Reich).\nBeaucoup moins bête qu'il n'en a l'air : il attend son heure, ne veut paraître ni comploter ni militer pour son retour, trop respectueux du Conseil divin pour agir lui-même. Il ne soutiendra ni Laurent ni Dominique, qu'il méprise et compte duper. Ses anges ont fondé l'ordre de Saint-Georges en Russie (Strachnov).\nLa campagne réunit contre lui l'index G. Pour ses règles de supérieur renégat, voir le chapitre dix (déjà dans le Grimoire).\n${ARCH}`,
});
const semper = npc('semper', {
  nom: 'Semper Fidelis (Gary Medlocke)', source: 'Ange de Laurent, grade 3, « père » de l\'opération JR', type: 'ange',
  notes: `Incarné en 1535 en Angleterre, aux Amériques depuis 1732. Règne sur le sud des États-Unis et le Mexique (la « Confédération »). Ancien biker « 1 % » reconverti, fasciste américain convaincu (protestant par commodité). Homme d'affaires installé à Jacksonville (Floride), il dirige Dixie Securities LLC, façade d'un camp d'entraînement de fascistes et de soldats de Dieu (marais d'Okefenokee), et veut réunir les Klans (le Klonklave).\nDans JR : entraînement et motivation des groupes du monde entier, et un attentat téléguidé (opération Big Queen à New York).\nEnnemi juré : Sharah. Fiche complète dans le scénario de Jacksonville (« The Last Rebel »).\n${MINI}`,
});
const francesco = npc('francesco', {
  nom: 'Francesco', source: 'Ange de Dominique, grade 3, vrai cerveau de JR', type: 'ange',
  notes: `« La maman » de l'opération : plus subtil et politique que Semper Fidelis, chef de fait de l'Opus Dei en Espagne. Il n'a que des intérêts. Son but : noyauter les gouvernements pour rétablir des théocraties (modèle : l'Iran). Prudent, il se méfie de Semper Fidelis et de Laurent, laisse peu de traces et accumule les preuves contre son associé pour le trahir si l'affaire éclate (sur conseil discret de Dominique). Opération Torquemada en Espagne.\nAmi de Semper Fidelis depuis 1921. Fiche complète dans le scénario de Madrid (« Le sabre et le goupillon »).\n${MINI}`,
});
const sharah = npc('sharah', {
  nom: 'Sharah', source: 'Ange de Laurent, responsable du nord des États-Unis (« l\'Union »)', type: 'ange',
  notes: `Aux Amériques depuis 1697, QG à Boston. Rival de Semper Fidelis depuis 1732 ; Laurent les a séparés en 1865 (Union au nord, Confédération au sud). Averti il y a six semaines d'un gros coup de Semper à New York, il en a parlé à Laurent puis à Dominique, qui n'ont pas réagi : il se doute de quelque chose.\nAllié potentiel précieux s'il est convaincu (scénario de New York). Fiche complète dans ce scénario.\n${MINI}`,
});
const strachnov = npc('strachnov', {
  nom: 'Strachnov', source: 'Ange de Georges, chef de l\'ordre de Saint-Georges en Russie', type: 'ange',
  notes: `Incarné en 468. Allié de Semper Fidelis (depuis 2000) et de Francesco : il veut faire réveiller Lénine pour une insurrection, puis se faire couronner tsar par l'Église orthodoxe (opération Tempête Blanche). Fiche complète dans le scénario de Moscou.\n${MINI}`,
});
const moroni = npc('moroni', {
  nom: 'Moroni', source: 'Ange de Laurent, à l\'origine du mormonisme', type: 'ange',
  notes: `Incarné en 1779 en France, a déserté l'armée napoléonienne, puis a fondé avec Mormon l'Église mormone (1820). Assigné à résidence au Paradis depuis 1894 après un procès bâclé. Si la TRIC atteint 15, Semper Fidelis le fait libérer pour qu'il reprenne son Église. Fiche complète dans le scénario de Salt Lake City.\n${MINI}`,
});
const emmanuel = npc('emmanuel', {
  nom: 'Emmanuel (bientôt Zanag)', source: 'Ancien archange de Mathias, passé en Enfer (démon de Malphas, grade 3)', type: 'demon',
  notes: `Il y a un an, poussé par Andromalius, il a changé de camp avec ses fidèles ; depuis trois mois il est démon de grade 3 de Malphas en attendant de devenir Zanag, prince-démon de l'Hypocrisie. Son ancien grade 3 Pallard l'a suivi. Il ne rate pas une occasion de semer la zizanie chez les anges et renseigne les conspirateurs sur le dossier des PJ.\nLe livre ne prévoit pas de décompte des preuves contre lui (hors du sujet de la campagne).\n${MINI}`,
});

const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });

// ---------------- Scènes ----------------
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  scene('secret', '1. Histoire secrète : l\'opération JR', 'Paradis (coulisses) – à lire par le MJ seul',
    `Les quatre « durs » : Laurent, Dominique, Georges (mis sur la touche) et Michel se fréquentent depuis des siècles. Dégoûtés des Lumières, du marxisme, du laïcisme, de la démocratie libérale et de la mondialisation, ils regrettent l'Inquisition et les croisades et imaginent, « par pur exercice intellectuel », des moyens de contourner les règles du Grand Jeu et la mollesse du Conseil. Laurent et Dominique en laissent filtrer des bribes à certains de leurs grades 3… qui les prennent au mot.

L'opération « Jésus Revient » (JR) :
• Deux grades 3 se lancent : Semper Fidelis (Laurent, sud des USA) et Francesco (Dominique, Opus Dei espagnol). Constatant l'implication des anges et démons musulmans, ils décident de passer outre les règles du jeu.
• But : faire croire que l'Occident se réveille naturellement (pas un complot), pour rendre le pouvoir aux forces du Bien « comme avant ». Ils recrutent des nostalgiques des ordres nouveaux, militaires et réactionnaires, qui se prennent pour les prêcheurs d'une nouvelle croisade, et lancent dans divers pays des groupes d'anges, de soldats et de serviteurs de Dieu dans une série de coups de main.
• Ce n'est pas un complot centralisé : beaucoup d'actions dispersées qui vont dans le même sens. Les conséquences visibles se mesurent avec la TRIC.

Ce que veut chacun :
• Semper Fidelis : un Occident blanc et chrétien ; entraîne les groupes et prépare un attentat téléguidé à New York.
• Francesco : des théocraties ; prêt à trahir Semper Fidelis si l'affaire éclate.
• Laurent : tester l'influence des durs, rêve d'une révolution de palais au Paradis ; ne voit pas venir Dominique.
• Dominique : couvert, garde un dossier sur Laurent et compte remettre Georges à sa place en cas d'échec.
• Georges : attend son heure, influence sans se mouiller, méprise les deux autres.
• Michel : a tout appris il y a sept mois, en veut l'échec et a prévenu Alain sans dire d'où il tenait l'information.

La riposte : Alain et Ange, aidés d'Yves, veulent un dossier en béton contre Laurent, Georges et Dominique pour un Conseil divin exceptionnel tournant au conseil de discipline. Ils n'utilisent pas leurs anges (Michel pourrait parler) mais une équipe neuve manipulée de loin, via Régine. Les PJ ne savent rien des deux archanges.

La campagne se place juste après Fire and Ice dans la chronologie officielle. Elle vise des anges de grade 1 (éventuellement 2), plutôt subtils et dotés de bonnes compétences d'infiltration, de baratin, de discussion et de pouvoirs utiles (polymorphie, invisibilité…), plus quelques gros bras en renfort. Les talents en langues sont très utiles ; à défaut, Régine peut leur fournir des talismans de traduction.`,
    [inScene(laurent), inScene(dominique), inScene(georges), inScene(michel), inScene(semper), inScene(francesco)]),

  scene('chrono', '2. Chronologie de l\'opération', 'Paradis, États-Unis, Russie, Espagne – de 468 au jour J',
    `Historique :
• 468 : Strachnov (Georges) s'incarne.
• 527 : chute de Georges ; nomination de Laurent.
• 872 : Laurent, Dominique, Georges et Michel commencent à papoter.
• 1127 : des anges de Georges refusant de passer chez Laurent fondent l'ordre de Saint-Georges en Russie.
• 1535 : Semper Fidelis (Laurent) s'incarne en Angleterre. 1697 : Sharah (Laurent) arrive au Nouveau Monde. 1732 : Semper Fidelis l'y rejoint, leur rivalité commence.
• 1776 : Semper Fidelis s'installe dans le Sud (Sharah garde Boston) : schisme officiel. 1779 : Moroni (Laurent) s'incarne en France ; 1807, il déserte la division Davout.
• 1815-1820 : après Waterloo, Moroni se rapproche de Mormon (ange d'Yves intégriste) ; ils écrivent le Livre de Mormon puis font de Joseph Smith leur prophète.
• 1844-1852 : Joseph Smith lynché ; Brigham Young emmène les mormons fonder le Deseret ; polygamie annoncée.
• 1860-1865 : Sharah et Semper Fidelis règlent leurs comptes pendant la guerre de Sécession ; Laurent les sépare (Union / Confédération).
• 1888-1894 : querelle sur le Deseret, que Moroni exploite ; le Deseret devient l'Utah, Mormon est envoyé au purgatoire par Yves, Moroni assigné à résidence au Paradis.
• 1921 : Semper Fidelis et Francesco deviennent amis. 1928 : Francesco fonde l'Opus Dei (couverture : José Maria Escriva). 1947 : Semper Fidelis fonde Dixie Holding.
• 1969 : l'Opus Dei devient prélature personnelle. 1976 : Viatix (démon de Scox) s'infiltre chez les mormons. 1994 : Monty (démon de Kobal) s'infiltre chez des soldats de Dieu japonais.
• Il y a trois ans : Daniel purge la Terre Creuse ; les quatre durs parlent d'étendre la Purge. Laurent en parle à Semper Fidelis, qui fait venir Francesco à Jacksonville : naissance de JR. Dominique encourage Francesco en se couvrant ; Francesco lance l'opération Torquemada en Espagne.
• 2000 : Strachnov rencontre Semper Fidelis et prépare une révolution en Russie avec des communistes.

Les derniers mois :
• J-2 ans : Midoni (ange de Mathias) infiltre une bande de démons.
• J-1 an : Emmanuel craque et, sur proposition d'Andromalius, prépare son passage en Enfer avec ses fidèles.
• J-9 mois : les soldats de Dieu de la Confédération s'entraînent chez les scouts d'Europe.
• J-7 mois : Michel surprend Laurent et Dominique se vanter de JR.
• J-6 mois : Chico (soldat de Dieu) part à New York monter l'opération Big Queen avec les Pink Queens.
• J-5 mois : Semper Fidelis convoque le Klonklave pour unir les Klans ; Pallard s'infiltre dans une bande de démons pour le compte d'Emmanuel.
• J-4 mois : Hornet remplace Bifrons ; à Moscou, le démon Katioucha contacte le sorcier géorgien Iossef Djoukov.
• J-3 mois : Mathias redevient archange ; Emmanuel, rétrogradé, passe en Enfer (grade 3 de Malphas, futur Zanag) ; Pallard le suit, guerre civile chez les anges de Mathias.
• J-2 mois : des soldats de Dieu japonais vont s'entraîner chez Semper Fidelis.
• J-6 semaines : Sharah, averti d'un gros coup à New York, alerte Laurent puis Dominique, sans réaction.
• J-5 semaines : Monty apprend tout et prépare l'opération « Mickey über alles ».
• J-1 mois : les Pink Queens s'entraînent aux explosifs chez les scouts d'Europe. Michel finit par tout dire à Alain ; Ange et Alain font nommer Régine.
• J-3 semaines : Lux Imperator demande des démons pour mettre en scène un miracle ; Emmanuel lui envoie Pallard. J-2 semaines : ils règlent l'attaque de la manifestation.
• Veille : Lux Imperator est abattu par des démons lors d'une manifestation anti-avortement puis « ressuscite » ; les démons sont abattus par les soldats de Dieu.

Après le jour J (Paris, si les PJ n'interviennent pas) :
• J+1 : des démons enlèvent et tuent une aide-soignante de la clinique et cachent le corps chez SOS Bébés.
• J+2 : ils planquent devant Saint-Nicolas-du-Chardonnet.
• J+3 : Pallard, Strachnov et Francesco se réunissent près de Paris (siège de la Confrérie Saint Pie XII) et règlent l'opération Tempête Blanche en Russie.
• J+4 : les démons qui filaient Immaculus sont déchiquetés par la légion Azul.
• J+5 : Pallard demande à Katioucha un sorcier capable de ranimer un cadavre ; Iossef accepte et, surveillé par Edom (ange de Mathias), lui raconte tout.
• J+6 : début du congrès de Saumur du PPB (deux jours) sur le projet de loi anti-avortement.
Ensuite, c'est la TRIC qui fait avancer le monde.`),

  scene('briefing', '3. Briefing initial : Régine et l\'affaire SOS Bébés', 'Paris – jour J',
    `Les PJ, une équipe neuve et peu connue (aucun ange de Laurent, Dominique, Ange ou Alain en principe), sont convoqués par Régine, leur chargée de mission. Officiellement, une mission comme une autre : la vidéo de la fusillade de Montreuil et la « guérison miraculeuse » de Lux Imperator font le tour des médias, et Régine les envoie sur l'affaire SOS Bébés. La suite se joue dans le scénario de Paris.

Ce que les PJ savent : rien du complot ni des archanges derrière Régine. Ils le découvriront au fil des missions. Régine leur demande de tout lui rapporter.

En même temps, l'Enfer envoie une équipe de démons chercher celle qui a disparu dans la fusillade ; elle surveille la clinique Saint-Jean-de-Béthune et compte un ange de Mathias infiltré, qui cherche l'ange de Mathias tombé dans l'embuscade.

Variantes (encadrés « Régis ») :
• Joueurs opposés à l'idée de déjouer un complot d'extrême droite : la campagne n'est pas faite pour eux (changer de joueurs, ou leur faire jouer les méchants avec un fort travail du MJ).
• Joueurs qui ne font rien : la campagne avance quand même, la TRIC se charge de dérouler les événements ; Régine les houspille.
• PJ de Laurent ou de Dominique : jouable avec des joueurs expérimentés et du travail. Ils obéissent à leur chargée de mission et rien ne les oblige à tout dire à leur supérieur, mais l'un d'eux peut trahir l'équipe et vendre la mèche à son archange (option « taupe »).
• PJ d'Ange ou d'Alain : peu crédible ; soit un débutant sans lien avec son archange, soit un ange mis dans le secret qui veille discrètement sur le groupe (« taupe positive », idéale pour un joueur expérimenté si l'équipe rechigne à courir le monde).`,
    [inScene(regine)], false,
    [choice('camp', 'Composition de l\'équipe ?', [
      ['Équipe neutre (cas prévu)', 'Aucun PJ de Laurent, Dominique, Ange ou Alain : la campagne se joue telle quelle.'],
      ['Un PJ de Laurent ou Dominique', 'Il peut se taire… ou devenir la taupe des conspirateurs : prévoir des fuites vers son archange et des représailles accrues.'],
      ['Un PJ d\'Ange ou d\'Alain mis dans le secret', 'Taupe positive : il oriente discrètement le groupe vers les missions JR. À confier à un joueur expérimenté.'],
    ])]),

  scene('enquete', '4. Organisation de l\'enquête', 'Paris, Jacksonville, New York, Salt Lake City, Moscou, Tokyo, Madrid',
    `Structure : ce n'est pas une suite linéaire mais une arborescence de missions. Chaque ville a sa présentation, ses lieux, sa chronologie jour par jour de ce que font les méchants si les PJ n'agissent pas, et ses PNJ. Les villes peuvent se jouer dans n'importe quel ordre, voire en parallèle (les événements courent pendant que les PJ sont ailleurs).
Ordre indicatif : Paris (point de départ, jour J) → Jacksonville, New York, Salt Lake City, Moscou, Tokyo selon la TRIC et les pistes → Madrid vers la fin → épilogue (procès devant le Conseil divin).

Double objectif de chaque mission :
• déjouer localement les effets politiques de JR (faire baisser la TRIC) ;
• rassembler preuves et témoins pour l'Index d'Accusation (IA).

Transmissions et représailles :
• Tout ce que les PJ transmettent à Régine rejoint le dossier d'Ange, Alain et Yves (IA officiel).
• Les espions de Dominique et d'Emmanuel informent les conspirateurs du danger que représente le dossier (pas forcément de son contenu exact) : ils chercheront à stopper les PJ, d'autant plus fort que l'IA officiel monte.
• Les PJ ont intérêt à garder certaines preuves par-devers eux pour éviter les retours de bâton, et pourront toujours les sortir au procès. Mais leurs PA dépendent de l'IA : à doser.
• Pour enquêter tranquille, il faut enquêter caché.

Le MJ tient la TRIC à jour au fil des événements et des actions des PJ, et l'IA au fil des preuves obtenues (voir les deux scènes suivantes).`,
    [inScene(regine), inScene(sharah), inScene(strachnov), inScene(moroni), inScene(emmanuel)], false,
    [choice('transmission', 'Comment les PJ gèrent-ils leurs preuves ?', [
      ['Ils transmettent tout à Régine', 'IA officiel élevé et PA en conséquence, mais les conspirateurs réagissent vite et fort contre l\'équipe.'],
      ['Ils en gardent une partie', 'Moins de représailles ; les preuves gardées ne comptent pas dans l\'IA officiel mais resservent au procès.'],
      ['Ils gardent presque tout', 'Discrétion maximale, peu de PA en cours de campagne ; tout se jouera au procès.'],
    ])]),

  scene('tric', '5. Suivi : la TRIC', 'Le monde entier – tout au long de la campagne',
    `TRIC = Tension de Réaction Intégriste Catholique. Elle commence à 0 et mesure la réussite de JR : plus elle est haute, plus le complot avance. Les PJ doivent la faire baisser (même sans savoir qu'elle existe). Ce n'est pas le score de la campagne (c'est l'IA), mais une TRIC haute leur nuit.

Effets en jeu :
• Plus elle monte, plus les fascistes sont arrogants et violents, et leurs opposants tendus et agressifs ; les méchants se sentent moins tenus par le Grand Jeu.
• Les événements de seuil s'ajoutent à la chronologie ; certains n'arrivent que si les PJ n'ont rien fait, et certains ajoutent eux-mêmes de la TRIC (escalade).
• Le MJ garde la jouabilité : il peut annoncer un événement par des indices et laisser aux PJ le temps de finir leur mission. Une marge d'environ 10 % est acceptable, pas plus.

Modificateurs — Paris :
• Fusillade et guérison miraculeuse de Lux Imperator +5
• Par mois où l'abbé Goth agit impunément depuis Saint-Nicolas-du-Chardonnet +1
• Explication scientifique crédible de la résurrection de Lux Imperator −2
• Par jour de battage médiatique de Lux Imperator et de Bussy-Rabutin +1 (maximum +10)
• Congrès de Saumur sans problème +5
• Prouver aux médias que la fusillade est un coup monté −5
• Empêcher la crypte de Saint-Nicolas-du-Chardonnet de travailler pour JR −2
• Réunion Strachnov / Francesco / Immaculus réussie +2
• Neutraliser le camp des scouts d'Europe −2
Jacksonville :
• Fusion des Klans +30, +1 par Klan qui les rejoint
• Par société de Dixie Holding neutralisée −1 · Dixie Securities neutralisée −5
• Semper Fidelis neutralisé −5
• Par Klan neutralisé ou refusant la fusion −1 · par ange de Semper Fidelis neutralisé −1
• Par semaine où Semper Fidelis dirige le KKK fusionné +3
• Par semaine où il dirige impunément Dixie Securities +1
• Le KKK soutient la sécession de l'Utah +10
New York :
• Prise d'otages +5 · la statue explose +10
• Chico avoue publiquement avoir agi pour le KKK −10
• Sharah accepte de lutter contre JR aux USA −5 · par semaine de lutte active de Sharah −1
Salt Lake City :
• Vade retro satanas dans la cathédrale catholique de SLC +1
• Moroni neutralisé −1
• Thomas S. Monson devient prophète et dénonce l'Église mormone −5
• Viatix devient prophète et pervertit l'Église −3
• Ve'cem lo ach'shav photographié ivre, métamorphosé en David Haight −5
• Richard G. Scott devient prophète +1 · un autre humain que Monson ou Scott devient prophète −1
• Par scandale révélé sur un apôtre −2
• Moroni devient prophète +10 · par semaine où il l'est +3 · il déclenche la sécession de l'Utah +10
Moscou :
• Insurrection sur la place Rouge et réveil de Lénine +10 · pas d'insurrection, Lénine repose en paix −2
• Lénine donne le pouvoir à l'Église orthodoxe +10 · l'Église couronne Strachnov tsar +10
• Par semaine de guerre civile +1 · par semaine où Strachnov est tsar +3
• Ordre de Saint-Georges neutralisé −5
• Les démocrates récupèrent le pouvoir −10 · les communistes le récupèrent −10, puis +2 par semaine où ils le gardent
Tokyo :
• Début de la prise d'otages +10 · par jour de prise d'otages +2
• Résolue dans le sang par les anges de Semper Fidelis +5 · par tranche de 10 morts +1
• Les PJ démontrent aux médias que c'est une supercherie −5
Madrid :
• Par semaine où Francesco dirige impunément l'Opus Dei +2
• Par coopérateur travaillant activement pour Francesco, par 15 jours +1 · par coopérateur neutralisé −2
• Francesco neutralisé −10
• Les PJ démontrent clairement la nocivité de l'Opus Dei −5 · l'Opus Dei est neutralisé −5
• Neutraliser la division Azul −2

Seuils et événements :
• 10 : Klonklave d'une semaine à Jacksonville ; Big Queen prévue cinq jours après. Le 6e jour (un samedi) à 10 h, si les PJ ne font rien, la statue de la Liberté explose (+10) et les Klans fusionnent (+30, +1 par Klan).
• 15 : Laurent souffle à Semper Fidelis que Moroni est mal gardé ; Semper le fait libérer, Moroni s'incarne dans un apôtre et fait changer la règle de succession du prophète.
• 20 : le PPB dépose le projet de loi anti-avortement en France ; loi sur l'immigration durcie ; subventions accrues à la fondation pour la mémoire de Franco en Espagne.
• 25 : Moroni tue le prophète (maquillé en accident) et prend sa place après une semaine agitée (+10) ; agressions racistes aux USA ; journées d'action pour la foi en Espagne.
• 30 : vote de la loi anti-avortement en France ; le Klan absorbe d'autres Klans, groupes nazis et Identité chrétienne et devient une force politique.
• 40 : l'Espagne renforce ses lois antiterroristes et rogne les droits des suspects ; agressions antimusulmanes minimisées par les médias ; l'avocat Miguel Izco fait des agresseurs des victimes « identitaires ».
• 45 : Strachnov fait réveiller Lénine lors d'une manifestation du PCR sur la place Rouge (+10) ; insurrection dans la CEI, prise du pouvoir en deux semaines ; Lénine « voit la Lumière » et donne le pouvoir à l'Église orthodoxe (+10) ; le patriarche couronne Strachnov tsar (+10).
• 50 : le Klan devient une machine de lobbying ; Monty prend en otage Disneyland Tokyo et proclame une république américanophile (+10) ; Semper Fidelis et Francesco envoient des anges régler ça dans le sang (+5).
• 55 : en Espagne, catéchisme obligatoire, éducation civique supprimée, avortement non médical interdit, émission « Héros espagnols ».
• 60 : si Moroni est prophète, l'Utah fait sécession (+10) ; si les Klans ont fusionné, le Klan soutient la rébellion (+10) ; d'autres États menacent de suivre.
• 65 : la Russie tsariste décide de raser la Tchétchénie ; le Klan soutient ouvertement la ségrégation.
• 70 : réforme du Code civil espagnol (statut de la femme dégradé, divorce limité, pater familias) ; en France, expulsion des enfants d'immigrés « non intégrés ».
• 80 : le Sud des USA menace de sécession ; programmes scolaires purgés de Darwin et Freud ; le Klan propose une partition raciale des USA.
• 85 : conseillers moraux catholiques dans les tribunaux espagnols ; en France, lois « laïques » contre les signes religieux non catholiques et avantage aux écoles catholiques ; aux USA, avortement interdit et quotas annulés.
• 100 : le roi d'Espagne dissout l'Assemblée et nomme un Conducator ; en France, le Front Français allié au PPB impose une Révolution nationale ; les USA tombent aux mains de la droite chrétienne (ségrégation de fait).

Exemple du livre : PJ enlisés à Paris, TRIC à 15 ; le Klonklave commence, les PJ partent en Espagne au lieu de la Floride ; les Klans fusionnent, la TRIC s'envole, la loi anti-avortement est votée et l'opération de Tokyo se déclenche.`),

  scene('ia', '6. Suivi : l\'Index d\'Accusation', 'Dossier de Régine, Ange, Alain et Yves – tout au long de la campagne',
    `Principe : chaque preuve obtenue a une valeur ; la somme mesure le succès des PJ (et leurs PA, que ces pages ne chiffrent pas). Les conspirateurs réagissent à l'IA officiel.

Règles :
• Fourchettes : selon la manière dont la preuve est obtenue (surtout les témoignages, partiels ou complets), le MJ choisit la valeur dans la fourchette. Il est seul juge.
• Lettres : une valeur suivie de L, G ou D compte contre Laurent, Georges ou Dominique (index séparés, expliqués dans l'épilogue). Une valeur sans lettre ne compte que dans le total.
• IA officiel (global) : somme de tout ce qui a été transmis à Régine, avec ou sans lettre (le dossier officiel).
• IA secret : somme des valeurs spécifiques (L/G/D) et génériques, transmises ou non.
• Seules les preuves transmises comptent dans l'IA officiel ; les autres peuvent être produites au procès.
• Aucun décompte contre Emmanuel (preuves rares, hors sujet de la campagne).

Preuves — Paris :
• Témoignage de Lux Imperator sur JR : 0 à 1D
• Étude rigoureuse de la vidéo de la fusillade : 2
• Témoignage de Christine Bussy-Rabutin sur JR : 1 à 2D
• Fichiers de SOS Bébés (contrôlée par Familles chrétiennes) : 0
• Témoignage d'Immaculus sur JR : 0 à 4 (moitié D, moitié L)
• Témoignage de Guernica sur JR : 0 à 1L
• Témoignage d'Helem et/ou de Luxor sur les ordres de pression sur les PJ : IA officiel du moment ÷ 10
• Témoignage d'Ogath sur ces ordres : IA officiel du moment ÷ 5, en D
• Dossier sur le congrès de Saumur : 2D
• Dossiers complets de Saint-Nicolas-du-Chardonnet : 4L + 4D
• Témoignages des scouts sur l'entraînement des Pink Queens : 2L
• Liens entre scouts d'Europe et Dixie Securities : 1L
• Dossiers de la Kommandantur : 1L
• Enregistrement ou minutes de la réunion Strachnov / Immaculus / Francesco : 2D + 2L + 1G
• Dossiers de l'Opus Dei français : 2D + 1L
• Témoignage de Pallard sur la fusillade : 1 à 2 · sur Katioucha : 1 à 2D
Jacksonville :
• Dossiers de la Confédération : 7L
• Dossiers de Semper Fidelis : 9L + 1D · son témoignage : 6L + 1D
• Témoignages des soldats ou serviteurs de Dieu : 1L (un seul compte)
• Témoignage d'Elio : 0 à 2L · de WWW : 0 à 1L · d'Onidah : 0 à 2L
• Témoignage de Lehi : −3 à +2L (selon le tri que les PJ font dans les intox qu'il croit)
• Témoignage de James Hackard : 0 · des Klans : 0 (par Klan)
• Dossiers du marais d'Okefenokee : 5L
• Témoignage de Stonewall Jackson : 0 à 2L · d'un Dixieman du marais (si Stonewall n'a pas parlé) : 1L
• Preuve de la « chasse au Nègre » : 1L
• Zacharias sur la Terre Creuse : 0 à 2G · sur JR : 0 à 1
• Sardis sur la Terre Creuse : 1G · sur JR : 0
New York :
• Dossiers de Sharah sur Semper Fidelis : 1L
• Témoignage de Sharah sur ses rapports à Laurent : 3L · à Dominique : 3D
• Témoignage de Chico : 2 à 5L · des Pink Queens : 0 à 1L
• Dossier de Chico sur l'Union : 3L
• Preuves chez Chico de son appartenance à la Confédération : 2L · sur Big Queen : 1L
Salt Lake City :
• Témoignage de Moroni : 2 à 6L · de Mormon : 2L
• Témoignage de Thomas S. Monson : 1 · ses dossiers : 2
• Témoignage des apôtres : 0 · de Viatix : 1
• Témoignage des marshals de la Confédération : 2L
Moscou :
• Dossiers de l'appartement de Nouvelle Russie : 2G + 1L
• Témoignage de Dimitri Polzoski : 0 à 2G
• Preuves que les skins de Mémoire sont allés chez Dixie Securities : 1L
• Témoignage des soldats de Dieu de Mémoire : 1L (sauf si Dimitri a parlé)
• Témoignage d'Iossef : 0 à 3G · des Komsomols : 0 à 1G
• Dossiers du Palais du peuple : 1 à 4G
• Témoignage de communistes du complot : 0 à 1G
• Témoignage de Katioucha : 0 à 5G · de Strachnov : 2 à 5G
Tokyo (liste peut-être incomplète, voir ci-dessous) :
• Témoignages de soldats de Dieu sur leur séjour chez Dixie Securities : 0 à 1L
• Témoignage de Rob Parker : 0 à 1L (non cumulable avec le précédent)
• Témoignage de Monty sur JR : 0 à 2L
• Témoignage de l'ange envoyé par Semper Fidelis : 0 à 2L · par Francesco : 0 à 2D
• Témoignage d'un des anges envoyés par Katioucha : 0 à 2G (en tout)
• Preuves des motifs de la venue des anges de Semper Fidelis : 1L · de Francesco : 1D · de Katioucha : 1G
• Témoignages des yakuzas : 0
Madrid : liste absente.

PAGE MANQUANTE : la page imprimée 13 n'est pas dans le scan. Elle contenait la fin des listes (au moins la liste de Madrid, peut-être la fin de celle de Tokyo). À reconstituer à partir du scénario de Madrid (dossiers de Francesco, de l'Opus Dei, de la légion Azul…) ou à arbitrer par le MJ, en s'inspirant des valeurs ci-dessus (dossiers d'un grade 3 : 9 + 1, témoignage : 6 + 1).

Verdict (épilogue « Heaven Can Wait », p. 115-119, non repris ici) : tables par archange selon son index — Dominique 0-5 / 6-10 / 11-30 / 31+, Georges 0-4 / 5-10 / 11-30 / 31+, Laurent 0-10 / 11-30 / 31+ — avec pondération par le MJ selon la qualité des preuves et de la plaidoirie.`),

  scene('renegats', '7. Règles optionnelles : renégats et taupes', 'Pour les PJ qui changent de camp ou servent deux maîtres',
    `Résumé du chapitre dix (${REF10}), utile si un PJ trahit, passe à l'ennemi ou joue la taupe.

Principes : officiellement les renégats n'existent pas. Un ange ou un démon peut déserter par amour, haine, dépit ou frustration, ou être déclaré renégat par manœuvre politique. Un déserteur est jugé par une commission de grades 3 ; chez les anges, par Dominique ou ses services (on ne peut pas se déclarer renégat soi-même). Juger les déviants reste hors de portée des PJ.

Statuts (aura · compte de PA · supérieur · destination après la mort · seuil de BL) :
• Renégat ordinaire : inchangée · supprimé · radié · inchangée (avec comité d'accueil) · inchangé. Progression uniquement par entraînement, au coût de « simili-PA » quadruplé ; perd les pouvoirs de son ancien supérieur et la récupération conditionnelle de PP.
• Apostat (a perdu la Foi) : grise · supprimé · radié · Purgatoire · Fo + 1,5. Chance à la moitié de son ancien niveau de Foi ; ne réagit plus à la Détection du Bien/du Mal ni à l'eau bénite ; ne peut plus manifester son aura.
• Très initié (rebelle d'avant le Christ) : vieux, très puissants ou très tarés, sans supérieur.
• Oublié (rayé des registres par erreur ou par faveur) : inchangée · inaccessible · inchangé (invocation déconseillée) · inchangée · inchangé.
• Effacé (dossier délibérément « perdu » par le supérieur pour une mission très libre) : inchangée · inaccessible, avec ouverture d'un compte officieux · inchangé · inchangée · inchangé.
• Toléré (renégats officiels ou officieux, comme les serviteurs de Catherine) : inchangée · variable · variable · inchangée · inchangé.
• Converti (passé dans l'autre camp, accepté) : change · un compte dans le nouveau camp · changé · changée · changé. Pouvoirs interdits non améliorables ; aura changée et détectable.
• Muté (changement de supérieur dans le même camp) : perd le supérieur, en gagne un autre, garde grade et pouvoirs.

Option « taupe » :
• Taupe interne (espionne d'un autre service de son propre camp) : aura inchangée · deux comptes de PA (officiel et officieux) · deux supérieurs · cumul des pouvoirs · destination et BL inchangés.
• Taupe infiltrée en profondeur (passée en apparence dans l'autre camp) : aura changée · deux comptes de PA (officiel dans le nouveau camp, officieux dans l'ancien) · deux supérieurs · cumul des pouvoirs · destination inchangée · BL changé.
• Les deux supérieurs la rémunèrent chichement selon la valeur des informations ; elle récupère ses PP selon les deux supérieurs, sans cumuler les taux (on garde le meilleur). À sa mort, son âme retourne à son camp d'origine.
• Autre façon d'infiltrer : Apparence angélique ou démoniaque (infiltration « superficielle », sans PA ni pouvoirs du camp adverse).

Supérieurs renégats décrits par le chapitre : Catherine (ex-archange des Femmes), Georges (ex-archange de la Purification) et Zanag (prince-démon de l'Hypocrisie, ex-Emmanuel). Leurs fiches sont déjà dans le Grimoire.`),
];

const scenario = {
  id: 'jesus-reviens-0-cadre',
  nom: 'Jésus Reviens ! – Cadre de la campagne',
  resume: `Campagne pour anges de grade 1 (voire 2). Deux grades 3, Semper Fidelis (Laurent, sud des USA) et Francesco (Dominique, Opus Dei), lancent l'« opération Jésus Revient » (JR) : une série de coups montés dans le monde pour faire croire à un réveil spontané de l'Occident chrétien et réactionnaire, avec la bénédiction plus ou moins discrète de Laurent, Dominique et Georges. Prévenus en secret par Michel, Ange et Alain (avec Yves) envoient une équipe neuve, les PJ, via leur chargée de mission Régine, pour déjouer le complot ville après ville et monter un dossier contre les archanges en vue d'un conseil de discipline. Deux jauges servent de fil rouge : la TRIC (avancée du complot) et l'Index d'Accusation (preuves L / G / D).`,
  notes: `Source : ${REF} ; chapitre dix : ${REF10}.
Ce fichier est le « scénario 0 » de la campagne : contexte, histoire secrète, PNJ récurrents et règles de suivi. Il n'y a pas d'affrontement prévu dans ces pages. Les scénarios de la campagne : Paris (« Paris est un héros solitaire… »), Jacksonville (« The Last Rebel »), New York (« Can't Stop the Music »), Salt Lake City (« No Voices in the Sky »), Moscou (« Lénine, relève-toi… »), Tokyo (« Twenty-two Tunes from Tokyo »), Madrid (« Le sabre et le goupillon »), puis l'épilogue (« Heaven Can Wait », le procès).

Commanditaires : Ange et Alain (avec Yves), informés par Michel. Les PJ ne connaissent que Régine. Georges n'est pas un commanditaire : c'est l'un des trois archanges visés (index G).

Règles de campagne (détail dans les scènes 5 et 6) :
• TRIC : jauge qui part de 0 ; modificateurs par ville ; événements mondiaux aux seuils 10, 15, 20, 25, 30, 40, 45, 50, 55, 60, 65, 70, 80, 85 et 100. Plus elle est haute, plus le complot a réussi.
• Index d'Accusation : chaque preuve vaut un nombre de points (souvent une fourchette, au choix du MJ selon la qualité), éventuellement attribués à Laurent (L), Georges (G) ou Dominique (D). IA officiel = somme des preuves transmises à Régine ; les conspirateurs réagissent à l'IA officiel. Les PA des PJ dépendent de l'IA (pas de barème dans ces pages).
• Page manquante : la page imprimée 13 manque au scan ; la liste de preuves de Madrid (et peut-être la fin de celle de Tokyo) est perdue.
• Option « taupe » et statuts de renégat : scène 7 (résumé du chapitre dix).

Fiches : aucun PNJ n'a de caractéristiques dans ces pages. Tous les PNJ de ce fichier sont des fiches minimales (valeurs par défaut) pour la mémoire et le suivi. Les fiches complètes de Semper Fidelis, Francesco, Sharah, Strachnov et Moroni sont dans les scénarios de leur ville. Georges est typé « ange renégat ».`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [ange, alain, yves, regine, michel, laurent, dominique, georges, semper, francesco, sharah, strachnov, moroni, emmanuel].map(asType);

// Fils en suspens qui traversent la campagne (mémoire, sans scénario ni rappel)
const at = Date.now();
const mem = (key, kind, txt, suite) => ({ id: id('mem-' + key), at, scen: null, scene: null, kind, txt, pjs: [], suite, rappel: null, done: false, res: '' });
const memoire = [
  mem('michel', 'secret', 'Michel est la source d\'Alain : c\'est lui qui a éventé l\'opération JR.',
    'À protéger : s\'il est découvert, Laurent, Dominique et Georges le prendront pour un traître. Il veut l\'échec de JR mais ne témoignera jamais officiellement.'),
  mem('commanditaires', 'secret', 'Ange et Alain (avec Yves) sont les vrais commanditaires des PJ, derrière Régine.',
    'Les PJ peuvent le découvrir peu à peu ; à révéler au plus tard au procès devant le Conseil divin.'),
  mem('dominique', 'secret', 'Dominique garde un dossier sur Laurent et Semper Fidelis, et compte remettre Georges à la place de Laurent si JR échoue.',
    'Au procès, il chargera Laurent pour se couvrir. Francesco, sur ses conseils, accumule lui aussi des preuves contre Semper Fidelis.'),
  mem('francesco', 'secret', 'Francesco est prêt à trahir Semper Fidelis si l\'affaire éclate.',
    'Levier possible pour les PJ : opposer les deux grades 3 (Madrid, Jacksonville).'),
  mem('georges', 'secret', 'Georges joue double jeu : il souffle les idées extrémistes sans jamais se mouiller et méprise Laurent comme Dominique.',
    'Les preuves contre lui (index G) sont rares : surtout Moscou (Strachnov, ordre de Saint-Georges) et la Terre Creuse.'),
  mem('represailles', 'ennemi', 'Les conspirateurs surveillent le dossier des PJ (espions de Dominique, Emmanuel).',
    'Plus l\'IA officiel monte, plus ils cherchent à stopper l\'équipe (pressions, sabotages, ordres transmis à leurs anges).'),
  mem('emmanuel', 'ennemi', 'Emmanuel (futur Zanag), passé en Enfer avec Pallard, sème la zizanie chez les anges.',
    'Il renseigne les conspirateurs et Pallard sert d\'intermédiaire entre les démons et JR (Paris, Moscou).'),
  mem('sharah', 'secret', 'Sharah, rival de Semper Fidelis, se doute que Laurent et Dominique couvrent un gros coup.',
    'Allié potentiel à New York : s\'il rejoint les PJ, la TRIC baisse (−5, puis −1 par semaine de lutte).'),
  mem('moroni', 'secret', 'Moroni, assigné à résidence au Paradis, peut être libéré par Semper Fidelis (TRIC 15).',
    'S\'il devient prophète mormon, il pousse l\'Utah à la sécession (Salt Lake City).'),
  mem('moscou', 'secret', 'Edom (ange de Mathias) surveille le sorcier Iossef, recruté par Katioucha pour ranimer un cadavre.',
    'Piste vers Moscou et le réveil de Lénine (opération Tempête Blanche de Strachnov).'),
];

const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));
writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types,', scenes.reduce((a, s) => a + s.choix.length, 0), 'choix,', memoire.length, 'fils');
