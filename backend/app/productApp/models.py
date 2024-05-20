# from django.db import models
#
#
# class Category(models.Model):
#     category_id = models.AutoField(primary_key=True)
#     category_name = models.CharField(max_length=50)
#
#     class Meta:
#         managed = False
#         db_table = 'category'
#
#
# class HandcraftedGood(models.Model):
#     b_id = models.IntegerField()
#     p_id = models.AutoField(primary_key=True)
#     inventory = models.IntegerField()
#     current_price = models.DecimalField(max_digits=10, decimal_places=2)
#     name = models.CharField(max_length=50)
#     return_period = models.IntegerField()
#     description = models.CharField(max_length=255)
#     recipient_type = models.CharField(max_length=50)
#     materials = models.CharField(max_length=50)
#
#     class Meta:
#         managed = False
#         db_table = 'handcraftedgood'
#
#
# class ProductPhoto(models.Model):
#     p_id = models.IntegerField(primary_key=True)
#     b_id = models.IntegerField()
#     photo_metadata = models.CharField(max_length=100)
#     photo_blob = models.BinaryField()
#
#     class Meta:
#         managed = False
#         db_table = 'productphoto'
#         unique_together = (('p_id', 'photo_metadata'),)
#
# class Belong(models.Model):
#     category_id = models.IntegerField()
#     p_id = models.IntegerField()
#
#     class Meta:
#         managed = False
#         db_table = 'belong'
#         unique_together = [['category_id', 'p_id']]
#
#
# class PastPrice(models.Model):
#     p_id = models.AutoField(primary_key=True)
#     change_date = models.DateField()
#     price = models.DecimalField(max_digits=10, decimal_places=2)
#
#     class Meta:
#         managed = False
#         db_table = 'pastprice'
#
#
# class Rates(models.Model):
#     c_id = models.IntegerField()
#     p_id = models.IntegerField()
#     rate_amount = models.DecimalField(max_digits=3, decimal_places=2)
#     comment = models.TextField()
#
#     class Meta:
#         managed = False
#         db_table = 'rates'
#         unique_together = [['c_id', 'p_id']]
