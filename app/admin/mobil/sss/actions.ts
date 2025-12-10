"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getMobilSSSler() {
  try {
    const sssler = await prisma.mobilSSS.findMany({ orderBy: { order: "asc" } });
    return { success: true, data: sssler };
  } catch (error) {
    return { success: false, error: "SSS'ler alınamadı" };
  }
}

export async function getMobilSSSById(id: string) {
  try {
    const sss = await prisma.mobilSSS.findUnique({ where: { id } });
    return { success: true, data: sss };
  } catch (error) {
    return { success: false, error: "SSS alınamadı" };
  }
}

export async function createMobilSSS(formData: FormData) {
  try {
    const slug = formData.get("slug") as string;
    const soru = formData.get("soru") as string;
    const cevapStr = formData.get("cevap") as string;
    const kategori = formData.get("kategori") as string;
    const icon = formData.get("icon") as string;

    if (!slug || !soru) return { success: false, error: "Zorunlu alanları doldurun" };

    let cevap = {};
    try { cevap = JSON.parse(cevapStr || "{}"); } catch { return { success: false, error: "Cevap JSON formatında olmalı" }; }

    const maxOrder = await prisma.mobilSSS.aggregate({ _max: { order: true } });

    const sss = await prisma.mobilSSS.create({
      data: {
        slug,
        soru,
        cevap,
        kategori: kategori || "genel",
        icon: icon || "fas fa-question-circle",
        order: (maxOrder._max.order ?? -1) + 1,
      },
    });

    revalidatePath("/admin/mobil/mobil-sss");
    revalidatePath("/api/mobil/sss");
    return { success: true, data: sss };
  } catch (error: any) {
    if (error.code === "P2002") return { success: false, error: "Bu slug zaten mevcut" };
    return { success: false, error: "SSS oluşturulamadı" };
  }
}

export async function updateMobilSSS(id: string, formData: FormData) {
  try {
    const slug = formData.get("slug") as string;
    const soru = formData.get("soru") as string;
    const cevapStr = formData.get("cevap") as string;
    const kategori = formData.get("kategori") as string;
    const icon = formData.get("icon") as string;
    const isActive = formData.get("isActive") === "true";

    let cevap = {};
    try { cevap = JSON.parse(cevapStr || "{}"); } catch { return { success: false, error: "Cevap JSON formatında olmalı" }; }

    const sss = await prisma.mobilSSS.update({
      where: { id },
      data: { slug, soru, cevap, kategori, icon, isActive },
    });

    revalidatePath("/admin/mobil/mobil-sss");
    revalidatePath("/api/mobil/sss");
    return { success: true, data: sss };
  } catch (error: any) {
    if (error.code === "P2002") return { success: false, error: "Bu slug zaten mevcut" };
    return { success: false, error: "SSS güncellenemedi" };
  }
}

export async function deleteMobilSSS(id: string) {
  try {
    await prisma.mobilSSS.delete({ where: { id } });
    revalidatePath("/admin/mobil/mobil-sss");
    revalidatePath("/api/mobil/sss");
    return { success: true };
  } catch (error) {
    return { success: false, error: "SSS silinemedi" };
  }
}

export async function toggleMobilSSSActive(id: string, isActive: boolean) {
  try {
    await prisma.mobilSSS.update({ where: { id }, data: { isActive } });
    revalidatePath("/admin/mobil/mobil-sss");
    revalidatePath("/api/mobil/sss");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Durum değiştirilemedi" };
  }
}
