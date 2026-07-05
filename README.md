# 🌸 Lily's Florist — Architecture Senior Full-Stack

> **Stack** : Django REST (Render) · PostgreSQL (Neon) · React + Vite (Render) · Docker + WSL · JWT Auth · CI/CD GitHub Actions

---

## 📐 Architecture Globale

```
┌─────────────────────────────────────────────────────────────────┐
│                        INTERNET / CDN                           │
└───────────────────┬─────────────────────┬───────────────────────┘
                    │                     │
          ┌─────────▼──────┐    ┌────────▼────────┐
          │  React (Render) │    │  Django (Render) │
          │  Static Build   │    │  REST API        │
          │  + Nginx        │    │  Gunicorn        │
          └─────────────────┘    └────────┬────────┘
                                          │
                                 ┌────────▼────────┐
                                 │  Neon PostgreSQL │
                                 │  (Serverless)    │
                                 └─────────────────┘
```

## 🗂 Structure du Projet

```
lily-florist/
├── backend/                    # Django REST Framework
│   ├── apps/
│   │   ├── core/               # Utilitaires, middleware, base models
│   │   ├── users/              # Auth JWT, profils, adresses
│   │   ├── products/           # Catalogue, catégories, stock
│   │   └── orders/             # Panier, commandes, livraisons
│   ├── config/                 # Settings (base/dev/prod/test)
│   ├── tests/
│   │   ├── unit/               # pytest
│   │   ├── integration/        # API tests
│   │   └── e2e/                # Playwright
│   ├── Dockerfile
│   ├── requirements/
│   │   ├── base.txt
│   │   ├── dev.txt
│   │   └── prod.txt
│   └── manage.py
│
├── frontend/                   # React + Vite + TypeScript
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/     # UI atomiques, layout, features
│   │   │   ├── pages/          # Route-level components
│   │   │   ├── hooks/          # Custom hooks
│   │   │   ├── services/       # API clients (axios)
│   │   │   ├── store/          # Zustand (cart, auth, ui)
│   │   │   └── types/          # TypeScript interfaces
│   │   └── styles/
│   ├── __tests__/              # Vitest + RTL + Playwright
│   ├── Dockerfile
│   └── nginx.conf
│
├── docker/
│   ├── docker-compose.yml      # Dev local
│   └── docker-compose.prod.yml # Prod-like
│
├── .github/
│   └── workflows/
│       ├── ci.yml              # Lint + Tests + Build
│       └── deploy.yml          # Deploy on Render
│
└── docs/
    ├── API.md                  # Swagger / OpenAPI
    ├── SECURITY.md
    └── DEPLOYMENT.md
```

## 🚀 Démarrage rapide (WSL + Docker)

```bash
# 1. Cloner & entrer dans le projet
git clone <repo> && cd lily-florist

# 2. Copier les variables d'environnement
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Lancer avec Docker Compose
docker compose -f docker/docker-compose.yml up --build

# 4. Migrations & seed
docker compose exec api python manage.py migrate
docker compose exec api python manage.py loaddata initial_products
```

## 🔐 Sécurité

- JWT (access 15min / refresh 7j) via `djangorestframework-simplejwt`
- HTTPS forcé en production (HSTS)
- Rate limiting sur les endpoints auth (django-ratelimit)
- CORS strict par domaine
- CSRF protection
- Secrets via variables d'environnement (jamais dans le code)
- Dépendances auditées : `pip-audit` + `npm audit`

## 🧪 Tests

| Couche | Outil | Quoi |
|--------|-------|------|
| Backend Unit | pytest + pytest-django | Models, services, utils |
| Backend API | pytest + DRF test client | Endpoints REST |
| Frontend Unit | Vitest + React Testing Library | Composants, hooks, store |
| E2E | Playwright | Parcours utilisateur complets |
| Perf | Lighthouse CI | Score > 90 sur toutes métriques |

## 📦 Déploiement

| Service | Plateforme | Commande |
|---------|-----------|----------|
| API Django | Render Web Service | `gunicorn config.wsgi` |
| React | Render Static Site | `npm run build` |
| DB | Neon PostgreSQL | Managed |
