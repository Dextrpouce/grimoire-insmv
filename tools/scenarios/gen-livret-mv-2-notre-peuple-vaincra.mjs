// Génère le fichier d'import « insmv-scenario » pour « Notre peuple vaincra ! » (Livre de base INS/MV4, livret Magna Veritas, p. 68-91)
// usage : node gen-livret-mv-2-notre-peuple-vaincra.mjs <racine du projet> <fichier de sortie>
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [root, out] = process.argv.slice(2);
const R = await import(pathToFileURL(path.join(root, 'js/rules.js')).href);

const REF = 'Livre de base INS/MV4, livret Magna Veritas, « Notre peuple vaincra ! », p. 68-91';
const L = (s) => R.parseLvl(String(s));
const car = (s) => { const v = s.split(/\s+/).map(L); return { fo: v[0], ag: v[1], pe: v[2], vo: v[3], pr: v[4], foi: v[5] }; };
// « Colère divine 2* » : l'astérisque signale un nouveau pouvoir du scénario (repris dans les règles)
const pows = (s) => s.split(',').map((x) => x.trim().replace(/\*/g, '')).filter(Boolean).map((x) => {
  const m = x.match(/^(.*?)\s+(\d+\+?)$/); return { n: m ? m[1] : x, r: m ? L(m[2]) : 0 };
});
const seuils = (s) => s.split('/').map(Number);
const ARMES = new Map(R.ARMES.flatMap(([g, l]) => l.map((x) => [x[0], { prec: x[1], puis: x[2], melee: R.MELEE_GROUPS.includes(g) }])));
const arme = (n, table, lvl) => { const w = ARMES.get(table); if (!w) throw new Error('arme inconnue : ' + table); return { n, att: L(lvl), ...w }; };
const poing = (lvl) => arme('Coup de poing', 'Coup de poing', lvl);
const P = 'mv2-'; let n = 0; const id = (k) => P + k;
const npc = (key, o) => ({
  id: id(key), nom: '', source: '', type: 'humain', qty: 1, car: car('2 2 2 2 2 2'), def: 2, prot: 0, pfFix: null, pp: 0, seuilsFix: null,
  armes: [poing(1)], pouvoirs: [], talents: '', esquive: false, volonte: false, notes: '',
  ...o, notes: [o.notes, `Source : ${REF}.`].filter(Boolean).join('\n'),
});
const knows = (s) => `Connaît : ${s}.`;

// ---------------- Contacts (Tbilissi) ----------------
const sulejman = npc('sulejman', {
  nom: 'Sulejman Sarovic', source: 'Contact musulman à Tbilissi', car: car('2 2 3 2 2+ 2+'), def: L(2), pfFix: 4, seuilsFix: seuils('3/6/9/12'),
  armes: [poing('1+')],
  talents: 'Baratin 3, Corps à corps 1+, Défense 2, Discussion 2, Enquête 1+, Fouille 1+, Médecine 2, Savoir criminel 2 (mafia tchétchène 3+), Savoir militaire 1 (résistants tchétchènes 2), Survie 1 (urbain 2+)',
  notes: 'Tchétchène de 28 ans, réfugié en Géorgie. Haine viscérale et héréditaire des Russes ; pas le courage de prendre les armes, il aide la cause à sa façon. Contact obtenu par un imam londonien.\nPasse par l\'Ingouchie, matériel en quantité illimitée, pas de bakchich (un don à la cause est apprécié). Accompagne à contrecœur les PJ dans le quartier russe.',
});
const andranik = npc('andranik', {
  nom: 'Andranik Gougassian', source: 'Contact chrétien à Tbilissi', car: car('2 2 3 2 2+ 2+'), def: L(2), pfFix: 4, seuilsFix: seuils('3/6/9/12'),
  armes: [poing('1+')],
  talents: 'Baratin 3, Corps à corps 1+, Défense 2, Discussion 2, Enquête 1+, Fouille 1+, Médecine 2, Savoir criminel 2 (mafia russe 3+), Savoir militaire 1 (armée d\'occupation 2), Survie 1 (urbain 2+)',
  notes: 'Arménien de 42 ans, « homme d\'affaires » caucasien qui trafique de tout. Catholique arménien non pratiquant et islamophobe acharné. Connaît la mafia russe et la fuit autant qu\'il peut.\nVoit dans les PJ une mine d\'or : le client est roi. Propose un mini-jet de trafiquants jusqu\'à Groznyï ou la longue route par le Daghestan.',
});

// ---------------- Russes ----------------
const zverboy = npc('zverboy', {
  nom: 'Zverboy (capitaine Boris Ivanovitch Stransky)', source: 'Ange de Laurent, grade 2 (camp Kirov)', type: 'ange', car: car('4+ 5 4+ 3+ 2 4+'), def: L(5),
  pp: 25, pfFix: 8, seuilsFix: seuils('7/15/22/30'),
  armes: [arme('Épée', 'Épée longue', '6+'), arme('Fusil-mitrailleur', 'Fusil-mitrailleur', '7+')],
  pouvoirs: pows('Arme exaltée 3, Armure corporelle 5, Aura de courage 3, Champ de force 4, Décharge électrique 3, Juste-lame 4'),
  talents: 'Combat 5 (épées 6+), Corps à corps 2+, Défense 5, Discussion 2+, Enquête 3+, Fouille 4, Savoir militaire 2+ (armée russe 5), Tir 5 (armes automatiques 7+)',
  notes: `Biélorusse, 33 ans, blond aux yeux verts. Rattaché à l'Église orthodoxe, fanatique qui vit la guerre comme une croisade : conversion forcée ou massacre. Rêve d'une équipe d'anges pour éliminer en douce les modérés du gouvernement prorusse et les gradés trop mous.
Meilleur contact possible côté russe, à condition de partager son intégrisme : aucune faiblesse ni compassion tolérée. Proche de Blakanov, il peut y mener les PJ. Tait ses amis de Georges, sauf à des alliés aussi durs que lui ; affirme que la mafia tchétchène est aux mains des démons musulmans et couvrira toute action contre leur quartier. Pense que des anges musulmans encadrent boivikis et moudjahidin ; insisté, il suggère la prière du vendredi à la mosquée Al Watan.
Armes non précisées : épée longue et fusil-mitrailleur estimés d'après ses talents.
${knows('Blakanov, Tuomas Holpainen, colonel Bokonov')}`,
});
const bokonov = npc('bokonov', {
  nom: 'Colonel Piotr Sergeïevitch Bokonov', source: 'Officier russe, relations avec le gouvernement tchétchène', car: car('2+ 2+ 2+ 2+ 2+ 2'), def: L(2),
  pfFix: 5, seuilsFix: seuils('3/7/10/14'),
  armes: [arme('Fusil-mitrailleur', 'Fusil-mitrailleur', 3), arme('Couteau', 'Poignard ou saï', 2)],
  talents: 'Combat 1 (couteaux 2), Corps à corps 1+, Défense 2, Fouille 3, Intimidation 2+, Savoir militaire 2 (armée russe 4), Tir 1 (armes automatiques 3)',
  notes: `Russe de 47 ans, militaire arriviste et sans scrupules, nostalgique des gros budgets. Plus souvent au bureau qu'au front. Agnostique, il joue l'orthodoxe pratiquant auprès du pope Vlassov.
Chargé des relations avec le gouvernement tchétchène : il peut ouvrir ses portes aux PJ s'il y trouve un intérêt politique ou financier. Reçoit régulièrement une valise de Lewenski (sans jamais le rencontrer) et arrose l'imam d'Al Cairo.
Indice clé : des archives (bureau et coffre-fort chez lui, en ville) sur tous les notables de Groznyï, dont des témoignages et photos des rituels satanistes de Sergeï (pentacles, sacrifices humains) et des exploits étranges de Mohamed Islam.
${knows('capitaine Stransky, Blakanov, Tuomas Holpainen, Lewenski, pope Vlassov, Mohammed Vasnadov, Alexandre Sysoyev')}`,
});
const soldats = npc('soldats-russes', {
  nom: 'Soldats russes', source: 'Soldats russes typiques (FSB, spetsnaz, division Dzerjinski)', qty: 6, car: car('2+ 2+ 2+ 2 2 2'), def: L(2),
  pfFix: 4, seuilsFix: seuils('3/7/10/14'),
  armes: [arme('Fusil-mitrailleur', 'Fusil-mitrailleur', 3), arme('Couteau', 'Poignard ou saï', 2), arme('Lance-roquettes antichar', 'Lance-roquettes antichar', 3)],
  talents: 'Combat 1 (couteaux 2), Corps à corps 2, Fouille 3, Savoir militaire 1 (armée russe 2), Tir 1 (armes automatiques 3)',
  notes: 'Troupes d\'élite dures et impitoyables, nostalgiques de la grandeur passée. Méprisent les collabos, respectent les boivikis.\nValeurs reprises du bestiaire des livres (« Soldat professionnel »).',
});
const volontaires = npc('volontaires', {
  nom: 'Volontaires de la CEI', source: 'Mercenaires typiques', qty: 6, car: car('2+ 2+ 2+ 2 1+ 2'), def: L('2+'),
  pfFix: 4, seuilsFix: seuils('3/7/10/14'),
  armes: [arme('Fusil-mitrailleur', 'Fusil-mitrailleur', 3), arme('Couteau', 'Poignard ou saï', 2), arme('Lance-roquettes antichar', 'Lance-roquettes antichar', 3)],
  talents: 'Combat 1 (couteaux 2), Corps à corps 2+, Défense 2+, Discrétion 2, Savoir militaire 1 (armée russe 1+), Tir 1 (armes automatiques 3)',
  notes: 'Repris de justice, asociaux et psychopathes venus de toute la CEI. Payés au boiviki abattu : ils en voient partout et massacrent sans discernement. Détestés de tous.\nLance-roquettes au niveau du Tir automatique, comme les soldats russes du bestiaire.',
});

