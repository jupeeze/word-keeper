import { LibraryGrid } from "../components/Library/LibraryGrid";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export const LibraryPage = () => {
  const navigate = useNavigate();
  return (
    <div className="gradient-primary relative min-h-screen overflow-hidden">
      {/* Animated Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -left-1/4 h-1/2 w-1/2 rounded-full bg-gradient-to-br from-purple-300/30 to-pink-300/30 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -right-1/4 -bottom-1/4 h-1/2 w-1/2 rounded-full bg-gradient-to-tl from-blue-300/30 to-purple-300/30 blur-3xl"
        />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-8 p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              size="sm"
              className="glass-panel transition-all duration-300 hover:bg-white/40"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3 text-center">
            <div className="flex items-center justify-center gap-3">
              <BookOpen className="h-10 w-10 text-purple-600" />
              <h1 className="text-gradient-primary text-5xl font-bold">
                単語辞書
              </h1>
              <Sparkles className="h-10 w-10 text-pink-600" />
            </div>
            <p className="text-lg text-gray-600">学習した単語をコレクション</p>
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
            onClick={() => navigate("/")}
            variant="outline"
            className="glass-panel rounded-full px-8 transition-all duration-300 hover:scale-105 hover:bg-white/40"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            曲一覧に戻る
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
