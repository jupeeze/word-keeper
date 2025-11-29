/**
 * 音声合成に関する共通ユーティリティ関数
 */

export interface SpeechOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

/**
 * 韓国語の音声合成を実行する
 * @param text 読み上げるテキスト
 * @param options 音声合成のオプション
 */
export const speakKorean = (
  text: string,
  options: SpeechOptions = {},
): void => {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    console.warn("音声合成はサポートされていません。");
    return;
  }

  window.speechSynthesis.cancel(); // 既存の発話をキャンセル

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = options.lang || "ko-KR"; // デフォルトは韓国語
  utterance.rate = options.rate ?? 0.9; // デフォルトは少しゆっくり
  utterance.pitch = options.pitch ?? 1.0;
  utterance.volume = options.volume ?? 1.0;

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
