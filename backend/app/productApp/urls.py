from django.contrib import admin
from django.urls import include, path

from productApp.views import(
    create_product,
    add_product_photo,
    return_product,
    upload_product_photo,
    view_product_photo
)


urlpatterns = [
   
    path('createProduct/', create_product, name='create_product'),
    path('add-product-photo/', add_product_photo, name='add_product_photo'),
    
    
    #path('products/', get_all_products, name='all_products')
    path('returnProduct', return_product, name='return_product'),
    path('upload_photo', upload_product_photo, name='upload_product_photo'),
    path('photo/<str:photo_metadata>/', view_product_photo, name='view_photo'),
]
