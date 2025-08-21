import { create } from "zustand";
import { persist } from "zustand/middleware";

interface QuizState {
  currentWordIndex: number;
  correctWords: string[];
  words: string[];
  nextWord: () => void;
  markCorrect: (word: string) => void;
  resetQuiz: () => void;
  getProgress: () => number;
}

export const useQuizStore = create(
  persist<QuizState>(
    (set, get) => ({
      currentWordIndex: 0,
      correctWords: [],
      words: [
        "apple",
        "book",
        "desk",
        "pen",
        "note",
        "chair",
        "table",
        "lamp",
        "bag",
        "clock",
      ],
      nextWord: () =>
        set((state) => ({ currentWordIndex: state.currentWordIndex + 1 })),
      markCorrect: (word) =>
        set((state) => ({ correctWords: [...state.correctWords, word] })),
      resetQuiz: () => set({ currentWordIndex: 0, correctWords: [] }),
      getProgress: () => {
        const { currentWordIndex, words } = get();
        const total = words.length;
        return (currentWordIndex / total) * 100;
      },
    }),
    { name: "quiz-storage" }
  )
);
