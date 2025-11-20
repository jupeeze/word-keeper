export interface SavedWordContext {
  songTitle: string;
  artistName: string;
  youtubeUrl: string;
  timestamp: number; // 再生開始位置（秒）
  sourceLyric: string; // その単語が使われている行
}

export interface SavedWord {
  id: string; // ユニークID
  word: string; // 韓国語単語
  meaning: string; // 日本語の意味
  pronunciation: string; // ルビ
  context: SavedWordContext; // 文脈情報
  masteryLevel: number; // 習熟度 (例: 0=未習得, 1=学習中, 2=覚えた)
  registeredAt: string; // 日付 (JSON保存用にstring型)
}

// 語彙データの型定義
export interface Vocabulary {
  word: string;
  reading: string;
  meaning: string;
}

// 歌詞行の型定義
export interface LyricLine {
  startTime: number;
  text: string;
  reading: string;
  translation: string;
  vocabulary: Vocabulary[];
}

// ページナビゲーション用のProps型
export type PageName =
  | "dashboard"
  | "quiz"
  | "library"
  | "dungeon"
  | "lyricPlayer"
  | "lyricQuiz"
  | "speedReadingTrainer";

export interface PageNavigationProps {
  setPage: (page: PageName) => void;
}

// クイズ関連の共通型定義

/**
 * フィードバックの種類
 */
export type FeedbackType = "correct" | "incorrect" | "timeout";

/**
 * クイズ履歴アイテム
 */
export interface QuizHistoryItem {
  word: string;
  isCorrect: boolean;
  reactionTime: number; // 秒単位
}

/**
 * クイズ設定
 */
export interface QuizConfig {
  timeLimit?: number; // 秒単位
  questionCount?: number;
  choiceCount?: number;
}
