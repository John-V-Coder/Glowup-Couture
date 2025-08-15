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
import { useCartNotification } from "@/hooks/use-cart-notification.jsx";
import { getFeatureImages } from "@/store/common-slice";
import { Leaf } from "lucide-react";
import { ShieldEllipsisIcon } from "lucide-react";
import { SliceIcon } from "lucide-react";
import { Flame } from "lucide-react";
import { LineChart } from "lucide-react";
import { VenusIcon } from "lucide-react";
import { ProductFeatures } from "@/components/shopping-view/productfeatures";

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
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { showCartNotification } = useCartNotification();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    navigate(`/shop/product/${getCurrentProductId}`);
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
        // Show user-friendly cart notification with View Cart option
        showCartNotification(productDetails?.title || "Product");
      }
    });
  }


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
              ? productList.slice(0, 8).map((productItem) => (
                  <ShoppingProductTile
                    key={productItem._id}
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>


    </div>
  );
}

export default ShoppingHome;