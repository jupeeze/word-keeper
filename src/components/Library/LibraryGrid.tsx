import { useState } from "react";
import { useLibraryStore } from "@/stores/libraryStore";
import { AnimatedWordCard } from "./AnimatedWordCard";
import { WordPlaybackModal } from "./WordPlaybackModal";
import { motion, AnimatePresence } from "framer-motion";
import type { SavedWord } from "@/types";

export const LibraryGrid = () => {
  // 新しいストアから savedWords を取得
  const { savedWords, removeWord } = useLibraryStore();

  // 再生中の単語データを管理するState
  const [selectedWord, setSelectedWord] = useState<SavedWord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePlay = (word: SavedWord) => {
    setSelectedWord(word);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    // モーダルが完全に閉じてからデータをクリアするとアニメーションが綺麗ですが、
    // 簡易的にここでリセットします。
    setTimeout(() => setSelectedWord(null), 300);
  };

  if (savedWords.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-xl font-bold mb-2">グリモワールはまだ白紙です</p>
        <p>「歌詞同期プレイヤー」から単語を採集しましょう！</p>
      </div>
    );
  }

  return (
    <>
      <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        <AnimatePresence mode="popLayout">
          {savedWords.map((item) => (
            <AnimatedWordCard
              key={item.id}
              data={item}
              onPlay={handlePlay}
              onDelete={removeWord}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* 再生用モーダル */}
      <WordPlaybackModal
        wordData={selectedWord}
        isOpen={isModalOpen}
        onClose={handleClose}
      />
    </>
  );
};