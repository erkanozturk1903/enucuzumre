import { Container } from "@/components/ui/container";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RehberBolum } from "@prisma/client";
import { Star, Shirt, RotateCcw, Footprints, Moon, ChevronRight, ArrowLeft, CheckCircle2, AlertCircle, BookMarked, Quote } from "lucide-react";

export const dynamic = "force-dynamic";

const BOLUM_INFO: Record<string, { enum: RehberBolum; label: string; icon: any; gradient: string; bgGradient: string }> = {
  umre: { enum: "UMRE", label: "Umre", icon: Star, gradient: "from-emerald-500 to-teal-500", bgGradient: "from-emerald-50 to-teal-50" },
  ihram: { enum: "IHRAM", label: "İhram", icon: Shirt, gradient: "from-amber-500 to-orange-500", bgGradient: "from-amber-50 to-orange-50" },
  tavaf: { enum: "TAVAF", label: "Tavaf", icon: RotateCcw, gradient: "from-violet-500 to-purple-500", bgGradient: "from-violet-50 to-purple-50" },
  say: { enum: "SAY", label: "Sa'y", icon: Footprints, gradient: "from-rose-500 to-pink-500", bgGradient: "from-rose-50 to-pink-50" },
  hac: { enum: "HAC", label: "Hac", icon: Moon, gradient: "from-blue-500 to-indigo-500", bgGradient: "from-blue-50 to-indigo-50" },
};

async function getRehber(bolumKey: string, slug: string) {
  const info = BOLUM_INFO[bolumKey];
  if (!info) return null;

  try {
    const rehber = await prisma.rehber.findFirst({
      where: { bolum: info.enum, slug, isActive: true },
    });
    return rehber ? { info, rehber } : null;
  } catch (error) {
    return null;
  }
}

function Section({ title, children, icon, variant = "default" }: { title: string; children: React.ReactNode; icon?: any; variant?: "default" | "highlight" | "warning" | "dua" }) {
  const Icon = icon;
  const variants = {
    default: "bg-white border-gray-100",
    highlight: "bg-gradient-to-br from-primary/5 to-emerald-50 border-primary/10",
    warning: "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100",
    dua: "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100",
  };
  const titleColors = {
    default: "text-gray-800",
    highlight: "text-primary",
    warning: "text-amber-700",
    dua: "text-emerald-700",
  };

  return (
    <div className={`rounded-2xl border p-6 ${variants[variant]}`}>
      <h3 className={`font-bold mb-4 flex items-center gap-2 ${titleColors[variant]}`}>
        {Icon && <Icon className="w-5 h-5" />}
        {title}
      </h3>
      {children}
    </div>
  );
}

function ListItem({ children, index }: { children: React.ReactNode; index: number }) {
  return (
    <li className="flex items-start gap-3">
      <span className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-emerald-500 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-medium shadow-sm">
        {index + 1}
      </span>
      <span className="text-gray-700 leading-relaxed">{children}</span>
    </li>
  );
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
      <span className="text-gray-700">{children}</span>
    </li>
  );
}

function WarningItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
      <span className="text-gray-700">{children}</span>
    </li>
  );
}

