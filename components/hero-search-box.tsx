"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

const CITIES = [
  { value: "", label: "Seçiniz" },
  { value: "istanbul", label: "İstanbul" },
  { value: "ankara", label: "Ankara" },
  { value: "izmir", label: "İzmir" },
  { value: "bursa", label: "Bursa" },
  { value: "konya", label: "Konya" },
  { value: "antalya", label: "Antalya" },
];

const TOUR_TYPES = [
  { value: "", label: "Seçiniz" },
  { value: "UMRE", label: "Umre" },
];

const MONTHS = [
  { value: "", label: "Seçiniz" },
  { value: "1", label: "Ocak" },
  { value: "2", label: "Şubat" },
  { value: "3", label: "Mart" },
  { value: "4", label: "Nisan" },
  { value: "5", label: "Mayıs" },
  { value: "6", label: "Haziran" },
  { value: "7", label: "Temmuz" },
  { value: "8", label: "Ağustos" },
  { value: "9", label: "Eylül" },
  { value: "10", label: "Ekim" },
  { value: "11", label: "Kasım" },
  { value: "12", label: "Aralık" },
];

const HOTELS = [
  { value: "", label: "Seçiniz" },
  { value: "3", label: "3 Yıldız" },
  { value: "4", label: "4 Yıldız" },
  { value: "5", label: "5 Yıldız" },
];

export function HeroSearchBox() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    city: "",
    tourType: "",
    month: "",
    mekkaHotel: "",
    medinaHotel: "",
  });

  const handleChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.city) params.set("sehir", filters.city);
    if (filters.tourType) params.set("tur", filters.tourType);
    if (filters.month) params.set("ay", filters.month);
    if (filters.mekkaHotel) params.set("mekke", filters.mekkaHotel);
    if (filters.medinaHotel) params.set("medine", filters.medinaHotel);

    router.push(`/umre-turlari?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-w-6xl mx-auto">
      {/* Search Form */}
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 items-end">

          {/* Şehir */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Şehir
            </label>
            <div className="relative">
              <select
                value={filters.city}
                onChange={(e) => handleChange("city", e.target.value)}
                className="w-full h-11 pl-3 pr-8 bg-white border-b-2 border-gray-200 text-gray-700 focus:outline-none focus:border-secondary appearance-none cursor-pointer text-sm"
              >
                {CITIES.map((city) => (
                  <option key={city.value} value={city.value}>
                    {city.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Tur */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tur
            </label>
            <div className="relative">
              <select
                value={filters.tourType}
                onChange={(e) => handleChange("tourType", e.target.value)}
                className="w-full h-11 pl-3 pr-8 bg-white border-b-2 border-gray-200 text-gray-700 focus:outline-none focus:border-secondary appearance-none cursor-pointer text-sm"
              >
                {TOUR_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Ay */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ay
            </label>
            <div className="relative">
              <select
                value={filters.month}
                onChange={(e) => handleChange("month", e.target.value)}
                className="w-full h-11 pl-3 pr-8 bg-white border-b-2 border-gray-200 text-gray-700 focus:outline-none focus:border-secondary appearance-none cursor-pointer text-sm"
              >
                {MONTHS.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Mekke Otel */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mekke Otel
            </label>
            <div className="relative">
              <select
                value={filters.mekkaHotel}
                onChange={(e) => handleChange("mekkaHotel", e.target.value)}
                className="w-full h-11 pl-3 pr-8 bg-white border-b-2 border-gray-200 text-gray-700 focus:outline-none focus:border-secondary appearance-none cursor-pointer text-sm"
              >
                {HOTELS.map((hotel) => (
                  <option key={hotel.value} value={hotel.value}>
                    {hotel.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Medine Otel */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Medine Otel
            </label>
            <div className="relative">
              <select
                value={filters.medinaHotel}
                onChange={(e) => handleChange("medinaHotel", e.target.value)}
                className="w-full h-11 pl-3 pr-8 bg-white border-b-2 border-gray-200 text-gray-700 focus:outline-none focus:border-secondary appearance-none cursor-pointer text-sm"
              >
                {HOTELS.map((hotel) => (
                  <option key={hotel.value} value={hotel.value}>
                    {hotel.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Ara Butonu */}
          <div>
            <button
              onClick={handleSearch}
              className="w-full h-11 bg-secondary hover:bg-secondary/90 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Search className="h-4 w-4" />
              ARA
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
