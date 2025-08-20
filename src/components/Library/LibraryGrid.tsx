import { useLibraryStore } from "../../stores/libraryStore";
import { useQuizStore } from "../../stores/quizStore";
import { AnimatedWordCard } from "./AnimatedWordCard";
import { motion, AnimatePresence } from "motion/react";

export const LibraryGrid = () => {
  const { collectedWords } = useLibraryStore();
  const { wordsPerStage } = useQuizStore();

  // 全単語リストを平坦化
  const allWords = wordsPerStage.flat();

  return (
    <motion.div className="grid grid-cols-3 gap-4">
      {allWords.map((word) => (
        <AnimatedWordCard
          key={word}
          word={word}
          collected={collectedWords.includes(word)}
        />
      ))}
    </motion.div>
  );
};
