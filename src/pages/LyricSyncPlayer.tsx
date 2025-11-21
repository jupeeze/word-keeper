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
} from "@/components/ui/card";
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
      <div className="min-h-screen gradient-primary flex items-center justify-center p-4">
        <Card className="max-w-lg w-full glass-card">
          <CardHeader>
            <CardTitle className="text-center text-2xl">曲が選択されていません</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => setPage("songList")} size="lg" className="btn-premium">
              曲一覧に戻る
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { playing } = state;

  return (
    <div className="min-h-screen gradient-primary relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-purple-300/30 to-pink-300/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-tl from-blue-300/30 to-purple-300/30 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
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
            className="glass-panel hover:bg-white/40 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3 flex-1">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h1 className="text-3xl font-bold text-gradient-primary">歌詞同期プレイヤー</h1>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Video Player Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="glass-card border-0 overflow-hidden hover-lift">
              <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                <div className="flex items-center gap-3">
                  <Music2 className="w-6 h-6 text-purple-600" />
                  <div className="flex-1">
                    <CardTitle className="text-2xl">{song.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{song.artist}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* React Player */}
                <div className="aspect-video rounded-xl overflow-hidden shadow-2xl ring-2 ring-purple-200/50">
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

                {/* Play/Pause Control */}
                <Button
                  onClick={handlePlayPause}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  {playing ? (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      一時停止
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
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
            <Card className="glass-card border-0 h-full flex flex-col">
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
                      className="text-center py-20"
                    >
                      <div className="inline-block p-6 glass-panel rounded-2xl">
                        <Play className="w-16 h-16 mx-auto mb-4 text-purple-600 animate-pulse" />
                        <p className="text-gray-600 text-lg font-medium">
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
            className="glass-panel hover:bg-white/40 px-8 rounded-full transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            曲一覧に戻る
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
