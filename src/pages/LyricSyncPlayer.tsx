import { useState, useRef } from "react";
import type { PageNavigationProps } from "@/types";
import { useWordAction } from "@/hooks/useWordAction";
import ReactPlayer from "react-player";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LyricLineDisplay } from "@/components/LyricPlayer/LyricLineDisplay";
import songData from "../data/song_data.json";

// ※トースト通知用の簡易コンポーネントやライブラリがない場合はconsole.logで代用しますが、
// ここではユーザー体験のために「保存しました」というフィードバックを出す処理を想定します。

interface PlayerState {
  playing: boolean;
}

export const LyricSyncPlayer = ({ setPage }: PageNavigationProps) => {
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const { handleWordClick } = useWordAction();

  const [state, setState] = useState<PlayerState>({
    playing: false,
  });
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);

  const handlePlayPause = () => {
    setState((prevState) => ({ ...prevState, playing: !prevState.playing }));
  };

  const handleStart = () => {
    setState((prevState) => ({
      ...prevState,
      playing: true,
    }));
  };

  const handleTimeUpdate = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    const playedSeconds = (event.target as HTMLVideoElement).currentTime;
    const nextLineIdx = songData.lyrics.findIndex(
      (lyric) => lyric.startTime > playedSeconds
    );

    const currentLineIdx =
      nextLineIdx >= 0 ? nextLineIdx - 1 : songData.lyrics.length - 1;
    setCurrentLyricIndex(currentLineIdx);
  };



  const { playing } = state;

  return (
    <div className="p-4 flex flex-col items-center gap-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold">歌詞同期プレイヤー</h1>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>K-Pop Player</CardTitle>
        </CardHeader>
        <CardContent>
          {/* React Player */}
          <div className="aspect-video mb-4 rounded-md overflow-hidden">
            <ReactPlayer
              ref={playerRef}
              style={{ width: "100%", height: "auto", aspectRatio: "16/9" }}
              src={songData.youtubeUrl}
              playing={playing}
              onStart={handleStart}
              onTimeUpdate={handleTimeUpdate}
              controls={true}
            />
          </div>

          {/* 再生コントロール */}
          <Button onClick={handlePlayPause} className="w-full mb-4">
            {playing ? "一時停止" : "再生"}
          </Button>

          <Button
            onClick={() => setPage("lyricQuiz")}
            variant="default"
            className="w-full mb-4 bg-green-600 hover:bg-green-700"
          >
            翻訳クイズに挑戦する
          </Button>

          {/* 歌詞表示エリア */}
          <ScrollArea className="h-64 overflow-y-auto p-4 border rounded-md bg-gray-100">
            {currentLyricIndex === -1 && (
              <p className="text-center text-gray-500 mt-10">
                再生を開始してください...
              </p>
            )}
            {songData.lyrics.map((line, index) => (
              <LyricLineDisplay
                key={index}
                line={line}
                isActive={index === currentLyricIndex}
                onWordClick={handleWordClick}
              />
            ))}
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => setPage("dashboard")}
            variant="secondary"
            className="w-full"
          >
            戻る
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
