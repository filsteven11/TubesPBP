# API Documentation - McDonald's Ordering System

## Table of Contents
1. [Database Structure](#database-structure)
2. [API Endpoints](#api-endpoints)
3. [Authentication & Middleware](#authentication--middleware)
4. [Error Handling](#error-handling)
5. [Request/Response Examples](#requestresponse-examples)

---

## Database Structure

### ER Diagram Analysis
```
┌────────────┐        ┌─────────────┐        ┌────────────┐
│   Users    │        │  Products   │        │ Categories │
├────────────┤        ├─────────────┤        ├────────────┤
│ id (PK)    │        │ id (PK)     │        │ id (PK)    │
│ email      │        │ name        │        │ name       │
│ password   │        │ price       │        └────────────┘
│ role       │        │ categoryId  │────────────┐
└────────────┘        │ createdAt   │            │
       ▲              │ updatedAt   │            │ FK
       │              └─────────────┘
       │                     ▲
       │                     │ FK (hasMany)
       │              ┌──────────────┐
       │              │  OrderItems  │
       │              ├──────────────┤
       │              │ id (PK)      │
       │              │ orderId (FK) │
       │              │ productId(FK)│
       │              │ quantity     │
       └──────────────┤ price       │
       (1:N via JWT)  │ total       │
                      └──────────────┘
                             ▲
                             │ FK (belongsTo)
                      ┌──────────────┐
                      │    Orders    │
                      ├──────────────┤
                      │ id (PK)      │
                      │ userId (FK)  │
                      │ total        │
                      │ status       │
                      │ createdAt    │
                      │ updatedAt    │
                      └──────────────┘
```

### Table Schemas

#### Users Table
```sql
CREATE TABLE Users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL (bcryptjs hashed),
  role ENUM('admin', 'customer') DEFAULT 'customer',
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

#### Categories Table
```sql
CREATE TABLE Categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

#### Products Table
```sql
CREATE TABLE Products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  categoryId INT NOT NULL,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP,
  FOREIGN KEY (categoryId) REFERENCES Categories(id)
);
```

#### Orders Table
```sql
CREATE TABLE Orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT (implied from JWT),
  total DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

#### OrderItems Table
```sql
CREATE TABLE OrderItems (
  id INT PRIMARY KEY AUTO_INCREMENT,
  orderId INT NOT NULL,
  productId INT NOT NULL,
  quantity INT DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2),
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP,
  FOREIGN KEY (orderId) REFERENCES Orders(id),
  FOREIGN KEY (productId) REFERENCES Products(id)
);
```

---

## API Endpoints

### Base URL
```
http://localhost:3000/api
```

### 1. Authentication Endpoints

#### 1.1 Login
- **Endpoint:** `POST /auth/login`
- **Method:** POST
- **Auth Required:** No
- **Description:** Authenticate user and get JWT token

**Request Body:**
```json
{
  "email": "admin@mail.com",
  "password": "admin123"
}
```

**Success Response (200):**
```json
{
  "msg": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@mail.com",
    "role": "admin"
  }
}
```

**Error Response (404):**
```json
{
  "msg": "User not found"
}
```

**Error Response (400):**
```json
{
  "msg": "Wrong password"
}
```

---

### 2. Product Endpoints

#### 2.1 Get All Products
- **Endpoint:** `GET /products`
- **Method:** GET
- **Auth Required:** No
- **Description:** Retrieve all products with their details

**Success Response (200):**
```json
[
  {
    "id": 1,
    "name": "Big Mac",
    "price": 45000,
    "categoryId": 1,
    "createdAt": "2026-04-20T10:00:00Z",
    "updatedAt": "2026-04-20T10:00:00Z"
  },
  {
    "id": 2,
    "name": "McChicken",
    "price": 35000,
    "categoryId": 1,
    "createdAt": "2026-04-20T10:00:00Z",
    "updatedAt": "2026-04-20T10:00:00Z"
  }
]
```

#### 2.2 Create Product (Admin Only)
- **Endpoint:** `POST /products`
- **Method:** POST
- **Auth Required:** Yes (Admin role)
- **Description:** Create new product

**Request Body:**
```json
{
  "name": "Chicken McNuggets",
  "price": 28000,
  "categoryId": 1
}
```

**Success Response (201):**
```json
{
  "id": 8,
  "name": "Chicken McNuggets",
  "price": 28000,
  "categoryId": 1,
  "createdAt": "2026-04-20T11:30:00Z",
  "updatedAt": "2026-04-20T11:30:00Z"
}
```

**Error Response (401):**
```json
{
  "msg": "Unauthorized - Token missing or invalid"
}
```

**Error Response (403):**
```json
{
  "msg": "Forbidden - Admin access required"
}
```

#### 2.3 Update Product (Admin Only)
- **Endpoint:** `PUT /products/:id`
- **Method:** PUT
- **Auth Required:** Yes (Admin role)
- **Description:** Update existing product

**URL Parameter:** `id` (Product ID)

**Request Body:**
```json
{
  "name": "Updated Big Mac",
  "price": 48000
}
```

**Success Response (200):**
```json
{
  "msg": "Product updated successfully"
}
```

**Error Response (404):**
```json
{
  "msg": "Product not found"
}
```

#### 2.4 Delete Product (Admin Only)
- **Endpoint:** `DELETE /products/:id`
- **Method:** DELETE
- **Auth Required:** Yes (Admin role)
- **Description:** Delete product

**URL Parameter:** `id` (Product ID)

**Success Response (200):**
```json
{
  "msg": "Product deleted successfully"
}
```

**Error Response (404):**
```json
{
  "msg": "Product not found"
}
```

---

### 3. Category Endpoints

#### 3.1 Get All Categories
- **Endpoint:** `GET /categories`
- **Method:** GET
- **Auth Required:** No
- **Description:** Retrieve all categories

**Success Response (200):**
```json
[
  {
    "id": 1,
    "name": "Burger",
    "createdAt": "2026-04-20T10:00:00Z",
    "updatedAt": "2026-04-20T10:00:00Z"
  },
  {
    "id": 2,
    "name": "Drink",
    "createdAt": "2026-04-20T10:00:00Z",
    "updatedAt": "2026-04-20T10:00:00Z"
  }
]
```

#### 3.2 Create Category (Admin Only)
- **Endpoint:** `POST /categories`
- **Method:** POST
- **Auth Required:** Yes (Admin role)
- **Description:** Create new category

**Request Body:**
```json
{
  "name": "Breakfast"
}
```

**Success Response (201):**
```json
{
  "id": 4,
  "name": "Breakfast",
  "createdAt": "2026-04-20T11:30:00Z",
  "updatedAt": "2026-04-20T11:30:00Z"
}
```

---

### 4. Order Endpoints

#### 4.1 Create Order
- **Endpoint:** `POST /orders`
- **Method:** POST
- **Auth Required:** No
- **Description:** Create new order with items

**Request Body:**
```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 45000
    },
    {
      "productId": 2,
      "quantity": 1,
      "price": 35000
    }
  ]
}
```

**Success Response (201):**
```json
{
  "id": 5,
  "total": 125000,
  "status": "pending",
  "items": [
    {
      "id": 10,
      "orderId": 5,
      "productId": 1,
      "quantity": 2,
      "price": 45000,
      "total": 90000
    },
    {
      "id": 11,
      "orderId": 5,
      "productId": 2,
      "quantity": 1,
      "price": 35000,
      "total": 35000
    }
  ],
  "createdAt": "2026-04-20T12:00:00Z",
  "updatedAt": "2026-04-20T12:00:00Z"
}
```

#### 4.2 Get All Orders (Admin Only)
- **Endpoint:** `GET /orders`
- **Method:** GET
- **Auth Required:** Yes (Admin role)
- **Description:** Retrieve all orders with items

**Success Response (200):**
```json
[
  {
    "id": 1,
    "total": 125000,
    "status": "completed",
    "items": [
      {
        "id": 1,
        "orderId": 1,
        "productId": 1,
        "quantity": 2,
        "price": 45000
      }
    ],
    "createdAt": "2026-04-19T10:00:00Z",
    "updatedAt": "2026-04-19T10:00:00Z"
  }
]
```

#### 4.3 Update Order (Admin Only)
- **Endpoint:** `PUT /orders/:id`
- **Method:** PUT
- **Auth Required:** Yes (Admin role)
- **Description:** Update order status

**URL Parameter:** `id` (Order ID)

**Request Body:**
```json
{
  "status": "completed"
}
```

**Success Response (200):**
```json
{
  "msg": "Order updated successfully"
}
```

---

## Authentication & Middleware

### 1. JWT Authentication
- **Implementation:** `middleware/auth.ts`
- **Secret Key:** "SECRET" (should be environment variable in production)
- **Token Format:** Bearer token in Authorization header

**Usage:**
```
Authorization: Bearer <token>
```

**Token Payload:**
```json
{
  "id": 1,
  "role": "admin",
  "iat": 1234567890
}
```

### 2. Role-Based Access Control (RBAC)
- **Implementation:** `middleware/role.ts`
- **Supported Roles:** 
  - `admin`: Full access to CRUD operations
  - `customer`: Limited to product viewing and order creation

**Protected Routes:**
```
PUT    /products/:id      → Admin only
DELETE /products/:id      → Admin only
POST   /categories        → Admin only
GET    /orders           → Admin only
PUT    /orders/:id       → Admin only
```

### 3. CORS Configuration
- **Implementation:** `app.ts` - `cors()` middleware
- **Allowed Origin:** `http://localhost:5173` (Frontend)
- **Methods:** GET, POST, PUT, DELETE, OPTIONS
- **Headers:** Content-Type, Authorization

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful GET/PUT request |
| 201 | Created | Successful POST request |
| 400 | Bad Request | Invalid password |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | User lacks required role |
| 404 | Not Found | Product/Order not found |
| 500 | Server Error | Database connection error |

