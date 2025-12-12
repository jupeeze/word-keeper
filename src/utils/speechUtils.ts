/**
 * 音声合成に関する共通ユーティリティ関数
 */

export interface SpeechOptions {
  lang: "en" | "ko";
  rate?: number;
  pitch?: number;
  volume?: number;
}

/**
 * 言語コードをBCP 47形式に変換する
 * @param language Song型のlanguageプロパティ ("en" | "ko")
 * @returns BCP 47形式の言語コード (例: "en-US", "ko-KR")
 */
export const getLanguageCode = (language: "en" | "ko"): string => {
  console.log(language);

  const languageMap: Record<string, string> = {
    en: "en-US",
    ko: "ko-KR",
  };
  console.log(languageMap[language]);
  return languageMap[language];
};

/**
 * 多言語対応の音声合成を実行する
 * @param text 読み上げるテキスト
 * @param options 音声合成のオプション
 */
export const speak = (
  text: string,
  options: SpeechOptions,
): void => {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    console.warn("音声合成はサポートされていません。");
    return;
  }

  window.speechSynthesis.cancel(); // 既存の発話をキャンセル

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = getLanguageCode(options.lang); // デフォルトは韓国語（後方互換性）
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
