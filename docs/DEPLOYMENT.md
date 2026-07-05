# 🚀 Guide de Déploiement Complet

## Pré-requis
- Compte GitHub avec le repo pushé
- Compte Render connecté au repo GitHub
- Compte Neon pour PostgreSQL

## Étape 1 — Base de données Neon
1. neon.tech → New Project → "lily-florist", région eu-west-2
2. Copier la connection string : postgresql://user:pass@host/db?sslmode=require

## Étape 2 — Push GitHub + Render Blueprint
```bash
git init && git add . && git commit -m "feat: initial setup"
git remote add origin https://github.com/TON_USERNAME/lily-florist.git
git push -u origin main
```
Render : Dashboard → New → Blueprint → connecter le repo
Render lit render.yaml automatiquement.
Renseigner DATABASE_URL manuellement avec la connection string Neon.

## Étape 3 — Variables d'environnement backend
```
DJANGO_SETTINGS_MODULE = config.settings.production
DJANGO_SECRET_KEY      = <généré par Render>
DATABASE_URL           = postgresql://...neon.tech/...?sslmode=require
ALLOWED_HOSTS          = lily-api.onrender.com
CORS_ALLOWED_ORIGINS   = https://lily-florist.onrender.com
```

## Étape 4 — Variable frontend
```
VITE_API_URL = https://lily-api.onrender.com
```

## Étape 5 — Dev local WSL+Docker
```bash
cp backend/.env.example backend/.env
docker compose -f docker/docker-compose.yml up --build -d
docker compose -f docker/docker-compose.yml exec api python manage.py migrate
docker compose -f docker/docker-compose.yml exec api python manage.py loaddata apps/products/fixtures/initial_products.json
docker compose -f docker/docker-compose.yml exec api python manage.py createsuperuser
# Frontend → http://localhost:5173
# API      → http://localhost:8000/api/v1/
# Swagger  → http://localhost:8000/api/docs/
# Admin    → http://localhost:8000/admin/
```

## Étape 6 — Tests
```bash
cd backend && pytest tests/ -v --cov=apps
cd frontend && pnpm install && pnpm test:coverage
cd frontend && pnpm test:e2e
```

## Checklist pré-prod
- [ ] render.yaml à la racine du repo
- [ ] DATABASE_URL Neon dans Render
- [ ] ALLOWED_HOSTS et CORS_ALLOWED_ORIGINS corrects
- [ ] VITE_API_URL pointe vers l'API Render
- [ ] loaddata initial_products.json exécuté
- [ ] createsuperuser exécuté
- [ ] Tests CI verts
- [ ] Parcours achat complet testé
