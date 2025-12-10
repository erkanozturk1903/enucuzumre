"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, CheckSquare, Search, X, Check, AlertCircle } from "lucide-react";
import { GorevOncelik } from "@prisma/client";
import {
  getKategoriler,
  getGorevler,
  createKategori,
  deleteKategori,
  createGorev,
  updateGorev,
  deleteGorev,
  toggleGorevActive,
} from "./actions";

interface Kategori {
  id: string;
  slug: string;
  baslik: string;
  icon: string;
  renk: string;
  order: number;
  _count: { gorevler: number };
}

interface Gorev {
  id: string;
  slug: string;
  baslik: string;
  aciklama: string | null;
  oncelik: GorevOncelik;
  kategoriId: string;
  kategori: { baslik: string; renk: string };
  order: number;
  isActive: boolean;
}

const ONCELIK_LABELS: Record<GorevOncelik, string> = { YUKSEK: "Yüksek", ORTA: "Orta", DUSUK: "Düşük" };
const ONCELIK_COLORS: Record<GorevOncelik, string> = {
  YUKSEK: "bg-red-100 text-red-700",
  ORTA: "bg-yellow-100 text-yellow-700",
  DUSUK: "bg-green-100 text-green-700",
};

export default function YapilacaklarPage() {
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);
  const [gorevler, setGorevler] = useState<Gorev[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showKategoriModal, setShowKategoriModal] = useState(false);
  const [editingGorev, setEditingGorev] = useState<Gorev | null>(null);
  const [selectedKategori, setSelectedKategori] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    slug: "", baslik: "", aciklama: "", oncelik: "ORTA" as GorevOncelik, kategoriId: "", isActive: true,
  });

  const [kategoriForm, setKategoriForm] = useState({ slug: "", baslik: "", icon: "fas fa-list", renk: "blue" });

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const [katResult, gorevResult] = await Promise.all([getKategoriler(), getGorevler()]);
    if (katResult.success) setKategoriler(katResult.data as Kategori[]);
    if (gorevResult.success) setGorevler(gorevResult.data as Gorev[]);
    setLoading(false);
  }

  function generateSlug(baslik: string) {
    return baslik.toLowerCase().replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function openCreateModal() {
    setEditingGorev(null);
    setFormData({ slug: "", baslik: "", aciklama: "", oncelik: "ORTA", kategoriId: kategoriler[0]?.id || "", isActive: true });
    setShowModal(true);
  }

  function openEditModal(gorev: Gorev) {
    setEditingGorev(gorev);
    setFormData({ slug: gorev.slug, baslik: gorev.baslik, aciklama: gorev.aciklama || "", oncelik: gorev.oncelik, kategoriId: gorev.kategoriId, isActive: gorev.isActive });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = new FormData();
    Object.entries(formData).forEach(([k, v]) => form.append(k, String(v)));
    const result = editingGorev ? await updateGorev(editingGorev.id, form) : await createGorev(form);
    if (result.success) { setShowModal(false); loadData(); } else alert(result.error);
  }

  async function handleKategoriSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = new FormData();
    Object.entries(kategoriForm).forEach(([k, v]) => form.append(k, v));
    const result = await createKategori(form);
    if (result.success) { setShowKategoriModal(false); setKategoriForm({ slug: "", baslik: "", icon: "fas fa-list", renk: "blue" }); loadData(); } else alert(result.error);
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu görevi silmek istediğinizden emin misiniz?")) return;
    const result = await deleteGorev(id);
    if (result.success) loadData(); else alert(result.error);
  }

  async function handleDeleteKategori(id: string) {
    if (!confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")) return;
    const result = await deleteKategori(id);
    if (result.success) loadData(); else alert(result.error);
  }

  async function handleToggleActive(id: string, current: boolean) {
    const result = await toggleGorevActive(id, !current);
    if (result.success) loadData();
  }

  const filteredGorevler = gorevler.filter((g) => {
    const matchesKat = selectedKategori === "all" || g.kategoriId === selectedKategori;
    const matchesSearch = g.baslik.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesKat && matchesSearch;
  });

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-50 rounded-lg"><CheckSquare className="h-6 w-6 text-orange-600" /></div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Yapılacaklar Yönetimi</h1>
            <p className="text-gray-600">{gorevler.length} görev, {kategoriler.length} kategori</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowKategoriModal(true)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"><Plus className="h-4 w-4" />Kategori</button>
          <button onClick={openCreateModal} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"><Plus className="h-5 w-5" />Yeni Görev</button>
        </div>
      </div>

      {/* Kategori Badges */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setSelectedKategori("all")} className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedKategori === "all" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>Tümü ({gorevler.length})</button>
        {kategoriler.map((k) => (
          <div key={k.id} className="flex items-center gap-1">
            <button onClick={() => setSelectedKategori(k.id)} className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedKategori === k.id ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>{k.baslik} ({k._count.gorevler})</button>
            {k._count.gorevler === 0 && <button onClick={() => handleDeleteKategori(k.id)} className="p-1 text-red-500 hover:bg-red-50 rounded"><X className="h-3 w-3" /></button>}
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input type="text" placeholder="Görev ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary" />
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
        {filteredGorevler.map((gorev) => (
          <div key={gorev.id} className={`p-4 hover:bg-gray-50 ${!gorev.isActive ? "opacity-60" : ""}`}>
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-medium text-gray-900">{gorev.baslik}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs ${ONCELIK_COLORS[gorev.oncelik]}`}>{ONCELIK_LABELS[gorev.oncelik]}</span>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{gorev.kategori.baslik}</span>
                  {!gorev.isActive && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">Pasif</span>}
                </div>
                {gorev.aciklama && <p className="text-sm text-gray-500">{gorev.aciklama}</p>}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleToggleActive(gorev.id, gorev.isActive)} className={`p-2 rounded-lg ${gorev.isActive ? "text-emerald-600 hover:bg-emerald-50" : "text-gray-400 hover:bg-gray-100"}`}><Check className="h-4 w-4" /></button>
                <button onClick={() => openEditModal(gorev)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(gorev.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {filteredGorevler.length === 0 && <div className="text-center py-12 text-gray-500">{searchTerm || selectedKategori !== "all" ? "Filtrelerinize uygun görev bulunamadı" : "Henüz görev eklenmemiş"}</div>}
      </div>

      {/* Görev Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold">{editingGorev ? "Görevi Düzenle" : "Yeni Görev"}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Başlık *</label>
                <input type="text" value={formData.baslik} onChange={(e) => setFormData({ ...formData, baslik: e.target.value, slug: editingGorev ? formData.slug : generateSlug(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                <textarea value={formData.aciklama} onChange={(e) => setFormData({ ...formData, aciklama: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                  <select value={formData.kategoriId} onChange={(e) => setFormData({ ...formData, kategoriId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required>
                    {kategoriler.map((k) => <option key={k.id} value={k.id}>{k.baslik}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Öncelik</label>
                  <select value={formData.oncelik} onChange={(e) => setFormData({ ...formData, oncelik: e.target.value as GorevOncelik })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="YUKSEK">Yüksek</option>
                    <option value="ORTA">Orta</option>
                    <option value="DUSUK">Düşük</option>
                  </select>
                </div>
              </div>
              {editingGorev && (
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="rounded border-gray-300" />
                  <span className="text-sm text-gray-700">Aktif</span>
                </label>
              )}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">İptal</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">{editingGorev ? "Güncelle" : "Kaydet"}</button>
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
              <h2 className="text-xl font-bold">Yeni Kategori</h2>
              <button onClick={() => setShowKategoriModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleKategoriSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Başlık *</label>
                <input type="text" value={kategoriForm.baslik} onChange={(e) => setKategoriForm({ ...kategoriForm, baslik: e.target.value, slug: generateSlug(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                <input type="text" value={kategoriForm.slug} onChange={(e) => setKategoriForm({ ...kategoriForm, slug: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">İkon</label>
                  <input type="text" value={kategoriForm.icon} onChange={(e) => setKategoriForm({ ...kategoriForm, icon: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Renk</label>
                  <input type="text" value={kategoriForm.renk} onChange={(e) => setKategoriForm({ ...kategoriForm, renk: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowKategoriModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">İptal</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
