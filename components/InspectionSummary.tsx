import type { Car } from "@/lib/types"

interface InspectionSummaryProps {
  car: Car
}

export default function InspectionSummary({ car }: InspectionSummaryProps) {
  if (!car.inspectionChecklist) {
    return null
  }

  const checklist = car.inspectionChecklist

  const categories = [
    {
      title: "🔧 Mechanical",
      items: [
        { label: "Engine noise & compression", checked: checklist.mechanical.engineNoise },
        { label: "Oil leaks", checked: checklist.mechanical.oilLeaks },
        { label: "Cooling system", checked: checklist.mechanical.coolingSystem },
        { label: "Gearbox response", checked: checklist.mechanical.gearboxResponse },
        { label: "Suspension & steering", checked: checklist.mechanical.suspensionSteering },
        { label: "Brake condition", checked: checklist.mechanical.brakeCondition },
      ],
    },
    {
      title: "⚡ Electrical",
      items: [
        { label: "ECU scan", checked: checklist.electrical.ecuScan },
        { label: "Sensors", checked: checklist.electrical.sensors },
        { label: "Dashboard warnings", checked: checklist.electrical.dashboardWarnings },
        { label: "AC system", checked: checklist.electrical.acSystem },
      ],
    },
    {
      title: "🚘 Structural",
      items: [
        { label: "Chassis alignment", checked: checklist.structural.chassisAlignment },
        { label: "Accident signs", checked: checklist.structural.accidentSigns },
        { label: "Rust inspection", checked: checklist.structural.rustInspection },
      ],
    },
    {
      title: "📄 Documents",
      items: [
        { label: "VIN verification", checked: checklist.documents.vinVerification },
        { label: "Customs papers", checked: checklist.documents.customsPapers },
        { label: "Ownership history", checked: checklist.documents.ownershipHistory },
      ],
    },
  ]

  const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0)
  const checkedItems = categories.reduce(
    (sum, cat) => sum + cat.items.filter((item) => item.checked).length,
    0
  )

  return (
    <div className="bg-background border border-border rounded-lg p-6 neon-border">
      <h2 className="text-2xl font-bold mb-2">Engineer Inspection Summary</h2>
      <div className="mb-6 pb-6 border-b border-border">
        <div className="inline-flex items-center gap-3 bg-accent/10 px-4 py-2 rounded">
          <span className="text-2xl font-bold text-accent">{checkedItems}</span>
          <span className="text-foreground/70">of {totalItems} items verified</span>
        </div>
      </div>

      <div className="space-y-6">
        {categories.map((category, catIdx) => (
          <div key={catIdx}>
            <h3 className="text-lg font-bold mb-3">{category.title}</h3>
            <div className="space-y-2">
              {category.items.map((item, itemIdx) => (
                <div key={itemIdx} className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      item.checked
                        ? "bg-green-600 border-green-600"
                        : "border-gray-400"
                    }`}
                  >
                    {item.checked && <span className="text-white text-sm">✓</span>}
                  </div>
                  <span className={item.checked ? "text-foreground" : "text-foreground/60"}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {car.inspectionNote && (
        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="font-bold mb-2">Inspector Notes</h3>
          <p className="text-foreground/80 text-sm leading-relaxed">{car.inspectionNote}</p>
        </div>
      )}
    </div>
  )
}
