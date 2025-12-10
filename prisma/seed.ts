import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Şifreyi hashle
  const hashedPassword = await bcrypt.hash('Mira2015', 12)

  // Super Admin kullanıcısını oluştur veya güncelle
  const superAdmin = await prisma.user.upsert({
    where: { email: 'erozturk0381@gmail.com' },
    update: {
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      isActive: true,
    },
    create: {
      email: 'erozturk0381@gmail.com',
      password: hashedPassword,
      name: 'Erkan Öztürk',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  })

  console.log('Super Admin oluşturuldu:', superAdmin.email)

  // Hero Slider'ları oluştur
  const heroSlides = [
    {
      title: "Manevi Yolculuğunuz En Uygun Fiyatlarla Başlasın",
      subtitle: "Hac ve Umre turlarında Türkiye'nin en güvenilir karşılaştırma platformu.",
      imageUrl: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1920&q=80",
      buttonText: "Turları İncele",
      buttonLink: "/umre-turlari",
      order: 0,
      isActive: true,
    },
    {
      title: "Ramazan Umresi Fırsatları",
      subtitle: "Bu Ramazan'da kutsal topraklarda olun. Erken rezervasyon avantajlarını kaçırmayın.",
      imageUrl: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1920&q=80",
      buttonText: "Ramazan Turları",
      buttonLink: "/ramazan-umresi",
      order: 1,
      isActive: true,
    },
    {
      title: "2025 Hac Kayıtları Başladı",
      subtitle: "Hayatınızın en önemli yolculuğu için şimdiden yerinizi ayırtın.",
      imageUrl: "https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=1920&q=80",
      buttonText: "Hac Turları",
      buttonLink: "/hac-turlari",
      order: 2,
      isActive: true,
    },
  ]

  for (const slide of heroSlides) {
    await prisma.heroSlide.upsert({
      where: { id: `seed-slide-${slide.order}` },
      update: slide,
      create: {
        id: `seed-slide-${slide.order}`,
        ...slide,
      },
    })
  }

  console.log('Hero Slides oluşturuldu:', heroSlides.length, 'adet')

  // Örnek Turlar
  const tours = [
    {
      id: 'seed-tour-1',
      title: '15 Günlük Ekonomik Umre Turu',
      slug: '15-gunluk-ekonomik-umre-turu',
      description: 'Bütçe dostu fiyatlarla manevi bir yolculuk. Konforlu ulaşım, kaliteli konaklama ve deneyimli rehberlik hizmetimizle unutulmaz bir umre deneyimi yaşayın.',
      price: 1250,
      currency: 'USD',
      startDate: new Date('2025-03-15'),
      endDate: new Date('2025-03-30'),
      quota: 45,
      meccaHotel: 'Grand Makkah Hotel',
      medinaHotel: 'Dar Al Taqwa Hotel',
      hotelStars: 3,
      kaabaDistance: 800,
      isFeatured: true,
      isActive: true,
      type: 'UMRE' as const,
    },
    {
      id: 'seed-tour-2',
      title: 'Ramazan Umresi - Son 10 Gün',
      slug: 'ramazan-umresi-son-10-gun',
      description: 'Ramazan\'ın son 10 gününü Mekke ve Medine\'de geçirin. Kadir Gecesi\'ni Harem\'de yaşama fırsatı.',
      price: 2450,
      currency: 'USD',
      startDate: new Date('2025-03-20'),
      endDate: new Date('2025-03-30'),
      quota: 30,
      meccaHotel: 'Swissotel Makkah',
      medinaHotel: 'Pullman ZamZam',
      hotelStars: 5,
      kaabaDistance: 100,
      isFeatured: true,
      isActive: true,
      type: 'UMRE' as const,
    },
    {
      id: 'seed-tour-3',
      title: 'Premium Kabe Manzaralı Umre',
      slug: 'premium-kabe-manzarali-umre',
      description: 'Kabe manzaralı odalarda konaklama ile lüks umre deneyimi. VIP transfer ve özel rehberlik hizmeti dahil.',
      price: 3200,
      currency: 'USD',
      startDate: new Date('2025-04-05'),
      endDate: new Date('2025-04-17'),
      quota: 20,
      meccaHotel: 'Fairmont Clock Tower',
      medinaHotel: 'Oberoi Madina',
      hotelStars: 5,
      kaabaDistance: 50,
      isFeatured: true,
      isActive: true,
      type: 'UMRE' as const,
    },
    {
      id: 'seed-tour-4',
      title: 'Sömestr Aile Umresi',
      slug: 'somestr-aile-umresi',
      description: 'Çocuklarınızla birlikte manevi bir tatil. Aile odaları ve çocuk indirimi ile uygun fiyatlı paket.',
      price: 1450,
      currency: 'USD',
      startDate: new Date('2025-01-25'),
      endDate: new Date('2025-02-05'),
      quota: 40,
      meccaHotel: 'Hilton Suites Makkah',
      medinaHotel: 'Millennium Al Aqeeq',
      hotelStars: 4,
      kaabaDistance: 400,
      isFeatured: true,
      isActive: true,
      type: 'UMRE' as const,
    },
    {
      id: 'seed-tour-5',
      title: 'Hac 2025 - Standart Paket',
      slug: 'hac-2025-standart-paket',
      description: '2025 Hac mevsimi için standart paket. Tüm hac menasiki, konforlu konaklama ve tecrübeli din görevlisi eşliğinde.',
      price: 6500,
      currency: 'USD',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-06-20'),
      quota: 50,
      meccaHotel: 'Makkah Towers',
      medinaHotel: 'Anwar Al Madinah Movenpick',
      hotelStars: 4,
      kaabaDistance: 600,
      isFeatured: true,
      isActive: true,
      type: 'HAC' as const,
    },
    {
      id: 'seed-tour-6',
      title: 'Hac 2025 - VIP Paket',
      slug: 'hac-2025-vip-paket',
      description: 'En konforlu hac deneyimi. Kabe\'ye yürüme mesafesinde 5 yıldızlı oteller, özel araç transferleri.',
      price: 12000,
      currency: 'USD',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-06-20'),
      quota: 20,
      meccaHotel: 'Raffles Makkah Palace',
      medinaHotel: 'The Ritz Carlton Medina',
      hotelStars: 5,
      kaabaDistance: 80,
      isFeatured: false,
      isActive: true,
      type: 'HAC' as const,
    },
    {
      id: 'seed-tour-7',
      title: '10 Günlük Hızlı Umre',
      slug: '10-gunluk-hizli-umre',
      description: 'Yoğun iş temposuna uygun kısa süreli umre paketi. Her şey dahil, sorunsuz organizasyon.',
      price: 1100,
      currency: 'USD',
      startDate: new Date('2025-02-10'),
      endDate: new Date('2025-02-20'),
      quota: 35,
      meccaHotel: 'Le Meridien Makkah',
      medinaHotel: 'Crowne Plaza Madinah',
      hotelStars: 4,
      kaabaDistance: 500,
      isFeatured: false,
      isActive: true,
      type: 'UMRE' as const,
    },
    {
      id: 'seed-tour-8',
      title: 'Yılbaşı Umresi',
      slug: 'yilbasi-umresi',
      description: 'Yeni yıla kutsal topraklarda girin. 31 Aralık\'ta Mekke\'de olma fırsatı.',
      price: 1650,
      currency: 'USD',
      startDate: new Date('2025-12-28'),
      endDate: new Date('2026-01-08'),
      quota: 40,
      meccaHotel: 'Conrad Makkah',
      medinaHotel: 'Sheraton Madinah',
      hotelStars: 5,
      kaabaDistance: 300,
      isFeatured: false,
      isActive: true,
      type: 'UMRE' as const,
    },
    {
      id: 'seed-tour-9',
      title: 'Kurban Bayramı Umresi',
      slug: 'kurban-bayrami-umresi',
      description: 'Kurban Bayramı\'nı Mekke ve Medine\'de kutlayın. Bayram namazını Harem\'de kılma fırsatı.',
      price: 1850,
      currency: 'USD',
      startDate: new Date('2025-06-05'),
      endDate: new Date('2025-06-15'),
      quota: 35,
      meccaHotel: 'Hilton Makkah Convention',
      medinaHotel: 'Dar Al Iman InterContinental',
      hotelStars: 5,
      kaabaDistance: 200,
      isFeatured: false,
      isActive: true,
      type: 'UMRE' as const,
    },
    {
      id: 'seed-tour-10',
      title: 'Emekliler İçin Özel Umre',
      slug: 'emekliler-icin-ozel-umre',
      description: 'Yaşlı misafirlerimiz için özel hazırlanmış program. Kısa yürüyüş mesafeleri, dinlenme molalı program.',
      price: 1550,
      currency: 'USD',
      startDate: new Date('2025-05-01'),
      endDate: new Date('2025-05-15'),
      quota: 25,
      meccaHotel: 'Makkah Clock Royal Tower',
      medinaHotel: 'Madinah Hilton',
      hotelStars: 5,
      kaabaDistance: 150,
      isFeatured: false,
      isActive: true,
      type: 'UMRE' as const,
    },
  ]

  for (const tour of tours) {
    const { id, ...tourData } = tour
    await prisma.tour.upsert({
      where: { id },
      update: tourData,
      create: { id, ...tourData },
    })
  }

  console.log('Örnek turlar oluşturuldu:', tours.length, 'adet')

  // Turlar için örnek görseller ekle
  const tourImages = [
    { tourId: 'seed-tour-1', url: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80', order: 0 },
    { tourId: 'seed-tour-2', url: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&q=80', order: 0 },
    { tourId: 'seed-tour-3', url: 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=800&q=80', order: 0 },
    { tourId: 'seed-tour-4', url: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&q=80', order: 0 },
    { tourId: 'seed-tour-5', url: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80', order: 0 },
    { tourId: 'seed-tour-6', url: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&q=80', order: 0 },
    { tourId: 'seed-tour-7', url: 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=800&q=80', order: 0 },
    { tourId: 'seed-tour-8', url: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&q=80', order: 0 },
    { tourId: 'seed-tour-9', url: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80', order: 0 },
    { tourId: 'seed-tour-10', url: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&q=80', order: 0 },
  ]

  // Önce eski görselleri sil
  await prisma.tourImage.deleteMany({
    where: { tourId: { startsWith: 'seed-tour-' } }
  })

  // Yeni görselleri ekle
  for (const image of tourImages) {
    await prisma.tourImage.create({ data: image })
  }

  console.log('Tur görselleri oluşturuldu:', tourImages.length, 'adet')

  // İlk tur için örnek itinerary (günlük program)
  await prisma.itinerary.deleteMany({ where: { tourId: { startsWith: 'seed-tour-' } } })

  const itineraryItems = [
    // seed-tour-1: 15 Günlük Ekonomik Umre
    { tourId: 'seed-tour-1', dayNumber: 1, title: 'İstanbul - Cidde Uçuşu', description: 'Atatürk Havalimanı\'ndan hareket. Cidde Havalimanı\'na varış. Mekke\'ye transfer ve otele yerleşme.' },
    { tourId: 'seed-tour-1', dayNumber: 2, title: 'Mekke - Umre İbadeti', description: 'Sabah namazının ardından umre ibadetinin yapılması. İhrama girme, tavaf ve sa\'y.' },
    { tourId: 'seed-tour-1', dayNumber: 3, title: 'Mekke - Ziyaretler', description: 'Hira Dağı, Sevr Mağarası ve tarihi mekanların ziyareti.' },
    { tourId: 'seed-tour-1', dayNumber: 4, title: 'Mekke - Serbest Gün', description: 'Kabe\'de ibadet ve serbest zaman.' },
    { tourId: 'seed-tour-1', dayNumber: 5, title: 'Mekke - Medine Yolculuğu', description: 'Öğle namazının ardından Medine\'ye hareket. Akşam Medine\'ye varış.' },
    { tourId: 'seed-tour-1', dayNumber: 6, title: 'Medine - Mescid-i Nebevi', description: 'Mescid-i Nebevi ziyareti ve Ravza-i Mutahhara.' },
    { tourId: 'seed-tour-1', dayNumber: 7, title: 'Medine - Ziyaretler', description: 'Uhud Dağı, Kuba Mescidi ve yedi mescid ziyaretleri.' },
    { tourId: 'seed-tour-1', dayNumber: 8, title: 'Medine - Serbest Gün', description: 'Mescid-i Nebevi\'de ibadet ve serbest zaman.' },
    { tourId: 'seed-tour-1', dayNumber: 9, title: 'Medine - İstanbul Dönüşü', description: 'Sabah namazının ardından havalimanına transfer. İstanbul\'a dönüş.' },

    // seed-tour-2: Ramazan Umresi
    { tourId: 'seed-tour-2', dayNumber: 1, title: 'İstanbul - Mekke', description: 'Gece uçuşu ile Cidde\'ye varış. Mekke\'ye transfer.' },
    { tourId: 'seed-tour-2', dayNumber: 2, title: 'Umre İbadeti', description: 'Umre ibadetinin ifası. Tavaf ve sa\'y.' },
    { tourId: 'seed-tour-2', dayNumber: 3, title: 'Ramazan İbadeti', description: 'Mekke\'de Ramazan ibadeti ve teravih namazları.' },
    { tourId: 'seed-tour-2', dayNumber: 4, title: 'Kadir Gecesi Hazırlığı', description: 'Kadir Gecesi\'ne hazırlık ve ibadet programı.' },
    { tourId: 'seed-tour-2', dayNumber: 5, title: 'Dönüş', description: 'İstanbul\'a dönüş uçuşu.' },

    // seed-tour-5: Hac Paketi
    { tourId: 'seed-tour-5', dayNumber: 1, title: 'İstanbul - Cidde', description: 'Hac kafilesi ile Cidde\'ye hareket.' },
    { tourId: 'seed-tour-5', dayNumber: 2, title: 'Mekke\'ye Varış', description: 'Mekke\'ye transfer ve otele yerleşme.' },
    { tourId: 'seed-tour-5', dayNumber: 3, title: 'Umre İbadeti', description: 'Kudüm tavafı ve umre ibadeti.' },
    { tourId: 'seed-tour-5', dayNumber: 4, title: 'Terviye Günü', description: 'Mina\'ya hareket ve geceleme.' },
    { tourId: 'seed-tour-5', dayNumber: 5, title: 'Arefe Günü', description: 'Arafat vakfesi. Müzdelife\'ye hareket.' },
    { tourId: 'seed-tour-5', dayNumber: 6, title: 'Bayramın 1. Günü', description: 'Şeytan taşlama, kurban kesimi, tıraş ve ziyaret tavafı.' },
    { tourId: 'seed-tour-5', dayNumber: 7, title: 'Bayramın 2. Günü', description: 'Mina\'da şeytan taşlama.' },
    { tourId: 'seed-tour-5', dayNumber: 8, title: 'Bayramın 3. Günü', description: 'Son şeytan taşlama ve Mekke\'ye dönüş.' },
    { tourId: 'seed-tour-5', dayNumber: 9, title: 'Veda Tavafı', description: 'Veda tavafı ve Medine\'ye hareket.' },
    { tourId: 'seed-tour-5', dayNumber: 10, title: 'Dönüş', description: 'İstanbul\'a dönüş.' },
  ]

  for (const item of itineraryItems) {
    await prisma.itinerary.create({ data: item })
  }
  console.log('İtinerary (günlük program) oluşturuldu:', itineraryItems.length, 'adet')

  // Dahil/Hariç öğeleri
  await prisma.tourIncluded.deleteMany({ where: { tourId: { startsWith: 'seed-tour-' } } })
  await prisma.tourExcluded.deleteMany({ where: { tourId: { startsWith: 'seed-tour-' } } })

  const includedItems = [
    { tourId: 'seed-tour-1', item: 'Gidiş-dönüş uçak bileti', order: 0 },
    { tourId: 'seed-tour-1', item: 'Mekke ve Medine otel konaklaması', order: 1 },
    { tourId: 'seed-tour-1', item: 'Tüm transferler (klimalı araçlar)', order: 2 },
    { tourId: 'seed-tour-1', item: 'Ziyaret programı', order: 3 },
    { tourId: 'seed-tour-1', item: 'Tecrübeli din görevlisi', order: 4 },
    { tourId: 'seed-tour-1', item: 'Seyahat sağlık sigortası', order: 5 },
    { tourId: 'seed-tour-2', item: 'Gidiş-dönüş uçak bileti', order: 0 },
    { tourId: 'seed-tour-2', item: '5 yıldızlı otel konaklaması', order: 1 },
    { tourId: 'seed-tour-2', item: 'Açık büfe sahur ve iftar', order: 2 },
    { tourId: 'seed-tour-2', item: 'VIP transfer hizmeti', order: 3 },
    { tourId: 'seed-tour-5', item: 'Gidiş-dönüş uçak bileti', order: 0 },
    { tourId: 'seed-tour-5', item: 'Mekke, Mina, Arafat konaklaması', order: 1 },
    { tourId: 'seed-tour-5', item: 'Kurban kesimi', order: 2 },
    { tourId: 'seed-tour-5', item: 'Tüm hac menasiki organizasyonu', order: 3 },
    { tourId: 'seed-tour-5', item: 'Din görevlisi refakati', order: 4 },
  ]

  for (const item of includedItems) {
    await prisma.tourIncluded.create({ data: item })
  }

  const excludedItems = [
    { tourId: 'seed-tour-1', item: 'Kişisel harcamalar', order: 0 },
    { tourId: 'seed-tour-1', item: 'Ekstra yemekler', order: 1 },
    { tourId: 'seed-tour-1', item: 'Vize ücreti (gerekli ise)', order: 2 },
    { tourId: 'seed-tour-2', item: 'Kişisel harcamalar', order: 0 },
    { tourId: 'seed-tour-2', item: 'Mini bar kullanımı', order: 1 },
    { tourId: 'seed-tour-5', item: 'Kişisel harcamalar', order: 0 },
    { tourId: 'seed-tour-5', item: 'Ekstra ziyaretler', order: 1 },
  ]

  for (const item of excludedItems) {
    await prisma.tourExcluded.create({ data: item })
  }

  console.log('Dahil/Hariç öğeler oluşturuldu')

  // Blog Yazıları
  const blogPosts = [
    {
      id: 'seed-blog-1',
      title: 'Umre Öncesi Yapılması Gereken Hazırlıklar',
      slug: 'umre-oncesi-yapilmasi-gereken-hazirliklar',
      excerpt: 'Umre yolculuğunuza çıkmadan önce yapmanız gereken önemli hazırlıkları bu yazımızda bulabilirsiniz.',
      content: `Umre ibadeti, Müslümanların hayatlarında çok özel bir yere sahiptir. Bu mübarek yolculuğa çıkmadan önce hem manevi hem de fiziksel hazırlıkların yapılması büyük önem taşır.

## Manevi Hazırlıklar

1. **Niyet**: Umre yolculuğuna çıkmadan önce kalbinizde sağlam bir niyet oluşturun.
2. **Tövbe ve İstiğfar**: Yolculuk öncesi günahlarınızdan tövbe edin.
3. **Borçları Ödeme**: Varsa borçlarınızı ödeyin veya alacaklılardan helallik alın.
4. **Helallik Alma**: Aile ve yakınlarınızdan helallik isteyin.

## Fiziksel Hazırlıklar

1. **Sağlık Kontrolü**: Yolculuk öncesi genel sağlık kontrolünden geçin.
2. **Aşılar**: Gerekli aşıları yaptırın.
3. **İlaçlar**: Düzenli kullandığınız ilaçları yeterli miktarda yanınıza alın.
4. **Rahat Giysiler**: Yürüyüşe uygun, rahat kıyafetler hazırlayın.

## Evrak Hazırlıkları

- Pasaport geçerlilik kontrolü
- Vize işlemleri
- Seyahat sigortası
- Otel ve uçuş belgelerinin çıktıları

Bu hazırlıkları tamamladıktan sonra huzurlu bir şekilde yolculuğunuza başlayabilirsiniz.`,
      image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80',
      author: 'Erkan Öztürk',
      category: 'Rehber',
      isPublished: true,
      publishedAt: new Date('2025-01-15'),
    },
    {
      id: 'seed-blog-2',
      title: 'İhram Nedir ve Nasıl Giyilir?',
      slug: 'ihram-nedir-ve-nasil-giyilir',
      excerpt: 'İhram, umre ve hac ibadetlerinin vazgeçilmez bir parçasıdır. İhramın ne olduğunu ve nasıl giyildiğini öğrenin.',
      content: `İhram, hac ve umre ibadetlerini yerine getirmek için giyilen özel kıyafet ve bu kıyafeti giyerek belirli yasaklara uyma halidir.

## İhram Kıyafeti

### Erkekler İçin
- **İzar**: Belden aşağıya sarılan dikişsiz bez
- **Rida**: Omuzlara örtülen dikişsiz bez
- Ayakkabı: Topuk ve parmak uçları açık terlik veya sandalet

### Kadınlar İçin
Kadınlar için özel bir ihram kıyafeti yoktur. Normal tesettür kıyafetleriyle ihrama girebilirler. Yalnızca yüzlerini örtmemeleri ve eldiven giymemeleri gerekir.

## İhrama Giriş

1. **Gusül Abdesti**: İhrama girmeden önce gusül abdesti alınır.
2. **İhram Namazı**: İki rekat ihram namazı kılınır.
3. **Niyet ve Telbiye**: Niyet edilir ve telbiye getirilir.

## İhram Yasakları

- Dikişli elbise giymek (erkekler için)
- Koku sürmek
- Saç ve sakal kesmek
- Tırnak kesmek
- Avlanmak
- Nikah kıymak

Bu kurallara uyarak ihram halinizi koruyabilirsiniz.`,
      image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&q=80',
      author: 'Erkan Öztürk',
      category: 'Bilgi',
      isPublished: true,
      publishedAt: new Date('2025-01-10'),
    },
    {
      id: 'seed-blog-3',
      title: 'Mekke ve Medine\'de Ziyaret Edilmesi Gereken Yerler',
      slug: 'mekke-ve-medinede-ziyaret-edilmesi-gereken-yerler',
      excerpt: 'Kutsal topraklarda bulunduğunuz süre içinde ziyaret etmeniz gereken önemli mekanları keşfedin.',
      content: `Hac ve umre ziyaretiniz sırasında Mekke ve Medine'de birçok tarihi ve dini açıdan önemli mekanı ziyaret edebilirsiniz.

## Mekke'de Ziyaret Edilecek Yerler

### Mescid-i Haram ve Kabe
Dünyanın en kutsal mescidi ve Müslümanların kıblesi olan Kabe burada bulunmaktadır.

### Hira Mağarası
Hz. Muhammed'e ilk vahyin geldiği yer olan Hira Mağarası, Nur Dağı'nın tepesinde yer alır.

### Sevr Mağarası
Hicret sırasında Hz. Muhammed ve Hz. Ebubekir'in sığındığı mağaradır.

### Cennetu'l-Mualla
Hz. Hatice ve birçok sahabenin medfun olduğu kabristanlık.

## Medine'de Ziyaret Edilecek Yerler

### Mescid-i Nebevi
Hz. Muhammed'in mescidi ve kabri burada bulunmaktadır.

### Ravza-i Mutahhara
Hz. Peygamber'in kabri ile minberi arasındaki alan.

### Cennetü'l-Baki
Birçok sahabenin medfun olduğu tarihi kabristan.

### Uhud Dağı
Uhud Savaşı'nın yaşandığı tarihi alan.

### Kuba Mescidi
İslam tarihinin ilk mescidi.

Bu mekanları ziyaret ederek manevi yolculuğunuzu zenginleştirebilirsiniz.`,
      image: 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=800&q=80',
      author: 'Erkan Öztürk',
      category: 'Gezi',
      isPublished: true,
      publishedAt: new Date('2025-01-05'),
    },
  ]

  for (const post of blogPosts) {
    const { id, ...postData } = post
    await prisma.blogPost.upsert({
      where: { id },
      update: postData,
      create: { id, ...postData },
    })
  }
  console.log('Blog yazıları oluşturuldu:', blogPosts.length, 'adet')

  // SSS (FAQ)
  const faqs = [
    {
      id: 'seed-faq-1',
      question: 'Umre için vize gerekiyor mu?',
      answer: 'Evet, Suudi Arabistan\'a giriş için vize gerekmektedir. Türk vatandaşları e-vize alabilir veya acente aracılığıyla vize işlemlerini yaptırabilir. Vize işlemleri genellikle tur paketine dahildir.',
      order: 1,
      isActive: true,
    },
    {
      id: 'seed-faq-2',
      question: 'Umre ne kadar sürer?',
      answer: 'Umre turları genellikle 10-15 gün arasında sürer. Kısa programlar 7 gün, uzun programlar ise 20 güne kadar çıkabilir. Süre tercihlerinize ve bütçenize göre değişebilir.',
      order: 2,
      isActive: true,
    },
    {
      id: 'seed-faq-3',
      question: 'Ödeme nasıl yapılır?',
      answer: 'Ödemelerinizi kredi kartı, havale/EFT veya nakit olarak yapabilirsiniz. Taksitli ödeme seçeneklerimiz de mevcuttur. Detaylı bilgi için bizimle iletişime geçebilirsiniz.',
      order: 3,
      isActive: true,
    },
    {
      id: 'seed-faq-4',
      question: 'Çocuklar için indirim var mı?',
      answer: '2-12 yaş arası çocuklar için %25-50 arası indirim uygulanmaktadır. 2 yaş altı bebekler ücretsiz katılabilir ancak uçakta ayrı koltuk verilmez.',
      order: 4,
      isActive: true,
    },
    {
      id: 'seed-faq-5',
      question: 'Tur iptal edilirse ne olur?',
      answer: 'Şirketimizden kaynaklanan iptallerde ödemenizin tamamı iade edilir. Kendi isteğinizle yapacağınız iptallerde ise iptal tarihine göre kesinti uygulanabilir. Detaylar sözleşmemizde belirtilmiştir.',
      order: 5,
      isActive: true,
    },
    {
      id: 'seed-faq-6',
      question: 'Otel ve Kabe arası mesafe ne kadardır?',
      answer: 'Otel seçiminize göre Kabe\'ye olan mesafe değişir. Ekonomik paketlerde 500-1000 metre, standart paketlerde 200-500 metre, VIP paketlerde ise 50-200 metre mesafede oteller tercih edilir.',
      order: 6,
      isActive: true,
    },
    {
      id: 'seed-faq-7',
      question: 'Yaşlı veya engelli misafirler için özel hizmet var mı?',
      answer: 'Evet, yaşlı ve engelli misafirlerimiz için tekerlekli sandalye hizmeti, yakın oteller ve özel refakatçi gibi hizmetler sunulmaktadır. Lütfen rezervasyon sırasında bu ihtiyacınızı belirtin.',
      order: 7,
      isActive: true,
    },
    {
      id: 'seed-faq-8',
      question: 'Ramazan umresinde oruç tutmak zor mu?',
      answer: 'Suudi Arabistan\'da Ramazan ayında özel bir atmosfer yaşanır. Otellerde sahur ve iftar hizmetleri sunulur. Sıcak havaya karşı bol su tüketimi ve dinlenme önerilir.',
      order: 8,
      isActive: true,
    },
  ]

  for (const faq of faqs) {
    const { id, ...faqData } = faq
    await prisma.fAQ.upsert({
      where: { id },
      update: faqData,
      create: { id, ...faqData },
    })
  }
  console.log('SSS oluşturuldu:', faqs.length, 'adet')

  // Belgeler (Certificates)
  const certificates = [
    {
      id: 'seed-cert-1',
      title: 'TÜRSAB Belgesi',
      number: 'A-12345',
      description: 'Türkiye Seyahat Acentaları Birliği üyelik belgesi. Yasal ve güvenilir hizmet garantisi.',
      icon: 'Award',
      order: 1,
      isActive: true,
    },
    {
      id: 'seed-cert-2',
      title: 'Diyanet İşleri Başkanlığı',
      number: 'DİB-2024-HAC-001',
      description: 'Hac ve Umre organizasyonu için Diyanet İşleri Başkanlığı onay belgesi.',
      icon: 'Shield',
      order: 2,
      isActive: true,
    },
    {
      id: 'seed-cert-3',
      title: 'Ticaret Sicil Belgesi',
      number: '123456-789',
      description: 'İstanbul Ticaret Odası kayıtlı resmi şirket belgesi.',
      icon: 'FileText',
      order: 3,
      isActive: true,
    },
    {
      id: 'seed-cert-4',
      title: 'Vergi Levhası',
      number: '1234567890',
      description: 'T.C. Gelir İdaresi Başkanlığı vergi mükellefi belgesi.',
      icon: 'Building',
      order: 4,
      isActive: true,
    },
  ]

  for (const cert of certificates) {
    const { id, ...certData } = cert
    await prisma.certificate.upsert({
      where: { id },
      update: certData,
      create: { id, ...certData },
    })
  }
  console.log('Belgeler oluşturuldu:', certificates.length, 'adet')

  // Banka Hesapları
  const bankAccounts = [
    {
      id: 'seed-bank-1',
      bankName: 'Ziraat Bankası',
      accountName: 'En Ucuz Hac Umre Turizm Ltd. Şti.',
      iban: 'TR12 0001 0012 3456 7890 1234 56',
      branch: 'Fatih Şubesi - 1234',
      logo: '/banks/ziraat.png',
      order: 1,
      isActive: true,
    },
    {
      id: 'seed-bank-2',
      bankName: 'Vakıfbank',
      accountName: 'En Ucuz Hac Umre Turizm Ltd. Şti.',
      iban: 'TR98 0001 5001 5800 7290 1234 56',
      branch: 'Sultanahmet Şubesi - 567',
      logo: '/banks/vakifbank.png',
      order: 2,
      isActive: true,
    },
    {
      id: 'seed-bank-3',
      bankName: 'Halkbank',
      accountName: 'En Ucuz Hac Umre Turizm Ltd. Şti.',
      iban: 'TR45 0001 2009 8760 0010 1234 56',
      branch: 'Eminönü Şubesi - 890',
      logo: '/banks/halkbank.png',
      order: 3,
      isActive: true,
    },
    {
      id: 'seed-bank-4',
      bankName: 'Türkiye İş Bankası',
      accountName: 'En Ucuz Hac Umre Turizm Ltd. Şti.',
      iban: 'TR64 0006 4000 0011 2345 6789 01',
      branch: 'Laleli Şubesi - 4321',
      logo: '/banks/isbank.png',
      order: 4,
      isActive: true,
    },
  ]

  for (const bank of bankAccounts) {
    const { id, ...bankData } = bank
    await prisma.bankAccount.upsert({
      where: { id },
      update: bankData,
      create: { id, ...bankData },
    })
  }
  console.log('Banka hesapları oluşturuldu:', bankAccounts.length, 'adet')

  // Site Ayarları güncelle - Şirket bilgileri ekle
  await prisma.siteSettings.upsert({
    where: { id: 'site_settings' },
    update: {
      companyStory: `En Ucuz Hac Umre, 2005 yılından bu yana Hac ve Umre yolculuklarında misafirlerine en iyi hizmeti sunma vizyonuyla kurulmuştur. Sektördeki 20 yıllık tecrübemizle, her yıl binlerce misafirimizi kutsal topraklara uğurlamanın gururunu yaşıyoruz.

Misyonumuz, manevi yolculuğunuzda yanınızda olmak ve bu mübarek ibadeti en konforlu, güvenli ve ekonomik şekilde gerçekleştirmenize yardımcı olmaktır. Türsab belgeli, resmi bir acente olarak tüm işlemlerinizi yasalara uygun şekilde yürütüyoruz.

Deneyimli kadromuz, sektördeki en son gelişmeleri takip ederek size en iyi fiyat ve hizmet garantisi sunmaktadır.`,
      missionStatement: 'Hac ve Umre ibadetini yerine getirmek isteyen müşterilerimize, en uygun fiyatlarla, en kaliteli hizmeti sunmak. Manevi yolculuklarında yanlarında olmak ve unutulmaz bir deneyim yaşatmak.',
      visionStatement: 'Türkiye\'nin en güvenilir ve tercih edilen Hac-Umre organizasyon şirketi olmak. Sektörde kalite ve müşteri memnuniyeti standartlarını belirleyen öncü bir marka haline gelmek.',
      yearsExperience: 20,
      totalGuests: 50000,
      satisfactionRate: 98,
    },
    create: {
      id: 'site_settings',
      heroTitle: 'Manevi Yolculuğunuz En Uygun Fiyatlarla Başlasın',
      heroSubtitle: 'Hac ve Umre turlarında Türkiye\'nin en güvenilir karşılaştırma platformu.',
      contactPhone: '+90 212 555 55 55',
      email: 'info@enucuzhacumre.com',
      address: 'Fatih Sultan Mehmet Mah. İstanbul Cad. No:123 Fatih/İstanbul',
      whatsappNumber: '+905555555555',
      footerText: '© 2025 En Ucuz Hac Umre. Tüm hakları saklıdır.',
      tursabNo: 'A-12345',
      companyStory: `En Ucuz Hac Umre, 2005 yılından bu yana Hac ve Umre yolculuklarında misafirlerine en iyi hizmeti sunma vizyonuyla kurulmuştur.`,
      missionStatement: 'Hac ve Umre ibadetini yerine getirmek isteyen müşterilerimize, en uygun fiyatlarla, en kaliteli hizmeti sunmak.',
      visionStatement: 'Türkiye\'nin en güvenilir ve tercih edilen Hac-Umre organizasyon şirketi olmak.',
      yearsExperience: 20,
      totalGuests: 50000,
      satisfactionRate: 98,
    },
  })
  console.log('Site ayarları güncellendi')

  // Menü Öğeleri
  const menuItems = [
    { id: 'menu-1', label: 'Anasayfa', href: '/', order: 1 },
    { id: 'menu-2', label: 'Hakkımızda', href: '/hakkimizda', order: 2 },
    { id: 'menu-3', label: 'Hac Turları', href: '/hac-turlari', order: 3 },
    { id: 'menu-4', label: 'Umre Turları', href: '/umre-turlari', order: 4 },
    { id: 'menu-5', label: 'Blog', href: '/blog', order: 5 },
    { id: 'menu-6', label: 'İletişim', href: '/iletisim', order: 6 },
  ]

  for (const item of menuItems) {
    const { id, ...data } = item
    await prisma.menuItem.upsert({
      where: { id },
      update: data,
      create: { id, ...data, isActive: true },
    })
  }
  console.log('Menü öğeleri oluşturuldu:', menuItems.length, 'adet')

  // Footer Linkleri - Hızlı Linkler
  const quickLinks = [
    { id: 'fl-1', section: 'quick-links', label: 'Hakkımızda', href: '/hakkimizda', order: 1 },
    { id: 'fl-2', section: 'quick-links', label: 'Belgelerimiz', href: '/belgelerimiz', order: 2 },
    { id: 'fl-3', section: 'quick-links', label: 'Banka Hesapları', href: '/banka-hesaplari', order: 3 },
    { id: 'fl-4', section: 'quick-links', label: 'Sıkça Sorulan Sorular', href: '/sss', order: 4 },
    { id: 'fl-5', section: 'quick-links', label: 'KVKK', href: '/kvkk', order: 5 },
    { id: 'fl-6', section: 'quick-links', label: 'Blog', href: '/blog', order: 6 },
  ]

  // Footer Linkleri - Popüler Rotalar
  const popularRoutes = [
    { id: 'fl-7', section: 'popular-routes', label: 'Umre Turları', href: '/umre-turlari', order: 1 },
    { id: 'fl-8', section: 'popular-routes', label: 'Hac Turları', href: '/hac-turlari', order: 2 },
    { id: 'fl-9', section: 'popular-routes', label: 'Ramazan Umresi', href: '/ramazan-umresi', order: 3 },
    { id: 'fl-10', section: 'popular-routes', label: 'Sömestr Umresi', href: '/somestr-umresi', order: 4 },
  ]

  for (const link of [...quickLinks, ...popularRoutes]) {
    const { id, ...data } = link
    await prisma.footerLink.upsert({
      where: { id },
      update: data,
      create: { id, ...data, isActive: true },
    })
  }
  console.log('Footer linkleri oluşturuldu:', quickLinks.length + popularRoutes.length, 'adet')

  // İletişim Formu Konuları
  const contactSubjects = [
    { id: 'cs-1', name: 'Umre Turları', order: 1 },
    { id: 'cs-2', name: 'Hac Turları', order: 2 },
    { id: 'cs-3', name: 'Fiyat Bilgisi', order: 3 },
    { id: 'cs-4', name: 'Rezervasyon', order: 4 },
    { id: 'cs-5', name: 'Diğer', order: 5 },
  ]

  for (const subject of contactSubjects) {
    const { id, ...data } = subject
    await prisma.contactSubject.upsert({
      where: { id },
      update: data,
      create: { id, ...data, isActive: true },
    })
  }
  console.log('İletişim konuları oluşturuldu:', contactSubjects.length, 'adet')

  // KVKK Sayfası
  await prisma.legalPage.upsert({
    where: { slug: 'kvkk' },
    update: {},
    create: {
      slug: 'kvkk',
      title: 'Kişisel Verilerin Korunması',
      content: `## 1. Veri Sorumlusu

En Ucuz Hac Umre Turizm Ltd. Şti. olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca veri sorumlusu sıfatıyla, kişisel verilerinizi aşağıda açıklanan kapsamda işleyebilecek, kaydedebilecek ve saklayabileceğiz.

## 2. İşlenen Kişisel Veriler

Hizmet sunumumuz kapsamında aşağıdaki kişisel verileriniz işlenmektedir:

- Kimlik Bilgileri (Ad, soyad, TC kimlik no, pasaport bilgileri)
- İletişim Bilgileri (Telefon, e-posta, adres)
- Sağlık Bilgileri (Aşı durumu, hastalık bilgileri)
- Finansal Bilgiler (Banka hesap bilgileri, ödeme bilgileri)

## 3. Verilerin İşlenme Amacı

Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:

- Hac ve Umre hizmetlerinin sunulması
- Vize işlemlerinin gerçekleştirilmesi
- Rezervasyon ve ödeme işlemlerinin yapılması
- Yasal yükümlülüklerin yerine getirilmesi
- İletişim faaliyetlerinin yürütülmesi

## 4. Haklarınız

KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:

- Kişisel verilerinizin işlenip işlenmediğini öğrenme
- İşlenmişse buna ilişkin bilgi talep etme
- İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme
- Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme
- Eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme
- Kişisel verilerin silinmesini veya yok edilmesini isteme

## 5. İletişim

KVKK kapsamındaki taleplerinizi, info@enucuzhacumre.com e-posta adresimize veya şirket adresimize yazılı olarak iletebilirsiniz.

---

*Son Güncellenme: 01 Ocak 2025*`,
      isActive: true,
    },
  })
  console.log('KVKK sayfası oluşturuldu')

  // ==================== MOBİL VERİLER ====================
  console.log('\n📱 Mobil veriler yükleniyor...')

  // DUALAR
  const dualarData = [
    { baslik: "Telbiye Duası", altBaslik: "İhrama girerken okunan dua", kategori: "Genel Dua", arapca: "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لاَ شَرِيكَ لَكَ لَبَّيْكَ", okunusu: "Lebbeyk Allahümme lebbeyk...", meali: "Buyur Allah'ım buyur!", kaynak: "Buhari" },
    { baslik: "Tavaf Duası", altBaslik: "Tavaf ederken", kategori: "Tavaf Duaları", arapca: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً", okunusu: "Rabbena atina fid dünya...", meali: "Rabbimiz! Bize dünyada iyilik ver", kaynak: "Bakara 201" },
    { baslik: "Safa Tepesi Duası", altBaslik: "Safa tepesinde", kategori: "Safa-Merve Duaları", arapca: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللهِ", okunusu: "İnnes Safa vel Mervete...", meali: "Şüphesiz Safa ve Merve Allah'ın şiarlarındandır", kaynak: "Bakara 158" },
  ]

  const kategoriMap = new Map<string, string>()
  const kategoriler = ["Genel Dua", "Tavaf Duaları", "Safa-Merve Duaları"]
  for (let i = 0; i < kategoriler.length; i++) {
    const k = await prisma.duaKategori.upsert({
      where: { ad: kategoriler[i] },
      update: {},
      create: { ad: kategoriler[i], icon: "fas fa-book", order: i, isActive: true }
    })
    kategoriMap.set(kategoriler[i], k.id)
  }

  for (let i = 0; i < dualarData.length; i++) {
    const d = dualarData[i]
    await prisma.dua.upsert({
      where: { id: `mobil-dua-${i}` },
      update: { baslik: d.baslik, altBaslik: d.altBaslik, arapca: d.arapca, okunusu: d.okunusu, meali: d.meali, kaynak: d.kaynak, kategoriId: kategoriMap.get(d.kategori)!, order: i },
      create: { id: `mobil-dua-${i}`, baslik: d.baslik, altBaslik: d.altBaslik, arapca: d.arapca, okunusu: d.okunusu, meali: d.meali, kaynak: d.kaynak, kategoriId: kategoriMap.get(d.kategori)!, order: i, isActive: true }
    })
  }
  console.log('   ✅ Dualar yüklendi')

  // REHBERLER
  const rehberlerData = [
    { slug: "umre-nedir", baslik: "Umre Nedir?", altBaslik: "Tanım ve önemi", bolum: "UMRE" as const, icerik: { giris: "Umre, küçük hac olarak bilinen ibadettir.", rukun: ["İhram", "Tavaf", "Sa'y", "Tıraş"] } },
    { slug: "ihram-nedir", baslik: "İhram Nedir?", altBaslik: "Kuralları", bolum: "IHRAM" as const, icerik: { giris: "İhram, hac ve umre için giyilen kutsal kıyafettir." } },
    { slug: "tavaf-nedir", baslik: "Tavaf Nedir?", altBaslik: "Nasıl yapılır", bolum: "TAVAF" as const, icerik: { giris: "Tavaf, Kabe'nin etrafında 7 kez dönmektir." } },
    { slug: "say-nedir", baslik: "Sa'y Nedir?", altBaslik: "Safa-Merve", bolum: "SAY" as const, icerik: { giris: "Sa'y, Safa ve Merve tepeleri arasında 7 kez gidip gelmektir." } },
  ]

  for (let i = 0; i < rehberlerData.length; i++) {
    const r = rehberlerData[i]
    await prisma.rehber.upsert({
      where: { slug: r.slug },
      update: { baslik: r.baslik, altBaslik: r.altBaslik, bolum: r.bolum, icerik: r.icerik, order: i },
      create: { slug: r.slug, baslik: r.baslik, altBaslik: r.altBaslik, bolum: r.bolum, kategori: "temel", icon: "fas fa-book", renk: "blue", icerik: r.icerik, order: i, isActive: true }
    })
  }
  console.log('   ✅ Rehberler yüklendi')

  // ZİYARET YERLERİ
  const ziyaretData = [
    { slug: "mescid-i-haram", baslik: "Mescid-i Haram", sehir: "MEKKE" as const, aciklama: "Kabe'nin bulunduğu kutsal mescit" },
    { slug: "hira-magarasi", baslik: "Hira Mağarası", sehir: "MEKKE" as const, aciklama: "İlk vahyin indiği yer" },
    { slug: "mescid-i-nebevi", baslik: "Mescid-i Nebevi", sehir: "MEDINE" as const, aciklama: "Peygamber Mescidi" },
    { slug: "uhud-dagi", baslik: "Uhud Dağı", sehir: "MEDINE" as const, aciklama: "Uhud Savaşı'nın yapıldığı yer" },
  ]

  for (let i = 0; i < ziyaretData.length; i++) {
    const z = ziyaretData[i]
    await prisma.ziyaretYeri.upsert({
      where: { slug: z.slug },
      update: { baslik: z.baslik, sehir: z.sehir, aciklama: z.aciklama, order: i },
      create: { slug: z.slug, baslik: z.baslik, sehir: z.sehir, kategori: "mescid", aciklama: z.aciklama, icon: "fas fa-mosque", order: i, isActive: true }
    })
  }
  console.log('   ✅ Ziyaret Yerleri yüklendi')

  // YAPILACAKLAR
  const gorevKat = await prisma.gorevKategori.upsert({
    where: { slug: "hazirlik" },
    update: {},
    create: { slug: "hazirlik", baslik: "Hazırlık", icon: "fas fa-check", renk: "#10B981", order: 0, isActive: true }
  })

  const gorevler = ["Pasaport kontrolü", "Vize başvurusu", "İhram takımı al", "Duaları öğren"]
  for (let i = 0; i < gorevler.length; i++) {
    const slug = gorevler[i].toLowerCase().replace(/\s+/g, "-").replace(/ş/g, "s").replace(/ü/g, "u").replace(/ö/g, "o").replace(/ı/g, "i")
    await prisma.gorev.upsert({
      where: { slug },
      update: { baslik: gorevler[i], order: i },
      create: { slug, baslik: gorevler[i], aciklama: "", oncelik: "ORTA", kategoriId: gorevKat.id, order: i, isActive: true }
    })
  }
  console.log('   ✅ Yapılacaklar yüklendi')

  // MOBİL SSS
  const sssData = [
    { slug: "ihram-nasil-giyilir", soru: "İhram nasıl giyilir?", cevap: { giris: "İhram iki parça dikişsiz beyaz kumaştan oluşur.", maddeler: ["Alt parça bele sarılır", "Üst parça omuzlara atılır"] } },
    { slug: "tavaf-nasil-yapilir", soru: "Tavaf nasıl yapılır?", cevap: { giris: "Tavaf Kabe'nin etrafında 7 tur dönmektir.", maddeler: ["Hacer-i Esved'den başla", "Sola dön", "7 tur tamamla"] } },
  ]

  for (let i = 0; i < sssData.length; i++) {
    const s = sssData[i]
    await prisma.mobilSSS.upsert({
      where: { slug: s.slug },
      update: { soru: s.soru, cevap: s.cevap, order: i },
      create: { slug: s.slug, soru: s.soru, cevap: s.cevap, kategori: "Genel", icon: "fas fa-question", order: i, isActive: true }
    })
  }
  console.log('   ✅ Mobil SSS yüklendi')

  console.log('\n🎉 Tüm seed işlemleri tamamlandı!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
