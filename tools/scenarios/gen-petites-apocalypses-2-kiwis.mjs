// Génère le fichier d'import « insmv-scenario » pour « Les kiwis se cachent pour mûrir » (Les Petites Apocalypses, p. 52-61)
// usage : node gen-petites-apocalypses-2-kiwis.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Les Petites Apocalypses, « Les kiwis se cachent pour mûrir », p. 52-61';
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
// attaque au format des livres « seuil/RU+X/M+Y »
const livre = (n, x, y, melee = true) => ({ n, att: x * 2, prec: 0, puis: y, melee });
const P = 'pa2-'; let n = 0; const id = (k) => P + k;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [poing(1)], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});
const CARS = 'Caractéristiques vérifiées sur la page du livre.';

// ---------------- PNJ chiffrés ----------------
const minotaure = npc('minotaure', {
  nom: 'Val Modeno, le Minotaure', source: 'Incube à cornes classé monstre, patron du Labyrinthe (victime)', type: 'monstre',
  car: car('5 3 2+ 3 3+ 4'), def: L(5), pp: 15, pfFix: 8, seuilsFix: seuils('6/13/19/26'),
  armes: [arme('Grandes cornes', 'Coup de poing', 5), poing(5)],
  pouvoirs: pows('Boomerang 2, Membre exotique : grandes cornes, Volonté supra-normale 2'),
  talents: 'Aisance sociale 4, Athlétisme 5, Baratin 3, Corps à corps 5, Défense 5, Métier : tenancier de boîte 4',
  notes: `Fils d'un démon de Caym (Strikti, qui aimait prendre forme de taureau) et d'une servante crétoise ; se croit petit-fils de Poséidon. Tué par Thésée, son âme a rejoint l'Olympe et il s'est réincarné plusieurs fois. Aujourd'hui dans le corps de Valentin Fistelin (incarné depuis 38 ans), rebaptisé Val Modeno : jet-setteur, propriétaire de plusieurs boîtes, trafiquant (drogue, jeu, prostitution) et maître chanteur. Méprise les toxicomanes. Pas d'ordinateur.
Il est mort au début du scénario : la fiche sert aux flash-backs ou si le MJ veut jouer la scène vraie.
${CARS}
Grandes cornes : arme réglée par le pouvoir Membre exotique.`,
});
const osman = npc('osman', {
  nom: 'Pierre Osman', source: 'Psionique kinic, autre victime du chantage', type: 'psi',
  car: car('2 2+ 2 3 4+ 2'), def: L(2), pp: 17, pfFix: 5, seuilsFix: seuils('3/6/9/12'),
  armes: [poing('1+')],
  pouvoirs: pows('Adhérence 2, Agitation moléculaire 3, Télépathie 4, Volonté supra-normale 4'),
  talents: 'Baratin 2+, Corps à corps 1+, Défense 2, Discussion 4, Séduction 3+, Pouvoirs cinétiques 3, Pouvoirs psychiques 4',
  notes: `Présent au Labyrinthe ce soir-là. Mobile solide (photos compromettantes dans la boîte du bureau), mais alibi en béton : au moment du crime il était avec une des filles polymorphes, et la scène a été filmée (il y a pris goût et ça l'excite d'être filmé).
${CARS}`,
});
const hercule = npc('hercule', {
  nom: 'Hercule', source: 'Héraclès, héros païen, patron de la DTC', type: 'paien',
  car: car('7 5 5 5 5 6'), def: L(7), pp: 55, pfFix: 12, seuilsFix: seuils('9/19/27/36'),
  armes: [livre('Massue magique ancienne', 10, 16), poing(7)],
  pouvoirs: pows('Aura de courage 5, Champ de force 5, Contrôle des animaux 4, Immunité contre les maladies et les poisons, Membre blindé 5, Némésis 5, Régénération 5, Supériorité martiale 7, Vitesse 4, Vol 4'),
  talents: 'Art 2+ (danser le sirtaki 5), Athlétisme 9, Combat 6 (armes contondantes 8), Corps à corps 7, Défense 7, Discrétion 4, Discussion 6, Informatique 4, Métier : businessman 6, Savoir occulte 3 (marches intermédiaires 7), Technique 5, Voyage intermarches 6 (pouvoir propre, absent des règles de l\'appli)',
  notes: `Invité à la fête, ami (récent) du Minotaure : il avait pris ses distances il y a une vingtaine d'années quand Val avait laissé entendre qu'il savait des choses sur ses affaires, puis l'a laissé revenir. Prend l'enquête à cœur et y embarque les PJ. Peut s'étonner que des salons où il a tenu des réunions secrètes soient truffés de caméras.
Fiche du ch. 4 (p. 21). Massue : livre « 66/RU+10/M+16 » (précision +4, puissance +9 dans la table).
${CARS}`,
});
const jesus = npc('jesus', {
  nom: 'Jésus', source: 'Archange des hommes, tenancier de Chez Régis (facultatif)', type: 'ange',
  car: car('5 5 6 7 8 9+'), def: L(6), pp: 102, pfFix: 12, seuilsFix: seuils('9/18/27/36'),
  armes: [poing(6)],
  pouvoirs: pows('Abondance 6, Absorption du mal 6, Aura de pacification 8, Bénédiction 6, Charme 6, Exorcisme 6, Illusions 9, Jeûne, Langage universel, Lecture d\'aura 9, Lire les pensées 9, Lumière céleste 6, Non-détection 9, Polymorphie 4, Télékinésie 6, Télépathie 6, Téléportation 6'),
  talents: 'Aisance sociale 6, Art 4 (menuiserie 6), Baratin 11, Corps à corps 6, Défense 6, Discussion 9, Kama sutra 5, Métier : barman 5, Savoir occulte 6 (Chez Régis 9), Séduction 8, Survie 8, Miracle 2 (pouvoir propre, 1 PP, absent des règles de l\'appli)',
  notes: `À glisser si les PJ ne le connaissent pas encore (interlude « Jésus Chez Régis ») : il les aborde avant la découverte du corps, les trouve cools (sauf agressivité) et les invite dans son bar. Ne résout pas l'enquête à leur place.
Bénédiction : « guérison de folies » 6 et « guérison de maladies » 6 dans le livre. Plus tous les pouvoirs gratuits des supérieurs.
Fiche du ch. 5 (p. 30). ${CARS}`,
});

