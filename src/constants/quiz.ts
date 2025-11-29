/**
 * クイズ関連の定数定義
 */

/**
 * デフォルトのクイズ設定
 */
export const DEFAULT_QUIZ_CONFIG = {
  /** デフォルトの制限時間（秒） */
  TIME_LIMIT: 3,
  /** デフォルトの問題数 */
  QUESTION_COUNT: 10,
  /** デフォルトの選択肢数 */
  CHOICE_COUNT: 4,
  /** 履歴に保持する最大件数 */
  MAX_HISTORY_COUNT: 5,
} as const;

/**
 * タイマー関連の設定
 */
export const TIMER_CONFIG = {
  /** タイマー更新間隔（ミリ秒） */
  UPDATE_INTERVAL_MS: 100,
  /** タイマー更新間隔（秒） */
  UPDATE_INTERVAL_SEC: 0.1,
} as const;

/**
 * フィードバック関連の設定
 */
export const FEEDBACK_CONFIG = {
  /** フィードバック表示時間（ミリ秒） */
  DISPLAY_DURATION_MS: 1000,
  /** 次の問題への遷移時間（ミリ秒） */
  NEXT_QUESTION_DELAY_MS: 1000,
} as const;

/**
 * ダメージ設定
 */
export const DAMAGE_CONFIG = {
  /** 正解時のダメージ */
  CORRECT_ANSWER_DAMAGE: 20,
} as const;
