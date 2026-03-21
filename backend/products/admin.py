from django.contrib import admin
from .models import Category, Product, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "parent", "is_active"]
    prepopulated_fields = {"slug": ("name",)}
    list_filter = ["is_active"]
    search_fields = ["name"]


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "sku", "price", "stock_quantity", "category", "is_active", "is_featured"]
    prepopulated_fields = {"slug": ("name",)}
    list_filter = ["is_active", "is_featured", "category"]
    search_fields = ["name", "sku", "description"]
    inlines = [ProductImageInline]
    readonly_fields = ["created_at", "updated_at"]
