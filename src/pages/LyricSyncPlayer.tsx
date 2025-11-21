import { useState, useRef } from "react";
import type { PageNavigationProps } from "@/types";
import { useWordAction } from "@/hooks/useWordAction";
import { useSongStore } from "@/stores/songStore";
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
import { ArrowLeft } from "lucide-react";

interface PlayerState {
  playing: boolean;
}

interface LyricSyncPlayerProps extends PageNavigationProps {
  currentSongId?: string;
}

export const LyricSyncPlayer = ({ setPage, currentSongId }: LyricSyncPlayerProps) => {
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const { handleWordClick } = useWordAction(currentSongId);
  const { getSongById } = useSongStore();

  const [state, setState] = useState<PlayerState>({
    playing: false,
  });
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);

  const song = currentSongId ? getSongById(currentSongId) : null;

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
    if (!song) return;

    const playedSeconds = (event.target as HTMLVideoElement).currentTime;
    const nextLineIdx = song.lyrics.findIndex(
      (lyric) => lyric.startTime > playedSeconds
    );

    const currentLineIdx =
      nextLineIdx >= 0 ? nextLineIdx - 1 : song.lyrics.length - 1;
    setCurrentLyricIndex(currentLineIdx);
  };

  if (!currentSongId || !song) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-lg w-full">
          <CardHeader>
            <CardTitle className="text-center text-2xl">曲が選択されていません</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => setPage("songList")} size="lg">
              曲一覧に戻る
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { playing } = state;

  return (
    <div className="p-4 flex flex-col items-center gap-4 max-w-lg mx-auto">
      <div className="flex items-center gap-3 w-full">
        <Button
          onClick={() => setPage("songList")}
          variant="ghost"
          size="sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold flex-1">歌詞同期プレイヤー</h1>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>{song.title}</CardTitle>
          <p className="text-sm text-gray-600">{song.artist}</p>
        </CardHeader>
        <CardContent>
          {/* React Player */}
          <div className="aspect-video mb-4 rounded-md overflow-hidden">
            <ReactPlayer
              ref={playerRef}
              style={{ width: "100%", height: "auto", aspectRatio: "16/9" }}
              src={song.youtubeUrl}
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

          {/* 歌詞表示エリア */}
          <ScrollArea className="h-64 overflow-y-auto p-4 border rounded-md bg-gray-100">
            {currentLyricIndex === -1 && (
              <p className="text-center text-gray-500 mt-10">
                再生を開始してください...
              </p>
            )}
            {song.lyrics.map((line, index) => (
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
            onClick={() => setPage("songList")}
            variant="secondary"
            className="w-full"
          >
            曲一覧に戻る
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
