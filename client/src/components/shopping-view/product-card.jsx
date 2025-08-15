import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StarRatingComponent } from "../common/star-rating"
import { brandOptionsMap, categoryOptionsMap } from "@/config"

export function ProductCard({ product, onClick, handleAddToCart }) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div onClick={onClick} className="cursor-pointer">
        <div className="relative">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
          {product.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Out Of Stock
            </Badge>
          ) : product.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              {`Only ${product.totalStock} items left`}
            </Badge>
          ) : product.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2 line-clamp-2">{product.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[16px] text-muted-foreground">
              {categoryOptionsMap[product?.category] || product?.category}
            </span>
            {product.brand && (
              <span className="text-[16px] text-muted-foreground">
                {brandOptionsMap[product?.brand] || product?.brand}
              </span>
            )}
          </div>
          {product.rating && (
            <div className="flex items-center gap-2 mb-2">
              <StarRatingComponent rating={product.rating} size="w-3 h-3" />
              <span className="text-sm text-muted-foreground">({product.rating})</span>
            </div>
          )}
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              ${product.price}
            </span>
            {product.salePrice > 0 && (
              <span className="text-lg font-semibold text-primary">
                ${product.salePrice}
              </span>
            )}
          </div>
        </CardContent>
      </div>
      {handleAddToCart && (
        <CardFooter>
          {product.totalStock === 0 ? (
            <Button className="w-full opacity-60 cursor-not-allowed" disabled>
              Out Of Stock
            </Button>
          ) : (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(product._id, product.totalStock);
              }}
              className="w-full"
            >
              Add to cart
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
