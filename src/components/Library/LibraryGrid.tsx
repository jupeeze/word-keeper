import { useLibraryStore } from "../../stores/libraryStore";
import { Card, CardContent } from "@/components/ui/card";

export const LibraryGrid = () => {
  const { collectedWords } = useLibraryStore();
  const allWords = ["apple", "book", "desk", "pen", "note"];

  return (
    <div className="grid grid-cols-3 gap-4">
      {allWords.map((word) => (
        <Card
          key={word}
          className={
            collectedWords.includes(word) ? "bg-yellow-200" : "bg-gray-300"
          }
        >
          <CardContent className="text-center">
            {collectedWords.includes(word) ? word : "???"}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
