"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2, 
  Eye, 
  EyeOff,
  Search
} from "lucide-react";
import { getTours, deleteTour, toggleTourStatus } from "./actions";
import { formatDate } from "@/lib/utils";

type Tour = {
  id: string;
  title: string;
  slug: string;
  price: number;
  currency: string;
  startDate: Date;
  endDate: Date;
  type: string;
  isActive: boolean;
  isFeatured: boolean;
  quota: number;
  bookedSeats: number;
  images: { url: string }[];
};

export default function ToursListPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");

  useEffect(() => {
    loadTours();
  }, []);

  async function loadTours() {
    setIsLoading(true);
    const result = await getTours();
    if (result.success && result.data) {
      setTours(result.data as any);
    } else {
      toast.error("Turlar yüklenemedi");
    }
    setIsLoading(false);
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`"${title}" turunu silmek istediğinizden emin misiniz?`)) {
      return;
    }

    const result = await deleteTour(id);
    if (result.success) {
      toast.success(result.message);
      loadTours();
    } else {
      toast.error(result.error);
    }
  }

  async function handleToggleStatus(id: string) {
    const result = await toggleTourStatus(id);
    if (result.success) {
      toast.success(result.message);
      loadTours();
    } else {
      toast.error(result.error);
    }
  }

  // Filtreleme
  const filteredTours = tours.filter((tour) => {
    const matchesSearch = tour.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "ALL" || tour.type === filterType;
    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#059669]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Turlar</h1>
          <p className="text-gray-600">
            Toplam {tours.length} tur · {tours.filter(t => t.isActive).length} aktif
          </p>
        </div>
        <Link
          href="/admin/turlar/yeni"
          className="px-6 py-3 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Yeni Tur Ekle
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tur ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
        >
          <option value="ALL">Tüm Turlar</option>
          <option value="UMRE">Umre</option>
          <option value="HAC">Hac</option>
          <option value="KUDUS">Kudüs</option>
          <option value="KULTUR">Kültür</option>
        </select>
      </div>

      {/* Tours Table */}
      {filteredTours.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center">
          <p className="text-gray-500">Henüz tur bulunmuyor.</p>
          <Link
            href="/admin/turlar/yeni"
            className="inline-flex items-center gap-2 mt-4 text-[#059669] hover:text-[#047857] font-medium"
          >
            <Plus className="h-5 w-5" />
            İlk turu oluştur
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tur
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tip
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fiyat
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kontenjan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTours.map((tour) => (
                  <tr key={tour.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {tour.images[0] && (
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={tour.images[0].url}
                              alt={tour.title}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-primary">{tour.title}</p>
                          <p className="text-sm text-gray-500">{tour.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tour.type === 'UMRE' ? 'bg-green-100 text-green-800' :
                        tour.type === 'HAC' ? 'bg-purple-100 text-purple-800' :
                        tour.type === 'KUDUS' ? 'bg-blue-100 text-blue-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {tour.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-primary">
                        {tour.price.toLocaleString('tr-TR')} {tour.currency}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {new Date(tour.startDate).toLocaleDateString('tr-TR', { 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                        {' - '}
                        {new Date(tour.endDate).toLocaleDateString('tr-TR', { 
                          day: 'numeric', 
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[80px]">
                          <div 
                            className="bg-[#059669] h-2 rounded-full"
                            style={{ width: `${(tour.bookedSeats / tour.quota) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {tour.bookedSeats}/{tour.quota}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(tour.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          tour.isActive
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {tour.isActive ? (
                          <>
                            <Eye className="h-3 w-3" />
                            Aktif
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3" />
                            Pasif
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/turlar/${tour.id}/duzenle`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Düzenle"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(tour.id, tour.title)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
