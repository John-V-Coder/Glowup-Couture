import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-700 py-6 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-6">

        {/* Map Section */}
        <div className="w-full max-w-lg mb-2">
          <iframe
            // 🚨 You must replace this placeholder URL with a real one from Google Maps 🚨
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.814141630132!2d36.818814514753995!3d-1.2842426990666967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f111005a30c0b%3A0xe543e3f7c19c4d9a!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2sus!4v1625478901234!5m2!1sen!2sus"
            width="100%"
            height="200"
            allowFullScreen=""
            loading="lazy"
            className="rounded-xl shadow-md border-2 border-gray-100"
          ></iframe>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center space-x-6">
          <Link to="#" className="hover:text-amber-600 transition-colors">
            <Facebook className="w-5 h-5" />
          </Link>
          <Link to="#" className="hover:text-amber-600 transition-colors">
            <Twitter className="w-5 h-5" />
          </Link>
          <Link to="#" className="hover:text-amber-600 transition-colors">
            <Instagram className="w-5 h-5" />
          </Link>
          <Link to="#" className="hover:text-amber-600 transition-colors">
            <Linkedin className="w-5 h-5" />
          </Link>
        </div>

        {/* Copyright and Credits */}
        <div className="text-center text-xs pt-4 border-t border-gray-100 w-full max-w-lg mt-4">
          <p className="mb-1">© {new Date().getFullYear()} Glowup Couture. All rights reserved.</p>
          <p>
            Designed with <span className="text-amber-500">✨</span> by <span className="font-semibold text-gray-800">Golden Thread Designs</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;