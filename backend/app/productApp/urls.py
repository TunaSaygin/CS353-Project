from django.contrib import admin
from django.urls import include, path

from .views import (
    create_product,
    add_product_photo,
    return_product,
    upload_product_photo,
    view_product_photo,
    product_rating,
    get_product_rating_details
)

urlpatterns = [

    path('createProduct/', create_product, name='create_product'),
    path('add-product-photo/', add_product_photo, name='add_product_photo'),
    
    
    #path('products/', get_all_products, name='all_products')
    path('returnProduct', return_product, name='return_product'),
    path('upload_photo', upload_product_photo, name='upload_product_photo'),
    path('photo/<str:photo_metadata>/', view_product_photo, name='view_photo'),
    path('rate/pid/<int:product_id>/', product_rating, name='post_product_rating'),
    path('rating/pid/<int:product_id>/', get_product_rating_details, name='product_rating'),

]
