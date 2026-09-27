# Mon Ping – suivi de points FFTT

Application web statique pensée pour téléphone. Elle enregistre les matchs et les points uniquement dans le navigateur (`localStorage`) et peut être installée comme application depuis un navigateur mobile compatible.

## Publication avec GitHub Pages

1. Créer un dépôt public vide nommé, par exemple, `mon-ping`.
2. Copier le contenu de ce dossier à la racine du dépôt et l'envoyer sur la branche `main`.
3. Dans **Settings → Pages**, choisir **Deploy from a branch**, puis `main` et le dossier `/(root)`.
4. L'application sera disponible à l'adresse `https://ybonnel.github.io/mon-ping/`.

## Calcul des points

Le calcul reprend l'article IV.205.1 des règlements généraux FFTT 2026/2027 : barème selon l'écart de points, résultat normal ou anormal, puis multiplication par le coefficient de l'épreuve. Les coefficients proposés sont 0,50 ; 0,75 ; 1 ; 1,25 ; 1,5 et 2.

La FFTT compare les points des joueurs pour la période en cours. L'application utilise donc la même valeur de référence pour tous les matchs d'une période : juillet–août–septembre, puis chaque mois d'octobre à juin. Les résultats d'une période sont cumulés pour l'estimation de la période suivante, mais ne modifient pas le calcul des matchs de cette même période.

Le total affiché est une estimation personnelle. Les forfaits et absences, les bonus du championnat de France seniors, la dérive de fin de phase, les réajustements et les situations mensuelles officielles restent du ressort de la FFTT.

## Import FFTT

La FFTT fournit une API officielle sous autorisation, avec des identifiants spécifiques. Ces identifiants ne doivent jamais être mis dans une application GitHub Pages car ils seraient visibles par tout le monde. Un import automatique nécessitera donc un petit serveur intermédiaire sécurisé une fois l'accès API accordé.

Référence de calcul : [Règlements généraux FFTT 2026/2027](https://www.fftt.com/wp-content/uploads/2026/07/reglement_generaux_2026_2027.pdf), articles IV.201 à IV.209.
