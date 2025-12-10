"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  MapPin,
  Search,
  X,
  Check,
  Building,
  Mountain,
} from "lucide-react";
import { ZiyaretSehir } from "@prisma/client";
import {
  getZiyaretYerleri,
  createZiyaretYeri,
  updateZiyaretYeri,
  deleteZiyaretYeri,
  toggleZiyaretYeriActive,
} from "./actions";

interface ZiyaretYeri {
  id: string;
  slug: string;
  baslik: string;
  altBaslik: string | null;
  sehir: ZiyaretSehir;
  kategori: string;
  lat: number | null;
  lng: number | null;
  adres: string | null;
  aciklama: string | null;
  ibadethane: boolean;
  ziyaretSaatleri: string | null;
  girisUcreti: string | null;
  resimUrl: string | null;
  icon: string;
  order: number;
  isActive: boolean;
}

const SEHIR_LABELS: Record<ZiyaretSehir, string> = {
  MEKKE: "Mekke",
  MEDINE: "Medine",
};

const KATEGORI_OPTIONS = ["mescid", "magara", "dag", "kuyu", "tarih"];

export default function ZiyaretYerleriPage() {
  const [yerler, setYerler] = useState<ZiyaretYeri[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingYer, setEditingYer] = useState<ZiyaretYeri | null>(null);
  const [selectedSehir, setSelectedSehir] = useState<ZiyaretSehir | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    slug: "",
    baslik: "",
    altBaslik: "",
    sehir: "MEKKE" as ZiyaretSehir,
    kategori: "mescid",
    lat: "",
    lng: "",
    adres: "",
    aciklama: "",
    ibadethane: false,
    ziyaretSaatleri: "",
    girisUcreti: "",
    resimUrl: "",
    icon: "fas fa-mosque",
    isActive: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const result = await getZiyaretYerleri();
    if (result.success && result.data) {
      setYerler(result.data as ZiyaretYeri[]);
    }
    setLoading(false);
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

  function openCreateModal() {
    setEditingYer(null);
    setFormData({
      slug: "",
      baslik: "",
      altBaslik: "",
      sehir: "MEKKE",
      kategori: "mescid",
      lat: "",
      lng: "",
      adres: "",
      aciklama: "",
      ibadethane: false,
      ziyaretSaatleri: "",
      girisUcreti: "",
      resimUrl: "",
      icon: "fas fa-mosque",
      isActive: true,
    });
    setShowModal(true);
  }

  function openEditModal(yer: ZiyaretYeri) {
    setEditingYer(yer);
    setFormData({
      slug: yer.slug,
      baslik: yer.baslik,
      altBaslik: yer.altBaslik || "",
      sehir: yer.sehir,
      kategori: yer.kategori,
      lat: yer.lat?.toString() || "",
      lng: yer.lng?.toString() || "",
      adres: yer.adres || "",
      aciklama: yer.aciklama || "",
      ibadethane: yer.ibadethane,
      ziyaretSaatleri: yer.ziyaretSaatleri || "",
      girisUcreti: yer.girisUcreti || "",
      resimUrl: yer.resimUrl || "",
      icon: yer.icon,
      isActive: yer.isActive,
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, String(value));
    });

    const result = editingYer
      ? await updateZiyaretYeri(editingYer.id, form)
      : await createZiyaretYeri(form);

    if (result.success) {
      setShowModal(false);
      loadData();
    } else {
      alert(result.error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu yeri silmek istediğinizden emin misiniz?")) return;
    const result = await deleteZiyaretYeri(id);
    if (result.success) {
      loadData();
    } else {
      alert(result.error);
    }
  }

  async function handleToggleActive(id: string, currentState: boolean) {
    const result = await toggleZiyaretYeriActive(id, !currentState);
    if (result.success) {
      loadData();
    }
  }

  function getFilteredYerler() {
    return yerler.filter((y) => {
      const matchesSehir = selectedSehir === "all" || y.sehir === selectedSehir;
      const matchesSearch =
        y.baslik.toLowerCase().includes(searchTerm.toLowerCase()) ||
        y.altBaslik?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSehir && matchesSearch;
    });
  }

  const sehirCounts = yerler.reduce((acc, y) => {
    acc[y.sehir] = (acc[y.sehir] || 0) + 1;
    return acc;
  }, {} as Record<ZiyaretSehir, number>);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const filteredYerler = getFilteredYerler();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <MapPin className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Ziyaret Yerleri Yönetimi
              </h1>
              <p className="text-gray-600">
                {yerler.length} yer (Mekke: {sehirCounts.MEKKE || 0}, Medine: {sehirCounts.MEDINE || 0})
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Yeni Yer
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedSehir("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedSehir === "all"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Tümü ({yerler.length})
        </button>
        <button
          onClick={() => setSelectedSehir("MEKKE")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedSehir === "MEKKE"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Building className="h-4 w-4" />
          Mekke ({sehirCounts.MEKKE || 0})
        </button>
        <button
          onClick={() => setSelectedSehir("MEDINE")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedSehir === "MEDINE"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Mountain className="h-4 w-4" />
          Medine ({sehirCounts.MEDINE || 0})
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Yer ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
        {filteredYerler.map((yer) => (
          <div
            key={yer.id}
            className={`p-4 hover:bg-gray-50 ${!yer.isActive ? "opacity-60" : ""}`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-medium text-gray-900">{yer.baslik}</h3>
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${
                      yer.sehir === "MEKKE"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {SEHIR_LABELS[yer.sehir]}
                  </span>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                    {yer.kategori}
                  </span>
                  {yer.ibadethane && (
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                      İbadethane
                    </span>
                  )}
                  {!yer.isActive && (
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">
                      Pasif
                    </span>
                  )}
                </div>
                {yer.altBaslik && (
                  <p className="text-sm text-gray-500 mb-1">{yer.altBaslik}</p>
                )}
                <p className="text-xs text-gray-400">
                  {yer.adres && `${yer.adres} | `}
                  {yer.lat && yer.lng && `Koordinat: ${yer.lat}, ${yer.lng}`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleActive(yer.id, yer.isActive)}
                  className={`p-2 rounded-lg transition-colors ${
                    yer.isActive
                      ? "text-emerald-600 hover:bg-emerald-50"
                      : "text-gray-400 hover:bg-gray-100"
                  }`}
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={() => openEditModal(yer)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(yer.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredYerler.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {searchTerm || selectedSehir !== "all"
              ? "Filtrelerinize uygun yer bulunamadı"
              : "Henüz ziyaret yeri eklenmemiş"}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingYer ? "Yeri Düzenle" : "Yeni Yer Ekle"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Başlık *</label>
                  <input
                    type="text"
                    value={formData.baslik}
                    onChange={(e) => setFormData({
                      ...formData,
                      baslik: e.target.value,
                      slug: editingYer ? formData.slug : generateSlug(e.target.value),
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alt Başlık</label>
                <input
                  type="text"
                  value={formData.altBaslik}
                  onChange={(e) => setFormData({ ...formData, altBaslik: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Şehir *</label>
                  <select
                    value={formData.sehir}
                    onChange={(e) => setFormData({ ...formData, sehir: e.target.value as ZiyaretSehir })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  >
                    <option value="MEKKE">Mekke</option>
                    <option value="MEDINE">Medine</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {KATEGORI_OPTIONS.map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enlem (Lat)</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="21.4225"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Boylam (Lng)</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.lng}
                    onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="39.8262"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                <input
                  type="text"
                  value={formData.adres}
                  onChange={(e) => setFormData({ ...formData, adres: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                <textarea
                  value={formData.aciklama}
                  onChange={(e) => setFormData({ ...formData, aciklama: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ziyaret Saatleri</label>
                  <input
                    type="text"
                    value={formData.ziyaretSaatleri}
                    onChange={(e) => setFormData({ ...formData, ziyaretSaatleri: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="7/24 açık"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giriş Ücreti</label>
                  <input
                    type="text"
                    value={formData.girisUcreti}
                    onChange={(e) => setFormData({ ...formData, girisUcreti: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Ücretsiz"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.ibadethane}
                    onChange={(e) => setFormData({ ...formData, ibadethane: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">İbadethane</span>
                </label>
                {editingYer && (
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">Aktif</span>
                  </label>
                )}
              </div>

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
                  {editingYer ? "Güncelle" : "Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
