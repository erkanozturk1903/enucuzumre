"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Building2, Copy, Check } from "lucide-react";
import { getBankAccounts, createBankAccount, updateBankAccount, deleteBankAccount } from "./actions";

interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  iban: string;
  branch: string | null;
  logo: string | null;
  order: number;
  isActive: boolean;
}

export default function BankaHesaplariAdminPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    bankName: "",
    accountName: "",
    iban: "",
    branch: "",
    logo: "",
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    loadAccounts();
  }, []);

  async function loadAccounts() {
    const result = await getBankAccounts();
    if (result.success && result.data) {
      setAccounts(result.data as BankAccount[]);
    }
    setLoading(false);
  }

  function openCreateModal() {
    setEditingAccount(null);
    setFormData({
      bankName: "",
      accountName: "",
      iban: "",
      branch: "",
      logo: "",
      order: accounts.length,
      isActive: true,
    });
    setShowModal(true);
  }

  function openEditModal(account: BankAccount) {
    setEditingAccount(account);
    setFormData({
      bankName: account.bankName,
      accountName: account.accountName,
      iban: account.iban,
      branch: account.branch || "",
      logo: account.logo || "",
      order: account.order,
      isActive: account.isActive,
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, String(value));
    });

    const result = editingAccount
      ? await updateBankAccount(editingAccount.id, form)
      : await createBankAccount(form);

    if (result.success) {
      setShowModal(false);
      loadAccounts();
    } else {
      alert(result.error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu banka hesabını silmek istediğinizden emin misiniz?")) return;
    const result = await deleteBankAccount(id);
    if (result.success) {
      loadAccounts();
    }
  }

  function copyIban(iban: string, id: string) {
    navigator.clipboard.writeText(iban.replace(/\s/g, ""));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
          <h1 className="text-2xl font-bold text-gray-900">Banka Hesapları</h1>
          <p className="text-gray-600 mt-1">Banka hesap bilgilerini yönetin</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Yeni Hesap
        </button>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <div
            key={account.id}
            className={`bg-white rounded-xl border p-6 ${
              account.isActive ? "border-gray-200" : "border-yellow-300 bg-yellow-50"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  {account.logo ? (
                    <img src={account.logo} alt={account.bankName} className="w-8 h-8 object-contain" />
                  ) : (
                    <Building2 className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{account.bankName}</h3>
                  {account.branch && (
                    <p className="text-sm text-gray-500">{account.branch}</p>
                  )}
                </div>
              </div>
              {!account.isActive && (
                <span className="px-2 py-0.5 bg-yellow-200 text-yellow-800 rounded text-xs">
                  Pasif
                </span>
              )}
            </div>

            <div className="space-y-2 mb-4">
              <div>
                <p className="text-xs text-gray-500">Hesap Sahibi</p>
                <p className="font-medium text-gray-900">{account.accountName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">IBAN</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm text-gray-900">{account.iban}</p>
                  <button
                    onClick={() => copyIban(account.iban, account.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {copiedId === account.id ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
              <button
                onClick={() => openEditModal(account)}
                className="flex-1 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors"
              >
                Düzenle
              </button>
              <button
                onClick={() => handleDelete(account.id)}
                className="flex-1 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        ))}

        {accounts.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200">
            Henüz banka hesabı eklenmemiş
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingAccount ? "Hesabı Düzenle" : "Yeni Hesap Ekle"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Banka Adı *</label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  placeholder="Ziraat Bankası"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hesap Sahibi *</label>
                <input
                  type="text"
                  value={formData.accountName}
                  onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                  placeholder="EN UCUZ HAC UMRE TURİZM LTD. ŞTİ."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">IBAN *</label>
                <input
                  type="text"
                  value={formData.iban}
                  onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                  placeholder="TR00 0000 0000 0000 0000 0000 00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Şube</label>
                <input
                  type="text"
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  placeholder="Fatih Şubesi"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                <input
                  type="text"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
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
                  {editingAccount ? "Güncelle" : "Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
