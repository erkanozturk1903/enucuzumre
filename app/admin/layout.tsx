"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Toaster } from "sonner";
import {
  LayoutDashboard,
  Package,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  MoonStar,
  Image as ImageIcon,
  FileText,
  HelpCircle,
  Building2,
  Award,
  MessageSquare,
  Navigation,
  Link2,
  Tag,
  Scale,
  Users,
  MapPin,
  Wallet,
  Globe,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Gruplandırılmış menü yapısı
const NAV_GROUPS = [
  {
    title: "Ana Yönetim",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/turlar", label: "Turlar", icon: Package },
      { href: "/admin/rezervasyonlar", label: "Rezervasyonlar", icon: Calendar },
      { href: "/admin/mesajlar", label: "Mesajlar", icon: MessageSquare },
    ],
  },
  {
    title: "İçerik",
    items: [
      { href: "/admin/blog", label: "Blog", icon: FileText },
      { href: "/admin/sss", label: "SSS", icon: HelpCircle },
      { href: "/admin/subeler", label: "Şubeler", icon: MapPin },
    ],
  },
  {
    title: "Finans & Belgeler",
    items: [
      { href: "/admin/banka-hesaplari", label: "Banka Hesapları", icon: Wallet },
      { href: "/admin/belgeler", label: "Belgeler", icon: Award },
    ],
  },
  {
    title: "Site Görünümü",
    items: [
      { href: "/admin/hero-slider", label: "Hero Slider", icon: ImageIcon },
      { href: "/admin/menu", label: "Header Menü", icon: Navigation },
      { href: "/admin/footer-linkler", label: "Footer Linkleri", icon: Link2 },
    ],
  },
  {
    title: "Sistem",
    items: [
      { href: "/admin/iletisim-konulari", label: "İletişim Konuları", icon: Tag },
      { href: "/admin/yasal-sayfalar", label: "Yasal Sayfalar", icon: Scale },
      { href: "/admin/ayarlar", label: "Site Ayarları", icon: Settings },
      { href: "/admin/kullanicilar", label: "Kullanıcılar", icon: Users, superAdminOnly: true },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const sessionResult = useSession();
  const session = sessionResult?.data ?? null;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Login sayfası için layout'u render etme
  if (pathname?.includes("/admin/login")) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/admin/login" });
  };

  // Kullanıcı rolüne göre menü öğelerini filtrele
  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";
  const filteredNavGroups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.superAdminOnly || isSuperAdmin),
  })).filter((group) => group.items.length > 0);

  const userName = session?.user?.name || "Admin User";
  const userEmail = session?.user?.email || "admin@enucuzhacumre.com";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-primary overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
            <div className="bg-white/10 p-2 rounded-lg">
              <MoonStar className="h-6 w-6 text-[#059669]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Admin Panel</h1>
              <p className="text-xs text-gray-400">EnUcuzHacUmre</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 overflow-y-auto">
            {filteredNavGroups.map((group, groupIndex) => (
              <div key={group.title} className={cn(groupIndex > 0 && "mt-4")}>
                <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {group.title}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href ||
                      (item.href !== "/admin" && pathname?.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm",
                          isActive
                            ? "bg-[#059669] text-white shadow-lg"
                            : "text-gray-300 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-all"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Çıkış Yap</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-72 bg-primary z-50 lg:hidden">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-lg">
                    <MoonStar className="h-6 w-6 text-[#059669]" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                  </div>
                </div>
                <button onClick={() => setIsSidebarOpen(false)}>
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>

              <nav className="flex-1 px-4 py-4 overflow-y-auto">
                {filteredNavGroups.map((group, groupIndex) => (
                  <div key={group.title} className={cn(groupIndex > 0 && "mt-4")}>
                    <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {group.title}
                    </p>
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const isActive = pathname === item.href ||
                          (item.href !== "/admin" && pathname?.startsWith(item.href));
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsSidebarOpen(false)}
                            className={cn(
                              "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm",
                              isActive
                                ? "bg-[#059669] text-white"
                                : "text-gray-300 hover:bg-white/5 hover:text-white"
                            )}
                          >
                            <item.icon className="h-4 w-4" />
                            <span className="font-medium">{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>

              <div className="p-4 border-t border-white/10">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-all"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Çıkış Yap</span>
                </button>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="h-6 w-6 text-gray-700" />
            </button>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">{userName}</p>
                <p className="text-xs text-gray-500">{userEmail}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#059669] flex items-center justify-center text-white font-bold">
                {userInitial}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

