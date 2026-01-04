import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import type { SavedWord, SavedWordContext } from "../types";
import {
  generateWordId,
  migrateOldWordData,
  isSameContext,
} from "../utils/wordUtils";

interface LibraryState {
  savedWords: SavedWord[];
  addWord: (
    word: string,
    meaning: string,
    reading: string,
    context: Omit<SavedWordContext, "id" | "addedAt">,
    note?: string,
  ) => void;
  removeWord: (id: string) => void;
  removeContext: (wordId: string, contextId: string) => void;
  // 習熟度を更新するアクション(例: 0 -> 1 -> 2 -> 0... とローテーション)
  toggleMastery: (id: string) => void;
}

export const useLibraryStore = create(
  persist<LibraryState>(
    (set, get) => ({
      savedWords: [],

      addWord: (word, meaning, reading, context, note) => {
        const wordId = generateWordId(word);
        const existingWord = get().savedWords.find((w) => w.id === wordId);

        // 新しいコンテキストを作成
        const newContext: SavedWordContext = {
          id: nanoid(),
          ...context,
          addedAt: new Date().toISOString(),
        };

        if (existingWord) {
          // 既に同じ単語が存在する場合
          // 同じコンテキストが既に登録されていないかチェック
          const contextExists = existingWord.contexts.some((ctx) =>
            isSameContext(ctx, context),
          );

          if (contextExists) return; // 重複登録を防ぐ

          // 新しいコンテキストを追加
          set({
            savedWords: get().savedWords.map((w) =>
              w.id === wordId
                ? {
                  ...w,
                  contexts: [...w.contexts, newContext],
                  lastUpdatedAt: newContext.addedAt,
                }
                : w,
            ),
          });
        } else {
          // 新しい単語として追加
          const newWord: SavedWord = {
            id: wordId,
            word,
            meaning,
            reading,
            note,
            contexts: [newContext],
            masteryLevel: 0,
            registeredAt: new Date().toISOString(),
            lastUpdatedAt: new Date().toISOString(),
          };

          set({ savedWords: [newWord, ...get().savedWords] });
        }
      },

      removeWord: (id) => {
        set({
          savedWords: get().savedWords.filter((w) => w.id !== id),
        });
      },

      removeContext: (wordId, contextId) => {
        set({
          savedWords: get()
            .savedWords.map((w) => {
              if (w.id === wordId) {
                const updatedContexts = w.contexts.filter(
                  (ctx) => ctx.id !== contextId,
                );
                // コンテキストが0個になったら単語自体を削除
                if (updatedContexts.length === 0) {
                  return null;
                }
                return {
                  ...w,
                  contexts: updatedContexts,
                };
              }
              return w;
            })
            .filter((w): w is SavedWord => w !== null),
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
              : w,
          ),
        });
      },
    }),
    {
      name: "library-storage",
      // マイグレーション処理
      migrate: (persistedState: any) => {
        if (persistedState && persistedState.savedWords) {
          // 古い形式のデータを新しい形式に変換
          persistedState.savedWords = migrateOldWordData(
            persistedState.savedWords,
          );
        }
        return persistedState as LibraryState;
      },
      version: 1,
    },
  ),
);
