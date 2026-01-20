import { ScrollReveal } from "@/components/ScrollReveal"

export default function WhyBuyDCAR() {
  const reasons = [
    {
      icon: "🔧",
      title: "Engineer-Inspected",
      description: "Every car is thoroughly inspected by a certified mechanical engineer",
    },
    {
      icon: "✓",
      title: "No Hidden Issues",
      description: "Honest assessment of engine, transmission, and all major systems",
    },
    {
      icon: "💰",
      title: "Honest Cost Disclosure",
      description: "Complete repair cost transparency before you buy",
    },
    {
      icon: "📋",
      title: "Verified Documents",
      description: "All documents verified with complete VIN checks",
    },
    {
      icon: "🤝",
      title: "After-Sales Support",
      description: "Dedicated guidance and support long after your purchase",
    },
    {
      icon: "⭐",
      title: "Trusted Brand",
      description: "Building Africa's most reliable automotive dealership",
    },
  ]

  return (
    <section className="py-16 sm:py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-3 glow-text">Why Buy from DCAR?</h2>
            <div className="w-12 h-1 bg-accent rounded-full mx-auto"></div>
            <p className="text-foreground/60 mt-4 text-lg">Engineering excellence meets customer trust</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, idx) => (
            <ScrollReveal key={idx}>
              <div className="bg-background border border-border rounded-lg p-6 hover:border-accent transition-colors duration-300 neon-border">
                <div className="text-5xl mb-4">{reason.icon}</div>
                <h3 className="text-xl font-bold mb-2">{reason.title}</h3>
                <p className="text-foreground/70 text-sm leading-relaxed">{reason.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
