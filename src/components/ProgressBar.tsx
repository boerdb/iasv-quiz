"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      <div className="mb-2 flex justify-between text-sm font-medium text-teal-800">
        <span>Vraag {current} van {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-4 overflow-hidden rounded-full bg-teal-100">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-amber-300"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
