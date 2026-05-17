"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-[#070A12] flex items-center justify-center">

      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-center"
      >
        <div className="w-10 h-10 border border-white/20 border-t-pink-500 rounded-full animate-spin mx-auto" />

        <p className="text-white/40 text-xs mt-3 tracking-widest">
          loading memories...
        </p>
      </motion.div>

    </div>
  );
}