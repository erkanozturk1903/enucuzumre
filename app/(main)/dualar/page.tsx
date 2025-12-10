import { Container } from "@/components/ui/container";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookOpen, Sparkles, ChevronRight, Search } from "lucide-react";

export const dynamic = "force-dynamic";

const KATEGORI_COLORS: Record<string, { gradient: string; bgGradient: string }> = {
  "Genel Dua": { gradient: "from-emerald-500 to-teal-500", bgGradient: "from-emerald-50 to-teal-50" },
  "Tavaf Duaları": { gradient: "from-violet-500 to-purple-500", bgGradient: "from-violet-50 to-purple-50" },
  "Safa-Merve Duaları": { gradient: "from-rose-500 to-pink-500", bgGradient: "from-rose-50 to-pink-50" },
  "Hac Özel Duaları": { gradient: "from-blue-500 to-indigo-500", bgGradient: "from-blue-50 to-indigo-50" },
  "Umre Duaları": { gradient: "from-amber-500 to-orange-500", bgGradient: "from-amber-50 to-orange-50" },
};

function getKategoriColor(kategoriAd: string) {
  return KATEGORI_COLORS[kategoriAd] || { gradient: "from-gray-500 to-gray-600", bgGradient: "from-gray-50 to-gray-100" };
}

async function getDualar() {
  try {
    const kategoriler = await prisma.duaKategori.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: {
        dualar: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
      },
    });
    return kategoriler;
  } catch (error) {
    console.error("Dualar alınamadı:", error);
    return [];
  }
}

export default async function DualarPage() {
  const kategoriler = await getDualar();
  const totalDualar = kategoriler.reduce((acc, k) => acc + k.dualar.length, 0);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600">
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
            Hac ve Umre Duaları
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mb-4">
            Kutsal yolculuğunuzda okuyabileceğiniz dualar. Arapça metinleri,
            okunuşları ve Türkçe mealleri ile birlikte.
          </p>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full">
            <Search className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">{totalDualar} dua, {kategoriler.length} kategori</span>
          </div>
        </Container>
      </div>

      <Container className="py-8 md:py-12">
        {/* Kategori Hızlı Erişim */}
        <div className="flex flex-wrap gap-2 mb-8">
          {kategoriler.map((kategori) => {
            const colors = getKategoriColor(kategori.ad);
            return (
              <a
                key={kategori.id}
                href={`#${kategori.ad.toLowerCase().replace(/\s+/g, '-')}`}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${colors.bgGradient} border border-white shadow-sm hover:shadow-md transition-all text-sm font-medium text-gray-700 hover:text-gray-900`}
              >
                {kategori.ad}
                <span className="text-xs text-gray-500">({kategori.dualar.length})</span>
              </a>
            );
          })}
        </div>

        {kategoriler.length > 0 ? (
          <div className="space-y-12">
            {kategoriler.map((kategori) => {
              const colors = getKategoriColor(kategori.ad);
              return (
                <section
                  key={kategori.id}
                  id={kategori.ad.toLowerCase().replace(/\s+/g, '-')}
                  className="scroll-mt-24"
                >
                  {/* Kategori Header */}
                  <div className={`bg-gradient-to-r ${colors.bgGradient} rounded-2xl p-6 mb-6 border border-white shadow-sm`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg`}>
                        <BookOpen className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{kategori.ad}</h2>
                        <p className="text-sm text-gray-600">{kategori.dualar.length} dua</p>
                      </div>
                    </div>
                  </div>

                  {/* Dua Kartları */}
                  <div className="grid gap-4 md:grid-cols-2">
                    {kategori.dualar.map((dua) => (
                      <Link
                        key={dua.id}
                        href={`/dualar/${dua.id}`}
                        className="group relative"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-all duration-500`} />
                        <div className="relative bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                          <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors mb-1">
                            {dua.baslik}
                          </h3>
                          {dua.altBaslik && (
                            <p className="text-sm text-gray-500 mb-4">{dua.altBaslik}</p>
                          )}

                          {/* Arapça Önizleme */}
                          <div className={`bg-gradient-to-br ${colors.bgGradient} rounded-xl p-4 mb-4`}>
                            <p
                              className="text-lg text-gray-800 line-clamp-2 leading-relaxed"
                              dir="rtl"
                              style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
                            >
                              {dua.arapca.slice(0, 120)}...
                            </p>
                          </div>

                          <span className={`inline-flex items-center text-sm font-medium bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
                            Duayı Oku
                            <ChevronRight className="w-4 h-4 ml-1 text-gray-400 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">Henüz dua eklenmemiş.</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-br from-primary/5 via-emerald-50 to-teal-50 rounded-2xl p-8 text-center border border-primary/10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-teal-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Rehberler de İnceleyin
          </h3>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Hac ve Umre ibadetleri hakkında detaylı bilgiler için rehberlerimize göz atın.
          </p>
          <Link
            href="/rehberler"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-teal-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all"
          >
            Rehberleri İncele
            <ChevronRight className="w-5 h-5 ml-1" />
          </Link>
        </div>
      </Container>
    </main>
  );
}
