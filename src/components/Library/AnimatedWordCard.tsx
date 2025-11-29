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
      <Card className="glass-card hover:shadow-glow group flex h-full flex-col justify-between overflow-hidden border-0 shadow-lg transition-all duration-300">
        {/* Gradient accent bar */}
        <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500" />

        <CardContent className="flex-1 p-4 pt-6 text-center">
          {/* 単語と意味 */}
          <h3 className="text-gradient-primary mb-1 text-2xl font-bold transition-transform group-hover:scale-110">
            {data.word}
          </h3>
          <p className="mb-2 text-xs text-gray-500">{data.pronunciation}</p>
          <p className="mb-4 text-sm font-medium text-gray-700">
            {data.meaning}
          </p>

          {/* 文脈(曲名) */}
          <div className="glass-panel rounded-lg p-2 text-xs text-gray-500">
            <span className="mb-1 block font-semibold text-purple-600">
              SOURCE:
            </span>
            <span className="block truncate">{firstContext.songTitle}</span>
            {contextCount > 1 && (
              <div className="mt-2 flex items-center justify-center gap-1 font-semibold text-pink-600">
                <MapPin className="h-3 w-3" />
                <span>+{contextCount - 1}箇所で使用</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-center gap-2 bg-gradient-to-r from-purple-50/50 to-pink-50/50 p-2">
          {/* 再生ボタン */}
          <Button
            variant="default"
            size="sm"
            className="flex-1 gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md transition-all duration-300 hover:from-purple-700 hover:to-pink-700 hover:shadow-lg"
            onClick={() => onPlay(data)}
          >
            <PlayCircle size={16} />
            再生
          </Button>

          {/* 削除ボタン */}
          <Button
            variant="ghost"
            size="icon"
            className="text-red-400 transition-all duration-300 hover:bg-red-50 hover:text-red-600"
            onClick={() => onDelete(data.id)}
          >
            <Trash2 size={16} />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
