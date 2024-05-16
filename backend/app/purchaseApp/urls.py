from django.contrib import admin
from django.urls import include, path

from purchaseApp.views import(
    list_all_products,
    view_product,
    add_to_cart,
    purchase
)


urlpatterns = [
   
    path('all-products/', list_all_products, name='list_all_products'),
    path('view-product/', view_product, name='view_product'),
    path('add-to-cart/', add_to_cart, name='add_to_cart'),
    path('purchase/', purchase, name='purchase'),
    
    

]
