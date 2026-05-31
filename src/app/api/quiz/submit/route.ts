import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { optionText, scoreMessage } from "@/lib/quiz-utils";
import type { OptionLetter, QuizAnswerInput, QuizSubmitResult } from "@/lib/quiz-types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      sessionId?: number;
      answers?: QuizAnswerInput[];
    };

    const sessionId = body.sessionId;
    const answers = body.answers ?? [];

    if (!sessionId || answers.length !== 10) {
      return NextResponse.json(
        { error: "Ongeldige quiz-inzending." },
        { status: 400 },
      );
    }

    const session = await prisma.quizSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json({ error: "Quiz niet gevonden." }, { status: 404 });
    }

    if (session.completedAt) {
      return NextResponse.json(
        { error: "Deze quiz is al afgerond." },
        { status: 400 },
      );
    }

    const questionIds = answers.map((a) => a.questionId);
    const questions = await prisma.question.findMany({
      where: { id: { in: questionIds } },
    });

    if (questions.length !== 10) {
      return NextResponse.json({ error: "Onbekende vragen." }, { status: 400 });
    }

    const questionMap = new Map(questions.map((q) => [q.id, q]));
    let score = 0;
    const wrongAnswers: QuizSubmitResult["wrongAnswers"] = [];

    await prisma.$transaction(async (tx) => {
      for (const answer of answers) {
        const question = questionMap.get(answer.questionId);
        if (!question) continue;

        const isCorrect = question.correctOption === answer.selectedOption;
        if (isCorrect) score += 1;

        await tx.quizAnswer.create({
          data: {
            sessionId,
            questionId: question.id,
            selectedOption: answer.selectedOption,
            isCorrect,
          },
        });

        if (!isCorrect) {
          const correctOption = question.correctOption as OptionLetter;
          const selectedOption = answer.selectedOption;
          wrongAnswers.push({
            questionId: question.id,
            questionText: question.questionText,
            imageUrl: question.imageUrl,
            selectedOption,
            selectedText: optionText(selectedOption, question),
            correctOption,
            correctText: optionText(correctOption, question),
            explanation: question.explanation,
          });
        }
      }

      await tx.quizSession.update({
        where: { id: sessionId },
        data: {
          score,
          completedAt: new Date(),
        },
      });
    });

    const result: QuizSubmitResult = {
      score,
      total: 10,
      message: scoreMessage(score, 10),
      wrongAnswers,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Quiz submit error:", error);
    return NextResponse.json(
      { error: "Kon quiz niet opslaan." },
      { status: 500 },
    );
  }
}
