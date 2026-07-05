# ── Stage 1 : dépendances ────────────────────────────────────────
FROM python:3.12-slim AS builder

WORKDIR /app

# Dépendances système minimales
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements/base.txt requirements/base.txt
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements/base.txt

# ── Stage 2 : runtime ────────────────────────────────────────────
FROM python:3.12-slim AS runtime

# Utilisateur non-root
RUN useradd --create-home --shell /bin/bash app
WORKDIR /app

# Copier les dépendances depuis builder
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copier le code
COPY --chown=app:app . .

USER app

# Variables d'environnement
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=config.settings.production

# Collecter les fichiers statiques
RUN python manage.py collectstatic --noinput

EXPOSE 8000

# Commande de démarrage
CMD ["gunicorn", "config.wsgi:application", \
     "--bind", "0.0.0.0:8000", \
     "--workers", "2", \
     "--threads", "4", \
     "--worker-class", "gthread", \
     "--access-logfile", "-", \
     "--error-logfile", "-", \
     "--timeout", "60"]
