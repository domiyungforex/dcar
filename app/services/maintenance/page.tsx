import Link from 'next/link'
import ServiceInquiryForm from '@/components/ServiceInquiryForm'

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/services" className="text-cyan-400 hover:text-cyan-300 mb-8 inline-block">
          ← Back to Services
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="text-6xl mb-6">🔧</div>
            <h1 className="text-4xl font-bold text-white mb-4">Maintenance & Repairs</h1>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Keep your vehicle running smoothly with our comprehensive maintenance and repair services. We handle everything from routine oil changes and fluid checks to complex repairs and component replacements.
            </p>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-cyan-400">What's Included:</h2>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-3">•</span>
                  <span>Oil and filter changes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-3">•</span>
                  <span>Fluid top-ups and replacements</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-3">•</span>
                  <span>Belt and hose replacement</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-3">•</span>
                  <span>Battery and starter service</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-3">•</span>
                  <span>General wear and tear repairs</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-900 border border-cyan-500/30 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-cyan-400 mb-6">Request Maintenance Service</h2>
            <ServiceInquiryForm serviceType="maintenance" serviceName="Maintenance & Repairs" />
          </div>
        </div>
      </div>
    </div>
  )
}
