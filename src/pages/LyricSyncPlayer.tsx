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
import { ScrollArea } from "@/components/ui/scroll-area";
import songData from "../data/song_data.json";
import { useLibraryStore } from "@/stores/libraryStore";

// ※トースト通知用の簡易コンポーネントやライブラリがない場合はconsole.logで代用しますが、
// ここではユーザー体験のために「保存しました」というフィードバックを出す処理を想定します。

type Props = {
  setPage: (page: PageName) => void;
};

export const LyricSyncPlayer = ({ setPage }: Props) => {
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const { addWord } = useLibraryStore();

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

  // --- 追加: 単語クリック時の処理 ---
  const handleWordClick = (
    word: string,
    reading: string,
    meaning: string,
    lyricLine: (typeof songData.lyrics)[0]
  ) => {
    // ストアに保存
    addWord(word, meaning, reading, {
      // song_data.jsonに追加した型定義が必要ですが、一旦キャストまたは補完します
      songTitle: songData.title || "Unknown Title",
      artistName: songData.artist || "Unknown Artist",
      youtubeUrl: songData.youtubeUrl,
      timestamp: lyricLine.startTime, // その歌詞行の開始時間を保存
      sourceLyric: lyricLine.text, // 文脈としてその行の歌詞を保存
    });

    // 簡易的なフィードバック（本来はToastコンポーネント推奨）
    alert(`「${word}」を単語帳に保存しました！📖`);
  };
  // --------------------------------

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
              <div
                key={index}
                // 現在の行を目立たせ、自動スクロールの目安にする
                className={`p-4 mb-2 rounded-lg transition-all duration-300 flex flex-wrap justify-center gap-2 ${index === currentLyricIndex
                  ? "bg-blue-100 scale-105 shadow-md"
                  : "bg-white opacity-70"
                  }`}
              // 現在の行に自動スクロールする処理を入れるとより良い（今回は省略）
              >
                {line.vocabulary.map((vocab, vocabIdx) => (
                  <div
                    key={vocabIdx}
                    // --- 変更: クリック可能にするスタイルとイベント ---
                    className="cursor-pointer hover:bg-yellow-200 hover:scale-110 transition-transform p-1 rounded-md text-center group relative"
                    onClick={(e) => {
                      e.stopPropagation(); // 親要素への伝播を防ぐ
                      handleWordClick(
                        vocab.word,
                        vocab.reading,
                        vocab.meaning,
                        line
                      );
                    }}
                  >
                    <p className="text-xs text-gray-500 mb-1">
                      {vocab.reading}
                    </p>
                    <p className="text-lg font-bold text-gray-800 group-hover:text-blue-600">
                      {vocab.word}
                    </p>
                    <p className="text-xs text-gray-400 group-hover:text-gray-600">
                      {vocab.meaning}
                    </p>

                    {/* ホバー時に「＋」アイコンなどを出すと登録機能だと分かりやすい */}
                    <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-sm">
                      +
                    </div>
                  </div>
                ))}
              </div>
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
