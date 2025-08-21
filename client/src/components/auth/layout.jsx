// src/layouts/AuthLayout.jsx
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { ScrollingPromoBar, ContactBar } from "../shopping-view/adds";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

function AuthLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("signin");
  const [showTabs, setShowTabs] = useState(true);

  // Determine active tab or forgot-password state
  useEffect(() => {
    if (location.pathname.includes("/register")) {
      setActiveTab("register");
      setShowTabs(true);
    } else if (location.pathname.includes("/login")) {
      setActiveTab("signin");
      setShowTabs(true);
    } else if (location.pathname.includes("/forgot-password")) {
      setShowTabs(false); // hide tabs for forgot password
    }
  }, [location.pathname]);

  // Handle tab switching
  const handleTabChange = (value) => {
    setActiveTab(value);
    if (value === "signin") {
      navigate("/auth/login");
    } else if (value === "register") {
      navigate("/auth/register");
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#FFFBEA]">
      {/* Top Bars */}
      <ScrollingPromoBar className="bg-[#F7E7CE] text-[#5C4033]" />
      <ContactBar className="bg-[#EEDFCC] text-[#5C4033]" />

      <div className="flex flex-1">
        {/* Main Content */}
        <div className="flex flex-1 items-center justify-center bg-[#FFFBEA] px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-lg space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-0 shadow-lg">
              {/* Show tabs only for login/register */}
              {showTabs && (
                <div className="grid w-full grid-cols-2 bg-gray-50 border-b border-gray-200 rounded-t-lg">
                  <button
                    onClick={() => handleTabChange("signin")}
                    className={`
                      py-3 px-4 text-center font-medium transition-colors
                      ${
                        activeTab === "signin"
                          ? "bg-gray-800 text-white"
                          : "bg-gray-50 text-gray-600 hover:text-gray-800"
                      }
                      rounded-tl-lg
                    `}
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => handleTabChange("register")}
                    className={`
                      py-3 px-4 text-center font-medium transition-colors
                      ${
                        activeTab === "register"
                          ? "bg-gray-800 text-white"
                          : "bg-gray-50 text-gray-600 hover:text-gray-800"
                      }
                      rounded-tr-lg
                    `}
                  >
                    Register
                  </button>
                </div>
              )}

              {/* Content Area */}
              <div className="p-6">
                <Outlet />
              </div>
            </div>

            {/* Prominent Back to Home Button */}
            <Link
              to="/"
              className="
                w-full
                flex items-center justify-center
                py-3 px-4
                bg-[#F7E7CE] hover:bg-[#EEDFCC]
                text-[#5C4033] hover:text-[#3D2C29]
                rounded-lg
                border border-[#EEDFCC]
                shadow-sm
                transition-all
                duration-200
                group
              "
            >
              <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
              <span className="font-medium">Return to Homepage</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
