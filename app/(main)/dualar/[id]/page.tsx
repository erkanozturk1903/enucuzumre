import { Container } from "@/components/ui/container";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, ChevronRight, ArrowLeft, Volume2, BookMarked, Languages, FileText } from "lucide-react";

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

async function getDua(id: string) {
  try {
    const dua = await prisma.dua.findUnique({
      where: { id },
      include: { kategori: true },
    });
    return dua;
  } catch (error) {
    return null;
  }
}

export default async function DuaDetayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dua = await getDua(id);

  if (!dua) {
    notFound();
  }

  const colors = getKategoriColor(dua.kategori.ad);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${colors.gradient}`}>
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <Container className="relative py-10 md:py-14">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/70 mb-6 text-sm flex-wrap">
            <Link href="/dualar" className="hover:text-white transition-colors">
              Dualar
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{dua.baslik}</span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-white text-sm mb-3">
            {dua.kategori.ad}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {dua.baslik}
          </h1>
          {dua.altBaslik && (
            <p className="text-white/80 text-lg">{dua.altBaslik}</p>
          )}
        </Container>
      </div>

      <Container className="py-8 md:py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Arapça */}
          <div className={`bg-gradient-to-br ${colors.bgGradient} rounded-2xl border border-white p-6 md:p-8`}>
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center`}>
                <BookMarked className="w-5 h-5 text-white" />
              </div>
              <h2 className="font-bold text-gray-800">Arapça Metin</h2>
            </div>
            <p
              className="text-2xl md:text-3xl text-gray-800 leading-[2.5]"
              dir="rtl"
              style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
            >
              {dua.arapca}
            </p>
          </div>

          {/* Okunuşu */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                <Volume2 className="w-5 h-5 text-white" />
              </div>
              <h2 className="font-bold text-gray-800">Okunuşu</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed italic">
              {dua.okunusu}
            </p>
          </div>

          {/* Türkçe Meali */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                <Languages className="w-5 h-5 text-white" />
              </div>
              <h2 className="font-bold text-gray-800">Türkçe Meali</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {dua.meali}
            </p>
          </div>

          {/* Kaynak */}
          {dua.kaynak && (
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-2 text-gray-600">
                <FileText className="w-5 h-5" />
                <span className="font-medium">Kaynak:</span>
                <span>{dua.kaynak}</span>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-gray-100">
            <Link
              href="/dualar"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Tüm Dualara Dön</span>
            </Link>
            <Link
              href="/rehberler"
              className={`inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r ${colors.gradient} text-white font-medium rounded-xl hover:shadow-lg transition-all`}
            >
              Rehberleri İncele
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