// ---------------- Tchétchènes prorusses ----------------
const kardanov = npc('kardanov', {
  nom: 'Commandant Mourad Kardanov', source: 'Forces armées tchétchènes (caserne Karpinka)', car: car('2 2 2+ 3 2 1+'), def: L(2),
  pfFix: 5, seuilsFix: seuils('3/6/9/12'),
  armes: [arme('Revolver petit calibre', 'Revolver petit calibre', 3), arme('Couteau', 'Poignard ou saï', 2)],
  talents: 'Baratin 2+, Combat 1 (couteaux 2), Corps à corps 2, Défense 2, Savoir militaire 1 (armée tchétchène 3+), Tir 1 (armes de poing 3)',
  notes: `Tchétchène de 35 ans, patriote athée convaincu du rattachement à la CEI : traître pour tous, il a échappé à une dizaine d'attentats et perdu toute sa famille. Seul, d'autant plus fervent. Méprise wahhabites, boivikis et les deux mafias ; ses hommes harcèlent les quartiers chauds. Bon contact avec l'hôpital musulman, s'entend avec Bokonov (sans s'y fier).
Fait vite confiance aux étrangers respectueux. Indices : un mafieux russe drogué a parlé de prince-démon et de Grand Jeu en cellule, puis a disparu au matin ; ses hommes ont surpris ceux de Sergeï en pleine crucifixion « folklorique ».
${knows('Bokonov, Mohammed Vasnadov, Lewenski, pope Vlassov, Blakanov, Nouredine El Khâdi, Abubakar Alkhazurov')}`,
});
const collabos = npc('collabos', {
  nom: 'Collabos tchétchènes', source: 'Milices du gouvernement prorusse', qty: 6, car: car('2 2 2+ 2 2 3'), def: L(2),
  pfFix: 4, seuilsFix: seuils('3/6/9/12'),
  armes: [arme('Revolver petit calibre', 'Revolver petit calibre', 3), arme('Couteau', 'Poignard ou saï', 2)],
  talents: 'Baratin 3, Combat 1 (couteaux 2), Corps à corps 2, Défense 2, Savoir militaire 1 (armée russe 1+), Tir 1 (armes de poing 3)',
  notes: 'Pauvres types venus chercher la sécurité et trois repas par jour : mauvais combattants, policiers médiocres, corrompus, prompts à déserter ou à changer de camp.',
});

// ---------------- Anges de Georges (volontaires) ----------------
const nightwish = npc('nightwish', {
  nom: 'Nightwish (sergent Tuomas Holpainen)', source: 'Ange de Georges, grade 2 (compagnie Octobre Rouge)', type: 'ange', car: car('6+ 5+ 3 3+ 2 3+'), def: L('4+'),
  pp: 28, pfFix: 10, seuilsFix: seuils('9/19/28/38'),
  armes: [arme('Couteau de combat', 'Poignard ou saï', 8), arme('Fusil-mitrailleur', 'Fusil-mitrailleur', '3+')],
  pouvoirs: pows('Arme exaltée 5+, Armure corporelle 5, Augmentation de Force 3, Champ de force 4+, Colère divine 2*, Jet de flammes 5, Volonté supra-normale 2'),
  talents: 'Combat 8, Corps à corps 6, Défense 4+, Discussion 3+, Fouille 5, Médecine 4, Savoir militaire 5 (mercenaires 6), Survie 3 (urbain 6+), Tir 3+',
  notes: `Estonien de 27 ans, stalinien convaincu : tout plutôt que l'islam. Commande les deux cents hommes d'Octobre Rouge, compagnie fière, détestée et en guerre ouverte avec celle de Saint Georges. Envoie ses hommes même contre le gouvernement prorusse.
Recrute n'importe qui : bizutage = participer en première ligne à une descente chez les séparatistes (plus de 80 % de morts). Très lié à la mafia russe ; Lewenski est son grand ami et il ignore totalement que son patron est un prince-démon (il en serait fou de rage). Peut décrire la mafia, servir d'intermédiaire avec Sergeï et emmène ses potes au bar Vedeno, rue Pabody. Met les rumeurs sur Sergeï sur le compte de sa « liturgie papiste ».
Armes non précisées : couteau (Combat 8) et fusil-mitrailleur estimés.
${knows('Bokonov, capitaine Stransky, Lewenski, pope Vlassov, Blakanov')}`,
});
const dubitchou = npc('dubitchou', {
  nom: 'Dubitchou (commandant Vladimir Ilitch Blakanov)', source: 'Ange de Georges, grade 3 (compagnie de Saint Georges)', type: 'ange', car: car('6+ 6+ 4 4+ 3 3+'), def: L('7+'),
  pp: 43, pfFix: 11, seuilsFix: seuils('9/19/28/38'),
  armes: [arme('Sabre', 'Épée longue', 9), arme('Fusil-mitrailleur', 'Fusil-mitrailleur', '5+')],
  pouvoirs: pows('Arme exaltée 7+, Armure corporelle 7+, Augmentation de Force 5, Champ de force 7+, Colère divine 3+*, Conversion physique 6, Décharge électrique 7, Trait d\'énergie 7+, Vitesse 6, Volonté supra-normale 3'),
  talents: 'Combat 9, Corps à corps 8, Défense 7+, Discussion 5+, Fouille 7, Médecine 6, Savoir criminel 2 (mafia russe 4), Savoir militaire 5 (mercenaires 6), Survie 5 (urbain 9), Tir 5+',
  notes: `Ukrainien de 49 ans. Ange de Georges qui a refusé la retraite et le changement d'archange, protégé par l'Église orthodoxe : croisade panslave. Chef de la compagnie de Saint Georges, la plus grosse et la plus disciplinée du stade Dinamo. Cynique et cruel : tout est permis à ses hommes s'ils se battent bien.
Ne détaille pas ses liens avec la mafia mais peut faire guider les PJ rue Pabody. Méprise Tuomas, connaît Stransky, se doute d'anges chez les wahhabites et de démons dans la mafia tchétchène (« aux musulmans de faire leur ménage »). Dégoûté du sort fait à saint Georges par les catholiques : laisse les « papistes » se débrouiller. Ami de soirées de thé de Christian Tarkov ; peut y inviter des PJ subtils et philosophes.
Armes non précisées : sabre (épée longue) et fusil-mitrailleur estimés.
${knows('capitaine Stransky, Christian Tarkov, colonel Bokonov, pope Vlassov')}`,
});

