import { Calendar, Phone, MessageCircle, Ruler, Music, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import React from 'react';
import { MessageSquare } from "lucide-react";

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
    <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white py-2 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
      <div className="container mx-auto px-4 relative">
        <div className="text-center">
          <span className="text-sm font-medium animate-fade-in-out">
            {promoMessages[currentIndex]}
          </span>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{
  __html: `
    @keyframes fade-in-out {
      0%, 100% { opacity: 0.8; }
      50% { opacity: 1; }
    }
    .animate-fade-in-out {
      animation: fade-in-out 4s infinite;
    }
  `
}} />
    </div>
  );
};

export const ContactBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [clickedButton, setClickedButton] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAction = (type) => {
    setClickedButton(type);
    setTimeout(() => setClickedButton(null), 300);
    
    const actions = {
      book: () => {
        const message = encodeURIComponent("Hi! I'd like to book a measurement consultation.");
        window.open(`https://wa.me/254797613671?text=${message}`, '_blank');
      },
      call: () => window.location.href = "tel:+254 797 613671",
      whatsapp: () => {
        const message = encodeURIComponent("Hello! I need more information about your products.");
        window.open(`https://wa.me/254797613671?text=${message}`, '_blank');
      }
    };
    actions[type]?.();
  };

  return (
    <div className={`bg-white border-b border-gray-200 transition-all duration-500 ${isScrolled ? 'shadow-lg' : 'shadow-sm'}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-0">
          <div className="flex items-center gap-4">
            <ActionButton 
              type="book" 
              clickedButton={clickedButton}
              icon={<Calendar className="w-4 h-4" />}
              label="Book Appointment"
              onClick={handleAction}
            />
            <ActionButton 
              type="call" 
              clickedButton={clickedButton}
              icon={<MessageSquare className="w-4 h-4" />}
              label="Message Us"
              variant="outline"
              onClick={handleAction}
            />
          </div>
          <SocialLinks />
        </div>
      </div>
    </div>
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

const SocialLinks = () => (
  <div className="flex items-center gap-3">
    <span className="text-xs text-gray-500 font-large">Follow Us:</span>
    <SocialIcon 
      href="https://www.instagram.com/glowup_couture?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
      icon={<Instagram className="w-4 h-4" />}
    />
    <SocialIcon 
      href="https://www.facebook.com/p/Glow-Couture-100037207131507/" 
      icon={<Facebook className="w-4 h-4" />}
    />
    <SocialIcon 
      href="https://www.tiktok.com/@glowupcouture" 
      icon={<Music className="w-4 h-4" />
      }
    />
  </div>
);

const SocialIcon = ({ href, icon }) => {
  const IconComponent = icon.type;
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 hover:border-gray-300 transition-all duration-300 transform hover:scale-110 group"
    >
      <IconComponent className="w-4 h-4 text-gray-600 group-hover:text-gray-800 transition-colors" />
    </a>
  );
};