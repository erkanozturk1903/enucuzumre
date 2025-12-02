"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, FileText, Shield, Award, Building } from "lucide-react";
import { getCertificates, createCertificate, updateCertificate, deleteCertificate } from "./actions";

interface Certificate {
  id: string;
  title: string;
  number: string;
  description: string | null;
  icon: string;
  order: number;
  isActive: boolean;
}

const ICONS = [
  { name: "FileText", label: "Dosya", component: FileText },
  { name: "Shield", label: "Kalkan", component: Shield },
  { name: "Award", label: "Ödül", component: Award },
  { name: "Building", label: "Bina", component: Building },
];

export default function BelgelerAdminPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    number: "",
    description: "",
    icon: "FileText",
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    loadCertificates();
  }, []);

  async function loadCertificates() {
    const result = await getCertificates();
    if (result.success && result.data) {
      setCertificates(result.data as Certificate[]);
    }
    setLoading(false);
  }

  function openCreateModal() {
    setEditingCert(null);
    setFormData({
      title: "",
      number: "",
      description: "",
      icon: "FileText",
      order: certificates.length,
      isActive: true,
    });
    setShowModal(true);
  }

  function openEditModal(cert: Certificate) {
    setEditingCert(cert);
    setFormData({
      title: cert.title,
      number: cert.number,
      description: cert.description || "",
      icon: cert.icon,
      order: cert.order,
      isActive: cert.isActive,
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, String(value));
    });

    const result = editingCert
      ? await updateCertificate(editingCert.id, form)
      : await createCertificate(form);

    if (result.success) {
      setShowModal(false);
      loadCertificates();
    } else {
      alert(result.error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu belgeyi silmek istediğinizden emin misiniz?")) return;
    const result = await deleteCertificate(id);
    if (result.success) {
      loadCertificates();
    }
  }

  function getIcon(iconName: string) {
    const icon = ICONS.find((i) => i.name === iconName);
    return icon ? icon.component : FileText;
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
          <h1 className="text-2xl font-bold text-gray-900">Belgeler Yönetimi</h1>
          <p className="text-gray-600 mt-1">Şirket belgelerini yönetin (TÜRSAB, Ticaret Sicil vb.)</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Yeni Belge
        </button>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {certificates.map((cert) => {
          const IconComponent = getIcon(cert.icon);
          return (
            <div
              key={cert.id}
              className={`bg-white rounded-xl border p-6 ${
                cert.isActive ? "border-gray-200" : "border-yellow-300 bg-yellow-50"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>
                {!cert.isActive && (
                  <span className="px-2 py-0.5 bg-yellow-200 text-yellow-800 rounded text-xs">
                    Pasif
                  </span>
                )}
              </div>

              <h3 className="font-semibold text-gray-900 mb-1">{cert.title}</h3>
              <p className="text-primary font-mono text-sm mb-2">{cert.number}</p>
              {cert.description && (
                <p className="text-sm text-gray-600">{cert.description}</p>
              )}

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => openEditModal(cert)}
                  className="flex-1 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(cert.id)}
                  className="flex-1 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                >
                  Sil
                </button>
              </div>
            </div>
          );
        })}

        {certificates.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200">
            Henüz belge eklenmemiş
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingCert ? "Belgeyi Düzenle" : "Yeni Belge Ekle"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Belge Adı *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="TÜRSAB Yetki Belgesi"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Belge Numarası *</label>
                <input
                  type="text"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  placeholder="A-12345"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  placeholder="Belge hakkında kısa açıklama..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">İkon</label>
                <div className="flex gap-2">
                  {ICONS.map((icon) => {
                    const IconComp = icon.component;
                    return (
                      <button
                        key={icon.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: icon.name })}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          formData.icon === icon.name
                            ? "border-primary bg-primary/10"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <IconComp className="h-5 w-5" />
                      </button>
                    );
                  })}
                </div>
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
                  {editingCert ? "Güncelle" : "Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
