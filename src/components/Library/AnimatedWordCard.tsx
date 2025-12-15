import { Card } from "@/components/ui/card";
import type { SavedWord } from "@/types";

interface Props {
  data: SavedWord;
  onPlay: (word: SavedWord) => void;
}

export const AnimatedWordCard = ({ data, onPlay }: Props) => {
  return (
    <Card className="p-2" onClick={() => onPlay(data)}>
      <div className="text-center">
        <p className="text-xs text-gray-500">{data.pronunciation}</p>
        <p className="mb-2 text-2xl font-bold">{data.word}</p>
        <p className="text-sm">{data.meaning}</p>
      </div>
    </Card>
  );
};
