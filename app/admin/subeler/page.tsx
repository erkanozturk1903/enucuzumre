"use client";

import { useState, useEffect } from "react";
import { Plus, MapPin, Phone, Mail, Building2, Award } from "lucide-react";
import { getBranches, createBranch, updateBranch, deleteBranch } from "./actions";

interface Branch {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string | null;
  tursabNo: string | null;
  tursabOwner: string | null;
  mapUrl: string | null;
  workingHours: string | null;
  image: string | null;
  order: number;
  isActive: boolean;
}

export default function SubelerAdminPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    address: "",
    phone: "",
    email: "",
    tursabNo: "",
    tursabOwner: "",
    mapUrl: "",
    workingHours: "",
    image: "",
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    loadBranches();
  }, []);

  async function loadBranches() {
    const result = await getBranches();
    if (result.success && result.data) {
      setBranches(result.data as Branch[]);
    }
    setLoading(false);
  }

  function openCreateModal() {
    setEditingBranch(null);
    setFormData({
      name: "",
      city: "",
      address: "",
      phone: "",
      email: "",
      tursabNo: "",
      tursabOwner: "",
      mapUrl: "",
      workingHours: "",
      image: "",
      order: branches.length,
      isActive: true,
    });
    setShowModal(true);
  }

  function openEditModal(branch: Branch) {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      city: branch.city,
      address: branch.address,
      phone: branch.phone,
      email: branch.email || "",
      tursabNo: branch.tursabNo || "",
      tursabOwner: branch.tursabOwner || "",
      mapUrl: branch.mapUrl || "",
      workingHours: branch.workingHours || "",
      image: branch.image || "",
      order: branch.order,
      isActive: branch.isActive,
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, String(value));
    });

    const result = editingBranch
      ? await updateBranch(editingBranch.id, form)
      : await createBranch(form);

    if (result.success) {
      setShowModal(false);
      loadBranches();
    } else {
      alert(result.error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu şubeyi silmek istediğinizden emin misiniz?")) return;
    const result = await deleteBranch(id);
    if (result.success) {
      loadBranches();
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Şubelerimiz</h1>
          <p className="text-gray-600 mt-1">Şube bilgilerini yönetin</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Yeni Şube
        </button>
      </div>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {branches.map((branch) => (
          <div
            key={branch.id}
            className={`bg-white rounded-xl border p-6 ${
              branch.isActive ? "border-gray-200" : "border-yellow-300 bg-yellow-50"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{branch.name}</h3>
                  <p className="text-sm text-gray-500">{branch.city}</p>
                </div>
              </div>
              {!branch.isActive && (
                <span className="px-2 py-0.5 bg-yellow-200 text-yellow-800 rounded text-xs">
                  Pasif
                </span>
              )}
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600">{branch.address}</p>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-600">{branch.phone}</p>
              </div>

              {branch.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <p className="text-sm text-gray-600">{branch.email}</p>
                </div>
              )}

              {branch.tursabNo && (
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    TÜRSAB No: {branch.tursabNo}
                    {branch.tursabOwner && ` - ${branch.tursabOwner}`}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
              <button
                onClick={() => openEditModal(branch)}
                className="flex-1 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors"
              >
                Düzenle
              </button>
              <button
                onClick={() => handleDelete(branch.id)}
                className="flex-1 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        ))}

        {branches.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200">
            Henüz şube eklenmemiş
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">
                {editingBranch ? "Şubeyi Düzenle" : "Yeni Şube Ekle"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Şube Adı *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="DİYARBAKIR ŞUBE"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Şehir *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Diyarbakır"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adres *</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Diclekent Mah. Diclekent Bulvarı KAYAPINAR DİYARBAKIR"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0412 229 33 28"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="info@linsaturizm.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">TÜRSAB Belge No</label>
                  <input
                    type="text"
                    value={formData.tursabNo}
                    onChange={(e) => setFormData({ ...formData, tursabNo: e.target.value })}
                    placeholder="5640"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">TÜRSAB Belge Sahibi</label>
                  <input
                    type="text"
                    value={formData.tursabOwner}
                    onChange={(e) => setFormData({ ...formData, tursabOwner: e.target.value })}
                    placeholder="ARLİNSA TURİZM"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Çalışma Saatleri</label>
                <input
                  type="text"
                  value={formData.workingHours}
                  onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                  placeholder="Pzt - Cmt: 09:00 - 18:00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Embed URL</label>
                <input
                  type="text"
                  value={formData.mapUrl}
                  onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <p className="text-xs text-gray-500 mt-1">Google Maps'ten "Paylaş" → "Haritayı yerleştir" → iframe src URL'sini kopyalayın</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Görsel URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  Aktif
                </label>
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
                  {editingBranch ? "Güncelle" : "Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