### Error Response Format
```json
{
  "msg": "Error message describing what went wrong"
}
```

### Common Error Scenarios

#### 1. Missing Token
**Response (401):**
```json
{
  "msg": "Unauthorized - Token missing or invalid"
}
```

#### 2. Invalid Role
**Response (403):**
```json
{
  "msg": "Forbidden - Admin access required"
}
```

#### 3. Resource Not Found
**Response (404):**
```json
{
  "msg": "Product not found"
}
```

#### 4. Validation Error
**Response (400):**
```json
{
  "msg": "Invalid input data"
}
```

---

## Request/Response Examples

### Example 1: Customer Login & Create Order Flow

1. **Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@mail.com",
    "password": "admin123"
  }'
```

2. **Get Products**
```bash
curl http://localhost:3000/api/products
```

3. **Create Order**
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": 1,
        "quantity": 2,
        "price": 45000
      }
    ]
  }'
```

### Example 2: Admin Operations

1. **Authenticate as Admin**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@mail.com",
    "password": "admin123"
  }'
```

2. **Create Product (with token)**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "name": "New Product",
    "price": 25000,
    "categoryId": 1
  }'
```

3. **Update Order Status**
```bash
curl -X PUT http://localhost:3000/api/orders/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "status": "completed"
  }'
```

