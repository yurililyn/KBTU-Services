import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings') 
django.setup()

from django.contrib.auth.models import User
from api.models import Category, Profile, ServicePost 

def run():
    # 1. Создаем категории и сохраняем их в словарь для быстрого доступа
    categories_names = [
        'Academic Tutoring', 
        'Design', 
        'Rental', 
        'General Help'
    ]
    
    categories = {}
    for cat_name in categories_names:
        cat, _ = Category.objects.get_or_create(name=cat_name)
        categories[cat_name] = cat
    print("✅ Categories created")

    # 2. Создаем аккаунты (теперь с email)
    users_data = [
        {'user': 'artem', 'first': 'Artem', 'email': 'artem@kbtu.kz', 'phone': '+79001112233', 'tg': '@konyuktor'},
        {'user': 'yerlan', 'first': 'Yerlan', 'email': 'yerlan@kbtu.kz', 'phone': '+79004445566', 'tg': '@balapan4ik_b'},
        {'user': 'maksim', 'first': 'Maksim', 'email': 'maksim@kbtu.kz', 'phone': '+79007778899', 'tg': '@yuriilyn'},
    ]

    users = {}
    for data in users_data:
        # Ищем пользователя по логину
        user, created = User.objects.get_or_create(username=data['user'])
        
        if created:
            user.set_password('123123123') 
            user.first_name = data['first']
            user.email = data['email']
            user.save()
            
            profile, _ = Profile.objects.get_or_create(user=user)
            profile.phone = data['phone']
            profile.telegram = data['tg']
            profile.save()
            print(f"👤 Account {data['user']} is ready")
            
        users[data['user']] = user

    # 3. Создаем массовку (Услуги)
    services_to_create = [
        # Academic Tutoring
        {'title': 'Python & Django Backend Mentoring', 'price': 5000, 'cat': 'Academic Tutoring', 'user': 'artem'},
        {'title': 'Calculus 1 Midterm Preparation', 'price': 4000, 'cat': 'Academic Tutoring', 'user': 'maksim'},
        
        # Design
        {'title': 'Figma Design for Web Projects', 'price': 8000, 'cat': 'Design', 'user': 'yerlan'},
        {'title': 'Custom Logo for Student Clubs', 'price': 5000, 'cat': 'Design', 'user': 'artem'},
        
        # Rental
        {'title': 'Scientific Calculator Rental (Daily)', 'price': 1000, 'cat': 'Rental', 'user': 'maksim'},
        {'title': 'GoPro Hero for Video Projects', 'price': 3000, 'cat': 'Rental', 'user': 'yerlan'},
        
        # General Help
        {'title': 'Dormitory Move-in Assistance', 'price': 2500, 'cat': 'General Help', 'user': 'yerlan'},
        {'title': 'English Academic Essay Proofreading', 'price': 3000, 'cat': 'General Help', 'user': 'maksim'},
        {'title': 'Fixing PC & Installing Windows', 'price': 4000, 'cat': 'General Help', 'user': 'artem'},
    ]

    for s in services_to_create:
        ServicePost.objects.get_or_create(
            author=users[s['user']],
            category=categories[s['cat']],
            title=s['title'],
            defaults={
                'description': f"High-quality service provided by {users[s['user']].first_name}. Contact me on Telegram for details!",
                'price': s['price']
            }
        )
    print(f"✅ Created {len(services_to_create)} demo services")

if __name__ == '__main__':
    run()