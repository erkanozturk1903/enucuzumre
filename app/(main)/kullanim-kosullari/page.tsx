import { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { FileText, CheckCircle, AlertTriangle, CreditCard, XCircle, Scale, Globe, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Kullanım Koşulları | En Ucuz Hac Umre",
  description: "En Ucuz Hac Umre web sitesi kullanım koşulları ve şartları. Hizmetlerimizi kullanmadan önce lütfen bu koşulları okuyunuz.",
};

export default function KullanimKosullariPage() {
  return (
    <main className="py-16 bg-gray-50 min-h-screen">
      <Container>
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Kullanım Koşulları
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            En Ucuz Hac Umre web sitesini ve hizmetlerini kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız.
            Lütfen bu koşulları dikkatlice okuyunuz.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Son güncelleme: {new Date().toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Section 1 */}
          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">1. Genel Hükümler</h2>
            </div>
            <div className="text-gray-600 space-y-4">
              <p>
                Bu web sitesi, En Ucuz Hac Umre Turizm Seyahat Acentası tarafından işletilmektedir.
                Sitemizi kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>18 yaşından büyük olduğunuzu veya yasal vasinizin onayını aldığınızı</li>
                <li>Verdiğiniz tüm bilgilerin doğru ve güncel olduğunu</li>
                <li>Siteyi yalnızca yasal amaçlarla kullanacağınızı</li>
                <li>Başkalarının haklarına saygı göstereceğinizi</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Globe className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">2. Hizmetlerimiz</h2>
            </div>
            <div className="text-gray-600 space-y-4">
              <p>En Ucuz Hac Umre olarak aşağıdaki hizmetleri sunmaktayız:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Hac ve Umre tur organizasyonları</li>
                <li>Vize danışmanlığı ve takip hizmetleri</li>
                <li>Uçak bileti ve otel rezervasyonları</li>
                <li>Transfer ve rehberlik hizmetleri</li>
                <li>Seyahat sigortası düzenlemesi</li>
              </ul>
              <p className="mt-4">
                Tüm hizmetlerimiz TÜRSAB ve Diyanet İşleri Başkanlığı düzenlemelerine uygun olarak sunulmaktadır.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CreditCard className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">3. Rezervasyon ve Ödeme Koşulları</h2>
            </div>
            <div className="text-gray-600 space-y-4">
              <h3 className="font-semibold text-gray-800">3.1 Rezervasyon</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Rezervasyonlar, ön ödeme veya tam ödeme yapıldıktan sonra kesinleşir</li>
                <li>Rezervasyon onayı e-posta ve/veya SMS ile gönderilir</li>
                <li>Pasaport ve kimlik bilgilerinizin doğruluğundan siz sorumlusunuz</li>
                <li>Hatalı bilgilerden kaynaklanan sorunlardan şirketimiz sorumlu değildir</li>
              </ul>

              <h3 className="font-semibold text-gray-800 mt-6">3.2 Ödeme</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Ödemeler Türk Lirası (TRY) cinsinden yapılır</li>
                <li>Kredi kartı, banka havalesi ve nakit ödeme kabul edilmektedir</li>
                <li>Taksitli ödeme seçenekleri mevcuttur (banka kampanyalarına göre)</li>
                <li>Fiyatlar, döviz kurlarındaki değişikliklere göre güncellenebilir</li>
              </ul>

              <h3 className="font-semibold text-gray-800 mt-6">3.3 Fiyat Politikası</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Web sitesindeki fiyatlar bilgilendirme amaçlıdır</li>
                <li>Kesin fiyat, rezervasyon sırasında bildirilir</li>
                <li>Fiyatlara KDV dahildir (aksi belirtilmedikçe)</li>
                <li>Erken rezervasyon indirimleri ve kampanyalar geçerlilik süresiyle sınırlıdır</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">4. İptal ve İade Koşulları</h2>
            </div>
            <div className="text-gray-600 space-y-4">
              <h3 className="font-semibold text-gray-800">4.1 Müşteri Kaynaklı İptaller</h3>
              <div className="bg-gray-50 rounded-lg p-4 mt-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">İptal Zamanı</th>
                      <th className="text-left py-2">Kesinti Oranı</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">30 günden fazla önce</td>
                      <td className="py-2">%10 kesinti</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">15-30 gün önce</td>
                      <td className="py-2">%25 kesinti</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">7-14 gün önce</td>
                      <td className="py-2">%50 kesinti</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">3-6 gün önce</td>
                      <td className="py-2">%75 kesinti</td>
                    </tr>
                    <tr>
                      <td className="py-2">0-2 gün önce veya gelmeme</td>
                      <td className="py-2">%100 kesinti (iade yok)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="font-semibold text-gray-800 mt-6">4.2 Şirket Kaynaklı İptaller</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Yetersiz katılım nedeniyle tur iptal edilebilir (en az 7 gün önce bildirilir)</li>
                <li>Bu durumda ödenen tutar tam olarak iade edilir veya alternatif tur önerilir</li>
                <li>Mücbir sebepler (doğal afet, savaş, salgın vb.) durumunda özel koşullar uygulanır</li>
              </ul>

              <h3 className="font-semibold text-gray-800 mt-6">4.3 İade Süreci</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>İade talepleri yazılı olarak yapılmalıdır</li>
                <li>Onaylanan iadeler 14 iş günü içinde gerçekleştirilir</li>
                <li>Kredi kartı ödemeleri, aynı karta iade edilir</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">5. Sorumluluk Sınırları</h2>
            </div>
            <div className="text-gray-600 space-y-4">
              <p>En Ucuz Hac Umre aşağıdaki durumlardan sorumlu tutulamaz:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Mücbir sebeplerden kaynaklanan aksaklıklar (hava koşulları, grevler, salgın hastalıklar vb.)</li>
                <li>Havayolu şirketlerinin uçuş değişiklikleri veya iptalleri</li>
                <li>Vize başvurusunun reddedilmesi</li>
                <li>Müşterinin eksik veya yanlış evrak sunması</li>
                <li>Müşterinin kendi ihmali sonucu oluşan kayıplar</li>
                <li>Üçüncü taraf hizmet sağlayıcılarının eylemleri</li>
              </ul>
              <p className="mt-4">
                Şirketimizin sorumluluğu, her durumda ödenen tur bedeli ile sınırlıdır.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-teal-100 rounded-lg">
                <FileText className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">6. Fikri Mülkiyet Hakları</h2>
            </div>
            <div className="text-gray-600 space-y-4">
              <p>
                Bu web sitesindeki tüm içerikler (metin, görsel, logo, tasarım vb.) En Ucuz Hac Umre'nin
                mülkiyetindedir veya lisanslıdır.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>İçeriklerin izinsiz kopyalanması, dağıtılması veya kullanılması yasaktır</li>
                <li>Kişisel ve ticari olmayan kullanım için alıntı yapılabilir (kaynak belirtilerek)</li>
                <li>Logo ve marka kullanımı için yazılı izin gereklidir</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Scale className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">7. Uyuşmazlık Çözümü</h2>
            </div>
            <div className="text-gray-600 space-y-4">
              <p>
                Bu koşullardan doğabilecek uyuşmazlıklarda:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Türkiye Cumhuriyeti kanunları uygulanır</li>
                <li>İstanbul Mahkemeleri ve İcra Daireleri yetkilidir</li>
                <li>Tüketici hakem heyetlerine başvuru hakkınız saklıdır</li>
                <li>TÜRSAB tahkim kuruluna başvurulabilir</li>
              </ul>
            </div>
          </section>

          {/* Section 8 */}
          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-pink-100 rounded-lg">
                <HelpCircle className="w-5 h-5 text-pink-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">8. İletişim</h2>
            </div>
            <div className="text-gray-600 space-y-4">
              <p>
                Kullanım koşulları hakkında sorularınız için bizimle iletişime geçebilirsiniz:
              </p>
              <div className="bg-gray-50 rounded-xl p-6 mt-4">
                <p className="font-semibold text-gray-900 mb-2">En Ucuz Hac Umre Turizm</p>
                <p>E-posta: <a href="mailto:info@enucuzhacumre.com" className="text-primary hover:underline">info@enucuzhacumre.com</a></p>
                <p>Telefon: <a href="tel:+905441557449" className="text-primary hover:underline">+90 544 155 74 49</a></p>
                <p>Adres: Fatih Sultan Mehmet Mah. İstanbul Cad. No:123 Fatih/İstanbul</p>
                <p className="mt-2">TÜRSAB Belge No: A-12345</p>
              </div>
            </div>
          </section>

          {/* Note */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
            <p className="text-amber-800 text-sm">
              Bu kullanım koşulları, yasal düzenlemelere ve hizmet değişikliklerine göre güncellenebilir.
              Güncel koşulları düzenli olarak kontrol etmenizi öneririz.
              Hizmetlerimizi kullanmaya devam etmeniz, güncel koşulları kabul ettiğiniz anlamına gelir.
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
}
