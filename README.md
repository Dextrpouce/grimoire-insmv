# Grimoire INS/MV — Feuille de personnage In Nomine Satanis / Magna Veritas 4e

Application pour téléphone, tablette et ordinateur qui crée et gère tes personnages d'**In Nomine Satanis / Magna Veritas, 4e édition**. Elle fonctionne **sans internet** une fois ouverte une première fois.

## Ce que fait l'appli

- **Générateur de personnage**, trois méthodes comme dans le livre de règles :
  - **Création rapide** : ange ou démon → profil (Baroudeur/Sauvage, Filou, Charmeur/Corrupteur, Érudit, Martial/Violent, Missionnaire/Inquisiteur) → supérieur (les 52 archanges et princes-démons du livre, ceux qui conviennent au profil en tête) → spécialités et langues → deux pouvoirs tirés au d66 (doublons et lignes interdites à ton camp relancés automatiquement ; le MJ peut aussi choisir sur la table).
  - **Création intermédiaire** : création rapide, puis retouches avec les mêmes PA.
  - **Création sur mesure** : 100 PA (ange) ou 80 PA (démon) à répartir avec les boutons + et –. Un bandeau affiche les PA restants et vérifie les quotas (caractéristiques, talents, pouvoirs, PP) et les niveaux maximum.
- **Autres personnages** (création sur mesure) :
  - livre de base, chapitre 5 : humain normal, humain héroïque, serviteur de Dieu, soldat de Dieu, fils/fille de Dieu, mort-vivant, familier, incube/succube, démon de combat ;
  - **Les Petites Apocalypses** (troisième Force) : psioniques (5 niveaux de puissance, talents psioniques), héros païens (4 niveaux, pouvoirs par panthéon, runes vikings), anges et démons renégats (apostats compris), fées et monstres ;
  - **Bibles à Dudule** : nouveaux supérieurs (Catherine, Georges, Victor, Eli, Hassan, Khalid, Marie-Jolie, Hornet, Zanag, Daiàl, Majùj) et leurs pouvoirs propres.
