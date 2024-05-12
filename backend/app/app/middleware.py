import jwt
from django.conf import settings
from django.contrib.auth.models import User
from django.db import connection

class TokenAuthenticationMiddleware:
    EXCLUDED_URLS = ['/profile/login', '/profile/register/']
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(' ')[1]  # Extract token from header
            user = self.authenticate_user(token)
            if user:
                request.user = user  # Attach authenticated user to the request object
        response = self.get_response(request)
        return response

    def should_exclude(self, path):
        return any(path.startswith(url) for url in self.EXCLUDED_URLS)

    def authenticate_user(self, token):
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload['user_id']
            user = User.objects.get(id=user_id)
            return user
        except jwt.ExpiredSignatureError:
            return None  # Token has expired
        except (jwt.InvalidTokenError, User.DoesNotExist):
            return None  # Invalid token or user not found
