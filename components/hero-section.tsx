import { Container } from "@/components/ui/container";
import { HeroSearchBox } from "@/components/hero-search-box";
import { HeroSlider } from "@/components/hero-slider";
import { prisma } from "@/lib/prisma";

async function getHeroSlides() {
  try {
    const slides = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    // Eğer slide yoksa default slide döndür
    if (slides.length === 0) {
      return [
        {
          id: "default",
          title: "Manevi Yolculuğunuz En Uygun Fiyatlarla Başlasın",
          subtitle: "Hac ve Umre turlarında Türkiye'nin en güvenilir karşılaştırma platformu.",
          imageUrl: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1920&q=80",
          buttonText: null,
          buttonLink: null,
          order: 0,
          isActive: true,
        },
      ];
    }

    return slides;
  } catch (error) {
    console.error("Hero slides alınamadı:", error);
    return [
      {
        id: "fallback",
        title: "Manevi Yolculuğunuz En Uygun Fiyatlarla Başlasın",
        subtitle: "Hac ve Umre turlarında Türkiye'nin en güvenilir karşılaştırma platformu.",
        imageUrl: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1920&q=80",
        buttonText: null,
        buttonLink: null,
        order: 0,
        isActive: true,
      },
    ];
  }
}

export async function HeroSection() {
  const slides = await getHeroSlides();

  return (
    <section className="relative">
      {/* Hero Slider */}
      <HeroSlider slides={slides} />

      {/* Floating Search Box */}
      <div className="relative -mt-24 z-20 pb-6">
        <Container>
          <HeroSearchBox />
        </Container>
      </div>
    </section>
  );
}
