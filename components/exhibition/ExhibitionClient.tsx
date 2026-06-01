"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import { LoadingScreen } from "./LoadingScreen";
import { ExhibitionShell } from "./ExhibitionShell";
import { artworks } from "@/lib/artworks";

const Exhibition = dynamic(
  () =>
    import("@/components/exhibition/Exhibition").then((mod) => mod.Exhibition),
  { ssr: false, loading: () => <ExhibitionShell /> },
);

export function ExhibitionClient() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const images = artworks.map((artwork) => artwork.image);
    let loadedCount = 0;
    const totalImages = images.length;

    const updateProgress = () => {
      loadedCount++;
      setLoadingProgress((loadedCount / totalImages) * 100);
      
      if (loadedCount === totalImages) {
        setTimeout(() => setIsLoading(false), 500);
      }
    };

    images.forEach((src) => {
      const img = new Image();
      img.onload = updateProgress;
      img.onerror = updateProgress;
      img.src = src;
    });
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen progress={loadingProgress} />}
      </AnimatePresence>
      <Exhibition />
    </>
  );
}
