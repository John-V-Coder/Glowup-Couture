import { Badge } from "@/components/ui/badge"
import { StarRatingComponent } from "@/components/common/star-rating"
import { brandOptionsMap, categoryOptionsMap } from "@/config"

export function ProductInfo({ product, averageReview, reviewCount }) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary">{categoryOptionsMap[product.category] || product.category}</Badge>
          {product.brand && (
            <Badge variant="outline">{brandOptionsMap[product.brand] || product.brand}</Badge>
          )}
          {product.totalStock === 0 && (
            <Badge className="bg-red-500 hover:bg-red-600">Out Of Stock</Badge>
          )}
          {product.totalStock > 0 && product.totalStock < 10 && (
            <Badge className="bg-red-500 hover:bg-red-600">
              Only {product.totalStock} left
            </Badge>
          )}
          {product.salePrice > 0 && (
            <Badge className="bg-red-500 hover:bg-red-600">Sale</Badge>
          )}
        </div>
        <h1 className="text-3xl font-extrabold">{product.title}</h1>
        <p className="text-muted-foreground text-lg mt-4">{product.description}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p
            className={`text-3xl font-bold ${
              product.salePrice > 0 ? "line-through text-muted-foreground" : "text-primary"
            }`}
          >
            ${product.price}
          </p>
          {product.salePrice > 0 && (
            <p className="text-3xl font-bold text-primary">${product.salePrice}</p>
          )}
        </div>
        {product.salePrice > 0 && (
          <Badge variant="destructive" className="text-sm">
            Save ${product.price - product.salePrice}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <StarRatingComponent rating={averageReview} />
          <span className="text-muted-foreground">
            ({averageReview.toFixed(1)}) • {reviewCount} reviews
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${
            product.totalStock > 10
              ? "bg-green-500"
              : product.totalStock > 0
                ? "bg-yellow-500"
                : "bg-red-500"
          }`}
        />
        <span className="text-sm text-muted-foreground">
          {product.totalStock > 10
            ? "In Stock"
            : product.totalStock > 0
              ? `Only ${product.totalStock} left`
              : "Out of Stock"}
        </span>
      </div>
    </div>
  )
}