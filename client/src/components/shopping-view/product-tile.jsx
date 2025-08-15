import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  return (
    <div className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] w-full max-w-xs mx-auto">
      {/* Instagram-style image container - smaller frame */}
      <div 
        className="relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
        onClick={() => handleGetProductDetails(product?._id)}
      >
        <img
          src={product?.image}
          alt={product?.title}
          className="w-full h-[360px] object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
        
        {/* Status badges */}
        {product?.totalStock === 0 ? (
          <Badge className="absolute top-3 left-3 bg-red-500/90 backdrop-blur-sm hover:bg-red-600 border-0 text-white font-medium text-xs px-2 py-1">
            Out Of Stock
          </Badge>
        ) : product?.totalStock < 10 ? (
          <Badge className="absolute top-3 left-3 bg-orange-500/90 backdrop-blur-sm hover:bg-orange-600 border-0 text-white font-medium text-xs px-2 py-1">
            {`Only ${product?.totalStock} left`}
          </Badge>
        ) : product?.salePrice > 0 ? (
          <Badge className="absolute top-3 left-3 bg-green-500/90 backdrop-blur-sm hover:bg-green-600 border-0 text-white font-medium text-xs px-2 py-1">
            Sale
          </Badge>
        ) : null}

        {/* Strategic Add to Cart button - floating on image */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          {product?.totalStock === 0 ? (
            <Button 
              size="sm" 
              className="bg-gray-400 hover:bg-gray-400 cursor-not-allowed text-xs px-3 py-1 h-8 rounded-lg"
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
      
      {/* Content below the photo */}
      <div className="pt-3 px-1">
        <div 
          className="cursor-pointer"
          onClick={() => handleGetProductDetails(product?._id)}
        >
          {/* Product title */}
          <h2 className="text-lg font-bold mb-2 text-gray-900 leading-tight line-clamp-2">
            {product?.title}
          </h2>
          
          {/* Category and Brand tags */}
          <div className="flex gap-2 mb-3 flex-wrap">
            <span className="text-xs text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded-md">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-xs text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded-md">
              {brandOptionsMap[product?.brand]}
            </span>
          </div>

          {/* Price section */}
          <div className="flex items-center gap-2">
            {product?.salePrice > 0 ? (
              <>
                <span className="text-lg font-bold text-gray-900">
                  ${product?.salePrice}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ${product?.price}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                ${product?.price}
              </span>
            )}
          </div>
        </div>

        {/* Alternative Add to Cart - visible on mobile/always visible option */}
        <div className="mt-4 md:hidden">
          {product?.totalStock === 0 ? (
            <Button className="w-full h-10 bg-gray-400 hover:bg-gray-400 cursor-not-allowed rounded-lg font-semibold text-sm">
              Out Of Stock
            </Button>
          ) : (
            <Button
              onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
              className="w-full h-10 bg-black hover:bg-gray-800 text-white rounded-lg font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
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