# Supa Menu - High Performance MVC Backend API

Welcome to the backend server codebase for **Supa Menu**, a premium QR-based restaurant ordering and SaaS orchestration platform.

This production-ready system is designed around the **Model-View-Controller (MVC) architecture**, implementing robust RESTful endpoints paired with a real-time **Socket.io** server engine for instant kitchen notifications and customer transactional workflows.

---

## 🛠️ Technology Stack

* **Runtime & Framework:** Node.js, Express.js
* **Persistence Layer:** MySQL 8.0+ via `mysql2` (Promise Pooled client client)
* **Real-time Engine:** Socket.io
* **Authentication & Cryptography:** JSON Web Tokens (JWT), `bcrypt`
* **Communications:** Nodemailer SMTP (HTML email triggers)
* **File Operations:** Multer Disc storage
* **Input Validation:** Express Validator
* **Security Filters:** Helmet, CORS, Express Rate Limits

---

## 📂 Project Architecture Explanation

Every file in the codebase is modular, cleanly decoupled, and has a dedicated role to play:

| Path / Directory | Purpose & Why It Exists | Concrete Behavior & Connective Layout |
| :--- | :--- | :--- |
| **`app.js`** | Core application setup | Bootstraps security middlewares (Helmet & Cors), JSON body decoders, serves public uploads dynamically, prefixes operational sub-routers, and binds the global HTTP error handler hooks. |
| **`server.js`** | Server main entrypoint | Loads `.env` configurations on boot, instantiates standard node HTTP handlers wrapping `app.js`, and establishes the master Socket.io binds. |
| **`config/db.js`** | Database pool client helper | Spawns reuseable promise pools with auto-reconnection and keeps queries execution trace handles centralized. Connected to all services/controllers. |
| **`config/socket.js`** | Websocket gateway context | Initializes the Socket.io module, specifies origin controls, and registers order socket event room channels. |
| **`config/mail.js`** | SMTP mailing transport | Provisions SMTP transport parameters or spins up mock logging mail carriers to ensure non-blocking email delivery when credentials are omitted. |
| **`controllers/`** | Data-payload controller endpoints | Intercepts HTTP request maps, performs authorizations, delegates business routines to services, and feeds structural success responses via responseHandler. |
| **`middleware/`** | Request intercept checks | Regulates rate-limiting bounds, Decodes JWT headers, locks actions by staff role privileges, validates object schemas, and handles global uncaught exceptions cleanly. |
| **`routes/`** | Endpoint address mappings | Binds strict URI paths, maps express-validator rules, and hooks corresponding controller callback channels. |
| **`services/`** | Complex business operation modules | Houses complex transactional routines (e.g. `orderService` decrementing stock transactionally, checking low limits, pushing websocket alerts, and sending owner emails simultaneously). |
| **`sockets/orderSocket.js`** | Real-time kitchen events | Intercepts waiter-calls and order updates. Coordinates fast messaging rooms for tables and merchant terminal boards. |
| **`templates/`** | Outbound notification mail cards | Holds stylized and eye-safe corporate HTML templates for transaction invoice receipts, daily sales records, and low stock alert warnings. |
| **`utils/`** | Utility helper components | Holds consistent loggers with timestamps, standard API structural response generators (`success`, `error`, `validationError`), and JWT certificate signers. |

---

## 🗄️ MySQL Database Entities Schema

The optimized database model consists of indexed entities ensuring referential integrity and support for cascading updates:

