import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitizePlayerName, shuffle } from "@/lib/quiz-utils";
import type { QuizQuestionPublic } from "@/lib/quiz-types";

const QUIZ_SIZE = 10;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { playerName?: string };
    const playerName = sanitizePlayerName(body.playerName ?? "");

    if (playerName.length < 2) {
      return NextResponse.json(
        { error: "Vul een naam in (minimaal 2 tekens)." },
        { status: 400 },
      );
    }

    const allQuestions = await prisma.question.findMany({
      where: { isActive: true },
      select: {
        id: true,
        questionText: true,
        imageUrl: true,
        optionA: true,
        optionB: true,
        optionC: true,
        optionD: true,
        category: true,
      },
    });

    if (allQuestions.length < QUIZ_SIZE) {
      return NextResponse.json(
        { error: "Niet genoeg vragen beschikbaar in de database." },
        { status: 500 },
      );
    }

    const selected = shuffle(allQuestions).slice(0, QUIZ_SIZE);

    const session = await prisma.quizSession.create({
      data: { playerName },
    });

    const questions: QuizQuestionPublic[] = selected.map((q) => ({
      id: q.id,
      questionText: q.questionText,
      imageUrl: q.imageUrl,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      category: q.category,
    }));

    return NextResponse.json({
      sessionId: session.id,
      questions,
    });
  } catch (error) {
    console.error("Quiz start error:", error);
    return NextResponse.json(
      { error: "Kon quiz niet starten. Controleer de databaseverbinding." },
      { status: 500 },
    );
  }
}
