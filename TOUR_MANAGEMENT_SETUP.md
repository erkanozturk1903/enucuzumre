# Tour Management Modülü - Kurulum ve Kullanım Rehberi

## 📋 Genel Bakış

Tour Management modülü, admin panelinden turları yönetmek için kapsamlı bir CRUD (Create, Read, Update, Delete) sistemidir.

## 🚀 Kurulum

### Adım 1: Veritabanını Güncelle

Prisma şeması zaten hazır. Veritabanınızı güncellemek için:

```bash
npm run prisma:push
```

Ya da migration oluşturmak için:

```bash
npm run prisma:dev
```

Migration adı: `add_tour_management`

### Adım 2: Prisma Client'ı Güncelle

```bash
npm run prisma:generate
```

### Adım 3: Dev Server'ı Başlat

```bash
npm run dev
```

## 📁 Dosya Yapısı

```
app/admin/turlar/
├── page.tsx                      # Liste görünümü
├── yeni/
│   └── page.tsx                  # Yeni tur oluşturma sayfası
├── [id]/
│   └── duzenle/
│       └── page.tsx              # Tur düzenleme sayfası
├── components/
│   └── TourFormTabs.tsx          # Form component (5 tab)
└── actions.ts                    # Server Actions (CRUD)
```

## 🎯 Özellikler

### 1. Liste Görünümü (`/admin/turlar`)

**Özellikler:**
- 📊 Tüm turları tablo halinde görüntüleme
- 🔍 Tur arama (başlığa göre)
- 🏷️ Tip filtreleme (Umre, Hac, Kudüs, Kültür)
- 👁️ Aktif/Pasif durum değiştirme (toggle)
- ✏️ Düzenleme butonu
- 🗑️ Silme butonu (onay ile)
- 📈 Kontenjan progress bar

**Tablo Kolonları:**
- Tur adı ve görseli
- Tip (renkli badge)
- Fiyat
- Tarih aralığı
- Kontenjan (progress bar)
- Durum (aktif/pasif)
- İşlemler (edit/delete)

### 2. Form Görünümü (Yeni/Düzenle)

Form 5 tab'e ayrılmıştır:

#### **Tab 1: Genel Bilgiler** 📝
- Tur Başlığı *
- Slug (otomatik oluşturma özelliği ile)
- Tur Tipi (Umre, Hac, Kudüs, Kültür)
- Otel Yıldızı (3, 4, 5)
- Fiyat *
- Para Birimi (USD, EUR, TL)
- Başlangıç/Bitiş Tarihi *
- Kontenjan *
- Öne Çıkan Tur (checkbox)
- Aktif (checkbox)

#### **Tab 2: Detaylar** 📋
- Mekke Oteli
- Medine Oteli
- Kabe'ye Uzaklık (metre)
- Tur Açıklaması (textarea) *

#### **Tab 3: Tur Programı** 📅
- Dinamik gün ekleme/çıkarma
- Her gün için:
  - Başlık
  - Açıklama
- "Gün Ekle" butonu

#### **Tab 4: Dahil/Hariç** ✅
- **Fiyata Dahil Olanlar:**
  - Dinamik item ekleme/çıkarma
  - Örn: "Gidiş-dönüş uçak bileti"
  
- **Fiyata Dahil Olmayanlar:**
  - Dinamik item ekleme/çıkarma
  - Örn: "Kişisel harcamalar"

#### **Tab 5: Görseller** 🖼️
- Dinamik görsel ekleme/çıkarma
- Her görsel için:
  - URL (picsum.photos gibi)
  - Alternatif metin (opsiyonel)

## 🔧 Server Actions

### `getTours()`
Tüm turları listeler (ilk görselleriyle birlikte).

### `getTourById(id: string)`
ID'ye göre tek bir turu tüm ilişkileriyle birlikte getirir.

### `createTour(formData: FormData)`
Yeni tur oluşturur.
- Slug kontrolü yapar
- İlişkili verileri (images, itinerary, included, excluded) otomatik oluşturur
- Cache'i temizler

