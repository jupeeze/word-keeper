// src/App.tsx

import { useState } from "react";
import { Dashboard } from "./pages/Dashboard";
import { QuizPage } from "./pages/QuizPage";
import { LibraryPage } from "./pages/LibraryPage";
import { DungeonPage } from "./pages/DungeonPage";
import { LyricSyncPlayer } from "./pages/LyricSyncPlayer";

export type PageName =
  | "dashboard"
  | "quiz"
  | "library"
  | "dungeon"
  | "lyricPlayer";

function App() {
  const [currentPage, setCurrentPage] = useState<PageName>("dashboard");

  const setPage = (page: PageName) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {currentPage === "dashboard" && <Dashboard setPage={setPage} />}
      {currentPage === "quiz" && <QuizPage setPage={setPage} />}
      {currentPage === "library" && <LibraryPage setPage={setPage} />}
      {currentPage === "dungeon" && <DungeonPage setPage={setPage} />}
      {currentPage === "lyricPlayer" && <LyricSyncPlayer setPage={setPage} />}
    </div>
  );
}

export default App;
