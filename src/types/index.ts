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
  | "lyricPlayer"
  | "lyricProgress";

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

// 歌詞進行型学習モード用の型定義

/**
 * 歌詞行の習得状態
 */
export interface LyricLineProgress {
  lineIndex: number;
  isStudied: boolean; // フラッシュカードで学習完了
  isTested: boolean; // テストで全単語正解
  isPuzzleCompleted: boolean; // 並べ替えパズル完了
  isCompleted: boolean; // 全ステップ完了（報酬受け取り済み）
  completedAt?: string;
  testAttempts: number; // テスト試行回数
  puzzleAttempts: number; // パズル試行回数
}

/**
 * 単語の習得状態（個別）
 */
export interface WordMasteryState {
  word: string;
  isMemorized: boolean; // フラッシュカードで覚えた
  correctCount: number; // テストで正解した回数
  incorrectCount: number; // テストで不正解だった回数
  lastTestedAt?: string;
}

/**
 * 歌詞進行学習の全体状態
 */
export interface LyricProgressState {
  songId: string; // 曲のID（将来的に複数曲対応）
  currentLineIndex: number; // 現在学習中の行
  lineProgress: LyricLineProgress[]; // 各行の進行状態
  wordMastery: Record<string, WordMasteryState>; // 単語ごとの習得状態
  totalCompletedLines: number;
}
