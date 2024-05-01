from django.db import models

class AdminActivity(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=80)
    report_id = models.IntegerField()
    description = models.TextField()
    report_time = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'admin_activity'


class CustomerOverview(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=80)
    email = models.EmailField()
    balance = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_address = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'customer_overview'


class BusinessVerificationStatus(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=80)
    image_metadata = models.CharField(max_length=100)
    image_blob = models.BinaryField()
    verifying_admin = models.IntegerField()
    verification_date = models.DateField()
    admin_id = models.IntegerField()
    admin_name = models.CharField(max_length=80)

    class Meta:
        managed = False
        db_table = 'business_verification_status'


class ProductRatings(models.Model):
    name = models.CharField(max_length=50)
    rate_amount = models.DecimalField(max_digits=3, decimal_places=2)
    comment = models.TextField()

    class Meta:
        managed = False
        db_table = 'product_ratings'


class ProductListings(models.Model):
    name = models.CharField(max_length=50)
    current_price = models.DecimalField(max_digits=10, decimal_places=2)
    inventory = models.IntegerField()
    category_name = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'product_listings'
