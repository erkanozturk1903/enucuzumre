import { Container } from "@/components/ui/container";
import { Award, Users, Heart, Shield } from "lucide-react";
import { prisma } from "@/lib/prisma";

async function getSiteSettings() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "site_settings" },
    });
    return settings;
  } catch (error) {
    console.error("Site ayarları alınamadı:", error);
    return null;
  }
}

export default async function HakkimizdaPage() {
  const settings = await getSiteSettings();

  const yearsExperience = settings?.yearsExperience || 20;
  const totalGuests = settings?.totalGuests || 50000;
  const satisfactionRate = settings?.satisfactionRate || 98;
  const companyStory = settings?.companyStory || `En Ucuz Hac Umre, 2005 yılından bu yana Hac ve Umre yolculuklarında misafirlerine en iyi hizmeti sunma vizyonuyla kurulmuştur. Sektördeki ${yearsExperience} yıllık tecrübemizle, her yıl binlerce misafirimizi kutsal topraklara uğurlamanın gururunu yaşıyoruz.

Misyonumuz, manevi yolculuğunuzda yanınızda olmak ve bu mübarek ibadeti en konforlu, güvenli ve ekonomik şekilde gerçekleştirmenize yardımcı olmaktır. Türsab belgeli, resmi bir acente olarak tüm işlemlerinizi yasalara uygun şekilde yürütüyoruz.`;
  const missionStatement = settings?.missionStatement || "Hac ve Umre ibadetini yerine getirmek isteyen müşterilerimize, en uygun fiyatlarla, en kaliteli hizmeti sunmak. Manevi yolculuklarında yanlarında olmak ve unutulmaz bir deneyim yaşatmak.";
  const visionStatement = settings?.visionStatement || "Türkiye'nin en güvenilir ve tercih edilen Hac-Umre organizasyon şirketi olmak. Sektörde kalite ve müşteri memnuniyeti standartlarını belirleyen öncü bir marka haline gelmek.";

  return (
    <main className="min-h-screen bg-gray-50/50">
      <Container className="pt-4 pb-8 md:pt-6 md:pb-12">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-primary mb-1">
            Hakkımızda
          </h1>
          <p className="text-sm text-gray-600">
            {yearsExperience} yıllık tecrübemizle, misafirlerimize en güvenilir ve kaliteli hizmeti sunuyoruz.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 mb-6">
          <h2 className="text-lg font-bold text-primary mb-4">Hikayemiz</h2>
          <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
            {companyStory}
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-gray-100 text-center hover:shadow-lg transition-shadow">
            <div className="bg-[#059669]/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="h-6 w-6 text-[#059669]" />
            </div>
            <h3 className="font-bold text-primary text-lg mb-1">{yearsExperience} Yıl</h3>
            <p className="text-xs text-gray-600">Tecrübe</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-100 text-center hover:shadow-lg transition-shadow">
            <div className="bg-[#059669]/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-[#059669]" />
            </div>
            <h3 className="font-bold text-primary text-lg mb-1">{totalGuests.toLocaleString("tr-TR")}+</h3>
            <p className="text-xs text-gray-600">Mutlu Misafir</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-100 text-center hover:shadow-lg transition-shadow">
            <div className="bg-[#059669]/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="h-6 w-6 text-[#059669]" />
            </div>
            <h3 className="font-bold text-primary text-lg mb-1">%{satisfactionRate}</h3>
            <p className="text-xs text-gray-600">Memnuniyet</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-100 text-center hover:shadow-lg transition-shadow">
            <div className="bg-[#059669]/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="h-6 w-6 text-[#059669]" />
            </div>
            <h3 className="font-bold text-primary text-lg mb-1">Türsab</h3>
            <p className="text-xs text-gray-600">Onaylı</p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-xl border border-gray-100">
            <h3 className="text-lg font-bold text-primary mb-3">Misyonumuz</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{missionStatement}</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100">
            <h3 className="text-lg font-bold text-primary mb-3">Vizyonumuz</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{visionStatement}</p>
          </div>
        </div>
      </Container>
    </main>
  );
}
