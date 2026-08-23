"use client";

import Image from "next/image";
import { useState } from "react";

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
}

export function ProductGallery({ images, productName }: { images: GalleryImage[]; productName: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  return (
    <div className="space-y-4">
      <div className="card relative aspect-square overflow-hidden">
        {active ? (
          <Image
            src={active.url}
            alt={active.alt || productName}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain p-6"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-text-muted">Sem imagem</div>
        )}
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Ver foto ${i + 1}`}
              aria-current={i === activeIndex}
              className={`card relative aspect-square overflow-hidden transition-colors ${
                i === activeIndex ? "border-primary/60" : "hover:border-primary/40"
              }`}
            >
              <Image src={img.url} alt={img.alt || productName} fill className="object-contain p-2" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
