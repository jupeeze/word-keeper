import { Progress } from "@/components/ui/progress";
import { calculateProgress } from "@/utils/quizUtils";

interface QuizTimerProps {
    timeLeft: number;
    timeLimit: number;
    className?: string;
}

/**
 * クイズのタイマー表示コンポーネント
 * 残り時間をプログレスバーで視覚化する
 */
export const QuizTimer = ({
    timeLeft,
    timeLimit,
    className = "",
}: QuizTimerProps) => {
    const progress = calculateProgress(timeLeft, timeLimit);

    return (
        <Progress
            value={progress}
            className={`h-4 ${className}`}
        />
    );
};
