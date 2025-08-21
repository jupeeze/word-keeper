import { useDungeonStore } from "@/stores/dungeonStore";
import { Button } from "@/components/ui/button";

type Props = {
  setPage: (page: "quiz" | "library" | "dashboard" | "dungeon") => void;
};

export const DungeonResult = ({ setPage }: Props) => {
  const { incorrectWord, endBattle } = useDungeonStore();

  const handleRetry = () => {
    endBattle(); // isGameOverをリセットしてダンジョン選択画面に戻る
  };

  return (
    <div className="flex flex-col gap-4 bg-red-900/80 p-6 rounded-lg max-w-md mx-auto text-white text-center">
      <h2 className="text-2xl font-bold">詠唱失敗...</h2>
      <p>忘却の力に飲み込まれてしまった。</p>
      <div className="my-4">
        <p className="text-sm">失敗したスペル:</p>
        <p className="text-3xl font-bold tracking-widest text-yellow-300">
          {incorrectWord}
        </p>
      </div>
      <p>この言葉の力を、グリモワールで再確認しよう。</p>
      <Button onClick={handleRetry} variant="secondary">
        もう一度挑戦する
      </Button>
      <Button onClick={() => setPage("dashboard")} variant="outline">
        書斎に戻る
      </Button>
    </div>
  );
};
