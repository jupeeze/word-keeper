import { useLibraryStore } from "../../stores/libraryStore";
import { useQuizStore } from "../../stores/quizStore";
import { AnimatedWordCard } from "./AnimatedWordCard";
import { motion } from "motion/react";

export const LibraryGrid = () => {
  const { collectedWords } = useLibraryStore();
  const { words } = useQuizStore();

  return (
    <motion.div className="grid grid-cols-3 gap-4">
      {words.map((word) => (
        <AnimatedWordCard
          key={word}
          word={word}
          collected={collectedWords.includes(word)}
        />
      ))}
    </motion.div>
  );
};
