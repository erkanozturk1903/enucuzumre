"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { GorevOncelik } from "@prisma/client";

// ==================== KATEGORİ İŞLEMLERİ ====================

export async function getKategoriler() {
  try {
    const kategoriler = await prisma.gorevKategori.findMany({
      orderBy: { order: "asc" },
      include: { _count: { select: { gorevler: true } } },
    });
    return { success: true, data: kategoriler };
  } catch (error) {
    console.error("Kategoriler getirme hatası:", error);
    return { success: false, error: "Kategoriler alınamadı" };
  }
}

export async function createKategori(formData: FormData) {
  try {
    const slug = formData.get("slug") as string;
    const baslik = formData.get("baslik") as string;
    const icon = formData.get("icon") as string;
    const renk = formData.get("renk") as string;

    const maxOrder = await prisma.gorevKategori.aggregate({ _max: { order: true } });

    const kategori = await prisma.gorevKategori.create({
      data: {
        slug,
        baslik,
        icon: icon || "fas fa-list",
        renk: renk || "blue",
        order: (maxOrder._max.order ?? -1) + 1,
      },
    });

    revalidatePath("/admin/mobil/yapilacaklar");
    return { success: true, data: kategori };
  } catch (error: any) {
    if (error.code === "P2002") return { success: false, error: "Bu slug zaten mevcut" };
    return { success: false, error: "Kategori oluşturulamadı" };
  }
}

export async function deleteKategori(id: string) {
  try {
    const kategori = await prisma.gorevKategori.findUnique({
      where: { id },
      include: { _count: { select: { gorevler: true } } },
    });
    if (kategori?._count.gorevler > 0) {
      return { success: false, error: "Bu kategoride görevler var, önce görevleri silin" };
    }
    await prisma.gorevKategori.delete({ where: { id } });
    revalidatePath("/admin/mobil/yapilacaklar");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Kategori silinemedi" };
  }
}

// ==================== GÖREV İŞLEMLERİ ====================

export async function getGorevler(kategoriId?: string) {
  try {
    const gorevler = await prisma.gorev.findMany({
      where: kategoriId ? { kategoriId } : undefined,
      orderBy: [{ kategori: { order: "asc" } }, { order: "asc" }],
      include: { kategori: true },
    });
    return { success: true, data: gorevler };
  } catch (error) {
    return { success: false, error: "Görevler alınamadı" };
  }
}

export async function createGorev(formData: FormData) {
  try {
    const slug = formData.get("slug") as string;
    const baslik = formData.get("baslik") as string;
    const aciklama = formData.get("aciklama") as string;
    const oncelik = formData.get("oncelik") as GorevOncelik;
    const kategoriId = formData.get("kategoriId") as string;

    const maxOrder = await prisma.gorev.aggregate({
      where: { kategoriId },
      _max: { order: true },
    });

    const gorev = await prisma.gorev.create({
      data: {
        slug,
        baslik,
        aciklama: aciklama || null,
        oncelik: oncelik || "ORTA",
        kategoriId,
        order: (maxOrder._max.order ?? -1) + 1,
      },
    });

    revalidatePath("/admin/mobil/yapilacaklar");
    revalidatePath("/api/mobil/yapilacaklar");
    return { success: true, data: gorev };
  } catch (error: any) {
    if (error.code === "P2002") return { success: false, error: "Bu slug zaten mevcut" };
    return { success: false, error: "Görev oluşturulamadı" };
  }
}

export async function updateGorev(id: string, formData: FormData) {
  try {
    const slug = formData.get("slug") as string;
    const baslik = formData.get("baslik") as string;
    const aciklama = formData.get("aciklama") as string;
    const oncelik = formData.get("oncelik") as GorevOncelik;
    const kategoriId = formData.get("kategoriId") as string;
    const isActive = formData.get("isActive") === "true";

    const gorev = await prisma.gorev.update({
      where: { id },
      data: { slug, baslik, aciklama, oncelik, kategoriId, isActive },
    });

    revalidatePath("/admin/mobil/yapilacaklar");
    revalidatePath("/api/mobil/yapilacaklar");
    return { success: true, data: gorev };
  } catch (error: any) {
    if (error.code === "P2002") return { success: false, error: "Bu slug zaten mevcut" };
    return { success: false, error: "Görev güncellenemedi" };
  }
}

export async function deleteGorev(id: string) {
  try {
    await prisma.gorev.delete({ where: { id } });
    revalidatePath("/admin/mobil/yapilacaklar");
    revalidatePath("/api/mobil/yapilacaklar");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Görev silinemedi" };
  }
}

export async function toggleGorevActive(id: string, isActive: boolean) {
  try {
    await prisma.gorev.update({ where: { id }, data: { isActive } });
    revalidatePath("/admin/mobil/yapilacaklar");
    revalidatePath("/api/mobil/yapilacaklar");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Durum değiştirilemedi" };
  }
}
