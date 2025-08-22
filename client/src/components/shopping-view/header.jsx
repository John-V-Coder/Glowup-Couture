import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDispatch, useSelector } from "react-redux";
import { resetTokenAndCredentials } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { ScrollingPromoBar, ContactBar } from "./adds";
import ErrorBoundary from "./error-boundary";
import { Flame, User, LogIn, Search, Gift, Menu, ShoppingCart, SlidersHorizontal } from "lucide-react";
import ProductFilter from "@/components/shopping-view/filter";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import { useMediaQuery } from 'react-responsive';

const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    path: "/shop/home",
    label: "HOME",
  },
  {
    id: "collections",
    label: "COLLECTIONS",
    dropdown: [
      { id: "products", path: "/shop/listing?category=products", label: "All Products" },
      { id: "women", label: "Women's Collection", path: "/shop/listing?category=women" },
      { id: "men", label: "Men's Collection", path: "/shop/listing?category=men" },
      { id: "kids", label: "Kids Wear", path: "/shop/listing?category=kids" },
      { id: "custom", label: "Modern Custom", path: "/shop/listing?category=custom" },
      {
        id: "sale",
        path: "/shop/listing?category=sale",
        label: "Sale",
      },
    ],
  },
  {
    id: "gallery",
    path: "/shop/gallery",
    label: "GALLERY",
  },
  {
    id: "about",
    path: "/shop/about",
    label: "ABOUT US",
  },
  {
    id: "search",
    path: "/shop/search",
    label: "SEARCH",
    icon: <Search className="w-4 h-4" />,
    iconOnly: true,
  },
];

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

const CollectionDropdown = ({ menuItem, handleNavigate }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative cursor-pointer">
          <Label className="font-medium cursor-pointer text-black hover:text-gray-800 text-sm">
            {menuItem.label}
          </Label>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-72 border border-gray-200 rounded-lg bg-white p-2"
        align="start"
        sideOffset={8}
      >
        <div className="grid gap-1">
          {menuItem.dropdown.map((subItem) => (
            <DropdownMenuItem
              key={subItem.id}
              onClick={() => handleNavigate(subItem)}
              className="p-3 rounded-md hover:bg-gray-100 cursor-pointer"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="flex-1">
                  <div className="font-medium text-black">
                    {subItem.label}
                  </div>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const MenuItems = ({ onItemClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleNavigate = (getCurrentMenuItem) => {
    if (getCurrentMenuItem.id === "search") {
      navigate("/shop/search");
      onItemClick?.();
      return;
    }

    sessionStorage.removeItem("filters");

    const currentFilter =
      getCurrentMenuItem.id === "home" ||
      getCurrentMenuItem.id === "products" ||
      getCurrentMenuItem.id === "search" ||
      getCurrentMenuItem.id === "gallery" ||
      getCurrentMenuItem.id === "about" ||
      getCurrentMenuItem.id === "sale"
        ? null
        : { category: [getCurrentMenuItem.id] };

    if (currentFilter) {
      sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    }

    if (location.pathname.includes("listing") && currentFilter !== null) {
      setSearchParams(new URLSearchParams(`?category=${getCurrentMenuItem.id}`));
    } else {
      navigate(getCurrentMenuItem.path);
    }

    onItemClick?.();
  };

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <div key={menuItem.id} className="relative">
          <ErrorBoundary>
            {menuItem.dropdown ? (
              <CollectionDropdown
                menuItem={menuItem}
                handleNavigate={handleNavigate}
              />
            ) : menuItem.buttonStyle ? (
              <Button
                onClick={() => handleNavigate(menuItem)}
                variant={menuItem.destructive ? "destructive" : "default"}
                size="default"
                className="flex items-center gap-2 relative"
              >
                {menuItem.icon}
                {menuItem.label}
                {menuItem.badge && (
                  <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs font-bold bg-white text-red-600 rounded-full border border-red-200">
                    {menuItem.badge}
                  </span>
                )}
              </Button>
            ) : menuItem.iconOnly ? (
              <Button
                onClick={() => handleNavigate(menuItem)}
                variant="ghost"
                size="default"
                className="p-2 hover:bg-gray-100 text-black hover:text-gray-800"
                title={menuItem.label}
              >
                {menuItem.icon}
              </Button>
            ) : (
              <Label
                onClick={() => handleNavigate(menuItem)}
                className={`font-medium cursor-pointer text-sm ${
                  location.pathname === menuItem.path ||
                  (menuItem.id === "search" && location.pathname.includes("search")) ||
                  (menuItem.id === "products" && location.pathname.includes("listing")) ||
                  (menuItem.id === "gift-card" && location.pathname.includes("gift-card"))
                    ? "text-black font-bold"
                    : "text-black hover:text-gray-800"
                }`}
              >
                {menuItem.label}
              </Label>
            )}
          </ErrorBoundary>
        </div>
      ))}
    </nav>
  );
};

export const BrandLogo = () => {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&display=swap"
        rel="stylesheet"
      />
      <Link
        to="/shop/home"
        className="flex flex-col items-center justify-center text-center cursor-pointer"
      >
        <div
          className="leading-tight text-center"
          style={{
            fontFamily: "'Playfair Display', serif",
          }}
        >
          <div className="font-extrabold bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 bg-clip-text text-transparent text-lg md:text-xl tracking-wide">
            GLOW
          </div>
          <div className="font-extrabold bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 bg-clip-text text-transparent text-lg md:text-xl tracking-wide">
            COUTURE
          </div>
        </div>
        <div className="relative mt-1 w-20 md:w-28">
          <svg
            viewBox="0 0 300 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 40 C80 60, 220 20, 300 40"
              stroke="url(#grad1)"
              strokeWidth="4"
              fill="transparent"
            />
            <path
              d="M0 50 C80 70, 220 30, 300 50"
              strokeWidth="2"
              fill="transparent"
            />
            <defs>
              <linearGradient id="grad1" x1="0" x2="300" y1="0" y2="0">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </Link>
    </>
  );
};

