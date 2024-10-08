from django.contrib import admin
from django.urls import include, path

from .views import (
    create_product,
    add_product_photo,
    return_product,
    upload_product_photo,
    view_product_photo,
    product_rating,
    get_product_rating_details,
    update_product,
    update_product_photo,
    list_categories,
    add_category,
    update_category,
    delete_category
)

urlpatterns = [

    path('createProduct/', create_product, name='create_product'),
    path('add-product-photo/', add_product_photo, name='add_product_photo'),
    path('update-product/', update_product, name='update_product'),
    path('update-photo/', update_product_photo, name='update_product_photo'),
    #path('products/', get_all_products, name='all_products')
    path('returnProduct', return_product, name='return_product'),
    path('upload_photo', upload_product_photo, name='upload_product_photo'),
    path('photo/<str:photo_metadata>/', view_product_photo, name='view_photo'),
    path('rate/pid/<int:product_id>/', product_rating, name='post_product_rating'),
    path('rating/pid/<int:product_id>/', get_product_rating_details, name='product_rating'),
    path('list-categories/', list_categories, name='list_categories'),
    path('add-category/', add_category, name='add_category'),
    path('update-category/', update_category, name='update_category'),
    path('delete-category/', delete_category, name='delete_category'),
]
