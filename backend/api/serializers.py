from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, ServicePost, Order

# ==========================================
# 2 ОБЫЧНЫХ SERIALIZER (Plain Serializers)
# ==========================================

# 1. Для логина пользователя
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True)

# 2. Для создания отклика/заказа
class OrderCreateSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    service_id = serializers.IntegerField()
    message = serializers.CharField(max_length=255, required=False, allow_blank=True)
    status = serializers.CharField(read_only=True)
    
    def create(self, validated_data):
        # Поле customer (request.user) будет передано напрямую во View
        return Order.objects.create(**validated_data)


# ==========================================
# 2 MODEL SERIALIZER
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
                  'author', 'author_username', 'category', 'category_name']
        # Поле author заполняется автоматически на бэкенде, защищаем его от ручного ввода
        read_only_fields = ['author']