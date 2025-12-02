"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface GalleryProps {
  images: string[];
}

export function Gallery({ images }: GalleryProps) {
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden rounded-2xl bg-gray-100">
        <Image
          src={activeImage}
          alt="Tur Görseli"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setActiveImage(img)}
            className={cn(
              "relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all",
              activeImage === img
                ? "border-secondary ring-2 ring-secondary/20"
                : "border-transparent hover:border-gray-300"
            )}
          >
            <Image
              src={img}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="128px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

