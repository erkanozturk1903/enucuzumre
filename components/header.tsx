"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
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
  appStoreUrl?: string;
  playStoreUrl?: string;
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

export function Header({ menuItems, appStoreUrl, playStoreUrl }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = menuItems && menuItems.length > 0 ? menuItems : DEFAULT_NAV_LINKS;
  const hasAppLinks = appStoreUrl || playStoreUrl;

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
          <Link href="/" className="flex items-center group">
            <span className="text-2xl font-bold text-primary tracking-tight">
              EnUcuz<span className="text-secondary">HacUmre</span>
            </span>
          </Link>

          {/* Orta: Desktop Navigasyon */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
            {navLinks.sort((a, b) => a.order - b.order).map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-secondary transition-colors relative group py-2 whitespace-nowrap"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Sağ: Aksiyon Butonları */}
          <div className="hidden lg:flex items-center gap-3">
            {/* App Store Linkleri */}
            {hasAppLinks && (
              <div className="flex items-center gap-2 mr-2">
                {appStoreUrl && (
                  <a
                    href={appStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity hover:opacity-80"
                    title="App Store'dan İndir"
                  >
                    <Image
                      src="/app-store-badge.svg"
                      alt="App Store"
                      width={120}
                      height={40}
                      className="h-9 w-auto"
                    />
                  </a>
                )}
                {playStoreUrl && (
                  <a
                    href={playStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity hover:opacity-80"
                    title="Google Play'den İndir"
                  >
                    <Image
                      src="/google-play-badge.svg"
                      alt="Google Play"
                      width={135}
                      height={40}
                      className="h-9 w-auto"
                    />
                  </a>
                )}
              </div>
            )}
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


            {/* Mobil App Store Linkleri */}
            {hasAppLinks && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-3 text-center">Mobil Uygulamamız</p>
                <div className="flex justify-center gap-3">
                  {appStoreUrl && (
                    <a
                      href={appStoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src="/app-store-badge.svg"
                        alt="App Store"
                        width={120}
                        height={40}
                        className="h-10 w-auto"
                      />
                    </a>
                  )}
                  {playStoreUrl && (
                    <a
                      href={playStoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src="/google-play-badge.svg"
                        alt="Google Play"
                        width={135}
                        height={40}
                        className="h-10 w-auto"
                      />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
