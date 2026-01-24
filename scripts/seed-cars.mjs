#!/usr/bin/env node

import { createClient } from 'redis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read .env.local
const envContent = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const lines = envContent.split('\n');
const env = {};

lines.forEach(line => {
  if (line.includes('=')) {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=').replace(/^"|"$/g, '');
    env[key.trim()] = value;
  }
});

const redisUrl = env.REDIS_URL || env.KV_URL;

// Sample car data
const sampleCars = {
  'car-1': {
    id: 'car-1',
    title: '2022 Toyota Camry - Premium Sedan',
    price: 8500000,
    brand: 'Toyota',
    year: 2022,
    mileage: 45000,
    condition: 'excellent',
    images: [
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1200&h=675',
      'https://images.unsplash.com/photo-1581274455760-ce4c0db2817d?w=1200&h=675',
    ],
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    description: 'Beautiful 2022 Toyota Camry in excellent condition. Well-maintained with full service history. Perfect family sedan.',
    createdAt: new Date().toISOString(),
    status: 'available'
  },
  'car-2': {
    id: 'car-2',
    title: '2021 Honda Accord - Automatic',
    price: 7200000,
    brand: 'Honda',
    year: 2021,
    mileage: 52000,
    condition: 'good',
    images: [
      'https://images.unsplash.com/photo-1609708536965-59e31eef5924?w=1200&h=675',
      'https://images.unsplash.com/photo-1494976866556-6812c6aa1c90?w=1200&h=675',
    ],
    description: 'Reliable Honda Accord with smooth automatic transmission. Great fuel efficiency.',
    createdAt: new Date().toISOString(),
    status: 'available'
  },
  'car-3': {
    id: 'car-3',
    title: '2023 Lexus ES - Luxury Sedan',
    price: 12500000,
    brand: 'Lexus',
    year: 2023,
    mileage: 15000,
    condition: 'excellent',
    images: [
      'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=1200&h=675',
      'https://images.unsplash.com/photo-1618654377441-ca6d40a3a2e0?w=1200&h=675',
    ],
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    description: 'Premium luxury sedan with all modern features. Impeccable condition.',
    createdAt: new Date().toISOString(),
    status: 'available'
  },
  'car-4': {
    id: 'car-4',
    title: '2020 BMW X5 - SUV',
    price: 10800000,
    brand: 'BMW',
    year: 2020,
    mileage: 68000,
    condition: 'good',
    images: [
      'https://images.unsplash.com/photo-1606611013016-969c19d14a7f?w=1200&h=675',
      'https://images.unsplash.com/photo-1561518776-e76a5c8f0744?w=1200&h=675',
    ],
    description: 'Spacious BMW X5 SUV. Perfect for families. All-wheel drive with excellent handling.',
    createdAt: new Date().toISOString(),
    status: 'available'
  },
  'car-5': {
    id: 'car-5',
    title: '2019 Mercedes C-Class - Elegant',
    price: 9200000,
    brand: 'Mercedes',
    year: 2019,
    mileage: 75000,
    condition: 'good',
    images: [
      'https://images.unsplash.com/photo-1567818735868-e71b99932e29?w=1200&h=675',
      'https://images.unsplash.com/photo-1566023967268-de0fb65e61c4?w=1200&h=675',
    ],
    description: 'Classic Mercedes elegance with powerful engine. Recently serviced.',
    createdAt: new Date().toISOString(),
    status: 'available'
  },
};

async function seedData() {
  const client = createClient({ url: redisUrl });

  try {
    await client.connect();
    console.log('🌱 Seeding sample car data...\n');

    // Save cars
    await client.set('cars', JSON.stringify(sampleCars), { EX: 86400 * 365 });
    console.log(`✅ Added ${Object.keys(sampleCars).length} sample cars`);

    // Initialize empty inquiries object
    await client.set('inquiries', JSON.stringify({}), { EX: 86400 * 365 });
    console.log('✅ Initialized inquiries object');

    console.log('\n🚗 Sample Cars Added:');
    Object.values(sampleCars).forEach(car => {
      console.log(`  - ${car.title} (₦${car.price.toLocaleString()})`);
    });

    console.log('\n✅ Data seeded successfully!');
    console.log('\n📍 Now you can:');
    console.log('  1. Access the admin panel: https://dcars.vercel.app/admin');
    console.log('  2. Enter code: dcar_admin_2025_secure_key');
    console.log('  3. View and edit cars');

  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
  } finally {
    await client.quit();
  }
}

seedData();
