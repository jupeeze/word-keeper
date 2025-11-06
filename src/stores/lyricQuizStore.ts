import { create } from "zustand";
import songData from "../data/song_data.json";

interface LyricLine {
  startTime: number;
  text: string;
  reading: string;
  translation: string;
  vocabulary: { word: string; reading: string; meaning: string }[];
}

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

// 選択肢を生成するヘルパー関数
const generateChoices = (correctTranslation: string): string[] => {
  const choices = [correctTranslation];
  // 正解以外の翻訳（ダミー選択肢）
  const distractors = allTranslations.filter((t) => t !== correctTranslation);

  // 4つの選択肢になるまでダミー選択肢を追加
  while (choices.length < 4 && distractors.length > 0) {
    const randomIndex = Math.floor(Math.random() * distractors.length);
    const randomTranslation = distractors.splice(randomIndex, 1)[0];
    if (!choices.includes(randomTranslation)) {
      choices.push(randomTranslation);
    }
  }

  // もし翻訳の種類が4つ未満の場合、ダミーデータを追加（今回は不要そうですが念のため）
  while (choices.length < 4) {
    choices.push("ダミーの翻訳" + choices.length);
  }

  return choices.sort(() => Math.random() - 0.5); // 選択肢をシャッフル
};

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
      choices: generateChoices(firstQuestion.translation),
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
        choices: generateChoices(nextQuestion.translation),
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
