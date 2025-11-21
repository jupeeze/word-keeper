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
                className="group relative overflow-hidden cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
                {/* Background Image with Gradient Overlay */}
                <div className="relative h-48 overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundImage: `url(${song.coverImage})` }}
                    />

                    {/* Difficulty Badge */}
                    <div className="absolute top-3 right-3">
                        <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${difficultyColors[song.difficulty]} text-white text-xs font-bold shadow-lg backdrop-blur-sm`}>
                            {difficultyLabels[song.difficulty]}
                        </div>
                    </div>

                    {/* Language Badge */}
                    <div className="absolute top-3 left-3">
                        <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold border border-white/30">
                            {song.language}
                        </div>
                    </div>
                </div>

                {/* Content Section with Glassmorphism */}
                <div className="relative p-5 bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-xl">
                    {/* Title and Artist */}
                    <div className="mb-3">
                        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
                            {song.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Music className="w-4 h-4" />
                            <span className="line-clamp-1">{song.artist}</span>
                        </div>
                    </div>

                    {/* Progress Section */}
                    {progress > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1 text-purple-600 font-semibold">
                                    <TrendingUp className="w-3 h-3" />
                                    <span>進捗</span>
                                </div>
                                <span className="font-bold text-purple-700">{Math.round(progress)}%</span>
                            </div>
                            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
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
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300 pointer-events-none" />
                </div>

                {/* Glow Effect on Hover */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 -z-10" />
            </Card>
        </motion.div>
    );
};
