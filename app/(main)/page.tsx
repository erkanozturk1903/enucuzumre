import { HeroSection } from "@/components/hero-section";
import { FeaturedTours } from "@/components/featured-tours";

// Her istekte güncel veri çek (admin'den yapılan değişiklikler anında yansısın)
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Tours Section */}
      <FeaturedTours />
    </main>
  );
}
