import { useState, useEffect, useRef, useCallback } from "react";
import type { Vocabulary, QuizHistoryItem, QuizConfig, FeedbackType } from "@/types";
import { shuffleArray } from "@/utils/arrayUtils";
import { speakKorean, initializeSpeech } from "@/utils/speechUtils";
import { extractUniqueVocabulary, generateChoices } from "@/utils/vocabularyUtils";
import { formatReactionTime } from "@/utils/quizUtils";
import { DEFAULT_QUIZ_CONFIG, TIMER_CONFIG, FEEDBACK_CONFIG } from "@/constants/quiz";
import songData from "../data/song_data.json";

// 語彙データを読み込み、重複を排除
const allVocabulary: Vocabulary[] = extractUniqueVocabulary(songData);

export const useSpeedReadingQuiz = ({
    timeLimit = DEFAULT_QUIZ_CONFIG.TIME_LIMIT,
    questionCount = DEFAULT_QUIZ_CONFIG.QUESTION_COUNT,
}: QuizConfig = {}) => {
    const [quizData, setQuizData] = useState<Vocabulary[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState<Vocabulary | null>(
        null
    );
    const [choices, setChoices] = useState<string[]>([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(timeLimit);
    const [history, setHistory] = useState<QuizHistoryItem[]>([]);
    const [isQuizRunning, setIsQuizRunning] = useState(false);
    const [feedback, setFeedback] = useState<FeedbackType | null>(null);
    const [startTime, setStartTime] = useState<number>(0);

    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // 制限時間タイマーのロジック
    useEffect(() => {
        if (isQuizRunning && feedback === null) {
            timerIntervalRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= TIMER_CONFIG.UPDATE_INTERVAL_SEC) {
                        clearInterval(timerIntervalRef.current!);
                        handleAnswer(null); // タイムアウト処理
                        return 0;
                    }
                    return prev - TIMER_CONFIG.UPDATE_INTERVAL_SEC;
                });
            }, TIMER_CONFIG.UPDATE_INTERVAL_MS);
        } else if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
        }
        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isQuizRunning, feedback]);

    // 次の問題を設定する関数
    const setupQuestion = useCallback(
        (index: number) => {
            if (index >= quizData.length) {
                // クイズ終了
                setIsQuizRunning(false);
                return;
            }

            const question = quizData[index];
            setCurrentQuestion(question);

            // 4択の選択肢を作成
            const allMeanings = allVocabulary.map((v) => v.meaning);
            const choiceList = generateChoices(
                question.meaning,
                allMeanings,
                DEFAULT_QUIZ_CONFIG.CHOICE_COUNT
            );
            setChoices(choiceList);

            // リセット
            setTimeLeft(timeLimit);
            setFeedback(null);
            setStartTime(Date.now()); // 反応時間計測開始

            // 音声再生
            speakKorean(question.word);
        },
        [quizData, timeLimit]
    );

    // クイズ開始処理
    const startQuiz = () => {
        // ユーザーのインタラクションをトリガーに無音の音声を再生（iOS/Chromeの自動再生ポリシー対策）
        initializeSpeech();

        const shuffledData = shuffleArray(allVocabulary).slice(0, questionCount);
        setQuizData(shuffledData);
        setCurrentQuestionIndex(0);
        setScore(0);
        setHistory([]);
        setIsQuizRunning(true);
        setupQuestion(0);
    };

    // 次の問題へ進む
    const nextQuestion = () => {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        setupQuestion(nextIndex);
    };

    // 回答処理
    const handleAnswer = (selectedMeaning: string | null) => {
        if (feedback) return; // 既に回答済みの場合は無視

        const reactionTimeMs = Date.now() - startTime;
        const reactionTime = formatReactionTime(reactionTimeMs);

        let isCorrect = false;
        if (selectedMeaning === null) {
            setFeedback("timeout");
        } else if (selectedMeaning === currentQuestion?.meaning) {
            setFeedback("correct");
            setScore((prev) => prev + 1);
            isCorrect = true;
        } else {
            setFeedback("incorrect");
        }

        setHistory((prev) =>
            [
                {
                    word: currentQuestion?.word || "",
                    isCorrect,
                    reactionTime,
                },
                ...prev,
            ].slice(0, DEFAULT_QUIZ_CONFIG.MAX_HISTORY_COUNT)
        );

        // インターバルの後に次の問題へ
        setTimeout(() => {
            nextQuestion();
        }, FEEDBACK_CONFIG.NEXT_QUESTION_DELAY_MS);
    };

    return {
        quizData,
        currentQuestionIndex,
        currentQuestion,
        choices,
        score,
        timeLeft,
        history,
        isQuizRunning,
        feedback,
        startQuiz,
        handleAnswer,
    };
};
