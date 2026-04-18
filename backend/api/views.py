from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .serializers import RegisterSerializer

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
# CLASS-BASED VIEWS (CBV)
# ==========================================

class CategoryListView(generics.ListAPIView):
    """CBV для получения списка всех категорий"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class ServicePostListCreateView(generics.ListCreateAPIView):
    """CBV для CRUD: Список и Создание услуг"""
    queryset = ServicePost.objects.all()
    serializer_class = ServicePostSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]

    def perform_create(self, serializer):
        # Привязываем автора к текущему пользователю
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
    permission_classes = [AllowAny] # Временный доступ без токена

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