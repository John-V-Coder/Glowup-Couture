import { ChevronLeftIcon, ChevronRightIcon, ShirtIcon, Shirt, UmbrellaIcon, Gem, Diamond, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { ProductCard } from "@/components/shopping-view/product-card";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import { useCartNotification } from "@/hooks/use-cart-notification";
import { getFeatureImages } from "@/store/common-slice";
import { Leaf, ShieldEllipsisIcon, SliceIcon, Flame, LineChart, VenusIcon } from "lucide-react";
import { BrandLogo } from "@/components/shopping-view/header";
import { MessageSquare } from "lucide-react";
import WhatsAppButton from "@/components/common/whatsApp";
import PageWrapper from "@/components/common/page-wrapper";

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
  const { toast } = useToast();

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
        toast({
          title: "Added to cart!",
          description: !user?.id ? "Sign in to sync your cart across devices" : ""
        });
      }
    });
  }

  const [recentlyViewedIds, setRecentlyViewedIds] = useState([]);

  useEffect(() => {
    try {
      const ids = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
      const unique = Array.from(new Set(ids));
      setRecentlyViewedIds(unique);
    } catch {}
  }, []);

  const recentlyViewedProducts = (recentlyViewedIds || [])
    .map((id) => productList?.find((p) => p._id === id))
    .filter(Boolean)
    .slice(0, 12);

  const latestArrivals = (productList || [])
    ?.slice()
    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    ?.slice(0, 16);

  const latestRef = useRef(null);

  useEffect(() => {
    const el = latestRef.current;
    if (!el || !latestArrivals?.length || latestArrivals.length <= 1) return;

    let rafId;
    const speed = 0.6; // pixels per frame (~36px/s @ 60fps)
    const halfWidth = () => el.scrollWidth / 2;

    const step = () => {
      if (el.scrollLeft >= halfWidth()) {
        // Seamless loop back to start of first set
        el.scrollLeft = 0;
      } else {
        el.scrollLeft += speed;
      }
      rafId = requestAnimationFrame(step);
    };

    el.scrollLeft = 0;
    rafId = requestAnimationFrame(step);

    const handleResize = () => {
      if (el.scrollLeft >= halfWidth()) el.scrollLeft = 0;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
    };
  }, [latestArrivals.length]);

  useEffect(() => {
    if (!featureImageList || featureImageList.length <= 1) return;
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
    <PageWrapper message="Loading home page...">
      {/* Full viewport container - no constraints */}
      <div className="w-full bg-white">
        {/* Hero Section - Full viewport height minus header */}
        <div className="relative w-full h-screen overflow-hidden">
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
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white bg-black/30 z-20 p-4">
                  <div className="scale-75 sm:scale-100 md:scale-125 lg:scale-150 transform transition-transform duration-500">
                    <BrandLogo />
                    <a
                      href="/shop/listing"
                      className="mt-6 px-4 py-2 text-base sm:px-6 sm:py-3 sm:text-lg bg-amber-600 text-white font-semibold rounded-full shadow-lg hover:bg-amber-700 transition-all block mx-auto"
                    >
                      Shop Now
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-amber-800 to-gray-900 flex items-center justify-center p-4">
              <div className="text-center text-white space-y-2 sm:space-y-4">
                <h1 className="text-3xl sm:text-5xl font-bold">Glowup Couture</h1>
                <p className="text-base sm:text-xl">Ready To Wear</p>
                <a
                  href="/shop/listing"
                  className="px-4 py-2 text-base sm:px-6 sm:py-3 bg-white text-amber-800 font-semibold rounded-full shadow-lg hover:bg-amber-200 transition-all inline-block mt-4"
                >
                  Shop Now
                </a>
              </div>
            </div>
          )}

          {/* Dots */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3 z-30">
            {featureImageList?.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${index === currentSlide ? "bg-amber-500" : "bg-white/50"}`}
              />
            ))}
          </div>
        </div>

        {/* Latest Arrivals - Horizontal Scroller */}
        <section className="py-12 sm:py-20 w-full bg-white">
          <div className="w-full px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
                Latest <span className="text-amber-600">Arrivals</span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-lg"></p>
            </div>

            <div className="relative">
              <div
                ref={latestRef}
                className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-2"
              >
                {[...latestArrivals, ...latestArrivals].map((product, idx) => (
                  <div key={`${product._id}-${idx}`} className="flex-none w-[180px] sm:w-[260px] md:w-[280px]">
                    <ShoppingProductTile
                      product={product}
                      handleGetProductDetails={handleGetProductDetails}
                      handleAddtoCart={handleAddtoCart}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Recently Viewed */}
        {recentlyViewedProducts.length > 0 && (
          <section className="py-12 sm:py-20 w-full bg-gradient-to-br from-gray-50 to-white">
            <div className="w-full px-4 sm:px-6">
              <div className="text-center mb-8 sm:mb-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
                  Popular <span className="text-amber-700">Items</span>
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {recentlyViewedProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onClick={handleGetProductDetails}
                    handleAddToCart={handleAddtoCart}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Featured Pieces */}
        <section className="py-12 sm:py-20 w-full bg-white">
          <div className="w-full px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
                Featured <span className="text-amber-600">Pieces</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
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
    </PageWrapper>
  );
}

export default ShoppingHome;