// ---------------- Mafia russe ----------------
const sergei = npc('sergei', {
  nom: 'Sergeï Vladimirovitch Lewenski', source: 'Représentant de Nisroch, chef de la mafia russe locale', car: car('2 2+ 2+ 2+ 2 2'), def: L(2),
  pfFix: 4, seuilsFix: seuils('3/6/9/12'),
  armes: [arme('Revolver gros calibre', 'Revolver gros calibre', '2+'), arme('Couteau', 'Poignard ou saï', '2+')],
  talents: 'Baratin 3+, Combat 1 (couteaux 2+), Corps à corps 1+, Culture générale 1+ (religion catholique 3), Défense 2, Discrétion 1+, Discussion 3, Enquête 2+, Fouille 3, Savoir occulte 1+ (satanisme 2), Tir 1+ (armes de poing 2+), Torture 2',
  notes: `Polonais de 36 ans, enfant des rues de Gdansk. Tient le bar-bordel-fumerie Vedeno, une quarantaine d'établissements rue Pabody et une dizaine à Kalinine ; toutes les bandes russes lui reversent leur part. Guerre totale contre Alkhazurov, qu'il s'est juré de crucifier lui-même (il le sait démon).
Catholique superstitieux, il a vendu son âme à Strachnoff et le regrette amèrement : prie seul, ivre, devant un reliquaire volé dans sa chambre au 2e étage du Vedeno. Toujours entouré d'une dizaine d'hommes armés, se déplace en blindé.
PNJ indispensable : il connaît les secrets de l'organisation, peut mener les PJ à Nisroch (jusqu'à Moscou) et son témoignage enregistré, ou lui-même ramené en France, suffit à réussir la mission. Face au surnaturel, il panique et peut se confesser à des anges ; s'il les sait anges, il voudra chasser un démon avec eux pour racheter son âme.
${knows('colonel Bokonov, Tuomas Holpainen, Mourad Kardanov')}`,
});
const mafRusses = npc('mafieux-russes', {
  nom: 'Mafieux russes', source: 'Hommes de main de Lewenski', qty: 10, car: car('2 2+ 2+ 2+ 2 2'), def: L('1+'),
  pfFix: 4, seuilsFix: seuils('3/6/9/12'),
  armes: [arme('Revolver gros calibre', 'Revolver gros calibre', '2+'), arme('Couteau', 'Poignard ou saï', '2+')],
  talents: 'Baratin 2+, Combat 1 (couteaux 2+), Corps à corps 1+, Défense 1+, Discrétion 2, Enquête 1+, Fouille 3, Tir 1+ (armes de poing 2+), Torture 2',
  notes: 'Mélange de gangsters des goulags et d\'anciens du KGB : ni honneur ni principes, violence et torture banales, n\'hésitent pas à supprimer une famille entière.',
});
const nisroch = npc('nisroch', {
  nom: 'Nisroch (Nickolaï Strachnoff)', source: 'Prince-démon « à la retraite », homme d\'affaires moscovite', type: 'demon',
  talents: 'Aucune caractéristique dans le livre.',
  notes: `Prince-démon (le plus récemment promu) qui s'ennuyait : il vit en humain en Russie depuis des années, a laissé la gestion de son empire à son bras droit Trads et ne répond plus aux convocations du Conseil. Fortune bâtie sur les joyaux soviétiques rachetés à bas prix, conglomérat militaro-médiatico-industriel, retour au trafic de drogue ; surnommé « le cruel ». Marié depuis 1996 à Loubiana, ex-mannequin biélorusse (veuve grâce à ses sbires), trois enfants ; vit dans une des « sept sœurs » de Staline.
Pas discret : jet-set, grands restaurants, gardes du corps surarmés (anciens militaires). Peut accorder une entrevue sur une excuse en béton ; Lewenski facilite l'approche. Curieux, il ne soupçonne pas d'anges et peut commettre des imprudences.
Coffre-fort de son appartement de 500 m² : drogue, argent, dossiers mafieux et documents démoniaques de Trads sur son empire du Mal.
Fiche sans valeurs : prince-démon, à improviser ; il ne doit pas mourir facilement.`,
});

// ---------------- Église orthodoxe et musulmans modérés ----------------
const vlassov = npc('vlassov', {
  nom: 'Pope Vlassov', source: 'Basilique Saint Georges', car: car('2 1+ 2 3+ 3 3+'), def: L(2), pfFix: 5, seuilsFix: seuils('3/6/9/12'),
  talents: 'Baratin 2+, Défense 2, Discussion 3+, Métier (pope) 3+',
  notes: `Ukrainien de 55 ans, survivant de toutes les persécutions. Connaît le Grand Jeu, sait que Tuomas et Vladimir sont des anges (et Stransky, qu'il évite comme « papiste »), garde le secret par égard pour les anges orphelins de Georges.
Confessions à foison : bizarreries de la bande à Sergeï (pour lui un intégriste papiste presque pire qu'un démon), comportements anormaux de Mohamed Islam et de son tulwar, sauvagerie de la mafia tchétchène (démons soupçonnés, sans preuve).
Très méfiant envers des Occidentaux qui semblent connaître le Grand Jeu : il se ferme. Seul un roleplay intense le fera aider des anges catholiques.
${knows('Blakanov, colonel Bokonov, Tuomas Holpainen')}`,
});
const vasnadov = npc('vasnadov', {
  nom: 'Imam Mohammed Vasnadov', source: 'Mosquée Al Cairo (modérée, progouvernementale)', car: car('2 1+ 2 3 2+ 2+'), def: L('2+'), pfFix: 5, seuilsFix: seuils('3/6/9/12'),
  talents: 'Baratin 1+, Défense 2+, Discussion 3, Métier (imam) 3',
  notes: `Ossète de 47 ans, petit imam espiègle au charisme saisissant, respecté de tous ; aucune bombe n'a jamais touché sa mosquée. Partisan d'une paix négociée dans la CEI, déçu du référendum ; reste prudent dans ses prêches.
Sait que Mohamed Islam et ses hommes sont des soufis guerriers (pas des anges selon lui), soupçonne des démons chez les mafieux tchétchènes et voit en Sergeï un djinn malsain. Peut arranger un entretien avec presque n'importe qui, même Mohamed Islam, s'il pense servir la paix. Sans le savoir, il est en lien avec les anges de Hassan.
${knows('colonel Bokonov, Mourad Kardanov, Mohamed Islam, Alexandre Sysoyev')}`,
});

// ---------------- Mafia tchétchène ----------------
const elBorak = npc('el-borak', {
  nom: 'El Borak (Abubakar Alkhazurov, « le raboteur »)', source: 'Démon de Majûj, grade 2, caïd de la mafia tchétchène', type: 'demon', car: car('3+ 5 2 3+ 2 4'), def: L('5+'),
  pp: 20, pfFix: 7, seuilsFix: seuils('5/11/16/22'),
  armes: [{ n: 'Rabot électrique', att: L(8), prec: -3, puis: 4, melee: true }, arme('Pistolet', 'Revolver gros calibre', 4)],
  pouvoirs: pows('Armure corporelle 2+, Arts martiaux 3, Barbarie 5*, Cauchemar 3, Détection du danger 2+, Lire les pensées 1+, Peur 2+'),
  talents: 'Combat 6 (armes improvisées 8), Corps à corps 7, Défense 5+, Discussion 4+, Fouille 3, Médecine 3, Savoir criminel 5+, Tir 3 (armes de poing 4), Torture 8',
  notes: `Tchétchène de 25 ans. Tyran du quartier de la rue Lénine, dernier démon musulman survivant de Groznyï. Défigure au rabot électrique ceux qui enfreignent ses règles. Fou à la perversité sans bornes mais pas idiot : jamais deux nuits au même endroit, toujours au moins dix gardes du corps drogués.
Croit Mohamed Islam ange de Khalid (sans preuve) ; sait Sergeï fou d'ésotérisme, a récupéré des restes de ses rituels mais n'y voit que du folklore. Prêt à s'allier avec quiconque veut détruire ou capturer Sergeï et le faire parler.
PP non donnés : 20 estimés (démon de grade 2). Pistolet estimé d'après Tir (armes de poing 4).
${knows('Hajj Zoumana, Mourad Kardanov')}`,
});
const mafTchet = npc('mafieux-tchetchenes', {
  nom: 'Mafieux tchétchènes', source: 'Gardes du corps et hommes de main d\'Alkhazurov', qty: 10, car: car('2 2+ 2+ 2+ 2 2'), def: L(2),
  pfFix: 4, seuilsFix: seuils('3/6/9/12'),
  armes: [arme('Fusil-mitrailleur', 'Fusil-mitrailleur', 3), arme('Couteau', 'Poignard ou saï', '2+')],
  talents: 'Baratin 2, Combat 1 (couteaux 2+), Corps à corps 2, Défense 2, Discrétion 1+, Fouille 3, Tir 1 (armes automatiques 3), Torture 2+',
  notes: 'Réputés les pires ordures de l\'ex-URSS : la torture est leur mode de négociation et tout ce qui est plus petit qu\'une Kalachnikov compte pour un canif. Les gardes d\'Alkhazurov sont camés et tarés.',
});

