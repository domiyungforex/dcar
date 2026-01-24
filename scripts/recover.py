#!/usr/bin/env python3
"""
Recovery script - Restore sample car data to Redis
"""

import os
import json
import re
import urllib.request
import urllib.error

# Read .env.local
try:
    with open('.env.local', 'r') as f:
        env_content = f.read()
except:
    print("❌ Could not read .env.local")
    exit(1)

# Extract Redis credentials
kv_url_match = re.search(r'KV_REST_API_URL="([^"]+)"', env_content)
kv_token_match = re.search(r'KV_REST_API_TOKEN="([^"]+)"', env_content)

if not kv_url_match or not kv_token_match:
    print("❌ Could not load Redis credentials from .env.local")
    exit(1)

KV_REST_API_URL = kv_url_match.group(1)
KV_REST_API_TOKEN = kv_token_match.group(1)

print("✅ Loaded Redis credentials")

# Sample car data
sample_cars = {
    "car-001": {
        "id": "car-001",
        "title": "2023 Toyota Camry - Premium Edition",
        "price": 5500000,
        "brand": "Toyota",
        "year": 2023,
        "mileage": 45000,
        "condition": "excellent",
        "description": "Premium Toyota Camry in excellent condition.\n- Fully loaded with latest features",
        "images": ["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800"],
        "status": "available",
        "createdAt": "2024-01-24T00:00:00Z"
    },
    "car-002": {
        "id": "car-002",
        "title": "2022 Honda Accord - Executive",
        "price": 4800000,
        "brand": "Honda",
        "year": 2022,
        "mileage": 62000,
        "condition": "good",
        "description": "Honda Accord Executive in good condition",
        "images": ["https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800"],
        "status": "available",
        "createdAt": "2024-01-22T00:00:00Z"
    },
    "car-003": {
        "id": "car-003",
        "title": "2021 BMW 320i - Luxury Series",
        "price": 6200000,
        "brand": "BMW",
        "year": 2021,
        "mileage": 78000,
        "condition": "excellent",
        "description": "Luxury BMW 320i in excellent condition",
        "images": ["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800"],
        "status": "available",
        "createdAt": "2024-01-19T00:00:00Z"
    },
    "car-004": {
        "id": "car-004",
        "title": "2023 Lexus ES - Executive Plus",
        "price": 7800000,
        "brand": "Lexus",
        "year": 2023,
        "mileage": 32000,
        "condition": "excellent",
        "description": "Latest Lexus ES in perfect condition",
        "images": ["https://images.unsplash.com/photo-1609708536965-87ac8995b947?w=800"],
        "status": "available",
        "createdAt": "2024-01-17T00:00:00Z"
    },
    "car-005": {
        "id": "car-005",
        "title": "2020 Volkswagen Passat - Standard",
        "price": 3900000,
        "brand": "Volkswagen",
        "year": 2020,
        "mileage": 95000,
        "condition": "good",
        "description": "Reliable Volkswagen Passat in good condition",
        "images": ["https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800"],
        "status": "available",
        "createdAt": "2024-01-12T00:00:00Z"
    },
    "car-006": {
        "id": "car-006",
        "title": "2023 Infiniti QX60 - Premium SUV",
        "price": 8500000,
        "brand": "Infiniti",
        "year": 2023,
        "mileage": 28000,
        "condition": "excellent",
        "description": "Premium Infiniti QX60 SUV in perfect condition",
        "images": ["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800"],
        "status": "available",
        "createdAt": "2024-01-10T00:00:00Z"
    }
}

print(f"📝 Prepared {len(sample_cars)} sample cars:")
for car_id, car in sample_cars.items():
    print(f"  ✓ {car['title']} (₦{car['price']:,})")

# Prepare request data
payload = {
    "key": "dcar:cars",
    "value": json.dumps(sample_cars, indent=2)
}

payload_json = json.dumps(payload)
payload_bytes = payload_json.encode('utf-8')

print(f"\n🚀 Sending data to Redis...")
print(f"   URL: {KV_REST_API_URL}")

try:
    req = urllib.request.Request(
        f"{KV_REST_API_URL}/set",
        data=payload_bytes,
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {KV_REST_API_TOKEN}'
        },
        method='POST'
    )
    
    with urllib.request.urlopen(req) as response:
        result = response.read().decode('utf-8')
        print("✅ Data successfully restored to Redis!")
        print(f"📊 {len(sample_cars)} cars ready for use")
        
except urllib.error.URLError as e:
    print(f"❌ Failed to connect to Redis: {e}")
    exit(1)
except Exception as e:
    print(f"❌ Error: {e}")
    exit(1)
