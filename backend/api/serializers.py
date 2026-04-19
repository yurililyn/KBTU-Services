from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, ServicePost, Order, Review

# ==========================================
# РЕГИСТРАЦИЯ
# ==========================================
class RegisterSerializer(serializers.ModelSerializer):
    # Указываем, что пароль можно только писать (он не будет возвращаться в ответах GET)
    password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(required=True, max_length=150)
    last_name = serializers.CharField(required=True, max_length=150)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'password'] # email по желанию

    def create(self, validated_data):
        # САМОЕ ВАЖНОЕ: Используем create_user, а не просто create!
        # Только create_user умеет правильно шифровать пароль.
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        return user
    
# ==========================================
# ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ (/me)
# ==========================================
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Перечисляем только те поля, которые безопасно отдавать фронтенду
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

# ==========================================
# 2 ОБЫЧНЫХ SERIALIZER (Plain Serializers)
# ==========================================

# 1. Для логина пользователя
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True)

# 2. Для создания отклика/заказа
class OrderCreateSerializer(serializers.ModelSerializer):
    customer_username = serializers.ReadOnlyField(source='customer.username')
    service_title = serializers.ReadOnlyField(source='service.title')

    class Meta:
        model = Order
        fields = [
            'id', 
            'customer', 
            'customer_username', 
            'service', 
            'service_title', 
            'message', 
            'status', 
            'created_at'
        ]
        read_only_fields = ['customer', 'created_at']

# ==========================================
# 3 MODEL SERIALIZER
# ==========================================

# 1. Для Категорий
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']

# 2. Для Услуг (ServicePost)
class ServicePostSerializer(serializers.ModelSerializer):
    # Добавляем read-only поля, чтобы на фронтенде было удобно выводить имена, а не только ID
    author_username = serializers.ReadOnlyField(source='author.username')
    category_name = serializers.ReadOnlyField(source='category.name')

    class Meta:
        model = ServicePost
        fields = ['id', 'title', 'description', 'price', 'created_at', 
                  'author', 'author_username', 'category', 'category_name',
                  'average_rating', 'total_votes']
        read_only_fields = ['author', 'average_rating', 'total_votes']

# 3. Cериализатор для отзывов
class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Review
        fields = ['id', 'user', 'username', 'score', 'text', 'created_at']
        read_only_fields = ['user'] # Юзер берется из токена автоматически