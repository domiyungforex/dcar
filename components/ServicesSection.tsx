"use client"

export default function ServicesSection() {
  const services = [
    {
      icon: "🔧",
      title: "Maintenance & Repairs",
      description: "Complete maintenance and repair services for all vehicle types"
    },
    {
      icon: "⚙️",
      title: "Engine Overhaul",
      description: "Professional engine inspection, repair, and performance optimization"
    },
    {
      icon: "🛞",
      title: "Suspension & Brakes",
      description: "Advanced suspension tuning and brake system servicing"
    },
    {
      icon: "🔌",
      title: "Electrical Systems",
      description: "Diagnostic and repair of complex electrical systems"
    },
    {
      icon: "🎨",
      title: "Body & Paint",
      description: "Professional body work and custom paint services"
    },
    {
      icon: "📊",
      title: "Diagnostics",
      description: "Computer diagnostics and performance testing"
    },
  ]

  return (
    <section className="py-16 sm:py-24 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold mb-3 glow-text">OUR MECHANICAL SERVICES</h2>
          <div className="w-12 h-1 bg-accent rounded-full mx-auto"></div>
          <p className="text-foreground/60 mt-4 text-lg">Professional automotive solutions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-background border border-border rounded-lg p-6 hover:shadow-lg hover:border-accent transition-all duration-300 neon-border"
            >
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-accent">{service.title}</h3>
              <p className="text-foreground/70">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
