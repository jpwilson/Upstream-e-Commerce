# ShopHub - E-Commerce Platform

A full-stack e-commerce platform built with Django REST Framework (backend) and React + Vite (frontend).

## Features

- Product catalog with categories, images, search, and filtering
- Shopping cart with session-based persistence (merges with user cart on login)
- Checkout flow supporting both guest and registered users
- Payment processing stubs for credit card (Stripe) and PayPal
- Order management with status tracking and email confirmations
- Inventory management with stock levels and out-of-stock handling
- Customer accounts with profiles and order history

## Project Structure

```
ecommerce_platform/
├── backend/           # Django + DRF API
│   ├── config/        # Project settings, URLs
│   ├── products/      # Product catalog & categories
│   ├── cart/          # Shopping cart
│   ├── orders/        # Order management
│   ├── accounts/      # User accounts & profiles
│   └── payments/      # Payment processing stubs
├── frontend/          # React + Vite SPA
│   └── src/
│       ├── components/  # UI components
│       ├── context/     # React context (auth, cart)
│       └── api.js       # Axios API client
└── README.md
```

## Setup Instructions

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create a superuser (for admin access)
python manage.py createsuperuser

# Start the development server
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`.
The admin panel is at `http://localhost:8000/admin/`.

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173/`.
The Vite dev server proxies `/api` and `/media` requests to the Django backend.

### Environment Variables (Optional)

Create a `.env` file in the `backend/` directory:

```
DJANGO_SECRET_KEY=your-secret-key-here
DEBUG=True
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## API Endpoints

### Products
- `GET /api/products/items/` - List products (filterable, searchable, orderable)
- `GET /api/products/items/<slug>/` - Product detail
- `GET /api/products/items/featured/` - Featured products
- `GET /api/products/categories/` - List categories

### Cart
- `GET /api/cart/` - Get current cart
- `POST /api/cart/add/` - Add item to cart
- `PATCH /api/cart/items/<id>/` - Update item quantity
- `DELETE /api/cart/items/<id>/remove/` - Remove item
- `POST /api/cart/clear/` - Clear cart

### Orders
- `POST /api/orders/create/` - Create order from cart
- `GET /api/orders/` - List user's orders (authenticated)
- `GET /api/orders/<uuid>/` - Order detail

### Accounts
- `POST /api/accounts/register/` - Register
- `POST /api/accounts/login/` - Login
- `POST /api/accounts/logout/` - Logout
- `GET /api/accounts/profile/` - Get profile
- `PATCH /api/accounts/profile/update/` - Update profile
- `GET /api/accounts/check/` - Check auth status

### Payments
- `POST /api/payments/process/` - Process payment (stub)
- `POST /api/payments/create-intent/` - Create payment intent (stub)

## Adding Sample Data

After running migrations, use the Django admin at `/admin/` to add categories and products, or use the Django shell:

```python
python manage.py shell

from products.models import Category, Product

cat = Category.objects.create(name="Electronics", description="Electronic devices")
Product.objects.create(
    name="Wireless Headphones",
    description="Premium noise-cancelling wireless headphones.",
    price=79.99,
    sku="ELEC-WH-001",
    stock_quantity=50,
    category=cat,
    is_featured=True,
)
```

## Notes

- Payment processing uses stubs -- no real charges are made
- Email confirmations use Django's console backend (printed to terminal in development)
- SQLite is used by default; switch to PostgreSQL for production
- CORS is configured for the Vite dev server on port 5173
