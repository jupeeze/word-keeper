/**
 * 語彙データに関する共通ユーティリティ関数
 */

import type { Vocabulary } from "@/types";
import { shuffleArray } from "./arrayUtils";

/**
 * 歌詞データから重複のない語彙リストを抽出する
 * @param songData 歌詞データ（単一の曲オブジェクトまたは曲の配列）
 * @returns 重複のない語彙の配列
 */
export const extractUniqueVocabulary = (
  songData:
    | {
        lyrics: Array<{
          vocabulary: Array<{ word: string; reading: string; meaning: string }>;
        }>;
      }
    | Array<{
        lyrics: Array<{
          vocabulary: Array<{ word: string; reading: string; meaning: string }>;
        }>;
      }>,
): Vocabulary[] => {
  const allVocabulary: Vocabulary[] = [];
  const wordSet = new Set<string>();

  // 配列かどうかをチェック
  const songs = Array.isArray(songData) ? songData : [songData];

  songs.forEach((song) => {
    song.lyrics.forEach((lyric) => {
      lyric.vocabulary.forEach((vocab) => {
        if (!wordSet.has(vocab.word)) {
          wordSet.add(vocab.word);
          allVocabulary.push(vocab as Vocabulary);
        }
      });
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
  count: number = 4,
): string[] => {
  const choices = [correctAnswer];
  const correctAnswerLength = correctAnswer.length;

  // 正解以外の選択肢（ダミー選択肢）
  const distractors = allOptions.filter((option) => option !== correctAnswer);

  // 同じ文字数の選択肢を優先的に選択
  const sameLengthDistractors = distractors.filter(
    (option) => option.length === correctAnswerLength,
  );

  // シャッフルして順序をランダムにする
  const shuffledSameLength = shuffleArray([...sameLengthDistractors]);

  // まず同じ文字数の選択肢から追加
  for (const option of shuffledSameLength) {
    if (choices.length >= count) break;
    if (!choices.includes(option)) {
      choices.push(option);
    }
  }

  // 足りない場合は文字数が近い順に探す（±1, ±2, ±3...）
  const maxDiff = Math.max(
    ...distractors.map((d) => Math.abs(d.length - correctAnswerLength)),
  );

  for (let diff = 1; diff <= maxDiff && choices.length < count; diff++) {
    // 正解より短い単語（-diff）
    const shorterOptions = distractors.filter(
      (option) =>
        option.length === correctAnswerLength - diff &&
        !choices.includes(option),
    );
    for (const option of shuffleArray([...shorterOptions])) {
      if (choices.length >= count) break;
      choices.push(option);
    }

    // 正解より長い単語（+diff）
    const longerOptions = distractors.filter(
      (option) =>
        option.length === correctAnswerLength + diff &&
        !choices.includes(option),
    );
    for (const option of shuffleArray([...longerOptions])) {
      if (choices.length >= count) break;
      choices.push(option);
    }
  }

  // もし選択肢の種類が指定数未満の場合、ダミーデータを追加
  while (choices.length < count) {
    choices.push(`ダミーの選択肢${choices.length}`);
  }

  return shuffleArray(choices);
};
