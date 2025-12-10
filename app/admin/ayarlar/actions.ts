"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function getSiteSettings() {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: "site_settings" },
    });

    // Eğer ayarlar yoksa default olarak oluştur
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          id: "site_settings",
        },
      });
    }

    return { success: true, data: settings };
  } catch (error) {
    console.error("Site ayarları alınamadı:", error);
    return { success: false, error: "Site ayarları alınamadı" };
  }
}

export async function updateSiteSettings(formData: FormData) {
  const session = await auth();

  if (!session) {
    return { success: false, error: "Oturum bulunamadı" };
  }

  try {
    const data = {
      heroTitle: formData.get("heroTitle") as string,
      heroSubtitle: formData.get("heroSubtitle") as string,
      contactPhone: formData.get("contactPhone") as string,
      whatsappNumber: formData.get("whatsappNumber") as string,
      email: formData.get("email") as string,
      address: formData.get("address") as string,
      instagramUrl: formData.get("instagramUrl") as string || null,
      facebookUrl: formData.get("facebookUrl") as string || null,
      twitterUrl: formData.get("twitterUrl") as string || null,
      youtubeUrl: formData.get("youtubeUrl") as string || null,
      appStoreUrl: formData.get("appStoreUrl") as string || null,
      playStoreUrl: formData.get("playStoreUrl") as string || null,
      footerText: formData.get("footerText") as string,
      tursabNo: formData.get("tursabNo") as string,
      // Hakkımızda sayfası alanları
      yearsExperience: parseInt(formData.get("yearsExperience") as string) || 20,
      totalGuests: parseInt(formData.get("totalGuests") as string) || 50000,
      satisfactionRate: parseInt(formData.get("satisfactionRate") as string) || 98,
      companyStory: formData.get("companyStory") as string || null,
      missionStatement: formData.get("missionStatement") as string || null,
      visionStatement: formData.get("visionStatement") as string || null,
    };

    await prisma.siteSettings.upsert({
      where: { id: "site_settings" },
      update: data,
      create: {
        id: "site_settings",
        ...data,
      },
    });

    revalidatePath("/");
    revalidatePath("/hakkimizda");
    revalidatePath("/admin/ayarlar");

    return { success: true, message: "Ayarlar başarıyla güncellendi" };
  } catch (error) {
    console.error("Site ayarları güncellenemedi:", error);
    return { success: false, error: "Ayarlar güncellenirken bir hata oluştu" };
  }
}



