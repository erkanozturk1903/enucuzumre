import { Container } from "@/components/ui/container";
import { prisma } from "@/lib/prisma";
import { FileText, Shield, Award, Building } from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  Shield,
  Award,
  Building,
};

const DEFAULT_PAGE_DESC = "Resmi ve yasal tüm belgelerimizle güvenilir hizmet sunuyoruz";

async function getPageData() {
  try {
    const [certificates, settings] = await Promise.all([
      prisma.certificate.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
      prisma.siteSettings.findUnique({
        where: { id: "site_settings" },
      }),
    ]);
    return { certificates, settings };
  } catch (error) {
    console.error("Belgeler alınamadı:", error);
    return { certificates: [], settings: null };
  }
}

export default async function BelgelerimizPage() {
  const { certificates, settings } = await getPageData();
  const pageDesc = settings?.pageDescBelgeler || DEFAULT_PAGE_DESC;

  return (
    <main className="min-h-screen bg-gray-50/50">
      <Container className="pt-4 pb-8 md:pt-6 md:pb-12">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-primary mb-1">
            Belgelerimiz
          </h1>
          <p className="text-sm text-gray-600">
            {pageDesc}
          </p>
        </div>

        {certificates.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {certificates.map((cert) => {
                const IconComponent = ICON_MAP[cert.icon] || FileText;
                return (
                  <div
                    key={cert.id}
                    className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow"
                  >
                    <div className="bg-[#059669]/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                      <IconComponent className="h-7 w-7 text-[#059669]" />
                    </div>
                    <h3 className="text-lg font-bold text-primary mb-1">{cert.title}</h3>
                    <p className="text-sm font-mono text-[#059669] mb-2">{cert.number}</p>
                    {cert.description && (
                      <p className="text-gray-600 text-sm">{cert.description}</p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-blue-900 text-sm">
                <strong>Not:</strong> Tüm belgelerimiz güncel ve geçerlidir. Belge doğrulaması için
                ofisimizi ziyaret edebilir veya ilgili resmi kurumlardan teyit alabilirsiniz.
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-500">Belgeler henüz eklenmemiş.</p>
          </div>
        )}
      </Container>
    </main>
  );
}