// ---------------- Séparatistes ----------------
const cat = npc('cat', {
  nom: 'Cat (Mohamed Islam)', source: 'Ange de Khalid, grade 2 (mosquée Al Watan)', type: 'ange', car: car('4 4 3 4 2+ 6+'), def: L(6),
  pp: 20, pfFix: 8, seuilsFix: seuils('7/14/21/28'),
  armes: [{ n: 'Tulwar magique', att: L(8), prec: 2, puis: 8, melee: true }, arme('Fusil-mitrailleur', 'Fusil-mitrailleur', 3)],
  pouvoirs: pows('Armure corporelle 4, Champ de force 2, Colère de Dieu 3*, Conversion physique 1, Détection des ennemis 3, Détection du mal 4, Esquive acrobatique 1, Volonté supra-normale 2'),
  talents: 'Combat 3 (épées 8), Corps à corps 3, Défense 6, Discrétion 4, Tir 3',
  notes: `Daghestanais de 28 ans, 1,95 m. Chef incontesté de la mosquée wahhabite Al Watan, financée par les Saoudiens. Fanatique : tout non-wahhabite est une créature du Malin. Cloîtré dans sa mosquée, il n'en sort que pour des attaques discrètes contre les non-wahhabites ; tolère à peine les boivikis, hait la mafia tchétchène.
Voit des démons partout : inutile pour l'enquête, mais partant pour toute expédition punitive contre une cible non wahhabite qu'on lui présente comme démoniaque.
PP non donnés : 20 estimés (ange de grade 2). Fusil-mitrailleur estimé (Tir 3).
${knows('imam Vasnadov, Hajj Zoumana, Nouredine El Khâdi')}`,
});
const moudjahidin = npc('moudjahidin', {
  nom: 'Moudjahidin', source: 'Wahhabites typiques', qty: 6, car: car('2 2+ 3 2 2 2+'), def: L('2+'),
  pfFix: 4, seuilsFix: seuils('3/6/9/12'),
  armes: [arme('Fusil-mitrailleur', 'Fusil-mitrailleur', '3+'), arme('Couteau', 'Poignard ou saï', 3), arme('Lance-roquettes antichar', 'Lance-roquettes antichar', '3+')],
  talents: 'Combat 1 (couteaux 3), Corps à corps 2, Défense 2+, Discrétion 3, Fouille 2, Survie 1+ (montagne 4+), Tir 1 (armes automatiques 3+)',
  notes: 'Fanatiques venus du monde entier (Algérie, Bosnie, Afghanistan…) ou Tchétchènes endoctrinés, financés par les Saoudiens. Élite des troupes, méprisent tous ceux qui ne pensent pas comme eux ; relations tendues avec boivikis et population.',
});
const boivikis = npc('boivikis', {
  nom: 'Boivikis', source: 'Combattants tchétchènes typiques', qty: 6, car: car('2+ 2+ 3 2+ 2 2'), def: L('2+'),
  pfFix: 5, seuilsFix: seuils('3/7/10/14'),
  armes: [arme('Fusil-mitrailleur', 'Fusil-mitrailleur', '3+'), arme('Couteau', 'Poignard ou saï', 3), arme('Lance-roquettes antichar', 'Lance-roquettes antichar', '3+')],
  talents: 'Combat 1 (couteaux 3), Corps à corps 2, Défense 2+, Discrétion 2+, Savoir militaire 1 (armée russe 1+), Survie 1 (montagne 4+), Tir 1 (armes automatiques 3+)',
  notes: 'Héritiers de siècles de résistance, maîtres de la guérilla de montagne, opiniâtres ; tiennent tête aux Russes jusqu\'en ville. Musulmans peu pratiquants : la religion n\'est pas leur moteur.',
});

// ---------------- Anges de Hassan ----------------
const ahmed = npc('ahmed', {
  nom: 'Ahmed (Nouredine El Khâdi)', source: 'Ange de Hassan, grade 2 (hôpital Khankala)', type: 'ange', car: car('2+ 2+ 3+ 5 4+ 4+'), def: L('3+'),
  pp: 20, pfFix: 7, seuilsFix: seuils('5/11/16/22'),
  pouvoirs: pows('Champ de force 3, Détection du mal 4, Lire les pensées 2+, Télépathie 3, Tolérance 3+*, Volonté supra-normale 2+'),
  talents: 'Baratin 4, Culture générale 3 (islam 8), Défense 3+, Discussion 7, Médecine 4, Séduction 2+',
  notes: `Marocain de 48 ans, frêle. Dirige depuis trois ans l'hôpital musulman sous les ordres de Salaam, mais passe son temps en palabres avec factions et donateurs. Déteste les armes, garde du corps depuis une agression, noie son stress dans l'alcool (mains tremblantes, collyre, maquillage).
Sait que Hajj Zoumana, Sysoyev et Mohamed Islam sont des anges ; doute que les démons soient derrière les mafias (les humains suffisent bien). A recueilli beaucoup de témoignages mais n'a rien noté, de peur de relancer les hostilités. Cherche la paix, ne serait-ce qu'avec sa conscience.
PP non donnés : 20 estimés (ange de grade 2).
${knows('Hajj Zoumana, Alexandre Sysoyev, Mourad Kardanov, imam Vasnadov')}`,
});
const sternberg = npc('sternberg', {
  nom: 'Sternberg (Hajj Zoumana)', source: 'Ange de Hassan, grade 1 (quartier Musorova)', type: 'ange', car: car('2+ 2+ 3+ 4 4 4+'), def: L('2+'),
  pp: 15, pfFix: 6, seuilsFix: seuils('5/11/16/22'),
  pouvoirs: pows('Champ de force 1, Charme 1, Lire les pensées 1, Sommeil 1, Télépathie 1, Tolérance 1*, Volonté supra-normale 1'),
  talents: 'Baratin 3, Culture générale 3 (islam 6), Défense 2+, Discussion 5, Médecine 3, Séduction 2+',
  notes: `Libanais de 47 ans, blond teint en brun. Sympathique et dévoué à la cause, mais partisan de la lutte armée contrairement à ses collègues : laisse volontairement filer des bavures pour peser sur les négociations. Dirige officieusement le quartier « diplomatique » séparatiste.
Passe-temps : la chasse aux démons de Ouikka chez les boivikis, avec un épais dossier sur ceux déjà tombés (grâce à lui et à Mohamed Islam). Contact principal et secret des boivikis à Groznyï, il coordonne embuscades et attentats contre l'avis de Salaam, qu'il juge lâche.
S'il soupçonne les PJ, il les fait passer pour des espions auprès des boivikis (embuscades, attentats). Refuse de parler avec des chrétiens, qu'il accuse d'avoir abandonné les musulmans au VIIIe siècle.
PP non donnés : 15 estimés (ange de grade 1).
${knows('Mohamed Islam, Nouredine El Khâdi, Alexandre Sysoyev')}`,
});
const salaam = npc('salaam', {
  nom: 'Salaam (Alexandre Borisovitch Sysoyev)', source: 'Ange de Hassan, grade 3 (palais Staline)', type: 'ange', car: car('2+ 2+ 4+ 6 6+ 6+'), def: L('4+'),
  pp: 30, pfFix: 8, seuilsFix: seuils('5/11/16/22'),
  pouvoirs: pows('Champ de force 3, Déphasage 3, Détection du mal 6, Lire les pensées 6+, Psychométrie 5, Régénération 3, Télépathie 6, Tolérance 6+*, Volonté supra-normale 6+'),
  talents: 'Baratin 7, Culture générale 5 (islam 9), Défense 4+, Discussion 9, Médecine 4, Séduction 3+',
  notes: `Tchétchène de 59 ans, diplomate né, au cœur du gouvernement prorusse ; dirige tous les anges musulmans de Tchétchénie depuis le palais Staline. Rêve de réconcilier chrétiens et musulmans et a envoyé l'émissaire au Paradis.
Ignore la mission des PJ mais guette tout signe d'activité angélique : avec ceux qu'il soupçonne d'être des anges, il joue cartes sur table (sous-entendus lourds, propositions à peine voilées). Des PJ subtils peuvent obtenir de lui un appui et des moyens énormes. Il n'a aucune preuve sur les forces surnaturelles côté russe mais fera tout pour en trouver.
PP non donnés : 30 estimés (ange de grade 3).
${knows('colonel Bokonov, Hajj Zoumana, Nouredine El Khâdi, Mourad Kardanov')}`,
});

// ---------------- Hôpital Sakaline ----------------
const tarkov = npc('tarkov', {
  nom: 'Docteur Christian Allanovitch Tarkov', source: 'Directeur de l\'hôpital Sakaline (ONG occidentales)', car: car('2 2 2 3+ 1+ 2'), def: L('1+'),
  pfFix: 5, seuilsFix: seuils('3/6/9/12'),
  talents: 'Baratin 2, Défense 1+, Discussion 3+, Hobby (marxisme-léninisme) 3+',
  notes: `31 ans. Marxiste-léniniste authentique et désabusé, persécuté par les Soviétiques. Son hôpital accueille tout le monde sans arme ; il a mis fin aux règlements de comptes en refusant les patients de la faction fautive. Seuls les wahhabites le vomissent encore.
Adore débattre (soirées de thé avec Blakanov). Prêt à partager ses preuves avec qui garantit l'anonymat et fera avancer les choses, jamais avec des fanatiques religieux. Milliers de photos et témoignages : exploits surhumains de Mohamed Islam au tulwar, rituels de Sergeï, atrocités d'Alkhazurov.
${knows('Blakanov, Mourad Kardanov, Alexandre Sysoyev')}`,
});

