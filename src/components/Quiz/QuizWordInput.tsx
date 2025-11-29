import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuizStore } from "../../stores/quizStore";
import { useStreakStore } from "../../stores/streakStore";
import { QuizClearModal } from "./QuizClearModal";

export const QuizWordInput = () => {
  const [input, setInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { currentWordIndex, words, nextWord, markCorrect, resetQuiz } =
    useQuizStore();
  const { incrementStreak } = useStreakStore();

  const isQuizComplete = currentWordIndex >= words.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctWord = words[currentWordIndex];
    if (input.toLowerCase() === correctWord.toLowerCase()) {
      markCorrect(correctWord);
      setInput("");
      nextWord();
    } else {
      setInput("");
    }
  };

  useEffect(() => {
    if (isQuizComplete) {
      incrementStreak();
      setShowModal(true);
    }
    // eslint-disable-next-line
  }, [isQuizComplete]);

  const handleEndQuiz = () => {
    setShowModal(false);
    resetQuiz();
    // ここではダッシュボードに戻るなどの処理を想定
  };

  return (
    <>
      {!isQuizComplete && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <p className="my-4 text-center text-4xl font-bold tracking-widest">
            {words[currentWordIndex]}
          </p>
          <Input
            placeholder="スペルを詠唱せよ"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" variant="default">
            詠唱
          </Button>
        </form>
      )}
      <QuizClearModal isOpen={showModal} onEndQuiz={handleEndQuiz} />
    </>
  );
};
