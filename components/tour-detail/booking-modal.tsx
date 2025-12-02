"use client";

import { useState } from "react";
import { X, Loader2, CheckCircle } from "lucide-react";
import { createBooking } from "@/app/actions/booking";
import { toast } from "sonner";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourId: string;
  tourTitle: string;
  selectedRoom: { id: string; label: string; priceModifier: number };
  basePrice: number;
  currency: string;
}

export function BookingModal({
  isOpen,
  onClose,
  tourId,
  tourTitle,
  selectedRoom,
  basePrice,
  currency,
}: BookingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const totalPrice = basePrice + selectedRoom.priceModifier;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.set("tourId", tourId);
    formData.set("roomType", selectedRoom.id);
    formData.set("totalPrice", totalPrice.toString());

    const result = await createBooking(formData);

    if (result.success) {
      setIsSuccess(true);
      toast.success(result.message);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
      }, 3000);
    } else {
      toast.error(result.error);
    }

    setIsSubmitting(false);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary">Ön Kayıt Formu</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            // Success State
            <div className="text-center py-8">
              <div className="mb-4 flex justify-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">
                Talebiniz Alındı!
              </h3>
              <p className="text-gray-600">
                En kısa sürede sizinle iletişime geçeceğiz.
              </p>
            </div>
          ) : (
            // Form
            <>
              {/* Tour Info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-500 mb-1">Seçilen Tur:</p>
                <p className="font-bold text-primary mb-3">{tourTitle}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{selectedRoom.label}</span>
                  <span className="font-bold text-secondary">
                    {totalPrice.toLocaleString("tr-TR")} {currency}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Soyad <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                    placeholder="Ahmet Yılmaz"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                    placeholder="0555 555 55 55"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                    placeholder="ornek@email.com"
                  />
                </div>

                {/* Passenger Count */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yolcu Sayısı <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="passengerCount"
                    required
                    defaultValue="1"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} Kişi
                      </option>
                    ))}
                  </select>
                </div>

                {/* Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                  <p>
                    <strong>Not:</strong> Bu bir ön kayıt forumudur. Detaylı
                    bilgi için ekibimiz sizinle iletişime geçecektir.
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Gönderiliyor...
                    </>
                  ) : (
                    "Ön Kayıt Oluştur"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}



