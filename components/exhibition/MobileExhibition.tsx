"use client";

import { artworks } from "@/lib/artworks";
import type { Artwork } from "@/lib/types";

type MobileExhibitionProps = {
  onArtworkTap: (id: string) => void;
};

export function MobileExhibition({ onArtworkTap }: MobileExhibitionProps) {
  return (
    <div className="pt-16 pb-8 px-4 bg-[#f8f7f3] min-h-screen">
      <div className="space-y-8">
        {artworks.map((artwork) => (
          <MobileArtworkCard
            key={artwork.id}
            artwork={artwork}
            onTap={onArtworkTap}
          />
        ))}
      </div>
    </div>
  );
}

type MobileArtworkCardProps = {
  artwork: Artwork;
  onTap: (id: string) => void;
};

function MobileArtworkCard({ artwork, onTap }: MobileArtworkCardProps) {
  return (
    <div
      onClick={() => onTap(artwork.id)}
      className="cursor-pointer group"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#1a1a1a]/5 mb-4">
        <img
          src={artwork.image}
          alt={artwork.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="space-y-1">
        <h3 className="font-serif text-[16px] text-[#1a1a1a]">
          {artwork.title}
        </h3>
        <p className="font-sans text-[12px] tracking-[0.1em] text-[#1a1a1a]/60">
          {artwork.artist}, {artwork.year}
        </p>
      </div>
    </div>
  );
}
