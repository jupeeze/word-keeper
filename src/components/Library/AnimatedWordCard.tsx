import { motion } from "framer-motion";
import { PlayCircle, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { SavedWord } from "@/types";

interface Props {
  data: SavedWord;
  onPlay: (word: SavedWord) => void;
  onDelete: (id: string) => void;
}

export const AnimatedWordCard = ({ data, onPlay, onDelete }: Props) => {
  const contextCount = data.contexts.length;
  const firstContext = data.contexts[0];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
    >
      <Card className="h-full flex flex-col justify-between overflow-hidden glass-card border-0 shadow-lg hover:shadow-glow transition-all duration-300 group">
        {/* Gradient accent bar */}
        <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500" />

        <CardContent className="p-4 pt-6 text-center flex-1">
          {/* 単語と意味 */}
          <h3 className="text-2xl font-bold mb-1 text-gradient-primary group-hover:scale-110 transition-transform">
            {data.word}
          </h3>
          <p className="text-xs text-gray-500 mb-2">{data.pronunciation}</p>
          <p className="text-sm font-medium text-gray-700 mb-4">
            {data.meaning}
          </p>

          {/* 文脈(曲名) */}
          <div className="text-xs text-gray-500 glass-panel p-2 rounded-lg">
            <span className="block font-semibold text-purple-600 mb-1">SOURCE:</span>
            <span className="truncate block">{firstContext.songTitle}</span>
            {contextCount > 1 && (
              <div className="mt-2 flex items-center justify-center gap-1 text-pink-600 font-semibold">
                <MapPin className="w-3 h-3" />
                <span>+{contextCount - 1}箇所で使用</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-2 bg-gradient-to-r from-purple-50/50 to-pink-50/50 flex gap-2 justify-center">
          {/* 再生ボタン */}
          <Button
            variant="default"
            size="sm"
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white gap-2 shadow-md hover:shadow-lg transition-all duration-300"
            onClick={() => onPlay(data)}
          >
            <PlayCircle size={16} />
            再生
          </Button>

          {/* 削除ボタン */}
          <Button
            variant="ghost"
            size="icon"
            className="text-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-300"
            onClick={() => onDelete(data.id)}
          >
            <Trash2 size={16} />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};