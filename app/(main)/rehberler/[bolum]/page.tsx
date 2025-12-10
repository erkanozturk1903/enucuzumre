import { Container } from "@/components/ui/container";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RehberBolum } from "@prisma/client";
import { Star, Shirt, RotateCcw, Footprints, Moon, ChevronRight, ArrowLeft, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

const BOLUM_INFO: Record<string, {
  enum: RehberBolum;
  label: string;
  icon: any;
  gradient: string;
  bgGradient: string;
  desc: string;
}> = {
  umre: {
    enum: "UMRE",
    label: "Umre",
    icon: Star,
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-50 to-teal-50",
    desc: "Umre ibadeti hakkında bilmeniz gereken her şey"
  },
  ihram: {
    enum: "IHRAM",
    label: "İhram",
    icon: Shirt,
    gradient: "from-amber-500 to-orange-500",
    bgGradient: "from-amber-50 to-orange-50",
    desc: "İhram kuralları, giyinme şekli ve yasaklar"
  },
  tavaf: {
    enum: "TAVAF",
    label: "Tavaf",
    icon: RotateCcw,
    gradient: "from-violet-500 to-purple-500",
    bgGradient: "from-violet-50 to-purple-50",
    desc: "Kabe'yi tavaf etme ibadeti ve adabı"
  },
  say: {
    enum: "SAY",
    label: "Sa'y",
    icon: Footprints,
    gradient: "from-rose-500 to-pink-500",
    bgGradient: "from-rose-50 to-pink-50",
    desc: "Safa ve Merve tepeleri arasında sa'y ibadeti"
  },
  hac: {
    enum: "HAC",
    label: "Hac",
    icon: Moon,
    gradient: "from-blue-500 to-indigo-500",
    bgGradient: "from-blue-50 to-indigo-50",
    desc: "Hac ibadeti menasikleri ve önemli bilgiler"
  },
};

async function getRehberler(bolumKey: string) {
  const info = BOLUM_INFO[bolumKey];
  if (!info) return null;

  try {
    const rehberler = await prisma.rehber.findMany({
      where: { bolum: info.enum, isActive: true },
      orderBy: { order: "asc" },
    });
    return { info, rehberler };
  } catch (error) {
    return null;
  }
}

export default async function BolumPage({ params }: { params: Promise<{ bolum: string }> }) {
  const { bolum } = await params;
  const data = await getRehberler(bolum);

  if (!data) {
    notFound();
  }

  const { info, rehberler } = data;
  const Icon = info.icon;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${info.gradient}`}>
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <Container className="relative py-10 md:py-14">
          {/* Breadcrumb */}
          <Link
            href="/rehberler"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Tüm Rehberler</span>
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Icon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {info.label} Rehberi
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            {info.desc}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full">
            <BookOpen className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">{rehberler.length} rehber içerik</span>
          </div>
        </Container>
      </div>

      <Container className="py-8 md:py-12">
        {/* Rehber Listesi */}
        {rehberler.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {rehberler.map((r, index) => (
              <Link
                key={r.id}
                href={`/rehberler/${bolum}/${r.slug}`}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${info.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-all duration-500`} />
                <div className="relative bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${info.bgGradient} flex items-center justify-center flex-shrink-0`}>
                      <span className={`text-2xl font-bold bg-gradient-to-br ${info.gradient} bg-clip-text text-transparent`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-1">
                        {r.baslik}
                      </h2>
                      {r.altBaslik && (
                        <p className="text-gray-500 text-sm mb-3">{r.altBaslik}</p>
                      )}
                      <span className={`inline-flex items-center text-sm font-medium bg-gradient-to-r ${info.gradient} bg-clip-text text-transparent`}>
                        Rehberi Oku
                        <ChevronRight className="w-4 h-4 ml-1 text-gray-400 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${info.bgGradient} flex items-center justify-center mx-auto mb-4`}>
              <Icon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">Bu bölümde henüz rehber içerik eklenmemiş.</p>
          </div>
        )}

        {/* Diğer Bölümler */}
        <div className="mt-12">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Diğer Bölümler</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(BOLUM_INFO)
              .filter(([key]) => key !== bolum)
              .map(([key, b]) => {
                const BIcon = b.icon;
                return (
                  <Link
                    key={key}
                    href={`/rehberler/${key}`}
                    className={`flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br ${b.bgGradient} hover:shadow-md transition-all group`}
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${b.gradient} flex items-center justify-center`}>
                      <BIcon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-gray-800 group-hover:text-gray-900">{b.label}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" />
                  </Link>
                );
              })}
          </div>
        </div>
      </Container>
    </main>
  );
}
