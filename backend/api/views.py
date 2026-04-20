from rest_framework import generics, status, filters
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Category, ServicePost, Order, Review, Profile
from .serializers import (
    RegisterSerializer, 
    UserProfileSerializer, 
    CategorySerializer, 
    ServicePostSerializer, 
    OrderSerializer, 
    ReviewSerializer,
    LoginSerializer,
    ChangePasswordSerializer
)

# --- РЕГИСТРАЦИЯ И ПРОФИЛЬ ---
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    def get_object(self):
        return self.request.user

class PublicProfileView(generics.RetrieveAPIView):
    permission_classes = [AllowAny] 
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer

# --- КАТЕГОРИИ ---
class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

# --- УСЛУГИ ---
class ServicePostListCreateView(generics.ListCreateAPIView):
    queryset = ServicePost.objects.all().order_by('-created_at')
    serializer_class = ServicePostSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'author']
    search_fields = ['$title', '$description']
    ordering_fields = ['price', 'created_at']

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class ServicePostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ServicePost.objects.all()
    serializer_class = ServicePostSerializer
    permission_classes = [AllowAny]

# --- ЗАКАЗЫ ---
class OrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [AllowAny]
    
    # 1. Подключаем движок фильтрации
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    
    # 2. Разрешаем фильтровать по этим полям через URL
    # 'customer' — для вкладки "My Orders"
    # 'service__author' — для вкладки "Received Orders"
    filterset_fields = ['customer', 'service__author', 'status']
    
    ordering = ['-created_at']

    def get_queryset(self):
        user = self.request.user
        
        # ЕСЛИ ЮЗЕР НЕ АВТОРИЗОВАН
        if not user.is_authenticated:
            # Возвращаем пустой список заказов вместо ошибки
            return Order.objects.none()

        # Если авторизован, работаем как обычно
        return Order.objects.filter(
            Q(customer=user) | Q(service__author=user)
        ).distinct()

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

class OrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

class ReviewCreateUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        service = get_object_or_404(ServicePost, pk=pk)
        reviews = Review.objects.filter(service=service).order_by('-created_at')
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    def post(self, request, pk):
        service = get_object_or_404(ServicePost, pk=pk)
                
        # ЗАЩИТА 1: Продавец не может оценивать свою собственную услугу
        if service.author == request.user:
            return Response(
                {"detail": "Вы не можете оставлять отзыв на свою собственную услугу."}, 
                status=status.HTTP_403_FORBIDDEN
            )

        # ЗАЩИТА 2: Оставить отзыв может только тот, кто реально заказал услугу 
        # (и заказ находится в статусе accepted или completed)
        has_valid_order = Order.objects.filter(
            customer=request.user, 
            service=service, 
            status__in=['accepted', 'completed'] # Учитываем только принятые или завершенные заказы
        ).exists()
        
        if not has_valid_order:
            return Response(
                {"detail": "Вы можете оценивать только те услуги, которые вы заказали."}, 
                status=status.HTTP_403_FORBIDDEN
            )
            
        # --- КОНЕЦ НОВЫХ ПРОВЕРОК ---

        # Старая логика создания или обновления отзыва
        review = Review.objects.filter(user=request.user, service=service).first()
        
        if review:
            serializer = ReviewSerializer(review, data=request.data, partial=True)
        else:
            serializer = ReviewSerializer(data=request.data)
            
        if serializer.is_valid():
            serializer.save(user=request.user, service=service)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Проверяем, правильный ли старый пароль
            if not user.check_password(serializer.data.get("old_password")):
                return Response(
                    {"old_password": ["Неверный текущий пароль."]}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Устанавливаем новый пароль (set_password автоматически его хэширует)
            user.set_password(serializer.data.get("new_password"))
            user.save()
            
            return Response(
                {"detail": "Пароль успешно изменен."}, 
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AvatarUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser) # Важно для файлов

    def post(self, request):
        user = request.user
        # Получаем или создаем профиль
        profile, created = Profile.objects.get_or_create(user=user)
        
        if 'avatar' in request.data:
            profile.avatar = request.data['avatar']
            profile.save()
            return Response({"avatar_url": profile.avatar.url}, status=200)
        
        return Response({"error": "Файл не найден"}, status=400)
    


class CheckUsernameView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        username = request.query_params.get('username', '').strip()
        if not username:
            return Response({'available': False})
        exists = User.objects.filter(username=username).exists()
        return Response({'available': not exists})