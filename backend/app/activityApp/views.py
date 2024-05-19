import logging
from venv import logger
from django.shortcuts import render
from django.http import JsonResponse
from django.db import connection
from rest_framework.decorators import api_view, permission_classes
import psycopg2
from django.http import HttpResponse
import uuid
import mimetypes
from rest_framework.response import Response
from rest_framework.decorators import permission_classes
from profileApp.custom_permission import CustomPermission, get_uid

logger = logging.getLogger(__name__)

# Create your views here.
@api_view(['GET'])
@permission_classes([CustomPermission])
def get_all_businesses(request):
    try:
        user_id = get_uid(request)
        logger.info(f"User ID: {user_id}")

        if not user_id:
            return Response({'error': 'User ID not found'}, status=400)

        with connection.cursor() as cursor:
            # Check if the user is an admin
            cursor.execute("""
                SELECT COUNT(*) FROM admin WHERE id = %s
            """, [user_id])
            is_admin = cursor.fetchone()[0]
            logger.info(f"Is Admin: {is_admin}")

            if not is_admin:
                return Response({'error': 'Permission denied'}, status=403)

            # Fetch all businesses
            cursor.execute("""
                WITH pid_bid_sum AS (
                           select hg.b_id as b_id, hg.p_id as p_id,hg.name as name,sum(p.p_price) as total_price                       
                           FROM handcraftedgood hg
                           JOIN purchase p ON hg.p_id = p.p_id
                           GROUP BY hg.b_id, hg.p_id, hg.name
                ),
                bid_max AS (
                           select pbs.b_id as b_id, max(pbs.total_price) as max_price
                           FROM pid_bid_sum as pbs
                           GROUP BY pbs.b_id
                ),
                pid_bid_max AS (
                           select bm.b_id, pbs.name as product_name, bm.max_price
                           FROM pid_bid_sum pbs JOIN bid_max bm ON pbs.b_id = bm.b_id and pbs.total_price=bm.max_price             
                )SELECT b.id,b.income ,p.name,pbm.product_name
                           FROM business b NATURAL JOIN profile p
                           LEFT JOIN pid_bid_max pbm ON b.id = pbm.b_id           
            """)
            rows = cursor.fetchall()
            logger.info(f"Rows fetched: {rows}")

            if not rows:
                logger.info("No businesses found")
                return Response([], status=200)

            # Get column names
            columns = [col[0] for col in cursor.description]
            logger.info(f"Columns: {columns}")

            # Construct a list of dictionaries representing the businesses
            businesses = [dict(zip(columns, row)) for row in rows]

        return Response(businesses, status=200)

    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return Response({'error': str(e)}, status=400)
    
@api_view(['GET'])
@permission_classes([CustomPermission])
def get_all_customers(request):
    try:
        user_id = get_uid(request)
        logger.info(f"User ID: {user_id}")

        if not user_id:
            return Response({'error': 'User ID not found'}, status=400)

        with connection.cursor() as cursor:
            # Check if the user is an admin
            cursor.execute("""
                SELECT COUNT(*) FROM admin WHERE id = %s
            """, [user_id])
            is_admin = cursor.fetchone()[0]
            logger.info(f"Is Admin: {is_admin}")

            if not is_admin:
                return Response({'error': 'Permission denied'}, status=403)

            # Fetch all customers
            cursor.execute("""
                SELECT id, balance, delivery_address, name FROM customer NATURAL JOIN profile
            """)
            rows = cursor.fetchall()
            logger.info(f"Rows fetched: {rows}")

            if not rows:
                logger.info("No customers found")
                return Response([], status=200)

            # Get column names
            columns = [col[0] for col in cursor.description]
            logger.info(f"Columns: {columns}")

            # Construct a list of dictionaries representing the customers
            customers = [dict(zip(columns, row)) for row in rows]

        return Response(customers, status=200)

    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return Response({'error': str(e)}, status=400)
    
@api_view(['GET'])
@permission_classes([CustomPermission])
def get_most_sold_product(request, business_id):
    try:
        user_id = get_uid(request)
        logger.info(f"User ID: {user_id}")

        if not user_id:
            return Response({'error': 'User ID not found'}, status=400)

        with connection.cursor() as cursor:
            # Verify if the user is an admin
            cursor.execute("""
                SELECT COUNT(*) FROM admin WHERE id = %s
            """, [user_id])
            is_admin = cursor.fetchone()[0]
            logger.info(f"Is Admin: {is_admin}")

            if not is_admin:
                return Response({'error': 'Permission denied'}, status=403)

            # Query to get the most sold product for the specified business
            cursor.execute("""
                SELECT p.p_id, hg.name, hg.description, hg.current_price, COUNT(*) as total_sold
                FROM purchase p
                JOIN handcraftedgood hg ON p.p_id = hg.p_id
                WHERE hg.b_id = %s
                GROUP BY p.p_id, hg.name, hg.description, hg.current_price
                ORDER BY total_sold DESC
                LIMIT 1
            """, [business_id])
            row = cursor.fetchone()
            logger.info(f"Most Sold Product: {row}")

            if not row:
                logger.info("No sales found for this business")
                return Response({'message': 'No sales found for this business'}, status=200)

            # Get column names
            columns = [col[0] for col in cursor.description]
            logger.info(f"Columns: {columns}")

            # Construct a dictionary representing the most sold product
            most_sold_product = dict(zip(columns, row))

        return Response(most_sold_product, status=200)

    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return Response({'error': str(e)}, status=400)

@api_view(['GET'])
@permission_classes([CustomPermission])
def get_all_purchases(request):
    if request.method == 'GET':
        try:
            user_id = get_uid(request)
            # Get customer ID from the request
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT COUNT(*) FROM admin WHERE id = %s
                """, [user_id])
                is_admin = cursor.fetchone()[0]
                logger.info(f"Is Admin: {is_admin}")

                if not is_admin:
                    return Response({'error': 'Permission denied'}, status=403)
                # Fetch purchase history for the given customer ID
                cursor.execute("""SELECT purchase.c_id, purchase.p_date, 
                               purchase.return_date,  p1.name as customer_name, p2.name as business_name,
                               hg.name as product_name
                               FROM purchase 
                               JOIN profile p1 ON p1.id = purchase.c_id
                               JOIN handcraftedgood hg ON hg.p_id = purchase.p_id
                               JOIN profile p2 ON p2.id = hg.b_id
                               """,[])
                rows = cursor.fetchall()
                columns = [col[0] for col in cursor.description]

            # Construct a list of dictionaries representing the customers
            purchases = [dict(zip(columns, row)) for row in rows]

            return Response(purchases, status=200)
        except Exception as e:
            return Response({'error': str(e)}, status=400)
    else:
        return Response({'error': 'Invalid request method'}, status=405)