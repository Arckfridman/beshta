"use client";

import { motion, useSpring } from "framer-motion";
import { useCallback, useRef } from "react";
import type { Artwork } from "@/lib/types";

type ArtworkNodeProps = {
  artwork: Artwork;
  originX: number;
  originY: number;
  isFocused: boolean;
  disabled: boolean;
  layoutMode: "brick" | "grid";
  brickLayout: { x: number; y: number; width: number; height: number };
  gridLayout: { x: number; y: number; width: number; height: number };
};

const hoverSpring = { stiffness: 260, damping: 22 };

export function ArtworkNode({
  artwork,
  originX,
  originY,
  isFocused,
  disabled,
  layoutMode,
  brickLayout,
  gridLayout,
}: ArtworkNodeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(0, hoverSpring);
  const rotateY = useSpring(0, hoverSpring);
  const scale = useSpring(1, hoverSpring);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (disabled || document.body.classList.contains("exhibition-panning") || !ref.current) {
        return;
      }
      const rect = ref.current.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      rotateX.set(py * -4);
      rotateY.set(px * 4);
    },
    [disabled, rotateX, rotateY],
  );

  const handlePointerLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  }, [rotateX, rotateY, scale]);

  const handlePointerEnter = useCallback(() => {
    if (!disabled && !document.body.classList.contains("exhibition-panning")) {
      scale.set(1.03);
    }
  }, [disabled, scale]);

  const currentLayout = layoutMode === "brick" ? brickLayout : gridLayout;
  const left = originX + currentLayout.x;
  const top = originY + currentLayout.y;

  return (
    <motion.div
      className="absolute z-10"
      layout
      style={{
        left,
        top,
        width: currentLayout.width,
        height: currentLayout.height,
        opacity: isFocused ? 0 : 1,
        pointerEvents: isFocused || disabled ? "none" : "auto",
      }}
      transition={{
        layout: { duration: 1.5, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: 0.5 },
      }}
    >
      <motion.div
        className="h-full w-full"
        style={{
          rotateX,
          rotateY,
          scale,
          transformPerspective: 1200,
        }}
      >
        <div
          ref={ref}
          data-artwork
          data-artwork-id={artwork.id}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onPointerEnter={handlePointerEnter}
          className="block h-full w-full cursor-grab touch-none"
          aria-label={artwork.title}
          role="button"
          tabIndex={0}
        >
          <div className="relative h-full w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={artwork.image}
              alt=""
              width={artwork.width}
              height={artwork.height}
              className="block h-full w-full object-cover"
              draggable={false}
              loading={Number(artwork.id) <= 3 ? "eager" : "lazy"}
              decoding="async"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
