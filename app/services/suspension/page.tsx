import Link from 'next/link'
import ServiceInquiryForm from '@/components/ServiceInquiryForm'

export default function SuspensionPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/services" className="text-cyan-400 hover:text-cyan-300 mb-8 inline-block">
          ← Back to Services
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="text-6xl mb-6">🛻</div>
            <h1 className="text-4xl font-bold text-white mb-4">Suspension & Brakes</h1>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Ensure safe and comfortable driving with our suspension and brake services. We provide complete diagnostics, repairs, and replacements for all suspension and braking system components.
            </p>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-cyan-400">What's Included:</h2>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-3">•</span>
                  <span>Suspension component inspection and repair</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-3">•</span>
                  <span>Brake pad and rotor replacement</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-3">•</span>
                  <span>Brake fluid flushing and bleeding</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-3">•</span>
                  <span>Wheel alignment and balancing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-3">•</span>
                  <span>Shock and strut replacement</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-900 border border-cyan-500/30 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-cyan-400 mb-6">Request Suspension Service</h2>
            <ServiceInquiryForm serviceType="suspension" serviceName="Suspension & Brakes" />
          </div>
        </div>
      </div>
    </div>
  )
}