const asType = (x) => { const t = JSON.parse(JSON.stringify(x)); delete t.qty; t.id = 'type-' + x.id; return t; };
const inScene = (x, over = {}) => ({ ...JSON.parse(JSON.stringify(x)), id: x.id + '-' + (++n), typeId: 'type-' + x.id, ...over });
const choice = (key, q, opts) => ({ id: id('ch-' + key), q, opts: opts.map(([t, suite]) => ({ t, suite: suite || '' })), entry: null });
const scene = (key, nom, lieu, notes, npcs = [], combat = false, choix = []) => ({ id: id('sc-' + key), nom, lieu, notes, combat, npcs, live: null, choix });
const lieu = (pnj, liens, preuves, txt) => `PNJ : ${pnj}.\nLiens : ${liens}.\nPreuves : ${preuves}.\n\n${txt}`;

// ---------------- Tables ----------------
const COUVERTURES = `Couvertures et sympathie des factions (1 tirent à vue · 2 antipathie farouche · 3 mépris neutre · 4 a priori positif · 5 sympathie)
Codes : TR troupes russes · C collabos · B boivikis · M moudjahidin et wahhabites · MR mafia russe · MT mafia tchétchène · P population tchétchène. Deux valeurs : selon que les PJ se déclarent amis ou ennemis de la faction.
• Médecins d'une ONG : TR 2, C 2, B 3, M 2, MR 3, MT 3, P 5. + accès facile à peu près partout ; − on leur demandera vraiment de soigner.
• Journalistes occidentaux : TR 2, C 2, B 4, M 2, MR 1, MT 1, P 4. + quasi intouchables ; − risquent d'être pris à partie pour couvrir un événement.
• Journalistes musulmans : TR 2, C 2, B 4, M 4, MR 1, MT 1, P 4. + quasi intouchables ; − idem.
• Mercenaires : TR 1 ou 4, C 2 ou 4, B 1 ou 5, M 1, MR 3 ou 4, MT 2 ou 4, P 1. + droit de porter des armes, peuvent se vendre à une faction ; − loyauté douteuse, arrestation possible à tout moment.
• « Hommes d'affaires » : TR 5, C 4, B 3, M 1, MR 1 ou 5, MT 1 ou 5, P 1. + l'argent ouvre toutes les portes ; − se faire braquer.
• Organisation humanitaire occidentale : TR 2, C 3, B 4, M 3, MR 2, MT 2, P 5 ou 2. + quasi intouchables ; − mépris des populations proséparatistes.
• Organisation humanitaire musulmane : TR 2, C 3, B 3, M 5, MR 1, MT 1, P 5 ou 2. + quasi intouchables ; − mépris des populations prorusses.
Exemple : les troupes russes accueillent bien (4) des mercenaires venus les aider contre les terroristes, mais tirent à vue (1) sur un mercenaire soupçonné de travailler pour les séparatistes.`;

const MARCHE = `Marché noir caucasien (prix approximatif · délai d'obtention)
• Arme de poing (Tokarev) : 500 $ · 1 jour
• Fusil d'assaut (Kalachnikov) : 1 000 $ · 1d2 jours
• Lance-roquettes (RPG 7) : 2 500 $ · 1d6 jours
• Voiture normale (Lada) : 5 000 $ · 1 jour
• 4×4 japonais : 7 500 $ · 1d3 jours
• Faux papiers géorgiens, ingouches, daghestanais, arméniens ou tchétchènes : 5 000 $ · 1d3+1 jours
• Faux papiers russes : 10 000 $ · 1d6 jours
• Nourriture, matériel de camping, tente… : 1 000 $ · 1d3 jours
• Téléphone satellitaire : 10 000 $ · 1d6 jours
• Voyage en avion de tourisme : 2 000 $ · 1d3 jours
• Voyage en 4×4 par l'Ingouchie : 1 000 $ · 1 jour
• Voyage en 4×4 par le Daghestan : 2 000 $ · 1 jour
• Prostituées : 50 $ · immédiat
• Drogue : 100 $ · immédiat
• Matériel médical : 1 000 $ · 1d3 jours
Le séjour à Tbilissi dure de un à six jours selon le matériel demandé.`;

const EVENEMENTS = `Événements aléatoires en temps de guerre (2d6, « carte chance : vous n'avez pas de chance »)
• 2 Bombardement raté : un obus ou une roquette tombe tout près ; au choix du MJ, blessure de niveau de dommage 1d6+3.
• 3 Rafle prorusse : collabos ou mercenaires (parfois encadrés par le FSB) contrôlent les papiers, tuent ou arrêtent les suspects.
• 4 Prêche enflammé d'un imam de rue contre les infidèles, les États-Unis et la Russie chrétienne : la foule cherche un autodafé si on le laisse parler.
• 5 Convoi de la Croix-Rouge ou du Croissant-Rouge, escorté par des Russes, des collabos ou des boivikis.
• 6 Croisade orthodoxe : menés par un pope, des russophones rançonnent les « hérétiques » de leur quartier.
• 7 Combats de rue entre factions ennemies ; les balles perdues ne le sont pas pour tout le monde.
• 8 Enterrement russe ou tchétchène : ambiance lourde, la moindre provocation met le feu aux poudres.
• 9 Convoi ou poste d'une ONG humanitaire, menacé par une population à bout.
• 10 Rafle séparatiste : boivikis et/ou moudjahidin bouclent le secteur et contrôlent les motivations de chacun ; exécutions sommaires.
• 11 Les PJ tombent sur les restes d'une rafle de collabos ou d'un raid de moudjahidin : quelques survivantes pansent leurs blessures.
• 12 Tireur embusqué, ou faction ennemie, qui attaque sans prévenir.`;