const AuthButton = ({ onAuthSuccess }) => {
  const navigate = useNavigate();
  const handleAuthClick = () => {
    navigate("/auth");
  };

  return (
    <Button
      onClick={handleAuthClick}
      variant="ghost"
      size="default"
      className="p-2 hover:bg-gray-100 text-black hover:text-gray-800"
    >
      <User className="w-5 h-5" />
      <span className="sr-only">Account</span>
    </Button>
  );
};

const HeaderRightContent = ({ isMobile = false }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  const handleLogout = () => {
    dispatch(resetTokenAndCredentials());
    sessionStorage.clear();
    navigate("/shop/home");
  };

  const handleAuthSuccess = (user) => {
    if (user?.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/shop/home");
    }
  };

  return (
    <div className="flex items-center gap-2">
      {isAuthenticated ? (
        <UserDropdown user={user} onLogout={handleLogout} />
      ) : (
        <AuthButton onAuthSuccess={handleAuthSuccess} />
      )}
      
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="ghost"
          size="default"
          className="p-2 hover:bg-gray-100 text-black hover:text-gray-800"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="sr-only">Cart</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems?.items || []}
        />
      </Sheet>
    </div>
  );
};

const UserDropdown = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer">
          <Avatar className="bg-gray-100 border border-gray-200 w-10 h-10">
            <AvatarFallback className="bg-transparent text-black">
              {user?.userName?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="right"
        className="w-64 border border-gray-200 rounded-lg bg-white p-2"
        sideOffset={8}
      >
        <div className="p-4 bg-gray-50 rounded-lg mb-2">
          <DropdownMenuLabel className="text-black font-semibold text-base">
            Welcome back!
          </DropdownMenuLabel>
          <div className="text-sm text-gray-700 mt-1">
            {user?.userName}
          </div>
        </div>

        <DropdownMenuItem
          onClick={() => navigate("/shop/account")}
          className="p-3 rounded-md hover:bg-gray-100 cursor-pointer"
        >
          <div className="font-medium text-black">My Account</div>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuItem
          onClick={onLogout}
          className="p-3 rounded-md hover:bg-red-50 text-red-600 cursor-pointer"
        >
          <div className="font-medium">Log Out</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const MobileMenu = ({ isSheetOpen, setIsSheetOpen }) => (
  <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
    <SheetTrigger asChild>
      <Button
        variant="ghost"
        size="default"
        className="lg:hidden p-2 hover:bg-gray-100 text-black hover:text-gray-800"
      >
        <Menu className="w-5 h-5" />
        <span className="sr-only">Open menu</span>
      </Button>
    </SheetTrigger>
    <SheetContent side="left" className="w-full max-w-xs bg-white border-r border-gray-200">
      <div className="pt-6">
        <div className="mb-8">
          <BrandLogo />
        </div>
        <MenuItems onItemClick={() => setIsSheetOpen(false)} />
      </div>
    </SheetContent>
  </Sheet>
);

const MobileFilterSheet = ({ filters, handleFilter, clearAllFilters, sort, handleSort }) => {
  const [openFilterSheet, setOpenFilterSheet] = useState(false);
  const { productList } = useSelector((state) => state.shopProducts);
  return (
    <Sheet open={openFilterSheet} onOpenChange={setOpenFilterSheet}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden p-2 hover:bg-gray-100 text-black hover:text-gray-800 flex items-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="font-medium">Filter</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-xs bg-white overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between pb-4 border-b">
            <h2 className="text-xl font-bold">Filters</h2>
            <Button
              variant="ghost"
              onClick={() => setOpenFilterSheet(false)}
            >
              Close
            </Button>
          </div>
          <ProductFilter
            filters={filters}
            handleFilter={handleFilter}
            clearAllFilters={clearAllFilters}
            sort={sort}
            handleSort={handleSort}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

const DesktopFilterSidebar = ({ filters, handleFilter, clearAllFilters, sort, handleSort, productList }) => {
  return (
    <aside className="hidden lg:block w-72 shrink-0 border-r border-gray-200 p-6">
      <div className="sticky top-[150px] space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Filters</h2>
          <Button variant="link" onClick={clearAllFilters}>
            Clear All
          </Button>
        </div>
        <ProductFilter
          filters={filters}
          handleFilter={handleFilter}
          clearAllFilters={clearAllFilters}
          sort={sort}
          handleSort={handleSort}
        />
        <div className="text-sm text-muted-foreground font-medium">
          {productList?.length || 0} Products
        </div>
      </div>
    </aside>
  );
};

const HeaderFilterSection = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { productList } = useSelector((state) => state.shopProducts);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const showFilter = location.pathname.includes("/shop/listing");
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
    setSearchParams(new URLSearchParams());
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
    if (filters !== null && sort !== null)
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
      );
  }, [dispatch, sort, filters]);

  if (!showFilter) return null;

  const filterProps = { filters, handleFilter, clearAllFilters, sort, handleSort, productList };

  return (
    <>
      <div className="hidden lg:flex w-full border-t border-gray-200 bg-white/95 backdrop-blur-sm relative z-40">
        <div className="w-full max-w-full flex items-center justify-between px-4 md:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 relative">
            <div className="relative z-50">
              <ProductFilter
                filters={filters}
                handleFilter={handleFilter}
                clearAllFilters={clearAllFilters}
                sort={sort}
                handleSort={handleSort}
              />
            </div>
            <span className="text-sm text-muted-foreground font-medium">
              {productList?.length || 0} Products
            </span>
          </div>
        </div>
      </div>
      <div className="lg:hidden flex justify-start items-center p-4">
        <MobileFilterSheet {...filterProps} />
        <span className="text-sm text-muted-foreground ml-4">
          {productList?.length || 0} Products
        </span>
      </div>
    </>
  );
};

