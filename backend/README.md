# CAS Backend — Node.js + Express + MySQL + Sequelize

Backend REST API for the **CAS Laptop E-commerce** platform, supporting both the customer-facing storefront and the admin panel.

---

## 📋 Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 18.x |
| npm | ≥ 9.x |
| MySQL | ≥ 8.0 |

---

## ⚙️ Setup Instructions

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your values:
```bash
copy .env.example .env
```

Default `.env` (already set up for local dev):
```
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=cas_db
DB_USER=root
DB_PASSWORD=1234
JWT_SECRET=super_secret_jwt_key_change_me
JWT_EXPIRES_IN=1d
```

### 3. Create the database
```bash
npm run db:create
```

### 4. Run migrations
```bash
npm run migrate
```

### 5. Seed sample data
```bash
npm run seed
```

This creates:
- 1 admin account: `admin@cas.vn` / `Admin@123`
- 10 customer accounts: `customer1@cas.vn` ... `customer10@cas.vn` / `123456`
- 10 product categories (Gaming, Office, MacBook, etc.)
- 50 sample products (8 marked as featured)
- 4 ready-to-use voucher codes: `WELCOME10`, `CAS500K`, `SUMMER15`, `FLASH2M`

### 6. Start the dev server
```bash
npm run dev
```

Server starts at: **http://localhost:5000**

---

## 📂 Project Structure

```
backend/
├── src/
│   ├── app.js                  # Express entry point
│   ├── config/
│   │   └── config.js           # Sequelize DB config (reads from .env)
│   ├── controllers/            # Business logic
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   ├── reviewController.js
│   │   ├── voucherController.js
│   │   └── wishlistController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js   # JWT verification
│   │   ├── adminMiddleware.js  # Role guard
│   │   ├── errorMiddleware.js  # Global error handler
│   │   └── uploadMiddleware.js # Multer (file uploads)
│   ├── migrations/             # Sequelize migration files
│   ├── models/                 # Sequelize models + associations
│   ├── routes/                 # Express router definitions
│   ├── seeders/                # Demo data seed files
│   ├── uploads/                # Static uploaded files (served at /uploads)
│   └── validators/             # express-validator rule sets
├── .env
├── .env.example
├── .sequelizerc
├── CAS_Backend.postman_collection.json
└── package.json
```

---

## 🗄️ Database Schema

| Table | Description |
|-------|-------------|
| `Users` | Customer and admin accounts with bcrypt-hashed passwords |
| `Categories` | Product categories (name, slug) |
| `Products` | Laptop inventory with specs, pricing, featured flag |
| `ProductImages` | Additional images per product |
| `CartItems` | Per-user shopping cart |
| `WishlistItems` | Per-user saved products |
| `Orders` | Placed orders with shipping info and status |
| `OrderItems` | Snapshot of products at time of purchase |
| `Vouchers` | Discount codes (percent or fixed, with usage limits) |
| `VoucherUsages` | Tracks which user used which voucher on which order |
| `Reviews` | Product reviews with rating (1–5) and comment |

---

## 📡 API Endpoints

### Auth (`/api/auth`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | — | Register new customer |
| POST | `/login` | — | Login, returns JWT |
| POST | `/logout` | — | (client discards token) |
| GET | `/me` | ✅ | Get current user profile |
| PUT | `/profile` | ✅ | Update name, phone, avatar |
| PUT | `/change-password` | ✅ | Change password |

### Products (`/api/products`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | — | List products (page, limit, category, brand, minPrice, maxPrice, sort, q) |
| GET | `/featured` | — | 8 featured products |
| GET | `/bestsellers` | — | Top 8 by units sold |
| GET | `/search?q=` | — | Text search (name, brand, cpu) |
| GET | `/:id` | — | Full product detail with images + reviews |

### Cart (`/api/cart`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | ✅ | Get current cart |
| POST | `/` | ✅ | Add item (product_id, quantity) |
| PUT | `/:id` | ✅ | Update quantity |
| DELETE | `/:id` | ✅ | Remove item |

### Wishlist (`/api/wishlist`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | ✅ | Get wishlist |
| POST | `/` | ✅ | Add product |
| DELETE | `/:id` | ✅ | Remove product |

### Vouchers (`/api/vouchers`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/validate` | — | Validate a voucher code |

### Orders (`/api/orders`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/` | ✅ | Place order from cart |
| GET | `/` | ✅ | My orders |
| GET | `/:id` | ✅ | Order detail |

### Reviews (`/api/reviews`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/product/:id` | — | Reviews for a product |
| POST | `/` | ✅ | Create review |
| PUT | `/:id` | ✅ | Update own review |
| DELETE | `/:id` | ✅ | Delete own review |

### Admin (`/api/admin`) — requires admin JWT
| Method | Path | Description |
|--------|------|-------------|
| GET | `/dashboard` | Revenue, user, order, product counts + top items |
| POST | `/products` | Create product (multipart/form-data) |
| PUT | `/products/:id` | Update product |
| DELETE | `/products/:id` | Delete product |
| POST | `/products/:id/images` | Upload extra product images |
| GET | `/orders` | All orders (paginated, filterable by status) |
| PUT | `/orders/:id/status` | Update order status |
| GET | `/vouchers` | All vouchers |
| POST | `/vouchers` | Create voucher |
| PUT | `/vouchers/:id` | Update voucher |
| DELETE | `/vouchers/:id` | Delete voucher |
| GET | `/users` | All users (paginated) |
| GET | `/users/:id` | User detail + order history |
| DELETE | `/users/:id` | Delete customer (admins protected) |
| GET | `/reviews` | All reviews |
| DELETE | `/reviews/:id` | Moderate / delete review |

---

## 🧪 Testing with Postman

1. Import `CAS_Backend.postman_collection.json` into Postman.
2. The collection uses variables (`{{baseUrl}}`, `{{token}}`, `{{adminToken}}`).
3. Run **Login (Admin)** or **Login (Customer)** first — the test scripts will **auto-save the token** to the collection variable.
4. All other requests use `{{token}}` or `{{adminToken}}` in `Authorization: Bearer` headers automatically.

---

## 📦 NPM Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `nodemon src/app.js` | Development server with hot reload |
| `start` | `node src/app.js` | Production server |
| `migrate` | `sequelize-cli db:migrate` | Run all pending migrations |
| `migrate:undo` | `sequelize-cli db:migrate:undo:all` | Rollback all migrations |
| `seed` | `sequelize-cli db:seed:all` | Run all seeders |
| `seed:undo` | `sequelize-cli db:seed:undo:all` | Undo all seeders |
| `db:create` | `sequelize-cli db:create` | Create the database |

---

## 🔒 Security Notes

- Passwords hashed with **bcrypt** (salt rounds: 10) via Sequelize `beforeCreate`/`beforeUpdate` hooks.
- JWTs expire in **1 day** by default (configure `JWT_EXPIRES_IN` in `.env`).
- `helmet` enabled on all routes.
- Admin-only routes protected by double guard: `protect` (JWT) → `admin` (role check).
- File uploads restricted to `image/*` MIME types and 5MB max by Multer.

---

## 🚀 Standard Response Format

All responses follow this envelope:

```json
{
  "success": true | false,
  "message": "Human-readable message",
  "data": { ... } | null
}
```

Paginated list responses include:
```json
{
  "data": {
    "products": [...],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 12,
      "totalPages": 5
    }
  }
}
```
