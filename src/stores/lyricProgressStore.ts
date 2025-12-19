import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LyricLineProgress, WordMasteryState, Song } from "@/types";

// 曲ごとの進捗状態
interface SongProgress {
  songId: string;
  currentLineIndex: number;
  lineProgress: LyricLineProgress[];
  wordMastery: Record<string, WordMasteryState>;
  totalCompletedLines: number;
}

interface LyricProgressStore {
  // 全曲の進捗を保持
  progressBySong: Record<string, SongProgress>;
  currentSongId: string | null;

  // Actions
  initializeProgress: (songId: string, song: Song) => void;
  switchSong: (songId: string) => void;
  markLineStudied: (lineIndex: number) => void;
  markLineTested: (lineIndex: number) => void;
  markSingingCompleted: (lineIndex: number) => void;
  markPuzzleCompleted: (lineIndex: number) => void;
  markLineCompleted: (lineIndex: number) => void;
  moveToNextLine: () => void;
  updateWordMastery: (word: string, isCorrect: boolean) => void;
  markWordsAsMemorized: (words: string[]) => void;
  resetProgress: (songId: string) => void;

  // Getters
  getCurrentProgress: () => SongProgress | null;
  getCurrentLine: () => LyricLineProgress | null;
  getLineProgress: (lineIndex: number) => LyricLineProgress | null;
  isLineUnlocked: (lineIndex: number) => boolean;
}

const createInitialLineProgress = (
  lyricsCount: number,
): LyricLineProgress[] => {
  return Array.from({ length: lyricsCount }, (_, index) => ({
    lineIndex: index,
    isStudied: false,
    isTested: false,
    isSingingCompleted: false,
    isPuzzleCompleted: false,
    isCompleted: false,
    testAttempts: 0,
    puzzleAttempts: 0,
  }));
};

const createInitialSongProgress = (
  songId: string,
  song: Song,
): SongProgress => ({
  songId,
  currentLineIndex: 0,
  lineProgress: createInitialLineProgress(song.lyrics.length),
  wordMastery: {},
  totalCompletedLines: 0,
});

