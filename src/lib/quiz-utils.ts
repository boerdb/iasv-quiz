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
