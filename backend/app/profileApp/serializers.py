from rest_framework import serializers
from .models import Profile
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.validators import UniqueValidator

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
        user = Profile.objects.create(
            name=validated_data['name'],
            email=validated_data['email'],
            image_metadata=validated_data.get('image_metadata', None),
            image_blob=validated_data.get('image_blob', None)
        )

        user.set_password(validated_data['password'])
        user.save()

        return user

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'