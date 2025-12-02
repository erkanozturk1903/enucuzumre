"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { getFAQs, createFAQ, updateFAQ, deleteFAQ, reorderFAQs } from "./actions";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

export default function SSSAdminPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    loadFAQs();
  }, []);

  async function loadFAQs() {
    const result = await getFAQs();
    if (result.success && result.data) {
      setFaqs(result.data as FAQ[]);
    }
    setLoading(false);
  }

  function openCreateModal() {
    setEditingFAQ(null);
    setFormData({
      question: "",
      answer: "",
      order: faqs.length,
      isActive: true,
    });
    setShowModal(true);
  }

  function openEditModal(faq: FAQ) {
    setEditingFAQ(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      order: faq.order,
      isActive: faq.isActive,
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = new FormData();
    form.append("question", formData.question);
    form.append("answer", formData.answer);
    form.append("order", String(formData.order));
    form.append("isActive", String(formData.isActive));

    const result = editingFAQ
      ? await updateFAQ(editingFAQ.id, form)
      : await createFAQ(form);

    if (result.success) {
      setShowModal(false);
      loadFAQs();
    } else {
      alert(result.error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu soruyu silmek istediğinizden emin misiniz?")) return;
    const result = await deleteFAQ(id);
    if (result.success) {
      loadFAQs();
    }
  }

  async function moveItem(index: number, direction: "up" | "down") {
    const newFaqs = [...faqs];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= faqs.length) return;

    [newFaqs[index], newFaqs[newIndex]] = [newFaqs[newIndex], newFaqs[index]];

    const updates = newFaqs.map((faq, i) => ({ id: faq.id, order: i }));
    await reorderFAQs(updates);
    loadFAQs();
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
          <h1 className="text-2xl font-bold text-gray-900">SSS Yönetimi</h1>
          <p className="text-gray-600 mt-1">Sıkça sorulan soruları yönetin</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Yeni Soru
        </button>
      </div>

      {/* FAQ List */}
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
        {faqs.map((faq, index) => (
          <div key={faq.id} className="p-4 hover:bg-gray-50">
            <div className="flex items-start gap-4">
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => moveItem(index, "up")}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <GripVertical className="h-4 w-4 text-gray-300" />
                <button
                  onClick={() => moveItem(index, "down")}
                  disabled={index === faqs.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900">{faq.question}</h3>
                  {!faq.isActive && (
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">
                      Pasif
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{faq.answer}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(faq)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {faqs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Henüz soru eklenmemiş
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingFAQ ? "Soruyu Düzenle" : "Yeni Soru Ekle"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Soru *</label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cevap *</label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
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
                  {editingFAQ ? "Güncelle" : "Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
