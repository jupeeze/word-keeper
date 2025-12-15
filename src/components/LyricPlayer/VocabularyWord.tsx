import type { Vocabulary } from "@/types";

interface VocabularyWordProps {
  vocab: Vocabulary;
  onClick: () => void;
  className?: string;
}

/**
 * 単語表示コンポーネント
 * クリック可能な単語を表示し、読み仮名と意味も表示する
 */
export const VocabularyWord = ({
  vocab,
  onClick,
  className = "",
}: VocabularyWordProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 親要素への伝播を防ぐ
    onClick();
  };

  return (
    <button
      type="button"
      className={`group relative cursor-pointer rounded-md p-1 text-center transition-transform hover:scale-110 hover:bg-yellow-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${className}`}
      onClick={handleClick}
      aria-label={`${vocab.word}を単語帳に追加 - ${vocab.meaning}`}
    >
      <p className="text-xs text-gray-500">{vocab.reading}</p>
      <p className="font-bold text-gray-800 group-hover:text-blue-600">
        {vocab.word}
      </p>
      <p className="text-xs text-gray-400 group-hover:text-gray-600">
        {vocab.meaning}
      </p>

      {/* ホバー時に「＋」アイコンを表示 */}
      <div
        className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white opacity-0 shadow-sm group-hover:opacity-100"
        aria-hidden="true"
      >
        +
      </div>
    </button>
  );
};
