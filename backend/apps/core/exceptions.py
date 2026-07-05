"""
Gestionnaire d'exceptions personnalisé — format uniforme pour toutes les erreurs API.
{
  "error": "validation_error",
  "message": "Les données soumises sont invalides.",
  "details": { "field": ["message"] }
}
"""
import logging
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

logger = logging.getLogger("apps")


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        logger.exception("Unhandled exception in %s", context.get("view"))
        return Response(
            {"error": "server_error", "message": "Une erreur interne est survenue."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    error_map = {
        400: "bad_request",
        401: "unauthorized",
        403: "forbidden",
        404: "not_found",
        405: "method_not_allowed",
        429: "rate_limited",
    }

    response.data = {
        "error": error_map.get(response.status_code, "error"),
        "message": _extract_message(response.data),
        "details": response.data if isinstance(response.data, dict) else {},
    }
    return response


def _extract_message(data):
    if isinstance(data, dict):
        if "detail" in data:
            return str(data["detail"])
        return "Les données soumises sont invalides."
    if isinstance(data, list):
        return str(data[0]) if data else "Erreur inconnue."
    return str(data)
