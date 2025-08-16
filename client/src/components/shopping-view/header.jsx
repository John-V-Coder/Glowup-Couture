import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  HousePlug, LogOut, Menu, ShoppingCart, UserCog, Search, ChevronDown, Bell, MapPin, Sparkles, Star, Zap
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
    id: "gallery",
    path: "/shop/gallery",
    label: "Gallery",
    icon: Zap,
    description: "See our latest styles",
  },
  {
    id: "about",
    path: "/shop/about",
    label: "About Us",
    icon: Sparkles,
    description: "Our story & mission",
  },
  {
    id: "search",
    path: "/shop/search",
    label: "Search",
    icon: Search,
    description: "Find your perfect style",
  },
];

// Enhanced Brand Logo with animations - Exported as named export
export const BrandLogo = ({ isScrolled }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* Google Fonts Import */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Dancing+Script:wght@600&display=swap"
        rel="stylesheet"
      />

      <Link
        to="/shop/home"
        className={`flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-500 ${
          isScrolled ? 'hover:scale-102' : 'hover:scale-105'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Brand Text */}
        <div className="relative leading-tight">
          <span
            className={`font-extrabold bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 bg-clip-text text-transparent transition-all duration-500 ${
              isHovered ? "tracking-wider" : "tracking-wide"
            } ${
              isScrolled ? 'text-base' : 'text-lg'
            }`}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: "800",
            }}
          >
            GLOW
          </span>
          <br />
          <span
            className={`font-semibold bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 bg-clip-text text-transparent transition-all duration-500 ${
              isHovered ? "tracking-wider" : "tracking-wide"
            } ${
              isScrolled ? 'text-sm' : 'text-base'
            }`}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: "700",
            }}
          >
            COUTURE
          </span>
        </div>

        {/* Decorative Curved Lines */}
        <div className={`relative mt-1 transition-all duration-500 ${isScrolled ? 'w-12' : 'w-16'}`}>
          <svg
            viewBox="0 0 200 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 10 C50 20, 150 0, 200 10"
              stroke="url(#grad1)"
              strokeWidth="2"
              fill="transparent"
            />
            <path
              d="M0 15 C50 25, 150 5, 200 15"
              stroke="url(#grad1)"
              strokeWidth="1.5"
              fill="transparent"
            />
            <defs>
              <linearGradient id="grad1" x1="0" x2="200" y1="0" y2="0">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Optional Hover Tagline */}
        {isHovered && !isScrolled && (
          <div
            className="text-[10px] text-amber-700 font-medium italic mt-1 animate-fade-in"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Premium Fashion
          </div>
        )}
      </Link>
    </>
  );
};

// Enhanced Collection Dropdown with animations and visual improvements
const CollectionDropdown = ({ menuItem, handleNavigate, isScrolled }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div className="relative group cursor-pointer">
          <Label className={`font-medium cursor-pointer flex items-center gap-2 text-amber-800 hover:text-amber-950 transition-all duration-300 group-hover:scale-105 ${
            isScrolled ? 'text-xs' : 'text-sm'
          }`}>
            <menuItem.icon className={`text-amber-600 ${isScrolled ? 'w-3 h-3' : 'w-4 h-4'}`} />
            {menuItem.label}
            <ChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'group-hover:rotate-12'} ${isScrolled ? 'h-3 w-3' : 'h-4 w-4'}`} />
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
             New arrivals added weekly
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Enhanced Menu Items with hover effects and animations
const MenuItems = ({ onItemClick, isScrolled }) => {
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
    <nav className={`flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row ${isScrolled ? 'gap-4' : 'gap-6'}`}>
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
                isScrolled={isScrolled}
              />
            ) : (
              <div className="relative">
                <Label
                  onClick={() => handleNavigate(menuItem)}
                  className={`font-medium cursor-pointer flex items-center gap-2 transition-all duration-300 transform hover:scale-105 ${
                    location.pathname === menuItem.path ||
                    (menuItem.id === "search" && location.pathname.includes("search")) ||
                    (menuItem.id === "products" && location.pathname.includes("listing"))
                      ? "text-amber-950 font-bold"
                      : "text-amber-800 hover:text-amber-950"
                  } ${
                    isScrolled ? 'text-xs' : 'text-sm'
                  }`}
                >
                  <menuItem.icon className={`text-amber-600 ${isScrolled ? 'w-3 h-3' : 'w-4 h-4'}`} />
                  {menuItem.label}
                </Label>

                {/* Animated underline */}
                <div className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300 ${
                  hoveredItem === menuItem.id ? 'w-full' : 'w-0'
                }`}></div>

                {/* Tooltip */}
                {hoveredItem === menuItem.id && !isScrolled && (
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

// Enhanced Header Right Content with animations (SEARCH BUTTON REMOVED)
const HeaderRightContent = ({ isScrolled }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
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
      {/* Enhanced Cart Button */}
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size={isScrolled ? "sm" : "icon"}
          className={`relative border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300 hover:scale-105 ${
            cartAnimation ? 'animate-bounce' : ''
          }`}
        >
          <ShoppingCart className={`text-amber-600 ${isScrolled ? 'w-4 h-4' : 'w-6 h-6'}`} />
          <Badge className={`absolute -top-2 -right-2 bg-amber-800 text-amber-50 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
            cartAnimation ? 'animate-pulse scale-125' : ''
          } ${
            isScrolled ? 'w-5 h-5' : 'w-6 h-6'
          }`}>
            {cartItems?.items?.length || 0}
          </Badge>
          {cartItems?.items?.length > 0 && (
            <div className={`absolute -top-1 -right-1 bg-green-500 rounded-full animate-ping ${
              isScrolled ? 'w-2 h-2' : 'w-3 h-3'
            }`}></div>
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
        <AuthButtons isScrolled={isScrolled} />
      )}
    </div>
  );
};

// Enhanced User Dropdown
const UserDropdown = ({ user, onLogout, isScrolled }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div className="relative group cursor-pointer">
          <Avatar className={`bg-gradient-to-br from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 transition-all duration-300 cursor-pointer ring-2 ring-amber-200 hover:ring-amber-300 hover:scale-105 shadow-lg hover:shadow-xl ${
            isScrolled ? 'w-8 h-8' : 'w-10 h-10'
          }`}>
            <AvatarFallback className={`bg-transparent text-white font-extrabold ${
              isScrolled ? 'text-sm' : 'text-lg'
            }`}>
              {user?.userName?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          {isOpen && (
            <div className={`absolute -top-1 -right-1 bg-green-500 rounded-full animate-ping ${
              isScrolled ? 'w-2 h-2' : 'w-3 h-3'
            }`}></div>
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
const AuthButtons = ({ isScrolled }) => {
  const navigate = useNavigate();
  return (
    <div className="flex gap-3">
      <Button
        variant="outline"
        onClick={() => navigate("/auth/login")}
        size={isScrolled ? "sm" : "default"}
        className={`border-amber-300 hover:bg-amber-50 hover:border-amber-400 text-amber-800 hover:text-amber-950 transition-all duration-300 hover:scale-105 px-6 ${
          isScrolled ? 'text-xs' : 'text-sm'
        }`}
      >
        Sign In
      </Button>
      <Button
        onClick={() => navigate("/auth/register")}
        size={isScrolled ? "sm" : "default"}
        className={`bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl px-6 ${
          isScrolled ? 'text-xs' : 'text-sm'
        }`}
      >
        Join Now
      </Button>
    </div>
  );
};

// Enhanced Mobile Menu
const MobileMenu = ({ isSheetOpen, setIsSheetOpen, isScrolled }) => (
  <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
    <SheetTrigger asChild>
      <Button
        variant="outline"
        size={isScrolled ? "sm" : "icon"}
        className="lg:hidden border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300 hover:scale-105"
      >
        <Menu className={`text-amber-600 ${isScrolled ? 'h-4 w-4' : 'h-6 w-6'}`} />
      </Button>
    </SheetTrigger>
    <SheetContent side="left" className="w-full max-w-xs bg-amber-50/95 backdrop-blur-xl border-r-0 shadow-2xl">
      <div className="pt-6">
        <div className="mb-8">
          <BrandLogo isScrolled={false} />
        </div>
        <MenuItems onItemClick={() => setIsSheetOpen(false)} isScrolled={false} />
        <div className="mt-8 pt-8 border-t border-amber-200">
          <HeaderRightContent isScrolled={false} />
        </div>
      </div>
    </SheetContent>
  </Sheet>
);

// Main Enhanced Shopping Header - Default export
const ShoppingHeader = () => {
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const headerRef = useRef(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(true);

  const { featureImageList } = useSelector((state) => state.commonFeature) || {};

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrolled = currentScrollY > 50;
      
      // Calculate scroll progress
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min((currentScrollY / documentHeight) * 100, 100);
      
      // Determine header visibility (hide on scroll down, show on scroll up)
      const isScrollingDown = currentScrollY > lastScrollY;
      const shouldHideHeader = isScrollingDown && currentScrollY > 100;
      
      setHeaderScrolled(scrolled);
      setScrollProgress(progress);
      setHeaderVisible(!shouldHideHeader || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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
        className={`sticky top-0 z-50 w-full transition-all duration-500 transform ${
          headerVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          headerScrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-amber-300'
            : 'bg-amber-50/90 backdrop-blur-md border-b border-amber-200 shadow-sm'
        }`}
      >
        <div className={`flex items-center justify-between px-4 md:px-6 transition-all duration-500 ${
          headerScrolled ? 'h-16' : 'h-20'
        }`}>
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

        {/* Enhanced Progress bar for scroll */}
        <div 
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 transition-all duration-300 shadow-sm"
          style={{ width: `${scrollProgress}%` }}
        >
          <div className="absolute right-0 top-0 w-4 h-full bg-gradient-to-l from-amber-300 to-transparent animate-pulse"></div>
        </div>

        {/* Sticky indicator dot */}
        {headerScrolled && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
        )}
      </header>
    </div>
  );
};

export default ShoppingHeader;