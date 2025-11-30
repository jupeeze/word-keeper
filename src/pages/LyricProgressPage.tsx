import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Circle, Lock, ArrowLeft, Mic } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import {
  FlashcardStudy,
  VocabularyTest,
  SentenceReorderPuzzle,
  RewardVideoPlayer,
  SingingChallenge,
} from "@/components/LyricProgress";

import { useLyricProgressStore } from "@/stores/lyricProgressStore";
import { useSongStore } from "@/stores/songStore";

import type { PageNavigationProps, Vocabulary } from "@/types";

type LearningStep = "study" | "singing" | "test" | "puzzle" | "reward";

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
      } else if (!currentProgress.isSingingCompleted) {
        setCurrentStep("singing");
      } else if (!currentProgress.isTested) {
        setCurrentStep("test");
      } else if (!currentProgress.isPuzzleCompleted) {
        setCurrentStep("puzzle");
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
      case "singing":
        return currentProgress.isStudied; // Can access if studied
      case "test":
        return currentProgress.isSingingCompleted; // Can access if singing completed
      case "puzzle":
        return currentProgress.isTested; // Can access if tested
      case "reward":
        return currentProgress.isPuzzleCompleted; // Can access if puzzle completed
      default:
        return false;
    }
  };

  // Check if all lines are completed
  const allCompleted = progress.totalCompletedLines === song.lyrics.length;

  const handleStudyComplete = () => {
    setIncorrectWord(null); // Reset incorrect word after completing review
    markLineStudied(currentLineIndex);
    setCurrentStep("singing");
  };

  const handleSingingComplete = () => {
    markSingingCompleted(currentLineIndex);
    setCurrentStep("test");
  };

  const handleTestComplete = () => {
    markLineTested(currentLineIndex);
    setCurrentStep("puzzle");
  };

  const handlePuzzleComplete = () => {
    markPuzzleCompleted(currentLineIndex);
    setCurrentStep("reward");
  };

  const handleRewardComplete = () => {
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
    <div className="gradient-secondary relative min-h-screen overflow-hidden p-4">
      {/* Animated Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -top-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-gradient-to-br from-blue-300/30 to-purple-300/30 blur-3xl"
        />
      </div>

      <div className="relative mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <Card className="glass-card border-0 shadow-lg">
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setPage("songList")}
                variant="ghost"
                size="sm"
                className="glass-panel transition-all duration-300 hover:bg-white/40"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
            <CardTitle className="absolute top-1/2 right-0 left-0 -translate-y-1/2 text-center text-2xl">
              🎵 {song.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress indicator */}
            <Progress
              current={progress.totalCompletedLines}
              total={song.lyrics.length}
              label="全体の進行状況"
            />

            {/* Step progress */}
            <div className="flex items-center justify-center gap-2 py-4">
              <StepIndicator
                label="学習"
                isComplete={currentProgress?.isStudied || false}
                isActive={currentStep === "study"}
                isAccessible={isStepAccessible("study")}
                onClick={() =>
                  isStepAccessible("study") && setCurrentStep("study")
                }
              />
              <StepIndicator
                label="歌唱"
                isComplete={currentProgress?.isSingingCompleted || false}
                isActive={currentStep === "singing"}
                isAccessible={isStepAccessible("singing")}
                icon={<Mic className="h-5 w-5" />}
                onClick={() =>
                  isStepAccessible("singing") && setCurrentStep("singing")
                }
              />
              <StepIndicator
                label="テスト"
                isComplete={currentProgress?.isTested || false}
                isActive={currentStep === "test"}
                isAccessible={isStepAccessible("test")}
                onClick={() =>
                  isStepAccessible("test") && setCurrentStep("test")
                }
              />
              <StepIndicator
                label="パズル"
                isComplete={currentProgress?.isPuzzleCompleted || false}
                isActive={currentStep === "puzzle"}
                isAccessible={isStepAccessible("puzzle")}
                onClick={() =>
                  isStepAccessible("puzzle") && setCurrentStep("puzzle")
                }
              />
              <StepIndicator
                label="報酬"
                isComplete={currentProgress?.isCompleted || false}
                isActive={currentStep === "reward"}
                isAccessible={isStepAccessible("reward")}
                onClick={() =>
                  isStepAccessible("reward") && setCurrentStep("reward")
                }
              />
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
                vocabulary={
                  incorrectWord ? [incorrectWord] : currentLyric.vocabulary
                }
                onComplete={handleStudyComplete}
                isReviewMode={currentProgress?.isStudied || false}
              />
            )}
            {currentStep === "singing" && (
              <SingingChallenge
                lyricText={currentLyric.text}
                reading={currentLyric.reading}
                translation={currentLyric.translation}
                onComplete={handleSingingComplete}
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
                vocabulary={currentLyric.vocabulary}
                onComplete={handlePuzzleComplete}
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
                lyricText={currentLyric.text}
                translation={currentLyric.translation}
                onNext={handleRewardComplete}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Step indicator component
interface StepIndicatorProps {
  label: string;
  isComplete: boolean;
  isActive: boolean;
  isAccessible: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
}

const StepIndicator = ({
  label,
  isComplete,
  isActive,
  isAccessible,
  icon,
  onClick,
}: StepIndicatorProps) => {
  const isClickable = isAccessible && onClick;

  return (
    <motion.div
      className={`flex flex-col items-center ${isClickable ? "cursor-pointer" : ""}`}
      whileHover={{ scale: isClickable ? 1.1 : 1.05 }}
      whileTap={isClickable ? { scale: 0.95 } : {}}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={onClick}
    >
      <div
        className={`mx-1 flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 ${
          isComplete
            ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg shadow-green-500/50"
            : isActive
              ? "animate-pulse bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/50"
              : isAccessible
                ? "bg-gradient-to-br from-gray-300 to-gray-400 text-gray-600 shadow-md hover:from-gray-400 hover:to-gray-500"
                : "glass-panel text-gray-400"
        }`}
      >
        {isComplete ? (
          <CheckCircle2 className="h-6 w-6" />
        ) : isActive ? (
          <Circle className="h-6 w-6 fill-current" />
        ) : (
          icon || <Lock className="h-5 w-5" />
        )}
      </div>
      <p
        className={`mt-2 text-xs font-semibold transition-colors ${
          isActive
            ? "text-purple-700"
            : isAccessible
              ? "text-gray-600"
              : "text-gray-500"
        }`}
      >
        {label}
      </p>
    </motion.div>
  );
};
