from django.contrib import admin
from django.urls import include, path

from profileApp.views import(
    getProfile,
    updateProfile,
    custom_login,
    custom_register
)


urlpatterns = [
    #Authentication
    # path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', custom_register, name='auth_register'),
    path('login', custom_login, name='auth_login'),

    #Profile
    path('profilePage/', getProfile, name='profile'),
    path('profile/update/', updateProfile, name='update-profile'),
]
