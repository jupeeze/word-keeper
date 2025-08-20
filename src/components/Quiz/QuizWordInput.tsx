import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuizStore } from "../../stores/quizStore";
import { useLibraryStore } from "../../stores/libraryStore";
import { useStreakStore } from "../../stores/streakStore";
import { StageClearModal } from "./StageClearModal";

export const QuizWordInput = () => {
  const [input, setInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const {
    currentWordIndex,
    wordsPerStage,
    currentStage,
    nextWord,
    markCorrect,
    nextStage,
  } = useQuizStore();
  const { addWord } = useLibraryStore();
  const { incrementStreak } = useStreakStore();

  const currentWords = wordsPerStage[currentStage - 1];
  const isStageComplete = currentWordIndex >= currentWords.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctWord = currentWords[currentWordIndex];
    if (input.toLowerCase() === correctWord.toLowerCase()) {
      markCorrect(correctWord);
      addWord(correctWord);
      setInput("");
      nextWord();
    } else {
      setInput("");
    }
  };

  useEffect(() => {
    if (isStageComplete) {
      incrementStreak();
      setShowModal(true);
    }
    // eslint-disable-next-line
  }, [isStageComplete]);

  return (
    <>
      {!isStageComplete && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Input
            placeholder="単語を入力"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" variant="default">
            確認
          </Button>
        </form>
      )}
      <StageClearModal isOpen={showModal} onNextStage={nextStage} />
    </>
  );
};
