"use client";

import { useState } from "react";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * A product card component for displaying a single product in a list or grid.
 *
 * @param {object} props
 * @param {object} props.product - The product data object.
 * @param {function} props.handleGetProductDetails - Callback to navigate to the product details page.
 * @param {function} props.handleAddtoCart - Callback to add the product to the cart.
 */
function ShoppingProductCard({ product, handleGetProductDetails, handleAddtoCart }) {
  const [showHover, setShowHover] = useState(false);

  // Determine the primary and hover images
  const galleryMainImage =
    product?.image ||
    product?.images?.[0] ||
    "https://placehold.co/360x360/E0E0E0/333333?text=Product+Image";
  const galleryAdditionalImages = Array.from(
    new Set((product?.images || []).filter((img) => img && img !== galleryMainImage))
  );
  const currentImage =
    showHover && galleryAdditionalImages.length > 0
      ? galleryAdditionalImages[0]
      : galleryMainImage;

  // Calculate discount percentage
  const discountPercent =
    product?.salePrice > 0 && product?.price > 0
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  // Event handlers
  const handleProductClick = () => {
    if (product?._id) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      handleGetProductDetails(product?._id);
    }
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation(); // Prevent card click event
    if (product?._id && product?.totalStock > 0) {
      handleAddtoCart(product?._id, product?.totalStock);
    }
  };

  return (
    <div className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] w-full max-w-xs mx-auto flex flex-col">
      {/* Image Container with Hover Effect */}
      <div
        className="relative overflow-hidden rounded-none shadow-none group-hover:shadow-md"
        onClick={handleProductClick}
        onMouseEnter={() => setShowHover(true)}
        onMouseLeave={() => setShowHover(false)}
      >
        <img
          src={currentImage}
          alt={product?.title || "Product image"}
          className="w-full h-[360px] object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/360x360/E0E0E0/333333?text=Product+Image";
            e.currentTarget.alt = "Placeholder image";
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

        {/* Product Status Badges */}
        {product?.totalStock === 0 ? (
          <Badge className="absolute top-3 left-3 bg-red-500/90 text-white text-xs px-2 py-1">
            Out Of Stock
          </Badge>
        ) : product?.totalStock < 2 ? (
          <Badge className="absolute top-3 left-3 bg-orange-500/90 text-white text-xs px-2 py-1">
            {`${product?.totalStock} left`}
          </Badge>
        ) : null}

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <Badge className="absolute top-3 right-3 bg-red-500/90 text-white text-[10px] px-2 py-1 rounded">
            {discountPercent}% OFF
          </Badge>
        )}

        {/* ADD TO CART Button on Hover */}
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
              onClick={handleAddToCartClick}
              className="bg-white hover:bg-gray-50 text-black border border-gray-200 text-xs font-semibold px-4 py-1 h-8 rounded-none shadow-md hover:shadow-lg transition-all duration-200"
            >
              ADD TO CART
            </Button>
          )}
        </div>
      </div>

      {/* Product Details Container */}
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
          onClick={handleProductClick}
          className="flex-1 cursor-pointer"
        >
          {/* Title */}
          <h2 className="text-base font-semibold mb-2 text-gray-900 leading-tight line-clamp-2 text-left group-hover:underline decoration-2 underline-offset-2">
            {product?.title}
          </h2>

          {/* Category and Brand (optional - uncomment if needed) */}
          {/* <div className="flex justify-between items-center mb-2 text-xs text-gray-500">
            <span>{categoryOptionsMap[product?.category]}</span>
            <span>{brandOptionsMap[product?.brand]}</span>
          </div> */}

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
  );
}

export default ShoppingProductCard;