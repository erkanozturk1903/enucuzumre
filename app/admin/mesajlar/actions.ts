"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { MessageStatus } from "@prisma/client";

export async function getContactMessages() {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: messages };
  } catch (error) {
    console.error("Mesajlar getirme hatası:", error);
    return { success: false, error: "Mesajlar alınamadı" };
  }
}

export async function updateMessageStatus(id: string, status: MessageStatus) {
  try {
    const message = await prisma.contactMessage.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/admin/mesajlar");

    return { success: true, data: message };
  } catch (error) {
    console.error("Mesaj durumu güncelleme hatası:", error);
    return { success: false, error: "Mesaj durumu güncellenemedi" };
  }
}

export async function updateMessageNotes(id: string, notes: string) {
  try {
    const message = await prisma.contactMessage.update({
      where: { id },
      data: { notes },
    });

    revalidatePath("/admin/mesajlar");

    return { success: true, data: message };
  } catch (error) {
    console.error("Mesaj notu güncelleme hatası:", error);
    return { success: false, error: "Mesaj notu güncellenemedi" };
  }
}

export async function deleteContactMessage(id: string) {
  try {
    await prisma.contactMessage.delete({ where: { id } });

    revalidatePath("/admin/mesajlar");

    return { success: true };
  } catch (error) {
    console.error("Mesaj silme hatası:", error);
    return { success: false, error: "Mesaj silinemedi" };
  }
}

export async function getMessageStats() {
  try {
    const [total, newCount, readCount, repliedCount] = await Promise.all([
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { status: "NEW" } }),
      prisma.contactMessage.count({ where: { status: "READ" } }),
      prisma.contactMessage.count({ where: { status: "REPLIED" } }),
    ]);

    return {
      success: true,
      data: { total, new: newCount, read: readCount, replied: repliedCount },
    };
  } catch (error) {
    console.error("Mesaj istatistikleri hatası:", error);
    return { success: false, error: "İstatistikler alınamadı" };
  }
}
