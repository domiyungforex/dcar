import Link from "next/link"
import Image from "next/image"
import type { Car } from "@/lib/types"

interface CarCardProps {
  car: Car
}

export default function CarCard({ car }: CarCardProps) {
  return (
    <Link href={`/cars/${car.id}`}>
      <div className="group neon-border backdrop-blur-custom rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer h-full flex flex-col hover:border-accent-secondary hover:scale-105 transform">
        {car.images.length > 0 ? (
          <div className="relative w-full h-48 bg-gradient-to-br from-primary to-secondary overflow-hidden">
            <Image
              src={car.images[0] || "/placeholder.svg?height=192&width=400&query=luxury car"}
              alt={car.title}
              fill
              className="object-cover group-hover:scale-125 transition-transform duration-700 brightness-90 group-hover:brightness-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {car.video && (
              <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                🎥 VIDEO
              </div>
            )}
            <div className="absolute top-3 right-3 bg-accent text-primary px-3 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              FEATURED
            </div>
          </div>
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-muted-foreground">No image available</span>
          </div>
        )}

        <div className="p-5 flex flex-col flex-grow bg-secondary/50">
          <h3 className="font-bold text-lg text-primary-foreground mb-3 line-clamp-2 group-hover:text-accent transition-colors duration-300 glow-text">
            {car.title}
          </h3>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-3xl font-bold text-accent">${car.price.toLocaleString()}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs text-foreground/70 mb-4 pb-4 border-b border-accent/20">
            <div className="text-center">
              <span className="font-bold text-accent block">{car.year}</span>
              <p className="text-xs">Year</p>
            </div>
            <div className="text-center">
              <span className="font-bold text-accent block">{(car.mileage / 1000).toFixed(0)}K</span>
              <p className="text-xs">Miles</p>
            </div>
            <div className="text-center">
              <span className="font-bold text-accent-secondary block capitalize">{car.condition}</span>
              <p className="text-xs">Condition</p>
            </div>
          </div>

          <p className="text-sm text-foreground/60 line-clamp-2 mb-4 flex-grow">{car.description}</p>

          <button className="w-full bg-gradient-to-r from-accent to-accent-secondary hover:from-accent-secondary hover:to-accent text-primary px-4 py-3 rounded font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-accent/50 neon-border">
            View Details
          </button>
        </div>
      </div>
    </Link>
  )
}