```sql
users (id, name, email, password, role, phone, is_active, created_at, updated_at)
  INDEXES: role, email

restaurants (id, name, description, logo, address, phone, owner_id, status, created_at, updated_at)
  FOREIGN KEYS: owner_id REFERENCES users(id) ON DELETE CASCADE

staff (id, user_id, restaurant_id, role, salary, hire_date, status, created_at, updated_at)
  FOREIGN KEYS: user_id REFERENCES users(id) ON DELETE CASCADE, restaurant_id REFERENCES restaurants(id) ON DELETE CASCADE

categories (id, name, description, restaurant_id, created_at, updated_at)
  FOREIGN KEYS: restaurant_id REFERENCES restaurants(id) ON DELETE CASCADE

menu_items (id, name, description, price, image, stock_quantity, is_available, category_id, restaurant_id, created_at, updated_at)
  FOREIGN KEYS: category_id REFERENCES categories(id) ON DELETE CASCADE, restaurant_id REFERENCES restaurants(id) ON DELETE CASCADE
  INDEXES: (is_available, restaurant_id)

restaurant_tables (id, table_number, restaurant_id, qr_code_url, status, created_at, updated_at)
  FOREIGN KEYS: restaurant_id REFERENCES restaurants(id) ON DELETE CASCADE
  UNIQUE KEY: (table_number, restaurant_id)

orders (id, order_number, customer_id, restaurant_id, table_id, total, status, payment_status, payment_method, notes, created_at, updated_at)
  FOREIGN KEYS: customer_id REFERENCES users(id) ON DELETE SET NULL, restaurant_id REFERENCES restaurants(id) ON DELETE CASCADE
  INDEXES: (restaurant_id, status)

order_items (id, order_id, menu_item_id, quantity, unit_price, notes, created_at)
  FOREIGN KEYS: order_id REFERENCES orders(id) ON DELETE CASCADE, menu_item_id REFERENCES menu_items(id) ON DELETE CASCADE

notifications (id, user_id, restaurant_id, title, message, type, is_read, sent_at)
  FOREIGN KEYS: user_id REFERENCES users(id) ON DELETE CASCADE

audit_logs (id, user_id, action, entity_type, entity_id, prev_val, new_val, timestamp)
```

---

## 🛰️ API Endpoint Interface Protocols

### 1. User Authentication Workflow

#### Register Account
* **URI Route:** `POST /api/auth/register`
* **Access:** Public
* **Payload Request Example:**
  ```json
  {
    "name": "Jean Bosco",
    "email": "bosco@supamenu.com",
    "password": "securepassword123",
    "role": "owner",
    "phone": "+250788123456"
  }
  ```
* **Success Output Example (Status `201`):**
  ```json
  {
    "success": true,
    "message": "Account created successfully",
    "data": {
      "user": {
        "id": 1,
        "name": "Jean Bosco",
        "email": "bosco@supamenu.com",
        "role": "owner"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey..."
    }
  }
  ```
* **Validation / Error Output Example (Status `400`):**
  ```json
  {
    "success": false,
    "message": "Validation failed",
    "errors": [
      {
        "field": "password",
        "message": "Password must be at least 6 characters long."
      }
    ]
  }
  ```

#### Log In Account
* **URI Route:** `POST /api/auth/login`
* **Access:** Public
* **Payload Request:**
  ```json
  {
    "email": "bosco@supamenu.com",
    "password": "securepassword123"
  }
  ```
