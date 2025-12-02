# Booking/Lead Sistemi - Kurulum ve Kullanım

## 🎯 Genel Bakış

Rezervasyon/Lead sistemi, müşterilerin frontend'den ön kayıt oluşturmasını ve admin panelden bu taleplerin yönetilmesini sağlar.

## ✅ Tamamlanan Özellikler

### 1. **Booking Model** (Prisma Schema)
- ✅ `Booking` modeli eklendi
- ✅ `BookingStatus` enum'u eklendi (PENDING, CONTACTED, COMPLETED, CANCELLED)
- ✅ Tour ile ilişki kuruldu (1:N)
- ✅ Index'ler eklendi (performans için)

**Alanlar:**
- `name`: Müşteri adı
- `phone`: Telefon numarası
- `email`: E-posta
- `passengerCount`: Yolcu sayısı
- `tourId`: Tur ID (relation)
- `roomType`: Oda tipi (quad/triple/double)
- `totalPrice`: Toplam fiyat
- `status`: Durum (PENDING/CONTACTED/COMPLETED/CANCELLED)
- `notes`: Admin notları

### 2. **Server Actions**
✅ `createBooking()` - Frontend'den rezervasyon oluşturma
  - Form validasyonu
  - Email/telefon doğrulama
  - Kontenjan kontrolü
  - Tur aktiflik kontrolü

✅ `getBookings()` - Tüm rezervasyonları getir
  - Tur bilgileriyle birlikte
  - Tarih sıralı

✅ `updateBookingStatus()` - Durum güncelleme
  - PENDING → CONTACTED → COMPLETED

✅ `updateBookingNotes()` - Not ekleme/güncelleme

✅ `deleteBooking()` - Rezervasyon silme

✅ `getBookingStats()` - İstatistikler
  - Toplam, bekleyen, arandı, tamamlandı

**Dosya:** `app/actions/booking.ts`

### 3. **Frontend Booking Form**

✅ Modal Component (`BookingModal`)
  - Modern, responsive tasarım
  - Form validasyonu
  - Loading states
  - Success animation
  - Toast notifications

✅ BookingCard Entegrasyonu
  - "Ön Kayıt Oluştur" butonu
  - Modal açılımı
  - Oda tipi ve fiyat bilgisi otomatik geçiş

**Dosyalar:**
- `components/tour-detail/booking-modal.tsx`
- `components/tour-detail/booking-card.tsx` (güncellendi)

### 4. **Admin Rezervasyonlar Sayfası**

✅ İstatistik Kartları
  - Bekleyen
  - Arandı
  - Tamamlandı
  - Toplam

✅ Filtreleme
  - Duruma göre filtre
  - Dropdown select

✅ Rezervasyon Listesi
  - Müşteri bilgileri (ad, telefon, email, yolcu sayısı)
  - Tur bilgisi (başlık, fiyat, link)
  - Oluşturulma tarihi
  - Durum badge'i
  - Durum değiştirme (dropdown)
  - Silme butonu