---

## Frontend Integration

### API Client Setup
**File:** `frontend/src/api/axios.ts`
```typescript
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

// Add token to requests if stored
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Usage in Components
```typescript
// Get products
api.get('/products').then(res => setProducts(res.data));

// Create order
api.post('/orders', { items: [...] }).then(res => setOrder(res.data));

// Login
api.post('/auth/login', { email, password }).then(res => {
  localStorage.setItem('authToken', res.data.token);
});
```

---

## Testing with Postman

Import the included Postman collection (`MCDAPP.postman_collection.json`) to test all endpoints with pre-configured requests.

### Pre-configured Collections:
- **Authentication** - Login endpoint
- **Products** - CRUD operations
- **Categories** - Get and create
- **Orders** - Create and manage
- **Admin Operations** - Protected endpoints with authentication

---

## Database Seeding

Initial data seeded into the database:

**Admin User:**
- Email: `admin@mail.com`
- Password: `admin123`
- Role: `admin`

**Categories:**
- Burger
- Drink
- Dessert

**Sample Products:**
- Big Mac (45000)
- McChicken (35000)
- French Fries (15000)
- Coca Cola (12000)
- Sprite (12000)
- McFlurry (18000)
- Apple Pie (10000)

---

## Architecture Overview

### Backend Structure
```
backend/
├── src/
│   ├── app.ts                 # Express application setup
│   ├── config/
│   │   └── database.ts        # Sequelize configuration
│   ├── controllers/           # Business logic
│   │   ├── authController.ts
│   │   ├── productController.ts
│   │   ├── categoryController.ts
│   │   └── orderController.ts
│   ├── models/                # Sequelize models
│   │   ├── user.ts
│   │   ├── product.ts
│   │   ├── category.ts
│   │   ├── order.ts
│   │   └── OrderItem.ts
│   ├── routes/                # API routes
│   │   ├── index.ts
│   │   ├── authRoutes.ts
│   │   ├── productRoutes.ts
│   │   ├── categoryRoutes.ts
│   │   └── orderRoutes.ts
│   ├── middleware/            # Express middleware
│   │   ├── auth.ts            # JWT verification
│   │   └── role.ts            # Role-based access control
│   └── services/              # Data access layer
│       └── productService.ts
```

### Frontend Structure
```
frontend/
├── src/
│   ├── api/
│   │   └── axios.ts           # API client configuration
│   ├── components/            # React components
│   │   ├── ProductCard.tsx
│   │   └── CartSidebar.tsx
│   ├── context/
│   │   └── CartContext.tsx    # Cart state management
│   ├── pages/
│   │   └── Menu.tsx           # Main menu page
│   ├── App.tsx                # Root component
│   ├── main.tsx               # React entry point
│   └── index.css              # Global styles
```

---

## Technologies Used

- **Backend:** Express.js, TypeScript, Sequelize ORM
- **Database:** MySQL
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Frontend:** React, TypeScript, Vite
- **HTTP Client:** Axios
- **State Management:** React Context API

---

## Deployment Notes

### Environment Variables (.env)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=MCDAPP
DB_DIALECT=mysql
JWT_SECRET=your-secret-key
PORT=3000
```

### Run Commands
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
pnpm install
pnpm dev
```

---

## Notes for Tugas Besar

✅ **Customer Features:**
- ✅ View product categories
- ✅ View menu items
- ✅ Add items to cart (local state)
- ✅ Create orders with items
- ✅ Reset cart

✅ **Admin Features:**
- ✅ Login with JWT authentication
- ✅ CRUD Product operations
- ✅ CRUD Category operations
- ✅ View, Get, Update Orders
- ✅ Manage admin users (via login system)

✅ **Technical Requirements:**
- ✅ Express TypeScript backend
- ✅ React TypeScript frontend
- ✅ Async API calls with Axios
- ✅ Database structure with Sequelize
- ✅ JWT authentication middleware
- ✅ Role-based access control (admin/customer)
- ✅ Clean code structure
- ✅ Proper error handling

**Bonus:** Role separation (admin/customer) with 10 points

---

**Last Updated:** April 20, 2026
**API Version:** 1.0
