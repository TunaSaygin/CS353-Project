from django.http import JsonResponse
from django.shortcuts import render
from django.db import connection
from rest_framework.decorators import api_view, permission_classes
import psycopg2
from django.http import HttpResponse
import uuid
import mimetypes
from rest_framework.response import Response
from rest_framework.decorators import permission_classes
from profileApp.custom_permission import CustomPermission, get_uid



# Create your views here.
@api_view(['POST'])
@permission_classes([CustomPermission])
def create_product(request):
    if request.method == 'POST':
        try:
            data = request.data

            b_id = get_uid(request)
            inventory = data.get('inventory')
            current_price = data.get('current_price')
            name = data.get('name')
            return_period = data.get('return_period')
            description = data.get('description')
            recipient_type = data.get('recipient_type')
            materials = data.get('materials')
            print("b_id",b_id,"/inventory:",inventory,"name",name)
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO handcraftedgood (b_id, inventory, current_price, name, return_period, description, recipient_type, materials)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING p_id
                """, [b_id, inventory, current_price, name, return_period, description, recipient_type, materials])
                p_id = cursor.fetchone()[0]
            return Response({'message': 'Product created successfully','p_id': p_id}, status=201)
        except Exception as e:
            return Response({'error': str(e)}, status=400)
    else:
        return Response({'error': 'Invalid request method'}, status=405)
@api_view(['POST'])
@permission_classes([CustomPermission])
def update_product(request):
    if request.method == 'POST':
        try:
            data = request.data

            p_id = data.get('p_id')
            b_id = get_uid(request)
            inventory = data.get('inventory')
            current_price = data.get('current_price')
            name = data.get('name')
            return_period = data.get('return_period')
            description = data.get('description')
            recipient_type = data.get('recipient_type')
            materials = data.get('materials')

            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE handcraftedgood
                    SET inventory = %s, current_price = %s, name = %s, return_period = %s, description = %s, recipient_type = %s, materials = %s
                    WHERE p_id = %s AND b_id = %s
                """, [inventory, current_price, name, return_period, description, recipient_type, materials, p_id, b_id])
            
            return Response({'message': 'Product updated successfully'}, status=200)
        except Exception as e:
            return Response({'error': str(e)}, status=400)
    else:
        return Response({'error': 'Invalid request method'}, status=405)
@api_view(['POST'])
@permission_classes([CustomPermission])
def add_product_photo(request):
    if request.method == 'POST':
        try:
            data = request.data
            
            p_id = data.get('p_id') # I assume b_id and p_id are received from request.?????
            b_id = data.get('b_id')
            photo_metadata = data.get('photo_metadata')
            photo_blob = data.get('photo_blob')  # Assuming this is a base64 encoded string

            # Decode the base64 encoded photo_blob
            import base64
            photo_blob_decoded = base64.b64decode(photo_blob)

            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO productphoto (p_id, b_id, photo_metadata, photo_blob)
                    VALUES (%s, %s, %s, %s)
                """, [p_id, b_id, photo_metadata, photo_blob_decoded])

            return Response({'message': 'Photo added successfully'}, status=201)
        except Exception as e:
            return Response({'error': str(e)}, status=400)
    else:
        return Response({'error': 'Invalid request method'}, status=405)

@api_view(['POST'])
@permission_classes([CustomPermission])
def return_product(request):
    if request.method == 'POST':
        try:
            data = request.data
            c_id = get_uid(request)
            p_id = data.get('p_id')

            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE purchase
                    SET return_date = CASE
                        WHEN return_date IS NULL AND p_date + INTERVAL '30 DAY' >= NOW() THEN NOW()
                        ELSE return_date
                    END
                    WHERE c_id = %s AND p_id = %s;
                """, [c_id, p_id])
                connection.commit()
            return Response({'message': 'Product return successfully done'}, status=201)
        except Exception as e:
            return Response({'error': str(e)}, status=400)
    else:
        return Response({'error': 'Invalid request method'}, status=405)

