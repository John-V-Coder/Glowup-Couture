import { HousePlug, LogOut, Menu, ShoppingCart, UserCog, Search, ChevronDown } from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {  resetTokenAndCredentials } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "@/components/ui/label";
import { ScrollingPromoBar, ContactBar } from "./adds";
import ErrorBoundary from "./error-boundary";

// New menu item for the Gallery
const shoppingViewHeaderMenuItems = [
  { id: "home", path: "/shop/home", label: "Home" },
  { id: "about", path: "/shop/about", label: "About Us" },
  { id: "gallery", path: "/shop/gallery", label: "Gallery" },
  {
    id: "collections",
    label: "Collections",
    dropdown: [
      { id: "women", label: "Women's Collection", path: "/shop/listing?category=women" },
      { id: "men", label: "Men's Collection", path: "/shop/listing?category=men" },
      { id: "kids", label: "Kids Wear", path: "/shop/listing?category=kids" },
      { id: "custom", label: "Modern Custom", path: "/shop/listing?category=custom" },
    ],
  },
  { id: "search", path: "/shop/search", label: "Search" },
];

const CollectionDropdown = ({ menuItem, handleNavigate }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Label className="text-sm font-medium cursor-pointer flex items-center gap-1 text-gray-700 hover:text-black transition-colors duration-300">
        {menuItem.label}
        <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
      </Label>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      className="w-48 border-gray-200 shadow-lg rounded-md"
      align="start"
    >
      {menuItem.dropdown.map((subItem) => (
        <DropdownMenuItem
          key={subItem.id}
          onClick={() => handleNavigate(subItem)}
          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
        >
          {subItem.label}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

const MenuItems = ({ onItemClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    if (getCurrentMenuItem.id === "search") {
      navigate("/shop/search");
      if (onItemClick) onItemClick();
      return;
    }

    sessionStorage.removeItem("filters");
    
    // Logic for setting filter based on menu item
    const currentFilter =
      getCurrentMenuItem.id === "home" ||
      getCurrentMenuItem.id === "products" ||
      getCurrentMenuItem.id === "search" ||
      getCurrentMenuItem.id === "gallery"
        ? null
        : { category: [getCurrentMenuItem.id] };

    if (currentFilter) {
      sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    }

    // Handle navigation logic
    if (location.pathname.includes("listing") && currentFilter !== null) {
      setSearchParams(new URLSearchParams(`?category=${getCurrentMenuItem.id}`));
    } else {
      navigate(getCurrentMenuItem.path);
    }

    if (onItemClick) onItemClick();
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <div key={menuItem.id} className="relative group">
          <ErrorBoundary>
            {menuItem.dropdown ? (
              <CollectionDropdown
                menuItem={menuItem}
                handleNavigate={handleNavigate}
              />
            ) : (
              <Label
                onClick={() => handleNavigate(menuItem)}
                className={`text-sm font-medium cursor-pointer flex items-center gap-2 transition-colors duration-300 ${
                  location.pathname === menuItem.path ||
                  (menuItem.id === "search" && location.pathname.includes("search")) ||
                  (menuItem.id === "products" && location.pathname.includes("listing"))
                    ? "text-black font-bold"
                    : "text-gray-700 hover:text-black"
                }`}
              >
                {menuItem.id === "search" ? (
                  <>
                    <Search className="h-5 w-5" />
                    {menuItem.label || "Search"}
                  </>
                ) : (
                  menuItem.label
                )}
              </Label>
            )}
          </ErrorBoundary>
        </div>
      ))}
    </nav>
  );
};

const HeaderRightContent = () => {
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
    navigate("/auth/login");
  };

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
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
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems?.items || []}
        />
      </Sheet>

      {isAuthenticated ? (
        <UserDropdown user={user} onLogout={handleLogout} />
      ) : (
        <AuthButtons />
      )}
    </div>
  );
};

const UserDropdown = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="bg-black hover:bg-gray-800 transition-all duration-300 cursor-pointer ring-2 ring-gray-200 hover:ring-gray-400">
          <AvatarFallback className="bg-black text-white font-extrabold">
            {user?.userName?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" className="w-56 border-gray-200">
        <DropdownMenuLabel className="text-gray-800">
          Logged in as {user?.userName}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => navigate("/shop/account")}
          className="hover:bg-gray-50"
        >
          <UserCog className="mr-2 h-4 w-4 text-gray-600" />
          Account
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogout}
          className="hover:bg-red-50 text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const AuthButtons = () => {
  const navigate = useNavigate();
  return (
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
  );
};

export const ShoppingHeader = () => {
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  // This line is added to get featureImageList from the Redux store
  const { featureImageList } = useSelector((state) => state.commonFeature) || {};

  useEffect(() => {
    const handleScroll = () => setHeaderScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative">
      <ScrollingPromoBar />
      <ContactBar />

      <header className={`sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b transition-all duration-500 ${
        headerScrolled ? 'shadow-lg border-gray-300' : 'border-gray-200 shadow-sm'
      }`}>
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <BrandLogo />
          
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
      </header>
    </div>
  );
};


const BrandLogo = () => (
  <Link
    to="/shop/home"
    className="flex items-center gap-3 hover:scale-105 transition-transform duration-500"
  >
    {/* Icon container */}
    <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-700 shadow-lg shadow-yellow-400 animate-pulse">
      <HousePlug className="h-6 w-6 text-white drop-shadow-lg" />
    </div>

    {/* Text container */}
    <div className="flex flex-col leading-tight">
      {/* Glowup - clean and professional */}
      <span className="text-lg font-semibold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-[length:200%_200%] animate-shine text-transparent bg-clip-text">
        Glowup
      </span>

      {/* Couture - elegant gold shine animation */}
      <span className="text-lg font-semibold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-[length:200%_200%] animate-shine text-transparent bg-clip-text">
        Couture
      </span>
    </div>
  </Link>
);


const MobileMenu = ({ isSheetOpen, setIsSheetOpen }) => (
  <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
    <SheetTrigger asChild>
      <Button
        variant="outline"
        size="icon"
        className="lg:hidden border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
      >
        <Menu className="h-6 w-6" />
      </Button>
    </SheetTrigger>
    <SheetContent side="left" className="w-full max-w-xs bg-white/95 backdrop-blur-md">
      <div className="pt-6">
        <MenuItems onItemClick={() => setIsSheetOpen(false)} />
        <div className="mt-8">
          <HeaderRightContent />
        </div>
      </div>
    </SheetContent>
  </Sheet>
);

export default ShoppingHeader;
export {BrandLogo};