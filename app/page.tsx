import Link from "next/link"
import CarCard from "@/components/CarCard"
import { getCars } from "@/lib/storage"
import { ScrollReveal } from "@/components/ScrollReveal"
import ServicesSection from "@/components/ServicesSection"
import ContactSection from "@/components/ContactSection"

export const revalidate = 60

export default async function Home() {
  const carsData = await getCars()
  const cars = Object.values(carsData)
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)

  return (
    <div>
      <section className="relative bg-gradient-to-br from-primary via-primary to-secondary text-primary-foreground py-20 sm:py-32 overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(0deg, transparent 24%, rgba(0, 217, 255, 0.1) 25%, rgba(0, 217, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(0, 217, 255, 0.1) 75%, rgba(0, 217, 255, 0.1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 217, 255, 0.1) 25%, rgba(0, 217, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(0, 217, 255, 0.1) 75%, rgba(0, 217, 255, 0.1) 76%, transparent 77%, transparent)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* Floating neon orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-accent rounded-full opacity-10 blur-3xl animate-float-smooth" />
        <div
          className="absolute bottom-32 right-20 w-40 h-40 bg-accent-secondary rounded-full opacity-10 blur-3xl animate-float-smooth"
          style={{ animationDelay: "1s" }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up neon-text">
            FUTURE OF CARS
          </h1>
          <p
            className="text-lg sm:text-xl text-foreground/80 mb-8 max-w-3xl mx-auto animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            Discover premium vehicles curated for the discerning buyer. Advanced technology meets timeless elegance.
          </p>
          <Link
            href="/cars"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-primary px-8 py-4 rounded font-bold transition duration-300 hover:shadow-xl neon-border animate-fade-in-up hover:scale-105 transform"
            style={{ animationDelay: "0.2s" }}
          >
            Explore Collection
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-16 sm:py-24 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold mb-3 glow-text">FEATURED LISTINGS</h2>
              <div className="w-12 h-1 bg-accent rounded-full" />
              <p className="text-foreground/60 mt-4">Premium selections for elite collectors</p>
            </div>
          </ScrollReveal>

          {cars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car: any, idx: number) => (
                <div key={car.id} style={{ animationDelay: `${idx * 0.1}s` }} className="animate-fade-in-up">
                  <CarCard car={car} />
                </div>
              ))}
            </div>
          ) : (
            <ScrollReveal>
              <div className="text-center py-20 backdrop-blur-custom rounded-lg neon-border">
                <p className="text-foreground/60 mb-6 text-lg">No vehicles in catalog yet</p>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 text-accent hover:text-accent-secondary transition"
                >
                  Add first vehicle
                  <span>→</span>
                </Link>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection />

      {/* Contact Section */}
      <ContactSection />

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-secondary/50 backdrop-blur-custom border-t border-accent/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Sell?</h2>
            <p className="text-foreground/70 mb-4 text-lg">Join our exclusive network of premium sellers</p>
            <p className="text-sm text-foreground/50">Contact directly for seller partnerships</p>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}

