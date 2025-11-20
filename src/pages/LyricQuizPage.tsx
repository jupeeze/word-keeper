import { useEffect, useState } from "react";
import type { PageNavigationProps, FeedbackType } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useLyricQuizStore } from "../stores/lyricQuizStore";
import { QuizFeedback } from "@/components/Quiz/QuizFeedback";
import { QuizChoiceGrid } from "@/components/Quiz/QuizChoiceGrid";
import { FEEDBACK_CONFIG } from "@/constants/quiz";

export const LyricQuizPage = ({ setPage }: PageNavigationProps) => {
  const {
    startQuiz,
    currentQuestion,
    choices,
    handleAnswer,
    isQuizComplete,
    score,
    lyrics,
  } = useLyricQuizStore();

  // 正解・不正解のフィードバックを一時的に表示するためのstate
  const [feedback, setFeedback] = useState<FeedbackType | null>(null);

  // ページ読み込み時にクイズを開始
  useEffect(() => {
    startQuiz();
  }, [startQuiz]);

  const onAnswerClick = (translation: string) => {
    const isCorrect = handleAnswer(translation);
    // フィードバックを表示
    setFeedback(isCorrect ? "correct" : "incorrect");
    // 設定された時間後にフィードバックを非表示
    setTimeout(() => setFeedback(null), FEEDBACK_CONFIG.DISPLAY_DURATION_MS);
  };

  return (
    <div className="p-4 flex flex-col items-center gap-4 max-w-lg mx-auto">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>歌詞翻訳クイズ 🇰🇷</CardTitle>
        </CardHeader>

        {!isQuizComplete && currentQuestion ? (
          // クイズ中の表示
          <CardContent className="flex flex-col gap-4">
            <p className="text-center text-sm text-gray-600">
              以下の歌詞の正しい翻訳を選んでください。
            </p>
            {/* 質問（歌詞と読み） */}
            <div className="p-4 bg-blue-100 rounded-md text-center">
              <p className="text-2xl font-bold text-blue-800">
                {currentQuestion.text}
              </p>
              <p className="text-lg text-blue-600">
                ({currentQuestion.reading})
              </p>
            </div>

            {/* 選択肢ボタン */}
            <QuizChoiceGrid
              choices={choices}
              onChoiceClick={onAnswerClick}
              className="grid-cols-1"
            />

            {/* 正解・不正解のフィードバック */}
            <QuizFeedback feedback={feedback} className="text-xl" />
          </CardContent>
        ) : (
          // クイズ完了時の表示
          <CardContent className="flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold">クイズ完了！</h2>
            <p className="text-xl">
              スコア: {score} / {lyrics.length}
            </p>
            <Button onClick={() => setPage("lyricPlayer")} className="w-full">
              もう一度プレイヤーに戻る
            </Button>
          </CardContent>
        )}

        <CardFooter>
          <Button
            onClick={() => setPage("dashboard")}
            variant="secondary"
            className="w-full"
          >
            ダッシュボードに戻る
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
