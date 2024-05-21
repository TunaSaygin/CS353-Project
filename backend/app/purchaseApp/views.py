from datetime import date
from datetime import datetime
from django.db import connection, transaction
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from profileApp.custom_permission import CustomPermission, get_uid


@api_view(['GET'])
@permission_classes([CustomPermission])
def list_all_products(request):
    product_type = request.query_params.get('product_type')
    min_price = request.query_params.get('min_price')
    max_price = request.query_params.get('max_price')
    business_id = request.query_params.get('business_id')
    search_str = request.query_params.get('search_str')

    query = """
        SELECT hg.*, photo_name.photo_metadata , profile.name
        FROM handcraftedgood hg
        LEFT JOIN (
            SELECT p_id, photo_metadata
            FROM productphoto
        ) AS photo_name ON hg.p_id = photo_name.p_id
        JOIN business b ON hg.b_id = b.id
        JOIN profile ON profile.id = b.id
    """
    if business_id:
        query += """
            JOIN business b ON hg.b_id = b.id
        """

    if product_type:
        query += """
            JOIN belong bl ON hg.p_id = bl.p_id
        """

    query += """
        WHERE 1=1
    """
    params = []

    if product_type:
        query += " AND bl.category_id = {}".format(product_type)
        #params.append(product_type)

    if min_price:
        query += " AND hg.current_price >= {}".format(min_price)
        #params.append(min_price)

    if max_price:
        query += " AND hg.current_price <= {}".format(max_price)
        #params.append(max_price)

    if business_id:
        query += " AND b.id = {}".format(business_id)
        #params.append(business_id)
    
    if search_str and search_str != "null":
        print(f"search str {search_str} with type {type(search_str)}")
        query += " AND hg.name LIKE '%{}%'".format(search_str)
        #params.append(search_str)

    with connection.cursor() as cursor:
        print(query)
        cursor.execute(query)
        products = cursor.fetchall()

    return Response(products)


@api_view(['GET'])
@permission_classes([CustomPermission])
def get_business_products(request):
    business_id = get_uid(request)
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT h.p_id, h.name, h.current_price, h.inventory, photo_name.photo_metadata
            FROM handcraftedgood h
            LEFT JOIN (
                SELECT p_id, photo_metadata
                FROM productphoto
            ) AS photo_name ON h.p_id = photo_name.p_id
            WHERE h.b_id = %s
        """, [business_id,])
        columns = [col[0] for col in cursor.description]
        products = [dict(zip(columns, row)) for row in cursor.fetchall()]
    return Response(products)

@api_view(['GET'])
@permission_classes([CustomPermission])
def view_product(request, selected_pid):
    #selected_pid = request.data.get('selected_pid')
    print("selected_pid",selected_pid)

    with connection.cursor() as cursor:
        cursor.execute("""
               SELECT h.name, h.description, h.current_price AS current_price, pp.price AS past_price, h.inventory, p.photo_metadata, c.category_name, p1.name as business_name
               FROM handcraftedgood h
               LEFT JOIN productphoto p ON h.p_id = p.p_id
               LEFT JOIN belong b ON h.p_id = b.p_id
               LEFT JOIN category c ON b.category_id = c.category_id
               LEFT JOIN profile p1 ON p1.id = h.b_id
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
        product_details = cursor.fetchall()
        columns = [col[0] for col in cursor.description]

    if not product_details:
        return Response({'error': 'there is not enough product on the inventory'}, status=404)

    product = {}
    categories = []

    for row in product_details:
        product_row = dict(zip(columns, row))
        if not product:
            product = {k: v for k, v in product_row.items() if k != 'category_name'}
        if product_row['category_name']:
            categories.append(product_row['category_name'])

    product['categories'] = categories

    return Response(product)


@api_view(['POST'])
@permission_classes([CustomPermission])
def add_to_cart(request):
    customer_id = get_uid(request)
    product_id = request.data.get('product_id')
    quantity = request.data.get('quantity')

    with connection.cursor() as cursor:
        cursor.execute("SELECT inventory FROM handcraftedgood WHERE p_id = %s", [product_id])
        r = cursor.fetchone()
        cursor.execute("SELECT SUM(quantity) FROM shoppingcart WHERE p_id = %s ", [product_id])
        r2 = cursor.fetchone()[0]
        if r:
            inventory = r[0]
            q = 0
            if r2:
                print("r2", r2)
                q = r2
            print("inventory", inventory)
            print("q", q)
            if int(q) + int(quantity) <= int(inventory):
                print("q+quantity", q+quantity)
                try:
                    cursor.execute("""
                    INSERT INTO shoppingcart (c_id, p_id, quantity)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (c_id, p_id) DO UPDATE SET quantity = shoppingcart.quantity + %s
                    RETURNING quantity
                """, [customer_id, product_id, quantity, quantity])
                    r3 = cursor.fetchone()
                    if r3:
                        print("r3[0]", r3[0])
                except Exception as e:
                    return Response({'error': str(e)}, status=500)
                print("here")
                return Response({'message': 'Product added to cart successfully'}, status=201)
            else:
                return Response({'message': 'Not enough inventory'}, status=200) #maybe this should be handled better
    return Response({'error': 'Error inserting item'}, status=400)


