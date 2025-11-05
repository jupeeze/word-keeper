import { QuizWordInput } from "../components/Quiz/QuizWordInput";
import { Button } from "@/components/ui/button";
import { QuizProgress } from "../components/Quiz/QuizProgress";

import type { PageName } from "../App";

type Props = { setPage: (page: PageName) => void };

export const QuizPage = ({ setPage }: Props) => {
  return (
    <div
      className="min-h-screen p-4 bg-yellow-100 bg-cover bg-center"
      style={{ backgroundImage: "url(/assets/stage2.jpg)" }}
    >
      <div className="flex flex-col gap-4 bg-white/90 p-6 rounded-lg max-w-md mx-auto text-gray-800 shadow-lg">
        <h2 className="text-2xl font-bold border-b-2 pb-2 text-center">
          古文書の解読
        </h2>
        <p className="text-center">
          今日のスペルを詠唱し、グリモワールに刻もう。
        </p>
        <div className="border-t-2 pt-4">
          <QuizProgress />
          <QuizWordInput />
          <Button
            onClick={() => setPage("dashboard")}
            variant="secondary"
            className="w-full mt-2"
          >
            書斎に戻る
          </Button>
        </div>
      </div>
    </div>
  );
};
