import { Button } from "@/components/ui/button"
import { Heart, Share2, ShoppingCart } from "lucide-react"
import { ShareMenu } from "./sharemenu"

export function ProductActions({
  isWishlisted,
  onWishlistToggle,
  showShareMenu,
  onShareToggle,
  onShare,
  quantity,
  totalStock,
  onAddToCart,
  productId
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onWishlistToggle}
            className={isWishlisted ? "text-red-500" : ""}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
          </Button>
          <div className="relative">
            <Button variant="outline" size="icon" onClick={onShareToggle}>
              <Share2 className="w-4 h-4" />
            </Button>
            <ShareMenu showShareMenu={showShareMenu} onShare={onShare} />
          </div>
        </div>
      </div>

      {totalStock === 0 ? (
        <Button className="w-full" disabled>
          Out of Stock
        </Button>
      ) : (
        <Button
          className="w-full flex items-center gap-2"
          onClick={() => onAddToCart(productId, totalStock)}
        >
          <ShoppingCart className="w-4 h-4" />
          Add {quantity} to Cart
        </Button>
      )}
    </div>
  )
}