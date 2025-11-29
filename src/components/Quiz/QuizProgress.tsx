import { Progress } from "@/components/ui/progress";
import { useQuizStore } from "../../stores/quizStore";

export const QuizProgress = () => {
  const { currentWordIndex, words } = useQuizStore();
  const total = words.length;
  const progress = (currentWordIndex / total) * 100;

  return (
    <div className="my-2 w-full">
      <Progress value={progress} className="h-4 rounded-lg" />
      <p className="mt-1 text-right text-sm">
        {currentWordIndex} / {total} 単語
      </p>
    </div>
  );
};