const scenes = [
  scene('mission', '1. Mission prioritaire', 'Paris, puis hôtel Sheraton de Roissy-Charles-de-Gaulle – briefing à 6 h',
    `Appel urgent du contact des PJ : briefing au Sheraton de Roissy au plus tard le lendemain 6 h, juste avant le vol pour Tbilissi. Mission d'une durée indéterminée, venue directement d'un archange (Didier, qui veut le moins de monde possible au courant).
Contexte (à garder pour le MJ) : les anges musulmans, débordés, ont demandé l'aide du Paradis ; le Conseil s'est déchiré et Yves a ajourné le débat en laissant entendre que chacun était libre d'agir. Didier s'engouffre dans la brèche : avec des preuves irréfutables, il espère convaincre le Conseil d'aider les musulmans et renouer avec cette branche perdue.
But : rapporter des preuves irréfutables que les Russes sont noyautés ou aidés par des princes-démons « normaux » (côté tchétchène, tout le monde sait que les intégristes sont infiltrés par les princes-démons musulmans). Le témoignage des PJ ne suffira pas. Le temps est compté.
Matériel : environ 200 000 $ en liquide et des passeports suisses ; couverture libre, à trouver vite (le chargé de mission la transmet au contact sur place dès que les PJ sont dans l'avion).
Choix imposé : un seul contact, chrétien ou musulman, pour raisons politiques. Le contact ne cache pas son aversion pour l'option musulmane mais n'insiste pas. Aucune des deux n'est meilleure ; des joueurs débrouillards peuvent changer de camp en cours de route, mais le scénario prendra des voies différentes.`,
    [], false,
    [choice('contact', 'Quel contact les PJ choisissent-ils ?', [
      ['« Fromage » : Sulejman Sarovic (musulman)', 'Passage par l\'Ingouchie, matériel illimité sans bakchich. Meilleur accueil chez les séparatistes, méfiance côté russe.'],
      ['« Dessert » : Andranik Gougassian (chrétien)', 'Mini-jet de trafiquants ou route du Daghestan, bakchichs à prévoir. Meilleur accueil côté russe et orthodoxe, hostilité côté séparatiste.'],
    ])]),
  scene('tbilissi', '2. Tbilissi', 'Tbilissi (Géorgie), hôtel Sheraton – 1 à 6 jours',
    `Vol Air France sans histoire (sauf si le MJ veut glisser un démon de Ouikka à bord). Le contact attend à la descente d'avion et installe les PJ au Sheraton pour préparer la suite ; il peut leur faire découvrir la fête géorgienne.
Le séjour dure de un à six jours selon le matériel commandé : voir la table du marché noir dans les notes du scénario.
Le contact tolère les écarts de conduite (sexe, drogue…) sans rien dire, mais il traitera alors les PJ en clients et non en frères de combat.
Voyage :
• Andranik : mini-jet privé direct ou longue route par le Daghestan. Couverture en béton exigée face aux Russes, et pas d'armes, ou des bakchichs énormes : 1d6 × 100 $ par arme, jusqu'à 2d6 × 100 $ par RPG. Il veille au confort de ses clients.
• Sulejman : uniquement par l'Ingouchie, sans bakchich (un don à la cause est bienvenu).`,
    [inScene(sulejman), inScene(andranik)], false,
    [choice('voyage', 'Comment les PJ rejoignent-ils Groznyï ?', [
      ['Mini-jet de trafiquants', 'Rapide ; contrôles russes à l\'arrivée : la couverture doit tenir.'],
      ['4×4 par le Daghestan', 'Long voyage, barrages russes et bakchichs.'],
      ['4×4 par l\'Ingouchie', 'Avec Sulejman : secteurs rebelles, risque de mauvaise rencontre avec les Russes.'],
    ])]),
  scene('terminus', '3. Groznyï, terminus', 'Route du Caucase et entrée dans Groznyï',
    `Voyage à détailler selon le goût du MJ : son issue dépend du matériel transporté, de la crédibilité de la couverture, de l'argent distribué et des erreurs commises. Sauf énorme bêtise, les PJ arrivent à Groznyï ; les imprudents paient (tout s'achète, y compris la tranquillité).
Par la route : villages pillés et rasés, fosses communes, bandes de « mercenaires » dans le sillage des régiments, secteurs rebelles, carcasses de chars et d'hélicoptères ; paysage montagneux aride, froid sec, plus aucune infrastructure.
La ville : en ruines, quadrillée par militaires russes, mercenaires et milices collabos ; tireurs embusqués, embuscades de boivikis, mines, bombardements. Depuis le référendum truqué de 2002, le gouvernement prorusse sert de prétexte à éloigner les journalistes. Seuls refuges : villages isolés, bâtiments officiels et camps protégés par le FSB.
Barrage possible : soldats russes ou volontaires de la CEI.`,
    [inScene(soldats, { qty: 4 }), inScene(volontaires, { qty: 4 })]),
  scene('arrivee', '4. Quel beau temps pour la saison ! (enquête ouverte)', 'Groznyï, hôtel Lénine (place Lénine, centre russe) – boue de printemps',
    `Boue de printemps, froid, rues inondées et criblées d'obus. La ville est officiellement aux mains des Russes et du gouvernement prorusse ; la nuit, seuls les quartiers militaires et officiels sont à peu près sûrs, le jour des quartiers entiers sont tenus par les boivikis.
Sauf si les PJ rejoignent ouvertement la résistance, leur guide leur conseille l'hôtel Lénine, bâtisse stalinienne glaciale en plein centre russe (Sulejman y va à reculons).
Enquête ouverte, sans chronologie : la guerre continue sans eux. Aucune piste au départ : il faut demander au guide et aux factions s'ils ont entendu parler d'événements bizarres, voire satanistes. Les PJ doivent sentir qu'ils ne pèsent rien dans ce chaos.
Outils dans les notes du scénario : table des couvertures et sympathie des factions, table d'événements aléatoires (2d6) à tirer pendant les déplacements.
Chaque lieu suivant donne ses PNJ, ses liens (où les PNJ orientent les PJ après un bon roleplay) et ses preuves. Les preuves concernant des anges ne servent guère la mission ; la clé est la piste de Sergeï Lewenski, qui mène à Nisroch.
Forces en présence : environ 35 000 soldats russes (FSB, spetsnaz, division Dzerjinski) ; une cinquantaine de compagnies de volontaires ; collabos ; mafia russe (Nisroch, jamais sur place) ; boivikis du gouvernement libre de Maskhadov ; moudjahidin wahhabites ; mafia tchétchène ; population.
Surnaturel : une vingtaine d'anges de Khalid officiers chez les boivikis et surtout les moudjahidin ; une douzaine d'anges de Hassan dans les deux gouvernements (artisans manipulés du référendum) ; trois démons de Ouikka chez des montagnards ; une trentaine de démons de Majûj et Dajjâl dans la population et la mafia tchétchène ; quelques anges de Laurent, de Michel et de vieux anges de Georges côté russe ; Nisroch, inconnu même des autres démons.`),
  scene('kirov', '5. Camp Kirov, QG des troupes russes', 'Camp Kirov – QG russe pour toute la Tchétchénie',
    lieu('capitaine Boris Ivanovitch Stransky (Zverboy), colonel Piotr Sergeïevitch Bokonov', 'gouvernement tchétchène, mafia russe, basilique Saint Georges, mercenaires du stade Dinamo, mosquée Al Cairo, forces tchétchènes loyalistes',
      'présence d\'anges de Laurent et de Georges dans l\'armée et chez les volontaires ; intime conviction de présence angélique chez les musulmans ; soupçons de présence démoniaque dans la mafia tchétchène',
      `Plus grand centre militaire du pays, gros de la division Dzerjinski, prêt à mater une insurrection. Sécurité très stricte à l'entrée, mais une fois dedans le désordre permet de circuler avec un faciès slave ou occidental. Rencontrer des officiers supérieurs : payer gardes et sous-officiers ou trouver une bonne excuse.
Les militaires veulent une meilleure presse et des succès militaires : leur proposer de l'aide ouvre des portes ; parler misère et criminalité vaut au mieux une oreille sourde, au pire une expulsion.
Officiers : entre eux, rares pots-de-vin, surtout des tarifs préférentiels. Soldats et sous-officiers : relation symbiotique avec la mafia russe (protection, clientèle) ; attaquer la mafia, c'est attaquer l'armée.
Indice majeur : les archives de Bokonov (bureau et coffre-fort en ville) contiennent des photos des rituels et sacrifices de Sergeï.`),
    [inScene(zverboy), inScene(bokonov), inScene(soldats)]),
  scene('karpinka', '6. Caserne Karpinka, QG des forces tchétchènes', 'Caserne Karpinka',
    lieu('commandant Mourad Kardanov', 'forces russes régulières, gouvernement tchétchène, mosquée Al Cairo, mafia tchétchène, mafia russe, hôpital Khankala',
      'présence de satanisme au sein de la mafia russe',
      `Forces méprisées par la population, haïes des séparatistes, suspectes aux yeux des Russes ; bras armé du gouvernement officiel, elles gardent les bâtiments secondaires et maintiennent (mal) l'ordre. Corruption et désertions.
Kardanov se confie vite à des étrangers respectueux : la disparition du mafieux drogué qui parlait de prince-démon et de Grand Jeu, et les crucifixions macabres des hommes de Sergeï.`),
    [inScene(kardanov), inScene(collabos)]),
  scene('dinamo', '7. Stade Dinamo, camp des volontaires russes', 'Stade Dinamo',
    lieu('sergent Tuomas Holpainen (Nightwish), commandant Vladimir Ilitch Blakanov (Dubitchou), colonel Bokonov', 'mafia russe, forces russes régulières, hôpital Sakaline',
      'présence d\'anges de Georges ; intime conviction de présence angélique chez les wahhabites et démoniaque dans la mafia tchétchène',
      `Cour des miracles paranoïaque : attentats et règlements de comptes quotidiens. Une cinquantaine de compagnies rivales (de cent à plusieurs centaines d'hommes), dont la moitié en opération à tout moment. Temps libre : trafics, rue Pabody, raids meurtriers chez les musulmans.
Octobre Rouge (Tuomas) et Saint Georges (Blakanov) campent aux deux bouts du stade et se haïssent.
Entrer chez Octobre Rouge : aucune sélection, mais bizutage en première ligne lors d'une descente chez les séparatistes, sous l'œil de vétérans (plus de 80 % de pertes). Devenus potes, les PJ finissent au bar Vedeno avec Tuomas, qui peut les présenter à Sergeï.
Blakanov invite volontiers des PJ philosophes à ses soirées de thé avec Tarkov.`),
    [inScene(nightwish), inScene(dubitchou), inScene(volontaires)], true,
    [choice('octobre', 'Les PJ s\'engagent-ils dans la compagnie Octobre Rouge ?', [
      ['Oui, ils passent le bizutage', 'Descente meurtrière chez les séparatistes ; acceptés s\'ils survivent et se montrent impitoyables. Tuomas les mène au Vedeno et à Sergeï.'],
      ['Non, ils restent observateurs', 'Contacts plus froids ; il faudra une autre entrée vers la mafia russe.'],
    ])]),
  scene('pabody', '8. Rue Pabody, quartier chaud prorusse', 'Rue Pabody et bar Vedeno',
    lieu('Sergeï Vladimirovitch Lewenski', 'Nisroch, forces russes régulières, volontaires russes',
      'activités sataniques dans les mafias musulmane et russe',
      `Centre du quartier chaud, violence contenue par les mafieux, soucieux de leurs affaires. Le Vedeno (bar, bordel, restaurant, fumerie d'opium) accueille mercenaires, touristes, Tchétchènes et quelques militaires ; Sergeï le tient d'une main de fer.
Sergeï est la pièce maîtresse : il peut mener les PJ à Nisroch et son témoignage, enregistré proprement ou porté en France par lui-même, réussit la mission. Toujours escorté d'une dizaine d'hommes, se déplace en blindé. Face au surnaturel il panique, peut se confesser à des anges et, s'il les sait anges, il voudra traquer Alkhazurov avec eux pour sauver son âme.`),
    [inScene(sergei), inScene(mafRusses)], false,
    [choice('sergei', 'Que deviennent Sergeï et son témoignage ?', [
      ['Témoignage enregistré', 'Preuve solide pour la mission ; il peut encore les guider vers Nisroch.'],
      ['Sergeï ramené en France', 'Mission réussie en soi ; Nisroch apprendra vite la défection.'],
      ['Il les accompagne à Moscou', 'Approche de Nisroch facilitée ; il espère son salut.'],
      ['Il est tué ou s\'enfuit', 'Piste principale perdue : il faudra les archives de Bokonov ou de Tarkov.'],
    ])]),
  scene('kalinine', '9. Kalinine, quartier chaud des troupes russes', 'Quartier Kalinine',
    lieu('Sergeï Vladimirovitch Lewenski', 'voir rue Pabody', 'voir rue Pabody',
      `Version luxe et très protégée de la rue Pabody : bordels, tripots, fumeries d'opium et crack houses chics, gardés à tour de rôle par les troupes russes. Las Vegas post-apocalyptique du tiers-monde. Sergeï y soigne ses relations avec officiers et soldats (une dizaine d'établissements à lui).`),
    [inScene(sergei), inScene(mafRusses, { qty: 4 })]),
  scene('basilique', '10. Basilique Saint Georges', 'Basilique Saint Georges',
    lieu('pope Vlassov', 'forces russes régulières, volontaires russes',
      'rituels sataniques dans la mafia russe ; soupçons de démons dans la mafia tchétchène ; anges chez les wahhabites et dans les forces russes',
      `Le vieux pope a tout vu et ne s'étonne plus de rien. Gardien d'une mine de confessions, il se ferme comme une huître devant des Occidentaux qui semblent connaître le Grand Jeu et refuse de pactiser avec les « papistes ». Seul un roleplay intense lui fait dire ce qu'il sait.`),
    [inScene(vlassov)]),
  scene('alcairo', '11. Mosquée Al Cairo, modérée et progouvernementale', 'Mosquée Al Cairo et cafés voisins',
    lieu('imam Mohammed Vasnadov', 'forces armées russes, mosquée Al Watan, gouvernement tchétchène, forces armées tchétchènes',
      'présence d\'anges chez les wahhabites ; soupçons de démons musulmans chez les mafieux tchétchènes ; intime conviction de démons chrétiens chez les mafieux russes',
      `QG des musulmans modérés, entre séparatistes et loyalistes : débats vifs, jamais de débordement grâce au respect qu'inspire l'imam. Sécurité faible. Meilleure porte d'entrée vers le monde tchétchène non gouvernemental et ses éléments durs. Les mafieux tchétchènes, cibles de ses prêches, préfèrent le laisser faire.
Vasnadov peut organiser un entretien avec à peu près n'importe qui, Mohamed Islam compris, s'il y voit un pas vers la paix.`),
    [inScene(vasnadov)]),
  scene('lenine', '12. Rue Lénine, quartier chaud protchétchène', 'Quartier de la rue Lénine',
    lieu('Abubakar Alkhazurov (El Borak)', 'forces armées tchétchènes, boivikis, quartier séparatiste',
      'existence de démons dans la mafia ; soupçons d\'anges chez les wahhabites et de démons dans la mafia russe',
      `Enfer sur terre : pire de la mafia tchétchène, survivants noyés dans le vice, ruffians de tout poil. Ville dans la ville, avec ses lois ; tout le monde est surarmé, les solitaires ne font pas long feu.
Alkhazurov règne par la terreur et ses bavures nourrissent sa légende. Il s'allie volontiers à qui veut détruire ou capturer Sergeï. Tuer ce démon peut plaire à Sergeï (qui rêve de le crucifier) et compter dans le bilan face à Nisroch.`),
    [inScene(elBorak), inScene(mafTchet)], true,
    [choice('alkhazurov', 'Quelle attitude face à Alkhazurov ?', [
      ['Alliance contre Sergeï', 'Il fournit hommes et informations ; les PJ risquent de perdre leur témoin principal.'],
      ['Ils l\'éliminent', 'Combat sanglant contre ses gardes ; Sergeï leur en sera reconnaissant.'],
      ['Ils l\'évitent', 'Pas de conflit immédiat ; il fait surveiller ces étrangers.'],
    ])]),
  scene('alwatan', '13. Mosquée Al Watan, mosquée wahhabite', 'Mosquée Al Watan',
    lieu('Mohamed Islam (Cat)', 'boivikis et autres séparatistes, mosquée Al Cairo, hôpital musulman',
      'existence d\'anges musulmans chez les wahhabites',
      `Forteresse de l'intégrisme financée par les associations caritatives saoudiennes ; populaire grâce à son aide matérielle et à ses prêches véhéments. Mohamed Islam, jugé extrémiste même par ses coreligionnaires, n'aidera pas l'enquête mais participera à toute action punitive contre une cible non wahhabite présentée comme démoniaque (Alkhazurov, Sergeï…). Peut tourner au combat si les PJ se montrent « impies ».`),
    [inScene(cat), inScene(moudjahidin)]),
  scene('sakaline', '14. Hôpital Sakaline, ONG occidentales', 'Hôpital Sakaline',
    lieu('docteur Christian Allanovitch Tarkov', 'gouvernement tchétchène, collabos, forces armées russes',
      'perversité d\'Alkhazurov, rituels sataniques de Sergeï, fanatisme wahhabite de Mohamed Islam',
      `Havre de paix financé par les ONG et l'Union européenne : tous les patients sont admis, aucune arme n'entre. Personnel international épuisé mais moral bon, résultats excellents ; seuls les wahhabites le dénoncent.
Tarkov partage volontiers sa collection de photos et de témoignages avec des libres penseurs qui garantissent son anonymat : une mine de preuves.`),
    [inScene(tarkov)]),
  scene('khankala', '15. Hôpital Khankala, ONG musulmanes', 'Hôpital Khankala',
    lieu('Nouredine El Khâdi (Ahmed)', 'forces tchétchènes, mosquée Al Cairo, boivikis, gouvernement tchétchène',
      'exactions sordides d\'Alkhazurov ; présence d\'anges au sein des gouvernements pro et antirusses',
      `Pendant musulman de Sakaline, financé par les wahhabites, des États et des ONG musulmanes : chaque donateur impose sa version de l'islam, l'hôpital est mal dirigé. N'admet que les musulmans approuvés par les milices wahhabites qui le « protègent ». Racket, corruption, trafics ; la mafia tchétchène y entre discrètement.`),
    [inScene(ahmed)]),
  scene('musorova', '16. Musorova, quartier proséparatiste', 'Quartier Musorova',
    lieu('Hajj Zoumana (Sternberg)', 'mosquée Al Watan, mosquée Al Cairo, hôpital musulman, gouvernement loyaliste',
      'existence des anges de Hassan ; soupçons de démons de Ouikka chez les boivikis des montagnes',
      `Quasi-havre séparatiste où l'armée russe entre rarement ; les boivikis y viennent voir leur famille et se reposer. Représentation diplomatique officieuse de Maskhadov, tolérée par les anges de Hassan et le colonel Bokonov ; neutralité de façade qui n'empêche pas les trafics. Un Occidental ou un prorusse seul a peu de chances d'en ressortir vivant.
Si les PJ veulent chasser les démons de Ouikka, ils quittent la ville et le scénario : au MJ d'improviser une intrigue dans les montagnes. Si Hajj Zoumana les soupçonne, il les dénonce comme espions aux boivikis.`),
    [inScene(sternberg), inScene(boivikis)], false,
    [choice('zoumana', 'Hajj Zoumana soupçonne-t-il les PJ ?', [
      ['Non', 'Il les laisse circuler dans le quartier.'],
      ['Oui', 'Il les fait passer pour des espions auprès des boivikis : embuscades et attentats très meurtriers.'],
    ])]),
  scene('staline', '17. Palais Staline, siège du gouvernement tchétchène', 'Palais Staline',
    lieu('Alexandre Borisovitch Sysoyev (Salaam)', 'forces russes, quartier séparatiste, mosquée El Cairo',
      'anges de Hassan et de Khalid chez les musulmans ; très forts soupçons de présence angélique chez les Russes et de démons dans leur mafia',
      `Blockhaus de béton soviétique posé sur des dizaines de maisons dynamitées. Gardé par la division Dzerjinski, rempli de collabos, de mercenaires et de gardes du corps : contrôles très sévères, entrée quasi impossible sans autorisation. Siège du gouvernement fantoche et QG des anges musulmans.
Salaam, à l'affût de tout envoyé occidental, peut offrir appui et moyens énormes à des PJ subtils.`),
    [inScene(salaam), inScene(collabos, { qty: 4 }), inScene(soldats, { qty: 4 })]),
  scene('moscou', '18. Moscou', 'Moscou – grands restaurants, gratte-ciel stalinien de Strachnoff',
    `Avec des preuves sur les agissements démoniaques et la piste de Nisroch (Strachnoff), les PJ partent pour Moscou ; voyage calme ou mouvementé selon le sadisme du MJ.
Strachnoff fréquente la jet-set mafio-politico-industrielle et les grands restaurants, toujours flanqué de gardes du corps monstrueux. Il peut accorder une entrevue sur une excuse en béton ; l'aide de Lewenski est précieuse. Curieux, il ne soupçonne pas d'anges et se croit à l'abri de simples humains.
Le MJ s'adapte aux idées des joueurs, sévère mais juste. Coffre-fort de son appartement : drogue, argent, dossiers mafieux et documents démoniaques de Trads (preuves décisives).
Tôt ou tard les PJ l'accusent d'être un démon : passer à la scène finale.`,
    [inScene(nisroch), inScene(soldats, { nom: 'Gardes du corps de Strachnoff', source: 'Anciens militaires surarmés', qty: 6 })]),
  scene('finale', '19. C\'est la scène finale !', 'Moscou, face à Nisroch',
    `Nisroch réagit d'abord en humain, au point d'en être presque schizophrène. Menacé ou témoin de pouvoirs angéliques, il redevient prince-démon : il se dit retraité, humble homme d'affaires marié et père de famille, qui ne fait pas plus de mal qu'un grand patron. Il veut la paix et offre les preuves qu'ils cherchent en échange de sa tranquillité. Peu d'anges acceptent, mais face à un prince-démon surarmé et bien gardé, on réfléchit : jouer la négociation surréaliste, façon film de parrain.
Issues (voir choix) ; dans le background officiel, Nisroch reviendra sur le devant de la scène en ajoutant son empire terrestre à son empire démoniaque.`,
    [inScene(nisroch), inScene(soldats, { nom: 'Gardes du corps de Strachnoff', source: 'Anciens militaires surarmés', qty: 6 })], true,
    [choice('issue', 'Comment se termine la confrontation avec Nisroch ?', [
      ['Laissé en paix, aucune preuve', 'Défaite totale : −4 à −6 PA. Nisroch continue de faire le Mal à grande échelle.'],
      ['Laissé en paix, avec preuves', 'Selon les preuves : défaite mineure (−1 à −3 PA) ou victoire mineure (+1 à +3 PA).'],
      ['Tué', 'Des années pour revenir, empires terrestre et démoniaque en déliquescence : victoire majeure (+4 à +6 PA) avec preuves, sinon victoire mineure (+1 à +3 PA).'],
      ['Forcé de rentrer en Enfer', 'Il revient furieux sur la scène du Mal et de la drogue : victoire mineure ou majeure (+1 à +6 PA) selon les preuves.'],
      ['Les PJ perdent le combat', 'Pas de preuves, Nisroch furieux sort de sa réserve : défaite majeure (−1 à −6 PA).'],
    ])]),
];

