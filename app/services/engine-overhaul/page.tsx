import Link from 'next/link'
import ServiceInquiryForm from '@/components/ServiceInquiryForm'

export default function EngineOverhaulPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/services" className="text-cyan-400 hover:text-cyan-300 mb-8 inline-block">
          ← Back to Services
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="text-6xl mb-6">⚙️</div>
            <h1 className="text-4xl font-bold text-white mb-4">Engine Overhaul</h1>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Give your engine a complete overhaul with our expert diagnostics, rebuilding, and performance tuning services. We work on all engine types and sizes to restore power and efficiency.
            </p>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-cyan-400">What's Included:</h2>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-3">•</span>
                  <span>Complete engine diagnostics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-3">•</span>
                  <span>Engine rebuilding and reconditioning</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-3">•</span>
                  <span>Head gasket replacement</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-3">•</span>
                  <span>Valve and piston service</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-400 mr-3">•</span>
                  <span>Performance tuning and calibration</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-900 border border-cyan-500/30 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-cyan-400 mb-6">Request Engine Service</h2>
            <ServiceInquiryForm serviceType="engine-overhaul" serviceName="Engine Overhaul" />
          </div>
        </div>
      </div>
    </div>
  )
}
