from django.contrib import admin
from django.urls import include, path

from productApp.views import(
    create_product,
    add_product_photo
)


urlpatterns = [
   
    path('createProduct/', create_product, name='create_product'),
    path('add-product-photo/', add_product_photo, name='add_product_photo'),
    
    

]
