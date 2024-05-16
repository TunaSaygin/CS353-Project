from django.shortcuts import render
from django.db import connection
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.
@api_view(['POST'])
def create_product(request):
    if request.method == 'POST':
        try:
            data = request.data
            
            b_id = data.get('b_id')
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
