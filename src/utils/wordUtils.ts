import { nanoid } from "nanoid";
import type { SavedWord, SavedWordContext } from "@/types";

/**
 * 単語文字列から一意のIDを生成
 * 同じ単語は常に同じIDになるようにする
 */
export const generateWordId = (word: string): string => {
    // 単語を正規化してIDを生成
    const normalized = word.trim().toLowerCase();
    // Base64エンコードして安全なID文字列に変換
    return `word_${btoa(encodeURIComponent(normalized)).replace(/[+/=]/g, '')}`;
};

/**
 * 既存データを新しい形式にマイグレーション
 * 古い形式: { context: SavedWordContext }
 * 新しい形式: { contexts: SavedWordContext[] }
 */
export const migrateOldWordData = (oldWords: any[]): SavedWord[] => {
    if (!Array.isArray(oldWords) || oldWords.length === 0) {
        return [];
    }

    // 単語ごとにグループ化するためのMap
    const wordMap = new Map<string, SavedWord>();

    oldWords.forEach((oldWord) => {
        // 古い形式かどうかをチェック
        const isOldFormat = oldWord.context && !Array.isArray(oldWord.context);

        if (isOldFormat) {
            // 古い形式のデータを変換
            const wordId = generateWordId(oldWord.word);

            // コンテキストにIDと追加日時を付与
            const contextWithId: SavedWordContext = {
                id: nanoid(),
                ...oldWord.context,
                addedAt: oldWord.registeredAt || new Date().toISOString(),
            };

            if (wordMap.has(wordId)) {
                // 既に同じ単語が存在する場合、コンテキストを追加
                const existingWord = wordMap.get(wordId)!;
                existingWord.contexts.push(contextWithId);
                // 最終更新日時を更新
                existingWord.lastUpdatedAt = contextWithId.addedAt;
            } else {
                // 新しい単語として追加
                wordMap.set(wordId, {
                    id: wordId,
                    word: oldWord.word,
                    meaning: oldWord.meaning,
                    pronunciation: oldWord.pronunciation,
                    contexts: [contextWithId],
                    masteryLevel: oldWord.masteryLevel || 0,
                    registeredAt: oldWord.registeredAt || new Date().toISOString(),
                    lastUpdatedAt: contextWithId.addedAt,
                });
            }
        } else {
            // 既に新しい形式の場合はそのまま追加
            wordMap.set(oldWord.id, oldWord);
        }
    });

    // Mapから配列に変換して返す
    return Array.from(wordMap.values());
};

/**
 * 2つのコンテキストが実質的に同じかどうかを判定
 * 同じ曲の同じタイムスタンプ(1秒以内の誤差)なら同じとみなす
 */
export const isSameContext = (
    context1: SavedWordContext | Omit<SavedWordContext, 'id' | 'addedAt'>,
    context2: SavedWordContext | Omit<SavedWordContext, 'id' | 'addedAt'>
): boolean => {
    return (
        context1.youtubeUrl === context2.youtubeUrl &&
        Math.abs(context1.timestamp - context2.timestamp) < 1
    );
};
