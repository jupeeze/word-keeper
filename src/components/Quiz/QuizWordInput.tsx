import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuizStore } from "../../stores/quizStore";
import { useLibraryStore } from "../../stores/libraryStore";

export const QuizWordInput = () => {
  const [input, setInput] = useState("");
  const { currentWordIndex, words, nextWord, markCorrect } = useQuizStore();
  const { addWord } = useLibraryStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctWord = words[currentWordIndex];
    if (input.toLowerCase() === correctWord.toLowerCase()) {
      markCorrect(correctWord);
      addWord(correctWord);
      setInput("");
      nextWord();
    } else {
      setInput("");
    }
  };

  if (currentWordIndex >= words.length) return <p>ステージクリア！🎉</p>;

  return (
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
  );
};
