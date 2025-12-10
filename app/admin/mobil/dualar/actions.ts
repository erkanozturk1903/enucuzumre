"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ==================== KATEGORİ İŞLEMLERİ ====================

export async function getKategoriler() {
  try {
    const kategoriler = await prisma.duaKategori.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { dualar: true },
        },
      },
    });
    return { success: true, data: kategoriler };
  } catch (error) {
    console.error("Kategoriler getirme hatası:", error);
    return { success: false, error: "Kategoriler alınamadı" };
  }
}

export async function createKategori(formData: FormData) {
  try {
    const ad = formData.get("ad") as string;
    const icon = (formData.get("icon") as string) || "fas fa-book-open";

    if (!ad) {
      return { success: false, error: "Kategori adı zorunludur" };
    }

    // Mevcut max order'ı bul
    const maxOrder = await prisma.duaKategori.aggregate({
      _max: { order: true },
    });

    const kategori = await prisma.duaKategori.create({
      data: {
        ad,
        icon,
        order: (maxOrder._max.order ?? -1) + 1,
      },
    });

    revalidatePath("/admin/mobil/dualar");
    revalidatePath("/admin/mobil");

    return { success: true, data: kategori };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "Bu kategori adı zaten mevcut" };
    }
    console.error("Kategori oluşturma hatası:", error);
    return { success: false, error: "Kategori oluşturulamadı" };
  }
}

export async function updateKategori(id: string, formData: FormData) {
  try {
    const ad = formData.get("ad") as string;
    const icon = formData.get("icon") as string;
    const isActive = formData.get("isActive") === "true";

    const kategori = await prisma.duaKategori.update({
      where: { id },
      data: { ad, icon, isActive },
    });

    revalidatePath("/admin/mobil/dualar");
    revalidatePath("/admin/mobil");

    return { success: true, data: kategori };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "Bu kategori adı zaten mevcut" };
    }
    console.error("Kategori güncelleme hatası:", error);
    return { success: false, error: "Kategori güncellenemedi" };
  }
}

export async function deleteKategori(id: string) {
  try {
    // İlişkili dua sayısını kontrol et
    const duaCount = await prisma.dua.count({
      where: { kategoriId: id },
    });

    if (duaCount > 0) {
      return {
        success: false,
        error: `Bu kategoride ${duaCount} dua var. Önce duaları silin veya başka kategoriye taşıyın.`,
      };
    }

    await prisma.duaKategori.delete({ where: { id } });

    revalidatePath("/admin/mobil/dualar");
    revalidatePath("/admin/mobil");

    return { success: true };
  } catch (error) {
    console.error("Kategori silme hatası:", error);
    return { success: false, error: "Kategori silinemedi" };
  }
}

// ==================== DUA İŞLEMLERİ ====================

export async function getDualar(kategoriId?: string) {
  try {
    const dualar = await prisma.dua.findMany({
      where: kategoriId ? { kategoriId } : undefined,
      orderBy: { order: "asc" },
      include: {
        kategori: {
          select: { id: true, ad: true, icon: true },
        },
      },
    });
    return { success: true, data: dualar };
  } catch (error) {
    console.error("Dualar getirme hatası:", error);
    return { success: false, error: "Dualar alınamadı" };
  }
}

export async function getDuaById(id: string) {
  try {
    const dua = await prisma.dua.findUnique({
      where: { id },
      include: {
        kategori: true,
      },
    });
    return { success: true, data: dua };
  } catch (error) {
    console.error("Dua getirme hatası:", error);
    return { success: false, error: "Dua alınamadı" };
  }
}

export async function createDua(formData: FormData) {
  try {
    const baslik = formData.get("baslik") as string;
    const altBaslik = formData.get("altBaslik") as string;
    const kategoriId = formData.get("kategoriId") as string;
    const arapca = formData.get("arapca") as string;
    const okunusu = formData.get("okunusu") as string;
    const meali = formData.get("meali") as string;
    const kaynak = formData.get("kaynak") as string;
    const sesUrl = formData.get("sesUrl") as string;

    if (!baslik || !kategoriId || !arapca || !okunusu || !meali) {
      return { success: false, error: "Zorunlu alanları doldurun" };
    }

    // Mevcut max order'ı bul
    const maxOrder = await prisma.dua.aggregate({
      _max: { order: true },
    });

    const dua = await prisma.dua.create({
      data: {
        baslik,
        altBaslik: altBaslik || null,
        kategoriId,
        arapca,
        okunusu,
        meali,
        kaynak: kaynak || null,
        sesUrl: sesUrl || null,
        order: (maxOrder._max.order ?? -1) + 1,
      },
    });

    revalidatePath("/admin/mobil/dualar");
    revalidatePath("/admin/mobil");
    revalidatePath("/api/mobil/dualar");

    return { success: true, data: dua };
  } catch (error) {
    console.error("Dua oluşturma hatası:", error);
    return { success: false, error: "Dua oluşturulamadı" };
  }
}

export async function updateDua(id: string, formData: FormData) {
  try {
    const baslik = formData.get("baslik") as string;
    const altBaslik = formData.get("altBaslik") as string;
    const kategoriId = formData.get("kategoriId") as string;
    const arapca = formData.get("arapca") as string;
    const okunusu = formData.get("okunusu") as string;
    const meali = formData.get("meali") as string;
    const kaynak = formData.get("kaynak") as string;
    const sesUrl = formData.get("sesUrl") as string;
    const isActive = formData.get("isActive") === "true";

    if (!baslik || !kategoriId || !arapca || !okunusu || !meali) {
      return { success: false, error: "Zorunlu alanları doldurun" };
    }

    const dua = await prisma.dua.update({
      where: { id },
      data: {
        baslik,
        altBaslik: altBaslik || null,
        kategoriId,
        arapca,
        okunusu,
        meali,
        kaynak: kaynak || null,
        sesUrl: sesUrl || null,
        isActive,
      },
    });

    revalidatePath("/admin/mobil/dualar");
    revalidatePath("/admin/mobil");
    revalidatePath("/api/mobil/dualar");

    return { success: true, data: dua };
  } catch (error) {
    console.error("Dua güncelleme hatası:", error);
    return { success: false, error: "Dua güncellenemedi" };
  }
}

export async function deleteDua(id: string) {
  try {
    await prisma.dua.delete({ where: { id } });

    revalidatePath("/admin/mobil/dualar");
    revalidatePath("/admin/mobil");
    revalidatePath("/api/mobil/dualar");

    return { success: true };
  } catch (error) {
    console.error("Dua silme hatası:", error);
    return { success: false, error: "Dua silinemedi" };
  }
}

export async function reorderDualar(updates: { id: string; order: number }[]) {
  try {
    await Promise.all(
      updates.map((update) =>
        prisma.dua.update({
          where: { id: update.id },
          data: { order: update.order },
        })
      )
    );

    revalidatePath("/admin/mobil/dualar");
    revalidatePath("/api/mobil/dualar");

    return { success: true };
  } catch (error) {
    console.error("Dua sıralama hatası:", error);
    return { success: false, error: "Sıralama güncellenemedi" };
  }
}

export async function toggleDuaActive(id: string, isActive: boolean) {
  try {
    await prisma.dua.update({
      where: { id },
      data: { isActive },
    });

    revalidatePath("/admin/mobil/dualar");
    revalidatePath("/api/mobil/dualar");

    return { success: true };
  } catch (error) {
    console.error("Dua aktiflik değiştirme hatası:", error);
    return { success: false, error: "Durum değiştirilemedi" };
  }
}
