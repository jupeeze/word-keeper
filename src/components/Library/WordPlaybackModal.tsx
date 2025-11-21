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
import type { SavedWord } from "@/types"; // Phase 1で作成した型定義

interface Props {
    wordData: SavedWord | null;
    isOpen: boolean;
    onClose: () => void;
}

export const WordPlaybackModal = ({ wordData, isOpen, onClose }: Props) => {
    const playerRef = useRef<HTMLVideoElement | null>(null);
    const [playing, setPlaying] = useState(false);

    // モーダルが開いたときに自動再生の準備をする
    useEffect(() => {
        if (isOpen && wordData) {
            setPlaying(true);
        } else {
            setPlaying(false);
        }
    }, [isOpen, wordData]);

    const handleReady = () => {
        // プレーヤーの準備ができたら、保存されたタイムスタンプにシークする
        if (playerRef.current && wordData) {
            playerRef.current.currentTime = wordData.context.timestamp;
        }
    };

    if (!wordData) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-center">
                        {wordData.word}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {wordData.meaning}
                    </DialogDescription>
                </DialogHeader>

                {/* 動画プレーヤーエリア */}
                <div className="relative aspect-video w-full overflow-hidden rounded-md">
                    <ReactPlayer
                        ref={playerRef}
                        style={{ width: "100%", height: "100%" }}
                        src={wordData.context.youtubeUrl}
                        playing={playing}
                        controls={true}
                        onReady={handleReady}
                    />
                </div>

                {/* 文脈情報（歌詞と曲名） */}
                <div className="mt-4 space-y-2 text-center">
                    <div className="bg-slate-100 p-3 rounded-md dark:bg-slate-800">
                        <p className="text-lg font-medium text-blue-600">
                            ♪ {wordData.context.sourceLyric}
                        </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {wordData.context.songTitle} - {wordData.context.artistName}
                    </p>
                </div>

                <div className="flex justify-end mt-2">
                    <Button variant="outline" onClick={onClose}>
                        閉じる
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
