import dynamic from "next/dynamic";

// Client component'i dynamic import ile yükle - SSR kapalı
const KullanicilarClient = dynamic(
  () => import("./KullanicilarClient"),
  { ssr: false }
);

export default function KullanicilarPage() {
  return <KullanicilarClient />;
}
