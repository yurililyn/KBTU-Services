from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, ServicePost, Order, Review, Profile

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
    
    user_role = serializers.SerializerMethodField() 
    
    class Meta:
        model = Order
        fields = [
            'id', 'customer', 'customer_username', 'service', 
            'service_title', 'service_author_id', 'message', 
            'status', 'created_at', 
            'user_role' # 2. И СЮДА ЕГО НУЖНО БЫЛО ДОБАВИТЬ
        ]
        read_only_fields = ['customer', 'created_at']

    def get_user_role(self, obj):
        # Добавил безопасную проверку, чтобы код не падал, если реквеста вдруг нет
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            user = request.user
            if obj.customer == user:
                return "customer"  # Покупатель
            if obj.service.author == user:
                return "author"    # Продавец
        return "none"

class UserProfileSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(source='profile.avatar', read_only=True)
    
    # Разрешаем фронтенду присылать эти поля
    phone = serializers.CharField(source='profile.phone', required=False, allow_blank=True, allow_null=True)
    telegram = serializers.CharField(source='profile.telegram', required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'avatar', 'phone', 'telegram']

    def update(self, instance, validated_data):
        # DRF прячет данные для профиля в отдельный словарь из-за source='profile.x'
        profile_data = validated_data.pop('profile', {})
        print(f"DEBUG: Данные для профиля: {profile_data}") # Увидишь это в терминале Django

        # Обновляем имя/фамилию/почту
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.save()

        # Обновляем или создаем профиль
        profile, created = Profile.objects.get_or_create(user=instance)
        
        if 'phone' in profile_data:
            profile.phone = profile_data['phone']
        if 'telegram' in profile_data:
            profile.telegram = profile_data['telegram']
            
        profile.save()
        return instance

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']

class ServicePostSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')
    category_name = serializers.ReadOnlyField(source='category.name')

    author_email = serializers.ReadOnlyField(source='author.email')
    author_phone = serializers.ReadOnlyField(source='author.profile.phone')
    author_telegram = serializers.ReadOnlyField(source='author.profile.telegram')

    class Meta:
        model = ServicePost
        fields = ['id', 'title', 'description', 'price', 'created_at', 
                  'author', 'author_username', 'category', 'category_name',
                  'average_rating', 'total_votes',
                  'author_email', 'author_phone', 'author_telegram']
        read_only_fields = ['author', 'average_rating', 'total_votes']

class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = Review
        fields = ['id', 'user', 'username', 'score', 'text', 'created_at']
        read_only_fields = ['user']

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)