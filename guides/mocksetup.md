# 📋 Mock Server Setup Guide

## Step-by-Step: Create and Initialize JSON Files

Since the `data/` folder already exists, create the following files inside it with the exact content provided.

---

## 1. 📦 Products Resource

**File**: `data/products.json`

**Description**: Store product catalog data with pricing and inventory information.

```json
{
  "products": []
}
```

**Sample Entry**:
```json
{
  "id": "1",
  "name": "Laptop Pro",
  "price": 1299,
  "category": "Electronics",
  "inStock": true,
  "description": "High-performance laptop"
}
```

---

## 2. 👥 Users Resource (Required for Login)

**File**: `data/users.json`

**Description**: Store user credentials and profile information. Used for authentication via `/api/v1/auth/login`.

```json
{
  "users": [
    {
      "id": "1",
      "username": "admin",
      "password": "admin123",
      "email": "admin@example.com",
      "firstName": "quickbyte",
      "lastName": "genc",
      "role": "Admin",
      "phone": "7567171234"
    }
  ]
}
```

> 🔐 **Default Credentials**: 
> - **Username**: `admin`
> - **Password**: `admin123`
> - **Endpoint**: `POST /api/v1/auth/login`
> - **Returns**: JWT token for authenticated requests

---

## 3. 👤 User Profiles Resource (Enhanced with JWT)

**File**: `data/usersprofile.json`

**Description**: Extended user profile information with authentication tokens and profile images.

```json
{
  "usersprofile": []
}
```

### Creating a User Profile (with JWT Authentication)

**🌐 cURL Example**:

```bash
curl --location 'http://localhost:3000/api/v1/usersprofile' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer your-jwt-token-here' \
  --header 'X-Client-Version: 1.0.0' \
  --header 'Accept: application/json' \
  --data-raw '{
    "username": "Mayuresh Kiran",
    "password": "user123",
    "email": "mayureshkiran.naik@cognizant.com",
    "firstName": "Mayuresh Kiran",
    "lastName": "Naik",
    "role": "Customer",
    "phone": "9876543210",
    "profileImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAQUlEQVR4nO3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAAAAAAAAAAAAAAAAAPD/5+sAAAHVa4rXAAH1c0pWAAAAAElFTkSuQmCC"
  }'
```

### Sample User Profile Data:

```json
{
  "id": "1",
  "username": "Mayuresh Kiran",
  "email": "mayureshkiran.naik@cognizant.com",
  "firstName": "Mayuresh Kiran",
  "lastName": "Naik",
  "role": "Customer",
  "phone": "9876543210",
  "profileImage": "data:image/png;base64,iVBORw0KGgoAAAANS...",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "createdAt": "2025-12-24T10:30:00Z",
  "updatedAt": "2025-12-24T10:30:00Z"
}
```

### 🔑 Key Headers Explained:

| Header | Purpose | Example |
|--------|---------|---------|
| `Authorization` | Bearer token for JWT authentication | `Bearer eyJhbGciOiJIUzI1NiIs...` |
| `Content-Type` | Data format being sent | `application/json` |
| `X-Client-Version` | API client version | `1.0.0` |
| `Accept` | Expected response format | `application/json` |

### 📝 How to Extract JWT:

1. **Login First**: Call `POST /api/v1/auth/login`
2. **Extract Token**: Get the JWT from the login response
3. **Use in Requests**: Add to `Authorization: Bearer <token>` header
4. **Profile Creation**: Use the token to create user profiles

---

## 4. 🛍️ Additional Resources (Create as Needed)

### Customers

**File**: `data/customers.json`

**Description**: Store customer information and order history.

```json
{
  "customers": []
}
```

### Orders

**File**: `data/orders.json`

**Description**: Store order transaction data.

```json
{
  "orders": []
}
```

### Categories

**File**: `data/categories.json`

**Description**: Product categories for organization and filtering.

```json
{
  "categories": []
}
```

### Transactions

**File**: `data/transactions.json`

**Description**: Store payment and transaction records.

```json
{
  "transactions": []
}
```

