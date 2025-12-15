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
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className="cursor-pointer rounded-lg transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
      aria-label={`${song.title} by ${song.artist}, ${progress.toFixed(1)}% complete`}
    >
      <div className="flex items-center gap-4">
        <div className="flex flex-shrink-0 flex-col items-center gap-2">
          <img
            src={song.coverImage}
            alt={`${song.title} by ${song.artist} album cover`}
            className="h-12 w-12 rounded-lg object-cover"
          />
          <span
            className="text-sm text-gray-500"
            aria-label={`Progress: ${progress.toFixed(1)} percent`}
          >
            {progress.toFixed(1)}%
          </span>
        </div>
        <div className="flex w-full flex-col gap-2">
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
              aria-label={`Play ${song.title}`}
            >
              <ListMusic aria-hidden="true" />
            </Button>
          </div>
          <Progress current={progress} total={100} label="" />
        </div>
      </div>
    </div>
  );
};
