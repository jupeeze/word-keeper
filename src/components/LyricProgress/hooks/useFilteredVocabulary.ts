import { useEffect } from "react";
import type { Vocabulary } from "@/types";
import { useLyricProgressStore } from "@/stores/lyricProgressStore";
import { toast } from "sonner";

interface UseFilteredVocabularyOptions {
  vocabulary: Vocabulary[];
  showToast?: boolean;
  reviewMode?: boolean;
}

interface UseFilteredVocabularyResult {
  filteredVocabulary: Vocabulary[];
  skippedCount: number;
  isAllMemorized: boolean;
}

/**
 * 習得済み単語をフィルタリングするカスタムフック
 * FlashcardStudyとVocabularyTestで共通して使用
 */
export const useFilteredVocabulary = ({
  vocabulary,
  showToast = false,
  reviewMode = false,
}: UseFilteredVocabularyOptions): UseFilteredVocabularyResult => {
  const { getCurrentProgress } = useLyricProgressStore();
  const progress = getCurrentProgress();
  const wordMastery = progress?.wordMastery || {};

  // Filter out already memorized words
  const filteredVocabulary = vocabulary.filter(
    (word) => !wordMastery[word.word]?.isMemorized
  );

  const skippedCount = vocabulary.length - filteredVocabulary.length;
  const isAllMemorized = filteredVocabulary.length === 0 && vocabulary.length > 0;

  // Show toast notification when component mounts
  useEffect(() => {
    if (!showToast) return;

    if (isAllMemorized) {
      toast.info("復習モード", {
        description: "すべての単語を習得済みです。復習しましょう！",
        duration: 3000,
      });
    } else if (skippedCount > 0) {
      toast.info(`既に習得済みの単語 ${skippedCount} 個をスキップしました`, {
        duration: 3000,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  return {
    filteredVocabulary: reviewMode || isAllMemorized ? vocabulary : filteredVocabulary,
    skippedCount,
    isAllMemorized,
  };
};
