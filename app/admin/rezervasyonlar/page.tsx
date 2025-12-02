"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Loader2,
  Phone,
  Mail,
  Users,
  Calendar,
  ExternalLink,
  Trash2,
  Filter,
} from "lucide-react";
import {
  getBookings,
  updateBookingStatus,
  deleteBooking,
  getBookingStats,
} from "@/app/actions/booking";
import { BookingStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

type Booking = {
  id: string;
  name: string;
  phone: string;
  email: string;
  passengerCount: number;
  roomType: string | null;
  totalPrice: any;
  status: BookingStatus;
  createdAt: Date;
  tour: {
    title: string;
    slug: string;
    startDate: Date;
    price: any;
    currency: string;
  };
};

const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: "Bekliyor",
  CONTACTED: "Arandı",
  COMPLETED: "Tamamlandı",
  CANCELLED: "İptal",
};

const STATUS_COLORS: Record<BookingStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  CONTACTED: "bg-blue-100 text-blue-700 border-blue-200",
  COMPLETED: "bg-green-100 text-green-700 border-green-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
};

export default function AdminReservationsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<BookingStatus | "ALL">("ALL");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    contacted: 0,
    completed: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (filterStatus === "ALL") {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter((b) => b.status === filterStatus));
    }
  }, [filterStatus, bookings]);

  async function loadData() {
    setIsLoading(true);
    const [bookingsResult, statsResult] = await Promise.all([
      getBookings(),
      getBookingStats(),
    ]);

    if (bookingsResult.success && bookingsResult.data) {
      setBookings(bookingsResult.data as any);
      setFilteredBookings(bookingsResult.data as any);
    } else {
      toast.error("Rezervasyonlar yüklenemedi");
    }

    if (statsResult.success && statsResult.data) {
      setStats(statsResult.data);
    }

    setIsLoading(false);
  }

  async function handleStatusChange(bookingId: string, newStatus: BookingStatus) {
    const result = await updateBookingStatus(bookingId, newStatus);
    if (result.success) {
      toast.success(result.message);
      loadData();
    } else {
      toast.error(result.error);
    }
  }

  async function handleDelete(bookingId: string, name: string) {
    if (!confirm(`"${name}" rezervasyonunu silmek istediğinizden emin misiniz?`)) {
      return;
    }

    const result = await deleteBooking(bookingId);
    if (result.success) {
      toast.success(result.message);
      loadData();
    } else {
      toast.error(result.error);
    }
  }

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
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Rezervasyonlar</h1>
        <p className="text-gray-600">
          Toplam {stats.total} rezervasyon talebi
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Bekleyen</span>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          </div>
          <p className="text-3xl font-bold text-primary">{stats.pending}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Arandı</span>
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          </div>
          <p className="text-3xl font-bold text-primary">{stats.contacted}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Tamamlandı</span>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <p className="text-3xl font-bold text-primary">{stats.completed}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Toplam</span>
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
          </div>
          <p className="text-3xl font-bold text-primary">{stats.total}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
        <Filter className="h-5 w-5 text-gray-400" />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
        >
          <option value="ALL">Tüm Rezervasyonlar</option>
          <option value={BookingStatus.PENDING}>Bekleyen</option>
          <option value={BookingStatus.CONTACTED}>Arandı</option>
          <option value={BookingStatus.COMPLETED}>Tamamlandı</option>
          <option value={BookingStatus.CANCELLED}>İptal</option>
        </select>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center">
          <p className="text-gray-500">Henüz rezervasyon bulunmuyor.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                  {/* Customer Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-bold text-primary">{booking.name}</h3>
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium border",
                          STATUS_COLORS[booking.status]
                        )}
                      >
                        {STATUS_LABELS[booking.status]}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <a href={`tel:${booking.phone}`} className="hover:text-[#059669]">
                          {booking.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <a href={`mailto:${booking.email}`} className="hover:text-[#059669]">
                          {booking.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{booking.passengerCount} Kişi</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>
                          {new Date(booking.createdAt).toLocaleDateString("tr-TR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tour Info */}
                  <div className="lg:text-right">
                    <Link
                      href={`/turlar/${booking.tour.slug}`}
                      target="_blank"
                      className="text-sm font-medium text-[#059669] hover:text-[#047857] flex items-center gap-1 lg:justify-end mb-2"
                    >
                      {booking.tour.title}
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                    {booking.totalPrice && (
                      <p className="text-sm text-gray-600">
                        Toplam:{" "}
                        <span className="font-bold text-primary">
                          {Number(booking.totalPrice).toLocaleString("tr-TR")}{" "}
                          {booking.tour.currency}
                        </span>
                      </p>
                    )}
                    {booking.roomType && (
                      <p className="text-xs text-gray-500 mt-1">
                        Oda: {booking.roomType === "quad" ? "4 Kişilik" : booking.roomType === "triple" ? "3 Kişilik" : "2 Kişilik"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                  <select
                    value={booking.status}
                    onChange={(e) =>
                      handleStatusChange(booking.id, e.target.value as BookingStatus)
                    }
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                  >
                    <option value={BookingStatus.PENDING}>Bekliyor</option>
                    <option value={BookingStatus.CONTACTED}>Arandı</option>
                    <option value={BookingStatus.COMPLETED}>Tamamlandı</option>
                    <option value={BookingStatus.CANCELLED}>İptal</option>
                  </select>

                  <button
                    onClick={() => handleDelete(booking.id, booking.name)}
                    className="ml-auto px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
