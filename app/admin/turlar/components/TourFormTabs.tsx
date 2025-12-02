"use client";

import { useState, useRef, useEffect } from "react";
import {
  Save,
  Loader2,
  Plus,
  Trash2,
  Image as ImageIcon,
  Calendar,
  Info,
  MapPin,
  CheckSquare,
  Upload,
  X
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "genel", label: "Genel Bilgiler", icon: Info },
  { id: "detaylar", label: "Detaylar", icon: MapPin },
  { id: "program", label: "Tur Programı", icon: Calendar },
  { id: "dahil", label: "Dahil/Hariç", icon: CheckSquare },
  { id: "gorseller", label: "Görseller", icon: ImageIcon },
];

const TOUR_TYPES = [
  { value: "UMRE", label: "Umre" },
  { value: "HAC", label: "Hac" },
  { value: "KULTUR", label: "Kültür Turu" },
];

const CURRENCIES = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "TL", label: "TL (₺)" },
];

interface TourFormTabsProps {
  onSubmit: (formData: FormData) => Promise<void>;
  isSaving: boolean;
  initialData?: any;
}

// Slug oluşturma fonksiyonu
function slugify(text: string): string {
  const trMap: Record<string, string> = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
  };
  
  return text
    .split('')
    .map(char => trMap[char] || char)
    .join('')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function TourFormTabs({ onSubmit, isSaving, initialData }: TourFormTabsProps) {
  const [activeTab, setActiveTab] = useState("genel");
  const formRef = useRef<HTMLFormElement>(null);

  // Form state
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [autoSlug, setAutoSlug] = useState(!initialData);

  // Itinerary state
  const [itinerary, setItinerary] = useState<{ title: string; description: string }[]>(
    initialData?.itinerary || [{ title: "", description: "" }]
  );

  // Images state
  const [images, setImages] = useState<{ url: string; alt?: string }[]>(
    initialData?.images || [{ url: "", alt: "" }]
  );

  // Included/Excluded state
  const [included, setIncluded] = useState<string[]>(
    initialData?.included?.map((i: any) => i.item) || [""]
  );
  const [excluded, setExcluded] = useState<string[]>(
    initialData?.excluded?.map((e: any) => e.item) || [""]
  );

  // Auto-generate slug from title
  useEffect(() => {
    if (autoSlug && title) {
      setSlug(slugify(title));
    }
  }, [title, autoSlug]);

  // Format date for input
  function formatDateForInput(date: Date | string | undefined): string {
    if (!date) return "";
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().split('T')[0];
  }

  // Handle form submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const formData = new FormData(formRef.current!);
    
    // Add itinerary as JSON
    formData.set("itinerary", JSON.stringify(itinerary.filter(day => day.title || day.description)));
    
    // Add images as JSON
    formData.set("images", JSON.stringify(images.filter(img => img.url)));
    
    // Add included/excluded as JSON
    formData.set("included", JSON.stringify(included.filter(item => item.trim())));
    formData.set("excluded", JSON.stringify(excluded.filter(item => item.trim())));

    await onSubmit(formData);
  }

  // Add new itinerary day
  function addItineraryDay() {
    setItinerary([...itinerary, { title: "", description: "" }]);
  }

  // Remove itinerary day
  function removeItineraryDay(index: number) {
    setItinerary(itinerary.filter((_, i) => i !== index));
  }

  // Update itinerary day
  function updateItineraryDay(index: number, field: "title" | "description", value: string) {
    const updated = [...itinerary];
    updated[index][field] = value;
    setItinerary(updated);
  }

  // Add new image
  function addImage() {
    setImages([...images, { url: "", alt: "" }]);
  }

  // Remove image
  function removeImage(index: number) {
    setImages(images.filter((_, i) => i !== index));
  }

  // Update image
  function updateImage(index: number, field: "url" | "alt", value: string) {
    const updated = [...images];
    updated[index][field] = value;
    setImages(updated);
  }

  // Add included item
  function addIncluded() {
    setIncluded([...included, ""]);
  }

  // Remove included item
  function removeIncluded(index: number) {
    setIncluded(included.filter((_, i) => i !== index));
  }

  // Update included item
  function updateIncluded(index: number, value: string) {
    const updated = [...included];
    updated[index] = value;
    setIncluded(updated);
  }

  // Add excluded item
  function addExcluded() {
    setExcluded([...excluded, ""]);
  }

  // Remove excluded item
  function removeExcluded(index: number) {
    setExcluded(excluded.filter((_, i) => i !== index));
  }

  // Update excluded item
  function updateExcluded(index: number, value: string) {
    const updated = [...excluded];
    updated[index] = value;
    setExcluded(updated);
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100 overflow-x-auto">
          <div className="flex">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap",
                  activeTab === tab.id
                    ? "text-[#059669] border-b-2 border-[#059669] bg-green-50/50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Tab 1: Genel Bilgiler */}
          {activeTab === "genel" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-primary mb-4">Genel Bilgiler</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tur Başlığı <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                    placeholder="15 Günlük Ekonomik Umre Turu"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug (URL) <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="slug"
                      value={slug}
                      onChange={(e) => {
                        setSlug(e.target.value);
                        setAutoSlug(false);
                      }}
                      required
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                      placeholder="15-gunluk-ekonomik-umre-turu"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setAutoSlug(true);
                        setSlug(slugify(title));
                      }}
                      className="px-4 py-2 text-sm text-[#059669] hover:bg-green-50 rounded-lg border border-[#059669] transition-colors"
                    >
                      Otomatik Oluştur
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tur Tipi <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="type"
                    defaultValue={initialData?.type || "UMRE"}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                  >
                    {TOUR_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Otel Yıldızı <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="hotelStars"
                    defaultValue={initialData?.hotelStars || 4}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                  >
                    <option value="3">3 Yıldız</option>
                    <option value="4">4 Yıldız</option>
                    <option value="5">5 Yıldız</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fiyat <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    defaultValue={initialData?.price || ""}
                    step="0.01"
                    min="0"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                    placeholder="2500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Para Birimi <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="currency"
                    defaultValue={initialData?.currency || "USD"}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                  >
                    {CURRENCIES.map((curr) => (
                      <option key={curr.value} value={curr.value}>
                        {curr.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Başlangıç Tarihi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    defaultValue={formatDateForInput(initialData?.startDate)}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bitiş Tarihi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    defaultValue={formatDateForInput(initialData?.endDate)}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kontenjan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="quota"
                    defaultValue={initialData?.quota || 40}
                    min="1"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                    placeholder="40"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      value="true"
                      defaultChecked={initialData?.isFeatured}
                      className="w-5 h-5 text-[#059669] border-gray-300 rounded focus:ring-[#059669]"
                    />
                    <span className="text-sm font-medium text-gray-700">Öne Çıkan Tur</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      value="true"
                      defaultChecked={initialData?.isActive ?? true}
                      className="w-5 h-5 text-[#059669] border-gray-300 rounded focus:ring-[#059669]"
                    />
                    <span className="text-sm font-medium text-gray-700">Aktif</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Detaylar */}
          {activeTab === "detaylar" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-primary mb-4">Tur Detayları</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mekke Oteli
                  </label>
                  <input
                    type="text"
                    name="meccaHotel"
                    defaultValue={initialData?.meccaHotel || ""}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                    placeholder="Hilton Makkah Convention Hotel"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medine Oteli
                  </label>
                  <input
                    type="text"
                    name="medinaHotel"
                    defaultValue={initialData?.medinaHotel || ""}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                    placeholder="Pullman Zamzam Madina"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kabe'ye Uzaklık (metre)
                  </label>
                  <input
                    type="number"
                    name="kaabaDistance"
                    defaultValue={initialData?.kaabaDistance || ""}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                    placeholder="500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tur Açıklaması <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    defaultValue={initialData?.description || ""}
                    rows={8}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] resize-none"
                    placeholder="Bu umre turu, manevi bir yolculuk arayanlar için özel olarak tasarlanmıştır..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Tur Programı */}
          {activeTab === "program" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-primary">Tur Programı</h3>
                <button
                  type="button"
                  onClick={addItineraryDay}
                  className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Gün Ekle
                </button>
              </div>

              <div className="space-y-4">
                {itinerary.map((day, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-primary">Gün {index + 1}</h4>
                      {itinerary.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItineraryDay(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <input
                        type="text"
                        value={day.title}
                        onChange={(e) => updateItineraryDay(index, "title", e.target.value)}
                        placeholder="Başlık (örn: İstanbul - Cidde Uçuşu)"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                      />
                      <textarea
                        value={day.description}
                        onChange={(e) => updateItineraryDay(index, "description", e.target.value)}
                        rows={3}
                        placeholder="Açıklama..."
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Dahil/Hariç */}
          {activeTab === "dahil" && (
            <div className="space-y-8">
              {/* Fiyata Dahil */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-primary">Fiyata Dahil Olanlar</h3>
                  <button
                    type="button"
                    onClick={addIncluded}
                    className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Ekle
                  </button>
                </div>

                <div className="space-y-2">
                  {included.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateIncluded(index, e.target.value)}
                        placeholder="Örn: Gidiş-dönüş uçak bileti"
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                      />
                      {included.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeIncluded(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Fiyata Dahil Olmayanlar */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-primary">Fiyata Dahil Olmayanlar</h3>
                  <button
                    type="button"
                    onClick={addExcluded}
                    className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Ekle
                  </button>
                </div>

                <div className="space-y-2">
                  {excluded.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateExcluded(index, e.target.value)}
                        placeholder="Örn: Kişisel harcamalar"
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                      />
                      {excluded.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExcluded(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Görseller */}
          {activeTab === "gorseller" && (
            <TourImagesTab
              images={images}
              onAddImage={addImage}
              onRemoveImage={removeImage}
              onUpdateImage={updateImage}
            />
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <button
          type="submit"
          disabled={isSaving}
          className="px-8 py-3 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Kaydediliyor...
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Kaydet
            </>
          )}
        </button>
      </div>
    </form>
  );
}

// Tour Images Tab Component with File Upload
interface TourImagesTabProps {
  images: { url: string; alt?: string }[];
  onAddImage: () => void;
  onRemoveImage: (index: number) => void;
  onUpdateImage: (index: number, field: "url" | "alt", value: string) => void;
}

function TourImagesTab({ images, onAddImage, onRemoveImage, onUpdateImage }: TourImagesTabProps) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const handleFileUpload = async (index: number, file: File) => {
    if (!file) return;

    // Dosya tipi kontrolü
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      alert("Sadece resim dosyaları yüklenebilir (JPEG, PNG, WebP, GIF)");
      return;
    }

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Dosya boyutu 5MB'dan büyük olamaz");
      return;
    }

    setUploadingIndex(index);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "tours");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onUpdateImage(index, "url", data.url);
      } else {
        const error = await response.json();
        alert(error.error || "Dosya yüklenirken hata oluştu");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Dosya yüklenirken hata oluştu");
    } finally {
      setUploadingIndex(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-primary">Tur Görselleri</h3>
        <button
          type="button"
          onClick={onAddImage}
          className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Görsel Ekle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-primary text-sm">Görsel {index + 1}</h4>
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveImage(index)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Image Preview or Upload Area */}
            {image.url ? (
              <div className="relative aspect-video mb-3 rounded-lg overflow-hidden bg-gray-200">
                <Image
                  src={image.url}
                  alt={image.alt || `Görsel ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <button
                  type="button"
                  onClick={() => onUpdateImage(index, "url", "")}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center aspect-video mb-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#059669] hover:bg-green-50/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(index, file);
                  }}
                  className="hidden"
                  disabled={uploadingIndex !== null}
                />
                {uploadingIndex === index ? (
                  <>
                    <Loader2 className="h-8 w-8 text-[#059669] animate-spin mb-2" />
                    <span className="text-sm text-gray-500">Yükleniyor...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Görsel yükle</span>
                    <span className="text-xs text-gray-400 mt-1">veya sürükle bırak</span>
                  </>
                )}
              </label>
            )}

            {/* Alt Text and URL Input */}
            <div className="space-y-2">
              <input
                type="text"
                value={image.alt || ""}
                onChange={(e) => onUpdateImage(index, "alt", e.target.value)}
                placeholder="Alternatif metin"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
              />
              <div className="text-xs text-gray-400">
                veya URL girin:
              </div>
              <input
                type="url"
                value={image.url}
                onChange={(e) => onUpdateImage(index, "url", e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Not:</strong> Görselleri bilgisayarınızdan yükleyebilir veya URL olarak ekleyebilirsiniz.
          Desteklenen formatlar: JPEG, PNG, WebP, GIF. Maksimum dosya boyutu: 5MB.
        </p>
      </div>
    </div>
  );
}



