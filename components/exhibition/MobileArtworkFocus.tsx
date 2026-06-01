"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Artwork } from "@/lib/types";

type MobileArtworkFocusProps = {
  artwork: Artwork | null;
  onClose: () => void;
};

export function MobileArtworkFocus({ artwork, onClose }: MobileArtworkFocusProps) {
  return (
    <AnimatePresence>
      {artwork && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-[#1a1a1a] flex flex-col"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-[90] w-10 h-10 flex items-center justify-center text-white"
            aria-label="Close"
          >
            <span className="w-6 h-[1px] bg-white rotate-45" />
            <span className="w-6 h-[1px] bg-white -rotate-45 absolute" />
          </button>

          <div className="flex-1 flex items-center justify-center p-4 pt-16">
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              src={artwork.image}
              alt={artwork.title}
              className="max-w-full max-h-[60vh] object-contain"
            />
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="px-6 pb-8 pt-4 space-y-4"
          >
            <h2 className="font-serif text-[24px] text-white leading-tight">
              {artwork.title}
            </h2>
            <p className="font-sans text-[14px] tracking-[0.1em] text-white/60">
              {artwork.artist}, {artwork.year}
            </p>
            <p className="font-sans text-[12px] text-white/40">
              {artwork.medium}
            </p>
            <p className="font-sans text-[12px] text-white/40">
              {artwork.dimensions}
            </p>
            <p className="font-serif text-[14px] text-white/80 leading-relaxed mt-4">
              {artwork.description}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
