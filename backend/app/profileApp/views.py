from django.shortcuts import render
# from .serializers import MyTokenObtainPairSerializer
from rest_framework import generics
from rest_framework.decorators import api_view
from .models import Profile
from .serializers import ProfileSerializer
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from rest_framework.response import Response
from django.db import connection
import jwt
from datetime import datetime, timedelta
from django.conf import settings
from django.db import transaction

# Create your views here.
#Login User
# class MyTokenObtainPairView(TokenObtainPairView):
#     serializer_class = MyTokenObtainPairSerializer

#Register User
# class RegisterView(generics.CreateAPIView):
#     queryset = Profile.objects.all()
#     permission_classes = (AllowAny,)
#     serializer_class = RegisterSerializer

@api_view(['POST'])
def custom_register(request):
    username = request.data.get('name')
    password = request.data.get('password')
    email = request.data.get('email')
    image_metadata = request.data.get('image_metadata', None)
    image_blob = request.data.get('image_blob', None)
    acc_type = request.data.get('acc_type')
    
    if username is None or password is None or email is None:
        return Response({'error': 'Email, name, or password fields cannot be null.'}, status=400)
    
    with transaction.atomic():  # Start a database transaction
        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO profile (name, email, password, image_metadata, image_blob)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id, name, email, password, image_metadata, image_blob
            """, [username, email, password, image_metadata, image_blob])
            
            row = cursor.fetchone()
            id = row[0]
            
            if acc_type == 'customer':
                balance = 0
                delivery_address = request.data.get('delivery_address')
                cursor.execute("""
                    INSERT INTO customer (id, balance, delivery_address)
                    VALUES (%s, %s, %s)
                    RETURNING balance, delivery_address
                """, [id, balance, delivery_address])
                
                r = cursor.fetchone()
            elif acc_type == 'business':
                iban = request.data.get('iban')
                cursor.execute("""
                    INSERT INTO business (id, IBAN)
                    VALUES (%s, %s)
                    RETURNING id, IBAN
                """, [id, iban])
                
                r = cursor.fetchone()
            else:
                return Response({'error': 'Invalid account type'}, status=404)
        # Commit the transaction explicitly
    transaction.commit()
    
    payload = {
        'user_id': id,
        'exp': datetime.utcnow() + timedelta(days=1)
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    
    return Response({'token': token, 'name': username, 'id': id}, status=200)



@api_view(['POST'])
def custom_login(request):
    username = request.data.get('name')
    password = request.data.get('password')
    print(username)
    print(password)

    # Raw SQL query to fetch user data by username
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT id, name, password
            FROM profile
            WHERE name = %s
        """, [username])
        user_row = cursor.fetchone()
        print("user row",user_row)
        if user_row:
            user_id, db_username, db_password = user_row
            # user = Profile.objects.get(pk=user_id)
            if password==db_password and username == db_username:
                payload = {
                    'user_id': user_id,
                    'exp': datetime.utcnow() + timedelta(days=1)
                }
                token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
                cursor.execute("""
                            SELECT id, balance, delivery_address
                            FROM customer
                            WHERE id = %s    
                        """, [user_id])
                cus = cursor.fetchone()
                if cus:
                    return Response({'token': token, 'id': cus[0], 'name': username, 'balance': cus[1], 'delivery_address': cus[2], 'acc_type': 'customer'})
                
                cursor.execute("""
                            SELECT id, income, IBAN
                            FROM business
                            WHERE id = %s
                        """, [user_id])
                bus = cursor.fetchone()
                if bus:
                    return Response({'token': token, 'id': bus[0], 'name': username, 'income': bus[1], 'iban': bus[2], 'acc_type': 'business'})
                cursor.execute("SELECT id FROM admin WHERE id = %s", [user_id])
                admin = cursor.fetchone()
                if admin:
                    return Response({'token': token, 'id': user_id, 'acc_type': 'admin'})
                return Response({'error': 'Account type needed'}, status=400)
           
            else:
                return Response({'error': 'Invalid credentials'}, status=400)
        else:
            return Response({'error': 'User not found'}, status=404)

#api/profile  and api/profile/update
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getProfile(request):
    user = request.user
    serializer = ProfileSerializer(user, many=False)
    if serializer.is_valid():
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT * FROM profile
                WHERE user_id = %s
            """, [user.id])
            profile_data = cursor.fetchone()
        return Response(profile_data)
    else:
        return Response(serializer.errors, status=400)

# @api_view(['PUT'])
# @permission_classes([IsAuthenticated])
# def updateProfile(request):
#     user = request.user
#     serializer = ProfileSerializer(user, data=request.data, partial=True)
#     if serializer.is_valid():
#         serializer.save()
#     return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateProfile(request):
    user = request.user
    serializer = ProfileSerializer(user, data=request.data, partial=True)
    
    if serializer.is_valid():
        # Extracting data from serializer
        validated_data = serializer.validated_data
        first_name = validated_data.get('first_name')
        last_name = validated_data.get('last_name')
        # Add other fields as needed

        # Raw SQL query to update user profile
        with connection.cursor() as cursor:
            cursor.execute("""
                UPDATE profile
                SET first_name = %s, last_name = %s
                WHERE user_id = %s
            """, [first_name, last_name, user.id])

        # Fetch updated profile data
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT * FROM profile
                WHERE user_id = %s
            """, [user.id])
            profile_data = cursor.fetchone()

        # Returning updated profile data
        return Response(profile_data)
    else:
        return Response(serializer.errors, status=400)