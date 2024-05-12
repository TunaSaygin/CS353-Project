from django.shortcuts import render
# from rest_framework_simplejwt.views import TokenObtainPairView
# from .serializers import MyTokenObtainPairSerializer
from rest_framework import generics
from rest_framework.decorators import api_view
from .models import Profile
from .serializers import RegisterSerializer, ProfileSerializer
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from rest_framework.response import Response
from django.db import connection
from django.contrib.auth import get_user_model
import jwt
from datetime import datetime, timedelta
from django.conf import settings

UserModel = get_user_model()
# Create your views here.
#Login User
# class MyTokenObtainPairView(TokenObtainPairView):
#     serializer_class = MyTokenObtainPairSerializer

#Register User
class RegisterView(generics.CreateAPIView):
    queryset = Profile.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

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
        print(user_row)
    if user_row:
        user_id, db_username, db_password = user_row
        # user = Profile.objects.get(pk=user_id)
        if password==db_password and username == db_username:
            payload = {
                'user_id': user_id,
                'exp': datetime.utcnow() + timedelta(days=1)
            }
            token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
            return Response({'token': token})
           
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