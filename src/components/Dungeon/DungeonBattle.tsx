import { Button } from "@/components/ui/button";
import { useDungeonStore } from "@/stores/dungeonStore";
import { useLibraryStore } from "@/stores/libraryStore";

export const DungeonBattle = () => {
  const {
    monster,
    challengeWord,
    choices,
    handleCorrectAnswer,
    handleIncorrectAnswer,
  } = useDungeonStore();
  const { collectedWords } = useLibraryStore();

  const handleAnswer = (selectedWord: string) => {
    if (selectedWord === challengeWord?.word) {
      handleCorrectAnswer(collectedWords);
    } else {
      handleIncorrectAnswer(challengeWord?.word ?? "");
    }
  };

  if (!monster || !challengeWord) return null;

  return (
    <div className="flex flex-col gap-4 bg-black/80 p-4 rounded-lg max-w-md mx-auto text-white">
      <div className="text-center">
        <h2 className="text-xl font-bold text-red-400">{monster.name}</h2>
        <p>
          HP: {monster.hp} / {monster.maxHp}
        </p>
        <progress
          value={monster.hp}
          max={monster.maxHp}
          className="w-full h-4 accent-red-500"
        ></progress>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold tracking-widest">
          {challengeWord.translation}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {choices.map((choice) => (
          <Button key={choice} onClick={() => handleAnswer(choice)}>
            {choice}
          </Button>
        ))}
      </div>
    </div>
  );
};
