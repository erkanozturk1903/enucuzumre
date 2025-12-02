import { Container } from "@/components/ui/container";
import { TourCard } from "@/components/tour-card";
import { prisma } from "@/lib/prisma";

async function getRamazanTours() {
  try {
    const tours = await prisma.tour.findMany({
      where: {
        type: "UMRE",
        isActive: true,
        title: {
          contains: "Ramazan",
          mode: "insensitive",
        },
      },
      include: {
        images: {
          take: 1,
          orderBy: { order: "asc" },
        },
      },
      orderBy: [
        { isFeatured: "desc" },
        { startDate: "asc" },
      ],
    });
    return tours;
  } catch (error) {
    console.error("Ramazan turları alınamadı:", error);
    return [];
  }
}

export default async function RamazanUmresiPage() {
  const ramazanTours = await getRamazanTours();

  return (
    <main className="min-h-screen bg-gray-50/50">
      <Container className="pt-4 pb-8 md:pt-6 md:pb-12">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-primary mb-1">
            Ramazan Umresi
          </h1>
          <p className="text-sm text-gray-600">
            {ramazanTours.length > 0
              ? `${ramazanTours.length} ramazan umresi turu listeleniyor`
              : "Mübarek Ramazan ayında umre fırsatları"}
          </p>
        </div>

        {ramazanTours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ramazanTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-500">
              Ramazan Umresi paketleri yakında eklenecektir.
            </p>
          </div>
        )}
      </Container>
    </main>
  );
}
