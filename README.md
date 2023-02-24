# Kryptonite
## Introduction
Kryptonite est une application créée dans le cadre de mon Travail de Bachelor auprès de la Haute École de Gestion de Genève (HEG). Le but de Kryptonite est de procéder à la correction partielle des rendus de programmations des étudiants de la HEG en informatique.

## Démarrage du projet
Pour lancer le backend, exécuter la commande `mvn package` dans le répertoire [backend](backend) et lancer le fichier jar résultant avec la commande `java -jar kryptonite.jar`. 
Enfin, lancer le frontend avec la commande `npm start` dans le répertoire racine.

Vous pouvez également visualiser la version de démonstration sur [Heroku](https://kryptonite-front.herokuapp.com/login). L'utilisateur par défaut qui est crée est `root` avec le mot de passe `Kryptonite321!`

## Technologies Utilisées
### Frontend
- React.js
  - Helmet
  - React Router
  - Babel
  - Axios pour les requêtes REST au backend
  - D'autres librairies pour la gestion des icones, dates, tables, etc. (cf. [package.json](package.json))
- Material UI (MUI)
  - [Template de dashboard - Material kit react](https://mui.com/store/items/minimal-dashboard-free/)
  - [Tous les composants sont listés ici](https://mui.com/material-ui/getting-started/overview/)


## Backend
- Spring
  - Spring Security
  - Spring Data JPA
  - Spring Web
- H2
- JWT
- Unirest Java
- Express.js
- Heroku Maven Plugin pour le déploiement sur Heroku


## Architecture
### Dossier racine
Contient les fichiers de configuration du projet tel que `package.json`, `.gitignore`, `jsconfig.json`, etc.
Nous y trouvons également un fichier Procfile pour le déploiement dans un "Dyno" Heroku.

### Dossier backend/
Ce dossier contient tous les fichiers sources pour build le backend et le déployer sur Heroku avec Maven.

### Dossier node_modules/
Ce dossier contient toutes les dépendances du projet. Pour l'installer, il faut lancer la commande `npm install` sur le projet.

### Dossier public/
Ce dossier contient tous les éléments statiques de l'application web (logos, index.html de base, etc.).

### Dossier src/
Contient tous les fichiers sources React du projet.

### Dossier scripts/
Contient le fichier pour lancer un serveur Express.js lors d'un déploiement dans Heroku 

