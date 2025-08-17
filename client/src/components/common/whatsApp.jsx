import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';

const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if previously dismissed
    const dismissed = localStorage.getItem('whatsapp-dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
      return;
    }

    // Show after 3 seconds
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = (e) => {
    e.stopPropagation();
    setIsVisible(false);
    localStorage.setItem('whatsapp-dismissed', 'true');
    
    // Set dismissed after animation completes
    setTimeout(() => setIsDismissed(true), 300);
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-6 left-6 z-50"
          initial={{ x: -120, opacity: 0, scale: 0.8 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: -120, opacity: 0, scale: 0.8 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.6
          }}
        >
          <div className="relative">
            {/* Close button */}
            <motion.button
              onClick={handleDismiss}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-lg z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Dismiss WhatsApp button"
            >
              <X size={12} />
            </motion.button>

            {/* Main button */}
            <motion.a
              href="https://wa.me/254797613671"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-xl flex items-center gap-3 no-underline"
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                y: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }
              }}
              whileHover={{
                scale: 1.05,
                y: 0,
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageSquare size={20} />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Need Help?</span>
                <span className="text-xs opacity-90">Chat with us!</span>
              </div>
            </motion.a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppButton;