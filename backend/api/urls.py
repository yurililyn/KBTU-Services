from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='api_register'),

    path('profile/', views.UserProfileView.as_view(), name='api_profile'),
    path('profile/avatar/', views.AvatarUploadView.as_view(), name='avatar_upload'),
    path('profile/change-password/', views.ChangePasswordView.as_view(), name='change_password'),
    path('profile/<int:pk>/', views.PublicProfileView.as_view(), name='public_profile'),
    
    path('orders/', views.OrderListCreateView.as_view(), name='api_orders_list'),
    path('orders/<int:pk>/', views.OrderDetailView.as_view(), name='api_order_detail'),

    path('categories/', views.CategoryListView.as_view(), name='api_categories'),
    
    path('services/', views.ServicePostListCreateView.as_view(), name='api_services'),
    path('services/<int:pk>/', views.ServicePostDetailView.as_view(), name='api_service_detail'),
    path('services/<int:pk>/review/', views.ReviewCreateUpdateView.as_view(), name='service_review'),
]