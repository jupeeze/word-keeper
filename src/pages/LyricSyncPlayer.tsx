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
import { Play, Pause } from "lucide-react";

// App.tsx から渡される setPage プロパティの型
// (App.tsx 側で "lyricPlayer" などの型を追加する必要があります)
type Props = {
  setPage: (page: PageName) => void;
};

// 歌詞データの型定義
interface LyricLine {
  time: number; // 秒
  text: string;
}

// ダミーの歌詞データ（タイムスタンプと歌詞）
const dummyLyrics: LyricLine[] = [
  { time: 0, text: "（曲の始まり）" },
  { time: 5.5, text: "가사 라인 1 (歌詞ライン1)" },
  { time: 8.2, text: "가사 라인 2 (歌詞ライン2)" },
  { time: 11.0, text: "가사 라인 3 (歌詞ライン3)" },
  { time: 14.8, text: "가사 라인 4 (歌詞ライン4)" },
  { time: 17.5, text: "가사 라인 5 (歌詞ライン5)" },
  { time: 20.1, text: "가사 라인 6 (歌詞ライン6)" },
  { time: 23.0, text: "（間奏）" },
  { time: 28.3, text: "가사 라인 7 (歌詞ライン7)" },
  { time: 31.9, text: "가사 라인 8 (歌詞ライン8)" },
];

// ダミーのYouTube動画URL
const YOUTUBE_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // テスト用の動画URL

export const LyricSyncPlayer = ({ setPage }: Props) => {
  const [playing, setPlaying] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);

  // 再生時間の更新をハンドリング
  const handleProgress = (state: { playedSeconds: number }) => {
    setPlayedSeconds(state.playedSeconds);

    // 現在の再生時間に基づいて表示すべき歌詞のインデックスを見つける
    const newIndex = dummyLyrics.findIndex((line, index) => {
      const nextLine = dummyLyrics[index + 1];
      // 次の行がない（最後の歌詞）か、次の行の時間より前であれば、現在の行
      return (
        state.playedSeconds >= line.time &&
        (!nextLine || state.playedSeconds < nextLine.time)
      );
    });

    if (newIndex !== -1 && newIndex !== currentLyricIndex) {
      setCurrentLyricIndex(newIndex);
    }
  };

  const togglePlay = () => {
    setPlaying(!playing);
  };

  const playerRef = useRef<HTMLAudioElement | null>(null);

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
              src={YOUTUBE_URL}
              playing={playing}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              width="100%"
              height="100%"
            />
          </div>

          {/* 再生コントロール */}
          <Button onClick={togglePlay} className="w-full mb-4">
            {playing ? (
              <Pause className="mr-2 h-4 w-4" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            {playing ? "一時停止" : "再生"}
          </Button>

          {/* 歌詞表示エリア */}
          <div className="h-64 overflow-y-auto p-4 border rounded-md bg-gray-50">
            {dummyLyrics.map((line, index) => (
              <p
                key={index}
                className={`text-lg text-center p-2 transition-all ${
                  index === currentLyricIndex
                    ? "font-bold text-blue-600 scale-105"
                    : "text-gray-500"
                }`}
              >
                {line.text}
              </p>
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
