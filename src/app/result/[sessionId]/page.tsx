"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import confetti from "canvas-confetti";
import { AppHeader } from "@/components/AppHeader";
import { ScoreDisplay } from "@/components/ScoreDisplay";
import { WrongAnswerReviewList } from "@/components/WrongAnswerReview";
import type { QuizSubmitResult } from "@/lib/quiz-types";

export default function ResultPage() {
  const params = useParams<{ sessionId: string }>();
  const sessionId = params.sessionId;
  const [result, setResult] = useState<QuizSubmitResult | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(`result-${sessionId}`);
    if (!raw) return;
    const parsed = JSON.parse(raw) as QuizSubmitResult;
    setResult(parsed);

    if (parsed.score >= 8) {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [sessionId]);

  if (!result) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-sky-100 via-teal-50 to-amber-50">
        <AppHeader />
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <p className="rounded-2xl bg-amber-50 p-6 text-amber-900">
            Geen resultaat gevonden. Start een nieuwe quiz!
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-teal-500 px-6 py-3 font-semibold text-white"
          >
            Naar start
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-teal-50 to-amber-50">
      <AppHeader />
      <div className="mx-auto max-w-3xl space-y-8 px-4 pb-16 pt-2">
        <ScoreDisplay
          score={result.score}
          total={result.total}
          message={result.message}
        />

        <WrongAnswerReviewList wrongAnswers={result.wrongAnswers} />

        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-3 font-semibold text-white shadow"
          >
            Nieuwe quiz
          </Link>
          <Link
            href="/leaderboard"
            className="rounded-2xl bg-white px-6 py-3 font-semibold text-teal-800 shadow ring-1 ring-teal-100"
          >
            Scoreboard
          </Link>
        </div>
      </div>
    </main>
  );
}
