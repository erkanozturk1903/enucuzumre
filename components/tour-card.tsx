import Image from "next/image";
import { Star, Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface TourCardProps {
  tour: {
    id: string;
    title: string;
    slug: string;
    price: any; // Decimal
    currency: string;
    startDate: Date;
    endDate: Date;
    hotelStars: number;
    meccaHotel?: string | null;
    medinaHotel?: string | null;
    images?: { url: string }[];
    type: string;
  };
  className?: string;
}

export function TourCard({ tour, className }: TourCardProps) {
  // Tarih formatla
  const startDate = new Date(tour.startDate);
  const endDate = new Date(tour.endDate);
  const dateRange = `${startDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })} - ${endDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  
  // Gün hesapla
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const duration = `${daysDiff} Gün`;

  // İlk görseli al
  const imageUrl = tour.images?.[0]?.url || "https://picsum.photos/seed/tour/800/600";

  // Fiyatı formatlama
  const price = Number(tour.price);

  // Tip badge'i
  const typeLabels: Record<string, string> = {
    UMRE: "Umre",
    HAC: "Hac",
    KULTUR: "Kültür"
  };

  return (
    <Link
      href={`/turlar/${tour.slug}`}
      className={cn(
        "group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-2 overflow-hidden flex flex-col h-full block",
        className
      )}
    >
      {/* Image Area */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={imageUrl}
          alt={tour.title}
          fill
          className="object-cover transform group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        {/* Type Badge */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm backdrop-blur-sm bg-secondary text-white">
            {typeLabels[tour.type] || tour.type}
          </span>
        </div>

        {/* Location Badge (Bottom Left of Image) */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white/90 text-xs font-medium">
          <MapPin className="h-3.5 w-3.5 text-secondary" />
          Mekke - Medine
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Header: Stars & Duration */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-3.5 w-3.5",
                  i < tour.hotelStars ? "fill-secondary text-secondary" : "fill-gray-200 text-gray-200"
                )}
              />
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
            <Clock className="h-3.5 w-3.5" />
            {duration}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-primary mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
          {tour.title}
        </h3>

        {/* Hotel & Date Info */}
        <div className="space-y-2 mb-6">
          {tour.meccaHotel && (
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              {tour.meccaHotel}
            </p>
          )}
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            {dateRange}
          </p>
        </div>

        {/* Footer: Price & Action */}
        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">
              Kişi Başı
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-secondary">
                {price.toLocaleString('tr-TR')}
              </span>
              <span className="text-xs text-gray-400 font-medium">
                {tour.currency}
              </span>
            </div>
          </div>
          
          <div className="h-10 px-5 rounded-xl bg-[#059669] text-white text-sm font-semibold flex items-center gap-2 group/btn hover:bg-[#047857] transition-colors shadow-md hover:shadow-lg cursor-pointer">
            İncele
            <ArrowRight className="h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
