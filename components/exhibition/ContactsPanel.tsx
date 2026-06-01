"use client";

import { AnimatePresence, motion } from "framer-motion";

type ContactsPanelProps = {
  open: boolean;
  onClose: () => void;
};

export function ContactsPanel({ open, onClose }: ContactsPanelProps) {
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
            aria-label="Close contacts"
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
            aria-label="Contact information"
          >
            <div className="flex h-full flex-col">
              <div className="mb-8 text-right md:mb-14">
                <p className="font-serif text-[10px] tracking-[0.24em] text-[#6a6258] uppercase md:text-[12px]">
                  Inquiries
                </p>
                <h2 className="mt-3 font-serif text-[20px] leading-[1.05] tracking-[0.02em] md:mt-5 md:text-[30px]">
                  Contacts
                </h2>
                <p className="mt-2 font-serif text-[10px] tracking-[0.2em] text-[#6a6258] uppercase md:mt-3 md:text-[13px]">
                  Geneva · London
                </p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 font-serif text-[13px] leading-[1.6] tracking-[0.015em] text-[#2f2b27] md:space-y-6 md:text-[14px] md:leading-[1.75]">
                <p>
                  For acquisition inquiries, private viewings, and requests regarding works in the collection, correspondence is welcomed by appointment.
                </p>
                <p>
                  The collection maintains a discreet approach to lending, publication, and curatorial research, with each request considered in relation to context and care.
                </p>
                <p>
                  Studio visits, institutional conversations, and editorial collaborations may be arranged directly through the collection office.
                </p>
                <p>
                  <a href="mailto:collection@beshta.art" className="tracking-[0.06em] underline decoration-[#1a1a1a]/25 underline-offset-4 transition-colors hover:decoration-[#1a1a1a]">
                    collection@beshta.art
                  </a>
                </p>
              </div>

              <div className="mt-6 flex justify-end pt-6 md:mt-auto md:pt-12">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-[#1a1a1a]/20 text-[#1a1a1a] transition-colors hover:border-[#1a1a1a]/40 md:h-16 md:w-16"
                  aria-label="Close contacts"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="md:w-[22px] md:h-[22px]"
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
