import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import type { SavedWord, SavedWordContext } from "../types";

interface LibraryState {
  savedWords: SavedWord[];
  addWord: (
    word: string,
    meaning: string,
    pronunciation: string,
    context: SavedWordContext
  ) => void;
  removeWord: (id: string) => void;
  // 習熟度を更新するアクション（例：0 -> 1 -> 2 -> 0... とローテーション）
  toggleMastery: (id: string) => void;
}

export const useLibraryStore = create(
  persist<LibraryState>(
    (set, get) => ({
      savedWords: [],

      addWord: (word, meaning, pronunciation, context) => {
        // 既に同じ単語が同じ文脈（曲・場所）で登録されていないかチェック
        const exists = get().savedWords.some(
          (w) =>
            w.word === word &&
            w.context.youtubeUrl === context.youtubeUrl &&
            Math.abs(w.context.timestamp - context.timestamp) < 1 // 1秒以内の誤差は同じとみなす
        );

        if (exists) return; // 重複登録を防ぐ

        const newWord: SavedWord = {
          id: nanoid(),
          word,
          meaning,
          pronunciation,
          context,
          masteryLevel: 0,
          registeredAt: new Date().toISOString(),
        };

        set({ savedWords: [newWord, ...get().savedWords] });
      },

      removeWord: (id) => {
        set({
          savedWords: get().savedWords.filter((w) => w.id !== id),
        });
      },

      toggleMastery: (id) => {
        set({
          savedWords: get().savedWords.map((w) =>
            w.id === id
              ? {
                  ...w,
                  masteryLevel: w.masteryLevel >= 2 ? 0 : w.masteryLevel + 1,
                }
              : w
          ),
        });
      },
    }),
    { name: "library-storage" }
  )
);
