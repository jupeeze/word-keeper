import { create } from "zustand";
import { persist } from "zustand/middleware";
import songData from "../data/song_data.json";
import type {
    LyricProgressState,
    LyricLineProgress,
    WordMasteryState,
} from "@/types";

interface LyricProgressStore extends LyricProgressState {
    // Actions
    initializeProgress: () => void;
    markLineStudied: (lineIndex: number) => void;
    markLineTested: (lineIndex: number) => void;
    markPuzzleCompleted: (lineIndex: number) => void;
    markLineCompleted: (lineIndex: number) => void;
    moveToNextLine: () => void;
    updateWordMastery: (word: string, isCorrect: boolean) => void;
    resetProgress: () => void;

    // Getters
    getCurrentLine: () => LyricLineProgress | null;
    getLineProgress: (lineIndex: number) => LyricLineProgress | null;
    isLineUnlocked: (lineIndex: number) => boolean;
}

const createInitialLineProgress = (): LyricLineProgress[] => {
    return songData.lyrics.map((_, index) => ({
        lineIndex: index,
        isStudied: false,
        isTested: false,
        isPuzzleCompleted: false,
        isCompleted: false,
        testAttempts: 0,
        puzzleAttempts: 0,
    }));
};

export const useLyricProgressStore = create(
    persist<LyricProgressStore>(
        (set, get) => ({
            // Initial state
            songId: "twinkle-twinkle-korean",
            currentLineIndex: 0,
            lineProgress: createInitialLineProgress(),
            wordMastery: {},
            totalCompletedLines: 0,

            // Actions
            initializeProgress: () => {
                const state = get();
                if (state.lineProgress.length === 0) {
                    set({
                        lineProgress: createInitialLineProgress(),
                        currentLineIndex: 0,
                        totalCompletedLines: 0,
                    });
                }
            },

            markLineStudied: (lineIndex) => {
                set((state) => ({
                    lineProgress: state.lineProgress.map((line) =>
                        line.lineIndex === lineIndex ? { ...line, isStudied: true } : line
                    ),
                }));
            },

            markLineTested: (lineIndex) => {
                set((state) => ({
                    lineProgress: state.lineProgress.map((line) =>
                        line.lineIndex === lineIndex
                            ? {
                                ...line,
                                isTested: true,
                                testAttempts: line.testAttempts + 1,
                            }
                            : line
                    ),
                }));
            },

            markPuzzleCompleted: (lineIndex) => {
                set((state) => ({
                    lineProgress: state.lineProgress.map((line) =>
                        line.lineIndex === lineIndex
                            ? {
                                ...line,
                                isPuzzleCompleted: true,
                                puzzleAttempts: line.puzzleAttempts + 1,
                            }
                            : line
                    ),
                }));
            },

            markLineCompleted: (lineIndex) => {
                set((state) => {
                    const updatedProgress = state.lineProgress.map((line) =>
                        line.lineIndex === lineIndex
                            ? {
                                ...line,
                                isCompleted: true,
                                completedAt: new Date().toISOString(),
                            }
                            : line
                    );

                    const completedCount = updatedProgress.filter(
                        (line) => line.isCompleted
                    ).length;

                    return {
                        lineProgress: updatedProgress,
                        totalCompletedLines: completedCount,
                    };
                });
            },

            moveToNextLine: () => {
                set((state) => {
                    const nextIndex = state.currentLineIndex + 1;
                    if (nextIndex < songData.lyrics.length) {
                        return { currentLineIndex: nextIndex };
                    }
                    return state;
                });
            },

            updateWordMastery: (word, isCorrect) => {
                set((state) => {
                    const currentMastery = state.wordMastery[word] || {
                        word,
                        isMemorized: false,
                        correctCount: 0,
                        incorrectCount: 0,
                    };

                    const updatedMastery: WordMasteryState = {
                        ...currentMastery,
                        correctCount: isCorrect
                            ? currentMastery.correctCount + 1
                            : currentMastery.correctCount,
                        incorrectCount: !isCorrect
                            ? currentMastery.incorrectCount + 1
                            : currentMastery.incorrectCount,
                        lastTestedAt: new Date().toISOString(),
                        isMemorized:
                            isCorrect && currentMastery.correctCount + 1 >= 2
                                ? true
                                : currentMastery.isMemorized,
                    };

                    return {
                        wordMastery: {
                            ...state.wordMastery,
                            [word]: updatedMastery,
                        },
                    };
                });
            },

            resetProgress: () => {
                set({
                    currentLineIndex: 0,
                    lineProgress: createInitialLineProgress(),
                    wordMastery: {},
                    totalCompletedLines: 0,
                });
            },

            // Getters
            getCurrentLine: () => {
                const state = get();
                return (
                    state.lineProgress.find(
                        (line) => line.lineIndex === state.currentLineIndex
                    ) || null
                );
            },

            getLineProgress: (lineIndex) => {
                const state = get();
                return (
                    state.lineProgress.find((line) => line.lineIndex === lineIndex) ||
                    null
                );
            },

            isLineUnlocked: (lineIndex) => {
                const state = get();
                // 最初の行は常にアンロック
                if (lineIndex === 0) return true;
                // 前の行が完了していればアンロック
                const previousLine = state.lineProgress.find(
                    (line) => line.lineIndex === lineIndex - 1
                );
                return previousLine?.isCompleted || false;
            },
        }),
        {
            name: "lyric-progress-storage",
        }
    )
);
