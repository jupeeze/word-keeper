# Word Keeper - 英語学習アプリ

洋楽の歌詞を使って楽しく英語を学習できるWebアプリケーションです。

## 主な機能

### 📺 歌詞同期プレイヤー

- YouTubeの動画と歌詞を同期して表示
- 単語をクリックして単語帳に保存
- リアルタイムで歌詞がハイライト表示
- 自動スクロール機能で現在の歌詞を追跡

### 🎯 Lyric Progress - 段階的学習システム

歌詞単位で進める包括的な学習プログラム:

1. **📖 Flashcard Study** - フラッシュカード学習
   - 歌詞に含まれる単語をカード形式で学習
   - トースト通知でスキップした単語数を表示
2. **✅ Vocabulary Test** - 語彙テスト
   - 学習した単語の4択クイズ
   - 正解率に応じた習熟度トラッキング
   - 進捗バー表示
3. **🧩 Sentence Reorder Puzzle** - 文章並び替えパズル
   - 歌詞の文章を正しい順序に並び替え
   - ドラッグ&ドロップ操作
   - 成功時のトースト通知
4. **🎤 Singing Challenge** - 歌唱チャレンジ
   - YouTubeの動画を見ながら歌詞を確認
   - 単語の発音を音声合成で確認
   - 多言語対応（英語、韓国語など）
5. **🎁 Reward Video Player** - ご褒美動画
   - 全ステップ完了後のご褒美として動画を視聴

### 📚 単語辞書

- 保存した単語を一覧表示
- 音声再生機能（多言語対応）
- 習熟度管理
- 単語の補足情報表示（短縮形の解説など）

## 技術スタック

- **フレームワーク**: React 19 + TypeScript
- **ビルドツール**: Vite
- **状態管理**: Zustand
- **UIコンポーネント**: shadcn/ui (Radix UI)
- **スタイリング**: Tailwind CSS v4
- **動画プレイヤー**: react-player
- **アニメーション**: Motion (Framer Motion)
- **通知**: Sonner (トースト通知)
- **テスティング**: Vitest + Testing Library

## プロジェクト構造

```
src/
├── components/          # 再利用可能なUIコンポーネント
│   ├── LyricProgress/   # 学習進捗関連コンポーネント
│   │   ├── FlashcardStudy.tsx      # フラッシュカード学習
│   │   ├── VocabularyTest.tsx      # 語彙テスト
│   │   ├── SingingChallenge.tsx    # 歌唱チャレンジ
│   │   ├── SentenceReorderPuzzle.tsx # 文章並び替えパズル
│   │   └── RewardVideoPlayer.tsx   # ご褒美動画プレイヤー
│   ├── LyricPlayer/     # 歌詞プレイヤー関連コンポーネント
│   │   ├── LyricLineDisplay.tsx    # 歌詞行表示
│   │   └── VocabularyWord.tsx      # 単語表示
│   ├── SongList/        # 曲リスト関連コンポーネント
│   │   └── SongCard.tsx            # 曲カード表示
│   ├── Library/         # 単語辞書関連コンポーネント
│   ├── Quiz/            # クイズ関連コンポーネント
│   └── ui/              # 基本UIコンポーネント (shadcn/ui)
├── pages/               # ページコンポーネント
│   ├── SongListPage.tsx         # 曲一覧ページ
│   ├── LyricSyncPlayer.tsx      # 歌詞同期プレイヤー
│   ├── LyricProgressPage.tsx    # 学習進捗ページ
│   └── LibraryPage.tsx          # 単語辞書ページ
├── hooks/               # カスタムフック
│   └── useWordAction.ts
├── stores/              # Zustand状態管理
│   ├── lyricProgressStore.ts    # 学習進捗状態管理
│   ├── libraryStore.ts          # 単語辞書状態管理
│   ├── songStore.ts             # 曲データ状態管理
│   ├── quizStore.ts             # クイズ状態管理
│   └── streakStore.ts           # 連続学習記録
├── utils/               # ユーティリティ関数
│   ├── arrayUtils.ts            # 配列操作
│   ├── vocabularyUtils.ts       # 語彙データ処理
│   ├── speechUtils.ts           # 音声合成（多言語対応）
│   └── quizUtils.ts             # クイズ関連ユーティリティ
├── constants/           # 定数定義
│   ├── quiz.ts                  # クイズ設定
│   └── ui.ts                    # UI設定
├── types/               # TypeScript型定義
│   └── index.ts
└── data/                # データファイル
    └── songs/                   # 曲データ（JSON形式）
```

## 開発ガイドライン

### コーディング規約

1. **型安全性**: すべての関数とコンポーネントに適切な型を定義
2. **コンポーネント設計**: 単一責任の原則に従い、再利用可能なコンポーネントを作成
3. **定数管理**: マジックナンバーを避け、`constants/`ディレクトリで管理
4. **ユーティリティ関数**: 共通ロジックは`utils/`ディレクトリに抽出
5. **JSDocコメント**: 公開関数には必ずJSDocコメントを追加

### セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview

# テストの実行
npm run test

# テストUIの起動
npm run test:ui

# テストカバレッジの確認
npm run test:coverage

# デプロイ (GitHub Pages)
npm run deploy
```

## ライセンス

MIT
