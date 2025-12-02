import { Container } from "@/components/ui/container";
import { Gallery } from "@/components/tour-detail/gallery";
import { TourTabs } from "@/components/tour-detail/tabs";
import { BookingCard } from "@/components/tour-detail/booking-card";
import { ArrowLeft, Calendar, Clock, MapPin, Star } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

async function getTourBySlug(slug: string) {
  try {
    const tour = await prisma.tour.findUnique({
      where: { 
        slug,
        isActive: true, // Sadece aktif turları göster
      },
      include: {
        images: { orderBy: { order: 'asc' } },
        itinerary: { orderBy: { dayNumber: 'asc' } },
        included: { orderBy: { order: 'asc' } },
        excluded: { orderBy: { order: 'asc' } },
      },
    });

    return tour;
  } catch (error) {
    console.error("Tur alınamadı:", error);
    return null;
  }
}

export default async function TourDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);

  if (!tour) {
    notFound(); // 404 sayfasına yönlendir
  }

  // Tarih formatla
  const startDate = new Date(tour.startDate);
  const endDate = new Date(tour.endDate);
  const dateRange = `${startDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} - ${endDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
  
  // Gün hesapla
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const duration = `${daysDiff} Gün`;

  // Görselleri hazırla
  const images = tour.images.map(img => img.url);

  // Otel bilgileri
  const hotelInfo = {
    name: tour.meccaHotel || "Belirtilmemiş",
    stars: tour.hotelStars,
    description: tour.description,
    medinaHotel: tour.medinaHotel,
    kaabaDistance: tour.kaabaDistance,
  };

  // İtinerary'yi uygun formata çevir
  const itinerary = tour.itinerary.map(item => ({
    day: item.dayNumber,
    title: item.title,
    description: item.description,
  }));

  // Included/Excluded listelerini hazırla
  const included = tour.included.map(item => item.item);
  const excluded = tour.excluded.map(item => item.item);

  // Fiyat
  const price = Number(tour.price);

  return (
    <main className="bg-gray-50 min-h-screen pb-20">
      {/* Breadcrumb & Header */}
      <div className="bg-white border-b border-gray-200">
        <Container className="py-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary transition-colors">Anasayfa</Link>
            <span>/</span>
            <Link href="/#turlar" className="hover:text-primary transition-colors">Turlar</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{tour.title}</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-primary mb-3">
                {tour.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-600">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-secondary" />
                  Mekke & Medine
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-secondary" />
                  {duration}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-secondary" />
                  {dateRange}
                </span>
              </div>
            </div>
            
            {/* Hotel Stars */}
            <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-100">
              {[...Array(tour.hotelStars)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              ))}
              <span className="font-bold text-yellow-700 ml-2">{tour.hotelStars} Yıldız Otel</span>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
          
          {/* Left Column: Content (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Gallery */}
            {images.length > 0 && <Gallery images={images} />}

            {/* Description */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-primary mb-4">Tur Hakkında</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {tour.description}
              </p>
            </div>

            {/* Tabs (Program, Hotel, Included) */}
            <TourTabs 
              itinerary={itinerary}
              included={included}
              excluded={excluded}
              hotelInfo={hotelInfo}
            />
          </div>

          {/* Right Column: Sticky Booking Card (4 cols) */}
          <div className="lg:col-span-4">
            <BookingCard 
              basePrice={price} 
              currency={tour.currency}
              tourId={tour.id}
              tourTitle={tour.title}
              quota={tour.quota}
              bookedSeats={tour.bookedSeats}
            />
          </div>

        </div>
      </Container>
    </main>
  );
}
