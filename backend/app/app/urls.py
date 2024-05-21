from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('profile/', include('profileApp.urls')),
    path('activity/', include('activityApp.urls')),
    path('purchase/', include('purchaseApp.urls')),
    path('product/', include('productApp.urls')),
]
