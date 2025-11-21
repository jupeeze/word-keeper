import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLyricProgressStore } from "@/stores/lyricProgressStore";
import { useSongStore } from "@/stores/songStore";
import { FlashcardStudy } from "@/components/LyricProgress/FlashcardStudy";
import { VocabularyTest } from "@/components/LyricProgress/VocabularyTest";
import { SentenceReorderPuzzle } from "@/components/LyricProgress/SentenceReorderPuzzle";
import { RewardVideoPlayer } from "@/components/LyricProgress/RewardVideoPlayer";
import type { PageNavigationProps } from "@/types";
import { CheckCircle2, Circle, Lock, ArrowLeft } from "lucide-react";

type LearningStep = "study" | "test" | "puzzle" | "reward";

interface LyricProgressPageProps extends PageNavigationProps {
    currentSongId?: string;
}

export const LyricProgressPage = ({ setPage, currentSongId }: LyricProgressPageProps) => {
    const { getSongById } = useSongStore();
    const {
        initializeProgress,
        getCurrentProgress,
        markLineStudied,
        markLineTested,
        markPuzzleCompleted,
        markLineCompleted,
        moveToNextLine,
        updateWordMastery,
        getCurrentLine,
    } = useLyricProgressStore();

    const [currentStep, setCurrentStep] = useState<LearningStep>("study");

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
            } else if (!currentProgress.isCompleted) {
                setCurrentStep("reward");
            }
        }
    }, [currentProgress]);

    // Handle no song selected
    if (!currentSongId || !song) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="max-w-lg w-full">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl">曲が選択されていません</CardTitle>
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
            <div className="min-h-screen flex items-center justify-center">
                <p>読み込み中...</p>
            </div>
        );
    }

    const currentLineIndex = progress.currentLineIndex;
    const currentLyric = song.lyrics[currentLineIndex];
    const progressPercentage = (progress.totalCompletedLines / song.lyrics.length) * 100;

    // Check if all lines are completed
    const allCompleted = progress.totalCompletedLines === song.lyrics.length;

    const handleStudyComplete = () => {
        markLineStudied(currentLineIndex);
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

    if (allCompleted) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
                <Card className="max-w-lg w-full shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-center text-3xl">🎉 完了！</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <p className="text-xl font-bold">
                            すべての歌詞行をマスターしました！
                        </p>
                        <p className="text-gray-600">
                            {song.title} の全 {song.lyrics.length} 行を完全に習得しました。
                        </p>
                        <div className="flex gap-4 mt-6">
                            <Button
                                onClick={() => setPage("songList")}
                                variant="outline"
                                className="flex-1"
                            >
                                曲一覧へ
                            </Button>
                            <Button
                                onClick={() => setPage("library")}
                                className="flex-1"
                            >
                                図鑑を見る
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={() => setPage("songList")}
                                variant="ghost"
                                size="sm"
                                className="hover:bg-purple-100"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                            <CardTitle className="text-center flex-1">
                                🎵 {song.title}
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Overall progress */}
                        <div>
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>全体の進行状況</span>
                                <span>
                                    {progress.totalCompletedLines} / {song.lyrics.length} 行完了
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                        </div>

                        {/* Step progress */}
                        <div className="flex items-center justify-center gap-2">
                            <StepIndicator
                                label="学習"
                                isComplete={currentProgress?.isStudied || false}
                                isActive={currentStep === "study"}
                            />
                            <div className="w-8 h-0.5 bg-gray-300" />
                            <StepIndicator
                                label="テスト"
                                isComplete={currentProgress?.isTested || false}
                                isActive={currentStep === "test"}
                            />
                            <div className="w-8 h-0.5 bg-gray-300" />
                            <StepIndicator
                                label="パズル"
                                isComplete={currentProgress?.isPuzzleCompleted || false}
                                isActive={currentStep === "puzzle"}
                            />
                            <div className="w-8 h-0.5 bg-gray-300" />
                            <StepIndicator
                                label="報酬"
                                isComplete={currentProgress?.isCompleted || false}
                                isActive={currentStep === "reward"}
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
                                vocabulary={currentLyric.vocabulary}
                                onComplete={handleStudyComplete}
                            />
                        )}
                        {currentStep === "test" && (
                            <VocabularyTest
                                vocabulary={currentLyric.vocabulary}
                                onComplete={handleTestComplete}
                                onUpdateMastery={updateWordMastery}
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
                        {currentStep === "reward" && (
                            <RewardVideoPlayer
                                youtubeUrl={song.youtubeUrl}
                                startTime={currentLyric.startTime}
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
}

const StepIndicator = ({
    label,
    isComplete,
    isActive,
}: StepIndicatorProps) => {
    return (
        <div className="flex flex-col items-center">
            <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isComplete
                    ? "bg-green-500 text-white"
                    : isActive
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
            >
                {isComplete ? (
                    <CheckCircle2 className="w-6 h-6" />
                ) : isActive ? (
                    <Circle className="w-6 h-6 fill-current" />
                ) : (
                    <Lock className="w-5 h-5" />
                )}
            </div>
            <p
                className={`text-xs mt-1 font-medium ${isActive ? "text-blue-600" : "text-gray-500"
                    }`}
            >
                {label}
            </p>
        </div>
    );
};
