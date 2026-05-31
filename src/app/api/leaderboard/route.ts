import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { LeaderboardEntry } from "@/lib/quiz-types";

export async function GET() {
  try {
    const sessions = await prisma.quizSession.findMany({
      where: { completedAt: { not: null }, score: { not: null } },
      orderBy: [{ score: "desc" }, { completedAt: "desc" }],
      take: 20,
      select: {
        id: true,
        playerName: true,
        score: true,
        completedAt: true,
      },
    });

    const entries: LeaderboardEntry[] = sessions.map((s) => ({
      id: s.id,
      playerName: s.playerName,
      score: s.score ?? 0,
      completedAt: s.completedAt?.toISOString() ?? new Date().toISOString(),
    }));

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json(
      { error: "Kon scoreboard niet laden." },
      { status: 500 },
    );
  }
}
