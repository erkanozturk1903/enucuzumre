import { Container } from "@/components/ui/container";
import { prisma } from "@/lib/prisma";
import { BankAccountList } from "@/components/bank-account-list";

const DEFAULT_PAGE_DESC = "Güvenli ödeme için banka hesap bilgilerimiz";
const DEFAULT_WARNING_TEXT = `<ul>
<li>Lütfen ödeme açıklamasına adınızı ve rezervasyon numaranızı yazmayı unutmayın</li>
<li>Ödeme yaptıktan sonra dekontunuzu WhatsApp veya e-posta ile bize iletin</li>
<li>Yukarıda belirtilen hesaplar dışında ödeme yapmayınız</li>
</ul>`;

async function getPageData() {
  try {
    const [accounts, settings] = await Promise.all([
      prisma.bankAccount.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
      prisma.siteSettings.findUnique({
        where: { id: "site_settings" },
      }),
    ]);
    return { accounts, settings };
  } catch (error) {
    console.error("Banka hesapları alınamadı:", error);
    return { accounts: [], settings: null };
  }
}

export default async function BankaHesaplariPage() {
  const { accounts, settings } = await getPageData();
  const pageDesc = settings?.pageDescBanka || DEFAULT_PAGE_DESC;
  const warningText = settings?.bankWarningText || DEFAULT_WARNING_TEXT;

  // Parse warning text as list items if it contains <li> tags
  const isHtmlList = warningText.includes("<li>");

  return (
    <main className="min-h-screen bg-gray-50/50">
      <Container className="pt-4 pb-8 md:pt-6 md:pb-12">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-primary mb-1">
            Banka Hesapları
          </h1>
          <p className="text-sm text-gray-600">
            {pageDesc}
          </p>
        </div>

        {accounts.length > 0 ? (
          <>
            <BankAccountList accounts={accounts} />

            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-yellow-900 text-sm mb-2">
                <strong>Önemli Uyarı:</strong>
              </p>
              {isHtmlList ? (
                <div
                  className="text-yellow-800 text-sm space-y-1 [&_ul]:list-disc [&_ul]:list-inside [&_li]:ml-0"
                  dangerouslySetInnerHTML={{ __html: warningText }}
                />
              ) : (
                <p className="text-yellow-800 text-sm">{warningText}</p>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-500">Banka hesap bilgileri henüz eklenmemiş.</p>
          </div>
        )}
      </Container>
    </main>
  );
}
