from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
# from .serializers import MyTokenObtainPairSerializer
# from rest_framework import generics
from rest_framework.decorators import api_view
# from .models import Profile
# from .serializers import ProfileSerializer
# from rest_framework.permissions import AllowAny
# from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from rest_framework.response import Response
from django.db import connection
import jwt
from datetime import date, datetime, timedelta
from django.conf import settings
from django.db import transaction
from profileApp.custom_permission import CustomPermission
import uuid
import mimetypes
import psycopg2
from profileApp.custom_permission import get_uid

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
                    INSERT INTO business (id, IBAN, income)
                    VALUES (%s, %s,0)
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
    
    return Response({'token': token,'name':username ,'email': email, 'id': id, 'acc_type': acc_type}, status=200)



@api_view(['POST'])
def custom_login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    print(email)
    print(password)

    # Raw SQL query to fetch user data by username
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT id, email, password, image_metadata,name
            FROM profile
            WHERE email = %s
        """, [email])
        user_row = cursor.fetchone()
        print("user row",user_row)
        if user_row:
            user_id, db_email, db_password, image_name,user_name = user_row
            print(image_name)
            print(user_row)
            # user = Profile.objects.get(pk=user_id)
            if password==db_password and email == db_email:
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
                    return Response({'token': token, 'id': cus[0],'email':email ,'name': user_name, 'balance': cus[1], 'delivery_address': cus[2], 'acc_type': 'customer','image_name':image_name})
                
                cursor.execute("""
                            SELECT id, income, IBAN
                            FROM business
                            WHERE id = %s
                        """, [user_id])
                bus = cursor.fetchone()
                if bus:
                    return Response({'token': token, 'id': bus[0], 'name':user_name ,'email': email, 'income': bus[1], 'iban': bus[2], 'acc_type': 'business', 'image_name':image_name})
                cursor.execute("SELECT id FROM admin WHERE id = %s", [user_id])
                admin = cursor.fetchone()
                if admin:
                    return Response({'token': token, 'id': user_id, 'email': email, 'acc_type': 'admin', 'name':user_name})
                return Response({'error': 'Account type needed'}, status=400)
           
            else:
                return Response({'error': 'Invalid credentials'}, status=400)
        else:
            return Response({'error': 'User not found'}, status=404)

#api/profile  and api/profile/update
@api_view(['GET'])
@permission_classes([CustomPermission])
def getProfile(request):
    # user = request.data.get('user')
    # serializer = ProfileSerializer(user, many=False)
    # if serializer.is_valid():
    #     with connection.cursor() as cursor:
    #         cursor.execute("""
    #             SELECT * FROM profile
    #             WHERE user_id = %s
    #         """, [user.id])
    #         profile_data = cursor.fetchone()
    #     return Response(profile_data)
    # else:
    #     return Response(serializer.errors, status=400)
    username = request.data.get('name')
    with connection.cursor() as cursor:
        cursor.execute("SELECT id, name, email, image_metadata, image_blob FROM profile WHERE name = %s", [username])
        row = cursor.fetchone()
        if row:
            user_id = row[0]
            email = row[2]
            return Response({'name': username, 'id': user_id, 'email': email}, status=200)
        return Response({'error': 'Error'}, status=404)
            

# @api_view(['PUT'])
# @permission_classes([IsAuthenticated])
# def updateProfile(request):
#     user = request.user
#     serializer = ProfileSerializer(user, data=request.data, partial=True)
#     if serializer.is_valid():
#         serializer.save()
#     return Response(serializer.data)

# @api_view(['PUT'])
# @permission_classes([CustomPermission])
# def updateProfile(request):
#     user = request.user
#     serializer = ProfileSerializer(user, data=request.data, partial=True)
    
#     if serializer.is_valid():
#         # Extracting data from serializer
#         validated_data = serializer.validated_data
#         first_name = validated_data.get('first_name')
#         last_name = validated_data.get('last_name')
#         # Add other fields as needed

#         # Raw SQL query to update user profile
#         with connection.cursor() as cursor:
#             cursor.execute("""
#                 UPDATE profile
#                 SET first_name = %s, last_name = %s
#                 WHERE user_id = %s
#             """, [first_name, last_name, user.id])

