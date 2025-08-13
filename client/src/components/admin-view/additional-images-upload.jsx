import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { UploadCloudIcon, XIcon, ImageIcon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import axios from "axios";

function AdditionalImagesUpload({
  additionalImages,
  setAdditionalImages,
  additionalImagesLoading,
  setAdditionalImagesLoading,
}) {
  const inputRef = useRef(null);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  function handleImageFileChange(event) {
    const selectedFiles = Array.from(event.target.files);
    
    selectedFiles.forEach((file, index) => {
      uploadImageToCloudinary(file, additionalImages.length + index);
    });
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    
    droppedFiles.forEach((file, index) => {
      uploadImageToCloudinary(file, additionalImages.length + index);
    });
  }

  function handleRemoveImage(indexToRemove) {
    setAdditionalImages(prev => prev.filter((_, index) => index !== indexToRemove));
  }

  async function uploadImageToCloudinary(file, targetIndex) {
    setAdditionalImagesLoading(true);
    setUploadingIndex(targetIndex);
    
    const data = new FormData();
    data.append("my_file", file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/products/upload-image`,
        data
      );
      
      if (response?.data?.success) {
        setAdditionalImages(prev => [...prev, response.data.result.url]);
      }
    } catch (error) {
      console.error("Error uploading additional image:", error);
    } finally {
      setAdditionalImagesLoading(false);
      setUploadingIndex(null);
    }
  }

  return (
    <div className="w-full mt-4">
      <Label className="text-lg font-semibold mb-2 block">
        Additional Images (Gallery)
      </Label>
      
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        <input
          type="file"
          ref={inputRef}
          onChange={handleImageFileChange}
          multiple
          accept="image/*"
          className="hidden"
        />
        
        {additionalImagesLoading ? (
          <div className="flex flex-col items-center">
            <Skeleton className="h-12 w-12 rounded-full mb-2" />
            <p className="text-sm text-gray-500">Uploading images...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <UploadCloudIcon className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-1">
              Click to upload or drag and drop additional images
            </p>
            <p className="text-xs text-gray-400">
              PNG, JPG, JPEG up to 10MB each
            </p>
          </div>
        )}
      </div>

      {/* Display Uploaded Images */}
      {additionalImages.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">
            Additional Images ({additionalImages.length})
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {additionalImages.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={imageUrl}
                    alt={`Additional image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(index);
                  }}
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <XIcon className="h-3 w-3" />
                </Button>
                <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 py-0.5 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdditionalImagesUpload;
