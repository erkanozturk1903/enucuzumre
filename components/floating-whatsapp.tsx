"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingWhatsAppProps {
  phoneNumber?: string;
}

export function FloatingWhatsApp({ phoneNumber = "+905555555555" }: FloatingWhatsAppProps) {
  const [isHovered, setIsHovered] = useState(false);

  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, "")}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip */}
      <div
        className={cn(
          "bg-white px-4 py-2 rounded-full shadow-lg border border-gray-100 transition-all duration-300 whitespace-nowrap",
          isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"
        )}
      >
        <span className="text-sm font-medium text-gray-700">WhatsApp ile Yazın</span>
      </div>

      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "flex items-center justify-center w-14 h-14 bg-[#25D366] rounded-full shadow-lg transition-all duration-300",
          "hover:bg-[#128C7E] hover:scale-110 hover:shadow-xl",
          "active:scale-95"
        )}
        aria-label="WhatsApp ile iletişime geçin"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </a>

      {/* Pulse Animation */}
      <span className="absolute bottom-0 right-0 w-14 h-14 bg-[#25D366] rounded-full animate-ping opacity-20 pointer-events-none" />
    </div>
  );
}
