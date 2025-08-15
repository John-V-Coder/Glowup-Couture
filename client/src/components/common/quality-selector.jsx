import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Plus, Minus } from "lucide-react"

export function QuantitySelector({ quantity, onQuantityChange, maxStock }) {
  return (
    <div className="flex items-center gap-4">
      <Label>Quantity:</Label>
      <div className="flex items-center border rounded-lg">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onQuantityChange(-1)}
          disabled={quantity <= 1}
          className="h-10 w-10"
        >
          <Minus className="w-4 h-4" />
        </Button>
        <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onQuantityChange(1)}
          disabled={quantity >= maxStock}
          className="h-10 w-10"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}