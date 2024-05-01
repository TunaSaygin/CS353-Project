from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import MyTokenObtainPairView, RegisterView, getProfile, updateProfile

urlpatterns = [
    #Authentication
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='auth_register'),

    #Profile
    path('profilePage/', getProfile, name='profile'),
    # path('profile/update/', updateProfile, name='update-profile'),
]
