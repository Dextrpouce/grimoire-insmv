// Manuels utilisateur, ouverts par le bouton « ? » en haut de l'écran :
// MANUEL_JOUEUR depuis la fiche de personnage, MANUEL_MJ depuis le mode maître de jeu.
// Chaque rubrique : { id, titre, html }. Le HTML est écrit ici (pas de données utilisateur).
export const MANUEL_JOUEUR = [
  { id: 'debut', titre: 'Premiers pas', html: `
    <p>Le Grimoire crée et gère tes personnages d'<b>In Nomine Satanis / Magna Veritas</b> (4<sup>e</sup> édition). Tout est enregistré <b>sur ton appareil</b> et l'appli fonctionne <b>sans internet</b> une fois ouverte une première fois.</p>
    <ul>
      <li><b>Créer un personnage</b> : sur l'accueil, ou menu ⋮ › Nouveau personnage.</li>
      <li><b>Changer de personnage</b> : touche le nom en haut (ou l'icône dossier). Tes personnages sont rangés <b>par table de jeu</b>, puis « Sans table » ; « Nouveau personnage dans cette table » le crée et le partage tout de suite avec le MJ.</li>
      <li><b>Menu ⋮</b> (en haut à droite) : export, import, impression, mode maître de jeu, sauvegarde en ligne, suppression.</li>
      <li>En bas, les onglets <b>Fiche</b>, <b>Combat</b>, <b>Sac</b>, <b>Pouvoirs</b>, <b>Carnet</b> et <b>Biblio</b>.</li>
    </ul>
    <p class="small muted">Le mode maître de jeu est réservé au MJ ; il a son propre manuel (bouton « ? » dans le mode MJ).</p>` },
  { id: 'installer', titre: 'Installer l\'appli sur l\'écran d\'accueil', html: `
    <ul>
      <li><b>iPad / iPhone</b> : ouvre l'adresse dans Safari › bouton <b>Partager</b> (carré avec une flèche) › <b>Sur l'écran d'accueil</b> › Ajouter.</li>
      <li><b>Android</b> : menu de Chrome (⋮) › <b>Ajouter à l'écran d'accueil</b> ou <b>Installer l'application</b>.</li>
      <li><b>Ordinateur</b> : dans Chrome ou Edge, icône d'installation à droite de la barre d'adresse.</li>
    </ul>
    <p class="small muted">Sur iPad, les données de l'appli installée sont séparées de celles de Safari : installe-la d'abord, puis crée tes personnages dedans (ou passe par la sauvegarde en ligne, ou l'export / import).</p>` },
  { id: 'creation', titre: 'Créer un personnage', html: `
    <ul>
      <li><b>Création rapide</b> : ange ou démon › profil › supérieur › spécialités et langues › deux pouvoirs tirés au d66. Idéal pour commencer.</li>
      <li><b>Création intermédiaire</b> : la création rapide, puis des retouches avec les mêmes PA.</li>
      <li><b>Création sur mesure</b> : 100 PA (ange) ou 80 PA (démon) à répartir avec + et –. Le bandeau du haut indique les PA restants et vérifie les quotas.</li>
    </ul>
    <p>La création sur mesure propose aussi les <b>autres personnages</b> : humains, serviteurs et soldats de Dieu, morts-vivants, familiers, psioniques, héros païens, renégats, fées…</p>` },
  { id: 'fiche', titre: 'La fiche et ses trois modes', html: `
    <p>Le bouton à côté du dé, en haut, change le mode de la fiche :</p>
    <ul>
      <li><b>Jeu</b> : tout est verrouillé ; <b>toucher une valeur lance un test</b>.</li>
      <li><b>PA</b> : dépenser les points d'administration gagnés en partie (caractéristique 2 PA/rang, talent 1 PA, pouvoir selon son coût, PP 1 PA), dans les limites du grade.</li>
      <li><b>Libre</b> : corriger ou recopier un personnage existant, sans coût.</li>
    </ul>
    <p>Les valeurs annexes (PF, PP, seuils de blessure) sont calculées automatiquement.</p>` },
  { id: 'des', titre: 'Lancer les dés', html: `
    <ul>
      <li>Touche une caractéristique, un talent ou un pouvoir sur la fiche (mode Jeu), ou l'icône <b>dé</b> en haut pour un lancer libre.</li>
      <li>Choisis la <b>difficulté</b>, les modificateurs et la <b>prise de risque</b> ; le malus des blessures ouvertes est appliqué tout seul.</li>
      <li>L'appli lance le d66+6 : les deux premiers dés forment le résultat (à comparer au seuil), le troisième est le <b>RU</b>. Elle calcule la marge de réussite, les doubles et triples (avec la Foi ou la Chance), et le 111 / 666 selon ton camp.</li>
    </ul>
    <p class="small muted">Les règles complètes (table Unique-Multiple, difficultés, MR, combat) sont dans l'onglet <b>Biblio › Règles</b>.</p>` },
  { id: 'combat', titre: 'Combat, blessures et pouvoirs', html: `
    <ul>
      <li><b>Combat</b> : jauges de PF et de PP, blessures, attaque avec les armes <b>en main</b> (niveau de dommage calculé), défense, protection portée et <b>pouvoirs de combat</b> (attaques, protections, bonus) avec leur coût en PP.</li>
      <li><b>Effets actifs</b> : « Activer » sur Armure corporelle, Furie, Feu prométhéen, Esquive acrobatique… crée un effet en cours, affiché dans la carte État (Renouveler, Arrêter). Chaque carte montre en violet ce qui s'y applique et l'applique : puissance, précision et Force dans Attaques, colonnes de Défense au jet de défense (Esquive : seulement le prochain), protection dans la carte Protection et dans « Encaisser un coup » (décoche un pouvoir qui ne protège pas contre ce type de coup). États : étourdi à 0 PF, assommé à −5.</li>
      <li><b>Sac</b> : ajouter ou retirer des armes (« En main » ou « Rangée »), des armures et boucliers (« Portée » ou « Rangée »), l'équipement avec sa quantité, et les possessions (biens, planques, contacts).</li>
      <li><b>Encaisser un coup</b> : saisis les dégâts reçus, l'appli trouve la gravité d'après tes seuils, coche la blessure et retire les PF.</li>
      <li>Une blessure se referme par la Médecine ou en dépensant des PP.</li>
      <li><b>Pouvoirs</b> : description de chaque pouvoir, bouton <b>Activer</b> qui dépense les PP, test de pouvoir.</li>
    </ul>` },
  { id: 'carnet', titre: 'Carnet et supérieur', html: `
    <ul>
      <li>Identité, supérieur, grade et notes (les possessions sont dans le Sac).</li>
      <li>Bouton <b>Invoquer</b> : test de Foi contre la difficulté de ton supérieur, avec les modificateurs du livre.</li>
      <li>Points d'administration avec historique, avertissements et blâmes (avec les tirages du livre).</li>
      <li>Carte <b>Table de jeu</b> : pour partager ta fiche avec le maître de jeu (voir plus bas).</li>
    </ul>` },
  { id: 'sync', titre: 'Sauvegarde en ligne et connexion', html: `
    <p>La pastille ronde en haut indique l'état de la sauvegarde en ligne :</p>
    <ul>
      <li><b>verte</b> : synchronisé ;</li>
      <li><b>dorée</b> : modifications en cours d'envoi ;</li>
      <li><b>rouge</b> : pas connecté ou erreur — touche-la pour te connecter.</li>
    </ul>
    <p>Connexion avec un <b>compte Google</b>, ou avec un <b>e-mail et un mot de passe</b> (n'importe quelle adresse : iCloud, Gmail, Outlook…). Pas encore de compte ? « Créer un compte » dans la fenêtre de connexion. Mot de passe oublié ? Le lien envoie un e-mail de réinitialisation.</p>
    <p>Une fois connecté, tes personnages se retrouvent sur tous tes appareils. Sans compte, tout fonctionne quand même, mais seulement sur cet appareil.</p>` },
  { id: 'table', titre: 'Partager sa fiche avec le MJ', html: `
    <ol>
      <li>Le maître de jeu te donne le <b>code de la table</b> (6 lettres et chiffres).</li>
      <li>Dans le <b>Carnet</b> de ton personnage, carte « Table de jeu », saisis le code et touche <b>Partager ma fiche</b>.</li>
      <li>Ta fiche apparaît chez le MJ et se met à jour toute seule pendant la partie.</li>
    </ol>
    <p class="small muted">Il faut être connecté (Google ou e-mail). Tu peux garder tes notes privées : elles ne sont alors pas envoyées au MJ.</p>` },
  { id: 'fichiers', titre: 'Export, import et impression', html: `
    <ul>
      <li><b>Exporter</b> (menu ⋮) : un fichier JSON d'un personnage ou de tous, pour faire une copie ou l'envoyer à quelqu'un.</li>
      <li><b>Importer un fichier</b> : récupère des personnages exportés.</li>
      <li><b>Imprimer la fiche</b> : version papier simplifiée.</li>
    </ul>` },
  { id: 'faq', titre: 'Problèmes fréquents', html: `
    <ul>
      <li><b>Mes personnages ont disparu sur un autre appareil</b> : connecte-toi avec le même compte (pastille en haut), ils reviennent.</li>
      <li><b>L'appli ne montre pas les nouveautés</b> : ferme-la complètement et rouvre-la avec internet (parfois deux fois).</li>
      <li><b>La connexion Google ne revient pas à l'appli (iPad)</b> : utilise plutôt un e-mail et un mot de passe.</li>
      <li><b>« Accès refusé » ou « Hors ligne »</b> : vérifie ta connexion internet, puis touche la pastille pour réessayer.</li>
    </ul>` },
];

