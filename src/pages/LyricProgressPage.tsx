import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Music,
  BookA,
  MicVocal,
  BookOpenCheck,
  Puzzle,
  Youtube,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  MenuDock,
  type MenuDockItem,
} from "@/components/ui/shadcn-io/menu-dock";

import {
  FlashcardStudy,
  VocabularyTest,
  SentenceReorderPuzzle,
  RewardVideoPlayer,
  SingingChallenge,
} from "@/components/LyricProgress";

import { useLyricProgressStore } from "@/stores/lyricProgressStore";
import { useSongStore } from "@/stores/songStore";

import type { PageNavigationProps, Vocabulary, LearningStep } from "@/types";

interface LyricProgressPageProps extends PageNavigationProps {
  currentSongId?: string;
}

export const LyricProgressPage = ({
  setPage,
  currentSongId,
}: LyricProgressPageProps) => {
  const { getSongById } = useSongStore();
  const {
    initializeProgress,
    getCurrentProgress,
    markLineStudied,
    markSingingCompleted,
    markLineTested,
    markPuzzleCompleted,
    markLineCompleted,
    moveToNextLine,
    updateWordMastery,
    markWordsAsMemorized,
    getCurrentLine,
  } = useLyricProgressStore();

  const [currentStep, setCurrentStep] = useState<LearningStep>("study");
  const [incorrectWord, setIncorrectWord] = useState<Vocabulary | null>(null);

  // Get song data
  const song = currentSongId ? getSongById(currentSongId) : null;
  const progress = getCurrentProgress();
  const currentProgress = getCurrentLine();

  // Initialize progress on mount
  useEffect(() => {
    if (currentSongId && song) {
      initializeProgress(currentSongId, song);
    }
  }, [currentSongId, song, initializeProgress]);

  // Determine current step based on progress
  useEffect(() => {
    if (currentProgress) {
      if (!currentProgress.isStudied) {
        setCurrentStep("study");
      } else if (!currentProgress.isTested) {
        setCurrentStep("test");
      } else if (!currentProgress.isPuzzleCompleted) {
        setCurrentStep("puzzle");
      } else if (!currentProgress.isSingingCompleted) {
        setCurrentStep("sing");
      } else if (!currentProgress.isCompleted) {
        setCurrentStep("reward");
      }
    }
  }, [currentProgress]);

  // Handle no song selected
  if (!currentSongId || !song) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              曲が選択されていません
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => setPage("songList")} size="lg">
              曲一覧に戻る
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>読み込み中...</p>
      </div>
    );
  }

  const currentLineIndex = progress.currentLineIndex;
  const currentLyric = song.lyrics[currentLineIndex];

  // Helper functions to determine if a step is accessible
  const isStepAccessible = (step: LearningStep): boolean => {
    if (!currentProgress) return false;

    switch (step) {
      case "study":
        return true; // Study is always accessible
      case "test":
        return currentProgress.isStudied; // Can access if studied
      case "puzzle":
        return currentProgress.isTested; // Can access if tested
      case "sing":
        return currentProgress.isPuzzleCompleted; // Can access if puzzle completed
      case "reward":
        return currentProgress.isSingingCompleted; // Can access if singing completed
      default:
        return false;
    }
  };

  // Check if all lines are completed
  const allCompleted = progress.totalCompletedLines === song.lyrics.length;

  const handleStudyComplete = () => {
    setIncorrectWord(null); // Reset incorrect word after completing review
    markLineStudied(currentLineIndex);
    setCurrentStep("test");
  };

  const handleTestComplete = () => {
    markLineTested(currentLineIndex);
    setCurrentStep("puzzle");
  };

  const handlePuzzleComplete = () => {
    markPuzzleCompleted(currentLineIndex);
    setCurrentStep("sing");
  };

  const handleSingingComplete = () => {
    markSingingCompleted(currentLineIndex);
    setCurrentStep("reward");
  };

  const handleRewardComplete = () => {
    // Mark all words in the current lyric line as memorized
    const words = currentLyric.vocabulary.map((vocab) => vocab.word);
    markWordsAsMemorized(words);

    markLineCompleted(currentLineIndex);
    moveToNextLine();
    setCurrentStep("study");
  };

  const handleBackToStudy = () => {
    setIncorrectWord(null);
    setCurrentStep("study");
  };

  const handleIncorrectAnswer = (word: Vocabulary) => {
    setIncorrectWord(word);
    setCurrentStep("study");
  };

  if (allCompleted) {
    return (
      <div className="gradient-primary relative flex min-h-screen items-center justify-center overflow-hidden p-4">
        {/* Animated Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 180, 0],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-purple-400/40 to-pink-400/40 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.3, 1, 1.3],
              rotate: [180, 0, 180],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-blue-400/40 to-purple-400/40 blur-3xl"
          />
        </div>

        <Card className="glass-card relative w-full max-w-lg border-0 shadow-2xl">
          <CardHeader className="pb-4 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="mb-4 text-6xl"
            >
              🎉
            </motion.div>
            <CardTitle className="text-gradient-primary text-4xl font-bold">
              完了！
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 px-8 pb-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="mb-2 text-2xl font-bold text-gray-800">
                すべての歌詞行をマスターしました！
              </p>
              <p className="text-lg text-gray-600">
                {song.title} の全 {song.lyrics.length} 行を完全に習得しました。
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 flex gap-4"
            >
              <Button
                onClick={() => setPage("songList")}
                variant="outline"
                className="glass-panel h-12 flex-1 transition-all duration-300 hover:bg-white/40"
              >
                曲一覧へ
              </Button>
              <Button
                onClick={() => setPage("library")}
                className="h-12 flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transition-all duration-300 hover:from-purple-700 hover:to-pink-700 hover:shadow-xl"
              >
                図鑑を見る
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="gradient-secondary relative min-h-screen overflow-hidden">
      <div className="relative mx-auto max-w-sm space-y-4">
        {/* Header */}
        <Card className="glass-card gap-0 py-1">
          <CardHeader className="relative h-8 flex-row justify-start">
            <Button
              onClick={() => setPage("songList")}
              variant="ghost"
              size="sm"
              className="glass-panel shrink-0 transition-all duration-300"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <CardTitle className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-2">
              <Music className="h-4 w-4 shrink-0" />
              <span className="truncate">{song.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-5 space-y-4">
            {/* Progress indicator */}
            <div className="flex w-full items-center justify-between gap-3">
              <Progress
                current={progress.totalCompletedLines}
                total={song.lyrics.length}
              />
              <span className="text-center text-sm font-semibold whitespace-nowrap text-purple-600">
                {progress.totalCompletedLines} / {song.lyrics.length}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Learning component area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === "study" && (
              <FlashcardStudy
                language={song.language}
                vocabulary={
                  incorrectWord ? [incorrectWord] : currentLyric.vocabulary
                }
                onComplete={handleStudyComplete}
                isReviewMode={currentProgress?.isStudied || false}
              />
            )}
            {currentStep === "test" && (
              <VocabularyTest
                vocabulary={currentLyric.vocabulary}
                onComplete={handleTestComplete}
                onUpdateMastery={updateWordMastery}
                onBackToStudy={handleBackToStudy}
                onIncorrectAnswer={handleIncorrectAnswer}
                currentSongId={currentSongId}
                currentLyricText={currentLyric.text}
                currentLyricStartTime={currentLyric.startTime}
              />
            )}
            {currentStep === "puzzle" && (
              <SentenceReorderPuzzle
                sentence={currentLyric.text}
                translation={currentLyric.translation}
                onComplete={handlePuzzleComplete}
              />
            )}
            {currentStep === "sing" && (
              <SingingChallenge
                language={song.language}
                lyricText={currentLyric.text}
                reading={currentLyric.reading}
                translation={currentLyric.translation}
                onComplete={handleSingingComplete}
              />
            )}
            {currentStep === "reward" && (
              <RewardVideoPlayer
                youtubeUrl={song.youtubeUrl}
                startTime={currentLyric.startTime}
                nextStartTime={
                  currentLineIndex + 1 < song.lyrics.length
                    ? song.lyrics[currentLineIndex + 1].startTime
                    : undefined
                }
                reading={currentLyric.reading}
                lyricText={currentLyric.text}
                translation={currentLyric.translation}
                onNext={handleRewardComplete}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Step progress */}
        <div className="flex items-center justify-center gap-2">
          <MenuDock
            items={
              [
                {
                  label: "study",
                  icon: BookA,
                  isComplete: currentProgress?.isStudied || false,
                },
                {
                  label: "test",
                  icon: BookOpenCheck,
                  isComplete: currentProgress?.isTested || false,
                },
                {
                  label: "puzzle",
                  icon: Puzzle,
                  isComplete: currentProgress?.isPuzzleCompleted || false,
                },
                {
                  label: "sing",
                  icon: MicVocal,
                  isComplete: currentProgress?.isSingingCompleted || false,
                },
                {
                  label: "reward",
                  icon: Youtube,
                  isComplete: currentProgress?.isCompleted || false,
                },
              ] as MenuDockItem[]
            }
            activeIndex={["study", "test", "puzzle", "sing", "reward"].indexOf(
              currentStep,
            )}
            onItemClick={(_index, item) => setCurrentStep(item.label)}
            isStepAccessible={isStepAccessible}
          />
        </div>
      </div>
    </div>
  );
};
