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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { resetTokenAndCredentials } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { ScrollingPromoBar, ContactBar } from "./adds";
import ErrorBoundary from "./error-boundary";
import { Flame, User, LogIn, Search, Gift } from "lucide-react";
import AuthLogin from "@/pages/auth/login";
import AuthRegister from "@/pages/auth/register";
import ProductFilter from "@/components/shopping-view/filter";

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
      {
    id: "gift",
    path: "/shop/listing?category=gift",
    label: "Gift Card",
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

const CollectionDropdown = ({ menuItem, handleNavigate, isScrolled }) => {
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

// Single MenuItems component definition
const MenuItems = ({ onItemClick, isScrolled }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleNavigate = (getCurrentMenuItem) => {
    if (getCurrentMenuItem.id === "search") {
      navigate("/shop/search");
      onItemClick?.();
      return;
    }

    if (getCurrentMenuItem.id === "gift-card") {
      navigate("/shop/gift-card");
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
      getCurrentMenuItem.id === "sale" ||
      getCurrentMenuItem.id === "gift-card"
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
                isScrolled={isScrolled}
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
        {/* Brand Text */}
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

        {/* Golden Waves Underline */}
        <div className="relative mt-1 w-20 md:w-28">
          <svg
            viewBox="0 0 300 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            {/* Thick wave */}
            <path
              d="M0 40 C80 60, 220 20, 300 40"
              stroke="url(#grad1)"
              strokeWidth="4"
              fill="transparent"
            />
            {/* Thin wave */}
            <path
              d="M0 50 C80 70, 220 30, 300 50"
              stroke="url(#grad1)"
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




const UnifiedAuthDialog = ({ isScrolled, onAuthSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");

  const handleAuthSuccess = (user) => {
    setIsOpen(false);
    onAuthSuccess(user);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="default"
          className="border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-black hover:text-gray-800 flex items-center gap-2"
        >
          <User className="w-4 h-4" />
          Account
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-lg bg-white border border-gray-200 rounded-lg p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-50 border-b border-gray-200 rounded-none rounded-t-lg">
            <TabsTrigger
              value="signin"
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-white rounded-none"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-white rounded-none"
            >
              Join Now
            </TabsTrigger>
          </TabsList>
          <TabsContent value="signin" className="mt-0">
            <AuthLogin embedded={true} onSuccess={handleAuthSuccess} />
          </TabsContent>
          <TabsContent value="register" className="mt-0">
            <AuthRegister embedded={true} onSuccess={handleAuthSuccess} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

const HeaderRightContent = ({ isScrolled }) => {
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
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="default"
          className="border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-black"
        >
          Cart
          {cartItems?.items?.length > 0 && (
            <Badge className="ml-2 bg-gray-800 text-white rounded-full w-6 h-6">
              {cartItems?.items?.length || 0}
            </Badge>
          )}
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems?.items || []}
        />
      </Sheet>

      {isAuthenticated ? (
        <UserDropdown user={user} onLogout={handleLogout} isScrolled={isScrolled} />
      ) : (
        <UnifiedAuthDialog isScrolled={isScrolled} onAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  );
};

const UserDropdown = ({ user, onLogout, isScrolled }) => {
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

const MobileMenu = ({ isSheetOpen, setIsSheetOpen, isScrolled }) => (
  <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
    <SheetTrigger asChild>
      <Button
        variant="outline"
        size="default"
        className="lg:hidden border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-black"
      >
        Menu
      </Button>
    </SheetTrigger>
    <SheetContent side="left" className="w-full max-w-xs bg-white border-r border-gray-200">
      <div className="pt-6">
        <div className="mb-8">
          <BrandLogo isScrolled={false} />
        </div>
        <MenuItems onItemClick={() => setIsSheetOpen(false)} isScrolled={false} />
        <div className="mt-8 pt-8 border-t border-gray-200">
          <HeaderRightContent isScrolled={false} />
        </div>
      </div>
    </SheetContent>
  </Sheet>
);

// Filter Section Component - Only shows on listing pages
const HeaderFilterSection = ({ isScrolled }) => {
  const location = useLocation();
  const { productList } = useSelector((state) => state.shopProducts);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price-lowtohigh");
  const [searchParams, setSearchParams] = useSearchParams();

  // Only show on listing pages
  const showFilter = location.pathname.includes("/shop/listing");

  useEffect(() => {
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [location.pathname]);

  const handleFilter = (getSectionId, getCurrentOption) => {
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOption);
      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }
    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  };

  const clearAllFilters = () => {
    setFilters({});
    sessionStorage.removeItem("filters");
    setSearchParams(new URLSearchParams());
  };

  const handleSort = (value) => {
    setSort(value);
  };

  if (!showFilter) return null;

  return (
    <div className="w-full border-t border-gray-200 bg-white">
      <div className="w-full max-w-full flex items-center justify-between px-4 md:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-4 relative z-50">
          <ProductFilter
            filters={filters}
            handleFilter={handleFilter}
            clearAllFilters={clearAllFilters}
            sort={sort}
            handleSort={handleSort}
          />
          {/* Product Count - Next to filter */}
          <span className="text-sm text-muted-foreground font-medium">
            {productList?.length || 0} Products
          </span>
        </div>
      </div>
    </div>
  );
};

const ShoppingHeader = () => {
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setHeaderScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative -mx-4 md:-mx-6 lg:-mx-8">
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <ScrollingPromoBar />

        <header
          ref={headerRef}
          className={`sticky top-0 z-50 w-full ${
            headerScrolled
              ? 'bg-white border-b border-gray-300 shadow-sm'
              : 'bg-white border-b border-gray-200'
          }`}
        >
          {/* Main Header */}
          <div className="w-full max-w-full flex items-center justify-between px-4 md:px-6 lg:px-8 h-20">
            <div className="flex items-center gap-4">
              <BrandLogo isScrolled={headerScrolled} />
            </div>

            <MobileMenu
              isSheetOpen={isSheetOpen}
              setIsSheetOpen={setIsSheetOpen}
              isScrolled={headerScrolled}
            />

            <div className="hidden lg:block">
              <MenuItems isScrolled={headerScrolled} />
            </div>

            <div className="hidden lg:block">
              <HeaderRightContent isScrolled={headerScrolled} />
            </div>
          </div>

          {/* Filter Section - Only on listing pages */}
          <HeaderFilterSection isScrolled={headerScrolled} />
        </header>
      </div>
    </div>
  );
};

export default ShoppingHeader;