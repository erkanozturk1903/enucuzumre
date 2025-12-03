import { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Shield, Lock, Eye, Database, UserCheck, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Gizlilik Politikası | En Ucuz Hac Umre",
  description: "En Ucuz Hac Umre gizlilik politikası. Kişisel verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında bilgi edinin.",
};

export default function GizlilikPolitikasiPage() {
  return (
    <main className="py-16 bg-gray-50 min-h-screen">
      <Container>
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Gizlilik Politikası
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            En Ucuz Hac Umre olarak kişisel verilerinizin güvenliği bizim için çok önemlidir.
            Bu politika, verilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu açıklar.
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
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">1. Toplanan Bilgiler</h2>
            </div>
            <div className="text-gray-600 space-y-4">
              <p>
                En Ucuz Hac Umre olarak, hizmetlerimizi sunabilmek için aşağıdaki kişisel bilgileri toplayabiliriz:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Kimlik Bilgileri:</strong> Ad, soyad, T.C. kimlik numarası, pasaport bilgileri</li>
                <li><strong>İletişim Bilgileri:</strong> E-posta adresi, telefon numarası, adres</li>
                <li><strong>Ödeme Bilgileri:</strong> Kredi kartı bilgileri (güvenli ödeme altyapısı üzerinden)</li>
                <li><strong>Seyahat Bilgileri:</strong> Tur tercihleri, konaklama tercihleri, özel talepler</li>
                <li><strong>Sağlık Bilgileri:</strong> Yalnızca seyahat için gerekli olduğunda ve izninizle</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">2. Bilgilerin Kullanımı</h2>
            </div>
            <div className="text-gray-600 space-y-4">
              <p>Topladığımız kişisel bilgiler aşağıdaki amaçlarla kullanılmaktadır:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Hac ve Umre tur rezervasyonlarınızı gerçekleştirmek</li>
                <li>Vize ve pasaport işlemlerinizi yürütmek</li>
                <li>Uçak bileti ve otel rezervasyonları yapmak</li>
                <li>Sizinle iletişime geçmek ve tur detaylarını paylaşmak</li>
                <li>Yasal yükümlülüklerimizi yerine getirmek (TÜRSAB, Diyanet İşleri Başkanlığı)</li>
                <li>Hizmet kalitemizi geliştirmek</li>
                <li>Kampanya ve fırsatlardan haberdar etmek (izninizle)</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Lock className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">3. Bilgi Güvenliği</h2>
            </div>
            <div className="text-gray-600 space-y-4">
              <p>
                Kişisel verilerinizin güvenliği için aşağıdaki önlemleri alıyoruz:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>SSL şifreleme ile güvenli veri iletimi</li>
                <li>Güvenli sunucularda veri depolama</li>
                <li>Yetkisiz erişime karşı güvenlik duvarları</li>
                <li>Düzenli güvenlik denetimleri</li>
                <li>Çalışanlarımıza gizlilik eğitimi</li>
                <li>PCI-DSS uyumlu ödeme altyapısı</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <UserCheck className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">4. Bilgi Paylaşımı</h2>
            </div>
            <div className="text-gray-600 space-y-4">
              <p>
                Kişisel bilgileriniz aşağıdaki durumlar dışında üçüncü taraflarla paylaşılmaz:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Seyahat Hizmeti Sağlayıcıları:</strong> Havayolları, oteller, transfer şirketleri (hizmet için zorunlu)</li>
                <li><strong>Resmi Kurumlar:</strong> Diyanet İşleri Başkanlığı, TÜRSAB, konsolosluklar (yasal zorunluluk)</li>
                <li><strong>Ödeme Kuruluşları:</strong> Güvenli ödeme işlemleri için bankalar</li>
                <li><strong>Yasal Talepler:</strong> Mahkeme kararı veya yasal zorunluluk durumunda</li>
              </ul>
              <p className="mt-4 font-medium">
                Bilgileriniz hiçbir koşulda pazarlama amacıyla üçüncü taraflara satılmaz veya kiralanmaz.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">5. KVKK Kapsamındaki Haklarınız</h2>
            </div>
            <div className="text-gray-600 space-y-4">
              <p>
                6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aşağıdaki haklara sahipsiniz:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>İşlenmişse buna ilişkin bilgi talep etme</li>
                <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri öğrenme</li>
                <li>Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme</li>
                <li>Kanun'un 7. maddesinde öngörülen şartlar çerçevesinde silinmesini isteme</li>
                <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
                <li>Kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-teal-100 rounded-lg">
                <Database className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">6. Çerezler (Cookies)</h2>
            </div>
            <div className="text-gray-600 space-y-4">
              <p>
                Web sitemizde kullanıcı deneyimini geliştirmek için çerezler kullanılmaktadır:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Zorunlu Çerezler:</strong> Sitenin düzgün çalışması için gerekli</li>
                <li><strong>Analitik Çerezler:</strong> Site kullanımını analiz etmek için (Google Analytics)</li>
                <li><strong>Tercih Çerezleri:</strong> Dil ve bölge tercihlerinizi hatırlamak için</li>
              </ul>
              <p>
                Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz, ancak bu durumda bazı site özellikleri düzgün çalışmayabilir.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Mail className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">7. İletişim</h2>
            </div>
            <div className="text-gray-600 space-y-4">
              <p>
                Gizlilik politikamız hakkında sorularınız veya KVKK kapsamındaki talepleriniz için bizimle iletişime geçebilirsiniz:
              </p>
              <div className="bg-gray-50 rounded-xl p-6 mt-4">
                <p className="font-semibold text-gray-900 mb-2">En Ucuz Hac Umre Turizm</p>
                <p>E-posta: <a href="mailto:info@enucuzhacumre.com" className="text-primary hover:underline">info@enucuzhacumre.com</a></p>
                <p>Telefon: <a href="tel:+905441557449" className="text-primary hover:underline">+90 544 155 74 49</a></p>
                <p>Adres: Fatih Sultan Mehmet Mah. İstanbul Cad. No:123 Fatih/İstanbul</p>
              </div>
            </div>
          </section>

          {/* Note */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
            <p className="text-amber-800 text-sm">
              Bu gizlilik politikası, yasal düzenlemelere uygun olarak güncellenebilir.
              Önemli değişikliklerde sizi bilgilendireceğiz. Güncel politikayı düzenli olarak kontrol etmenizi öneririz.
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
}
