import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Music, TrendingUp } from "lucide-react";
import type { Song } from "@/types";

interface SongCardProps {
  song: Song;
  progress?: number;
  onClick: () => void;
}

export const SongCard = ({ song, progress = 0, onClick }: SongCardProps) => {
  const difficultyColors = {
    beginner: "from-emerald-400 to-teal-500",
    intermediate: "from-amber-400 to-orange-500",
    advanced: "from-rose-400 to-pink-500",
  };

  const difficultyLabels = {
    beginner: "初級",
    intermediate: "中級",
    advanced: "上級",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card
        onClick={onClick}
        className="group relative cursor-pointer overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-2xl"
      >
        {/* Background Image with Gradient Overlay */}
        <div className="relative h-48 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url(${song.coverImage})` }}
          />

          {/* Difficulty Badge */}
          <div className="absolute top-3 right-3">
            <div
              className={`rounded-full bg-gradient-to-r px-3 py-1 ${difficultyColors[song.difficulty]} text-xs font-bold text-white shadow-lg backdrop-blur-sm`}
            >
              {difficultyLabels[song.difficulty]}
            </div>
          </div>

          {/* Language Badge */}
          <div className="absolute top-3 left-3">
            <div className="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
              {song.language}
            </div>
          </div>
        </div>

        {/* Content Section with Glassmorphism */}
        <div className="relative bg-gradient-to-br from-white/95 to-white/80 p-5 backdrop-blur-xl">
          {/* Title and Artist */}
          <div className="mb-3">
            <h3 className="mb-1 line-clamp-1 text-lg font-bold text-gray-900 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent">
              {song.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Music className="h-4 w-4" />
              <span className="line-clamp-1">{song.artist}</span>
            </div>
          </div>

          {/* Progress Section */}
          {progress > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 font-semibold text-purple-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>進捗</span>
                </div>
                <span className="font-bold text-purple-700">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="relative h-2 overflow-hidden rounded-full bg-gray-200">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r ${difficultyColors[song.difficulty]} rounded-full`}
                />
              </div>
            </div>
          )}

          {/* Hover Effect Overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 transition-all duration-300 group-hover:from-purple-500/10 group-hover:to-pink-500/10" />
        </div>

        {/* Glow Effect on Hover */}
        <div className="absolute -inset-0.5 -z-10 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-20" />
      </Card>
    </motion.div>
  );
};
