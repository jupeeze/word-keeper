// src/pages/Dashboard.tsx

import { Button } from "@/components/ui/button";
import type { PageNavigationProps } from "@/types";

export const Dashboard = ({ setPage }: PageNavigationProps) => {
  return (
    <div className="p-4 flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">ダッシュボード</h1>
      <Button onClick={() => setPage("songList")} size="lg" variant="default">
        🎵 曲一覧に戻る
      </Button>
      <Button onClick={() => setPage("library")} variant="outline">
        📚 単語辞書
      </Button>
    </div>
  );
};
