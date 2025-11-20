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
        setViewedCards(new Set());
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
            {/* Progress indicator */}
            <div className="w-full">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>
                        単語 {currentIndex + 1} / {vocabulary.length}
                    </span>
                    <span>
                        確認済み: {viewedCards.size} / {vocabulary.length}
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{
                            width: `${((currentIndex + 1) / vocabulary.length) * 100}%`,
                        }}
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
                        transition={{ duration: 0.3 }}
                        className="w-full h-full"
                    >
                        <Card className="w-full h-full shadow-lg hover:shadow-xl transition-shadow">
                            <CardContent className="flex flex-col items-center justify-center h-full p-8">
                                {!isFlipped ? (
                                    // Front: Korean word
                                    <>
                                        <p className="text-5xl font-bold text-blue-800 mb-4">
                                            {currentWord.word}
                                        </p>
                                        <p className="text-2xl text-blue-600 mb-8">
                                            ({currentWord.reading})
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            タップして意味を見る
                                        </p>
                                    </>
                                ) : (
                                    // Back: Japanese meaning
                                    <>
                                        <p className="text-sm text-gray-500 mb-4">意味</p>
                                        <p className="text-4xl font-bold text-green-700 mb-4">
                                            {currentWord.meaning}
                                        </p>
                                        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                                            <p className="text-lg text-blue-800">
                                                {currentWord.word}
                                            </p>
                                            <p className="text-sm text-blue-600">
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
                    className="flex-1"
                >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    前へ
                </Button>
                <Button onClick={handleReset} variant="outline">
                    <RotateCcw className="w-4 h-4" />
                </Button>
                <Button
                    onClick={handleNext}
                    disabled={currentIndex === vocabulary.length - 1}
                    variant="outline"
                    className="flex-1"
                >
                    次へ
                    <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
            </div>

            {/* Complete button */}
            {allViewed && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full"
                >
                    <Button onClick={onComplete} className="w-full" size="lg">
                        学習完了 ✓
                    </Button>
                </motion.div>
            )}
        </div>
    );
};
