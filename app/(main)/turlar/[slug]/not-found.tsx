import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Search, Home, ArrowLeft } from "lucide-react";

export default function TourNotFound() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="mb-8 relative">
            <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
              <Search className="h-16 w-16 text-gray-400" />
            </div>
            <div className="absolute top-0 right-1/2 translate-x-20 -translate-y-4">
              <span className="text-6xl">🕌</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Tur Bulunamadı
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
            Aradığınız tur bulunamadı veya artık aktif değil. 
            Ana sayfaya dönerek diğer turlarımıza göz atabilirsiniz.
          </p>

          {/* Error Code */}
          <div className="inline-block px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-500 mb-8">
            <span className="font-mono font-bold">404</span> - Sayfa Bulunamadı
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Home className="h-5 w-5" />
              Ana Sayfaya Dön
            </Link>
            
            <Link
              href="/umre-turlari"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-gray-200 hover:border-primary bg-white hover:bg-primary text-primary hover:text-white font-bold rounded-xl transition-all duration-300"
            >
              <Search className="h-5 w-5" />
              Tüm Turları Gör
            </Link>
          </div>

          {/* Suggestions */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Popüler aramalar:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { href: "/umre-turlari", label: "Umre Turları" },
                { href: "/hac-turlari", label: "Hac Turları" },
                { href: "/ramazan-umresi", label: "Ramazan Umresi" },
                { href: "/kudus-turlari", label: "Kudüs Turları" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 bg-white border border-gray-200 hover:border-secondary hover:text-secondary rounded-lg text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}



