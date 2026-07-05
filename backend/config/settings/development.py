"""Settings de développement local."""
import os
import dj_database_url
from .base import *

SECRET_KEY = os.environ.get(
    "DJANGO_SECRET_KEY",
    "django-insecure-dev-key-change-in-production-never-use-this",
)
DEBUG = True
ALLOWED_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0"]

# Base de données locale (Docker ou Neon en dev)
DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgres://lily:lily_dev_password@localhost:5432/lily_florist",
)
DATABASES = {
    "default": dj_database_url.config(
        default=DATABASE_URL,
        conn_max_age=60,
    )
}

# CORS large en dev
CORS_ALLOW_ALL_ORIGINS = True

# Email dans la console en dev
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# Debug toolbar (optionnel)
INSTALLED_APPS += ["debug_toolbar"]  # noqa: F405
MIDDLEWARE.insert(0, "debug_toolbar.middleware.DebugToolbarMiddleware")  # noqa: F405
INTERNAL_IPS = ["127.0.0.1"]