@api_view(['POST'])
@permission_classes([CustomPermission])
def purchase(request):
    try:
        with transaction.atomic():
            customer_id = get_uid(request)
            balance = 0
            cart_total = 0
            with connection.cursor() as cursor:
                cursor.execute("SELECT balance FROM customer WHERE id = %s", [customer_id])
                balance_row = cursor.fetchone()
                if balance_row:
                    balance = balance_row[0]
                else:
                    return Response({'error': 'Customer not found'}, status=404)

                cursor.execute("""
                    SELECT h.p_id, h.current_price, s.quantity
                    FROM shoppingcart s
                    INNER JOIN handcraftedgood h ON s.p_id = h.p_id
                    WHERE s.c_id = %s
                """, [customer_id])
                cart_items = cursor.fetchall()
                print("cart_items", cart_items)
                print("customer_id", customer_id)

                cart_total = sum(item[1] * item[2] for item in cart_items)

                if balance < cart_total:
                    return Response({'error': 'Insufficient funds'}, status=404)

                new_balance = balance - cart_total
                cursor.execute("UPDATE customer SET balance = %s WHERE id = %s", [new_balance, customer_id])

                purchase_records = []
                for item in cart_items:
                    purchase_records.append((customer_id, item[0], datetime.now(), item[1] * item[2], None,item[2]))

                cursor.executemany("""
                    INSERT INTO purchase (c_id, p_id, p_date, p_price, return_date, quantity)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, purchase_records)

                cursor.execute("DELETE FROM shoppingcart WHERE c_id = %s", [customer_id])

        return Response({'message': 'Purchase completed successfully'}, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['POST'])
@permission_classes([CustomPermission])
def add_to_wishlist(request):
    try:
        user_id = get_uid(request)
        
        p_id = request.data.get('p_id')

        if not p_id:
            return Response({'error': 'Product ID is required'}, status=400)

        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO wishlist (c_id, p_id)
                VALUES (%s, %s)
                ON CONFLICT (c_id, p_id) DO NOTHING
            """, [user_id, p_id])

            cursor.execute("""
                SELECT * FROM wishlist
                WHERE c_id = %s
            """, [user_id])
            rows = cursor.fetchall()

            columns = [col[0] for col in cursor.description]

            wishlist = [dict(zip(columns, row)) for row in rows]

        return Response(wishlist, status=201)

    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['DELETE'])
@permission_classes([CustomPermission])
def delete_from_shopping_cart(request):
    try:
        user_id = get_uid(request)
        p_id = request.data.get('p_id')
        if not p_id:
            return Response({'error': 'Product ID is required'}, status=400)
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM shoppingcart WHERE c_id = %s AND p_id = %s", [user_id, p_id])
            cursor.execute("""
                SELECT COUNT(*) FROM shoppingcart
                WHERE c_id = %s AND p_id = %s
            """, [user_id, p_id])
            count = cursor.fetchone()[0]
            if count == 0:
                return Response({'message': 'Item removed from shopping cart successfully.'}, status=200)
            else:
                return Response({'message': 'Failed to remove item from shopping cart.'}, status=500)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    
@api_view(['PUT'])
@permission_classes([CustomPermission])
def decrease_item_quantity(request):
    try:
        user_id = get_uid(request)
        p_id = request.data.get('p_id')
        if not p_id:
            print("hereeeeeee")
            return Response({'error': 'Product ID is required'}, status=400)
        with connection.cursor() as cursor:
            cursor.execute("SELECT quantity FROM shoppingcart WHERE p_id = %s AND c_id= %s", [p_id, user_id])
            row = cursor.fetchone()
            if row:
                quantity = row[0]
                if quantity > 1:
                    cursor.execute("UPDATE shoppingcart SET quantity = quantity - 1 WHERE p_id = %s AND c_id=%s", [p_id, user_id])
                else:
                    cursor.execute("DELETE FROM shoppingcart WHERE c_id = %s AND p_id=%s", [user_id, p_id])
                return Response({'message': 'Successful update.'}, status=200)
    except Exception as e:
        return Response({'message': str(e)}, status=500)
    
