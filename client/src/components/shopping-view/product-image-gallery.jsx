import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function ProductImageGallery({ mainImage, additionalImages = [], productTitle }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Combine main image with additional images and filter out null/undefined
  const allImages = [mainImage, ...additionalImages].filter(image => image && image.trim() !== '');
  
  // Handle image loading
  const handleImageLoad = () => {
    setIsLoading(false);
  };
  
  const handleImageError = (e) => {
    console.warn("Failed to load image:", e.target.src);
    setIsLoading(false);
  };
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };
  
  const selectImage = (index) => {
    setCurrentImageIndex(index);
  };

  // If only one image, show simple display
  if (allImages.length <= 1) {
    return (
      <div className="relative overflow-hidden rounded-lg bg-gray-100">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse aspect-square"></div>
        )}
        <img
          src={mainImage || '/placeholder-image.jpg'}
          alt={productTitle || 'Product image'}
          width={600}
          height={600}
          className="aspect-square w-full object-cover transition-opacity duration-300"
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ opacity: isLoading ? 0 : 1 }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative overflow-hidden rounded-lg group bg-gray-100">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse aspect-square flex items-center justify-center">
            <div className="text-gray-400">Loading...</div>
          </div>
        )}
        <img
          src={allImages[currentImageIndex] || '/placeholder-image.jpg'}
          alt={`${productTitle || 'Product'} - Image ${currentImageIndex + 1}`}
          width={600}
          height={600}
          className="aspect-square w-full object-cover transition-all duration-300 group-hover:scale-105"
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ opacity: isLoading ? 0 : 1 }}
        />
        
        {/* Navigation Arrows - Only show if more than 1 image */}
        {allImages.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 hover:bg-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 hover:bg-white"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
        
        {/* Image Counter */}
        {allImages.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {currentImageIndex + 1} / {allImages.length}
          </div>
        )}
      </div>
      
      {/* Thumbnail Navigation */}
      {allImages.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => selectImage(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:shadow-md ${
                index === currentImageIndex
                  ? "border-amber-500 ring-2 ring-amber-200 shadow-lg"
                  : "border-gray-200 hover:border-amber-300"
              }`}
            >
              <img
                src={image || '/placeholder-image.jpg'}
                alt={`${productTitle || 'Product'} thumbnail ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-200 hover:scale-110"
                onError={(e) => {
                  e.target.src = '/placeholder-image.jpg';
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductImageGallery;
