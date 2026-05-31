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

const DISTRACTOR_EXTENSIONS = [
  " ongeacht patientinspanning of gemeten longmechanica",
  " via handmatig instellen van TV, RR en I:E-ratio",
  " zonder proximale flowsensor aan het Y-stuk",
  " alleen tijdens weaning en extubatie",
  " onafhankelijk van % MinVol en PEEP",
  " volgens vaste ventilatordefaults zonder titratie",
  " op alle ICU-ventilatoren ongeacht merk",
  " met automatische FiO2-verdubbeling bij desaturatie",
  " door AutoPEEP actief te verhogen bij obstructie",
  " zonder rekening te houden met IBW of MinVol",
  " met uitsluitend volume-gestuurde ademhalingscycli",
  " bij uitsluitend spontane ademhalingsmodi",
  " zonder closed-loop aanpassing breath-by-breath",
  " met mandatory breaths elke vier seconden vast",
];

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .split(/[\s,;().×%:/+\-]+/)
      .filter((word) => word.length > 3),
  );
}

function overlapRatio(a: string, b: string): number {
  const tokensA = tokenize(a);
  const tokensB = tokenize(b);
  let overlap = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) overlap += 1;
  }
  return overlap / Math.max(tokensA.size, 1);
}

function hashSeed(...parts: string[]): number {
  let hash = 0;
  const input = parts.join("|");
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Lengthen plausible wrong options so the longest answer is not always correct. */
export function balanceQuestionOptions<
  T extends {
    questionText: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctOption: OptionLetter;
  },
>(question: T): T {
  const texts = OPTION_LETTERS.map((letter) => optionText(letter, question));
  const correctIdx = OPTION_LETTERS.indexOf(question.correctOption);
  const correctLen = texts[correctIdx].length;
  const wrongIndices = OPTION_LETTERS.map((_, idx) => idx).filter(
    (idx) => idx !== correctIdx,
  );
  const avgWrongLen =
    wrongIndices.reduce((sum, idx) => sum + texts[idx].length, 0) /
    wrongIndices.length;

  if (correctLen < 25 || correctLen <= avgWrongLen * 1.12) {
    return question;
  }

  const targetLen = Math.max(correctLen * 0.85, avgWrongLen + 8);
  const balanced = [...texts];

  wrongIndices.forEach((idx, wrongIndex) => {
    let text = texts[idx];
    if (text.length >= targetLen) return;

    let extensionIndex =
      hashSeed(question.questionText, text, String(wrongIndex)) %
      DISTRACTOR_EXTENSIONS.length;
    let attempts = 0;

    while (text.length < targetLen && attempts < DISTRACTOR_EXTENSIONS.length) {
      const extension =
        DISTRACTOR_EXTENSIONS[
          (extensionIndex + attempts) % DISTRACTOR_EXTENSIONS.length
        ];
      attempts += 1;

      if (overlapRatio(texts[correctIdx], extension) > 0.35) continue;
      if (text.includes(extension.trim())) continue;

      text += extension;
    }

    balanced[idx] = text;
  });

  return {
    ...question,
    optionA: balanced[0],
    optionB: balanced[1],
    optionC: balanced[2],
    optionD: balanced[3],
  };
}

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
