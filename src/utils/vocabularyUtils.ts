/**
 * 語彙データに関する共通ユーティリティ関数
 */

import type { Vocabulary } from "@/types";
import { shuffleArray } from "./arrayUtils";

/**
 * 歌詞データから重複のない語彙リストを抽出する
 * @param songData 歌詞データ
 * @returns 重複のない語彙の配列
 */
export const extractUniqueVocabulary = (songData: {
    lyrics: Array<{
        vocabulary: Array<{
            word: string;
            reading: string;
            meaning: string;
        }>;
    }>;
}): Vocabulary[] => {
    const allVocabulary: Vocabulary[] = [];
    const wordSet = new Set<string>();

    songData.lyrics.forEach((lyric) => {
        lyric.vocabulary.forEach((vocab) => {
            if (!wordSet.has(vocab.word)) {
                wordSet.add(vocab.word);
                allVocabulary.push(vocab as Vocabulary);
            }
        });
    });

    return allVocabulary;
};

/**
 * クイズの選択肢を生成する
 * @param correctAnswer 正解
 * @param allOptions すべての選択肢候補
 * @param count 生成する選択肢の数（デフォルト: 4）
 * @returns シャッフルされた選択肢の配列
 */
export const generateChoices = (
    correctAnswer: string,
    allOptions: string[],
    count: number = 4
): string[] => {
    const choices = [correctAnswer];

    // 正解以外の選択肢（ダミー選択肢）
    const distractors = allOptions.filter((option) => option !== correctAnswer);

    // 指定された数の選択肢になるまでダミー選択肢を追加
    while (choices.length < count && distractors.length > 0) {
        const randomIndex = Math.floor(Math.random() * distractors.length);
        const randomOption = distractors.splice(randomIndex, 1)[0];
        if (!choices.includes(randomOption)) {
            choices.push(randomOption);
        }
    }

    // もし選択肢の種類が指定数未満の場合、ダミーデータを追加
    while (choices.length < count) {
        choices.push(`ダミーの選択肢${choices.length}`);
    }

    return shuffleArray(choices);
};
