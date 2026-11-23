# Outils des scénarios des livres

Les fichiers de `scenarios/` (format `insmv-scenario`, importables dans le module MJ) sont produits par les générateurs de ce dossier, à partir des livres du dossier `Bouquins/` (non versionné).

| Fichier | Rôle |
|---|---|
| `gen-<scénario>.mjs` | Générateur d'un scénario : `node tools/scenarios/gen-<scénario>.mjs . scenarios/<scénario>.json` |
| `fix-centre-de-tri.mjs` | Remet les fiches officielles de Monsieur Fabien, Gilbert et Aurélie (Fire and Ice, p. 24-26) dans les scénarios Fire and Ice. **À relancer après avoir régénéré un scénario Fire and Ice 5 à 9** : `node tools/scenarios/fix-centre-de-tri.mjs .` |
| `build-index.mjs` | Reconstruit `js/data/scenarios-livres.js`, l'index de la bibliothèque des scénarios affichée dans l'appli : `node tools/scenarios/build-index.mjs .` |
| `test-import.mjs` | Importe un fichier avec le code de l'appli et lance un combat : `node tools/scenarios/test-import.mjs . scenarios/<scénario>.json` |
| `test-all.mjs` | Importe tous les fichiers ensemble (ids en double, stats, pouvoirs inconnus, combats) : `node tools/scenarios/test-all.mjs .` |
| `extract_pages.py` | Extrait les pages d'un PDF scanné en images : `python -I extract_pages.py <pdf> <dossier> <première> <dernière> [--reverse]` |
| `render_pages.py` | Rend en images les pages d'un PDF à texte (Les Petites Apocalypses) avec pypdfium2 |

Après tout changement dans `scenarios/`, relancer `build-index.mjs` puis `test-all.mjs`, et changer `CACHE` dans `sw.js`.

Quelques corrections ont été faites directement dans les JSON après génération (allié retiré d'un combat dans `petites-apocalypses-6`, Belial retiré de la bataille de `fire-and-ice-16`, tranches de Laurent dans `jesus-reviens-0-cadre`) : les reporter dans le générateur si on le relance.

## Hiérarchie

`tools/hierarchie/build-hierarchie.mjs` reconstruit `js/data/hierarchie.js` (règles du ch. 4 et fiches de hiérarchie des 63 supérieurs) à partir des relevés de `tools/hierarchie/sources/` : `node tools/hierarchie/build-hierarchie.mjs .`
