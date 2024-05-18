from django.contrib import admin
from django.urls import include, path

from profileApp.views import(
    getProfile,
    # updateProfile,
    custom_login,
    custom_register,
    verify_business,
    get_unverified_businesses,
    generate_gift_card,
    get_gift_cards_of_customer,
    redeem_gift_card,
)


urlpatterns = [
    #Authentication
    # path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', custom_register, name='auth_register'),
    path('login/', custom_login, name='auth_login'),
    path('verify-business/', verify_business, name='verify_business'),
    path('get-unverified-businesses/', get_unverified_businesses, name='get_unverified_bus'),
    path('generate-gift-card/', generate_gift_card, name= 'generate_gift_card'),
    path('my-gift-cards/', get_gift_cards_of_customer, name='get_my_cards'),
    path('redeem-gift-card/', redeem_gift_card, name='redeem_gift_card'),

    #Profile
    path('profilePage/', getProfile, name='profile'),
    # path('profile/update/', updateProfile, name='update-profile'),
    
]
