import { useCallback, useRef, useState } from "react";
import { Label } from "../ui/label";
import { UploadCloudIcon, XIcon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import axios from "axios";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

/*
  ProductImageUpload (multi-image)
  Props:
    - uploadedImages: string[] (URLs)
    - setUploadedImages: (urls: string[]) => void
    - imagesLoading: boolean
    - setImagesLoading: (v: boolean) => void
    - isEditMode: boolean
    - isCustomStyling?: boolean

  Behavior:
    - Allows selecting/dragging multiple images (PNG/JPG/JPEG/WEBP)
    - Max 4 images total
    - Uploads sequentially to /api/admin/products/upload-image
    - Shows thumbnails grid with remove buttons
    - Allows adding more images even in edit mode (no disable)
*/

function ProductImageUpload({
  uploadedImages = [],
  setUploadedImages,
  imagesLoading,
  setImagesLoading,
  isEditMode,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  const MAX_IMAGES = 10;

  const validateFile = (file) => {
    const isValidType = /image\/(png|jpe?g|webp)/i.test(file.type);
    const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
    return isValidType && isValidSize;
  };

  const isRetryableError = (error) => {
    if (!error || !error.response) return true; // network error
    const status = error.response.status;
    return status >= 500 || status === 429 || status === 408; // server/timeout/rate
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const uploadSingle = async (file, attempt = 1) => {
    const data = new FormData();
    data.append("my_file", file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/products/upload-image`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000,
        }
      );

      if (response?.data?.success && response.data.result?.url) {
        return response.data.result.url;
      }
      throw new Error("Upload failed");
    } catch (error) {
      if (attempt < 3 && isRetryableError(error)) {
        await delay(500 * attempt);
        return uploadSingle(file, attempt + 1);
      }
      throw error;
    }
  };

  const handleFiles = useCallback(
    async (files) => {
      const remaining = MAX_IMAGES - uploadedImages.length;
      if (remaining <= 0) {
        alert(`Maximum of ${MAX_IMAGES} images uploaded`);
        return;
      }

      const toUpload = Array.from(files)
        .filter((f) => validateFile(f))
        .slice(0, remaining);

      if (toUpload.length === 0) return;

      setImagesLoading(true);
      try {
        for (let i = 0; i < toUpload.length; i++) {
          setUploadingIndex(uploadedImages.length + i);
          const url = await uploadSingle(toUpload[i]);
          setUploadedImages((prev) => [...prev, url]);
        }
      } finally {
        setUploadingIndex(null);
        setImagesLoading(false);
      }
    },
    [uploadedImages.length, setImagesLoading, setUploadedImages]
  );

  const handleImageFileChange = (event) => {
    const files = event.target.files || [];
    handleFiles(files);
    // reset input so the same file can be selected again
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files || [];
    handleFiles(files);
  };

  const handleRemoveImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <Label className="text-lg font-semibold mb-2 block">
        Upload Product Images (max {MAX_IMAGES})
      </Label>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer ${isEditMode ? "opacity-90" : ""}`}
        onClick={() => inputRef.current?.click()}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          accept="image/*"
          multiple
        />

        {imagesLoading ? (
          <div className="flex flex-col items-center">
            <Skeleton className="h-12 w-12 rounded-full mb-2" />
            <p className="text-sm text-gray-500">
              Uploading images... {uploadedImages.length}/{MAX_IMAGES}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span className="text-sm text-gray-600">
              Click to upload or drag & drop (PNG, JPG, JPEG, WEBP)
            </span>
            <span className="text-xs text-gray-400 mt-1">
              Up to {MAX_IMAGES} images, 10MB each
            </span>
          </div>
        )}
      </div>

      {uploadedImages.length >= MAX_IMAGES && (
        <p className="text-xs text-red-500 mt-2">Maximum of {MAX_IMAGES} images uploaded.</p>
      )}

      {uploadedImages.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">
            Images ({uploadedImages.length}/{MAX_IMAGES})
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {uploadedImages.map((url, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={url}
                    alt={`product-${index + 1}`}
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
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductImageUpload;
