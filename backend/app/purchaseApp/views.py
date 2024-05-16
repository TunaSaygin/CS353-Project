from django.db import connection
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def list_all_products(request):
    # Extracting filter parameters from the request
    product_type = request.query_params.get('product_type')
    min_price = request.query_params.get('min_price')
    max_price = request.query_params.get('max_price')
    business_name = request.query_params.get('business_name')

    # Constructing the SQL query dynamically based on the provided filters
    query = """
        SELECT * FROM handcraftedgood
        WHERE 1=1
    """
    params = []

    if product_type:
        query += " AND product_type = %s"
        params.append(product_type)

    if min_price:
        query += " AND current_price >= %s"
        params.append(min_price)

    if max_price:
        query += " AND current_price <= %s"
        params.append(max_price)

    if business_name:
        query += " AND business_name = %s"
        params.append(business_name)

    with connection.cursor() as cursor:
        cursor.execute(query, params)
        products = cursor.fetchall()

    # TODO: Serialize the products before returning the response
    return Response(products)


@api_view(['POST'])
def view_product(request):
    # Extracting selected product ID from request data
    selected_pid = request.data.get('selected_pid')

    # Fetching details of the selected product
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT h.name, h.current_price AS current_price, pp.price AS past_price, h.inventory, p.photo_metadata, p.photo_blob, c.category_name
            FROM handcraftedgood h
            JOIN productphoto p ON h.p_id = p.p_id
            JOIN category c ON h.category_id = c.category_id
            LEFT JOIN (
                SELECT p_id, price AS price
                FROM pastprice
                WHERE change_date = (
                    SELECT MAX(change_date)
                    FROM pastprice
                    WHERE p_id = %s
                )
            ) pp ON h.p_id = pp.p_id
            WHERE h.p_id = %s
        """, [selected_pid, selected_pid])
        product_details = cursor.fetchone()

    return Response(product_details)


@api_view(['POST'])
def add_to_cart(request):
    # Extracting customer ID, product ID, and quantity from request data
    customer_id = request.data.get('customer_id')
    product_id = request.data.get('product_id')
    quantity = request.data.get('quantity')

    # Adding product to shopping cart or updating quantity if already exists
    with connection.cursor() as cursor:
        cursor.execute("""
            INSERT INTO shoppingcart (c_id, p_id, quantity)
            VALUES (%s, %s, %s)
            ON DUPLICATE KEY UPDATE quantity = quantity + %s
        """, [customer_id, product_id, quantity, quantity])

    return Response({'message': 'Product added to cart successfully'})


@api_view(['POST'])
def purchase(request):
    # Extracting customer ID and payment details from request data
    customer_id = request.data.get('customer_id')
    payment_method = request.data.get('payment_method')

    # Assuming the payment is successful and updating the purchased list
    # You should implement actual payment processing logic here
    # For demonstration purposes, let's assume the payment is successful
    # and add the purchased product to the customer's purchased list

    # Fetching products from the shopping cart
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT p_id, quantity FROM shoppingcart WHERE c_id = %s
        """, [customer_id])
        cart_items = cursor.fetchall()

        # Adding purchased items to the customer's purchased list
        for item in cart_items:
            cursor.execute("""
                INSERT INTO purchased (c_id, p_id, quantity)
                VALUES (%s, %s, %s)
            """, [customer_id, item[0], item[1]])

        # Clearing the shopping cart after purchase
        cursor.execute("""
            DELETE FROM shoppingcart WHERE c_id = %s
        """, [customer_id])

    return Response({'message': 'Purchase completed successfully'})
