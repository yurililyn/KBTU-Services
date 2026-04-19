from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, ServicePost, Order, Review

# РЕГИСТРАЦИЯ
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(required=True, max_length=150)
    last_name = serializers.CharField(required=True, max_length=150)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        return user
    
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

# ЗАКАЗЫ (Исправлено для обновления статуса)
class OrderSerializer(serializers.ModelSerializer):
    customer_username = serializers.ReadOnlyField(source='customer.username')
    service_title = serializers.ReadOnlyField(source='service.title')
    service_author_id = serializers.ReadOnlyField(source='service.author.id')
    
    class Meta:
        model = Order
        fields = [
            'id', 'customer', 'customer_username', 'service', 
            'service_title', 'service_author_id', 'message', 
            'status', 'created_at'
        ]
        # ВАЖНО: status НЕ должен быть в read_only_fields, чтобы его можно было менять
        read_only_fields = ['customer', 'created_at']

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']

class ServicePostSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')
    category_name = serializers.ReadOnlyField(source='category.name')

    class Meta:
        model = ServicePost
        fields = ['id', 'title', 'description', 'price', 'created_at', 
                  'author', 'author_username', 'category', 'category_name',
                  'average_rating', 'total_votes']
        read_only_fields = ['author', 'average_rating', 'total_votes']

class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = Review
        fields = ['id', 'user', 'username', 'score', 'text', 'created_at']
        read_only_fields = ['user']