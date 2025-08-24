import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { fetchFilteredProducts } from "@/store/shop/products-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import { useCartNotification } from "@/hooks/use-cart-notification";
import PageWrapper from "@/components/common/page-wrapper";

function SalePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { showCartNotification } = useCartNotification();

  const { productList = [], isLoading: productsLoading } = useSelector((state) => state.shopProducts || {});
  const { user } = useSelector((state) => state.auth || {});

  useEffect(() => {
    // Ensure products and cart are available
    dispatch(fetchFilteredProducts({ filterParams: {}, sortParams: "price-lowtohigh" }));
    if (user?.id) dispatch(fetchCartItems(user.id));
  }, [dispatch, user?.id]);

  const saleProducts = useMemo(() => {
    const list = Array.isArray(productList) ? productList : [];
    return list
      .filter((p) => Number(p?.salePrice) > 0 && Number(p?.price) > Number(p?.salePrice))
      .map((p) => ({
        ...p,
        _discount: p?.price > 0 ? (p.price - p.salePrice) / p.price : 0,
      }))
      .sort((a, b) => b._discount - a._discount);
  }, [productList]);

  function handleGetProductDetails(productId) {
    navigate(`/shop/product/${productId}`);
  }

  function handleAddtoCart(productId) {
    const productDetails = productList.find((product) => product._id === productId);
    if (!productDetails) return;

    dispatch(
      addToCart({
        userId: user?.id,
        productId,
        quantity: 1,
        productDetails: {
          title: productDetails.title,
          image: productDetails.image,
          images: productDetails.images || [],
          price: productDetails.price,
          salePrice: productDetails.salePrice,
          category: productDetails.category,
        },
        images: productDetails?.images || [],
      })
    ).then((action) => {
      if (action?.payload?.success) {
        if (user?.id) dispatch(fetchCartItems(user.id));
        showCartNotification(productDetails?.title || "Product");
        toast({
          title: "Added to cart!",
          description: !user?.id ? "Sign in to sync your cart across devices" : "",
        });
      }
    });
  }

  return (
    <PageWrapper message="Loading sale items...">
    <div className="min-h-screen w-full bg-white">
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">On Sale</h1>
          <p className="text-gray-600 mt-2">
            {productsLoading ? "Loading deals..." : `${saleProducts.length} item${saleProducts.length === 1 ? "" : "s"} on offer`}
          </p>
        </div>

        {saleProducts.length === 0 && !productsLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center text-gray-600">
              <p className="text-lg font-medium">No items are currently on sale.</p>
              <p className="text-sm mt-1">Please check back later for new deals.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {saleProducts.map((product) => (
              <ShoppingProductTile
                key={product._id}
                product={product}
                handleGetProductDetails={handleGetProductDetails}
                handleAddtoCart={handleAddtoCart}
              />)
            )}
          </div>
        )}
      </div>
    </div>
    </PageWrapper>
  );
}

export default SalePage;