#         # Fetch updated profile data
#         with connection.cursor() as cursor:
#             cursor.execute("""
#                 SELECT * FROM profile
#                 WHERE user_id = %s
#             """, [user.id])
#             profile_data = cursor.fetchone()
#         # Returning updated profile data
#         return Response(profile_data)
#     else:
#         return Response(serializer.errors, status=400)
    
@api_view(['POST'])
@permission_classes([CustomPermission])
def verify_business(request):
    if request.method == 'POST':
        try:
            data = request.data
            
            business_id = data.get('business_id')
            admin_id = data.get('admin_id') 
            
            if not business_id or not admin_id:
                return Response({'error': 'business_id and admin_id are required'}, status=400)
            
            verification_date = date.today()

            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE business
                    SET verifying_admin = %s, verification_date = %s
                    WHERE id = %s
                """, [admin_id, verification_date, business_id])
            
            return Response({'message': 'Business verified successfully'}, status=200)
        except Exception as e:
            return Response({'error': str(e)}, status=400)
    else:
        return Response({'error': 'Invalid request method'}, status=405)
    
@api_view(['GET'])
@permission_classes([CustomPermission])
def get_unverified_businesses(request):
    if request.method == 'GET':
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT * FROM business
                    WHERE verifying_admin IS NULL
                """)
                rows = cursor.fetchall()
                columns = [col[0] for col in cursor.description]
                businesses = [
                    dict(zip(columns, row))
                    for row in rows
                ]
            
            return Response(businesses, status=200)
        except Exception as e:
            return Response({'error': str(e)}, status=400)
    else:
        return Response({'error': 'Invalid request method'}, status=405)
    

    
@api_view(['POST'])
@permission_classes([CustomPermission])
def generate_gift_card(request):
    b_id = get_uid(request)
    with connection.cursor() as cursor:
        cursor.execute("SELECT id FROM business WHERE id = %s", [b_id])
        row = cursor.fetchone()
        if row:
            gift_amount = request.data.get('gift_amount')
            gift_message = request.data.get('gift_message')
            cursor.execute("SELECT p.c_id FROM purchase p JOIN handcraftedgood h ON p.p_id = h.p_id AND h.b_id = %s ORDER BY RANDOM() LIMIT 1", [b_id])
            c_id = cursor.fetchone()
            print(c_id)
            if c_id:
                cursor.execute("INSERT INTO giftcard (cust_id, business_id, gift_amount, gift_message, creation_date) VALUES (%s,%s,%s,%s,%s) RETURNING gift_id, cust_id, creation_date", [c_id, b_id, gift_amount, gift_message, datetime.now()])
                r = cursor.fetchone()
                return Response({'gift_id': r[0], 'cust_id': r[1], 'creation_date': r[2]}, status=201)
            else:
                return Response({'error': 'No customer purchased your products'}, status=404)
        else:
            return Response({'error': 'Invalid business id. You are not allowed.'}, status=403)
    

@api_view(['POST'])
@permission_classes([CustomPermission])
def redeem_gift_card(request):
    c_id = get_uid(request)
    gift_id = request.data.get('gift_id')
    with connection.cursor() as cursor:
        cursor.execute("SELECT gift_id FROM giftcard WHERE cust_id = %s AND gift_id = %s AND redemption_date is NULL", [c_id, gift_id])
        row = cursor.fetchone()
        if row:
            cursor.execute("BEGIN TRANSACTION")
            cursor.execute("UPDATE giftcard SET redemption_date = %s WHERE gift_id = %s RETURNING redemption_date, gift_amount", [datetime.now(), gift_id])
            r1 = cursor.fetchone()
            if r1:
                gift_amount = r1[1]
                print(r1)
                cursor.execute("UPDATE customer SET balance = balance + %s WHERE id = %s RETURNING id, balance", [gift_amount, c_id])
                r2 = cursor.fetchone()
                if r2:
                    print("balance", r2[1])
                    cursor.execute("END TRANSACTION")
                    return Response({'customer_id': c_id, 'gift_amount': gift_amount, 'gift_id': gift_id}, status=200)
                else:
                    return Response({'error': 'Error updating customer table'}, status=500)
            else:
                return Response({'error': 'Error updating the giftcard table'}, status=500)
        else:
            return Response({'error': 'Error getting the gift card'}, status=404)
        
            

