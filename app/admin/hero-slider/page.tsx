"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Loader2,
  GripVertical,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { toast } from "sonner";
import {
  getHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  reorderHeroSlides
} from "./actions";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  buttonText: string | null;
  buttonLink: string | null;
  order: number;
  isActive: boolean;
}

export default function HeroSliderPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    buttonText: "",
    buttonLink: "",
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    loadSlides();
  }, []);

  async function loadSlides() {
    setLoading(true);
    const result = await getHeroSlides();
    if (result.success && result.data) {
      setSlides(result.data);
    } else {
      toast.error(result.error || "Slider verileri yüklenemedi");
    }
    setLoading(false);
  }

  function openCreateModal() {
    setEditingSlide(null);
    setFormData({
      title: "",
      subtitle: "",
      imageUrl: "",
      buttonText: "",
      buttonLink: "",
      order: slides.length,
      isActive: true,
    });
    setIsModalOpen(true);
  }

  function openEditModal(slide: HeroSlide) {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle || "",
      imageUrl: slide.imageUrl,
      buttonText: slide.buttonText || "",
      buttonLink: slide.buttonLink || "",
      order: slide.order,
      isActive: slide.isActive,
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingSlide(null);
    setFormData({
      title: "",
      subtitle: "",
      imageUrl: "",
      buttonText: "",
      buttonLink: "",
      order: 0,
      isActive: true,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const form = new FormData();
    form.set("title", formData.title);
    form.set("subtitle", formData.subtitle);
    form.set("imageUrl", formData.imageUrl);
    form.set("buttonText", formData.buttonText);
    form.set("buttonLink", formData.buttonLink);
    form.set("order", formData.order.toString());
    form.set("isActive", formData.isActive.toString());

    let result;
    if (editingSlide) {
      result = await updateHeroSlide(editingSlide.id, form);
    } else {
      result = await createHeroSlide(form);
    }

    if (result.success) {
      toast.success(editingSlide ? "Slide güncellendi!" : "Slide oluşturuldu!");
      closeModal();
      loadSlides();
    } else {
      toast.error(result.error || "Bir hata oluştu");
    }

    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu slide'ı silmek istediğinize emin misiniz?")) return;

    const result = await deleteHeroSlide(id);
    if (result.success) {
      toast.success("Slide silindi!");
      loadSlides();
    } else {
      toast.error(result.error || "Silme işlemi başarısız");
    }
  }

  async function moveSlide(index: number, direction: "up" | "down") {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= slides.length) return;

    const newSlides = [...slides];
    [newSlides[index], newSlides[newIndex]] = [newSlides[newIndex], newSlides[index]];

    const reorderedSlides = newSlides.map((slide, idx) => ({
      id: slide.id,
      order: idx,
    }));

    setSlides(newSlides.map((slide, idx) => ({ ...slide, order: idx })));

    const result = await reorderHeroSlides(reorderedSlides);
    if (!result.success) {
      toast.error("Sıralama güncellenemedi");
      loadSlides();
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Hero Slider</h1>
          <p className="text-gray-500 text-sm mt-1">
            Anasayfada gösterilecek slider görsellerini yönetin
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-secondary hover:bg-secondary/90 text-white font-medium rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Yeni Slide Ekle
        </button>
      </div>

      {/* Slides List */}
      {slides.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Henüz slide eklenmemiş</h3>
          <p className="text-gray-500 mb-4">İlk slide'ınızı ekleyerek başlayın</p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-secondary hover:bg-secondary/90 text-white font-medium rounded-lg inline-flex items-center gap-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Slide Ekle
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="flex items-stretch">
                {/* Thumbnail */}
                <div className="relative w-48 h-32 flex-shrink-0">
                  <Image
                    src={slide.imageUrl}
                    alt={slide.title}
                    fill
                    className="object-cover"
                  />
                  {!slide.isActive && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-xs font-medium px-2 py-1 bg-red-500 rounded">
                        Pasif
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-4 flex items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-0.5 rounded">
                        #{index + 1}
                      </span>
                      {slide.isActive ? (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <Eye className="h-3 w-3" /> Aktif
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <EyeOff className="h-3 w-3" /> Pasif
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-primary line-clamp-1">{slide.title}</h3>
                    {slide.subtitle && (
                      <p className="text-sm text-gray-500 line-clamp-1">{slide.subtitle}</p>
                    )}
                    {slide.buttonText && (
                      <p className="text-xs text-gray-400 mt-1">
                        Buton: {slide.buttonText} → {slide.buttonLink}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 px-4 border-l border-gray-100">
                  <button
                    onClick={() => moveSlide(index, "up")}
                    disabled={index === 0}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Yukarı taşı"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => moveSlide(index, "down")}
                    disabled={index === slides.length - 1}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Aşağı taşı"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => openEditModal(slide)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Düzenle"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(slide.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-primary">
                {editingSlide ? "Slide Düzenle" : "Yeni Slide"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Preview */}
              {formData.imageUrl && (
                <div className="relative aspect-[21/9] rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={formData.imageUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="text-center text-white px-8">
                      <h3 className="text-2xl font-bold mb-2">{formData.title || "Başlık"}</h3>
                      {formData.subtitle && (
                        <p className="text-gray-200">{formData.subtitle}</p>
                      )}
                      {formData.buttonText && (
                        <button className="mt-4 px-4 py-2 bg-secondary text-white rounded-lg text-sm font-medium">
                          {formData.buttonText}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Görsel URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Önerilen boyut: 1920x800 piksel
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Başlık <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                    placeholder="Manevi Yolculuğunuz Başlasın"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Başlık
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                    placeholder="Hac ve Umre turlarında en güvenilir platform"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buton Metni
                  </label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                    placeholder="Turları İncele"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buton Linki
                  </label>
                  <input
                    type="text"
                    value={formData.buttonLink}
                    onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                    placeholder="/umre-turlari"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sıra
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-5 h-5 text-secondary border-gray-300 rounded focus:ring-secondary"
                    />
                    <span className="font-medium text-gray-700">Aktif</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-secondary hover:bg-secondary/90 text-white rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 transition-colors"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Kaydediliyor...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Kaydet
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
