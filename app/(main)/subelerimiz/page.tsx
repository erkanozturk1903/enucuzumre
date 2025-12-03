import { Container } from "@/components/ui/container";
import { MapPin, Phone, Mail, Clock, Award } from "lucide-react";
import { prisma } from "@/lib/prisma";

// Her istekte güncel veri çek
export const dynamic = "force-dynamic";

async function getBranches() {
  try {
    const branches = await prisma.branch.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    return branches;
  } catch (error) {
    console.error("Şubeler alınamadı:", error);
    return [];
  }
}

export default async function SubelerimizPage() {
  const branches = await getBranches();

  return (
    <main className="min-h-screen bg-gray-50/50">
      <Container className="pt-4 pb-8 md:pt-6 md:pb-12">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-primary mb-1">
            Şubelerimiz
          </h1>
          <p className="text-sm text-gray-600">
            {branches.length > 0
              ? `${branches.length} şubemiz ile hizmetinizdeyiz`
              : "Şube bilgileri yakında eklenecektir"}
          </p>
        </div>

        {branches.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {branches.map((branch) => (
              <div
                key={branch.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Branch Header */}
                <div className="bg-primary p-4 text-white">
                  <h2 className="text-lg font-bold">{branch.name}</h2>
                  <p className="text-primary-foreground/80 text-sm">{branch.city}</p>
                </div>

                {/* Branch Content */}
                <div className="p-5 space-y-4">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Adres</p>
                      <p className="text-sm text-gray-700">{branch.address}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Telefon</p>
                      <a
                        href={`tel:${branch.phone.replace(/\s/g, "")}`}
                        className="text-sm text-primary font-medium hover:underline"
                      >
                        {branch.phone}
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  {branch.email && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">E-posta</p>
                        <a
                          href={`mailto:${branch.email}`}
                          className="text-sm text-primary font-medium hover:underline"
                        >
                          {branch.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Working Hours */}
                  {branch.workingHours && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Çalışma Saatleri</p>
                        <p className="text-sm text-gray-700">{branch.workingHours}</p>
                      </div>
                    </div>
                  )}

                  {/* TURSAB Info */}
                  {branch.tursabNo && (
                    <div className="flex items-start gap-3 pt-3 border-t border-gray-100">
                      <div className="w-10 h-10 bg-[#059669]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Award className="h-5 w-5 text-[#059669]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">TÜRSAB Bilgileri</p>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Belge No:</span> {branch.tursabNo}
                        </p>
                        {branch.tursabOwner && (
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Belge Sahibi:</span> {branch.tursabOwner}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Map */}
                {branch.mapUrl && (
                  <div className="border-t border-gray-100">
                    <iframe
                      src={branch.mapUrl}
                      width="100%"
                      height="200"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full"
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="p-4 bg-gray-50 flex gap-3">
                  <a
                    href={`tel:${branch.phone.replace(/\s/g, "")}`}
                    className="flex-1 py-2.5 bg-primary text-white text-center text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Hemen Ara
                  </a>
                  {branch.email && (
                    <a
                      href={`mailto:${branch.email}`}
                      className="flex-1 py-2.5 border border-primary text-primary text-center text-sm font-medium rounded-lg hover:bg-primary/5 transition-colors"
                    >
                      E-posta Gönder
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-500">Şube bilgileri yakında eklenecektir.</p>
          </div>
        )}
      </Container>
    </main>
  );
}
