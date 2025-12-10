import { Container } from "@/components/ui/container";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { RehberBolum } from "@prisma/client";
import { Star, Shirt, RotateCcw, Footprints, Moon, ChevronRight, BookOpen, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

const BOLUM_INFO: Record<RehberBolum, {
  label: string;
  icon: any;
  gradient: string;
  bgGradient: string;
  desc: string;
  detailDesc: string;
}> = {
  UMRE: {
    label: "Umre",
    icon: Star,
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-50 to-teal-50",
    desc: "Küçük hac ibadeti",
    detailDesc: "Umre ibadeti, rükünleri ve faziletleri hakkında kapsamlı bilgiler"
  },
  IHRAM: {
    label: "İhram",
    icon: Shirt,
    gradient: "from-amber-500 to-orange-500",
    bgGradient: "from-amber-50 to-orange-50",
    desc: "Kutsal kıyafet",
    detailDesc: "İhram kuralları, giyinme şekli ve yasaklar"
  },
  TAVAF: {
    label: "Tavaf",
    icon: RotateCcw,
    gradient: "from-violet-500 to-purple-500",
    bgGradient: "from-violet-50 to-purple-50",
    desc: "Kabe'yi dönmek",
    detailDesc: "Tavaf ibadeti, çeşitleri ve duaları"
  },
  SAY: {
    label: "Sa'y",
    icon: Footprints,
    gradient: "from-rose-500 to-pink-500",
    bgGradient: "from-rose-50 to-pink-50",
    desc: "Safa-Merve yürüyüşü",
    detailDesc: "Safa ve Merve tepeleri arası sa'y ibadeti"
  },
  HAC: {
    label: "Hac",
    icon: Moon,
    gradient: "from-blue-500 to-indigo-500",
    bgGradient: "from-blue-50 to-indigo-50",
    desc: "Büyük ibadet",
    detailDesc: "Hac menasikleri, çeşitleri ve önemli bilgiler"
  },
};

async function getRehberler() {
  try {
    const rehberler = await prisma.rehber.findMany({
      where: { isActive: true },
      orderBy: [{ bolum: "asc" }, { order: "asc" }],
    });

    const grouped = rehberler.reduce((acc, r) => {
      if (!acc[r.bolum]) acc[r.bolum] = [];
      acc[r.bolum].push(r);
      return acc;
    }, {} as Record<RehberBolum, typeof rehberler>);

    return grouped;
  } catch (error) {
    console.error("Rehberler alınamadı:", error);
    return {} as Record<RehberBolum, never[]>;
  }
}

export default async function RehberlerPage() {
  const rehberlerByBolum = await getRehberler();
  const bolumler = Object.keys(BOLUM_INFO) as RehberBolum[];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-emerald-600 to-teal-600">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <Container className="relative py-12 md:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <Sparkles className="w-5 h-5 text-yellow-300" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Hac ve Umre Rehberi
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Kutsal yolculuğunuz için hazırladığımız kapsamlı rehberler ile
            ibadetlerinizi en doğru şekilde yerine getirin.
          </p>
        </Container>
      </div>

      <Container className="py-8 md:py-12">
        {/* Bölüm Kartları */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-12">
          {bolumler.map((bolum) => {
            const info = BOLUM_INFO[bolum];
            const Icon = info.icon;
            const rehberCount = rehberlerByBolum[bolum]?.length || 0;

            return (
              <Link
                key={bolum}
                href={`/rehberler/${bolum.toLowerCase()}`}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${info.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500`} />
                <div className={`relative bg-gradient-to-br ${info.bgGradient} rounded-2xl p-5 border border-white shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1`}>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${info.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {info.label}
                  </h2>
                  <p className="text-sm text-gray-600 mb-3">{info.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 bg-white/60 px-2 py-1 rounded-full">
                      {rehberCount} rehber
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Tüm Rehberler - Bölüm bazlı */}
        <div className="space-y-8">
          {bolumler.map((bolum) => {
            const rehberler = rehberlerByBolum[bolum] || [];
            const info = BOLUM_INFO[bolum];
            const Icon = info.icon;

            if (rehberler.length === 0) return null;

            return (
              <div key={bolum} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Bölüm Header */}
                <div className={`bg-gradient-to-r ${info.bgGradient} px-6 py-4 border-b border-gray-100`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${info.gradient} flex items-center justify-center shadow-md`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{info.label}</h3>
                        <p className="text-xs text-gray-500">{info.detailDesc}</p>
                      </div>
                    </div>
                    <Link
                      href={`/rehberler/${bolum.toLowerCase()}`}
                      className={`text-sm font-medium bg-gradient-to-r ${info.gradient} bg-clip-text text-transparent hover:opacity-80 transition-opacity flex items-center gap-1`}
                    >
                      Tümünü Gör
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  </div>
                </div>

                {/* Rehber Listesi */}
                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                  {rehberler.map((r, index) => (
                    <Link
                      key={r.id}
                      href={`/rehberler/${bolum.toLowerCase()}/${r.slug}`}
                      className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors group"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${info.bgGradient} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                        <span className={`text-lg font-bold bg-gradient-to-br ${info.gradient} bg-clip-text text-transparent`}>
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                          {r.baslik}
                        </h4>
                        {r.altBaslik && (
                          <p className="text-sm text-gray-500 truncate">{r.altBaslik}</p>
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-br from-primary/5 via-emerald-50 to-teal-50 rounded-2xl p-8 text-center border border-primary/10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-teal-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Moon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Kutsal Yolculuğa Hazır mısınız?
          </h3>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Umre turlarımızı inceleyin ve hayalinizdeki manevi yolculuğa adım atın.
          </p>
          <Link
            href="/umre-turlari"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-teal-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all"
          >
            Umre Turlarını İncele
            <ChevronRight className="w-5 h-5 ml-1" />
          </Link>
        </div>
      </Container>
    </main>
  );
}
