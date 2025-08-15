import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  HousePlug, LogOut, Menu, ShoppingCart, UserCog, Search, ChevronDown, Heart, Bell, MapPin, Sparkles, Star, Zap
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { resetTokenAndCredentials } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "@/components/ui/label";
import { ScrollingPromoBar, ContactBar } from "./adds";
import ErrorBoundary from "./error-boundary";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Enhanced menu items with icons and descriptions
const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    path: "/shop/home",
    label: "Home",
    icon: Star,
    description: "Curated fashion lines",
  },
  {
    id: "about",
    path: "/shop/about",
    label: "About Us",
    icon: Sparkles,
    description: "Our story & mission",
  },
  {
    id: "gallery",
    path: "/shop/gallery",
    label: "Gallery",
    icon: Zap,
    description: "See our latest styles",
  },
  {
    id: "collections",
    label: "Collections",
    icon: ChevronDown,
    description: "Curated fashion lines",
    dropdown: [
      { id: "women", label: "Women's Collection", path: "/shop/listing?category=women", icon: "👗", color: "from-pink-500 to-rose-500" },
      { id: "men", label: "Men's Collection", path: "/shop/listing?category=men", icon: "👔", color: "from-blue-500 to-indigo-500" },
      { id: "kids", label: "Kids Wear", path: "/shop/listing?category=kids", icon: "🧸", color: "from-green-500 to-emerald-500" },
      { id: "custom", label: "Modern Custom", path: "/shop/listing?category=custom", icon: "✨", color: "from-purple-500 to-violet-500" },
    ],
  },
  {
    id: "search",
    path: "/shop/search",
    label: "Search",
    icon: Search,
    description: "Find your perfect style",
  },
];

// Enhanced Collection Dropdown with animations and visual improvements
const CollectionDropdown = ({ menuItem, handleNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div className="relative group cursor-pointer">
          <Label className="text-sm font-medium cursor-pointer flex items-center gap-2 text-amber-800 hover:text-amber-950 transition-all duration-300 group-hover:scale-105">
            <menuItem.icon className="w-4 h-4 text-amber-600" />
            {menuItem.label}
            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'group-hover:rotate-12'}`} />
          </Label>
          <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 group-hover:w-full transition-all duration-300"></div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-72 border-0 shadow-2xl rounded-2xl bg-amber-50/95 backdrop-blur-xl p-2"
        align="start"
        sideOffset={8}
      >
        <div className="grid gap-1">
          {menuItem.dropdown.map((subItem, index) => (
            <DropdownMenuItem
              key={subItem.id}
              onClick={() => handleNavigate(subItem)}
              className="p-4 rounded-xl hover:bg-gradient-to-r hover:from-amber-50 hover:to-amber-100 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-4 w-full">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subItem.color} flex items-center justify-center text-white text-lg shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                  {subItem.icon}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-amber-950 group-hover:text-amber-800 transition-colors">
                    {subItem.label}
                  </div>
                  <div className="text-xs text-amber-700 mt-1">
                    Explore our curated selection
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-amber-400 rotate-[-90deg] group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </DropdownMenuItem>
          ))}
        </div>
        <div className="mt-2 p-2 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl">
          <div className="text-xs text-center text-amber-700 font-medium">
            ✨ New arrivals added weekly
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Enhanced Menu Items with hover effects and animations
const MenuItems = ({ onItemClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [hoveredItem, setHoveredItem] = useState(null);

  function handleNavigate(getCurrentMenuItem) {
    if (getCurrentMenuItem.id === "search") {
      navigate("/shop/search");
      if (onItemClick) onItemClick();
      return;
    }

    sessionStorage.removeItem("filters");

    const currentFilter =
      getCurrentMenuItem.id === "home" ||
      getCurrentMenuItem.id === "products" ||
      getCurrentMenuItem.id === "search" ||
      getCurrentMenuItem.id === "gallery" ||
      getCurrentMenuItem.id === "about"
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

    if (onItemClick) onItemClick();
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem, index) => (
        <div
          key={menuItem.id}
          className="relative group"
          onMouseEnter={() => setHoveredItem(menuItem.id)}
          onMouseLeave={() => setHoveredItem(null)}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <ErrorBoundary>
            {menuItem.dropdown ? (
              <CollectionDropdown
                menuItem={menuItem}
                handleNavigate={handleNavigate}
              />
            ) : (
              <div className="relative">
                <Label
                  onClick={() => handleNavigate(menuItem)}
                  className={`text-sm font-medium cursor-pointer flex items-center gap-2 transition-all duration-300 transform hover:scale-105 ${
                    location.pathname === menuItem.path ||
                    (menuItem.id === "search" && location.pathname.includes("search")) ||
                    (menuItem.id === "products" && location.pathname.includes("listing"))
                      ? "text-amber-950 font-bold"
                      : "text-amber-800 hover:text-amber-950"
                  }`}
                >
                  <menuItem.icon className="w-4 h-4 text-amber-600" />
                  {menuItem.label}
                </Label>

                {/* Animated underline */}
                <div className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300 ${
                  hoveredItem === menuItem.id ? 'w-full' : 'w-0'
                }`}></div>

                {/* Tooltip */}
                {hoveredItem === menuItem.id && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-amber-950 text-amber-50 text-xs rounded-lg whitespace-nowrap opacity-0 animate-in fade-in-0 slide-in-from-top-2 duration-200 z-50">
                    {menuItem.description}
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-amber-950 rotate-45"></div>
                  </div>
                )}
              </div>
            )}
          </ErrorBoundary>
        </div>
      ))}
    </nav>
  );
};

