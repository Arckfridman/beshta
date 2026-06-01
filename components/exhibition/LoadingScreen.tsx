"use client";

import { motion } from "framer-motion";

type LoadingScreenProps = {
  progress: number;
};

export function LoadingScreen({ progress }: LoadingScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#f8f7f3]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.h1
        className="font-serif text-[32px] tracking-[0.3em] text-[#1a1a1a] mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        NIKITA BESHTA
      </motion.h1>

      <div className="w-48 h-[1px] bg-[#1a1a1a]/10 overflow-hidden">
        <motion.div
          className="h-full bg-[#1a1a1a]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <motion.p
        className="font-sans text-[12px] tracking-[0.15em] text-[#1a1a1a]/40 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        {Math.round(progress)}%
      </motion.p>
    </motion.div>
  );
}
