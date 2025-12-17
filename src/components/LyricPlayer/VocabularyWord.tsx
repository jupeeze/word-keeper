import type { Vocabulary } from "@/types";

interface VocabularyWordProps {
  vocab: Vocabulary;
  className?: string;
}

export const VocabularyWord = ({
  vocab,
  className = "",
}: VocabularyWordProps) => {
  return (
    <div className={`relative rounded-md p-1 text-center ${className}`}>
      <p className="text-xs text-gray-500">{vocab.reading}</p>
      <p className="font-bold text-gray-800">{vocab.word}</p>
      <p className="text-xs text-gray-400">{vocab.meaning}</p>
    </div>
  );
};
