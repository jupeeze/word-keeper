import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import type { Vocabulary } from "@/types";

interface FlashcardStudyProps {
    vocabulary: Vocabulary[];
    onComplete: () => void;
}

export const FlashcardStudy = ({
    vocabulary,
    onComplete,
}: FlashcardStudyProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [viewedCards, setViewedCards] = useState<Set<number>>(new Set());

    const currentWord = vocabulary[currentIndex];
    const allViewed = viewedCards.size === vocabulary.length;

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
        if (!isFlipped) {
            setViewedCards((prev) => new Set(prev).add(currentIndex));
        }
    };

    const handleNext = () => {
        if (currentIndex < vocabulary.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setIsFlipped(false);
        }
    };

    const handleReset = () => {
        setCurrentIndex(0);
        setIsFlipped(false);
        // Don't clear viewedCards - preserve the history
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
            {/* Progress indicator */}
            <div className="w-full glass-card p-4 rounded-2xl">
                <div className="flex justify-between text-sm text-gray-700 font-semibold mb-3">
                    <span>
                        単語 {currentIndex + 1} / {vocabulary.length}
                    </span>
                    <span className="text-purple-600">
                        確認済み: {viewedCards.size} / {vocabulary.length}
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentIndex + 1) / vocabulary.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                        className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 h-3 rounded-full shadow-glow"
                    />
                </div>
            </div>

            {/* Flashcard */}
            <div
                className="relative w-full h-80 cursor-pointer perspective-1000"
                onClick={handleFlip}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isFlipped ? "back" : "front"}
                        initial={{ rotateY: 90, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        exit={{ rotateY: -90, opacity: 0 }}
                        transition={{ duration: 0.4, type: "spring" }}
                        className="w-full h-full"
                    >
                        <Card className="w-full h-full glass-card border-0 shadow-2xl hover:shadow-glow transition-all duration-300">
                            <CardContent className="flex flex-col items-center justify-center h-full p-8">
                                {!isFlipped ? (
                                    // Front: Korean word
                                    <>
                                        <p className="text-6xl font-bold text-gradient-primary mb-4">
                                            {currentWord.word}
                                        </p>
                                        <p className="text-3xl text-purple-600 mb-8 font-medium">
                                            ({currentWord.reading})
                                        </p>
                                        <div className="glass-panel px-6 py-3 rounded-full">
                                            <p className="text-gray-600 text-sm font-medium">
                                                タップして意味を見る
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    // Back: Japanese meaning
                                    <>
                                        <p className="text-sm text-gray-500 mb-4 font-semibold">意味</p>
                                        <p className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                                            {currentWord.meaning}
                                        </p>
                                        <div className="mt-8 glass-panel p-6 rounded-2xl w-full">
                                            <p className="text-2xl text-purple-700 font-bold mb-2">
                                                {currentWord.word}
                                            </p>
                                            <p className="text-lg text-purple-500">
                                                ({currentWord.reading})
                                            </p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-4 w-full">
                <Button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    variant="outline"
                    className="flex-1 glass-panel hover:bg-white/60 transition-all duration-300"
                >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    前へ
                </Button>
                <Button
                    onClick={handleReset}
                    variant="outline"
                    className="glass-panel hover:bg-white/60 transition-all duration-300"
                >
                    <RotateCcw className="w-4 h-4" />
                </Button>
                {allViewed ? (
                    <Button
                        onClick={onComplete}
                        className="flex-1 h-full text-base font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        学習完了 ✓
                    </Button>
                ) : (
                    <Button
                        onClick={handleNext}
                        disabled={currentIndex === vocabulary.length - 1 || !viewedCards.has(currentIndex)}
                        variant="outline"
                        className="flex-1 glass-panel hover:bg-white/60 transition-all duration-300"
                    >
                        次へ
                        <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                )}
            </div>
        </div>
    );
};
