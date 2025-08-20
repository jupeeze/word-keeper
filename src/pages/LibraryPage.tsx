import { LibraryGrid } from "../components/Library/LibraryGrid";
import { Button } from "@/components/ui/button";

type Props = { setPage: (page: "quiz" | "library" | "dashboard") => void };

export const LibraryPage = ({ setPage }: Props) => {
  return (
    <div className="p-4 flex flex-col gap-4">
      <h2 className="text-xl font-bold">図鑑</h2>
      <LibraryGrid />
      <Button onClick={() => setPage("dashboard")} variant="secondary">
        戻る
      </Button>
    </div>
  );
};
