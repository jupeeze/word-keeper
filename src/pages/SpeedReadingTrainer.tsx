import { useState, useEffect, useRef, useCallback } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// データソースのインポート
import songData from "../data/song_data.json";
import type { PageName } from "../App";

type Props = { setPage: (page: PageName) => void };

// 型定義
interface Vocabulary {
  word: string;
  reading: string;
  meaning: string;
}

interface HistoryItem {
  word: string;
  isCorrect: boolean;
  reactionTime: number; // ms
}

// 語彙データを読み込み、重複を排除
const allVocabulary: Vocabulary[] = [];
const wordSet = new Set<string>();

songData.lyrics.forEach((lyric) => {
  lyric.vocabulary.forEach((vocab) => {
    if (!wordSet.has(vocab.word)) {
      wordSet.add(vocab.word);
      allVocabulary.push(vocab as Vocabulary);
    }
  });
});

// 配列をシャッフルするヘルパー関数
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

// 韓国語の音声合成を実行する関数
const speakKorean = (text: string) => {
  if (typeof window.speechSynthesis === "undefined") {
    console.warn("音声合成はサポートされていません。");
    return;
  }
  window.speechSynthesis.cancel(); // 既存の発話をキャンセル
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ko-KR"; // 韓国語に設定
  utterance.rate = 0.9; // 少しゆっくり
  window.speechSynthesis.speak(utterance);
};

export const SpeedReadingTrainer = ({ setPage }: Props) => {
  const timeLimit = 3; // デフォルト3秒
  const questionCount = 10; // デフォルト10問

  const [quizData, setQuizData] = useState<Vocabulary[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Vocabulary | null>(
    null
  );
  const [choices, setChoices] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isQuizRunning, setIsQuizRunning] = useState(false);
  const [feedback, setFeedback] = useState<
    "correct" | "incorrect" | "timeout" | null
  >(null);
  const [startTime, setStartTime] = useState<number>(0);

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 制限時間タイマーのロジック
  useEffect(() => {
    if (isQuizRunning && feedback === null) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0.1) {
            clearInterval(timerIntervalRef.current!);
            handleAnswer(null); // タイムアウト処理
            return 0;
          }
          return prev - 0.1;
        });
      }, 100);
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
      const correctMeaning = question.meaning;
      const distractors = shuffleArray(allVocabulary)
        .filter((v) => v.meaning !== correctMeaning)
        .slice(0, 3)
        .map((v) => v.meaning);

      setChoices(shuffleArray([correctMeaning, ...distractors]));

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
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance("");
    synth.speak(utterance);

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

    const reactionTime = (Date.now() - startTime) / 1000; // 秒に変換

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
          reactionTime: parseFloat(reactionTime.toFixed(2)),
        },
        ...prev,
      ].slice(0, 5)
    ); // 直近5件の履歴を保持

    // 1秒のインターバルの後に次の問題へ
    setTimeout(() => {
      nextQuestion();
    }, 1000);
  };

  // 進行状況の計算
  const overallProgress = (currentQuestionIndex / questionCount) * 100;
  const timerProgress = (timeLeft / timeLimit) * 100;

  // フィードバックのスタイル
  const getFeedbackClasses = () => {
    if (!feedback) return "opacity-0";
    if (feedback === "correct") return "opacity-100 text-green-500";
    if (feedback === "incorrect") return "opacity-100 text-red-500";
    if (feedback === "timeout") return "opacity-100 text-yellow-500";
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          スピード単語クイズ (韓国語)
        </CardTitle>
        {!isQuizRunning && (
          <CardDescription className="text-center pt-2">
            表示される単語の意味を素早く当てよう！
          </CardDescription>
        )}
      </CardHeader>

      {!isQuizRunning ? (
        // --- 開始前 または 終了後 ---
        <CardContent className="flex flex-col items-center gap-6">
          {quizData.length > 0 && (
            // --- 終了後 ---
            <div className="text-center">
              <h3 className="text-4xl font-bold">終了！</h3>
              <p className="text-2xl mt-4">
                スコア: {score} / {questionCount}
              </p>
            </div>
          )}
          <Button onClick={startQuiz} className="w-full text-lg py-6">
            {quizData.length > 0 ? "もう一度挑戦" : "クイズ開始"}
          </Button>
          <Button
            onClick={() => setPage("dashboard")}
            className="w-full text-lg py-6"
          >
            ダッシュボードに戻る
          </Button>
        </CardContent>
      ) : (
        // --- クイズ実行中 ---
        currentQuestion && (
          <CardContent className="flex flex-col gap-4">
            {/* 1. スコアと全体の進行状況 */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold">スコア: {score}</span>
              <span className="text-lg text-gray-500">
                {currentQuestionIndex + 1} / {questionCount}
              </span>
            </div>
            <Progress value={overallProgress} className="h-2" />

            {/* 2. 制限時間バー */}
            <Progress value={timerProgress} className="h-4 mt-4" />

            {/* 3. 問題表示エリア */}
            <div className="my-8 text-center min-h-[150px]">
              {/* フィードバック (正解/不正解/時間切れ) */}
              <div
                className={`text-3xl font-bold transition-opacity duration-300 ${getFeedbackClasses()}`}
              >
                {feedback === "correct" && "正解！"}
                {feedback === "incorrect" && "不正解"}
                {feedback === "timeout" && "時間切れ"}
              </div>

              {/* 問題の単語 */}
              {!feedback && (
                <div className="animate-in fade-in">
                  <h2 className="text-7xl font-bold">{currentQuestion.word}</h2>
                  <p className="text-2xl text-gray-400 mt-2">
                    {currentQuestion.reading}
                  </p>
                </div>
              )}
            </div>

            {/* 4. 選択肢ボタン */}
            <div className="grid grid-cols-2 gap-3">
              {choices.map((meaning) => (
                <Button
                  key={meaning}
                  variant="outline"
                  className="text-base p-6 h-auto whitespace-normal"
                  onClick={() => handleAnswer(meaning)}
                  disabled={!!feedback}
                >
                  {meaning}
                </Button>
              ))}
            </div>
          </CardContent>
        )
      )}

      {/* 5. 履歴表示 */}
      {history.length > 0 && (
        <CardFooter className="flex flex-col items-start gap-2 border-t pt-4">
          <h4 className="font-semibold">直近の履歴:</h4>
          <ul className="list-none w-full">
            {history.map((item, index) => (
              <li
                key={index}
                className={`flex justify-between text-sm ${
                  item.isCorrect ? "text-green-600" : "text-red-600"
                }`}
              >
                <span>{item.word}</span>
                <span>
                  {item.isCorrect ? "正解" : "不正解"} ({item.reactionTime}s)
                </span>
              </li>
            ))}
          </ul>
        </CardFooter>
      )}
    </Card>
  );
};

export default SpeedReadingTrainer;
