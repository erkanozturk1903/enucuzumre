"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { TourType } from "@prisma/client";
import { redirect } from "next/navigation";

// Slug oluşturma fonksiyonu
function slugify(text: string): string {
  const trMap: Record<string, string> = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
  };
  
  return text
    .split('')
    .map(char => trMap[char] || char)
    .join('')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Tüm turları listele
export async function getTours() {
  try {
    const tours = await prisma.tour.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        images: {
          take: 1,
          orderBy: { order: 'asc' }
        }
      }
    });

    return { success: true, data: tours };
  } catch (error) {
    console.error("Turlar alınamadı:", error);
    return { success: false, error: "Turlar alınamadı" };
  }
}

// Tek bir tur getir (ID ile)
export async function getTourById(id: string) {
  try {
    const tour = await prisma.tour.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: 'asc' } },
        itinerary: { orderBy: { dayNumber: 'asc' } },
        included: { orderBy: { order: 'asc' } },
        excluded: { orderBy: { order: 'asc' } }
      }
    });

    if (!tour) {
      return { success: false, error: "Tur bulunamadı" };
    }

    return { success: true, data: tour };
  } catch (error) {
    console.error("Tur alınamadı:", error);
    return { success: false, error: "Tur alınamadı" };
  }
}

// Yeni tur oluştur
export async function createTour(formData: FormData) {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Oturum bulunamadı" };
  }

  try {
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string || slugify(title);
    const type = formData.get("type") as TourType;
    const price = parseFloat(formData.get("price") as string);
    const currency = formData.get("currency") as string;
    const quota = parseInt(formData.get("quota") as string);
    const startDate = new Date(formData.get("startDate") as string);
    const endDate = new Date(formData.get("endDate") as string);
    const description = formData.get("description") as string;
    const meccaHotel = formData.get("meccaHotel") as string || null;
    const medinaHotel = formData.get("medinaHotel") as string || null;
    const kaabaDistance = formData.get("kaabaDistance") ? parseInt(formData.get("kaabaDistance") as string) : null;
    const hotelStars = parseInt(formData.get("hotelStars") as string || "4");
    const isFeatured = formData.get("isFeatured") === "true";
    const isActive = formData.get("isActive") === "true";

    // Itinerary verisi (JSON string olarak gelecek)
    const itineraryData = formData.get("itinerary") as string;
    const itinerary = itineraryData ? JSON.parse(itineraryData) : [];

    // Images verisi (JSON string olarak gelecek)
    const imagesData = formData.get("images") as string;
    const images = imagesData ? JSON.parse(imagesData) : [];

    // Included items
    const includedData = formData.get("included") as string;
    const included = includedData ? JSON.parse(includedData) : [];

    // Excluded items
    const excludedData = formData.get("excluded") as string;
    const excluded = excludedData ? JSON.parse(excludedData) : [];

    // Slug kontrolü
    const existingTour = await prisma.tour.findUnique({
      where: { slug }
    });

    if (existingTour) {
      return { success: false, error: "Bu slug zaten kullanılıyor" };
    }

    // Tur oluştur
    const tour = await prisma.tour.create({
      data: {
        title,
        slug,
        type,
        price,
        currency,
        quota,
        startDate,
        endDate,
        description,
        meccaHotel,
        medinaHotel,
        kaabaDistance,
        hotelStars,
        isFeatured,
        isActive,
        images: {
          create: images.map((img: { url: string; alt?: string }, index: number) => ({
            url: img.url,
            alt: img.alt || title,
            order: index
          }))
        },
        itinerary: {
          create: itinerary.map((day: { title: string; description: string }, index: number) => ({
            dayNumber: index + 1,
            title: day.title,
            description: day.description
          }))
        },
        included: {
          create: included.map((item: string, index: number) => ({
            item,
            order: index
          }))
        },
        excluded: {
          create: excluded.map((item: string, index: number) => ({
            item,
            order: index
          }))
        }
      }
    });

    revalidatePath("/admin/turlar");
    revalidatePath("/");

    return { success: true, message: "Tur başarıyla oluşturuldu", tourId: tour.id };
  } catch (error) {
    console.error("Tur oluşturulamadı:", error);
    return { success: false, error: "Tur oluşturulurken bir hata oluştu" };
  }
}

