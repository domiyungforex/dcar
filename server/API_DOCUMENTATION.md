# DCAR API Documentation

## Base URL
\`\`\`
http://localhost:5000/api
\`\`\`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
\`\`\`
Authorization: Bearer <your_jwt_token>
\`\`\`

## Response Format

All endpoints return JSON responses:
\`\`\`json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
\`\`\`

## Authentication Endpoints

### Register
\`\`\`
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}

Response (201):
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
\`\`\`

### Login
\`\`\`
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}

Response (200):
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
\`\`\`

### Get Current User
\`\`\`
GET /auth/me
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
\`\`\`

## Cars Endpoints

### Get All Cars
\`\`\`
GET /cars?brand=Toyota&minPrice=20000&maxPrice=50000&year=2023&condition=New

Response (200):
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "title": "2023 Toyota Camry",
      "price": 35000,
      "brand": "Toyota",
      "year": 2023,
      "mileage": 5000,
      "fuelType": "Petrol",
      "transmission": "Automatic",
      "condition": "New",
      "description": "...",
      "images": [
        {
          "url": "https://...",
          "publicId": "..."
        }
      ],
      "status": "Available",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
\`\`\`

### Get Featured Cars
\`\`\`
GET /cars/featured

Response (200):
{
  "success": true,
  "data": [...]
}
\`\`\`

### Get Single Car
\`\`\`
GET /cars/:id

Response (200):
{
  "success": true,
  "data": {...}
}
\`\`\`

### Create Car
\`\`\`
POST /cars
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "2023 BMW 3 Series",
  "price": 45000,
  "brand": "BMW",
  "year": 2023,
  "mileage": 10000,
  "fuelType": "Petrol",
  "transmission": "Automatic",
  "condition": "New",
  "description": "Premium luxury sedan"
}

Response (201):
{
  "success": true,
  "data": {...}
}
\`\`\`

### Update Car
\`\`\`
PUT /cars/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "price": 44000,
  "status": "Sold"
}

Response (200):
{
  "success": true,
  "data": {...}
}
\`\`\`

### Delete Car
\`\`\`
DELETE /cars/:id
Authorization: Bearer <admin_token>

Response (200):
{
  "success": true,
  "message": "Car deleted successfully"
}
\`\`\`

## Images Endpoints

### Upload Images
\`\`\`
POST /images/:carId
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

Form Data:
- images (file) - Multiple files supported (max 10)

Response (200):
{
  "success": true,
  "message": "Images uploaded successfully",
  "images": [
    {
      "url": "https://...",
      "publicId": "..."
    }
  ]
}
\`\`\`

### Delete Image
\`\`\`
DELETE /images/:carId
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "publicId": "dcar/car-123-timestamp"
}

Response (200):
{
  "success": true,
  "message": "Image deleted successfully",
  "data": {...}
}
\`\`\`

## Inquiries Endpoints

### Create Inquiry
\`\`\`
POST /inquiries
Content-Type: application/json

{
  "carId": "...",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "message": "I'm interested in this vehicle"
}

Response (201):
{
  "success": true,
  "data": {
    "_id": "...",
    "carId": "...",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1234567890",
    "message": "...",
    "status": "New",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
\`\`\`

### Get All Inquiries
\`\`\`
GET /inquiries
Authorization: Bearer <admin_token>

Response (200):
{
  "success": true,
  "count": 10,
  "data": [...]
}
\`\`\`

### Get Single Inquiry
\`\`\`
GET /inquiries/:id
Authorization: Bearer <admin_token>

Response (200):
{
  "success": true,
  "data": {...}
}
\`\`\`

### Update Inquiry Status
\`\`\`
PUT /inquiries/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "Contacted"
}

Response (200):
{
  "success": true,
  "data": {...}
}
\`\`\`

### Delete Inquiry
\`\`\`
DELETE /inquiries/:id
Authorization: Bearer <admin_token>

Response (200):
{
  "success": true,
  "message": "Inquiry deleted successfully"
}
\`\`\`

## Error Responses

### Invalid Request
\`\`\`
Response (400):
{
  "success": false,
  "message": "Please provide all required fields"
}
\`\`\`

### Unauthorized
\`\`\`
Response (401):
{
  "success": false,
  "message": "Not authorized to access this route"
}
\`\`\`

### Forbidden
\`\`\`
Response (403):
{
  "success": false,
  "message": "Not authorized to access this resource"
}
\`\`\`

### Not Found
\`\`\`
Response (404):
{
  "success": false,
  "message": "Car not found"
}
\`\`\`

### Server Error
\`\`\`
Response (500):
{
  "success": false,
  "message": "Internal Server Error"
}
