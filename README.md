# Evalia Frontend

Application frontend React pour **Evalia**, une plateforme de compétitions et d'événements. Le projet est entièrement conteneurisé avec Docker pour le développement et la production.

## Table des matières

- [Stack technique](#stack-technique)
- [Architecture Docker](#architecture-docker)
- [Prérequis](#prérequis)
- [Démarrage rapide](#démarrage-rapide)
- [Intégration avec le backend](#intégration-avec-le-backend)
- [Build de production](#build-de-production)
- [Scripts disponibles](#scripts-disponibles)
- [Structure du projet](#structure-du-projet)

## Stack technique

| Technologie | Usage |
|-------------|-------|
| React 18 | Interface utilisateur |
| TypeScript | Typage statique |
| Vite | Bundler et serveur de dev |
| React Router | Routage SPA |
| TanStack Query | Gestion des requêtes API |
| Tailwind CSS + shadcn/ui | Styles et composants |
| Vitest | Tests unitaires |

## Architecture Docker

Le projet propose **deux configurations Docker** selon le contexte :

### 1. Développement autonome (`docker-compose.dev.yml`)

Configuration simple pour travailler sur le frontend seul, sans dépendance au backend.

- Hot-reload activé (modifications visibles immédiatement)
- Code source monté en volume
- Port exposé : **5173**
- Polling activé pour la détection des changements sous Docker

### 2. Développement intégré (`docker-compose.yml`)

Configuration pour l'écosystème Evalia complet, avec connexion au backend via le réseau Docker partagé `evalia-net`.

- Port exposé : **3001** (mappé sur le port 5173 du conteneur)
- Variable `VITE_API_URL` pointant vers `http://backend-evalia:8000`
- Volume anonyme pour `node_modules` (évite les conflits avec l'hôte)
- Redémarrage automatique du conteneur

### 3. Production (`Dockerfile`)

Build multi-stage pour une image légère :

1. **Stage build** — compilation de l'app React avec Node 20 Alpine
2. **Stage runtime** — service des fichiers statiques via Nginx Alpine

> **Note :** le `Dockerfile` référence un fichier `nginx.conf` pour la configuration SPA (React Router en mode History). Ce fichier doit être présent à la racine du projet pour que le build de production fonctionne.

## Prérequis

- [Docker](https://docs.docker.com/get-docker/) (version 20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (inclus avec Docker Desktop)
- Git
- 2 Go d'espace disque libre minimum

Vérifiez votre installation :

```bash
docker --version
docker compose version
```

## Démarrage rapide

### 1. Cloner le projet

```bash
git clone <url-de-votre-repo>
cd evalia-frontend
```

### 2. Lancer en mode développement (autonome)

```bash
docker compose -f docker-compose.dev.yml up
```

L'application est accessible sur [http://localhost:5173](http://localhost:5173) ou [http://localhost:3001](http://localhost:3001) selon la configuration.

Pour lancer en arrière-plan :

```bash
docker compose -f docker-compose.dev.yml up -d
```

### 3. Arrêter l'application

```bash
docker compose -f docker-compose.dev.yml down
```

## Intégration avec le backend

Pour connecter le frontend au backend Evalia, le réseau Docker `evalia-net` doit exister et le backend doit y être attaché.

### Créer le réseau partagé (si nécessaire)

```bash
docker network create evalia-net
```

### Lancer le frontend sur le réseau Evalia

```bash
docker compose up -d
```

L'application est accessible sur [http://localhost:3001](http://localhost:3001).

Le backend est attendu sous le hostname `backend-evalia` sur le port `8000`. Assurez-vous que le service backend est démarré et connecté au même réseau `evalia-net`.

## Build de production

### Construire l'image Docker

```bash
docker build -t evalia-frontend .
```

### Lancer le conteneur de production

```bash
docker run -d -p 8080:80 --name evalia-frontend evalia-frontend
```

L'application est accessible sur [http://localhost:8080](http://localhost:8080).

## Scripts disponibles

Ces commandes peuvent être exécutées localement (hors Docker) si Node.js 20+ est installé :

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur de développement Vite |
| `npm run build` | Compile l'application pour la production |
| `npm run preview` | Prévisualise le build de production |
| `npm run lint` | Vérifie le code avec ESLint |
| `npm run type-check` | Vérifie les types TypeScript |

## Structure du projet

```
evalia-frontend/
├── src/
│   ├── components/     # Composants réutilisables (UI, layout, admin…)
│   ├── context/        # Contextes React (auth, événements)
│   ├── hooks/          # Hooks personnalisés
│   ├── lib/            # Utilitaires et client API
│   ├── pages/          # Pages de l'application
│   └── types/          # Définitions TypeScript
├── Dockerfile          # Build multi-stage pour la production
├── docker-compose.yml          # Dev intégré (réseau evalia-net)
├── docker-compose.dev.yml      # Dev autonome
├── vite.config.ts      # Configuration Vite (port 5173, polling Docker)
└── package.json
```

## Variables d'environnement

| Variable | Fichier | Description |
|----------|---------|-------------|
| `CHOKIDAR_USEPOLLING` | docker-compose.* | Active le polling pour le hot-reload sous Docker |
| `VITE_API_URL` | docker-compose.yml | URL de l'API backend (ex. `http://backend-evalia:8000`) |
| `NODE_ENV` | docker-compose.dev.yml | Environnement d'exécution (`development`) |
