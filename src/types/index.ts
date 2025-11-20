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
