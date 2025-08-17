import { ChevronLeftIcon, ChevronRightIcon, ShirtIcon, Shirt, UmbrellaIcon, Gem, Diamond, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import { useCartNotification } from "@/hooks/use-cart-notification.jsx";
import { getFeatureImages } from "@/store/common-slice";
import { Leaf, ShieldEllipsisIcon, SliceIcon, Flame, LineChart, VenusIcon } from "lucide-react";
import { BrandLogo } from "@/components/shopping-view/header";

const categoriesWithIcon = [
  { id: "women", label: "Women's Collection", icon: ShirtIcon },
  { id: "men", label: "Men's Collection", icon: Shirt },
  { id: "kids", label: "Kids Wear", icon: Diamond },
  { id: "custom", label: "Modern Custom", icon: Gem },
];

const brandsWithIcon = [
  { id: "cotton", label: "Cotton", icon: Leaf },
  { id: "wool", label: "Wool", icon: ShieldEllipsisIcon },
  { id: "denim", label: "Denim", icon: Sparkles },
  { id: "polyester", label: "Polyester", icon: UmbrellaIcon },
  { id: "silk", label: "Silk", icon: SliceIcon },
  { id: "fleece", label: "Fleece", icon: Flame },
  { id: "linen", label: "Linen", icon: LineChart },
  { id: "viscose", label: "Viscose", icon: VenusIcon },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList } = useSelector((state) => state.shopProducts);
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showCartNotification } = useCartNotification();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = { [section]: [getCurrentItem.id] };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    navigate(`/shop/product/${getCurrentProductId}`);
  }

  function handleAddtoCart(getCurrentProductId) {
    const productDetails = productList.find((product) => product._id === getCurrentProductId);
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
        productDetails,
        images: productDetails?.images || [],
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
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
    dispatch(getFeatureImages());
    dispatch(fetchCartItems(user?.id));
  }, [dispatch, user?.id]);

  return (
    <div className="flex flex-col min-h-full w-full bg-white">
      {/* Hero Section */}
      <div className="relative w-full min-h-[80vh] md:min-h-[calc(100vh-5rem)] overflow-hidden">
  {featureImageList && featureImageList.length > 0 ? (
    featureImageList.map((slide, index) => (
      <div
        key={index}
        className={`${index === currentSlide ? "opacity-100" : "opacity-0"} absolute inset-0 transition-opacity duration-1000`}
      >
        {/* Background Blur Fill */}
        <div
          className="absolute inset-0 bg-center bg-cover scale-110 blur-2xl"
          style={{ backgroundImage: `url(${slide?.image})` }}
        ></div>

        {/* Foreground Image */}
        <img
          src={slide?.image}
          alt={`Featured look ${index + 1}`}
          className="relative w-full h-full object-contain mx-auto z-10"
        />

        {/* Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white bg-black/30 z-20">
          <div className="scale-100 md:scale-125 lg:scale-150">
  <BrandLogo />

          <a
            href="/shop/listing"
            className="px-6 py-3 bg-amber-600 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-amber-700 transition-all"
          >
            Shop Now
          </a>
          </div>
        </div>
      </div>
    ))
  ) : (
    <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-amber-800 to-gray-900 flex items-center justify-center">
      <div className="text-center text-white space-y-4">
        <h1 className="text-5xl font-bold">Glowup Couture</h1>
        <p className="text-xl">Ready To Wear</p>
        <a
          href="/shop/listing"
          className="px-6 py-3 bg-white text-amber-800 text-lg font-semibold rounded-full shadow-lg hover:bg-amber-200 transition-all"
        >
          Shop Now
        </a>
      </div>
    </div>
  )}

  {/* Dots */}
  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
    {featureImageList?.map((_, index) => (
      <button
        key={index}
        onClick={() => setCurrentSlide(index)}
        className={`w-3 h-3 rounded-full ${index === currentSlide ? "bg-amber-500" : "bg-white/50"}`}
      />
    ))}
  </div>
</div>


      {/* Shop by Collection */}
      <section className="py-20 w-full bg-white">
        <div className="w-full px-0">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Shop by <span className="text-amber-600">Collection</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 px-6">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                key={categoryItem.id}
                onClick={() => handleNavigateToListingPage(categoryItem, "category")}
                className="group cursor-pointer border border-amber-100 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 bg-white"
              >
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-50 to-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-amber-100">
                    <categoryItem.icon className="w-10 h-10 text-amber-600 group-hover:text-amber-800" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-amber-600">
                    {categoryItem.label}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Brand */}
      <section className="py-20 w-full bg-gradient-to-br from-amber-50 to-white">
        <div className="w-full px-0">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Shop by <span className="text-amber-800">Brand</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-6">
            {brandsWithIcon.map((brandItem) => (
              <Card
                key={brandItem.id}
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="group cursor-pointer border border-amber-100 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white"
              >
                <CardContent className="p-6 text-center space-y-3">
                  <div className="w-14 h-14 mx-auto bg-gradient-to-br from-amber-50 to-white rounded-lg flex items-center justify-center border border-amber-100">
                    <brandItem.icon className="w-7 h-7 text-amber-600 group-hover:text-amber-800" />
                  </div>
                  <span className="font-semibold text-sm text-gray-900 group-hover:text-amber-600">
                    {brandItem.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Pieces */}
      <section className="py-20 w-full bg-white">
        <div className="w-full px-0">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured <span className="text-amber-600">Pieces</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6">
            {productList?.slice(0, 8).map((productItem) => (
              <ShoppingProductTile
                key={productItem._id}
                handleGetProductDetails={handleGetProductDetails}
                product={productItem}
                handleAddtoCart={handleAddtoCart}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ShoppingHome;