// ---------------- PNJ sans caractéristiques (fiches minimales) ----------------
const jessica = npc('jessica', {
  nom: 'Jessica', source: 'Prostituée polymorphe du Labyrinthe, témoin', pouvoirs: pows('Polymorphie'),
  notes: `Jolie, très bien roulée, camée notoire ; sort du bureau de Val (elle venait chercher ses consignes) quand Bill arrive, vers 0 h 19-0 h 20. Pressée, elle n'accompagnera pas Bill.
Au choix du MJ : les PJ la retrouvent d'après la description de Bill, elle disparaît grâce à sa polymorphie, ou elle vient témoigner d'elle-même.
Elle ment pour ne pas être le suspect idéal (cache être entrée dans le bureau) et est trop défoncée pour comprendre que Bill est le coupable. Mais elle dit avoir croisé Bill vers minuit vingt : contradiction avec le récit de Bill.
Pas de stats dans le livre : fiche minimale, polymorphie ajoutée d'après le texte.`,
});
const gerard = npc('gerard', {
  nom: 'Gérard « Gégé » Mermieux', source: 'Humain, vieil ami de Bill, victime du chantage', car: car('2 2 2 2 2 2'),
  notes: `Chef d'entreprise (l'entreprise est au nom de sa femme), marié, trois enfants. Piégé dans une boîte « normale » du Minotaure par Loretta, prostituée polymorphe qui a pris l'apparence d'une mineure pendant l'acte ; photos et demande de rançon. A appelé Bill à l'aide.
Alibi : au restaurant avec des collègues puis jusqu'au matin avec son associé Andrew Ling (qui confirme : soirée inhabituellement longue, Gérard intarissable).
Son nom figure une fois dans l'agenda de Val (c'est Bill qui est venu « au sujet de Gérard ») : il se trouble, prétend être allé négocier. Facile à confondre : il n'a jamais vu le bureau ni Val.
Pas de stats dans le livre.`,
});
const dubois = npc('dubois', {
  nom: 'Luc Dubois', source: 'Humain, professeur de droit, victime du chantage',
  notes: 'La quarantaine, vie paisible en apparence. Avait choisi de payer et avait presque réuni la somme (remise prévue sous une semaine ou dix jours) : la mort de Val l\'ennuie (comment récupérer les photos ?). Sincère, ne cache rien. Nom dans l\'agenda.\nPas de stats dans le livre.',
});
const skox = npc('skox', {
  nom: 'Alina Skox', source: 'Humaine, riche commerçante, victime du chantage',
  notes: 'Parfumeries et bijouteries à Paris, 55-60 ans peroxydés, bourgeoise clinquante. Se moque complètement que ses photos (avec plusieurs jeunes hommes) circulent : ça flatte son ego et fera de la publicité. Fausse piste sans mobile. Absente de l\'agenda.\nPas de stats dans le livre.',
});
const grecs = npc('grecs', {
  nom: 'Héros païens grecs', source: 'Estée Lelieur, Andy Solloy, Stéphane Libourne, Alexis Dauriac', type: 'paien', qty: 4,
  notes: 'Grandes gueules du panthéon grec ; Dauriac voue un culte à Minos. Savaient depuis longtemps que Val est le Minotaure. Se dégonflent dès qu\'on leur annonce le meurtre et se défendent désespérément. Fausse piste.\nPas de stats dans le livre : fiche minimale (valeurs par défaut).',
});
const vigiles = npc('vigiles', {
  nom: 'Vigiles du Labyrinthe', source: 'Personnel de sécurité', qty: 4, car: car('3 2 2 2 2 2'), def: L(2),
  armes: [poing(3), arme('Matraque', 'Matraque', 2)],
  talents: 'Corps à corps 3, Combat 2, Défense 2, Intimidation 2, Vigilance 2',
  notes: 'Gardent la plupart des portes ; leur cagibi est près du bureau de Val (les caméras visibles y renvoient). Le videur de l\'entrée a un don de double vue qui repère les surnaturels.\nL\'un d\'eux peut défoncer la porte à la place de Bill et s\'étonner ensuite qu\'elle ait si peu résisté.\nPas de stats dans le livre : valeurs estimées (humains costauds).',
});

