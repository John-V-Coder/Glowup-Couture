
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFeatureImages } from "@/store/common-slice";
import { Heart, Share2, Download, X, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import WhatsAppButton from "@/components/common/whatsApp";

function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [likes, setLikes] = useState({});
  const [likeTimers, setLikeTimers] = useState({});
  const dispatch = useDispatch();

  // Get featured images from Redux store
  const { featureImageList } = useSelector((state) => state.commonFeature) || {};

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
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

  // Handle like functionality
  const handleLike = (imageId, e) => {
    e.stopPropagation();
    
    if (likeTimers[imageId]) return;
    
    setLikes(prev => {
      const newLikes = {
        ...prev,
        [imageId]: (prev[imageId] || 0) + 1
      };
      localStorage.setItem('galleryLikes', JSON.stringify(newLikes));
      return newLikes;
    });
    
    setLikeTimers(prev => ({
      ...prev,
      [imageId]: setTimeout(() => {
        setLikeTimers(prev => {
          const newTimers = { ...prev };
          delete newTimers[imageId];
          return newTimers;
        });
      }, 3000)
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
        title: 'GlowUp Couture Collection',
        text: 'Check out this stunning piece from GlowUp Couture',
        url: imageUrl,
      }).catch(() => {
        copyToClipboard(imageUrl);
      });
    } else {
      copyToClipboard(imageUrl);
    }
  };

  // Fallback share method
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Image link copied to clipboard!');
    }).catch(() => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        {/* Instagram-style loading */}
        <div className="container mx-auto px-1 py-4">
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-1">
            {[...Array(15)].map((_, index) => (
              <div
                key={index}
                className={`w-full mb-1 bg-gray-800 animate-pulse ${
                  Math.random() > 0.5 ? 'h-64' : Math.random() > 0.5 ? 'h-96' : 'h-80'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Instagram-style Header */}
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          
        </div>
      </div>

      <motion.section 
        className="py-1"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <div className="container mx-auto px-1">
          {featureImageList && featureImageList.length > 0 ? (
            /* Instagram-style Masonry Grid */
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-1">
              {featureImageList.map((image, index) => {
                const imageId = image._id || index;
                const imageUrl = image.image || image;
                const likeCount = likes[imageId] || 0;
                const isCooldown = likeTimers[imageId];
                
                return (
                  <motion.div
                    key={imageId}
                    variants={fadeInUp}
                    className="group cursor-pointer mb-1 relative overflow-hidden break-inside-avoid"
                    onClick={() => openImageModal(image)}
                  >
                    <div className="relative bg-black">
                      <img
                        src={imageUrl || '/placeholder-image.jpg'}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                      
                      {/* Instagram-style Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <div className="flex items-center gap-6 text-white">
                          <button
                            onClick={(e) => handleLike(imageId, e)}
                            disabled={isCooldown}
                            className="flex items-center gap-2 hover:scale-110 transition-transform"
                          >
                            <Heart 
                              className={`w-6 h-6 ${likeCount > 0 ? 'text-red-500 fill-red-500' : 'text-white'}`} 
                            />
                            <span className="font-medium">{likeCount || 0}</span>
                          </button>
                          
                          <button
                            onClick={(e) => handleShare(imageUrl, e)}
                            className="hover:scale-110 transition-transform"
                          >
                            <Share2 className="w-6 h-6 text-white" />
                          </button>
                          
                          <button
                            onClick={(e) => handleDownload(imageUrl, index, e)}
                            className="hover:scale-110 transition-transform"
                          >
                            <Download className="w-6 h-6 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <motion.div 
              className="flex flex-col items-center justify-center min-h-[60vh] text-center"
              variants={fadeInUp}
            >
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                <Camera className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-light text-white mb-4">No Images Yet</h3>
              <p className="text-gray-400 mb-8 max-w-md">
                Our curated collection is being prepared. Check back soon for stunning fashion imagery.
              </p>
              <Button
                className="bg-white text-black hover:bg-gray-100 px-8 py-3 rounded-full font-medium transition-all duration-300"
              >
                Explore Collections
              </Button>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Instagram-style Image Modal */}
      {selectedImage && (
        <motion.div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeImageModal}
        >
          <motion.div
            className="relative max-w-5xl max-h-[90vh] bg-black rounded-lg overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Image */}
            <img
              src={selectedImage.image || selectedImage || '/placeholder-image.jpg'}
              alt="Gallery image"
              className="w-full h-full object-contain max-h-[80vh]"
              onError={(e) => {
                e.target.src = '/placeholder-image.jpg';
              }}
            />
            
            {/* Bottom Actions */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-light text-white">GlowUp Couture</h3>
                <div className="flex gap-4">
                  <Button
                    onClick={(e) => handleDownload(selectedImage.image || selectedImage, 0, e)}
                    className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button 
                    onClick={(e) => handleShare(selectedImage.image || selectedImage, e)}
                    className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
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
  );
}

export default Gallery;
