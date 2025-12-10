"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, HelpCircle, Search, X, Check } from "lucide-react";
import { getMobilSSSler, createMobilSSS, updateMobilSSS, deleteMobilSSS, toggleMobilSSSActive } from "./actions";

interface MobilSSS {
  id: string;
  slug: string;
  soru: string;
  cevap: Record<string, any>;
  kategori: string;
  icon: string;
  order: number;
  isActive: boolean;
}

export default function MobilSSSPage() {
  const [sssler, setSssler] = useState<MobilSSS[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSSS, setEditingSSS] = useState<MobilSSS | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    slug: "", soru: "", cevap: "", kategori: "genel", icon: "fas fa-question-circle", isActive: true,
  });

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const result = await getMobilSSSler();
    if (result.success) setSssler(result.data as MobilSSS[]);
    setLoading(false);
  }

  function generateSlug(soru: string) {
    return soru.toLowerCase().replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50);
  }

  function openCreateModal() {
    setEditingSSS(null);
    setFormData({
      slug: "",
      soru: "",
      cevap: JSON.stringify({ kisim1: "", kisim2: { baslik: "", icerik: "", tip: "panel" }, kisim3: { baslik: "", liste: [] } }, null, 2),
      kategori: "genel",
      icon: "fas fa-question-circle",
      isActive: true,
    });
    setShowModal(true);
  }

  function openEditModal(sss: MobilSSS) {
    setEditingSSS(sss);
    setFormData({
      slug: sss.slug,
      soru: sss.soru,
      cevap: JSON.stringify(sss.cevap, null, 2),
      kategori: sss.kategori,
      icon: sss.icon,
      isActive: sss.isActive,
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = new FormData();
    Object.entries(formData).forEach(([k, v]) => form.append(k, String(v)));
    const result = editingSSS ? await updateMobilSSS(editingSSS.id, form) : await createMobilSSS(form);
    if (result.success) { setShowModal(false); loadData(); } else alert(result.error);
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu SSS'i silmek istediğinizden emin misiniz?")) return;
    const result = await deleteMobilSSS(id);
    if (result.success) loadData(); else alert(result.error);
  }

  async function handleToggleActive(id: string, current: boolean) {
    const result = await toggleMobilSSSActive(id, !current);
    if (result.success) loadData();
  }

  const filteredSSSler = sssler.filter((s) => s.soru.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg"><HelpCircle className="h-6 w-6 text-indigo-600" /></div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mobil SSS Yönetimi</h1>
            <p className="text-gray-600">{sssler.length} soru</p>
          </div>
        </div>
        <button onClick={openCreateModal} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          <Plus className="h-5 w-5" />Yeni SSS
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input type="text" placeholder="Soru ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
        {filteredSSSler.map((sss) => (
          <div key={sss.id} className={`p-4 hover:bg-gray-50 ${!sss.isActive ? "opacity-60" : ""}`}>
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900">{sss.soru}</h3>
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs">{sss.kategori}</span>
                  {!sss.isActive && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">Pasif</span>}
                </div>
                <p className="text-sm text-gray-500 truncate">{sss.cevap.kisim1 || "Cevap içeriği..."}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleToggleActive(sss.id, sss.isActive)} className={`p-2 rounded-lg ${sss.isActive ? "text-emerald-600 hover:bg-emerald-50" : "text-gray-400 hover:bg-gray-100"}`}><Check className="h-4 w-4" /></button>
                <button onClick={() => openEditModal(sss)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(sss.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {filteredSSSler.length === 0 && <div className="text-center py-12 text-gray-500">{searchTerm ? "Aramanıza uygun SSS bulunamadı" : "Henüz SSS eklenmemiş"}</div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold">{editingSSS ? "SSS Düzenle" : "Yeni SSS"}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Soru *</label>
                <input type="text" value={formData.soru} onChange={(e) => setFormData({ ...formData, soru: e.target.value, slug: editingSSS ? formData.slug : generateSlug(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <input type="text" value={formData.kategori} onChange={(e) => setFormData({ ...formData, kategori: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="genel" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">İkon</label>
                  <input type="text" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cevap (JSON) *</label>
                <textarea value={formData.cevap} onChange={(e) => setFormData({ ...formData, cevap: e.target.value })} rows={12} className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm" required />
                <p className="text-xs text-gray-500 mt-1">JSON formatında: kisim1 (metin), kisim2 (panel), kisim3 (liste veya alt_basliklar)</p>
              </div>
              {editingSSS && (
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="rounded border-gray-300" />
                  <span className="text-sm text-gray-700">Aktif</span>
                </label>
              )}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">İptal</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">{editingSSS ? "Güncelle" : "Kaydet"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
