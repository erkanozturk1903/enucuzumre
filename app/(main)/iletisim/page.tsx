import { Container } from "@/components/ui/container";
import { prisma } from "@/lib/prisma";
import { ContactForm } from "@/components/contact-form";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

// Default açıklama
const DEFAULT_PAGE_DESC = "Sorularınız için bize ulaşın. Size en iyi hizmeti sunmak için buradayız.";
const DEFAULT_WORKING_HOURS = "Pzt - Cmt: 09:00 - 18:00";
const DEFAULT_RESPONSE_TIME = "24 saat içinde yanıt";

async function getPageData() {
  try {
    const [settings, subjects] = await Promise.all([
      prisma.siteSettings.findUnique({
        where: { id: "site_settings" },
      }),
      prisma.contactSubject.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
    ]);

    return { settings, subjects };
  } catch (error) {
    console.error("Sayfa verileri alınamadı:", error);
    return { settings: null, subjects: [] };
  }
}

export default async function IletisimPage() {
  const { settings, subjects } = await getPageData();

  const phone = settings?.contactPhone || "+90 555 555 55 55";
  const email = settings?.email || "info@enucuzhacumre.com";
  const whatsapp = settings?.whatsappNumber || "+905555555555";
  const address = settings?.address || "Fatih Sultan Mehmet Mah. İstanbul Cad. No:123 Fatih/İstanbul";
  const pageDesc = settings?.pageDescIletisim || DEFAULT_PAGE_DESC;
  const workingHours = settings?.workingHours || DEFAULT_WORKING_HOURS;
  const responseTime = settings?.responseTime || DEFAULT_RESPONSE_TIME;

  return (
    <main className="min-h-screen bg-gray-50/50">
      <Container className="pt-4 pb-8 md:pt-6 md:pb-12">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-primary mb-1">
            İletişim
          </h1>
          <p className="text-sm text-gray-600">
            {pageDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-4">
            {/* Phone */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-[#059669]/10 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                <Phone className="h-5 w-5 text-[#059669]" />
              </div>
              <h3 className="font-bold text-primary text-sm mb-1">Telefon</h3>
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="text-gray-600 hover:text-[#059669] transition-colors text-sm">
                {phone}
              </a>
              <p className="text-xs text-gray-500 mt-1">{workingHours}</p>
            </div>

            {/* Email */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-[#059669]/10 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                <Mail className="h-5 w-5 text-[#059669]" />
              </div>
              <h3 className="font-bold text-primary text-sm mb-1">E-posta</h3>
              <a href={`mailto:${email}`} className="text-gray-600 hover:text-[#059669] transition-colors text-sm break-all">
                {email}
              </a>
              <p className="text-xs text-gray-500 mt-1">{responseTime}</p>
            </div>

            {/* WhatsApp */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-[#25D366]/10 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                <MessageCircle className="h-5 w-5 text-[#25D366]" />
              </div>
              <h3 className="font-bold text-primary text-sm mb-1">WhatsApp</h3>
              <a
                href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#25D366] transition-colors text-sm"
              >
                {phone}
              </a>
              <p className="text-xs text-gray-500 mt-1">Anında destek</p>
            </div>

            {/* Address */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-[#059669]/10 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                <MapPin className="h-5 w-5 text-[#059669]" />
              </div>
              <h3 className="font-bold text-primary text-sm mb-1">Adres</h3>
              <p className="text-gray-600 text-sm">{address}</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <h2 className="text-lg font-bold text-primary mb-4">Bize Mesaj Gönderin</h2>
              <ContactForm subjects={subjects} />
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
