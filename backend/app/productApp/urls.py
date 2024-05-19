from django.contrib import admin
from django.urls import include, path

from .views import (
    create_product,
    add_product_photo,
    product_rating,
    get_product_rating_details
)

urlpatterns = [

    path('createProduct/', create_product, name='create_product'),
    path('add-product-photo/', add_product_photo, name='add_product_photo'),
    path('rate/pid/<int:product_id>/', product_rating, name='post_product_rating'),
    path('rating/pid/<int:product_id>/', get_product_rating_details, name='product_rating'),

]
