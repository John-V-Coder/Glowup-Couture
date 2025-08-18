import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { resetTokenAndCredentials } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { ScrollingPromoBar, ContactBar } from "./adds";
import ErrorBoundary from "./error-boundary";
import { Flame } from "lucide-react";

const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    path: "/shop/home",
    label: "Home",
  },
  {
    id: "collections",
    label: "Collections",
    dropdown: [
      { id: "products", path: "/shop/listing?category=products", label: "All Products" },
      { id: "women", label: "Women's Collection", path: "/shop/listing?category=women" },
      { id: "men", label: "Men's Collection", path: "/shop/listing?category=men" },
      { id: "kids", label: "Kids Wear", path: "/shop/listing?category=kids" },
      { id: "custom", label: "Modern Custom", path: "/shop/listing?category=custom" },
    ],
  },
  {
    id: "gallery",
    path: "/shop/gallery",
    label: "Gallery",
  },
  {
    id: "about",
    path: "/shop/about",
    label: "About Us",
  },
  {
    id: "search",
    path: "/shop/search",
    label: "Search",
  },
  { 
    id: "sale", 
    path: "/shop/listing?category=sale", // Fixed the path (was category/sale)
    label: "Sale",
    buttonStyle: true,
    destructive: true,
    icon: <Flame className="w-4 h-4" />,
  },
];

const CollectionDropdown = ({ menuItem, handleNavigate, isScrolled }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative cursor-pointer">
          <Label className={`font-medium cursor-pointer text-amber-800 hover:text-amber-950 ${
            isScrolled ? 'text-xs' : 'text-sm'
          }`}>
            {menuItem.label}
          </Label>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-72 border border-amber-200 rounded-lg bg-white p-2"
        align="start"
        sideOffset={8}
      >
        <div className="grid gap-1">
          {menuItem.dropdown.map((subItem) => (
            <DropdownMenuItem
              key={subItem.id}
              onClick={() => handleNavigate(subItem)}
              className="p-3 rounded-md hover:bg-amber-50 cursor-pointer"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="flex-1">
                  <div className="font-medium text-amber-950">
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
    <nav className={`flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row ${isScrolled ? 'gap-4' : 'gap-6'}`}>
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
                size={isScrolled ? "sm" : "default"}
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
            ) : (
              <Label
                onClick={() => handleNavigate(menuItem)}
                className={`font-medium cursor-pointer ${
                  location.pathname === menuItem.path ||
                  (menuItem.id === "search" && location.pathname.includes("search")) ||
                  (menuItem.id === "products" && location.pathname.includes("listing"))
                    ? "text-amber-950 font-bold"
                    : "text-amber-800 hover:text-amber-950"
                } ${isScrolled ? 'text-xs' : 'text-sm'}`}
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

export const BrandLogo = ({ isScrolled }) => {
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
        <div className="relative leading-tight">
          <span
            className={`font-extrabold bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 bg-clip-text text-transparent ${
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
            className={`font-semibold bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 bg-clip-text text-transparent ${
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

        <div className={`relative mt-1 ${isScrolled ? 'w-12' : 'w-16'}`}>
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
      </Link>
    </>
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
    navigate("/auth/login");
  };

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size={isScrolled ? "sm" : "default"}
          className="border-amber-300 hover:bg-amber-50 hover:border-amber-400"
        >
          Cart
          {cartItems?.items?.length > 0 && (
            <Badge className={`ml-2 bg-amber-800 text-amber-50 rounded-full ${
              isScrolled ? 'w-5 h-5' : 'w-6 h-6'
            }`}>
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
        <AuthButtons isScrolled={isScrolled} />
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
          <Avatar className={`bg-amber-100 border border-amber-200 ${
            isScrolled ? 'w-8 h-8' : 'w-10 h-10'
          }`}>
            <AvatarFallback className="bg-transparent text-amber-800">
              {user?.userName?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="right"
        className="w-64 border border-amber-200 rounded-lg bg-white p-2"
        sideOffset={8}
      >
        <div className="p-4 bg-amber-50 rounded-lg mb-2">
          <DropdownMenuLabel className="text-amber-800 font-semibold text-base">
            Welcome back!
          </DropdownMenuLabel>
          <div className="text-sm text-amber-700 mt-1">
            {user?.userName}
          </div>
        </div>

        <DropdownMenuItem
          onClick={() => navigate("/shop/account")}
          className="p-3 rounded-md hover:bg-amber-50 cursor-pointer"
        >
          <div className="font-medium text-amber-950">My Account</div>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuItem
          onClick={onLogout}
          className="p-3 rounded-md hover:bg-red-50 text-red-600 cursor-pointer"
        >
          <div className="font-medium">Sign Out</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const AuthButtons = ({ isScrolled }) => {
  const navigate = useNavigate();
  return (
    <div className="flex gap-3">
      <Button
        variant="outline"
        onClick={() => navigate("/auth/login")}
        size={isScrolled ? "sm" : "default"}
        className="border-amber-300 hover:bg-amber-50 hover:border-amber-400 text-amber-800 hover:text-amber-950 px-6"
      >
        Sign In
      </Button>
      <Button
        onClick={() => navigate("/auth/register")}
        size={isScrolled ? "sm" : "default"}
        className="bg-amber-600 hover:bg-amber-700 text-white px-6"
      >
        Join Now
      </Button>
    </div>
  );
};

const MobileMenu = ({ isSheetOpen, setIsSheetOpen, isScrolled }) => (
  <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
    <SheetTrigger asChild>
      <Button
        variant="outline"
        size={isScrolled ? "sm" : "default"}
        className="lg:hidden border-amber-300 hover:bg-amber-50 hover:border-amber-400"
      >
        Menu
      </Button>
    </SheetTrigger>
    <SheetContent side="left" className="w-full max-w-xs bg-white border-r border-amber-200">
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
    <div className="relative">
      <ScrollingPromoBar />
      <ContactBar />

      <header
        ref={headerRef}
        className={`sticky top-0 z-50 w-full ${
          headerScrolled
            ? 'bg-white border-b border-amber-300 shadow-sm'
            : 'bg-amber-50 border-b border-amber-200'
        }`}
      >
        <div className={`flex items-center justify-between px-4 md:px-6 ${
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
      </header>
    </div>
  );
};

export default ShoppingHeader;