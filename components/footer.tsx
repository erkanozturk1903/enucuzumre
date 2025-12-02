import Link from "next/link";
import { Container } from "@/components/ui/container";
import { FooterNewsletter } from "@/components/footer-newsletter";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  MoonStar,
  ShieldCheck
} from "lucide-react";
import { prisma } from "@/lib/prisma";

// Default linkler (veritabanından veri gelmezse)
const DEFAULT_QUICK_LINKS = [
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/belgelerimiz", label: "Belgelerimiz" },
  { href: "/banka-hesaplari", label: "Banka Hesapları" },
  { href: "/sss", label: "Sıkça Sorulan Sorular" },
  { href: "/kvkk", label: "KVKK" },
  { href: "/blog", label: "Blog" },
];

const DEFAULT_POPULAR_ROUTES = [
  { href: "/umre-turlari", label: "Umre Turları" },
  { href: "/hac-turlari", label: "Hac Turları" },
  { href: "/ramazan-umresi", label: "Ramazan Umresi" },
  { href: "/somestr-umresi", label: "Sömestr Umresi" },
];

async function getFooterData() {
  try {
    const [settings, footerLinks] = await Promise.all([
      prisma.siteSettings.findUnique({
        where: { id: "site_settings" },
      }),
      prisma.footerLink.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
    ]);

    // Linkleri section'a göre ayır
    const quickLinks = footerLinks
      .filter(link => link.section === "quick-links")
      .map(link => ({ href: link.href, label: link.label }));

    const popularRoutes = footerLinks
      .filter(link => link.section === "popular-routes")
      .map(link => ({ href: link.href, label: link.label }));

    return {
      settings: settings || {
        contactPhone: "+90 555 555 55 55",
        whatsappNumber: "+905555555555",
        email: "info@enucuzhacumre.com",
        address: "Fatih Sultan Mehmet Mah. İstanbul Cad. No:123 Fatih/İstanbul",
        instagramUrl: null,
        facebookUrl: null,
        twitterUrl: null,
        youtubeUrl: null,
        footerText: "© 2025 En Ucuz Hac Umre. Tüm hakları saklıdır.",
        tursabNo: "A-12345",
        paymentMethods: "Visa,Mastercard,Troy",
        newsletterTitle: "Kampanyalardan Haberdar Olun",
        newsletterDescription: "Erken rezervasyon fırsatları ve özel indirimlerden ilk siz haberdar olun.",
        newsletterButtonText: "Abone Ol",
      },
      quickLinks: quickLinks.length > 0 ? quickLinks : DEFAULT_QUICK_LINKS,
      popularRoutes: popularRoutes.length > 0 ? popularRoutes : DEFAULT_POPULAR_ROUTES,
    };
  } catch (error) {
    console.error("Footer data alınamadı:", error);
    return {
      settings: {
        contactPhone: "+90 555 555 55 55",
        whatsappNumber: "+905555555555",
        email: "info@enucuzhacumre.com",
        address: "Fatih Sultan Mehmet Mah. İstanbul Cad. No:123 Fatih/İstanbul",
        instagramUrl: null,
        facebookUrl: null,
        twitterUrl: null,
        youtubeUrl: null,
        footerText: "© 2025 En Ucuz Hac Umre. Tüm hakları saklıdır.",
        tursabNo: "A-12345",
        paymentMethods: "Visa,Mastercard,Troy",
        newsletterTitle: "Kampanyalardan Haberdar Olun",
        newsletterDescription: "Erken rezervasyon fırsatları ve özel indirimlerden ilk siz haberdar olun.",
        newsletterButtonText: "Abone Ol",
      },
      quickLinks: DEFAULT_QUICK_LINKS,
      popularRoutes: DEFAULT_POPULAR_ROUTES,
    };
  }
}

export async function Footer() {
  const { settings, quickLinks, popularRoutes } = await getFooterData();

  // Ödeme yöntemlerini parse et
  const paymentMethods = (settings.paymentMethods || "Visa,Mastercard,Troy").split(",").map(m => m.trim());

  return (
    <footer className="bg-[#0B1120] text-white pt-16 pb-8">
      <Container>
        {/* Newsletter Section */}
        <FooterNewsletter
          title={settings.newsletterTitle}
          description={settings.newsletterDescription}
          buttonText={settings.newsletterButtonText}
        />

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 border-b border-gray-800 pb-16">

          {/* Column 1: About & Logo */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition-colors">
                <MoonStar className="h-6 w-6 text-secondary" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                EnUcuz<span className="text-secondary">HacUmre</span>
              </span>
            </Link>
            <p className="text-gray-400 leading-relaxed text-sm">
              Sektördeki 20 yıllık tecrübemizle, misafirlerimize manevi yolculuklarında en güvenilir ve kaliteli hizmeti, en uygun fiyatlarla sunuyoruz.
            </p>
            <div className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-xl border border-gray-700">
              <ShieldCheck className="h-8 w-8 text-secondary" />
              <div>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                  Türsab Belge No
                </p>
                <p className="text-lg font-bold text-white">{settings.tursabNo}</p>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Hızlı Linkler</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-secondary transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-700 group-hover:bg-secondary transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Popular Destinations */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Popüler Rotalar</h3>
            <ul className="space-y-3">
              {popularRoutes.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-secondary transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-700 group-hover:bg-secondary transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">İletişim</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <Phone className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-400 mb-1">Telefon</p>
                  <a href={`tel:${settings.contactPhone}`} className="text-white hover:text-secondary transition-colors font-medium">
                    {settings.contactPhone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Mail className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-400 mb-1">E-posta</p>
                  <a href={`mailto:${settings.email}`} className="text-white hover:text-secondary transition-colors font-medium">
                    {settings.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-400 mb-1">Adres</p>
                  <p className="text-white leading-relaxed">
                    {settings.address}
                  </p>
                </div>
              </li>
            </ul>

            {/* Social Media Icons */}
            <div className="flex items-center gap-3 mt-6">
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-secondary p-2.5 rounded-lg transition-colors group"
                >
                  <Instagram className="h-5 w-5 text-white" />
                </a>
              )}
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-secondary p-2.5 rounded-lg transition-colors group"
                >
                  <Facebook className="h-5 w-5 text-white" />
                </a>
              )}
              {settings.twitterUrl && (
                <a
                  href={settings.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-secondary p-2.5 rounded-lg transition-colors group"
                >
                  <Twitter className="h-5 w-5 text-white" />
                </a>
              )}
              {settings.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-secondary p-2.5 rounded-lg transition-colors group"
                >
                  <Youtube className="h-5 w-5 text-white" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-400 text-sm text-center md:text-left">
            {settings.footerText}
          </p>

          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-xs">Güvenli Ödeme:</span>
            <div className="flex items-center gap-2">
              {paymentMethods.map((method) => (
                <div key={method} className="bg-white/10 px-3 py-1.5 rounded text-xs font-medium">
                  💳 {method}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
