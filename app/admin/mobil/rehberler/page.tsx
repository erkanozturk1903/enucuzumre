"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  Map,
  Search,
  Filter,
  X,
  Check,
  BookOpen,
  Shirt,
  RotateCw,
  Footprints,
  Star,
} from "lucide-react";
import { RehberBolum } from "@prisma/client";
import {
  getRehberler,
  createRehber,
  updateRehber,
  deleteRehber,
  reorderRehberler,
  toggleRehberActive,
} from "./actions";

interface Rehber {
  id: string;
  slug: string;
  baslik: string;
  altBaslik: string | null;
  bolum: RehberBolum;
  kategori: string;
  icon: string;
  renk: string;
  icerik: Record<string, any>;
  order: number;
  isActive: boolean;
}

const BOLUM_LABELS: Record<RehberBolum, string> = {
  UMRE: "Umre",
  IHRAM: "İhram",
  TAVAF: "Tavaf",
  SAY: "Sa'y",
  HAC: "Hac",
};

const BOLUM_ICONS: Record<RehberBolum, React.ElementType> = {
  UMRE: Star,
  IHRAM: Shirt,
  TAVAF: RotateCw,
  SAY: Footprints,
  HAC: BookOpen,
};

const BOLUM_COLORS: Record<RehberBolum, string> = {
  UMRE: "bg-emerald-100 text-emerald-700",
  IHRAM: "bg-yellow-100 text-yellow-700",
  TAVAF: "bg-indigo-100 text-indigo-700",
  SAY: "bg-orange-100 text-orange-700",
  HAC: "bg-purple-100 text-purple-700",
};

const KATEGORI_OPTIONS = [
  "temel-bilgiler",
  "fazileti",
  "zaman",
  "hazirlik",
  "uygulama",
  "kurallar",
  "dua",
  "bilgi",
];

const RENK_OPTIONS = [
  "gradient",
  "blue",
  "purple",
  "orange",
  "yellow",
  "red",
  "teal",
  "indigo",
  "dark",
];

