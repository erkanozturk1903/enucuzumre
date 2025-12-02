import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Users, Package, Calendar, MessageSquare, FileText, HelpCircle, Building2, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

async function getDashboardStats() {
  try {
    const [
      tourCount,
      bookingCount,
      messageCount,
      newMessageCount,
      blogCount,
      faqCount,
      bankAccountCount,
      certificateCount,
    ] = await Promise.all([
      prisma.tour.count({ where: { isActive: true } }).catch(() => 0),
      prisma.booking.count().catch(() => 0),
      prisma.contactMessage.count().catch(() => 0),
      prisma.contactMessage.count({ where: { status: "NEW" } }).catch(() => 0),
      prisma.blogPost.count({ where: { isPublished: true } }).catch(() => 0),
      prisma.fAQ.count({ where: { isActive: true } }).catch(() => 0),
      prisma.bankAccount.count({ where: { isActive: true } }).catch(() => 0),
      prisma.certificate.count({ where: { isActive: true } }).catch(() => 0),
    ]);

    return {
      tourCount,
      bookingCount,
      messageCount,
      newMessageCount,
      blogCount,
      faqCount,
      bankAccountCount,
      certificateCount,
    };
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return {
      tourCount: 0,
      bookingCount: 0,
      messageCount: 0,
      newMessageCount: 0,
      blogCount: 0,
      faqCount: 0,
      bankAccountCount: 0,
      certificateCount: 0,
    };
  }
}

async function getRecentBookings() {
  try {
    const bookings = await prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        tour: { select: { title: true, price: true, currency: true } },
      },
    });
    return bookings;
  } catch {
    return [];
  }
}

async function getRecentMessages() {
  try {
    const messages = await prisma.contactMessage.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    });
    return messages;
  } catch {
    return [];
  }
}

async function getPopularTours() {
  try {
    const tours = await prisma.tour.findMany({
      where: { isActive: true },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { bookings: true } },
      },
    });
    return tours.sort((a, b) => b._count.bookings - a._count.bookings);
  } catch {
    return [];
  }
}

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  const [stats, recentBookings, recentMessages, popularTours] = await Promise.all([
    getDashboardStats(),
    getRecentBookings(),
    getRecentMessages(),
    getPopularTours(),
  ]);

  const statCards = [
    {
      title: "Aktif Turlar",
      value: stats.tourCount.toString(),
      icon: Package,
      color: "bg-blue-500",
      href: "/admin/turlar",
    },
    {
      title: "Rezervasyonlar",
      value: stats.bookingCount.toString(),
      icon: Calendar,
      color: "bg-[#059669]",
      href: "/admin/rezervasyonlar",
    },
    {
      title: "Mesajlar",
      value: stats.messageCount.toString(),
      badge: stats.newMessageCount > 0 ? `${stats.newMessageCount} yeni` : undefined,
      icon: MessageSquare,
      color: "bg-amber-500",
      href: "/admin/mesajlar",
    },
    {
      title: "Blog Yazıları",
      value: stats.blogCount.toString(),
      icon: FileText,
      color: "bg-purple-500",
      href: "/admin/blog",
    },
  ];

  const secondaryStats = [
    { title: "SSS", value: stats.faqCount, icon: HelpCircle, href: "/admin/sss" },
    { title: "Banka Hesapları", value: stats.bankAccountCount, icon: Building2, href: "/admin/banka-hesaplari" },
    { title: "Belgeler", value: stats.certificateCount, icon: Award, href: "/admin/belgeler" },
  ];

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return "Az önce";
    if (hours < 24) return `${hours} saat önce`;
    if (days === 1) return "Dün";
    return `${days} gün önce`;
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">
          Hoş Geldiniz, {session.user?.name || "Admin"}
        </h1>
        <p className="text-gray-600">
          İşte işletmenizin genel durumu
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            href={stat.href}
            className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={cn("p-3 rounded-xl", stat.color)}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              {stat.badge && (
                <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                  {stat.badge}
                </span>
              )}
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              {stat.title}
            </h3>
            <p className="text-3xl font-bold text-primary group-hover:text-[#059669] transition-colors">
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-3 gap-4">
        {secondaryStats.map((stat, index) => (
          <Link
            key={index}
            href={stat.href}
            className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow flex items-center gap-3"
          >
            <div className="p-2 rounded-lg bg-gray-100">
              <stat.icon className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{stat.title}</p>
              <p className="text-lg font-bold text-primary">{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Son Rezervasyonlar */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-primary">Son Rezervasyonlar</h2>
            <Link href="/admin/rezervasyonlar" className="text-sm text-[#059669] hover:underline">
              Tümünü Gör
            </Link>
          </div>
          {recentBookings.length > 0 ? (
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{booking.name}</p>
                    <p className="text-sm text-gray-500">{booking.tour.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#059669]">
                      ${booking.tour.price?.toLocaleString("tr-TR")}
                    </p>
                    <p className="text-xs text-gray-400">{formatDate(booking.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Henüz rezervasyon bulunmuyor
            </div>
          )}
        </div>

        {/* Son Mesajlar */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-primary">Son Mesajlar</h2>
            <Link href="/admin/mesajlar" className="text-sm text-[#059669] hover:underline">
              Tümünü Gör
            </Link>
          </div>
          {recentMessages.length > 0 ? (
            <div className="space-y-3">
              {recentMessages.map((message) => (
                <div
                  key={message.id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-medium text-gray-900">{message.name}</p>
                    {message.status === "NEW" && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Yeni</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-1">{message.subject}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(message.createdAt)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Henüz mesaj bulunmuyor
            </div>
          )}
        </div>
      </div>

      {/* Popüler Turlar */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-primary">En Popüler Turlar</h2>
          <Link href="/admin/turlar" className="text-sm text-[#059669] hover:underline">
            Tüm Turlar
          </Link>
        </div>
        {popularTours.length > 0 ? (
          <div className="space-y-3">
            {popularTours.slice(0, 5).map((tour, index) => {
              const maxBookings = Math.max(...popularTours.map(t => t._count.bookings), 1);
              const percentage = (tour._count.bookings / maxBookings) * 100;

              return (
                <div
                  key={tour.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-lg font-bold text-gray-400 w-6">{index + 1}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{tour.title}</p>
                      <p className="text-sm text-gray-500">{tour._count.bookings} Rezervasyon</p>
                    </div>
                  </div>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#059669]"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Henüz tur bulunmuyor
          </div>
        )}
      </div>
    </div>
  );
}
