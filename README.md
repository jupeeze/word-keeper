# Word Keeper - 英語学習アプリ

洋楽の歌詞を使って楽しく英語を学習できるWebアプリケーションです。

## 主な機能

### 📺 歌詞同期プレイヤー

- YouTubeの動画と歌詞を同期して表示
- 単語をクリックして単語帳に保存
- リアルタイムで歌詞がハイライト表示

### 📝 歌詞翻訳クイズ

- 歌詞の翻訳を4択から選ぶクイズ
- 即座にフィードバックを表示
- スコア記録機能

### ⚡ スピード単語クイズ

- 制限時間内に単語の意味を当てるクイズ
- 反応時間を記録
- 履歴表示機能

### 📚 単語辞書

- 保存した単語を一覧表示
- 音声再生機能
- 習熟度管理

## 技術スタック

- **フレームワーク**: React 18 + TypeScript
- **ビルドツール**: Vite
- **状態管理**: Zustand
- **UIコンポーネント**: shadcn/ui
- **スタイリング**: Tailwind CSS
- **動画プレイヤー**: react-player

## プロジェクト構造

```
src/
├── components/          # 再利用可能なUIコンポーネント
│   ├── Quiz/           # クイズ関連コンポーネント
│   │   ├── QuizFeedback.tsx      # フィードバック表示
│   │   ├── QuizChoiceGrid.tsx    # 選択肢グリッド
│   │   ├── QuizTimer.tsx         # タイマー表示
│   │   └── ...
│   ├── LyricPlayer/    # 歌詞プレイヤー関連コンポーネント
│   │   ├── LyricLineDisplay.tsx  # 歌詞行表示
│   │   ├── VocabularyWord.tsx    # 単語表示
│   │   └── ...
│   ├── Library/        # 単語辞書関連コンポーネント
│   └── ui/             # 基本UIコンポーネント (shadcn/ui)
├── pages/              # ページコンポーネント
│   ├── Dashboard.tsx
│   ├── SpeedReadingTrainer.tsx
│   ├── LyricQuizPage.tsx
│   └── LyricSyncPlayer.tsx
├── hooks/              # カスタムフック
│   ├── useSpeedReadingQuiz.ts
│   └── useWordAction.ts
├── stores/             # Zustand状態管理
│   ├── lyricQuizStore.ts
│   ├── libraryStore.ts
│   └── ...
├── utils/              # ユーティリティ関数
│   ├── arrayUtils.ts         # 配列操作
│   ├── vocabularyUtils.ts    # 語彙データ処理
│   ├── speechUtils.ts        # 音声合成
│   └── quizUtils.ts          # クイズ関連ユーティリティ
├── constants/          # 定数定義
│   ├── quiz.ts              # クイズ設定
│   └── ui.ts                # UI設定
├── types/              # TypeScript型定義
│   └── index.ts
└── data/               # データファイル
    └── song_data.json
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
```

## ライセンス

MIT
