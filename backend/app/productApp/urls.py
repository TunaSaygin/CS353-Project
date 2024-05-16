from django.contrib import admin
from django.urls import include, path

from productApp.views import(
    create_product,
    get_all_products
)


urlpatterns = [
   
    path('createProduct/', create_product, name='create_product'),
    path('products/', get_all_products, name='all_products'),
    

]
