import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useState } from "react";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  const handleProductClick = (productId) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    handleGetProductDetails(productId);
  };

  // Prepare images: main + additional (if present)
  const productImages = [product?.image, ...(product?.images || [])].filter(Boolean);
  const primaryImage = productImages[0] || '/placeholder-image.jpg';
  const hoverImage = productImages[1] || primaryImage;

  const [showHover, setShowHover] = useState(false);
  
  const discountPercent =
    product?.salePrice > 0 && product?.price > 0
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  return (
    <div className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] w-full max-w-xs mx-auto">
      {/* Image container */}
      <div
        className="relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
        onClick={() => handleProductClick(product?._id)}
        onMouseEnter={() => productImages.length > 1 && setShowHover(true)}
        onMouseLeave={() => setShowHover(false)}
      >
        <img
          src={showHover ? hoverImage : primaryImage}
          alt={product?.title}
          className="w-full h-[360px] object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.currentTarget.src = '/placeholder-image.jpg'; }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

        {/* Status badges */}
        {product?.totalStock === 0 ? (
          <Badge className="absolute top-3 left-3 bg-red-500/90 text-white text-xs px-2 py-1">
            Out Of Stock
          </Badge>
        ) : product?.totalStock < 10 ? (
          <Badge className="absolute top-3 left-3 bg-orange-500/90 text-white text-xs px-2 py-1">
            {`Only ${product?.totalStock} left`}
          </Badge>
        ) : product?.salePrice > 0 ? (
          <Badge className="absolute top-3 left-3 bg-green-500/90 text-white text-xs px-2 py-1">
            Sale
          </Badge>
        ) : null}

        {discountPercent > 0 && (
          <Badge className="absolute top-3 right-3 bg-red-500/90 text-white text-[10px] px-2 py-1 rounded">
            {discountPercent}% OFF
          </Badge>
        )}

        {/* Add to Cart Button - Desktop Only */}
        <div className="absolute bottom-3 right-3 hidden md:block opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          {product?.totalStock === 0 ? (
            <Button
              size="sm"
              className="bg-gray-400 hover:bg-gray-400 cursor-not-allowed text-xs px-3 py-1 h-8 rounded-lg"
              disabled
            >
              Out Of Stock
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleAddtoCart(product?._id, product?.totalStock);
              }}
              className="bg-white hover:bg-gray-50 text-black border border-gray-200 text-xs font-semibold px-4 py-1 h-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              Add to Cart
            </Button>
          )}
        </div>
      </div>

      {/* Product details */}
      <div className="pt-3 px-1">
        <div onClick={() => handleProductClick(product?._id)}>
          <h2 className="text-base font-semibold mb-2 text-gray-900 leading-tight line-clamp-2">
            {product?.title}
          </h2>

          <div className="flex gap-2 mb-3 flex-wrap">
            <span className="text-xs text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded-md">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-xs text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded-md">
              {brandOptionsMap[product?.brand]}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {product?.salePrice > 0 ? (
              <>
                <span className="text-base font-semibold text-gray-900">
                  ${product?.salePrice}
                </span>
                <span className="text-xs text-gray-500 line-through">
                  ${product?.price}
                </span>
              </>
            ) : (
              <span className="text-base font-semibold text-gray-900">
                ${product?.price}
              </span>
            )}
          </div>
        </div>

        {/* Mobile Add to Cart Button */}
        <div className="mt-3 md:hidden">
          {product?.totalStock === 0 ? (
            <Button className="w-full bg-gray-400 cursor-not-allowed" disabled>
              Out Of Stock
            </Button>
          ) : (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleAddtoCart(product?._id, product?.totalStock);
              }}
              className="w-full bg-black text-white hover:bg-gray-800"
            >
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShoppingProductTile;