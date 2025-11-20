import { Button } from "@/components/ui/button";

interface QuizChoiceGridProps {
    choices: string[];
    onChoiceClick: (choice: string) => void;
    disabled?: boolean;
    className?: string;
}

/**
 * クイズの選択肢グリッドコンポーネント
 * 4択ボタンを2x2のグリッドで表示する
 */
export const QuizChoiceGrid = ({
    choices,
    onChoiceClick,
    disabled = false,
    className = "",
}: QuizChoiceGridProps) => {
    return (
        <div className={`grid grid-cols-2 gap-3 ${className}`}>
            {choices.map((choice) => (
                <Button
                    key={choice}
                    variant="outline"
                    className="text-base p-6 h-auto whitespace-normal"
                    onClick={() => onChoiceClick(choice)}
                    disabled={disabled}
                >
                    {choice}
                </Button>
            ))}
        </div>
    );
};