const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });

const scenes = [
  scene('horschamp', '0. Hors-champ : le contentieux', 'Avant la partie (MJ seul)',
    `Choisir le PJ meurtrier, appelé ici « Bill » : capable de tuer le Minotaure d'un coup et assez loyal ou impulsif pour le vouloir.
Ce que le personnage sait (le joueur, a priori, non) :
• Bill et Gérard Mermieux, humain ordinaire, se sont sauvé la vie il y a longtemps ; perdus de vue depuis.
• Gérard s'est fait piéger par Loretta (polymorphe au service de Val) dans une boîte ordinaire : photos avec une « mineure », rançon.
• Premier rendez-vous de Bill au bureau du Minotaure, « au sujet de Gérard » : Val le méprise, l'humilie ou le menace, et s'inquiète qu'un agent d'Hercule s'en mêle.
• Bill décide de le tuer (il finira sur l'Olympe et se réincarnera, et personne ne le regrettera). Second rendez-vous, sous prétexte de négocier : il repère la clé sur la porte, la serrure et les armes au mur. Les deux appels sont passés depuis le bureau de Gérard.
• La fête de la DTC au Labyrinthe est l'occasion : Val ne peut pas lui refuser l'entrée.`, [inScene(gerard)], false,
    [choice('mode', 'Comment jouer la culpabilité de Bill ?', [
      ['Le joueur ignore tout (version du livre)', 'Le MJ joue la version mensongère et ment pour Bill ; tout le sel est que le joueur le découvre lui-même.'],
      ['Le joueur est mis dans la confidence', 'Il joue l\'innocent en connaissance de cause ; plus sûr, moins drôle.'],
      ['Bill manipulé par un PNJ', 'Un psi victime du chantage (ou un ennemi de Val) le programme : « blancs », souvenirs partiels ; on peut ensuite lui expliquer qu\'il ne se souvient de rien.'],
    ])]),
  scene('arrivee', '1. La fête au Labyrinthe (22 h 30)', 'Le Labyrinthe, club privé, Paris 1er',
    `Façade décrépite au fond d'une cour, porte à lucarne grillagée, écriteau « club privé ». Dedans : quatre étages de salons, cabinets privés et pistes de danse, jeux clandestins au sous-sol, style industriel sobre, escaliers et mezzanines partout, portes gardées. Plus on s'enfonce, plus il faut être bien vu de Val.
Entrée réservée aux surnaturels (anges et démons renégats ou cools, héros païens, psis, quelques sorciers choisis), repérés par le videur à double vue. Peu d'anges de Dominique. On y danse, on y négocie, on y joue, on y achète drogue et compagnie.
Caméras et micros partout (sauf dans le bureau de Val), surtout dans les salons : matière à chantage.
Hercule est de la fête. Faire croiser aux PJ des personnalités : héros grecs, Pierre Osman, anges, démons, psis. Jésus peut les aborder (rencontre facultative).
23 h 10 : Bill croise le Minotaure, aparté visible de loin. Version jouée : ils parlent foot, Val repart vexé. En vrai : dernier refus de lâcher Gérard.`,
    [inScene(minotaure), inScene(hercule), inScene(jesus), inScene(osman), inScene(grecs)], false),
  scene('fausse', '2. La version de Bill (23 h 10 – 0 h 26)', 'Pistes de danse puis couloir du bureau',
    `Jouer la chronologie mensongère sans prévenir. Toutes les scènes clés se passent quand Bill est seul.
• 23 h 10 – 0 h 16 : occuper les autres PJ (danse, drague, rencontres) pour détourner l'attention de Bill.
• 0 h 06 (Bill impérativement seul) : un serveur — grand, maigre, brun, l'air bête, élocution difficile — dit à Bill que le Minotaure veut le voir seul dans son bureau. Ce serveur n'existe pas. Si le joueur veut emmener quelqu'un, tout faire pour l'en dissuader ; en dernier recours, les autres PJ deviennent complices.
• 0 h 17 : Bill quitte la salle. 0 h 19 : dans le couloir, il croise Jessica qui sort du bureau ; elle est pressée et ne le suit pas.
• Les six minutes de 0 h 20 à 0 h 25 disparaissent du récit (indice).
• 0 h 26 : porte fermée à clé, râles à l'intérieur.

Version vraie (MJ) : Bill met des gants, entre sans frapper, prend une épée au mur et transperce Val d'un coup ; en s'écartant du corps il se cogne l'épaule gauche. Au ciseau à bois, il fait sauter la gâche du chambranle, tourne la clé de l'intérieur, ressort et referme : la porte ne tient plus que par le pêne de la poignée. Il enlève ses gants. Aucun bruit dans le bureau.`,
    [inScene(jessica)], false),
  scene('porte', '3. La porte close (0 h 26 – 0 h 27)', 'Couloir coudé devant le bureau de Val',
    `Il faut un témoin qui voie la porte « céder ». Selon la réaction du joueur de Bill :
• Il appelle à l'aide puis défonce lui-même : tout se passe comme prévu.
• Il force sans appeler : la porte résiste jusqu'à l'arrivée d'un employé attiré par le bruit, puis cède.
• Il appelle sans forcer : les râles deviennent pressants ; s'il refuse d'enfoncer, un vigile le fait (il trouvera plus tard que la porte a peu résisté).
Le corps est découvert : l'enquête commence. Hercule prend les choses en main et y lance les PJ ; il faut ménager les personnalités présentes.`,
    [inScene(vigiles, { qty: 1 })], false,
    [choice('defonce', 'Qui défonce la porte ?', [
      ['Bill, devant témoin', 'Version officielle ; plus tard, le témoin peut se rappeler qu\'il a frappé de l\'épaule droite alors qu\'il se plaint de la gauche.'],
      ['Un vigile', 'Le vigile pourra s\'étonner du peu de résistance de la porte.'],
    ])]),
  scene('bureau', '4. Le bureau du Minotaure', 'Bureau de Val (baroque : art primitif, maîtres anciens, vase Ming, armure)',
    `Indices à trouver en cherchant :
• L'arme : épée pointue (belle reproduction) en plein cœur, mort quasi immédiate, peu de sang, aucune autre blessure. Lourde, coup franc : un assassin costaud. Pas d'empreintes (gants). Un emplacement vide dans la panoplie du mur.
• La porte : de bonne qualité, débris partout, toujours verrouillée avec la clé dedans. Seul détail : le morceau de gâche cassé au ciseau n'est pas avec les autres débris (parlant seulement pour des PJ très soupçonneux).
• Les écrans (trois, console de caméras et micros) : peu de caméras sur les pistes et les entrées, beaucoup dans les salons. Hercule y reconnaît des pièces où il a tenu des réunions secrètes. Les caméras visibles renvoient au cagibi des vigiles ; celles des pistes enregistrent en boucle.
• Téléphone : longue liste d'appels inexploitable au début (on y retrouvera les victimes du chantage, dont Gérard) ; pas Bill, qui appelait du bureau de Gérard. Répondeur vide.
• Double fond d'un tiroir : boîte avec quatre enveloppes de photos et négatifs (nom, date, somme) : Gérard Mermieux, Luc Dubois, Alina Skox, Pierre Osman. Val rendait tout une fois payé.
• Agenda illisible (écriture de taureau) : Mermieux (une fois, en fait Bill), Dubois, Osman ; pas Skox ; le nom de Bill y est (second rendez-vous) mais quasi introuvable sauf à le chercher précisément.
• Meuble-trieur : factures, et le dossier « correspondance 5 » plein de lettres de menaces reçues et envoyées (fausses pistes à volonté).
Pas d'ordinateur.`, [], false),
  scene('temoins', '5. Témoins et suspects du Labyrinthe', 'Le Labyrinthe, après le meurtre',
    `• Le serveur : introuvable, inconnu du personnel, absent des vidéos (enregistrement en boucle). Il devient suspect : a-t-on voulu piéger Bill ? Bill peut jouer la victime d'une machination.
• Jessica : voir sa fiche ; elle situe sa rencontre avec Bill vers 0 h 20.
• Clients et personnel : Val était détesté autant qu'indispensable. Les quatre héros grecs (dont Dauriac, adorateur de Minos) savaient qui il était et paniquent.
• Pierre Osman : mobile, mais alibi filmé.
• Beaucoup d'autres surnaturels présents : fausses pistes à l'infini.
Une approche brutale est possible : les vigiles s'interposent si les PJ malmènent clients ou personnel.`,
    [inScene(jessica), inScene(osman), inScene(grecs), inScene(vigiles, { qty: 4 })], true,
    [choice('jessica', 'Que fait Jessica après le meurtre ?', [
      ['Les PJ la retrouvent', 'D\'après la description de Bill ; elle ment mais donne l\'heure de minuit vingt.'],
      ['Elle se cache', 'Elle change d\'apparence par polymorphie ; témoin introuvable.'],
      ['Elle vient témoigner', 'Elle se présente d\'elle-même, avec la même version.'],
    ])]),
  scene('suspects', '6. Les victimes du chantage', 'Paris (domiciles, bureaux)',
    `• Alina Skox : se moque du chantage ; fausse piste.
• Luc Dubois : allait payer ; ennuyé par la mort de Val ; sincère.
• Gérard Mermieux : réaction variable à l'annonce (content, surpris avec un regard vers Bill, ou impassible) ; s'empresse de donner son alibi (Andrew Ling). Interrogé sur l'agenda, il s'embrouille. Le MJ peut le rendre très louche pour resserrer l'enquête. Il ne connaît ni le bureau ni le visage de Val.`,
    [inScene(gerard), inScene(dubois), inScene(skox)], false),
  scene('bill', '7. Ce qui cloche avec Bill', 'Partout',
    `Leviers pour guider des PJ perdus :
• Chronologie : Jessica dit avoir croisé Bill à l'heure où Bill dit parler au serveur.
• Gants et ciseau à bois sur Bill : une maladresse et ils tombent.
• Épaule gauche blessée (Bill s'en est plaint), mais le témoin l'a vu frapper la porte de l'épaule droite (souvenir tardif ou reconstitution). Ne pas sortir cet indice trop tôt.
• Gégé : Bill le connaît, Gégé est louche…
Le MJ fournit les réponses de Bill et peut se contredire exprès : « connais pas » → « une vieille connaissance perdue de vue » → « je l'ai revu la semaine dernière, mais ça ne prouve rien ».`, [], false),
  scene('fin', '8. Dénouement', 'Au choix',
    `Les PJ (et le MJ, si Hercule est mis au courant) décident du sort du coupable. Les révélations sur le chantage enfoncent Val et offrent des circonstances atténuantes à Bill ; l'équipe devrait se serrer les coudes. Au pire, le joueur crée un nouveau personnage.
Suites de campagne : le Labyrinthe ferme un temps puis est repris par Rébecca Lange, ange de Marc renégate et associée de Val (sans le chantage, surtout s'il a été ébruité). L'âme du Minotaure arrive sur l'Olympe juste à temps pour être dévorée par Victor.`,
    [inScene(hercule)], false,
    [choice('verdict', 'Que font les PJ du coupable ?', [
      ['Ils couvrent Bill', 'L\'affaire reste non élucidée (ou mise sur le dos d\'une fausse piste) ; secret partagé dans l\'équipe.'],
      ['Ils mettent Hercule dans la confidence', 'Hercule tranche ; il n\'aimait guère Val, et le chantage pèse lourd.'],
      ['Ils livrent Bill', 'Ambiance garantie ; le joueur peut devoir créer un nouveau personnage.'],
    ])]),
];

