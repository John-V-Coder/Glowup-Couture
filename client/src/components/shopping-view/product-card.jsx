import { brandOptionsMap, categoryOptionsMap } from "@/config"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function ProductCard({ product, onClick }) {
  const [showHover, setShowHover] = useState(false)

  const handleProductClick = (productId) => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    if (onClick) onClick(productId)
  }

  // main image fallback
  const galleryMainImage =
    product?.image ||
    (product?.images?.[0] || "/placeholder.svg")

  // collect additional images (excluding main one)
  const galleryAdditionalImages = Array.from(
    new Set((product?.images || []).filter((img) => img && img !== galleryMainImage))
  )

  // swap image on hover
  const currentImage =
    showHover && galleryAdditionalImages.length > 0
      ? galleryAdditionalImages[0]
      : galleryMainImage

  const discountPercent =
    product?.salePrice > 0 && product?.price > 0
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0

  return (
    <div className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] w-full max-w-xs mx-auto flex flex-col">
      {/* Image container */}
      <div
        className="relative overflow-hidden rounded-none shadow-none group-hover:shadow-md"
        onClick={() => handleProductClick(product?._id)}
        onMouseEnter={() => setShowHover(true)}
        onMouseLeave={() => setShowHover(false)}
      >
        <img
          src={currentImage}
          alt={product?.title}
          className="w-full h-[360px] object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.currentTarget.src = '/placeholder-image.jpg'; }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

        {/* Stock/Sale Badges */}
        {product?.totalStock === 0 ? (
          <Badge className="absolute top-3 left-3 bg-red-500/90 text-white text-xs px-2 py-1">
            Out Of Stock
          </Badge>
        ) : product?.totalStock < 2 ? (
          <Badge className="absolute top-3 left-3 bg-orange-500/90 text-white text-xs px-2 py-1">
            {`${product?.totalStock} left`}
          </Badge>
        ) : null}

        {discountPercent > 0 && (
          <Badge className="absolute top-3 right-3 bg-red-500/90 text-white text-[10px] px-2 py-1 rounded">
            {discountPercent}% OFF
          </Badge>
        )}

        {/* SHOP NOW Button */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 md:block">
          {product?.totalStock === 0 ? (
            <Button
              size="sm"
              className="bg-gray-400 hover:bg-gray-400 cursor-not-allowed text-xs px-3 py-1 h-8 rounded-none"
              disabled
            >
              Out Of Stock
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleProductClick(product?._id);
              }}
              className="bg-white hover:bg-gray-50 text-black border border-gray-200 text-xs font-semibold px-4 py-1 h-8 rounded-none shadow-md hover:shadow-lg transition-all duration-200"
            >
              SHOP NOW
            </Button>
          )}
        </div>
      </div>

      {/* Product details container */}
      <div
        className="
          bg-transparent 
          rounded-none 
          shadow-none 
          px-4 py-3 flex-1 flex flex-col
          group-hover:bg-white group-hover:shadow-md group-hover:border group-hover:border-gray-200 
          transition-all duration-300
        "
      >
        <div
          onClick={() => handleProductClick(product?._id)}
          className="flex-1 cursor-pointer"
        >
          {/* Title */}
          <h2 className="text-base font-semibold mb-2 text-gray-900 leading-tight line-clamp-2 text-left group-hover:underline decoration-2 underline-offset-2">
            {product?.title}
          </h2>

          {/* Price */}
          <div className="flex items-center gap-2 mt-auto">
            {product?.salePrice > 0 ? (
              <>
                <span className="text-base font-semibold text-gray-900 group-hover:underline">
                  KES {product?.salePrice}
                </span>
                <span className="text-xs font-medium text-red-500 line-through">
                  KES {product?.price}
                </span>
              </>
            ) : (
              <span className="text-base font-semibold text-gray-900 group-hover:underline">
                KES {product?.price}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
