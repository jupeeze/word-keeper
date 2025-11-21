import { useState } from "react";
import { motion } from "motion/react";
import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SongCard } from "@/components/SongList/SongCard";
import { useSongStore } from "@/stores/songStore";
import { useLyricProgressStore } from "@/stores/lyricProgressStore";
import type { PageNavigationProps } from "@/types";

export const SongListPage = ({ setPage }: PageNavigationProps) => {
    const {
        searchQuery,
        setSearchQuery,
        setDifficultyFilter,
        getFilteredSongs,
    } = useSongStore();

    const { progressBySong } = useLyricProgressStore();
    const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

    const filteredSongs = getFilteredSongs();

    const handleDifficultyFilter = (difficulty: string) => {
        if (selectedDifficulty === difficulty) {
            setSelectedDifficulty(null);
            setDifficultyFilter(null);
        } else {
            setSelectedDifficulty(difficulty);
            setDifficultyFilter(difficulty);
        }
    };

    const handleSongClick = (songId: string) => {
        setPage("lyricProgress", songId);
    };

    const getProgress = (songId: string): number => {
        const progress = progressBySong[songId];
        if (!progress) return 0;
        return (progress.totalCompletedLines / progress.lineProgress.length) * 100;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
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

            <div className="relative max-w-7xl mx-auto p-6 space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center space-y-4"
                >
                    <div className="flex items-center justify-center gap-3">
                        <Sparkles className="w-8 h-8 text-purple-600" />
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                            Word Keeper
                        </h1>
                        <Sparkles className="w-8 h-8 text-pink-600" />
                    </div>
                    <p className="text-gray-600 text-lg">歌詞で楽しく語学学習</p>
                </motion.div>

                {/* Search and Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="space-y-4"
                >
                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="曲名やアーティストで検索..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 h-14 text-lg border-2 border-purple-200 focus:border-purple-400 rounded-2xl shadow-lg bg-white/80 backdrop-blur-sm transition-all duration-300 focus:shadow-xl"
                        />
                    </div>

                    {/* Difficulty Filters */}
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                        <span className="text-sm font-semibold text-gray-600">難易度:</span>
                        {[
                            { value: "beginner", label: "初級", color: "from-emerald-400 to-teal-500" },
                            { value: "intermediate", label: "中級", color: "from-amber-400 to-orange-500" },
                            { value: "advanced", label: "上級", color: "from-rose-400 to-pink-500" },
                        ].map((difficulty) => (
                            <Button
                                key={difficulty.value}
                                onClick={() => handleDifficultyFilter(difficulty.value)}
                                variant={selectedDifficulty === difficulty.value ? "default" : "outline"}
                                className={`rounded-full px-6 transition-all duration-300 ${selectedDifficulty === difficulty.value
                                    ? `bg-gradient-to-r ${difficulty.color} text-white border-0 shadow-lg hover:shadow-xl`
                                    : "hover:scale-105"
                                    }`}
                            >
                                {difficulty.label}
                            </Button>
                        ))}
                        {selectedDifficulty && (
                            <Button
                                onClick={() => handleDifficultyFilter(selectedDifficulty)}
                                variant="ghost"
                                className="text-gray-500 hover:text-gray-700"
                            >
                                クリア
                            </Button>
                        )}
                    </div>
                </motion.div>

                {/* Song Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {filteredSongs.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg">曲が見つかりませんでした</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredSongs.map((song, index) => (
                                <motion.div
                                    key={song.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                >
                                    <SongCard
                                        song={song}
                                        progress={getProgress(song.id)}
                                        onClick={() => handleSongClick(song.id)}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Footer Navigation */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex justify-center gap-4 pt-8"
                >
                    <Button
                        onClick={() => setPage("library")}
                        variant="outline"
                        className="rounded-full px-8 hover:scale-105 transition-transform"
                    >
                        📚 単語辞書
                    </Button>
                </motion.div>
            </div>
        </div>
    );
};
