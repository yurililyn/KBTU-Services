from django.urls import path
from . import views

urlpatterns = [
    # FBV
    path('orders/', views.create_order, name='api_create_order'),
    
    # CBV
    path('categories/', views.CategoryListView.as_view(), name='api_categories'),
    path('services/', views.ServicePostListCreateView.as_view(), name='api_services'),
    path('services/<int:pk>/', views.ServicePostDetailView.as_view(), name='api_service_detail'),
]