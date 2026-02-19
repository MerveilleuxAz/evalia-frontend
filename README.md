# Evalia Frontend

Application frontend React pour le projet Evalia, entièrement conteneurisée avec Docker.

## 📋 Table des matières

- [Architecture Docker](#architecture-docker)
- [Prérequis](#prérequis)
- [Démarrage rapide](#démarrage-rapide)

## 🐳 Architecture Docker

Le projet utilise deux configurations Docker distinctes :

### 1. **Développement** (`docker-compose.dev.yml`)

- Hot-reload activé (les modifications sont immédiatement visibles)
- Montage du code source en volume
- Port exposé : **5173**
- Variables d'environnement pour le développement

### 2. **Production** (`Dockerfile` - optionnel)

- Multi-stage build pour une image légère
- Serveur Nginx pour servir les fichiers statiques
- Configuration SPA pour React Router

## 🔧 Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (version 20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (inclus avec Docker Desktop)
- Git
- 2 Go d'espace disque libre minimum

Vérifiez votre installation :

```bash
docker --version
docker compose version
```

## 🚀 Démarrage rapide

### 1. Cloner le projet
```bash
git clone <url-de-votre-repo>
cd evalia-frontend
```

### 2. Lancer avec Docker
```bash
docker compose -f docker-compose.dev.yml up
```

### 3. Arrêt l'Application
```bash
docker compose -f docker-compose.dev.yml down
```