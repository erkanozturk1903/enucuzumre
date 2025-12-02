"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getHeroSlides() {
  try {
    const slides = await prisma.heroSlide.findMany({
      orderBy: { order: "asc" },
    });
    return { success: true, data: slides };
  } catch (error) {
    console.error("Hero slides getirme hatası:", error);
    return { success: false, error: "Slider verileri alınamadı" };
  }
}

export async function createHeroSlide(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const buttonText = formData.get("buttonText") as string;
    const buttonLink = formData.get("buttonLink") as string;
    const order = parseInt(formData.get("order") as string) || 0;
    const isActive = formData.get("isActive") === "true";

    if (!title || !imageUrl) {
      return { success: false, error: "Başlık ve görsel URL zorunludur" };
    }

    const slide = await prisma.heroSlide.create({
      data: {
        title,
        subtitle: subtitle || null,
        imageUrl,
        buttonText: buttonText || null,
        buttonLink: buttonLink || null,
        order,
        isActive,
      },
    });

    revalidatePath("/admin/hero-slider");
    revalidatePath("/");

    return { success: true, data: slide };
  } catch (error) {
    console.error("Hero slide oluşturma hatası:", error);
    return { success: false, error: "Slide oluşturulamadı" };
  }
}

export async function updateHeroSlide(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const buttonText = formData.get("buttonText") as string;
    const buttonLink = formData.get("buttonLink") as string;
    const order = parseInt(formData.get("order") as string) || 0;
    const isActive = formData.get("isActive") === "true";

    if (!title || !imageUrl) {
      return { success: false, error: "Başlık ve görsel URL zorunludur" };
    }

    const slide = await prisma.heroSlide.update({
      where: { id },
      data: {
        title,
        subtitle: subtitle || null,
        imageUrl,
        buttonText: buttonText || null,
        buttonLink: buttonLink || null,
        order,
        isActive,
      },
    });

    revalidatePath("/admin/hero-slider");
    revalidatePath("/");

    return { success: true, data: slide };
  } catch (error) {
    console.error("Hero slide güncelleme hatası:", error);
    return { success: false, error: "Slide güncellenemedi" };
  }
}

export async function deleteHeroSlide(id: string) {
  try {
    await prisma.heroSlide.delete({
      where: { id },
    });

    revalidatePath("/admin/hero-slider");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Hero slide silme hatası:", error);
    return { success: false, error: "Slide silinemedi" };
  }
}

export async function reorderHeroSlides(slides: { id: string; order: number }[]) {
  try {
    await Promise.all(
      slides.map((slide) =>
        prisma.heroSlide.update({
          where: { id: slide.id },
          data: { order: slide.order },
        })
      )
    );

    revalidatePath("/admin/hero-slider");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Hero slides sıralama hatası:", error);
    return { success: false, error: "Sıralama güncellenemedi" };
  }
}
