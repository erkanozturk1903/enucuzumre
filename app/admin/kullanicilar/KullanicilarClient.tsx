"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Shield,
  UserCog,
  User,
  Loader2,
  X,
  Check,
} from "lucide-react";

interface UserType {
  id: string;
  email: string;
  name: string;
  role: "SUPER_ADMIN" | "ADMIN" | "EDITOR";
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
}

const roleLabels = {
  SUPER_ADMIN: { label: "Süper Admin", icon: Shield, color: "text-red-600 bg-red-50" },
  ADMIN: { label: "Yönetici", icon: UserCog, color: "text-blue-600 bg-blue-50" },
  EDITOR: { label: "Editör", icon: User, color: "text-green-600 bg-green-50" },
};

export default function KullanicilarClient() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    role: "ADMIN" as "ADMIN" | "EDITOR",
    isActive: true,
  });

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      router.push("/admin");
      return;
    }

    fetchUsers();
  }, [session, status, router]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Kullanıcılar yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingUser
        ? `/api/admin/users/${editingUser.id}`
        : "/api/admin/users";

      const method = editingUser ? "PUT" : "POST";

      const body = editingUser
        ? {
            email: formData.email,
            name: formData.name,
            role: formData.role,
            isActive: formData.isActive,
            ...(formData.password && { password: formData.password }),
          }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        fetchUsers();
        closeModal();
      } else {
        const error = await res.json();
        alert(error.error || "Bir hata oluştu");
      }
    } catch (error) {
      console.error("Kayıt hatası:", error);
      alert("Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchUsers();
      } else {
        const error = await res.json();
        alert(error.error || "Silinemedi");
      }
    } catch (error) {
      console.error("Silme hatası:", error);
    } finally {
      setDeleting(null);
    }
  };

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({
      email: "",
      name: "",
      password: "",
      role: "ADMIN",
      isActive: true,
    });
    setShowModal(true);
  };

  const openEditModal = (user: UserType) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      name: user.name,
      password: "",
      role: user.role === "SUPER_ADMIN" ? "ADMIN" : user.role,
      isActive: user.isActive,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setShowPassword(false);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Hiç giriş yapmadı";
    return new Date(dateString).toLocaleString("tr-TR");
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="w-8 h-8 animate-spin text-[#059669]" />
      </div>
    );
  }

  if (session?.user?.role !== "SUPER_ADMIN") {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
          <p className="text-gray-600 mt-1">
            Admin paneline erişebilecek kullanıcıları yönetin
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-[#059669] text-white rounded-lg hover:bg-[#047857] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yeni Kullanıcı
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              <p className="text-sm text-gray-500">Toplam Kullanıcı</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter((u) => u.isActive).length}
              </p>
              <p className="text-sm text-gray-500">Aktif Kullanıcı</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter((u) => u.role === "SUPER_ADMIN").length}
              </p>
              <p className="text-sm text-gray-500">Süper Admin</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                Kullanıcı
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                Rol
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                Durum
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                Son Giriş
              </th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => {
              const roleInfo = roleLabels[user.role];
              const RoleIcon = roleInfo.icon;
              const isCurrentUser = user.email === session?.user?.email;

              return (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.name}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs text-[#059669]">(Sen)</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${roleInfo.color}`}
                    >
                      <RoleIcon className="w-3.5 h-3.5" />
                      {roleInfo.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.isActive
                          ? "bg-green-50 text-green-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(user.lastLogin)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {user.role !== "SUPER_ADMIN" && (
                        <>
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Düzenle"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            disabled={deleting === user.id}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Sil"
                          >
                            {deleting === user.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Henüz kullanıcı bulunmuyor
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                {editingUser ? "Kullanıcı Düzenle" : "Yeni Kullanıcı Ekle"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#059669] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#059669] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {editingUser ? "Yeni Şifre (boş bırakılabilir)" : "Şifre"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#059669] focus:border-transparent"
                    required={!editingUser}
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as "ADMIN" | "EDITOR",
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#059669] focus:border-transparent"
                >
                  <option value="ADMIN">Yönetici (Admin)</option>
                  <option value="EDITOR">Editör</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.role === "ADMIN"
                    ? "Tüm içerikleri yönetebilir"
                    : "Sadece içerik düzenleyebilir"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 text-[#059669] rounded focus:ring-[#059669]"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  Aktif (Giriş yapabilir)
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-[#059669] text-white rounded-lg hover:bg-[#047857] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingUser ? "Güncelle" : "Ekle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
