import type { LyricLine } from "@/types";
import { VocabularyWord } from "./VocabularyWord";

interface LyricLineDisplayProps {
    line: LyricLine;
    isActive: boolean;
    onWordClick: (
        word: string,
        reading: string,
        meaning: string,
        lyricLine: LyricLine
    ) => void;
    className?: string;
}

/**
 * 歌詞行表示コンポーネント
 * 歌詞の1行を表示し、各単語をクリック可能にする
 */
export const LyricLineDisplay = ({
    line,
    isActive,
    onWordClick,
    className = "",
}: LyricLineDisplayProps) => {
    return (
        <div
            className={`p-4 mb-2 rounded-lg transition-all duration-300 flex flex-wrap justify-center gap-2 ${isActive
                ? "bg-blue-100 scale-105 shadow-md"
                : "bg-white opacity-70"
                } ${className}`}
        >
            {line.vocabulary.map((vocab, vocabIdx) => (
                <VocabularyWord
                    key={vocabIdx}
                    vocab={vocab}
                    onClick={() => {
                        onWordClick(vocab.word, vocab.reading, vocab.meaning, line);
                    }}
                />
            ))}
        </div>
    );
};
