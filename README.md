# Mon Ping – suivi de points FFTT

Application web statique pensée pour téléphone. Elle enregistre les matchs et les points uniquement dans le navigateur (`localStorage`) et peut être installée comme application depuis un navigateur mobile compatible.

## Publication avec GitHub Pages

1. Créer un dépôt public vide nommé, par exemple, `mon-ping`.
2. Copier le contenu de ce dossier à la racine du dépôt et l'envoyer sur la branche `main`.
3. Dans **Settings → Pages**, choisir **Deploy from a branch**, puis `main` et le dossier `/(root)`.
4. L'application sera disponible à l'adresse `https://ybonnel.github.io/mon-ping/`.

## Import FFTT

La FFTT fournit une API officielle sous autorisation, avec des identifiants spécifiques. Ces identifiants ne doivent jamais être mis dans une application GitHub Pages car ils seraient visibles par tout le monde. Un import automatique nécessitera donc un petit serveur intermédiaire sécurisé une fois l'accès API accordé.

Le barème intégré correspond au tableau de calcul présenté par le club de Brignoles, auquel renvoie l'application.
