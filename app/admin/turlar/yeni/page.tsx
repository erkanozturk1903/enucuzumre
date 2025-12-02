"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { createTour } from "../actions";
import { TourFormTabs } from "../components/TourFormTabs";

export default function NewTourPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSaving(true);

    const result = await createTour(formData);

    if (result.success) {
      toast.success(result.message);
      router.push("/admin/turlar");
    } else {
      toast.error(result.error);
    }

    setIsSaving(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/turlar"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-primary">Yeni Tur Ekle</h1>
            <p className="text-gray-600 mt-1">
              Detayları doldurun ve yeni bir tur oluşturun
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <TourFormTabs onSubmit={handleSubmit} isSaving={isSaving} />
    </div>
  );
}



