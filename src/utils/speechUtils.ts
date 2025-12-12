/**
 * 音声合成に関する共通ユーティリティ関数
 */

import type { Language } from "@/types";
import { toast } from "sonner";

export interface SpeechOptions {
  lang: Language;
  rate?: number;
  pitch?: number;
  volume?: number;
  onError?: (error: string) => void;
}

/**
 * 多言語対応の音声合成を実行する
 * @param text 読み上げるテキスト
 * @param options 音声合成のオプション
 */
export const speak = (text: string, options: SpeechOptions): void => {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    const errorMsg = "音声合成はサポートされていません。";
    console.warn(errorMsg);
    if (options.onError) {
      options.onError(errorMsg);
    } else {
      toast.warning("音声再生できません", {
        description: "お使いのブラウザは音声合成をサポートしていません。",
      });
    }
    return;
  }

  window.speechSynthesis.cancel(); // 既存の発話をキャンセル

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = options.lang; // デフォルトは韓国語（後方互換性）
  utterance.rate = options.rate ?? 0.9; // デフォルトは少しゆっくり
  utterance.pitch = options.pitch ?? 1.0;
  utterance.volume = options.volume ?? 1.0;

  utterance.onerror = (event) => {
    const errorMsg = `音声合成エラー: ${event.error}`;
    console.error(errorMsg);
    if (options.onError) {
      options.onError(errorMsg);
    } else {
      toast.error("音声再生エラー", {
        description: "音声の再生中にエラーが発生しました。",
      });
    }
  };

  window.speechSynthesis.speak(utterance);
};

/**
 * 音声合成をキャンセルする
 */
export const cancelSpeech = (): void => {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};

/**
 * 音声合成の初期化（iOS/Chromeの自動再生ポリシー対策）
 * ユーザーのインタラクションをトリガーに無音の音声を再生する
 */
export const initializeSpeech = (): void => {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    const utterance = new SpeechSynthesisUtterance("");
    window.speechSynthesis.speak(utterance);
  }
};
