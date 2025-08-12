// src/layouts/AuthLayout.jsx
import { Outlet, Link } from "react-router-dom";
import { ScrollingPromoBar, ContactBar } from "../shopping-view/adds";
import { ArrowLeft } from "lucide-react";

function AuthLayout() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#FFFBEA]">
      {/* Top Bars */}
      <ScrollingPromoBar className="bg-[#F7E7CE] text-[#5C4033]" />
      <ContactBar className="bg-[#EEDFCC] text-[#5C4033]" />

      <div className="flex flex-1">
        {/* Left Side (Image / Welcome Text) */}
        <div className="hidden lg:flex items-center justify-center bg-[#FAF3E0] w-1/2 px-12">
          <div className="max-w-md space-y-6 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#5C4033]">
              Welcome to Glowup Couture
            </h1>
            <p className="text-lg text-[#7B5E57]">
              Discover your unique style with our curated fashion collection
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 items-center justify-center bg-[#FFFBEA] px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-6">
            <div className="bg-white shadow-lg rounded-lg p-6 border border-[#EEDFCC]">
              <Outlet />
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