export const MANUEL_MJ = [
  { id: 'acces', titre: 'Accéder au mode MJ', html: `
    <ul>
      <li>Bouton <b>Mode maître de jeu</b> sur l'accueil, ou menu ⋮ › Mode maître de jeu.</li>
      <li>Si un <b>mot de passe MJ</b> est défini, il est demandé une seule fois par appareil.</li>
      <li>La <b>croix</b> en haut du mode MJ le reverrouille sur cet appareil : pratique avant de prêter sa tablette à un joueur.</li>
      <li>Le <b>nom de la table</b> en haut (ou l'icône dossier) ouvre le sélecteur : « Mener la partie » sur une autre de tes tables, ou retour à un de tes personnages. « Quitter le mode MJ » ramène à l'écran joueur.</li>
      <li>Depuis l'écran joueur, le même sélecteur propose <b>Mener la partie</b> sur chaque table dont tu es le MJ.</li>
    </ul>
    <p class="small muted">Choisir ou changer le mot de passe : <code>node tools/mj-motdepasse.mjs</code> dans le dossier du projet, puis publier (voir le README).</p>` },
  { id: 'table', titre: 'Créer une table et inviter les joueurs', html: `
    <ol>
      <li>Connecte-toi (pastille en haut de l'écran joueur, compte Google ou e-mail).</li>
      <li>Onglet <b>Joueurs</b> (sans table ouverte) : donne un nom (campagne ou groupe) et touche <b>Créer</b>.</li>
      <li>Donne le <b>code</b> affiché (bouton <b>Copier</b>) à tes joueurs : ils le saisissent dans le Carnet de leur personnage, carte « Table de jeu », puis « Partager ma fiche ».</li>
    </ol>
    <p><b>Sur un autre appareil</b>, tes tables de MJ réapparaissent toutes seules dans le sélecteur une fois connecté avec le même compte. Sinon, saisis le code dans « Retrouver une table » (seulement avec le compte qui a créé la table).</p>` },
  { id: 'suivi', titre: 'Suivre les fiches en direct', html: `
    <ul>
      <li><b>Vue d'ensemble</b> : PF et PP actuels, blessures ouvertes et malus, Défense, Perception, Volonté, Foi, seuils de blessure, limitations.</li>
      <li><b>Comparatif</b> : caractéristiques et talents clés du groupe dans un tableau ; toucher une valeur lance le test <b>en secret</b>, avec le malus de blessure du personnage.</li>
      <li><b>Fiche détaillée</b> (toucher le nom) : identité, supérieur, talents, pouvoirs, armes (attaque lançable), protections, possessions, notes du joueur s'il ne les garde pas privées.</li>
      <li><b>Notes de MJ</b> par personnage : privées, gardées sur ton appareil uniquement.</li>
      <li>« Changer de table » pour passer à une autre campagne ; la corbeille oublie une table sur cet appareil.</li>
    </ul>` },
  { id: 'scenarios', titre: 'Scénarios et scènes', html: `
    <ul>
      <li>Onglet <b>Scénarios</b> : synopsis, secrets du MJ, scènes (lieu, déroulement) et combats préparés. Tout fonctionne <b>sans connexion</b> et reste sur ton appareil.</li>
      <li><b>Scénarios des livres</b> : la bibliothèque des scénarios publiés, classés par livre avec recherche ; un toucher en ajoute une copie à « Mes scénarios ».</li>
      <li>Dans une scène, prépare les <b>choix possibles</b> (dilemme et options) : le jour de la partie, touche l'option choisie et elle est notée dans la mémoire de la campagne.</li>
      <li><b>Où en est la partie</b> : <b>Jouer cette scène</b> la marque « en cours » (celles d'avant passent « jouées »), <b>Scène suivante</b> avance d'un cran. La scène en cours s'affiche en tête du scénario, dans la liste des scénarios et en premier dans l'onglet Combat. Lancer le combat d'une scène en fait aussi la scène en cours.</li>
      <li><b>Tables aléatoires</b> : les tables écrites pour un scénario des livres (événements en temps de guerre, incidents du Centre de Tri, Chez Régis, rumeurs sur les Pink Queens) apparaissent d'elles-mêmes dans ce scénario. <b>Table aléatoire</b> accroche n'importe quelle table d'Outils au scénario ou à une scène, pour la tirer sans quitter la partie.</li>
      <li>Export / import d'un scénario en fichier JSON (il emporte les choix qui le concernent).</li>
    </ul>` },
  { id: 'pnj', titre: 'PNJ et bestiaire', html: `
    <ul>
      <li>Chaque combat liste ses adversaires : attaques, Défense, Volonté, Foi, Perception, seuils BL/BG/BF/MS et PF (calculés selon le type, modifiables), PP, protection, pouvoirs, talents utiles.</li>
      <li>Un PNJ peut être repris d'un personnage du Grimoire.</li>
      <li>Le <b>bestiaire</b> (onglet <b>Outils</b>) garde les types d'ennemis réutilisables : prépare-les une fois, puis ajoute-les à une scène en choisissant combien il en faut.</li>
      <li><b>PNJ rapide</b> : un ange ou un démon type de n'importe quel supérieur, de 10 PP (grade 0) à 40 PP (grade 3), un psionique (par conpsi) ou un héros païen (par panthéon), débutant ou confirmé, ou un humain ou une créature type des livres.</li>
      <li><b>Bestiaire des livres</b> : plus d'une centaine d'adversaires prêts à l'emploi, avec la page de référence.</li>
      <li>Le bestiaire s'exporte et s'importe en fichier.</li>
    </ul>` },
  { id: 'combat', titre: 'Mener un combat', html: `
    <ol>
      <li>Onglet <b>Combat</b> : reprends un combat en cours, lance un combat préparé, ou un <b>combat improvisé</b> (adversaires tirés du bestiaire ou PNJ rapide). Depuis une scène, <b>Lancer le combat</b> ouvre aussi cet onglet.</li>
      <li><b>Initiative</b> : Agilité, Volonté ou Perception, situation de surprise ; l'ordre du tour s'affiche avec les PJ de la table, <b>Tour suivant</b> passe au suivant (et au round suivant). Touche un résultat pour saisir la MR annoncée par un joueur.</li>
      <li>Pour chaque adversaire : jets d'attaque (niveau de dommage calculé) et de défense, pouvoirs (PP dépensés), <b>Encaisser un coup</b> (gravité et PF retirés d'après ses seuils).</li>
      <li>Compteur de rounds, <b>renforts</b> à ajouter en cours de route, rappel des PJ de la table ouverte.</li>
      <li><b>Noter un choix</b> pendant le combat, pour la mémoire de la campagne.</li>
    </ol>
    <p class="small muted">Pense à prévenir les joueurs des PNJ à Esquive acrobatique ou Volonté supra-normale (rappel affiché). Les règles de combat sont sur l'écran joueur, Biblio › Règles.</p>` },
  { id: 'memoire', titre: 'Journal (choix des joueurs)', html: `
    <ul>
      <li>Onglet <b>Journal</b> : la mémoire de la campagne, <b>propre à chaque table</b>. Les choix notés quand une table est ouverte lui sont rattachés ; « Toutes les tables » montre tout le journal.</li>
      <li>Note ce que les PJ ont fait ou décidé : choix, promesse, dette ou faveur, ennemi, allié, secret découvert, affaire avec le supérieur, mort.</li>
      <li>Indique les personnages concernés et la <b>suite</b> à leur faire vivre : tant qu'elle n'est pas refermée, c'est un <b>fil en suspens</b>.</li>
      <li>Choisis le scénario où le faire ressortir : il s'affichera en tête de ce scénario.</li>
      <li>Filtres par personnage et par scénario ; <b>Refermer le fil</b> en notant comment il s'est terminé.</li>
      <li>Le journal s'exporte et s'importe.</li>
    </ul>` },
  { id: 'tables', titre: 'Tables aléatoires', html: `
    <ul>
      <li>Onglet <b>Outils</b>, carte Tables aléatoires : les tables des livres, classées par rubrique, avec recherche et filtre par camp.</li>
      <li><b>Tirer</b> donne le résultat (avec le modificateur au jet quand la table en prévoit), <b>Relancer</b> pour un autre tirage.</li>
      <li><b>Noter dans le journal</b> ajoute le résultat à la mémoire de la campagne.</li>
    </ul>` },
  { id: 'des', titre: 'Lancer les dés', html: `
    <p>L'icône <b>dé</b> en haut ouvre le lanceur libre (1d6, 2d6, d66, d666, ou un test sur la table Unique-Multiple). Dans le comparatif et les fiches, toucher une valeur lance le test du personnage en secret.</p>` },
  { id: 'faq', titre: 'Problèmes fréquents', html: `
    <ul>
      <li><b>Je ne vois pas les fiches des joueurs</b> : vérifie que tu es connecté, qu'ils ont saisi le bon code et touché « Partager ma fiche », et qu'ils sont connectés eux aussi.</li>
      <li><b>« Seul le compte qui a créé cette table… »</b> : reconnecte-toi avec le compte utilisé pour créer la table.</li>
      <li><b>Mes scénarios ne sont pas sur ma tablette</b> : ils restent sur l'appareil où ils ont été créés ; passe par l'export / import du scénario.</li>
      <li><b>« Limite gratuite de Firebase atteinte »</b> : réessaie le lendemain.</li>
    </ul>` },
];
