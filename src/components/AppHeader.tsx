import Link from "next/link";

export function AppHeader() {
  return (
    <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-6">
      <Link href="/" className="group flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 text-2xl shadow-lg">
          🫁
        </span>
        <div>
          <p className="text-lg font-bold text-teal-900 group-hover:text-teal-700">
            iASV Quiz
          </p>
          <p className="text-sm text-teal-700">Beademing leren met plezier</p>
        </div>
      </Link>
      <Link
        href="/leaderboard"
        className="rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-teal-800 shadow ring-1 ring-teal-100 hover:bg-white"
      >
        Scoreboard
      </Link>
    </header>
  );
}
