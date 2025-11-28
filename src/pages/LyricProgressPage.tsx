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
import { SingingChallenge } from "@/components/LyricProgress/SingingChallenge";
import type { PageNavigationProps } from "@/types";
import { CheckCircle2, Circle, Lock, ArrowLeft, Mic } from "lucide-react";

type LearningStep = "study" | "singing" | "test" | "puzzle" | "reward";

interface LyricProgressPageProps extends PageNavigationProps {
    currentSongId?: string;
}

export const LyricProgressPage = ({ setPage, currentSongId }: LyricProgressPageProps) => {
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
        setCurrentStep("study");
    };

    if (allCompleted) {
        return (
            <div className="min-h-screen gradient-primary flex items-center justify-center p-4 relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            rotate: [0, 180, 0],
                        }}
                        transition={{ duration: 10, repeat: Infinity }}
                        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-400/40 to-pink-400/40 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            scale: [1.3, 1, 1.3],
                            rotate: [180, 0, 180],
                        }}
                        transition={{ duration: 10, repeat: Infinity }}
                        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/40 to-purple-400/40 rounded-full blur-3xl"
                    />
                </div>

                <Card className="max-w-lg w-full glass-card border-0 shadow-2xl relative">
                    <CardHeader className="text-center pb-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", duration: 0.6 }}
                            className="text-6xl mb-4"
                        >
                            🎉
                        </motion.div>
                        <CardTitle className="text-4xl font-bold text-gradient-primary">
                            完了！
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-6 px-8 pb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <p className="text-2xl font-bold text-gray-800 mb-2">
                                すべての歌詞行をマスターしました！
                            </p>
                            <p className="text-gray-600 text-lg">
                                {song.title} の全 {song.lyrics.length} 行を完全に習得しました。
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex gap-4 mt-8"
                        >
                            <Button
                                onClick={() => setPage("songList")}
                                variant="outline"
                                className="flex-1 h-12 glass-panel hover:bg-white/40 transition-all duration-300"
                            >
                                曲一覧へ
                            </Button>
                            <Button
                                onClick={() => setPage("library")}
                                className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
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
        <div className="min-h-screen gradient-secondary p-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 15, repeat: Infinity }}
                    className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-br from-blue-300/30 to-purple-300/30 rounded-full blur-3xl"
                />
            </div>

            <div className="relative max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <Card className="glass-card border-0 shadow-lg">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={() => setPage("songList")}
                                variant="ghost"
                                size="sm"
                                className="glass-panel hover:bg-white/40 transition-all duration-300"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                            <CardTitle className="text-center flex-1 text-2xl">
                                🎵 {song.title}
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Overall progress */}
                        <div>
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span className="font-semibold">全体の進行状況</span>
                                <span className="font-bold text-purple-600">
                                    {progress.totalCompletedLines} / {song.lyrics.length} 行完了
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercentage}%` }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-4 rounded-full shadow-glow"
                                />
                            </div>
                        </div>

                        {/* Step progress */}
                        <div className="flex items-center justify-center gap-2 py-4">
                            <StepIndicator
                                label="学習"
                                isComplete={currentProgress?.isStudied || false}
                                isActive={currentStep === "study"}
                                onClick={() => currentProgress?.isStudied && setCurrentStep("study")}
                            />
                            <div className="w-12 h-1 bg-gradient-to-r from-gray-300 to-gray-300 rounded-full" />
                            <StepIndicator
                                label="歌唱"
                                isComplete={currentProgress?.isSingingCompleted || false}
                                isActive={currentStep === "singing"}
                                icon={<Mic className="w-5 h-5" />}
                                onClick={() => currentProgress?.isSingingCompleted && setCurrentStep("singing")}
                            />
                            <div className="w-12 h-1 bg-gradient-to-r from-gray-300 to-gray-300 rounded-full" />
                            <StepIndicator
                                label="テスト"
                                isComplete={currentProgress?.isTested || false}
                                isActive={currentStep === "test"}
                                onClick={() => currentProgress?.isTested && setCurrentStep("test")}
                            />
                            <div className="w-12 h-1 bg-gradient-to-r from-gray-300 to-gray-300 rounded-full" />
                            <StepIndicator
                                label="パズル"
                                isComplete={currentProgress?.isPuzzleCompleted || false}
                                isActive={currentStep === "puzzle"}
                                onClick={() => currentProgress?.isPuzzleCompleted && setCurrentStep("puzzle")}
                            />
                            <div className="w-12 h-1 bg-gradient-to-r from-gray-300 to-gray-300 rounded-full" />
                            <StepIndicator
                                label="報酬"
                                isComplete={currentProgress?.isCompleted || false}
                                isActive={currentStep === "reward"}
                                onClick={() => currentProgress?.isCompleted && setCurrentStep("reward")}
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
    icon?: React.ReactNode;
    onClick?: () => void;
}

const StepIndicator = ({
    label,
    isComplete,
    isActive,
    icon,
    onClick,
}: StepIndicatorProps) => {
    const isClickable = isComplete && onClick;

    return (
        <motion.div
            className={`flex flex-col items-center ${isClickable ? "cursor-pointer" : ""}`}
            whileHover={{ scale: isClickable ? 1.1 : 1.05 }}
            whileTap={isClickable ? { scale: 0.95 } : {}}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={onClick}
        >
            <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isComplete
                    ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg shadow-green-500/50"
                    : isActive
                        ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/50 animate-pulse"
                        : "glass-panel text-gray-400"
                    }`}
            >
                {isComplete ? (
                    <CheckCircle2 className="w-6 h-6" />
                ) : isActive ? (
                    <Circle className="w-6 h-6 fill-current" />
                ) : (
                    icon || <Lock className="w-5 h-5" />
                )}
            </div>
            <p
                className={`text-xs mt-2 font-semibold transition-colors ${isActive ? "text-purple-700" : "text-gray-500"
                    }`}
            >
                {label}
            </p>
        </motion.div>
    );
};
