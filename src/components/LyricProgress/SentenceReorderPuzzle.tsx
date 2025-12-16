import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { RotateCcw } from "lucide-react";
import { shuffleArray } from "@/utils/arrayUtils";
import { toast } from "sonner";

interface Vocabulary {
  word: string;
  reading: string;
  meaning: string;
}

interface SentenceReorderPuzzleProps {
  sentence: string; // 正しい文章（スペース区切り）
  vocabulary: Vocabulary[]; // 語彙データ
  onComplete: () => void;
}

const SentenceReorderPuzzle = ({
  sentence,
  vocabulary,
  onComplete,
}: SentenceReorderPuzzleProps) => {
  // 語彙の意味を正しい語順で並べた文章を作成
  const meaningText = vocabulary.map((v) => v.meaning).join(" ");
  const [words, setWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);

  const correctWords = sentence.split(" ");

  // Initialize shuffled words
  useEffect(() => {
    setWords(shuffleArray([...correctWords]));
  }, [sentence]);

  const handleWordClick = (word: string, index: number) => {
    if (isCorrect) return;

    // Add word to selected list
    setSelectedWords([...selectedWords, word]);
    // Remove word from available words
    setWords(words.filter((_, i) => i !== index));
  };

  const handleRemoveWord = (index: number) => {
    if (isCorrect) return;

    const word = selectedWords[index];
    // Remove from selected
    setSelectedWords(selectedWords.filter((_, i) => i !== index));
    // Add back to available words
    setWords([...words, word]);
  };

  const handleReset = () => {
    setWords(shuffleArray([...correctWords]));
    setSelectedWords([]);
    setIsCorrect(false);
  };

  const handleCheck = () => {
    const userAnswer = selectedWords.join(" ");
    if (userAnswer === sentence) {
      setIsCorrect(true);
      toast.success("正解です！🎉", {
        description: "よくできました！",
      });
      setTimeout(() => {
        onComplete();
      }, 1500);
    } else {
      // Show incorrect feedback and reset after delay
      setTimeout(() => {
        handleReset();
      }, 1000);
    }
  };

  return (
    <Card className="items-center">
      {/* Instructions */}
      <CardHeader>
        <h3 className="text-lg font-semibold">正しい順序に並べてください</h3>
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-center text-sm text-gray-500">{meaningText}</p>
        <div className="min-h-24 rounded-lg border-2 border-dashed border-gray-300 bg-white p-4">
          {/* Selected words area */}
          <p className="mb-2 text-xs text-gray-500">選択した順序:</p>
          <div className="flex w-64 flex-wrap gap-2">
            <AnimatePresence>
              {selectedWords.map((word, index) => (
                <motion.div
                  key={`selected-${index}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    onClick={() => handleRemoveWord(index)}
                    variant="default"
                    className="relative"
                    disabled={isCorrect}
                  >
                    <span className="absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    {word}
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Available words */}
        <div className="w-full">
          <p className="mb-2 text-xs text-gray-500">利用可能な単語:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <AnimatePresence>
              {words.map((word, index) => (
                <motion.div
                  key={`word-${word}-${index}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    onClick={() => handleWordClick(word, index)}
                    variant="outline"
                    size="lg"
                    className="text-lg font-bold hover:border-blue-400 hover:bg-blue-100"
                    disabled={isCorrect}
                  >
                    {word}
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>

      {/* Action buttons */}
      <CardFooter className="flex w-full gap-3">
        <Button onClick={handleReset} variant="outline" className="flex-1">
          <RotateCcw className="mr-2 h-4 w-4" />
          リセット
        </Button>
        {selectedWords.length === correctWords.length && !isCorrect && (
          <Button onClick={handleCheck} className="flex-1">
            確認
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SentenceReorderPuzzle;