export const useLyricProgressStore = create(
  persist<LyricProgressStore>(
    (set, get) => ({
      // Initial state
      progressBySong: {},
      currentSongId: null,

      // Actions
      initializeProgress: (songId, song) => {
        const state = get();
        if (!state.progressBySong[songId]) {
          set({
            progressBySong: {
              ...state.progressBySong,
              [songId]: createInitialSongProgress(songId, song),
            },
            currentSongId: songId,
          });
        } else {
          set({ currentSongId: songId });
        }
      },

      switchSong: (songId) => {
        set({ currentSongId: songId });
      },

      getCurrentProgress: () => {
        const state = get();
        if (!state.currentSongId) return null;
        return state.progressBySong[state.currentSongId] || null;
      },

      markLineStudied: (lineIndex) => {
        const state = get();
        const songId = state.currentSongId;
        if (!songId) return;

        const progress = state.progressBySong[songId];
        if (!progress) return;

        set({
          progressBySong: {
            ...state.progressBySong,
            [songId]: {
              ...progress,
              lineProgress: progress.lineProgress.map((line) =>
                line.lineIndex === lineIndex
                  ? { ...line, isStudied: true }
                  : line,
              ),
            },
          },
        });
      },

      markLineTested: (lineIndex) => {
        const state = get();
        const songId = state.currentSongId;
        if (!songId) return;

        const progress = state.progressBySong[songId];
        if (!progress) return;

        set({
          progressBySong: {
            ...state.progressBySong,
            [songId]: {
              ...progress,
              lineProgress: progress.lineProgress.map((line) =>
                line.lineIndex === lineIndex
                  ? {
                      ...line,
                      isTested: true,
                      testAttempts: line.testAttempts + 1,
                    }
                  : line,
              ),
            },
          },
        });
      },

      markSingingCompleted: (lineIndex) => {
        const state = get();
        const songId = state.currentSongId;
        if (!songId) return;

        const progress = state.progressBySong[songId];
        if (!progress) return;

        set({
          progressBySong: {
            ...state.progressBySong,
            [songId]: {
              ...progress,
              lineProgress: progress.lineProgress.map((line) =>
                line.lineIndex === lineIndex
                  ? { ...line, isSingingCompleted: true }
                  : line,
              ),
            },
          },
        });
      },

      markPuzzleCompleted: (lineIndex) => {
        const state = get();
        const songId = state.currentSongId;
        if (!songId) return;

        const progress = state.progressBySong[songId];
        if (!progress) return;

        set({
          progressBySong: {
            ...state.progressBySong,
            [songId]: {
              ...progress,
              lineProgress: progress.lineProgress.map((line) =>
                line.lineIndex === lineIndex
                  ? {
                      ...line,
                      isPuzzleCompleted: true,
                      puzzleAttempts: line.puzzleAttempts + 1,
                    }
                  : line,
              ),
            },
          },
        });
      },

      markLineCompleted: (lineIndex) => {
        const state = get();
        const songId = state.currentSongId;
        if (!songId) return;

        const progress = state.progressBySong[songId];
        if (!progress) return;

        const updatedProgress = progress.lineProgress.map((line) =>
          line.lineIndex === lineIndex
            ? {
                ...line,
                isCompleted: true,
                completedAt: new Date().toISOString(),
              }
            : line,
        );

        const completedCount = updatedProgress.filter(
          (line) => line.isCompleted,
        ).length;

        set({
          progressBySong: {
            ...state.progressBySong,
            [songId]: {
              ...progress,
              lineProgress: updatedProgress,
              totalCompletedLines: completedCount,
            },
          },
        });
      },

      moveToNextLine: () => {
        const state = get();
        const songId = state.currentSongId;
        if (!songId) return;

        const progress = state.progressBySong[songId];
        if (!progress) return;

        const nextIndex = progress.currentLineIndex + 1;
        if (nextIndex < progress.lineProgress.length) {
          set({
            progressBySong: {
              ...state.progressBySong,
              [songId]: {
                ...progress,
                currentLineIndex: nextIndex,
              },
            },
          });
        }
      },

      updateWordMastery: (word, isCorrect) => {
        const state = get();
        const songId = state.currentSongId;
        if (!songId) return;

        const progress = state.progressBySong[songId];
        if (!progress) return;

        const currentMastery = progress.wordMastery[word] || {
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
        };

        set({
          progressBySong: {
            ...state.progressBySong,
            [songId]: {
              ...progress,
              wordMastery: {
                ...progress.wordMastery,
                [word]: updatedMastery,
              },
            },
          },
        });
      },

      markWordsAsMemorized: (words) => {
        const state = get();
        const songId = state.currentSongId;
        if (!songId) return;

        const progress = state.progressBySong[songId];
        if (!progress) return;

        const updatedWordMastery = { ...progress.wordMastery };

        words.forEach((word) => {
          const currentMastery = updatedWordMastery[word] || {
            word,
            isMemorized: false,
            correctCount: 0,
            incorrectCount: 0,
          };

          updatedWordMastery[word] = {
            ...currentMastery,
            isMemorized: true,
          };
        });

        set({
          progressBySong: {
            ...state.progressBySong,
            [songId]: {
              ...progress,
              wordMastery: updatedWordMastery,
            },
          },
        });
      },

      resetProgress: (songId) => {
        const state = get();
        const progress = state.progressBySong[songId];
        if (!progress) return;

        set({
          progressBySong: {
            ...state.progressBySong,
            [songId]: {
              ...progress,
              currentLineIndex: 0,
              lineProgress: createInitialLineProgress(
                progress.lineProgress.length,
              ),
              wordMastery: {},
              totalCompletedLines: 0,
            },
          },
        });
      },

      // Getters
      getCurrentLine: () => {
        const progress = get().getCurrentProgress();
        if (!progress) return null;

        return (
          progress.lineProgress.find(
            (line) => line.lineIndex === progress.currentLineIndex,
          ) || null
        );
      },

      getLineProgress: (lineIndex) => {
        const progress = get().getCurrentProgress();
        if (!progress) return null;

        return (
          progress.lineProgress.find((line) => line.lineIndex === lineIndex) ||
          null
        );
      },

      isLineUnlocked: (lineIndex) => {
        const progress = get().getCurrentProgress();
        if (!progress) return false;

        // 最初の行は常にアンロック
        if (lineIndex === 0) return true;
        // 前の行が完了していればアンロック
        const previousLine = progress.lineProgress.find(
          (line) => line.lineIndex === lineIndex - 1,
        );
        return previousLine?.isCompleted || false;
      },
    }),
    {
      name: "lyric-progress-storage",
    },
  ),
);