// Enhanced Search Component
const SmartSearch = ({ isVisible, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isVisible]);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.length > 2) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  const performSearch = async (query) => {
    setIsSearching(true);
    // Simulate API call - replace with actual search logic
    setTimeout(() => {
      const mockResults = [
        { id: 1, title: "Premium Cotton Dress", category: "Women", price: 89 },
        { id: 2, title: "Classic Denim Jacket", category: "Men", price: 129 },
        { id: 3, title: "Kids Summer Collection", category: "Kids", price: 45 },
      ].filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 500);
  };

  if (!isVisible) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-amber-50/95 backdrop-blur-xl border-t border-amber-200 shadow-2xl z-50 animate-in slide-in-from-top-2 duration-300">
      <div className="container mx-auto px-4 py-6">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-400 w-5 h-5" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search for products, categories, or brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-12 py-4 text-lg border-2 border-amber-200 rounded-2xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all duration-300"
          />
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-amber-400 hover:text-amber-600"
          >
            ✕
          </Button>
        </div>

        {/* Search Results */}
        {searchQuery.length > 2 && (
          <div className="mt-6 max-w-2xl mx-auto">
            {isSearching ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
                <span className="ml-3 text-amber-700">Searching...</span>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-amber-800 mb-3">Search Results</h3>
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => {
                      navigate(`/shop/product/${result.id}`);
                      onClose();
                    }}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-amber-50 cursor-pointer transition-all duration-200 group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-amber-950 group-hover:text-amber-600 transition-colors">
                        {result.title}
                      </div>
                      <div className="text-sm text-amber-700">{result.category}</div>
                    </div>
                    <div className="text-lg font-bold text-amber-950">${result.price}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-amber-700">
                No results found for "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Header Right Content with animations
const HeaderRightContent = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [cartAnimation, setCartAnimation] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  // Animate cart when items are added
  useEffect(() => {
    if (cartItems?.items?.length > 0) {
      setCartAnimation(true);
      setTimeout(() => setCartAnimation(false), 600);
    }
  }, [cartItems?.items?.length]);

  const handleLogout = () => {
    dispatch(resetTokenAndCredentials());
    sessionStorage.clear();
    navigate("/auth/login");
  };

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      {/* Search Button */}
      <Button
        onClick={() => setShowSearch(!showSearch)}
        variant="outline"
        size="icon"
        className="relative border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300 hover:scale-105"
      >
        <Search className="w-5 h-5 text-amber-600" />
      </Button>

      {/* Wishlist Button (placeholder) */}
      <Button
        variant="outline"
        size="icon"
        className="relative border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300 hover:scale-105"
      >
        <Heart className="w-5 h-5 text-amber-600" />
        <Badge className="absolute -top-2 -right-2 bg-amber-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
          0
        </Badge>
      </Button>

      {/* Enhanced Cart Button */}
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className={`relative border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300 hover:scale-105 ${
            cartAnimation ? 'animate-bounce' : ''
          }`}
        >
          <ShoppingCart className="w-6 h-6 text-amber-600" />
          <Badge className={`absolute -top-2 -right-2 bg-amber-800 text-amber-50 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
            cartAnimation ? 'animate-pulse scale-125' : ''
          }`}>
            {cartItems?.items?.length || 0}
          </Badge>
          {cartItems?.items?.length > 0 && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
          )}
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems?.items || []}
        />
      </Sheet>

      {/* Search Overlay */}
      <SmartSearch isVisible={showSearch} onClose={() => setShowSearch(false)} />

      {isAuthenticated ? (
        <UserDropdown user={user} onLogout={handleLogout} />
      ) : (
        <AuthButtons />
      )}
    </div>
  );
};

