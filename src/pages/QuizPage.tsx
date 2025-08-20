import { QuizWordInput } from "../components/Quiz/QuizWordInput";
import { Button } from "@/components/ui/button";
import { QuizProgress } from "../components/Quiz/QuizProgress";
import { useQuizStore } from "../stores/quizStore";
import { StageBackground } from "../components/Quiz/StageBackground";

type Props = { setPage: (page: "quiz" | "library" | "dashboard") => void };

export const QuizPage = ({ setPage }: Props) => {
  const theme = useQuizStore((state) => state.getCurrentTheme());

  return (
    <StageBackground>
      <div className="flex flex-col gap-4 bg-white/80 p-4 rounded-lg max-w-md mx-auto">
        <h2 className="text-xl font-bold">{theme.name}</h2>
        <QuizProgress />
        <QuizWordInput />
        <Button onClick={() => setPage("dashboard")} variant="secondary">
          戻る
        </Button>
      </div>
    </StageBackground>
  );
};
