"use client";

import { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Wait a bit before hiding the banner if it was shown
      setTimeout(() => setIsVisible(false), 3000);
    };
    
    const handleOffline = () => {
      setIsOffline(true);
      setIsVisible(true);
    };

    // Initialize state
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      handleOffline();
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-100 flex items-center justify-center p-2 text-white shadow-lg transition-all duration-500 transform ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      } ${
        isOffline ? "bg-red-600" : "bg-green-600"
      }`}
    >
      <div className="flex items-center space-x-3">
        {isOffline ? (
          <>
            <WifiOff size={20} />
            <span className="text-sm font-medium">
              Sin conexión a Internet. Algunos servicios podrían no funcionar.
            </span>
          </>
        ) : (
          <>
            <span className="text-sm font-medium">
              ¡Conexión restablecida!
            </span>
          </>
        )}
      </div>
    </div>
  );
}
