from django.contrib import admin
from .models import Category, ServicePost, Order

admin.site.register(Category)
admin.site.register(ServicePost)
admin.site.register(Order)