// Enhanced User Dropdown
const UserDropdown = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div className="relative group cursor-pointer">
          <Avatar className="bg-gradient-to-br from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 transition-all duration-300 cursor-pointer ring-2 ring-amber-200 hover:ring-amber-300 hover:scale-105 shadow-lg hover:shadow-xl">
            <AvatarFallback className="bg-transparent text-white font-extrabold text-lg">
              {user?.userName?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          {isOpen && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="right"
        className="w-64 border-0 shadow-2xl rounded-2xl bg-amber-50/95 backdrop-blur-xl p-2"
        sideOffset={8}
      >
        <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl mb-2">
          <DropdownMenuLabel className="text-amber-800 font-semibold text-base">
            Welcome back!
          </DropdownMenuLabel>
          <div className="text-sm text-amber-700 mt-1">
            {user?.userName}
          </div>
          <div className="text-xs text-amber-600 mt-1">
            {user?.email}
          </div>
        </div>

        <DropdownMenuItem
          onClick={() => navigate("/shop/account")}
          className="p-3 rounded-xl hover:bg-gradient-to-r hover:from-amber-50 hover:to-amber-100 cursor-pointer transition-all duration-300 group"
        >
          <UserCog className="mr-3 h-5 w-5 text-amber-700 group-hover:text-amber-600 transition-colors" />
          <div>
            <div className="font-medium text-amber-950">My Account</div>
            <div className="text-xs text-amber-700">Orders, addresses & more</div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuItem
          onClick={onLogout}
          className="p-3 rounded-xl hover:bg-red-50 text-red-600 cursor-pointer transition-all duration-300 group"
        >
          <LogOut className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
          <div className="font-medium">Sign Out</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Enhanced Auth Buttons
const AuthButtons = () => {
  const navigate = useNavigate();
  return (
    <div className="flex gap-3">
      <Button
        variant="outline"
        onClick={() => navigate("/auth/login")}
        className="text-sm border-amber-300 hover:bg-amber-50 hover:border-amber-400 text-amber-800 hover:text-amber-950 transition-all duration-300 hover:scale-105 px-6"
      >
        Sign In
      </Button>
      <Button
        onClick={() => navigate("/auth/register")}
        className="text-sm bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl px-6"
      >
        Join Now
      </Button>
    </div>
  );
};

// Enhanced Brand Logo with animations
const BrandLogo = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to="/shop/home"
      className="flex items-center gap-3 hover:scale-105 transition-all duration-500 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Enhanced Icon container */}
      <div className={`p-3 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 shadow-xl transition-all duration-500 ${
        isHovered ? 'shadow-2xl shadow-amber-500/50 rotate-12 scale-110' : 'shadow-amber-400/30'
      }`}>
        <HousePlug className={`h-7 w-7 text-white drop-shadow-lg transition-all duration-500 ${
          isHovered ? 'rotate-12' : ''
        }`} />
        {isHovered && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-300 to-amber-500 opacity-20 animate-pulse"></div>
        )}
      </div>

      {/* Enhanced Text container */}
      <div className="flex flex-col leading-tight">
        <span className={`text-xl font-bold bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 bg-clip-text text-transparent transition-all duration-500 ${
          isHovered ? 'tracking-wider' : ''
        }`}>
          Glowup
        </span>
        <span className={`text-xl font-bold bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 bg-clip-text text-transparent transition-all duration-500 ${
          isHovered ? 'tracking-wider' : ''
        }`}>
          Couture
        </span>
        {isHovered && (
          <div className="text-xs text-amber-700 font-medium animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
            Premium Fashion
          </div>
        )}
      </div>
    </Link>
  );
};

// Enhanced Mobile Menu
const MobileMenu = ({ isSheetOpen, setIsSheetOpen }) => (
  <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
    <SheetTrigger asChild>
      <Button
        variant="outline"
        size="icon"
        className="lg:hidden border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300 hover:scale-105"
      >
        <Menu className="h-6 w-6 text-amber-600" />
      </Button>
    </SheetTrigger>
    <SheetContent side="left" className="w-full max-w-xs bg-amber-50/95 backdrop-blur-xl border-r-0 shadow-2xl">
      <div className="pt-6">
        <div className="mb-8">
          <BrandLogo />
        </div>
        <MenuItems onItemClick={() => setIsSheetOpen(false)} />
        <div className="mt-8 pt-8 border-t border-amber-200">
          <HeaderRightContent />
        </div>
      </div>
    </SheetContent>
  </Sheet>
);

// Main Enhanced Shopping Header
export const ShoppingHeader = () => {
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const headerRef = useRef(null);

  const { featureImageList } = useSelector((state) => state.commonFeature) || {};

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 100;
      setHeaderScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Show notification for new arrivals (example)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      <ScrollingPromoBar />
      <ContactBar />

      {/* Notification Banner */}
      {showNotification && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 px-4 text-center text-sm font-medium animate-in slide-in-from-top-2 duration-500">
          New arrivals just dropped!
          <Button
            onClick={() => setShowNotification(false)}
            variant="ghost"
            size="sm"
            className="ml-4 text-white hover:text-green-100 p-1 h-auto"
          >
            ✕
          </Button>
        </div>
      )}

      <header
        ref={headerRef}
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${
          headerScrolled
            ? 'bg-amber-50/95 backdrop-blur-xl shadow-2xl border-b border-amber-300'
            : 'bg-amber-50/90 backdrop-blur-md border-b border-amber-200 shadow-sm'
        }`}
      >
        <div className="flex h-20 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <BrandLogo />
          </div>

          <MobileMenu
            isSheetOpen={isSheetOpen}
            setIsSheetOpen={setIsSheetOpen}
          />

          <div className="hidden lg:block">
            <MenuItems />
          </div>

          <div className="hidden lg:block">
            <HeaderRightContent />
          </div>
        </div>

        {/* Progress bar for scroll */}
        <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300"
          style={{ width: `${Math.min((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100, 100)}%` }}>
        </div>
      </header>
    </div>
  );
};

export default ShoppingHeader;
export { BrandLogo };