const scenario = {
  id: 'pa2-kiwis',
  nom: 'Petites Apocalypses – Les kiwis se cachent pour mûrir',
  resume: 'Scénario d\'enquête pour la troisième Force (agents de la DTC d\'Hercule). Lors d\'une fête au Labyrinthe, boîte de nuit réservée aux surnaturels, le patron Val Modeno — le Minotaure — est retrouvé mort dans son bureau fermé de l\'intérieur. Le meurtrier est l\'un des PJ (« Bill »), qui voulait libérer un ami victime du chantage de Val ; son joueur l\'ignore, car le MJ a joué la scène dans la version mensongère du personnage. Huis clos à indices et fausses pistes jusqu\'à la terrible révélation.',
  notes: `Source : ${REF}. Peut aussi se placer n'importe où dans la campagne « Une apocalypse, ce n'est pas la fin du monde » : le Labyrinthe peut servir de lieu de rencontre dès le début, et c'est l'occasion de présenter Jésus et Chez Régis.

Principe : deux chronologies. La vraie (Bill tue Val à 0 h 22 puis simule l'enfoncement de la porte) et la fausse, que le MJ joue comme si c'était le récit de Bill. Le MJ ment pour Bill en choisissant ce qu'il sait ; des contradictions l'enfoncent. Variantes moins manipulatrices : joueur dans la confidence, ou Bill programmé par un PNJ (scène 0).

Chronologie vraie : 22 h 30 arrivée · 23 h 10 aparté avec Val (refus) · 0 h 17 Bill quitte la piste · 0 h 19 croise Jessica · 0 h 20 entre · 0 h 22 tue Val · 0 h 25 sabote la gâche · 0 h 26 donne l'alerte · 0 h 27 « défonce » la porte devant témoin.

Récompenses : le livre ne donne pas de barème de PA.

Adaptations anges et démons (ch. 14, p. 115) : adaptation facile, il y a de tout au Labyrinthe ; l'équipe de Bill est impliquée quel que soit son camp.
• MV : enquêter va de soi pour des anges ; sinon un ange en chef présent leur confie officiellement l'affaire, car des rumeurs accusent tour à tour chaque camp et la situation risque de dégénérer. Uniquement avec des anges « cools » : un serviteur de Dominique ou de Laurent n'a rien à faire au Labyrinthe (sinon, garder la structure et changer tout le décor).
• INS : Val avait beaucoup d'amis démons dans ses trafics, qui veulent le venger ou savoir qui l'a tué ; mission officielle d'un démon en chef présent, ou occasion de mouiller la troisième Force ou des anges.

Fiches : Val Modeno et Pierre Osman chiffrés dans le scénario ; Hercule (p. 21) et Jésus (p. 30) repris du livre ; les autres PNJ n'ont pas de stats (fiches minimales). Vigiles estimés.`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [minotaure, osman, hercule, jesus, jessica, gerard, dubois, skox, grecs, vigiles].map(asType);
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));

writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types');
