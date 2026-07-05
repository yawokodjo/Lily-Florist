from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path("admin/", admin.site.urls),

    # API v1
    path("api/v1/", include([
        path("auth/", include("apps.users.urls.auth")),
        path("users/", include("apps.users.urls.users")),
        path("products/", include("apps.products.urls")),
        path("orders/", include("apps.orders.urls")),
    ])),

    # Documentation OpenAPI (désactivée en prod si souhaité)
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
]

if settings.DEBUG:
    from django.conf.urls.static import static
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
