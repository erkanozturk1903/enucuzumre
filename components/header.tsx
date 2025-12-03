"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";

interface MenuItem {
  id: string;
  label: string;
  href: string;
  order: number;
}

interface HeaderProps {
  menuItems?: MenuItem[];
  phone?: string;
  whatsapp?: string;
}

// Varsayılan menü (veritabanından veri gelmezse)
const DEFAULT_NAV_LINKS = [
  { id: "1", label: "Anasayfa", href: "/", order: 1 },
  { id: "2", label: "Hakkımızda", href: "/hakkimizda", order: 2 },
  { id: "3", label: "Umre Turları", href: "/umre-turlari", order: 3 },
  { id: "4", label: "Şubelerimiz", href: "/subelerimiz", order: 4 },
  { id: "5", label: "Blog", href: "/blog", order: 5 },
  { id: "6", label: "İletişim", href: "/iletisim", order: 6 },
];

export function Header({ menuItems, phone, whatsapp }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = menuItems && menuItems.length > 0 ? menuItems : DEFAULT_NAV_LINKS;
  const phoneNumber = phone || "+90 555 555 55 55";
  const whatsappNumber = whatsapp || "+905555555555";

  // Scroll takibi
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mobil menü açıldığında body scroll'u engelle
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b border-transparent",
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-gray-200 shadow-sm py-3"
          : "bg-white py-5"
      )}
    >
      <Container>
        <div className="flex items-center justify-between">
          {/* Sol: Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="En Ucuz Hac Umre"
              width={44}
              height={44}
              className="object-contain"
            />
            <span className="text-xl font-bold text-primary tracking-tight">
              EnUcuz<span className="text-secondary">HacUmre</span>
            </span>
          </Link>

          {/* Orta: Desktop Navigasyon */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.sort((a, b) => a.order - b.order).map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-secondary transition-colors relative group py-2"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Sağ: Aksiyon Butonları */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={`tel:${phoneNumber.replace(/\s/g, "")}`}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary border border-gray-200 rounded-full hover:border-primary hover:bg-gray-50 transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>Hemen Ara</span>
            </a>
            <a
              href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#25D366] rounded-full hover:bg-[#128C7E] transition-colors shadow-sm hover:shadow-md"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Mobil Menü Butonu */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </Container>

      {/* Mobil Drawer (Sheet) */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden transition-all duration-300 ease-in-out",
          isMobileMenuOpen ? "visible" : "invisible"
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "fixed inset-0 bg-black/50 transition-opacity duration-300",
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Drawer Content */}
        <div
          className={cn(
            "fixed inset-y-0 right-0 w-[300px] bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col",
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="p-5 flex items-center justify-between border-b border-gray-100">
            <span className="text-lg font-bold text-primary">Menü</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-5">
            <nav className="flex flex-col gap-6">
              {navLinks.sort((a, b) => a.order - b.order).map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-gray-800 hover:text-secondary transition-colors flex items-center justify-between group"
                >
                  {link.label}
                  <span className="w-2 h-2 rounded-full bg-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </nav>

            <div className="mt-8 flex flex-col gap-4">
              <a
                href={`tel:${phoneNumber.replace(/\s/g, "")}`}
                className="flex items-center justify-center gap-2 px-4 py-3 text-base font-medium text-primary border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors w-full"
              >
                <Phone className="h-5 w-5" />
                Hemen Ara
              </a>
              <a
                href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 text-base font-medium text-white bg-[#25D366] rounded-xl hover:bg-[#128C7E] transition-colors shadow-sm w-full"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
