import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Play, ArrowRight } from "lucide-react";
import ReactPlayer from "react-player";

interface RewardVideoPlayerProps {
  youtubeUrl: string;
  startTime: number;
  nextStartTime?: number;
  reading: string;
  lyricText: string;
  translation: string;
  onNext: () => void;
}

const RewardVideoPlayer = ({
  youtubeUrl,
  startTime,
  nextStartTime,
  reading,
  lyricText,
  translation,
  onNext,
}: RewardVideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const playerRef = useRef<HTMLVideoElement>(null);

  const handleTimeUpdate = () => {
    if (!playerRef.current) return;
    if (nextStartTime && playerRef.current.currentTime >= nextStartTime) {
      setIsPlaying(false);
    }
  };

  const handleStart = () => {
    if (playerRef.current) {
      playerRef.current.currentTime = startTime;
    }
  };

  const handleReplay = () => {
    setIsPlaying(true);
    handleStart();
  };

  return (
    <Card className="items-center">
      <CardHeader>
        {/* Info */}
        <div className="text-lg font-semibold">
          報酬として、動画を視聴できます
        </div>
      </CardHeader>
      <CardContent className="text-center">
        {/* Lyric display */}
        <div className="my-2">
          <p className="text-xs font-medium text-purple-600">{reading}</p>
          <p className="text-lg font-bold text-blue-800">{lyricText}</p>
          <p className="text-sm text-gray-600">{translation}</p>
        </div>

        {/* Video player */}
        <div className="relative">
          <ReactPlayer
            ref={playerRef}
            className="aspect-video overflow-hidden rounded-xl"
            style={{ width: "100%", height: "auto" }}
            src={youtubeUrl}
            playing={isPlaying}
            controls={false}
            onStart={handleStart}
            onTimeUpdate={handleTimeUpdate}
          />
        </div>
      </CardContent>
      <CardFooter>
        {/* Control buttons */}
        <div className="flex w-full gap-4">
          <Button
            onClick={handleReplay}
            variant="outline"
            size="lg"
            className="flex-1"
          >
            <Play className="mr-2 h-5 w-5" />
            もう一度再生
          </Button>
          <Button onClick={onNext} size="lg" className="flex-1">
            次の行へ進む
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RewardVideoPlayer;
