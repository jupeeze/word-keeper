import { QuizWordInput } from "../components/Quiz/QuizWordInput";
import { Button } from "@/components/ui/button";
import { QuizProgress } from "../components/Quiz/QuizProgress";
import { useQuizStore } from "../stores/quizStore";

type Props = { setPage: (page: "quiz" | "library" | "dashboard") => void };

export const QuizPage = ({ setPage }: Props) => {
  const { currentStage } = useQuizStore();

  return (
    <div className="p-4 flex flex-col gap-4">
      <h2 className="text-xl font-bold">ステージ {currentStage}</h2>
      <QuizProgress />
      <QuizWordInput />
      <Button onClick={() => setPage("dashboard")} variant="secondary">
        戻る
      </Button>
    </div>
  );
};
