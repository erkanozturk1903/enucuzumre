"use client";

import { Send } from "lucide-react";

interface FooterNewsletterProps {
  title?: string;
  description?: string;
  buttonText?: string;
}

// Default değerler
const DEFAULT_TITLE = "Kampanyalardan Haberdar Olun";
const DEFAULT_DESCRIPTION = "Erken rezervasyon fırsatları ve özel indirimlerden ilk siz haberdar olun. Spam yapmıyoruz, sadece fırsat paylaşıyoruz.";
const DEFAULT_BUTTON_TEXT = "Abone Ol";

export function FooterNewsletter({
  title,
  description,
  buttonText,
}: FooterNewsletterProps) {
  return (
    <div className="bg-primary/50 border border-gray-800 rounded-2xl p-8 md:p-10 mb-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-secondary blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-secondary blur-3xl" />
      </div>

      <div className="relative z-10 text-center md:text-left">
        <h3 className="text-2xl font-bold mb-2">{title || DEFAULT_TITLE}</h3>
        <p className="text-gray-400 max-w-md">
          {description || DEFAULT_DESCRIPTION}
        </p>
      </div>

      <form className="w-full max-w-md relative z-10 flex gap-2">
        <input
          type="email"
          placeholder="E-posta adresiniz"
          className="flex-1 bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
        />
        <button
          type="submit"
          className="bg-secondary hover:bg-secondary/90 text-white font-bold px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
        >
          <span>{buttonText || DEFAULT_BUTTON_TEXT}</span>
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
