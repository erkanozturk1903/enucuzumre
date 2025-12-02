"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { BookingStatus } from "@prisma/client";

// Frontend'den rezervasyon oluşturma
export async function createBooking(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const passengerCount = parseInt(formData.get("passengerCount") as string);
    const tourId = formData.get("tourId") as string;
    const roomType = formData.get("roomType") as string;
    const totalPrice = formData.get("totalPrice") as string;

    // Validasyon
    if (!name || !phone || !email || !passengerCount || !tourId) {
      return { success: false, error: "Lütfen tüm alanları doldurun" };
    }

    // Email validasyonu
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: "Geçerli bir e-posta adresi girin" };
    }

    // Telefon validasyonu (Türkiye)
    const phoneRegex = /^(\+90|0)?[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
      return { success: false, error: "Geçerli bir telefon numarası girin" };
    }

    // Tur kontrolü
    const tour = await prisma.tour.findUnique({
      where: { id: tourId },
      select: { id: true, quota: true, bookedSeats: true, isActive: true }
    });

    if (!tour) {
      return { success: false, error: "Tur bulunamadı" };
    }

    if (!tour.isActive) {
      return { success: false, error: "Bu tur artık aktif değil" };
    }

    // Kontenjan kontrolü
    const availableSeats = tour.quota - tour.bookedSeats;
    if (availableSeats < passengerCount) {
      return { 
        success: false, 
        error: `Yeterli kontenjan yok. Kalan koltuk: ${availableSeats}` 
      };
    }

    // Rezervasyon oluştur
    const booking = await prisma.booking.create({
      data: {
        name,
        phone,
        email,
        passengerCount,
        tourId,
        roomType: roomType || null,
        totalPrice: totalPrice ? parseFloat(totalPrice) : null,
        status: BookingStatus.PENDING,
      },
    });

    revalidatePath("/admin/rezervasyonlar");

    return { 
      success: true, 
      message: "Rezervasyon talebiniz alındı! En kısa sürede sizinle iletişime geçeceğiz.",
      bookingId: booking.id 
    };
  } catch (error) {
    console.error("Rezervasyon oluşturma hatası:", error);
    return { success: false, error: "Bir hata oluştu, lütfen tekrar deneyin" };
  }
}

// Admin: Tüm rezervasyonları getir
export async function getBookings() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        tour: {
          select: {
            title: true,
            slug: true,
            startDate: true,
            endDate: true,
            price: true,
            currency: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return { success: true, data: bookings };
  } catch (error) {
    console.error("Rezervasyonlar alınamadı:", error);
    return { success: false, error: "Rezervasyonlar alınamadı" };
  }
}

// Admin: Rezervasyon durumunu güncelle
export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
  try {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    revalidatePath("/admin/rezervasyonlar");

    return { success: true, message: "Durum güncellendi" };
  } catch (error) {
    console.error("Durum güncellenemedi:", error);
    return { success: false, error: "Durum güncellenirken hata oluştu" };
  }
}

// Admin: Rezervasyon notunu güncelle
export async function updateBookingNotes(bookingId: string, notes: string) {
  try {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { notes },
    });

    revalidatePath("/admin/rezervasyonlar");

    return { success: true, message: "Not güncellendi" };
  } catch (error) {
    console.error("Not güncellenemedi:", error);
    return { success: false, error: "Not güncellenirken hata oluştu" };
  }
}

// Admin: Rezervasyon sil
export async function deleteBooking(bookingId: string) {
  try {
    await prisma.booking.delete({
      where: { id: bookingId },
    });

    revalidatePath("/admin/rezervasyonlar");

    return { success: true, message: "Rezervasyon silindi" };
  } catch (error) {
    console.error("Rezervasyon silinemedi:", error);
    return { success: false, error: "Rezervasyon silinirken hata oluştu" };
  }
}

// Admin: İstatistikler
export async function getBookingStats() {
  try {
    const [total, pending, contacted, completed] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: BookingStatus.PENDING } }),
      prisma.booking.count({ where: { status: BookingStatus.CONTACTED } }),
      prisma.booking.count({ where: { status: BookingStatus.COMPLETED } }),
    ]);

    return {
      success: true,
      data: {
        total,
        pending,
        contacted,
        completed,
      }
    };
  } catch (error) {
    console.error("İstatistikler alınamadı:", error);
    return { success: false, error: "İstatistikler alınamadı" };
  }
}



