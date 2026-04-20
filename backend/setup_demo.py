import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings') 
django.setup()

from django.contrib.auth.models import User
from api.models import Category, Profile 

def run():
    categories = [
        'Academic Tutoring', 
        'Design', 
        'Rental', 
        'General Help'
    ]
    
    for cat_name in categories:
        Category.objects.get_or_create(name=cat_name)
    print("✅ Categories created")

    users_data = [
        {'user': 'artem', 'first': 'Artem', 'phone': '+79001112233', 'tg': '@konyuktor'},
        {'user': 'yerlan', 'first': 'Yerlan', 'phone': '+79004445566', 'tg': '@balapan4ik_b'},
        {'user': 'maksim', 'first': 'Maksim', 'phone': '+79007778899', 'tg': '@yuriilyn'},
    ]

    for data in users_data:
        user, created = User.objects.get_or_create(username=data['user'])
        if created:
            user.set_password('123123123') 
            user.first_name = data['first']
            user.save()
            
            profile, _ = Profile.objects.get_or_create(user=user)
            profile.phone = data['phone']
            profile.telegram = data['tg']
            profile.save()
            print(f"👤 Account {data['user']} is ready")

if __name__ == '__main__':
    run()