from django.contrib import admin
from django.urls import include, path

from activityApp.views import(
    get_all_businesses,
    get_all_customers,
    get_all_purchases
)


urlpatterns = [
   
    path('get-all-businesses/', get_all_businesses, name='get_all_businesses'),
    path('get-all-customers/', get_all_customers, name='get_all_customers'),
    path('get-all-purchases/', get_all_purchases, name='get_all_purchases'),
  
    

]
