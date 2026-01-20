export interface Car {
  id: string
  title: string
  price: number
  brand: string
  year: number
  mileage: number
  condition: "excellent" | "good" | "fair"
  images: string[]
  video?: string
  description: string
  createdAt: string
  inspectionNote?: string
  inspectionChecklist?: {
    mechanical: {
      engineNoise: boolean
      oilLeaks: boolean
      coolingSystem: boolean
      gearboxResponse: boolean
      suspensionSteering: boolean
      brakeCondition: boolean
    }
    electrical: {
      ecuScan: boolean
      sensors: boolean
      dashboardWarnings: boolean
      acSystem: boolean
    }
    structural: {
      chassisAlignment: boolean
      accidentSigns: boolean
      rustInspection: boolean
    }
    documents: {
      vinVerification: boolean
      customsPapers: boolean
      ownershipHistory: boolean
    }
  }
  status?: "available" | "sold"
}

export interface Inquiry {
  id: string
  carId: string
  name: string
  email: string
  phone: string
  message: string
  createdAt: string
}

export interface AdminSession {
  authenticated: boolean
  token?: string
}
