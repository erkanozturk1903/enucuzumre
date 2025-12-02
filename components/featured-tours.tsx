import { Container } from "@/components/ui/container";
import { TourCard } from "@/components/tour-card";
import { prisma } from "@/lib/prisma";

async function getFeaturedTours() {
  try {
    const tours = await prisma.tour.findMany({
      where: {
        isActive: true,
      },
      include: {
        images: {
          take: 1,
          orderBy: { order: 'asc' }
        }
      },
      orderBy: [
        { isFeatured: 'desc' }, // Önce öne çıkanlar
        { createdAt: 'desc' }
      ],
      take: 10, // En fazla 10 tur göster
    });

    return tours;
  } catch (error) {
    console.error("Öne çıkan turlar alınamadı:", error);
    return [];
  }
}

export async function FeaturedTours() {
  const tours = await getFeaturedTours();

  if (tours.length === 0) {
    return null; // Eğer tur yoksa section'ı gösterme
  }

  return (
    <section className="pb-8 bg-gray-50/50">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </Container>
    </section>
  );
}
