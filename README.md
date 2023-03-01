# MVP de Lepto le plus laid au monde.

Version déployée de l'app grace à firebase : https://netflix-react-js-eb79a.web.app

Mais qui a toutes les fonctionnalités d'authentification avec Firebase qui fonctionnent.

## Lancement de l'application

Installer les dépendances.

```bash
yarn
```

Lancer l'app sur le port `3000`.

```bash
yarn start
```

## Fonctionnalité de cette application

L'application permet de :

```
- Créer un compte par email/mot de passe (envoi d'email pour confirmation)
- Se connecter à un compte
- Se déconnecter
- Gestion de Mot de passe oublié par email (envoi d'email)
- Récupération des infos personnelles de l'utilisateur
- Modifier ses infos personnelles (prénom, nom, age)
- Modifier son email (envoi d'email pour confirmation)
- Modifier son mot de passe (avec re-authentification obligatoire)
```

## Structure de données

Pour connaitre la structure des données choisie, c'est [ici](https://gitlab.tizy-studio.fr/projets-externes/bayoudev/lepto/-/wikis/Firebase:-Structure-de-donn%C3%A9es)

## Variables d'environnement

Cette application et la base de données sur firebase associée est vouée à disparaitre, il n'est donc pas très grave si les secrets de cette application sont partagés ici.
Créer un fichier `.env` à la racine du projet puis copier-coller.

```bash
REACT_APP_FIREBASE_API_KEY=AIzaSyDKm7r7efxpBXPNTTY42xHA5Ml7AoGmRnY
REACT_APP_FIREBASE_AUTH_DOMAIN=netflix-react-js-eb79a.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=netflix-react-js-eb79a
REACT_APP_FIREBASE_STORAGE_BUCKET=netflix-react-js-eb79a.appspot.com
REACT_APP_FIREBASE_MESSAGEGING_SENDER_ID=876046197990
REACT_APP_FIREBASE_APP_ID=1:876046197990:web:000aebc0d9de3637c54727
```
