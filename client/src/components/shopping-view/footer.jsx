import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  // Function to handle link clicks and scroll to top
  const handleLinkClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="bg-black text-gray-300 text-xs py-3 border-t border-gray-800 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-4">

        {/* Map Section */}
        <div className="w-full max-w-lg mb-1">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.814141630132!2d36.818814514753995!3d-1.2842426990666967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f111005a30c0b%3A0xe543e3f7c19c4d9a!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2sus!4v1625478901234!5m2!1sen!2sus"
            width="100%"
            height="120"
            allowFullScreen=""
            loading="lazy"
            className="rounded-md shadow-sm border border-gray-700"
          ></iframe>
        </div>

        {/* Footer Links - Now with scroll-to-top */}
        <div className="flex flex-wrap justify-center gap-3 text-[11px]">
          <Link 
            to="/shop/terms-and-conditions" 
            onClick={handleLinkClick}
            className="hover:text-amber-500 transition-colors"
          >
            Terms & Conditions
          </Link>
          <Link 
            to="/shop/delivery-mechanism" 
            onClick={handleLinkClick}
            className="hover:text-amber-500 transition-colors"
          >
            Delivery Mechanisms
          </Link>
          <Link 
            to="/shop/return-refund-exchange" 
            onClick={handleLinkClick}
            className="hover:text-amber-500 transition-colors"
          >
            Exchange Policy
          </Link>
          <Link 
            to="/shop/search" 
            onClick={handleLinkClick}
            className="hover:text-amber-500 transition-colors"
          >
            Search
          </Link>
          <Link 
            to="/shop/about" 
            onClick={handleLinkClick}
            className="hover:text-amber-500 transition-colors"
          >
            About Us
          </Link>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center space-x-5">
          <Link to="#" className="hover:text-amber-500 transition-colors">
            <Facebook className="w-4 h-4" />
          </Link>
          <Link to="#" className="hover:text-amber-500 transition-colors">
            <Twitter className="w-4 h-4" />
          </Link>
          <Link to="#" className="hover:text-amber-500 transition-colors">
            <Instagram className="w-4 h-4" />
          </Link>
          <Link to="#" className="hover:text-amber-500 transition-colors">
            <Linkedin className="w-4 h-4" />
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-center text-[10px] pt-3 border-t border-gray-800 w-full max-w-lg mt-3">
          <p className="mb-1">© {new Date().getFullYear()} Glowup Couture. All rights reserved.</p>
          <p>
            Designed with <span className="text-amber-500">✨</span> by <span className="font-semibold text-white">Golden Thread Designs</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;