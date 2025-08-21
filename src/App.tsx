import { useState } from "react";
import { Dashboard } from "./pages/Dashboard";
import { QuizPage } from "./pages/QuizPage";
import { LibraryPage } from "./pages/LibraryPage";
import { DungeonPage } from "./pages/DungeonPage";

function App() {
  const [currentPage, setCurrentPage] = useState<
    "dashboard" | "quiz" | "library" | "dungeon"
  >("dashboard");

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {currentPage === "dashboard" && <Dashboard setPage={setCurrentPage} />}
      {currentPage === "quiz" && <QuizPage setPage={setCurrentPage} />}
      {currentPage === "library" && <LibraryPage setPage={setCurrentPage} />}
      {currentPage === "dungeon" && <DungeonPage setPage={setCurrentPage} />}
    </div>
  );
}

export default App;
