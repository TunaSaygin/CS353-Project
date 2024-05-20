# from django.db import models
#
#
# class Purchase(models.Model):
#     c_id = models.IntegerField()
#     p_id = models.IntegerField()
#     p_date = models.DateTimeField()
#     p_price = models.DecimalField(max_digits=10, decimal_places=2)
#     return_date = models.DateTimeField()
#
#     class Meta:
#         managed = False
#         db_table = 'purchase'
#         unique_together = [['c_id', 'p_id', 'p_date']]
#
#
# class Wishlist(models.Model):
#     c_id = models.IntegerField()
#     p_id = models.IntegerField()
#
#     class Meta:
#         managed = False
#         db_table = 'wishlist'
#         unique_together = [['c_id', 'p_id']]
#
#
# class ShoppingCart(models.Model):
#     c_id = models.IntegerField()
#     p_id = models.IntegerField()
#     quantity = models.IntegerField()
#
#     class Meta:
#         managed = False
#         db_table = 'shoppingcart'
#         unique_together = [['c_id', 'p_id']]
