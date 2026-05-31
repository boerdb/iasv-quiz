import type { OptionLetter } from "@/lib/quiz-types";

export function sanitizePlayerName(name: string): string {
  return name.trim().replace(/\s+/g, " ").slice(0, 100);
}

export function optionText(
  option: OptionLetter,
  question: {
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
  },
): string {
  const map = {
    A: question.optionA,
    B: question.optionB,
    C: question.optionC,
    D: question.optionD,
  };
  return map[option];
}

export function scoreMessage(score: number, total: number): string {
  const ratio = score / total;
  if (ratio >= 0.9) return "Fantastisch! Je bent een iASV-expert!";
  if (ratio >= 0.7) return "Goed gedaan! Je kent iASV goed.";
  if (ratio >= 0.5) return "Niet slecht! Nog wat oefenen loont.";
  return "Blijf leren — iASV vraagt training en ervaring!";
}

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const OPTION_LETTERS: OptionLetter[] = ["A", "B", "C", "D"];

/** Verplaats antwoordteksten over A–D zodat het juiste antwoord niet altijd op A staat. */
export function shuffleQuestionOptions<
  T extends {
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctOption: OptionLetter;
  },
>(question: T): T {
  const texts = OPTION_LETTERS.map((letter) =>
    optionText(letter, question),
  );
  const correctText = optionText(question.correctOption, question);
  const shuffled = shuffle(texts);

  return {
    ...question,
    optionA: shuffled[0],
    optionB: shuffled[1],
    optionC: shuffled[2],
    optionD: shuffled[3],
    correctOption: OPTION_LETTERS[shuffled.indexOf(correctText)],
  };
}