@api_view(['GET'])
@permission_classes([CustomPermission])
def get_gift_cards_of_customer(request):
    c_id = get_uid(request)
    with connection.cursor() as cursor:
        cursor.execute("SELECT g.gift_id, g.cust_id, g.gift_amount, g.gift_message, g.creation_date, b.name FROM giftcard g JOIN profile b ON b.id = g.business_id WHERE cust_id = %s AND redemption_date is NULL", [c_id])
        rows = cursor.fetchall()
        if rows:
            columns = [col[0] for col in cursor.description]
            res = [dict(zip(columns, row)) for row in rows]
            print(res)
            return Response(res, status=200)
    return Response([], status=200)

@api_view(['POST'])
@permission_classes([CustomPermission])
def upload_profile_photo(request):
    user_id = get_uid(request)
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
                UPDATE profile
                SET image_metadata = %s, image_blob = %s
                WHERE id = %s
            """, (photo_metadata, psycopg2.Binary(photo_blob), user_id))

            connection.commit()
            cursor.close()
        return Response({'message': 'Image successfully uploaded'}, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
@api_view(['POST'])
@permission_classes([CustomPermission])
def update_profile(request):
    try:
        user_id = get_uid(request)
        username = request.data.get('username')
        email = request.data.get('email')
        image_file = request.FILES.get('file')
        file_extension = None
        photo_metadata = None
        photo_blob = None

        if image_file:
            file_extension = image_file.name.split('.')[-1]
            unique_filename = f"{uuid.uuid4()}.{file_extension}"
            photo_metadata = unique_filename
            photo_blob = image_file.read()
        with connection.cursor() as cursor:
            # Update profile details
            # Update profile image if provided
            if photo_metadata and photo_blob:
                cursor.execute("""
                    UPDATE profile
                    SET name = %s, email = %s, image_metadata = %s, image_blob = %s
                    WHERE id = %s
                """, [username, email, photo_metadata, psycopg2.Binary(photo_blob), user_id])
            else:
                cursor.execute("""
                    UPDATE profile
                    SET name = %s, email = %s
                    WHERE id = %s
                """, [username, email, user_id])

        return Response({'message': 'Profile updated successfully'}, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=400)
    

@api_view(['GET'])    
def view_profile_photo(request,image_metadata):
    print(image_metadata)
    try:
        print("I am here!")
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT image_blob, image_metadata FROM profile
                WHERE image_metadata = %s
            """, (image_metadata,))
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
    
@api_view(['POST'])
@permission_classes([CustomPermission])
def update_balance(request):
    c_id = get_uid(request)
    amount = request.data.get('amount')
    if int(amount) <= 0:
        return Response({'error': 'Amount should be greater than zero'}, status=400)
    with connection.cursor() as cursor:
        cursor.execute("SELECT id FROM customer WHERE id = %s", [c_id])
        cus = cursor.fetchone()
        if cus:
            cursor.execute("UPDATE customer SET balance = balance + %s WHERE id = %s RETURNING id, balance", [amount, c_id])
            row = cursor.fetchone()
            if row:
                id = row[0]
                balance = row[1]
                return Response({'id': id, 'balance': balance}, status=200)
            else:
                return Response({'error': 'Error updating the balance'}, status=500)
        else:
            return Response({'error': 'Customer not found'}, status=404)
        
@api_view(['GET'])
@permission_classes([CustomPermission])
def get_gift_cards_from_business(request):
    try:
        b_id = get_uid(request)
        with connection.cursor() as cursor:
            cursor.execute("SELECT g.gift_id, g.cust_id, g.gift_amount, g.gift_message, g.creation_date, g.redemption_date, p.name FROM giftcard g JOIN profile p ON p.id = g.cust_id WHERE g.business_id = %s", [b_id])
            rows = cursor.fetchall()
            if rows:
                columns = [col[0] for col in cursor.description]
                res = [dict(zip(columns, row)) for row in rows]
                print(res)
                return Response(res, status=200)
            return Response([], status=200)
    except Exception as e:
        return Response({'message': str(e)}, status=500)

