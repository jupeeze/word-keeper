import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QuizChoiceGrid } from "@/components/Quiz/QuizChoiceGrid";
import { QuizFeedback } from "@/components/Quiz/QuizFeedback";
import { FEEDBACK_CONFIG } from "@/constants/quiz";
import type { Vocabulary, FeedbackType } from "@/types";
import { generateChoices } from "@/utils/vocabularyUtils";

interface VocabularyTestProps {
    vocabulary: Vocabulary[];
    onComplete: () => void;
    onUpdateMastery: (word: string, isCorrect: boolean) => void;
}

export const VocabularyTest = ({
    vocabulary,
    onComplete,
    onUpdateMastery,
}: VocabularyTestProps) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [choices, setChoices] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<FeedbackType | null>(null);
    const [incorrectWords, setIncorrectWords] = useState<string[]>([]);

    const currentWord = vocabulary[currentQuestionIndex];
    const allMeanings = vocabulary.map((v) => v.word);

    // Generate choices when question changes
    useEffect(() => {
        if (currentWord) {
            setChoices(generateChoices(currentWord.word, allMeanings, 4));
        }
    }, [currentQuestionIndex, currentWord]);

    const handleAnswer = (selectedWord: string) => {
        const isCorrect = selectedWord === currentWord.word;

        // Update word mastery
        onUpdateMastery(currentWord.word, isCorrect);

        if (isCorrect) {
            // Show correct feedback
            setFeedback("correct");
            setTimeout(() => {
                setFeedback(null);
                // Move to next question
                if (currentQuestionIndex < vocabulary.length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                } else {
                    // All questions answered correctly
                    onComplete();
                }
            }, FEEDBACK_CONFIG.DISPLAY_DURATION_MS);
        } else {
            // Show incorrect feedback
            setFeedback("incorrect");
            setIncorrectWords([...incorrectWords, currentWord.word]);

            setTimeout(() => {
                setFeedback(null);
                // Restart from beginning on incorrect answer
                setCurrentQuestionIndex(0);
                setIncorrectWords([]);
            }, FEEDBACK_CONFIG.DISPLAY_DURATION_MS * 2);
        }
    };

    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setIncorrectWords([]);
        setFeedback(null);
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
            {/* Progress */}
            <div className="w-full">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>
                        問題 {currentQuestionIndex + 1} / {vocabulary.length}
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{
                            width: `${((currentQuestionIndex + 1) / vocabulary.length) * 100}%`,
                        }}
                    />
                </div>
            </div>

            {/* Question card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                >
                    <Card className="w-full shadow-lg">
                        <CardContent className="p-8">
                            <p className="text-center text-sm text-gray-600 mb-4">
                                この意味の韓国語を選んでください
                            </p>
                            <div className="p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg text-center mb-6">
                                <p className="text-3xl font-bold text-purple-800">
                                    {currentWord.meaning}
                                </p>
                            </div>

                            {/* Choices */}
                            <QuizChoiceGrid
                                choices={choices}
                                onChoiceClick={handleAnswer}
                                className="grid-cols-2"
                            />

                            {/* Feedback */}
                            <QuizFeedback feedback={feedback} className="text-xl mt-4" />
                        </CardContent>
                    </Card>
                </motion.div>
            </AnimatePresence>

            {/* Restart button */}
            <Button onClick={handleRestart} variant="outline" className="w-full">
                最初からやり直す
            </Button>

            {/* Instructions */}
            <div className="text-center text-sm text-gray-500">
                <p>💡 全問正解で次のステップへ進めます</p>
                <p>間違えると最初からやり直しになります</p>
            </div>
        </div>
    );
};
