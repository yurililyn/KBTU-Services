from django.contrib import admin
from .models import Category, ServicePost, Order, Review, Profile

admin.site.register(Category)
admin.site.register(ServicePost)
admin.site.register(Order)
admin.site.register(Review)
admin.site.register(Profile)