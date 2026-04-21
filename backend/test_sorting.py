import os
import django
from datetime import timedelta
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings') 
django.setup()

from django.contrib.auth.models import User
from api.models import Category, ServicePost

def run_sorting_test():
    # 1. Берем категорию и пользователя (убедись, что они есть в БД)
    user = User.objects.get(username='artem')
    category = Category.objects.get(name='Academic Tutoring')
    
    now = timezone.now()

    # Данные для массовки с разным временем
    test_services = [
        {'title': '1. VERY OLD (Yesterday)', 'offset': timedelta(days=1), 'price': 1000},
        {'title': '2. OLD (3 hours ago)', 'offset': timedelta(hours=3), 'price': 2000},
        {'title': '3. NEW (10 minutes ago)', 'offset': timedelta(minutes=10), 'price': 3000},
        {'title': '4. FUTURE (Just now)', 'offset': timedelta(seconds=0), 'price': 4000},
    ]

    print("🚀 Starting time-travel service creation...")

    for item in test_services:
        # Создаем запись
        service, created = ServicePost.objects.get_or_create(
            title=item['title'],
            author=user,
            category=category,
            defaults={
                'description': f"Testing sorting for {item['title']}",
                'price': item['price']
            }
        )
        
        # ВЫНУЖДАЕМ Django изменить дату (обходим auto_now_add)
        target_date = now - item['offset']
        ServicePost.objects.filter(id=service.id).update(created_at=target_date)
        
        print(f"✅ Created: {item['title']} | Date: {target_date.strftime('%Y-%m-%d %H:%M')}")

    print("\n🔥 Ready! Now check your API with: ?ordering=-created_at")

if __name__ == '__main__':
    run_sorting_test()