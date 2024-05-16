from rest_framework.permissions import BasePermission
from django.db import connection
from rest_framework.response import Response
from django.conf import settings
import jwt


def get_uid(request):
    if 'Authorization' in request.headers:
        try:
            token = request.headers['Authorization'].split(' ')[1]  # Extract token from header
            return jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])['user_id']
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
    return None


class CustomPermission(BasePermission):
    def has_permission(self, request, view):
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(' ')[1]  # Extract token from header
            user = self.authenticate_user(token)
            if user:
                request.user = user  # Attach authenticated user to the request object
                return True
            else:
                return False
    
    def authenticate_user(self, token):
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload['user_id']
            print("user_id", user_id)
            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM profile WHERE id = %s", [user_id])
                user = cursor.fetchone()
            print("user", user)
            if user:
                return user
            else:
                return None
        except jwt.ExpiredSignatureError:
            return None  # Token has expired
        except jwt.InvalidTokenError:
            return None  # Invalid token or user not found
