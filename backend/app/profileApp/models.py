# from django.db import models


# class Profile(models.Model):
#     id = models.AutoField(primary_key=True)
#     name = models.CharField(max_length=80)
#     email = models.EmailField(unique=True)
#     password = models.CharField(max_length=50)
#     image_metadata = models.CharField(max_length=100, blank=True, null=True)
#     image_blob = models.BinaryField(blank=True, null=True)

#     class Meta:
#         managed = False
#         db_table = 'profile'


# class Customer(models.Model):
#     id = models.AutoField(primary_key=True)
#     balance = models.DecimalField(max_digits=10, decimal_places=2)
#     delivery_address = models.CharField(max_length=100)

#     class Meta:
#         managed = False
#         db_table = 'customer'


# class Admin(models.Model):
#     id = models.AutoField(primary_key=True)

#     class Meta:
#         managed = False
#         db_table = 'admin'


# class Business(models.Model):
#     id = models.AutoField(primary_key=True)
#     income = models.DecimalField(max_digits=10, decimal_places=2)
#     verifying_admin = models.IntegerField()
#     verification_date = models.DateField()
#     iban = models.CharField(max_length=30)

#     class Meta:
#         managed = False
#         db_table = 'business'


# class Report(models.Model):
#     report_id = models.AutoField(primary_key=True)
#     admin_id = models.IntegerField()
#     description = models.TextField()
#     report_time = models.DateTimeField()
#     graph_data = models.BinaryField()
#     graph_metadata = models.CharField(max_length=150)

#     class Meta:
#         managed = False
#         db_table = 'report'


# class GiftCard(models.Model):
#     gift_id = models.AutoField(primary_key=True)
#     cust_id = models.IntegerField()
#     business_id = models.IntegerField()
#     gift_amount = models.DecimalField(max_digits=10, decimal_places=2)
#     gift_message = models.TextField(blank=True, null=True)
#     creation_date = models.DateField()
#     redemption_date = models.DateField(blank=True, null=True)

#     class Meta:
#         managed = False
#         db_table = 'giftcard'
