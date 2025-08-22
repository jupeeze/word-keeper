import { create } from "zustand";
import wordData from "../data/word_data.json";

// 単語の型定義
interface Word {
  word: string;
  translation: string;
}

// モンスターの型定義
interface Monster {
  name: string;
  hp: number;
  maxHp: number;
  image: string; // 画像パス
}

// ダンジョンモードの状態管理
interface DungeonState {
  monster: Monster | null;
  setMonster: (monster: Monster) => void;
  challengeWord: Word | null; // 出題される単語（和訳を含む）
  setChallengeWord: (word: Word) => void;
  choices: string[]; // 選択肢
  isBattle: boolean;
  isGameOver: boolean;
  incorrectWord: string | null;
  startBattle: (words: string[]) => void;
  endBattle: () => void;
  handleCorrectAnswer: (words: string[]) => void;
  handleIncorrectAnswer: (word: string) => void;
  dealDamage: (damage: number) => void;
}

// 仮のモンスターデータ
const initialMonster: Monster = {
  name: "忘却の獣（リヴァイア）",
  hp: 100,
  maxHp: 100,
  image: "/assets/monster1.png", // 仮の画像パス
};

const getWordDataByWord = (word: string): Word | undefined => {
  return wordData.find((data) => data.word === word);
};

// 選択肢を生成するヘルパー関数
const generateChoices = (correctWord: string, allWords: string[]): string[] => {
  const choices = [correctWord];
  const distractors = allWords.filter((word) => word !== correctWord);
  while (choices.length < 4) {
    const randomIndex = Math.floor(Math.random() * distractors.length);
    const randomWord = distractors.splice(randomIndex, 1)[0];
    if (!choices.includes(randomWord)) {
      choices.push(randomWord);
    }
  }
  return choices.sort(() => Math.random() - 0.5); // シャッフル
};

export const useDungeonStore = create<DungeonState>((set, get) => ({
  monster: null,
  challengeWord: null,
  choices: [],
  isBattle: false,
  isGameOver: false,
  incorrectWord: null,

  setMonster: (monster) => set({ monster }),
  setChallengeWord: (word) => set({ challengeWord: word }),

  // 戦闘開始処理
  startBattle: (words) => {
    if (words.length < 4) return;
    const randomWordStr = words[Math.floor(Math.random() * words.length)];
    const randomWord = getWordDataByWord(randomWordStr);
    if (!randomWord) return;

    set({
      isBattle: true,
      isGameOver: false,
      incorrectWord: null,
      monster: { ...initialMonster, hp: 100 },
      challengeWord: randomWord,
      choices: generateChoices(randomWord.word, words),
    });
  },

  // 戦闘終了処理
  endBattle: () => set({ isBattle: false }),

  handleCorrectAnswer: (words) => {
    const currentMonster = get().monster;
    if (currentMonster && currentMonster.hp - 20 <= 0) {
      set({ isBattle: false, isGameOver: false }); // クリア処理
      return;
    }

    const randomWordStr = words[Math.floor(Math.random() * words.length)];
    const randomWord = getWordDataByWord(randomWordStr);
    if (!randomWord) return;

    set((state) => ({
      monster: state.monster
        ? { ...state.monster, hp: state.monster.hp - 20 }
        : null,
      challengeWord: randomWord,
      choices: generateChoices(randomWord.word, words),
    }));
  },

  handleIncorrectAnswer: (word) => {
    set({ isBattle: false, isGameOver: true, incorrectWord: word });
  },

  // モンスターにダメージを与える
  dealDamage: (damage) => {
    const currentMonster = get().monster;
    if (currentMonster) {
      const newHp = currentMonster.hp - damage;
      set({
        monster: {
          ...currentMonster,
          hp: newHp > 0 ? newHp : 0,
        },
      });
    }
  },
}));
