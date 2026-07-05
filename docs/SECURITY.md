# Sécurité — Lily's Florist

## Vue d'ensemble

| Couche | Mesure | Outil |
|--------|--------|-------|
| Auth | JWT access (15min) + refresh (7j) blacklisté | djangorestframework-simplejwt |
| Transport | HTTPS forcé, HSTS 1 an | Django SecurityMiddleware |
| CORS | Origines strictement autorisées | django-cors-headers |
| API | Rate limiting (login : 5/min, global : 100/min) | django-ratelimit |
| Mots de passe | bcrypt via Django + règles complexité | AUTH_PASSWORD_VALIDATORS |
| Dépendances | Audit automatique CI | pip-audit + npm audit |
| Headers | X-Frame-Options, CSP, XSS-Protection | Django + Nginx |
| Données | UUID pour les IDs (non-devinables) | |
| Sessions | Pas de sessions Django — stateless JWT | |
| SQL | ORM Django paramétré — pas de raw SQL | |

## Authentification JWT

```
Client → POST /api/v1/auth/login/
       ← { access (15min), refresh (7j) }

Client → GET /api/v1/... avec Authorization: Bearer <access>
       → si 401 : POST /api/v1/auth/refresh/ avec { refresh }
                ← { access, refresh (si rotation) }

Client → POST /api/v1/auth/logout/ avec { refresh }
       ← 205 (refresh blacklisté)
```

Le token d'accès n'est **jamais** stocké dans localStorage.
Il vit en mémoire (Zustand) et est perdu à la fermeture de l'onglet.
Le refresh token est en `sessionStorage`.

## Variables d'environnement requises

### Backend (Render → Environment)
```
DJANGO_SECRET_KEY=<50 chars aléatoires — générer avec: python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())">
DATABASE_URL=postgresql://...  (fourni par Neon)
ALLOWED_HOSTS=lily-api.onrender.com
CORS_ALLOWED_ORIGINS=https://lily-florist.onrender.com
EMAIL_HOST_PASSWORD=<sendgrid api key>
DEFAULT_FROM_EMAIL=noreply@lilys-florist.com
```

### Frontend (Render → Build vars)
```
VITE_API_URL=https://lily-api.onrender.com
```

## Checklist pré-lancement

- [ ] `DEBUG=False` en production
- [ ] `SECRET_KEY` générée (jamais depuis le code)
- [ ] `ALLOWED_HOSTS` restreint au domaine Render
- [ ] Certificat SSL actif (Render le gère)
- [ ] `pip-audit` sans vulnérabilité critique
- [ ] `npm audit` sans vulnérabilité high/critical
- [ ] Rate limiting testé sur les endpoints auth
- [ ] Admin Django accessible uniquement en interne
