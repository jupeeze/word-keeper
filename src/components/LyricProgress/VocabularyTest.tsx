import { useState, useEffect, useMemo } from "react";
import { QuizContainer } from "@/components/ui";
import { QuizChoiceGrid } from "@/components/Quiz/QuizChoiceGrid";
import { QuizFeedback } from "@/components/Quiz/QuizFeedback";
import { FEEDBACK_CONFIG } from "@/constants/quiz";
import type { Vocabulary, FeedbackType } from "@/types";
import { generateChoices } from "@/utils/vocabularyUtils";
import { useLibraryStore } from "@/stores/libraryStore";
import { useSongStore } from "@/stores/songStore";

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

interface VocabularyTestProps {
    vocabulary: Vocabulary[];
    onComplete: () => void;
    onUpdateMastery: (word: string, isCorrect: boolean) => void;
    onBackToStudy?: () => void;
    onIncorrectAnswer?: (word: Vocabulary) => void;
    currentSongId?: string;
    currentLyricText?: string;
    currentLyricStartTime?: number;
}

export const VocabularyTest = ({
    vocabulary,
    onComplete,
    onUpdateMastery,
    onBackToStudy,
    onIncorrectAnswer,
    currentSongId,
    currentLyricText,
    currentLyricStartTime,
}: VocabularyTestProps) => {
    const { addWord } = useLibraryStore();
    const { getSongById } = useSongStore();
    // Initialize with shuffled vocabulary
    const [shuffledVocabulary, setShuffledVocabulary] = useState(() => shuffleArray(vocabulary));
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [choices, setChoices] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<FeedbackType | null>(null);
    const [incorrectWords, setIncorrectWords] = useState<string[]>([]);

    // Update shuffled vocabulary when prop changes
    useEffect(() => {
        setShuffledVocabulary(shuffleArray(vocabulary));
        setCurrentQuestionIndex(0);
    }, [vocabulary]);

    const currentWord = shuffledVocabulary[currentQuestionIndex];

    // Get all vocabulary from the entire song (memoized to avoid recalculation)
    const allMeanings = useMemo(() => {
        if (currentSongId) {
            const song = getSongById(currentSongId);
            if (song) {
                const allSongVocabulary = song.lyrics.flatMap(lyric => lyric.vocabulary);
                return allSongVocabulary.map((v) => v.word);
            }
        }
        // Fallback to current vocabulary if song not found
        return vocabulary.map((v) => v.word);
    }, [currentSongId, getSongById, vocabulary]);

    // Generate choices when question changes
    useEffect(() => {
        if (currentWord) {
            setChoices(generateChoices(currentWord.word, allMeanings, 4));
        }
    }, [currentQuestionIndex, currentWord, allMeanings]);

    const handleAnswer = (selectedWord: string) => {
        const isCorrect = selectedWord === currentWord.word;

        // Update word mastery
        onUpdateMastery(currentWord.word, isCorrect);

        if (isCorrect) {
            // Register word to library when answered correctly
            if (currentSongId && currentLyricText !== undefined && currentLyricStartTime !== undefined) {
                const song = getSongById(currentSongId);
                if (song) {
                    addWord(
                        currentWord.word,
                        currentWord.meaning,
                        currentWord.reading,
                        {
                            songId: currentSongId,
                            songTitle: song.title,
                            artistName: song.artist,
                            youtubeUrl: song.youtubeUrl,
                            timestamp: currentLyricStartTime,
                            sourceLyric: currentLyricText,
                        }
                    );
                }
            }

            // Show correct feedback
            setFeedback("correct");
            setTimeout(() => {
                setFeedback(null);
                // Move to next question
                if (currentQuestionIndex < vocabulary.length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                } else {
                    // All questions answered correctly
                    onComplete();
                }
            }, FEEDBACK_CONFIG.DISPLAY_DURATION_MS);
        } else {
            // Show incorrect feedback
            setFeedback("incorrect");
            setIncorrectWords([...incorrectWords, currentWord.word]);

            // Notify parent about incorrect answer
            if (onIncorrectAnswer) {
                onIncorrectAnswer(currentWord);
            }

            setTimeout(() => {
                setFeedback(null);
                // Restart from beginning on incorrect answer
                setCurrentQuestionIndex(0);
                setIncorrectWords([]);
                setShuffledVocabulary(shuffleArray(vocabulary));
            }, FEEDBACK_CONFIG.DISPLAY_DURATION_MS * 2);
        }
    };

    const questionContent = (
        <p className="text-3xl font-bold text-purple-800">
            {currentWord.meaning}
        </p>
    );

    const instructions = (
        <div className="space-y-1">
            <p>💡 全問正解で次のステップへ進めます</p>
            <p>間違えると最初からやり直しになります</p>
            {onBackToStudy && (
                <p className="text-purple-600 font-semibold">
                    📚 わからない単語があれば学習フェーズに戻れます
                </p>
            )}
        </div>
    );

    return (
        <QuizContainer
            question="この意味の韓国語を選んでください"
            questionContent={questionContent}
            progress={{
                current: currentQuestionIndex + 1,
                total: vocabulary.length,
            }}
            instructions={instructions}
            animationKey={currentQuestionIndex}
        >
            {/* Choices */}
            <QuizChoiceGrid
                choices={choices}
                onChoiceClick={handleAnswer}
                className="grid-cols-2"
            />

            {/* Feedback */}
            <QuizFeedback feedback={feedback} className="text-xl mt-4" />
        </QuizContainer>
    );
};
