from django.contrib import admin
from django.urls import include, path

from activityApp.views import(
    get_all_businesses,
    get_all_customers,
    get_all_purchases,
    create_report,
    list_reports,
    view_category_reports,
    view_business_reports,
)


urlpatterns = [
   
    path('get-all-businesses/', get_all_businesses, name='get_all_businesses'),
    path('get-all-customers/', get_all_customers, name='get_all_customers'),
    path('get-all-purchases/', get_all_purchases, name='get_all_purchases'),
    path('create-report/',create_report,name='create_report'),
    path('list-reports/',list_reports, name= 'list_reports'),
    path('view-category-reports/<int:report_id>',view_category_reports,name='view_category_reeports'),
    path('view-business-reports/<int:report_id>',view_business_reports,name='view_business_reeports')
]
