from django.contrib import admin
from django.urls import include, path

from purchaseApp.views import(
    list_all_products,
    view_product,
    add_to_cart,
    purchase,
    add_to_wishlist,
    delete_from_wishlist,
    get_wishlist,
    get_purchase_history,
    get_business_products,
    get_shopping_cart,
    delete_from_shopping_cart,
    decrease_item_quantity,
    get_business_purchase_history
)


urlpatterns = [
   
    path('all-products/', list_all_products, name='list_all_products'),
    path('view-product/<int:selected_pid>/', view_product, name='view_product'),
    path('business-products', get_business_products,name='bussiness_products'),
    path('add-to-cart/', add_to_cart, name='add_to_cart'),
    path('purchase/', purchase, name='purchase'),
    path('add-to-wishlist/', add_to_wishlist, name='add_to_wishlist'),
    path('delete-from-wishlist/', delete_from_wishlist, name='delete_from_wishlist'),
    path('get-wishlist/', get_wishlist, name='get_wishlist'),
    path('get-shopping-cart/', get_shopping_cart, name='get_shopping_cart'),
    path('get-purchase-hist/', get_purchase_history, name='get_purchase_hist'),
    path('get-business-purchase-hist/', get_business_purchase_history, name='get_business_purchase_hist'),
    path('delete-from-shopping-cart/', delete_from_shopping_cart, name='delete_from_shopping_cart'),
    path('decrease-cart-item/', decrease_item_quantity, name='decrease_cart_item')

]
