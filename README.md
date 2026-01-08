### Step 1 : unzip  the  file
### Step 2 : Switch to the extract  path
```
cd mockserver
```
### Step 3 : Install Dependencies by running the  following  command 
```
npm install
```
### Step 4 : go the root  folder and Start the Server
```
npm start
```
### Step 5 : Test the Endpoints
- Test the POST /api/login endpoint (successful login):
```
curl --location 'http://localhost:3000/api/v1/auth/login' \
--header 'accept: */*' \
--header 'Content-Type: application/json' \
--data '{
  "username": "admin",
  "password": "admin123"
}'
```

- Test the POST /api/login endpoint (bad  request --400):
```
curl --location 'http://localhost:3000/api/v1/auth/login' \
--header 'accept: */*' \
--header 'Content-Type: application/json' \
--data '{
  "username": "admin",
  "password": "user"
}'
```

- Test the GET /products endpoint:
```
curl --location 'http://localhost:3000/api/v1/products'
```

- Test the GET /products endpoint with query params:
```
http://localhost:3000/api/v1/products?price=1010'
```

- Test the specific  id GET /products endpoint:
```
curl --location 'http://localhost:3000/api/v1/products/2'
```


- Test the POST /products endpoint:
```
curl --location 'http://localhost:3000/api/v1/products' \
--header 'accept: */*' \
--header 'Content-Type: application/json' \
--data '{
        "id": 101,
        "model": "UPC00001",
        "name": "Samsung Mobile S25",
        "imageUrl": "https://images.unsplash.com/photo-1738830234395-a351829a1c7b?w=150"
    }'
```

- Test the PUT /products endpoint:
```
curl --location --request PUT 'http://localhost:3000/api/v1/products/101' \
--header 'accept: */*' \
--header 'Content-Type: application/json' \
--data '{
        "id": 101,
        "model": "UPC00001",
        "name": "Samsung Mobile S25 new update",
        "imageUrl": "https://images.unsplash.com/photo-1738830234395-a351829a1c7b?w=150"
    }'
```
- Test the DELETE /products endpoint:
```
curl --location --request DELETE 'http://localhost:3000/api/v1/products/101' \
--header 'accept: */*' \
--header 'Content-Type: application/json'
```

- Test the GET /users endpoint:
```
curl --location 'http://localhost:3000/users'
```

## sampple curl  for nested REST resources /trails/9/phases/2

- Test Nested POST  

```bash
curl --location 'http://localhost:3000/api/v1/trials/1/phases' \
--header 'accept: */*' \
--header 'Content-Type: application/json' \
--data '{
    "totalParticpants": 25,
    "phasedescription": "BP device",
    "trialId":1
}'
```

- Test Nested PUT  

```bash
curl --location --request PUT 'http://localhost:3000/api/v1/trials/1/phases/1' \
--header 'accept: */*' \
--header 'Content-Type: application/json' \
--data '{
    "totalParticpants": 25,
    "phasedescription": "BP device nested phase 1",
    "trialId":1
}'
```

- Test Nested GET  

```bash
curl --location 'http://localhost:3000/api/v1/trials/1/phases/1'
```

- Test Nested DELETE  

```bash
curl --location --request DELETE 'http://localhost:3000/api/v1/trials/1/phases/3'
```

## To generate  zip file

```
git archive --format=zip --output=mockserver.zip master
```

This creates a temporary "commit" of your current working directory and archives it.

```
git archive --format=zip -o mockserver.zip $(git stash create)
```

## Route Registration & Request Handling Flow

### Server Startup - Route Registration

When the server starts, all custom routes are registered once:

```javascript
// Registered routes at startup:
// ✅ POST /api/v1/auth/login      → Custom auth handler
// ✅ GET  /api/v1/profiles         → Custom profiles handler
// ✅ GET  /api/v1/summary          → Custom summary handler
```

### Request Processing Order

When a request comes in, it follows this flow:

```
Incoming Request
    ↓
1️⃣ Check if matches registered routes?
    └─ YES → Execute specific handler (auth/login, profiles, summary)
    └─ NO  → Continue to next middleware
    ↓
2️⃣ CRUD Middleware (Nested Resource Handler)
    └─ Extracts path parameters (parentId, childId, etc)
    └─ Handles GET/POST/PUT/DELETE logic
    └─ Passes control if no match
    ↓
3️⃣ JSON-Server Router (Fallback)
    └─ Falls back to default CRUD routes
```

### Request Examples

| Request | Route Match? | Handler |
|---------|:----------:|---------|
| `POST /api/v1/auth/login` | ✅ YES | Custom auth handler |
| `GET /api/v1/profiles` | ✅ YES | Custom profiles handler |
| `GET /api/v1/summary` | ✅ YES | Custom summary handler |
| `GET /api/v1/users/5` | ❌ NO | CRUD middleware |
| `POST /api/v1/users` | ❌ NO | CRUD middleware |
| `GET /api/v1/trials/5/phases/10` | ❌ NO | CRUD middleware (nested) |

### Key Features

- **Registered Routes**: Specific endpoints handled with custom logic
- **CRUD Middleware**: Automatically handles nested resources and CRUD operations
- **Flexible Path Extraction**: Uses `extractPathParams()` function with optional chaining for safe access to parentId, childId, and other path parameters
- **Fallback Router**: JSON-Server handles any unmatched routes with default CRUD operations

### Understanding Fallback Router (JSON-Server)

The **Fallback Router** acts as a backup handler when no custom routes match your request. It automatically performs default CRUD operations on your JSON data files.

#### How It Works:

```
Request comes in
    ↓
1️⃣ Matches registered custom route? (auth/login, profiles, summary)
    └─ YES → Use custom handler, STOP
    └─ NO → Continue
    ↓
2️⃣ Matches CRUD middleware logic?
    └─ YES → Handle with middleware, STOP
    └─ NO → Continue
    ↓
3️⃣ FALLBACK → JSON-Server Router takes over
    └─ Performs default CRUD operations on your JSON files
```

#### Real-World Examples:

**Your `data/products.json`:**
```json
{
  "products": [
    { "id": 1, "name": "Samsung", "price": 1000 },
    { "id": 2, "name": "iPhone", "price": 1500 }
  ]
}
```

**Requests handled by Fallback Router:**

| Request | Method | What Happens | Example |
|---------|:------:|--------------|---------|
| `GET /api/v1/products` | GET | Returns all products from JSON file | `curl http://localhost:3000/api/v1/products` |
| `GET /api/v1/products/1` | GET | Returns specific product by ID | `curl http://localhost:3000/api/v1/products/1` |
| `POST /api/v1/products` | POST | Adds new product with auto-generated ID | `curl -X POST http://localhost:3000/api/v1/products -d '{payload}'` |
| `PUT /api/v1/products/1` | PUT | Updates product with id=1 | `curl -X PUT http://localhost:3000/api/v1/products/1 -d '{"price":900,payload}'` |
| `DELETE /api/v1/products/1` | DELETE | Deletes product with id=1 | `curl -X DELETE http://localhost:3000/api/v1/products/1` |

#### Why It's Useful:

✅ **No need to write custom handlers** for every endpoint  
✅ **Automatic CRUD operations** for all your data files  
✅ **Saves code** - JSON-Server handles the heavy lifting  
✅ **Works with all JSON files** in the `data/` directory  
✅ **Flexible** - Mix custom routes + auto CRUD routes seamlessly
