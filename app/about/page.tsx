import Link from "next/link"
import { ScrollReveal } from "@/components/ScrollReveal"

export const metadata = {
  title: "About DCAR - Engineering Excellence in Automotive",
  description: "Learn about DCAR's mission to provide trustworthy, engineer-inspected vehicles across Africa.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-primary">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center">
              <h1 className="text-5xl sm:text-6xl font-bold mb-4 glow-text">About DCAR</h1>
              <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
                Reimagining the automotive experience through engineering excellence and transparency
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="bg-background border border-border rounded-lg p-8 md:p-12 neon-border">
              <h2 className="text-3xl font-bold mb-4 text-accent">Our Mission</h2>
              <p className="text-foreground/80 text-lg leading-relaxed mb-4">
                At DCAR, we believe buying a car shouldn't be a gamble. Our mission is to transform the automotive 
                market in Africa by providing buyers with complete transparency, honest assessments, and vehicles 
                that have been rigorously inspected by certified mechanical engineers.
              </p>
              <p className="text-foreground/80 text-lg leading-relaxed">
                We're committed to building long-term relationships with our customers, not just making quick sales. 
                Every vehicle sold is backed by our commitment to quality, honesty, and after-sales support.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-3xl font-bold mb-8 text-center glow-text">The Founder's Story</h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <ScrollReveal>
              <div className="bg-primary border border-border rounded-lg p-8 neon-border">
                <div className="text-6xl mb-4">🔧</div>
                <h3 className="text-xl font-bold mb-4">Engineering Background</h3>
                <p className="text-foreground/80 leading-relaxed">
                  DCAR was founded by a passionate mechanical engineering student who witnessed firsthand 
                  how many people get exploited when buying used cars. Hidden engine problems, undisclosed transmission 
                  issues, and dishonest sellers were rampant.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="bg-primary border border-border rounded-lg p-8 neon-border">
                <div className="text-6xl mb-4">💡</div>
                <h3 className="text-xl font-bold mb-4">The Revelation</h3>
                <p className="text-foreground/80 leading-relaxed">
                  "If I apply my engineering expertise to inspect every vehicle properly, I can protect buyers 
                  and build a business based on trust." This simple idea became DCAR's foundation—honesty, 
                  transparency, and engineering-backed quality assurance.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-3xl font-bold mb-12 text-center glow-text">Our Core Values</h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Honesty",
                desc: "We tell you exactly what's wrong with a vehicle, even if it means losing a sale.",
              },
              {
                title: "Transparency",
                desc: "No hidden fees, no surprises. Complete cost breakdowns before you commit.",
              },
              {
                title: "Engineering Excellence",
                desc: "Every car is inspected by certified mechanical engineers using industry standards.",
              },
              {
                title: "Long-Term Reliability",
                desc: "We care about your experience long after purchase with dedicated after-sales support.",
              },
              {
                title: "Customer Trust",
                desc: "Building Africa's most trusted automotive brand, one honest transaction at a time.",
              },
              {
                title: "Continuous Improvement",
                desc: "We constantly improve our processes to serve you better.",
              },
            ].map((value, idx) => (
              <ScrollReveal key={idx}>
                <div className="bg-background border border-border rounded-lg p-6 hover:border-accent transition-colors neon-border">
                  <h3 className="text-xl font-bold mb-2 text-accent">{value.title}</h3>
                  <p className="text-foreground/70">{value.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center bg-primary border border-border rounded-lg p-8 md:p-12 neon-border">
              <h2 className="text-3xl font-bold mb-4 text-accent">Our Vision</h2>
              <p className="text-lg text-foreground/80 leading-relaxed mb-6">
                To become Africa's most trusted automotive brand, where buyers feel confident, sellers are valued, 
                and every transaction is backed by engineering excellence and unwavering commitment to quality.
              </p>
              <p className="text-2xl font-bold text-accent italic">
                "Drive with confidence. Drive DCAR."
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Join Us?</h2>
            <p className="text-foreground/80 mb-8 text-lg">
              Experience the DCAR difference with verified, engineer-inspected vehicles
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/cars"
                className="px-8 py-3 bg-accent hover:bg-accent/90 text-primary font-bold rounded transition neon-border"
              >
                Browse Vehicles
              </Link>
              <Link
                href="/#get-in-touch"
                className="px-8 py-3 border border-accent text-accent hover:bg-accent/10 font-bold rounded transition"
              >
                Contact Us
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
