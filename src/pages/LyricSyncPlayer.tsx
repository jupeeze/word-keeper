import { useState, useRef } from "react";
import type { PageName } from "../App";
import ReactPlayer from "react-player";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import songData from "../data/song_data.json";
import { Divide } from "lucide-react";

type Props = {
  setPage: (page: PageName) => void;
};

export const LyricSyncPlayer = ({ setPage }: Props) => {
  const playerRef = useRef<HTMLVideoElement | null>(null);

  const initialState = {
    playing: false,
  };

  type PlayerState = Omit<typeof initialState, "src"> & {
    src?: string;
  };

  const [state, setState] = useState<PlayerState>(initialState);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);

  const handlePlayPause = () => {
    setState((prevState) => ({ ...prevState, playing: !prevState.playing }));
  };

  const handleStart = () => {
    setState((prevState) => ({
      ...prevState,
      playing: true,
    }));

    if (playerRef && playerRef.current) playerRef.current.currentTime = 10;
  };

  const handleTimeUpdate = () => {
    const player = playerRef.current;
    if (!player) return;

    const nextLineIdx = songData.lyrics.findIndex(
      (lyric) => lyric.startTime > player.currentTime
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
          <div className="aspect-video w-full mb-4 bg-gray-200 rounded-md overflow-hidden">
            <ReactPlayer
              ref={playerRef}
              style={{ width: "100%", height: "auto", aspectRatio: "16/9" }}
              src={songData.youtubeUrl}
              playing={playing}
              onStart={handleStart}
              onTimeUpdate={handleTimeUpdate}
            />
          </div>

          {/* 再生コントロール */}
          <Button onClick={handlePlayPause} className="w-full mb-4">
            {playing ? "一時停止" : "再生"}
          </Button>

          {/* 歌詞表示エリア */}
          <div className="h-64 overflow-y-auto p-4 border rounded-md bg-gray-50">
            {currentLyricIndex === -1 && (
              <p
                className={`text-lg text-center p-2 transition-all font-bold text-blue-600 scale-105`}
              >
                ...
              </p>
            )}
            {songData.lyrics.map((line, index) => (
              <div key={index} className="p-2 items-center flex justify-center">
                {line.vocabulary.map((vocab, vocabIdx) => (
                  <div key={vocabIdx} className="px-2 text-center">
                    <p
                      className={`text-xs transition-all ${
                        index <= currentLyricIndex
                          ? "font-bold text-blue-600 scale-105"
                          : "text-gray-500"
                      }`}
                    >
                      {vocab.reading}
                    </p>
                    <p
                      className={`text-lg transition-all ${
                        index <= currentLyricIndex
                          ? "font-bold text-blue-600 scale-105"
                          : "text-gray-500"
                      }`}
                    >
                      {vocab.word}
                    </p>
                    <p
                      className={`text-sm transition-all ${
                        index <= currentLyricIndex
                          ? "font-bold text-blue-600 scale-105"
                          : "text-gray-500"
                      }`}
                    >
                      {vocab.meaning}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
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
