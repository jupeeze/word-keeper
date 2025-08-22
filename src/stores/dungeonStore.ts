import { create } from "zustand";

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
  challengeWord: string; // 出題される単語
  setChallengeWord: (word: string) => void;
  timeLimit: number; // 制限時間（秒）
  setTimeLimit: (time: number) => void;
  isBattle: boolean;
  isGameOver: boolean;
  incorrectWord: string | null;
  startBattle: (words: string[]) => void;
  endBattle: () => void;
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

export const useDungeonStore = create<DungeonState>((set, get) => ({
  monster: null,
  challengeWord: "",
  timeLimit: 30,
  isBattle: false,
  isGameOver: false,
  incorrectWord: null,

  setMonster: (monster) => set({ monster }),
  setChallengeWord: (word) => set({ challengeWord: word }),
  setTimeLimit: (time) => set({ timeLimit: time }),

  // 戦闘開始処理
  startBattle: (words) => {
    // 利用可能な単語リストからランダムに単語を選ぶ
    const randomWord = words[Math.floor(Math.random() * words.length)];
    set({
      isBattle: true,
      isGameOver: false,
      incorrectWord: null,
      monster: { ...initialMonster },
      challengeWord: randomWord,
      timeLimit: 30,
    });
  },

  // 戦闘終了処理
  endBattle: () => set({ isBattle: false }),

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
