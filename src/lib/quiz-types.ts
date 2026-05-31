export type OptionLetter = "A" | "B" | "C" | "D";

export interface QuizQuestionPublic {
  id: number;
  questionText: string;
  imageUrl: string | null;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  category: string;
}

export interface QuizAnswerInput {
  questionId: number;
  selectedOption: OptionLetter;
}

export interface WrongAnswerReview {
  questionId: number;
  questionText: string;
  imageUrl: string | null;
  selectedOption: OptionLetter;
  selectedText: string;
  correctOption: OptionLetter;
  correctText: string;
  explanation: string;
}

export interface QuizSubmitResult {
  score: number;
  total: number;
  message: string;
  wrongAnswers: WrongAnswerReview[];
}

export interface LeaderboardEntry {
  id: number;
  playerName: string;
  score: number;
  completedAt: string;
}
