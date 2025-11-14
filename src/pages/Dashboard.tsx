// src/pages/Dashboard.tsx

import { Button } from "@/components/ui/button";
import { useStreakStore } from "../stores/streakStore";

import type { PageName } from "../App";

type Props = { setPage: (page: PageName) => void };

export const Dashboard = ({ setPage }: Props) => {
  const { streak } = useStreakStore();

  return (
    <div className="p-4 flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">魔法言語学者の書斎</h1>
      <p className="text-lg">
        連続研究日数: <span className="font-bold">{streak}</span> 日
      </p>
      <Button onClick={() => setPage("quiz")} variant="default">
        今日の古文書を解読する
      </Button>
      <Button onClick={() => setPage("dungeon")} variant="destructive">
        忘却の遺跡に挑む
      </Button>
      <Button onClick={() => setPage("library")} variant="outline">
        ワーズ・グリモワールを見る
      </Button>
      <Button onClick={() => setPage("lyricPlayer")} variant="outline">
        歌詞同期プレイヤー (K-Pop)
      </Button>
      <Button onClick={() => setPage("speedReadingTrainer")} variant="outline">
        スピード単語クイズ (韓国語)
      </Button>
    </div>
  );
};
