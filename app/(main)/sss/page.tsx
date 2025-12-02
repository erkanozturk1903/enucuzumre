import { Container } from "@/components/ui/container";
import { prisma } from "@/lib/prisma";
import { FAQAccordion } from "@/components/faq-accordion";
import Link from "next/link";

const DEFAULT_PAGE_DESC = "Hac ve Umre ile ilgili merak ettiğiniz soruların cevapları";

async function getPageData() {
  try {
    const [faqs, settings] = await Promise.all([
      prisma.fAQ.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
      prisma.siteSettings.findUnique({
        where: { id: "site_settings" },
      }),
    ]);
    return { faqs, settings };
  } catch (error) {
    console.error("SSS alınamadı:", error);
    return { faqs: [], settings: null };
  }
}

export default async function SSSPage() {
  const { faqs, settings } = await getPageData();
  const pageDesc = settings?.pageDescSss || DEFAULT_PAGE_DESC;

  return (
    <main className="min-h-screen bg-gray-50/50">
      <Container className="pt-4 pb-8 md:pt-6 md:pb-12">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-primary mb-1">
            Sıkça Sorulan Sorular
          </h1>
          <p className="text-sm text-gray-600">
            {pageDesc}
          </p>
        </div>

        {faqs.length > 0 ? (
          <div className="max-w-3xl space-y-4">
            <FAQAccordion faqs={faqs} />

            <div className="mt-8 text-center bg-white p-6 rounded-xl border border-gray-100">
              <h3 className="font-bold text-primary mb-2">
                Sorunuza cevap bulamadınız mı?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Bizimle iletişime geçin, size yardımcı olmaktan mutluluk duyarız.
              </p>
              <Link
                href="/iletisim"
                className="inline-flex items-center px-5 py-2 bg-[#059669] hover:bg-[#047857] text-white font-medium text-sm rounded-lg transition-colors"
              >
                İletişime Geç
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-500">Henüz soru eklenmemiş.</p>
          </div>
        )}
      </Container>
    </main>
  );
}