---

## 5. 🎯 Adding Sample Data (Optional)

## 5. 🎯 Adding Sample Data (Optional)

You can populate arrays with sample objects for testing:

**Example: Updated `data/products.json` with sample data**

```json
{
  "products": [
    {
      "id": "1",
      "name": "Laptop Pro",
      "price": 1299,
      "category": "Electronics",
      "inStock": true,
      "description": "High-performance laptop"
    },
    {
      "id": "2",
      "name": "Wireless Mouse",
      "price": 49,
      "category": "Accessories",
      "inStock": true,
      "description": "Ergonomic wireless mouse with USB receiver"
    }
  ]
}
```

---

## 6. ✅ Key Rules to Remember

-   **Filename $\rightarrow$ Key name** must be identical:

    -   `products.json` $\rightarrow$ `"products"`
    -   `users.json` $\rightarrow$ `"users"`
    -   `usersprofile.json` $\rightarrow$ `"usersprofile"`
    -   `orders.json` $\rightarrow$ `"orders"`

-   **Always use an array** `[]` as the value (even if empty).

-   **Use valid JSON** (no trailing commas, use double quotes).

-   **IDs are auto-generated** as strings by the server on POST.

-   **JWT tokens** are required for protected endpoints (added to `usersprofile`).

---

## 7. 🚀 Start the Mock Server

## 7. 🚀 Start the Mock Server

```bash
npm start
```

The server will run on `http://localhost:3000`.

---

## 8. 🔌 Common Endpoints (After Setup)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/products` | GET/POST/PUT/DELETE | Manage products |
| `/api/v1/customers` | GET/POST/PUT/DELETE | Manage customers |
| `/api/v1/auth/login` | POST | User login (returns JWT) |
| `/api/v1/profile` | GET | Get user profile |
| `/api/v1/usersprofile` | POST | Create new user profile with JWT |
| `/api/v1/orders` | GET/POST/PUT/DELETE | Manage orders |

---

## 9. 🔐 Authentication Workflow

```
1. User Login
   POST /api/v1/auth/login
   ├── Username: admin
   └── Password: admin123
   
2. Receive JWT Token
   Response: { token: "eyJhbGciOiJIUzI1NiIs..." }
   
3. Use Token in Protected Requests
   Headers: Authorization: Bearer <token>
   
4. Create User Profile
   POST /api/v1/usersprofile
   ├── Headers: Authorization: Bearer <token>
   └── Body: { username, email, profileImage, ... }
```

---

## 10. ⚠️ Avoid These Mistakes

| **Incorrect Format** | **Why It Fails** | **Correct Format** |
| --- | --- | --- |
| `{}` | Missing key → undefined | `{ "products": [] }` |
| `[]` | Root is array, no named key | `{ "products": [] }` |
| `{ "items": [] }` | Key doesn't match filename | `{ "products": [] }` |
| Missing `Authorization` header | Request not authenticated | `Authorization: Bearer <jwt>` |
| `Bearer token123` without prefix | Invalid token format | `Authorization: Bearer eyJhbGc...` |

---

## 11. 💡 Pro Tips

✨ **Testing JWT Flow**:
1. Use **Postman** or **Insomnia** to test API calls
2. Save JWT token in environment variables for easy reuse
3. Set Authorization header to `Bearer {{jwt_token}}`

📸 **Profile Images**:
- Use base64 encoded images for `profileImage` field
- Keep image size reasonable (< 500KB encoded)

🔄 **Common Test Scenarios**:
- Create product → Get products → Update product → Delete product
- Login as admin → Create user profile → View profile

---

## 📚 File Structure Summary

```
mockserver/
├── data/
│   ├── common.json
│   ├── products.json
│   ├── users.json
│   ├── usersprofile.json
│   ├── transactions.json
│   ├── orders.json (optional)
│   ├── customers.json (optional)
│   └── categories.json (optional)
├── src/
│   ├── server.js
│   └── responses.js
├── guides/
│   └── mocksetup.md
├── package.json
└── README.md
```

---