### `updateTour(id: string, formData: FormData)`
Mevcut turu günceller.
- Slug kontrolü yapar (kendisi hariç)
- İlişkili verileri siler ve yeniden oluşturur
- Cache'i temizler

### `deleteTour(id: string)`
Turu siler (Cascade delete ile ilişkili veriler de silinir).

### `toggleTourStatus(id: string)`
Turun aktif/pasif durumunu değiştirir.

## 📝 Kullanım

### Yeni Tur Ekleme

1. `http://localhost:3000/admin/turlar` → **"Yeni Tur Ekle"** butonuna tıkla
2. **Tab 1 (Genel):**
   - Başlığı yaz → Slug otomatik oluşur
   - Tip, fiyat, tarih seç
3. **Tab 2 (Detaylar):**
   - Otel bilgilerini gir
   - Açıklama yaz
4. **Tab 3 (Program):**
   - "Gün Ekle" ile günleri ekle
   - Her gün için başlık ve açıklama yaz
5. **Tab 4 (Dahil/Hariç):**
   - Fiyata dahil/dahil olmayan maddeleri ekle
6. **Tab 5 (Görseller):**
   - URL'leri ekle (örn: `https://picsum.photos/800/600`)
7. **"Kaydet"** butonuna tıkla
8. ✅ Başarılı toast mesajı görünür

### Tur Düzenleme

1. Liste görünümünde **✏️ Düzenle** butonuna tıkla
2. Formu düzenle
3. **"Kaydet"** butonuna tıkla

### Tur Silme

1. Liste görünümünde **🗑️ Sil** butonuna tıkla
2. Onay ver
3. ✅ Tur silindi

### Durum Değiştirme

1. Liste görünümünde **"Aktif/Pasif"** butonuna tıkla
2. Durum anında değişir

## 🎨 Özellikler

### Otomatik Slug Oluşturma
- Türkçe karakterleri otomatik çevirir (ç→c, ş→s, vb.)
- Boşlukları tire (-) ile değiştirir
- URL-friendly hale getirir
- **"Otomatik Oluştur"** butonu ile manuel tetikleme

### Form Validasyonu
- Gerekli alanlar işaretli (*)
- HTML5 validasyonları (email, url, number, date)
- Slug benzersizlik kontrolü

### UX İyileştirmeleri
- Loading states (Loader2 icon)
- Toast bildirimleri (sonner)
- Responsive tasarım
- Hover efektleri
- Smooth transitions
- Progress bar (kontenjan)

## 🔒 Güvenlik

- Tüm Server Actions auth kontrolü yapar
- Sadece oturum açmış kullanıcılar erişebilir
- Middleware ile route koruması

## 🧪 Test Verileri

Örnek görsel URL'leri:
```
https://picsum.photos/800/600
https://picsum.photos/id/1015/800/600
https://picsum.photos/id/1018/800/600
```

## 📊 Veritabanı İlişkileri

```
Tour (Ana Model)
├── TourImage[] (1:N)
├── Itinerary[] (1:N)
├── TourIncluded[] (1:N)
└── TourExcluded[] (1:N)
```

**Cascade Delete:** Tur silindiğinde tüm ilişkili veriler otomatik silinir.

## 🎯 Sonraki Adımlar

- [ ] Upload özelliği ekle (Uploadthing integration)
- [ ] Görsel crop/resize
- [ ] SEO meta alanları
- [ ] Multi-language desteği
- [ ] Bulk actions (toplu silme/düzenleme)
- [ ] Export/Import (Excel/CSV)

## 🐛 Sorun Giderme

### Turlar görünmüyor
- Veritabanı bağlantısını kontrol et (`.env`)
- Prisma Client'ı yeniden oluştur: `npm run prisma:generate`

### Slug hatası alıyorum
- Slug benzersiz olmalı
- "Otomatik Oluştur" butonunu kullan

### Görseller yüklenmiyor
- URL'lerin geçerli olduğundan emin ol
- `next.config.ts`'de `remotePatterns` kontrol et

## 📞 Destek

Herhangi bir sorun için admin dashboard'dan destek talebi oluşturabilirsiniz.

---

**Başarılar! 🚀**



