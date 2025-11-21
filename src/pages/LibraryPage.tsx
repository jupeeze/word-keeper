import { LibraryGrid } from "../components/Library/LibraryGrid";
import { Button } from "@/components/ui/button";
import type { PageNavigationProps } from "@/types";
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export const LibraryPage = ({ setPage }: PageNavigationProps) => {
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

            <div className="relative max-w-7xl mx-auto p-6 space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-4"
                >
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={() => setPage("songList")}
                            variant="ghost"
                            size="sm"
                            className="glass-panel hover:bg-white/40 transition-all duration-300"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="text-center space-y-3">
                        <div className="flex items-center justify-center gap-3">
                            <BookOpen className="w-10 h-10 text-purple-600" />
                            <h1 className="text-5xl font-bold text-gradient-primary">
                                単語辞書
                            </h1>
                            <Sparkles className="w-10 h-10 text-pink-600" />
                        </div>
                        <p className="text-gray-600 text-lg">
                            学習した単語をコレクション
                        </p>
                    </div>
                </motion.div>

                {/* Library Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="glass-card rounded-3xl p-6"
                >
                    <LibraryGrid />
                </motion.div>

                {/* Bottom Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex justify-center gap-4"
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