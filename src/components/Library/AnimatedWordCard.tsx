import { motion } from "framer-motion";
import { PlayCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { SavedWord } from "@/types";

interface Props {
  data: SavedWord;
  onPlay: (word: SavedWord) => void;
  onDelete: (id: string) => void;
}

export const AnimatedWordCard = ({ data, onPlay, onDelete }: Props) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full flex flex-col justify-between overflow-hidden border-2 hover:border-blue-300 transition-colors">
        <CardContent className="p-4 pt-6 text-center">
          {/* 単語と意味 */}
          <h3 className="text-2xl font-bold mb-1">{data.word}</h3>
          <p className="text-xs text-gray-400 mb-2">{data.pronunciation}</p>
          <p className="text-sm font-medium text-gray-600 mb-4">
            {data.meaning}
          </p>

          {/* 文脈（曲名） */}
          <div className="text-xs text-gray-400 bg-gray-50 p-2 rounded-md truncate">
            <span className="block font-semibold text-gray-500">SOURCE:</span>
            {data.context.songTitle}
          </div>
        </CardContent>

        <CardFooter className="p-2 bg-gray-50 flex gap-2 justify-center">
          {/* 再生ボタン */}
          <Button
            variant="default"
            size="sm"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
            onClick={() => onPlay(data)}
          >
            <PlayCircle size={16} />
            再生
          </Button>

          {/* 削除ボタン（オプション） */}
          <Button
            variant="ghost"
            size="icon"
            className="text-red-400 hover:text-red-600 hover:bg-red-50"
            onClick={() => onDelete(data.id)}
          >
            <Trash2 size={16} />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};