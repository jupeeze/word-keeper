// src/App.tsx

import { useState, useEffect, useCallback } from "react";
import { Dashboard } from "./pages/Dashboard";
import { LyricSyncPlayer } from "./pages/LyricSyncPlayer";
import { LyricQuizPage } from "./pages/LyricQuizPage";
import { SpeedReadingTrainer } from "./pages/SpeedReadingTrainer";
import { LibraryPage } from "./pages/LibraryPage";
import type { PageName } from "@/types";

function App() {
  const [currentPage, setCurrentPage] = useState<PageName>("dashboard");

  useEffect(() => {
    console.log(`Current page: ${currentPage}`);
  }, [currentPage]);

  const setPage = useCallback((page: PageName) => {
    setCurrentPage(page);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {currentPage === "dashboard" && <Dashboard setPage={setPage} />}
      {currentPage === "lyricPlayer" && <LyricSyncPlayer setPage={setPage} />}
      {currentPage === "lyricQuiz" && <LyricQuizPage setPage={setPage} />}
      {currentPage === "speedReadingTrainer" && (
        <SpeedReadingTrainer setPage={setPage} />
      )}
      {currentPage === "library" && <LibraryPage setPage={setPage} />}
    </div>
  );
}

export default App;

