"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { AppHeader } from "@/components/AppHeader";
import { ProgressBar } from "@/components/ProgressBar";
import { QuizQuestion } from "@/components/QuizQuestion";
import type { OptionLetter, QuizAnswerInput, QuizQuestionPublic } from "@/lib/quiz-types";

export default function QuizPage() {
  const params = useParams<{ sessionId: string }>();
  const router = useRouter();
  const sessionId = Number(params.sessionId);

  const [questions, setQuestions] = useState<QuizQuestionPublic[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswerInput[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const raw = sessionStorage.getItem(`quiz-${sessionId}`);
    if (!raw) {
      setError("Quiz niet gevonden. Start opnieuw.");
      return;
    }
    setQuestions(JSON.parse(raw) as QuizQuestionPublic[]);
  }, [sessionId]);

  const currentQuestion = questions[currentIndex];
  const total = questions.length;

  const progressCurrent = useMemo(
    () => Math.min(currentIndex + 1, total || 1),
    [currentIndex, total],
  );

  async function submitQuiz(finalAnswers: QuizAnswerInput[]) {
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, answers: finalAnswers }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Kon quiz niet indienen.");
      }

      sessionStorage.setItem(`result-${sessionId}`, JSON.stringify(data));
      sessionStorage.removeItem(`quiz-${sessionId}`);
      router.push(`/result/${sessionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis.");
      setSubmitting(false);
    }
  }

  function handleAnswer(option: OptionLetter) {
    if (!currentQuestion || submitting) return;

    const nextAnswers = [
      ...answers,
      { questionId: currentQuestion.id, selectedOption: option },
    ];
    setAnswers(nextAnswers);

    if (currentIndex >= total - 1) {
      void submitQuiz(nextAnswers);
      return;
    }

    setCurrentIndex((index) => index + 1);
  }

  if (error && questions.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-sky-100 via-teal-50 to-amber-50">
        <AppHeader />
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <p className="rounded-2xl bg-rose-50 p-6 text-rose-700">{error}</p>
        </div>
      </main>
    );
  }

  if (!currentQuestion) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-sky-100 via-teal-50 to-amber-50">
        <AppHeader />
        <div className="mx-auto max-w-2xl px-4 py-16 text-center text-teal-800">
          Quiz laden...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-teal-50 to-amber-50">
      <AppHeader />
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-2">
        <div className="mb-6">
          <ProgressBar current={progressCurrent} total={total} />
        </div>

        {error && (
          <p className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        )}

        {submitting ? (
          <div className="rounded-3xl bg-white/90 p-10 text-center shadow-lg">
            <p className="text-4xl">✨</p>
            <p className="mt-4 text-xl font-semibold text-teal-800">
              Antwoorden nakijken...
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <QuizQuestion
              key={currentQuestion.id}
              question={currentQuestion}
              questionNumber={currentIndex + 1}
              total={total}
              onAnswer={handleAnswer}
            />
          </AnimatePresence>
        )}
      </div>
    </main>
  );
}
