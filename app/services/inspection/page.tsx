import Link from "next/link"
import { ScrollReveal } from "@/components/ScrollReveal"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Car Inspection & Advisory - DCAR Auto",
  description: "Professional engineer-backed vehicle inspections and purchase advisory services in Lagos and Ogun State.",
}

export default function CarInspectionPage() {
  const inspectionItems = [
    { icon: "🔍", title: "Engine Health", desc: "Complete compression tests and fluid analysis" },
    { icon: "⚙️", title: "Transmission", desc: "Shift quality and fluid condition assessment" },
    { icon: "🚗", title: "Suspension", desc: "Shock absorbers, springs, and alignment check" },
    { icon: "⚡", title: "Electrical Systems", desc: "Battery, alternator, and wiring integrity" },
    { icon: "🛠️", title: "Chassis & Brakes", desc: "Frame integrity and brake system evaluation" },
    { icon: "📄", title: "Documents & VIN", desc: "Authenticity verification and title checks" },
  ]

  const pricingTiers = [
    {
      title: "Basic Inspection",
      price: "₦25,000",
      items: [
        "Visual inspection of major components",
        "Engine compression test",
        "Transmission fluid check",
        "Brake system evaluation",
        "Electrical systems check",
        "VIN verification",
        "PDF report",
      ],
      cta: "Book Now",
      highlight: false,
    },
    {
      title: "Full Diagnostic",
      price: "₦45,000",
      items: [
        "Everything in Basic Inspection",
        "Full engine diagnostic scan",
        "Transmission diagnostics",
        "Suspension detailed assessment",
        "Paint thickness measurement",
        "Accident history check",
        "Photo documentation (20+ photos)",
        "Video walkthrough",
        "Detailed written report",
      ],
      cta: "Book Now",
      highlight: true,
    },
    {
      title: "Purchase Advisory",
      price: "₦65,000",
      items: [
        "Everything in Full Diagnostic",
        "Market value comparison",
        "Negotiation guidance",
        "Hidden defect detection",
        "Future maintenance forecast",
        "Repair cost estimation",
        "Final recommendation",
        "Post-purchase support (30 days)",
      ],
      cta: "Book Now",
      highlight: false,
    },
  ]

  return (
    <div className="min-h-screen bg-primary">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center">
              <h1 className="text-5xl sm:text-6xl font-bold mb-4 glow-text">
                Car Inspection & Advisory
              </h1>
              <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
                Engineer-backed vehicle assessments for confident purchasing decisions
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Service Overview */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="bg-background border border-border rounded-lg p-8 md:p-12 neon-border mb-12">
              <h2 className="text-2xl font-bold mb-4">Why Choose Our Inspection Service?</h2>
              <p className="text-foreground/80 text-lg leading-relaxed mb-4">
                Buying a vehicle is one of the most important financial decisions you'll make. Our comprehensive 
                inspection and advisory service eliminates guesswork and gives you complete confidence in your purchase.
              </p>
              <p className="text-foreground/80 text-lg leading-relaxed">
                Our certified mechanical engineers use industry-standard tools and rigorous evaluation protocols to 
                identify any issues—big or small—ensuring you know exactly what you're buying.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* What We Inspect */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-3xl font-bold mb-12 text-center glow-text">Comprehensive Inspection Checklist</h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inspectionItems.map((item, idx) => (
              <ScrollReveal key={idx}>
                <div className="bg-primary border border-border rounded-lg p-6 neon-border hover:border-accent transition-colors">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-foreground/70 text-sm">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-3xl font-bold mb-4 text-center glow-text">Pricing Tiers</h2>
            <p className="text-center text-foreground/70 mb-12 max-w-2xl mx-auto">
              Choose the inspection level that best fits your needs
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, idx) => (
              <ScrollReveal key={idx}>
                <div
                  className={`rounded-lg border ${
                    tier.highlight
                      ? "border-accent bg-accent/5 md:scale-105 md:shadow-2xl"
                      : "border-border bg-background"
                  } p-8 neon-border flex flex-col`}
                >
                  {tier.highlight && (
                    <div className="mb-3 inline-flex w-fit px-3 py-1 bg-accent text-primary text-sm font-bold rounded">
                      RECOMMENDED
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{tier.title}</h3>
                  <div className="text-4xl font-bold text-accent mb-6">{tier.price}</div>

                  <ul className="space-y-3 mb-8 flex-grow">
                    {tier.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-3">
                        <span className="text-accent mt-1">✓</span>
                        <span className="text-foreground/80 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full font-bold py-3 ${
                      tier.highlight
                        ? "bg-accent hover:bg-accent/90 text-primary"
                        : "bg-primary border border-accent text-accent hover:bg-accent/10"
                    }`}
                  >
                    {tier.cta}
                  </Button>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-3xl font-bold mb-12 text-center glow-text">Our Process</h2>
          </ScrollReveal>

          <div className="space-y-6">
            {[
              {
                step: 1,
                title: "Book Your Inspection",
                desc: "Select your preferred date and time using WhatsApp or phone",
              },
              {
                step: 2,
                title: "Vehicle Assessment",
                desc: "Our engineer conducts thorough inspection using professional tools",
              },
              {
                step: 3,
                title: "Detailed Report",
                desc: "Receive comprehensive report with photos, findings, and recommendations",
              },
              {
                step: 4,
                title: "Expert Guidance",
                desc: "Discuss results with our engineer and get professional advice",
              },
            ].map((item) => (
              <ScrollReveal key={item.step}>
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent rounded-full flex items-center justify-center text-primary font-bold text-lg">
                    {item.step}
                  </div>
                  <div className="flex-grow pt-1">
                    <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                    <p className="text-foreground/70">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Get Your Vehicle Inspected?</h2>
            <p className="text-foreground/80 mb-8 text-lg">
              Contact us today to book your inspection or discuss your needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/2348144106774?text=I'd%20like%20to%20book%20a%20car%20inspection%20with%20DCAR"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-accent hover:bg-accent/90 text-primary font-bold rounded transition neon-border inline-flex items-center justify-center gap-2"
              >
                💬 WhatsApp Us
              </a>
              <a
                href="tel:+2348144106774"
                className="px-8 py-3 border border-accent text-accent hover:bg-accent/10 font-bold rounded transition inline-flex items-center justify-center gap-2"
              >
                📞 Call Us
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
