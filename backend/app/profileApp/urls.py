from django.contrib import admin
from django.urls import include, path

from .views import(
    getProfile,
    # updateProfile,
    custom_login,
    custom_register,
    verify_business,
    get_unverified_businesses,
    generate_gift_card,
    get_gift_cards_of_customer,
    redeem_gift_card,
    view_profile_photo,
    upload_profile_photo,
    update_balance,
    update_profile,
    get_gift_cards_from_business
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
    path('upload-image/', upload_profile_photo, name='upload_photo'),
    path('image/<str:image_metadata>/', view_profile_photo, name='view_photo'),
    path('update-balance/', update_balance, name='update_balance'),
    path('update-profile/', update_profile, name='update_profile'),
    path('get-generated-gift-cards/', get_gift_cards_from_business, name='get_generated_gift_cards'),
    #Profile
    path('profilePage/', getProfile, name='profile'),
    # path('profile/update/', updateProfile, name='update-profile'),
    
]
