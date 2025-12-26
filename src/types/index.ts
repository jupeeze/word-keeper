// 曲データの型定義
export interface Song {
  id: string;
  title: string;
  artist: string;
  coverImage: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  language: Language;
  youtubeUrl: string;
  lyrics: LyricLine[];
}

export interface SavedWordContext {
  id: string; // コンテキストのユニークID
  songId: string; // 曲のID
  songTitle: string;
  artistName: string;
  youtubeUrl: string;
  timestamp: number; // 再生開始位置(秒)
  sourceLyric: string; // その単語が使われている行
  addedAt: string; // このコンテキストが追加された日時
}

export interface SavedWord extends Vocabulary {
  id: string; // 単語自体のユニークID (word文字列をベースに生成)
  contexts: SavedWordContext[]; // 複数のコンテキストを配列で保持
  masteryLevel: number; // 習熟度 (例: 0=未習得, 1=学習中, 2=覚えた)
  registeredAt: string; // 最初に登録された日時 (JSON保存用にstring型)
  lastUpdatedAt: string; // 最後にコンテキストが追加された日時
}

// 語彙データの型定義
export interface Vocabulary {
  word: string;
  reading: string;
  meaning: string;
  note?: string;
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
export type PageName = "songList" | "library" | "lyricPlayer" | "lyricProgress";

export type Language = "en-US" | "ko-KR";
export interface PageNavigationProps {
  setPage: (page: PageName, songId?: string) => void;
  currentSongId?: string;
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

export type LearningStep = "study" | "sing" | "test" | "puzzle" | "reward";

/**
 * 歌詞行の習得状態
 */
export interface LyricLineProgress {
  lineIndex: number;
  isStudied: boolean; // フラッシュカードで学習完了
  isTested: boolean; // テストで全単語正解
  isPuzzleCompleted: boolean; // 並べ替えパズル完了
  isSingingCompleted: boolean; // 歌唱チャレンジ完了
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
