"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getBranches() {
  try {
    const branches = await prisma.branch.findMany({
      orderBy: { order: "asc" },
    });
    return { success: true, data: branches };
  } catch (error) {
    console.error("Şubeler getirme hatası:", error);
    return { success: false, error: "Şubeler alınamadı" };
  }
}

export async function createBranch(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const city = formData.get("city") as string;
    const address = formData.get("address") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const tursabNo = formData.get("tursabNo") as string;
    const tursabOwner = formData.get("tursabOwner") as string;
    const mapUrl = formData.get("mapUrl") as string;
    const workingHours = formData.get("workingHours") as string;
    const image = formData.get("image") as string;
    const order = parseInt(formData.get("order") as string) || 0;
    const isActive = formData.get("isActive") === "true";

    if (!name || !city || !address || !phone) {
      return { success: false, error: "Şube adı, şehir, adres ve telefon zorunludur" };
    }

    const branch = await prisma.branch.create({
      data: {
        name,
        city,
        address,
        phone,
        email: email || null,
        tursabNo: tursabNo || null,
        tursabOwner: tursabOwner || null,
        mapUrl: mapUrl || null,
        workingHours: workingHours || null,
        image: image || null,
        order,
        isActive,
      },
    });

    revalidatePath("/admin/subeler");
    revalidatePath("/subelerimiz");

    return { success: true, data: branch };
  } catch (error) {
    console.error("Şube oluşturma hatası:", error);
    return { success: false, error: "Şube oluşturulamadı" };
  }
}

export async function updateBranch(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const city = formData.get("city") as string;
    const address = formData.get("address") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const tursabNo = formData.get("tursabNo") as string;
    const tursabOwner = formData.get("tursabOwner") as string;
    const mapUrl = formData.get("mapUrl") as string;
    const workingHours = formData.get("workingHours") as string;
    const image = formData.get("image") as string;
    const order = parseInt(formData.get("order") as string) || 0;
    const isActive = formData.get("isActive") === "true";

    const branch = await prisma.branch.update({
      where: { id },
      data: {
        name,
        city,
        address,
        phone,
        email: email || null,
        tursabNo: tursabNo || null,
        tursabOwner: tursabOwner || null,
        mapUrl: mapUrl || null,
        workingHours: workingHours || null,
        image: image || null,
        order,
        isActive,
      },
    });

    revalidatePath("/admin/subeler");
    revalidatePath("/subelerimiz");

    return { success: true, data: branch };
  } catch (error) {
    console.error("Şube güncelleme hatası:", error);
    return { success: false, error: "Şube güncellenemedi" };
  }
}

export async function deleteBranch(id: string) {
  try {
    await prisma.branch.delete({ where: { id } });

    revalidatePath("/admin/subeler");
    revalidatePath("/subelerimiz");

    return { success: true };
  } catch (error) {
    console.error("Şube silme hatası:", error);
    return { success: false, error: "Şube silinemedi" };
  }
}
