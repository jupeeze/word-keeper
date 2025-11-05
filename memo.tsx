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

type Props = {
  setPage: (page: PageName) => void;
};

interface Vocabulary {
  word: string;
  reading: string;
  meaning: string;
}

interface LyricLine {
  startTime: number;
  text: string;
  reading: string;
  translation: string;
  vocabulary: Vocabulary[];
}

export const LyricSyncPlayer = ({ setPage }: Props) => {
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);

  const playerRef = useRef<HTMLVideoElement | null>(null);

  const handlePlay = () => {
    if (playerRef && playerRef.current) playerRef.current.currentTime = 10;
  };

  const handleTimeUpdate = () => {
    const player = playerRef.current;
    if (!player) return;

    const nextLineIdx = songData.lyrics.findIndex(
      (lyric) => lyric.startTime > player.currentTime
    );

    const currentLineIdx = nextLineIdx > 0 ? nextLineIdx - 1 : 0;
    setCurrentLyricIndex(currentLineIdx);
  };

  const currentLine: LyricLine | null =
    currentLyricIndex !== -1 ? songData.lyrics[currentLyricIndex] : null;

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-white/90 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">
        歌詞シンクプレイヤー
      </h2>

      {/* YouTubeプレイヤー */}
      <div className="aspect-video mb-4">
        <ReactPlayer
          ref={playerRef}
          src={songData.youtubeUrl}
          controls={false}
          width="100%"
          height="100%"
          onPlay={handlePlay}
          onTimeUpdate={handleTimeUpdate}
        />
      </div>

      {/* 歌詞表示エリア */}
      <div className="h-64 p-4 bg-gray-100 rounded-md border overflow-y-auto">
        {currentLine && (
          <div className="flex flex-col gap-3">
            {/* 1. 韓国語の歌詞 */}
            <p className="text-2xl font-bold text-blue-700">
              {currentLine.text}
            </p>
            {/* 2. 読み（カタカナ） */}
            <p className="text-lg text-gray-700">{currentLine.reading}</p>
            {/* 3. 意訳 */}
            <p className="text-md font-semibold text-black">
              {currentLine.translation}
            </p>

            <hr className="my-2" />

            {/* 4. 単語ごとの意味 */}
            <div>
              <h4 className="font-bold text-sm mb-2">単語</h4>
              <ul className="list-disc list-inside">
                {currentLine.vocabulary.map((vocab, index) => (
                  <li key={index} className="text-sm">
                    <strong>{vocab.word}</strong> ({vocab.reading}):{" "}
                    {vocab.meaning}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
