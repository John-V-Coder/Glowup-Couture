import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function ProductImageGallery({ mainImage, additionalImages = [], productTitle }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Debug logging
  console.log("ProductImageGallery - mainImage:", mainImage);
  console.log("ProductImageGallery - additionalImages:", additionalImages);
  console.log("ProductImageGallery - productTitle:", productTitle);
  
  // Combine main image with additional images
  const allImages = [mainImage, ...additionalImages].filter(Boolean);
  console.log("ProductImageGallery - allImages:", allImages);
  
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
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={mainImage}
          alt={productTitle}
          width={600}
          height={600}
          className="aspect-square w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative overflow-hidden rounded-lg group">
        <img
          src={allImages[currentImageIndex]}
          alt={`${productTitle} - Image ${currentImageIndex + 1}`}
          width={600}
          height={600}
          className="aspect-square w-full object-cover transition-transform duration-300"
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
              className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                index === currentImageIndex
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <img
                src={image}
                alt={`${productTitle} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductImageGallery;
