from django.core.management.base import BaseCommand
from products.models import Category, Product, ProductImage


CATEGORIES = [
    {"name": "Children's Books", "description": "Engaging books to inspire young readers and build literacy skills."},
    {"name": "Apparel", "description": "Fun hoodies, caps, and clothing that celebrate reading."},
    {"name": "Stationery", "description": "Notebooks, bookmarks, and writing supplies for budding authors."},
    {"name": "Desk & Study", "description": "Desk lamps, organizers, and study essentials for young learners."},
]

PRODUCTS = [
    # Children's Books
    {
        "name": "The Adventure Begins – Illustrated Storybook",
        "description": "A beautifully illustrated storybook that takes young readers on a magical journey through enchanted forests and hidden libraries. Perfect for ages 4-8, this book builds vocabulary and sparks imagination with vibrant artwork on every page.",
        "price": "14.99",
        "sku": "BOOK-ADV-001",
        "stock_quantity": 120,
        "category": "Children's Books",
        "is_featured": True,
        "image_url": "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=600&fit=crop",
        "alt_text": "Colorful children's storybook open on a table",
    },
    {
        "name": "My First ABC – Alphabet Learning Book",
        "description": "An interactive alphabet book with lift-the-flap surprises on every page. Each letter features a charming animal illustration and simple words to help toddlers learn their ABCs. Sturdy board book pages built for little hands.",
        "price": "9.99",
        "sku": "BOOK-ABC-001",
        "stock_quantity": 200,
        "category": "Children's Books",
        "is_featured": True,
        "image_url": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=600&fit=crop",
        "alt_text": "Stack of colorful children's books",
    },
    {
        "name": "Bedtime Stories Collection",
        "description": "A treasury of 50 soothing bedtime stories perfect for winding down. Features tales of friendly animals, dreamy landscapes, and gentle adventures. Includes a reading guide for parents with tips on building a nightly reading routine.",
        "price": "19.99",
        "compare_at_price": "24.99",
        "sku": "BOOK-BED-001",
        "stock_quantity": 85,
        "category": "Children's Books",
        "is_featured": False,
        "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop",
        "alt_text": "Cozy bedtime reading scene",
    },
    {
        "name": "World of Science – Kids Encyclopedia",
        "description": "Make science fun with this colorful encyclopedia designed for curious minds ages 6-12. Covers space, animals, weather, the human body, and more with easy-to-understand explanations and stunning photographs.",
        "price": "24.99",
        "sku": "BOOK-SCI-001",
        "stock_quantity": 60,
        "category": "Children's Books",
        "is_featured": False,
        "image_url": "https://images.unsplash.com/photo-1553729459-uj5dcva0jl4c?w=600&h=600&fit=crop",
        "alt_text": "Children's science encyclopedia",
    },

    # Apparel
    {
        "name": "\"Book Worm\" Kids Hoodie",
        "description": "A cozy pullover hoodie featuring an adorable bookworm character on the front. Made from 100% organic cotton fleece, this hoodie is soft, warm, and perfect for reading sessions on chilly days. Available in sizes 4-14.",
        "price": "34.99",
        "sku": "APP-HOOD-001",
        "stock_quantity": 75,
        "category": "Apparel",
        "is_featured": True,
        "image_url": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop",
        "alt_text": "Colorful kids hoodie",
    },
    {
        "name": "\"I Love Reading\" Baseball Cap",
        "description": "Show off your love of books with this embroidered baseball cap. Features an adjustable strap for the perfect fit, breathable mesh back panel, and a fun \"I ❤ Reading\" design. One size fits most kids ages 5-12.",
        "price": "16.99",
        "sku": "APP-CAP-001",
        "stock_quantity": 150,
        "category": "Apparel",
        "is_featured": True,
        "image_url": "https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=600&h=600&fit=crop",
        "alt_text": "Kids baseball cap",
    },
    {
        "name": "Library Explorer T-Shirt",
        "description": "A soft cotton t-shirt with a whimsical library scene printed on the front, featuring kids exploring towering bookshelves. Pre-shrunk and machine washable. Available in multiple colors and sizes 4-16.",
        "price": "19.99",
        "compare_at_price": "24.99",
        "sku": "APP-TEE-001",
        "stock_quantity": 100,
        "category": "Apparel",
        "is_featured": False,
        "image_url": "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600&h=600&fit=crop",
        "alt_text": "Kids t-shirt folded neatly",
    },

    # Stationery
    {
        "name": "Story Starter Notebook – Lined Journal",
        "description": "A beautifully designed 200-page lined notebook with story prompts at the top of every page. Encourages creative writing and journaling for kids ages 6+. Features a durable hardcover with a magnetic closure and bookmark ribbon.",
        "price": "12.99",
        "sku": "STAT-NB-001",
        "stock_quantity": 180,
        "category": "Stationery",
        "is_featured": True,
        "image_url": "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&h=600&fit=crop",
        "alt_text": "Colorful lined notebook for kids",
    },
    {
        "name": "Magnetic Bookmark Set (6-Pack)",
        "description": "Never lose your place again! This set of 6 magnetic bookmarks features adorable animal characters reading books. Each bookmark clips securely onto the page and is made from durable laminated cardstock. Perfect stocking stuffer!",
        "price": "8.99",
        "sku": "STAT-BM-001",
        "stock_quantity": 250,
        "category": "Stationery",
        "is_featured": True,
        "image_url": "https://images.unsplash.com/photo-1568667256549-094345857637?w=600&h=600&fit=crop",
        "alt_text": "Colorful bookmarks in a book",
    },
    {
        "name": "Young Author's Pencil Set",
        "description": "A premium set of 12 graphite pencils in assorted colors, each printed with an inspiring literary quote. Includes a sharpener shaped like a tiny book and a pencil case with a reading-themed design. Great for school or home.",
        "price": "11.99",
        "sku": "STAT-PEN-001",
        "stock_quantity": 130,
        "category": "Stationery",
        "is_featured": False,
        "image_url": "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&h=600&fit=crop",
        "alt_text": "Colorful pencils arranged neatly",
    },
    {
        "name": "Reading Log & Sticker Book",
        "description": "Track your reading adventures with this fun reading log! Includes space to record 100 books with ratings and reviews, plus 200+ reward stickers to celebrate milestones. A great way to motivate young readers.",
        "price": "7.99",
        "sku": "STAT-LOG-001",
        "stock_quantity": 160,
        "category": "Stationery",
        "is_featured": False,
        "image_url": "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=600&h=600&fit=crop",
        "alt_text": "Reading log journal with stickers",
    },

    # Desk & Study
    {
        "name": "LED Reading Desk Lamp",
        "description": "An adjustable LED desk lamp with 3 brightness levels and a warm reading mode that's gentle on young eyes. Features a flexible gooseneck, USB charging port, and a fun star-shaped base. Perfect for homework and bedtime reading.",
        "price": "29.99",
        "sku": "DESK-LAMP-001",
        "stock_quantity": 45,
        "category": "Desk & Study",
        "is_featured": True,
        "image_url": "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600&h=600&fit=crop",
        "alt_text": "Modern LED desk lamp for reading",
    },
    {
        "name": "Wooden Book Organizer",
        "description": "Keep books neat and accessible with this charming wooden desk organizer. Features 3 compartments sized for picture books, chapter books, and notebooks. Made from sustainable bamboo with rounded edges for child safety.",
        "price": "22.99",
        "sku": "DESK-ORG-001",
        "stock_quantity": 55,
        "category": "Desk & Study",
        "is_featured": False,
        "image_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop",
        "alt_text": "Wooden bookshelf organizer",
    },
    {
        "name": "Cozy Reading Cushion",
        "description": "Create the perfect reading nook with this oversized floor cushion. Features a built-in pocket for holding the current book, soft microfiber cover that's machine washable, and firm support for comfortable reading sessions.",
        "price": "39.99",
        "compare_at_price": "49.99",
        "sku": "DESK-CUSH-001",
        "stock_quantity": 30,
        "category": "Desk & Study",
        "is_featured": True,
        "image_url": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop",
        "alt_text": "Comfortable reading cushion",
    },
    {
        "name": "Alphabet Wall Poster Set",
        "description": "Brighten up any study space with this set of 4 educational wall posters. Includes an alphabet poster, a phonics chart, a sight words poster, and a reading milestones tracker. Printed on durable, tear-resistant paper.",
        "price": "15.99",
        "sku": "DESK-POST-001",
        "stock_quantity": 90,
        "category": "Desk & Study",
        "is_featured": False,
        "image_url": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=600&fit=crop",
        "alt_text": "Educational alphabet poster on wall",
    },
]


class Command(BaseCommand):
    help = "Seed the store with children's literacy products and Unsplash images"

    def handle(self, *args, **options):
        # Clear existing products
        ProductImage.objects.all().delete()
        Product.objects.all().delete()
        Category.objects.all().delete()
        self.stdout.write("Cleared existing catalog.")

        # Create categories
        cat_map = {}
        for cat_data in CATEGORIES:
            cat = Category.objects.create(**cat_data)
            cat_map[cat.name] = cat
            self.stdout.write(f"  Category: {cat.name}")

        # Create products with images
        for p_data in PRODUCTS:
            image_url = p_data.pop("image_url")
            alt_text = p_data.pop("alt_text")
            cat_name = p_data.pop("category")
            p_data["category"] = cat_map[cat_name]

            product = Product.objects.create(**p_data)
            ProductImage.objects.create(
                product=product,
                image_url=image_url,
                alt_text=alt_text,
                is_primary=True,
            )
            self.stdout.write(self.style.SUCCESS(f"  Product: {product.name}"))

        self.stdout.write(self.style.SUCCESS(
            f"\nDone! Created {len(CATEGORIES)} categories and {len(PRODUCTS)} products."
        ))
