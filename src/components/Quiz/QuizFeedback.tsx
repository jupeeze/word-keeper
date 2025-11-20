import type { FeedbackType } from "@/types";
import { FEEDBACK_TEXT } from "@/constants/ui";
import { getFeedbackClassName } from "@/utils/quizUtils";

interface QuizFeedbackProps {
    feedback: FeedbackType | null;
    className?: string;
}

/**
 * クイズのフィードバック表示コンポーネント
 * 正解/不正解/タイムアウトのフィードバックを表示する
 */
export const QuizFeedback = ({ feedback, className = "" }: QuizFeedbackProps) => {
    const feedbackClass = getFeedbackClassName(feedback);

    return (
        <div
            className={`text-3xl font-bold transition-opacity duration-300 ${feedbackClass} ${className}`}
        >
            {feedback && FEEDBACK_TEXT[feedback]}
        </div>
    );
};
