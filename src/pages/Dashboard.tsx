// src/pages/Dashboard.tsx

import { Button } from "@/components/ui/button";
import type { PageNavigationProps } from "@/types";

export const Dashboard = ({ setPage }: PageNavigationProps) => {
  return (
    <div className="p-4 flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">ダッシュボード</h1>
      <Button onClick={() => setPage("lyricProgress")} size="lg">
        📖 歌詞で学習する
      </Button>
      <Button onClick={() => setPage("lyricPlayer")} variant="outline">
        歌詞同期プレイヤー (K-Pop)
      </Button>
      <Button onClick={() => setPage("lyricQuiz")} variant="outline">
        歌詞翻訳クイズ (韓国語)
      </Button>
      <Button onClick={() => setPage("speedReadingTrainer")} variant="outline">
        スピード単語クイズ (韓国語)
      </Button>
      <Button onClick={() => setPage("library")} variant="outline">
        単語辞書
      </Button>
    </div>
  );
};
