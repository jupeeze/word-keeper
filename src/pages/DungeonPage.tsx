import { DungeonBattle } from "@/components/Dungeon/DungeonBattle";
import { DungeonResult } from "@/components/Dungeon/DungeonResult";
import { Button } from "@/components/ui/button";
import { useDungeonStore } from "@/stores/dungeonStore";
import { useLibraryStore } from "@/stores/libraryStore";

type Props = {
  setPage: (page: "quiz" | "library" | "dashboard" | "dungeon") => void;
};

export const DungeonPage = ({ setPage }: Props) => {
  const { startBattle, isBattle, isGameOver } = useDungeonStore();
  const { collectedWords } = useLibraryStore();

  if (isGameOver) {
    return <DungeonResult setPage={setPage} />;
  }

  return (
    <div className="p-4 flex flex-col items-center gap-4">
      {!isBattle ? (
        <>
          <h1 className="text-2xl font-bold">忘却の遺跡</h1>
          <p>集めた言葉の力で、忘却の獣に立ち向かえ！</p>
          <Button
            onClick={() => startBattle(collectedWords)}
            disabled={collectedWords.length < 4}
          >
            {collectedWords.length < 4
              ? "単語を4つ以上収集してください"
              : "挑戦する"}
          </Button>
          <Button onClick={() => setPage("dashboard")} variant="secondary">
            書斎に戻る
          </Button>
        </>
      ) : (
        <DungeonBattle />
      )}
    </div>
  );
};
