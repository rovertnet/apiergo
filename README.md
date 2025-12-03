# API Ergo CMS

Backend NestJS pour le CMS institutionnel Ergo, remplaçant l'ancien backend Laravel.

## Technologies

- **Framework**: NestJS 10
- **Langage**: TypeScript
- **Base de données**: PostgreSQL 15
- **ORM**: Prisma
- **Cache**: Redis 7
- **Authentification**: JWT (Passport)
- **Upload**: Cloudinary
- **Documentation**: Swagger (OpenAPI)

## Prérequis

- Node.js 18+
- Docker & Docker Compose
- npm ou yarn

## Installation

1. Cloner le dépôt
2. Installer les dépendances:
   ```bash
   npm install
   ```
3. Configurer les variables d'environnement:
   ```bash
   cp .env.example .env
   # Modifier .env avec vos credentials (Cloudinary, etc.)
   ```

## Démarrage Rapide (Docker)

Lancer tous les services (Postgres, Redis, App) via Docker Compose:

```bash
docker-compose up -d
```

L'API sera accessible sur `http://localhost:3000`.

## Démarrage Manuel (Développement)

1. Lancer les services de base de données:
   ```bash
   docker-compose up -d postgres redis
   ```

2. Appliquer les migrations Prisma:
   ```bash
   npx prisma migrate dev
   ```

3. Seeder la base de données (données de test):
   ```bash
   npx prisma db seed
   ```
   *Compte Admin par défaut:* `admin@ergo.com` / `Admin123!`

4. Lancer l'application en mode watch:
   ```bash
   npm run start:dev
   ```

## Documentation API

La documentation Swagger est disponible sur:
`http://localhost:3000/api/docs`

## Tests

```bash
# Tests unitaires
npm run test

# Tests E2E
npm run test:e2e
```

## Structure du Projet

- `src/app.module.ts`: Module racine
- `src/prisma/`: Configuration Prisma
- `src/auth/`: Authentification & Guards
- `src/users/`: Gestion utilisateurs
- `src/blog/`: Blog (Posts, Catégories, Commentaires)
- `src/events/`: Événements
- `src/ergo-news/`: Actualités Ergo
- `src/team/`: Équipe & Rôles
- `src/partners/`: Partenaires
- `src/works/`: Réalisations
- `src/newsletter/`: Newsletter
- `src/home/`: Données Homepage
- `src/stats/`: Dashboard & Analytics
- `src/upload/`: Service Upload Cloudinary
- `src/cache/`: Configuration Redis Cache

## Déploiement

Pour la production:

```bash
npm run build
npm run start:prod
```

Assurez-vous que les variables d'environnement de production sont correctement configurées.
