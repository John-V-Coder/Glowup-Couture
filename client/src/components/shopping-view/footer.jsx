import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { ContactBar } from "./adds";

const Footer = () => {
  const handleLinkClick = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-white text-amber-600 text-xs py-3 border-t border-gray-200 w-full">
      <div className="container mx-auto px-4 flex flex-row justify-between items-center">
        {/* Left side - Links */}
        <div className="flex flex-col space-y-1">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {["Terms", "Delivery", "Returns", "Search", "About"].map((item) => (
              <Link 
                key={item}
                to={`/shop/${item.toLowerCase()}`}
                onClick={handleLinkClick}
                className="hover:text-amber-800 hover:underline"
              >
                {item}
              </Link>
            ))}
          </div>
          <p className="text-[10px] text-gray-500">
            © {new Date().getFullYear()} Glowup Couture || All Rights Observed
          </p>
        </div>


        {/* Right side - Map */}
        <div className="w-48">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.814141630132!2d36.818814514753995!3d-1.2842426990666967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f111005a30c0b%3A0xe543e3f7c19c4d9a!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2sus!4v1625478901234!5m2!1sen!2sus"
            width="100%"
            height="80"
            allowFullScreen=""
            loading="lazy"
            className="rounded border border-gray-200"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;