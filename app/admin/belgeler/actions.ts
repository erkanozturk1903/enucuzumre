"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCertificates() {
  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: { order: "asc" },
    });
    return { success: true, data: certificates };
  } catch (error) {
    console.error("Belgeler getirme hatası:", error);
    return { success: false, error: "Belgeler alınamadı" };
  }
}

export async function createCertificate(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const number = formData.get("number") as string;
    const description = formData.get("description") as string;
    const icon = formData.get("icon") as string;
    const order = parseInt(formData.get("order") as string) || 0;
    const isActive = formData.get("isActive") === "true";

    if (!title || !number) {
      return { success: false, error: "Belge adı ve numarası zorunludur" };
    }

    const certificate = await prisma.certificate.create({
      data: {
        title,
        number,
        description: description || null,
        icon: icon || "FileText",
        order,
        isActive,
      },
    });

    revalidatePath("/admin/belgeler");
    revalidatePath("/belgelerimiz");

    return { success: true, data: certificate };
  } catch (error) {
    console.error("Belge oluşturma hatası:", error);
    return { success: false, error: "Belge oluşturulamadı" };
  }
}

export async function updateCertificate(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const number = formData.get("number") as string;
    const description = formData.get("description") as string;
    const icon = formData.get("icon") as string;
    const order = parseInt(formData.get("order") as string) || 0;
    const isActive = formData.get("isActive") === "true";

    const certificate = await prisma.certificate.update({
      where: { id },
      data: {
        title,
        number,
        description: description || null,
        icon: icon || "FileText",
        order,
        isActive,
      },
    });

    revalidatePath("/admin/belgeler");
    revalidatePath("/belgelerimiz");

    return { success: true, data: certificate };
  } catch (error) {
    console.error("Belge güncelleme hatası:", error);
    return { success: false, error: "Belge güncellenemedi" };
  }
}

export async function deleteCertificate(id: string) {
  try {
    await prisma.certificate.delete({ where: { id } });

    revalidatePath("/admin/belgeler");
    revalidatePath("/belgelerimiz");

    return { success: true };
  } catch (error) {
    console.error("Belge silme hatası:", error);
    return { success: false, error: "Belge silinemedi" };
  }
}
