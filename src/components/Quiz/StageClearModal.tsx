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
  onNextStage: () => void;
}

export const StageClearModal = ({ isOpen, onNextStage }: Props) => {
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleNext = () => {
    onNextStage();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>ステージクリア！🎉</DialogTitle>
        </DialogHeader>
        <p className="my-4 text-center">全ての単語を正解しました！</p>
        <DialogFooter>
          <Button onClick={handleNext} className="w-full">
            次のステージへ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
