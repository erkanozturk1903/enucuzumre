"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ZiyaretSehir } from "@prisma/client";

export async function getZiyaretYerleri(sehir?: ZiyaretSehir) {
  try {
    const yerler = await prisma.ziyaretYeri.findMany({
      where: sehir ? { sehir } : undefined,
      orderBy: [{ sehir: "asc" }, { order: "asc" }],
    });
    return { success: true, data: yerler };
  } catch (error) {
    console.error("Ziyaret yerleri getirme hatası:", error);
    return { success: false, error: "Ziyaret yerleri alınamadı" };
  }
}

export async function getZiyaretYeriById(id: string) {
  try {
    const yer = await prisma.ziyaretYeri.findUnique({ where: { id } });
    return { success: true, data: yer };
  } catch (error) {
    console.error("Ziyaret yeri getirme hatası:", error);
    return { success: false, error: "Ziyaret yeri alınamadı" };
  }
}

export async function createZiyaretYeri(formData: FormData) {
  try {
    const slug = formData.get("slug") as string;
    const baslik = formData.get("baslik") as string;
    const altBaslik = formData.get("altBaslik") as string;
    const sehir = formData.get("sehir") as ZiyaretSehir;
    const kategori = formData.get("kategori") as string;
    const lat = formData.get("lat") as string;
    const lng = formData.get("lng") as string;
    const adres = formData.get("adres") as string;
    const aciklama = formData.get("aciklama") as string;
    const ibadethane = formData.get("ibadethane") === "true";
    const ziyaretSaatleri = formData.get("ziyaretSaatleri") as string;
    const girisUcreti = formData.get("girisUcreti") as string;
    const resimUrl = formData.get("resimUrl") as string;
    const icon = formData.get("icon") as string;

    if (!slug || !baslik || !sehir) {
      return { success: false, error: "Zorunlu alanları doldurun" };
    }

    const maxOrder = await prisma.ziyaretYeri.aggregate({
      where: { sehir },
      _max: { order: true },
    });

    const yer = await prisma.ziyaretYeri.create({
      data: {
        slug,
        baslik,
        altBaslik: altBaslik || null,
        sehir,
        kategori: kategori || "mescid",
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null,
        adres: adres || null,
        aciklama: aciklama || null,
        ibadethane,
        ziyaretSaatleri: ziyaretSaatleri || null,
        girisUcreti: girisUcreti || null,
        resimUrl: resimUrl || null,
        icon: icon || "fas fa-mosque",
        order: (maxOrder._max.order ?? -1) + 1,
      },
    });

    revalidatePath("/admin/mobil/ziyaret-yerleri");
    revalidatePath("/admin/mobil");
    revalidatePath("/api/mobil/ziyaret-yerleri");

    return { success: true, data: yer };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "Bu slug zaten mevcut" };
    }
    console.error("Ziyaret yeri oluşturma hatası:", error);
    return { success: false, error: "Ziyaret yeri oluşturulamadı" };
  }
}

export async function updateZiyaretYeri(id: string, formData: FormData) {
  try {
    const slug = formData.get("slug") as string;
    const baslik = formData.get("baslik") as string;
    const altBaslik = formData.get("altBaslik") as string;
    const sehir = formData.get("sehir") as ZiyaretSehir;
    const kategori = formData.get("kategori") as string;
    const lat = formData.get("lat") as string;
    const lng = formData.get("lng") as string;
    const adres = formData.get("adres") as string;
    const aciklama = formData.get("aciklama") as string;
    const ibadethane = formData.get("ibadethane") === "true";
    const ziyaretSaatleri = formData.get("ziyaretSaatleri") as string;
    const girisUcreti = formData.get("girisUcreti") as string;
    const resimUrl = formData.get("resimUrl") as string;
    const icon = formData.get("icon") as string;
    const isActive = formData.get("isActive") === "true";

    const yer = await prisma.ziyaretYeri.update({
      where: { id },
      data: {
        slug,
        baslik,
        altBaslik: altBaslik || null,
        sehir,
        kategori,
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null,
        adres: adres || null,
        aciklama: aciklama || null,
        ibadethane,
        ziyaretSaatleri: ziyaretSaatleri || null,
        girisUcreti: girisUcreti || null,
        resimUrl: resimUrl || null,
        icon,
        isActive,
      },
    });

    revalidatePath("/admin/mobil/ziyaret-yerleri");
    revalidatePath("/admin/mobil");
    revalidatePath("/api/mobil/ziyaret-yerleri");

    return { success: true, data: yer };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "Bu slug zaten mevcut" };
    }
    console.error("Ziyaret yeri güncelleme hatası:", error);
    return { success: false, error: "Ziyaret yeri güncellenemedi" };
  }
}

export async function deleteZiyaretYeri(id: string) {
  try {
    await prisma.ziyaretYeri.delete({ where: { id } });
    revalidatePath("/admin/mobil/ziyaret-yerleri");
    revalidatePath("/admin/mobil");
    revalidatePath("/api/mobil/ziyaret-yerleri");
    return { success: true };
  } catch (error) {
    console.error("Ziyaret yeri silme hatası:", error);
    return { success: false, error: "Ziyaret yeri silinemedi" };
  }
}

export async function toggleZiyaretYeriActive(id: string, isActive: boolean) {
  try {
    await prisma.ziyaretYeri.update({
      where: { id },
      data: { isActive },
    });
    revalidatePath("/admin/mobil/ziyaret-yerleri");
    revalidatePath("/api/mobil/ziyaret-yerleri");
    return { success: true };
  } catch (error) {
    console.error("Ziyaret yeri aktiflik değiştirme hatası:", error);
    return { success: false, error: "Durum değiştirilemedi" };
  }
}
