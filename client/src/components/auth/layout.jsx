import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { ScrollingPromoBar, ContactBar } from "../common/adds";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { BrandLogo } from "../shopping-view/header";

function AuthLayout() {


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