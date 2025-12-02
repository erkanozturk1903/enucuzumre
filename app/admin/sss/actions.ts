"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getFAQs() {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: { order: "asc" },
    });
    return { success: true, data: faqs };
  } catch (error) {
    console.error("SSS getirme hatası:", error);
    return { success: false, error: "SSS verileri alınamadı" };
  }
}

export async function createFAQ(formData: FormData) {
  try {
    const question = formData.get("question") as string;
    const answer = formData.get("answer") as string;
    const order = parseInt(formData.get("order") as string) || 0;
    const isActive = formData.get("isActive") === "true";

    if (!question || !answer) {
      return { success: false, error: "Soru ve cevap zorunludur" };
    }

    const faq = await prisma.fAQ.create({
      data: { question, answer, order, isActive },
    });

    revalidatePath("/admin/sss");
    revalidatePath("/sss");

    return { success: true, data: faq };
  } catch (error) {
    console.error("SSS oluşturma hatası:", error);
    return { success: false, error: "SSS oluşturulamadı" };
  }
}

export async function updateFAQ(id: string, formData: FormData) {
  try {
    const question = formData.get("question") as string;
    const answer = formData.get("answer") as string;
    const order = parseInt(formData.get("order") as string) || 0;
    const isActive = formData.get("isActive") === "true";

    const faq = await prisma.fAQ.update({
      where: { id },
      data: { question, answer, order, isActive },
    });

    revalidatePath("/admin/sss");
    revalidatePath("/sss");

    return { success: true, data: faq };
  } catch (error) {
    console.error("SSS güncelleme hatası:", error);
    return { success: false, error: "SSS güncellenemedi" };
  }
}

export async function deleteFAQ(id: string) {
  try {
    await prisma.fAQ.delete({ where: { id } });

    revalidatePath("/admin/sss");
    revalidatePath("/sss");

    return { success: true };
  } catch (error) {
    console.error("SSS silme hatası:", error);
    return { success: false, error: "SSS silinemedi" };
  }
}

export async function reorderFAQs(faqs: { id: string; order: number }[]) {
  try {
    await Promise.all(
      faqs.map((faq) =>
        prisma.fAQ.update({
          where: { id: faq.id },
          data: { order: faq.order },
        })
      )
    );

    revalidatePath("/admin/sss");
    revalidatePath("/sss");

    return { success: true };
  } catch (error) {
    console.error("SSS sıralama hatası:", error);
    return { success: false, error: "Sıralama güncellenemedi" };
  }
}
