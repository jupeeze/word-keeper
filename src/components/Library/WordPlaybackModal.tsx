import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import type { SavedWord, SavedWordContext } from "@/types";

interface Props {
  wordData: SavedWord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WordPlaybackModal = ({ wordData, isOpen, onClose }: Props) => {
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [selectedContextIndex, setSelectedContextIndex] = useState(0);

  // モーダルが開いたときに自動再生の準備をする
  useEffect(() => {
    if (isOpen && wordData) {
      setPlaying(true);
      setSelectedContextIndex(0); // Reset to first context
    } else {
      setPlaying(false);
    }
  }, [isOpen, wordData]);

  const handleReady = () => {
    // プレーヤーの準備ができたら、保存されたタイムスタンプにシークする
    if (
      playerRef.current &&
      wordData &&
      wordData.contexts[selectedContextIndex]
    ) {
      playerRef.current.currentTime =
        wordData.contexts[selectedContextIndex].timestamp;
    }
  };

  // コンテキストが変更されたときにタイムスタンプを更新
  useEffect(() => {
    if (
      playerRef.current &&
      wordData &&
      wordData.contexts[selectedContextIndex]
    ) {
      playerRef.current.currentTime =
        wordData.contexts[selectedContextIndex].timestamp;
    }
  }, [selectedContextIndex, wordData]);

  if (!wordData) return null;

  const currentContext = wordData.contexts[selectedContextIndex];
  const hasMultipleContexts = wordData.contexts.length > 1;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-center">
          <DialogTitle>
            <p className="text-xl font-bold">{wordData.word}</p>
            <p className="text-xs text-gray-500">{wordData.reading}</p>
          </DialogTitle>
          <DialogDescription>
            <p className="text-sm text-gray-700">{wordData.meaning}</p>
            <p className="text-xs text-gray-500">{wordData.note || ""}</p>
          </DialogDescription>
        </DialogHeader>

        {/* コンテキスト選択タブ (複数ある場合のみ表示) */}
        {hasMultipleContexts && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {wordData.contexts.map((ctx: SavedWordContext, index: number) => (
              <Button
                key={ctx.id}
                variant={selectedContextIndex === index ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedContextIndex(index)}
                className="flex-shrink-0 gap-1"
              >
                <MapPin className="h-3 w-3" />
                {index + 1}. {ctx.songTitle}
              </Button>
            ))}
          </div>
        )}

        {/* 動画プレーヤーエリア */}
        <div className="relative">
          <ReactPlayer
            ref={playerRef}
            className="aspect-video overflow-hidden rounded-xl"
            style={{ width: "100%", height: "auto" }}
            src={currentContext.youtubeUrl}
            playing={playing}
            controls={true}
            onReady={handleReady}
          />
        </div>

        {/* 文脈情報(歌詞と曲名) */}
        <div className="mt-4 space-y-2 text-center">
          <div className="rounded-md bg-slate-100 p-3 dark:bg-slate-800">
            <p className="text-lg font-medium text-blue-600">
              ♪ {currentContext.sourceLyric}
            </p>
          </div>
          <p className="text-muted-foreground text-sm">
            {currentContext.songTitle} - {currentContext.artistName}
          </p>
          {hasMultipleContexts && (
            <p className="text-xs font-semibold text-purple-600">
              {wordData.contexts.length}箇所で使用されています
            </p>
          )}
        </div>

        <div className="mt-2 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            閉じる
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