// Tur güncelle
export async function updateTour(id: string, formData: FormData) {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Oturum bulunamadı" };
  }

  try {
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string || slugify(title);
    const type = formData.get("type") as TourType;
    const price = parseFloat(formData.get("price") as string);
    const currency = formData.get("currency") as string;
    const quota = parseInt(formData.get("quota") as string);
    const startDate = new Date(formData.get("startDate") as string);
    const endDate = new Date(formData.get("endDate") as string);
    const description = formData.get("description") as string;
    const meccaHotel = formData.get("meccaHotel") as string || null;
    const medinaHotel = formData.get("medinaHotel") as string || null;
    const kaabaDistance = formData.get("kaabaDistance") ? parseInt(formData.get("kaabaDistance") as string) : null;
    const hotelStars = parseInt(formData.get("hotelStars") as string || "4");
    const isFeatured = formData.get("isFeatured") === "true";
    const isActive = formData.get("isActive") === "true";

    // Itinerary verisi
    const itineraryData = formData.get("itinerary") as string;
    const itinerary = itineraryData ? JSON.parse(itineraryData) : [];

    // Images verisi
    const imagesData = formData.get("images") as string;
    const images = imagesData ? JSON.parse(imagesData) : [];

    // Included items
    const includedData = formData.get("included") as string;
    const included = includedData ? JSON.parse(includedData) : [];

    // Excluded items
    const excludedData = formData.get("excluded") as string;
    const excluded = excludedData ? JSON.parse(excludedData) : [];

    // Slug kontrolü (kendisi hariç)
    const existingTour = await prisma.tour.findFirst({
      where: { 
        slug,
        NOT: { id }
      }
    });

    if (existingTour) {
      return { success: false, error: "Bu slug zaten kullanılıyor" };
    }

    // Önce ilişkili verileri sil
    await prisma.tourImage.deleteMany({ where: { tourId: id } });
    await prisma.itinerary.deleteMany({ where: { tourId: id } });
    await prisma.tourIncluded.deleteMany({ where: { tourId: id } });
    await prisma.tourExcluded.deleteMany({ where: { tourId: id } });

    // Tur güncelle
    await prisma.tour.update({
      where: { id },
      data: {
        title,
        slug,
        type,
        price,
        currency,
        quota,
        startDate,
        endDate,
        description,
        meccaHotel,
        medinaHotel,
        kaabaDistance,
        hotelStars,
        isFeatured,
        isActive,
        images: {
          create: images.map((img: { url: string; alt?: string }, index: number) => ({
            url: img.url,
            alt: img.alt || title,
            order: index
          }))
        },
        itinerary: {
          create: itinerary.map((day: { title: string; description: string }, index: number) => ({
            dayNumber: index + 1,
            title: day.title,
            description: day.description
          }))
        },
        included: {
          create: included.map((item: string, index: number) => ({
            item,
            order: index
          }))
        },
        excluded: {
          create: excluded.map((item: string, index: number) => ({
            item,
            order: index
          }))
        }
      }
    });

    revalidatePath("/admin/turlar");
    revalidatePath(`/turlar/${slug}`);
    revalidatePath("/");

    return { success: true, message: "Tur başarıyla güncellendi" };
  } catch (error) {
    console.error("Tur güncellenemedi:", error);
    return { success: false, error: "Tur güncellenirken bir hata oluştu" };
  }
}

// Tur sil
export async function deleteTour(id: string) {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Oturum bulunamadı" };
  }

  try {
    await prisma.tour.delete({
      where: { id }
    });

    revalidatePath("/admin/turlar");
    revalidatePath("/");

    return { success: true, message: "Tur başarıyla silindi" };
  } catch (error) {
    console.error("Tur silinemedi:", error);
    return { success: false, error: "Tur silinirken bir hata oluştu" };
  }
}

// Tur durumunu değiştir (aktif/pasif)
export async function toggleTourStatus(id: string) {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Oturum bulunamadı" };
  }

  try {
    const tour = await prisma.tour.findUnique({
      where: { id },
      select: { isActive: true }
    });

    if (!tour) {
      return { success: false, error: "Tur bulunamadı" };
    }

    await prisma.tour.update({
      where: { id },
      data: { isActive: !tour.isActive }
    });

    revalidatePath("/admin/turlar");
    revalidatePath("/");

    return { success: true, message: "Tur durumu güncellendi" };
  } catch (error) {
    console.error("Tur durumu güncellenemedi:", error);
    return { success: false, error: "Tur durumu güncellenirken bir hata oluştu" };
  }
}



