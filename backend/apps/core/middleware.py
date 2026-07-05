import logging
import time

logger = logging.getLogger("apps")


class RequestLoggingMiddleware:
    """Log chaque requête avec sa durée — utile pour détecter les lenteurs."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start = time.monotonic()
        response = self.get_response(request)
        duration_ms = (time.monotonic() - start) * 1000

        # Ne logger que les appels API (pas les fichiers statiques)
        if request.path.startswith("/api/"):
            logger.info(
                "%s %s → %s (%.0fms)",
                request.method,
                request.path,
                response.status_code,
                duration_ms,
            )

        return response
