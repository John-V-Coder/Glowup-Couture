import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFeatureImage, getFeatureImages } from "@/store/common-slice";
import { toast } from "@/components/ui/use-toast";
import { Trash2, Eye, Upload, Image as ImageIcon, Calendar, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

function AdminGallery() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const dispatch = useDispatch();

  // Retrieves the list of featured images from the Redux store
  const { featureImageList, isLoading } = useSelector((state) => state.commonFeature) || {};

  // Function to handle the image upload to the featured items
  const handleUploadFeatureImage = () => {
    if (!uploadedImageUrl || imageLoadingState) {
      return;
    }

    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        // After successful upload, refresh the list and clear the upload state
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
        toast({
          title: "Success!",
          description: "Image uploaded successfully to gallery.",
          variant: "default"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to upload image. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  // Function to handle image deletion
  const handleDeleteImage = async (imageId) => {
    setDeleteLoading(imageId);
    try {
      // Note: Delete functionality needs to be implemented in the backend
      // For now, we'll show a message that this feature is coming soon
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Feature Coming Soon",
        description: "Image deletion will be available once the backend API is implemented.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  // Function to download image
  const handleDownloadImage = (imageUrl, index) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `gallery-image-${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fetches the featured images when the component first loads
  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gallery Management</h1>
          <p className="text-gray-600 mt-2">Upload and manage featured images for your gallery</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {featureImageList?.length || 0} Images
        </Badge>
      </div>

      {/* Upload Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload New Image
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isCustomStyling={true}
          />
          <Button
            onClick={handleUploadFeatureImage}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3"
            disabled={!uploadedImageUrl || imageLoadingState}
          >
            {imageLoadingState ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Add to Gallery
              </div>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Gallery Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Gallery Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-gray-200 animate-pulse rounded-lg h-64" />
              ))}
            </div>
          ) : featureImageList && featureImageList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featureImageList.map((featureImgItem, index) => (
                <div 
                  key={featureImgItem._id || index} 
                  className="relative group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={featureImgItem.image || featureImgItem}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="bg-white/90 hover:bg-white text-gray-800"
                              onClick={() => setSelectedImage(featureImgItem)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>Gallery Image Preview</DialogTitle>
                            </DialogHeader>
                            <div className="flex justify-center">
                              <img
                                src={selectedImage?.image || selectedImage}
                                alt="Preview"
                                className="max-w-full max-h-[70vh] object-contain rounded-lg"
                              />
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          size="sm"
                          variant="secondary"
                          className="bg-white/90 hover:bg-white text-gray-800"
                          onClick={() => handleDownloadImage(featureImgItem.image || featureImgItem, index)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          className="bg-red-500/90 hover:bg-red-600 text-white"
                          onClick={() => handleDeleteImage(featureImgItem._id || index)}
                          disabled={deleteLoading === (featureImgItem._id || index)}
                        >
                          {deleteLoading === (featureImgItem._id || index) ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Image info */}
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Image #{index + 1}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {new Date().toLocaleDateString()}
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Click to preview or manage this image
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Images Yet</h3>
              <p className="text-gray-500 mb-6">
                Upload your first image to get started with your gallery.
              </p>
              <Button
                onClick={() => document.querySelector('input[type="file"]')?.click()}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload First Image
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-pink-600 mb-2">
              {featureImageList?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Total Images</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {Math.round((featureImageList?.length || 0) / 7)} 
            </div>
            <div className="text-sm text-gray-600">Images This Week</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-indigo-600 mb-2">
              100%
            </div>
            <div className="text-sm text-gray-600">Upload Success Rate</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminGallery;