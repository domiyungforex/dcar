/**
 * Seed Script - Populate Redis with sample car data
 * Run with: npx ts-node scripts/seed-data.ts
 */

import { kv } from "@vercel/kv"

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
    description: `Premium Toyota Camry in excellent condition. 
- Fully loaded with all latest features
- Full service history maintained
- Single owner, accident-free
- Climate control, leather seats, sunroof
- Advanced safety features included
- Ready for immediate use`,
    images: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800",
      "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800",
      "https://images.unsplash.com/photo-1609708536965-87ac8995b947?w=800",
    ],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    status: "available",
    createdAt: new Date().toISOString(),
    inspectionNote: "Passed comprehensive inspection",
    inspectionChecklist: {
      mechanical: {
        engineNoise: true,
        oilLeaks: true,
        coolingSystem: true,
        gearboxResponse: true,
        suspensionSteering: true,
        brakeCondition: true,
      },
      electrical: {
        ecuScan: true,
        sensors: true,
        dashboardWarnings: false,
        acSystem: true,
      },
      structural: {
        chassisAlignment: true,
        accidentSigns: false,
        rustInspection: true,
      },
      documents: {
        vinVerification: true,
        customsPapers: true,
        ownershipHistory: true,
      },
    },
  },
  "car-002": {
    id: "car-002",
    title: "2022 Honda Accord - Executive",
    price: 4800000,
    brand: "Honda",
    year: 2022,
    mileage: 62000,
    condition: "good",
    description: `Honda Accord Executive model, well maintained.
- Fuel efficient with excellent performance
- Complete maintenance records available
- Two owners, well cared for
- Power steering, ABS, airbags
- Spacious interior with modern infotainment
- Ideal family car`,
    images: [
      "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800",
      "https://images.unsplash.com/photo-1609708536965-87ac8995b947?w=800",
    ],
    status: "available",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    inspectionNote: "Passed inspection with minor recommendations",
  },
  "car-003": {
    id: "car-003",
    title: "2021 BMW 320i - Luxury Series",
    price: 6200000,
    brand: "BMW",
    year: 2021,
    mileage: 78000,
    condition: "excellent",
    description: `Luxury BMW 320i, premium condition.
- State-of-the-art features and technology
- Full service history from authorized dealer
- Single owner, garage kept
- Panoramic sunroof, leather interior
- Advanced driver assistance systems
- Premium sound system`,
    images: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800",
      "https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=800",
    ],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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
    description: `Latest Lexus ES, barely used and in perfect condition.
- Almost new with minimal mileage
- Hybrid engine for fuel efficiency
- Pristine interior and exterior
- Full warranty transferable
- All luxury features included
- Premium quality assured`,
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
    description: `Reliable Volkswagen Passat, good condition.
- Economical to run and maintain
- Spacious interior for family use
- Regular servicing done
- Comfortable for long drives
- Good fuel economy
- Affordable luxury option`,
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
    description: `Premium Infiniti SUV, luxury and performance combined.
- 3-row seating for families
- All-wheel drive capability
- Advanced safety technology
- Leather appointments throughout
- Premium audio system
- Perfect condition`,
    images: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800",
      "https://images.unsplash.com/photo-1609708536965-87ac8995b947?w=800",
      "https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=800",
    ],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    status: "available",
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
}

async function seedData() {
  try {
    console.log("🌱 Starting to seed car data...")

    // Save all cars to Redis
    await kv.set(CARS_KEY, sampleCars)

    console.log("✅ Successfully seeded car data!")
    console.log(`📊 Added ${Object.keys(sampleCars).length} sample cars`)
    console.log("\nSample cars:")
    Object.values(sampleCars).forEach((car: any) => {
      console.log(`  - ${car.title} (₦${car.price.toLocaleString()})`)
    })

    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding data:", error)
    process.exit(1)
  }
}

// Run if this is the main module
seedData()
