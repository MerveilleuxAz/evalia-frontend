# ÉTAPE 1 : Builder l'application React
# On utilise une image Node officielle et légère pour la compilation
FROM node:20-alpine AS build

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de dépendances pour profiter du cache Docker
COPY package*.json ./
# Ou si vous utilisez yarn : COPY yarn.lock ./

# Installer les dépendances du projet
RUN npm ci
# Ou : RUN yarn install --frozen-lockfile

# Copier tout le code source du projet
COPY . .

# Générer les fichiers statiques de production
RUN npm run build
# Ou : RUN yarn build

# ÉTAPE 2 : Servir l'application avec un serveur web (Nginx)
# On part d'une image Nginx, également très légère
FROM nginx:alpine

# Copier le résultat de la première étape dans le dossier servi par Nginx
COPY --from=build /app/build /usr/share/nginx/html
# Si vous utilisez Vite, le dossier de sortie est souvent 'dist' : /app/dist

# Si vous utilisez React Router en mode History, il faut configurer Nginx
# pour qu'il redirige toutes les requêtes vers index.html. Copiez votre fichier de conf.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port sur lequel Nginx écoute (par défaut 80)
EXPOSE 80

# Lancer Nginx
CMD ["nginx", "-g", "daemon off;"]