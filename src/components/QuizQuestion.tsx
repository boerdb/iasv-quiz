"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { QuizImage } from "@/components/QuizImage";
import { shuffle } from "@/lib/quiz-utils";
import type { OptionLetter, QuizQuestionPublic } from "@/lib/quiz-types";

interface QuizQuestionProps {
  question: QuizQuestionPublic;
  questionNumber: number;
  total: number;
  onAnswer: (option: OptionLetter) => void;
  disabled?: boolean;
}

const displayLetters: OptionLetter[] = ["A", "B", "C", "D"];

export function QuizQuestion({
  question,
  questionNumber,
  total,
  onAnswer,
  disabled,
}: QuizQuestionProps) {
  const optionMap = {
    A: question.optionA,
    B: question.optionB,
    C: question.optionC,
    D: question.optionD,
  };

  const optionOrder = useMemo(
    () => shuffle(displayLetters),
    [question.id],
  );

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="rounded-3xl bg-white/90 p-6 shadow-lg ring-1 ring-teal-100 backdrop-blur"
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
          {question.category}
        </span>
        <span className="text-sm text-teal-700">
          {questionNumber}/{total}
        </span>
      </div>

      {question.imageUrl && (
        <div className="mb-5 overflow-hidden rounded-2xl bg-teal-50 p-4">
          <QuizImage src={question.imageUrl} alt="Illustratie bij quizvraag" />
        </div>
      )}

      <h2 className="mb-6 text-xl font-bold leading-snug text-slate-800 md:text-2xl">
        {question.questionText}
      </h2>

      <div className="grid gap-3">
        {displayLetters.map((letter, index) => (
          <motion.button
            key={letter}
            type="button"
            disabled={disabled}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            onClick={() => onAnswer(optionOrder[index])}
            className="rounded-2xl border-2 border-teal-100 bg-gradient-to-r from-white to-teal-50 px-4 py-4 text-left transition hover:border-teal-300 hover:shadow-md disabled:opacity-60"
          >
            <span className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-sm font-bold text-white">
              {letter}
            </span>
            <span className="text-slate-700">{optionMap[optionOrder[index]]}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