@api_view(['POST'])
@permission_classes([CustomPermission])
def upload_product_photo(request):
    p_id = request.POST.get('p_id')
    b_id = get_uid(request)
    file = request.FILES.get('file')

    if not file:
        return Response({'error': 'No file provided'}, status=400)
    file_extension = file.name.split('.')[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    photo_metadata = unique_filename
    photo_blob = file.read()
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO productphoto (p_id, b_id, photo_metadata, photo_blob)
                VALUES (%s, %s, %s, %s)
            """, (p_id, b_id, photo_metadata, psycopg2.Binary(photo_blob)))

            connection.commit()
            cursor.close()
        return Response({'message': 'Image successfully uploaded'}, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([CustomPermission])
def update_product_photo(request):
    p_id = request.POST.get('p_id')
    b_id = get_uid(request)
    file = request.FILES.get('file')

    if not file:
        return Response({'error': 'No file provided'}, status=400)
    file_extension = file.name.split('.')[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    photo_metadata = unique_filename
    photo_blob = file.read()

    try:
        with connection.cursor() as cursor:
            # Check if the photo exists
            cursor.execute("""
                SELECT photo_metadata FROM productphoto WHERE p_id = %s AND b_id = %s
            """, (p_id, b_id))
            existing_photo = cursor.fetchone()

            if existing_photo:
                # Update existing photo
                cursor.execute("""
                    UPDATE productphoto
                    SET photo_metadata = %s, photo_blob = %s
                    WHERE p_id = %s AND b_id = %s
                """, (photo_metadata, psycopg2.Binary(photo_blob), p_id, b_id))
            else:
                # Insert new photo
                cursor.execute("""
                    INSERT INTO productphoto (p_id, b_id, photo_metadata, photo_blob)
                    VALUES (%s, %s, %s, %s)
                """, (p_id, b_id, photo_metadata, psycopg2.Binary(photo_blob)))

            connection.commit()
            cursor.close()
        return Response({'message': 'Image successfully uploaded/updated'}, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['GET'])
def view_product_photo(request,photo_metadata):
    print(photo_metadata)
    try:
        print("I am here!")
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT photo_blob, photo_metadata FROM productphoto
                WHERE photo_metadata = %s
            """, (photo_metadata,))
            print("cursor executed")
            result = cursor.fetchone()
            cursor.close()
            print("retrieved")
        if result is None:
                return Response('Image not found', status=404)

        photo_blob, photo_metadata = result

        # Determine the MIME type of the file based on its extension
        mime_type, _ = mimetypes.guess_type(photo_metadata)
        if mime_type is None:
            mime_type = 'application/octet-stream'  # Use a binary stream type if MIME type is unknown
        print("The mime type is",mime_type)
        return HttpResponse(photo_blob, content_type=mime_type)
    except Exception as e:
        return Response(f'Error retrieving image: {str(e)}', status=500)


@api_view(['GET', 'POST'])
@permission_classes([CustomPermission])
def product_rating(request, product_id):
    if request.method == 'POST':
        try:
            data = request.data
            c_id = get_uid(request)
            rate_amt = data.get('rate_amount')
            comment = data.get('comment')

            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO rates (c_id, p_id, rate_amount, comment) VALUES (%s, %s, %s, %s)
                    ON CONFLICT (c_id, p_id) DO UPDATE SET rate_amount = excluded.rate_amount, comment = excluded.comment;
                """, [c_id, product_id, rate_amt, comment])
            return Response({'message': 'Rate created successfully'}, status=201)
        except Exception as e:
            return Response({'error': str(e)}, status=400)
    if request.method == 'GET':
        try:
            c_id = get_uid(request)
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT rate_amount, comment FROM rates WHERE c_id = %s AND p_id = %s;
                """, [c_id, product_id])
                result = cursor.fetchone()
                if result:
                    rate_amt = result[0]
                    comment = result[1]
                    return Response({'rate_amt': rate_amt, 'comment': comment}, status=200)
                else:
                    return Response({'rate_amt': None, 'comment': None}, status=200)
        except Exception as e:
            return Response({'error': str(e)}, status=400)
    else:
        return Response({'error': 'Invalid request method'}, status=405)


@api_view(['GET'])
def get_product_rating_details(request, product_id):
    if request.method == 'GET':
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT avg(rate_amount) as avg_rating from rates WHERE p_id = %s;
                """, [product_id])
                comments = cursor.fetchone()
                avg_rating = None
                if comments:
                    avg_rating = comments[0]
                cursor.execute("""
                    SELECT rate_amount, comment from rates WHERE p_id = %s;
                """, [product_id])
                all_ratings = cursor.fetchall()
                if all_ratings:
                    all_ratings = [{"rate_amt": comment[0], "comment": comment[1]} for comment in all_ratings]
                return Response({'avg_rating': avg_rating, "comments": all_ratings}, status=200)
        except Exception as e:
            return Response({'error': str(e)}, status=400)
    else:
        return Response({'error': 'Invalid request method'}, status=405)

@api_view(['GET'])
@permission_classes([CustomPermission])
def list_categories(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                            SELECT * FROM category
            """,[])
            rows = cursor.fetchall()
            columns = [col[0] for col in cursor.description]

        # Construct a list of dictionaries representing the customers
        categories = [dict(zip(columns, row)) for row in rows]
        return Response(categories,status=200)
    except Exception as e:
            return Response({'error': str(e)}, status=400)
    

@api_view(['POST'])
@permission_classes([CustomPermission])
def add_category(request):
    category_name = request.data.get("category_name")
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                            INSERT INTO category(category_name) VALUES(%s)
            """,[category_name])
        return Response({'Message':'Successfully addded category'},status=200)
    except Exception as e:
            return Response({'error': str(e)}, status=400)
    
@api_view(['POST'])
@permission_classes([CustomPermission])
def update_category(request):
    category_name = request.data.get("category_name")
    category_id = request.data.get("category_id")
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                            UPDATE category SET category_name = %s WHERE category_id = %s
            """,[category_name,category_id])
        return Response({'Message':f'Successfully updated category id {category_id} with name {category_name}'},status=200)
    except Exception as e:
            return Response({'error': str(e)}, status=400)

@api_view(['DELETE'])
@permission_classes([CustomPermission])
def delete_category(request):
    category_id = request.data.get("category_id")
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                DELETE FROM category WHERE category_id = %s
            """, [category_id])
        return Response({'Message': f'Successfully deleted category id {category_id}'}, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=400)
