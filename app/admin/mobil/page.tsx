import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  BookOpen,
  Map,
  MapPin,
  CheckSquare,
  HelpCircle,
  ArrowRight,
  Smartphone,
  RefreshCw,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface StatCard {
  title: string;
  count: number;
  unit: string;
  icon: React.ElementType;
  href: string;
  color: string;
  bgColor: string;
}

async function getStats() {
  try {
    // Gerçek veriler - modeller eklendikçe güncellenir
    const [dualarCount, rehberlerCount, ziyaretYerleriCount, gorevlerCount, sssCount] = await Promise.all([
      prisma.dua.count({ where: { isActive: true } }),
      prisma.rehber.count({ where: { isActive: true } }),
      prisma.ziyaretYeri.count({ where: { isActive: true } }),
      prisma.gorev.count({ where: { isActive: true } }),
      prisma.mobilSSS.count({ where: { isActive: true } }),
    ]);

    const stats = {
      dualar: dualarCount,
      rehberler: rehberlerCount,
      ziyaretYerleri: ziyaretYerleriCount,
      gorevler: gorevlerCount,
      sss: sssCount,
    };

    return stats;
  } catch (error) {
    console.error("Stats alınamadı:", error);
    return {
      dualar: 0,
      rehberler: 0,
      ziyaretYerleri: 0,
      gorevler: 0,
      sss: 0,
    };
  }
}

export default async function MobilDashboardPage() {
  const stats = await getStats();

  const cards: StatCard[] = [
    {
      title: "Dualar",
      count: stats.dualar,
      unit: "adet",
      icon: BookOpen,
      href: "/admin/mobil/dualar",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Rehberler",
      count: stats.rehberler,
      unit: "adet",
      icon: Map,
      href: "/admin/mobil/rehberler",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Ziyaret Yerleri",
      count: stats.ziyaretYerleri,
      unit: "yer",
      icon: MapPin,
      href: "/admin/mobil/ziyaret-yerleri",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Yapılacaklar",
      count: stats.gorevler,
      unit: "görev",
      icon: CheckSquare,
      href: "/admin/mobil/yapilacaklar",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Mobil SSS",
      count: stats.sss,
      unit: "soru",
      icon: HelpCircle,
      href: "/admin/mobil/sss",
      color: "text-rose-600",
      bgColor: "bg-rose-50",
    },
  ];

  const lastUpdate = new Date().toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Smartphone className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Mobil Uygulama İçerik Yönetimi
            </h1>
          </div>
          <p className="text-gray-600">
            Tüm mobil uygulama içeriklerini buradan yönetebilirsiniz. Değişiklikler
            uygulama tarafından otomatik olarak senkronize edilir.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-gray-300 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.bgColor}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {card.count}
              </p>
              <p className="text-sm text-gray-500">{card.unit}</p>
            </div>
            <p className="text-sm font-medium text-gray-700 mt-3">
              {card.title}
            </p>
          </Link>
        ))}
      </div>

      {/* Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Durumu */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            API Durumu
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Durum</span>
              <span className="flex items-center gap-2 text-emerald-600 font-medium">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Aktif
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Son Güncelleme</span>
              <span className="text-gray-900 font-medium">{lastUpdate}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">API Versiyon</span>
              <span className="text-gray-900 font-medium">v1.0.0</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">Endpoint</span>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                /api/mobil/sync
              </code>
            </div>
          </div>
        </div>

        {/* Hızlı İşlemler */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Hızlı İşlemler
          </h2>
          <div className="space-y-3">
            <Link
              href="/admin/mobil/dualar"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-emerald-50 rounded-lg">
                <BookOpen className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Yeni Dua Ekle</p>
                <p className="text-sm text-gray-500">
                  Dua koleksiyonuna yeni dua ekleyin
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </Link>

            <Link
              href="/admin/mobil/rehberler"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-blue-50 rounded-lg">
                <Map className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Rehber Düzenle</p>
                <p className="text-sm text-gray-500">
                  Mevcut rehber içeriklerini güncelleyin
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </Link>

            <Link
              href="/admin/mobil/ziyaret-yerleri"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-purple-50 rounded-lg">
                <MapPin className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Ziyaret Yeri Ekle</p>
                <p className="text-sm text-gray-500">
                  Mekke veya Medine'ye yeni yer ekleyin
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bilgi Notu */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex gap-3">
          <RefreshCw className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800">Senkronizasyon Bilgisi</p>
            <p className="text-sm text-amber-700 mt-1">
              Admin panelden yaptığınız değişiklikler, mobil uygulama tarafından
              periyodik olarak (her 24 saatte bir) veya kullanıcı manuel
              yenileme yaptığında senkronize edilir. İnternet bağlantısı olmayan
              kullanıcılar son indirilen verileri görmeye devam eder.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
