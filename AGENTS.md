# AGENTS.md — Mon Ping

Ce fichier sert de contexte de travail pour toute évolution de l’application.

## État actuel

- Le dépôt héberge une application web statique/PWA, publiée avec GitHub Pages depuis la branche `main` et le dossier racine.
- L’interface est en français et pensée d’abord pour mobile.
- L’entrée principale est `index.html`.
- La logique applicative est dans `app.js`, le style dans `styles.css` et `overrides.css`.
- Le service worker (`service-worker.js`) rend l’application utilisable hors ligne après une première ouverture.
- Le manifeste et l’icône sont fournis dans `manifest.webmanifest` et `icon.svg`.

## Fonctionnalités déjà livrées

- Réglage du total de départ.
- Ajout manuel d’un match : date, adversaire facultatif, points adverses, victoire/défaite et coefficient.
- Calcul automatique du gain/perte de points FFTT à partir du barème intégré dans `app.js`.
- Historique, indicateurs (matchs, taux de victoire, meilleure série) et graphique de progression.
- Sauvegarde et restauration locale au format JSON.
- Suppression individuelle ou totale des matchs.

## Données locales

Toutes les données sont aujourd’hui conservées uniquement dans le navigateur, sous la clé `localStorage` `mon-ping-v1`.

Structure actuelle :

```json
{
  "name": "Loan",
  "startingPoints": 500,
  "matches": [
    {
      "id": "uuid",
      "date": "2026-09-27",
      "opponent": "Nom facultatif",
      "opponentPoints": 850,
      "coefficient": 1,
      "result": "win",
      "delta": 8
    }
  ]
}
```

Ne pas modifier ce format sans prévoir une migration légère et conserver l’export/import.

## Règle de calcul intégrée

Le barème est basé sur le tableau publié ici :
https://ttbrignoles.com/calculateur-de-points-2/

Il gère les neuf tranches d’écart, le caractère normal/anormal du résultat et les coefficients 0,50 ; 0,75 ; 1 ; 1,25 ; 1,50.

## Import FFTT : ce qui est connu

La FFTT met à disposition une API officielle, mais l’accès est soumis à demande, contrat/CGU et identifiants attribués :
https://www.fftt.com/api/

La documentation/formulaire FFTT mentionne notamment des interfaces de données joueur et licencié :
https://www.fftt.com/wp-content/uploads/2026/01/formulaire-api-1484.pdf

Des bibliothèques communautaires montrent que l’API historique expose, selon les droits accordés, des informations comme le classement, l’historique, les parties, les parties non validées et les points virtuels. Ne pas considérer ces bibliothèques comme une garantie de disponibilité ni contourner les conditions de la FFTT.

## Règle de sécurité essentielle

**Ne jamais placer des identifiants FFTT dans ce dépôt ni dans JavaScript exécuté par le navigateur.**

GitHub Pages est entièrement public : toute clé, mot de passe ou URL d’API privée présente dans les fichiers serait récupérable par n’importe qui.

## Architecture conseillée pour l’import

1. Obtenir officiellement l’accès API FFTT et vérifier les données/endpoints autorisés.
2. Créer un petit backend sécurisé (par exemple Cloudflare Worker, Vercel Function ou autre hébergement serverless).
3. Stocker les identifiants FFTT uniquement dans les secrets du backend.
4. Exposer une route minimale, par exemple `POST /api/fftt/sync`, protégée contre les abus.
5. Depuis l’application, demander explicitement le numéro de licence ou la sélection du joueur, appeler le backend, afficher un aperçu puis laisser l’utilisateur confirmer l’import.
6. Transformer les retours FFTT vers le format `matches` actuel et éviter les doublons (clé externe stable ou combinaison date/adversaire/résultat).
7. Garder l’ajout manuel et la sauvegarde JSON comme solution de secours.
8. Documenter clairement la fréquence de synchronisation et les données enregistrées.

## À décider avant de coder l’import

- Le type d’accès FFTT effectivement obtenu et les CGU applicables.
- L’identifiant demandé à l’utilisateur (probablement numéro de licence) et le niveau de visibilité des données joueur.
- La source de vérité pour les points : total officiel mensuel, points virtuels, ou calcul local des matchs importés.
- La politique de résolution des doublons et de correction manuelle.
- Le lieu d’hébergement du backend et son coût.
- La nécessité éventuelle d’un compte utilisateur si la synchronisation doit fonctionner sur plusieurs téléphones.

## Bonnes pratiques de modification

- Préserver l’usage sans compte et hors ligne.
- Tester le barème sur des écarts limites : 24/25, 49/50, 499/500 points.
- Augmenter la version du cache dans `service-worker.js` lors d’un changement de fichiers mis en cache.
- Ne pas introduire de dépendance de build si du HTML/CSS/JS natif suffit.
