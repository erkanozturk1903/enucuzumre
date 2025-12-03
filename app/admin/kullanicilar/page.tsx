"use client";

import { useEffect, useState, ComponentType } from "react";
import { Loader2 } from "lucide-react";

export default function KullanicilarPage() {
  const [Component, setComponent] = useState<ComponentType | null>(null);

  useEffect(() => {
    import("./KullanicilarClient").then((mod) => {
      setComponent(() => mod.default);
    });
  }, []);

  if (!Component) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="w-8 h-8 animate-spin text-[#059669]" />
      </div>
    );
  }

  return <Component />;
}
