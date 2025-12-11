import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";
import { prisma } from "@/lib/prisma";

async function getLayoutData() {
  try {
    const [menuItems, siteSettings] = await Promise.all([
      prisma.menuItem.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
      prisma.siteSettings.findUnique({
        where: { id: "site_settings" },
      }),
    ]);

    return { menuItems, siteSettings };
  } catch (error) {
    console.error("Layout data fetch error:", error);
    return { menuItems: [], siteSettings: null };
  }
}

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { menuItems, siteSettings } = await getLayoutData();

  return (
    <>
      <Header
        menuItems={menuItems}
        appStoreUrl={siteSettings?.appStoreUrl || undefined}
        playStoreUrl={siteSettings?.playStoreUrl || undefined}
      />
      <main className="pt-20 lg:pt-24 min-h-[calc(100vh-80px)]">
        {children}
      </main>
      <Footer />
      <FloatingWhatsApp phoneNumber={siteSettings?.whatsappNumber || undefined} />
    </>
  );
}