function renderIcerik(icerik: Record<string, any>, gradient: string) {
  const sections: JSX.Element[] = [];

  // Giriş - Öne çıkarılmış
  if (icerik.giris) {
    sections.push(
      <div key="giris" className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 p-6 mb-6">
        <p className="text-lg text-gray-700 leading-relaxed">{icerik.giris}</p>
      </div>
    );
  }

  // Tanım
  if (icerik.tanim) {
    sections.push(
      <Section key="tanim" title="Tanım" icon={BookMarked} variant="highlight">
        <p className="text-gray-600 leading-relaxed">{icerik.tanim}</p>
      </Section>
    );
  }

  // Rükünler
  if (icerik.rukun?.length > 0) {
    sections.push(
      <Section key="rukun" title="Rükünleri" icon={CheckCircle2} variant="highlight">
        <ul className="space-y-3">
          {icerik.rukun.map((item: string, i: number) => (
            <ListItem key={i} index={i}>{item}</ListItem>
          ))}
        </ul>
      </Section>
    );
  }

  // Şartları
  if (icerik.sartlari?.length > 0) {
    sections.push(
      <Section key="sartlari" title="Şartları">
        <ul className="space-y-2">
          {icerik.sartlari.map((item: string, i: number) => (
            <CheckItem key={i}>{item}</CheckItem>
          ))}
        </ul>
      </Section>
    );
  }

  // Faziletler
  if (icerik.faziletler?.length > 0) {
    sections.push(
      <Section key="faziletler" title="Faziletleri" variant="highlight">
        <ul className="space-y-3">
          {icerik.faziletler.map((item: string, i: number) => (
            <ListItem key={i} index={i}>{item}</ListItem>
          ))}
        </ul>
      </Section>
    );
  }

  // Hadisler
  if (icerik.hadisler?.length > 0) {
    sections.push(
      <Section key="hadisler" title="Hadis-i Şerifler" icon={Quote} variant="dua">
        <div className="space-y-4">
          {icerik.hadisler.map((item: string, i: number) => (
            <blockquote key={i} className="border-l-4 border-emerald-300 pl-4 py-2 italic text-gray-700">
              "{item}"
            </blockquote>
          ))}
        </div>
      </Section>
    );
  }

  // Adımlar / Nasıl Yapılır
  const stepsKey = icerik.adimlar ? "adimlar" : icerik.nasil_yapilir ? "nasil_yapilir" : null;
  const stepsTitle = icerik.adimlar ? "Adımlar" : "Nasıl Yapılır?";
  if (stepsKey && icerik[stepsKey]?.length > 0) {
    sections.push(
      <Section key="adimlar" title={stepsTitle} icon={CheckCircle2}>
        <ul className="space-y-3">
          {icerik[stepsKey].map((item: string, i: number) => (
            <ListItem key={i} index={i}>{item}</ListItem>
          ))}
        </ul>
      </Section>
    );
  }

  // Hazırlık kategorileri
  const hazirlikTypes = [
    { key: "ruhsal_hazirlik", title: "Ruhsal Hazırlık" },
    { key: "maddi_hazirlik", title: "Maddi Hazırlık" },
    { key: "bilgi_hazirlik", title: "Bilgi Hazırlığı" },
  ];
  hazirlikTypes.forEach(({ key, title }) => {
    if (icerik[key]?.length > 0) {
      sections.push(
        <Section key={key} title={title}>
          <ul className="space-y-2">
            {icerik[key].map((item: string, i: number) => (
              <CheckItem key={i}>{item}</CheckItem>
            ))}
          </ul>
        </Section>
      );
    }
  });

  // Erkekler/Kadınlar için
  if (icerik.erkekler_icin?.length > 0) {
    sections.push(
      <Section key="erkekler" title="Erkekler İçin">
        <ul className="space-y-2">
          {icerik.erkekler_icin.map((item: string, i: number) => (
            <CheckItem key={i}>{item}</CheckItem>
          ))}
        </ul>
      </Section>
    );
  }
  if (icerik.kadinlar_icin?.length > 0) {
    sections.push(
      <Section key="kadinlar" title="Kadınlar İçin">
        <ul className="space-y-2">
          {icerik.kadinlar_icin.map((item: string, i: number) => (
            <CheckItem key={i}>{item}</CheckItem>
          ))}
        </ul>
      </Section>
    );
  }

  // Yasaklar
  const yasakTypes = [
    { key: "genel_yasaklar", title: "Genel Yasaklar" },
    { key: "erkek_yasaklari", title: "Erkek Yasakları" },
    { key: "kadin_yasaklari", title: "Kadın Yasakları" },
  ];
  yasakTypes.forEach(({ key, title }) => {
    if (icerik[key]?.length > 0) {
      sections.push(
        <Section key={key} title={title} icon={AlertCircle} variant="warning">
          <ul className="space-y-2">
            {icerik[key].map((item: string, i: number) => (
              <WarningItem key={i}>{item}</WarningItem>
            ))}
          </ul>
        </Section>
      );
    }
  });

  // Zamanlar
  const zamanTypes = [
    { key: "en_uygun_zamanlar", title: "En Uygun Zamanlar" },
    { key: "sakincali_zamanlar", title: "Sakıncalı Zamanlar", variant: "warning" as const },
    { key: "zamanlar", title: "Zamanlar" },
  ];
  zamanTypes.forEach(({ key, title, variant }) => {
    if (icerik[key]?.length > 0) {
      sections.push(
        <Section key={key} title={title} variant={variant || "default"}>
          <ul className="space-y-2">
            {icerik[key].map((item: string, i: number) => (
              variant === "warning" ? <WarningItem key={i}>{item}</WarningItem> : <CheckItem key={i}>{item}</CheckItem>
            ))}
          </ul>
        </Section>
      );
    }
  });

  // Dua ve niyet içerikleri
  const duaTypes = [
    { key: "niyet", title: "Niyet" },
    { key: "telbiye", title: "Telbiye" },
    { key: "telbiye_meali", title: "Telbiye Meali" },
    { key: "genel_dua", title: "Dua" },
    { key: "dua_meali", title: "Dua Meali" },
  ];
  duaTypes.forEach(({ key, title }) => {
    if (icerik[key] && typeof icerik[key] === "string") {
      sections.push(
        <Section key={key} title={title} variant="dua">
          <p className="text-emerald-800 italic leading-relaxed text-lg">{icerik[key]}</p>
        </Section>
      );
    }
  });

  // Özel durumlar
  if (icerik.ozel_durumlar?.length > 0) {
    sections.push(
      <Section key="ozel" title="Özel Durumlar">
        <ul className="space-y-3">
          {icerik.ozel_durumlar.map((item: string, i: number) => (
            <ListItem key={i} index={i}>{item}</ListItem>
          ))}
        </ul>
      </Section>
    );
  }

  // Önemli notlar
  if (icerik.onemli_notlar?.length > 0) {
    sections.push(
      <Section key="notlar" title="Önemli Notlar" icon={AlertCircle} variant="warning">
        <ul className="space-y-2">
          {icerik.onemli_notlar.map((item: string, i: number) => (
            <WarningItem key={i}>{item}</WarningItem>
          ))}
        </ul>
      </Section>
    );
  }

  // Ne yapılır
  if (icerik.ne_yapilir?.length > 0) {
    sections.push(
      <Section key="neyapilir" title="Ne Yapılır?">
        <ul className="space-y-3">
          {icerik.ne_yapilir.map((item: string, i: number) => (
            <ListItem key={i} index={i}>{item}</ListItem>
          ))}
        </ul>
      </Section>
    );
  }

  // Tekil bilgi alanları
  const singleTypes = [
    { key: "onem", title: "Önemi" },
    { key: "onemi", title: "Önemi" },
    { key: "tarihce", title: "Tarihçe" },
    { key: "tarihi_onem", title: "Tarihi Önem" },
    { key: "istilam", title: "İstilam" },
    { key: "farziyeti", title: "Farziyeti" },
    { key: "zaman", title: "Zaman" },
    { key: "tarih", title: "Tarih" },
    { key: "nerede", title: "Nerede" },
    { key: "safa_tepesi", title: "Safa Tepesi" },
    { key: "merve_tepesi", title: "Merve Tepesi" },
    { key: "aralarindaki_mesafe", title: "Aralarındaki Mesafe" },
    { key: "ifrad_haci", title: "İfrad Haccı" },
    { key: "kiran_haci", title: "Kıran Haccı" },
    { key: "temettu_haci", title: "Temettü Haccı" },
    { key: "en_uygun", title: "En Uygun Yöntem" },
  ];
  singleTypes.forEach(({ key, title }) => {
    if (icerik[key] && typeof icerik[key] === "string") {
      sections.push(
        <Section key={key} title={title}>
          <p className="text-gray-600 leading-relaxed">{icerik[key]}</p>
        </Section>
      );
    }
  });

  // Kaynak
  if (icerik.kaynak) {
    sections.push(
      <div key="kaynak" className="text-sm text-gray-500 bg-gray-50 rounded-xl p-4 mt-4">
        <span className="font-medium">Kaynak:</span> {icerik.kaynak}
      </div>
    );
  }

  return sections;
}

