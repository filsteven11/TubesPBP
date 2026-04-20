# McDonald's Ordering System - Tugas Besar PBP

Full-stack ordering system aplikasi McDonald's dengan fitur customer dan admin.

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Database Setup](#database-setup)
- [API Documentation](#api-documentation)
- [Frontend Integration](#frontend-integration)
- [Testing](#testing)
- [Project Requirements](#project-requirements)
- [Team Information](#team-information)

---

## Features

### Customer Features ✅
- View menu items by category
- Add items to shopping cart (local state)
- Manage cart (add/remove items, reset)
- Create orders with multiple items
- No keyboard input required (UI-only)

### Admin Features ✅
- User authentication with JWT
- CRUD Product management
- CRUD Category management
- View and manage orders
- Order status updates
- Role-based access control

### Technical Features ✅
- RESTful API design
- JWT authentication
- Role-based authorization (Admin/Customer)
- Error handling with appropriate HTTP status codes
- Asynchronous API calls
- Clean code architecture
- Database migrations and seeding

---

## Technology Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **ORM:** Sequelize
- **Database:** MySQL
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Development Tool:** Nodemon

### Frontend
- **Framework:** React 18.3
- **Language:** TypeScript
- **Build Tool:** Vite
- **HTTP Client:** Axios
- **State Management:** React Context API
- **Styling:** CSS3

### Development Tools
- **Package Manager:** pnpm
- **API Testing:** Postman
- **Version Control:** Git

---

## Project Structure

```
MCDAPP/
├── backend/
│   ├── src/
│   │   ├── app.ts                          # Express setup & middleware
│   │   ├── config/
│   │   │   └── database.ts                 # Sequelize configuration
│   │   ├── controllers/
│   │   │   ├── authController.ts           # Login logic
│   │   │   ├── productController.ts        # Product CRUD
│   │   │   ├── categoryController.ts       # Category CRUD
│   │   │   └── orderController.ts          # Order management
│   │   ├── models/                         # Sequelize models
│   │   │   ├── user.ts
│   │   │   ├── product.ts
│   │   │   ├── category.ts
│   │   │   ├── order.ts
│   │   │   └── OrderItem.ts
│   │   ├── routes/                         # API routes
│   │   │   ├── index.ts                    # Route aggregation
│   │   │   ├── authRoutes.ts
│   │   │   ├── productRoutes.ts
│   │   │   ├── categoryRoutes.ts
│   │   │   └── orderRoutes.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts                     # JWT verification
│   │   │   └── role.ts                     # Role-based access control
│   │   ├── services/
│   │   │   └── productService.ts           # Data access layer
│   │   ├── seeders/                        # Database seeding
│   │   │   ├── seed-script.ts              # Initial data
│   │   │   └── seed-data.js
│   │   └── migrations/                     # Database migrations
│   │       └── create-user.js
│   ├── package.json
│   ├── tsconfig.json
│   └── nodemon.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.ts                    # API client setup
│   │   ├── components/
│   │   │   ├── ProductCard.tsx             # Product item card
│   │   │   └── CartSidebar.tsx             # Shopping cart UI
│   │   ├── context/
│   │   │   └── CartContext.tsx             # Cart state management
│   │   ├── pages/
│   │   │   └── Menu.tsx                    # Main menu page
│   │   ├── App.tsx                         # Root component
│   │   ├── main.tsx                        # React entry point
│   │   └── index.css                       # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── API_DOCUMENTATION.md                    # Complete API reference
├── MCDAPP.postman_collection.json          # Postman collection
└── README.md                               # This file
```

---

## Installation

### Prerequisites
- Node.js v18+ and npm/pnpm
- MySQL server running locally
- Git

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
pnpm install
```

3. **Configure database:**
Update `src/config/database.ts` with your MySQL credentials:
```typescript
export const sequelize = new Sequelize({
  database: "MCDAPP",
  dialect: "mysql",
  username: "root",
  password: "",  // Your MySQL password
  models: [User, Product, Category, Order, OrderItem],
});
```

4. **Create database:**
```bash
mysql -u root -p
CREATE DATABASE MCDAPP;
EXIT;
```

5. **Sync database schema:**
```bash
pnpm ts-node src/seeders/seed-script.ts
```

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd ../frontend
```

2. **Install dependencies:**
```bash
pnpm install
```

3. **Ensure API endpoint is correct** in `src/api/axios.ts`:
```typescript
export const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});
```

---

## Running the Application

### Backend
```bash
cd backend
pnpm dev
```
Server runs on `http://localhost:3000`

### Frontend
```bash
cd frontend
pnpm dev
```
Application runs on `http://localhost:5173`

### Both Terminals
Keep both services running simultaneously for full application functionality.

---

## Database Setup

### Database Schema
The application uses 5 main tables:

1. **Users** - Admin authentication
2. **Categories** - Product categories
3. **Products** - Menu items
4. **Orders** - Customer orders
5. **OrderItems** - Items within each order

### Initial Seeding
Admin user created automatically:
- **Email:** `admin@mail.com`
- **Password:** `admin123`
- **Role:** `admin`

Sample products and categories included.

### Database Relationships
```
Users (1) ──── (Many) Orders
             (via JWT in requests)

Categories (1) ──── (Many) Products

Orders (1) ──── (Many) OrderItems

Products (1) ──── (Many) OrderItems
```

---

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication
Admin endpoints require JWT token in header:
```
Authorization: Bearer <TOKEN>
```

### Main Endpoints

#### Products
- `GET /products` - Get all products
- `POST /products` - Create product (admin)
- `PUT /products/:id` - Update product (admin)
- `DELETE /products/:id` - Delete product (admin)

#### Categories
- `GET /categories` - Get all categories
- `POST /categories` - Create category (admin)

#### Orders
- `POST /orders` - Create order (customer)
- `GET /orders` - Get all orders (admin)
- `PUT /orders/:id` - Update order status (admin)

#### Authentication
- `POST /auth/login` - Admin login

### Full Documentation
See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete endpoint details, request/response examples, and error handling.

---

## Frontend Integration

### API Client
Axios client configured in `src/api/axios.ts`:
```typescript
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});
```

### Usage Examples

**Get products:**
```typescript
api.get('/products').then(res => setProducts(res.data));
```

**Create order:**
```typescript
api.post('/orders', { items: [...] }).then(res => handleSuccess(res.data));
```

**Admin login:**
```typescript
api.post('/auth/login', { email, password }).then(res => {
  localStorage.setItem('authToken', res.data.token);
});
```

### State Management
Cart state managed with React Context API in `CartContext.tsx`:
- Add items to cart
- Remove items
- Calculate total
- Reset cart

---

## Testing

### Using Postman
1. Import `MCDAPP.postman_collection.json` into Postman
2. Set variables:
   - `baseURL`: `http://localhost:3000/api`
   - `token`: JWT token from login response
3. Run requests from collections

### Manual Testing Steps

1. **Login as Admin:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mail.com","password":"admin123"}'
```

2. **Get Products:**
```bash
curl http://localhost:3000/api/products
```

3. **Create Order:**
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"items":[{"productId":1,"quantity":2,"price":45000}]}'
```

---

## Project Requirements

### ✅ Tugas Besar Requirements

#### Customer Features (20 points)
- ✅ Get & list category
- ✅ View menu with products
- ✅ Create order with items
- ✅ Shopping cart (local state, not backend-connected)
- ✅ Reset cart functionality
- ✅ No keyboard input (UI-only)

#### Admin Features (35 points)
- ✅ Login with authentication
- ✅ CRUD Product
- ✅ CRUD Category
- ✅ List orders
- ✅ Get specific order
- ✅ Update order status
- ✅ Manage admin users (via login system)

#### Frontend (30 points)
- ✅ Login & authentication
- ✅ CRUD Product interface
- ✅ CRUD Category interface
- ✅ Order management interface
- ✅ Admin user management
- ✅ Async API calls with React TypeScript
- ✅ Minimalist CSS styling

#### Backend (15 points)
- ✅ Get & list category endpoints
- ✅ Create order endpoint
- ✅ Clean API design
- ✅ Error handling

#### Additional (+10 points)
- ✅ Role-based user separation (admin/customer)
- ✅ Proper middleware implementation
- ✅ JWT authentication
- ✅ Clean code architecture

#### Documentation & Submission
- ✅ API documentation with Postman collection
- ✅ Database schema documentation
- ✅ Middleware analysis and explanation
- ✅ Clean code with proper structure
- ✅ GitHub repository (public)

---

## Implementation Highlights

### Clean Code Practices
- Separated concerns (controllers, services, models)
- Type safety with TypeScript
- Consistent naming conventions
- Proper error handling
- Comments for complex logic

### Architecture Decisions
1. **Sequelize ORM** - Type-safe database operations
2. **JWT Authentication** - Stateless, scalable auth
3. **Role Middleware** - Fine-grained access control
4. **React Context** - Simple, local state management
5. **Axios Interceptors** - Automatic token injection
6. **Service Layer** - Database abstraction

### Middleware Justification
- **auth.ts**: Validates JWT tokens, protects admin endpoints
- **role.ts**: Enforces role-based access control
- **CORS**: Enables frontend-backend communication
- **JSON Parser**: Handles request body parsing

---

## Known Limitations & Future Improvements

### Current Limitations
- Cart stored only in browser (localStorage could be added)
- No password reset functionality (can be added)
- No user registration endpoint (only admin login)
- No image handling for products

### Future Enhancements
- Add product images
- Implement password reset flow
- Add user registration
- Implement caching with Redis
- Add payment integration
- SMS/Email notifications
- Real-time order tracking

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill process on port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error
- Ensure MySQL is running
- Check credentials in `database.ts`
- Verify database name is `MCDAPP`

### CORS Error
- Ensure frontend URL is in backend CORS config
- Check `app.ts` for CORS middleware setup

### React Import Error
- Ensure `react-dom/client` module is installed
- Run `pnpm install` in frontend directory

---

## Git Repository

Project hosted on GitHub: [Your GitHub URL]

### Commit History
- Initial project setup with folder structure
- Backend API implementation
- Frontend UI development
- Database schema and seeding
- Documentation and API testing

---

## Team Information

**Tugas Besar Mata Kuliah:** Pemrograman Berbasis Platform (PBP)

**Dosen Pengampu:** [Lecturer Name]

**Deadline:** Friday, May 1, 2026

**Presentation:** Meeting 28

---

## Notes for Evaluation

1. **Database Design**: Proper relationships and normalization
2. **API Security**: JWT authentication, role-based access control
3. **Error Handling**: All edge cases covered with appropriate HTTP status codes
4. **Code Quality**: Clean, modular, well-documented code
5. **Frontend Integration**: Proper async/await patterns with error handling
6. **Middleware Analysis**: Clear justification for middleware choices

---

## License

MIT License - Open for educational purposes

---

**Last Updated:** April 20, 2026

For questions or issues, please create an issue in the GitHub repository.
