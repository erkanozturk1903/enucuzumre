import { Container } from "@/components/ui/container";
import { Shield } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

// Default KVKK içeriği (veritabanından veri gelmezse)
const DEFAULT_KVKK_CONTENT = `
<section>
  <h3>1. Veri Sorumlusu</h3>
  <p>
    En Ucuz Hac Umre Turizm Ltd. Şti. olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu
    ("KVKK") uyarınca veri sorumlusu sıfatıyla, kişisel verilerinizi aşağıda açıklanan kapsamda
    işleyebilecek, kaydedebilecek ve saklayabileceğiz.
  </p>
</section>

<section>
  <h3>2. İşlenen Kişisel Veriler</h3>
  <p>Hizmet sunumumuz kapsamında aşağıdaki kişisel verileriniz işlenmektedir:</p>
  <ul>
    <li>Kimlik Bilgileri (Ad, soyad, TC kimlik no, pasaport bilgileri)</li>
    <li>İletişim Bilgileri (Telefon, e-posta, adres)</li>
    <li>Sağlık Bilgileri (Aşı durumu, hastalık bilgileri)</li>
    <li>Finansal Bilgiler (Banka hesap bilgileri, ödeme bilgileri)</li>
  </ul>
</section>

<section>
  <h3>3. Verilerin İşlenme Amacı</h3>
  <p>Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
  <ul>
    <li>Hac ve Umre hizmetlerinin sunulması</li>
    <li>Vize işlemlerinin gerçekleştirilmesi</li>
    <li>Rezervasyon ve ödeme işlemlerinin yapılması</li>
    <li>Yasal yükümlülüklerin yerine getirilmesi</li>
    <li>İletişim faaliyetlerinin yürütülmesi</li>
  </ul>
</section>

<section>
  <h3>4. Haklarınız</h3>
  <p>KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
  <ul>
    <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
    <li>İşlenmişse buna ilişkin bilgi talep etme</li>
    <li>İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
    <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
    <li>Eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme</li>
    <li>Kişisel verilerin silinmesini veya yok edilmesini isteme</li>
  </ul>
</section>

<section>
  <h3>5. İletişim</h3>
  <p>
    KVKK kapsamındaki taleplerinizi, info@enucuzhacumre.com e-posta adresimize veya
    şirket adresimize yazılı olarak iletebilirsiniz.
  </p>
</section>
`;

async function getLegalPage() {
  try {
    const page = await prisma.legalPage.findUnique({
      where: { slug: "kvkk" },
    });
    return page;
  } catch (error) {
    console.error("KVKK sayfası alınamadı:", error);
    return null;
  }
}

export default async function KVKKPage() {
  const page = await getLegalPage();

  // Eğer sayfa pasifse 404 göster
  if (page && !page.isActive) {
    notFound();
  }

  const title = page?.title || "Kişisel Verilerin Korunması";
  const content = page?.content || DEFAULT_KVKK_CONTENT;
  const updatedAt = page?.updatedAt || new Date();

  return (
    <main className="min-h-screen bg-gray-50/50">
      <div className="bg-gradient-to-r from-primary to-primary/90 py-16 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {title}
            </h1>
            <p className="text-lg text-gray-200">
              KVKK kapsamında kişisel verilerinizin işlenmesi hakkında bilgilendirme
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl border border-gray-100">
          <div className="flex items-start gap-4 mb-8">
            <div className="bg-[#059669]/10 p-3 rounded-xl">
              <Shield className="h-8 w-8 text-[#059669]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">
                Kişisel Verileriniz Güvende
              </h2>
              <p className="text-gray-600">
                6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca hazırlanmıştır.
              </p>
            </div>
          </div>

          <div
            className="prose prose-lg max-w-none text-gray-600
            [&_section]:mb-6
            [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-primary [&_h3]:mb-3
            [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-2 [&_ul]:ml-4
            [&_p]:mb-3"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          <div className="mt-8 bg-gray-50 p-6 rounded-xl">
            <p className="text-sm text-gray-600">
              <strong>Son Güncellenme:</strong>{" "}
              {new Date(updatedAt).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
}