export default async function RehberDetayPage({ params }: { params: Promise<{ bolum: string; slug: string }> }) {
  const { bolum, slug } = await params;
  const data = await getRehber(bolum, slug);

  if (!data) {
    notFound();
  }

  const { info, rehber } = data;
  const Icon = info.icon;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${info.gradient}`}>
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <Container className="relative py-10 md:py-14">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/70 mb-6 text-sm flex-wrap">
            <Link href="/rehberler" className="hover:text-white transition-colors">
              Rehberler
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/rehberler/${bolum}`} className="hover:text-white transition-colors">
              {info.label}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{rehber.baslik}</span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Icon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {rehber.baslik}
          </h1>
          {rehber.altBaslik && (
            <p className="text-white/80 text-lg">{rehber.altBaslik}</p>
          )}
        </Container>
      </div>

      <Container className="py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          {/* İçerik */}
          <div className="space-y-6">
            {renderIcerik(rehber.icerik as Record<string, any>, info.gradient)}
          </div>

          {/* Navigation */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <Link
              href={`/rehberler/${bolum}`}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{info.label} Rehberine Dön</span>
            </Link>
            <Link
              href="/rehberler"
              className={`inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r ${info.gradient} text-white font-medium rounded-xl hover:shadow-lg transition-all`}
            >
              Tüm Rehberleri Gör
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
