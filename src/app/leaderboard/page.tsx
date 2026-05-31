"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import type { LeaderboardEntry } from "@/lib/quiz-types";

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/leaderboard");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error ?? "Kon scoreboard niet laden.");
        }
        setEntries(data.entries ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Er ging iets mis.");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-teal-50 to-amber-50">
      <AppHeader />
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-2">
        <section className="rounded-[2rem] bg-white/90 p-8 shadow-xl ring-1 ring-teal-100">
          <h1 className="text-3xl font-black text-teal-900">Scoreboard 🏆</h1>
          <p className="mt-2 text-slate-600">Top 20 recente quizresultaten</p>

          {loading && <p className="mt-8 text-teal-700">Laden...</p>}
          {error && (
            <p className="mt-8 rounded-xl bg-rose-50 p-4 text-rose-700">{error}</p>
          )}

          {!loading && !error && entries.length === 0 && (
            <p className="mt-8 rounded-xl bg-amber-50 p-4 text-amber-900">
              Nog geen scores. Wees de eerste!
            </p>
          )}

          <ol className="mt-8 space-y-3">
            {entries.map((entry, index) => (
              <li
                key={entry.id}
                className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-white to-teal-50 px-4 py-3 ring-1 ring-teal-100"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500 font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-800">{entry.playerName}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(entry.completedAt).toLocaleString("nl-NL")}
                    </p>
                  </div>
                </div>
                <span className="text-2xl font-black text-teal-700">
                  {entry.score}/10
                </span>
              </li>
            ))}
          </ol>

          <Link
            href="/"
            className="mt-8 inline-block rounded-2xl bg-teal-500 px-6 py-3 font-semibold text-white"
          >
            Start quiz
          </Link>
        </section>
      </div>
    </main>
  );
}
