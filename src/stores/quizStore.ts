import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StageTheme {
  name: string;
  bgColor: string;
  bgImage?: string;
}

interface QuizState {
  currentStage: number;
  currentWordIndex: number;
  correctWords: string[];
  wordsPerStage: string[][];
  stageThemes: StageTheme[];
  nextWord: () => void;
  markCorrect: (word: string) => void;
  resetStage: () => void;
  nextStage: () => void;
  getCurrentTheme: () => StageTheme;
}

export const useQuizStore = create(
  persist<QuizState>(
    (set, get) => ({
      currentStage: 1,
      currentWordIndex: 0,
      correctWords: [],
      wordsPerStage: [
        ["apple", "book", "desk", "pen", "note"],
        ["chair", "table", "lamp", "bag", "clock"],
      ],
      stageThemes: [
        {
          name: "廃墟のオフィス街",
          bgColor: "bg-gray-800",
          bgImage: "/assets/stage1.jpg",
        },
        {
          name: "図書館ホール",
          bgColor: "bg-yellow-100",
          bgImage: "/assets/stage2.jpg",
        },
        {
          name: "空中庭園",
          bgColor: "bg-blue-200",
          bgImage: "/assets/stage3.jpg",
        },
      ],
      nextWord: () =>
        set((state) => ({ currentWordIndex: state.currentWordIndex + 1 })),
      markCorrect: (word) =>
        set((state) => ({ correctWords: [...state.correctWords, word] })),
      resetStage: () => set({ currentWordIndex: 0, correctWords: [] }),
      nextStage: () => {
        const { currentStage, wordsPerStage, resetStage } = get();
        if (currentStage < wordsPerStage.length) {
          set({ currentStage: currentStage + 1 });
        }
        resetStage();
      },
      getCurrentTheme: () => {
        const { currentStage, stageThemes } = get();
        return stageThemes[currentStage - 1] || stageThemes[0];
      },
      getProgress: () => {
        const { currentWordIndex, wordsPerStage, currentStage } = get();
        const total = wordsPerStage[currentStage - 1].length;
        return (currentWordIndex / total) * 100;
      },
    }),
    { name: "quiz-storage" }
  )
);
