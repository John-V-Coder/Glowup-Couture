// components/product/ProductFeatures.jsx
import { Truck, RotateCcw, Shield } from "lucide-react"

export function ProductFeatures() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
      <div className="flex items-center gap-2 text-sm">
        <Truck className="w-4 h-4 text-green-600" />
        <span>Free delivery for oders above 5K</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <RotateCcw className="w-4 h-4 text-blue-600" />
        <span>NO Return</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Shield className="w-4 h-4 text-purple-600" />
        <span>Online Policies Observed</span>
      </div>
    </div>
  )
}