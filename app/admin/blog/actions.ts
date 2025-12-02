"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: posts };
  } catch (error) {
    console.error("Blog yazıları getirme hatası:", error);
    return { success: false, error: "Blog yazıları alınamadı" };
  }
}

export async function createBlogPost(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const image = formData.get("image") as string;
    const author = formData.get("author") as string;
    const category = formData.get("category") as string;
    const isPublished = formData.get("isPublished") === "true";

    if (!title || !slug || !excerpt || !content || !image || !author || !category) {
      return { success: false, error: "Tüm alanları doldurun" };
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        image,
        author,
        category,
        isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");

    return { success: true, data: post };
  } catch (error) {
    console.error("Blog yazısı oluşturma hatası:", error);
    return { success: false, error: "Blog yazısı oluşturulamadı" };
  }
}

export async function updateBlogPost(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const image = formData.get("image") as string;
    const author = formData.get("author") as string;
    const category = formData.get("category") as string;
    const isPublished = formData.get("isPublished") === "true";

    const existingPost = await prisma.blogPost.findUnique({ where: { id } });

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        image,
        author,
        category,
        isPublished,
        publishedAt: isPublished && !existingPost?.publishedAt ? new Date() : existingPost?.publishedAt,
      },
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);

    return { success: true, data: post };
  } catch (error) {
    console.error("Blog yazısı güncelleme hatası:", error);
    return { success: false, error: "Blog yazısı güncellenemedi" };
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await prisma.blogPost.delete({ where: { id } });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");

    return { success: true };
  } catch (error) {
    console.error("Blog yazısı silme hatası:", error);
    return { success: false, error: "Blog yazısı silinemedi" };
  }
}

export async function toggleBlogPostPublish(id: string) {
  try {
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) return { success: false, error: "Yazı bulunamadı" };

    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        isPublished: !post.isPublished,
        publishedAt: !post.isPublished ? new Date() : post.publishedAt,
      },
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");

    return { success: true, data: updated };
  } catch (error) {
    console.error("Blog yazısı durum değiştirme hatası:", error);
    return { success: false, error: "Durum değiştirilemedi" };
  }
}
