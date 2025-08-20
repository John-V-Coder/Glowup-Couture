import { Calendar, Phone, MessageCircle, Ruler, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import React from 'react';
import { MessageSquare } from "lucide-react";

// Custom TikTok Icon Component
const TikTokIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M19.321 5.562a5.122 5.122 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.849-1.372-1.956-1.479-3.158-.014-.159-.021-.319-.021-.48V0h-3.126v16.021c0 1.644-1.295 2.98-2.896 2.98-1.6 0-2.895-1.336-2.895-2.98s1.295-2.98 2.895-2.98c.317 0 .622.051.906.146V9.895a6.188 6.188 0 0 0-.906-.069C6.51 9.826 3.5 12.895 3.5 16.664S6.51 23.5 10.219 23.5s6.719-3.069 6.719-6.836V8.432a9.212 9.212 0 0 0 5.027 1.458V6.89c-1.006 0-1.94-.328-2.644-.828z"/>
  </svg>
);

export const ScrollingPromoBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const promoMessages = [
    "Book Your Free Measurement Consultation Today!",
    "Free Shipping on Orders KSH 5000+",
    "Custom Tailoring Available - Perfect Fit Guaranteed",
    "Same Day Delivery in Nairobi",
    "Premium Quality Fabrics & Materials"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promoMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black text-white py-2 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
      <div className="container mx-auto px-4 relative">
        <div className="text-center">
          <span className="text-sm font-medium animate-fade-in-out underline decoration-white decoration-1 underline-offset-2">
            {promoMessages[currentIndex]}
          </span>
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
};

// New component for static social icons
const StaticSocialIcons = () => {
  const socialIcons = [
    {
      name: "Instagram",
      icon: <Instagram className="w-4 h-4" />,
      color: "text-pink-500",
      bgColor: "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400",
      href: "https://www.instagram.com/glowup_couture?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
    },
    {
      name: "Facebook",
      icon: <Facebook className="w-4 h-4" />,
      color: "text-blue-600",
      bgColor: "bg-blue-600",
      href: "https://www.facebook.com/p/Glow-Couture-100037207131507/"
    },
    {
      name: "TikTok",
      icon: <TikTokIcon className="w-4 h-4" />,
      color: "text-black",
      bgColor: "bg-gradient-to-r from-black via-red-500 to-blue-400",
      href: "https://www.tiktok.com/@glowupcouture"
    },
  ];

  return (
    <div className="flex items-center justify-center gap-2 py-2"> {/* Added padding and centering */}
      {/* "Follow Us" text */}
      <span className="text-xs text-gray-600 font-semibold px-3 py-1">
        Follow Us
      </span>
      
      {/* Static social icons row */}
      <div className="flex items-center gap-4"> {/* Increased gap for better spacing */}
        {socialIcons.map((social, index) => ( // Removed duplication as there's no scrolling
          <a
            key={`${social.name}-${index}`}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              w-8 h-8 rounded-full ${social.bgColor} flex-shrink-0
              flex items-center justify-center text-white
              transition-all duration-300 transform hover:scale-110 hover:shadow-lg
              group relative overflow-hidden hover:z-10
            `}
            title={`Visit our ${social.name}`}
          >
            <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            <div className="relative z-10">
              {social.icon}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export const ContactBar = () => {
  return (
    <>
      {/* Replaced HorizontalScrollingSocialIcons with StaticSocialIcons */}
      <StaticSocialIcons />
      <div className="bg-white py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            {/* Your other content can go here */}
            {/* Example: A simple contact message */}
             <ContactInfo icon={<Phone className="w-4 h-4 text-gray-700" />} text="+254 797 613671" mobileText="Call Us" />
          </div>
        </div>
      </div>
    </>
  );
};

const ActionButton = ({ type, clickedButton, icon, label, variant, onClick }) => (
  <Button
    onClick={() => onClick(type)}
    variant={variant}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
      variant === 'outline'
        ? clickedButton === type
          ? 'bg-blue-600 text-white border-blue-600'
          : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
        : clickedButton === type
          ? 'bg-green-600 text-white'
          : 'bg-gray-800 hover:bg-black text-white shadow-md hover:shadow-lg'
    } flex items-center gap-2`}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
    <span className="sm:hidden">{label.split(' ')[0]}</span>
  </Button>
);

const ContactInfo = ({ icon, text, mobileText }) => (
  <div className="flex items-center gap-2">
    {icon}
    <span className="font-medium hidden lg:inline">{text}</span>
    {mobileText && <span className="font-medium lg:hidden">{mobileText}</span>}
  </div>
);

// This component is no longer used for the main contact bar, but kept for reference if needed elsewhere.
export const TopHorizontalScrollingSocialIcons = () => {
  const socialIcons = [
    {
      name: "Instagram",
      icon: <Instagram className="w-5 h-5" />,
      color: "text-pink-500",
      bgColor: "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400",
      href: "https://www.instagram.com/glowup_couture?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
    },
    {
      name: "Facebook",
      icon: <Facebook className="w-5 h-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-600",
      href: "https://www.facebook.com/p/Glow-Couture-100037207131507/"
    },
    {
      name: "TikTok",
      icon: <TikTokIcon className="w-5 h-5" />,
      color: "text-black",
      bgColor: "bg-gradient-to-r from-black via-red-500 to-blue-400",
      href: "https://www.tiktok.com/@glowupcouture"
    },
  ];

  // Duplicate for seamless scrolling
  const duplicatedIcons = [...socialIcons, ...socialIcons, ...socialIcons];

  return (
    <div className="w-full bg-gray-50 py-4 overflow-hidden">
      <div className="flex items-center justify-center gap-4 mb-2">
        <span className="text-sm font-semibold text-gray-700">Follow Us</span>
      </div>
      
      <div className="relative overflow-hidden">
        <div className="animate-scroll-horizontal-full flex gap-6 items-center justify-center">
          {duplicatedIcons.map((social, index) => (
            <a
              key={`${social.name}-${index}`}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                w-12 h-12 rounded-full ${social.bgColor} flex-shrink-0
                flex items-center justify-center text-white
                transition-all duration-300 transform hover:scale-110 hover:shadow-xl
                group relative overflow-hidden hover:z-10
              `}
              title={`Visit our ${social.name}`}
            >
              <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              <div className="relative z-10">
                {social.icon}
              </div>
            </a>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-horizontal-full {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-scroll-horizontal-full {
          animation: scroll-horizontal-full 15s linear infinite;
        }
        .animate-scroll-horizontal-full:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default ContactBar;
