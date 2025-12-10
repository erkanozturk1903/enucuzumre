"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  BookOpen,
  Search,
  Filter,
  X,
  FolderPlus,
  Check,
  Tag,
} from "lucide-react";
import {
  getDualar,
  getKategoriler,
  createDua,
  updateDua,
  deleteDua,
  reorderDualar,
  toggleDuaActive,
  createKategori,
  deleteKategori,
} from "./actions";

interface Kategori {
  id: string;
  ad: string;
  icon: string;
  order: number;
  isActive: boolean;
  _count?: { dualar: number };
}

interface Dua {
  id: string;
  baslik: string;
  altBaslik: string | null;
  kategoriId: string;
  kategori: { id: string; ad: string; icon: string };
  arapca: string;
  okunusu: string;
  meali: string;
  kaynak: string | null;
  sesUrl: string | null;
  order: number;
  isActive: boolean;
}

export default function DualarPage() {
  const [dualar, setDualar] = useState<Dua[]>([]);
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showKategoriModal, setShowKategoriModal] = useState(false);
  const [editingDua, setEditingDua] = useState<Dua | null>(null);
  const [selectedKategori, setSelectedKategori] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    baslik: "",
    altBaslik: "",
    kategoriId: "",
    arapca: "",
    okunusu: "",
    meali: "",
    kaynak: "",
    sesUrl: "",
    isActive: true,
  });

  const [kategoriFormData, setKategoriFormData] = useState({
    ad: "",
    icon: "fas fa-book-open",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [dualarResult, kategorilerResult] = await Promise.all([
      getDualar(),
      getKategoriler(),
    ]);

    if (dualarResult.success && dualarResult.data) {
      setDualar(dualarResult.data as Dua[]);
    }
    if (kategorilerResult.success && kategorilerResult.data) {
      setKategoriler(kategorilerResult.data as Kategori[]);
    }
    setLoading(false);
  }

  function openCreateModal() {
    setEditingDua(null);
    setFormData({
      baslik: "",
      altBaslik: "",
      kategoriId: kategoriler[0]?.id || "",
      arapca: "",
      okunusu: "",
      meali: "",
      kaynak: "",
      sesUrl: "",
      isActive: true,
    });
    setShowModal(true);
  }

  function openEditModal(dua: Dua) {
    setEditingDua(dua);
    setFormData({
      baslik: dua.baslik,
      altBaslik: dua.altBaslik || "",
      kategoriId: dua.kategoriId,
      arapca: dua.arapca,
      okunusu: dua.okunusu,
      meali: dua.meali,
      kaynak: dua.kaynak || "",
      sesUrl: dua.sesUrl || "",
      isActive: dua.isActive,
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, String(value));
    });

    const result = editingDua
      ? await updateDua(editingDua.id, form)
      : await createDua(form);

    if (result.success) {
      setShowModal(false);
      loadData();
    } else {
      alert(result.error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu duayı silmek istediğinizden emin misiniz?")) return;
    const result = await deleteDua(id);
    if (result.success) {
      loadData();
    } else {
      alert(result.error);
    }
  }

  async function handleToggleActive(id: string, currentState: boolean) {
    const result = await toggleDuaActive(id, !currentState);
    if (result.success) {
      loadData();
    }
  }

  async function moveItem(index: number, direction: "up" | "down") {
    const filteredDualar = getFilteredDualar();
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= filteredDualar.length) return;

    const newDualar = [...filteredDualar];
    [newDualar[index], newDualar[newIndex]] = [
      newDualar[newIndex],
      newDualar[index],
    ];

    const updates = newDualar.map((dua, i) => ({ id: dua.id, order: i }));
    await reorderDualar(updates);
    loadData();
  }

  async function handleKategoriSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = new FormData();
    form.append("ad", kategoriFormData.ad);
    form.append("icon", kategoriFormData.icon);

    const result = await createKategori(form);
    if (result.success) {
      setShowKategoriModal(false);
      setKategoriFormData({ ad: "", icon: "fas fa-book-open" });
      loadData();
    } else {
      alert(result.error);
    }
  }

  async function handleDeleteKategori(id: string) {
    const kategori = kategoriler.find((k) => k.id === id);
    if (!confirm(`"${kategori?.ad}" kategorisini silmek istiyor musunuz?`))
      return;

    const result = await deleteKategori(id);
    if (result.success) {
      loadData();
    } else {
      alert(result.error);
    }
  }

  function getFilteredDualar() {
    return dualar.filter((dua) => {
      const matchesKategori =
        selectedKategori === "all" || dua.kategoriId === selectedKategori;
      const matchesSearch =
        dua.baslik.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dua.meali.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesKategori && matchesSearch;
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const filteredDualar = getFilteredDualar();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <BookOpen className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dualar Yönetimi
              </h1>
              <p className="text-gray-600">
                {dualar.length} dua, {kategoriler.length} kategori
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowKategoriModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FolderPlus className="h-4 w-4" />
            Kategori Ekle
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Yeni Dua
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Dua ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={selectedKategori}
            onChange={(e) => setSelectedKategori(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="all">Tüm Kategoriler</option>
            {kategoriler.map((kat) => (
              <option key={kat.id} value={kat.id}>
                {kat.ad} ({kat._count?.dualar || 0})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Kategoriler Özet */}
      <div className="flex flex-wrap gap-2">
        {kategoriler.map((kat) => (
          <div
            key={kat.id}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm group"
          >
            <Tag className="h-3 w-3 text-gray-500" />
            <span className="text-gray-700">{kat.ad}</span>
            <span className="text-gray-400">({kat._count?.dualar || 0})</span>
            {(kat._count?.dualar || 0) === 0 && (
              <button
                onClick={() => handleDeleteKategori(kat.id)}
                className="opacity-0 group-hover:opacity-100 p-0.5 text-red-500 hover:text-red-700 transition-opacity"
                title="Kategoriyi sil"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Dua List */}
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
        {filteredDualar.map((dua, index) => (
          <div
            key={dua.id}
            className={`p-4 hover:bg-gray-50 ${
              !dua.isActive ? "opacity-60" : ""
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Sıralama Butonları */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => moveItem(index, "up")}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <span className="text-xs text-gray-400 text-center">
                  {index + 1}
                </span>
                <button
                  onClick={() => moveItem(index, "down")}
                  disabled={index === filteredDualar.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              {/* İçerik */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900">{dua.baslik}</h3>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs">
                    {dua.kategori.ad}
                  </span>
                  {!dua.isActive && (
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">
                      Pasif
                    </span>
                  )}
                </div>
                {dua.altBaslik && (
                  <p className="text-sm text-gray-500 mb-2">{dua.altBaslik}</p>
                )}
                <p
                  className="text-sm text-gray-600 line-clamp-1 font-arabic"
                  dir="rtl"
                >
                  {dua.arapca.substring(0, 100)}...
                </p>
                {dua.kaynak && (
                  <p className="text-xs text-gray-400 mt-1">
                    Kaynak: {dua.kaynak}
                  </p>
                )}
              </div>

              {/* Aksiyonlar */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleActive(dua.id, dua.isActive)}
                  className={`p-2 rounded-lg transition-colors ${
                    dua.isActive
                      ? "text-emerald-600 hover:bg-emerald-50"
                      : "text-gray-400 hover:bg-gray-100"
                  }`}
                  title={dua.isActive ? "Pasif yap" : "Aktif yap"}
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={() => openEditModal(dua)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(dua.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredDualar.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {searchTerm || selectedKategori !== "all"
              ? "Filtrelerinize uygun dua bulunamadı"
              : "Henüz dua eklenmemiş"}
          </div>
        )}
      </div>

      {/* Dua Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingDua ? "Duayı Düzenle" : "Yeni Dua Ekle"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Başlık *
                  </label>
                  <input
                    type="text"
                    value={formData.baslik}
                    onChange={(e) =>
                      setFormData({ ...formData, baslik: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori *
                  </label>
                  <select
                    value={formData.kategoriId}
                    onChange={(e) =>
                      setFormData({ ...formData, kategoriId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  >
                    <option value="">Kategori Seçin</option>
                    {kategoriler.map((kat) => (
                      <option key={kat.id} value={kat.id}>
                        {kat.ad}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alt Başlık
                </label>
                <input
                  type="text"
                  value={formData.altBaslik}
                  onChange={(e) =>
                    setFormData({ ...formData, altBaslik: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Opsiyonel"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Arapça Metin *
                </label>
                <textarea
                  value={formData.arapca}
                  onChange={(e) =>
                    setFormData({ ...formData, arapca: e.target.value })
                  }
                  rows={4}
                  dir="rtl"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary font-arabic text-xl leading-loose"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Okunuşu *
                </label>
                <textarea
                  value={formData.okunusu}
                  onChange={(e) =>
                    setFormData({ ...formData, okunusu: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Latin harflerle okunuşu"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Türkçe Meali *
                </label>
                <textarea
                  value={formData.meali}
                  onChange={(e) =>
                    setFormData({ ...formData, meali: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kaynak
                  </label>
                  <input
                    type="text"
                    value={formData.kaynak}
                    onChange={(e) =>
                      setFormData({ ...formData, kaynak: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Örn: Buhari, Hac, 26"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ses Dosyası URL
                  </label>
                  <input
                    type="url"
                    value={formData.sesUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, sesUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {editingDua && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">
                    Aktif
                  </label>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {editingDua ? "Güncelle" : "Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Kategori Modal */}
      {showKategoriModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Yeni Kategori Ekle
              </h2>
              <button
                onClick={() => setShowKategoriModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleKategoriSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori Adı *
                </label>
                <input
                  type="text"
                  value={kategoriFormData.ad}
                  onChange={(e) =>
                    setKategoriFormData({
                      ...kategoriFormData,
                      ad: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Örn: Tavaf Duaları"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  İkon (FontAwesome class)
                </label>
                <input
                  type="text"
                  value={kategoriFormData.icon}
                  onChange={(e) =>
                    setKategoriFormData({
                      ...kategoriFormData,
                      icon: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="fas fa-book-open"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowKategoriModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        .font-arabic {
          font-family: "Amiri", "Traditional Arabic", "Scheherazade New", serif;
        }
      `}</style>
    </div>
  );
}
