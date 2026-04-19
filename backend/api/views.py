from rest_framework import generics, status, filters
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User

from .models import Category, ServicePost, Order, Review
from .serializers import (
    RegisterSerializer, 
    UserProfileSerializer, 
    CategorySerializer, 
    ServicePostSerializer, 
    OrderSerializer, 
    ReviewSerializer,
    LoginSerializer
)

# --- РЕГИСТРАЦИЯ И ПРОФИЛЬ ---
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    def get_object(self):
        return self.request.user

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
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'service', 'customer', 'service__author']
    ordering_fields = ['created_at', 'status']
    ordering = ['-created_at']

    def get_queryset(self):
        user = self.request.user
        if user.is_anonymous:
            return Order.objects.none()
        return Order.objects.filter(Q(customer=user) | Q(service__author=user)).distinct()

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

class OrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

# --- ОТЗЫВЫ ---
class ReviewCreateUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        service = get_object_or_404(ServicePost, pk=pk)
        review = Review.objects.filter(user=request.user, service=service).first()
        
        if review:
            serializer = ReviewSerializer(review, data=request.data, partial=True)
        else:
            serializer = ReviewSerializer(data=request.data)
            
        if serializer.is_valid():
            serializer.save(user=request.user, service=service)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)