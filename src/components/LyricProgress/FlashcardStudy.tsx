import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import type { Vocabulary } from "@/types";
import { speakKorean } from "@/utils/speechUtils";
import { Progress } from "@/components/ui/progress";

interface FlashcardStudyProps {
  vocabulary: Vocabulary[];
  onComplete: () => void;
  isReviewMode?: boolean; // If true, all cards are pre-marked as viewed
}

const FlashcardStudy = ({
  vocabulary,
  onComplete,
  isReviewMode = false,
}: FlashcardStudyProps) => {
  // Filter out words without reading property
  const filteredVocabulary = vocabulary.filter((word) => word.reading);

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
            <Card className="glass-card hover:shadow-glow h-full transition-all duration-300 border-4 border-cyan-400">
              <CardContent className="flex h-full flex-col items-center justify-center">
                {!isFlipped ? (
                  // Front: Korean word
                  <>
                    <p className="mb-2 text-3xl font-medium text-purple-600">
                      {currentWord.reading}
                    </p>
                    <p className="text-gradient-primary mb-2 text-6xl font-bold">
                      {currentWord.word}
                    </p>
                  </>
                ) : (
                  // Back: Japanese meaning
                  <>
                    <p className="mb-2 text-6xl font-bold text-emerald-600">
                      {currentWord.meaning}
                    </p>
                  </>
                )}
              </CardContent>
              <CardFooter>
                <div className="glass-panel flex w-full items-center justify-center py-3">
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

export default FlashcardStudy;
