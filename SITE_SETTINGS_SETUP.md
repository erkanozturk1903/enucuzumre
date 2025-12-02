# Site Ayarları Kurulum Rehberi

## Adım 1: Prisma Şemasını Veritabanına Uygulama

Veritabanınızda `SiteSettings` modelinin oluşturulması için aşağıdaki komutu çalıştırın:

```bash
npm run prisma:push
```

Ya da migration oluşturmak isterseniz:

```bash
npm run prisma:dev
```

Migration adı sorulduğunda: `add_site_settings_model`

## Adım 2: Prisma Client'ı Yeniden Oluşturma

```bash
npm run prisma:generate
```

## Adım 3: Dev Server'ı Başlatma

```bash
npm run dev
```

## Kullanım

1. Tarayıcınızda `http://localhost:3000/admin/login` adresine gidin
2. Admin bilgileriyle giriş yapın:
   - Email: `admin@example.com`
   - Password: `adminpassword`
3. Sol menüden **"Site Ayarları"** sekmesine tıklayın
4. Formu doldurun ve **"Değişiklikleri Kaydet"** butonuna tıklayın
5. Başarılı olursa sağ üst köşede yeşil bir toast bildirimi görünecek

## Özellikler

### 1. Hero Section Ayarları
- **Ana Başlık**: Ana sayfada gösterilecek büyük başlık
- **Alt Başlık**: Ana başlığın altındaki açıklama metni

### 2. İletişim Bilgileri
- **Telefon Numarası**: Gösterilecek iletişim telefonu
- **WhatsApp Numarası**: WhatsApp ile iletişim numarası
- **E-posta**: İletişim e-posta adresi
- **TÜRSAB Belge No**: TÜRSAB belge numaranız
- **Adres**: Şirket adresi

### 3. Sosyal Medya
- Instagram, Facebook, Twitter, YouTube linkleri

### 4. Footer
- Footer'da gösterilecek telif hakkı metni

## Notlar

- `SiteSettings` tablosunda sadece **1 satır** bulunur (ID: `site_settings`)
- İlk açılışta eğer ayarlar yoksa otomatik olarak default değerlerle oluşturulur
- Her güncelleme sonrası ana sayfa ve ayarlar sayfası cache'i temizlenir
- Form değerleri otomatik olarak mevcut ayarlarla doldurulur

## Toast Bildirimleri

- ✅ **Başarılı**: Yeşil renkte, ayarlar kaydedildiğinde
- ❌ **Hata**: Kırmızı renkte, bir sorun oluştuğunda

## Server Actions

- `getSiteSettings()`: Mevcut ayarları getir
- `updateSiteSettings(formData)`: Ayarları güncelle

Her iki action da auth kontrolü yapar ve sadece oturum açmış kullanıcıların erişimine açıktır.



