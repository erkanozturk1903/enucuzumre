export interface Tour {
  id: number;
  title: string;
  image: string;
  price: number;
  currency: string;
  duration: string;
  dateRange: string;
  hotelStars: number;
  hotelName?: string;
  tags?: string[];
  location: string;
}

export const TOURS: Tour[] = [
  {
    id: 1,
    title: "15 Günlük Ekonomik Umre Turu",
    image: "https://picsum.photos/seed/mecca1/800/600",
    price: 1250,
    currency: "USD",
    duration: "15 Gün",
    dateRange: "10 Nisan - 25 Nisan",
    hotelStars: 3,
    hotelName: "Grand Makkah Hotel",
    tags: ["Ekonomik", "Son 4 Yer"],
    location: "Mekke & Medine",
  },
  {
    id: 2,
    title: "Lüks Ramazan Umresi (Son 10 Gün)",
    image: "https://picsum.photos/seed/medina1/800/600",
    price: 2450,
    currency: "USD",
    duration: "10 Gün",
    dateRange: "1 Nisan - 10 Nisan",
    hotelStars: 5,
    hotelName: "Swissotel Makkah",
    tags: ["Premium", "Kadir Gecesi"],
    location: "Mekke (Kabe Manzaralı)",
  },
  {
    id: 3,
    title: "Premium Umre Programı",
    image: "https://picsum.photos/seed/premium1/800/600",
    price: 1850,
    currency: "USD",
    duration: "12 Gün",
    dateRange: "15 Mayıs - 27 Mayıs",
    hotelStars: 4,
    hotelName: "Pullman ZamZam",
    tags: ["Vizesiz", "Kabe Yakını"],
    location: "Mekke & Medine",
  },
  {
    id: 4,
    title: "Sömestr Özel Aile Umresi",
    image: "https://picsum.photos/seed/family1/800/600",
    price: 1350,
    currency: "USD",
    duration: "10 Gün",
    dateRange: "20 Ocak - 30 Ocak",
    hotelStars: 4,
    hotelName: "Hilton Convention",
    tags: ["Aile İndirimi", "Yemekli"],
    location: "Mekke & Medine",
  },
  {
    id: 5,
    title: "Hac 2025 Erken Kayıt Avantajı",
    image: "https://picsum.photos/seed/hajj2025/800/600",
    price: 6500,
    currency: "USD",
    duration: "21 Gün",
    dateRange: "Haziran 2025",
    hotelStars: 5,
    hotelName: "Fairmont Clock Tower",
    tags: ["Erken Rezervasyon", "VIP"],
    location: "Arafat, Mina, Mekke",
  },
  {
    id: 6,
    title: "Butik Medine Ziyareti",
    image: "https://picsum.photos/seed/medina2/800/600",
    price: 1100,
    currency: "USD",
    duration: "7 Gün",
    dateRange: "Her Hafta Çıkışlı",
    hotelStars: 4,
    hotelName: "Dallah Taibah",
    tags: ["Kısa Dönem", "Aktarmasız"],
    location: "Medine-i Münevvere",
  },
];
