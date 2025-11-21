// src/App.tsx

import { useState, useEffect, useCallback } from "react";
import { Dashboard } from "./pages/Dashboard";
import { LyricSyncPlayer } from "./pages/LyricSyncPlayer";
import { LibraryPage } from "./pages/LibraryPage";
import { LyricProgressPage } from "./pages/LyricProgressPage";
import { SongListPage } from "./pages/SongListPage";
import type { PageName } from "@/types";

function App() {
  const [currentPage, setCurrentPage] = useState<PageName>("songList");
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);

  useEffect(() => {
    console.log(`Current page: ${currentPage}, Song ID: ${currentSongId}`);
  }, [currentPage, currentSongId]);

  const setPage = useCallback((page: PageName, songId?: string) => {
    setCurrentPage(page);
    if (songId) {
      setCurrentSongId(songId);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {currentPage === "songList" && <SongListPage setPage={setPage} />}
      {currentPage === "dashboard" && <Dashboard setPage={setPage} />}
      {currentPage === "lyricPlayer" && (
        <LyricSyncPlayer setPage={setPage} currentSongId={currentSongId || undefined} />
      )}
      {currentPage === "library" && <LibraryPage setPage={setPage} />}
      {currentPage === "lyricProgress" && (
        <LyricProgressPage setPage={setPage} currentSongId={currentSongId || undefined} />
      )}
    </div>
  );
}

export default App;

