import { ChevronLeftIcon, ChevronRightIcon, ShirtIcon, Shirt, UmbrellaIcon, Gem, Diamond, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import { Leaf } from "lucide-react";
import { ShieldEllipsisIcon } from "lucide-react";
import { SliceIcon } from "lucide-react";
import { Flame } from "lucide-react";
import { LineChart } from "lucide-react";
import { VenusIcon } from "lucide-react";
import { MessageCircle, Instagram, Facebook } from "lucide-react";

const categoriesWithIcon = [
  { id: "women", label: "Women's Collection", icon: ShirtIcon },
  { id: "men", label: "Men's Collection", icon: Shirt },
  { id: "kids", label: "kids Wear", icon: Diamond },
  { id: "custom", label: "Modern Custom", icon: Gem },
];

const brandsWithIcon = [
  { id: "cotton", label: "Cotton", icon: Leaf },
  { id: "wool", label: "Wool", icon: ShieldEllipsisIcon },
  { id: "denim", label: "Denim", icon: Sparkles },
  { id: "polyester", label: "Polyester", icon: UmbrellaIcon},
  { id: "silk", label: "Silk", icon: SliceIcon },
  { id: "fleece", label: "Fleece", icon: Flame },
  { id: "linen", label: "Linen", icon: LineChart },
  { id: "viscose", label: "Viscose", icon: VenusIcon }
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector((state) => state.shopProducts);
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    const productDetails = productList.find(product => product._id === getCurrentProductId);
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
        productDetails: productDetails,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 15000);
    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: "price-lowtohigh" }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch, user?.id]);

  return (
    <div className="flex flex-col min-h-screen bg-white">


      {/* Hero Section */}
      <div className="relative w-full h-[70vh] overflow-hidden bg-gradient-to-br from-amber-50 to-white">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
              <div
                key={index}
                className={`${index === currentSlide ? "opacity-100" : "opacity-0"} absolute inset-0 transition-opacity duration-1000`}
              >
                <img src={slide?.image} alt={`Featured look ${index + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-center justify-center">
                  {index === currentSlide && (
                    <div className="text-center text-white space-y-4 px-4">
                      <h1 className="text-5xl font-bold">Aurum Luxe</h1>
                      <p className="text-xl">Where Gold Meets Elegance</p>
                      <Button onClick={() => navigate("/shop/home")} className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-full text-lg shadow-lg">
                        Discover Luxury
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          : (
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-amber-800 to-gray-900 flex items-center justify-center">
              <div className="text-center text-white space-y-4">
                <h1 className="text-5xl font-bold">Glowup Couture</h1>
                <p className="text-xl">Ready To Wear</p>
              </div>
            </div>
          )}

        <Button variant="outline" size="icon"
          onClick={() => setCurrentSlide((prevSlide) => (prevSlide - 1 + featureImageList.length) % featureImageList.length)}
          className="absolute top-1/2 left-6 transform -translate-y-1/2 bg-white/90 hover:bg-white border-0 shadow-lg w-12 h-12"
        >
          <ChevronLeftIcon className="w-6 h-6 text-amber-800" />
        </Button>
        <Button variant="outline" size="icon"
          onClick={() => setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length)}
          className="absolute top-1/2 right-6 transform -translate-y-1/2 bg-white/90 hover:bg-white border-0 shadow-lg w-12 h-12"
        >
          <ChevronRightIcon className="w-6 h-6 text-amber-800" />
        </Button>

        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {featureImageList?.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-amber-500' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </div>

      {/* Shop by Collection */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by <span className="text-amber-600">Collection</span></h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-gray-300 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore our golden collections, where luxury meets contemporary design for the discerning individual.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {categoriesWithIcon.map((categoryItem) => (
              <Card key={categoryItem.id} onClick={() => handleNavigateToListingPage(categoryItem, "category")}
                className="group cursor-pointer border border-amber-100 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 bg-white"
              >
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-50 to-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-amber-100">
                    <categoryItem.icon className="w-10 h-10 text-amber-600 group-hover:text-amber-800 transition-colors duration-300" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-amber-600 transition-colors duration-300">
                    {categoryItem.label}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Brand */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by <span className="text-amber-800">Brand</span></h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-800 to-amber-400 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our exclusive golden lines, each delivering unparalleled luxury and craftsmanship.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {brandsWithIcon.map((brandItem) => (
              <Card key={brandItem.id} onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="group cursor-pointer border border-amber-100 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white"
              >
                <CardContent className="p-6 text-center space-y-3">
                  <div className="w-14 h-14 mx-auto bg-gradient-to-br from-amber-50 to-white rounded-lg flex items-center justify-center group-hover:from-amber-100 group-hover:to-white transition-all duration-300 border border-amber-100">
                    <brandItem.icon className="w-7 h-7 text-amber-600 group-hover:text-amber-800 transition-colors duration-300" />
                  </div>
                  <span className="font-semibold text-sm text-gray-900 group-hover:text-amber-600 transition-colors duration-300">
                    {brandItem.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section - Updated with refined color algorithm */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-amber-25">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Style <span className="text-amber-600">Gallery</span></h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-amber-300 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our latest designs and customer transformations. See how our luxury pieces bring elegance to life.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Featured collection */}
            <div className="md:col-span-2 lg:col-span-3 group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500">
              <div className="relative h-64 lg:h-96 bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
                <div className="text-center text-amber-800 p-8">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Golden Moments Collection</h3>
                  <p className="text-lg max-w-2xl mx-auto">Explore our signature pieces that capture the essence of luxury</p>
                </div>
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button 
                    className="bg-white/90 text-amber-800 hover:bg-white hover:text-amber-900 px-8 py-4 text-lg"
                    onClick={() => navigate("/shop/listing")}
                  >
                    View Collection
                  </Button>
                </div>
              </div>
            </div>

            {/* Gallery items with consistent amber tones */}
            {[
              { 
                title: "Women's Elegance", 
                icon: ShirtIcon, 
                description: "Timeless pieces for the modern woman",
                bg: "from-amber-50 to-amber-100"
              },
              { 
                title: "Men's Collection", 
                icon: Shirt, 
                description: "Sophisticated styles for gentlemen",
                bg: "from-amber-100 to-amber-200"
              },
              { 
                title: "Custom Creations", 
                icon: Gem, 
                description: "Bespoke designs just for you",
                bg: "from-amber-200 to-amber-300"
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className={`group cursor-pointer overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br ${item.bg}`}
              >
                <div className="p-8 h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 mb-6 bg-amber-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-amber-900 mb-3">{item.title}</h4>
                  <p className="text-amber-800 mb-6">{item.description}</p>
                  <Button 
                    variant="outline" 
                    className="border-amber-700 text-amber-700 hover:bg-amber-700 hover:text-white"
                    onClick={() => handleNavigateToListingPage({id: item.title.toLowerCase().replace("'s", "")}, "category")}
                  >
                    Explore
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Gallery CTA */}
          <div className="text-center">
            <div className="inline-flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => navigate("/shop/listing")}
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-8 py-4 rounded-full text-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                Browse Full Gallery
              </Button>
              <Button 
                variant="outline"
                className="border-amber-600 text-amber-600 hover:bg-amber-50 hover:border-amber-700 px-8 py-4 rounded-full text-lg transition-all duration-300"
                onClick={() => {
                  const message = encodeURIComponent("Hi Aurum Luxe! I'd like to see more of your custom designs.");
                  window.open(`https://wa.me/254714198559?text=${message}`, '_blank');
                }}
              >
                Request Custom Designs
              </Button>
            </div>
            <p className="mt-4 text-amber-700 max-w-2xl mx-auto">
              Our design team is ready to bring your vision to life. Contact us for personalized consultations.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Pieces */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured <span className="text-amber-600">Pieces</span></h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-gray-300 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our most exquisite pieces — crafted with premium materials and golden accents for the ultimate luxury experience.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <div key={productItem.id} className="group">
                    <ShoppingProductTile
                      handleGetProductDetails={handleGetProductDetails}
                      product={productItem}
                      handleAddtoCart={handleAddtoCart}
                    />
                  </div>
                ))
              : Array.from({ length: 8 }).map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                      <div className="bg-gray-200 h-4 rounded mb-2"></div>
                      <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex justify-center space-x-6 mb-4">
            <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors"><i className="fab fa-twitter"></i></a>
            <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors"><i className="fab fa-instagram"></i></a>
            <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Aurum Luxe. All rights reserved.</p>
            <p>Designed by <span className="text-amber-400 font-medium">Golden Thread Designs</span></p>
          </div>
        </div>
      </footer>

      <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />
    </div>
  );
}

export default ShoppingHome;