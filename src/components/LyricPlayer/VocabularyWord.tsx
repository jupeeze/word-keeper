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
        <div
            className={`cursor-pointer hover:bg-yellow-200 hover:scale-110 transition-transform p-1 rounded-md text-center group relative ${className}`}
            onClick={handleClick}
        >
            <p className="text-xs text-gray-500 mb-1">{vocab.reading}</p>
            <p className="text-lg font-bold text-gray-800 group-hover:text-blue-600">
                {vocab.word}
            </p>
            <p className="text-xs text-gray-400 group-hover:text-gray-600">
                {vocab.meaning}
            </p>

            {/* ホバー時に「＋」アイコンを表示 */}
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-sm">
                +
            </div>
        </div>
    );
};
