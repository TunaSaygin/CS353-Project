from rest_framework import serializers
from .models import Profile
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.validators import UniqueValidator
from django.db import connection
from django.contrib.auth.hashers import make_password

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        # ...

        return token


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=Profile.objects.all())]
    )

    class Meta:
        model = Profile
        fields = ('id', 'name', 'email', 'password', 'image_metadata', 'image_blob')

    def create(self, validated_data):
        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO app_profile (name, email, password, image_metadata, image_blob)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id
            """, [
                validated_data['name'],
                validated_data['email'],
                make_password(validated_data['password']),  # make_password is used to hash the password
                validated_data.get('image_metadata', None),
                validated_data.get('image_blob', None)
            ])
            row = cursor.fetchone()

        return Profile.objects.get(id=row[0])  # Fetch the newly created user

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'