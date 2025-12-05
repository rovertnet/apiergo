# ==================== DEVELOPMENT ====================
FROM node:20-alpine AS development

WORKDIR /app

# Installer Nest CLI globalement
RUN npm install -g @nestjs/cli

# Installer curl pour wait-for-it et bash
RUN apk add --no-cache bash curl

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le projet
COPY . .

# Builder le projet (optionnel)
RUN npm run build

# Copier le script wait-for-it
COPY wait-for-it.sh /usr/local/bin/wait-for-it
RUN chmod +x /usr/local/bin/wait-for-it

# Commande pour dev : attendre Postgres et Redis avant de lancer Nest
CMD ["wait-for-it", "postgres:5432", "--", "wait-for-it", "redis:6379", "--", "npm", "run", "start:dev"]

# ==================== PRODUCTION ====================
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=development /app/dist ./dist

CMD ["node", "dist/main.js"]
