/**
 * UI関連の定数定義
 */

import type { FeedbackType } from "@/types";

/**
 * フィードバックタイプごとのCSSクラス名マッピング
 */
export const FEEDBACK_CLASSES: Record<FeedbackType, string> = {
  correct: "opacity-100 text-green-500",
  incorrect: "opacity-100 text-red-500",
  timeout: "opacity-100 text-yellow-500",
} as const;

/**
 * フィードバックタイプごとの表示テキスト
 */
export const FEEDBACK_TEXT: Record<FeedbackType, string> = {
  correct: "正解！",
  incorrect: "不正解",
  timeout: "時間切れ",
} as const;

/**
 * アニメーション関連の設定
 */
export const ANIMATION_CONFIG = {
  /** フェードイン/アウトの時間（ミリ秒） */
  FADE_DURATION_MS: 300,
  /** スケールアニメーションの時間（ミリ秒） */
  SCALE_DURATION_MS: 300,
} as const;
