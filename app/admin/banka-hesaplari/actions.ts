"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getBankAccounts() {
  try {
    const accounts = await prisma.bankAccount.findMany({
      orderBy: { order: "asc" },
    });
    return { success: true, data: accounts };
  } catch (error) {
    console.error("Banka hesapları getirme hatası:", error);
    return { success: false, error: "Banka hesapları alınamadı" };
  }
}

export async function createBankAccount(formData: FormData) {
  try {
    const bankName = formData.get("bankName") as string;
    const accountName = formData.get("accountName") as string;
    const iban = formData.get("iban") as string;
    const branch = formData.get("branch") as string;
    const logo = formData.get("logo") as string;
    const order = parseInt(formData.get("order") as string) || 0;
    const isActive = formData.get("isActive") === "true";

    if (!bankName || !accountName || !iban) {
      return { success: false, error: "Banka adı, hesap adı ve IBAN zorunludur" };
    }

    const account = await prisma.bankAccount.create({
      data: {
        bankName,
        accountName,
        iban,
        branch: branch || null,
        logo: logo || null,
        order,
        isActive,
      },
    });

    revalidatePath("/admin/banka-hesaplari");
    revalidatePath("/banka-hesaplari");

    return { success: true, data: account };
  } catch (error) {
    console.error("Banka hesabı oluşturma hatası:", error);
    return { success: false, error: "Banka hesabı oluşturulamadı" };
  }
}

export async function updateBankAccount(id: string, formData: FormData) {
  try {
    const bankName = formData.get("bankName") as string;
    const accountName = formData.get("accountName") as string;
    const iban = formData.get("iban") as string;
    const branch = formData.get("branch") as string;
    const logo = formData.get("logo") as string;
    const order = parseInt(formData.get("order") as string) || 0;
    const isActive = formData.get("isActive") === "true";

    const account = await prisma.bankAccount.update({
      where: { id },
      data: {
        bankName,
        accountName,
        iban,
        branch: branch || null,
        logo: logo || null,
        order,
        isActive,
      },
    });

    revalidatePath("/admin/banka-hesaplari");
    revalidatePath("/banka-hesaplari");

    return { success: true, data: account };
  } catch (error) {
    console.error("Banka hesabı güncelleme hatası:", error);
    return { success: false, error: "Banka hesabı güncellenemedi" };
  }
}

export async function deleteBankAccount(id: string) {
  try {
    await prisma.bankAccount.delete({ where: { id } });

    revalidatePath("/admin/banka-hesaplari");
    revalidatePath("/banka-hesaplari");

    return { success: true };
  } catch (error) {
    console.error("Banka hesabı silme hatası:", error);
    return { success: false, error: "Banka hesabı silinemedi" };
  }
}
