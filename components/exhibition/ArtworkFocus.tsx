"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Artwork } from "@/lib/types";

type FocusOrigin = {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

type ArtworkFocusProps = {
  artwork: Artwork | null;
  origin: FocusOrigin | null;
  onClose: () => void;
};

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const textFade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
};

export function ArtworkFocus({ artwork, origin, onClose }: ArtworkFocusProps) {
  const finalWidth = artwork ? Math.min(artwork.width * 1.85, 520) : 0;
  const finalHeight = artwork ? Math.min(artwork.height * 1.85, 680) : 0;
  const finalLeft = `calc(50vw - ${finalWidth / 2}px)`;
  const finalTop = `calc(50vh - ${finalHeight / 2}px)`;
  const initialRect = origin?.id === artwork?.id ? origin : null;

  return (
    <AnimatePresence>
      {artwork && (
        <motion.div
          key={artwork.id}
          className="fixed inset-0 z-40 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.button
            type="button"
            aria-label="Close"
            className="absolute inset-0 cursor-default border-0 bg-black p-0"
            onClick={onClose}
            {...fade}
            transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
          />

          <div className="pointer-events-none relative z-10 flex h-full w-full max-w-[1400px] items-center justify-center px-6 md:px-16">
            <motion.div
              className="pointer-events-none absolute left-6 top-1/2 hidden max-w-[200px] -translate-y-1/2 md:left-16 md:block lg:max-w-[240px]"
              {...textFade}
              transition={{ delay: 0.45, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-serif text-[15px] tracking-[0.2em] text-white/70 uppercase">
                {artwork.artist}
              </p>
              <h2 className="mt-4 font-serif text-[23px] leading-snug tracking-[0.04em] text-white">
                {artwork.title}
              </h2>
              <p className="mt-3 font-serif text-[17px] tracking-[0.12em] text-white/65">
                {artwork.year}
              </p>
            </motion.div>

            <motion.div
              className="pointer-events-auto fixed z-10 overflow-hidden"
              style={{
                width: finalWidth,
                height: finalHeight,
              }}
              initial={
                initialRect
                  ? {
                      left: initialRect.left,
                      top: initialRect.top,
                      width: initialRect.width,
                      height: initialRect.height,
                      opacity: 1,
                    }
                  : {
                      left: finalLeft,
                      top: finalTop,
                      width: finalWidth,
                      height: finalHeight,
                      opacity: 0,
                    }
              }
              animate={{
                left: finalLeft,
                top: finalTop,
                width: finalWidth,
                height: finalHeight,
                opacity: 1,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={artwork.image}
                alt=""
                className="h-full w-full object-cover"
                width={finalWidth}
                height={finalHeight}
              />
            </motion.div>

            <motion.div
              className="pointer-events-none absolute right-6 top-1/2 hidden max-w-[220px] -translate-y-1/2 md:right-16 md:block lg:max-w-[280px]"
              {...textFade}
              transition={{ delay: 0.55, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-serif text-[15px] leading-relaxed tracking-[0.14em] text-white/70">
                {artwork.medium}
              </p>
              <p className="mt-2 font-serif text-[15px] tracking-[0.14em] text-white/70">
                {artwork.dimensions}
              </p>
              <p className="mt-8 font-serif text-[17px] leading-[1.85] tracking-[0.02em] text-white/80">
                {artwork.description}
              </p>
            </motion.div>
          </div>

          <motion.button
            type="button"
            onClick={onClose}
            className="pointer-events-auto absolute bottom-10 left-10 z-50 flex h-[72px] w-[72px] cursor-pointer items-center justify-center rounded-full border border-white/25 bg-transparent text-white transition-colors hover:border-white/45 md:bottom-12 md:left-12 md:h-20 md:w-20"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            aria-label="Back to collection"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              aria-hidden
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </motion.button>

          <motion.div
            className="pointer-events-none absolute right-6 bottom-10 left-6 md:hidden"
            {...textFade}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <p className="font-serif text-[15px] tracking-[0.18em] text-white/70 uppercase">
              {artwork.artist} · {artwork.year}
            </p>
            <h2 className="mt-2 font-serif text-[21px] text-white">
              {artwork.title}
            </h2>
            <p className="mt-4 font-serif text-[17px] leading-[1.8] text-white/80">
              {artwork.description}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