✅ UX İyileştirmeleri
  - Hover effects
  - Color coding (status'e göre)
  - Responsive design
  - Loading states

**Dosya:** `app/admin/rezervasyonlar/page.tsx`

## 🗄️ Veritabanı Kurulumu

### Adım 1: Prisma Migration

```bash
# 1. Migration oluştur
npm run prisma:dev

# Migration adı sorulduğunda:
# "add_booking_system"

# 2. Prisma Client'ı yeniden oluştur
npm run prisma:generate
```

### Adım 2: Dev Server'ı Yeniden Başlat

```bash
npm run dev
```

## 🧪 Test Senaryosu

### Frontend Test (Müşteri Perspektifi)

1. **Tur Detay Sayfasına Git**
   ```
   http://localhost:3000/turlar/[slug]
   ```

2. **Oda Tipi Seç**
   - 4 Kişilik Oda (default)
   - 3 Kişilik Oda (+$150)
   - 2 Kişilik Oda (+$350)

3. **"Ön Kayıt Oluştur" Butonuna Tıkla**
   - Modal açılır

4. **Formu Doldur**
   - Ad Soyad: `Ahmet Yılmaz`
   - Telefon: `0555 555 55 55`
   - E-posta: `test@example.com`
   - Yolcu Sayısı: `2`

5. **"Ön Kayıt Oluştur" Butonuna Tıkla**
   - ✅ Loading state görünür
   - ✅ Success animation
   - ✅ Toast notification
   - ✅ Modal 3 saniye sonra kapanır

### Admin Test (Yönetici Perspektifi)

1. **Admin Panele Giriş**
   ```
   http://localhost:3000/admin/login
   admin@example.com / adminpassword
   ```

2. **Rezervasyonlar Sayfasına Git**
   ```
   http://localhost:3000/admin/rezervasyonlar
   ```

3. **İstatistikleri Kontrol Et**
   - ✅ Bekleyen: 1
   - ✅ Toplam: 1

4. **Rezervasyon Kartını İncele**
   - ✅ Müşteri bilgileri görünüyor
   - ✅ Tur linki çalışıyor
   - ✅ Tarih doğru formatlanmış

5. **Durumu Değiştir**
   - Dropdown'dan **"Arandı"** seç
   - ✅ Toast notification
   - ✅ İstatistikler güncellendi

6. **Filtre Test Et**
   - "Arandı" filtrele
   - ✅ Sadece arandı rezervasyonları görünür

7. **Sil Butonu Test Et**
   - "Sil" butonuna tıkla
   - ✅ Onay popup'ı
   - ✅ Rezervasyon silindi

## 📊 Veritabanı Yapısı

### Booking Table

```sql
CREATE TABLE "Booking" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passengerCount" INTEGER NOT NULL DEFAULT 1,
  "tourId" TEXT NOT NULL,
  "roomType" TEXT,
  "totalPrice" DECIMAL(10,2),
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "notes" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL,
  
  FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE
);

CREATE INDEX "Booking_tourId_idx" ON "Booking"("tourId");
CREATE INDEX "Booking_status_idx" ON "Booking"("status");
CREATE INDEX "Booking_createdAt_idx" ON "Booking"("createdAt");
```

### Ilişkiler

```
Tour (1) ---- (N) Booking
```

## 🎨 Status Flow

```
PENDING (Yeni Gelen)
    ↓
CONTACTED (Arandı)
    ↓
COMPLETED (Tamamlandı)
    ↓ (veya)
CANCELLED (İptal)
```

## 🔒 Güvenlik & Validasyonlar

### Frontend Validasyonlar
✅ Required fields (HTML5)
✅ Email format check (regex)
✅ Phone format check (Türkiye)
✅ Minimum 1 yolcu

### Backend Validasyonlar
✅ Email regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
✅ Phone regex (TR): `/^(\+90|0)?[0-9]{10}$/`
✅ Tour existence check
✅ Tour active check
✅ Quota availability check

### Admin Koruması
✅ NextAuth session kontrolü
✅ Server Actions'da auth check (planlanan)

## 📈 İstatistikler

Admin panelde gösterilen metrikler:

- **Toplam**: Tüm rezervasyonlar
- **Bekleyen**: PENDING durumunda
- **Arandı**: CONTACTED durumunda
- **Tamamlandı**: COMPLETED durumunda

## 🎯 Kullanım Örnekleri

### Örnek 1: Yeni Rezervasyon

**Müşteri:**
1. Tur detayına gider
2. Oda tipini seçer
3. Formu doldurur
4. Gönderir

**Sistem:**
1. Validasyon yapar
2. Kontenjan kontrolü
3. DB'ye kaydeder
4. Success mesajı döner

**Admin:**
1. Yeni rezervasyon bildirimi (gelecek özellik)
2. Rezervasyonlar sayfasında görür
3. Müşteriyi arar
4. Durumu "Arandı" olarak işaretler

### Örnek 2: Kontenjan Kontrolü

**Senaryo:** Tur'da sadece 2 koltuk kaldı

**Müşteri:** 3 kişilik rezervasyon yapmak istiyor

**Sistem:**
- ❌ "Yeterli kontenjan yok. Kalan koltuk: 2" hatası verir
- ✅ Rezervasyon oluşturulmaz

## 🚀 Gelecek Özellikler (Opsiyonel)

- [ ] Email bildirimleri (admin & müşteri)
- [ ] SMS bildirimleri (Twilio/Netgsm)
- [ ] WhatsApp entegrasyonu
- [ ] PDF teklif oluşturma
- [ ] Ödeme entegrasyonu
- [ ] Rezervasyon export (Excel/CSV)
- [ ] Otomatik reminder'lar
- [ ] Dashboard analytics

## 🐛 Sorun Giderme

### Rezervasyon oluşturulamıyor
**Çözüm:**
1. Veritabanı migration'ı yapıldı mı? → `npm run prisma:dev`
2. Prisma Client güncel mi? → `npm run prisma:generate`
3. Dev server yeniden başlatıldı mı?

### Admin sayfası boş gözüküyor
**Çözüm:**
1. Frontend'den test rezervasyonu oluştur
2. Sayfayı yenile
3. Browser console'u kontrol et

### Durum değiştirme çalışmıyor
**Çözüm:**
1. Auth token'ı kontrol et
2. Server logs'u kontrol et
3. Browser console'u kontrol et

## 📝 Notlar

- Rezervasyonlar otomatik olarak **sıralanır** (en yeni → en eski)
- **Cascade delete**: Tur silinirse rezervasyonları da silinir
- **Toast notifications**: Tüm işlemlerde kullanıcı bilgilendirilir
- **Responsive**: Mobil ve desktop uyumlu

## 🎊 Özet

Booking/Lead sistemi tamamen çalışır durumda! Müşteriler frontend'den rezervasyon oluşturabilir, adminler panelden yönetebilir.

**Test et ve başarını kutla! 🚀**



