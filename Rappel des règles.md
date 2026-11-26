# Rappel des règles INS/MV

| Absolue  | -    | -  | -    | -  | -    | 0  | 0+   | 1  | 1+   | 2  | 2+   | 3  | 3+   | 4  | 4+   | 5  | 5+   | 6  | 6+   |
|----------|------|----|------|----|------|----|------|----|------|----|------|----|------|----|------|----|------|----|------|
| **LN**   | x    | 11 | 12   | 13 | 15   | 21 | 23   | 26 | 33   | 36 | 43   | 46 | 53   | 55 | 61   | 63 | 64   | 65 | 66   |
| **Relative** | -4.5 | -4 | -3.5 | -3 | -2.5 | -2 | -1.5 | -1 | -0.5 | 0 | +0.5 | +1 | +1.5 | +2 | +2.5 | +3 | +3.5 | +4 | +4.5 |

*Table unique multiple*

**Test standard :** Le seuil correspond à la valeur se trouvant à la ligne «LN» par rapport au score de la caractéristique, trait, ou pouvoir à tester (Absolue). Des décalages de colonnes peut être exigé par le maître de jeu (Niveau de difficulté) ou par le joueur (Prise de risque). Les dizaines et unités sont à comparer avec le seuil de réussite et doit être inférieur.

**Test en opposition :** Si un test doit être fait avec un PNJ, le test en opposition est utilisé. On soustrait le score du joueur au score du PNJ (le + valent comme 0.5) puis on consulte le seuil en se référent à la ligne «Relative».

> *Exemple : Régis essaie de passer discrètement derrière un garde. Régis à un score de 4+ en discrétion et notre garde à un score de 3 en Perception. Donc 4.5 - 3 = 1.5. Ce qui correspond d’après la table à un seuil de 53. Attention : Le maître de jeu se réserve la droit de taire le score du PNJ opposé.*

**Marge de réussite :** La marge de réussite correspond au dé de réussite additionné au score testé. Elle représente le niveau de réussite ou d’échec du jet.

> *Exemple : Régis tente un jet de force et le réussi. Il additionne le dé des centaines avec sont score de force.*

Si des colonnes ont été décalées (difficulté, pas prise de risque), on utilise le score utilisé dans la table.

> *Exemple : Régis à un bonus de 4 colonnes et à une force de 4. Il utilise donc la colonne 6. La MR est si ont imagine qu’il ai un dé des centaine égal à 3 : 3 + 6 = 9.*

## Niveau de difficulté

| Difficulté     | Modificateur         | Notes                               |
|----------------|----------------------|-------------------------------------|
| Triviale       | Réussite automatique | Sauf 666 ou 111 selon ange ou démon |
| Facile         | +4 colonnes          |                                     |
| Difficile      | Sans modificateur    |                                     |
| Très difficile | -4 colonnes          |                                     |
| Incroyable     | -8 colonnes          |                                     |
| Légendaire     | -12 colonne          |                                     |
| Impossible     | Echec automatique    | Sauf 111 ou 666 selon ange ou démon |

## Prise de risque

Pour X colonne de décalage vers la gauche, le joueur obtiendra une marge de réussite augmentée de X. Attention le joueur ne peut pas décalé de plus de colonne que son score testé.

> *Exemple : Régis a un score de 5+, il décide de décaler de 5 colonnes. Ce qui donnerait un seuil de 46. Il lance les dés et obtient un 423. 23 étant inférieur à 46, l’action est réussie avec une marge de 4 + 5 + 5. Il est con ce Régis.*

## Réussites et échecs spéciaux

| Résultat                   | Anges                                                | Démons                            |
|----------------------------|------------------------------------------------------|-----------------------------------|
| 111 (l’Unique)             | Réussite critique pour les anges                     | Echec critique pour les démons    |
| 666 (le nombre de la Bête) | Echec critiques pour les anges                       | Réussite critique pour les démons |
| xx (Double)                | Ajouter la foi à la marge de réussite                | *(idem)*                          |
| xxx (Triple)               | Ajouter le double de la foi à la marge de réussite   | *(idem)*                          |

---

# Règles de combat

## Initiative

Uniquement pour le premier tour, ensuite les joueur joue l’un après l’autre dans le sens des aiguilles d’une montre. Le MJ définit la caractéristique ou le talent a utilisé selon la situation. En général Agilité mais si par exemple le combat commence avec une attaque mentale, la Volonté pourrait être utilisé, ou Perception si la première attaque est une attaque à distance. L’environnement peut aussi être un facteur, par exemple dans une jungle, le trait Survie (Jungle), etc...

### Cas particuliers

- **Duel :** Jet d’agilité opposé.
- **Surprise pour les deux camps :** Test d’agilité Très difficile au premier tour. Si c’est un échec le joueur ne joue pas à ce tour et devra réussir un test d’agilité difficile au deuxième tour pour pouvoir agir.
- **Embuscades :** Les victimes de l’embuscade peuvent faire un test de perception opposé à la discrétion des embusqués (le moins discret du groupe est utilisé pour le jet). Si les victimes échouent leur jet, les personnages ne peuvent agir ce tour et devront réussir un test d’agilité difficile au deuxième tour sous peine de ne pas pouvoir agir à nouveau.

## Actions

Possibilités :

- Déplacement
- Attaque
- Activation de pouvoir (pas de jet sauf si préciser dans la définition du pouvoir)

Le déplacement peut être fait en même temps que les deux autres actions avec des malus selon la situation. -4 colonnes au tir, une charge donne un malus de -2 colonnes sauf si l’arme est «adaptée à la charges». Dans ce cas, le joueur à un bonus de 2 colonnes.

### Attaque

L’attaquant fait un test de son talent (la précision de l’arme correspond au décalage de colonne donné par l’arme). Le défenseur un jet de défense.

**MR de résolution :** MR de l’attaquant - MR du défenseur. L’attaque touche si elle est égal ou supérieur à 0.

| Type d’attaque   | Dégâts finaux                                                              |
|------------------|----------------------------------------------------------------------------|
| Corps à corps    | MR de résolution + Force - Protection du défenseur                         |
| Armes de contact | MR de résolution + Force + Puissance de l’arme - Protection du défenseur   |
| Armes à distance | MR de résolution + Puissance de l’arme - Protection du défenseur           |

Il ne reste plus qu’à comparer les seuils de blessure du défenseur et définir sa gravité. Une coche doit être fait dans la ligne correspondant à la gravité.

Une créature surnaturel peut survivre à une mort subite en réussissant un test de Force.

## Pertes et malus lors de blessures

Un ange ou un démon perd des points de fatigue à chaque nouvelle blessure. Lorsque son total de PF tombe à 0 c’est l’inconscience.

| Blessure    | BL | BG          | BF          | MS           |
|-------------|----|-------------|-------------|--------------|
| Perte de PF | 1  | 2           | 4           | mort ou 12   |
| Malus       | -  | -2 colonnes | -4 colonnes | -12 colonnes |
