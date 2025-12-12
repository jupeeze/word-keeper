import { useState, useRef, useEffect } from "react";
import type { PageNavigationProps } from "@/types";
import { useWordAction } from "@/hooks/useWordAction";
import { useSongStore } from "@/stores/songStore";
import ReactPlayer from "react-player";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LyricLineDisplay } from "@/components/LyricPlayer/LyricLineDisplay";
import { ArrowLeft, Music } from "lucide-react";
import { motion } from "motion/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

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
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  // Auto-scroll to active lyric in carousel
  useEffect(() => {
    if (!carouselApi || currentLyricIndex < 0) return;
    carouselApi.scrollTo(currentLyricIndex);
  }, [carouselApi, currentLyricIndex]);

  const song = currentSongId ? getSongById(currentSongId) : null;

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
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader className="relative h-8 flex-row justify-start">
          <Button
            onClick={() => setPage("songList")}
            variant="ghost"
            size="sm"
            className="glass-panel shrink-0 transition-all duration-300 hover:bg-white/40"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <CardTitle className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-2 text-2xl">
            <Music className="h-6 w-6 shrink-0" />
            <span className="truncate">{song.title}</span>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Video Player Section */}
      <Card className="glass-card hover-lift overflow-hidden border-0">
        <CardContent className="h-full space-y-4">
          {/* React Player */}
          <div className="aspect-video overflow-hidden rounded-xl">
            <ReactPlayer
              ref={playerRef}
              style={{
                width: "100%",
                height: "100%",
                aspectRatio: "16/9",
              }}
              src={song.youtubeUrl}
              playing={playing}
              onStart={handleStart}
              onTimeUpdate={handleTimeUpdate}
              controls={true}
            />
          </div>
          <Carousel
            setApi={setCarouselApi}
            opts={{
              align: "start",
            }}
            orientation="vertical"
          >
            <CarouselContent className="h-88">
              {song.lyrics.map((line, index) => (
                <CarouselItem key={index} className="basis-1/4">
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
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </CardContent>
      </Card>
    </div>
  );
};
