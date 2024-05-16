from datetime import date

from django.db import connection, transaction
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def list_all_products(request):
    # Extracting filter parameters from the request
    product_type = request.query_params.get('product_type')
    min_price = request.query_params.get('min_price')
    max_price = request.query_params.get('max_price')
    business_id = request.query_params.get('business_id')

    # Constructing the base SQL query
    query = """
        SELECT hg.*
        FROM handcraftedgood hg
    """

    # Constructing the JOIN clause based on the presence of business_id filter
    if business_id:
        query += """
            JOIN business b ON hg.b_id = b.id
        """

    if product_type:
        query += """
            JOIN belong bl ON hg.p_id = bl.p_id
        """

    # Constructing the WHERE clause based on the provided filters
    query += """
        WHERE 1=1
    """
    params = []

    if product_type:
        query += " AND bl.category_id = %s"
        params.append(product_type)

    if min_price:
        query += " AND hg.current_price >= %s"
        params.append(min_price)

    if max_price:
        query += " AND hg.current_price <= %s"
        params.append(max_price)

    if business_id:
        query += " AND b.id = %s"
        params.append(business_id)

    # Executing the SQL query with the constructed parameters
    with connection.cursor() as cursor:
        cursor.execute(query, params)
        products = cursor.fetchall()

    # TODO: Serialize the products before returning the response
    return Response(products)


@api_view(['GET'])
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

        if product_details:
            return Response(product_details)
        else:
            return Response({'error': 'there is not enough product on the inventory'}, status=404)




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
    try:
        with transaction.atomic():
            # Extracting customer ID and payment details from request data
            customer_id = request.data.get('customer_id')
            balance = 0
            cart_total = 0
            with connection.cursor() as cursor:
                cursor.execute("SELECT balance FROM customer WHERE id = %s", [customer_id])
                balance_row = cursor.fetchone()
                if balance_row:
                    balance = balance_row[0]
                else:
                    return Response({'error': 'Customer not found'}, status=404)

                # Fetching products from the shopping cart
                cursor.execute("""
                    SELECT h.p_id, h.current_price, s.quantity
                    FROM shoppingcart s
                    INNER JOIN handcraftedgood h ON s.p_id = h.p_id
                    WHERE s.c_id = %s
                """, [customer_id])
                cart_items = cursor.fetchall()

                # Calculating the total cost of items in the shopping cart
                cart_total = sum(item[1] * item[2] for item in cart_items)

                if balance < cart_total:
                    return Response({'error': 'Insufficient funds'}, status=404)

                # Inserting purchase records into the purchase table
                purchase_records = []
                for item in cart_items:
                    purchase_records.append((customer_id, item[0], date.today(), item[1] * item[2], None))
                    #todo check timestamp

                cursor.executemany("""
                    INSERT INTO purchase (c_id, p_id, p_date, p_price, return_date)
                    VALUES (%s, %s, %s, %s, %s)
                """, purchase_records)

                # Clearing the shopping cart after purchase
                cursor.execute("DELETE FROM shoppingcart WHERE c_id = %s", [customer_id])

        return Response({'message': 'Purchase completed successfully'}, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
#Todo: balance arttırma yeri lazım
