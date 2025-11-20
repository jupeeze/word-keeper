// src/App.tsx

import { useState, useEffect } from "react";
import { Dashboard } from "./pages/Dashboard";
import { LyricSyncPlayer } from "./pages/LyricSyncPlayer";
import { LyricQuizPage } from "./pages/LyricQuizPage";
import { SpeedReadingTrainer } from "./pages/SpeedReadingTrainer";
import { LibraryPage } from "./pages/LibraryPage";

export type PageName =
  | "dashboard"
  | "quiz"
  | "library"
  | "dungeon"
  | "lyricPlayer"
  | "lyricQuiz"
  | "speedReadingTrainer";

function App() {
  const [currentPage, setCurrentPage] = useState<PageName>("dashboard");

  useEffect(() => {
    console.log(`Current page: ${currentPage}`);
  }, [currentPage]);

  const setPage = (page: PageName) => {
    setCurrentPage(page);
  };

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
