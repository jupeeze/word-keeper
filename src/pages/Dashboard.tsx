// src/pages/Dashboard.tsx

import { Button } from "@/components/ui/button";
import type { PageName } from "../App";

type Props = { setPage: (page: PageName) => void };

export const Dashboard = ({ setPage }: Props) => {
  return (
    <div className="p-4 flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">ダッシュボード</h1>
      <Button onClick={() => setPage("lyricPlayer")} variant="outline">
        歌詞同期プレイヤー (K-Pop)
      </Button>
      <Button onClick={() => setPage("lyricQuiz")} variant="outline">
        歌詞翻訳クイズ (韓国語)
      </Button>
      <Button onClick={() => setPage("speedReadingTrainer")} variant="outline">
        スピード単語クイズ (韓国語)
      </Button>
    </div>
  );
};
