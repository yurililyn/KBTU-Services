from django.db import models
from django.contrib.auth.models import User
from django.db.models import Avg
from django.core.validators import MinValueValidator, MaxValueValidator

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
    average_rating = models.FloatField(default=0.0)
    total_votes = models.IntegerField(default=0)
    
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

# Модель 5: Отзывы и Рейтинг
class Review(models.Model):
    service = models.ForeignKey(ServicePost, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    score = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)]) # Оценка строго от 1 до 5
    text = models.TextField(blank=True, null=True) # Текст отзыва (необязательно)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # ЗАЩИТА: Один пользователь может оставить только один отзыв на конкретную услугу
        unique_together = ('service', 'user')

    def __str__(self):
        return f"{self.score} stars by {self.user.username} for {self.service.title}"

    # Автоматически пересчитываем рейтинг услуги при сохранении отзыва
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs) # Сначала сохраняем сам отзыв
        self.update_service_rating()

    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs) # Если отзыв удалили, тоже пересчитываем
        self.update_service_rating()

    def update_service_rating(self):
        # Берем все отзывы к этой услуге и считаем среднее арифметическое
        reviews = self.service.reviews.all()
        if reviews.exists():
            avg = reviews.aggregate(Avg('score'))['score__avg']
            self.service.average_rating = round(avg, 1) # Округляем до 1 знака (например, 4.5)
            self.service.total_votes = reviews.count()
        else:
            self.service.average_rating = 0.0
            self.service.total_votes = 0
        self.service.save()

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    
    phone = models.CharField(max_length=20, blank=True, null=True)
    telegram = models.CharField(max_length=50, blank=True, null=True) # Например: @username

    def __str__(self):
        return f"Profile for {self.user.username}"