"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AppHeader } from "@/components/AppHeader";
import type { QuizQuestionPublic } from "@/lib/quiz-types";

export default function HomePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startQuiz(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/quiz/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName: name }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Kon quiz niet starten.");
      }

      sessionStorage.setItem(
        `quiz-${data.sessionId}`,
        JSON.stringify(data.questions as QuizQuestionPublic[]),
      );

      router.push(`/quiz/${data.sessionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-teal-50 to-amber-50">
      <AppHeader />
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-4">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] bg-white/90 p-8 shadow-xl ring-1 ring-teal-100 backdrop-blur md:p-10"
        >
          <div className="mb-6 text-center">
            <p className="text-5xl">🎈</p>
            <h1 className="mt-4 text-3xl font-black text-teal-900 md:text-4xl">
              iASV Beademing Quiz
            </h1>
            <p className="mt-3 text-lg text-slate-600">
              Test je kennis over Intelligent Adaptive Support Ventilation.
              10 willekeurige vragen, score 0–10, en uitleg bij foute antwoorden!
            </p>
          </div>

          <ul className="mb-8 grid gap-3 text-sm text-slate-700 md:grid-cols-3">
            <li className="rounded-2xl bg-teal-50 px-4 py-3 text-center">
              📚 100 vragen in de bank
            </li>
            <li className="rounded-2xl bg-amber-50 px-4 py-3 text-center">
              🎲 10 random per quiz
            </li>
            <li className="rounded-2xl bg-cyan-50 px-4 py-3 text-center">
              💡 Uitleg na afloop
            </li>
          </ul>

          <form onSubmit={startQuiz} className="space-y-4">
            <label className="block">
              <span className="mb-2 block font-semibold text-teal-900">
                Hoe mogen we je noemen?
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Bijv. Lisa of Dr. Jansen"
                className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 text-lg outline-none transition focus:border-teal-400"
                maxLength={100}
                required
              />
            </label>

            {error && (
              <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-4 text-lg font-bold text-white shadow-lg disabled:opacity-60"
            >
              {loading ? "Quiz laden..." : "Start de quiz! 🚀"}
            </motion.button>
          </form>
        </motion.section>
      </div>
    </main>
  );
}