export default function RehberlerPage() {
  const [rehberler, setRehberler] = useState<Rehber[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRehber, setEditingRehber] = useState<Rehber | null>(null);
  const [selectedBolum, setSelectedBolum] = useState<RehberBolum | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    slug: "",
    baslik: "",
    altBaslik: "",
    bolum: "UMRE" as RehberBolum,
    kategori: "temel-bilgiler",
    icon: "fas fa-book",
    renk: "gradient",
    icerik: "{}",
    isActive: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const result = await getRehberler();
    if (result.success && result.data) {
      setRehberler(result.data as Rehber[]);
    }
    setLoading(false);
  }

  function openCreateModal() {
    setEditingRehber(null);
    setFormData({
      slug: "",
      baslik: "",
      altBaslik: "",
      bolum: "UMRE",
      kategori: "temel-bilgiler",
      icon: "fas fa-book",
      renk: "gradient",
      icerik: JSON.stringify({ giris: "" }, null, 2),
      isActive: true,
    });
    setShowModal(true);
  }

  function openEditModal(rehber: Rehber) {
    setEditingRehber(rehber);
    setFormData({
      slug: rehber.slug,
      baslik: rehber.baslik,
      altBaslik: rehber.altBaslik || "",
      bolum: rehber.bolum,
      kategori: rehber.kategori,
      icon: rehber.icon,
      renk: rehber.renk,
      icerik: JSON.stringify(rehber.icerik, null, 2),
      isActive: rehber.isActive,
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, String(value));
    });

    const result = editingRehber
      ? await updateRehber(editingRehber.id, form)
      : await createRehber(form);

    if (result.success) {
      setShowModal(false);
      loadData();
    } else {
      alert(result.error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu rehberi silmek istediğinizden emin misiniz?")) return;
    const result = await deleteRehber(id);
    if (result.success) {
      loadData();
    } else {
      alert(result.error);
    }
  }

  async function handleToggleActive(id: string, currentState: boolean) {
    const result = await toggleRehberActive(id, !currentState);
    if (result.success) {
      loadData();
    }
  }

  async function moveItem(index: number, direction: "up" | "down") {
    const filteredRehberler = getFilteredRehberler();
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= filteredRehberler.length) return;

    const newRehberler = [...filteredRehberler];
    [newRehberler[index], newRehberler[newIndex]] = [
      newRehberler[newIndex],
      newRehberler[index],
    ];

    const updates = newRehberler.map((r, i) => ({ id: r.id, order: i }));
    await reorderRehberler(updates);
    loadData();
  }

  function getFilteredRehberler() {
    return rehberler.filter((r) => {
      const matchesBolum = selectedBolum === "all" || r.bolum === selectedBolum;
      const matchesSearch =
        r.baslik.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.altBaslik?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesBolum && matchesSearch;
    });
  }

  function generateSlug(baslik: string) {
    return baslik
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  // Bölüm sayıları
  const bolumCounts = rehberler.reduce((acc, r) => {
    acc[r.bolum] = (acc[r.bolum] || 0) + 1;
    return acc;
  }, {} as Record<RehberBolum, number>);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const filteredRehberler = getFilteredRehberler();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Map className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Rehberler Yönetimi
              </h1>
              <p className="text-gray-600">
                {rehberler.length} rehber, 5 bölüm
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Yeni Rehber
        </button>
      </div>

      {/* Bölüm Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedBolum("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedBolum === "all"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Tümü ({rehberler.length})
        </button>
        {(Object.keys(BOLUM_LABELS) as RehberBolum[]).map((bolum) => {
          const Icon = BOLUM_ICONS[bolum];
          return (
            <button
              key={bolum}
              onClick={() => setSelectedBolum(bolum)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedBolum === bolum
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Icon className="h-4 w-4" />
              {BOLUM_LABELS[bolum]} ({bolumCounts[bolum] || 0})
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Rehber ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      {/* Rehber List */}
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
        {filteredRehberler.map((rehber, index) => {
          const Icon = BOLUM_ICONS[rehber.bolum];
          return (
            <div
              key={rehber.id}
              className={`p-4 hover:bg-gray-50 ${
                !rehber.isActive ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Sıralama */}
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
                    disabled={index === filteredRehberler.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>

                {/* İçerik */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-medium text-gray-900">{rehber.baslik}</h3>
                    <span
                      className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
                        BOLUM_COLORS[rehber.bolum]
                      }`}
                    >
                      <Icon className="h-3 w-3" />
                      {BOLUM_LABELS[rehber.bolum]}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                      {rehber.kategori}
                    </span>
                    {!rehber.isActive && (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">
                        Pasif
                      </span>
                    )}
                  </div>
                  {rehber.altBaslik && (
                    <p className="text-sm text-gray-500 mb-1">{rehber.altBaslik}</p>
                  )}
                  <p className="text-xs text-gray-400">
                    Slug: {rehber.slug} | İçerik: {Object.keys(rehber.icerik).length} alan
                  </p>
                </div>

                {/* Aksiyonlar */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(rehber.id, rehber.isActive)}
                    className={`p-2 rounded-lg transition-colors ${
                      rehber.isActive
                        ? "text-emerald-600 hover:bg-emerald-50"
                        : "text-gray-400 hover:bg-gray-100"
                    }`}
                    title={rehber.isActive ? "Pasif yap" : "Aktif yap"}
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => openEditModal(rehber)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(rehber.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredRehberler.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {searchTerm || selectedBolum !== "all"
              ? "Filtrelerinize uygun rehber bulunamadı"
              : "Henüz rehber eklenmemiş"}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingRehber ? "Rehberi Düzenle" : "Yeni Rehber Ekle"}
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
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        baslik: e.target.value,
                        slug: editingRehber ? formData.slug : generateSlug(e.target.value),
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  />
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
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bölüm *
                  </label>
                  <select
                    value={formData.bolum}
                    onChange={(e) =>
                      setFormData({ ...formData, bolum: e.target.value as RehberBolum })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  >
                    {(Object.keys(BOLUM_LABELS) as RehberBolum[]).map((b) => (
                      <option key={b} value={b}>
                        {BOLUM_LABELS[b]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={formData.kategori}
                    onChange={(e) =>
                      setFormData({ ...formData, kategori: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {KATEGORI_OPTIONS.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    İkon (FontAwesome)
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="fas fa-book"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Renk
                  </label>
                  <select
                    value={formData.renk}
                    onChange={(e) =>
                      setFormData({ ...formData, renk: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {RENK_OPTIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  İçerik (JSON) *
                </label>
                <textarea
                  value={formData.icerik}
                  onChange={(e) =>
                    setFormData({ ...formData, icerik: e.target.value })
                  }
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-sm"
                  placeholder='{"giris": "...", "tanim": "...", "adimlar": [...]}'
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  JSON formatında içerik girin. Örnek alanlar: giris, tanim, rukun, adimlar, hadisler, faziletler
                </p>
              </div>

              {editingRehber && (
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
                  {editingRehber ? "Güncelle" : "Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
