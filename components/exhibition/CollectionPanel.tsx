"use client";

import { AnimatePresence, motion } from "framer-motion";

type CollectionPanelProps = {
  open: boolean;
  onClose: () => void;
};

export function CollectionPanel({ open, onClose }: CollectionPanelProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <button
            type="button"
            aria-label="Close collection text"
            className="absolute inset-0 cursor-default border-0 bg-[#1a1a1a]/[0.06] p-0"
            onClick={onClose}
          />
          <motion.aside
            className="relative h-full w-full max-w-[420px] border-l border-[#1a1a1a]/10 bg-[#f8f7f3]/95 px-8 py-10 text-[#1a1a1a] shadow-[-24px_0_80px_rgba(26,26,26,0.08)] backdrop-blur-sm md:w-[24vw] md:min-w-[340px] md:px-10 md:py-12"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 260 }}
            dragElastic={0.08}
            dragMomentum={false}
            onDragEnd={(_, info) => {
              if (info.offset.x > 120 || info.velocity.x > 500) onClose();
            }}
            aria-label="Collection information"
          >
            <div className="flex h-full flex-col">
              <div className="mb-14 text-right">
                <p className="font-serif text-[12px] tracking-[0.24em] text-[#6a6258] uppercase">
                  Private Collection
                </p>
                <h2 className="mt-5 font-serif text-[30px] leading-[1.05] tracking-[0.02em]">
                  Nikita Beshta
                </h2>
                <p className="mt-3 font-serif text-[13px] tracking-[0.2em] text-[#6a6258] uppercase">
                  Ukraine
                </p>
              </div>

              <div className="space-y-6 font-serif text-[14px] leading-[1.75] tracking-[0.015em] text-[#2f2b27]">
                <p>
                  The collection is formed as a quiet field of attention, bringing together works that privilege surface, restraint, and the slow pressure of looking.
                </p>
                <p>
                  Rather than following chronology or medium, the selection is guided by atmosphere: muted color, architectural silence, fragments of landscape, and the material presence of the hand.
                </p>
                <p>
                  Each work is allowed to remain singular while entering into conversation with the others, creating a rhythm closer to an editorial sequence than a conventional archive.
                </p>
                <p>
                  The digital exhibition extends this approach through space, distance, and movement, inviting the viewer to navigate the collection as a private room without fixed walls.
                </p>
              </div>

              <div className="mt-auto flex justify-end pt-12">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border border-[#1a1a1a]/20 text-[#1a1a1a] transition-colors hover:border-[#1a1a1a]/40"
                  aria-label="Close collection text"
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
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
