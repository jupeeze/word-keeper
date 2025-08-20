import { Progress } from "@/components/ui/progress";
import { useQuizStore } from "../../stores/quizStore";

export const QuizProgress = () => {
  const { currentWordIndex, wordsPerStage, currentStage } = useQuizStore();
  const total = wordsPerStage[currentStage - 1].length;
  const progress = (currentWordIndex / total) * 100;

  return (
    <div className="w-full my-2">
      <Progress value={progress} className="h-4 rounded-lg" />
      <p className="text-sm mt-1 text-right">
        {currentWordIndex} / {total} 単語
      </p>
    </div>
  );
};
