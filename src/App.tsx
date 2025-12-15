// src/App.tsx

import { useState, useCallback } from "react";
import { LyricSyncPlayer } from "./pages/LyricSyncPlayer";
import { LibraryPage } from "./pages/LibraryPage";
import { LyricProgressPage } from "./pages/LyricProgressPage";
import { SongListPage } from "./pages/SongListPage";
import { Toaster } from "./components/ui/toaster";
import type { PageName } from "@/types";

function App() {
  const [currentPage, setCurrentPage] = useState<PageName>("songList");
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);

  const setPage = useCallback((page: PageName, songId?: string) => {
    setCurrentPage(page);
    if (songId) {
      setCurrentSongId(songId);
    }
  }, []);

  return (
    <div className="min-h-screen bg-pink-50 p-2">
      {currentPage === "songList" && <SongListPage setPage={setPage} />}
      {currentPage === "lyricPlayer" && (
        <LyricSyncPlayer
          setPage={setPage}
          currentSongId={currentSongId || undefined}
        />
      )}
      {currentPage === "library" && <LibraryPage setPage={setPage} />}
      {currentPage === "lyricProgress" && (
        <LyricProgressPage
          setPage={setPage}
          currentSongId={currentSongId || undefined}
        />
      )}
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
