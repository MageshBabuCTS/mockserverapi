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
