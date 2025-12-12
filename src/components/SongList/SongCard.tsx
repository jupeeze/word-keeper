import type { Song } from "@/types";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ListMusic } from "lucide-react";

interface SongCardProps {
  song: Song;
  progress?: number;
  onClick: () => void;
  onPlay: () => void;
}

export const SongCard = ({
  song,
  progress = 0,
  onClick,
  onPlay,
}: SongCardProps) => {
  return (
    <div onClick={onClick}>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center gap-2">
          <div
            className="h-12 w-12 rounded-lg bg-cover bg-center"
            style={{ backgroundImage: `url(${song.coverImage})` }}
          />
          <span className="text-sm text-gray-500">{progress.toFixed(1)}%</span>
        </div>
        <div className="w-full flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-bold">{song.title}</span>
              <span className="text-sm text-gray-500">{song.artist}</span>
            </div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onPlay();
              }}
            >
              <ListMusic />
            </Button>
          </div>
          <Progress current={progress} total={100} label="" />
        </div>
      </div>
    </div>
  );
};
