import { LibraryGrid } from "../components/Library/LibraryGrid";
import { Button } from "@/components/ui/button";
import type { PageNavigationProps } from "@/types";

export const LibraryPage = ({ setPage }: PageNavigationProps) => {
    return (
        <div className="p-4 flex flex-col gap-4">
            <h2 className="text-xl font-bold">図鑑</h2>
            <LibraryGrid />
            <Button onClick={() => setPage("songList")} variant="secondary">
                戻る
            </Button>
        </div>
    );
};