const scenario = {
  id: 'mv2-notre-peuple-vaincra',
  nom: 'Livret MV – Notre peuple vaincra !',
  resume: 'Scénario de Magna Veritas, enquête ouverte en pleine guerre de Tchétchénie. Sur ordre de Didier, les PJ partent par Tbilissi pour Groznyï avec 200 000 $ et un contact chrétien ou musulman à choisir, afin de rapporter des preuves que les Russes sont aidés par un prince-démon. Au fil des factions, quartiers chauds et hôpitaux, la piste du mafieux Sergeï Lewenski mène jusqu\'à Moscou et à Nisroch, prince-démon qui joue les retraités humains.',
  notes: `Source : ${REF}. Ton très satirique et politiquement incorrect, à doser selon la table.

Histoire secrète (résumé) :
• Nisroch, prince-démon le plus récemment promu, s'ennuie : il laisse les affaires à son bras droit Trads et part vivre en humain en Russie sous le nom de Nickolaï Strachnoff. Il bâtit un conglomérat militaro-médiatico-industriel, revient au trafic de drogue (surnom : « le cruel »), épouse en 1996 Loubiana, ex-mannequin biélorusse, et vit en famille à Moscou.
• Les autres princes le croient perdu dans un « trip » ; personne ne s'en soucie.
• Deuxième guerre de Tchétchénie : troupes d'élite russes, volontaires de la CEI sans foi ni loi ; les extrémistes musulmans affluent. Voyant les anges musulmans soutenir les Tchétchènes, Nisroch renforce son soutien aux Russes et ses trafics à Groznyï (armes, drogue, prostitution, jeux) via Sergeï Lewenski, qui lui a vendu son âme.
• Les anges musulmans, acculés, demandent l'aide du Paradis. Le Conseil se déchire (pour : Didier, Yves, Jordi, Novalis, Mathias ou Emmanuel, Christophe, Jean-Luc, Janus, Blandine, Francis, Marc, Guy, Jean ; les autres contre). Yves ajourne en laissant chacun libre ; Didier envoie les PJ.

Déroulement : briefing → Tbilissi (contact, matériel) → voyage → Groznyï, enquête ouverte dans 13 lieux (scènes 5 à 17, dans l'ordre que choisissent les PJ) → Moscou → scène finale.
Preuves utiles : témoignage enregistré de Sergeï (ou Sergeï ramené en France), archives de Bokonov, photos de Tarkov, documents du coffre de Nisroch.

${COUVERTURES}

${MARCHE}

${EVENEMENTS}

Récompenses (scène finale) :
• Nisroch laissé en paix sans preuve : défaite totale, −4 à −6 PA
• Laissé en paix avec preuves : −1 à −3 PA ou +1 à +3 PA selon les preuves
• Tué : +4 à +6 PA avec preuves, sinon +1 à +3 PA
• Renvoyé en Enfer : +1 à +6 PA selon les preuves
• Défaite des PJ : −1 à −6 PA

Nouveaux pouvoirs du scénario (déjà dans les règles de l'appli) : Barbarie (Majûj), Colère de Dieu (Khalid), Colère divine (Georges), Tolérance (Hassan).
Fiches : caractéristiques en niveaux du livre (Ch des humains reportée en Foi). PP des anges de Khalid et de Hassan et du démon de Majûj non donnés : estimés selon le grade. Armes non précisées des anges russes estimées d'après leurs talents. Nisroch n'a pas de caractéristiques.`,
  scenes, createdAt: Date.now(), updatedAt: Date.now(),
};

const bestiaire = [sulejman, andranik, zverboy, bokonov, soldats, volontaires, kardanov, collabos, nightwish, dubitchou, sergei, mafRusses, nisroch,
  vlassov, vasnadov, elBorak, mafTchet, cat, moudjahidin, boivikis, ahmed, sternberg, salaam, tarkov].map(asType);
const known = new Set(R.POUVOIRS.map((p) => p.n.toLowerCase()));
const unknown = [...new Set(bestiaire.flatMap((t) => t.pouvoirs.map((p) => p.n)).filter((x) => !known.has(x.toLowerCase())))];
if (unknown.length) console.warn('Pouvoirs absents des règles :', unknown.join(', '));
writeFileSync(out, JSON.stringify({ format: 'insmv-scenario', version: 1, scenarios: [scenario], bestiaire, memoire: [] }, null, 2), 'utf8');
console.log('OK', out, scenes.length, 'scènes,', bestiaire.length, 'types');