@api_view(['DELETE'])
@permission_classes([CustomPermission])
def delete_from_wishlist(request):
    try:
        user_id = get_uid(request)

        p_id = request.data.get('p_id')

        if not p_id:
            return Response({'error': 'Product ID is required'}, status=400)

        with connection.cursor() as cursor:
            cursor.execute("""
                DELETE FROM wishlist
                WHERE c_id = %s AND p_id = %s
            """, [user_id, p_id])

            cursor.execute("""
                SELECT COUNT(*) FROM wishlist
                WHERE c_id = %s AND p_id = %s
            """, [user_id, p_id])
            count = cursor.fetchone()[0]

        if count == 0:
            return Response({'message': 'Product removed from wishlist successfully'}, status=200)
        else:
            return Response({'error': 'Failed to remove product from wishlist'}, status=400)

    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['GET'])
@permission_classes([CustomPermission])
def get_wishlist(request):
    try:
        user_id = get_uid(request)

        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT w.c_id, w.p_id, p.name, p.current_price, p.description 
                FROM wishlist w
                JOIN handcraftedgood p ON w.p_id = p.p_id
                WHERE w.c_id = %s
            """, [user_id])
            rows = cursor.fetchall()

            if not rows:
                return Response([], status=200)

            columns = [col[0] for col in cursor.description]

            wishlist = [dict(zip(columns, row)) for row in rows]

        return Response(wishlist, status=200)

    except Exception as e:
        return Response({'error': str(e)}, status=400)
    
@api_view(['GET'])
@permission_classes([CustomPermission])
def get_shopping_cart(request):
    c_id = get_uid(request)
    try:
        with connection.cursor() as cursor:
            cursor.execute("""SELECT s.c_id, s.p_id, p.name, p.current_price, p.description, s.quantity, photo_name.photo_metadata FROM shoppingcart s JOIN handcraftedgood p ON p.p_id = s.p_id LEFT JOIN (
                SELECT p_id, photo_metadata
                FROM productphoto
            ) AS photo_name ON photo_name.p_id = s.p_id WHERE s.c_id = %s""", [c_id])
            rows = cursor.fetchall()
            if not rows:
                return Response([], status=200)
            columns = [col[0] for col in cursor.description]
            cart = [dict(zip(columns, row)) for row in rows]
            return Response(cart, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=400)
    
@api_view(['GET'])
@permission_classes([CustomPermission])
def get_purchase_history(request):
    if request.method == 'GET':
        try:
            c_id = get_uid(request)
            with connection.cursor() as cursor:
                cursor.execute("""SELECT purchase.c_id, purchase.p_date, purchase.p_id,
                               purchase.return_date,  p1.name as customer_name, p2.name as business_name,
                               hg.name as product_name
                               FROM purchase 
                               JOIN profile p1 ON p1.id = purchase.c_id
                               JOIN handcraftedgood hg ON hg.p_id = purchase.p_id
                               JOIN profile p2 ON p2.id = hg.b_id
                               WHERE c_id = %s
                               """, [c_id])
                rows = cursor.fetchall()
                columns = [col[0] for col in cursor.description]

            purchases = [dict(zip(columns, row)) for row in rows]

            return Response({'purchases': purchases}, status=200)
        except Exception as e:
            return Response({'error': str(e)}, status=400)
    else:
        return Response({'error': 'Invalid request method'}, status=405)
    

@api_view(['GET'])
@permission_classes([CustomPermission])
def get_business_purchase_history(request):
    if request.method == 'GET':
        try:
            b_id = get_uid(request)
            with connection.cursor() as cursor:
                cursor.execute("""SELECT purchase.c_id, purchase.p_date, purchase.p_id,
                               purchase.return_date,  p1.name as customer_name, p2.name as business_name,
                               hg.name as product_name, c.delivery_address
                               FROM purchase 
                               JOIN profile p1 ON p1.id = purchase.c_id
                               JOIN customer c ON c.id = p1.id
                               JOIN handcraftedgood hg ON hg.p_id = purchase.p_id
                               JOIN (select * from profile where id = %s) p2 ON p2.id = hg.b_id
                               """, [b_id])
                rows = cursor.fetchall()
                columns = [col[0] for col in cursor.description]

            purchases = [dict(zip(columns, row)) for row in rows]

            return Response({'purchases': purchases}, status=200)
        except Exception as e:
            return Response({'error': str(e)}, status=400)
    else:
        return Response({'error': 'Invalid request method'}, status=405)
    