/**
 * 配列操作に関する共通ユーティリティ関数
 */

/**
 * 配列をシャッフルする
 * @param array シャッフルする配列
 * @returns シャッフルされた新しい配列
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

/**
 * 配列からランダムに指定数の要素を取得する
 * @param array 元の配列
 * @param count 取得する要素数
 * @returns ランダムに選ばれた要素の配列
 */
export const getRandomItems = <T>(array: T[], count: number): T[] => {
  return shuffleArray(array).slice(0, count);
};
