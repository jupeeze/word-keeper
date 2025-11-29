import { useState, useEffect } from "react";
import { ProgressIndicator, FlippableCard, NavigationControls } from "@/components/ui";
import type { Vocabulary } from "@/types";
import { speakKorean } from "@/utils/speechUtils";
import { Progress } from "@/components/ui/progress";

interface FlashcardStudyProps {
    vocabulary: Vocabulary[];
    onComplete: () => void;
    isReviewMode?: boolean; // If true, all cards are pre-marked as viewed
}

export const FlashcardStudy = ({
    vocabulary,
    onComplete,
    isReviewMode = false,
}: FlashcardStudyProps) => {
    // Filter out words without reading property
    const filteredVocabulary = vocabulary.filter(word => word.reading);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [viewedCards, setViewedCards] = useState<Set<number>>(() => {
        // In review mode, mark all cards as viewed from the start
        if (isReviewMode) {
            return new Set(filteredVocabulary.map((_, index) => index));
        }
        return new Set();
    });

    const currentWord = filteredVocabulary[currentIndex];
    const allViewed = viewedCards.size === filteredVocabulary.length;

    useEffect(() => {
        if (!isFlipped) {
            speakKorean(currentWord.word);
        }
    }, [currentIndex, isFlipped]);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
        if (!isFlipped) {
            setViewedCards((prev) => new Set(prev).add(currentIndex));
        }
    };

    const handleNext = () => {
        if (currentIndex < filteredVocabulary.length - 1) {
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

    // Front content: Korean word
    const frontContent = (
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
    );

    // Back content: Japanese meaning
    const backContent = (
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
    );

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
            {/* Progress indicator */}
            <ProgressIndicator
                current={currentIndex + 1}
                total={filteredVocabulary.length}
                completed={viewedCards.size}
                showCompleted
                label="単語"
            />

            <Progress current={currentIndex + 1} total={filteredVocabulary.length} label="単語"></Progress>

            {/* Flashcard */}
            <FlippableCard
                isFlipped={isFlipped}
                onFlip={handleFlip}
                frontContent={frontContent}
                backContent={backContent}
                className="h-80"
            />

            {/* Navigation buttons */}
            <NavigationControls
                onPrevious={handlePrevious}
                onNext={handleNext}
                onReset={handleReset}
                onComplete={onComplete}
                canGoPrevious={currentIndex > 0}
                canGoNext={currentIndex < filteredVocabulary.length - 1 && viewedCards.has(currentIndex)}
                showComplete={allViewed && currentIndex === filteredVocabulary.length - 1}
            />
        </div>
    );
};
