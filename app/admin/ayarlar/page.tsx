"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { getSiteSettings, updateSiteSettings } from "./actions";

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setIsLoading(true);
    const result = await getSiteSettings();
    if (result.success && result.data) {
      setSettings(result.data);
    } else {
      toast.error("Ayarlar yüklenemedi");
    }
    setIsLoading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateSiteSettings(formData);

    if (result.success) {
      toast.success(result.message || "Ayarlar başarıyla güncellendi!");
    } else {
      toast.error(result.error || "Bir hata oluştu");
    }

    setIsSaving(false);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#059669]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Site Ayarları</h1>
        <p className="text-gray-600">
          Ana sayfa ve genel site ayarlarını buradan yönetin
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hero Section Settings */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100">
          <h2 className="text-xl font-bold text-primary mb-6">Hero Bölümü</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="heroTitle" className="block text-sm font-medium text-gray-700 mb-2">
                Ana Başlık
              </label>
              <input
                type="text"
                id="heroTitle"
                name="heroTitle"
                defaultValue={settings?.heroTitle}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-colors"
                placeholder="Manevi Yolculuğunuz En Uygun Fiyatlarla Başlasın"
              />
            </div>

            <div>
              <label htmlFor="heroSubtitle" className="block text-sm font-medium text-gray-700 mb-2">
                Alt Başlık
              </label>
              <textarea
                id="heroSubtitle"
                name="heroSubtitle"
                rows={3}
                defaultValue={settings?.heroSubtitle}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-colors resize-none"
                placeholder="Hac ve Umre turlarında Türkiye'nin en güvenilir karşılaştırma platformu."
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100">
          <h2 className="text-xl font-bold text-primary mb-6">İletişim Bilgileri</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">
                Telefon Numarası
              </label>
              <input
                type="text"
                id="contactPhone"
                name="contactPhone"
                defaultValue={settings?.contactPhone}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-colors"
                placeholder="+90 555 555 55 55"
              />
            </div>

            <div>
              <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp Numarası
              </label>
              <input
                type="text"
                id="whatsappNumber"
                name="whatsappNumber"
                defaultValue={settings?.whatsappNumber}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-colors"
                placeholder="+905555555555"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-posta
              </label>
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={settings?.email}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-colors"
                placeholder="info@enucuzhacumre.com"
              />
            </div>

            <div>
              <label htmlFor="tursabNo" className="block text-sm font-medium text-gray-700 mb-2">
                TÜRSAB Belge No
              </label>
              <input
                type="text"
                id="tursabNo"
                name="tursabNo"
                defaultValue={settings?.tursabNo}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-colors"
                placeholder="A-12345"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Adres
              </label>
              <textarea
                id="address"
                name="address"
                rows={2}
                defaultValue={settings?.address}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-colors resize-none"
                placeholder="Fatih Sultan Mehmet Mah. İstanbul Cad. No:123 Fatih/İstanbul"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100">
          <h2 className="text-xl font-bold text-primary mb-6">Sosyal Medya</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="instagramUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Instagram URL
              </label>
              <input
                type="url"
                id="instagramUrl"
                name="instagramUrl"
                defaultValue={settings?.instagramUrl || ""}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-colors"
                placeholder="https://instagram.com/enucuzhacumre"
              />
            </div>

            <div>
              <label htmlFor="facebookUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Facebook URL
              </label>
              <input
                type="url"
                id="facebookUrl"
                name="facebookUrl"
                defaultValue={settings?.facebookUrl || ""}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-colors"
                placeholder="https://facebook.com/enucuzhacumre"
              />
            </div>

            <div>
              <label htmlFor="twitterUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Twitter URL
              </label>
              <input
                type="url"
                id="twitterUrl"
                name="twitterUrl"
                defaultValue={settings?.twitterUrl || ""}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-colors"
                placeholder="https://twitter.com/enucuzhacumre"
              />
            </div>

            <div>
              <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700 mb-2">
                YouTube URL
              </label>
              <input
                type="url"
                id="youtubeUrl"
                name="youtubeUrl"
                defaultValue={settings?.youtubeUrl || ""}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-colors"
                placeholder="https://youtube.com/@enucuzhacumre"
              />
            </div>
          </div>
        </div>

        {/* Mobile App Links */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100">
          <h2 className="text-xl font-bold text-primary mb-6">Mobil Uygulama Linkleri</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="appStoreUrl" className="block text-sm font-medium text-gray-700 mb-2">
                App Store URL (iOS)
              </label>
              <input
                type="url"
                id="appStoreUrl"
                name="appStoreUrl"
                defaultValue={settings?.appStoreUrl || ""}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-colors"
                placeholder="https://apps.apple.com/app/..."
              />
            </div>

            <div>
              <label htmlFor="playStoreUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Play Store URL (Android)
              </label>
              <input
                type="url"
                id="playStoreUrl"
                name="playStoreUrl"
                defaultValue={settings?.playStoreUrl || ""}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-colors"
                placeholder="https://play.google.com/store/apps/..."
              />
            </div>
          </div>
        </div>

        {/* Footer Settings */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100">
          <h2 className="text-xl font-bold text-primary mb-6">Footer</h2>

          <div>
            <label htmlFor="footerText" className="block text-sm font-medium text-gray-700 mb-2">
              Footer Metni
            </label>
            <input
              type="text"
              id="footerText"
              name="footerText"
              defaultValue={settings?.footerText}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-colors"
              placeholder="© 2025 En Ucuz Hac Umre. Tüm hakları saklıdır."
            />
          </div>
        </div>

        {/* Hakkımızda Settings */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100">
          <h2 className="text-xl font-bold text-primary mb-6">Hakkımızda Sayfası</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="yearsExperience" className="block text-sm font-medium text-gray-700 mb-2">
                  Yıl Tecrübe
                </label>
                <input
                  type="number"
                  id="yearsExperience"
                  name="yearsExperience"
                  defaultValue={settings?.yearsExperience || 20}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-colors"
                  placeholder="20"
                />
              </div>

              <div>
                <label htmlFor="totalGuests" className="block text-sm font-medium text-gray-700 mb-2">
                  Mutlu Misafir Sayısı
                </label>
                <input
                  type="number"
                  id="totalGuests"
                  name="totalGuests"
                  defaultValue={settings?.totalGuests || 50000}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-colors"
                  placeholder="50000"
                />
              </div>

              <div>
                <label htmlFor="satisfactionRate" className="block text-sm font-medium text-gray-700 mb-2">
                  Memnuniyet Oranı (%)
                </label>
                <input
                  type="number"
                  id="satisfactionRate"
                  name="satisfactionRate"
                  min="0"
                  max="100"
                  defaultValue={settings?.satisfactionRate || 98}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-colors"
                  placeholder="98"
                />
              </div>
            </div>

            <div>
              <label htmlFor="companyStory" className="block text-sm font-medium text-gray-700 mb-2">
                Hikayemiz
              </label>
              <textarea
                id="companyStory"
                name="companyStory"
                rows={6}
                defaultValue={settings?.companyStory || ""}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-colors resize-none"
                placeholder="Şirketinizin hikayesini yazın..."
              />
            </div>

            <div>
              <label htmlFor="missionStatement" className="block text-sm font-medium text-gray-700 mb-2">
                Misyonumuz
              </label>
              <textarea
                id="missionStatement"
                name="missionStatement"
                rows={3}
                defaultValue={settings?.missionStatement || ""}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-colors resize-none"
                placeholder="Şirketinizin misyonunu yazın..."
              />
            </div>

            <div>
              <label htmlFor="visionStatement" className="block text-sm font-medium text-gray-700 mb-2">
                Vizyonumuz
              </label>
              <textarea
                id="visionStatement"
                name="visionStatement"
                rows={3}
                defaultValue={settings?.visionStatement || ""}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-colors resize-none"
                placeholder="Şirketinizin vizyonunu yazın..."
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Değişiklikleri Kaydet
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
