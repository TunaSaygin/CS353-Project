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

            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO handcraftedgood (b_id, inventory, current_price, name, return_period, description, recipient_type, materials)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """, [b_id, inventory, current_price, name, return_period, description, recipient_type, materials])
            
            return Response({'message': 'Product created successfully'}, status=201)
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
    b_id = request.POST.get('b_id')
    photo_metadata = request.POST.get('photo_metadata')
    file = request.FILES.get('file')

    if not file:
        return Response({'error': 'No file provided'}, status=400)
    if not photo_metadata:
        return Response({'error':'No photomedata provided'}, status=400)
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
