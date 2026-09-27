# Mon Ping — notes pour les contributeurs

## État du projet

Application web statique, pensée pour GitHub Pages et les téléphones. Elle ne nécessite ni serveur ni compte : les données sont stockées dans `localStorage` sous la clé `mon-ping-v1`. Une exportation/importation JSON permet le transfert vers un autre appareil.

Fichiers principaux :

- `index.html` : structure et textes de l'interface ;
- `app.js` : barème FFTT, calcul, stockage local et affichage ;
- `styles.css` et `overrides.css` : styles ;
- `service-worker.js` et `manifest.webmanifest` : installation hors ligne.

## Règle de calcul à préserver

La source de référence est le règlement général FFTT 2026/2027, articles IV.201 à IV.209, en particulier IV.203 (coefficients) et IV.205.1 (barème).

- Le barème est appliqué selon l'écart de points, le caractère normal/anormal du résultat et le coefficient de l'épreuve.
- Les points de référence sont ceux de la **période FFTT en cours**, pas un total mis à jour match après match. Les périodes sont juillet–août–septembre, puis octobre à juin, une période par mois.
- Ainsi, deux matchs (ou plus) de la même période se calculent avec les mêmes points de départ pour le joueur. Les gains/pertes de la période servent seulement à estimer la période suivante.
- Les coefficients possibles incluent `0.5`, `0.75`, `1`, `1.25`, `1.5` et `2`.

Le total de l'application est une estimation de suivi, et non une situation FFTT officielle. Ne pas présenter les résultats comme un classement officiel.

## Cas FFTT non automatisés

- forfait/absence : une partie commencée ou avec les deux joueurs dans l'aire de jeu entraîne un transfert ; une absence a un traitement spécifique ;
- bonus du championnat de France seniors ;
- dérive de fin de phase, réinitialisation à 500 points sous ce seuil, réajustements fédéraux et résultats internationaux ;
- contrôles de licence et toute correction par l'instance compétente.

Tout ajout de ces règles doit citer l'article FFTT correspondant et inclure des tests de cas limite.

## Import FFTT prévu

La FFTT met à disposition une API officielle après demande d'accès et acceptation de ses conditions d'utilisation. L'import de points, matchs et identité licencié devra passer par un **backend sécurisé** : les identifiants API ne doivent jamais figurer dans le JavaScript publié sur GitHub Pages.

Approche prévue : authentification utilisateur côté backend, conservation chiffrée des secrets côté serveur, appels FFTT depuis le serveur, normalisation des réponses, puis import explicite dans le stockage local de l'application. Prévoir un mécanisme de déduplication et une confirmation avant d'écraser des matchs locaux.

## Publication

Le site est publié depuis la racine de `main` via GitHub Pages. Après toute modification de ressources mises en cache, incrémenter `CACHE` dans `service-worker.js` afin que les appareils récupèrent la nouvelle version.
