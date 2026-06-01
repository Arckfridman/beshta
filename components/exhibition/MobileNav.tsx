"use client";

import { motion, AnimatePresence } from "framer-motion";

type MobileNavProps = {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (action: string) => void;
};

export function MobileNav({ isOpen, onClose, onNavigate }: MobileNavProps) {
  const handleNavigate = (action: string) => {
    onNavigate(action);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-[70] w-3/4 max-w-sm bg-[#f8f7f3] border-l border-[#1a1a1a]/10"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-4 py-4 border-b border-[#1a1a1a]/10">
                <h2 className="font-serif text-[14px] tracking-[0.2em] text-[#1a1a1a]">
                  MENU
                </h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center"
                  aria-label="Close"
                >
                  <span className="w-6 h-[1px] bg-[#1a1a1a] rotate-45" />
                  <span className="w-6 h-[1px] bg-[#1a1a1a] -rotate-45 absolute" />
                </button>
              </div>
              <nav className="flex-1 px-4 py-8">
                <ul className="space-y-6">
                  <li>
                    <button
                      onClick={() => handleNavigate("collection")}
                      className="font-serif text-[18px] tracking-[0.15em] text-[#1a1a1a] text-left hover:opacity-60 transition-opacity"
                    >
                      Collection
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigate("contacts")}
                      className="font-serif text-[18px] tracking-[0.15em] text-[#1a1a1a] text-left hover:opacity-60 transition-opacity"
                    >
                      Contacts
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
