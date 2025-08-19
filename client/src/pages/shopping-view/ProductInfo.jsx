import React from "react";
import { Badge } from "@/components/ui/badge";
import { StarRatingComponent } from "@/components/common/star-rating";
import { brandOptionsMap, categoryOptionsMap } from "@/config";

export function ProductInfo({ product, averageReview, reviewCount }) {
  const discountPercent =
    product?.salePrice > 0 && product?.price > 0
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  return (
    <div className="space-y-6 text-left"> {/* Aligned all content to the left */}
      {/* Product Title and Badges */}
      <div>
        <h1 className="text-3xl font-bold text-black underline decoration-2 decoration-black underline-offset-4 mb-3">
          {product.title}
        </h1>
        <div className="flex flex-wrap items-center justify-start gap-2"> {/* Justify-start for left alignment of badges */}
          <Badge variant="secondary">
            {categoryOptionsMap[product.category] || product.category}
          </Badge>
          {product.brand && (
            <Badge variant="outline">
              {brandOptionsMap[product.brand] || product.brand}
            </Badge>
          )}
          {product.totalStock === 0 && (
            <Badge className="bg-red-500 hover:bg-red-600">Out Of Stock</Badge>
          )}
          {product.totalStock > 0 && product.totalStock < 2 && (
            <Badge className="bg-red-500 hover:bg-red-600">
              {product.totalStock} left
            </Badge>
          )}
          {product.salePrice > 0 && (
            <Badge className="bg-red-500 hover:bg-red-600">Sale</Badge>
          )}
        </div>
      </div>

      {/* Description Title and Content */}
      <div className="space-y-2"> {/* Added a div to group description title and content */}
        <h3 className="text-xl font-semibold text-black">Description</h3> {/* New title for description */}
        <p className="text-black text-base leading-relaxed underline decoration-1 decoration-black">
          {product.description}
        </p>
      </div>

      {/* Pricing */}
      <div className="flex items-center justify-start gap-4"> {/* Justify-start for left alignment of pricing */}
        <p
          className={`text-3xl font-bold ${
            product.salePrice > 0
              ? "line-through text-black" // Original price is black with line-through
              : "text-blue-600" // If no sale, price is blue
          }`}
        >
          ${product.price}
        </p>
        {product.salePrice > 0 && (
          <p className="text-3xl font-bold text-blue-600">
            ${product.salePrice}
          </p>
        )}
        {product.salePrice > 0 && product.price > 0 && (
          <Badge variant="destructive" className="text-sm">
            {discountPercent}% OFF
          </Badge>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center justify-start gap-2"> {/* Justify-start for left alignment of stock status */}
        <div
          className={`w-3 h-3 rounded-full ${
            product.totalStock > 2
              ? "bg-green-500"
              : product.totalStock > 0
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
        />
        <span className="text-black text-sm">
          {product.totalStock > 2
            ? "In Stock"
            : product.totalStock > 0
            ? `${product.totalStock} left`
            : "Out of Stock"}
        </span>
      </div>

      {/* Ratings & Reviews */}
      <div className="flex items-center justify-start gap-2"> {/* Justify-start for left alignment of ratings */}
        <StarRatingComponent rating={averageReview} />
        <span className="text-black text-sm">
          ({averageReview.toFixed(1)}) • {reviewCount} reviews
        </span>
      </div>
    </div>
  );
}
