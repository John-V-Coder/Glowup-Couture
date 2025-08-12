import { HousePlug, LogOut, Menu, ShoppingCart, UserCog, Search, MessageCircle, Instagram, Facebook, Phone, Calendar, Ruler } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import { resetTokenAndCredentials } from "@/store/auth-slice";

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          className="text-sm font-medium cursor-pointer flex items-center gap-2 text-gray-700 hover:text-black transition-colors duration-300"
          key={menuItem.id}
        >
          {menuItem.id === "search" ? (
            <Search className="h-5 w-5" />
          ) : (
            menuItem.label
          )}
        </Label>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(resetTokenAndCredentials());
    sessionStorage.clear();
    navigate("/auth/login");
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch, user?.id]);

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            {cartItems?.items?.length || 0}
          </span>
          <span className="sr-only">User cart</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>

      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="bg-black hover:bg-gray-800 transition-all duration-300 cursor-pointer ring-2 ring-gray-200 hover:ring-gray-400">
              <AvatarFallback className="bg-black text-white font-extrabold">
                {user?.userName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" className="w-56 border-gray-200">
            <DropdownMenuLabel className="text-gray-800">Logged in as {user?.userName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/shop/account")} className="hover:bg-gray-50">
              <UserCog className="mr-2 h-4 w-4 text-gray-600" />
              Account
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="hover:bg-red-50 text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/auth/login")}
            className="text-sm border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700 hover:text-black transition-all duration-300"
          >
            Login
          </Button>
          <Button
            onClick={() => navigate("/auth/register")}
            className="text-sm bg-black hover:bg-gray-800 text-white transition-all duration-300"
          >
            Register
          </Button>
        </div>
      )}
    </div>
  );
}

function ScrollingPromoBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const promoMessages = [
    "🎉 Book Your Free Measurement Consultation Today!",
    "✨ Free Shipping on Orders KSH 5000+",
    "📏 Custom Tailoring Available - Perfect Fit Guaranteed",
    "🚚 Same Day Delivery in Nairobi",
    "💎 Premium Quality Fabrics & Materials"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promoMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white py-2 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
      <div className="container mx-auto px-4 relative">
        <div className="text-center">
          <span className="text-sm font-medium animate-fade-in-out">
            {promoMessages[currentIndex]}
          </span>
        </div>
      </div>
    </div>
  );
}

function ContactBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [clickedButton, setClickedButton] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBookMeasurement = () => {
    setClickedButton('book');
    setTimeout(() => setClickedButton(null), 300);
    const message = encodeURIComponent("Hi! I'd like to book a measurement consultation. Please let me know your available times. Thank you!");
    window.open(`https://wa.me/254797613671?text=${message}`, '_blank');
  };

  const handleCall = () => {
    setClickedButton('call');
    setTimeout(() => setClickedButton(null), 300);
    window.location.href = "tel:+254 797 613671";
  };

  const handleWhatsApp = () => {
    setClickedButton('whatsapp');
    setTimeout(() => setClickedButton(null), 300);
    const message = encodeURIComponent("Hello! I'm interested in your products. Could you help me with more information?");
    window.open(`https://wa.me/254797613671?text=${message}`, '_blank');
  };

  return (
    <div className={`bg-white border-b border-gray-200 transition-all duration-500 ${isScrolled ? 'shadow-lg' : 'shadow-sm'}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-3 lg:space-y-0">
          {/* Left Section - Quick Actions */}
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleBookMeasurement}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center space-x-2 ${
                clickedButton === 'book' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-800 hover:bg-black text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Book Measurement</span>
              <span className="sm:hidden">Book</span>
            </Button>

            <Button
              onClick={handleCall}
              variant="outline"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 ${
                clickedButton === 'call'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">Call Now</span>
              <span className="sm:hidden">Call</span>
            </Button>

            <Button
              onClick={handleWhatsApp}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center space-x-2 ${
                clickedButton === 'whatsapp'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-800 hover:bg-black text-white'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
              <span className="sm:hidden">Chat</span>
            </Button>
          </div>

          {/* Center Section - Contact Info */}
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="font-medium">+254 71 419 8559</span>
            </div>
            <div className="flex items-center space-x-2">
              <Ruler className="w-4 h-4 text-gray-500" />
              <span className="font-medium hidden lg:inline">Custom Tailoring Available</span>
              <span className="font-medium lg:hidden">Custom Tailoring</span>
            </div>
          </div>

          {/* Right Section - Social Links */}
          <div className="flex items-center space-x-3">
            <span className="text-xs text-gray-500 font-medium">Follow Us:</span>
            
            <a 
              href="https://instagram.com/glowupcouture" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 hover:border-gray-300 transition-all duration-300 transform hover:scale-110 group"
            >
              <Instagram className="w-4 h-4 text-gray-600 group-hover:text-gray-800 transition-colors" />
            </a>
            
            <a 
              href="https://facebook.com/glowupcouture" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 hover:border-gray-300 transition-all duration-300 transform hover:scale-110 group"
            >
              <Facebook className="w-4 h-4 text-gray-600 group-hover:text-gray-800 transition-colors" />
            </a>
            
            <a 
              href="https://tiktok.com/@glowupcouture" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 hover:border-gray-300 transition-all duration-300 transform hover:scale-110 group"
            >
              <svg className="w-4 h-4 text-gray-600 group-hover:text-gray-800 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.10z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-out {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        .animate-fade-in-out {
          animation: fade-in-out 4s infinite;
        }
      `}</style>
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [headerScrolled, setHeaderScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHeaderScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative">
      {/* Scrolling Promotional Bar */}
      <ScrollingPromoBar />
      
      {/* Contact Information Bar */}
      <ContactBar />

      {/* Main Header */}
      <header className={`sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b transition-all duration-500 ${
        headerScrolled ? 'shadow-lg border-gray-300' : 'border-gray-200 shadow-sm'
      }`}>
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <Link 
            to="/shop/home" 
            className="flex items-center gap-3 hover:scale-105 transition-transform duration-300"
          >
            <div className="p-2 rounded-lg bg-black shadow-lg">
              <HousePlug className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-black">Glowup Couture</span>
              <span className="text-xs text-gray-600 font-medium -mt-1">Luxury Fashion</span>
            </div>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="lg:hidden border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle header menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs bg-white/95 backdrop-blur-md">
              <div className="pt-6">
                <MenuItems />
                <div className="mt-8">
                  <HeaderRightContent />
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="hidden lg:block">
            <MenuItems />
          </div>

          <div className="hidden lg:block">
            <HeaderRightContent />
          </div>
        </div>
      </header>
    </div>
  );
}

export default ShoppingHeader;