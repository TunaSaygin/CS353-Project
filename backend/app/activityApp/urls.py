from django.contrib import admin
from django.urls import include, path

from activityApp.views import(
    get_all_businesses,
    get_all_customers
)


urlpatterns = [
   
    path('get-all-businesses/', get_all_businesses, name='get_all_businesses'),
    path('get-all-customers/', get_all_customers, name='get_all_customers'),
  
    

]
