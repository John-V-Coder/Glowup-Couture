import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { ScrollingPromoBar, ContactBar } from "../shopping-view/adds";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { BrandLogo } from "../shopping-view/header";

function AuthLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("signin");

  // Determine active tab based on current path
  useEffect(() => {
    if (location.pathname.includes("/register")) {
      setActiveTab("register");
    } else if (location.pathname.includes("/login") || location.pathname === "/auth") {
      setActiveTab("signin");
    }
  }, [location.pathname]);

  // Handle tab switching
  const handleTabChange = (value) => {
    setActiveTab(value);
    navigate(value === "signin" ? "/auth/login" : "/auth/register");
  };

  return (
    <div className="min-h-screen bg-[#FFFBEA]">
      {/* Top Bars */}
      <ScrollingPromoBar className="bg-[#F7E7CE] text-[#5C4033]" />
      <BrandLogo/>
      <ContactBar className="bg-[#EEDFCC] text-[#5C4033]" />

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg space-y-6">
          {/* Auth Card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg">
            {/* Tabs - Only show for login/register */}
            {!location.pathname.includes("/forgot-password") && (
              <div className="grid grid-cols-2 bg-gray-50 border-b border-gray-200 rounded-t-lg">
                <button
                  onClick={() => handleTabChange("signin")}
                  className={`py-3 px-4 font-medium transition-colors rounded-tl-lg ${
                    activeTab === "signin"
                      ? "bg-gray-800 text-white"
                      : "bg-gray-50 text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Log In
                </button>
                <button
                  onClick={() => handleTabChange("register")}
                  className={`py-3 px-4 font-medium transition-colors rounded-tr-lg ${
                    activeTab === "register"
                      ? "bg-gray-800 text-white"
                      : "bg-gray-50 text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Register
                </button>
              </div>
            )}

            {/* Outlet Content */}
            <div className="p-6">
              <Outlet />
            </div>
          </div>

          {/* Back to Home Button */}
          <Link
            to="/"
            className="flex items-center justify-center w-full py-3 px-4 bg-[#F7E7CE] hover:bg-[#EEDFCC] text-[#5C4033] hover:text-[#3D2C29] rounded-lg border border-[#EEDFCC] shadow-sm transition-all duration-200 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;