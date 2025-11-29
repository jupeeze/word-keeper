import { useState, useRef } from "react";
import type { PageNavigationProps } from "@/types";
import { useWordAction } from "@/hooks/useWordAction";
import { useSongStore } from "@/stores/songStore";
import ReactPlayer from "react-player";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LyricLineDisplay } from "@/components/LyricPlayer/LyricLineDisplay";
import { ArrowLeft, Play, Pause, Music2, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface PlayerState {
  playing: boolean;
}

interface LyricSyncPlayerProps extends PageNavigationProps {
  currentSongId?: string;
}

export const LyricSyncPlayer = ({
  setPage,
  currentSongId,
}: LyricSyncPlayerProps) => {
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
      (lyric) => lyric.startTime > playedSeconds,
    );

    const currentLineIdx =
      nextLineIdx >= 0 ? nextLineIdx - 1 : song.lyrics.length - 1;
    setCurrentLyricIndex(currentLineIdx);
  };

  if (!currentSongId || !song) {
    return (
      <div className="gradient-primary flex min-h-screen items-center justify-center p-4">
        <Card className="glass-card w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              曲が選択されていません
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Button
              onClick={() => setPage("songList")}
              size="lg"
              className="btn-premium"
            >
              曲一覧に戻る
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { playing } = state;

  return (
    <div className="gradient-primary relative min-h-screen overflow-hidden">
      {/* Animated Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -left-1/4 h-1/2 w-1/2 rounded-full bg-gradient-to-br from-purple-300/30 to-pink-300/30 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -right-1/4 -bottom-1/4 h-1/2 w-1/2 rounded-full bg-gradient-to-tl from-blue-300/30 to-purple-300/30 blur-3xl"
        />
      </div>

      <div className="relative mx-auto max-w-6xl space-y-6 p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4"
        >
          <Button
            onClick={() => setPage("songList")}
            variant="ghost"
            size="sm"
            className="glass-panel transition-all duration-300 hover:bg-white/40"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex flex-1 items-center gap-3">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <h1 className="text-gradient-primary text-3xl font-bold">
              歌詞同期プレイヤー
            </h1>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Video Player Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="glass-card hover-lift overflow-hidden border-0">
              <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                <div className="flex items-center gap-3">
                  <Music2 className="h-6 w-6 text-purple-600" />
                  <div className="flex-1">
                    <CardTitle className="text-2xl">{song.title}</CardTitle>
                    <p className="mt-1 text-sm text-gray-600">{song.artist}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {/* React Player */}
                <div className="aspect-video overflow-hidden rounded-xl shadow-2xl ring-2 ring-purple-200/50">
                  <ReactPlayer
                    ref={playerRef}
                    style={{
                      width: "100%",
                      height: "auto",
                      aspectRatio: "16/9",
                    }}
                    src={song.youtubeUrl}
                    playing={playing}
                    onStart={handleStart}
                    onTimeUpdate={handleTimeUpdate}
                    controls={true}
                  />
                </div>

                {/* Play/Pause Control */}
                <Button
                  onClick={handlePlayPause}
                  className="h-14 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-pink-700 hover:shadow-xl"
                >
                  {playing ? (
                    <>
                      <Pause className="mr-2 h-5 w-5" />
                      一時停止
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-5 w-5" />
                      再生
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Lyrics Display Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="glass-card flex h-full flex-col border-0">
              <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🎵</span>
                  歌詞
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[500px] p-6">
                  {currentLyricIndex === -1 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-20 text-center"
                    >
                      <div className="glass-panel inline-block rounded-2xl p-6">
                        <Play className="mx-auto mb-4 h-16 w-16 animate-pulse text-purple-600" />
                        <p className="text-lg font-medium text-gray-600">
                          再生を開始してください...
                        </p>
                      </div>
                    </motion.div>
                  )}
                  <div className="space-y-3">
                    {song.lyrics.map((line, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <LyricLineDisplay
                          line={line}
                          isActive={index === currentLyricIndex}
                          onWordClick={handleWordClick}
                        />
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center"
        >
          <Button
            onClick={() => setPage("songList")}
            variant="outline"
            className="glass-panel rounded-full px-8 transition-all duration-300 hover:scale-105 hover:bg-white/40"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            曲一覧に戻る
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
