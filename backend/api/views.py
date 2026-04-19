from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .serializers import RegisterSerializer
from .serializers import UserProfileSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

from .models import Category, ServicePost, Order
from .serializers import (
    LoginSerializer, 
    OrderCreateSerializer,
    CategorySerializer, 
    ServicePostSerializer
)

# ==========================================
# РЕГИСТРАЦИЯ ПОЛЬЗОВАТЕЛЯ
# ==========================================
class RegisterView(generics.CreateAPIView):
    """
    Эндпоинт: POST /api/register/
    Функционал: Создание нового пользователя
    Доступ: Разрешен всем (даже без токена)
    """
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny] # Разрешаем регистрацию кому угодно

# ==========================================
# ПРОФИЛЬ ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ
# ==========================================
class UserProfileView(generics.RetrieveAPIView):
    """
    Эндпоинт: GET /api/profile/
    Функционал: Возвращает данные текущего авторизованного юзера
    Доступ: Только с токеном (IsAuthenticated)
    """
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        """
        Вместо того чтобы искать пользователя по ID из URL, 
        мы просто берем пользователя из токена авторизации (request.user)
        """
        return self.request.user

# ==========================================
# CLASS-BASED VIEWS (CBV)
# ==========================================

class CategoryListView(generics.ListAPIView):
    """CBV для получения списка всех категорий"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class ServicePostListCreateView(generics.ListCreateAPIView):
    queryset = ServicePost.objects.all().order_by('-created_at')
    serializer_class = ServicePostSerializer
    
    # 1. ПОДКЛЮЧАЕМ ФИЛЬТРЫ
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    # 2. НАСТРАИВАЕМ (Что именно фильтровать и искать)
    filterset_fields = ['category', 'author'] # Точное совпадение (например: category=1)
    search_fields = ['$title', '$description']  # Поиск по тексту (внутри названия и описания)
    ordering_fields = ['price', 'created_at'] # По каким полям разрешить сортировку

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class ServicePostDetailView(generics.RetrieveUpdateDestroyAPIView):
    """CBV для CRUD: Просмотр, Обновление и Удаление конкретной услуги"""
    queryset = ServicePost.objects.all()
    serializer_class = ServicePostSerializer
    permission_classes = [IsAuthenticated]

# ==========================================
# ЗАКАЗЫ (Временно открыто для тестов фронта - AllowAny)
# ==========================================

class OrderListCreateView(generics.ListCreateAPIView):
    """
    Эндпоинты:
    - GET /api/orders/  -> Получить список всех заказов
    - POST /api/orders/ -> Создать новый заказ
    """
    queryset = Order.objects.all() 
    serializer_class = OrderCreateSerializer
    permission_classes = [AllowAny]

    # ПОДКЛЮЧАЕМ ФИЛЬТРЫ ДЛЯ ЗАКАЗОВ
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    
    # Фильтрация по статусу, по ID услуги и по заказчику
    filterset_fields = ['status', 'service', 'customer'] 
    ordering_fields = ['created_at']

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            customer = self.request.user
        else:
            customer = User.objects.first() 
        serializer.save(customer=customer)

    def perform_create(self, serializer):
        """
        Сохраняем тот самый "костыль" для фронтендера при POST-запросе:
        Если есть токен - берем юзера. Если нет - вешаем заказ на админа.
        """
        if self.request.user.is_authenticated:
            customer = self.request.user
        else:
            customer = User.objects.first() # Временная заглушка
            
        serializer.save(customer=customer)


class OrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Эндпоинты:
    - GET /api/orders/<id>/ -> Посмотреть конкретный заказ
    - PUT/PATCH /api/orders/<id>/ -> Обновить заказ (например, изменить status)
    """
    queryset = Order.objects.all()
    serializer_class = OrderCreateSerializer
    permission_classes = [AllowAny] # Временный доступ без токена