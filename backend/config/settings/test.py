"""Settings pour pytest — base de données en mémoire, pas de debug toolbar."""
import dj_database_url
from .base import *  # noqa: F401, F403

SECRET_KEY = "test-secret-key-not-for-production"
DEBUG = False
ALLOWED_HOSTS = ["*"]

DATABASES = {
    "default": dj_database_url.config(
        default="postgres://lily:lily_test_password@localhost:5432/lily_test",
    )
}

CORS_ALLOW_ALL_ORIGINS = True
EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"

# Désactiver debug toolbar en test
INSTALLED_APPS = [app for app in INSTALLED_APPS if app != "debug_toolbar"]  # noqa: F405
MIDDLEWARE = [m for m in MIDDLEWARE if "debug_toolbar" not in m]  # noqa: F405

# Accélère les tests (pas de hachage fort)
PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]