- **Fiche** : caractéristiques (niveaux 2, 2+, 3…), valeurs annexes calculées (PF, PP, seuils BL/BG/BF/MS), talents principaux, secondaires et exotiques avec niveau de base automatique, spécialités, hobbies, métiers, langues. Toucher une valeur lance un test.
- **Lanceur de dés** : d66+6 sur la **table Unique-Multiple**, difficultés (facile → légendaire), modificateurs, prise de risque, tests opposés, malus des blessures. Calcul de la marge de réussite (doubles et triples avec la Foi/Chance), 111 et 666 selon ton camp.
- **Combat** : jauges de PF et de PP, blessures (« Encaisser un coup » calcule la gravité d'après tes seuils et retire les PF), refermer une blessure par la Médecine ou en dépensant des PP, armes avec niveau de dommage calculé (MR + puissance + Force), armures.
- **Pouvoirs** : les pouvoirs du personnage avec description, bouton « Activer » qui dépense les PP, test de pouvoir ; pouvoirs de grade par domaine.
- **Carnet** : identité, supérieur (récupération des PP, gain de PA, domaines), grade, points d'administration avec historique et annulation, limitations (avertissements, blâmes), possessions, notes.
- **Biblio** : les 223 pouvoirs (filtrés selon ce qui est accessible au personnage, coût en PA), tous les supérieurs avec leur présentation (résumée des livrets INS, MV et des Bibles à Dudule), les talents, les armes et armures, un résumé des règles (table UM, MR, grades).
- **Trois modes de fiche** (bouton en haut) : **Jeu** (verrouillé), **PA** (dépenser les points d'administration gagnés : caractéristique 2 PA/rang, talent 1 PA avec un rang secondaire offert, pouvoir selon son coût, PP 1 PA, dans les limites du grade), **Libre** (corriger sans coût).
- **Module maître de jeu** (menu ⋮ > Mode maître de jeu, ou depuis l'accueil) : le MJ crée une **table** et donne son code aux joueurs ; chaque joueur saisit ce code dans le Carnet de son personnage (carte « Table de jeu ») pour partager sa fiche. Le MJ voit alors toutes les fiches **en direct** :
  - **vue d'ensemble** : PF et PP actuels, blessures ouvertes et malus, Défense, Perception, Volonté, Foi, seuils de blessure, limitations ;
  - **comparatif** : caractéristiques et talents clés de tout le groupe dans un tableau ; toucher une valeur lance le test en secret (avec le malus de blessure du personnage) ;
  - **fiche détaillée** en lecture seule : identité, supérieur, talents, pouvoirs avec description, armes (attaque lançable), protections, limitations, possessions, notes du joueur (sauf s'il les garde privées) ;
  - **notes de MJ** privées par personnage, gardées sur l'appareil du MJ.
  - **scénarios et combats préparés** (onglet « Scénarios & combats », fonctionne sans connexion) : synopsis et secrets du MJ, scènes (lieu, déroulement), et pour chaque combat les adversaires à la manière de la feuille « Tousktabeuzouinpourjoué » — nom (source), nombre d'exemplaires, attaques (arme du livre ou libre, niveau, précision, puissance), Défense, Volonté, Foi, Perception, seuils BL/BG/BF/MS et PF calculés selon le type (modifiables), PP, protection, pouvoirs avec description, talents utiles, notes ; rappel des PNJ à Esquive acrobatique / Volonté supra-normale (prévenir les joueurs). Un PNJ peut être repris d'un personnage du Grimoire. **Lancer le combat** crée une fiche de suivi par adversaire : PF, PP, blessures et malus, « Encaisser un coup », jets d'attaque (niveau de dommage calculé) et de défense, pouvoirs (PP dépensés), compteur de rounds, renforts, et rappel des PJ de la table ouverte. Export/import du scénario en fichier JSON.
  La table utilise la même base Firebase et le même mécanisme de groupe que le Grimoire WFRP : chacun doit être connecté avec son compte Google.
- Plusieurs personnages, export/import en fichier JSON, impression de la fiche.

Les données des règles viennent des livres du dossier `Bouquins` (scans passés à la reconnaissance de texte). Les tables, coûts et supérieurs ont été relus sur les pages ; les longues descriptions de pouvoirs peuvent contenir quelques coquilles.

## Lancer l'appli sur l'ordinateur

Dans le dossier de l'appli :

```bash
python -m http.server 8766
```

puis ouvrir <http://localhost:8766>.

## Mettre l'appli en ligne (GitHub Pages, gratuit)

1. Crée un dépôt public sur GitHub, par exemple `grimoire-insmv`.
2. Envoie-y tout le contenu du dossier **sauf** le dossier `Bouquins` (les PDF ne sont pas nécessaires).
3. **Settings** > **Pages** > Branch `main`, dossier `/ (root)` > **Save**.
4. L'appli est en ligne à `https://TON-PSEUDO.github.io/grimoire-insmv/`. Sur Android, menu de Chrome > **Ajouter à l'écran d'accueil**.

## Sauvegarde en ligne (Firebase gratuit)

La version en ligne utilise déjà le projet Firebase du Grimoire WFRP (`js/config.js`) : touche le nuage en haut de l'écran et connecte-toi avec ton compte Google. Tes personnages sont alors synchronisés entre tes appareils.

Pour utiliser un autre projet Firebase :

1. Sur <https://console.firebase.google.com>, crée un projet (ou réutilise celui du Grimoire WFRP).
2. **Authentication** > activer **Google** ; dans **Paramètres** > **Domaines autorisés**, ajouter `TON-PSEUDO.github.io`.
3. **Firestore Database** > créer la base (mode production), puis dans **Règles** :

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{uid}/{document=**} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
     }
   }
   ```

4. **Paramètres du projet** > **Vos applications** > ajouter une application Web, copier la configuration, puis la coller dans l'appli (Menu ⋮ > **Sauvegarde en ligne**) ou dans `js/config.js`.

Les personnages sont rangés dans `users/{ton-compte}/insmv`, à part de ceux du Grimoire WFRP.

## Organisation du code

| Fichier | Rôle |
|---|---|
| `js/rules.js` | Règles : niveaux et rangs, table UM, coûts, profils, tables de pouvoirs, types de personnages, armes |
| `js/data/superieurs.js` | Archanges et princes-démons (création rapide, récupération, domaines) |
| `js/data/pouvoirs.js` | Pouvoirs (accès, coûts, qualités, descriptions) |
| `js/app.js` | Interface : fiche, combat, pouvoirs, carnet, biblio, dés, générateur |
| `js/store.js`, `js/cloud.js` | Enregistrement sur l'appareil et synchro Firebase |
| `js/table.js` | Table de jeu : partage des fiches avec le MJ (collection Firestore `groups`) |
| `sw.js` | Fonctionnement hors ligne (penser à changer `CACHE` après une mise à jour) |
