import { LibraryGrid } from "../components/Library/LibraryGrid";
import { Button } from "@/components/ui/button";

import type { PageName } from "../App";

type Props = { setPage: (page: PageName) => void };

export const LibraryPage = ({ setPage }: Props) => {
  return (
    <div className="p-4 flex flex-col gap-4">
      <h2 className="text-xl font-bold">ワーズ・グリモワール</h2>
      <p className="text-center">正しく詠唱できたスペルがここに記録される。</p>
      <LibraryGrid />
      <Button onClick={() => setPage("dashboard")} variant="secondary">
        書斎に戻る
      </Button>
    </div>
  );
};
