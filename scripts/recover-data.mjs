#!/usr/bin/env node
/**
 * Quick Recovery Script - Restore sample car data to Redis
 * Run with: node scripts/recover-data.mjs
 */

import { createClient } from "@vercel/kv"

const redisUrl = process.env.KV_REST_API_URL
const redisToken = process.env.KV_REST_API_TOKEN

if (!redisUrl || !redisToken) {
  console.error("❌ Missing KV_REST_API_URL or KV_REST_API_TOKEN environment variables")
  console.error("   Make sure .env.local is loaded or set environment variables")
  process.exit(1)
}

const kv = createClient({
  url: redisUrl,
  token: redisToken,
})

const CARS_KEY = "dcar:cars"

const sampleCars = {
  "car-001": {
    id: "car-001",
    title: "2023 Toyota Camry - Premium Edition",
    price: 5500000,
    brand: "Toyota",
    year: 2023,
    mileage: 45000,
    condition: "excellent",
    description: `Premium Toyota Camry in excellent condition.\n- Fully loaded with all latest features\n- Full service history maintained\n- Single owner, accident-free\n- Climate control, leather seats, sunroof\n- Advanced safety features included\n- Ready for immediate use`,
    images: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800",
      "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800",
      "https://images.unsplash.com/photo-1609708536965-87ac8995b947?w=800",
    ],
    status: "available",
    createdAt: new Date().toISOString(),
    inspectionNote: "Passed comprehensive inspection",
  },
  "car-002": {
    id: "car-002",
    title: "2022 Honda Accord - Executive",
    price: 4800000,
    brand: "Honda",
    year: 2022,
    mileage: 62000,
    condition: "good",
    description: `Honda Accord Executive model, well maintained.\n- Fuel efficient with excellent performance\n- Complete maintenance records available\n- Two owners, well cared for\n- Power steering, ABS, airbags\n- Spacious interior with modern infotainment\n- Ideal family car`,
    images: [
      "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800",
      "https://images.unsplash.com/photo-1609708536965-87ac8995b947?w=800",
    ],
    status: "available",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  "car-003": {
    id: "car-003",
    title: "2021 BMW 320i - Luxury Series",
    price: 6200000,
    brand: "BMW",
    year: 2021,
    mileage: 78000,
    condition: "excellent",
    description: `Luxury BMW 320i, premium condition.\n- State-of-the-art features and technology\n- Full service history from authorized dealer\n- Single owner, garage kept\n- Panoramic sunroof, leather interior\n- Advanced driver assistance systems\n- Premium sound system`,
    images: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800",
      "https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=800",
    ],
    status: "available",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  "car-004": {
    id: "car-004",
    title: "2023 Lexus ES - Executive Plus",
    price: 7800000,
    brand: "Lexus",
    year: 2023,
    mileage: 32000,
    condition: "excellent",
    description: `Latest Lexus ES, barely used and in perfect condition.\n- Almost new with minimal mileage\n- Hybrid engine for fuel efficiency\n- Pristine interior and exterior\n- Full warranty transferable\n- All luxury features included\n- Premium quality assured`,
    images: [
      "https://images.unsplash.com/photo-1609708536965-87ac8995b947?w=800",
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800",
    ],
    status: "available",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  "car-005": {
    id: "car-005",
    title: "2020 Volkswagen Passat - Standard",
    price: 3900000,
    brand: "Volkswagen",
    year: 2020,
    mileage: 95000,
    condition: "good",
    description: `Reliable Volkswagen Passat, good condition.\n- Economical to run and maintain\n- Spacious interior for family use\n- Regular servicing done\n- Comfortable for long drives\n- Good fuel economy\n- Affordable luxury option`,
    images: [
      "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800",
    ],
    status: "available",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  "car-006": {
    id: "car-006",
    title: "2023 Infiniti QX60 - Premium SUV",
    price: 8500000,
    brand: "Infiniti",
    year: 2023,
    mileage: 28000,
    condition: "excellent",
    description: `Premium Infiniti SUV, luxury and performance combined.\n- 3-row seating for families\n- All-wheel drive capability\n- Advanced safety technology\n- Leather appointments throughout\n- Premium audio system\n- Perfect condition`,
    images: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800",
      "https://images.unsplash.com/photo-1609708536965-87ac8995b947?w=800",
      "https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=800",
    ],
    status: "available",
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
}

async function recoverData() {
  try {
    console.log("🌱 Starting data recovery...")
    console.log(`📝 Saving ${Object.keys(sampleCars).length} cars to Redis...`)

    // Save all cars
    await kv.set(CARS_KEY, sampleCars)

    console.log("\n✅ Data recovery successful!")
    console.log(`✓ ${Object.keys(sampleCars).length} cars restored`)
    console.log("\nRestored cars:")
    Object.values(sampleCars).forEach((car) => {
      console.log(`  ✓ ${car.title} (₦${car.price.toLocaleString()})`)
    })

    process.exit(0)
  } catch (error) {
    console.error("❌ Recovery failed:", error)
    process.exit(1)
  }
}

recoverData()
