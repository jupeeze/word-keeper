import { Button } from "@/components/ui/button";
import { useDungeonStore } from "@/stores/dungeonStore";
import { useLibraryStore } from "@/stores/libraryStore";

export const DungeonBattle = () => {
  const { monster, challengeWord, dealDamage, handleIncorrectAnswer } =
    useDungeonStore();
  const { collectedWords } = useLibraryStore();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.word.value;
    if (input.toLowerCase() === challengeWord.toLowerCase()) {
      // 正解すれば20ダメージ
      dealDamage(20);
      // 新しい単語をセット
      useDungeonStore
        .getState()
        .setChallengeWord(
          collectedWords[Math.floor(Math.random() * collectedWords.length)]
        );
      e.currentTarget.word.value = "";
    } else {
      handleIncorrectAnswer(challengeWord);
    }
  };

  if (!monster) return null;

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
        <p className="text-2xl font-bold tracking-widest">{challengeWord}</p>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          name="word"
          className="w-full rounded p-2 text-black"
          placeholder="スペルを詠唱！"
        />
        <Button type="submit">攻撃</Button>
      </form>
    </div>
  );
};
