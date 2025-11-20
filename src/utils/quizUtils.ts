/**
 * クイズ関連の共通ユーティリティ関数
 */

import type { FeedbackType } from "@/types";
import { FEEDBACK_CLASSES } from "@/constants/ui";

/**
 * 進行状況をパーセンテージで計算する
 * @param current 現在の位置
 * @param total 全体の数
 * @returns 進行状況のパーセンテージ（0-100）
 */
export const calculateProgress = (current: number, total: number): number => {
    if (total === 0) return 0;
    return (current / total) * 100;
};

/**
 * フィードバックタイプに応じたCSSクラス名を取得する
 * @param feedback フィードバックタイプ
 * @returns CSSクラス名の文字列
 */
export const getFeedbackClassName = (
    feedback: FeedbackType | null
): string => {
    if (!feedback) return "opacity-0";
    return FEEDBACK_CLASSES[feedback];
};

/**
 * 反応時間を秒単位でフォーマットする
 * @param milliseconds ミリ秒単位の時間
 * @param decimalPlaces 小数点以下の桁数（デフォルト: 2）
 * @returns フォーマットされた秒数
 */
export const formatReactionTime = (
    milliseconds: number,
    decimalPlaces: number = 2
): number => {
    const seconds = milliseconds / 1000;
    return parseFloat(seconds.toFixed(decimalPlaces));
};
