import { QuizWordInput } from "../components/Quiz/QuizWordInput";
import { Button } from "@/components/ui/button";

type Props = { setPage: (page: "quiz" | "library" | "dashboard") => void };

export const QuizPage = ({ setPage }: Props) => {
  return (
    <div className="p-4 flex flex-col gap-4">
      <h2 className="text-xl font-bold">ステージ 1</h2>
      <QuizWordInput />
      <Button onClick={() => setPage("dashboard")} variant="secondary">
        戻る
      </Button>
    </div>
  );
};
