from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate

from .models import Category, ServicePost
from .serializers import (
    LoginSerializer, 
    OrderCreateSerializer,
    CategorySerializer, 
    ServicePostSerializer
)

# ==========================================
# 1. FUNCTION-BASED VIEWS (FBV)
# ==========================================

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """FBV для логина и получения токена"""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = authenticate(
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password']
        )
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        return Response({'error': 'Неверные учетные данные'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    """FBV для создания заказа с автоматической привязкой к request.user"""
    serializer = OrderCreateSerializer(data=request.data)
    if serializer.is_valid():
        # Привязываем заказчика (customer) к текущему юзеру
        serializer.save(customer=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ==========================================
# 2. CLASS-BASED VIEWS (CBV)
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