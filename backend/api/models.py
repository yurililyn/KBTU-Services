from django.db import models
from django.contrib.auth.models import User

# Модель 1: Категория услуги
class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    
    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

# Модель 2: Объявление об услуге (2 ForeignKey)
class ServicePost(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # FK 1: Кто предлагает услугу
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='services')
    # FK 2: Категория услуги
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='services')

    def __str__(self):
        return f"{self.title} by {self.author.username}"

# Модель 3: Заказ / Отклик на услугу (2 ForeignKey)
class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('completed', 'Completed'),
    ]
    message = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    # FK 1: Кто заказывает
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    # FK 2: На какую услугу отклик
    service = models.ForeignKey(ServicePost, on_delete=models.CASCADE, related_name='orders')

    def __str__(self):
        return f"Order by {self.customer.username} for {self.service.title}"

# Модель 4: User (Используется встроенная модель Django, импортирована выше)