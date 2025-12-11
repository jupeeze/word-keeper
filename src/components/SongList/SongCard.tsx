import type { Song } from "@/types";

interface SongCardProps {
  song: Song;
  progress?: number;
  onClick: () => void;
}

export const SongCard = ({ song, progress = 0, onClick }: SongCardProps) => {
  return (
    <div onClick={onClick}>
      <div className="flex items-center gap-4">
        <div
          className="h-12 w-12 rounded-lg bg-cover bg-center"
          style={{ backgroundImage: `url(${song.coverImage})` }}
        />
        <div className="flex flex-col gap-1">
          <span className="font-bold">{song.title}</span>
          <span className="text-sm text-gray-500">{song.artist}</span>
        </div>
      </div>
    </div>
  );
};
