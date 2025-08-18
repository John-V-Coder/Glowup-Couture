import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFeatureImages } from "@/store/common-slice";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera, Heart, Share2, Download, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBackground from "@/assets/images/tweeter-bg.jpg";
import { Phone } from "lucide-react";
import { MessageSquare } from "lucide-react";
import PageWrapper from "@/components/common/page-wrapper";

function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [likes, setLikes] = useState({});
  const [likeTimers, setLikeTimers] = useState({});
  const dispatch = useDispatch();

  // Get featured images from Redux store
  const { featureImageList } = useSelector((state) => state.commonFeature) || {};

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Initialize likes from localStorage
  useEffect(() => {
    const savedLikes = localStorage.getItem('galleryLikes');
    if (savedLikes) {
      setLikes(JSON.parse(savedLikes));
    }
  }, []);

  // Fetch images when component mounts
  useEffect(() => {
    dispatch(getFeatureImages()).then(() => {
      setIsLoading(false);
    });
  }, [dispatch]);

  // Handle image modal
  const openImageModal = (image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  // Handle like functionality with countdown
  const handleLike = (imageId, e) => {
    e.stopPropagation();
    
    // Prevent multiple likes during cooldown
    if (likeTimers[imageId]) return;
    
    // Update likes count
    setLikes(prev => {
      const newLikes = {
        ...prev,
        [imageId]: (prev[imageId] || 0) + 1
      };
      localStorage.setItem('galleryLikes', JSON.stringify(newLikes));
      return newLikes;
    });
    
    // Set cooldown timer (5 seconds)
    setLikeTimers(prev => ({
      ...prev,
      [imageId]: setTimeout(() => {
        setLikeTimers(prev => {
          const newTimers = { ...prev };
          delete newTimers[imageId];
          return newTimers;
        });
      }, 5000)
    }));
  };

  // Handle image download
  const handleDownload = (imageUrl, index, e) => {
    if (e) e.stopPropagation();
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `glowup-couture-${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle share functionality
  const handleShare = (imageUrl, e) => {
    if (e) e.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: 'Check out this beautiful image from GlowUp Couture',
        text: 'I found this stunning fashion image you might like',
        url: imageUrl,
      }).catch(err => {
        console.log('Error sharing:', err);
        // Fallback for when share is cancelled
        copyToClipboard(imageUrl);
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      copyToClipboard(imageUrl);
    }
  };

  // Fallback share method
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Image link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('Image link copied to clipboard!');
    });
  };

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      Object.values(likeTimers).forEach(timer => clearTimeout(timer));
    };
  }, [likeTimers]);

  return (
    <PageWrapper message="Loading gallery...">
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-cream-50">
      <motion.section 
        className="py-16 px-4"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            // Loading skeleton - adjusted for 3 columns
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="overflow-hidden border border-amber-100">
                  <CardContent className="p-0">
                    <Skeleton className="w-full h-96 bg-amber-100" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : featureImageList && featureImageList.length > 0 ? (
            // Adjusted grid for 3 columns with larger images
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featureImageList.map((image, index) => {
                const imageId = image._id || index;
                const imageUrl = image.image || image;
                const likeCount = likes[imageId] || 0;
                const isCooldown = likeTimers[imageId];
                
                return (
                  <motion.div
                    key={imageId}
                    variants={fadeInUp}
                    className="group cursor-pointer"
                    onClick={() => openImageModal(image)}
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border border-amber-100 h-full">
                      <CardContent className="p-0 relative h-full">
                        <img
                          src={imageUrl || '/placeholder-image.jpg'}
                          alt={`Gallery image ${index + 1}`}
                          className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            console.log('Image load error:', e.target.src);
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                            <span className="text-cream-50 font-semibold">
                              Style #{index + 1}
                            </span>
                            <div className="flex gap-3">
                              <button
                                onClick={(e) => handleShare(imageUrl, e)}
                                className="p-2 bg-amber-100/20 backdrop-blur-sm rounded-full hover:bg-amber-100/30 transition-colors"
                                aria-label="Share image"
                              >
                                <Share2 className="w-4 h-4 text-cream-50" />
                              </button>
                              <button
                                onClick={(e) => handleDownload(imageUrl, index, e)}
                                className="p-2 bg-amber-100/20 backdrop-blur-sm rounded-full hover:bg-amber-100/30 transition-colors"
                                aria-label="Download image"
                              >
                                <Download className="w-4 h-4 text-cream-50" />
                              </button>
                              <button
                                onClick={(e) => handleLike(imageId, e)}
                                disabled={isCooldown}
                                className={`p-2 ${isCooldown ? 'bg-amber-100/10' : 'bg-amber-100/20'} backdrop-blur-sm rounded-full hover:bg-amber-100/30 transition-colors relative`}
                                aria-label="Like image"
                              >
                                <Heart className={`w-4 h-4 ${likeCount > 0 ? 'text-rose-500 fill-rose-500' : 'text-cream-50'}`} />
                                {likeCount > 0 && (
                                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                    {likeCount}
                                  </span>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            // Empty state
            <motion.div 
              className="text-center py-20"
              variants={fadeInUp}
            >
              <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="w-12 h-12 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-amber-800 mb-4">Curating Excellence</h3>
              <p className="text-amber-700 mb-8">
                Our golden collection is being prepared with meticulous attention
              </p>
              <Button
                className="bg-gradient-to-r from-amber-600 to-amber-700 text-cream-50 px-8 py-4 rounded-full hover:shadow-lg transition-all duration-300"
              >
                Discover Collections
              </Button>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Image Modal */}
      {selectedImage && (
        <motion.div
          className="fixed inset-0 bg-amber-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeImageModal}
        >
          <motion.div
            className="relative max-w-4xl max-h-[90vh] bg-cream-50 rounded-2xl overflow-hidden border-2 border-amber-100 shadow-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 z-10 p-2 bg-amber-600/20 backdrop-blur-sm rounded-full text-amber-800 hover:bg-amber-600/30 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedImage.image || selectedImage || '/placeholder-image.jpg'}
              alt="Gallery image"
              className="w-full h-full object-contain max-h-[80vh]"
              onError={(e) => {
                e.target.src = '/placeholder-image.jpg';
              }}
            />
            <div className="p-6 bg-cream-50 border-t border-amber-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-amber-900">Golden Collection</h3>
                <div className="flex gap-3">
                  <Button
                    onClick={(e) => handleDownload(selectedImage.image || selectedImage, 0, e)}
                    className="bg-gradient-to-r from-amber-600 to-amber-700 text-cream-50 hover:from-amber-700 hover:to-amber-800"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-amber-600 text-amber-600 hover:bg-amber-50"
                    onClick={(e) => handleShare(selectedImage.image || selectedImage, e)}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
    </PageWrapper>
  );
}

export default Gallery;