import type { LyricLine } from "@/types";
import { VocabularyWord } from "./VocabularyWord";

interface LyricLineDisplayProps {
  line: LyricLine;
  isActive: boolean;
  className?: string;
}

/**
 * 歌詞行表示コンポーネント
 * 歌詞の1行を表示し、各単語をクリック可能にする
 */
export const LyricLineDisplay = ({
  line,
  isActive,
  className = "",
}: LyricLineDisplayProps) => {
  return (
    <div
      className={`flex flex-wrap justify-center rounded-lg transition-all duration-300 ${
        isActive ? "scale-105 bg-blue-100 shadow-md" : "bg-white opacity-70"
      } ${className}`}
    >
      {line.vocabulary.map((vocab, vocabIdx) => (
        <VocabularyWord key={vocabIdx} vocab={vocab} />
      ))}
    </div>
  );
};
