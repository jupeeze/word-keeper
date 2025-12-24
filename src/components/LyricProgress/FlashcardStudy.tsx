import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { speak } from "@/utils/speechUtils";
import { Progress } from "@/components/ui/progress";
import type { FlashcardStudyProps } from "./types";
import { useFilteredVocabulary } from "./hooks/useFilteredVocabulary";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";

export const FlashcardStudy = ({
  language,
  vocabulary,
  onComplete,
  isReviewMode = false,
}: FlashcardStudyProps) => {
  // Use custom hook for vocabulary filtering
  const { filteredVocabulary } = useFilteredVocabulary({
    vocabulary,
    showToast: true,
    reviewMode: isReviewMode,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewedCards, setViewedCards] = useState<Set<number>>(() => {
    if (isReviewMode) {
      return new Set(filteredVocabulary.map((_, index) => index));
    }
    return new Set();
  });

  const currentWord = filteredVocabulary[currentIndex];
  const allViewed = viewedCards.size === filteredVocabulary.length;

  // Auto-speak current word
  useEffect(() => {
    if (!isFlipped && currentWord) {
      speak(currentWord.word, { lang: language });
    }
  }, [currentIndex, isFlipped, currentWord?.word, language]);

  // Auto-complete if all words are already memorized
  useEffect(() => {
    if (filteredVocabulary.length === 0) {
      onComplete();
    }
  }, [filteredVocabulary.length, onComplete]);

  // If no vocabulary to test, show empty state
  if (filteredVocabulary.length === 0) {
    return (
      <Card>
        <CardHeader></CardHeader>
        <CardContent></CardContent>
        <CardFooter></CardFooter>
      </Card>
    );
  }

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
    if (!isFlipped) {
      setViewedCards((prev) => new Set(prev).add(currentIndex));
    }
  }, [isFlipped, currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < filteredVocabulary.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  }, [currentIndex, filteredVocabulary.length]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const handleReset = useCallback(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    // Don't clear viewedCards - preserve the history
  }, []);

  // Use keyboard navigation hook
  useKeyboardNavigation({
    onFlip: handleFlip,
    onNext: handleNext,
    onPrevious: handlePrevious,
    canNavigateNext: viewedCards.has(currentIndex),
    enabled: filteredVocabulary.length > 0,
  });

  return (
    <Card>
      {/* Progress indicator */}
      <CardHeader>
        <Progress
          current={currentIndex + 1}
          total={filteredVocabulary.length}
          label="単語"
        />
      </CardHeader>

      {/* Flashcard */}
      <CardContent
        className="perspective-1000 relative w-full cursor-pointer"
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            handleFlip();
          }
        }}
        aria-label={
          !isFlipped
            ? "フラッシュカードをめくって意味を見る"
            : "フラッシュカードをめくって単語に戻る"
        }
        aria-pressed={isFlipped}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isFlipped ? "back" : "front"}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.4, type: "spring" }}
            className="h-full w-full"
          >
            <Card className="glass-card hover:shadow-glow h-full border-4 border-cyan-400 transition-all duration-300">
              <CardContent className="flex h-full flex-col items-center justify-center">
                {!isFlipped ? (
                  // Front: Word and reading
                  <>
                    <p className="mb-2 text-3xl font-medium text-purple-600">
                      {currentWord.reading}
                    </p>
                    <p className="text-gradient-primary mb-2 text-6xl font-bold">
                      {currentWord.word}
                    </p>
                  </>
                ) : (
                  // Back: Meaning
                  <>
                    <p className="mb-2 text-center text-4xl font-bold text-blue-800">
                      {currentWord.meaning}
                    </p>
                  </>
                )}
              </CardContent>
              <CardFooter>
                <div
                  className="glass-panel flex w-full items-center justify-center py-3"
                  role="status"
                  aria-live="polite"
                >
                  <p className="text-sm font-medium text-gray-600">
                    {!isFlipped
                      ? "タップして意味を見る"
                      : "タップして単語に戻る"}
                  </p>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </AnimatePresence>
      </CardContent>

      {/* Navigation buttons */}
      <CardFooter className="flex w-full gap-4">
        <Button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          variant="outline"
          className="glass-panel flex-1 transition-all duration-300 hover:bg-white/60"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          前へ
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          className="glass-panel transition-all duration-300 hover:bg-white/60"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        {allViewed && currentIndex === filteredVocabulary.length - 1 ? (
          <Button
            onClick={onComplete}
            className="h-full flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:from-purple-700 hover:to-pink-700 hover:shadow-xl"
          >
            学習完了 ✓
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={
              currentIndex === filteredVocabulary.length - 1 ||
              !viewedCards.has(currentIndex)
            }
            variant="outline"
            className="glass-panel flex-1 transition-all duration-300 hover:bg-white/60"
          >
            次へ
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
