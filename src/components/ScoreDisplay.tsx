"use client";

import { motion } from "framer-motion";

interface ScoreDisplayProps {
  score: number;
  total: number;
  message: string;
}

export function ScoreDisplay({ score, total, message }: ScoreDisplayProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="rounded-3xl bg-gradient-to-br from-teal-500 to-cyan-500 p-8 text-center text-white shadow-xl"
    >
      <p className="mb-2 text-lg font-medium opacity-90">Jouw score</p>
      <div className="mb-4 text-7xl font-black">{score}</div>
      <p className="text-2xl font-semibold opacity-90">/ {total}</p>
      <p className="mt-4 text-lg">{message}</p>
    </motion.div>
  );
}
