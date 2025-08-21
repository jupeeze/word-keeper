import { Button } from "@/components/ui/button";
import { useStreakStore } from "../stores/streakStore";

type Props = {
  setPage: (page: "quiz" | "library" | "dashboard" | "dungeon") => void;
};

export const Dashboard = ({ setPage }: Props) => {
  const { streak } = useStreakStore();

  return (
    <div className="p-4 flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">記憶図書館</h1>
      <p className="text-lg">
        連続学習日数: <span className="font-bold">{streak}</span> 日
      </p>
      <Button onClick={() => setPage("quiz")} variant="default">
        今日のクイズに挑戦する
      </Button>
      <Button onClick={() => setPage("dungeon")} variant="destructive">
        忘却の遺跡に挑む
      </Button>
      <Button onClick={() => setPage("library")} variant="outline">
        図鑑を見る
      </Button>
    </div>
  );
};
