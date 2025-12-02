"use client";

import { useState } from "react";
import { MessageCircle, ShieldCheck, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookingModal } from "./booking-modal";

interface BookingCardProps {
  basePrice: number;
  currency: string;
  tourId: string;
  tourTitle: string;
  quota?: number;
  bookedSeats?: number;
}

const ROOM_TYPES = [
  { id: "quad", label: "4 Kişilik Oda", priceModifier: 0 },
  { id: "triple", label: "3 Kişilik Oda", priceModifier: 150 },
  { id: "double", label: "2 Kişilik Oda", priceModifier: 350 },
];

export function BookingCard({ basePrice, currency, tourId, tourTitle, quota = 40, bookedSeats = 0 }: BookingCardProps) {
  const [selectedRoom, setSelectedRoom] = useState(ROOM_TYPES[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentPrice = basePrice + selectedRoom.priceModifier;
  const availableSeats = quota - bookedSeats;

  return (
    <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl shadow-lg p-6 overflow-hidden">
      {/* Price Header */}
      <div className="text-center pb-6 border-b border-gray-100">
        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide mb-1">
          Kişi Başı Başlangıç
        </p>
        <div className="flex items-center justify-center gap-1">
          <span className="text-4xl font-bold text-primary">
            ${currentPrice.toLocaleString()}
          </span>
          <span className="text-lg font-medium text-gray-400">{currency}</span>
        </div>
      </div>

      <div className="py-6 space-y-6">
        {/* Availability Info */}
        {availableSeats > 0 && availableSeats <= 10 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
            <p className="text-sm font-semibold text-orange-700">
              ⚠️ Son {availableSeats} Koltuk Kaldı!
            </p>
          </div>
        )}

        {/* Room Type Selector */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 block">
            Oda Tipi Seçiniz
          </label>
          <div className="grid grid-cols-1 gap-2">
            {ROOM_TYPES.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl border transition-all text-sm",
                  selectedRoom.id === room.id
                    ? "border-secondary bg-secondary/5 ring-1 ring-secondary"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                )}
              >
                <span className="font-medium text-gray-700">{room.label}</span>
                {room.priceModifier > 0 && (
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-100 shadow-sm">
                    +${room.priceModifier}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full py-4 bg-secondary hover:bg-secondary/90 text-white font-bold rounded-xl shadow-lg shadow-secondary/20 transition-all transform active:scale-95 flex items-center justify-center gap-2"
          >
            ÖN KAYIT OLUŞTUR
          </button>
          
          <a
            href="https://wa.me/905555555555"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 bg-white border-2 border-[#25D366] text-[#25D366] font-bold rounded-xl hover:bg-[#25D366] hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="h-5 w-5" />
            WhatsApp'tan Sor
          </a>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center text-center gap-1">
          <ShieldCheck className="h-6 w-6 text-blue-600" />
          <span className="text-xs font-semibold text-gray-600">Türsab Onaylı</span>
          <span className="text-[10px] text-gray-400">Belge No: 1234</span>
        </div>
        <div className="flex flex-col items-center text-center gap-1">
          <Award className="h-6 w-6 text-secondary" />
          <span className="text-xs font-semibold text-gray-600">Resmi Acente</span>
          <span className="text-[10px] text-gray-400">%100 Güvenli</span>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tourId={tourId}
        tourTitle={tourTitle}
        selectedRoom={selectedRoom}
        basePrice={basePrice}
        currency={currency}
      />
    </div>
  );
}


