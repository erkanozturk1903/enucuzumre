"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { RehberBolum } from "@prisma/client";

// ==================== REHBER İŞLEMLERİ ====================

export async function getRehberler(bolum?: RehberBolum) {
  try {
    const rehberler = await prisma.rehber.findMany({
      where: bolum ? { bolum } : undefined,
      orderBy: [{ bolum: "asc" }, { order: "asc" }],
    });
    return { success: true, data: rehberler };
  } catch (error) {
    console.error("Rehberler getirme hatası:", error);
    return { success: false, error: "Rehberler alınamadı" };
  }
}

export async function getRehberById(id: string) {
  try {
    const rehber = await prisma.rehber.findUnique({
      where: { id },
    });
    return { success: true, data: rehber };
  } catch (error) {
    console.error("Rehber getirme hatası:", error);
    return { success: false, error: "Rehber alınamadı" };
  }
}

export async function getRehberBySlug(slug: string) {
  try {
    const rehber = await prisma.rehber.findUnique({
      where: { slug },
    });
    return { success: true, data: rehber };
  } catch (error) {
    console.error("Rehber getirme hatası:", error);
    return { success: false, error: "Rehber alınamadı" };
  }
}

export async function createRehber(formData: FormData) {
  try {
    const slug = formData.get("slug") as string;
    const baslik = formData.get("baslik") as string;
    const altBaslik = formData.get("altBaslik") as string;
    const bolum = formData.get("bolum") as RehberBolum;
    const kategori = formData.get("kategori") as string;
    const icon = formData.get("icon") as string;
    const renk = formData.get("renk") as string;
    const icerikStr = formData.get("icerik") as string;

    if (!slug || !baslik || !bolum) {
      return { success: false, error: "Zorunlu alanları doldurun" };
    }

    let icerik = {};
    try {
      icerik = JSON.parse(icerikStr || "{}");
    } catch {
      return { success: false, error: "İçerik JSON formatında olmalı" };
    }

    // Mevcut max order'ı bul
    const maxOrder = await prisma.rehber.aggregate({
      where: { bolum },
      _max: { order: true },
    });

    const rehber = await prisma.rehber.create({
      data: {
        slug,
        baslik,
        altBaslik: altBaslik || null,
        bolum,
        kategori: kategori || "temel-bilgiler",
        icon: icon || "fas fa-book",
        renk: renk || "gradient",
        icerik,
        order: (maxOrder._max.order ?? -1) + 1,
      },
    });

    revalidatePath("/admin/mobil/rehberler");
    revalidatePath("/admin/mobil");
    revalidatePath("/api/mobil/rehberler");

    return { success: true, data: rehber };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "Bu slug zaten mevcut" };
    }
    console.error("Rehber oluşturma hatası:", error);
    return { success: false, error: "Rehber oluşturulamadı" };
  }
}

export async function updateRehber(id: string, formData: FormData) {
  try {
    const slug = formData.get("slug") as string;
    const baslik = formData.get("baslik") as string;
    const altBaslik = formData.get("altBaslik") as string;
    const bolum = formData.get("bolum") as RehberBolum;
    const kategori = formData.get("kategori") as string;
    const icon = formData.get("icon") as string;
    const renk = formData.get("renk") as string;
    const icerikStr = formData.get("icerik") as string;
    const isActive = formData.get("isActive") === "true";

    if (!slug || !baslik || !bolum) {
      return { success: false, error: "Zorunlu alanları doldurun" };
    }

    let icerik = {};
    try {
      icerik = JSON.parse(icerikStr || "{}");
    } catch {
      return { success: false, error: "İçerik JSON formatında olmalı" };
    }

    const rehber = await prisma.rehber.update({
      where: { id },
      data: {
        slug,
        baslik,
        altBaslik: altBaslik || null,
        bolum,
        kategori,
        icon,
        renk,
        icerik,
        isActive,
      },
    });

    revalidatePath("/admin/mobil/rehberler");
    revalidatePath("/admin/mobil");
    revalidatePath("/api/mobil/rehberler");

    return { success: true, data: rehber };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "Bu slug zaten mevcut" };
    }
    console.error("Rehber güncelleme hatası:", error);
    return { success: false, error: "Rehber güncellenemedi" };
  }
}

export async function deleteRehber(id: string) {
  try {
    await prisma.rehber.delete({ where: { id } });

    revalidatePath("/admin/mobil/rehberler");
    revalidatePath("/admin/mobil");
    revalidatePath("/api/mobil/rehberler");

    return { success: true };
  } catch (error) {
    console.error("Rehber silme hatası:", error);
    return { success: false, error: "Rehber silinemedi" };
  }
}

export async function reorderRehberler(updates: { id: string; order: number }[]) {
  try {
    await Promise.all(
      updates.map((update) =>
        prisma.rehber.update({
          where: { id: update.id },
          data: { order: update.order },
        })
      )
    );

    revalidatePath("/admin/mobil/rehberler");
    revalidatePath("/api/mobil/rehberler");

    return { success: true };
  } catch (error) {
    console.error("Rehber sıralama hatası:", error);
    return { success: false, error: "Sıralama güncellenemedi" };
  }
}

export async function toggleRehberActive(id: string, isActive: boolean) {
  try {
    await prisma.rehber.update({
      where: { id },
      data: { isActive },
    });

    revalidatePath("/admin/mobil/rehberler");
    revalidatePath("/api/mobil/rehberler");

    return { success: true };
  } catch (error) {
    console.error("Rehber aktiflik değiştirme hatası:", error);
    return { success: false, error: "Durum değiştirilemedi" };
  }
}

// Bölüm istatistikleri
export async function getBolumStats() {
  try {
    const stats = await prisma.rehber.groupBy({
      by: ["bolum"],
      _count: { id: true },
    });
    return { success: true, data: stats };
  } catch (error) {
    console.error("Bölüm istatistikleri hatası:", error);
    return { success: false, error: "İstatistikler alınamadı" };
  }
}
