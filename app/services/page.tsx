import ServicesSection from '@/components/ServicesSection'
import Link from 'next/link'

export default function ServicesPage() {
  const services = [
    { 
      slug: 'maintenance',
      icon: '🔧', 
      title: 'Maintenance & Repairs', 
      description: 'Regular maintenance, oil changes, fluid checks, and general repairs' 
    },
    { 
      slug: 'engine-overhaul',
      icon: '⚙️', 
      title: 'Engine Overhaul', 
      description: 'Complete engine diagnostics, rebuilding, and performance tuning' 
    },
    { 
      slug: 'suspension',
      icon: '🛻', 
      title: 'Suspension & Brakes', 
      description: 'Suspension repairs, brake service, alignment, and wheel balancing' 
    },
    { 
      slug: 'electrical',
      icon: '⚡', 
      title: 'Electrical Systems', 
      description: 'Battery service, alternator repair, wiring, and electrical troubleshooting' 
    },
    { 
      slug: 'body-paint',
      icon: '🎨', 
      title: 'Body & Paint', 
      description: 'Dent removal, scratch repair, repainting, and body restoration' 
    },
    { 
      slug: 'diagnostics',
      icon: '🔍', 
      title: 'Diagnostics', 
      description: 'Computer diagnostics, problem identification, and repair recommendations' 
    },
  ]

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            Our Services
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Professional mechanical engineering services for all your vehicle needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link key={service.slug} href={`/services/${service.slug}`}>
              <div className="group relative p-6 bg-slate-900 border border-cyan-500/20 rounded-lg hover:border-cyan-500/60 transition-all duration-300 cursor-pointer h-full hover:bg-slate-800 hover:shadow-lg hover:shadow-cyan-500/10">
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-cyan-400 mb-2 group-hover:text-cyan-300 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {service.description}
                </p>
                <div className="mt-4 text-cyan-400 font-medium text-sm group-hover:translate-x-1 transition-transform">
                  Request Service →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