* **Success Response (Status `200`):**
  ```json
  {
    "success": true,
    "message": "Session started successfully",
    "data": {
      "user": {
        "id": 1,
        "name": "Jean Bosco",
        "email": "bosco@supamenu.com",
        "role": "owner"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

---

### 2. Restaurant Profile Management

#### Create Restaurant Branch
* **URI Route:** `POST /api/restaurants`
* **Access (Required Headers):** Private (`Authorization: Bearer <JWT_TOKEN>`) (Owner only)
* **Payload Request Example:**
  ```json
  {
    "name": "L'Epicurien Kigali",
    "address": "KG 9 Ave, Kigali",
    "phone": "+250788998877",
    "logoUrl": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    "tablesCount": 10
  }
  ```
* **Success Response (Status `201`):**
  ```json
  {
    "success": true,
    "message": "Restaurant established successfully with tables.",
    "data": {
      "restaurantId": 1,
      "name": "L'Epicurien Kigali",
      "tablesSeeded": 10
    }
  }
  ```

#### Get Public Profile (Menu & Tables)
* **URI Route:** `GET /api/restaurants/:id`
* **Access:** Public (Used when customers scan QR tags)
* **Success Response (Status `200`):**
  ```json
  {
    "success": true,
    "message": "Restaurant profile details loaded.",
    "data": {
      "restaurant": {
        "id": 1,
        "name": "L'Epicurien Kigali",
        "description": "",
        "logo": "https://...",
        "address": "KG 9 Ave, Kigali",
        "phone": "+250788998877",
        "status": "active"
      },
      "tables": [
        { "id": 1, "table_number": "1", "qr_code_url": "https://api.qrserver.com/..." }
      ],
      "categories": [
        { "id": 1, "name": "Main Dishes" }
      ]
    }
  }
  ```

---

### 3. Crew Staff Recruitment

#### recruiter Staff Manager / Waiter
* **URI Route:** `POST /api/staff`
* **Access (Headers):** Private (`Authorization: Bearer <owner_JWT>`)
* **Payload Request Example:**
  ```json
  {
    "name": "Kezia Muhire",
    "email": "kezia@supamenu.com",
    "phone": "+250782111222",
    "role": "waiter",
    "salary": 180000.00,
    "restaurantId": 1
  }
  ```
* **Success Response (Status `201`):**
  ```json
  {
    "success": true,
    "message": "Staff workspace account spawned successfully.",
    "data": {
      "staffId": 4,
      "email": "kezia@supamenu.com",
      "temporaryPassword": "SupaStaff-9452"
    }
  }
  ```
* **Access Violation Error Example (Status `403`):**
  ```json
  {
    "success": false,
    "message": "Access Forbidden: This operational loop is restricted to [owner] roles - your role is [waiter]"
  }
  ```

---

### 4. Menu Item CRUD & Inventory Toggling

#### Add Menu Dish (Supports Multer upload of field `image`)
* **URI Route:** `POST /api/menu`
* **Access (Headers):** Private (`Authorization: Bearer <owner_or_manager_JWT>`)
* **Multi-part Form fields:**
  * `name`: Beef Brochette
  * `price`: 3500
  * `categoryId`: 1
  * `restaurantId`: 1
  * `stockQuantity`: 50
  * `image`: [File upload attachment]
* **Success Response (Status `201`):**
  ```json
  {
    "success": true,
    "message": "New menu item cataloged successfully.",
    "data": {
      "menuItemId": 12,
      "name": "Beef Brochette",
      "price": "3500",
      "stockQuantity": 50
    }
  }
  ```

#### Fetch / Browse Menus
* **URI Route:** `GET /api/menu?restaurantId=1&categoryId=1&search=beef`
* **Access:** Public
* **Success Response:**
  ```json
  {
    "success": true,
    "message": "Menu catalogs parsed successfully.",
    "data": [
      {
        "id": 12,
        "name": "Beef Brochette",
        "description": "",
        "price": "3500.00",
        "image": "/uploads/image-17181283.png",
        "stock_quantity": 50,
        "is_available": 1,
        "category_id": 1
      }
    ]
  }
  ```

---

### 5. Placed Orders Checkout (Real-time Flow)

#### Place Guest / Customer Order
* **URI Route:** `POST /api/orders`
* **Access:** Public (Gues scanned of table QR)
* **Payload Request Example:**
  ```json
  {
    "restaurantId": 1,
    "tableId": 1,
    "paymentMethod": "MoMo",
    "notes": "Extra pili-pili please!",
    "items": [
      {
        "menuItemId": 12,
        "quantity": 2
      }
    ]
  }
  ```
* **Success Response (Status `201`):**
  ```json
  {
    "success": true,
    "message": "Order transmitted successfully! Kitchen has been notified.",
    "data": {
      "orderId": 45,
      "orderNumber": "SM-171819280-5935",
      "total": 7000,
      "itemsCount": 1
    }
  }
  ```
* **Low Stock / Sold Out Error Example (Status `500`):**
  ```json
  {
    "success": false,
    "message": "Insufficient stock for \"Beef Brochette\". Only 1 servings remaining."
  }
  ```

#### Change Order Working State (Triggered on Waiter terminal)
* **URI Route:** `PUT /api/orders/:id/status`
* **Access (Headers):** Private (`Authorization: Bearer <waiter_manager_owner_JWT>`)
* **Payload Request:**
  ```json
  { "status": "preparing" }
  ```
* **Success Response (Status `200`):**
  ```json
  {
    "success": true,
    "message": "Order has migrated to status state: \"preparing\".",
    "data": {
      "orderId": "45",
      "status": "preparing"
    }
  }
  ```

---

### 6. Operational Financial Analytics

#### Load KPI Metrics Report
* **URI Route:** `GET /api/analytics/dashboard?restaurantId=1`
* **Access (Headers):** Private (`Authorization: Bearer <owner_JWT_only>`)
* **Success Response (Status `200`):**
  ```json
  {
    "success": true,
    "message": "KPI analytics calculated for L'Epicurien Kigali.",
    "data": {
      "revenueToday": 145000,
      "revenueThisWeek": 2840000,
      "revenueThisMonth": 12400000,
      "ordersToday": 18,
      "ordersPending": 2,
      "averageOrderValue": "15750.50",
      "topItems": [
        { "id": 12, "name": "Beef Brochette", "price": "3500.00", "units_sold": "240", "generated_revenue": "840000" }
      ],
      "statusCounts": [
        { "status": "completed", "ord_count": 890 }
      ]
    }
  }
  ```

---

## ⚡ Real-Time Socket.io Protocols and Event Logs

We expose a high-performance Socket.io architecture. Connect your frontend client via:

```javascript
import { io } from 'socket.io-client';
const socket = io('http://localhost:5000');
```

### Event Names checklist:

| Event Client Emit | Parameters Expected | Action / Description |
| :--- | :--- | :--- |
| `join-restaurant` | `restaurantId` (integer) | Subscribes staff dashboard stream to dynamic restaurant alerts room (`restaurant_<restaurantId>`). |
| `join-table` | `{ restaurantId, tableNumber }` | Subscribes dinner guest display viewport to room updates (`table_<restaurantId>_<tableNumber>`). |
| `call-waiter` | `{ restaurantId, tableNumber, reason }` | Broadcasts alerts to all restaurant waiters of an active call. |
| `clear-table` | `{ restaurantId, tableNumber }` | Alerts staff terminal to release occupied status card dynamically of a table. |

### Event Server Emits:
* `new-order` (Emitted to room restaurant staff): Informs kitchen layout of a fresh basket checkout.
* `order-updated` (Emitted to restaurant staff): Prompts layout cards of updates.
* `order-status` (Emitted to specific guest table room): Alerts dinner guest view of accepted/preparing/ready food status updates.
* `waiter-requested` (Emitted to restaurant room): Sounds server chimes on waiter dashboards immediately.

---

## 🚀 Step-by-Step Setup and Launch Guide

### 1. Installation Requirements
Clone this workspace content and install Node vendor packages:
```bash
cd backend
npm install
```

### 2. Configure Database (MySQL Setup)
1. Launch your MySQL client panel (Local instance, Docker, or Cloud RDS).
2. Create the target schema database:
   ```sql
   CREATE DATABASE supa_menu_db;
   ```
3. Open your terminal window and load the complete tables structure by running:
   ```bash
   mysql -u root -p supa_menu_db < schema.sql
   ```

### 3. Set Up Environment Settings
Copy the `.env.example` configurations to an active `.env` file:
```bash
cp .env.example .env
```
Open `.env` and fill out your local credentials (DB_USER, DB_PASSWORD, SMTP_USER, etc.).

### 4. Running the Application

#### Active Development Mode (With Nodemon hot-reload support)
```bash
npm run dev
```

#### Production Server Spawn Mode
```bash
npm start
```
The server will boot and open ports on host `http://localhost:5000` securely!

---

*Handcrafted with absolute performance precision by Senior Backend Developers and Architects. Licensed under ISC.*
