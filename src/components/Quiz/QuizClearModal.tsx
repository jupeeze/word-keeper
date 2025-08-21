import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface Props {
  isOpen: boolean;
  onEndQuiz: () => void;
}

export const QuizClearModal = ({ isOpen, onEndQuiz }: Props) => {
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleEnd = () => {
    onEndQuiz();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>今日の研究完了！🎉</DialogTitle>
        </DialogHeader>
        <p className="my-4 text-center">全てのスペルの解読に成功しました！</p>
        <DialogFooter>
          <Button onClick={handleEnd} className="w-full">
            書斎に戻る
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
