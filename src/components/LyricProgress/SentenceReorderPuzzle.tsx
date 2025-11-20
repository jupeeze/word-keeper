import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, RotateCcw, CheckCircle2 } from "lucide-react";
import { shuffleArray } from "@/utils/arrayUtils";

interface SentenceReorderPuzzleProps {
    sentence: string; // 正しい文章（スペース区切り）
    translation: string; // 日本語訳
    onComplete: () => void;
}

export const SentenceReorderPuzzle = ({
    sentence,
    translation,
    onComplete,
}: SentenceReorderPuzzleProps) => {
    const [words, setWords] = useState<string[]>([]);
    const [selectedWords, setSelectedWords] = useState<string[]>([]);
    const [showHint, setShowHint] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const correctWords = sentence.split(" ");

    // Initialize shuffled words
    useEffect(() => {
        setWords(shuffleArray([...correctWords]));
    }, [sentence]);

    const handleWordClick = (word: string, index: number) => {
        if (isCorrect) return;

        // Add word to selected list
        setSelectedWords([...selectedWords, word]);
        // Remove word from available words
        setWords(words.filter((_, i) => i !== index));
    };

    const handleRemoveWord = (index: number) => {
        if (isCorrect) return;

        const word = selectedWords[index];
        // Remove from selected
        setSelectedWords(selectedWords.filter((_, i) => i !== index));
        // Add back to available words
        setWords([...words, word]);
    };

    const handleReset = () => {
        setWords(shuffleArray([...correctWords]));
        setSelectedWords([]);
        setShowHint(false);
        setIsCorrect(false);
    };

    const handleCheck = () => {
        const userAnswer = selectedWords.join(" ");
        if (userAnswer === sentence) {
            setIsCorrect(true);
            setTimeout(() => {
                onComplete();
            }, 1500);
        } else {
            // Show incorrect feedback and reset after delay
            setTimeout(() => {
                handleReset();
            }, 1000);
        }
    };

    const handleShowHint = () => {
        setShowHint(true);
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
            {/* Instructions */}
            <Card className="w-full bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-indigo-800 mb-2">
                        🧩 正しい順序に並べてください
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                        目標: <span className="font-bold">{sentence}</span>
                    </p>
                    <p className="text-sm text-gray-500">意味: {translation}</p>
                </CardContent>
            </Card>

            {/* Selected words area */}
            <div className="w-full min-h-24 p-4 bg-white border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-xs text-gray-500 mb-2">選択した順序:</p>
                <div className="flex flex-wrap gap-2">
                    <AnimatePresence>
                        {selectedWords.map((word, index) => (
                            <motion.div
                                key={`selected-${index}`}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Button
                                    onClick={() => handleRemoveWord(index)}
                                    variant="default"
                                    className="relative"
                                    disabled={isCorrect}
                                >
                                    <span className="absolute -top-2 -left-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                                        {index + 1}
                                    </span>
                                    {word}
                                </Button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {selectedWords.length === 0 && (
                        <p className="text-gray-400 italic">単語をタップして選択...</p>
                    )}
                </div>
            </div>

            {/* Available words */}
            <div className="w-full">
                <p className="text-xs text-gray-500 mb-2">利用可能な単語:</p>
                <div className="flex flex-wrap gap-3 justify-center">
                    <AnimatePresence>
                        {words.map((word, index) => (
                            <motion.div
                                key={`word-${word}-${index}`}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Button
                                    onClick={() => handleWordClick(word, index)}
                                    variant="outline"
                                    size="lg"
                                    className="text-lg font-bold hover:bg-blue-100 hover:border-blue-400"
                                    disabled={isCorrect}
                                >
                                    {word}
                                </Button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Hint */}
            {showHint && !isCorrect && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                    <p className="text-sm text-yellow-800">
                        💡 ヒント: 最初の単語は <strong>{correctWords[0]}</strong> です
                    </p>
                </motion.div>
            )}

            {/* Success message */}
            {isCorrect && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full p-6 bg-green-50 border-2 border-green-400 rounded-lg text-center"
                >
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-700">正解です！🎉</p>
                </motion.div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 w-full">
                <Button onClick={handleReset} variant="outline" className="flex-1">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    リセット
                </Button>
                {!showHint && !isCorrect && (
                    <Button
                        onClick={handleShowHint}
                        variant="outline"
                        className="flex-1"
                    >
                        <Lightbulb className="w-4 h-4 mr-2" />
                        ヒント
                    </Button>
                )}
                {selectedWords.length === correctWords.length && !isCorrect && (
                    <Button onClick={handleCheck} className="flex-1">
                        確認
                    </Button>
                )}
            </div>
        </div>
    );
};
