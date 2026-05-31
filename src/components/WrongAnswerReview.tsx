import Image from "next/image";
import type { WrongAnswerReview } from "@/lib/quiz-types";

interface WrongAnswerReviewListProps {
  wrongAnswers: WrongAnswerReview[];
}

export function WrongAnswerReviewList({
  wrongAnswers,
}: WrongAnswerReviewListProps) {
  if (wrongAnswers.length === 0) {
    return (
      <div className="rounded-3xl bg-emerald-50 p-6 text-center text-emerald-800 ring-1 ring-emerald-100">
        <p className="text-2xl">🎉</p>
        <p className="mt-2 text-lg font-semibold">Alle antwoorden goed!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-slate-800">
        Uitleg bij foute antwoorden
      </h3>
      {wrongAnswers.map((item) => (
        <article
          key={item.questionId}
          className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-rose-100"
        >
          {item.imageUrl && (
            <div className="mb-4 rounded-xl bg-teal-50 p-3">
              <Image
                src={item.imageUrl}
                alt="Illustratie"
                width={480}
                height={240}
                unoptimized
                className="mx-auto h-auto w-full max-w-sm"
              />
            </div>
          )}
          <p className="mb-3 font-semibold text-slate-800">{item.questionText}</p>
          <p className="text-sm text-rose-700">
            Jouw antwoord ({item.selectedOption}): {item.selectedText}
          </p>
          <p className="mt-1 text-sm text-emerald-700">
            Juiste antwoord ({item.correctOption}): {item.correctText}
          </p>
          <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm leading-relaxed text-amber-950">
            {item.explanation}
          </p>
        </article>
      ))}
    </div>
  );
}
