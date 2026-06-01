"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { artworks, fieldOrigin, getFieldBounds, brickLayout, gridLayout } from "@/lib/artworks";
import { useMobile } from "@/hooks/useMobile";

const fieldPad = 480;
const fieldBounds = getFieldBounds();
const canvasMinW = fieldBounds.width + fieldPad * 2;
const canvasMinH = fieldBounds.height + fieldPad * 2;
import { useExhibitionCamera } from "@/hooks/useExhibitionCamera";
import { ArtworkFocus } from "./ArtworkFocus";
import { ArtworkNode } from "./ArtworkNode";
import { CollectionPanel } from "./CollectionPanel";
import { ContactsPanel } from "./ContactsPanel";
import { SiteNav } from "./SiteNav";
import { ZoomToggle } from "./ZoomToggle";
import { MobileHeader } from "./MobileHeader";
import { MobileNav } from "./MobileNav";
import { MobileExhibition } from "./MobileExhibition";
import { MobileArtworkFocus } from "./MobileArtworkFocus";

type FocusOrigin = {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

export function Exhibition() {
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [focusOrigin, setFocusOrigin] = useState<FocusOrigin | null>(null);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false);
  const [layoutMode, setLayoutMode] = useState<"brick" | "grid">("brick");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useMobile();

  const isExploring = !focusedId && !collectionOpen && !contactsOpen;

  const onNavTap = useCallback((action: string) => {
    setFocusedId(null);
    setFocusOrigin(null);
    if (action === "collection") setCollectionOpen(true);
    if (action === "contacts") setContactsOpen(true);
  }, []);

  const onArtworkTap = useCallback((id: string) => {
    setLayoutMode("brick");
    const el = document.querySelector<HTMLElement>(`[data-artwork-id="${id}"]`);
    const rect = el?.getBoundingClientRect();
    setFocusOrigin(
      rect
        ? {
            id,
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
          }
        : null,
    );
    setFocusedId(id);
  }, []);

  const { panX, panY, scale, recenter, zoomBy } = useExhibitionCamera(
    isExploring,
    { onNavTap, onArtworkTap },
  );

  const toggleZoom = useCallback(() => {
    setLayoutMode((prev) => {
      const newMode = prev === "brick" ? "grid" : "brick";
      if (newMode === "grid") {
        scale.set(0.55);
        recenter();
      } else {
        scale.set(1);
        recenter();
      }
      return newMode;
    });
  }, [scale, recenter]);


  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFocusedId(null);
        setFocusOrigin(null);
        setCollectionOpen(false);
        setContactsOpen(false);
        setMobileMenuOpen(false);
        return;
      }

      if (focusedId || collectionOpen || contactsOpen) return;

      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        zoomBy(1.5);
      }

      if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        zoomBy(0.5);
      }

      if (e.key === "0") {
        e.preventDefault();
        recenter();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isMobile) {
    return (
      <>
        <MobileHeader
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          isMenuOpen={mobileMenuOpen}
        />
        <MobileNav
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          onNavigate={onNavTap}
        />
        <MobileExhibition onArtworkTap={onArtworkTap} />
        <MobileArtworkFocus
          artwork={artworks.find((a) => a.id === focusedId) ?? null}
          onClose={() => setFocusedId(null)}
        />
        <CollectionPanel
          open={collectionOpen}
          onClose={() => setCollectionOpen(false)}
        />
        <ContactsPanel
          open={contactsOpen}
          onClose={() => setContactsOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <div className="grain pointer-events-none fixed inset-0 z-[1]" aria-hidden />

      <div
        id="collection"
        className={`exhibition-canvas relative h-dvh w-full overflow-hidden bg-canvas select-none touch-none ${
          isExploring ? "" : "cursor-default"
        }`}
        style={{ overflow: "hidden" }}
      >
        <SiteNav inverted={focusedId !== null} />

      <motion.div
        className="absolute top-0 left-0 z-[2] origin-top-left will-change-transform"
        style={{
          x: panX,
          y: panY,
          scale,
          minWidth: canvasMinW,
          minHeight: canvasMinH,
        }}
      >
        {artworks.map((artwork) => (
          <ArtworkNode
            key={artwork.id}
            artwork={artwork}
            originX={fieldOrigin.x}
            originY={fieldOrigin.y}
            isFocused={focusedId === artwork.id}
            disabled={!isExploring}
            layoutMode={layoutMode}
            brickLayout={brickLayout[Number(artwork.id) - 1]}
            gridLayout={gridLayout[Number(artwork.id) - 1]}
          />
        ))}
      </motion.div>

      <ArtworkFocus
        artwork={artworks.find((a) => a.id === focusedId) ?? null}
        origin={focusOrigin}
        onClose={() => {
          setFocusedId(null);
          setFocusOrigin(null);
        }}
      />

      <CollectionPanel
        open={collectionOpen}
        onClose={() => setCollectionOpen(false)}
      />

      <ContactsPanel
        open={contactsOpen}
        onClose={() => setContactsOpen(false)}
      />
    </div>

    <ZoomToggle isZoomedOut={layoutMode === "grid"} onToggle={toggleZoom} visible={!focusedId} />
    </>
  );
}
