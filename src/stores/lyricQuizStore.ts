import { create } from "zustand";
import songData from "../data/song_data.json";
import type { LyricLine } from "@/types";
import { generateChoices } from "@/utils/vocabularyUtils";

interface LyricQuizState {
  lyrics: LyricLine[];
  currentLyricIndex: number;
  currentQuestion: LyricLine | null;
  choices: string[]; // 日本語翻訳の選択肢
  isQuizComplete: boolean;
  score: number;
  startQuiz: () => void;
  nextQuestion: () => void;
  handleAnswer: (selectedTranslation: string) => boolean; // 正解ならtrueを返す
}

// すべての翻訳をリスト化
const allTranslations = songData.lyrics.map((l) => l.translation);

export const useLyricQuizStore = create<LyricQuizState>((set, get) => ({
  lyrics: songData.lyrics,
  currentLyricIndex: -1,
  currentQuestion: null,
  choices: [],
  isQuizComplete: false,
  score: 0,

  startQuiz: () => {
    const firstQuestion = get().lyrics[0];
    set({
      currentLyricIndex: 0,
      currentQuestion: firstQuestion,
      choices: generateChoices(firstQuestion.translation, allTranslations),
      isQuizComplete: false,
      score: 0,
    });
  },

  nextQuestion: () => {
    const nextIndex = get().currentLyricIndex + 1;
    if (nextIndex >= get().lyrics.length) {
      // クイズが終了した場合
      set({ isQuizComplete: true, currentQuestion: null, choices: [] });
    } else {
      // 次の質問へ
      const nextQuestion = get().lyrics[nextIndex];
      set({
        currentLyricIndex: nextIndex,
        currentQuestion: nextQuestion,
        choices: generateChoices(nextQuestion.translation, allTranslations),
      });
    }
  },

  handleAnswer: (selectedTranslation) => {
    const correct = selectedTranslation === get().currentQuestion?.translation;
    if (correct) {
      set((state) => ({ score: state.score + 1 }));
    }

    // すぐに次の質問へ
    get().nextQuestion();
    return correct;
  },
}));

