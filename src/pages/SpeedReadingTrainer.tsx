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
import type { PageNavigationProps } from "@/types";
import { useSpeedReadingQuiz } from "@/hooks/useSpeedReadingQuiz";
import { QuizFeedback } from "@/components/Quiz/QuizFeedback";
import { QuizChoiceGrid } from "@/components/Quiz/QuizChoiceGrid";
import { QuizTimer } from "@/components/Quiz/QuizTimer";
import { calculateProgress } from "@/utils/quizUtils";

export const SpeedReadingTrainer = ({ setPage }: PageNavigationProps) => {
  const {
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
  } = useSpeedReadingQuiz();

  // 進行状況の計算
  const overallProgress = calculateProgress(
    currentQuestionIndex,
    quizData.length || 10
  );

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
                スコア: {score} / {quizData.length}
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
                {currentQuestionIndex + 1} / {quizData.length}
              </span>
            </div>
            <Progress value={overallProgress} className="h-2" />

            {/* 2. 制限時間バー */}
            <QuizTimer timeLeft={timeLeft} timeLimit={quizData.length > 0 ? 3 : 0} className="mt-4" />

            {/* 3. 問題表示エリア */}
            <div className="my-8 text-center min-h-[150px]">
              {/* フィードバック (正解/不正解/時間切れ) */}
              <QuizFeedback feedback={feedback} />

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
            <QuizChoiceGrid
              choices={choices}
              onChoiceClick={handleAnswer}
              disabled={!!feedback}
            />
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
                className={`flex justify-between text-sm ${item.isCorrect ? "text-green-600" : "text-red-600"
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
