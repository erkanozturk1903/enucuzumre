"use client";

import dynamic from "next/dynamic";

const KullanicilarClient = dynamic(
  () => import("./KullanicilarClient"),
  { ssr: false }
);

export default function KullanicilarPage() {
  return <KullanicilarClient />;
}
