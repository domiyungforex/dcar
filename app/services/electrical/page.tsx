import Link from 'next/link'
import ServiceInquiryForm from '@/components/ServiceInquiryForm'

export default function ElectricalPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/services" className="text-cyan-400 hover:text-cyan-300 mb-8 inline-block">
          ← Back to Services
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="text-6xl mb-6">⚡</div>
            <h1 className="text-4xl font-bold text-white mb-4">Electrical Systems</h1>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Don't let electrical problems leave you stranded. We handle all types of electrical system repairs, from battery issues to complex wiring and component diagnostics.
            </p>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-cyan-400">What's Included:</h2>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-3">•</span>
                  <span>Battery testing and replacement</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-3">•</span>
                  <span>Alternator and starter service</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-3">•</span>
                  <span>Electrical wiring repair and replacement</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-3">•</span>
                  <span>Lighting system diagnostics and repair</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-3">•</span>
                  <span>Complete electrical troubleshooting</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-900 border border-cyan-500/30 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-cyan-400 mb-6">Request Electrical Service</h2>
            <ServiceInquiryForm serviceType="electrical" serviceName="Electrical Systems" />
          </div>
        </div>
      </div>
    </div>
  )
}
