// src/pages/shopping-view/listing.jsx

import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

// Components
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import PageWrapper from "@/components/common/page-wrapper";
import ProductFilter from "@/components/shopping-view/filter";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";

// The BrandLogo component needs to be imported here
import { BrandLogo } from "@/components/shopping-view/header";

// State management
import { fetchCartItems, addToCart } from "@/store/shop/cart-slice";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import { useCartNotification } from "@/hooks/use-cart-notification";

// Helper function from Header component
function createSearchParamsHelper(filterParams) {
  const queryParams = [];
  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }
  return queryParams.join("&");
}

function ShoppingListing() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { productList } = useSelector((state) => state.shopProducts);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const { showCartNotification } = useCartNotification();
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  // Filter and sort state
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const categorySearchParam = searchParams.get("category");

  function handleFilter(getSectionId, getCurrentOption) {
    const cpyFilters = { ...filters };
    const filterSection = cpyFilters[getSectionId] ? [...cpyFilters[getSectionId]] : [];
    const indexOfCurrentOption = filterSection.indexOf(getCurrentOption);

    if (indexOfCurrentOption === -1) {
      filterSection.push(getCurrentOption);
    } else {
      filterSection.splice(indexOfCurrentOption, 1);
    }

    if (filterSection.length === 0) {
      delete cpyFilters[getSectionId];
    } else {
      cpyFilters[getSectionId] = filterSection;
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  function clearAllFilters() {
    setFilters({});
    sessionStorage.removeItem("filters");
    setSearchParams(new URLSearchParams(categorySearchParam ? `?category=${categorySearchParam}` : ''));
  }

  function handleSort(value) {
    setSort(value);
  }

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [categorySearchParam]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    } else {
      setSearchParams(new URLSearchParams(categorySearchParam ? `?category=${categorySearchParam}` : ''));
    }
  }, [filters, setSearchParams, categorySearchParam]);

  useEffect(() => {
    if (filters !== null && sort !== null) {
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
      );
    }
  }, [dispatch, sort, filters]);

  function handleGetProductDetails(getCurrentProductId) {
    navigate(`/shop/product/${getCurrentProductId}`);
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];
    const productDetails = productList.find(product => product._id === getCurrentProductId);

    if (!user) {
      toast({
        title: "Please sign in to add items to your cart.",
        variant: "destructive",
      });
      return;
    }

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
        productDetails: productDetails,
        images: productDetails?.images || [],
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        showCartNotification(productDetails?.title || "Product");
        toast({
          title: "Added to cart!",
        });
      }
    });
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch, user?.id]);

  const filterProps = { filters, handleFilter, clearAllFilters, sort, handleSort };

  return (
    <PageWrapper message="Loading products...">
      <div className="flex flex-col lg:flex-row min-h-[80vh]">
        {/* Desktop Sidebar Filter */}
        {isDesktop && (
          <aside className="hidden lg:block w-72 shrink-0 border-r border-gray-200 p-6">
            <div className="sticky top-[150px] space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Filters</h2>
                <Button variant="link" onClick={clearAllFilters}>
                  Clear All
                </Button>
              </div>
              <ProductFilter {...filterProps} />
              <div className="text-sm text-muted-foreground font-medium">
                {productList?.length || 0} Products
              </div>
              
              {/* Added BrandLogo here */}
              <div className="pt-8 flex justify-center">
                <BrandLogo />
              </div>
              
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1">
          {/* Mobile Filter Button and Product Count */}
          {!isDesktop && (
            <div className="flex justify-between items-center px-4 py-4 border-b lg:border-none">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span className="font-medium">Filter</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full max-w-xs bg-white overflow-y-auto">
                  <div className="p-4">
                    <div className="flex items-center justify-between pb-4 border-b">
                      <h2 className="text-xl font-bold">Filters</h2>
                      <Button variant="ghost" onClick={clearAllFilters}>
                        Clear All
                      </Button>
                    </div>
                    <ProductFilter {...filterProps} />
                  </div>
                </SheetContent>
              </Sheet>
              <div className="text-sm text-muted-foreground font-medium">
                {productList?.length || 0} Products
              </div>
            </div>
          )}

          {/* Product Grid Container */}
          <div className="w-full px-4 md:px-6 pt-8 md:pt-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
              {productList?.map((productItem) => (
                <ShoppingProductTile
                  key={productItem._id}
                  handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </PageWrapper>
  );
}

export default ShoppingListing;