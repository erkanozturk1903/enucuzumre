"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { getTourById, updateTour } from "../../actions";
import { TourFormTabs } from "../../components/TourFormTabs";

export default function EditTourPage() {
  const router = useRouter();
  const params = useParams();
  const tourId = params.id as string;

  const [tour, setTour] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadTour();
  }, [tourId]);

  async function loadTour() {
    setIsLoading(true);
    const result = await getTourById(tourId);
    if (result.success && result.data) {
      setTour(result.data);
    } else {
      toast.error("Tur yüklenemedi");
      router.push("/admin/turlar");
    }
    setIsLoading(false);
  }

  async function handleSubmit(formData: FormData) {
    setIsSaving(true);

    const result = await updateTour(tourId, formData);

    if (result.success) {
      toast.success(result.message);
      router.push("/admin/turlar");
    } else {
      toast.error(result.error);
    }

    setIsSaving(false);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#059669]" />
      </div>
    );
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
            <h1 className="text-3xl font-bold text-primary">Turu Düzenle</h1>
            <p className="text-gray-600 mt-1">{tour?.title}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <TourFormTabs 
        onSubmit={handleSubmit} 
        isSaving={isSaving}
        initialData={tour}
      />
    </div>
  );
}



