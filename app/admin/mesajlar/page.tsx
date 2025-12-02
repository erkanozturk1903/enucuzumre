"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, Trash2, Eye, MessageSquare, Clock, CheckCheck, Archive } from "lucide-react";
import { getContactMessages, updateMessageStatus, updateMessageNotes, deleteContactMessage, getMessageStats } from "./actions";
import { MessageStatus } from "@prisma/client";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: MessageStatus;
  notes: string | null;
  createdAt: Date;
}

interface Stats {
  total: number;
  new: number;
  read: number;
  replied: number;
}

const STATUS_CONFIG = {
  NEW: { label: "Yeni", color: "bg-blue-100 text-blue-700", icon: Mail },
  READ: { label: "Okundu", color: "bg-yellow-100 text-yellow-700", icon: Eye },
  REPLIED: { label: "Yanıtlandı", color: "bg-green-100 text-green-700", icon: CheckCheck },
  ARCHIVED: { label: "Arşiv", color: "bg-gray-100 text-gray-700", icon: Archive },
};

export default function MesajlarAdminPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, new: 0, read: 0, replied: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<MessageStatus | "ALL">("ALL");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [messagesResult, statsResult] = await Promise.all([
      getContactMessages(),
      getMessageStats(),
    ]);

    if (messagesResult.success && messagesResult.data) {
      setMessages(messagesResult.data as ContactMessage[]);
    }
    if (statsResult.success && statsResult.data) {
      setStats(statsResult.data);
    }
    setLoading(false);
  }

  async function handleStatusChange(id: string, status: MessageStatus) {
    const result = await updateMessageStatus(id, status);
    if (result.success) {
      loadData();
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, status });
      }
    }
  }

  async function handleSaveNotes() {
    if (!selectedMessage) return;
    const result = await updateMessageNotes(selectedMessage.id, notes);
    if (result.success) {
      loadData();
      setSelectedMessage({ ...selectedMessage, notes });
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu mesajı silmek istediğinizden emin misiniz?")) return;
    const result = await deleteContactMessage(id);
    if (result.success) {
      loadData();
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    }
  }

  function openMessage(message: ContactMessage) {
    setSelectedMessage(message);
    setNotes(message.notes || "");
    if (message.status === "NEW") {
      handleStatusChange(message.id, "READ");
    }
  }

  const filteredMessages = filter === "ALL"
    ? messages
    : messages.filter((m) => m.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">İletişim Mesajları</h1>
        <p className="text-gray-600 mt-1">Ziyaretçilerden gelen mesajları görüntüleyin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">Toplam</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
              <p className="text-sm text-gray-500">Yeni</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Eye className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{stats.read}</p>
              <p className="text-sm text-gray-500">Okundu</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCheck className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.replied}</p>
              <p className="text-sm text-gray-500">Yanıtlandı</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === "ALL" ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Tümü ({stats.total})
        </button>
        {(Object.keys(STATUS_CONFIG) as MessageStatus[]).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {STATUS_CONFIG[status].label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {filteredMessages.map((message) => {
              const config = STATUS_CONFIG[message.status];
              return (
                <div
                  key={message.id}
                  onClick={() => openMessage(message)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedMessage?.id === message.id ? "bg-primary/5 border-l-4 border-primary" : ""
                  } ${message.status === "NEW" ? "bg-blue-50/50" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-medium text-gray-900 truncate">{message.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs ${config.color}`}>
                      {config.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate mb-1">{message.subject}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    {new Date(message.createdAt).toLocaleDateString("tr-TR")}
                  </div>
                </div>
              );
            })}

            {filteredMessages.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Mesaj bulunamadı
              </div>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedMessage.subject}</h2>
                  <p className="text-gray-600">{selectedMessage.name}</p>
                </div>
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-gray-200">
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  {selectedMessage.email}
                </a>
                {selectedMessage.phone && (
                  <a
                    href={`tel:${selectedMessage.phone}`}
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Phone className="h-4 w-4" />
                    {selectedMessage.phone}
                  </a>
                )}
                <span className="text-sm text-gray-500">
                  {new Date(selectedMessage.createdAt).toLocaleString("tr-TR")}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Mesaj</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Durum</h3>
                <div className="flex gap-2">
                  {(Object.keys(STATUS_CONFIG) as MessageStatus[]).map((status) => {
                    const config = STATUS_CONFIG[status];
                    const Icon = config.icon;
                    return (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(selectedMessage.id, status)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedMessage.status === status
                            ? config.color
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {config.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Notlar</h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Bu mesaj hakkında not ekleyin..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary mb-2"
                />
                <button
                  onClick={handleSaveNotes}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  Notu Kaydet
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Görüntülemek için bir mesaj seçin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
