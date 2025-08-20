import { Button } from "@/components/ui/button";

type Props = { setPage: (page: "quiz" | "library" | "dashboard") => void };

export const Dashboard = ({ setPage }: Props) => {
  return (
    <div className="p-4 flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">記憶図書館</h1>
      <Button onClick={() => setPage("quiz")} variant="default">
        今日のクイズに挑戦する
      </Button>
      <Button onClick={() => setPage("library")} variant="outline">
        図鑑を見る
      </Button>
    </div>
  );
};