const ShoppingHeader = () => {
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isListingPage = location.pathname.includes("/shop/listing");
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setHeaderScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filterProps = HeaderFilterSection();
  const showFilterSection = isListingPage && !isDesktop;

  return (
    <div className="relative -mx-4 md:-mx-6 lg:-mx-8">
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        {/* Scrolling Promo Bar - Always on top */}
        <ScrollingPromoBar />
        
        <header
  ref={headerRef}
  className={`sticky top-0 z-50 w-full ${
    headerScrolled
      ? 'bg-white shadow-sm'
      : 'bg-white border-b border-gray-200'
  }`}
>
          {/* First row: Logo left, Account & Cart right */}
          <div className="w-full max-w-full flex items-center justify-between px-4 md:px-6 lg:px-8 h-20">
            {/* Left side - Brand Logo */}
            <div className="flex items-center">
              <BrandLogo />
            </div>
            
            {/* Right side - Account & Cart (Desktop and Mobile) */}
            <div className="flex items-center gap-2">
              {/* Mobile: Search + Account/Cart + Menu */}
              <div className="lg:hidden flex items-center gap-2">
                <Button
                  onClick={() => navigate("/shop/search")}
                  variant="ghost"
                  size="default"
                  className="p-2 hover:bg-gray-100 text-black hover:text-gray-800"
                >
                  <Search className="w-5 h-5" />
                  <span className="sr-only">Search</span>
                </Button>
                <HeaderRightContent isMobile={true} />
                <MobileMenu
                  isSheetOpen={isSheetOpen}
                  setIsSheetOpen={setIsSheetOpen}
                />
              </div>
              
              {/* Desktop: Account & Cart only */}
              <div className="hidden lg:block">
                <HeaderRightContent />
              </div>
            </div>
          </div>
          
          {/* Second row: Navigation Menu (Desktop only) */}
          <div className="hidden lg:block w-full border-t border-gray-200">
            <div className="w-full max-w-full flex items-center justify-center px-4 md:px-6 lg:px-8 py-4">
              <MenuItems />
            </div>
          </div>
          
          {/* Filter section for mobile */}
          {showFilterSection && filterProps}
        </header>
      </div>
    </div>
  );
};

export default ShoppingHeader;