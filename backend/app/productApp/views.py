from django.shortcuts import render
from django.db import connection
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from profileApp.custom_permission import CustomPermission, get_uid


# Create your views here.
@permission_classes([CustomPermission])
@api_view(['POST'])
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
    
@permission_classes([CustomPermission])
@api_view(['POST'])
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
